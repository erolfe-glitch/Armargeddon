// L1 (2026-11-25): Bildzeit messen wie die Fable-Prüfung – unsichtbarer Chrome 1920×1080, Abstand zwischen zwei Bildern (requestAnimationFrame) = Arbeitszeit je Bild.
// Je Karte und Fassung (alt = window.LEISTUNG_ALT, neu = Standard): Startansicht (Zoom 1) und ganze Karte, je 5 s, Mittel und schlechteste 5 %.
// Dazu: Bilder je Sekunde in den ersten 10 s nach dem Schlachtstart (offener Punkt Sankt Ruß) und Vergleichsbilder der ganzen Karte.
// Aufruf: node tools/leistung_messen.mjs   (Vorschau-Server auf 127.0.0.1:8765) → entwurf/probe/leistung_l1/
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const OUT = 'entwurf/probe/leistung_l1', sleep = ms => new Promise(r => setTimeout(r, ms)), port = 9500 + Math.floor(Math.random() * 300);
mkdirSync(OUT, { recursive: true });
const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'armlst-'))}`, '--no-first-run', '--mute-audio', '--disable-background-timer-throttling', '--disable-renderer-backgrounding', 'about:blank'], { stdio: 'ignore' });
let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {}, fehler = []; ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; return; } if (m.method === 'Runtime.exceptionThrown') fehler.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') fehler.push(m.params.args.map(a => a.value ?? a.description).join(' ').slice(0, 200)); };
const cmd = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async x => { const r = await cmd('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text); return r.result?.result?.value; };
await cmd('Runtime.enable'); await cmd('Page.enable'); await cmd('Page.addScriptToEvaluateOnNewDocument', { source: "try{localStorage.setItem('arm.ton','0')}catch(e){}" });
await cmd('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
const bild = async n => { const r = await cmd('Page.captureScreenshot', { format: 'jpeg', quality: 88 }); writeFileSync(join(OUT, n + '.jpg'), Buffer.from(r.result.data, 'base64')); };
const messen = ms => ev(`new Promise(res => { const t = []; let l = performance.now(); const e = l + ${ms}; const f = n => { t.push(n - l); l = n; if (n < e) requestAnimationFrame(f); else { t.shift(); t.sort((a, b) => a - b); const m = t.reduce((a, b) => a + b, 0) / t.length; res({ n: t.length, mittel: +m.toFixed(1), p95: +t[Math.floor(t.length * 0.95)].toFixed(1), max: +t[t.length - 1].toFixed(1) }); } }; requestAnimationFrame(f); })`);
const KARTEN = (process.env.KARTEN || 'grauwall,sanktruss').split(','), FASS = { alt: 'window.LEISTUNG_ALT = true', neu: '' }, erg = {};
for (const karte of KARTEN) for (const [v, js] of Object.entries(FASS)) {
  await cmd('Page.navigate', { url: 'http://127.0.0.1:8765/index.html' }); await sleep(5000); if (js) await ev(`(() => { ${js}; return true; })()`);
  await ev(`(async () => { const W = ms => new Promise(r => setTimeout(r, ms)), click = t => { const b = [...document.querySelectorAll('button')].find(b => b.offsetParent && b.textContent.trim().toLowerCase().includes(t)); if (b) b.click(); return !!b; };
    click('neue schlacht'); await W(700); const rb = document.querySelector('input[name=map][value=${karte}]'); if (rb) { rb.click(); rb.dispatchEvent(new Event('change', { bubbles: true })); await W(400); }
    for (const t of ['weiter', 'weiter', 'die schlacht']) { click(t); await W(700); } await W(1500); click('schlacht beginnen'); return true; })()`);
  const start = await ev(`new Promise(res => { let n = 0; const e = performance.now() + 10000, s = []; let s0 = performance.now(), k = 0; const f = t => { k++; if (t - s0 >= 1000) { s.push(k); k = 0; s0 = t; } if (t < e) requestAnimationFrame(f); else res(s); }; requestAnimationFrame(f); })`);   // Bilder je Sekunde in den ersten 10 s
  const r = { start };
  const c = await ev(`(() => [__dbg.CAM.x, __dbg.CAM.y])()`);
  await ev(`(() => { __dbg.camSetzen(${c[0]}, ${c[1]}, 1); return true; })()`); await sleep(1500); r.zoom1 = await messen(5000);
  await ev(`(() => { __dbg.camSetzen(${c[0]}, ${c[1]}, typeof __dbg.ZFIT === 'function' ? __dbg.ZFIT() : __dbg.ZFIT); return true; })()`); await sleep(1500); r.ganz = await messen(5000); await bild(`${karte}_${v}_ganz`);
  const m = await ev(`(() => { const u = __dbg.G.units.find(u => u.type === 'kohorte' && u.status !== 'dead') || __dbg.G.units[0]; return __dbg.mitte(u.c, u.r); })()`);
  await ev(`(() => { __dbg.camSetzen(${m[0]}, ${m[1]} - 40, 2.2); return true; })()`); await sleep(1500); await bild(`${karte}_${v}_nah`);
  erg[karte + '_' + v] = r; console.log(karte, v, JSON.stringify(r));
}
writeFileSync(join(OUT, 'messung.json'), JSON.stringify(erg, null, 1));
console.log(fehler.length ? 'Fehler: ' + [...new Set(fehler)].slice(0, 5).join(' | ') : 'keine Seitenfehler'); ws.close(); ch.kill(); process.exit(0);
