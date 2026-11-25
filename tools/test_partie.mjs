// Partietest mit echten Eingaben (Headless-Chrome, stumm): mehrere Trupps nacheinander wählen, über verschiedene Felder fahren
// (Zugvorschau + Geländehinweis), ziehen, eingraben, schießen, Vollbild mehrmals an/aus und Fenstergrößen wechseln, Runde beenden.
// Prüft: Konsole ohne Fehler, Bildschleife läuft (Karte wird neu gezeichnet, nicht einfarbig), nach jeder Handlung wieder bedienbar,
// nach dem Eingraben kein Schuss mehr möglich.
// Aufruf: node tools/test_partie.mjs   (Vorschau-Server auf 127.0.0.1:8765; URL=… für eine andere Seite; BILDER=ordner für Aufnahmen)
// Gegenprobe (Punkt 47): GEGENPROBE=schwarz (Karte wird nach dem Start nur noch schwarz gefüllt) bzw. GEGENPROBE=steht (Bildschleife angehalten) – beide MÜSSEN als Fehler gemeldet werden.
// Bildprüfung (Punkt 47, 2026-11-24): Chrome ohne Hintergrund-Drosselung, Zeichenfläche verloren (isContextLost) wird eigens gemeldet, ein dunkles/stehendes Bild wird bis zu 3× im Abstand von 1 s nachgeprüft (vorübergehende Aussetzer zählen nicht).
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const GEGEN = process.env.GEGENPROBE || '', URL = process.env.URL || 'http://127.0.0.1:8765/index.html', BILDER = process.env.BILDER || '', KARTE = process.env.KARTE || '';   // KARTE=sanktruss: Karte im Startmenü wählen
if (BILDER) mkdirSync(BILDER, { recursive: true });
try { const r0 = await fetch(URL); if (!r0.ok) throw new Error(r0.status); } catch (e) { console.log(`Vorschau-Server nicht erreichbar (${URL}) – im Projektordner starten: python -m http.server 8765 --bind 127.0.0.1`); process.exit(2); }   // Prüfliste 5.9
const sleep = ms => new Promise(r => setTimeout(r, ms)), port = 9500 + Math.floor(Math.random() * 300);
const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', ...(process.env.MIT_GPU ? [] : ['--disable-gpu', '--use-angle=swiftshader']), `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'armpartie-'))}`, '--no-first-run', '--mute-audio', '--window-size=1920,1080', '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows', 'about:blank'], { stdio: 'ignore' });   // Punkt 47: unsichtbarer Chrome darf das Zeichnen nicht drosseln
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
const karteMessen = () => ev(`(async () => { const c = document.getElementById('map'), g = c.getContext('2d');
    const probe = () => { const d = g.getImageData(0, 0, c.width, c.height).data; let s = 0, s2 = 0, n = 0, h = 0; for (let i = 0; i < d.length; i += 4 * 499) { const l = (d[i] + d[i + 1] + d[i + 2]) / 3; s += l; s2 += l * l; n++; h = (h * 31 + d[i]) | 0; } const m = s / n; return { m, sd: Math.sqrt(Math.max(0, s2 / n - m * m)), h }; };
    const a = probe(); let b = a; for (let i = 0; i < 20 && b.h === a.h; i++) { await new Promise(r => setTimeout(r, 100)); b = probe(); }
    return { mittel: Math.round(b.m), streuung: Math.round(b.sd), laeuft: b.h !== a.h, verloren: !!(g.isContextLost && g.isContextLost()), sicht: document.visibilityState }; })()`);
const karteOk = async tag => { let r, ok = false, n = 0;   // Punkt 47: bis zu 3 Messungen im Abstand von 1 s – ein einmaliger Aussetzer zählt nicht, ein bleibend dunkles/stehendes Bild schon
  for (; n < 3 && !ok; n++) { if (n) await sleep(1000); r = await karteMessen(); ok = !!(r && r.laeuft && r.streuung > 12); if (r && r.verloren) console.log(`  Karte ${tag}: Zeichenfläche verloren (Context Loss, Seite ${r.sicht})`); }
  console.log(`  Karte ${tag}: ${ok ? 'ok' : 'FEHLER'} (Helligkeit ${r && r.mittel}, Streuung ${r && r.streuung}, Bild läuft ${r && r.laeuft}${n > 1 ? ', Messungen ' + n : ''})`); if (!ok) fehler.push(`Karte ${tag}: dunkel/eingefroren ${JSON.stringify(r)}`); return ok; };
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
console.log('Partie gestartet, Karte', await ev(`__dbg.E.MAP.id`), 'Seite', await ev(`__dbg.G.side`));
// F83/F85 (2026-11-21): gezeigte Blickrichtung beim Start (Konkordat nach rechts, Aschenwacht nach links – im Graben, in Ruinen, im Freien) und Drehen über das Bedienfeld
await sleep(1500);
{ const r = JSON.parse(await ev(`JSON.stringify(__dbg.G.units.filter(u => __dbg.E.alive(u)).map(u => { const d = __dbg.du(u.id); return [u.id, u.type, u.side, __dbg.G.map[u.c][u.r].t, u.face, d ? d.bildLinks : null]; }))`));
  const gez = r.filter(x => x[5] != null), falsch = gez.filter(([, , side, , , bl]) => bl !== (side === 'D'));
  if (gez.length < r.length * (KARTE === 'winterdorf' ? 0 : 0.8)) fehler.push(`F83: nur ${gez.length} von ${r.length} Einheiten gezeichnet`);
  if (falsch.length) fehler.push(`F83: ${falsch.length} Einheiten blicken beim Start in die falsche Richtung: ` + falsch.slice(0, 6).map(x => x.slice(1, 4).join('/')).join(', '));
  console.log(`  Startausrichtung im Bild: ${gez.length - falsch.length}/${gez.length} richtig (Felder: ${[...new Set(gez.map(x => x[3]))].join(', ')})`); }
{ const r = JSON.parse(await ev(`(async () => { const G = __dbg.G, u = G.units.find(x => x.side === G.side && __dbg.E.alive(x) && ['kohorte', 'grenadier'].includes(x.type)); if (!u) return 'null'; __dbg.select(u.id); await new Promise(r => setTimeout(r, 300)); const vor = [u.face, __dbg.du(u.id).bildLinks];
    for (let i = 0; i < 3; i++) { await __dbg.panelAct('tr'); await new Promise(r => setTimeout(r, 150)); } await new Promise(r => setTimeout(r, 400)); const nach = [u.face, __dbg.du(u.id).bildLinks];
    for (let i = 0; i < 3; i++) { await __dbg.panelAct('tl'); await new Promise(r => setTimeout(r, 150)); } await new Promise(r => setTimeout(r, 400)); return JSON.stringify({ id: u.id, vor, nach, zurueck: [u.face, __dbg.du(u.id).bildLinks] }); })()`));
  if (r) { const ok = r.nach[0] === (r.vor[0] + 3) % 6 && r.nach[1] === !r.vor[1] && r.zurueck[0] === r.vor[0] && r.zurueck[1] === r.vor[1];
    if (!ok) fehler.push(`F85: Drehen wirkt nicht: ${JSON.stringify(r)}`); console.log(`  Drehen (3× rechts, 3× links): ${ok ? 'ok' : 'FEHLER'} ${JSON.stringify(r)}`); } }
// F102 (2026-11-22): Leertaste hakt die gewählte Einheit ab und springt zur nächsten offenen, E auf der abgehakten Einheit öffnet sie wieder (Stand wie vorher)
{ const v = JSON.parse(await ev(`(async () => { const G = __dbg.G, u = G.units.find(x => x.side === G.side && __dbg.E.alive(x) && __dbg.E.active(x) && x.ap >= 1 && x.bp > 0); if (!u) return 'null'; __dbg.select(u.id); await new Promise(r => setTimeout(r, 300)); return JSON.stringify({ id: u.id, ap: u.ap, bp: u.bp }); })()`));
  if (v) { await taste(' ', 'Space'); await sleep(500);
    const n1 = JSON.parse(await ev(`JSON.stringify((() => { const u = __dbg.G.units.find(x => x.id === ${v.id}); return { ap: u.ap, bp: u.bp, sel: __dbg.sel && __dbg.sel.id, grund: __dbg.bereitGrund(u.id) }; })())`));
    await ev(`(__dbg.select(${v.id}), 1)`); await sleep(300); await taste('e', 'KeyE'); await sleep(500);
    const n2 = JSON.parse(await ev(`JSON.stringify((() => { const u = __dbg.G.units.find(x => x.id === ${v.id}); return { ap: u.ap, bp: u.bp, grund: __dbg.bereitGrund(u.id) }; })())`));
    const ok = n1.ap === 0 && n1.grund === '' && n1.sel !== v.id && n2.ap === v.ap && n2.bp === v.bp && n2.grund !== '';
    console.log(`  F102 Leertaste/E: ${ok ? 'ok' : 'FEHLER'} ${JSON.stringify({ vorher: v, abgehakt: n1, wieder: n2 })}`); if (!ok) fehler.push('F102: Abhaken per Taste: ' + JSON.stringify({ v, n1, n2 })); } }
if (GEGEN) await ev(`(() => { const c = document.getElementById('map'), g = c.getContext('2d');   // Punkt 47: absichtlich kaputtes Bild für die Gegenprobe
  if (${JSON.stringify(GEGEN)} === 'steht') window.requestAnimationFrame = () => 0;
  else { const P = CanvasRenderingContext2D.prototype; for (const k of ['drawImage', 'fill', 'stroke', 'fillRect', 'fillText', 'strokeText', 'putImageData']) { const o = P[k]; P[k] = function (...a) { return this === g ? undefined : o.apply(this, a); }; } const z = () => { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, c.width, c.height); g.restore(); setTimeout(z, 30); }; z(); }
  return true; })()`);
await karteOk('Start');
if (GEGEN) { await karteOk('Start (2)'); console.log(fehler.length ? `Gegenprobe ${GEGEN}: Fehler erkannt (richtig) – ${fehler.length} Meldungen` : `Gegenprobe ${GEGEN}: NICHT erkannt (Test taugt nicht)`); ws.close(); ch.kill(); process.exit(fehler.length ? 0 : 1); }   // Punkt 47: Gegenprobe endet nach der Bildprüfung

// Ein eigener Zug: alle Fußtruppen nacheinander wählen (Klick, sonst Tab), über verschiedene Felder fahren, zum Feind vorrücken,
// abwechselnd eingraben (danach darf kein Schuss mehr gehen) oder schießen
const sum = { gezogen: 0, gegraben: 0, geschossen: 0, schussNachGraben: 0 };
const imBild = async (x, y) => x > 5 && y > 80 && x < (await ev('innerWidth')) - 5 && y < (await ev('innerHeight')) - 160;
const waehle = async uid => {
  const [x, y] = await ev(`__dbg.hexCss(...(u => [u.c, u.r])(__dbg.G.units.find(u => u.id === ${uid})))`);
  if (await imBild(x, y)) { await maus(Math.round(x), Math.round(y - 20), true); await sleep(400); }
  for (let i = 0; i < 40 && !(await ev(`!!(__dbg.sel && __dbg.sel.id === ${uid})`)); i++) { await taste('Tab', 'Tab'); await sleep(200); }
  return ev(`__dbg.sel && __dbg.sel.id === ${uid} ? __dbg.sel.type : null`); };
async function zug(runde) {
  const ids = JSON.parse(await ev(`JSON.stringify(__dbg.G.units.filter(u => u.side === __dbg.G.side && __dbg.E.active(u) && ['inf','storm','mg','flame'].includes(__dbg.E.TYPES[u.type].cls)).map(u => u.id))`));
  let k = 0;
  for (const uid of ids) {
    const typ = await waehle(uid); if (!typ) { console.log('  Einheit', uid, 'nicht wählbar'); continue; }
    const felder = JSON.parse(await ev(`JSON.stringify((() => { const G = __dbg.G, E = __dbg.E, seen = {}, out = []; const foes = G.units.filter(f => f.side !== G.side && E.alive(f));
      const nah = n => Math.min(...foes.map(f => E.dist(f.c, f.r, n.c, n.r)));
      for (const n of __dbg.reach) { const t = G.map[n.c][n.r].t; if ((seen[t] || 0) >= 2) continue; seen[t] = (seen[t] || 0) + 1; out.push([n.c, n.r, t, n.march ? 1 : 0, nah(n)]); } return out; })())`));
    for (const [c, r] of felder.slice(0, 8)) { const [hx, hy] = await ev(`__dbg.hexCss(${c}, ${r})`); if (await imBild(hx, hy)) { await maus(Math.round(hx), Math.round(hy)); await sleep(200); } }
    const vor = felder.filter(f => !f[3] && f[4] >= 2).sort((a, b) => a[4] - b[4])[0];   // vorrücken, aber nicht direkt neben den Feind
    if (vor) { const [hx, hy] = await ev(`__dbg.hexCss(${vor[0]}, ${vor[1]})`);
      if (await imBild(hx, hy)) { await maus(Math.round(hx), Math.round(hy)); await sleep(200); await maus(Math.round(hx), Math.round(hy), true); await sleep(300); await warteFrei();
        if (await ev(`(u => u.c === ${vor[0]} && u.r === ${vor[1]})(__dbg.G.units.find(u => u.id === ${uid}))`)) sum.gezogen++; } }
    if (!(await ev(`!!(__dbg.sel && __dbg.sel.id === ${uid})`))) await waehle(uid);
    const graben = k++ % 2 === 0;
    const knopf = graben && await ev(`(() => { const b = document.querySelector('#hudRow .up-ab[data-act="dig"]:not(.off)'); if (!b) return null; const r = b.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; })()`);
    if (knopf) { await maus(Math.round(knopf[0]), Math.round(knopf[1]), true); await sleep(300); await warteFrei();
      if (await ev(`__dbg.G.units.find(u => u.id === ${uid}).dug`)) { sum.gegraben++;
        if (await ev(`__dbg.targets.filter(t => t.kind === 'fire').length`) > 0) { sum.schussNachGraben++; fehler.push(`Einheit ${uid}: nach dem Eingraben noch Schussziele`); }
        if (await ev(`(u => { u.bp = Math.max(u.bp || 0, 1); return __dbg.E.reachable(__dbg.G, u).size; })(__dbg.G.units.find(u => u.id === ${uid}))`) > 0) fehler.push(`Einheit ${uid}: eingegraben, aber ohne Ausgraben zugfähig (F36)`); } }   // Prüfliste 5.8
    const ziel = await ev(`(() => { const t = __dbg.targets.find(t => t.kind === 'fire'); return t ? t.id : null; })()`);
    if (ziel != null) { const [tx, ty] = await ev(`__dbg.hexCss(...(u => [u.c, u.r])(__dbg.G.units.find(u => u.id === ${ziel})))`);
      if (await imBild(tx, ty)) { await maus(Math.round(tx), Math.round(ty - 20)); await sleep(200); await maus(Math.round(tx), Math.round(ty - 20), true); await sleep(300); await warteFrei();
        if (await ev(`__dbg.G.units.find(u => u.id === ${uid}).attacked`)) sum.geschossen++; } }
    for (const [c, r] of felder.slice(0, 3)) { const [hx, hy] = await ev(`__dbg.hexCss(${c}, ${r})`); if (await imBild(hx, hy)) { await maus(Math.round(hx), Math.round(hy)); await sleep(120); } }
    if (await ev('__dbg.busy')) fehler.push(`Runde ${runde}: nach ${typ} weiter beschäftigt`);
  }
  console.log(`Runde ${runde}: ${ids.length} Trupps – gezogen ${sum.gezogen}, eingegraben ${sum.gegraben}, geschossen ${sum.geschossen}, Schussziele nach Eingraben ${sum.schussNachGraben} (Summen)`);
  await karteOk(`nach Zug ${runde}`); await bild(`runde${runde}`);
}
const rundeBeenden = async () => { const vor = await ev('__dbg.G.turn');
  await ev(`[...document.querySelectorAll('button')].find(b => b.offsetParent && /runde beenden/i.test(b.textContent)).click()`);
  for (let i = 0; i < 180; i++) { await sleep(1000); if (await ev(`__dbg.G.side === 'A' && !__dbg.busy && __dbg.G.turn > ${vor}`) || await ev('__dbg.G.over')) break; }
  console.log('  KI-Zug fertig, Runde', await ev('__dbg.G.turn')); };

await zug(1);
// Vollbild mehrmals an/aus (echte Fullscreen-API mit Nutzergeste) und Fenstergrößen wechseln
for (let i = 0; i < 3; i++) {
  const an = await ev(`document.documentElement.requestFullscreen().then(() => true, e => 'abgelehnt: ' + e.message)`, true); await sleep(800);
  await karteOk(`Vollbild an ${i + 1} (${an === true ? 'echt' : an})`); await bild(`vollbild_an_${i + 1}`);
  await ev(`document.fullscreenElement ? document.exitFullscreen().then(() => true) : 'war nicht an'`, true); await sleep(800);
  await karteOk(`Vollbild aus ${i + 1}`);
}
for (const [w, h] of [[1280, 800], [2560, 1440], [1920, 1200], [1920, 1080]]) { await groesse(w, h); await sleep(900); await karteOk(`${w}×${h}`); }
await bild('nach_groessen');
for (const [w, h] of [[1280, 800], [2560, 1440], [1920, 1200], [1920, 1080]]) { await groesse(w, h); await sleep(900); await karteOk(`${w}×${h}`); }
for (let r = 2; r <= 4 && !(await ev('__dbg.G.over')); r++) { await rundeBeenden(); await zug(r); }
// F89 (2026-11-22): alle Einheitentypen beider Seiten – gezeigte Blickrichtung zum Feind (Konkordat rechts, Aschenwacht links) und gedreht;
// F90: Fahrzeuge drehen sich im Nahkampf (auch beim Gegenschlag) nicht zum Angreifer. Läuft zuletzt, weil es die Partie umbaut.
{ await groesse(1920, 1080); await sleep(500);
  const roh = await ev(`(async () => { const D = __dbg, G = D.G, E = D.E, W = ms => new Promise(r => setTimeout(r, ms)); const u = G.units[0], v = G.units[1], falsch = [], ohne = [];
    for (const x of G.units) { x.c = -5; x.r = -5; } G.units = [u, v]; v.type = 'kohorte'; v.side = 'A'; v.c = 2; v.r = 2; u.c = 6; u.r = 4; D.select(u.id);
    for (const t of Object.keys(E.TYPES)) { const T = E.TYPES[t]; u.type = t; u.side = T.side || 'A'; u.c = 6; u.r = 4; u.str = 10; u.mor = T.mor || 8; u.supp = 0; u.status = 'ok';
      for (const f of [u.side === 'A' ? 0 : 3, u.side === 'A' ? 3 : 0]) { u.face = f; D.sync(); await W(120); const b = D.du(u.id).bildLinks; if (b == null) ohne.push(t); else if (b !== (f === 3)) falsch.push(t + '/' + f); } }
    // F90: Panzer (Aschenwacht, Blick links) wird von rechts angegriffen und schlägt zurück
    u.type = 'sturmpz'; u.side = 'D'; u.face = 3; u.c = 6; u.r = 4; u.str = 10; v.type = 'kohorte'; v.side = 'A'; v.c = 7; v.r = 4; v.face = 3; v.str = 10; v.mor = 8; v.ap = 1; v.bp = 3; v.attacked = false; v.status = 'ok'; G.side = 'A'; v.held = false; u.status = 'ok'; v.supp = 0; u.supp = 0; v.officer = null; v.moved = false; v.bpUsed = 0; v.dug = false; v.setup = false; v.broken = 0; v.stuck = 0;
    D.sync(); await W(200); const evs = E.melee(G, v, u); let gedreht = false; const p = D.spiel(evs); for (let i = 0; i < 60; i++) { if (D.du(u.id).face !== 3 || D.du(u.id).bildLinks !== true) gedreht = true; await W(50); } await p;
    // F97: Getroffen-Pose – Blickrichtung bleibt, nie gespiegelt, Taumeln vom Angreifer weg (Konkordat/Aschenwacht, Beschuss von vorn/hinten/Seite, Nahkampf)
    for (let c = 3; c <= 9; c++) for (let r = 1; r <= 6; r++) if (G.map[c] && G.map[c][r] && !['open', 'trench', 'crater'].includes(G.map[c][r].t)) G.map[c][r].t = 'open';   // Testgebiet frei (Krähenfurt: Häuser/Eis), nur im Test
    const f97 = []; for (const [zt, zs, zf, ac, ar, art] of [['kohorte', 'A', 0, 8, 4, 'fire'], ['kohorte', 'A', 0, 4, 4, 'fire'], ['kohorte', 'A', 0, 6, 2, 'fire'], ['grenadier', 'D', 3, 4, 4, 'fire'], ['grenadier', 'D', 3, 8, 4, 'fire'], ['kohorte', 'A', 0, 7, 4, 'melee'], ['grenadier', 'D', 3, 5, 4, 'melee']]) { await p;
      const as = zs === 'A' ? 'D' : 'A'; Object.assign(u, { type: as === 'A' ? 'kohorte' : 'grenadier', side: as, officer: null, c: ac, r: ar, face: ac > 6 ? 3 : 0, str: 10, mor: 8, ap: 1, bp: 3, bpUsed: 0, attacked: false, supp: 0, status: 'ok', moved: false, held: false, setup: false });
      Object.assign(v, { type: zt, side: zs, officer: null, c: 6, r: 4, face: zf, str: 10, mor: 8, status: 'ok', supp: 0, held: false }); G.side = as; D.sync(); await W(150);
      const e3 = art === 'melee' ? E.melee(G, u, v) : E.fire(G, u, v); const fall = zs + ' ' + art + ' von ' + ac + ',' + ar; if (!e3.length) { f97.push(fall + ': keine Aktion'); continue; }
      const fz = D.du(v.id).face; let gesehen = 0, fehl = ''; const pp = D.spiel(e3);
      for (let i = 0; i < 100 && !fehl; i++) { const q = D.poseInfo(v.id); if (q && q.art === 'getroffen' && art === 'fire') { gesehen++; if (q.spiegel) fehl = 'gespiegelt'; else if (q.face !== fz) fehl = 'gedreht'; else if (q.von != null && Math.abs(q.von - q.x) > 1 && Math.abs(q.dxWelt) > 0.01 && Math.sign(q.dxWelt) === Math.sign(q.von - q.x)) fehl = 'taumelt zum Angreifer'; }
        if (q && q.art === 'getroffen' && art === 'melee') { gesehen++; if (q.spiegel) fehl = 'gespiegelt'; } await W(30); }
      await pp; f97.push(fall + ': ' + (fehl || (gesehen ? 'ok' : 'keine Pose gesehen'))); }
    // F88/F93: „fertig“ (grau, Haken) nur, wenn nichts mehr geht – auch kein Ziehen; mit Bewegungspunkten noch bereit
    const f88 = {}; for (const [t, wie, bp, soll] of [['kohorte', 'fire', 9, 'ziehen'], ['kohorte', 'fire', 0, 'fertig'], ['moerser', 'shell', 9, 'ziehen'], ['moerser', 'shell', 0, 'fertig'], ['mahlwerk', 'fire', 0, 'fertig']]) { await p; const tag = t + '/bp' + Math.min(bp, 1);
      u.type = t; u.side = 'A'; u.officer = null; u.c = 5; u.r = 4; u.face = 0; u.ap = 1; u.bp = Math.min(bp, E.bpMax(u)); u.bpUsed = 0; u.attacked = false; u.moved = false; u.mvd = 0; u.setup = t === 'mahlwerk'; u.limbered = false; u.supp = 0; u.dug = false;
      v.type = 'grenadier'; v.side = 'D'; v.c = 7; v.r = 4; v.str = 10; v.status = 'ok'; G.side = 'A'; D.sync();
      const e2 = wie === 'shell' ? (E.canShell(G, u, v.c, v.r, 'he') ? E.shell(G, u, v.c, v.r, 'he') : null) : (E.canFire(G, u, v) ? E.fire(G, u, v) : null);
      if (!e2) { f88[tag] = 'keine Aktion möglich'; continue; } await D.spiel(e2); const g = D.bereitGrund(u.id) || 'fertig'; f88[tag] = g === soll ? 'ok ' + g : 'FEHLER ' + g + ' statt ' + soll; }
    return JSON.stringify({ n: Object.keys(E.TYPES).length, falsch, ohne, panzerGedreht: gedreht, evs: evs.map(e => e.t), f88, f97 }); })()`);
  if (typeof roh !== 'string' || !roh.startsWith('{')) { fehler.push('Abschlussprüfung F88–F97: ' + roh); console.log('  Abschlussprüfung: ' + roh); } const r = JSON.parse(roh && roh.startsWith('{') ? roh : '{"f97":[],"f88":{},"falsch":[],"ohne":[],"evs":[]}');
  console.log('  F97 Getroffen: ' + r.f97.join(' | ')); for (const z of r.f97) if (!/: (ok|keine Pose gesehen)$/.test(z)) fehler.push('F97: ' + z);
  console.log(`  F88 nach der Aktion: ${JSON.stringify(r.f88)}`); for (const [t, g] of Object.entries(r.f88)) if (!g.startsWith('ok')) fehler.push(`F88: ${t}: ${g}`);
  console.log(`  Blickrichtung aller ${r.n} Typen: ${r.falsch.length ? 'FEHLER ' + r.falsch.join(', ') : 'ok'}${r.ohne.length ? ' (ohne neue Figur: ' + r.ohne.join(', ') + ')' : ''}; Panzer im Nahkampf ${r.panzerGedreht ? 'GEDREHT' : 'bleibt'} (${r.evs.join(' ')})`);
  if (r.falsch.length) fehler.push('F89: falsche Blickrichtung: ' + r.falsch.join(', '));
  if (r.panzerGedreht) fehler.push('F90: Panzer dreht sich im Nahkampf'); if (!r.evs.length) fehler.push('F90: Nahkampf gegen den Panzer kam nicht zustande'); }
// F100 (2026-11-22): Fähigkeits-Modus, Klick auf ein ungültiges Ziel (Panzer, Sturmrollen, Gegner 4 Felder weg) – kein Schuss, keine Pause, Meldung
{ const vorher = JSON.parse(await ev(`(async () => { const D = __dbg, G = D.G, E = D.E, W = ms => new Promise(r => setTimeout(r, ms)); const [u, v] = G.units;
    Object.assign(u, { type: 'sturmpz', side: G.side, officer: null, c: 4, r: 4, face: G.side === 'A' ? 0 : 3, str: 10, mor: 8, ap: 1, bp: 4, bpUsed: 0, attacked: false, moved: false, supp: 0, status: 'ok', cdA: 0, broken: 0, stuck: 0, zw: 0, held: false });
    Object.assign(v, { type: G.side === 'A' ? 'grenadier' : 'kohorte', side: G.side === 'A' ? 'D' : 'A', officer: null, c: G.side === 'A' ? 8 : 0, r: 4, str: 10, mor: 8, status: 'ok', supp: 0 });
    D.sync(); D.select(u.id); await W(300); await D.panelAct('abil'); await W(300); const p = D.hexCss(v.c, v.r); return JSON.stringify({ p, id: u.id, set: D.abilSet.size, fire: E.canFire(G, u, v) }); })()`));
  await maus(vorher.p[0], vorher.p[1], true); await sleep(1500); await warteFrei();
  const nach = JSON.parse(await ev(`JSON.stringify((() => { const u = __dbg.G.units.find(x => x.id === ${vorher.id}); return { ap: u.ap, cdA: u.cdA || 0, attacked: !!u.attacked, toast: document.getElementById('toast').textContent, an: document.getElementById('toast').classList.contains('on') }; })())`));
  const ok = nach.ap === 1 && !nach.cdA && !nach.attacked && nach.an;
  console.log(`  F100 Sturmrollen auf zu weites Ziel: ${ok ? 'ok' : 'FEHLER'} (Ziele ${vorher.set}, normaler Schuss wäre ${vorher.fire ? 'möglich' : 'nicht möglich'}; Meldung „${nach.toast}“)`);
  if (!ok) fehler.push('F100: ungültiges Fähigkeitsziel löst etwas aus: ' + JSON.stringify(nach)); }
// Paket A (Enrico 2026-11-23): Fertig ohne Ziel (18:30), nur ein Bedienmodus (Punkt 9), Fähigkeit nicht durch bloßes Anklicken (Punkt 22)
{ const r = JSON.parse(await ev(`(async () => { try { const D = __dbg, G = D.G, W = ms => new Promise(r => setTimeout(r, ms)), out = {};
    while (G.units.length < 4) G.units.push({ ...G.units[0], id: 900 + G.units.length, c: 3 + G.units.length, r: 8, status: 'ok' });   /* am Ende der Partie können Einheiten fehlen */
    G.units.forEach((x, i) => { if (x.c < 0 || x.r < 0) { x.c = 9 + (i % 4); x.r = 1 + Math.floor(i / 4); } });   /* Überbleibsel früherer Testblöcke außerhalb der Karte */
    const [u, v, w] = G.units; for (const x of [u, v, w]) x.side = G.side; if (!G.units.some(x => x.side !== G.side)) G.units[3].side = G.side === 'A' ? 'D' : 'A'; D.neuDU(); const fe = G.units.filter(x => x.side !== G.side), alt = fe.map(x => x.status);
    const basis = { officer: null, face: G.side === 'A' ? 0 : 3, str: 10, mor: 8, ap: 1, bp: 0, bpUsed: 0, attacked: false, moved: false, supp: 0, status: 'ok', cdP: 0, cdA: 0, broken: 0, stuck: 0, zw: 0, sent: false };
    // 18:30: Haubitze in Stellung, kein Gegner am Leben → Fertig-Knopf da, ohne Grund offen zu sein
    for (const x of fe) x.status = 'dead';   /* kein Gegner am Leben */
    Object.assign(u, basis, { type: 'haubitze', c: 2, r: 2, limbered: false }); D.sync(); D.select(u.id); await W(300);
    out.fertigKnopf = D.knoepfe().includes('pass'); out.grund = D.bereitGrund(u.id); out.ziel = D.zielDa(u.id);
    fe.forEach((x, i) => x.status = alt[i]);
    // Punkt 9: Panzer – Kanone (p-fire), dann Zweitwaffe: nie zwei Modi; gleicher Knopf schaltet aus; Esc bricht ab
    Object.assign(u, basis, { type: 'sturmpz', c: 4, r: 4, bp: 4, limbered: false }); D.sync(); D.select(u.id); await W(200);
    await D.panelAct('p-fire'); out.m1 = D.modus(); await D.panelAct('zweit'); out.m2 = D.modus(); await D.panelAct('p-fire'); out.m3 = D.modus(); await D.panelAct('p-fire'); out.m4 = D.modus();
    await D.panelAct('p-fire'); document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); await W(100); out.m5 = D.modus();
    // Punkt 22: Versorgungstrupp mit Munition-Modus, dann andere Einheit wählen → Modus weg, keine Munition
    Object.assign(v, basis, { type: 'munition', c: 5, r: 5 }); Object.assign(w, basis, { type: 'feldkanone', c: 6, r: 5, attacked: true, ap: 0 }); D.sync();
    D.select(v.id); await W(200); await D.panelAct('abil'); out.m6 = D.modus(); D.select(w.id); await W(200); out.m7 = D.modus(); out.wNachher = { attacked: w.attacked, ap: w.ap };
    D.select(v.id); await W(200); out.p = D.hexCss(w.c, w.r); out.v = v.id; out.w = w.id; return JSON.stringify(out); } catch (e) { return JSON.stringify({ err: String(e.stack).slice(0, 400) }); } })()`));
  if (r.err) { console.log("  Paket A: FEHLER im Test " + r.err); fehler.push("Paket A Test: " + r.err); } else {
  await maus(r.p[0], r.p[1], true); await sleep(900); await warteFrei();   // ohne Modus auf die eigene Feldkanone klicken
  const n = JSON.parse(await ev(`JSON.stringify((() => { const D = __dbg, w = D.G.units.find(x => x.id === ${r.w}); return { sel: D.sel && D.sel.id, attacked: w.attacked, ap: w.ap }; })())`));
  const ok18 = r.fertigKnopf && r.grund === '' && !r.ziel, ok9 = r.m1 === 'p-fire' && r.m2 !== 'p-fire' && r.m3 === 'p-fire' && r.m4 === null && r.m5 === null, ok22 = r.m6 !== 'abil' || (r.m7 === null && r.wNachher.attacked && n.attacked && n.sel === r.w);
  console.log(`  Paket A 18:30 Geschütz ohne Ziel: ${ok18 ? 'ok' : 'FEHLER'} (Fertig-Knopf ${r.fertigKnopf}, Grund „${r.grund}“)`);
  console.log(`  Paket A Punkt 9 nur ein Modus: ${ok9 ? 'ok' : 'FEHLER'} (${[r.m1, r.m2, r.m3, r.m4, r.m5].join(' → ')})`);
  console.log(`  Paket A Punkt 22 keine Fähigkeit durch Anklicken: ${ok22 ? 'ok' : 'FEHLER'} (Modus ${r.m6} → nach Wechsel ${r.m7}; Klick ohne Modus: gewählt ${n.sel === r.w ? 'Feldkanone' : n.sel}, Munition ${n.attacked ? 'nicht gegeben' : 'GEGEBEN'})`);
  if (!ok18) fehler.push('18:30: Geschütz ohne Ziel ' + JSON.stringify(r)); if (!ok9) fehler.push('Punkt 9: Modi ' + JSON.stringify(r)); if (!ok22) fehler.push('Punkt 22: ' + JSON.stringify({ r, n })); } }
ws.close(); ch.kill();
console.log(fehler.length ? `\nFEHLER (${fehler.length}):\n  ` + [...new Set(fehler)].join('\n  ') : '\nKonsole rot-frei, keine Fehler.');
process.exit(fehler.length ? 1 : 0);
