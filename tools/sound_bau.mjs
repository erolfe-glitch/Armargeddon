// Baut die Töne nach tools/sound_bau.json neu in src/sound.js ein.
// Ablauf je Eintrag (im lokalen, stummen Headless-Chrome, ohne zusätzliche Programme):
//   Datei aus sound-quelle/ dekodieren (WAV, FLAC, MP3, OGG) → Mono, 44,1 kHz → Stille am Anfang weg → Ausschnitt (st, max)
//   → Ende bei Stille kürzen, kurz ausblenden → Lautstärke angleichen (lvl, Spitze höchstens −1 dB) → AAC (ADTS) kodieren.
// Alte Einträge in src/sound.js bleiben erhalten (außer „drop“), neue kommen als <pool>_<n> dazu; SOUND_POOLS ordnet Plätze und Seiten zu.
// Kopien der neuen Töne: ui-quelle/toene/<schlüssel>.aac. Aufruf: node tools/sound_bau.mjs   (Server: python -m http.server 8765 im Projektordner)
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SPEC = JSON.parse(readFileSync(join(ROOT, 'tools', 'sound_bau.json'), 'utf8'));
const BASE = process.env.SND_URL || 'http://127.0.0.1:8765';
const sleep = ms => new Promise(r => setTimeout(r, ms));

const port = 9700 + Math.floor(Math.random() * 200);
const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'armsnd-'))}`, '--no-first-run', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {}; ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; } };
const cmd = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
await cmd('Page.navigate', { url: BASE + '/tools/sound_bau.json' }); await sleep(800);

// Verarbeitung im Browser (eine Datei je Aufruf)
const PROC = `async (url, o) => {
  const SR = 44100, buf = await (await fetch(url)).arrayBuffer();
  const ab = await new OfflineAudioContext(1, 1, SR).decodeAudioData(buf);
  const n = ab.length, x = new Float32Array(n);
  for (let c = 0; c < ab.numberOfChannels; c++) { const d = ab.getChannelData(c); for (let i = 0; i < n; i++) x[i] += d[i] / ab.numberOfChannels; }
  let pk = 0; for (let i = 0; i < n; i++) pk = Math.max(pk, Math.abs(x[i]));
  const thr = pk * 0.05; let on = 0; while (on < n && Math.abs(x[on]) < thr) on++; on = Math.max(0, on - Math.round(SR * 0.01));
  let last = n - 1; while (last > on && Math.abs(x[last]) < pk * 0.01) last--;
  let a = o.ab != null ? Math.round(o.ab * SR) : o.st < 0 ? Math.max(on, last + Math.round(o.st * SR)) : on + Math.round((o.st || 0) * SR);   // ab = fester Start in der Quelle (lange Einleitung)
  let b = Math.min(n, a + Math.round(o.max * SR)), cut = b < last;
  // Ende: nach dem letzten 20-ms-Fenster über −40 dB der Spitze kürzen
  const W = Math.round(SR * 0.02); let e2 = b; for (let i = b - W; i > a; i -= W) { let m = 0; for (let j = i; j < i + W; j++) m = Math.max(m, Math.abs(x[j])); if (m > pk * 0.01) { e2 = Math.min(b, i + W * 2); break; } }
  if (e2 < b) { b = e2; cut = false; }
  // stereo (Musik, 2026-11-17): beide Kanäle getrennt behalten; Analyse (Einsatz, Ende, Lautstärke) weiter über die Mono-Summe
  const y = x.slice(a, b), L = y.length, fo = Math.min(L, Math.round(SR * (cut ? Math.min(0.35, o.max * 0.15) : 0.04))), fi = Math.min(L, Math.round(SR * 0.004));
  const kan = o.stereo && ab.numberOfChannels > 1 ? [0, 1].map(c => ab.getChannelData(c).slice(a, b)) : [y];
  for (const z of kan) { for (let i = 0; i < fi; i++) z[i] *= i / fi; for (let i = 0; i < fo; i++) z[L - 1 - i] *= i / fo; }
  if (kan.length > 1) for (let i = 0; i < fi; i++) y[i] *= i / fi;
  // Lautstärke: 90-%-Wert der 50-ms-RMS-Fenster auf lvl dB, Spitze höchstens −1 dB
  const R = [], w = Math.round(SR * 0.05); for (let i = 0; i + w <= L; i += w) { let s = 0; for (let j = i; j < i + w; j++) s += y[j] * y[j]; R.push(Math.sqrt(s / w)); }
  R.sort((p, q) => p - q); const r90 = R.length ? R[Math.floor(R.length * 0.9)] : 0.1; let p2 = 0; for (let i = 0; i < L; i++) p2 = Math.max(p2, Math.abs(y[i]));
  const g = Math.min(Math.pow(10, (o.lvl - 20 * Math.log10(r90 || 1e-6)) / 20), 0.89 / (p2 || 1));
  for (const z of kan) for (let i = 0; i < L; i++) z[i] *= g;
  // AAC (ADTS) kodieren
  const parts = []; let err = null;
  const enc = new AudioEncoder({ output: ch => { const u = new Uint8Array(ch.byteLength); ch.copyTo(u); parts.push(u); }, error: e => err = e });
  const NC = kan.length; enc.configure({ codec: 'mp4a.40.2', sampleRate: SR, numberOfChannels: NC, bitrate: o.stereo && o.kbps ? o.kbps * 1000 : 96000, aac: { format: 'adts' } });   // Bitrate nur für stereo-Einträge (kbps), sonst wie bisher 96 kbit/s
  const F = 1024 * 8; for (let i = 0; i < L; i += F) { const j = Math.min(L, i + F), n2 = j - i, f = new Float32Array(n2 * NC); kan.forEach((z, c) => f.set(z.subarray(i, j), c * n2));
    enc.encode(new AudioData({ format: 'f32-planar', sampleRate: SR, numberOfFrames: n2, numberOfChannels: NC, timestamp: Math.round(i / SR * 1e6), data: f })); }
  await enc.flush(); enc.close(); if (err) throw err;
  let tot = 0; for (const p of parts) tot += p.length; const out = new Uint8Array(tot); let k = 0; for (const p of parts) { out.set(p, k); k += p.length; }
  let bin = ''; for (let i = 0; i < out.length; i += 0x8000) bin += String.fromCharCode.apply(null, out.subarray(i, i + 0x8000));
  return { b64: btoa(bin), dur: +(L / SR).toFixed(2), src: +(n / SR).toFixed(2), start: +(a / SR).toFixed(2), gainDb: +(20 * Math.log10(g)).toFixed(1), kb: Math.round(out.length / 1024) };
}`;

// Alte Töne aus src/sound.js lesen (Schlüssel → Daten-URL), Kopfkommentar behalten
const old = readFileSync(join(ROOT, 'src', 'sound.js'), 'utf8');
const head = old.slice(0, old.indexOf('(function (root)')).split('\n').filter(l => !l.startsWith('// Neu (2026-11-16, tools/sound_bau') && !l.startsWith('// neue Töne als <platz>_<n>')).join('\n');
const OLD = {}; for (const m of old.matchAll(/^  ([A-Za-z0-9_]+): '(data:audio\/[^']+)',?$/gm)) OLD[m[1]] = m[2];
const drop = new Set(SPEC.drop || []);
// wiederholbar: Töne aus einem früheren Lauf (<platz>_<n>) werden neu erzeugt, nicht als alt übernommen
const POOLNAMES = new Set(SPEC.eintraege.map(e => e.pool)); for (const k of Object.keys(OLD)) { const m = k.match(/^(.+)_(\d+)$/); if (m && POOLNAMES.has(m[1])) delete OLD[k]; }
const NEW = {}, POOLS = {}, rows = [], cnt = {};
for (const e of SPEC.eintraege) {
  POOLS[e.pool] = POOLS[e.pool] || [];
  if (e.leer) { rows.push({ pool: e.pool, key: '–', s: null, f: '(noch leer)', note: e.note }); continue; }   // Platz angelegt, Dateien folgen
  if (e.alt) { if (!OLD[e.alt]) { console.log('fehlt alt:', e.alt); continue; } POOLS[e.pool].push([e.alt, e.s || null]); rows.push({ pool: e.pool, key: e.alt, s: e.s, f: '(vorhanden) ' + e.alt }); continue; }
  const key = e.pool + '_' + (cnt[e.pool] = (cnt[e.pool] || 0) + 1);
  const url = BASE + '/sound-quelle/' + e.f.split('/').map(encodeURIComponent).join('/');
  const r = await cmd('Runtime.evaluate', { expression: `(${PROC})(${JSON.stringify(url)}, ${JSON.stringify({ st: e.st || 0, ab: e.ab, max: e.max || 3, lvl: e.lvl ?? -14, kbps: e.kbps, stereo: !!e.stereo })})`, awaitPromise: true, returnByValue: true });
  const v = r.result?.result?.value; if (v && !v.b64) console.log("Antwort ohne Daten:", JSON.stringify(v).slice(0, 300), JSON.stringify(r).slice(0, 300));
  if (!v) { console.log('FEHLER', e.f, JSON.stringify(r.result?.exceptionDetails?.exception?.description || r.result).slice(0, 300)); continue; }
  NEW[key] = 'data:audio/aac;base64,' + v.b64; POOLS[e.pool].push(e.w ? [key, e.s || null, e.w] : [key, e.s || null]);   // w = Gewicht (Hauptton öfter)
  mkdirSync(join(ROOT, 'ui-quelle', 'toene'), { recursive: true }); writeFileSync(join(ROOT, 'ui-quelle', 'toene', key + '.aac'), Buffer.from(v.b64, 'base64'));
  rows.push({ pool: e.pool, key, s: e.s, f: e.f, dur: v.dur, src: v.src, start: v.start, gain: v.gainDb, kb: v.kb, note: e.note });
  console.log(`${key.padEnd(18)} ${String(v.dur).padStart(6)} s  (Quelle ${v.src} s, ab ${v.start} s, ${v.gainDb > 0 ? '+' : ''}${v.gainDb} dB, ${v.kb} KB)  ${e.f}`);
}
ws.close(); ch.kill();

// Neue src/sound.js
const keep = Object.keys(OLD).filter(k => !drop.has(k));
const L = [head.trimEnd(),
  '// Neu (2026-11-16, tools/sound_bau.mjs nach entwurf/sound-liste.json): Tonplätze mit Varianten je Seite in SOUND_POOLS (A Konkordat, D Aschenwacht, null beide);',
  '// neue Töne als <platz>_<n> (AAC). Übersicht: entwurf/TONPLAETZE.md, Quellen und Lizenzen: CREDITS.md.',
  '(function (root) {', "'use strict';", 'root.SOUNDS = {'];
for (const k of keep) L.push(`  ${k}: '${OLD[k]}',`);
for (const k in NEW) L.push(`  ${k}: '${NEW[k]}',`);
L.push('};', 'root.SOUND_POOLS = ' + JSON.stringify(POOLS) + ';', '})(this);', '');
writeFileSync(join(ROOT, 'src', 'sound.js'), L.join('\n'));
writeFileSync(join(ROOT, 'entwurf', 'tonplaetze.json'), JSON.stringify(rows, null, 1));
console.log('src/sound.js', Math.round(L.join('\n').length / 1024), 'KB,', keep.length, 'alte +', Object.keys(NEW).length, 'neue Töne,', Object.keys(POOLS).length, 'Plätze');
process.exit(0);
