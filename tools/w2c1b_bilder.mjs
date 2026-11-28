import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const OUT = process.argv[2] || 'entwurf/probe/w2c1b/nachher'; mkdirSync(OUT, { recursive: true });
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
// W2c-1b (Punkt 151): Einheit im Offenen und im Graben, daneben ein Liniensoldat derselben Seite. TYPEN="typ:seite,…"
const LINIE = { A: 'kohorte', D: 'grenadier' };
const stelle = (typ, seite, graben) => ev(`(async () => { const D = __dbg, G = D.G, E = D.E, M = G.map; let c = 6, r = 4, c2 = 6, r2 = 5;
  const T = (x, y) => M[x] && M[x][y] && M[x][y].t === 'trench';
  if (${graben} === 1) { outer: for (let x = 2; x < E.COLS - 2; x++) for (let y = 1; y < E.ROWS - 1; y++) if (T(x, y) && T(x, y + 1)) { c = x; r = y; c2 = x; r2 = y + 1; break outer; } }   // Graben in die Tiefe
  if (${graben} === 2) { outer2: for (let x = 2; x < E.COLS - 2; x++) for (let y = 1; y < E.ROWS - 1; y++) if (T(x, y) && T(x + 1, y) && T(x - 1, y) && !T(x, y + 1) && !T(x, y - 1)) { c = x; r = y; c2 = x + 1; r2 = y; break outer2; } }   // Graben quer (G8)
  const S = G.units.filter(u => u.side === '${seite}' && E.alive(u)), a = S[0], b = S.find(u => u !== a);
  a.type = '${typ}'; a.c = c; a.r = r; a.face = '${seite}' === 'A' ? 0 : 3; a.str = 10; a.setup = !!E.TYPES[a.type].mg; a.limbered = false;
  b.type = '${LINIE[seite]}'; b.c = c2; b.r = r2; b.face = a.face; b.str = 10; b.dug = false;
  for (const u of G.units) if (u !== a && u !== b && Math.abs(u.c - c) < 3.5 && Math.abs(u.r - r) < 3.5) { u.c = u.side === 'A' ? 0 : E.COLS - 1; }
  D.neuDU(); await new Promise(r => setTimeout(r, 900)); const [x, y] = D.mitte(c, r + 0.5); D.camSetzen(x, y - 40, 2.6); await new Promise(r => setTimeout(r, 1800)); return a.id; })()`);
const TYPEN = (process.env.TYPEN || 'mahlwerk:A,sense:D,buechse:D,moerser:A,minenwerfer:D,flammen:A').split(',').map(t => t.split(':'));
const LAGEN = (process.env.LAGEN || '0,1').split(',').map(Number), LNAME = ['offen', 'graben', 'graben_quer'];
for (const [typ, seite] of TYPEN) for (const g of LAGEN) { await stelle(typ, seite, g); await bild(`${typ}_${LNAME[g]}`); }
console.log(fehler.length ? 'Fehler: ' + fehler.slice(0, 3).join(' | ') : 'keine Seitenfehler');
ws.close(); ch.kill();
