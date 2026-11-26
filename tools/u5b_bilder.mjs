// U5b-Bilder (2026-11-26): ein Trupp vor, während und nach einem Treffer, bei dem Modelle fallen – im Offenen (Sankt Ruß),
// im Graben (Grauwall) und im Schnee (Krähenfurt). Dazu Leistung mit vielen Liegenden. Vorschau-Server auf 127.0.0.1:8765.
// Aufruf: node tools/u5b_bilder.mjs → entwurf/probe/u5b/<karte>_<stufe>.jpg, leistung.json
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const OUT = process.env.OUT || 'entwurf/probe/u5b', sleep = ms => new Promise(r => setTimeout(r, ms)), port = 9500 + Math.floor(Math.random() * 300);
mkdirSync(OUT, { recursive: true });
const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', ...(process.env.OHNE_GPU ? ['--disable-gpu', '--use-angle=swiftshader'] : []), `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'armu5b-'))}`, '--no-first-run', ...(process.env.OHNE_DECKEL ? ['--disable-gpu-vsync', '--disable-frame-rate-limit'] : []), '--mute-audio', '--disable-background-timer-throttling', '--disable-renderer-backgrounding', 'about:blank'], { stdio: 'ignore' });
let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {}, fehler = []; ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; return; } if (m.method === 'Runtime.exceptionThrown') fehler.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') fehler.push(m.params.args.map(a => a.value ?? a.description).join(' ').slice(0, 200)); };
const cmd = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async x => { const r = await cmd('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text); return r.result?.result?.value; };
await cmd('Runtime.enable'); await cmd('Page.enable'); await cmd('Page.addScriptToEvaluateOnNewDocument', { source: "try{localStorage.setItem('arm.ton','0')}catch(e){}" });
await cmd('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
const bild = async n => { const r = await cmd('Page.captureScreenshot', { format: 'jpeg', quality: 88 }); writeFileSync(join(OUT, n + '.jpg'), Buffer.from(r.result.data, 'base64')); };
const hell = () => ev("(() => { const c = document.getElementById('map'), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let s = 0, n = 0; for (let i = 0; i < d.length; i += 4 * 997) { s += d[i] + d[i + 1] + d[i + 2]; n++; } return s / n / 3; })()");
// [Karte, Gelände des Ziels, Typ]
const FAELLE0 = [['sanktruss', 'offen', 'kohorte'], ['grauwall', 'graben', 'grenadier'], ['winterdorf', 'schnee', 'kohorte']];
const FAELLE = process.env.NUR ? FAELLE0.filter(f => f[0] === process.env.NUR) : FAELLE0;
const leistung = {};
for (const [karte, art, typ] of FAELLE) {
  await cmd('Page.navigate', { url: 'http://127.0.0.1:8765/index.html' }); await sleep(5000);
  await ev(`(async () => { const W = ms => new Promise(r => setTimeout(r, ms)), click = t => { const b = [...document.querySelectorAll('button')].find(b => b.offsetParent && b.textContent.trim().toLowerCase().includes(t)); if (b) b.click(); return !!b; };
    click('neue schlacht'); await W(700); const rb = document.querySelector('input[name=map][value=${karte}]'); if (rb) { rb.click(); rb.dispatchEvent(new Event('change', { bubbles: true })); await W(400); }
    for (const t of ['weiter', 'weiter', 'die schlacht']) { click(t); await W(700); } await W(2500); click('schlacht beginnen'); await W(4000); return true; })()`);
  if (process.env.JS) await ev(`(() => { ${process.env.JS}; return true; })()`);   // Variante, z. B. JS='window.GEFALLEN_QUETSCH = true'
  await sleep(2500); for (let i = 0; i < 40 && (await hell()) < 12; i++) await sleep(500);
  // Ziel: Trupp des Typs; im Graben einer auf einem Grabenfeld, sonst einer auf offenem Feld
  const z = JSON.parse(await ev(`JSON.stringify((() => { const G = __dbg.G, us = G.units.filter(u => u.type === '${typ}' && u.status === 'ok'); const t = u => G.map[u.c][u.r].t;
    const u = '${art}' === 'graben' ? us.find(u => t(u) === 'trench') : us.find(u => !['trench', 'village', 'wald', 'forest'].includes(t(u))) || us[0]; return u ? [u.id, u.c, u.r, t(u)] : null; })())`));
  if (!z) { console.log(karte, 'kein Ziel'); continue; }
  const [uid, c, r, ter] = z, m = await ev(`__dbg.mitte(${c}, ${r})`);
  await ev(`(() => { __dbg.camSetzen(${m[0]}, ${m[1]} - 30, 2.8); return true; })()`); await sleep(1800);
  await bild(`${karte}_${art}_1_vorher`);
  // Treffer: 3 bzw. 4 Modelle fallen (Stärke 100 → 60 bzw. 50)
  const treffer = (neu, dmg) => ev(`(async () => { const u = __dbg.G.units.find(x => x.id === ${uid}); u.str = ${neu}; __dbg.play([{ t: 'hit', u: ${uid}, dmg: ${dmg}, str: ${neu}, morv: u.mor }]); return true; })()`);
  await treffer(6, 4); await sleep(230); await bild(`${karte}_${art}_2_faellt`);
  await sleep(1500); await bild(`${karte}_${art}_3_liegen`);
  await treffer(2.5, 3.5); await sleep(1800); await bild(`${karte}_${art}_4_noch_mehr`);
  // Leistung: ganze Karte, viele Liegende (alle Trupps verlieren die Hälfte)
  await ev(`(async () => { const G = __dbg.G; for (const u of G.units) if (u.status === 'ok' && ['inf', 'storm', 'cav', 'medic', 'flame', 'mg'].includes(__dbg.cls ? __dbg.cls(u) : 'inf')) { u.str = Math.min(u.str, 5); await __dbg.play([{ t: 'hit', u: u.id, dmg: 1, str: u.str, morv: u.mor }]); } return true; })()`);
  await sleep(1500);
  const n = await ev('__dbg.leichen().length');
  const zeit = await ev(`(async () => { const t = []; let a = performance.now(); for (let i = 0; i < 150; i++) { await new Promise(r => requestAnimationFrame(r)); const b = performance.now(); t.push(b - a); a = b; } t.sort((x, y) => x - y); return { mittel: +(t.reduce((s, x) => s + x, 0) / t.length).toFixed(1), p95: +t[Math.floor(t.length * 0.95)].toFixed(1) }; })()`);
  await ev(`(() => { __dbg.camSetzen(${m[0]}, ${m[1]} - 30, 1.6); return true; })()`); await sleep(1500); await bild(`${karte}_${art}_5_viele`);
  leistung[karte] = { liegende: n, ...zeit, gelaende: ter };
  // Belastung: 200 Liegende über die Felder verteilt (Kopien eines echten Gefallenen), je Zoom mit und ohne
  const messen = () => ev(`(async () => { const t = []; let a = performance.now(); for (let i = 0; i < 180; i++) { await new Promise(r => requestAnimationFrame(r)); const b = performance.now(); t.push(b - a); a = b; } t.sort((x, y) => x - y); return { mittel: +(t.reduce((s, x) => s + x, 0) / t.length).toFixed(1), p95: +t[Math.floor(t.length * 0.95)].toFixed(1) }; })()`);
  const vorlage = await ev('(() => { const L = __dbg.leichen(); window.__lv = L[0]; return !!L[0]; })()');
  if (vorlage) for (const zz of [1.6, 0.5]) {
    await ev(`(() => { __dbg.camSetzen(${m[0]}, ${m[1]}, ${zz}); const L = __dbg.leichen(), v = window.__lv; L.length = 0; for (let i = 0; i < 200; i++) { const u = __dbg.G.units[i % __dbg.G.units.length], q = __dbg.mitte(u.c, u.r); L.push({ ...v, wx: q[0] + (Math.random() - 0.5) * 90, wy: q[1] + (Math.random() - 0.5) * 50, t0: performance.now() - 5000, graben: false, fadeT: 0, runde: __dbg.G.turn }); } return L.length; })()`);
    await sleep(1200); leistung[karte]['200_liegende_zoom_' + zz] = await messen(); await bild(`${karte}_${art}_6_200_liegende_zoom_${zz}`);
    await ev('(() => { __dbg.leichen().length = 0; return true; })()'); await sleep(800); leistung[karte]['0_liegende_zoom_' + zz] = await messen();
  }
  console.log(karte, art, ter, 'ok', JSON.stringify(leistung[karte]));
}
writeFileSync(join(OUT, 'leistung.json'), JSON.stringify(leistung, null, 1));
console.log(fehler.length ? 'Fehler: ' + [...new Set(fehler)].slice(0, 5).join(' | ') : 'keine Seitenfehler'); ws.close(); ch.kill(); process.exit(0);
