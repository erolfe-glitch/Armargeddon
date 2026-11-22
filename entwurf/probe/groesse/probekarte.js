// Größen-Probe (Paket H Schritt 10, 2026-11-22): Grauwall mit 2- bzw. 3-facher Fläche (Zeilen gestapelt, breitere Front), nur zum Messen, nicht im Spielmenü.
// Nutzbar in Node (require) und im Browser (vor dem Spielstart einspielen: probeKarte(E, 2)).
function probeKarte(E, k) {
  const g = E.MAPS.grauwall, id = 'probe' + k;
  const m = { ...g, id, name: 'Probe ×' + k, size: 'Probe', rows: g.rows * k, armyMax: { A: g.armyMax.A * k, D: g.armyMax.D * k }, objectives: [], army: { A: {}, D: {} },
    build: () => { const M0 = g.build(); return M0.map(col => { const out = []; for (let q = 0; q < k; q++) for (const h of col) out.push(JSON.parse(JSON.stringify(h))); return out; }); } };
  for (let q = 0; q < k; q++) for (const o of g.objectives) m.objectives.push({ ...o, id: o.id + '_' + q, name: o.name + (q ? ' ' + (q + 1) : ''), r: o.r + g.rows * q });
  for (const sd of ['A', 'D']) for (const [t, n] of Object.entries(g.army[sd])) m.army[sd][t] = /^general/.test(t) ? 1 : n * k;
  E.MAPS[id] = m; return id;
}
if (typeof module !== 'undefined') module.exports = probeKarte; else window.probeKarte = probeKarte;
