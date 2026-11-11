// ===== ARMARGEDDON KI =====
// Bewertet für jede Einheit alle erreichbaren Felder und Angriffe. Schummelt nicht.
(function (root) {
'use strict';
const E = (typeof module !== 'undefined' && module.exports) ? require('./engine.js') : root.E;

const W = {
  A: { threat: 0.35, prog: 0.6, obj: 0.35, hold: 0, cover: 0.5, dmg: 4, counter: 3, cut: 1.6 },
  D: { threat: 0.9, prog: 0, obj: 0.2, hold: 0.45, cover: 0.9, dmg: 4, counter: 3.5, cut: 0 }
};

function coverVal(t) {
  return t === 'trench' ? 1 : t === 'village' ? 0.9 : t === 'forest' ? 0.7 : t === 'crater' ? 0.4 : t === 'wire' ? -1.6 : 0;
}

// erwarteter Beschuss auf ein Feld in der nächsten gegnerischen Runde
function threatAt(G, u, c, r) {
  const t = E.hex(G, c, r).t, D = E.TYPES[u.type];
  let defm = t === 'trench' ? 1.6 : t === 'village' ? 1.5 : t === 'forest' ? 1.4 : t === 'crater' ? 1.2 : t === 'wire' ? 0.6 : 1;
  let th = 0;
  for (const o of G.units) {
    if (o.side === u.side || !E.active(o)) continue;
    const T = E.TYPES[o.type];
    const sp = o.supp > 0 ? 0.35 : 1;
    const d = E.dist(o.c, o.r, c, r);
    if (T.rng && d <= T.rng + (T.mg ? 0 : 1) && E.hasLOS(G, o.c, o.r, c, r)) {
      let f = T.fs * (T.mg && t === 'wire' ? 2 : 1);
      th += sp * 0.45 * f / (D.def * defm) * (0.4 + 0.6 * o.str / 10);
    }
    if (d <= T.mv + 1 && T.cls === 'inf') th += 0.45 * T.atk / (D.def * (t === 'trench' ? 1.3 : defm)) * 0.5 * (o.str / 10);
  }
  return th;
}

function nearestObjDist(G, side, c, r) {
  let best = 99;
  for (const o of E.OBJECTIVES) {
    if (G.ctrl[o.id] === side && side === 'A') continue;
    best = Math.min(best, E.dist(c, r, o.c, o.r));
  }
  return best === 99 ? 0 : best;
}

function posValue(G, u, c, r) {
  const w = W[u.side], h = E.hex(G, c, r);
  let v = coverVal(h.t) * w.cover;
  v -= threatAt(G, u, c, r) * w.threat * 6 * (u.officer ? 1.6 : 1);
  if (u.side === 'A') {
    v += c * w.prog * (1 + G.turn / 6);
    v -= nearestObjDist(G, 'A', c, r) * w.obj;
    // nicht vor der eigenen Masse allein vorpreschen
    let friends = 0;
    for (const o of G.units) if (o.side === 'A' && E.active(o) && o.id !== u.id && E.dist(o.c, o.r, c, r) <= 2) friends++;
    v += Math.min(friends, 3) * 0.12;
  } else {
    v -= E.dist(c, r, u.startC, u.startR) * w.hold;
    if (h.obj) v += 1.5;
  }
  if (E.TYPES[u.type].mg) {
    // MG wollen Schussfeld: Gegner in Reichweite
    let tgt = 0;
    for (const o of G.units) if (o.side !== u.side && E.active(o) && E.dist(o.c, o.r, c, r) <= 3) tgt++;
    v += Math.min(tgt, 3) * 0.3;
  }
  return v;
}

function attackValue(G, a, d, ranged, fc, fr) {
  const p = E.preview(G, a, d, ranged, fc, fr), w = W[a.side];
  let v = p.dmg * w.dmg - p.counter * w.counter;
  const strAfter = d.str - p.dmg;
  const morAfter = d.mor - p.dmg * 0.8 - (p.arc === 'flank' ? 0.5 : p.arc === 'rear' ? 1 : 0);
  if (strAfter < 1.5 || morAfter <= 0) v += 2.5;
  else if (morAfter < 3) v += 0.8;
  if (d.officer) v += 0.8;
  if (ranged && !d.supp && d.status === 'ok' && d.fireDmg + p.dmg >= E.P.SUPP) v += E.TYPES[d.type].mg ? 2.2 : 1.2;
  if (!ranged && E.hex(G, d.c, d.r).obj) v += 0.6;
  return v;
}

function bestAttackFrom(G, u, c, r, moved) {
  const T = E.TYPES[u.type];
  let best = null;
  for (const d of G.units) {
    if (d.side === u.side || !E.alive(d)) continue;
    const dd = E.dist(c, r, d.c, d.r);
    if (dd === 1 && T.atk >= 3) {
      const v = attackValue(G, u, d, false, c, r);
      if (!best || v > best.v) best = { v, d, ranged: false };
    }
    if (T.rng && !(T.mg && moved) && dd >= 1 && dd <= T.rng + (E.hex(G, c, r).ridge && !E.hex(G, d.c, d.r).ridge ? 1 : 0) && E.hasLOS(G, c, r, d.c, d.r)) {
      const v = attackValue(G, u, d, true, c, r);
      if (!best || v > best.v) best = { v, d, ranged: true };
    }
  }
  return best;
}

function planUnit(G, u) {
  const opts = [];
  const here = posValue(G, u, u.c, u.r);
  const atkHere = bestAttackFrom(G, u, u.c, u.r, false);
  opts.push({ v: here + (atkHere ? Math.max(0, atkHere.v) : 0), move: null, atk: atkHere && atkHere.v > 0 ? atkHere : null });
  if (E.hex(G, u.c, u.r).t === 'wire' && E.TYPES[u.type].cls === 'inf' && W[u.side].cut > 0) {
    opts.push({ v: here + W[u.side].cut + 1.2, move: null, cut: true });
  }
  for (const [, n] of E.reachable(G, u)) {
    const pv = posValue(G, u, n.c, n.r);
    const atk = bestAttackFrom(G, u, n.c, n.r, true);
    opts.push({ v: pv + (atk ? Math.max(0, atk.v) : 0) - 0.05 * n.cost, move: [n.c, n.r], atk: atk && atk.v > 0 ? atk : null });
  }
  opts.sort((a, b) => b.v - a.v);
  return opts[0];
}

function order(G, side) {
  const us = G.units.filter(u => u.side === side && E.active(u) && !u.attacked);
  const dir = E.SIDES[side].dir;
  return us.sort((a, b) => {
    const ma = E.TYPES[a.type].mg ? 0 : 1, mb = E.TYPES[b.type].mg ? 0 : 1;
    if (ma !== mb) return ma - mb;
    return (b.c - a.c) * dir;
  });
}

// Nächste Aktion der KI: { u, steps: [ {k:'move',c,r} | {k:'fire'|'melee',d} | {k:'cut'} | {k:'turn',face} ] } oder null
function next(G) {
  if (G.over) return null;
  const tk = G.turn + G.side;
  if (G._aiKey !== tk) { G._aiKey = tk; G._aiDone = new Set(); }
  for (const u of order(G, G.side)) {
    if (G._aiDone.has(u.id)) continue;
    G._aiDone.add(u.id);
    const o = planUnit(G, u);
    const steps = [];
    if (o.cut) steps.push({ k: 'cut' });
    if (o.move) steps.push({ k: 'move', c: o.move[0], r: o.move[1] });
    if (o.atk) steps.push({ k: o.atk.ranged ? 'fire' : 'melee', d: o.atk.d.id });
    if (!o.move && !o.cut && !u.moved) {
      // Front zum gefährlichsten Nachbarn drehen
      const adj = E.adjEnemies(G, u);
      const bad = adj.find(e => E.arcOf(G, u, e.c, e.r) !== 'front');
      if (bad && !adj.some(e => E.arcOf(G, u, e.c, e.r) === 'front')) steps.unshift({ k: 'turn', face: E.faceIndex(E.angleTo(u.c, u.r, bad.c, bad.r)) });
    }
    if (steps.length) return { u: u.id, steps };
  }
  return null;
}

// Führt einen Schritt aus und liefert die Ereignisse
function exec(G, uid, s) {
  const u = G.units.find(x => x.id === uid);
  if (!u || !E.active(u)) return [];
  if (s.k === 'move') return E.moveUnit(G, u, s.c, s.r);
  if (s.k === 'turn') return E.turnUnit(G, u, s.face);
  if (s.k === 'cut') return E.cutWire(G, u);
  const d = G.units.find(x => x.id === s.d);
  if (!d || !E.alive(d)) return [];
  if (s.k === 'fire') return E.canFire(G, u, d) ? E.fire(G, u, d) : [];
  if (s.k === 'melee') return E.canMelee(G, u, d) ? E.melee(G, u, d) : [];
  return [];
}

const AI = { next, exec, W, planUnit };
if (typeof module !== 'undefined' && module.exports) module.exports = AI; else root.AI = AI;
})(this);
