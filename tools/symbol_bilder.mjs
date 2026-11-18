// Vergleichsbilder für Symbol-Tausch: je Breite (1280, 1920, 2560) drei Aufnahmen in voller Auflösung –
// „auswahl“ (Hauptmann gewählt: Aktionsleiste, Einheitenkarte, Marken an der Figur), „marken“ (dazu „Alle Marken“ an),
// „karte“ (ganze Karte: Strategie-Marken mit Einheitensymbolen).
// Aufruf: node tools/symbol_bilder.mjs <kennung>   → entwurf/probe/symbole/<kennung>_<breite>_<art>.webp
// Vorschau-Server auf 127.0.0.1:8765 muss laufen; Chrome läuft unsichtbar und stumm.
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const TAG = process.argv[2] || 'probe', OUT = 'entwurf/probe/symbole';
const URL = process.env.URL || 'http://127.0.0.1:8765/index.html';
const BREITEN = [[1280, 800], [1920, 1080], [2560, 1440]];
mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms)), port = 9500 + Math.floor(Math.random() * 300);
const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'armsym-'))}`, '--no-first-run', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {}; ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; } };
const cmd = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async x => { const r = await cmd('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true }); return r.result?.exceptionDetails ? 'ERR ' + (r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text) : r.result?.result?.value; };
const shot = async name => { const r = await cmd('Page.captureScreenshot', { format: 'webp', quality: 88 }); writeFileSync(join(OUT, name + '.webp'), Buffer.from(r.result.data, 'base64')); console.log(' ', name); };
await cmd('Page.enable');
await cmd('Page.addScriptToEvaluateOnNewDocument', { source: "try{localStorage.setItem('arm.ton','0')}catch(e){}" });
for (const [w, h] of BREITEN) {
  await cmd('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false });
  await cmd('Page.navigate', { url: URL }); await sleep(5000);
  const lauf = await ev(`(async () => { const W = ms => new Promise(r => setTimeout(r, ms));
    const click = t => { const b = [...document.querySelectorAll('button')].find(b => b.offsetParent && b.textContent.trim().toLowerCase().includes(t)); if (b) b.click(); return !!b; };
    for (const t of ['neue schlacht', 'weiter', 'weiter', 'die schlacht']) { click(t); await W(700); }
    await W(2500); click('schlacht beginnen'); await W(3500);
    for (let i = 0; i < 40 && !(__dbg.sel && __dbg.sel.type === 'hauptA'); i++) { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', code: 'Tab', bubbles: true })); await W(250); }
    await W(1500); return __dbg.sel && __dbg.sel.type; })()`);
  if (lauf !== 'hauptA') { console.log('FEHLER', w, lauf); continue; }
  await shot(`${TAG}_${w}_auswahl`);
  await ev(`document.getElementById('btnMarks').click()`); await sleep(1200);
  await shot(`${TAG}_${w}_marken`);
  await ev(`(async () => { const W = ms => new Promise(r => setTimeout(r, ms)); document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true })); await W(300);
    for (let i = 0; i < 6 && !/Karte/.test(document.getElementById('btnZoom').textContent); i++) { document.getElementById('btnZoom').click(); await W(700); } })()`);
  await sleep(2500);
  await shot(`${TAG}_${w}_karte`);
}
ws.close(); ch.kill();
