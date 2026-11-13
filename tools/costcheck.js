// Prüft die Punktkosten per Simulation: node tools/costcheck.js [Spiele je Typ] [Typen, kommagetrennt]
// Für jeden Typ: Standardarmee + etwa ADD (120) Punkte dieses Typs, verglichen mit Standardarmee + gleich viel Punkte Grundinfanterie.
// Ausgabe: Differenz der Siegquoten. Deutlich höher = Typ zu billig, deutlich tiefer = zu teuer.
const E = require('../src/engine.js');
const { spawn } = require('child_process');
const N = +(process.argv[2] || 120), only = process.argv[3] ? process.argv[3].split(',') : null;
const map = process.env.MAP || 'grauwall'; E.useMap(map);
const base = { A: 'kohorte', D: 'grenadier' }, T = +(process.env.ADD || 120);
const str = a => Object.entries(a).filter(([, v]) => v > 0).map(([x, y]) => x + ':' + y).join(',');
const jobs = [];
for (const side of ['A', 'D']) for (const t of E.SHOP[side]) {
  if (t === base[side] || (only && !only.includes(t))) continue;
  const c = E.COST[t], k = Math.max(1, Math.round(T / c)), add = k * c, nb = Math.max(1, Math.round(add / E.COST[base[side]]));
  const army = { ...E.defaultArmy(side) }; army[t] = (army[t] || 0) + k;
  const ref = { ...E.defaultArmy(side) }; ref[base[side]] += nb;
  jobs.push({ side, type: t, k, add, ref: nb * E.COST[base[side]], env: { ['ARMY_' + side]: str(army) }, renv: { ['ARMY_' + side]: str(ref) } });
}
let run = 0, done = 0; const out = [], cache = {};
function report(r, w) { console.log(`${r.side} ${r.type.padEnd(11)} ${r.k}× für ${r.add}: Sieg ${r.win} %  | gleich viele Punkte Grundinfanterie (${r.ref}): ${w} %  → Differenz ${r.win - w}`); }
function next() {
  if (!jobs.length) return;
  const j = jobs.shift(), key = JSON.stringify(j.env);
  if (j.refOf && cache[key] !== undefined) { report(j.refOf, cache[key]); return next(); }
  run++;
  const p = spawn('node', [__dirname + '/sim.js', String(N), '3'], { env: { ...process.env, ...j.env, MAP: map, MECHS: '1', ARMY_FREE: '1' } });
  let txt = ''; p.stdout.on('data', d => txt += d);
  p.on('close', () => {
    const m = txt.match(/Konkordat (\d+) %  Aschenwacht (\d+) %/);
    const w = m ? (j.side === 'A' ? +m[1] : +m[2]) : NaN;
    out.push(j); j.win = w;
    if (j.refOf) { cache[key] = w; report(j.refOf, w); }
    else jobs.unshift({ side: j.side, type: j.type, env: j.renv, refOf: j });
    run--; done++; next();
  });
}
for (let i = 0; i < 2; i++) next();
