// U7 (Punkt 125, 2026-11-27): Moral-Messung – sim.js je Karte mit vier Startwerten (MISCHEN=1, 100 Schlachten), nacheinander (parallele Läufe stürzen unter Node 26 ab).
// Aufruf: node tools/u7_messen.mjs <name> [KARTEN=grauwall,sanktruss,winterdorf] [N=100] [STARTWERTE=1,2,3,4]   (weitere Umgebungsvariablen gehen an sim.js, z. B. ENTSETZ_OFT=1)
// Ergebnis: entwurf/probe/u7/<name>.json (Mittel je Karte) und Ausgabe als Tabelle.
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
const NAME = process.argv[2] || 'messung', KARTEN = (process.env.KARTEN || 'grauwall,sanktruss,winterdorf').split(','), N = +(process.env.N || 100), SW = (process.env.STARTWERTE || '1,2,3,4').split(',');
mkdirSync('entwurf/probe/u7', { recursive: true });
const erg = {};
for (const karte of KARTEN) {
  const laeufe = [];
  for (const sw of SW) {
    let out = ''; for (let v = 0; v < 3 && !out.includes('Schlachten'); v++) { try { out = execFileSync('node', ['tools/sim.js', String(N), sw], { encoding: 'utf8', env: { ...process.env, MAP: karte, MISCHEN: '1', KURZ: '1' }, maxBuffer: 1 << 26 }); } catch (e) { out = String(e.stdout || ''); } }   // bei Absturz bis zu zweimal wiederholen
    const quote = +(out.match(/Konkordat (\d+) %/) || [])[1], runden = +(out.match(/Runden Ø ([\d.]+)/) || [])[1], verl = out.match(/Ausfälle Ø Konkordat (\d+) %\s+Aschenwacht (\d+) %/) || [];
    const m = {}; const zeile = (out.match(/U7 Moral je Schlacht[^:]*: (.*)/) || [])[1] || '';
    for (const t of zeile.split('; ')) { const q = t.match(/^(.*) ([\d.]+) \/ ([\d.]+)$/); if (q) m[q[1]] = [+q[2], +q[3]]; }
    const ent = out.match(/Entsetzenstests: (\d+).*durchgefallen (\d+)/) || [];
    laeufe.push({ sw, quote, runden, verlA: +verl[1], verlD: +verl[2], m }); console.log(`${karte} Startwert ${sw}: Konkordat ${quote} %, Runden ${runden}`);
  }
  const mit = f => +(laeufe.reduce((s, l) => s + f(l), 0) / laeufe.length).toFixed(2), keys = [...new Set(laeufe.flatMap(l => Object.keys(l.m)))];
  erg[karte] = { quote: mit(l => l.quote), quoten: laeufe.map(l => l.quote), runden: mit(l => l.runden), verluste: [mit(l => l.verlA), mit(l => l.verlD)], moral: Object.fromEntries(keys.map(k => [k, [mit(l => (l.m[k] || [0, 0])[0]), mit(l => (l.m[k] || [0, 0])[1])]])) };
}
writeFileSync(`entwurf/probe/u7/${NAME}.json`, JSON.stringify(erg, null, 1));
for (const [k, e] of Object.entries(erg)) console.log(`\n${k}: Konkordat ${e.quote} % (${e.quoten.join('/')}), Runden ${e.runden}, Verluste ${e.verluste.join(' / ')} %\n  ` + Object.entries(e.moral).map(([a, v]) => `${a} ${v[0]} / ${v[1]}`).join('; '));
