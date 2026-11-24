// Regel-Selbsttest (Prüfliste 5.2, 2026-11-21) – vor jedem Commit mit Regeländerung laufen lassen: node tools/test_regeln.js
// Fängt die Fehlerklasse „Kommentar verschluckt Code“ (zweimal passiert: Regelkonstanten bei F36, geballte Ladung bei F66):
//  1. jede P-Konstante ist eine endliche Zahl bzw. ein Objekt aus Zahlen;
//  2. die Liste der P-Schlüssel stimmt mit tools/p_schluessel.json überein (fehlende Schlüssel = verschluckt oder gestrichen → bewusst bestätigen mit --neu);
//  3. Schadensvorschau (Fernkampf und Nahkampf) und Faktortabelle liefern für alle Paarungen endliche Werte, nie NaN;
//  4. jede Einheit hat Text, Preis und Medaillen.
const fs = require('fs'), path = require('path');
const E = require('../src/engine.js'), P = E.P, T = E.TYPES;
const fehler = [], liste = path.join(__dirname, 'p_schluessel.json');
const zahl = v => typeof v === 'number' ? Number.isFinite(v) : v && typeof v === 'object' ? Object.values(v).every(zahl) : false;
for (const [k, v] of Object.entries(P)) if (!zahl(v)) fehler.push(`P.${k} ist keine Zahl: ${JSON.stringify(v)}`);
const jetzt = Object.keys(P).sort();
if (process.argv.includes('--neu') || !fs.existsSync(liste)) { fs.writeFileSync(liste, JSON.stringify(jetzt, null, 1) + '\n'); console.log(`p_schluessel.json geschrieben (${jetzt.length} Schlüssel)`); }
else { const alt = JSON.parse(fs.readFileSync(liste, 'utf8'));
  const weg = alt.filter(k => !jetzt.includes(k)), neu = jetzt.filter(k => !alt.includes(k));
  if (weg.length) fehler.push(`P-Schlüssel fehlen (verschluckt?): ${weg.join(', ')} – wenn gewollt: node tools/test_regeln.js --neu`);
  if (neu.length) console.log(`Hinweis: neue P-Schlüssel ${neu.join(', ')} – mit --neu in die Liste aufnehmen`); }
// Schadensvorschau für alle Paarungen
const G = E.newGame({ seed: 1, map: 'grauwall' }); E.startTurn(G);
const vorlage = G.units[0];
const mk = (t, side, c, r) => Object.assign({}, vorlage, { id: 9000 + c * 100 + r, type: t, side, c, r, str: 10, mor: T[t].mor, status: 'ok', supp: 0, dug: false, face: side === 'A' ? 0 : 3 });
let paare = 0;
for (const a of Object.keys(T)) for (const d of Object.keys(T)) {
  if (T[a].side === T[d].side) continue; const A = mk(a, T[a].side, 5, 3), D = mk(d, T[d].side, 6, 3);
  for (const art of ['fire', 'melee']) { const p = E.preview(G, A, D, art); paare++;
    if (!Number.isFinite(p.dmg) || (p.counter != null && !Number.isFinite(p.counter))) fehler.push(`preview ${art} ${a} → ${d}: dmg ${p.dmg}, counter ${p.counter}`); }
  for (const r of [true, false]) { const f = E.faktor(a, d, r); if (!Number.isFinite(f.f)) fehler.push(`faktor ${a} → ${d} (${r ? 'Fern' : 'Nah'}): ${f.f}`); }
}
for (const [k, g] of Object.entries(E.TERRAIN || {})) {   // Gelände-Chroniken (Paket A4)
  if (!g.chronik || !g.chronik.quelle || !g.chronik.text) fehler.push(`Gelände ${k}: Chroniken-Text (quelle, text) fehlt`);
  if (g.real) fehler.push(`Gelände ${k}: alter Text „real“ (Weltkrieg) noch vorhanden`);
}
if (!E.TERRAIN) fehler.push('E.TERRAIN fehlt – Gelände-Texte nicht prüfbar');
for (const [k, t] of Object.entries(T)) {
  if (!t.can || !t.chronik || !t.chronik.quelle || !t.chronik.text) fehler.push(`${k}: Text „can“ oder Chroniken-Text (quelle, text) fehlt`);
  else if (t.chronik.text.length > 280) fehler.push(`${k}: Chroniken-Text länger als 280 Zeichen`);
  if (t.real) fehler.push(`${k}: alter Text „real“ (Weltkrieg) noch vorhanden`);
  const c = E.costParts(k).total; if (!Number.isFinite(c) || c <= 0) fehler.push(`${k}: Preis ${c}`);
  const m = E.medaillen(k); if (!m || !['gold', 'silber', 'bronze', 'keine'].includes(m.nah)) fehler.push(`${k}: Medaillen ${JSON.stringify(m)}`);
}
if (fehler.length) { console.log(`FEHLER (${fehler.length}):\n  ` + fehler.slice(0, 40).join('\n  ')); process.exit(1); }
console.log(`Regeln in Ordnung: ${jetzt.length} P-Konstanten, ${paare} Schadensvorschauen, ${Object.keys(T).length} Einheiten.`);
