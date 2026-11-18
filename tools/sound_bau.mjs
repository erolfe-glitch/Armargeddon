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
// fo = Ausblendlänge am Ende (s), sonst automatisch; raus = Eintrag entfällt, Schlüssel der übrigen bleiben gleich (2026-11-18).
// Klangbearbeitung (2026-11-17, Spieltest Runde 2): rate = tiefer und langsamer abspielen (0,8 = 80 %), lp/hp = Tief-/Hochpass (Hz),
// bass = Bassanhebung (dB, Kuhschwanz bei 150 Hz), komp = weiches Begrenzen (Stärke, z. B. 4), mix = weitere Töne darunterlegen [{ f, at (s ab Beginn des Ausschnitts), db (Spitze relativ), ab, max, rate, lp, hp, bass }]
const PROC = `async (url, o) => {
  const SR = 44100;
  const lade = async (u, q) => {   // Datei → Mono-Float32 (mit rate/lp/hp/bass)
    const ab = await new OfflineAudioContext(1, 1, SR).decodeAudioData(await (await fetch(u)).arrayBuffer());
    if (!(q.rate || q.lp || q.hp || q.bass)) { const n = ab.length, x = new Float32Array(n); for (let c = 0; c < ab.numberOfChannels; c++) { const d = ab.getChannelData(c); for (let i = 0; i < n; i++) x[i] += d[i] / ab.numberOfChannels; } return [x, ab]; }
    const r = q.rate || 1, ctx = new OfflineAudioContext(1, Math.ceil(ab.length / r), SR), src = ctx.createBufferSource(); src.buffer = ab; src.playbackRate.value = r; let node = src;
    const bq = (type, f, g) => { const b = ctx.createBiquadFilter(); b.type = type; b.frequency.value = f; if (g != null) b.gain.value = g; node.connect(b); node = b; };
    if (q.hp) bq('highpass', q.hp); if (q.lp) bq('lowpass', q.lp); if (q.bass) bq('lowshelf', 150, q.bass);
    node.connect(ctx.destination); src.start(); const out = await ctx.startRendering(); return [out.getChannelData(0), ab];
  };
  const [x0, ab] = await lade(url, o), x = x0, n = x.length;
  let pk = 0; for (let i = 0; i < n; i++) pk = Math.max(pk, Math.abs(x[i]));
  const thr = pk * 0.05; let on = 0; while (on < n && Math.abs(x[on]) < thr) on++; on = Math.max(0, on - Math.round(SR * 0.01));
  let last = n - 1; while (last > on && Math.abs(x[last]) < pk * 0.01) last--;
  let a = o.ab != null ? Math.round(o.ab * SR) : o.st < 0 ? Math.max(on, last + Math.round(o.st * SR)) : on + Math.round((o.st || 0) * SR);   // ab = fester Start in der Quelle (lange Einleitung)
  let b = Math.min(n, a + Math.round(o.max * SR)), cut = b < last;
  // Ende: nach dem letzten 20-ms-Fenster über −40 dB der Spitze kürzen
  const W = Math.round(SR * 0.02); let e2 = b; for (let i = b - W; i > a; i -= W) { let m = 0; for (let j = i; j < i + W; j++) m = Math.max(m, Math.abs(x[j])); if (m > pk * 0.01) { e2 = Math.min(b, i + W * 2); break; } }
  if (e2 < b) { b = e2; cut = false; }
  // stereo (Musik, 2026-11-17): beide Kanäle getrennt behalten; Analyse (Einsatz, Ende, Lautstärke) weiter über die Mono-Summe
  let y = x.slice(a, b);
  for (const m of o.mix || []) {   // darunterlegen: Spitze des Zusatztons = Spitze des Haupttons + db
    const [z0] = await lade(m.url, m); let za = Math.round((m.ab || 0) * SR), zb = Math.min(z0.length, m.max ? za + Math.round(m.max * SR) : z0.length); const z = z0.subarray(za, zb);
    let pz = 0, py = 0; for (const v of z) pz = Math.max(pz, Math.abs(v)); for (const v of y) py = Math.max(py, Math.abs(v)); const gz = py / (pz || 1) * Math.pow(10, (m.db || 0) / 20), off = Math.round((m.at || 0) * SR);
    if (off + z.length > y.length) { const y2 = new Float32Array(off + z.length); y2.set(y); y = y2; b = a + y.length; }
    for (let i = 0; i < z.length; i++) y[off + i] += z[i] * gz;
  }
  if (o.komp) { let p = 0; for (const v of y) p = Math.max(p, Math.abs(v)); const k = o.komp, t = Math.tanh(k); for (let i = 0; i < y.length; i++) y[i] = Math.tanh(y[i] / (p || 1) * k) / t; }   // komp = weiches Begrenzen (Spitzen einzelner Knackser), damit leise Schritte lauter werden können
  const L = y.length, fo = Math.min(L, Math.round(SR * (o.fo != null ? o.fo : cut ? Math.min(0.35, o.max * 0.15) : 0.04))), fi = Math.min(L, Math.round(SR * 0.004));
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
const POOLNAMES = new Set([...SPEC.eintraege.map(e => e.pool), ...(SPEC.dropPools || [])]); /* dropPools: entfallene Plätze, ihre <platz>_<n> verschwinden */ for (const k of Object.keys(OLD)) { const m = k.match(/^(.+)_(\d+)$/); if (m && POOLNAMES.has(m[1])) delete OLD[k]; }
const NEW = {}, POOLS = {}, rows = [], cnt = {};
for (const e of SPEC.eintraege) {
  POOLS[e.pool] = POOLS[e.pool] || [];
  if (e.leer) { rows.push({ pool: e.pool, key: '–', s: null, f: '(noch leer)', note: e.note }); continue; }   // Platz angelegt, Dateien folgen
  if (e.alt) { if (!OLD[e.alt]) { console.log('fehlt alt:', e.alt); continue; } POOLS[e.pool].push([e.alt, e.s || null]); rows.push({ pool: e.pool, key: e.alt, s: e.s, f: '(vorhanden) ' + e.alt }); continue; }
  const key = e.pool + '_' + (cnt[e.pool] = (cnt[e.pool] || 0) + 1);
  if (e.raus) { rows.push({ pool: e.pool, key, s: e.s, f: '(entfernt) ' + e.f, note: e.raus }); continue; }   // raus = Ton entfällt, die Nummern der übrigen bleiben (2026-11-18)
  const url = BASE + '/sound-quelle/' + e.f.split('/').map(encodeURIComponent).join('/');
  const r = await cmd('Runtime.evaluate', { expression: `(${PROC})(${JSON.stringify(url)}, ${JSON.stringify({ st: e.st || 0, ab: e.ab, max: e.max || 3, fo: e.fo, lvl: e.lvl ?? -14, kbps: e.kbps, stereo: !!e.stereo, rate: e.rate, lp: e.lp, hp: e.hp, bass: e.bass, komp: e.komp, mix: (e.mix || []).map(m => ({ ...m, url: BASE + '/sound-quelle/' + m.f.split('/').map(encodeURIComponent).join('/') })) })})`, awaitPromise: true, returnByValue: true });
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
