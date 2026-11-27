// U7 (Punkt 125): zwei Messungen aus tools/u7_messen.mjs als Markdown-Tabelle vergleichen (je Karte: Konkordat-Quote, Runden, Moral-Zähler K / A, Unterschied).
// Aufruf: node tools/u7_vergleich.mjs <vorher> <nachher> [zeilen=Komma-Liste]   (Namen ohne .json aus entwurf/probe/u7/)
import { readFileSync } from 'node:fs';
const [a, b] = process.argv.slice(2, 4).map(n => JSON.parse(readFileSync(`entwurf/probe/u7/${n}.json`, 'utf8')));
const ZEILEN = (process.argv[4] || 'Entsetzenstests,Entsetzen durchgefallen,Entsetzen Wiederholung,Furcht-Aura,Löwengebrüll (Ziele),niedergehalten,zurückgewichen,Flucht,Flucht (Moral),Flucht (Stärke),gesammelt').split(',');
const f = (x, y) => `${x[0]} / ${x[1]} → ${y[0]} / ${y[1]}`;
for (const k of Object.keys(b)) {
  if (!a[k]) continue; const A = a[k], B = b[k], d = (B.quote - A.quote).toFixed(1);
  console.log(`\n**${k}** – Konkordat ${A.quote} % → **${B.quote} %** (${d > 0 ? '+' : ''}${d}; Läufe ${B.quoten.join('/')}), Runden ${A.runden} → ${B.runden}\n`);
  console.log('| je Schlacht (Konkordat / Aschenwacht) | vorher → nachher |\n|---|---|');
  for (const z of ZEILEN) console.log(`| ${z} | ${f(A.moral[z] || [0, 0], B.moral[z] || [0, 0])} |`);
}
