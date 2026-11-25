// KI-gegen-KI-Partie bis zum Ende (Prüfliste 5.1, 2026-11-21): beide Seiten spielt die KI über die echte Abspielschleife, Tempo 1× für die ersten Runden
// (Bildzeiten werden gemessen), danach schnell. Prüft: keine Konsolenfehler, keine Ausnahme im Zug, Partie endet.
// Aufruf: node tools/test_ki_partie.mjs   (Vorschau-Server auf 127.0.0.1:8765; KARTE=sanktruss für Sankt Ruß; RUNDEN_1X=n)
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const URL = process.env.URL || 'http://127.0.0.1:8765/index.html', BILDER = process.env.BILDER || '', KARTE = process.env.KARTE || '';   // KARTE=sanktruss: Karte im Startmenü wählen
if (BILDER) mkdirSync(BILDER, { recursive: true });
try { const r0 = await fetch(URL); if (!r0.ok) throw new Error(r0.status); } catch (e) { console.log(`Vorschau-Server nicht erreichbar (${URL}) – im Projektordner starten: python -m http.server 8765 --bind 127.0.0.1`); process.exit(2); }   // Prüfliste 5.9
const sleep = ms => new Promise(r => setTimeout(r, ms)), port = 9500 + Math.floor(Math.random() * 300);
const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', ...(process.env.OHNE_GPU ? ['--disable-gpu', '--use-angle=swiftshader'] : []), `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'armpartie-'))}`, '--no-first-run', '--mute-audio', '--window-size=1920,1080', 'about:blank'], { stdio: 'ignore' });
let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {}, fehler = [];
ws.onmessage = e => { const m = JSON.parse(e.data);
  if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; return; }
  if (m.method === 'Runtime.exceptionThrown') fehler.push('Ausnahme: ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text).split('\n').slice(0, 3).join(' | '));
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') fehler.push('console.error: ' + m.params.args.map(a => a.value ?? a.description ?? '').join(' ').split('\n').slice(0, 3).join(' | ')); };
const cmd = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (x, gesture) => { const r = await cmd('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true, userGesture: !!gesture }); return r.result?.exceptionDetails ? 'ERR ' + (r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text) : r.result?.result?.value; };
const maus = async (x, y, klick) => { await cmd('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y }); if (klick) { await cmd('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 }); await cmd('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 }); } };
const taste = async (key, code) => { await cmd('Input.dispatchKeyEvent', { type: 'keyDown', key, code, windowsVirtualKeyCode: key === 'Tab' ? 9 : 0 }); await cmd('Input.dispatchKeyEvent', { type: 'keyUp', key, code }); };
let nBild = 0; const bild = async name => { if (!BILDER) return; const r = await cmd('Page.captureScreenshot', { format: 'webp', quality: 80 }); writeFileSync(join(BILDER, `${String(++nBild).padStart(2, '0')}_${name}.webp`), Buffer.from(r.result.data, 'base64')); };
const groesse = (w, h) => cmd('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false });
// Bildschleife lebt: zwei Abtastungen der Karte im Abstand – Pulsring/Effekte ändern Pixel; dazu Helligkeitsstreuung (einfarbig braun = kaputt)
const karteOk = async tag => { const r = await ev(`(async () => { const c = document.getElementById('map'), g = c.getContext('2d');
    const probe = () => { const d = g.getImageData(0, 0, c.width, c.height).data; let s = 0, s2 = 0, n = 0, h = 0; for (let i = 0; i < d.length; i += 4 * 499) { const l = (d[i] + d[i + 1] + d[i + 2]) / 3; s += l; s2 += l * l; n++; h = (h * 31 + d[i]) | 0; } const m = s / n; return { m, sd: Math.sqrt(Math.max(0, s2 / n - m * m)), h }; };
    const a = probe(); let b = a; for (let i = 0; i < 20 && b.h === a.h; i++) { await new Promise(r => setTimeout(r, 100)); b = probe(); }
    return { mittel: Math.round(b.m), streuung: Math.round(b.sd), laeuft: b.h !== a.h }; })()`);
  const ok = r && r.laeuft && r.streuung > 12; console.log(`  Karte ${tag}: ${ok ? 'ok' : 'FEHLER'} (Helligkeit ${r && r.mittel}, Streuung ${r && r.streuung}, Bild läuft ${r && r.laeuft})`); if (!ok) fehler.push(`Karte ${tag}: dunkel/eingefroren ${JSON.stringify(r)}`); return ok; };
const warteFrei = async () => { for (let i = 0; i < 200; i++) { if (await ev(`!__dbg.busy`)) return true; await sleep(100); } fehler.push('Spiel bleibt beschäftigt (busy)'); return false; };

await cmd('Runtime.enable'); await cmd('Page.enable');
await cmd('Page.addScriptToEvaluateOnNewDocument', { source: "try{localStorage.setItem('arm.ton','0')}catch(e){}" });
await groesse(1920, 1080);
await cmd('Page.navigate', { url: URL }); await sleep(5000);
await ev(`(async () => { const W = ms => new Promise(r => setTimeout(r, ms));
  const click = t => { const b = [...document.querySelectorAll('button')].find(b => b.offsetParent && b.textContent.trim().toLowerCase().includes(t)); if (b) b.click(); return !!b; };
  click('neue schlacht'); await W(700);
  const rb = ${JSON.stringify(KARTE)} && document.querySelector('input[name=map][value=' + ${JSON.stringify(KARTE)} + ']'); if (rb) { rb.click(); rb.dispatchEvent(new Event('change', { bubbles: true })); await W(400); }
  for (const t of ['weiter', 'weiter', 'die schlacht']) { click(t); await W(700); }
  await W(2500); click('schlacht beginnen'); await W(3500); })()`);
console.log('Partie gestartet, Karte', await ev(`__dbg.E.MAP.id`));

// ---- KI gegen KI bis zum Ende: beide Seiten zieht die KI (wie im Spiel über AI.next/AI.exec und die echte Abspielschleife). Misst die Bildzeiten.
await ev(`(() => { window._ft = []; let l = performance.now(); (function f() { const n = performance.now(); window._ft.push(n - l); l = n; requestAnimationFrame(f); })(); __dbg.setSpeed(1); })()`);
const zug = `(async () => { const D = __dbg, G = D.G; if (G.over) return 'ende';
  try { const bev = AI.buy(G) || []; if (bev.length) await D.spiel(bev); let g = 0;
    while (!G.over && g++ < 300) { const a = AI.next(G); if (!a) break; for (const s of a.steps) { const e2 = AI.exec(G, a.u, s) || []; if (e2.length) await D.spiel(e2); if (G.over) break; } }
  } catch (e) { return 'FEHLER ' + e.message + ' ' + String(e.stack || '').slice(0, 200); }
  if (G.over) return 'ende'; document.getElementById('btnEnd').click();
  for (let i = 0; i < 4000; i++) { await new Promise(r => setTimeout(r, 50)); if (G.over) return 'ende'; if (!D.busy && G.side === 'A' && !document.querySelector('#rundenSchild.zeigen')) break; }
  return 'runde ' + G.turn + ', Einheiten ' + G.units.filter(u => u.status === 'ok').length; })()`;
const stat = async () => JSON.parse(await ev(`(() => { const a = window._ft.splice(0).slice(5).sort((x, y) => x - y); const n = a.length; if (!n) return '{}'; const s = a.reduce((p, c) => p + c, 0);
  return JSON.stringify({ bilder: n, ms_mittel: +(s / n).toFixed(1), ms_95: +a[Math.floor(n * 0.95)].toFixed(1), ms_max: Math.round(a[n - 1]), ueber50: a.filter(x => x > 50).length, heapMB: performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : null }); })()`));
const RUNDEN_1X = +(process.env.RUNDEN_1X || 2);   // so viele Runden mit Tempo 1× und Bildzeit-Messung, danach schnell bis zum Ende
let ende = false;
for (let i = 0; i < RUNDEN_1X && !ende; i++) { const r = await ev(zug); console.log(' ', r, JSON.stringify(await stat())); if (r === 'ende') ende = true; if (String(r).startsWith('FEHLER')) { fehler.push(r); ende = true; } }
await ev(`__dbg.setSpeed(99)`);
// Paket C Punkt 4 (2026-11-24): SCHNELL_BIS=n – schnell bis Runde n, danach wieder 1× messen (Hänger kommen gegen Ende); je Runde Bildzeiten, Listen und Zeit des KI-Zugs
const SCHNELL_BIS = +(process.env.SCHNELL_BIS || 0), SPAET_1X = +(process.env.SPAET_1X || 6);
if (SCHNELL_BIS) { for (let i = 0; i < 60 && !ende; i++) { if (await ev(`__dbg.G.turn`) >= SCHNELL_BIS) break; const r = await ev(zug); if (r === 'ende') ende = true; else if (String(r).startsWith('FEHLER')) { fehler.push(r); ende = true; } }
  await ev(`(() => { __dbg.setSpeed(1); window._ft.length = 0; })()`);
  for (let i = 0; i < SPAET_1X && !ende; i++) { const t0 = Date.now(); const r = await ev(zug); const dauer = Math.round((Date.now() - t0) / 1000); console.log(' ', r, dauer + ' s', JSON.stringify(await stat()), JSON.stringify(await ev(`JSON.stringify(__dbg.zaehler())`))); if (r === 'ende') ende = true; if (String(r).startsWith('FEHLER')) { fehler.push(r); ende = true; } }
  await ev(`__dbg.setSpeed(99)`); }
for (let i = 0; i < 60 && !ende; i++) { const r = await ev(zug); if (r === 'ende') ende = true; else if (String(r).startsWith('FEHLER')) { fehler.push(r); ende = true; } else if (i % 5 === 0) console.log(' ', r); }
console.log('Ergebnis', await ev(`JSON.stringify({ over: __dbg.G.over, runde: __dbg.G.turn })`));
if (!ende) fehler.push('Partie nach 60 Runden nicht zu Ende');
ws.close(); ch.kill();
if (fehler.length) { console.log('FEHLER:\n  ' + fehler.slice(0, 20).join('\n  ')); process.exit(1); }
console.log('KI-Partie ohne Fehler.');
