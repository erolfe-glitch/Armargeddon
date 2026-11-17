// Test „Bild = Regel“ beim Stacheldraht (Bildteil): In der neuen Ansicht mit Gelände-Bausteinen muss jedes Drahtfeld sichtbar
// Draht zeigen und kein anderes Feld. Geprüft auf der Grauwall-Karte und mit zufällig verteiltem Draht (auch auf Straßen).
// Aufruf: node tools/test_draht_bild.mjs   (Vorschau-Server auf 127.0.0.1:8765 muss laufen; Chrome läuft unsichtbar und stumm)
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const URL = process.env.URL || 'http://127.0.0.1:8765/index.html', RUNS = +(process.env.RUNS || 25);
const sleep = ms => new Promise(r => setTimeout(r, ms)), port = 9500 + Math.floor(Math.random() * 300);
const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'armdraht-'))}`, '--no-first-run', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {}; ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; } };
const cmd = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async x => { const r = await cmd('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true }); return r.result?.exceptionDetails ? 'ERR ' + (r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text) : r.result?.result?.value; };
await cmd('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
await cmd('Page.enable'); await cmd('Page.addScriptToEvaluateOnNewDocument', { source: "try{localStorage.setItem('arm.hilfen', JSON.stringify({tilt:true}))}catch(e){}" });
await cmd('Page.navigate', { url: URL }); await sleep(5000);
await ev(`[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='In die Schlacht').click()`);
for (let i = 0; i < 40; i++) { if (await ev(`!!(window.__dbg && __dbg.gbw)`)) break; await sleep(300); }
const res = await ev(`(async () => {
  const D = __dbg, G = D.G, cmp = () => { const w = D.gbw, have = w.drahtFelder, bad = [];
    for (let c = 0; c < G.map.length; c++) for (let r = 0; r < G.map[c].length; r++) { const isW = G.map[c][r].t === 'wire', drawn = have.has(c + ',' + r); if (isW !== drawn) bad.push((isW ? 'unsichtbar ' : 'falsch gezeichnet ') + c + ',' + r + (G.map[c][r].road ? ' (Straße)' : '')); }
    return bad; };
  const out = { karte: cmp(), zufall: [], felder: 0, strasse: 0 };
  const free = []; for (let c = 0; c < G.map.length; c++) for (let r = 0; r < G.map[c].length; r++) if (['open', 'mud', 'crater', 'wire'].includes(G.map[c][r].t)) free.push([c, r]);
  for (let run = 0; run < ${RUNS}; run++) {
    for (const [c, r] of free) G.map[c][r].t = Math.random() < 0.35 ? 'wire' : 'open';
    for (const [c, r] of free) if (G.map[c][r].t === 'wire') { out.felder++; if (G.map[c][r].road) out.strasse++; }
    out.zufall.push(...cmp());
  }
  return JSON.stringify(out);
})()`);
ws.close(); ch.kill();
const o = JSON.parse(res.startsWith('ERR') ? '{"err":' + JSON.stringify(res) + '}' : res);
if (o.err) { console.log('FEHLER', o.err); process.exit(1); }
console.log(`Grauwall: ${o.karte.length ? 'FEHLER ' + o.karte.join(', ') : 'ok – jedes Drahtfeld zeigt Draht, kein anderes'}`);
console.log(`Zufall (${RUNS} Läufe, ${o.felder} Drahtfelder, davon ${o.strasse} auf Straßen): ${o.zufall.length ? 'FEHLER ' + o.zufall.slice(0, 10).join(', ') : 'ok'}`);
process.exit(o.karte.length || o.zufall.length ? 1 : 0);
