// Test „nie zwei Einheiten auf einem Feld“ und „niemand zieht durch eine Einheit“ (Paket 3, 2026-11-17)
// Aufruf: node tools/test_belegung.js [Schlachten je Karte]
// 1. KI gegen KI auf allen Karten, mit Nachschub: nach jedem Schritt (Zug, Angriff, Fähigkeit, Rundenende mit Flucht,
//    Rückzug, Vorrücken, Gegenstoß, Verstärkung, Nachschub) darf kein Feld zwei lebende Einheiten tragen.
// 2. Gezielte Fälle: Weg führt nicht durch eigene Einheiten; Halt unterwegs (Mine) landet nie auf einem besetzten Feld;
//    Nachschubfelder (Rand und eigene Zielfelder) sind frei und nicht in Feindberührung; Freischlag beim Rückzug.
const E = require('../src/engine.js');
const AI = require('../src/ai.js');
const N = +(process.argv[2] || 6);
let fehler = 0, schritte = 0;
const doppelt = G => { const m = new Map(); for (const u of G.units) if (E.alive(u)) { const k = u.c * 100 + u.r; if (m.has(k)) return [m.get(k), u]; m.set(k, u); } return null; };
const melde = (was, G, d) => { if (fehler++ < 10) console.log('FEHLER', was, 'Karte', G.mapId, 'Runde', G.turn, d ? `${d[0].type}#${d[0].id} und ${d[1].type}#${d[1].id} auf ${d[0].c},${d[0].r}` : ''); };

// 1. KI-Schlachten
for (const map of Object.keys(E.MAPS)) for (let s = 1; s <= N; s++) {
  E.useMap(map); const G = E.newGame({ map, seed: s * 7919 + map.length }); let guard = 0, bk = null;
  while (!G.over && guard++ < 8000) {
    if (bk !== G.turn + G.side) { bk = G.turn + G.side; AI.buy(G); const d = doppelt(G); if (d) melde('Nachschub', G, d); }
    const act = AI.next(G);
    if (!act) { E.endTurn(G); const d = doppelt(G); if (d) melde('Rundenende', G, d); continue; }
    for (const st of act.steps) { AI.exec(G, act.u, st); schritte++; const d = doppelt(G); if (d) melde('Schritt ' + st.k, G, d); if (G.over) break; }
  }
}
console.log(`KI-Schlachten: ${Object.keys(E.MAPS).length * N}, Schritte ${schritte}`);

// 2. Gezielte Fälle
E.useMap('grauwall');
{ // Weg nicht durch eigene Einheiten: Einheit rundum von eigenen umstellt kommt nirgends hin
  const G = E.newGame({ seed: 1 }); const u = G.units.find(x => x.side === 'A' && x.type === 'kohorte');
  const nb = E.neighbors(u.c, u.r).filter(([c, r]) => c >= 0 && r >= 0 && c < E.COLS && r < E.ROWS);
  const others = G.units.filter(x => x !== u && x.side === 'A').slice(0, nb.length);
  nb.forEach(([c, r], i) => { others[i].c = c; others[i].r = r; });
  if (E.reachable(G, u).size) melde('umstellte Einheit kann ziehen', G);
  for (const [, n] of E.reachable(G, others[0])) for (const [c, r] of n.path) if (G.units.some(x => x !== others[0] && E.alive(x) && x.c === c && x.r === r)) melde('Weg durch Einheit', G);
}
{ // Halt unterwegs durch Mine: Haltefeld ist frei
  let ok = 0;
  for (let s = 1; s <= 40; s++) { const G = E.newGame({ seed: s }); const u = G.units.find(x => x.side === 'A' && x.type === 'kohorte');
    const far = [...E.reachable(G, u).values()].find(n => n.path.length >= 2); if (!far) continue;
    G.mines.push({ c: far.path[0][0], r: far.path[0][1], side: 'D' }); E.moveUnit(G, u, far.c, far.r); const d = doppelt(G); if (d) melde('Halt auf Mine', G, d); else ok++; }
  console.log('Minen-Halt geprüft:', ok);
}
{ // Nachschubfelder: frei, nicht in Feindberührung (Zielfelder), eigene Zielfelder zählen
  const G = E.newGame({ seed: 5 }); const o = E.OBJECTIVES[2]; G.ctrl[o.id] = 'A';
  const hs = E.spawnHexes(G, 'A', 'kohorte');
  if (hs.some(([c, r]) => E.unitAt(G, c, r))) melde('Nachschub auf besetztes Feld', G);
  if (!hs.some(([c, r]) => E.dist(c, r, o.c, o.r) <= 1)) melde('Zielfeld kein Aufstellungsort', G);
  if (hs.some(([c, r]) => E.dist(c, r, o.c, o.r) <= 1 && E.isZOC(G, c, r, 'A'))) melde('Aufstellung in Feindberührung', G);
  console.log('Nachschubfelder am Zielfeld', o.name + ':', hs.filter(([c, r]) => E.dist(c, r, o.c, o.r) <= 1).length);
}
{ // Freischlag: Rückzug aus Feindberührung kostet Stärke, keine Moral
  const G = E.newGame({ seed: 2 }); const u = G.units.find(x => x.side === 'A' && x.type === 'kohorte'); const e = G.units.find(x => x.side === 'D' && x.type === 'grenadier');
  G.units.forEach(x => { if (x !== u && x !== e) { x.c = -9; x.r = -9; x.status = 'dead'; } });
  u.c = 6; u.r = 4; e.c = 7; e.r = 4; G.map[6][4].t = 'open'; G.map[7][4].t = 'open'; G.side = 'A';
  const fb = E.freeBlows(G, u), R = E.reachable(G, u), n = [...R.values()][0], s0 = u.str, m0 = u.mor;
  if (!fb.length || !n || !n.retreat) melde('kein Rückzug mit Freischlag möglich', G);
  else { const ev = E.moveUnit(G, u, n.c, n.r); console.log(`Freischlag: erwartet −${(fb[0].lo * 10).toFixed(0)} bis −${(fb[0].hi * 10).toFixed(0)}, Stärke ${s0 * 10} → ${(u.str * 10).toFixed(1)}, Moral ${m0} → ${u.mor}, Ereignis ${ev.some(x => x.t === 'freeblow')}`);
    const ab = s0 - u.str; if (ab < fb.reduce((a, b) => a + b.lo, 0) - 1e-9 || ab > fb.reduce((a, b) => a + b.hi, 0) + 1e-9 || u.mor !== m0) melde('Freischlag falsch', G); }
}
console.log(fehler ? `${fehler} Fehler` : 'alles in Ordnung');
process.exit(fehler ? 1 : 0);
