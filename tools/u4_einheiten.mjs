// U4 Teil 2 (Punkt 120.3, 2026-11-27): neue Bögen im Spiel – je Einheit Ruhe und Schuss bzw. Fähigkeit; Aufruf: node tools/u4_einheiten.mjs [ordner]
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const OUT = process.argv[2] || 'entwurf/probe/u4/einheiten'; mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms)), port = 9500 + Math.floor(Math.random() * 300);
const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'armfx-'))}`, '--no-first-run', '--mute-audio', '--window-size=1920,1080', 'about:blank']);
let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {}, fehler = [];
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; return; } if (m.method === 'Runtime.exceptionThrown') fehler.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); };
const cmd = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async x => { const r = await cmd('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text); return r.result?.result?.value; };
const bild = async name => { const r = await cmd('Page.captureScreenshot', { format: 'jpeg', quality: 88 }); writeFileSync(join(OUT, name + '.jpg'), Buffer.from(r.result.data, 'base64')); console.log('  Bild', name); };
await cmd('Runtime.enable'); await cmd('Page.enable'); await cmd('Page.addScriptToEvaluateOnNewDocument', { source: "try{localStorage.setItem('arm.ton','0')}catch(e){}" });
await cmd('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
if (process.env.INIT) await cmd('Page.addScriptToEvaluateOnNewDocument', { source: process.env.INIT });
await cmd('Page.navigate', { url: process.env.URL || 'http://127.0.0.1:8765/index.html' }); await sleep(5000);
await ev(`(async () => { const W = ms => new Promise(r => setTimeout(r, ms)), click = t => { const b = [...document.querySelectorAll('button')].find(b => b.offsetParent && b.textContent.trim().toLowerCase().includes(t)); if (b) b.click(); return !!b; };
  click('neue schlacht'); await W(700); for (const t of ['weiter', 'weiter', 'die schlacht']) { click(t); await W(700); } await W(2500); click('schlacht beginnen'); await W(4000); return true; })()`);
// Bühne je Einheitentyp: Figur auf (6,4), Gegner auf (8,4); Bild in Ruhe und mit Schuss-/Nahkampfpose
const stelle = (typ, seite) => ev(`(async () => { const D = __dbg, G = D.G, E = D.E; const S = G.units.filter(u => u.side === '${seite}' && E.alive(u)), a = S[0];
  a.type = '${typ}'; a.c = 6; a.r = 4; a.face = '${seite}' === 'A' ? 0 : 3; a.str = 10; a.mg = false;
  for (const u of G.units) if (u !== a && Math.abs(u.c - 6) < 2.5 && Math.abs(u.r - 4) < 2.5) u.c = u.side === 'A' ? 0 : 15;
  D.neuDU(); await new Promise(r => setTimeout(r, 900)); const [x, y] = D.mitte(6, 4); D.camSetzen(x, y - 40, 2.8); await new Promise(r => setTimeout(r, 1800)); return a.id; })()`);
for (const [typ, seite] of [['feldscher', 'A'], ['flammen', 'A'], ['brand', 'D'], ['gasschutz', 'D'], ['panzerk', 'D'], ['orden', 'A']]) {
  const id = await stelle(typ, seite); await bild(`${typ}_ruhe`);
  await ev(`(async () => { __dbg.pose(${id}, 'anlegen', 2500); await new Promise(r => setTimeout(r, 500)); return true; })()`); await bild(`${typ}_pose`);
  await sleep(2200);
}
console.log(fehler.length ? 'Fehler: ' + fehler.slice(0, 3).join(' | ') : 'keine Seitenfehler');
ws.close(); ch.kill();
