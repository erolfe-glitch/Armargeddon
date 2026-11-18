// Partietest mit echten Eingaben (Headless-Chrome, stumm): mehrere Trupps nacheinander wählen, über verschiedene Felder fahren
// (Zugvorschau + Geländehinweis), ziehen, eingraben, schießen, Vollbild mehrmals an/aus und Fenstergrößen wechseln, Runde beenden.
// Prüft: Konsole ohne Fehler, Bildschleife läuft (Karte wird neu gezeichnet, nicht einfarbig), nach jeder Handlung wieder bedienbar,
// nach dem Eingraben kein Schuss mehr möglich.
// Aufruf: node tools/test_partie.mjs   (Vorschau-Server auf 127.0.0.1:8765; URL=… für eine andere Seite; BILDER=ordner für Aufnahmen)
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const URL = process.env.URL || 'http://127.0.0.1:8765/index.html', BILDER = process.env.BILDER || '';
if (BILDER) mkdirSync(BILDER, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms)), port = 9500 + Math.floor(Math.random() * 300);
const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'armpartie-'))}`, '--no-first-run', '--mute-audio', '--window-size=1920,1080', 'about:blank'], { stdio: 'ignore' });
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
  for (const t of ['neue schlacht', 'weiter', 'weiter', 'die schlacht']) { click(t); await W(700); }
  await W(2500); click('schlacht beginnen'); await W(3500); })()`);
console.log('Partie gestartet, Seite', await ev(`__dbg.G.side`));
await karteOk('Start');

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
        if (await ev(`__dbg.targets.filter(t => t.kind === 'fire').length`) > 0) { sum.schussNachGraben++; fehler.push(`Einheit ${uid}: nach dem Eingraben noch Schussziele`); } } }
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
ws.close(); ch.kill();
console.log(fehler.length ? `\nFEHLER (${fehler.length}):\n  ` + [...new Set(fehler)].join('\n  ') : '\nKonsole rot-frei, keine Fehler.');
process.exit(fehler.length ? 1 : 0);
