// F94 (2026-11-22): Test „Feind-Armee selbst zusammenstellen“ gegen die KI – unsichtbarer Chrome, stumm.
// Startmenü → Armee → „Feind-Armee“ → „Ich stelle zusammen“ → eine Einheit weniger → Übernehmen → Schlacht beginnen; prüft, dass die KI-Seite genau diese Armee hat.
// Danach Gegenprobe mit „KI stellt selbst zusammen“ (Kartenarmee). Aufruf: node tools/test_feindarmee.mjs (Vorschau-Server auf 127.0.0.1:8765)
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const URL = process.env.URL || 'http://127.0.0.1:8765/index.html';
const sleep = ms => new Promise(r => setTimeout(r, ms)), port = 9500 + Math.floor(Math.random() * 300);
const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'armfeind-'))}`, '--no-first-run', '--mute-audio', '--window-size=1920,1080', 'about:blank'], { stdio: 'ignore' });
let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {}, fehler = [];
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; return; }
  if (m.method === 'Runtime.exceptionThrown') fehler.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); };
const cmd = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async x => { const r = await cmd('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true }); return r.result?.exceptionDetails ? 'ERR ' + (r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text) : r.result?.result?.value; };
await cmd('Runtime.enable'); await cmd('Page.enable');
await cmd('Page.addScriptToEvaluateOnNewDocument', { source: "try{localStorage.setItem('arm.ton','0')}catch(e){}" });
let ok = true;
for (const selbst of [true, false]) {
  await cmd('Page.navigate', { url: URL }); await sleep(5000);
  const r = await ev(`(async () => { const W = ms => new Promise(r => setTimeout(r, ms)), $ = id => document.getElementById(id), out = {};
    const click = t => { const b = [...document.querySelectorAll('button')].find(b => b.offsetParent && b.textContent.trim().toLowerCase().includes(t)); if (b) b.click(); return !!b; };
    click('neue schlacht'); await W(700); click('weiter'); await W(700);
    $('btnArmy').click(); await W(600);
    out.swapText1 = $('armySwap').textContent; out.feindVorher = !$('armyFeind').hidden;
    $('armySwap').click(); await W(600);
    out.swapText2 = $('armySwap').textContent; out.feindSichtbar = !$('armyFeind').hidden; out.seite = $('armyName').textContent;
    if (${selbst}) { document.querySelector('#armyFeind [data-f=ich]').click(); await W(200);
      const minus = [...document.querySelectorAll('#armyList .sn-k')].map(el => el.querySelector('.stepper button[data-d="-1"]')).find(b => b && !b.disabled); if (minus) minus.click(); await W(200); }
    else { document.querySelector('#armyFeind [data-f=ki]').click(); await W(200); }
    out.okFrei = !$('armyOk').disabled; $('armyOk').click(); await W(400);
    out.info = $('armyInfo').textContent;
    for (const t of ['weiter', 'die schlacht']) { click(t); await W(700); } await W(2500); click('schlacht beginnen'); await W(3000);
    const G = __dbg.G, E = __dbg.E, sd = out.seite.toLowerCase().includes('asch') ? 'D' : 'A', cnt = {}; for (const u of G.units) if (u.side === sd) cnt[u.type] = (cnt[u.type] || 0) + 1;
    out.kiSeite = sd; out.kiArmee = cnt; out.kartenArmee = E.MAP.army[sd]; out.gleichKarte = JSON.stringify(Object.entries(cnt).sort()) === JSON.stringify(Object.entries(E.MAP.army[sd]).filter(([, n]) => n > 0).sort());
    return out; })()`);
  const pass = typeof r === 'object' && r.feindSichtbar && !r.feindVorher && r.okFrei && (selbst ? !r.gleichKarte : r.gleichKarte);
  console.log((selbst ? 'Feind selbst' : 'KI stellt zusammen') + ': ' + (pass ? 'ok' : 'FEHLER'), JSON.stringify(r));
  ok = ok && pass;
}
console.log(fehler.length ? 'Seitenfehler: ' + fehler.join(' | ') : 'keine Seitenfehler');
ws.close(); ch.kill(); process.exit(ok && !fehler.length ? 0 : 1);
