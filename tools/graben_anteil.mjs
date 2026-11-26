import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
// G7h-2 (2026-11-26): Anteil der gezeichneten Grabenfläche (Sohle, Breite GW um die Mittellinie TR), der in Grabenfeldern liegt (Ziel ≥ 85 %). Aufruf: node tools/graben_anteil.mjs [karte …] (Vorschau-Server nötig)
const sleep = ms => new Promise(r => setTimeout(r, ms)), port = 9500 + Math.floor(Math.random() * 300);
const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', ...(process.env.OHNE_GPU ? ['--disable-gpu', '--use-angle=swiftshader'] : []), `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'armgel-'))}`, '--no-first-run', '--mute-audio', '--disable-background-timer-throttling', '--disable-renderer-backgrounding', 'about:blank'], { stdio: 'ignore' });
let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {}, fehler = []; ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; return; } if (m.method === 'Runtime.exceptionThrown') fehler.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') fehler.push(m.params.args.map(a => a.value ?? a.description).join(' ').slice(0, 200)); };
const cmd = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async x => { const r = await cmd('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text); return r.result?.result?.value; };
await cmd('Runtime.enable'); await cmd('Page.enable'); await cmd('Page.addScriptToEvaluateOnNewDocument', { source: "try{localStorage.setItem('arm.ton','0')}catch(e){}" });
const hell = () => ev("(() => { const c = document.getElementById('map'), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let s = 0, n = 0; for (let i = 0; i < d.length; i += 4 * 997) { s += d[i] + d[i + 1] + d[i + 2]; n++; } return s / n / 3; })()");
const KARTEN = process.argv.slice(2).length ? process.argv.slice(2) : ['grauwall'];
for (const karte of KARTEN) {
  await cmd('Page.navigate', { url: 'http://127.0.0.1:8765/index.html' }); await sleep(5000);
  await ev(`(async () => { const W = ms => new Promise(r => setTimeout(r, ms)), click = t => { const b = [...document.querySelectorAll('button')].find(b => b.offsetParent && b.textContent.trim().toLowerCase().includes(t)); if (b) b.click(); return !!b; };
    click('neue schlacht'); await W(700); const rb = document.querySelector('input[name=map][value=${karte}]'); if (rb) { rb.click(); rb.dispatchEvent(new Event('change', { bubbles: true })); await W(400); }
    for (const t of ['weiter', 'weiter', 'die schlacht']) { click(t); await W(700); } await W(2500); click('schlacht beginnen'); await W(4000); return true; })()`);
  for (let i = 0; i < 40 && (await hell()) < 12; i++) await sleep(500);
  const m = await ev(`(() => { const B = __dbg.gbw; if (!B || !B.TR) return null; const G = __dbg.G, R = B.R, F = []; for (let c = 0; c < G.map.length; c++) for (let r = 0; r < G.map[0].length; r++) F.push([c, r, ...B.hexC(c, r)]);
    const feld = (x, y) => { let b = null, bd = 1e9; for (const f of F) { const d = (f[2] - x) ** 2 + (f[3] - y) ** 2; if (d < bd) { bd = d; b = f; } } return b; };
    const HW = R * 0.475, schritt = R * 0.05; let n = 0, drin = 0; const aussen = {};   // Sohle G7g: 0,95 R breit
    B.TR.forEach(pts => { for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], b = pts[i + 1], l = Math.hypot(b[0] - a[0], b[1] - a[1]); if (l < 1) continue; const ux = (b[0] - a[0]) / l, uy = (b[1] - a[1]) / l;
      for (let s = schritt / 2; s < l; s += schritt) for (let q = -HW + schritt / 2; q < HW; q += schritt) { const x = a[0] + ux * s - uy * q, y = a[1] + uy * s + ux * q, f = feld(x, y); n++; if (G.map[f[0]][f[1]].t === 'trench') drin++; else aussen[f[0] + ',' + f[1] + ' ' + G.map[f[0]][f[1]].t] = (aussen[f[0] + ',' + f[1] + ' ' + G.map[f[0]][f[1]].t] || 0) + 1; } } });
    return { anteil: +(drin / n * 100).toFixed(1), proben: n, aussen: Object.entries(aussen).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => k + ': ' + (v / n * 100).toFixed(1) + ' %') }; })()`);
  console.log(karte, JSON.stringify(m));
}
ch.kill();
