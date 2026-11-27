import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const OUT = process.argv[2] || 'entwurf/probe/f3/vorher'; mkdirSync(OUT, { recursive: true });
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
// F3: Standbild im Moment des Schusses. FAELLE="typ:seite:zweit(0/1):face,…"; Ziel 2 Felder in Blickrichtung
const FAELLE = (process.env.FAELLE || 'sturmpz:D:1:3,sturmpz:D:1:0,sturmpz:D:0:3,koloss:A:0:0,turm:A:0:0,turm:A:1:0,bohrer:D:0:3,saeger:D:0:3,klaue:D:0:3,kreuz:A:0:0,knecht:D:0:3,orden:A:0:0').split(',').map(x => x.split(':'));
const punkte = {}; const ZOOM = +(process.env.ZOOM || 2.6);
for (const [typ, seite, zweit, face] of FAELLE) {
  const r = await ev(`(async () => { const D = __dbg, G = D.G, E = D.E; const S = G.units.filter(u => u.side === '${seite}' && E.alive(u)), a = S[0], z = G.units.find(u => u.side !== '${seite}' && E.alive(u) && E.TYPES[u.type].cls === 'inf');
    a.type = '${typ}'; a.c = 6; a.r = 4; a.face = ${face}; a.str = 10; z.c = ${face} === 0 ? 8 : 4; z.r = 4; z.str = 10;
    for (const u of G.units) if (u !== a && u !== z && Math.abs(u.c - 6) < 3.5 && Math.abs(u.r - 4) < 2.5) u.c = u.side === 'A' ? 0 : 15;
    D.neuDU(); await new Promise(r => setTimeout(r, 900)); const [x, y] = D.mitte(6, 4); D.camSetzen(x + (${face} === 0 ? 1 : -1) * 40, y - 40, ${ZOOM}); await new Promise(r => setTimeout(r, 1200));
    return [a.id, z.id]; })()`);
  if (process.env.POSE) { await ev(`__dbg.pose(${r[0]}, '${typ === 'kreuz' && zweit === '1' ? 'zweit' : typ === 'knecht' && zweit === '1' ? 'faust' : 'anlegen'}', 6000)`); await sleep(900); }
  const name = `${typ}_${zweit === '1' ? 'zweit' : 'haupt'}_${face === '0' ? 'rechts' : 'links'}`, p = await ev(`JSON.stringify(__dbg.fxSchirm(${r[0]}, ${r[1]}, ${zweit}))`); punkte[name] = JSON.parse(p); await bild(name);
  if (process.env.BLITZ) { await ev('window.CAM_STILL = true'); await ev(`void __dbg.spiel([{ t: 'fire', a: ${r[0]}, d: ${r[1]}, kind: ${zweit} ? 'mg' : 'cannon', zweit: !!${zweit} }])`); for (const [n, ms] of [['a', 60], ['b', 90], ['c', 120]]) { await sleep(ms); await bild(name + '_' + n); } await sleep(2500); }
}
writeFileSync(join(OUT, 'punkte.json'), JSON.stringify(punkte));
console.log(fehler.length ? 'Fehler: ' + fehler.slice(0, 3).join(' | ') : 'keine Seitenfehler');
ws.close(); ch.kill();
