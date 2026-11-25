// U2-Bilder (2026-11-25): Klone und Grabenplätze vorher/nachher, mit Einheiten. Vorschau-Server auf 127.0.0.1:8765.
// Aufruf: node tools/u2_bilder.mjs   → entwurf/probe/u2/<karte>_<variante>_<ziel>.jpg
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const OUT = process.env.OUT || 'entwurf/probe/u2', sleep = ms => new Promise(r => setTimeout(r, ms)), port = 9500 + Math.floor(Math.random() * 300);
mkdirSync(OUT, { recursive: true });
const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'armu2-'))}`, '--no-first-run', '--mute-audio', '--disable-background-timer-throttling', '--disable-renderer-backgrounding', 'about:blank'], { stdio: 'ignore' });
let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {}, fehler = []; ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; return; } if (m.method === 'Runtime.exceptionThrown') fehler.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') fehler.push(m.params.args.map(a => a.value ?? a.description).join(' ').slice(0, 200)); };
const cmd = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async x => { const r = await cmd('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text); return r.result?.result?.value; };
await cmd('Runtime.enable'); await cmd('Page.enable'); await cmd('Page.addScriptToEvaluateOnNewDocument', { source: "try{localStorage.setItem('arm.ton','0')}catch(e){}" });
await cmd('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
const bild = async n => { const r = await cmd('Page.captureScreenshot', { format: 'jpeg', quality: 88 }); writeFileSync(join(OUT, n + '.jpg'), Buffer.from(r.result.data, 'base64')); };
const hell = () => ev("(() => { const c = document.getElementById('map'), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let s = 0, n = 0; for (let i = 0; i < d.length; i += 4 * 997) { s += d[i] + d[i + 1] + d[i + 2]; n++; } return s / n / 3; })()");
// Ziele: [Name, Feld c, r, Zoom]
const KARTEN = {
  grauwall: { ziele: [['graben', 2, 5, 2.4], ['graben_weit', 2, 5, 1.3]] },
  sanktruss: { ziele: [['feld', null, null, 2.2]] },
};
const VAR = process.env.U2B ? { vorher: 'window.ZICKZACK_ALT = true', nachher: '' } : { vorher: 'window.KLONE_ALT = true; window.GRABENPLATZ_ALT = true', nachher: '' };
for (const [karte, K] of Object.entries(KARTEN)) for (const [v, js] of Object.entries(VAR)) {
  await cmd('Page.navigate', { url: 'http://127.0.0.1:8765/index.html' }); await sleep(5000);
  await ev(`(async () => { const W = ms => new Promise(r => setTimeout(r, ms)), click = t => { const b = [...document.querySelectorAll('button')].find(b => b.offsetParent && b.textContent.trim().toLowerCase().includes(t)); if (b) b.click(); return !!b; };
    click('neue schlacht'); await W(700); const rb = document.querySelector('input[name=map][value=${karte}]'); if (rb) { rb.click(); rb.dispatchEvent(new Event('change', { bubbles: true })); await W(400); }
    for (const t of ['weiter', 'weiter', 'die schlacht']) { click(t); await W(700); } await W(2500); click('schlacht beginnen'); await W(4000); return true; })()`);
  if (js) await ev(`(() => { ${js}; __dbg.renderTerrain(); return true; })()`);
  await sleep(2500); for (let i = 0; i < 40 && (await hell()) < 12; i++) await sleep(500);
  for (const [n, c0, r0, z] of K.ziele) {
    let c = c0, r = r0; if (c == null) { const u = JSON.parse(await ev(`JSON.stringify((() => { const u = __dbg.G.units.find(u => u.type === 'kohorte' && u.status !== 'dead') || __dbg.G.units[0]; return [u.c, u.r]; })())`)); [c, r] = u; }
    const m = await ev(`__dbg.mitte(${c}, ${r})`); await ev(`(() => { __dbg.camSetzen(${m[0]}, ${m[1]} - 40, ${z}); return true; })()`); await sleep(1500); await bild(`${karte}_${v}_${n}`);
  }
  console.log(karte, v, 'ok');
}
console.log(fehler.length ? 'Fehler: ' + [...new Set(fehler)].slice(0, 5).join(' | ') : 'keine Seitenfehler'); ws.close(); ch.kill(); process.exit(0);
