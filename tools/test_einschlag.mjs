// Bildpausen bei Einschlägen (Enrico 2026-11-22 17:32): je Karte bei Bildwirkung leicht und stark
// (a) sechs neue Trichter kurz hintereinander (Gelände-Ereignis wie beim Artillerie-Einschlag),
// (b) ein echtes Sperrfeuer der Artillerie auf einen Gegner (Regeln + Abspielen),
// (c) ein zerstörtes Hindernis bzw. Gebäude (voller Neuaufbau).
// Misst die längste Pause zwischen zwei Bildern (ms) und die Aufbauzeit der Gelände-Welt (__gbMs).
// Aufruf: node tools/test_einschlag.mjs   (Vorschau-Server auf 127.0.0.1:8765)
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const sleep = ms => new Promise(r => setTimeout(r, ms)), port = 9500 + Math.floor(Math.random() * 300);
const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', ...(process.env.MIT_GPU ? [] : ['--disable-gpu', '--use-angle=swiftshader']), `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'armeinschlag-'))}`, '--no-first-run', '--mute-audio', '--window-size=1920,1080', 'about:blank'], { stdio: 'ignore' });
let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {}, fehler = [];
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; return; }
  if (m.method === 'Runtime.exceptionThrown') fehler.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') fehler.push('console.error: ' + m.params.args.map(a => a.value ?? a.description ?? '').join(' ').slice(0, 160)); };
const cmd = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async x => { const r = await cmd('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true }); return r.result?.exceptionDetails ? 'ERR ' + (r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text) : r.result?.result?.value; };
await cmd('Runtime.enable'); await cmd('Page.enable');
await cmd('Page.addScriptToEvaluateOnNewDocument', { source: "try{localStorage.setItem('arm.ton','0')}catch(e){}" });
await cmd('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
const ergebnis = [];
for (const karte of ['grauwall', 'sanktruss', 'winterdorf']) for (const bw of [1, 2]) {
  await cmd('Page.navigate', { url: 'http://127.0.0.1:8765/index.html' }); await sleep(5000);
  await ev(`(async () => { const W = ms => new Promise(r => setTimeout(r, ms)); const click = t => { const b = [...document.querySelectorAll('button')].find(b => b.offsetParent && b.textContent.trim().toLowerCase().includes(t)); if (b) b.click(); return !!b; };
    click('neue schlacht'); await W(700); const rb = document.querySelector('input[name=map][value=${karte}]'); if (rb) { rb.click(); rb.dispatchEvent(new Event('change', { bubbles: true })); await W(600); }
    for (const t of ['weiter', 'weiter', 'die schlacht']) { click(t); await W(700); } await W(2500); click('schlacht beginnen'); await W(4000); __dbg.bild(${bw}); await W(1500); })()`);
  const r = await ev(`(async () => { const W = ms => new Promise(r => setTimeout(r, ms)), D = __dbg, G = D.G, E = D.E;
    D.setSpeed && D.setSpeed(1); D.camSetzen(D.CAM.x, D.CAM.y, D.ZFIT); await W(800);
    let mess = null; const start = () => { mess = { max: 0, t: performance.now(), n: 0 }; const f = () => { if (!mess) return; const t = performance.now(); mess.max = Math.max(mess.max, t - mess.t); mess.t = t; mess.n++; requestAnimationFrame(f); }; requestAnimationFrame(f); };
    const stop = () => { const m = mess; mess = null; return Math.round(m.max); };
    const out = {};
    // (a) sechs Trichter auf offenen Feldern in der Kartenmitte
    const offen = []; for (let c = 3; c < E.COLS - 3; c++) for (let r = 1; r < E.ROWS - 1; r++) if (G.map[c][r].t === 'open' && !G.units.some(u => u.c === c && u.r === r)) offen.push([c, r]);
    start(); await W(300);
    for (const [c, r] of offen.slice(0, 6)) { G.map[c][r].t = 'crater'; await D.play([{ t: 'terrain', c, r }]); await W(60); }
    await W(500); out.trichter = stop(); out.gbMs = window.__gbMs;
    // (b) echtes Sperrfeuer: Geschütz der Aschenwacht auf den nächsten Gegner
    const art = G.units.find(u => u.side === 'D' && E.cls(u) === 'art' && !u.limbered) || G.units.find(u => E.cls(u) === 'art');
    let ziel = null; if (art) for (const u of G.units) if (u.side !== art.side && E.alive(u)) for (const m of ['barrage', 'he']) if (!ziel && E.canShell(G, art, u.c, u.r, m)) ziel = [u, m];
    if (ziel) { const s0 = G.side; G.side = art.side; art.ap = 1; art.attacked = false; const evs = E.shell(G, art, ziel[0].c, ziel[0].r, ziel[1]); G.side = s0; start(); await D.play(evs); await W(500); out.sperrfeuer = stop(); out.modus = ziel[1]; out.terrainEv = evs.filter(e => e.t === 'terrain').length; }
    // (c) Gebäude bzw. Hindernis zerstört (voller Neuaufbau)
    let fz = null; for (let c = 0; c < E.COLS && !fz; c++) for (let r = 0; r < E.ROWS; r++) if (['barrikade', 'bunker', 'village'].includes(G.map[c][r].t)) { fz = [c, r]; break; }
    if (fz) { G.map[fz[0]][fz[1]].t = 'crater'; start(); await D.play([{ t: 'terrain', c: fz[0], r: fz[1], what: 'gesprengt' }]); await W(500); out.neuaufbau = stop(); out.gbMsVoll = window.__gbMs; }
    return out; })()`);
  if (bw === 2) { const sh = await cmd('Page.captureScreenshot', { format: 'jpeg', quality: 85 }); (await import('node:fs')).writeFileSync('entwurf/probe/einschlag_' + karte + '.jpg', Buffer.from(sh.result.data, 'base64')); }
  ergebnis.push({ karte, bild: bw === 2 ? 'stark' : 'leicht', ...(typeof r === 'object' ? r : { fehler: r }) });
  console.log(JSON.stringify(ergebnis.at(-1)));
}
console.log(fehler.length ? 'Seitenfehler: ' + [...new Set(fehler)].slice(0, 5).join(' | ') : 'keine Seitenfehler');
ws.close(); ch.kill();
