// ===== ARMARGEDDON KI =====
// Bewertet für jede Einheit alle erreichbaren Felder und Angriffe. Schummelt nicht.
(function (root) {
'use strict';
const E = (typeof module !== 'undefined' && module.exports) ? require('./engine.js') : root.E;
const P = E.P, TYPES = E.TYPES;

const W = {
  A: { threat: 0.35, prog: 0.6, obj: 0.35, cover: 0.5, dmg: 4, counter: 3, cut: 1.6 },
  D: { threat: 0.9, prog: 0, obj: 0.2, hold: 0.45, cover: 0.9, dmg: 4, counter: 3.5, cut: 0 }
};
const ORDER = { art: 0, mg: 1, walker: 2, storm: 3, flame: 3, inf: 4, cav: 5, medic: 6 };
const WISH = { A: ['koloss', 'kohorte', 'feldscher', 'pionier', 'moerser', 'scharf', 'flammen', 'feldkanone'], D: ['sturm', 'grenadier', 'minenwerfer', 'buechse', 'heiler', 'schwer', 'banner', 'grabenk'] };

const COVER = { trench: 1, village: 0.9, forest: 0.7, crater: 0.4, wire: -1.6, bunker: 1.3, fabrik: 1.1, kirche: 0.9, barrikade: 1, wald: 0.9, waldweg: 0.3, bahn: 0.4, furt: -0.6, sumpf: -0.4 };
function coverVal(t) { return COVER[t] || 0; }

function threatAt(G, u, c, r) {
  const t = E.hex(G, c, r).t, D = TYPES[u.type];
  const DM = { trench: 1.6, village: 1.5, kirche: 1.5, fabrik: 1.7, forest: 1.4, crater: 1.2, wire: 0.6, bunker: 2, wald: 1.5, waldweg: 1.2, barrikade: 1.6, bahn: 1.3, furt: 0.8 };
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
      th += sp * P.DMG * f / (D.def * (T.flame ? 1 : defm)) * (0.4 + 0.6 * o.str / 10);
    }
    if (d <= T.mv + 1 && T.atk >= 4) {
      const mm = D.cls === 'walker' ? (T.cls === 'storm' ? 1.5 : T.cls === 'walker' ? 1 : 0.4) : 1;
      th += P.DMG * T.atk * mm / (D.def * (t === 'trench' ? 1.3 : defm)) * 0.5 * (o.str / 10);
    }
  }
  if (E.cloudAt(G, c, r)) th += 0.8;
  return th;
}
function nearestObjDist(G, c, r) {
  let best = 99;
  for (const o of E.OBJECTIVES) { if (G.ctrl[o.id] === 'A') continue; best = Math.min(best, E.dist(c, r, o.c, o.r)); }
  return best === 99 ? 0 : best;
}
function nearestEnemyDist(G, side, c, r) {
  let best = 99;
  for (const o of G.units) if (o.side !== side && E.active(o)) best = Math.min(best, E.dist(c, r, o.c, o.r));
  return best;
}

function posValue(G, u, c, r) {
  const w = W[u.side], h = E.hex(G, c, r), k = TYPES[u.type].relay ? 'medic' : E.cls(u);
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
  if (u.side === 'A') {
    const tw = k === 'walker' ? 0.2 : k === 'cav' ? 1.3 : w.threat * (u.officer ? 1.6 : 1);
    v = coverVal(h.t) * (k === 'walker' || k === 'cav' ? 0 : w.cover) - th * tw * 6;
    v += c * w.prog * (1 + G.turn / 6) * (k === 'cav' ? 0.7 : 1);
    v -= nearestObjDist(G, c, r) * w.obj;
    let friends = 0;
    for (const o of G.units) if (o.side === 'A' && E.active(o) && o.id !== u.id && E.dist(o.c, o.r, c, r) <= 2) friends++;
    v += Math.min(friends, 3) * 0.12;
    if (k === 'walker' && h.t === 'wire') v += 1.0;
  } else if (k === 'storm' || k === 'flame') {
    v = coverVal(h.t) * 0.3 - th * 0.25 * 6 - nearestEnemyDist(G, 'D', c, r) * 0.7;
    for (const o of E.OBJECTIVES) if (G.ctrl[o.id] === 'A') v -= E.dist(c, r, o.c, o.r) * 0.15;
  } else {
    v = coverVal(h.t) * w.cover - th * w.threat * 6 * (u.officer ? 1.6 : 1);
    v -= E.dist(c, r, u.startC, u.startR) * w.hold;
    if (h.obj) v += 1.5;
  }
  if (TYPES[u.type].recover) for (const w of G.units) if (w.side === u.side && E.alive(w) && E.cls(w) === 'walker' && (w.stuck > 0 || w.broken > 0) && E.dist(w.c, w.r, c, r) === 1) v += 2.5;
  if (TYPES[u.type].mg) {
    let tgt = 0;
    for (const o of G.units) if (o.side !== u.side && E.active(o) && E.cls(o) !== 'walker' && E.dist(o.c, o.r, c, r) <= 3) tgt++;
    v += Math.min(tgt, 3) * 0.3;
  }
  return v;
}

function attackValue(G, a, d, kind, o) {
  const p = E.preview(G, a, d, kind, o), w = W[a.side];
  if (p.dmg <= 0.01) return -1;
  let v = p.dmg * w.dmg - p.counter * w.counter;
  const flame = kind === 'fire' && TYPES[a.type].flame;
  const strAfter = d.str - p.dmg;
  const morAfter = d.mor - p.dmg * 0.8 * (flame ? 2 : 1) - (p.arc === 'flank' ? 0.5 : p.arc === 'rear' ? 1 : 0);
  if (strAfter < 1.5 || morAfter <= 0) v += 2.5; else if (morAfter < 3) v += 0.8;
  if (d.officer) v += 0.8;
  if (E.cls(d) === 'art' || E.cls(d) === 'walker') v += 0.8;
  if (kind === 'fire' && !d.supp && d.status === 'ok' && E.cls(d) !== 'walker' && d.fireDmg + p.dmg >= P.SUPP) v += TYPES[d.type].mg ? 2.2 : 1.2;
  if (kind === 'melee' && E.hex(G, d.c, d.r).obj) v += 0.6;
  return v;
}
function bestAttackFrom(G, u, c, r, moved, run) {
  const T = TYPES[u.type];
  let best = null;
  for (const d of G.units) {
    if (d.side === u.side || !E.alive(d)) continue;
    const dd = E.dist(c, r, d.c, d.r);
    if (dd === 1 && T.atk >= 3) {
      const v = attackValue(G, u, d, 'melee', { c, r, run });
      if (!best || v > best.v) best = { v, d, kind: 'melee' };
    }
    if (T.rng && T.cls !== 'art' && !(T.mg && (moved || (!u.setup && u.ap < 2))) && !E.immune(T, TYPES[d.type]) && dd >= 1 &&
        dd <= T.rng + (T.rng > 1 && E.hex(G, c, r).ridge && !E.hex(G, d.c, d.r).ridge ? 1 : 0) && E.hasLOS(G, c, r, d.c, d.r)) {
      const v = attackValue(G, u, d, 'fire', { c, r, run });
      if (!best || v > best.v) best = { v, d, kind: 'fire' };
    }
  }
  return best;
}

function planArt(G, u) {
  if (u.attacked || u.ap < (TYPES[u.type].mobile ? 1 : 2) || u.supp > 0) return null;
  let best = null;
  const consider = (v, c, r, mode) => { if (v > 0.5 && (!best || v > best.v)) best = { v, c, r, mode }; };
  const friendsNear = (c, r, n) => G.units.some(o => o.side === u.side && E.active(o) && E.cls(o) !== 'art' && E.dist(o.c, o.r, c, r) <= n);
  for (const d of G.units) {
    if (d.side === u.side || !E.active(d)) continue;
    if (E.canShell(G, u, d.c, d.r, 'he')) {
      const direct = E.isDirect(G, u, d.c, d.r);
      const dmg = E.shellDmg(G, u, d, direct);
      let v = dmg * 4;
      if (!d.supp && E.cls(d) !== 'walker' && d.fireDmg + dmg >= P.SUPP) v += TYPES[d.type].mg ? 2.2 : 1.2;
      if (d.str - dmg < 1.5 || d.mor - dmg * 0.8 <= 0) v += 2.5;
      if (E.cls(d) === 'walker' && direct) v += 1.5;
      for (const [nc, nr] of E.neighbors(d.c, d.r)) { const f = E.unitAt(G, nc, nr); if (f && f.side === u.side) v -= 0.4; }
      consider(v, d.c, d.r, 'he');
    }
    if (E.canShell(G, u, d.c, d.r, 'barrage')) {
      let v = 0;
      for (const [hc, hr] of [[d.c, d.r], ...E.neighbors(d.c, d.r)]) {
        const x = E.unitAt(G, hc, hr);
        if (!x || !E.active(x) || E.cls(x) === 'walker') continue;
        if (x.side === u.side) v -= 2.5; else if (!x.supp) v += TYPES[x.type].mg ? 2.0 : E.cls(x) === 'art' ? 1.6 : 0.9;
      }
      if (u.side === 'A' && !friendsNear(d.c, d.r, 4)) v *= 0.4;
      consider(v, d.c, d.r, 'barrage');
    }
    if (u.gas > 0 && E.canShell(G, u, d.c, d.r, 'gas')) {
      let ne = 0, nf = 0;
      for (const [gc, gr] of E.gasCells(G, d.c, d.r)) { const x = E.unitAt(G, gc, gr); if (x && E.active(x)) { if (x.side === u.side) nf++; else ne++; } }
      if (ne >= 2 && !friendsNear(d.c, d.r, 2)) consider(ne * 1.7 - nf * 3, d.c, d.r, 'gas');
    }
  }
  if (u.side === 'A') {
    for (let c = 0; c < E.COLS; c++) for (let r = 0; r < E.ROWS; r++) {
      if (E.hex(G, c, r).t !== 'wire' || !E.canShell(G, u, c, r, 'he')) continue;
      const inf = G.units.some(o => o.side === 'A' && E.active(o) && E.cls(o) === 'inf' && E.dist(o.c, o.r, c, r) <= 2);
      const wal = G.units.some(o => o.side === 'A' && E.active(o) && E.cls(o) === 'walker' && !o.broken && E.dist(o.c, o.r, c, r) <= 3);
      if (inf && !wal) consider(0.9, c, r, 'he');
    }
  }
  return best;
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
  if (E.canCut(G, u) && W[u.side].cut > 0) opts.push({ v: here + W[u.side].cut + 1.2, move: null, cut: true });
  for (const [, n] of E.reachable(G, u)) {
    const pv = posValue(G, u, n.c, n.r);
    const atk = n.retreat ? null : bestAttackFrom(G, u, n.c, n.r, true, n.path.length);
    opts.push({ v: pv + (atk ? Math.max(0, atk.v) : 0) - 0.05 * n.cost - (n.retreat ? 0.4 : 0), move: [n.c, n.r], atk: atk && atk.v > 0 ? atk : null });
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
  return us.sort((a, b) => (ORDER[E.cls(a)] - ORDER[E.cls(b)]) || (b.c - a.c) * dir);
}

// Nachschub kaufen: der Reihe nach die Wunschliste, aufgestellt am eigenen Rand nahe am Geschehen
function buy(G) {
  const side = G.side, ev = [];
  G._wish = G._wish || { A: 0, D: 0 };
  for (let guard = 0; guard < 6; guard++) {
    const wl = G.mechs ? WISH[side].concat(side === 'A' ? ['saeger', 'stahl'] : ['knecht', 'panzerk']) : WISH[side];
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
  for (const u of G.units) {   // Befehle der Anführer zuerst
    if (!E.canOrder(G, u) || G._aiDone.has('o' + u.id)) continue;
    G._aiDone.add('o' + u.id);
    let weak = 0, close = 0;
    for (const o of G.units) {
      if (o.side !== u.side || !E.active(o) || E.cls(o) === 'walker' || E.dist(o.c, o.r, u.c, u.r) > E.P.OFFICER_RANGE) continue;
      if (o.supp > 0) weak += 2; else if (o.mor <= E.TYPES[o.type].mor - 1.5) weak++;
      if (E.TYPES[o.type].atk >= 4 && nearestEnemyDist(G, o.side, o.c, o.r) <= E.TYPES[o.type].mv) close++;
    }
    if (weak >= 2 && E.canOrderKind(G, u, 'rally')) return { u: u.id, steps: [{ k: 'order', kind: 'rally' }] };
    if (close >= 2 && E.canOrderKind(G, u, 'storm')) return { u: u.id, steps: [{ k: 'order', kind: 'storm' }] };
  }
  for (const u of order(G, G.side)) {
    if (G._aiDone.has(u.id)) continue;
    G._aiDone.add(u.id);
    const o = planUnit(G, u);
    const steps = [];
    if (TYPES[u.type].recover) for (const w of G.units) if (E.canRecover(G, u, w)) { steps.push({ k: 'recover', t: w.id }); break; }
    if (o.limber) steps.push({ k: 'limber' });
    if (o.shell) steps.push({ k: 'shell', c: o.shell.c, r: o.shell.r, mode: o.shell.mode });
    if (o.cut) steps.push({ k: 'cut' });
    if (o.move) steps.push({ k: 'move', c: o.move[0], r: o.move[1] });
    if (o.atk && TYPES[u.type].mg && !u.setup && !o.move) steps.push({ k: 'setup' });
    if (o.atk) steps.push({ k: o.atk.kind, d: o.atk.d.id });
    if (TYPES[u.type].mg && !o.atk && nearestEnemyDist(G, u.side, o.move ? o.move[0] : u.c, o.move ? o.move[1] : u.r) <= 7) steps.push({ k: 'setup' });
    if (!o.move && !o.atk && !o.cut && !o.shell && !o.limber && E.canOverwatch(G, u) && nearestEnemyDist(G, u.side, u.c, u.r) <= TYPES[u.type].rng + 3 &&
        !(typeof process !== 'undefined' && process.env && process.env['NOOW_' + u.side])) steps.push({ k: 'ow' });
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
  // Zweiter Durchgang: Meldehunde bringen Befehle, dann nutzen Einheiten mit übrigen Aktionspunkten sie (weiter ziehen oder angreifen)
  G._aiDone2 = G._aiDone2 && G._aiKey2 === tk ? G._aiDone2 : new Set(); G._aiKey2 = tk;
  for (const m of G.units) {
    if (m.side !== G.side || !TYPES[m.type].courier || G._aiDone2.has('s' + m.id)) continue;
    G._aiDone2.add('s' + m.id);
    let best = null, bv = 0;
    for (const t of G.units) {
      if (!E.canSend(G, m, t) || t.attacked || t.ap > 1) continue;
      const v = TYPES[t.type].atk + (nearestEnemyDist(G, t.side, t.c, t.r) <= TYPES[t.type].mv + 2 ? 3 : 0);
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
    if (o.cut) steps.push({ k: 'cut' });
    if (TYPES[u.type].mg && !steps.length && E.canSetup(G, u)) steps.push({ k: 'setup' });
    if (steps.length) return { u: u.id, steps };
  }
  return null;
}
function exec(G, uid, s) {
  const u = G.units.find(x => x.id === uid);
  if (!u || !E.active(u)) return [];
  if (s.k === 'move') return E.moveUnit(G, u, s.c, s.r);
  if (s.k === 'turn') return E.turnUnit(G, u, s.face);
  if (s.k === 'cut') return E.cutWire(G, u);
  if (s.k === 'wire') { if (!u.attacked && E.nearestEnemy && E.canLay(G, u)) { const [c, r] = E.layTarget(G, u); let near = 99; for (const o of G.units) if (o.side !== u.side && E.active(o)) near = Math.min(near, E.dist(c, r, o.c, o.r)); if (near <= 5 && near >= 2) return E.layWire(G, u); } return []; }
  if (s.k === 'limber') return E.limber(G, u);
  if (s.k === 'setup') return E.setupMG(G, u);
  if (s.k === 'ow') return E.overwatch(G, u);
  if (s.k === 'recover') { const t = G.units.find(x => x.id === s.t); return t ? E.recover(G, u, t) : []; }
  if (s.k === 'order') return E.order(G, u, s.kind);
  if (s.k === 'send') { const t = G.units.find(x => x.id === s.t); return t ? E.sendOrder(G, u, t) : []; }
  if (s.k === 'heal') {
    let best = null;
    for (const [nc, nr] of E.neighbors(u.c, u.r)) { const o = E.unitAt(G, nc, nr); if (o && E.canHeal(G, u, o) && (!best || o.str < best.str)) best = o; }
    return best ? E.heal(G, u, best) : [];
  }
  if (s.k === 'shell') return E.shell(G, u, s.c, s.r, s.mode);
  const d = G.units.find(x => x.id === s.d);
  if (!d || !E.alive(d)) return [];
  if (s.k === 'fire') return E.canFire(G, u, d) ? E.fire(G, u, d) : [];
  if (s.k === 'melee') return E.canMelee(G, u, d) ? E.melee(G, u, d) : [];
  return [];
}

const AI = { next, exec, buy, W, planUnit };
if (typeof module !== 'undefined' && module.exports) module.exports = AI; else root.AI = AI;
})(this);
