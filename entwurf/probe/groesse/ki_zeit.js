// KI-Rechenzeit je Zug auf Grauwall ×1/×2/×3 (Node). Aufruf: node entwurf/probe/groesse/ki_zeit.js [Schlachten]
const E = require('../../../src/engine.js'), AI = require('../../../src/ai.js'), probeKarte = require('./probekarte.js');
const N = +(process.argv[2] || 3);
for (const k of [1, 2, 3]) {
  const id = k === 1 ? 'grauwall' : probeKarte(E, k); const zuege = [], runden = [], einheiten = []; let sieg = { A: 0, D: 0 };
  for (let g = 0; g < N; g++) {
    const G = E.newGame({ seed: 11 + g * 7919, map: id }); E.startTurn(G); einheiten.push(G.units.length);
    let guard = 0, t0 = performance.now(), bk = '';
    while (!G.over && guard++ < 20000 && G.turn <= 40) {
      if (bk !== G.turn + G.side) { if (t0) zuege.push(performance.now() - t0); t0 = performance.now(); bk = G.turn + G.side; AI.buy(G); }
      const act = AI.next(G); if (!act) { E.endTurn(G); continue; }
      for (const s of act.steps) { AI.exec(G, act.u, s); if (G.over) break; }
    }
    runden.push(G.turn); if (G.winner) sieg[G.winner] = (sieg[G.winner] || 0) + 1;
  }
  zuege.sort((a, b) => a - b); const mit = zuege.reduce((a, b) => a + b, 0) / zuege.length, p95 = zuege[Math.floor(zuege.length * 0.95)];
  console.log(`×${k} (${E.MAPS[id].cols}×${E.MAPS[id].rows} Felder, ${Math.round(einheiten.reduce((a, b) => a + b) / einheiten.length)} Einheiten): KI je Seitenzug Mittel ${mit.toFixed(0)} ms, 95 % ${p95.toFixed(0)} ms, längster ${zuege[zuege.length - 1].toFixed(0)} ms; Runden Ø ${(runden.reduce((a, b) => a + b) / runden.length).toFixed(1)}`);
}
