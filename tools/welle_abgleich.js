// F44 (Spieltest Runde 4, 2026-11-20): Verstärkungswelle → Einheiten von Anfang an. Für jede Karte mit Welle die ersten n Einheiten der Welle
// in die Startarmee der Aschenwacht nehmen (ohne Welle) und per Simulation das n suchen, bei dem das Konkordat am nächsten an 50 % gewinnt.
// Gemessen mit MISCHEN=1 (Aufstellung je Schlacht gemischt; mit fester Aufstellung schwankt es um ±30 Punkte).
// Aufruf: node tools/welle_abgleich.js [Schlachten je Versuch] [karte,karte,…]   (sequenziell; parallele node-Läufe stürzen unter Windows ab)
const { execFileSync } = require('child_process');
const E = require('../src/engine.js');
const N = +(process.argv[2] || 150), nur = process.argv[3] ? process.argv[3].split(',') : null;
const quote = (env) => { const out = execFileSync(process.execPath, [__dirname + '/sim.js', String(N), '1'], { env: { ...process.env, MISCHEN: '1', ...env }, encoding: 'utf8', maxBuffer: 1e8 });
  const m = out.match(/Konkordat (\d+) %/); return m ? +m[1] : NaN; };
for (const [id, m] of Object.entries(E.MAPS)) {
  if (nur && !nur.includes(id)) continue;
  const welle = (m.reinf || []).map(x => Array.isArray(x) ? x[0] : x); if (!welle.length || !m.army) continue;
  const res = []; console.log(`${id}: heute (Welle Runde ${m.reinfTurn}) → Konkordat ${quote({ MAP: id })} %`);
  const lo = +(process.env.AB || 0), hi = welle.length;   // ab 0: nur die Welle weg (mit MISCHEN ist schon die halbe Welle auf manchen Karten zu stark)
  for (let n = lo; n <= hi; n++) {
    const add = {}; for (const t of welle.slice(0, n)) add[t] = (add[t] || 0) + 1;
    const env = { MAP: id, M_reinfTurn: '99' }; for (const [t, k] of Object.entries(add)) env['MD_' + t] = String((m.army.D[t] || 0) + k);
    const q = quote(env); res.push({ n, add, q }); console.log(`${id}: ${n}/${welle.length} der Welle ${JSON.stringify(add)} → Konkordat ${q} %`);
    if (q < 40) break;   // schon deutlich zu stark, größere n lohnen nicht
  }
  const best = res.reduce((a, b) => Math.abs(b.q - 50) < Math.abs(a.q - 50) ? b : a);
  console.log(`== ${id}: bestes n ${best.n} ${JSON.stringify(best.add)} → ${best.q} %`);
}
