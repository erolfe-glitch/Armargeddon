// ===== ARMARGEDDON OBERFLÄCHE =====
(function () {
'use strict';
const { TYPES, TERRAIN, SIDES, P } = E;
let COLS = E.COLS, ROWS = E.ROWS, OBJECTIVES = E.OBJECTIVES, mapSel = 'grauwall';
function setMap(id) { E.useMap(id); mapSel = E.MAP.id; COLS = E.COLS; ROWS = E.ROWS; OBJECTIVES = E.OBJECTIVES; }
const figOf = T => T.fig || T.cls;
const figU = u => u.limbered ? 'limber' : figOf(TYPES[u.type]);
const SQ3 = Math.sqrt(3);
// Bilder aus dem UI-Bogen als CSS-Variablen (--ui-end, --ui-frame …) und für das Zeichnen (UIM)
const UIM = {};
{ const A = window.UIART || {}; for (const k in A) { document.documentElement.style.setProperty('--ui-' + k, `url("${A[k]}")`); const im = new Image(); im.onload = () => UIM[k] = im; im.src = A[k]; } }
// Panel-Grafiken (Symbole, Deckungsschilde) auch fürs Zeichnen auf der Karte
const UPI = {};
{ const A = window.UIPANEL || {}; for (const k in A) if (/^(s_|cov|orden|muenze)/.test(k)) { const im = new Image(); im.onload = () => UPI[k] = im; im.src = A[k]; } }
const $ = id => document.getElementById(id);
const fmt = x => String(Math.max(0, Math.round(x * 10)));   // Anzeige in ganzen Zahlen: Stärke 10,0 → 100, Schaden 0,7 → 7 (Wunsch des Nutzers)
const WIND_DEG = [-30, 30, 90, 150, 210, 270];

// ---------- Zustand ----------
let G = null, mode = 'A', blood = true, tempo = 0.5, busy = false;   // tempo = gewählte Stufe; Standard für neue Spieler ½× (Spieltest Runde 2); gespeichertes Tempo gilt weiter
try { const v = +localStorage.getItem('arm.tempo'); if ([0.5, 1, 2, 99].includes(v)) tempo = v; } catch (e) {}   // Tempo bleibt gespeichert (Paket 2)
const GEGNER_TEMPO = 1.2;   // Gegnerzug (KI) etwas schneller als die gewählte Stufe: ½× → 0,6× (Spieltest Runde 2, Punkt 11)
let speed = tempo;   // wirksames Tempo: im Gegnerzug tempo × GEGNER_TEMPO
const INSTANT = 99;   // Tempo „Sofort“: Abläufe praktisch ohne Wartezeit, ohne Kamerafahrt und Ton
const speedTxt = () => tempo >= INSTANT ? 'Tempo sofort' : 'Tempo ' + tempo + '×';
let wayPt = null;   // Wegpunkt (Paket 3): Umschalt+Klick bzw. langes Drücken auf ein Zugfeld, danach das Ziel
let sel = null, reach = new Map(), targets = new Map(), shellHexes = new Set(), artMode = 'he';
let recSet = new Set(), abilSet = new Set(), abilMode = false, feldArt = 'abil';   // feldArt: 'abil' | 'cut' | 'zweit' (Paket 8)
let previewT = null, hoverHex = null, inspect = null, lastPT = 'mouse', placing = null, spawnSet = new Set(), rangeSet = new Set(), hoverU = null, atkPref = 'auto', healSet = new Set(), sendSet = new Set(), sightSet = new Set(), scoutSet = new Set();
// Übersicht auf dem Feld (Etappe 2): verdeckte Felder, Kontur der Reichweite, Vorschau vom Feld unter Maus/Finger, bereite Einheiten
let hideSet = new Set(), rangeEdges = [], touchMove = null, pvCache = null, readyN = 0;
const OPT = { ready: true, strag: true, cam: true, shake: true, tilt: false, base: 0 };   // base: „Base“ unter Einheiten in der neuen Ansicht (0 aus … 3 deutlich)   // tilt: „Neue Ansicht (Test)“, Standard aus   // Hilfen und Spielgefühl (Optionen), im Browser gemerkt
try { const o = JSON.parse(localStorage.getItem('arm.hilfen') || '{}'); for (const k in OPT) if (typeof o[k] === typeof OPT[k]) OPT[k] = o[k]; } catch (e) {}
const DU = new Map();
const particles = [], floaters = [], decals = [], tracers = [], shells = [], booms = [], flames = [], rings = [], muzzles = [];
let skinA = 'A';
const LEADER = { 'Prätor Hask': 4, 'Hauptfrau Morn': 1, 'Hauptmann Veyl': 1, 'Kastellan Orsk': 4, 'Sturmführer Kael': 3, 'Legat Corvin': 2, 'Major Dresk': 2, 'General': 4, 'Hauptmann': 1 };
function leaderKind(u) { if (!u.officer || (u.side === 'A' && skinA !== 'A')) return null; const k = 'leader' + (LEADER[u.officer] ?? 0), a = FIG.ARTS[k + '_' + u.side]; return a && a.img.complete && a.img.naturalWidth ? k : null; }
let queue = [], qRunning = false;
let L = null, K = 0.62, tcv = null, now = 0, ZOOM = 1, ZFIT = 1, zoomFit = false;
const Z_MAX = 2;   // stufenloser Zoom zwischen „ganze Karte“ (ZFIT) und 2×
const human = side => mode === 'hot' || mode === side;

const board = $('board'), cv = $('map'), MAINCTX = cv.getContext('2d');
let ctx = MAINCTX;   // neue Ansicht: beim Zeichnen des flachen Weltbilds zeigt ctx kurz auf dessen Canvas (WCTX)

// ---------- Layout ----------
function layout() {
  neuBedienfeld(VIEW.tilt()); setTimeout(neuKnopfreihe, 0);
  { const tb = $('topbar'); if (tb) document.body.style.setProperty('--tb-unten', Math.round(tb.getBoundingClientRect().bottom) + 'px'); }   // Nachschub-Knopf und Hinweis unter der oberen Leiste, wie hoch sie auch ist (Spieltest Runde 2, Punkt 12)
  if (VIEW.tilt()) return layoutTilt();
  board.classList.remove('tilt');
  const wrap = board.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  const portrait = matchMedia('(orientation: portrait)').matches;
  const MIN_S = 46;   // kleinste Feldgröße in CSS-Pixeln; größere Karten werden dann verschoben (ziehen, Mausrad, Pfeiltasten)
  const base = Math.max(wrap.width, portrait ? 760 : 560, MIN_S * (1.5 * COLS + 0.5));
  // Stauchung K hängt nicht vom Zoom ab (alles skaliert mit s): einmal bei Zoom 1 bestimmen
  const s1 = base * dpr / (1.5 * COLS + 0.5), mi = mapImg();
  K = Math.max(0.42, Math.min(0.86, (wrap.height * dpr - s1 * ((mi ? 0.9 : 1.55) + 0.45)) / (s1 * SQ3 * (ROWS + 0.5))));
  if (mi) { const mk = imgK(mi); K = Math.min(mk, Math.max(K, mk * 0.8)); }   // gemaltes Kartenbild: höchstens 20 % gestaucht, sonst verschieben
  // „Ganze Karte“: größter Zoom, bei dem Breite und Höhe ganz ins Bild passen (höchstens 1)
  const h1 = (s1 * ((mi ? 0.9 : 1.55) + 0.45) + s1 * K * SQ3 * (ROWS + 0.5)) / dpr;
  ZFIT = Math.min(1, wrap.width / base, wrap.height / h1);
  if (zoomFit) ZOOM = ZFIT; ZOOM = Math.max(ZFIT, Math.min(Z_MAX, ZOOM));
  const cssW = base * ZOOM, s = cssW * dpr / (1.5 * COLS + 0.5);
  const top = s * (mi ? 0.9 : 1.55), bot = s * 0.45;
  const H = Math.ceil(top + s * K * SQ3 * (ROWS + 0.5) + bot);
  L = { dpr, s, top, W: Math.round(cssW * dpr), H };
  cv.width = L.W; cv.height = H;
  cv.style.width = cssW + 'px'; cv.style.height = (H / dpr) + 'px';
  // kleiner als das Bild (ganze Karte): mittig
  cv.style.marginLeft = Math.max(0, Math.floor((wrap.width - cssW) / 2)) + 'px'; cv.style.marginTop = Math.max(0, Math.floor((wrap.height - H / dpr) / 2)) + 'px';
  renderTerrain();
  for (const u of G.units) { const d = DU.get(u.id); if (d) { const [x, y] = center(u.c, u.r); d.x = x; d.y = y; } }
}
// ---------- Ansicht ----------
// Alle Geometrie, die vom Blick auf die Karte abhängt, läuft über diesen Abschnitt: Feldmitte (center), Feld unter dem Zeiger (pixToHex),
// Feldecken (hexCorner/hexPath), Verkürzung des Bodens (kAt), Feldgröße an einer Stelle (sAt), Kreise auf dem Boden (gEllipse).
// Flache Ansicht: Karte senkrecht gestaucht um K, überall gleich groß. Neue Ansicht (Schalter OPT.tilt, „Neue Ansicht (Test)“):
// perspektivisch gekippt – wird hier eingehängt (Umbauplan Schritt 1 ff.); bis dahin zeichnen beide Schalterstellungen gleich.
// Das Gelände (renderTerrain) zeichnet weiter flach in tcv; die neue Ansicht projiziert diesen Puffer später ungestaucht.
const VIEW = { tilt: () => true, bbK: null, up: null };   // seit 2026-11-17 fester Standard: immer die neue Ansicht (Schalter entfernt). Die alte, flache Ansicht ist nicht mehr erreichbar und wird nicht weitergepflegt.   // up(x, y): neue Ansicht, Phase „aufrecht“ – Aufsteller für ein Element am Punkt (x, y) einstellen   // bbK: Bodenverkürzung am Fußpunkt, solange eine Einheit als Aufsteller gezeichnet wird
function center(c, r) { return [L.s * (1 + 1.5 * c), L.top + L.s * K * SQ3 * (r + 0.5 * (c & 1) + 0.5)]; }
function kAt(x, y) { return VIEW.bbK != null ? VIEW.bbK : K; }   // senkrechte Verkürzung des Bodens am Bildpunkt (x, y); neue Ansicht: im Weltbild 1, am Aufsteller die Verkürzung am Fußpunkt
function sAt(x, y) { return L.s; }   // Feldradius in Bildpunkten am Bildpunkt (x, y)
function gEllipse(g, x, y, rx, ry) { g.ellipse(x, y, rx, ry * kAt(x, y), 0, 0, 7); }   // Kreis/Ellipse auf dem Boden um (x, y), Radien waagrecht gemessen
function hexCorner(x, y, i, k) { const a = Math.PI / 3 * i; return [x + L.s * k * Math.cos(a), y + L.s * k * Math.sin(a) * kAt(x, y)]; }   // Ecke i des Felds mit Mitte (x, y), k = Anteil des Radius
function pixToHex(x, y) {
  const X = (x - L.s) / L.s, Y = (y - L.top) / (L.s * K) - SQ3 * 0.5;
  const q = 2 / 3 * X, a = -X / 3 + SQ3 / 3 * Y, s = -q - a;
  let rq = Math.round(q), ra = Math.round(a), rs = Math.round(s);
  const dq = Math.abs(rq - q), da = Math.abs(ra - a), ds = Math.abs(rs - s);
  if (dq > da && dq > ds) rq = -ra - rs; else if (da > ds) ra = -rq - rs;
  const c = rq, r = ra + (rq - (rq & 1)) / 2;
  return E.inMap(c, r) ? [c, r] : null;
}
function hexPath(g, c, r, k = 1) {
  const [x, y] = center(c, r);
  g.beginPath();
  for (let i = 0; i < 6; i++) { const [px, py] = hexCorner(x, y, i, k); g.lineTo(px, py); }
  g.closePath();
}

// ---------- Bilder für Kacheln und Effekte ----------
const TIMG = {}, FXI = {}, PJI = {};
{ const D = window.FXDATA || { tiles: {}, fx: {} };
  const load = (store, map) => { for (const k in map) { const im = new Image(); im.onload = () => { store[k] = im; if (store === TIMG && L && G) renderTerrain(); }; im.src = map[k]; } };
  load(TIMG, D.tiles); load(FXI, D.fx); load(PJI, D.proj || {}); }
const fxw = (im, h) => h * im.naturalWidth / im.naturalHeight;

// ---------- Neue Effektbögen (2026-11-17): tools/fx_cut.py → src/fxneu.js (FXNEU) ----------
// Zufällige Variante, im Code bewegt (wachsen, steigen, drehen, ausblenden). Leuchtende Bögen (Schwarzgrund) aufhellend ('lighter').
// Fehlt ein Bild, greifen die alten Effekte aus fx.js.
const FXN = {};
{ const D = window.FXNEU || {}; for (const k in D) { const m = k.match(/^(.+)_(\d+)$/); if (!m) continue; const im = new Image(); im.src = D[k]; (FXN[m[1]] = FXN[m[1]] || [])[+m[2] - 1] = im; } }
const FX_GLOW = new Set(['muendung', 'explosion', 'feuer', 'funken', 'leuchtkugel', 'leuchtspur', 'flammenstrahl', 'drehlauf', 'nahkampf']);
// Größe: längste Seite des größten Teils eines Bogens in Feldradien (Soldat ≈ 0,8 Feldradien hoch)
const FX_SZ = { muendung: 0.7, explosion: 1.7, erdfontaene: 2.0, rauch: 2.3, nebel: 1.7, gas: 1.8, feuer: 0.75, funken: 0.95, blut: 0.8, leuchtkugel: 1.0, truemmer: 1.6, bodenspuren: 1.4, geschosse: 0.42, leuchtspur: 1.2, flammenstrahl: 1, drehlauf: 0.95, nahkampf: 1.15 };
const GESCHOSS_ANG = [-18, -15, -40, 0, -15, -15].map(a => a * Math.PI / 180);   // Grundrichtung der Geschosse im Bogen (gemessen)
const fxIm = (b, i) => { const a = FXN[b]; if (!a || !a.length) return null; const im = a[i != null ? i : Math.floor(Math.random() * a.length)]; return im && im.complete && im.naturalWidth ? im : null; };
const fxN = b => (FXN[b] || []).length;
const fxDim = (im, b, mul = 1) => { const k = L.s * FX_SZ[b] * mul / 320; return [im.naturalWidth * k, im.naturalHeight * k]; };
const fxs = [], gmarks = [];   // laufende Effekte; Spuren am Boden (bleiben einige Runden)
// o: life/delay in 60-Hz-Bildern (mit Spieltempo), mul Größe, anchor 'unten'|'mitte'|'links'|'rechts', ang, flip, flipY, rise (Feldradien),
//    grow (Anteil), spin (Bogenmaß über die Lebenszeit), alpha, fadeIn, fadeOut (Anteil), len (Länge in px, Strahlen/Spuren), move [x2, y2] (fliegt hin)
function fx(b, i, x, y, o = {}) { const im = fxIm(b, i); if (!im) return null; const e = Object.assign({ b, im, x, y, life: 30, delay: 0, mul: 1, anchor: 'unten', ang: 0, rise: 0, grow: 0, spin: 0, alpha: 1, fadeIn: 0, fadeOut: 0.4 }, o); e.max = e.life; fxs.push(e); return e; }
function drawFxs(g, s, up) {
  for (let i = fxs.length - 1; i >= 0; i--) {
    const e = fxs[i]; if (e.delay > 0) { e.delay -= FS; continue; } e.life -= FS;
    if (e.life <= 0) { fxs.splice(i, 1); continue; }
    const k = 1 - e.life / e.max, x = e.move ? e.x + (e.move[0] - e.x) * Math.min(1, k * 1.15) : e.x, y = e.move ? e.y + (e.move[1] - e.y) * Math.min(1, k * 1.15) : e.y;
    if (up) { const f = e.fuss ? (e.move && e.fuss2 ? [e.fuss[0] + (e.fuss2[0] - e.fuss[0]) * Math.min(1, k * 1.15), e.fuss[1] + (e.fuss2[1] - e.fuss[1]) * Math.min(1, k * 1.15)] : e.fuss) : null;
      if (!(f ? up(f[0], f[1]) : up(x, y))) continue; }   // fuss: Aufsteller am Fußpunkt des Schützen (wie die Figur), sonst sitzt ein hoher Punkt wie die Mündung zu tief (Spieltest Runde 2, Punkt 18)
    let [w, h] = fxDim(e.im, e.b, e.mul * (1 + e.grow * k));
    if (e.len) { const r = e.len / w; w = e.len * (e.lenIn ? Math.min(1, (e.max - e.life) / e.lenIn) : 1); h *= Math.min(1.5, Math.max(0.6, Math.sqrt(r))); }   // Strahl wächst in lenIn Bildern auf volle Länge
    const fo = Math.min(1, e.life / (e.max * e.fadeOut)), fi = e.fadeIn ? Math.min(1, (e.max - e.life) / e.fadeIn) : 1;
    g.save(); g.globalAlpha = e.alpha * fo * fi; if (FX_GLOW.has(e.b)) g.globalCompositeOperation = 'lighter'; if (e.filter) g.filter = e.filter;
    g.translate(x, y - e.rise * s * k); if (e.ang || e.spin) g.rotate(e.ang + e.spin * k); if (e.flip) g.scale(-1, 1); if (e.flipY) g.scale(1, -1);
    const ax = e.anchor === 'links' ? 0 : e.anchor === 'rechts' ? -w : -w / 2, ay = e.anchor === 'unten' ? -h : -h / 2;
    g.drawImage(e.im, ax, ay, w, h); g.restore();
  }
}
// Spur am Boden (Brandfleck, Einschlag, Öl, Drahtreste, Kettenspur, Trichter): bleibt „turns“ Runden, die letzte blasst aus
function gmark(b, i, x, y, o = {}) { const im = fxIm(b, i); if (!im || !G) return; gmarks.push(Object.assign({ b, im, x, y, mul: 1, flip: Math.random() < 0.5, turn: G.turn, turns: 3, alpha: 0.9, born: now }, o)); if (gmarks.length > 160) gmarks.shift(); }
function drawGmarks(g) {
  for (let i = gmarks.length - 1; i >= 0; i--) { const m = gmarks[i], age = G.turn - m.turn; if (age >= m.turns) { gmarks.splice(i, 1); continue; }
    const [w, h0] = fxDim(m.im, m.b, m.mul), h = h0 * Math.max(0.55, kAt(m.x, m.y)) * 0.8, fin = Math.min(1, (now - m.born) / 400);
    g.save(); g.globalAlpha = m.alpha * fin * (age === m.turns - 1 ? 0.55 : 1); g.translate(m.x, m.y); if (m.ang) g.rotate(m.ang); if (m.flip) g.scale(-1, 1); g.drawImage(m.im, -w / 2, -h / 2, w, h); g.restore(); }
}
// Laufmündung einer Einheit: gemessen (MUZ) oder vordere Kante der q-ten Figur in Laufhöhe hf (Anteil der Figurhöhe von oben)
function fxMuzzle(id, q = 0, hf = 0.3) {
  const d = DU.get(id); if (!d) return null; const lf = facesLeft(d.face), mitFuss = p => (p.fuss = [d.x, d.y], p);
  if (d.muz) return mitFuss([d.x + (!!d.muz[2] === lf ? d.muz[0] : -d.muz[0]), d.y + d.muz[1]]);
  const bs = d.fbx || []; if (!bs.length) return null;
  let [x0, y0, w, h, fl] = bs[q % bs.length]; if (!!fl !== lf) x0 = -(x0 + w);
  return mitFuss([d.x + (lf ? x0 : x0 + w), d.y + y0 + h * hf]);
}
// Richtung für Bilder, die nach rechts zeigen: nach links gespiegelt statt kopfüber gedreht
function fxDir(x1, y1, x2, y2, lim = 0.6) { const fl = x2 < x1, a0 = Math.max(-lim, Math.min(lim, Math.atan2(y2 - y1, Math.abs(x2 - x1) || 1e-6))); return { flip: fl, ang: fl ? -a0 : a0 }; }
// Mündungsfeuer (≈ 0,1 s): v 0 Gewehr, 1 MG, 2 Pistole, 3 Kanone, 4 Mörser (nach oben), 5 lang und dünn (Scharfschütze, Panzerbüchse)
// Zweitwaffe (Paket 8): Mündung am Seitenerker (Landkoloss, zur Zielseite hin) bzw. vorn am Turm (Turmschreiter)
function fxSeite(id, zid) {
  const d = DU.get(id), u = unitById(id); if (!d) return null; const bs = d.fbx || []; if (!bs.length) return fxMuzzle(id, 0, 0.5);
  let [x0, y0, w, h, fl] = bs[0]; if (!!fl !== facesLeft(d.face)) x0 = -(x0 + w);
  if (u && u.type === 'turm') return fxMuzzle(id, 0, 0.3);
  if (u && u.type === 'kreuz') { const lf = facesLeft(d.face), p = [d.x + x0 + w * (lf ? 0.38 : 0.62), d.y + y0 + h * 0.27]; p.fuss = [d.x, d.y]; return p; }   // Kanone im Löwenmaul
  const z = DU.get(zid), rechts = z ? z.x >= d.x : true, p = [d.x + x0 + w * (rechts ? 0.62 : 0.38), d.y + y0 + h * 0.56]; p.fuss = [d.x, d.y]; return p;
}
let fxZielFuss = null;   // Fußpunkt des aktuellen Ziels (Leuchtspur endet dort am Aufsteller)
function fxFlash(v, p, tx, ty, o = {}) { if (!p) return null; const dr = fxDir(p[0], p[1], tx, ty, 0.5); return fx('muendung', v, p[0], p[1], Object.assign({ fuss: p.fuss, anchor: 'links', life: 6, fadeOut: 0.7, flip: dr.flip, ang: dr.ang, mul: 1 }, o)); }
// Leuchtspur fliegt von p zum Ziel: v 0 Gewehr, 1 MG-Striche, 5 Panzerbüchse
function fxTracer(v, p, tx, ty, o = {}) { if (!p) return null; const dr = fxDir(p[0], p[1], tx, ty, 1.2); return fx('leuchtspur', v, p[0], p[1], Object.assign({ fuss: p.fuss, fuss2: p.fuss && fxZielFuss, anchor: 'rechts', move: [tx, ty], life: 14, fadeOut: 0.25, flip: dr.flip, ang: dr.ang, mul: 0.55 }, o)); }
// Artillerie-, Mörser-, Granateinschlag: Feuerkern (4 Stufen, ca. 0,5 s), dann Erdfontäne, danach steigt Rauch; Spur am Boden
function fxImpact(x, y, r, o = {}) {
  if (!fxIm('explosion') || !fxIm('erdfontaene')) return false;
  const s = L.s, m = r / (s * 0.95), by = y + s * 0.3 * Math.min(1.2, m), dl = o.delay || 0, fl = Math.random() < 0.5;
  if (o.alt) fx('explosion', 4 + (Math.random() < 0.5 ? 0 : 1), x, by, { delay: dl, life: 26, mul: m, grow: 0.15, fadeOut: 0.5 });
  else for (let st = 0; st < 4; st++) fx('explosion', st, x, by, { delay: dl + st * 7.5, life: st < 3 ? 9 : 16, mul: m * (st ? 1 : 0.8), fadeOut: st < 3 ? 0.15 : 0.6, flip: fl });
  fx('erdfontaene', null, x, by, { delay: dl + 4, life: 64, mul: m, grow: 0.2, flip: fl, fadeOut: 0.45 });
  fx('rauch', null, x, by - s * 0.1 * m, { delay: dl + 24, life: 150, mul: m * 0.75, grow: 0.35, rise: 0.9, alpha: 0.72, fadeIn: 18, fadeOut: 0.6, flip: Math.random() < 0.5 });
  if (!o.noMark) setTimeout(() => gmark('bodenspuren', Math.random() < 0.55 ? 1 : 5, x, y + s * 0.15, { mul: 0.7 * Math.min(1.4, m) }), (dl * 16.667 + 200) / speed);
  return true;
}

// ---------- Gelände ----------
const hash = (a, b) => { const n = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453; return n - Math.floor(n); };
const TC = { open: ['#5a5a3a', '#545436', '#5f5e3d'], mud: ['#4c4030', '#473b2c', '#514433'], crater: ['#575638', '#515034', '#5b5a3b'],
  trench: ['#5c593b', '#565337', '#605d3e'], wire: ['#585639', '#525035', '#5c5a3c'], village: ['#66624f', '#605c4a', '#6b6753'],
  forest: ['#42452f', '#3d402b', '#474a32'], canal: ['#34474f', '#30424a', '#384c54'], bridge: ['#34474f', '#30424a', '#384c54'],
  furt: ['#3e5058', '#3a4b52', '#42545c'], sumpf: ['#45482f', '#40432c', '#4a4d33'], wald: ['#2f3a24', '#2b3521', '#334027'], waldweg: ['#4a4a30', '#45452d', '#4f4f34'],
  bunker: ['#5d5c55', '#57564f', '#63625a'], fabrik: ['#5a4a3e', '#55463a', '#5f4e42'], kirche: ['#5e5c55', '#59574f', '#64625a'], barrikade: ['#5a4f3c', '#554a38', '#5f5440'], bahn: ['#55524a', '#504d45', '#5a574f'] };
// Welche gemalte Kachel ein Feld bekommt: Varianten je nach Nachbarschaft und Zufall (fest je Feld)
function tileKey(c, r, h) {
  const t = h.t, n = hash(c * 1.7, r * 9.1), nb = E.neighbors(c, r).map(([a, b]) => G.map[a][b].t);
  const has = k => TIMG[k] ? k : null, wood = nb.some(x => x === 'wald' || x === 'waldweg' || x === 'forest'), wet = nb.some(x => x === 'canal' || x === 'furt' || x === 'sumpf');
  if (t === 'village') { const v = ['village', 'debris', 'village2', 'village3', 'debris2'].filter(k => TIMG[k]); return v[Math.floor(n * v.length)] || 'village'; }
  if (t === 'forest') return n < 0.5 && has('forest2') || 'forest';
  if (t === 'trench') return (wood && has('trenchF')) || (wet && has('trenchW')) || 'trench';
  if (t === 'canal') return (wood && has('canal1')) || has('canal0') || 'canal';
  if (t === 'waldweg') return n < 0.35 && has('lichtung') || 'waldweg';
  return t;
}
const O = '#16150f';
// ---------- Gemalte Karte (Bögen des Nutzers im Ordner Map) ----------
// Statt einer Kachel je Feld: ein durchgehender Boden, weiche Flächen für Wald, Ort und Sumpf,
// Fluss, Gräben, Wege und Bahn als durchgehende Linien von Feld zu Feld, Gebäude und Bäume als Bilder darauf.
const MIMG = {}, BASE = {};
{ const D = (window.FXDATA || {}).mapimg || {};
  for (const k in D) { const im = new Image(); im.onload = () => { MIMG[k] = im; if (L && G && E.MAPS[G.mapId] && E.MAPS[G.mapId].img === k) layout(); }; im.src = D[k]; } }
function mapImg() { const m = G && E.MAPS[G.mapId]; return m && m.img && MIMG[m.img] || null; }
const imgK = im => (1.5 * COLS + 0.5) / (im.naturalWidth / im.naturalHeight * SQ3 * (ROWS + 0.5));
// Gemaltes Kartenbild: Bild unter das Raster, Änderungen im Spiel (Draht gelegt oder geschnitten) darüber zeichnen
function renderImageMap(g, im) {
  const { s } = L, w = s * (1.5 * COLS + 0.5), h = s * K * SQ3 * (ROWS + 0.5);
  g.drawImage(im, 0, L.top, w, h);
  const id = G.mapId, base = BASE[id] || (BASE[id] = E.MAPS[id].build());
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) {
    const t = G.map[c][r].t, b = base[c][r].t, [x, y] = center(c, r);
    if (t === b) continue;
    if (t === 'wire' && PT.spr.wireS) { const ws = s * 2, wh = ws * PT.spr.wireS.naturalHeight / PT.spr.wireS.naturalWidth * 0.8; g.drawImage(PT.spr.wireS, x - ws / 2, y - wh * 0.55, ws, wh); }
    else if (b === 'wire' && PT.tex.mud) {   // Draht geschnitten: Schlamm darüber
      const R = s * 1.05, m = document.createElement('canvas'); m.width = m.height = Math.ceil(R * 2); const mg = m.getContext('2d');
      const gr = mg.createRadialGradient(R, R, 0, R, R, R); gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(0.6, 'rgba(0,0,0,0.95)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      mg.fillStyle = gr; mg.fillRect(0, 0, R * 2, R * 2); mg.globalCompositeOperation = 'source-in'; mg.fillStyle = mg.createPattern(PT.tex.mud, 'repeat'); mg.fillRect(0, 0, R * 2, R * 2);
      g.drawImage(m, x - R, y - R * K, R * 2, R * 2 * K);
    }
  }
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) {
    if (G.map[c][r].t === 'wire') { hexPath(g, c, r, 0.94); g.strokeStyle = 'rgba(205,210,215,0.55)'; g.lineWidth = Math.max(1.5, s * 0.035); g.setLineDash([s * 0.12, s * 0.08]); g.stroke(); g.setLineDash([]); }
    hexPath(g, c, r, 1); g.strokeStyle = 'rgba(12,10,6,0.22)'; g.lineWidth = Math.max(1, s * 0.016); g.stroke();
  }
}
const PT = { tex: {}, spr: {}, n: 0, need: 0 };
{ const D = (window.FXDATA || {}).paint;
  if (D) for (const grp of ['tex', 'spr']) for (const k in D[grp]) {
    PT.need++; const im = new Image();
    im.onload = () => { PT[grp][k] = im; PT.n++; if (PT.n === PT.need && L && G) renderTerrain(); };
    im.src = D[grp][k];
  } }
const paintReady = () => PT.need > 0 && PT.n === PT.need;
const WATER = new Set(['canal', 'bridge', 'furt']), TOWN = new Set(['village', 'kirche', 'fabrik', 'barrikade', 'bahn']);
function renderPainted(g) {
  const { s, W, H } = L, x0 = 0, y0 = L.top - s * K * 1.2;
  const pat = (k, sc = 1) => { const p = g.createPattern(PT.tex[k], 'repeat'); const f = s * 1.9 / 324 * sc; p.setTransform(new DOMMatrix([f, 0, 0, f * 0.92, 0, 0])); return p; };
  const T = (c, r) => E.inMap(c, r) ? G.map[c][r].t : null;
  // 1) Boden: Gras, darüber Schlamm, wo gekämpft wird
  g.save(); g.beginPath(); g.rect(x0, y0, W, H - y0); g.clip();
  g.fillStyle = pat('grass'); g.fillRect(x0, y0, W, H - y0);
  const layer = (tex, wf, rad = 1.25, sc = 1) => {
    const m = document.createElement('canvas'); m.width = W; m.height = H; const mg = m.getContext('2d');
    for (let c = -1; c <= COLS; c++) for (let r = -1; r <= ROWS; r++) {
      const cc = Math.max(0, Math.min(COLS - 1, c)), rr = Math.max(0, Math.min(ROWS - 1, r));
      const w = wf(G.map[cc][rr], cc, rr); if (w <= 0) continue;
      const [x, y] = center(c, r), R = s * rad * (0.9 + hash(c * 2.3, r * 5.1) * 0.25);
      mg.save(); mg.translate(x, y); mg.scale(1, K * 0.95);
      const gr = mg.createRadialGradient(0, 0, 0, 0, 0, R);
      gr.addColorStop(0, `rgba(0,0,0,${w})`); gr.addColorStop(0.55, `rgba(0,0,0,${w * 0.85})`); gr.addColorStop(1, 'rgba(0,0,0,0)');
      mg.fillStyle = gr; mg.fillRect(-R, -R, R * 2, R * 2); mg.restore();
    }
    mg.globalCompositeOperation = 'source-in'; mg.fillStyle = pat(tex, sc); mg.fillRect(0, 0, W, H);
    g.drawImage(m, 0, 0);
  };
  const mid = c => { const f = c / Math.max(1, COLS - 1); return Math.max(0, 1 - Math.abs(f - 0.5) * 2.2); };   // Niemandsland in der Mitte
  layer('mud', (h, c, r) => ({ mud: 1, crater: 1, wire: 0.95, trench: 0.9, bunker: 0.8, barrikade: 0.6, furt: 0.5 })[h.t] ?? (h.t === 'open' ? 0.25 + mid(c) * 0.6 + (hash(c * 4.1, r * 1.3) > 0.7 ? 0.2 : 0) : 0));
  layer('forestfloor', h => ({ wald: 1, forest: 0.8, waldweg: 0.95 })[h.t] || 0, 1.15);
  layer('rubble', h => TOWN.has(h.t) && h.t !== 'bahn' ? 1 : 0, 1.05);
  layer('swamp', h => h.t === 'sumpf' ? 1 : 0, 1.15);
  // Höhen: heller, mit feinen Schraffen
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) if (G.map[c][r].ridge) {
    const [x, y] = center(c, r); g.save(); g.translate(x, y); g.scale(1, K);
    const gr = g.createRadialGradient(0, 0, 0, 0, 0, s * 1.1); gr.addColorStop(0, 'rgba(235,215,160,0.16)'); gr.addColorStop(1, 'rgba(235,215,160,0)');
    g.fillStyle = gr; g.fillRect(-s * 1.1, -s * 1.1, s * 2.2, s * 2.2); g.restore();
  }
  // kleine Trichter und Pfützen im Schlamm
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) {
    const h = G.map[c][r]; if (!(h.t === 'mud' || h.t === 'open' && mid(c) > 0.4)) continue;
    const n = hash(c * 7.7, r * 3.3); if (n < 0.45) continue;
    const [x, y] = center(c, r), px = x + (n - 0.7) * s * 1.2, py = y + (hash(c, r * 2) - 0.5) * s * K, rr = s * (0.12 + n * 0.12);
    g.fillStyle = 'rgba(30,22,12,0.45)'; g.beginPath(); g.ellipse(px, py, rr * 1.25, rr * K * 1.1, 0, 0, 7); g.fill();
    g.fillStyle = 'rgba(70,88,90,0.55)'; g.beginPath(); g.ellipse(px + rr * 0.1, py + rr * K * 0.15, rr * 0.8, rr * K * 0.6, 0, 0, 7); g.fill();
  }
  // 2) Linien: Wege durch Feld zu Feld (Mittelpunkt zu Mittelpunkt, weich gebogen); am Kartenrand laufen sie hinaus
  // wave(l, L): Versatz quer zur Linie (0 an beiden Enden, damit die Stücke nahtlos aneinander passen)
  const linePath = (inSet, joinSet = inSet, wave = null) => {
    const P = new Path2D();
    let hc = 0, hr = 0;
    const emit = pts => {   // Punktfolge mit Querversatz
      let L = 0; const acc = [0]; for (let i = 1; i < pts.length; i++) { L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); acc.push(L); }
      for (let i = 0; i < pts.length; i++) {
        let [x, y] = pts[i];
        if (wave && L > 0) { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, o = wave(acc[i], L, hc, hr); x += -dy / l * o; y += dx / l * o; }
        i ? P.lineTo(x, y) : P.moveTo(x, y);
      }
    };
    const quad = (a, cx, cy, b) => { const out = []; for (let k = 0; k <= 12; k++) { const t = k / 12, u = 1 - t; out.push([u * u * a[0] + 2 * u * t * cx + t * t * b[0], u * u * a[1] + 2 * u * t * cy + t * t * b[1]]); } return out; };
    const seg = (a, b) => { const out = []; for (let k = 0; k <= 8; k++) { const t = k / 8; out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); } return out; };
    for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) {
      if (!inSet(G.map[c][r], c, r)) continue;
      hc = c; hr = r;
      const [x, y] = center(c, r), pts = [];
      for (const [a, b] of E.neighbors(c, r)) if (joinSet(G.map[a][b], a, b)) { const [ex, ey] = center(a, b); pts.push([(x + ex) / 2, (y + ey) / 2]); }
      if (pts.length <= 1) {   // Ende am Rand: hinaus verlängern
        const out = [];
        if (c === 0) out.push([x - s * 1.6, y]); if (c === COLS - 1) out.push([x + s * 1.6, y]);
        if (r === 0) out.push([x, y - s * K * 1.8]); if (r === ROWS - 1) out.push([x, y + s * K * 1.8]);
        if (out.length && pts.length) { const [px, py] = pts[0]; out.sort((p, q) => Math.hypot(q[0] - px, q[1] - py) - Math.hypot(p[0] - px, p[1] - py)); }
        if (out.length) pts.push(out[0]);
      }
      if (!pts.length) { emit(seg([x - s * 0.3, y], [x + s * 0.3, y])); continue; }
      if (pts.length === 1) { emit(seg([x, y], pts[0])); continue; }
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) emit(quad(pts[i], x, y, pts[j]));
    }
    return P;
  };
  // Zickzack der Gräben (Schulterwehren) und sanfte Windungen des Flusses
  const zig = (l, L, c, r) => s * 0.16 * ((c + r) & 1 ? 1 : -1) * Math.min(1, 2.2 * Math.sin(Math.PI * l / L));
  const meander = (l, L) => s * 0.09 * Math.sin(Math.PI * l / L) * (hash(Math.round(L), 3) > 0.5 ? 1 : -1);
  const stroke = (P, style, w, dash) => { g.strokeStyle = style; g.lineWidth = w; g.setLineDash(dash || []); g.stroke(P); g.setLineDash([]); };
  g.lineCap = 'round'; g.lineJoin = 'round';
  // Fluss und Kanal
  const isW = h => WATER.has(h.t);
  if ([...Array(COLS).keys()].some(c => G.map[c].some(isW))) {
    const P = linePath(isW, isW, meander);
    g.lineCap = 'butt';
    stroke(P, 'rgba(22,18,10,0.45)', s * 1.22); stroke(P, '#463d2a', s * 1.04); stroke(P, '#2c3330', s * 0.84);
    stroke(P, pat('water', 0.8), s * 0.74); stroke(P, 'rgba(160,190,195,0.10)', s * 0.5);
    stroke(P, 'rgba(190,215,220,0.22)', s * 0.04, [s * 0.25, s * 0.5]);
    g.lineCap = 'round';
    // Kanalende mitten im Feld: gemauertes Becken mit Schleusentor
    for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) {
      const h = G.map[c][r]; if (!isW(h)) continue;
      const nb = E.neighbors(c, r).filter(([a, b]) => isW(G.map[a][b])); if (nb.length !== 1) continue;
      if (c === 0 || r === 0 || c === COLS - 1 || r === ROWS - 1) continue;
      const [x, y] = center(c, r), [ex, ey] = center(nb[0][0], nb[0][1]), ang = Math.atan2(ey - y, ex - x);
      g.save(); g.translate(x, y); g.rotate(ang);
      g.fillStyle = '#2c3330'; g.fillRect(0, -s * 0.37, s * 0.1, s * 0.74);
      g.fillStyle = '#6e6a60'; g.strokeStyle = O; g.lineWidth = Math.max(1, s * 0.025);
      g.fillRect(-s * 0.12, -s * 0.52, s * 0.14, s * 1.04); g.strokeRect(-s * 0.12, -s * 0.52, s * 0.14, s * 1.04);
      for (let i = -3; i <= 3; i++) { g.beginPath(); g.moveTo(-s * 0.12, i * s * 0.15); g.lineTo(s * 0.02, i * s * 0.15); g.stroke(); }
      g.fillStyle = '#5a4128'; g.fillRect(s * 0.18, -s * 0.37, s * 0.06, s * 0.74); g.strokeRect(s * 0.18, -s * 0.37, s * 0.06, s * 0.74);
      g.restore();
    }
    // Furt: Steine quer, flacheres Wasser
    for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) if (G.map[c][r].t === 'furt') {
      const [x, y] = center(c, r);
      for (let i = 0; i < 9; i++) { const n = hash(c * 3 + i, r * 5 - i), px = x + (i - 4) * s * 0.14, py = y + (n - 0.5) * s * K * 0.7;
        g.fillStyle = '#6e6a5e'; g.strokeStyle = O; g.lineWidth = Math.max(1, s * 0.02); g.beginPath(); g.ellipse(px, py, s * 0.075, s * 0.055, 0, 0, 7); g.fill(); g.stroke(); }
    }
  }
  // Bahn: Schotter, Schwellen, zwei Schienen
  const isB = h => h.t === 'bahn' || h.rail;
  if ([...Array(COLS).keys()].some(c => G.map[c].some(isB))) {
    const P = linePath(isB);
    g.lineCap = 'butt';
    stroke(P, 'rgba(20,18,14,0.5)', s * 0.62); stroke(P, '#6a655c', s * 0.52); stroke(P, '#3b2c1f', s * 0.44, [s * 0.05, s * 0.07]);
    stroke(P, '#8d9294', s * 0.25); stroke(P, '#4f483f', s * 0.19, [s * 0.05, s * 0.07]); g.lineCap = 'round';
  }
  // Wege (Waldweg und Straßen mit h.road): Fahrspuren im Schlamm
  const isR = h => h.t === 'waldweg' || h.road;
  if ([...Array(COLS).keys()].some(c => G.map[c].some(isR))) {
    const P = linePath(isR);
    stroke(P, 'rgba(25,20,12,0.35)', s * 0.42); stroke(P, '#5d4c35', s * 0.34); stroke(P, '#463826', s * 0.24); stroke(P, '#6c5a40', s * 0.16); stroke(P, '#4b3b28', s * 0.1);
  }
  // Gräben: Brustwehr, dunkle Wände, Laufroste; Bunker liegen in der Linie
  const isT = h => h.t === 'trench', joinT = h => h.t === 'trench' || h.t === 'bunker';
  if ([...Array(COLS).keys()].some(c => G.map[c].some(isT))) {
    const P = linePath(isT, joinT, zig);
    g.lineCap = 'butt';
    stroke(P, 'rgba(18,14,8,0.45)', s * 0.82); stroke(P, '#5b4830', s * 0.68); stroke(P, '#7f6d4b', s * 0.56, [s * 0.11, s * 0.025]);
    stroke(P, '#1d160e', s * 0.38); stroke(P, '#2e2418', s * 0.28); stroke(P, '#6b5434', s * 0.12, [s * 0.03, s * 0.05]);
    g.lineCap = 'round';
  }
  g.restore();
  // 3) Bilder: von hinten nach vorn, damit Vordergrund überdeckt
  const S = PT.spr, items = [];
  const put = (k, c, r, wk, dy = 0, flat = false, dx = 0) => { if (S[k]) { const [x, y] = center(c, r); items.push({ k, x: x + dx * s, y: y + dy * s * K, w: s * wk, flat }); } };
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) {
    const t = G.map[c][r].t, n = hash(c * 1.7, r * 9.1);
    if (t === 'bunker') put(['bunker1', 'bunker2', 'bunker3', 'bunker4'][Math.floor(n * 4)], c, r, 2.1, -0.15, true);
    else if (t === 'kirche') put('church', c, r, 2.5, -0.4);
    else if (t === 'fabrik') put('factory', c, r, 2.5, -0.35);
    else if (t === 'barrikade') put('barric', c, r, 2.1, -0.1, true);
    else if (t === 'village') put(['house1', 'house2', 'ruinwall', 'house1', 'house2'][Math.floor(n * 5)], c, r, 2.3, -0.2, true);
    else if (t === 'wald') put(n < 0.5 ? 'treeD' : 'treeK', c, r, 2.35, -0.5);
    else if (t === 'forest') put(n < 0.75 ? 'treeX' : 'treeA', c, r, 2.2, -0.4);
    else if (t === 'crater') put('craterS', c, r, 1.45, 0.05, true);
    else if (t === 'wire') put('wireS', c, r, 2.0, -0.05, true);
    else if (t === 'trench' && n > 0.86 && !E.neighbors(c, r).some(([a, b]) => G.map[a][b].t === 'bunker')) put(n > 0.93 ? 'dugout' : 'mgnest', c, r, 1.3, -0.1, true, (n - 0.9) * 2);
  }
  items.sort((a, b) => a.y - b.y);
  for (const it of items) {
    const im = S[it.k], w = it.w, hgt = w * im.naturalHeight / im.naturalWidth * (it.flat ? Math.max(0.72, Math.min(1, K / 0.6)) : 1);
    g.save(); g.translate(it.x, it.y + hgt * 0.12); g.scale(1, 0.45);
    const sh = g.createRadialGradient(0, 0, 0, 0, 0, w * 0.5); sh.addColorStop(0, 'rgba(10,8,4,0.45)'); sh.addColorStop(1, 'rgba(10,8,4,0)');
    g.fillStyle = sh; g.fillRect(-w / 2, -w / 2, w, w); g.restore();
    g.drawImage(im, it.x - w / 2, it.y - hgt * 0.55, w, hgt);
  }
  // 4) Brücken quer zum Fluss
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) if (G.map[c][r].t === 'bridge') {
    const [x, y] = center(c, r); let dx = 0, dy = 0;
    for (const [a, b] of E.neighbors(c, r)) if (WATER.has(G.map[a][b].t)) { const [ex, ey] = center(a, b); const ux = ex - x, uy = ey - y, l = Math.hypot(ux, uy); if (dx * ux + dy * uy < 0) { dx -= ux / l; dy -= uy / l; } else { dx += ux / l; dy += uy / l; } }
    if (!dx && !dy) dy = 1;
    const ang = Math.atan2(dy, dx) + Math.PI / 2, lw = Math.max(1.2, s * 0.03);
    g.save(); g.translate(x, y); g.rotate(ang);
    g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(-s * 0.95, -s * 0.2, s * 1.9, s * 0.48);
    g.fillStyle = '#5a5248'; g.fillRect(-s * 0.98, -s * 0.3, s * 0.22, s * 0.6); g.fillRect(s * 0.76, -s * 0.3, s * 0.22, s * 0.6);
    g.fillStyle = '#7d5b36'; g.strokeStyle = O; g.lineWidth = lw; g.fillRect(-s * 0.85, -s * 0.24, s * 1.7, s * 0.48); g.strokeRect(-s * 0.85, -s * 0.24, s * 1.7, s * 0.48);
    g.lineWidth = lw * 0.6; for (let i = -7; i <= 7; i++) { g.beginPath(); g.moveTo(i * s * 0.11, -s * 0.24); g.lineTo(i * s * 0.11, s * 0.24); g.stroke(); }
    g.strokeStyle = '#3a2a1a'; g.lineWidth = lw * 1.6; for (const yy of [-0.26, 0.26]) { g.beginPath(); g.moveTo(-s * 0.85, yy * s); g.lineTo(s * 0.85, yy * s); g.stroke(); }
    g.restore();
  }
  // 5) Draht immer deutlich: Rollen und heller Rand
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) if (G.map[c][r].t === 'wire') {
    hexPath(g, c, r, 0.94); g.strokeStyle = 'rgba(205,210,215,0.6)'; g.lineWidth = Math.max(1.5, s * 0.04); g.setLineDash([s * 0.12, s * 0.08]); g.stroke(); g.setLineDash([]);
  }
  // 6) feine Feldlinien, damit man die Felder noch zählen kann
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) { hexPath(g, c, r, 1); g.strokeStyle = 'rgba(12,10,6,0.2)'; g.lineWidth = Math.max(1, s * 0.018); g.stroke(); }
}
// ---------- Gelände-Bausteine (neue Ansicht, STYLE.md „Gelände-Bausteine“) ----------
// Nur mit Schalter „Neue Ansicht (Test)“ und zuerst nur auf GB_KARTEN. Bilder: window.GELAENDE (src/gelaende.js), Aufbau: GBau (src/gelaende_bau.js).
// GBW = aufgebaute Welt: flaches Weltbild (ersetzt tcv), aufrechte Teile (in drawTilt mit den Einheiten nach Tiefe gemischt), platz() für Trupps.
const GB_KARTEN = new Set(['grauwall']);
let FIGQ = null;   // drawTilt: Sammelliste für Grabenfiguren, die einzeln nach Tiefe gezeichnet werden ({ y, f })
let GBW = null, GBIM = null, gbLaden = null, gbKey = '';
const gbAn = () => VIEW.tilt() && GB_KARTEN.has(E.MAP.id) && !!window.GBau && !!window.GELAENDE && !window.NOGB;
function gbBereit() {   // Welt passend zu Karte und Gelände (Draht kann wegfallen) aufbauen; false, solange die Bilder laden
  if (!gbAn() || !L || !G) return false;
  if (!GBIM) { if (!gbLaden) gbLaden = GBau.bilder(n => window.GELAENDE[n]).then(im => { GBIM = im; if (VIEW.tilt() && L) renderTerrain(); }); return false; }
  const key = E.MAP.id + ':' + L.W + 'x' + L.H + ':' + G.map.map(col => col.map(h => h.t[0] + h.t.length).join('')).join('|');
  if (GBW && gbKey === key) return true;
  const t0 = performance.now();
  GBW = GBau.aufbauen({ cols: COLS, rows: ROWS, R: L.s, rand: { mx: 0, top: L.top, mb: L.H - (L.top + L.s * SQ3 * (ROWS + 0.5)) },
    terr: (c, r) => G.map[c][r].t, flags: (c, r) => ({ road: !!G.map[c][r].road, river: !!G.map[c][r].river }),
    zickzack: true, grabenSeite: c => c <= (E.MAP.zoneA ?? 2) ? 'A' : 'D', seed: 1917,
    schanzen: (E.MAP.objectives || []).filter(o => /schanze/i.test(o.id)).map(o => [o.c, o.r]) }, GBIM);   // Schanze = Bunker + Sandsäcke
  gbKey = key; window.__gbMs = Math.round(performance.now() - t0);
  return true;
}
// Wie stehen die Figuren eines Trupps im Feld (Graben: auf der Grabenlinie, abgesenkt; Ruine: Tiefe gestaucht)? Nur in Ruhe auf der Feldmitte.
function gbPlatz(u, d) {
  if (!GBW || !gbAn()) return null;
  const [cx, cy] = center(u.c, u.r); if (Math.hypot(d.x - cx, d.y - cy) > L.s * 0.05) return null;
  return GBW.platz(u.c, u.r);
}
function renderTerrain() {
  const { s, W, H, dpr } = L;
  tcv = tcv || document.createElement('canvas'); tcv.width = W; tcv.height = H;
  const g = tcv.getContext('2d');
  if (VIEW.tilt() && gbBereit()) { g.drawImage(GBW.ground, 0, 0); return; }   // neue Ansicht: Boden aus Bausteinen (Raster ist schon drin)
  g.fillStyle = '#1c1d17'; g.fillRect(0, 0, W, H);
  const sky = g.createLinearGradient(0, 0, 0, L.top * 1.2);
  sky.addColorStop(0, 'rgba(120,22,12,0.78)'); sky.addColorStop(0.55, 'rgba(110,30,14,0.38)'); sky.addColorStop(1, 'rgba(110,30,14,0)');
  g.fillStyle = sky; g.fillRect(0, 0, W, L.top * 1.2);
  const mimg = mapImg();
  if (mimg || paintReady() && !window.NOPAINT) {
    if (mimg) renderImageMap(g, mimg); else renderPainted(g);
    const vg = g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.72);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(6,5,3,0.5)'); g.fillStyle = vg; g.fillRect(0, 0, W, H);
    return;
  }
  g.lineJoin = 'round'; g.lineCap = 'round';
  const lw = Math.max(1.5, s * 0.045), tiled = new Set();
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) {
    const h = G.map[c][r], n = hash(c * 3.1, r * 7.7);
    const tk = tileKey(c, r, h), tim = TIMG[tk]; if (tim) tiled.add(E.key(c, r));
    hexPath(g, c, r, 1.02);
    if (tim) {
      const [hx, hy] = center(c, r), hw = s * 2.06, hh = s * K * SQ3 * 1.04, fl = !['trench', 'trenchF', 'trenchW', 'bridge', 'kirche', 'fabrik', 'bahn'].includes(tk) && n > 0.5;
      g.save(); g.clip(); g.translate(hx, hy); if (fl) g.scale(-1, 1);
      g.drawImage(tim, -hw / 2, -hh / 2, hw, hh); g.restore(); hexPath(g, c, r, 1.02);
    } else { g.fillStyle = TC[h.t][Math.floor(n * 3)]; g.fill(); }
    if (h.ridge) { g.fillStyle = 'rgba(255,226,160,0.12)'; g.fill(); }
  }
  // Gräben: erst Sandsackwall, dann Grabensohle
  for (const pass of TIMG.trench ? [] : [0, 1]) {
    g.strokeStyle = pass ? '#231d15' : '#b39c69'; g.lineWidth = s * (pass ? 0.3 : 0.52);
    for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) if (G.map[c][r].t === 'trench') {
      const [x, y] = center(c, r);
      const nb = E.neighbors(c, r).filter(([nc, nr]) => G.map[nc][nr].t === 'trench');
      if (!nb.length) { g.beginPath(); g.moveTo(x - s * 0.3, y); g.lineTo(x + s * 0.3, y); g.stroke(); }
      for (const [nc, nr] of nb) { const [ex, ey] = center(nc, nr); g.beginPath(); g.moveTo(x, y); g.lineTo((x + ex) / 2, (y + ey) / 2); g.stroke(); }
    }
    if (!pass) {
      g.strokeStyle = 'rgba(22,21,15,0.55)'; g.lineWidth = lw * 0.7;
      for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) if (G.map[c][r].t === 'trench') {
        const [x, y] = center(c, r);
        for (const ox of [-0.24, 0.24]) for (const oy of [-0.5, 0, 0.5]) { g.beginPath(); g.moveTo(x + ox * s - s * 0.05, y + oy * s * K); g.lineTo(x + ox * s + s * 0.05, y + oy * s * K); g.stroke(); }
      }
    }
  }
  // Große weiche Flecken verbinden die Felder zu einem Boden, darüber feine Feldlinien
  { let sd = 99; const rn = () => { sd = (sd * 1664525 + 1013904223) >>> 0; return sd / 4294967296; };
    for (let i = 0; i < 70; i++) {
      const px = rn() * W, py = L.top + rn() * (H - L.top), rad = s * (1.2 + rn() * 2.6);
      const bg = g.createRadialGradient(px, py, 0, px, py, rad), dark = rn() < 0.6;
      bg.addColorStop(0, dark ? 'rgba(30,22,12,0.14)' : 'rgba(150,130,90,0.07)'); bg.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = bg; g.save(); g.translate(px, py); g.scale(1, K); g.translate(-px, -py); g.fillRect(px - rad, py - rad, rad * 2, rad * 2); g.restore();
    } }
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) { hexPath(g, c, r, 1); g.strokeStyle = 'rgba(12,10,6,0.3)'; g.lineWidth = Math.max(1, s * 0.022); g.stroke(); }
  // Schmutz und Körnung, damit der Boden nicht wie eine glatte Fläche wirkt
  { let sd = 4242; const rn = () => { sd = (sd * 1664525 + 1013904223) >>> 0; return sd / 4294967296; };
    for (let i = 0; i < Math.round(W * H / 1400); i++) {
      const px = rn() * W, py = L.top * 0.7 + rn() * (H - L.top * 0.7), rr0 = s * (0.02 + rn() * 0.09);
      g.fillStyle = rn() < 0.55 ? 'rgba(24,18,10,0.16)' : rn() < 0.6 ? 'rgba(96,74,44,0.16)' : 'rgba(210,200,160,0.05)';
      g.beginPath(); g.ellipse(px, py, rr0, rr0 * K, 0, 0, 7); g.fill();
    } }
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) {
    const h = G.map[c][r], [x, y] = center(c, r), n = hash(c * 5.3, r * 2.9);
    if (tiled.has(E.key(c, r)) && h.t !== 'wire') continue;   // gemalte Kachel: keine gezeichneten Zutaten (Draht wird immer zusätzlich gezeichnet, damit er auffällt)
    if (h.t === 'wire') { hexPath(g, c, r, 0.94); g.strokeStyle = 'rgba(205,210,215,0.55)'; g.lineWidth = Math.max(1.5, s * 0.04); g.setLineDash([s * 0.12, s * 0.08]); g.stroke(); g.setLineDash([]); }
    g.strokeStyle = O; g.lineWidth = lw;
    if (h.t === 'mud') {
      g.fillStyle = '#463826';
      for (const [ox, oy, rx] of [[-0.3, -0.15, 0.22], [0.25, 0.1, 0.28], [-0.05, 0.3, 0.18]]) { g.beginPath(); g.ellipse(x + ox * s, y + oy * s * K, rx * s, rx * s * K * 0.7, 0, 0, 7); g.fill(); }
      g.fillStyle = '#7b8b8c'; g.beginPath(); g.ellipse(x + 0.25 * s, y + 0.1 * s * K, 0.12 * s, 0.07 * s * K, 0, 0, 7); g.fill();
    } else if (h.t === 'crater') {
      g.beginPath(); g.ellipse(x, y, s * 0.58, s * 0.58 * K, 0, 0, 7); g.fillStyle = '#8a7a52'; g.fill(); g.stroke();
      g.beginPath(); g.ellipse(x, y + s * 0.03, s * 0.44, s * 0.44 * K, 0, 0, 7); g.fillStyle = '#3c3122'; g.fill();
      g.beginPath(); g.ellipse(x + s * 0.03, y + s * 0.08 * K, s * 0.24, s * 0.22 * K, 0, 0, 7); g.fillStyle = '#566a6c'; g.fill();
    } else if (h.t === 'wire') {
      for (const row of [-0.32, 0.3]) {
        const yy = y + row * s * K;
        for (const ox of [-0.5, 0, 0.5]) {
          g.strokeStyle = O; g.lineWidth = lw * 2.2;
          g.beginPath(); g.moveTo(x + (ox - 0.1) * s, yy + s * 0.12); g.lineTo(x + (ox + 0.1) * s, yy - s * 0.2); g.moveTo(x + (ox + 0.1) * s, yy + s * 0.12); g.lineTo(x + (ox - 0.1) * s, yy - s * 0.2); g.stroke();
          g.strokeStyle = '#6b4a2b'; g.lineWidth = lw;
          g.beginPath(); g.moveTo(x + (ox - 0.1) * s, yy + s * 0.12); g.lineTo(x + (ox + 0.1) * s, yy - s * 0.2); g.moveTo(x + (ox + 0.1) * s, yy + s * 0.12); g.lineTo(x + (ox - 0.1) * s, yy - s * 0.2); g.stroke();
        }
        g.strokeStyle = '#c3c6c8'; g.lineWidth = Math.max(1, lw * 0.6);
        g.beginPath();
        for (let i = 0; i <= 9; i++) { const cx = x + (-0.62 + i * 0.138) * s; g.moveTo(cx + s * 0.09, yy - s * 0.06); g.ellipse(cx, yy - s * 0.06, s * 0.09, s * 0.11, 0, 0, 7); }
        g.stroke();
      }
    } else if (h.t === 'village') {
      const wall = (wx, wy, w, hh, br) => {
        g.beginPath(); g.moveTo(wx, wy); g.lineTo(wx, wy - hh); g.lineTo(wx + w * 0.3, wy - hh * (0.6 + br)); g.lineTo(wx + w * 0.55, wy - hh * 0.9); g.lineTo(wx + w * 0.8, wy - hh * 0.4); g.lineTo(wx + w, wy - hh * 0.55); g.lineTo(wx + w, wy); g.closePath();
        g.fillStyle = '#9a9483'; g.fill(); g.strokeStyle = O; g.lineWidth = lw; g.stroke();
        g.fillStyle = '#2b2a24'; g.fillRect(wx + w * 0.38, wy - hh * 0.5, w * 0.16, hh * 0.28);
      };
      wall(x - s * 0.62, y - s * 0.12 * K, s * 0.62, s * 0.62, n * 0.3);
      wall(x + s * 0.02, y + s * 0.42 * K, s * 0.56, s * 0.46, 0.2);
      g.fillStyle = '#6d6858'; for (const [ox, oy] of [[-0.2, 0.5], [0.4, -0.2], [0.1, 0.15]]) { g.beginPath(); g.ellipse(x + ox * s, y + oy * s * K, s * 0.09, s * 0.05, 0, 0, 7); g.fill(); }
    } else if (h.t === 'forest') {
      const tree = (tx, ty, hh, lean) => {
        g.strokeStyle = O; g.lineWidth = lw * 3.2;
        const p = () => { g.beginPath(); g.moveTo(tx, ty); g.lineTo(tx + lean, ty - hh); g.moveTo(tx + lean * 0.5, ty - hh * 0.5); g.lineTo(tx + lean * 0.5 + hh * 0.28, ty - hh * 0.78); g.moveTo(tx + lean * 0.7, ty - hh * 0.7); g.lineTo(tx + lean * 0.7 - hh * 0.22, ty - hh * 0.95); g.stroke(); };
        p(); g.strokeStyle = '#4a3b2a'; g.lineWidth = lw * 1.6; p();
      };
      tree(x - s * 0.42, y - s * 0.1 * K, s * 0.95, s * 0.06);
      tree(x + s * 0.3, y - s * 0.35 * K, s * 0.8, -s * 0.05);
      tree(x + s * 0.05, y + s * 0.45 * K, s * 0.6, s * 0.04);
    } else if (h.t === 'canal' || h.t === 'bridge') {
      g.strokeStyle = 'rgba(190,220,225,0.35)'; g.lineWidth = lw;
      for (const [ox, oy] of [[-0.3, -0.3], [0.15, 0], [-0.2, 0.35]]) { g.beginPath(); g.moveTo(x + ox * s, y + oy * s * K); g.quadraticCurveTo(x + (ox + 0.12) * s, y + oy * s * K - s * 0.05, x + (ox + 0.26) * s, y + oy * s * K); g.stroke(); }
      if (h.t === 'bridge') {
        g.fillStyle = '#8a6238'; g.strokeStyle = O; g.lineWidth = lw;
        g.beginPath(); g.rect(x - s * 1.0, y - s * 0.3 * K, s * 2.0, s * 0.6 * K); g.fill(); g.stroke();
        g.lineWidth = lw * 0.6; for (let i = -4; i <= 4; i++) { g.beginPath(); g.moveTo(x + i * s * 0.22, y - s * 0.3 * K); g.lineTo(x + i * s * 0.22, y + s * 0.3 * K); g.stroke(); }
      }
    } else if (h.t === 'open' && n > 0.8) {
      g.strokeStyle = 'rgba(30,36,16,0.5)'; g.lineWidth = lw * 0.8;
      const gx = x + (n - 0.9) * s * 4, gy = y + (hash(c, r) - 0.5) * s * K;
      g.beginPath(); g.moveTo(gx - s * 0.06, gy); g.lineTo(gx - s * 0.09, gy - s * 0.1); g.moveTo(gx, gy); g.lineTo(gx, gy - s * 0.13); g.moveTo(gx + s * 0.06, gy); g.lineTo(gx + s * 0.09, gy - s * 0.1); g.stroke();
    }
  }
  const vg = g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.72);
  vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(6,5,3,0.5)');
  g.fillStyle = vg; g.fillRect(0, 0, W, H);
}

// ---------- Einheiten ----------
function initDU() { DU.clear(); for (const u of G.units) addDU(u); }
// Anzeige-Zustand (Wunsch des Nutzers): Zustände und Wolken erscheinen erst, wenn ihr Ereignis abgespielt wird, nicht schon beim Rechnen.
// Die Regeln ändern G sofort; gezeichnet wird VIS bzw. d.vs, das syncAll() nach jedem abgespielten Stapel nachzieht.
const VIS = { clouds: [], smoke: [], lit: [], marks: [], fires: [], ctrl: {} };
const vsOf = u => ({ lance: !!(TYPES[u.type] && TYPES[u.type].blastLance && !u.lanceUsed), dug: !!u.dug, shields: !!u.shields, fireFree: !!u.fireFree, hold: !!u.holdB, planted: !!u.planted, sperr: u.sperr || 0, supp: u.supp || 0, gassed: !!u.gassed, poison: u.poison || 0, rout: u.status === 'rout', broken: u.broken || 0, stuck: u.stuck || 0, setup: !!u.setup, limbered: !!u.limbered });
function visSync(what) { if (!G) return; const cp = a => (a || []).map(k => ({ ...k })); if (!what || what === 'clouds') VIS.clouds = cp(G.clouds); if (!what || what === 'smoke') VIS.smoke = cp(G.smoke); if (!what || what === 'lit') VIS.lit = cp(G.lit); if (!what || what === 'marks') VIS.marks = cp(G.marks); if (!what || what === 'fires') { VIS.fires = cp(G.fires); fireLoop(); } if (!what) { const old = VIS.ctrl || {};
    for (const o of OBJECTIVES) { const a = old[o.id], b = (G.ctrl || {})[o.id]; if (a === b || !b) continue;
      const me = human('A') && !human('D') ? 'A' : human('D') && !human('A') ? 'D' : null;   // gegen die KI: Verlust der eigenen Seite eigens hörbar
      if (me && a === me && b !== me) playSound('verloren', 0.55); else playSound('erobert', 0.55, b); }
    VIS.ctrl = { ...(G.ctrl || {}) }; } }
function addDU(u) { const [x, y] = L ? center(u.c, u.r) : [0, 0]; DU.set(u.id, { x, y, face: u.face, str: u.str, mor: u.mor, alpha: 1, shake: 0, lunge: null, vs: vsOf(u) }); }
function syncAll() {
  for (const u of G.units) {
    if (!DU.has(u.id)) addDU(u);
    const d = DU.get(u.id), [x, y] = center(u.c, u.r);
    d.x = x; d.y = y; d.face = u.face; d.str = u.str; d.mor = u.mor; d.lunge = null;
    d.alpha = E.alive(u) ? 1 : 0; d.vs = vsOf(u);
  }
  visSync();
}
const facesLeft = f => f === 2 || f === 3 || f === 4;
// Figuren stehen in der unteren Hälfte ihres Feldes und bleiben schmal, damit sie Nachbarfelder nicht verdecken
const SLOTS = { smoke: [[0, 0.38]], lobber: [[0, 0.38]], miner: [[0, 0.38]], demo: [[0, 0.38]], wrench: [[0, 0.38]], balloon: [[0, 0.3]], mines: [[0, 0.38]], light: [[0, 0.38]], counter: [[0, 0.38]], gasmask: [[0, 0.38]], ammo: [[0, 0.38]], stalker: [[0, 0.4]], limber: [[0, 0.38]], medic: [[0.2, 0.4], [-0.22, 0.2]], mortar: [[0, 0.38]], inf: [[0.22, 0.42], [-0.24, 0.22], [0, 0.05]], storm: [[0.22, 0.42], [-0.24, 0.22], [0, 0.05]],
  flame: [[0.2, 0.4], [-0.22, 0.2]], cav: [[0, 0.4]], mg: [[0, 0.38]], art: [[0, 0.38]], walker: [[0, 0.4]],
  bike: [[0, 0.38]], sniper: [[0, 0.38]], dog: [[0, 0.38]], atr: [[0, 0.38]], signal: [[0.15, 0.4], [-0.25, 0.2]], sapper: [[0.2, 0.4], [-0.22, 0.2]], raider: [[0.22, 0.42], [-0.24, 0.22]],
  shield: [[0.2, 0.4], [-0.22, 0.2]], heavy: [[0.2, 0.4], [-0.24, 0.2]], mech: [[0, 0.42]], drill: [[0, 0.42]], mechA: [[0, 0.42]], mechB: [[0, 0.42]], mechT: [[0, 0.42]], mechK: [[0, 0.42]], mechC: [[0, 0.42]], fgun: [[0, 0.38]], leader1: [[0.12, 0.4], [-0.3, 0.2]], leader4: [[0.12, 0.4], [-0.3, 0.2]], flamer: [[0.2, 0.4], [-0.22, 0.2]], shieldA: [[0.2, 0.4], [-0.22, 0.2]], phone: [[0.15, 0.4], [-0.25, 0.2]], brawler: [[0.22, 0.42], [-0.24, 0.22]], knight: [[0.2, 0.4], [-0.22, 0.2]], sapperD: [[0.2, 0.4], [-0.22, 0.2]], banner: [[0, 0.4]], suitA: [[0.24, 0.42], [-0.26, 0.2]], suitD: [[0.24, 0.42], [-0.26, 0.2]] };
const FH = { smoke: 0.7, lobber: 0.66, miner: 0.66, demo: 0.7, wrench: 0.66, balloon: 1.15, mines: 0.6, light: 0.7, counter: 0.68, gasmask: 0.62, ammo: 0.64, stalker: 0.5, limber: 0.58, medic: 0.62, mortar: 0.66, inf: 0.62, storm: 0.62, flame: 0.62, mg: 0.68, art: 0.74, walker: 0.86, cav: 0.57,
  bike: 0.62, sniper: 0.64, dog: 0.62, atr: 0.64, signal: 0.6, sapper: 0.6, raider: 0.62, shield: 0.62, heavy: 0.62, mech: 0.64, drill: 0.64, mechA: 0.64, mechB: 0.64, mechT: 0.64, mechK: 0.64, mechC: 0.64, suitA: 0.6, suitD: 0.6,
  fgun: 0.7, leader1: 0.66, leader4: 0.66, flamer: 0.62, shieldA: 0.62, phone: 0.6, brawler: 0.62, knight: 0.64, sapperD: 0.6, banner: 0.74 };
const MAXW = 1.6, MAXWK = { smoke: 1.6, lobber: 1.5, miner: 1.6, demo: 1.6, wrench: 1.6, balloon: 1.3, mines: 1.5, light: 1.6, counter: 1.5, gasmask: 1.7, ammo: 1.6, stalker: 1.6, walker: 2.05, limber: 1.95, art: 1.8, cav: 1.7, mech: 2.1, drill: 2.1, mechA: 2.1, mechB: 2.1, fgun: 1.8, atr: 1.5, sniper: 1.4, bike: 1.5, dog: 1.5 };   // größte Bildbreite in Feldradien
// Figuren etwas größer seit den kleineren Karten (Wunsch des Nutzers). FH/MAXWK gelten nur noch für gezeichnete Ersatzfiguren.
const FSC = 1.12; for (const k in FH) FH[k] *= FSC; for (const k in MAXWK) MAXWK[k] *= 1.06;
// Bildregeln (STYLE.md): 1 Soldatenhöhe = 0,95 Feldradien, Größe je Bild in FIG.SHT. Grenzen: Breite höchstens 1,9 Feldradien,
// über die obere Feldkante höchstens eine halbe Hexhöhe. Reicht der Platz nicht, wird die Figur kleiner.
// Überstand über die obere Feldkante: drei Viertel Hexhöhe; Mechs und Kolosse (big) ohne Höhengrenze, damit sie ihre 1,6 SH erreichen.
const SH_R = 1.18, FIGW_R = 2.2, OVER = 0.75;
const OVER_K = { balloon: 1.5 };   // Fesselballon schwebt: darf weiter nach oben, sonst wird der Trupp darunter winzig
function figSprite(k, side, flip, oy, big) {   // oy = Fußpunkt unter der Feldmitte (Anteil von s, wie SLOTS)
  const s = L.s, h = s * SH_R, sp = FIG.sprite(k, side, flip, h);
  if (!sp.rule) return sp;
  const f = Math.min(1, s * FIGW_R / sp.cw, big ? 1 : s * K * (oy + SQ3 / 2 + (OVER_K[k] || OVER) * SQ3) / sp.top);   // K: flache Ansicht; neue Ansicht bekommt eigene Figurengrößen (Umbauplan Schritt 3)
  return f < 0.995 ? FIG.sprite(k, side, flip, h * f) : sp;
}
// Bis die Karten neu gemalt sind: Figuren in Wald, Totholz und Ruinen leicht abgedunkelt, damit sie „im“ Gelände stehen
const DIM_T = new Set(['wald', 'waldweg', 'forest', 'village', 'fabrik', 'kirche']);

// Kartenmarken nach STYLE.md (Wunsch des Nutzers): an der Figur nur ein schmaler Lebensbalken in Fraktionsfarbe, das Deckungsschild und EIN Zustandsplatz
// (wichtigster Zustand, „+n“ bei mehreren). Eigene Einheiten am Zug: Messingpunkte unter dem Balken = Aktionspunkte. Alles in einer Zeile unter der Figur.
// STATES: Reihenfolge = Wichtigkeit. on(u, d) liest die Anzeige-Werte d.vs, damit Zustände erst beim Abspielen erscheinen.
const STATES = [
  { k: 'supp', sym: 'niedergehalten', name: 'Niedergehalten', on: (u, d) => d.vs.supp > 0, text: () => 'Liegt unter Beschuss flach: kann weder ziehen, schießen noch stürmen, Nahkampf ×0,5. Hält eine eigene Runde an; „Sammeln“ hebt es auf.' },
  { k: 'rout', sym: 'flucht', name: 'Flieht', on: (u, d) => d.vs.rout, text: () => 'Moral gebrochen: weicht zurück und gehorcht nicht. Gegner treffen sie ×1,6, Reiter ×2. Ein Anführer in der Nähe kann sie wieder sammeln.' },
  { k: 'broken', sym: 'festgefahren', name: 'Panne – festgefahren', on: (u, d) => d.vs.broken > 0, text: (u, d) => `Im Schlamm festgefahren: fällt noch ${upRunden(Math.max(1, (u.broken || 1) - 1))} aus. Ein Versorgungstrupp oder Pioniere können sie bergen.` },
  { k: 'sperr', sym: 'garbe', ring: '#E2B04A', name: 'Sperrfeuer', on: (u, d) => d.vs.sperr > 0 && E.alive(u), blockiert: (u, d) => d.vs.supp > 0 || (E.active(u) && E.held(G, u)),
    textBlock: (u, d) => d.vs.supp > 0 ? 'Sperrfeuer blockiert: Das MG ist niedergehalten und schießt nicht, solange das anhält.' : 'Sperrfeuer blockiert: Ein Gegner steht daneben (gebunden), das MG schießt nicht.', text: (u, d) => `Schießt in der gegnerischen Runde noch ${d.vs.sperr}-mal auf Gegner, die sich im Schussfeld im Offenen bewegen.` },
  { k: 'stuck', sym: 'festgefahren', name: 'Festgefahren', on: (u, d) => d.vs.stuck > 0, text: (u, d) => `Im Schlamm stecken geblieben: kann noch ${upRunden(Math.max(1, (u.stuck || 1) - 1))} nicht ziehen.` },
  { k: 'gas', sym: 'gas', name: 'Im Gas', on: (u, d) => d.vs.gassed, text: () => 'Vom Gas getroffen: Stärke und Moral sinken, Angriffe ×0,7 in dieser Runde. Wirkt nach dem Verlassen der Wolke noch 2 Runden nach (vergiftet).' },
  { k: 'poison', sym: 'gas', ring: '#7FA04A', name: 'Vergiftet', on: (u, d) => d.vs.poison > 0 && !d.vs.gassed, text: (u, d) => `Hat Gas abbekommen: verliert noch ${upRunden(d.vs.poison)} Stärke und Moral (erst halb so viel wie in der Wolke, dann ein Viertel). Ein Sanitäter kann die Vergiftung heilen.` },
  { k: 'shaky', sym: 'gebrochen', name: 'Moral wankt', on: (u, d) => !d.vs.rout && d.mor < P.FALLBACK_MOR && TYPES[u.type].cls !== 'art', text: () => 'Moral fast am Ende: Beim nächsten Treffer weicht die Einheit zurück.' },
  { k: 'held', sym: 'nahkampf', name: 'Gebunden', on: u => TYPES[u.type].rng > 0 && !TYPES[u.type].flame && E.active(u) && E.held(G, u), text: () => 'Ein gleich großer Gegner steht daneben: Schießen geht nicht, nur Nahkampf.' },
  { k: 'limber', sym: 'aufprotzen', name: 'Aufgeprotzt', on: u => u.limbered, text: () => `Angespannt: zieht ${P.LIMBER_MV} Felder, feuert aber nicht. Abprotzen bringt das Geschütz in Stellung.` },
  { k: 'mgdown', sym: 'mg_ab', name: 'MG abgebaut', on: (u, d) => TYPES[u.type].mg && !d.vs.setup && E.active(u), text: () => 'Marschbereit: kann ziehen, aber nicht schießen. Aufbauen kostet 1 Aktion, dann feuert es und kann Sperrfeuer geben.' },
  { k: 'mgup', sym: 'mg_auf', name: 'MG aufgebaut', panel: true, on: (u, d) => TYPES[u.type].mg && d.vs.setup && E.active(u), text: () => 'In Stellung: schießt oder gibt Sperrfeuer, kann aber nicht ziehen. Abbauen kostet 1 Aktion.' },   // nur im Panel (Karte: nur „abgebaut“ als Zustand)
  { k: 'ow', sym: 'auge', name: 'Feuerbereit', on: u => u.ow, text: () => 'Schießt in der gegnerischen Runde auf den ersten Gegner, der sich in Reichweite bewegt (Schaden ×0,8).' },
  { k: 'zeal', sym: 'blitz', name: 'Sturmbefehl', on: u => u.zeal, text: () => 'Befehl des Anführers: Nahkampf ×1,25 in dieser Runde.' },
  { k: 'lance', sym: 'sprengladung', name: 'Sprenglanze bereit', panel: true, on: (u, d) => d.vs.lance && E.active(u), text: () => 'Der erste Nahkampfangriff der Schlacht trifft mit der Sprenglanze ×1,5. Danach normale Lanze.' },
  { k: 'lanceGone', sym: 'pferd', name: 'Sprenglanze verbraucht', panel: true, on: (u, d) => TYPES[u.type].blastLance && !d.vs.lance && E.active(u), text: () => 'Die Sprenglanze ist verbraucht: weiter mit der normalen Lanze.' },
  { k: 'dug', sym: 'spitzhacke', ring: '#8a6a44', name: 'Eingegraben', on: (u, d) => d.vs.dug && E.active(u), text: () => 'Hat sich eingegraben: Abwehr ×1,3, bis die Einheit wieder zieht.' },
  { k: 'shields', sym: 'schild', ring: '#9aa3ab', name: 'Schilde vor', on: (u, d) => d.vs.shields && E.active(u), text: () => 'Schilde vor: eigene Einheiten in den Nachbarfeldern nehmen bis zum nächsten eigenen Zug Beschuss ×0,75.' },
  { k: 'fireFree', sym: 'zielen', ring: '#E2B04A', name: 'Feuer frei', on: (u, d) => d.vs.fireFree && E.alive(u), text: () => 'Befehl des Hauptmanns: Fernkampf ×1,25 bis zum nächsten eigenen Zug.' },
  { k: 'hold', sym: 'schild', ring: '#C2A461', name: 'Halten um jeden Preis', on: (u, d) => d.vs.hold && E.active(u), text: () => 'Befehl des Generals: flieht bis zum nächsten eigenen Zug nicht, Abwehr ×1,25.' },
  { k: 'planted', sym: 'fahne', ring: '#C2A461', name: 'Banner steht', on: (u, d) => d.vs.planted && E.active(u), text: () => 'Aufgepflanzt: wirkt 3 Felder weit, dort flieht niemand. Der Träger zieht nicht, bis er das Banner aufnimmt.' },
  { k: 'hidden', sym: 'durchsickern', name: 'Getarnt', on: u => TYPES[u.type].hidden && !(u.revealed > 0) && E.active(u), text: () => 'Der Gegner sieht die Einheit erst vom Nachbarfeld aus. Nach einem Schuss ist sie eine Runde lang enttarnt.' },
  { k: 'relay', sym: 'fernglas', name: 'Beobachter', panel: true, on: u => TYPES[u.type].relay && E.active(u), text: u => TYPES[u.type].abil === 'strike' ? 'Fordert Feuerschläge auf Felder in Sicht an.' : 'Markiert Ziele für die eigene Artillerie: ohne Streuung, ×1,25, deckt Verstecktes auf.' },
];
// Anführer kann jetzt einen Befehl geben (Sammeln oder Sturmbefehl nicht in Abklingzeit, in dieser Runde noch keiner gegeben)
const orderReady = u => !u.ordered && (!(u.cdR > 0) || !(u.cdS > 0));
const statesOf = (u, d) => d && d.vs ? STATES.filter(st => st.on(u, d)) : [];
const COVER_NAME = ['', 'Bronze', 'Silber', 'Gold'];
const coverTip = u => { const cv = E.coverOf(G, u), h = G.map[u.c][u.r]; return cv.tier ? { tier: cv.tier, name: `Deckung ${COVER_NAME[cv.tier]}`, text: `${h.river && h.t === 'canal' ? 'Fluss' : TERRAIN[h.t].name}${h.ridge ? ' auf der Höhe' : ''}: Verteidigung +${Math.round((cv.f - 1) * 100)} %. Bronze = leichte, Silber = gute, Gold = starke Deckung.` } : null; };
// Trefferflächen der Marken auf der Karte (für Tooltips per Maus und Touch), jedes Bild neu gefüllt
const MARKS = [], MARKQ = [];
// „Alle Marken zeigen“: Alt gedrückt halten oder Knopf in der oberen Leiste (Touch); dann liegen die Marken aller Einheiten obenauf
let altHeld = false, marksOn = false;
const marksAll = () => altHeld || marksOn;
// Gemalte Kartenmarken (Wunsch des Nutzers, Stil wie die obere Leiste): Pinsel-Lebensbalken und Pinselstrich-Ringe.
// SVG mit Filtern wird einmal je Farbe in ein Canvas gerastert und dann nur noch kopiert (schnell genug für jedes Bild).
const SPR = {};
function svgSprite(key, svg, w, h) {
  if (key in SPR) return SPR[key];
  SPR[key] = null;
  const im = new Image();
  im.onload = () => { const c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').drawImage(im, 0, 0, w, h); SPR[key] = c; };
  im.src = 'data:image/svg+xml,' + encodeURIComponent(svg);
  return null;
}
// Lebensbalken nach Stand (STYLE.md): über 60 % Moos, 30–60 % Ocker, darunter Ochsenblut. Gilt für Karte und Panel.
const LIFE_COL = { hi: '#6B7A3A', mid: '#B08A2E', low: '#8E2B22' };
const lifeTier = q => q > 0.6 ? 'hi' : q >= 0.3 ? 'mid' : 'low';
// Pinselform des Kampfkraft-Balkens (gleicher Pfad und Filter wie .tb-meter in index.html), mit Tintenkontur
const BRUSH_D = 'M1.5 3.4C30 1.9 70 3.1 110 2.3S170 2.9 191 2.1L196 4.6 193.5 7.8 198.5 11.2 194.5 14 197 16.4 190 17.9C150 18.6 110 17.5 70 18.2S20 17.6 1.5 17.1Z';
const brushBar = col => svgSprite('bar' + col, `<svg xmlns="http://www.w3.org/2000/svg" width="412" height="56" viewBox="-3 -4 206 28" preserveAspectRatio="none">
<filter id="r" x="-5%" y="-30%" width="110%" height="160%"><feTurbulence type="fractalNoise" baseFrequency=".08 .6" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.6"/></filter>
<filter id="s" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".006 .55" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 .07 0 0 0 0 .05 0 0 0 0 .04 2.6 0 0 0 -1.45"/></filter>
<filter id="h" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".008 .7" numOctaves="2" seed="19"/><feColorMatrix values="0 0 0 0 1 0 0 0 0 .95 0 0 0 0 .85 2.4 0 0 0 -1.5"/></filter>
<mask id="m" maskUnits="userSpaceOnUse" x="-3" y="-4" width="206" height="28"><g filter="url(#r)"><path d="${BRUSH_D}" fill="#fff"/></g></mask>
<g filter="url(#r)"><path d="${BRUSH_D}" fill="${col}" stroke="#120D0B" stroke-width="2.8" stroke-linejoin="round"/></g>
<g mask="url(#m)"><rect width="200" height="20" filter="url(#s)" opacity=".7"/><rect width="200" height="20" filter="url(#h)" opacity=".4"/></g></svg>`, 412, 56);
// Unregelmäßiger Pinselstrich-Ring: Tintenschatten, Hauptstrich, trockener Nebenstrich mit Lücken
const brushRing = (col, wide) => svgSprite('ring' + col + (wide ? 'w' : ''), `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 200 200">
<filter id="r" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".03" numOctaves="2" seed="5"/><feDisplacementMap in="SourceGraphic" scale="8"/></filter>
<filter id="q" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="11"/><feDisplacementMap in="SourceGraphic" scale="6"/></filter>
<g filter="url(#r)" fill="none" stroke-linecap="round"><circle cx="100" cy="100" r="84" stroke="#120D0B" stroke-width="${wide ? 15 : 9}" opacity=".5"/><circle cx="100" cy="100" r="84" stroke="${col}" stroke-width="${wide ? 9 : 4.5}" stroke-dasharray="470 18 30 10"/></g>
<g filter="url(#q)" fill="none" stroke-linecap="round"><circle cx="100" cy="100" r="88" stroke="${col}" stroke-width="2.4" opacity=".6" stroke-dasharray="60 25 90 40 120 30"/></g></svg>`, 256, 256);
function drawRing(g, col, x, y, R, wide) {   // R = Radius in Bildpunkten (waagrecht), auf dem Boden verkürzt (kAt)
  const sp = brushRing(col, wide);
  if (!sp) { g.beginPath(); gEllipse(g, x, y, R, R); g.lineWidth = Math.max(1.5, L.s * (wide ? 0.05 : 0.035)); g.strokeStyle = col; g.stroke(); return; }
  const w = R * 2 * 100 / 84, h = w * kAt(x, y); g.drawImage(sp, x - w / 2, y - h / 2, w, h);
}
function drawBrushBar(g, col, bx, by, bw, bh) {   // Breite bw = gefüllter Anteil; Rand der Form ragt etwas über
  const sp = brushBar(col);
  if (!sp) { g.fillStyle = col; g.fillRect(bx, by, bw, bh); return; }
  g.drawImage(sp, bx - bw * 3 / 200, by - bh * 4 / 20, bw * 206 / 200, bh * 28 / 20);
}
// Ersatzschild, falls das gemalte Bild fehlt
const SHIELD_COL = { 1: ['#e6a868', '#a8662c', '#5c3412'], 2: ['#f4f5f7', '#b4b8be', '#5d6168'], 3: ['#fff1a0', '#e0ad2c', '#7a5408'] };
function drawShield(g, cx, cy, h, tier) {
  if (VIEW.up) VIEW.up(cx, cy);
  const im = UPI['cov' + tier];
  if (im) { const w = h * im.naturalWidth / im.naturalHeight; g.save(); g.shadowColor = 'rgba(18,13,11,0.9)'; g.shadowOffsetY = Math.max(1, h * 0.06); g.drawImage(im, cx - w / 2, cy - h / 2, w, h); g.restore(); return; }
  const w = h * 0.82, [hi, mid, lo] = SHIELD_COL[tier];
  g.save(); g.translate(cx, cy);
  g.beginPath(); g.moveTo(-w / 2, -h / 2); g.lineTo(w / 2, -h / 2); g.lineTo(w / 2, -h * 0.08); g.quadraticCurveTo(w * 0.46, h * 0.32, 0, h / 2); g.quadraticCurveTo(-w * 0.46, h * 0.32, -w / 2, -h * 0.08); g.closePath();
  const gr = g.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); gr.addColorStop(0, hi); gr.addColorStop(0.55, mid); gr.addColorStop(1, lo);
  g.fillStyle = gr; g.fill(); g.lineWidth = Math.max(1.5, h * 0.1); g.strokeStyle = '#120D0B'; g.stroke();
  g.restore();
}
const RANGE_COL = '#A8473A';   // STYLE.md --s-range: Kontur der Schussreichweite, Bedrohung
// Linie zwischen zwei Punkten; neue Ansicht (aufrecht): beide Enden projiziert, auf dem Schirm gezogen
function pathLine(g, x1, y1, x2, y2) { if (VIEW.up) { const a = proj(x1, y1), b = proj(x2, y2); g.setTransform(1, 0, 0, 1, 0, 0); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); } else { g.moveTo(x1, y1); g.lineTo(x2, y2); } }
// Nachzügler-Winkel: Messing, Tintenkontur, zeigt nach unten auf die Figur
function chevron(x, y, w) { const g = ctx; g.save(); g.beginPath(); g.moveTo(x - w, y - w * 0.6); g.lineTo(x, y + w * 0.25); g.lineTo(x + w, y - w * 0.6); g.lineTo(x + w, y - w * 0.05); g.lineTo(x, y + w * 0.8); g.lineTo(x - w, y - w * 0.05); g.closePath();
  g.fillStyle = '#C2A461'; g.fill(); g.lineJoin = 'round'; g.lineWidth = Math.max(2, w * 0.18); g.strokeStyle = '#120D0B'; g.stroke(); g.restore(); }
// Zielmarke: vier Messing-Eckklammern mit Tintenschatten
function brackets(cx, cy, R, col) { if (VIEW.up) VIEW.up(cx, cy); const g = ctx, ry = R * kAt(cx, cy) * 1.2, ln = R * 0.4, lw = Math.max(2, L.s * 0.035);
  const seg = () => { for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { g.beginPath(); g.moveTo(cx + sx * R, cy + sy * ry - sy * ln * 0.8); g.lineTo(cx + sx * R, cy + sy * ry); g.lineTo(cx + sx * R - sx * ln, cy + sy * ry); g.stroke(); } };
  g.save(); g.lineCap = 'square'; g.strokeStyle = '#120D0B'; g.lineWidth = lw + 3; seg(); g.strokeStyle = col; g.lineWidth = lw; seg(); g.restore(); }
// Warndreieck (Ochsenblut) mit genau EINER Zahl: wie viele Gegner auf dieses Feld schießen können
function warnMark(x, y, R, n) { if (VIEW.up) VIEW.up(x, y); const g = ctx; g.save(); g.beginPath(); g.moveTo(x, y - R); g.lineTo(x + R * 1.08, y + R * 0.82); g.lineTo(x - R * 1.08, y + R * 0.82); g.closePath();
  g.fillStyle = '#8E2B22'; g.fill(); g.lineJoin = 'round'; g.lineWidth = Math.max(2, R * 0.16); g.strokeStyle = '#120D0B'; g.stroke();
  g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#F0EDE1'; g.font = `900 ${Math.round(Math.max(14, R * 1.05))}px "Arm Text", system-ui, sans-serif`; g.fillText(String(n), x, y + R * 0.24);
  g.restore(); }
// Symbol auf dunkler Scheibe mit Rostrand (Karte)
function drawSym(g, im, cx, cy, R, ring) {
  if (VIEW.up) VIEW.up(cx, cy);
  g.beginPath(); g.arc(cx, cy, R, 0, 7); g.fillStyle = ring ? 'rgba(36,48,18,0.88)' : 'rgba(18,13,11,0.82)'; g.fill(); g.lineWidth = Math.max(1.5, R * (ring ? 0.2 : 0.14)); g.strokeStyle = ring || '#66483A'; g.stroke();   // ring: farbiger Rand (vergiftet = grünlich)
  if (!im) return;
  const ww = Math.min(R * 1.45 * im.naturalWidth / im.naturalHeight, R * 1.6), h2 = ww * im.naturalHeight / im.naturalWidth;
  g.drawImage(im, cx - ww / 2, cy - h2 / 2, ww, h2);
}
// Laufmündung der MG je Bild (Anteile der Bildbreite/-höhe, Blick nach rechts), gemessen an der Laufspitze (Spieltest 2026-11-17)
const MUZ = { mg_A: [0.99, 0.401], mg_D: [0.99, 0.306], mg_F: [0.99, 0.316], konkordat_mg: [0.995, 0.267], aschenwacht_mg: [0.995, 0.472] };
function drawUnit(u, d) {
  d.muz = null; d.fbx = [];   // Mündung (falls gemessen) und Kästen der gezeichneten Figuren, relativ zur Einheit
  const T = TYPES[u.type], k = figU(u), s = L.s, flip = facesLeft(d.face) ? 1 : 0, acc = FIG.PAL[u.side].accent;
  let x = d.x, y = d.y;
  if (d.lunge) { x += d.lunge.dx; y += d.lunge.dy; }
  if (d.shake > 0) x += Math.sin(now / 22) * s * 0.05;
  const g = ctx, A0 = d.alpha * (d.vs.rout ? 0.75 : 1) * (areaNow && areaNow.ok && !areaNow.ok(u) ? 0.4 : 1);   // Wirkungsbereich: nicht Betroffene abgedunkelt
  const isSel = sel && sel.id === u.id;
  const own = human(u.side) && G.side === u.side && E.active(u);
  const done = own && !busy && !shells.length && !tracers.length && !muzzles.length && spent.has(u.id);
  const ready = own && !busy && !G.over && !spent.has(u.id) && !placing;   // kann in dieser Runde noch handeln
  // Standplatz: dunkler Bodenschatten und dünner Ring in gedämpfter Fraktionsfarbe (keine knalligen Flächen)
  const RS = VIEW.tilt() ? 0.72 : 1, RA = VIEW.tilt() ? 0.55 : 1;   // neue Ansicht: Ringe kleiner und dezenter, Figuren stehen auf dem Boden statt auf einer Scheibe
  g.globalAlpha = A0 * RA; g.beginPath(); gEllipse(g, x, y, s * 0.66 * RS, s * 0.66 * RS); g.fillStyle = 'rgba(18,13,11,0.45)'; g.fill();
  g.globalAlpha = A0 * RA * (done ? 0.25 : d.vs.rout ? 0.3 : 0.45); if (!isSel) drawRing(g, acc, x, y, s * 0.66 * RS);   // Pinselstrich-Ring, gedämpft
  if (ready && OPT.ready && !isSel) { g.globalAlpha = A0 * RA * (0.6 + 0.35 * (0.5 + 0.5 * Math.sin(now / 520 + u.id))); drawRing(g, '#C2A461', x, y, s * 0.74 * RS); }   // bereit: dezenter pulsierender Messingring
  if (E.active(u)) {   // Blickrichtung: kleiner Punkt am Ring, so gedämpft wie der Ring
    const a = d.face * Math.PI / 3, fx = x + Math.cos(a) * s * 0.66 * RS, fy = y + Math.sin(a) * s * 0.66 * RS * kAt(x, y);
    if (isSel) g.globalAlpha = A0;
    g.beginPath(); g.arc(fx, fy, Math.max(2, s * 0.055), 0, 7); g.fillStyle = isSel ? '#C2A461' : acc; g.fill(); g.lineWidth = Math.max(1, s * 0.03); g.strokeStyle = '#120D0B'; g.stroke();
  }
  g.globalAlpha = A0;
  if (activeU === u.id && !isSel) { const pz = 0.5 + 0.5 * Math.sin(now / 160); g.globalAlpha = A0 * (0.7 + 0.3 * pz); drawRing(g, '#C2A461', x, y, s * (0.72 + 0.03 * pz) * RS, true); g.globalAlpha = A0; }   // KI: diese Einheit ist dran
  if (isSel) {   // gewählt: Messingring, leicht pulsierend
    const pz = 0.5 + 0.5 * Math.sin(now / 300);
    g.globalAlpha = A0 * (0.85 + 0.15 * pz); drawRing(g, '#C2A461', x, y, s * (0.7 + 0.02 * pz) * RS, true); g.globalAlpha = A0;
  } else if (hoverU === u) { g.beginPath(); gEllipse(g, x, y, s * 0.76 * RS, s * 0.76 * RS); g.strokeStyle = 'rgba(240,237,225,0.5)'; g.lineWidth = Math.max(1.5, s * 0.03); g.stroke(); }
  if (previewT && previewT.id === u.id) {   // Angriffsziel in der Vorschau
    g.beginPath(); gEllipse(g, x, y, s * 0.78, s * 0.78); g.strokeStyle = '#8E2B22'; g.lineWidth = Math.max(2.5, s * 0.06);
    g.globalAlpha = A0 * (0.6 + 0.4 * Math.sin(now / 160)); g.stroke(); g.globalAlpha = A0;
  }
  // Figuren. Neue Ansicht: Trupps aus Einzelfiguren bzw. Einzelmodelle aus den neuen Bögen (FIGMAP); ohne neues Bild wie bisher
  let topY = y - s;
  const nf = VIEW.tilt() ? newFigs(u, d) : null;
  if (nf) topY = drawNewFigs(g, u, d, nf, x, y, flip, A0, done);
  else {
  const slots = SLOTS[k];
  const n = slots.length === 1 ? 1 : Math.max(1, Math.min(slots.length, Math.ceil(d.str / (10 / slots.length) - 0.001)));
  const oyMin = Math.min(...slots.slice(0, 2).map(q => q[1]));
  const big = T.cls === 'walker';
  let sp = figSprite(k, u.side, flip, oyMin, big);
  if (!sp.rule) { sp = FIG.sprite(k, u.side, flip, s * FH[k]); const mw = s * (MAXWK[k] || MAXW); if (sp.cv.width > mw) sp = FIG.sprite(k, u.side, flip, s * FH[k] * mw / sp.cv.width); }
  // Gemalte Bilder sind größer: höchstens zwei Figuren je Einheit, damit es übersichtlich bleibt
  const use = slots.slice(0, sp.painted ? Math.min(n, 2) : n).slice().sort((a, b) => a[1] - b[1]);
  const hx = G.map[u.c] && G.map[u.c][u.r], dim = hx && DIM_T.has(hx.t) && !d.lunge;
  const filt = [done ? 'grayscale(0.75) brightness(0.8)' : '', dim ? 'brightness(0.8)' : ''].filter(Boolean).join(' ');
  const duck = d.vs.supp > 0 ? s * 0.1 : 0;
  for (const [ox, oy] of use) {
    const fx = x + (flip ? -ox : ox) * s, fy = y + oy * s * kAt(x, y) + duck;
    // Bodenschatten: weich und dunkel, Breite nach Figur; darunter kräftiger Kontaktschatten an den Füßen
    g.filter = 'none'; g.globalAlpha = A0;
    const sw = Math.max(s * 0.3, Math.min(s * 1.0, (sp.cw || s * 0.6) * 0.5)), sh = sw * 0.32;
    g.save(); g.translate(fx, fy); g.scale(1, sh / sw);
    const sg = g.createRadialGradient(0, 0, 0, 0, 0, sw); sg.addColorStop(0, 'rgba(8,6,4,0.62)'); sg.addColorStop(0.55, 'rgba(8,6,4,0.38)'); sg.addColorStop(1, 'rgba(8,6,4,0)');
    g.fillStyle = sg; g.beginPath(); g.arc(0, 0, sw, 0, 7); g.fill(); g.restore();
    g.fillStyle = 'rgba(6,4,3,0.7)'; g.beginPath(); g.ellipse(fx, fy - s * 0.01, sw * 0.42, sw * 0.42 * 0.28, 0, 0, 7); g.fill();
    if (done) g.globalAlpha = A0 * 0.85;
    if (filt) g.filter = filt;
    const lead = ox === slots[0][0] && oy === slots[0][1] ? leaderKind(u) : null;
    if (lead) { const ls = figSprite(lead, u.side, flip, oy); g.drawImage(ls.cv, Math.round(fx - ls.ox), Math.round(fy - ls.oy)); topY = Math.min(topY, fy - ls.oy); continue; }
    if (u.officer && ox === slots[0][0] && oy === slots[0][1]) {
      const px = fx + (flip ? 0.2 : -0.2) * s, top = fy - s * 1.35;
      g.strokeStyle = O; g.lineWidth = Math.max(2, s * 0.07); g.beginPath(); g.moveTo(px, fy - s * 0.2); g.lineTo(px, top); g.stroke();
      g.beginPath(); g.moveTo(px, top); g.lineTo(px + (flip ? 1 : -1) * s * 0.42, top + s * 0.13); g.lineTo(px, top + s * 0.28); g.closePath();
      g.fillStyle = acc; g.fill(); g.lineWidth = Math.max(1.5, s * 0.045); g.stroke();
    }
    g.drawImage(sp.cv, Math.round(fx - sp.ox), Math.round(fy - sp.oy)); topY = Math.min(topY, fy - sp.oy);
    if (sp.rule) d.fbx.push([fx - sp.cw / 2 - d.x, fy - sp.top - d.y, sp.cw, sp.top, flip]);
    if (sp.at && MUZ[sp.art] && !d.muz) { const [mx, my] = sp.at(...MUZ[sp.art]); d.muz = [fx - sp.ox + mx - d.x, fy - sp.oy + my - d.y, flip]; }   // relativ zur Einheit
  }
  }
  g.filter = 'none'; g.globalAlpha = 1;
  // Nachzügler (höchstens 3 eigene Einheiten können noch handeln): Messingwinkel über der Figur, leicht wippend
  if (ready && OPT.strag && readyN <= 3 && !isSel) { const ty = Math.max(topY - s * 0.22, L.top + s * 0.2) + Math.sin(now / 300) * s * 0.04; MARKQ.push(() => chevron(x, ty, s * 0.17)); }
  if (!E.alive(u)) return;
  if (isSel || hoverU === u || marksAll()) MARKQ.push(() => drawMarks(u, d, x, y, own, done, acc));   // gewählt, überfahren oder „Alle Marken“: obenauf
  else drawMarks(u, d, x, y, own, done, acc);   // Marken gleich nach der eigenen Figur (Tiefenreihenfolge): Figuren davor dürfen sie verdecken, sie malen nie über fremde
}
function drawPlanted(g, s, u, x, y) {
  const k = kAt(x, y), px = x + s * 0.62, base = y + s * 0.12 * k, H = s * 1.15, top = base - H, fw = s * 0.5, fh = s * 0.34, t = now / 650;
  const cols = u.side === 'D' ? ['#2a2826', '#8a877e', '#d8cfb6'] : ['#8E2B22', '#5e1c16', '#8E2B22'];   // Aschenwacht Schwarz/Aschgrau/Knochenweiß, Konkordat Ochsenblut
  g.save(); g.fillStyle = 'rgba(6,4,3,0.45)'; g.beginPath(); g.ellipse(px, base, s * 0.1, s * 0.035, 0, 0, 7); g.fill();
  g.strokeStyle = O; g.lineWidth = Math.max(2, s * 0.07); g.beginPath(); g.moveTo(px, base); g.lineTo(px, top); g.stroke();
  g.strokeStyle = '#6a5236'; g.lineWidth = Math.max(1, s * 0.045); g.beginPath(); g.moveTo(px, base); g.lineTo(px, top); g.stroke();
  for (let i = 0; i < 3; i++) { g.beginPath(); for (let q = 0; q <= 8; q++) { const xx = px + fw * q / 8, w = Math.sin(q * 0.8 - t) * s * 0.03 * q / 8; g[q ? 'lineTo' : 'moveTo'](xx, top + s * 0.04 + fh * i / 3 + w); }
    for (let q = 8; q >= 0; q--) { const xx = px + fw * q / 8, w = Math.sin(q * 0.8 - t) * s * 0.03 * q / 8; g.lineTo(xx, top + s * 0.04 + fh * (i + 1) / 3 + w); } g.closePath(); g.fillStyle = cols[i]; g.fill(); }
  g.strokeStyle = 'rgba(18,13,11,0.8)'; g.lineWidth = Math.max(1, s * 0.02); g.strokeRect(px, top + s * 0.04, fw, fh);
  g.fillStyle = '#C2A461'; g.beginPath(); g.moveTo(px, top - s * 0.1); g.lineTo(px - s * 0.035, top); g.lineTo(px + s * 0.035, top); g.closePath(); g.fill(); g.restore();
}
function drawMarks(u, d, x, y, own, done, acc) {
  const g = ctx, s = L.s;
  if (d.vs && d.vs.planted && E.active(u)) drawPlanted(g, s, u, x, y);
  if (d.vs && d.vs.dug && E.active(u)) { const k = kAt(x, y), fy = y + s * 0.42 * k;   // eingegraben: kleiner Erdwall vor der Einheit
    g.save(); g.fillStyle = '#4a3a28'; g.strokeStyle = O; g.lineWidth = Math.max(1.5, s * 0.03); g.beginPath(); g.moveTo(x - s * 0.55, fy); g.quadraticCurveTo(x, fy - s * 0.22, x + s * 0.55, fy); g.quadraticCurveTo(x, fy + s * 0.06, x - s * 0.55, fy); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = 'rgba(120,96,64,0.8)'; for (let i = -2; i <= 2; i++) { g.beginPath(); g.ellipse(x + i * s * 0.18, fy - s * 0.07 + Math.abs(i) * s * 0.03, s * 0.07, s * 0.035, 0, 0, 7); g.fill(); } g.restore(); }
  // Markenzeile unter der Figur: [Zustand] [Lebensbalken, darunter Aktionspunkte] [Deckung]
  const bw = s * 0.5, bh = Math.max(3.5, s * 0.065), bx = x - bw / 2, by = y + s * kAt(x, y) * 0.3, q = Math.max(0, Math.min(1, d.str / 10)), mid = by + bh / 2;
  g.globalAlpha = done ? 0.7 : 1;
  // Pinsel-Lebensbalken wie die Kampfkraft-Balken oben: dunkle Pinselform als Grund, Füllung nach Stand (LIFE_COL), Tintenrand, Segmentstriche
  drawBrushBar(g, '#221B18', bx, by, bw, bh);
  { const qn = Math.min(1, hpNach(d, d.str) / 10); if (qn > q + 0.005) drawBrushBar(g, HP_NACH, bx, by, bw * qn, bh); }   // Nachlauf: dunkler Abschnitt
  if (q > 0.01) drawBrushBar(g, LIFE_COL[lifeTier(q)], bx, by, bw * q, bh);   // Farbe nach Stand, Fraktion zeigt der Ring
  g.fillStyle = 'rgba(18,13,11,0.7)'; for (let i = 1; i < 10 * q - 0.2; i++) g.fillRect(Math.round(bx + bw * i / 10), by + bh * 0.15, 1, bh * 0.7);
  MARKS.push({ x0: bx - 3, y0: by - 4, x1: bx + bw + 3, y1: by + bh + 4, u, kind: 'hp' });
  if (own) {   // Fahrplan 2: Bewegungspunkte als kleine Punkte (hell = übrig), daneben die Aktionsmünze (+ kleine Münze der Zweitwaffe)
    const aus = d.vs.broken || d.vs.supp, ap = aus ? 0 : (u.ap || 0), bp = aus ? 0 : (u.bp || 0), bm = Math.max(E.bpMax(u), bp), r = Math.max(2.8, s * 0.046), rb = Math.max(1.8, s * 0.026), py = by + bh + r + 1.5;
    const zw = TYPES[u.type].zweit, wB = bm * rb * 2.3, w = wB + r * 2.6 + (zw ? r * 2 : 0); let cx = x - w / 2 + rb;
    for (let i = 0; i < bm; i++) { g.beginPath(); g.arc(cx, py, rb, 0, 7); g.fillStyle = i < bp ? '#E8DDB8' : '#2A221C'; g.fill(); g.lineWidth = Math.max(1, rb * 0.45); g.strokeStyle = '#120D0B'; g.stroke(); cx += rb * 2.3; }
    const coin = (rr, voll) => { const im = UPI[voll ? 'muenze' : 'muenzeLeer']; cx += rr; if (im) g.drawImage(im, cx - rr, py - rr, rr * 2, rr * 2); else { g.beginPath(); g.arc(cx, py, rr, 0, 7); g.fillStyle = voll ? '#C2A461' : '#221B18'; g.fill(); g.lineWidth = Math.max(1, rr * 0.3); g.strokeStyle = '#120D0B'; g.stroke(); } cx += rr + r * 0.3; };
    cx += r * 0.4 - rb; coin(r, ap >= 1); if (zw) coin(r * 0.7, !u.zw && !aus);
    MARKS.push({ x0: x - w / 2 - 2, y0: py - r - 1, x1: x + w / 2 + 2, y1: py + r + 2, u, kind: 'ap' });
  }
  // Deckungsschild rechts (nur wenn die Einheit auf ihrem Feld steht, nicht während einer Bewegung)
  if (E.active(u)) { const [tx, ty] = center(u.c, u.r); if (Math.abs(tx - d.x) + Math.abs(ty - d.y) < 2) { const cv0 = E.coverOf(G, u);
    if (cv0.tier) { const sh = Math.max(9, s * 0.15), cx = bx + bw + sh * 0.55; drawShield(g, cx, mid, sh, cv0.tier); MARKS.push({ x0: cx - sh * 0.45, y0: mid - sh / 2, x1: cx + sh * 0.45, y1: mid + sh / 2, u, kind: 'cover' }); } } }
  // Anführer-Orden rechts neben der Figur, im eigenen Feld; abgedunkelt, solange kein Befehl möglich ist
  if (u.officer && E.active(u)) { const oi = ordenBild(fac(u.side)), oh = s * 0.24, ox = x + s * 0.5, oy = y - s * kAt(x, y) * 0.3, ready = orderReady(u);   // klein, Band in Fraktionsfarbe (2026-11-16)
    if (oi) { const ow = oh * oi.width / oi.height; if (!ready) g.filter = 'grayscale(0.7) brightness(0.45)'; g.drawImage(oi, ox - ow / 2, oy - oh / 2, ow, oh); g.filter = 'none'; }
    else { g.font = `900 ${Math.round(s * 0.3)}px sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineWidth = Math.max(2, s * 0.06); g.strokeStyle = '#120D0B'; g.strokeText('★', ox, oy); g.fillStyle = ready ? '#C2A461' : '#7d7564'; g.fillText('★', ox, oy); }
    MARKS.push({ x0: ox - oh * 0.3, y0: oy - oh / 2, x1: ox + oh * 0.3, y1: oy + oh / 2, u, kind: 'lead' }); }
  // Ein Zustandsplatz links: wichtigster Zustand, „+n“ bei mehreren
  const sts = statesOf(u, d).filter(st => !st.panel && st.k !== 'supp');   // Karte: nur echte Zustände; Niedergehalten eigener großer Platz
  let slotX = bx;
  if (d.vs.supp > 0) {   // Niedergehalten: wichtigster Zustand, groß direkt links an der Einheit (Spieltest Runde 2, Punkt 22)
    const R2 = Math.max(12, s * 0.23), cx = bx - R2 - 3, cy = mid - R2 * 0.55, pz = 0.5 + 0.5 * Math.sin(now / 260);
    g.save(); g.globalAlpha = 1; g.beginPath(); g.arc(cx, cy, R2 * (1.12 + 0.08 * pz), 0, 7); g.fillStyle = `rgba(200,60,40,${0.25 + 0.2 * pz})`; g.fill(); g.restore();
    drawSym(g, UPI['s_niedergehalten'], cx, cy, R2, '#C8402C');
    MARKS.push({ x0: cx - R2 * 1.1, y0: cy - R2 * 1.1, x1: cx + R2 * 1.1, y1: cy + R2 * 1.1, u, kind: 'supp' });
    slotX = cx - R2;
  }
  if (sts.length) {
    const R = Math.max(7, s * 0.13), cx = slotX - R - 2, bl = sts[0].blockiert && sts[0].blockiert(u, d);
    if (bl) g.filter = 'grayscale(1) brightness(0.7)';
    drawSym(g, UPI['s_' + sts[0].sym], cx, mid, R, bl ? '#6d6458' : sts[0].ring); g.filter = 'none';
    if (bl) { g.save(); g.lineCap = 'round'; g.strokeStyle = '#120D0B'; g.lineWidth = Math.max(3, R * 0.36); g.beginPath(); g.moveTo(cx - R * 0.72, mid + R * 0.72); g.lineTo(cx + R * 0.72, mid - R * 0.72); g.stroke(); g.strokeStyle = '#C8402C'; g.lineWidth = Math.max(1.6, R * 0.2); g.stroke(); g.restore(); }   // durchgestrichen
    if (sts.length > 1) { const t = '+' + (sts.length - 1), tx = cx + R * 0.85, ty = mid - R * 0.95; g.font = `700 ${Math.round(Math.max(13, s * 0.2))}px "Arm Text", system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.lineWidth = Math.max(3, s * 0.07); g.lineJoin = 'round'; g.strokeStyle = '#120D0B'; g.strokeText(t, tx, ty); g.fillStyle = '#F0EDE1'; g.fillText(t, tx, ty); }
    MARKS.push({ x0: cx - R * 1.1, y0: mid - R * 1.6, x1: cx + R * 1.6, y1: mid + R * 1.1, u, kind: 'state' });
  }
  g.globalAlpha = 1;
}

// ---------- Zeichnen ----------
// STEP = vergangene Zeit in 60-Hz-Bildern (gleich schnell bei 30, 60 oder 144 Hz); FS = dazu das Spieltempo, passend zu wait()
let lastT = 0, STEP = 1, FS = 1;
// Hilfsmarkierung auf einem Feld: Fläche und Rand in einem Palettenton, wahlweise gestrichelt oder schraffiert, Symbol oben im Feld
const BONE = '240,237,225', BRASS = '194,164,97', PARCH = '187,165,131', LIFE = '142,43,34';
// Schadens-Nachlauf (Spieltest Runde 2, Punkt 16): verlorene Stärke bleibt ca. 1 s als dunkler Abschnitt im Balken stehen, dann baut er in 0,5 s ab (wie Total War)
const hpNachV = (h, t) => { const a = (t - h.t0) / 1000; return a < 1 ? h.from : a > 1.5 ? h.to : h.from + (h.to - h.from) * (a - 1) / 0.5; };
function hpNach(o, cur) {   // o: beliebiges Objekt (Anzeige-Einheit, Panel-Speicher); gibt den nachlaufenden Wert zurück
  const t = performance.now(); let h = o._hn; if (!h) h = o._hn = { from: cur, to: cur, t0: t - 2000 };
  const v = hpNachV(h, t);
  if (cur < h.to - 1e-6) { h.from = v; h.to = cur; h.t0 = t; } else if (cur > h.to + 1e-6) { h.from = h.to = cur; h.t0 = t - 2000; }   // Verlust: stehen lassen; Heilung: sofort
  return hpNachV(h, t);
}
const HP_NACH = '#5a1810', hudHN = {};
function hexMark(c, r, o) {
  const g = ctx, s = L.s, pz = 0.5 + 0.5 * Math.sin(now / 320);
  hexPath(g, c, r, 0.9); g.fillStyle = `rgba(${o.rgb},${(o.fill ?? 0.14) + 0.05 * pz})`; g.fill();
  if (o.hatch) { g.save(); hexPath(g, c, r, 0.9); g.clip(); const [cx, cy] = center(c, r); g.strokeStyle = `rgba(${o.rgb},0.28)`; g.lineWidth = Math.max(1, s * 0.03); g.beginPath();
    for (let i = -6; i <= 6; i++) { const d = i * s * 0.2; g.moveTo(cx + d - s, cy + s); g.lineTo(cx + d + s, cy - s); } g.stroke(); g.restore(); }
  hexPath(g, c, r, 0.9); g.strokeStyle = `rgba(${o.rgb},${o.soft ? 0.45 : 0.85})`; g.lineWidth = Math.max(o.soft ? 1.2 : 2, s * (o.soft ? 0.025 : 0.05));
  if (o.dash) g.setLineDash([s * 0.14, s * 0.1]);
  g.stroke(); g.setLineDash([]);
  if (o.sym) { const [cx, cy] = center(c, r); MARKQ.push(() => { g.globalAlpha = 0.85 + 0.15 * pz; drawSym(g, o.sym, cx, cy - s * kAt(cx, cy) * (o.inHex ? 0.1 : 0.62), s * 0.2); g.globalAlpha = 1; }); }   // Symbol über den Figuren
}
function frame(t) { STEP = lastT ? Math.min(4, Math.max(0.1, (t - lastT) / 16.667)) : 1; lastT = t; FS = STEP * speed; now = t; shakeStep(); areaNow = null; draw(); requestAnimationFrame(frame); }
function draw() {
  if (!L || !tcv) return;
  MARKS.length = 0;
  if (VIEW.tilt()) return drawTilt();
  const g = ctx, s = L.s;
  drawGround(g, s);
  drawUnits();
  for (const f of MARKQ) f(); MARKQ.length = 0;
  drawDiaryMark(g);
  drawAir(g, s);
  drawFloaters(g, s);
}
// Boden: Gelände, Flecken, Hilfsmarkierungen, Zielfahnen
function drawGround(g, s) {
  g.drawImage(tcv, 0, 0);
  drawGmarks(g);
  for (let i = decals.length - 1; i >= 0; i--) { const dc = decals[i]; if (dc.turn == null) dc.turn = G.turn; if (G.turn - dc.turn >= (dc.wire ? 4 : 3)) decals.splice(i, 1); }   // Blut bleibt kurz liegen (Draht 4, sonst 3 Runden)
  for (const dc of decals) {
    if (dc.bim === undefined) { dc.bim = fxIm('blut', 3 + Math.floor(Math.random() * 3)) || null; dc.born = dc.born || now; }   // neue Bodenflecken (Blutbogen 4–6)
    if (dc.bim) { const age = G.turn - dc.turn, lim = dc.wire ? 4 : 3, w = dc.wire ? dc.r * 2.4 : dc.r * 3.2, hh = w * dc.bim.naturalHeight / dc.bim.naturalWidth * Math.max(0.55, kAt(dc.x, dc.y));
      g.globalAlpha = 0.85 * Math.min(1, (now - dc.born) / 300 + 0.3) * (age >= lim - 1 ? 0.5 : 1); g.drawImage(dc.bim, dc.x - w / 2, dc.y - hh / 2, w, hh); g.globalAlpha = 1; continue; }
    if (dc.wire) {   // erst ein kleiner Spritzer, nach 1,5 s nur noch ein dunkler Fleck; blasst über die Runden aus
      const a = Math.min(1, (now - dc.born) / 1500), age = G.turn - dc.turn, rr = dc.r * (1.6 - 0.6 * a), al = (0.75 - 0.25 * a) * Math.max(0, 1 - age / 4);
      g.fillStyle = `rgba(${Math.round(70 - 25 * a)},${Math.round(22 - 8 * a)},${Math.round(14 - 6 * a)},${al.toFixed(3)})`; g.beginPath(); gEllipse(g, dc.x, dc.y, rr, rr); g.fill();
      continue;
    }
    const im = FXI['blood' + dc.v];
    if (im) { const w = dc.r * 5, hh = w * im.naturalHeight / im.naturalWidth * Math.max(0.6, kAt(dc.x, dc.y)); g.globalAlpha = 0.85; g.drawImage(im, dc.x - w / 2, dc.y - hh / 2, w, hh); g.globalAlpha = 1; }
    else { g.fillStyle = dc.col; g.beginPath(); gEllipse(g, dc.x, dc.y, dc.r, dc.r); g.fill(); }
  }
  // Brennende Felder: Glut am Boden (Flammen zeichnet drawAir aufrecht)
  for (const f of VIS.fires || []) { const [x, y] = center(f.c, f.r), k = kAt(x, y), fl = 0.85 + 0.15 * Math.sin(now / 160 + f.c * 3);
    const gr = g.createRadialGradient(x, y, 0, x, y, s * 0.8); gr.addColorStop(0, `rgba(255,120,30,${0.42 * fl})`); gr.addColorStop(0.5, `rgba(160,50,10,${0.28 * fl})`); gr.addColorStop(1, 'rgba(40,10,0,0)');
    g.save(); g.translate(x, y); g.scale(1, k); g.translate(-x, -y); g.fillStyle = gr; g.beginPath(); g.arc(x, y, s * 0.8, 0, 7); g.fill(); g.restore();
    g.fillStyle = 'rgba(20,12,8,0.35)'; for (let i = 0; i < 6; i++) { const a = i * 1.1 + f.r; g.beginPath(); gEllipse(g, x + Math.cos(a) * s * 0.4, y + Math.sin(a) * s * 0.3 * k, s * 0.12, s * 0.07); g.fill(); } }
  // Schilde vor: Nachbarfelder stahlgrau umrandet, solange sie stehen (und als Vorschau, wenn ein Schildträger gewählt ist)
  for (const u of G.units) { const dd = DU.get(u.id); const show = (dd && dd.vs && dd.vs.shields && E.active(u)) || (sel === u && TYPES[u.type].shieldWall && E.canShields(G, u)); if (!show) continue;
    for (const [c, r] of E.neighbors(u.c, u.r)) { if (c < 0 || r < 0 || c >= COLS || r >= ROWS) continue; hexPath(g, c, r, 0.9); g.fillStyle = dd && dd.vs.shields ? 'rgba(170,180,190,0.16)' : 'rgba(170,180,190,0.08)'; g.fill(); g.lineWidth = Math.max(1.5, s * 0.03); g.strokeStyle = 'rgba(190,200,210,0.6)'; g.stroke(); } }
  // Bannerträger gewählt: Wirkbereich (2 Felder, aufgepflanzt 3) als goldene Fläche
  if (sel && TYPES[sel.type].banner && E.active(sel)) { const R = sel.planted ? P.BANNER_R_PLANTED : P.BANNER_R;
    for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) if (E.dist(sel.c, sel.r, c, r) <= R) { hexPath(g, c, r, 0.94); g.fillStyle = sel.planted ? 'rgba(226,176,74,0.26)' : 'rgba(226,176,74,0.16)'; g.fill(); g.lineWidth = Math.max(1.5, s * 0.03); g.strokeStyle = 'rgba(226,176,74,0.55)'; g.stroke(); } }
  // „Base“ unter Einheiten wie bei einer Tabletop-Miniatur (Test, Option): Feld leicht abgedunkelt, Boden schimmert durch, feiner Rand in Fraktionsfarbe
  if (VIEW.tilt() && OPT.base > 0) {
    const st = [null, [0.16, 0.4, 0.022], [0.28, 0.6, 0.03], [0.42, 0.85, 0.04]][OPT.base];
    for (const u of G.units) { const d = DU.get(u.id); if (!d || d.alpha <= 0 || !E.alive(u)) continue;
      const c = FIG.PAL[u.side] ? FIG.PAL[u.side].accent : '#8a8070', rgb = [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16)), m = rgb.map(v => Math.round(v * 0.75 + 40));
      g.beginPath(); for (let i = 0; i < 6; i++) { const q = hexCorner(d.x, d.y, i, 0.93); i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]); } g.closePath();
      g.globalAlpha = d.alpha; g.fillStyle = `rgba(14,10,7,${st[0]})`; g.fill();
      g.lineWidth = s * st[2]; g.strokeStyle = `rgba(${m},${st[1]})`; g.stroke(); g.globalAlpha = 1; }
  }
  // Markierungen
  if (sel && human(G.side) && !busy) {
    // Bewegungsfelder dezent (Wunsch des Nutzers): halbdurchsichtige Fläche, Gelände bleibt sichtbar. Ziehen = Knochenweiß, Marsch/Rückzug = Messing.
    // Paket 2: Marschfelder (nur mit Marsch erreichbar, danach keine Aktion) deutlich in leichtem Gelb/Messing mit gestrichelter Kante
    if (!abilArea(areaAct)) for (const [, n] of reach) { hexPath(g, n.c, n.r, 0.9); const far = n.march || n.retreat; g.fillStyle = far ? 'rgba(226,190,90,0.24)' : 'rgba(240,237,225,0.13)'; g.fill();
      if (far) { g.strokeStyle = 'rgba(18,13,11,0.55)'; g.lineWidth = Math.max(2, s * 0.05); g.stroke(); g.setLineDash([s * 0.11, s * 0.08]); g.strokeStyle = 'rgba(236,200,100,0.9)'; g.lineWidth = Math.max(1.5, s * 0.03); g.stroke(); g.setLineDash([]); }
      else { g.strokeStyle = 'rgba(240,237,225,0.4)'; g.lineWidth = Math.max(1, s * 0.025); g.stroke(); }
      if (G.map[n.c][n.r].t === 'wire') { hexPath(g, n.c, n.r, 0.8); g.strokeStyle = 'rgba(142,43,34,0.75)'; g.setLineDash([s * 0.08, s * 0.08]); g.lineWidth = Math.max(1.5, s * 0.035); g.stroke(); g.setLineDash([]); } }
    if (!abilMode) for (const [c, r] of E.cutTargets(G, sel)) { const pu = 0.5 + 0.5 * Math.sin(now / 220); hexPath(g, c, r, 0.96); g.strokeStyle = `rgba(255,224,120,${0.45 + pu * 0.45})`; g.lineWidth = Math.max(3, s * 0.08); g.stroke(); }   // Draht in Reichweite der Schere (Paket 8)
    areaNow = null; drawArea(g, s);   // Wirkungsbereich des überfahrenen Knopfs (Paket 2)
    // Sicht: verdeckte Felder abgedunkelt und fein schraffiert (Tinte), Gelände bleibt erkennbar
    for (const k of hideSet) { const c = Math.floor(k / 100), r = k % 100; hexPath(g, c, r, 0.98); g.fillStyle = 'rgba(18,13,11,0.4)'; g.fill();
      g.save(); hexPath(g, c, r, 0.98); g.clip(); const [cx, cy] = center(c, r); g.strokeStyle = 'rgba(18,13,11,0.5)'; g.lineWidth = Math.max(1, s * 0.016); g.beginPath();
      for (let i = -7; i <= 7; i++) { const d = i * s * 0.15; g.moveTo(cx + d - s, cy + s); g.lineTo(cx + d + s, cy - s); } g.stroke(); g.restore(); }
    // Schuss: eine gestrichelte Kontur um das ganze Reichweitengebiet (Ochsenblut hell auf Tintenschatten), keine Flächen
    if (rangeEdges.length && !abilArea(areaAct)) { g.save(); g.lineCap = 'round';
      const edges = () => { g.beginPath(); for (const [c, r, i] of rangeEdges) { const [x, y] = center(c, r), p = hexCorner(x, y, i, 0.97), q = hexCorner(x, y, i + 1, 0.97);
        g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); } g.stroke(); };
      g.strokeStyle = 'rgba(18,13,11,0.7)'; g.lineWidth = Math.max(3, s * 0.065); edges();
      g.strokeStyle = RANGE_COL; g.lineWidth = Math.max(1.6, s * 0.028); g.setLineDash([s * 0.12, s * 0.08]); edges(); g.restore(); }
    // Hilfsmarkierungen nach STYLE.md: gedämpfte Palettentöne, unterscheidbar über Muster und Symbol (Wunsch des Nutzers)
    { const sym = sel && (feldArt === 'cut' ? UPI.s_drahtschere : feldArt === 'zweit' ? UPI.s_garbe : TYPES[sel.type].abil && UPI['s_' + (ABIL_SYM[TYPES[sel.type].abil] || 'blitz')]);
      const hk = hoverHex && E.key(hoverHex[0], hoverHex[1]);
      for (const k of abilSet) hexMark(Math.floor(k / 100), k % 100, { rgb: BRASS, fill: k === hk ? 0.3 : 0.2, sym: abilSet.size <= 24 || k === hk ? sym : null, inHex: true }); }   // gültige Felder: Fläche und Symbol in jedem Feld, das Symbol liegt über Gräben und Figuren (Spieltest Runde 2, Punkt 21)
    for (const k of shellHexes) {
      const c = Math.floor(k / 100), r = k % 100;
      hexPath(g, c, r, 0.92); g.fillStyle = `rgba(235,40,30,${0.36 + 0.1 * Math.sin(now / 260)})`; g.fill(); g.strokeStyle = '#ff5a40'; g.lineWidth = Math.max(2, s * 0.06); g.stroke();
    }
    if (sightSet.size) for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) if (sightSet.has(E.key(c, r))) {
      hexPath(g, c, r, 0.9); g.fillStyle = E.dist(sel.c, sel.r, c, r) > P.SPOT ? 'rgba(240,237,225,0.30)' : 'rgba(240,237,225,0.13)'; g.fill(); g.strokeStyle = 'rgba(240,237,225,0.55)'; g.lineWidth = Math.max(1, s * 0.03); g.stroke(); }
    if (scoutSet.size) { g.font = `900 ${Math.round(s * 0.34)}px "Arm Text", system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
      for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) if (scoutSet.has(E.key(c, r))) { const [hx, hy] = center(c, r); g.lineWidth = Math.max(2, s * 0.08); g.strokeStyle = O; g.strokeText('◉', hx, hy); g.fillStyle = '#F0EDE1'; g.fillText('◉', hx, hy); } }
    for (const id of sendSet) { const hu = unitById(id); hexMark(hu.c, hu.r, { rgb: BONE, dash: true, sym: UPI.s_meldehund }); }
    for (const id of recSet) { const hu = unitById(id); hexMark(hu.c, hu.r, { rgb: BRASS, sym: UPI.s_schraubenschluessel }); }
    for (const id of healSet) { const hu = unitById(id); hexMark(hu.c, hu.r, { rgb: BONE, sym: UPI.s_sanitaeter }); }
    for (const [, t] of targets) { const u = unitById(t.id), fire = t.kind === 'fire'; hexMark(u.c, u.r, { rgb: fire ? BRASS : LIFE, fill: 0.2, sym: UPI[fire ? 's_zielen' : 's_nahkampf'] }); }
    // Ziele in Schussreichweite: Messing-Eckklammern um die Figur (obenauf)
    for (const [, t] of targets) if (t.kind === 'fire' || t.both) { const u = unitById(t.id), [x, y] = center(u.c, u.r); MARKQ.push(() => brackets(x, y - s * 0.38, s * 0.6, '#C2A461')); }
    // Vorschau vom erreichbaren Feld unter Maus/Finger
    { const hk = hoverHex && E.key(hoverHex[0], hoverHex[1]), pv = hk != null && !abilMode && reach.has(hk) && !(hoverHex[0] === sel.c && hoverHex[1] === sel.r) && previewFrom(hoverHex[0], hoverHex[1]);
      if (pv) { const [hx, hy] = center(pv.c, pv.r);
        MARKQ.push(() => { for (const f of pv.threat) { const [x, y] = center(f.c, f.r); if (VIEW.up && !VIEW.up(x, y)) continue; g.beginPath(); gEllipse(g, x, y, s * 0.76, s * 0.76); g.lineWidth = Math.max(4, s * 0.075); g.strokeStyle = 'rgba(18,13,11,0.6)'; g.stroke();
          g.setLineDash([s * 0.09, s * 0.07]); g.lineWidth = Math.max(2, s * 0.035); g.strokeStyle = RANGE_COL; g.stroke(); g.setLineDash([]); } });   // Gegner mit Schussfeld auf das Feld: gestrichelt umrandet (obenauf, sonst verdeckt der Bodenschatten)
        MARKQ.push(() => { g.save(); g.lineCap = 'round';
          for (const f of pv.hit) { const [x, y] = center(f.c, f.r); g.setLineDash([s * 0.06, s * 0.09]); g.strokeStyle = 'rgba(18,13,11,0.6)'; g.lineWidth = Math.max(3.5, s * 0.05); g.beginPath(); pathLine(g, hx, hy - s * 0.3, x, y - s * 0.3); g.stroke();
            g.strokeStyle = 'rgba(194,164,97,0.95)'; g.lineWidth = Math.max(1.6, s * 0.025); g.stroke(); g.setLineDash([]); drawSym(g, UPI.s_zielen, x + s * 0.42, y - s * 0.95, s * 0.19); }
          g.restore();
          if (pv.threat.length) warnMark(hx - s * 0.5, hy - s * kAt(hx, hy) * 0.92, s * 0.22, pv.threat.length);
          if (pv.cov) drawShield(g, hx + s * 0.5, hy - s * kAt(hx, hy) * 0.92, s * 0.36, pv.cov); });
        MARKS.push({ x0: hx - s * 0.8, y0: hy - s * kAt(hx, hy) * 0.92 - s * 0.3, x1: hx + s * 0.8, y1: hy - s * kAt(hx, hy) * 0.92 + s * 0.3, u: sel, kind: 'pv', pv }); } }
  }
  // MG-Schussfächer: gewähltes MG oder feindliches MG unter Maus/Finger
  { const pickMG = u => u && TYPES[u.type].mg && E.active(u) && DU.get(u.id) ? u : null;
    const fu = pickMG(sel) || pickMG(hoverU && hoverU.side !== G.side ? hoverU : null) || pickMG(inspect && inspect.unit); if (fu) drawFan(g, fu);
    const fz = q => q && TYPES[q.type].cls === 'walker' && TYPES[q.type].rng > 0 && E.active(q) && DU.get(q.id) ? q : null;   // Fahrzeuge/Schreiter: Schussfeld der Hauptwaffe (rot) und der Seitenwaffen (Messing)
    const wu = fz(sel) || fz(inspect && inspect.unit); if (wu) { if (TYPES[wu.type].zweit || TYPES[wu.type].broadside) drawFan(g, wu, true); drawFan(g, wu); } }
  if (G.aufstellung) {   // Startzone grün, gewählte Einheit gelb, Ziel beim Ziehen grün bzw. rot
    for (const [c, r] of E.startZone(G, G.aufstellung)) hexMark(c, r, { rgb: '96,196,92', fill: 0.18, soft: true });
    if (aufstellWahl) hexMark(aufstellWahl.c, aufstellWahl.r, { rgb: '226,176,74', fill: 0.35 });
    if (aufstellZiel) hexMark(aufstellZiel.h[0], aufstellZiel.h[1], { rgb: aufstellZiel.ok ? '120,220,110' : '200,64,44', fill: 0.45 }); }
  if (placing) for (const k of spawnSet) hexMark(Math.floor(k / 100), k % 100, { rgb: '96,196,92', fill: 0.3 });   // Aufstellungsfelder für Nachschub grün (Spieltest Runde 2, Punkt 15)
  if (hoverHex) {
    hexPath(g, hoverHex[0], hoverHex[1], 0.95); g.strokeStyle = 'rgba(255,250,225,0.55)'; g.lineWidth = Math.max(1.5, s * 0.04); g.stroke();
    if (sel && TYPES[sel.type].cls === 'art' && shellHexes.has(E.key(hoverHex[0], hoverHex[1])) && artMode !== 'he') {
      const cells = artMode === 'gas' ? E.gasCells(G, hoverHex[0], hoverHex[1]) : E.barrageCells(G, sel, hoverHex[0], hoverHex[1]);
      for (const [c, r] of cells) { hexPath(g, c, r, 0.9); g.fillStyle = artMode === 'gas' ? 'rgba(196,214,70,0.45)' : 'rgba(255,120,60,0.4)'; g.fill(); }
    }
  }
  if (!VIEW.tilt()) drawFlags(g, s);
}
// MG-Schussfächer (Regel E.inFan): ausgefächerte Fläche am Boden, Ochsenblut zur Mitte, nach außen in Messing auslaufend,
// gestrichelte Fächerkanten; Felder in Reichweite innerhalb des Fächers dezent umrandet. Blickrichtung aus dem Anzeige-Zustand.
function drawFan(g, u, zweit) {   // zweit: Schussfeld der Seitenwaffen (Fahrzeuge/Schreiter), heller in Messing
  const d = DU.get(u.id), [x, y] = center(u.c, u.r), s = L.s, k = kAt(x, y), T = TYPES[u.type], F = E.fanOf(u, zweit), rg = zweit ? (T.zweit ? T.zweit.rng : 2) : T.rng;
  if (zweit) { const R = (rg + 0.55) * s * SQ3, mid = d.face * 60, a0 = (mid - F) * Math.PI / 180, a1 = (mid + F) * Math.PI / 180;
    g.save(); g.translate(x, y); g.scale(1, k); g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, R, a0, a1); g.closePath(); g.fillStyle = 'rgba(194,164,97,0.13)'; g.fill();
    g.setLineDash([s * 0.1, s * 0.1]); g.lineWidth = Math.max(1.2, s * 0.025); g.strokeStyle = 'rgba(194,164,97,0.6)'; g.stroke(); g.setLineDash([]); g.restore(); return; }
  const R = (T.rng + 0.55) * s * SQ3, mid = d.face * 60, a0 = (mid - F) * Math.PI / 180, a1 = (mid + F) * Math.PI / 180, pz = 0.5 + 0.5 * Math.sin(now / 600);
  g.save(); g.translate(x, y); g.scale(1, k);
  const gr = g.createRadialGradient(0, 0, s * 0.4, 0, 0, R);
  gr.addColorStop(0, `rgba(168,71,58,${0.42 + 0.06 * pz})`); gr.addColorStop(0.55, 'rgba(168,71,58,0.24)'); gr.addColorStop(0.85, 'rgba(194,164,97,0.14)'); gr.addColorStop(1, 'rgba(194,164,97,0)');
  g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, R, a0, a1); g.closePath(); g.fillStyle = gr; g.fill();
  g.setLineDash([s * 0.12, s * 0.09]); g.lineWidth = Math.max(1.5, s * 0.03); g.strokeStyle = 'rgba(168,71,58,0.75)';
  g.beginPath(); g.moveTo(Math.cos(a0) * s * 0.5, Math.sin(a0) * s * 0.5); g.lineTo(Math.cos(a0) * R, Math.sin(a0) * R); g.moveTo(Math.cos(a1) * s * 0.5, Math.sin(a1) * s * 0.5); g.lineTo(Math.cos(a1) * R, Math.sin(a1) * R); g.stroke();
  g.setLineDash([]); g.restore();
  const save = u.face; u.face = d.face;   // Felder nach der gezeigten Blickrichtung
  g.lineWidth = Math.max(1, s * 0.022); g.strokeStyle = 'rgba(194,164,97,0.45)';
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) { const dd = E.dist(u.c, u.r, c, r); if (dd >= 1 && dd <= E.rangeOf(G, u, c, r) && E.inFan(G, u, c, r)) { hexPath(g, c, r, 0.86); g.stroke(); } }
  u.face = save;
}
// Zielfahnen
// Zielflagge (2026-11-16): verwitterte Stofffahne an krummem Holzpfahl, neutral grau-beige,
// Nummer auf einem kleinen Holzschild am Pfahl; erobert in Fraktionsfarbe (Konkordat Ochsenblut, Aschenwacht Stahlgrau, Blaue Legion Horizontblau).
const FAHNE_VOR = new Set(['village', 'rubble', 'fabrik', 'kirche']), FAHNE_K = 0.55, FAHNE_FARBE = { A: [142, 43, 34], D: [98, 104, 98], F: [111, 143, 181] }, FAHNE_NEUTRAL = [158, 150, 128];
// Ort der Fahne im Feld (Feldradien): sonst hinterer rechter Rand (hinter den Einheiten); in Ruinenfeldern vorn links (Stoff weht über das Feld, Einheiten davor),
// weil hohe Mauern (eigene und die des rechten Nachbarfelds) sie hinten verdecken würden. [dx, dy, Tiefe für die Sortierung]
const fahneOrt = o => { const h = G.map[o.c] && G.map[o.c][o.r]; if (/schanze/i.test(o.id) && GBW && gbAn()) return [0.95, 0.5, 0.5, 0.62];   // Schanze: vorn rechts neben dem Bunker (dahinter wäre das Schild verdeckt)
  return h && FAHNE_VOR.has(h.t) ? [-0.45, 0.42, -0.02, 0.92] : [0.6, -0.45, -0.5, 0.62]; };   // [dx, dy, Tiefe, Höhe des Nummernschilds am Pfahl]
function drawFahne(g, s, x, y, o) {
  const sd = VIS.ctrl[o.id], [cr, cg, cb] = sd ? FAHNE_FARBE[fac(sd)] || FAHNE_NEUTRAL : FAHNE_NEUTRAL, sh = (v, k) => Math.round(Math.max(0, Math.min(255, v * k)));
  const col = k => `rgb(${sh(cr, k)},${sh(cg, k)},${sh(cb, k)})`, seed = o.c * 7 + o.r * 13;
  // 55 % der Vorschlagsgröße, am hinteren rechten Feldrand: verdeckt weder Figuren noch Ruinen (wird hinter den Einheiten gezeichnet)
  const [ox, oy] = fahneOrt(o), px0 = x + s * ox, base0 = y + s * oy * kAt(x, y); g.save(); g.translate(px0, base0); const fk = VIEW.tilt() ? FAHNE_K : 0.9; g.scale(fk, fk); g.translate(-px0, -base0);   // alte Ansicht: Felder kleiner, Fahne verhältnismäßig größer
  const px = px0, base = base0, H = s * 1.3, lean = s * 0.05, top = [px + lean, base - H];
  // Pfahl: grobes Holz, leicht schief, oben abgesplittert
  g.save(); g.lineCap = 'round';
  g.fillStyle = 'rgba(6,4,3,0.4)'; g.beginPath(); g.ellipse(px, base, s * 0.12, s * 0.04, 0, 0, 7); g.fill();
  g.strokeStyle = O; g.lineWidth = Math.max(2, s * 0.085); g.beginPath(); g.moveTo(px, base); g.lineTo(top[0], top[1]); g.stroke();
  g.strokeStyle = '#5a4630'; g.lineWidth = Math.max(1.2, s * 0.055); g.beginPath(); g.moveTo(px, base); g.lineTo(top[0], top[1]); g.stroke();
  g.strokeStyle = 'rgba(150,120,80,0.55)'; g.lineWidth = Math.max(0.6, s * 0.014); g.beginPath(); g.moveTo(px - s * 0.01, base - s * 0.05); g.lineTo(top[0] - s * 0.012, top[1] + s * 0.1); g.stroke();
  // Stoff: weht nach rechts, Wellen nach Zeit, ausgefranstes Ende, zwei Risse
  const fw = s * 0.82, fh = s * 0.5, t = now / 700, N = 14, ay = top[1] + s * 0.04;
  const at = (u, v) => { const lx = top[0] - lean * (v * fh / H); const wv = Math.sin(u * 4.2 - t + seed) * s * 0.05 * u + u * u * s * 0.06; return [lx + u * fw, ay + v * fh + wv]; };
  const fray = u => (u > 0.82 ? Math.sin(u * 61 + seed) * 0.5 + 0.5 : 0) * s * 0.07;
  const shape = () => { g.beginPath(); for (let i = 0; i <= N; i++) { const u = i / N, [qx, qy] = at(u, 0); g[i ? 'lineTo' : 'moveTo'](qx, qy); }
    for (let j = 0; j <= 8; j++) { const v = j / 8, [qx, qy] = at(1, v); g.lineTo(qx - (Math.sin(v * 23 + seed) * 0.5 + 0.5) * s * 0.11, qy); }   // Fransen
    for (let i = N; i >= 0; i--) { const u = i / N, [qx, qy] = at(u, 1); g.lineTo(qx, qy - fray(u)); } g.closePath(); };
  shape(); g.fillStyle = col(1); g.fill();
  g.save(); shape(); g.clip();
  for (let i = 0; i < N; i++) { const u = i / N, d = Math.cos(u * 4.2 - t + seed); const [q0x, q0y] = at(u, 0), [q1x] = at(u + 1 / N, 0);   // Falten: hell/dunkel nach Wellenneigung
    g.fillStyle = d > 0 ? `rgba(255,250,230,${0.1 * d})` : `rgba(10,8,6,${-0.22 * d})`; g.fillRect(q0x, q0y - s * 0.2, q1x - q0x + 1, fh + s * 0.4); }
  const gr = g.createLinearGradient(0, ay, 0, ay + fh); gr.addColorStop(0, 'rgba(20,16,10,0)'); gr.addColorStop(1, 'rgba(40,30,18,0.38)'); g.fillStyle = gr; g.fillRect(top[0], ay - s * 0.2, fw + s * 0.2, fh + s * 0.4);   // Dreck unten
  for (let k = 0; k < 26; k++) { const [qx, qy] = at(((seed * 0.13 + k * 0.383) % 1), ((seed * 0.29 + k * 0.618) % 1)); g.fillStyle = k % 2 ? 'rgba(60,46,28,0.16)' : 'rgba(235,225,200,0.08)'; g.beginPath(); g.ellipse(qx, qy, s * 0.07, s * 0.03, k, 0, 7); g.fill(); }   // Stoffstruktur, ausgeblichen
  const sm = g.createLinearGradient(top[0], 0, top[0] + fw, 0); sm.addColorStop(0, 'rgba(30,22,12,0.3)'); sm.addColorStop(0.25, 'rgba(30,22,12,0)'); sm.addColorStop(0.8, 'rgba(30,22,12,0)'); sm.addColorStop(1, 'rgba(30,22,12,0.35)'); g.fillStyle = sm; g.fillRect(top[0], ay - s * 0.2, fw + s * 0.2, fh + s * 0.4);   // Ränder verschmutzt
  g.fillStyle = 'rgba(30,24,16,0.45)'; for (let k = 0; k < 7; k++) { const [qx, qy] = at(0.15 + ((seed * 0.37 + k * 0.29) % 0.75), 0.15 + ((seed * 0.53 + k * 0.41) % 0.7)); g.beginPath(); g.arc(qx, qy, s * (0.012 + (k % 3) * 0.008), 0, 7); g.fill(); }   // Flecken
  g.restore();
  for (const [u, v] of [[0.55, 0.35], [0.74, 0.7]]) { const [qx, qy] = at(u, v); g.fillStyle = 'rgba(20,16,10,0.85)'; g.beginPath(); g.ellipse(qx, qy, s * 0.03, s * 0.02, 0.6, 0, 7); g.fill(); }   // Löcher
  shape(); g.strokeStyle = 'rgba(22,21,15,0.85)'; g.lineWidth = Math.max(1, s * 0.022); g.stroke();
  // Holzschild mit der Nummer, am Pfahl angenagelt
  const bw = s * 0.34, bh = s * 0.26, bx = px + lean * 0.35 - bw * 0.5, by = base - s * fahneOrt(o)[3];
  g.save(); g.translate(bx + bw / 2, by + bh / 2); g.rotate(((seed % 5) - 2) * 0.03);
  g.fillStyle = '#6b5236'; g.strokeStyle = O; g.lineWidth = Math.max(1.2, s * 0.03); g.beginPath(); g.rect(-bw / 2, -bh / 2, bw, bh); g.fill(); g.stroke();
  g.strokeStyle = 'rgba(30,22,12,0.5)'; g.lineWidth = Math.max(0.6, s * 0.01); g.beginPath(); g.moveTo(-bw / 2, -bh * 0.05); g.lineTo(bw / 2, -bh * 0.1); g.stroke();
  g.fillStyle = '#2a2016'; for (const nx of [-bw * 0.38, bw * 0.38]) { g.beginPath(); g.arc(nx, -bh * 0.3, s * 0.016, 0, 7); g.fill(); }
  g.fillStyle = '#e8dfc6'; g.font = `800 ${Math.round(s * 0.21)}px "Arm Text", system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(o.pts, 0, s * 0.01);
  g.restore(); g.restore(); g.restore();
}
function drawFlags(g, s, up, nur) {   // Zielflaggen: Stofffahne am Holzpfahl (Standard seit 2026-11-16, alte weiße Tafel entfernt)
  for (const o of nur ? [nur] : OBJECTIVES) {
    const [x, y] = center(o.c, o.r); if (up && !up(x, y)) continue;
    drawFahne(g, s, x, y, o);
  }
}
// Anführer-Orden: rotes Band in Fraktionsfarbe umgefärbt (Stern bleibt Messing), je Fraktion zwischengespeichert
const ORDEN = {};
function ordenBild(f) {
  const oi = UPI.orden; if (!oi) return null; if (ORDEN[f]) return ORDEN[f];
  const [cr, cg, cb] = FAHNE_FARBE[f] || FAHNE_FARBE.A, c = document.createElement('canvas'); c.width = oi.naturalWidth; c.height = oi.naturalHeight;
  const x = c.getContext('2d'); x.drawImage(oi, 0, 0);
  try { const id = x.getImageData(0, 0, c.width, c.height), d = id.data;
    for (let i = 0; i < d.length; i += 4) { const r = d[i], g = d[i + 1], b = d[i + 2], m = Math.min(1, Math.max(0, (Math.min(r - g, r - b) - 25) / 30)); if (!m) continue;
      const v = Math.max(r, g, b) / 150; d[i] += (cr * v - r) * m; d[i + 1] += (cg * v - g) * m; d[i + 2] += (cb * v - b) * m; }
    x.putImageData(id, 0, 0); } catch (e) { return oi; }
  return (ORDEN[f] = c);
}
// Einheiten nach Tiefe (hinten zuerst)
function unitList() {
  readyN = G.over || !human(G.side) ? 0 : G.units.filter(u => u.side === G.side && E.active(u) && !spent.has(u.id)).length;
  const list = [];
  for (const u of G.units) { const d = DU.get(u.id); if (d && d.alpha > 0) list.push([d.y, u, d]); }
  return list.sort((a, b) => a[0] - b[0]);
}
function drawUnits() { for (const [, u, d] of unitList()) drawUnit(u, d); }
function drawDiaryMark(g) { if (diaryMark && now - diaryMark.t < 2400) { const k = (now - diaryMark.t) / 2400, pz = 0.5 + 0.5 * Math.sin(now / 140); g.globalAlpha = 1 - k * 0.6; hexMark(diaryMark.c, diaryMark.r, { rgb: BRASS, fill: 0.18 + 0.1 * pz }); g.globalAlpha = 1; } }   // Ort aus dem Kriegstagebuch
// Luft: Nebel, Gas, Regen, Effekte, Wegkosten
function drawAir(g, s, up) {
  // Nebel (grau), ausgeleuchtete Felder (gelb), eigene Stollen und Minen
  for (const k of VIS.lit) { if (up) { const [lx, ly] = center(k.c, k.r); if (!up(lx, ly)) continue; } hexPath(g, k.c, k.r, 0.98); g.fillStyle = 'rgba(255,240,170,0.16)'; g.fill(); }
  for (const k of VIS.smoke) {
    const [x, y] = center(k.c, k.r); if (up && !up(x, y)) continue;
    if (fxN('nebel')) { for (let i = 0; i < 2; i++) { const im = fxIm('nebel', (k.c * 2 + k.r + i * 3) % fxN('nebel')); if (!im) continue;   // Nebelwand des Rauchwerfers: zwei Bänke, ziehen langsam
        const [w, h] = fxDim(im, 'nebel', 0.95 + 0.05 * Math.sin(now / 1500 + i)), dx = Math.sin(now / 2100 + k.c + i * 2) * s * 0.12;
        g.save(); g.globalAlpha = 0.82; g.translate(x + dx + (i ? s * 0.18 : -s * 0.18), y + (i ? s * 0.35 : -s * 0.05) * kAt(x, y)); if ((k.r + i) % 2) g.scale(-1, 1); g.drawImage(im, -w / 2, -h, w, h); g.restore(); }
      continue; }
    for (let i = 0; i < 4; i++) { const a = i * 1.6 + now / 1700 + k.c, rx = s * (0.5 + 0.08 * Math.sin(now / 800 + i));
      const gr = g.createRadialGradient(x + Math.cos(a) * s * 0.3, y - s * 0.2 + Math.sin(a) * s * 0.15, 0, x + Math.cos(a) * s * 0.3, y - s * 0.2, rx);
      gr.addColorStop(0, 'rgba(225,225,220,0.55)'); gr.addColorStop(1, 'rgba(225,225,220,0)'); g.fillStyle = gr; g.fillRect(x - s * 1.2, y - s * 1.2, s * 2.4, s * 2.4); }
  }
  const mySide = human(G.side) ? G.side : ['A', 'D'].find(human);
  g.font = `900 ${Math.round(s * 0.36)}px "Arm Text", system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
  for (const q of G.tunnels || []) if (q.side === mySide) { const [x, y] = center(q.c, q.r); if (up && !up(x, y)) continue; g.lineWidth = Math.max(2, s * 0.07); g.strokeStyle = O; g.strokeText(`⛏${q.t}`, x, y + s * 0.15); g.fillStyle = '#ffb86a'; g.fillText(`⛏${q.t}`, x, y + s * 0.15); }
  // Brennende Felder: Flammen aus dem Feuerbogen (aufhellend) am Feldrand, die Truppe in der Mitte bleibt frei; sonst die alten kleinen Flammen
  if (fxN('feuer')) for (const f of VIS.fires || []) { const [cx, cy] = center(f.c, f.r), kk = kAt(cx, cy);
    for (let i = 0; i < 4; i++) { const a = i * 1.571 + 0.6 + f.c * 0.7, x = cx + Math.cos(a) * s * 0.58, y = cy + Math.sin(a) * s * 0.5 * kk; if (up && !up(x, y)) continue;
      const im = fxIm('feuer', (f.c * 3 + f.r * 5 + i) % fxN('feuer')); if (!im) continue; const t = now / 140 + i * 2.3 + f.r, fl = 0.9 + 0.1 * Math.sin(t) + 0.05 * Math.sin(t * 2.7);
      const [w, h] = fxDim(im, 'feuer', 0.85 + 0.1 * (i % 2)); g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.9; g.translate(x, y + s * 0.05); if ((i + f.c) % 2) g.scale(-1, 1); g.scale(1, fl); g.drawImage(im, -w / 2, -h, w, h); g.restore(); } }
  else for (const f of VIS.fires || []) { const [cx, cy] = center(f.c, f.r); for (let i = 0; i < 8; i++) { const a = i * 0.785 + f.c * 0.7, rr = 0.5 + 0.12 * ((i * 37) % 3), x = cx + Math.cos(a) * s * rr, y = cy + Math.sin(a) * s * rr * 0.75 * kAt(cx, cy); if (up && !up(x, y)) continue;   // am Feldrand, die Truppe in der Mitte bleibt frei
    const t = now / 110 + i * 2.1, h = s * (0.14 + 0.05 * Math.sin(t) + 0.03 * (i % 2)), w = s * 0.05;
    for (const [col, kk] of [['rgba(170,50,10,0.55)', 1], ['rgba(240,130,35,0.65)', 0.66], ['rgba(255,214,110,0.7)', 0.34]]) { g.beginPath(); g.moveTo(x - w * kk, y); g.quadraticCurveTo(x - w * kk * 1.2, y - h * kk * 0.5, x + Math.sin(t) * w * 0.4, y - h * kk); g.quadraticCurveTo(x + w * kk * 1.2, y - h * kk * 0.5, x + w * kk, y); g.closePath(); g.fillStyle = col; g.fill(); } } }
  // Leuchtkugel am Fallschirm über jedem markierten Feld, solange die Markierung gilt (für alle sichtbar), dazu Lichtschein am Boden
  if (fxN('leuchtkugel')) for (const k of VIS.marks || []) { const [x, y] = center(k.c, k.r); if (up && !up(x, y)) continue;
    const pz = 0.8 + 0.2 * Math.sin(now / 90 + k.c) * Math.sin(now / 37), sw = Math.sin(now / 900 + k.r) * s * 0.12, fy = y - s * 2.1;
    const lg = g.createRadialGradient(x, y, 0, x, y, s * 1.1); lg.addColorStop(0, `rgba(255,200,120,${(0.16 * pz).toFixed(3)})`); lg.addColorStop(1, 'rgba(255,200,120,0)');
    g.save(); g.globalCompositeOperation = 'lighter'; g.translate(x, y); g.scale(1, kAt(x, y)); g.translate(-x, -y); g.fillStyle = lg; g.beginPath(); g.arc(x, y, s * 1.1, 0, 7); g.fill(); g.restore();
    const sch = fxIm('leuchtkugel', 2), gl = fxIm('leuchtkugel', 3 + (k.c + k.r) % 3);
    if (gl) { const [w, h] = fxDim(gl, 'leuchtkugel', 0.55 * pz); g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.85; g.drawImage(gl, x + sw - w / 2, fy + s * 0.32 - h / 2, w, h); g.restore(); }
    if (sch) { const [w, h] = fxDim(sch, 'leuchtkugel', 0.75); g.save(); g.globalCompositeOperation = 'lighter'; g.translate(x + sw, fy); g.rotate(Math.sin(now / 900 + k.r) * 0.08); g.drawImage(sch, -w / 2, -h * 0.55, w, h); g.restore(); } }
  // Markierte Ziele der eigenen Seite: Messing-Zielkreuz am Boden (gilt bis zum nächsten eigenen Zug)
  for (const k of VIS.marks || []) if (k.side === mySide) { const [x, y] = center(k.c, k.r); if (up && !up(x, y)) continue; const kk = kAt(x, y), pz = 0.75 + 0.25 * Math.sin(now / 260);
    g.save(); g.globalAlpha = pz; g.strokeStyle = O; g.lineWidth = Math.max(4, s * 0.1); g.beginPath(); gEllipse(g, x, y, s * 0.55, s * 0.55); g.stroke();
    g.strokeStyle = '#E2B04A'; g.lineWidth = Math.max(2, s * 0.05); g.beginPath(); gEllipse(g, x, y, s * 0.55, s * 0.55); g.stroke();
    g.beginPath(); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { g.moveTo(x + dx * s * 0.4, y + dy * s * 0.4 * kk); g.lineTo(x + dx * s * 0.75, y + dy * s * 0.75 * kk); } g.stroke(); g.restore(); }
  for (const q of G.mines || []) if (q.side === mySide || q.known === mySide) { const [x, y] = center(q.c, q.r); if (up && !up(x, y)) continue; g.beginPath(); g.ellipse(x, y + s * 0.2, s * 0.17, s * 0.1, 0, 0, 7); g.fillStyle = '#5b5434'; g.fill(); g.strokeStyle = '#e6d48a'; g.lineWidth = Math.max(1.5, s * 0.04); g.stroke(); }
  // Gaswolken
  for (const k of VIS.clouds) {
    const [x, y] = center(k.c, k.r), v = (k.c + k.r) % 2 ? 'gas1' : 'gas2', im = FXI[v]; if (up && !up(x, y)) continue;
    const gi = fxIm('gas', (k.c * 3 + k.r) % Math.max(1, fxN('gas')));
    if (gi) {   // Gaswolke wabert langsam: Breite und Höhe gegenläufig, leichtes Treiben
      const [w, h] = fxDim(gi, 'gas', 0.9), sx = 1 + 0.06 * Math.sin(now / 900 + k.c), sy = 1 + 0.07 * Math.sin(now / 1100 + k.r + 1), dx = Math.sin(now / 1700 + k.r) * s * 0.1;
      g.save(); g.globalAlpha = 0.8; g.translate(x + dx, y + s * 0.45 * kAt(x, y)); if ((k.c + k.r) % 2) g.scale(-1, 1); g.scale(sx, sy); g.drawImage(gi, -w / 2, -h, w, h); g.restore();
    } else if (im) {
      const hh = s * (1.25 + 0.06 * Math.sin(now / 700 + k.c)), w = fxw(im, hh), dx = Math.sin(now / 1300 + k.r) * s * 0.08;
      g.globalAlpha = 0.82; g.drawImage(im, x - w / 2 + dx, y + s * kAt(x, y) * 0.6 - hh, w, hh); g.globalAlpha = 1;
    } else {
      for (let i = 0; i < 5; i++) {
        const a = i * 1.26 + now / 1400, rx = s * (0.42 + 0.1 * Math.sin(now / 900 + i));
        g.beginPath(); g.ellipse(x + Math.cos(a) * s * 0.36, y - s * 0.25 + Math.sin(a * 1.3) * s * 0.22 * kAt(x, y), rx, rx * 0.72, 0, 0, 7);
        g.fillStyle = 'rgba(200,216,72,0.26)'; g.fill();
      }
    }
  }
  // Nebelschwaden und Nieselregen
  for (let i = 0; i < 5; i++) {
    const fx = ((now / (38 + i * 9) + i * L.W * 0.27) % (L.W * 1.4)) - L.W * 0.2, fy = L.top + (L.H - L.top) * (0.12 + 0.2 * i); if (up && !up(fx, fy)) continue;
    const fg = g.createRadialGradient(fx, fy, 0, fx, fy, s * 7); fg.addColorStop(0, 'rgba(176,170,150,0.10)'); fg.addColorStop(1, 'rgba(176,170,150,0)');
    g.fillStyle = fg; g.save(); g.translate(fx, fy); g.scale(1, 0.3); g.translate(-fx, -fy); g.fillRect(fx - s * 7, fy - s * 7, s * 14, s * 14); g.restore();
  }
  if (up) {   // neue Ansicht: Nieselregen über dem ganzen Schirm
    g.setTransform(1, 0, 0, 1, 0, 0); const W = cv.width, H = cv.height, u0 = Math.max(1, W / 1920);
    g.strokeStyle = 'rgba(200,205,205,0.10)'; g.lineWidth = u0; g.beginPath();
    for (let i = 0; i < 90; i++) { const rx = (i * 211.3 + now * 0.3) % W, ry = (i * 97.7 + now * 1.1) % H; g.moveTo(rx, ry); g.lineTo(rx - 8 * u0, ry + 30 * u0); }
    g.stroke();
  } else {
  g.strokeStyle = 'rgba(200,205,205,0.10)'; g.lineWidth = Math.max(1, s * 0.02); g.beginPath();
  for (let i = 0; i < 70; i++) { const rx = (i * 173.3 + now * 0.25) % L.W, ry = (i * 97.7 + now * 0.9) % L.H; g.moveTo(rx, ry); g.lineTo(rx - s * 0.12, ry + s * 0.5); }
  g.stroke(); }
  // Effekte
  g.lineCap = 'round';
  for (let i = tracers.length - 1; i >= 0; i--) {
    const tr = tracers[i]; tr.life -= FS;
    if (tr.life <= 0) { tracers.splice(i, 1); continue; }
    const k = 1 - tr.life / tr.max;
    const pim = PJI[tr.img];
    if (pim) {
      const ang = Math.atan2(tr.y2 - tr.y1, tr.x2 - tr.x1), hh = s * tr.sz, w = fxw(pim, hh), reps = tr.stream ? tr.n : tr.n > 1 ? 2 : 1;
      for (let n = 0; n < reps; n++) {   // MG: Kette einzelner Geschosse mit kleinem Abstand (Wunsch des Nutzers)
        const p = tr.stream ? k * 1.9 - n * 0.11 : k * 1.15 - n * 0.3; if (p < 0 || p > 1) continue;
        if (up && !up(tr.x1 + (tr.x2 - tr.x1) * p, tr.y1 + (tr.y2 - tr.y1) * p)) continue;
        g.save(); g.translate(tr.x1 + (tr.x2 - tr.x1) * p, tr.y1 + (tr.y2 - tr.y1) * p); g.rotate(ang); if (tr.x2 < tr.x1) g.scale(1, -1);
        g.drawImage(pim, -w, -hh / 2, w, hh); g.restore();
      }
      continue;
    }
    for (let n = 0; n < tr.n; n++) {
      const p = (k * 1.5 + n * 0.16) % 1.15; if (p > 1) continue;
      const q = Math.max(0, p - 0.1);
      const xa = tr.x1 + (tr.x2 - tr.x1) * q, ya = tr.y1 + (tr.y2 - tr.y1) * q, xb = tr.x1 + (tr.x2 - tr.x1) * p, yb = tr.y1 + (tr.y2 - tr.y1) * p;
      if (up && !up(xa, ya)) continue;
      g.strokeStyle = O; g.lineWidth = s * 0.11; g.beginPath(); g.moveTo(xa, ya); g.lineTo(xb, yb); g.stroke();
      g.strokeStyle = tr.col; g.lineWidth = s * 0.055; g.beginPath(); g.moveTo(xa, ya); g.lineTo(xb, yb); g.stroke();
    }
    if (tr.life > tr.max - 5 && (!up || up(tr.x1, tr.y1))) { g.fillStyle = '#fff1a0'; g.beginPath(); g.arc(tr.x1, tr.y1, s * 0.16, 0, 7); g.fill(); }
  }
  for (let i = flames.length - 1; i >= 0; i--) {
    const f = flames[i]; f.life -= FS;
    if (f.life <= 0) { flames.splice(i, 1); continue; }
    if (up && !up(f.x1, f.y1)) continue;
    const k = Math.min(1, (f.max - f.life) / 6), im = PJI.jet && f.life % 12 >= 8 ? PJI.jet : FXI[f.life % 8 < 4 ? 'flame1' : 'flame2'];
    if (im) {
      const len = Math.hypot(f.x2 - f.x1, f.y2 - f.y1) * 1.2 * k, hh = len * im.naturalHeight / im.naturalWidth * 1.25;
      g.save(); g.translate(f.x1, f.y1); g.rotate(Math.atan2(f.y2 - f.y1, f.x2 - f.x1));
      if (f.x2 < f.x1) g.scale(1, -1);
      g.globalAlpha = Math.min(1, f.life / 6); g.drawImage(im, 0, -hh / 2, len, hh); g.restore(); g.globalAlpha = 1;
    } else {
      const ex = f.x1 + (f.x2 - f.x1) * k, ey = f.y1 + (f.y2 - f.y1) * k;
      const nx = -(ey - f.y1), ny = ex - f.x1, nl = Math.hypot(nx, ny) || 1, wv = s * (0.28 + 0.06 * Math.sin(now / 40));
      for (const [col, m] of [['#16150f', 1.25], ['#f08a2a', 1], ['#ffe07a', 0.5]]) {
        g.beginPath(); g.moveTo(f.x1, f.y1); g.lineTo(ex + nx / nl * wv * m, ey + ny / nl * wv * m); g.lineTo(ex + (ex - f.x1) * 0.12 * m, ey + (ey - f.y1) * 0.12 * m); g.lineTo(ex - nx / nl * wv * m, ey - ny / nl * wv * m); g.closePath(); g.fillStyle = col; g.fill();
      }
    }
  }
  for (let i = shells.length - 1; i >= 0; i--) {
    const sh = shells[i]; sh.t += FS / sh.dur;
    if (sh.t >= 1) { shells.splice(i, 1); continue; }
    const x = sh.x1 + (sh.x2 - sh.x1) * sh.t, y = sh.y1 + (sh.y2 - sh.y1) * sh.t - Math.sin(Math.PI * sh.t) * s * (sh.arc ?? 3.2);
    if (up && !up(x, y)) continue;
    const pim = PJI[sh.img], gim = sh.fxi != null ? fxIm('geschosse', sh.fxi) : null;
    if (gim) {   // Geschoss aus dem neuen Bogen: auf die Flugbahn gedreht (Handgranaten drehen sich), dahinter Schweif bzw. Zündschnur-Funken
      const t2 = Math.min(1, sh.t + 0.02), nx = sh.x1 + (sh.x2 - sh.x1) * t2, ny = sh.y1 + (sh.y2 - sh.y1) * t2 - Math.sin(Math.PI * t2) * s * (sh.arc ?? 3.2), fa = Math.atan2(ny - y, nx - x), left = sh.x2 < sh.x1;
      const tim = fxIm('leuchtspur', sh.spin ? 4 : 2);
      if (tim) { const [tw, th] = fxDim(tim, 'leuchtspur', sh.spin ? 0.35 : 0.5); g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.85; g.translate(x, y); g.rotate(fa); if (left) g.scale(1, -1); g.drawImage(tim, -tw, -th / 2, tw, th); g.restore(); }
      const [w, hh] = fxDim(gim, 'geschosse', sh.fxs || 1);
      g.save(); g.translate(x, y); g.rotate(sh.spin ? sh.t * 14 : fa); if (left && !sh.spin) g.scale(1, -1); g.rotate(-GESCHOSS_ANG[sh.fxi]); g.drawImage(gim, -w / 2, -hh / 2, w, hh); g.restore();
    } else if (pim) {
      const t2 = Math.min(1, sh.t + 0.02), nx = sh.x1 + (sh.x2 - sh.x1) * t2, ny = sh.y1 + (sh.y2 - sh.y1) * t2 - Math.sin(Math.PI * t2) * s * (sh.arc ?? 3.2);
      const hh = s * (sh.sz || 0.36), w = fxw(pim, hh);
      g.save(); g.translate(x, y); g.rotate(Math.atan2(ny - y, nx - x) + (sh.spin ? sh.t * 9 : 0)); if (sh.x2 < sh.x1 && !sh.spin) g.scale(1, -1);
      g.drawImage(pim, sh.spin ? -w / 2 : -w, -hh / 2, w, hh); g.restore();
    } else { g.beginPath(); g.arc(x, y, s * 0.12, 0, 7); g.fillStyle = sh.col; g.fill(); g.strokeStyle = O; g.lineWidth = Math.max(1.5, s * 0.05); g.stroke(); }
  }
  for (let i = muzzles.length - 1; i >= 0; i--) {
    const mz = muzzles[i]; mz.life -= FS; if (mz.life <= 0) { muzzles.splice(i, 1); continue; }
    const im = PJI[mz.img]; if (!im) continue; if (up && !up(mz.x, mz.y)) continue;
    const hh = s * mz.sz * (0.85 + 0.15 * Math.sin(mz.life)), w = fxw(im, hh);
    g.save(); g.translate(mz.x, mz.y); if (mz.center) { if (mz.flip) g.scale(-1, 1); g.globalAlpha = Math.min(1, mz.life / (mz.max * 0.5)); g.drawImage(im, -w / 2, -hh * (mz.up || 0.5), w, hh); }
    else { g.rotate(mz.ang); if (Math.cos(mz.ang) < 0) g.scale(1, -1); g.globalAlpha = Math.min(1, mz.life / (mz.max * 0.5)); g.drawImage(im, -w * (mz.off || 0), -hh / 2, w, hh); }
    g.restore(); g.globalAlpha = 1;
  }
  for (let i = rings.length - 1; i >= 0; i--) {
    const rg = rings[i]; rg.life -= FS; if (rg.life <= 0) { rings.splice(i, 1); continue; }
    const k = 1 - rg.life / rg.max, im = PJI[rg.img]; if (up && !up(rg.x, rg.y)) continue;
    if (im) { const hh = s * rg.r * (0.7 + 0.5 * k), w = fxw(im, hh); g.globalAlpha = Math.min(1, rg.life / (rg.max * 0.4)); g.drawImage(im, rg.x - w / 2, rg.y - hh / 2 - k * s * 0.5, w, hh); g.globalAlpha = 1; }
    else { g.beginPath(); gEllipse(g, rg.x, rg.y, s * rg.r * k, s * rg.r * k); g.strokeStyle = rg.col; g.globalAlpha = 1 - k; g.lineWidth = Math.max(2, s * 0.09); g.stroke(); g.globalAlpha = 1; }
  }
  drawFxs(g, s, up);
  for (let i = booms.length - 1; i >= 0; i--) {
    const b = booms[i]; if (b.delay > 0) { b.delay -= FS; continue; } b.life -= FS;
    if (b.life <= 0) { booms.splice(i, 1); continue; }
    const k = 1 - b.life / b.max, im = FXI[b.img]; if (up && !up(b.x, b.y)) continue;
    if (im) {
      const grow = b.kind === 'smoke' ? 0.7 + 0.5 * k : 0.45 + 0.55 * Math.sqrt(Math.min(1, k * 2.2));
      const hh = b.r * 2.3 * grow, w = fxw(im, hh), rise = b.kind === 'smoke' ? k * b.r * 1.2 : 0;
      g.globalAlpha = Math.min(1, b.life / (b.max * 0.45)) * (b.kind === 'smoke' ? 0.8 : 1);
      g.save(); g.translate(b.x, b.y + b.r * 0.35 - rise); if (b.flip) g.scale(-1, 1); g.drawImage(im, -w / 2, -hh, w, hh); g.restore();
    } else {
      const r = b.r * (0.35 + 0.65 * Math.sqrt(k));
      g.globalAlpha = Math.min(1, b.life / (b.max * 0.5));
      for (const [col, m] of b.cols) { g.beginPath(); g.arc(b.x, b.y - r * 0.5, r * m, 0, 7); g.fillStyle = col; g.fill(); if (m === 1) { g.strokeStyle = O; g.lineWidth = Math.max(2, s * 0.06); g.stroke(); } }
    }
    g.globalAlpha = 1;
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]; p.x += p.vx * FS; p.y += p.vy * FS; p.vy += p.g * FS; p.life -= FS;
    if (p.life <= 0) { particles.splice(i, 1); continue; }
    if (up && !up(p.x, p.y)) continue;
    g.globalAlpha = Math.min(1, p.life / 12); g.fillStyle = p.col; g.beginPath(); g.arc(p.x, p.y, p.s, 0, 7); g.fill();
  }
  g.globalAlpha = 1;
  // Pfadvorschau (Paket 2): kleine halbdurchsichtige Punkte Feld für Feld bis zum Zielfeld; Gefahr (Draht, Gas, Feuer, MG-Sperrfeuer) rot mit Warnzeichen
  { const n = sel && human(G.side) && !busy && hoverHex && reach.get(E.key(hoverHex[0], hoverHex[1]));
    if (n && n.path && n.path.length) { const pts = [[sel.c, sel.r], ...n.path]; let warnAt = null;
      for (let i = 1; i < pts.length; i++) { const [c0, r0] = pts[i - 1], [c1, r1] = pts[i], [x0, y0] = center(c0, r0), [x1, y1] = center(c1, r1), hz = pathHazard(sel, c1, r1);
        if (hz && !warnAt) warnAt = [x1, y1, hz];
        for (const k of i === pts.length - 1 ? [0.5] : [0.5, 1]) { const x = x0 + (x1 - x0) * k, y = y0 + (y1 - y0) * k; if (up && !up(x, y)) continue;
          g.beginPath(); g.arc(x, y, Math.max(3, s * (k === 1 ? 0.075 : 0.055)), 0, 7); g.fillStyle = hz && k === 1 || hz && i === pts.length - 1 ? 'rgba(200,52,40,0.72)' : 'rgba(240,237,225,0.55)'; g.fill();
          g.lineWidth = Math.max(1, s * 0.018); g.strokeStyle = 'rgba(18,13,11,0.55)'; g.stroke(); } }
      { const [c1, r1] = pts[pts.length - 1], [x, y] = center(c1, r1); if (!up || up(x, y)) {   // Rest-BP am Zielfeld (Fahrplan 2)
          const t = String(n.rest), R = Math.max(10, s * 0.19), yy = y + s * 0.05; g.beginPath(); g.arc(x, yy, R, 0, 7); g.fillStyle = n.march ? 'rgba(226,176,74,0.92)' : 'rgba(232,221,184,0.92)'; g.fill();
          g.lineWidth = Math.max(2, s * 0.035); g.strokeStyle = '#120D0B'; g.stroke(); g.font = `400 ${Math.round(R * 1.25)}px "Arm Ziffer", "Arm Text", system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#120D0B'; g.fillText(t, x, yy + R * 0.06); } }
      if (warnAt) { const [x, y, hz] = warnAt, ty = y - s * 0.55; if (!up || up(x, ty)) { const r = Math.max(9, s * 0.17);   // Warndreieck
          g.beginPath(); g.moveTo(x, ty - r); g.lineTo(x + r * 1.05, ty + r * 0.75); g.lineTo(x - r * 1.05, ty + r * 0.75); g.closePath(); g.fillStyle = '#C8342A'; g.fill(); g.lineWidth = Math.max(2, s * 0.04); g.strokeStyle = '#120D0B'; g.stroke();
          g.font = `900 ${Math.round(r * 1.2)}px "Arm Text", system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#F0EDE1'; g.fillText('!', x, ty + r * 0.12); } } } }
  if (wayPt && sel && human(G.side) && !busy) { const [x, y] = center(wayPt[0], wayPt[1]); if (!up || up(x, y)) { const kk = kAt(x, y), pz = 0.75 + 0.25 * Math.sin(now / 260);
      g.save(); g.globalAlpha = pz; g.beginPath(); gEllipse(g, x, y, s * 0.42, s * 0.42); g.lineWidth = Math.max(5, s * 0.1); g.strokeStyle = '#120D0B'; g.stroke(); g.lineWidth = Math.max(2.5, s * 0.05); g.strokeStyle = '#E2B04A'; g.stroke();
      g.globalAlpha = 1; g.font = `900 ${Math.round(s * 0.3)}px "Arm Text", system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineWidth = Math.max(3, s * 0.07); g.strokeStyle = '#120D0B'; g.strokeText('Wegpunkt', x, y - s * 0.62 * kk); g.fillStyle = '#E2B04A'; g.fillText('Wegpunkt', x, y - s * 0.62 * kk); g.restore(); } }
  // Schrittzahlen
  g.textAlign = 'center'; g.textBaseline = 'middle';
  // Bewegungskosten nur am Feld unter dem Mauszeiger, klein
  { const n = sel && human(G.side) && !busy && hoverHex && !abilSet.has(E.key(hoverHex[0], hoverHex[1])) && reach.get(E.key(hoverHex[0], hoverHex[1]));
    if (n) { const [x, y] = center(n.c, n.r), t = n.march ? 'Marsch – danach keine Aktion mehr' : `${n.cost}${n.retreat ? ' · Rückzug' + fbTxt(sel) : ''}`, fs = Math.round(Math.max(14, s * 0.24)); if (up) up(x, y); const ty = y - s * kAt(x, y) * 0.45;
      g.font = `700 ${fs}px "Arm Text", system-ui, sans-serif`; const tw = g.measureText(t).width, im = n.march ? UPI.s_marsch : UPI.s_stiefel || UPI.s_marsch, iw = im ? fs * 1.35 : 0, x0 = x - (tw + iw) / 2;
      if (im) { g.save(); g.filter = 'brightness(1.9) sepia(0.25) drop-shadow(1px 0 0 #F0EDE1) drop-shadow(-1px 0 0 #F0EDE1) drop-shadow(0 1px 0 #F0EDE1) drop-shadow(0 -1px 0 #F0EDE1) drop-shadow(0 2px 0 #120D0B)'; g.drawImage(im, x0, ty - iw / 2, iw, iw); g.restore(); }   // Stiefel: das ist der Weg, keine Warnzahl
      g.textAlign = 'left'; g.lineWidth = Math.max(3, s * 0.07); g.lineJoin = 'round'; g.strokeStyle = '#120D0B'; g.strokeText(t, x0 + iw + 2, ty); g.fillStyle = '#F0EDE1'; g.fillText(t, x0 + iw + 2, ty); g.textAlign = 'center'; } }
}
// Erwarteter Freischlag beim Rückzug (Vorschau), z. B. „ · Freischlag −6“
function fbTxt(u) { const f = u ? E.freeBlows(G, u) : []; return f.length ? ` · Freischlag −${fmt(f.reduce((a, b) => a + b.lo, 0))} bis −${fmt(f.reduce((a, b) => a + b.hi, 0))}` : ''; }
// Gefahr auf einem Wegfeld für die Pfadvorschau: 'draht' | 'gas' | 'feuer' | 'mg' oder null
function pathHazard(u, c, r) {
  const T = TYPES[u.type], h = G.map[c] && G.map[c][r]; if (!h) return null;
  if (h.t === 'wire' && T.cls !== 'walker' && !E.wireProof(T)) return 'draht';
  if ((VIS.clouds || []).some(k => k.c === c && k.r === r) && !E.gasSafe(G, u)) return 'gas';
  if ((VIS.fires || []).some(k => k.c === c && k.r === r)) return 'feuer';
  if (T.cls !== 'walker' && E.openGround(G, c, r) && G.units.some(m => m.side !== u.side && E.active(m) && TYPES[m.type].mg && m.sperr > 0 && m.setup && !m.supp && E.dist(m.c, m.r, c, r) <= E.rangeOf(G, m, c, r) && E.hasLOS(G, m.c, m.r, c, r) && E.inFan(G, m, c, r))) return 'mg';
  return null;
}
// Schwebende Texte (Schadenszahlen, Meldungen). bb: neue Ansicht, stellt je Text den Aufsteller am Fußpunkt ein
function drawFloaters(g, s, bb) {
  for (let i = floaters.length - 1; i >= 0; i--) {
    const f = floaters[i]; f.life -= f.hold ? STEP : FS; f.y -= s * STEP * (f.hold ? (f.life > f.max - 30 ? 0.012 : 0.0015) : 0.012);
    if (f.life <= 0) { floaters.splice(i, 1); continue; }
    if (bb && !bb(f.x, f.y)) continue;
    g.globalAlpha = Math.min(1, f.life / 18);
    if (f.icon) {   // Symbol statt Text: kurz aufpoppen, dann langsam steigen
      const k = Math.min(1, (f.max - f.life) / 6), hh = s * (f.big ? 0.95 : 0.8) * (0.7 + 0.3 * k), ww = hh * f.icon.naturalWidth / f.icon.naturalHeight;
      g.save(); g.shadowColor = 'rgba(0,0,0,0.85)'; g.shadowBlur = s * 0.18; g.drawImage(f.icon, f.x - ww / 2, f.y - hh * 0.8, ww, hh); g.restore();
      if (f.sub) { g.font = `900 ${Math.round(s * 0.4)}px "Arm Text", system-ui, sans-serif`; g.textAlign = 'left'; g.lineWidth = Math.max(3, s * 0.1); g.strokeStyle = O; g.lineJoin = 'round';
        g.strokeText(f.sub, f.x + ww * 0.45, f.y - hh * 0.15); g.fillStyle = f.col; g.fillText(f.sub, f.x + ww * 0.45, f.y - hh * 0.15); g.textAlign = 'center'; }
      continue;
    }
    g.font = f.hold ? `400 ${Math.round(s * (f.big ? 0.27 : 0.22))}px "Arm Ziffer", "Arm Text", system-ui, sans-serif`   // Schadenszahlen (Paket 2): ≈60 %, kantige Ziffern, dunkler Rand
      : `900 ${Math.round(s * (f.big ? 0.26 : 0.22))}px "Arm Text", system-ui, sans-serif`;   // kurze Meldungen klein (Wunsch des Nutzers)
    if (f.hold) g.globalAlpha = Math.min(1, f.life / 10);   // kurz ausblenden
    g.lineWidth = Math.max(2.5, s * (f.hold ? 0.075 : 0.065)); g.strokeStyle = O; g.lineJoin = 'round'; g.strokeText(f.text, f.x, f.y);
    g.fillStyle = f.col; g.fillText(f.text, f.x, f.y);
  }
  g.globalAlpha = 1;
}

// ---------- Figuren der neuen Ansicht (Umbauplan Schritt 3) ----------
// Bilder aus src/figs.js (tools/figure_cut.py --game): 320 px Bildhöhe = 1 Soldatenhöhe (SH), Füße am unteren Rand, Blick nach rechts.
// Maßstab: 1 SH = FIG_SH Feldradien (Wunsch 2026-11-16: 1,1 – Felder groß genug, nichts überdimensioniert). Trupps: bis zu 4 Einzelfiguren in
// lockerer Formation im eigenen Feld, Verluste lassen Figuren wegfallen. Einzelmodelle (MG, Geschütz, Anführer) im selben Maßstab, höchstens
// FIGW_MAX Feldradien breit. Fahrzeuge (Panzer, Kolosse): 1,35 SH hoch, Breite nach Bild, dürfen etwas über den Feldrand ragen (belegen ein Feld).
const FIG_SH = 0.8, FIGW_MAX = 2.0, FIGW_VEH = 2.4;   // Wunsch 2026-11-16: Soldat 0,8; Fahrzeuge (1,5 SH) höchstens 2,4 Feldradien breit
// Spieleinheit → Bogen [Name, Trupp?, höchstens Figuren]. MG: aufgebaut „mg“, sonst „mg_marsch“ (siehe newFigs).
const ANZUG = { slots: [[-0.2, -0.06], [0.2, 0.2]] };   // Kampfanzug-Trupps: breit und groß, eng gestellt, damit nichts über den Feldrand ragt
const SANI = { sc: 0.92, slots: [[-0.18, -0.08], [0.16, 0.22]] };   // Sanitäter eng beieinander: Lauf- und Trage-Posen sind breit und ragten sonst aus dem Feld
const FIGMAP = {
  kohorte: ['soldat', 1], scharf: ['scharfschuetze', 1, 2], reiter: ['reiter', 1, 2, { sc: 0.85, slots: [[-0.22, 0.04], [0.2, 0.3]] }], lanzeD: ['reiter', 1, 2, { sc: 0.85, slots: [[-0.22, 0.04], [0.2, 0.3]] }], sturmpz: ['panzer'], flammen: ['flammen', 1],   // Reiter: 2 von 3 Posen, eng und auf 85 % (bleiben im eigenen Feld), Flammentrupp 4 Posen
  brand: ['flammen', 1], raeumer: ['sturm', 1],
  pionier: ['pionier', 1], mineur: ['mineur', 1, 2],
  mahlwerk: ['mg'], haubitze: ['geschuetz'], feldkanone: ['feldkanone'], koloss: ['koloss'], hauptA: ['hauptmann'], generalA: ['general'],
  grenadier: ['soldat', 1], sturm: ['sturm', 1], eingreif: ['eingreif', 1],
  pionierD: ['pionier', 1],
  feldscher: ['sanitaeter', 1, 2, SANI], heiler: ['sanitaeter', 1, 2, SANI], pirsch: ['pirschjaeger', 1, 2, { slots: [[-0.2, -0.06], [0.18, 0.24]] }], moerser: ['moerser'], minenwerfer: ['minenwerfer'], rauch: ['rauchwerfer'], buechse: ['panzerbuechse'],   // neue Bögen 2026-11-16
  stahl: ['stahl', 1, 2, ANZUG], panzerk: ['panzerknecht', 1, 2, ANZUG],   // Kampfanzüge: 2 Figuren, 1,25 SH, eng im Feld
  ballon: ['ballon'], signal: ['signal', 1, 2], fernsprech: ['fernsprech', 1, 2], werkstatt: ['versorgung', 1, 2], munition: ['versorgung', 1, 2], gasschutz: ['gasschutz', 1, 2],   // neue Bögen 2026-11-17   // Fesselballon: Winde im Feld, Ballon eigens darüber (drawBallon)
  schildwall: ['schildwall', 1], schwer: ['schwer', 1], melder: ['melder', 1, 1, { sc: 0.9, slots: [[0, 0.15]] }], banner: ['banner', 1, 2, { slots: [[-0.25, 0.02], [0.22, 0.28]] }],
  sense: ['mg'], geschuetz: ['geschuetz'], hauptD: ['hauptmann'], generalD: ['general'], bohrer: ['bohrkoloss'],
  turm: ['turmschreiter'], orden: ['ordensschreiter'], kreuz: ['kreuzschreiter'], knecht: ['eisenknecht'], saeger: ['saegeschreiter'], klaue: ['klauenschreiter'],   // Schreiter 2026-11-17: Einzelmodelle knapp 2 SH, Schatten wie Fahrzeuge (deep)
};
// Farbstimmung der Kettenfahrzeuge an die Umgebung; der neue Landkoloss (Dreiviertelansicht, 2026-11-17) nur leicht gedämpft, damit das Rot kräftig bleibt
const KETTE_FILTER = { konkordat_koloss: 'brightness(0.95) contrast(1.03) saturate(0.97)' };
const SCHREITER = ['turmschreiter', 'ordensschreiter', 'kreuzschreiter', 'eisenknecht', 'saegeschreiter', 'klauenschreiter'];
const FIG_SLOTS4 = [[-0.36, -0.26], [0.3, -0.34], [-0.24, 0.3], [0.36, 0.22]];   // Feldradien (x, y), y > 0 = vorn; Füße sicher im eigenen Feld
const FIGI = {};
function figImg(key) {
  if (key in FIGI) return FIGI[key] && FIGI[key].complete && FIGI[key].naturalWidth ? FIGI[key] : null;
  const src = window.FIGS && window.FIGS[key]; if (!src) { FIGI[key] = null; return null; }
  const im = new Image(); im.src = src; FIGI[key] = im; return null;
}
function newFigs(u, d) {
  const m = FIGMAP[u.type]; if (!m || fac(u.side) === 'F') return null;   // Blaue Legion: noch keine neuen Bögen
  const pre = u.side === 'A' ? 'konkordat_' : 'aschenwacht_';
  let sheet = m[0]; if (sheet === 'mg' && !(d.vs && d.vs.setup)) sheet = 'mg_marsch';
  if (sheet === 'geschuetz' && ((d.vs && d.vs.limbered) || d.moving) && window.FIGS && window.FIGS[pre + 'geschuetz_marsch']) sheet = 'geschuetz_marsch';   // aufgeprotzt oder beim Ziehen: Pferdegespann
  const keys = m[1] ? [1, 2, 3, 4].map(i => pre + sheet + '_' + i).filter(k => window.FIGS && window.FIGS[k]) : [pre + sheet];   // Trupp-Bögen mit 3 oder 4 Posen
  const ims = keys.map(figImg); if (!ims.length || ims.some(im => !im)) return null;   // noch nicht geladen: diesmal altes Bild
  return { key: keys[0], ims, trupp: !!m[1], max: m[2] || 4, sc: (m[3] && m[3].sc) || 1, slots: m[3] && m[3].slots, vehicle: ['koloss', 'panzer', 'bohrkoloss', 'geschuetz_marsch'].includes(sheet), kette: ['koloss', 'panzer', 'bohrkoloss'].includes(sheet), deep: ['koloss', 'panzer', 'bohrkoloss', 'geschuetz_marsch', 'mg', 'mg_marsch', 'geschuetz', 'moerser', 'minenwerfer', 'rauchwerfer', 'panzerbuechse', 'ballon', 'feldkanone', ...SCHREITER].includes(sheet) };   // Gespann wie Fahrzeug verankert (Hufe/Räder auf dem Boden)
}
// Fahrzeuge (Dreiviertelansicht): Unterkante der Ketten je Bildspalte aus dem Bild messen (einmal je Bild).
// pts = Unterkante als Anteile von Breite/Höhe, mid = mittlere Höhe der Unterkante (liegt auf dem Feldboden).
const VEH_ENV = new Map();
// Ketten leicht eingesunken: unterer Rand (entlang der gemessenen Unterkante) mit dunklem Schlamm überzogen, je Bild zwischengespeichert
const SCHLAMM = new Map();
function schlammrand(im, env) {
  if (SCHLAMM.has(im)) return SCHLAMM.get(im);
  const W = im.naturalWidth, H = im.naturalHeight, c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
  x.drawImage(im, 0, 0); x.globalCompositeOperation = 'source-atop';
  const pts = env ? env.pts : [[0, 1], [1, 1]], band = H * 0.14;
  for (let i = 0; i < pts.length; i++) {   // je Spalte: Verlauf von der Unterkante nach oben
    const px = pts[i][0] * W, py = pts[i][1] * H, wd = W / Math.max(1, pts.length - 1) + 2;
    const gd = x.createLinearGradient(0, py - band, 0, py); gd.addColorStop(0, 'rgba(40,29,19,0)'); gd.addColorStop(0.55, 'rgba(40,29,19,0.55)'); gd.addColorStop(1, 'rgba(30,22,14,0.9)');
    x.fillStyle = gd; x.fillRect(px - wd / 2, py - band, wd, band + 2);
  }
  SCHLAMM.set(im, c); return c;
}
function vehEnv(im) {
  if (VEH_ENV.has(im)) return VEH_ENV.get(im);
  const W = im.naturalWidth, H = im.naturalHeight, c = document.createElement('canvas'); c.width = W; c.height = H;
  const cx = c.getContext('2d', { willReadFrequently: true }); cx.drawImage(im, 0, 0);
  let data; try { data = cx.getImageData(0, 0, W, H).data; } catch (e) { VEH_ENV.set(im, null); return null; }
  const pts = [], step = Math.max(1, Math.round(W / 60));
  for (let x = 0; x < W; x += step) { for (let y = H - 1; y >= 0; y--) if (data[(y * W + x) * 4 + 3] > 120) { pts.push([x / W, (y + 1) / H]); break; } }
  const env = pts.length ? { pts, mid: pts.reduce((n, q) => n + q[1], 0) / pts.length } : null;
  VEH_ENV.set(im, env); return env;
}
// Fesselballon: Ballon mit Korb kleiner und deutlich höher über der Winde, Halteseil von der Seiltrommel zum Korb, leichtes Schwanken
function drawBallon(g, s, u, x, top, w, h, flip, filt) {
  const im = figImg((u.side === 'A' ? 'konkordat_' : 'aschenwacht_') + 'ballon_luft'); if (!im) return;
  const k = 0.7, bh = im.naturalHeight / 320 * FIG_SH * s * k, bw = bh * im.naturalWidth / im.naturalHeight, sw = Math.sin(now / 1100 + u.id) * s * 0.04;
  const sx = v => flip ? x + w / 2 - v * w : x - w / 2 + v * w;
  const ax = sx(0.3), ay = top + h * 0.22;   // Seiltrommel der Winde
  const bx = ax + (flip ? 1 : -1) * s * 0.15 + sw, by = top - s * 1.1 + Math.sin(now / 900 + u.id) * s * 0.03;   // Korbunterkante über dem Feld
  g.save(); g.strokeStyle = 'rgba(30,24,16,0.9)'; g.lineWidth = Math.max(1, s * 0.018); g.beginPath(); g.moveTo(ax, ay); g.quadraticCurveTo((ax + bx) / 2 + s * 0.06, (ay + by) / 2, bx, by); g.stroke();
  if (filt) g.filter = filt; g.translate(bx, by); if (flip) g.scale(-1, 1); g.drawImage(im, -bw * 0.53, -bh, bw, bh); g.restore(); g.filter = 'none';
}
function drawNewFigs(g, u, d, nf, x, y, flip, A0, done) {
  if (VIEW.figFade) A0 *= 1 - 0.35 * VIEW.figFade;   // Strategie-Marken eingeblendet: Figuren treten zurück
  const s = L.s, k = kAt(x, y), duck = d.vs.supp > 0 ? s * 0.08 : 0, list = [];
  const pl = VIEW.tilt() ? gbPlatz(u, d) : null, [pcx, pcy] = pl ? center(u.c, u.r) : [0, 0];   // Gelände-Bausteine: Graben (Linie, abgesenkt), Ruine (gestaucht)
  if (nf.trupp) {
    const n = Math.max(1, Math.min(nf.max, Math.ceil(d.str / (10 / nf.max) - 0.001)));
    for (let i = 0; i < n; i++) {
      if (pl && pl.pts) { const q = pl.pts[[1, 2, 0, 3][i]]; list.push({ im: nf.ims[(u.id * 3 + i) % nf.ims.length], ox: (q[0] - pcx) / s, oy: (q[1] - pcy) / s, abs: true }); continue; }
      const slot = nf.slots ? nf.slots[(i + u.id) % nf.slots.length] : FIG_SLOTS4[(i + u.id) % 4]; list.push({ im: nf.ims[(u.id * 3 + i) % nf.ims.length], ox: slot[0], oy: slot[1] * (pl && pl.sy || 1) });
    }
  } else list.push({ im: nf.ims[0], ox: 0, oy: nf.vehicle ? 0.22 : 0.15 });
  const sink = (pl && pl.sink && !nf.vehicle ? pl.sink * FIG_SH * s : 0) + (nf.vehicle && d.vs && (d.vs.broken || d.vs.stuck) ? s * 0.16 : 0);   // im Graben tiefer; Fahrzeug festgefahren: Ketten im Schlamm eingesunken (Paket 8)
  list.sort((a, b) => a.oy - b.oy);
  const hx = G.map[u.c] && G.map[u.c][u.r], dim = hx && DIM_T.has(hx.t) && !d.lunge;
  let topY = y - s;
  if (nf.deep) {   // Einzelmodelle mit Tiefe (MG, Geschütz, Gespann, Panzer): mittlere Unterkante auf den Feldboden, Schatten über die ganze Grundfläche
    const im = list[0].im, env = vehEnv(im);
    let h = im.naturalHeight / 320 * FIG_SH * s, w = h * im.naturalWidth / im.naturalHeight;
    const wmax = (nf.vehicle ? FIGW_VEH : FIGW_MAX) * s; if (w > wmax) { h *= wmax / w; w = wmax; }
    const fy = y + (nf.vehicle ? 0.3 : 0.17) * s * k + s * 0.03, top = fy - (env ? env.mid : 1) * h,   // etwas Richtung Betrachter und minimal tiefer: nichts hängt in der Luft
      sx = v => flip ? x + w / 2 - v * w : x - w / 2 + v * w;
    g.filter = 'none'; g.globalAlpha = A0;
    if (env) {
      // Grundfläche: Aufstandspunkte = Unterkante im unteren Bildteil (überhängende Rohre und Arme zählen nicht)
      const ymax = Math.max(...env.pts.map(q => q[1])), lows = env.pts.filter(q => q[1] > ymax - 0.42);
      const xs = lows.map(q => q[0]), ys = lows.map(q => q[1]);
      const x0 = sx(Math.min(...xs)), x1 = sx(Math.max(...xs)), yA = top + Math.min(...ys) * h, yB = top + ymax * h;
      const cx = (x0 + x1) / 2, cy = (yA + yB) / 2 + s * 0.02, rx = Math.abs(x1 - x0) / 2 + s * 0.12, ry = Math.max((yB - yA) / 2 + s * 0.06 * k, s * 0.14 * k);
      if (nf.kette) {   // Kettenfahrzeuge: Schatten direkt unter den Ketten – dunkles Band entlang der gemessenen Unterkante, kaum darunter hinaus (2026-11-16)
        const ym = top + lows.reduce((n, q) => n + q[1], 0) / lows.length * h;
        g.save(); g.translate(cx, ym - s * 0.03); g.scale(1, Math.max(0.2, (yB - yA) / 2 + s * 0.03) / (Math.abs(x1 - x0) / 2 + s * 0.04));
        const gr = g.createRadialGradient(0, 0, 0, 0, 0, Math.abs(x1 - x0) / 2 + s * 0.04); gr.addColorStop(0, 'rgba(6,4,3,0.6)'); gr.addColorStop(0.7, 'rgba(6,4,3,0.4)'); gr.addColorStop(1, 'rgba(6,4,3,0)');
        g.fillStyle = gr; g.beginPath(); g.arc(0, 0, Math.abs(x1 - x0) / 2 + s * 0.04, 0, 7); g.fill(); g.restore();
        const lp = [...lows].sort((p, q) => p[0] - q[0]);
        g.save(); g.filter = `blur(${Math.max(1, s * 0.022)}px)`; g.fillStyle = 'rgba(4,3,2,0.85)'; g.beginPath();
        lp.forEach((q, i) => g[i ? 'lineTo' : 'moveTo'](sx(q[0]), top + q[1] * h + s * 0.012));
        for (let i = lp.length - 1; i >= 0; i--) g.lineTo(sx(lp[i][0]), top + lp[i][1] * h - s * 0.13);
        g.closePath(); g.fill(); g.restore();
      } else {
      // breite flache Ellipse von vorn bis hinten, weich auslaufend
      g.save(); g.translate(cx, cy); g.scale(1, ry / rx);
      const ka = nf.kette ? 1.45 : 1, gr = g.createRadialGradient(0, 0, 0, 0, 0, rx * (nf.kette ? 1.12 : 1)); gr.addColorStop(0, `rgba(6,4,3,${0.55 * ka})`); gr.addColorStop(0.65, `rgba(6,4,3,${0.32 * ka})`); gr.addColorStop(1, 'rgba(6,4,3,0)');
      g.fillStyle = gr; g.beginPath(); g.arc(0, 0, rx * (nf.kette ? 1.12 : 1), 0, 7); g.fill(); g.restore();
      // kleine Kontaktflecken unter jedem Aufstandspunkt (Füße, Räder, Ketten), auch weiter hinten
      g.fillStyle = nf.kette ? 'rgba(4,3,2,0.78)' : 'rgba(4,3,2,0.5)';
      for (let n = 0; n < lows.length; n++) { const q = lows[n], a = lows[n - 2], b = lows[n + 2];
        if ((a && a[1] > q[1]) || (b && b[1] > q[1])) continue;   // nur örtlich tiefste Punkte
        const ry2 = s * 0.045 * Math.max(0.6, k); g.beginPath(); g.ellipse(sx(q[0]), top + q[1] * h - ry2 * 0.4, s * 0.13, ry2, 0, 0, 7); g.fill(); }   // Mitte leicht über dem Aufstandspunkt: nichts ragt nach unten heraus
      }
    } else {
      g.fillStyle = 'rgba(6,4,3,0.45)'; g.beginPath(); g.ellipse(x, fy, w * 0.45, s * 0.15 * k, 0, 0, 7); g.fill();
    }
    const filt = [nf.kette ? (KETTE_FILTER[nf.key] || 'brightness(0.84) contrast(0.92) saturate(0.8) sepia(0.1)') : '', done ? 'grayscale(0.75) brightness(0.8)' : '', dim ? 'brightness(0.8)' : ''].filter(Boolean).join(' ');   // Panzer: Farbstimmung der Umgebung
    if (done) g.globalAlpha = A0 * 0.85; if (filt) g.filter = filt;
    g.save(); if (sink) { g.beginPath(); g.rect(x - w, top - h, w * 2, fy - top + h + sink * 0.2); g.clip(); }
    g.translate(x, top + sink * 0.8); if (flip) g.scale(-1, 1); g.drawImage(nf.kette ? schlammrand(im, env) : im, -w / 2, 0, w, h); g.restore();
    d.fbx = [[x - w / 2 - d.x, top + sink * 0.8 - d.y, w, h, flip]];
    { const mz = MUZ[nf.key]; if (mz) d.muz = [(flip ? -1 : 1) * (mz[0] - 0.5) * w + x - d.x, top + sink * 0.8 + mz[1] * h - d.y, flip]; }   // Laufmündung (neue Ansicht)
    g.filter = 'none';
    if (u.type === 'ballon') drawBallon(g, s, u, x, top, w, h, flip, filt);
    return top;
  }
  for (const f of list) {
    const fx = x + (f.abs ? f.ox : flip ? -f.ox : f.ox) * s, fy = y + f.oy * s * k + duck;
    let h = f.im.naturalHeight / 320 * FIG_SH * s * nf.sc, w = h * f.im.naturalWidth / f.im.naturalHeight;
    const wmax = (nf.vehicle ? FIGW_VEH : FIGW_MAX) * s * nf.sc; if (w > wmax) { h *= wmax / w; w = wmax; }
    // Bodenschatten
    g.filter = 'none'; g.globalAlpha = A0;
    // Kontaktschatten: weicher dunkler Fleck direkt unter den Füßen (verankert die Figur am Boden), darin ein kleiner kräftiger Kern
    const sw = Math.min(w * (nf.vehicle ? 0.5 : 0.36), s * (nf.vehicle ? 1.35 : 0.34)), sk = sw * 0.34 * Math.max(0.55, k);
    if (!sink) { g.save(); g.translate(fx, fy); g.scale(1, sk / sw);
    const sg = g.createRadialGradient(0, 0, 0, 0, 0, sw); sg.addColorStop(0, 'rgba(6,4,3,0.72)'); sg.addColorStop(0.5, 'rgba(6,4,3,0.42)'); sg.addColorStop(1, 'rgba(6,4,3,0)');
    g.fillStyle = sg; g.beginPath(); g.arc(0, 0, sw, 0, 7); g.fill(); g.restore();
    g.fillStyle = 'rgba(4,3,2,0.55)'; g.beginPath(); g.ellipse(fx, fy, sw * 0.45, sk * 0.42, 0, 0, 7); g.fill(); }
    const back = nf.trupp && f.oy < -0.1;
    const filt = [done ? 'grayscale(0.75) brightness(0.8)' : '', dim ? 'brightness(0.8)' : '', back ? 'brightness(0.86)' : ''].filter(Boolean).join(' ');
    if (done) g.globalAlpha = A0 * 0.85;
    if (filt) g.filter = filt;
    const zeichne = (tf, al, fl) => { g.save(); if (tf) { g.setTransform(tf); g.globalAlpha = al; g.filter = fl || 'none'; }
      if (f.abs && pl && pl.cut && window.GBau) {   // im Graben: unterer Teil bis etwa zur Hüfte weg, weich in die dunkle Sohle ausgeblendet – unabhängig von der Grabenrichtung
        const e = GBau.eingesunken(f.im, pl.cut), hh = h * e.frac; g.translate(fx, fy); if (flip) g.scale(-1, 1); g.drawImage(e.cv, -w * 0.5, -hh + h * 0.02, w, hh);
      } else {
        if (sink) { g.beginPath(); g.rect(fx - w, fy - h * 2, w * 2, h * 2 + sink * 0.25); g.clip(); }
        g.translate(fx, fy + h * 0.012 + sink); if (flip) g.scale(-1, 1); g.drawImage(f.im, -w * 0.5, -h, w, h);   // Sohlen minimal in den Boden: kein Spalt
      }
      g.restore(); };
    if (d.fbx) d.fbx.push([fx - w / 2 - d.x, fy - h - d.y + sink, w, h, flip]);
    if (FIGQ && f.abs) { const tf = g.getTransform(), al = g.globalAlpha, fl = filt; FIGQ.push({ y: y + f.oy * s, f: () => zeichne(tf, al, fl) }); }   // Graben: später nach Tiefe
    else zeichne();
    topY = Math.min(topY, fy - h);
  }
  g.filter = 'none';
  return topY;
}

// ---------- Neue Ansicht (Test): gekippte Karte, Schritt 1 Kamera und Boden ----------
// Schalter OPT.tilt („Neue Ansicht (Test)“). Alles Bisherige rechnet weiter in einem flachen Weltbild (K = 1, Feldradius WS):
// center(), d.x/d.y, Hilfsmarkierungen und Effekte. Das Weltbild wird zeilenweise perspektivisch auf den Schirm projiziert
// (wie im Probebild entwurf/probe/?v=D). Einheiten stehen als aufrechte Aufsteller an ihrem Fußpunkt, nach Tiefe sortiert.
// Kamera: Ziel (CAM.x, CAM.y) auf dem Boden, Zoom CAM.z (1 = vorn ca. 8,5 Felder über die Bildbreite), Kippwinkel 39°,
// beim Herauszoomen steiler (bis 58° bei „ganze Karte“). Oben dunkler Himmel mit Rauch statt Leere.
// Noch nicht hier (Umbauplan): Hilfsmarkierungen/Effekte aufrecht (Schritt 2), Figurengröße 1,3 und Trupps (3), Aufsteller fürs Gelände (4).
const WS = 100;   // Feldradius im Weltbild (Pixel); vorn wird leicht vergrößert, weiter hinten verkleinert
const CAM = { x: 0, y: 0, z: 1, init: false };
const WCV = document.createElement('canvas'), WCTX = WCV.getContext('2d');
const UBOX = [];   // Kästen der gezeichneten Einheiten auf dem Schirm (Klicktreffer)
let PJ = null;
const camPitch = z => { const t = Math.max(0, Math.min(1, (1 - z) / Math.max(0.05, 1 - ZFIT))); return (39 + (58 - 39) * t) * Math.PI / 180; };
function camSetup() {   // Projektionswerte aus CAM und Schirmgröße
  const W = cv.width, H = cv.height, a = camPitch(CAM.z), ca = Math.cos(a), sa = Math.sin(a), R = 23 * L.s;
  const F = W * R / ((8.5 / CAM.z) * 1.5 * L.s);
  PJ = { W, H, F, R, C: [CAM.x, CAM.y + R * ca, R * sa], f: [-ca, -sa], u: [-sa, ca] };   // f/u: Blickrichtung und Oben (nur y- und z-Anteil)
}
function proj(wx, wy, wz = 0) {   // Weltbild → Schirm [x, y, Tiefe]
  const P = PJ, dx = wx - P.C[0], dy = wy - P.C[1], dz = wz - P.C[2], zc = dy * P.f[0] + dz * P.f[1];
  return [P.W / 2 + P.F * dx / zc, P.H / 2 - P.F * (dy * P.u[0] + dz * P.u[1]) / zc, zc];
}
function unproj(sx, sy) {   // Schirm → Bodenpunkt im Weltbild (Strahl trifft z = 0)
  const P = PJ, k = -(sy - P.H / 2) / P.F, dy = P.f[0] + k * P.u[0], dz = P.f[1] + k * P.u[1];
  if (dz >= -1e-6) return null;
  const t = -P.C[2] / dz; return [P.C[0] + (sx - P.W / 2) * t / P.F, P.C[1] + t * dy];
}
function bbAt(wx, wy) {   // Aufsteller am Bodenpunkt: Schirmpunkt, Maßstab, Bodenverkürzung
  const p = proj(wx, wy); if (p[2] <= 1) return null;
  const sc = PJ.F / p[2], q = proj(wx, wy + 1); return { px: p[0], py: p[1], sc, k: (q[1] - p[1]) / sc };
}
function camClamp() {   // nicht über den Kartenrand hinaus: unten und seitlich kein leerer Bereich (oben darf Himmel sein)
  if (!L || !cv.width) return;
  for (let it = 0; it < 3; it++) {
    camSetup();
    const bl = unproj(0, PJ.H), br = unproj(PJ.W, PJ.H);   // unterste Bildzeile = breiteste Stelle des sichtbaren Bodens
    if (!bl || !br) break;
    const half = (br[0] - bl[0]) / 2;
    CAM.x = half * 2 >= L.W ? L.W / 2 : Math.max(half, Math.min(L.W - half, CAM.x));
    if (bl[1] > L.H) CAM.y -= bl[1] - L.H;   // unterer Kartenrand nicht über die unterste Bildzeile hinaus
    CAM.y = Math.max(L.top, CAM.y);
  }
}
function layoutTilt() {
  const wrap = board.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  board.classList.add('tilt');
  K = 1; const s = WS, top = s * 1.55, H = Math.ceil(top + s * SQ3 * (ROWS + 0.5) + s * 0.45);
  L = { dpr, s, top, W: Math.round(s * (1.5 * COLS + 0.5)), H };
  WCV.width = L.W; WCV.height = L.H;
  cv.width = Math.round(wrap.width * dpr); cv.height = Math.round(wrap.height * dpr);
  cv.style.width = wrap.width + 'px'; cv.style.height = wrap.height + 'px'; cv.style.marginLeft = cv.style.marginTop = '0px';
  renderTerrain();
  // „Ganze Karte“: größter Zoom, bei dem alle vier Kartenecken mit Rand ins Bild passen (Ziel = Kartenmitte)
  const sv = { ...CAM }; CAM.x = L.W / 2; CAM.y = (L.top + L.H) / 2;
  let lo = 0.08, hi = 1;
  const fits = z => { CAM.z = z; camSetup(); return [[0, L.top], [L.W, L.top], [0, L.H], [L.W, L.H]].every(([x, y]) => { const p = proj(x, y); return p[2] > 0 && p[0] >= -2 && p[0] <= PJ.W + 2 && p[1] >= PJ.H * 0.04 && p[1] <= PJ.H + 2; }); };
  ZFIT = 1; if (!fits(1)) { for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (fits(m)) lo = m; else hi = m; } ZFIT = lo; }
  Object.assign(CAM, sv);
  if (!CAM.init) { CAM.init = true; CAM.x = L.W / 2; CAM.y = L.top + (L.H - L.top) * 0.6; CAM.z = 1; }
  if (zoomFit) { CAM.z = ZFIT; CAM.x = L.W / 2; CAM.y = (L.top + L.H) / 2; }
  CAM.z = Math.max(ZFIT, Math.min(Z_MAX, CAM.z)); ZOOM = CAM.z; camClamp(); camSetup();
}
// Boden projizieren: jede Schirmzeile ist eine Tiefe auf dem Boden; darüber dunkler Himmel mit Rauch
function projectGround(g) {
  const P = PJ, W = P.W, H = P.H;
  const sky = g.createLinearGradient(0, 0, 0, H * 0.55); sky.addColorStop(0, '#0d0907'); sky.addColorStop(0.6, '#241a14'); sky.addColorStop(1, '#3a2a1e');
  g.fillStyle = sky; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 6; i++) {   // Rauchschwaden am Horizont, langsam ziehend
    const x = ((now / (60 + i * 14) + i * W * 0.31) % (W * 1.6)) - W * 0.3, y = H * (0.08 + 0.05 * (i % 3)), r = W * (0.18 + 0.04 * (i % 2));
    const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(70,58,48,0.35)'); gr.addColorStop(1, 'rgba(70,58,48,0)');
    g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2);
  }
  const y0 = L.top - L.s * 0.4;
  for (let ys = 0; ys < H; ys++) {
    const w = unproj(W / 2, ys + 0.5); if (!w) continue;
    const wy = w[1]; if (wy < y0 || wy > L.H) continue;
    const zc = (wy - P.C[1]) * P.f[0] + (0 - P.C[2]) * P.f[1], sw = W * zc / P.F;
    g.drawImage(WCV, P.C[0] - sw / 2, wy, sw, 1, 0, ys, W, 1);
  }
  // Dunst nach hinten
  const fog = g.createLinearGradient(0, 0, 0, H); fog.addColorStop(0, 'rgba(18,13,11,0.55)'); fog.addColorStop(0.4, 'rgba(18,13,11,0.12)'); fog.addColorStop(1, 'rgba(18,13,11,0)');
  g.fillStyle = fog; g.fillRect(0, 0, W, H);
}
function drawTilt() {
  camSetup();
  const s = L.s;
  WCTX.setTransform(1, 0, 0, 1, 0, 0);
  ctx = WCTX;   // flaches Weltbild: nur Boden und Bodenmarkierungen; alles Aufrechte kommt danach auf den Schirm
  try { drawGround(WCTX, s); drawDiaryMark(WCTX); }
  finally { ctx = MAINCTX; }
  const g = MAINCTX; g.setTransform(1, 0, 0, 1, 0, 0);
  projectGround(g);
  // Aufrecht verankern: Element am Punkt (x, y) steht als Aufsteller dort (Maßstab und Bodenverkürzung der Tiefe)
  const up = (x, y) => { const b = bbAt(x, y); if (!b) return false; g.setTransform(b.sc, 0, 0, b.sc, b.px - b.sc * x, b.py - b.sc * y); VIEW.bbK = b.k; return true; };
  const flagsTief = GBW && gbAn();   // mit Gelände-Bausteinen: Zielflaggen nach Tiefe zwischen Grabenwände und Figuren einsortiert
  if (!flagsTief) { drawFlags(g, s, up); g.setTransform(1, 0, 0, 1, 0, 0); VIEW.bbK = null; }
  // Einheiten als Aufsteller am Fußpunkt; Marken und spätere Marken (MARKQ) behalten ihren Aufsteller
  UBOX.length = 0;
  const ul = unitList(), GP = GBW && gbAn() ? GBW.pieces : null, PEND = []; let gpi = 0;
  if (flagsTief) { for (const o of OBJECTIVES) PEND.push({ y: center(o.c, o.r)[1] + s * fahneOrt(o)[2], f: () => { drawFlags(g, s, up, o); g.setTransform(1, 0, 0, 1, 0, 0); VIEW.bbK = null; } }); PEND.sort((a, b) => a.y - b.y); }
  if (GP) GBW.setView({ g, proj, F: PJ.F, U: cv.width / 1920, units: ul.map(([, , d]) => [d.x, d.y]) });
  // Geländeteile und einzeln gezeichnete Grabenfiguren (PEND) bis zur Tiefe y, beide nach Tiefe gemischt
  const gbBis = y => { for (;;) { const a = GP && gpi < GP.length ? GP[gpi].y : Infinity, b = PEND.length ? PEND[0].y : Infinity, m = Math.min(a, b); if (m > y || m === Infinity) break;
    g.setTransform(1, 0, 0, 1, 0, 0); if (b <= a) PEND.shift().f(); else GP[gpi++].f(); } };
  for (const [, u, d] of ul) {
    const tief = GP && TYPES[u.type] && gbPlatz(u, d);   // Trupp im Graben: Figuren werden einzeln einsortiert (hintere Wand → Figur → vordere Wand)
    gbBis(tief && tief.pts ? d.y - L.s * 0.75 : d.y);
    FIGQ = tief && tief.pts ? [] : null;
    const bb = bbAt(d.x, d.y); if (!bb || bb.px < -PJ.W * 0.2 || bb.px > PJ.W * 1.2 || bb.py < -PJ.H * 0.2 || bb.py > PJ.H * 1.5) continue;
    const tf = new DOMMatrix([bb.sc, 0, 0, bb.sc, bb.px - bb.sc * d.x, bb.py - bb.sc * d.y]);
    g.setTransform(tf); VIEW.bbK = bb.k;
    const n0 = MARKQ.length, m0 = MARKS.length;
    const shPx = FIG_SH * s * bb.sc / L.dpr, fade = marksAll() ? 1 : Math.max(0, Math.min(1, (46 - shPx) / 14));   // Soldat unter ca. 40 px: Marke statt Figur
    if (fade > 0) SMARK.push({ u, d, bb, fade }); VIEW.figFade = fade;
    drawUnit(u, d); VIEW.figFade = 0;
    if (FIGQ) { for (const it of FIGQ) { let i = 0; while (i < PEND.length && PEND[i].y <= it.y) i++; PEND.splice(i, 0, it); } FIGQ = null; }
    for (let i = m0; i < MARKS.length; i++) MARKS[i].tf = tf;
    for (let i = n0; i < MARKQ.length; i++) { const fn = MARKQ[i], k = bb.k; MARKQ[i] = () => { g.setTransform(tf); VIEW.bbK = k; const m1 = MARKS.length; fn(); for (let j = m1; j < MARKS.length; j++) MARKS[j].tf = tf; }; }
    const big = TYPES[u.type].cls === 'walker' ? 1.5 : 1;
    UBOX.push({ u, x0: bb.px - bb.sc * s * 0.75 * big, x1: bb.px + bb.sc * s * 0.75 * big, y0: bb.py - bb.sc * s * FIG_SH * 1.1, y1: bb.py + bb.sc * s * 0.45 });
  }
  gbBis(Infinity); g.setTransform(1, 0, 0, 1, 0, 0); VIEW.bbK = null;
  VIEW.up = up;
  MARK_AFTER = true;   // Klammern, Symbole, Vorschau, Warndreieck, Schilde: aufrecht an ihrem Punkt
  try { for (const f of MARKQ) f(); MARKQ.length = 0; g.setTransform(1, 0, 0, 1, 0, 0); drawAir(g, s, up); }
  finally { VIEW.up = null; g.setTransform(1, 0, 0, 1, 0, 0); VIEW.bbK = null; }
  // Schwebende Texte aufrecht am jeweiligen Punkt
  drawFloaters(g, s, (x, y) => { const b = bbAt(x, y); if (!b) return false; g.setTransform(b.sc, 0, 0, b.sc, b.px - b.sc * x, b.py - b.sc * y); return true; });
  g.setTransform(1, 0, 0, 1, 0, 0);
  drawStratMarks(g); SMARK.length = 0;
}
// ---------- Strategie-Marken (neue Ansicht, herausgezoomt) ----------
// Wird ein Soldat kleiner als ca. 40 px, erscheint über jeder Einheit ein Schild in Fraktionsfarbe mit dem Symbol der Einheitenart
// und einem schmalen Lebensbalken, in fester Bildschirmgröße, weich eingeblendet. Eigene Einheiten, die noch handeln können: Messingrand.
// Mit „Alle Marken“ (Knopf bzw. Alt gedrückt) auch nah. Anklickbar wie die Einheit (UBOX), Name unter Maus/Finger.
const SMARK = []; let MARK_AFTER = false;
function stratSym(u) {
  const T = TYPES[u.type];
  const k = T.cmd ? 'fahne' : T.cls === 'walker' ? 'zahnrad' : T.cls === 'mg' ? 'mg_dreibein' : T.cls === 'art' ? (T.mobile ? 'granate_artillerie' : 'lafette')
    : T.cls === 'cav' ? 'pferd' : T.cls === 'medic' ? 'sanitaeter' : T.flame ? 'flamme' : (T.sapper || T.wirelayer) ? 'spitzhacke' : (T.relay || T.spot) ? 'fernglas'
    : T.cls === 'storm' ? 'handgranate' : 'gewehr';
  return UPI['s_' + k] || UPI.s_gewehr;
}
function drawStratMarks(g) {
  if (!SMARK.length) return;
  const dpr = L.dpr, S = 38 * dpr, own = human(G.side);
  for (const { u, d, bb, fade } of SMARK) {
    const T = TYPES[u.type], hFig = FIG_SH * L.s * bb.sc * (T.cls === 'walker' ? 1.5 : 1);
    const cx = bb.px, cy = Math.max(S * 0.7, bb.py - hFig * (0.55 + 0.45 * fade) - S * 0.55);   // über der Einheit, beim Herauszoomen näher an den Fuß
    const col = FIG.PAL[u.side] ? FIG.PAL[u.side].accent : '#8a8070', act = own && u.side === G.side && E.active(u) && !spent.has(u.id);
    g.save(); g.globalAlpha = fade * d.alpha;
    // Schild: oben gerade, unten spitz
    const w = S * 0.86, h = S, x0 = cx - w / 2, y0 = cy - h / 2;
    const shield = () => { g.beginPath(); g.moveTo(x0, y0); g.lineTo(x0 + w, y0); g.lineTo(x0 + w, y0 + h * 0.55); g.quadraticCurveTo(x0 + w, y0 + h * 0.85, cx, y0 + h); g.quadraticCurveTo(x0, y0 + h * 0.85, x0, y0 + h * 0.55); g.closePath(); };
    g.shadowColor = 'rgba(0,0,0,0.55)'; g.shadowBlur = 4 * dpr; g.shadowOffsetY = 1.5 * dpr;
    shield(); g.fillStyle = col; g.fill(); g.shadowColor = 'transparent';
    const gr = g.createLinearGradient(0, y0, 0, y0 + h); gr.addColorStop(0, 'rgba(255,240,210,0.18)'); gr.addColorStop(1, 'rgba(0,0,0,0.25)'); g.fillStyle = gr; g.fill();
    g.lineWidth = 2 * dpr; g.strokeStyle = '#120D0B'; g.stroke();
    if (act) { g.lineWidth = 2.2 * dpr; g.strokeStyle = '#C2A461'; shield(); g.save(); g.translate(cx, cy); g.scale(1.12, 1.1); g.translate(-cx, -cy); shield(); g.restore(); g.stroke(); }
    const im = stratSym(u); if (im) { const z = S * 0.62; g.drawImage(im, cx - z / 2, y0 + h * 0.1, z, z); }
    // Lebensbalken
    const bw = S * 0.95, bh = Math.max(3, 4.5 * dpr), by = y0 + h + 3 * dpr, f = Math.max(0, Math.min(1, d.str / 10));
    g.fillStyle = '#120D0B'; g.fillRect(cx - bw / 2 - dpr, by - dpr, bw + 2 * dpr, bh + 2 * dpr);
    g.fillStyle = f > 0.6 ? LIFE_COL.hi : f > 0.3 ? LIFE_COL.mid : LIFE_COL.low; g.fillRect(cx - bw / 2, by, bw * f, bh);
    // Name unter Maus/Finger
    if (hoverU === u || sel === u) { const t = T.name; g.font = `600 ${Math.round(13 * dpr)}px "Arm Text", system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'top';
      const tw = g.measureText(t).width + 12 * dpr, ty = by + bh + 4 * dpr; g.fillStyle = 'rgba(232,220,190,0.95)'; g.fillRect(cx - tw / 2, ty, tw, 18 * dpr); g.strokeStyle = '#120D0B'; g.lineWidth = dpr; g.strokeRect(cx - tw / 2, ty, tw, 18 * dpr);
      g.fillStyle = '#120D0B'; g.fillText(t, cx, ty + 2.5 * dpr); }
    g.restore();
    if (fade > 0.4) UBOX.push({ u, x0: x0 - 4 * dpr, x1: x0 + w + 4 * dpr, y0: y0 - 4 * dpr, y1: by + bh + 4 * dpr });   // Marke anklickbar wie die Einheit
  }
}
// Kamera bewegen
function camPan(fx, fy) {   // Anteile der Bildbreite/-höhe
  camSetup(); const w = PJ.W * PJ.R / PJ.F; CAM.x += fx * w; CAM.y += fy * w * 0.8; camClamp();
}
function camDrag(dr, ev) {   // Boden „anfassen“: der Punkt unter dem Finger bleibt unter dem Finger
  const r = cv.getBoundingClientRect(), k = cv.width / r.width, sx = (ev.clientX - r.left) * k, sy = (ev.clientY - r.top) * k;
  if (!dr.cam) { dr.cam = { x: CAM.x, y: CAM.y }; camSetup(); dr.w0 = unproj((dr.x - r.left) * k, (dr.y - r.top) * k); }
  CAM.x = dr.cam.x; CAM.y = dr.cam.y; camSetup(); const w1 = unproj(sx, sy);
  if (dr.w0 && w1) { CAM.x = dr.cam.x + dr.w0[0] - w1[0]; CAM.y = dr.cam.y + dr.w0[1] - w1[1]; camClamp(); }
}
function zoomTilt(z, cx, cy, fit) {   // Zoom auf den Punkt unter Zeiger/Fingern; Kippwinkel folgt dem Zoom
  const r = cv.getBoundingClientRect(), k = cv.width / r.width, sx = (cx - r.left) * k, sy = (cy - r.top) * k;
  camSetup(); const w0 = unproj(sx, sy);
  CAM.z = Math.max(ZFIT, Math.min(Z_MAX, z)); zoomFit = !!fit || CAM.z <= ZFIT + 0.01; if (zoomFit) CAM.z = ZFIT;
  if (zoomFit) { CAM.x = L.W / 2; CAM.y = (L.top + L.H) / 2; }
  else if (w0) for (let i = 0; i < 3; i++) { camSetup(); const w1 = unproj(sx, sy); if (!w1) break; CAM.x += w0[0] - w1[0]; CAM.y += w0[1] - w1[1]; }
  camClamp(); camSetup(); ZOOM = CAM.z; zPend = 0; tbSync(); if ($('setZoom')) $('setZoom').textContent = zoomTxt();
}
function camToTilt(x, y, ms, force) {   // weich zum Bodenpunkt (Weltbild) fahren
  if (!L || (!force && !camOn())) return Promise.resolve();
  const tx = Math.max(0, Math.min(L.W, x)), ty = Math.max(L.top, Math.min(L.H, y + L.s * 0.5)), x0 = CAM.x, y0 = CAM.y;
  if (Math.hypot(tx - x0, ty - y0) < 2) return Promise.resolve();
  const dur = speed >= INSTANT ? 0 : ms / Math.min(speed, 2), me = {}; camAnim = me;
  if (!dur) { CAM.x = tx; CAM.y = ty; camClamp(); return Promise.resolve(); }
  return new Promise(res => { const st = performance.now();
    const step = () => { if (camAnim !== me) return res(); const k = Math.min(1, (performance.now() - st) / dur), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      CAM.x = x0 + (tx - x0) * e; CAM.y = y0 + (ty - y0) * e; camClamp(); if (k < 1) requestAnimationFrame(step); else { camAnim = null; res(); } };
    requestAnimationFrame(step); });
}

// ---------- Ton ----------
let soundOn = true;
try { soundOn = localStorage.getItem('arm.ton') !== '0'; } catch (e) {}   // Ton-Einstellung bleibt gespeichert (Spieltest 2026-11-17)
const lastSnd = {}, SND_GAP = { ueberrollen: 600, pferd_auswahl: 2500, pferd_unruhe: 2500, gespann: 1400, wagenknarren: 1400, husten: 300, select: 500, selGas: 900, ui: 50, erobert: 900, verloren: 900, tick: 600, bauen: 1500, wasser: 300, feuer: 2000, blast: 300, cannonH: 200, boomH: 250, mg3: 250, tankmove: 900, impact: 200, punch1: 120, punch2: 120, punch3: 120, punch4: 600, swords: 200, medic: 5000, pain: 1500, horn: 3000, snarl: 1500, tiger: 1500, rifle: 70, mg: 250, cannon: 150, flame: 500, boom: 250, boom2: 400, barrage: 800, gas: 800, tank: 1500, glitch: 500, gallop: 1400, gallop2: 1400, neigh: 2500, march: 2000, win: 3000, launch: 200, grenade: 300, cry: 1200, steps: 1100, tramp: 1100, cut: 300, robot: 2500, armor: 200, smash: 300, sword: 300, axe: 300, minigun: 400, mg2: 250, clank: 300, heal: 900, panic: 3000, whistle: 1500 };
const SND = {};
for (const k in (window.SOUNDS || {})) { SND[k] = new Audio(window.SOUNDS[k]); SND[k].preload = 'auto'; }
// Hintergrundkulisse als leise Schleife
let ambient = null;
let wetter = null, musik = null, feuerTon = null;
// Lautstärke (Optionen, gespeichert): Musik und Effekte getrennt, 0–1 (2026-11-17)
let musikVol = 0.8, effektVol = 1;
try { const m = localStorage.getItem('arm.musikvol'), f = localStorage.getItem('arm.effektvol'); if (m != null && m !== '') musikVol = Math.max(0, Math.min(1, +m)); if (f != null && f !== '') effektVol = Math.max(0, Math.min(1, +f)); } catch (e) {}
const KULISSE = { ambient: 0.22, wetter: 0.12, feuer: 0.12 };   // Grundlautstärke der Schleifen, mal effektVol
function kulisseVol() { if (ambient) ambient.volume = KULISSE.ambient * effektVol; if (wetter) wetter.volume = KULISSE.wetter * effektVol; if (feuerTon) feuerTon.volume = KULISSE.feuer * effektVol; }
// Brennende Felder: leise Feuer-Schleife, solange irgendwo etwas brennt
function fireLoop() {
  const on = soundOn && G && !G.over && (VIS.fires || []).length > 0;
  if (on && !feuerTon) { const k = sndPick('feuer'); if (!k) return; feuerTon = SND[k].cloneNode(); feuerTon.loop = true; feuerTon.volume = KULISSE.feuer * effektVol; }
  if (feuerTon) try { if (on) { const p = feuerTon.play(); if (p && p.catch) p.catch(() => {}); } else feuerTon.pause(); } catch (e) {}
}
function setAmbient(on) {
  if (!ambient) { const k = sndPick('ambient'); if (!k) return; ambient = SND[k]; ambient.loop = true; }
  if (!wetter) { const k = sndPick('wetter'); if (k) { wetter = SND[k]; wetter.loop = true; } }
  kulisseVol();
  for (const a of [ambient, wetter]) if (a) try { if (on) { const p = a.play(); if (p && p.catch) p.catch(() => {}); } else a.pause(); } catch (e) {}
  if (on) setMusik('musik_schlacht', 3); else if (musikName === 'musik_schlacht') setMusik(null, 2.5);   // Schlacht: Menümusik weich in die Schlachtmusik überblenden; Ende: ausblenden
  fireLoop();
}
// Musik (2026-11-17, eigene Stücke, Suno Pro): „musik_titel“ im Startmenü (auch Armee-Auswahl, Regeln), „musik_schlacht“ in der Schlacht,
// „musikNiederlage“ (Taps) nach einer verlorenen Schlacht. Mehrere Spuren gleichzeitig: Wechsel blenden weich über (fade s),
// Schleifen blenden 2 s vor dem Ende in eine neue Spur desselben Stücks über. null = Musik aus (ausblenden).
const MUSIK_VOL = { musik_titel: 0.34, musik_schlacht: 0.13, musikNiederlage: 0.32 };   // Schlachtmusik deutlich unter den Effekten
const musikSp = []; let musikName = null;
function setMusik(name, fade = 1.5) {
  const want = soundOn ? name : null;
  if (want && want === musikName && musikSp.some(t => !t.aus)) return;   // läuft schon
  for (const t of musikSp) { t.aus = true; t.fade = fade; }
  musikName = want;
  const k = want && sndPick(want); if (!k) return;
  musikSpur(want, k, musikSp.length ? fade : 0.6);
}
function musikSpur(name, k, fade) {
  const a = SND[k].cloneNode(); a.loop = false; a.volume = 0;
  const t = { a, name, k, lvl: 0, fade, aus: false, schleife: name !== 'musikNiederlage', weiter: false }; musikSp.push(t);
  try { const p = a.play(); if (p && p.catch) p.catch(() => {}); } catch (e) {}
  musik = a;
}
setInterval(() => {   // Lautstärken nachführen (alle 50 ms), Schleifen überblenden
  for (let i = musikSp.length - 1; i >= 0; i--) { const t = musikSp[i], a = t.a;
    t.lvl = Math.max(0, Math.min(1, t.lvl + (t.aus ? -1 : 1) * 0.05 / Math.max(0.1, t.fade)));
    try { a.volume = Math.min(1, t.lvl * (MUSIK_VOL[t.name] || 0.3) * musikVol); } catch (e) {}
    if (t.schleife && !t.aus && !t.weiter && a.duration && a.currentTime > a.duration - 2) { t.weiter = true; t.aus = true; t.fade = 2; musikSpur(t.name, t.k, 2); }   // 2 s Überblendung am Schleifenende
    if ((t.aus && t.lvl <= 0) || a.ended) { try { a.pause(); } catch (e) {} musikSp.splice(i, 1); }
  }
  musik = (musikSp.find(t => !t.aus) || {}).a || null;
}, 50);
function musikWecken() { for (const t of musikSp) if (!t.aus && t.a.paused) { const p = t.a.play(); if (p && p.catch) p.catch(() => {}); } }   // Browser erlaubt Ton erst nach der ersten Berührung
// Abwechslung: Gruppen von Tönen, aus denen zufällig gewählt wird (Wunsch des Nutzers)
// Seit 2026-11-16: Tonplätze (SOUND_POOLS) mit Varianten je Seite; SND_VAR fasst Plätze zusammen. Die Seite kommt aus dem gerade abgespielten Ereignis (sndSide).
const SND_VAR = { cry: ['cry', 'scream'], grenade: ['grenade', 'grenade2'], axe: ['axe', 'slash'], punch: ['punch1', 'punch2', 'punch3', 'swords'], artD: ['cannonH', 'cannon'] };
const SND_POOLS = window.SOUND_POOLS || {};
let hustenT = -1e9, hustenN = 0;
function husten() { const t = performance.now(); if (t - hustenT > 1500) hustenN = 0; hustenT = t; if (++hustenN <= 2) setTimeout(() => playSound('husten', 0.4, null, { v: 'gm' }), (hustenN - 1) * 380 / speed); }   // Tonplatz „husten“ (Dateien folgen)
let sndSide = null, lastFire = null;   // lastFire: zuletzt abgespielter Schuss (Kugeleinschlag beim folgenden Treffer); sndSide: Seite der Einheit, die gerade handelt (playEvent), für Konkordat-/Aschenwacht-Varianten
// Einheitlicher Stimmfilter je Sprecher (2026-11-17): Stimm-Plätze haben Varianten <platz>_gm (Gasmaske leicht), _gs (Gasmaske mittel: Kampfanzüge),
// _bf (Bordfunk stark: Panzerbesatzung), _mr (Maschine mittel: Schreiter, Eisenknecht); Hauptmann/General ohne Filter. Erzeugt mit tools/stimmfilter.py.
const PANZER = ['koloss', 'sturmpz', 'bohrer'];
function stimmVar(u) { const T = u && TYPES[u.type]; if (!T) return null; return T.cmd ? null : PANZER.includes(u.type) ? 'bf' : T.cls === 'walker' ? 'mr' : T.suit ? 'gs' : 'gm'; }
function sndPick(name, side, v) {
  const cand = [], add = (n, deep) => { if (!deep && SND_VAR[n]) { for (const m of SND_VAR[n]) add(m, true); return; } if (v && SND_POOLS[n + '_' + v]) n += '_' + v; if (SND_POOLS[n]) for (const [k, sd, w] of SND_POOLS[n]) { if (SND[k]) for (let i = 0; i < (w || 1); i++) cand.push([k, sd]); } else if (SND[n]) cand.push([n, null]); };   // Gruppe (SND_VAR) vor Platz, damit z. B. „rifle“ alle Gewehr-Plätze mischt; Gewicht w: Hauptton öfter
  add(name); if (!cand.length) return null;
  const sd = side || sndSide, own = cand.filter(c => !c[1] || c[1] === sd), list = own.length ? own : cand.filter(c => !c[1]);
  return list.length ? list[Math.floor(Math.random() * list.length)][0] : null;   // nur Varianten der anderen Seite: lieber still
}
function playSound(name, vol = 0.6, side, opt) {   // opt: { noGap, rate, dur, u (Sprecher → Stimmfilter), v (Filter fest) } – Salven: kein Mindestabstand, eigene Tonhöhe; dur: nach so vielen ms kurz ausblenden (Einzelschuss ohne Nachhall)
  const gapKey = name; name = sndPick(name, side || (opt && opt.u && opt.u.side), opt && (opt.v || stimmVar(opt.u))) || name;
  if (!soundOn || !SND[name] || (speed >= INSTANT && qRunning)) return;
  const t = performance.now(); if (!(opt && opt.noGap)) { if (lastSnd[gapKey] != null && t - lastSnd[gapKey] < (SND_GAP[gapKey] || SND_GAP[name] || 100)) return; lastSnd[gapKey] = t; }   // nicht mehrfach im selben Augenblick
  window.__sndBy = window.__sndBy || {}; window.__sndBy[name] = (window.__sndBy[name] || 0) + 1;
  window.__snd = (window.__snd || 0) + 1;
  try { const a = SND[name].cloneNode(); vol = Math.min(1, vol * effektVol); a.volume = vol; a.playbackRate = opt && opt.rate ? opt.rate : 0.94 + Math.random() * 0.12; const p = a.play(); if (p && p.catch) p.catch(() => {});
    if (opt && opt.dur) { let k = 0; setTimeout(function fade() { k++; try { a.volume = Math.max(0, vol * (1 - k / 5)); } catch (e) {} if (k < 5) setTimeout(fade, 12); else a.pause(); }, opt.dur); }   // ca. 60 ms ausblenden
  } catch (e) {}
}

// ---------- Effekte ----------
function burst(x, y, n, cols, o = {}) {
  for (let i = 0; i < n; i++) particles.push({ x, y, vx: (Math.random() - 0.5) * L.s * (o.spread || 0.12), vy: -Math.random() * L.s * (o.up || 0.14), g: L.s * 0.008,
    life: 16 + Math.random() * 16, col: cols[i % cols.length], s: L.s * (0.03 + Math.random() * 0.04) * (o.sz || 1) });
}
// Blut (Spieltest Runde 2, Punkt 17): dunkler, kleinere Spritzer und mehr Tropfen
const BLUT_FILTER = 'brightness(0.55) saturate(1.15)', BLUT_DUNKEL = ['#5e0f0b', '#4a0b08', '#6e140e', '#3a0806'];
const BOOM_IMG = { he: ['expl'], dust: ['dirt1', 'dirt2'], gas: ['gas2'], blood: ['splash'], smoke: ['smokeL1', 'smokeL2', 'smokeD'] };
function boom(x, y, r, kind, delay = 0) {
  { const s = L.s, m = r / s, fl = Math.random() < 0.5;   // neue Effektbögen, sonst unten die alten
    if (kind === 'he' && fxImpact(x, y, r, { delay })) return;
    if (kind === 'smoke' && fx('rauch', null, x, y + s * 0.3, { delay, life: 140, mul: m * 0.8, grow: 0.3, rise: 0.8, alpha: 0.72, fadeIn: 16, fadeOut: 0.6, flip: fl })) return;
    if (kind === 'dust' && fx('truemmer', 2, x, y + s * 0.35, { delay, life: 44, mul: m * 0.75, grow: 0.3, rise: 0.15, alpha: 0.85, flip: fl })) return;
    if (kind === 'gas' && fx('gas', null, x, y + s * 0.4, { delay, life: 70, mul: m * 0.7, grow: 0.4, alpha: 0.8, fadeIn: 10, flip: fl })) return;
    if (kind === 'blood' && fx('blut', Math.floor(Math.random() * 3), x, y - s * 0.3, { delay, life: 26, mul: m * 0.6, anchor: 'mitte', grow: 0.25, flip: fl, filter: BLUT_FILTER })) { burst(x, y - s * 0.3, 10 + Math.round(m * 12), BLUT_DUNKEL, { up: 0.09, spread: 0.1, sz: 0.5 }); return; } }
  const cols = kind === 'gas' ? [['#a9bd3a', 1], ['#d6e670', 0.6]] : kind === 'dust' ? [['#8a7a52', 1], ['#b7a678', 0.55]] : kind === 'blood' ? [['#8a1a14', 1]] : kind === 'smoke' ? [['#77736a', 1]] : [['#e8762a', 1], ['#ffd15a', 0.62], ['#fff6c4', 0.3]];
  const opts = BOOM_IMG[kind] || [], life = kind === 'smoke' ? 70 : kind === 'he' ? 30 : 24;
  booms.push({ x, y, r, cols, kind, img: opts[Math.floor(Math.random() * opts.length)], flip: Math.random() < 0.5, life, max: life, delay });
  if (kind === 'he') { boom(x, y, r * 0.9, 'dust'); boom(x, y - r * 0.2, r * 0.9, 'smoke', 14); }
}
// Effekt-Texte als Symbole (Wunsch des Nutzers; Symbolbögen in FXDATA.proj i_*). [Textanfang, Symbol, Zahl aus dem Text]
const FICON = [['weicht zurück', 'retreat'], ['Rückzug', 'retreat'], ['Reaktionsfeuer', 'react'], ['Sperrfeuer', 'react'], ['Streuung', 'scatter'], ['Panik', 'rout'], ['flieht', 'rout'],
  ['Gas!', 'gas'], ['Schreck', 'fear', /−\d+/], ['niedergehalten', 'supp'], ['aufgerieben', 'worn'], ['Sammeln', 'rally'], ['gesammelt', 'rally'], ['Moral +', 'morup'],
  ['Vorwärts', 'whistle'], ['Sturm!', 'whistle'], ['Draht geschnitten', 'cut'], ['Draht niedergewalzt', 'crush'], ['steckt im Schlamm', 'stuck'], ['Panne', 'broken'],
  ['wieder flott', 'repair'], ['wieder frei', 'repair'], ['instand gesetzt', 'repair'], ['geborgen', 'repair'], ['Nebelwand', 'smoke'], ['Stollen', 'tunnel', /\d+/],
  ['Mine gelegt', 'mine', /\d+/], ['Mine!', 'mine'], ['Ausgeleuchtet', 'light'], ['Gas entgiftet', 'gasok'], ['kein Gas', 'gasok'], ['nachgeladen', 'ammo'],
  ['Gegenstoß', 'counter'], ['aufgebaut', 'setup'], ['Feuerbereit', 'aim'], ['Marsch', 'march'], ['aufgeprotzt', 'limber'], ['abgeprotzt', 'limber'], ['Nachschub', 'supply'], ['versorgt', 'heal', /\+[\d,]+/]];
function floater(x, y, text, col, big, hold) {
  const life = hold ? 210 : 60 / speed + 22, f = { x, y, text, col, life, max: life, big, hold };
  const m = FICON.find(([p]) => String(text).startsWith(p));
  if (false && m && PJI['i_' + m[1]]) {   // abgeschaltet: Symbole nur noch als Zustandsmarken (Wunsch des Nutzers)
 f.icon = PJI['i_' + m[1]]; const n = m[2] && String(text).match(m[2]); f.sub = n ? n[0] : ''; f.life = f.max = life + 14; }
  floaters.push(f);
}
function bodyPos(id) { const d = DU.get(id), u = unitById(id), k = u ? TYPES[u.type].cls : 'inf'; return [d.x, d.y - L.s * (k === 'walker' ? 1.0 : 0.55)]; }
function headPos(id) { const d = DU.get(id), u = unitById(id), k = u ? TYPES[u.type].cls : 'inf'; return [d.x, d.y - L.s * (k === 'walker' ? 2.0 : k === 'cav' ? 1.7 : 1.45)]; }

// ---------- Ereignis-Animation ----------
const wait = ms => new Promise(r => setTimeout(r, ms / speed));
const raf = () => new Promise(r => requestAnimationFrame(r));
async function animPath(id, path, msPer, keepFace) {   // keepFace: Zurückweichen mit Blick zum Feind
  const d = DU.get(id); d.moving = true;   // neue Ansicht: Geschütz zeigt beim Ziehen das Gespann
  try {
  for (let i = 1; i < path.length; i++) {
    const [x0, y0] = center(path[i - 1][0], path[i - 1][1]), [x1, y1] = center(path[i][0], path[i][1]);
    { const uu = unitById(id), T = uu && TYPES[uu.type];
      if (T && T.cls === 'walker' && !d.vs.rout) { const sh = FIGMAP[uu.type] && FIGMAP[uu.type][0];
        { const h = G.map[path[i][0]] && G.map[path[i][0]][path[i][1]]; if (h && h.t === 'barrikade') playSound('ueberrollen', 0.5); }   // über eine Barrikade
        if (sh && SCHREITER.includes(sh)) fx('truemmer', Math.random() < 0.5 ? 5 : 2, x1, y1 + L.s * 0.3, { life: 40, mul: 0.5, grow: 0.4, alpha: 0.8, fadeOut: 0.6 });   // Schreiter: Staub bei jedem Schritt
        else gmark('bodenspuren', 4, (x0 + x1) / 2, (y0 + y1) / 2 + L.s * 0.1, { mul: 0.6, alpha: 0.7, flip: false, ang: Math.atan2(y1 - y0, x1 - x0) + 0.52 }); } }   // Kolosse: Kettenspur
    if (x1 !== x0 && !keepFace) d.face = x1 > x0 ? (facesLeft(d.face) ? 0 : d.face) : (facesLeft(d.face) ? d.face : 3);   // nur die Seite wechseln, senkrechte Schritte drehen nicht
    if (camOn() && !inView(x1, y1 - L.s * 0.4, 0.14)) camTo(x1, y1 - L.s * 0.4, 300);   // Kamera geht mit
    const dur = msPer / speed, t0 = performance.now();
    for (let k = 0; k < 1;) { await raf(); k = Math.min(1, (performance.now() - t0) / dur); d.x = x0 + (x1 - x0) * k; d.y = y0 + (y1 - y0) * k; }
  }
  } finally { d.moving = false; }
}
const unitById = id => G.units.find(u => u.id === id);
const nm = u => `${TYPES[u.type].name} (${SIDES[u.side].short})`;

let marschU = null;   // Einheit im Marsch/Sturmlauf: ihr Zug klingt nach Marschtritt (Spieltest Runde 2)
// Beschuss-Tempo (2026-11-17): Schuss, Geschoss und Einschlag laufen mit dem Bewegungstempo × 1,5, höchstens 1× (bei ½× also 0,75×); schnellere Stufen bleiben
const BESCHUSS = new Set(['fire', 'shell', 'hit', 'supp']);
async function playEvent(e) {
  if (!BESCHUSS.has(e.t) || speed >= 1) return playEvent0(e);
  const sp = speed; speed = Math.min(1, sp * 1.5);
  try { return await playEvent0(e); } finally { if (speed === Math.min(1, sp * 1.5)) speed = sp; }
}
async function playEvent0(e) {
  { const su = unitById(e.a != null ? e.a : e.u != null ? e.u : e.by); sndSide = su ? su.side : e.side || null; }
  const u = e.u != null ? unitById(e.u) : null, s = L.s;
  try { noteEvent(e, u); } catch (err) { console.error(err); }   // Ereignistext und Kriegstagebuch
  switch (e.t) {
    case 'move': { const k0 = TYPES[u.type].cls; if (marschU != null && marschU !== e.u) marschU = null; if (k0 === 'cav') playSound('gallop2', 0.55); else if (u.limbered) { playSound('gespann', 0.5); playSound('wagenknarren', 0.3); } else if (k0 === 'walker') playSound(TYPES[u.type].fig ? 'mech' : 'tank', TYPES[u.type].fig ? 0.5 : 0.3); else if (TYPES[u.type].mech) playSound('mech', 0.45); else { if (TYPES[u.type].fig === 'dog') playSound('dog', 0.5); if (marschU === e.u && u.side === 'D') { playSound('schritte', 0.5); if (Math.random() < 0.35) playSound('marschtritt', 0.38); } else playSound(marschU === e.u ? 'marschtritt' : e.path.some(h => ['forest', 'wald', 'waldweg'].includes(G.map[h[0]][h[1]].t)) ? 'stepsWald' : e.path.some(h => G.map[h[0]][h[1]].t === 'mud') ? 'steps' : 'schritte', 0.5); } } await animPath(e.u, e.path, TYPES[u.type].cls === 'cav' ? 110 : 170); VIS.ctrl = { ...G.ctrl }; break;
    case 'advance': await animPath(e.u, e.path, 200); break;
    case 'fallback': if (u && TYPES[u.type].cls === 'cav') playSound('pferd_unruhe', 0.5); await animPath(e.u, e.path, 200, true); floater(...headPos(e.u), 'weicht zurück', '#f0d27a'); break;
    case 'flee': await animPath(e.u, e.path, 120); break;
    case 'face': DU.get(e.u).face = e.face; break;
    case 'fire': {
      const a = DU.get(e.a), [x1, y1] = bodyPos(e.a), [x2, y2] = bodyPos(e.d);
      { const dz = DU.get(e.d); fxZielFuss = dz ? [dz.x, dz.y] : null; }
      if (e.face != null && !e.reaction) a.face = e.face; else a.face = x2 >= x1 ? 0 : 3;
      if (e.reaction) { if (camOn() && !inView(x1, y1)) await camTo(x1, y1, 260); floater(...headPos(e.a), 'Sperrfeuer!', '#ffd860'); await wait(220); }   // erst kurz zum Schützen
      if (camOn() && !(inView(x1, y1, 0.08) && inView(x2, y2, 0.08))) await camTo((x1 + x2) / 2, (y1 + y2) / 2, 320);   // Schütze und Ziel ins Bild
      if (e.kind === 'flame') { playSound('flame', 0.6);
        const p = fxMuzzle(e.a, 0, 0.42) || [x1, y1], du = unitById(e.d), deck = du && E.coverOf(G, du).tier >= 2;   // Ziel in Deckung: Strahl prallt ab (Variante 4)
        const dr = fxDir(p[0], p[1], x2, y2, 1.2), len = Math.hypot(x2 - p[0], y2 - p[1]) * 1.08, v = deck ? 3 : [0, 1, 2, 4, 5][Math.floor(Math.random() * 5)];
        if (fx('flammenstrahl', v, p[0], p[1], { anchor: 'links', len, lenIn: 6, life: 30, fadeOut: 0.35, flip: dr.flip, ang: dr.ang })) await wait(450);
        else { flames.push({ x1, y1, x2, y2, life: 26, max: 26 }); await wait(420); } }
      else {
        const mini = e.kind === 'minigun', mg = e.kind === 'mg' || mini, can = e.kind === 'cannon', au = unitById(e.a), ang = Math.atan2(y2 - y1, x2 - x1);
        const AT = au && TYPES[au.type], rs = !AT ? 'rifle' : AT.lob ? 'grenade' : AT.pin || AT.hidden ? 'sniper' : AT.cmd ? 'pistol' : AT.suit ? 'semi' : 'rifle';
        lastFire = { kind: e.kind, t: performance.now() };   // Hülsen-Ton nach der MG-Salve entfernt (Spieltest 2026-11-17: klang wie herumfliegende Splitter)
        const salve = e.kind === 'rifle' && rs === 'rifle' && !(au && au.type === 'buechse');   // Gewehrinfanterie: kurze Salve statt Einzelschuss (2026-11-17)
        if (salve) { const n = Math.max(1, Math.min(4, Math.ceil((a.str || 10) / 2.5 - 0.001)));   // so viele Schüsse wie lebende Figuren
          const key = sndPick('rifle', au && au.side) || 'rifle';   // eine Datei je Salve (Hauptgewehr der Seite), nur versetzt mit leicht anderer Tonhöhe und Lautstärke
          // unregelmäßig wie eine Gruppe, die fast gleichzeitig feuert: „pam – pam-pam – pam“. Abstände zufällig 0–0,25 s, manchmal zwei fast zugleich;
          // jeder Schuss kurz (ohne Nachhall), nur der letzte klingt voll aus (Spieltest 2026-11-17, gilt für beide Seiten)
          let t = 0; for (let q = 0; q < n; q++) { if (q) t += Math.random() < 0.3 ? Math.random() * 40 : Math.random() * 250;
            const last = q === n - 1; setTimeout(() => playSound(key, 0.3 * (0.8 + Math.random() * 0.4), au && au.side, { noGap: true, rate: 0.94 + Math.random() * 0.12, dur: last ? 0 : 170 + Math.random() * 60 }), t / speed);
            const p = fxMuzzle(e.a, q); if (p) { fxFlash(0, p, x2, y2, { delay: t / 16.667, mul: 0.8 }); fxTracer(0, p, x2, y2, { delay: t / 16.667 }); } } }   // je Figur Mündungsfeuer und Leuchtspur im Takt der Salve
        else playSound(e.kind === 'rifle' ? (au && au.type === 'buechse' ? 'buechse' : rs) : mini ? 'minigun' : mg ? 'mg' : au && ['koloss', 'turm', 'kreuz'].includes(au.type) ? 'kolosskanone' : au && au.side === 'D' && AT && AT.cls === 'walker' ? 'panzerkanone' : 'cannon', mg ? 0.55 : 0.6);

        // neue Effektbögen: Mündungsfeuer an der Laufmündung, Leuchtspuren; Drehlauf-Waffen mit eigenem Feuer
        const pm = e.zweit ? fxSeite(e.a, e.d) : fxMuzzle(e.a, 0, mini ? 0.45 : can ? 0.42 : 0.3), neu = !!(pm && fxIm('muendung'));
        if (neu) {
          if (mini && fxIm('drehlauf')) { const dr = fxDir(pm[0], pm[1], x2, y2, 0.5); for (let q = 0; q < 6; q++) fx('drehlauf', q % 2 ? 3 + Math.floor(Math.random() * 3) : Math.floor(Math.random() * 3), pm[0], pm[1], { anchor: q % 2 ? 'links' : 'mitte', delay: q * 4.5, life: 5, fadeOut: 0.6, flip: dr.flip, ang: dr.ang, mul: q % 2 ? 0.9 : 0.6 });
            for (let q = 0; q < 4; q++) fxTracer(1, pm, x2, y2, { delay: q * 6, life: 12 }); }
          else if (mg) { for (let q = 0; q < 6; q++) fxFlash(1, pm, x2, y2, { delay: q * 4.5, life: 4, mul: 0.75 + Math.random() * 0.2 }); for (let q = 0; q < 4; q++) fxTracer(1, pm, x2, y2, { delay: 2 + q * 6, life: 12 }); }
          else if (can) fxFlash(3, pm, x2, y2, { life: 8, mul: 0.9 });
          else if (!salve) { const bu = au && au.type === 'buechse', v = bu || rs === 'sniper' ? 5 : rs === 'pistol' ? 2 : 0;
            if (rs !== 'grenade') { fxFlash(v, pm, x2, y2, { mul: v === 2 ? 0.7 : 0.85 }); fxTracer(bu ? 5 : 0, pm, x2, y2, bu ? { mul: 0.7 } : {}); } }
        }
        if (neu && !can) {}
        else if (mini) muzzles.push({ img: 'muzzle', x: x1 + Math.cos(ang) * s * 0.3, y: y1 + Math.sin(ang) * s * 0.3, ang, sz: 0.8, off: 0.12, life: 24, max: 24 });
        else if (neu) {}
        else if (mg && PJI.mgfire) { const lf = facesLeft(a.face), mz = a.muz, [mx, my] = mz ? [a.x + (!!mz[2] === lf ? mz[0] : -mz[0]), a.y + mz[1]] : [x1 + Math.cos(ang) * s * 0.25, y1 + Math.sin(ang) * s * 0.25];   // an der Laufmündung (im letzten Bild gemessen, bei Wendung gespiegelt)
          muzzles.push({ img: 'mgfire', x: mx, y: my, ang: mz ? (lf ? Math.PI : 0) : ang, sz: 0.85, off: 0.02, life: 26, max: 26 }); }
        else if (can) muzzles.push({ img: 'dust', x: x1 + Math.cos(ang) * s * 0.5, y: y1 + Math.sin(ang) * s * 0.5, ang, sz: 0.6, off: 0.15, life: 26, max: 26 });
        if (!neu || can) tracers.push({ x1: x1 + (x2 > x1 ? 1 : -1) * s * 0.5, y1, x2, y2, life: mg ? 30 : 15, max: mg ? 30 : 15, n: mg ? 9 : 1, stream: mg, col: can ? '#ff9a3a' : '#ffe27a', img: can ? 'shard' : 'bullet', sz: mg ? 0.17 : can ? 0.34 : 0.2 });
        await wait((mg ? 30 : 15) * 16.667 * 0.9);
        if (can) { boom(x2, y2 + s * 0.4, s * 0.5, 'he'); playSound('boom', 0.45); }
      }
      break;
    }
    case 'shell': if (e.mode === 'barrage' && !e.strike) {
      const a = DU.get(e.a), [x2, y2] = center(e.c, e.r), ua = unitById(e.a), [x1, y1] = bodyPos(e.a), mob = TYPES[ua.type].mobile;
      if (camOn() && !inView(x1, y1)) await camTo(x1, y1, 260);
      a.face = e.face;
      const cells = (e.cells || [[e.c, e.r], ...E.neighbors(e.c, e.r)]).filter(([c, r]) => c >= 0 && r >= 0 && c < COLS && r < ROWS);
      const n = mob ? 3 : 4, key = sndPick(mob ? 'launch' : ua.type === 'feldkanone' ? 'cannon' : ua.side === 'D' ? 'artD' : 'cannonH', ua.side), dir = x2 >= x1 ? 1 : -1, dur = 34;
      const order = [0, ...cells.slice(1).map((_, i) => i + 1).sort(() => Math.random() - 0.5)];   // erst das Zielfeld, dann die Nachbarn in zufälliger Reihenfolge
      const shots = []; let t = 0;
      for (let q = 0; q < n; q++) { if (q) t += 220 + Math.random() * 140; shots.push(t); }
      shots.forEach((t, q) => setTimeout(() => {   // je Abschuss: Ton, Mündungsfeuer, Rückstoß-Ruck, Rauch, Granate
        if (key) playSound(key, (mob ? 0.42 : 0.75) * (0.85 + Math.random() * 0.25), ua.side, { noGap: true, rate: 0.9 + Math.random() * 0.15 });
        const pa = fxIm('muendung') ? fxMuzzle(e.a, 0, mob ? 0.12 : 0.32) : null;
        if (pa) { if (mob) fx('muendung', 4, pa[0], pa[1], { anchor: 'mitte', life: 7, fadeOut: 0.7, flip: x2 < x1, mul: 0.8 }); else fxFlash(3, pa, x2, y2 - s * 2, { life: 8 });
          fx('rauch', 0, pa[0], pa[1] + s * 0.2, { life: 60, mul: 0.28, grow: 0.6, rise: 0.5, alpha: 0.55, fadeIn: 5, fadeOut: 0.7 }); }
        a.lunge = { dx: -dir * s * 0.12, dy: -s * 0.02 }; setTimeout(() => { if (a.lunge && a.lunge.dx === -dir * s * 0.12) a.lunge = null; }, 110 / speed);
        const [cx, cy] = center(...cells[order[q % order.length]]);
        shells.push({ fxi: mob ? 1 : 0, x1, y1, x2: cx, y2: cy, t: 0, dur, col: '#2a2a26', img: mob ? (PJI.rocket ? 'rocket' : 'shellB') : 'shellA', sz: 0.4 });
      }, t / speed));
      if (camOn() && !inView(x2, y2, 0.12)) setTimeout(() => camTo(x2, y2, dur * 16.667 * 0.8), 200 / speed);
      await wait(shots[0] + dur * 16.667);
      // Einschläge versetzt über alle Zielfelder (Zielfeld zuerst), jeder mit eigenem Knall
      const imp = order.map((ci, i) => [cells[ci], i < n ? shots[i] : shots[n - 1] + (i - n + 1) * (140 + Math.random() * 120)]);
      for (const [[c, r], tt] of imp) setTimeout(() => { const [bx, by] = center(c, r); boom(bx, by, s * (c === e.c && r === e.r ? 0.75 : 0.6), 'he'); playSound(mob ? 'boom' : 'boomH', 0.5 * (0.8 + Math.random() * 0.3), null, { noGap: true }); shake(4); }, (tt - shots[0]) / speed);
      if (e.scatter) floater(x2, y2 - s, 'Streuung!', '#f0d27a');
      if (e.guided) floater(x2, y2 - s * 1.5, '◉ markiert ×1,25', '#F0EDE1', false, true);
      await wait(imp[imp.length - 1][1] - shots[0] + 380); break;
    } else {
      const a = DU.get(e.a), [x2, y2] = center(e.c, e.r), ua = unitById(e.a);
      const [x1, y1] = e.strike ? [x2 - (ua.side === 'A' ? 1 : -1) * s * 7, y2 - s * 5] : bodyPos(e.a);   // Feuerschlag: Batterie hinter der eigenen Front
      if (e.strike) { floater(...headPos(e.a), 'Feuerschlag!', '#E2B04A', true); playSound('cannonH', 0.35); }
      else {
      if (camOn() && !inView(x1, y1)) await camTo(x1, y1, 260);   // Abschuss zeigen, danach folgt die Kamera der Granate
      a.face = e.face; playSound(TYPES[ua.type].mobile ? 'launch' : ua.type === 'feldkanone' ? 'cannon' : ua.side === 'D' ? 'artD' : 'cannonH', TYPES[ua.type].mobile ? 0.42 : 0.8);   // Mörser: Mörserton, Geschütze: Kanonenschuss
      }
      const mob = TYPES[ua.type].mobile, pa = !e.strike && fxIm('muendung') ? fxMuzzle(e.a, 0, mob ? 0.12 : 0.32) : null;
      if (pa) { if (mob) fx('muendung', 4, pa[0], pa[1], { anchor: 'mitte', life: 7, fadeOut: 0.7, flip: x2 < x1, mul: 0.8 }); else fxFlash(3, pa, x2, y2 - s * 2, { life: 8 });   // Mörser: kurzer Blitz nach oben, Geschütz: großer Mündungskegel
        fx('rauch', 0, pa[0], pa[1] + s * 0.2, { life: 70, mul: 0.3, grow: 0.6, rise: 0.5, alpha: 0.6, fadeIn: 6, fadeOut: 0.7 }); }
      else if (e.strike) {} else if (PJI.dust) muzzles.push({ img: 'dust', x: x1 + (x2 > x1 ? 1 : -1) * s * 0.4, y: y1 - s * 0.15, ang: x2 > x1 ? -0.6 : Math.PI + 0.6, sz: 0.7, off: 0.15, life: 30, max: 30 }); else boom(x1 + (x2 > x1 ? 1 : -1) * s * 0.7, y1, s * 0.35, 'he');
      const dur = 34;   // in 60-Hz-Bildern bei Tempo 1; wait() teilt durch das Tempo wie die Flugbahn
      shells.push({ fxi: e.mode === 'gas' ? 5 : TYPES[ua.type].mobile && !e.strike ? 1 : 0, x1, y1, x2, y2, t: 0, dur, col: e.mode === 'gas' ? '#c4d646' : '#2a2a26', img: TYPES[ua.type].mobile && !e.strike ? (PJI.rocket ? 'rocket' : 'shellB') : 'shellA', sz: 0.4 });
      if (camOn() && !inView(x2, y2, 0.12)) camTo(x2, y2, dur * 16.667 * 0.8);
      await wait(dur * 16.667);
      shake(e.mode === 'barrage' ? 7 : 5);   // Einschlag: kurzes Bildwackeln
      if (e.scatter) floater(x2, y2 - s, 'Streuung!', '#f0d27a');
      if (e.guided) floater(x2, y2 - s * 1.5, '◉ markiert ×1,25', '#F0EDE1', false, true);
      playSound(e.mode === 'gas' ? 'gas' : e.mode === 'barrage' ? 'barrage' : TYPES[ua.type].mobile && !e.strike ? 'boom' : 'einschlagH', e.mode === 'he' && !(TYPES[ua.type].mobile && !e.strike) ? 0.8 : 0.7);   // Einzelschuss: Einschlag mit mehr Volumen und Tiefe
      if (e.mode === 'he' && G.map[e.c] && G.map[e.c][e.r] && (G.map[e.c][e.r].river || ['canal', 'sumpf', 'furt'].includes(G.map[e.c][e.r].t))) playSound('wasser', 0.6);
      if (e.mode === 'he') { boom(x2, y2, s * 0.95, 'he'); burst(x2, y2, 16, ['#5a4632', '#3d3024', '#8a7a52'], { up: 0.3, spread: 0.3 }); }
      else if (e.mode === 'gas') { boom(x2, y2, s * 1.0, 'gas'); visSync('clouds'); }   // Wolke erst beim Einschlag
      else { boom(x2, y2, s * 0.7, 'he'); (e.cells || [[e.c, e.r], ...E.neighbors(e.c, e.r)]).slice(1).forEach(([c, r], i) => { const [bx, by] = center(c, r); boom(bx, by, s * 0.6, i % 2 ? 'dust' : 'he', 3 + i * 3); }); }
      await wait(e.mode === 'barrage' ? 420 : 260); break;
    }
    case 'melee': case 'counter': {
      const a = DU.get(e.a), d = DU.get(e.d);
      if (e.face != null) a.face = e.face; else a.face = d.x >= a.x ? 0 : 3;
      const au = unitById(e.a), du = unitById(e.d), af = au && TYPES[au.type].fig, armored = du && TYPES[du.type].cls === 'walker';
      const strikeSnd = () => {   // Ton für jeden, der zuschlägt: Angreifer (melee) und Verteidiger beim Gegenschlag (counter) – Wunsch des Nutzers; erklingt beim Treffer
        const mech = au && TYPES[au.type].mech;
        const du0 = unitById(e.d), foot = x => x && ['inf', 'mg', 'storm', 'medic', 'flame'].includes(TYPES[x.type].cls) && !TYPES[x.type].suit;
        const tank = au && TYPES[au.type].cls === 'walker' && !mech;
        // Grundklang je Fraktion (2026-11-17): Konkordat Klingen/Keule/Fäuste (nahA), Aschenwacht Spaten/Metall (nahD); eigene Töne nur für
        // Kolosse/Schreiter (heavy/impact), Kampfanzüge (sword), Grabenräumer (axe + Flinte), Sturmbrecher (Handgranate + Flinte)
        const base = au && au.side === 'D' ? 'nahD' : 'nahA', suit = au && TYPES[au.type].suit;
        playSound(mech ? 'heavy' : tank ? 'impact' : suit ? 'sword' : au && TYPES[au.type].cls === 'cav' ? 'saebel' : af === 'raider' || af === 'brawler' ? 'axe' : au && TYPES[au.type].cls === 'storm' && e.t === 'melee' ? 'grenade' : base, (mech || tank ? 0.7 : 0.55) * (e.t === 'counter' ? 0.85 : 1));
        if (foot(au) && foot(du0) && Math.random() < 0.35) playSound('cry', 0.35, null, { u: au });
        if (au && ['raeumer', 'sturm'].includes(au.type)) playSound('flinte', 0.5);   // kurzer Schuss im Grabenkampf
        if (au && TYPES[au.type].cls === 'storm' && e.t === 'melee') playSound('cry', 0.45, null, { u: au });   // Kampfschrei beim Sturmangriff
        if (af === 'mechB') playSound(Math.random() < 0.5 ? 'snarl' : 'tiger', 0.4);   // Klauenschreiter knurrt
      };
      let thrown = false;
      { const kc = au && TYPES[au.type].cls; if (e.t === 'melee' && kc === 'storm' && af !== 'shield' && af !== 'raider' && af !== 'brawler') (thrown = true, shells.push({ fxi: au.side === 'A' ? 3 : 2, fxs: 0.75, x1: a.x, y1: a.y - s * 0.5, x2: d.x, y2: d.y - s * 0.2, t: 0, dur: 16, arc: 0.9, spin: true, img: au.side === 'A' ? 'pine' : 'stick', sz: 0.3 })); }
      a.lunge = { dx: (d.x - a.x) * 0.38, dy: (d.y - a.y) * 0.38 }; await wait(thrown ? 16 * 16.667 : 140);   // Handgranate: Knall erst beim Aufschlag
      strikeSnd();
      const mx = (a.x + d.x) / 2 + (d.x - a.x) * 0.2, my = (a.y + d.y) / 2 - s * 0.5;
      boom(mx, my + s * 0.25, s * 0.3, 'dust');
      { // Nahkampf-Bilder aus dem Effektbogen des Nutzers: Hieb, Kolbenstoß, Krallen, Bajonettstich, Aufprall, Blut
        const T0 = au && TYPES[au.type], kc = T0 && T0.cls, fl = d.x < a.x, ang = Math.atan2(d.y - a.y, d.x - a.x);
        let k = null;
        if (af === 'mechB' || af === 'mechK' || af === 'mechA') k = 'mclaw';
        else if (kc === 'cav' || af === 'raider' || af === 'brawler' || af === 'knight') k = 'mswing';
        else if (af === 'shield' || af === 'shieldA' || kc === 'walker') k = 'msmash';
        else if (kc !== 'art') k = ['mstab', 'msmash', 'mswing'][Math.floor(Math.random() * 3)];
        const heavy = kc === 'walker' || af === 'drill', metal = armored || (du && TYPES[du.type].suit && T0 && T0.suit);
        const nv = heavy ? 5 : metal ? 4 : k === 'mstab' ? 3 : k === 'msmash' ? 2 : k ? (Math.random() < 0.5 ? 0 : 1) : null;   // Schwung/Kreuzhieb, Aufprallstern, Stich, Funkenstern, Bodenschlag
        if (nv != null && fx('nahkampf', nv, nv === 5 ? d.x : d.x + (fl ? 1 : -1) * s * 0.12, nv === 5 ? d.y + s * 0.35 : d.y - s * 0.45, { anchor: nv === 5 ? 'unten' : 'mitte', life: 20, fadeOut: 0.6, grow: 0.25, flip: fl, mul: nv === 5 ? 1.1 : 0.85 })) {
          if (blood && du && !['walker', 'art'].includes(TYPES[du.type].cls)) { fx('blut', Math.floor(Math.random() * 3), d.x + (fl ? -1 : 1) * s * 0.15, d.y - s * 0.4, { anchor: 'mitte', life: 28, mul: 0.42, grow: 0.25, flip: fl, filter: BLUT_FILTER }); burst(d.x + (fl ? -1 : 1) * s * 0.15, d.y - s * 0.4, 12, BLUT_DUNKEL, { up: 0.08, spread: 0.09, sz: 0.5 }); }
          if (af === 'drill') fx('truemmer', 3, d.x, d.y + s * 0.35, { life: 40, mul: 0.7, grow: 0.3, flip: fl });   // Bohrkoloss: Grus
        }
        else if (k === 'mstab' && PJI.mstab) muzzles.push({ img: 'mstab', x: a.x + (d.x - a.x) * 0.25, y: a.y - s * 0.45 + (d.y - a.y) * 0.25, ang, off: 0, sz: 0.4, life: 34, max: 34 });
        else if (k && PJI[k]) muzzles.push({ img: k, x: d.x, y: d.y - s * 0.1, center: true, up: 0.85, sz: k === 'mswing' ? 1.3 : 1.25, flip: fl, life: 42, max: 42 });
        if (fxN('nahkampf')) {} else if (PJI.mimpact) muzzles.push({ img: 'mimpact', x: mx, y: my + s * 0.25, center: true, up: 0.5, sz: kc === 'walker' ? 1.1 : 0.85, life: 26, max: 26 });
        if (blood && !fxN('nahkampf') && PJI.msplat && du && TYPES[du.type].cls !== 'walker' && TYPES[du.type].cls !== 'art') muzzles.push({ img: 'msplat', x: d.x + (fl ? -1 : 1) * s * 0.15, y: d.y - s * 0.35, center: true, up: 0.5, sz: 0.9, flip: fl, life: 54, max: 54 });
      }
      if (fxN('nahkampf')) {} else if (au && TYPES[au.type].mech && TYPES[au.type].cls === 'walker' && PJI.hammer) muzzles.push({ img: 'hammer', x: d.x, y: d.y + s * 0.35, center: true, up: 0.75, sz: 1.7, life: 34, max: 34 });
      if (af === 'drill' && !fxN('truemmer')) muzzles.push({ img: 'crash', x: d.x, y: d.y + s * 0.3, center: true, up: 0.9, sz: 1.3, life: 30, max: 30 });
      if (armored || af === 'drill' || af === 'mechA' || af === 'mechK' || af === 'mechC') { if (armored) playSound(du && TYPES[du.type].mech ? 'heavy' : 'armor', 0.6); if (!fx('funken', null, d.x, d.y - s * 0.45, { anchor: 'mitte', life: 16, fadeOut: 0.6, mul: 0.8, flip: Math.random() < 0.5 })) muzzles.push({ img: 'sparks', x: d.x, y: d.y - s * 0.45, center: true, sz: 0.95, life: 22, max: 22 }); }
      await wait(170); a.lunge = null; await wait(70); break;
    }
    case 'hit': {
      const d = DU.get(e.u), [x, y] = bodyPos(e.u);
      if (E.isMech(u.type) && TYPES[u.type].cls === 'walker') playSound('robot', 0.5, null, { u });   // Schreiter/Eisenknecht; Kampfanzüge rufen wie Fußtruppen (unten)
      d.str = e.str; d.mor = e.morv; d.shake = 1; setTimeout(() => d.shake = 0, 260 / speed);
      if (!e.panic && e.dmg >= 1.5) { shake(e.dmg >= 2.5 ? 6 : 4); playSound('impact', 0.3); }
      if (!e.panic && !e.wire && lastFire && performance.now() - lastFire.t < 3000 && ['rifle', 'mg', 'minigun'].includes(lastFire.kind)) {
        const soft = !['walker', 'art'].includes(TYPES[u.type].cls);
        if (lastFire.kind !== 'rifle' && soft) playSound('einschlag', 0.22, null, { rate: 0.78 + Math.random() * 0.08, dur: 260 });   // MG-Treffer: dumpfer Einschlag in den Körper, tiefer gestimmt, kurz und leise (Spieltest 2026-11-17)
        else playSound(e.dmg >= 0.3 ? 'einschlag' : 'vorbei', 0.35);
      }
      if (!e.panic && !e.wire && lastFire && performance.now() - lastFire.t < 3000 && (TYPES[u.type].cls === 'walker' || TYPES[u.type].suit)) fx('funken', null, x + (Math.random() - 0.5) * s * 0.4, y, { anchor: 'mitte', life: 12, fadeOut: 0.6, mul: 0.6, flip: Math.random() < 0.5 });   // Treffer auf Panzerung
      if (!e.panic) {
        if (TYPES[u.type].cls === 'cav') playSound(Math.random() < 0.65 ? 'pferd_unruhe' : 'neigh', Math.random() < 0.65 ? 0.5 : 0.35); else if (u.limbered) playSound('neigh', 0.35);   // Pferde gleich laut (Spieltest Runde 2)   // Reiter beschossen: unruhige Pferde
        else if (['inf', 'mg', 'storm', 'medic'].includes(TYPES[u.type].cls) && e.dmg >= 1) playSound(e.str < 3.5 && Math.random() < 0.6 ? 'medic' : 'pain', 0.45, null, { u });
        burst(x, y + s * 0.3, 8, ['#5a4632', '#3d3024', '#7a6448'], { up: 0.16 });
        if (e.burn) burst(x, y, 12, ['#ff9a2a', '#ffcf5a', '#c8461a', '#3a2a1a'], { up: 0.24, spread: 0.18 });   // Feuer: Funken und Ruß statt Blut
        else if (blood && e.wire) {   // Stacheldraht: wenig, dunkles Rotbraun, keine Tropfspuren; wird zu einem kleinen Fleck, der nach einigen Runden vergeht
          burst(x, y + s * 0.15, 7, ['#4a1810', '#3a120c', '#5c2216'], { up: 0.1, spread: 0.12 });
          decals.push({ wire: true, x: d.x + (Math.random() - 0.5) * s * 0.4, y: d.y + s * 0.12 * kAt(d.x, d.y), r: s * 0.09, born: now, turn: G.turn });
        } else if (blood && TYPES[u.type].cls !== 'walker') { const nb = Math.min(5, 1 + Math.round(e.dmg * 2)); burst(x, y, 10 + nb * 5, BLUT_DUNKEL, { up: 0.09, spread: 0.1, sz: 0.5 });
          boom(x, y + s * 0.5, s * 0.28, 'blood');
          for (let q = 0; q < nb; q++) decals.push({ v: 1 + Math.floor(Math.random() * 4), x: d.x + (Math.random() - 0.5) * s * 1.1, y: d.y + (Math.random() - 0.3) * s * 0.7 * kAt(d.x, d.y), r: s * (0.06 + Math.random() * 0.13), col: Math.random() < 0.5 ? 'rgba(84,12,9,0.62)' : 'rgba(58,8,6,0.6)' });
          while (decals.length > 700) decals.shift(); }
        floater(...headPos(e.u), '−' + fmt(e.dmg), e.dmg >= 1.5 ? '#ff6a4a' : '#ff9a7a', e.dmg >= 1.5, true);
        if (human(G.side) || human(u.side)) toast(`${nm(u)}: −${fmt(e.dmg)} Stärke · ${e.dmg >= 2 ? 'schwerer Treffer' : e.dmg >= 1 ? 'guter Treffer' : e.dmg >= 0.4 ? 'leichter Treffer' : 'kaum Wirkung'} · noch ${fmt(e.str)}`);
      } else { floater(...headPos(e.u), 'Panik', '#f0d27a'); if (TYPES[u.type].cls === 'cav') playSound('pferd_unruhe', 0.45); }   // Moral wankt: unruhige Pferde
      await wait(e.panic ? 180 : 300 + (e.dmg >= 1 ? 120 : 0)); break;   // kurzer Halt bei Treffern
    }
    case 'gas': { husten();   // Husten: 1–2 Figuren, je nachdem wie viele Einheiten getroffen werden
      const d = DU.get(e.u); if (e.late) d.vs.poison = e.poison; else { d.vs.gassed = true; d.vs.poison = e.poison || 0; } d.str = e.str; d.mor = e.morv;
      floater(...headPos(e.u), e.late ? 'Vergiftet' : 'Gas!', e.late ? '#a8c870' : '#d6e670'); if (e.late) { const [x, y] = bodyPos(e.u); burst(x, y, 8, ['#8fae4a', '#6d8a34', '#b6c86a'], { up: 0.2 }); } await wait(220); break; }
    case 'wirehurt': { const [x, y] = center(e.c, e.r); playSound('holzknacken', 0.5); playSound('drahtlatch', 0.5); playSound('drahtwackeln', 0.4);   // Holzpfähle knacken, Draht klirrt (Spieltest Runde 2)
      floater(x, y - s * 1.0, 'Stacheldraht', '#d9b48a'); await wait(120); break; }
    case 'fear': { DU.get(e.u).mor = e.morv; floater(...headPos(e.u), 'Schreck: Moral −10', '#f0d27a'); await wait(200); break; }
    case 'supp': DU.get(e.u).vs.supp = 1; playSound('vorbei', 0.4); floater(...headPos(e.u), 'niedergehalten', '#e9cf5a'); await wait(170); break;
    case 'rout': DU.get(e.u).vs.rout = true; playSound('panic', 0.4, null, { u }); if (u && TYPES[u.type].cls === 'cav') playSound('pferd_unruhe', 0.5); floater(...headPos(e.u), 'flieht!', '#ffffff', true); toast(`${nm(u)} flieht.`); await wait(360); break;
    case 'destroyed': {
      const d = DU.get(e.u); floater(...headPos(e.u), 'aufgerieben', '#ff6a50', true); toast(`${nm(u)} ist aufgerieben.`);
      if (TYPES[u.type].cls === 'walker' || TYPES[u.type].cls === 'art') { if (!fxImpact(d.x, d.y, s * 1.1, { alt: true, noMark: true })) boom(d.x, d.y, s * 1.1, 'he'); gmark('bodenspuren', TYPES[u.type].cls === 'walker' ? 2 : 0, d.x, d.y + s * 0.2, { turns: 4, mul: 0.8 }); playSound('boom2', 0.75); if (TYPES[u.type].cls === 'walker') playSound('feuer', 0.35); shake(8); }
      else if (blood) { boom(d.x, d.y, s * 0.6, 'blood'); decals.push({ v: 3, x: d.x, y: d.y, r: s * 0.36, col: 'rgba(84,10,8,0.6)' }); for (let q = 0; q < 6; q++) decals.push({ v: 1 + Math.floor(Math.random() * 4), x: d.x + (Math.random() - 0.5) * s * 1.3, y: d.y + (Math.random() - 0.5) * s * 0.9 * kAt(d.x, d.y), r: s * (0.08 + Math.random() * 0.14), col: 'rgba(110,16,12,0.6)' }); burst(d.x, d.y - s * 0.4, 18, ['#9a1612', '#74100c'], { up: 0.2, spread: 0.3 }); }
      for (let k = 0; k < 10; k++) { d.alpha = 1 - k / 10; await wait(28); } d.alpha = 0; break;
    }
    case 'escaped': DU.get(e.u).alpha = 0; toast(`${nm(u)} hat das Schlachtfeld verlassen.`); break;
    case 'officer': toast(`${e.name} ist gefallen.`); floater(...headPos(e.u), e.name + ' fällt', '#ff6a50', true); await wait(300); break;
    case 'sent': { playSound('dog', 0.55); playSound('comeon', 0.45, null, { u: unitById(e.by) }); const d = DU.get(e.u), m = DU.get(e.by); if (m) m.face = d.x >= m.x ? 0 : 3; floater(...headPos(e.u), '+1 Aktion', '#F0EDE1', true); await wait(300); break; }
    case 'order': {
      const d0 = DU.get(e.u), rl = e.kind === 'rally', ff = e.kind === 'fire'; playSound(unitById(e.u) && unitById(e.u).side === 'D' ? 'roar' : rl ? 'stand' : 'forward', 0.45, null, { u: unitById(e.u) });   // Befehl: Offiziere ohne Filter
      if (ff) for (const id of e.ids || []) { const dd = DU.get(id); if (dd) dd.vs.fireFree = true; }   // Aschenwacht-Führung: Kampfschrei (Wunsch des Nutzers: nur der Anführer)
      toast(`${e.name}: ${rl ? 'Sammeln!' : ff ? 'Feuer frei!' : 'Sturmbefehl!'}`); floater(...headPos(e.u), rl ? 'Sammeln!' : ff ? 'Feuer frei!' : 'Vorwärts!', rl ? '#b8ff7c' : '#ffb04a', true);
      for (let q = 0; q < 2; q++) rings.push({ x: d0.x, y: d0.y, r: 2.6 + q * 1.4, col: rl ? '#b8ff7c' : '#ffb04a', life: 34 + q * 10, max: 34 + q * 10 });
      if (rl) for (const id of e.ids || []) { const dd = DU.get(id); if (dd) dd.vs.supp = 0; }
      await wait(260);
      e.ids.forEach((id, i) => { const dd = DU.get(id); if (!dd) return; if (rl) dd.mor = e.mors[i]; if (id !== e.u) floater(...headPos(id), rl ? 'Moral +' : 'Sturm!', rl ? '#b8ff7c' : '#ffb04a'); });
      await wait(260); break;
    }
    case 'rally': DU.get(e.u).vs.supp = 0; DU.get(e.u).vs.rout = false; floater(...headPos(e.u), 'gesammelt!', '#b8ff7c', true); toast(`${e.by} sammelt ${TYPES[u.type].name}.`); DU.get(e.u).face = u.face; await wait(300); break;
    case 'cut': { playSound('cut', 0.7); const [x, y] = center(e.c, e.r); burst(x, y - s * 0.2, 10, ['#c8ccd0', '#ffe090'], { spread: 0.2 }); floater(x, y - s, 'Draht geschnitten', '#e6e9ec'); renderTerrain(); await wait(280); break; }
    case 'crush': { const [x, y] = center(e.c, e.r); playSound('ueberrollen', 0.55); /* Fahrzeug walzt Draht nieder */ gmark('bodenspuren', 3, x, y + s * 0.1, { mul: 0.75 }); boom(x, y, s * 0.5, 'dust'); floater(x, y - s * 1.2, 'Draht niedergewalzt', '#e6e9ec'); renderTerrain(); await wait(160); break; }
    case 'terrain': { renderTerrain();
      { const [x, y] = center(e.c, e.r), w = e.what || '';
        if (w === 'gesprengt') fx('truemmer', [0, 1, 4][Math.floor(Math.random() * 3)], x, y + s * 0.4, { life: 80, grow: 0.25, rise: 0.15, fadeOut: 0.5 });   // Bunker/Barrikade: Ziegel, Holz, Sandsäcke
        if (w === 'Stollen gesprengt') { fx('truemmer', 4, x, y + s * 0.4, { life: 90, mul: 1.2, grow: 0.3, rise: 0.3, fadeOut: 0.5 }); fx('truemmer', 0, x + s * 0.3, y + s * 0.3, { delay: 6, life: 80, mul: 0.8, grow: 0.25 }); }
        if (/^Draht (verbrannt|zerschossen|zerrissen|niedergewalzt)/.test(w)) gmark('bodenspuren', 3, x, y + s * 0.1, { mul: 0.75 }); } if (e.what === 'Draht gezogen') playSound('bauen', 0.3); if (e.what === 'Stollen gesprengt') playSound('blast', 0.8); if (e.what === 'gesprengt' || e.what === 'Stollen gesprengt') playSound('einsturz', 0.7); if (e.what) { const [x, y] = center(e.c, e.r); floater(x, y - s * 0.6, e.what, '#e6e9ec'); } break; }
    case 'stuck': { DU.get(e.u).vs.stuck = 1; playSound('crash', 0.65); const d0 = DU.get(e.u); muzzles.push({ img: 'mudsplash', x: d0.x, y: d0.y + s * 0.4, center: true, up: 0.85, sz: 1.8, life: 56, max: 56 }); } playSound('steps', 0.7); floater(...headPos(e.u), 'steckt im Schlamm', '#d9c9a0'); await wait(250); break;
    case 'breakdown': { const d0 = DU.get(e.u); d0.vs.broken = 1;   // Paket 8: im Schlamm festgefahren – Ketten sinken ein, Dreck und Schlamm spritzen, kein Rauch
      for (let q = 0; q < 3; q++) { const fl = Math.random() < 0.5; fx('erdfontaene', null, d0.x + (q - 1) * s * 0.5, d0.y + s * 0.32, { delay: q * 6, life: 40, mul: 0.2, grow: 0.15, flip: fl, fadeOut: 0.45, filter: 'brightness(0.62) sepia(0.35)' }); }
      gmark('bodenspuren', 4, d0.x, d0.y + s * 0.1, { mul: 0.85 }); if (PJI.mudsplash) muzzles.push({ img: 'mudsplash', x: d0.x, y: d0.y + s * 0.42, center: true, up: 0.85, sz: 1.1, life: 50, max: 50 }); }
      if (TYPES[u.type].fig) { const d0 = DU.get(e.u); muzzles.push({ img: 'bolt', x: d0.x - s * 0.5, y: d0.y - s * 0.7, ang: -0.25, sz: 0.55, off: 0.1, life: 34, max: 34 }); }
      playSound('crash', 0.7); playSound('steps', 0.6); floater(...headPos(e.u), 'Panne – festgefahren!', '#ffb04a', true); toast(`${nm(u)} hat sich festgefahren und fällt ${P.PANNE_RUNDEN} Runden aus.`); await wait(350); break;
    case 'repaired': DU.get(e.u).vs.broken = 0; floater(...headPos(e.u), 'wieder flott', '#b8ff7c'); await wait(200); break;
    case 'smoke': { if (u && u.type === 'rauch') playSound('werfer', 0.55); playSound('rauch', 0.5);
      if (u && fxIm('geschosse', 4)) { const du = DU.get(u.id); for (const [c, r] of e.cells) { const [x, y] = center(c, r); shells.push({ fxi: 4, fxs: 0.8, x1: du.x, y1: du.y - s * 0.6, x2: x, y2: y, t: 0, dur: 18, arc: 1.4, spin: true, sz: 0.3 }); } await wait(18 * 16.667); }
      for (const [c, r] of e.cells) { const [x, y] = center(c, r); boom(x, y, s * 0.7, 'dust', Math.random() * 8); } visSync('smoke'); floater(...headPos(e.u), 'Nebelwand', '#e6e6e0'); await wait(450); break; }
    case 'tunnel': { playSound('tick', 0.45); playSound('bauen', 0.3); const [x, y] = center(e.c, e.r); floater(x, y - s * 0.6, 'Stollen: 2 Runden', '#ffb86a', true); await wait(300); break; }
    case 'tunnelBlow': { const [x, y] = center(e.c, e.r); playSound('boom2', 0.8); playSound('grenade2', 0.6); boom(x, y, s * 1.6, 'he'); burst(x, y, 30, ['#5a4632', '#3d3024', '#8a7a52'], { up: 0.45, spread: 0.4 }); banner('Stollen gesprengt', ''); await wait(700); break; }
    case 'lanceblast': { const [x, y] = center(e.c, e.r); playSound('grenade2', 0.6); boom(x, y - s * 0.2, s * 0.6, 'he'); floater(x, y - s * 0.9, 'Sprenglanze!', '#ffb04a', true); const dd = DU.get(e.a); if (dd) dd.vs.lance = false; await wait(200); break; }
    case 'blast': { const [x, y] = center(e.c, e.r); playSound('tick', 0.5); await wait(450); playSound('blast', 0.8); boom(x, y, s * 1.1, 'he'); burst(x, y, 18, ['#ffd27a', '#5a4632'], { up: 0.3, spread: 0.3 }); await wait(380); break; }
    case 'mineLaid': { const [x, y] = center(e.c, e.r); playSound('tick', 0.4); playSound('bauen', 0.3); floater(x, y - s * 0.5, `Mine gelegt (${e.left} übrig)`, '#e6d48a'); await wait(220); break; }
    case 'mine': { const [x, y] = center(e.c, e.r); playSound('grenade2', 0.75); boom(x, y, s * 1.0, 'he'); floater(x, y - s * 0.9, 'Mine!', '#ff9a6a', true); await wait(380); break; }
    case 'light': { visSync('lit'); playSound('clank', 0.4); floater(...headPos(e.u), 'Ausgeleuchtet', '#fff0a0'); await wait(260); break; }
    case 'clear': { visSync('clouds'); playSound('gasmaske', 0.5); floater(...headPos(e.u), e.n ? 'Gas entgiftet' : 'kein Gas', '#c4e6a0'); await wait(260); break; }
    case 'ammo': { playSound('nachladen', 0.55); floater(...headPos(e.u), 'nachgeladen', '#ffe7a0', true); await wait(260); break; }
    case 'counterstrike': { playSound('charge', 0.6, null, { u: unitById(e.u) }); floater(...headPos(e.u), 'Gegenstoß!', '#ff8a6a', true); await wait(250); break; }
    case 'score': { const hs = OBJECTIVES.filter(o => G.ctrl[o.id] === e.side); for (const o of hs) { const [x, y] = center(o.c, o.r); floater(x, y - s * 1.5, '+' + o.pts, sideCol(e.side), true); } await wait(350); updateUI(); break; }
    case 'unstuck': DU.get(e.u).vs.stuck = 0; floater(...headPos(e.u), 'wieder frei', '#b8ff7c'); await wait(150); break;
    case 'recovered': { const dr = DU.get(e.u); if (dr) { dr.vs.broken = 0; dr.vs.stuck = 0; } playSound('reparieren', 0.6); floater(...headPos(e.u), e.broken ? 'instand gesetzt' : 'geborgen', '#b8ff7c', true); await wait(320); break; }
    case 'setup': { DU.get(e.u).vs.setup = true; playSound('clank', 0.5); playSound('mgsetup', 0.5); floater(...headPos(e.u), 'aufgebaut', '#ffe7a0'); await wait(200); break; }
    case 'teardown': { DU.get(e.u).vs.setup = false; playSound('clank', 0.5); floater(...headPos(e.u), 'abgebaut', '#ffe7a0'); await wait(200); break; }
    case 'ow': floater(...headPos(e.u), 'Feuerbereit', '#F0EDE1', true); await wait(220); break;
    case 'bigorder': {   // großer Befehl: auffällige Ansage, Pfeife (Konkordat) bzw. Horn (Aschenwacht)
      playSound(e.kind === 'assault' ? 'generalhorn' : 'march', 0.5, e.side);   /* Anführer-Fähigkeiten leiser (Spieltest Runde 2) */ banner(e.name + '!', e.kind === 'hold' ? `Einheiten bis ${P.BIG_R} Felder: keine Flucht, Abwehr ×1,25 bis zum nächsten Zug` : `Einheiten bis ${P.BIG_R} Felder: +1 Aktionspunkt`);
      for (const id of e.ids || []) { const dd = DU.get(id); if (!dd) continue; if (e.kind === 'hold') dd.vs.hold = true; rings.push({ x: dd.x, y: dd.y, r: 1.2, col: '#E2B04A', life: 40, max: 40 }); }
      floater(...headPos(e.u), e.name + '!', '#E2B04A', true); await wait(900); break; }
    case 'banner': { const dd = DU.get(e.u); if (dd) dd.vs.planted = e.planted; playSound(e.planted ? 'bauen' : 'clank', 0.32); floater(...headPos(e.u), e.planted ? 'Banner aufgepflanzt' : 'Banner aufgenommen', '#E2B04A', true); await wait(260); break; }
    case 'ignite': visSync('fires'); playSound('flame', 0.4); break;
    case 'fireout': { const old = VIS.fires || []; visSync('fires'); for (const f of old) if (!(VIS.fires || []).some(q => q.c === f.c && q.r === f.r)) { const [x, y] = center(f.c, f.r); gmark('bodenspuren', 0, x, y + s * 0.1, { mul: 0.85 }); } break; }   // Brandfleck bleibt
    case 'burn': floater(...headPos(e.u), 'brennt!', '#ffb04a'); await wait(120); break;
    case 'steadfast': floater(...headPos(e.u), 'hält stand!', '#E2B04A', true); await wait(160); break;
    case 'dig': { const dd = DU.get(e.u); if (dd) dd.vs.dug = true; playSound('bauen', 0.35); for (let q = 0; q < 2; q++) setTimeout(() => playSound('grunzen', 0.4, null, { u, noGap: true }), (120 + q * (380 + Math.random() * 200)) / speed);   /* kurze Grunz-Laute, Gasmaske wie die Infanterie */ floater(...headPos(e.u), 'eingegraben', '#d9b48a', true); await wait(240); break; }
    case 'shields': { const dd = DU.get(e.u); if (dd) { dd.vs.shields = true; rings.push({ x: dd.x, y: dd.y, r: 1.3, col: '#9aa3ab', life: 36, max: 36 }); } playSound('armor', 0.5); floater(...headPos(e.u), 'Schilde vor!', '#c9d0d6', true); await wait(260); break; }
    case 'rush': marschU = e.u; playSound(unitById(e.u) && unitById(e.u).side === 'D' ? 'roar' : 'forward', 0.7, null, { u: unitById(e.u) }); floater(...headPos(e.u), 'Sturmlauf!', '#ffb04a', true); await wait(200); break;
    case 'sperr': { const d = DU.get(e.u); d.vs.sperr = P.SPERR_SHOTS; playSound('clank', 0.4); floater(...headPos(e.u), 'Sperrfeuer', '#E2B04A', true); await wait(220); break; }
    case 'mark': { const [x, y] = center(e.c, e.r);
      if (fx('leuchtkugel', 0, x - s * 0.5, y + s * 0.2, { life: 34, rise: 1.7, mul: 0.75, fadeOut: 0.2 })) { fx('leuchtkugel', 1, x, y - s * 2.1, { delay: 30, life: 20, anchor: 'mitte', grow: 0.5, mul: 0.8 }); await wait(500); }
      visSync('marks'); playSound('whistle', 0.25); floater(x, y - s * 1.0, 'Ziel markiert', '#E2B04A', true);
      if (e.rev.length || e.mines) floater(x, y - s * 1.5, `aufgedeckt: ${[e.rev.length ? e.rev.length + ' Trupp' : '', e.mines ? e.mines + ' Mine' + (e.mines > 1 ? 'n' : '') : ''].filter(Boolean).join(', ')}`, '#F0EDE1');
      rings.push({ x, y, r: 1.2, col: '#E2B04A', life: 40, max: 40 }); await wait(300); break; }
    case 'march': floater(...headPos(e.u), 'Marsch', '#ffd27a'); marschU = e.u; break;   // Marschtritt beim folgenden Zug (statt normaler Schritte)
    case 'retreatmove': floater(...headPos(e.u), 'Rückzug', '#ffd27a'); break;
    case 'freeblow': { const a = DU.get(e.a), d = DU.get(e.u); if (!a || !d) break; const fl = d.x < a.x; a.face = d.x >= a.x ? 0 : 3;   // Freischlag: kurzer Nahkampf-Effekt am Weichenden
      a.lunge = { dx: (d.x - a.x) * 0.18, dy: (d.y - a.y) * 0.18 }; { const sd = unitById(e.a).side; playSound(sd === 'A' ? 'nahA' : 'nahD', 0.45, sd); }
      if (!fx('nahkampf', Math.random() < 0.5 ? 0 : 3, d.x + (fl ? 1 : -1) * L.s * 0.1, d.y - L.s * 0.45, { anchor: 'mitte', life: 18, fadeOut: 0.6, grow: 0.2, flip: fl, mul: 0.7 })) boom(d.x, d.y - L.s * 0.3, L.s * 0.3, 'dust');
      floater(d.x, d.y - L.s * 1.15, 'Freischlag', '#ffb07a'); await wait(220); a.lunge = null; await wait(80); break; }
    case 'wind': toast('Der Wind dreht.'); updateTop(); break;
    case 'limber': DU.get(e.u).vs.limbered = !!e.on; playSound('clank', 0.6); floater(...headPos(e.u), e.on ? 'aufgeprotzt' : 'abgeprotzt', '#e9d9a8'); await wait(220); break;
    case 'spawn': { playSound('whistle', 0.5); addDU(u); const d = DU.get(e.u), [x] = center(u.c, u.r), dir = u.side === 'A' ? -1 : 1; toast(`Nachschub: ${nm(u)} trifft ein.`);
      for (let k = 0; k < 16; k++) { d.x = x + dir * s * 2 * (1 - (k + 1) / 16); await raf(); } floater(...headPos(e.u), 'Nachschub', '#b8ff7c'); await wait(200); break; }
    case 'heal': { playSound('heal', 0.5); const d = DU.get(e.u); d.str = e.str; d.mor = e.morv; if (e.cured) { d.vs.poison = 0; floater(...headPos(e.u), 'Entgiftet', '#a8c870'); } if (e.by != null) { const m = DU.get(e.by); m.face = d.x >= m.x ? 0 : 3; shells.push({ x1: m.x, y1: m.y - s * 0.5, x2: d.x, y2: d.y - s * 0.4, t: 0, dur: 14, arc: 0.5, img: 'bandage', sz: 0.34 }); await wait(240); }
      rings.push({ x: d.x, y: d.y - s * 0.55, r: 0.8, img: ['crossF1', 'crossF2', 'crossF3', 'crossG'][Math.floor(Math.random() * 4)], life: 50, max: 50 }); floater(...headPos(e.u), 'versorgt', '#8fe0c8', true); await wait(350); break; }
    case 'gascloud': visSync('clouds'); break;
    case 'reinf': {
      for (const id of e.ids) { const nu = unitById(id); addDU(nu); const d = DU.get(id); d.x += s * 2; }
      banner('Gegenstoß der Aschenwacht', 'Sturmbrecher und Brandwerfer treffen ein'); playSound('horn', 0.5); playSound('march', 0.4);
      await Promise.all(e.ids.map(async id => { const d = DU.get(id), nu = unitById(id), [x] = center(nu.c, nu.r); for (let k = 0; k < 20; k++) { d.x = x + s * 2 * (1 - (k + 1) / 20); await raf(); } }));
      await wait(900); break;
    }
  }
}
function play(events) {
  queue.push(...events);
  if (!qRunning) runQueue();
  return new Promise(res => { const chk = () => (!qRunning && !queue.length) ? res() : setTimeout(chk, 30); chk(); });
}
async function runQueue() {
  qRunning = true;
  while (queue.length) { const e = queue.shift(); try { await playEvent(e); } catch (err) { console.error(err); } }
  syncAll(); qRunning = false; updateUI();
  if (G.over) setTimeout(showEnd, 500);
}

// ---------- Eingabe ----------
let lastSP = [0, 0];   // letzter Zeigerpunkt in Schirm-Pixeln des Canvas (neue Ansicht: Aufsteller und Marken werden dort getroffen)
function evToPx(ev) { const r = cv.getBoundingClientRect(), sx = (ev.clientX - r.left) * cv.width / r.width, sy = (ev.clientY - r.top) * cv.height / r.height; lastSP = [sx, sy];
  if (VIEW.tilt()) { camSetup(); return unproj(sx, sy) || [-1e6, -1e6]; }   // neue Ansicht: Punkt auf dem Boden im Weltbild
  return [sx, sy]; }
// Was liegt unter dem Zeiger? h = Feld, uHex = Einheit auf diesem Feld, uFig = vorderste Figur, deren Körper man dort sieht
function pick(x, y) {
  const h = pixToHex(x, y), uHex = h ? E.unitAt(G, h[0], h[1]) : null;
  if (VIEW.tilt()) { let uFig = null; for (let i = UBOX.length - 1; i >= 0; i--) { const b = UBOX[i]; if (lastSP[0] >= b.x0 && lastSP[0] <= b.x1 && lastSP[1] >= b.y0 && lastSP[1] <= b.y1) { uFig = b.u; break; } } return { h, uHex, uFig }; }   // Aufsteller: vorderster getroffener Kasten
  let uFig = null;
  for (const u of G.units) {
    if (!E.alive(u)) continue;
    const d = DU.get(u.id);
    if (Math.abs(x - d.x) < L.s * 0.42 && y < d.y + L.s * kAt(d.x, d.y) * 0.5 && y > d.y - L.s * Math.min(0.62, SQ3 * kAt(d.x, d.y) * 0.55)) if (!uFig || d.y > DU.get(uFig.id).y) uFig = u;
  }
  return { h, uHex, uFig };
}
function unitAtPixel(x, y) { const p = pick(x, y); return p.uFig || p.uHex; }
const targetOf = p => p.uHex && targets.has(p.uHex.id) ? p.uHex : p.uFig && targets.has(p.uFig.id) ? p.uFig : null;
let drag = null, dragged = 0;
document.addEventListener('pointerdown', ev => { lastPT = ev.pointerType || 'touch'; }, true);   // Maus oder Finger: zuletzt benutzt, überall (z. B. Nachschub-Menü)
cv.addEventListener('pointerdown', ev => { lastPT = ev.pointerType || 'touch'; if (!pinch) drag = { x: ev.clientX, y: ev.clientY, sl: board.scrollLeft, st: board.scrollTop, moved: false }; });   // Maus und Finger verschieben
window.addEventListener('pointerup', () => { if (drag && drag.moved) dragged = performance.now(); drag = null; cv.style.cursor = ''; });
// Kleine Pfeile am Rand zeigen, wohin man noch verschieben kann (Wunsch des Nutzers); antippen verschiebt ein Stück
const SCR = {};
for (const [k, ch] of [['l', '◀'], ['r', '▶'], ['u', '▲'], ['d', '▼']]) {
  const el = document.createElement('button'); el.className = 'scrhint ' + k; el.textContent = ch; el.hidden = true; el.setAttribute('aria-label', 'Karte verschieben');
  el.addEventListener('click', () => { userCam(); const dx = k === 'l' ? -1 : k === 'r' ? 1 : 0, dy = k === 'u' ? -1 : k === 'd' ? 1 : 0; if (VIEW.tilt()) return camPan(dx * 0.4, dy * 0.4); board.scrollBy({ left: dx * board.clientWidth * 0.4, top: dy * board.clientHeight * 0.4, behavior: 'smooth' }); });
  document.body.appendChild(el); SCR[k] = el;
}
function updScroll() {
  if (VIEW.tilt()) { for (const k in SCR) SCR[k].hidden = true; return; }   // neue Ansicht: Kamera statt Scrollen
  const b = board.getBoundingClientRect(), sl = board.scrollLeft, st = board.scrollTop, mx = board.scrollWidth - board.clientWidth, my = board.scrollHeight - board.clientHeight;
  const show = { l: sl > 4, r: sl < mx - 4, u: st > 4, d: st < my - 4 };
  for (const k in SCR) {
    const el = SCR[k]; el.hidden = !show[k] || !G || !document.querySelector('#start')?.hidden; if (el.hidden) continue;
    const x = k === 'l' ? b.left + 6 : k === 'r' ? b.right - 34 : b.left + b.width / 2 - 14, y = k === 'u' ? b.top + 6 : k === 'd' ? b.bottom - 34 : b.top + b.height / 2 - 14;
    el.style.left = x + 'px'; el.style.top = y + 'px';
  }
}
board.addEventListener('scroll', updScroll, { passive: true }); addEventListener('resize', () => setTimeout(updScroll, 50)); setInterval(updScroll, 700);
board.addEventListener('wheel', ev => {   // Mausrad (und Touchpad-Pinch = Strg) zoomt auf den Punkt unter dem Zeiger; Umschalt + Rad verschiebt waagrecht
  if (!G) return; ev.preventDefault(); userCam();
  if (ev.shiftKey && !ev.ctrlKey) { if (VIEW.tilt()) camPan((ev.deltaY || ev.deltaX) / 600, 0); else board.scrollLeft += ev.deltaY || ev.deltaX; return; }
  const dy = ev.deltaMode === 1 ? ev.deltaY * 30 : ev.deltaY; setZoom((zPend || ZOOM) * Math.exp(-dy * (ev.ctrlKey ? 0.006 : 0.0015)), ev.clientX, ev.clientY);
}, { passive: false });
cv.addEventListener('pointermove', ev => {
  if (drag && !pinch && (ev.buttons & 1)) { const dx = ev.clientX - drag.x, dy = ev.clientY - drag.y; if (drag.moved || Math.hypot(dx, dy) > (ev.pointerType === 'mouse' ? 8 : 14)) { drag.moved = true; userCam(); cv.style.cursor = 'grabbing';
    if (VIEW.tilt()) camDrag(drag, ev); else { board.scrollLeft = drag.sl - dx; board.scrollTop = drag.st - dy; } return; } }
  if (!G || ev.pointerType !== 'mouse') return;
  const [x, y] = evToPx(ev), p = pick(x, y);
  hoverHex = p.h;
  const movable = sel && !busy && p.h && reach.has(E.key(p.h[0], p.h[1]));
  hoverU = movable ? null : (p.uFig || p.uHex);
  if (sel && !busy) { const np = targetOf(p); if (np !== previewT) { previewT = np; updateHud(); } }
  { const c = cursorFor(p); if (cv.style.cursor !== c && cv.style.cursor !== 'grabbing') cv.style.cursor = c; }
});
cv.addEventListener('pointerleave', () => { hoverHex = null; hoverU = null; hideTip(); cv.style.cursor = ''; });
// Mauszeiger (Paket 2, nur Maus): Schwert über Gegnern für Nahkampf, Fadenkreuz für Beschuss, durchgestrichener Kreis, wenn nichts geht
const CUR = (svg, x, y, fb) => `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'>${svg}</svg>`)}") ${x} ${y}, ${fb}`;
const CURSOR = {
  schwert: CUR("<g stroke='#120D0B' stroke-width='2' stroke-linejoin='round'><path d='M3 3 L8 4.5 L22 18.5 L18.5 22 L4.5 8 Z' fill='#E8E2D0'/><path d='M8 4.5 L21 17.5' stroke='#9a917c' stroke-width='1'/><path d='M16.5 24 L24 16.5 L26 18.5 L18.5 26 Z' fill='#C2A461'/><path d='M22.5 22.5 L28 28' stroke-width='5' stroke-linecap='round'/><path d='M22.5 22.5 L28 28' stroke='#6b4a2a' stroke-width='2.6' stroke-linecap='round'/></g>", 3, 3, 'crosshair'),
  ziel: CUR("<g fill='none' stroke-linecap='round'><circle cx='16' cy='16' r='9.5' stroke='#120D0B' stroke-width='5'/><circle cx='16' cy='16' r='9.5' stroke='#C2A461' stroke-width='2.4'/><path d='M16 1.5v8M16 22.5v8M1.5 16h8M22.5 16h8' stroke='#120D0B' stroke-width='5'/><path d='M16 2.5v7M16 22.5v7M2.5 16h7M22.5 16h7' stroke='#E8E2D0' stroke-width='2.2'/></g><circle cx='16' cy='16' r='1.8' fill='#8E2B22' stroke='#120D0B'/>", 16, 16, 'crosshair'),
  nein: CUR("<g fill='none'><circle cx='16' cy='16' r='10' stroke='#120D0B' stroke-width='6'/><path d='M9 23 L23 9' stroke='#120D0B' stroke-width='6' stroke-linecap='round'/><circle cx='16' cy='16' r='10' stroke='#8E2B22' stroke-width='3'/><path d='M9 23 L23 9' stroke='#8E2B22' stroke-width='3' stroke-linecap='round'/></g>", 16, 16, 'not-allowed'),
  // Leuchtkugel (Ziel markieren) und Feldzeiger (andere Feld-Fähigkeiten) – Spieltest Runde 2, Punkt 20
  leucht: CUR("<g stroke='#120D0B' stroke-width='2' stroke-linejoin='round'><path d='M16 30 L16 15' stroke='#120D0B' stroke-width='4'/><path d='M16 30 L16 15' stroke='#C2A461' stroke-width='2'/><circle cx='16' cy='10' r='6.5' fill='#FFE08A'/><circle cx='16' cy='10' r='3' fill='#FFF7D6' stroke='none'/></g><g stroke='#FFD24A' stroke-width='1.6' stroke-linecap='round'><path d='M6 10 L3 10 M26 10 L29 10 M8.5 3.5 L6.5 1.5 M23.5 3.5 L25.5 1.5'/></g>", 16, 30, 'crosshair'),
  feld: CUR("<g fill='none' stroke-linejoin='round'><path d='M16 4 L27 10 L27 22 L16 28 L5 22 L5 10 Z' stroke='#120D0B' stroke-width='5'/><path d='M16 4 L27 10 L27 22 L16 28 L5 22 L5 10 Z' stroke='#E2B04A' stroke-width='2.4'/></g><circle cx='16' cy='16' r='3.2' fill='#E2B04A' stroke='#120D0B' stroke-width='1.5'/>", 16, 16, 'pointer'),
};
const abilCursor = () => { if (feldArt === 'zweit') return CURSOR.ziel; if (feldArt === 'cut') return CURSOR.feld; const a = sel && TYPES[sel.type].abil; return a === 'mark' ? CURSOR.leucht : a === 'strike' || a === 'charge' ? CURSOR.ziel : CURSOR.feld; };
function cursorFor(p) {
  if (!G || !sel || busy || !human(G.side) || G.over || drag) return '';
  const u = p.uFig || p.uHex;
  { const hk = u ? E.key(u.c, u.r) : p.h && E.key(p.h[0], p.h[1]); if (abilMode && hk != null && abilSet.has(hk)) return abilCursor(); }   // Feld-Fähigkeit gewählt: gültiges Feld (auch mit Einheit darauf)
  if (u && u.side !== sel.side && E.alive(u)) { const t = targets.get(u.id); if (!t) return shellHexes.has(E.key(u.c, u.r)) ? CURSOR.ziel : CURSOR.nein;   // Artillerie: Ziel geht vor „nicht begehbar“
    const k = t.both ? (atkPref !== 'auto' ? atkPref : t.kind) : t.kind; return k === 'melee' ? CURSOR.schwert : CURSOR.ziel; }
  if (u && u.side === sel.side) return '';
  const k = p.h && E.key(p.h[0], p.h[1]);
  if (!k || reach.has(k) || abilSet.has(k) || shellHexes.has(k) || healSet.has(k) || sendSet.has(k) || recSet.has(k) || spawnSet.has(k)) return '';
  return CURSOR.nein;
}
// Pergament-Tooltips für Marken (Karte und Panel), per Maus beim Drüberfahren, per Touch durch Antippen oder langes Drücken
const mtip = document.createElement('div'); mtip.className = 'mtip'; mtip.setAttribute('role', 'tooltip'); document.body.appendChild(mtip);
let tipKey = null, tipTm = 0;
const tipHtml = list => list.filter(Boolean).map(t => `<b>${upEsc(t.name)}</b><span>${upEsc(t.text)}</span>`).join('');
function showTip(list, cx, cy, key, ms) {
  clearTimeout(tipTm); if (ms) tipTm = setTimeout(hideTip, ms);
  if (key !== tipKey) { mtip.innerHTML = tipHtml(list); tipKey = key; }
  const w = mtip.offsetWidth, h = mtip.offsetHeight;
  mtip.style.left = Math.round(Math.max(8, Math.min(innerWidth - w - 8, cx - w / 2))) + 'px';
  mtip.style.top = Math.round(cy - h - 18 < 8 ? cy + 26 : cy - h - 18) + 'px';
  mtip.classList.add('show');
}
function hideTip() { clearTimeout(tipTm); tipKey = null; mtip.classList.remove('show'); }
function markAt(x, y) { for (let i = MARKS.length - 1; i >= 0; i--) { const m = MARKS[i]; let px = x, py = y;
    if (m.tf) { const q = new DOMPoint(lastSP[0], lastSP[1]).matrixTransform(m.tf.inverse()); px = q.x; py = q.y; }   // Marke am Aufsteller: Zeigerpunkt in dessen Koordinaten
    if (px >= m.x0 && px <= m.x1 && py >= m.y0 && py <= m.y1) return m; } return null; }
function markTips(m) {
  const u = m.u, d = DU.get(u.id), T = TYPES[u.type];
  if (!d || !E.alive(u)) return [];
  if (m.kind === 'supp') { const st = STATES.find(q => q.k === 'supp'); return [{ name: st.name, text: st.text(u, d) }]; }
  if (m.kind === 'state') return statesOf(u, d).filter(st => !st.panel && st.k !== 'supp').map(st => st.blockiert && st.blockiert(u, d) ? { name: st.name + ' (blockiert)', text: st.textBlock(u, d) } : { name: st.name, text: st.text(u, d) });
  if (m.kind === 'cover') return [coverTip(u)];
  if (m.kind === 'pv') { const pv = m.pv, cn = ['', 'Bronze', 'Silber', 'Gold'][pv.cov];
    const n = reach.get(E.key(pv.c, pv.r));
    return [pv.threat.length && { name: `Warndreieck: ${pv.threat.length} ${pv.threat.length === 1 ? 'Schütze' : 'Schützen'}`, text: `So viele Gegner können auf dieses Feld schießen (rot umrandet).` },
      { name: 'Von diesem Feld', text: `${pv.hit.length ? `${pv.hit.length} ${pv.hit.length === 1 ? 'Ziel' : 'Ziele'} in Reichweite (Messinglinien).` : 'Kein Ziel in Reichweite.'} ${pv.cov ? `Schild: Deckung ${cn}.` : 'Keine Deckung.'}` },
      n && (n.march ? { name: `Marsch – noch ${n.rest} BP, keine Aktion mehr`, text: `Stiefel mit Flügeln: die Aktion wird zu +50 % Bewegung, Weg ${n.cost}. Danach kann die Einheit in dieser Runde nicht mehr schießen oder handeln.` }
        : { name: `Stiefel: Weg ${n.cost} · noch ${n.rest} BP${n.retreat ? ' · Rückzug' : ''}`, text: n.retreat ? `Rückzug aus der Feindberührung, kostet die Aktion und alle Bewegungspunkte.${E.freeBlows(G, sel).length ? ` Freischlag: jeder angrenzende Nahkämpfer trifft einmal (je etwa −10 Stärke, wie Stacheldraht), zusammen ${fbTxt(sel).replace(' · Freischlag ', '')} Stärke (keine Moral).` : ' Kein Freischlag: kein Gegner daneben kann zuschlagen.'}` : `Bewegung bis hierher für 1 Aktionspunkt.${n.via ? ' Über den Wegpunkt.' : ' Umschalt+Klick (Finger: lange drücken) setzt einen Wegpunkt.'}` })]; }
  if (m.kind === 'lead') { const cd = n => n > 0 ? `wieder in ${upRunden(n)}` : 'bereit'; return [{ name: `Anführer: ${u.officer}`, text: `Befehle an Truppen in Reichweite. Sammeln ${cd(u.cdR)}, Sturmbefehl ${cd(u.cdS)}.${u.ordered ? ' In dieser Runde schon befohlen.' : ''} Dunkler Orden: gerade kein Befehl möglich.` }]; }
  if (m.kind === 'ap') { const aus = d.vs.broken || d.vs.supp, ap = aus ? 0 : (u.ap || 0), bp = aus ? 0 : (u.bp || 0), Z = TYPES[u.type].zweit;
    return [{ name: `Bewegung ${bp} von ${E.bpMax(u)} · Aktion ${ap ? 'frei' : 'verbraucht'}`, text: `Helle Punkte = Bewegungspunkte (Gelände kostet 1–3), die Münze = die eine Aktion der Runde (Schießen, Nahkampf, Befehl, Fähigkeit, Marsch).${Z ? ` Kleine Münze: ${Z.name}, einmal je Runde zusätzlich.` : ''}` }]; }
  return [{ name: `Stärke ${fmt(d.str)} von 100`, text: `Moral ${fmt(d.mor)} von ${fmt(T.mor)}. Der Balken zeigt die Stärke in der Farbe der Seite.` }];
}
const markKey = m => m.u.id + m.kind + (m.pv ? m.pv.id : '');
cv.addEventListener('pointermove', ev => {
  if (ev.pointerType !== 'mouse' || !G || (drag && drag.moved)) return;
  const [x, y] = evToPx(ev), m = markAt(x, y);
  if (m) showTip(markTips(m), ev.clientX, ev.clientY, markKey(m)); else if (tipKey && !String(tipKey).startsWith('hud')) hideTip();
});
{ let tm = 0, long = false;
  cv.addEventListener('pointerdown', ev => { long = false; clearTimeout(tm); if (ev.pointerType === 'mouse' || !G) return;
    const [x, y] = evToPx(ev), m = markAt(x, y), cx = ev.clientX, cy = ev.clientY;
    hoverHex = pixToHex(x, y);   // Finger: Feld darunter wie beim Drüberfahren hervorheben (z. B. Symbol auf Fähigkeits-Zielfeldern)
    if (!m) { hideTip(); const h0 = hoverHex;   // langes Drücken auf ein Zugfeld: Wegpunkt (Paket 3)
      if (sel && h0 && !busy && (reach.has(E.key(h0[0], h0[1])) || (wayPt && wayPt[0] === h0[0] && wayPt[1] === h0[1]))) tm = setTimeout(() => { long = true; setWayPt(h0); }, 420);
      return; }
    showTip(markTips(m), cx, cy, markKey(m), 3000);   // Antippen: zeigt den Tooltip, der Tipp wirkt trotzdem
    tm = setTimeout(() => { long = true; showTip(markTips(m), cx, cy, markKey(m), 4000); }, 420); });   // langes Drücken: nur Tooltip
  const stop = () => clearTimeout(tm);
  cv.addEventListener('pointerup', stop); cv.addEventListener('pointercancel', stop);
  cv.addEventListener('click', ev => { if (long) { long = false; ev.stopImmediatePropagation(); ev.preventDefault(); } }, true);
  cv.addEventListener('contextmenu', ev => { if (ev.pointerType !== 'mouse') ev.preventDefault(); });
}
cv.addEventListener('click', ev => {
  if (performance.now() - dragged < 250) return;   // war ein Verschieben, kein Klick
  if (G && G.aufstellung) { const h = pick(...evToPx(ev)).h; if (aufstellWahl && h) aufstellSetze(aufstellWahl, h[0], h[1]); return; }   // Aufstellung: gewählte Einheit auf das Feld
  if (!G || busy || G.over || !human(G.side)) return;
  const [x, y] = evToPx(ev), p = pick(x, y), h = p.h;
  if (placing) { if (h && spawnSet.has(E.key(h[0], h[1]))) return doBuy(h[0], h[1]); return; }
  if (sel) {
    // Mit gewählter Einheit zählt zuerst das Feld: Ziel, Zugfeld oder Beschussfeld, egal welche Figur davorsteht
    if (abilMode && h && abilSet.has(E.key(h[0], h[1]))) { abilMode = false; const art = feldArt; feldArt = 'abil';
      if (art === 'cut') return act(m => E.cutWire(G, m, h[0], h[1]));
      if (art === 'zweit') { const d = G.units.find(x => x.c === h[0] && x.r === h[1] && E.alive(x) && x.side !== sel.side); return d ? act(m => E.zweitFire(G, m, d)) : undefined; }
      return act(m => E.useAbil(G, m, h[0], h[1])); }
    if (TYPES[sel.type].cls === 'art' && h && shellHexes.has(E.key(h[0], h[1]))) return doShell(h[0], h[1]);
    const tu = targetOf(p);
    if (tu) { if (previewT === tu || lastPT === 'mouse') return doAttack(tu); previewT = tu; updateHud(); return; }
    if (h && ev.shiftKey && lastPT === 'mouse' && (reach.has(E.key(h[0], h[1])) || (wayPt && wayPt[0] === h[0] && wayPt[1] === h[1]))) { setWayPt(h); return; }   // Umschalt+Klick: Wegpunkt setzen/aufheben
    if (h && reach.has(E.key(h[0], h[1]))) {   // Finger: erstes Antippen zeigt die Vorschau von dort, zweites zieht (wie beim Angriff)
      const k = E.key(h[0], h[1]); if (lastPT === 'mouse' || touchMove === k) return doMove(h[0], h[1]);
      touchMove = k; hoverHex = h; updateHud(); return; }
  }
  const u = p.uFig || p.uHex;
  { const hu = [p.uHex, p.uFig].find(q => q && healSet.has(q.id)); if (sel && hu) return act(m => E.heal(G, m, hu)); }
  { const ru = [p.uHex, p.uFig].find(q => q && recSet.has(q.id)); if (sel && ru) return act(m => E.recover(G, m, ru)); }
  { const su = [p.uHex, p.uFig].find(q => q && sendSet.has(q.id)); if (sel && su) return act(m => E.sendOrder(G, m, su)); }
  if (u && u.side === G.side && E.active(u)) { if (u === sel && human(u.side)) klickStimme(u); return select(u); }   // auch erneutes Anklicken der gewählten Einheit
  if (u) { select(null); inspect = { unit: u }; updateHud(); return; }
  select(null);
  if (h) { inspect = { hex: h }; updateHud(); }
});

// Auswahl-Stimme (2026-11-17, neu): bei JEDEM Anklicken einer eigenen Einheit ein Spruch aus ihrem Satz – Infanterie (Gasmaske leicht),
// Kampfanzüge (Gasmaske mittel), Anführer (ohne Filter), Panzer (Bordfunk, Motor leise darunter), Schreiter/Eisenknecht (Maschine), Reiter (Pferd + Spruch).
// Jede Einheit hat fest eine Stimme ihres Satzes (reihum verteilt, auch beim Nachschub); je Stimme reihum gemischt, nie derselbe Spruch zweimal nacheinander.
// Wer sehr schnell nacheinander klickt (< 1 s), bricht den laufenden Spruch ab statt ihn zu überlagern. Tonplätze sv_<satz>_<Seite><Stimme>.
const stimmeVon = new Map(), stimmeNaechste = {}, stimmeBeutel = {};
let stimmeLauf = null;
function stimmSatz(u) { const T = TYPES[u.type]; return PANZER.includes(u.type) ? 'panzer' : T.cls === 'walker' ? 'schreiter' : T.suit ? 'anzug' : T.cmd ? 'fuehrer' : 'inf'; }
function stimmPool(u) {
  const satz = stimmSatz(u), basis = `sv_${satz}_${u.side}`; let n = 0; while (SND_POOLS[basis + (n + 1)]) n++; if (!n) return null;
  if (!stimmeVon.has(u.id)) { const z = stimmeNaechste[basis] || 0; stimmeVon.set(u.id, (z % n) + 1); stimmeNaechste[basis] = z + 1; }   // feste Stimme, reihum
  return basis + stimmeVon.get(u.id);
}
function stimmZiehen(pool) {   // Beutel: alle Sprüche der Stimme gemischt, nacheinander; neuer Beutel beginnt nie mit dem letzten Spruch
  const alle = (SND_POOLS[pool] || []).map(e => e[0]).filter(k => SND[k]); if (!alle.length) return null;
  let b = stimmeBeutel[pool]; if (!b || !b.rest.length) { const neu = alle.slice().sort(() => Math.random() - 0.5); if (b && neu.length > 1 && neu[0] === b.letzt) neu.push(neu.shift()); b = stimmeBeutel[pool] = { rest: neu, letzt: b && b.letzt }; }
  const k = b.rest.shift(); b.letzt = k; return k;
}
function klickStimme(u) { refreshSpent(); if (spent.has(u.id)) playSound('klick', 0.2, null, { noGap: true }); else selectVoice(u); }   // ausgegraut (fertig): kein Spruch
function selectVoice(u) {
  if (!soundOn || speed >= INSTANT) return;
  const pool = stimmPool(u); const k = pool && stimmZiehen(pool); if (!k) return;
  const t = performance.now();
  if (stimmeLauf && t - stimmeLauf.t < 1000) { try { stimmeLauf.a.pause(); } catch (e) {} if (stimmeLauf.m) stimmeLauf.m.stop(); }   // sehr schnell geklickt: abbrechen statt überlagern
  const T = TYPES[u.type], panzer = PANZER.includes(u.type);
  let m = null; if (panzer) { const mk = sndPick('motor_auswahl', u.side); if (mk) m = motorRev(mk, { vol: 0.13, dauer: 0.7 }); }   // Motor leiser und kürzer, die Stimme liegt klar darüber
  if (T.cls === 'cav') playSound('pferd_auswahl', 0.26, u.side, { noGap: true });   // Reiter: Pferd und Spruch
  try { const a = SND[k].cloneNode(); a.volume = Math.min(1, 0.34 * effektVol); const p = a.play(); if (p && p.catch) p.catch(() => {});
    stimmeLauf = { a, t, m }; window.__sndBy = window.__sndBy || {}; window.__sndBy[k] = (window.__sndBy[k] || 0) + 1; } catch (e) {}
}
// Motor kurz aufheulen lassen („Rumm“, ca. 1 s): einblenden, Tonhöhe 0,8× → 1,2× wie leicht Gas geben, ausblenden (Paket 4)
function motorRev(k, o = {}) {   // o.vol (Grundlautstärke), o.dauer (s): beim Anklicken leiser und kürzer, damit die Stimme darüber klar bleibt
  if (!soundOn || !SND[k] || speed >= INSTANT) return null;
  const V = o.vol || 0.32, D = o.dauer || 1.1; let aus = false;
  try { const a = SND[k].cloneNode(); a.preservesPitch = false; a.mozPreservesPitch = false; a.webkitPreservesPitch = false; a.volume = 0; a.playbackRate = 0.8;
    const p = a.play(); if (p && p.catch) p.catch(() => {}); const t0 = performance.now();
    const tick = () => { const t = (performance.now() - t0) / 1000; if (t > D || aus) { a.pause(); return; }
      try { a.volume = V * effektVol * Math.min(1, t / 0.08) * Math.min(1, Math.max(0, (D - t) / (D * 0.36))); a.playbackRate = 0.8 + 0.4 * Math.min(1, t / (D * 0.4)); } catch (e) {}
      setTimeout(tick, 30); };
    tick(); window.__sndBy = window.__sndBy || {}; window.__sndBy[k] = (window.__sndBy[k] || 0) + 1; } catch (e) {}
  return { stop: () => { aus = true; } };
}
function select(u) {
  if (u && u !== sel && G && u.side === G.side && human(u.side) && E.active(u)) klickStimme(u);   // Spruch bei jedem Anwählen (Reiter: Pferd + Spruch); fertige Einheiten nur ein leiser Klick   // Reiter: Schnauben häufig, Wiehern etwa jedes 4. Mal (Gewicht im Tonplatz)   // Stimme beim Anwählen (selten, siehe selectVoice)
  if (u !== sel) wayPt = null;
  sel = u; if (u && G && u.side === G.side) lastSel[u.side] = u.id; previewT = null; inspect = null; artMode = 'he'; atkPref = 'auto';
  computeOptions(); updateHud();
}
// Nachbar über Kante i eines Felds (Ecke i liegt bei 60°·i, y nach unten; Spalten mit ungerader Nummer liegen halb tiefer)
function edgeNb(c, r, i) { const o = c & 1; return [[c + 1, r + o], [c, r + 1], [c - 1, r + o], [c - 1, r - 1 + o], [c, r - 1], [c + 1, r - 1 + o]][i]; }
// Außenkanten einer Feldmenge (für eine einzige Kontur statt Rahmen um jedes Feld)
function contourOf(set) { const out = []; for (const k of set) { const c = Math.floor(k / 100), r = k % 100; for (let i = 0; i < 6; i++) { const [nc, nr] = edgeNb(c, r, i); if (!set.has(E.key(nc, nr))) out.push([c, r, i]); } } return out; }
// Vorschau: was die gewählte Einheit VON einem erreichbaren Feld aus beschießen könnte, wer dorthin schießen kann, welche Deckung es hat
function previewFrom(c, r) {
  const n = reach.get(E.key(c, r)); if (!n || !sel) return null;
  const id = sel.id + ':' + c + ':' + r; if (pvCache && pvCache.id === id) return pvCache;
  const T0 = TYPES[sel.type], ghost = { ...sel, c, r, ap: n.march || n.retreat ? 0 : sel.ap, bp: n.rest, bpUsed: (sel.bpUsed || 0) + n.cost, setup: T0.mg ? false : sel.setup };   // MG muss nach dem Zug neu aufbauen
  const foes = G.units.filter(f => f.side !== sel.side && E.alive(f));
  const hit = T0.cls === 'art' ? [] : foes.filter(f => E.canFire(G, ghost, f));
  const threat = foes.filter(f => { const F = TYPES[f.type]; if (!E.active(f) || f.supp > 0) return false; const d = E.dist(f.c, f.r, c, r);
    if (F.cls === 'art') return d >= 1 && d <= F.rng && (E.isDirect(G, f, c, r) || (d >= P.ART_MIN && E.spotted(G, f.side, c, r)));
    if (!(F.rng > 1) || E.immune(F, T0) || (T0.hidden && !(sel.revealed > 0) && d > 1)) return false;
    return d <= E.rangeOf(G, f, c, r) && E.hasLOS(G, f.c, f.r, c, r); });
  pvCache = { id, c, r, hit, threat, cov: E.coverOf(G, ghost).tier }; return pvCache;
}
function computeOptions() {
  reach = new Map(); targets = new Map(); shellHexes = new Set(); rangeSet = new Set(); healSet = new Set(); sightSet = new Set(); scoutSet = new Set();
  hideSet = new Set(); rangeEdges = []; touchMove = null; pvCache = null;
  if (!sel || !E.active(sel) || sel.side !== G.side) return;
  if (TYPES[sel.type].relay) for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) { const dd = E.dist(sel.c, sel.r, c, r); if (dd > 0 && dd <= TYPES[sel.type].spot && E.hasLOS(G, sel.c, sel.r, c, r)) sightSet.add(E.key(c, r)); }
  if (wayPt && !E.reachable(G, sel).has(E.key(wayPt[0], wayPt[1])) && !E.reachable(G, sel, { march: true }).has(E.key(wayPt[0], wayPt[1]))) wayPt = null;
  reach = E.reachable(G, sel, wayPt ? { via: wayPt } : undefined);
  for (const [k, n] of E.reachable(G, sel, { march: true, via: wayPt || undefined })) if (!reach.has(k)) reach.set(k, n);   // Marsch: gelbe Felder
  abilSet = new Set(); if (abilMode) for (const [c, r] of feldArt === 'cut' ? E.cutTargets(G, sel) : feldArt === 'zweit' ? E.zweitTargets(G, sel).map(d => [d.c, d.r]) : E.abilTargets(G, sel)) abilSet.add(E.key(c, r));
  recSet = new Set(); if (TYPES[sel.type].recover) for (const o of G.units) if (E.canRecover(G, sel, o)) recSet.add(o.id);
  if (TYPES[sel.type].cls === 'medic') for (const o of G.units) if (E.canHeal(G, sel, o)) healSet.add(o.id);
  sendSet = new Set(); if (TYPES[sel.type].courier) for (const o of G.units) if (E.canSend(G, sel, o)) sendSet.add(o.id);
  { const T0 = TYPES[sel.type], can = T0.cls === 'art' ? (!sel.limbered && !sel.attacked && sel.ap >= 1 && !sel.supp) : (T0.rng > 1 && !sel.attacked && sel.ap >= 1 && (!T0.mg || sel.setup));
    if (can) for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) { const d = E.dist(sel.c, sel.r, c, r); if (d >= 1 && d <= (T0.cls === 'art' ? T0.rng : E.rangeOf(G, sel, c, r)) && E.inFan(G, sel, c, r)) rangeSet.add(E.key(c, r)); }   // MG: nur im Schussfächer
    // Sicht: Felder in Sicht- bzw. Schussweite ohne Sichtlinie (Wald, Dorf, Fabrik, Kirche dazwischen, Rauch). Artillerie sieht selbst nur bis zur Direktschussweite.
    const SP = T0.cls === 'art' ? P.ART_DIRECT : Math.max(T0.spot || P.SPOT, T0.rng || 0, G.map[sel.c][sel.r].t === 'kirche' ? 6 : 0);
    for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) { const d = E.dist(sel.c, sel.r, c, r); if (d >= 1 && d <= SP && !E.hasLOS(G, sel.c, sel.r, c, r, T0.aerial)) hideSet.add(E.key(c, r)); }
    rangeEdges = contourOf(rangeSet); }
  if (TYPES[sel.type].cls === 'art') {
    const foe = (c, r) => { const x = E.unitAt(G, c, r); return x && x.side !== sel.side; };
    for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) {
      if (!E.canShell(G, sel, c, r, artMode)) continue;
      const ok = artMode === 'he' ? (foe(c, r) || G.map[c][r].t === 'wire')
        : artMode === 'barrage' ? E.barrageCells(G, sel, c, r).some(h => foe(h[0], h[1]))
        : E.gasCells(G, c, r).some(h => foe(h[0], h[1]));
      if (ok) { shellHexes.add(E.key(c, r));
        if (E.guided(G, sel.side, c, r)) scoutSet.add(E.key(c, r)); }
    }
    return;
  }
  for (const d of G.units) {
    if (d.side === sel.side || !E.alive(d)) continue;
    const m = E.canMelee(G, sel, d), f = E.canFire(G, sel, d);
    if (m && f) { const pm = E.preview(G, sel, d, 'melee'), pf = E.preview(G, sel, d, 'fire'); targets.set(d.id, { id: d.id, both: true, kind: atkPref !== 'auto' ? atkPref : (pf.dmg > pm.dmg - pm.counter ? 'fire' : 'melee') }); }
    else if (m) targets.set(d.id, { id: d.id, kind: 'melee' });
    else if (f) targets.set(d.id, { id: d.id, kind: 'fire' });
  }
}
async function act(fn) {
  busy = true; const u = sel;
  previewT = null; recSet = new Set(); abilSet = new Set(); abilMode = false; feldArt = 'abil'; reach = new Map(); targets = new Map(); shellHexes = new Set(); rangeSet = new Set(); healSet = new Set(); sendSet = new Set(); sightSet = new Set(); scoutSet = new Set(); updateHud();
  await play(fn(u));
  busy = false;
  sel = (u && E.active(u) && (u.ap >= 1 || u.bp > 0)) ? u : null;   // bleibt gewählt, solange Aktion oder BP übrig sind
  computeOptions(); updateUI();
}
const doMove = (c, r) => { const n = reach.get(E.key(c, r)), via = wayPt; wayPt = null; return act(u => via && n && n.via ? E.moveUnit(G, u, c, r, n) : E.moveUnit(G, u, c, r)); };   // mit Wegpunkt: genau der gezeigte Weg
function setWayPt(h) { if (!sel || !h) return false; const k = E.key(h[0], h[1]); if (wayPt && wayPt[0] === h[0] && wayPt[1] === h[1]) { wayPt = null; computeOptions(); updateHud(); return true; }
  if (!reach.has(k)) return false; wayPt = [h[0], h[1]]; computeOptions(); if (!reach.size) { wayPt = null; computeOptions(); } updateHud(); playSound('ui', 0.3, null); return true; }
const doAttack = d => { const t = targets.get(d.id); return act(u => t.kind === 'fire' ? E.fire(G, u, d) : E.melee(G, u, d)); };
const doShell = (c, r) => { const m = artMode; return act(u => E.shell(G, u, c, r, m)); };

// ---------- Nachschub ----------
function openShop() {
  if (busy || G.over || !human(G.side)) return;
  if (document.body.classList.contains('neu')) return openShopNeu();
  const sd = G.side;
  $('shopPts').textContent = G.pts[sd];
  $('shopList').innerHTML = E.SHOP[sd].filter(t => G.mechs || !E.isMech(t)).map(t => { const T = TYPES[t], ok = E.canBuy(G, sd, t) && E.spawnHexes(G, sd, t).length;
    return `<button class="item ${sd}" data-t="${t}" ${ok ? '' : 'disabled'}><canvas data-k="${figOf(T)}" data-t="${t}"></canvas><b class="${T.name.split(/[ -]/).some(w => w.length > 12) ? 'lang' : ''}">${T.name}</b><span class="cost">★ ${E.COST[t]}</span><small>${T.can}</small></button>`; }).join('');
  $('shop').hidden = false;
  requestAnimationFrame(() => $('shopList').querySelectorAll('canvas').forEach(c => drawPortrait(c, c.dataset.k, sd, c.dataset.t)));
  $('shopList').querySelectorAll('.item').forEach(b => b.onclick = () => {
    $('shop').hidden = true; select(null);
    placing = b.dataset.t; spawnSet = new Set(E.spawnHexes(G, sd, placing).map(h => E.key(h[0], h[1]))); updateHud();
  });
}
function cancelPlace() { placing = null; spawnSet = new Set(); updateHud(); }
async function doBuy(c, r) {
  const t = placing; placing = null; spawnSet = new Set();
  busy = true; await play(E.buy(G, G.side, t, c, r)); busy = false; updateUI();
}

// ---------- Rundenablauf ----------
async function endTurn() {
  if (busy || G.over || G.aufstellung) return;
  placing = null; spawnSet = new Set();
  select(null); busy = true;
  const ev = E.endTurn(G);
  updateUI();
  await play(ev);
  busy = false; updateUI();
  if (G.over) return;
  rundenSchild();
  if (mode === 'hot') { camHome(); return showHandover(); }
  if (!human(G.side)) await aiTurn();
}
let gegnerZug = false;
async function aiTurn() {
  gegnerZug = true; speed = tempo >= INSTANT ? tempo : tempo * GEGNER_TEMPO;   // Gegnerzug etwas schneller
  try { await aiTurnLauf(); } finally { gegnerZug = false; speed = tempo; }
}
async function aiTurnLauf() {
  busy = true; updateUI();
  await wait(300);
  { const bev = AI.buy(G); if (bev.length) await play(bev); }
  let guard = 0;
  while (!G.over && guard++ < 300) {
    const a = AI.next(G);
    if (!a) break;
    camHold = false; activeU = a.u.id;   // diese Einheit ist dran: Messingring, Kamera hin, wenn sie nicht im Bild ist
    { const d = DU.get(a.u.id); if (d && camOn() && !inView(d.x, d.y - L.s * 0.4)) await camTo(d.x, d.y - L.s * 0.4); }
    await wait(170);
    for (const s of a.steps) { const ev = AI.exec(G, a.u, s); if (ev.length) await play(ev); if (G.over) break; }
    activeU = null;
    await wait(250);   // Absatz zwischen zwei Einheiten
  }
  if (G.over) { busy = false; return; }
  await play(E.endTurn(G));
  busy = false; activeU = null; updateUI(); rundenSchild();
  camHome();   // Rundenbeginn: zurück zur eigenen Einheit bzw. Front
}

// ---------- Anzeige ----------
let toastT = 0;
function toast(text) { const el = $('toast'); el.textContent = text; el.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('on'), 3800); }
// Rundenschild beim Zugwechsel (2026-11-17): ca. 2 s mittig unter der Siegpunkt-Anzeige, Holz mit Eisen-Messing-Rahmen, „Runde n“, Wappen, „… ist am Zug“;
// Klick oder Tippen blendet sofort aus, blockiert keine Eingaben. Ton: eigener Zug Trommelwirbel, Gegnerzug Wirbel mit tiefem Horn (leiser als Befehle)
let rundenT = 0;
function rundenSchild() {
  if (!G || G.over) return; const el = $('rundenSchild'), sd = G.side, eigen = human(sd) || mode === 'hot';
  el.innerHTML = `<b>Runde ${G.turn}</b><span class="rs-w">${crest(sd)}</span><span class="rs-t">${sd === 'A' ? SIDES.A.name : SIDES[sd].short} ist am Zug</span>`;
  el.className = 'rs ' + sd; void el.offsetWidth; el.classList.add('an'); clearTimeout(rundenT); rundenT = setTimeout(() => el.classList.remove('an'), 2300);
  playSound(eigen ? 'zug_eigen' : 'zug_gegner', 0.35, null, { noGap: true });
}
document.addEventListener('pointerdown', () => { const el = $('rundenSchild'); if (el && el.classList.contains('an')) { clearTimeout(rundenT); el.classList.remove('an'); } }, true);
function banner(title, sub) {
  const el = $('banner'); el.innerHTML = `<b>${title}</b><span>${sub || ''}</span>`;
  el.classList.remove('on'); void el.offsetWidth; el.classList.add('on');
}
function updateTop() {   // obere Leiste nach STYLE.md: Freund = Schild/Feldgrau, Feind = Zackenstern/Blutrot (Sicht der Seite am Zug bzw. des Spielers)
  const mine = human(G.side) ? G.side : (mode === 'hot' ? G.side : mode), ff = sd => sd === mine ? 'fr' : 'fo';
  $('turn').textContent = `Runde ${G.turn}`;
  const ch = $('sidechip'); ch.className = 'tb-plate tb-side ' + ff(G.side);
  ch.innerHTML = `<i class="tb-medal">${crest(G.side)}</i><b>${SIDES[G.side].short}</b>${human(G.side) ? '' : '<small>KI</small>'}`;
  ch.dataset.tip = `Am Zug: ${SIDES[G.side].name || SIDES[G.side].short}${human(G.side) ? '' : ' (Computer)'}`;
  $('windArrow').style.transform = `rotate(${WIND_DEG[G.wind]}deg)`;
  for (const sd of ['A', 'D']) {
    const v = Math.max(0, 1 - E.losses(G, sd)), el = $('meter' + sd), pc = Math.round(v * 100);
    el.className = 'tb-meter ' + ff(sd) + ' ' + sd;   // Platz nach Sicht (eigener links), Farbe fest je Fraktion
    el.style.setProperty('--v', Math.max(0.001, v)); el.style.setProperty('--brk', 1 - P.BREAK[sd]);
    el.querySelector('.tb-medal').innerHTML = crest(sd);
    el.querySelector('.val').textContent = pc + ' %';
    el.dataset.tip = `Kampfkraft ${SIDES[sd].short}: ${pc} %. Messingstrich: darunter bricht das Heer zusammen.`;
  }
  const own = c => c === 'A' || c === 'D' ? c : '';
  const foe = mine === 'A' ? 'D' : 'A';
  $('objs').innerHTML = `<span class="tb-plate tb-pts" data-tip="Siegpunkte (eigene : Gegner). Wer ${G.goal} erreicht, gewinnt. Kreise: Zielfelder mit ihren Punkten je Runde."><b class="${mine}">${G.vp[mine]}</b><i class="sep">:</i><b class="${foe}">${G.vp[foe]}</b><small>/ ${G.goal}</small>`
    + `<span class="tb-dots${OBJECTIVES.length >= 6 ? ' many' : ''}">${OBJECTIVES.map(o => { const c = own(G.ctrl[o.id]); return `<span class="tb-obj ${c ? 'f' + fac(c) : ''}">${o.pts}</span>`; }).join('')}</span></span>`;   // erobert: Rand in Fraktionsfarbe (Wimpel überdeckten die Zahlen, 2026-11-16)
}
// Tooltips der oberen Leiste per Touch (Digitalboards): Knöpfe lang drücken, Anzeigen kurz antippen. Klick nach langem Druck entfällt.
{ let tm = 0, hide = 0, long = false;
  const tb = $('topbar'), clear = () => tb.querySelectorAll('.tip').forEach(x => x.classList.remove('tip'));
  const show = el => { clear(); clearTimeout(hide); el.classList.add('tip'); hide = setTimeout(clear, 2500); };
  tb.addEventListener('pointerdown', e => { long = false; clearTimeout(tm); if (e.pointerType === 'mouse') return;
    const el = e.target.closest('[data-tip]'); if (!el) return clear();
    if (el.tagName === 'BUTTON') tm = setTimeout(() => { long = true; show(el); }, 420); else show(el); });
  tb.addEventListener('pointerup', () => clearTimeout(tm)); tb.addEventListener('pointercancel', () => clearTimeout(tm));
  tb.addEventListener('click', e => { if (long) { long = false; e.stopPropagation(); e.preventDefault(); } }, true);
  tb.addEventListener('contextmenu', e => { if (e.target.closest('[data-tip]')) e.preventDefault(); });
}
// Knöpfe der oberen Leiste: flache Symbole in Knochenweiß, Werte als kleine Marke
const TB_ICON = (d, fill) => `<svg viewBox="0 0 24 24" fill="${fill ? '#F0EDE1' : 'none'}" stroke="#F0EDE1" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const TB_SVG = {
  zoom: TB_ICON('<circle cx="10" cy="10" r="6"/><path d="M14.5 14.5 20.5 20.5M7.5 10h5M10 7.5v5"/>'),
  sndOn: TB_ICON('<path d="M3.5 9h4l5-4.5v15l-5-4.5h-4z" fill="#F0EDE1"/><path d="M16 9a4.5 4.5 0 0 1 0 6M18.5 6a8.5 8.5 0 0 1 0 12"/>'),
  sndOff: TB_ICON('<path d="M3.5 9h4l5-4.5v15l-5-4.5h-4z" fill="#F0EDE1"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>'),
  speed: TB_ICON('<path d="M3 6l8 6-8 6zM12 6l8 6-8 6z"/>', true),
  instant: TB_ICON('<path d="M2.5 6l7 6-7 6zM10 6l7 6-7 6z" fill="#F0EDE1"/><path d="M20.5 5.5v13"/>'),
  diary: TB_ICON('<path d="M5 4.5h10.5a2 2 0 0 1 2 2V20H7a2 2 0 0 1-2-2z"/><path d="M5 18a2 2 0 0 1 2-2h10.5M8.5 8.5h6M8.5 11.5h4"/>'),
  rules: TB_ICON('<path d="M8.5 9a3.5 3.5 0 1 1 5.2 3c-1.1.6-1.7 1.3-1.7 2.6"/><circle cx="12" cy="19" r="1.2" fill="#F0EDE1"/>'),
  full: TB_ICON('<path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/>'),
  menu: TB_ICON('<path d="M4 6h16M4 12h16M4 18h16"/>'),
  marks: TB_ICON('<circle cx="6.5" cy="15.5" r="4"/><circle cx="17.5" cy="15.5" r="4"/><path d="M10.5 15h3M4 12.5 6.5 5.5h3.5l.5 7M20 12.5 17.5 5.5H14l-.5 7"/>')
};
const tbNum = n => String(n).replace('.', ',') + '×';
function tbSync() {
  $('btnZoom').innerHTML = TB_SVG.zoom + `<b class="tb-v">${zoomFit || ZOOM <= ZFIT + 0.01 ? 'Karte' : tbNum(Math.round(ZOOM * 10) / 10)}</b>`;
  $('btnSound').innerHTML = soundOn ? TB_SVG.sndOn : TB_SVG.sndOff; $('smSound').innerHTML = $('btnSound').innerHTML;
  $('btnSpeed').innerHTML = tempo >= INSTANT ? TB_SVG.instant : TB_SVG.speed + `<b class="tb-v">${tbNum(tempo)}</b>`; $('btnSpeed').dataset.tip = 'Tempo der Abläufe: ' + speedTxt().replace('Tempo ', '');
  $('btnDiary').innerHTML = TB_SVG.diary; $('btnDiary').classList.toggle('on', !$('diary').hidden);
  $('btnMarks').innerHTML = TB_SVG.marks; $('btnMarks').classList.toggle('on', marksOn); $('btnMarks').setAttribute('aria-pressed', marksOn);
  $('btnRules2').innerHTML = TB_SVG.rules; $('btnFull').innerHTML = TB_SVG.full; $('btnMenu').innerHTML = TB_SVG.menu;
  document.querySelectorAll('.tb-btn').forEach(b => b.setAttribute('aria-label', b.dataset.tip));
}
// Einheiten, die in dieser Runde nichts mehr tun können (gezogen und kein Ziel mehr, oder „Fertig“ gedrückt)
const spent = new Set();
function hasAction(u) {
  if (u.broken > 0) return false;
  if (!u.supp && E.reachable(G, u).size) return true;   // noch Bewegungspunkte
  if (u.ap < 1) return E.canSetup(G, u) || E.canTeardown(G, u);
  if (E.canOrder(G, u) || G.units.some(o => E.canSend(G, u, o) || E.canRecover(G, u, o))) return true;
  if (E.canSetup(G, u)) return true;
  // Bereit heißt: irgendeine Aktion ist noch möglich (Wunsch 2026-11-16), nicht nur Ziehen. Aufgebautes MG kann abbauen,
  // Geschütz in Stellung aufprotzen, Schützen Feuerbereitschaft nehmen. (Bloßes Drehen zählt allein nicht, es ist frei.)
  if (E.canTeardown(G, u) || E.canLimber(G, u) || E.canOverwatch(G, u)) return true;
  if (TYPES[u.type].abil && E.abilTargets(G, u).length) return true;
  if (u.attacked) return false;
  const T = TYPES[u.type];
  if (T.cls === 'medic') return G.units.some(o => E.canHeal(G, u, o));
  if (T.cls === 'art') { for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) if (E.canShell(G, u, c, r, 'he')) return true; }
  if (E.canCut(G, u)) return true;
  const f0 = u.face, fan = d => { if (!T.mg) return false; u.face = E.faceIndex(E.angleTo(u.c, u.r, d.c, d.r)); const ok = E.canFire(G, u, d); u.face = f0; return ok; };   // MG: nach Drehen schussbereit
  return G.units.some(d => d.side !== u.side && E.alive(d) && (E.canFire(G, u, d) || E.canMelee(G, u, d) || fan(d)));
}
function refreshSpent() { spent.clear(); if (!G || G.over || !human(G.side)) return; for (const u of G.units) if (u.side === G.side && E.active(u) && !hasAction(u)) spent.add(u.id); }
function updateUI() {
  if (!G) return;
  refreshSpent();
  updateTop();
  const be = $('btnEnd');
  be.disabled = busy || !!G.over || !human(G.side);
  be.textContent = !human(G.side) && !G.over ? 'KI zieht …' : 'Runde beenden';
  const bs = $('btnShop'), hs = human(G.side) ? G.side : (mode === 'hot' ? G.side : mode);
  bs.disabled = busy || !!G.over || !human(G.side); bs.innerHTML = `Nachschub <b>★ ${G.pts[hs]}</b>`;
  if (sel && (!E.active(sel) || sel.side !== G.side)) sel = null;
  computeOptions(); updateHud();
}
// Porträts aus den neuen Figurenbögen (2026-11-17): je Bogen eine gut erkennbare Pose, bei Einzelmodellen das Modell; sonst das alte Bild
const PORTRAIT_POSE = { soldat: 1, sturm: 1, pionier: 1, sanitaeter: 4, flammen: 1, reiter: 1, scharfschuetze: 3, schildwall: 1, schwer: 1, melder: 1, banner: 1, pirschjaeger: 2, signal: 1, stahl: 1, panzerknecht: 1, fernsprech: 3, versorgung: 1, gasschutz: 1, mineur: 1, eingreif: 1 };
function portraitKey(type, side, limbered) {
  const m = type && FIGMAP[type]; if (!m || !window.FIGS || fac(side) === 'F') return null;
  const pre = side === 'A' ? 'konkordat_' : 'aschenwacht_'; let sheet = m[0];
  if (limbered && sheet === 'geschuetz' && window.FIGS[pre + 'geschuetz_marsch']) sheet = 'geschuetz_marsch';
  const key = m[1] ? pre + sheet + '_' + (PORTRAIT_POSE[sheet] || 1) : pre + sheet;
  return window.FIGS[key] ? key : null;
}
function drawPortrait(canvas, kind, side, type, limbered) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2.5), cw = canvas.clientWidth || 84, chh = canvas.clientHeight || 84;
  canvas.width = cw * dpr; canvas.height = chh * dpr;
  const g = canvas.getContext('2d'), W = canvas.width, H = canvas.height;
  const gr = g.createRadialGradient(W / 2, H * 0.55, W * 0.1, W / 2, H * 0.55, W * 0.75);
  gr.addColorStop(0, side === 'A' ? '#8a7a45' : '#5f6b70'); gr.addColorStop(1, '#22231c');
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  g.fillStyle = 'rgba(0,0,0,0.28)'; g.beginPath(); g.ellipse(W / 2, H * 0.88, W * 0.36, H * 0.07, 0, 0, 7); g.fill();
  const pk = portraitKey(type, side, limbered);
  if (pk) {   // neuer Figurenbogen
    const im = figImg(pk);
    if (!im) { const ld = FIGI[pk]; if (ld && !ld.__pw) { ld.__pw = true; ld.addEventListener('load', () => drawPortrait(canvas, kind, side, type, limbered)); } return; }
    const k = Math.min(H * 0.86 / im.naturalHeight, W * 0.94 / im.naturalWidth), w = im.naturalWidth * k, h = im.naturalHeight * k;
    g.drawImage(im, Math.round((W - w) / 2), Math.round(H * 0.93 - h), w, h); return;
  }
  const t0 = FIG.sprite(kind, side, 0, 100);
  const k0 = Math.min(H * 0.84 / t0.cv.height, W * 0.94 / t0.cv.width);
  const sp = FIG.sprite(kind, side, 0, 100 * k0);
  g.drawImage(sp.cv, Math.round((W - sp.cv.width) / 2), Math.round(H * 0.93 - sp.cv.height));
}
const pill = (k, v, cls = '') => `<div class="pill ${cls}"><small>${k}</small><b>${v}</b></div>`;
const bar = (k, v, max, kind, cls = '') => `<div class="sbar ${kind} ${cls}" title="${k}" style="--v:${Math.max(0, Math.min(1, v / max))}"><i></i><span>${k} ${fmt(v)}</span></div>`;
// ---------- Einheiten-Panel (STYLE.md): Bild, Werte, Fähigkeiten als Symbol-Knöpfe ----------
const UP = window.UIPANEL || {};
for (const k in UP) document.documentElement.style.setProperty('--up-' + k, `url("${UP[k]}")`);
const upSym = k => UP['s_' + k] || '';
const UP_MARK = {   // Ersatz, falls die Wappenbilder fehlen: Freund = Schild (Feldgrau), Feind = Zackenraute (Rot)
  friend: '<svg viewBox="0 0 40 44"><path d="M4 4h32v16c0 11-7 18-16 21C11 38 4 31 4 20z" fill="#7A8F99" stroke="#120D0B" stroke-width="3" stroke-linejoin="round"/><path d="M12 13h16M12 20h16" stroke="#120D0B" stroke-width="3" stroke-linecap="round"/></svg>',
  foe: '<svg viewBox="0 0 40 44"><path d="M20 2l5 9 9-3-3 10 7 4-7 4 3 10-9-3-5 9-5-9-9 3 3-10-7-4 7-4-3-10 9 3z" fill="#8E2B22" stroke="#120D0B" stroke-width="3" stroke-linejoin="round"/><path d="M14 16l12 12M26 16 14 28" stroke="#120D0B" stroke-width="3" stroke-linecap="round"/></svg>'
};
// Fraktionswappen (ui-quelle/wappen_*): Konkordat = eiserner Löwenkopf, Aschenwacht = Stahlhelm. Emblem allein als Marke, mit Flagge auf Zielfeldern.
// Fraktion je Seite: A = Konkordat oder Blaue Legion (Bilderset F), D = Aschenwacht. Wappen und Farbe hängen an der Fraktion.
const fac = sd => sd === 'D' ? 'D' : skinA === 'F' ? 'F' : 'A';
const FCOL = { A: '#8E2B22', D: '#7D8471', F: '#6F8FB5' };   // Blutrot, Feldgrau grünlich, Horizontblau (STYLE.md)
const sideCol = sd => FCOL[fac(sd)];
const crest = sd => UP['w' + fac(sd)] ? `<img class="crest" src="${UP['w' + fac(sd)]}" alt="${SIDES[sd].short}">` : (sd === 'A' ? UP_MARK.friend : UP_MARK.foe);
// Ersatz-Wimpel (nur falls das Bild UP.pA/pD/pF fehlt) für eroberte Zielmarken (oben in der Leiste): Dreieck in Fraktionsfarbe, ausgefranstes Ende, Pinselstriche,
// Tintenkontur, helle Form drauf (Konkordat Krone, Aschenwacht Helmspitze, Legion Hahnenkamm). Als Bild, damit die Filter-IDs getrennt bleiben.
const PENN_SYM = {
  A: 'M6.5 19L6 10.5 9.6 14 13 8 16.4 14 20 10.5 19.5 19Z',
  D: 'M5.5 20h15v-2h-1.2Q19 12.5 13 12 7 12.5 6.7 18H5.5ZM11.6 12.2l1.4-6 1.4 6Z',
  F: 'M6.5 19C6 15 7 13 8.6 13.2L9 9.4 11.4 12.2 12.8 7.6 14.6 11.8 17.2 8.4 17.6 12.8C19.6 12.4 21 15 19.8 19Z'
};
const pennant = f => 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 30">
<filter id="r" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".18 .5" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="2.2"/></filter>
<filter id="s" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".05 .7" numOctaves="2" seed="9"/><feColorMatrix values="0 0 0 0 .07 0 0 0 0 .05 0 0 0 0 .04 2.8 0 0 0 -1.3"/><feComposite in2="SourceGraphic" operator="in"/></filter>
<g filter="url(#r)"><path id="p" d="M2.5 2.5C12 5 22 8 30 10.2L35.5 11.4 33 13.2 38 14.6 31.5 16.6C22 19.5 12 23 2.5 26.5Z" fill="${FCOL[f]}" stroke="#120D0B" stroke-width="2.2" stroke-linejoin="round"/>
<path d="M2.5 2.5C12 5 22 8 30 10.2L35.5 11.4 33 13.2 38 14.6 31.5 16.6C22 19.5 12 23 2.5 26.5Z" filter="url(#s)"/>
<path d="${PENN_SYM[f]}" fill="#F0EDE1" stroke="#120D0B" stroke-width="1.1" stroke-linejoin="round"/></g></svg>`);
const PENNANT = { A: UP.pA || pennant('A'), D: UP.pD || pennant('D'), F: UP.pF || pennant('F') };   // Bild aus ui-quelle/wimpel_fraktionen.png, sonst gezeichnet
const ABIL_KEIN = { tunnel: 'Kein Graben, Bunker oder Gebäude bis 2 Felder (ohne eigene Einheit, noch ohne Stollen).', mark: 'Kein Feld in Sicht, das noch nicht markiert ist.', strike: 'Kein Feld in Sicht.', smoke: 'Kein Feld bis 3 Felder.', charge: 'Kein Gegner, Bunker, Draht oder keine Barrikade daneben.', mine: 'Kein freies Nachbarfeld.', ammo: 'Kein MG oder Geschütz daneben, das schon geschossen hat.', clear: 'Kein Gas hier oder daneben.' };
const ABIL_SYM = { rush: 'marsch', mark: 'zielen', strike: 'granate_artillerie', smoke: 'nebel', tunnel: 'spitzhacke', charge: 'sprengladung', mine: 'tellermine', light: 'scheinwerfer', clear: 'gasmaske', ammo: 'munitionskiste' };
const upEsc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const upRunden = n => `${n} Runde${n > 1 ? 'n' : ''}`;
function hudNachLauf(id) {   // Panel: dunklen Nachlauf-Abschnitt abbauen
  const el = $('hudStats').querySelector('.up-bar.hp i.nach'), hn = hudHN[id]; if (!el || !hn || !hn._hn) return;
  const step = () => { if (!el.isConnected) return; const v = hpNachV(hn._hn, performance.now()); el.style.width = (Math.max(0, Math.min(1, v / 10)) * 100).toFixed(1) + '%'; if (v > hn._hn.to + 1e-6) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
const upBar = (cls, k, v, max, nach) => `<div class="up-bar ${cls}"><div class="tube"><div class="slot">${nach != null ? `<i class="nach" style="width:${(Math.max(0, Math.min(1, nach / max)) * 100).toFixed(1)}%"></i>` : ''}<i style="width:${Math.round(Math.max(0, Math.min(1, v / max)) * 100)}%"></i></div></div><span class="val"><span class="k">${k}</span>${fmt(v)}<small> / ${fmt(max)}</small></span></div>`;
function upBtn(b, i) {
  const cost = b.bp > 0 ? `<span class="ap bp">${b.bp}</span>` : b.cost > 0 ? `<span class="ap">${b.cost}</span>` : '';   // Fahrplan 2: Münze = Aktion, Stiefel-Zahl = BP
  const corner = b.cd > 0 ? `<span class="cdn"><img src="${upSym('sanduhr')}" alt="">${b.cd}</span>` : b.cnt != null ? `<span class="cdn cnt">×${b.cnt}</span>` : '';
  const costTxt = b.costTxt || (b.bp > 0 ? `${b.bp} Bewegungspunkt${b.bp > 1 ? 'e' : ''}` : b.cost > 0 ? 'die Aktion' : 'kostet nichts');
  const tip = `<span class="up-tip" role="tooltip"><b>${b.name}</b><span class="cost">${costTxt}${b.cd > 0 ? ' · wieder bereit in ' + upRunden(b.cd) : ''}</span><span>${b.text}</span>${b.off && b.why ? `<span class="why">${b.why}</span>` : ''}</span>`;
  const cls = 'up-ab' + (b.on ? ' on' : '') + (b.off ? ' off' : '') + (b.pulse && !b.off ? ' pulse' : '') + (b.mirror ? ' mirror' : '');
  return `<div class="up-slot${b.on ? ' on' : ''}"><button class="${cls}" data-act="${b.act}" aria-label="${upEsc(b.name)}, Taste ${i + 1}"${b.off ? ' aria-disabled="true"' : ''}><img src="${upSym(b.sym)}" alt="">${cost}${corner}${tip}</button><span class="up-key">${i + 1}</span></div>`;
}
let upBtns = [];
// ---------- Bedienfeld der neuen Ansicht nach Entwurf A1 (2026-11-17) ----------
// Nur mit OPT.tilt (body.neu): dieselben Elemente wie im alten Panel, per CSS neu angeordnet (index.html „Bedienfeld der neuen Ansicht“).
// Verschoben werden: Nachschub-Knopf nach oben links (#nachOben), Zustände unter die Moral, Hinweiszeile nach oben.
let kartLang = false; try { kartLang = localStorage.getItem('arm.kartelang') === '1'; } catch (e) {}
function neuBedienfeld(on) {
  if (neuBedienfeld.an === on) return; neuBedienfeld.an = on;
  document.body.classList.toggle('neu', on);
  const shop = $('btnShop'), st = $('hudStates'), hint = $('hudHint');
  let kk = $('neuKK'); if (!kk) { kk = document.createElement('div'); kk.id = 'neuKK'; }   // Zeile unter der Moral: Zustände links, Info und ausführlich rechts
  if (on) { $('nachOben').appendChild(shop); $('hudStats').after(kk); kk.append(st, $('btnInfo'), $('btnMehr')); document.body.appendChild(hint); }
  else { $('btnNext').before(shop); $('hudSub').before(st); $('hudName').after($('btnInfo')); $('btnInfo').after($('btnMehr')); kk.remove(); $('hudRow').before(hint); $('shop').hidden = true; }
}
// Knopfreihe unten mittig im freien Raum zwischen Einheitenkarte und rechtem Block; bei vielen Knöpfen kleiner, nie unter 40 px
function neuKnopfreihe() {
  if (!document.body.classList.contains('neu')) return;
  const mid = document.querySelector('#hud .up-mid'), row = $('hudRow'), n = Math.max(1, row.children.length);
  const card = document.querySelector('#hud .up-unit').getBoundingClientRect(), turn = document.querySelector('#hud .up-turn').getBoundingClientRect();
  const l = card.right + 18, r = turn.left - 18, space = Math.max(160, r - l), wide = innerWidth >= 2200, mid1 = innerWidth > 1500;
  const gap = wide ? 12 : mid1 ? 10 : 7, ab = Math.max(40, Math.min(wide ? 80 : mid1 ? 66 : 56, Math.floor((space - gap * (n - 1)) / n)));
  mid.style.setProperty('--abneu', ab + 'px'); mid.style.setProperty('--abgap', gap + 'px'); mid.style.left = Math.round(l + space / 2) + 'px';
}
// Karte „ausführlich“: Werte, Schlagworte, Text; Einstellung bleibt gespeichert
function neuKarteMehr(u) {
  let m = $('hudMore'); if (!m) { m = document.createElement('div'); m.id = 'hudMore'; document.querySelector('#hud .up-unit').appendChild(m); }
  if (!u) { m.innerHTML = ''; return; }
  const T = TYPES[u.type];
  m.innerHTML = `<div class="hm-w">${[['Angriff', T.atk], ['Abwehr', T.def], ['Moral', fmt(T.mor)], ['Zug', u.limbered ? P.LIMBER_MV : T.mv], ['Reichweite', T.rng || '–']].map(([k, x]) => `<div><b>${x}</b>${k}</div>`).join('')}</div>` +
    (T.sp && T.sp.length ? `<div class="hm-chips">${T.sp.map(x => `<span>${x}</span>`).join('')}</div>` : '') + `<p>${T.can}</p>` + (T.real ? `<p class="real"><b>Im echten Krieg:</b> ${T.real}</p>` : '');
}
{ const b = document.createElement('button'); b.className = 'neu-mehr'; b.id = 'btnMehr'; b.title = 'Einheitenkarte: kurz oder ausführlich'; $('btnInfo').after(b);
  const set = () => { document.body.classList.toggle('kartelang', kartLang); b.textContent = kartLang ? 'kurz' : 'ausführlich'; }; set();
  b.onclick = () => { kartLang = !kartLang; try { localStorage.setItem('arm.kartelang', kartLang ? '1' : '0'); } catch (e) {} set(); neuKnopfreihe(); }; }
// Nachschub-Menü nach Entwurf B: Kategorien als Reiter, Karten im Querformat, Pergament-Details beim Überfahren/Antippen
let shopKat = 'Standard';
const SHOP_KAT = ['Kommando', 'Standard', 'Spezial', 'Artillerie', 'Fahrzeuge und Kampfmaschinen'];
const SHOP_STANDARD = ['kohorte', 'grenadier', 'mahlwerk', 'sense', 'reiter', 'lanzeD', 'feldscher', 'heiler', 'melder'];   // Linientruppen
function shopKatOf(t) { const T = TYPES[t]; return T.cmd ? 'Kommando' : T.cls === 'walker' || E.isMech(t) ? 'Fahrzeuge und Kampfmaschinen' : T.cls === 'art' ? 'Artillerie' : SHOP_STANDARD.includes(t) ? 'Standard' : 'Spezial'; }
function hideShopDet() { $('shopDet').classList.remove('zeigen'); document.querySelectorAll('#shopNeu .sn-k.offen').forEach(e => e.classList.remove('offen')); }
// Nachschub-Fenster verschiebbar (Spieltest Runde 2, Punkt 13): an der Titelleiste ziehen (Maus und Finger), Lage bleibt gespeichert (arm.shoppos)
let shopPos = [0, 0], shopZieh = 0; try { const v = JSON.parse(localStorage.getItem('arm.shoppos') || 'null'); if (Array.isArray(v) && v.length === 2) shopPos = v.map(Number); } catch (e) {}
function shopLage(sh) {   // Versatz anwenden, Fenster bleibt ganz im Bild (unter der oberen Leiste)
  sh.style.transform = ''; const r = sh.getBoundingClientRect(), oben = parseInt(getComputedStyle(document.body).getPropertyValue('--tb-unten')) || 70;
  shopPos[0] = Math.max(8 - r.left, Math.min(innerWidth - 8 - r.right, shopPos[0])); shopPos[1] = Math.max(oben + 4 - r.top, Math.min(innerHeight - 8 - r.bottom, shopPos[1]));
  sh.style.transform = `translate(${Math.round(shopPos[0])}px, ${Math.round(shopPos[1])}px)`;
}
function shopZiehen() {
  const sh = $('shop').querySelector('.sheet'), tit = $('shopNeu').querySelector('.sn-titel'); if (!sh || !tit) return; shopLage(sh);
  tit.onpointerdown = ev => { if (ev.button > 0) return; ev.preventDefault(); try { tit.setPointerCapture(ev.pointerId); } catch (e) {} hideShopDet();
    const x0 = ev.clientX, y0 = ev.clientY, p0 = shopPos.slice(); tit.classList.add('zieht');
    tit.onpointermove = e => { shopPos = [p0[0] + e.clientX - x0, p0[1] + e.clientY - y0]; shopLage(sh); shopZieh = performance.now(); };
    tit.onpointerup = tit.onpointercancel = () => { tit.onpointermove = null; tit.classList.remove('zieht'); shopZieh = performance.now(); try { localStorage.setItem('arm.shoppos', JSON.stringify(shopPos.map(Math.round))); } catch (e) {} }; };
}
addEventListener('resize', () => { const sh = $('shop') && $('shop').querySelector('.sheet'); if (sh && !$('shop').hidden) shopLage(sh); });
function openShopNeu() {
  const sd = G.side, list = E.SHOP[sd].filter(t => G.mechs || !E.isMech(t)), inKat = k => list.filter(t => shopKatOf(t) === k);
  if (!inKat(shopKat).length) shopKat = SHOP_KAT.find(k => inKat(k).length);
  const warum = t => G.pts[sd] < E.COST[t] ? `Zu wenig Punkte: ★ ${E.COST[t]} nötig.` : !E.canBuy(G, sd, t) ? (TYPES[t].cmd === 2 ? 'Es gibt schon einen General.' : 'Gerade nicht möglich.') : !E.spawnHexes(G, sd, t).length ? 'Kein freies Aufstellungsfeld.' : '';
  $('shopNeu').innerHTML = `<div class="sn-titel"><b>Nachschub anfordern</b><span>★ ${G.pts[sd]}</span></div>
    <div class="sn-reiter">${SHOP_KAT.filter(k => inKat(k).length).map(k => { const n = inKat(k).filter(t => !warum(t)).length; return `<button data-kat="${k}" class="${k === shopKat ? 'an' : ''}${n ? ' leistbar' : ''}" title="${n ? n + ' davon jetzt aufstellbar' : 'Nichts davon gerade aufstellbar'}">${k}<small>${inKat(k).length}</small></button>`; }).join('')}</div>
    <div class="sn-liste">${inKat(shopKat).map(t => { const T = TYPES[t]; return `<button class="sn-k${warum(t) ? ' aus' : ''}" data-t="${t}"><canvas data-k="${figOf(T)}" data-t="${t}"></canvas><span><span class="nm">${T.name}</span><span class="ko">★ ${E.COST[t]}</span><span class="chips">${(T.sp || []).slice(0, 3).map(x => `<span>${x}</span>`).join('')}</span></span></button>`; }).join('')}</div>
    <div class="sn-fuss"><span>${lastPT === 'mouse' ? 'Überfahren zeigt alle Werte, Klick stellt auf' : 'Antippen zeigt alle Werte, nochmal antippen stellt auf'} – am eigenen Rand oder an eigenen Zielfeldern. Neue Einheiten handeln ab der nächsten Runde.</span><button class="tbtn" id="shopZu">Schließen</button></div>`;
  $('shop').hidden = false; hideShopDet(); shopZiehen();
  requestAnimationFrame(() => $('shopNeu').querySelectorAll('canvas').forEach(c => drawPortrait(c, c.dataset.k, sd, c.dataset.t)));
  $('shopNeu').querySelectorAll('.sn-reiter button').forEach(b => b.onclick = () => { shopKat = b.dataset.kat; openShopNeu(); });
  $('shopZu').onclick = () => { $('shop').hidden = true; hideShopDet(); };
  const det = $('shopDet');
  const zeig = el => { const t = el.dataset.t, T = TYPES[t], w = warum(t), r = el.getBoundingClientRect(), sh = $('shop').querySelector('.sheet').getBoundingClientRect();
    det.innerHTML = `<h3>${T.name}<span>★ ${E.COST[t]}</span></h3>${T.sp && T.sp.length ? `<div class="chips">${T.sp.map(x => `<span>${x}</span>`).join('')}</div>` : ''}<div class="w">${[['Angriff', T.atk], ['Abwehr', T.def], ['Moral', fmt(T.mor)], ['Zug', T.mv], ['Reichweite', T.rng || '–']].map(([k, x]) => `<div><b>${x}</b>${k}</div>`).join('')}</div><div>${T.can}</div>${T.real ? `<div class="real"><b>Im echten Krieg:</b> ${T.real}</div>` : ''}${w ? `<div class="warum">${w}</div>` : ''}`;
    det.classList.add('zeigen'); const dw = det.offsetWidth, dh = det.offsetHeight; let x = sh.left - dw - 8; if (x < 8) x = r.right + 10 + dw < innerWidth ? r.right + 10 : r.left - dw - 10;
    det.style.left = Math.max(8, Math.min(innerWidth - dw - 8, x)) + 'px'; det.style.top = Math.max(80, Math.min(innerHeight - dh - 8, r.top - 10)) + 'px';
    document.querySelectorAll('#shopNeu .sn-k').forEach(e => e.classList.toggle('offen', e === el)); };
  const kaufen = el => { if (warum(el.dataset.t)) return zeig(el); $('shop').hidden = true; hideShopDet(); select(null); placing = el.dataset.t; spawnSet = new Set(E.spawnHexes(G, sd, placing).map(h => E.key(h[0], h[1]))); updateHud(); };
  $('shopNeu').querySelectorAll('.sn-k').forEach(el => {
    el.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') zeig(el); });
    el.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') hideShopDet(); });
    el.addEventListener('click', () => { if (lastPT === 'mouse' || el.classList.contains('offen')) kaufen(el); else zeig(el); });   // Finger: erst Details, dann aufstellen
  });
}
// Wirkungsbereich (Paket 2): Befehle, großer Befehl, Banner, Schilde vor, Entgiften, Ziel markieren. Knopf überfahren (Maus) oder halten (Touch)
let areaAct = null;
function abilArea(act) {
  if (!sel || !act) return null; const T = TYPES[sel.type], own = o => o.side === sel.side && E.active(o), cells = new Set(), within = R => { for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) if (E.dist(sel.c, sel.r, c, r) <= R) cells.add(E.key(c, r)); };
  if (act.startsWith('o-')) { within(E.cmdRange(sel)); return { cells, ok: o => own(o) && TYPES[o.type].cls !== 'walker' && E.dist(o.c, o.r, sel.c, sel.r) <= E.cmdRange(sel) }; }   // Befehle: keine Kolosse/Kampfmaschinen
  if (act === 'big') { within(P.BIG_R); return { cells, ok: o => own(o) && E.dist(o.c, o.r, sel.c, sel.r) <= P.BIG_R }; }
  if (act === 'plant' || (act === 'sel' && T.banner)) { const R = (act === 'plant' ? !sel.planted : sel.planted) ? P.BANNER_R_PLANTED : P.BANNER_R; within(R); return { cells, ok: o => own(o) && E.dist(o.c, o.r, sel.c, sel.r) <= R }; }
  if (act === 'shields') { within(1); return { cells, ok: o => own(o) && o !== sel && E.dist(o.c, o.r, sel.c, sel.r) <= 1 }; }
  if (act === 'abil' && T.abil === 'clear') { within(1); return { cells, ok: o => own(o) && E.dist(o.c, o.r, sel.c, sel.r) <= 1 }; }
  if (act === 'abil' && (T.abil === 'mark' || T.abil === 'strike' || T.abil === 'smoke')) { for (const [c, r] of E.abilTargets(G, sel)) cells.add(E.key(c, r)); return { cells, ok: null }; }
  return null;
}
let areaNow = null;
function drawArea(g, s) {
  const A = areaNow = abilArea(areaAct); if (!A) return;
  for (const k of A.cells) { const c = Math.floor(k / 100), r = k % 100; hexPath(g, c, r, 0.96); g.fillStyle = 'rgba(226,176,74,0.26)'; g.fill(); }
  g.save(); g.lineCap = 'round'; g.beginPath();   // Außenkante des Bereichs
  for (const [c, r, i] of contourOf(A.cells)) { const [x, y] = center(c, r), p0 = hexCorner(x, y, i, 0.98), p1 = hexCorner(x, y, i + 1, 0.98); g.moveTo(p0[0], p0[1]); g.lineTo(p1[0], p1[1]); }
  g.strokeStyle = 'rgba(18,13,11,0.8)'; g.lineWidth = Math.max(5, s * 0.1); g.stroke(); g.strokeStyle = 'rgba(246,214,120,1)'; g.lineWidth = Math.max(2.5, s * 0.045); g.stroke(); g.restore();
  if (!A.ok) return;
  for (const u of G.units) { if (!E.alive(u)) continue; const d = DU.get(u.id); if (!d || d.alpha <= 0) continue;
    if (A.ok(u)) { g.save(); g.beginPath(); gEllipse(g, d.x, d.y, s * 0.78, s * 0.78); g.strokeStyle = '#120D0B'; g.lineWidth = Math.max(4, s * 0.1); g.stroke(); g.strokeStyle = '#F6E3A8'; g.lineWidth = Math.max(2, s * 0.05); g.stroke(); g.restore(); }   // betroffen: hell umrandet
  }   // nicht betroffen: abgedunkelt
}
// Knöpfe der gewählten eigenen Einheit (gleiche Bedingungen wie bisher, nur als Symbole)
function unitButtons(T, hints) {
  const btns = [], tg = [...targets.values()];
  if (T.cls === 'art') {
    const c = 1, can = !sel.attacked && sel.ap >= c && !sel.supp && !sel.limbered;
    const why = sel.supp ? 'Niedergehalten: kann nicht feuern.' : sel.limbered ? 'Aufgeprotzt: erst abprotzen.' : sel.attacked ? 'Hat diese Runde schon gehandelt.' : sel.ap < c ? 'Aktion schon verbraucht.' : '';
    if (E.canLimber(G, sel)) btns.push(sel.limbered
      ? { act: 'limber', sym: 'abprotzen', name: 'Abprotzen', costTxt: 'alle restlichen Bewegungspunkte', text: 'In Stellung gehen. Ab der nächsten Runde feuerbereit.' }
      : { act: 'limber', sym: 'aufprotzen', name: 'Aufprotzen', cost: 1, text: `Anspannen: zieht ${P.LIMBER_MV} Felder, feuert aber nicht.` });
    btns.push({ act: 'm-he', sym: 'granate_artillerie', name: 'Sprenggranate', cost: c, text: 'Trifft ein Feld. Zerstört auch Draht.', on: can && artMode === 'he', off: !can, why });
    const bcd = sel.cdP > 0;   // Sperrfeuer: Abklingzeit P.BARRAGE_CD Runden
    const brest = P.BARRAGE_MAX - (sel.barr || 0), gcd = sel.cdG > 0;   // Paket 8: Sperrfeuer höchstens 2× je Schlacht, Gas 3 Runden Pause
    btns.push({ act: 'm-barrage', sym: 'sperrfeuer', name: 'Sperrfeuer', cost: c, cd: sel.cdP, cnt: brest, text: (T.mobile ? 'Ziel und zwei Nachbarfelder: Schaden (etwa ×0,7 eines Einzelschusses), hält nieder.' : 'Ziel und Nachbarfelder: Schaden (etwa ×0,7 eines Einzelschusses), hält nieder.') + ` Höchstens ${P.BARRAGE_MAX}× je Schlacht (noch ${brest}), danach ${P.BARRAGE_CD} Runden Pause.`, on: can && !bcd && brest > 0 && artMode === 'barrage', off: !can || bcd || brest <= 0, why: brest <= 0 ? `Beide Sperrfeuer verbraucht.` : bcd ? `Wieder in ${upRunden(sel.cdP)}.` : why });
    if (sel.gas > 0 || T.gas > 0) btns.push({ act: 'm-gas', sym: 'gas', name: 'Gasgranate', cost: c, cd: sel.cdG, cnt: sel.gas, text: `Wolke treibt 3 Runden mit dem Wind. Trifft auch eigene Truppen. Danach ${P.GAS_CD} Runden Pause (noch ${sel.gas || 0} Gasgranaten).`, on: can && !gcd && artMode === 'gas', off: !can || !(sel.gas > 0) || gcd, why: !(sel.gas > 0) ? 'Keine Gasgranaten mehr.' : gcd ? `Wieder in ${upRunden(sel.cdG)}.` : why });
    hints.push(can ? (shellHexes.size ? 'Zielfeld anklicken.' : 'Kein Ziel: Eine eigene Einheit muss es sehen (5 Felder).') : why);
    if (scoutSet.size) hints.push(`<i>◉ ${scoutSet.size} Felder</i> markiert: keine Streuung, ×1,25.`);
    return btns;
  }
  if (T.cutter) {   // Paket 8: nur Drahtschneider, vom Nachbarfeld aus
    const ct = E.cutTargets(G, sel);
    btns.push({ act: 'cut', sym: 'drahtschere', name: 'Draht schneiden', cost: 1, text: 'Stacheldraht auf diesem oder einem Nachbarfeld entfernen, ohne hineinzulaufen (kein Drahtschaden). Danach darf die Einheit noch angreifen.', pulse: ct.length > 0, on: abilMode && feldArt === 'cut', off: !ct.length,
      why: sel.supp > 0 ? 'Niedergehalten.' : sel.ap < 1 ? 'Aktion schon verbraucht.' : 'Kein Draht auf diesem Feld oder daneben.' });
    if (abilMode && feldArt === 'cut') hints.push('<i>Messing markiert:</i> Drahtfeld anklicken.');
  }
  if (T.zweit) {   // Paket 8: Zweitwaffe (Seiten-MG, Turm-MG)
    const zt = E.zweitTargets(G, sel), Z = T.zweit;
    btns.push({ act: 'zweit', sym: Z.flamme ? 'flamme' : Z.kanone ? 'granate_artillerie' : 'garbe', name: Z.name, costTxt: 'einmal je Runde zusätzlich, kostet keine Aktion', text: Z.flamme ? 'Flammenstoß auf ein Nachbarfeld, einmal je Runde zusätzlich zum Bohrer: halb so stark wie ein Flammentrupp, Deckung schützt nicht, das Feld brennt danach.' : Z.kanone ? `Kanone im Löwenmaul: Reichweite ${Z.rng} Felder, einmal je Runde zusätzlich zum MG, halbe Stärke, gegen Panzerung voll.` : `${Z.seiten ? 'Schießt nur nach links und rechts (nicht nach vorn). ' : ''}Reichweite ${Z.rng} Felder, einmal je Runde zusätzlich zur Kanone, Schaden etwa halb so stark. Wirkt nicht gegen Panzerung.`, on: abilMode && feldArt === 'zweit', off: !zt.length,
      why: sel.zw ? 'Hat in dieser Runde schon geschossen.' : sel.supp > 0 ? 'Niedergehalten.' : sel.ap < 1 ? 'Aktion schon verbraucht.' : sel.broken ? 'Festgefahren.' : `Kein Ziel ${Z.seiten ? 'seitlich ' : ''}bis ${Z.rng} Felder.` });
    if (abilMode && feldArt === 'zweit') hints.push('<i>Messing markiert:</i> Ziel anklicken.');
  }
  if (T.wirelayer && !sel.attacked) btns.push({ act: 'lay', sym: 'drahtrolle', name: 'Draht ziehen', cost: 1, text: 'Stacheldraht auf das Feld legen, in das die Einheit blickt.', pulse: true, off: !E.canLay(G, sel), why: 'Zu einem freien Feld drehen (Drehen-Knöpfe).' });
  const atkWhy = sel.supp > 0 ? 'Niedergehalten: kann nicht schießen oder stürmen.' : sel.attacked ? 'Hat diese Runde schon angegriffen.' : sel.ap < 1 ? 'Aktion schon verbraucht.' : 'Kein Ziel in Reichweite.';
  if (T.rng > 0) {
    const sym = T.lob ? 'handgranate' : T.flame ? 'flamme' : 'zielen', name = T.lob ? 'Granatwurf' : T.flame ? 'Flammenstrahl' : 'Beschuss';
    const why = T.mg && !sel.setup ? 'MG erst aufbauen.' : !sel.supp && !sel.attacked && E.held(G, sel) ? 'Im Nahkampf gebunden: Schießen geht nicht.' : atkWhy;
    if (T.broadside) {   // Sturmpanzer: Breitseite deutlich (2026-11-17) – zwei Schüsse je Runde auf zwei Ziele, Zähler am Knopf, nach dem ersten Schuss pulsiert er
      const n = (sel.bsT || []).length, zweiter = sel.attacked && n === 1, frei = tg.some(t => t.kind === 'fire' || t.both);
      btns.push({ act: 'p-fire', sym: 'zielen', name: zweiter ? 'Breitseite: zweiter Schuss' : 'Breitseite', cost: 1, cnt: Math.max(0, 2 - n), pulse: zweiter && frei, text: `Zwei Schüsse in einer Runde auf zwei verschiedene Ziele, je ×0,6 – erst ein Ziel bis ${T.rng} Felder, danach ein anderes bis 2 Felder (beide Schüsse zusammen die Aktion).`, on: atkPref === 'fire', off: !frei,
        why: n >= 2 ? 'Beide Schüsse der Breitseite sind abgegeben.' : zweiter ? 'Kein zweites Ziel bis 2 Felder.' : why });
      if (zweiter && frei) hints.push('<i>Breitseite:</i> zweites Ziel bis 2 Felder anklicken (×0,6).');
    } else
    btns.push({ act: 'p-fire', sym, name, cost: 1, text: `Ziel auf der Karte anklicken (Messing, Zielsymbol). Reichweite ${T.rng} Felder.`, on: atkPref === 'fire', off: !tg.some(t => t.kind === 'fire' || t.both), why });
  }
  if (T.atk > 0) btns.push({ act: 'p-melee', sym: 'nahkampf', name: 'Nahkampf', cost: 1, costTxt: 'die Aktion, beendet die Bewegung', text: `Gegner auf einem Nachbarfeld anklicken (rot).${T.cls === 'cav' || T.cls === 'storm' || T.suit ? ' Darf auch nach vollem Weg angreifen.' : ` Nur, wenn höchstens die Hälfte der Bewegungspunkte (${Math.floor(E.bpMax(sel) / 2)}) verbraucht ist.`}`, on: atkPref === 'melee', off: !tg.some(t => t.kind === 'melee' || t.both), why: atkWhy });
  if (T.abil) { const A = E.ABILS[T.abil], at = E.abilTargets(G, sel);
    btns.push({ act: 'abil', sym: ABIL_SYM[T.abil] || 'blitz', name: A.name, cost: 1, costTxt: A.all ? 'die Aktion und alle Bewegungspunkte' : undefined, cd: sel.cdA, text: T.can, on: abilMode && feldArt === 'abil', off: !at.length,
      why: sel.cdA > 0 ? `Wieder in ${upRunden(sel.cdA)}.` : T.abil === 'mine' && !(sel.mines > 0) ? 'Keine Minen mehr.' : sel.ap < 1 ? 'Aktion schon verbraucht.' : sel.supp > 0 ? 'Niedergehalten.' : ABIL_KEIN[T.abil] || 'Kein gültiges Zielfeld.' });
    if (abilMode && feldArt === 'abil') hints.push('<i>Messing markiert:</i> Zielfeld anklicken.'); }
  if (T.mg && sel.setup) btns.push({ act: 'teardown', sym: 'mg_ab', name: 'Abbauen', bp: 1, text: 'MG abbauen: danach kann es ziehen, aber nicht mehr schießen, bis es wieder aufgebaut ist.', off: !E.canTeardown(G, sel), why: 'Aktion schon verbraucht.' });
  if (T.mg && !sel.setup) btns.push({ act: 'setup', sym: 'mg_auf', name: 'Aufbauen', bp: 1, costTxt: '1 Bewegungspunkt, nimmt alle restlichen', text: 'MG in Stellung bringen: erst dann feuert es oder gibt Sperrfeuer; aufgebaut kann es nicht ziehen. Schießen geht danach mit der Aktion.', pulse: E.canSetup(G, sel), off: !E.canSetup(G, sel), why: sel.supp > 0 ? 'Niedergehalten.' : 'Aktion schon verbraucht.' });
  if (T.mg) btns.push({ act: 'sperr', sym: 'garbe', name: 'Sperrfeuer', cost: 1, costTxt: 'die Aktion und alle Bewegungspunkte', text: 'Im gegnerischen Zug bis zu 2 Schüsse auf Gegner, die sich im Schussfeld im Offenen bewegen. Nur aufgebaut, in dieser Runde nicht bewegt und nicht geschossen.', on: sel.sperr > 0, off: !E.canSperr(G, sel),
    why: sel.sperr > 0 ? 'Sperrfeuer steht.' : !sel.setup ? 'Erst aufbauen.' : sel.mvd ? 'Hat sich in dieser Runde bewegt.' : sel.attacked ? 'Hat diese Runde schon geschossen.' : 'Aktion schon verbraucht.' });
  if (T.rng >= 2 && !T.mg && T.cls !== 'walker') btns.push({ act: 'ow', sym: 'auge', name: 'Feuerbereitschaft', cost: 1, costTxt: 'die Aktion und alle Bewegungspunkte', text: 'Schießt in der gegnerischen Runde auf den ersten Gegner, der sich in Reichweite bewegt (Schaden ×0,8).', on: !!sel.ow, off: !E.canOverwatch(G, sel), why: sel.ow ? 'Ist schon feuerbereit.' : 'Braucht die Aktion; nur ohne Bewegung in dieser Runde.' });
  const ORD = { rally: ['fahne', 'Sammeln', 'Eigene Truppen im Umkreis von 1 Feld: Moral +15, Niederhalten endet.'], storm: ['blitz', 'Sturmbefehl', 'Eigene Truppen im Umkreis von 1 Feld: Nahkampf ×1,25 in dieser Runde.'], fire: ['zielen', 'Feuer frei', 'Eigene Truppen im Umkreis von 1 Feld: Fernkampf ×1,25 bis zu ihrem nächsten Zug.'] };
  if (sel.officer) for (const [k, sym, name, tip] of E.orderKinds(sel).map(k => [k, ...ORD[k]])) {
    const cd = k === 'rally' ? sel.cdR : sel.cdS;
    const rest = P.ORDER_MAX - (sel.befehle || 0);
    btns.push({ act: 'o-' + k, sym, name, cost: 1, cd, cnt: rest, text: `${tip} Noch ${rest} von ${P.ORDER_MAX} Befehlen in dieser Schlacht (alle Befehle zusammen). Abklingzeit ${E.orderCd(G, sel, k)} Runden.`, off: !E.canOrderKind(G, sel, k), why: rest <= 0 ? `Alle ${P.ORDER_MAX} Befehle verbraucht.` : cd > 0 ? `Wieder in ${upRunden(cd)}.` : 'Nur ein Befehl je Runde.' });
  }
  if (T.cmd === 2) { const B = E.BIG[sel.side], used = G.bigUsed && G.bigUsed[sel.side];   // großer Befehl des Generals: einmal je Schlacht
    btns.push({ act: 'big', sym: B.k === 'hold' ? 'schild' : 'blitz', name: B.name, cost: 1, pulse: E.canBig(G, sel), cnt: used ? 0 : 1, text: B.k === 'hold' ? `Einmal je Schlacht: eigene Einheiten im Umkreis von ${P.BIG_R} Feldern fliehen bis zum nächsten eigenen Zug nicht, Abwehr ×1,25.` : `Einmal je Schlacht: eigene Einheiten im Umkreis von ${P.BIG_R} Feldern erhalten sofort 1 Aktionspunkt.`, off: !E.canBig(G, sel), why: used ? 'Verbraucht: nur einmal je Schlacht.' : 'Braucht 1 Aktionspunkt.' }); }
  if (T.dig) btns.push({ act: 'dig', sym: 'spitzhacke', name: 'Eingraben', cost: 1, on: !!sel.dug, text: 'Im offenen Gelände oder Trichter: Abwehr ×1,3, bis die Einheit wieder zieht.', off: !E.canDig(G, sel), why: sel.dug ? 'Ist schon eingegraben.' : !['open', 'crater'].includes(G.map[sel.c][sel.r].t) ? 'Nur im offenen Gelände oder Trichter.' : 'Braucht 1 Aktionspunkt.' });
  if (T.shieldWall) btns.push({ act: 'shields', sym: 'schild', name: 'Schilde vor', cost: 1, on: !!sel.shields, text: 'Eigene Einheiten in den Nachbarfeldern nehmen bis zum nächsten eigenen Zug Beschuss ×0,75.', off: !E.canShields(G, sel), why: sel.shields ? 'Schilde stehen schon.' : 'Braucht 1 Aktionspunkt.' });
  if (T.banner) btns.push({ act: 'plant', sym: 'fahne', name: sel.planted ? 'Banner aufnehmen' : 'Banner aufpflanzen', cost: 1, on: !!sel.planted, text: sel.planted ? 'Banner aus dem Boden nehmen: der Träger kann wieder ziehen, Wirkung wieder 2 Felder.' : 'Banner in den Boden: wirkt 3 Felder weit, dort flieht niemand. Der Träger zieht nicht, solange es steht.', off: !E.canPlant(G, sel), why: 'Braucht 1 Aktionspunkt.' });
  if (T.cls === 'medic' && !sel.attacked) btns.push({ act: 'i-heal', sym: 'sanitaeter', name: 'Versorgen', cost: 1, cd: sel.cdH, text: 'Nachbarn mit Sanitätszeichen anklicken: Stärke +25, Moral +15.', off: !healSet.size, why: sel.cdH > 0 ? `Wieder in ${upRunden(sel.cdH)}.` : 'Kein verwundeter Nachbar. Neben eine angeschlagene eigene Einheit ziehen.' });
  if (T.courier && !sel.sent) btns.push({ act: 'i-send', sym: 'meldehund', name: 'Befehl überbringen', cost: 1, text: `Einheit mit Hundesymbol anklicken: Sie bekommt +${P.MELDER_BP} Bewegungspunkte.`, off: !sendSet.size, why: 'Keine Einheit in Reichweite.' });
  if (T.recover) btns.push({ act: 'i-rec', sym: 'schraubenschluessel', name: 'Bergen', cost: 1, cd: sel.cdB, text: 'Koloss bzw. Maschine mit Schraubenschlüssel anklicken.', off: !recSet.size, why: sel.cdB > 0 ? `Wieder in ${upRunden(sel.cdB)}.` : 'Kein liegengebliebener Koloss daneben.' });
  if (!sel.supp && !sel.broken) {
    const dk = E.drehKosten(sel), dt = T.cls === 'walker' ? `Fahrzeuge und Schreiter: Drehen auf der Stelle kostet ${P.DREH_BP} Bewegungspunkt je 60°. Die Hauptwaffe schießt nur nach vorn (±${P.FZ_FAN}°).` : 'Blickrichtung ändern. Drehen kostet nichts.';
    btns.push({ act: 'tl', sym: 'drehpfeil', name: 'Nach links drehen', bp: dk, text: dt, off: (sel.bp || 0) < dk, why: 'Keine Bewegungspunkte mehr.' });
    btns.push({ act: 'tr', sym: 'drehpfeil', name: 'Nach rechts drehen', bp: dk, mirror: true, text: dt, off: (sel.bp || 0) < dk, why: 'Keine Bewegungspunkte mehr.' });
  }
  if (!spent.has(sel.id)) btns.push({ act: 'pass', sym: 'haken', name: 'Fertig', text: 'Diese Einheit ist für diese Runde fertig.' });
  // Hinweiszeile
  if (sel.supp > 0) hints.push('▼ Niedergehalten: bleibt liegen, kann weder ziehen, schießen noch stürmen.');
  else if (T.rng > 0 && E.held(G, sel)) hints.push('⚔ Im Nahkampf gebunden: Schießen geht nicht.');
  else if (sel.fellBack) hints.push('MG ist zurückgewichen und schießt in dieser Runde nicht mehr.');
  if (T.relay) hints.push('<i>Helle Felder:</i> Sicht des Trupps.');
  hints.push(sel.broken ? 'Panne: fällt diese Runde aus.' : sel.ap < 1 && !(sel.bp > 0) ? 'Aktion und Bewegung verbraucht.' :
    `${reach.size ? (sel.mvd ? `Helle Felder: weiterziehen (noch ${sel.bp || 0} BP).` : [...reach.values()].some(n => n.retreat) ? 'Rückzug aus der Feindberührung: Aktion und alle BP.' : [...reach.values()].some(n => n.march) ? `Hell <img class="hint-sym" src="${upSym('stiefel')}" alt="Stiefel">: ziehen (${sel.bp || 0} BP). Gelb gestrichelt <img class="hint-sym" src="${upSym('marsch')}" alt="Stiefel mit Flügeln">: Marsch (Aktion für +50 % BP). Zahl am Zielfeld = restliche BP.` : `Helle Felder <img class="hint-sym" src="${upSym('stiefel')}" alt="Stiefel">: ziehen.`) : ''}${sel.attacked ? '' : targets.size ? ' Rot: Nahkampf, Messing: Beschuss.' : ''}`);
  return btns;
}
function updateHud() {
  if (!G) return;
  const hud = $('hud'), u = placing ? null : (sel || (inspect && inspect.unit) || null);
  const hasU = !!(u && E.alive(u));
  const hints = []; let btns = [];
  if (hasU) {
    const T = TYPES[u.type], h = G.map[u.c][u.r];
    $('portrait').hidden = false; drawPortrait($('portrait'), figU(u), u.side, u.type, u.limbered);
    const mine = human(G.side) ? G.side : (mode === 'hot' ? G.side : mode);
    $('upMark').innerHTML = crest(u.side);
    $('hudName').textContent = T.name;
    $('hudSub').innerHTML = `<i class="${u.side}">${SIDES[u.side].short}</i>${u.officer ? ` · ${UP.orden ? `<img class="up-orden" src="${UP.orden}" alt="Anführer">` : '★ '}${u.officer}` : ''} · ${h.river && h.t === 'canal' ? 'Fluss' : TERRAIN[h.t].name}${h.ridge ? ' (Höhe)' : ''}`;
    // Zeile mit ALLEN Zuständen als Symbole (Deckung zuerst), Tooltip je Symbol
    { const d = DU.get(u.id), cv = coverTip(u);
      hudTips = [cv && { ...cv, img: UP['cov' + cv.tier], cls: 'cov' }, ...statesOf(u, d).map(st => st.blockiert && st.blockiert(u, d) ? { name: st.name + ' (blockiert)', text: st.textBlock(u, d), img: upSym(st.sym), cls: 'blockiert' } : { name: st.name, text: st.text(u, d), img: upSym(st.sym), cls: st.k === 'supp' ? 'gross' : '' })].filter(Boolean);
      $('hudStates').innerHTML = hudTips.map((t, i) => `<span class="up-st${t.cls ? ' ' + t.cls : ''}" data-i="${i}" tabindex="0" aria-label="${upEsc(t.name)}"><img src="${t.img}" alt=""></span>`).join(''); }
    const own = u.side === G.side && E.active(u), ap = Math.max(0, u.ap || 0);
    const hn = hudHN[u.id] = hudHN[u.id] || {}; hpNach(hn, u.str); setTimeout(() => hudNachLauf(u.id), 0);
    $('hudStats').innerHTML = upBar('hp ' + lifeTier(u.str / 10), 'Leben', u.str, 10, hpNachV(hn._hn, performance.now())) + upBar('mor' + (u.mor < P.FALLBACK_MOR + 1 ? ' bad' : ''), 'Moral', u.mor, T.mor) +
      `<div class="up-tiles"><span class="up-t" title="Bewegungspunkte: ${own ? `noch ${u.bp || 0} von ${E.bpMax(u)}` : E.bpMax(u)}. Gelände kostet 1–3; Marsch (Stiefel mit Flügeln) gibt für die Aktion +50 %."><img src="${upSym('stiefel')}" alt="Bewegung">${own ? (u.bp || 0) : E.bpMax(u)}<small>${own ? ' / ' + E.bpMax(u) : ''} BP</small></span>` +
      (own ? `<span class="up-t" title="Aktion: ${ap ? 'noch frei' : 'verbraucht'} – Schießen, Nahkampf, Befehl, Fähigkeit oder Marsch${T.zweit ? `; kleine Münze: ${T.zweit.name}, einmal je Runde zusätzlich` : ''}"><img src="${upSym('blitz')}" alt="Aktion"><i class="up-pip${ap ? '' : ' used'}"></i>${T.zweit ? `<i class="up-pip klein${sel && sel.zw ? ' used' : u.zw ? ' used' : ''}"></i>` : ''}</span>` : '') +
      `<span class="up-t" title="Reichweite"><img class="wide" src="${upSym('gewehr')}" alt="Reichweite">${T.rng ? `${T.rng} <small>Felder</small>` : '–'}</span></div>`;
    $('btnInfo').hidden = false;
    if (previewT && sel) {
      const t = targets.get(previewT.id), p = E.preview(G, sel, previewT, t.kind);
      hints.push(`<b>${t.kind === 'fire' ? 'Beschuss' : 'Nahkampf'} → ${TYPES[previewT.type].name}</b> Schaden ≈ <i>${fmt(p.dmg)}</i>${t.kind === 'fire' ? '' : ` · Gegenschlag ≈ <i>${fmt(p.counter)}</i>`} · ${p.tags.join(' · ') || 'keine Zu- oder Abschläge'} · <em>${lastPT === 'mouse' ? 'Klicken' : 'Nochmal tippen'} zum Angreifen</em>`);
    }
    if (sel && human(sel.side) && sel.side === G.side) btns = unitButtons(T, hints);
    else if (!hints.length) hints.push(T.can);
  } else {
    $('portrait').hidden = true; $('btnInfo').hidden = true; $('hudStats').innerHTML = ''; $('upMark').innerHTML = ''; $('hudStates').innerHTML = ''; hudTips = [];
    if (placing) {
      $('hudName').textContent = 'Nachschub: ' + TYPES[placing].name;
      $('hudSub').innerHTML = 'Aufstellen';
      hints.push('Tippe ein grünes Feld am eigenen Rand oder an einem eigenen Zielfeld an. Die Einheit kann ab der nächsten Runde handeln.');
    } else if (inspect && inspect.hex) {
      const h = G.map[inspect.hex[0]][inspect.hex[1]], T = TERRAIN[h.t], o = OBJECTIVES.find(x => x.c === inspect.hex[0] && x.r === inspect.hex[1]);
      $('hudName').textContent = (h.river && h.t === 'canal' ? 'Fluss' : T.name) + (h.ridge ? ' auf der Höhe' : '');
      $('hudSub').innerHTML = o ? `Zielfeld: ${o.name} · ${o.pts} Punkte` : 'Gelände';
      hints.push(`${h.river && h.t === 'canal' ? 'Nicht passierbar, nur über Brücken und Furten.' : T.info}${h.road ? ' Hier verläuft eine Straße.' : ''}${h.rail ? ' Hier verläuft die Bahnlinie.' : ''}${h.ridge ? ' Höhe: Fernkampf +1 Reichweite.' : ''}${E.cloudAt(G, inspect.hex[0], inspect.hex[1]) ? ' Gaswolke: schadet jeder Einheit, die hier ihren Zug beginnt.' : ''}${T.real ? ' <em>Im echten Krieg: ' + T.real + '</em>' : ''}`);
    } else {
      $('hudName').textContent = G.over ? 'Schlacht beendet' : human(G.side) ? SIDES[G.side].name : 'Die KI ist am Zug';
      $('hudSub').innerHTML = `${E.MAP.name} · Runde ${G.turn} · Siegpunkte ${G.vp.A} : ${G.vp.D}, Ziel ${G.goal}`;
      hints.push(human(G.side) ? 'Tippe eine eigene Einheit an. Tippe auf Gegner oder Gelände für Infos.' : 'Bitte warten …');
    }
  }
  $('hudSub').title = $('hudSub').textContent;
  hud.className = 'upanel' + (hasU ? ' ' + u.side : ' nounit') + (btns.length > 7 ? ' many' : ''); hud.style.setProperty('--n', Math.max(1, btns.length));   // Knopfgröße teilt die Breite auf (CSS .up-ab)
  // Name immer ganz (Wunsch des Nutzers): erst kleiner bis 15 px, reicht das nicht, zweizeilig
  { const el = $('hudName'), rg = document.createRange(), over = () => { rg.selectNodeContents(el); return rg.getBoundingClientRect().width > el.getBoundingClientRect().width + 0.01; };   // genau messen, auch Bruchteile von Pixeln
    el.style.fontSize = ''; el.classList.remove('two');
    for (let fs = 20; fs >= 15 && over(); fs--) el.style.fontSize = fs + 'px';
    if (over()) { el.style.fontSize = ''; el.classList.add('two'); } }
  if (touchMove != null && sel && lastPT !== 'mouse') hints.unshift('<em>Nochmal tippen zum Ziehen</em>');
  const hn = $('hudHint'); hn.innerHTML = hints.filter(Boolean).join(' · '); hn.title = hn.textContent;
  // Draht-Knöpfe zuerst (Wunsch des Nutzers), dann die übrigen in fester Reihenfolge
  btns = btns.filter(b => b.pulse && (b.act === 'cut' || b.act === 'lay')).concat(btns.filter(b => !(b.pulse && (b.act === 'cut' || b.act === 'lay'))));
  upBtns = btns;
  neuKarteMehr(hasU ? u : null); setTimeout(neuKnopfreihe, 0);
  $('hudRow').innerHTML = btns.map(upBtn).join('') + (placing ? '<button class="up-text" data-act="cancel">Abbrechen</button>' : '');
  $('hudRow').querySelectorAll('.up-ab[data-act]').forEach(b => {   // Wirkungsbereich zeigen: Maus beim Überfahren, Finger solange gedrückt (+1,5 s)
    b.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') areaAct = b.dataset.act; });
    b.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse' && areaAct === b.dataset.act) areaAct = null; });
    b.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') { areaAct = b.dataset.act; clearTimeout(b._at); } });
    b.addEventListener('pointerup', e => { if (e.pointerType !== 'mouse') b._at = setTimeout(() => { if (areaAct === b.dataset.act) areaAct = null; }, 1500); }); });
  $('hudRow').querySelectorAll('[data-act]').forEach(b => {
    let tm = 0, long = false;
    b.onpointerdown = e => { long = false; if (e.pointerType !== 'mouse') tm = setTimeout(() => { long = true; b.classList.add('show'); }, 420); };
    b.onpointerup = b.onpointercancel = b.onpointerleave = () => { clearTimeout(tm); if (b.classList.contains('show')) setTimeout(() => b.classList.remove('show'), 1600); };
    b.onclick = () => { if (long) { long = false; return; } if (b.classList.contains('off')) return; panelAct(b.dataset.act); };
  });
}
// Tooltips der Zustandssymbole im Panel: Maus beim Drüberfahren, Touch durch Antippen
let hudTips = [];
{ const box = $('hudStates'), at = e => e.target.closest('.up-st'), show = (el, ms) => { const t = hudTips[+el.dataset.i], r = el.getBoundingClientRect(); if (t) showTip([t], r.left + r.width / 2, r.top, 'hud' + el.dataset.i + t.name, ms); };
  box.addEventListener('pointerover', e => { const el = at(e); if (el && e.pointerType === 'mouse') show(el); });
  box.addEventListener('pointerout', e => { if (at(e) && e.pointerType === 'mouse') hideTip(); });
  box.addEventListener('pointerdown', e => { const el = at(e); if (el && e.pointerType !== 'mouse') show(el, 3500); });
  box.addEventListener('focusin', e => { const el = at(e); if (el) show(el); }); box.addEventListener('focusout', hideTip);
  box.addEventListener('contextmenu', e => e.preventDefault()); }
async function panelAct(a) {
  if (a === 'cancel') return cancelPlace();
  if (a.startsWith('i-')) { toast({ 'i-heal': 'Versorgen: Nachbarn mit Sanitätszeichen anklicken.', 'i-send': 'Befehl überbringen: Einheit mit Hundesymbol anklicken.', 'i-rec': 'Bergen: Koloss mit Schraubenschlüssel anklicken.' }[a] || ''); return; }
  if (a === 'pass') { playSound('klick', 0.5, null); E.pass(G, sel); sel = null; computeOptions(); updateUI(); return; }
  if (a === 'o-rally' || a === 'o-storm' || a === 'o-fire') return act(() => E.order(G, sel, a.slice(2)));
  if (a === 'big') return act(u => E.bigOrder(G, u));
  if (a === 'plant') return act(u => E.plantBanner(G, u));
  if (a === 'dig') return act(u => E.dig(G, u));
  if (a === 'shields') return act(u => E.shieldsUp(G, u));
  if (a === 'p-melee' || a === 'p-fire') { const v = a.slice(2); atkPref = atkPref === v ? 'auto' : v; const keep = previewT; computeOptions(); previewT = keep && targets.has(keep.id) ? keep : null; updateHud(); return; }
  if (!sel || busy) return;
  if (a.startsWith('m-')) { artMode = a.slice(2); previewT = null; computeOptions(); updateHud(); return; }
  if (a === 'tl' || a === 'tr') { const nf = (sel.face + (a === 'tr' ? 1 : 5)) % 6; await play(E.turnUnit(G, sel, nf)); computeOptions(); updateHud(); return; }
  if (a === 'cut' || a === 'zweit') { const t = a === 'cut' ? E.cutTargets(G, sel) : E.zweitTargets(G, sel);
    if (a === 'cut' && t.length === 1) return act(u => E.cutWire(G, u, t[0][0], t[0][1]));   // nur ein Drahtfeld: gleich schneiden
    if (abilMode && feldArt === a) { abilMode = false; feldArt = 'abil'; } else { abilMode = true; feldArt = a; }
    previewT = null; computeOptions(); updateHud(); return; }
  if (a === 'lay') return act(u => E.layWire(G, u));
  if (a === 'limber') return act(u => E.limber(G, u));
  if (a === 'setup') return act(u => E.setupMG(G, u));
  if (a === 'teardown') return act(u => E.teardownMG(G, u));
  if (a === 'abil') { abilMode = !(abilMode && feldArt === 'abil'); feldArt = 'abil'; previewT = null; computeOptions(); updateHud(); return; }
  if (a === 'ow') return act(u => E.overwatch(G, u));
  if (a === 'sperr') return act(u => E.sperr(G, u));
}
function showDetail() {
  const u = sel || (inspect && inspect.unit); if (!u) return;
  const T = TYPES[u.type];
  drawPortraitLater($('detPortrait'), figOf(T), u.side, u.type);
  $('detName').textContent = T.name; $('detSide').textContent = SIDES[u.side].name;
  $('detCan').textContent = T.can; $('detReal').textContent = T.real;
  $('detSp').innerHTML = (T.sp || []).map(x => `<span class="sp">${x}</span>`).join('');
  $('detStats').innerHTML = pill('Angriff', T.atk || '–') + pill('Abwehr', T.def) + pill('Moral', T.mor) + pill('Zug', T.mv) + pill('Schuss', T.rng ? `${T.rng} Felder` : '–') + pill('Kosten', '★ ' + (E.COST[u.type] || '–'));
  const cp = E.costParts(u.type);
  $('detCost').innerHTML = `Kosten <b>★ ${cp.total}</b> = Kampfwert ${cp.base}` + cp.abil.map(([n, v]) => ` ${v < 0 ? '−' : '+'} ${n} ${Math.abs(v)}`).join('') + (cp.total !== cp.base + cp.abil.reduce((s, a) => s + a[1], 0) ? ' (gerundet)' : '');
  $('detOff').hidden = !u.officer;
  $('detail').hidden = false;
}
function drawPortraitLater(c, k, s, t) { requestAnimationFrame(() => drawPortrait(c, k, s, t)); }

// ---------- Bildschirme ----------
const ATTACKERS = { A: { name: 'Konkordat von Valmor', short: 'Konkordat' }, F: { name: 'Blaue Legion von Arvenne', short: 'Legion' } };
function applySkin(sk) {
  skinA = sk; FIG.setSkin('A', sk); SIDES.A.name = ATTACKERS[sk].name; SIDES.A.short = ATTACKERS[sk].short;
  for (const sd of ['A', 'D']) { FIG.PAL[sd].accent = sideCol(sd); document.documentElement.style.setProperty('--' + sd, sideCol(sd)); }   // Ringe, Marken, Balken
  drawFlagPick();
}
// Startmenü in Schritten: title → side → map → setup (dazu opts). Jede Seite hat „Zurück“.
const curSide = () => (document.querySelector('input[name=side]:checked') || {}).value || 'A';   // A Konkordat, F Blaue Legion, D Aschenwacht
const curSkin = () => curSide() === 'D' ? (document.querySelector('input[name=att]:checked') || {}).value || 'A' : curSide();
function startStep(st) {
  $('start').dataset.step = st;
  if (st === 'side') drawFacUnits();
  if (st === 'map') requestAnimationFrame(() => document.querySelectorAll('#mapPick canvas').forEach(c => drawMapPreview(c, c.dataset.map)));
  if (st === 'setup') setupSync();
}
function drawFacUnits() {   // Einheitenbilder je Fraktionskarte; die Legion braucht kurz das Bilderset F
  requestAnimationFrame(() => { for (const c of document.querySelectorAll('.sm-units canvas')) { if (c.dataset.sk) FIG.setSkin('A', c.dataset.sk); drawPortrait(c, c.dataset.k, c.dataset.s, c.dataset.sk === 'F' ? null : c.dataset.t); } FIG.setSkin('A', skinA); });
}
function setupSync() {
  const sd = curSide(), m = E.MAPS[mapSel], hot = curMode() === 'hot';
  $('smAttRow').hidden = sd !== 'D';
  $('smSum').textContent = (sd === 'D' ? 'Aschenwacht des Grauwalls' : ATTACKERS[sd].name) + ' · ' + (m ? m.name : '') + (hot ? ' · zu zweit' : ' · gegen die KI');
  armyInfo();
}
function showStart(first) {
  setMusik('musik_titel', 2);   // Titelmusik im Startmenü (Schleife, aus der Schlacht weich übergeblendet)
  $('start').hidden = false; setMap(mapSel); drawMapPick(); armyInfo(); drawFlagPick(); $('setSpeed').textContent = speedTxt(); $('setZoom').textContent = zoomTxt(); $('closeStart').hidden = first;
  startStep('title');
}
// ---------- Armee-Auswahl vor der Schlacht ----------
const customArmy = { A: null, D: null };
const mechsOn = () => $('optMechs').checked;
function mechChanged() { if (!mechsOn()) for (const sd of ['A', 'D']) if (customArmy[sd]) { for (const t in customArmy[sd]) if (E.isMech(t)) delete customArmy[sd][t]; if (!E.armyOk(sd, customArmy[sd], false)) customArmy[sd] = null; } armyInfo(); }
const roster = sd => E.ROSTER[sd].filter(t => mechsOn() || !E.isMech(t));
function drawFlagPick() {   // jede Fraktion hat genau ein Wappen (keine Auswahl mehr)
  $('facFlagA').src = UP.fA || ''; $('facFlagF').src = UP.fF || ''; $('facFlagD').src = UP.fD || '';
}
let armySide = 'A', armyDraft = {};
// General ist Pflicht: genau einer je Armee, in der Auswahl fest gesetzt (Spieltest 2026-11-17)
const isGeneral = t => TYPES[t] && TYPES[t].cmd === 2;
function armyFixGeneral(sd) { for (const t in armyDraft) if (isGeneral(t)) delete armyDraft[t]; const g = roster(sd).find(isGeneral); if (g) armyDraft[g] = 1; }
const curMode = () => (document.querySelector('input[name=opp]:checked') || {}).value === 'hot' ? 'hot' : curSide() === 'D' ? 'D' : 'A';
function armyInfo() {
  const sides = curMode() === 'hot' ? ['A', 'D'] : [curMode()];
  $('armyInfo').textContent = sides.map(sd => SIDES[sd].short + ': ' + (customArmy[sd] ? `eigene Armee (${E.armyCost(customArmy[sd])}/${E.ARMY_BUDGET[sd]} Punkte, ${E.armyCount(customArmy[sd])} Einheiten)` : 'Standardarmee')).join(' · ');
}
function openArmy(sd) {
  armySide = sd; armyDraft = Object.assign({}, customArmy[sd] || E.defaultArmy(sd));
  applySkin(curSkin());
  $('armyName').textContent = SIDES[sd].name; $('armySwap').hidden = curMode() !== 'hot'; $('armyMechRow').hidden = mechsOn();
  for (const t in armyDraft) if (E.isMech(t) && !mechsOn()) delete armyDraft[t];
  armyFixGeneral(sd);
  $('armyList').innerHTML = roster(sd).map(t => { const T = TYPES[t];
    return `<div class="item pick ${sd}" data-t="${t}"><canvas data-k="${figOf(T)}" data-t="${t}"></canvas><b>${T.name}</b><span class="cost">★ ${E.COST[t]}</span><small>${T.can}</small>${isGeneral(t) ? '<span class="stepper fixed" data-tip="Pflicht: Jede Armee hat genau einen General."><i>1</i><em>Pflicht</em></span>' : '<span class="stepper"><button class="tbtn" data-d="-1" aria-label="weniger">−</button><i>0</i><button class="tbtn" data-d="1" aria-label="mehr">+</button></span>'}</div>`; }).join('');
  $('army').hidden = false;
  requestAnimationFrame(() => $('armyList').querySelectorAll('canvas').forEach(c => drawPortrait(c, c.dataset.k, sd, c.dataset.t)));
  $('armyList').querySelectorAll('.stepper button').forEach(b => b.onclick = () => {
    const t = b.closest('.item').dataset.t; armyDraft[t] = Math.max(0, Math.min(E.ARMY_CAP, (armyDraft[t] || 0) + +b.dataset.d)); armyRefresh();
  });
  armyRefresh();
}
function armyRefresh() {
  const sd = armySide, cost = E.armyCost(armyDraft), n = E.armyCount(armyDraft), bud = E.ARMY_BUDGET[sd];
  let walkers = 0; for (const t in armyDraft) if (TYPES[t].cls === 'walker') walkers += armyDraft[t];
  $('armyList').querySelectorAll('.item').forEach(it => { const v = armyDraft[it.dataset.t] || 0; it.querySelector('i').textContent = v; it.classList.toggle('has', v > 0); });
  $('armyPts').textContent = `${cost} / ${bud}`; $('armyPts').classList.toggle('over', cost > bud);
  $('armyCnt').textContent = `${n} Einheiten (${E.ARMY_MIN[sd]} bis ${E.ARMY_MAX[sd]})`;
  const msg = cost > bud ? `${cost - bud} Punkte zu viel.` : n < E.ARMY_MIN[sd] ? `Mindestens ${E.ARMY_MIN[sd]} Einheiten.` : n > E.ARMY_MAX[sd] ? `Höchstens ${E.ARMY_MAX[sd]} Einheiten.`
    : walkers > E.ARMY_WALKERS ? `Höchstens ${E.ARMY_WALKERS} Kolosse und Kampfmaschinen.` : cost < bud ? `Noch ${bud - cost} Punkte frei.` : 'Alle Punkte verteilt.';
  $('armyMsg').textContent = msg; $('armyOk').disabled = !E.armyOk(sd, armyDraft, mechsOn());
}
function armyKeep() { if (!E.armyOk(armySide, armyDraft, mechsOn())) return false; const a = {}; for (const t in armyDraft) if (armyDraft[t] > 0) a[t] = armyDraft[t]; customArmy[armySide] = a; return true; }

// ---------- Kartenwahl ----------
const TCOL = { open: '#6d6250', mud: '#4f4433', crater: '#5c5141', trench: '#2e271e', wire: '#7a6e5c', village: '#8a7e66', forest: '#3f4a2c', canal: '#355260', bridge: '#9a8a6a',
  furt: '#4f7480', sumpf: '#4b5a36', wald: '#24331c', waldweg: '#6b6a44', bunker: '#a7a59a', fabrik: '#8a5a44', kirche: '#c2bba8', barrikade: '#7a5a3a', bahn: '#56524a' };
function drawMapPreview(cvs, id) {
  const prev = mapSel; setMap(id); const M = E.buildMap(), m = E.MAP; setMap(prev);
  const W = cvs.clientWidth || 180, H = cvs.clientHeight || 120, dpr = Math.min(2, window.devicePixelRatio || 1);
  cvs.width = W * dpr; cvs.height = H * dpr; const g2 = cvs.getContext('2d'); g2.scale(dpr, dpr);
  const pim = m.img && MIMG[m.img], kp = pim ? (1.5 * m.cols + 0.5) / (pim.naturalWidth / pim.naturalHeight * SQ3 * (m.rows + 0.5)) : 0.58;   // gestaucht wie im Spiel (Seitenansicht)
  const s2 = Math.min(W / (1.5 * m.cols + 0.5), H / (SQ3 * kp * (m.rows + 0.5)));
  const ox = (W - s2 * (1.5 * m.cols + 0.5)) / 2, oy = (H - s2 * SQ3 * kp * (m.rows + 0.5)) / 2;
  const hp = (c, r) => [ox + s2 * (1 + 1.5 * c), oy + s2 * SQ3 * kp * (r + 0.5 * (c & 1) + 0.5)];
  if (pim) g2.drawImage(pim, ox, oy, s2 * (1.5 * m.cols + 0.5), s2 * SQ3 * kp * (m.rows + 0.5));
  for (let c = 0; c < m.cols; c++) for (let r = 0; r < m.rows; r++) {
    const [x, y] = hp(c, r); g2.beginPath(); for (let k = 0; k < 6; k++) { const a = Math.PI / 3 * k; g2.lineTo(x + s2 * Math.cos(a), y + s2 * kp * Math.sin(a)); }
    g2.closePath(); if (!pim) { g2.fillStyle = TCOL[M[c][r].t] || '#6d6250'; g2.fill(); }
    if (M[c][r].ridge) { g2.fillStyle = 'rgba(255,226,160,0.18)'; g2.fill(); }
    if (c <= m.zoneA) { g2.fillStyle = 'rgba(201,74,61,0.22)'; g2.fill(); }
  }
  for (const o of m.objectives) { const [x, y] = hp(o.c, o.r); g2.beginPath(); g2.arc(x, y, Math.max(5, s2 * 0.95), 0, 7); g2.fillStyle = '#C2A461'; g2.fill(); g2.lineWidth = 1.5; g2.strokeStyle = '#0a0706'; g2.stroke();
    g2.fillStyle = '#fff'; g2.font = `800 ${Math.max(8, Math.round(s2 * 1.3))}px "Arm Text", system-ui`; g2.textAlign = 'center'; g2.textBaseline = 'middle'; g2.fillText(o.pts, x, y + 0.5); }
}
// Hintergrund hinter dem Startmenü zeigt die gewählte Karte
function bgGame() { G = E.newGame({ seed: 7, map: mapSel }); decals.length = 0; initDU(); layout(); syncAll(); updateUI(); }
function drawMapPick() {
  $('mapPick').innerHTML = Object.values(E.MAPS).map(m => { const tot = m.objectives.reduce((n, o) => n + o.pts, 0);
    return `<label class="mapcard"><input type="radio" name="map" value="${m.id}" ${m.id === mapSel ? 'checked' : ''}><canvas data-map="${m.id}"></canvas><b>${m.name}</b><span class="msize">${m.size} · ${m.objectives.length} Zielfelder · Sieg bei ${m.goal || Math.round(tot * P.GOAL_K)} Punkten</span><small>${m.desc}</small></label>`; }).join('');
  requestAnimationFrame(() => document.querySelectorAll('#mapPick canvas').forEach(c => drawMapPreview(c, c.dataset.map)));
  document.querySelectorAll('input[name=map]').forEach(i => i.addEventListener('change', () => { setMap(i.value); customArmy.A = customArmy.D = null; armyInfo(); bgGame(); }));
}

function startGame() {
  setMusik(null);
  mode = curMode();
  blood = $('optBlood').checked; tbSync();
  applySkin(curSkin());
  $('start').hidden = true; $('end').hidden = true;
  setMap(mapSel);
  G = E.newGame({ map: mapSel, mechs: mechsOn(), army: { A: human('A') ? customArmy.A : null, D: human('D') ? customArmy.D : null } });
  fxs.length = gmarks.length = decals.length = particles.length = floaters.length = tracers.length = shells.length = booms.length = flames.length = rings.length = muzzles.length = 0;
  initDU(); layout(); syncAll();
  aufstellSeiten = mode === 'ai' ? [] : ['A', 'D'].filter(human);   // Aufstellungsphase (Fahrplan 2): menschliche Seiten stellen selbst auf, die KI automatisch
  if (aufstellSeiten.length) G.aufstellung = aufstellSeiten.shift(); else E.startTurn(G);
  sel = null; inspect = null; placing = null; spawnSet = new Set(); LOG.length = 0; lastSel.A = lastSel.D = null; stimmeVon.clear(); for (const k in stimmeNaechste) delete stimmeNaechste[k]; renderDiary(); updateUI();
  requestAnimationFrame(() => camHome(true));
  banner(E.MAP.name, G.aufstellung ? 'Aufstellung: Einheiten in der grünen Zone verschieben' : `Zielfelder besetzen und halten · wer zuerst ${G.goal} Siegpunkte hat, gewinnt`); playSound('march', 0.45); playSound('whistle', 0.5); setAmbient(soundOn);
  if (G.aufstellung) return aufstellAnzeige();
  if (mode === 'hot') showHandover(); else if (!human(G.side)) aiTurn();
}
// ---------- Aufstellungsphase (Fahrplan 2, 2026-11-17) ----------
// Vor Runde 1 stellt jede menschliche Seite ihre Einheiten in ihrer Startzone (grün) auf: ziehen (Maus/Finger), Ablegen auf eine eigene Einheit tauscht;
// antippen und dann Zielfeld antippen geht auch. „Automatisch aufstellen“ = Kartenvorgabe, „Schlacht beginnen“ startet Runde 1.
let aufstellSeiten = [], aufstellZiehen = null, aufstellWahl = null, aufstellZiel = null;
function aufstellAnzeige() {
  const on = !!(G && G.aufstellung); document.body.classList.toggle('aufstellung', on); $('aufstellLeiste').hidden = !on;
  if (on) $('aufstellText').innerHTML = `<b>Aufstellung – ${SIDES[G.aufstellung].short}</b><span>Einheiten in der grünen Zone ziehen; auf eine eigene Einheit ablegen tauscht beide. Antippen und Zielfeld antippen geht auch.</span>`;
}
function aufstellFertig() {
  if (!G || !G.aufstellung) return; aufstellWahl = null; aufstellZiel = null;
  if (aufstellSeiten.length) { G.aufstellung = aufstellSeiten.shift(); camHome(true); aufstellAnzeige(); return; }
  G.aufstellung = null; aufstellAnzeige(); E.startTurn(G); syncAll(); updateUI(); playSound('whistle', 0.5);
  banner(E.MAP.name, `Zielfelder besetzen und halten · wer zuerst ${G.goal} Siegpunkte hat, gewinnt`);
  if (mode === 'hot') showHandover(); else if (!human(G.side)) aiTurn();
}
function aufstellSetze(u, c, r) { const ok = E.aufstellen(G, u, c, r); syncAll(); if (ok) { playSound('klick', 0.3, null, { noGap: true }); aufstellWahl = null; } return ok; }
$('aufstellAuto').onclick = () => { if (!G || !G.aufstellung) return; E.autoAufstellen(G, G.aufstellung); initDU(); syncAll(); aufstellWahl = null; updateUI(); };
$('aufstellLos').onclick = () => aufstellFertig();
cv.addEventListener('pointerdown', ev => {   // vor dem Kamera-Ziehen: eigene Einheit greifen
  if (!G || !G.aufstellung || busy || pinch || ev.button > 0) return;
  const p = pick(...evToPx(ev)), u = p.uFig || p.uHex; if (!u || u.side !== G.aufstellung) return;
  ev.stopImmediatePropagation(); aufstellZiehen = { u, x: ev.clientX, y: ev.clientY, moved: false }; try { cv.setPointerCapture(ev.pointerId); } catch (e) {}
}, true);
window.addEventListener('pointermove', ev => {
  const z = aufstellZiehen; if (!z) return;
  if (!z.moved && Math.hypot(ev.clientX - z.x, ev.clientY - z.y) > (ev.pointerType === 'mouse' ? 6 : 12)) z.moved = true;
  if (!z.moved) return; const [x, y] = evToPx(ev), d = DU.get(z.u.id); if (d) { d.x = x; d.y = y; }
  const h = pick(x, y).h; aufstellZiel = h ? { h, ok: E.canPlaceStart(G, z.u, h[0], h[1]) && (!E.unitAt(G, h[0], h[1]) || E.unitAt(G, h[0], h[1]).side === z.u.side) } : null;
});
window.addEventListener('pointerup', ev => {
  const z = aufstellZiehen; if (!z) return; aufstellZiehen = null; aufstellZiel = null; dragged = performance.now();   // kein Klick hinterher
  if (z.moved) { const h = pick(...evToPx(ev)).h; if (!h || !aufstellSetze(z.u, h[0], h[1])) syncAll(); return; }
  if (aufstellWahl && aufstellWahl !== z.u) { aufstellSetze(aufstellWahl, z.u.c, z.u.r); return; }   // antippen, dann eigene Einheit antippen: tauschen
  aufstellWahl = aufstellWahl === z.u ? null : z.u; playSound('ui', 0.3, null);
});
function showHandover() {
  $('handover').hidden = false; $('handover').className = 'overlay center hand ' + G.side;
  $('handTitle').textContent = SIDES[G.side].name; $('handText').textContent = `Runde ${G.turn}. Gebt das Gerät weiter.`;
}
function showEnd() {
  const r = G.over, me = mode === 'hot' ? null : mode, win = r.winner;
  let title = win ? SIDES[win].short + ' siegt' : 'Unentschieden';
  if (me) title = win === me ? 'Sieg' : win ? 'Niederlage' : 'Unentschieden';
  const why = r.why === 'break' ? (win === 'A' ? 'Die Aschenwacht ist zusammengebrochen.' : 'Das Konkordat ist zusammengebrochen.')
    : r.why === 'time' ? `Nach ${P.MAX_ROUNDS} Runden steht es ${G.vp.A} : ${G.vp.D} Siegpunkte.`
    : `${SIDES[win].short} hat zuerst ${G.goal} Siegpunkte erreicht. Endstand ${G.vp.A} : ${G.vp.D}.`;
  let stars = 0;
  if (me) { if (win === me) stars = 2 + (E.losses(G, me) < 0.3 ? 1 : 0); else if (!win) stars = 1; }
  $('endTitle').textContent = title; $('endWhy').textContent = why;
  $('endStars').textContent = me ? '★'.repeat(stars) + '☆'.repeat(3 - stars) : '';
  $('endStats').innerHTML = `<div><dt>Ausfälle ${SIDES.A.short}</dt><dd>${Math.round(E.losses(G, 'A') * 100)} %</dd></div><div><dt>Ausfälle Aschenwacht</dt><dd>${Math.round(E.losses(G, 'D') * 100)} %</dd></div>` +
    OBJECTIVES.map(o => `<div class="${G.ctrl[o.id] || 'N'}"><dt>${o.name}</dt><dd>${G.ctrl[o.id] ? SIDES[G.ctrl[o.id]].short : 'neutral'}</dd></div>`).join('');
  $('end').hidden = false;
  setAmbient(false);
  if (win && (!me || win === me)) playSound('win', 0.6); else if (me && win && win !== me) setMusik('musikNiederlage');   // Niederlage: „Taps“
}

// Klick-Ton für Knöpfe (Oberfläche); Titelmusik startet, sobald der Browser Ton erlaubt (erste Berührung)
document.addEventListener('pointerdown', ev => {
  const b = ev.target.closest && ev.target.closest('button, .up-btn, .tb-btn, [role="button"], label.mapcard'); if (b && b.id !== 'btnNext' && b.dataset.act !== 'pass') playSound('ui', 0.3, null);   // diese beiden haben den eigenen Klick
  if (!$('start').hidden && musikName !== 'musik_titel') setMusik('musik_titel'); musikWecken();   // Browser erlaubt Ton erst nach der ersten Berührung
}, true);
// ---------- Knöpfe ----------
$('btnEnd').onclick = endTurn;
$('btnMarks').onclick = () => { marksOn = !marksOn; tbSync(); };
// „Nächste Einheit“ (Tab, Umschalt+Tab rückwärts): nächste eigene Einheit, die noch handeln kann, wählen und die Karte hinschieben.
// Sind alle fertig, leuchtet „Runde beenden“ kurz auf.
function nextUnit(back) {
  if (!G || busy || G.over || !human(G.side) || placing) return;
  playSound('klick', 0.5, null);   // deutlicher Klick, auch per Taste (Spieltest Runde 2)
  refreshSpent();
  const list = G.units.filter(u => u.side === G.side && E.active(u) && !spent.has(u.id)).sort((a, b) => a.c - b.c || a.r - b.r);
  if (!list.length) { const be = $('btnEnd'); be.classList.remove('flash'); void be.offsetWidth; be.classList.add('flash'); setTimeout(() => be.classList.remove('flash'), 1900); return; }
  const i = sel ? list.findIndex(u => u.id === sel.id) : -1;
  const u = list[((i < 0 ? (back ? 0 : -1) : i) + (back ? -1 : 1) + list.length) % list.length];
  select(u);
  const [x, y] = center(u.c, u.r), rc = cv.getBoundingClientRect(), bc = board.getBoundingClientRect();
  if (VIEW.tilt()) { camTo(x, y, 400, true); return; }
  board.scrollBy({ left: rc.left + x * rc.width / cv.width - (bc.left + bc.width / 2), top: rc.top + y * rc.height / cv.height - (bc.top + bc.height / 2), behavior: 'smooth' });
}
$('btnNext').onclick = e => { if ($('btnNext').dataset.long) { delete $('btnNext').dataset.long; return; } nextUnit(false); };
// Tooltip am Knopf: Maus beim Drüberfahren, Touch durch langes Drücken (dann kein Klick)
{ const b = $('btnNext'), tip = [{ name: 'Nächste Einheit', text: 'Wählt die nächste eigene Einheit, die noch eine Aktion oder Bewegungspunkte hat, und schiebt die Karte hin. Taste Tab (Umschalt+Tab rückwärts).' }];
  let tm = 0; const at = () => { const r = b.getBoundingClientRect(); return [r.left + r.width / 2, r.top]; };
  b.addEventListener('pointerover', e => { if (e.pointerType === 'mouse') showTip(tip, ...at(), 'next'); });
  b.addEventListener('pointerout', e => { if (e.pointerType === 'mouse') hideTip(); });
  b.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse') return; tm = setTimeout(() => { b.dataset.long = '1'; showTip(tip, ...at(), 'next', 3500); }, 420); });
  b.addEventListener('pointerup', () => clearTimeout(tm)); b.addEventListener('pointercancel', () => clearTimeout(tm));
  b.addEventListener('contextmenu', e => e.preventDefault()); }
$('startBtn').onclick = startGame;
$('btnArmy').onclick = () => openArmy(curMode() === 'D' ? 'D' : 'A');
$('armyStd').onclick = () => { armyDraft = Object.assign({}, E.defaultArmy(armySide)); armyRefresh(); };
$('armyClear').onclick = () => { armyDraft = {}; armyFixGeneral(armySide); armyRefresh(); };
$('armyOk').onclick = () => { if (armyKeep()) { $('army').hidden = true; armyInfo(); } };
$('armyCancel').onclick = () => { $('army').hidden = true; armyInfo(); };
$('armySwap').onclick = () => { if (E.armyOk(armySide, armyDraft, mechsOn())) armyKeep(); openArmy(armySide === 'A' ? 'D' : 'A'); };
document.querySelectorAll('input[name=opp], input[name=side], input[name=att]').forEach(i => i.addEventListener('change', () => { applySkin(curSkin()); if (G) updateUI(); setupSync(); }));
document.querySelectorAll('#start [data-go]').forEach(b => b.addEventListener('click', () => startStep(b.dataset.go)));
document.querySelectorAll('input[name=mechs]').forEach(i => i.addEventListener('change', mechChanged));
$('armyMech').onclick = () => { $('optMechs').checked = true; mechChanged(); const keep = armyDraft; openArmy(armySide); armyDraft = keep; armyRefresh(); };
// Einstellungen schon im Startmenü
$('setFull').onclick = () => $('btnFull').onclick();
document.documentElement.style.setProperty('--sm-bg', window.TITLEBG ? `url("${window.TITLEBG}")` : 'none');   // Titelbild (tools/title_bg.py)
$('setSpeed').onclick = () => { $('btnSpeed').onclick(); $('setSpeed').textContent = speedTxt(); };
$('setZoom').onclick = () => { $('btnZoom').onclick(); $('setZoom').textContent = zoomTxt(); };
document.addEventListener('fullscreenchange', () => { $('setFull').classList.toggle('on', !!document.fullscreenElement); });
$('btnMenu').onclick = () => showStart(false);
$('closeStart').onclick = () => { $('start').hidden = true; };
$('btnRules').onclick = $('btnRules2').onclick = () => { $('rules').hidden = false; };
$('closeRules').onclick = () => { $('rules').hidden = true; };
$('againBtn').onclick = () => { $('end').hidden = true; showStart(true); };
$('reviewBtn').onclick = () => { $('end').hidden = true; };
$('handBtn').onclick = () => { $('handover').hidden = true; updateUI(); };
$('btnInfo').onclick = showDetail;
$('btnZoom').onclick = () => {   // Stufen: ganze Karte → 1× → 1,3× → 1,6× (doppelte Stufen fallen weg, wenn die Karte schon bei 1× ganz passt)
  const st = [...new Set([ZFIT, 1, 1.3, 1.6].map(z => Math.round(Math.max(ZFIT, z) * 100) / 100))];
  const cur = zoomFit ? 0 : st.findIndex(z => Math.abs(z - ZOOM) < 0.02), nz = st[(cur + 1) % st.length];
  const bc = board.getBoundingClientRect(); setZoom(nz, bc.left + bc.width / 2, bc.top + bc.height / 2, nz <= ZFIT + 0.001, true);
};
// Hilfen (Optionen): sofort wirksam, im Browser gemerkt
const OPT_IDS = [['optReady', 'ready'], ['optStrag', 'strag'], ['optCam', 'cam'], ['optShake', 'shake']];   // „Neue Ansicht (Test)“ entfernt: immer neue Ansicht
for (const [id, k] of OPT_IDS) $(id).checked = OPT[k];
for (const [id, k] of OPT_IDS) $(id).addEventListener('change', () => { OPT[k] = $(id).checked; try { localStorage.setItem('arm.hilfen', JSON.stringify(OPT)); } catch (e) {}
  if (k === 'tilt' && G) { zoomFit = false; ZOOM = 1; CAM.init = false; layout(); syncAll(); updScroll(); tbSync(); } });   // Ansicht wechseln: neu aufbauen
if ($('optBase')) { $('optBase').value = String(OPT.base); $('optBase').addEventListener('change', () => { OPT.base = +$('optBase').value; try { localStorage.setItem('arm.hilfen', JSON.stringify(OPT)); } catch (e) {} }); }
// Lautstärke-Regler (Optionen): Musik und Effekte getrennt, gespeichert
{ const set = () => { $('volMusik').value = Math.round(musikVol * 100); $('volEffekte').value = Math.round(effektVol * 100); $('volMusikW').textContent = $('volMusik').value; $('volEffekteW').textContent = $('volEffekte').value; }; set();
  $('volMusik').addEventListener('input', () => { musikVol = +$('volMusik').value / 100; try { localStorage.setItem('arm.musikvol', musikVol); } catch (e) {} set(); });
  $('volEffekte').addEventListener('input', () => { effektVol = +$('volEffekte').value / 100; try { localStorage.setItem('arm.effektvol', effektVol); } catch (e) {} kulisseVol(); set(); });
  $('volEffekte').addEventListener('change', () => playSound('whistle', 0.4)); }
// Ton an/aus: obere Leiste, Startmenü und Optionen schalten dasselbe und merken es sich
function setSound(on) {
  soundOn = !!on; $('optSound').checked = soundOn; try { localStorage.setItem('arm.ton', soundOn ? '1' : '0'); } catch (e) {}
  tbSync();
  if (!$('start').hidden) setMusik(soundOn ? 'musik_titel' : null); else setAmbient(soundOn && !!G && !G.over);
  if (!soundOn) { setMusik(null); if (feuerTon) try { feuerTon.pause(); } catch (e) {} }
}
$('btnSound').onclick = () => { setSound(!soundOn); if (soundOn) playSound('whistle', 0.4); };
$('smSound').onclick = e => { e.stopPropagation(); setSound(!soundOn); };
$('optSound').checked = soundOn; $('optSound').addEventListener('change', () => setSound($('optSound').checked));
$('btnShop').onclick = openShop;
$('closeShop').onclick = () => { $('shop').hidden = true; hideShopDet(); };
$('closeDetail').onclick = () => { $('detail').hidden = true; };
// Klick (oder Antippen) in den dunklen Bereich neben dem Fenster schließt es wie der Schließen-Knopf (Spieltest 2026-11-17)
for (const [ov, btn] of [['army', 'armyCancel'], ['shop', 'closeShop'], ['detail', 'closeDetail'], ['rules', 'closeRules']])
  $(ov).addEventListener('click', e => { if (e.target === $(ov) && !(ov === 'shop' && performance.now() - shopZieh < 400)) $(btn).click(); });   // nach dem Ziehen des Nachschub-Fensters nicht schließen
$('btnSpeed').onclick = () => { tempo = tempo === 0.5 ? 1 : tempo === 1 ? 2 : tempo === 2 ? INSTANT : 0.5; speed = gegnerZug ? tempo * (tempo >= INSTANT ? 1 : GEGNER_TEMPO) : tempo; try { localStorage.setItem('arm.tempo', String(tempo)); } catch (e) {} tbSync(); };   // ½×, 1×, 2×, Sofort (Paket 2: langsamere Stufe, gespeichert)
tbSync();
$('btnFull').onclick = () => { const d = document, el = d.documentElement; if (!d.fullscreenElement) (el.requestFullscreen || el.webkitRequestFullscreen || (() => {})).call(el); else d.exitFullscreen(); };
let rT = 0;
document.addEventListener('keyup', e => { if (e.key === 'Alt') { altHeld = false; e.preventDefault(); } });   // preventDefault: Alt öffnet sonst das Browsermenü
window.addEventListener('blur', () => { altHeld = false; });
window.addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(() => { if (G) { layout(); updateHud(); } }, 120); });
const gameKeys = e => G && $('start').hidden && $('shop').hidden && $('detail').hidden && $('rules').hidden && $('army').hidden && !(e.target.closest && e.target.closest('input'));
document.addEventListener('keydown', e => {
  if (e.key === 'Alt') { if (gameKeys(e)) e.preventDefault(); altHeld = true; return; }
  if (e.key === 'Tab' && gameKeys(e) && !e.ctrlKey && !e.altKey) { e.preventDefault(); nextUnit(e.shiftKey); return; }
  const pan = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
  if (pan && $('start').hidden && !e.target.closest('input')) { userCam(); if (VIEW.tilt()) camPan(pan[0] * 0.18, pan[1] * 0.18); else board.scrollBy({ left: pan[0] * 160, top: pan[1] * 120, behavior: 'smooth' }); e.preventDefault(); }
  // Tasten 1–n: Fähigkeiten-Knöpfe des Panels
  if (/^[1-9]$/.test(e.key) && G && $('start').hidden && $('shop').hidden && $('detail').hidden && $('rules').hidden && $('army').hidden && !(e.target.closest && e.target.closest('input')) && !e.ctrlKey && !e.altKey && !e.metaKey) {
    const b = $('hudRow').querySelectorAll('.up-ab')[+e.key - 1]; if (b && !b.classList.contains('off')) { b.click(); e.preventDefault(); } }
  if (e.key === 'Escape' && wayPt) { wayPt = null; computeOptions(); updateHud(); return; }
  if (e.key === 'Escape') { cancelPlace(); $('shop').hidden = true; select(null); $('detail').hidden = true; $('rules').hidden = true; } });

// ---------- Kamera, Zoom, Wucht, Kriegstagebuch (Etappe 3) ----------
// Kamera = Scrollposition des Schlachtfelds. Passt die Karte ganz ins Bild, gibt es nichts zu fahren.
let camAnim = null, camHold = false, activeU = null, shakeT = 0, shakeA = 0, diaryMark = null;
const lastSel = { A: null, D: null };   // zuletzt gewählte eigene Einheit je Seite (Kamera zu Rundenbeginn)
const camOn = () => OPT.cam && speed < INSTANT && !camHold;
function userCam() { camAnim = null; if (G && busy && !human(G.side)) camHold = true; }   // Spieler verschiebt selbst: Kamera hält still bis zur nächsten KI-Einheit
function toBoard(x, y) { const rc = cv.getBoundingClientRect(), bc = board.getBoundingClientRect(); return [rc.left - bc.left + board.scrollLeft + x * rc.width / cv.width, rc.top - bc.top + board.scrollTop + y * rc.height / cv.height]; }
function inView(x, y, m = 0.18) {
  if (VIEW.tilt()) { camSetup(); const p = proj(x, y), W = cv.width, H = cv.height; return p[2] > 0 && p[0] >= W * m && p[0] <= W * (1 - m) && p[1] >= H * m && p[1] <= H * (1 - m); }
  const [bx, by] = toBoard(x, y), w = board.clientWidth, h = board.clientHeight, sl = board.scrollLeft, st = board.scrollTop;
  const mx = board.scrollWidth - w > 2 ? m : 0, my = board.scrollHeight - h > 2 ? m : 0;   // ohne Verschieben zählt das ganze Bild
  return bx >= sl + w * mx && bx <= sl + w * (1 - mx) && by >= st + h * my && by <= st + h * (1 - my);
}
function camTo(x, y, ms = 380, force) {   // weich zum Punkt (Canvas-Pixel) fahren; Promise endet bei Ankunft oder Abbruch
  if (VIEW.tilt()) return camToTilt(x, y, ms, force);
  if (!L || (!force && !camOn())) return Promise.resolve();
  const [bx, by] = toBoard(x, y), w = board.clientWidth, h = board.clientHeight;
  const tl = Math.max(0, Math.min(board.scrollWidth - w, bx - w / 2)), tt = Math.max(0, Math.min(board.scrollHeight - h, by - h / 2));
  const l0 = board.scrollLeft, t0 = board.scrollTop;
  if (Math.abs(tl - l0) < 2 && Math.abs(tt - t0) < 2) return Promise.resolve();
  const dur = speed >= INSTANT ? 0 : ms / Math.min(speed, 2), me = {}; camAnim = me;
  if (!dur) { board.scrollLeft = tl; board.scrollTop = tt; return Promise.resolve(); }
  return new Promise(res => { const st = performance.now();
    const step = () => { if (camAnim !== me) return res(); const k = Math.min(1, (performance.now() - st) / dur), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      board.scrollLeft = l0 + (tl - l0) * e; board.scrollTop = t0 + (tt - t0) * e; if (k < 1) requestAnimationFrame(step); else { camAnim = null; res(); } };
    requestAnimationFrame(step); });
}
// Rundenbeginn: zur zuletzt gewählten eigenen Einheit, sonst zur eigenen Front (die drei Einheiten, die dem Gegner am nächsten stehen)
function camHome(first) {
  if (!G || !L || G.over || (!OPT.cam && !first)) return;
  const side = human(G.side) ? G.side : null; if (!side) return;
  let u = lastSel[side] != null ? unitById(lastSel[side]) : null, x, y;
  if (u && E.active(u)) [x, y] = center(u.c, u.r);
  else {
    const own = G.units.filter(o => o.side === side && E.active(o)), foes = G.units.filter(o => o.side !== side && E.alive(o)); if (!own.length) return;
    const near = o => foes.length ? Math.min(...foes.map(f => E.dist(o.c, o.r, f.c, f.r))) : 0;
    const front = own.map(o => [near(o), o]).sort((a, b) => a[0] - b[0]).slice(0, 3).map(q => center(q[1].c, q[1].r));
    x = front.reduce((n, q) => n + q[0], 0) / front.length; y = front.reduce((n, q) => n + q[1], 0) / front.length;
  }
  camTo(x, y - L.s * 0.4, 450, true);
}
// Bildwackeln bei Einschlägen (abschaltbar), über CSS-Verschiebung des Schlachtfelds
function shake(a) { if (!OPT.shake || speed >= INSTANT) return; shakeA = Math.max(shakeA * shakeT, a); shakeT = 1; }
function shakeStep() {
  if (shakeT <= 0) return;
  shakeT -= 0.075 * STEP; const a = shakeA * Math.max(0, shakeT);
  cv.style.transform = shakeT > 0 ? `translate(${((Math.random() * 2 - 1) * a).toFixed(1)}px, ${((Math.random() * 2 - 1) * a * 0.7).toFixed(1)}px)` : '';
}

// Zoom: stufenlos zwischen „ganze Karte“ und 2×, auf den Punkt unter Zeiger/Fingern. Während des Drehens wird nur das Bild gestreckt (flüssig),
// kurz danach scharf neu gezeichnet.
let zPend = 0, zTm = 0, pinch = null;
const zoomTxt = () => zoomFit || ZOOM <= ZFIT + 0.01 ? 'Zoom: ganze Karte' : 'Zoom ' + String(Math.round(ZOOM * 10) / 10).replace('.', ',') + '×';
function setZoom(z, cx, cy, fit, at) {
  if (VIEW.tilt()) return zoomTilt(z, cx, cy, fit);
  if (!G || !L) return;
  const cur = zPend || ZOOM, nz = Math.max(ZFIT, Math.min(Z_MAX, z));
  zoomFit = !!fit || nz <= ZFIT + 0.001;
  if (Math.abs(nz - cur) < 0.002 && !at) return;
  const rc = cv.getBoundingClientRect(), fx = (cx - rc.left) / rc.width, fy = (cy - rc.top) / rc.height;
  const w = rc.width / cur * nz, h = rc.height / cur * nz;
  zPend = nz; cv.style.width = w + 'px'; cv.style.height = h + 'px';
  cv.style.marginLeft = Math.max(0, Math.floor((board.clientWidth - w) / 2)) + 'px'; cv.style.marginTop = Math.max(0, Math.floor((board.clientHeight - h) / 2)) + 'px';
  const r2 = cv.getBoundingClientRect(); board.scrollLeft += r2.left + fx * r2.width - cx; board.scrollTop += r2.top + fy * r2.height - cy;
  clearTimeout(zTm); zTm = setTimeout(() => {   // scharf neu zeichnen, Mitte des Bildes bleibt, wo sie war
    const bc = board.getBoundingClientRect(), r0 = cv.getBoundingClientRect(), mx = bc.left + bc.width / 2, my = bc.top + bc.height / 2;
    const gx = (mx - r0.left) / r0.width, gy = (my - r0.top) / r0.height;
    ZOOM = zPend; zPend = 0; layout(); syncAll();
    const r1 = cv.getBoundingClientRect(); board.scrollLeft += r1.left + gx * r1.width - mx; board.scrollTop += r1.top + gy * r1.height - my;
    tbSync(); updScroll(); if ($('setZoom')) $('setZoom').textContent = zoomTxt();
  }, at ? 0 : 170);
}
// Zwei Finger: Pinch-Zoom (ein Finger verschiebt, siehe pointerdown/pointermove oben)
{ const ptrs = new Map();
  const two = () => { const [a, b] = [...ptrs.values()]; return { d: Math.hypot(a[0] - b[0], a[1] - b[1]), x: (a[0] + b[0]) / 2, y: (a[1] + b[1]) / 2 }; };
  cv.addEventListener('pointerdown', ev => { if (ev.pointerType !== 'touch') return; ptrs.set(ev.pointerId, [ev.clientX, ev.clientY]);
    if (ptrs.size === 2) { const t = two(); pinch = { d: Math.max(20, t.d), z: zPend || ZOOM }; drag = null; userCam(); } });
  cv.addEventListener('pointermove', ev => { if (!ptrs.has(ev.pointerId)) return; ptrs.set(ev.pointerId, [ev.clientX, ev.clientY]);
    if (pinch && ptrs.size >= 2) { const t = two(); setZoom(pinch.z * t.d / pinch.d, t.x, t.y); } });
  const up = ev => { ptrs.delete(ev.pointerId); if (pinch && ptrs.size < 2) { pinch = null; dragged = performance.now(); } };
  addEventListener('pointerup', up); addEventListener('pointercancel', up);
}

// Ereignistexte (wichtige Ereignisse beider Seiten, groß über der Karte) und Kriegstagebuch (alle Treffer, Angriffe, Wichtiges)
const LOG = [];
const evQ = []; let evBusy = false;
function headline(text, side) {
  if (speed >= INSTANT) { evQ.length = 0; }   // sofort: nur das Letzte zählt
  evQ.push({ text, side }); if (evQ.length > 3) evQ.shift();
  if (!evBusy) nextHeadline();
}
function nextHeadline() {
  const it = evQ.shift(), el = $('evline'); if (!it) { evBusy = false; return; }
  evBusy = true; el.innerHTML = `<b>${upEsc(it.text)}</b>`; el.style.setProperty('--fc', it.side ? sideCol(it.side) : 'var(--s-brass)');
  el.classList.remove('on'); void el.offsetWidth; el.classList.add('on');
  const dur = speed >= INSTANT ? 1600 : 1700 / Math.sqrt(speed);
  clearTimeout(el._t); el._t = setTimeout(() => { el.classList.remove('on'); setTimeout(nextHeadline, 160); }, evQ.length ? Math.min(dur, 900) : dur);
}
function logAdd(text, side, c, r, imp) {
  LOG.push({ turn: G.turn, by: G.side, text, side, c, r, imp }); if (LOG.length > 400) LOG.shift();
  if (!$('diary').hidden && !logAdd.raf) logAdd.raf = requestAnimationFrame(() => { logAdd.raf = 0; renderDiary(); });
}
function noteEvent(e, u) {
  if (!G) return;
  const N = x => x ? TYPES[x.type].name : '', at = x => x ? [x.c, x.r] : [null, null];
  switch (e.t) {
    case 'hit': if (e.panic) return; { const big = e.dmg >= 2;
      logAdd(`${N(u)}: −${fmt(e.dmg)} Stärke, noch ${fmt(e.str)}`, u.side, ...at(u), big);
      if (big) headline(`Schwerer Treffer: ${N(u)} −${fmt(e.dmg)}`, u.side); } return;
    case 'supp': logAdd(`${N(u)} niedergehalten`, u.side, ...at(u), true); return headline(`${N(u)} niedergehalten!`, u.side);
    case 'rout': logAdd(`${N(u)} flieht`, u.side, ...at(u), true); return headline(`${N(u)} flieht!`, u.side);
    case 'destroyed': logAdd(`${N(u)} aufgerieben`, u.side, ...at(u), true); return headline(`${N(u)} aufgerieben!`, u.side);
    case 'officer': logAdd(`${e.name} ist gefallen`, u && u.side, ...at(u), true); return headline(`${e.name} fällt!`, u && u.side);
    case 'stuck': logAdd(`${N(u)} steckt im Schlamm fest`, u.side, ...at(u), true); return headline(`${N(u)} steckt fest!`, u.side);
    case 'breakdown': logAdd(`${N(u)}: Panne, festgefahren`, u.side, ...at(u), true); return headline(`${N(u)} hat sich festgefahren!`, u.side);
    case 'mine': logAdd('Mine detoniert', null, e.c, e.r, true); return headline('Mine!', null);
    case 'wirehurt': return logAdd(`${N(u)}: im Stacheldraht verletzt`, u && u.side, e.c, e.r);
    case 'gas': if (e.late) return logAdd(`${N(u)}: Vergiftung`, u && u.side, ...at(u)); return;
    case 'burn': return logAdd(`${N(u)}: im Feuer`, u && u.side, e.c, e.r);
    case 'freeblow': { const fa = G.units.find(x => x.id === e.a); return logAdd(`${N(u)} weicht zurück: Freischlag von ${N(fa)}`, u && u.side, ...at(u)); }
    case 'lanceblast': return logAdd(`${N(unitById(e.a))}: Sprenglanze`, unitById(e.a) && unitById(e.a).side, e.c, e.r);
    case 'tunnelBlow': return logAdd('Stollen gesprengt', null, e.c, e.r, true);
    case 'fire': { const a = unitById(e.a), d = unitById(e.d); if (!a || !d) return;
      if (e.reaction) { logAdd(`Sperrfeuer: ${N(a)} auf ${N(d)}`, a.side, ...at(d), true); headline(`Sperrfeuer auf ${N(d)}!`, a.side); }
      else logAdd(`Beschuss: ${N(a)} auf ${N(d)}`, a.side, ...at(d)); return; }
    case 'melee': { const a = unitById(e.a), d = unitById(e.d); if (a && d) logAdd(`Nahkampf: ${N(a)} gegen ${N(d)}`, a.side, ...at(d)); return; }
    case 'shell': { const a = unitById(e.a); if (a) logAdd(`${N(a)}: ${e.mode === 'gas' ? 'Gasgranaten' : e.mode === 'barrage' ? 'Sperrfeuer' : 'Granaten'}${e.scatter ? ' (gestreut)' : ''}`, a.side, e.c, e.r); return; }
    case 'order': return logAdd(`${e.name}: ${e.kind === 'rally' ? 'Sammeln' : e.kind === 'fire' ? 'Feuer frei' : 'Sturmbefehl'}`, u && u.side, ...at(u));
    case 'bigorder': logAdd(`General: ${e.name}!`, e.side, ...at(u), true); return headline(`${e.name}!`, e.side);
    case 'dig': return logAdd(`${N(u)}: eingegraben`, u && u.side, ...at(u));
    case 'shields': return logAdd(`${N(u)}: Schilde vor`, u && u.side, ...at(u));
    case 'rush': return logAdd(`${N(u)}: Sturmlauf`, u && u.side, e.c, e.r, true);
    case 'banner': return logAdd(`${N(u)}: Banner ${e.planted ? 'aufgepflanzt' : 'aufgenommen'}`, u && u.side, ...at(u));
    case 'score': { const n = OBJECTIVES.filter(o => G.ctrl[o.id] === e.side).reduce((m, o) => m + o.pts, 0); if (n) logAdd(`${SIDES[e.side].short}: +${n} Siegpunkte`, e.side, null, null); return; }
    case 'spawn': return logAdd(`Nachschub: ${N(u)}`, u.side, ...at(u));
    case 'reinf': { const f = unitById(e.ids[0]); return logAdd('Gegenstoß: Verstärkung trifft ein', f && f.side, ...at(f), true); }
  }
}
// Kriegstagebuch: Liste der letzten Runden, neueste oben, Klick fährt die Kamera hin
function renderDiary() {
  const el = $('diaryList'); if (!el || !G) return;
  const turns = [...new Set(LOG.map(l => l.turn + ':' + l.by))].reverse().slice(0, 6);
  el.innerHTML = turns.length ? turns.map(k => { const [t, by] = k.split(':'), items = LOG.map((l, i) => [l, i]).filter(([l]) => l.turn + ':' + l.by === k).reverse();
    return `<li class="dg-turn"><h4>Runde ${t} · ${upEsc(SIDES[by].short)}</h4><ol>${items.map(([l, i]) => `<li><button class="dg-it${l.imp ? ' imp' : ''}${l.c == null ? ' nopos' : ''}" data-i="${i}" style="--fc:${l.side ? sideCol(l.side) : 'var(--s-rust)'}">${upEsc(l.text)}</button></li>`).join('')}</ol></li>`; }).join('')
    : '<li class="dg-empty">Noch keine Ereignisse.</li>';
}
$('btnDiary').onclick = () => { const d = $('diary'); d.hidden = !d.hidden; if (!d.hidden) renderDiary(); tbSync(); };
$('closeDiary').onclick = () => { $('diary').hidden = true; tbSync(); };
$('diaryList').addEventListener('click', ev => { const b = ev.target.closest('.dg-it'); if (!b) return; const l = LOG[+b.dataset.i]; if (!l || l.c == null) return;
  const [x, y] = center(l.c, l.r); diaryMark = { c: l.c, r: l.r, t: now }; camTo(x, y - L.s * 0.3, 450, true); });

// ---------- Start ----------
G = E.newGame({ seed: 7 });
initDU(); layout(); syncAll(); updateUI();
requestAnimationFrame(frame);
showStart(true);
window.__dbg = { PT, portraitKey, openShop: () => openShop(), sndPick, SND, get gbw() { gbBereit(); return GBW; }, get musik() { return musik; }, get musikSp() { return musikSp.map(t => [t.name, +t.lvl.toFixed(2), t.aus, +(t.a.volume || 0).toFixed(3)]); }, get musikName() { return musikName; }, setMusikVol: v => { musikVol = v; }, musikTest: { setMusik: (n, f) => setMusik(n, f), setAmbient: on => setAmbient(on) },  get amb() { return [ambient, wetter]; }, tcv: () => tcv, renderTerrain: () => renderTerrain(), paintReady: () => paintReady(),
  hexCss: (c, r) => { let [x, y] = center(c, r); if (VIEW.tilt()) { camSetup(); [x, y] = proj(x, y); } const rc = cv.getBoundingClientRect(); return [rc.left + x * rc.width / cv.width, rc.top + y * rc.height / cv.height]; }, get cam() { return { ...CAM, ZFIT }; }, setCam: (x, y, z) => { if (z) CAM.z = z; CAM.x = x; CAM.y = y; camClamp(); }, FIGMAP,
  get reach() { return [...reach.values()]; }, get targets() { return [...targets.values()]; }, get shellHexes() { return [...shellHexes]; },
  setSpeed: v => speed = tempo = v, get speed() { return speed; }, cursorFor, CURSOR, get abilSet() { return abilSet; }, get shellHexes() { return shellHexes; }, panelAct: a => panelAct(a), get sndCount() { return window.__snd || 0; }, get sndBy() { return window.__sndBy || {}; }, aufstellFertig: () => aufstellFertig(), get aufstellWahl() { return aufstellWahl; }, rundenSchild: () => rundenSchild(), get G() { return G; }, get busy() { return busy || qRunning; }, E, AI,
  sync: () => syncAll(), get vis() { return { clouds: VIS.clouds.length, supp: [...DU.values()].filter(d => d.vs && d.vs.supp).length, shells: shells.length }; }, play: async evs => { for (const e of evs) await playEvent(e); }, get pji() { return Object.keys(PJI); }, get mz() { return muzzles.map(m => m.img + ':' + Math.round(m.life)); }, get fxl() { return fxs.map(e => e.b + ':' + Math.round(e.life)); }, get gm() { return gmarks.map(m => m.b); }, fxImpact: (c, r) => { const [x, y] = center(c, r); return fxImpact(x, y, L.s * 0.95); }, get wayPt() { return wayPt; }, get mzp() { return muzzles.map(m => [m.img, Math.round(m.x), Math.round(m.y), +m.ang.toFixed(2)]); }, du: id => { const d = DU.get(id); return d && { x: d.x, y: d.y, face: d.face, muz: d.muz }; }, get fx() { return { sh: shells.length, tr: tracers.length, bo: booms.length, fl: floaters.length }; }, get scoutN() { return scoutSet.size; }, get sightN() { return sightSet.size; }, get spentN() { return spent.size; }, get hideN() { return hideSet.size; }, get readyN() { return readyN; },
  select: id => select(G.units.find(u => u.id === id)), get sel() { return sel; },
  get marks() { const rc = cv.getBoundingClientRect(); return MARKS.map(m => ({ id: m.u.id, kind: m.kind, x: rc.left + (m.x0 + m.x1) / 2 * rc.width / cv.width, y: rc.top + (m.y0 + m.y1) / 2 * rc.height / cv.height })); },
  ctrl: (i, sd) => { const o = OBJECTIVES[i]; G.ctrl[o.id] = VIS.ctrl[o.id] = sd; updateUI(); }   // Test: Zielfeld i an Seite sd
};
})();
