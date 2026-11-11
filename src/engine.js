// ===== ARMARGEDDON ENGINE =====
// Reine Spiellogik ohne Browser. Läuft im Browser (window.E) und in Node (require).
(function (root) {
'use strict';

// ---------- Grundwerte (per Simulation abgestimmt) ----------
const P = {
  DMG: 0.6,             // Grundschaden
  FLANK: 1.4, REAR: 1.8, VS_ROUT: 1.6,
  COUNTER: { front: 0.6, flank: 0.3, rear: 0 },
  MOR_PER_DMG: 0.8, MOR_FLANK: 0.5, MOR_REAR: 1, MOR_SURR: 1,
  FALLBACK_MOR: 3, ROUT_STR: 1.5,
  BREAK: { A: 0.55, D: 0.5 },
  TRENCH_DEF: 1.6, CRATER_FIRE: 1.2, VILLAGE_DEF: 1.5, FOREST_DEF: 1.4, WIRE_DEF: 0.6,
  MG_VS_WIRE: 2,
  OFFICER_ATK: 1.15, OFFICER_MOR: 0.8, OFFICER_RANGE: 2, RALLY: 0.6,
  RECOVER: 0.5, RECOVER_COVER: 1,
  MAXT: 16, WIN_A: 5, DRAW_A: 3,
  SUPP: 0.6, SUPP_ATK: 0.5   // Niedergehalten ab 0,6 Beschussschaden pro Zug
};

const COLS = 28, ROWS = 18;

// ---------- Welt und Einheiten ----------
const SIDES = {
  A: { name: 'Konkordat von Valmor', short: 'Konkordat', edge: 0, dir: 1 },
  D: { name: 'Aschenwacht des Grauwalls', short: 'Aschenwacht', edge: COLS - 1, dir: -1 }
};

const TYPES = {
  kohorte: { side: 'A', name: 'Schützenkohorte', cls: 'inf', atk: 4, def: 4, mor: 7, mv: 3, rng: 2, fs: 2,
    can: 'Zieht 3 Felder, schießt 2 Felder weit, stürmt Gräben im Nahkampf, kann Draht schneiden.',
    real: 'Im Ersten Weltkrieg trugen Infanteristen oft rund 30 kg Ausrüstung in den Angriff, quer durch Schlamm und Trichter.' },
  mahlwerk: { side: 'A', name: 'Mahlwerk-Trupp', cls: 'mg', atk: 2, def: 3, mor: 7, mv: 2, rng: 3, fs: 5, mg: true,
    can: 'Schießt 3 Felder weit. Feuert einmal pro gegnerischem Zug von selbst auf Gegner, die sich im Offenen bewegen. Wer zieht, kann nicht schießen.',
    real: 'Maschinengewehre wie das britische Vickers oder das deutsche MG 08 schossen rund 450 bis 500 Schuss pro Minute.' },
  grenadier: { side: 'D', name: 'Aschengrenadiere', cls: 'inf', atk: 4, def: 4, mor: 7, mv: 3, rng: 2, fs: 2,
    can: 'Zieht 3 Felder, schießt 2 Felder weit, hält Gräben und Ruinen, kann Draht schneiden.',
    real: 'Gräben verliefen im Zickzack. So konnte ein eingedrungener Gegner nicht den ganzen Graben entlang schießen.' },
  sense: { side: 'D', name: 'Sensenwerk-Trupp', cls: 'mg', atk: 2, def: 3, mor: 7, mv: 2, rng: 3, fs: 5, mg: true,
    can: 'Schießt 3 Felder weit. Feuert einmal pro gegnerischem Zug von selbst auf Gegner, die sich im Offenen bewegen. Wer zieht, kann nicht schießen.',
    real: 'Am ersten Tag der Somme-Schlacht, dem 1. Juli 1916, hatte die britische Armee rund 57.000 Tote und Verwundete, sehr viele durch MG-Feuer.' }
};

const TERRAIN = {
  open:    { name: 'Offenes Feld', cost: 1, info: 'Keine Deckung.' },
  mud:     { name: 'Schlamm', cost: 2, info: 'Kostet 2 Bewegung.' },
  crater:  { name: 'Granattrichter', cost: 2, info: 'Kostet 2 Bewegung. Abwehr ×1,2 gegen Beschuss.',
             real: 'Trichter füllten sich oft mit Wasser. 1917 bei Passchendaele ertranken Soldaten im Schlamm.' },
  trench:  { name: 'Schützengraben', cost: 1, info: 'Abwehr ×1,6 gegen Beschuss und Angriffe von vorn. Halber Moralverlust.',
             real: 'Die Gräben waren oft über zwei Meter tief, mit Sandsäcken, Unterständen und Verbindungsgräben nach hinten.' },
  wire:    { name: 'Stacheldraht', cost: 1, info: 'Beendet jede Bewegung. Wer drinsteht: Abwehr ×0,6, MG-Feuer ×2. Infanterie kann ihn in einer Runde schneiden.',
             real: 'Vor den Gräben lagen Drahtgürtel, oft viele Meter tief. Artillerie sollte sie zerschießen, scheiterte aber oft daran.' },
  village: { name: 'Ruinen', cost: 1, info: 'Abwehr ×1,5.' },
  forest:  { name: 'Totholz', cost: 2, info: 'Kostet 2 Bewegung. Abwehr ×1,4. Versperrt die Sicht.',
             real: 'Nach Monaten Beschuss blieben von ganzen Wäldern nur Baumstümpfe, etwa im Wald von Delville an der Somme.' },
  canal:   { name: 'Kanal', cost: 99, info: 'Nicht passierbar, nur über die Brücke.' },
  bridge:  { name: 'Brücke', cost: 1, info: 'Einziger Weg über den Kanal.' }
};

const OBJECTIVES = [
  { id: 'veskar', name: 'Ruinen von Veskar', c: 20, r: 7, pts: 2 },
  { id: 'schanze', name: 'Grauwall-Schanze', c: 18, r: 10, pts: 2 },
  { id: 'totholz', name: 'Totholz von Ilm', c: 24, r: 2, pts: 3 },
  { id: 'marn', name: 'Brücke von Marn', c: 23, r: 14, pts: 2 }
];

// [Typ, Spalte, Zeile, Offizier]
const SETUP = [
  ['kohorte', 6, 1], ['kohorte', 6, 3], ['kohorte', 6, 5], ['kohorte', 6, 7, 'Prätor Hask'], ['kohorte', 6, 9],
  ['kohorte', 6, 11], ['kohorte', 6, 13, 'Hauptfrau Morn'], ['kohorte', 6, 15], ['kohorte', 6, 17],
  ['kohorte', 4, 2], ['kohorte', 4, 6], ['kohorte', 4, 10], ['kohorte', 4, 14],
  ['mahlwerk', 5, 4], ['mahlwerk', 5, 8], ['mahlwerk', 5, 12], ['mahlwerk', 5, 16],
  ['grenadier', 13, 2], ['grenadier', 13, 7], ['grenadier', 13, 11, 'Hauptmann Veyl'], ['grenadier', 13, 15],
  ['sense', 13, 4], ['sense', 13, 9], ['sense', 13, 13],
  ['grenadier', 18, 4], ['grenadier', 18, 10, 'Kastellan Orsk'], ['grenadier', 18, 15],
  ['sense', 18, 7], ['sense', 18, 12],
  ['grenadier', 20, 7], ['grenadier', 24, 2], ['grenadier', 24, 14]
];

// ---------- Zufall ----------
function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// ---------- Karte ----------
function buildMap(seed) {
  const rnd = mulberry32(seed || 1917);
  const M = [];
  for (let c = 0; c < COLS; c++) {
    M.push([]);
    for (let r = 0; r < ROWS; r++) M[c].push({ t: 'open', ridge: false, obj: null });
  }
  const set = (c, r, t) => { if (c >= 0 && c < COLS && r >= 0 && r < ROWS) M[c][r].t = t; };
  // Niemandsland: Trichter und Schlamm
  for (let c = 7; c <= 10; c++) for (let r = 0; r < ROWS; r++) {
    const x = rnd();
    if (x < 0.32) set(c, r, 'crater'); else if (x < 0.47) set(c, r, 'mud');
  }
  for (let c = 14; c <= 16; c++) for (let r = 0; r < ROWS; r++) if (rnd() < 0.18) set(c, r, 'crater');
  for (let c = 1; c <= 4; c++) for (let r = 0; r < ROWS; r++) if (rnd() < 0.08) set(c, r, 'mud');
  // Ausgangsgraben des Konkordats
  for (let r = 0; r < ROWS; r++) set(6, r, 'trench');
  // Erste Linie: zwei Drahtgürtel mit versetzten Lücken, dann Graben
  for (let r = 0; r < ROWS; r++) {
    if (![3, 8, 13].includes(r)) set(11, r, 'wire');
    if (![5, 11, 16].includes(r)) set(12, r, 'wire');
    set(13, r, 'trench');
  }
  // Zweite Linie
  for (let r = 0; r < ROWS; r++) {
    if (![2, 7, 12, 16].includes(r)) set(17, r, 'wire');
    set(18, r, 'trench');
  }
  // Höhenrücken mit Veskar
  for (let c = 19; c <= 21; c++) for (let r = 5; r <= 10; r++) M[c][r].ridge = true;
  set(20, 7, 'village'); set(20, 8, 'village'); set(21, 7, 'village');
  // Totholz von Ilm
  const forest = [[22,0],[23,0],[24,0],[25,0],[26,0],[22,1],[23,1],[24,1],[25,1],[26,1],[23,2],[24,2],[25,2],[24,3],[25,3]];
  for (const [c, r] of forest) set(c, r, 'forest');
  // Kanal mit Brücke von Marn
  for (let r = 11; r < ROWS; r++) set(23, r, 'canal');
  set(23, 14, 'bridge');
  set(24, 13, 'village'); set(24, 14, 'village'); set(25, 14, 'village');
  for (const o of OBJECTIVES) M[o.c][o.r].obj = o.id;
  return M;
}

// ---------- Hex-Geometrie (flache Oberseite, ungerade Spalten nach unten versetzt) ----------
const AX = [[1, -1], [1, 0], [0, 1], [-1, 1], [-1, 0], [0, -1]];
const SQ3 = Math.sqrt(3);
function toAx(c, r) { return [c, r - (c - (c & 1)) / 2]; }
function fromAx(q, a) { return [q, a + (q - (q & 1)) / 2]; }
function inMap(c, r) { return c >= 0 && c < COLS && r >= 0 && r < ROWS; }
function neighbors(c, r) {
  const [q, a] = toAx(c, r), out = [];
  for (const [dq, da] of AX) { const [nc, nr] = fromAx(q + dq, a + da); if (inMap(nc, nr)) out.push([nc, nr]); }
  return out;
}
function dist(c1, r1, c2, r2) {
  const [q1, a1] = toAx(c1, r1), [q2, a2] = toAx(c2, r2);
  const dq = q1 - q2, da = a1 - a2;
  return Math.max(Math.abs(dq), Math.abs(da), Math.abs(dq + da));
}
function pos(c, r) { return [1.5 * c, SQ3 * (r + 0.5 * (c & 1))]; }
function angleTo(c1, r1, c2, r2) {
  const [x1, y1] = pos(c1, r1), [x2, y2] = pos(c2, r2);
  return (Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI + 360) % 360;
}
function faceIndex(angle) { return Math.round(angle / 60) % 6; }
function angDiff(a, b) { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; }
const key = (c, r) => c * 100 + r;

function line(c1, r1, c2, r2) {
  // Hexfelder zwischen zwei Feldern (ohne Start und Ziel)
  const n = dist(c1, r1, c2, r2), out = [];
  const [q1, a1] = toAx(c1, r1), [q2, a2] = toAx(c2, r2);
  for (let i = 1; i < n; i++) {
    const t = i / n + 1e-6;
    let q = q1 + (q2 - q1) * t, a = a1 + (a2 - a1) * t, s = -q - a;
    let rq = Math.round(q), ra = Math.round(a), rs = Math.round(s);
    const dq = Math.abs(rq - q), da = Math.abs(ra - a), ds = Math.abs(rs - s);
    if (dq > da && dq > ds) rq = -ra - rs; else if (da > ds) ra = -rq - rs;
    out.push(fromAx(rq, ra));
  }
  return out;
}

// ---------- Spielstand ----------
function newGame(opts) {
  opts = opts || {};
  const G = {
    map: buildMap(1917), units: [], turn: 1, side: 'A', over: null, log: [],
    rng: mulberry32(opts.seed != null ? opts.seed : (Date.now() & 0xffffffff)),
    ctrl: {}, stats: { A: { dmgDealt: 0 }, D: { dmgDealt: 0 } }, nextId: 1
  };
  for (const o of OBJECTIVES) G.ctrl[o.id] = 'D';
  for (const s of SETUP) {
    const T = TYPES[s[0]];
    G.units.push({ id: G.nextId++, type: s[0], side: T.side, c: s[1], r: s[2], officer: s[3] || null,
      str: 10, mor: T.mor, face: T.side === 'A' ? 0 : 3, status: 'ok',
      moved: false, attacked: false, react: true, supp: 0, fireDmg: 0, startC: s[1], startR: s[2] });
  }
  return G;
}

const alive = u => u.status === 'ok' || u.status === 'rout';
const active = u => u.status === 'ok';
const enemyOf = s => s === 'A' ? 'D' : 'A';
function unitAt(G, c, r) { return G.units.find(u => alive(u) && u.c === c && u.r === r) || null; }
function hex(G, c, r) { return G.map[c][r]; }

function adjEnemies(G, u) {
  const out = [];
  for (const [c, r] of neighbors(u.c, u.r)) { const o = unitAt(G, c, r); if (o && o.side !== u.side && active(o)) out.push(o); }
  return out;
}
function isZOC(G, c, r, side) {
  for (const [nc, nr] of neighbors(c, r)) { const o = unitAt(G, nc, nr); if (o && o.side !== side && active(o)) return true; }
  return false;
}
function officerNear(G, u) {
  return G.units.some(o => o.officer && o.side === u.side && active(o) && dist(o.c, o.r, u.c, u.r) <= P.OFFICER_RANGE);
}
function arcOf(G, d, ac, ar) {
  const diff = angDiff(angleTo(d.c, d.r, ac, ar), d.face * 60);
  return diff <= 61 ? 'front' : diff <= 121 ? 'flank' : 'rear';
}

// ---------- Bewegung ----------
function moveCost(G, u, c, r) {
  const t = hex(G, c, r).t;
  return TERRAIN[t].cost;
}
function reachable(G, u) {
  const res = new Map();
  if (!active(u) || u.moved || u.supp > 0) return res;
  const T = TYPES[u.type];
  const mp = isZOC(G, u.c, u.r, u.side) ? 1 : T.mv;
  const start = key(u.c, u.r);
  const best = new Map([[start, 0]]), prev = new Map();
  const queue = [[0, u.c, u.r]];
  while (queue.length) {
    queue.sort((a, b) => a[0] - b[0]);
    const [cost, c, r] = queue.shift();
    if (cost > best.get(key(c, r))) continue;
    const here = key(c, r);
    // Draht und Kontrollzone beenden die Bewegung
    if (here !== start && (hex(G, c, r).t === 'wire' || isZOC(G, c, r, u.side))) continue;
    for (const [nc, nr] of neighbors(c, r)) {
      const occ = unitAt(G, nc, nr);
      if (occ && occ.side !== u.side) continue;
      if (occ && occ.status === 'rout') continue;
      let mc = moveCost(G, u, nc, nr);
      if (mc >= 99) continue;
      let nCost = cost + mc;
      // Mindestens ein Feld darf man immer ziehen
      if (nCost > mp && !(here === start && mp >= 1 && cost === 0)) continue;
      const k = key(nc, nr);
      if (best.has(k) && best.get(k) <= nCost) continue;
      best.set(k, nCost); prev.set(k, here); queue.push([nCost, nc, nr]);
    }
  }
  for (const [k, cost] of best) {
    if (k === start) continue;
    const c = Math.floor(k / 100), r = k % 100;
    if (unitAt(G, c, r)) continue;
    const path = []; let cur = k;
    while (cur !== start) { path.unshift([Math.floor(cur / 100), cur % 100]); cur = prev.get(cur); }
    res.set(k, { c, r, cost, path });
  }
  return res;
}

function nearestEnemy(G, u) {
  let best = null, bd = 1e9;
  for (const o of G.units) if (o.side !== u.side && active(o)) {
    const d = dist(u.c, u.r, o.c, o.r); if (d < bd) { bd = d; best = o; }
  }
  return best;
}
function autoFace(G, u) {
  const e = nearestEnemy(G, u);
  if (e && dist(u.c, u.r, e.c, e.r) <= 4) u.face = faceIndex(angleTo(u.c, u.r, e.c, e.r));
  else u.face = u.side === 'A' ? 0 : 3;
}

function openGround(G, c, r) { return ['open', 'mud', 'crater', 'wire', 'bridge'].includes(hex(G, c, r).t); }

function moveUnit(G, u, c, r) {
  const ev = [];
  const opt = reachable(G, u).get(key(c, r));
  if (!opt) return ev;
  u.moved = true;
  if (TYPES[u.type].mg) u.attacked = true; // MG: Aufbauen kostet die Runde
  let seg = [[u.c, u.r]];
  for (const [nc, nr] of opt.path) {
    u.c = nc; u.r = nr; seg.push([nc, nr]);
    claimObjective(G, u);
    // Reaktionsfeuer feindlicher MG
    if (openGround(G, nc, nr)) {
      const mg = G.units.find(m => m.side !== u.side && active(m) && TYPES[m.type].mg && m.react && !m.supp &&
        dist(m.c, m.r, nc, nr) <= rangeOf(G, m, nc, nr) && hasLOS(G, m.c, m.r, nc, nr));
      if (mg) {
        ev.push({ t: 'move', u: u.id, path: seg }); seg = [[nc, nr]];
        mg.react = false;
        const before = u.status;
        ev.push(...resolveFire(G, mg, u, true));
        if (u.status !== 'ok' || before !== 'ok') { ev.push(...checkEnd(G)); return ev; }
        if (u.c !== nc || u.r !== nr) { ev.push(...checkEnd(G)); return ev; }
      }
    }
  }
  if (seg.length > 1) ev.push({ t: 'move', u: u.id, path: seg });
  autoFace(G, u);
  ev.push({ t: 'face', u: u.id, face: u.face });
  ev.push(...checkEnd(G));
  return ev;
}

function turnUnit(G, u, face) {
  if (!active(u) || (u.moved && !u.turnOnly) || u.attacked || u.supp > 0) return [];
  u.face = ((face % 6) + 6) % 6; u.moved = true; u.turnOnly = true;
  return [{ t: 'face', u: u.id, face: u.face }];
}

function cutWire(G, u) {
  if (!active(u) || u.attacked || TYPES[u.type].cls !== 'inf') return [];
  if (hex(G, u.c, u.r).t !== 'wire') return [];
  hex(G, u.c, u.r).t = 'open'; u.attacked = true; u.moved = true;
  return [{ t: 'cut', u: u.id, c: u.c, r: u.r }];
}

// ---------- Kampf ----------
function rangeOf(G, a, tc, tr) {
  const T = TYPES[a.type];
  let rng = T.rng || 0;
  if (rng && hex(G, a.c, a.r).ridge && !hex(G, tc, tr).ridge) rng += 1;
  return rng;
}
function hasLOS(G, c1, r1, c2, r2) {
  for (const [c, r] of line(c1, r1, c2, r2)) {
    if (!inMap(c, r)) continue;
    const t = hex(G, c, r).t;
    if (t === 'forest' || t === 'village') return false;
  }
  return true;
}
function surrounded(G, u) {
  const adj = adjEnemies(G, u);
  if (adj.length >= 3) return true;
  if (!adj.length) return false;
  return !retreatHex(G, u, null);
}
function canMelee(G, a, d) {
  return active(a) && !a.attacked && alive(d) && d.side !== a.side && dist(a.c, a.r, d.c, d.r) === 1;
}
function canFire(G, a, d) {
  const T = TYPES[a.type];
  if (!active(a) || a.attacked || !T.rng || !alive(d) || d.side === a.side) return false;
  if (T.mg && a.moved) return false;
  const dd = dist(a.c, a.r, d.c, d.r);
  return dd >= 1 && dd <= rangeOf(G, a, d.c, d.r) && hasLOS(G, a.c, a.r, d.c, d.r);
}

function defMods(G, d, arc, ranged, tags) {
  const t = hex(G, d.c, d.r).t;
  let m = 1;
  if (t === 'trench' && (ranged || arc === 'front')) { m *= P.TRENCH_DEF; tags.push('Graben ×1,6'); }
  if (t === 'crater' && ranged) { m *= P.CRATER_FIRE; tags.push('Trichter ×1,2'); }
  if (t === 'village') { m *= P.VILLAGE_DEF; tags.push('Ruinen ×1,5'); }
  if (t === 'forest') { m *= P.FOREST_DEF; tags.push('Totholz ×1,4'); }
  if (t === 'wire') { m *= P.WIRE_DEF; tags.push('im Draht ×0,6'); }
  return m;
}

// Schaden ohne Zufall, für Vorschau und KI
function preview(G, a, d, ranged, fromC, fromR) {
  const ac = fromC != null ? fromC : a.c, ar = fromR != null ? fromR : a.r;
  const A = TYPES[a.type], D = TYPES[d.type], tags = [];
  const arc = arcOf(G, d, ac, ar);
  let atk = ranged ? A.fs : A.atk;
  let m = 1;
  if (arc === 'flank') { m *= P.FLANK; tags.push('Flanke ×1,4'); }
  if (arc === 'rear') { m *= P.REAR; tags.push('Rücken ×1,8'); }
  if (d.status === 'rout') { m *= P.VS_ROUT; tags.push('fliehend ×1,6'); }
  if (ranged && A.mg && hex(G, d.c, d.r).t === 'wire') { m *= P.MG_VS_WIRE; tags.push('MG gegen Draht ×2'); }
  if (!ranged && hex(G, ac, ar).t === 'wire') { m *= 0.7; tags.push('aus dem Draht ×0,7'); }
  if (G.units.some(o => o.officer && o.side === a.side && active(o) && dist(o.c, o.r, ac, ar) <= P.OFFICER_RANGE)) { m *= P.OFFICER_ATK; tags.push('Offizier ×1,15'); }
  if (a.supp > 0) { m *= P.SUPP_ATK; tags.push('niedergehalten ×0,5'); }
  const dm = defMods(G, d, arc, ranged, tags);
  const dmg = P.DMG * (atk / (D.def * dm)) * (0.4 + 0.6 * a.str / 10) * m;
  let counter = 0;
  if (!ranged && d.status === 'ok') {
    const cm = P.COUNTER[arc];
    const at = hex(G, ac, ar).t;
    let adm = at === 'village' ? P.VILLAGE_DEF : at === 'forest' ? P.FOREST_DEF : at === 'wire' ? P.WIRE_DEF : 1;
    const dStrAfter = Math.max(0, d.str - dmg);
    counter = P.DMG * (D.atk / (A.def * adm)) * (0.4 + 0.6 * dStrAfter / 10) * cm;
  }
  return { dmg, counter, arc, tags };
}

function applyDamage(G, a, d, dmg, arc, ev, ranged) {
  const t = hex(G, d.c, d.r).t;
  d.str = Math.max(0, d.str - dmg);
  if (ranged && d.status === 'ok') {
    d.fireDmg += dmg;
    if (d.fireDmg >= P.SUPP && !d.supp) { d.supp = d.side === G.side ? 2 : 1; ev.push({ t: 'supp', u: d.id }); }
  }
  G.stats[a.side].dmgDealt += dmg;
  let ml = dmg * P.MOR_PER_DMG;
  if (arc === 'flank') ml += P.MOR_FLANK;
  if (arc === 'rear') ml += P.MOR_REAR;
  if (d.status === 'ok' && surrounded(G, d)) ml += P.MOR_SURR;
  if (t === 'trench') ml *= 0.5;
  if (officerNear(G, d)) ml *= P.OFFICER_MOR;
  d.mor = Math.max(0, d.mor - ml);
  ev.push({ t: 'hit', u: d.id, dmg, mor: ml, str: d.str, morv: d.mor, a: a.id });
  if (d.str < 0.3) { killUnit(G, d, ev, 'destroyed'); return; }
  if (d.status === 'rout') return;
  if (d.str < P.ROUT_STR || d.mor <= 0) { routUnit(G, d, a, ev); return; }
  if (d.mor < P.FALLBACK_MOR) fallBack(G, d, a, ev);
}

function killUnit(G, u, ev, how) {
  u.status = how === 'escaped' ? 'gone' : 'dead';
  if (u.officer) ev.push({ t: 'officer', u: u.id, name: u.officer });
  ev.push({ t: how, u: u.id });
}

function retreatHex(G, u, from) {
  // freies Nachbarfeld weg vom Gegner, Richtung eigener Rand
  const dir = SIDES[u.side].dir;
  let best = null, bs = -1e9;
  for (const [c, r] of neighbors(u.c, u.r)) {
    if (unitAt(G, c, r)) continue;
    const t = hex(G, c, r).t;
    if (TERRAIN[t].cost >= 99) continue;
    let s = -(c - u.c) * dir * 3;
    if (from) s += dist(c, r, from.c, from.r) * 2;
    let adj = 0; for (const [nc, nr] of neighbors(c, r)) { const o = unitAt(G, nc, nr); if (o && o.side !== u.side && active(o)) adj++; }
    s -= adj * 2;
    if (t === 'trench' || t === 'village') s += 1;
    if (t === 'wire') s -= 2;
    if (s > bs) { bs = s; best = [c, r]; }
  }
  return best;
}

function fallBack(G, u, from, ev) {
  const h = retreatHex(G, u, from);
  if (!h) return;
  const fc = u.c, fr = u.r;
  u.c = h[0]; u.r = h[1];
  ev.push({ t: 'fallback', u: u.id, path: [[fc, fr], h] });
}

function routUnit(G, u, from, ev) {
  u.status = 'rout';
  ev.push({ t: 'rout', u: u.id });
  for (const [c, r] of neighbors(u.c, u.r)) {
    const o = unitAt(G, c, r);
    if (o && o.side === u.side && active(o)) {
      o.mor = Math.max(0, o.mor - 0.5);
      ev.push({ t: 'hit', u: o.id, dmg: 0, mor: 0.5, panic: true, str: o.str, morv: o.mor });
      if (o.mor <= 0) { o.status = 'rout'; ev.push({ t: 'rout', u: o.id }); }
    }
  }
  flee(G, u, 2, ev);
}

function flee(G, u, steps, ev) {
  const edge = SIDES[u.side].edge, dir = SIDES[u.side].dir;
  const path = [[u.c, u.r]];
  for (let i = 0; i < steps; i++) {
    if (u.c === edge) break;
    let best = null, bs = -1e9;
    for (const [c, r] of neighbors(u.c, u.r)) {
      if (unitAt(G, c, r) || TERRAIN[hex(G, c, r).t].cost >= 99) continue;
      let s = -(c - u.c) * dir * 4 - (isZOC(G, c, r, u.side) ? 3 : 0) - (hex(G, c, r).t === 'wire' ? 2 : 0);
      if (s > bs) { bs = s; best = [c, r]; }
    }
    if (!best) break;
    u.c = best[0]; u.r = best[1]; path.push(best);
    if (hex(G, u.c, u.r).t === 'wire') break;
  }
  if (path.length > 1) ev.push({ t: 'flee', u: u.id, path });
  else if (adjEnemies(G, u).length) { killUnit(G, u, ev, 'destroyed'); return; }
  u.face = u.side === 'A' ? 3 : 0;
}

function resolveFire(G, a, d, reaction) {
  const ev = [];
  const p = preview(G, a, d, true);
  const dmg = p.dmg * (0.75 + G.rng() * 0.5);
  if (!reaction) { a.attacked = true; a.face = faceIndex(angleTo(a.c, a.r, d.c, d.r)); }
  ev.push({ t: 'fire', a: a.id, d: d.id, mg: !!TYPES[a.type].mg, reaction: !!reaction, face: a.face });
  applyDamage(G, a, d, dmg, p.arc, ev, true);
  return ev;
}

function fire(G, a, d) {
  if (!canFire(G, a, d)) return [];
  const ev = resolveFire(G, a, d, false);
  ev.push(...checkEnd(G));
  return ev;
}

function melee(G, a, d) {
  if (!canMelee(G, a, d)) return [];
  const ev = [];
  const p = preview(G, a, d, false);
  a.attacked = true; a.moved = true;
  a.face = faceIndex(angleTo(a.c, a.r, d.c, d.r));
  ev.push({ t: 'melee', a: a.id, d: d.id, face: a.face });
  const dmg = p.dmg * (0.75 + G.rng() * 0.5);
  const dc = d.c, dr = d.r;
  applyDamage(G, a, d, dmg, p.arc, ev);
  // Gegenschlag
  if (d.status === 'ok' && d.c === dc && d.r === dr && p.arc !== 'rear') {
    const q = preview(G, d, a, false);
    const cm = P.COUNTER[p.arc];
    const at = hex(G, a.c, a.r).t;
    const adm = at === 'village' ? P.VILLAGE_DEF : at === 'forest' ? P.FOREST_DEF : at === 'wire' ? P.WIRE_DEF : 1;
    const cd = P.DMG * (TYPES[d.type].atk / (TYPES[a.type].def * adm)) * (0.4 + 0.6 * d.str / 10) * cm * (0.75 + G.rng() * 0.5);
    if (cd > 0) { ev.push({ t: 'counter', a: d.id, d: a.id }); applyDamage(G, d, a, cd, 'front', ev); }
    void q;
  }
  // Nachrücken in ein frei gewordenes Feld (Graben stürmen)
  if (active(a) && !unitAt(G, dc, dr) && hex(G, dc, dr).t !== 'canal' && TYPES[a.type].cls === 'inf') {
    const fc = a.c, fr = a.r;
    a.c = dc; a.r = dr; claimObjective(G, a);
    ev.push({ t: 'advance', u: a.id, path: [[fc, fr], [dc, dr]] });
  }
  ev.push(...checkEnd(G));
  return ev;
}

function claimObjective(G, u) {
  if (!active(u)) return;
  const o = hex(G, u.c, u.r).obj;
  if (o) G.ctrl[o] = u.side;
}

// ---------- Rundenablauf ----------
function startTurn(G) {
  const ev = [];
  const s = G.side;
  for (const u of G.units) {
    u.fireDmg = 0;
    if (u.side === s) { u.moved = false; u.attacked = false; u.turnOnly = false; }
    else if (TYPES[u.type].mg) u.react = true;
  }
  for (const u of G.units.filter(x => x.side === s && alive(x))) {
    if (u.status === 'rout') {
      const off = G.units.find(o => o.officer && o.side === s && active(o) && dist(o.c, o.r, u.c, u.r) <= P.OFFICER_RANGE);
      if (off && !adjEnemies(G, u).length && u.str >= P.ROUT_STR && G.rng() < P.RALLY) {
        u.status = 'ok'; u.mor = 3; u.face = s === 'A' ? 0 : 3;
        ev.push({ t: 'rally', u: u.id, by: off.officer });
        u.moved = true; u.attacked = true;
        continue;
      }
      if (u.c === SIDES[s].edge) { killUnit(G, u, ev, 'escaped'); continue; }
      flee(G, u, TYPES[u.type].mv + 1, ev);
      if (alive(u) && u.c === SIDES[s].edge) killUnit(G, u, ev, 'escaped');
      u.moved = true; u.attacked = true;
      continue;
    }
    if (!adjEnemies(G, u).length && !u.supp) {
      const t = hex(G, u.c, u.r).t;
      const rec = (t === 'trench' || t === 'village' || t === 'forest') ? P.RECOVER_COVER : P.RECOVER;
      u.mor = Math.min(TYPES[u.type].mor, u.mor + rec * (officerNear(G, u) ? 1.5 : 1));
    }
  }
  ev.push(...checkEnd(G));
  return ev;
}

function endTurn(G) {
  if (G.over) return [];
  for (const u of G.units) if (u.side === G.side && u.supp > 0) u.supp--;
  if (G.side === 'A') G.side = 'D';
  else {
    if (G.turn >= P.MAXT) { G.over = finalResult(G); return [{ t: 'over', result: G.over }]; }
    G.turn++; G.side = 'A';
  }
  return startTurn(G);
}

function losses(G, side) {
  let total = 0, lost = 0;
  for (const u of G.units) if (u.side === side) {
    total += 10;
    if (u.status === 'ok') lost += 10 - u.str; else lost += 10;
  }
  return lost / total;
}

function points(G) {
  let p = 0;
  for (const o of OBJECTIVES) if (G.ctrl[o.id] === 'A') p += o.pts;
  return p;
}

function finalResult(G) {
  const p = points(G);
  if (p >= P.WIN_A) return { winner: 'A', why: 'points', pts: p };
  if (p >= P.DRAW_A) return { winner: null, why: 'points', pts: p };
  return { winner: 'D', why: 'points', pts: p };
}

function checkEnd(G) {
  if (G.over) return [];
  const la = losses(G, 'A'), ld = losses(G, 'D');
  if (ld >= P.BREAK.D) G.over = { winner: 'A', why: 'break', pts: points(G) };
  else if (la >= P.BREAK.A) G.over = { winner: 'D', why: 'break', pts: points(G) };
  return G.over ? [{ t: 'over', result: G.over }] : [];
}

const E = {
  P, COLS, ROWS, SIDES, TYPES, TERRAIN, OBJECTIVES, SETUP,
  newGame, startTurn, endTurn, reachable, moveUnit, turnUnit, cutWire, fire, melee,
  canFire, canMelee, preview, unitAt, hex, neighbors, dist, angleTo, faceIndex, arcOf,
  isZOC, adjEnemies, losses, points, alive, active, hasLOS, rangeOf, officerNear, key, mulberry32, nearestEnemy
};
if (typeof module !== 'undefined' && module.exports) module.exports = E; else root.E = E;
})(this);
