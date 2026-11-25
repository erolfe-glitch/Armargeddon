// Kodiert die WAV-Zwischenstände von tools/stimmen_cut.py als AAC (ADTS, Mono 96 kbit/s) für die Hörprobe entwurf/probe/stimmen.html.
// Im lokalen, stummen Headless-Chrome (WebCodecs AudioEncoder); die WAV-Daten gehen per CDP in die Seite. Vorschau-Server muss laufen (localhost = sichere Seite).
// Aufruf: node tools/stimmen_aac.mjs <Ordner mit WAV und stimmen_liste.json>
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, readdirSync, copyFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = process.argv[2], OUT = join(ROOT, 'entwurf', 'probe', 'stimmen');
mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const port = 9400 + Math.floor(Math.random() * 300);
const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', ...(process.env.OHNE_GPU ? ['--disable-gpu', '--use-angle=swiftshader'] : []), `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'armstim-'))}`, '--no-first-run', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {}; ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; } };
const cmd = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
await cmd('Page.navigate', { url: 'http://127.0.0.1:8765/tools/sound_bau.json' }); await sleep(800);   // sichere Seite (localhost) für WebCodecs; Server: python -m http.server 8765
const ENC = `async b64 => {
  const bin = atob(b64), u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  const SR = 48000, ab = await new OfflineAudioContext(1, 1, SR).decodeAudioData(u.buffer), y = ab.getChannelData(0), L = y.length;
  const parts = []; let err = null;
  const enc = new AudioEncoder({ output: c => { const v = new Uint8Array(c.byteLength); c.copyTo(v); parts.push(v); }, error: e => err = e });
  enc.configure({ codec: 'mp4a.40.2', sampleRate: SR, numberOfChannels: 1, bitrate: 96000, aac: { format: 'adts' } });
  const F = 4096; for (let i = 0; i < L; i += F) { const f = y.slice(i, Math.min(L, i + F)); enc.encode(new AudioData({ format: 'f32-planar', sampleRate: SR, numberOfFrames: f.length, numberOfChannels: 1, timestamp: Math.round(i / SR * 1e6), data: f })); }
  await enc.flush(); enc.close(); if (err) throw err;
  let tot = 0; for (const p of parts) tot += p.length; const out = new Uint8Array(tot); let k = 0; for (const p of parts) { out.set(p, k); k += p.length; }
  let s = ''; for (let i = 0; i < out.length; i += 0x8000) s += String.fromCharCode.apply(null, out.subarray(i, i + 0x8000)); return btoa(s); }`;
let n = 0, kb = 0;
for (const f of readdirSync(SRC).filter(f => f.endsWith('.wav')).sort()) {
  const r = await cmd('Runtime.evaluate', { expression: `(${ENC})(${JSON.stringify(readFileSync(join(SRC, f)).toString('base64'))})`, awaitPromise: true, returnByValue: true });
  const v = r.result?.result?.value; if (typeof v !== 'string') { console.log('Fehler', f, JSON.stringify(r.result?.exceptionDetails || r).slice(0, 200)); continue; }
  const buf = Buffer.from(v, 'base64'); writeFileSync(join(OUT, f.replace('.wav', '.aac')), buf); n++; kb += buf.length / 1024;
}
copyFileSync(join(SRC, 'stimmen_liste.json'), join(OUT, 'stimmen_liste.json'));
writeFileSync(join(OUT, 'stimmen_liste.js'), `// Erzeugt von tools/stimmen_aac.mjs aus stimmen_liste.json (tools/stimmen_cut.py)
window.STIMMEN = ${readFileSync(join(SRC, 'stimmen_liste.json'), 'utf8')};
`);   // Liste als Skript (Seite lädt sie ohne fetch)
console.log(`${n} Dateien, ${Math.round(kb)} KB → entwurf/probe/stimmen/`);
ws.close(); ch.kill(); process.exit(0);
