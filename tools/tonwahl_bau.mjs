// F91 (2026-11-22): Ton-Pult-Wahl ins Spiel übernehmen.
// Liest alle Exporte entwurf/postfach/tonpult*.json, führt sie nach Exportzeit zusammen (der neuere hat Vorrang, Schlüssel Einheit + Pult-Zeile),
// löst die Pult-Zeile über die aktuelle Zuordnung in tonpult.html auf den Tonplatz auf, den das Spiel dort wirklich spielt (M8),
// und schreibt die Tabelle TONWAHL in src/ui.js zwischen die Marken „TONWAHL-ANFANG“ und „TONWAHL-ENDE“.
// Im Spiel: playSound schaut für die Einheit des laufenden Ereignisses (Schütze, Schlagender, Getroffener) nach.
// Aufruf: node tools/tonwahl_bau.mjs   (vorher node tools/tonpult_bau.mjs, damit die Zuordnung aktuell ist)
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..'), PF = join(ROOT, 'entwurf/postfach');
const html = readFileSync(join(ROOT, 'tonpult.html'), 'utf8'), i0 = html.indexOf('const D = ') + 10, D = JSON.parse(html.slice(i0, html.indexOf(';\n', i0)));
const exporte = readdirSync(PF).filter(f => /^tonpult.*\.json$/.test(f)).map(f => ({ f, j: JSON.parse(readFileSync(join(PF, f), 'utf8')) }))
  .filter(x => Array.isArray(x.j.aenderungen)).sort((a, b) => (a.j.exportiert < b.j.exportiert ? -1 : 1));
const wahl = new Map();
for (const { f, j } of exporte) for (const e of j.aenderungen) wahl.set(e.einheit + '|' + e.platz_id, { ...e, quelle: f });
const neuste = exporte[exporte.length - 1], ausNeu = new Set(neuste.j.aenderungen.map(e => e.einheit + '|' + e.platz_id));
const alleKeys = new Set(Object.values(D.pools).flat().map(x => x[0])), tab = {}, bericht = [];
for (const [k, e] of wahl) {
  const einh = D.einheiten.find(x => x.t === e.einheit), zeile = einh && einh.slots.find(z => z.id === e.platz_id);
  const platz = zeile ? zeile.platz : e.platz_spiel, volSpiel = zeile ? zeile.vol : e.lautstaerke_spiel;
  if (!platz || platz === '-') { bericht.push(`${k}: keine Zeile im Spiel – ausgelassen`); continue; }
  const w = { };
  if (e.wahl === '-') w.aus = 1;
  else if (e.wahl.startsWith('k:')) { const key = e.wahl.slice(2); if (!alleKeys.has(key)) { bericht.push(`${k}: Ton ${key} fehlt – ausgelassen`); continue; } w.k = key; }
  else if (e.wahl.startsWith('p:')) { const p = e.wahl.slice(2); if (!D.pools[p]) { bericht.push(`${k}: Platz ${p} fehlt – ausgelassen`); continue; } if (p !== platz) w.p = p; }
  const vf = volSpiel ? +(e.lautstaerke / volSpiel).toFixed(3) : 1; if (Math.abs(vf - 1) > 0.01) w.vf = vf;
  if (e.tonhoehe && Math.abs(e.tonhoehe - 1) > 0.005) w.rate = e.tonhoehe;
  if (!Object.keys(w).length) continue;
  (tab[e.einheit] = tab[e.einheit] || {})[platz] = w;
  if (zeile && e.platz_spiel && e.platz_spiel !== platz) bericht.push(`${k}: Pult-Zeile zeigte ${e.platz_spiel}, das Spiel spielt ${platz} – dort eingetragen`);
  if (!ausNeu.has(k)) bericht.push(`${k}: nur in älterem Export (${e.quelle})`);
}
const F = join(ROOT, 'src/ui.js'); let s = readFileSync(F, 'utf8');
const a = s.indexOf('// TONWAHL-ANFANG'), b = s.indexOf('// TONWAHL-ENDE');
if (a < 0 || b < 0) throw new Error('Marken TONWAHL-ANFANG/-ENDE fehlen in src/ui.js');
const n = Object.values(tab).reduce((x, o) => x + Object.keys(o).length, 0);
const block = `// TONWAHL-ANFANG (erzeugt mit tools/tonwahl_bau.mjs aus ${exporte.length} Ton-Pult-Exporten, neuester ${neuste.f}; ${n} Einträge – nicht von Hand ändern)\nconst TONWAHL = ${JSON.stringify(tab)};\n`;
s = s.slice(0, a) + block + s.slice(b); writeFileSync(F, s);
console.log(`${wahl.size} Pult-Wahlen zusammengeführt, ${n} wirken im Spiel (${Object.keys(tab).length} Einheiten).`); for (const z of bericht) console.log('  ' + z);
