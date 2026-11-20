// KI-Aktivität messen (F43, Spieltest Runde 4): Wie weit rückt eine Seite vor, wie oft greift sie an, wie oft betritt sie gegnerische Zielfelder?
// Aufruf: node tools/ki_aktiv.js [Schlachten] [Startwert]   Umgebung: MAP=…, SEITE=D (gemessene Seite), KI_AKTIV=D (aktive KI wie gegen einen Menschen),
// HALTEN=1 (die andere Seite zieht ab Runde HALT_AB+1 nicht mehr, schießt nur – wie ein vorsichtiger Spieler), RUNDEN=12 (Abbruch)
const E = require('../src/engine.js'), AI = require('../src/ai.js');
const N = +(process.argv[2] || 40), seed0 = +(process.argv[3] || 1), SD = process.env.SEITE || 'D', FO = SD === 'A' ? 'D' : 'A', HALTEN = !!process.env.HALTEN, HALT_AB = +(process.env.HALT_AB || 4), RMAX = +(process.env.RUNDEN || 12);
const vor = (u) => SD === 'A' ? u.c : E.COLS - 1 - u.c;   // Spalten Richtung Gegner
const lauf = [], erg = { A: 0, D: 0, offen: 0 }; let angr = 0, schuss = 0, zurueck = 0, zuege = 0, fahne = 0;
for (let g = 0; g < N; g++) {
  const G = E.newGame({ seed: seed0 + g * 7919, map: process.env.MAP }); E.startTurn(G); let guard = 0;
  while (!G.over && guard++ < 6000 && G.turn <= RMAX) {
    if (G.side === SD && !G._gemessen) { G._gemessen = true; const us = G.units.filter(u => u.side === SD && E.active(u) && E.cls(u) !== 'art');
      lauf[G.turn] = lauf[G.turn] || []; const v5 = us.map(vor).sort((a, b) => b - a).slice(0, 5); lauf[G.turn].push(v5.reduce((a, b) => a + b, 0) / Math.max(1, v5.length)); }
    const bk = G.turn + G.side; if (G._bk !== bk) { G._bk = bk; AI.buy(G); }
    const act = AI.next(G);
    if (!act) { E.endTurn(G); G._gemessen = false; continue; }
    const u = G.units.find(x => x.id === act.u), halt = HALTEN && u.side === FO && G.turn > HALT_AB;
    for (const s of act.steps) {
      if (halt && (s.k === 'move' || s.k === 'melee' || s.k === 'abil')) continue;
      const c0 = u.c, ctrl0 = { ...G.ctrl }; const ev = AI.exec(G, act.u, s) || [];
      if (u.side === SD && ev.length) {
        if (s.k === 'melee') angr++; if (s.k === 'fire' || s.k === 'shell') schuss++;
        if (s.k === 'move') { zuege++; if ((SD === 'A' ? u.c - c0 : c0 - u.c) < 0) zurueck++; }
        for (const o of E.OBJECTIVES) if (G.ctrl[o.id] === SD && ctrl0[o.id] !== SD) fahne++;
      }
      if (G.over) break;
    }
    if (halt) { u.ap = 0; u.bp = 0; u.moved = true; u.attacked = true; }
  }
  if (G.over) erg[G.over.winner || 'offen']++; else erg.offen++;
}
console.log(`${E.MAP.id} · gemessen ${SD}${HALTEN ? ' · Gegner hält ab Runde ' + (HALT_AB + 1) + ' nur' : ''} · ${N} Schlachten`);
console.log('Vorrücken (vordere 5 Trupps, Ø Spalten von der eigenen Kante) je Runde:', lauf.map((l, i) => l ? `R${i} ${(l.reduce((a, b) => a + b, 0) / l.length).toFixed(1)}` : null).filter(Boolean).join('  '));
console.log(`je Schlacht: Nahkämpfe ${(angr / N).toFixed(1)}, Schüsse ${(schuss / N).toFixed(1)}, Züge ${(zuege / N).toFixed(1)} (davon zurück ${Math.round(zurueck / Math.max(1, zuege) * 100)} %), Zielfelder genommen ${(fahne / N).toFixed(1)}; Ausgang ${JSON.stringify(erg)}`);
