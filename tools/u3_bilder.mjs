// U3 (Punkt 62, 2026-11-27): Aufnahmen der Effektbögen E1–E6 im Spiel (vorher: INIT="window.E1_ALT=window.E2_ALT=window.E3_ALT=window.E4_ALT=window.E5_ALT=window.E6_ALT=true").
// Spielt die Ereignisse über __dbg.spiel ab (Bühne wie effekt_bilder.mjs) und fotografiert mitten im Effekt.
// Aufruf: node tools/u3_bilder.mjs [ordner=entwurf/probe/u3/nachher]   (Vorschau-Server)
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const OUT = process.argv[2] || 'entwurf/probe/u3/nachher'; mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms)), port = 9500 + Math.floor(Math.random() * 300);
const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', ...(process.env.OHNE_GPU ? ['--disable-gpu', '--use-angle=swiftshader'] : []), `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'armfx-'))}`, '--no-first-run', '--mute-audio', '--window-size=1920,1080', 'about:blank']);
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
// Bühne: zwei eigene und zwei gegnerische Einheiten nebeneinander in der Kartenmitte (Grauwall)
const buehne = (tA, tD) => ev(`(async () => { const D = __dbg, G = D.G, E = D.E, A = G.units.filter(u => u.side === 'A' && E.alive(u)), B = G.units.filter(u => u.side === 'D' && E.alive(u));
  const a = A[0], d = B[0], d2 = B[1]; a.type = '${tA}'; a.c = 6; a.r = 4; a.face = 0; d.type = '${tD}'; d.c = 7; d.r = 4; d.face = 3; d2.type = 'grenadier'; d2.c = 7; d2.r = 5; d2.face = 3; for (const u of G.units) if (u !== a && u !== d && u !== d2 && Math.abs(u.c - 6.5) < 2.5 && Math.abs(u.r - 4.5) < 2.5) u.c = u.side === 'A' ? 0 : 15;
  D.neuDU && D.neuDU(); await new Promise(r => setTimeout(r, 900)); const p = D.du(a.id); D.camSetzen(p.x + 40, p.y - 40, 1.7); await new Promise(r => setTimeout(r, 1200)); return JSON.stringify({ a: a.id, d: d.id, d2: d2.id }); })()`).then(JSON.parse);
const serie = async (name, n) => { for (let i = 0; i < n; i++) await bild(name + '_' + i); };   // mehrere Aufnahmen kurz nacheinander (Effekte dauern nur 0,2–0,5 s)
const spiel = (evs, ms) => ev(`(async () => { __dbg.spiel(${evs}); await new Promise(r => setTimeout(r, ${ms})); return true; })()`);
let b = await buehne('haubitze', 'grenadier'); await ev(`(() => { const u = __dbg.G.units.find(x => x.id === ${b.a}); u.c = 3; u.r = 4; __dbg.neuDU && __dbg.neuDU(); const [x, y] = __dbg.mitte(7, 4); __dbg.camSetzen(x, y - 60, 1.5); return true; })()`); await sleep(900);
await spiel(`[{ t: 'shell', a: ${b.a}, c: 7, r: 4, mode: 'gas', face: 0 }]`, 1600); await serie('e1_gas_luft', 10);
await sleep(2500); b = await buehne('generalA', 'grenadier'); await spiel(`[{ t: 'bigorder', u: ${b.a}, side: 'A', kind: 'hold', name: 'Halten um jeden Preis', ids: [${b.a}, ${b.d}, ${b.d2}] }]`, 450); await bild('e2_grossbefehl');
await sleep(2500); b = await buehne('kohorte', 'gasschutz'); await spiel(`[{ t: 'clear', u: ${b.d}, n: 1 }]`, 900); await bild('e3_filterdampf');
await sleep(2500); b = await buehne('kreuz', 'grenadier'); await spiel(`[{ t: 'fire', a: ${b.a}, d: ${b.d}, kind: 'cannon' }]`, 150); await serie('e4_loewenmaul', 8);
await sleep(2500); b = await buehne('kohorte', 'knecht'); await ev(`(() => { const u = __dbg.G.units.find(x => x.side === 'A' && x.id !== ${b.a} && __dbg.E.alive(x)); u.type = 'kohorte'; u.c = 6; u.r = 5; __dbg.neuDU && __dbg.neuDU(); return true; })()`); await sleep(500); b.z = await ev(`__dbg.G.units.find(x => x.side === 'A' && x.c === 6 && x.r === 5).id`); await spiel(`[{ t: 'faust', u: ${b.d}, d: [${b.a}, ${b.z}] }]`, 1500); await serie('e5_faustsalve', 8);
await sleep(2500); b = await buehne('kohorte', 'kuerass'); await spiel(`[{ t: 'hinrichtung', u: ${b.d}, d: ${b.a} }]`, 2800); await serie('e6_hinrichtung', 12);
console.log(fehler.length ? 'Fehler: ' + fehler.slice(0, 3).join(' | ') : 'keine Seitenfehler');
ws.close(); ch.kill();
