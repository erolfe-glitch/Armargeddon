// Daten für die Entwurfsseite entwurf/probe/bedienfeld.html (Paket 5, 2026-11-17): Nachschub-Liste des Konkordats aus den echten Spieldaten
// (Name, Kosten, Kategorie, Schlagworte, Text, Porträt-Schlüssel in src/figs.js). Aufruf: node tools/entwurf_bedienfeld.js
const fs = require('fs'), path = require('path');
const E = require('../src/engine.js');
const ui = fs.readFileSync(path.join(__dirname, '../src/ui.js'), 'utf8');
const lit = name => { const i = ui.indexOf(`const ${name} = {`); let d = 0, j = ui.indexOf('{', i); const s = j; for (; j < ui.length; j++) { if (ui[j] === '{') d++; else if (ui[j] === '}' && --d === 0) break; } const scope = new Proxy({}, { has: k => !(k in globalThis), get: () => ({}) });   // Hilfskonstanten (z. B. SANI) als leere Objekte
  return new Function('scope', 'with (scope) return (' + ui.slice(s, j + 1) + ');')(scope); };
const FIGMAP = lit('FIGMAP'), POSE = lit('PORTRAIT_POSE');
const figs = fs.readFileSync(path.join(__dirname, '../src/figs.js'), 'utf8');
const hat = k => figs.includes(`"${k}":`);
const bild = t => { const m = FIGMAP[t]; if (!m) return null; const k = m[1] ? `konkordat_${m[0]}_${POSE[m[0]] || 1}` : `konkordat_${m[0]}`; return hat(k) ? k : null; };
// Kategorien des Nachschub-Menüs
const kat = t => { const T = E.TYPES[t];
  if (T.cmd) return 'Kommando';
  if (T.cls === 'walker' || E.isMech(t)) return 'Fahrzeuge und Kampfmaschinen';
  if (T.cls === 'art') return 'Artillerie';
  if (['kohorte', 'grenadier', 'mahlwerk', 'sense', 'reiter', 'lanzeD', 'feldscher', 'heiler', 'melder'].includes(t)) return 'Standard';   // Linientruppen
  return 'Spezial'; };
const shop = E.SHOP.A.map(t => { const T = E.TYPES[t]; return { t, name: T.name, kosten: E.COST[t], kat: kat(t), tags: (T.sp || []).slice(0, 3), text: T.can, real: T.chronik && T.chronik.text, bild: bild(t), mech: E.isMech(t),
  werte: { Angriff: T.atk, Abwehr: T.def, Moral: T.mor, Zug: T.mv, Reichweite: T.rng } }; });
const k = E.TYPES.kohorte;
const einheit = { name: k.name, seite: 'Konkordat', feld: 'Schützengraben', leben: 100, moral: 70, moralMax: 70, ap: 2, zug: k.mv, rng: k.rng, tags: k.sp, text: k.can, real: k.chronik && k.chronik.text, bild: bild('kohorte'),
  werte: { Angriff: k.atk, Abwehr: k.def, Moral: k.mor, Zug: k.mv, Reichweite: k.rng }, deckung: 'Gold (Graben)', zustand: ['bereit'],
  knoepfe: [['zielen', 'Beschuss', 1], ['nahkampf', 'Nahkampf', 2], ['auge', 'Feuerbereitschaft', 2], ['spitzhacke', 'Eingraben', 1], ['drehpfeil', 'Nach links drehen', 0], ['drehpfeil', 'Nach rechts drehen', 0, 1], ['haken', 'Fertig', 0]] };
const out = `// Erzeugt von tools/entwurf_bedienfeld.js – Daten für entwurf/probe/bedienfeld.html (Entwurf, nicht im Spiel)\nwindow.ENTWURF = ${JSON.stringify({ shop, einheit, punkte: 140 }, null, 1)};\n`;
fs.writeFileSync(path.join(__dirname, '../entwurf/probe/bedienfeld_daten.js'), out);
const n = {}; for (const s of shop) n[s.kat] = (n[s.kat] || 0) + 1;
console.log('Einheiten', shop.length, JSON.stringify(n), 'ohne Bild:', shop.filter(s => !s.bild).map(s => s.t).join(', ') || '–');
