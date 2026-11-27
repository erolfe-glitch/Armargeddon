import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const OUT = process.argv[2] || 'entwurf/probe/ui1/nachher'; mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms)), port = 9500 + Math.floor(Math.random() * 300);
const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'armfx-'))}`, '--no-first-run', '--mute-audio', '--window-size=1920,1080', 'about:blank']);
let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {}, fehler = [];
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; return; } if (m.method === 'Runtime.exceptionThrown') fehler.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); };
const cmd = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async x => { const r = await cmd('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text); return r.result?.result?.value; };
const bild = async name => { const r = await cmd('Page.captureScreenshot', { format: 'jpeg', quality: 88 }); writeFileSync(join(OUT, name + '.jpg'), Buffer.from(r.result.data, 'base64')); console.log('  Bild', name); };
// UI1 (Punkt 141): Einheitenkarte und Knopfleiste bei 1280/1920/2560 px; je Breite: Schützenkohorte (wankend), Hauptmann, MG; dazu ein Tooltip per Maus und per langem Druck (Touch)
await cmd('Runtime.enable'); await cmd('Page.enable'); await cmd('Page.addScriptToEvaluateOnNewDocument', { source: "try{localStorage.setItem('arm.ton','0')}catch(e){}" + (process.env.INIT || '') });
const BREITEN = (process.env.BREITEN || '1280x800,1920x1080,2560x1440').split(',').map(s => s.split('x').map(Number));
const W = ms => sleep(ms);
for (const [bw, bh] of BREITEN) {
  await cmd('Emulation.setDeviceMetricsOverride', { width: bw, height: bh, deviceScaleFactor: 1, mobile: false });
  await cmd('Page.navigate', { url: process.env.URL || 'http://127.0.0.1:8765/index.html' }); await W(5000);
  await ev(`(async () => { const W = ms => new Promise(r => setTimeout(r, ms)), click = t => { const b = [...document.querySelectorAll('button')].find(b => b.offsetParent && b.textContent.trim().toLowerCase().includes(t)); if (b) b.click(); return !!b; };
    click('neue schlacht'); await W(700); for (const t of ['weiter', 'weiter', 'die schlacht']) { click(t); await W(700); } await W(2500); click('schlacht beginnen'); await W(4000); return true; })()`);
  for (const [typ, mor, name] of [['kohorte', 3.5, 'kohorte'], ['hauptA', null, 'hauptmann'], ['mahlwerk', null, 'mg']]) {
    const ok = await ev(`(async () => { const D = __dbg, G = D.G, u = G.units.find(x => x.side === G.side && x.type === '${typ}' && D.E.alive(x)); if (!u) return false; ${mor != null ? `u.mor = ${mor};` : ''} D.neuDU(); D.pick(u.id); await new Promise(r => setTimeout(r, 900)); return true; })()`);
    if (!ok) { console.log('fehlt', typ); continue; }
    await bild(`${bw}_${name}`);
  }
  // Tooltip: Maus über das erste Eigenschaftskästchen (UI1) bzw. das erste Zustandssymbol (alt)
  const p = await ev(`(() => { const el = document.querySelector('#hud .u1-eig') || document.querySelector('#hud .up-st'); if (!el) return null; const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; })()`);
  if (p) { await cmd('Input.dispatchMouseEvent', { type: 'mouseMoved', x: p[0], y: p[1] }); await W(500); await bild(`${bw}_tooltip_maus`); await cmd('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 5, y: 300 }); await W(300);
    await cmd('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: p[0], y: p[1] }] }); await W(700); await bild(`${bw}_tooltip_touch`); await cmd('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await W(300); }
  if (process.env.MEHR) { await ev(`document.getElementById('btnMehr').click()`); await W(600); await bild(`${bw}_mehr`); await ev(`document.getElementById('btnMehr').click()`); }
  const mass = await ev(`(() => { const r = e => { const b = e && e.getBoundingClientRect(); return b ? [Math.round(b.left), Math.round(b.top), Math.round(b.right), Math.round(b.bottom)] : null; }; const ab = [...document.querySelectorAll('#hud .up-ab')].map(b => Math.round(b.getBoundingClientRect().width)); return JSON.stringify({ karte: r(document.querySelector('#hud .up-unit')), knoepfe: r(document.getElementById('hudRow')), rechts: r(document.querySelector('#hud .up-turn')), ab: [Math.min(...ab), Math.max(...ab)], minSchrift: Math.min(...[...document.querySelectorAll('#hud .up-unit *, #hudRow *')].filter(e => e.offsetParent && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())).map(e => parseFloat(getComputedStyle(e).fontSize))) }); })()`);
  console.log(bw, mass);
}
console.log(fehler.length ? 'Fehler: ' + fehler.slice(0, 3).join(' | ') : 'keine Seitenfehler');
ws.close(); ch.kill();
