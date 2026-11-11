// KI gegen KI: node tools/sim.js [Anzahl] [Startwert]
const E = require('../src/engine.js');
const AI = require('../src/ai.js');

const N = +(process.argv[2] || 200), seed0 = +(process.argv[3] || 1);
// Übersteuern zum Testen: P_DMG=0.6 INF_MV=3 node tools/sim.js
for (const [k, v] of Object.entries(process.env)) {
  if (k.startsWith('P_')) E.P[k.slice(2)] = +v;
  if (k === 'INF_MV') { E.TYPES.kohorte.mv = +v; E.TYPES.grenadier.mv = +v; }
  if (k === 'CRATER') E.TERRAIN.crater.cost = +v;
  if (k === 'MG_MV') { E.TYPES.mahlwerk.mv = +v; E.TYPES.sense.mv = +v; }
  if (k === 'BREAK_A') E.P.BREAK.A = +v;
  if (k === 'BREAK_D') E.P.BREAK.D = +v;
  if (k === 'AI_THREAT_A') require('../src/ai.js').W.A.threat = +v;
}
const res = { A: 0, D: 0, draw: 0 }, why = {}, turns = [], pts = [], loss = { A: [], D: [] };
const typeLoss = {}, typeCount = {};
const objHeld = {};
let errors = 0;

for (let g = 0; g < N; g++) {
  const G = E.newGame({ seed: seed0 + g * 7919 });
  E.startTurn(G);
  let guard = 0;
  try {
    while (!G.over && guard++ < 5000) {
      const act = AI.next(G);
      if (!act) { E.endTurn(G); continue; }
      for (const s of act.steps) { AI.exec(G, act.u, s); if (G.over) break; }
    }
  } catch (e) { errors++; if (errors < 3) console.error(e); continue; }
  const r = G.over || { winner: null, why: 'guard' };
  res[r.winner || 'draw']++;
  why[(r.winner || 'draw') + ':' + r.why] = (why[(r.winner || 'draw') + ':' + r.why] || 0) + 1;
  turns.push(G.turn); pts.push(E.points(G));
  loss.A.push(E.losses(G, 'A')); loss.D.push(E.losses(G, 'D'));
  for (const o of E.OBJECTIVES) if (G.ctrl[o.id] === 'A') objHeld[o.id] = (objHeld[o.id] || 0) + 1;
  for (const u of G.units) {
    typeCount[u.type] = (typeCount[u.type] || 0) + 1;
    const l = u.status === 'ok' ? (10 - u.str) / 10 : 1;
    typeLoss[u.type] = (typeLoss[u.type] || 0) + l;
  }
}
const avg = a => a.reduce((x, y) => x + y, 0) / Math.max(1, a.length);
const pc = x => (100 * x / N).toFixed(0) + ' %';
console.log(`${N} Schlachten  Konkordat ${pc(res.A)}  Aschenwacht ${pc(res.D)}  unentschieden ${pc(res.draw)}  Fehler ${errors}`);
console.log('Ausgang:', why);
console.log(`Runden Ø ${avg(turns).toFixed(1)}  Punkte Ø ${avg(pts).toFixed(1)}  Ausfälle Ø Konkordat ${(100 * avg(loss.A)).toFixed(0)} %  Aschenwacht ${(100 * avg(loss.D)).toFixed(0)} %`);
console.log('Zielfelder beim Konkordat:', Object.fromEntries(E.OBJECTIVES.map(o => [o.id, pc(objHeld[o.id] || 0)])));
console.log('Verluste je Typ:', Object.fromEntries(Object.keys(typeLoss).map(t => [t, (100 * typeLoss[t] / typeCount[t]).toFixed(0) + ' %'])));
