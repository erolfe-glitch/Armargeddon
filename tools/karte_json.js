// Kartendaten für die Gelände-Testseiten (entwurf/probe/karte.html): node tools/karte_json.js [karte] > entwurf/probe/karte_<karte>.json
// Gibt Größe, Gelände je Feld (Geländeart aus TERRAIN, dazu road/river/ridge), Zielfelder und Aufstellungszonen aus.
const E = require('../src/engine.js');
const id = process.argv[2] || 'grauwall', MP = E.MAPS[id];
if (!MP || !MP.build) { console.error('Karte ohne build():', id); process.exit(1); }
const M = MP.build();
const cells = M.map(col => col.map(h => [h.t, h.road ? 1 : 0, h.river ? 1 : 0, h.ridge ? 1 : 0]));
console.log(JSON.stringify({ id, name: MP.name, cols: MP.cols, rows: MP.rows, zoneA: MP.zoneA, zoneD: MP.zoneD,
  objectives: MP.objectives.map(o => ({ id: o.id, name: o.name, c: o.c, r: o.r })), cells }));
