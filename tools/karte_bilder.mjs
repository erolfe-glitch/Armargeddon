// Aufnahmen einer Karte im unsichtbaren Chrome (2026-11-22): Übersicht (ganz heraus) und nah an der ersten eigenen Einheit im Wald.
// Aufruf: node tools/karte_bilder.mjs <karte> [ordner=entwurf/probe/<karte>]   (Vorschau-Server auf 127.0.0.1:8765)
// Paket C (2026-11-24): URL=… andere Seite (z. B. alter Stand), ORTE="name:c,r:zoom;…" weitere Ausschnitte (Feldmitte über __dbg.mitte), NAH=0 ohne Waldbild
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const KARTE = process.argv[2] || 'winterdorf', OUT = process.argv[3] || `entwurf/probe/${KARTE}`;
mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms)), port = 9500 + Math.floor(Math.random() * 300);
const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', ...(process.env.OHNE_GPU ? ['--disable-gpu', '--use-angle=swiftshader'] : []), `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'armkarte-'))}`, '--no-first-run', '--mute-audio', '--window-size=1920,1080', 'about:blank'], { stdio: 'ignore' });
let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {}, fehler = [];
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; return; } if (m.method === 'Runtime.exceptionThrown') fehler.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); };
const cmd = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async x => { const r = await cmd('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true }); return r.result?.exceptionDetails ? 'ERR ' + (r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text) : r.result?.result?.value; };
const bild = async name => { const r = await cmd('Page.captureScreenshot', { format: 'jpeg', quality: 88 }); writeFileSync(join(OUT, name + '.jpg'), Buffer.from(r.result.data, 'base64')); };
await cmd('Runtime.enable'); await cmd('Page.enable');
await cmd('Page.addScriptToEvaluateOnNewDocument', { source: "try{localStorage.setItem('arm.ton','0')}catch(e){}" });
await cmd('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
if (process.env.INIT) await cmd('Page.addScriptToEvaluateOnNewDocument', { source: process.env.INIT });   // z. B. INIT="window.NOSCHNEEKANTE=true" (Vergleich einzelner Schichten)
await cmd('Page.navigate', { url: process.env.URL || 'http://127.0.0.1:8765/index.html' }); await sleep(5000);
await ev(`(async () => { const W = ms => new Promise(r => setTimeout(r, ms)); const click = t => { const b = [...document.querySelectorAll('button')].find(b => b.offsetParent && b.textContent.trim().toLowerCase().includes(t)); if (b) b.click(); return !!b; };
  click('neue schlacht'); await W(700); const rb = document.querySelector('input[name=map][value=${KARTE}]'); if (rb) { rb.click(); rb.dispatchEvent(new Event('change', { bubbles: true })); await W(600); }
  for (const t of ['weiter', 'weiter', 'die schlacht']) { click(t); await W(700); } await W(2500); click('schlacht beginnen'); await W(4000); })()`);
console.log(await ev(`(async () => { const W = ms => new Promise(r => setTimeout(r, ms)), D = __dbg; D.camSetzen(D.CAM.x, D.CAM.y, D.ZFIT); await W(1500); return D.G && D.E.MAP.id; })()`));
await bild('uebersicht');
console.log(await ev(`(async () => { const W = ms => new Promise(r => setTimeout(r, ms)), D = __dbg, G = D.G, E = D.E;
  const u = G.units.find(x => x.side === 'A' && ['forest', 'wald'].includes(G.map[x.c][x.r].t)) || G.units.find(x => x.side === 'A');
  D.pick(u.id); const d = D.du(u.id); D.camSetzen(d.x, d.y - 60, 1.4); await W(300); return u.type + ' ' + u.c + ',' + u.r + ' ' + G.map[u.c][u.r].t; })()`));
await sleep(1200); await bild('nah_wald');
for (const o of (process.env.ORTE || '').split(';').filter(Boolean)) { const [name, cr, z] = o.split(':'); const [c, r] = cr.split(',').map(Number);
  await ev(`(async () => { const D = __dbg; D.pick && D.pick(null); const [x, y] = D.mitte(${c}, ${r}); D.camSetzen(x, y, ${+z || 1.4}); await new Promise(r => setTimeout(r, 400)); return true; })()`); await sleep(1500); await bild(name); console.log('  Bild', name); }
console.log(fehler.length ? 'Fehler: ' + fehler.join(' | ') : 'keine Seitenfehler');
ws.close(); ch.kill();
