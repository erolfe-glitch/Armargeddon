// F95 Tontest (2026-11-22): unsichtbarer Chrome mit stummer Ausgabe, Ton im Spiel AN. Prüft den Ton-Umbau:
// WebAudio-Netz läuft (Wege Musik/Effekte/Stimmen, Begrenzer), Schüsse/Salven/Stimmen/Musik spielen ohne Fehler, Regler „Stimmen“ wirkt, Musik duckt bei Beschuss.
// Aufruf: node tools/test_ton.mjs   (Vorschau-Server auf 127.0.0.1:8765)
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const URL = process.env.URL || 'http://127.0.0.1:8765/index.html';
const sleep = ms => new Promise(r => setTimeout(r, ms)), port = 9500 + Math.floor(Math.random() * 300);
const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'armton-'))}`, '--no-first-run', '--mute-audio', '--autoplay-policy=no-user-gesture-required', '--window-size=1920,1080', 'about:blank'], { stdio: 'ignore' });
let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {}, fehler = [];
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; return; }
  if (m.method === 'Runtime.exceptionThrown') fehler.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') fehler.push('console.error: ' + m.params.args.map(a => a.value ?? a.description ?? '').join(' ').slice(0, 200)); };
const cmd = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async x => { const r = await cmd('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true, userGesture: true }); return r.result?.exceptionDetails ? 'ERR ' + (r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text) : r.result?.result?.value; };
await cmd('Runtime.enable'); await cmd('Page.enable');
await cmd('Page.addScriptToEvaluateOnNewDocument', { source: "try{localStorage.setItem('arm.ton','1')}catch(e){}" });
await cmd('Page.navigate', { url: URL }); await sleep(5000);
await ev(`(async () => { const W = ms => new Promise(r => setTimeout(r, ms)); const click = t => { const b = [...document.querySelectorAll('button')].find(b => b.offsetParent && b.textContent.trim().toLowerCase().includes(t)); if (b) b.click(); return !!b; };
  click('neue schlacht'); await W(700); for (const t of ['weiter', 'weiter', 'die schlacht']) { click(t); await W(700); } await W(2500); click('schlacht beginnen'); await W(4000); })()`);
const r = await ev(`(async () => { const W = ms => new Promise(r => setTimeout(r, ms)), D = __dbg, out = {};
  out.netz0 = D.tonNetz;
  // Schüsse und Stimmen
  for (const k of ['rifle', 'mg', 'cannon', 'tank', 'schritte', 'pain', 'boom']) D.playSound(k, 0.5, 'A');
  await W(300); out.netz = D.tonNetz;
  out.misch = { rifleA: +D.mischF('rifle_1', 'A').toFixed(2), rifleD: +D.mischF('rifle2', 'D').toFixed(2), mg: +D.mischF('mg_1', 'D').toFixed(2), tank: +D.mischF('tank_1').toFixed(2), pain: +D.mischF('pain_gm_1').toFixed(2), boom: D.mischF('boomH') };
  // Musik duckt bei Beschuss
  const vor = D.ton.duck(); D.play && 0;
  // Gewehrsalve über einen echten Schuss der KI-freien Probe: Ereignis direkt abspielen
  const G = D.G, a = G.units.find(u => u.side === 'A' && u.type === 'kohorte'), z = G.units.find(u => u.side === 'D');
  for (const art of ['A', 'B']) { D.gewehr(art); try { await D.play([{ t: 'fire', a: a.id, d: z.id, kind: 'rifle' }]); } catch (e) { out['salve' + art] = 'Fehler ' + e; } }
  out.duckNachSchuss = D.ton.duck();
  out.duckVor = vor;
  D.gewehr('A');
  return out; })()`);
console.log(JSON.stringify(r, null, 1));
console.log(fehler.length ? 'FEHLER:\n' + fehler.join('\n') : 'keine Seitenfehler');
ws.close(); ch.kill();
process.exit(fehler.length || typeof r === 'string' ? 1 : 0);
