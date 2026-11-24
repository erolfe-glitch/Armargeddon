// Paket A3 (2026-11-24): Aufnahmen des Info-Fensters mit „Aus den Chroniken“ (Löwenoger, Eisenknecht) bei 1920 px nach entwurf/probe/chronik/.
// Lädt index.html als Datei im unsichtbaren Chrome, startet eine Partie, gibt einer eigenen Einheit zur Probe den gewünschten Typ und öffnet das Info-Fenster.
// Aufruf: node tools/chronik_bilder.mjs [typ …]   (vorher python tools/build.py)
import { spawn } from 'node:child_process'; import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os'; import { join, dirname } from 'node:path'; import { fileURLToPath, pathToFileURL } from 'node:url';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..'), AUS = join(ROOT, 'entwurf', 'probe', 'chronik'), URL_ = process.env.URL || pathToFileURL(join(ROOT, 'index.html')).href;
mkdirSync(AUS, { recursive: true }); const TYPEN = process.argv.slice(2).length ? process.argv.slice(2) : ['oger', 'knecht'];
const sleep = ms => new Promise(r => setTimeout(r, ms)), port = 9500 + Math.floor(Math.random() * 300);
const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'armchr-'))}`, '--no-first-run', '--mute-audio', '--allow-file-access-from-files', '--window-size=1920,1080', 'about:blank']);
let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {}, fehler = [];
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; return; } if (m.method === 'Runtime.exceptionThrown') fehler.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); };
const cmd = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async x => { const r = await cmd('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true, userGesture: true }); if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text); return r.result?.result?.value; };
try {
  await cmd('Runtime.enable'); await cmd('Page.enable'); await cmd('Page.addScriptToEvaluateOnNewDocument', { source: "try{localStorage.setItem('arm.ton','0')}catch(e){}" });
  await cmd('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
  await cmd('Page.navigate', { url: URL_ }); await sleep(6000);
  await ev(`(async () => { const W = ms => new Promise(r => setTimeout(r, ms)), click = t => { const b = [...document.querySelectorAll('button')].find(b => b.offsetParent && b.textContent.trim().toLowerCase().includes(t)); if (b) b.click(); return !!b; };
    click('neue schlacht'); await W(700); for (const t of ['weiter', 'weiter', 'die schlacht']) { click(t); await W(700); } await W(2500); click('schlacht beginnen'); await W(3500); })()`);
  for (const t of TYPEN) {
    const ok = await ev(`(async () => { const G = __dbg.G, T = __dbg.E.TYPES['${t}'], u = G.units.find(x => __dbg.E.alive(x) && x.side === T.side) || G.units.find(x => __dbg.E.alive(x)); if (!u) return false; u.type = '${t}'; u.side = T.side;
      __dbg.select(u.id); await new Promise(r => setTimeout(r, 400)); document.getElementById('btnInfo').click(); await new Promise(r => setTimeout(r, 900)); return !!document.getElementById('detReal').textContent; })()`);
    const r = await cmd('Page.captureScreenshot', { format: 'jpeg', quality: 88 }); writeFileSync(join(AUS, `info_${t}_1920.jpg`), Buffer.from(r.result.data, 'base64'));
    console.log(`  ${t}: ${ok ? 'Text da' : 'FEHLT'} → entwurf/probe/chronik/info_${t}_1920.jpg`);
    await ev(`(() => { const x = [...document.querySelectorAll('#detail button, .det button')].find(b => /schließen|✕|×/i.test(b.textContent)); if (x) x.click(); document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })); return true; })()`); await sleep(400);
  }
  console.log(fehler.length ? 'Fehler: ' + fehler.slice(0, 3).join(' | ') : 'keine Fehler in der Konsole');
} finally { ws.close(); ch.kill(); }
