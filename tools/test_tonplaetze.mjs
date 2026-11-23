// Test „Tonplätze je Einheit: Spiel == Pult“ (2026-11-23, Ton-Pult 3). Nur node, kein Browser.
// Vergleicht tools/ton_spur.json (aus dem laufenden Spiel gewonnen: node tools/ton_spur.mjs) mit den Zeilen des Ton-Pults (D in tonpult.html):
//   fehlt   = das Spiel spielt den Platz für diese Einheit, das Pult hat keine Zeile dafür (und keine Zeile der Gegenseite der Szene erklärt ihn)
//   zu viel = Pult-Zeile, deren Platz das Spiel für diese Einheit in keiner Szene gespielt hat
//   Rolle   = Platz klingt, aber die Pult-Wahl (TONWAHL, Rolle a = handelt / z = getroffen) kann an dieser Stelle nie greifen
//   Hinweis = die Wahl greift nur in einem Teil der Fälle (zählt nicht als Fehler)
// Pult-Zeile → Spiel-Platz = spiel || platz; Rolle z bei ab 'treffer'/'tod', sonst a.
// Spur je Platz: wahl['<wie>:<eimer>'] = Szenen; wie = sp (Einheit spricht selbst), a / z (steht im Ereignis als Handelnde / als Ziel; a1 / z1 = allein im Ereignis),
// ok (steht nicht im Ereignis; ok0 = Ereignis ohne Einheiten), fest (Ton als fester Schlüssel gezogen – waffenTon, sndPick direkt, Spruch); eimer = a (Einheit handelt) / z (Einheit ist Getroffene).
// Töne der Gegenseite: Szenen heißen „art:gegner“. Steht die Einheit allein im Ereignis (a1, z1, ok0) oder spricht sie selbst, ist es ihr Ton. Handelt die Einheit, erklären
// nur die Getroffen-/Tod-Zeilen des Gegners einen Platz; wird sie getroffen, nur dessen Handeln-Zeilen; im Schlagabtausch (Nahkampf) alle seine Zeilen.
// Treffer-am-Ziel-Töne (einschlag, vorbei, einschlag_abpraller, einschlag_panzer) zählen immer zur schießenden Einheit.
// Aufruf: node tools/test_tonplaetze.mjs [einheit …]     (SPUR=tools/ton_spur_teil.json für einen Teil-Lauf; KURZ=1 nur Zahlen je Einheit; GRUPPE=1 nach Befund statt nach Einheit)   Exit-Code 1 bei Abweichungen
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SP = join(ROOT, process.env.SPUR || 'tools/ton_spur.json');
if (!existsSync(SP)) { console.error('Spur fehlt: erst node tools/ton_spur.mjs laufen lassen (' + SP + ')'); process.exit(2); }
const S = JSON.parse(readFileSync(SP, 'utf8'));
const html = readFileSync(join(ROOT, 'tonpult.html'), 'utf8'), i0 = html.indexOf('const D = ') + 10, D = JSON.parse(html.slice(i0, html.indexOf(';\n', i0)));
const hash = createHash('sha1').update((u => { const a = u.indexOf('// TONWAHL-ANFANG'), b = u.indexOf('// TONWAHL-ENDE'); return a >= 0 && b > a ? u.slice(0, a) + u.slice(b) : u; })(readFileSync(join(ROOT, 'src', 'ui.js'), 'utf8'))).digest('hex');
if (hash !== S.ui_hash) console.log('WARNUNG: src/ui.js hat sich seit der Spur geändert (Spur vom ' + S.erzeugt.slice(0, 16).replace('T', ' ') + ' UTC) – node tools/ton_spur.mjs neu laufen lassen, sonst kann der Vergleich veraltet sein.\n');

// Begründete Ausnahmen
const ALLGEMEIN = {   // Töne ohne Bezug zu einer bestimmten Einheit
  klick: 'Oberfläche', ui: 'Oberfläche', erobert: 'Zielfeld erobert', verloren: 'Zielfeld verloren', kraehe: 'Kulisse', wind: 'Kulisse', winterwind: 'Kulisse', winterwind_stark: 'Kulisse (Böe)',
  glocke: 'Kulisse', glocke_fern: 'Kulisse', zug_eigen: 'Rundenschild', zug_gegner: 'Rundenschild', horn: 'Rundenschild', getuemmel: 'Nahkampf-Getümmel (Schleife für alle)', ambient: 'Kulisse', wetter: 'Kulisse' };
const GELAENDE = {   // hängt am Feld oder Gebäude, nicht an der Einheit
  wasser: 'Einschlag im Wasser (Zielfeld)', eis_knackt: 'Eis (Feld, Winter)', eis_bricht: 'Eis bricht (Feld, Winter)', glocke_fall: 'Einsturz: Glocke', boomH: 'Einsturz: Krachen',
  einsturz: 'Gebäude stürzt ein (Pult: Gelände und Gebäude)', stollen_boom: 'Stollen gesprengt (Pult: Gelände und Gebäude)', stollen_knall: 'Stollen gesprengt (Pult: Gelände und Gebäude)', stollen_blast: 'Stollen gesprengt (Pult: Gelände und Gebäude)' };
const NICHT_NACHGESTELLT = { ruf_sieg: 'Sieg (Ereignis „over“) wird in der Spur nicht ausgelöst' };

const rolleVon = z => (['treffer', 'tod'].includes(z.ab) ? 'z' : 'a');
const platzVon = z => z.spiel || z.platz;
const U = Object.fromEntries(D.einheiten.map(u => [u.t, u]));
const zeilen = t => (U[t] ? U[t].slots.filter(z => z.mode !== 'ruf' && platzVon(z) && platzVon(z) !== '-') : []);
const cache = {}, plaetze = (t, r) => { const k = t + '|' + (r || ''); return cache[k] || (cache[k] = new Set(zeilen(t).filter(z => !r || rolleVon(z) === r).map(platzVon))); };
const WINTER = plaetze('winter');
// Ton, der schon als fertiger Schlüssel gespielt wird (z. B. Sperrfeuer-Abschüsse: einmal über die Zeile der Einheit gezogen, dann mehrfach abgespielt): zählt zum Platz dieser Zeile
const keysVonPlatz = q => { const out = new Set(); for (const n of (D.sndvar && D.sndvar[q]) || [q]) for (const e of D.pools[n] || []) out.add(e[0]); return out; };
const istSchluesselVon = (t, p) => [...plaetze(t)].some(q => keysVonPlatz(q).has(p));
const gegnerVon = sz => { const i = sz.indexOf(':'); return i < 0 ? null : sz.slice(i + 1); };
const basis = key => key.split(':')[0].replace(/[01]$/, '');
const NAHKAMPF_SZ = /^(nahkampf|gegenschlag|gegner_vernichtet|freischlag|faehigkeit_sprung)/;   // gemeinsamer Schlagabtausch: beide Seiten klingen im selben Ereignis
const TREFFER_AM_ZIEL = new Set(['einschlag', 'vorbei', 'einschlag_abpraller', 'einschlag_panzer']);   // gehören zur schießenden Einheit, klingen aber im Treffer-Ereignis des Ziels
const GEGNER_TON = { mg_abbauen: 'MG wird durch Sturmrollen/Durchbruch zurückgeschoben (Zeile des MG-Trupps)' };
const erklaert = (p, sz, key) => { const [wie, eimer] = key.split(':');
  if (eimer === 'z' && TREFFER_AM_ZIEL.has(p) && wie !== 'sp') return true;   // Ton des Angreifers; ob dem die Zeile fehlt, zeigt sich in dessen eigenen Szenen
  const g = gegnerVon(sz); if (!g || !U[g]) return false; if (GEGNER_TON[p]) return true;
  if (['sp', 'a1', 'z1', 'ok0'].includes(wie) || key === 'fest:a') return false;
  if (NAHKAMPF_SZ.test(sz)) return plaetze(g).has(p);
  return plaetze(g, eimer === 'a' ? 'z' : 'a').has(p); };   // Einheit handelt: nur Getroffen-/Tod-Zeilen des Gegners erklären; Einheit wird getroffen: nur dessen Handeln-Zeilen
// eigene Fundstellen eines Platzes: { 'wie:eimer': [Szenen] } ohne die, die eine Zeile der Gegenseite erklärt
const eigene = (sp, p) => { const out = {}; for (const [key, szenen] of Object.entries(sp.wahl[p] || {})) { const l = szenen.filter(s => !erklaert(p, s, key)); if (l.length) out[key] = l; } return out; };
const WIE = { sp: 'Einheit spricht selbst', a: 'steht im Ereignis als Handelnde', z: 'steht im Ereignis als Ziel', ok: 'steht nicht im Ereignis', fest: 'fester Schlüssel' };
const nur = process.argv.slice(2), kurz = !!process.env.KURZ, gruppiert = !!process.env.GRUPPE, gruppen = {};
let abw = 0; const summe = { fehlt: 0, zuviel: 0, rolle: 0, ruf: 0, teil: 0 }, gesehenRuf = {}, gesehenWinter = new Set();
const kurzSz = l => [...new Set(l)].slice(0, 5).join(', ') + (new Set(l).size > 5 ? ' …' : '');

for (const u of D.einheiten) { const t = u.t, sp = S.typen[t]; if (!sp || (nur.length && !nur.includes(t))) continue;
  const rows = zeilen(t), pult = plaetze(t), aus = [];
  // (a) fehlt im Pult
  for (const p of Object.keys(sp.wahl)) { if (pult.has(p) || ALLGEMEIN[p] || GELAENDE[p] || istSchluesselVon(t, p)) continue; const e = eigene(sp, p), keys = Object.keys(e); if (!keys.length) continue;
    const eimer = [...new Set(keys.map(k => (k.endsWith(':a') ? 'handelt' : 'getroffen')))].join('+');
    aus.push(['fehlt', `fehlt im Pult: ${p} (${eimer}; ${keys.map(k => WIE[basis(k)]).filter((x, i, l) => l.indexOf(x) === i).join(' / ')}; Szenen: ${kurzSz(keys.flatMap(k => e[k]))})`, `fehlt im Pult: ${p} (${eimer})`]); summe.fehlt++; }
  // (b) zu viel, (c) Rolle
  for (const z of rows) { const p = platzVon(z), r = rolleVon(z), e = eigene(sp, p), keys = Object.keys(e), wie = [...new Set(keys.map(basis))];
    if (!keys.length) { const fremd = Object.values(sp.wahl[p] || {}).flat();
      aus.push(['zuviel', `zu viel im Pult: „${z.titel}“ (${z.id}, Platz ${p}) – in keiner Szene von dieser Einheit gespielt` + (fremd.length ? ` (klingt nur als Ton der Gegenseite: ${kurzSz(fremd)})` : ''), `zu viel im Pult: „${z.titel}“ (${z.id}, Platz ${p})`]); summe.zuviel++; continue; }
    const greift = wie.includes('sp') || wie.includes(r), stoert = wie.filter(w => w !== 'sp' && w !== r);
    if (greift && !stoert.length) continue;
    const wo = w => kurzSz(keys.filter(k => basis(k) === w).flatMap(k => e[k]));
    if (greift) { aus.push(['teil', `Hinweis: „${z.titel}“ (${z.id}, Platz ${p}, Rolle ${r}): Wahl greift nur teilweise – nicht bei: ${stoert.map(w => `${WIE[w]} (${wo(w)})`).join('; ')}`, `Hinweis, Wahl greift nur teilweise: „${z.titel}“ (${z.id}, Platz ${p}, Rolle ${r}) – nicht, wenn die Einheit: ${stoert.map(w => WIE[w]).join(' / ')}`]); summe.teil++; continue; }
    const warum = wie.every(w => w === 'fest') ? 'Ton wird als fester Schlüssel gezogen (waffenTon / sndPick direkt / Spruch) – die Pult-Wahl greift nie'
      : wie.every(w => w === 'ok' || w === 'fest') ? 'die Einheit steht nicht in dem Ereignis, in dem der Ton klingt – die Pult-Wahl greift nie'
      : `Rolle vertauscht: Pult-Zeile zählt als „${r === 'a' ? 'handelt' : 'getroffen'}“, im Spiel ${stoert.map(w => WIE[w]).join(' / ')} – die Pult-Wahl greift nie`;
    aus.push(['rolle', `Rolle/Wahl: „${z.titel}“ (${z.id}, Platz ${p}, Rolle ${r}): ${warum} (Szenen: ${kurzSz(keys.flatMap(k => e[k]))})`, `Wahl greift nie: „${z.titel}“ (${z.id}, Platz ${p}, Rolle ${r}) – ${warum.split(' – ')[0]}`]); summe.rolle++; }
  // Stimmen dieser Einheit: Zeile im Pult vorhanden?
  for (const [k, szenen] of Object.entries(sp.stimmen)) { const [tab, id] = k.split('|'); (gesehenRuf[tab] = gesehenRuf[tab] || new Set()).add(id);
    if (!U[tab] || !U[tab].slots.some(z => z.id === id)) { aus.push(['ruf', `Ruf fehlt im Pult: ${tab} / ${id} (Szenen: ${kurzSz(szenen)})`, `Ruf fehlt im Pult: ${tab} / ${id}`]); summe.ruf++; } }
  // Winter: was auf der Winterkarte zusätzlich klingt, muss unter „Winter (Karte)“ oder bei der Einheit stehen
  const wi = S.winter && S.winter[t]; if (wi) for (const p of Object.keys(wi.wahl || {})) { if (WINTER.has(p)) gesehenWinter.add(p); if (WINTER.has(p) || pult.has(p) || ALLGEMEIN[p] || GELAENDE[p] || istSchluesselVon(t, p)) continue;
    const e = eigene(wi, p), keys = Object.keys(e); if (!keys.length) continue;
    aus.push(['fehlt', `fehlt im Pult (nur auf der Winterkarte): ${p} (Szenen: ${kurzSz(keys.flatMap(k => e[k]))})`, `fehlt im Pult (nur auf der Winterkarte): ${p}`]); summe.fehlt++; }
  const hart = aus.filter(a => a[0] !== 'teil').length; abw += hart;
  for (const a of aus) { const g = gruppen[a[2]] = gruppen[a[2]] || { art: a[0], wer: [], bsp: a[1] }; g.wer.push(t); }
  if (aus.length && !gruppiert) { console.log(`${u.name} (${t}): ${hart} Abweichung${hart === 1 ? '' : 'en'}` + (aus.length > hart ? `, ${aus.length - hart} Hinweis${aus.length - hart === 1 ? '' : 'e'}` : '') + (kurz ? ' – ' + ['fehlt', 'zuviel', 'rolle', 'ruf'].map(k => aus.filter(a => a[0] === k).length + ' ' + k).join(', ') : ''));
    if (!kurz) for (const a of aus) console.log('   ' + a[1]); }
}
// Pseudo-Einheiten (Stimmen, Winter): Zeilen, die in keiner Szene irgendeiner Einheit ausgelöst wurden
const echte = D.einheiten.filter(u => u.slots.some(z => z.mode !== 'ruf') && u.t !== 'winter' && u.t !== 'gelaende'), vollstaendig = echte.every(u => S.typen[u.t]);
if (!vollstaendig) console.log('Hinweis: Die Spur enthält nicht alle Einheiten (Teil-Lauf) – Rufe und Winter-Zeilen werden nicht auf „nie ausgelöst“ geprüft. Fehlend: ' + echte.filter(u => !S.typen[u.t]).map(u => u.t).slice(0, 8).join(', ') + ' …');
if (!nur.length && vollstaendig) { for (const u of D.einheiten) { if (u.slots.some(z => z.mode !== 'ruf') || u.t === 'winter' || u.t === 'gelaende') continue; const ges = gesehenRuf[u.t] || new Set();
    const nie = u.slots.filter(z => !ges.has(z.id) && !NICHT_NACHGESTELLT[z.id]);
    if (nie.length) { abw += nie.length; summe.zuviel += nie.length; console.log(`${u.name} (${u.t}): ${nie.length} Zeile${nie.length > 1 ? 'n' : ''} in keiner Szene ausgelöst` + (kurz ? '' : ': ' + nie.map(z => `„${z.titel}“ (${z.id})`).join(', '))); } }
  if (S.winter && Object.keys(S.winter).length) { const nie = [...WINTER].filter(p => !gesehenWinter.has(p) && !ALLGEMEIN[p]);
    if (nie.length) { abw += nie.length; summe.zuviel += nie.length; console.log(`Winter (Karte): ${nie.length} Zeile(n) in keiner Winter-Szene gespielt: ${nie.join(', ')}`); } } }
if (gruppiert) for (const art of ['fehlt', 'zuviel', 'rolle', 'ruf', 'teil']) { const l = Object.entries(gruppen).filter(g => g[1].art === art).sort((a, b) => b[1].wer.length - a[1].wer.length); if (!l.length) continue;
  console.log(`
== ${{ fehlt: 'Fehlt im Pult', zuviel: 'Zu viel im Pult', rolle: 'Pult-Wahl greift nie', ruf: 'Rufe ohne Zeile', teil: 'Hinweise: Wahl greift nur teilweise' }[art]} ==`);
  for (const [k, g] of l) console.log(`${k}
     ${g.wer.length} Einheit${g.wer.length > 1 ? 'en' : ''}: ${g.wer.join(', ')}`); }
const n = Object.keys(S.typen).filter(t => !nur.length || nur.includes(t)).length;
console.log(`\n${n} Einheiten geprüft: ${summe.fehlt} fehlen im Pult, ${summe.zuviel} zu viel im Pult, ${summe.rolle} Zeilen, deren Wahl nie greift, ${summe.ruf} Rufe ohne Zeile; ${summe.teil} Hinweise (Wahl greift nur teilweise).`);
console.log(abw ? 'FEHLER: Spiel und Pult stimmen nicht überein.' : 'ok: je Einheit sind die im Spiel möglichen Tonplätze gleich den Pult-Zeilen.');
process.exit(abw ? 1 : 0);
