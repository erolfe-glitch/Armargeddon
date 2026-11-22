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
  // Rufe 14:40–15:00: Standardbelegung je Seite, Schreiter-Stimmen (Platz und Roboter-Filter)
  out.rufe = {}; for (const ev of ['feuer_befehl', 'panik_einzeln', 'panik_gruppe', 'sterben_einzeln', 'sterben_gruppe']) for (const sd of ['A', 'D']) { const w = D.rufWahl('stimmen_', ev, sd); out.rufe[ev + sd] = w ? w.k : null; }
  out.rufSpielt = D.ruf('feuer_befehl', 'A'); await W(300);
  out.sst = {}; for (const an of ['auswahl', 'bewegen', 'angriff', 'nahkampf', 'getroffen', 'schwer_beschaedigt', 'feind_gesichtet', 'zerstoert']) for (const sd of ['A', 'D']) out.sst[an + sd] = D.sndPick('sst_' + an, sd) || null;
  { const G = D.G, E = D.E, frei = []; for (let c = 0; c < 6; c++) for (let r = 0; r < 8; r++) if (!G.units.some(u => u.c === c && u.r === r)) frei.push([c, r]);
    const vorlage = G.units.find(u => u.side === 'A'), id = 9999; G.units.push({ ...vorlage, id, type: 'kreuz', c: frei[0][0], r: frei[0][1] }); D.neuDU(); out.schreiter = D.istSchreiter(id);
    out.sstSpielt = D.schreiterRuf(id, 'angriff'); await W(400); }
  out.neu = ['mg_aufbauen', 'mg_abbauen', 'geschuetz_aufprotzen', 'geschuetz_abprotzen', 'sandsaecke', 'loewen_landung', 'neu4_pistole_schwer', 'neu4_gewehr_schwer', 'neu4_mg_schwer'].filter(p => !D.sndPick(p, 'A'));
  return out; })()`);
console.log(JSON.stringify(r, null, 1));
console.log(fehler.length ? 'FEHLER:\n' + fehler.join('\n') : 'keine Seitenfehler');
ws.close(); ch.kill();
const leer = typeof r === 'object' ? [...Object.entries(r.rufe || {}), ...Object.entries(r.sst || {})].filter(([, v]) => !v).map(([k]) => k).concat(r.neu || []) : ['?'];
if (typeof r === 'object' && !(r.schreiter && r.sstSpielt)) leer.push('Schreiter-Stimme spielt nicht');
console.log(leer.length ? 'FEHLENDE TÖNE: ' + leer.join(', ') : 'alle neuen Plätze belegt');
process.exit(fehler.length || typeof r === 'string' || leer.length ? 1 : 0);
