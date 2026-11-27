// F2b (Punkt 133, 2026-11-27): Führung und neue Gruppenteile neben einem Linientrupp derselben Seite (Größenvergleich). Aufruf: node tools/f2b_bilder.mjs <ordner> ; INIT="window.GRUPPE_GR_ALT=true" = vorher
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const OUT = process.argv[2] || 'entwurf/probe/f2b/nachher'; mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms)), port = 9500 + Math.floor(Math.random() * 300);
const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'armfx-'))}`, '--no-first-run', '--mute-audio', '--window-size=1920,1080', ...(process.env.OHNE_GPU ? ['--disable-gpu'] : []), 'about:blank']);
let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {}, fehler = [];
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; return; } if (m.method === 'Runtime.exceptionThrown') fehler.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); };
const cmd = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async x => { const r = await cmd('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text); return r.result?.result?.value; };
const bild = async name => { const r = await cmd('Page.captureScreenshot', { format: 'jpeg', quality: 90, clip: { x: 480, y: 330, width: 960, height: 400, scale: 1 } }); writeFileSync(join(OUT, name + '.jpg'), Buffer.from(r.result.data, 'base64')); console.log('  Bild', name); };
await cmd('Runtime.enable'); await cmd('Page.enable'); await cmd('Page.addScriptToEvaluateOnNewDocument', { source: "try{localStorage.setItem('arm.ton','0')}catch(e){}" });
await cmd('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 2, mobile: false });
if (process.env.INIT) await cmd('Page.addScriptToEvaluateOnNewDocument', { source: process.env.INIT });
await cmd('Page.navigate', { url: process.env.URL || 'http://127.0.0.1:8765/index.html' }); await sleep(5000);
await ev(`(async () => { const W = ms => new Promise(r => setTimeout(r, ms)), click = t => { const b = [...document.querySelectorAll('button')].find(b => b.offsetParent && b.textContent.trim().toLowerCase().includes(t)); if (b) b.click(); return !!b; };
  click('neue schlacht'); await W(700); for (const t of ['weiter', 'weiter', 'die schlacht']) { click(t); await W(700); } await W(2500); click('schlacht beginnen'); await W(4000); return true; })()`);
// drei freie Felder nebeneinander suchen (häufigste Feldart = offen)
const ort = await ev(`(() => { const G = __dbg.G, M = G.map, z = {}; for (const sp of M) for (const h of sp) z[h.t] = (z[h.t] || 0) + 1; const offen = Object.keys(z).sort((a, b) => z[b] - z[a])[0];
  let best = null; for (let r = 2; r < M[0].length - 2; r++) for (let c = 2; c < M.length - 4; c++) if ([0, 1, 2].every(i => M[c + i][r].t === 'open' && !M[c + i][r].road)) { const d = Math.abs(c + 1 - M.length / 2) + Math.abs(r - M[0].length / 2); if (!best || d < best[2]) best = [c, r, d]; }
  return JSON.stringify({ offen, best }); })()`);
console.log('Ort', ort); const [C0, R0] = JSON.parse(ort).best;
const stelle = (seite, typen) => ev(`(async () => { const D = __dbg, G = D.G, E = D.E, typen = ${JSON.stringify(typen)}; const S = G.units.filter(u => u.side === '${seite}' && E.alive(u));
  for (const u of G.units) { u.c = u.side === 'A' ? 0 : G.map.length - 1; u.r = 0; }
  typen.forEach((t, i) => { const a = S[i]; a.type = t; a.c = ${C0} + i * 2; a.r = ${R0}; a.face = 0; a.str = 10; a.mor = E.TYPES[t].mor; a.supp = 0; a.status = 'ok'; a.dug = false; a.setup = !!E.TYPES[t].mg; });
  D.neuDU(); await new Promise(r => setTimeout(r, 900)); const p0 = D.mitte(${C0}, ${R0}), p1 = D.mitte(${C0} + 2, ${R0}); D.camSetzen((p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2 - 40, ${process.env.ZOOM || 1.3}); await new Promise(r => setTimeout(r, 1800)); return true; })()`);
const L = { A: 'kohorte', D: 'grenadier' }, SZENEN = [];   // je Bild: Linientrupp links, Gruppe rechts, gleiche Bildhöhe (Spalten c und c+2)
for (const [seite, pre, typen] of [['A', 'konkordat', ['hauptA', 'generalA', 'mahlwerk', 'feldscher', 'munition', 'fernsprech']], ['D', 'aschenwacht', ['hauptD', 'generalD', 'sense', 'buechse', 'heiler', 'werkstatt']]]) for (const t of typen) SZENEN.push([pre + '_' + t, seite, [L[seite], t]]);
console.log('Figuren da:', await ev('window.__figurenDa === true'), 'FIGS:', await ev('Object.keys(window.FIGS || {}).length'));
for (const [name, seite, typen] of SZENEN) { if (process.env.NUR && !name.includes(process.env.NUR)) continue; await stelle(seite, typen); await bild(name); }
console.log(fehler.length ? 'Fehler: ' + fehler.slice(0, 3).join(' | ') : 'keine Seitenfehler');
ws.close(); ch.kill();
