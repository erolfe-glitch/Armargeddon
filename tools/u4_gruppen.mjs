// U4 Teil 3 (Punkt 121, 2026-11-27): Trupps aus Teilen im Spiel (Waffentrupps, Führung, Scharfschütze, Beiwerk), voll und mit Verlusten; Rückwege per INIT (z. B. "window.WAFFENTRUPP_ALT=window.FUEHRUNG_ALT=window.SCHARF_TRUPP_ALT=window.BEIWERK_ALT=true")
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const OUT = process.argv[2] || 'entwurf/probe/u4/teil3/nachher'; mkdirSync(OUT, { recursive: true });
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
const stelle = (typ, seite, str) => ev(`(async () => { const D = __dbg, G = D.G, E = D.E; const S = G.units.filter(u => u.side === '${seite}' && E.alive(u)), a = S[0];
  a.type = '${typ}'; a.c = 6; a.r = 4; a.face = '${seite}' === 'A' ? 0 : 3; a.str = ${str}; a.setup = !!E.TYPES[a.type].mg;
  for (const u of G.units) if (u !== a && Math.abs(u.c - 6) < 2.5 && Math.abs(u.r - 4) < 2.5) u.c = u.side === 'A' ? 0 : 15;
  D.neuDU(); await new Promise(r => setTimeout(r, 900)); const [x, y] = D.mitte(6, 4); D.camSetzen(x, y - 40, 2.8); await new Promise(r => setTimeout(r, 1800)); return a.id; })()`);
const TYPEN = (process.env.TYPEN || 'mahlwerk:A,sense:D,buechse:D,hauptA:A,hauptD:D,generalA:A,generalD:D,scharf:A,munition:A,werkstatt:D,fernsprech:A').split(',').map(t => t.split(':'));
console.log("Figuren da:", await ev("window.__figurenDa === true"), "FIGS:", await ev("Object.keys(window.FIGS || {}).length"), "FIGSP:", await ev("Object.keys(window.FIGSP || {}).length"));
for (const [typ, seite] of TYPEN) { const id_ = await stelle(typ, seite, 10); await bild(`${typ}_voll`); console.log(typ, "Mündung", await ev(`JSON.stringify(__dbg.du(${id_}).muz)`)); if (!process.env.NUR_VOLL) { await stelle(typ, seite, 4); await bild(`${typ}_verluste`); } }
console.log(fehler.length ? 'Fehler: ' + fehler.slice(0, 3).join(' | ') : 'keine Seitenfehler');
ws.close(); ch.kill();
