// KO-A (Punkt 154, 2026-11-28): Kommandant (Stratege) neben Linientrupp und Held derselben Seite, dazu „Feuer lenken“ in der Bedienung. Aufruf: node tools/ko_a_bilder.mjs <ordner> ; vorher: INIT="window.KOMMANDANT_ALT=true" node tools/ko_a_bilder.mjs <ordner>
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const OUT = process.argv[2] || 'entwurf/probe/ko_a/nachher'; mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms)), port = 9500 + Math.floor(Math.random() * 300);
const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'armfx-'))}`, '--no-first-run', '--mute-audio', '--window-size=1920,1080', ...(process.env.OHNE_GPU ? ['--disable-gpu'] : []), 'about:blank']);
let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {}, fehler = [];
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; return; } if (m.method === 'Runtime.exceptionThrown') fehler.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); };
const cmd = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async x => { const r = await cmd('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text); return r.result?.result?.value; };
const bild = async name => { const r = await cmd('Page.captureScreenshot', { format: 'jpeg', quality: 90, clip: { x: 380, y: 300, width: 1160, height: 440, scale: 1 } }); writeFileSync(join(OUT, name + '.jpg'), Buffer.from(r.result.data, 'base64')); console.log('  Bild', name); };
const voll = async name => { const r = await cmd('Page.captureScreenshot', { format: 'jpeg', quality: 85 }); writeFileSync(join(OUT, name + '.jpg'), Buffer.from(r.result.data, 'base64')); console.log('  Bild', name); };
await cmd('Runtime.enable'); await cmd('Page.enable'); await cmd('Page.addScriptToEvaluateOnNewDocument', { source: "try{localStorage.setItem('arm.ton','0')}catch(e){}" });
await cmd('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 2, mobile: false });
if (process.env.INIT) await cmd('Page.addScriptToEvaluateOnNewDocument', { source: process.env.INIT });
await cmd('Page.navigate', { url: process.env.URL || 'http://127.0.0.1:8765/index.html' }); await sleep(5000);
await ev(`(async () => { const W = ms => new Promise(r => setTimeout(r, ms)), click = t => { const b = [...document.querySelectorAll('button')].find(b => b.offsetParent && b.textContent.trim().toLowerCase().includes(t)); if (b) b.click(); return !!b; };
  click('neue schlacht'); await W(700); for (const t of ['weiter', 'weiter', 'die schlacht']) { click(t); await W(700); } await W(2500); click('schlacht beginnen'); await W(4000); return true; })()`);
const ort = await ev(`(() => { const M = __dbg.G.map; let best = null; for (let r = 2; r < M[0].length - 2; r++) for (let c = 2; c < M.length - 6; c++) if ([0, 2, 4].every(i => M[c + i][r].t !== "trench" && !M[c + i][r].road && ["open", "mud", "crater", "field", "acker", "garten"].includes(M[c + i][r].t))) { const d = Math.abs(c + 2 - M.length / 2) + Math.abs(r - M[0].length / 2); if (!best || d < best[2]) best = [c, r, d]; } return JSON.stringify(best); })()`);
console.log('Ort', ort); const [C0, R0] = JSON.parse(ort);
const stelle = (seite, typen) => ev(`(async () => { const D = __dbg, G = D.G, E = D.E, typen = ${JSON.stringify(typen)}; const S = G.units.filter(u => u.side === '${seite}' && E.alive(u));
  for (const u of G.units) { u.c = u.side === 'A' ? 0 : G.map.length - 1; u.r = 0; }
  typen.forEach((t, i) => { const a = S[i]; a.type = t; a.c = ${C0} + i * 2; a.r = ${R0}; a.face = 0; a.str = 10; a.mor = E.TYPES[t].mor; a.supp = 0; a.status = 'ok'; a.dug = false; a.setup = !!E.TYPES[t].mg; a.officer = E.TYPES[t].cmd ? (E.KOMM && E.TYPES[t].kommandant ? E.TYPES[t].name : 'General') : null; });
  D.neuDU(); await new Promise(r => setTimeout(r, 900)); const p0 = D.mitte(${C0}, ${R0}), p1 = D.mitte(${C0} + 4, ${R0}); D.camSetzen((p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2 - 40, 1.2); await new Promise(r => setTimeout(r, 1800)); return true; })()`);
for (const [seite, name, typen] of [['A', 'konkordat', ['kohorte', 'generalA', 'faust']], ['D', 'aschenwacht', ['grenadier', 'generalD', 'kuerass']]]) { await stelle(seite, typen); await bild(name + '_linie_kommandant_held'); console.log('  Höhen der Figurenkästen (Weltbild-Pixel, höchste Figur je Einheit):', await ev(`JSON.stringify(__dbg.G.units.filter(u => u.side === '${seite}' && ${JSON.stringify(typen)}.includes(u.type)).map(u => { const d = __dbg.du(u.id); return [u.type, Math.round(Math.max(...(d.fbx || [[0, 0, 0, 0]]).map(b => b[3])))]; }))`)); }
// Bedienung: neue Schlacht, Feldmarschall wählen, „Feuer lenken“ an, dann Mörser anklicken
await cmd('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
await cmd('Page.navigate', { url: process.env.URL || 'http://127.0.0.1:8765/index.html' }); await sleep(5000);
await ev(`(async () => { const W = ms => new Promise(r => setTimeout(r, ms)), click = t => { const b = [...document.querySelectorAll('button')].find(b => b.offsetParent && b.textContent.trim().toLowerCase().includes(t)); if (b) b.click(); return !!b; };
  click('neue schlacht'); await W(700); for (const t of ['weiter', 'weiter', 'die schlacht']) { click(t); await W(700); } await W(2500); click('schlacht beginnen'); await W(4000); return true; })()`);
if (process.env.NUR_GROESSE) { ws.close(); ch.kill(); process.exit(0); }
const lage = await ev(`(async () => { const D = __dbg, G = D.G, E = D.E, k = G.units.find(u => u.type === 'generalA'); D.pick(k.id); await new Promise(r => setTimeout(r, 900)); const p = D.mitte(k.c, k.r); D.camSetzen(p[0] + 60, p[1] - 30, 1.1); await new Promise(r => setTimeout(r, 1200));
  const kn = [...document.querySelectorAll('#hud .up-ab')].map(b => b.dataset.act); return JSON.stringify({ kn, ziele: E.lenkenZiele ? E.lenkenZiele(G, k).map(u => u.type) : [] }); })()`);
console.log('Knöpfe', lage); await voll('bedienung_feldmarschall');
if (JSON.parse(lage).ziele.length) {
  await ev(`(async () => { await __dbg.panelAct('i-lenk'); await new Promise(r => setTimeout(r, 1200)); return true; })()`); await voll('feuer_lenken_modus');
  const t = await ev(`(async () => { const D = __dbg, G = D.G, E = D.E, k = G.units.find(u => u.type === 'generalA'), z = E.lenkenZiele(G, k)[0]; const ev = E.lenken(G, k, z); await D.play(ev); await new Promise(r => setTimeout(r, 900)); return JSON.stringify({ ev, gelenkt: E.gelenkt(G, z) }); })()`);
  console.log('Feuer lenken', t); await voll('feuer_gelenkt');
}
console.log(fehler.length ? 'Fehler: ' + fehler.slice(0, 3).join(' | ') : 'keine Seitenfehler');
ws.close(); ch.kill();
