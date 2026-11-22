// F94 (2026-11-22): Möglichkeiten für ein Gefecht statt „Kampagnenmission“ – KI gegen KI messen.
// Aufruf: node tools/f94_sim.js <modus> [Schlachten=200] [Karte=grauwall] [Startwert=1]
// Modi:  basis    – Kartenarmeen wie heute
//        gemischt – feste gemischte Startarmeen beider Seiten (gleiches Budget, höchstens 5 vom selben Typ), Aufstellung gemischt
//        zufall   – je Schlacht neue Zufallsarmee beider Seiten mit Mindestvielfalt (Budget der Karte, ≥ 7 Typen, Linie ≤ 5, Rest ≤ 2)
// Dazu als Umgebungsvariable: ART_NACH=1 (KI zieht Geschütze beider Seiten nach), WUNSCH_MISCH=1 (Nachschub-Wunschliste je Schlacht gemischt).
// Ausgabe: Siegquote Konkordat, Dauer, Verluste, Anteil Schlachten mit bewegter Artillerie, Vielfalt (Typen je Seite).
const E = require('../src/engine.js'), AI = require('../src/ai.js');
const modus = process.argv[2] || 'basis', N = +(process.argv[3] || 200), KARTE = process.argv[4] || 'grauwall', SEED = +(process.argv[5] || 1);
E.useMap(KARTE);
const GEMISCHT = {
  grauwall: { A: { kohorte: 5, mahlwerk: 2, koloss: 2, haubitze: 2, reiter: 1, pionier: 1, scharf: 1, moerser: 1, feldscher: 1, raeumer: 1, flammen: 1, rauch: 1, generalA: 1, hauptA: 1 },
    D: { grenadier: 5, sense: 3, geschuetz: 2, sturm: 1, sturmpz: 1, minenwerfer: 1, pionierD: 1, buechse: 1, heiler: 1, signal: 1, lanzeD: 1, generalD: 1, hauptD: 1 } },
  sanktruss: { A: { kohorte: 5, mahlwerk: 2, koloss: 2, haubitze: 2, reiter: 1, pionier: 2, scharf: 1, moerser: 1, feldscher: 1, raeumer: 1, flammen: 1, rauch: 1, generalA: 1, hauptA: 1 },
    D: { grenadier: 5, sense: 2, geschuetz: 2, sturmpz: 2, sturm: 1, lanzeD: 2, minenwerfer: 1, pionierD: 1, buechse: 1, heiler: 1, generalD: 1, hauptD: 1 } },
};
// Zufallsarmee: General + Hauptmann fest, dann nach Gewicht ziehen, bis das Budget nicht mehr reicht; Linie (billigste Fußtruppe) bis 5, sonst bis 2, Held/Stufe 3 höchstens 1
function zufallsArmee(side, rnd) {
  const B = E.ARMY_BUDGET[side], a = {}, gen = side === 'A' ? 'generalA' : 'generalD', hpt = side === 'A' ? 'hauptA' : 'hauptD';
  a[gen] = 1; a[hpt] = 1; let rest = B - E.COST[gen] - E.COST[hpt];
  const linie = side === 'A' ? 'kohorte' : 'grenadier';
  const pool = E.ROSTER[side].filter(t => !E.isMech(t) && !E.TYPES[t].cmd && t !== 'melder');
  const max = t => t === linie ? 5 : (E.TYPES[t].held || E.TYPES[t].stufe3) ? 1 : 2;
  a[linie] = 3; rest -= 3 * E.COST[linie];   // Grundstock Linie, sonst kann niemand Zielfelder halten
  for (let guard = 0; guard < 200; guard++) {
    if (E.armyCount(a) >= E.ARMY_MAX[side]) break;   // nicht mehr Trupps als erlaubt
    const ok = pool.filter(t => (a[t] || 0) < max(t) && E.COST[t] <= rest);
    if (!ok.length) break;
    const t = ok[Math.floor(rnd() * ok.length)]; a[t] = (a[t] || 0) + 1; rest -= E.COST[t];
  }
  return a;
}
function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
let artBewegtD = 0, sieg = 0, remis = 0, runden = 0, artBewegt = 0, typen = { A: 0, D: 0 }, verl = { A: 0, D: 0 }, n = 0, fehler = 0;
for (let g = 0; g < N; g++) {
  const seed = SEED + g * 7919, rnd = rng(seed * 31 + 7);
  let army;
  if (modus === 'gemischt') army = GEMISCHT[KARTE];
  if (process.env.ARMEE_A || process.env.ARMEE_D) { army = army ? { ...army } : { A: E.MAP.army.A, D: E.MAP.army.D }; if (process.env.ARMEE_A) army.A = JSON.parse(process.env.ARMEE_A); if (process.env.ARMEE_D) army.D = JSON.parse(process.env.ARMEE_D); }   // Abgleich: eigene Listen (JSON)
  else if (modus === 'zufall') army = { A: zufallsArmee('A', rnd), D: zufallsArmee('D', rnd) };
  const G = E.newGame({ seed, map: KARTE, army, mischen: modus !== 'basis' || !!process.env.MISCHEN, free: !!process.env.FREI });
  if (army && (!G.armee || G.armee.A !== army.A || G.armee.D !== army.D)) { fehler++; }
  if (process.env.WUNSCH_MISCH) G._wish = { A: Math.floor(rnd() * 14), D: Math.floor(rnd() * 15) };   // anderer Einstieg in die Wunschliste
  E.startTurn(G);
  for (const sd of ['A', 'D']) typen[sd] += new Set(G.units.filter(u => u.side === sd).map(u => u.type)).size;
  const start = new Map(G.units.filter(u => E.TYPES[u.type].limber).map(u => [u.id, u.c + ',' + u.r]));
  let guard = 0, bk = '';
  try {
    while (!G.over && guard++ < 8000) {
      if (bk !== G.turn + G.side) { bk = G.turn + G.side; AI.buy(G); }
      const act = AI.next(G); if (!act) { E.endTurn(G); continue; }
      for (const s of act.steps) { AI.exec(G, act.u, s); if (G.over) break; }
    }
  } catch (e) { fehler++; continue; }
  n++;
  if (G.over && G.over.winner === 'A') sieg++; else if (!G.over || !G.over.winner) remis++;
  runden += G.turn;
  if (G.units.some(u => start.has(u.id) && start.get(u.id) !== u.c + ',' + u.r)) artBewegt++;
  if (G.units.some(u => u.side === 'D' && start.has(u.id) && start.get(u.id) !== u.c + ',' + u.r)) artBewegtD++;
  for (const u of G.units) if (!E.alive(u)) verl[u.side]++;
}
console.log(JSON.stringify({ modus, karte: KARTE, seed: SEED, artNach: !!process.env.ART_NACH, wunschMisch: !!process.env.WUNSCH_MISCH, schlachten: n, fehler,
  siegKonkordat: +(100 * sieg / n).toFixed(1), remis: +(100 * remis / n).toFixed(1), runden: +(runden / n).toFixed(1), artBewegtProzent: +(100 * artBewegt / n).toFixed(0), artBewegtAschenwacht: +(100 * artBewegtD / n).toFixed(0),
  typenA: +(typen.A / n).toFixed(1), typenD: +(typen.D / n).toFixed(1), verlusteA: +(verl.A / n).toFixed(1), verlusteD: +(verl.D / n).toFixed(1) }));
