// ===== ARMARGEDDON KI =====
// Bewertet für jede Einheit alle erreichbaren Felder und Angriffe. Schummelt nicht.
(function (root) {
'use strict';
const E = (typeof module !== 'undefined' && module.exports) ? require('./engine.js') : root.E;
const P = E.P, TYPES = E.TYPES;

const W = {
  A: { threat: 0.35, prog: 0.6, obj: 0.35, cover: 0.5, dmg: 4, counter: 3, cut: 1.6 },
  D: { threat: 0.45, prog: 0.45, obj: 0.45, hold: 0.45, cover: 0.6, dmg: 4, counter: 3.2, cut: 1.2 }   // Siegpunkt-Modus: auch die Aschenwacht rückt auf die Zielfelder vor
};
// Gewichte je Karte (MAP.ki, 2026-11-19): z. B. Sankt Ruß – beide Seiten kommen von außen, die Aschenwacht rückt wie ein Angreifer vor.
// Umgebungsvariablen W_x_y gelten weiter vorrangig (Tests).
const WK = { id: null, A: null, D: null };
function wOf(side) {
  const m = E.MAP; if (WK.id !== (m && m.id)) { WK.id = m && m.id; for (const sd of ['A', 'D']) { WK[sd] = Object.assign({}, W[sd], (m && m.ki && m.ki[sd]) || {});
    if (typeof process !== 'undefined' && process.env) for (const k in process.env) { const x = k.match(/^W_([AD])_(\w+)$/); if (x && x[1] === sd) WK[sd][x[2]] = +process.env[k]; } } }
  return WK[side];
}
const ORDER = { art: 0, mg: 1, walker: 2, storm: 3, flame: 3, inf: 4, cav: 5, medic: 6 };
const WISH = { A: ['koloss', 'kohorte', 'feldscher', 'pionier', 'moerser', 'scharf', 'flammen', 'feldkanone', 'rauch'], D: ['sturm', 'grenadier', 'minenwerfer', 'buechse', 'heiler', 'schwer', 'banner', 'lanzeD', 'sturmpz', 'eingreif', 'pirsch'] };

const COVER = { trench: 1, village: 0.9, forest: 0.7, crater: 0.4, wire: -1.6, bunker: 1.3, fabrik: 1.1, kirche: 0.9, barrikade: 1, wald: 0.9, waldweg: 0.3, bahn: 0.4, furt: -0.6, sumpf: -0.4,
  schiff: 1.3, turm: 1.3, garten: 0.3, friedhof: 0.3 };
// Kirche von Sankt Ruß (KI 2026-11-19): Turm besetzen (Schützen, W_TURM), Kirche als Ziel (Deckung oben), Einsturz nutzen (Artillerie/Kanonen auf
// Gegner in der Kirche, W_EINSTURZ je Gegner, der beim Einsturz drin wäre), eigene Truppen aus einer fast eingestürzten Kirche heraus (W_KRISS)
const W_TURM = envZahl('W_TURM', 1.4), W_EINSTURZ = envZahl('W_EINSTURZ', 2.2), W_KRISS = envZahl('W_KRISS', 1.2);
function envZahl(k, d) { const e = typeof process !== 'undefined' && process.env || {}; return e[k] != null ? +e[k] : d; }
// Wert eines Treffers auf ein Kirchenfeld (zusätzlich zum Schaden): je näher der Einsturz, desto mehr; Gegner drin zählen, eigene kosten
function kirchenWert(G, u, c, r) {
  const b = E.bauAt(G, c, r); if (!b || !E.schwereWaffe(u)) return 0;
  const minus = (TYPES[u.type].heMul || 1) > 1 ? 2 : 1, rest = b.hp - minus;
  let feind = 0, eigen = 0;
  for (const [fc, fr] of [...b.felder, ...(b.turm ? [b.turm] : [])]) { const x = E.unitAt(G, fc, fr); if (x && E.alive(x)) { if (x.side === u.side) eigen++; else feind++; } }
  if (rest <= 0) return feind * W_EINSTURZ - eigen * W_EINSTURZ * 1.5 + (feind ? 1 : 0);   // dieser Treffer bringt sie zum Einsturz
  return (feind - eigen * 1.5) * W_EINSTURZ * 0.6 / rest;   // Bauzustand herunterziehen, solange der Gegner drin sitzt
}
function coverVal(t) { return COVER[t] || 0; }

if (typeof process !== 'undefined' && process.env) for (const k in process.env) { const m = k.match(/^W_([AD])_(\w+)$/); if (m) W[m[1]][m[2]] = +process.env[k]; }
const ENVW = typeof process !== 'undefined' && process.env || {};
// Fahrzeuge (KI-Runde 2026-11-17): Begleitschutz und Nahkampf-Bedrohung (W_FZ_NAH: Gewicht der Bedrohung, W_FZ_BEGL: Strafe ohne Begleitung)
const W_FZ_NAH = ENVW.W_FZ_NAH != null ? +ENVW.W_FZ_NAH : 10, W_FZ_BEGL = ENVW.W_FZ_BEGL != null ? +ENVW.W_FZ_BEGL : 4;
const nahKaempfer = T => T.cls === 'storm' || T.cls === 'cav' || !!T.suit || !!T.sapper;
// Erwarteter Nahkampfschaden gegen ein Fahrzeug auf (c, r) in der nächsten gegnerischen Runde: Sturmtruppen, Reiter, Kampfanzüge, Pioniere,
// die ein Nachbarfeld erreichen können. Eigene Trupps auf den Nachbarfeldern versperren Anmarschwege (je Trupp −30 %).
function fzNahGefahr(G, u, c, r) {
  const D = TYPES[u.type]; let th = 0;
  for (const o of G.units) {
    if (o.side === u.side || !E.active(o) || o.broken > 0) continue;
    const T = TYPES[o.type]; if (!nahKaempfer(T) || T.atk < 3) continue;
    if (E.dist(o.c, o.r, c, r) > E.bpMax(o) + 1) continue;
    const mm = T.cls === 'storm' || T.sapper ? P.STORM_VS_WALKER : P.MELEE_VS_WALKER;
    th += P.DMG * T.atk * mm / D.def * (o.str / 10) * (o.supp > 0 ? 0.35 : 1);
  }
  if (!th) return 0;
  let deck = 0;
  for (const [nc, nr] of E.neighbors(c, r)) { const x = E.inMap(nc, nr) && E.unitAt(G, nc, nr); if (x && x.side === u.side && E.active(x) && x.id !== u.id && E.cls(x) !== 'art') deck++; }
  return th * Math.max(0.25, 1 - 0.3 * deck);
}
// Begleitung: eigene Fußtruppen höchstens 2 Felder entfernt, die nicht mehr als 1 Feld hinter dem Fahrzeug stehen
function fzBegleitung(G, u, c, r) {
  const dir = u.side === 'A' ? 1 : -1; let n = 0;
  for (const o of G.units) {
    if (o.side !== u.side || !E.active(o) || o.id === u.id) continue;
    const k = E.cls(o); if (k === 'walker' || k === 'art' || k === 'medic' || TYPES[o.type].relay) continue;
    if (E.dist(o.c, o.r, c, r) <= 2 && (o.c - c) * dir >= -2) n++;
  }
  return n;
}
const W_STURM = ENVW.W_STURM != null ? +ENVW.W_STURM : 0.8, W_OBJSTURM = ENVW.W_OBJSTURM != null ? +ENVW.W_OBJSTURM : 1.6, W_VERTEIL = ENVW.W_VERTEIL != null ? +ENVW.W_VERTEIL : 0.3;
function threatAt(G, u, c, r) {
  const t = E.hex(G, c, r).t, D = TYPES[u.type];
  const DM = { trench: 1.6, village: 1.5, kirche: 1.5, fabrik: 1.7, forest: 1.4, crater: 1.2, wire: 0.6, bunker: 2, wald: 1.5, waldweg: 1.2, barrikade: 1.6, bahn: 1.3, furt: 0.8, schiff: P.KIRCHE_DEF, turm: P.KIRCHE_DEF, garten: 1.1, friedhof: 1.1 };
  const defm = (t === 'village' || t === 'kirche' || t === 'fabrik') && D.cls === 'walker' ? 0.7 : DM[t] || 1;
  let th = 0;
  for (const o of G.units) {
    if (o.side === u.side || !E.active(o)) continue;
    const T = TYPES[o.type];
    const d = E.dist(o.c, o.r, c, r);
    if (T.cls === 'art') { if (D.cls === 'walker' && d <= P.ART_DIRECT && !o.supp) th += P.DMG * T.fs * P.ART_VS_WALKER / D.def * 0.8; continue; }
    const sp = o.supp > 0 || o.broken > 0 ? 0.35 : 1;
    if (T.rng && !E.immune(T, D) && d <= T.rng + (T.mg ? 0 : T.mv > 2 ? 1 : 0) && E.hasLOS(G, o.c, o.r, c, r)) {
      let f = T.fs;
      if (T.mg && (t === 'wire' || D.cls === 'cav')) f *= 2;
      if (D.cls === 'flame') f *= 1.5;
      th += sp * P.DMG * f / (D.def * (T.flame ? 1 : defm)) * (0.4 + 0.6 * o.str / 10) * (E.smokeAt(G, c, r) ? P.NEBEL_IN : 1);   // im Nebel kaum getroffen
    }
    if (d <= T.mv + 1 && T.atk >= 4) {
      const mm = D.cls === 'walker' ? (T.cls === 'storm' ? 1.5 : T.cls === 'walker' ? 1 : 0.4) : 1;
      th += P.DMG * T.atk * mm / (D.def * (t === 'trench' ? 1.3 : defm)) * 0.5 * (o.str / 10);
    }
  }
  if (E.cloudAt(G, c, r) && !E.gasSafe(G, u)) th += 0.8;
  return th;
}
function nearestObjDist(G, c, r, side) {
  side = side || 'A'; let best = 99;
  const tk = G.turn + side; if (G._oc !== tk) { G._oc = tk; G._ocN = {}; for (const o of E.OBJECTIVES) G._ocN[o.id] = G.units.filter(x => x.side === side && E.active(x) && E.cls(x) !== 'art' && E.dist(x.c, x.r, o.c, o.r) <= 2).length; }
  for (const o of E.OBJECTIVES) { if (G.ctrl[o.id] === side) continue; best = Math.min(best, E.dist(c, r, o.c, o.r) - o.pts * 0.3 + Math.max(0, G._ocN[o.id] - 3) * W_VERTEIL); }   // Spieltest Runde 3: Angriff auf mehrere Zielfelder verteilen
  return best === 99 ? 0 : best;
}
// Verteidiger: nächstes Zielfeld, das noch nicht uns gehört oder auf dem kein eigener Trupp steht
function openObjDist(G, u, c, r) {
  let best = 99, any = 99;
  for (const o of E.OBJECTIVES) {
    const d = E.dist(c, r, o.c, o.r); any = Math.min(any, d);
    const x = E.unitAt(G, o.c, o.r);
    if (G.ctrl[o.id] === u.side && x && x.side === u.side && x.id !== u.id) continue;
    best = Math.min(best, d - o.pts * 0.3);
  }
  return best === 99 ? any * 0.4 : best;
}
// Fähigkeiten der Skirmish-Trupps: wann und wohin
function abilPlan(G, u) {
  const k = TYPES[u.type].abil; if (!k || (typeof process !== 'undefined' && process.env && process.env.NOABIL)) return null;
  const tg = E.abilTargets(G, u); if (!tg.length) return null;
  const foe = (c, r) => { const x = E.unitAt(G, c, r); return x && x.side !== u.side && E.alive(x) ? x : null; };
  const area = (c, r) => [[c, r], ...E.neighbors(c, r)].filter(([a, b]) => E.inMap(a, b));
  let best = null, bv = 0;
  // Rauch (KI-Runde 2026-11-17): Sichtlinien gegnerischer Schützen auf eigene Truppen, die die Nebelwand unterbricht – MG und vorrückende Trupps zählen mehr;
  // eigene Schützen im Nebel, die gerade ein Ziel hätten, sind dann blind (Abzug). Vorher: nur eigene bedrohte Trupps im Nebel, oft vor den eigenen Schützen.
  let sicht = null;
  if (k === 'smoke') {
    sicht = []; const angr = mussAngreifen(G, u);
    for (const e of G.units) { if (e.side === u.side || !E.active(e) || e.supp > 0) continue; const T = TYPES[e.type]; if (!(T.rng >= 2) || E.cls(e) === 'art' || (T.mg && !e.setup)) continue;
      for (const x of G.units) { if (x.side !== u.side || !E.active(x) || E.cls(x) === 'art' || E.immune(T, TYPES[x.type])) continue; const d = E.dist(e.c, e.r, x.c, x.r);
        if (d < 1 || d > T.rng || !E.hasLOS(G, e.c, e.r, x.c, x.r) || (T.mg && !E.inFan(G, e, x.c, x.r))) continue;
        sicht.push([e, x, (T.mg ? 1.0 : 0.4) * (angr && TYPES[x.type].atk >= 3 ? 1.3 : 1)]); } }
    for (const x of G.units) { if (x.side !== u.side || !E.active(x) || E.cls(x) === 'art') continue; const T = TYPES[x.type]; if (!(T.rng >= 2) || (T.mg && !x.setup)) continue;   // eigene Schützen, die durch den Nebel nicht mehr treffen
      for (const e of G.units) { if (e.side === u.side || !E.active(e)) continue; const d = E.dist(e.c, e.r, x.c, x.r); if (d < 1 || d > T.rng || !E.hasLOS(G, x.c, x.r, e.c, e.r)) continue; sicht.push([x, e, -(T.mg ? 0.6 : 0.3)]); } }
  }
  // Nebelwand neu (2026-11-18): Rauch vor dem Vorrücken – Felder, die eigene Truppen in diesem Zug erreichen und die offen im gegnerischen
  // Schussfeld (MG-Fächer, Schützen) liegen; dort stehen sie bis zur gegnerischen Runde im Nebel (Beschuss ×0,5). Der Rauchwerfer handelt deshalb zuerst.
  let vorruecker = null, offen = null;
  if (k === 'smoke') {
    offen = new Map();
    const schuetzen = G.units.filter(e => e.side !== u.side && E.active(e) && E.cls(e) !== 'art' && TYPES[e.type].rng >= 2 && !(e.supp > 0) && !(TYPES[e.type].mg && !e.setup));
    const expo = (a, b) => { const key = a + ',' + b; if (offen.has(key)) return offen.get(key); let x = 0;
      for (const e of schuetzen) { const T = TYPES[e.type], d = E.dist(e.c, e.r, a, b); if (d < 1 || d > T.rng || !E.hasLOS(G, e.c, e.r, a, b) || (T.mg && !E.inFan(G, e, a, b))) continue; x += T.mg ? 1 : 0.4; }
      x = Math.min(x, 2) * (coverVal(E.hex(G, a, b).t) >= 0.7 ? 0.4 : 1); offen.set(key, x); return x; };
    vorruecker = [];
    for (const x of G.units) {
      if (x.side !== u.side || !E.active(x) || x.attacked || x.id === u.id || (G._aiDone && G._aiDone.has(x.id)) || E.cls(x) === 'art' || E.cls(x) === 'medic' || TYPES[x.type].relay || (TYPES[x.type].mg && x.setup) || !(x.bp > 0)) continue;
      if (TYPES[x.type].atk < 3 && !(TYPES[x.type].rng >= 2)) continue;
      const nd0 = nearestEnemyDist(G, x.side, x.c, x.r), ziele = new Map();
      for (const [, n] of E.reachable(G, x)) { if (n.retreat || E.unitAt(G, n.c, n.r)) continue; const vor = nearestEnemyDist(G, x.side, n.c, n.r) < nd0 || !!E.hex(G, n.c, n.r).obj; if (!vor) continue; const w = expo(n.c, n.r); if (w > 0) ziele.set(n.c + ',' + n.r, w); }
      if (ziele.size) vorruecker.push(ziele);
    }
  }
  for (const [c, r] of tg) {
    let v = 0;
    if (k === 'smoke') {
      const cells = area(c, r), neu = cells.filter(([a, b]) => !E.smokeAt(G, a, b)).map(([a, b]) => ({ c: a, r: b, side: u.side }));
      for (const z of vorruecker) { let m = 0; for (const [a, b] of cells) m = Math.max(m, z.get(a + ',' + b) || 0); v += m * 0.9; }
      for (const [a, b] of cells) { const x = E.unitAt(G, a, b); if (x && x.side === u.side && E.active(x) && x.id !== u.id) v += Math.min(1, threatAt(G, x, a, b)) * 0.5; }   // wer schon drinsteht, wird kaum getroffen
      G.smoke.push(...neu);
      for (const [e, x, w] of sicht) if (!E.hasLOS(G, e.c, e.r, x.c, x.r) && !cells.some(([a, b]) => a === x.c && b === x.r)) v += w * 0.6;
      G.smoke.length -= neu.length;
      v = v >= 2 ? v : 0;
    }
    else if (k === 'tunnel') {   // Stollen (KI-Runde 2026-11-17): Verteidiger in Deckung bzw. auf Zielfeldern, auf die eigene Angreifer zuziehen (fliegt 2 Runden später)
      const x = foe(c, r);
      if (x && E.cls(x) !== 'cav' && E.cls(x) !== 'walker') {
        let angr = 0; for (const o of G.units) if (o.side === u.side && E.active(o) && E.cls(o) !== 'art' && TYPES[o.type].atk >= 3 && E.dist(o.c, o.r, c, r) >= 2 && E.dist(o.c, o.r, c, r) <= 5) angr++;
        v = 2 + (G.map[c][r].obj ? 2 : 0) + E.coverOf(G, x).tier * 0.5 + (TYPES[x.type].mg || E.cls(x) === 'art' ? 1 : 0) + Math.min(angr, 4) * 0.5 + (10 - x.str) * 0.05;
      }
    }
    else if (k === 'charge') { const x = foe(c, r); v = x ? 2 + (E.cls(x) === 'walker' ? 3 : 0) + (G.map[c][r].t === 'bunker' ? 2 : 0) : (G.map[c][r].t === 'bunker' ? 0.5 : 0); }
    else if (k === 'mine') { const n = nearestEnemyDist(G, u.side, c, r); v = n <= 6 ? 7 - n + (G.map[c][r].t === 'open' || G.map[c][r].t === 'mud' ? 0.5 : 0) : 0; }
    else if (k === 'light') { for (const [a, b] of area(c, r)) if (foe(a, b)) v += 1; v = v >= 1 ? v : 0; }
    else if (k === 'rush') {   // Sturmlauf: Ziel neben einem Gegner, schwache Gegner und Zielfelder bevorzugt
      const fs = E.neighbors(c, r).map(([a, b]) => E.inMap(a, b) && E.unitAt(G, a, b)).filter(x => x && x.side !== u.side && E.alive(x));
      if (fs.length) { const f = fs.sort((x, y) => x.str - y.str)[0]; v = 2 + (10 - f.str) * 0.2 + (G.map[f.c][f.r].obj ? 1 : 0) + (E.cls(f) === 'art' || TYPES[f.type].mg ? 1 : 0) - (E.cls(f) === 'walker' ? 2 : 0) - threatAt(G, u, c, r) * 1.5; }
    }
    else if (k === 'mark') {   // Ziel markieren: Gegner, auf den eigene Artillerie in dieser Runde noch schießen kann
      const x = foe(c, r);
      if (x && E.active(x)) {
        const arts = G.units.filter(a => a.side === u.side && E.active(a) && E.cls(a) === 'art' && !a.attacked && !a.limbered && a.ap >= 1 && E.canShell(G, a, c, r, 'he'));
        v = arts.length ? 1.5 + arts.length * 0.8 + (TYPES[x.type].mg || E.cls(x) === 'art' ? 1 : 0) + (G.map[c][r].obj ? 0.8 : 0) + (x.revealed > 0 ? 0 : 0) : 0;
      }
    }
    else if (k === 'strike') {   // Feuerschlag: wertvolles Ziel, keine eigenen Truppen nebenan (Streuung)
      const x = foe(c, r);
      if (x && E.active(x)) {
        v = 2 + (TYPES[x.type].mg || E.cls(x) === 'art' ? 1.2 : 0) + (G.map[c][r].obj ? 1 : 0) + (10 - x.str) * 0.08 + (E.cls(x) === 'walker' ? -1 : 0);
        for (const [a, b] of E.neighbors(c, r)) { const y = E.inMap(a, b) && E.unitAt(G, a, b); if (y && y.side === u.side) v -= 1.2; }
      }
    }
    else if (k === 'clear') { for (const [a, b] of area(c, r)) { const x = E.unitAt(G, a, b); if (x && x.side === u.side) v += 1; } }
    if (v > bv) { bv = v; best = [c, r]; }
  }
  if (!best) return null;
  const A = E.ABILS[k];
  return { only: !!A.all, step: { k: 'abil', c: best[0], r: best[1] } };
}
function nearestEnemyDist(G, side, c, r) {
  let best = 99;
  for (const o of G.units) if (o.side !== side && E.active(o)) best = Math.min(best, E.dist(c, r, o.c, o.r));
  return best;
}

// Gelände-Gefahren (2026-11-16): Stacheldraht kostet Stärke und hält auf, Gas wirkt nach – stärker meiden
function hazard(G, u, c, r) {
  const T = TYPES[u.type]; let h = 0;
  if (E.hex(G, c, r).t === 'wire' && T.cls !== 'walker' && !E.wireProof(T) && (c !== u.c || r !== u.r)) h += W_HAZ.wire;
  if (E.cloudAt(G, c, r) && !E.gasSafe(G, u)) h += W_HAZ.gas;
  if (E.fireAt(G, c, r)) h += W_HAZ.fire * (T.cls === 'walker' ? 0.5 : 1);   // brennende Felder meiden
  return h;
}
const W_HAZ = { fire: +((typeof process !== 'undefined' && process.env && process.env.W_FIRE) || 2.6), wire: +((typeof process !== 'undefined' && process.env && process.env.W_WIRE) || 1.2), gas: +((typeof process !== 'undefined' && process.env && process.env.W_GAS) || 1.5) };
function posValue(G, u, c, r) { return posValue0(G, u, c, r) - hazard(G, u, c, r); }
function posValue0(G, u, c, r) {
  const w = wOf(u.side), h = E.hex(G, c, r), k = TYPES[u.type].relay || TYPES[u.type].abil === 'smoke' ? 'medic' : E.cls(u);   // Rauchwerfer bleiben hinter den eigenen Trupps (Reichweite 3 genügt)
  const th = threatAt(G, u, c, r);
  let v;
  if (k === 'medic') {
    v = -th * 6;
    let bestH = 0;
    for (const [nc, nr] of E.neighbors(c, r)) { const o = E.unitAt(G, nc, nr); if (o && o.side === u.side && E.active(o) && o.id !== u.id && E.cls(o) !== 'walker') { v += 0.2; bestH = Math.max(bestH, Math.min(1.5, 10 - o.str)); } }
    v += bestH * 1.2;
    let fd = 99; for (const o of G.units) if (o.side === u.side && E.active(o) && o.id !== u.id && E.cls(o) !== 'art' && E.cls(o) !== 'medic') fd = Math.min(fd, E.dist(o.c, o.r, c, r));
    return v - (fd === 99 ? 0 : fd * 0.5);
  }
  if (!(u.side === 'D' && (k === 'storm' || k === 'flame'))) {   // beide Seiten rücken vor und halten Zielfelder
    const tw = k === 'walker' ? 0.2 : k === 'cav' ? 1.3 : w.threat * (u.officer ? 1.6 : 1);
    v = coverVal(h.t) * (k === 'walker' || k === 'cav' ? 0 : w.cover) - th * tw * 6;
    const far = E.OBJECTIVES.reduce((m, o) => Math.max(m, u.side === 'A' ? o.c : E.COLS - 1 - o.c), 0);   // nicht weiter vor als das fernste Zielfeld
    v += Math.min(u.side === 'A' ? c : E.COLS - 1 - c, far) * w.prog * (1 + Math.min(G.turn, 8) / 6) * (k === 'cav' ? 0.7 : 1);
    v -= nearestObjDist(G, c, r, u.side) * w.obj;
    let friends = 0;
    for (const o of G.units) if (o.side === u.side && E.active(o) && o.id !== u.id && E.dist(o.c, o.r, c, r) <= 2) friends++;
    v += Math.min(friends, 3) * 0.12;
    if (TYPES[u.type].cmd) {   // Spieltest Runde 3: Anführer nicht vorneweg – mindestens zwei eigene Trupps sollen näher am Feind stehen
      const nd = nearestEnemyDist(G, u.side, c, r); let vor = 0;
      for (const o of G.units) if (o.side === u.side && E.active(o) && o.id !== u.id && !TYPES[o.type].cmd && E.cls(o) !== 'art' && nearestEnemyDist(G, o.side, o.c, o.r) < nd) vor++;
      if (vor < 2) v -= 1.6 * (2 - vor); if (nd <= 2) v -= 1.2; }
    if (k === 'walker' && h.t === 'wire') v += 1.0;
    if (k === 'walker') {   // KI-Runde 2026-11-17: nicht allein vor, keine Felder, die Sturmtruppen nächste Runde erreichen (außer gedeckt)
      v -= fzNahGefahr(G, u, c, r) * W_FZ_NAH;
      const vor = (u.side === 'A' ? c - u.c : u.c - c) > 0, nd = nearestEnemyDist(G, u.side, c, r);
      if (nd <= 5 && (vor || nd <= 3)) { const b = fzBegleitung(G, u, c, r); if (b === 0) v -= W_FZ_BEGL; else if (b === 1) v -= W_FZ_BEGL * 0.4; }
    }
    if (h.obj && k !== 'art') v += 1 + 0.4 * (E.OBJECTIVES.find(o => o.id === h.obj) || { pts: 1 }).pts;
    v += kirchenPlatz(G, u, c, r);
    // Sturmstellung (BP/AP Schritt 2): Nahkämpfer, die angreifen müssen, enden 2 Felder vor einem Gegner auf einem Zielfeld bzw. im Graben –
    // nächste Runde reicht ein halber Zug bis daneben und der Sturm
    if (W_STURM && TYPES[u.type].atk >= 3 && !E.nahFrei({ type: u.type, bpUsed: 99, bp: 0 }) && mussAngreifen(G, u))
      for (const o of G.units) if (o.side !== u.side && E.active(o) && E.dist(o.c, o.r, c, r) === 2 && (E.hex(G, o.c, o.r).obj || ['trench', 'bunker', 'village', 'kirche', 'fabrik'].includes(E.hex(G, o.c, o.r).t))) { v += W_STURM; break; }
  } else if (k === 'storm' || k === 'flame') {
    v = coverVal(h.t) * 0.3 - th * 0.25 * 6 - nearestEnemyDist(G, 'D', c, r) * 0.7;
    for (const o of E.OBJECTIVES) if (G.ctrl[o.id] !== 'D') v -= E.dist(c, r, o.c, o.r) * 0.15;
  } else {
    v = coverVal(h.t) * w.cover - th * w.threat * 6 * (u.officer ? 1.6 : 1);
    v -= openObjDist(G, u, c, r) * w.hold;
    if (h.obj) v += 2 + 0.5 * (E.OBJECTIVES.find(o => o.id === h.obj) || { pts: 1 }).pts;
    v += kirchenPlatz(G, u, c, r);
  }
  if (TYPES[u.type].abil === 'tunnel' && !(u.cdA > 0))   // Mineure: auf 1–2 Felder an einen Gegner in Graben/Bunker heran
    for (const o of G.units) if (o.side !== u.side && E.active(o) && ['trench', 'bunker', 'barrikade', 'kirche', 'fabrik', 'village'].includes(E.hex(G, o.c, o.r).t) && E.dist(o.c, o.r, c, r) <= 2 && E.dist(o.c, o.r, c, r) >= 1) { v += 1.2 + (E.hex(G, o.c, o.r).obj ? 0.8 : 0); break; }
  if (TYPES[u.type].recover) for (const w of G.units) if (w.side === u.side && E.alive(w) && E.cls(w) === 'walker' && (w.stuck > 0 || w.broken > 0) && E.dist(w.c, w.r, c, r) === 1) v += 2.5;
  if (TYPES[u.type].mg) {
    let tgt = 0;
    for (const o of G.units) if (o.side !== u.side && E.active(o) && E.cls(o) !== 'walker' && E.dist(o.c, o.r, c, r) <= 3) tgt++;
    v += Math.min(tgt, 3) * 0.3;
  }
  return v;
}

// Kirchenfeld als Standort: Turm für Schützen (mehr Gegner in der verlängerten Reichweite = mehr wert), fast eingestürzte Kirche meiden,
// solange der Gegner schwere Waffen hat, die sie erreichen
function kirchenPlatz(G, u, c, r) {
  const t = E.hex(G, c, r).t; if (!E.KIRCHE.has(t)) return 0;
  const T = TYPES[u.type]; let v = 0;
  if (t === 'turm' && T.rng >= 2 && !T.mg) { let n = 0; for (const o of G.units) if (o.side !== u.side && E.active(o) && E.dist(o.c, o.r, c, r) <= T.rng + P.TURM_RNG + 1) n++; v += W_TURM * (0.5 + Math.min(n, 4) * 0.15); }
  const b = E.bauAt(G, c, r);
  if (b && b.hp <= 2) { let s = 0; for (const o of G.units) if (o.side !== u.side && E.active(o) && E.schwereWaffe(o) && E.dist(o.c, o.r, c, r) <= (TYPES[o.type].rng || 0)) s++; v -= W_KRISS * Math.min(s, 2) * (3 - b.hp) / 2; }
  return v;
}
function attackValue(G, a, d, kind, o) {
  const p = E.preview(G, a, d, kind, o), w = wOf(a.side);
  if (p.dmg <= 0.01) return -1;
  let v = p.dmg * w.dmg - p.counter * w.counter;
  const flame = kind === 'fire' && TYPES[a.type].flame;
  const strAfter = d.str - p.dmg;
  const morAfter = d.mor - p.dmg * 0.8 * (flame ? 2 : 1) - (p.arc === 'flank' ? 0.5 : p.arc === 'rear' ? 1 : 0);
  if (strAfter < 1.5 || morAfter <= 0) v += 2.5; else if (morAfter < 3) v += 0.8;
  if (d.officer) v += 0.8;
  if (E.cls(d) === 'art' || E.cls(d) === 'walker') v += 0.8;
  if (kind === 'fire' && !d.supp && d.status === 'ok' && E.cls(d) !== 'walker' && d.fireDmg + p.dmg >= P.SUPP) v += TYPES[d.type].mg ? 2.2 : 1.2;
  if (kind === 'melee' && E.hex(G, d.c, d.r).obj) v += mussAngreifen(G, a) ? W_OBJSTURM : 0.6;   // Zielfeld stürmen, wenn die Seite angreifen muss
  if (kind === 'fire' && E.cls(a) === 'walker') v += kirchenWert(G, a, d.c, d.r);   // Kanone auf die Kirche: Einsturz nutzen
  return v;
}
// Schusswinkel (Fahrplan 2): Fahrzeuge/Schreiter schießen mit der Hauptwaffe nur nach vorn (±60°). Ohne Zug darf die KI vorher drehen (1 Punkt), wenn noch 2 Punkte da sind.
function imBogen(G, u, c, r, d, moved) {
  if (E.cls(u) !== 'walker') return true;
  const f = moved ? E.faceToward(u.face, u.c, u.r, c, r) : u.face;
  if (E.angDiff(E.angleTo(c, r, d.c, d.r), f * 60) <= P.FZ_FAN + 1) return true;
  return !moved && u.ap >= 1 && (u.bp || 0) >= E.drehKosten(u, E.faceToward(u.face, c, r, d.c, d.r));   // Drehen kostet Fahrzeuge BP
}
function bestAttackFrom(G, u, c, r, moved, run, kosten) {
  const nahOk = E.nahFrei(Object.assign({}, u, { bpUsed: (u.bpUsed || 0) + (moved ? kosten || 0 : 0) }));   // Nahkampf nur mit höchstens halb verbrauchten BP (Reiter, Sturm, Kampfanzug frei)
  const T = TYPES[u.type];
  let best = null;
  for (const d of G.units) {
    if (d.side === u.side || !E.alive(d)) continue;
    const dd = E.dist(c, r, d.c, d.r);
    if (dd === 1 && T.atk >= 3 && !(u.supp > 0) && nahOk) {
      const v = attackValue(G, u, d, 'melee', { c, r, run });
      if (!best || v > best.v) best = { v, d, kind: 'melee' };
    }
    if (T.rng && T.cls !== 'art' && !(u.supp > 0) && !u.fellBack && !E.heldAt(G, u, c, r) && !(T.mg && (moved || (!u.setup && (u.bp || 0) < 1))) && !E.immune(T, TYPES[d.type]) && dd >= 1 &&
        dd <= T.rng + (T.rng > 1 && E.hex(G, c, r).ridge && !E.hex(G, d.c, d.r).ridge ? 1 : 0) + (E.hex(G, c, r).t === 'turm' ? P.TURM_RNG : 0) && E.hasLOS(G, c, r, d.c, d.r) && imBogen(G, u, c, r, d, moved)) {
      const v = attackValue(G, u, d, 'fire', { c, r, run });
      if (!best || v > best.v) best = { v, d, kind: 'fire' };
    }
  }
  return best;
}

function planArt(G, u) {
  if (u.attacked || u.ap < 1 || u.supp > 0) return null;
  let best = null;
  const consider = (v, c, r, mode) => { if (v > 0.5 && (!best || v > best.v)) best = { v, c, r, mode }; };
  const friendsNear = (c, r, n) => G.units.some(o => o.side === u.side && E.active(o) && E.cls(o) !== 'art' && E.dist(o.c, o.r, c, r) <= n);
  for (const d of G.units) {
    if (d.side === u.side || !E.active(d)) continue;
    if (E.canShell(G, u, d.c, d.r, 'he')) {
      const direct = E.isDirect(G, u, d.c, d.r);
      const gd = !direct && E.guided(G, u.side, d.c, d.r), dmg = E.shellDmg(G, u, d, direct) * (gd ? P.GUIDED : 1);
      let v = dmg * 4 + (gd ? 0.8 : 0);   // markiertes Ziel: trifft sicher
      if (!d.supp && E.cls(d) !== 'walker' && d.fireDmg + dmg >= P.SUPP) v += TYPES[d.type].mg ? 2.2 : 1.2;
      if (d.str - dmg < 1.5 || d.mor - dmg * 0.8 <= 0) v += 2.5;
      if (E.cls(d) === 'walker' && direct) v += 1.5;
      if (TYPES[u.type].mobile && E.cls(d) !== 'walker') {   // KI-Runde 2026-11-17: Mörser/Minenwerfer auf Gegner in Stellung oder hinter Draht, wenn eigene Angreifer herankommen
        const t = E.hex(G, d.c, d.r).t, fest = ['trench', 'bunker', 'barrikade', 'kirche', 'fabrik', 'village'].includes(t) || E.neighbors(d.c, d.r).some(([a, b]) => E.inMap(a, b) && E.hex(G, a, b).t === 'wire');
        const angr = G.units.some(o => o.side === u.side && E.active(o) && E.cls(o) !== 'art' && TYPES[o.type].atk >= 3 && E.dist(o.c, o.r, d.c, d.r) <= 3);
        if (fest && angr) v += 1.5 + (gd ? 1 : 0);
      }
      for (const [nc, nr] of E.neighbors(d.c, d.r)) { const f = E.unitAt(G, nc, nr); if (f && f.side === u.side) v -= 0.4; }
      v += kirchenWert(G, u, d.c, d.r);   // Einsturz nutzen
      consider(v, d.c, d.r, 'he');
    }
    if (E.canShell(G, u, d.c, d.r, 'barrage')) {
      let v = 0;
      for (const [hc, hr] of E.barrageCells(G, u, d.c, d.r)) {
        const x = E.unitAt(G, hc, hr);
        if (!x || !E.active(x) || E.cls(x) === 'walker') continue;
        if (x.side === u.side) v -= 2.5; else if (!x.supp) v += TYPES[x.type].mg ? 2.0 : E.cls(x) === 'art' ? 1.6 : 0.9;
      }
      if (u.side === 'A' && !friendsNear(d.c, d.r, 4)) v *= 0.4;
      consider(v, d.c, d.r, 'barrage');
    }
    if (u.gas > 0 && E.canShell(G, u, d.c, d.r, 'gas')) {
      // Gas (Balance 2026-11-17): Wert je ungeschütztem Gegner in der Wolke, mehr gegen Gegner in Deckung (Gas fragt nicht nach Deckung, Sprenggranaten schon);
      // eigene Truppen in der Wolke kosten viel, daneben (Drift) etwas. Vorher nur bei 2 Gegnern in der Wolke und keinem Freund bis 2 Felder – kam fast nie vor.
      const zellen = E.gasCells(G, d.c, d.r); let v = 0, ne = 0;
      for (const [gc, gr] of zellen) { const x = E.unitAt(G, gc, gr); if (!x || !E.active(x) || E.gasSafe(G, x)) continue;
        if (x.side === u.side) v -= 3; else { ne++; v += 1.6 + 0.8 * E.coverOf(G, x).tier + (TYPES[x.type].mg ? 0.6 : 0); } }
      for (const o of G.units) if (o.side === u.side && E.active(o) && !E.gasSafe(G, o) && !zellen.some(([gc, gr]) => gc === o.c && gr === o.r) && zellen.some(([gc, gr]) => E.dist(gc, gr, o.c, o.r) === 1)) v -= 0.8;
      if (ne >= 1 && v >= 3) consider(v, d.c, d.r, 'gas');
    }
  }
  for (const b of G.bauten || []) {   // leeres Kirchenfeld beschießen, wenn Gegner in einem anderen Feld der Kirche sitzen (Einsturz)
    if (b.kaputt) continue;
    for (const [c, r] of [...b.felder, ...(b.turm ? [b.turm] : [])]) { if (E.unitAt(G, c, r) || !E.canShell(G, u, c, r, 'he')) continue; const v = kirchenWert(G, u, c, r); if (v > 0) consider(v, c, r, 'he'); }
  }
  if (u.side === 'A') {
    for (let c = 0; c < E.COLS; c++) for (let r = 0; r < E.ROWS; r++) {
      if (E.hex(G, c, r).t !== 'wire' || !E.canShell(G, u, c, r, 'he')) continue;
      const inf = G.units.some(o => o.side === 'A' && E.active(o) && E.cls(o) === 'inf' && E.dist(o.c, o.r, c, r) <= 2);
      const wal = G.units.some(o => o.side === 'A' && E.active(o) && E.cls(o) === 'walker' && !o.broken && E.dist(o.c, o.r, c, r) <= 3);
      if (inf && !wal) consider(TYPES[u.type].mobile ? 1.6 : 0.9, c, r, 'he');
    }
  }
  return best;
}

// Muss die Seite angreifen? Wenn der Gegner mehr Zielfelder hält oder bei Siegpunkten vorn liegt (dann keine Feuerbereitschaft, kein bloßes Warten)
function mussAngreifen(G, u) {
  const sd = u.side, fo = sd === 'A' ? 'D' : 'A', meine = E.OBJECTIVES.filter(o => G.ctrl[o.id] === sd).length, seine = E.OBJECTIVES.filter(o => G.ctrl[o.id] === fo).length;
  return seine >= meine || (G.vp && G.vp[fo] > G.vp[sd]);
}
function planUnit(G, u) {
  const k = E.cls(u);
  if (k === 'art') {
    const near = nearestEnemyDist(G, u.side, u.c, u.r);
    if (u.limbered) { if (near <= 6 || u.side === 'D') return { limber: true }; }
    else {
      const s = planArt(G, u); if (s) return { shell: s };
      if (TYPES[u.type].limber && u.side === 'A' && G.turn >= 4 && near > 8 && E.canLimber(G, u)) return { limber: true };
      if (TYPES[u.type].mv < 2 || u.ap < 1) return { v: 0 };
    }
  }
  const opts = [];
  const here = posValue(G, u, u.c, u.r);
  const atkHere = u.attacked ? null : bestAttackFrom(G, u, u.c, u.r, false, 0);
  opts.push({ v: here + (atkHere ? Math.max(0, atkHere.v) : 0), move: null, atk: atkHere && atkHere.v > 0 ? atkHere : null });
  if (wOf(u.side).cut > 0) {   // Paket 8: Drahtschneider schneiden vom Nachbarfeld aus – den Draht, der Richtung Gegner liegt
    const nd0 = nearestEnemyDist(G, u.side, u.c, u.r); let best = null;
    for (const [c, r] of E.cutTargets(G, u)) { const nd = nearestEnemyDist(G, u.side, c, r); if (nd <= nd0 && (!best || nd < best[2])) best = [c, r, nd]; }
    if (best) opts.push({ v: here + wOf(u.side).cut + 1.2, move: null, cut: [best[0], best[1]] });
  }
  for (const [, n] of E.reachable(G, u)) {
    const pv = posValue(G, u, n.c, n.r);
    const atk = n.retreat ? null : bestAttackFrom(G, u, n.c, n.r, true, n.path.length, n.cost);
    const feuerWeg = n.path.slice(0, -1).filter(([c, r]) => E.fireAt(G, c, r)).length * W_HAZ.fire * (E.cls(u) === 'walker' ? 0.5 : 1);   // Spieltest Runde 3: nicht durch brennende Felder
    opts.push({ v: pv + (atk ? Math.max(0, atk.v) : 0) - 0.05 * n.cost - (n.retreat ? 0.4 : 0) - feuerWeg, move: [n.c, n.r], atk: atk && atk.v > 0 ? atk : null });
  }
  if (!(typeof process !== 'undefined' && process.env && process.env['NOMARCH_' + u.side]))
    for (const [, n] of E.reachable(G, u, { march: true })) {   // Marsch nur zum Anmarsch: Ziel außer Reichweite des Feindes
      if (nearestEnemyDist(G, u.side, n.c, n.r) < 4 || threatAt(G, u, n.c, n.r) > 0.25) continue;
      opts.push({ v: posValue(G, u, n.c, n.r) - 0.05 * n.cost - 0.35, move: [n.c, n.r], atk: null, march: true });
    }
  opts.sort((a, b) => b.v - a.v);
  return opts[0];
}

function order(G, side) {
  const us = G.units.filter(u => u.side === side && E.active(u) && !u.attacked && !u.broken && u.ap >= 1);
  const dir = E.SIDES[side].dir;
  const ord = u => TYPES[u.type].abil === 'mark' || TYPES[u.type].abil === 'smoke' ? -1 : ORDER[E.cls(u)];   // Beobachter markieren vor der Artillerie; Rauch vor dem Vorrücken
  return us.sort((a, b) => (ord(a) - ord(b)) || (b.c - a.c) * dir);
}

// Nachschub kaufen: der Reihe nach die Wunschliste, aufgestellt am eigenen Rand nahe am Geschehen
function buy(G) {
  const side = G.side, ev = [];
  G._wish = G._wish || { A: 0, D: 0 };
  for (let guard = 0; guard < 6; guard++) {
    const wl = G.mechs ? WISH[side].concat(side === 'A' ? ['turm', 'orden', 'stahl'] : ['knecht', 'saeger', 'panzerk']) : WISH[side];
    const type = wl[G._wish[side] % wl.length];
    if (!E.canBuy(G, side, type)) break;
    const hs = E.spawnHexes(G, side, type);
    if (!hs.length) break;
    let row = 6, bd = 99;
    for (const o of G.units) if (o.side === side && E.active(o)) { const d = nearestEnemyDist(G, side, o.c, o.r); if (d < bd) { bd = d; row = o.r; } }
    if (side === 'D' && E.MAP.id === 'grauwall') row = Math.min(row, 5);   // unterhalb liegt der Kanal
    hs.sort((p, q) => (Math.abs(p[1] - row) - Math.abs(q[1] - row)) || (side === 'A' ? q[0] - p[0] : p[0] - q[0]));
    const e = E.buy(G, side, type, hs[0][0], hs[0][1]);
    if (!e.length) break;
    ev.push(...e); G._wish[side]++;
  }
  return ev;
}
function next(G) {
  if (G.over) return null;
  const tk = G.turn + G.side;
  if (G._aiKey !== tk) { G._aiKey = tk; G._aiDone = new Set(); }
  const ENVX = typeof process !== 'undefined' && process.env || {};
  // Großer Befehl des Generals (einmal je Schlacht): nicht in den ersten Runden verschwenden, erst wenn es wirklich zählt
  for (const u of G.units) {
    if (!E.canBig(G, u) || G._aiDone.has('b' + u.id) || G.turn < 3 || ENVX['NOBIG_' + u.side]) continue;
    G._aiDone.add('b' + u.id);
    const own = G.units.filter(o => o.side === u.side && E.active(o) && E.dist(o.c, o.r, u.c, u.r) <= P.BIG_R);   // Paket 8: wirkt nur 3 Felder um den General
    if (u.side === 'A') {   // Halten um jeden Preis: viele eigene Einheiten in Feindberührung oder mit wankender Moral
      const shaky = own.filter(o => E.adjEnemies(G, o).length || o.mor < P.FALLBACK_MOR + 0.5).length;
      if (shaky >= Math.max(3, Math.round(own.length * 0.35))) return { u: u.id, steps: [{ k: 'big' }] };
    } else {   // Generalangriff: zu Beginn des Zugs, wenn viele eigene Einheiten nah am Gegner sind und noch handeln können
      const ready = own.filter(o => !o.attacked && o.ap >= 1 && nearestEnemyDist(G, o.side, o.c, o.r) <= TYPES[o.type].mv + 2 && TYPES[o.type].atk >= 3).length;
      const half = o => u.side === 'D' ? o.c >= E.COLS / 2 : o.c < E.COLS / 2;   // Zielfelder auf der eigenen Hälfte
      const threat = E.OBJECTIVES.some(o => half(o) && (G.ctrl[o.id] && G.ctrl[o.id] !== u.side || G.units.some(e => e.side !== u.side && E.active(e) && E.dist(e.c, e.r, o.c, o.r) <= 1)));   // Gegner steht an oder auf einem eigenen Zielfeld
      if (ready >= Math.max(3, Math.round(own.length * 0.5)) && (threat || G.turn >= 6)) return { u: u.id, steps: [{ k: 'big' }] };
    }
  }
  // Bannerträger: aufpflanzen, wenn der Kampf nah ist und eigene Truppen im Bereich stehen; aufnehmen, wenn der Gegner weit weg ist
  for (const u of G.units) {
    if (u.side !== G.side || !TYPES[u.type].banner || !E.canPlant(G, u) || G._aiDone.has('p' + u.id) || ENVX.NOPLANT) continue;
    G._aiDone.add('p' + u.id);
    const near = nearestEnemyDist(G, u.side, u.c, u.r), friends = G.units.filter(o => o !== u && o.side === u.side && E.active(o) && E.dist(o.c, o.r, u.c, u.r) <= P.BANNER_R_PLANTED).length;
    if (!u.planted && near <= 4 && friends >= 3 && (u.mvd || near <= 2 || G.map[u.c][u.r].obj)) return { u: u.id, steps: [{ k: 'plant' }] };
    if (u.planted && near > 6) return { u: u.id, steps: [{ k: 'plant' }] };
  }
  for (const u of G.units) {   // Befehle der Anführer zuerst
    if (!E.canOrder(G, u) || G._aiDone.has('o' + u.id)) continue;
    G._aiDone.add('o' + u.id);
    let weak = 0, close = 0, shoot = 0;
    for (const o of G.units) {
      if (o.side !== u.side || !E.active(o) || E.cls(o) === 'walker' || E.dist(o.c, o.r, u.c, u.r) > E.cmdRange(u)) continue;
      if (o.supp > 0) weak += 2; else if (o.mor <= E.TYPES[o.type].mor - 1.5) weak++;
      // Spieltest Runde 3: nur Befehle, die in dieser Runde wirken – Sturmbefehl, wenn der Trupp gleich stürmen kann; Feuer frei, wenn er ein Ziel hat
      if (E.TYPES[o.type].atk >= 4 && !o.attacked && o.ap >= 1 && nearestEnemyDist(G, o.side, o.c, o.r) <= (E.nahFrei(o) ? 2 : 1)) close++;
      if (E.TYPES[o.type].rng >= 2 && E.TYPES[o.type].fs >= 2 && !o.attacked && o.ap >= 1 && G.units.some(e => e.side !== o.side && E.canFire(G, o, e))) shoot++;
    }
    if (shoot >= 2 && E.canOrderKind(G, u, 'fire')) return { u: u.id, steps: [{ k: 'order', kind: 'fire' }] };
    if (weak >= 2 && E.canOrderKind(G, u, 'rally')) return { u: u.id, steps: [{ k: 'order', kind: 'rally' }] };
    if (close >= 2 && E.canOrderKind(G, u, 'storm')) return { u: u.id, steps: [{ k: 'order', kind: 'storm' }] };
  }
  for (const u of G.units) {   // Flammenstoß (Bohrkoloss) vor dem Bohrer: der Nahkampf verbraucht alle Punkte
    if (u.side !== G.side || !(TYPES[u.type].zweit && TYPES[u.type].zweit.flamme) || G._aiDone.has('z' + u.id)) continue;
    const tg = E.zweitTargets(G, u); if (!tg.length) continue;
    G._aiDone.add('z' + u.id); tg.sort((a, b) => a.str - b.str);
    return { u: u.id, steps: [{ k: 'zweit', d: tg[0].id }] };
  }
  for (const u of G.units) {   // Löwengebrüll (Kreuzschreiter, 2026-11-20): kostet nichts, vor dem eigenen Angriff, wenn es mindestens 2 Gegner trifft oder einen auf einem Zielfeld bzw. ein MG
    if (u.side !== G.side || !E.canRoar(G, u)) continue;
    const ts = E.roarTargets(G, u);
    if (ts.length >= 2 || ts.some(o => E.hex(G, o.c, o.r).obj || TYPES[o.type].mg)) return { u: u.id, steps: [{ k: 'roar' }] };
  }
  for (const u of order(G, G.side)) {
    if (G._aiDone.has(u.id)) continue;
    G._aiDone.add(u.id);
    const ab = abilPlan(G, u);
    if (ab && ab.only) return { u: u.id, steps: [ab.step] };
    const o = planUnit(G, u);
    const steps = [];
    if (ab) steps.push(ab.step);
    if (TYPES[u.type].recover) for (const w of G.units) if (E.canRecover(G, u, w)) { steps.push({ k: 'recover', t: w.id }); break; }
    if (o.limber) steps.push({ k: 'limber' });
    // MG: Ziel nur außerhalb des Fächers? Erst drehen (frei), dann schießen
    if (TYPES[u.type].mg && u.setup && !o.atk && u.ap >= 1 && !u.attacked) {
      const f0 = u.face; let best = null;
      for (let f = 0; f < 6 && !best; f++) { if (f === f0) continue; u.face = f; const o3 = planUnit(G, u); if (o3.atk && o3.atk.kind === 'fire') best = [f, o3.atk]; }
      u.face = f0;
      if (best) return { u: u.id, steps: [{ k: 'turn', face: best[0] }, { k: 'fire', d: best[1].d.id }] };
    }
    // Aufgebautes MG ohne Ziel: prüfen, ob sich ein Stellungswechsel lohnt (abbauen 1 AP, dann ziehen); aufgebaut wird später
    if (TYPES[u.type].mg && u.setup && !o.atk && E.canTeardown(G, u)) {
      const near = nearestEnemyDist(G, u.side, u.c, u.r);
      if (near > TYPES[u.type].rng) { u.setup = false; u.bp -= 1; const o2 = planUnit(G, u); u.setup = true; u.bp += 1;
        if (o2.move) return { u: u.id, steps: [{ k: 'teardown' }, { k: 'move', c: o2.move[0], r: o2.move[1] }] }; }
    }
    if (o.shell) steps.push({ k: 'shell', c: o.shell.c, r: o.shell.r, mode: o.shell.mode });
    if (o.cut) steps.push({ k: 'cut', c: o.cut[0], r: o.cut[1] });
    if (o.move) steps.push({ k: 'move', c: o.move[0], r: o.move[1] });
    if (o.atk && TYPES[u.type].mg && !u.setup && !o.move) steps.push({ k: 'setup' });
    if (o.atk) steps.push({ k: o.atk.kind, d: o.atk.d.id });
    if (TYPES[u.type].mg && !o.atk && nearestEnemyDist(G, u.side, o.move ? o.move[0] : u.c, o.move ? o.move[1] : u.r) <= 7) steps.push({ k: 'setup' });
    // MG ohne Angriff: Fächer zum nächsten Gegner drehen (Reaktionsfeuer in der gegnerischen Runde)
    if (TYPES[u.type].mg && !o.atk && !o.move) { const e = E.nearestEnemy(G, u); if (e && !E.inFan(G, u, e.c, e.r)) steps.unshift({ k: 'turn', face: E.faceIndex(E.angleTo(u.c, u.r, e.c, e.r)) });
      if (nearestEnemyDist(G, u.side, u.c, u.r) <= TYPES[u.type].rng + 3 && !(typeof process !== 'undefined' && process.env && process.env['NOSPERR_' + u.side])) steps.push({ k: 'sperr' }); }   // Sperrfeuer für die gegnerische Runde
    if (!o.move && !o.atk && !o.cut && !o.shell && !o.limber && E.canOverwatch(G, u) && nearestEnemyDist(G, u.side, u.c, u.r) <= TYPES[u.type].rng + 1 && coverVal(E.hex(G, u.c, u.r).t) >= 0.4 && !mussAngreifen(G, u) &&   // KI-Durchsicht: nur in Deckung, Gegner nah, nicht wenn die Seite vorrücken muss
        !(typeof process !== 'undefined' && process.env && process.env['NOOW_' + u.side])) steps.push({ k: 'ow' });
    if (TYPES[u.type].dig && !o.move && nearestEnemyDist(G, u.side, u.c, u.r) <= 6) steps.push({ k: 'dig' });   // stehen bleiben: eingraben
    if (TYPES[u.type].shieldWall && !o.move && E.neighbors(u.c, u.r).some(([a, b]) => { const x = E.inMap(a, b) && E.unitAt(G, a, b); return x && x.side === u.side && E.active(x) && threatAt(G, x, a, b) > 0.3; })) steps.push({ k: 'shields' });
    if (E.cls(u) === 'medic') steps.push({ k: 'heal' });
    if (TYPES[u.type].wirelayer) steps.push({ k: 'wire' });
    if (!o.shell && !o.limber && !o.move && !o.cut && u.ap >= 1) {
      const adj = E.adjEnemies(G, u);
      const bad = adj.find(e => E.arcOf(G, u, e.c, e.r) !== 'front');
      if (bad && !adj.some(e => E.arcOf(G, u, e.c, e.r) === 'front')) steps.unshift({ k: 'turn', face: E.faceIndex(E.angleTo(u.c, u.r, bad.c, bad.r)) });
    }
    if (steps.length) return { u: u.id, steps };
  }
  if (typeof process !== 'undefined' && process.env && process.env['NO2_' + G.side]) return null;
  // Sturmpanzer: zweiter Schuss der Breitseite auf ein anderes Ziel bis 2 Felder (schwächstes zuerst)
  for (const u of G.units) {
    if (u.side !== G.side || !TYPES[u.type].broadside || !E.active(u) || !u.attacked || (u.bsT || []).length !== 1) continue;
    const t = G.units.filter(d => E.canFire(G, u, d)).sort((x, y) => x.str - y.str)[0];
    if (t) return { u: u.id, steps: [{ k: 'fire', d: t.id }] };
  }
  // Zweiter Durchgang: Meldehunde bringen Befehle, dann nutzen Einheiten mit übrigen Aktionspunkten sie (weiter ziehen oder angreifen)
  for (const u of G.units) if (u.side === G.side && E.active(u) && TYPES[u.type].abil === 'ammo') {
    const t = E.abilTargets(G, u)[0]; if (t) return { u: u.id, steps: [{ k: 'abil', c: t[0], r: t[1] }] };
  }
  G._aiDone2 = G._aiDone2 && G._aiKey2 === tk ? G._aiDone2 : new Set(); G._aiKey2 = tk;
  for (const m of G.units) {
    if (m.side !== G.side || !TYPES[m.type].courier || G._aiDone2.has('s' + m.id)) continue;
    G._aiDone2.add('s' + m.id);
    let best = null, bv = 0;
    for (const t of G.units) {
      if (!E.canSend(G, m, t) || t.attacked || (t.bp || 0) > E.bpMax(t)) continue;
      let v = TYPES[t.type].atk + (nearestEnemyDist(G, t.side, t.c, t.r) <= TYPES[t.type].mv + 2 ? 3 : 0);
      if (E.cls(t) !== 'art' && (t.ap || 0) >= 1) {   // KI-Runde 2026-11-17: gezielt – erreicht die Einheit mit +2 BP ein Zielfeld oder eine Sturmstellung, die sie jetzt nicht erreicht?
        const vor = new Set([...E.reachable(G, t).keys()]); t.bp = (t.bp || 0) + P.MELDER_BP; const nach = E.reachable(G, t); t.bp -= P.MELDER_BP;
        let ziel = 0, nk = 0;
        for (const [key, n] of nach) { if (vor.has(key) || n.retreat) continue;
          const ob = E.hex(G, n.c, n.r).obj; if (ob && G.ctrl[ob] !== t.side && !E.unitAt(G, n.c, n.r)) ziel = Math.max(ziel, 4 + (E.OBJECTIVES.find(o => o.id === ob) || { pts: 1 }).pts * 0.5);
          if (TYPES[t.type].atk >= 4 && E.neighbors(n.c, n.r).some(([a, b]) => { const x = E.inMap(a, b) && E.unitAt(G, a, b); return x && x.side !== t.side && E.active(x); })) nk++; }
        v += ziel + Math.min(nk, 2) * 2;
      }
      if (v > bv) { bv = v; best = t; }
    }
    if (best) { G._aiDone2.delete(best.id); return { u: m.id, steps: [{ k: 'send', t: best.id }] }; }
  }
  for (const u of order(G, G.side)) {
    if (G._aiDone2.has(u.id) || E.cls(u) === 'art') continue;
    { const ENV = typeof process !== 'undefined' && process.env || {}; if (ENV.SKIP2 && ENV.SKIP2.split(',').includes(E.cls(u))) continue; }
    G._aiDone2.add(u.id);
    const o = planUnit(G, u), steps = [];
    const ENV = typeof process !== 'undefined' && process.env || {};
    if (o.move && !ENV['NOMV2_' + G.side]) steps.push({ k: 'move', c: o.move[0], r: o.move[1] });
    if (o.atk && !ENV['NOATK2_' + G.side] && (!o.move || !ENV['NOMV2_' + G.side])) steps.push({ k: o.atk.kind, d: o.atk.d.id });
    if (o.cut) steps.push({ k: 'cut', c: o.cut[0], r: o.cut[1] });
    if (TYPES[u.type].mg && !steps.length && E.canSetup(G, u)) steps.push({ k: 'setup' });
    if (steps.length) return { u: u.id, steps };
  }
  for (const u of G.units) {   // KI-Durchsicht (BP/AP Schritt 2): wer schon gehandelt hat und noch BP hat, zieht in Deckung bzw. vor (nur wenn es die Lage verbessert)
    if (u.side !== G.side || !E.active(u) || !u.attacked || !(u.bp > 0) || G._aiDone2.has('r' + u.id) || E.cls(u) === 'art' || (TYPES[u.type].mg && u.setup)) continue;
    G._aiDone2.add('r' + u.id);
    const o = planUnit(G, u); if (o.move && (o.v || 0) > posValue(G, u, u.c, u.r) + 0.15) return { u: u.id, steps: [{ k: 'move', c: o.move[0], r: o.move[1] }] };
  }
  for (const u of G.units) {   // Paket 8: Zweitwaffe (Seiten-MG, Turm-MG) mit übrigen Punkten
    if (u.side !== G.side || !TYPES[u.type].zweit || G._aiDone.has('z' + u.id)) continue;
    const tg = E.zweitTargets(G, u); if (!tg.length) continue;
    G._aiDone.add('z' + u.id); tg.sort((a, b) => a.str - b.str);
    return { u: u.id, steps: [{ k: 'zweit', d: tg[0].id }] };
  }
  return null;
}
function exec(G, uid, s) {
  const u = G.units.find(x => x.id === uid);
  if (!u || !E.active(u)) return [];
  if (s.k === 'move') return E.moveUnit(G, u, s.c, s.r);
  if (s.k === 'turn') return E.turnUnit(G, u, s.face);
  if (s.k === 'cut') return E.cutWire(G, u, s.c, s.r);
  if (s.k === 'zweit') { const d = G.units.find(x => x.id === s.d); return d ? E.zweitFire(G, u, d) : []; }
  if (s.k === 'wire') { if (!u.attacked && E.nearestEnemy && E.canLay(G, u)) { const [c, r] = E.layTarget(G, u); let near = 99; for (const o of G.units) if (o.side !== u.side && E.active(o)) near = Math.min(near, E.dist(c, r, o.c, o.r)); if (near <= 5 && near >= 2) return E.layWire(G, u); } return []; }
  if (s.k === 'limber') return E.limber(G, u);
  if (s.k === 'setup') return E.setupMG(G, u);
  if (s.k === 'teardown') return E.teardownMG(G, u);
  if (s.k === 'abil') return E.useAbil(G, u, s.c, s.r);
  if (s.k === 'roar') return E.roar(G, u);
  if (s.k === 'ow') return E.overwatch(G, u);
  if (s.k === 'sperr') return E.canSperr(G, u) ? E.sperr(G, u) : [];
  if (s.k === 'recover') { const t = G.units.find(x => x.id === s.t); return t ? E.recover(G, u, t) : []; }
  if (s.k === 'order') return E.order(G, u, s.kind);
  if (s.k === 'big') return E.bigOrder(G, u);
  if (s.k === 'plant') return E.plantBanner(G, u);
  if (s.k === 'dig') return E.canDig(G, u) ? E.dig(G, u) : [];
  if (s.k === 'shields') return E.canShields(G, u) ? E.shieldsUp(G, u) : [];
  if (s.k === 'send') { const t = G.units.find(x => x.id === s.t); return t ? E.sendOrder(G, u, t) : []; }
  if (s.k === 'heal') {
    let best = null;
    for (const [nc, nr] of E.neighbors(u.c, u.r)) { const o = E.unitAt(G, nc, nr); if (o && E.canHeal(G, u, o) && (!best || o.str - (o.poison > 0 ? 2 : 0) < best.str - (best.poison > 0 ? 2 : 0))) best = o; }   // Vergiftete zuerst
    return best ? E.heal(G, u, best) : [];
  }
  if (s.k === 'shell') return E.shell(G, u, s.c, s.r, s.mode);
  const d = G.units.find(x => x.id === s.d);
  if (!d || !E.alive(d)) return [];
  if (s.k === 'fire' && TYPES[u.type].faust && E.canFaust(G, u, d)) {   // Faustsalve (2026-11-20): statt des Schusses, wenn ein zweites Ziel lohnt
    const wert = x => { const p = E.preview(G, u, x, 'fire'), dm = p.dmg * E.P.FAUST_MUL; return Math.min(dm, x.str) + (dm >= x.str - 0.3 ? 3 : 0) + (TYPES[x.type].mg || E.cls(x) === 'art' ? 0.8 : 0) + (E.hex(G, x.c, x.r).obj ? 0.8 : 0); };
    const zw = E.faustTargets(G, u).filter(x => x !== d).sort((a, b) => wert(b) - wert(a))[0];
    if (zw) { const v = wert(d) + wert(zw); if (v >= 4 || wert(d) >= 3 || wert(zw) >= 3 || G.turn >= 10) return E.faust(G, u, d, zw); }
  }
  if (s.k === 'fire') {   // Fahrzeug/Schreiter: Ziel außerhalb des Schussfelds – erst drehen (kostet 1 Punkt), dann schießen
    if (!E.canFire(G, u, d) && E.cls(u) === 'walker' && !u.attacked && u.ap >= 1 && (u.bp || 0) >= E.drehKosten(u, E.faceToward(u.face, u.c, u.r, d.c, d.r))) { const ev = E.turnUnit(G, u, E.faceToward(u.face, u.c, u.r, d.c, d.r)); if (E.canFire(G, u, d)) return ev.concat(E.fire(G, u, d)); return ev; }
    return E.canFire(G, u, d) ? E.fire(G, u, d) : []; }
  if (s.k === 'melee') return E.canMelee(G, u, d) ? E.melee(G, u, d) : [];
  return [];
}

const AI = { next, exec, buy, W, planUnit };
if (typeof module !== 'undefined' && module.exports) module.exports = AI; else root.AI = AI;
})(this);
