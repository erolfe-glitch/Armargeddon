// KI gegen KI: node tools/sim.js [Anzahl] [Startwert]
// Karte wählen: MAP=selm|lerne|front (Standard: grauwall)
// Übersteuern zum Testen: P_DMG=0.6 T_koloss_def=7 NOA=walker,art DROP_koloss=1 BREAK_A=0.6 node tools/sim.js
const E = require('../src/engine.js');
const AI = require('../src/ai.js');

const N = +(process.argv[2] || 200), seed0 = +(process.argv[3] || 1);
const KI = { einsturz: 0, runde: [], durch: { A: 0, D: 0 }, typ: {}, turm: { A: 0, D: 0 }, schiff: { A: 0, D: 0 }, zuege: 0 };   // Kirche (Karten mit großen Gebäuden): Einsturz, Besetzung von Turm und Schiff
let noA = [], drop = {};
// Kartenwerte testen: M_winA=6 M_maxT=16, Armeen: MA_kohorte=10 MD_grenadier=9 (Anzahl in der Standardarmee der Karte)
const MP = E.MAPS[process.env.MAP || 'grauwall'];
for (const [k, v] of Object.entries(process.env)) {
  if (k.startsWith('MO_')) MP.objectives.find(o => o.id === k.slice(3)).pts = +v;
  if (k.startsWith('M_')) MP[k.slice(2)] = +v;
  if (k.startsWith('MA_') && MP.army) MP.army.A[k.slice(3)] = +v;
  if (k.startsWith('MD_') && MP.army) MP.army.D[k.slice(3)] = +v;
}
for (const [k, v] of Object.entries(process.env)) {
  if (k.startsWith('P_')) E.P[k.slice(2)] = +v;
  if (k.startsWith('T_')) { const [, t, f] = k.split('_'); E.TYPES[t][f] = +v; }
  if (k === 'BREAK_A') E.P.BREAK.A = +v;
  if (k === 'INC_A') E.P.PTS_TURN.A = +v;
  if (k === 'INC_D') E.P.PTS_TURN.D = +v;
  if (k === 'BREAK_D') E.P.BREAK.D = +v;
  if (k === 'NOA') noA = v.split(',');
  if (k.startsWith('DROP_')) drop[k.slice(5)] = +v;
  if (k.startsWith('AIA_')) AI.W.A[k.slice(4)] = +v;
  if (k.startsWith('AID_')) AI.W.D[k.slice(4)] = +v;
}
const res = { A: 0, D: 0, draw: 0 }, why = {}, turns = [], pts = [], loss = { A: [], D: [] };
const typeLoss = {}, typeCount = {}, objHeld = {};
// Nutzung (2026-11-17, KI-Durchsicht): wie oft die KI jede Handlung bzw. Fähigkeit ausführt (nur erfolgreiche Schritte), je Seite
const nutz = { A: {}, D: {} }, zaehl = (sd, k) => { nutz[sd][k] = (nutz[sd][k] || 0) + 1; };
function schrittName(G, u, s, ev) {
  const T = E.TYPES[u.type];
  if (s.k === 'abil') return 'Fähigkeit ' + T.abil;
  if (s.k === 'order') return 'Befehl ' + s.kind;
  if (s.k === 'shell') return 'Artillerie ' + s.mode;
  if (s.k === 'move') return ev.some(e => e.t === 'march') ? 'Marsch' : 'Zug';
  if (s.k === 'fire' || s.k === 'melee') return s.k === 'fire' ? (T.broadside && (u.bsT || []).length > 1 ? 'Breitseite 2. Schuss' : 'Beschuss') : 'Nahkampf';
  return s.k;
}
let errors = 0;
for (let g = 0; g < N; g++) {
  const parse = v => v ? Object.fromEntries(v.split(',').map(x => { const [t, n] = x.split(':'); return [t, +n]; })) : null;
  const army = { A: parse(process.env.ARMY_A), D: parse(process.env.ARMY_D) };
  for (const sd of ['A', 'D']) if (army[sd] && !process.env.ARMY_FREE && !E.armyOk(sd, army[sd], true)) { console.log('Armee ungültig', sd, E.armyCost(army[sd]), E.armyCount(army[sd])); process.exit(1); }
  const G = E.newGame({ seed: seed0 + g * 7919, army, map: process.env.MAP, mechs: !!process.env.MECHS || !!army.A || !!army.D, free: !!process.env.ARMY_FREE, mischen: !!process.env.MISCHEN });   // MISCHEN=1: Aufstellungsreihenfolge je Schlacht zufällig (Armee-Vergleiche)
  // EXTRA_A/EXTRA_D="typ:n,…": zusätzlich NACH der unveränderten Standardarmee aufstellen (tools/costcheck.js; sonst verschiebt jede
  // zusätzliche Einheit die ganze Aufstellung, und weil die in allen Schlachten gleich ist, verfälscht das den Vergleich um 20–40 Punkte)
  for (const sd of ['A', 'D']) { const ex = parse(process.env['EXTRA_' + sd]); if (ex) { const n0 = G.units.length; E.deploy(G, sd, ex); for (const u of G.units.slice(n0)) { const T = E.TYPES[u.type];
    // je Schlacht auf ein zufälliges freies Feld der Startzone (sonst prüft man 150-mal dieselbe gute oder schlechte Stelle)
    const fz = E.startZone(G, sd).filter(([c, r]) => !E.unitAt(G, c, r) && E.cost(G, u, c, r) < 99); if (fz.length) { const h = fz[Math.floor(G.rng() * fz.length)]; u.c = h[0]; u.r = h[1]; } if (T.mg) u.setup = true; if (T.mines) u.mines = T.mines; if (T.counterStrike) u.cready = true; } } }
  if (noA.length) G.units = G.units.filter(u => !(u.side === 'A' && noA.includes(E.cls(u))));
  for (const [t, n] of Object.entries(drop)) for (let i = 0; i < n; i++) { const x = G.units.findIndex(u => u.type === t); if (x >= 0) G.units.splice(x, 1); }
  E.startTurn(G);
  let guard = 0;
  try {
    let bk = '';
    while (!G.over && guard++ < 8000) {
      if (!process.env.NOBUY && bk !== G.turn + G.side) { bk = G.turn + G.side; const bev = AI.buy(G) || []; for (const e of bev) if (e.t === 'spawn') { const u = G.units.find(x => x.id === e.u); zaehl(u.side, 'Nachschub' + (E.OBJECTIVES.some(o => E.dist(o.c, o.r, u.c, u.r) <= 1) ? ' an Zielfeld' : ' am Rand')); } }
      const act = AI.next(G);
      if (!act) { if (G.bauten && G.bauten.length) { const b = G.bauten[0], tu = b.turm && !b.kaputt && E.unitAt(G, b.turm[0], b.turm[1]); KI.zuege++; if (tu) KI.turm[tu.side]++;
          for (const [c, r] of b.felder) { const x = !b.kaputt && E.unitAt(G, c, r); if (x) KI.schiff[x.side]++; } }
        E.endTurn(G); continue; }
      for (const s of act.steps) { const u = G.units.find(x => x.id === act.u), sd = u && u.side; const ev = AI.exec(G, act.u, s) || [];
        if (u && ev.length) { for (const e of ev) if (e.t === 'einsturz') { KI.einsturz++; KI.runde.push(G.turn); KI.durch[sd]++; KI.typ[u.type] = (KI.typ[u.type] || 0) + 1; } zaehl(sd, schrittName(G, u, s, ev)); for (const e of ev) { if (e.t === 'fire' && e.reaction) zaehl(e.a != null && G.units.find(x => x.id === e.a).side, 'Reaktionsfeuer (Sperrfeuer/Bereitschaft)'); if (e.t === 'spawn') zaehl(sd, 'Nachschub'); } }
        if (G.over) break; }
    }
  } catch (e) { errors++; if (errors < 3) console.error(e); continue; }
  const r = G.over || { winner: null, why: 'guard' };
  res[r.winner || 'draw']++;
  const wk = (r.winner || 'draw') + ':' + r.why; why[wk] = (why[wk] || 0) + 1;
  turns.push(G.turn); pts.push(E.points(G));
  loss.A.push(E.losses(G, 'A')); loss.D.push(E.losses(G, 'D'));
  for (const o of E.OBJECTIVES) if (G.ctrl[o.id] === 'A') objHeld[o.id] = (objHeld[o.id] || 0) + 1;
  for (const u of G.units) {
    typeCount[u.type] = (typeCount[u.type] || 0) + 1;
    typeLoss[u.type] = (typeLoss[u.type] || 0) + (u.status === 'ok' ? (10 - u.str) / 10 : 1);
  }
}
const avg = a => a.reduce((x, y) => x + y, 0) / Math.max(1, a.length);
const pc = x => (100 * x / N).toFixed(0) + ' %';
if (MP.bauten) console.log(`Kirche: Einsturz in ${pc(KI.einsturz)} der Schlachten (Runde Ø ${avg(KI.runde).toFixed(1)}, durch Konkordat ${KI.durch.A} / Aschenwacht ${KI.durch.D}, ${JSON.stringify(KI.typ)}); Turm besetzt ${(100 * KI.turm.A / Math.max(1, KI.zuege)).toFixed(0)} % / ${(100 * KI.turm.D / Math.max(1, KI.zuege)).toFixed(0)} % der Züge, Schiff ${(50 * KI.schiff.A / Math.max(1, KI.zuege)).toFixed(0)} % / ${(50 * KI.schiff.D / Math.max(1, KI.zuege)).toFixed(0)} %`);
console.log(`${N} Schlachten  Konkordat ${pc(res.A)}  Aschenwacht ${pc(res.D)}  unentschieden ${pc(res.draw)}  Fehler ${errors}`);
console.log('Ausgang:', JSON.stringify(why));
console.log(`Runden Ø ${avg(turns).toFixed(1)}  Punkte Ø ${avg(pts).toFixed(1)}  Ausfälle Ø Konkordat ${(100 * avg(loss.A)).toFixed(0)} %  Aschenwacht ${(100 * avg(loss.D)).toFixed(0)} %`);
console.log('Zielfelder beim Konkordat:', JSON.stringify(Object.fromEntries(E.OBJECTIVES.map(o => [o.id, pc(objHeld[o.id] || 0)]))));
console.log('Verluste je Typ:', JSON.stringify(Object.fromEntries(Object.keys(typeLoss).map(t => [t, (100 * typeLoss[t] / typeCount[t]).toFixed(0) + ' %']))));
if (!process.env.KURZ) {
  const alle = [...new Set([...Object.keys(nutz.A), ...Object.keys(nutz.D)])].sort();
  console.log('Nutzung je Schlacht (Konkordat / Aschenwacht):');
  for (const k of alle) { const a = (nutz.A[k] || 0) / N, d = (nutz.D[k] || 0) / N; console.log(`  ${k.padEnd(40)} ${a.toFixed(2).padStart(6)} / ${d.toFixed(2).padStart(6)}${a + d < 0.1 ? '   ← selten' : ''}`); }
}
