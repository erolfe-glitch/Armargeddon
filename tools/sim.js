// KI gegen KI: node tools/sim.js [Anzahl] [Startwert]
// Übersteuern zum Testen: P_DMG=0.6 T_koloss_def=7 NOA=walker,art DROP_koloss=1 BREAK_A=0.6 node tools/sim.js
const E = require('../src/engine.js');
const AI = require('../src/ai.js');

const N = +(process.argv[2] || 200), seed0 = +(process.argv[3] || 1);
let noA = [], drop = {};
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
let errors = 0;
for (let g = 0; g < N; g++) {
  const parse = v => v ? Object.fromEntries(v.split(',').map(x => { const [t, n] = x.split(':'); return [t, +n]; })) : null;
  const army = { A: parse(process.env.ARMY_A), D: parse(process.env.ARMY_D) };
  for (const sd of ['A', 'D']) if (army[sd] && !E.armyOk(sd, army[sd], true)) { console.log('Armee ungültig', sd, E.armyCost(army[sd]), E.armyCount(army[sd])); process.exit(1); }
  const G = E.newGame({ seed: seed0 + g * 7919, army, mechs: true });
  if (noA.length) G.units = G.units.filter(u => !(u.side === 'A' && noA.includes(E.cls(u))));
  for (const [t, n] of Object.entries(drop)) for (let i = 0; i < n; i++) { const x = G.units.findIndex(u => u.type === t); if (x >= 0) G.units.splice(x, 1); }
  E.startTurn(G);
  let guard = 0;
  try {
    let bk = '';
    while (!G.over && guard++ < 8000) {
      if (!process.env.NOBUY && bk !== G.turn + G.side) { bk = G.turn + G.side; AI.buy(G); }
      const act = AI.next(G);
      if (!act) { E.endTurn(G); continue; }
      for (const s of act.steps) { AI.exec(G, act.u, s); if (G.over) break; }
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
console.log(`${N} Schlachten  Konkordat ${pc(res.A)}  Aschenwacht ${pc(res.D)}  unentschieden ${pc(res.draw)}  Fehler ${errors}`);
console.log('Ausgang:', JSON.stringify(why));
console.log(`Runden Ø ${avg(turns).toFixed(1)}  Punkte Ø ${avg(pts).toFixed(1)}  Ausfälle Ø Konkordat ${(100 * avg(loss.A)).toFixed(0)} %  Aschenwacht ${(100 * avg(loss.D)).toFixed(0)} %`);
console.log('Zielfelder beim Konkordat:', JSON.stringify(Object.fromEntries(E.OBJECTIVES.map(o => [o.id, pc(objHeld[o.id] || 0)]))));
console.log('Verluste je Typ:', JSON.stringify(Object.fromEntries(Object.keys(typeLoss).map(t => [t, (100 * typeLoss[t] / typeCount[t]).toFixed(0) + ' %']))));
