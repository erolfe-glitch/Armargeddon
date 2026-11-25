// Probebild „Maßstab“ (Paket F, Abschnitt 17:10 Punkt 2, 2026-11-24) – das Spiel bleibt unverändert:
// lädt index.html im unsichtbaren Chrome und liefert dabei eine nur im Speicher veränderte Fassung aus (Fetch-Abfangen; die Spiel-Skripte sind gekapselt):
// Haken an newFigs (Figurenzahl/-größe), gbPlatz (Grabenplätze) und frame (Zeitmessung). Danach
// stellt eine gemischte Gruppe um ein Feld (Grauwall Graben, Krähenfurt Dorf) und nimmt je Variante ein nahes und ein ganzes Bild auf.
// Varianten: A heute · B 8 Figuren/Reiter 5, Soldat 0,6 · C 11/7, Soldat 0,65, Felder ×1,3 (Kamera) · D 10/6, Spezialtrupps 4, Soldat 0,58.
// Leistung: Zeit je Bild (frame) bei ganzer Karte mit beiden Armeen.
// Aufruf: node tools/massstab_bilder.mjs [grauwall|winterdorf …]   (Vorschau-Server auf 127.0.0.1:8765)
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const OUT = 'entwurf/probe/massstab'; mkdirSync(OUT, { recursive: true });
const KARTEN = process.argv.slice(2).length ? process.argv.slice(2) : ['grauwall', 'winterdorf'];
const ALLE = { A: null, B: { line: 8, cav: 5, sc: 0.75 }, C: { line: 11, cav: 7, sc: 0.81, zoom: 1.3 }, D: { line: 10, cav: 6, sc: 0.725 },
  E1: { line: 10, cav: 6, sc: 0.65, mit: true, weit: true }, E2: { line: 10, cav: 6, sc: 0.6, mit: true, weit: true },
  E1f90: { line: 10, cav: 6, sc: 0.65, mit: true, weit: true, fz: 0.9 }, E1f85: { line: 10, cav: 6, sc: 0.65, mit: true, weit: true, fz: 0.85 }, U1: { spiel: true } };   // U1: das Spiel selbst (eingebauter Maßstab, keine Haken)   // Punkt 49/50b: E1f90/E1f85 mit Fahrzeugen und Schreitern ×0,9 bzw. ×0,85; E1 Soldat 0,52, E2 0,48; „mit“ heißt MG/Geschütze im selben Verhältnis, „weit“ lockerer im Feld
const VAR = process.env.VARIANTEN ? Object.fromEntries(process.env.VARIANTEN.split(',').map(k => [k, ALLE[k]])) : process.env.NUR ? { [process.env.NUR]: null } : { A: null, B: { line: 8, cav: 5, sc: 0.75 }, C: { line: 11, cav: 7, sc: 0.81, zoom: 1.3 }, D: { line: 10, cav: 6, sc: 0.725 } };   // sc = Soldatenhöhe relativ zu heute (0,8 Feldradien)
const sleep = ms => new Promise(r => setTimeout(r, ms)), port = 9500 + Math.floor(Math.random() * 300);
const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', ...(process.env.OHNE_GPU ? ['--disable-gpu', '--use-angle=swiftshader'] : []), `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'armmass-'))}`, '--no-first-run', '--mute-audio', '--window-size=1920,1080', '--disable-background-timer-throttling', '--disable-renderer-backgrounding', 'about:blank'], { stdio: 'ignore' });
let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {}, fehler = []; ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; return; } if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') fehler.push('console.error: ' + m.params.args.map(a => a.value ?? a.description ?? '').join(' ').slice(0, 300)); if (m.method === 'Runtime.exceptionThrown') fehler.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); };
const cmd = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async x => { const r = await cmd('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text); return r.result?.result?.value; };
let HTML = readFileSync('index.html', 'utf8'); const hk = (a, b) => { if (HTML.split(a).length !== 2) throw new Error('Haken nicht eindeutig: ' + a); HTML = HTML.replace(a, b); };
hk('function newFigs0(u, d) {', 'function newFigs0(u, d) { const nf0 = newFigs00(u, d); return window.__massNF ? window.__massNF(u, d, nf0, TYPES) : nf0; } function newFigs00(u, d) {');   // seit U1: Spiel hat den Maßstab selbst; die Probe schaltet ihn mit MASSSTAB_ALT ab und rechnet ihre Varianten vom alten Maßstab
hk('function gbPlatz(u, d) {', 'function gbPlatz(u, d) { const p0 = gbPlatz0(u, d); return window.__massGP ? window.__massGP(u, d, p0, TYPES) : p0; } function gbPlatz0(u, d) {');
// U1: der Faktor nf.tiefSc steckt jetzt im Spiel selbst
hk('function frame(t) {', 'function frame(t) { const t0 = performance.now(); try { return frame0(t); } finally { const a = window.__massDT || (window.__massDT = []); a.push(performance.now() - t0); if (a.length > 400) a.shift(); } } function frame0(t) {');
const HTML64 = Buffer.from(HTML, 'utf8').toString('base64');
ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.method === 'Fetch.requestPaused') cmd('Fetch.fulfillRequest', { requestId: m.params.requestId, responseCode: 200, responseHeaders: [{ name: 'Content-Type', value: 'text/html; charset=utf-8' }], body: HTML64 }); });
await cmd('Fetch.enable', { patterns: [{ urlPattern: '*/index.html*', resourceType: 'Document' }] });
await cmd('Runtime.enable'); await cmd('Page.enable'); await cmd('Page.addScriptToEvaluateOnNewDocument', { source: "try{localStorage.setItem('arm.ton','0')}catch(e){}" });
await cmd('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
const bild = async name => { const r = await cmd('Page.captureScreenshot', { format: 'jpeg', quality: 86 }); writeFileSync(join(OUT, name + '.jpg'), Buffer.from(r.result.data, 'base64')); };
const PATCH = `(() => { window.MASSSTAB_ALT = true;
  const SL = (n, weit) => { const hin = Math.ceil(n / 2), vor = n - hin, out = [], bx = weit ? 0.64 : 0.56, row = (k, y, off) => { for (let i = 0; i < k; i++) { const x = k === 1 ? 0 : -bx + 2 * bx * i / (k - 1) + off, j = ((i * 37 + Math.round(y * 100)) % 7 - 3) * 0.012; out.push([x + j, y + j]); } };
    row(hin, weit ? -0.3 : -0.22, 0); row(vor, weit ? 0.3 : 0.24, vor < hin ? 0.1 : 0.06); return out; };   // zwei lockere Reihen, Füße im eigenen Feld
  const LINIE = new Set(['kohorte', 'grenadier']), mehr = (u, TYPES) => { const T = TYPES[u.type]; return LINIE.has(u.type) || (T && T.cls === 'cav'); };
  window.__massNF = (u, d, nf, TYPES) => { const V = window.__massV; if (nf && V && V.fz && nf.deep && (nf.vehicle || nf.gross || /schreiter|eisenknecht|koloss|panzer|bohr/.test(nf.key))) return Object.assign({}, nf, { tiefSc: V.fz }); if (nf && V && V.mit && nf.deep && !nf.vehicle && !nf.gross && !/schreiter|eisenknecht|koloss|panzer|bohr/.test(nf.key)) return Object.assign({}, nf, { tiefSc: V.sc }); if (!nf || !V || nf.deep || nf.vehicle || nf.gross) return nf; nf = Object.assign({}, nf); nf.sc *= V.sc; const T = TYPES[u.type];
    if (nf.trupp && LINIE.has(u.type)) { nf.max = V.line; nf.slots = SL(V.line, V.weit); } else if (nf.trupp && T.cls === 'cav') { nf.max = V.cav; nf.slots = SL(V.cav, V.weit).map(([x, y]) => [x, y * 1.15]); } return nf; };
  window.__massGP = (u, d, p, TYPES) => p && p.pts && window.__massV && mehr(u, TYPES) ? Object.assign({}, p, { pts: null }) : p;   // Grabenplätze gibt es nur für 4 Figuren: größere Trupps stehen auf Reihenplätzen, abgesenkt
  return true; })()`;
const ERG = [];
for (const karte of KARTEN) {
  await cmd('Page.navigate', { url: 'http://127.0.0.1:8765/index.html' }); await sleep(5000);
  await ev(`(async () => { const W = ms => new Promise(r => setTimeout(r, ms)), click = t => { const b = [...document.querySelectorAll('button')].find(b => b.offsetParent && b.textContent.trim().toLowerCase().includes(t)); if (b) b.click(); return !!b; };
    click('neue schlacht'); await W(700); const rb = document.querySelector('input[name=map][value=${karte}]'); if (rb) { rb.click(); rb.dispatchEvent(new Event('change', { bubbles: true })); await W(400); }
    for (const t of ['weiter', 'weiter', 'die schlacht']) { click(t); await W(700); } await W(2500); click('schlacht beginnen'); await W(4000); return true; })()`);
  await ev(PATCH);
  const hell = () => ev("(() => { const c = document.getElementById('map'), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let s = 0, n = 0; for (let i = 0; i < d.length; i += 4 * 997) { s += d[i] + d[i + 1] + d[i + 2]; n++; } return s / n / 3; })()");
  for (let i = 0; i < 40 && (await hell()) < 12; i++) await sleep(500);   // erst weiter, wenn die Karte wirklich gezeichnet ist (erste Ladung im frischen Chrome dauert)
  console.log(karte, 'Kartenhelligkeit beim Start', Math.round(await hell()));
  // Mitte: Grauwall = Grabenfeld der Konkordat-Seite nahe der Kartenmitte, Krähenfurt = Dorffeld nahe der Mitte; drumherum die gemischte Gruppe (Konkordat)
  const lage = JSON.parse(await ev(`JSON.stringify((() => { const G = __dbg.G, E = __dbg.E, C = G.map.length, R = G.map[0].length, want = ${JSON.stringify(karte === 'grauwall' ? ['trench'] : ['village', 'haus', 'platz'])};
    let best = null; for (let c = 1; c < C - 1; c++) for (let r = 1; r < R - 1; r++) { const t = G.map[c][r].t; if (!want.includes(t)) continue; const s = Math.abs(c - C * 0.4) + Math.abs(r - R / 2) * 1.3; if (!best || s < best.s) best = { c, r, s }; }
    const ring = []; for (let c = 0; c < C; c++) for (let r = 0; r < R; r++) { const dd = E.dist(best.c, best.r, c, r); if (dd >= 1 && dd <= 2 && G.map[c][r].t !== 'eis' && G.map[c][r].t !== 'water') ring.push([dd, c, r]); } ring.sort((a, b) => a[0] - b[0] || a[2] - b[2] || a[1] - b[1]);
    const felder = [[best.c, best.r], ...ring.map(x => [x[1], x[2]])];
    const typen = ['kohorte', 'reiter', 'kohorte', 'mahlwerk', 'koloss', 'haubitze', 'kreuz', 'faust', 'grenadier', 'reiter'], A = G.units.filter(u => E.alive(u)), used = new Set(), platz = [];
    typen.forEach((t, i) => { const [c, r] = felder[i]; let u = A.find(x => x.type === t && !used.has(x.id) && (t !== 'grenadier' || x.side === 'D'));
      if (!u) { const vor = A.find(x => !used.has(x.id) && x.side === (t === 'grenadier' ? 'D' : 'A') && !__dbg.E.TYPES[x.type].cmd); u = vor; u.type = t; u.str = 10; }
      used.add(u.id); const da = E.unitAt(G, c, r); if (da && da !== u) { da.c = u.c; da.r = u.r; } u.c = c; u.r = r; u.face = u.side === 'A' ? 0 : 3; if (t === 'mahlwerk') u.setup = true; platz.push([t, u.id, c, r, G.map[c][r].t]); });
    __dbg.neuDU(); const m = __dbg.mitte(best.c, best.r); return { c: best.c, r: best.r, x: m[0], y: m[1], platz }; })())`));
  console.log(karte, 'Mitte', lage.c, lage.r, lage.platz.map(p => p.slice(0, 1).concat(p.slice(4)).join('@')).join(' '));
  for (const [v, V] of Object.entries(VAR)) {
    await ev(`(() => { const V = ${JSON.stringify(V)}; window.__massV = V && V.spiel ? null : V; window.MASSSTAB_ALT = !(V && V.spiel); __dbg.neuDU(); return true; })()`);
    const zn = 1.5 * (V && V.zoom || 1);
    await ev(`(() => { __dbg.camSetzen(${lage.x}, ${lage.y + 10}, ${zn}); return true; })()`); await sleep(1500); await bild(`${karte}_${v}_nah`);
    await ev(`(() => { __dbg.camSetzen(${lage.x}, ${lage.y}, typeof __dbg.ZFIT === 'function' ? __dbg.ZFIT() : __dbg.ZFIT); return true; })()`); await sleep(1200);   // ganze Karte (Passend-Zoom)
    await ev('(() => { window.__massDT = []; return true; })()'); await sleep(3000); await bild(`${karte}_${v}_ganz`);
    const dt = await ev('(() => { const a = (window.__massDT || []).slice().sort((x, y) => x - y); return [a.length, a[Math.floor(a.length / 2)], a[Math.floor(a.length * 0.95)]]; })()');
    ERG.push({ karte, v, bilder: dt[0], median: +dt[1].toFixed(1), p95: +dt[2].toFixed(1) }); console.log(`  ${v}: Zeichenzeit je Bild Median ${dt[1].toFixed(1)} ms, 95 % ${dt[2].toFixed(1)} ms (${dt[0]} Bilder)`);
  }
}
writeFileSync(join(OUT, 'leistung.json'), JSON.stringify(ERG, null, 1));
console.log(fehler.length ? 'Seitenfehler: ' + [...new Set(fehler)].slice(0, 5).join(' | ') : 'keine Seitenfehler'); ws.close(); ch.kill(); process.exit(0);
