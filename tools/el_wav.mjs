// V3 (Punkt 111, 2026-11-26): dekodiert die neuen Sprüche sound-quelle/Voices/eigene/el/<fraktion>/<id>.mp3 im stummen Headless-Chrome
// zu WAV (Mono 48 kHz) nach sound-quelle/Voices/eigene/el/wav/<id>.wav – Grundlage für tools/schlachtfunk.py.
// Aufruf: node tools/el_wav.mjs [id …]   (ohne ids: alle aus entwurf/stimmen_texte.csv, schon vorhandene werden übersprungen)
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..'), EL = join(ROOT, 'sound-quelle', 'Voices', 'eigene', 'el'), OUT = join(EL, 'wav');
mkdirSync(OUT, { recursive: true });
const args = process.argv.slice(2);
const ids = args.length ? args : readFileSync(join(ROOT, 'entwurf', 'stimmen_texte.csv'), 'utf8').replace(/^\uFEFF/, '').trim().split(/\r?\n/).slice(1).map(l => l.split(';')[0]);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const port = 9400 + Math.floor(Math.random() * 300);
const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', ...(process.env.OHNE_GPU ? ['--disable-gpu', '--use-angle=swiftshader'] : []), `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'armel-'))}`, '--no-first-run', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {}; ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; } };
const cmd = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const DEC = `async url => {
  const b = await (await fetch(url)).arrayBuffer(), ab = await new OfflineAudioContext(1, 1, 48000).decodeAudioData(b);
  const n = ab.length, y = new Float32Array(n); for (let c = 0; c < ab.numberOfChannels; c++) { const d = ab.getChannelData(c); for (let i = 0; i < n; i++) y[i] += d[i] / ab.numberOfChannels; }
  const buf = new DataView(new ArrayBuffer(44 + n * 2)), w = (o, s) => { for (let i = 0; i < s.length; i++) buf.setUint8(o + i, s.charCodeAt(i)); };
  w(0, 'RIFF'); buf.setUint32(4, 36 + n * 2, true); w(8, 'WAVEfmt '); buf.setUint32(16, 16, true); buf.setUint16(20, 1, true); buf.setUint16(22, 1, true);
  buf.setUint32(24, 48000, true); buf.setUint32(28, 96000, true); buf.setUint16(32, 2, true); buf.setUint16(34, 16, true); w(36, 'data'); buf.setUint32(40, n * 2, true);
  for (let i = 0; i < n; i++) buf.setInt16(44 + i * 2, Math.max(-1, Math.min(1, y[i])) * 32767, true);
  const u = new Uint8Array(buf.buffer); let s = ''; for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000)); return btoa(s); }`;
let n = 0, fehl = [];
for (const k of ids) {
  const ziel = join(OUT, k + '.wav'); if (!args.length && existsSync(ziel)) continue;
  const q = join(EL, k.startsWith('K_') ? 'konkordat' : 'aschenwacht', k + '.mp3'); if (!existsSync(q)) { fehl.push(k + ' (fehlt)'); continue; }
  const url = 'data:audio/mpeg;base64,' + readFileSync(q).toString('base64');
  const r = await cmd('Runtime.evaluate', { expression: `(${DEC})(${JSON.stringify(url)})`, awaitPromise: true, returnByValue: true });
  const v = r.result?.result?.value; if (typeof v !== 'string') { fehl.push(k); continue; }
  writeFileSync(ziel, Buffer.from(v, 'base64')); n++;
}
console.log('dekodiert', n, 'Fehler', fehl.length, fehl.slice(0, 10).join(' | '));
ws.close(); ch.kill(); process.exit(0);
