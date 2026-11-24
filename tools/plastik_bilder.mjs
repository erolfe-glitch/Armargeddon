// Paket P, Punkt 27 (2026-11-24): Plastik-Probe – gleicher Ausschnitt mit Bildwirkung aus (0) / stark (2) / sehr stark (3, nur Probe über __dbg.bild(3)).
// Je Stufe: Bild nach entwurf/probe/plastik/<name>_<stufe>.jpg, Umschaltzeit (erstes Bild nach dem Umschalten) und Bildzeiten über 3 s.
// Aufruf: node tools/plastik_bilder.mjs   (Vorschau-Server auf 127.0.0.1:8765)
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const OUT = 'entwurf/probe/plastik'; mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms)), port = 9500 + Math.floor(Math.random() * 300);
const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'armplastik-'))}`, '--no-first-run', '--mute-audio', '--window-size=1920,1080', 'about:blank']);
let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {}, fehler = [];
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; return; } if (m.method === 'Runtime.exceptionThrown') fehler.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); };
const cmd = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async x => { const r = await cmd('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text); return r.result?.result?.value; };
const bild = async name => { const r = await cmd('Page.captureScreenshot', { format: 'jpeg', quality: 90 }); writeFileSync(join(OUT, name + '.jpg'), Buffer.from(r.result.data, 'base64')); };
await cmd('Runtime.enable'); await cmd('Page.enable'); await cmd('Page.addScriptToEvaluateOnNewDocument', { source: "try{localStorage.setItem('arm.ton','0')}catch(e){}" });
await cmd('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
const ergebnis = [];
for (const [karte, name, c, r, z, stahl] of [['winterdorf', 'a_kraehenfurt', 4, 5, 1.25], ['sanktruss', 'b_sankt_russ', 8, 4, 1.15], ['grauwall', 'c_stahlgaenger', 0, 0, 2.6, true]]) {
  await cmd('Page.navigate', { url: 'http://127.0.0.1:8765/index.html' }); await sleep(5000);
  await ev(`(async () => { const W = ms => new Promise(r => setTimeout(r, ms)), click = t => { const b = [...document.querySelectorAll('button')].find(b => b.offsetParent && b.textContent.trim().toLowerCase().includes(t)); if (b) b.click(); return !!b; };
    click('neue schlacht'); await W(700); const rb = document.querySelector('input[name=map][value=${karte}]'); if (rb) { rb.click(); rb.dispatchEvent(new Event('change', { bubbles: true })); await W(600); }
    for (const t of ['weiter', 'weiter', 'die schlacht']) { click(t); await W(700); } await W(2500); click('schlacht beginnen'); await W(4000); return true; })()`);
  await ev(`(async () => { const D = __dbg, G = D.G; let x, y; if (${!!stahl}) { const u = G.units.find(q => q.side === 'A' && D.E.TYPES[q.type].cls === 'inf' && q.type !== 'feldscher'); u.type = 'stahl'; D.neuDU && D.neuDU(); await new Promise(r => setTimeout(r, 800)); const d = D.du(u.id); x = d.x; y = d.y - 30; }
    else [x, y] = D.mitte(${c}, ${r}); D.camSetzen(x, y, ${z}); await new Promise(r => setTimeout(r, 1500)); return true; })()`);
  for (const stufe of [0, 2, 3]) {
    const m = JSON.parse(await ev(`(async () => { const ft = []; let l = performance.now(), on = true; const t0 = l; let erstes = 0;
      (function f() { const n = performance.now(); if (!erstes && ft.length === 1) erstes = n - t0; ft.push(n - l); l = n; if (on) requestAnimationFrame(f); })();
      __dbg.bild(${stufe}); const t1 = performance.now() - t0; await new Promise(r => setTimeout(r, 3000)); on = false;
      const a = ft.slice(5).sort((p, q) => p - q), n = a.length; return JSON.stringify({ umschalten_ms: Math.round(t1), erstes_bild_ms: Math.round(ft.slice(0, 5).reduce((m, v) => Math.max(m, v), 0)), ms_mittel: +(a.reduce((p, c) => p + c, 0) / n).toFixed(1), ms_95: +a[Math.floor(n * 0.95)].toFixed(1) }); })()`));
    await sleep(800); await bild(`${name}_${['aus', '', 'stark', 'sehr_stark'][stufe]}`); ergebnis.push({ karte: name, stufe, ...m }); console.log(name, stufe, JSON.stringify(m));
  }
}
console.log(fehler.length ? 'Fehler: ' + fehler.join(' | ') : 'keine Seitenfehler');
writeFileSync(join(OUT, 'messung.json'), JSON.stringify(ergebnis, null, 1));
ws.close(); ch.kill();
