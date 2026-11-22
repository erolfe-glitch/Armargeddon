// Größen-Probe im Browser (Paket H Schritt 10): Grauwall ×1/×2/×3, Bildzeit bei Übersicht und nah, KI-Zug, Speicher, Ladezeit.
// Aufruf: node entwurf/probe/groesse/bild_zeit.mjs   (Vorschau-Server 127.0.0.1:8765; ohne Ton; Probekarten nur in dieser Sitzung)
import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const HIER = dirname(fileURLToPath(import.meta.url)), sleep = ms => new Promise(r => setTimeout(r, ms));
const probe = readFileSync(join(HIER, 'probekarte.js'), 'utf8').replace(/if \(typeof module[^\n]*/, '');
const inj = `try{localStorage.setItem('arm.ton','0')}catch(e){}
${probe}
(() => { let _E; Object.defineProperty(window, 'E', { configurable: true, get() { return _E; }, set(v) { _E = v; try { probeKarte(v, 2); probeKarte(v, 3); } catch (e) { console.error(e); } } }); })();`;
const erg = [];
for (const karte of ['grauwall', 'probe2', 'probe3']) {
  const port = 9600 + Math.floor(Math.random() * 300);
  const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'armgr-'))}`, '--mute-audio', '--enable-precise-memory-info', '--window-size=1920,1080', 'about:blank'], { stdio: 'ignore' });
  let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
  const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
  let id = 0; const pend = {}, fehler = [];
  ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; return; } if (m.method === 'Runtime.exceptionThrown') fehler.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); };
  const cmd = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async x => { const r = await cmd('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true }); return r.result?.exceptionDetails ? 'ERR ' + r.result.exceptionDetails.text : r.result?.result?.value; };
  await cmd('Runtime.enable'); await cmd('Page.enable'); await cmd('Page.addScriptToEvaluateOnNewDocument', { source: inj });
  await cmd('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
  const t0 = Date.now(); await cmd('Page.navigate', { url: 'http://127.0.0.1:8765/index.html' });
  for (let i = 0; i < 200 && !(await ev(`!!window.__dbg && [...document.querySelectorAll('button')].some(b => b.offsetParent && b.textContent.toLowerCase().includes('neue schlacht'))`)); i++) await sleep(100);
  const tMenu = Date.now() - t0;
  const t1 = Date.now();
  await ev(`(async () => { const W = ms => new Promise(r => setTimeout(r, ms)); const click = t => { const b = [...document.querySelectorAll('button')].find(b => b.offsetParent && b.textContent.trim().toLowerCase().includes(t)); if (b) b.click(); return !!b; };
    click('neue schlacht'); await W(700); const rb = document.querySelector('input[name=map][value=${karte}]'); if (rb) { rb.click(); rb.dispatchEvent(new Event('change', { bubbles: true })); await W(500); }
    for (const t of ['weiter', 'weiter', 'die schlacht']) { click(t); await W(700); } await W(1500); click('schlacht beginnen'); })()`);
  for (let i = 0; i < 300 && !(await ev(`!!(__dbg.G && !__dbg.G.aufstellung && __dbg.E.MAP.id === '${karte}' && !__dbg.busy)`)); i++) await sleep(100);
  const tSchlacht = Date.now() - t1;
  const info = JSON.parse(await ev(`JSON.stringify({ n: __dbg.G.units.length, cols: __dbg.E.COLS, rows: __dbg.E.ROWS, karte: __dbg.E.MAP.id })`));
  const frames = async ms => JSON.parse(await ev(`new Promise(res => { const d = []; let last = performance.now(); const t0 = last; const f = t => { d.push(t - last); last = t; if (t - t0 < ${ms}) requestAnimationFrame(f); else { d.sort((a, b) => a - b); const m = d.reduce((a, b) => a + b, 0) / d.length; res(JSON.stringify({ mittel: +m.toFixed(1), p95: +d[Math.floor(d.length * 0.95)].toFixed(1), max: +d[d.length - 1].toFixed(1), n: d.length })); } }; requestAnimationFrame(f); })`));
  await sleep(2000);
  const cam = JSON.parse(await ev(`JSON.stringify(__dbg.cam)`));
  await ev(`(() => { const c = __dbg.cam; __dbg.setCam(c.x, c.y, c.ZFIT); return 1; })()`); await sleep(800); const ueber = await frames(6000);
  await ev(`(() => { const c = __dbg.cam; __dbg.setCam(c.x, c.y, 2.2); return 1; })()`); await sleep(800); const nah = await frames(6000);
  await ev(`(() => { const c = __dbg.cam; __dbg.setCam(c.x, c.y, c.ZFIT); return 1; })()`); await sleep(500);
  // KI-Zug: Runde beenden, Bilder messen, bis der Spieler wieder dran ist
  const s0 = await ev(`__dbg.G.side`); const tk = Date.now();
  const kiP = ev(`new Promise(res => { const d = []; let last = performance.now(); const f = t => { d.push(t - last); last = t; if (__dbg.G.side !== '${s0}' || d.length < 30) requestAnimationFrame(f); else { d.sort((a, b) => a - b); res(JSON.stringify({ mittel: +(d.reduce((a, b) => a + b, 0) / d.length).toFixed(1), p95: +d[Math.floor(d.length * 0.95)].toFixed(1), max: +d[d.length - 1].toFixed(1), n: d.length })); } }; requestAnimationFrame(f); })`);
  await ev(`document.getElementById('btnEnd').click(), 1`);
  for (let i = 0; i < 1200 && (await ev(`__dbg.G.side`)) === s0; i++) await sleep(100);
  for (let i = 0; i < 1800 && (await ev(`__dbg.G.side`)) !== s0 && !(await ev(`__dbg.G.over`)); i++) await sleep(100);
  const kiDauer = Date.now() - tk; const ki = JSON.parse(await kiP);
  const mem = JSON.parse(await ev(`JSON.stringify({ heap: Math.round(performance.memory.usedJSHeapSize / 1048576), total: Math.round(performance.memory.totalJSHeapSize / 1048576) })`));
  const z = { karte, ...info, tMenu, tSchlacht, ueber, nah, ki, kiDauer, mem, fehler: fehler.slice(0, 3) };
  console.log(JSON.stringify(z)); erg.push(z);
  ws.close(); ch.kill(); await sleep(1000);
}
writeFileSync(join(HIER, 'ergebnis.json'), JSON.stringify(erg, null, 1));
