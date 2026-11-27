// Paket W1 (Punkt 124, 2026-11-27): Video nach jedem Paket – KI gegen KI im unsichtbaren Chrome, Aufnahme der Spielfläche im Browser
// (MediaRecorder, MP4 H.264 + AAC, kein ffmpeg nötig), Runde 1 schnell, ab Runde 2 in Tempo 1× für DAUER Sekunden, mit Ton (Abgriff hinter dem Begrenzer).
// Aufruf: node tools/video_partie.mjs <paket> [KARTE=grauwall|sanktruss|winterdorf] [DAUER=25] [FPS=25] [OHNE_TON=1]   (Vorschau-Server auf 127.0.0.1:8765)
// Ergebnis: entwurf/probe/video/<paket>.mp4 (nicht in git). Aufgenommen wird nur die Spielfläche (Leinwand), nicht die HTML-Leisten.
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const PAKET = process.argv[2] || 'test', KARTE = process.env.KARTE || '', DAUER = +(process.env.DAUER || 25), FPS = +(process.env.FPS || 25), TON = !process.env.OHNE_TON;
const URL = process.env.URL || 'http://127.0.0.1:8765/index.html', OUT = 'entwurf/probe/video'; mkdirSync(OUT, { recursive: true });
try { const r0 = await fetch(URL); if (!r0.ok) throw new Error(r0.status); } catch (e) { console.log(`Vorschau-Server nicht erreichbar (${URL})`); process.exit(2); }
const sleep = ms => new Promise(r => setTimeout(r, ms)), port = 9500 + Math.floor(Math.random() * 300);
const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'armvid-'))}`,
  '--no-first-run', '--mute-audio', '--autoplay-policy=no-user-gesture-required', '--window-size=1920,1080', 'about:blank']);
let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {}, fehler = [];
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; return; }
  if (m.method === 'Runtime.exceptionThrown') fehler.push((m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text).split('\n')[0]); };
const cmd = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async x => { const r = await cmd('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true, userGesture: true }); if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text); return r.result?.result?.value; };
await cmd('Runtime.enable'); await cmd('Page.enable');
await cmd('Page.addScriptToEvaluateOnNewDocument', { source: `try{localStorage.setItem('arm.ton','${TON ? 1 : 0}')}catch(e){}` });
await cmd('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
await cmd('Page.navigate', { url: URL }); await sleep(6000);
await ev(`(async () => { const W = ms => new Promise(r => setTimeout(r, ms)), click = t => { const b = [...document.querySelectorAll('button')].find(b => b.offsetParent && b.textContent.trim().toLowerCase().includes(t)); if (b) b.click(); return !!b; };
  click('neue schlacht'); await W(700);
  const rb = ${JSON.stringify(KARTE)} && document.querySelector('input[name=map][value=' + ${JSON.stringify(KARTE)} + ']'); if (rb) { rb.click(); rb.dispatchEvent(new Event('change', { bubbles: true })); await W(400); }
  for (const t of ['weiter', 'weiter', 'die schlacht']) { click(t); await W(700); } await W(2500); click('schlacht beginnen'); await W(4000); return true; })()`);
console.log('Karte', await ev(`__dbg.E.MAP.id`));
// ein Zug der Seite am Zug durch die KI (wie test_ki_partie.mjs), danach „Runde beenden“
const zug = `(async () => { const D = __dbg, G = D.G; if (G.over) return 'ende';
  try { const bev = AI.buy(G) || []; if (bev.length) await D.spiel(bev); let g = 0;
    while (!G.over && g++ < 300 && !window.__vidStop) { const a = AI.next(G); if (!a) break; for (const s of a.steps) { const e2 = AI.exec(G, a.u, s) || []; if (e2.length) await D.spiel(e2); if (G.over) break; } }
  } catch (e) { return 'FEHLER ' + e.message; }
  if (G.over || window.__vidStop) return G.over ? 'ende' : 'stop'; document.getElementById('btnEnd').click();
  for (let i = 0; i < 4000; i++) { await new Promise(r => setTimeout(r, 50)); if (G.over || window.__vidStop) return 'ende'; if (!D.busy && G.side === 'A' && !document.querySelector('#rundenSchild.zeigen')) break; }
  return 'runde ' + G.turn; })()`;
await ev(`__dbg.setSpeed(99)`); console.log(' ', await ev(zug));   // Runde 1 schnell
await ev(`__dbg.setSpeed(1)`);
// Aufnahme starten: Leinwand + (falls möglich) Ton
const start = await ev(`(async () => { const c = document.getElementById('map'), st = c.captureStream(${FPS}); let ton = false;
  if (${TON}) { try { const a = __dbg.tonAbgriff(); if (a && a.getAudioTracks().length) { a.getAudioTracks().forEach(t => st.addTrack(t)); ton = true; } } catch (e) {} }
  const typ = ton ? 'video/mp4;codecs=avc1.640028,mp4a.40.2' : 'video/mp4;codecs=avc1.42E01E';
  const rec = new MediaRecorder(st, { mimeType: typ, videoBitsPerSecond: 4000000 }); window.__vidTeile = []; rec.ondataavailable = e => e.data.size && window.__vidTeile.push(e.data);
  window.__vidRec = rec; rec.start(1000); return JSON.stringify({ ton, typ, breite: c.width, hoehe: c.height }); })()`);
console.log('Aufnahme', start);
const t0 = Date.now(); const lauf = ev(zug + `.then(async r => { while (!window.__vidStop && !__dbg.G.over) r = await (${zug}); return r; })`).catch(e => 'FEHLER ' + e.message);
while (Date.now() - t0 < DAUER * 1000) await sleep(500);
await ev(`window.__vidStop = true`);
const groesse = await ev(`new Promise(res => { const rec = window.__vidRec; rec.onstop = () => { window.__vidBlob = new Blob(window.__vidTeile, { type: rec.mimeType }); res(window.__vidBlob.size); }; rec.stop(); })`);
const teile = []; for (let o = 0; o < groesse; o += 4 << 20) teile.push(Buffer.from(await ev(`window.__vidBlob.slice(${o}, ${o + (4 << 20)}).arrayBuffer().then(b => { let s = ''; const u = new Uint8Array(b); for (let i = 0; i < u.length; i += 32768) s += String.fromCharCode.apply(null, u.subarray(i, i + 32768)); return btoa(s); })`), 'base64'));
const datei = join(OUT, PAKET + '.mp4'); writeFileSync(datei, Buffer.concat(teile));
console.log(`Video ${datei}: ${(statSync(datei).size / 1048576).toFixed(1)} MB, ${DAUER} s, Runde ${await ev('__dbg.G.turn')}`);
await Promise.race([lauf, sleep(3000)]);
console.log(fehler.length ? 'Seitenfehler: ' + fehler.slice(0, 3).join(' | ') : 'keine Seitenfehler');
ws.close(); ch.kill();
