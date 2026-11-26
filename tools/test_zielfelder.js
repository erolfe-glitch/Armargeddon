// Punkt 89 (2026-11-26): Jedes Zielfeld muss für normale Fußtruppen ohne Räumen von der eigenen Aufstellungszone aus erreichbar sein, über mindestens zwei Zugänge.
// Wegsuche mit einem Linientrupp über die Zugkosten (cost < 99), Einheiten werden ignoriert; Draht, Sperren und Barrikaden werden nicht geräumt.
// Aufruf: node tools/test_zielfelder.js   (Rückgabe 1 bei Fehlern)
const E = require('../src/engine.js');
let fehler = 0;
for (const map of Object.keys(E.MAPS)) {
  E.useMap(map); const G = E.newGame({ map, seed: 1 });
  for (const side of ['A', 'D']) {
    const u = G.units.find(x => x.side === side && E.TYPES[x.type].cls === 'inf') || G.units.find(x => x.side === side); if (!u) continue;
    const pass = (c, r) => c >= 0 && r >= 0 && c < E.COLS && r < E.ROWS && E.cost(G, u, c, r) < 99 && G.map[c][r].t !== 'wire';
    const seen = new Set(), q = []; for (const [c, r] of E.startZone(G, side)) if (pass(c, r)) { seen.add(c * 100 + r); q.push([c, r]); }
    while (q.length) { const [c, r] = q.shift(); for (const [a, b] of E.neighbors(c, r)) { const k = a * 100 + b; if (!seen.has(k) && pass(a, b)) { seen.add(k); q.push([a, b]); } } }
    for (const o of E.OBJECTIVES || G.objectives || []) {
      const drauf = pass(o.c, o.r), zug = E.neighbors(o.c, o.r).filter(([a, b]) => seen.has(a * 100 + b)).length;
      const ok = drauf && seen.has(o.c * 100 + o.r) && zug >= 2;
      if (!ok) { fehler++; console.log(`FEHLER ${map} Seite ${side}: Zielfeld ${o.name || o.id} (${o.c},${o.r}) – betretbar ${drauf}, Zugänge ${zug}`); }
    }
  }
}
console.log(fehler ? `${fehler} Zielfelder nicht frei erreichbar.` : 'Alle Zielfelder für Fußtruppen von beiden Seiten über mindestens zwei Zugänge erreichbar.');
process.exit(fehler ? 1 : 0);
