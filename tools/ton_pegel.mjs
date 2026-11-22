// F95 Tonmischung (2026-11-22): Pegel aller Töne aus src/sound.js messen (unsichtbarer Chrome, decodeAudioData).
// Je Schlüssel: Spitze (dBFS), lautestes 400-ms-Fenster RMS (dBFS, „kurzzeitig laut“), RMS über den hörbaren Teil, Länge.
// Dazu die feste Lautstärke im Code für die wichtigsten Plätze (playSound-Aufrufe mit fester Zahl, gemittelt) → wirksamer Pegel.
// Aufruf: node tools/ton_pegel.mjs > entwurf/postfach/ton_pegel.json   (Vorschau-Server auf 127.0.0.1:8765)
import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const sleep = ms => new Promise(r => setTimeout(r, ms)), port = 9500 + Math.floor(Math.random() * 300);
const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'armpegel-'))}`, '--no-first-run', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {};
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; } };
const cmd = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async x => { const r = await cmd('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true }); return r.result?.exceptionDetails ? 'ERR ' + (r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text) : r.result?.result?.value; };
await cmd('Runtime.enable'); await cmd('Page.enable');
await cmd('Page.navigate', { url: 'http://127.0.0.1:8765/tonprobe.html' }); await sleep(6000);
const pegel = await ev(`(async () => {
  const S = window.SOUNDS || {}, ac = new OfflineAudioContext(1, 48000, 48000), out = {};
  const db = x => x > 0 ? +(20 * Math.log10(x)).toFixed(1) : -99;
  for (const k of Object.keys(S)) {
    try {
      const buf = await (await fetch(S[k])).arrayBuffer(), a = await ac.decodeAudioData(buf), sr = a.sampleRate, n = a.length;
      const ch = []; for (let c = 0; c < a.numberOfChannels; c++) ch.push(a.getChannelData(c));
      let pk = 0, s2 = 0, nh = 0; const mono = new Float32Array(n);
      for (let i = 0; i < n; i++) { let v = 0; for (const d of ch) v += d[i]; v /= ch.length; mono[i] = v; const av = Math.abs(v); if (av > pk) pk = av; }
      const thr = pk * 0.03; for (let i = 0; i < n; i++) if (Math.abs(mono[i]) > thr) { s2 += mono[i] * mono[i]; nh++; }
      const w = Math.min(n, Math.round(sr * 0.4)); let ws2 = 0, best = 0; for (let i = 0; i < n; i++) { ws2 += mono[i] * mono[i]; if (i >= w) ws2 -= mono[i - w] * mono[i - w]; if (i >= w - 1 && ws2 > best) best = ws2; }
      out[k] = { spitze: db(pk), laut400: db(Math.sqrt(best / w)), rms: db(Math.sqrt(s2 / Math.max(1, nh))), s: +(n / sr).toFixed(2) };
    } catch (e) { out[k] = { fehler: String(e).slice(0, 60) }; }
  }
  return out; })()`);
ws.close(); ch.kill();
// Feste Lautstärken im Code: playSound('<platz>', <zahl>) → Mittel je Platz
const ui = readFileSync('src/ui.js', 'utf8'), vol = {};
for (const m of ui.matchAll(/playSound\('([A-Za-z0-9_]+)',\s*([0-9.]+)/g)) (vol[m[1]] = vol[m[1]] || []).push(+m[2]);
const codeVol = Object.fromEntries(Object.entries(vol).map(([k, v]) => [k, +(v.reduce((a, b) => a + b, 0) / v.length).toFixed(2)]));
console.log(JSON.stringify({ pegel, codeVol }, null, 0));
