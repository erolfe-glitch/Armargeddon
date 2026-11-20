// F44 Feinabstimmung (2026-11-20): je Karte einige Startarmeen ohne Welle messen (MISCHEN=1). Kandidat = { A: {typ: Anzahl …}, D: {…} } als
// Änderung gegenüber der Kartenarmee (+/−). Aufruf: node tools/welle_fein.js [Schlachten] [karte,…]
const { execFileSync } = require('child_process');
const E = require('../src/engine.js');
const N = +(process.argv[2] || 200), nur = process.argv[3] ? process.argv[3].split(',') : null;
const K = {
  grauwall: [{ D: { brand: 1 } }, { D: { grenadier: 1 } }, { D: { grenadier: 2 } }, { D: { sturm: 1 } }],
  lerne: [{ D: { sturm: 3 } }, { D: { sturm: 2, brand: 2 } }, { D: { sturm: 2, grenadier: 2 } }],
  front: [{ D: { grenadier: -5 } }, { D: { sense: -3 } }, { D: { grenadier: -4, sense: -2 } }, { A: { koloss: 1 } }],
  waldfl: [{ D: { grenadier: 2 } }, { D: { grenadier: 3 } }, { D: { sturm: 1 } }],
  kasem: [{ D: { sturm: 1, grenadier: 1 } }, { D: { sturm: 1, brand: 1 } }, { D: { sturm: 1 } }],
  kanal: [{ D: { grenadier: 1 } }, { D: { brand: 1 } }, { D: { grenadier: 2 } }],
  selm: [{ D: { sturm: 1 } }],
  stein: [{ D: { sturm: 1 } }],
  varn: [{}, { D: { sturm: 1 } }, { D: { grenadier: 1 } }, { D: { brand: 1 } }],
};
const quote = env => { for (let v = 0; v < 3; v++) { try { return quote1(env); } catch (e) { if (v === 2) throw e; } } };   // Absturz (Zugriffsfehler bei parallelen Läufen): wiederholen
const quote1 = env => { const out = execFileSync(process.execPath, [__dirname + '/sim.js', String(N), '1'], { env: { ...process.env, MISCHEN: '1', M_reinfTurn: '99', ...env }, encoding: 'utf8', maxBuffer: 1e8 });
  const m = out.match(/Konkordat (\d+) %/); return m ? +m[1] : NaN; };
for (const [id, list] of Object.entries(K)) {
  if (nur && !nur.includes(id)) continue; const m = E.MAPS[id];
  for (const k of list) { const env = { MAP: id };
    for (const sd of ['A', 'D']) for (const [t, n] of Object.entries(k[sd] || {})) env[`M${sd}_${t}`] = String(Math.max(0, (m.army[sd][t] || 0) + n));
    console.log(`${id}: ${JSON.stringify(k)} → Konkordat ${quote(env)} %`); }
}
