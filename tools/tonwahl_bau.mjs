// F91 (2026-11-22): Ton-Pult-Wahl ins Spiel übernehmen. Wahltypen: p:Platz | k:Schlüssel | pk:[Schlüssel, …] (eigenes Paket) | - (still).
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
// Ton-Pult 3 (2026-11-23): Abstellkammer und eigene Mischtöne aus dem neuesten Export, der sie enthält (pult3). Mischtöne aller Exporte bleiben erhalten (neuerer gewinnt je Schlüssel).
const mitP3 = exporte.filter(x => x.j.pult3), p3 = mitP3[mitP3.length - 1], mischAlle = {};
for (const x of mitP3) for (const m of x.j.mischtoene || []) if (m && m.key && Array.isArray(m.spuren)) mischAlle[m.key] = m;
// alle Schlüssel aus SOUNDS (Spiel und Pult), nicht nur die in Tonplätzen – sonst gehen Einzeltöne wie horn, tiger, gallop als „Ton fehlt“ verloren (Ton-Bericht Punkt 3)
const sKeys = f => { try { return [...readFileSync(join(ROOT, f), 'utf8').matchAll(/^\s+([A-Za-z0-9_]+): 'data:/gm)].map(m => m[1]); } catch (e) { return []; } };
const SNDVAR = new Set((/const SND_VAR = \{([^\n]*)/.exec(readFileSync(join(ROOT, 'src/ui.js'), 'utf8')) || ['', ''])[1].match(/\b([A-Za-z0-9_]+): \[/g)?.map(x => x.split(':')[0]) || []);   // Sammelnamen (punch, artD …) aus ui.js
const echteKeys = new Set([...Object.values(D.pools).flat().map(x => x[0]), ...sKeys('src/sound.js'), ...sKeys('src/sound_pult.js')]), tab = {}, bericht = [], MISCHTON = {};
for (const [key, m] of Object.entries(mischAlle)) { const sp = m.spuren.filter(x => echteKeys.has(x.k)); if (sp.length < m.spuren.length) bericht.push(`Mischton ${key}: ${m.spuren.length - sp.length} Spur(en) ohne Ton – ausgelassen`); if (sp.length) MISCHTON[key] = sp.map(x => [x.k, +(x.vol == null ? 1 : x.vol), Math.round(x.ms || 0), +(x.ton || 1)]); }
const alleKeys = new Set([...echteKeys, ...Object.keys(MISCHTON)]);
const TON_AUS = p3 ? ((p3.j.aussortiert && p3.j.aussortiert.schluessel) || []).filter(k => echteKeys.has(k)).sort() : [];
// Ton-Spur 2026-11-23: „Stollen sprengen“ stand beim Mineur, klingt aber zu Rundenbeginn ohne Einheit → Zeile unter „Gelände und Gebäude“; alte Wahl dorthin
if (wahl.has('mineur|stollenboom') && !wahl.has('gelaende|stollenboom')) { const e = wahl.get('mineur|stollenboom'); wahl.set('gelaende|stollenboom', { ...e, einheit: 'gelaende', verlegt: 1 }); wahl.delete('mineur|stollenboom'); bericht.push('mineur|stollenboom: Wahl nach „Gelände und Gebäude“ verlegt'); }
// Vorgaben aus dem Auftrag (SP-3, 84.10): gelten, solange kein Export für diese Zeile eine eigene Wahl enthält
const VORGABE = [['orden', 'kettensaege_fl', 'k:held_kschwert_metall_3'], ['orden', 'kettensaege_me', 'k:held_kschwert_metall_4']];
for (const [t, id, w] of VORGABE) { const z = (D.einheiten.find(x => x.t === t) || { slots: [] }).slots.find(y => y.id === id);
  if (z && !wahl.has(t + '|' + id)) { wahl.set(t + '|' + id, { einheit: t, platz_id: id, wahl: w, lautstaerke: z.vol, tonhoehe: 1, verlegt: 1, quelle: 'Vorgabe' }); bericht.push(`${t}|${id}: Vorgabe aus dem Auftrag (${w.slice(2)})`); } }
// Zeilen, die bis 21:00 im Spiel denselben Platz hatten und jetzt einen eigenen bekommen (spiel): bisherige Wahl auf die Schwester-Zeile übertragen, wenn dort keine eigene steht
for (const u of D.einheiten) { const gruppen = {}; for (const z of u.slots) if (z.mode !== 'ruf' && z.platz && z.platz !== '-') (gruppen[z.platz] = gruppen[z.platz] || []).push(z);
  for (const zs of Object.values(gruppen)) { if (zs.length < 2 || new Set(zs.map(z => z.spiel || z.platz)).size < 2) continue;
    for (const z of zs) { const e = wahl.get(u.t + '|' + z.id); if (!e || e.uebertragen) continue;
      for (const y of zs) if (y !== z && !wahl.has(u.t + '|' + y.id)) { wahl.set(u.t + '|' + y.id, { ...e, platz_id: y.id, lautstaerke: e.lautstaerke / (z.vol || 1) * (y.vol || 1), uebertragen: z.id }); bericht.push(`${u.t}|${y.id}: Wahl von „${z.titel}“ übertragen (eigener Platz seit 21:00)`); } } } }
for (const [k, e] of wahl) {
  const einh = D.einheiten.find(x => x.t === e.einheit), zeile = einh && einh.slots.find(z => z.id === e.platz_id);
  if (einh && !zeile) { bericht.push(`${k}: diese Zeile gibt es im Pult nicht mehr (die Einheit spielt den Ton im Spiel nie) – ausgelassen`); continue; }
  const ruf = zeile && zeile.mode === 'ruf', platz = ruf ? zeile.id : zeile ? (zeile.spiel || zeile.platz) : e.platz_spiel, volSpiel = zeile ? zeile.vol : e.lautstaerke_spiel;   // Rufe (Stimmen): Platz = Zeile
  if (!platz || platz === '-') { bericht.push(`${k}: keine Zeile im Spiel – ausgelassen`); continue; }
  const w = { };
  if (e.wahl === '-') w.aus = 1;
  else if (e.wahl.startsWith('k:')) { const key = e.wahl.slice(2); if (!alleKeys.has(key)) { bericht.push(`${k}: Ton ${key} fehlt – ausgelassen`); continue; } w.k = key; }
  else if (e.wahl.startsWith('pk:')) { let l = []; try { l = JSON.parse(e.wahl.slice(3)); } catch (x) {} if (!Array.isArray(l)) l = [];   // eigenes Paket (Punkt 25, 2026-11-24): pk:["schlüssel", …], im Spiel klingt zufällig einer
    const da = [...new Set(l)].filter(x => alleKeys.has(x) && !(ruf && MISCHTON[x])); if (da.length < l.length) bericht.push(`${k}: eigenes Paket – ${l.length - da.length} von ${l.length} Tönen fehlen oder sind Mischtöne in einer Ruf-Zeile – ausgelassen`);
    if (!da.length) { bericht.push(`${k}: eigenes Paket leer – ausgelassen`); continue; } if (da.length === 1) w.k = da[0]; else w.pk = da; }
  else if (e.wahl.startsWith('p:')) { const p = e.wahl.slice(2); if (!D.pools[p] && !SNDVAR.has(p)) { bericht.push(`${k}: Platz ${p} fehlt – ausgelassen`); continue; } if (p !== (zeile ? zeile.platz : platz)) w.p = p; }
  const vf = volSpiel ? +(e.lautstaerke / volSpiel).toFixed(3) : 1; if (Math.abs(vf - 1) > 0.01) w.vf = vf;
  if (e.tonhoehe && Math.abs(e.tonhoehe - 1) > 0.005) w.rate = e.tonhoehe;
  if (ruf && w.k && MISCHTON[w.k]) { bericht.push(`${k}: Mischton in einer Ruf-Zeile kann das Spiel nicht mischen – ausgelassen`); continue; }
  if (ruf) { if (!w.k && !w.pk && !w.aus && zeile.platz === '-' && !w.p) { bericht.push(k + ': Ruf ohne Ton – ausgelassen'); continue; } w.filt = e.filter_stimme || zeile.filt || 'maske'; w.fst = e.filter_staerke != null ? e.filter_staerke : zeile.fst != null ? zeile.fst : 0.6; }   // Rufe mit Standard-Platz: Filter auch ohne eigenen Ton übernehmen
  if (!Object.keys(w).length) continue;
  if (zeile && !ruf) w.r = ['treffer', 'tod'].includes(zeile.ab) ? 'z' : 'a';   // Täter oder Getroffener (tonKontext, Ton-Bericht Punkt 2)
  const te = tab[e.einheit] = tab[e.einheit] || {}, vor = te[platz];   // derselbe Platz in einer Handeln- und einer Getroffen-Zeile: zweite Wahl unter '<platz>#z' (ui.js tonWahl)
  if (vor && vor.r && w.r && vor.r !== w.r) { if (w.r === 'z') te[platz + '#z'] = w; else { te[platz + '#z'] = vor; te[platz] = w; } } else te[platz] = w;
  if (zeile && e.platz_spiel && e.platz_spiel !== platz) bericht.push(`${k}: Pult-Zeile zeigte ${e.platz_spiel}, das Spiel spielt ${platz} – dort eingetragen`);
  if (!ausNeu.has(k) && !e.verlegt) bericht.push(`${k}: nur in älterem Export (${e.quelle})`);
}
const F = join(ROOT, 'src/ui.js'); let s = readFileSync(F, 'utf8');
const a = s.indexOf('// TONWAHL-ANFANG'), b = s.indexOf('// TONWAHL-ENDE');
if (a < 0 || b < 0) throw new Error('Marken TONWAHL-ANFANG/-ENDE fehlen in src/ui.js');
const n = Object.values(tab).reduce((x, o) => x + Object.keys(o).length, 0);
const block = `// TONWAHL-ANFANG (erzeugt mit tools/tonwahl_bau.mjs aus ${exporte.length} Ton-Pult-Exporten, neuester ${neuste.f}; ${n} Einträge – nicht von Hand ändern)\nconst TONWAHL = ${JSON.stringify(tab)};\nconst TON_AUS = new Set(${JSON.stringify(TON_AUS)});   // Abstellkammer (Ton-Pult 3): aussortierte Tonschlüssel, fallen aus der Zufallsauswahl (sndPick, Sprüche)\nconst MISCHTON = ${JSON.stringify(MISCHTON)};   // eigene Mischtöne (Ton-Pult 3): Schlüssel → Spuren [Ton, Lautstärke, Versatz ms, Tonhöhe], gemischt beim Abspielen (playSound)\n`;
s = s.slice(0, a) + block + s.slice(b); writeFileSync(F, s);
console.log(`${wahl.size} Pult-Wahlen zusammengeführt, ${n} wirken im Spiel (${Object.keys(tab).length} Einheiten). Abstellkammer: ${TON_AUS.length} Töne${p3 ? ' (aus ' + p3.f + ')' : ''}. Mischtöne: ${Object.keys(MISCHTON).length}.`); for (const z of bericht) console.log('  ' + z);
