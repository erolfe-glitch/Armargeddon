// Paket W1: prüft ein Video aus tools/video_partie.mjs im unsichtbaren Chrome (ohne ffmpeg): Dauer, Größe, Bewegung (Bilder an 4 Stellen), Pegel der Tonspur; Vorschaubild daneben.
// Aufruf: node tools/video_pruefen.mjs entwurf/probe/video/<paket>.mp4   (Vorschau-Server auf 127.0.0.1:8765)
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const DATEI = process.argv[2].split(String.fromCharCode(92)).join('/'); const sleep = ms => new Promise(r => setTimeout(r, ms)), port = 9500 + Math.floor(Math.random() * 300);
const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'armvp-'))}`, '--mute-audio', '--autoplay-policy=no-user-gesture-required', 'about:blank']);
let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {}; ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) pend[m.id](m); };
const cmd = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
await cmd('Page.navigate', { url: 'http://127.0.0.1:8765/tools/' }); await sleep(500);
const r = await cmd('Runtime.evaluate', { awaitPromise: true, returnByValue: true, expression: `(async () => {
  const url = '/${DATEI}', v = document.createElement('video'); v.muted = true; v.src = url; await new Promise(r => v.onloadeddata = r);
  if (!isFinite(v.duration)) { v.currentTime = 1e9; await new Promise(r => v.ontimeupdate = r); v.currentTime = 0; }
  const D = v.duration, c = document.createElement('canvas'); c.width = 480; c.height = Math.round(480 * v.videoHeight / v.videoWidth); const g = c.getContext('2d'), bilder = [], prob = [];
  let fps = null; { v.playbackRate = 1; await v.play(); let n0 = null, m0 = 0, n1 = 0, m1 = 0; await new Promise(res => { const cb = (t, md) => { if (n0 == null) { n0 = md.presentedFrames; m0 = md.mediaTime; } n1 = md.presentedFrames; m1 = md.mediaTime; if (md.mediaTime - m0 < 4) v.requestVideoFrameCallback(cb); else res(); }; v.requestVideoFrameCallback(cb); setTimeout(res, 8000); }); fps = m1 > m0 ? +((n1 - n0) / (m1 - m0)).toFixed(1) : null; v.pause(); v.currentTime = 0; await new Promise(r => setTimeout(r, 300)); }   /* Bildrate: gezeigte Bilder je Sekunde Videozeit bei Tempo 1 */
  v.playbackRate = 4; await v.play(); const t0 = performance.now(); let naechst = 0;   /* MediaRecorder-MP4 hat keine Längenangabe und lässt sich schlecht spulen: abspielen und unterwegs abgreifen */
  await new Promise(res => { v.onended = res; (function f() { if (v.ended) return res(); if (v.currentTime >= naechst) { g.drawImage(v, 0, 0, c.width, c.height); if (bilder.length < 6) bilder.push(c.toDataURL('image/jpeg', 0.8)); prob.push(Array.from(g.getImageData(0, 0, c.width, c.height).data.filter((_, i) => i % 4000 === 0))); naechst += 4; } requestAnimationFrame(f); })(); setTimeout(res, 60000); });
  const gespielt = +v.currentTime.toFixed(1);
  let diff = 0; for (let k = 1; k < prob.length; k++) for (let i = 0; i < prob[0].length; i++) diff += Math.abs(prob[k][i] - prob[k - 1][i]);
  let pegel = null; try { const ab = await (await fetch(url)).arrayBuffer(), ac = new OfflineAudioContext(1, 48000, 48000), buf = await ac.decodeAudioData(ab), d = buf.getChannelData(0); let s = 0, mx = 0; for (let i = 0; i < d.length; i++) { s += d[i] * d[i]; mx = Math.max(mx, Math.abs(d[i])); } pegel = { rms_db: +(10 * Math.log10(s / d.length + 1e-12)).toFixed(1), spitze: +mx.toFixed(2), sekunden: +buf.duration.toFixed(1) }; } catch (e) { pegel = 'keine Tonspur (' + e.message + ')'; }
  return JSON.stringify({ dauer: gespielt, fps, proben: prob.length, breite: v.videoWidth, hoehe: v.videoHeight, bewegung: Math.round(diff / prob[0].length / 3), ton: pegel, bilder }); })()` });
const o = JSON.parse(r.result.result.value);
o.bilder.forEach((b, k) => writeFileSync(DATEI.slice(0, -4) + `_bild${k + 1}.jpg`, Buffer.from(b.split(',')[1], 'base64')));
delete o.bilder; console.log(JSON.stringify(o)); ws.close(); ch.kill();
