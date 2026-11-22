// Gemalte Mauszeiger (2026-11-22): prüft im unsichtbaren Chrome, welcher Zeiger je Lage kommt, und baut ein Bild mit allen Zeigern
// an ihrem Klickpunkt über einer Spielaufnahme (Bildschirmfotos zeigen den Mauszeiger selbst nicht).
// Aufruf: node tools/test_zeiger.mjs   (Vorschau-Server auf 127.0.0.1:8765) → entwurf/probe/zeiger/zeiger_im_spiel.png
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const URL = process.env.URL || 'http://127.0.0.1:8765/index.html', OUT = 'entwurf/probe/zeiger';
const sleep = ms => new Promise(r => setTimeout(r, ms)), port = 9500 + Math.floor(Math.random() * 300);
const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'armzeiger-'))}`, '--no-first-run', '--mute-audio', '--window-size=1920,1080', 'about:blank'], { stdio: 'ignore' });
let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {}, fehler = [];
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; return; } if (m.method === 'Runtime.exceptionThrown') fehler.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); };
const cmd = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async x => { const r = await cmd('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true }); return r.result?.exceptionDetails ? 'ERR ' + (r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text) : r.result?.result?.value; };
await cmd('Runtime.enable'); await cmd('Page.enable');
await cmd('Page.addScriptToEvaluateOnNewDocument', { source: "try{localStorage.setItem('arm.ton','0')}catch(e){}" });
await cmd('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
await cmd('Page.navigate', { url: URL }); await sleep(5000);
await ev(`(async () => { const W = ms => new Promise(r => setTimeout(r, ms)); const click = t => { const b = [...document.querySelectorAll('button')].find(b => b.offsetParent && b.textContent.trim().toLowerCase().includes(t)); if (b) b.click(); return !!b; };
  click('neue schlacht'); await W(700); for (const t of ['weiter', 'weiter', 'die schlacht']) { click(t); await W(700); } await W(2500); click('schlacht beginnen'); await W(4000); })()`);
const r = await ev(`(async () => { const W = ms => new Promise(r => setTimeout(r, ms)), D = __dbg, G = D.G, E = D.E, C = D.CURSOR;
  const name = v => v === '' ? 'pfeil' : Object.keys(C).find(k => C[k] === v) || ('?' + String(v).slice(0, 30));
  const out = { lagen: {}, pos: {}, typ: typeof window.ZEIGER, imageSet: String(C.pfeil).startsWith('image-set') };
  const eig = G.units.find(u => u.side === 'A' && E.alive(u) && u.type === 'kohorte');
  // ohne Auswahl: eigene Einheit = Hand, Feld = Pfeil
  out.lagen.ohneAuswahl_eigen = name(D.cursorFor({ uHex: eig, h: [eig.c, eig.r] })); out.pos.hand = D.hexCss(eig.c, eig.r);
  // Auswahl
  D.pick(eig.id); await W(400);
  const r0 = D.reach.find(n => n.c != null && E.dist(n.c, n.r, eig.c, eig.r) >= 2 && !G.units.some(u => u.c === n.c && u.r === n.r)) || D.reach[0];
  if (r0) { out.lagen.ziehen = name(D.cursorFor({ h: [r0.c, r0.r] })); out.pos.stiefel = D.hexCss(r0.c, r0.r); }
  // gesperrtes Feld: weit weg, nicht erreichbar
  let nein = null; for (let c = 0; c < E.COLS && !nein; c++) for (let r = 0; r < E.ROWS; r++) { const p = D.hexCss(c, r); if (p[0] < 300 || p[0] > 1700 || p[1] < 200 || p[1] > 820) continue; if (!D.reach.some(n => n.c === c && n.r === r) && !G.units.some(u => u.c === c && u.r === r) && E.dist(c, r, eig.c, eig.r) > 4) { nein = [c, r]; break; } }
  if (nein) { out.lagen.gesperrt = name(D.cursorFor({ h: nein })); out.pos.nein = D.hexCss(nein[0], nein[1]); }
  out.lagen.eigeneEinheit = name(D.cursorFor({ uHex: eig, h: [eig.c, eig.r] }));
  // Gegner: Schuss bzw. Nahkampf aus der Zielliste
  const ts = D.targets; out.ziele = ts.length;
  // gezielt: Gegner neben die Kohorte setzen (Nahkampf) und auf 2 Felder (Schuss)
  const g1 = G.units.find(u => u.side === 'D' && E.alive(u) && u.type === 'grenadier'), g2 = G.units.filter(u => u.side === 'D' && E.alive(u) && u.type === 'grenadier')[1];
  const frei = (c, r) => E.inMap ? E.inMap(c, r) && !G.units.some(u => u.c === c && u.r === r) : !G.units.some(u => u.c === c && u.r === r);
    const ring2 = []; for (let c = 0; c < E.COLS; c++) for (let r = 0; r < E.ROWS; r++) if (E.dist(c, r, eig.c, eig.r) === 2 && frei(c, r) && E.hasLOS(G, eig.c, eig.r, c, r)) ring2.push([c, r]);
  if (g2 && ring2[0]) { g2.c = ring2[0][0]; g2.r = ring2[0][1]; }
  D.neuDU(); D.pick(eig.id); await W(400);
  if (g2) { out.lagen.schuss = name(D.cursorFor({ uHex: g2, h: [g2.c, g2.r] })); out.pos.ziel = D.hexCss(g2.c, g2.r); }
  const nb = E.neighbors(eig.c, eig.r).filter(([c, r]) => frei(c, r)); if (g1 && nb[0]) { g1.c = nb[0][0]; g1.r = nb[0][1]; }
  D.neuDU(); D.pick(eig.id); await W(400);
  if (g1) { out.lagen.nahkampf = name(D.cursorFor({ uHex: g1, h: [g1.c, g1.r] })); out.pos.saebel = D.hexCss(g1.c, g1.r); }
  out.pos.pfeil = [140, 300]; out.pos.feld = null; out.pos.schere = null;
  return out; })()`);
console.log(JSON.stringify(r, null, 1));
const shot = await cmd('Page.captureScreenshot', { format: 'png' });
writeFileSync(join(OUT, 'spiel_roh.png'), Buffer.from(shot.result.data, 'base64'));
writeFileSync(join(OUT, 'zeiger_pos.json'), JSON.stringify(r));
console.log(fehler.length ? 'Fehler: ' + fehler.join(' | ') : 'keine Seitenfehler');
ws.close(); ch.kill();
const soll = { ohneAuswahl_eigen: 'hand', ziehen: 'stiefel', gesperrt: 'nein', eigeneEinheit: 'hand', nahkampf: 'schwert', schuss: 'ziel' };
const falsch = typeof r === 'object' ? Object.entries(soll).filter(([k, v]) => r.lagen[k] !== v).map(([k, v]) => `${k}: ${r.lagen[k]} statt ${v}`) : ['Ausführung'];
console.log(falsch.length ? 'FALSCH: ' + falsch.join(', ') : 'alle Lagen richtig');
process.exit(falsch.length || fehler.length ? 1 : 0);
