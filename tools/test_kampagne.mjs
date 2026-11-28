// K-A (Punkt 156): Kampagne im Browser prüfen – neue Kampagne, Züge, Chronik, Neuladen vor und in der Schlacht, Schlacht KI gegen KI (ohne Animation),
// zurück zur Karte, Stärken/Besitz/Speicher. Bilder bei 1920 und 1280 px. Vorschau-Server nötig. Aufruf: node tools/test_kampagne.mjs [ordner]
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const OUT = process.argv[2] || 'entwurf/probe/k_a'; mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms)), port = 9500 + Math.floor(Math.random() * 300);
const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'armka-'))}`, '--no-first-run', '--mute-audio', '--window-size=1920,1080', 'about:blank']);
let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {}, fehler = [];
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; return; } if (m.method === 'Runtime.exceptionThrown') fehler.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); };
const cmd = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async x => { const r = await cmd('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text); return r.result?.result?.value; };
await cmd('Runtime.enable'); await cmd('Page.enable'); await cmd('Page.addScriptToEvaluateOnNewDocument', { source: "try{localStorage.setItem('arm.ton','0')}catch(e){}" });
await cmd('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
const W = ms => sleep(ms), pruef = [], ok = (name, b, info = '') => { pruef.push([name, !!b, info]); console.log(`  ${b ? 'ok  ' : 'FEHL'} ${name}${info ? ' – ' + info : ''}`); };
const laden = async () => { await cmd('Page.navigate', { url: process.env.URL || 'http://127.0.0.1:8765/index.html' }); await W(5500); };
const klick = sel => ev(`(() => { const b = document.querySelector(${JSON.stringify(sel)}); if (!b || b.disabled) return false; b.click(); return true; })()`);
const knopfText = t => ev(`(() => { const b = [...document.querySelectorAll('button')].find(b => b.offsetParent && b.textContent.trim() === ${JSON.stringify(t)}); if (b) b.click(); return !!b; })()`);
const ka = () => ev('JSON.stringify(__dbg.ka())').then(s => JSON.parse(s || 'null'));
const gespeichert = () => ev("localStorage.getItem('arm.kampagne')").then(s => JSON.parse(s || 'null'));
const ort = async id => { await klick(`.ka-ort[data-ort="${id}"]`); await W(300); return klick(`.ka-ort[data-ort="${id}"]`); };
const bild = async name => { const r = await cmd('Page.captureScreenshot', { format: 'jpeg', quality: 85 }); writeFileSync(join(OUT, name + '.jpg'), Buffer.from(r.result.data, 'base64')); console.log('  Bild', name); };
// 1 Neue Kampagne
await laden(); await ev("localStorage.removeItem('arm.kampagne'); true");
await knopfText('Kampagne'); await W(600); ok('Startmenü: Fortsetzen ohne Spielstand verborgen', await ev("document.getElementById('kaWeiter').hidden"));
await klick('#kaNeu'); await W(900); ok('Chronik zum Beginn', !(await ev("document.getElementById('kaChronik').hidden")));
await knopfText('Zur Karte'); await W(700);
let s = await ka(); ok('Startarmee in Valmor-Stadt', s && s.armee.ort === 'valmor' && s.armee.trupps.length === 20, s && `${s.armee.trupps.length} Trupps`);
ok('Kasse 2.000 Kronen', (await ev("document.getElementById('kaKasse').textContent")) === '2.000 Kronen');
ok('12 Orte gezeichnet', (await ev("document.querySelectorAll('.ka-ort').length")) === 12);
await W(500); await bild('1920_karte_beginn');
// 2 Züge: Renegaten gesperrt, Zug zu eigenem Ort, Runde beenden, Angriff auf die Kreidegrube
await ort('muehlenhof'); await W(500); s = await ka(); ok('Zug nach Mühlenhof', s.armee.ort === 'muehlenhof');
await ort('grauwall'); await W(300); ok('zweiter Zug in derselben Runde gesperrt', (await ka()).armee.ort === 'muehlenhof');
await klick('#kaRundeKn'); await W(400); ok('Runde 2', (await ka()).runde === 2);
await ort('grauwall'); await W(400); await klick('#kaRundeKn'); await W(400);
await klick('.ka-ort[data-ort="drahtfeld"]'); await W(400); ok('Renegaten gesperrt', /Renegaten/.test(await ev("document.getElementById('kaInfo').textContent")));
await bild('1920_karte_renegaten_gesperrt');
const vorher = (await ka()).armee.trupps.map(t => t.str).reduce((a, b) => a + b, 0);
await ort('kreidegrube'); await W(900); s = await gespeichert();
ok('Angriff: Phase Schlacht gespeichert', s && s.phase === 'schlacht' && s.schlacht.ort === 'kreidegrube');
ok('Chronik vor der Schlacht', /Kreidegrube/.test(await ev("document.getElementById('kaChTitel').textContent")));
await bild('1920_chronik_vor_der_schlacht');
// 3 Neuladen mitten in der Schlacht
await knopfText('Zur Schlacht'); await W(4500); ok('Schlacht läuft (Karte Grauwall)', await ev("!!__dbg.G && __dbg.G.mapId === 'grauwall' && __dbg.kaAktiv()"));
ok('Trupps zugeordnet (Armee + Besatzung)', (await ev("__dbg.G.units.filter(u => u.kId != null).length")) === 25);
await laden(); await knopfText('Kampagne'); await W(600); ok('Nach Neuladen: Fortsetzen sichtbar', !(await ev("document.getElementById('kaWeiter').hidden")));
await klick('#kaWeiter'); await W(900); ok('Nach Neuladen in der Schlacht: geht vor der Schlacht weiter', /Kreidegrube/.test(await ev("document.getElementById('kaChTitel').textContent")) && !(await ev("document.getElementById('kaChronik').hidden")));
// 4 Schlacht KI gegen KI ohne Animation, dann Schlachtende → Karte
await knopfText('Zur Schlacht'); await W(4500);
const ende = JSON.parse(await ev(`(async () => { const D = __dbg, G = D.G, E = D.E; const v = G.units.filter(u => u.side === "A").map(u => u.kId + ":" + u.str).join(); E.autoAufstellen(G, "A"); __dbg.kaZuordnen(); const n = G.units.filter(u => u.side === "A").map(u => u.kId + ":" + u.str).join(); if (v.split(",").sort().join() !== n.split(",").sort().join()) throw new Error("Auto-Aufstellung verliert Reststärken"); G.aufstellung = null; E.startTurn(G); let g = 0, bk = '';
  while (!G.over && g++ < 9000) { if (bk !== G.turn + G.side) { bk = G.turn + G.side; AI.buy(G); } const a = AI.next(G); if (!a) { E.endTurn(G); continue; } for (const st of a.steps) AI.exec(G, a.u, st); }
  D.kaEnde(); await new Promise(r => setTimeout(r, 900)); return JSON.stringify({ over: G.over, runde: G.turn, knopf: document.getElementById('againBtn').textContent }); })()`));
ok('Schlacht zu Ende', !!ende.over, `Sieger ${ende.over && ende.over.winner}, ${ende.runde} Runden`);
ok('Endbild führt zur Kampagnenkarte', ende.knopf === 'Zur Kampagnenkarte');
await klick('#againBtn'); await W(1200); ok('Chronik nach der Schlacht', /Sieg|Niederlage/.test(await ev("document.getElementById('kaChTitel').textContent")));
await bild('1920_chronik_nach_der_schlacht');
await knopfText('Weiter'); await W(700);
s = await ka(); const sp = await gespeichert(), sieg = ende.over.winner === 'A';
ok('Besitz nach der Schlacht', s.orte.kreidegrube.besitz === (sieg ? 'A' : 'D'), s.orte.kreidegrube.besitz);
ok('Armee-Standort', s.armee.ort === (sieg ? 'kreidegrube' : 'grauwall'), s.armee.ort);
ok('Stärken übernommen', s.armee.trupps.some(t => t.str < 10), `vorher Summe ${vorher.toFixed(1)}, nachher ${s.armee.trupps.reduce((a, t) => a + t.str, 0).toFixed(1)}, ${s.armee.trupps.length} Trupps`);
ok('Schlachten je Trupp gezählt', s.armee.trupps.every(t => t.schlachten === 1), `Abschüsse zusammen ${s.armee.trupps.reduce((a, t) => a + t.abschuesse, 0)}`);
ok('Spielstand = Zustand', JSON.stringify(sp) === JSON.stringify(s));
ok('Fähnchen gewechselt', await ev(`document.querySelector('.ka-ort[data-ort="kreidegrube"]').classList.contains('b${sieg ? 'A' : 'D'}')`));
await bild('1920_karte_nach_der_schlacht');
// 5 Ansicht bei 1280 px: Karte, Leiste läuft nicht über, Orte bleiben in der Karte
await cmd('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false }); await W(800);
ok('1280: Leiste passt', await ev("(() => { const l = document.querySelector('#kampagne .ka-leiste'); return l.scrollWidth <= l.clientWidth + 1; })()"));
ok('1280: Orte innerhalb der Karte', await ev("(() => { const k = document.getElementById('kaKarte').getBoundingClientRect(); return [...document.querySelectorAll('.ka-ort')].every(b => { const r = b.getBoundingClientRect(); return r.left >= k.left - 2 && r.right <= k.right + 2 && r.top >= k.top - 2 && r.bottom <= k.bottom + 2; }); })()"));
ok('1280: Knöpfe mindestens 40 px hoch', await ev("[...document.querySelectorAll('#kampagne button')].filter(b => b.offsetParent).every(b => b.getBoundingClientRect().height >= 40)"));
await bild('1280_karte_nach_der_schlacht');
await klick('.ka-ort[data-ort="grauerhang"]'); await W(400); await bild('1280_karte_ort_gewaehlt');
await klick('#kaArmeeKn'); await W(400); await bild('1280_karte_armee');
console.log(fehler.length ? 'Seitenfehler: ' + fehler.slice(0, 3).join(' | ') : 'keine Seitenfehler');
const fehl = pruef.filter(p => !p[1]).length; console.log(`${pruef.length - fehl} von ${pruef.length} Prüfungen in Ordnung`);
ws.close(); ch.kill(); process.exit(fehl || fehler.length ? 1 : 0);
