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
{ const A = window.UIPANEL || {}; for (const k in A) if (/^(s_|k_|cov|orden|muenze|p[ADF]$)/.test(k)) { const im = new Image(); im.onload = () => UPI[k] = im; im.src = A[k]; } }
const $ = id => document.getElementById(id);
const fmt = x => String(Math.max(0, Math.round(x * 10)));   // Anzeige in ganzen Zahlen: Stärke 10,0 → 100, Schaden 0,7 → 7 (Wunsch des Nutzers)
const WIND_DEG = [-30, 30, 90, 150, 210, 270];

// ---------- Zustand ----------
let G = null, mode = 'A', blood = true, tempo = 0.5, busy = false;   // tempo = gewählte Stufe; Standard für neue Spieler ½× (Spieltest Runde 2); gespeichertes Tempo gilt weiter
try { const v = +localStorage.getItem('arm.tempo2');   // Punkt 7 (2026-11-21): neuer Schlüssel – einmalig Standard ½×, danach eigene Wahl
 if ([0.5, 1, 2, 99].includes(v)) tempo = v; } catch (e) {}   // Tempo bleibt gespeichert (Paket 2)
try { for (const k of ['arm.tempo', 'arm.bildwirkung', 'arm.bildwirkung2']) localStorage.removeItem(k); } catch (e) {}   // Prüfliste 5.6: verwaiste alte Schlüssel (ersetzt durch arm.tempo2, arm.bildwirkung3) einmal wegräumen
const GEGNER_TEMPO = 1.2;   // Gegnerzug (KI) etwas schneller als die gewählte Stufe: ½× → 0,6× (Spieltest Runde 2, Punkt 11)
let speed = tempo;   // wirksames Tempo: im Gegnerzug tempo × GEGNER_TEMPO
const INSTANT = 99;   // Tempo „Sofort“: Abläufe praktisch ohne Wartezeit, ohne Kamerafahrt und Ton
const speedTxt = () => tempo >= INSTANT ? 'Tempo sofort' : 'Tempo ' + tempo + '×';
let wayPt = null;   // Wegpunkt (Paket 3): Umschalt+Klick bzw. langes Drücken auf ein Zugfeld, danach das Ziel
let sel = null, reach = new Map(), targets = new Map(), shellHexes = new Set(), artMode = 'he';
let recSet = new Set(), abilSet = new Set(), abilMode = false, feldArt = 'abil', faustErst = null;   // faustErst: erstes Ziel der Faustsalve (2026-11-20)   // feldArt: 'abil' | 'cut' | 'zweit' (Paket 8)
// Hilfsfähigkeiten nur über den Knopf (Enrico 2026-11-22 17:40: Sanitäter heilte beim Anklicken eigener Nachbarn): hilfeModus = { art: 'heal'|'send'|'rec', id }
// Paket A (Enrico 2026-11-23, Spieltest Punkt 9/22): immer nur EIN Bedienmodus – Angriffsart (p-), Geschützart (m-), Feld-Fähigkeit (abil/cut/zweit/ramm/faust), Hilfe (i-).
// Neuer Knopf löst den alten ab, gleicher Knopf/Esc/Rechtsklick bricht ab, Wechsel der Einheit löscht ihn (vorher blieb er beim Weiterschalten aktiv: Munition „beim Anklicken“).
function aktModus() { return abilMode ? feldArt : hilfeModus ? 'i-' + hilfeModus.art : artMode !== 'he' ? 'm-' + artMode : atkPref !== 'auto' ? 'p-' + atkPref : null; }
function modiAus() { abilMode = false; feldArt = 'abil'; faustErst = null; hilfeModus = null; artMode = 'he'; atkPref = 'auto'; }
const MODUS_KNOPF = /^(p-melee|p-fire|m-|i-|abil$|cut$|zweit$|ramm$|faust$)/;
let hilfeModus = null; const hilfeAn = art => !!(hilfeModus && sel && hilfeModus.id === sel.id && hilfeModus.art === art);
let previewT = null, hoverHex = null, inspect = null, lastPT = 'mouse', placing = null, spawnSet = new Set(), rangeSet = new Set(), hoverU = null, atkPref = 'auto', healSet = new Set(), sendSet = new Set(), sightSet = new Set(), scoutSet = new Set();
// Übersicht auf dem Feld (Etappe 2): verdeckte Felder, Kontur der Reichweite, Vorschau vom Feld unter Maus/Finger, bereite Einheiten
let hideSet = new Set(), rangeEdges = [], touchMove = null, pvCache = null, readyN = 0;
const OPT = { ready: true, strag: true, cam: true, shake: true, base: 0, camZurueck: true };   // base: „Base“ unter Einheiten (0 aus … 3 deutlich)   // Hilfen und Spielgefühl (Optionen), im Browser gemerkt
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
  neuBedienfeld(true); setTimeout(neuKnopfreihe, 0);
  { const tb = $('topbar'); if (tb) document.body.style.setProperty('--tb-unten', Math.round(tb.getBoundingClientRect().bottom) + 'px'); }   // Nachschub-Knopf und Hinweis unter der oberen Leiste, wie hoch sie auch ist (Spieltest Runde 2, Punkt 12)
  layoutTilt();
}
// ---------- Ansicht ----------
// Alle Geometrie, die vom Blick auf die Karte abhängt, läuft über diesen Abschnitt: Feldmitte (center), Feld unter dem Zeiger (pixToHex),
// Feldecken (hexCorner/hexPath), Verkürzung des Bodens (kAt), Feldgröße an einer Stelle (sAt), Kreise auf dem Boden (gEllipse).
// Gerechnet wird in einem flachen Weltbild (K = 1); drawTilt projiziert es perspektivisch gekippt (Abschnitt „Gekippte Ansicht“).
// Die alte, flache Ansicht ist seit Paket G (2026-11-21) ausgebaut (Rückweg: Git-Tag vor-alte-karten-raus).
const VIEW = { bbK: null, up: null };   // up(x, y): neue Ansicht, Phase „aufrecht“ – Aufsteller für ein Element am Punkt (x, y) einstellen   // bbK: Bodenverkürzung am Fußpunkt, solange eine Einheit als Aufsteller gezeichnet wird
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

// ---------- Bilder für Effekte ----------
const FXI = {}, PJI = {};   // alte Effektbilder (fx.js) als Ersatz, wo ein neuer Effektbogen fehlt
{ const D = window.FXDATA || { fx: {} };
  const load = (store, map) => { for (const k in map) { const im = new Image(); im.onload = () => { store[k] = im; }; im.src = map[k]; } };
  load(FXI, D.fx || {}); load(PJI, D.proj || {}); }
const fxw = (im, h) => h * im.naturalWidth / im.naturalHeight;

// ---------- Neue Effektbögen (2026-11-17): tools/fx_cut.py → src/fxneu.js (FXNEU) ----------
// Zufällige Variante, im Code bewegt (wachsen, steigen, drehen, ausblenden). Leuchtende Bögen (Schwarzgrund) aufhellend ('lighter').
// Fehlt ein Bild, greifen die alten Effekte aus fx.js.
const FXN = {};
{ const D = window.FXNEU || {}; for (const k in D) { const m = k.match(/^(.+)_(\d+)$/); if (!m) continue; const im = new Image(); im.src = D[k]; (FXN[m[1]] = FXN[m[1]] || [])[+m[2] - 1] = im; } }
// Winter (Enrico 18:35): Schneetrichter und Brandfleck aus den Gelände-Bildern als Bodenspur-Bogen „kraterschnee“ (0, 1 Trichter, 2 Brandfleck)
{ const GL = window.GELAENDE || {}; if (GL.eisloch_schnee) { const im = new Image(); im.src = GL.eisloch_schnee; FXN.eisloch = [im]; } }   // Eisloch (Enrico 20:50)
{ const GL = window.GELAENDE || {}; const n = ['krater_schnee_1', 'krater_schnee_2', 'brand_schnee']; if (n.every(k => GL[k])) FXN.kraterschnee = n.map(k => { const im = new Image(); im.src = GL[k]; return im; }); }
// Spuren im Schnee (Enrico 19:40): 0 Räder mit Hufen, 1 Schreiter, 2 Ketten gerade, 3 Ketten gebogen, 4 Hufe, 5 zertrampelt (Nahkampf), 6 Stapfen der Fußtruppen (im Code gezeichnet)
{ const GL = window.GELAENDE || {}, n = [1, 2, 3, 4, 5, 6].map(k => 'spur_schnee_' + k);
  if (n.every(k => GL[k])) { FXN.spurschnee = n.map(k => { const im = new Image(); im.src = GL[k]; return im; });
    const c = document.createElement('canvas'); c.width = 320; c.height = 150; const x = c.getContext('2d');   // Stapfen: kleine ovale Abdrücke in zwei versetzten Reihen, Fahrtrichtung +x
    for (let i = 0; i < 9; i++) for (const row of [0, 1]) { const px = 18 + i * 34 + row * 17 + (Math.random() - 0.5) * 6, py = 52 + row * 46 + (Math.random() - 0.5) * 8;
      x.fillStyle = 'rgba(70,74,82,0.55)'; x.beginPath(); x.ellipse(px, py, 8, 4.5, (Math.random() - 0.5) * 0.4, 0, 7); x.fill(); x.fillStyle = 'rgba(245,248,252,0.5)'; x.beginPath(); x.ellipse(px - 1, py - 3, 7, 2, 0, 0, 7); x.fill(); }
    const im = new Image(); im.src = c.toDataURL(); FXN.spurschnee.push(im); } }
const KEIN_SCHNEE = new Set(['eis', 'eisloch', 'furt', 'bridge', 'steinbruecke', 'canal', 'bahn', 'waldweg']);
function aufSchnee(x, y) { const p = pixToHex(x, y), h = p && G && G.map[p[0]] && G.map[p[0]][p[1]]; return !h || !(h.road || h.rail || h.river || KEIN_SCHNEE.has(h.t)); }
function spurSchnee(i, x0, y0, x1, y1, o = {}) {   // Spur am Boden zwischen zwei Punkten, in Fahrtrichtung gedreht; höchstens 60 Spuren (älteste fällt weg)
  if (!(E.MAP && E.MAP.winter) || fxN('spurschnee') < 7) return;
  if (!aufSchnee(x0, y0) || !aufSchnee(x1, y1)) return;   // Punkt 5 (Enrico 2026-11-23): nur auf Schnee – nicht auf Straßen, Wegen, Eis, Furt, Brücken
  let n = 0; for (let k = gmarks.length - 1; k >= 0; k--) if (gmarks[k].b === 'spurschnee' && ++n >= 60) { gmarks.splice(k, 1); break; }
  gmark('spurschnee', i, (x0 + x1) / 2, (y0 + y1) / 2 + L.s * 0.12, Object.assign({ mul: 0.7, alpha: 1, flip: false, ang: Math.atan2(y1 - y0, x1 - x0), turns: 3, filter: 'brightness(0.62) contrast(1.35)', doppelt: true }, o));   // Enrico 20:50: dunkler, auch herausgezoomt erkennbar
}
// Atemwolken (Enrico 19:40): kleines Wölkchen am Kopf, wenn eine Fußtruppe spricht/ruft (nicht Kampfanzüge, Schreiter, Panzer); je Einheit höchstens alle 1,5 s
const ATEM = new Map();
function atem(u) {
  const T = u && TYPES[u.type]; if (!T || !BW || ['walker', 'art'].includes(T.cls) || T.suit || T.mech || T.dauerfeuer || istMaschine(u)) return;
  const t = performance.now(); if (t - (ATEM.get(u.id) || 0) < 1500) return; ATEM.set(u.id, t);
  const d = DU.get(u.id); if (!d || !d.fbx || !d.fbx.length) return; const [x0, y0, w, h, fl] = d.fbx[0], lf = facesLeft(d.face); const xx = !!fl !== lf ? -(x0 + w) : x0;
  const p = [d.x + xx + w * (lf ? 0.3 : 0.7), d.y + y0 + h * 0.15];
  fx('rauch', null, p[0], p[1], { fuss: [d.x, d.y], anchor: 'mitte', life: 80, mul: 0.13, grow: 1.3, alpha: 0.55, fadeIn: 6, fadeOut: 0.7, filter: 'brightness(2.6) saturate(0)', move: [p[0] + (lf ? -1 : 1) * L.s * 0.12, p[1] - L.s * 0.05] });
}
// Schneefall (Enrico 19:40): wenige, langsame Flocken über dem Bild, nur Winterkarten, aus bei Bildwirkung aus (oder window.NOSCHNEEFALL); Böe treibt sie kurz zur Seite
const SCHNEEFALL = []; let schneeBoeBis = 0;
function drawSchneefall(g) {
  if (!(E.MAP && E.MAP.winter) || !BW || window.NOSCHNEEFALL) return; const W = g.canvas.width, H = g.canvas.height, n = BW >= 2 ? 110 : 70;
  while (SCHNEEFALL.length < n) SCHNEEFALL.push({ x: Math.random(), y: Math.random(), v: 0.0006 + Math.random() * 0.0009, r: 0.6 + Math.random() * 1.4, ph: Math.random() * 6.28, a: 0.35 + Math.random() * 0.45 });
  const boe = now < schneeBoeBis ? Math.sin(Math.PI * (1 - (schneeBoeBis - now) / 3500)) : 0, st = STEP;
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#eef2f8';
  for (let i = 0; i < n; i++) { const f = SCHNEEFALL[i]; f.ph += 0.02 * st; f.y += f.v * st * (1 + boe * 0.5); f.x += (Math.sin(f.ph) * 0.0004 + 0.0002 + boe * 0.006) * st;
    if (f.y > 1.02) { f.y = -0.02; f.x = Math.random(); } if (f.x > 1.02) f.x -= 1.04;
    g.globalAlpha = f.a; g.beginPath(); g.arc(f.x * W, f.y * H, f.r * H / 1080, 0, 7); g.fill(); }
  g.restore();
}
const WFX = () => !!(E.MAP && E.MAP.winter && fxN('winter_schnee') >= 6);   // Wintereffekte nur auf Winterkarten und nur mit Bildern
function aufEis(x, y) { try { const [c, r] = pixToHex(x, y); return !!(G && G.map[c] && G.map[c][r] && (G.map[c][r].t === 'eis' || G.map[c][r].t === 'eisloch')); } catch (e) { return false; } }   // Eisloch: Regeln ändern das Feld vor dem Abspielen
const FX_GLOW = new Set(['muendung', 'explosion', 'feuer', 'funken', 'leuchtkugel', 'leuchtspur', 'flammenstrahl', 'drehlauf', 'nahkampf']);
// Größe: längste Seite des größten Teils eines Bogens in Feldradien (Soldat ≈ 0,8 Feldradien hoch)
const FX_SZ = { gasschliere_dick: 1.5, gasschliere: 1.1, befehlsruf: 2.6, filterdampf: 1.2, loewenmaul: 2.4, faustsalve: 0.95, kettenklinge: 1.25, /* U3 (Punkt 62): Effektbögen E1–E6 */ faehigkeiten: 2.4, winter_schnee: 2.0, kraterschnee: 1.4, spurschnee: 1.45, eisloch: 2.1, heldenfunken: 0.75, blut2: 1.05, muendung: 0.7, explosion: 1.7, erdfontaene: 2.0, rauch: 2.3, nebel: 1.7, gas: 1.8, feuer: 0.75, funken: 0.95, blut: 0.8, leuchtkugel: 1.0, truemmer: 1.6, bodenspuren: 1.4, geschosse: 0.42, leuchtspur: 1.2, flammenstrahl: 1, drehlauf: 0.95, nahkampf: 1.15 };
const GESCHOSS_ANG = [-18, -15, -40, 0, -15, -15].map(a => a * Math.PI / 180);   // Grundrichtung der Geschosse im Bogen (gemessen)
const fxIm = (b, i) => { const a = FXN[b]; if (!a || !a.length) return null; const im = a[i != null ? i : Math.floor(Math.random() * a.length)]; return im && im.complete && im.naturalWidth ? im : null; };
const fxN = b => (FXN[b] || []).length;
const fxDim = (im, b, mul = 1) => { const k = L.s * FX_SZ[b] * mul / 320; return [im.naturalWidth * k, im.naturalHeight * k]; };
const fxs = [], gmarks = [];   // laufende Effekte; Spuren am Boden (bleiben einige Runden)
// o: life/delay in 60-Hz-Bildern (mit Spieltempo), mul Größe, anchor 'unten'|'mitte'|'links'|'rechts', ang, flip, flipY, rise (Feldradien),
//    grow (Anteil), spin (Bogenmaß über die Lebenszeit), alpha, fadeIn, fadeOut (Anteil), len (Länge in px, Strahlen/Spuren), move [x2, y2] (fliegt hin)
function fx(b, i, x, y, o = {}) {
  if (b === 'erdfontaene' && WFX()) {   // Winter: Schneefontäne (groß/klein), auf Eis Eissplitter mit Knacken
    const { filter, ...oo } = o; o = oo; if (aufEis(x, y - L.s * 0.3)) { b = 'winter_schnee'; i = 5; o = { ...o, mul: (o.mul || 1) * 0.8 }; playSound('eis_knackt', 0.45, null, { noGap: true }); } else { b = 'winter_schnee'; i = i != null ? i : (o.mul || 1) >= 0.7 ? 0 : 2; } }
  if ((b === 'blut' || b === 'blut2') && E.MAP && E.MAP.winter) o = { ...o, mul: (o.mul || 1) * 0.72, filter: 'brightness(0.4) saturate(0.9)' };   // Blut auf Schnee dunkler und kleiner (Enrico 19:40)
  const im = fxIm(b, i); if (!im) return null; const e = Object.assign({ b, im, x, y, life: 30, delay: 0, mul: 1, anchor: 'unten', ang: 0, rise: 0, grow: 0, spin: 0, alpha: 1, fadeIn: 0, fadeOut: 0.4 }, o); e.max = e.life; fxs.push(e); return e; }
function drawFxs(g, s, up) {
  for (let i = fxs.length - 1; i >= 0; i--) {
    const e = fxs[i]; if (e.delay > 0) { e.delay -= FS; continue; } e.life -= FS;
    if (e.life <= 0) { fxs.splice(i, 1); continue; }
    fxZeichne(g, s, up, e, e.boden ? 'unten' : null);
  }
}
// Punkt 39 (2026-11-24): Boden-Ringe um eine Figur – hintere Hälfte (über der Mittellinie) vor der Figur, nach Tiefe einsortiert (drawTilt, PEND), vordere Hälfte nach den Figuren
function ringZeichne(g, s, rg, teil) { const k = 1 - rg.life / rg.max; g.save(); bodenClip(g, rg.y, teil); g.beginPath(); gEllipse(g, rg.x, rg.y, s * rg.r * k, s * rg.r * k); g.strokeStyle = rg.col; g.globalAlpha = Math.max(0, 1 - k); g.lineWidth = Math.max(2, s * 0.09); g.stroke(); g.restore(); }
function bodenClip(g, cy, teil) { if (!teil) return; g.beginPath(); if (teil === 'oben') g.rect(-1e6, -1e6, 2e6, 1e6 + cy); else g.rect(-1e6, cy, 2e6, 1e6); g.clip(); }
function fxZeichne(g, s, up, e, teil) {
  { const k = 1 - e.life / e.max, x = e.move ? e.x + (e.move[0] - e.x) * Math.min(1, k * 1.15) : e.x, y = e.move ? e.y + (e.move[1] - e.y) * Math.min(1, k * 1.15) : e.y;
    if (up) { const f = e.fuss ? (e.move && e.fuss2 ? [e.fuss[0] + (e.fuss2[0] - e.fuss[0]) * Math.min(1, k * 1.15), e.fuss[1] + (e.fuss2[1] - e.fuss[1]) * Math.min(1, k * 1.15)] : e.fuss) : null;
      if (!(f ? up(f[0], f[1]) : up(x, y))) return; }   // fuss: Aufsteller am Fußpunkt des Schützen (wie die Figur), sonst sitzt ein hoher Punkt wie die Mündung zu tief (Spieltest Runde 2, Punkt 18)
    let [w, h] = fxDim(e.im, e.b, e.mul * (1 + e.grow * k));
    if (e.len) { const r = e.len / w; w = e.len * (e.lenIn ? Math.min(1, (e.max - e.life) / e.lenIn) : 1); h *= Math.min(1.5, Math.max(0.6, Math.sqrt(r))); }   // Strahl wächst in lenIn Bildern auf volle Länge
    const fo = Math.min(1, e.life / (e.max * e.fadeOut)), fi = e.fadeIn ? Math.min(1, (e.max - e.life) / e.fadeIn) : 1;
    g.save(); g.globalAlpha = e.alpha * fo * fi; if (FX_GLOW.has(e.b)) g.globalCompositeOperation = 'lighter'; if (e.filter) g.filter = e.filter;
    g.translate(x, y - e.rise * s * k); bodenClip(g, 0, teil); if (e.ang || e.spin) g.rotate(e.ang + e.spin * k); if (e.flip) g.scale(-1, 1); if (e.flipY) g.scale(1, -1);
    const ax = e.anchor === 'links' ? 0 : e.anchor === 'rechts' ? -w : -w / 2, ay = e.anchor === 'unten' ? -h : -h / 2;
    g.drawImage(e.im, ax, ay, w, h); g.restore();
  }
}
// Spur am Boden (Brandfleck, Einschlag, Öl, Drahtreste, Kettenspur, Trichter): bleibt „turns“ Runden, die letzte blasst aus
function gmark(b, i, x, y, o = {}) {
  if (b === 'bodenspuren' && [0, 1, 5].includes(i) && E.MAP && E.MAP.winter && fxN('kraterschnee') === 3) { b = 'kraterschnee'; i = i === 0 ? 2 : i === 1 ? 0 : 1; }   // Winter: Brandfleck, Einschlag, kleiner Trichter im Schnee
  if ((b === 'blut' || b === 'blut2') && E.MAP && E.MAP.winter) o = { ...o, mul: (o.mul || 1) * 0.72, filter: 'brightness(0.4) saturate(0.9)' };   // Blutflecken auf Schnee dunkler und kleiner
  const im = fxIm(b, i); if (!im || !G) return; gmarks.push(Object.assign({ b, im, x, y, mul: 1, flip: Math.random() < 0.5, turn: G.turn, turns: 3, alpha: 0.9, born: now }, o)); if (gmarks.length > 320) gmarks.shift(); }
// Paket C Punkt 4 (2026-11-24): Filter (Schneespur, Winterblut) und „doppelt“ einmal je Bild vorberechnen statt in jedem Frame mit g.filter – bei ~300 Spuren gegen Spielende stieg die Bildzeit sonst von ~11 auf ~27 ms
const GM_CACHE = new WeakMap();
function gmBild(m) { if (!m.filter && !m.doppelt) return m.im; let c = GM_CACHE.get(m.im); if (!c) GM_CACHE.set(m.im, c = new Map()); const k = (m.filter || '') + (m.doppelt ? '|2' : ''); let cv = c.get(k);
  if (!cv) { const W = m.im.naturalWidth || m.im.width, H = m.im.naturalHeight || m.im.height; if (!W || !H) return m.im; cv = document.createElement('canvas'); cv.width = W; cv.height = H; const x = cv.getContext('2d'); if (m.filter) x.filter = m.filter; x.drawImage(m.im, 0, 0); if (m.doppelt) x.drawImage(m.im, 0, 0); c.set(k, cv); }
  return cv; }
function drawGmarks(g) {
  for (let i = gmarks.length - 1; i >= 0; i--) { const m = gmarks[i], age = G.turn - m.turn; if (age >= m.turns) { gmarks.splice(i, 1); continue; }
    const [w, h0] = fxDim(m.im, m.b, m.mul), h = h0 * Math.max(0.55, kAt(m.x, m.y)) * 0.8, fin = Math.min(1, (now - m.born) / 400);
    const fo = m.weg ? 1 - (now - m.weg) / 900 : 1; if (fo <= 0) { gmarks.splice(i, 1); continue; }   // weg: langsam ausblenden (Eisloch friert zu)
    g.save(); g.globalAlpha = m.alpha * fin * fo * (age === m.turns - 1 ? 0.55 : 1); g.translate(m.x, m.y); if (m.ang) g.rotate(m.ang); if (m.flip) g.scale(-1, 1); g.drawImage(gmBild(m), -w / 2, -h / 2, w, h); g.restore(); }   /* doppelt: halbdurchsichtige Spuren deckender */
}
// Laufmündung einer Einheit: gemessen (MUZ) oder vordere Kante der q-ten Figur in Laufhöhe hf (Anteil der Figurhöhe von oben)
function fxMuzzle(id, q = 0, hf = 0.3) {
  const d = DU.get(id); if (!d) return null; const lf = facesLeft(d.face), mitFuss = p => (p.fuss = [d.x, d.y], p);
  if (d.muz) return mitFuss([d.x + (!!d.muz[2] === lf ? d.muz[0] : -d.muz[0]), d.y + d.muz[1]]);
  const bs = d.fbx || []; if (!bs.length) return null;
  let [x0, y0, w, h, fl, mz] = bs[q % bs.length]; if (!!fl !== lf) x0 = -(x0 + w);
  if (mz) return Object.assign(mitFuss([d.x + (lf ? x0 + w * (1 - mz[0]) : x0 + w * mz[0]), d.y + y0 + h * mz[1]]), { h });   // F47: gemessene Mündung der Pose; h = Figurhöhe (U3 Figurenfaktor)
  return Object.assign(mitFuss([d.x + (lf ? x0 : x0 + w), d.y + y0 + h * hf]), { h });
}
// Richtung für Bilder, die nach rechts zeigen: nach links gespiegelt statt kopfüber gedreht
function fxDir(x1, y1, x2, y2, lim = 0.6) { const fl = x2 < x1, a0 = Math.max(-lim, Math.min(lim, Math.atan2(y2 - y1, Math.abs(x2 - x1) || 1e-6))); return { flip: fl, ang: fl ? -a0 : a0 }; }
// Mündungsfeuer (≈ 0,1 s): v 0 Gewehr, 1 MG, 2 Pistole, 3 Kanone, 4 Mörser (nach oben), 5 lang und dünn (Scharfschütze, Panzerbüchse)
// Zweitwaffe (Paket 8): Mündung am Seitenerker (Landkoloss, zur Zielseite hin) bzw. vorn am Turm (Turmschreiter)
// Faustsalve: Mündung an der linken (n 0) bzw. rechten Faust (n 1) des Eisenknechts
function fxFaust(id, n) {
  const d = DU.get(id); if (!d) return null; const bs = d.fbx || []; if (!bs.length) return fxMuzzle(id, 0, 0.5);
  let [x0, y0, w, h, fl] = bs[0]; if (!!fl !== facesLeft(d.face)) x0 = -(x0 + w);
  const p = [d.x + x0 + w * (n ? 0.66 : 0.34), d.y + y0 + h * 0.56]; p.fuss = [d.x, d.y]; return p;
}
function fxSeite(id, zid) {
  const d = DU.get(id), u = unitById(id); if (!d) return null; const bs = d.fbx || []; if (!bs.length) return fxMuzzle(id, 0, 0.5);
  let [x0, y0, w, h, fl] = bs[0]; if (!!fl !== facesLeft(d.face)) x0 = -(x0 + w);
  if (u && u.type === 'turm') return fxMuzzle(id, 0, 0.3);
  if (d.muz2) { const lf = facesLeft(d.face), m = d.muz2, p = [d.x + (!!m[2] === lf ? m[0] : -m[0]), d.y + m[1]]; p.fuss = [d.x, d.y]; return p; }   // Mündung aus dem Bild (MUZ2)
  if (u && u.type === 'kreuz') { const lf = facesLeft(d.face), p = [d.x + x0 + w * (lf ? 0.38 : 0.62), d.y + y0 + h * 0.27]; p.fuss = [d.x, d.y]; return p; }   // Kanone im Löwenmaul
  const z = DU.get(zid), rechts = z ? z.x >= d.x : true, p = [d.x + x0 + w * (rechts ? 0.62 : 0.38), d.y + y0 + h * 0.56]; p.fuss = [d.x, d.y]; return p;
}
// F71 (2026-11-21): Pulverdampf – an der Mündung, langsam steigend und seitlich treibend, durchsichtig, nach 2–3 s weg; Größe je Waffe; begrenzt; Bildwirkung aus = keiner, leicht = halb so viel
// F75: Flammenwerfer-Ton als Schleife genau über die Dauer des Strahls, dann weich aus und kurzes Nachbrennen (Prasseln)
function flammenTon(id, dauer) { const u = unitById(id), k = soundOn ? tonPick('flame', u) : null; if (!k || !SND[k]) return null;
  const a = SND[k].cloneNode(), v = Math.min(1, 0.6 * effektVol); a.loop = true; a.volume = 0; anBus(a, 'e'); a.playbackRate = 0.95 + Math.random() * 0.1; try { const p = a.play(); if (p && p.catch) p.catch(() => {}); } catch (e) {}
  let t0 = performance.now(), aus = false; const tick = () => { if (aus) return; const t = performance.now() - t0; a.volume = v * Math.min(1, t / 60); requestAnimationFrame(tick); }; tick();
  return { aus() { aus = true; const v0 = a.volume, t1 = performance.now(); const f = () => { const k2 = Math.min(1, (performance.now() - t1) / 260); try { a.volume = v0 * (1 - k2); } catch (e) {} if (k2 < 1) requestAnimationFrame(f); else a.pause(); }; f();
    playSound('feuer', 0.3, null, { noGap: true, dur: 700 }); } }; }
function pulverDampf(p, mul, delay = 0) { if (!p || !BW || (BW === 1 && Math.random() < 0.5) || fxs.filter(e => e.dampf).length > 36) return;
  const drift = (Math.random() < 0.5 ? -1 : 1) * L.s * (0.15 + Math.random() * 0.25), e = fx('rauch', null, p[0], p[1], { fuss: p.fuss, move: [p[0] + drift, p[1] - L.s * 0.1], delay, life: 130 + Math.random() * 40, mul: mul * (0.85 + Math.random() * 0.3), grow: 0.8, rise: 0.45, alpha: 0.42, fadeIn: 8, fadeOut: 0.75, flip: Math.random() < 0.5 }); if (e) e.dampf = true; }
let fxZielFuss = null;   // Fußpunkt des aktuellen Ziels (Leuchtspur endet dort am Aufsteller)
// F65: Richtung auf dem Bildschirm – Mündung und Ziel stehen als Aufsteller an ihren Fußpunkten; in Weltkoordinaten stimmt der Winkel in der gekippten Ansicht nicht
function fxScr(x, y, f) { const b = f && bbAt(f[0], f[1]); return b ? [b.px + b.sc * (x - f[0]), b.py + b.sc * (y - f[1])] : [x, y]; }
function fxDirS(p, tx, ty, lim) { if (!p.fuss || !fxZielFuss) return fxDir(p[0], p[1], tx, ty, lim); const a = fxScr(p[0], p[1], p.fuss), z = fxScr(tx, ty, fxZielFuss); return fxDir(a[0], a[1], z[0], z[1], lim); }
function fxFlash(v, p, tx, ty, o = {}) { if (!p) return null; const dr = fxDirS(p, tx, ty, 0.5); return fx('muendung', v, p[0], p[1], Object.assign({ fuss: p.fuss, anchor: 'links', life: 6, fadeOut: 0.7, flip: dr.flip, ang: dr.ang, mul: 1 }, o)); }
// U3 (2026-11-27): Figurenfaktor – Mündungsfeuer und Spritzer an einzelnen Figuren nach deren Höhe statt feldgroß (Linien-Soldat ≈ 0,5 Feldradien hoch:
// Gewehrfeuer vorher ≈ 0,73 R, jetzt ≈ 0,8 Figurhöhe). Rückweg window.FIGFAK_ALT.
const figMul = (h, anteil, sz, alt) => window.FIGFAK_ALT || !h ? alt : Math.max(0.3, Math.min(1.3, anteil * h / (sz * L.s)));
// Leuchtspur fliegt von p zum Ziel: v 0 Gewehr, 1 MG-Striche, 5 Panzerbüchse
function fxTracer(v, p, tx, ty, o = {}) { if (!p) return null; const dr = fxDirS(p, tx, ty, 1.2), oo = Object.assign({ fuss: p.fuss, fuss2: p.fuss && fxZielFuss, anchor: 'rechts', move: [tx, ty], life: 14, fadeOut: 0.25, flip: dr.flip, ang: dr.ang, mul: 0.55 }, o);
  { const im = fxIm('leuchtspur', v), b = p.fuss && bbAt(p.fuss[0], p.fuss[1]); if (im && b && fxZielFuss) { const a0 = fxScr(p[0], p[1], p.fuss), z = fxScr(tx, ty, fxZielFuss), D = Math.hypot(z[0] - a0[0], z[1] - a0[1]), w = fxDim(im, 'leuchtspur', oo.mul)[0]; if (w * b.sc > D * 0.5) oo.len = Math.max(8, D * 0.5 / b.sc); } }   // F65: Spur höchstens halb so lang wie die Flugstrecke, sonst ragt ihr Schweif bei kurzen, steilen Schüssen über den Schützen hinaus
  return fx('leuchtspur', v, p[0], p[1], oo); }
// Artillerie-, Mörser-, Granateinschlag: Feuerkern (4 Stufen, ca. 0,5 s), dann Erdfontäne, danach steigt Rauch; Spur am Boden
function fxImpact(x, y, r, o = {}) {
  if (!fxIm('explosion') || !fxIm('erdfontaene')) return false;
  const s = L.s, m = r / (s * 0.95), by = y + s * 0.3 * Math.min(1.2, m), dl = o.delay || 0, fl = Math.random() < 0.5;
  if (o.alt) fx('explosion', 4 + (Math.random() < 0.5 ? 0 : 1), x, by, { delay: dl, life: 26, mul: m, grow: 0.15, fadeOut: 0.5 });
  else for (let st = 0; st < 4; st++) fx('explosion', st, x, by, { delay: dl + st * 7.5, life: st < 3 ? 9 : 16, mul: m * (st ? 1 : 0.8), fadeOut: st < 3 ? 0.15 : 0.6, flip: fl });
  if (WFX() && aufEis(x, y)) {   // Einschlag auf dem Eis: Splitter, darunter Schnee; großer Ton „Eis bricht“, sonst Knacken
    fx('winter_schnee', 5, x, by, { delay: dl + 4, life: 56, mul: m * 0.75, grow: 0.15, flip: fl, fadeOut: 0.5 }); fx('winter_schnee', 3, x, by + s * 0.05, { delay: dl + 8, life: 60, mul: m * 0.6, grow: 0.3, alpha: 0.8, fadeOut: 0.6 });
    setTimeout(() => playSound(m >= 0.7 ? 'eis_bricht' : 'eis_knackt', m >= 0.7 ? 0.55 : 0.5, null, { noGap: true }), (dl * 16.667 + 120) / speed);
  } else if (WFX()) { if (m >= 0.7) { fx('winter_schnee', 0, x, by, { delay: dl + 4, life: 30, mul: m, grow: 0.15, flip: fl, fadeOut: 0.25 }); fx('winter_schnee', 1, x, by, { delay: dl + 28, life: 46, mul: m, grow: 0.1, flip: fl, fadeIn: 3, fadeOut: 0.55 }); }   // Schneefontäne, fällt zusammen
    else fx('winter_schnee', 2, x, by, { delay: dl + 4, life: 56, mul: m * 1.2, grow: 0.2, flip: fl, fadeOut: 0.45 }); }
  else fx('erdfontaene', null, x, by, { delay: dl + 4, life: 64, mul: m, grow: 0.2, flip: fl, fadeOut: 0.45 });
  fx('rauch', null, x, by - s * 0.1 * m, { delay: dl + 24, life: 150, mul: m * 0.75, grow: 0.35, rise: 0.9, alpha: 0.72, fadeIn: 18, fadeOut: 0.6, flip: Math.random() < 0.5 });
  if (!o.noMark && !(WFX() && aufEis(x, y))) setTimeout(() => gmark('bodenspuren', Math.random() < 0.55 ? 1 : 5, x, y + s * 0.15, { mul: 0.7 * Math.min(1.4, m) }), (dl * 16.667 + 200) / speed);
  return true;
}

// ---------- Gelände ----------
const O = '#16150f';
// ---------- Gelände-Bausteine (neue Ansicht, STYLE.md „Gelände-Bausteine“) ----------
// Nur mit Schalter „Neue Ansicht (Test)“ und zuerst nur auf GB_KARTEN. Bilder: window.GELAENDE (src/gelaende.js), Aufbau: GBau (src/gelaende_bau.js).
// GBW = aufgebaute Welt: flaches Weltbild (ersetzt tcv), aufrechte Teile (in drawTilt mit den Einheiten nach Tiefe gemischt), platz() für Trupps.
const GB_KARTEN = new Set(['grauwall', 'sanktruss', 'winterdorf']);
// Winterdorf (2026-11-22): Platzhalter, bis die eigenen Bausteine da sind – Eis wie Wasser, Häuser und Kapelle wie Ruinen, Steinbrücke wie Brücke
const GB_PLATZHALTER = { eis: 'canal', haus: 'village', kapelle: 'village', steinbruecke: 'bridge' };
// Winter-Bausteine (Enrico 2026-11-22 18:00, Flux): mit Schneeboden in GELAENDE zeichnet GBau Eis, Häuser, Kapelle und Steinbrücke selbst (Platzhalter nur ohne Bilder)
const gbWinter = () => !!(E.MAP.winter && window.GELAENDE && window.GELAENDE.boden_schnee);
// Geländeart, wie sie gezeigt wird: eingestürztes Haus/Kapelle erst, wenn das Ereignis abgespielt ist (Regeln machen das Feld vorher zu 'village')
function gbTerr(c, r) {
  const h = G.map[c][r], b = h.bau != null && G.bauten ? G.bauten[h.bau] : null;
  if (b && (b.art === 'haus' || b.art === 'kapelle') && h.t === 'village' && !bauSicht()[h.bau]) return gbWinter() ? b.art : 'village';
  if (b && b.art === 'muehle') return bauSicht()[h.bau] ? 'muehle_weg' : 'muehle';   // G6: Windmühle, zerstört erst beim Abspielen des Einsturzes
  if (h.gesprengt && h.t === 'crater') return 'sperre_weg';   // G6: gesprengte Panzersperre
  const t = h.t === 'eisloch' ? 'eis' : h.t === 'acker' ? 'garten' : h.t;   // G4: Acker (Krähenfurt) zeichnet GBau wie bisher über die Gartenfelder   // Eisloch: Boden bleibt Eis, das Loch ist eine Bodenspur (erscheint beim Abspielen von „eisbruch“)
  return gbWinter() ? t : (GB_PLATZHALTER[t] || t);
}
// Große Gebäude: gezeigter Zustand (eingestürzt erst, wenn das Ereignis abgespielt wird – die Regeln ändern G vorher)
let BAUV = { g: null, k: [] };
function bauSicht() { if (BAUV.g !== G) BAUV = { g: G, k: ((G && G.bauten) || []).map(b => !!b.kaputt) }; return BAUV.k; }
let FIGQ = null;   // drawTilt: Sammelliste für Grabenfiguren, die einzeln nach Tiefe gezeichnet werden ({ y, f })
let GBW = null, GBIM = null, gbLaden = null, gbKey = '', gbFeld = null;   // gbFeld: Geländeart je Feld beim letzten Aufbau (Draht weg ohne Neuaufbau, F12)
// Schräge Wandstücke kippen (Kirche, Zaun, Mauern, Ruinen; 2026-11-19): Stärke, zum Vergleich window.NOKIPP = true bzw. __dbg.kipp(0)
const gbKipp = () => window.NOKIPP ? 0 : (window.KIPP ?? 1);
const gbAn = () => GB_KARTEN.has(E.MAP.id) && !!window.GBau && !!window.GELAENDE;
function gbBereit() {   // Welt passend zu Karte und Gelände (Draht kann wegfallen) aufbauen; false, solange die Bilder laden
  if (!gbAn() || !L || !G) return false;
  if (!GBIM) { if (!gbLaden) gbLaden = Promise.all([GBau.bilder(n => window.GELAENDE[n]), figurenNachladen().then(gbPlastikLaden)]).then(([im]) => { GBIM = im; if (L) renderTerrain(); }); return false; }
  // Schlüssel nach dem, was gezeichnet wird (Platzhalter: eingestürztes Haus sieht aus wie vorher), Bauzustand nur der Gebäude, die GBau selbst zeichnet (Kirche)
  const basis = E.MAP.id + ':' + BW + ':' + gbKipp() + ':' + (window.GB_PROBE ? JSON.stringify(window.GB_PROBE) : '') + (window.GTEILE_ALT ? ':alt' : '') + (window.G7_ALT ? ':g7alt' : '') + (window.FLACH_ALT ? ':flalt' : '') + (window.ZINNEN_ALT ? ':zalt' : '') + (window.G4B_ALT ? ':g4b' : '') + (window.GRABENPLATZ_ALT ? ':gpa' : '') + (window.ZICKZACK_ALT ? ':zz' : '') + (window.DRAHT_ALT ? ':da' : '') + (window.STAERKE_ALT ? ':st' : '') + (window.RASTER_ALT ? ':ra' : '') + (window.GUERTEL_ALT ? ':ga' : '') + ':' + L.W + 'x' + L.H + ':' + (G.bauten || []).map((b, i) => b.art === 'kirche' ? bauSicht()[i] : '').join(), feld = G.map.map((col, c) => col.map((h, r) => gbTerr(c, r))), key = basis + ':' + feld.map(col => col.map(t => t[0] + t.length).join('')).join('|');
  if (GBW && gbKey === key) return 'gleich';
  // Einschläge ohne Neuaufbau (Enrico 2026-11-22 17:32, vorher 0,5–0,7 s Bildpause je Trichter): neuer Trichter = nur das Feld nachzeichnen; zerstörte Barrikade/Bunker/Draht = deren Teile herausnehmen
  if (GBW && GBW.flachNeu && gbFeld && gbKey.startsWith(basis + ':')) { const neu = [], weg = [], bau = [], FLACH = new Set(['open', 'grass', 'mud', 'crater']), WEGBAR = new Set(['wire', 'barrikade', 'bunker']);
    const geht = feld.every((col, c) => col.every((t, r) => { const a = gbFeld[c] && gbFeld[c][r]; if (a === t) return true;
      if ((a === 'haus' || a === 'kapelle') && t === 'village' && GBW.feldNeu) { bau.push([c, r]); return true; }   // Krähenfurt: Haus/Kapelle → Ruine, nur das Feld neu
      if (!window.NEUBAU_ALT && GBW.feldNeu && ((a === 'sperre' && t === 'sperre_weg') || (a === 'muehle' && t === 'muehle_weg'))) { bau.push([c, r]); neu.push([c, r]); return true; }   // G7e Bremse 4: gesprengte Sperre, eingestürzte Mühle – nur das Feld neu (vorher voller Neuaufbau, 0,4–0,6 s); Rückweg NEUBAU_ALT
      if (WEGBAR.has(a) && (t === 'open' || t === 'crater')) { weg.push([c, r]); if (t === 'crater') neu.push([c, r]); return true; }
      if (FLACH.has(a) && t === 'crater') { neu.push([c, r]); return true; } return false; }));
    if (geht) { for (const [c, r] of weg) GBW.feldWeg(c, r); for (const [c, r] of bau) GBW.feldNeu(c, r); for (const [c, r] of neu) { GBW.flachNeu(c, r); gbTcvNeu.push([c, r]); } gbKey = key; gbFeld = feld; return 'inkr'; } }
  // Nur Draht verschwunden (geschnitten, niedergewalzt, zerschossen): Drahtstücke herausnehmen statt alles neu aufzubauen (0,4–0,6 s Stocken, F12 2026-11-20)
  if (GBW && GBW.drahtWeg && gbFeld && gbKey.startsWith(basis + ':')) { const weg = [];
    const nurDraht = feld.every((col, c) => col.every((t, r) => { const a = gbFeld[c] && gbFeld[c][r]; if (a === t) return true; if (a === 'wire') { weg.push([c, r]); return true; } return false; }));
    if (nurDraht) { for (const [c, r] of weg) GBW.drahtWeg(c, r); gbKey = key; gbFeld = feld; return 'gleich'; } }   // Boden unverändert
  const t0 = performance.now();
  const IMB = BW ? Object.fromEntries(Object.entries(GBIM).map(([n, im]) => [n, im && window.FIGSP && window.FIGSP['gel_' + n] ? bwBild('gel_' + n, im, true) : im])) : GBIM;
  GBW = GBau.aufbauen({ cols: COLS, rows: ROWS, R: L.s, rand: { mx: 0, top: L.top, mb: L.H - (L.top + L.s * SQ3 * (ROWS + 0.5)) },
    terr: gbTerr, winter: gbWinter(), schneeKante: !window.NOSCHNEEKANTE, strassen: gbWinter() ? [E.MAP.strasse, E.MAP.strasse2].filter(Boolean) : null, bauArt: (c, r) => { const h = G.map[c][r]; return h.bau != null && G.bauten && G.bauten[h.bau] ? G.bauten[h.bau].art : null; }, flags: (c, r) => ({ road: !!G.map[c][r].road, river: !!G.map[c][r].river, deko: G.map[c][r].deko }),
    bauten: (G.bauten || []).map((b, i) => ({ art: b.art, felder: b.felder, turm: b.turm, kaputt: bauSicht()[i] })).filter(b => b.art === 'kirche'),   // Häuser/Kapelle: noch Platzhalter (Ruinen)
    ...(E.MAP.graeben && !window.GRAEBEN_ALT ? { graeben: E.MAP.graeben, grabenForm: 'buchten', grabenRueckwall: true, grabenPfuetzen: true } : {}),   /* G2a (2026-11-25): Gräben als Linien mit Feuerbuchten; Rückweg window.GRAEBEN_ALT */
    ackerNeu: !window.ACKER_C2 && !window.ACKER_ALT,   /* G3a: Acker A (gezeichnete Furchen); window.ACKER_C2 = Acker vom 24.11. */
    teileAlt: !!window.GTEILE_ALT, zinnenAlt: !!window.ZINNEN_ALT, g4bAlt: !!window.G4B_ALT, plaetzeAlt: !!window.GRABENPLATZ_ALT, plaetze: window.STAERKE_ALT ? 10 : 8, rasterAlt: !!window.RASTER_ALT,   /* R1: 8 Grabenplätze, Feldlinien dezenter (RASTER_ALT) */ zickzackAlt: !!window.ZICKZACK_ALT, drahtAlt: !!window.DRAHT_ALT, guertelAlt: !!window.GUERTEL_ALT,   /* G5b: window.GUERTEL_ALT = Code-Draht aus G5 */   /* G5: window.DRAHT_ALT = Draht wie vorher (Bild und, vor dem Schlachtstart gesetzt, Lage) */   /* U2: window.GRABENPLATZ_ALT = vorläufige Grabenplätze aus U1 */   /* G4b: window.G4B_ALT = Takt und Grabenboden wie G4 */   /* G4 (2026-11-25): window.ZINNEN_ALT = Gräben wie G2b (Buchten im breiten Band) */   /* G2b/G3b (2026-11-25): window.GTEILE_ALT = ohne die gemalten Graben- und Feldteile */
    kantenRegel: !E.kanteAus() && !window.BILDKANTE_ALT,   // Punkt 103: Gartenmauern, Friedhofsmauer, Schanzen-Sandsäcke aus der Regel zeichnen
    kanten: E.kanteAus() || !G.kanten ? [] : Object.entries(G.kanten).map(([k, art]) => { const [a, b] = k.split('|').map(t => t.split(',').map(Number)); return { a, b, art }; }),   // R3: Deckung an Feldkanten
    zickzack: true, kipp: gbKipp(), grabenSeite: c => c <= (E.MAP.zoneA ?? 2) ? 'A' : 'D', seed: 1917,
    baumAlpha: k => BAUM_A.has(k) ? BAUM_A.get(k) : 1,   // Bäume durchsichtig (Enrico 2026-11-22)
    schanzen: (E.MAP.objectives || []).filter(o => /schanze/i.test(o.id)).map(o => [o.c, o.r]), ao: BW, teilFilter: BW_BODEN[BW], ...(window.GB_PROBE || {}) }, IMB);   /* G1-Probe (2026-11-25): window.GB_PROBE = { grabenForm: 'buchten', grabenRueckwall, grabenPfuetzen, ackerNeu } bzw. __dbg.gbProbe(o); ohne GB_PROBE alles wie bisher */   // Bildwirkung: Kantenverdeckung, aufrechte Teile wie der Boden   // Schanze = Bunker + Sandsäcke
  gbKey = key; gbFeld = feld; window.__gbMs = Math.round(performance.now() - t0);
  return true;
}
// Plastik-Karten der neuen Gelände-Bausteine (Sankt Ruß, „gel_<name>“ in figsplastik.js) vor dem ersten Aufbau laden; nur die Karte, ohne Farbänderung
function gbPlastikLaden() {
  const ks = Object.keys(window.FIGSP || {}).filter(k => k.startsWith('gel_'));
  return Promise.all(ks.map(k => new Promise(res => { let i = BWK[k]; if (!i) { i = BWK[k] = new Image(); i.src = window.FIGSP[k]; }
    if (i.complete && i.naturalWidth) res(); else { i.onload = i.onerror = () => res(); } })));
}
// Wie stehen die Figuren eines Trupps im Feld (Graben: auf der Grabenlinie, abgesenkt; Ruine: Tiefe gestaucht)? Nur in Ruhe auf der Feldmitte.
function gbPlatz(u, d) {
  if (!GBW || !gbAn()) return null;
  const [cx, cy] = center(u.c, u.r); if (Math.hypot(d.x - cx, d.y - cy) > L.s * 0.05) return null;
  return GBW.platz(u.c, u.r);
}
let gbTcvNeu = [], tcvFertig = false, BODEN_TMP = null;
// Zeichenfläche verloren (Enrico 2026-11-22: „Bild ganz weg, danach Bodentexturen kaputt“): beim Zurückkommen alle Zwischenbilder verwerfen und Gelände/Boden neu aufbauen
function bildNeuAufbauen(grund) { try { console.warn('Zeichenfläche neu aufgebaut:', grund); BWI.clear(); for (const k in SPR) delete SPR[k]; } catch (e) {} GBW = null; gbKey = ''; gbFeld = null; tcvFertig = false; gbTcvNeu = []; BODEN_TMP = null; if (L && G) renderTerrain(); }
cv.addEventListener('contextlost', e => { e.preventDefault(); });   // Chrome stellt die Fläche dann selbst wieder her
cv.addEventListener('contextrestored', () => bildNeuAufbauen('contextrestored'));
let kontextWeg = false; setInterval(() => { const weg = !!(MAINCTX.isContextLost && MAINCTX.isContextLost()); if (kontextWeg && !weg) bildNeuAufbauen('isContextLost'); kontextWeg = weg; }, 1000);   // falls das Ereignis fehlt   // Einzelfelder fürs gefilterte Bodenbild; Hilfsleinwand wird wiederverwendet (vorher je Aufruf neu angelegt)
function renderTerrain() {   // Bildwirkung (2026-11-19): Boden in der neuen Ansicht danach einmal abdunkeln und entsättigen
  const art = renderTerrain0();
  if (art === 'gleich' || art === 'inkr' || !BW || !tcv) return;
  const t = BODEN_TMP = BODEN_TMP || document.createElement('canvas'); if (t.width !== tcv.width || t.height !== tcv.height) { t.width = tcv.width; t.height = tcv.height; } else t.getContext('2d').clearRect(0, 0, t.width, t.height); const x = t.getContext('2d'); x.drawImage(tcv, 0, 0);
  const g = tcv.getContext('2d'); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, tcv.width, tcv.height); g.filter = BW_BODEN[BW]; g.drawImage(t, 0, 0); g.restore();
}
function renderTerrain0() {
  const { s, W, H, dpr } = L;
  const gb = gbBereit(), passt = tcv && tcv.width === W && tcv.height === H && tcvFertig;
  if (gb === 'gleich' && passt) return 'gleich';   // nichts am Boden geändert (z. B. Draht weg): kein Kopieren, kein Neufiltern
  if (gb === 'inkr' && passt) { const x = tcv.getContext('2d'); for (const [c, r] of gbTcvNeu) { x.save(); if (BW) x.filter = BW_BODEN[BW]; GBW.flachNeu(c, r, x); x.restore(); } gbTcvNeu = []; return 'inkr'; }
  gbTcvNeu = []; tcv = tcv || document.createElement('canvas'); if (tcv.width !== W || tcv.height !== H) { tcv.width = W; tcv.height = H; }
  const g = tcv.getContext('2d'); g.clearRect(0, 0, W, H);
  if (gb) { g.drawImage(GBW.ground, 0, 0); tcvFertig = true; return 'voll'; }   // Boden aus Bausteinen (Raster ist schon drin)
  tcvFertig = false;
  g.fillStyle = '#1c1d17'; g.fillRect(0, 0, W, H);   // solange die Bausteine laden (gbBereit zeichnet danach neu)
}

// ---------- Einheiten ----------
function initDU() { DU.clear(); LEICHEN.length = 0; for (const u of G.units) addDU(u); }
// Anzeige-Zustand (Wunsch des Nutzers): Zustände und Wolken erscheinen erst, wenn ihr Ereignis abgespielt wird, nicht schon beim Rechnen.
// Die Regeln ändern G sofort; gezeichnet wird VIS bzw. d.vs, das syncAll() nach jedem abgespielten Stapel nachzieht.
const VIS = { clouds: [], smoke: [], lit: [], marks: [], fires: [], ctrl: {} };
const vsOf = u => ({ lance: !!(TYPES[u.type] && TYPES[u.type].blastLance && !u.lanceUsed), dug: !!u.dug, shields: !!u.shields, fireFree: !!u.fireFree, hold: !!u.holdB, planted: !!u.planted, sperr: u.sperr || 0, supp: u.supp || 0, gassed: !!u.gassed, poison: u.poison || 0, rout: u.status === 'rout', broken: u.broken || 0, stuck: u.stuck || 0, setup: !!u.setup, limbered: !!u.limbered, angst: !!u.angst });
function visSync(what) { if (!G) return; const cp = a => (a || []).map(k => ({ ...k })); if (!what || what === 'clouds') VIS.clouds = cp(G.clouds); if (!what || what === 'smoke') VIS.smoke = cp(G.smoke); if (!what || what === 'lit') VIS.lit = cp(G.lit); if (!what || what === 'marks') VIS.marks = cp(G.marks); if (!what || what === 'fires') { VIS.fires = cp(G.fires); fireLoop(); } if (!what) ctrlSync(); }
// Besitz der Zielfelder in die Anzeige übernehmen, mit Ton. SP-3 (84.3): eigene Funktion, weil die Ereignisse „Ziehen“ und „Sprung“ den Besitz bisher
// selbst still übernahmen – danach fand visSync keinen Unterschied mehr, und das Erobern blieb stumm.
function ctrlSync() { if (!G) return; const old = VIS.ctrl || {};
    for (const o of OBJECTIVES) { const a = old[o.id], b = (G.ctrl || {})[o.id]; if (a === b || !b) continue;
      const me = human('A') && !human('D') ? 'A' : human('D') && !human('A') ? 'D' : null;   // gegen die KI: Verlust der eigenen Seite eigens hörbar
      if (me && a === me && b !== me) { playSound('verloren', 0.55); verlorenT = performance.now(); } else playSound(b === 'D' ? 'erobert_aschenwacht' : 'erobert_konkordat', 0.55, b);
      { const cu = G.units.find(x => x.side === b && x.c === o.c && x.r === o.r && E.alive(x)); if (cu) setTimeout(() => stimme(cu, 'zielfeld'), 450); } }   // V3: Zielfeld genommen   /* SP-3 (84.3): je Seite ein eigener Tonplatz, im Ton-Pult unter „Gelände und Gebäude“ wählbar */
    VIS.ctrl = { ...(G.ctrl || {}) }; }
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
const DIM_T = new Set(['wald', 'waldweg', 'forest', 'village', 'fabrik', 'kirche', 'schiff', 'turm']);

// Kartenmarken nach STYLE.md (Wunsch des Nutzers): an der Figur nur ein schmaler Lebensbalken in Fraktionsfarbe, das Deckungsschild und EIN Zustandsplatz
// (wichtigster Zustand, „+n“ bei mehreren). Eigene Einheiten am Zug: Messingpunkte unter dem Balken = Aktionspunkte. Alles in einer Zeile unter der Figur.
// STATES: Reihenfolge = Wichtigkeit. on(u, d) liest die Anzeige-Werte d.vs, damit Zustände erst beim Abspielen erscheinen.
const xf = v => '×' + String(+v.toFixed(2)).replace('.', ',');   // Faktor aus den Regeln für Tooltips (×1,25)
const STATES = [
  { k: 'supp', sym: 'niedergehalten', name: 'Niedergehalten', on: (u, d) => d.vs.supp > 0, text: () => `Liegt unter Beschuss flach: kann weder ziehen, schießen noch stürmen, Nahkampf ${xf(P.SUPP_ATK)}. Hält bis zum Ende des nächsten eigenen Zugs an; „Sammeln“ hebt es auf.` },
  { k: 'rout', sym: 'flucht', name: 'Flieht', on: (u, d) => d.vs.rout, text: () => `Moral gebrochen: weicht zurück und gehorcht nicht. Gegner treffen sie ${xf(P.VS_ROUT)}, Reiter ${xf(P.CAV_VS_ROUT)}. Ein Anführer in der Nähe kann sie wieder sammeln.` },
  { k: 'broken', sym: 'festgefahren', name: 'Panne – festgefahren', on: (u, d) => d.vs.broken > 0, text: (u, d) => `Im Schlamm festgefahren: fällt noch ${upRunden(Math.max(1, (u.broken || 1) - 1))} aus. Ein Versorgungstrupp oder Pioniere können sie bergen.` },
  { k: 'sperr', sym: 'garbe', ring: '#E2B04A', name: 'Sperrfeuer', on: (u, d) => d.vs.sperr > 0 && E.alive(u), blockiert: (u, d) => d.vs.supp > 0 || (E.active(u) && E.held(G, u)),
    textBlock: (u, d) => d.vs.supp > 0 ? 'Sperrfeuer blockiert: Das MG ist niedergehalten und schießt nicht, solange das anhält.' : 'Sperrfeuer blockiert: Ein Gegner steht daneben (gebunden), das MG schießt nicht.', text: (u, d) => `Schießt in der gegnerischen Runde noch ${d.vs.sperr}-mal auf Gegner, die sich im Schussfeld im Offenen bewegen.` },
  { k: 'stuck', sym: 'festgefahren', name: 'Festgefahren', on: (u, d) => d.vs.stuck > 0, text: (u, d) => `${TYPES[u.type].stecken ? 'Hängt mit der schweren Rüstung fest' : 'Im Schlamm stecken geblieben'}: kann noch ${upRunden(Math.max(1, (u.stuck || 1) - 1))} nicht ziehen.` },   // M4: Kürassier eigener Text
  { k: 'gas', sym: 'gas', name: 'Im Gas', on: (u, d) => d.vs.gassed, text: () => `Vom Gas getroffen: je Runde in der Wolke Stärke −${fmt(P.GAS_STR)} und Moral −${fmt(P.GAS_MOR)}, Angriffe ${xf(P.GAS_ATK)}. Wirkt nach dem Verlassen der Wolke noch ${P.POISON_TURNS} Runden nach (vergiftet).` },
  { k: 'poison', sym: 'gas', ring: '#7FA04A', name: 'Vergiftet', on: (u, d) => d.vs.poison > 0 && !d.vs.gassed, text: (u, d) => `Hat Gas abbekommen: verliert noch ${upRunden(d.vs.poison)} Stärke und Moral, als Nächstes Stärke −${fmt(P.GAS_STR * P.POISON_K[Math.min(d.vs.poison, P.POISON_K.length) - 1])} und Moral −${fmt(P.GAS_MOR * P.POISON_K[Math.min(d.vs.poison, P.POISON_K.length) - 1])}. Ein Sanitäter kann die Vergiftung heilen.` },
  { k: 'shaky', sym: 'gebrochen', name: 'Moral wankt', on: (u, d) => !d.vs.rout && d.mor < P.FALLBACK_MOR && TYPES[u.type].cls !== 'art', text: () => `Moral unter ${fmt(P.FALLBACK_MOR)}: Beim nächsten Treffer weicht die Einheit zurück.` },
  { k: 'held', sym: 'nahkampf', name: 'Gebunden', on: u => TYPES[u.type].rng > 0 && !TYPES[u.type].flame && E.active(u) && E.held(G, u), text: () => 'Ein gleich großer Gegner steht daneben: Schießen geht nicht, nur Nahkampf.' },
  { k: 'limber', sym: 'aufprotzen', name: 'Aufgeprotzt', on: u => u.limbered, text: () => `Angespannt: zieht ${felder(P.LIMBER_MV)}, feuert aber nicht. Abprotzen bringt das Geschütz in Stellung.` },
  { k: 'mgdown', sym: 'mg_ab', name: 'MG abgebaut', on: (u, d) => TYPES[u.type].mg && !d.vs.setup && E.active(u), text: () => 'Marschbereit: kann ziehen, aber nicht schießen. Aufbauen kostet 1 Aktion, dann feuert es und kann Sperrfeuer geben.' },
  { k: 'mgup', sym: 'mg_auf', name: 'MG aufgebaut', panel: true, on: (u, d) => TYPES[u.type].mg && d.vs.setup && E.active(u), text: () => 'In Stellung: schießt oder gibt Sperrfeuer, kann aber nicht ziehen. Abbauen kostet 1 Aktion.' },   // nur im Panel (Karte: nur „abgebaut“ als Zustand)
  { k: 'kuehl', sym: 'sanduhr', ring: '#9aa3ab', name: 'MG kühlt ab', on: u => TYPES[u.type].dauerfeuer && u.kuehl > 0 && E.alive(u), text: u => u.kuehl > 1 || u.side !== G.side ? 'Nach dem Dauerfeuer: Das MG schießt in der nächsten eigenen Runde nicht. Ziehen und Nahkampf gehen.' : 'Nach dem Dauerfeuer: Das MG schießt in dieser Runde nicht. Ziehen und Nahkampf gehen.' },
  { k: 'dfBereit', sym: 'garbe', ring: '#E2B04A', name: 'Dauerfeuer bereit', panel: true, on: u => E.dauerOk(u) && u.side === G.side && E.active(u), text: () => 'Dauerfeuer: noch eine Salve in dieser Runde (gleiches oder anderes Ziel). Danach kühlt das MG eine eigene Runde lang ab.' },
  { k: 'ow', sym: 'feuerbereit', name: 'Feuerbereit', on: u => u.ow, text: () => `Schießt in der gegnerischen Runde auf den ersten Gegner, der sich in Reichweite bewegt (Schaden ${xf(P.OW_DMG)}).` },
  { k: 'zeal', sym: 'sturmbefehl', name: 'Sturmbefehl', on: u => u.zeal, text: () => `Befehl des Anführers: Nahkampf ${xf(P.ORDER_ATK)} in dieser Runde.` },
  { k: 'lance', sym: 'sprenglanze', name: 'Sprenglanze bereit', panel: true, on: (u, d) => d.vs.lance && E.active(u), text: () => `Der erste Nahkampfangriff der Schlacht trifft mit der Sprenglanze ${xf(P.BLAST_LANCE)}. Danach normale Lanze.` },
  { k: 'lanceGone', sym: 'pferd', name: 'Sprenglanze verbraucht', panel: true, on: (u, d) => TYPES[u.type].blastLance && !d.vs.lance && E.active(u), text: () => 'Die Sprenglanze ist verbraucht: weiter mit der normalen Lanze.' },
  { k: 'dug', sym: 'schaufel', ring: '#8a6a44', name: 'Eingegraben', on: (u, d) => d.vs.dug && E.active(u), text: () => `Hat sich eingegraben: Abwehr ${xf(P.DIG_DEF)}. Zum Ziehen erst ausgraben.` },
  { k: 'shields', sym: 'schild', ring: '#9aa3ab', name: 'Schilde vor', on: (u, d) => d.vs.shields && E.active(u), text: () => `Schilde vor: eigene Einheiten in den Nachbarfeldern nehmen bis zum nächsten eigenen Zug Beschuss ${xf(P.SHIELDS)}.` },
  { k: 'fireFree', sym: 'feuerfrei', ring: '#E2B04A', name: 'Feuer frei', on: (u, d) => d.vs.fireFree && E.alive(u), text: () => `Befehl des Hauptmanns: Fernkampf ${xf(P.FIRE_FREE)} bis zum nächsten eigenen Zug.` },
  { k: 'hold', sym: 'halten', ring: '#C2A461', name: 'Halten um jeden Preis', on: (u, d) => d.vs.hold && E.active(u), text: () => `Befehl des Generals: flieht bis zum nächsten eigenen Zug nicht, Abwehr ${xf(P.HOLD_DEF)}.` },
  { k: 'planted', sym: 'fahne', ring: '#C2A461', name: 'Banner steht', on: (u, d) => d.vs.planted && E.active(u), text: () => `Aufgepflanzt: wirkt ${felder(P.BANNER_R_PLANTED)} weit, dort flieht niemand. Der Träger zieht nicht, bis er das Banner aufnimmt.` },
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
// SP-1 (84.2): Feldsymbole (Geländehinweis, BP-Kosten, Weg, Marken, Kopfzeichen) wachsen mit dem Zoom, aber nur zwischen SYM_MIN und SYM_MAX Bildschirm-Pixeln Feldgröße; Rückweg window.SYM_ALT
const SYM_MIN = 90, SYM_MAX = 140;   /* ST1 (115.7): Obergrenze 220 → 140 – nah herangezoomt nicht mehr riesig */   // gemessen: Feldgröße ganze Karte ≈ 51 px, Zoom 1 ≈ 154 px, Zoom 2,6 ≈ 400 px
function symS(g, s) { const a = g && g.getTransform ? Math.hypot(g.getTransform().a, g.getTransform().b) || 1 : 1, px = s * a; window.__symPx = px; if (window.SYM_ALT) return s; return Math.max(SYM_MIN, Math.min(SYM_MAX, px)) / a; }
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
function warnMark(x, y, R, n) { if (VIEW.up) VIEW.up(x, y); const g = ctx; R = R * symS(g, L.s) / L.s; g.save(); g.beginPath(); g.moveTo(x, y - R); g.lineTo(x + R * 1.08, y + R * 0.82); g.lineTo(x - R * 1.08, y + R * 0.82); g.closePath();
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
const MUZ = { konkordat_ordensschreiter_posen_2: [0.62, 0.37], konkordat_ordensschreiter_posen2_1: [0.38, 0.68], konkordat_ordensschreiter_posen_1: [0.36, 0.66], konkordat_turmschreiter_posen_1: [0.975, 0.555], aschenwacht_saegeschreiter_posen_2: [0.83, 0.38], aschenwacht_klauenschreiter_posen_2: [0.8, 0.35], aschenwacht_saegeschreiter_posen2_1: [0.98, 0.5], aschenwacht_klauenschreiter_posen2_1: [0.83, 0.54], /* Schreiter-Posen (2026-11-22, gemessen) */ konkordat_kreuzschreiter_posen_2: [0.82, 0.49], aschenwacht_eisenknecht_posen_2: [0.984, 0.487], aschenwacht_eisenknecht_posen2_2: [0.998, 0.589], konkordat_held_posen2_1: [0.998, 0.163], aschenwacht_panzerbuechse: [0.998, 0.595], aschenwacht_panzerbuechse_posen_1: [0.999, 0.30], konkordat_general_posen_3: [0.996, 0.151], aschenwacht_general_posen2_1: [0.998, 0.232],   /* Runde 2 (2026-11-21) */ mg_A: [0.99, 0.401], mg_D: [0.99, 0.306], mg_F: [0.99, 0.316], konkordat_mg: [0.995, 0.267], aschenwacht_mg: [0.995, 0.472],
  konkordat_kreuzschreiter_neu: [0.632, 0.513], aschenwacht_eisenknecht_neu: [0.88, 0.61],
  // F16/F47 (2026-11-20): Rohrende statt Sehschlitz/Brust – Landkoloss-Kanone, Sturmpanzer, Turmschreiter-Turm-MG, Säge-/Klauenschreiter-Drehlauf
  konkordat_koloss: [0.875, 0.43], aschenwacht_panzer: [0.937, 0.41] /* ST1 (115.9): neuer Panzer, Bugkanone */, konkordat_turmschreiter: [0.99, 0.31], aschenwacht_saegeschreiter: [0.995, 0.48], aschenwacht_klauenschreiter: [0.99, 0.47] };
// Mündung je Figurenbild eines Trupps (Posen): F47 Eiserne Hünen (schweres MG auf Hüfthöhe, nicht Brust), Löwenoger-Flinte
const MUZ_FIG = { /* K12 (2026-11-22): Schuss-Posen gemessen (rechteste Laufspitze im oberen Bildteil, tools-Probe muz.py; Schildwall verdeckt, nicht gemessen) */ konkordat_soldat_2: [1, 0.164], aschenwacht_soldat_2: [1, 0.199], konkordat_soldat_3: [1, 0.183], aschenwacht_soldat_3: [1, 0.243], konkordat_pionier_posen2_1: [1, 0.147], aschenwacht_pionier_posen2_1: [1, 0.229], konkordat_pionier_posen2_2: [1, 0.172], aschenwacht_pionier_posen2_2: [1, 0.27], aschenwacht_gasschutz_posen_1: [1, 0.18], aschenwacht_gasschutz_posen_3: [1, 0.266], konkordat_kampfanzug_posen_3: [1, 0.243], aschenwacht_kampfanzug_posen_3: [1, 0.267], konkordat_scharfschuetze_posen_1: [1, 0.667], konkordat_scharfschuetze_posen_3: [0.996, 0.253], aschenwacht_pirschjaeger_posen_1: [1, 0.553], aschenwacht_pirschjaeger_posen_2: [1, 0.219], konkordat_flammen_posen_2: [1, 0.203] /* U4 Teil 2: neu */, aschenwacht_flammen_posen_2: [1, 0.413] /* U4 Teil 2: neu */, konkordat_hauptmann_posen_2: [1, 0.133], aschenwacht_hauptmann_posen_2: [0.997, 0.147],
  aschenwacht_eiserne_huenen_1: [0.99, 0.71], aschenwacht_eiserne_huenen_2: [0.99, 0.475],
  aschenwacht_eiserne_huenen_posen_1: [0.998, 0.698], aschenwacht_eiserne_huenen_posen_3: [0.935, 0.80], konkordat_loewenoger_posen_3: [0.92, 0.237], konkordat_loewenoger_2: [0.93, 0.315] /* U4: neu3 */, konkordat_mg_trupp_1: [1, 0.107], aschenwacht_mg_trupp_1: [1, 0.185], aschenwacht_panzerbuechse_trupp_1: [1, 0.6], konkordat_scharfschuetze_trupp_1: [1, 0.69] /* U4 Teil 3 */, aschenwacht_banner_posen3_1: [0.997, 0.366] };   // Runde 2 (2026-11-21): Hüftfeuer, kniend, Schrot angelegt   // Stufe 3: Rohr im Löwenmaul; vordere Doppelkanone an der Faust
const MUZ2 = { konkordat_turmschreiter_posen_1: [0.49, 0.71], konkordat_kreuzschreiter_posen2_2: [0.64, 0.1], aschenwacht_eisenknecht_posen_2: [0.984, 0.526], konkordat_kreuzschreiter_neu: [0.02, 0.835], aschenwacht_panzer: [0.695, 0.10] };   // F59 (2026-11-20): Bord-MG = mittlere Bordschützen-Luke des Sturmpanzers   // Zweitwaffe: Unterarm-Kanone am linken Arm des Kreuzschreiters (fxSeite)
function drawUnit(u, d) {
  d.muz = null; d.fbx = [];   // Mündung (falls gemessen) und Kästen der gezeichneten Figuren, relativ zur Einheit
  const T = TYPES[u.type], k = figU(u), s = L.s, flip = facesLeft(d.face) ? 1 : 0, acc = FIG.PAL[u.side].accent;
  let x = d.x, y = d.y;
  if (d.lunge) { x += d.lunge.dx; y += d.lunge.dy; }
  if (d.shake > 0) x += Math.sin(now / 22) * s * 0.05;
  const g = ctx, A0 = d.alpha * (d.vs.rout ? 0.75 : 1) * (areaNow && areaNow.ok && !areaNow.ok(u) ? 0.4 : 1);   // Wirkungsbereich: nicht Betroffene abgedunkelt
  const isSel = sel && sel.id === u.id;
  const own = human(u.side) && G.side === u.side && E.active(u);
  const done = own && spent.has(u.id) && (u.id !== handelnd || (!busy && !shells.length && !tracers.length && !muzzles.length));   // F57 (2026-11-20): schon fertige Einheiten bleiben grau, während eine andere handelt; nur die handelnde wird erst nach ihren Effekten grau
  const ready = own && !busy && !G.over && !spent.has(u.id) && !placing;   // kann in dieser Runde noch handeln
  // Standplatz: dunkler Bodenschatten und dünner Ring in gedämpfter Fraktionsfarbe (keine knalligen Flächen)
  const RS = 0.72, RA = 0.55;   // Ringe kleiner und dezenter, Figuren stehen auf dem Boden statt auf einer Scheibe
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
  const nf = newFigs(u, d);
  if (nf) { const w = d.wipp, sk = d.shake > 0 && TYPES[u.type].cls === 'walker' ? Math.sin(now / 26) * s * 0.035 : 0;   // F73: Wippen beim Gehen, Wanken bei Treffern
    topY = drawNewFigs(g, u, d, nf, x + (w ? w.dx : 0) + sk, y + (w ? w.dy : 0), flip, A0, done); }
  else {
  const slots = SLOTS[k] || SLOTS[T.cls] || SLOTS.inf;   // neue Typen ohne alte Zeichnung (z. B. Löwenoger), solange ihr Bild lädt
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
  else if (GBW && gbAn() && !window.FLACH_ALT && G.map[u.c] && G.map[u.c][u.r] && G.map[u.c][u.r].t === 'trench') MARKQ.push(() => drawMarks(u, d, x, y, own, done, acc));   // G7f: im Graben Leisten und Punkte nach den Geländeteilen (sonst überdeckt)
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
function sandsackBogen(g, x, y, s) {   // Sandsäcke als Bogen vor der Einheit: Stücke der Grabenkante entlang einer halben Ellipse, von den Seiten zur Mitte (vorn zuletzt)
  const im = GBIM && GBIM.graben_kante_vorn; if (!im || !im.naturalWidth) return false;
  const k = Math.max(0.55, kAt(x, y)), rx = s * 0.62, ry = s * 0.34 * k, h = s * 0.34, n = 7, teile = [];
  for (let i = 0; i < n; i++) { const a = Math.PI * (0.06 + 0.88 * i / (n - 1)); teile.push([x - Math.cos(a) * rx, y + s * 0.02 + Math.sin(a) * ry, a]); }
  teile.sort((p, q) => p[1] - q[1]);
  const w = rx * 2 * Math.PI / 2 / (n - 1) * 1.25, sw = Math.min(im.naturalWidth, im.naturalHeight * w / h);
  g.save(); for (const [px, py, a] of teile) { const off = ((a * 997) % 1 + 1) % 1 * Math.max(1, im.naturalWidth - sw);
    g.fillStyle = 'rgba(6,4,3,0.35)'; g.beginPath(); g.ellipse(px, py + h * 0.02, w * 0.55, h * 0.12, 0, 0, 7); g.fill();
    g.drawImage(im, off, 0, sw, im.naturalHeight, px - w / 2, py - h, w, h); }
  g.restore(); return true;
}
function drawMarks(u, d, x, y, own, done, acc) {
  const g = ctx, s = symS(ctx, L.s);   /* SP-1 (84.2) */
  if (d.vs && d.vs.planted && E.active(u)) drawPlanted(g, s, u, x, y);
  if (d.vs && d.vs.dug && E.active(u) && sandsackBogen(g, x, y, s)) {}   // F36 (2026-11-20): halbrunder Sandsackwall vor eingegrabenen Trupps (Sandsack-Kante der Gräben)
  else if (d.vs && d.vs.dug && E.active(u)) { const k = kAt(x, y), fy = y + s * 0.42 * k;   // eingegraben: kleiner Erdwall vor der Einheit (Ersatz, solange das Bild fehlt)
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
  // F52 (2026-11-20): Moral als dünner knochenweißer Balken direkt unter dem Leben; wankend flackert er, auf der Flucht schmutzig grau
  const mh = Math.max(2, bh * 0.42), my0 = by + bh + Math.max(1, bh * 0.18), mq = Math.max(0, Math.min(1, d.mor / Math.max(1, TYPES[u.type].mor))), flieht = d.vs && d.vs.rout, wankt = !flieht && d.mor < P.FALLBACK_MOR;
  { g.save(); g.fillStyle = 'rgba(18,13,11,0.85)'; g.fillRect(bx - 1, my0 - 1, bw + 2, mh + 2);
    if (mq > 0.01) { g.globalAlpha *= wankt ? 0.55 + 0.45 * Math.abs(Math.sin(now / 160)) : 1; g.fillStyle = flieht ? '#7d776a' : '#E6DCC0'; g.fillRect(bx, my0, bw * mq, mh); }
    g.restore(); }
  MARKS.push({ x0: bx - 3, y0: by - 4, x1: bx + bw + 3, y1: my0 + mh + 2, u, kind: 'hp' });
  if (own) {   // Fahrplan 2: Bewegungspunkte als kleine Punkte (hell = übrig), daneben die Aktionsmünze (+ kleine Münze der Zweitwaffe)
    const aus = d.vs.broken || d.vs.supp, ap = aus ? 0 : (u.ap || 0), bp = aus ? 0 : (u.bp || 0), bm = Math.max(E.bpMax(u), bp), r = Math.max(4, s * 0.068), rb = Math.max(2.6, s * 0.036), py = my0 + mh + r + 2;   // F61 (2026-11-20): größer – Bewegungspunkte als Punkte, Aktion als Münze   // F52: unter dem Moralbalken
    const zw = TYPES[u.type].zweit, wB = bm * rb * 2.3, w = wB + r * 2.6 + (zw ? r * 2 : 0); let cx = x - w / 2 + rb;
    for (let i = 0; i < bm; i++) { g.beginPath(); g.arc(cx, py, rb, 0, 7); g.fillStyle = i < bp ? '#E8DDB8' : '#2A221C'; g.fill(); g.lineWidth = Math.max(1, rb * 0.45); g.strokeStyle = '#120D0B'; g.stroke(); cx += rb * 2.3; }
    const coin = (rr, voll) => { const im = UPI[voll ? 'muenze' : 'muenzeLeer']; cx += rr; if (im) g.drawImage(im, cx - rr, py - rr, rr * 2, rr * 2); else { g.beginPath(); g.arc(cx, py, rr, 0, 7); g.fillStyle = voll ? '#C2A461' : '#221B18'; g.fill(); g.lineWidth = Math.max(1, rr * 0.3); g.strokeStyle = '#120D0B'; g.stroke(); } cx += rr + r * 0.3; };
    cx += r * 0.4 - rb; coin(r, ap >= 1); if (zw) coin(r * 0.7, !u.zw && !aus);
    if (!aus && ap < 1 && bp > 0 && UPI.s_stiefel && G.side === u.side) {   // Aktion verbraucht, aber noch BP: Stiefel mit Zahl (Spieltest Runde 3, Punkt 32)
      const bx2 = x + w / 2 + r * 1.6, pz = 0.75 + 0.25 * Math.sin(now / 300); g.globalAlpha = pz; drawSym(g, UPI.s_stiefel, bx2, py, r * 1.25, '#E8DDB8'); g.globalAlpha = 1;
      g.font = `400 ${Math.round(r * 1.7)}px "Arm Ziffer", "Arm Text", system-ui, sans-serif`; g.textAlign = 'left'; g.textBaseline = 'middle'; g.lineWidth = Math.max(2, r * 0.45); g.strokeStyle = '#120D0B'; g.strokeText(String(bp), bx2 + r * 1.35, py); g.fillStyle = '#E8DDB8'; g.fillText(String(bp), bx2 + r * 1.35, py); }
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
    const R2 = Math.max(9, s * 0.15), cx = bx - R2 - 3, cy = mid - R2 * 0.3, pz = 0.5 + 0.5 * Math.sin(now / 260);   // F22 (2026-11-20): kein großer Leuchtkreis mehr, kleine dunkle Plakette
    drawSym(g, UPI['s_niedergehalten'], cx, cy, R2, `rgba(${Math.round(170 + 50 * pz)},${Math.round(56 + 20 * pz)},40,1)`);
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
let lastT = 0, STEP = 1, FS = 1, stopBis = 0;   // stopBis: kurzer Stillstand im Treffer (F86), Effekte frieren ein
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
function heilZeichen(g, x, y, id, rep) {   // 3 kleine Zeichen steigen nacheinander auf und verblassen (Punkt 20, 2026-11-24)
  const s = L.s; for (let i = 0; i < 3; i++) { const t = ((now / 1500) + i / 3 + id * 0.13) % 1, a = Math.sin(t * Math.PI), xx = x + s * (i - 1) * 0.22 + Math.sin(t * 6 + i) * s * 0.03, yy = y - t * s * 0.5, R = s * (0.07 + 0.02 * (1 - t));
    g.save(); g.globalAlpha = a * 0.95;
    if (rep && UPI.s_schraubenschluessel) drawSym(g, UPI.s_schraubenschluessel, xx, yy, R * 1.5);
    else { const q = R * 0.36; g.beginPath(); for (const [px, py] of [[-q, -R], [q, -R], [q, -q], [R, -q], [R, q], [q, q], [q, R], [-q, R], [-q, q], [-R, q], [-R, -q], [-q, -q]]) g.lineTo(xx + px, yy + py); g.closePath(); g.lineJoin = 'round'; g.lineWidth = Math.max(2, s * 0.03); g.strokeStyle = 'rgba(20,16,12,0.85)'; g.stroke(); g.fillStyle = i === 1 ? '#B4453A' : `rgb(${BONE})`; g.fill(); }
    g.restore(); } }
function grabenUmriss(c, r, rgba, lw, dash) {   // G7f (Fable 5): auf Grabenfeldern Umriss von Zone/Zugbereich nach den Geländeteilen noch einmal als Linie (sonst zerstückelt)
  if (window.FLACH_ALT || !GBW || !gbAn() || !G.map[c] || !G.map[c][r] || G.map[c][r].t !== 'trench') return;
  const [x, y] = center(c, r), pts = []; for (let i = 0; i < 6; i++) pts.push(hexCorner(x, y, i, 0.9));
  MARKQ.push(() => { const g = ctx, P = pts.map(([a, b]) => proj(a, b)); if (P.some(q => q[2] <= 1)) return; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.beginPath(); P.forEach((q, i) => i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1])); g.closePath();
    g.strokeStyle = rgba; g.lineWidth = lw * (cv.width / 1920); if (dash) g.setLineDash(dash.map(v => v * (cv.width / 1920))); g.stroke(); g.restore(); });
}
function hexMark(c, r, o) {
  grabenUmriss(c, r, `rgba(${o.rgb},${o.soft ? 0.6 : 0.95})`, o.soft ? 2 : 3, o.dash ? [10, 7] : null);
  const g = ctx, s = L.s, pz = 0.5 + 0.5 * Math.sin(now / 320);
  hexPath(g, c, r, 0.9); g.fillStyle = `rgba(${o.rgb},${(o.fill ?? 0.14) + 0.05 * pz})`; g.fill();
  if (o.hatch) { g.save(); hexPath(g, c, r, 0.9); g.clip(); const [cx, cy] = center(c, r); g.strokeStyle = `rgba(${o.rgb},0.28)`; g.lineWidth = Math.max(1, s * 0.03); g.beginPath();
    for (let i = -6; i <= 6; i++) { const d = i * s * 0.2; g.moveTo(cx + d - s, cy + s); g.lineTo(cx + d + s, cy - s); } g.stroke(); g.restore(); }
  hexPath(g, c, r, 0.9); g.strokeStyle = `rgba(${o.rgb},${o.soft ? 0.45 : 0.85})`; g.lineWidth = Math.max(o.soft ? 1.2 : 2, s * (o.soft ? 0.025 : 0.05));
  if (o.dash) g.setLineDash([s * 0.14, s * 0.1]);
  g.stroke(); g.setLineDash([]);
  if (o.sym) { const [cx, cy] = center(c, r); MARKQ.push(() => { g.globalAlpha = 0.85 + 0.15 * pz; drawSym(g, o.sym, cx, cy - s * kAt(cx, cy) * (o.inHex ? 0.1 : 0.62), s * 0.2); g.globalAlpha = 1; }); }   // Symbol über den Figuren
}
// Bildschleife: der nächste Frame wird immer angemeldet, auch wenn das Zeichnen einmal scheitert (sonst friert das Bild ein
// und bleibt nach einer Größenänderung wie dem Vollbild leer). Gleiche Fehler werden nur einmal gemeldet.
const drawFehler = new Set();
function frame(t) {
  requestAnimationFrame(frame);
  STEP = lastT ? Math.min(4, Math.max(0.1, (t - lastT) / 16.667)) : 1; lastT = t; FS = t < stopBis ? 0 : STEP * speed; now = t;
  try { shakeStep(); areaNow = null; draw(); }
  catch (err) { const k = String(err && err.stack || err).slice(0, 300); if (!drawFehler.has(k)) { drawFehler.add(k); console.error('Zeichnen:', err); }
    ctx = MAINCTX; ctx.setTransform(1, 0, 0, 1, 0, 0); VIEW.up = null; VIEW.bbK = null; MARKQ.length = 0; }
}
function draw() {
  if (!L || !tcv) return;
  MARKS.length = 0;
  drawTilt();
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
  if (OPT.base > 0) {
    const st = [null, [0.16, 0.4, 0.022], [0.28, 0.6, 0.03], [0.42, 0.85, 0.04]][OPT.base];
    for (const u of G.units) { const d = DU.get(u.id); if (!d || d.alpha <= 0 || !E.alive(u)) continue;
      const c = FIG.PAL[u.side] ? FIG.PAL[u.side].accent : '#8a8070', rgb = [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16)), m = rgb.map(v => Math.round(v * 0.75 + 40));
      g.beginPath(); for (let i = 0; i < 6; i++) { const q = hexCorner(d.x, d.y, i, 0.93); i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]); } g.closePath();
      g.globalAlpha = d.alpha; g.fillStyle = `rgba(14,10,7,${st[0]})`; g.fill();
      g.lineWidth = s * st[2]; g.strokeStyle = `rgba(${m},${st[1]})`; g.stroke(); g.globalAlpha = 1; }
  }
  // Markierungen
  try { drawWache(g, s); } catch (err) { }   // F96: Schussfelder der Bereitschaft (auch ohne Auswahl)
  if (sel && human(G.side) && !busy) {
    // Bewegungsfelder dezent (Wunsch des Nutzers): halbdurchsichtige Fläche, Gelände bleibt sichtbar. Ziehen = Knochenweiß, Marsch/Rückzug = Messing.
    // Paket 2: Marschfelder (nur mit Marsch erreichbar, danach keine Aktion) deutlich in leichtem Gelb/Messing mit gestrichelter Kante
    if (!abilArea(areaAct)) for (const [, n] of reach) { grabenUmriss(n.c, n.r, n.march || n.retreat ? 'rgba(236,200,100,0.9)' : 'rgba(240,237,225,0.6)', 2, n.march || n.retreat ? [10, 7] : null); hexPath(g, n.c, n.r, 0.9); const far = n.march || n.retreat; g.fillStyle = far ? 'rgba(226,190,90,0.24)' : 'rgba(240,237,225,0.13)'; g.fill();
      if (far) { g.strokeStyle = 'rgba(18,13,11,0.55)'; g.lineWidth = Math.max(2, s * 0.05); g.stroke(); g.setLineDash([s * 0.11, s * 0.08]); g.strokeStyle = 'rgba(236,200,100,0.9)'; g.lineWidth = Math.max(1.5, s * 0.03); g.stroke(); g.setLineDash([]); }
      else { g.strokeStyle = 'rgba(240,237,225,0.4)'; g.lineWidth = Math.max(1, s * 0.025); g.stroke(); }
      if (G.map[n.c][n.r].t === 'wire') { hexPath(g, n.c, n.r, 0.8); g.strokeStyle = 'rgba(142,43,34,0.75)'; g.setLineDash([s * 0.08, s * 0.08]); g.lineWidth = Math.max(1.5, s * 0.035); g.stroke(); g.setLineDash([]); }
      { const nz = nachZug.get(E.key(n.c, n.r)); if (nz) { const [x0, y0] = center(n.c, n.r), yy = y0 + s * 0.55 * kAt(x0, y0), R0 = Math.max(6, s * 0.1);   // F60: was danach noch geht
        MARKQ.push(() => { const gg = ctx; const im = UPI[nz.art === 'sturm' ? 's_nahkampf' : nz.art === 'faehig' ? 's_' + (ABIL_SYM[TYPES[sel.type].abil] || 'blitz') : 's_gewehr'] || UPI.s_gewehr; gg.save(); if (nz.art === 'nichts') gg.globalAlpha = 0.75; drawSym(gg, im, x0, yy, R0, nz.art === 'nichts' ? '#6d6458' : '#C2A461');
          if (nz.art === 'nichts') { gg.lineCap = 'round'; gg.strokeStyle = '#120D0B'; gg.lineWidth = Math.max(3, R0 * 0.36); gg.beginPath(); gg.moveTo(x0 - R0 * 0.7, yy + R0 * 0.7); gg.lineTo(x0 + R0 * 0.7, yy - R0 * 0.7); gg.stroke(); gg.strokeStyle = '#C8402C'; gg.lineWidth = Math.max(1.6, R0 * 0.2); gg.stroke(); }
          gg.restore(); }); } } }
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
    { const sym = sel && (feldArt === 'cut' ? UPI.s_drahtschere : feldArt === 'zweit' ? UPI.s_garbe : feldArt === 'faust' ? UPI.s_granate_artillerie : TYPES[sel.type].abil && UPI['s_' + (ABIL_SYM[TYPES[sel.type].abil] || 'blitz')]);
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
    if (hilfeAn('send')) for (const id of sendSet) { const hu = unitById(id); hexMark(hu.c, hu.r, { rgb: BONE, dash: true, sym: UPI.s_meldehund }); }
    if (hilfeAn('rec')) for (const id of recSet) { const hu = unitById(id); hexMark(hu.c, hu.r, { rgb: BRASS, sym: UPI.s_schraubenschluessel }); }
    if (hilfeAn('heal')) for (const id of healSet) { const hu = unitById(id); hexMark(hu.c, hu.r, { rgb: BONE, sym: UPI.s_sanitaeter }); }
    if (healSet.size) { const gg = ctx; for (const id of healSet) { if (!DU.get(id)) continue; const [hx, hy] = headPos(id), rep = TYPES[unitById(id).type].cls === 'walker'; MARKQ.push(() => heilZeichen(gg, hx, hy, id, rep)); } }   // Punkt 20: wer jetzt versorgt werden kann – aufsteigende Pluszeichen (Fahrzeuge: Schraubenschlüssel), solange der Sanitäts-/Versorgungstrupp gewählt ist
    for (const [, t] of targets) { const u = unitById(t.id), fire = t.kind === 'fire'; hexMark(u.c, u.r, { rgb: fire ? BRASS : LIFE, fill: 0.2, sym: UPI[fire ? 's_zielen' : 's_nahkampf'] }); }
    // Ziele in Schussreichweite: Messing-Eckklammern um die Figur (obenauf)
    for (const [, t] of targets) if (t.kind === 'fire' || t.both) { const u = unitById(t.id), [x, y] = center(u.c, u.r); MARKQ.push(() => brackets(x, y - s * 0.38, s * 0.6, '#C2A461')); }
    // Vorschau vom erreichbaren Feld unter Maus/Finger
    { const hk = hoverHex && E.key(hoverHex[0], hoverHex[1]), pv = hk != null && !abilMode && reach.has(hk) && !(hoverHex[0] === sel.c && hoverHex[1] === sel.r) && previewFrom(hoverHex[0], hoverHex[1]);
      if (pv) { const [hx, hy] = center(pv.c, pv.r);   // Zeichnen auf ctx (beim Abarbeiten von MARKQ die Hauptfläche), nicht auf das Weltbild g – sonst unsichtbar in der neuen Ansicht
        MARKQ.push(() => { const g = ctx; for (const f of pv.threat) { const [x, y] = center(f.c, f.r); if (VIEW.up && !VIEW.up(x, y)) continue; g.beginPath(); gEllipse(g, x, y, s * 0.76, s * 0.76); g.lineWidth = Math.max(4, s * 0.075); g.strokeStyle = 'rgba(18,13,11,0.6)'; g.stroke();
          g.setLineDash([s * 0.09, s * 0.07]); g.lineWidth = Math.max(2, s * 0.035); g.strokeStyle = RANGE_COL; g.stroke(); g.setLineDash([]); } });   // Gegner mit Schussfeld auf das Feld: gestrichelt umrandet (obenauf, sonst verdeckt der Bodenschatten)
        MARKQ.push(() => { const g = ctx; g.save(); g.lineCap = 'round';
          for (const f of pv.hit) { const [x, y] = center(f.c, f.r); g.setLineDash([s * 0.06, s * 0.09]); g.strokeStyle = 'rgba(18,13,11,0.6)'; g.lineWidth = Math.max(3.5, s * 0.05); g.beginPath(); pathLine(g, hx, hy - s * 0.3, x, y - s * 0.3); g.stroke();
            g.strokeStyle = 'rgba(194,164,97,0.95)'; g.lineWidth = Math.max(1.6, s * 0.025); g.stroke(); g.setLineDash([]); drawSym(g, UPI.s_zielen, x + s * 0.42, y - s * 0.95, s * 0.19); }
          g.restore();
          if (pv.threat.length) warnMark(hx - s * 0.5, hy - s * kAt(hx, hy) * 0.92, s * 0.22, pv.threat.length);
          if (pv.cov) drawShield(g, hx + s * 0.5, hy - s * kAt(hx, hy) * 0.92, s * 0.36, pv.cov);
          try { drawFeldWirkung(g, hx, hy + s * kAt(hx, hy) * 0.42, pv.fx, s); } catch (err) { hinweisFehler(err); } });   // Geländehinweis unter dem Feld
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
    { const w = aufstellWahl || (inspect && inspect.unit && inspect.unit.side === G.aufstellung ? inspect.unit : null), T = w && TYPES[w.type], h = !w ? null : aufstellZiel ? aufstellZiel.h : hoverHex && E.canPlaceStart(G, w, hoverHex[0], hoverHex[1]) ? hoverHex : [w.c, w.r];   // Punkt 2 (2026-11-24): Reichweite bzw. Schussfeld von dem Feld aus, über dem Maus/Finger steht
      if (w && T && T.rng && h) { const pr = Object.assign({}, w, { c: h[0], r: h[1] }), rw = T.rng + (G.map[h[0]][h[1]].ridge ? 1 : 0);
        for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) { const dd = E.dist(h[0], h[1], c, r); if (dd < 1 || dd > rw || !E.hasLOS(G, h[0], h[1], c, r)) continue; if ((T.mg || TYPES[w.type].cls === 'walker') && !E.inFan(G, pr, c, r)) continue;
          hexMark(c, r, { rgb: BRASS, fill: 0.1, soft: true }); } } }
    if (aufstellZiel) hexMark(aufstellZiel.h[0], aufstellZiel.h[1], { rgb: aufstellZiel.ok ? '120,220,110' : '200,64,44', fill: 0.45 }); }
  if (placing) for (const k of spawnSet) hexMark(Math.floor(k / 100), k % 100, { rgb: '96,196,92', fill: 0.3 });   // Aufstellungsfelder für Nachschub grün (Spieltest Runde 2, Punkt 15)
  if (hoverHex) {
    hexPath(g, hoverHex[0], hoverHex[1], 0.95); g.strokeStyle = 'rgba(255,250,225,0.55)'; g.lineWidth = Math.max(1.5, s * 0.04); g.stroke();
    if (sel && TYPES[sel.type].cls === 'art' && shellHexes.has(E.key(hoverHex[0], hoverHex[1])) && artMode !== 'he') {
      const cells = artMode === 'gas' ? E.gasCells(G, hoverHex[0], hoverHex[1]) : E.barrageCells(G, sel, hoverHex[0], hoverHex[1]);
      for (const [c, r] of cells) { hexPath(g, c, r, 0.9); g.fillStyle = artMode === 'gas' ? 'rgba(196,214,70,0.45)' : 'rgba(255,120,60,0.4)'; g.fill(); }
    }
  }
}
// MG-Schussfächer (Regel E.inFan): ausgefächerte Fläche am Boden, Ochsenblut zur Mitte, nach außen in Messing auslaufend,
// gestrichelte Fächerkanten; Felder in Reichweite innerhalb des Fächers dezent umrandet. Blickrichtung aus dem Anzeige-Zustand.
function drawFan(g, u, zweit) {   // zweit: Schussfeld der Seitenwaffen (Fahrzeuge/Schreiter), heller in Messing
  if (!u || !G.map[u.c] || !G.map[u.c][u.r]) return;   // Einheit außerhalb der Karte (z. B. entfernt): nichts zeichnen
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
const WIMPEL_TUCH = [0.105, 0.075, 0.895, 0.855];   // Tuch im Wimpel-Bild UP.pA/pD/pF (nach dem Kürzen der Stange auf 80 %): x, y, Breite, Höhe als Anteil
const FAHNE_VOR = new Set(['village', 'rubble', 'fabrik', 'kirche', 'schiff', 'turm']), FAHNE_K = 0.68, FAHNE_FARBE = { A: [150, 38, 28], D: [92, 104, 88], F: [96, 136, 190] }, FAHNE_NEUTRAL = [128, 104, 64];   // Punkt 13 (2026-11-24): größer, Farben satter, neutral ockerbraun (klar anders als Feldgrau und auf Schnee sichtbar)
// Ort der Fahne im Feld (Feldradien): sonst hinterer rechter Rand (hinter den Einheiten); in Ruinenfeldern vorn links (Stoff weht über das Feld, Einheiten davor),
// weil hohe Mauern (eigene und die des rechten Nachbarfelds) sie hinten verdecken würden. [dx, dy, Tiefe für die Sortierung]
const fahneOrt = o => { const h = G.map[o.c] && G.map[o.c][o.r]; if (/schanze/i.test(o.id) && GBW && gbAn()) return [0.95, 0.5, 0.5, 0.62];   // Schanze: vorn rechts neben dem Bunker (dahinter wäre das Schild verdeckt)
  return h && FAHNE_VOR.has(h.t) ? [-0.45, 0.42, -0.02, 0.92] : [0.6, -0.45, -0.5, 0.62]; };   // [dx, dy, Tiefe, Höhe des Nummernschilds am Pfahl]
function drawFahne(g, s, x, y, o) {
  const sd = VIS.ctrl[o.id], [cr, cg, cb] = sd ? FAHNE_FARBE[fac(sd)] || FAHNE_NEUTRAL : FAHNE_NEUTRAL, sh = (v, k) => Math.round(Math.max(0, Math.min(255, v * k)));
  const col = k => `rgb(${sh(cr, k)},${sh(cg, k)},${sh(cb, k)})`, seed = o.c * 7 + o.r * 13;
  // 55 % der Vorschlagsgröße, am hinteren rechten Feldrand: verdeckt weder Figuren noch Ruinen (wird hinter den Einheiten gezeichnet)
  const [ox, oy] = fahneOrt(o), px0 = x + s * ox, base0 = y + s * oy * kAt(x, y), fk = FAHNE_K * Math.min(1.6, Math.max(1, Math.pow(1 / (CAM.z || 1), 0.5))); g.save(); g.translate(px0, base0); g.scale(fk, fk); g.translate(-px0, -base0);   // herausgezoomt etwas größer
  const px = px0, base = base0, H = s * 1.3, lean = s * 0.05, top = [px + lean, base - H];
  // Pfahl: grobes Holz, leicht schief, oben abgesplittert
  g.save(); g.lineCap = 'round';
  g.fillStyle = 'rgba(6,4,3,0.4)'; g.beginPath(); g.ellipse(px, base, s * 0.12, s * 0.04, 0, 0, 7); g.fill();
  { const rc = sd ? col(1.25) : `rgb(${BONE})`; g.lineWidth = Math.max(3, s * 0.07); g.strokeStyle = 'rgba(14,10,8,0.6)'; g.beginPath(); g.ellipse(px, base, s * 0.42, s * 0.13, 0, 0, 7); g.stroke();   // Bodenmarke am Fuß (Punkt 13): flacher Ring, Fraktionsfarbe bzw. Knochenweiß (neutral gestrichelt)
    g.lineWidth = Math.max(1.5, s * 0.035); g.strokeStyle = rc; if (!sd) g.setLineDash([s * 0.12, s * 0.07]); g.beginPath(); g.ellipse(px, base, s * 0.42, s * 0.13, 0, 0, 7); g.stroke(); g.setLineDash([]); }
  g.strokeStyle = O; g.lineWidth = Math.max(2.5, s * 0.11); g.beginPath(); g.moveTo(px, base); g.lineTo(top[0], top[1]); g.stroke();
  g.strokeStyle = '#5a4630'; g.lineWidth = Math.max(1.2, s * 0.055); g.beginPath(); g.moveTo(px, base); g.lineTo(top[0], top[1]); g.stroke();
  g.strokeStyle = 'rgba(150,120,80,0.55)'; g.lineWidth = Math.max(0.6, s * 0.014); g.beginPath(); g.moveTo(px - s * 0.01, base - s * 0.05); g.lineTo(top[0] - s * 0.012, top[1] + s * 0.1); g.stroke();
  // Stoff: weht nach rechts, Wellen nach Zeit, ausgefranstes Ende, zwei Risse
  // Erobert (2026-11-20): Wimpel der Fraktion aus ui-quelle/banner/wimpel.png (UP.pA/pD/pF) statt des getönten Tuchs; nur das Tuch des Bildes
  // (ohne die gemalte Stange, WIMPEL_TUCH als Anteil des Bildes), in senkrechten Streifen mit derselben Welle wie das Stofftuch
  const wim = sd && UPI['p' + fac(sd)], wimOk = wim && wim.complete && wim.naturalWidth, [wx, wy, ww, wh] = WIMPEL_TUCH;
  const fw = s * 0.82, fh = wimOk ? fw * (wh * wim.naturalHeight) / (ww * wim.naturalWidth) : s * 0.5, t = now / 700, N = 14, ay = top[1] + s * 0.04;
  const at = (u, v) => { const lx = top[0] - lean * (v * fh / H); const wv = Math.sin(u * 4.2 - t + seed) * s * 0.05 * u + u * u * s * 0.06; return [lx + u * fw, ay + v * fh + wv]; };
  const fray = u => (u > 0.82 ? Math.sin(u * 61 + seed) * 0.5 + 0.5 : 0) * s * 0.07;
  const shape = () => { g.beginPath(); for (let i = 0; i <= N; i++) { const u = i / N, [qx, qy] = at(u, 0); g[i ? 'lineTo' : 'moveTo'](qx, qy); }
    for (let j = 0; j <= 8; j++) { const v = j / 8, [qx, qy] = at(1, v); g.lineTo(qx - (Math.sin(v * 23 + seed) * 0.5 + 0.5) * s * 0.11, qy); }   // Fransen
    for (let i = N; i >= 0; i--) { const u = i / N, [qx, qy] = at(u, 1); g.lineTo(qx, qy - fray(u)); } g.closePath(); };
  if (wimOk) {   // Wimpel-Bild in 24 Streifen, jeder Streifen mit der Wellenhöhe seiner Stelle
    const iw = wim.naturalWidth, ih = wim.naturalHeight, M = 24;
    for (let i = 0; i < M; i++) { const u0 = i / M, u1 = (i + 1) / M, [x0, y0] = at(u0, 0), [x1] = at(u1, 0);
      g.drawImage(wim, (wx + ww * u0) * iw, wy * ih, ww * iw / M, wh * ih, x0, y0, x1 - x0 + 0.7, fh); }
    g.save(); g.beginPath(); for (let i = 0; i <= N; i++) { const [qx, qy] = at(i / N, 0); g[i ? 'lineTo' : 'moveTo'](qx, qy); } for (let i = N; i >= 0; i--) { const [qx, qy] = at(i / N, 1); g.lineTo(qx, qy); } g.closePath(); g.strokeStyle = 'rgba(14,10,8,0.8)'; g.lineWidth = Math.max(1.2, s * 0.03); g.stroke(); g.restore();   // kräftigere Kontur um den Wimpel (Punkt 13)
  } else {
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
  shape(); g.strokeStyle = 'rgba(14,10,8,0.9)'; g.lineWidth = Math.max(1.4, s * 0.034); g.stroke();
  }
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
  // Markierte Ziele der eigenen Seite: flacher Ring in Knochenweiß am Boden um die Figur, Striche nur nach außen (Punkt 6, Enrico 2026-11-23: nicht gelb, nicht über der Figur; gilt bis zum nächsten eigenen Zug)
  for (const k of VIS.marks || []) if (k.side === mySide) { const [x, y] = center(k.c, k.r); if (up && !up(x, y)) continue; const kk = kAt(x, y), pz = 0.6 + 0.15 * Math.sin(now / 420), R = s * 0.84;
    g.save(); g.globalAlpha = pz; g.strokeStyle = 'rgba(20,16,12,0.55)'; g.lineWidth = Math.max(3, s * 0.07); g.beginPath(); gEllipse(g, x, y, R, R); g.stroke();
    g.strokeStyle = `rgb(${BONE})`; g.lineWidth = Math.max(1.5, s * 0.03); g.setLineDash([s * 0.16, s * 0.07]); g.beginPath(); gEllipse(g, x, y, R, R); g.stroke(); g.setLineDash([]);
    g.lineWidth = Math.max(2, s * 0.04); g.beginPath(); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { g.moveTo(x + dx * R, y + dy * R * kk); g.lineTo(x + dx * s * 0.98, y + dy * s * 0.98 * kk); } g.stroke(); g.restore(); }
  for (const q of G.mines || []) if (q.side === mySide || q.known === mySide) { const [x, y] = center(q.c, q.r); if (up && !up(x, y)) continue; g.beginPath(); g.ellipse(x, y + s * 0.2, s * 0.17, s * 0.1, 0, 0, 7); g.fillStyle = '#5b5434'; g.fill(); g.strokeStyle = '#e6d48a'; g.lineWidth = Math.max(1.5, s * 0.04); g.stroke();
    if (q.side !== mySide && UPI.s_tellermine) { const gg = ctx, pz = 0.8 + 0.2 * Math.sin(now / 300), yy = y + s * 0.2 * kAt(x, y); MARKQ.push(() => { gg.globalAlpha = pz; drawSym(gg, UPI.s_tellermine, x, yy, s * 0.2, `rgb(${BONE})`); gg.globalAlpha = 1; }); } }   // entdeckte Minen des Gegners (Punkt 15): Tellerminen-Zeichen über allem, sonst verdecken Figuren und Teile sie
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
    else ringZeichne(g, s, rg, 'unten');
  }
  drawSchall(g, s, up); drawNimbus(g, s, up); drawHeldAura(g, s, up); drawGlut(g, s, up); drawHeldRinge(g, s, up);   // F82, Helden, F84, F86
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
  { const hk = hoverHex && E.key(hoverHex[0], hoverHex[1]), rushV = sel && human(G.side) && !busy && hk != null && abilMode && feldArt === 'abil' && TYPES[sel.type].abil === 'rush' && abilSet.has(hk) && E.rushPath(G, sel, hoverHex[0], hoverHex[1]);   // Punkt 8: Wegvorschau auch für den Sturmlauf (Warndreieck bei Mine, Draht, Gas …)
    const n = rushV ? { path: rushV, rest: null } : sel && human(G.side) && !busy && hoverHex && reach.get(hk);
    if (n && n.path && n.path.length) { const pts = [[sel.c, sel.r], ...n.path]; let warnAt = null;
      for (let i = 1; i < pts.length; i++) { const [c0, r0] = pts[i - 1], [c1, r1] = pts[i], [x0, y0] = center(c0, r0), [x1, y1] = center(c1, r1), hz = pathHazard(sel, c1, r1);
        if (hz && !warnAt) warnAt = [x1, y1, hz];
        for (const k of i === pts.length - 1 ? [0.5] : [0.5, 1]) { const x = x0 + (x1 - x0) * k, y = y0 + (y1 - y0) * k; if (up && !up(x, y)) continue;
          g.beginPath(); g.arc(x, y, Math.max(3, symS(g, s) * (k === 1 ? 0.075 : 0.055)), 0, 7); g.fillStyle = hz && k === 1 || hz && i === pts.length - 1 ? 'rgba(200,52,40,0.72)' : 'rgba(240,237,225,0.55)'; g.fill();
          g.lineWidth = Math.max(1, s * 0.018); g.strokeStyle = 'rgba(18,13,11,0.55)'; g.stroke(); } }
      if (n.rest != null) { const [c1, r1] = pts[pts.length - 1], [x, y] = center(c1, r1); if (!up || up(x, y)) {   // Rest-BP am Zielfeld (Fahrplan 2)
          const t = String(n.rest), R = Math.max(10, symS(g, s) * 0.19), yy = y + s * 0.05; g.beginPath(); g.arc(x, yy, R, 0, 7); g.fillStyle = n.march ? 'rgba(226,176,74,0.92)' : 'rgba(232,221,184,0.92)'; g.fill();
          g.lineWidth = Math.max(2, s * 0.035); g.strokeStyle = '#120D0B'; g.stroke(); g.font = `400 ${Math.round(R * 1.25)}px "Arm Ziffer", "Arm Text", system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#120D0B'; g.fillText(t, x, yy + R * 0.06); } }
      if (warnAt) { const [x, y, hz] = warnAt, ty = y - s * 0.55; if (!up || up(x, ty)) { const r = Math.max(9, symS(g, s) * 0.17);   // Warndreieck
          g.beginPath(); g.moveTo(x, ty - r); g.lineTo(x + r * 1.05, ty + r * 0.75); g.lineTo(x - r * 1.05, ty + r * 0.75); g.closePath(); g.fillStyle = '#C8342A'; g.fill(); g.lineWidth = Math.max(2, s * 0.04); g.strokeStyle = '#120D0B'; g.stroke();
          g.font = `900 ${Math.round(r * 1.2)}px "Arm Text", system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#F0EDE1'; g.fillText('!', x, ty + r * 0.12); } } } }
  if (wayPt && sel && human(G.side) && !busy) { const [x, y] = center(wayPt[0], wayPt[1]); if (!up || up(x, y)) { const kk = kAt(x, y), pz = 0.75 + 0.25 * Math.sin(now / 260);
      g.save(); g.globalAlpha = pz; g.beginPath(); gEllipse(g, x, y, s * 0.42, s * 0.42); g.lineWidth = Math.max(5, s * 0.1); g.strokeStyle = '#120D0B'; g.stroke(); g.lineWidth = Math.max(2.5, s * 0.05); g.strokeStyle = '#E2B04A'; g.stroke();
      g.globalAlpha = 1; g.font = `900 ${Math.round(s * 0.3)}px "Arm Text", system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineWidth = Math.max(3, s * 0.07); g.strokeStyle = '#120D0B'; g.strokeText('Wegpunkt', x, y - s * 0.62 * kk); g.fillStyle = '#E2B04A'; g.fillText('Wegpunkt', x, y - s * 0.62 * kk); g.restore(); } }
  // Sturmfelder (Spieltest Runde 3, Punkt 31): Zugfelder neben einem Gegner, von denen aus nach dem Zug noch gestürmt werden darf (höchstens halbe BP)
  if (sel && human(G.side) && !busy && TYPES[sel.type].atk > 0 && !sel.attacked && sel.ap >= 1 && UPI.s_nahkampf) {
    const frei = E.nahFrei({ type: sel.type, bpUsed: 99 }), halb = E.bpMax(sel) / 2;
    for (const n of reach.values()) { if (n.march || n.retreat || (!frei && (sel.bpUsed || 0) + n.cost > halb)) continue;
      if (!E.neighbors(n.c, n.r).some(([c, r]) => { const o = E.inMap(c, r) && E.unitAt(G, c, r); return o && o.side !== sel.side && E.alive(o); })) continue;
      const [x, y] = center(n.c, n.r); if (up && !up(x, y)) continue; drawSym(g, UPI.s_nahkampf, x + s * 0.42, y - s * 0.22, Math.max(7, s * 0.14), '#C8402C'); } }
  // Schrittzahlen
  g.textAlign = 'center'; g.textBaseline = 'middle';
  // Bewegungskosten nur am Feld unter dem Mauszeiger, klein
  { const n = sel && human(G.side) && !busy && hoverHex && !abilSet.has(E.key(hoverHex[0], hoverHex[1])) && reach.get(E.key(hoverHex[0], hoverHex[1]));
    if (n) { const [x, y] = center(n.c, n.r), t = n.march ? 'Marsch – danach keine Aktion mehr' : `${n.cost}${n.retreat ? ' · Rückzug' + fbTxt(sel) : ''}`, fs = Math.round(Math.max(14, s * 0.24)); if (up) up(x, y); const fs2 = Math.round(Math.max(14, symS(g, s) * 0.24)); const ty = y - s * kAt(x, y) * 0.45;
      g.font = `700 ${fs2}px "Arm Text", system-ui, sans-serif`; const tw = g.measureText(t).width, im = n.march ? UPI.s_marsch : UPI.s_stiefel || UPI.s_marsch, iw = im ? fs2 * 1.35 : 0, x0 = x - (tw + iw) / 2;
      if (im) { g.save(); g.filter = 'brightness(1.9) sepia(0.25) drop-shadow(1px 0 0 #F0EDE1) drop-shadow(-1px 0 0 #F0EDE1) drop-shadow(0 1px 0 #F0EDE1) drop-shadow(0 -1px 0 #F0EDE1) drop-shadow(0 2px 0 #120D0B)'; g.drawImage(im, x0, ty - iw / 2, iw, iw); g.restore(); }   // Stiefel: das ist der Weg, keine Warnzahl
      g.textAlign = 'left'; g.lineWidth = Math.max(3, s * 0.07); g.lineJoin = 'round'; g.strokeStyle = '#120D0B'; g.strokeText(t, x0 + iw + 2, ty); g.fillStyle = '#F0EDE1'; g.fillText(t, x0 + iw + 2, ty); g.textAlign = 'center'; } }
}
// Erwarteter Freischlag beim Rückzug (Vorschau), z. B. „ · Freischlag −6“
function fbTxt(u) { const f = u ? E.freeBlows(G, u) : []; return f.length ? ` · Freischlag −${fmt(f.reduce((a, b) => a + b.lo, 0))} bis −${fmt(f.reduce((a, b) => a + b.hi, 0))}` : ''; }
// Gefahr auf einem Wegfeld für die Pfadvorschau: 'draht' | 'gas' | 'feuer' | 'mg' oder null
function pathHazard(u, c, r) {
  const T = TYPES[u.type], h = G.map[c] && G.map[c][r]; if (!h) return null;
  if ((G.mines || []).some(q => q.c === c && q.r === r && q.side !== u.side && q.known === u.side)) return 'mine';   // Punkt 8: bekannte Mine des Gegners (Ziehen und Sturmlauf)
  if (h.t === 'wire' && T.cls !== 'walker' && !E.wireProof(T)) return 'draht';
  if ((VIS.clouds || []).some(k => k.c === c && k.r === r) && !E.gasSafe(G, u)) return 'gas';
  if ((VIS.fires || []).some(k => k.c === c && k.r === r)) return 'feuer';
  if (T.cls !== 'walker' && E.openGround(G, c, r) && G.units.some(m => m.side !== u.side && E.active(m) && TYPES[m.type].mg && m.sperr > 0 && m.setup && !m.supp && E.dist(m.c, m.r, c, r) <= E.rangeOf(G, m, c, r) && E.hasLOS(G, m.c, m.r, c, r) && E.inFan(G, m, c, r))) return 'mg';
  return null;
}
// Geländehinweis beim Ziehen (Fahrplan 2): Vor- und Nachteile des Zielfelds für die gewählte Einheit.
// Liste von { gut, kurz, lang }; kurz steht in der Leiste unter dem Feld, lang im Tooltip der Vorschau.
// Absicherung: Ein Fehler im Geländehinweis darf nie das Zeichnen der Karte abbrechen – dann fehlt nur der Hinweis (einmalige Warnung)
let hinweisGemeldet = false;
function hinweisFehler(err) { if (!hinweisGemeldet) { hinweisGemeldet = true; console.warn("Geländehinweis abgeschaltet:", err); } }
function feldWirkungSicher(u, c, r) { try { return feldWirkung(u, c, r); } catch (err) { hinweisFehler(err); return []; } }
function feldWirkung(u, c, r) {
  const h = G.map[c] && G.map[c][r]; if (!h) return [];
  const T = TYPES[u.type], wk = T.cls === 'walker', out = [], tags = [];
  const f0 = E.defMods(G, { ...u, c, r, dug: false, holdB: false }, 'front', true, tags);
  for (const tg of tags) { const m = /×(\d+)(?:,(\d+))?/.exec(tg); if (!m || (wk && h.t === 'wire')) continue;   // Fahrzeuge walzen den Draht nieder: kein Abzug
    const f = parseFloat(m[1] + '.' + (m[2] || '0'));
    out.push({ gut: f > 1, kurz: tg.replace(/^im /, ''), lang: `Abwehr ${f > 1 ? 'besser' : 'schlechter'}: ${tg} gegen Beschuss von vorn${h.t === 'crater' || h.t === 'bahn' ? '' : ' und Nahkampf'}.` }); }
  const kv = wk ? [] : E.kantenVon(G, c, r); if (kv.length) { const arten = [...new Set(kv.map(k => k.art))], feinde = G.units.filter(a => a.side !== u.side && E.active(a) && TYPES[a.type].rng > 0), gegen = feinde.filter(a => E.kanteDeck(G, c, r, a.c, a.r).f > 1).length;   // R3: Deckung an der Feldkante
    out.push({ gut: true, kurz: arten.map(a => E.KANTE_ART[a].name).join(', ') + ' an der Kante' + (feinde.length ? ` (${gegen}/${feinde.length} Schützen)` : ''), lang: arten.map(a => `${E.KANTE_ART[a].name} ${xf(P[E.KANTE_ART[a].p])}`).join(', ') + ` – nur gegen Beschuss, der über diese Kante kommt (nicht gegen Steilfeuer, Bogenwurf, Flammen). Von ${gegen} der ${feinde.length} feindlichen Schützen geschützt.` }); }
  if (f0 === 1 && !kv.length && (h.t === 'open' || h.t === 'mud')) out.push({ gut: false, kurz: 'keine Deckung', lang: 'Offenes Gelände: keine Deckung. MG-Sperrfeuer trifft hier.' });
  if (h.t === 'eis' && G.units.some(a => a.side !== u.side && E.alive(a) && E.eisSchwer(G, a))) out.push({ gut: false, kurz: 'Eis kann brechen', lang: 'Schwerer Beschuss (Haubitze, Minenwerfer, Feuerschlag, Sperrfeuer) bricht das Eis auf: Schaden, die Einheit rettet sich ans Ufer, 2 Runden offenes Wasser.' });   // Enrico 20:50
  if ((h.t === 'trench' || h.t === 'bunker') && !wk) out.push({ gut: true, kurz: 'halber Moralverlust', lang: 'Graben und Bunker: nur halber Moralverlust bei Treffern (nicht gegen Flammen).' });
  if (h.t === 'wire') {
    if (wk) out.push({ gut: true, kurz: 'walzt Draht nieder', lang: 'Fahrzeuge und Schreiter walzen den Draht nieder, das Feld wird frei.' });
    else if (E.wireProof(T)) out.push({ gut: true, kurz: 'Draht: unverletzt', lang: 'Gepanzerte Infanterie geht unverletzt und ohne Halt durch den Draht.' });
    else out.push({ gut: false, kurz: `Draht −${fmt(P.WIRE_DMG)}, Halt`, lang: `Stacheldraht: etwa −${fmt(P.WIRE_DMG)} Stärke, die Bewegung endet. Wer drinsteht, nimmt doppeltes MG-Feuer.` }); }
  if (wk && E.RUINE.has(h.t)) out.push({ gut: false, kurz: `Trümmer: Zug endet · Festfahren ${Math.round(P.RUINE_FEST * 100)} %`, lang: `${E.TERRAIN[h.t].name}: Fahrzeuge und Schreiter brauchen alle restliche Bewegung, ${Math.round(P.RUINE_FEST * 100)} % Gefahr, sich festzufahren (${E.u5aus && !E.u5aus() ? '1–2' : P.PANNE_RUNDEN} Runden aus).` });   // F79
  if (wk && (h.t === 'mud' || h.t === 'sumpf')) { const q = Math.round(P.STUCK * (h.t === 'sumpf' ? 2 : 1) * 100);
    out.push({ gut: false, kurz: `Festfahren ${q} %`, lang: `${E.TERRAIN[h.t].name}: ${q} % Gefahr, sich festzufahren (${E.u5aus && !E.u5aus() ? '1–2' : P.PANNE_RUNDEN} Runden aus).` }); }
  if ((VIS.fires || []).some(k => k.c === c && k.r === r)) { const d = P.FIRE_DMG * (wk ? P.FIRE_WALKER : 1);
    out.push({ gut: false, kurz: `Feuer −${fmt(d)}`, lang: `Brennendes Feld: etwa −${fmt(d)} Stärke beim Betreten und zu Beginn des eigenen Zugs.` }); }
  if ((VIS.clouds || []).some(k => k.c === c && k.r === r)) out.push(E.gasSafe(G, u) ? { gut: true, kurz: 'gasfest', lang: 'Gaswolke: diese Einheit ist geschützt.' }
    : { gut: false, kurz: 'Gas', lang: 'Gaswolke: Giftschaden, der nach dem Verlassen noch zwei Runden nachwirkt.' });
  { const nz = u === sel && nachZug.get(E.key(c, r)); if (nz && nz.art === 'nichts') out.push({ gut: false, kurz: 'danach keine Aktion', lang: nz.grund }); }   // F60
  if (h.obj && T.cls !== 'art' && (G.ctrl || {})[h.obj] !== u.side) out.push({ gut: true, kurz: 'Zielfeld erobern', lang: 'Zielfeld: wer es betritt, hält es und bekommt dafür Siegpunkte.' });
  return out;
}
// Leiste unter dem Zielfeld: ▲ Vorteil (Messing), ▼ Nachteil (Ochsenblut hell); Pergament-freie Tintentafel mit Rostrand (STYLE.md)
function drawFeldWirkung(g, x, y, list, s) {
  if (!list || !list.length) return; if (VIEW.up) VIEW.up(x, y); s = symS(g, s);   /* SP-1 (84.2) */
  const fs = Math.round(Math.max(11, s * 0.16)), lh = fs * 1.25, pad = fs * 0.45, tri = fs * 0.42; g.save();   // F10 (2026-11-20): kleiner, passend zu Stiefel und Zahl
  try {   // Zeichenzustand immer zurücksetzen, auch wenn etwas schiefgeht
  g.font = `700 ${fs}px "Arm Text", system-ui, sans-serif`; g.textBaseline = 'middle'; g.textAlign = 'left';
  const w = Math.max(...list.map(it => g.measureText(it.kurz).width)) + tri * 2 + fs * 0.4 + pad * 2, hh = list.length * lh + pad * 0.8, x0 = x - w / 2;
  if (!window.HINWEIS_ALT) { const ab = document.querySelector('#hud .up-abils'), r = ab && ab.offsetParent ? ab.getBoundingClientRect() : null;   // SP-1: Kasten nicht hinter der Fähigkeitenleiste – ragt er hinein, rückt er nach oben
    if (r && r.width) { const T = g.getTransform(), dpr = cv.width / (cv.getBoundingClientRect().width || cv.width), unten = (T.b * x0 + T.d * (y + hh) + T.f) / dpr, links = (T.a * x0 + T.c * y + T.e) / dpr, rechts = (T.a * (x0 + w) + T.c * y + T.e) / dpr, cr = cv.getBoundingClientRect();
      if (rechts + cr.left > r.left && links + cr.left < r.right && unten + cr.top > r.top - 6) y -= (unten + cr.top - (r.top - 6)) * dpr / (Math.hypot(T.c, T.d) || 1); } }
  g.beginPath(); g.roundRect ? g.roundRect(x0, y, w, hh, fs * 0.25) : g.rect(x0, y, w, hh); g.fillStyle = 'rgba(18,13,11,0.86)'; g.fill(); g.lineWidth = Math.max(1.5, fs * 0.12); g.strokeStyle = '#66483A'; g.stroke();
  list.forEach((it, i) => { const cy = y + pad * 0.4 + lh * (i + 0.5), tx = x0 + pad + tri;
    g.beginPath(); if (it.gut) { g.moveTo(tx, cy - tri); g.lineTo(tx + tri, cy + tri * 0.75); g.lineTo(tx - tri, cy + tri * 0.75); } else { g.moveTo(tx, cy + tri); g.lineTo(tx + tri, cy - tri * 0.75); g.lineTo(tx - tri, cy - tri * 0.75); }
    g.closePath(); g.fillStyle = it.gut ? '#C2A461' : '#A8473A'; g.fill(); g.lineWidth = 1; g.strokeStyle = '#120D0B'; g.stroke();
    g.fillStyle = '#F0EDE1'; g.fillText(it.kurz, tx + tri + fs * 0.4, cy + fs * 0.04); });
  } finally { g.restore(); }
}
// Schwebende Texte (Schadenszahlen, Meldungen). bb: neue Ansicht, stellt je Text den Aufsteller am Fußpunkt ein
// Punkt 17 (2026-11-24): Schadenszahlen im schroffen Stil – Ziffernschrift „Arm Ziffer“, je getroffener Seite eigene Füllung
// (Konkordat Ochsenblut mit hellem Stempelrand, Aschenwacht Knochenweiß → Feldgrau, Blaue Legion Horizontblau), raue Körnung und Kratzer
// ausgestanzt, Lesbarkeit über dicke dunkle Kontur und Schatten. Einmal je Text/Seite/Größe vorgezeichnet (SCHADEN_BILD).
// „Krit!“ ist vorbereitet (Ereignisfeld e.krit), es gibt aber noch keine kritischen Treffer in den Regeln.
const SCHADEN_FARBE = { A: { oben: '#E0735E', unten: '#8E2B22', rand: 'rgba(236,222,198,0.92)' }, D: { oben: '#FFFBEE', mitte: '#F1EBD6', unten: '#7D8471', rand: 'rgba(236,222,198,0.92)' }, F: { oben: '#F0F5FB', mitte: '#D2E0F0', unten: '#6F8FB5', rand: 'rgba(236,222,198,0.92)' } };   // Punkt 50c: Aschenwacht/Blaue Legion heller Kern, Fraktionsfarbe nur als Verlauf zum Rand, gleicher Stempelrand wie Konkordat
const SCHADEN_BILD = new Map();
function schadenBild(text, seite, px) {
  const key = text + '|' + seite + '|' + px; let c = SCHADEN_BILD.get(key); if (c) return c;
  const F = SCHADEN_FARBE[seite] || SCHADEN_FARBE.D, font = `400 ${px}px "Arm Ziffer", "Arm Text", system-ui, sans-serif`, fertig = !document.fonts || document.fonts.check(font);
  c = document.createElement('canvas'); let x = c.getContext('2d'); x.font = font; const w = Math.ceil(x.measureText(text).width), pad = Math.ceil(px * 0.35);
  c.width = w + pad * 2; c.height = Math.ceil(px * 1.1) + pad * 2; x = c.getContext('2d'); x.font = font; x.textAlign = 'center'; x.textBaseline = 'alphabetic'; x.lineJoin = 'round';
  const cx = c.width / 2, by = pad + px * 0.92; c.basis = by;
  // Körnung und Kratzer nur in der Füllung: erst Füllung auf eigene Fläche, dort ausstanzen, dann über die Kontur legen
  const t = document.createElement('canvas'); t.width = c.width; t.height = c.height; const y = t.getContext('2d'); y.font = font; y.textAlign = 'center'; y.textBaseline = 'alphabetic';
  const gr = y.createLinearGradient(0, by - px * 0.8, 0, by); gr.addColorStop(0, F.oben); if (F.mitte) gr.addColorStop(0.62, F.mitte); gr.addColorStop(1, F.unten); y.fillStyle = gr; y.fillText(text, cx, by);
  let h = 0; for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) | 0; const rnd = () => { h = (h * 1103515245 + 12345) | 0; return ((h >>> 8) & 0xffff) / 0xffff; };
  y.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < 22; i++) { y.globalAlpha = 0.45 + rnd() * 0.5; y.beginPath(); y.arc(cx - w / 2 + rnd() * w, by - rnd() * px * 0.8, px * (0.012 + rnd() * 0.03), 0, 7); y.fill(); }   // Körnung (gestempelt)
  y.lineWidth = px * 0.028; y.lineCap = 'round'; for (let i = 0; i < 3; i++) { y.globalAlpha = 0.55; const x0 = cx - w / 2 + rnd() * w, y0 = by - rnd() * px * 0.8, a = -0.5 + rnd() * 0.4, l = px * (0.25 + rnd() * 0.3); y.beginPath(); y.moveTo(x0, y0); y.lineTo(x0 + Math.cos(a) * l, y0 + Math.sin(a) * l); y.stroke(); }   // Kratzer
  x.save(); x.shadowColor = 'rgba(0,0,0,0.8)'; x.shadowBlur = px * 0.18; x.shadowOffsetY = px * 0.04;
  if (F.rand) { x.lineWidth = px * 0.36; x.strokeStyle = F.rand; x.strokeText(text, cx, by); x.shadowColor = 'transparent'; }   // heller Stempelrand: Ochsenblut auf dunklem Schlamm sonst zu dunkel (STYLE.md)
  x.lineWidth = px * (F.mitte ? 0.24 : F.rand ? 0.2 : 0.26); x.strokeStyle = O; x.strokeText(text, cx, by); x.restore();
  x.drawImage(t, 0, 0);
  if (fertig) SCHADEN_BILD.set(key, c);   // erst merken, wenn die Ziffernschrift geladen ist
  if (SCHADEN_BILD.size > 300) SCHADEN_BILD.delete(SCHADEN_BILD.keys().next().value);
  return c;
}
function schadenZeichnen(g, f, s) {
  const k = Math.min(1, (f.max - f.life) / 5), px = Math.max(12, Math.round(s * (f.big ? 0.3 : 0.24))), c = schadenBild(f.text, f.seite, px), sc = 0.75 + 0.25 * k;   // kurz aufploppen
  g.drawImage(c, f.x - c.width * sc / 2, f.y - c.basis * sc, c.width * sc, c.height * sc);
  if (f.krit) { g.font = `900 ${Math.round(px * 0.5)}px "Arm Text", system-ui, sans-serif`; g.textAlign = 'left'; g.lineWidth = Math.max(2.5, px * 0.12); g.strokeStyle = O; g.lineJoin = 'round';
    const kx = f.x + c.width * sc * 0.36, ky = f.y - px * 0.62; g.strokeText('Krit!', kx, ky); g.fillStyle = '#E2B04A'; g.fillText('Krit!', kx, ky); g.textAlign = 'center'; }
}
function drawFloaters(g, s, bb) {
  for (let i = floaters.length - 1; i >= 0; i--) {
    const f = floaters[i]; f.life -= f.hold ? STEP : FS; f.y -= s * STEP * (f.hold ? (f.life > f.max - 30 ? 0.012 : 0.0015) : 0.012);
    if (f.life <= 0) { floaters.splice(i, 1); continue; }
    if (bb && !bb(f.x, f.y)) continue;
    g.globalAlpha = Math.min(1, f.life / 18);
    if (f.sym) {   // F15: Symbol aus dem Bogen auf dunkler Plakette, kurz aufpoppen, dann steigen
      const k = Math.min(1, (f.max - f.life) / 6), R = s * 0.17 * (0.7 + 0.3 * k), ring = /^#?[0-9a-f]{3,6}$/i.test(f.col) ? f.col : '#C2A461'; drawSym(g, f.sym, f.x, f.y - R, R, ring);
      if (f.sub) { g.font = `400 ${Math.round(s * 0.2)}px "Arm Ziffer", "Arm Text", system-ui, sans-serif`; g.textAlign = 'left'; g.lineWidth = Math.max(2.5, s * 0.06); g.strokeStyle = O; g.lineJoin = 'round';
        g.strokeText(f.sub, f.x + R * 1.1, f.y - R); g.fillStyle = '#F0EDE1'; g.fillText(f.sub, f.x + R * 1.1, f.y - R); g.textAlign = 'center'; }
      continue;
    }
    if (f.icon) {   // Symbol statt Text: kurz aufpoppen, dann langsam steigen
      const k = Math.min(1, (f.max - f.life) / 6), hh = s * (f.big ? 0.95 : 0.8) * (0.7 + 0.3 * k), ww = hh * f.icon.naturalWidth / f.icon.naturalHeight;
      g.save(); g.shadowColor = 'rgba(0,0,0,0.85)'; g.shadowBlur = s * 0.18; g.drawImage(f.icon, f.x - ww / 2, f.y - hh * 0.8, ww, hh); g.restore();
      if (f.sub) { g.font = `900 ${Math.round(s * 0.4)}px "Arm Text", system-ui, sans-serif`; g.textAlign = 'left'; g.lineWidth = Math.max(3, s * 0.1); g.strokeStyle = O; g.lineJoin = 'round';
        g.strokeText(f.sub, f.x + ww * 0.45, f.y - hh * 0.15); g.fillStyle = f.col; g.fillText(f.sub, f.x + ww * 0.45, f.y - hh * 0.15); g.textAlign = 'center'; }
      continue;
    }
    if (f.hold && f.seite) { if (f.hold) g.globalAlpha = Math.min(1, f.life / 10); schadenZeichnen(g, f, s); continue; }   // Punkt 17: Schadenszahl je getroffener Seite im Stempel-Stil
    g.font = f.hold ? `400 ${Math.round(s * (f.big ? 0.27 : 0.22))}px "Arm Ziffer", "Arm Text", system-ui, sans-serif`   // Schadenszahlen (Paket 2): ≈60 %, kantige Ziffern, dunkler Rand
      : `900 ${Math.round(s * (f.big ? 0.26 : 0.22))}px "Arm Text", system-ui, sans-serif`;   // kurze Meldungen klein (Wunsch des Nutzers)
    if (f.hold) g.globalAlpha = Math.min(1, f.life / 10);   // kurz ausblenden
    g.lineWidth = Math.max(2.5, s * (f.hold ? 0.075 : 0.065)); g.strokeStyle = O; g.lineJoin = 'round'; g.strokeText(f.text, f.x, f.y);
    g.fillStyle = f.col; g.fillText(f.text, f.x, f.y);
  }
  g.globalAlpha = 1;
}

// ---------- Kopfzeichen (2026-11-18, Wunsch des Nutzers): Zustände als kleine Comic-Zeichen über dem Kopf statt Textmeldungen ----------
// Jedes Zeichen ploppt kurz auf und pulsiert dann einige Male (Zustand hält an) oder steigt auf und blendet aus (ist gerade passiert).
// Nichts bleibt stehen: dauerhaft sichtbar ist nur die Ringmarke am Standring (Tooltip mit den Regelwerten).
// Erscheint: wenn der Zustand eintritt (Ereignis in playEvent), beim Anwählen (kzAnwahl) und zu Beginn des eigenen Zugs (kzRunde).
// Gezeichnet im Code (sauber, STYLE.md „Inhalte sauber“); Abzeichen mit Symbolen aus den Bögen: Totenkopf, Zahnrad, Klingen, Auge, Garbe.
const KZ = [], KZ_POP = 200, KZ_DUR = { puls: 2000, steig: 1500 }, KZ_O = '#120D0B';
const kzBack = x => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };   // Aufspringen mit kleinem Überschwingen
// Haltung eines Zeichens zur Zeit t (ms): Größe, Deckkraft, Steigen (in Feldradien)
function kzPose(mode, t) {
  const D = KZ_DUR[mode], pop = t < KZ_POP ? Math.max(0.05, kzBack(t / KZ_POP)) : 1;
  if (mode === 'puls') { const p = Math.min(1, Math.max(0, (t - KZ_POP) / (D - KZ_POP - 350))); return { sc: pop * (1 + 0.14 * Math.abs(Math.sin(p * Math.PI * 3))), a: Math.min(1, (D - t) / 350), dy: 0 }; }
  const q = Math.max(0, (t - KZ_POP) / (D - KZ_POP)); return { sc: pop, a: 1 - Math.max(0, (q - 0.35) / 0.65), dy: -0.75 * q };
}
function kzLinie(g, R, w, col) { g.lineJoin = 'round'; g.lineCap = 'round'; g.strokeStyle = KZ_O; g.lineWidth = w + R * 0.12; g.stroke(); g.strokeStyle = col; g.lineWidth = w; g.stroke(); }
function kzFlaeche(g, R, col) { g.fillStyle = col; g.fill(); g.lineJoin = 'round'; g.strokeStyle = KZ_O; g.lineWidth = Math.max(1, R * 0.1); g.stroke(); }
function kzTropfen(g, x, y, r, ang, col) { g.save(); g.translate(x, y); g.rotate(ang + Math.PI * 1.5); g.beginPath(); g.moveTo(0, -r * 2.1); g.quadraticCurveTo(r * 1.1, -r * 0.4, r, 0); g.arc(0, 0, r, 0, Math.PI); g.quadraticCurveTo(-r * 1.1, -r * 0.4, 0, -r * 2.1); kzFlaeche(g, r * 2.5, col); g.restore(); }
function kzStern(g, x, y, r, col) { g.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 - Math.PI / 2, rr = i % 2 ? r * 0.32 : r; g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } g.closePath(); kzFlaeche(g, r * 2, col); }
function kzWolke(g, x, y, r, col) { g.beginPath(); g.arc(x, y, r, 0, 7); g.fillStyle = col; g.fill(); }
function kzAbzeichen(g, R, sym, ring, f) {   // rundes Abzeichen wie die Ringmarken, Symbol aus dem Bogen
  g.beginPath(); g.arc(0, 0, R * 0.62, 0, 7); g.fillStyle = 'rgba(18,13,11,0.86)'; g.fill(); g.lineWidth = Math.max(1.5, R * 0.12); g.strokeStyle = ring; g.stroke();
  const im = UPI['s_' + sym]; if (!im) return; const ww = Math.min(R * 0.9 * im.naturalWidth / im.naturalHeight, R * 1.0), hh = ww * im.naturalHeight / im.naturalWidth;
  g.save(); if (f) f(g); g.drawImage(im, -ww / 2, -hh / 2, ww, hh); g.restore();
}
function kzBlitz(g, x, y, k, rot) { const P0 = [[-0.22, -0.62], [0.24, -0.62], [0.04, -0.12], [0.3, -0.12], [-0.2, 0.72], [-0.02, 0.12], [-0.3, 0.12]];
  g.save(); g.translate(x, y); g.rotate(rot); g.beginPath(); P0.forEach(([a, b], i) => i ? g.lineTo(a * k, b * k) : g.moveTo(a * k, b * k)); g.closePath(); kzFlaeche(g, k * 1.2, '#FFD24A'); g.restore(); }
// Gemalte Kopfzeichen (bogen7_zustandszeichen, 2026-11-19): Bild UPI['k_<art>'] mit kleiner Eigenbewegung je Zeichen (KZ_BEW);
// Ablauf (Aufspringen, Pulsieren, Steigen) wie gehabt. Die Code-Zeichnungen in KZ_ART bleiben nur als Ersatz, falls ein Bild fehlt.
const KZ_BEW = {
  blitze: (g, T) => { if (Math.floor(T / 85) % 6 === 0) { g.translate(1.5, -1.5); g.rotate(0.12); } },   // zuckt ab und zu
  tropfen: (g, T) => g.translate(0, ((T / 1300) % 1) * 4 - 2),   // rinnt leicht herab
  schweiss: (g, T) => g.rotate(Math.sin(T / 160) * 0.06),   // Staubwolke wackelt
  angst: (g, T) => g.translate(Math.sin(T / 22) * 1.6, 0),   // zittert schnell
  gas: (g, T) => g.translate(0, -Math.abs(Math.sin(T / 420)) * 3),   // Bläschen steigen
  gift: (g, T) => g.rotate(Math.sin(T / 480) * 0.12),   // pendelt
  feuer: (g, T) => g.scale(1 + 0.03 * Math.sin(T / 70), 1 + 0.07 * Math.sin(T / 85) + 0.03 * Math.sin(T / 37)),   // flackert
  panne: (g, T) => g.rotate(Math.floor(T / 420) * 0.12 + (T % 420 < 90 ? 0.05 : 0)),   // Zahnrad ruckelt
  klingen: (g, T) => g.rotate(Math.floor(T / 300) % 2 ? 0.08 : -0.08),   // klirren
  wut: (g, T) => { const k = 1 + 0.1 * Math.max(0, Math.sin(T / 120)); g.scale(k, k); },   // pocht
  auge: (g, T) => { const b = T % 1700; if (b < 130) g.scale(1, Math.max(0.1, Math.abs(1 - b / 65))); },   // blinzelt
  pfeil: (g, T) => g.translate(0, -Math.abs(Math.sin(T / 260)) * 3),   // wippt nach oben
  garbe: (g, T) => g.translate(Math.sin(T / 45) * 1.2, 0),   // rattert
  funkeln: (g, T) => { const k = 0.9 + 0.12 * Math.sin(T / 160); g.rotate(T / 2400); g.scale(k, k); },   // dreht und funkelt
  kreuz: () => {},
};
// F23 (2026-11-20): einzelne gemalte Zeichen sind auf dem dunklen Boden zu blass (Zahnrad rostbraun, Rauch halbdurchsichtig):
// einmal aufhellen, Deckkraft anheben und eine dunkle Kontur geben
const KZ_KRAEFTIG = { panne: { filter: 'brightness(1.5) saturate(1.35) contrast(1.35)', alpha: 2.2, rand: 3 } }, KZB = {};
function kzBild(art) { const im = UPI['k_' + art], o = KZ_KRAEFTIG[art]; if (!im || !o) return im; if (KZB[art] && KZB[art].src === im) return KZB[art].c;
  const p = o.rand + 2, w = im.naturalWidth, h = im.naturalHeight, c = document.createElement('canvas'); c.width = w + 2 * p; c.height = h + 2 * p; const x = c.getContext('2d');
  const t = document.createElement('canvas'); t.width = c.width; t.height = c.height; const y = t.getContext('2d'); y.filter = o.filter; y.drawImage(im, p, p); y.filter = 'none';
  const id = y.getImageData(0, 0, t.width, t.height), dd = id.data; for (let i = 3; i < dd.length; i += 4) dd[i] = Math.min(255, dd[i] * o.alpha); y.putImageData(id, 0, 0);
  const sil = document.createElement('canvas'); sil.width = t.width; sil.height = t.height; const z = sil.getContext('2d'); z.drawImage(t, 0, 0); z.globalCompositeOperation = 'source-in'; z.fillStyle = '#120D0B'; z.fillRect(0, 0, sil.width, sil.height);
  for (let a = 0; a < 8; a++) x.drawImage(sil, Math.round(Math.cos(a * Math.PI / 4) * o.rand), Math.round(Math.sin(a * Math.PI / 4) * o.rand)); x.drawImage(t, 0, 0);
  c.naturalWidth = c.width; c.naturalHeight = c.height; KZB[art] = { src: im, c }; return c; }
function kzMalen(g, art, R, T) { const im = kzBild(art);
  if (im) { const k = Math.min(R * 1.7 / im.naturalHeight, R * 2.1 / im.naturalWidth), h = im.naturalHeight * k, w = im.naturalWidth * k;   /* höchstens 0,34 × 0,42 Feldradien */ g.save(); (KZ_BEW[art] || (() => {}))(g, T); g.drawImage(im, -w / 2, -h / 2, w, h); g.restore(); return; }
  KZ_ART[art].draw(g, R, T); }
const KZ_ART = {
  blitze: { name: 'Blitze', draw(g, R, T) {   // kreisen über dem Kopf, zucken ab und zu
    const o = [0, 1, 2].map(i => { const a = T / 520 + i * 2.094; return { i, a, x: Math.cos(a) * R * 1.05, y: Math.sin(a) * R * 0.32 }; }).sort((p, q) => p.y - q.y);
    for (const p of o) { const zuck = Math.floor(T / 85 + p.i * 5) % 6 === 0, k = R * (0.62 + 0.18 * (p.y / (R * 0.32))); kzBlitz(g, p.x + (zuck ? R * 0.1 : 0), p.y + (zuck ? -R * 0.08 : 0), k, zuck ? 0.35 : 0.12); } } },
  schweiss: { name: 'Schweißtropfen und Staub', draw(g, R, T) {   // Tropfen spritzen weg, Staubwolke puffert
    for (let i = 0; i < 2; i++) { const ph = (T / 520 + i * 0.5) % 1; kzWolke(g, (i ? 1 : -1) * R * (0.35 + 0.5 * ph), R * 0.85, R * 0.26 * (0.6 + ph), `rgba(150,138,118,${(0.6 * (1 - ph)).toFixed(3)})`); }
    [-2.5, -1.95, -0.7].forEach((ang, i) => { const ph = (T / 640 + i / 3) % 1, r = R * (0.45 + 0.85 * ph); const a0 = g.globalAlpha; g.globalAlpha = a0 * Math.min(1, (1 - ph) * 2.2); kzTropfen(g, Math.cos(ang) * r, Math.sin(ang) * r * 0.9, R * 0.17, ang, '#BFE3FF'); g.globalAlpha = a0; }); } },
  tropfen: { name: 'Schweißtropfen', draw(g, R, T) {   // rinnt seitlich am Kopf herab
    const ph = (T / 1300) % 1, a0 = g.globalAlpha; g.globalAlpha = a0 * Math.min(1, (1 - ph) * 3, ph * 8); kzTropfen(g, R * 0.7, -R * 0.45 + ph * R * 1.1, R * 0.2, Math.PI / 2, '#BFE3FF'); g.globalAlpha = a0; } },
  angst: { name: 'Schreckstriche', draw(g, R, T) {   // zittern schnell, Comic-Angst
    for (let i = 0; i < 6; i++) { const a = -Math.PI * (0.92 - i * 0.168), j = Math.sin(T / 28 + i * 1.7) * R * 0.06, r0 = R * 0.62, r1 = R * (1.0 + (i % 2) * 0.14);
      g.beginPath(); g.moveTo(Math.cos(a) * r0 + j, Math.sin(a) * r0); g.lineTo(Math.cos(a) * (r0 + r1) / 2 - j, Math.sin(a) * (r0 + r1) / 2); g.lineTo(Math.cos(a) * r1 + j, Math.sin(a) * r1); kzLinie(g, R, R * 0.11, '#F0EDE1'); }
    const j = Math.sin(T / 22) * R * 0.05; g.font = `900 ${Math.round(R * 0.95)}px "Arm Text", system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.lineJoin = 'round'; g.lineWidth = R * 0.2; g.strokeStyle = KZ_O; g.strokeText('!!', j, -R * 0.05); g.fillStyle = '#E2B04A'; g.fillText('!!', j, -R * 0.05); } },
  gas: { name: 'Grüne Bläschen', draw(g, R, T) {   // steigen auf und platzen
    for (let i = 0; i < 5; i++) { const ph = (T / 1500 + i / 5) % 1, x = Math.sin(i * 2.1 + ph * 5) * R * 0.55, y = R * 0.55 - ph * R * 1.5, r = R * (0.12 + 0.1 * ph);
      if (ph > 0.86) { const q = (ph - 0.86) / 0.14; g.beginPath(); g.arc(x, y, r * (1 + q), 0, 7); g.strokeStyle = `rgba(190,226,110,${(1 - q).toFixed(3)})`; g.lineWidth = Math.max(1, R * 0.06); g.stroke(); continue; }
      g.beginPath(); g.arc(x, y, r, 0, 7); kzFlaeche(g, R * 0.7, 'rgba(156,203,74,0.9)'); g.beginPath(); g.arc(x - r * 0.35, y - r * 0.35, r * 0.28, 0, 7); g.fillStyle = 'rgba(240,255,210,0.8)'; g.fill(); } } },
  gift: { name: 'Grüner Totenkopf', draw(g, R, T) { g.rotate(Math.sin(T / 480) * 0.16); kzAbzeichen(g, R, 'totenkopf', '#7FA04A', q => { q.filter = 'sepia(1) hue-rotate(45deg) saturate(2.4) brightness(0.95)'; }); } },
  feuer: { name: 'Flämmchen', draw(g, R, T) {   // flackern, dazu ein Rauchfaden
    for (let i = 0; i < 2; i++) { const ph = (T / 1500 + i * 0.5) % 1; kzWolke(g, Math.sin(ph * 4 + i) * R * 0.2, -R * 0.75 - ph * R * 0.9, R * 0.22 * (0.6 + ph), `rgba(70,64,58,${(0.55 * (1 - ph)).toFixed(3)})`); }
    [-0.45, 0, 0.45].forEach((xo, i) => { const t = T / 85 + i * 2.1, h = R * ((i === 1 ? 0.95 : 0.7) + 0.16 * Math.sin(t) + 0.08 * Math.sin(t * 2.6)), w = R * 0.24, x = xo * R, y = R * 0.45;
      for (const [col, kk] of [['#B8360E', 1], ['#F08A23', 0.68], ['#FFE07A', 0.36]]) { g.beginPath(); g.moveTo(x - w * kk, y); g.quadraticCurveTo(x - w * kk * 1.25, y - h * kk * 0.55, x + Math.sin(t) * w * 0.35, y - h * kk); g.quadraticCurveTo(x + w * kk * 1.25, y - h * kk * 0.55, x + w * kk, y); g.closePath();
        if (kk === 1) kzFlaeche(g, R * 0.6, col); else { g.fillStyle = col; g.fill(); } } }); } },
  panne: { name: 'Zahnrad und Rauch', draw(g, R, T) {   // Zahnrad ruckelt, schwarzer Rauch steigt
    for (let i = 0; i < 2; i++) { const ph = (T / 1200 + i * 0.5) % 1; kzWolke(g, R * (0.6 + 0.25 * ph), -R * 0.5 - ph * R * 1.0, R * 0.24 * (0.6 + ph), `rgba(34,30,27,${(0.7 * (1 - ph)).toFixed(3)})`); }
    const st = Math.floor(T / 420), rot = st * 0.35 + (T % 420 < 90 ? Math.sin((T % 420) / 90 * Math.PI) * 0.08 : 0); kzAbzeichen(g, R, 'zahnrad', '#9aa3ab', q => q.rotate(rot)); } },
  klingen: { name: 'Gekreuzte Klingen', draw(g, R, T) {   // klirren leicht aneinander
    const st = Math.floor(T / 300) % 2; g.rotate(st ? 0.1 : -0.1); kzAbzeichen(g, R, 'nahkampf', '#C8402C'); if (T % 300 < 110) { g.globalAlpha *= 1 - (T % 300) / 110; kzStern(g, 0, -R * 0.85, R * 0.32, '#FFE8A0'); } } },
  wut: { name: 'Wutader und Dampf', draw(g, R, T) {   // Ader pocht, Dampf zischt
    for (let i = 0; i < 2; i++) { const ph = (T / 760 + i * 0.5) % 1, sx = i ? 1 : -1; kzWolke(g, sx * R * (0.75 + 0.35 * ph), R * 0.15 - ph * R * 0.6, R * 0.2 * (0.6 + ph), `rgba(240,237,225,${(0.75 * (1 - ph)).toFixed(3)})`); }
    const k = 1 + 0.1 * Math.max(0, Math.sin(T / 120)); g.save(); g.scale(k, k);
    for (let q = 0; q < 4; q++) { g.save(); g.rotate(q * Math.PI / 2); g.beginPath(); g.moveTo(R * 0.12, -R * 0.55); g.quadraticCurveTo(R * 0.17, -R * 0.17, R * 0.55, -R * 0.12); kzLinie(g, R, R * 0.2, '#D2402C'); g.restore(); }
    g.restore(); } },
  auge: { name: 'Auge', draw(g, R, T) {   // blinzelt ab und zu
    const b = T % 1700, zu = b < 130 ? Math.max(0.08, Math.abs(1 - b / 65)) : 1; kzAbzeichen(g, R, 'auge', '#E2B04A', q => q.scale(1, zu)); } },
  garbe: { name: 'Garbe', draw(g, R, T) {   // blitzt kurz auf
    const f = 0.5 + 0.5 * Math.sin(T / 70); g.beginPath(); g.arc(0, 0, R * (0.95 + 0.1 * f), 0, 7); g.fillStyle = `rgba(255,210,90,${(0.25 + 0.25 * f).toFixed(3)})`; g.fill(); kzAbzeichen(g, R, 'garbe', '#E2B04A'); } },
  pfeil: { name: 'Grüner Pfeil', draw(g, R, T) {   // Moral steigt: Pfeil wippt, Funkeln
    const y = -Math.abs(Math.sin(T / 260)) * R * 0.15; g.beginPath(); g.moveTo(0, y - R * 0.85); g.lineTo(R * 0.6, y - R * 0.15); g.lineTo(R * 0.24, y - R * 0.15); g.lineTo(R * 0.24, y + R * 0.6); g.lineTo(-R * 0.24, y + R * 0.6); g.lineTo(-R * 0.24, y - R * 0.15); g.lineTo(-R * 0.6, y - R * 0.15); g.closePath(); kzFlaeche(g, R * 1.6, '#8FD45A');
    [[-0.8, -0.5, 0], [0.85, -0.3, 1.3], [0.6, 0.55, 2.4]].forEach(([x, yy, o]) => { const s = Math.max(0, Math.sin(T / 180 + o)); if (s > 0.05) kzStern(g, x * R, yy * R, R * 0.26 * s, '#FFE08A'); }); } },
  funkeln: { name: 'Goldenes Funkeln', draw(g, R, T) {   // wieder bereit, instand gesetzt, nachgeladen
    [[0, -0.2, 0, 0.5], [-0.7, 0.25, 1.6, 0.32], [0.7, 0.2, 3.1, 0.34], [0.35, -0.8, 4.4, 0.26]].forEach(([x, y, o, r]) => { const s = 0.35 + 0.65 * Math.max(0, Math.sin(T / 160 + o)); kzStern(g, x * R, y * R, R * r * 1.4 * s, '#FFE08A'); }); } },
  zurueck: { name: 'Kehrtwende-Pfeil', draw(g, R, T) {   // F40 (2026-11-20): Zurückweichen/Rückzug – deutlicher als Schweißtropfen; ruckt nach hinten
    const dx = -Math.abs(Math.sin(T / 240)) * R * 0.12, w = R * 0.26; g.save(); g.translate(dx, 0); g.beginPath();
    g.arc(R * 0.05, -R * 0.05, R * 0.55, Math.PI * 1.02, Math.PI * 0.05, false); g.arc(R * 0.05, -R * 0.05, R * 0.55 - w, Math.PI * 0.05, Math.PI * 1.02, true); g.closePath(); kzFlaeche(g, R, '#EDE6D2');
    g.beginPath(); g.moveTo(-R * 0.86, -R * 0.12); g.lineTo(-R * 0.36, -R * 0.12); g.lineTo(-R * 0.62, R * 0.5); g.closePath(); kzFlaeche(g, R, '#EDE6D2'); g.restore(); } },
  werkzeug: { name: 'Goldener Schlüssel', draw(g, R, T) { kzAbzeichen(g, R, 'schraubenschluessel', '#E2B04A', q => q.rotate(Math.sin(T / 180) * 0.18)); } },   // F39: repariert, geborgen
  munition: { name: 'Munitionskiste', draw(g, R, T) { kzAbzeichen(g, R, 'munitionskiste', '#E2B04A', q => q.translate(0, -Math.abs(Math.sin(T / 260)) * R * 0.08)); } },   // F39: nachgeladen
  kreuz: { name: 'Grünes Kreuz', draw(g, R, T) {   // versorgt, entgiftet
    const k = R * 0.26, L0 = R * 0.72; g.beginPath(); g.moveTo(-k, -L0); g.lineTo(k, -L0); g.lineTo(k, -k); g.lineTo(L0, -k); g.lineTo(L0, k); g.lineTo(k, k); g.lineTo(k, L0); g.lineTo(-k, L0); g.lineTo(-k, k); g.lineTo(-L0, k); g.lineTo(-L0, -k); g.lineTo(-k, -k); g.closePath(); kzFlaeche(g, R * 1.4, '#6FBF5A');
    [[0.85, -0.7, 0], [-0.85, -0.55, 2]].forEach(([x, y, o]) => { const s = Math.max(0, Math.sin(T / 170 + o)); if (s > 0.05) kzStern(g, x * R, y * R, R * 0.24 * s, '#E8FFD0'); }); } },
};
// Zeichen zeigen: ersetzt ein laufendes gleiches Zeichen der Einheit; delay in ms (Spielzeit)
function kz(id, art, mode = 'puls', delay = 0) { if (!DU.get(id) || !KZ_ART[art]) return; const i = KZ.findIndex(k => k.id === id && k.art === art); if (i >= 0) KZ.splice(i, 1); KZ.push({ id, art, mode, t: -delay }); }
function drawKZ(g, s, bb) {
  for (let i = KZ.length - 1; i >= 0; i--) {
    const k = KZ[i]; k.t += FS * 16.667; if (k.t >= KZ_DUR[k.mode]) { KZ.splice(i, 1); continue; } if (k.t < 0) continue;
    const d = DU.get(k.id); if (!d) { KZ.splice(i, 1); continue; }
    // über der höchsten gezeichneten Figur (Kästen d.fbx, relativ zum Fußpunkt); Aufsteller am Fußpunkt, damit es mit der Figur steht
    const top = d.fbx && d.fbx.length ? Math.min(...d.fbx.map(q => q[1])) : -s * 1.4, p = kzPose(k.mode, k.t);
    if (bb && !bb(d.x, d.y)) continue;
    g.save(); g.translate(d.x, d.y + top - s * 0.25 + p.dy * s); g.scale(p.sc, p.sc); g.globalAlpha = Math.max(0, p.a);
    try { kzMalen(g, k.art, symS(g, s) * 0.2, now + k.id * 137); } finally { g.restore(); }
  }
  g.globalAlpha = 1;
}
// Andauernde Zustände einer Einheit (Reihenfolge = Wichtigkeit); runde = nur die wichtigen für den Rundenbeginn
function kzZustaende(u, runde) {
  const d = DU.get(u.id); if (!d || !d.vs || !E.alive(u)) return []; const v = d.vs, T = TYPES[u.type], o = [];
  if (v.supp > 0) o.push('blitze'); if (v.rout) o.push('schweiss'); if (v.angst) o.push('angst');
  if (v.gassed) o.push('gas'); else if (v.poison > 0) o.push('gift');
  if ((VIS.fires || []).some(f => f.c === u.c && f.r === u.r)) o.push('feuer');
  if (v.broken > 0 || v.stuck > 0) o.push('panne');
  if (!runde) { if (!v.rout && d.mor < P.FALLBACK_MOR && T.cls !== 'art') o.push('tropfen'); if (T.rng > 0 && !T.flame && E.active(u) && E.held(G, u)) o.push('klingen'); if (u.zeal) o.push('wut'); if (u.ow) o.push('auge'); }
  return o;
}
function kzAnwahl(u) { kzZustaende(u).forEach((a, i) => kz(u.id, a, 'puls', i * 700)); }
function kzRunde(sd) { let n = 0; for (const u of G.units) if (u.side === sd) { const z = kzZustaende(u, true); z.forEach((a, i) => kz(u.id, a, 'puls', 700 + n * 250 + i * 700)); if (z.length) n++; } }
// Legende im Regeln-Fenster (Hilfe ?): echte Zeichen mit ihrer Bewegung, laufen in einer Schleife, solange das Fenster offen ist
const KZ_LEG = [
  ['blitze', 'puls', 'Niedergehalten', 'Liegt unter Beschuss flach. Steigt auf bei Schreck oder Panik.'],
  ['schweiss', 'puls', 'Flieht', 'Moral gebrochen: Staubwolke, die Einheit läuft davon.'],
  ['tropfen', 'puls', 'Moral wankt', 'Beim nächsten Treffer weicht sie zurück (beim Anwählen).'],
  ['zurueck', 'steig', 'Weicht zurück', 'Zurückweichen und Rückzug.'],
  ['angst', 'puls', 'Verängstigt', 'Vom Löwengebrüll des Kreuzschreiters: Moral gesunken, niedergehalten bis zum Ende der nächsten eigenen Runde.'],
  ['gas', 'puls', 'Im Gas', 'Steht in der Gaswolke.'],
  ['gift', 'puls', 'Vergiftet', 'Verliert noch einige Runden Stärke und Moral.'],
  ['feuer', 'puls', 'Im Feuer', 'Steht auf einem brennenden Feld (steigt auf: Dauerfeuer der Eisernen Hünen).'],
  ['panne', 'puls', 'Panne / festgefahren', 'Fahrzeug fällt aus oder steckt fest.'],
  ['klingen', 'puls', 'Gebunden', 'Gegner daneben: kein Schuss, nur Nahkampf (beim Anwählen).'],
  ['wut', 'steig', 'Sturm', 'Sturmbefehl, Vorwärts, Sturmlauf, Gegenstoß, Sprungangriff.'],
  ['auge', 'puls', 'Feuerbereit', 'Schießt im gegnerischen Zug auf den ersten Gegner.'],
  ['garbe', 'steig', 'Sperrfeuer', 'Das MG feuert im gegnerischen Zug.'],
  ['pfeil', 'steig', 'Moral steigt', 'Gesammelt, Sammeln-Befehl, hält stand.'],
  ['funkeln', 'steig', 'Wieder bereit', 'Wieder flott oder frei.'],
  ['werkzeug', 'steig', 'Repariert', 'Versorgungstrupp hat repariert oder geborgen.'],
  ['munition', 'steig', 'Nachgeladen', 'MG oder Geschütz darf noch einmal schießen.'],
  ['kreuz', 'steig', 'Versorgt', 'Vom Sanitäter versorgt oder entgiftet.'],
];
let kzLegLauf = 0;
function kzLegende() {
  const box = $('kzLeg'); if (!box) return;
  if (!box.childElementCount) box.innerHTML = KZ_LEG.map(([a, m, n, t]) => `<div class="kz-e"><canvas data-kz="${a}" data-m="${m}" width="160" height="160"></canvas><div><b>${n}</b><small>${m === 'puls' ? 'ploppt auf und pulsiert' : 'ploppt auf und steigt'}</small><span>${t}</span></div></div>`).join('');
  const cvs = [...box.querySelectorAll('canvas')]; cancelAnimationFrame(kzLegLauf);
  const lauf = () => { if ($('rules').hidden) return; const T = performance.now();   // Legende: Zeichen bleiben stehen, nur mit ihrer Eigenbewegung (2026-11-19)
    cvs.forEach((c, i) => { const q = c.getContext('2d');
      q.setTransform(1, 0, 0, 1, 0, 0); q.clearRect(0, 0, c.width, c.height);
      q.translate(80, 100); try { kzMalen(q, c.dataset.kz, 54, T + i * 137); } catch (e) {} });
    kzLegLauf = requestAnimationFrame(lauf); };
  lauf();
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
  faust: ['held_1', 0, 0, { sc: 1.1 }], kuerass: ['held_1', 0, 0, { sc: 1.1 }],   // Helden (2026-11-21): Einzelmodelle; K9 (Enrico 2026-11-22): 1,65 statt 1,5 Soldatenhöhen (sc 1,1)
  kohorte: ['soldat', 1], scharf: ['scharfschuetze', 1, 2], reiter: ['stahlreiter_reskin', 1, 3, { sc: 0.8, slots: [[-0.3, 0.14], [0.28, 0.28], [-0.02, -0.16]], ruhe: [1, 2, 3] }], /* R4 (Punkt 97): Stahlreiter, 3 Modelle = je eine Pose, 2 vorn, 1 hinten */ lanzeD: ['reiter', 1, 3, { sc: 0.8, slots: [[-0.3, 0.14], [0.28, 0.28], [-0.02, -0.16]] }],   /* F58 (2026-11-20): drei Reiter, der dritte hinten in der Mitte */ sturmpz: ['panzer'], flammen: ['flammen', 1],   // Reiter: 2 von 3 Posen, eng und auf 85 % (bleiben im eigenen Feld), Flammentrupp 4 Posen
  brand: ['flammen', 1], raeumer: ['sturm_reskin', 1, 4, { ruhe: [3, 1, 4, 2, 3, 1] }],   /* R4 (Punkt 96): Grabenräumer mit Sturmschilden – in Ruhe 2× Schild, Revolver hinter dem Schild, 2× Keule, Granate */
  pionier: ['pionier', 1], mineur: ['mineur', 1, 2],
  mahlwerk: ['mg'], haubitze: ['geschuetz'], feldkanone: ['feldkanone'], koloss: ['koloss'], hauptA: ['hauptmann'], generalA: ['general'],
  grenadier: ['soldat', 1], sturm: ['sturm_reskin', 1, 4, { ruhe: [2, 3, 1, 3, 2, 3] }], eingreif: ['eingreif', 1],   /* Punkt 106: Sturmbrecher in Ruhe 2× MG hüfthoch, 3× Spaten (ruhigste Pose), 1× Granatwurf */
  pionierD: ['pionier', 1],
  feldscher: ['sanitaeter', 1, 2, SANI], heiler: ['sanitaeter', 1, 2, SANI], pirsch: ['pirschjaeger', 1, 2, { slots: [[-0.2, -0.06], [0.18, 0.24]] }], moerser: ['moerser'], minenwerfer: ['minenwerfer'], rauch: ['rauchwerfer'], buechse: ['panzerbuechse'],   // neue Bögen 2026-11-16
  stahl: ['stahl', 1, 2, ANZUG], panzerk: ['panzerknecht', 1, 2, ANZUG],
  oger: ['loewenoger', 1, 2, ANZUG], huenen: ['eiserne_huenen', 1, 2, { ...ANZUG, sc: (ANZUG.sc || 1) * 0.92 }],   /* K9: Hünen 1,7 statt 1,85 SH */   // 2026-11-20: Löwenoger, Eiserne Hünen – 2 große Figuren je Trupp, Posen über POSE_SETS   // Kampfanzüge: 2 Figuren, 1,25 SH, eng im Feld
  ballon: ['ballon'], signal: ['signal', 1, 2], fernsprech: ['fernsprech', 1, 2], werkstatt: ['versorgung', 1, 2], munition: ['versorgung', 1, 2], gasschutz: ['gasschutz', 1, 2],   // neue Bögen 2026-11-17   // Fesselballon: Winde im Feld, Ballon eigens darüber (drawBallon)
  schildwall: ['schildwall', 1], schwer: ['schwer', 1], melder: ['melder', 1, 1, { sc: 0.9, slots: [[0, 0.15]] }], banner: ['banner', 1, 2, { slots: [[-0.25, 0.02], [0.22, 0.28]] }],
  sense: ['mg'], geschuetz: ['geschuetz'], hauptD: ['hauptmann'], generalD: ['general'], bohrer: ['bohrkoloss'],
  turm: ['turmschreiter_posen_1'], /* neues Aussehen (Enrico 2026-11-22) */ orden: ['ordensschreiter_posen2_1'], /* neues Aussehen (Enrico 2026-11-22): Ruhe als Grundbild */ kreuz: ['kreuzschreiter_neu'], knecht: ['eisenknecht_neu'], saeger: ['saegeschreiter_posen2_1'], klaue: ['klauenschreiter_posen2_1'],   /* neues Aussehen (Enrico 2026-11-22): Grundbild = Ruhepose aus posen2 */   // Schreiter 2026-11-17: Einzelmodelle knapp 2 SH, Schatten wie Fahrzeuge (deep)
};
// Farbstimmung der Kettenfahrzeuge an die Umgebung; der neue Landkoloss (Dreiviertelansicht, 2026-11-17) nur leicht gedämpft, damit das Rot kräftig bleibt
const KETTE_FILTER = { konkordat_koloss: 'brightness(0.95) contrast(1.03) saturate(0.97)' };
const SCHREITER = ['turmschreiter', 'ordensschreiter', 'kreuzschreiter', 'eisenknecht', 'saegeschreiter', 'klauenschreiter', 'kreuzschreiter_neu', 'eisenknecht_neu', 'saegeschreiter_posen2_1', 'klauenschreiter_posen2_1', 'turmschreiter_posen_1', 'ordensschreiter_posen2_1'];
// Stufe-3-Schreiter (2026-11-19, neue Modelle im Stil Retro-Zukunft): 2,3 SH, beide gleich groß, dürfen so breit werden wie Fahrzeuge (FIGW_VEH)
const STUFE3 = ['kreuzschreiter_neu', 'eisenknecht_neu'];
const FIG_SLOTS4 = [[-0.36, -0.26], [0.3, -0.34], [-0.24, 0.3], [0.36, 0.22]];   // Feldradien (x, y), y > 0 = vorn; Füße sicher im eigenen Feld
// ---------- Bildwirkung (2026-11-19): aus / leicht / stark, Einstellung bzw. Taste B, gespeichert arm.bildwirkung3 ----------
// Figuren: Plastik-Karte aus tools/figur_plastik.py (window.FIGSP, einmal beim Bauen vorberechnet: Klarheit und Metallglanz) wird
// einmal je Bild und Stufe eingerechnet, dazu etwas mehr Kontrast und Sättigung; danach ist es ein fertiges Bild (keine Kosten je Bild).
// Boden: abgedunkelt und entsättigt (renderTerrain, Gelände-Bausteine), Kontaktschatten und Kantenverdeckung kräftiger (cfg.ao in GBau).
const BW_NAME = ['aus', 'leicht', 'stark', 'sehr stark'];   // Stufe 3 (Paket P, Punkt 27) seit Punkt 38 (2026-11-24) im Menü und gespeichert; Standard bleibt „stark“
let BW = 2; try { const v = localStorage.getItem('arm.bildwirkung3');   // F1 (2026-11-20): Standard stark; neuer Schlüssel, damit alte Einstellungen „leicht“ nicht stehen bleiben
  if (v != null && [0, 1, 2, 3].includes(+v)) BW = +v; } catch (e) {}
const BW_KARTE = [0, 0.7, 1.3, 2.0];                                   // Anteil der Plastik-Karte
const BW_FIG = [null, { sat: 1.06, kon: 1.06 }, { sat: 1.13, kon: 1.14 }, { sat: 1.16, kon: 1.24 }];   // Figuren: Sättigung, Kontrast (um Mittelgrau 0,38)
const BW_BODEN = ['', 'brightness(0.9) saturate(0.84)', 'brightness(0.8) saturate(0.68)', 'brightness(0.78) saturate(0.64) contrast(1.06)'];
const BW_SCH = [1, 1.25, 1.5, 1.9];                                  // Kontaktschatten unter den Figuren
const bwA = a => Math.min(0.95, a * BW_SCH[BW]);
const BWI = new Map(), BWK = {};
const BW_FARBTREU = /stahlreiter_reskin/;   // R4c (106.4): Stahlreiter wie gemalt – Plastik-Karte ja, keine zusätzliche Sättigung/Kontrast (wirkten sonst grell rot)
function bwBild(key, im, nurKarte) {   // nurKarte: Gelände-Bausteine – Plastik-Karte ja, Kontrast/Sättigung der Figuren nein
  if (!BW) return im;
  const ck = key + ':' + BW; if (BWI.has(ck)) return BWI.get(ck);
  const src = window.FIGSP && window.FIGSP[key]; let km = BWK[key];
  if (src && !km) { km = BWK[key] = new Image(); km.src = src; }
  if (km && !(km.complete && km.naturalWidth)) return im;   // Karte lädt noch: so lange das unveränderte Bild
  const W = im.naturalWidth, H = im.naturalHeight, c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(im, 0, 0);
  const id = x.getImageData(0, 0, W, H), p = id.data;
  let kd = null; if (km) { x.clearRect(0, 0, W, H); x.imageSmoothingQuality = 'high'; x.drawImage(km, 0, 0, W, H); kd = x.getImageData(0, 0, W, H).data; }
  const f = BW_KARTE[BW] / 510 * 255, { sat, kon } = nurKarte || BW_FARBTREU.test(key) ? { sat: 1, kon: 1 } : BW_FIG[BW], piv = 0.38 * 255;
  const licht = BW === 3 ? 40 : 0;   // Probe „sehr stark“: gerichtetes Licht von oben links (heller oben links, dunkler unten rechts)
  for (let i = 0; i < p.length; i += 4) {
    if (!p[i + 3]) continue;
    let dl = kd ? (kd[i] - 128) * f : 0; if (licht) { const q = i >> 2, px = q % W, py = (q / W) | 0; dl += licht * (0.5 - (px / W) * 0.4 - (py / H) * 0.6); }
    let r = p[i] + dl, gg = p[i + 1] + dl, b = p[i + 2] + dl; const gr = 0.299 * r + 0.587 * gg + 0.114 * b;
    r = gr + (r - gr) * sat; gg = gr + (gg - gr) * sat; b = gr + (b - gr) * sat;
    p[i] = piv + (r - piv) * kon; p[i + 1] = piv + (gg - piv) * kon; p[i + 2] = piv + (b - piv) * kon;   // Uint8ClampedArray begrenzt selbst
  }
  x.putImageData(id, 0, 0);
  c.naturalWidth = W; c.naturalHeight = H; c.complete = true;   // verhält sich wie ein geladenes Bild (naturalWidth/-Height)
  BWI.set(ck, c); return c;
}
function setBildwirkung(v, still) {
  BW = ((v % 4) + 4) % 4; try { localStorage.setItem('arm.bildwirkung3', String(BW)); } catch (e) {}
  if ($('optBild')) $('optBild').value = String(BW);
  gbKey = ''; if (L && G) renderTerrain();
  if (!still && G && $('start').hidden) toast('Bildwirkung: ' + BW_NAME[BW]);
}
const FIGI = {};
// Figurenbilder nachladen (Enrico 2026-11-27, wie die Töne): src/figs.js und src/figsplastik.js liegen neben index.html und kommen nach dem Start;
// bis dahin greifen die gezeichneten Figuren. Danach Zwischenspeicher leeren (fehlende Bilder, Bildwirkung ohne Plastik-Karte). Rückweg: build.py mit EINBETTEN_FIGUREN=1.
let figurenLaden = null;
function figurenNachladen() {
  if (figurenLaden) return figurenLaden;
  const lade = (src, da) => da ? Promise.resolve(true) : new Promise(res => { const sc = document.createElement('script'); sc.src = src; sc.async = true; sc.onload = () => res(true); sc.onerror = () => { console.warn(src + ' fehlt – gezeichnete Figuren'); res(false); }; document.body.appendChild(sc); });
  figurenLaden = Promise.all([lade('src/figs.js', !!window.FIGS), lade('src/figsplastik.js', !!window.FIGSP)]).then(r => { for (const k in FIGI) if (!FIGI[k]) delete FIGI[k]; BWI.clear(); window.__figurenDa = true; return r; });
  return figurenLaden;
}
setTimeout(figurenNachladen, 0);
function figImg(key) {
  if (key in FIGI) { const b = FIGI[key] && FIGI[key].complete && FIGI[key].naturalWidth ? bwBild(key, FIGI[key]) : null; if (b) b._key = key; return b; }
  const src = window.FIGS && window.FIGS[key]; if (!src) { FIGI[key] = null; return null; }
  const im = new Image(); im.src = src; FIGI[key] = im; return null;
}
// F89 (2026-11-22): Bögen, deren Modell nach links blickt (Rohr/Mündung links, Mannschaft dahinter) – beim Zeichnen gespiegelt, damit sie wie alle anderen zum Feind schauen
const BILD_LINKS = new Set(['konkordat_moerser', 'konkordat_rauchwerfer', 'aschenwacht_minenwerfer']);
// U1 Maßstab E1 (Bauplan, 2026-11-25): Linieninfanterie 10 Figuren, Reiter 6, Spezialtrupps wie bisher; Soldaten, Reiter, Helden, MG und Geschütze ×0,65
// (Soldat 0,52 statt 0,8 Feldradien), Kettenfahrzeuge und Schreiter ×0,85; Trupps lockerer in zwei Reihen. Rückweg: window.MASSSTAB_ALT = true (bzw. __dbg.massstab(0)).
const MASS = { fig: 0.65, fz: 0.85, line: 10, cav: 6, spez: 4, versatz: 25 },   /* R1 (2026-11-25): Linie 8, Reiter 6, Spezialtrupps 3 über massZahl(); window.STAERKE_ALT = 10/6/4 */ MASS_LINIE = new Set(['kohorte', 'grenadier']), MASS_SL = {};
const massAn = () => !window.MASSSTAB_ALT;
const BEIWERK_BILD = new Set(['melder']);   // U5c: Bild zeigt schon die ganze Gruppe (Meldegänger mit Hund) – nicht vervielfachen
const massZahl = () => window.STAERKE_ALT ? { line: 10, cav: 6, spez: 4 } : { line: 8, cav: 6, spez: 3 };
function massSlots3(n) {   // R1: Linie 8 = 3-2-3 versetzt (die mittlere Reihe steht in den Lücken), Spezialtrupp 3 = einer hinten, zwei vorn; Füße sicher im eigenen Feld
  const k = 's' + n; if (MASS_SL[k]) return MASS_SL[k];
  const out = n === 8 ? [[-0.46, -0.34], [0.04, -0.36], [0.52, -0.32], [-0.22, -0.02], [0.28, 0.0], [-0.52, 0.3], [-0.02, 0.32], [0.48, 0.3]] : n === 3 ? [[0.06, -0.24], [-0.34, 0.2], [0.36, 0.16]]
    : n === 6 ? [[-0.42, -0.3], [0.04, -0.33], [0.46, -0.28], [-0.4, 0.24], [0.02, 0.3], [0.44, 0.22]] : n === 4 ? [[-0.28, -0.28], [0.3, -0.24], [-0.32, 0.22], [0.26, 0.28]] : null;   // U5c: 6er-Sturmtrupp 3-3, 4er-Fachtrupp 2-2, Füße im eigenen Feld
  return (MASS_SL[k] = out || massSlots(n)); }
function massSlots(n, reiter) {   // zwei lockere Reihen, Füße im eigenen Feld (Probe E1: hinten −0,3, vorn +0,3, Breite ±0,64 Feldradien)
  const k = n + (reiter ? 'r' : ''); if (MASS_SL[k]) return MASS_SL[k];
  const hin = Math.ceil(n / 2), vor = n - hin, out = [], row = (m, y, off) => { for (let i = 0; i < m; i++) { const x = m === 1 ? 0 : -0.64 + 1.28 * i / (m - 1) + off, j = ((i * 37 + Math.round(y * 100)) % 7 - 3) * 0.012; out.push([x + j, (y + j) * (reiter ? 1.15 : 1)]); } };
  row(hin, -0.3, 0); row(vor, 0.3, vor < hin ? 0.1 : 0.06); return (MASS_SL[k] = out);
}
function massNF(u, nf) {
  if (/ballon/.test(nf.key)) return nf;   // Fesselballon: Winde und Ballon bleiben wie sie sind
  const o = Object.assign({}, nf), T = TYPES[u.type], gross = nf.kette || nf.gross || /schreiter|eisenknecht/.test(nf.key);
  if (nf.gruppe) { o.sc = nf.sc * MASS.fig; o.massF = MASS.fig; return o; }   // U4 Teil 3: feste Gruppe behält Plätze und Zahl
  if (nf.deep) { o.tiefSc = o.massF = gross ? MASS.fz : MASS.fig; return o; }   // MG, Geschütze, Gespanne ×0,65; Fahrzeuge/Schreiter ×0,85
  o.sc = nf.sc * MASS.fig; o.massF = MASS.fig;
  const Z = massZahl();
  if (nf.trupp && !window.STAERKE_ALT && !E.truppAlt() && E.TRUPP[u.type] != null && T.cls !== 'cav') {   // U5c (Punkt 90): so viele Figuren wie Modelle in der Regel, fehlende Posen wiederholen sich (Klone)
    const n = BEIWERK_BILD.has(u.type) ? Math.min(nf.max, E.modelle(u.type)) : E.modelle(u.type); o.max = n;
    o.slots = [8, 6, 4, 3].includes(n) ? massSlots3(n) : n <= 2 && nf.slots && nf.slots.length >= n ? nf.slots : massSlots(n); return o; }
  if (nf.trupp && MASS_LINIE.has(u.type)) { o.max = Z.line; o.slots = Z.line === 10 ? massSlots(10) : massSlots3(Z.line); }
  else if (nf.trupp && T && T.cls === 'cav') { const n = !window.STAERKE_ALT && !E.truppAlt() && E.TRUPP[u.type] != null ? E.modelle(u.type) : Z.cav; o.max = n; o.slots = n <= 3 && nf.slots && nf.slots.length >= n ? nf.slots : massSlots(n, true); }   // R4: Stahlreiter 3 Modelle
  else if (nf.trupp && nf.max > Z.spez) { o.max = Z.spez; o.slots = massSlots3(Z.spez); }   // R1: Spezialtrupps 3 statt 4
  return o;
}
// Grabenplätze (vorläufig bis U2): mehr als 4 Figuren gleichmäßig entlang der Grabenpunkte, abwechselnd etwas vor/zurück
function grabenPunkt(pts, i, n, s) {
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), quer = Math.max(...ys) - Math.min(...ys) > Math.max(...xs) - Math.min(...xs);   // Graben läuft eher senkrecht oder waagerecht
  const q = pts.slice().sort((a, b) => quer ? a[1] - b[1] : a[0] - b[0]); let L = 0; const seg = []; for (let k = 1; k < q.length; k++) { const l = Math.hypot(q[k][0] - q[k - 1][0], q[k][1] - q[k - 1][1]); seg.push(l); L += l; }
  let t = (i + 0.5) / n * L, k = 0; while (k < seg.length - 1 && t > seg[k]) { t -= seg[k]; k++; } const f = seg[k] ? Math.min(1, t / seg[k]) : 0;
  const dx = q[k + 1][0] - q[k][0], dy = q[k + 1][1] - q[k][1], l = Math.hypot(dx, dy) || 1, o = (i % 2 ? 1 : -1) * s * 0.1;   // abwechselnd quer zur Grabenlinie versetzt
  return [q[k][0] + dx * f - dy / l * o, q[k][1] + dy * f + dx / l * o];
}
function newFigs(u, d) { const nf = newFigs0(u, d); return nf && massAn() ? massNF(u, nf) : nf; }
function newFigs0(u, d) {
  const m = FIGMAP[u.type]; if (!m || (fac(u.side) === 'F' && !TYPES[u.type].held)) return null;   // Blaue Legion: noch keine neuen Bögen (K10: Helden nehmen ihren eigenen Bogen)
  const pre = u.side === 'A' ? 'konkordat_' : 'aschenwacht_';
  const gr = GRUPPE[u.type]; if (gr && !window[gr.alt] && !(gr.nur === 'setup' && !(d.vs && d.vs.setup))) {   // U4 Teil 3: Trupp aus Teilen (fehlt ein Bild: wie bisher)
    const keys = (gr.bilder || gr.slots.map((_, i) => i + 1)).map(i => pre + gr.bogen + '_' + i), ims = window.FIGS && keys.every(k => window.FIGS[k]) ? keys.map(figImg) : null;
    if (ims && ims.every(Boolean)) return { key: keys[0], links: false, ims, trupp: true, max: ims.length, sc: gr.sc || 1, slots: gr.slots, gruppe: gr }; }
  let sheet = m[0]; if (sheet === 'mg' && !(d.vs && d.vs.setup)) sheet = 'mg_marsch';
  if (sheet === 'geschuetz' && ((d.vs && d.vs.limbered) || d.moving) && window.FIGS && window.FIGS[pre + 'geschuetz_marsch']) sheet = 'geschuetz_marsch';   // aufgeprotzt oder beim Ziehen: Pferdegespann
  let keys = m[1] ? ((m[3] && m[3].ruhe) || [1, 2, 3, 4]).map(i => pre + sheet + '_' + i).filter(k => window.FIGS && window.FIGS[k]) : [pre + sheet];   // Trupp-Bögen mit 3 oder 4 Posen
  if (!m[1] && !d.pose && POSE_SETS[u.type]) { const wa = wachArt(u, POSE_SETS[u.type]); if (wa && window.FIGS && window.FIGS[pre + POSE_SETS[u.type][wa]]) keys = [pre + POSE_SETS[u.type][wa]]; }   // F99: Einzelmodelle in Bereitschaft zielen
  if (!m[1] && d.pose && POSE_SETS[u.type]) { const el = (now - d.pose.t0) * speed, PS = POSE_SETS[u.type], k = d.pose.art === 'hieb' && PS.hiebAus && el < d.pose.dauer * 0.4 ? PS.hiebAus : PS[d.pose.art];   // Hieb mit Ausholen auch bei Einzelmodellen (Helden)   // Einzelmodell mit Posen (Hauptmann, 2026-11-20)
    if (el > d.pose.dauer + 400) d.pose = null; else if (el >= 0 && el <= d.pose.dauer && k && window.FIGS && window.FIGS[pre + k]) keys = [pre + k]; }
  const ims = keys.map(figImg); if (!ims.length || ims.some(im => !im)) return null;   // noch nicht geladen: diesmal altes Bild
  return { key: keys[0], links: BILD_LINKS.has(keys[0]) || BILD_LINKS.has(pre + sheet), ims, trupp: !!m[1], max: m[2] || 4, sc: (m[3] && m[3].sc) || 1, slots: m[3] && m[3].slots, gross: STUFE3.includes(sheet), vehicle: ['koloss', 'panzer', 'bohrkoloss', 'geschuetz_marsch'].includes(sheet), kette: ['koloss', 'panzer', 'bohrkoloss'].includes(sheet), deep: ['koloss', 'panzer', 'bohrkoloss', 'geschuetz_marsch', 'mg', 'mg_marsch', 'geschuetz', 'moerser', 'minenwerfer', 'rauchwerfer', 'panzerbuechse', 'ballon', 'feldkanone', ...SCHREITER].includes(sheet) };   // Gespann wie Fahrzeug verankert (Hufe/Räder auf dem Boden)
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
  const dh = DU.get(u.id), hk = dh && dh.ballonH != null ? dh.ballonH : (u.eingeholt ? 0 : 1);   // F70: Höhe am Seil (0 = eingeholt, 1 = oben)
  const bx = ax + (flip ? 1 : -1) * s * 0.15 + sw * hk, by = top - s * (0.1 + 1.0 * hk) + Math.sin(now / 900 + u.id) * s * 0.03 * hk;   // Korbunterkante über dem Feld
  g.save(); g.strokeStyle = 'rgba(30,24,16,0.9)'; g.lineWidth = Math.max(1, s * 0.018); g.beginPath(); g.moveTo(ax, ay); g.quadraticCurveTo((ax + bx) / 2 + s * 0.06, (ay + by) / 2, bx, by); g.stroke();
  if (filt) g.filter = filt; g.translate(bx, by); if (flip) g.scale(-1, 1); g.drawImage(im, -bw * 0.53, -bh, bw, bh); g.restore(); g.filter = 'none';
}
// ---------- Posenwechsel (Animation Stufe 1, 2026-11-19): nur neue Ansicht, Testfall Schützenkohorte und Aschengrenadiere ----------
// Ruhe = bereit; Schießen stehend anlegen (in Deckung/Graben/eingegraben kniend) mit Rückstoß, Nahkampf Kolbenschlag mit Vorstoß,
// Eingraben mit Schaufel im Takt auf und ab, Granatwurf Ausholen → Loslassen (Granate fliegt aus der Hand), Getroffen taumelt kurz.
// Danach immer zurück in die Ruhepose. Jede Figur eines Trupps leicht versetzt (POSE_VERSATZ), damit niemand im Gleichschritt geht.
// Bilder: Grundbogen <fraktion>_soldat_1–4 und Zusatzbogen <fraktion>_soldat_posen_1–4 (tools/figure_cut.py, POSEN_MASS).
// U4 Teil 3 (Punkt 121, 2026-11-27): Trupps aus getrennt gemalten Teilen – je Platz ein festes Bild (bilder = Nummern im Bogen), feste Plätze (Feldradien, Blick nach rechts),
// geraet = Teile, die nie fallen (Waffe), fall = Reihenfolge der Verluste, offizier = Figur mit Posen (Befehl, großer Befehl), nur 'setup' = nur aufgebaut (MG). Rückwege je Eintrag (alt).
const GRUPPE = {
  mahlwerk: { bogen: 'mg_trupp', alt: 'WAFFENTRUPP_ALT', nur: 'setup', slots: [[0.16, 0.08], [-0.04, 0.02], [0.36, -0.24], [-0.4, -0.3]], geraet: [0], fall: [3, 2, 1] },
  sense: { bogen: 'mg_trupp', alt: 'WAFFENTRUPP_ALT', nur: 'setup', slots: [[0.14, 0.08], [-0.06, 0.02], [0.38, -0.24], [-0.4, -0.3]], geraet: [0], fall: [3, 2, 1] },
  buechse: { bogen: 'panzerbuechse_trupp', alt: 'WAFFENTRUPP_ALT', slots: [[0.22, 0.06], [-0.24, 0.1], [0.4, -0.3], [-0.42, -0.32]], geraet: [0], fall: [3, 2, 1] },
  hauptA: { bogen: 'hauptmann_gruppe', alt: 'FUEHRUNG_ALT', slots: [[0.02, 0.2], [-0.4, -0.2], [0.42, -0.12]], offizier: 0, fall: [2, 1, 0] }, hauptD: { bogen: 'hauptmann_gruppe', alt: 'FUEHRUNG_ALT', slots: [[0.02, 0.2], [-0.4, -0.2], [0.42, -0.12]], offizier: 0, fall: [2, 1, 0] },
  generalA: { bogen: 'general_gruppe', alt: 'FUEHRUNG_ALT', slots: [[0.02, 0.2], [-0.4, -0.2], [0.42, -0.12]], offizier: 0, fall: [2, 1, 0] }, generalD: { bogen: 'general_gruppe', alt: 'FUEHRUNG_ALT', slots: [[0.02, 0.2], [-0.4, -0.2], [0.42, -0.12]], offizier: 0, fall: [2, 1, 0] },
  scharf: { bogen: 'scharfschuetze_trupp', alt: 'SCHARF_TRUPP_ALT', bilder: [1, 2], slots: [[-0.12, 0.18], [0.08, -0.26]], fall: [1, 0], muz: 0 } };   /* Beobachter: Bild 2 unten rechts im Bogen, Bild 3 doppelt */
// Beiwerk (Punkt 90/121): Gerät neben dem Trupp, fällt nicht, steht nur, solange der Trupp nicht zieht; Rückweg window.BEIWERK_ALT
const BEIWERK = { munition: ['beiwerk_versorgung_1', [0.42, -0.3]], werkstatt: ['beiwerk_versorgung_2', [0.42, -0.3]], fernsprech: ['beiwerk_versorgung_3', [0.44, -0.3]] };
const POSE_TYPEN = new Set(['kreuz', 'knecht', 'saeger', 'klaue', 'orden', /* Stufe-3-Schreiter (2026-11-22) */ 'kohorte', 'grenadier', 'oger', 'huenen', 'raeumer', 'sturm', 'pionier', 'pionierD', 'reiter', 'lanzeD', 'eingreif', 'gasschutz', 'banner', 'generalA', 'generalD', 'buechse', 'faust', 'kuerass',   /* Posenbögen Runde 2 (2026-11-21), Helden */
  'feldscher', 'heiler', 'flammen', 'brand', 'stahl', 'panzerk', 'werkstatt', 'munition', 'schildwall', 'schwer', 'scharf', 'pirsch', 'fernsprech', 'signal', 'mineur', 'hauptA', 'hauptD']);   // Posenbögen 2026-11-20   // 2026-11-20: Sturmtrupps und Pioniere (Posenbögen)
const POSE_BILD = { bereit: 'soldat_1', anlegen: 'soldat_2', knien: 'soldat_3', kolben: 'soldat_4', graben: 'soldat_posen_1', ausholen: 'soldat_posen_2', loslassen: 'soldat_posen_3', getroffen: 'soldat_posen_4' };
// Löwenoger und Eiserne Hünen (2026-11-20): 3 Posen – vorrücken (Ruhe), schießen aus der Hüfte, Nahkampf; fehlende Arten = Ruhe
// Runde 2 (2026-11-21): Oger mit Sprung, Prankenhieb, Schrot angelegt, Getroffen; Hünen mit Hüftfeuer, Sturmlauf, halb kniend, Getroffen
const POSE_SETS = { /* Stufe-3-Schreiter (Enrico 2026-11-22): Einzelmodelle mit Posen; Gehen des Kreuzschreiters = Grundbild */
  saeger: { lauf: 'saegeschreiter_posen_1', anlegen: 'saegeschreiter_posen_2', knien: 'saegeschreiter_posen_2', hiebAus: 'saegeschreiter_posen3_1', hieb: 'saegeschreiter_posen3_2', kolben: 'saegeschreiter_posen3_2' },
  klaue: { lauf: 'klauenschreiter_posen_1', anlegen: 'klauenschreiter_posen_2', knien: 'klauenschreiter_posen_2', hiebAus: 'klauenschreiter_posen4_1', hieb: 'klauenschreiter_posen3_2', kolben: 'klauenschreiter_posen3_2', getroffen: 'klauenschreiter_posen4_2' },   /* Ausholen aus posen4 (beide Beine) */
  orden: { lauf: 'ordensschreiter_posen_1', anlegen: 'ordensschreiter_posen_2', knien: 'ordensschreiter_posen_2', kolben: 'ordensschreiter_posen3_1', hieb: 'ordensschreiter_posen3_1', getroffen: 'ordensschreiter_posen5_1', wank: 0.12 },   /* Getroffen (Enrico 15:47): Treffer-Pose posen5 (Flux), dazu Wanken im Code ca. 7° */
  kreuz: { anlegen: 'kreuzschreiter_posen_2', knien: 'kreuzschreiter_posen_2', kolben: 'kreuzschreiter_posen2_1', zweit: 'kreuzschreiter_posen2_2', gebruell: 'kreuzschreiter_posen2_2' },
  knecht: { lauf: 'eisenknecht_posen_1', anlegen: 'eisenknecht_posen2_2', knien: 'eisenknecht_posen2_2', faust: 'eisenknecht_posen_2', kolben: 'eisenknecht_posen3_2', hiebAus: 'eisenknecht_posen2_1', hieb: 'eisenknecht_posen3_1' },
  oger: window.OGER_POSEN_ALT ? { bereit: 'loewenoger_1', anlegen: 'loewenoger_posen_3', knien: 'loewenoger_posen_3', kolben: 'loewenoger_posen_2', sprung: 'loewenoger_posen_1', getroffen: 'loewenoger_posen_4' }
    : { anlegen: 'loewenoger_2', knien: 'loewenoger_2', kolben: 'loewenoger_3', sprung: 'loewenoger_3' },   // Punkt 120.1b: ohne bereit stehen in Ruhe die drei Figuren des Bogens gemischt   // U4 (Punkt 119): neuer Bogen neu3 hat nur Ruhe/Schießen/Nahkampf; der alte Posenbogen (rote Rüstung, Stirnband) bleibt draußen, bis neue Posen gemalt sind (kein Getroffen-Bild: Gefallene wie ohne Posen); Rückweg window.OGER_POSEN_ALT
  huenen: { bereit: 'eiserne_huenen_1', anlegen: 'eiserne_huenen_posen_1', knien: 'eiserne_huenen_posen_3', kolben: 'eiserne_huenen_3', lauf: 'eiserne_huenen_posen_2', getroffen: 'eiserne_huenen_posen_4' },
  // Posenbögen 2026-11-20 (Grundbogen + <bogen>_posen: Ausholen, Loslassen, Graben, Getroffen bzw. Draht schneiden, Haftladung, Graben, Getroffen).
  // Grundbögen sind unterschiedlich geordnet: Konkordat-Sturm 1 Ruhe, 3 kniend zielen, 4 Keule; Aschenwacht-Sturm 1 Spaten, 2 Keule, 4 Ruhe; Pioniere 1 Ruhe, 2 Schaufel, 3 kniend (Ladung/Mine)
  // R4 (2026-11-26): neue Bögen der zusammengelegten Trupps (reskin), Ruhe je Figur aus FIGMAP ruhe; Konkordat-Getroffen noch aus dem alten Posenbogen (kein neues Bild)
  raeumer: { kolben: 'sturm_reskin_1', ausholen: 'sturm_reskin_2', loslassen: 'sturm_reskin_2', halten: 'sturm_getroffen_3', lauf: 'sturm_reskin_3', getroffen: 'sturm_getroffen_1', getroffen2: 'sturm_getroffen_2', getroffen3: 'sturm_getroffen_4' },   /* U4a (108.5): dritte Getroffen-Fassung */   // R4c (106.6): Getroffen mit Schild bzw. mit Keule (zufällig), Schilde vor = geduckt hinter dem Schild
  sturm: { kolben: 'sturm_reskin_3', ausholen: 'sturm_reskin_1', loslassen: 'sturm_reskin_1', anlegen: 'sturm_reskin_2', knien: 'sturm_reskin_2', graben: 'sturm_reskin_3', getroffen: 'sturm_reskin_4' },
  pionier: { bereit: 'pionier_1', kolben: 'pionier_2', schneiden: 'pionier_posen_1', ladung: 'pionier_posen_2', graben: 'pionier_posen_3', getroffen: 'pionier_posen_4', anlegen: 'pionier_posen2_1', knien: 'pionier_posen2_2', lauf: 'pionier_posen2_3' },   // Runde 2: Schuss-Posen; Nahkampf weiter mit der Schaufel
  pionierD: { bereit: 'pionier_1', kolben: 'pionier_posen2_4', schneiden: 'pionier_posen_1', ladung: 'pionier_posen_2', mine: 'pionier_3', graben: 'pionier_posen_3', getroffen: 'pionier_posen_4', anlegen: 'pionier_posen2_1', knien: 'pionier_posen2_2', lauf: 'pionier_posen2_3' },   // Runde 2: Schuss-Posen, Nahkampf-Vorstoß mit Gewehr
  // weitere Posenbögen (2026-11-20, frei verteilte Figuren, figure_cut.py FIGUREN_POSEN); lauf = beim Ziehen
  feldscher: { bereit: 'sanitaeter_1', lauf: 'sanitaeter_posen_3', lauf2: 'sanitaeter_posen_1', heilen: 'sanitaeter_posen_2', getroffen: 'sanitaeter_posen_4' },
  heiler: { bereit: 'sanitaeter_1', lauf: 'sanitaeter_posen_3', lauf2: 'sanitaeter_posen_1', heilen: 'sanitaeter_posen_2', getroffen: 'sanitaeter_posen_4' },
  flammen: { bereit: 'flammen_1', lauf: 'flammen_posen_1', anlegen: 'flammen_posen_2', knien: 'flammen_posen_2', getroffen: 'flammen_posen_4' },
  brand: { bereit: 'flammen_1', lauf: 'flammen_posen_3', anlegen: 'flammen_posen_2', knien: 'flammen_posen_2', getroffen: 'flammen_posen_4' },
  stahl: { bereit: 'stahl_1', lauf: 'kampfanzug_posen_1', kolben: 'kampfanzug_posen_2', anlegen: 'kampfanzug_posen_3', knien: 'kampfanzug_posen_3', getroffen: 'kampfanzug_posen_4' },
  panzerk: { bereit: 'panzerknecht_1', lauf: 'kampfanzug_posen_1', kolben: 'kampfanzug_posen_2', anlegen: 'kampfanzug_posen_3', knien: 'kampfanzug_posen_3', getroffen: 'kampfanzug_posen_4' },
  werkstatt: { bereit: 'versorgung_1', lauf: 'versorgung_posen_3', reparieren: 'versorgung_posen_1', reparieren2: 'versorgung_posen2_3', bergen: 'versorgung_posen2_4', nachladen: 'versorgung_posen2_1', getroffen: 'versorgung_posen_4' },
  munition: { bereit: 'versorgung_1', lauf: 'versorgung_posen_1', reparieren: 'versorgung_posen_2', nachladen: 'versorgung_posen_3', getroffen: 'versorgung_posen_4' },
  schildwall: { bereit: 'schildwall_1', kolben: 'schildwall_posen_1', hiebAus: 'schildwall_posen2_1', hieb: 'schildwall_posen2_2', lauf: 'schildwall_posen_3', anlegen: 'schildwall_posen_2', knien: 'schildwall_posen_2', halten: 'schildwall_posen2_3', getroffen: 'schildwall_posen_4' },
  schwer: { bereit: 'schwer_posen_3',   /* U4a: neuer Bogen (Kürassierhelm) auch in Ruhe – Schilde geschlossen */ kolben: 'schwer_posen_1', hiebAus: 'schwer_posen_1', hieb: 'schwer_posen_2', halten: 'schwer_posen_3', getroffen: 'schwer_posen_4' },
  scharf: { bereit: 'scharfschuetze_1', lauf: 'scharfschuetze_posen_2', anlegen: 'scharfschuetze_posen_1', knien: 'scharfschuetze_posen_3', getroffen: 'scharfschuetze_posen_4' },
  pirsch: { bereit: 'pirschjaeger_1', lauf: 'pirschjaeger_posen_3', anlegen: 'pirschjaeger_posen_1', knien: 'pirschjaeger_posen_2', getroffen: 'pirschjaeger_posen_4' },
  fernsprech: { bereit: 'fernsprech_1', lauf: 'melder_posen_1', funk: 'melder_posen_2', funk2: 'melder_posen_3', getroffen: 'melder_posen_4' },
  signal: { bereit: 'signal_1', lauf: 'melder_posen_1', funk: 'melder_posen_2', funk2: 'melder_posen_3', getroffen: 'melder_posen_4' },
  // Hauptmann: Einzelmodell – solange eine Pose läuft, wird das ganze Bild getauscht (newFigs)
  hauptA: { befehl: 'hauptmann_posen_1', anlegen: 'hauptmann_posen_2', knien: 'hauptmann_posen_2', fernglas: 'hauptmann_posen_3', getroffen: 'hauptmann_posen_4' },
  hauptD: { befehl: 'hauptmann_posen_1', anlegen: 'hauptmann_posen_2', knien: 'hauptmann_posen_2', fernglas: 'hauptmann_posen_3', getroffen: 'hauptmann_posen_4' },
  mineur: { bereit: 'mineur_1', hacke: 'mineur_posen_1', ladung: 'mineur_posen_2', kolben: 'mineur_posen_3', getroffen: 'mineur_posen_4' },
  // Posenbögen Runde 2 (2026-11-21, entwurf/POSEN_PROMPTS.md R1–R8). Reiter: Galopp beim Ziehen, Hieb bzw. Lanzenstoß, Aufbäumen (bei Treffern), Getroffen
  reiter: { lauf: 'stahlreiter_reskin_2', kolben: 'stahlreiter_reskin_2', hieb: 'stahlreiter_reskin_3', aufbaeumen: 'stahlreiter_reskin_3', getroffen: 'stahlreiter_reskin_3' },   // R4: Stahlreiter – Galopp mit erhobenem Schwert, aufbäumend mit Seitenhieb
  lanzeD: { lauf: 'reiter_posen_1', kolben: 'reiter_posen_1', aufbaeumen: 'reiter_posen_3', getroffen: 'reiter_posen_4' },
  // Eingreiftrupp: Bajonett-Angriff oder Keulenhieb (Ausholen mit „Keule erhoben“ aus dem Grundbogen, dann Durchzug), Panzergranaten-Bündel werfen
  eingreif: { kolben: 'eingreif_posen_1', hieb: 'eingreif_posen_2', hiebAus: 'eingreif_3', ausholen: 'eingreif_posen_3', loslassen: 'eingreif_posen_3', getroffen: 'eingreif_posen_4' },
  gasschutz: { anlegen: 'gasschutz_posen_1', knien: 'gasschutz_posen_3', spruehen: 'gasschutz_posen_2', getroffen: 'gasschutz_posen_4' },
  banner: { lauf: 'banner_posen_1', rammen: 'banner_posen_2', getroffen: 'banner_posen2_2', anlegen: 'banner_posen3_1', knien: 'banner_posen3_1' },   // Pistole: Fahne in der linken Hand
  // R9 Panzerbüchse (Einzelmodell, 2 Mann): Schütze kniend angelegt neben dem Ladeschützen, geht mit Gewehr über der Schulter, getroffen (Schütze oder Ladeschütze)
  // Helden: Rote Faust – Faustschlag mit Ausholen (Faust vor der Brust), Revolver, Getroffen; Kürassier – Schwert über der Schulter beim Ziehen, Querhieb bzw. Hieb über die Schulter, Getroffen kniend
  faust: { kolben: 'held_posen_2', hieb: 'held_posen_2', hiebAus: 'held_posen_1', anlegen: 'held_posen2_1', knien: 'held_posen2_1', getroffen: 'held_posen2_2' },
  kuerass: { lauf: 'held_2', kolben: 'held_posen2_1', hieb: 'held_posen_2', hiebAus: 'held_posen_1', getroffen: 'held_posen2_2' },
  buechse: { anlegen: 'panzerbuechse_posen_1', knien: 'panzerbuechse_posen_1', lauf: 'panzerbuechse_posen_2', getroffen: 'panzerbuechse_posen_3', getroffen2: 'panzerbuechse_posen_4' },
  // Generäle (Einzelmodell mit Fahnenträger): Befehl zeigend, großer Befehl mit erhobenem Säbel, Pistolenschuss, Getroffen
  generalA: { befehl: 'general_posen2_2', grossbefehl: 'general_posen2_1', kolben: 'general_posen3_2', hiebAus: 'general_posen2_1', hieb: 'general_posen3_1',   /* F101: Säbelstoß, Hieb schräg nach unten */ anlegen: 'general_posen_3', knien: 'general_posen_3', getroffen: 'general_posen_4' },
  generalD: { befehl: 'general_posen_2', grossbefehl: 'general_posen_1', kolben: 'general_posen_1',   /* F101: bis ein Hieb-Bogen kommt, Säbel erhoben */ anlegen: 'general_posen2_1', knien: 'general_posen2_1', getroffen: 'general_posen2_2' } };
const poseHat = (u, art) => !!(u && POSE_SETS[u.type] && POSE_SETS[u.type][art]);
const POSE_VERSATZ = 60;   // ms je Figur (dazu etwas Zufall aus Einheit und Platz)
const posenAn = u => !!(u && POSE_TYPEN.has(u.type) && fac(u.side) !== 'F');
// M7 (2026-11-22): letzter Angreifer (Schuss, Granate, Nahkampf, Spezialschlag) – „getroffen“ taumelt und kippt von ihm weg, auch wenn er von hinten kommt
let letzterAngreifer = null;
function pose(id, art, dauer, o = {}) { const d = DU.get(id), u = unitById(id); if (!d || !posenAn(u)) return false;
  if (art === 'getroffen' && o.von == null && letzterAngreifer && letzterAngreifer.id !== id && performance.now() - letzterAngreifer.t < 3000) { const ad = DU.get(letzterAngreifer.id); if (ad) o = { ...o, von: ad.x }; } if (art === 'kolben' && poseHat(u, 'hieb') && Math.random() < 0.5) art = 'hieb'; if (art !== 'kolben') { const fs = [art, art + '2', art + '3'].filter((x, i) => !i || poseHat(u, x)); art = fs[Math.floor(Math.random() * fs.length)]; }   /* U4a: bis zu drei Fassungen gleich oft */ /* K13 (2026-11-22): zweite Fassung je Pose (getroffen2, funk2, lauf2, reparieren2 …), zufällig */ d.pose = { art, t0: now, dauer, ...o }; return true; }
const poseSchiessen = u => { const d = DU.get(u.id), h = G.map[u.c] && G.map[u.c][u.r]; return (d && d.vs && d.vs.dug) || (h && h.t === 'trench') || E.coverOf(G, u).tier >= 1 ? 'knien' : 'anlegen'; };
// Bild und Bewegung einer Figur (j = Platz im Trupp): { im, dx, dy, rot } in Feldradien, rot > 0 = nach vorn geneigt
// F99 (2026-11-22): in Feuerbereitschaft statt Ruhe die Zielpose (kniend, wo es eine gibt), solange die Bereitschaft gilt
const wachArt = (u, PB) => u.ow && E.alive(u) ? (PB.knien ? 'knien' : PB.anlegen ? 'anlegen' : null) : null;
function poseFigur(u, d, j, fallback) {
  const PB = POSE_SETS[u.type] || POSE_BILD, pre = u.side === 'A' ? 'konkordat_' : 'aschenwacht_', wa = wachArt(u, PB), ruhe = { im: figImg(pre + (wa ? PB[wa] : PB.bereit)) || figImg(pre + PB.bereit) || fallback, dx: 0, dy: 0, rot: 0, ruhe: !wa };   // U2: ruhe = Figur darf als Klon-Abwechslung gespiegelt werden
  const P0 = d.pose; if (!P0) return ruhe;
  const vs = P0.gleich ? 0 : j * (massAn() ? MASS.versatz : POSE_VERSATZ) + ((u.id * 37 + j * 53) % 41), el = (now - P0.t0) * speed - vs;
  if (j === 0 && (now - P0.t0) * speed > P0.dauer + 400) { d.pose = null; return ruhe; }
  if (el < 0 || el > P0.dauer) return ruhe;
  let art = P0.art, dx = 0, dy = 0, rot = 0; const q = el / P0.dauer;
  if (art === 'anlegen' || art === 'knien') {   // Rückstoß: beim eigenen Schuss kurz zurück, dann wieder ruhig
    const st = P0.schuss ? P0.schuss[j % P0.schuss.length] + 130 : 220, z = el - st;
    if (z >= 0 && z < 160) { const k = 1 - z / 160; dx = -0.045 * k; rot = -0.06 * k; }
  } else if (art === 'kolben') { const k = Math.sin(Math.PI * Math.min(1, q * 1.25)); dx = 0.16 * k; rot = 0.07 * k; }   // kurzer Vorstoß
  else if (art === 'hieb') { const h0 = P0.dauer * 0.4; if (el < h0) { art = 'hiebAus'; dx = -0.03 * el / h0; rot = -0.05 * el / h0; } else { const k = Math.sin(Math.PI * Math.min(1, (el - h0) / (P0.dauer - h0) * 1.2)); dx = 0.16 * k; rot = 0.08 * k; } }   // Runde 2: Keule erhoben → Durchzug
  else if (art === 'aufbaeumen') { const k = Math.sin(Math.PI * q); dy = -0.06 * k; rot = -0.05 * k; }
  else if (art === 'sprung') { const k = Math.sin(Math.PI * q); dy = -0.12 * k; rot = 0.06 * k; }
  else if (art === 'graben') { dy = 0.035 * (0.5 - 0.5 * Math.cos(2 * Math.PI * el / 520)); rot = 0.03 * Math.sin(2 * Math.PI * el / 520); }   // im Takt der Schaufel
  else if (art === 'wurf') { const h0 = P0.dauer * 0.45; art = el < h0 ? 'ausholen' : 'loslassen'; if (art === 'ausholen') { dx = -0.03 * el / h0; rot = -0.05 * el / h0; } else dx = 0.05 * Math.sin(Math.PI * Math.min(1, (el - h0) / (P0.dauer * 0.4))); }
  else if (art === 'getroffen' && PB.wank) { const k = Math.sin(Math.PI * Math.min(1, q * 1.35)); dx = -0.05 * k; rot = -PB.wank * k + 0.03 * Math.sin(Math.PI * Math.max(0, q * 1.35 - 1) / 0.35); }   // Wanken um den Fußpunkt (Ordensschreiter): nach hinten kippen, kurzer Rückstoß, Ruhe
  else if (art === 'getroffen') { const k = Math.sin(Math.PI * q); dx = -0.07 * k; rot = -0.09 * Math.sin(Math.PI * 2.2 * q) * (1 - q); }   // taumelt zurück
  const hinten = art === 'getroffen' && P0.von != null && (facesLeft(d.face) ? P0.von > d.x + 1 : P0.von < d.x - 1);   // M7: Angreifer im Rücken – nach vorn taumeln; F97 (2026-11-22): Blickrichtung bleibt, nur das Kippen geht vom Angreifer weg
  if (hinten) { dx = -dx; rot = -rot; }
  const vorKipp = art === 'getroffen' && !!PB[art] && GETROFFEN_SPIEGEL.has(pre + PB[art]);   // F97: Bild kippt nach vorn – statt es zu spiegeln (sah wie Umdrehen aus) um den Fußpunkt nach hinten neigen
  if (vorKipp && !hinten) rot -= 0.24 * Math.min(1, q * 6);
  return { im: (PB[art] && figImg(pre + PB[art])) || ruhe.im, dx, dy, rot, spiegel: false };   // F97 (2026-11-22): nie spiegeln – Blickrichtung bleibt, gekippt wird nur über dx/rot
}
// F97 (2026-11-22): nicht mehr gespiegelt, sondern nach hinten geneigt (poseFigur, vorKipp). F77 (2026-11-21): Getroffen-Bilder, deren Figur zum Feind hin kippt (Kopf deutlich vor den Füßen in Blickrichtung, gemessen: Neigung ab +0,12), werden gespiegelt – sie fallen dann vom Angreifer weg
const GETROFFEN_SPIEGEL = new Set(['aschenwacht_eingreif_posen_4', 'aschenwacht_eiserne_huenen_posen_4', 'konkordat_loewenoger_posen_4', 'aschenwacht_gasschutz_posen_4',   /* Runde 2, gemessen +0,14 bis +0,34 */ 'konkordat_kampfanzug_posen_4', 'konkordat_scharfschuetze_posen_4', 'konkordat_mineur_posen_4', 'konkordat_schildwall_posen_4', 'konkordat_schildwall_posen2_4', 'konkordat_versorgung_posen_4', 'konkordat_melder_posen_4', 'aschenwacht_melder_posen_4', 'konkordat_soldat_posen_4', 'konkordat_sturm_posen_4', 'konkordat_flammen_posen_4', 'aschenwacht_sanitaeter_posen_4']);
// Granatwurf (für Einheiten mit Wurf-Fähigkeit; die Soldatenbilder haben im Spiel derzeit keine): Ausholen → Loslassen, Granate fliegt aus der Hand
async function poseWurf(id, x2, y2) {
  const d = DU.get(id), u = unitById(id); if (!d || !u) return;
  d.face = x2 >= d.x ? 0 : 3; const dauer = 800; pose(id, 'wurf', dauer, { gleich: true });
  await wait(dauer * 0.45);
  const vor = facesLeft(d.face) ? -1 : 1, s = L.s;
  shells.push({ fxi: u.side === 'A' ? 3 : 2, fxs: 0.75, x1: d.x + vor * s * 0.3, y1: d.y - s * 0.55, x2, y2, t: 0, dur: 18, arc: 1.0, spin: true, img: u.side === 'A' ? 'pine' : 'stick', sz: 0.3 });
  await wait(dauer * 0.55);
}
// F46 (2026-11-21): liegend bzw. niedrig gemalte Trupps sinken im Graben weniger tief ein (sonst sieht man sie kaum)
const GRABEN_TIEFE = { buechse: 0.35, pirsch: 0.5, scharf: 0.5 };
// L1 (2026-11-25, Fable-Bremsen 1 und 3): Canvas-Filter und Farbverläufe nicht mehr in jedem Bild – je Figurenbild und Filter einmal vorrechnen und merken (wie bwBild).
// Rückweg zum Vergleich: window.LEISTUNG_ALT = true (alles wie vorher in jedem Bild).
const FILT_C = new WeakMap();
function filtBild(im, filt) {   // Bild mit fertig eingerechnetem Filter (Leinwand mit naturalWidth/naturalHeight wie bwBild)
  if (!filt || window.LEISTUNG_ALT || !im) return im; let m = FILT_C.get(im); if (!m) FILT_C.set(im, m = new Map()); let c = m.get(filt); if (c) return c;
  const w = im.naturalWidth || im.width, h = im.naturalHeight || im.height; if (!w || !h) return im;
  c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); x.filter = filt; x.drawImage(im, 0, 0, w, h);
  c.naturalWidth = w; c.naturalHeight = h; c._key = im._key; m.set(filt, c); return c;
}
const SCHATTEN_C = {};
function kontaktBild() {   // Kontaktschatten (weicher Fleck + Kern) als fertiges Bild je Bildwirkung; Maße relativ: Fleck = ganze Fläche, Kern 0,45/(1+0,12·BW) breit
  const key = BW + ':' + BW_SCH[BW]; if (SCHATTEN_C[key]) return SCHATTEN_C[key]; const N = 128, c = document.createElement('canvas'); c.width = c.height = N; const x = c.getContext('2d'), m = N / 2, f = BW ? 1 + 0.12 * BW : 1;
  const sg = x.createRadialGradient(m, m, 0, m, m, m); sg.addColorStop(0, `rgba(6,4,3,${bwA(0.72)})`); sg.addColorStop(0.5, `rgba(6,4,3,${bwA(0.42)})`); sg.addColorStop(1, 'rgba(6,4,3,0)'); x.fillStyle = sg; x.fillRect(0, 0, N, N);
  x.fillStyle = `rgba(4,3,2,${bwA(0.55)})`; x.beginPath(); x.ellipse(m, m, m * 0.45 / f, m * 0.42 / f, 0, 0, 7); x.fill(); return (SCHATTEN_C[key] = c);
}
const KETTE_SCH = new WeakMap();
function ketteSchatten(im, lp, sh) {   // weicher Schatten unter den Ketten als fertiges Bild je Fahrzeugbild (Maß sh: Verhältnis s zu h, je Bild fest); Bildkoordinaten in Bildbreiten
  let c = KETTE_SCH.get(im); if (c) return c; const H0 = 256, W0 = H0 * im.naturalWidth / im.naturalHeight, s0 = H0 * sh, pad = Math.ceil(s0 * 0.1) + 4;
  c = document.createElement('canvas'); c.width = Math.ceil(W0 + 2 * pad); c.height = Math.ceil(H0 + 2 * pad); const x = c.getContext('2d'); x.filter = `blur(${Math.max(1, s0 * 0.022)}px)`; x.fillStyle = 'rgba(4,3,2,0.85)'; x.beginPath();
  lp.forEach((q, i) => x[i ? 'lineTo' : 'moveTo'](pad + q[0] * W0, pad + q[1] * H0 + s0 * 0.012)); for (let i = lp.length - 1; i >= 0; i--) x.lineTo(pad + lp[i][0] * W0, pad + lp[i][1] * H0 - s0 * 0.13);
  x.closePath(); x.fill(); c._pad = pad; c._W0 = W0; KETTE_SCH.set(im, c); return c;
}
// U2 (2026-11-25): Klone aufbrechen – jede Figur leicht anders: Größe ±6 %, Neigung ±0,035, Versatz ±0,035 Feldradien; in Ruhe (ganzer Trupp ohne Pose,
// Bild = Ruhepose) schaute bis U2b jede fünfte Figur zur Seite (KLON.spiegel, jetzt 0). Fest je Einheit und Figur. Rückweg window.KLONE_ALT.
const KLON = { sz: 0.06, rot: 0.035, jit: 0.035, spiegel: 0 }   /* U2b: Spiegeln aus (Enrico 15:10) */, KLON_NULL = { sz: 1, rot: 0, jx: 0, jy: 0, sp: false };
function klonVar(u, d, i, pa) {
  if (window.KLONE_ALT) return KLON_NULL; const h = k => { const v = Math.sin((u.id * 12.9898 + i * 78.233 + k * 37.719) * 43758.5453); return v - Math.floor(v); };
  const ruhig = !d.pose && !(d.vs && (d.vs.supp > 0 || d.vs.flee)) && (pa ? pa.ruhe : posenAn(u) === false);
  return { sz: 1 + (h(1) - 0.5) * 2 * KLON.sz, rot: (h(2) - 0.5) * 2 * KLON.rot, jx: (h(3) - 0.5) * 2 * KLON.jit, jy: (h(4) - 0.5) * 2 * KLON.jit * 0.6, sp: ruhig && !!pa && h(5) < KLON.spiegel };
}
// U5b (2026-11-26): Gefallene Modelle. Jede Figur eines Trupps hat einen festen Platz (Index); sinkt die gezeigte Stärke unter die Schwelle
// eines Modells, fällt eine zufällige stehende Figur (weg vom letzten Angreifer), bleibt liegen und verblasst nach LEICHE_RUNDEN Runden.
// Ohne Blut verblasst sie gleich nach dem Fallen. Steigt die Stärke wieder (Versorgen), steht eine Gefallene wieder auf (ohne Bild).
// Fahrzeuge, Schreiter und Einzelmodelle fallen nicht (U8/Wrack). Rückweg window.FALLEN_ALT. Test: __dbg.leichen.
const LEICHEN = [], LEICHE_RUNDEN = 3, LEICHE_MAX = 220, FALL_MS = 460;
function stehendeGruppe(u, d, gr) {   // U4 Teil 3: feste Reihenfolge der Verluste (Beobachter, Lader, Schütze …), Gerät fällt nie
  const weg = d.weg || (d.weg = new Set()), mann = gr.fall.length, nM = Math.max(1, Math.min(mann, Math.ceil(d.str / (10 / mann) - 0.001))), soll = new Set(gr.fall.slice(0, mann - nM));
  const erst = !d._wegDa; d._wegDa = true; for (const i of [...weg]) if (!soll.has(i)) weg.delete(i);
  for (const i of soll) if (!weg.has(i)) { weg.add(i); if (!erst) figurSpritzer(u, d, i); if (!erst && window.GEFALLEN_AN) leicheNeu(u, d, i, false); }
  return gr.slots.map((_, i) => i).filter(i => !weg.has(i));
}
function stehende(u, d, max, n) {
  const weg = d.weg || (d.weg = new Set());
  while (weg.size > max - n) { const a = [...weg]; weg.delete(a[Math.floor(Math.random() * a.length)]); }   // Stärke gestiegen: eine steht wieder
  const erst = !d._wegDa; d._wegDa = true;   // U3: beim ersten Zeichnen fällt niemand „neu“ (kein Spritzer für alte Verluste)
  while (weg.size < max - n) { const frei = []; for (let i = 0; i < max; i++) if (!weg.has(i)) frei.push(i); const i = frei[Math.floor(Math.random() * frei.length)]; weg.add(i); if (!erst) figurSpritzer(u, d, i); if (window.GEFALLEN_AN) leicheNeu(u, d, i, false); }   // Punkt 98 (Enrico 17:30): Gefallene standardmäßig aus – der Mann verschwindet einfach
  const out = []; for (let i = 0; i < max; i++) if (!weg.has(i)) out.push(i); return out;
}
// U3 (Punkt 118.2): Treffer-Spritzer an der Figur, die fällt – im Moment des Einschlags (die gezeigte Stärke sinkt mit dem Ereignis 'hit'), Größe nach Figurhöhe.
// Gepanzerte und Maschinen Funken statt Blut; Blut-Schalter und Bildwirkung gelten. Rückweg window.FIGURSPRITZ_ALT.
function figurSpritzer(u, d, i) {
  if (window.FIGURSPRITZ_ALT || window.TREFFERBLUT_ALT || !BW) return; const f = d.figIm && d.figIm[i]; if (!f || !(d.alpha > 0)) return;
  const T = TYPES[u.type], hart = istMaschine(u) || !!T.suit || !!T.gepanzert, la = letzterAngreifer && performance.now() - letzterAngreifer.t < 3000 ? DU.get(letzterAngreifer.id) : null, fl = la ? la.x > f.wx : Math.random() < 0.5, x = f.wx, y = f.wy - f.h * 0.55;
  if (hart) { fx('funken', null, x, y, { anchor: 'mitte', life: 16, fadeOut: 0.6, mul: figMul(f.h, 0.9, FX_SZ.funken, 0.6), flip: Math.random() < 0.5 }); return; }
  if (!blood) return; fx('blut', Math.floor(Math.random() * 3), x + (fl ? -1 : 1) * f.h * 0.15, y, { anchor: 'mitte', life: 28, mul: figMul(f.h, 0.75, FX_SZ.blut, 0.4), grow: 0.3, flip: fl, filter: BLUT_FILTER });
  blutFleck(x + (fl ? -1 : 1) * f.h * 0.2, f.wy + L.s * 0.03, figMul(f.h, 0.55, FX_SZ.blut, 0.28));
}
function leicheNeu(u, d, i, alle) {
  const f = d.figIm && d.figIm[i]; if (!f || !f.im || !(d.alpha > 0)) return;
  const la = letzterAngreifer && performance.now() - letzterAngreifer.t < 4000 ? DU.get(letzterAngreifer.id) : null;
  let dir = la && Math.abs(la.x - f.wx) > 1 ? (la.x < f.wx ? 1 : -1) : (Math.random() < 0.5 ? -1 : 1);
  if (Math.abs(f.wx + dir * f.h * 0.9 - d.x) > L.s * 0.8) dir = -dir;   // liegend nicht ins Nachbarfeld
  const PB = posenAn(u) && (POSE_SETS[u.type] || POSE_BILD), gim = !window.GEFALLEN_QUETSCH && PB && PB.getroffen && figImg((u.side === 'A' ? 'konkordat_' : 'aschenwacht_') + PB.getroffen);   // Punkt 93: die Getroffen-Pose liegt auf der Seite
  LEICHEN.push({ uid: u.id, im: gim || f.im, wx: f.wx, winkel: (80 + Math.random() * 10) * Math.PI / 180, wy: f.wy, w: f.w, h: f.h, flip: f.flip, dir, t0: performance.now() + (alle ? Math.random() * 260 : Math.random() * 90), runde: G.turn, rot: (Math.random() - 0.5) * 0.22, graben: f.abs, cut: f.cut });
  if (LEICHEN.length > LEICHE_MAX) LEICHEN.shift();
}
function alleFallen(u, d) {   // aufgerieben: die letzten stehenden Figuren fallen alle
  if (!window.GEFALLEN_AN || window.FALLEN_ALT || !d || !d.figIm || TYPES[u.type].cls === 'walker' || TYPES[u.type].cls === 'art') return false;
  let n = 0; for (let i = 0; i < d.figIm.length; i++) if (d.figIm[i] && !d.figIm[i].geraet && !(d.weg && d.weg.has(i))) { leicheNeu(u, d, i, true); n++; }
  return n > 0;
}
function leicheAlpha(c, t) {
  const land = c.t0 + FALL_MS / Math.max(0.5, speed);
  if (!blood) return t < land ? 1 : 1 - (t - land) / 1200;
  if (G && G.turn - c.runde >= LEICHE_RUNDEN) { if (!c.fadeT) c.fadeT = t; return 1 - (t - c.fadeT) / 2500; }
  return 1;
}
function leicheZeichne(g, s, c, a) {
  const t = performance.now(), p = Math.max(0, Math.min(1, (t - c.t0) / (FALL_MS / Math.max(0.5, speed)))), e = p * p, k = VIEW.bbK || 0.6;   // fällt schneller werdend
  const ks = 1 - e * (1 - Math.max(0.35, k * 0.75));   // liegend von oben gesehen: Dicke verkürzt
  g.save(); g.globalAlpha = a;
  if (e > 0.5 && !c.graben) { const ww = c.h * 0.62, sk = 0.32 * Math.max(0.55, k); g.globalAlpha = a * Math.min(1, (e - 0.5) * 2) * 0.75; g.drawImage(kontaktBild(), c.wx + c.dir * c.h * 0.45 - ww, c.wy - ww * sk, ww * 2, ww * 2 * sk); g.globalAlpha = a; }   // Schatten unter dem Liegenden
  if (window.GEFALLEN_QUETSCH) {   // Rückweg: U5b-Fassung (flach gedrückt)
    if (c.graben) { g.translate(c.wx, c.wy + e * c.h * 0.12); g.scale(1, 1 - 0.55 * e); g.rotate(c.dir * e * 0.45 + c.rot * e); }
    else { g.translate(c.wx, c.wy - e * c.w * 0.18 * ks); g.scale(1, ks); g.rotate(c.dir * e * (Math.PI / 2 - 0.1) + c.rot * e); } }
  else if (c.graben && c.cut && window.GBau) { const ei = GBau.eingesunken(filtBild(c.im, 'brightness(0.74) saturate(0.82)'), c.cut), hh = c.h * ei.frac; g.translate(c.wx, c.wy + e * c.h * 0.1); g.rotate(c.dir * e * 0.7 + c.rot * e); if (c.flip) g.scale(-1, 1); g.drawImage(ei.cv, -c.w * 0.5, -hh + c.h * 0.02, c.w, hh); g.restore(); return; }   // Punkt 93: im Graben wie die Stehenden unten abgeschnitten, gegen die Wand gesunken
  else if (c.graben) { g.translate(c.wx, c.wy + e * c.h * 0.22); g.rotate(c.dir * e * 0.95 + c.rot * e); }
  else { g.translate(c.wx, c.wy - e * c.w * 0.3); g.rotate(c.dir * e * c.winkel + c.rot * e * 0.5); }   // Punkt 93: Getroffen-Pose 80–90° auf die Seite, nicht flach gedrückt
  if (c.flip) g.scale(-1, 1);
  g.drawImage(filtBild(c.im, 'brightness(0.74) saturate(0.82)'), -c.w * 0.5, -c.h, c.w, c.h);
  g.restore();
}
function drawNewFigs(g, u, d, nf, x, y, flip, A0, done) {
  const flipL = flip; if (nf.links) flip = flip ? 0 : 1;   // F89: flip = tatsächlich gespiegelt, flipL = Blick nach links (für Kästen/Mündung)
  if (VIEW.figFade) A0 *= 1 - 0.35 * VIEW.figFade;   // Strategie-Marken eingeblendet: Figuren treten zurück
  const s = L.s, k = kAt(x, y), duck = d.vs.supp > 0 ? s * 0.08 : 0, list = [];
  const pl0 = gbPlatz(u, d), reiter = TYPES[u.type] && TYPES[u.type].cls === 'cav' && !window.REITER_GRABEN_ALT, pl = reiter && pl0 && pl0.pts ? null : pl0, [pcx, pcy] = pl ? center(u.c, u.r) : [0, 0];   // Punkt 108: Reiter nie auf die Grabenplätze (standen am Grabenrand ein Feld zu hoch), Rückweg REITER_GRABEN_ALT   // Gelände-Bausteine: Graben (Linie, abgesenkt), Ruine (gestaucht)
  if (nf.trupp) {
    const n = Math.max(1, Math.min(nf.max, Math.ceil(d.str / (10 / nf.max) - 0.001)));
    const gr = nf.gruppe, fest = !window.FALLEN_ALT || gr, nP = fest ? nf.max : n, idx = gr ? stehendeGruppe(u, d, gr) : fest ? stehende(u, d, nf.max, n) : [...Array(n).keys()];   // U5b: jede Figur behält ihren Platz, gefallene fehlen (Rückweg FALLEN_ALT)
    if (fest) d.figIm = d.figIm || [];
    for (const i of idx) {
      const imI = gr ? nf.ims[i] : nf.ims[(u.id * 3 + i) % nf.ims.length], pa0 = gr ? (i === gr.offizier && d.pose && posenAn(u) ? poseFigur(u, d, i, imI) : null) : posenAn(u) ? poseFigur(u, d, i, imI) : null, pa = gr && pa0 && pa0.ruhe ? null : pa0, im = pa ? pa.im : imI;   // U4 Teil 3: in der Gruppe posiert nur der Offizier   /* R4: Ruhe ohne bereit = eigene Figur des Grundbogens */   // Posenwechsel (Stufe 1)
      const kv = gr ? KLON_NULL : klonVar(u, d, i, pa);   // U2: Klone – je Figur eigene Größe, Neigung, Versatz, in Ruhe teils gespiegelt
      if (pl && pl.pts) { const q = pl.reihe ? pl.pts[Math.min(pl.pts.length - 1, Math.floor((i + 0.5) * pl.pts.length / nP))] : nP > 4 ? grabenPunkt(pl.pts, i, nP, s) : pl.pts[[1, 2, 0, 3][i] ?? i];   // U2: zehn Grabenplätze (bei weniger Figuren gleichmäßig verteilt); U1-Fassung als Rückweg
        const lieg = pl.reihe && !window.LIEGEND_ALT && TYPES[u.type].fig === 'sniper', mx = lieg ? pl.pts.reduce((a, t) => a + t[0], 0) / pl.pts.length : q[0];   // G7h-2: liegende Scharfschützen (lange Gewehre) auf die Grabenmitte statt in zwei Reihen; Rückweg LIEGEND_ALT
        list.push({ im, pa, kv, ox: (mx - pcx) / s, oy: (q[1] - pcy) / s, abs: true, i }); continue; }
      const slot = gr ? nf.slots[i] : nf.slots ? nf.slots[(i + u.id) % nf.slots.length] : FIG_SLOTS4[(i + u.id) % 4]; list.push({ im, pa, kv, ox: slot[0] + kv.jx, oy: slot[1] * (pl && pl.sy || 1) + kv.jy, i, geraet: !!(gr && gr.geraet && gr.geraet.includes(i)) });
    }
  } else if (pl && pl.pts && pl.reihe && !nf.vehicle && !window.G7H_ALT) { let q = pl.pts[0]; for (const t of pl.pts) if (Math.hypot(t[0] - pcx, t[1] - pcy - s * 0.15) < Math.hypot(q[0] - pcx, q[1] - pcy - s * 0.15)) q = t; list.push({ im: nf.ims[0], ox: (q[0] - pcx) / s, oy: (q[1] - pcy) / s }); }   // G7h (87.4): Einzelmodell (Geschütz) im Graben auf die Sohle, nicht halb auf der Lippe
  else list.push({ im: nf.ims[0], ox: 0, oy: nf.vehicle ? 0.22 : 0.15 });
  const sink = (pl && pl.sink && !nf.vehicle ? pl.sink * FIG_SH * s * (nf.massF || 1) * (GRABEN_TIEFE[u.type] || 1) : 0) + (nf.vehicle && d.vs && (d.vs.broken || d.vs.stuck) ? s * 0.16 : 0) + (!nf.vehicle && !(pl && pl.sink) && d.vs && d.vs.dug ? s * 0.12 * (nf.massF || 1) : 0);   // F36: eingegraben etwas tiefer   // im Graben tiefer; Fahrzeug festgefahren: Ketten im Schlamm eingesunken (Paket 8)
  { const bw = !window.BEIWERK_ALT && BEIWERK[u.type], bim = bw && !d.moving && figImg(bw[0]); if (bim && nf.trupp && !(pl && pl.pts)) list.push({ im: bim, ox: bw[1][0], oy: bw[1][1], geraet: true }); }   // U4 Teil 3: Beiwerk neben dem Trupp, nicht im Graben
  list.sort((a, b) => a.oy - b.oy);
  const hx = G.map[u.c] && G.map[u.c][u.r], dim = hx && DIM_T.has(hx.t) && !d.lunge;
  let topY = y - s;
  if (nf.deep) {   // Einzelmodelle mit Tiefe (MG, Geschütz, Gespann, Panzer): mittlere Unterkante auf den Feldboden, Schatten über die ganze Grundfläche
    const im = list[0].im, env = vehEnv(im);
    let h = im.naturalHeight / 320 * FIG_SH * s * (nf.tiefSc || 1), w = h * im.naturalWidth / im.naturalHeight;   // U1: Modelle mit Tiefe im Maßstab E1
    const wmax = (nf.vehicle || nf.gross ? FIGW_VEH : FIGW_MAX) * s; if (w > wmax) { h *= wmax / w; w = wmax; }
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
        const gr = g.createRadialGradient(0, 0, 0, 0, 0, Math.abs(x1 - x0) / 2 + s * 0.04); gr.addColorStop(0, `rgba(6,4,3,${bwA(0.6)})`); gr.addColorStop(0.7, `rgba(6,4,3,${bwA(0.4)})`); gr.addColorStop(1, 'rgba(6,4,3,0)');
        g.fillStyle = gr; g.beginPath(); g.arc(0, 0, Math.abs(x1 - x0) / 2 + s * 0.04, 0, 7); g.fill(); g.restore();
        const lp = [...lows].sort((p, q) => p[0] - q[0]);
        if (!window.LEISTUNG_ALT) { const kc = ketteSchatten(im, lp, s / h), k2 = w / kc._W0; g.save(); if (flip) { g.translate(x, 0); g.scale(-1, 1); g.translate(-x, 0); } g.drawImage(kc, x - w / 2 - kc._pad * k2, top - kc._pad * k2, kc.width * k2, kc.height * k2); g.restore(); }   // L1: fertiges Bild statt blur je Bild
        else { g.save(); g.filter = `blur(${Math.max(1, s * 0.022)}px)`; g.fillStyle = 'rgba(4,3,2,0.85)'; g.beginPath();
        lp.forEach((q, i) => g[i ? 'lineTo' : 'moveTo'](sx(q[0]), top + q[1] * h + s * 0.012));
        for (let i = lp.length - 1; i >= 0; i--) g.lineTo(sx(lp[i][0]), top + lp[i][1] * h - s * 0.13);
        g.closePath(); g.fill(); g.restore(); }
      } else {
      // breite flache Ellipse von vorn bis hinten, weich auslaufend
      g.save(); g.translate(cx, cy); g.scale(1, ry / rx);
      const ka = nf.kette ? 1.45 : 1, gr = g.createRadialGradient(0, 0, 0, 0, 0, rx * (nf.kette ? 1.12 : 1)); gr.addColorStop(0, `rgba(6,4,3,${bwA(0.55 * ka)})`); gr.addColorStop(0.65, `rgba(6,4,3,${bwA(0.32 * ka)})`); gr.addColorStop(1, 'rgba(6,4,3,0)');
      g.fillStyle = gr; g.beginPath(); g.arc(0, 0, rx * (nf.kette ? 1.12 : 1), 0, 7); g.fill(); g.restore();
      // kleine Kontaktflecken unter jedem Aufstandspunkt (Füße, Räder, Ketten), auch weiter hinten
      g.fillStyle = `rgba(4,3,2,${bwA(nf.kette ? 0.78 : 0.5)})`;
      for (let n = 0; n < lows.length; n++) { const q = lows[n], a = lows[n - 2], b = lows[n + 2];
        if ((a && a[1] > q[1]) || (b && b[1] > q[1])) continue;   // nur örtlich tiefste Punkte
        const ry2 = s * 0.045 * Math.max(0.6, k); g.beginPath(); g.ellipse(sx(q[0]), top + q[1] * h - ry2 * 0.4, s * 0.13, ry2, 0, 0, 7); g.fill(); }   // Mitte leicht über dem Aufstandspunkt: nichts ragt nach unten heraus
      }
    } else {
      g.fillStyle = `rgba(6,4,3,${bwA(0.45)})`; g.beginPath(); g.ellipse(x, fy, w * 0.45, s * 0.15 * k, 0, 0, 7); g.fill();
    }
    const filt = [nf.kette ? (KETTE_FILTER[nf.key] || 'brightness(0.84) contrast(0.92) saturate(0.8) sepia(0.1)') : '', done ? 'grayscale(0.75) brightness(0.8)' : '', dim ? 'brightness(0.8)' : ''].filter(Boolean).join(' ');   // Panzer: Farbstimmung der Umgebung
    if (done) g.globalAlpha = A0 * 0.85; const vorF = !!filt && !window.LEISTUNG_ALT; if (filt && !vorF) g.filter = filt;   // L1: Filter im Bild vorgerechnet
    g.save(); if (sink) { g.beginPath(); g.rect(x - w, top - h, w * 2, fy - top + h + sink * 0.2); g.clip(); }
    g.translate(x, top + sink * 0.8); if (flip) g.scale(-1, 1); g.drawImage(vorF ? filtBild(nf.kette ? schlammrand(im, env) : im, filt) : nf.kette ? schlammrand(im, env) : im, -w / 2, 0, w, h); g.restore(); d.bildLinks = !!flip !== !!nf.links;   // F83: gezeigte Blickrichtung (Test); F89: nach links gemalte Bilder
    d.fbx = [[x - w / 2 - d.x, top + sink * 0.8 - d.y, w, h, flipL]];
    { const mz = MUZ[nf.key]; if (mz) d.muz = [(flip ? -1 : 1) * (mz[0] - 0.5) * w + x - d.x, top + sink * 0.8 + mz[1] * h - d.y, flipL]; }   // Laufmündung (neue Ansicht)
    { const mz = MUZ2[nf.key]; d.muz2 = mz ? [(flip ? -1 : 1) * (mz[0] - 0.5) * w + x - d.x, top + sink * 0.8 + mz[1] * h - d.y, flip] : null; }   // Mündung der Zweitwaffe
    g.filter = 'none';
    if (u.type === 'ballon') drawBallon(g, s, u, x, top, w, h, flip, filt);
    return top;
  }
  for (const f of list) {
    const pa = f.pa, vor = flip ? -1 : 1, fx = x + (f.abs ? f.ox : flip ? -f.ox : f.ox) * s + (pa ? pa.dx * vor * s : 0), fy = y + f.oy * s * k + duck + (pa ? pa.dy * s : 0), prot = pa ? pa.rot : 0;
    let h = f.im.naturalHeight / 320 * FIG_SH * s * nf.sc, w = h * f.im.naturalWidth / f.im.naturalHeight;
    const wmax = (nf.vehicle || nf.gross ? FIGW_VEH : FIGW_MAX) * s * nf.sc; if (w > wmax) { h *= wmax / w; w = wmax; }
    if (f.kv) { h *= f.kv.sz; w *= f.kv.sz; }   // U2: Klone – Größe je Figur
    const prot2 = prot + (f.kv ? f.kv.rot : 0), flipF = !!flip !== !!(f.kv && f.kv.sp);
    // Bodenschatten
    g.filter = 'none'; g.globalAlpha = A0;
    // Kontaktschatten: weicher dunkler Fleck direkt unter den Füßen (verankert die Figur am Boden), darin ein kleiner kräftiger Kern
    const sw = Math.min(w * (nf.vehicle ? 0.5 : 0.36), s * (nf.vehicle ? 1.35 : 0.34)), sk = sw * 0.34 * Math.max(0.55, k);
    const kontakt = (k2 = 1) => { const ww = sw * (BW ? 1 + 0.12 * BW : 1) * k2; if (!window.LEISTUNG_ALT) { g.drawImage(kontaktBild(), fx - ww, fy - ww * sk / sw, ww * 2, ww * 2 * sk / sw); return; }   // L1: fertiges Bild statt Farbverlauf je Figur
      g.save(); g.translate(fx, fy); g.scale(1, sk / sw);
      const sg = g.createRadialGradient(0, 0, 0, 0, 0, ww); sg.addColorStop(0, `rgba(6,4,3,${bwA(0.72)})`); sg.addColorStop(0.5, `rgba(6,4,3,${bwA(0.42)})`); sg.addColorStop(1, 'rgba(6,4,3,0)');
      g.fillStyle = sg; g.beginPath(); g.arc(0, 0, ww, 0, 7); g.fill(); g.restore();
      g.fillStyle = `rgba(4,3,2,${bwA(0.55)})`; g.beginPath(); g.ellipse(fx, fy, sw * 0.45 * k2, sk * 0.42, 0, 0, 7); g.fill(); };
    if (!sink && !(BW && f.abs && pl && pl.cut)) kontakt();   // Bildwirkung: Grabenfiguren bekommen ihren Schatten erst beim Zeichnen nach Tiefe (auf der Sohle)
    const back = nf.trupp && f.oy < -0.1;
    const filt = [done ? 'grayscale(0.75) brightness(0.8)' : '', dim ? 'brightness(0.8)' : '', back ? 'brightness(0.86)' : ''].filter(Boolean).join(' ');
    if (done) g.globalAlpha = A0 * 0.85;
    const vorF = !!filt && !window.LEISTUNG_ALT, imF = vorF ? filtBild(f.im, filt) : f.im;   // L1: Filter (hintere Reihe, grau, dunkles Feld) einmal je Bild vorgerechnet
    if (filt && !vorF) g.filter = filt;
    const zeichne = (tf, al, fl) => { g.save(); if (tf) { g.setTransform(tf); g.globalAlpha = al; g.filter = (!vorF && fl) || 'none'; }
      if (f.abs && pl && pl.cut && window.GBau) {   // im Graben: unterer Teil bis etwa zur Hüfte weg, weich in die dunkle Sohle ausgeblendet – unabhängig von der Grabenrichtung
        if (BW) { const gl = g.globalAlpha; g.globalAlpha = gl * 0.75; kontakt(1.1); g.globalAlpha = gl; }   // Bildwirkung: Schatten auf der Grabensohle
        const e = GBau.eingesunken(imF, pl.cut), hh = h * e.frac; g.translate(fx, fy); if (flipF !== !!(pa && pa.spiegel)) g.scale(-1, 1); if (prot2) g.rotate(pa && pa.spiegel ? -prot2 : prot2); g.drawImage(e.cv, -w * 0.5, -hh + h * 0.02, w, hh);
      } else {
        if (sink) { g.beginPath(); g.rect(fx - w, fy - h * 2, w * 2, h * 2 + sink * 0.25); g.clip(); }
        g.translate(fx, fy + h * 0.012 + sink); if (flipF !== !!(pa && pa.spiegel)) g.scale(-1, 1); if (prot2) g.rotate(pa && pa.spiegel ? -prot2 : prot2); g.drawImage(imF, -w * 0.5, -h, w, h);   // Sohlen minimal in den Boden: kein Spalt
      }
      g.restore(); };
    if (d.figIm && f.i != null) d.figIm[f.i] = { im: f.im, wx: fx, wy: y + f.oy * s, w, h, flip: flipF, abs: !!f.abs, cut: f.abs && pl ? pl.cut : null, geraet: !!f.geraet };
    if (nf.gruppe && (f.geraet || nf.gruppe.muz === f.i)) { const mz = MUZ_FIG[f.im && f.im._key]; if (mz) { const x0 = fx - w / 2 - d.x; d.muz = [flipF ? x0 + w * (1 - mz[0]) : x0 + w * mz[0], fy - h - d.y + sink + h * mz[1], flipF]; } }   // U4 Teil 3: Mündung an der Waffe der Gruppe   // U5b: letzte Lage je Figur (für die Gefallenen)
    if (d.fbx) d.fbx.push([fx - w / 2 - d.x, fy - h - d.y + sink, w, h, flip, MUZ_FIG[f.im && f.im._key] || MUZ[f.im && f.im._key] || null]);   // M3 (2026-11-22): Helden/Generäle (Einzelmodelle über diesen Weg) lesen auch MUZ   // 6.: Mündung aus dem Bild (MUZ_FIG)
    if (!(pa && pa.spiegel)) d.bildLinks = !!flip;   // F83: gezeigte Blickrichtung (Test; Getroffen-Spiegelung zählt nicht)
    if (FIGQ && f.abs) { const tf = g.getTransform(), al = g.globalAlpha, fl = filt; FIGQ.push({ y: y + f.oy * s, f: () => zeichne(tf, al, fl) }); }   // Graben: später nach Tiefe
    else zeichne();
    topY = Math.min(topY, fy - h);
  }
  g.filter = 'none';
  return topY;
}

// ---------- Gekippte Ansicht: Kamera und Boden ----------
// Alles rechnet in einem flachen Weltbild (K = 1, Feldradius WS):
// center(), d.x/d.y, Hilfsmarkierungen und Effekte. Das Weltbild wird zeilenweise perspektivisch auf den Schirm projiziert
// (wie im Probebild entwurf/probe/?v=D). Einheiten stehen als aufrechte Aufsteller an ihrem Fußpunkt, nach Tiefe sortiert.
// Kamera: Ziel (CAM.x, CAM.y) auf dem Boden, Zoom CAM.z (1 = vorn ca. 8,5 Felder über die Bildbreite), Kippwinkel 39°,
// beim Herauszoomen steiler (bis 58° bei „ganze Karte“). Oben dunkler Himmel mit Rauch statt Leere.
// Noch nicht hier (Umbauplan): Hilfsmarkierungen/Effekte aufrecht (Schritt 2), Figurengröße 1,3 und Trupps (3), Aufsteller fürs Gelände (4).
const WS = 100;   // Feldradius im Weltbild (Pixel); vorn wird leicht vergrößert, weiter hinten verkleinert
const CAM = { x: 0, y: 0, z: 1, init: false };
const WCV = document.createElement('canvas'), WCTX = WCV.getContext('2d');
// F92 Schärfe (2026-11-22, Standard Stufe 1): 1 = Figuren und Boden mit imageSmoothingQuality 'high', 2 = dazu Boden-Mipmaps (Weltbild halb/viertel, Stufe je Schirmzeile nach Verkleinerung). Test __dbg.schaerfe(n)
let SCHAERFE = 1; const WMIP = [];   /* Enrico 2026-11-22 13:35: Stufe 1 als Standard */
function wMipBau() { let q = WCV; for (let i = 0; i < 3; i++) { const c = WMIP[i] || (WMIP[i] = document.createElement('canvas')), w = Math.max(1, q.width >> 1), h = Math.max(1, q.height >> 1); if (c.width !== w || c.height !== h) { c.width = w; c.height = h; } const x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.clearRect(0, 0, w, h); x.drawImage(q, 0, 0, w, h); q = c; } }
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
    if (SCHAERFE >= 2) {   // Verkleinerung dieser Zeile: waagerecht sw/W, senkrecht Abstand zur nächsten Schirmzeile im Weltbild
      const w2 = unproj(W / 2, ys + 1.5), vy = w2 ? Math.abs(w2[1] - wy) : 1, k = Math.max(sw / W, vy), lv = k < 1.6 ? -1 : k < 3.2 ? 0 : k < 6.4 ? 1 : 2;
      if (lv >= 0) { const f = 1 << (lv + 1); g.drawImage(WMIP[lv], (P.C[0] - sw / 2) / f, wy / f, sw / f, Math.max(1, vy) / f, 0, ys, W, 1); continue; }
    }
    g.drawImage(WCV, P.C[0] - sw / 2, wy, sw, 1, 0, ys, W, 1);
  }
  // Dunst nach hinten
  const fog = g.createLinearGradient(0, 0, 0, H); fog.addColorStop(0, 'rgba(18,13,11,0.55)'); fog.addColorStop(0.4, 'rgba(18,13,11,0.12)'); fog.addColorStop(1, 'rgba(18,13,11,0)');
  g.fillStyle = fog; g.fillRect(0, 0, W, H);
}
// Bäume durchsichtig (Enrico 2026-11-22, alle Karten): Bäume auf Feldern mit Einheit, unter der Maus und vor der gewählten Einheit weich auf BAUM_DURCH Deckkraft
const BAUM_A = new Map(), BAUM_DURCH = 0.4; let baumT = 0;
function baumZiele() {
  const z = new Set(); if (!G) return z;
  for (const u of G.units) if (E.alive(u)) { const d = DU.get(u.id); if (d && d.alpha > 0.05) z.add(u.c + ',' + u.r); }
  if (hoverHex) z.add(hoverHex[0] + ',' + hoverHex[1]);
  if (sel && E.alive(sel)) for (const [c, r] of E.neighbors(sel.c, sel.r)) if (center(c, r)[1] > center(sel.c, sel.r)[1] + 1) z.add(c + ',' + r);   // Felder davor (näher am Betrachter)
  return z;
}
function baumNachfuehren() {   // weich ein- und ausblenden (ca. 0,25 s)
  const t = performance.now(), dt = Math.min(0.1, (t - (baumT || t)) / 1000); baumT = t; const z = baumZiele(), k = 1 - Math.exp(-dt / 0.09);
  for (const key of z) if (!BAUM_A.has(key)) BAUM_A.set(key, 1);
  for (const [key, a] of BAUM_A) { const ziel = z.has(key) ? BAUM_DURCH : 1, n = a + (ziel - a) * k; if (Math.abs(n - 1) < 0.01 && ziel === 1) BAUM_A.delete(key); else BAUM_A.set(key, n); }
}
// Nebel am Kartenrand (Winterdorf, nur Bild): weicher, langsam ziehender Schleier an allen vier Rändern im Weltbild; Bildwirkung „aus“ = kein Nebel
function randNebel(g, s) {
  const W = L.W, y0 = L.top - s * 0.3, H = L.H, tz = now / 1000, st = BW >= 2 ? 1.15 : 1, band = s * 1.6;
  g.save(); g.globalCompositeOperation = 'source-over';
  const kante = (x0, y0_, x1, y1_, gx0, gy0, gx1, gy1) => { const gr = g.createLinearGradient(gx0, gy0, gx1, gy1); gr.addColorStop(0, `rgba(196,202,208,${0.34 * st})`); gr.addColorStop(1, 'rgba(196,202,208,0)'); g.fillStyle = gr; g.fillRect(x0, y0_, x1 - x0, y1_ - y0_); };
  kante(0, y0, band, H, 0, 0, band, 0); kante(W - band, y0, W, H, W, 0, W - band, 0); kante(0, y0, W, y0 + band, 0, y0, 0, y0 + band); kante(0, H - band, W, H, 0, H, 0, H - band);
  for (let i = 0; i < 26; i++) {   // ziehende Schwaden entlang der Ränder
    const seite = i % 4, f = ((i * 0.618 + tz * (0.006 + (i % 3) * 0.002)) % 1 + 1) % 1, rr = s * (1.1 + (i % 5) * 0.25), off = s * (0.2 + (i % 3) * 0.25);
    const x = seite === 0 ? off : seite === 1 ? W - off : f * W, y = seite === 2 ? y0 + off : seite === 3 ? H - off : y0 + f * (H - y0);
    const gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, `rgba(205,210,215,${0.2 * st})`); gr.addColorStop(1, 'rgba(205,210,215,0)'); g.fillStyle = gr; g.fillRect(x - rr, y - rr, rr * 2, rr * 2);
  }
  g.restore();
}
function drawTilt() {
  baumNachfuehren();
  camSetup();
  const s = L.s;
  WCTX.setTransform(1, 0, 0, 1, 0, 0);
  ctx = WCTX;   // flaches Weltbild: nur Boden und Bodenmarkierungen; alles Aufrechte kommt danach auf den Schirm
  try { drawGround(WCTX, s); drawDiaryMark(WCTX); if (BW && E.MAP.nebelRand) randNebel(WCTX, s); }
  finally { ctx = MAINCTX; }
  const g = MAINCTX; g.setTransform(1, 0, 0, 1, 0, 0);
  g.imageSmoothingQuality = SCHAERFE ? 'high' : 'low'; if (SCHAERFE >= 2) wMipBau();
  projectGround(g);
  // Aufrecht verankern: Element am Punkt (x, y) steht als Aufsteller dort (Maßstab und Bodenverkürzung der Tiefe)
  const up = (x, y) => { const b = bbAt(x, y); if (!b) return false; g.setTransform(b.sc, 0, 0, b.sc, b.px - b.sc * x, b.py - b.sc * y); VIEW.bbK = b.k; return true; };
  const flagsTief = GBW && gbAn();   // mit Gelände-Bausteinen: Zielflaggen nach Tiefe zwischen Grabenwände und Figuren einsortiert
  if (!flagsTief) { drawFlags(g, s, up); g.setTransform(1, 0, 0, 1, 0, 0); VIEW.bbK = null; }
  // Einheiten als Aufsteller am Fußpunkt; Marken und spätere Marken (MARKQ) behalten ihren Aufsteller
  UBOX.length = 0;
  const ul = unitList(), GP = GBW && gbAn() ? GBW.pieces : null, PEND = []; let gpi = 0;
  if (flagsTief) { for (const o of OBJECTIVES) PEND.push({ y: center(o.c, o.r)[1] + s * fahneOrt(o)[2], f: () => { drawFlags(g, s, up, o); g.setTransform(1, 0, 0, 1, 0, 0); VIEW.bbK = null; } }); }
  for (const e of fxs) if (e.boden && !(e.delay > 0)) PEND.push({ y: e.y - 1, f: () => fxZeichne(g, s, up, e, 'oben') });   // Punkt 39: hintere Hälfte der Boden-Ringe vor der Figur
  for (const rg of rings) if (!PJI[rg.img]) PEND.push({ y: rg.y - 1, f: () => { if (up(rg.x, rg.y)) ringZeichne(g, s, rg, 'oben'); } });
  if (BW && G) for (const u of G.units) { const T = TYPES[u.type], d = DU.get(u.id), fr = T && T.aura === 'furcht' && E.alive(u) && d && fxIm('faehigkeiten', 4); if (fr) PEND.push({ y: d.y - 1, f: () => { if (up(d.x, d.y)) furchtRing(g, s, u, d, fr, 'oben'); } }); }
  if (LEICHEN.length && !window.FALLEN_ALT) { const t = performance.now(); for (let i = LEICHEN.length - 1; i >= 0; i--) { const c = LEICHEN[i], a = leicheAlpha(c, t); if (a <= 0) { LEICHEN.splice(i, 1); continue; } PEND.push({ y: c.wy - (c.graben ? 0 : 2), f: () => { if (up(c.wx, c.wy)) leicheZeichne(g, s, c, a); } }); } }   // U5b: Gefallene liegen nach Tiefe zwischen Gelände und Figuren
  PEND.sort((a, b) => a.y - b.y);
  if (GP) GBW.setView({ g, proj, F: PJ.F, U: cv.width / 1920, units: ul.map(([, , d]) => [d.x, d.y]) });
  if (GP && GBW.flach) for (const fp of GBW.flach) { g.setTransform(1, 0, 0, 1, 0, 0); fp.f(); }   // G7f: flach liegende Grabenteile vor allen Einheiten (nicht nach Tiefe gemischt; Rückweg window.FLACH_ALT vor dem Kartenaufbau)
  // Geländeteile und einzeln gezeichnete Grabenfiguren (PEND) bis zur Tiefe y, beide nach Tiefe gemischt
  const gbBis = y => { for (;;) { const a = GP && gpi < GP.length ? GP[gpi].y : Infinity, b = PEND.length ? PEND[0].y : Infinity, m = Math.min(a, b); if (m > y || m === Infinity) break;
    g.setTransform(1, 0, 0, 1, 0, 0); if (b <= a) PEND.shift().f(); else GP[gpi++].f(); } };
  for (const [, u, d] of ul) {
    const tief = GP && TYPES[u.type] && gbPlatz(u, d);   // Trupp im Graben: Figuren werden einzeln einsortiert (hintere Wand → Figur → vordere Wand)
    const fzG = TYPES[u.type] && TYPES[u.type].cls === 'walker' && !window.FLACH_ALT, imGr = G.map[u.c] && G.map[u.c][u.r] && G.map[u.c][u.r].t === 'trench';   // G7f: Fahrzeuge im Graben erst nach den Teilen ihres Felds
    gbBis(tief && tief.pts && !fzG ? d.y - L.s * 0.75 : fzG && imGr ? d.y + L.s * 0.9 : d.y);
    FIGQ = tief && tief.pts && !fzG ? [] : null;
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
  drawKZ(g, s, (x, y) => { const b = bbAt(x, y); if (!b) return false; g.setTransform(b.sc, 0, 0, b.sc, b.px - b.sc * x, b.py - b.sc * y); return true; });   // Kopfzeichen (2026-11-18)
  g.setTransform(1, 0, 0, 1, 0, 0);
  drawStratMarks(g); SMARK.length = 0;
  drawSchneefall(g);   // Winter (Enrico 19:40)
  drawVignette(g);   // F48: Kampfszene
}
// ---------- Kampfszene (F48, 2026-11-20, nach Darkest Dungeon) ----------
// Nahkampf, große Fähigkeiten: Kamera fährt weich heran (an) und dunkelt den Rand ab; Angreifer in Angriffspose, Ziel in Getroffen-Pose mit Rückstoß,
// beim ersten Treffer kurzer Stillstand und Rütteln; danach zurück. „kurz“ = ohne Zoom, nur Posen und Wucht. Klick überspringt (Kamera sofort zurück).
let KS = 'an'; try { const v = localStorage.getItem('arm.kampfszene'); if (['an', 'kurz', 'aus'].includes(v)) KS = v; } catch (e) {}
let szene = null;
function szeneTween(ms, f) { return new Promise(res => { const t0 = performance.now(), dur = ms / Math.min(speed, 2);
  const st = () => { const k = szene && szene.skip ? 1 : Math.min(1, (performance.now() - t0) / dur), e = 0.5 - 0.5 * Math.cos(Math.PI * k); f(e); if (k < 1) requestAnimationFrame(st); else res(); }; requestAnimationFrame(st); }); }
async function kampfSzene(x, y) {
  if (KS === 'aus' || speed >= INSTANT || szene) return null;
  const st = { z0: CAM.z, x0: CAM.x, y0: CAM.y, vig: 0, skip: false }; szene = st;
  if (KS === 'an') { const nz = window.NAHZOOM_ALT ? 1 : 1.2, z1 = Math.min(Z_MAX, Math.max(CAM.z * 1.45 * nz, 1.5 * nz)), tx = x, ty = y + L.s * 0.5; camAnim = null;
    await szeneTween(320, e => { CAM.z = st.z0 + (z1 - st.z0) * e; CAM.x = st.x0 + (tx - st.x0) * e; CAM.y = st.y0 + (ty - st.y0) * e; st.vig = 0.6 * e; camClamp(); camSetup(); }); }
  else st.vig = 0.25;
  return st;
}
async function kampfSzeneEnde(st) {
  if (!st) return; const z1 = CAM.z, x1 = CAM.x, y1 = CAM.y, v1 = st.vig;
  if (KS === 'an') await szeneTween(300, e => { CAM.z = z1 + (st.z0 - z1) * e; CAM.x = x1 + (st.x0 - x1) * e; CAM.y = y1 + (st.y0 - y1) * e; st.vig = v1 * (1 - e); camClamp(); camSetup(); });
  ZOOM = CAM.z; if (szene === st) szene = null;
}
async function szeneWucht(st, aid, did) { if (!st) return; const a = DU.get(aid), d = DU.get(did); if (d && a) { pose(did, 'getroffen', 700); d.lunge = { dx: (d.x - a.x) * 0.14, dy: (d.y - a.y) * 0.14 }; setTimeout(() => { if (d.lunge) d.lunge = null; }, 260 / speed); }
  shake(5); if (!st.skip) await wait(110); }   // Treffer: kurzer Stillstand
function drawVignette(g) { const st = szene; if (!st || st.vig <= 0.01) return; const W = g.canvas.width, H = g.canvas.height, gr = g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.28, W / 2, H / 2, Math.max(W, H) * 0.62);
  gr.addColorStop(0, 'rgba(8,6,4,0)'); gr.addColorStop(1, `rgba(8,6,4,${st.vig.toFixed(3)})`); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = gr; g.fillRect(0, 0, W, H); g.restore(); }
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
  const weg = Math.hypot(tx - x0, ty - y0), dur = speed >= INSTANT ? 0 : Math.max(ms, Math.min(950, 380 + weg * 0.35)) / Math.min(speed, 2), me = {}; camAnim = me;   // F34: weicher – mindestens 0,38 s, weite Wege länger
  if (!dur) { CAM.x = tx; CAM.y = ty; camClamp(); return Promise.resolve(); }
  return new Promise(res => { const st = performance.now();
    const step = () => { if (camAnim !== me) return res(); const k = Math.min(1, (performance.now() - st) / dur), e = 0.5 - 0.5 * Math.cos(Math.PI * k);   // F34: sanft an- und auslaufen
      CAM.x = x0 + (tx - x0) * e; CAM.y = y0 + (ty - y0) * e; camClamp(); if (k < 1) requestAnimationFrame(step); else { camAnim = null; res(); } };
    requestAnimationFrame(step); });
}

// ---------- Ton ----------
let soundOn = true;
try { soundOn = localStorage.getItem('arm.ton') !== '0'; } catch (e) {}   // Ton-Einstellung bleibt gespeichert (Spieltest 2026-11-17)
let verlorenT = -1e9;   // Punktverlust: danach kurz keine Pfeife (Tonprobe 2026-11-18)
const lastSnd = {}, SND_GAP = { ueberrollen: 600, pferd_auswahl: 2500, pferd_unruhe: 2500, gespann: 1400, wagenknarren: 1400, husten: 300, select: 500, selGas: 900, ui: 50, erobert: 900, erobert_konkordat: 900, erobert_aschenwacht: 900, ev_furcht: 600, ev_entsetzen: 500, ev_sammeln: 500, ev_brennt: 500, ev_punkte: 500, ev_wieder_flott: 500, verloren: 900, tick: 600, bauen: 1500, wasser: 300, feuer: 2000, blast: 300, cannonH: 200, boomH: 250, mg3: 250, tankmove: 900, impact: 200, punch1: 120, punch2: 120, punch3: 120, punch4: 600, swords: 200, medic: 5000, pain: 1500, horn: 3000, snarl: 1500, tiger: 1500, rifle: 70, mg: 250, cannon: 150, flame: 500, boom: 250, boom2: 400, barrage: 800, gas: 800, tank: 1500, glitch: 500, gallop: 1400, gallop2: 1400, neigh: 2500, march: 2000, win: 3000, launch: 200, grenade: 300, cry: 1200, steps: 1100, tramp: 1100, cut: 300, robot: 2500, armor: 200, smash: 300, sword: 300, axe: 300, minigun: 400, mg2: 250, clank: 300, heal: 900, panic: 3000, whistle: 1500 };
// Prüfliste 1.7 (2026-11-21): Audio-Objekte erst beim ersten Zugriff anlegen (vorher ~750 beim Start, alle mit preload 'auto')
const SND = new Proxy({}, { get(t, k) { if (k in t) return t[k]; const src = typeof k === 'string' && window.SOUNDS && window.SOUNDS[k]; if (!src) return undefined; const a = new Audio(src); a.preload = 'auto'; return (t[k] = a); } });
// Hintergrundkulisse als leise Schleife

// ---- F95 Tonmischung (Enrico 2026-11-22 13:35): drei Wege Musik / Effekte / Stimmen, leichter Begrenzer auf der Summe, Feld-Nachhall für Gewehre ----
// Die <audio>-Elemente laufen über WebAudio (createMediaElementSource, wie schon die Rufe): so bleiben Lautstärke, Tonhöhe, Schleifen und Pausen wie bisher,
// dazu kommen Wege mit eigenem Regler und der Begrenzer. Ohne WebAudio spielt alles wie früher direkt.
let TAC = null, TBUS = null, stimmVol = 1;
try { const s = localStorage.getItem('arm.stimmvol'); if (s != null && s !== '') stimmVol = Math.max(0, Math.min(1, +s)); } catch (e) {}
function feldRaum(ac, sek, frueh) {   // Impulsantwort „offenes Feld“: frühe Reflexion (Scheppern an Gräben/Mauern), dann abklingendes, dumpfer werdendes Rauschen
  const sr = ac.sampleRate, n = Math.round(sr * sek), b = ac.createBuffer(2, n, sr);
  for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); let lp = 0;
    for (let i = 0; i < n; i++) { const t = i / sr, k = 0.12 + 0.75 * (1 - t / sek); lp += (Math.random() * 2 - 1 - lp) * k; d[i] = lp * Math.pow(1 - t / sek, 2.2) * 0.9; }
    const e = Math.round(sr * (frueh + c * 0.011)); for (let i = 0; i < Math.round(sr * 0.03) && e + i < n; i++) d[e + i] += (Math.random() * 2 - 1) * 0.55 * (1 - i / (sr * 0.03)); }
  return b; }
function tonNetz() {
  if (TAC || TAC === false) return TAC || null;
  try {
    const ac = new (window.AudioContext || window.webkitAudioContext)();
    const lim = ac.createDynamicsCompressor(); lim.threshold.value = -6; lim.knee.value = 4; lim.ratio.value = 20; lim.attack.value = 0.002; lim.release.value = 0.15; lim.connect(ac.destination);
    const g = v => { const x = ac.createGain(); x.gain.value = v; x.connect(lim); return x; };
    TBUS = { m: g(1), e: g(1), s: g(stimmVol), hallA: ac.createGain(), hallB: ac.createGain() };
    const hall = (ein, sek, frueh, nass, echo) => { const cv = ac.createConvolver(); cv.buffer = feldRaum(ac, sek, frueh); const w = ac.createGain(); w.gain.value = nass; ein.connect(cv); cv.connect(w); w.connect(TBUS.e);
      if (echo) { const d = ac.createDelay(1), fb = ac.createGain(), lp = ac.createBiquadFilter(); d.delayTime.value = 0.135; fb.gain.value = 0.28; lp.type = 'lowpass'; lp.frequency.value = 2200; ein.connect(d); d.connect(lp); lp.connect(fb); fb.connect(d); lp.connect(TBUS.e); } };
    hall(TBUS.hallA, 0.6, 0.09, 0.42); hall(TBUS.hallB, 0.85, 0.12, 0.55, true);   // A: Feld-Nachhall, B: „Hagel“ mit Echo (Hörproben F95)
    TAC = ac;
  } catch (e) { TAC = false; }
  return TAC || null;
}
function tonWecken() { const ac = tonNetz(); if (ac && ac.state === 'suspended') try { ac.resume(); } catch (e) {} }
function anBus(a, bus, hall) {   // Element in den Weg hängen (einmal je Element); hall: 'A' | 'B' = zusätzlich in den Nachhall
  if (!a || a._bus) return a; const ac = tonNetz(); if (!ac) return a;
  try { if (ac.state === 'suspended') ac.resume(); const src = ac.createMediaElementSource(a); src.connect(TBUS[bus] || TBUS.e); if (hall && TBUS['hall' + hall]) src.connect(TBUS['hall' + hall]); a._bus = bus; a._src = src;
    const weg = () => { if (a._weg) return; try { src.disconnect(); } catch (e) {} a._weg = true; };   // L1: auch nach pause() (Einzelschuss mit dur, Getümmel-Schleife) vom Tonweg trennen; beim nächsten play() wieder anhängen
    a.addEventListener('ended', weg); a.addEventListener('pause', weg);
    a.addEventListener('play', () => { if (!a._weg) return; a._weg = false; try { src.connect(TBUS[bus] || TBUS.e); if (hall && TBUS['hall' + hall]) src.connect(TBUS['hall' + hall]); } catch (e) {} }); } catch (e) {}
  return a; }
function stimmVolSetzen(v) { stimmVol = v; if (TBUS) TBUS.s.gain.value = v; try { localStorage.setItem('arm.stimmvol', v); } catch (e) {} }
// Zielmischung (Bericht Paket I, Tabelle F95): Faktor auf die bisherige Spiel-Lautstärke je Ton, Schlüssel = Anfang des Tonnamens
const MISCH_F = [[/^rifle/, { A: 0.7 / 0.42, D: 0.8 / 0.42 }], [/^(mg|minigun|neu_mg_schwer)/, 0.85 / 0.55], [/^(cannon|kolosskanone|panzerkanone|loewenkanone)/, 0.8 / 0.6], [/^tank/, 0.8 / 0.5],
  [/^(schritte|steps|stepsWald|kampfanzug_schritte)/, 0.75 / 0.5], [/^held_schritt_ritter2/, 0.9 / 0.63], [/^schreiter_schritte/, 0.7 / 0.45], [/^(pain|cry|scream|panic|medic)(_|$)/, 0.3 / 0.4]];
function mischF(name, side) { for (const [re, f] of MISCH_F) if (re.test(name)) return typeof f === 'number' ? f : (f[side] || f.A); return 1; }
// Gewehrsalve (F95): kein Schuss wird mehr abgeschnitten. A = Ablauf wie bisher + Feld-Nachhall (Standard), B = „Hagel“ (je Mann 1, 2 oder 4 Schüsse, Nachhall + Echo). Enrico wählt noch.
let GEWEHR_ART = 'A';
let ambient = null;
let wetter = null, musik = null, feuerTon = null;
// Lautstärke (Optionen, gespeichert): Musik und Effekte getrennt, 0–1 (2026-11-17)
let musikVol = 0.8, effektVol = 1;
try { const m = localStorage.getItem('arm.musikvol'), f = localStorage.getItem('arm.effektvol'); if (m != null && m !== '') musikVol = Math.max(0, Math.min(1, +m)); if (f != null && f !== '') effektVol = Math.max(0, Math.min(1, +f)); } catch (e) {}
const KULISSE = { ambient: 0.13, wetter: 0.07, feuer: 0.12 };   /* F95 Zielmischung (vorher 0,22 / 0,12) */   // Grundlautstärke der Schleifen, mal effektVol
function kulisseVol() { if (ambient) ambient.volume = KULISSE.ambient * effektVol; if (wetter) wetter.volume = KULISSE.wetter * effektVol; if (feuerTon) feuerTon.volume = KULISSE.feuer * effektVol; }
// Brennende Felder: leise Feuer-Schleife, solange irgendwo etwas brennt
function fireLoop() {
  const on = soundOn && G && !G.over && (VIS.fires || []).length > 0;
  if (on && !feuerTon) { const k = sndPick('feuer'); if (!k) return; feuerTon = SND[k].cloneNode(); feuerTon.loop = true; anBus(feuerTon, 'e'); feuerTon.volume = KULISSE.feuer * effektVol; }
  if (feuerTon) try { if (on) { const p = feuerTon.play(); if (p && p.catch) p.catch(() => {}); } else feuerTon.pause(); } catch (e) {}
}
function setAmbient(on) {
  if (!ambient) { const k = sndPick('ambient'); if (!k) return; ambient = SND[k]; ambient.loop = true; anBus(ambient, 'e'); }
  if (!wetter) { const k = sndPick('wetter'); if (k) { wetter = SND[k]; wetter.loop = true; anBus(wetter, 'e'); } }
  kulisseVol();
  for (const a of [ambient, wetter]) if (a) try { if (on) { const p = a.play(); if (p && p.catch) p.catch(() => {}); } else a.pause(); } catch (e) {}
  if (on && soundOn) setMusik('musik_schlacht', 3); else if (musikName === 'musik_schlacht') setMusik(null, 2.5);   // Schlacht: Menümusik weich in die Schlachtmusik überblenden; Ende: ausblenden
  fireLoop(); ortKulisse(on);
}
// Musik (2026-11-17, eigene Stücke, Suno Pro): „musik_titel“ im Startmenü (auch Armee-Auswahl, Regeln), „musik_schlacht“ in der Schlacht,
// „musikNiederlage“ (Taps) nach einer verlorenen Schlacht. Mehrere Spuren gleichzeitig: Wechsel blenden weich über (fade s),
// Schleifen blenden 2 s vor dem Ende in eine neue Spur desselben Stücks über. null = Musik aus (ausblenden).
const MUSIK_VOL = { musik_titel: 0.34, musik_schlacht: 0.085, musikNiederlage: 0.32 };   // Schlachtmusik deutlich unter den Effekten (F4, 2026-11-20: 0,13 → 0,085, etwa −4 dB)
// F5: solange Stimmen oder Marschtritt laufen, Musik weich auf MUSIK_DUCK absenken (nicht aus)
const MUSIK_DUCK = 0.45, MUSIK_GEFECHT = 0.5; let musikDuckBis = 0, musikDuckL = 1, musikGefechtBis = 0;   /* F95: im Gefecht −6 dB */
const musikDucken = ms => { musikDuckBis = Math.max(musikDuckBis, performance.now() + ms); };
const musikGefecht = (ms = 2500) => { musikGefechtBis = Math.max(musikGefechtBis, performance.now() + ms); };   // F95: Beschuss senkt die Musik 2,5 s
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
  const a = SND[k].cloneNode(); a.loop = false; a.volume = 0; anBus(a, 'm');
  const t = { a, name, k, lvl: 0, fade, aus: false, schleife: name !== 'musikNiederlage', weiter: false }; musikSp.push(t);
  try { const p = a.play(); if (p && p.catch) p.catch(() => {}); } catch (e) {}
  musik = a;
}
setInterval(() => {   // Lautstärken nachführen (alle 50 ms), Schleifen überblenden
  { const jt = performance.now(); musikDuckL += (Math.min(jt < musikDuckBis ? MUSIK_DUCK : 1, jt < musikGefechtBis ? MUSIK_GEFECHT : 1) - musikDuckL) * 0.22; }   // F5: weich absenken und wieder anheben; F95: auch bei Beschuss
  for (let i = musikSp.length - 1; i >= 0; i--) { const t = musikSp[i], a = t.a;
    t.lvl = Math.max(0, Math.min(1, t.lvl + (t.aus ? -1 : 1) * 0.05 / Math.max(0.1, t.fade)));
    try { a.volume = Math.min(1, t.lvl * (MUSIK_VOL[t.name] || 0.3) * musikVol * musikDuckL); } catch (e) {}
    if (t.schleife && !t.aus && !t.weiter && a.duration && a.currentTime > a.duration - 2) { t.weiter = true; t.aus = true; t.fade = 2; musikSpur(t.name, t.k, 2); }   // 2 s Überblendung am Schleifenende
    if ((t.aus && t.lvl <= 0) || a.ended) { try { a.pause(); } catch (e) {} musikSp.splice(i, 1); }
  }
  musik = (musikSp.find(t => !t.aus) || {}).a || null;
}, 50);
function musikWecken() { tonWecken(); for (const t of musikSp) if (!t.aus && t.a.paused) { const p = t.a.play(); if (p && p.catch) p.catch(() => {}); } }   // Browser erlaubt Ton erst nach der ersten Berührung
// Abwechslung: Gruppen von Tönen, aus denen zufällig gewählt wird (Wunsch des Nutzers)
// Seit 2026-11-16: Tonplätze (SOUND_POOLS) mit Varianten je Seite; SND_VAR fasst Plätze zusammen. Die Seite kommt aus dem gerade abgespielten Ereignis (sndSide).
// F30 (2026-11-20): Waffenton fest je Seite und Einheitentyp – einmal gewählt, dann immer derselbe (Salven variieren nur Tonhöhe/Lautstärke)
const WAFFE_FEST = {}, WAFFE_TOK = {}; function waffeFest(pool, u) { const k = pool + '|' + u.side + '|' + u.type; if (!(k in WAFFE_FEST)) WAFFE_FEST[k] = sndPick(pool, u.side) || pool; return WAFFE_FEST[k]; }   // fester Ton je Seite und Einheitentyp (F30)
function waffenTon(pool, u) { if (!u) return pool; const tok = 'waffe|' + pool + '|' + u.id; WAFFE_TOK[tok] = { pool, u }; return tok; }   // Marke statt Schlüssel: playSound löst sie auf – erst die Pult-Wahl der Einheit für diesen Platz, sonst der feste Ton (Ton-Pult 3)
const SND_VAR = { aufgerieben: [], /* ohne Ton, bis im Ton-Pult einer gewählt ist */ pferd_angriff: ['stahlreiter_wiehern1'], /* R4: eigener Spiel-Platz */ marsch_schritte: ['schritte'], sperr_boom: ['boom'], sperr_boomH: ['boomH'], aufprall_rollen: ['neu3_fzaufprall'], aufprall_rammen: ['neu3_fzaufprall'], aufprall_bohr: ['neu3_fzaufprall'], erobert_konkordat: ['erobert'], erobert_aschenwacht: ['erobert'], ev_punkte: [], ev_anfuehrer_faellt: [], ev_sammeln: [], ev_entsetzen: [], ev_furcht: [], ev_feuerbereit: [], ev_wieder_flott: [], ev_brennt: [], ev_wind: [],   /* SP-3 (84.3): Ereignisse ohne Ton – stumm, bis im Ton-Pult einer gewählt ist */ orden_fleisch: ['saege_fleisch'], orden_metall: ['held_kschwert_metall'],   /* eigene Tonplätze fürs Ton-Pult (Enrico 21:00), klingen wie bisher */ feldkanone_zug: ['wagenknarren'], stollen_boom: ['boom2'], stollen_knall: ['grenade2'], stollen_blast: ['blast'], /* Feldkanone ziehen (Enrico 2026-11-22 18:45): Standard Wagenknarren (Tiefpass 1,2 kHz); im Pult auch gespann, gallop */ cry: ['cry', 'scream'], grenade: ['grenade2'], axe: ['axe', 'slash'], punch: ['punch1', 'punch2', 'punch3', 'swords'], artD: ['cannonH', 'cannon'],
  boom: ['boomH_1'] };   // Tonprobe 2026-11-18: Granateinschlag = boomH_1 (alter boom und grenade entfernt)
// Stimmen gegenüber Fahrzeugen (Tonprobe 2026-11-18): Stimm-Plätze lauter (STIMM_VOL ≈ +3 dB); solange jemand spricht, werden laufende Fahrzeugtöne
// (DUCK_PL, Motor beim Anklicken) auf DUCK_F abgesenkt und danach wieder angehoben.
const STIMM_PL = new Set(['loewe', 'atmen', 'pain', 'medic', 'cry', 'scream', 'roar', 'panic', 'forward', 'stand', 'charge', 'comeon', 'robot', 'husten', 'grunzen', 'gasmaske_2']);
const DUCK_PL = new Set(['tank', 'mech', 'gespann', 'wagenknarren', 'ueberrollen', 'leuchtbrand']);
const STIMM_VOL = 1.45, DUCK_F = 0.4, STEIN = ['village', 'bunker', 'fabrik', 'kirche', 'schiff', 'turm', 'friedhof', 'garten'];   // Treffer auf Mauern/Ruinen/Kirche: Platz impact (Steinbrocken als Variante, 2026-11-19)
let duckBis = 0; const duckLauf = [];   // duckLauf: [{ a, vol }] laufende Fahrzeugtöne
const duckF = () => performance.now() < duckBis ? DUCK_F : 1;
function duckStimme(a, ms) { const d = ms || (a && isFinite(a.duration) && a.duration > 0 ? a.duration * 1000 : 1800); duckBis = Math.max(duckBis, performance.now() + d + 150); musikDucken(d + 300); duckTick(); }
function duckTick() { for (let i = duckLauf.length - 1; i >= 0; i--) { const t = duckLauf[i]; if (t.a.ended || t.a.paused) { duckLauf.splice(i, 1); continue; } try { t.a.volume = t.vol * duckF(); } catch (e) {} } }
setInterval(() => { if (duckLauf.length) duckTick(); }, 60);
// Nahkampf-Getümmel (2026-11-18): Schleife, die mit dem ersten Nahkampf-Ereignis einblendet und GETUEMMEL_NACH ms nach dem letzten wieder ausblendet
const GETUEMMEL_VOL = 0.3, GETUEMMEL_NACH = 2500; let gtA = null, gtBis = 0;
function getuemmel() {
  if (!soundOn || speed >= INSTANT) return; gtBis = performance.now() + GETUEMMEL_NACH; if (gtA) return;
  const k = sndPick('getuemmel'); if (!k || !SND[k]) return;
  try { const a = SND[k].cloneNode(); a.loop = true; a.volume = 0; anBus(a, 'e'); try { a.currentTime = Math.random() * 12; } catch (e) {} const p = a.play(); if (p && p.catch) p.catch(() => {}); gtA = a; } catch (e) { return; }
  const tick = () => { const a = gtA; if (!a) return; const jetzt = performance.now(), ziel = soundOn && jetzt < gtBis ? Math.min(1, GETUEMMEL_VOL * effektVol * duckF()) : 0;
    try { a.volume = Math.max(0, Math.min(1, a.volume + (ziel - a.volume) * 0.18)); } catch (e) {}
    if (ziel === 0 && a.volume < 0.01) { a.pause(); gtA = null; return; } setTimeout(tick, 50); };
  tick();
}
let SND_POOLS = window.SOUND_POOLS || {};
// Töne ausgelagert (Enrico 2026-11-22 17:30, index.html war 64 MB): src/sound.js wird nach dem Start daneben geladen; bis dahin ist das Spiel stumm,
// danach startet die passende Musik bzw. Kulisse. Fehlt die Datei (z. B. nur index.html kopiert), läuft das Spiel ohne Ton weiter.
let toeneDa = !!window.SOUNDS, toeneLaden = null;
function toeneNachladen() {
  if (toeneDa || toeneLaden) return toeneLaden; const st = document.getElementById('toeneStatus');
  toeneLaden = new Promise(res => { const sc = document.createElement('script'); sc.src = 'src/sound.js'; sc.async = true;
    sc.onload = () => { toeneDa = true; SND_POOLS = window.SOUND_POOLS || {}; if (st) st.hidden = true;
      try { if (soundOn) { if (!$('start').hidden) setMusik('musik_titel'); else if (G && !G.over) setAmbient(true); } } catch (e) {} res(true); };
    sc.onerror = () => { if (st) st.textContent = 'Töne nicht gefunden (src/sound.js) – das Spiel läuft ohne Ton.'; console.warn('src/sound.js fehlt'); res(false); };
    document.body.appendChild(sc); });
  return toeneLaden;
}
setTimeout(toeneNachladen, 0);
// Kulisse je Karte (2026-11-19, Sankt Ruß): Wind in den Ruinen als nahtlose Schleife (zwei Spuren, WIND_X s mit gleicher Leistung übergeblendet –
// eine Audio-Schleife hätte an der Nahtstelle eine Lücke), dazu vereinzelt Krähen (lange, unregelmäßige Pausen) und ganz selten eine ferne Glocke.
// Leise, unter einer Stimme weiter abgesenkt, damit Musik und Stimmen vorn bleiben. Rundenbeginn mit Kirchenglocke: ORT_GLOCKE (rundenSchild).
const ORT_KULISSE = { sanktruss: { wind: 0.1, kraehe: 0.14, kraeheMs: [22000, 60000], glocke_fern: 0.1, glockeMs: [200000, 420000] },
  winterdorf: { wind: 0.13, windPl: 'winterwind', boe: 0.12, boeMs: [45000, 110000], kraehe: 0.12, kraeheMs: [26000, 70000] } };   // Winter (Enrico 2026-11-22 17:05): Winterwind als Schleife, seltene Böe, Krähen
const ORT_GLOCKE = { sanktruss: 0.42 };
const WIND_X = 4; let windSp = [], ortAn = false, ortLvl = 0, kraeheT = 0, glockeT = 0, boeT = 0;
const ortK = () => ORT_KULISSE[E.MAP && E.MAP.id];
const zwischen = ([a, b]) => a + Math.random() * (b - a);
function windSpur() { const k = sndPick((ortK() && ortK().windPl) || 'wind'); if (!k || !SND[k]) return; try { const a = SND[k].cloneNode(); a.loop = false; a.volume = 0; anBus(a, 'e'); const p = a.play(); if (p && p.catch) p.catch(() => {}); windSp.push({ a, weiter: false }); } catch (e) {} }
function ortKulisse(on) {
  const k = ortK(); ortAn = !!(on && soundOn && k);
  if (ortAn) { const t = performance.now(); if (!windSp.length) windSpur(); else for (const w of windSp) { const p = w.a.play(); if (p && p.catch) p.catch(() => {}); }
    if (t > kraeheT) kraeheT = t + zwischen([6000, 16000]); if (k.glockeMs && t > glockeT) glockeT = t + zwischen(k.glockeMs); if (k.boeMs && t > boeT) boeT = t + zwischen(k.boeMs); }
}
setInterval(() => {
  const k = ortK(), jetzt = performance.now(); ortLvl = Math.max(0, Math.min(1, ortLvl + (ortAn && k ? 0.05 / 2 : -0.05 / 1.2)));
  const V = (k ? k.wind : 0) * effektVol * ortLvl * (duckF() < 1 ? 0.6 : 1);
  for (let i = windSp.length - 1; i >= 0; i--) { const w = windSp[i], a = w.a, d = a.duration, c = a.currentTime;
    if (a.ended || (!ortAn && ortLvl <= 0)) { try { a.pause(); } catch (e) {} windSp.splice(i, 1); continue; }
    if (!isFinite(d) || !d) continue;
    const g = Math.sin(Math.PI / 2 * Math.min(1, c / WIND_X, Math.max(0, (d - c) / WIND_X)));   // ein-/ausblenden mit gleicher Leistung
    try { a.volume = Math.min(1, V * g); } catch (e) {}
    if (!w.weiter && d - c < WIND_X && ortAn) { w.weiter = true; windSpur(); }
  }
  if (!ortAn || !k || speed >= INSTANT) return;
  if (jetzt > kraeheT) { kraeheT = jetzt + zwischen(k.kraeheMs); playSound('kraehe', k.kraehe * (duckF() < 1 ? 0.5 : 1), null, { noGap: true, rate: 0.9 + Math.random() * 0.15 }); }
  if (k.boeMs && jetzt > boeT) { boeT = jetzt + zwischen(k.boeMs); schneeBoeBis = performance.now() + 3500; playSound('winterwind_stark', k.boe * (duckF() < 1 ? 0.5 : 1), null, { noGap: true, rate: 0.95 + Math.random() * 0.1 }); }   // Winter: Böe
  if (k.glockeMs && jetzt > glockeT) { glockeT = jetzt + zwischen(k.glockeMs); if (!bauSicht().some(x => x)) playSound('glocke_fern', k.glocke_fern, null, { noGap: true, rate: 1 }); }   // nach dem Einsturz schweigt sie
}, 50);
let hustenT = -1e9, hustenN = 0;
function husten() { const t = performance.now(); if (t - hustenT > 1500) hustenN = 0; hustenT = t; if (++hustenN <= 2) setTimeout(() => playSound('husten', 0.4, null, { v: 'gm' }), (hustenN - 1) * 380 / speed); }   // Tonplatz „husten“ (Dateien folgen)
let sndSide = null, lastFire = null;   // lastFire: zuletzt abgespielter Schuss (Kugeleinschlag beim folgenden Treffer); sndSide: Seite der Einheit, die gerade handelt (playEvent), für Konkordat-/Aschenwacht-Varianten
// Einheitlicher Stimmfilter je Sprecher (2026-11-17): Stimm-Plätze haben Varianten <platz>_gm (Gasmaske leicht), _gs (Gasmaske mittel: Kampfanzüge),
// _bf (Bordfunk stark: Panzerbesatzung), _mr (Maschine mittel: Schreiter, Eisenknecht); Hauptmann/General ohne Filter. Erzeugt mit tools/stimmfilter.py.
const PANZER = ['koloss', 'sturmpz', 'bohrer'];
function stimmVar(u) { const T = u && TYPES[u.type]; if (!T) return null; return T.cmd ? null : T.dauerfeuer ? 'mr' : PANZER.includes(u.type) ? 'bf' : T.cls === 'walker' ? 'mr' : T.suit ? 'gs' : 'gm'; }
const letzteFassung = {};
function sndPick(name, side, v) {
  if (window.__tonSpur) window.__tonSpur({ pick: name });   // Ton-Spur: auch Stellen, die den Ton ohne playSound ziehen (waffenTon, Flammenschleife, Sperrfeuer-Abschuss, Motor)
  const cand = [], add = (n, deep) => { if (!deep && SND_VAR[n]) { for (const m of SND_VAR[n]) add(m, true); return; } if (v && SND_POOLS[n + '_' + v]) n += '_' + v; if (SND_POOLS[n]) for (const [k, sd, w] of SND_POOLS[n]) { if (SND[k]) for (let i = 0; i < (w || 1); i++) cand.push([k, sd]); } else if (SND[n]) cand.push([n, null]); };   // Gruppe (SND_VAR) vor Platz, damit z. B. „rifle“ alle Gewehr-Plätze mischt; Gewicht w: Hauptton öfter
  add(name); if (!cand.length) return null;
  const sd = side || sndSide, own = cand.filter(c => !c[1] || c[1] === sd), list0 = own.length ? own : cand.filter(c => !c[1]), frei = list0.filter(c => !TON_AUS.has(c[0])), list = frei.length ? frei : list0;   // Abstellkammer (Ton-Pult 3): aussortierte Fassungen fallen heraus; ist es die einzige, bleibt sie
  if (!list.length) return null; let k = list[Math.floor(Math.random() * list.length)][0];   // nur Varianten der anderen Seite: lieber still
  if (k === letzteFassung[name] && new Set(list.map(c => c[0])).size > 1) { const rest = list.filter(c => c[0] !== k); k = rest[Math.floor(Math.random() * rest.length)][0]; }   // Enrico 2026-11-22: nie zweimal hintereinander dieselbe Fassung
  letzteFassung[name] = k; return k;
}
// F91 (2026-11-22): Ton-Pult-Wahl je Einheit und Tonplatz (k = fester Ton, p = anderer Platz, aus = still, vf = Lautstärke-Faktor, rate = Tonhöhe)
// TONWAHL-ANFANG (erzeugt mit tools/tonwahl_bau.mjs aus 11 Ton-Pult-Exporten, neuester tonpult_export_2026-11-24_2248.json; 184 Einträge – nicht von Hand ändern)
const TONWAHL = {"grenadier":{"rifle":{"k":"rifle3","r":"a"},"pain":{"p":"neu2_maske","r":"z"},"nahD":{"p":"neu2_nahkampf","r":"a"},"grenade":{"k":"grenade2_1","r":"a"}},"heiler":{"nahD":{"k":"punch1","r":"a"},"pain":{"k":"pain_4","r":"z"}},"sense":{"mg":{"k":"mg_2","r":"a"},"nahD":{"k":"nahD_3","r":"a"},"pain":{"k":"pain_2","r":"z"}},"signal":{"nahD":{"p":"axe","r":"a"},"pain":{"k":"pain_1","r":"z"},"whistle":{"k":"ballon_brenner_1","r":"a"}},"pionierD":{"rifle":{"p":"rifle3","r":"a"},"nahD":{"k":"punch1","r":"a"},"bauen":{"p":"drahtwackeln","r":"a"}},"banner":{"nahD":{"p":"saebel","r":"a"}},"buechse":{"nahD":{"k":"punch2","r":"a"},"neu4_gewehr_schwer":{"k":"neu_schrot_1","r":"a"},"einschlag_panzer":{"k":"einschlag_panzer_1","r":"a"}},"brand":{"nahD":{"k":"punch2","r":"a"},"flame":{"k":"neu2_feuer_1","r":"a"},"feuer":{"k":"ballon_brenner_1","r":"a"}},"huenen":{"sword":{"k":"heavy1","r":"a"},"mg":{"k":"neu_mg_schwer_1","r":"a"},"robot":{"p":"neu2_maske","r":"z"},"husten":{"p":"selGas","r":"z"},"aufgerieben":{"k":"neu2_monster_3","r":"z"},"whistle":{"k":"horn","r":"a"}},"eingreif":{"rifle":{"p":"semi"},"grenade":{"p":"slash"},"boom":{"k":"blast_2"},"einschlag_panzer":{"k":"einschlag_panzer_2"}},"gasschutz":{"rifle":{"k":"pistol","r":"a"},"nahD":{"k":"punch1","r":"a"},"pain":{"k":"gasmaske_2","r":"z"},"gasmaske_1":{"p":"gas","r":"a"}},"munition":{"nahD":{"k":"punch2","r":"a"},"pain":{"k":"pain_3","r":"z"}},"pirsch":{"nahD":{"k":"punch2","r":"a"},"pain":{"k":"pain_1","r":"z"}},"minenwerfer":{"sperr_boom":{"k":"grenade2_1","r":"a"},"nahD":{"k":"punch2","r":"a"},"boom":{"k":"grenade2","r":"a"}},"geschuetz":{"nahD":{"k":"punch2","r":"a"},"artD":{"k":"neu_kanone_2","r":"a"}},"panzerk":{"heavy":{"k":"held_fausteinschlag_2","r":"a"},"semi":{"k":"neu4_gewehr_schwer_2","r":"a"},"sword":{"p":"neu2_nahkampf","r":"a"}},"knecht":{"panzerkanone":{"p":"loewenkanone","r":"a"},"heavy":{"k":"neu_wucht_4","r":"a"},"boom":{"k":"barrage_1","r":"a"},"heavy#z":{"p":"neu_wucht","r":"z"},"tank":{"k":"neu_schritte_schwer_4","r":"a"},"whistle":{"k":"horn","r":"a"}},"sturmpz":{"mg":{"k":"neu_mg_schwer_2","r":"a"},"armor":{"k":"einschlag_panzer_1","r":"a"},"boom":{"k":"grenade2","r":"a"},"armor#z":{"k":"einschlag_panzer_2","r":"z"},"steps":{"k":"panzerketten_schnee_3","r":"z"},"tank":{"k":"motor_auswahl_2","r":"a"},"motor_auswahl":{"k":"motor_auswahl_1","r":"a"}},"klaue":{"neu4_mg_schwer":{"k":"neu_mg_schwer_2","r":"a"},"heavy":{"p":"neu_wucht","r":"z"},"tiger":{"k":"neu_roboter_1","r":"a"},"tank":{"k":"neu_schritte_schwer_1","r":"a"},"whistle":{"k":"neu2_horn_1","r":"a"}},"hauptA":{"neu4_pistole_schwer":{"k":"pistol_2","r":"a"},"nahA":{"p":"saebel","r":"a"},"grunzen":{"p":"pain","r":"z"},"einschlag_abpraller":{"k":"einschlag_abpraller_2","r":"a"},"einschlag":{"k":"einschlag_1","r":"a"}},"generalA":{"neu4_pistole_schwer":{"k":"pistol_2","r":"a"},"nahA":{"p":"saebel","r":"a"},"grunzen":{"p":"pain","r":"z"},"march":{"k":"march_1","r":"a"},"einschlag":{"k":"einschlag_1","r":"a"}},"scharf":{"sniper":{"k":"neu2_gewehr_9","r":"a"},"nahA":{"p":"punch","r":"a"}},"oger":{"flinte":{"k":"neu_schrot_2","r":"a"},"neu3_bestie":{"p":"krallen_eisen","r":"a"},"krallen_eisen":{"p":"stahlklaue_eisen","r":"a"},"pain":{"k":"neu3_loewe_2","r":"z"},"aufgerieben":{"k":"neu2_monster_43","r":"z"},"einschlag_panzer":{"k":"stahlklaue_eisen_3","r":"a"},"oger_bruell":{"k":"oger_bruell_1","r":"a"},"loewe":{"k":"neu2_monster_10","r":"a"},"whistle":{"k":"neu2_monster_43","r":"a"}},"turm":{"kolosskanone":{"k":"neu_kanone_1","r":"a"},"neu4_mg_schwer":{"k":"neu2_kanone_2","r":"a"},"boom":{"k":"grenade2","r":"a"},"heavy":{"k":"held_faustschlag2_1","r":"a"}},"orden":{"heavy":{"k":"heavy3","r":"a"},"whistle":{"k":"neu2_horn_1","r":"a"},"orden_fleisch":{"k":"held_kschwert_metall_3","r":"a"},"orden_metall":{"k":"held_kschwert_metall_4","r":"a"}},"kreuz":{"loewenkanone":{"k":"neu_kanone_1","r":"a"},"heavy":{"k":"neu_wucht_3","r":"a"},"loewe":{"k":"neu_tiger_mech_1","r":"a"},"schreiter_schritte":{"k":"neu_schritte_schwer_6","r":"a"},"boom":{"k":"einschlagH_1","r":"a"},"boom2":{"k":"blast_1","r":"z"},"tank":{"k":"tank_1","r":"a"},"whistle":{"k":"neu2_horn_1","r":"a"}},"bohrer":{"heavy":{"k":"heavy_2","r":"a"},"mech":{"k":"tank_1","r":"a"},"heavy#z":{"k":"heavy1","r":"z"},"steps":{"k":"panzerketten_schnee_3","r":"z"},"tank":{"k":"motor_auswahl_2","r":"a"}},"saeger":{"heavy":{"k":"heavy_2","r":"a"},"saege_fleisch":{"k":"held_kschwert_metall_3","r":"a"},"saege_metall":{"k":"held_kschwert_metall_4","r":"a"},"heavy#z":{"k":"heavy3","r":"z"},"tank":{"k":"neu_schritte_schwer_6","r":"a"},"whistle":{"k":"neu2_horn_1","r":"a"}},"fernsprech":{"nahA":{"k":"punch1","r":"a"},"cannonH":{"k":"barrage","r":"a"},"einschlag":{"p":"vorbei","r":"a"}},"schildwall":{"nahA":{"p":"neu2_nahkampf"},"armor":{"k":"neu2_metall_1"}},"raeumer":{"axe":{"p":"nahA","r":"a"},"nahA":{"p":"neu2_nahkampf","r":"a"},"armor":{"k":"neu2_metall_1","r":"a"}},"sturm":{"nahD":{"p":"neu2_nahkampf","r":"a"},"boom":{"k":"blast_2","r":"a"},"einschlag_panzer":{"k":"einschlag_panzer_2","r":"a"},"einschlag_abpraller":{"k":"neu2_einschlag_1","r":"a"}},"hauptD":{"nahD":{"p":"slash","r":"a"},"cry":{"k":"scream_1","r":"a"},"neu4_pistole_schwer":{"k":"pistol","r":"a"}},"generalD":{"nahD":{"p":"saebel","r":"a"},"neu4_pistole_schwer":{"k":"pistol_3","r":"a"}},"schwer":{"nahD":{"p":"neu2_nahkampf","r":"a"},"pain":{"k":"pain_5","r":"z"},"armor":{"k":"neu2_metall_1","r":"a"}},"flammen":{"flame":{"k":"flame_1","r":"a"},"feuer":{"k":"ballon_brenner_2","r":"a"},"whistle":{"k":"gasmaske_1","r":"a"}},"melder":{"dog":{"k":"neu2_hund_3","r":"a"},"whistle":{"p":"neu2_hund","r":"a"}},"mahlwerk":{"nahA":{"p":"punch","r":"a"},"mg_aufbauen":{"k":"nachladen_1","r":"a"},"nachladen":{"k":"neu_nachladen_2","r":"a"},"mg":{"k":"mg3","r":"a"},"einschlag":{"k":"einschlag_2","r":"a"}},"rauch":{"nahA":{"p":"punch"}},"werkstatt":{"nachladen":{"k":"neu2_tuer_1","r":"a"}},"kohorte":{"sandsaecke":{"k":"sandsaecke_3","r":"a"},"rifle":{"k":"rifle_1","r":"a"},"einschlag":{"k":"einschlag_1","r":"a"}},"faust":{"held_faustschlag2":{"k":"neu_wucht_2","r":"a"},"held_fausteinschlag":{"k":"neu_wucht_3","r":"a"},"held_aufladen":{"k":"held_fausteinschlag_1","r":"a"},"whistle":{"k":"neu2_horn_1","r":"a"},"semi":{"p":"flinte","r":"a"}},"moerser":{"boom":{"k":"grenade2_1","r":"a"},"sperr_boom":{"k":"grenade2_1","r":"a"},"boom2":{"k":"neu_schrot_1","r":"z"}},"haubitze":{"cannonH":{"k":"neu_kanone_3","r":"a"},"einschlagH":{"k":"grenade2","r":"a"}},"koloss":{"kolosskanone":{"p":"loewenkanone","r":"a"},"mg":{"k":"neu4_gewehr_schwer_2","r":"a"},"crash":{"k":"crash_1","r":"z"},"boom":{"k":"einschlagH_2","r":"a"},"boom2":{"k":"boom2_1","r":"z"},"tank":{"k":"motor_auswahl_2","r":"a"},"ueberrollen":{"k":"neu3_fzaufprall_1","r":"a"},"whistle":{"k":"tank","r":"a"}},"stahl":{"semi":{"k":"semi"},"forward":{"k":"kampfanzug_schritte_2"},"sword":{"p":"neu2_nahkampf"},"heavy":{"k":"held_faustschlag2_1"}},"reiter":{"pferd_unruhe":{"k":"pferd_unruhe_2","r":"z"},"whistle":{"k":"pferd_auswahl_4","r":"a"},"pferd_auswahl":{"p":"stahlreiter_maske_schnauben2","r":"a"},"gallop2":{"p":"stahlreiter_galopp1","r":"a"},"neigh":{"p":"stahlreiter_wiehern1","r":"z"}},"pionier":{"rifle":{"p":"rifle2","r":"a"}},"ballon":{"drahtwackeln":{"k":"sandsaecke_4","r":"a"}},"gelaende":{"stollen_boom":{"k":"einschlagH_1","r":"z"}},"feldkanone":{"cannon":{"k":"neu_kanone_2","r":"a"}},"lanzeD":{"aufgerieben":{"k":"neigh","r":"z"},"grenade2":{"k":"armor_2","r":"a"},"whistle":{"k":"gallop","r":"a"}},"kuerass":{"whistle":{"k":"neu2_horn_1","r":"a"}}};
const TON_AUS = new Set(["atmen_2","atmen_3","atmen_gm_2","atmen_gm_3","atmen_gs_2","atmen_gs_3","boomH_1","einschlag_3","einschlag_4","einschlag_5","einschlag_6","einschlag_abpraller_1","einschlag_abpraller_3","einschlag_panzer_4","nahD_1","oger_bruell_5","oger_bruell_6"]);   // Abstellkammer (Ton-Pult 3): aussortierte Tonschlüssel, fallen aus der Zufallsauswahl (sndPick, Sprüche)
const MISCHTON = {};   // eigene Mischtöne (Ton-Pult 3): Schlüssel → Spuren [Ton, Lautstärke, Versatz ms, Tonhöhe], gemischt beim Abspielen (playSound)
// TONWAHL-ENDE
// Stimmfilter live (Enrico 2026-11-22): „Gasmaske + Rauschen“ = Bandpass ca. 300–3000 Hz mit leichter Resonanz und leichter Verzerrung, dazu leises Feldtelefon-Rauschen/Knistern;
// „nur Rauschen“ = Stimme roh plus Rauschen; „roh“ = ohne. st = Stärke 0–1. Gleiche Kette im Spiel (ui.js) und im Ton-Pult.
let RUF_AC = null, RUF_RAUSCH = null;
function rufKette(a, art, st) {
  if (!a || art === 'roh' || !(st > 0)) return;
  try {
    const ac = RUF_AC = RUF_AC || tonNetz() || new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === 'suspended') ac.resume();
    const src = ac.createMediaElementSource(a); let n = src;
    if (art === 'maske') {
      const hp = ac.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 220 + 120 * st;
      const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 4400 - 1500 * st;
      const pk = ac.createBiquadFilter(); pk.type = 'peaking'; pk.frequency.value = 1300; pk.Q.value = 2.2; pk.gain.value = 3 + 6 * st;
      const ws = ac.createWaveShaper(), k = 1 + 6 * st, cur = new Float32Array(1024); for (let i = 0; i < 1024; i++) { const x = i / 511.5 - 1; cur[i] = Math.tanh(k * x) / Math.tanh(k); } ws.curve = cur;
      n.connect(hp); hp.connect(lp); lp.connect(pk); pk.connect(ws); n = ws;
    }
    if (art === 'helm') {   // Kürassier (Enrico 2026-11-22 16:08): hohler Stahlhelm – Bandpass 300–3000 Hz, Resonanz um 1,6 kHz, kurzer Kammfilter, Hauch Nachhall; jedes Wort bleibt verständlich
      const hp = ac.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 300; const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3000;
      const pk = ac.createBiquadFilter(); pk.type = 'peaking'; pk.frequency.value = 1600; pk.Q.value = 4; pk.gain.value = 3 + 6 * st;
      const dl = ac.createDelay(0.05); dl.delayTime.value = 0.0035; const fb = ac.createGain(); fb.gain.value = 0.25 + 0.35 * st; const dg = ac.createGain(); dg.gain.value = 0.35 * st;
      const hall = ac.createDelay(0.2); hall.delayTime.value = 0.045; const hg = ac.createGain(); hg.gain.value = 0.12 * st; const mix = ac.createGain();
      n.connect(hp); hp.connect(lp); lp.connect(pk); pk.connect(mix); pk.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(dg); dg.connect(mix); pk.connect(hall); hall.connect(hg); hg.connect(mix); n = mix;
    }
    if (art === 'roboter') {   // Schreiter-Stimmen (Enrico 2026-11-22): metallischer Lautsprecher – Bandpass, Verzerrung, Ringmodulation (Aschenwacht rauer über st)
      const hp = ac.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 280 + 120 * st;
      const bp = ac.createBiquadFilter(); bp.type = 'peaking'; bp.frequency.value = 1500; bp.Q.value = 1.4; bp.gain.value = 5 + 5 * st;
      const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 4200 - 1200 * st;
      const ws = ac.createWaveShaper(), k = 1.5 + 5 * st, cur = new Float32Array(1024); for (let i = 0; i < 1024; i++) { const x = i / 511.5 - 1; cur[i] = Math.tanh(k * x) / Math.tanh(k); } ws.curve = cur;
      const tr = ac.createGain(); tr.gain.value = 1 - 0.45 * st; const rm = ac.createGain(); rm.gain.value = 0; const osc = ac.createOscillator(); osc.frequency.value = 55 + 35 * (1 - st); const od = ac.createGain(); od.gain.value = 0.45 * st;
      osc.connect(od); od.connect(rm.gain); osc.start(); a.addEventListener('ended', () => { try { osc.stop(); } catch (e) {} }, { once: true }); a.addEventListener('pause', () => { try { osc.stop(); } catch (e) {} }, { once: true });
      const mix = ac.createGain(); n.connect(hp); hp.connect(bp); bp.connect(lp); lp.connect(ws); ws.connect(tr); ws.connect(rm); tr.connect(mix); rm.connect(mix); n = mix;
    }
    n.connect(TBUS && ac === TAC ? TBUS.s : ac.destination); a._bus = 's';
    if (!RUF_RAUSCH) { const len = ac.sampleRate * 3; RUF_RAUSCH = ac.createBuffer(1, len, ac.sampleRate); const d = RUF_RAUSCH.getChannelData(0); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * 0.45 + (Math.random() < 0.0012 ? (Math.random() * 2 - 1) * 0.9 : 0); }
    const ns = ac.createBufferSource(); ns.buffer = RUF_RAUSCH; ns.loop = true;
    const nf = ac.createBiquadFilter(); nf.type = 'bandpass'; nf.frequency.value = 2400; nf.Q.value = 0.7;
    const ng = ac.createGain(); ng.gain.value = (0.015 + 0.045 * st) * Math.max(0.2, a.volume);
    ns.connect(nf); nf.connect(ng); ng.connect(ac.destination); ns.start();
    const stop = () => { try { ns.stop(); } catch (e) {} }; a.addEventListener('ended', stop); a.addEventListener('pause', stop);
  } catch (e) {}
}
// Rufe der Truppen je Ereignis (Enrico 2026-11-22): Wahl kommt aus dem Ton-Pult (TONWAHL['stimmen_A'|'stimmen_D']['ruf_<ereignis>'] = { k, vf, rate, filt, fst });
// höchstens ein Ruf gleichzeitig, je Seite und Ereignis höchstens alle 7 s, Auswahl nur jede dritte; etwas leiser als Schüsse, unter dem Ruf werden Fahrzeuge gedämpft
const RUF_SPERRE = {}; let rufBis = 0, rufAnwahl = 0;
// Schreiter-Stimmen (Enrico 2026-11-22 14:40): je Anlass ein Satz, Roboter-Filter; gleiche Regeln wie die Rufe (einer zugleich, 7 s je Anlass, Auswahl nur jede dritte)
let sstFeindT = { A: 0, D: 0 };   // Schreiter „Feind gesichtet“ höchstens alle 30 s je Seite
const istSchreiter = u => !!(u && FIGMAP[u.type] && SCHREITER.includes(FIGMAP[u.type][0]));
// Heldenstimmen (Enrico 2026-11-22 15:58/16:08): je Held 8 Anlässe, Plätze ausgeschrieben (sound_bau ordnet sie dann dem Spiel zu); spezial = Durchbruch bzw. Hinrichtung
const HELD_ST = {
  faust: { tab: 'stimmen_held_faust', filt: 'roh', fst: 0, rate: 1, pl: { auswahl: 'hst_faust_auswahl', bewegen: 'hst_faust_bewegen', angriff: 'hst_faust_angriff', spezial: 'hst_faust_durchbruch', getroffen: 'hst_faust_getroffen', gegner_erledigt: 'hst_faust_gegner_erledigt', schwer_verwundet: 'hst_faust_schwer_verwundet', tod: 'hst_faust_tod' } },
  kuerass: { tab: 'stimmen_held_kuerass', filt: 'helm', fst: 0.6, rate: 0.92, pl: { auswahl: 'hst_kuerass_auswahl', bewegen: 'hst_kuerass_bewegen', angriff: 'hst_kuerass_angriff', spezial: 'hst_kuerass_hinrichtung', getroffen: 'hst_kuerass_getroffen', gegner_erledigt: 'hst_kuerass_gegner_erledigt', schwer_verwundet: 'hst_kuerass_schwer_verwundet', tod: 'hst_kuerass_tod' } } };
const fussTrupp = u => !!(u && TYPES[u.type] && !['walker', 'cav'].includes(TYPES[u.type].cls) && !TYPES[u.type].aerial);
let rufRoutT = 0, rufSterbenN = 0;
// ---------- V3 (Punkt 112, 2026-11-26): neue Stimmen – 5 Sprecher je Seite, Schlachtfunk (entwurf/STIMMEN_PLAN.md, Texte entwurf/stimmen_texte.csv) ----------
// Plätze st_<gruppe>_<anlass> (Seite A/D = Sprache), Erscheinen st_erscheinen_<typ>, Helden st_held_<faust|kuerass>_<anlass>, Hünen st_huenen_<anlass> (Maschine).
// Die alten Sprüche (sv_*, ruf_*, panik_*, sterben_*, sst_*, hst_*, medic/panic/forward/stand/roar/charge/comeon) sind seit Punkt 114 ausgebaut (Rückweg nur über git).
const ST_GRUPPE = { kohorte: 'linie', grenadier: 'linie',
  melder: 'unterst', fernsprech: 'unterst', feldscher: 'unterst', pionier: 'unterst', scharf: 'unterst', mahlwerk: 'unterst', moerser: 'unterst', flammen: 'unterst', mineur: 'unterst', werkstatt: 'unterst', feldkanone: 'unterst', haubitze: 'unterst', ballon: 'unterst',
  signal: 'unterst', heiler: 'unterst', pionierD: 'unterst', buechse: 'unterst', sense: 'unterst', minenwerfer: 'unterst', brand: 'unterst', gasschutz: 'unterst', munition: 'unterst', pirsch: 'unterst', geschuetz: 'unterst',
  raeumer: 'sturm', sturm: 'sturm', schwer: 'sturm', panzerk: 'sturm', stahl: 'sturm', huenen: 'huenen', reiter: 'reiter', lanzeD: 'reiter',
  hauptA: 'fuehrer', generalA: 'fuehrer', hauptD: 'fuehrer', generalD: 'fuehrer', banner: 'fuehrer', koloss: 'panzer', sturmpz: 'panzer', bohrer: 'panzer',
  turm: 'schreiter', orden: 'schreiter', kreuz: 'schreiter', knecht: 'schreiter', saeger: 'schreiter', klaue: 'schreiter', faust: 'held_faust', kuerass: 'held_kuerass' };   // Löwenoger: nur Brüllen
const ST_NOT = new Set(['verwundet', 'rueckzug', 'panik', 'tod', 'schwer_verwundet', 'schwer']);   // Not: Vorrang, darf über einen laufenden Ruf
const ST_SPERRE = new Map(); let stBis = 0, stBefehlZ = 0, stTodZ = 0;
function stPlatz(u, anlass) { const g = u && ST_GRUPPE[u.type]; if (!g) return null; const p = anlass === 'erscheinen' && !g.startsWith('held_') ? 'st_erscheinen_' + u.type : 'st_' + g + '_' + anlass; return SND_POOLS && SND_POOLS[p] ? p : null; }
function stimme(u, anlass, o = {}) {
  const p = stPlatz(u, anlass); if (!p) return false;
  const t = performance.now(), not = ST_NOT.has(anlass), sk = u.id + ':' + anlass;
  if (!not && !o.immer && t < stBis) return false;   // höchstens ein Ruf zugleich
  if (t - (ST_SPERRE.get(sk) || -1e9) < (o.sperre != null ? o.sperre : 7000)) return false;   // je Einheit und Anlass
  if (!not && t - (ST_SPERRE.get(u.id) || -1e9) < (o.abstand != null ? o.abstand : 2500)) return false;   // je Einheit Abstand
  ST_SPERRE.set(sk, t); ST_SPERRE.set(u.id, t); stBis = t + (o.lang || 1800);
  playSound(p, o.vol || 0.5, u.side, { von: u, noGap: true, rate: 1 }); return true;
}
const stHeld = u => !!(u && HELD_ST[u.type]);
function stimmeBeiEreignis(e, u) {
  const ua = unitById(e.a != null ? e.a : e.u);
  switch (e.t) {
    case 'move': if (!u) break;
      if (istSchreiter(u)) { if (!stimme(u, 'befehl')) { const feind = G.units.find(o => o.side !== u.side && E.alive(o) && TYPES[o.type].cls === 'walker' && E.dist(o.c, o.r, u.c, u.r) <= 6); if (feind && performance.now() - sstFeindT[u.side] > 30000 && stimme(u, 'feind')) sstFeindT[u.side] = performance.now(); } break; }
      if (stHeld(u)) { stimme(u, 'bewegen'); break; }
      if (human(u.side) ? (++stBefehlZ % 2 === 0) : (e.path && e.path.length > 2 && Math.random() < 0.3)) stimme(u, 'befehl'); break;   // Befehl bestätigt: eigene Züge etwa jedes zweite Mal (Enrico 22:45), KI selten
    case 'fire': if (e.reaction || !ua) break; if (!stimme(ua, 'feuer')) stimme(ua, 'angriff'); break;
    case 'zweit': case 'faust': if (ua) stimme(ua, 'angriff'); break;
    case 'melee': if (!ua) break; if (istSchreiter(ua)) stimme(ua, 'nahkampf'); else stimme(ua, 'angriff'); break;
    case 'supp': if (u) stimme(u, 'niedergehalten'); break;
    case 'retreat': if (u) stimme(u, 'rueckzug'); break;
    case 'rout': if (u && !stimme(u, 'panik')) stimme(u, 'rueckzug'); break;
    case 'hit': if (!u || !(e.dmg > 0) || e.freeblow) break;
      if (stHeld(u)) { if (e.str < 3.5 && !u._stSchwer) { u._stSchwer = true; stimme(u, 'schwer_verwundet'); } else stimme(u, 'getroffen', { sperre: 8000 }); break; }
      if (istSchreiter(u)) { if (e.str < 3.5 && !u._stSchwer) { u._stSchwer = true; stimme(u, 'schwer'); } else stimme(u, 'getroffen', { sperre: 8000 }); break; }
      if (ST_GRUPPE[u.type] === 'panzer') { if (e.str < 3.5 && !u._stSchwer) { u._stSchwer = true; stimme(u, 'verwundet'); } else stimme(u, 'getroffen', { sperre: 9000 }); break; }
      if (e.str < 3.5 && !u._stSchwer) { u._stSchwer = true; stimme(u, 'verwundet'); } break;
    case 'destroyed': { const la = letzterAngreifer && performance.now() - letzterAngreifer.t < 4000 ? unitById(letzterAngreifer.id) : null; if (stHeld(la) && u && la.side !== u.side) stimme(la, 'gegner_erledigt');
      if (!u) break; if (istSchreiter(u) || ST_GRUPPE[u.type] === 'panzer' || TYPES[u.type].cmd) stimme(u, 'tod', { immer: true }); else if (++stTodZ % 2 === 0) stimme(u, 'tod'); break; }
    case 'heldfall': if (stHeld(u)) stimme(u, 'tod', { immer: true }); break;
    case 'abilTitel': if (stHeld(u) && e.k === 'durchbruch') stimme(u, 'spezial', { immer: true }); break;   // Durchbruch-Ruf beim Anlauf
    case 'hinrichtung': if (stHeld(u)) stimme(u, 'spezial', { immer: true }); break;   // vor dem Säge-Schnitt
    case 'order': if (!u) break; stimme(u, e.kind === 'rally' ? 'befehl_sammeln' : e.kind === 'fire' ? 'befehl_feuerfrei' : 'befehl_sturm', { immer: true, sperre: 3000 }); break;
    case 'bigorder': if (u) stimme(u, 'grossbefehl', { immer: true, sperre: 0 }); break;
    case 'banner': if (u) stimme(u, 'banner', { immer: true }); break;
    case 'rally': if (u) stimme(u, 'sammeln'); break;
    case 'shell': if (e.strike && ua) stimme(ua, 'feuer'); break;   // Feuerschlag anfordern
    case 'pzgranate': if (u && !stimme(u, 'granate')) stimme(u, 'angriff'); break;
    case 'handgranate': if (e.wurf && ua && !stimme(ua, 'granate')) stimme(ua, 'angriff'); break;
    case 'gas': if (!e.late && u) stimme(u, 'gas'); break;
    case 'fear': if (u) stimme(u, 'koloss'); break;
    case 'entsetzen': if (!e.ok && u) stimme(u, 'koloss'); break;
    case 'ow': case 'sperr': if (u) stimme(u, 'feuerbereit'); break;
    case 'shields': if (u) stimme(u, 'schilde', { immer: true }); break;
    case 'counterstrike': if (u) stimme(u, 'gegenstoss', { immer: true }); break;
    case 'dauerfeuer': if (u) stimme(u, 'dauerfeuer', { immer: true }); break;
    case 'breakdown': case 'stuck': if (u) stimme(u, 'panne'); break;
    case 'spawn': if (u) stimme(u, 'erscheinen', { immer: true, sperre: 0 }); break;   // Nachschub
  }
}
function rufBeiEreignis(e, u) { stimmeBeiEreignis(e, u); }   // V3: nur noch die neuen Stimmen
let tonKontext = [];   // Einheiten des laufenden Ereignisses (Schütze/Schlagender zuerst, dann Getroffener), gesetzt in playEvent0 und beim Anwählen
// Täter/Ziel (Enrico 21:00): Wahl aus Zeilen „Treffer am Ziel“, Schuss, Nahkampf … (r 'a') gilt nur für den Handelnden, Wahl aus „Getroffen“/„Tod“ (r 'z') nur für den Getroffenen
let tonZiel = null; const OPFER_EV = new Set(['destroyed', 'hit', 'supp', 'rout', 'gas', 'wirehurt', 'freeblow', 'burn', 'eisbruch', 'steadfast', 'rollstoss']);   // Ereignisse, in denen e.u der Getroffene ist
// Eigenes Paket (Ton-Pult, Punkt 25, 2026-11-24): pk = Liste von Tönen (auch eigene Mischtöne), im Spiel klingt zufällig einer, nie zweimal hintereinander derselbe; rein = nur echte Töne (Rufe können nicht mischen)
const pkLetzt = new Map();
function pkZiehen(pk, rein) { const da = pk.filter(k => SND[k] || (!rein && MISCHTON[k])); if (!da.length) return null; const id = pk.join('|'), l = pkLetzt.get(id), rest = da.length > 1 ? da.filter(k => k !== l) : da, k = rest[Math.floor(Math.random() * rest.length)]; pkLetzt.set(id, k); return k; }
function twPk(w, rein) { return w && w.pk ? { ...w, k: pkZiehen(w.pk, rein) || undefined } : w; }
function tonWahl(platz, u, von, an) { return twPk(tonWahl0(platz, u, von, an)); }
function tonWahl0(platz, u, von, an) { const tz = x => (x && TONWAHL[x.type] ? [TONWAHL[x.type][platz], TONWAHL[x.type][platz + '#z']] : []);   // von / an (Ton-Pult 3): Einheit, der der Ton als Handelnde bzw. Getroffene gehört – unabhängig vom laufenden Ereignis; '#z' = zweite Wahl desselben Platzes für die Getroffen-Zeile
  if (von || an) { for (const w of tz(von)) if (w && w.r !== 'z') return w; for (const w of tz(an)) if (w && w.r !== 'a') return w; }
  else for (const x of u ? [u, ...tonKontext] : tonKontext) for (const w of tz(x)) { if (!w) continue; if (x !== u && w.r && (w.r === 'a') === (x === tonZiel)) continue; return w; }
  if (E.MAP && E.MAP.winter && TONWAHL.winter && TONWAHL.winter[platz]) return TONWAHL.winter[platz];   // Ton-Pult „Winter (Karte)“: gilt auf Winterkarten
  if (TONWAHL.gelaende && TONWAHL.gelaende[platz]) return TONWAHL.gelaende[platz];   // Ton-Pult „Gelände und Gebäude“: Töne ohne Einheit (Einsturz, Stollen)
  return null; }
function tonPick(platz, u, side) { if (window.__tonSpur) window.__tonSpur({ ps: platz, u: null, k: [], z: null, von: u ? u.id : null });   // Ton ziehen, der nicht über playSound läuft (Schleifen, Motor, Sperrfeuer-Abschüsse): Pult-Wahl der Einheit zuerst
  const tw = tonWahl(platz, null, u); return tw && tw.aus ? null : tw && tw.k && SND[tw.k] ? tw.k : sndPick(tw && tw.p ? tw.p : platz, side || (u && u.side)); }
function playSound(name, vol = 0.6, side, opt) {   // opt: { noGap, rate, dur, u (Sprecher → Stimmfilter), v (Filter fest) } – Salven: kein Mindestabstand, eigene Tonhöhe; dur: nach so vielen ms kurz ausblenden (Einzelschuss ohne Nachhall)
  const wt = WAFFE_TOK[name] || null; if (wt) { name = wt.pool; opt = { ...(opt || {}), von: wt.u }; }   // Waffenton: Platz und Schütze aus der Marke
  if (window.__tonSpur && !(opt && opt.gezogen)) window.__tonSpur({ ps: name, u: opt && opt.u ? opt.u.id : null, k: tonKontext.map(x => x.id), z: tonZiel ? tonZiel.id : null, von: opt && opt.von ? opt.von.id : null, an: opt && opt.an ? opt.an.id : null });   // Ton-Spur (tools/ton_spur.mjs): Platz, Sprecher, Einheiten des Ereignisses – vor Pult-Wahl und allen Abbrüchen
  const tw = opt && opt.spur ? null : tonWahl(name, opt && opt.u, opt && opt.von, opt && opt.an); if (tw) { if (tw.aus) return; if (tw.vf) vol *= tw.vf; if (tw.rate) opt = { ...(opt || {}), rate: (opt && opt.rate || 0.94 + Math.random() * 0.12) * tw.rate }; }   // F91
  let gapKey = name; name = tw && tw.k ? tw.k : wt ? waffeFest(tw && tw.p ? tw.p : name, wt.u) : sndPick(tw && tw.p ? tw.p : name, side || (opt && opt.u && opt.u.side), opt && (opt.v || stimmVar(opt.u))) || (tw && tw.p) || name; if (wt) gapKey = name;
  if (opt && opt.u && opt.u.type && E.MAP && E.MAP.winter && /^(sv_|st_|pain|medic|cry|scream|panic|forward|roar|stand|charge|comeon|husten|ruf_|panik_|sterben_|stimme)/.test(gapKey)) try { atem(opt.u); } catch (e) {}   // Atemwolke bei Stimmen (Winter)
  if (MISCHTON[name] && !(opt && opt.spur)) { if (soundOn && !(speed >= INSTANT && qRunning)) for (const [k, v, ms, r] of MISCHTON[name]) setTimeout(() => playSound(k, vol * v, side, { ...(opt || {}), noGap: true, spur: true, rate: (opt && opt.rate || 0.94 + Math.random() * 0.12) * r }), ms); return; }   // eigener Mischton aus dem Ton-Pult: Spuren versetzt übereinander
  if (!soundOn || !SND[name] || (speed >= INSTANT && qRunning)) return;
  if (gapKey === 'whistle' && performance.now() - verlorenT < 4000) return;
  const t = performance.now(); if (!(opt && opt.noGap)) { if (lastSnd[gapKey] != null && t - lastSnd[gapKey] < (SND_GAP[gapKey] || SND_GAP[name] || 100)) return; lastSnd[gapKey] = t; }   // nicht mehrfach im selben Augenblick
  window.__sndBy = window.__sndBy || {}; window.__sndBy[name] = (window.__sndBy[name] || 0) + 1;
  window.__snd = (window.__snd || 0) + 1;
  const stimme = STIMM_PL.has(gapKey) || gapKey.startsWith('st_'), fz = DUCK_PL.has(gapKey); if (stimme) vol *= STIMM_VOL;
  try { const a = SND[name].cloneNode(); vol = Math.min(1, vol * (stimme ? 1 : effektVol) * mischF(name, side || sndSide)); a.volume = fz ? vol * duckF() : vol; anBus(a, stimme ? 's' : 'e', opt && opt.hall); a.playbackRate = opt && opt.rate ? opt.rate : 0.94 + Math.random() * 0.12; const p = a.play(); if (p && p.catch) p.catch(() => {});
    if (fz) duckLauf.push({ a, vol }); if (stimme) duckStimme(a);
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
// F27 (2026-11-20): Blut am Boden als gemalter Fleck (fx_blut 3–5) statt runder Kreise, bleibt bis zum Ende der Schlacht; ohne Bild die alten Kreise
// F50 (2026-11-20): Treffer am Ziel – Fußtruppen: mehrere gemalte Spritzer in Schlagrichtung (Stufe 1–3 = gelb/hellrot/rot); Maschinen und Fahrzeuge:
// Funken, Ölspritzer (Blutbild, schwarz gefiltert) und Metallsplitter. Comic-Tinte, kein realistischer Gore.
const OEL_FILTER = 'grayscale(1) brightness(0.22) contrast(1.4)';
const fxOben = e => { if (e) { const i = fxs.indexOf(e); if (i > 0) { fxs.splice(i, 1); fxs.unshift(e); } } return e; };   // zuletzt gezeichnet = obenauf (drawFxs läuft von hinten nach vorn)
function trefferSpritzer(dx0, dy0, d, stufe = 1, maschine = false) {
  const s = L.s, fl = d.x < dx0, n = stufe + (Math.random() < 0.5 ? 1 : 0);
  if (maschine) { fx('funken', null, d.x, d.y - s * 0.45, { anchor: 'mitte', life: 16, fadeOut: 0.6, mul: 0.6 + 0.2 * stufe, flip: Math.random() < 0.5 });
    if (stufe >= 2) fx('blut', Math.floor(Math.random() * 3), d.x + (fl ? -1 : 1) * s * 0.2, d.y - s * 0.35, { anchor: 'mitte', life: 24, mul: 0.3, grow: 0.2, flip: fl, filter: OEL_FILTER });
    if (stufe >= 3) fx('truemmer', 3, d.x, d.y + s * 0.2, { life: 30, mul: 0.45, grow: 0.25, flip: fl }); return; }
  if (!blood) return;
  if (stufe >= 2) schwerBlut(dx0, dy0, d, stufe);
  for (let i = 0; i < n; i++) { const k = (i + 1) / (n + 1), ox = (fl ? -1 : 1) * s * (0.1 + 0.25 * k + Math.random() * 0.08), oy = -s * (0.25 + Math.random() * 0.3);
    fx('blut', Math.floor(Math.random() * 3), d.x + ox, d.y + oy, { anchor: 'mitte', life: 20 + stufe * 4, mul: 0.22 + 0.1 * stufe + Math.random() * 0.08, grow: 0.25, flip: fl, filter: BLUT_FILTER, delay: i * 2 }); }
  if (stufe >= 2 && Math.random() < 0.6) blutFleck(d.x + (fl ? -1 : 1) * s * (0.2 + Math.random() * 0.3), d.y + s * (0.1 + Math.random() * 0.2) * kAt(d.x, d.y), 0.2 + 0.08 * stufe);
}
const istMaschine = u => !!(u && ['walker', 'art'].includes(TYPES[u.type].cls));
// Schweres Blut (Enrico 2026-11-21, fx_blut2): bei Nahkampf- und schweren Treffern gegen Weiche ein großer Blutstoß in Schlagrichtung,
// ab Stufe 3 ein Bodenfleck, der nach 2 Runden verblasst; Bildwirkung leicht = kleiner und seltener, aus = keiner. Maschinen bluten nicht (Aufrufer).
function schwerBlut(dx0, dy0, d, stufe) {
  if (!blood || !BW || !fxIm('blut2', 0) || (BW === 1 && Math.random() < 0.4)) return; const s = L.s, k = BW === 1 ? 0.7 : 1, dr = fxDir(dx0, dy0, d.x, d.y, 0.8);
  fx('blut2', Math.floor(Math.random() * 3), d.x + (dr.flip ? -1 : 1) * s * 0.25, d.y - s * 0.4, { anchor: 'mitte', life: 26 + stufe * 3, mul: (0.42 + 0.1 * stufe) * k, grow: 0.3, flip: dr.flip, ang: dr.ang, fadeOut: 0.5, filter: BLUT_FILTER });
  if (stufe >= 3) bodenBlut(d.x + (dr.flip ? -1 : 1) * s * 0.3, d.y + s * 0.15 * kAt(d.x, d.y), 0.45 * k);
}
function bodenBlut(x, y, mul) { if (!blood || !BW) return; gmark('blut2', 3 + Math.floor(Math.random() * 3), x, y, { mul, turns: 2, alpha: 0.8, filter: BLUT_FILTER, ang: (Math.random() - 0.5) * 0.6 }); }
function blutFleck(x, y, mul) { if (!blood) return false; if (!fxIm('blut', 3)) return false; gmark('blut', 3 + Math.floor(Math.random() * 3), x, y, { mul, turns: 9999, alpha: 0.85, filter: BLUT_FILTER, ang: (Math.random() - 0.5) * 0.6 }); return true; }
const BOOM_IMG = { he: ['expl'], dust: ['dirt1', 'dirt2'], gas: ['gas2'], blood: ['splash'], smoke: ['smokeL1', 'smokeL2', 'smokeD'] };
function boom(x, y, r, kind, delay = 0) {
  { const s = L.s, m = r / s, fl = Math.random() < 0.5;   // neue Effektbögen, sonst unten die alten
    if (kind === 'he' && fxImpact(x, y, r, { delay })) return;
    if (kind === 'smoke' && fx('rauch', null, x, y + s * 0.3, { delay, life: 140, mul: m * 0.8, grow: 0.3, rise: 0.8, alpha: 0.72, fadeIn: 16, fadeOut: 0.6, flip: fl })) return;
    if (kind === 'dust' && fx('truemmer', 2, x, y + s * 0.35, { delay, life: 44, mul: m * 0.75, grow: 0.3, rise: 0.15, alpha: 0.85, flip: fl })) return;
    if (kind === 'gas' && fx('gas', null, x, y + s * 0.4, { delay, life: 70, mul: m * 0.7, grow: 0.4, alpha: 0.8, fadeIn: 10, flip: fl })) return;
    if (kind === 'blood' && fx('blut', Math.floor(Math.random() * 3), x, y - s * 0.3, { delay, life: 26, mul: m * 0.6, anchor: 'mitte', grow: 0.25, flip: fl, filter: BLUT_FILTER })) { return; } }   // F27: ohne runde Partikel
  const cols = kind === 'gas' ? [['#a9bd3a', 1], ['#d6e670', 0.6]] : kind === 'dust' ? [['#8a7a52', 1], ['#b7a678', 0.55]] : kind === 'blood' ? [['#8a1a14', 1]] : kind === 'smoke' ? [['#77736a', 1]] : [['#e8762a', 1], ['#ffd15a', 0.62], ['#fff6c4', 0.3]];
  const opts = BOOM_IMG[kind] || [], life = kind === 'smoke' ? 70 : kind === 'he' ? 30 : 24;
  booms.push({ x, y, r, cols, kind, img: opts[Math.floor(Math.random() * opts.length)], flip: Math.random() < 0.5, life, max: life, delay });
  if (kind === 'he') { boom(x, y, r * 0.9, 'dust'); boom(x, y - r * 0.2, r * 0.9, 'smoke', 14); }
}
// Effekt-Texte als Symbole (Wunsch des Nutzers; Symbole aus den Bögen über ISYM/UPI s_*). [Textanfang, Symbol, Zahl aus dem Text]
const FICON = [['weicht zurück', 'retreat'], ['Rückzug', 'retreat'], ['Reaktionsfeuer', 'react'], ['Sperrfeuer', 'react'], ['Streuung', 'scatter'], ['Panik', 'rout'], ['flieht', 'rout'],
  ['Gas!', 'gas'], ['Schreck', 'fear', /−\d+/], ['niedergehalten', 'supp'], ['aufgerieben', 'worn'], ['Sammeln', 'rally'], ['gesammelt', 'rally'], ['Moral +', 'morup'],
  ['Vorwärts', 'whistle'], ['Sturm!', 'whistle'], ['Draht geschnitten', 'cut'], ['Draht niedergewalzt', 'crush'], ['steckt im Schlamm', 'stuck'], ['Panne', 'broken'],
  ['wieder flott', 'repair'], ['wieder frei', 'repair'], ['instand gesetzt', 'repair'], ['geborgen', 'repair'], ['Nebelwand', 'smoke'], ['Stollen', 'tunnel', /\d+/],
  ['Mine gelegt', 'mine', /\d+/], ['Mine!', 'mine'], ['Ausgeleuchtet', 'light'], ['Gas entgiftet', 'gasok'], ['kein Gas', 'gasok'], ['nachgeladen', 'ammo'],
  ['Gegenstoß', 'counter'], ['aufgebaut', 'setup'], ['Feuerbereit', 'aim'], ['Marsch', 'march'], ['aufgeprotzt', 'limber'], ['abgeprotzt', 'limber'], ['Nachschub', 'supply'], ['versorgt', 'heal', /\+[\d,]+/]];
// Meldungen auf dem Feld (F15, 2026-11-20): Einstellung „Text / Symbole / aus“ (arm.meldungen). Schadenszahlen, Punkte, „fällt“, „aufgerieben“,
// Kircheneinsturz und große Befehle (hold/big) bleiben immer; „Symbole“ zeigt Feld-Meldungen als Symbol aus dem Bogen (ISYM), sonst gar nicht.
const ISYM = { retreat: 'flucht', rout: 'flucht', react: 'garbe', scatter: 'granate_artillerie', gas: 'gas', fear: 'totenkopf', supp: 'niedergehalten', worn: 'gebrochen', rally: 'sammeln', morup: 'sammeln',
  whistle: 'fahne', cut: 'drahtschere', crush: 'drahtrolle', stuck: 'festgefahren', broken: 'festgefahren', repair: 'schraubenschluessel', smoke: 'nebel', tunnel: 'spitzhacke', mine: 'tellermine',
  light: 'scheinwerfer', gasok: 'gasmaske', ammo: 'munitionskiste', counter: 'nahkampf', setup: 'mg_auf', aim: 'zielen', march: 'marsch', limber: 'aufprotzen', supply: 'munitionskiste', heal: 'sanitaeter' };
let meldArt = 'text'; try { const v = localStorage.getItem('arm.meldungen'); if (['text', 'symbol', 'aus'].includes(v)) meldArt = v; } catch (e) {}
const meldWichtig = (text, big, hold) => hold || big || /^\+\d|fällt|aufgerieben|stürzt ein/.test(String(text));
// Schadenszahlen in drei Stufen (Enrico 2026-11-20): nach Anteil an der vollen Stärke 100 – gelb unter 15, hellrot 15–29, kräftiges Rot (groß) ab 30
const SCHADEN_STUFE = [[3, '#E8241C', true], [1.5, '#FF8A6E', false], [0, '#F2CF4A', false]];
function schadenStufe(dmg) { const z = SCHADEN_STUFE.find(q => dmg >= q[0]); return { col: z[1], big: z[2] }; }
const BAU_NAME = { kirche: 'Kirche', muehle: 'Windmühle', haus: 'Haus', kapelle: 'Kapelle' };   // G6b: Gebäudeart aus dem Ereignis, sonst aus G.bauten, sonst aus dem Feld
function bauArtVon(e) { if (e.art) return e.art; const b = G && G.bauten && G.bauten[e.bau]; if (b && b.art) return b.art; const t = G && G.map[e.c] && G.map[e.c][e.r] && G.map[e.c][e.r].t; return t === 'muehle' || t === 'haus' || t === 'kapelle' ? t : 'kirche'; }
function floater(x, y, text, col, big, hold) {
  const life = hold ? 210 : 60 / speed + 22, f = { x, y, text, col, life, max: life, big, hold };
  if (meldArt !== 'text' && !meldWichtig(text, big, hold)) {
    if (meldArt === 'aus') return;
    const m = FICON.find(([p]) => String(text).startsWith(p)), im = m && UPI['s_' + ISYM[m[1]]]; if (!im) return;
    f.sym = im; const n = m[2] && String(text).match(m[2]); f.sub = n ? n[0] : ''; f.life = f.max = life + 14; }
  floaters.push(f); return f;
}
function bodyPos(id) { const d = DU.get(id), u = unitById(id), k = u ? TYPES[u.type].cls : 'inf';
  const bs = d.fbx || []; if (bs.length) { let t = Infinity, b = -Infinity; for (const q of bs) { t = Math.min(t, q[1]); b = Math.max(b, q[1] + q[3]); } return [d.x, d.y + t + (b - t) * (k === 'walker' ? 0.5 : 0.45)]; }   // F65 (2026-11-20): Mitte der gezeichneten Figuren (Rumpf), nicht feste Höhe – sonst zielen Schüsse über Panzer hinweg
  return [d.x, d.y - L.s * (k === 'walker' ? 0.6 : 0.55)]; }
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
      if (T && E.MAP.winter && !d.vs.rout) { const sh = FIGMAP[uu.type] && FIGMAP[uu.type][0];   // Spuren im Schnee (Enrico 19:40)
        if (T.cls === 'walker') { if (sh && SCHREITER.includes(sh)) spurSchnee(1, x0, y0, x1, y1, { mul: 0.55 }); else { const p0 = i > 1 ? center(path[i - 2][0], path[i - 2][1]) : null, dw = p0 ? Math.abs(((Math.atan2(y1 - y0, x1 - x0) - Math.atan2(y0 - p0[1], x0 - p0[0]) + 3 * Math.PI) % (2 * Math.PI)) - Math.PI) : 0; spurSchnee(dw > 0.3 ? 3 : 2, x0, y0, x1, y1, { mul: 0.7, flipY: dw > 0.3 && false }); } }
        else if (T.cls === 'cav') spurSchnee(4, x0, y0, x1, y1); else if (T.cls === 'art' || T.fahrbar) spurSchnee(0, x0, y0, x1, y1, { mul: 0.55 }); else spurSchnee(6, x0, y0, x1, y1, { mul: 0.42, alpha: 0.75 }); }
      if (T && T.cls === 'walker' && !d.vs.rout) { const sh = FIGMAP[uu.type] && FIGMAP[uu.type][0];
        { const h = G.map[path[i][0]] && G.map[path[i][0]][path[i][1]]; if (h && h.t === 'barrikade') playSound('ueberrollen', 0.5); }   // über eine Barrikade
        if (sh && SCHREITER.includes(sh)) fx('truemmer', Math.random() < 0.5 ? 5 : 2, x1, y1 + L.s * 0.3, { life: 40, mul: 0.5, grow: 0.4, alpha: 0.8, fadeOut: 0.6 });   // Schreiter: Staub bei jedem Schritt
        else if (!(E.MAP.winter && fxN('spurschnee') >= 7)) gmark('bodenspuren', 4, (x0 + x1) / 2, (y0 + y1) / 2 + L.s * 0.1, { mul: 0.6, alpha: 0.7, flip: false, ang: Math.atan2(y1 - y0, x1 - x0) + 0.52 }); } }   // Kolosse: Kettenspur (Winter: Schneespur oben)
    if (x1 !== x0 && !keepFace) d.face = x1 > x0 ? (facesLeft(d.face) ? 0 : d.face) : (facesLeft(d.face) ? d.face : 3);   // nur die Seite wechseln, senkrechte Schritte drehen nicht
    if (camOn() && !inView(x1, y1 - L.s * 0.4, 0.14)) camTo(x1, y1 - L.s * 0.4, 300);   // Kamera geht mit
    const dur = msPer / speed, t0 = performance.now();
    const uu = unitById(id), TT = uu && TYPES[uu.type], fm = uu && FIGMAP[uu.type] && FIGMAP[uu.type][0], beine = TT && TT.cls === 'walker' && fm && SCHREITER.includes(fm), kette = TT && TT.cls === 'walker' && !beine;
    const gross = TT && (TT.stufe3 || TT.def >= 9) ? 1.4 : 1, ritter = TT && TT.stecken; let schritt = 0;
    if (WFX() && TT && (kette || TT.cls === 'art' || TT.fahrbar) && fxs.filter(e => e.pulver).length < 10) {   // Winter (Enrico 18:35): Pulverschnee hinter Ketten und Rädern, klein und kurz
      const e = fx('winter_schnee', Math.random() < 0.5 ? 3 : 4, x0 + (x1 - x0) * 0.35, y0 + (y1 - y0) * 0.35 + L.s * 0.28, { delay: 6, life: 40, mul: kette ? 0.42 : 0.3, grow: 0.5, alpha: 0.85, fadeIn: 4, fadeOut: 0.6, flip: x1 < x0 }); if (e) e.pulver = true; }   // ritter: Kürassier stampft mit eigenem Schritt-Ton
    for (let k = 0; k < 1;) { await raf(); k = Math.min(1, (performance.now() - t0) / dur); d.x = x0 + (x1 - x0) * k; d.y = y0 + (y1 - y0) * k;
      if (beine) { const ph = k * 2, n = Math.floor(ph);   // F73 (2026-11-21): zwei Schritte je Feld – heben, stampfen, leicht zur Seite neigen
        d.wipp = { dy: -Math.abs(Math.sin(ph * Math.PI)) * L.s * 0.05 * gross, dx: Math.sin(ph * Math.PI) * L.s * 0.012 * (n % 2 ? 1 : -1) };
        if (n > schritt || k >= 1) { schritt = n; shake(gross > 1 ? 3 : 2); playSound('schreiter_schritte', 0.45, null, { noGap: true }); if (E.MAP.winter) playSound('stampfen_schnee', 0.25, null, { noGap: true }); if (WFX()) fx('winter_schnee', 3 + (n % 2), d.x, d.y + L.s * 0.3, { life: 36, mul: 0.3 * gross, grow: 0.45, alpha: 0.8, fadeOut: 0.6 });   /* Schreiter-Schritte im Takt (Enrico 2026-11-22) */ fx('truemmer', 2, d.x + (n % 2 ? 1 : -1) * L.s * 0.18, d.y + L.s * 0.3, { life: 30, mul: 0.3 * gross, grow: 0.35, alpha: 0.7, fadeOut: 0.6 }); } }
      else if (kette) d.wipp = { dy: Math.sin(k * Math.PI * 10) * L.s * 0.006, dx: 0 };
      else if (ritter) { const ph = k * 2, n = Math.floor(ph); d.wipp = { dy: -Math.abs(Math.sin(ph * Math.PI)) * L.s * 0.035, dx: 0 }; if (n > schritt || (k >= 1 && schritt < 2)) { schritt = Math.max(n, schritt + (k >= 1 ? 1 : 0)); playSound('held_schritt_ritter2', 0.55, null, { noGap: true }); } } }   // Kettenfahrzeug: leichtes Rattern
    d.wipp = null;
  }
  } finally { d.moving = false; d.wipp = null; }
}
const unitById = id => G.units.find(u => u.id === id);
// F64: wirkt die Waffe gegen Panzerung? (bis F66 vereinfacht) – Kanone, Granate/Artillerie, Panzerbüchse, panzerbrechende Schützen (T.at), Kanonen-Zweitwaffe; Gewehr, MG, Drehlauf, Pistole prallen ab
function einschlagArt(ziel, lf) { const a = lf && lf.a != null ? unitById(lf.a) : null;   // Prüfliste 2.16: „wirkt“ = Faktor der Tabelle (F66) mindestens ×1; Kanonen-Zweitwaffe wie panzerbrechend
  if (!a) return lf.kind === 'shell' || lf.kind === 'cannon' ? 'panzer' : 'abpraller';
  if (lf.zweit && TYPES[a.type].zweit && TYPES[a.type].zweit.kanone) return 'panzer';
  return E.faktor(a.type, ziel.type, true).f >= 1 ? 'panzer' : 'abpraller'; }
const lfVon = () => (lastFire && lastFire.a != null ? unitById(lastFire.a) || null : null);   // Schütze des letzten Schusses: ihm gehören die Treffer-Töne am Ziel (Pult-Wahl)
const nm = u => `${TYPES[u.type].name} (${SIDES[u.side].short})`;

let marschU = null;   // Einheit im Marsch/Sturmlauf: ihr Zug klingt nach Marschtritt (Spieltest Runde 2)
// Beschuss-Tempo (2026-11-17): Schuss, Geschoss und Einschlag laufen mit dem Bewegungstempo × 1,5, höchstens 1× (bei ½× also 0,75×); schnellere Stufen bleiben
const BESCHUSS = new Set(['fire', 'shell', 'hit', 'supp']);
let nkGleich = null;   // laufender gemeinsamer Nahkampf (F51)
async function nahkampfGleich(e, grp) {
  const gegen = grp.some(n => n.t === 'counter'), hits = [];
  for (const n of grp) if (n.t === 'hit' && !n.panic && (n.u === e.a || n.u === e.d) && !hits.some(h => h.u === n.u)) hits.push(n);   // je Seite der Hiebtreffer
  const i0 = hits.length ? grp.indexOf(hits[0]) : grp.length, vor = grp.slice(0, i0).filter(n => n.t !== 'counter'), nach = grp.filter((n, i) => i >= i0 && n.t !== 'counter' && !hits.includes(n));
  nkGleich = { gegen, ksz: null };
  try { await playEvent(e); for (const n of vor) await playEvent(n).catch(err => console.error(err)); } finally { }
  const st = nkGleich; nkGleich = null;
  const a = DU.get(e.a), d = DU.get(e.d);
  // gemeinsamer Wucht-Moment: Stillstand, Rütteln, Getroffen-Posen und Spritzer an beiden, beide Schadenszahlen zugleich
  if (a && d) { for (const h of hits) { const z = DU.get(h.u), q = h.u === e.d ? a : d; if (!z || !q) continue; pose(h.u, 'getroffen', 700); z.lunge = { dx: (z.x - q.x) * 0.12, dy: (z.y - q.y) * 0.12 };
      trefferSpritzer(q.x, q.y, z, h.dmg >= 3 ? 3 : 2, istMaschine(unitById(h.u)));   /* Nahkampf: immer schweres Blut gegen Weiche (fx_blut2, Enrico 2026-11-21) */ if (st.ksz && blood && !istMaschine(unitById(h.u)) && h.dmg >= 1.5) fx('blut', Math.floor(Math.random() * 3), z.x, z.y - L.s * 0.5, { anchor: 'mitte', life: 30, mul: 0.6 + 0.12 * Math.min(3, h.dmg), grow: 0.35, flip: z.x < q.x, filter: BLUT_FILTER }); }
    shake(6); if (!(st.ksz && st.ksz.skip)) await wait(120); }
  for (const h of hits) h.nkKurz = true;
  await Promise.all(hits.map(h => playEvent(h).catch(err => console.error(err))));
  for (const id of [e.a, e.d]) { const z = DU.get(id); if (z) z.lunge = null; }
  for (const n of nach) { try { await playEvent(n); } catch (err) { console.error(err); } }   // F63: Ergebnis (Zurückweichen, Flucht, Vernichtung, Nachrücken) noch in der Szene
  await kampfSzeneEnde(st.ksz);
}
async function playEvent(e) {
  if (!BESCHUSS.has(e.t) || speed >= 1) return playEvent0(e);
  const sp = speed; speed = Math.min(1, sp * 1.5);
  try { return await playEvent0(e); } finally { if (speed === Math.min(1, sp * 1.5)) speed = sp; }
}
const ANGRIFF_EV = new Set(['fire', 'shell', 'melee', 'counter', 'durchbruch', 'rollen', 'hinrichtung', 'freeblow', 'zweit', 'pzgranate', 'faust', 'strike', 'handgranate', 'kopfrunter', 'pzschuss']);
async function playEvent0(e) {
  if (ANGRIFF_EV.has(e.t)) { const aid = e.a != null ? e.a : e.u; if (aid != null) letzterAngreifer = { id: aid, t: performance.now() }; }   // M7
  { const su = unitById(e.a != null ? e.a : e.u != null ? e.u : e.by); sndSide = su ? su.side : e.side || null; }
  if (['fire', 'shell', 'zweit', 'faust', 'pzgranate'].includes(e.t)) musikGefecht(2500);   // F95: Musik im Gefecht −6 dB
  const u = e.u != null ? unitById(e.u) : null, s = L.s;
  tonKontext = [e.a, e.u, e.d, e.by].filter(x => x != null).map(unitById).filter(Boolean); tonZiel = e.d != null ? unitById(e.d) || null : OPFER_EV.has(e.t) && e.u != null ? unitById(e.u) || null : null;   // F91: Ton-Pult-Wahl gilt für die Einheiten dieses Ereignisses
  try { rufBeiEreignis(e, u); } catch (err) { }   // Rufe der Truppen (Ton-Pult „Stimmen“)
  try { noteEvent(e, u); } catch (err) { console.error(err); }   // Ereignistext und Kriegstagebuch
  if (KAMERA_EV.has(e.t) && camOn() && !window.KAMERA_ALT) { const p = evPunkt(e); if (p && !inView(p[0], p[1], 0.15)) await camTo(p[0], p[1], 320); }   // SP-1 (84.8)
  switch (e.t) {
    case 'move': { const k0 = TYPES[u.type].cls, wald = e.path.some(h => ['forest', 'wald', 'waldweg'].includes(G.map[h[0]][h[1]].t));
      const winter = !!E.MAP.winter, fuss = !['cav', 'walker', 'art'].includes(k0), klein = (() => { const d0 = DU.get(e.u); return !!(TYPES[u.type].cmd || (d0 && d0.fbx && d0.fbx.length <= 2)); })();   // Wintertöne (Enrico 2026-11-22 17:05)
      if (winter) { if (k0 === 'cav') playSound('pferde_schnee', 0.22, null, { noGap: true }); if (k0 === 'walker' && !(FIGMAP[u.type] && SCHREITER.includes(FIGMAP[u.type][0])) && !TYPES[u.type].fig) playSound('panzerketten_schnee', 0.35, null, { noGap: true });
        if (u.type === 'faust' || TYPES[u.type].mech || TYPES[u.type].dauerfeuer) playSound('stampfen_schnee', 0.25, null, { noGap: true });
        if (fuss && e.path.some(h => G.map[h[0]][h[1]].t === 'eis')) setTimeout(() => playSound('eis_knackt', 0.5, null, { noGap: true }), 200 / speed); } if (marschU != null && marschU !== e.u) marschU = null; if (k0 === 'cav') playSound('gallop2', 0.55); else if (u.limbered) playSound(E.MAP.winter ? 'pferde_schnee' : 'gespann', 0.5); else if (TYPES[u.type].fahrbar) { playSound('feldkanone_zug', 0.8); if (E.MAP.winter) playSound('pferde_schnee', 0.35, null, { noGap: true }); }   /* Feldkanone ohne Protzen (Enrico 2026-11-22 18:45): Wagenknarren, im Winter Pferde im Schnee darunter */   /* F8: ohne Wagenknarren (pfiff wie ein Zug) */ else if (k0 === 'walker') { if (!(FIGMAP[u.type] && SCHREITER.includes(FIGMAP[u.type][0]))) playSound(TYPES[u.type].fig ? 'mech' : 'tank', TYPES[u.type].fig ? 0.5 : 0.3); }   /* Schreiter: Schritte im Takt (animPath) */ else if (u.type === 'kuerass') {} else if (u.type === 'faust') { playSound('schritte', 0.4); if (Math.random() < 0.5) setTimeout(() => playSound('held_dampfstoss', 0.22), 400 / speed); } else if (TYPES[u.type].mech || TYPES[u.type].dauerfeuer) { playSound('kampfanzug_schritte', 0.45); if (e.path.length > 2) setTimeout(() => playSound('kampfanzug_schritte', 0.4), 520 / speed); }   /* schwere Kampfanzüge (Enrico 2026-11-22) */ else { if (TYPES[u.type].fig === 'dog') playSound('dog', 0.5); if (marschU === e.u) { musikDucken(2600); playSound('marsch_schritte', winter ? 0.35 : 0.6); if (winter) playSound('schnee_rennen', 0.5, null, { noGap: true }); } /* F49 (2026-11-20): Marsch/Sturmlauf ohne Trommel (marschtritt enthielt ein Marschstück), beide Seiten nur Schritte */ else playSound(winter && !wald ? (klein ? 'schnee_einzeln' : 'schnee_gruppe') : wald ? 'stepsWald' : e.path.some(h => G.map[h[0]][h[1]].t === 'mud') ? 'steps' : 'schritte', 0.5); if (wald && marschU !== e.u) for (let q = 0; q < 2; q++) setTimeout(() => playSound('holzknacken', 0.45, null, { noGap: true }), (250 + q * (500 + Math.random() * 400)) / speed); } } if (poseHat(u, 'lauf')) pose(e.u, 'lauf', e.path.length * 170 + 250); await animPath(e.u, e.path, TYPES[u.type].cls === 'cav' ? 110 : 170); ctrlSync(); break;   // Wald: Äste knacken (Tonprobe 2026-11-18, vorher beim Draht); Paket G: Kommentar stand vor dem Code und verschluckte lauf-Pose, animPath und break
    case 'advance': await animPath(e.u, e.path, 200); break;
    case 'fallback': if (u && TYPES[u.type].cls === 'cav') playSound('pferd_unruhe', 0.5); else if (E.MAP.winter && u && !['walker', 'art'].includes(TYPES[u.type].cls)) playSound('schnee_rennen', 0.45, null, { noGap: true });   /* Winter: Rückzug im Schnee */ await animPath(e.u, e.path, 200, true); kz(e.u, 'zurueck', 'steig'); break;   // F40
    case 'flee': await animPath(e.u, e.path, 120); break;
    case 'face': DU.get(e.u).face = e.face; break;
    case 'fire': {
      if (e.faust) { const fa = DU.get(e.a); if (fa && e.face != null) fa.face = e.face; break; }   // Faustsalve: Bild kam schon mit dem Ereignis 'faust'
      const a = DU.get(e.a), [x1, y1] = bodyPos(e.a), [x2, y2] = bodyPos(e.d);
      { const dz = DU.get(e.d); fxZielFuss = dz ? [dz.x, dz.y] : null; }
      if (e.face != null && !e.reaction) a.face = e.face; else a.face = x2 >= x1 ? 0 : 3;
      { const au0 = unitById(e.a); if ((e.kind === 'rifle' || (au0 && TYPES[au0.type].dauerfeuer) || poseHat(au0, 'anlegen')) && au0 && pose(e.a, e.zweit && poseHat(au0, 'zweit') ? 'zweit' : poseSchiessen(au0), 1100)) { await raf(); await raf(); } }   // Posenwechsel: anlegen bzw. kniend, Rückstoß je Schuss
      if (e.reaction) { if (!szene && camOn() && !inView(x1, y1)) await camTo(x1, y1, 260); kz(e.a, TYPES[(unitById(e.a) || {}).type || 'kohorte'].mg ? 'garbe' : 'auge', 'steig'); await wait(220); }   // erst kurz zum Schützen
      if (!szene && camOn() && !(inView(x1, y1, 0.08) && inView(x2, y2, 0.08))) { camFern(); await camTo((x1 + x2) / 2, (y1 + y2) / 2, 320); }   // Schütze und Ziel ins Bild
      if (e.kind === 'flame') {   // F75 (2026-11-21): EIN längerer Feuerstoß je Trupp (gemeinsam, ca. 1,5 s; Zweitwaffe Flammenstoß 1,1 s) – Ton startet mit dem Strahl, hält so lange wie er sichtbar ist und klingt mit ihm aus, danach kurzes Nachbrennen
        const p = fxMuzzle(e.a, 0, 0.42) || [x1, y1], du = unitById(e.d), deck = du && E.coverOf(G, du).tier >= 2;   // Ziel in Deckung: Strahl prallt ab (Variante 4)
        const dr = fxDir(p[0], p[1], x2, y2, 1.2), len = Math.hypot(x2 - p[0], y2 - p[1]) * 1.08, dauer = (e.zweit ? 1100 : 1500) / Math.min(speed, 2), takt = 160 / Math.min(speed, 2);
        const ton = flammenTon(e.a, dauer);
        if (fxIm('flammenstrahl')) { const t0 = performance.now(); let n = 0;
          while (performance.now() - t0 < dauer) { const v = deck ? 3 : [0, 1, 2, 4, 5][Math.floor(Math.random() * 5)];
            fx('flammenstrahl', v, p[0], p[1], { anchor: 'links', len: len * (0.94 + Math.random() * 0.1), lenIn: n ? 2 : 6, life: 16, fadeIn: n ? 3 : 0, fadeOut: 0.4, flip: dr.flip, ang: dr.ang + (Math.random() - 0.5) * 0.05 });
            if (n % 3 === 2) shake(1); n++; await new Promise(r => setTimeout(r, takt)); } }
        else { flames.push({ x1, y1, x2, y2, life: 26, max: 26 }); await new Promise(r => setTimeout(r, dauer)); }
        if (ton) ton.aus(); fx('feuer', null, x2, y2 + s * 0.2, { life: 50, mul: 0.6, fadeOut: 0.6 }); await wait(160); }
      else {
        const mini = e.kind === 'minigun', mg = e.kind === 'mg' || mini, can = e.kind === 'cannon', au = unitById(e.a), ang = Math.atan2(y2 - y1, x2 - x1);
        const AT = au && TYPES[au.type], rs = !AT ? 'rifle' : au.type === 'oger' ? 'flinte' : AT.lob ? 'grenade' : AT.pin || AT.hidden ? 'sniper' : AT.cmd ? 'neu4_pistole_schwer' : AT.suit ? 'semi' : 'rifle';   /* Hauptmann/General: schwere Pistole (Standard 2026-11-22, vorher pistol) */
        lastFire = { kind: e.kind, t: performance.now(), a: e.a, zweit: e.zweit };
        { const au1 = unitById(e.a); if (au1 && TYPES[au1.type].cls === 'walker') { const st = e.zweit ? 0.025 : 0.06, dir = x2 >= x1 ? -1 : 1; a.wipp = { dx: dir * L.s * st, dy: -L.s * st * 0.3 }; setTimeout(() => { if (a.wipp && !a.moving) a.wipp = null; }, 140 / speed); } }   // F73: Rückstoß   // Hülsen-Ton nach der MG-Salve entfernt (Spieltest 2026-11-17: klang wie herumfliegende Splitter)
        const salve = e.kind === 'rifle' && rs === 'rifle' && !(au && au.type === 'buechse');
        const schwerMG = !!(au && (((au.type === 'orden' || au.type === 'klaue') && mini) || (au.type === 'turm' && e.zweit)));   // Enrico 15:26: schweres MG für die MGs der Schreiter (Orden, Klaue, Turm-MG)   // Gewehrinfanterie: kurze Salve statt Einzelschuss (2026-11-17)
        let salveT = 0;   // F28: Dauer der Salve – der Schaden erscheint erst danach
        const figN = Math.max(1, (a.fbx && a.fbx.length) || Math.min(4, Math.ceil((a.str || 10) / 2.5 - 0.001)));   // F74 (2026-11-21): so viele Schützen, wie Figuren stehen
        if (rs === 'sniper' && e.kind === 'rifle') { const key = waffenTon('sniper', au); let t = 0;   // F74: Scharfschützen/Pirschjäger – je Figur ein Schuss, deutlich nacheinander („pam … pam“)
          for (let q = 0; q < figN; q++) { if (q) t += 400 + Math.random() * 200; const tq = t; setTimeout(() => playSound(key, 0.6, au && au.side, { noGap: true, rate: 0.95 + Math.random() * 0.1, dur: 650 }), tq / speed);
            const p = fxMuzzle(e.a, q % figN); if (p) { fxFlash(5, p, x2, y2, { delay: tq / 16.667, mul: figMul(p.h, 1.0, FX_SZ.muendung, 0.85) }); fxTracer(5, p, x2, y2, { delay: tq / 16.667 }); pulverDampf(p, 0.16, tq / 16.667 + 3); } }
          salveT = t + 150; if (a.pose && a.pose.t0 != null) { a.pose.dauer = Math.max(900, t + 650); } }
        if (salve) { const n = figN, m = window.SALVE_DOPPELT || window.SALVE_ALT ? n + Math.round(n * (0.5 + Math.random() * 0.5)) : n;   /* SP-2 (Enrico 13:50): jede stehende Figur schießt genau einmal (Rückweg SALVE_DOPPELT) */   // F28 (2026-11-20): je Figur 1–2 Schüsse, zusammen 2–3 s
          const key = waffenTon('rifle', au);   // F30: fest je Seite und Typ   // eine Datei je Salve (Hauptgewehr der Seite), nur versetzt mit leicht anderer Tonhöhe und Lautstärke
          // unregelmäßig wie eine Gruppe, die fast gleichzeitig feuert: „pam – pam-pam – pam“. Abstände zufällig 0–0,25 s, manchmal zwei fast zugleich;
          // jeder Schuss kurz (ohne Nachhall), nur der letzte klingt voll aus (Spieltest 2026-11-17, gilt für beide Seiten)
          // F95 (Enrico 2026-11-22): kein Schuss wird mehr nach 0,2 s abgeschnitten, jeder klingt mit Feld-Nachhall aus. A = Abstände wie bisher; B = „Hagel“: je Mann 1, 2 oder 4 Schüsse, zufällig versetzt
          const plan = []; if (GEWEHR_ART === 'B') { for (let f = 0; f < n; f++) { const z = [1, 1, 2, 2, 4][Math.floor(Math.random() * 5)]; let tt = Math.random() * 650; for (let q = 0; q < z; q++) { plan.push([tt, f]); tt += z === 4 ? 110 + Math.random() * 120 : 220 + Math.random() * 380; } } plan.sort((x, y) => x[0] - y[0]); }
          else if (window.SALVE_ALT) { let tt = 0; for (let q = 0; q < m; q++) { if (q) tt += Math.random() < 0.25 ? 50 + Math.random() * 80 : 150 + Math.random() * 300; plan.push([tt, q % n]); } }   // F72: dichter gestaffelt (Rückweg SALVE_ALT)
          else { const mi = Math.floor(m / 2), dop = new Set([mi, ...(m >= 6 && Math.random() < 0.6 ? [mi + 2] : [])]); let tt = 0;   // SP-1 (84.6): gleiche Zahl Schüsse, kürzere Abstände (0,11–0,23 s), in der Mitte 1–2 halb überlappend (0,03–0,06 s)
            const reihe = [...Array(n).keys()]; for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [reihe[i], reihe[j]] = [reihe[j], reihe[i]]; }   // Figuren in zufälliger Folge, jede einmal
            const kz = window.SALVE_KURZ ? [30, 30, 110, 120] : [60, 60, 150, 150];   /* SP-3 (Enrico 26.11. 14:32): ruhiger – Abstände 0,15–0,3 s, in der Mitte 0,06–0,12 s, voller Trupp etwa 1,4 s (Rückweg SALVE_KURZ = 0,11–0,23 s) */
            for (let q = 0; q < m; q++) { if (q) tt += dop.has(q) ? kz[0] + Math.random() * kz[1] : kz[2] + Math.random() * kz[3]; plan.push([tt, m === n ? reihe[q] : q % n]); } }
          const spur = new Set(window.FIGFAK_ALT || n <= 4 ? [...Array(n).keys()] : [...Array(n).keys()].sort(() => Math.random() - 0.5).slice(0, 4));   // U3: jede Figur blitzt (SP-2), Leuchtspur und Pulverdampf nur bei 4 von 8 (Rückweg FIGFAK_ALT)
          let t = 0; const schuss = []; for (const [tq, f] of plan) { t = tq; schuss.push(t);
            setTimeout(() => playSound(key, (GEWEHR_ART === 'B' ? 0.5 : 0.42) * (0.8 + Math.random() * 0.4), au && au.side, { noGap: true, rate: 0.94 + Math.random() * 0.12, hall: GEWEHR_ART }), t / speed);
            const p = fxMuzzle(e.a, f); if (p) { fxFlash(0, p, x2, y2, { delay: t / 16.667, mul: figMul(p.h, 0.85, FX_SZ.muendung, 1.05) }); if (spur.has(f)) { fxTracer(0, p, x2, y2, { delay: t / 16.667 }); pulverDampf(p, 0.16, t / 16.667 + 3); } } }
          if (a.pose && a.pose.t0 != null) { a.pose.schuss = schuss; a.pose.gleich = true; a.pose.dauer = Math.max(900, t + 650); } salveT = t; }   // je Figur Mündungsfeuer und Leuchtspur im Takt der Salve
        else if (AT && AT.dauerfeuer) playSound(waffenTon('mg', au), 0.62, au.side, { rate: 0.8 + Math.random() * 0.06 });   // Eiserne Hünen: schweres MG, tiefer gestimmt (Enrico 15:26: Pult-Wahl gilt)   // Eiserne Hünen: schweres MG, tiefer gestimmt
        else if (!(rs === 'sniper' && e.kind === 'rifle')) playSound(waffenTon(e.kind === 'rifle' ? (au && au.type === 'buechse' ? 'neu4_gewehr_schwer' : rs) : schwerMG ? 'neu4_mg_schwer' : mini ? 'minigun' : mg ? 'mg' : au && au.type === 'kreuz' ? 'loewenkanone' : au && ['koloss', 'turm'].includes(au.type) ? 'kolosskanone' : au && au.side === 'D' && AT && AT.cls === 'walker' ? 'panzerkanone' : 'cannon', au), mg ? 0.55 : 0.6, au && au.side);

        // neue Effektbögen: Mündungsfeuer an der Laufmündung, Leuchtspuren; Drehlauf-Waffen mit eigenem Feuer
        const pm = e.zweit ? fxSeite(e.a, e.d) : fxMuzzle(e.a, 0, mini ? 0.45 : can ? 0.42 : 0.3), neu = !!(pm && fxIm('muendung'));
        if (neu) {
          if (mini && fxIm('drehlauf')) { const dr = fxDir(pm[0], pm[1], x2, y2, 0.5); for (let q = 0; q < 18; q++) fx('drehlauf', q % 2 ? 3 + Math.floor(Math.random() * 3) : Math.floor(Math.random() * 3), pm[0], pm[1], { anchor: q % 2 ? 'links' : 'mitte', delay: q * 4.5, life: 5, fadeOut: 0.6, flip: dr.flip, ang: dr.ang, mul: q % 2 ? 0.9 : 0.6 });
            for (let q = 0; q < 12; q++) fxTracer(1, pm, x2, y2, { delay: q * 6.5, life: 12 }); }   // F24: Salve etwa 1 s länger (18 statt 6 Feuerstöße)
          else if (mg) { for (const st of [0, 45]) { for (let q = 0; q < 6; q++) fxFlash(1, pm, x2, y2, { delay: st + q * 4.5, life: 4, mul: 0.75 + Math.random() * 0.2 }); for (let q = 0; q < 4; q++) fxTracer(1, pm, x2, y2, { delay: st + 2 + q * 6, life: 12 }); for (let q = 0; q < 2; q++) pulverDampf(pm, 0.13, st + 8 + q * 14); } }   // F28: zwei Feuerstöße; F71: kleine Wölkchen
          else if (can && au && au.type === 'kreuz' && !e.zweit && fxIm('loewenmaul') && !window.E4_ALT) { const dr = fxDirS(pm, x2, y2, 0.5); fx('loewenmaul', 0, pm[0], pm[1], { fuss: pm.fuss, anchor: 'links', life: 16, mul: 0.62, grow: 0.15, fadeOut: 0.55, flip: dr.flip, ang: dr.ang }); fx('loewenmaul', 1 + Math.floor(Math.random() * 2), pm[0], pm[1], { fuss: pm.fuss, anchor: 'links', delay: 3, life: 20, mul: 0.75, grow: 0.2, alpha: 0.85, fadeOut: 0.6, flip: dr.flip, ang: dr.ang }); pulverDampf(pm, 0.5, 6); }   /* U3 E4 (Punkt 62): Feuerstoß aus dem Löwenmaul, der linke Bildrand sitzt an der Mündung; Rückweg window.E4_ALT */
          else if (can) { fxFlash(3, pm, x2, y2, { life: 8, mul: 0.9 }); pulverDampf(pm, 0.42, 6); fx('rauch', null, pm[0], pm[1] + s * 0.15, { fuss: pm.fuss, life: 70, mul: 0.32, grow: 0.5, rise: 0.5, alpha: 0.75, fadeIn: 4, fadeOut: 0.6, flip: x2 < pm[0] }); }   // F16: Qualm an der Mündung
          else if (!salve && rs !== 'sniper') { const bu = au && au.type === 'buechse', v = bu ? 5 : rs === 'pistol' ? 2 : 0;   // Scharfschützen: Schüsse oben (F74)
            if (rs !== 'grenade') { pulverDampf(pm, v === 5 ? 0.2 : 0.14, 3); fxFlash(v, pm, x2, y2, { mul: v === 2 ? 0.7 : 0.85 }); fxTracer(bu ? 5 : 0, pm, x2, y2, bu ? { mul: 0.7 } : {}); } }
        }
        if (neu) {}   // F16: neue Effekte – auch Kanonen ohne alten Staub und ohne fliegendes Geschoss
        else if (mini) muzzles.push({ img: 'muzzle', x: x1 + Math.cos(ang) * s * 0.3, y: y1 + Math.sin(ang) * s * 0.3, ang, sz: 0.8, off: 0.12, life: 24, max: 24 });
        else if (neu) {}
        else if (mg && PJI.mgfire) { const lf = facesLeft(a.face), mz = a.muz, [mx, my] = mz ? [a.x + (!!mz[2] === lf ? mz[0] : -mz[0]), a.y + mz[1]] : [x1 + Math.cos(ang) * s * 0.25, y1 + Math.sin(ang) * s * 0.25];   // an der Laufmündung (im letzten Bild gemessen, bei Wendung gespiegelt)
          muzzles.push({ img: 'mgfire', x: mx, y: my, ang: mz ? (lf ? Math.PI : 0) : ang, sz: 0.85, off: 0.02, life: 26, max: 26 }); }
        else if (can) muzzles.push({ img: 'dust', x: x1 + Math.cos(ang) * s * 0.5, y: y1 + Math.sin(ang) * s * 0.5, ang, sz: 0.6, off: 0.15, life: 26, max: 26 });
        if (!neu) tracers.push({ x1: x1 + (x2 > x1 ? 1 : -1) * s * 0.5, y1, x2, y2, life: mg ? 30 : 15, max: mg ? 30 : 15, n: mg ? 9 : 1, stream: mg, col: can ? '#ff9a3a' : '#ffe27a', img: can ? 'shard' : 'bullet', sz: mg ? 0.17 : can ? 0.34 : 0.2 });
        if (mini) { setTimeout(() => playSound(waffenTon(schwerMG ? 'neu4_mg_schwer' : 'minigun', au), 0.5, au && au.side, { noGap: true }), 650 / speed); await wait(1000); }   // F24: zweiter Feuerstoß im Ton, Ablauf länger
        else if (mg && !(AT && AT.dauerfeuer)) { setTimeout(() => playSound(waffenTon(schwerMG ? 'neu4_mg_schwer' : 'mg', au), 0.5, au && au.side, { noGap: true, rate: 0.95 + Math.random() * 0.1 }), 750 / speed); await wait(750); }   // F28: zweiter MG-Feuerstoß
        if (salveT) await wait(Math.max(0, salveT - 150));   // F28: Schaden erst nach dem letzten Schuss der Salve
        await wait((mg ? 30 : 15) * 16.667 * 0.9);
        if (can) { boom(x2, y2 + s * 0.4, s * 0.5, 'he'); playSound('boom', 0.45); }
      }
      break;
    }
    case 'shell': if (e.strike && e.a != null) pose(e.a, 'funk', 1500);   // Feuerschlag: Fernsprechtrupp am Feldtelefon
      if (e.mode === 'barrage' && !e.strike) {
      const a = DU.get(e.a), [x2, y2] = center(e.c, e.r), ua = unitById(e.a), [x1, y1] = bodyPos(e.a), mob = TYPES[ua.type].mobile;
      if (camOn() && !inView(x1, y1)) await camTo(x1, y1, 260);
      a.face = e.face;
      const cells = (e.cells || [[e.c, e.r], ...E.neighbors(e.c, e.r)]).filter(([c, r]) => c >= 0 && r >= 0 && c < COLS && r < ROWS);
      const n = mob ? 3 : 4, key = tonPick(mob ? 'launch' : ua.type === 'feldkanone' ? 'cannon' : ua.side === 'D' ? 'artD' : 'cannonH', ua), dir = x2 >= x1 ? 1 : -1, dur = 34;
      const order = [0, ...cells.slice(1).map((_, i) => i + 1).sort(() => Math.random() - 0.5)];   // erst das Zielfeld, dann die Nachbarn in zufälliger Reihenfolge
      const shots = []; let t = 0;
      for (let q = 0; q < n; q++) { if (q) t += 220 + Math.random() * 140; shots.push(t); }
      shots.forEach((t, q) => setTimeout(() => {   // je Abschuss: Ton, Mündungsfeuer, Rückstoß-Ruck, Rauch, Granate
        if (key) playSound(key, (mob ? 0.42 : 0.75) * (0.85 + Math.random() * 0.25), ua.side, { noGap: true, rate: 0.9 + Math.random() * 0.15, gezogen: true });
        const pa = fxIm('muendung') ? fxMuzzle(e.a, 0, mob ? 0.12 : 0.32) : null;
        if (pa) { if (mob) fx('muendung', 4, pa[0], pa[1], { anchor: 'mitte', life: 7, fadeOut: 0.7, flip: x2 < x1, mul: 0.8 }); else fxFlash(3, pa, x2, y2 - s * 2, { life: 8 });
          fx('rauch', 0, pa[0], pa[1] + s * 0.2, { life: 60, mul: 0.28, grow: 0.6, rise: 0.5, alpha: 0.55, fadeIn: 5, fadeOut: 0.7 }); }
        a.lunge = { dx: -dir * s * 0.12, dy: -s * 0.02 }; setTimeout(() => { if (a.lunge && a.lunge.dx === -dir * s * 0.12) a.lunge = null; }, 110 / speed);
        const [cx, cy] = center(...cells[order[q % order.length]]);
        shells.push({ fxi: mob ? 1 : 0, x1, y1, x2: cx, y2: cy, t: 0, dur, col: '#2a2a26', img: mob ? (PJI.rocket ? 'rocket' : 'shellB') : 'shellA', sz: 0.4 });
      }, t / speed));
      if (camOn() && !inView(x2, y2, 0.12)) { camFern(); setTimeout(() => camTo(x2, y2, dur * 16.667 * 0.8), 200 / speed); }
      await wait(shots[0] + dur * 16.667);
      // Einschläge versetzt über alle Zielfelder (Zielfeld zuerst), jeder mit eigenem Knall
      const imp = order.map((ci, i) => [cells[ci], i < n ? shots[i] : shots[n - 1] + (i - n + 1) * (140 + Math.random() * 120)]);
      for (const [[c, r], tt] of imp) setTimeout(() => { const [bx, by] = center(c, r); boom(bx, by, s * (c === e.c && r === e.r ? 0.75 : 0.6), 'he'); playSound(mob ? 'sperr_boom' : 'sperr_boomH', 0.5 * (0.8 + Math.random() * 0.3), null, { noGap: true }); shake(4); }, (tt - shots[0]) / speed);
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
      const mob = TYPES[ua.type].mobile, flach = !!TYPES[ua.type].direkt && !e.strike, pa = !e.strike && fxIm('muendung') ? fxMuzzle(e.a, 0, mob ? 0.12 : 0.32) : null;   // Feldkanone: flache Bahn (Enrico 2026-11-22 17:40)
      if (pa) { if (mob) fx('muendung', 4, pa[0], pa[1], { anchor: 'mitte', life: 7, fadeOut: 0.7, flip: x2 < x1, mul: 0.8 }); else fxFlash(3, pa, x2, flach ? y2 - s * 0.35 : y2 - s * 2, { life: 8 });   // Feldkanone: Mündungsfeuer waagerecht zum Ziel   // Mörser: kurzer Blitz nach oben, Geschütz: großer Mündungskegel
        fx('rauch', 0, pa[0], pa[1] + s * 0.2, { life: 70, mul: 0.3, grow: 0.6, rise: 0.5, alpha: 0.6, fadeIn: 6, fadeOut: 0.7 }); }
      else if (e.strike) {} else if (PJI.dust) muzzles.push({ img: 'dust', x: x1 + (x2 > x1 ? 1 : -1) * s * 0.4, y: y1 - s * 0.15, ang: x2 > x1 ? -0.6 : Math.PI + 0.6, sz: 0.7, off: 0.15, life: 30, max: 30 }); else boom(x1 + (x2 > x1 ? 1 : -1) * s * 0.7, y1, s * 0.35, 'he');
      const dur = flach ? 12 : 34;   // in 60-Hz-Bildern bei Tempo 1; wait() teilt durch das Tempo wie die Flugbahn; Feldkanone: schnelles Geschoss
      const luft = e.mode === 'gas' && BW ? s * 1.5 : 0;   // Punkt 19 (2026-11-24): Gasgranate zerplatzt in der Luft über der Mitte des Zielbereichs
      shells.push({ fxi: e.mode === 'gas' ? 5 : TYPES[ua.type].mobile && !e.strike ? 1 : 0, x1, y1, x2, y2: y2 - luft, t: 0, dur, col: e.mode === 'gas' ? '#c4d646' : '#2a2a26', img: TYPES[ua.type].mobile && !e.strike ? (PJI.rocket ? 'rocket' : 'shellB') : 'shellA', sz: 0.4, ...(flach ? { arc: 0.15, fxs: 0.8 } : {}) });
      if (camOn() && !inView(x2, y2, 0.12)) { camFern(); camTo(x2, y2, dur * 16.667 * 0.8); }
      await wait(dur * 16.667);
      lastFire = { kind: e.mode === 'gas' ? 'gas' : 'shell', t: performance.now(), a: e.a };   // F64: Einschlag-Ton beim folgenden Treffer
      shake(e.mode === 'barrage' ? 7 : 5);   // Einschlag: kurzes Bildwackeln
      if (e.scatter) floater(x2, y2 - s, 'Streuung!', '#f0d27a');
      if (e.guided) floater(x2, y2 - s * 1.5, '◉ markiert ×1,25', '#F0EDE1', false, true);
      playSound(e.mode === 'gas' ? 'gas' : e.mode === 'barrage' ? 'barrage' : TYPES[ua.type].mobile && !e.strike ? 'boom' : 'einschlagH', e.mode === 'he' && !(TYPES[ua.type].mobile && !e.strike) ? 0.8 : 0.7);   // Einzelschuss: Einschlag mit mehr Volumen und Tiefe
      if (e.mode === 'he' && G.map[e.c] && G.map[e.c][e.r] && (G.map[e.c][e.r].river || ['canal', 'sumpf', 'furt'].includes(G.map[e.c][e.r].t))) playSound('wasser', 0.6);
      if (e.mode === 'he') { boom(x2, y2, s * 0.95, 'he'); burst(x2, y2, 16, ['#5a4632', '#3d3024', '#8a7a52'], { up: 0.3, spread: 0.3 }); }
      else if (e.mode === 'gas' && luft) {   // Luftzerleger: kleiner dumpfer Knall, Hülsensplitter, drei Gasschlieren sinken im Bogen auf die betroffenen Felder, Wolke erst beim Aufsetzen
        const ya = y2 - luft, alt = new Set((VIS.clouds || []).map(k => k.c + ',' + k.r)), neu = (G.clouds || []).filter(k => !alt.has(k.c + ',' + k.r)), ziele = (neu.length ? neu : [{ c: e.c, r: e.r }]).slice(0, 3);
        boom(x2, ya, s * 0.45, 'gas'); burst(x2, ya, 10, ['#6b6a60', '#8d8b80', '#4a4943'], { up: -0.05, spread: 0.22 }); playSound('einschlag', 0.25, null, { noGap: true, rate: 0.7 });
        const E1 = !window.E1_ALT && fxN('gasschliere_dick') >= 3;   // U3 E1 (Punkt 62): dicke Gasfahnen sinken auf die Felder, feine Fäden daneben; Rückweg window.E1_ALT
        ziele.forEach((k, i) => { const [cx, cy] = center(k.c, k.r);
          if (E1) { fx('gasschliere_dick', i % 3, x2, ya, { anchor: 'mitte', delay: i * 3, move: [cx, cy], life: 40, mul: 0.42, grow: 0.7, alpha: 0.9, fadeIn: 3, fadeOut: 0.3, flip: cx < x2 }); if (BW && fxN('gasschliere')) fx('gasschliere', null, x2 + (Math.random() - 0.5) * s * 0.3, ya, { anchor: 'mitte', delay: i * 3 + 2, move: [cx + (Math.random() - 0.5) * s * 0.4, cy], life: 36, mul: 0.4, grow: 0.4, alpha: 0.7, fadeIn: 3, fadeOut: 0.35, flip: cx < x2 }); }
          else fx('gas', null, x2, ya, { anchor: 'mitte', delay: i * 3, move: [cx, cy], life: 34, mul: 0.35, grow: 0.9, alpha: 0.85, fadeIn: 2, fadeOut: 0.25, flip: cx < x2 }); });
        await wait(420); visSync('clouds'); ziele.forEach(k => { const [cx, cy] = center(k.c, k.r); boom(cx, cy, s * 0.7, 'gas'); }); }
      else if (e.mode === 'gas') { boom(x2, y2, s * 1.0, 'gas'); visSync('clouds'); }   // Wolke erst beim Einschlag
      else { boom(x2, y2, s * 0.7, 'he'); (e.cells || [[e.c, e.r], ...E.neighbors(e.c, e.r)]).slice(1).forEach(([c, r], i) => { const [bx, by] = center(c, r); boom(bx, by, s * 0.6, i % 2 ? 'dust' : 'he', 3 + i * 3); }); }
      await wait(e.mode === 'barrage' ? 420 : 260); break;
    }
    case 'eisbruch': {   // Eis bricht ein (Enrico 20:50): Krachen, Splitter, Loch; die Einheit darauf rettet sich danach (eisweg)
      const [x, y] = center(e.c, e.r), k = e.c + ',' + e.r; playSound('eis_bricht', 0.75, null, { noGap: true }); shake(5);
      if (fxN('winter_schnee') >= 6) { fx('winter_schnee', 5, x, y + s * 0.3, { life: 64, mul: 0.95, grow: 0.15, fadeOut: 0.5 }); fx('winter_schnee', 3, x, y + s * 0.35, { delay: 6, life: 60, mul: 0.6, grow: 0.3, alpha: 0.8, fadeOut: 0.6 }); }
      for (let i = gmarks.length - 1; i >= 0; i--) if (gmarks[i].eis === k) gmarks.splice(i, 1);
      if (fxN('eisloch')) gmark('eisloch', 0, x, y + s * 0.05, { mul: 1, alpha: 0.97, flip: Math.random() < 0.5, turns: 9999, eis: k });
      floater(x, y - s * 0.7, 'Das Eis bricht!', '#cfe3f0'); await wait(550); break; }
    case 'eisweg': { if (DU.get(e.u)) { playSound('schnee_rennen', 0.45, null, { noGap: true }); await animPath(e.u, e.path, 300); } break; }   // rettet sich ans Ufer
    case 'eiszu': { const k = e.c + ',' + e.r; for (const m of gmarks) if (m.eis === k && !m.weg) m.weg = now; const [x, y] = center(e.c, e.r); playSound('eis_knackt', 0.3, null, { noGap: true }); floater(x, y - s * 0.5, 'Eis friert zu', '#cfe3f0'); break; }
    case 'melee': case 'counter': {
      if (e.t === 'melee') { const dd = DU.get(e.d), da = DU.get(e.a); if (dd && da) spurSchnee(5, da.x, da.y, dd.x, dd.y, { mul: 0.55, alpha: 0.75 }); }   // Winter: zertrampelter Schnee
      getuemmel();   // Getümmel-Schleife, solange Nahkampf läuft (2026-11-18)
      { const ha = unitById(e.a); if (ha && ha.type === 'faust') playSound('held_aufladen', 0.5); else if (ha && ha.type === 'kuerass') { playSound('held_saege_start2', 0.55); if (e.t === 'melee') playSound('held_ritter_schrei', 0.45); } else if (ha && ha.type === 'reiter' && e.t === 'melee') playSound('pferd_angriff', 0.45, null, { von: ha }); }   // Helden: Ausholen; R4: Ruf des Pferds beim Angriff (Pult-Zeile, Standard stahlreiter_wiehern1)
      pose(e.a, 'kolben', 650);   // Kolbenschlag mit kurzem Vorstoß
      const a = DU.get(e.a), d = DU.get(e.d);
      const ksz = e.t === 'melee' ? await kampfSzene((a.x + d.x) / 2, (a.y + d.y) / 2 - L.s * 0.4) : null;   // F48: Kampfszene
      if (!ksz && camOn() && e.t === 'melee' && !inView((a.x + d.x) / 2, (a.y + d.y) / 2 - L.s * 0.4, 0.15)) await camTo((a.x + d.x) / 2, (a.y + d.y) / 2 - L.s * 0.4, 520);   // F34: Kamera weich zum Nahkampf
      const fzFest = id => { const x = unitById(id); return !!x && E.fahrzeugArt && E.fahrzeugArt(x) === 'fahrzeug'; };   // F90 (2026-11-22): Fahrzeuge bleiben in ihrer Richtung (Regel F76), auch beim Gegenschlag
      if (e.face != null) a.face = e.face; else if (!fzFest(e.a)) a.face = d.x >= a.x ? 0 : 3;
      { const du0 = unitById(e.d); if (e.t === 'melee' && du0 && !fzFest(e.d)) d.face = a.x >= d.x ? 0 : 3; }   // F76: Verteidiger dreht sich in der Szene zum Angreifer (Panzer nur sichtbar – nach der Szene stellt syncAll ihre Blickrichtung aus den Regeln wieder her)
      const au = unitById(e.a), du = unitById(e.d), af = au && TYPES[au.type].fig, armored = du && TYPES[du.type].cls === 'walker';
      const strikeSnd = () => {   // Ton für jeden, der zuschlägt: Angreifer (melee) und Verteidiger beim Gegenschlag (counter) – Wunsch des Nutzers; erklingt beim Treffer
        const mech = au && TYPES[au.type].mech, psA = (n, v, sd, o) => playSound(n, v, sd, { ...(o || {}), von: au });   // Pult-Wahl dessen, der zuschlägt
        const du0 = unitById(e.d), foot = x => x && ['inf', 'mg', 'storm', 'medic', 'flame'].includes(TYPES[x.type].cls) && !TYPES[x.type].suit;
        const tank = au && TYPES[au.type].cls === 'walker' && !mech;
        // Grundklang je Fraktion (2026-11-17): Konkordat Klingen/Keule/Fäuste (nahA), Aschenwacht Spaten/Metall (nahD); eigene Töne nur für
        // Kolosse/Schreiter (heavy/impact), Kampfanzüge (sword), Grabenräumer (axe + Flinte), Sturmbrecher (Handgranate + Flinte)
        const base = au && au.side === 'D' ? 'nahD' : 'nahA', suit = au && TYPES[au.type].suit;
        const gep0 = du0 && (TYPES[du0.type].cls === 'walker' || TYPES[du0.type].suit);   // Paket G 4b (Enrico 2026-11-21): Löwenoger = Tiger-Attacke + Fleisch-Treffer, gegen Gepanzerte Biss auf Panzerung
        if (au && au.type === 'faust') { heldFunken(4, (a.x + d.x) / 2 + (d.x - a.x) * 0.25, d.y - L.s * 0.45, { mul: 0.5 }); psA('held_faustschlag2', 0.65); setTimeout(() => psA('held_dampfstoss', 0.35), 240 / speed); } else   // Helden (Enrico 2026-11-21)
        if (au && au.type === 'kuerass') { const hx = (a.x + d.x) / 2 + (d.x - a.x) * 0.25, hy = d.y - L.s * 0.5; heldFunken(1, hx, hy, { mul: 0.5, flip: d.x < a.x }); heldFunken(2, hx, hy, { mul: 0.45, delay: 2 }); psA('held_saege_schnitt2', 0.6); psA(kschwertTon(e.d), 0.5); } else
        if (au && au.type === 'saeger') { if (gep0) psA('saege_metall', 0.6); else { psA('saege_einschlag', 0.6); setTimeout(() => psA('saege_fleisch', 0.45), 220 / speed); } } else   // Sägeschreiter (Enrico 2026-11-22)
        if (au && au.type === 'orden') psA(gep0 ? 'orden_metall' : 'orden_fleisch', 0.55); else   /* SP-3 (84.10): Kettenschwert des Ordensschreiters – eigene Plätze, gegen Fußtruppen Säge im Fleisch, gegen Gepanzerte Kettenschwert auf Rüstung (vorher heavy) */
        if (au && au.type === 'oger') { psA('neu3_bestie', 0.5 * (e.t === 'counter' ? 0.85 : 1)); psA(gep0 ? 'krallen_eisen' : 'krallen_fleisch', 0.55); } else   // Raubkatzen-Krallen (Enrico 2026-11-22; vorher neu3_biss/neu3_fleisch, im Pult wählbar)
        if (au && au.type === 'klaue') psA(gep0 ? 'stahlklaue_eisen' : 'stahlklaue_fleisch', 0.6); else   // Stahlklaue des Klauenschreiters
        psA(mech ? 'heavy' : tank ? 'armor' : suit ? 'sword' : au && TYPES[au.type].cls === 'cav' ? 'saebel' : af === 'raider' || af === 'brawler' ? 'axe' : base,   /* F80: normaler Hiebton statt Granate */ (mech || tank ? 0.7 : 0.55) * (e.t === 'counter' ? 0.85 : 1));
        if (au && au.type === 'oger') { if (e.t === 'melee' || Math.random() < 0.5) psA('oger_bruell', 0.45); }   // Löwenoger brüllt statt zu schreien
        else if (foot(au) && foot(du0) && Math.random() < 0.35) psA('cry', 0.35, null, { u: au });
        if (au && ['raeumer', 'sturm'].includes(au.type)) psA('flinte', 0.5);   // kurzer Schuss im Grabenkampf
        if (au && TYPES[au.type].cls === 'inf' && !TYPES[au.type].suit && !TYPES[au.type].cmd && Math.random() < 0.6) setTimeout(() => psA('schaufel', 0.4, null, { noGap: true }), (120 + Math.random() * 200) / speed);   // F32: Spatenhiebe im Grabenkampf
        if (au && TYPES[au.type].cls === 'storm' && e.t === 'melee' && au.type !== 'oger') psA('cry', 0.45, null, { u: au });   // Kampfschrei beim Sturmangriff
        if (af === 'mechB') psA('tiger', 0.4);   // Klauenschreiter brüllt (snarl entfernt, Tonprobe 2026-11-18)
      };
      let thrown = false;
      { const kc = au && TYPES[au.type].cls; if (false && e.t === 'melee' && kc === 'storm' && af !== 'shield' && af !== 'raider' && af !== 'brawler') (thrown = true,   /* F80: Sturmtrupps schlagen im Nahkampf normal zu, keine geworfene Ladung mehr */ pose(e.a, 'wurf', 800), shells.push({ fxi: au.side === 'A' ? 3 : 2, fxs: 0.75, x1: a.x, y1: a.y - s * 0.5, x2: d.x, y2: d.y - s * 0.2, t: 0, dur: 16, arc: 0.9, spin: true, img: au.side === 'A' ? 'pine' : 'stick', sz: 0.3 })); }
      // F51 (2026-11-20): Schlagabtausch – Hieb und Gegenhieb abwechselnd ohne Pause (A–V–A–V), je mit Posenwechsel, Ruck des Getroffenen und Spritzern;
      // der letzte, härteste Hieb kommt danach vom Angreifer mit der Wucht aus F48. Der Gegenschlag-Ereignis selbst ist dann nur noch kurz.
      if (e.t === 'melee' && !thrown) { const T0 = au && TYPES[au.type], du1 = unitById(e.d), Td = du1 && TYPES[du1.type], fl = d.x < a.x;
        const hiebTon = (x, T) => x && T ? (x.type === 'oger' ? 'neu3_fleisch' : T.cls === 'walker' ? (T.mech ? 'heavy' : 'armor') : T.suit ? 'sword' : T.cls === 'cav' ? 'saebel' : x.side === 'D' ? 'nahD' : 'nahA') : 'nahA';
        const zug = af === 'drill' ? 0 : nkGleich ? 2 : Td && Td.atk > 0 && du1.status === 'ok' ? 4 : 2;   // F63: kürzer; Bohrkoloss: ein langer Bohrstoß (unten)
        if (af === 'drill') {   // F54 (Enrico 2026-11-21): Bohrkoloss – ein einziger Stoß, der sich hineinbohrt: Vorstoß, dann ~0,9 s Rütteln, Funken bzw. Blut, Bohrton hält an
          a.lunge = { dx: (d.x - a.x) * 0.3, dy: (d.y - a.y) * 0.3 }; playSound('smash', 0.65, au && au.side, { von: au }); playSound('aufprall_bohr', 0.45, null, { von: au });
          for (let q = 0; q < 8; q++) { a.lunge = { dx: (d.x - a.x) * (0.3 + (q % 2) * 0.03) + (Math.random() - 0.5) * L.s * 0.03, dy: (d.y - a.y) * 0.3 + (Math.random() - 0.5) * L.s * 0.03 };
            if (q % 2 === 0) { shake(3); pose(e.d, 'getroffen', 200); trefferSpritzer(a.x, a.y, d, q >= 4 ? 2 : 1, istMaschine(du1)); fx('truemmer', 3, d.x, d.y + L.s * 0.3, { life: 26, mul: 0.4, grow: 0.3, alpha: 0.7, fadeOut: 0.6 }); }
            await wait(110); } }
        for (let i = 0; i < zug; i++) {
          if (nkGleich && nkGleich.gegen) {   // F51: beide schlagen gleichzeitig (Getümmel)
            pose(e.a, 'kolben', 380); pose(e.d, 'kolben', 380); a.lunge = { dx: (d.x - a.x) * 0.22, dy: (d.y - a.y) * 0.22 }; d.lunge = { dx: (a.x - d.x) * 0.22, dy: (a.y - d.y) * 0.22 };
            playSound(hiebTon(au, T0), 0.4, au && au.side, { noGap: true, rate: 0.9 + Math.random() * 0.2, von: au }); setTimeout(() => playSound(hiebTon(du1, Td), 0.4, du1 && du1.side, { noGap: true, rate: 0.9 + Math.random() * 0.2, von: du1 }), (40 + Math.random() * 80) / speed);
            fx('nahkampf', Math.floor(Math.random() * 4), (a.x + d.x) / 2, (a.y + d.y) / 2 - L.s * (0.35 + Math.random() * 0.2), { anchor: 'mitte', life: 12, fadeOut: 0.6, grow: 0.2, flip: Math.random() < 0.5, mul: 0.6 });
            trefferSpritzer(a.x, a.y, d, 1, istMaschine(du1)); trefferSpritzer(d.x, d.y, a, 1, istMaschine(au));
            await wait(150 + Math.random() * 60); a.lunge = null; d.lunge = null; continue; }
          const angr = i % 2 === 0, S = angr ? a : d, Z = angr ? d : a, sid = angr ? e.a : e.d, zid = angr ? e.d : e.a, su = angr ? au : du1;
          if (!S || !Z) break; pose(sid, 'kolben', 380); pose(zid, 'getroffen', 300);
          S.lunge = { dx: (Z.x - S.x) * 0.3, dy: (Z.y - S.y) * 0.3 }; Z.lunge = { dx: (Z.x - S.x) * -0.06, dy: (Z.y - S.y) * -0.06 };
          playSound(hiebTon(su, su && TYPES[su.type]), 0.4 + Math.random() * 0.12, su && su.side, { noGap: true, rate: 0.9 + Math.random() * 0.2, von: su });
          if (Math.random() < 0.4 && su && TYPES[su.type].cls === 'inf' && !TYPES[su.type].suit) playSound('schaufel', 0.28, null, { noGap: true, von: su });
          fx('nahkampf', istMaschine(angr ? du1 : au) ? 4 : Math.floor(Math.random() * 4), Z.x + (Z.x < S.x ? 1 : -1) * L.s * 0.08, Z.y - L.s * (0.35 + Math.random() * 0.2), { anchor: 'mitte', life: 12, fadeOut: 0.6, grow: 0.2, flip: Z.x < S.x, mul: 0.55 });
          trefferSpritzer(S.x, S.y, Z, 1, istMaschine(angr ? du1 : au));
          await wait(150 + Math.random() * 100); S.lunge = null; Z.lunge = null; } }
      if (au && TYPES[au.type].cls === 'walker' && af !== 'drill') { a.lunge = { dx: (a.x - d.x) * 0.1, dy: (a.y - d.y) * 0.1 - L.s * 0.04 }; await wait(120); }   // F73: Ausholen
      a.lunge = { dx: (d.x - a.x) * 0.38, dy: (d.y - a.y) * 0.38 }; await wait(thrown ? 16 * 16.667 : e.t === 'counter' ? 90 : 140);   // Handgranate: Knall erst beim Aufschlag
      strikeSnd(); if (nkGleich) nkGleich.ksz = ksz; else await szeneWucht(ksz, e.a, e.d); if (e.t === 'melee' && !nkGleich) { trefferSpritzer(a.x, a.y, d, 3, armored); if (ksz && blood && !armored) fx('blut', Math.floor(Math.random() * 3), d.x + (d.x < a.x ? -1 : 1) * L.s * 0.1, d.y - L.s * 0.5, { anchor: 'mitte', life: 30, mul: 0.95, grow: 0.35, flip: d.x < a.x, filter: BLUT_FILTER }); }   // F50: Schwall beim Wucht-Moment
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
          if (blood && du && !['walker', 'art'].includes(TYPES[du.type].cls)) { fx('blut', Math.floor(Math.random() * 3), d.x + (fl ? -1 : 1) * s * 0.15, d.y - s * 0.4, { anchor: 'mitte', life: 28, mul: 0.42, grow: 0.25, flip: fl, filter: BLUT_FILTER }); if (Math.random() < 0.5) blutFleck(d.x + (fl ? -1 : 1) * s * 0.2, d.y + s * 0.15 * kAt(d.x, d.y), 0.3); }   // F27: Spritzer im Nahkampf, manchmal ein Fleck am Boden
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
      if (nkGleich) { await wait(100); a.lunge = null; } else { await wait(170); a.lunge = null; await wait(70); }   // F63: im gemeinsamen Nahkampf kürzer
      // F28-Hiebfolge nach dem Hauptschlag ersetzt durch den Schlagabtausch davor (F51)
      if (!nkGleich) await kampfSzeneEnde(ksz);
      break;
    }
    case 'hit': {
      const d = DU.get(e.u), [x, y] = bodyPos(e.u);
      if (e.dmg > 0 && !e.panic) trefferBis = performance.now() + 1200 / Math.max(0.5, speed);   // SP-1 (84.9): Kamera bleibt ~1,2 s auf dem Treffer
      if (!e.panic && e.dmg > 0 && u && TYPES[u.type].held) playSound('held_ruestung', 0.5);   // Helden getroffen
      if (e.stand) auraPuls(e.stand, 'faust');   // F86: Standhaft hat gewirkt
      if (!e.panic && e.dmg > 0) { const ab = poseHat(u, 'aufbaeumen') && Math.random() < 0.4; pose(e.u, ab ? 'aufbaeumen' : 'getroffen', ab ? 800 : 550); }   // kurz taumeln; Reiter: Pferd bäumt sich manchmal auf (Runde 2)
      if (!e.panic && e.dmg > 0 && d && !e.wire && !window.TREFFERBLUT_ALT) { const la = letzterAngreifer && performance.now() - letzterAngreifer.t < 3000 ? DU.get(letzterAngreifer.id) : null, Tz = TYPES[u.type], hart = istMaschine(u) || !!Tz.suit || !!Tz.gepanzert, fall = e.fall || 0;   // ST1 (115.6): jeder Treffer an Fußtruppen/Reitern ein Blutspritzer, fällt ein Mann ein größerer mit Bodenfleck; Gepanzerte/Fahrzeuge Funken (Blut-Schalter gilt)
        trefferSpritzer(la ? la.x : d.x - L.s, la ? la.y : d.y, d, fall > 0 && window.FIGURSPRITZ_ALT ? 2 : 1, hart); if (fall > 0 && !hart && window.FIGURSPRITZ_ALT) blutFleck(d.x + (Math.random() - 0.5) * L.s * 0.5, d.y + L.s * 0.15 * kAt(d.x, d.y), 0.28); }
      if ((E.isMech(u.type) && TYPES[u.type].cls === 'walker') || TYPES[u.type].dauerfeuer) playSound('robot', 0.5, null, { u, v: 'mr' });   // Hünen (2026-11-20): Maschinenstimme   // Schreiter/Eisenknecht; Kampfanzüge rufen wie Fußtruppen (unten)
      d.str = e.str; d.mor = e.morv; d.shake = 1; setTimeout(() => d.shake = 0, 260 / speed);
      if (!e.panic && e.dmg >= 1.5) shake(e.dmg >= 2.5 ? 6 : 4);
      if (!e.panic && !e.wire && !e.burn && STEIN.includes(G.map[u.c][u.r].t)) playSound('impact', 0.35);   // Treffer auf Gebäude/Stein (Tonprobe 2026-11-18; vorher Fahrzeug)
      // F64 (2026-11-21): Einschlag-Ton nach dem ZIEL – weich (Fußtruppen, Reiter, Bedienungen): dumpfer Treffer („einschlag“), nie metallisch;
      // gepanzert (Fahrzeuge, Schreiter, Kampfanzüge): wirkt die Waffe dagegen (Kanone, Panzerbüchse, Granate, Kanone gegen Panzerung), schwerer Metallkrach („einschlag_panzer“), sonst heller Abpraller („einschlag_abpraller“)
      if (!e.panic && !e.wire && !e.burn && lastFire && performance.now() - lastFire.t < 6000 && lastFire.kind !== 'gas' && lastFire.kind !== 'flame' && (TYPES[u.type].cls === 'walker' || TYPES[u.type].suit)) {
        const art = einschlagArt(u, lastFire), sv = lfVon(); setTimeout(() => playSound(art === 'panzer' ? 'einschlag_panzer' : 'einschlag_abpraller', art === 'panzer' ? 0.5 : 0.3, null, { rate: 0.92 + Math.random() * 0.16, von: sv }), (60 + Math.random() * 90) / speed); }
      else if (!e.panic && !e.wire && !e.burn && lastFire && performance.now() - lastFire.t < 6000 && (lastFire.kind === 'cannon' || lastFire.kind === 'shell') && e.dmg >= 0.3) playSound('einschlag', 0.3, null, { rate: 0.72 + Math.random() * 0.08, dur: 320, von: lfVon() });   // Granatsplitter/Kanone in weiches Ziel: dumpf, tief
      // F98 (2026-11-22): kleine Blutspritzer auch bei Handwaffen (Gewehr, MG, Drehlauf, Schrot, Pistole, Splitter) – etwa jeder zweite Treffer, 1–2 kleine fx_blut in Schussrichtung an einer getroffenen Figur;
      // nie an Fahrzeugen und Schreitern, an Kampfanzügen nur, wenn der Treffer wirkt; Bildwirkung „leicht“ weniger, „aus“ keine
      if (!e.panic && !e.wire && !e.burn && blood && BW && e.dmg >= 0.2 && lastFire && performance.now() - lastFire.t < 6000 && !['cannon', 'shell', 'flame', 'gas'].includes(lastFire.kind) && !istMaschine(u) && (!TYPES[u.type].suit || e.dmg >= 0.35) && Math.random() < (BW === 1 ? 0.4 : 0.55)) {
        const q = DU.get(lastFire.a) || { x: d.x - L.s, y: d.y }, fl = d.x < q.x, b = d.fbx && d.fbx.length ? d.fbx[Math.floor(Math.random() * d.fbx.length)] : null;
        for (let k = 0; k < (e.dmg >= 0.8 ? 2 : 1); k++) { const bx = b ? d.x + b[0] + b[2] * (0.3 + Math.random() * 0.4) : d.x, by = b ? d.y + b[1] + b[3] * (0.25 + Math.random() * 0.3) : d.y - s * 0.5;
          fxOben(fx('blut', Math.floor(Math.random() * 3), bx + (fl ? -1 : 1) * s * 0.06, by, { anchor: 'mitte', life: 22, mul: 0.26 + Math.random() * 0.1, grow: 0.25, flip: fl, filter: BLUT_FILTER, delay: 1 + k * 4 })); } }
      // F64 Teil 3 (2026-11-21): etwas blutiger auch bei Beschuss (Comic-Tinte, abschaltbar über „Blut“): Gewehr kleiner Blutnebel,
      // Kanone/Granate auf Fußtruppen Erd- und Blutfontäne mit Erdklumpen und Blutflecken am Boden
      if (!e.panic && !e.wire && !e.burn && blood && e.dmg >= 0.3 && lastFire && performance.now() - lastFire.t < 6000 && !istMaschine(u) && !TYPES[u.type].suit) {
        const q = DU.get(lastFire.a) || { x: d.x - L.s, y: d.y };
        if (lastFire.kind === 'rifle') { trefferSpritzer(q.x, q.y, d, e.dmg >= 0.6 ? 2 : 1); if (e.dmg >= 0.6) blutFleck(d.x + (Math.random() - 0.5) * s * 0.5, d.y + s * (0.05 + Math.random() * 0.2) * kAt(d.x, d.y), 0.22); }   // F72: kräftiger
        else if (lastFire.kind === 'cannon' || lastFire.kind === 'shell') { const fl = d.x < q.x;
          fx('erdfontaene', null, d.x, d.y + s * 0.3, { life: 44, mul: 0.32, grow: 0.2, flip: fl, fadeOut: 0.45, filter: 'brightness(0.7) sepia(0.3)' });
          for (let k = 0; k < 2; k++) fxOben(fx('blut', Math.floor(Math.random() * 3), d.x + (fl ? -1 : 1) * s * (0.1 + 0.2 * k), d.y - s * (0.5 - 0.15 * k), { anchor: 'mitte', life: 34, mul: 0.75 + 0.1 * Math.min(3, e.dmg) - 0.2 * k, grow: 0.35, flip: fl, filter: BLUT_FILTER, delay: 3 + k * 3 }));   // obenauf, sonst verdecken Feuerball und Erdfontäne das Blut
          fx('truemmer', 4, d.x, d.y + s * 0.2, { life: 34, mul: 0.4, grow: 0.25, flip: !fl, delay: 3 });
          trefferSpritzer(q.x, q.y, d, 3); blutFleck(d.x + (Math.random() - 0.5) * s * 0.5, d.y + s * (0.05 + Math.random() * 0.2) * kAt(d.x, d.y), 0.3 + Math.min(0.2, e.dmg * 0.06)); } }
      if (!e.panic && !e.wire && lastFire && performance.now() - lastFire.t < 6000 && ['rifle', 'mg', 'minigun'].includes(lastFire.kind)) for (let k = 0; k < 3; k++) fx('truemmer', 2, d.x + (Math.random() - 0.5) * s * 1.1, d.y + s * (0.2 + Math.random() * 0.25), { delay: k * 4, life: 26, mul: 0.22 + Math.random() * 0.1, grow: 0.3, alpha: 0.75, fadeOut: 0.6, flip: Math.random() < 0.5 });   // F72: Erd- und Staubspritzer rund um das Ziel
      if (!e.panic && !e.wire && lastFire && performance.now() - lastFire.t < 6000 && ['rifle', 'mg', 'minigun'].includes(lastFire.kind)) {
        const soft = !(TYPES[u.type].cls === 'walker' || TYPES[u.type].suit);   // F64: Geschützbedienungen sind weich (Körpertreffer)
        if (!soft) {}   // gepanzert: Ton oben (Abpraller bzw. Metallkrach)
        else if (lastFire.kind !== 'rifle') playSound('einschlag', 0.22, null, { rate: 0.78 + Math.random() * 0.08, dur: 260, von: lfVon() });
        if (lastFire.kind !== 'rifle' && e.dmg >= 0.6) trefferSpritzer(x - L.s, y, d, e.dmg >= 1.5 ? 2 : 1, !soft);   // F50: schwere Treffer (MG) spritzen mehr; Maschinen Funken/Öl   // MG-Treffer: dumpfer Einschlag in den Körper, tiefer gestimmt, kurz und leise (Spieltest 2026-11-17)
        if (soft && lastFire.kind === 'rifle') playSound(e.dmg >= 0.3 ? 'einschlag' : 'vorbei', 0.35, null, { von: lfVon() });
      }
      if (!e.panic && !e.wire && lastFire && performance.now() - lastFire.t < 6000 && (TYPES[u.type].cls === 'walker' || TYPES[u.type].suit)) fx('funken', null, x + (Math.random() - 0.5) * s * 0.4, y, { anchor: 'mitte', life: 12, fadeOut: 0.6, mul: 0.6, flip: Math.random() < 0.5 });   // Treffer auf Panzerung
      if (!e.panic) {
        if (TYPES[u.type].cls === 'cav') playSound(Math.random() < 0.65 ? 'pferd_unruhe' : 'neigh', Math.random() < 0.65 ? 0.5 : 0.35); else if (u.limbered) playSound('neigh', 0.35);   // Pferde gleich laut (Spieltest Runde 2)   // Reiter beschossen: unruhige Pferde
        else if (TYPES[u.type].dauerfeuer) {}   // Hünen: nur die Maschinenstimme oben
        else if (u.type === 'oger' && e.dmg >= 0.3 && e.dmg < 2 && !e.wire) playSound('neu3_loewe', 0.45);   // Paket G (Enrico 2026-11-21): Löwenoger leicht bis mittel getroffen = Löwe; schwere Treffer (ab 20 Stärke) wie bisher
        else if (['inf', 'mg', 'storm', 'medic'].includes(TYPES[u.type].cls) && (e.dmg >= 1 || (!e.wire && e.dmg >= 0.4 && lastFire && performance.now() - lastFire.t < 6000 && ['mg', 'minigun'].includes(lastFire.kind) && Math.random() < 0.55))) playSound(e.str < 3.5 && Math.random() < 0.6 ? 'medic' : 'pain', 0.45, null, { u });
        else if (['inf', 'mg', 'storm', 'medic'].includes(TYPES[u.type].cls) && e.dmg >= 0.3 && !e.wire) playSound(Math.random() < 0.6 ? 'grunzen' : 'gasmaske_2', 0.4, null, { u });   // leichte Verletzung: Grunzen bzw. Maskenlaut (Tonprobe 2026-11-18)
        burst(x, y + s * 0.3, 8, ['#5a4632', '#3d3024', '#7a6448'], { up: 0.16 });
        if (e.burn) burst(x, y, 12, ['#ff9a2a', '#ffcf5a', '#c8461a', '#3a2a1a'], { up: 0.24, spread: 0.18 });   // Feuer: Funken und Ruß statt Blut
        else if (blood && e.wire) {   // Stacheldraht: wenig, dunkles Rotbraun, keine Tropfspuren; wird zu einem kleinen Fleck, der nach einigen Runden vergeht
          burst(x, y + s * 0.15, 7, ['#4a1810', '#3a120c', '#5c2216'], { up: 0.1, spread: 0.12 });
          decals.push({ wire: true, x: d.x + (Math.random() - 0.5) * s * 0.4, y: d.y + s * 0.12 * kAt(d.x, d.y), r: s * 0.09, born: now, turn: G.turn });
        } else if (blood && TYPES[u.type].cls !== 'walker') { const nb = Math.min(5, 1 + Math.round(e.dmg * 2));
          boom(x, y + s * 0.5, s * 0.28, 'blood');
          const fl0 = blutFleck(d.x + (Math.random() - 0.5) * s * 0.6, d.y + (Math.random() - 0.2) * s * 0.4 * kAt(d.x, d.y), 0.22 + Math.min(0.25, e.dmg * 0.08));
          if (!fl0) for (let q = 0; q < nb; q++) decals.push({ v: 1 + Math.floor(Math.random() * 4), x: d.x + (Math.random() - 0.5) * s * 1.1, y: d.y + (Math.random() - 0.3) * s * 0.7 * kAt(d.x, d.y), r: s * (0.06 + Math.random() * 0.13), col: Math.random() < 0.5 ? 'rgba(84,12,9,0.62)' : 'rgba(58,8,6,0.6)' });
          while (decals.length > 700) decals.shift(); }
        { const st = schadenStufe(e.dmg), fu = unitById(e.u), fl = floater(...headPos(e.u), '−' + fmt(e.dmg), st.col, st.big, true); if (fl && fu && !window.SCHADEN_ALT) { fl.seite = fac(fu.side); fl.krit = !!e.krit; } }   // Punkt 17: Optik je getroffener Seite (SCHADEN_ALT = alte Farben nach Schadenshöhe)
        if (human(G.side) || human(u.side)) toast(`${nm(u)}: −${fmt(e.dmg)} Stärke · ${e.dmg >= 2 ? 'schwerer Treffer' : e.dmg >= 1 ? 'guter Treffer' : e.dmg >= 0.4 ? 'leichter Treffer' : 'kaum Wirkung'} · noch ${fmt(e.str)}`);
      } else { kz(e.u, 'blitze', 'steig'); if (TYPES[u.type].cls === 'cav') playSound('pferd_unruhe', 0.45); }   // Moral wankt: unruhige Pferde
      await wait(e.nkKurz ? 240 : e.panic ? 180 : 300 + (e.dmg >= 1 ? 120 : 0)); break;   // kurzer Halt bei Treffern (Nahkampf-Szene F63: kürzer)
    }
    case 'gas': { husten();   // Husten: 1–2 Figuren, je nachdem wie viele Einheiten getroffen werden
      const d = DU.get(e.u); if (e.late) d.vs.poison = e.poison; else { d.vs.gassed = true; d.vs.poison = e.poison || 0; } d.str = e.str; d.mor = e.morv;
      kz(e.u, e.late ? 'gift' : 'gas', 'puls'); if (e.late) { const [x, y] = bodyPos(e.u); burst(x, y, 8, ['#8fae4a', '#6d8a34', '#b6c86a'], { up: 0.2 }); } await wait(220); break; }
    case 'wirehurt': { const [x, y] = center(e.c, e.r); playSound('draht_infanterie', 0.55, null, { von: unitById(e.u) });   /* Enrico 2026-11-22: Infanterie im Stacheldraht (vorher drahtlatch + drahtwackeln, im Pult wählbar) */   // Draht klirrt (Holzknacken seit Tonprobe 2026-11-18 im Wald)
      floater(x, y - s * 1.0, 'Stacheldraht', '#d9b48a'); await wait(120); break; }
    case 'entsetzen': { const dd = DU.get(e.u); if (dd && e.morv != null) dd.mor = e.morv; kz(e.u, e.ok ? 'funkeln' : 'angst', 'steig'); if (!e.ok && dd) { floater(...headPos(e.u), 'Entsetzt!', '#F0EDE1'); playSound('ev_entsetzen', 0.4); } await wait(e.ok ? 60 : 220); break; }   // Punkt 18: Entsetzenstest beim Angriff eines Fahrzeugs/Schreiters
    case 'fear': { DU.get(e.u).mor = e.morv; kz(e.u, 'blitze', 'steig'); await wait(200); break; }
    case 'roar': { const ru = unitById(e.u), dr = DU.get(e.u); pose(e.u, 'gebruell', 1800); const ksz = dr ? await kampfSzene(dr.x, dr.y - L.s * 0.6) : null; if (ru) loewenGebruell(ru, e.d); if (ksz) shake(6); await wait(700); await kampfSzeneEnde(ksz); break; }   // F48
    case 'abilTitel': {   // Enrico 2026-11-22: Titel zuerst, dann Anlauf/Sprung und Schlag (Durchbruch, Sturmrollen, Sprungangriff)
      const a = DU.get(e.u), au = unitById(e.u); if (!a || !au) break; if (camOn() && !inView(a.x, a.y, 0.15)) await camTo(a.x, a.y - L.s * 0.4, 360);
      const NAME = { durchbruch: 'Durchbruch', rollen: 'Sturmrollen', sprung: 'Sprungangriff' }, art = e.k === 'durchbruch' ? 'faust' : au.side === 'A' ? 'faust' : 'kalt';
      await heldTitelErst(null, NAME[e.k] || '', TYPES[au.type].held ? art : art + ' klein mitte', TYPES[au.type].name); break; }
    case 'rollen': {   // F54 (2026-11-21): Sturmrollen – Anlauf, ein Aufprall mit Kampfszene (Stillstand, Rütteln, Staub, Blut), Panzer bleibt stehen; das Zurückrutschen folgt als 'rollstoss'
      const a = DU.get(e.u), d = DU.get(e.d); if (!a || !d) break; const ksz = await kampfSzene((a.x + d.x) / 2, (a.y + d.y) / 2 - L.s * 0.4);
      { const dir0 = d.x >= a.x ? 1 : -1; playSound('dampfpfeife', 0.6, null, { noGap: true, von: unitById(e.u) }); playSound('held_dampf', 0.18, null, { noGap: true, von: unitById(e.u) });   // Punkt 14/42 (2026-11-24): Ankündigung – Dampfpfeife (Lok-Akkord, Platz dampfpfeife), leises Zischen darunter, weißer Dampfstoß über dem Fahrzeug
        if (BW) for (let q = 0; q < 2; q++) fx('rauch', null, a.x - dir0 * L.s * 0.2, a.y - L.s * 1.05, { delay: q * 5, move: [a.x - dir0 * L.s * 0.35, a.y - L.s * 1.6], life: 50, mul: 0.3 + q * 0.08, grow: 1.1, rise: 0.4, alpha: 0.7, fadeIn: 2, fadeOut: 0.7, filter: 'brightness(2.2) saturate(0.2)', fuss: [a.x, a.y] });
        await wait(700); }
      playSound('tank', 0.5); if (e.path) { a.face = d.x >= a.x ? 0 : 3; await animPath(e.u, e.path, 260); }
      a.face = d.x >= a.x ? 0 : 3; const x0 = a.x, y0 = a.y, dx = d.x - a.x, dy = d.y - a.y, t0 = performance.now(), dauer = 220 / speed;
      for (let k = 0; k < 1;) { await raf(); k = Math.min(1, (performance.now() - t0) / dauer); a.lunge = { dx: dx * 0.32 * k * k, dy: dy * 0.32 * k * k }; }   // Anlauf: beschleunigt in den Gegner
      playSound('aufprall_rollen', 0.7); playSound('ueberrollen', 0.45); shake(13); stopBis = performance.now() + 70; pose(e.d, 'getroffen', 800); d.lunge = { dx: dx * 0.32, dy: dy * 0.32 };   // Punkt 14: kräftiger – Stillstand im Treffer, stärkeres Rütteln, Ziel kippt weiter weg   // Paket G: Fahrzeug-Aufprall ohne Klingen-„Sching“ (neu_wucht hat Axt-/Schwerttöne)
      fx('truemmer', 3, d.x, d.y + L.s * 0.3, { life: 40, mul: 0.8, grow: 0.4, alpha: 0.85, fadeOut: 0.6 }); boom(d.x, d.y + L.s * 0.2, L.s * 0.5, 'dust');
      if (BW) { heldRing((a.x + d.x) / 2 + dx * 0.15, (a.y + d.y) / 2 + dy * 0.15, 'faust', true);   // Punkt 14: gemalte Druckwelle, Brocken (Erde bzw. Schnee) und Staubwolken ringsum
        for (let q = 0; q < 3; q++) fx(WFX() ? 'winter_schnee' : 'truemmer', WFX() ? 3 : q === 1 ? 0 : 2, d.x + (q - 1) * L.s * 0.45, d.y + L.s * 0.28, { delay: q * 3, life: 38, mul: 0.5, grow: 0.5, alpha: 0.85, fadeOut: 0.6, flip: q === 0 });
        for (let q = 0; q < (BW >= 2 ? 5 : 3); q++) boom(d.x + Math.cos(q * 1.3) * L.s * 0.6, d.y + Math.sin(q * 1.3) * L.s * 0.3, L.s * 0.32, 'dust', q * 3); }
      trefferSpritzer(x0, y0, d, 3, istMaschine(unitById(e.d))); if (e.wand) floater(...headPos(e.d), 'Eingeklemmt!', '#ffb04a', true);
      if (!(ksz && ksz.skip)) await wait(260); a.lunge = null; d.lunge = null;
      if (BW && !(ksz && ksz.skip)) { const dir0 = d.x >= a.x ? 1 : -1; playSound('tank', 0.22, null, { noGap: true, rate: 0.8, von: unitById(e.u) });   // Punkt 14: Nachhall – Staub legt sich, Auspuffrauch, Kettenrasseln
        fx('rauch', null, a.x - dir0 * L.s * 0.55, a.y - L.s * 0.8, { move: [a.x - dir0 * L.s * 0.9, a.y - L.s * 1.4], life: 70, mul: 0.35, grow: 1.2, rise: 0.4, alpha: 0.6, fadeIn: 3, fadeOut: 0.75, filter: 'brightness(0.6)', fuss: [a.x, a.y] });
        boom(d.x, d.y + L.s * 0.15, L.s * 0.55, 'dust', 6); await wait(420); }
      await wait(80); await kampfSzeneEnde(ksz); break; }
    case 'pzgranate': {   // F80: Wurf (Ausholen → Loslassen), Granate fliegt, Explosion am Panzer mit Metallkrach
      const d = DU.get(e.d); if (!d) break; const [x2, y2] = [d.x, d.y - L.s * 0.4]; const ksz = await kampfSzene((DU.get(e.u).x + d.x) / 2, (DU.get(e.u).y + d.y) / 2 - L.s * 0.4);
      await poseWurf(e.u, x2, y2); await wait(280); if (!fxImpact(x2, y2 + L.s * 0.3, L.s * 0.7)) boom(x2, y2, L.s * 0.7, 'he'); playSound('boom', 0.6); playSound('einschlag_panzer', 0.55); shake(6);
      fx('funken', null, x2, y2, { anchor: 'mitte', life: 18, fadeOut: 0.6, mul: 0.9 }); lastFire = { kind: 'cannon', t: performance.now(), a: e.u }; await wait(220); await kampfSzeneEnde(ksz); break; }
    case 'rollstoss': { const d = DU.get(e.u); const fl = FLUG.get(e.u); FLUG.delete(e.u); if (u && TYPES[u.type].mg) playSound('mg_abbauen', 0.5, null, { noGap: true });   /* MG wird zurückgeschoben (Enrico 15:26) */ if (d && fl && performance.now() - fl < 4000) { await flugZurueck(e.u, e.path); break; } if (d) { playSound('steps', 0.35); await animPath(e.u, e.path, 160, true); } break; }   // F54: Ziel rutscht ein Feld zurück; F86: nach dem Durchbruch fliegt es
    case 'durchbruch': {   // Held Rote Faust: Anlauf, Faustschlag mit Ausholen, Aufflammen (Glut), Dampf; der Rückstoß folgt als 'rollstoss'
      const a = DU.get(e.u), d = DU.get(e.d); if (!a || !d) break; const ksz = await kampfSzene((a.x + d.x) / 2, (a.y + d.y) / 2 - L.s * 0.5);
      // Titel kam schon vor dem Anlauf ('abilTitel', Enrico 2026-11-22)
      a.face = d.x >= a.x ? 0 : 3; pose(e.u, 'hieb', 900); playSound('held_aufladen', 0.6); faustDampf(e.u, 1); playSound('held_dampf', 0.25); heldFunken(5, a.x + (d.x >= a.x ? 1 : -1) * L.s * 0.25, a.y - L.s * 0.6, { mul: 0.45, flip: d.x < a.x });   // Dampfstoß aus der Faust beim Ausholen
      if (e.path) { const sch = staubSchleppe(e.u); await animPath(e.u, e.path, 200); sch(); }
      a.face = d.x >= a.x ? 0 : 3; const dx = d.x - a.x, dy = d.y - a.y, t0 = performance.now(), dauer = 320 / speed; let ls = 0;
      for (let k = 0; k < 1;) { await raf(); k = Math.min(1, (performance.now() - t0) / dauer); a.lunge = { dx: dx * 0.3 * k * k, dy: dy * 0.3 * k * k };
        if (performance.now() - ls > 60 / speed) { ls = performance.now(); boom(a.x + a.lunge.dx, a.y + a.lunge.dy + L.s * 0.12, L.s * 0.26, 'dust'); } }   // Staubschleppe beim Sturm
      heldFunken(4, d.x, d.y - L.s * 0.35, { mul: 0.8, life: 26 }); heldFunken(6, d.x, d.y - L.s * 0.2, { mul: 0.6, delay: 4, life: 30 });
      playSound('held_fausteinschlag', 0.8); setTimeout(() => { playSound('held_dampfstoss', 0.5); playSound('held_dampf', 0.35); faustDampf(e.u, 0.8); }, 260 / speed); shake(14); heldBlitz(e.u, 'glut'); pose(e.d, 'getroffen', 800); d.lunge = { dx: dx * 0.25, dy: dy * 0.25 };   // Ablauf Enrico: Aufladen → Hydraulik-Boom → Dampfstoß
      stopBis = performance.now() + 70; heldRing(d.x, d.y, 'faust', true);   // Druckwelle am Boden
      for (let q = 0; q < (BW >= 2 ? 7 : 5); q++) { const w = q / (BW >= 2 ? 7 : 5) * Math.PI * 2 + Math.random() * 0.4; boom(d.x + Math.cos(w) * L.s * 0.75, d.y + Math.sin(w) * L.s * 0.75 * kAt(d.x, d.y), L.s * 0.32, 'dust', 3 + q); }
      fx('erdfontaene', null, d.x, d.y + L.s * 0.3, { life: 52, mul: 0.55, grow: 0.25, flip: dx < 0, fadeOut: 0.45, filter: 'brightness(0.75) sepia(0.3)' });
      fx('truemmer', 3, d.x, d.y + L.s * 0.3, { life: 44, mul: 0.95, grow: 0.45, alpha: 0.9, fadeOut: 0.6 }); fx('truemmer', 5, d.x + (dx < 0 ? -1 : 1) * L.s * 0.4, d.y + L.s * 0.25, { delay: 4, life: 40, mul: 0.6, grow: 0.4, alpha: 0.85, fadeOut: 0.6 });
      trefferSpritzer(a.x, a.y, d, 3, istMaschine(unitById(e.d))); FLUG.set(e.d, performance.now());   // das Ziel fliegt im folgenden 'rollstoss' sichtbar zurück
      if (!(ksz && ksz.skip)) await wait(300); a.lunge = null; d.lunge = null; await wait(80); await kampfSzeneEnde(ksz); break; }
    case 'hinrichtung': {   // Held Kürassier: Ausholen über die Schulter, Hieb nach unten, kaltes Aufblitzen, Rütteln; die Vernichtung folgt als eigenes Ereignis
      const a = DU.get(e.u), d = DU.get(e.d); if (!a || !d) break; const ksz = await kampfSzene((a.x + d.x) / 2, (a.y + d.y) / 2 - L.s * 0.5);
      await heldTitelErst(ksz, 'Hinrichtung', 'kalt', heldName(e.u));   // F86: großer Auftritt; F87: erst Schrift, dann Schlag
      a.face = d.x >= a.x ? 0 : 3; pose(e.u, 'hieb', 1100); kz(e.d, 'angst', 'steig'); playSound('held_saege_start2', 0.6); playSound('held_ritter_schrei', 0.5); await wait(440); playSound('held_saege_schnitt2', 0.7); playSound(kschwertTon(e.d), 0.55);
      const mx = d.x + (a.x - d.x) * 0.35, my = d.y - L.s * 0.55, masch = istMaschine(unitById(e.d));   // Treffpunkt der Säge
      heldBlitz(e.u, 'kalt'); heldRing(d.x, d.y, 'kalt', false); pose(e.d, 'getroffen', 900); shake(11); if (BW) fx('faehigkeiten', 5, mx, my + L.s * 0.25, { anchor: 'mitte', life: 36, mul: 0.62, grow: 0.3, fadeOut: 0.6, flip: d.x < a.x, fuss: [d.x, d.y] }); heldFunken(2, mx, my, { mul: 0.75, life: 24 }); heldFunken(1, mx, my, { mul: 0.6, flip: d.x < a.x }); if (BW && fxN('kettenklinge') && !window.E6_ALT) fx('kettenklinge', 1, mx, my, { anchor: 'mitte', fuss: [d.x, d.y], life: 26, mul: 0.7, grow: 0.12, fadeIn: 2, fadeOut: 0.55, flip: d.x < a.x, filter: blood ? null : 'saturate(0)' });   /* U3 E6 (Punkt 62): kalter Schnittbogen der Kettenklinge, Tropfen ohne Blut grau; Rückweg window.E6_ALT */   // Paket D: Funken und Kettensplitter (fx_faehigkeiten 6)
      for (let q = 0; q < (BW >= 2 ? 4 : 3); q++) fx('funken', null, mx + (Math.random() - 0.5) * L.s * 0.25, my + (Math.random() - 0.5) * L.s * 0.2, { anchor: 'mitte', delay: q * 3, life: 18 + q * 3, mul: 0.65 + q * 0.12, fadeOut: 0.6, flip: Math.random() < 0.5 });   // Funken von der Kettensäge
      stopBis = performance.now() + (BW ? 230 : 140); if (!(ksz && ksz.skip)) await wait(220);   // kurzer Stillstand im Treffer
      trefferSpritzer(a.x, a.y, d, 3, masch); if (!masch) { schwerBlut(a.x, a.y, d, 3); schwerBlut(a.x, a.y, d, 3); bodenBlut(d.x + (Math.random() - 0.5) * L.s * 0.3, d.y + L.s * 0.12 * kAt(d.x, d.y), 0.7); }   // schwerer Blutstoß, dann Lache
      if (!(ksz && ksz.skip)) await wait(420); await kampfSzeneEnde(ksz); break; }
    case 'heldfall': { const hu = unitById(e.u); playSound('held_fall_horn', 0.6, null, { an: hu }); banner(`${hu ? TYPES[hu.type].name : 'Der Held'} ist gefallen`, 'Die ganze Seite verliert Moral'); await wait(900); break; }
    case 'furcht': { const d = DU.get(e.u); if (d) { d.mor = e.mor; kz(e.u, 'angst', 'steig'); playSound('ev_furcht', 0.35); } if (e.by) auraPuls(e.by, 'kalt'); await wait(120); break; }
    case 'sprung': {   // Sprungangriff (2026-11-20): Brüllen, Sprung im Bogen, Staub bei der Landung; der Nahkampf folgt als eigenes Ereignis
      const d0 = DU.get(e.u); if (!d0) break; playSound('loewe', 0.55); kz(e.u, 'wut', 'steig'); pose(e.u, 'sprung', 900); gebruellFx(e.u, [], 0, true);   // Runde 2: Sprung mit Krallen
      const [c1, r1] = e.path[1], [x0, y0] = [d0.x, d0.y], [x1, y1] = center(c1, r1), dauer = 420 / speed, t0 = performance.now();
      d0.face = x1 >= x0 ? 0 : 3; d0.moving = true;
      if (camOn() && !inView(x1, y1)) await camTo(x1, y1, 260);
      try { for (let k = 0; k < 1;) { await raf(); k = Math.min(1, (performance.now() - t0) / dauer); d0.x = x0 + (x1 - x0) * k; d0.y = y0 + (y1 - y0) * k - Math.sin(Math.PI * k) * L.s * 0.9; } } finally { d0.moving = false; d0.x = x1; d0.y = y1; }
      if (WFX()) fx('winter_schnee', 4, x1, y1 + L.s * 0.3, { life: 44, mul: 0.55, grow: 0.45, alpha: 0.9, fadeOut: 0.6 }); else fx('truemmer', 2, x1, y1 + L.s * 0.3, { life: 36, mul: 0.6, grow: 0.4, alpha: 0.8, fadeOut: 0.6 }); playSound('loewen_landung', 0.6); playSound('steps', 0.2); shake(3); if (BW && fxIm('faehigkeiten', 2)) fx('faehigkeiten', 2, x1, y1 + L.s * 0.02, { anchor: 'mitte', boden: true, life: 44, mul: 0.62, grow: 0.45, alpha: 0.9, fadeOut: 0.6 });   /* Landung (Enrico 2026-11-22 15:00), alter Landeton leise darunter */ ctrlSync(); await wait(120); break; }
    case 'dauerfeuer': { const d0 = DU.get(e.u); if (d0) floater(...headPos(e.u), 'Dauerfeuer!', '#ffb04a', true); kz(e.u, 'feuer', 'steig'); await wait(150); break; }
    case 'faust': {   // Faustsalve: Kamerafahrt zum Knecht, dann beide Fäuste zugleich (je ein Ziel), Treffer folgen als 'hit'
      const a = DU.get(e.u); if (!a) break; const zs = (e.d || []).map(id => [id, ...bodyPos(id)]); pose(e.u, 'faust', 1600);   // Schreiter-Posen: beide Kanonen feuern
      if (camOn() || OPT.cam) { camFern(); await camTo(a.x, a.y - L.s * 0.4, 520, true); await wait(260); }
      floater(a.x, a.y - L.s * 1.3, 'Faustsalve!', '#ffb04a', true); await wait(180);
      const mx = zs.reduce((n, z) => n + z[1], 0) / Math.max(1, zs.length); a.face = mx >= a.x ? 0 : 3;
      zs.forEach(([id, x2, y2], i) => { const p = fxFaust(e.u, i) || [a.x, a.y - L.s * 0.5]; fxZielFuss = (DU.get(id) ? [DU.get(id).x, DU.get(id).y] : null);
        setTimeout(() => playSound('panzerkanone', 0.6, 'D', { noGap: true, rate: 0.96 + i * 0.06 }), i * 60 / speed);
        if (fxN('faustsalve') && !window.E5_ALT) { const dr = fxDirS(p, x2, y2, 0.5); fx('faustsalve', i % 2, p[0], p[1], { fuss: p.fuss, anchor: 'links', delay: i * 3, life: 12, mul: 0.95, grow: 0.15, fadeOut: 0.6, flip: dr.flip, ang: dr.ang }); } else fxFlash(3, p, x2, y2, { life: 9, mul: 1.05, delay: i * 3 });   // U3 E5 (Punkt 62): Doppelblitz je Faust; Rückweg window.E5_ALT
        tracers.push({ x1: p[0], y1: p[1], x2, y2, life: 15, max: 15, n: 1, stream: false, col: '#ff9a3a', img: 'shard', sz: 0.36 }); });
      if (camOn() || OPT.cam) { const cx = (a.x + mx) / 2, cy = (a.y + zs.reduce((n, z) => n + z[2], 0) / Math.max(1, zs.length)) / 2; camTo(cx, cy, 420, true); }
      await wait(15 * 16.667 * 0.9);
      for (const [, x2, y2] of zs) boom(x2, y2 + L.s * 0.4, L.s * 0.6, 'he'); playSound('boom', 0.5);
      await wait(260); break; }
    case 'supp': DU.get(e.u).vs.supp = 1; if (!queue.some(n => n.t === 'hit' && n.u === e.u) && lastFire && letzterAngreifer && lastFire.a === letzterAngreifer.id && performance.now() - lastFire.t < 2500) playSound('vorbei', 0.4, null, { von: lfVon() });   /* K6 (2026-11-22): nur nach einem Schuss, nicht nach Durchbruch/Sturmrollen */   /* Prüfliste 3.4: kein Doppelton „vorbei“ + Einschlag */ kz(e.u, 'blitze', 'puls'); await wait(170); break;
    case 'rout': DU.get(e.u).vs.rout = true; if (u && TYPES[u.type].cls === 'cav') playSound('pferd_unruhe', 0.5); kz(e.u, 'schweiss', 'puls'); toast(`${nm(u)} flieht.`); await wait(360); break;
    case 'destroyed': {
      const d = DU.get(e.u); floater(...headPos(e.u), 'aufgerieben', '#ff6a50', true); toast(`${nm(u)} ist aufgerieben.`); if (!['walker', 'art'].includes(TYPES[u.type].cls)) playSound('aufgerieben', 0.5, null, { u });   // Ton-Pult „Aufgerieben“ (Enrico 21:00)
      if (TYPES[u.type].cls === 'walker' || TYPES[u.type].cls === 'art') { if (!fxImpact(d.x, d.y, s * 1.1, { alt: true, noMark: true })) boom(d.x, d.y, s * 1.1, 'he'); gmark('bodenspuren', TYPES[u.type].cls === 'walker' ? 2 : 0, d.x, d.y + s * 0.2, { turns: 4, mul: 0.8 }); playSound('boom2', 0.75); if (TYPES[u.type].cls === 'walker') playSound('feuer', 0.35); shake(8); }
      else if (blood) { boom(d.x, d.y, s * 0.6, 'blood'); bodenBlut(d.x, d.y + s * 0.1, BW === 1 ? 0.45 : 0.6);   /* Lache, verblasst nach 2 Runden */ if (blutFleck(d.x, d.y + s * 0.1, 0.55)) { for (let q = 0; q < 2; q++) blutFleck(d.x + (Math.random() - 0.5) * s * 1.1, d.y + (Math.random() - 0.3) * s * 0.6 * kAt(d.x, d.y), 0.25); } else { decals.push({ v: 3, x: d.x, y: d.y, r: s * 0.36, col: 'rgba(84,10,8,0.6)' }); for (let q = 0; q < 6; q++) decals.push({ v: 1 + Math.floor(Math.random() * 4), x: d.x + (Math.random() - 0.5) * s * 1.3, y: d.y + (Math.random() - 0.5) * s * 0.9 * kAt(d.x, d.y), r: s * (0.08 + Math.random() * 0.14), col: 'rgba(110,16,12,0.6)' }); } }   // F27: ohne runde Partikel
      if (alleFallen(u, d)) { d.alpha = 0; await wait(280); break; }   // U5b: die letzten Figuren fallen und bleiben liegen
      for (let k = 0; k < 10; k++) { d.alpha = 1 - k / 10; await wait(28); } d.alpha = 0; break;
    }
    case 'escaped': DU.get(e.u).alpha = 0; toast(`${nm(u)} hat das Schlachtfeld verlassen.`); break;
    case 'officer': playSound('ev_anfuehrer_faellt', 0.5); toast(`${e.name} ist gefallen.`); floater(...headPos(e.u), e.name + ' fällt', '#ff6a50', true); await wait(300); break;
    case 'sent': { playSound('dog', 0.55); const d = DU.get(e.u), m = DU.get(e.by); if (m) m.face = d.x >= m.x ? 0 : 3; await wait(300); break; }
    case 'order': {
      const d0 = DU.get(e.u), rl = e.kind === 'rally', ff = e.kind === 'fire'; pose(e.u, 'befehl', 1500);   // Hauptmann zeigt mit dem Säbel; Ruf kommt aus stimmeBeiEreignis (V3)
      if (ff) for (const id of e.ids || []) { const dd = DU.get(id); if (dd) dd.vs.fireFree = true; }   // Aschenwacht-Führung: Kampfschrei (Wunsch des Nutzers: nur der Anführer)
      toast(`${e.name}: ${rl ? 'Sammeln!' : ff ? 'Feuer frei!' : 'Sturmbefehl!'}`); if (!ff) kz(e.u, rl ? 'pfeil' : 'wut', 'steig');
      for (let q = 0; q < 2; q++) rings.push({ x: d0.x, y: d0.y, r: 2.6 + q * 1.4, col: rl ? '#b8ff7c' : '#ffb04a', life: 34 + q * 10, max: 34 + q * 10 });
      if (rl) for (const id of e.ids || []) { const dd = DU.get(id); if (dd) dd.vs.supp = 0; }
      await wait(260);
      e.ids.forEach((id, i) => { const dd = DU.get(id); if (!dd) return; if (rl) dd.mor = e.mors[i]; if (id !== e.u && !ff) kz(id, rl ? 'pfeil' : 'wut', 'steig'); });
      await wait(260); break;
    }
    case 'rally': playSound('ev_sammeln', 0.45); DU.get(e.u).vs.supp = 0; DU.get(e.u).vs.rout = false; kz(e.u, 'pfeil', 'steig'); toast(`${e.by} sammelt ${TYPES[u.type].name}.`); DU.get(e.u).face = u.face; await wait(300); break;
    case 'rammen': {   // F79: Anlauf in die Mauer, Rütteln, Staub und Mauerbrocken
      const a = DU.get(e.u); if (!a) break; const [bx, by] = center(e.c, e.r); a.face = bx >= a.x ? 0 : 3; const ksz = await kampfSzene((a.x + bx) / 2, (a.y + by) / 2 - L.s * 0.4); playSound('tank', 0.5);
      a.lunge = { dx: (bx - a.x) * 0.3, dy: (by - a.y) * 0.3 }; await wait(220); playSound('impact', 0.7); playSound('aufprall_rammen', 0.6); shake(9);
      for (let q = 0; q < 3; q++) fx('truemmer', q === 1 ? 0 : 1, bx + (q - 1) * s * 0.3, by + s * 0.2, { delay: q * 3, life: 50, mul: 0.7, grow: 0.4, alpha: 0.85, fadeOut: 0.6 }); boom(bx, by, s * 0.6, 'dust');
      await wait(260); a.lunge = null; await wait(80); await kampfSzeneEnde(ksz); break; }
    case 'cut': { if (e.u != null) { pose(e.u, 'schneiden', 1300); await wait(350); } playSound('draht_schneiden', 0.7); const [x, y] = center(e.c, e.r); boom(x, y, s * 0.4, 'dust'); floater(x, y - s, 'Draht geschnitten', '#e6e9ec'); renderTerrain(); await wait(280); break; }   // F12: Staub statt bunter Funken-Kugeln
    case 'crush': { const [x, y] = center(e.c, e.r); playSound('draht_ueberrollen', 0.6); /* Fahrzeug walzt Draht nieder */ gmark('bodenspuren', 3, x, y + s * 0.1, { mul: 0.75 }); boom(x, y, s * 0.5, 'dust'); floater(x, y - s * 1.2, 'Draht niedergewalzt', '#e6e9ec'); renderTerrain(); await wait(160); break; }
    case 'terrain': { renderTerrain();
      { const [x, y] = center(e.c, e.r), w = e.what || '';
        if (w === 'gesprengt') fx('truemmer', [0, 1, 4][Math.floor(Math.random() * 3)], x, y + s * 0.4, { life: 80, grow: 0.25, rise: 0.15, fadeOut: 0.5 });   // Bunker/Barrikade: Ziegel, Holz, Sandsäcke
        if (w === 'Stollen gesprengt') { fx('truemmer', 4, x, y + s * 0.4, { life: 90, mul: 1.2, grow: 0.3, rise: 0.3, fadeOut: 0.5 }); fx('truemmer', 0, x + s * 0.3, y + s * 0.3, { delay: 6, life: 80, mul: 0.8, grow: 0.25 }); }
        if (/^Draht (verbrannt|zerschossen|zerrissen|niedergewalzt)/.test(w)) gmark('bodenspuren', 3, x, y + s * 0.1, { mul: 0.75 }); } if (e.what === 'Draht gezogen') playSound('bauen', 0.3); if (e.what === 'Stollen gesprengt') playSound('stollen_blast', 0.8); if (e.what === 'gesprengt' || e.what === 'Stollen gesprengt') playSound('einsturz', 0.7); if (e.what) { const [x, y] = center(e.c, e.r); floater(x, y - s * 0.6, e.what, '#e6e9ec'); } break; }
    case 'stuck': if (TYPES[u.type].stecken) {   // M4 (2026-11-22): Kürassier – schwere Rüstung sackt ein, Metall und Stampfen statt Autounfall; Schlamm spritzt nur im Schlamm
      const d0 = DU.get(e.u); d0.vs.stuck = 1; playSound('held_ruestung', 0.55); playSound('held_schritt_ritter2', 0.7); shake(2); const ht = G.map[u.c] && G.map[u.c][u.r] && G.map[u.c][u.r].t;
      if (ht === 'mud' || ht === 'sumpf') muzzles.push({ img: 'mudsplash', x: d0.x, y: d0.y + s * 0.4, center: true, up: 0.85, sz: 1.3, life: 50, max: 50 }); else boom(d0.x, d0.y + s * 0.15, s * 0.35, 'dust');
      kz(e.u, 'schweiss', 'puls'); await wait(250); break; }
    { DU.get(e.u).vs.stuck = 1; playSound('crash', 0.65, null, { an: unitById(e.u) }); const d0 = DU.get(e.u); muzzles.push({ img: 'mudsplash', x: d0.x, y: d0.y + s * 0.4, center: true, up: 0.85, sz: 1.8, life: 56, max: 56 }); } playSound('steps', 0.7, null, { an: unitById(e.u) }); kz(e.u, 'panne', 'puls'); await wait(250); break;
    case 'breakdown': { const d0 = DU.get(e.u); d0.vs.broken = 1;   // Paket 8: im Schlamm festgefahren – Ketten sinken ein, Dreck und Schlamm spritzen, kein Rauch
      for (let q = 0; q < 3; q++) { const fl = Math.random() < 0.5; fx('erdfontaene', null, d0.x + (q - 1) * s * 0.5, d0.y + s * 0.32, { delay: q * 6, life: 40, mul: 0.2, grow: 0.15, flip: fl, fadeOut: 0.45, filter: 'brightness(0.62) sepia(0.35)' }); }
      gmark('bodenspuren', 4, d0.x, d0.y + s * 0.1, { mul: 0.85 }); if (PJI.mudsplash) muzzles.push({ img: 'mudsplash', x: d0.x, y: d0.y + s * 0.42, center: true, up: 0.85, sz: 1.1, life: 50, max: 50 }); }
      if (TYPES[u.type].fig) { const d0 = DU.get(e.u); muzzles.push({ img: 'bolt', x: d0.x - s * 0.5, y: d0.y - s * 0.7, ang: -0.25, sz: 0.55, off: 0.1, life: 34, max: 34 }); }
      playSound('crash', 0.7, null, { an: unitById(e.u) }); playSound('steps', 0.6, null, { an: unitById(e.u) }); kz(e.u, 'panne', 'puls'); toast(`${nm(u)} hat sich festgefahren und fällt ${E.u5aus && !E.u5aus() ? '1–2' : P.PANNE_RUNDEN} Runden aus.`); await wait(350); break;
    case 'repaired': playSound('ev_wieder_flott', 0.45); DU.get(e.u).vs.broken = 0; kz(e.u, 'funkeln', 'steig'); await wait(200); break;
    case 'smoke': { const rohr = u && (u.type === 'rauch' || u.type === 'moerser'); if (rohr) playSound('werfer', 0.55); playSound(rohr ? 'gas' : 'rauch', 0.5);   // Rauchgeschoss: gas_1, geworfen: rauch_1 (Tonprobe 2026-11-18)
      if (u && fxIm('geschosse', 4)) { const du = DU.get(u.id); for (const [c, r] of e.cells) { const [x, y] = center(c, r); shells.push({ fxi: 4, fxs: 0.8, x1: du.x, y1: du.y - s * 0.6, x2: x, y2: y, t: 0, dur: 18, arc: 1.4, spin: true, sz: 0.3 }); } await wait(18 * 16.667); }
      for (const [c, r] of e.cells) { const [x, y] = center(c, r); boom(x, y, s * 0.7, 'dust', Math.random() * 8); } visSync('smoke'); floater(...headPos(e.u), 'Nebelwand', '#e6e6e0'); await wait(450); break; }
    case 'tunnel': { if (e.u != null) pose(e.u, 'hacke', 1500); playSound('tick', 0.45); playSound('bauen', 0.3); const [x, y] = center(e.c, e.r); floater(x, y - s * 0.6, 'Stollen: 2 Runden', '#ffb86a', true); await wait(300); break; }
    case 'tunnelBlow': { const [x, y] = center(e.c, e.r); playSound('stollen_boom', 0.8); playSound('stollen_knall', 0.6); boom(x, y, s * 1.6, 'he'); burst(x, y, 30, ['#5a4632', '#3d3024', '#8a7a52'], { up: 0.45, spread: 0.4 }); banner('Stollen gesprengt', ''); await wait(700); break; }
    case 'pzschuss': {   // Punkt 16: wie ein Kanonenschuss der Feldkanone, dazu Funken am Ziel und Meldung; Treffer folgen als 'hit'
      await playEvent({ t: 'shell', a: e.u, c: e.c, r: e.r, mode: 'he', face: e.face }); const dd = DU.get(e.d); if (dd) { fx('funken', null, dd.x, dd.y - L.s * 0.4, { anchor: 'mitte', life: 20, mul: 0.9, fadeOut: 0.6 }); floater(...headPos(e.d), 'Panzergranate!', '#ffb04a', true); playSound('einschlag_panzer', 0.6, null, { von: unitById(e.u) }); } await wait(160); break; }
    case 'kopfrunter': {   // Punkt 3 (2026-11-24): gezielter Schuss ohne Schaden – Ziel duckt sich, wird niedergehalten (Ereignis 'supp' folgt)
      await playEvent({ t: 'fire', a: e.u, d: e.d, kopf: true }); const dd = DU.get(e.d); if (dd) { pose(e.d, 'getroffen', 500); floater(...headPos(e.d), 'Kopf runter!', '#F0EDE1'); } await wait(200); break; }
    case 'handgranate': {   // F103: Grenadiere werfen vor dem Nahkampf (Ausholen → Loslassen), kleine Explosion am Ziel
      const d = DU.get(e.d); if (!d || !DU.get(e.a)) break; const x2 = d.x, y2 = d.y - L.s * 0.3; await poseWurf(e.a, x2, y2); await wait(200);
      if (!fxImpact(x2, y2 + L.s * 0.25, L.s * 0.45)) boom(x2, y2, L.s * 0.45, 'he'); playSound('grenade', 0.55, null, { von: unitById(e.a) });   /* Wurfton gehört dem Werfer (Ton-Pult) */ shake(3); await wait(160); break; }
    case 'lanceblast': { const [x, y] = center(e.c, e.r); playSound('grenade2', 0.6); boom(x, y - s * 0.2, s * 0.6, 'he'); floater(x, y - s * 0.9, 'Sprenglanze!', '#ffb04a', true); const dd = DU.get(e.a); if (dd) dd.vs.lance = false; await wait(200); break; }
    case 'blast': { const [x, y] = center(e.c, e.r); const ksz = await kampfSzene(x, y - L.s * 0.3); if (e.u != null) pose(e.u, 'ladung', 1500); playSound('tick', 0.5); await wait(450); playSound('blast', 0.8); boom(x, y, s * 1.1, 'he'); burst(x, y, 18, ['#5a4632', '#3d3024', '#8a7a52'], { up: 0.3, spread: 0.3 }); await wait(380); await kampfSzeneEnde(ksz); break; }
    case 'mineLaid': { const [x, y] = center(e.c, e.r); if (e.u != null) pose(e.u, 'mine', 1200); playSound('tick', 0.4); playSound('bauen', 0.3); floater(x, y - s * 0.5, `Mine gelegt (${e.left} übrig)`, '#e6d48a'); await wait(220); break; }
    case 'mine': { const [x, y] = center(e.c, e.r); playSound('grenade2', 0.75); boom(x, y, s * 1.0, 'he'); floater(x, y - s * 0.9, 'Mine!', '#ff9a6a', true); await wait(380); break; }
    case 'light': { visSync('lit'); playSound('ui', 0.5); await wait(260); break; }
    case 'clear': { visSync('clouds'); pose(e.u, 'spruehen', 1500); gasschutzFx(e.u); playSound('gasmaske_1', 0.5); if (e.n) kz(e.u, 'kreuz', 'steig'); await wait(260); break; }
    case 'ammo': { if (e.by != null) pose(e.by, 'nachladen', 1400); playSound('nachladen', 0.55); kz(e.u, 'munition', 'steig'); await wait(260); break; }
    case 'zweischlag': { const au = unitById(e.a); if (!au || !DU.get(e.a)) break; pose(e.a, au.type === 'oger' ? 'kolben' : 'hieb', 520); await wait(160);   /* Punkt 106: zweiter Schlag sichtbar und hörbar, danach folgt der Treffer */
      playSound(au.type === 'oger' ? 'neu3_fleisch' : 'saebel', 0.5, null, { von: au });   /* gleiche Plätze wie der erste Schlag (Pult-Zeile „Schlag“) */ await wait(200); break; }
    case 'counterstrike': { kz(e.u, 'wut', 'steig'); await wait(250); break; }
    case 'score': { const hs = OBJECTIVES.filter(o => G.ctrl[o.id] === e.side); if (hs.length) playSound('ev_punkte', 0.4, e.side);   /* SP-3 (84.3): stumm, bis im Ton-Pult („Gelände und Gebäude“) ein Ton gewählt ist – wie alle ev_-Plätze */ for (const o of hs) { const [x, y] = center(o.c, o.r); floater(x, y - s * 1.5, '+' + o.pts, sideCol(e.side), true); } await wait(350); updateUI(); break; }
    case 'unstuck': playSound('ev_wieder_flott', 0.45); DU.get(e.u).vs.stuck = 0; kz(e.u, 'funkeln', 'steig'); await wait(150); break;
    case 'recovered': { const dr = DU.get(e.u); if (dr) { dr.vs.broken = 0; dr.vs.stuck = 0; } if (e.by != null) { pose(e.by, 'bergen', 1600); const m = DU.get(e.by); if (m && dr) m.face = dr.x >= m.x ? 0 : 3; } /* K13: Versorgung zeigt beim Bergen */ playSound('reparieren', 0.6); kz(e.u, 'werkzeug', 'steig'); await wait(320); break; }
    case 'setup': { DU.get(e.u).vs.setup = true; playSound('mg_aufbauen', 0.55);   /* Standard (Enrico 2026-11-22 15:00); vorher mgsetup + mgladen, im Pult wählbar */ await wait(200); break; }
    case 'undig': { const dd = DU.get(e.u); if (dd) dd.vs.dug = false; playSound('schaufel', 0.4, null, { noGap: true }); await wait(250); break; }   // F36: aus der Stellung
    case 'einholen': case 'aufsteigen': {   // F70: Ballon sinkt bzw. steigt am Seil, Winde rattert
      const d = DU.get(e.u); if (!d) break; const auf = e.t === 'aufsteigen', h0 = d.ballonH == null ? (auf ? 0 : 1) : d.ballonH, t0 = performance.now(), dauer = 900 / Math.min(speed, 2);
      playSound('drahtwackeln', 0.45, null, { noGap: true }); setTimeout(() => playSound('mgladen', 0.35, null, { noGap: true }), 500 / speed);
      if (auf) setTimeout(() => playSound('ballon_brenner', 0.4, null, { noGap: true }), 250 / speed);   // M9 (2026-11-22): Brenner faucht beim Aufsteigen
      for (let k = 0; k < 1;) { await raf(); k = Math.min(1, (performance.now() - t0) / dauer); d.ballonH = h0 + ((auf ? 1 : 0) - h0) * (0.5 - 0.5 * Math.cos(Math.PI * k)); }
      d.vs.eingeholt = !auf; break; }
    case 'teardown': { DU.get(e.u).vs.setup = false; playSound('mg_abbauen', 0.5);   /* vorher nachladen */ await wait(200); break; }
    case 'ow': playSound('ev_feuerbereit', 0.4); kz(e.u, 'auge', 'puls'); await wait(220); break;
    case 'bigorder': {   // großer Befehl: auffällige Ansage, Pfeife (Konkordat) bzw. Horn (Aschenwacht)
      if (e.u != null) pose(e.u, 'grossbefehl', 2200);   // Runde 2: General mit erhobenem Säbel
      playSound(e.kind === 'assault' ? 'generalhorn' : 'march', 0.5, e.side);   /* Anführer-Fähigkeiten leiser (Spieltest Runde 2) */ banner(e.name + '!', e.kind === 'hold' ? `Einheiten bis ${felder(P.BIG_R)}: keine Flucht, Abwehr ×1,25 bis zum nächsten Zug` : `Einheiten bis ${felder(P.BIG_R)}: +2 Bewegungspunkte und +1 Aktion`);
      for (const id of e.ids || []) { const dd = DU.get(id); if (!dd) continue; if (e.kind === 'hold') dd.vs.hold = true; rings.push({ x: dd.x, y: dd.y, r: 1.2, col: '#E2B04A', life: 40, max: 40 }); }
      { const g0 = DU.get(e.u); if (g0 && BW && fxN('befehlsruf') && !window.E2_ALT) { fx('befehlsruf', 0, g0.x, g0.y, { anchor: 'mitte', fuss: [g0.x, g0.y], life: 60, mul: 0.55, grow: 0.9, alpha: 0.9, fadeIn: 3, fadeOut: 0.6, filter: 'sepia(0.4) saturate(0.6)' }); for (const [i, id] of (e.ids || []).slice(0, 6).entries()) { const dd = DU.get(id); if (dd && id !== e.u) fx('befehlsruf', 1, dd.x, dd.y, { anchor: 'mitte', fuss: [dd.x, dd.y], delay: 8 + i * 3, life: 44, mul: 0.4, grow: 0.6, alpha: 0.8, fadeIn: 3, fadeOut: 0.6, flip: Math.random() < 0.5, filter: 'sepia(0.4) saturate(0.6)' }); } } }   // U3 E2 (Punkt 62): Staubring am General, kleinere an den Einheiten; Rückweg window.E2_ALT
      floater(...headPos(e.u), e.name + '!', '#E2B04A', true); await wait(900); break; }
    case 'banner': { const dd = DU.get(e.u); if (dd) dd.vs.planted = e.planted; if (e.planted) pose(e.u, 'rammen', 1400); playSound('bauen', e.planted ? 0.32 : 0.22); await wait(260); break; }
    case 'ignite': visSync('fires'); playSound('flame', 0.4); break;
    case 'fireout': { const old = VIS.fires || []; visSync('fires'); for (const f of old) if (!(VIS.fires || []).some(q => q.c === f.c && q.r === f.r)) { const [x, y] = center(f.c, f.r); gmark('bodenspuren', 0, x, y + s * 0.1, { mul: 0.85 }); } break; }   // Brandfleck bleibt
    case 'burn': playSound('ev_brennt', 0.4); kz(e.u, 'feuer', 'puls'); await wait(120); break;
    case 'steadfast': kz(e.u, 'pfeil', 'steig'); await wait(160); break;
    case 'dig': { const dd = DU.get(e.u); if (dd) dd.vs.dug = true; pose(e.u, 'graben', 1600); playSound('sandsaecke', 0.4, null, { noGap: true }); playSound('atmen', 0.42, null, { u, noGap: true });   /* Sandsäcke nur beim Eingraben (Enrico 15:26) */   /* F32: nur 72199 (Graben mit schwerem Atmen) */   /* Schaufel + schweres Atmen (Stimmfilter wie der Sprecher), 2026-11-18 */ await wait(240); break; }
    case 'shields': { pose(e.u, 'halten', 1800); const dd = DU.get(e.u); if (dd) { dd.vs.shields = true; rings.push({ x: dd.x, y: dd.y, r: 1.3, col: '#9aa3ab', life: 36, max: 36 }); } playSound('armor', 0.5); await wait(260); break; }
    case 'rush': marschU = e.u; if (poseHat(unitById(e.u), 'lauf')) pose(e.u, 'lauf', 1500); kz(e.u, 'wut', 'steig'); await wait(200); break;
    case 'sperr': { const d = DU.get(e.u); d.vs.sperr = P.SPERR_SHOTS; playSound('nachladen', 0.4); await wait(220); break; }
    case 'mark': { const [x, y] = center(e.c, e.r); if (e.u != null) pose(e.u, 'funk', 1500);
      playSound('leuchtschuss', 0.5); setTimeout(() => playSound('leuchtbrand', 0.22), 450 / speed);   /* Leuchtpistole: Abschuss, dann leises Brennen der Kugel, blendet aus (2026-11-18) */
      if (fx('leuchtkugel', 0, x - s * 0.5, y + s * 0.2, { life: 34, rise: 1.7, mul: 0.75, fadeOut: 0.2 })) { fx('leuchtkugel', 1, x, y - s * 2.1, { delay: 30, life: 20, anchor: 'mitte', grow: 0.5, mul: 0.8 }); await wait(500); }
      visSync('marks'); floater(x, y - s * 1.0, 'Ziel markiert', '#E2B04A', true);
      if (e.rev.length || e.mines) floater(x, y - s * 1.5, `aufgedeckt: ${[e.rev.length ? e.rev.length + ' Trupp' : '', e.mines ? e.mines + ' Mine' + (e.mines > 1 ? 'n' : '') : ''].filter(Boolean).join(', ')}`, '#F0EDE1');
      rings.push({ x, y, r: 1.2, col: 'rgb(' + BONE + ')', life: 40, max: 40 }); await wait(300); break; }
    case 'march': marschU = e.u; break;   // Marschtritt beim folgenden Zug (statt normaler Schritte)
    case 'retreatmove': kz(e.u, 'zurueck', 'steig'); break;   // F40
    case 'freeblow': { const a = DU.get(e.a), d = DU.get(e.u); if (!a || !d) break; const fl = d.x < a.x; a.face = d.x >= a.x ? 0 : 3;   // Freischlag: kurzer Nahkampf-Effekt am Weichenden
      a.lunge = { dx: (d.x - a.x) * 0.18, dy: (d.y - a.y) * 0.18 }; { const sd = unitById(e.a).side; playSound(sd === 'A' ? 'nahA' : 'nahD', 0.45, sd); }
      if (!fx('nahkampf', Math.random() < 0.5 ? 0 : 3, d.x + (fl ? 1 : -1) * L.s * 0.1, d.y - L.s * 0.45, { anchor: 'mitte', life: 18, fadeOut: 0.6, grow: 0.2, flip: fl, mul: 0.7 })) boom(d.x, d.y - L.s * 0.3, L.s * 0.3, 'dust');
      await wait(220); a.lunge = null; await wait(80); break; }
    case 'wind': playSound('ev_wind', 0.4); toast('Der Wind dreht.'); updateTop(); break;
    case 'limber': DU.get(e.u).vs.limbered = !!e.on; playSound(e.on ? 'geschuetz_aufprotzen' : 'geschuetz_abprotzen', 0.6);   /* Standard 2026-11-22; vorher clank/abprotzen */ floater(...headPos(e.u), e.on ? 'aufgeprotzt' : 'abgeprotzt', '#e9d9a8'); await wait(220); break;   // clank nur beim Aufprotzen (Tonprobe 2026-11-18); Paket G: Kommentar verschluckte floater/wait/break, der Fall lief in 'spawn' durch
    case 'spawn': { playSound('whistle', 0.5); addDU(u); const d = DU.get(e.u), [x] = center(u.c, u.r), dir = u.side === 'A' ? -1 : 1; toast(`Nachschub: ${nm(u)} trifft ein.`);
      for (let k = 0; k < 16; k++) { d.x = x + dir * s * 2 * (1 - (k + 1) / 16); await raf(); } await wait(200); break; }
    case 'heal': { const rep = e.by != null && unitById(e.by) && TYPES[unitById(e.by).type].repair;   // F39: Reparieren klingt nach Werkstatt
      if (rep) { pose(e.by, 'reparieren', 1600); playSound('reparieren', 0.6); const d = DU.get(e.u); d.str = e.str; d.mor = e.morv; const m = DU.get(e.by); if (m) m.face = d.x >= m.x ? 0 : 3; kz(e.u, 'werkzeug', 'steig'); await wait(420); break; }
      if (e.by != null) pose(e.by, 'heilen', 1400); playSound('heal', 0.5); const d = DU.get(e.u); d.str = e.str; d.mor = e.morv; if (e.cured) { d.vs.poison = 0; kz(e.u, 'kreuz', 'steig'); } if (e.by != null) { const m = DU.get(e.by); m.face = d.x >= m.x ? 0 : 3; shells.push({ x1: m.x, y1: m.y - s * 0.5, x2: d.x, y2: d.y - s * 0.4, t: 0, dur: 14, arc: 0.5, img: 'bandage', sz: 0.34 }); await wait(240); }
      rings.push({ x: d.x, y: d.y - s * 0.55, r: 0.8, img: ['crossF1', 'crossF2', 'crossF3', 'crossG'][Math.floor(Math.random() * 4)], life: 50, max: 50 }); kz(e.u, 'kreuz', 'steig'); await wait(350); break; }
    case 'gascloud': visSync('clouds'); break;
    case 'bauschaden': {   // Treffer auf die Kirche: Steinsplitter, Staub, Meldung mit Bauzustand
      const [x, y] = center(e.c, e.r); fx('truemmer', [0, 1, 4][Math.floor(Math.random() * 3)], x, y + s * 0.3, { life: 60, mul: 0.8, grow: 0.2, rise: 0.15, fadeOut: 0.5 });
      playSound('impact', 0.6); floater(x, y - s * 0.9, `${BAU_NAME[bauArtVon(e)] || 'Kirche'} ${Math.round(e.hp / e.max * 100)} %`, e.hp <= 2 ? '#e8a060' : '#e6e9ec'); await wait(200); break; }
    case 'einsturz': {   // Kirche stürzt ein: Staub und Trümmer über alle Felder, dumpfer Einsturz, dann steht nur noch die Ruine
      const pts = (e.felder || [[e.c, e.r]]).map(([c, r]) => center(c, r));
      // Ton (2026-11-19): rollt ca. 1,2 s an (Knirschen, Ächzen), dann das Krachen, rieselnder Schutt; zuletzt schlägt die Glocke auf. Bild folgt dem Ton.
      playSound('einsturz', 0.95, null, { rate: 1 }); shake(3);
      pts.forEach(([x, y], i) => fx('truemmer', 2, x, y + s * 0.4, { delay: i * 4, life: 70, mul: 0.7, grow: 0.2, rise: 0.1, alpha: 0.6 }));   // erster Staub aus den Fugen
      await new Promise(r => setTimeout(r, speed >= INSTANT ? 0 : 1150)); shake(10);   // feste Zeit, nicht nach Tempo: der Ton läuft auch nicht schneller
      pts.forEach(([x, y], i) => { fx('truemmer', 4, x, y + s * 0.4, { delay: i * 5, life: 100, mul: 1.4, grow: 0.35, rise: 0.35, fadeOut: 0.5 }); fx('truemmer', [0, 1][i % 2], x + s * 0.3, y + s * 0.2, { delay: 8 + i * 5, life: 90, mul: 1, grow: 0.3 }); fxImpact(x, y - s * 0.2, s * 0.9, { delay: i * 6, alt: true }); });
      const bauArt = bauArtVon(e);   // G6b: Art aus dem Ereignis (Windmühle meldete sich als Kirche); Krähenfurt: auch Häuser und Kapelle (dort keine Glocke im Haus)
      setTimeout(() => playSound('boomH', 0.45, null, { noGap: true }), 120); if (bauArt !== 'haus' && bauArt !== 'muehle') setTimeout(() => playSound('glocke_fall', 0.6, null, { noGap: true, rate: 1 }), 1500);
      await wait(380); bauSicht()[e.bau] = true; renderTerrain();
      { const [x, y] = center(e.c, e.r); floater(x, y - s * (bauArt === 'kirche' ? 1.6 : 0.45), bauArt === 'haus' ? 'Das Haus stürzt ein!' : bauArt === 'kapelle' ? 'Die Kapelle stürzt ein!' : bauArt === 'muehle' ? 'Die Windmühle stürzt ein!' : 'Die Kirche stürzt ein!', '#f0c070', true); }
      await wait(700); break; }
  }
}
function play(events) {
  queue.push(...events);
  if (!qRunning) runQueue();
  return new Promise(res => { const chk = () => (!qRunning && !queue.length) ? res() : setTimeout(chk, 30); chk(); });
}
async function runQueue() {
  qRunning = true;
  while (queue.length) { const e = queue.shift();
    if (e.t === 'melee' && speed < INSTANT) {   // F51 (geändert 2026-11-20): beide schlagen gleichzeitig, danach ein gemeinsamer Wucht-Moment mit beiden Schadenszahlen
      const grp = []; if (e.nk != null) { while (queue.length && queue[0].nk === e.nk) grp.push(queue.shift()); }   // F63: alles, was zu diesem Nahkampf gehört (Gegenschlag, Moral, Zurückweichen, Flucht, Tod, Nachrücken)
      else while (queue.length && grp.length < 6) { const n = queue[0]; if ((n.t === 'hit' && (n.u === e.a || n.u === e.d)) || (n.t === 'counter' && n.a === e.d && n.d === e.a)) grp.push(queue.shift()); else break; }
      try { await nahkampfGleich(e, grp); } catch (err) { console.error(err); } continue; }
    if (e.t === 'fire' && e.reaction && speed < INSTANT && KS !== 'aus') {   // F56 (2026-11-20): Lauerschuss wie bei XCOM – Kamera auf Schütze und Ziel, Schuss, Treffer, kurzer Halt, zurück
      const grp = []; while (queue.length && queue[0].t === 'hit' && queue[0].u === e.d) grp.push(queue.shift());
      const a = DU.get(e.a), d = DU.get(e.d); let st = null;
      try { if (a && d) st = await kampfSzene((a.x + d.x) / 2, (a.y + d.y) / 2 - L.s * 0.4); await playEvent(e); for (const h of grp) await playEvent(h); if (st && !st.skip) await wait(260); } catch (err) { console.error(err); }
      await kampfSzeneEnde(st); continue; }
    try { await playEvent(e); } catch (err) { console.error(err); } }
  syncAll(); qRunning = false; updateUI();
  if (G.over) setTimeout(showEnd, 500);
}

// ---------- Eingabe ----------
let lastSP = [0, 0];   // letzter Zeigerpunkt in Schirm-Pixeln des Canvas (neue Ansicht: Aufsteller und Marken werden dort getroffen)
function evToPx(ev) { const r = cv.getBoundingClientRect(), sx = (ev.clientX - r.left) * cv.width / r.width, sy = (ev.clientY - r.top) * cv.height / r.height; lastSP = [sx, sy];
  camSetup(); return unproj(sx, sy) || [-1e6, -1e6]; }   // Punkt auf dem Boden im Weltbild
// Was liegt unter dem Zeiger? h = Feld, uHex = Einheit auf diesem Feld, uFig = vorderste Figur, deren Körper man dort sieht
function pick(x, y) {
  const h = pixToHex(x, y), uHex = h ? E.unitAt(G, h[0], h[1]) : null;
  let uFig = null; for (let i = UBOX.length - 1; i >= 0; i--) { const b = UBOX[i]; if (lastSP[0] >= b.x0 && lastSP[0] <= b.x1 && lastSP[1] >= b.y0 && lastSP[1] <= b.y1) { uFig = b.u; break; } } return { h, uHex, uFig };   // Aufsteller: vorderster getroffener Kasten
}
const targetOf = p => p.uHex && targets.has(p.uHex.id) ? p.uHex : p.uFig && targets.has(p.uFig.id) ? p.uFig : null;
let drag = null, dragged = 0;
document.addEventListener('pointerdown', ev => { lastPT = ev.pointerType || 'touch'; }, true);   // Maus oder Finger: zuletzt benutzt, überall (z. B. Nachschub-Menü)
cv.addEventListener('pointerdown', ev => { lastPT = ev.pointerType || 'touch'; if (!pinch) drag = { x: ev.clientX, y: ev.clientY, moved: false };   /* K18: Brett-Scrollen gibt es nicht mehr */ });   // Maus und Finger verschieben
window.addEventListener('pointerup', () => { if (drag && drag.moved) dragged = performance.now(); drag = null; cv.style.cursor = ''; cv._zeiger = ''; });
// Kleine Pfeile am Rand zeigen, wohin man noch verschieben kann (Wunsch des Nutzers); antippen verschiebt ein Stück
const SCR = {};
for (const [k, ch] of [['l', '◀'], ['r', '▶'], ['u', '▲'], ['d', '▼']]) {
  const el = document.createElement('button'); el.className = 'scrhint ' + k; el.textContent = ch; el.hidden = true; el.setAttribute('aria-label', 'Karte verschieben');
  el.addEventListener('click', () => { userCam(); const dx = k === 'l' ? -1 : k === 'r' ? 1 : 0, dy = k === 'u' ? -1 : k === 'd' ? 1 : 0; return camPan(dx * 0.4, dy * 0.4); board.scrollBy({ left: dx * board.clientWidth * 0.4, top: dy * board.clientHeight * 0.4, behavior: 'smooth' }); });
  document.body.appendChild(el); SCR[k] = el;
}
function updScroll() {
  for (const k in SCR) SCR[k].hidden = true;   // Kamera statt Scrollen
}
board.addEventListener('scroll', updScroll, { passive: true }); addEventListener('resize', () => setTimeout(updScroll, 50)); setInterval(updScroll, 700);
board.addEventListener('wheel', ev => {   // Mausrad (und Touchpad-Pinch = Strg) zoomt auf den Punkt unter dem Zeiger; Umschalt + Rad verschiebt waagrecht
  if (!G) return; ev.preventDefault(); userCam();
  if (ev.shiftKey && !ev.ctrlKey) { camPan((ev.deltaY || ev.deltaX) / 600, 0); return; }
  const dy = ev.deltaMode === 1 ? ev.deltaY * 30 : ev.deltaY; setZoom((zPend || ZOOM) * Math.exp(-dy * (ev.ctrlKey ? 0.006 : 0.0015)), ev.clientX, ev.clientY);
}, { passive: false });
cv.addEventListener('pointermove', ev => {
  if (drag && !pinch && (ev.buttons & 1)) { const dx = ev.clientX - drag.x, dy = ev.clientY - drag.y; if (drag.moved || Math.hypot(dx, dy) > (ev.pointerType === 'mouse' ? 8 : 14)) { drag.moved = true; userCam(); cv.style.cursor = 'grabbing';
    camDrag(drag, ev); return; } }
  if (!G || ev.pointerType !== 'mouse') return;
  const [x, y] = evToPx(ev), p = pick(x, y);
  hoverHex = p.h;
  const movable = sel && !busy && p.h && reach.has(E.key(p.h[0], p.h[1]));
  hoverU = movable ? null : (p.uFig || p.uHex);
  if (sel && !busy) { const np = targetOf(p); if (np !== previewT) { previewT = np; updateHud(); } }
  { const c = cursorFor(p); if (cv._zeiger !== c && cv.style.cursor !== 'grabbing') { cv.style.cursor = c; cv._zeiger = c; } }   // nur bei echtem Wechsel setzen (kein Flackern an Feldgrenzen)
});
cv.addEventListener('pointerleave', () => { hoverHex = null; hoverU = null; hideTip(); cv.style.cursor = ''; cv._zeiger = ''; });
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
// Gemalte Mauszeiger (Enrico 2026-11-22 15:53, tools/zeiger_bau.py → src/zeiger.js): 32 px, auf 2×-Bildschirmen 64 px; fehlt ein Bild, bleibt der gezeichnete Zeiger
{ const Z = window.ZEIGER || {}, mitSet = typeof CSS !== 'undefined' && CSS.supports && CSS.supports('cursor', 'image-set(url("data:,") 1x) 0 0, auto');
  const zc = (n, fb) => Z[n] ? (mitSet ? `image-set(url("${Z[n].a}") 1x, url("${Z[n].b}") 2x) ${Z[n].x} ${Z[n].y}, ${fb}` : `url("${Z[n].a}") ${Z[n].x} ${Z[n].y}, ${fb}`) : null;
  for (const [k, n, fb] of [['schwert', 'saebel', 'crosshair'], ['ziel', 'ziel', 'crosshair'], ['nein', 'nein', 'not-allowed'], ['feld', 'feld', 'pointer'], ['pfeil', 'pfeil', 'default'], ['hand', 'hand', 'pointer'], ['stiefel', 'stiefel', 'pointer'], ['schere', 'schere', 'pointer']]) { const v = zc(n, fb); if (v) CURSOR[k] = v; else if (!CURSOR[k]) CURSOR[k] = ''; }
  if (CURSOR.pfeil) document.documentElement.style.cursor = CURSOR.pfeil; }   // Grundzeiger überall, auch über Menüs; Knöpfe behalten den Hand-Zeiger des Systems
// F33 (2026-11-20): Zeiger passend zur Fähigkeit über gültigem Ziel – Symbol aus dem Bogen auf dunkler Plakette; ungültig bleibt das Verbotszeichen
const SYMCUR = {};
function symCursor(sym, fb = CURSOR.feld) { if (sym in SYMCUR) return SYMCUR[sym] || fb; const im = UPI['s_' + sym]; if (!im || !im.complete || !im.naturalWidth) return fb;
  try { const c = document.createElement('canvas'); c.width = c.height = 32; const g = c.getContext('2d'); g.beginPath(); g.arc(16, 16, 14, 0, 7); g.fillStyle = 'rgba(18,13,11,0.88)'; g.fill(); g.lineWidth = 2.4; g.strokeStyle = '#C2A461'; g.stroke();
    const w = Math.min(22, 22 * im.naturalWidth / im.naturalHeight), h = w * im.naturalHeight / im.naturalWidth; g.drawImage(im, 16 - w / 2, 16 - h / 2, w, h);
    SYMCUR[sym] = `url("${c.toDataURL('image/png')}") 16 16, pointer`; } catch (e) { SYMCUR[sym] = null; }
  return SYMCUR[sym] || fb; }
const ABIL_CUR = { durchbruch: 'durchbruch', hinrichtung: 'hinrichtung', charge: 'sprengladung', mine: 'tellermine', smoke: 'nebel', tunnel: 'spitzhacke', light: 'scheinwerfer', clear: 'gasmaske', ammo: 'munitionskiste', rush: 'sturmlauf', sprung: 'sprung', rollen: 'sturmrollen', pzgranate: 'panzergranate' };   // bogen8a (2026-11-22): Zeiger wie die Knöpfe
const abilCursor = () => { if (feldArt === 'zweit' || feldArt === 'faust') return CURSOR.ziel; if (feldArt === 'cut') return CURSOR.schere || symCursor('drahtschere'); const a = sel && TYPES[sel.type].abil; return a === 'mark' ? CURSOR.leucht : a === 'strike' ? CURSOR.ziel : ABIL_CUR[a] ? symCursor(ABIL_CUR[a]) : CURSOR.feld; };
function cursorFor(p) {
  const u = p.uFig || p.uHex;
  if (!G || !sel || busy || !human(G.side) || G.over || drag) return G && !busy && !drag && !G.over && human(G.side) && u && u.side === G.side && E.alive(u) ? CURSOR.hand : '';   // '' = Grundzeiger (Pfeil); eigene Einheit zum Anwählen: Panzerhandschuh
  { const hk = u ? E.key(u.c, u.r) : p.h && E.key(p.h[0], p.h[1]); if (abilMode && hk != null && abilSet.has(hk)) return abilCursor(); }   // Feld-Fähigkeit gewählt: gültiges Feld (auch mit Einheit darauf)
  if (u && u.side !== sel.side && E.alive(u)) { const t = targets.get(u.id); if (!t) return shellHexes.has(E.key(u.c, u.r)) ? CURSOR.ziel : CURSOR.nein;   // Artillerie: Ziel geht vor „nicht begehbar“
    const k = t.both ? (atkPref !== 'auto' ? atkPref : t.kind) : t.kind; return k === 'melee' ? CURSOR.schwert : CURSOR.ziel; }
  const k = p.h && E.key(p.h[0], p.h[1]);
  { const hu = u && u.side === sel.side ? u.id : null;   // Hilfsfähigkeiten nur im Modus (Knopf)
    if (hu != null && hilfeAn('heal') && healSet.has(hu)) return symCursor(TYPES[sel.type].repair ? 'zahnrad' : 'sanitaeter');
    if (hu != null && hilfeAn('rec') && recSet.has(hu)) return symCursor('schraubenschluessel');
    if (hu != null && hilfeAn('send') && sendSet.has(hu)) return symCursor('meldehund'); }
  if (u && u.side === sel.side) return CURSOR.hand;
  if (k && reach.has(k)) return CURSOR.stiefel;   // gemalte Zeiger: Ziehen
  if (k && shellHexes.has(k)) return CURSOR.ziel;
  if (k && (abilSet.has(k) || spawnSet.has(k))) return CURSOR.feld;
  if (!k || healSet.has(k) || sendSet.has(k) || recSet.has(k)) return '';
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
      pv.fx.length && { name: E.TERRAIN[G.map[pv.c][pv.r].t].name + ' – ' + pv.fx.map(it => (it.gut ? '▲ ' : '▼ ') + it.kurz).join(', '), text: pv.fx.map(it => it.lang).join(' ') },
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
  cv.addEventListener('contextmenu', ev => { if (ev.pointerType !== 'mouse') ev.preventDefault(); if (G && aktModus()) { ev.preventDefault(); modiAus(); computeOptions(); updateHud(); toast('Abgebrochen.'); } });   // Paket A: Rechtsklick bricht den Modus ab
}
cv.addEventListener('click', ev => {
  if (performance.now() - dragged < 250) return;   // war ein Verschieben, kein Klick
  if (G && G.aufstellung) { const h = pick(...evToPx(ev)).h; if (aufstellWahl && h) aufstellSetze(aufstellWahl, h[0], h[1]); return; }   // Aufstellung: gewählte Einheit auf das Feld
  if (!G || busy || G.over || !human(G.side)) return;
  const [x, y] = evToPx(ev), p = pick(x, y), h = p.h;
  if (placing) { if (h && spawnSet.has(E.key(h[0], h[1]))) return doBuy(h[0], h[1]); return; }
  if (sel) {
    // Mit gewählter Einheit zählt zuerst das Feld: Ziel, Zugfeld oder Beschussfeld, egal welche Figur davorsteht
    if (abilMode && feldArt === 'faust' && h && abilSet.has(E.key(h[0], h[1]))) {   // Faustsalve: erst ein Ziel, dann ein zweites anderes
      const d = G.units.find(x => x.c === h[0] && x.r === h[1] && E.alive(x) && x.side !== sel.side); if (!d) return;
      if (faustErst == null) { faustErst = d.id; playSound('ui', 0.3, null); computeOptions(); updateHud(); return; }
      const d1 = unitById(faustErst); abilMode = false; feldArt = 'abil'; faustErst = null; return act(m => E.faust(G, m, d1, d)); }
    if (abilMode && h && abilSet.has(E.key(h[0], h[1]))) { abilMode = false; const art = feldArt; feldArt = 'abil';
      if (art === 'cut') return act(m => E.cutWire(G, m, h[0], h[1]));
      if (art === 'ramm') return act(m => E.rammen(G, m, h[0], h[1]));   // F79
      if (art === 'zweit') { const d = G.units.find(x => x.c === h[0] && x.r === h[1] && E.alive(x) && x.side !== sel.side); return d ? act(m => E.zweitFire(G, m, d)) : undefined; }
      return act(m => E.useAbil(G, m, h[0], h[1])); }
    if (abilMode && h) {   // F100 (2026-11-22): Klick neben die markierten Felder – nichts ausführen (vorher fiel er in Schuss/Zug durch), nur kurz sagen warum; eigene Einheit anklicken wechselt die Auswahl
      const eig = [p.uFig, p.uHex].find(q => q && q.side === G.side && E.active(q) && q !== sel);
      if (!eig) { playSound('klick', 0.2, null, { noGap: true }); toast(abilDaneben(sel, h)); return; }
      abilMode = false; feldArt = 'abil'; faustErst = null; }
    if (TYPES[sel.type].cls === 'art' && h && shellHexes.has(E.key(h[0], h[1]))) return doShell(h[0], h[1]);
    const tu = targetOf(p);
    if (tu) { if (previewT === tu || lastPT === 'mouse') return doAttack(tu); previewT = tu; updateHud(); return; }
    if (h && ev.shiftKey && lastPT === 'mouse' && (reach.has(E.key(h[0], h[1])) || (wayPt && wayPt[0] === h[0] && wayPt[1] === h[1]))) { setWayPt(h); return; }   // Umschalt+Klick: Wegpunkt setzen/aufheben
    if (h && reach.has(E.key(h[0], h[1]))) {   // Finger: erstes Antippen zeigt die Vorschau von dort, zweites zieht (wie beim Angriff)
      const k = E.key(h[0], h[1]); if (lastPT === 'mouse' || touchMove === k) return doMove(h[0], h[1]);
      touchMove = k; hoverHex = h; updateHud(); return; }
  }
  const u = p.uFig || p.uHex;
  { const hu = [p.uHex, p.uFig].find(q => q && healSet.has(q.id)); if (sel && hu && hilfeAn('heal')) { hilfeModus = null; return act(m => E.heal(G, m, hu)); } }   // nur nach dem Knopf „Versorgen“
  { const ru = [p.uHex, p.uFig].find(q => q && recSet.has(q.id)); if (sel && ru && hilfeAn('rec')) { hilfeModus = null; return act(m => E.recover(G, m, ru)); } }
  { const su = [p.uHex, p.uFig].find(q => q && sendSet.has(q.id)); if (sel && su && hilfeAn('send')) { hilfeModus = null; ABGEHAKT.delete(G.turn + G.side + ':' + su.id); return act(m => E.sendOrder(G, m, su)); } }   // Enrico 2026-11-22: schon fertige Einheit bekommt Punkte vom Hund und darf wieder handeln (Fertig-Haken weg)
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
function stimmSatz(u) { const T = TYPES[u.type]; return PANZER.includes(u.type) ? 'panzer' : T.cls === 'walker' || T.dauerfeuer ? 'schreiter' : T.suit ? 'anzug' : T.cmd ? 'fuehrer' : 'inf'; }
function stimmPool(u) {
  const satz = stimmSatz(u), basis = `sv_${satz}_${u.side}`; let n = 0; while (SND_POOLS[basis + (n + 1)]) n++; if (!n) return null;
  if (!stimmeVon.has(u.id)) { const z = stimmeNaechste[basis] || 0, alle = Array.from({ length: n }, (_, i) => i + 1), da = alle.filter(i => SND_POOLS[basis + i].some(e => !TON_AUS.has(e[0]))), wahl = da.length ? da : alle; stimmeVon.set(u.id, wahl[z % wahl.length]); stimmeNaechste[basis] = z + 1; }   // feste Stimme, reihum; ganz aussortierte Sprecher (Abstellkammer) werden übersprungen
  return basis + stimmeVon.get(u.id);
}
function stimmZiehen(pool) {   // Beutel: alle Sprüche der Stimme gemischt, nacheinander; neuer Beutel beginnt nie mit dem letzten Spruch
  const alle0 = (SND_POOLS[pool] || []).map(e => e[0]).filter(k => SND[k]), frei = alle0.filter(k => !TON_AUS.has(k)), alle = frei.length ? frei : alle0; if (!alle.length) return null;   // ohne aussortierte Sprüche (Abstellkammer)
  let b = stimmeBeutel[pool]; if (!b || !b.rest.length) { const neu = alle.slice().sort(() => Math.random() - 0.5); if (b && neu.length > 1 && neu[0] === b.letzt) neu.push(neu.shift()); b = stimmeBeutel[pool] = { rest: neu, letzt: b && b.letzt }; }
  const k = b.rest.shift(); b.letzt = k; return k;
}
function klickStimme(u) { refreshSpent(); if (spent.has(u.id)) playSound('klick', 0.2, null, { noGap: true }); else selectVoice(u); }   // ausgegraut (fertig): kein Spruch
function selectVoice(u) {   // V3: Anwählen mit den neuen Stimmen (Motor bzw. Pferd wie bisher darunter), Löwenoger nur Brüllen
  if (!u || !soundOn || speed >= INSTANT) return;
  if (u.type === 'oger') { playSound('oger_bruell', 0.4, null, { noGap: true, von: u }); return; }
  if (PANZER.includes(u.type)) { const mk = tonPick('motor_auswahl', u); if (mk) motorRev(mk, { vol: 0.13, dauer: 0.7 }); }
  if (TYPES[u.type].cls === 'cav') playSound('pferd_auswahl', 0.26, u.side, { noGap: true, von: u });
  stimme(u, stHeld(u) ? 'auswahl' : 'anwahl', { immer: true, sperre: 900, abstand: 0, vol: 0.55 });
}
// Motor kurz aufheulen lassen („Rumm“, ca. 1 s): einblenden, Tonhöhe 0,8× → 1,2× wie leicht Gas geben, ausblenden (Paket 4)
function motorRev(k, o = {}) {   // o.vol (Grundlautstärke), o.dauer (s): beim Anklicken leiser und kürzer, damit die Stimme darüber klar bleibt
  if (!soundOn || !SND[k] || speed >= INSTANT) return null;
  const V = o.vol || 0.32, D = o.dauer || 1.1; let aus = false;
  try { const a = SND[k].cloneNode(); a.preservesPitch = false; a.mozPreservesPitch = false; a.webkitPreservesPitch = false; a.volume = 0; a.playbackRate = 0.8; anBus(a, 'e');
    const p = a.play(); if (p && p.catch) p.catch(() => {}); const t0 = performance.now();
    const tick = () => { const t = (performance.now() - t0) / 1000; if (t > D || aus) { a.pause(); return; }
      try { a.volume = V * effektVol * duckF() * Math.min(1, t / 0.08) * Math.min(1, Math.max(0, (D - t) / (D * 0.36))); a.playbackRate = 0.8 + 0.4 * Math.min(1, t / (D * 0.4)); } catch (e) {}
      setTimeout(tick, 30); };
    tick(); window.__sndBy = window.__sndBy || {}; window.__sndBy[k] = (window.__sndBy[k] || 0) + 1; } catch (e) {}
  return { stop: () => { aus = true; } };
}
function select(u) {
  if (u && u !== sel && G && u.side === G.side && human(u.side) && E.active(u)) klickStimme(u);   // Spruch bei jedem Anwählen (Reiter: Pferd + Spruch); fertige Einheiten nur ein leiser Klick   // Reiter: Schnauben häufig, Wiehern etwa jedes 4. Mal (Gewicht im Tonplatz)   // Stimme beim Anwählen (selten, siehe selectVoice)
  if (u !== sel) { wayPt = null; modiAus(); if (u && G && E.alive(u)) kzAnwahl(u); }   // Paket A: Modus gilt nur für die Einheit, die ihn eingeschaltet hat   // Kopfzeichen der andauernden Zustände
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
    if (F.cls === 'art') return d >= 1 && d <= F.rng && (E.isDirect(G, f, c, r) || (d >= E.minSteil(f) && E.spotted(G, f.side, c, r)));
    if (!(F.rng > 1) || E.immune(F, T0) || (T0.hidden && !(sel.revealed > 0) && d > 1)) return false;
    return d <= E.rangeOf(G, f, c, r) && E.hasLOS(G, f.c, f.r, c, r); });
  pvCache = { id, c, r, hit, threat, cov: E.coverOf(G, ghost).tier, fx: feldWirkungSicher(sel, c, r) }; return pvCache;
}
// F60 (2026-11-20): Vorschau beim Ziehen – je erreichbarem Feld (mit Gegner in der Nähe), ob danach noch Schuss (Gewehr), Sturm (Schwert) oder nichts geht
let nachZug = new Map();
function nachZugBerechnen() { nachZug = new Map(); if (!sel || !human(G.side) || sel.side !== G.side) return; const T0 = TYPES[sel.type]; if (T0.cls === 'art' || T0.cls === 'medic' || !(T0.rng > 0 || T0.atk >= 3 || T0.abil)) return;
  const foes = G.units.filter(d => d.side !== sel.side && E.alive(d) && E.active(d));
  for (const [k, n] of reach) { if (n.retreat) continue; const nah = foes.filter(d => E.dist(d.c, d.r, n.c, n.r) <= Math.max(1, T0.rng || 0) + 1); if (!nah.length) continue;
    if (n.march) { nachZug.set(k, { art: 'nichts', grund: 'Marsch: danach keine Aktion mehr.' }); continue; }
    const g0 = { ...sel, c: n.c, r: n.r, ap: sel.ap, bp: n.rest, bpUsed: (sel.bpUsed || 0) + n.cost, mvd: (sel.mvd || 0) + 1, setup: T0.mg ? false : sel.setup, dug: false };
    const schuss = nah.some(d => E.canFire(G, g0, d)), sturm = nah.some(d => E.dist(d.c, d.r, n.c, n.r) === 1 && E.canMelee(G, g0, d));
    const neben = nah.some(d => E.dist(d.c, d.r, n.c, n.r) === 1);
    const AB = T0.abil && E.ABILS[T0.abil], faehig = !schuss && !sturm && AB && AB.atk && E.abilTargets(G, g0).some(([c, r]) => nah.some(d => d.c === c && d.r === r));   // Prüfliste 2.15: Sturmrollen, Panzergranate, Haftladung, Sprung …
    if (faehig) { nachZug.set(k, { art: 'faehig', grund: '' }); continue; }
    nachZug.set(k, { art: schuss ? 'schuss' : sturm ? 'sturm' : 'nichts', grund: schuss || sturm ? '' : neben ? (T0.rng > 0 && !T0.flame ? 'Neben Feind: gebunden (kein Schuss), Sturm nur bis halbe Bewegung.' : 'Neben Feind: Sturm nur bis halbe Bewegung.') : T0.mg ? 'MG muss nach dem Zug erst aufgebaut werden.' : 'Von dort kein Ziel in Reichweite und Sicht.' }); }
}
function computeOptions() {
  reach = new Map(); targets = new Map(); shellHexes = new Set(); rangeSet = new Set(); healSet = new Set(); sightSet = new Set(); scoutSet = new Set();
  hideSet = new Set(); rangeEdges = []; touchMove = null; pvCache = null;
  if (!sel || !E.active(sel) || sel.side !== G.side) return;
  if (TYPES[sel.type].relay) for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) { const dd = E.dist(sel.c, sel.r, c, r); if (dd > 0 && dd <= TYPES[sel.type].spot && E.hasLOS(G, sel.c, sel.r, c, r)) sightSet.add(E.key(c, r)); }
  if (wayPt && !E.reachable(G, sel).has(E.key(wayPt[0], wayPt[1])) && !E.reachable(G, sel, { march: true }).has(E.key(wayPt[0], wayPt[1]))) wayPt = null;
  reach = E.reachable(G, sel, wayPt ? { via: wayPt } : undefined);
  nachZugBerechnen();   // F60
  for (const [k, n] of E.reachable(G, sel, { march: true, via: wayPt || undefined })) if (!reach.has(k)) reach.set(k, n);   // Marsch: gelbe Felder
  abilSet = new Set(); if (abilMode) for (const [c, r] of feldArt === 'ramm' ? E.rammZiele(G, sel) : feldArt === 'cut' ? E.cutTargets(G, sel) : feldArt === 'zweit' ? E.zweitTargets(G, sel).map(d => [d.c, d.r]) : feldArt === 'faust' ? E.faustTargets(G, sel).filter(d => d.id !== faustErst).map(d => [d.c, d.r]) : E.abilTargets(G, sel)) abilSet.add(E.key(c, r));
  if (faustErst != null) { const f = unitById(faustErst); if (f) abilSet.delete(E.key(f.c, f.r)); }
  recSet = new Set(); if (TYPES[sel.type].recover) for (const o of G.units) if (E.canRecover(G, sel, o)) recSet.add(o.id);
  if (TYPES[sel.type].cls === 'medic') for (const o of G.units) if (E.canHeal(G, sel, o)) healSet.add(o.id);
  sendSet = new Set(); if (TYPES[sel.type].courier) for (const o of G.units) if (E.canSend(G, sel, o)) sendSet.add(o.id);
  { const T0 = TYPES[sel.type], can = T0.cls === 'art' ? (!sel.limbered && !sel.attacked && sel.ap >= 1 && !sel.supp) : (T0.rng > 1 && !sel.attacked && sel.ap >= 1 && (!T0.mg || sel.setup));
    if (can) for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) { const d = E.dist(sel.c, sel.r, c, r); if (d >= 1 && d <= (T0.cls === 'art' ? T0.rng : E.rangeOf(G, sel, c, r)) && E.inFan(G, sel, c, r)) rangeSet.add(E.key(c, r)); }   // MG: nur im Schussfächer
    // Sicht: Felder in Sicht- bzw. Schussweite ohne Sichtlinie (Wald, Dorf, Fabrik, Kirche dazwischen, Rauch). Artillerie sieht selbst nur bis zur Direktschussweite.
    const SP = T0.cls === 'art' ? P.ART_DIRECT : Math.max(E.sichtOf(G, sel), E.rangeOf(G, sel, sel.c, sel.r));
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
let handelnd = null;   // F57: Einheit der laufenden Handlung
async function act(fn) {
  if (busy || !sel || !G || G.over) return;   // nur mit gewählter Einheit und nie während einer laufenden Handlung (sonst zwei Handlungen gleichzeitig)
  busy = true; const u = sel; handelnd = u.id;
  camRueck = human(G.side) && OPT.camZurueck !== false ? { x: CAM.x, y: CAM.y, fern: false, t: performance.now() } : null;   // Punkt 24: Kamera vor der Handlung merken
  try {
    previewT = null; recSet = new Set(); abilSet = new Set(); abilMode = false; feldArt = 'abil'; faustErst = null; reach = new Map(); targets = new Map(); shellHexes = new Set(); rangeSet = new Set(); healSet = new Set(); sendSet = new Set(); sightSet = new Set(); scoutSet = new Set(); updateHud();
    await play(fn(u) || []);
  } catch (err) { console.error('Handlung:', err); }
  finally {   // busy wird immer zurückgesetzt – sonst lassen sich danach keine Trupps mehr losschicken
    busy = false;
    sel = (u && E.active(u) && hasAction(u)) ? u : null;   // F93 (2026-11-22): bleibt gewählt, solange sie noch etwas kann (zweite Waffe, Ziehen, Fähigkeit …) – dieselbe Prüfung wie „fertig/grau“ (F88)
    computeOptions(); updateUI(); camZurueckFahren();
  }
}
const doMove = (c, r) => { const n = reach.get(E.key(c, r)), via = wayPt; wayPt = null; return act(u => via && n && n.via ? E.moveUnit(G, u, c, r, n) : E.moveUnit(G, u, c, r)); };   // mit Wegpunkt: genau der gezeigte Weg
// F100: Meldung bei Klick auf ein ungültiges Ziel im Fähigkeits-Modus (kein Schuss, keine Pause verbraucht)
function abilDaneben(u, h) {
  const T = TYPES[u.type], d = E.dist(u.c, u.r, h[0], h[1]), x = G.units.find(q => q.c === h[0] && q.r === h[1] && E.alive(q));
  const name = feldArt === 'cut' ? 'Draht schneiden' : feldArt === 'zweit' ? ((T.zweit && T.zweit.name) || 'Zweitwaffe') : feldArt === 'ramm' ? 'Rammen' : feldArt === 'faust' ? 'Faustsalve' : ((E.ABILS[T.abil] || {}).name || 'Fähigkeit');
  const k = feldArt === 'abil' ? T.abil : feldArt;
  if (k === 'rollen' || k === 'durchbruch') return `${name}: ${d > 2 ? 'zu weit – reicht 2 Felder geradeaus' : !x || x.side === u.side ? 'nur gegen einen Gegner' : 'kein gerader, freier Anlauf dorthin'}.`;
  if (k === 'hinrichtung') return `${name}: nur gegen einen angeschlagenen Gegner direkt daneben (unter ${E.P.HINRICHT_STR} Stärke).`;
  if (k === 'sprung') return `${name}: Gegner bis ${felder(E.P.SPRUNG + 1)}, daneben muss ein freies Landefeld ohne Draht sein.`;
  return `${name}: kein gültiges Ziel – nur die markierten Felder.`;
}
function setWayPt(h) { if (!sel || !h) return false; const k = E.key(h[0], h[1]); if (wayPt && wayPt[0] === h[0] && wayPt[1] === h[1]) { wayPt = null; computeOptions(); updateHud(); return true; }
  if (!reach.has(k)) return false; wayPt = [h[0], h[1]]; computeOptions(); if (!reach.size) { wayPt = null; computeOptions(); } updateHud(); playSound('ui', 0.3, null); return true; }
const doAttack = d => { const t = d && targets.get(d.id); if (!t) return; return act(u => t.kind === 'fire' ? E.fire(G, u, d) : E.melee(G, u, d)); };   // nur gültige Ziele
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
// SP-1 (84.5): warten, bis keine Leuchtspur, Granate oder verzögerter Schuss mehr unterwegs ist (höchstens 2,5 s), damit nach dem Rundenende nichts mehr feuert
let schussBis = 0;
async function ruhe() { if (window.RUHE_ALT) return; const t0 = performance.now(); while (performance.now() - t0 < 2500 && (tracers.length || shells.length || performance.now() < schussBis)) await new Promise(r => setTimeout(r, 50)); }
async function endTurn() {
  if (busy || G.over || G.aufstellung) return;
  placing = null; spawnSet = new Set();
  select(null); busy = true;
  await ruhe();   // SP-1 (84.5): erst die letzte Garbe/Salve zu Ende zeigen, dann wechselt die Runde
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
  await ruhe();   // SP-1 (84.5)
  await play(E.endTurn(G));
  busy = false; activeU = null; updateUI(); rundenSchild();
  camHome();   // Rundenbeginn: zurück zur eigenen Einheit bzw. Front
}

// ---------- Anzeige ----------
let toastT = 0;
function toast(text) { const el = $('toast'); el.textContent = text; el.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('on'), 3800); }
// Rundenschild beim Zugwechsel (2026-11-17): ca. 2 s mittig unter der Siegpunkt-Anzeige, Holz mit Eisen-Messing-Rahmen, „Runde n“, Wappen, „… ist am Zug“;
// Klick oder Tippen blendet sofort aus, blockiert keine Eingaben. Ton: eigener Zug Trommelwirbel, Gegnerzug Wirbel mit tiefem Horn (leiser als Befehle)
let rundenT = 0, glockeRunde = -1;
// F41 (2026-11-20): Warnung, bevor eine Seite gewinnt – Rest bis zum Ziel höchstens zwei Runden Einnahmen aus den gehaltenen Zielfeldern (Stufe 1)
// bzw. eine Runde (Stufe 2). Einblendung mit Horn bzw. Trommel, die Punktezahl oben pulsiert. Jede Stufe wird je Seite nur einmal angesagt.
const siegEinnahme = sd => OBJECTIVES.filter(o => G.ctrl[o.id] === sd).reduce((a, o) => a + o.pts, 0);
const siegNah = sd => { const e = siegEinnahme(sd), rest = G.goal - G.vp[sd]; return e <= 0 ? 0 : rest <= e ? 2 : rest <= e * 2 ? 1 : 0; };
let siegGemeldet = { A: 0, D: 0 };
function siegWarnung() {
  if (!G || G.over || G.aufstellung) return;
  for (const sd of ['A', 'D']) { const n = siegNah(sd); if (n > siegGemeldet[sd]) { siegGemeldet[sd] = n;
    const ich = mode === 'hot' ? null : mode, wir = ich === sd, name = sd === 'A' ? SIDES.A.short : SIDES[sd].short;
    const titel = wir ? (n === 2 ? 'Der Sieg ist zum Greifen nah!' : 'Der Sieg rückt näher') : ich ? (n === 2 ? 'Niederlage droht!' : 'Der Gegner rückt dem Sieg näher') : `${name}: ${n === 2 ? 'Sieg zum Greifen nah' : 'Sieg rückt näher'}`;
    const sub = `${name} hat ${G.vp[sd]} von ${G.goal} Siegpunkten und bekommt ${siegEinnahme(sd)} je Runde` + (wir || !ich ? '' : ' – nehmt ihm Zielfelder ab!');
    setTimeout(() => { banner(titel, sub); playSound(wir ? 'zug_eigen' : 'horn', 0.5, null, { noGap: true }); }, 900); } }
}
// SP-1 (84.1): Posenbilder (mit Plastik-Karte, bwBild ≈ 50–150 ms je Bild) nicht erst im Nahkampf aufbereiten – das ließ das Bild beim ersten Hieb kurz stehen.
// Einmal je Zugwechsel im Leerlauf nacheinander vorrechnen (je Leerlauf-Fenster ein Bild). Rückweg window.VORWAERM_ALT
const VORW = new Set(); let vorwLauf = false;
function posenVorwaermen() {
  if (window.VORWAERM_ALT || !G) return;
  for (const u of G.units) { if (!E.alive(u) || !POSE_TYPEN.has(u.type)) continue; const PB = POSE_SETS[u.type] || POSE_BILD, pre = u.side === 'A' ? 'konkordat_' : 'aschenwacht_';
    for (const v of Object.values(PB)) if (typeof v === 'string' && !VORW.has(pre + v + ':' + BW)) VORW.add(pre + v + ':' + BW + '?'); }
  if (vorwLauf) return; vorwLauf = true;
  const ric = window.requestIdleCallback || (f => setTimeout(() => f({ timeRemaining: () => 20 }), 200));
  const schritt = () => { const k = [...VORW].find(x => x.endsWith('?')); if (!k) { vorwLauf = false; return; }
    if (busy) { setTimeout(() => ric(schritt, { timeout: 4000 }), 400); return; }   // nicht während einer Handlung
    const key = k.slice(0, k.lastIndexOf(':')), im = figImg(key); if (im || !(window.FIGS && window.FIGS[key])) { VORW.delete(k); VORW.add(k.slice(0, -1)); }
    ric(schritt, { timeout: 4000 }); };
  ric(schritt, { timeout: 4000 });
}
function rundenSchild() {
  try { posenVorwaermen(); } catch (err) { }
  if (!G || G.over) return; const el = $('rundenSchild'), sd = G.side, eigen = human(sd) || mode === 'hot';
  el.innerHTML = `<b>Runde ${G.turn}</b><span class="rs-w">${crest(sd)}</span><span class="rs-t">${sd === 'A' ? SIDES.A.name : SIDES[sd].short} ist am Zug</span>`;
  el.className = 'rs ' + sd; void el.offsetWidth; el.classList.add('an'); clearTimeout(rundenT); rundenT = setTimeout(() => el.classList.remove('an'), 2300);
  playSound(eigen ? 'zug_eigen' : 'zug_gegner', 0.35, null, { noGap: true });
  { const gv = ORT_GLOCKE[E.MAP.id];   // Sankt Ruß: Kirchenglocke zum Beginn jeder Runde (nicht bei jedem Zugwechsel), solange die Kirche steht
    if (gv && G.turn !== glockeRunde && (G.bauten || []).length && !bauSicht().some(x => x)) { glockeRunde = G.turn; setTimeout(() => playSound('glocke', gv, null, { noGap: true, rate: 0.97 + Math.random() * 0.05 }), 450); } }
  if (eigen) kzRunde(sd);   // Kopfzeichen der wichtigen Zustände zu Beginn des eigenen Zugs
  siegWarnung();   // F41
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
  $('objs').innerHTML = `<span class="tb-plate tb-pts" data-tip="Siegpunkte (eigene : Gegner). Wer ${G.goal} erreicht, gewinnt. Kreise: Zielfelder mit ihren Punkten je Runde."><b class="${mine}${siegNah(mine) ? ' nah' + siegNah(mine) : ''}">${G.vp[mine]}</b><i class="sep">:</i><b class="${foe}${siegNah(foe) ? ' nah' + siegNah(foe) : ''}">${G.vp[foe]}</b><small>/ ${G.goal}</small>`
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
  sndOff: TB_ICON('<path d="M3.5 9h4l5-4.5v15l-5-4.5h-4z" fill="#F0EDE1" opacity=".55"/><path d="M16 9a4.5 4.5 0 0 1 0 6" opacity=".55"/><path d="M3 3 21 21" stroke="#120D0B" stroke-width="5.5"/><path d="M3 3 21 21" stroke="#D2483A" stroke-width="3"/>'),   // F18: deutlich durchgestrichen
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
const ABGEHAKT = new Map();   // F11: per „Fertig“ abgehakt (je Runde und Seite), dann grau, auch wenn noch die Zweitwaffe ginge; F102: Wert = Stand davor (für Rückgängig)
// F88 (2026-11-22): bereitGrund nennt, warum eine Einheit noch nicht fertig ist (Test __dbg.bereitGrund); hasAction = es gibt einen Grund
function hasAction(u) { return !!bereitGrund(u); }
function zielDa(u) {   // gibt es einen Gegner, den die Einheit jetzt beschießen kann (Geschütz: Granate/Sperrfeuer; sonst Schuss oder MG nach Drehen)?
  const T = TYPES[u.type], f0 = u.face;
  return G.units.some(d => { if (d.side === u.side || !E.alive(d)) return false;
    if (T.cls === 'art') return E.canShell(G, u, d.c, d.r, 'he') || E.canShell(G, u, d.c, d.r, 'barrage');
    if (E.canFire(G, u, d)) return true; if (!T.mg) return false; u.face = E.faceIndex(E.angleTo(u.c, u.r, d.c, d.r)); const ok = E.canFire(G, u, d); u.face = f0; return ok; });
}
function bereitGrund(u) {
  if (u.broken > 0 || ABGEHAKT.has(G.turn + G.side + ':' + u.id)) return '';
  if (TYPES[u.type].zweit && !u.zw && E.zweitTargets(G, u).length) return 'zweitwaffe';   // F17: Zweitwaffe noch frei
  if (TYPES[u.type].roar && E.canRoar(G, u)) return 'gebruell';
  if (!u.supp && E.reachable(G, u).size) return 'ziehen';   /* noch Bewegungspunkte */
  if ((E.canTeardown(G, u) || (TYPES[u.type].cls === 'art' && !u.limbered)) && !zielDa(u) && !(TYPES[u.type].abil && E.abilTargets(G, u).length)) return '';   // Fehler 18:30: in Stellung (MG aufgebaut, Geschütz abgeprotzt), nicht beweglich, kein Ziel → fertig
  if (u.ap < 1) return E.canSetup(G, u) ? 'aufbauen' : E.canTeardown(G, u) ? 'abbauen' : '';
  if (E.canOrder(G, u) || G.units.some(o => E.canSend(G, u, o) || E.canRecover(G, u, o))) return 'befehl';
  if (E.canSetup(G, u)) return 'aufbauen';
  // Bereit heißt: irgendeine Aktion ist noch möglich (Wunsch 2026-11-16), nicht nur Ziehen. Aufgebautes MG kann abbauen,
  // Geschütz in Stellung aufprotzen, Schützen Feuerbereitschaft nehmen. (Bloßes Drehen zählt allein nicht, es ist frei.)
  if (E.canTeardown(G, u)) return 'abbauen'; if (E.canLimber(G, u)) return 'aufprotzen'; if (E.canOverwatch(G, u)) return 'feuerbereit';
  if (E.canDig(G, u)) return 'eingraben'; if (E.canShields(G, u)) return 'schilde'; if (E.canPlant(G, u)) return 'banner'; if (E.canSperr(G, u)) return 'sperrfeuer'; if (E.canLay(G, u)) return 'draht';   // F17
  if (TYPES[u.type].abil && E.abilTargets(G, u).length) return 'faehigkeit';
  if (u.attacked) return '';
  const T = TYPES[u.type];
  if (T.cls === 'medic') return G.units.some(o => E.canHeal(G, u, o)) ? 'heilen' : '';
  if (T.cls === 'art') return zielDa(u) ? 'beschuss' : '';   // Fehler 18:30: nur mit einem Gegner in Reichweite und Sicht, nicht schon ein leeres Feld
  if (E.canCut(G, u)) return 'draht schneiden';
  const f0 = u.face, fan = d => { if (!T.mg) return false; u.face = E.faceIndex(E.angleTo(u.c, u.r, d.c, d.r)); const ok = E.canFire(G, u, d); u.face = f0; return ok; };   // MG: nach Drehen schussbereit
  return G.units.some(d => d.side !== u.side && E.alive(d) && (E.canFire(G, u, d) || E.canMelee(G, u, d) || fan(d))) ? 'angriff' : '';
}
function refreshSpent() { spent.clear(); if (!G || G.over || !human(G.side)) return; for (const u of G.units) if (u.side === G.side && E.active(u) && !hasAction(u)) spent.add(u.id); }
function updateUI() {
  if (!G) return;
  refreshSpent();
  updateTop();
  const be = $('btnEnd');
  be.disabled = busy || !!G.over || !human(G.side);
  be.textContent = !human(G.side) && !G.over ? 'KI zieht …' : 'Runde beenden';
  be.classList.toggle('fertig', !be.disabled && !G.aufstellung && !G.units.some(u => u.side === G.side && E.active(u) && !spent.has(u.id)));   // F13: alle fertig oder abgehakt: langsam pulsieren
  const bs = $('btnShop'), hs = human(G.side) ? G.side : (mode === 'hot' ? G.side : mode);
  bs.disabled = busy || !!G.over || !human(G.side); bs.innerHTML = `Nachschub <b>★ ${G.pts[hs]}</b>`;
  if (sel && (!E.active(sel) || sel.side !== G.side)) sel = null;
  computeOptions(); updateHud();
}
// Porträts aus den neuen Figurenbögen (2026-11-17): je Bogen eine gut erkennbare Pose, bei Einzelmodellen das Modell; sonst das alte Bild
const PORTRAIT_POSE = { soldat: 1, sturm: 1, pionier: 1, sanitaeter: 4, flammen: 1, reiter: 1, scharfschuetze: 3, schildwall: 1, schwer: 1, melder: 1, banner: 1, pirschjaeger: 2, signal: 1, stahl: 1, panzerknecht: 1, fernsprech: 3, versorgung: 1, gasschutz: 1, mineur: 1, eingreif: 1 };
function portraitKey(type, side, limbered) {
  const m = type && FIGMAP[type]; if (!m || !window.FIGS || (fac(side) === 'F' && !(TYPES[type] && TYPES[type].held))) return null;   // K10
  const pre = side === 'A' ? 'konkordat_' : 'aschenwacht_'; let sheet = m[0];
  if (limbered && sheet === 'geschuetz' && window.FIGS[pre + 'geschuetz_marsch']) sheet = 'geschuetz_marsch';
  const key = TYPES[type] && TYPES[type].held && window.FIGS[pre + 'held_portrait_1'] ? pre + 'held_portrait_1' : m[1] ? pre + sheet + '_' + (PORTRAIT_POSE[sheet] || 1) : pre + sheet;   // Helden: eigenes Porträt
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
const crest = sd => UP['w' + fac(sd)] ? `<img class="crest c${fac(sd)}" src="${UP['w' + fac(sd)]}" alt="${SIDES[sd].short}">` : (sd === 'A' ? UP_MARK.friend : UP_MARK.foe);
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
const PENNANT = { A: UP.pA || pennant('A'), D: UP.pD || pennant('D'), F: UP.pF || pennant('F') };   // Bild aus ui-quelle/banner/wimpel.png (2026-11-20), sonst gezeichnet; im Spiel nur auf der Zielflagge (drawFahne, UPI.pA/pD/pF)
const ABIL_KEIN = { pzschuss: 'Kein gepanzertes Ziel im direkten Schuss – oder alle Panzergranaten verschossen.', kopfrunter: 'Kein Ziel in Reichweite und Sicht, das noch nicht niedergehalten ist – oder schon gezogen (nur aus dem Stand) oder Pause nach dem letzten Mal.', handgranate: 'Kein Gegner in 1–2 Feldern in Sicht – oder Pause nach dem letzten Wurf.', durchbruch: 'Keine Fußtruppe und kein Geschütz daneben oder 2 Felder geradeaus mit freiem Feld dazwischen (Anlauf nur aus dem Stand) – oder Pause nach dem letzten Durchbruch.', hinrichtung: 'Kein angeschlagener Gegner (unter 40 Stärke) daneben – oder Pause nach der letzten Hinrichtung.', pzgranate: 'Kein Fahrzeug oder Schreiter in 1–2 Feldern in Sicht – oder Pause nach dem letzten Wurf.', rollen: 'Keine Fußtruppe und kein Geschütz daneben oder 2 Felder geradeaus mit freiem Feld dazwischen (Anlauf nur aus dem Stand) – oder Pause nach dem letzten Sturmrollen.', sprung: 'Kein Gegner, neben dem bis 2 Felder entfernt ein freies Landefeld liegt (kein Draht) – oder die Einheit hat sich schon bewegt.', tunnel: 'Kein Graben, Bunker oder Gebäude bis 2 Felder (ohne eigene Einheit, noch ohne Stollen).', mark: 'Kein Feld in Sicht, das noch nicht markiert ist.', strike: 'Kein Feld in Sicht.', smoke: 'Kein Feld bis 3 Felder.', charge: 'Kein Gegner, Bunker, Draht oder keine Barrikade daneben.', mine: 'Kein freies Nachbarfeld.', ammo: 'Kein MG oder Geschütz daneben, das schon geschossen hat.', clear: 'Kein Gas hier oder daneben.' };
// F19 (2026-11-20): Knopftext je Fähigkeit, kurz und nach den Regeln in engine.js (abilTargets/useAbil), Zahlen aus P; vorher stand hier die ganze
// Einheitenbeschreibung (T.can), die z. B. bei der Haftladung nicht zur Regel passte. Abklingzeit hängt abilKurz aus ABILS an.
const ABIL_KURZ = {
  pzschuss: () => `Panzerbrechender Schuss: Fahrzeuge und Schreiter ×${String(P.PZS_S).replace('.', ',')}, Kampfanzüge ×${P.PZS_L}. Nur gegen gepanzerte Ziele, ${P.PZS_LADUNGEN} Ladungen je Schlacht.`,
  kopfrunter: () => `Gezielter Schuss ohne Schaden: Ziel niedergehalten, Moral −${Math.round(P.KOPF_MOR * 10)}. Nur aus dem Stand, alle 2 Runden.`,
  handgranate: () => `Handgranaten auf einen Gegner bis ${felder(P.HANDGR_RNG)}: etwa ${fmt(P.HANDGR_DMG)} Schaden, Graben und Häuser schützen nicht, Ziel niedergehalten. Alle 2 Runden.`,
  smoke: () => `Nebel auf ein Feld bis 3 Felder und seine Nachbarn, bis zum nächsten eigenen Zug. Ziel im Nebel: Beschuss ${xf(P.NEBEL_IN)}; Schütze im Nebel ${xf(P.NEBEL_AUS)}; keine Sicht hindurch.`,
  tunnel: u => `${TYPES[u.type].ladungen ? `Noch ${TYPES[u.type].ladungen - (u.ladUsed || 0)} von ${TYPES[u.type].ladungen} Ladungen in dieser Schlacht. ` : ''}Stollen unter Graben, Bunker oder Gebäude bis 2 Felder. Nach 2 eigenen Runden fliegt das Feld hoch: etwa ${fmt(P.TUNNEL_DMG)} Schaden, starker Moralverlust, danach Trichter.`,
  charge: () => `Sprengladung an ein Nachbarfeld. Gegner dort: etwa ${fmt(P.CHARGE_DMG)} Schaden (weniger bei schwacher eigener Stärke oder hoher Abwehr des Ziels), gegen Kolosse und Kampfmaschinen doppelt und zu 50 % Panne. Bunker und Barrikaden werden Trichter, Draht wird zerrissen.`,
  mine: u => `Mine auf ein freies Nachbarfeld (nicht auf Zielfelder). Ein Gegner, der hineinzieht, bleibt stehen und nimmt etwa ${fmt(P.MINE_DMG)} Schaden. Noch ${u.mines || 0} Minen.${TYPES[u.type].wirelayer ? ' Je Runde Mine oder Draht.' : ''}`,
  light: () => 'Feld bis 4 Felder in Sicht und seine Nachbarn ausleuchten, bis zum nächsten eigenen Zug: eigener Beschuss dorthin ×1,25, Nebel verschwindet.',
  clear: () => 'Gaswolken auf dem eigenen Feld und den Nachbarfeldern auflösen.',
  ammo: () => 'Ein MG oder Geschütz daneben, das in dieser Runde schon geschossen hat, schießt noch einmal (einmal je Runde und Ziel). Zählt als Aufgabe des Versorgungstrupps.',
  mark: u => `Feld in Sicht (bis ${felder(TYPES[u.type].spot || P.SPOT)}) markieren, bis zum nächsten eigenen Zug: eigener Beschuss dorthin ${xf(P.GUIDED)} und ohne Streuung; deckt getarnte Gegner und Minen im Feld und daneben auf.`,
  strike: u => `Feuerschlag auf ein Feld in Sicht (bis ${felder(TYPES[u.type].spot || P.SPOT)}): wie ein Haubitzenschuss, ${Math.round(P.STRIKE_SCATTER * 100)} % Streuung; auf markierten Feldern keine Streuung und ${xf(P.GUIDED)}.`,
  rush: () => `Aus dem Stand bis ${felder(P.RUSH)} geradeaus, Draht hält nicht auf; danach Nahkampf gegen den schwächsten Gegner daneben.`,
  pzgranate: () => `Geballte Ladung auf ein Fahrzeug oder einen Schreiter 1–${P.PZG_RNG} Felder entfernt werfen: etwa ${fmt(P.PZG_DMG * 2)} Schaden (weniger bei starker Panzerung), ${Math.round(P.PZG_PANNE * 100)} % Pannengefahr. Nicht gegen Fußtruppen. Kostet die Aktion.`,
  rollen: () => `Ein schwerer Aufprall auf Fußtruppen oder ein Geschütz daneben oder 2 Felder geradeaus (Anlauf aus dem Stand, Draht wird niedergewalzt): etwa ${fmt(P.ROLLEN_DMG)} Schaden, niedergehalten, Moral −${fmt(P.ROLLEN_MOR)}, kein Gegenschlag. Das Ziel rutscht ein Feld zurück; ist dort kein Platz, ${xf(P.ROLLEN_WAND)} Schaden. Im Graben, Bunker oder eingegraben schützt die Deckung: kein Wegstoßen, nur ${xf(P.ROLLEN_GRABEN)} Schaden, aber niedergehalten. Kostet die Aktion und alle Bewegung.`,
  durchbruch: () => `Kostet die Aktion und alle Bewegung. In eine Einheit daneben oder – nur aus dem Stand – mit Anlauf bis 2 Felder geradeaus (keine Panzer oder Schreiter): bis ${fmt(P.DURCH_DMG)} Schaden, gegen Gepanzerte weniger, Moral −${fmt(P.DURCH_MOR)}, niedergehalten, ein Feld zurückgeschleudert (an einer Wand ×${xf(P.ROLLEN_WAND).slice(1)}).`,
  hinrichtung: () => `Eine angeschlagene Einheit daneben (unter ${fmt(P.HINRICHT_STR)} Stärke, keine Panzer oder Schreiter) wird sofort vernichtet.`,
  sprung: () => `Aus dem Stand bis ${felder(P.SPRUNG)} neben einen Gegner springen, auch über Draht und Gräben (Landefeld ohne Draht), dann sofort Nahkampf.`,
};
function abilKurz(u) { const k = TYPES[u.type].abil, A = E.ABILS[k], f = ABIL_KURZ[k]; if (!f) return TYPES[u.type].can;
  return f(u) + (A.cd ? ` Höchstens alle ${A.cd} Runden.` : ''); }
const ABIL_SYM = { /* bogen8a (Enrico 2026-11-22): je Fähigkeit ein eigenes Zeichen */ pzschuss: 'gegen_panzer', kopfrunter: 'niedergehalten', handgranate: 'handgranate', durchbruch: 'durchbruch', hinrichtung: 'hinrichtung', pzgranate: 'panzergranate', rollen: 'sturmrollen', sprung: 'sprung', rush: 'sturmlauf', mark: 'markieren', strike: 'feuerschlag', smoke: 'nebel', tunnel: 'spitzhacke', charge: 'sprengladung', mine: 'tellermine', light: 'scheinwerfer', clear: 'gasmaske', ammo: 'munitionskiste' };
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
// body.neu: dieselben Elemente wie im alten Panel, per CSS neu angeordnet (index.html „Bedienfeld der neuen Ansicht“).
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
    rolleHtml(u.type) + (T.sp && T.sp.length ? `<div class="hm-chips">${T.sp.map(x => `<span>${x}</span>`).join('')}</div>` : '') + `<p>${T.can}</p>` + chronikHtml(T, 'p');
}
{ const b = document.createElement('button'); b.className = 'neu-mehr'; b.id = 'btnMehr'; b.title = 'Einheitenkarte: kurz oder ausführlich'; $('btnInfo').after(b);
  const set = () => { document.body.classList.toggle('kartelang', kartLang); b.textContent = kartLang ? 'kurz' : 'ausführlich'; }; set();
  b.onclick = () => { kartLang = !kartLang; try { localStorage.setItem('arm.kartelang', kartLang ? '1' : '0'); } catch (e) {} set(); neuKnopfreihe(); }; }
// Nachschub-Menü nach Entwurf B: Kategorien als Reiter, Karten im Querformat, Pergament-Details beim Überfahren/Antippen
let shopKat = 'Alle';
const SHOP_KAT = ['Kommando', 'Standard', 'Spezial', 'Artillerie', 'Fahrzeuge und Kampfmaschinen'];
const SHOP_STANDARD = ['kohorte', 'grenadier', 'mahlwerk', 'sense', 'reiter', 'lanzeD', 'feldscher', 'heiler', 'melder'];   // Linientruppen
// Reiter beider Menüs: zuerst „Alle“ (2026-11-20, alle Einheiten in Kategorie-Reihenfolge), dann die Kategorien
const SN_REITER = ['Alle', ...SHOP_KAT];
const snInKat = (list, k) => k === 'Alle' ? SHOP_KAT.flatMap(c => list.filter(t => shopKatOf(t) === c)) : list.filter(t => shopKatOf(t) === k);
function shopKatOf(t) { const T = TYPES[t]; return T.cmd ? 'Kommando' : T.cls === 'walker' || E.isMech(t) ? 'Fahrzeuge und Kampfmaschinen' : T.cls === 'art' ? 'Artillerie' : SHOP_STANDARD.includes(t) ? 'Standard' : 'Spezial'; }
// Karte und Pergament-Details einer Einheit (Nachschub und Armee-Auswahl gleich, 2026-11-20)
// weiche Trennstellen an Wortfugen langer Namen (Karten werden bei 1280 px schmal; automatische Silbentrennung greift nicht überall)
const SN_FUGE = /(Schützen|Melde|Fernsprech|Scharf|Graben|Lanzen|Flammen|Stahl|Turm|Ordens|Kreuz|Rauch|Tunnel|Versorgungs|Ballon|Aschen|Spreng|Signal|Draht|Banner|Panzer|Minen|Brand|Sturm|Eisen|Säge|Klauen|Eingreif|Pirsch)(?=\p{Ll}{4})/gu;
const snName = n => n.replace(SN_FUGE, '$1­');
// F103 (2026-11-22): Rolle, Stark/Schwach gegen, Kontert man mit – aus den Werten abgeleitet (src/rollen.js), überall dieselben Begriffe
function rolle(t) { return window.ROLLEN ? ROLLEN.rollenVon(E, t) : null; }
// Eigene Welt (Paket A3, 2026-11-24): Text „Aus den Chroniken“ mit Quellenzeile (klein, kursiv) statt „Im echten Krieg“
function felder(n, dativ) { return n === 1 ? '1 Feld' : n + (dativ ? ' Feldern' : ' Felder'); }   // „1 Feld“ statt „1 Felder“ (Punkt 31, 2026-11-24)
const chronikHtml = (T, tag) => T && T.chronik ? `<${tag} class="real chronik"><b>Aus den Chroniken</b><i class="quelle">${T.chronik.quelle}</i>${T.chronik.text}</${tag}>` : '';
function rolleHtml(t) { const r = rolle(t); if (!r) return ''; return `<div class="rolle"><div class="rl-n"><b>Rolle:</b> ${r.rolle}</div>${r.stark.length ? `<div class="rl-p">▲ <b>Stark gegen:</b> ${r.stark.join(', ')}</div>` : ''}${r.schwach.length ? `<div class="rl-m">▼ <b>Schwach gegen:</b> ${r.schwach.join(', ')}</div>` : ''}<div class="rl-k"><b>Kontert man mit:</b> ${r.konter.join(', ')}</div></div>`; }
function snKarte(t, preis) { const T = TYPES[t], r = rolle(t), k = E.katOf(t), pr = preis != null ? preis : E.COST[t], aufs = pr > E.COST[t] ? Math.round((pr / E.COST[t] - 1) * 100) : 0;   /* ST1: Preis mit Seltenheits-Aufschlag */ return `<canvas data-k="${figOf(T)}" data-t="${t}"></canvas><span><span class="nm">${snName(T.name)}</span><span class="rl">${E.katAlt() ? '' : `<span class="kt kt-${k}" title="Kategorie">${E.KAT_NAME[k]}</span>`}${r ? r.rolle : ''}</span><span class="ko"${aufs ? ` title="Seltenheit: je weitere Einheit dieser Kategorie +${Math.round(P.KAT_AUFSCHLAG * 100)} %"` : ''}>★ ${pr}${aufs ? `<small class="aufs"> +${aufs} %</small>` : ''}</span><span class="chips">${(T.sp || []).slice(0, 3).map(x => `<span>${x}</span>`).join('')}</span></span>`; }
// K1 (Punkt 104): belegte/freie Plätze je Kategorie (Armee-Auswahl und Nachschub)
function katLeiste(army) { if (E.katAlt()) return ''; const z = E.katZahl(army), m = E.katMax(z), f = (k, n, mx) => `<span class="kt kt-${k}${mx != null && n >= mx ? ' voll' : ''}" title="${k === 'linie' ? 'Linie: mindestens ein Drittel der Trupps' : k === 'unterst' ? 'Unterstützung: je ' + P.KAT_UNTERST_JE + ' Linientrupps ein Platz' : mx != null ? 'Höchstens ' + mx : 'Jede weitere Einheit dieser Kategorie kostet +' + Math.round(P.KAT_AUFSCHLAG * 100) + ' %'}">${E.KAT_NAME[k]} <b>${n}${mx != null ? '/' + mx : ''}</b></span>`;
  return f('linie', z.linie) + f('unterst', z.unterst, m.unterst) + f('elite', z.elite, isFinite(m.elite) ? m.elite : null) + f('geraet', z.geraet, isFinite(m.geraet) ? m.geraet : null); }   // ST1: ohne Obergrenze nur die Zahl (Aufschlag steht am Preis)
function snZeig(det, el, sheet, w, platz) {   // platz: Element, über das die Details gelegt werden (Armee-Auswahl: Seitenleiste), sonst neben das Fenster
  const t = el.dataset.t, T = TYPES[t], r = el.getBoundingClientRect(), sh = sheet.getBoundingClientRect();
  det.innerHTML = `<h3>${T.name}<span>★ ${E.COST[t]}</span></h3>${rolleHtml(t)}${T.sp && T.sp.length ? `<div class="chips">${T.sp.map(x => `<span>${x}</span>`).join('')}</div>` : ''}<div class="w">${[['Angriff', T.atk], ['Abwehr', T.def], ['Moral', fmt(T.mor)], ['Zug', T.mv], ['Reichweite', T.rng || '–']].map(([k, x]) => `<div><b>${x}</b>${k}</div>`).join('')}</div><div>${T.can}</div>${chronikHtml(T, 'div')}${w ? `<div class="warum">${w}</div>` : ''}`;
  det.classList.add('zeigen'); const dw = det.offsetWidth, dh = det.offsetHeight;
  if (platz) {   // Punkt 8 (2026-11-21): Armee-Auswahl – direkt neben der Karte (rechts, sonst links, sonst darüber), nie über der Auswahl-Übersicht
    let x = r.right + 10, y = r.top - 10; if (x + dw > innerWidth - 8) x = r.left - dw - 10; if (x < 8) { x = Math.max(8, Math.min(innerWidth - dw - 8, r.left + (r.width - dw) / 2)); y = r.top - dh - 10 < 8 ? r.bottom + 10 : r.top - dh - 10; }
    det.style.left = x + 'px'; det.style.top = Math.max(8, Math.min(innerHeight - dh - 8, y)) + 'px'; el.parentElement.querySelectorAll('.sn-k').forEach(e => e.classList.toggle('offen', e === el)); return; }
  let x = sh.left - dw - 8; if (x < 8) x = r.right + 10 + dw < innerWidth ? r.right + 10 : r.left - dw - 10;
  det.style.left = Math.max(8, Math.min(innerWidth - dw - 8, x)) + 'px'; det.style.top = Math.max(80, Math.min(innerHeight - dh - 8, r.top - 10)) + 'px';
  el.parentElement.querySelectorAll('.sn-k').forEach(e => e.classList.toggle('offen', e === el));
}
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
  const sd = G.side, list = E.SHOP[sd].filter(t => G.mechs || !E.isMech(t)), inKat = k => snInKat(list, k);
  if (!inKat(shopKat).length) shopKat = SN_REITER.find(k => inKat(k).length);
  const warum = t => G.pts[sd] < E.preisNeu(E.armeeImFeld(G, sd), t) ? `Zu wenig Punkte: ★ ${E.preisNeu(E.armeeImFeld(G, sd), t)} nötig.` : !E.canBuy(G, sd, t) ? (TYPES[t].cmd === 2 ? 'Es gibt schon einen General.' : TYPES[t].held ? 'Held: nur einer je Schlacht, auch nach seinem Fall.' : TYPES[t].stufe3 ? 'Stufe 3: nur einer je Schlacht, auch nach seinem Fall.' : E.katWarum(E.armeeImFeld(G, sd), t) || 'Gerade nicht möglich.') : !E.spawnHexes(G, sd, t).length ? 'Kein freies Aufstellungsfeld.' : '';
  $('shopNeu').innerHTML = `<div class="sn-titel"><b>Nachschub anfordern</b><span>★ ${G.pts[sd]}</span></div><div class="kat-leiste">${katLeiste(E.armeeImFeld(G, sd))}</div>
    <div class="sn-reiter">${SN_REITER.filter(k => inKat(k).length).map(k => { const n = inKat(k).filter(t => !warum(t)).length; return `<button data-kat="${k}" class="${k === shopKat ? 'an' : ''}${n ? ' leistbar' : ''}" title="${n ? n + ' davon jetzt aufstellbar' : 'Nichts davon gerade aufstellbar'}">${k}<small>${inKat(k).length}</small></button>`; }).join('')}</div>
    <div class="sn-liste">${inKat(shopKat).map(t => `<button class="sn-k${warum(t) ? ' aus' : ''}" data-t="${t}">${snKarte(t, E.preisNeu(E.armeeImFeld(G, sd), t))}</button>`).join('')}</div>
    <div class="sn-fuss"><span>${lastPT === 'mouse' ? 'Überfahren zeigt alle Werte, Klick stellt auf' : 'Antippen zeigt alle Werte, nochmal antippen stellt auf'} – am eigenen Rand oder an eigenen Zielfeldern. Neue Einheiten handeln ab der nächsten Runde.</span><button class="tbtn" id="shopZu">Schließen</button></div>`;
  $('shop').hidden = false; hideShopDet(); shopZiehen();
  requestAnimationFrame(() => $('shopNeu').querySelectorAll('canvas').forEach(c => drawPortrait(c, c.dataset.k, sd, c.dataset.t)));
  $('shopNeu').querySelectorAll('.sn-reiter button').forEach(b => b.onclick = () => { shopKat = b.dataset.kat; openShopNeu(); });
  $('shopZu').onclick = () => { $('shop').hidden = true; hideShopDet(); };
  const det = $('shopDet');
  const zeig = el => snZeig(det, el, $('shop').querySelector('.sheet'), warum(el.dataset.t));
  const kaufen = el => { if (warum(el.dataset.t)) return zeig(el); $('shop').hidden = true; hideShopDet(); select(null); placing = el.dataset.t; spawnSet = new Set(E.spawnHexes(G, sd, placing).map(h => E.key(h[0], h[1]))); updateHud(); };
  $('shopNeu').querySelectorAll('.sn-k').forEach(el => {
    el.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') zeig(el); });
    el.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') hideShopDet(); });
    el.addEventListener('click', () => { if (lastPT === 'mouse' || el.classList.contains('offen')) kaufen(el); else zeig(el); });   // Finger: erst Details, dann aufstellen
  });
}
// Wirkungsbereich (Paket 2): Befehle, großer Befehl, Banner, Schilde vor, Entgiften, Ziel markieren. Knopf überfahren (Maus) oder halten (Touch)
let areaAct = null;
// F96 (2026-11-22): Schussfeld der Feuerbereitschaft (Reichweite + Sicht, wie E.overwatch) bzw. des MG-Sperrfeuers (dazu Schussfächer, wie E.sperr)
const WACH = new Map();   // id → { k, cells } (Zwischenspeicher, neu bei Lage-, Blick- oder Rundenwechsel)
function wachFelder(u, art) {
  const k = [u.c, u.r, u.face, art, G.turn, G.side, (G.smoke || []).length].join(','), w = WACH.get(u.id); if (w && w.k === k) return w.cells;
  const cells = new Set(), fan = art === 'sperr';
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) { const dd = E.dist(u.c, u.r, c, r); if (dd < 1 || dd > E.rangeOf(G, u, c, r)) continue; if (fan && !E.inFan(G, u, c, r)) continue; if (!E.hasLOS(G, u.c, u.r, c, r)) continue; cells.add(E.key(c, r)); }
  WACH.set(u.id, { k, cells }); return cells;
}
function drawWache(g, s) {   // solange die Bereitschaft gilt: feine Umrisslinie am Boden, beim Darüberfahren/Auswählen leicht gefüllt; Gegner nur, wenn sichtbar
  for (const u of G.units) { if (!E.alive(u)) continue; const d = DU.get(u.id); if (!d || d.alpha <= 0) continue;
    const art = u.ow ? 'ow' : TYPES[u.type].mg && d.vs && d.vs.sperr > 0 ? 'sperr' : null; if (!art) continue;
    const eigen = human(u.side) || u.side === G.side; if (!eigen && hideSet.has(u.id)) continue;
    const cells = wachFelder(u, art), nah = hoverU === u || sel === u, amp = BW === 0 ? 0.7 : 1, col = u.side === 'A' ? '226,176,74' : '170,196,214';
    if (nah) for (const k of cells) { const c = Math.floor(k / 100), r = k % 100; hexPath(g, c, r, 0.96); g.fillStyle = `rgba(${col},${0.16 * amp})`; g.fill(); }
    g.save(); g.lineCap = 'round'; g.setLineDash([s * 0.18, s * 0.14]); g.beginPath();
    for (const [c, r, i] of contourOf(cells)) { const [x, y] = center(c, r), p0 = hexCorner(x, y, i, 0.98), p1 = hexCorner(x, y, i + 1, 0.98); g.moveTo(p0[0], p0[1]); g.lineTo(p1[0], p1[1]); }
    g.strokeStyle = `rgba(18,13,11,${(nah ? 0.6 : 0.35) * amp})`; g.lineWidth = Math.max(3, s * 0.06); g.stroke(); g.strokeStyle = `rgba(${col},${(nah ? 0.95 : 0.55) * amp})`; g.lineWidth = Math.max(1.5, s * 0.03); g.stroke(); g.restore(); }
}
function abilArea(act) {
  if (!sel || !act) return null; const T = TYPES[sel.type], own = o => o.side === sel.side && E.active(o), cells = new Set(), within = R => { for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) if (E.dist(sel.c, sel.r, c, r) <= R) cells.add(E.key(c, r)); };
  if (act.startsWith('o-')) { within(E.cmdRange(sel)); return { cells, ok: o => own(o) && TYPES[o.type].cls !== 'walker' && E.dist(o.c, o.r, sel.c, sel.r) <= E.cmdRange(sel) }; }   // Befehle: keine Kolosse/Kampfmaschinen
  if (act === 'big') { within(P.BIG_R); return { cells, ok: o => own(o) && E.dist(o.c, o.r, sel.c, sel.r) <= P.BIG_R }; }
  if (act === 'plant' || (act === 'sel' && T.banner)) { const R = (act === 'plant' ? !sel.planted : sel.planted) ? P.BANNER_R_PLANTED : P.BANNER_R; within(R); return { cells, ok: o => own(o) && E.dist(o.c, o.r, sel.c, sel.r) <= R }; }
  if (act === 'ow' || act === 'sperr') { const cells = wachFelder(sel, act); return { cells, ok: o => o.side !== sel.side && E.alive(o) && cells.has(E.key(o.c, o.r)) }; }   // F96: Vorschau beim Überfahren des Knopfs
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
function fertigKnopf(btns) { const ab = ABGEHAKT.has(G.turn + G.side + ':' + sel.id); btns.push({ act: 'pass', sym: 'haken', name: ab ? 'Wieder öffnen' : 'Fertig', on: spent.has(sel.id), text: ab ? 'Von Hand abgehakt. Noch einmal (Leertaste oder E): wieder offen, wie vorher.' : spent.has(sel.id) ? 'Diese Einheit ist für diese Runde fertig.' : 'Diese Einheit für diese Runde abhaken (Leertaste oder E).' }); }
function unitButtons(T, hints) {
  const btns = [], tg = [...targets.values()];
  if (T.cls === 'art') {
    const c = 1, gezogen = T.noMoveFire && sel.mvd, can = !sel.attacked && sel.ap >= c && !sel.supp && !sel.limbered && !gezogen && !E.held(G, sel);   // F62: Minenwerfer nach dem Ziehen kein Feuer
    const why = sel.supp ? 'Niedergehalten: kann nicht feuern.' : sel.limbered ? 'Aufgeprotzt: erst abprotzen.' : gezogen ? 'Hat sich bewegt: zieht oder feuert, nicht beides.' : E.held(G, sel) ? 'Gegner direkt daneben: gebunden.' : sel.attacked ? 'Hat diese Runde schon gehandelt.' : sel.ap < c ? 'Aktion schon verbraucht.' : '';
    if (E.canLimber(G, sel)) btns.push(sel.limbered
      ? { act: 'limber', sym: 'abprotzen', name: 'Abprotzen', costTxt: 'alle restlichen Bewegungspunkte', text: 'In Stellung gehen. Ab der nächsten Runde feuerbereit.' }
      : { act: 'limber', sym: 'aufprotzen', name: 'Aufprotzen', cost: 1, text: `Anspannen: zieht ${felder(P.LIMBER_MV)}, feuert aber nicht.` });
    btns.push({ act: 'm-he', sym: 'granate_artillerie', name: 'Sprenggranate', cost: c, text: 'Trifft ein Feld mit einem Gegner. Steht er im Draht, geht der Draht mit etwas Glück kaputt (Minenwerfer meist). Leere Drahtfelder kann man nicht beschießen.', on: can && artMode === 'he', off: !can, why });
    const bcd = sel.cdP > 0;   // Sperrfeuer: Abklingzeit P.BARRAGE_CD Runden
    const brest = P.BARRAGE_MAX - (sel.barr || 0), gcd = sel.cdG > 0;   // Paket 8: Sperrfeuer höchstens 2× je Schlacht, Gas alle 3 Runden
    if (!T.direkt) btns.push({ act: 'm-barrage', sym: 'sperrfeuer', name: 'Sperrfeuer', cost: c, cd: sel.cdP, cnt: brest, text: (T.mobile ? 'Ziel und zwei Nachbarfelder: Schaden (etwa ×0,7 eines Einzelschusses), hält nieder.' : 'Ziel und Nachbarfelder: Schaden (etwa ×0,7 eines Einzelschusses), hält nieder.') + ` Höchstens ${P.BARRAGE_MAX}× je Schlacht (noch ${brest}), höchstens alle ${P.BARRAGE_CD} Runden.`, on: can && !bcd && brest > 0 && artMode === 'barrage', off: !can || bcd || brest <= 0, why: brest <= 0 ? `Beide Sperrfeuer verbraucht.` : bcd ? `Wieder in ${upRunden(sel.cdP)}.` : why });
    if (sel.gas > 0 || T.gas > 0) btns.push({ act: 'm-gas', sym: 'gas', name: 'Gasgranate', cost: c, cd: sel.cdG, cnt: sel.gas, text: `Wolke treibt 3 Runden mit dem Wind. Trifft auch eigene Truppen. Höchstens alle ${P.GAS_CD} Runden (noch ${sel.gas || 0} Gasgranaten).`, on: can && !gcd && artMode === 'gas', off: !can || !(sel.gas > 0) || gcd, why: !(sel.gas > 0) ? 'Keine Gasgranaten mehr.' : gcd ? `Wieder in ${upRunden(sel.cdG)}.` : why });
    hints.push(can ? (shellHexes.size ? 'Zielfeld anklicken.' : 'Kein Ziel: Eine eigene Einheit muss es sehen (5 Felder).') : why);
    if (scoutSet.size) hints.push(`<i>◉ ${felder(scoutSet.size)}</i> markiert: keine Streuung, ×1,25.`);
    fertigKnopf(btns);   // Fehler 18:30: Geschütze hatten keinen „Fertig“-Knopf
    return btns;
  }
  { const rz = E.rammZiele(G, sel); if (rz.length) btns.push({ act: 'ramm', sym: 'rammen', name: 'Gebäude rammen', cost: 1, on: abilMode && feldArt === 'ramm', text: `Ein intaktes Gebäude daneben rammen: Bauschaden ${fmt(P.RAMM_BAU)} (bis zum Einsturz), Truppen darin werden niedergehalten. Eigener Schaden etwa ${fmt(P.RAMM_SELBST)}, ${Math.round(P.RAMM_PANNE * 100)} % Pannengefahr. Kostet die Aktion und alle Bewegung.` }); }   // F79
  if (T.cutter) {   // Paket 8: nur Drahtschneider, vom Nachbarfeld aus
    const ct = E.cutTargets(G, sel);
    btns.push({ act: 'cut', sym: 'drahtschere', name: 'Draht schneiden', cost: 1, text: 'Stacheldraht auf diesem oder einem Nachbarfeld entfernen, ohne hineinzulaufen (kein Drahtschaden). Kostet die Aktion; ziehen geht danach noch.', pulse: ct.length > 0, on: abilMode && feldArt === 'cut', off: !ct.length,
      why: sel.supp > 0 ? 'Niedergehalten.' : sel.ap < 1 ? 'Aktion schon verbraucht.' : 'Kein Draht auf diesem Feld oder daneben.' });
    if (abilMode && feldArt === 'cut') hints.push('<i>Messing markiert:</i> Drahtfeld anklicken.');
  }
  if (T.zweit) {   // Paket 8: Zweitwaffe (Seiten-MG, Turm-MG)
    const zt = E.zweitTargets(G, sel), Z = T.zweit;
    btns.push({ act: 'zweit', sym: Z.flamme ? 'flamme' : Z.kanone ? 'kanone_zweit' : 'garbe', name: Z.name, costTxt: 'einmal je Runde zusätzlich, kostet keine Aktion', text: Z.flamme ? 'Flammenstoß auf ein Nachbarfeld, einmal je Runde zusätzlich zum Bohrer: halb so stark wie ein Flammentrupp, Deckung schützt nicht, das Feld brennt danach.' : Z.kanone ? `Kanone im Löwenmaul: Reichweite ${felder(Z.rng)}, einmal je Runde zusätzlich zum MG, halbe Stärke, gegen Panzerung voll.` : `${Z.seiten ? 'Schießt nur nach links und rechts (nicht nach vorn). ' : ''}Reichweite ${felder(Z.rng)}, einmal je Runde zusätzlich zur Kanone, Schaden etwa halb so stark. Wirkt nicht gegen Panzerung.`, on: abilMode && feldArt === 'zweit', off: !zt.length,
      why: sel.zw ? 'Hat in dieser Runde schon geschossen.' : sel.supp > 0 ? 'Niedergehalten.' : sel.ap < 1 ? 'Aktion schon verbraucht.' : sel.broken ? 'Festgefahren.' : `Kein Ziel ${Z.seiten ? 'seitlich ' : ''}bis ${felder(Z.rng)}.` });
    if (abilMode && feldArt === 'zweit') hints.push('<i>Messing markiert:</i> Ziel anklicken.');
  }
  if (T.faust) {   // Faustsalve (Eisenknecht, 2026-11-20): einmal je Schlacht, zwei Ziele nacheinander anklicken
    const ft = E.faustTargets(G, sel);
    btns.push({ act: 'faust', sym: 'kanone_zweit', name: 'Faustsalve', cost: 1, costTxt: 'die Aktion, einmal je Schlacht', text: `Beide Unterarm-Kanonen feuern zugleich auf zwei verschiedene Ziele, jeder Schuss ×${String(P.FAUST_MUL).replace('.', ',')}. Statt des normalen Schusses, nur einmal je Schlacht.`,
      on: abilMode && feldArt === 'faust', off: !E.canFaust(G, sel), why: sel.faustUsed ? 'Schon abgefeuert (einmal je Schlacht).' : sel.supp > 0 ? 'Niedergehalten.' : sel.attacked ? 'Hat diese Runde schon geschossen.' : sel.ap < 1 ? 'Aktion schon verbraucht.' : `Braucht zwei Ziele in Reichweite und Schussfeld (jetzt ${ft.length}).` });
    if (abilMode && feldArt === 'faust') hints.push(faustErst == null ? '<i>Messing markiert:</i> erstes Ziel anklicken.' : '<i>Messing markiert:</i> zweites Ziel anklicken.');
  }
  if (T.wirelayer && !sel.attacked) btns.push({ act: 'lay', sym: 'drahtrolle', name: 'Draht ziehen', cost: 1, text: 'Stacheldraht auf das Feld legen, in das die Einheit blickt.', pulse: true, off: !E.canLay(G, sel), why: 'Zu einem freien Feld drehen (Drehen-Knöpfe).' });
  const atkWhy = sel.supp > 0 ? 'Niedergehalten: kann nicht schießen oder stürmen.' : sel.attacked && sel.abgeprotzt ? 'Gerade abgeprotzt: Das kostet den Schuss dieser Runde – ab der nächsten Runde feuerbereit.' : sel.attacked ? 'Hat diese Runde schon angegriffen.' : sel.ap < 1 ? 'Aktion schon verbraucht.' : sel.fellBack ? 'Ist zurückgewichen: schießt in dieser Runde nicht mehr.' : E.held(G, sel) && TYPES[sel.type].rng > 0 && !TYPES[sel.type].flame ? (E.nahFrei(sel) ? 'Neben Feind: gebunden – kein Schuss, nur Sturm.' : 'Neben Feind: gebunden – kein Schuss; Sturm nur bis halbe Bewegung, die ist schon verbraucht.') : !E.schussNachZug(sel) ? 'Nach mehr als halbem Weg schießt dieser Schreiter nicht mehr, nur Nahkampf.' : 'Kein Ziel in Reichweite und Sicht.';   // F60: Grund, warum nach dem Zug nichts mehr geht
  if (T.rng > 0) {
    const sym = T.lob ? 'handgranate' : T.flame ? 'flamme' : 'zielen', name = T.lob ? 'Granatwurf' : T.flame ? 'Flammenstrahl' : 'Beschuss';
    const why = T.mg && !sel.setup ? 'MG erst aufbauen.' : !sel.supp && !sel.attacked && E.held(G, sel) ? 'Im Nahkampf gebunden: Schießen geht nicht.' : atkWhy;
    if (T.broadside) {   // Sturmpanzer: Breitseite deutlich (2026-11-17) – zwei Schüsse je Runde auf zwei Ziele, Zähler am Knopf, nach dem ersten Schuss pulsiert er
      const n = (sel.bsT || []).length, zweiter = sel.attacked && n === 1, frei = tg.some(t => t.kind === 'fire' || t.both);
      btns.push({ act: 'p-fire', sym: 'breitseite', name: zweiter ? 'Breitseite: zweiter Schuss' : 'Breitseite', cost: 1, cnt: Math.max(0, 2 - n), pulse: zweiter && frei, text: `Zwei Schüsse in einer Runde auf zwei verschiedene Ziele, je ×0,6 – erst ein Ziel bis ${felder(T.rng)}, danach ein anderes bis 2 Felder (beide Schüsse zusammen die Aktion).`, on: atkPref === 'fire', off: !frei,
        why: n >= 2 ? 'Beide Schüsse der Breitseite sind abgegeben.' : zweiter ? 'Kein zweites Ziel bis 2 Felder.' : why });
      if (zweiter && frei) hints.push('<i>Breitseite:</i> zweites Ziel bis 2 Felder anklicken (×0,6).');
    } else
    btns.push({ act: 'p-fire', sym, name, cost: 1, text: `Ziel auf der Karte anklicken (Messing, Zielsymbol). Reichweite ${felder(T.rng)}.`, on: atkPref === 'fire', off: !tg.some(t => t.kind === 'fire' || t.both), why });
  }
  const nahGesperrt = T.atk > 0 && !E.nahFrei(sel) && !sel.attacked && sel.ap >= 1 && !sel.supp && G.units.some(o => o.side !== sel.side && E.alive(o) && E.dist(o.c, o.r, sel.c, sel.r) === 1);
  if (nahGesperrt) hints.push(`<i>Kein Nahkampf mehr:</i> mehr als die Hälfte der Bewegung verbraucht. Schwert am Zugfeld = von dort geht der Sturm noch.`);
  if (T.atk > 0 && !T.keinNah) btns.push({ act: 'p-melee',   /* Prüfliste 2.14: Landkoloss/Sturmpanzer haben keinen Nahkampf (Sturmrollen) */ sym: 'nahkampf', name: 'Nahkampf', why: nahGesperrt ? `Mehr als die Hälfte der Bewegung verbraucht (${sel.bpUsed || 0} von ${E.bpMax(sel)} BP): Nahkampf nur mit höchstens ${Math.floor(E.bpMax(sel) / 2)} BP Weg. Reiter, Sturmtruppen und Kampfanzüge dürfen immer.` : atkWhy, cost: 1, costTxt: 'die Aktion, beendet die Bewegung', text: `Gegner auf einem Nachbarfeld anklicken (rot).${T.cls === 'cav' || T.cls === 'storm' || T.suit ? ' Darf auch nach vollem Weg angreifen.' : ` Nur, wenn höchstens die Hälfte der Bewegungspunkte (${Math.floor(E.bpMax(sel) / 2)}) verbraucht ist.`}`, on: atkPref === 'melee', off: !tg.some(t => t.kind === 'melee' || t.both) });
  if (T.abil) { const A = E.ABILS[T.abil], at = E.abilTargets(G, sel);
    btns.push({ act: 'abil', sym: ABIL_SYM[T.abil] || 'blitz', name: A.name + (T.ladungen ? ` (Ladungen ${T.ladungen - (sel.ladUsed || 0)}/${T.ladungen})` : ''), ...(T.ladungen ? { cnt: T.ladungen - (sel.ladUsed || 0) } : {}), cost: 1, costTxt: A.all ? 'die Aktion und alle Bewegungspunkte' : undefined, cd: sel.cdA, text: abilKurz(sel), on: abilMode && feldArt === 'abil', off: !at.length,
      why: sel.cdA > 0 ? `Wieder in ${upRunden(sel.cdA)}.` : T.abil === 'mine' && !(sel.mines > 0) ? 'Keine Minen mehr.' : sel.ap < 1 ? 'Aktion schon verbraucht.' : sel.supp > 0 ? 'Niedergehalten.' : ABIL_KEIN[T.abil] || 'Kein gültiges Zielfeld.' });
    if (abilMode && feldArt === 'abil') hints.push('<i>Messing markiert:</i> Zielfeld anklicken.'); }
  if (T.fessel) btns.push(sel.eingeholt ? { act: 'ball-auf', sym: 'fernglas', name: 'Aufsteigen', bp: 'alle', text: 'Ballon steigen lassen: Sicht 6 Felder über Wald und Häuser, Ziel markieren möglich; zieht danach nicht. Kostet alle Bewegungspunkte, nicht die Aktion.', off: !E.canAufsteigen(G, sel), why: 'Niedergehalten.' }
    : { act: 'ball-ein', sym: 'einholen', name: 'Einholen', bp: 1, text: 'Ballon einholen: danach zieht der Trupp 2 Felder, sieht aber nur 4 Felder (wie Fußtruppen) und kann nicht markieren.', off: !E.canEinholen(G, sel), why: 'Keine Bewegungspunkte mehr.' });   // F70
  if (T.mg && sel.setup) btns.push({ act: 'teardown', sym: 'mg_ab', name: 'Abbauen', bp: 1, text: 'MG abbauen: danach kann es ziehen, aber nicht mehr schießen, bis es wieder aufgebaut ist.', off: !E.canTeardown(G, sel), why: 'Aktion schon verbraucht.' });
  if (T.mg && !sel.setup) btns.push({ act: 'setup', sym: 'mg_auf', name: 'Aufbauen', bp: 1, costTxt: '1 Bewegungspunkt, nimmt alle restlichen', text: `MG in Stellung bringen: erst dann feuert es oder gibt Sperrfeuer. Verbraucht alle restlichen Bewegungspunkte${sel.bp > 1 ? ` (noch ${sel.bp})` : ''} – danach zieht das MG in dieser Runde nicht mehr. Schießen geht danach mit der Aktion.`, pulse: E.canSetup(G, sel), off: !E.canSetup(G, sel), why: sel.supp > 0 ? 'Niedergehalten.' : 'Aktion schon verbraucht.' });
  if (T.mg) btns.push({ act: 'sperr', sym: 'garbe', name: 'Sperrfeuer', cost: 1, costTxt: 'die Aktion und alle Bewegungspunkte', text: 'Im gegnerischen Zug bis zu 2 Schüsse auf Gegner, die sich im Schussfeld im Offenen bewegen. Nur aufgebaut, in dieser Runde nicht bewegt und nicht geschossen.', on: sel.sperr > 0, off: !E.canSperr(G, sel),
    why: sel.sperr > 0 ? 'Sperrfeuer steht.' : !sel.setup ? 'Erst aufbauen.' : E.feindNah(G, sel) ? 'Gegner direkt daneben: in Feindberührung kein Sperrfeuer.' : sel.mvd ? 'Hat sich in dieser Runde bewegt.' : sel.attacked ? 'Hat diese Runde schon geschossen.' : 'Aktion schon verbraucht.' });
  if (T.rng >= 2 && !T.mg && T.cls !== 'walker') btns.push({ act: 'ow', sym: 'feuerbereit', name: 'Feuerbereitschaft', cost: 1, costTxt: 'die Aktion und alle Bewegungspunkte', text: 'Schießt in der gegnerischen Runde auf den ersten Gegner, der sich in Reichweite bewegt (Schaden ×0,8).', on: !!sel.ow, off: !E.canOverwatch(G, sel), why: sel.ow ? 'Ist schon feuerbereit.' : E.feindNah(G, sel) ? 'Gegner direkt daneben: in Feindberührung keine Feuerbereitschaft.' : 'Braucht die Aktion; nur ohne Bewegung in dieser Runde.' });   // F55
  const ORD = { /* bogen8b (Enrico 2026-11-22) */ rally: ['sammeln', 'Sammeln', 'Eigene Truppen im Umkreis von 1 Feld: Moral +15, Niederhalten endet.'], storm: ['sturmbefehl', 'Sturmbefehl', 'Eigene Truppen im Umkreis von 1 Feld: Nahkampf ×1,25 in dieser Runde.'], fire: ['feuerfrei', 'Feuer frei', 'Eigene Truppen im Umkreis von 1 Feld: Fernkampf ×1,25 bis zu ihrem nächsten Zug.'] };
  if (sel.officer) for (const [k, sym, name, tip] of E.orderKinds(sel).map(k => [k, ...ORD[k]])) {
    const cd = k === 'rally' ? sel.cdR : sel.cdS;
    const rest = P.ORDER_MAX - (sel.befehle || 0);
    btns.push({ act: 'o-' + k, sym, name, cost: 1, cd, cnt: rest, text: `${tip} Noch ${rest} von ${P.ORDER_MAX} Befehlen in dieser Schlacht (alle Befehle zusammen). Abklingzeit ${E.orderCd(G, sel, k)} Runden.`, off: !E.canOrderKind(G, sel, k), why: rest <= 0 ? `Alle ${P.ORDER_MAX} Befehle verbraucht.` : cd > 0 ? `Wieder in ${upRunden(cd)}.` : 'Nur ein Befehl je Runde.' });
  }
  if (T.cmd === 2) { const B = E.BIG[sel.side], used = G.bigUsed && G.bigUsed[sel.side];   // großer Befehl des Generals: einmal je Schlacht
    btns.push({ act: 'big', sym: B.k === 'hold' ? 'halten' : 'generalangriff', name: B.name, cost: 1, pulse: E.canBig(G, sel), cnt: used ? 0 : 1, text: B.k === 'hold' ? `Einmal je Schlacht: eigene Einheiten im Umkreis von ${felder(P.BIG_R, 1)} fliehen bis zum nächsten eigenen Zug nicht, Abwehr ×1,25.` : `Einmal je Schlacht: eigene Einheiten im Umkreis von ${felder(P.BIG_R, 1)} greifen sofort noch einmal an – +1 Aktion und +${P.GENERAL_BP} Bewegungspunkte, auch wer schon geschossen oder gekämpft hat, Nahkampf auch nach weitem Zug; Niederhalten endet. Nicht für fliehende, liegengebliebene oder festgefahrene Einheiten.`, off: !E.canBig(G, sel), why: used ? 'Verbraucht: nur einmal je Schlacht.' : 'Braucht 1 Aktionspunkt.' }); }
  if (sel.dug) btns.push({ act: 'undig', sym: 'schaufel', name: 'Ausgraben', ...(P.AUSGRABEN_AP ? { cost: 1 } : { bp: P.AUSGRABEN_BP }), text: `Aus der Stellung heraus: danach kann die Einheit ziehen, die Deckung ${xf(P.DIG_DEF)} endet. Kostet ${P.AUSGRABEN_AP ? 'die Aktion' : P.AUSGRABEN_BP + ' Bewegungspunkt'}.`, off: !E.canUndig(G, sel), why: P.AUSGRABEN_AP ? 'Aktion schon verbraucht.' : 'Keine Bewegungspunkte mehr.' });   // F36
  if (T.dig && !sel.dug) btns.push({ act: 'dig', sym: 'schaufel', name: 'Eingraben', cost: 1, on: !!sel.dug, text: 'Im offenen Gelände oder Trichter: Abwehr ×1,3, bis die Einheit wieder zieht.', off: !E.canDig(G, sel), why: sel.dug ? 'Ist schon eingegraben.' : !['open', 'crater'].includes(G.map[sel.c][sel.r].t) ? 'Nur im offenen Gelände oder Trichter.' : 'Braucht 1 Aktionspunkt.' });
  if (T.shieldWall) btns.push({ act: 'shields', sym: 'schild', name: 'Schilde vor', cost: 1, on: !!sel.shields, text: 'Eigene Einheiten in den Nachbarfeldern nehmen bis zum nächsten eigenen Zug Beschuss ×0,75.', off: !E.canShields(G, sel), why: sel.shields ? 'Schilde stehen schon.' : 'Braucht 1 Aktionspunkt.' });
  if (T.banner) btns.push({ act: 'plant', sym: 'fahne', name: sel.planted ? 'Banner aufnehmen' : 'Banner aufpflanzen', cost: 1, on: !!sel.planted, text: sel.planted ? 'Banner aus dem Boden nehmen: der Träger kann wieder ziehen, Wirkung wieder 2 Felder.' : 'Banner in den Boden: wirkt 3 Felder weit, dort flieht niemand. Der Träger zieht nicht, solange es steht.', off: !E.canPlant(G, sel), why: 'Braucht 1 Aktionspunkt.' });
  if (T.cls === 'medic' && !sel.attacked) btns.push({ act: 'i-heal', sym: 'sanitaeter', name: 'Versorgen', on: hilfeAn('heal'), cost: 1, cd: sel.cdH, text: 'Nachbarn mit Sanitätszeichen anklicken: Stärke +25, Moral +15.', off: !healSet.size, why: sel.cdH > 0 ? `Wieder in ${upRunden(sel.cdH)}.` : 'Kein verwundeter Nachbar. Neben eine angeschlagene eigene Einheit ziehen.' });
  if (T.courier && !sel.sent) btns.push({ act: 'i-send', sym: 'meldehund', name: 'Befehl überbringen', on: hilfeAn('send'), cost: 1, cd: sel.cdM, text: `Einheit mit Hundesymbol anklicken: Sie bekommt +${P.MELDER_BP} Bewegungspunkte. Danach ${P.MELDER_CD} Runden Pause.`, off: !sendSet.size, why: sel.cdM > 0 ? 'Der Meldegänger ist noch unterwegs.' : 'Keine Einheit in Reichweite.' });
  if (T.recover) btns.push({ act: 'i-rec', sym: 'schraubenschluessel', name: 'Bergen', on: hilfeAn('rec'), cost: 1, cd: sel.cdB, text: 'Koloss bzw. Maschine mit Schraubenschlüssel anklicken.', off: !recSet.size, why: sel.cdB > 0 ? `Wieder in ${upRunden(sel.cdB)}.` : 'Kein liegengebliebener Koloss daneben.' });
  if (!sel.supp && !sel.broken) {
    const dk = E.drehKosten(sel), dt = T.cls === 'walker' ? `Fahrzeuge und Schreiter: Drehen auf der Stelle kostet ${P.DREH_BP} Bewegungspunkt je 60°. Die Hauptwaffe schießt nur nach vorn (±${P.FZ_FAN}°).` : 'Blickrichtung ändern. Drehen kostet nichts.';
    btns.push({ act: 'tl', sym: 'drehpfeil', name: 'Nach links drehen', bp: dk, text: dt, off: (sel.bp || 0) < dk, why: 'Keine Bewegungspunkte mehr.' });
    btns.push({ act: 'tr', sym: 'drehpfeil', name: 'Nach rechts drehen', bp: dk, mirror: true, text: dt, off: (sel.bp || 0) < dk, why: 'Keine Bewegungspunkte mehr.' });
  }
  if (TYPES[sel.type].roar) { const n = E.roarTargets(G, sel).length; btns.push({ act: 'loewe', sym: 'gebruell', name: 'Löwengebrüll', costTxt: 'nichts (einmal je Schlacht)', text: `Einmal je Schlacht, kostet keine Aktion: Gegner ohne Panzerung im Umkreis von ${P.ROAR_R} ${P.ROAR_R === 1 ? 'Feld' : 'Feldern'} verlieren ${String(P.ROAR_MOR).replace('.', ',')} Moral und werden niedergehalten (bis zum Ende ihrer nächsten Runde).`, off: !E.canRoar(G, sel), why: sel.roared ? 'Schon gebrüllt (einmal je Schlacht).' : !n ? 'Kein Gegner ohne Panzerung daneben.' : sel.broken > 0 ? 'Panne.' : 'Gerade nicht möglich.' }); }   // 2026-11-20: echte Wirkung (vorher Test)
  fertigKnopf(btns);
  { const gr = !spent.has(sel.id) && sel.ap < 1 ? bereitGrund(sel) : ''; const NOCH = { ziehen: 'kann noch ziehen', aufbauen: 'kann noch aufbauen', abbauen: 'kann noch abbauen', gebruell: 'Löwengebrüll noch frei' };
    if (NOCH[gr]) hints.push(`<i>Aktion verbraucht,</i> ${NOCH[gr]} – noch nicht fertig. „Fertig“ hakt sie ab.`); }   // F88 (2026-11-22): warum noch kein Haken
  if (!spent.has(sel.id) && TYPES[sel.type].zweit && !sel.zw && E.zweitTargets(G, sel).length) hints.push('<i>Zweitwaffe noch frei:</i> ' + (TYPES[sel.type].zweit.name || 'Zweitwaffe') + ' kann diese Runde noch feuern.');   // F17
  // Hinweiszeile
  if (sel.supp > 0) hints.push('▼ Niedergehalten: bleibt liegen, kann weder ziehen, schießen noch stürmen.');
  else if (sel.abgeprotzt && sel.attacked && !sel.limbered) hints.push('<i>Gerade abgeprotzt:</i> Das kostet bei Geschützen den Schuss dieser Runde – ab der nächsten Runde feuerbereit.');   // SP-1 (84.11): Grund statt stummem Grau
  else if (TYPES[sel.type].mg && sel.setup && spent.has(sel.id)) hints.push('<i>MG aufgebaut,</i> aber kein Gegner in Reichweite und Sicht (auch nicht nach Drehen).');
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
    $('upMark').innerHTML = crest(u.side); medaillenZeigen(u);
    $('hudName').textContent = T.name;
    { const r = rolle(u.type); $('hudName').title = r ? `${r.rolle}${r.stark.length ? ' · stark gegen ' + r.stark.join(', ') : ''}${r.schwach.length ? ' · schwach gegen ' + r.schwach.join(', ') : ''}` : ''; }
    $('hudSub').innerHTML = `<i class="${u.side}">${SIDES[u.side].short}</i>${rolle(u.type) ? ` · <em class="rl">${rolle(u.type).rolle}</em>` : ''}${u.officer ? ` · ${UP.orden ? `<img class="up-orden" src="${UP.orden}" alt="Anführer">` : '★ '}${u.officer}` : ''} · ${h.river && h.t === 'canal' ? 'Fluss' : TERRAIN[h.t].name}${h.ridge ? ' (Höhe)' : ''}`;
    // Zeile mit ALLEN Zuständen als Symbole (Deckung zuerst), Tooltip je Symbol
    { const d = DU.get(u.id), cv = coverTip(u);
      hudTips = [cv && { ...cv, img: UP['cov' + cv.tier], cls: 'cov' }, ...statesOf(u, d).map(st => st.blockiert && st.blockiert(u, d) ? { name: st.name + ' (blockiert)', text: st.textBlock(u, d), img: upSym(st.sym), cls: 'blockiert' } : { name: st.name, text: st.text(u, d), img: upSym(st.sym), cls: st.k === 'supp' ? 'gross' : '' })].filter(Boolean);
      $('hudStates').innerHTML = hudTips.map((t, i) => `<span class="up-st${t.cls ? ' ' + t.cls : ''}" data-i="${i}" tabindex="0" aria-label="${upEsc(t.name)}"><img src="${t.img}" alt=""></span>`).join(''); }
    const own = u.side === G.side && E.active(u), ap = Math.max(0, u.ap || 0);
    const hn = hudHN[u.id] = hudHN[u.id] || {}; hpNach(hn, u.str); setTimeout(() => hudNachLauf(u.id), 0);
    $('hudStats').innerHTML = upBar('hp ' + lifeTier(u.str / 10), 'Leben', u.str, 10, hpNachV(hn._hn, performance.now())) + upBar('mor' + (u.mor < P.FALLBACK_MOR + 1 ? ' bad' : ''), 'Moral', u.mor, T.mor) +
      `<div class="up-tiles"><span class="up-t" title="Bewegungspunkte: ${own ? `noch ${u.bp || 0} von ${E.bpMax(u)}` : E.bpMax(u)}. Gelände kostet 1–3; Marsch (Stiefel mit Flügeln) gibt für die Aktion +50 %."><img src="${upSym('stiefel')}" alt="Bewegung"><small class="up-wort">Bewegung</small> ${own ? (u.bp || 0) : E.bpMax(u)}<small>${own ? ' / ' + E.bpMax(u) : ''}</small></span>` +
      (own ? `<span class="up-t" title="Aktion: ${ap ? 'noch frei' : 'verbraucht'} – Schießen, Nahkampf, Befehl, Fähigkeit oder Marsch${T.zweit ? `; kleine Münze: ${T.zweit.name}, einmal je Runde zusätzlich` : ''}"><img src="${upSym('blitz')}" alt="Aktion"><small class="up-wort">Aktion</small> <b class="up-akt${ap ? '' : ' used'}">${ap ? 'frei' : 'verbraucht'}</b><i class="up-pip${ap ? '' : ' used'}"></i>${T.zweit ? `<i class="up-pip klein${sel && sel.zw ? ' used' : u.zw ? ' used' : ''}"></i>` : ''}</span>` : '') +
      `<span class="up-t" title="Reichweite"><img class="wide" src="${upSym('gewehr')}" alt="Reichweite">${T.rng ? `${T.rng} <small>${T.rng === 1 ? 'Feld' : 'Felder'}</small>` : '–'}</span></div>`;
    $('btnInfo').hidden = false;
    if (previewT && sel && !targets.has(previewT.id)) previewT = null;   // Vorschau-Ziel ist keins mehr (z. B. nach Eingraben): Vorschau weg statt Absturz
    if (previewT && sel) {
      const t = targets.get(previewT.id), p = E.preview(G, sel, previewT, t.kind);
      hints.push(`<b>${t.kind === 'fire' ? 'Beschuss' : 'Nahkampf'} → ${TYPES[previewT.type].name}</b> Schaden ≈ <i>${fmt(p.dmg)}</i>${t.kind === 'fire' ? '' : ` · Gegenschlag ≈ <i>${fmt(p.counter)}</i>`} · ${p.tags.join(' · ') || 'keine Zu- oder Abschläge'} · <em>${lastPT === 'mouse' ? 'Klicken' : 'Nochmal tippen'} zum Angreifen</em>`);
    }
    if (sel && human(sel.side) && sel.side === G.side) btns = unitButtons(T, hints);
    else if (!hints.length) hints.push(T.can);
  } else {
    medaillenZeigen(null); $('portrait').hidden = true; $('btnInfo').hidden = true; $('hudStats').innerHTML = ''; $('upMark').innerHTML = ''; $('hudStates').innerHTML = ''; hudTips = [];
    if (placing) {
      $('hudName').textContent = 'Nachschub: ' + TYPES[placing].name;
      $('hudSub').innerHTML = 'Aufstellen';
      hints.push('Tippe ein grünes Feld am eigenen Rand oder an einem eigenen Zielfeld an. Die Einheit kann ab der nächsten Runde handeln.');
    } else if (inspect && inspect.hex) {
      const h = G.map[inspect.hex[0]][inspect.hex[1]], T = TERRAIN[h.t], o = OBJECTIVES.find(x => x.c === inspect.hex[0] && x.r === inspect.hex[1]);
      $('hudName').textContent = (h.river && h.t === 'canal' ? 'Fluss' : T.name) + (h.ridge ? ' auf der Höhe' : '');
      $('hudSub').innerHTML = o ? `Zielfeld: ${o.name} · ${o.pts} Punkte` : 'Gelände';
      hints.push(`${h.river && h.t === 'canal' ? 'Nicht passierbar, nur über Brücken und Furten.' : T.info}${h.road ? ' Hier verläuft eine Straße.' : ''}${h.rail ? ' Hier verläuft die Bahnlinie.' : ''}${h.ridge ? ' Höhe: Fernkampf +1 Reichweite.' : ''}${E.cloudAt(G, inspect.hex[0], inspect.hex[1]) ? ' Gaswolke: schadet jeder Einheit, die hier ihren Zug beginnt.' : ''}${E.smokeAt(G, inspect.hex[0], inspect.hex[1]) ? ' Nebelwand: wer hier steht, wird kaum getroffen (×0,5) und schießt nur schwach heraus (×0,75); durch den Nebel sieht niemand.' : ''}${chronikHtml(T, 'span')}`);
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
  if (G.aufstellung && hasU) {   // F6 (2026-11-20): in der Aufstellung nur der Startzustand – Geschütz auf-/abgeprotzt, MG auf-/abgebaut
    const T = TYPES[u.type]; btns = []; hints.length = 0;
    if (T.cls === 'art' && T.limber) btns.push({ act: 'st-limber', sym: u.limbered ? 'aufprotzen' : 'abprotzen', name: u.limbered ? 'Start: aufgeprotzt' : 'Start: abgeprotzt', on: !!u.limbered, costTxt: 'kostet nichts', text: u.limbered ? 'Beginnt angespannt: kann sofort ziehen, schießt aber erst nach dem Abprotzen. Antippen: abgeprotzt beginnen.' : 'Beginnt in Stellung: schießt sofort, zieht erst nach dem Aufprotzen. Antippen: aufgeprotzt beginnen.' });
    if (T.mg) btns.push({ act: 'st-mg', sym: u.setup ? 'mg_auf' : 'mg_ab', name: u.setup ? 'Start: aufgebaut' : 'Start: abgebaut', on: !!u.setup, costTxt: 'kostet nichts', text: u.setup ? 'Beginnt in Stellung: schießt und gibt Sperrfeuer, zieht erst nach dem Abbauen. Antippen: abgebaut beginnen.' : 'Beginnt marschbereit: kann sofort ziehen, schießt erst nach dem Aufbauen. Antippen: aufgebaut beginnen.' });
    if (T.fessel) btns.push({ act: 'st-ballon', sym: u.eingeholt ? 'einholen' : 'fernglas', name: u.eingeholt ? 'Start: eingeholt' : 'Start: oben', on: !u.eingeholt, costTxt: 'kostet nichts', text: u.eingeholt ? 'Beginnt eingeholt: kann sofort ziehen, sieht aber nur 4 Felder. Antippen: oben beginnen.' : 'Beginnt in der Luft: sieht weit und markiert Ziele, zieht erst nach dem Einholen. Antippen: eingeholt beginnen.' });   // Punkt 2 (2026-11-24)
    btns.push({ act: 'st-dreh-l', sym: 'drehpfeil', name: 'Blick nach links drehen', costTxt: 'kostet nichts', text: 'Startblickrichtung um 60° nach links drehen (wichtig für MG-Schussfeld und Fahrzeuge).' }, { act: 'st-dreh-r', sym: 'drehpfeil', mirror: true, name: 'Blick nach rechts drehen', costTxt: 'kostet nichts', text: 'Startblickrichtung um 60° nach rechts drehen.' });
    { const r = rolle(u.type), ab = T.abil && E.ABILS[T.abil] ? E.ABILS[T.abil].name : null;   // Punkt 2: wen stelle ich wohin – Rolle, Reichweite, Fähigkeiten
      hints.push(`${r ? '<b>' + r.rolle + '</b> · ' : ''}${T.rng ? 'Reichweite ' + felder(T.rng) : 'nur Nahkampf'}${ab ? ' · Fähigkeit: ' + ab : ''}${(T.sp || []).length ? ' · ' + T.sp.slice(0, 4).join(' · ') : ''}`); }
    hints.push('<i>Aufstellung:</i> Startzustand und Blickrichtung mit den Knöpfen wählen; über einem Feld zeigt die Karte Reichweite bzw. Schussfeld von dort.');
    hn.innerHTML = hints.filter(Boolean).join(' · '); hn.title = hn.textContent;   // Hinweiszeile wurde oben schon geschrieben
  }
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
// F66 (2026-11-21): Medaillen unter dem Bild – gegen Infanterie, gegen Panzer, Nahkampf; Bronze ×0,5 (bzw. wirkungslos), Silber ×1, Gold ×1,5. Alles aus E.medaillen (dieselben Werte wie die Regeln)
let medTips = [];
const MED_STUFE = { gold: 'Gold – stark', silber: 'Silber – normal', bronze: 'Bronze – schwach', keine: 'keine – kann das nicht' };
const fx10 = f => '×' + String(+f.toFixed(2)).replace('.', ',');
function medaillenTexte(t) {
  const m = E.medaillen(t), T = TYPES[t], W = E.WAFFE_NAME, wa = m.waffe;
  return [
    { k: 'inf', sym: 'gewehr', name: 'Gegen Infanterie: ' + MED_STUFE[m.inf], text: m.inf === 'keine' ? 'Kein Fernkampf.' : `${W[wa]} gegen ungepanzerte Ziele ${fx10(m.fInf)}.` },
    { k: 'panzer', sym: 'gegen_panzer', name: 'Gegen Panzer: ' + MED_STUFE[m.panzer], text: m.panzer === 'keine' ? (wa ? `${W[wa]} ist gegen schwere Panzerung wirkungslos.` : 'Kann Panzern nichts anhaben.') : (m.fPz > (wa ? E.FAK[wa].S : 0) ? (T.abil === 'pzgranate' ? `Panzergranate (Fähigkeit, 1–2 Felder) gegen Fahrzeuge und Schreiter ${fx10(m.fPz)}.` : T.abil === 'charge' ? `Haftladung (Fähigkeit) gegen Fahrzeuge und Schreiter ${fx10(m.fPz)}.` : `Nahkampf gegen Fahrzeuge und Schreiter ${fx10(m.fPz)}.`) : `${W[wa]} gegen schwere Panzerung ${fx10(m.fPz)}.`) },
    { k: 'nah', sym: 'nahkampf', name: 'Nahkampf: ' + MED_STUFE[m.nah], text: m.nah === 'keine' ? 'Kämpft nicht im Nahkampf.' : m.rolle === 'schwach' ? 'Schwach im Nahkampf: Angreifer ×1,5 gegen sie, Gegenschlag ×0,5.' : m.rolle === 'stark' ? 'Stark im Nahkampf: Gegenschlag ×1,25.' + (m.fNah >= 1.5 && E.waffeArt(t, false) === 'schwer' ? ' Schwerer Nahkampf gegen Fußtruppen ×1,5.' : '') : `${W[E.waffeArt(t, false)]} gegen Fußtruppen ${fx10(FAKN(t))}.` },
    { k: 'klasse', name: 'Panzerung: ' + E.KLASSE_NAME[m.klasse], text: m.klasse === 'S' ? 'Gewehre und MG prallen ab; Panzerbüchsen und Kanonen wirken voll, Granaten halb.' : m.klasse === 'L' ? 'Gewehr, MG und Klingen nur halb; panzerbrechende Waffen ×1,5.' : 'Volle Wirkung aller Waffen.' } ];
}
const FAKN = t => E.FAK[E.waffeArt(t, false)].U;
function medaillenZeigen(u) {
  let box = $('upMed'); if (!box) { box = document.createElement('div'); box.id = 'upMed'; box.className = 'up-med'; document.querySelector('#hud .up-pic').after(box);
    const at = e => e.target.closest('.med'), show = (el, ms) => { const t = medTips[+el.dataset.i], r = el.getBoundingClientRect(); if (t) showTip([t], r.left + r.width / 2, r.top, 'med' + t.name, ms); };
    box.addEventListener('pointerover', e => { const el = at(e); if (el && e.pointerType === 'mouse') show(el); });
    box.addEventListener('pointerout', e => { if (at(e) && e.pointerType === 'mouse') hideTip(); });
    box.addEventListener('pointerdown', e => { const el = at(e); if (el && e.pointerType !== 'mouse') show(el, 3500); });
    box.addEventListener('focusin', e => { const el = at(e); if (el) show(el); }); box.addEventListener('focusout', hideTip); box.addEventListener('contextmenu', e => e.preventDefault()); }
  if (!u) { box.innerHTML = ''; medTips = []; return; }
  const m = E.medaillen(u.type); medTips = medaillenTexte(u.type);
  box.innerHTML = medTips.slice(0, 3).map((t, i) => `<span class="med ${m[t.k]}" data-i="${i}" tabindex="0" aria-label="${upEsc(t.name)}">${upSym(t.sym) ? `<img src="${upSym(t.sym)}" alt="">` : ''}</span>`).join('');
}
{ const box = $('hudStates'), at = e => e.target.closest('.up-st'), show = (el, ms) => { const t = hudTips[+el.dataset.i], r = el.getBoundingClientRect(); if (t) showTip([t], r.left + r.width / 2, r.top, 'hud' + el.dataset.i + t.name, ms); };
  box.addEventListener('pointerover', e => { const el = at(e); if (el && e.pointerType === 'mouse') show(el); });
  box.addEventListener('pointerout', e => { if (at(e) && e.pointerType === 'mouse') hideTip(); });
  box.addEventListener('pointerdown', e => { const el = at(e); if (el && e.pointerType !== 'mouse') show(el, 3500); });
  box.addEventListener('focusin', e => { const el = at(e); if (el) show(el); }); box.addEventListener('focusout', hideTip);
  box.addEventListener('contextmenu', e => e.preventDefault()); }
// Löwengebrüll des Kreuzschreiters (Ereignis 'roar', 2026-11-20): Ton (roar05 mit Roboterfilter), Ringe, Schreckstriche über den getroffenen Gegnern
function loewenGebruell(u, ids) {
  const d = DU.get(u.id); if (!d) return;
  playSound('loewe', 0.6, null, { u });
  if (!(BW && fxIm('faehigkeiten', 1))) { rings.push({ x: d.x, y: d.y, r: 1.6, col: '#E2B04A', life: 40, max: 40 }); rings.push({ x: d.x, y: d.y, r: 2.6, col: '#E2B04A', life: 52, max: 52 }); }   // Paket D: gelbe Ringe nur noch, wenn der gemalte Bogen fehlt
  for (const id of ids || []) { const f = DU.get(id); if (f) { f.vs.angst = true; kz(id, 'angst', 'puls'); } }   // Kopfzeichen „verängstigt“
  gebruellFx(u.id, ids, 1);
}
// F82 (2026-11-21): Fähigkeits-Effekte, dezent und gemalt; Bildwirkung „aus“ = keine, „leicht“ = weniger.
// Gebrüll: Comic-Schallwellen (Bögen mit Tintenkontur) vom Maul, rot-goldenes Glühen, Staub nach vorn, Gegner zucken zurück.
const SCHALL = [];   // { m: [x, y] Maul, fuss, dir, t0, dauer, n, stark }
function maulPunkt(id) {   // Kreuzschreiter: Löwenmaul = Mündung der Hauptwaffe; sonst Kopfhöhe an der Vorderkante der Figur
  const d = DU.get(id), u = unitById(id); if (!d || !u) return null;
  if (u.type === 'kreuz') { const p = fxMuzzle(id); if (p) return p; }
  const bs = d.fbx || []; if (!bs.length) return [d.x, d.y - L.s * 0.9];
  const lf = facesLeft(d.face); let [x0, y0, w, h, fl] = bs[0]; if (!!fl !== lf) x0 = -(x0 + w);
  return [d.x + (lf ? x0 + w * 0.15 : x0 + w * 0.85), d.y + y0 + h * 0.16];
}
function gebruellFx(id, ziele, stark, ohneRing) {
  if (!BW) return; const d = DU.get(id), m = maulPunkt(id); if (!d || !m) return;
  const dir = facesLeft(d.face) ? -1 : 1, n = BW === 1 ? 2 : 3;
  const FB = fxIm('faehigkeiten', 0) && fxIm('faehigkeiten', 1);   // Paket D (2026-11-24): Tintenbogen fx_faehigkeiten – Kegel in Blickrichtung, Staubringe am Boden; die glatten Gold-Bögen entfallen
  if (FB) { const k = stark ? 1.05 : 0.62;
    const dyM = unitById(id) && unitById(id).type === 'kreuz' ? L.s * 0.55 : 0;   // Punkt 41: beim Kreuzschreiter liefert maulPunkt die Kanonenmündung über dem Maul
    fx('faehigkeiten', 0, m[0] - dir * L.s * 0.04, m[1] + dyM, { anchor: 'links', flip: dir < 0, life: 44 + 10 * stark, mul: k, grow: 0.55, fadeIn: 2, fadeOut: 0.65, fuss: [d.x, d.y] });
    if (!ohneRing) for (let q = 0; q < (stark ? 2 : 1); q++) fx('faehigkeiten', 1, d.x, d.y + L.s * 0.02, { anchor: 'mitte', boden: true, delay: q * 9, life: 46, mul: (stark ? 0.75 : 0.5) + q * 0.25, grow: 0.9, alpha: 0.95, fadeOut: 0.7 }); }
  else SCHALL.push({ m: [m[0], m[1]], fuss: [d.x, d.y], dir, t0: now, dauer: 1100 + 300 * stark, n: stark ? n : 2, stark });
  if (stark) { shake(BW === 1 ? 3 : 5); for (let q = 0; q < (BW === 1 ? 2 : 4); q++) boom(d.x + dir * L.s * (0.6 + q * 0.35), d.y + (Math.random() - 0.5) * L.s * 0.3, L.s * 0.35, 'dust', q * 5); }
  for (const zid of ziele || []) { const f = DU.get(zid); if (!f) continue; pose(zid, 'getroffen', 380);
    const ex = Math.sign(f.x - d.x) || dir; f.lunge = { dx: ex * L.s * 0.08, dy: 0 }; setTimeout(() => { if (f.lunge && f.lunge.dx === ex * L.s * 0.08) f.lunge = null; }, 320 / speed); }
}
function drawSchall(g, s, up) {
  for (let i = SCHALL.length - 1; i >= 0; i--) {
    const w = SCHALL[i], el = (now - w.t0) * speed; if (el > w.dauer) { SCHALL.splice(i, 1); continue; }
    if (up && !up(w.fuss[0], w.fuss[1])) continue;
    const [mx, my] = w.m, amp = BW === 1 ? 0.65 : 1;
    if (el < 380) { const k = 1 - el / 380, gr = g.createRadialGradient(mx, my, 0, mx, my, s * 0.55);   // kurzes rot-goldenes Glühen am Maul
      gr.addColorStop(0, `rgba(255,196,90,${0.55 * k * amp})`); gr.addColorStop(0.5, `rgba(200,60,30,${0.3 * k * amp})`); gr.addColorStop(1, 'rgba(200,60,30,0)');
      g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = gr; g.beginPath(); g.arc(mx, my, s * 0.55, 0, 7); g.fill(); g.restore(); }
    for (let q = 0; q < w.n; q++) {   // gezeichnete Bögen, nacheinander, breiten sich aus und verblassen
      const k = (el - q * 170) / (w.dauer - q * 170); if (k <= 0 || k >= 1) continue;
      const rad = s * (0.25 + (w.stark ? 2.1 : 1.2) * k), a0 = w.dir > 0 ? 0 : Math.PI, sp = 0.55 + 0.1 * q, al = (1 - k) * amp;
      g.save(); g.lineCap = 'round';
      g.beginPath(); g.arc(mx, my, rad, a0 - sp, a0 + sp); g.strokeStyle = `rgba(22,18,12,${0.75 * al})`; g.lineWidth = Math.max(3, s * (0.1 - 0.035 * k)); g.stroke();   // Tintenkontur
      g.beginPath(); g.arc(mx, my, rad, a0 - sp * 0.96, a0 + sp * 0.96); g.strokeStyle = q === 0 ? `rgba(232,180,74,${al})` : `rgba(214,96,48,${0.9 * al})`; g.lineWidth = Math.max(2, s * (0.055 - 0.02 * k)); g.stroke();
      g.restore(); }
  }
}
// Gasschutz: blassgrüner Dunst um Figuren und Füße, langsam pulsierend. Beim Entgiften kräftig (mit Dampfstößen aus den Filtern),
// sonst ganz fein um den Trupp und die geschützten Nachbarn (E.gasSafe: Feld daneben), solange Gas in der Nähe ist.
const NIMBUS = [];   // { id, t0, dauer }
function gasschutzFx(id) {
  if (!BW) return; const d = DU.get(id); if (!d) return; NIMBUS.push({ id, t0: now, dauer: 3200 });
  if (fxN('filterdampf') && !window.E3_ALT) for (let q = 0; q < (BW === 1 ? 2 : 3); q++) { const f = (d.fbx || [])[q % Math.max(1, (d.fbx || []).length)], fx0 = f ? d.x + f[0] + f[2] * (0.3 + Math.random() * 0.4) : d.x + (Math.random() - 0.5) * L.s * 0.5, fy0 = f ? d.y + f[1] + f[3] * 0.35 : d.y - L.s * 0.55; fx('filterdampf', null, fx0, fy0, { fuss: [d.x, d.y], delay: q * 16, life: 100, mul: 0.3 + Math.random() * 0.08, grow: 0.7, rise: 0.5, alpha: 0.6, fadeIn: 10, fadeOut: 0.7, flip: Math.random() < 0.5 }); }   // U3 E3 (Punkt 62): Dampfschwaden steigen aus den Filtern; Rückweg window.E3_ALT
  for (let q = 0; q < (BW === 1 ? 2 : 4); q++) setTimeout(() => { const d2 = DU.get(id); if (d2) burst(d2.x + (Math.random() - 0.5) * L.s * 0.5, d2.y - L.s * (0.55 + Math.random() * 0.2), 5, ['#dfe9d4', '#c9d8bd', '#eef3e8'], { up: 0.06, spread: 0.06 }); }, (150 + q * 420) / speed);
}
// Helden-Aura (2026-11-21, entwurf/HELDEN_PROMPTS.md): Rote Faust – dunkelrote Glut am Boden, aufsteigende Funken; Kürassier – kalter, bleicher Bodennebel,
// fallende Ascheflocken, Gegner daneben mit dünnem kaltem Schimmer. Beim Spezialschlag kurz aufflammend bzw. kaltes Aufblitzen (heldBlitz).
const HBLITZ = [];   // { id, art, t0 }
function heldBlitz(id, art) { if (BW) HBLITZ.push({ id, art, t0: now }); }
// F84 (2026-11-21): Ofen-Glut der Roten Faust – wenige glühende Funken aus Brusthöhe (Ofenkern am Rücken), gelb-oranger Kern mit weichem Schein,
// flackernd, steigen auf, treiben leicht zur Seite und verlöschen (vorher harte rote Punkte, die wie Tropfen wirkten)
const GLUT = [];   // { id, t0, dauer, ox, vx, gr }
// U3 (Punkt 118.3): Helden-Effekte an der Figur (Glut, Dampfstoß, Funken, Aufblitzen) mit Figurenfaktor – Höhe des gezeichneten Heldenmodells
// gegen die Malhöhe 0,75 Feldradien (1,5 SH), für die sie gebaut wurden; Ringe/Druckwellen am Boden bleiben feldgroß. Rückweg window.FIGFAK_ALT.
const HELD_H = 0.75;
function heldFak(id) { if (window.FIGFAK_ALT) return 1; const d = DU.get(id), b = d && d.fbx && d.fbx[0]; return b ? Math.max(0.6, Math.min(1.6, b[3] / (HELD_H * L.s))) : 1; }
function drawGlut(g, s, up) {
  for (let i = GLUT.length - 1; i >= 0; i--) { const p = GLUT[i], el = (now - p.t0) * speed, d = DU.get(p.id); if (el > p.dauer || !d) { GLUT.splice(i, 1); continue; }
    if (up && !up(d.x, d.y)) continue; const k = el / p.dauer, b = d.fbx && d.fbx[0], y0 = b ? d.y + b[1] + b[3] * 0.16 : d.y - s * 1.2, x0 = b ? d.x + b[0] + b[2] * (facesLeft(d.face) ? 0.74 : 0.26) : d.x;   // Ofen auf dem Rücken (Schornstein)
    const hf = heldFak(p.id), x = x0 + (p.ox * 0.4 + p.vx * k + Math.sin(el / 230 + p.t0) * 0.04) * s * hf, y = y0 - k * s * 1.1 * hf, fl = 0.7 + 0.3 * Math.sin(el / 45 + p.t0), a = (k < 0.15 ? k / 0.15 : 1 - (k - 0.15) / 0.85) * fl * (BW === 1 ? 0.7 : 1);
    const rr = s * 0.045 * p.gr * (1 - 0.5 * k) * hf, gr = g.createRadialGradient(x, y, 0, x, y, rr * 2.6);
    gr.addColorStop(0, `rgba(255,236,170,${a})`); gr.addColorStop(0.25, `rgba(255,170,60,${0.85 * a})`); gr.addColorStop(0.6, `rgba(220,80,20,${0.3 * a})`); gr.addColorStop(1, 'rgba(160,40,10,0)');
    g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = gr; g.beginPath(); g.arc(x, y, rr * 2.6, 0, 7); g.fill(); g.restore(); }
}
// Heldenfunken (fx_heldenfunken, Enrico 2026-11-22): 1 blauer Strich, 2 blau-weißer Einschlag, 3 kaltes Leuchten (Kürassier); 4 oranger Einschlag, 5 oranger Strich, 6 Glutsprenkel (Rote Faust)
function heldFunken(n, x, y, o = {}) { if (!BW && n !== 2 && n !== 4) return; fx('heldenfunken', n, x, y, { anchor: 'mitte', life: 22, mul: (o.mul || 0.6) * (BW === 1 ? 0.85 : 1), grow: 0.15, fadeOut: 0.6, ...o }); }
// Kettenschwert des Kürassiers trifft (Enrico 2026-11-22, ElevenLabs): gegen Gepanzerte Metall, gegen Fußtruppen Fleisch
function kschwertTon(id) { const x = unitById(id), T = x && TYPES[x.type]; return T && (T.suit || T.cls === 'walker') ? 'held_kschwert_metall' : 'held_kschwert_fleisch'; }
// F86 (2026-11-21): Auftritt der Heldenfähigkeiten – große Einblendung (heldTitel, #heldTitel), Druckwelle/Ring am Boden (heldRing),
// Dampf aus der Faust, Staubschleppe, Ziel fliegt zurück (flugZurueck), Auren pulsieren beim ersten Auslösen je Runde (auraPuls)
function heldName(id) { const u = unitById(id); return u ? TYPES[u.type].name : ''; }
// F87 (2026-11-21): erst Schrift, dann Schlag – der große Titel steht ca. 1 s und ist ausgeblendet, bevor Ausholen und Schlag beginnen
// (Rückgabe = Dauer in ms, der Ablauf wartet sie ab); die kleinen Aura-Titel stehen oben unter der Leiste, nicht über den Figuren
function heldTitel(text, art, wer) {
  const el = $('heldTitel'); if (!el) return 0; const klein = art.includes('klein');
  if (klein && /\ban\b/.test(el.className) && !el.className.includes('klein')) return 0;   // großer Titel läuft: Aura-Titel auslassen
  const dur = speed >= INSTANT ? 500 : Math.round((klein ? 1600 : 1000) / Math.sqrt(speed));
  el.innerHTML = `${wer ? `<span>${upEsc(wer)}</span>` : ''}<b>${upEsc(text)}</b>`; el.className = art; void el.offsetWidth;
  el.style.animationDuration = dur + 'ms'; el.className = art + ' an'; clearTimeout(el._t); el._t = setTimeout(() => { el.className = art; }, dur + 50); return dur;
}
async function heldTitelErst(ksz, text, art, wer) { const ms = heldTitel(text, art, wer); if (ms && !(ksz && ksz.skip) && speed < INSTANT) await new Promise(r => setTimeout(r, ms)); }
const HRING = [];   // { x, y, t0, dauer, art, gross }
function heldRing(x, y, art, gross) {   // Paket D: gemalte Druckwelle (Faust) bzw. Furcht-Ring mit Rauchklauen (Kürassier); glatter Ring nur noch, wenn das Bild fehlt
  const i = art === 'faust' ? 2 : 4; if (BW && fxIm('faehigkeiten', i)) { fx('faehigkeiten', i, x, y + L.s * 0.02, { anchor: 'mitte', boden: true, life: gross ? 54 : 46, mul: gross ? 0.95 : 0.6, grow: gross ? 0.55 : 0.4, alpha: 0.95, fadeIn: 1, fadeOut: 0.6 }); if (gross) boom(x, y, L.s * 0.6, 'dust'); return; }
  HRING.push({ x, y, t0: now, dauer: gross ? 720 : 950, art, gross }); }
function drawHeldRinge(g, s, up) {
  const amp = BW === 0 ? 0.55 : BW === 1 ? 0.8 : 1;
  for (let i = HRING.length - 1; i >= 0; i--) { const w = HRING[i], el = (now - w.t0) * speed; if (el > w.dauer) { HRING.splice(i, 1); continue; } if (up && !up(w.x, w.y)) continue;
    for (let q = 0; q < (w.gross ? 2 : 1); q++) { const k = (el - q * 120) / (w.dauer - q * 120); if (k <= 0 || k >= 1) continue;
      const e = 1 - Math.pow(1 - k, 2.2), rad = s * (0.3 + (w.gross ? 1.9 : 1.15) * e), al = (1 - k) * amp * (q ? 0.6 : 1), warm = w.art === 'faust';
      g.save(); g.lineCap = 'round';
      if (w.gross && q === 0) { const gr = g.createRadialGradient(w.x, w.y, rad * 0.45, w.x, w.y, rad * 1.05); gr.addColorStop(0, 'rgba(140,112,84,0)'); gr.addColorStop(0.8, `rgba(150,120,90,${0.42 * al})`); gr.addColorStop(1, 'rgba(150,120,90,0)');
        g.fillStyle = gr; g.beginPath(); gEllipse(g, w.x, w.y, rad * 1.05, rad * 1.05); g.fill(); }   // Staubschleier der Druckwelle
      g.beginPath(); gEllipse(g, w.x, w.y, rad, rad); g.strokeStyle = `rgba(20,14,10,${0.72 * al})`; g.lineWidth = Math.max(3, s * (w.gross ? 0.13 : 0.08) * (1 - 0.6 * k)); g.stroke();   // Tintenkontur
      g.beginPath(); gEllipse(g, w.x, w.y, rad, rad); g.strokeStyle = warm ? `rgba(255,${w.gross ? 196 : 150},${w.gross ? 120 : 60},${al})` : `rgba(206,228,246,${al})`; g.lineWidth = Math.max(2, s * (w.gross ? 0.065 : 0.042) * (1 - 0.6 * k)); g.stroke();
      g.restore(); } }
}
const AURA_PULS = new Set();
function auraPuls(id, art) {   // Aura hat gewirkt: einmal je Held und Runde Ring, Aufblitzen und kleine Einblendung
  if (!G) return; const k = id + ':' + G.turn + ':' + G.side; if (AURA_PULS.has(k)) return; AURA_PULS.add(k); const d = DU.get(id); if (!d) return;
  heldRing(d.x, d.y, art, false); heldBlitz(id, art === 'faust' ? 'glut' : 'kalt'); { const hf = heldFak(id); heldFunken(art === 'faust' ? 6 : 3, d.x, d.y - L.s * 0.75 * hf, { mul: 0.5 * hf, life: 30 }); } heldTitel(art === 'faust' ? 'Standhaft' : 'Furcht', art + ' klein', heldName(id));
}
function faustDampf(id, st) {   // Dampfstoß aus Faust und Ofen
  const d = DU.get(id); if (!d) return; const b = d.fbx && d.fbx[0], lf = facesLeft(d.face), s = L.s * heldFak(id);   // U3: Dampf nach Figurhöhe
  const x = b ? d.x + b[0] + b[2] * (lf ? 0.15 : 0.85) : d.x + (lf ? -1 : 1) * s * 0.4, y = b ? d.y + b[1] + b[3] * 0.5 : d.y - s * 0.6;
  for (let q = 0; q < (BW >= 2 ? 3 : 2); q++) { const e = fx('rauch', null, x + (lf ? -1 : 1) * q * s * 0.12, y, { delay: q * 4, move: [x + (lf ? -1 : 1) * s * (0.3 + q * 0.15), y - s * 0.25], life: 60 + q * 10, mul: 0.22 * st + q * 0.04, grow: 1.1, rise: 0.5, alpha: 0.55, fadeIn: 3, fadeOut: 0.7, flip: lf, filter: 'brightness(2.1) saturate(0.2)' }); if (e) e.dampf = true; }
  if (!(BW && fxIm('faehigkeiten', 3))) burst(x, y, BW >= 2 ? 8 : 5, ['#f2efe8', '#dcd8cf', '#ffffff'], { up: 0.03, spread: 0.07 });   // flache weiße Kreise nur noch ohne gemalten Dampfstoß (Punkt 40)
  if (BW && fxIm('faehigkeiten', 3)) fx('faehigkeiten', 3, x + (lf ? -1 : 1) * s * 0.75 * st, y, { anchor: 'mitte', flip: lf, life: 40, mul: 0.3 + 0.32 * st, grow: 0.5, alpha: 0.9, fadeIn: 1, fadeOut: 0.65, fuss: [d.x, d.y] });   // Paket D: gemalter Dampfstoß
}
function staubSchleppe(id) { let an = true; (async () => { while (an) { const d = DU.get(id); if (d) boom(d.x, d.y + L.s * 0.12, L.s * 0.24, 'dust'); await wait(70); } })(); return () => { an = false; }; }
const FLUG = new Map();   // K7 (2026-11-22): id → Zeitpunkt; nur der direkt folgende Rückstoß fliegt, in startGame geleert
async function flugZurueck(id, path) {   // Ziel des Durchbruchs fliegt im Bogen ein Feld zurück und schlägt auf
  const d = DU.get(id), [x0, y0] = center(path[0][0], path[0][1]), [x1, y1] = center(path[1][0], path[1][1]), dur = 380 / speed, t0 = performance.now(); pose(id, 'getroffen', 900, { von: x0 - (x1 - x0) });   // M7: fliegt vom Stoß weg
  for (let k = 0; k < 1;) { await raf(); k = Math.min(1, (performance.now() - t0) / dur); d.x = x0 + (x1 - x0) * k; d.y = y0 + (y1 - y0) * k; d.lunge = { dx: 0, dy: -Math.sin(Math.PI * k) * L.s * 0.55 }; }
  d.lunge = null; d.x = x1; d.y = y1; playSound('impact', 0.4); shake(5); boom(x1, y1 + L.s * 0.1, L.s * 0.45, 'dust'); fx('truemmer', 2, x1, y1 + L.s * 0.3, { life: 34, mul: 0.5, grow: 0.4, alpha: 0.8, fadeOut: 0.6 });
}
function furchtRing(g, s, u, d, fr, teil, bl = 0) {   // Rauchklauen-Ring der Furcht-Aura mittig unter den Füßen (Punkt 39)
  const p = 0.75 + 0.25 * Math.sin(now / 700 + u.id), amp = BW === 1 ? 0.55 : 1, [w0, h0] = fxDim(fr, 'faehigkeiten', 0.62 * (1 + 0.06 * p + 0.15 * bl));
  g.save(); bodenClip(g, d.y, teil); g.globalAlpha = Math.min(1, (0.35 + 0.25 * p + 0.4 * bl) * amp); g.drawImage(fr, d.x - w0 / 2, d.y - h0 / 2, w0, h0); g.restore(); }
function drawHeldAura(g, s, up) {
  if (!BW || !G) return; const amp = BW === 1 ? 0.55 : 1;
  for (const u of G.units) { const T = TYPES[u.type]; if (!T.held || !E.alive(u)) continue; const d = DU.get(u.id); if (!d || (up && !up(d.x, d.y))) continue;
    const warm = T.aura === 'standhaft', p = 0.75 + 0.25 * Math.sin(now / 700 + u.id); let bl = 0;
    for (let i = HBLITZ.length - 1; i >= 0; i--) { const b = HBLITZ[i], el = (now - b.t0) * speed; if (el > 900) { HBLITZ.splice(i, 1); continue; } if (b.id === u.id) bl = Math.max(bl, 1 - el / 900); }
    const gr = g.createRadialGradient(d.x, d.y, 0, d.x, d.y, s * (0.95 + 0.4 * bl));
    if (warm) { gr.addColorStop(0, `rgba(170,46,20,${(0.24 * p + 0.45 * bl) * amp})`); gr.addColorStop(0.5, `rgba(120,30,14,${(0.14 * p + 0.22 * bl) * amp})`); gr.addColorStop(1, 'rgba(90,20,10,0)'); }   // F84: weicher Schein
    else { gr.addColorStop(0, `rgba(196,212,226,${(0.26 * p + 0.22 * bl) * amp})`); gr.addColorStop(0.6, `rgba(160,178,196,${(0.12 * p + 0.1 * bl) * amp})`); gr.addColorStop(1, 'rgba(160,178,196,0)'); }
    const fr = !warm && fxIm('faehigkeiten', 4);   // Paket D: Furcht-Aura als gemalter Rauchklauen-Ring am Boden (pulsierend) statt kaltem Leuchtkreis; warmer Schein der Faust gedämpft
    if (fr) furchtRing(g, s, u, d, fr, 'unten', bl);
    else { g.save(); if (warm) { g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.6; } g.fillStyle = gr; g.beginPath(); gEllipse(g, d.x, d.y, s * (0.95 + 0.4 * bl), s * (0.95 + 0.4 * bl)); g.fill(); g.restore(); }
    if (warm) { if (Math.random() < (BW === 1 ? 0.025 : 0.05) * Math.min(2, FS) * (1 + 3 * bl)) GLUT.push({ id: u.id, t0: now, dauer: 1300 + Math.random() * 900, ox: (Math.random() - 0.5) * 0.35, vx: (Math.random() - 0.5) * 0.25, gr: 0.6 + Math.random() * 0.6 }); }   // F84: Glutfunken aus dem Ofenkern
    // Punkt 40 (2026-11-24): die „Ascheflocken“ (flache graue Farbkreise über burst) um den Kürassier entfernt – das waren die grauen Pünktchen
    if (T.aura === 'furcht') for (const o of G.units) { if (o.side === u.side || !E.alive(o) || E.dist(o.c, o.r, u.c, u.r) !== 1 || TYPES[o.type].cls === 'walker') continue; const f = DU.get(o.id); if (!f || (up && !up(f.x, f.y))) continue;
      g.save(); g.beginPath(); gEllipse(g, f.x, f.y, s * 0.62, s * 0.62); g.strokeStyle = `rgba(190,214,236,${0.28 * p * amp})`; g.lineWidth = Math.max(1, s * 0.03); g.stroke(); g.restore(); }   // dünner kalter Schimmer
  }
}
function drawNimbus(g, s, up) {
  if (!BW || !G) return;
  const st = new Map(), add = (id, v) => st.set(id, Math.max(st.get(id) || 0, v));
  for (let i = NIMBUS.length - 1; i >= 0; i--) { const n = NIMBUS[i], el = (now - n.t0) * speed; if (el > n.dauer) { NIMBUS.splice(i, 1); continue; }
    const k = Math.min(1, el / 400) * Math.min(1, (n.dauer - el) / 900), u = unitById(n.id); if (!u) continue; add(u.id, k);
    for (const o of G.units) if (o.side === u.side && o.id !== u.id && E.alive(o) && E.dist(o.c, o.r, u.c, u.r) === 1 && TYPES[o.type].cls !== 'walker') add(o.id, k * 0.45); }
  if (VIS.clouds.length) for (const u of G.units) if (TYPES[u.type].gasproof && E.alive(u)) {
    const nah = (c, r) => VIS.clouds.some(k => E.dist(k.c, k.r, c, r) <= 1); if (!nah(u.c, u.r)) continue; add(u.id, 0.35);
    for (const o of G.units) if (o.side === u.side && o.id !== u.id && E.alive(o) && E.dist(o.c, o.r, u.c, u.r) === 1 && TYPES[o.type].cls !== 'walker') add(o.id, 0.18); }
  const amp = BW === 1 ? 0.6 : 1;
  for (const [id, v] of st) { const d = DU.get(id); if (!d || (up && !up(d.x, d.y))) continue;
    const p = (0.75 + 0.25 * Math.sin(now / 520 + id)) * v * amp, cy = d.y - s * 0.4, gr = g.createRadialGradient(d.x, cy, s * 0.1, d.x, cy, s * 0.85);
    gr.addColorStop(0, `rgba(196,222,170,${0.24 * p})`); gr.addColorStop(0.6, `rgba(176,206,150,${0.12 * p})`); gr.addColorStop(1, 'rgba(176,206,150,0)');
    g.save(); g.fillStyle = gr; g.beginPath(); g.ellipse(d.x, cy, s * 0.85, s * 0.75, 0, 0, 7); g.fill();
    g.beginPath(); gEllipse(g, d.x, d.y, s * 0.7, s * 0.7); g.fillStyle = `rgba(186,214,160,${0.2 * p})`; g.fill(); g.restore(); }   // Dunst um die Füße
}
async function panelAct(a) {
  if (a === 'cancel') return cancelPlace();
  if (MODUS_KNOPF.test(a)) { const war = aktModus(); if (war && war !== a && !(a === 'm-he' && war === 'm-he')) modiAus(); }   // Paket A: nur ein Modus
  if (a.startsWith('i-')) { const art = a.slice(2); if (hilfeAn(art)) { hilfeModus = null; updateUI(); return; }   // zweiter Druck schaltet aus
    abilMode = false; hilfeModus = sel ? { art, id: sel.id } : null; toast({ 'i-heal': TYPES[sel.type].repair ? 'Versorgen: Einheit mit Zahnrad anklicken.' : 'Versorgen: Nachbarn mit Sanitätszeichen anklicken.', 'i-send': 'Befehl überbringen: Einheit mit Hundesymbol anklicken.', 'i-rec': 'Bergen: Koloss mit Schraubenschlüssel anklicken.' }[a] || ''); updateUI(); return; }
  if (a === 'st-limber' || a === 'st-mg' || a === 'st-ballon' || a === 'st-dreh-l' || a === 'st-dreh-r') { const u = inspect && inspect.unit; if (!u || !G.aufstellung) return; if (a === 'st-limber') u.limbered = !u.limbered; else if (a === 'st-mg') u.setup = !u.setup; else if (a === 'st-ballon') u.eingeholt = !u.eingeholt; else u.face = (u.face + (a === 'st-dreh-r' ? 1 : 5)) % 6;   // Punkt 2: Ballon und Blickrichtung kostenlos   // F6
    playSound(a === 'st-limber' ? (u.limbered ? 'clank' : 'abprotzen') : 'mgsetup', 0.4, u.side); syncAll(); updateHud(); return; }
  if (a === 'pass') {   // F102 (2026-11-22): jederzeit selbst abhaken (Knopf, Leertaste oder E), danach zur nächsten offenen Einheit; noch einmal = wieder öffnen
    const k = G.turn + G.side + ':' + sel.id, alt = ABGEHAKT.get(k); playSound('klick', 0.5, null);
    if (alt) { Object.assign(sel, alt); ABGEHAKT.delete(k); toast(`${TYPES[sel.type].name}: wieder offen.`); computeOptions(); updateUI(); return; }   // Rückgängig: Stand von vor dem Abhaken
    ABGEHAKT.set(k, { ap: sel.ap, bp: sel.bp, moved: sel.moved, attacked: sel.attacked }); E.pass(G, sel); sel = null; computeOptions(); updateUI();
    if (G.units.some(u => u.side === G.side && E.active(u) && !spent.has(u.id))) nextUnit(false); return; }
  if (a === 'p-melee' || a === 'p-fire') { const v = a.slice(2); atkPref = atkPref === v ? 'auto' : v; const keep = previewT; computeOptions(); previewT = keep && targets.has(keep.id) ? keep : null; updateHud(); return; }
  if (!sel || busy) return;   // Handlungen nur mit gewählter Einheit und nicht während einer laufenden Animation
  if (a === 'o-rally' || a === 'o-storm' || a === 'o-fire') return act(u => E.order(G, u, a.slice(2)));
  if (a === 'big') return act(u => E.bigOrder(G, u));
  if (a === 'plant') return act(u => E.plantBanner(G, u));
  if (a === 'dig') return act(u => E.dig(G, u));
  if (a === 'undig') return act(u => E.undig(G, u));   // F36
  if (a === 'loewe') return act(u => E.roar(G, u));
  if (a === 'shields') return act(u => E.shieldsUp(G, u));
  if (a.startsWith('m-')) { const m = a.slice(2); artMode = m !== 'he' && artMode === m ? 'he' : m; previewT = null; computeOptions();
    if (artMode !== 'he' && !shellHexes.size) { toast(`${m === 'barrage' ? 'Sperrfeuer' : m === 'gas' ? 'Gasgranate' : 'Beschuss'}: kein Zielfeld (Abklingzeit, Reichweite oder keine Sicht).`); artMode = 'he'; computeOptions(); }   // nicht ausführbar: gleich zurück
    updateHud(); return; }
  if (a === 'tl' || a === 'tr') { const nf = (sel.face + (a === 'tr' ? 1 : 5)) % 6; await play(E.turnUnit(G, sel, nf)); computeOptions(); updateHud(); return; }
  if (a === 'faust') { faustErst = null; if (abilMode && feldArt === 'faust') { abilMode = false; feldArt = 'abil'; } else if (!E.faustTargets(G, sel).length) { toast('Faustsalve: kein Ziel in Reichweite.'); } else { abilMode = true; feldArt = 'faust'; } previewT = null; computeOptions(); updateHud(); return; }
  if (a === 'ramm') { const t = E.rammZiele(G, sel); if (t.length === 1) return act(u => E.rammen(G, u, t[0][0], t[0][1]));   // F79: nur ein Gebäude daneben – gleich rammen
    if (abilMode && feldArt === a) { abilMode = false; feldArt = 'abil'; } else if (!t.length) { toast('Rammen: kein Gebäude daneben.'); } else { abilMode = true; feldArt = a; } previewT = null; computeOptions(); updateHud(); return; }
  if (a === 'cut' || a === 'zweit') { const t = a === 'cut' ? E.cutTargets(G, sel) : E.zweitTargets(G, sel);
    if (a === 'cut' && t.length === 1) return act(u => E.cutWire(G, u, t[0][0], t[0][1]));   // nur ein Drahtfeld: gleich schneiden
    if (abilMode && feldArt === a) { abilMode = false; feldArt = 'abil'; } else if (!t.length) { toast(a === 'cut' ? 'Draht schneiden: kein Drahtfeld daneben.' : 'Zweitwaffe: kein Ziel in Reichweite oder Schussfeld.'); } else { abilMode = true; feldArt = a; }
    previewT = null; computeOptions(); updateHud(); return; }
  if (a === 'lay') return act(u => E.layWire(G, u));
  if (a === 'limber') return act(u => E.limber(G, u));
  if (a === 'setup') return act(u => E.setupMG(G, u));
  if (a === 'teardown') return act(u => E.teardownMG(G, u));
  if (a === 'ball-ein') return act(u => E.einholen(G, u));
  if (a === 'ball-auf') return act(u => E.aufsteigen(G, u));   // F70
  if (a === 'abil') { const an = !(abilMode && feldArt === 'abil'); feldArt = 'abil'; abilMode = an && !!E.abilTargets(G, sel).length; if (an && !abilMode) toast(`${(E.ABILS[TYPES[sel.type].abil] || {}).name || 'Fähigkeit'}: gerade kein gültiges Ziel.`); previewT = null; computeOptions(); updateHud(); return; }
  if (a === 'ow') return act(u => E.overwatch(G, u));
  if (a === 'sperr') return act(u => E.sperr(G, u));
}
function showDetail() {
  const u = sel || (inspect && inspect.unit); if (!u) return;
  const T = TYPES[u.type];
  drawPortraitLater($('detPortrait'), figOf(T), u.side, u.type);
  $('detName').textContent = T.name; $('detSide').textContent = SIDES[u.side].name;
  $('detCan').textContent = T.can; $('detQuelle').textContent = T.chronik ? T.chronik.quelle : ''; $('detReal').textContent = T.chronik ? T.chronik.text : '';
  { let rb = $('detRolle'); if (!rb) { rb = document.createElement('div'); rb.id = 'detRolle'; $('detCan').parentElement.before(rb); } rb.innerHTML = rolleHtml(u.type) + (E.kraftText ? '<div class="detKraft" style="margin-top:4px;opacity:.85">' + E.kraftText(u.type) + (E.modelle && E.modelle(u.type) > 1 ? ' ' + E.modelle(u.type) + ' Modelle, je ' + Math.round(100 / E.modelle(u.type)) + ' Stärke eines.' : '') + '</div>' : ''); }   // F103; U5a: Feuerkraft-Kurve im Info-Fenster
  { let mb = $('detMed'); if (!mb) { mb = document.createElement('div'); mb.id = 'detMed'; mb.className = 'det-med'; $('detCan').parentElement.after(mb); }   // F66: Stärken und Schwächen in Worten
    const m = E.medaillen(u.type); mb.innerHTML = '<b>Stärken und Schwächen:</b>' + medaillenTexte(u.type).map(t => `<div class="dm">${t.k !== 'klasse' ? `<span class="med ${m[t.k]}">${upSym(t.sym) ? `<img src="${upSym(t.sym)}" alt="">` : ''}</span>` : '<span class="med klasse"></span>'}<span><b>${t.name}</b> – ${t.text}</span></div>`).join(''); }
  $('detSp').innerHTML = (T.sp || []).map(x => `<span class="sp">${x}</span>`).join('');
  $('detStats').innerHTML = pill('Angriff', T.atk || '–') + pill('Abwehr', T.def) + pill('Moral', T.mor) + pill('Zug', T.mv) + pill('Schuss', T.rng ? `${felder(T.rng)}` : '–') + pill('Kosten', '★ ' + (E.COST[u.type] || '–'));
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
  setMusik(soundOn ? 'musik_titel' : null, 2);   // Punkt 9 (2026-11-21): nur mit Ton an   // Titelmusik im Startmenü (Schleife, aus der Schlacht weich übergeblendet)
  $('start').hidden = false; setMap(mapSel); drawMapPick(); armyInfo(); drawFlagPick(); $('setSpeed').textContent = speedTxt(); $('setZoom').textContent = zoomTxt(); $('closeStart').hidden = first;
  $('smNeu').hidden = !first; $('smBeenden').hidden = first; beendenScharf(false);   // F2 (2026-11-20): im Spiel oben „Zurück zum Spiel“, unten „Beenden“
  startStep('title');
}
// ---------- Armee-Auswahl vor der Schlacht ----------
const customArmy = { A: null, D: null };
// F94 (Enrico 2026-11-22 13:35): Feind-Armee auch gegen die KI selbst zusammenstellen. feindSelbst[sd] = true: die KI spielt mit customArmy[sd] (gleiche Regeln), sonst stellt sie selbst zusammen (Kartenarmee)
const feindSelbst = { A: false, D: false };
const feindSeite = () => curMode() === 'hot' ? null : curMode() === 'A' ? 'D' : 'A';
function feindWahlZeigen() { const sd = armySide, f = sd === feindSeite(), w = $('armyFeind'); if (!w) return; w.hidden = !f; if (!f) return;
  w.querySelectorAll('button').forEach(b => b.classList.toggle('an', (b.dataset.f === 'ich') === !!feindSelbst[sd])); }
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
  const sides = curMode() === 'hot' ? ['A', 'D'] : [curMode(), feindSeite()];
  $('armyInfo').textContent = sides.map(sd => SIDES[sd].short + ': ' + (sd === feindSeite() && !feindSelbst[sd] ? 'KI stellt selbst zusammen' : customArmy[sd] ? `${sd === feindSeite() ? 'selbst gewählte Feind-Armee' : 'eigene Armee'} (${E.armyCost(customArmy[sd])}/${E.ARMY_BUDGET[sd]} Punkte, ${E.armyCount(customArmy[sd])} Einheiten)` : 'Standardarmee')).join(' · ');
}
// Armee-Auswahl (2026-11-20) im selben Aufbau wie das Nachschub-Menü: Kategorien als Reiter (SHOP_KAT, gleiche Reihenfolge), Karten im Querformat,
// Pergament-Details beim Überfahren bzw. ersten Antippen; Klick bzw. zweites Antippen nimmt eine Einheit dazu, −/+ auf jeder Karte.
let armyKat = 'Alle';
function armyWarum(t) {   // warum diese Einheit nicht noch einmal dazukommen kann ('' = geht)
  const sd = armySide, n = armyDraft[t] || 0, T = TYPES[t], bud = E.ARMY_BUDGET[sd];
  if (isGeneral(t)) return 'Pflicht: Jede Armee hat genau einen General.';
  if (n >= E.ARMY_CAP) return `Höchstens ${E.ARMY_CAP} je Typ.`;
  if (E.armyCost({ ...armyDraft, [t]: (armyDraft[t] || 0) + 1 }) > bud) return `Zu wenig Punkte: ★ ${E.preisNeu(armyDraft, t)} nötig, noch ★ ${Math.max(0, bud - E.armyCost(armyDraft))} frei.`;
  if (E.armyCount(armyDraft) >= E.ARMY_MAX[sd]) return `Höchstens ${E.ARMY_MAX[sd]} Einheiten.`;
  if (T.cls === 'walker' && Object.keys(armyDraft).reduce((k, x) => k + (TYPES[x].cls === 'walker' ? armyDraft[x] : 0), 0) >= E.ARMY_WALKERS) return `Höchstens ${E.ARMY_WALKERS} Kolosse und Kampfmaschinen.`;
  if (T.stufe3 && Object.keys(armyDraft).some(x => TYPES[x].stufe3 && armyDraft[x] > 0)) return 'Stufe 3: höchstens einer je Schlacht.';
  if (T.held && Object.keys(armyDraft).some(x => TYPES[x].held && armyDraft[x] > 0)) return 'Held: höchstens einer je Armee.';   // M2 (2026-11-22)
  return E.katWarum(armyDraft, t);   // K1
}
function openArmy(sd) {
  armySide = sd; armyDraft = Object.assign({}, customArmy[sd] || E.defaultArmy(sd));
  applySkin(curSkin());
  $('armyName').textContent = SIDES[sd].short; $('armySwap').hidden = false; $('armySwap').textContent = curMode() === 'hot' ? 'Andere Seite' : sd === feindSeite() ? 'Eigene Armee' : 'Feind-Armee'; $('armyMechRow').hidden = mechsOn(); feindWahlZeigen();
  for (const t in armyDraft) if (E.isMech(t) && !mechsOn()) delete armyDraft[t];
  armyFixGeneral(sd);
  $('army').hidden = false; armyListe();
}
function armyListe() {   // Reiter und Karten der gewählten Kategorie neu aufbauen
  const sd = armySide, list = roster(sd), inKat = k => snInKat(list, k);
  if (!inKat(armyKat).length) armyKat = SN_REITER.find(k => inKat(k).length);
  $('armyList').innerHTML = inKat(armyKat).map(t => `<div class="sn-k ${sd}" data-t="${t}">${snKarte(t, E.preisNeu(armyDraft, t))}${isGeneral(t) ? '<span class="stepper fixed" data-tip="Pflicht: Jede Armee hat genau einen General."><i>1</i><em>Pflicht</em></span>' : '<span class="stepper"><button class="tbtn" data-d="-1" aria-label="weniger">−</button><i>0</i><button class="tbtn" data-d="1" aria-label="mehr">+</button></span>'}</div>`).join('');
  requestAnimationFrame(() => $('armyList').querySelectorAll('canvas').forEach(c => drawPortrait(c, c.dataset.k, sd, c.dataset.t)));
  hideArmyDet();
  const det = $('armyDet'), sheet = $('army').querySelector('.sheet'), zeig = el => snZeig(det, el, sheet, armyWarum(el.dataset.t), document.querySelector('#armyNeu .an-seite'));
  const dazu = (el, d) => { const t = el.dataset.t; if (isGeneral(t)) return; if (sd === feindSeite() && !feindSelbst[sd]) { feindSelbst[sd] = true; feindWahlZeigen(); } if (d > 0 && armyWarum(t)) { zeig(el); return; }
    armyDraft[t] = Math.max(0, Math.min(E.ARMY_CAP, (armyDraft[t] || 0) + d)); armyRefresh(); if (det.classList.contains('zeigen')) zeig(el); };
  $('armyList').querySelectorAll('.sn-k').forEach(el => {
    el.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') zeig(el); });
    el.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') hideArmyDet(); });
    el.addEventListener('click', e => { const b = e.target.closest('.stepper button'); if (b) { dazu(el, +b.dataset.d); return; }
      if (lastPT === 'mouse' || el.classList.contains('offen')) dazu(el, 1); else zeig(el); });   // wie im Nachschub: Finger erst Details, dann dazunehmen
  });
  armyRefresh();
}
function hideArmyDet() { $('armyDet').classList.remove('zeigen'); document.querySelectorAll('#armyNeu .sn-k.offen').forEach(e => e.classList.remove('offen')); }
function armyRefresh() {
  const sd = armySide, cost = E.armyCost(armyDraft), n = E.armyCount(armyDraft), bud = E.ARMY_BUDGET[sd], list = roster(sd), inKat = k => snInKat(list, k);
  let walkers = 0; for (const t in armyDraft) if (TYPES[t].cls === 'walker') walkers += armyDraft[t];
  $('armyReiter').innerHTML = SN_REITER.filter(k => inKat(k).length).map(k => { const frei = inKat(k).filter(t => !armyWarum(t)).length, gew = inKat(k).reduce((x, t) => x + (armyDraft[t] || 0), 0);
    return `<button data-kat="${k}" class="${k === armyKat ? 'an' : ''}${frei ? ' leistbar' : ''}" title="${gew ? gew + ' gewählt' : 'Noch nichts gewählt'}${frei ? ', ' + frei + ' Typen noch möglich' : ', nichts mehr möglich'}">${k}<small>${inKat(k).length}${gew ? ` · <b>${gew}</b>` : ''}</small></button>`; }).join('');
  $('armyReiter').querySelectorAll('button').forEach(b => b.onclick = () => { armyKat = b.dataset.kat; armyListe(); });
  $('armyList').querySelectorAll('.sn-k').forEach(it => { const t = it.dataset.t, v = armyDraft[t] || 0; it.querySelector('i').textContent = v; it.classList.toggle('has', v > 0); it.classList.toggle('aus', !v && !!armyWarum(t) && !isGeneral(t)); });
  $('armyPts').textContent = `${cost} / ${bud}`; $('armyPts').classList.toggle('over', cost > bud);
  $('armyPtsSeite').textContent = `${cost} / ${bud}`; $('armyRest').textContent = bud - cost; $('armyRest').classList.toggle('over', cost > bud);
  $('armyBalken').style.width = Math.min(100, 100 * cost / bud) + '%'; $('armyBalken').classList.toggle('over', cost > bud);
  // Seitenleiste: gewählte Einheiten nach Kategorie (gleiche Reihenfolge wie die Reiter); Klick springt zum Reiter und zeigt die Karte
  $('armyWahl').innerHTML = SHOP_KAT.map(k => { const ts = inKat(k).filter(t => armyDraft[t] > 0); return ts.length ? `<div class="kat">${k}</div>` + ts.map(t => `<button data-t="${t}" title="Zum Reiter ${k}"><b>${armyDraft[t]}×</b><span>${TYPES[t].name}</span><span>★ ${armyDraft[t] * E.COST[t]}</span></button>`).join('') : ''; }).join('') || '<em>Noch keine Einheiten gewählt.</em>';
  $('armyWahl').querySelectorAll('button').forEach(b => b.onclick = () => { const t = b.dataset.t; if (armyKat !== 'Alle') armyKat = shopKatOf(t); armyListe(); const el = $('armyList').querySelector(`.sn-k[data-t="${t}"]`); if (el) { el.scrollIntoView({ block: 'nearest' }); el.classList.add('offen'); setTimeout(() => el.classList.remove('offen'), 900); } });
  $('armyCnt').textContent = `${n} Einheiten (${E.ARMY_MIN[sd]} bis ${E.ARMY_MAX[sd]})`;
  const msg = cost > bud ? `${cost - bud} Punkte zu viel.` : n < E.ARMY_MIN[sd] ? `Mindestens ${E.ARMY_MIN[sd]} Einheiten.` : n > E.ARMY_MAX[sd] ? `Höchstens ${E.ARMY_MAX[sd]} Einheiten.`
    : walkers > E.ARMY_WALKERS ? `Höchstens ${E.ARMY_WALKERS} Kolosse und Kampfmaschinen.` : E.katFehler(armyDraft) ? E.katFehler(armyDraft) : cost < bud ? `Noch ${bud - cost} Punkte frei.` : 'Alle Punkte verteilt.';
  $('armyKat').innerHTML = katLeiste(armyDraft);   // K1
  $('armyMsg').textContent = msg; $('armyOk').disabled = !((sd === feindSeite() && !feindSelbst[sd]) || E.armyOk(sd, armyDraft, mechsOn()));
  $('armyFussText').textContent = (lastPT === 'mouse' ? 'Überfahren zeigt alle Werte, Klick nimmt eine dazu' : 'Antippen zeigt alle Werte, nochmal antippen nimmt eine dazu') + ', −/+ ändert die Anzahl. Ein General ist immer dabei.';
}
function armyKeep() { if (armySide === feindSeite() && !feindSelbst[armySide]) { customArmy[armySide] = null; return true; }   // F94: KI stellt selbst zusammen
  if (!E.armyOk(armySide, armyDraft, mechsOn())) return false; const a = {}; for (const t in armyDraft) if (armyDraft[t] > 0) a[t] = armyDraft[t]; customArmy[armySide] = a; return true; }

// ---------- Kartenwahl ----------
const TCOL = { open: '#6d6250', mud: '#4f4433', crater: '#5c5141', trench: '#2e271e', wire: '#7a6e5c', village: '#8a7e66', forest: '#3f4a2c', canal: '#355260', bridge: '#9a8a6a',
  furt: '#4f7480', sumpf: '#4b5a36', wald: '#24331c', waldweg: '#6b6a44', bunker: '#a7a59a', fabrik: '#8a5a44', kirche: '#c2bba8', barrikade: '#7a5a3a', bahn: '#56524a',
  schiff: '#c2bba8', turm: '#d8d0bc', friedhof: '#6f7258', garten: '#66704a', acker: '#8a8a7a', eis: '#9fb4bf', haus: '#7a6a58', kapelle: '#b8b0a0', steinbruecke: '#a49a88' };
function drawMapPreview(cvs, id) {
  const prev = mapSel; setMap(id); const M = E.buildMap(), m = E.MAP; setMap(prev);
  const W = cvs.clientWidth || 180, H = cvs.clientHeight || 120, dpr = Math.min(2, window.devicePixelRatio || 1);
  cvs.width = W * dpr; cvs.height = H * dpr; const g2 = cvs.getContext('2d'); g2.scale(dpr, dpr);
  const kp = 0.58;   // gestaucht wie im Spiel (Seitenansicht)
  const s2 = Math.min(W / (1.5 * m.cols + 0.5), H / (SQ3 * kp * (m.rows + 0.5)));
  const ox = (W - s2 * (1.5 * m.cols + 0.5)) / 2, oy = (H - s2 * SQ3 * kp * (m.rows + 0.5)) / 2;
  const hp = (c, r) => [ox + s2 * (1 + 1.5 * c), oy + s2 * SQ3 * kp * (r + 0.5 * (c & 1) + 0.5)];
  for (let c = 0; c < m.cols; c++) for (let r = 0; r < m.rows; r++) {
    const [x, y] = hp(c, r); g2.beginPath(); for (let k = 0; k < 6; k++) { const a = Math.PI / 3 * k; g2.lineTo(x + s2 * Math.cos(a), y + s2 * kp * Math.sin(a)); }
    g2.closePath(); g2.fillStyle = TCOL[M[c][r].t] || '#6d6250'; g2.fill();
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
  G = E.newGame({ map: mapSel, mechs: mechsOn(), army: { A: human('A') || feindSelbst.A ? customArmy.A : null, D: human('D') || feindSelbst.D ? customArmy.D : null } });   // F94: Feind-Armee selbst gewählt
  if (typeof AI !== 'undefined' && AI.setAktiv) AI.setAktiv(kiArt === 'ruhig' ? [] : ['A', 'D'].filter(sd => !human(sd))); siegGemeldet = { A: 0, D: 0 };   // F43: Einstellung KI ruhig / angriffslustig, die KI greift gegen Menschen aktiver an (ai.js AKTIV); H1 (2026-11-22): Siegwarnung je Schlacht neu
  fxs.length = gmarks.length = decals.length = particles.length = floaters.length = tracers.length = shells.length = booms.length = flames.length = rings.length = muzzles.length = 0;
  initDU(); layout(); syncAll();
  aufstellSeiten = mode === 'ai' ? [] : ['A', 'D'].filter(human);   // Aufstellungsphase (Fahrplan 2): menschliche Seiten stellen selbst auf, die KI automatisch
  if (aufstellSeiten.length) G.aufstellung = aufstellSeiten.shift(); else E.startTurn(G);
  sel = null; inspect = null; placing = null; spawnSet = new Set(); LOG.length = 0; FLUG.clear(); AURA_PULS.clear(); /* K7 */ lastSel.A = lastSel.D = null; stimmeVon.clear(); for (const k in stimmeNaechste) delete stimmeNaechste[k]; renderDiary(); updateUI();
  requestAnimationFrame(() => camHome(true));
  banner(E.MAP.name, G.aufstellung ? 'Aufstellung: Einheiten in der grünen Zone verschieben' : `Zielfelder besetzen und halten · wer zuerst ${G.goal} Siegpunkte hat, gewinnt`); playSound('march', 0.45); playSound('whistle', 0.5); setAmbient(soundOn);
  if (G.aufstellung) return aufstellAnzeige();
  setTimeout(rundenSchild, 500);   // Rundenschild auch für Runde 1 (ohne Aufstellung)
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
  G.aufstellung = null; aufstellAnzeige(); E.startTurn(G); syncAll(); updateUI(); playSound('whistle', 0.5); setTimeout(rundenSchild, 500);   // Rundenschild auch für Runde 1
  setTimeout(() => { const gu = G.units.find(x => human(x.side) && TYPES[x.type].cmd === 2); if (gu) stimme(gu, 'erscheinen', { immer: true, sperre: 0 }); }, 2200);   // V3: Erscheinen beim Schlachtbeginn (General)
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
  inspect = aufstellWahl ? { unit: aufstellWahl } : null; updateHud();   // F6: Einheitenkarte auch in der Aufstellung
});
function showHandover() {
  $('handover').hidden = false; $('handover').className = 'overlay center hand ' + G.side;
  $('handTitle').textContent = SIDES[G.side].name; $('handText').textContent = `Runde ${G.turn}. Gebt das Gerät weiter.`;
}
function showEnd() {
  if (!G.over || G.over.why === 'quit') return;   // F2: verlassene Schlacht zeigt kein Siegbild
  const r = G.over, me = mode === 'hot' ? null : mode, win = r.winner;
  let title = win ? SIDES[win].short + ' siegt' : 'Unentschieden';
  if (me) title = win === me ? 'Sieg' : win ? 'Niederlage' : 'Unentschieden';
  const why = r.why === 'break' ? (win === 'A' ? 'Die Aschenwacht ist zusammengebrochen.' : 'Das Konkordat ist zusammengebrochen.')
    : r.why === 'time' ? `Nach ${P.MAX_ROUNDS} Runden steht es ${G.vp.A} : ${G.vp.D} Siegpunkte.`
    : `${SIDES[win].short} hat zuerst ${G.goal} Siegpunkte erreicht. Endstand ${G.vp.A} : ${G.vp.D}.`;
  let stars = 0;
  if (me) { if (win === me) stars = 2 + (E.losses(G, me) < 0.3 ? 1 : 0); else if (!win) stars = 1; }
  $('endTitle').textContent = title; $('endWhy').textContent = why;
  { const w = $('endWappen'), k = win && UP['w' + fac(win)]; w.hidden = !k; if (k) { w.src = k; w.className = 'end-wappen c' + fac(win); w.alt = SIDES[win].short; } }   // Siegbild: Wappen der siegreichen Seite (2026-11-20)
  $('endStars').textContent = me ? '★'.repeat(stars) + '☆'.repeat(3 - stars) : '';
  $('endStats').innerHTML = `<div><dt>Ausfälle ${SIDES.A.short}</dt><dd>${Math.round(E.losses(G, 'A') * 100)} %</dd></div><div><dt>Ausfälle Aschenwacht</dt><dd>${Math.round(E.losses(G, 'D') * 100)} %</dd></div>` +
    OBJECTIVES.map(o => `<div class="${G.ctrl[o.id] || 'N'}"><dt>${o.name}</dt><dd>${G.ctrl[o.id] ? SIDES[G.ctrl[o.id]].short : 'neutral'}</dd></div>`).join('');
  $('end').hidden = false;
  setAmbient(false);
  if (win && (!me || win === me)) playSound('win', 0.6); else if (me && win && win !== me && soundOn) setMusik('musikNiederlage');   // Niederlage: „Taps“
}

// Klick-Ton für Knöpfe (Oberfläche); Titelmusik startet, sobald der Browser Ton erlaubt (erste Berührung)
document.addEventListener('pointerdown', ev => {
  const b = ev.target.closest && ev.target.closest('button, .up-btn, .tb-btn, [role="button"], label.mapcard'); if (b && b.id !== 'btnNext' && b.dataset.act !== 'pass') playSound('ui', 0.3, null);   // diese beiden haben den eigenen Klick
  if (soundOn && !$('start').hidden && musikName !== 'musik_titel') setMusik('musik_titel'); musikWecken();   // Punkt 9: „Ton aus“ gilt auch im Startmenü   // Browser erlaubt Ton erst nach der ersten Berührung
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
  const list = G.units.filter(u => u.side === G.side && E.active(u) && !spent.has(u.id)).sort((a, b) => ((b.ap >= 1) - (a.ap >= 1)) || a.c - b.c || a.r - b.r);   // erst Einheiten mit Aktion, zuletzt die mit nur noch BP
  if (!list.length) { const be = $('btnEnd'); be.classList.remove('flash'); void be.offsetWidth; be.classList.add('flash'); setTimeout(() => be.classList.remove('flash'), 1900); return; }
  const i = sel ? list.findIndex(u => u.id === sel.id) : -1;
  const u = list[((i < 0 ? (back ? 0 : -1) : i) + (back ? -1 : 1) + list.length) % list.length];
  select(u);
  const [x, y] = center(u.c, u.r), rc = cv.getBoundingClientRect(), bc = board.getBoundingClientRect();
  camTo(x, y, 400, true);
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
document.querySelectorAll('#armyFeind button').forEach(b => b.onclick = () => { feindSelbst[armySide] = b.dataset.f === 'ich'; feindWahlZeigen(); armyRefresh(); });   // F94
$('armyStd').onclick = () => { armyDraft = Object.assign({}, E.defaultArmy(armySide)); armyRefresh(); };
$('armyClear').onclick = () => { armyDraft = {}; armyFixGeneral(armySide); armyRefresh(); };
$('armyOk').onclick = () => { if (armyKeep()) { $('army').hidden = true; hideArmyDet(); armyInfo(); } };
$('armyCancel').onclick = () => { $('army').hidden = true; hideArmyDet(); armyInfo(); };
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
$('closeStart').onclick = () => { $('start').hidden = true; if (soundOn && G && !G.over && musikName !== 'musik_schlacht') setMusik('musik_schlacht', 2); };
// Beenden (F2): erster Klick fragt nach („Wirklich beenden?“, 4 s), zweiter Klick verlässt die Schlacht zum Startbildschirm
let beendenT = 0; function beendenScharf(an) { clearTimeout(beendenT); const b = $('smBeenden'); b.classList.toggle('scharf', an); b.textContent = an ? 'Wirklich beenden?' : 'Beenden'; if (an) beendenT = setTimeout(() => beendenScharf(false), 4000); }
$('smBeenden').onclick = () => { if (!$('smBeenden').classList.contains('scharf')) return beendenScharf(true); beendenScharf(false); if (G) G.over = G.over || { winner: null, why: 'quit' }; setAmbient(false); showStart(true); };
$('btnRules').onclick = $('btnRules2').onclick = () => { $('rules').hidden = false; kzLegende(); };
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
const OPT_IDS = [['optReady', 'ready'], ['optStrag', 'strag'], ['optCam', 'cam'], ['optShake', 'shake'], ['optCamZ', 'camZurueck']];   // „Neue Ansicht (Test)“ entfernt: immer neue Ansicht
for (const [id, k] of OPT_IDS) $(id).checked = OPT[k];
for (const [id, k] of OPT_IDS) $(id).addEventListener('change', () => { OPT[k] = $(id).checked; try { localStorage.setItem('arm.hilfen', JSON.stringify(OPT)); } catch (e) {}
  });
let kiArt = 'angriff'; try { const v = localStorage.getItem('arm.ki'); if (['angriff', 'ruhig'].includes(v)) kiArt = v; } catch (e) {}
if ($('optKI')) { $('optKI').value = kiArt; $('optKI').addEventListener('change', () => { kiArt = $('optKI').value; try { localStorage.setItem('arm.ki', kiArt); } catch (e) {} if (G && !G.over && typeof AI !== 'undefined') AI.setAktiv(kiArt === 'ruhig' ? [] : ['A', 'D'].filter(sd => !human(sd))); }); }   // F43
if ($('optSzene')) { $('optSzene').value = KS; $('optSzene').addEventListener('change', () => { KS = $('optSzene').value; try { localStorage.setItem('arm.kampfszene', KS); } catch (e) {} }); }   // F48
cv.addEventListener('pointerdown', () => { if (szene) szene.skip = true; }, true);   // F48: Klick überspringt die Kampfszene
if ($('optMeld')) { $('optMeld').value = meldArt; $('optMeld').addEventListener('change', () => { meldArt = $('optMeld').value; try { localStorage.setItem('arm.meldungen', meldArt); } catch (e) {} }); }   // F15
if ($('optBild')) { $('optBild').value = String(BW); $('optBild').addEventListener('change', () => setBildwirkung(+$('optBild').value, true)); }   // Bildwirkung (2026-11-19)
if ($('optBase')) { $('optBase').value = String(OPT.base); $('optBase').addEventListener('change', () => { OPT.base = +$('optBase').value; try { localStorage.setItem('arm.hilfen', JSON.stringify(OPT)); } catch (e) {} }); }
// Lautstärke-Regler (Optionen): Musik und Effekte getrennt, gespeichert
{ const set = () => { $('volMusik').value = Math.round(musikVol * 100); $('volEffekte').value = Math.round(effektVol * 100); $('volMusikW').textContent = $('volMusik').value; $('volEffekteW').textContent = $('volEffekte').value; $('volStimmen').value = Math.round(stimmVol * 100); $('volStimmenW').textContent = $('volStimmen').value; }; set();
  $('volStimmen').addEventListener('input', () => { stimmVolSetzen(+$('volStimmen').value / 100); set(); });   // F95: eigener Regler für Stimmen und Rufe
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
function tonUmschalten() { setSound(!soundOn); if (soundOn) playSound('whistle', 0.4); toast(soundOn ? 'Ton an' : 'Ton aus – Taste M oder Lautsprecher oben schaltet ihn wieder an'); }   // F18: kurzer Hinweis
$('btnSound').onclick = tonUmschalten;
$('smSound').onclick = e => { e.stopPropagation(); setSound(!soundOn); };
$('optSound').checked = soundOn; $('optSound').addEventListener('change', () => setSound($('optSound').checked));
$('btnShop').onclick = openShop;
$('closeShop').onclick = () => { $('shop').hidden = true; hideShopDet(); };
$('closeDetail').onclick = () => { $('detail').hidden = true; };
// Klick (oder Antippen) in den dunklen Bereich neben dem Fenster schließt es wie der Schließen-Knopf (Spieltest 2026-11-17)
for (const [ov, btn] of [['army', 'armyCancel'], ['shop', 'closeShop'], ['detail', 'closeDetail'], ['rules', 'closeRules']])
  $(ov).addEventListener('click', e => { if (e.target === $(ov) && !(ov === 'shop' && performance.now() - shopZieh < 400)) $(btn).click(); });   // nach dem Ziehen des Nachschub-Fensters nicht schließen
$('btnSpeed').onclick = () => { tempo = tempo === 0.5 ? 1 : tempo === 1 ? 2 : tempo === 2 ? INSTANT : 0.5; speed = gegnerZug ? tempo * (tempo >= INSTANT ? 1 : GEGNER_TEMPO) : tempo; try { localStorage.setItem('arm.tempo2', String(tempo)); } catch (e) {} tbSync(); };   // ½×, 1×, 2×, Sofort (Paket 2: langsamere Stufe, gespeichert)
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
  if (pan && $('start').hidden && !e.target.closest('input')) { userCam(); camPan(pan[0] * 0.18, pan[1] * 0.18); e.preventDefault(); }
  // Tasten 1–n: Fähigkeiten-Knöpfe des Panels
  if (/^[1-9]$/.test(e.key) && G && $('start').hidden && $('shop').hidden && $('detail').hidden && $('rules').hidden && $('army').hidden && !(e.target.closest && e.target.closest('input')) && !e.ctrlKey && !e.altKey && !e.metaKey) {
    const b = $('hudRow').querySelectorAll('.up-ab')[+e.key - 1]; if (b && !b.classList.contains('off')) { b.click(); e.preventDefault(); } }
  if ((e.key === 'b' || e.key === 'B') && G && $('start').hidden && !(e.target.closest && e.target.closest('input, select, textarea')) && !e.ctrlKey && !e.altKey && !e.metaKey) { setBildwirkung(BW + 1); e.preventDefault(); return; }   // Bildwirkung umschalten: aus → leicht → stark
  if ((e.key === 'm' || e.key === 'M') && !(e.target.closest && e.target.closest('input, select, textarea')) && !e.ctrlKey && !e.altKey && !e.metaKey) { tonUmschalten(); e.preventDefault(); return; }   // F18: Ton an/aus per Taste
  if ((e.key === ' ' || e.key === 'e' || e.key === 'E') && G && sel && human(G.side) && !busy && !G.over && $('start').hidden && $('shop').hidden && $('detail').hidden && $('rules').hidden && $('army').hidden && !(e.target.closest && e.target.closest('input, select, textarea, button')) && !e.ctrlKey && !e.altKey && !e.metaKey) { e.preventDefault(); panelAct('pass'); return; }   // F102: Leertaste oder E = Fertig
  if (e.key === 'Escape' && G && aktModus()) { modiAus(); computeOptions(); updateHud(); toast('Abgebrochen.'); return; }   // Paket A: Esc bricht den Modus ab
  if (e.key === 'Escape' && wayPt) { wayPt = null; computeOptions(); updateHud(); return; }
  if (e.key === 'Escape') { cancelPlace(); $('shop').hidden = true; select(null); $('detail').hidden = true; $('rules').hidden = true; } });

// ---------- Kamera, Zoom, Wucht, Kriegstagebuch (Etappe 3) ----------
// Kamera = Scrollposition des Schlachtfelds. Passt die Karte ganz ins Bild, gibt es nichts zu fahren.
let camAnim = null, camHold = false, activeU = null, shakeT = 0, shakeA = 0, diaryMark = null;
const lastSel = { A: null, D: null };   // zuletzt gewählte eigene Einheit je Seite (Kamera zu Rundenbeginn)
const camOn = () => OPT.cam && speed < INSTANT && !camHold;
function userCam() { camAnim = null; if (G && busy && !human(G.side)) camHold = true; }   // Spieler verschiebt selbst: Kamera hält still bis zur nächsten KI-Einheit
function inView(x, y, m = 0.18) {
  camSetup(); const p = proj(x, y), W = cv.width, H = cv.height; return p[2] > 0 && p[0] >= W * m && p[0] <= W * (1 - m) && p[1] >= H * m && p[1] <= H * (1 - m);
}
// Punkt 24 (Enrico 2026-11-23): nach einem Fernschuss im eigenen Zug fährt die Kamera nach 0,5 s weich dorthin zurück, wo sie vor der Handlung stand; Klick, Scrollen, Ziehen oder eine Taste bricht ab (Optionen: optCamZ)
let camRueck = null, camEingriff = 0;
function camFern() { if (camRueck) camRueck.fern = true; }
['pointerdown', 'wheel', 'keydown'].forEach(t => addEventListener(t, () => { camEingriff = performance.now(); }, { capture: true, passive: true }));
async function camZurueckFahren() { const r = camRueck; camRueck = null; if (!r || !r.fern || !G || !human(G.side) || camEingriff > r.t) return;
  const t0 = performance.now(); await wait(500); if (camEingriff > t0 || busy || camAnim || Math.hypot(CAM.x - r.x, CAM.y - r.y) < 4) return;
  const x0 = CAM.x, y0 = CAM.y, dur = Math.max(380, Math.min(900, 380 + Math.hypot(r.x - x0, r.y - y0) * 0.35)), me = {}; camAnim = me; const st = performance.now();
  const step = () => { if (camAnim !== me) return; if (camEingriff > t0) { camAnim = null; return; } const k = Math.min(1, (performance.now() - st) / dur), e = 0.5 - 0.5 * Math.cos(Math.PI * k);
    CAM.x = x0 + (r.x - x0) * e; CAM.y = y0 + (r.y - y0) * e; camClamp(); if (k < 1) requestAnimationFrame(step); else camAnim = null; }; requestAnimationFrame(step); }
let trefferBis = 0;   // SP-1 (84.9): bis dahin bleibt die Kamera stehen (Schadenszahl, Treffer, Kopfzeichen sichtbar)
function camTo(x, y, ms = 380, force) {   // weich zum Punkt (Canvas-Pixel) fahren; Promise endet bei Ankunft oder Abbruch
  const rest = trefferBis - performance.now(); if (!force && rest > 30 && !window.KAMERA_ALT) return new Promise(r => setTimeout(r, rest)).then(() => camToTilt(x, y, ms, force));   // erst den letzten Treffer zeigen, dann weiterfahren
  return camToTilt(x, y, ms, force);
}
// SP-1 (84.8): Ereignisse ohne eigene Kamerafahrt – gleiche Regel im eigenen und im KI-Zug: liegt der Ort außerhalb des Bildes oder nahe am Rand, fährt die Kamera hin
const KAMERA_EV = new Set(['mark', 'handgranate', 'roar', 'durchbruch', 'hinrichtung', 'rollen', 'rammen', 'smoke', 'kopfrunter', 'pzschuss', 'lanceblast', 'blast', 'tunnelBlow', 'mine', 'einsturz', 'eisbruch', 'gascloud', 'counterstrike', 'bigorder', 'order', 'heal', 'dauerfeuer', 'strike']);
function evPunkt(e) {
  const P = id => { const d = id != null && DU.get(id); return d ? [d.x, d.y - L.s * 0.4] : null; };
  if (e.c != null && e.r != null) { const [x, y] = center(e.c, e.r); return [x, y - L.s * 0.3]; }
  const a = P(e.a != null ? e.a : e.u != null ? e.u : e.by), d = P(Array.isArray(e.d) ? e.d[0] : e.d);
  return a && d ? [(a[0] + d[0]) / 2, (a[1] + d[1]) / 2] : a || d;
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
  return zoomTilt(z, cx, cy, fit);
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
    case 'rollen': return logAdd(`${N(u)}: Sturmrollen${e.graben ? ' – der Graben schützt' : ''}`, u && u.side, ...at(u), true);
    case 'pzgranate': return logAdd(`${N(u)}: Panzergranate`, u && u.side, ...at(u), true);
    case 'rammen': return logAdd(`${N(u)}: rammt das Gebäude`, u && u.side, ...at(u), true);
    case 'sprung': return logAdd(`${N(u)}: Sprungangriff`, u && u.side, ...at(u), true);
    case 'eisbruch': return logAdd(u ? `Das Eis bricht unter ${N(u)} ein` : 'Das Eis bricht ein', u && u.side, e.c, e.r, true);
    case 'eiszu': return logAdd('Eisloch friert wieder zu', null, e.c, e.r);
    case 'durchbruch': return logAdd(`${N(u)}: Durchbruch`, u && u.side, ...at(u), true);   // Einblendung: heldTitel (F86)
    case 'hinrichtung': return logAdd(`${N(u)}: Hinrichtung`, u && u.side, ...at(u), true);
    case 'heldfall': logAdd(`${N(u)} ist gefallen – die Seite verliert Moral`, u && u.side, ...at(u), true); return headline(`${N(u)} fällt!`, u && u.side);
    case 'furcht': return logAdd(`${N(u)}: Furcht vor dem Kürassier`, u && u.side, ...at(u));
    case 'dauerfeuer': return logAdd(`${N(u)}: Dauerfeuer – das MG kühlt eine Runde ab`, u && u.side, ...at(u), true);
    case 'faust': logAdd(`${N(u)}: Faustsalve auf ${(e.d || []).map(id => N(unitById(id))).join(' und ')}`, u && u.side, ...at(u), true); return headline('Faustsalve!', u && u.side);
    case 'roar': logAdd(`${N(u)}: Löwengebrüll, ${(e.d || []).length} Gegner verängstigt`, u && u.side, ...at(u), true); return headline(`Löwengebrüll!`, u && u.side);
    case 'supp': logAdd(`${N(u)} niedergehalten`, u.side, ...at(u), true); return headline(`${N(u)} niedergehalten!`, u.side);
    case 'rout': logAdd(`${N(u)} flieht`, u.side, ...at(u), true); return headline(`${N(u)} flieht!`, u.side);
    case 'destroyed': logAdd(`${N(u)} aufgerieben`, u.side, ...at(u), true); return headline(`${N(u)} aufgerieben!`, u.side);
    case 'officer': logAdd(`${e.name} ist gefallen`, u && u.side, ...at(u), true); return headline(`${e.name} fällt!`, u && u.side);
    case 'stuck': if (u && TYPES[u.type].stecken) { const ht = G.map[u.c] && G.map[u.c][u.r] && G.map[u.c][u.r].t, wo = ht === 'trench' ? 'im Graben' : 'im Schlamm'; logAdd(`${N(u)} hängt ${wo} fest`, u.side, ...at(u), true); return headline(`${N(u)} hängt ${wo} fest!`, u.side); }   // M4
      logAdd(`${N(u)} steckt im Schlamm fest`, u.side, ...at(u), true); return headline(`${N(u)} steckt fest!`, u.side);
    case 'breakdown': logAdd(`${N(u)}: Panne, festgefahren`, u.side, ...at(u), true); return headline(`${N(u)} hat sich festgefahren!`, u.side);
    case 'mine': logAdd('Mine detoniert', null, e.c, e.r, true); return headline('Mine!', null);
    case 'wirehurt': return logAdd(`${N(u)}: im Stacheldraht verletzt`, u && u.side, e.c, e.r);
    case 'gas': if (e.late) return logAdd(`${N(u)}: Vergiftung`, u && u.side, ...at(u)); return;
    case 'burn': return logAdd(`${N(u)}: im Feuer`, u && u.side, e.c, e.r);
    case 'freeblow': { const fa = G.units.find(x => x.id === e.a); return logAdd(`${N(u)} weicht zurück: Freischlag von ${N(fa)}`, u && u.side, ...at(u)); }
    case 'pzschuss': return logAdd(`${N(unitById(e.u))}: Panzergranate auf ${N(unitById(e.d))}`, unitById(e.u) && unitById(e.u).side, e.c, e.r, true);
    case 'entsetzen': return logAdd(`${N(unitById(e.u))}: Entsetzenstest ${e.ok ? 'bestanden' : 'nicht bestanden – niedergehalten'} (Chance ${Math.round(e.p * 100)} %)`, unitById(e.u) && unitById(e.u).side);
    case 'kopfrunter': return logAdd(`${N(unitById(e.u))}: Kopf runter! – ${N(unitById(e.d))} niedergehalten`, unitById(e.u) && unitById(e.u).side);
    case 'handgranate': return logAdd(`${N(unitById(e.a))}: Handgranaten`, unitById(e.a) && unitById(e.a).side);
    case 'lanceblast': return logAdd(`${N(unitById(e.a))}: Sprenglanze`, unitById(e.a) && unitById(e.a).side, e.c, e.r);
    case 'tunnelBlow': return logAdd('Stollen gesprengt', null, e.c, e.r, true);
    case 'fire': { const a = unitById(e.a), d = unitById(e.d); if (!a || !d) return;
      if (e.reaction) { const mg = TYPES[a.type].mg; logAdd(`${mg ? 'MG-Sperrfeuer' : 'Feuerbereitschaft'}: ${N(a)} auf ${N(d)}`, a.side, ...at(d), true); headline(`${mg ? 'MG-Sperrfeuer' : 'Feuerbereitschaft'}: Schuss auf ${N(d)}!`, a.side); }   // Spieltest Runde 3: eindeutig benennen
      else logAdd(`Beschuss: ${N(a)} auf ${N(d)}`, a.side, ...at(d)); return; }
    case 'melee': { const a = unitById(e.a), d = unitById(e.d); if (a && d) logAdd(`Nahkampf: ${N(a)} gegen ${N(d)}`, a.side, ...at(d)); return; }
    case 'shell': { const a = unitById(e.a); if (a) logAdd(`${N(a)}: ${e.mode === 'gas' ? 'Gasgranaten' : e.mode === 'barrage' ? 'Artillerie-Sperrfeuer' : 'Granaten'}${e.scatter ? ' (gestreut)' : ''}`, a.side, e.c, e.r); return; }
    case 'order': return logAdd(`${e.name}: ${e.kind === 'rally' ? 'Sammeln' : e.kind === 'fire' ? 'Feuer frei' : 'Sturmbefehl'}`, u && u.side, ...at(u));
    case 'bigorder': logAdd(`General: ${e.name}!`, e.side, ...at(u), true); return headline(`${e.name}!`, e.side);
    case 'undig': return logAdd(`${N(u)}: ausgegraben`, u && u.side, ...at(u));
    case 'dig': return logAdd(`${N(u)}: eingegraben`, u && u.side, ...at(u));
    case 'shields': return logAdd(`${N(u)}: Schilde vor`, u && u.side, ...at(u));
    case 'rush': return logAdd(`${N(u)}: Sturmlauf`, u && u.side, e.c, e.r, true);
    case 'banner': return logAdd(`${N(u)}: Banner ${e.planted ? 'aufgepflanzt' : 'aufgenommen'}`, u && u.side, ...at(u));
    case 'score': { const n = OBJECTIVES.filter(o => G.ctrl[o.id] === e.side).reduce((m, o) => m + o.pts, 0); if (n) logAdd(`${SIDES[e.side].short}: +${n} Siegpunkte`, e.side, null, null); return; }
    case 'spawn': return logAdd(`Nachschub: ${N(u)}`, u.side, ...at(u));
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
window.__dbg = { leichen: () => LEICHEN, buchten: () => GBW && GBW.buchtenJeFeld, gbTeile: () => GBW && GBW.gteile && { an: GBW.gteile.an, stirn: (GBW.gteile.st || []).length, feind: (GBW.gteile.st || []).filter(q => q.feind).length, weg: GBW.gteile.weg || 0 },   /* G2b: gemalte Grabenteile aktiv? */   /* G2a: Feuerbuchten je Grabenfeld (für U2) */ gbProbe: o => { window.GB_PROBE = o || null; renderTerrain(); return true; },   /* G1: Gelände-Probe neu aufbauen */ massstab: an => { window.MASSSTAB_ALT = !an; return !window.MASSSTAB_ALT; },   /* U1: 1 = Maßstab E1, 0 = alter Maßstab */ schaden: (id, dmg, krit, seite) => { const u = unitById(id), st = schadenStufe(dmg), f = floater(...headPos(id), '−' + fmt(dmg), st.col, st.big, true); if (f && u) { f.seite = seite || fac(u.side); f.krit = !!krit; } return !!f; },   /* Punkt 17: Schadenszahl zeigen */ mitte: (c, r) => center(c, r), zaehler: () => ({ fxs: fxs.length, gmarks: gmarks.length, particles: particles.length, floaters: floaters.length, decals: decals.length, tracers: tracers.length, booms: booms.length, flames: flames.length, rings: rings.length, du: DU.size, wolken: (G.clouds || []).length, nebel: (G.smoke || []).length, feuer: (G.fires || []).length, eisloch: G.map.flat().filter(h => h.t === 'eisloch').length }),   /* Paket C Punkt 4: Größen der Listen je Runde */ modus: () => aktModus(), zielDa: id => zielDa(unitById(id)), knoepfe: () => [...document.querySelectorAll('[data-act]')].filter(b => b.offsetParent).map(b => b.dataset.act), spur: (i, c0, r0, c1, r1, o) => { const [x0, y0] = center(c0, r0), [x1, y1] = center(c1, r1); spurSchnee(i, x0, y0, x1, y1, o || {}); }, spurN: () => gmarks.filter(m => m.b === 'spurschnee').length, get schneefall() { return SCHNEEFALL.length; }, pickAt: (cx, cy) => { const rc = cv.getBoundingClientRect(); const ev = { clientX: cx, clientY: cy }; const [x, y] = evToPx(ev), p = pick(x, y); return { h: p.h, uHex: p.uHex && p.uHex.id, uFig: p.uFig && p.uFig.id }; }, get hilfe() { return hilfeModus; }, get sendIds() { return [...sendSet]; }, setFace: (id, f) => { const d = DU.get(id); if (d) d.face = f; },  istSchreiter: id => istSchreiter(unitById(id)), gewehr: v => { GEWEHR_ART = v === 'B' ? 'B' : 'A'; }, get tonNetz() { return TAC ? { zustand: TAC.state, m: TBUS.m.gain.value, e: TBUS.e.gain.value, s: TBUS.s.gain.value } : TAC; }, mischF, schaerfe: n => { SCHAERFE = +n || 0; }, get CAM() { return CAM; }, get ZFIT() { return ZFIT; }, camSetzen: (x, y, z) => { CAM.x = x; CAM.y = y; CAM.z = ZOOM = z; camClamp(); camSetup(); }, ton: { an: on => setSound(on), waffen: () => WAFFE_FEST, duck: () => +musikDuckL.toFixed(2), play: (n, v, sd) => playSound(n, v, sd), ducken: ms => musikDucken(ms) },   /* Paket B Test */ ende: w => { G.over = { winner: w, why: 'goal' }; showEnd(); }, get ort() { return { an: ortAn, lvl: +ortLvl.toFixed(2), wind: windSp.map(w => [+w.a.currentTime.toFixed(1), +(w.a.duration || 0).toFixed(1), +w.a.volume.toFixed(3), w.a.paused]), kraeheIn: Math.round(kraeheT - performance.now()), glockeIn: Math.round(glockeT - performance.now()), glockeRunde }; }, kipp: v => { window.KIPP = v; window.NOKIPP = false; renderTerrain(); }, neuDU: () => { initDU(); syncAll(); }, get bauSicht() { return bauSicht(); }, portraitKey, feldWirkung, bild: v => setBildwirkung(v, true), get BW() { return BW; }, pose: (id, art, dauer) => pose(id, art, dauer || 1500), poseWurf: (id, c, r) => poseWurf(id, ...center(c, r)), posenAn: id => posenAn(unitById(id)), get MARKS() { return MARKS.map(m => ({ x0: m.x0, y0: m.y0, x1: m.x1, y1: m.y1, kind: m.kind, id: m.u.id, tf: m.tf ? [m.tf.a, m.tf.b, m.tf.c, m.tf.d, m.tf.e, m.tf.f] : null })); }, markTips: (id, kind) => markTips({ u: unitById(id), kind }), kz: (id, a, m) => kz(id, a, m), get KZ() { return KZ; }, KZ_ART, kzPose, kzAnwahl: id => kzAnwahl(unitById(id)), kzRunde: sd => kzRunde(sd), get floaters() { return floaters; }, loewe: id => loewenGebruell(unitById(id)), pick: id => { sel = unitById(id); computeOptions(); updateUI(); }, move: (c, r) => doMove(c, r), attack: id => doAttack(unitById(id)), get busyFlag() { return busy; }, get pv() { return pvCache; }, get sel() { return sel; },openShop: () => openShop(), sndPick, SND, playSound, getuemmel: () => ({ an: !!gtA, vol: gtA ? +gtA.volume.toFixed(3) : 0 }), duck: () => ({ f: duckF(), laufend: duckLauf.length, bisMs: Math.round(duckBis - performance.now()) }), get gbw() { gbBereit(); return GBW; }, get musik() { return musik; }, get musikSp() { return musikSp.map(t => [t.name, +t.lvl.toFixed(2), t.aus, +(t.a.volume || 0).toFixed(3)]); }, get musikName() { return musikName; }, setMusikVol: v => { musikVol = v; }, musikTest: { setMusik: (n, f) => setMusik(n, f), setAmbient: on => setAmbient(on) },  get amb() { return [ambient, wetter]; }, tcv: () => tcv, renderTerrain: () => renderTerrain(), paintReady: () => paintReady(),
  hexCss: (c, r) => { let [x, y] = center(c, r); camSetup(); [x, y] = proj(x, y); const rc = cv.getBoundingClientRect(); return [rc.left + x * rc.width / cv.width, rc.top + y * rc.height / cv.height]; }, get cam() { return { ...CAM, ZFIT }; }, setCam: (x, y, z) => { if (z) CAM.z = z; CAM.x = x; CAM.y = y; camClamp(); }, FIGMAP,
  get reach() { return [...reach.values()]; }, get targets() { return [...targets.values()]; }, get shellHexes() { return [...shellHexes]; },
  setSpeed: v => speed = tempo = v, get speed() { return speed; }, cursorFor, CURSOR, get abilSet() { return abilSet; }, get shellHexes() { return shellHexes; }, panelAct: a => panelAct(a), get sndCount() { return window.__snd || 0; }, get sndBy() { return window.__sndBy || {}; }, aufstellFertig: () => aufstellFertig(), get aufstellWahl() { return aufstellWahl; }, rundenSchild: () => rundenSchild(), get G() { return G; }, get busy() { return busy || qRunning; }, E, AI,
  sync: () => syncAll(), get vis() { return { clouds: VIS.clouds.length, supp: [...DU.values()].filter(d => d.vs && d.vs.supp).length, shells: shells.length }; }, play: async evs => { for (const e of evs) await playEvent(e); }, spiel: evs => play(evs), fxPunkte: (a, d) => { const A = DU.get(a), D = DU.get(d); return { seite: fxSeite(a, d), muz: fxMuzzle(a, 0, 0.3), body: bodyPos(d), fa: [A.x, A.y], fd: [D.x, D.y], fbxA: A.fbx, fbxD: D.fbx, Ls: L.s }; },   /* F65 Test */ get pji() { return Object.keys(PJI); }, get mz() { return muzzles.map(m => m.img + ':' + Math.round(m.life)); }, get fxl() { return fxs.map(e => e.b + ':' + Math.round(e.life)); }, get gm() { return gmarks.map(m => m.b); }, fxImpact: (c, r) => { const [x, y] = center(c, r); return fxImpact(x, y, L.s * 0.95); }, get wayPt() { return wayPt; }, get mzp() { return muzzles.map(m => [m.img, Math.round(m.x), Math.round(m.y), +m.ang.toFixed(2)]); }, du: id => { const d = DU.get(id); return d && { x: d.x, y: d.y, face: d.face, muz: d.muz, fbx: d.fbx, bildLinks: d.bildLinks }; }, get fx() { return { sh: shells.length, tr: tracers.length, bo: booms.length, fl: floaters.length }; }, get scoutN() { return scoutSet.size; }, get sightN() { return sightSet.size; }, get spentN() { return spent.size; }, get hideN() { return hideSet.size; }, get readyN() { return readyN; },
  select: id => select(G.units.find(u => u.id === id)), tonWahl: (platz, id) => tonWahl(platz, unitById(id)), pkZiehen, get TONWAHL() { return TONWAHL; }, TON_AUS, MISCHTON, tonPick, waffenTon, stimmPool, stimmZiehen, tonSpurTempo: v => { tempo = speed = v; }, tonSpurStimme: id => selectVoice(unitById(id)), get SND_VAR() { return SND_VAR; }, setSound: on => setSound(on),   /* F91-Test */ poseInfo: id => { const u = G.units.find(x => x.id === id), d = DU.get(id); if (!u || !d || !d.pose) return null; const P0 = d.pose, pa = poseFigur(u, d, 0, null); return { art: P0.art, face: d.face, links: facesLeft(d.face), dxWelt: pa.dx * (facesLeft(d.face) ? -1 : 1), spiegel: !!pa.spiegel, von: P0.von, x: d.x }; }, bereitGrund: id => { const u = G.units.find(x => x.id === id); return u ? bereitGrund(u) : null; }, get sel() { return sel; },
  get marks() { const rc = cv.getBoundingClientRect(); return MARKS.map(m => ({ id: m.u.id, kind: m.kind, x: rc.left + (m.x0 + m.x1) / 2 * rc.width / cv.width, y: rc.top + (m.y0 + m.y1) / 2 * rc.height / cv.height })); },
  ctrl: (i, sd) => { const o = OBJECTIVES[i]; G.ctrl[o.id] = VIS.ctrl[o.id] = sd; updateUI(); }   // Test: Zielfeld i an Seite sd
};
})();
