// Hilfsfähigkeiten (Enrico 2026-11-22 17:40 und Nachtrag): unsichtbarer Chrome, echte Mausklicks.
// 1) Sanitäter gewählt, Klick auf verletzten Nachbarn OHNE Knopf → nur Auswahl, kein Heilen; mit Knopf „Versorgen“ → Heilen.
// 2) Kohorte „Fertig“ abgehakt, Meldegänger gibt per Knopf „Befehl überbringen“ Punkte → Kohorte kann wieder ziehen (nicht mehr fertig).
// 3) Feldkanone: ohne Protzen, 2 BP, zieht und schießt.
// Aufruf: node tools/test_hilfe.mjs   (Vorschau-Server auf 127.0.0.1:8765)
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const sleep = ms => new Promise(r => setTimeout(r, ms)), port = 9500 + Math.floor(Math.random() * 300);
const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'armhilfe-'))}`, '--no-first-run', '--mute-audio', '--window-size=1920,1080', 'about:blank'], { stdio: 'ignore' });
let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {}, fehler = [];
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; return; } if (m.method === 'Runtime.exceptionThrown') fehler.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); };
const cmd = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async x => { const r = await cmd('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true }); return r.result?.exceptionDetails ? 'ERR ' + (r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text) : r.result?.result?.value; };
const klick = async (x, y) => { await cmd('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y }); await cmd('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 }); await cmd('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 }); await sleep(900); };
await cmd('Runtime.enable'); await cmd('Page.enable');
await cmd('Page.addScriptToEvaluateOnNewDocument', { source: "try{localStorage.setItem('arm.ton','0')}catch(e){}" });
await cmd('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
await cmd('Page.navigate', { url: 'http://127.0.0.1:8765/index.html' }); await sleep(5000);
await ev(`(async () => { const W = ms => new Promise(r => setTimeout(r, ms)); const click = t => { const b = [...document.querySelectorAll('button')].find(b => b.offsetParent && b.textContent.trim().toLowerCase().includes(t)); if (b) b.click(); return !!b; };
  click('neue schlacht'); await W(700); for (const t of ['weiter', 'weiter', 'die schlacht']) { click(t); await W(700); } await W(2500); click('schlacht beginnen'); await W(4000); })()`);
// Aufbau: Kohorte K (verletzt), daneben Sanitäter S und Meldegänger M (Kopien vorhandener Einheiten)
const lage = await ev(`(async () => { const D = __dbg, G = D.G, E = D.E, W = ms => new Promise(r => setTimeout(r, ms));
  const K = G.units.find(u => u.side === 'A' && u.type === 'kohorte' && E.neighbors(u.c, u.r).filter(([c, r]) => E.inMap(c, r) && !G.units.some(o => o.c === c && o.r === r) && E.cost(G, u, c, r) < 9).length >= 3);
  const frei = E.neighbors(K.c, K.r).filter(([c, r]) => E.inMap(c, r) && !G.units.some(o => o.c === c && o.r === r) && E.cost(G, K, c, r) < 9);
  K.str = 5; G.units.push({ ...K, id: 9981, type: 'feldscher', c: frei[0][0], r: frei[0][1], str: 10 }, { ...K, id: 9982, type: 'melder', c: frei[1][0], r: frei[1][1], str: 10, sent: false });
  D.neuDU(); D.camSetzen(D.du(K.id).x, D.du(K.id).y, 1.3); await W(600); return { K: K.id, k: [K.c, K.r] }; })()`);
const kPos = async () => ev(`(() => { const D = __dbg, u = D.G.units.find(x => x.id === ${lage.K}); const d = D.du(u.id); return D.hexCss(u.c, u.r); })()`);
const ergebnis = {};
// 1) Sanitäter ohne Knopf
await ev(`__dbg.pick(9981)`); await sleep(300); let [kx, ky] = await kPos(); await klick(kx, ky);
ergebnis.ohneKnopf = await ev(`(() => { const D = __dbg, K = D.G.units.find(x => x.id === ${lage.K}); return { stärke: K.str, gewählt: D.sel && D.sel.id === K.id }; })()`);
await ev(`__dbg.pick(9981)`); await sleep(300); await ev(`__dbg.panelAct('i-heal')`); await sleep(300); [kx, ky] = await kPos(); await klick(kx, ky); await sleep(1200);
ergebnis.mitKnopf = await ev(`(() => { const K = __dbg.G.units.find(x => x.id === ${lage.K}); return { stärke: +K.str.toFixed(1) }; })()`);
// 2) Kohorte fertig, Meldegänger gibt Punkte
await ev(`(async () => { const D = __dbg, K = D.G.units.find(x => x.id === ${lage.K}); K.ap = 1; K.bp = 3; K.attacked = false; K.moved = false; D.pick(K.id); await new Promise(r => setTimeout(r, 300)); D.panelAct('pass'); })()`); await sleep(600);
ergebnis.nachFertig = await ev(`(() => { const D = __dbg, K = D.G.units.find(x => x.id === ${lage.K}); return { bp: K.bp, grund: D.bereitGrund(K.id) }; })()`);
await ev(`__dbg.pick(9982)`); await sleep(300); ergebnis.vorKnopf = await ev(`({ sendIds: __dbg.sendIds })`); await ev(`__dbg.panelAct('i-send')`); ergebnis.nachKnopf = await ev(`({ hilfe: __dbg.hilfe })`); ergebnis.sendPruef = await ev(`(() => { const D = __dbg, G = D.G, E = D.E, m = G.units.find(x => x.id === 9982), K = G.units.find(x => x.id === ${lage.K}); return { kann: E.canSend(G, m, K), mAp: m.ap, sent: m.sent, dist: E.dist(m.c, m.r, K.c, K.r), kAp: K.ap, courier: !!E.TYPES[m.type].courier, side: G.side }; })()`); await sleep(300); await sleep(1500); [kx, ky] = await kPos(); ergebnis.pickVorKlick = await ev(`__dbg.pickAt(${kx}, ${ky})`); ergebnis.klickDirekt = await ev(`(async () => { const cv = document.getElementById('map'); cv.dispatchEvent(new MouseEvent('click', { clientX: ${kx}, clientY: ${ky}, bubbles: true })); await new Promise(r => setTimeout(r, 1500)); const m = __dbg.G.units.find(x => x.id === 9982); return { sent: m.sent, busy: __dbg.busyFlag }; })()`); await sleep(1200);
ergebnis.direkt = await ev(`(() => { const D = __dbg, G = D.G, m = G.units.find(x => x.id === 9982), K = G.units.find(x => x.id === ${lage.K}); return { sent: m.sent, mAp: m.ap, kBp: K.bp, sel: D.sel && D.sel.id, busy: D.busyFlag, hilfe: D.hilfe, sendIds: D.sendIds, K: K.id }; })()`);
ergebnis.nachHund = await ev(`(async () => { const D = __dbg, K = D.G.units.find(x => x.id === ${lage.K}); D.pick(K.id); await new Promise(r => setTimeout(r, 300)); return { bp: K.bp, grund: D.bereitGrund(K.id), ziehbar: D.reach.length }; })()`);
// 3) Feldkanone
ergebnis.feldkanone = await ev(`(() => { const E = __dbg.E, T = E.TYPES.feldkanone; const u = { type: 'feldkanone', limbered: false }; return { protzen: !!T.limber, bp: E.bpMax(u), preis: E.COST.feldkanone }; })()`);
console.log(JSON.stringify(ergebnis, null, 1));
const ok = ergebnis.ohneKnopf.stärke === 5 && ergebnis.ohneKnopf.gewählt && ergebnis.mitKnopf.stärke > 5 && ergebnis.nachHund.bp >= 2 && ergebnis.nachHund.grund && ergebnis.nachHund.ziehbar > 0 && !ergebnis.feldkanone.protzen && ergebnis.feldkanone.bp === 2;
console.log(ok ? 'alles richtig' : 'FEHLER'); console.log(fehler.length ? 'Seitenfehler: ' + fehler.join(' | ') : 'keine Seitenfehler');
ws.close(); ch.kill(); process.exit(ok && !fehler.length ? 0 : 1);
