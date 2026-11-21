// Baut tonpult.html (Hauptordner, über GitHub Pages online): je Einheit alle Tonplätze, die sie im Spiel wirklich nutzt,
// mit Abspielen, Auswahl passender Alternativen, Lautstärke und Tonhöhe; Änderungen bleiben im Browser und gehen als JSON hinaus.
// Die Zuordnung Einheit → Tonplatz bildet die Regeln in src/ui.js nach (playEvent: move, fire, shell, melee, hit, rout, destroyed,
// Fähigkeiten; selectVoice, stimmVar, stimmSatz). Ändert sich dort etwas, hier in slotsVon() nachziehen.
// Die Töne lädt die Seite aus src/sound.js (wie die Tonprobe), die Bilder kommen aus tools/tonpult_bilder.json (tools/tonpult_bilder.mjs).
// Aufruf: node tools/tonpult_bau.mjs   – nach jedem Lauf von tools/sound_bau.mjs neu bauen (wie tonprobe_bau.mjs).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const E = require(join(ROOT, 'src', 'engine.js'));
const TYPES = E.TYPES;

// Töne und Plätze aus src/sound.js (ohne Daten), Quelldateien aus entwurf/tonplaetze.json
const src = readFileSync(join(ROOT, 'src', 'sound.js'), 'utf8');
const ctx = {}; vm.createContext(ctx); vm.runInContext(src, ctx);
const POOLS = ctx.SOUND_POOLS, KEYS = Object.keys(ctx.SOUNDS);
const rows = JSON.parse(readFileSync(join(ROOT, 'entwurf', 'tonplaetze.json'), 'utf8'));
const DATEI = {}; for (const r of rows) if (r.key && r.key !== '–' && r.f && !r.f.startsWith('(') && !DATEI[r.key]) DATEI[r.key] = r.f;
const BILDER = existsSync(join(ROOT, 'tools', 'tonpult_bilder.json')) ? JSON.parse(readFileSync(join(ROOT, 'tools', 'tonpult_bilder.json'), 'utf8')) : {};

// ---- wie in src/ui.js ----
const STIMM_VOL = 1.45, SPRUCH = +(0.34 * STIMM_VOL).toFixed(3);
const PANZER = ['koloss', 'sturmpz', 'bohrer'];
const stimmVar = t => { const T = TYPES[t]; return T.cmd ? null : T.dauerfeuer ? 'mr' : PANZER.includes(t) ? 'bf' : T.cls === 'walker' ? 'mr' : T.suit ? 'gs' : 'gm'; };
const stimmSatz = t => { const T = TYPES[t]; return PANZER.includes(t) ? 'panzer' : T.cls === 'walker' || T.dauerfeuer ? 'schreiter' : T.suit ? 'anzug' : T.cmd ? 'fuehrer' : 'inf'; };
const SATZ_NAME = { inf: 'Fußtruppen (Gasmaske leicht)', anzug: 'Kampfanzüge (Gasmaske mittel)', fuehrer: 'Anführer (ohne Filter)', panzer: 'Panzerbesatzung (Bordfunk stark)', schreiter: 'Schreiter (Maschine mittel)' };
const VAR_NAME = { gm: 'Gasmaske leicht', gs: 'Gasmaske mittel', bf: 'Bordfunk stark', mr: 'Maschine mittel' };
const STIMM_PL = new Set(['loewe', 'atmen', 'pain', 'medic', 'cry', 'scream', 'roar', 'panic', 'forward', 'stand', 'charge', 'comeon', 'robot', 'husten', 'grunzen', 'gasmaske_2']);
const SHOP_KAT = ['Kommando', 'Standard', 'Spezial', 'Artillerie', 'Fahrzeuge und Kampfmaschinen'];
const SHOP_STANDARD = ['kohorte', 'grenadier', 'mahlwerk', 'sense', 'reiter', 'lanzeD', 'feldscher', 'heiler', 'melder'];
const katVon = t => { const T = TYPES[t]; return T.cmd ? 'Kommando' : T.cls === 'walker' || E.isMech(t) ? 'Fahrzeuge und Kampfmaschinen' : T.cls === 'art' ? 'Artillerie' : SHOP_STANDARD.includes(t) ? 'Standard' : 'Spezial'; };
const fireKind = T => T.mg ? 'mg' : T.flame ? 'flame' : T.gat ? 'minigun' : T.mgfire ? 'mg' : T.cls === 'walker' ? 'cannon' : 'rifle';

// Gruppen für die Auswahlliste (passende Alternativen); Stimm-Gruppen nehmen den Filter des Sprechers mit
const GRUPPEN = {
  gewehr: ['rifle', 'rifle2', 'rifle3', 'rifle4', 'sniper', 'pistol', 'semi', 'buechse', 'flinte', 'neu_schrot', 'grenade2', 'neu2_gewehr', 'neu2_pistole'],
  mg: ['mg', 'minigun', 'neu_mg_schwer', 'rifle4', 'neu2_gewehr', 'neu2_autokanone'],
  kanone: ['cannon', 'neu_kanone', 'kolosskanone', 'loewenkanone', 'panzerkanone', 'cannonH', 'artD', 'launch', 'werfer', 'neu2_kanone', 'neu2_knall', 'neu2_autokanone'],
  flamme: ['flame', 'werfer', 'feuer', 'neu2_feuer'],
  einschlag: ['einschlag', 'vorbei', 'boom', 'boomH', 'einschlagH', 'barrage', 'gas', 'rauch', 'boom2', 'blast', 'grenade2', 'wasser', 'impact', 'armor', 'feuer', 'neu2_einschlag', 'neu2_metall', 'neu2_knall', 'neu2_einsturz', 'neu2_blut', 'neu2_wasser', 'neu2_crash', 'neu3_aufprall', 'neu3_gore', 'einschlag_panzer', 'einschlag_abpraller'],
  nahkampf: ['nahA', 'nahD', 'saebel', 'sword', 'axe', 'slash', 'smash', 'heavy', 'neu_wucht', 'armor', 'grenade2', 'flinte', 'punch', 'neu2_nahkampf', 'neu2_metall', 'neu2_blut', 'neu2_monster', 'neu3_bestie', 'neu3_fleisch', 'neu3_biss', 'neu3_gore'],
  bewegung: ['schritte', 'steps', 'stepsWald', 'marschtritt', 'holzknacken', 'gallop2', 'dog', 'gespann', 'wagenknarren', 'tank', 'mech', 'neu_schritte_schwer', 'ueberrollen', 'drahtlatch', 'drahtwackeln', 'neu2_schritte', 'neu2_hund', 'neu2_flug', 'neu2_wasser'],
  fahrzeug: ['motor_auswahl', 'tank', 'mech', 'ueberrollen', 'crash', 'tiger', 'oger_bruell', 'neu_tiger_mech', 'neu_roboter', 'robot', 'neu2_crash', 'neu2_flug', 'neu2_monster', 'neu3_bestie', 'neu3_aufprall', 'ballon_brenner'],
  pferd: ['pferd_auswahl', 'pferd_unruhe', 'neigh', 'gallop2'],
  handgriff: ['cut', 'clank', 'abprotzen', 'mgsetup', 'mgladen', 'nachladen', 'neu_nachladen', 'neu_versorgung', 'schaufel', 'bauen', 'heal', 'reparieren', 'gasmaske_1', 'tick', 'ui', 'leuchtschuss', 'leuchtbrand', 'crash', 'steps', 'drahtlatch', 'drahtwackeln', 'ballon_brenner', 'neu2_knopf', 'neu2_tuer', 'neu2_crash'],
  signal: ['whistle', 'march', 'generalhorn', 'horn', 'leuchtschuss', 'zug_eigen', 'zug_gegner', 'neu2_horn', 'neu2_punkt', 'neu2_musik'],
  ruf: ['pain', 'medic', 'cry', 'scream', 'panic', 'forward', 'stand', 'roar', 'charge', 'comeon', 'husten', 'grunzen', 'gasmaske_2', 'atmen', 'robot', 'loewe', 'oger_bruell', 'neu_roboter', 'neu_tiger_mech', 'neu2_stimme', 'neu2_schrei', 'neu2_maske', 'neu2_monster', 'neu3_bestie'],
  spruch: [] };
const SND_VAR = { cry: ['cry', 'scream'], grenade: ['grenade2'], axe: ['axe', 'slash'], punch: ['punch1', 'punch2', 'punch3', 'swords'], artD: ['cannonH', 'cannon'], boom: ['boomH_1'] };
const gibt = p => POOLS[p] || KEYS.includes(p) || SND_VAR[p];
for (const g in GRUPPEN) GRUPPEN[g] = GRUPPEN[g].filter(gibt);
const NAME = { einschlag_panzer: 'Treffer Panzer – Waffe wirkt', einschlag_abpraller: 'Treffer Panzer – Abpraller', neu2_autokanone: 'Autokanone (neu 21.11.)', neu2_gewehr: 'Gewehr (Quelle, neu 21.11.)', neu2_pistole: 'Pistole Walther (neu 21.11.)', neu2_kanone: 'Schwere Bordkanone (neu 21.11.)', neu2_einschlag: 'Einschlag/Kugeltreffer (neu 21.11.)', neu2_metall: 'Metalltreffer (neu 21.11.)', neu2_knall: 'Knallkörper (neu 21.11.)', neu2_einsturz: 'Turm stürzt ein (neu 21.11.)', neu2_nahkampf: 'Faust/Axt/Schild (neu 21.11.)', neu2_blut: 'Blutspritzer (neu 21.11.)', neu2_schrei: 'Brüllen (neu 21.11.)', neu2_stimme: 'Stimmen englisch/Gefechtsrufe (neu 21.11.)', neu2_maske: 'Schmerz in Gasmaske (neu 21.11.)', neu2_monster: 'Monster (später Dämonen, neu 21.11.)', neu2_horn: 'Kriegshorn (neu 21.11.)', neu2_musik: 'Heldenmarsch, Schleife (neu 21.11.)', neu2_punkt: 'Punkt gewonnen (neu 21.11.)', neu2_knopf: 'Knopfklick (neu 21.11.)', neu2_tuer: 'Tür/Riegel (neu 21.11.)', neu2_crash: 'Aufprall/Maschine (neu 21.11.)', neu2_flug: 'Flugzeug (neu 21.11.)', neu2_schritte: 'Maschinen-/Schneeschritte (neu 21.11.)', neu2_hund: 'Hund bellt (neu 21.11.)', neu2_feuer: 'Großes Feuer (neu 21.11.)', neu2_wasser: 'Wasser/Schwimmen (neu 21.11.)',
  neu3_bestie: 'Bestien-Nahkampf: Tiger-Attacke (neu 21.11.)', neu3_fleisch: 'Gore-Treffer: Stich ins Fleisch (neu 21.11.)', neu3_biss: 'Bestien-Nahkampf: Biss auf Panzerung (neu 21.11.)', neu3_gore: 'Gore-Treffer: Blut/Spaten (neu 21.11.)', neu3_aufprall: 'Aufprall/Einsturz schwer (neu 21.11.)', ballon_brenner: 'Ballon-Brenner, Fauchen (neu 21.11.)',
  oger_bruell: 'Löwengebrüll (Löwenoger, neu)', neu_tiger_mech: 'Mechanischer Löwe (neu)', neu_roboter: 'Roboter-Brüllen/Stimme (neu)', neu_schritte_schwer: 'Schwere Schritte (neu)',
  neu_mg_schwer: 'Schweres MG (neu)', neu_schrot: 'Schrot (neu)', neu_kanone: 'Kanone (neu)', neu_wucht: 'Schwerer Treffer (neu)', neu_nachladen: 'Nachladen (neu)', neu_versorgung: 'Versorgung/Kulisse (neu)',
  rifle: 'Hauptgewehr der Seite', rifle2: 'Gewehr 2 (battle-rifle)', rifle3: 'Gewehr 3', rifle4: 'Gewehr 4 (Gefechtslärm)', sniper: 'Scharfschütze', pistol: 'Pistole', semi: 'Halbautomat', buechse: 'Panzerbüchse', flinte: 'Flinte',
  grenade2: 'Handgranate', mg: 'Maschinengewehr', minigun: 'Drehlauf', cannon: 'Kanone', kolosskanone: 'Koloss-/Schreiterkanone', loewenkanone: 'Löwenmaul-Kanone', panzerkanone: 'Sturmpanzer-Kanone', cannonH: 'Schwere Artillerie',
  artD: 'Artillerie Aschenwacht (schwer + Kanone)', launch: 'Mörser/Minenwerfer', werfer: 'Werfer', flame: 'Flammenwerfer', feuer: 'Brennendes Feld', einschlag: 'Kugeleinschlag', vorbei: 'Kugel vorbei', boom: 'Granateinschlag',
  boomH: 'Einschlag schwer', einschlagH: 'Einschlag Einzelschuss', barrage: 'Sperrfeuer', gas: 'Gas-/Rauchgeschoss', rauch: 'Gas-/Nebelhandgranate', boom2: 'Gerät zerstört', blast: 'Sprengung', wasser: 'Einschlag im Wasser',
  impact: 'Treffer auf Stein', armor: 'Treffer auf Panzerung', nahA: 'Nahkampf Konkordat', nahD: 'Nahkampf Aschenwacht', saebel: 'Säbel', sword: 'Klinge (Kampfanzug)', axe: 'Axt', slash: 'Klinge', smash: 'Bohrkoloss',
  heavy: 'Schwerer Treffer', punch: 'Fäuste und Klingen', schritte: 'Schritte', steps: 'Schlammschritte', stepsWald: 'Schritte im Wald', marschtritt: 'Marschtritt', holzknacken: 'Holzknacken', gallop2: 'Galopp', dog: 'Hund',
  gespann: 'Gespann', wagenknarren: 'Wagen knarrt', tank: 'Kettenrollen', mech: 'Maschinenschritte', ueberrollen: 'Überrollen', drahtlatch: 'Draht klirrt', drahtwackeln: 'Draht wackelt', motor_auswahl: 'Motor beim Anklicken',
  crash: 'Panne/Festfahren', tiger: 'Brüllen (Klauenschreiter)', robot: 'Maschine getroffen', pferd_auswahl: 'Pferd beim Anklicken', pferd_unruhe: 'Pferd unruhig', neigh: 'Wiehern', cut: 'Draht schneiden', clank: 'Aufprotzen',
  abprotzen: 'Abprotzen', mgsetup: 'MG aufstellen', mgladen: 'MG-Verschluss', nachladen: 'Nachladen', schaufel: 'Schaufel', bauen: 'Bauen', heal: 'Versorgen', reparieren: 'Reparieren', gasmaske_1: 'Gasmaske', tick: 'Tick',
  ui: 'Knopf', leuchtschuss: 'Leuchtpistole', leuchtbrand: 'Leuchtkugel brennt', whistle: 'Pfeife', march: 'Marsch/Verstärkung', generalhorn: 'Generalhorn', horn: 'Signalhorn', zug_eigen: 'Trommelwirbel', zug_gegner: 'Wirbel + Horn',
  pain: 'Schmerz', medic: '„Sanitäter!“', cry: 'Kampfschrei', scream: 'Schrei', panic: 'Panik', forward: '„Vorwärts“', stand: '„Haltet stand“', roar: 'Ruf Aschenwacht', charge: 'Gegenstoß', comeon: 'Befehl überbringen',
  husten: 'Husten', grunzen: 'Grunzen', gasmaske_2: 'Maskenlaut', atmen: 'Schweres Atmen', loewe: 'Löwengebrüll' };

// ---- Tonplätze je Einheit (nach src/ui.js) ----
const AB = [['anw', 'Anwählen'], ['zug', 'Bewegung'], ['schuss', 'Schuss'], ['ziel', 'Einschlag beim Ziel'], ['nah', 'Nahkampf'], ['treffer', 'Getroffen'], ['tod', 'Tod und Ausfall'], ['abil', 'Fähigkeiten und Handgriffe'], ['ankunft', 'Ankunft']];
function slotsVon(t) {
  const T = TYPES[t], sd = T.side, k = T.cls, fig = T.fig, v = stimmVar(t), out = [];
  const S = (ab, id, titel, platz, vol, o = {}) => out.push({ ab, id, titel, platz, vol: +vol.toFixed(3), v: STIMM_PL.has(platz) ? (o.v === undefined ? v : o.v) : null, gruppe: o.gruppe, mode: o.mode || 'eins', rate: o.rate || null, dur: o.dur || 0, hin: o.hin || '', kette: o.kette || null, sd: o.sd || sd });
  const fuss = ['inf', 'mg', 'storm', 'medic', 'flame'].includes(k), stimme = vol => vol * STIMM_VOL;
  // Anwählen (selectVoice)
  if (t === 'oger') S('anw', 'spruch', 'Brüllen beim Anklicken', 'oger_bruell', 0.4, { gruppe: 'fahrzeug', kette: 'anw', hin: 'Löwenoger: Brüllen statt Spruch.' }); else
  S('anw', 'spruch', 'Spruch beim Anklicken', `sv_${stimmSatz(t)}_${sd}`, SPRUCH, { gruppe: 'spruch', mode: 'stimme', rate: 1, hin: `Feste Stimme je Einheit, reihum vergeben; Beutel ohne Wiederholung. Sprecher: ${SATZ_NAME[stimmSatz(t)]}.`, kette: 'anw' });
  if (PANZER.includes(t)) S('anw', 'motor', 'Motor beim Anklicken', 'motor_auswahl', 0.13, { gruppe: 'fahrzeug', mode: 'motor', hin: 'Kurz aufheulen (0,7 s, Tonhöhe 0,8 → 1,2), unter der Stimme auf 40 % abgesenkt.', kette: 'anw' });
  if (k === 'cav') S('anw', 'pferd', 'Pferd beim Anklicken', 'pferd_auswahl', 0.26, { gruppe: 'pferd', kette: 'anw' });
  // Bewegung (move)
  if (k === 'cav') S('zug', 'ziehen', 'Ziehen (Galopp)', 'gallop2', 0.55, { gruppe: 'bewegung', kette: 'zug' });
  else if (T.limber) { S('zug', 'ziehen', 'Ziehen aufgeprotzt: Gespann', 'gespann', 0.5, { gruppe: 'bewegung', kette: 'zug' }); }   // F8: Wagenknarren entfernt (pfiff wie ein Zug)
  else if (k === 'walker') { S('zug', 'ziehen', fig ? 'Ziehen (Maschinenschritte)' : 'Ziehen (Kettenrollen)', fig ? 'mech' : 'tank', fig ? 0.5 : 0.3, { gruppe: 'bewegung', kette: 'zug', hin: 'Unter einer Stimme auf 40 % abgesenkt.' });
    S('zug', 'walzen', 'Draht niederwalzen', 'ueberrollen', 0.55, { gruppe: 'fahrzeug', hin: 'Über eine Barrikade: dasselbe mit 0,5.' }); }
  else if (T.mech || T.dauerfeuer) S('zug', 'ziehen', 'Ziehen (Kampfanzug)', 'mech', 0.45, { gruppe: 'bewegung', kette: 'zug' });
  else {
    if (fig === 'dog') S('zug', 'hund', 'Hund beim Ziehen', 'dog', 0.5, { gruppe: 'bewegung', kette: 'zug' });
    S('zug', 'ziehen', 'Ziehen (Schritte)', 'schritte', 0.5, { gruppe: 'bewegung', kette: 'zug' });
    S('zug', 'marsch', 'Marsch und Sturmlauf', 'schritte', 0.6, { gruppe: 'bewegung', hin: 'Nur Schritte, keine Trommel mehr (F49).' });
    S('zug', 'schlamm', 'Ziehen durch Schlamm', 'steps', 0.5, { gruppe: 'bewegung' });
    S('zug', 'wald', 'Ziehen durch Wald', 'stepsWald', 0.5, { gruppe: 'bewegung' });
    S('zug', 'holz', 'Äste knacken (Wald, 2×)', 'holzknacken', 0.45, { gruppe: 'bewegung' });
    if (fuss && !T.wireProof && !T.suit) { S('zug', 'draht1', 'In den Draht: Klirren', 'drahtlatch', 0.5, { gruppe: 'handgriff' }); S('zug', 'draht2', 'In den Draht: Wackeln', 'drahtwackeln', 0.4, { gruppe: 'handgriff' }); }
  }
  // Schuss und Einschlag (fire, shell)
  const kanone = (x, Tx) => x === 'kreuz' ? 'loewenkanone' : ['koloss', 'turm'].includes(x) ? 'kolosskanone' : Tx.side === 'D' && Tx.cls === 'walker' ? 'panzerkanone' : 'cannon';
  if (k === 'art') {
    const mob = T.mobile, ab = mob ? 'launch' : t === 'feldkanone' ? 'cannon' : sd === 'D' ? 'artD' : 'cannonH';
    S('schuss', 'schuss', mob ? 'Abschuss (Steilfeuer)' : 'Abschuss', ab, mob ? 0.42 : 0.8, { gruppe: 'kanone', kette: 'schuss', hin: `Sperrfeuer: ${mob ? 3 : 4} Abschüsse desselben Tons mit ${mob ? '0,42' : '0,75'}.` });
    S('ziel', 'ziel', 'Einschlag Einzelschuss', mob ? 'boom' : 'einschlagH', mob ? 0.7 : 0.8, { gruppe: 'einschlag', kette: 'ziel', hin: 'Nach der Flugzeit (ca. 0,57 s).' });
    S('ziel', 'sperr', 'Einschläge Sperrfeuer', mob ? 'boom' : 'boomH', 0.5, { gruppe: 'einschlag', hin: 'Je Feld ein Einschlag, versetzt.' });
    if (T.gas) S('ziel', 'gas', 'Gasgranate', 'gas', 0.7, { gruppe: 'einschlag' });
    S('ziel', 'wasser', 'Einschlag im Wasser (zusätzlich)', 'wasser', 0.6, { gruppe: 'einschlag' });
    S('ziel', 'panzer', 'Treffer auf Panzerung (Waffe wirkt)', 'einschlag_panzer', 0.5, { gruppe: 'einschlag', hin: 'Ziel ist ein Fahrzeug, Schreiter oder Kampfanzug; gilt für alle Waffen, die dagegen wirken (F64).' });
  } else {
    const fk = fireKind(T);
    if (fk === 'flame') { S('schuss', 'schuss', 'Flammenstrahl', 'flame', 0.6, { gruppe: 'flamme', kette: 'schuss' }); S('ziel', 'feuer', 'Feld fängt Feuer', 'flame', 0.4, { gruppe: 'flamme', kette: 'ziel' }); }
    else if (fk === 'rifle') {
      const rs = t === 'oger' ? 'flinte' : T.lob ? 'grenade' : T.pin || T.hidden ? 'sniper' : T.cmd ? 'pistol' : T.suit ? 'semi' : 'rifle', p = t === 'buechse' ? 'buechse' : rs;
      if (p === 'rifle') S('schuss', 'schuss', 'Gewehrsalve (je Figur ein Schuss)', 'rifle', 0.3, { gruppe: 'gewehr', mode: 'salve', kette: 'schuss', hin: 'Bis 4 Schüsse aus derselben Datei, unregelmäßig versetzt, nur der letzte klingt voll aus.' });
      else S('schuss', 'schuss', 'Schuss', p, 0.6, { gruppe: 'gewehr', kette: 'schuss' });
      S('ziel', 'ziel', 'Treffer am Ziel', 'einschlag', 0.35, { gruppe: 'einschlag', kette: 'ziel' });
      S('ziel', 'vorbei', 'Streifschuss / daneben', 'vorbei', 0.35, { gruppe: 'einschlag' });
      if (T.at || t === 'buechse') S('ziel', 'panzer', 'Treffer auf Panzerung (Waffe wirkt)', 'einschlag_panzer', 0.5, { gruppe: 'einschlag', hin: 'Ziel ist ein Fahrzeug, Schreiter oder Kampfanzug; gilt für alle Waffen, die dagegen wirken (F64).' }); else S('ziel', 'abpraller', 'Treffer auf Panzerung (Abpraller)', 'einschlag_abpraller', 0.3, { gruppe: 'einschlag', hin: 'Ziel ist ein Fahrzeug, Schreiter oder Kampfanzug; die Waffe prallt ab (F64).' });
    } else if (fk === 'mg' || fk === 'minigun') {
      if (T.dauerfeuer) { S('schuss', 'schuss', 'Schweres MG aus der Hüfte', 'mg', 0.62, { gruppe: 'mg', kette: 'schuss', rate: 0.83, hin: 'Tiefer gestimmt (0,80–0,86). Dauerfeuer: dieselbe Salve ein zweites Mal.' }); }
      else S('schuss', 'schuss', fk === 'mg' ? 'MG-Feuer' : 'Drehlauf', fk, 0.55, { gruppe: 'mg', kette: 'schuss' });
      S('ziel', 'ziel', 'Einschlag in den Körper (dumpf)', 'einschlag', 0.22, { gruppe: 'einschlag', rate: 0.82, dur: 260, kette: 'ziel', hin: 'Tiefer gestimmt (0,78–0,86) und nach 0,26 s ausgeblendet.' });
      S('ziel', 'vorbei', 'Daneben', 'vorbei', 0.35, { gruppe: 'einschlag' });
      S('ziel', 'abpraller', 'Treffer auf Panzerung (Abpraller)', 'einschlag_abpraller', 0.3, { gruppe: 'einschlag', hin: 'Ziel ist ein Fahrzeug, Schreiter oder Kampfanzug; die Waffe prallt ab (F64).' });
    } else if (fk === 'cannon') {
      S('schuss', 'schuss', 'Kanone', kanone(t, T), 0.6, { gruppe: 'kanone', kette: 'schuss' });
      S('ziel', 'ziel', 'Granateinschlag', 'boom', 0.45, { gruppe: 'einschlag', kette: 'ziel' });
      S('ziel', 'panzer', 'Treffer auf Panzerung (Waffe wirkt)', 'einschlag_panzer', 0.5, { gruppe: 'einschlag', hin: 'Ziel ist ein Fahrzeug, Schreiter oder Kampfanzug; gilt für alle Waffen, die dagegen wirken (F64).' });
    }
  }
  if (T.zweit) { const Z = T.zweit; if (Z.flamme) S('schuss', 'zweit', 'Zweitwaffe: ' + Z.name, 'flame', 0.6, { gruppe: 'flamme' });
    else S('schuss', 'zweit', 'Zweitwaffe: ' + Z.name, Z.kanone ? kanone(t, T) : 'mg', Z.kanone ? 0.6 : 0.55, { gruppe: Z.kanone ? 'kanone' : 'mg' }); }
  if (T.faust) { S('schuss', 'faust', 'Faustsalve (zwei Kanonen)', 'panzerkanone', 0.6, { gruppe: 'kanone', mode: 'doppel' }); S('ziel', 'faustziel', 'Faustsalve: Einschläge', 'boom', 0.5, { gruppe: 'einschlag' }); }
  if (T.broadside) S('schuss', 'breit', 'Breitseite (zweiter Schuss)', kanone(t, T), 0.6, { gruppe: 'kanone', hin: 'Zwei Schüsse auf zwei Ziele, je derselbe Ton.' });
  // Nahkampf (melee/counter: strikeSnd)
  { const tank = k === 'walker' && !T.mech, base = sd === 'D' ? 'nahD' : 'nahA';
    const p = T.mech ? 'heavy' : tank ? 'armor' : T.suit ? 'sword' : k === 'cav' ? 'saebel' : fig === 'raider' || fig === 'brawler' ? 'axe' : t === 'oger' ? 'neu3_bestie' : base;   // F80: Sturmtrupps schlagen normal zu
    if (!T.keinNah) S('nah', 'schlag', T.cls === 'walker' && fig === 'drill' ? 'Bohrstoß (ein langer Stoß)' : 'Schlag', p, T.mech || tank ? 0.7 : 0.55, { gruppe: 'nahkampf', hin: 'Bei jedem Schlag, beim Gegenschlag ×0,85.' });
    if (k === 'inf' && !T.suit && !T.cmd) S('nah', 'spaten', 'Spatenhiebe im Grabenkampf', 'schaufel', 0.4, { gruppe: 'handgriff', hin: 'In 60 % der Schläge (F32).' });
    if (['raeumer', 'sturm'].includes(t)) S('nah', 'flinte', 'Kurzer Schuss im Grabenkampf', 'flinte', 0.5, { gruppe: 'gewehr' });
    if (t === 'oger') { S('nah', 'fleisch', 'Treffer ins Fleisch', 'neu3_fleisch', 0.5, { gruppe: 'nahkampf', hin: 'Zusammen mit der Tiger-Attacke (Enricos Wahl 21.11.).' }); S('nah', 'biss', 'Treffer gegen Gepanzerte (Biss auf Panzerung)', 'neu3_biss', 0.5, { gruppe: 'nahkampf', hin: 'Statt des Fleisch-Treffers gegen Fahrzeuge, Schreiter und Kampfanzüge.' }); }
    if (t === 'oger') S('nah', 'schrei', 'Brüllen im Nahkampf', 'oger_bruell', 0.45, { gruppe: 'fahrzeug', hin: 'Beim Angriff immer, beim Gegenschlag jedes zweite Mal.' });
    else if (k === 'storm') S('nah', 'schrei', 'Kampfschrei beim Sturm', 'cry', 0.45, { gruppe: 'ruf' });
    else if (fuss && !T.suit) S('nah', 'schrei', 'Kampfschrei (manchmal)', 'cry', 0.35, { gruppe: 'ruf', hin: 'In 35 % der Schläge, wenn beide Seiten Fußtruppen sind.' });
    if (fig === 'mechB') S('nah', 'tiger', 'Brüllen', 'tiger', 0.4, { gruppe: 'fahrzeug' }); }
  // Getroffen (hit, melee auf Panzerung, gas, rout)
  if (k === 'walker') { if (E.isMech(t)) S('treffer', 'robot', 'Getroffen (Maschinenstimme)', 'robot', 0.5, { gruppe: 'ruf', kette: 'treffer' });
    S('treffer', 'panzer', 'Schlag auf die Panzerung', T.mech ? 'heavy' : 'armor', 0.6, { gruppe: 'einschlag', kette: E.isMech(t) ? null : 'treffer' }); }
  else if (k === 'cav') { S('treffer', 'unruhe', 'Pferd unruhig', 'pferd_unruhe', 0.5, { gruppe: 'pferd', kette: 'treffer', hin: 'In 65 % der Treffer, sonst Wiehern.' }); S('treffer', 'wiehern', 'Wiehern', 'neigh', 0.35, { gruppe: 'pferd' }); }
  else if (T.limber) S('treffer', 'wiehern', 'Getroffen aufgeprotzt: Wiehern', 'neigh', 0.35, { gruppe: 'pferd', kette: 'treffer' });
  if (T.dauerfeuer) S('treffer', 'robot', 'Getroffen (Maschinenstimme)', 'robot', 0.5, { gruppe: 'ruf', v: 'mr', kette: 'treffer' });
  else if (['inf', 'mg', 'storm', 'medic'].includes(k)) {
    S('treffer', 'schmerz', 'Schwer getroffen', 'pain', 0.45, { gruppe: 'ruf', kette: 'treffer' });
    S('treffer', 'sani', 'Schwer getroffen, schwach: „Sanitäter!“', 'medic', 0.45, { gruppe: 'ruf', hin: 'Bei Stärke unter 35 in 60 % der Treffer.' });
    S('treffer', 'grunzen', 'Leicht getroffen: Grunzen', 'grunzen', 0.4, { gruppe: 'ruf', hin: '60 % Grunzen, sonst Maskenlaut.' });
    S('treffer', 'maske', 'Leicht getroffen: Maskenlaut', 'gasmaske_2', 0.4, { gruppe: 'ruf' });
  }
  if (fuss || k === 'cav' || k === 'art') S('treffer', 'husten', 'Im Gas: Husten', 'husten', 0.4, { gruppe: 'ruf', v: 'gm', hin: 'Immer mit Gasmaske leicht, 1–2 Figuren.' });
  S('treffer', 'panik', 'Flieht', 'panic', 0.4, { gruppe: 'ruf' });
  // Tod und Ausfall (destroyed, breakdown, stuck)
  if (k === 'walker' || k === 'art') S('tod', 'tod', 'Zerstört', 'boom2', 0.75, { gruppe: 'einschlag' }); else S('tod', 'tod', 'Aufgerieben', '-', 0.5, { gruppe: 'ruf', hin: 'Im Spiel ohne eigenen Ton (nur Blut). Hier kann einer gewählt werden.' });
  if (k === 'walker') { S('tod', 'brand', 'Wrack brennt', 'feuer', 0.35, { gruppe: 'flamme' }); S('tod', 'panne', 'Panne / festgefahren', 'crash', 0.7, { gruppe: 'fahrzeug' }); S('tod', 'schlamm', 'Ketten im Schlamm', 'steps', 0.6, { gruppe: 'bewegung' }); }
  // Fähigkeiten und Handgriffe
  const A = T.abil;
  if (A === 'sprung') { S('abil', 'sprung', 'Sprungangriff: Brüllen', 'loewe', 0.55, { gruppe: 'ruf' }); S('abil', 'landung', 'Sprungangriff: Landung', 'steps', 0.4, { gruppe: 'bewegung' }); }
  // Prüfliste 2.17 (2026-11-21): neue Abläufe – Enrico wählt die Töne selbst
  if (A === 'rollen') { S('abil', 'rollen_anlauf', 'Sturmrollen: Anlauf (Kettenrollen)', 'tank', 0.5, { gruppe: 'fahrzeug' }); S('abil', 'rollen_aufprall', 'Sturmrollen: Aufprall', 'neu_wucht', 0.7, { gruppe: 'nahkampf' }); S('abil', 'rollen_krach', 'Sturmrollen: Krachen beim Aufprall', 'ueberrollen', 0.45, { gruppe: 'fahrzeug' }); }
  if (k === 'walker') { S('abil', 'rammen', 'Gebäude rammen: Aufprall', 'impact', 0.7, { gruppe: 'einschlag' }); S('abil', 'rammen_wucht', 'Gebäude rammen: Wucht', 'neu_wucht', 0.6, { gruppe: 'nahkampf' }); S('abil', 'einsturz', 'Gebäude stürzt ein', 'einsturz', 0.8, { gruppe: 'einschlag' }); }
  if (A === 'pzgranate') { S('abil', 'pzg_wurf', 'Panzergranate: Explosion', 'boom', 0.6, { gruppe: 'einschlag' }); S('abil', 'pzg_metall', 'Panzergranate: Treffer am Panzer', 'einschlag_panzer', 0.55, { gruppe: 'einschlag' }); }
  if (fig === 'drill') S('abil', 'bohr_wucht', 'Bohrstoß: Wucht', 'neu_wucht', 0.45, { gruppe: 'nahkampf', hin: 'Zusammen mit dem Bohrton (Nahkampf-Zeile), Bohrkopf dreht etwa 0,9 s.' });
  if (T.fessel) { S('abil', 'winde', 'Ballon einholen/aufsteigen: Winde', 'drahtwackeln', 0.45, { gruppe: 'handgriff' }); S('abil', 'ratsche', 'Ballon: Ratsche', 'mgladen', 0.35, { gruppe: 'handgriff' }); }
  if (T.flame || (T.zweit && T.zweit.flamme)) S('abil', 'nachbrennen', 'Flammenstoß: Nachbrennen (nach der Schleife)', 'feuer', 0.3, { gruppe: 'flamme', hin: 'Der Strahl selbst ist die Zeile „Flammenstrahl“; er läuft als Schleife genau so lange wie der Strahl (1,5 s, Bohrkoloss 1,1 s).' });
  if (T.dig) S('abil', 'atmen', 'Eingraben: Graben mit schwerem Atmen', 'atmen', 0.42, { gruppe: 'ruf', hin: 'Nur noch 72199 (F32).' });
  if (T.shieldWall) S('abil', 'schilde', 'Schilde vor', 'armor', 0.5, { gruppe: 'handgriff' });
  if (A === 'rush') S('abil', 'rush', 'Sturmlauf: Ruf', sd === 'D' ? 'roar' : 'forward', 0.7, { gruppe: 'ruf' });
  if (T.mg) { S('abil', 'mgauf', 'MG aufstellen', 'mgsetup', 0.5, { gruppe: 'handgriff' }); S('abil', 'mgladen', 'MG aufstellen: Verschluss', 'mgladen', 0.45, { gruppe: 'handgriff' });
    S('abil', 'mgab', 'MG abbauen', 'nachladen', 0.4, { gruppe: 'handgriff' }); S('abil', 'sperr', 'MG-Sperrfeuer bereit', 'nachladen', 0.4, { gruppe: 'handgriff' }); }
  if (A === 'mark') { S('abil', 'leucht', 'Ziel markieren: Leuchtpistole', 'leuchtschuss', 0.5, { gruppe: 'signal' }); S('abil', 'brand', 'Leuchtkugel brennt', 'leuchtbrand', 0.22, { gruppe: 'handgriff' }); }
  if (A === 'strike') { S('abil', 'strike', 'Feuerschlag: Abschuss', 'cannonH', 0.35, { gruppe: 'kanone' }); S('abil', 'strikeziel', 'Feuerschlag: Einschlag', 'einschlagH', 0.8, { gruppe: 'einschlag' }); }
  if (A === 'smoke') { S('abil', 'werfer', 'Nebelwand: Abschuss', 'werfer', 0.55, { gruppe: 'flamme' }); S('abil', 'nebel', 'Nebelwand: Geschoss', 'gas', 0.5, { gruppe: 'einschlag' }); }
  if (A === 'tunnel') { S('abil', 'stollen', 'Stollen graben', 'bauen', 0.3, { gruppe: 'handgriff' }); S('abil', 'stollenboom', 'Stollen sprengen', 'boom2', 0.8, { gruppe: 'einschlag' }); }
  if (A === 'charge') { S('abil', 'tick', 'Haftladung: Zünder', 'tick', 0.5, { gruppe: 'handgriff' }); S('abil', 'spreng', 'Haftladung: Sprengung', 'blast', 0.8, { gruppe: 'einschlag' }); }
  if (A === 'mine') S('abil', 'mine', 'Mine legen', 'bauen', 0.3, { gruppe: 'handgriff' });
  if (T.wirelayer) S('abil', 'draht', 'Draht ziehen', 'bauen', 0.3, { gruppe: 'handgriff' });
  if (A === 'clear') S('abil', 'entgiften', 'Entgiften', 'gasmaske_1', 0.5, { gruppe: 'handgriff' });
  if (A === 'ammo') S('abil', 'munition', 'Munition verteilen', 'nachladen', 0.55, { gruppe: 'handgriff' });
  if (T.repair || T.recover) S('abil', 'bergen', T.repair ? 'Reparieren / Bergen' : 'Bergen / instand setzen', 'reparieren', 0.6, { gruppe: 'handgriff', hin: T.repair ? 'Werkstatt-Töne statt Sanitäter (F39).' : undefined });
  if (k === 'medic' && !T.repair) S('abil', 'heilen', 'Versorgen', 'heal', 0.5, { gruppe: 'handgriff' });
  if (T.courier) { S('abil', 'hund', 'Befehl überbringen: Hund', 'dog', 0.55, { gruppe: 'bewegung' }); S('abil', 'ruf', 'Befehl überbringen: Ruf', 'comeon', 0.45, { gruppe: 'ruf' }); }
  if (T.cmd) { if (sd === 'D') S('abil', 'befehl', 'Befehl (Sammeln, Sturmbefehl)', 'roar', 0.45, { gruppe: 'ruf' });
    else { S('abil', 'befehl', 'Befehl „Feuer frei“', 'forward', 0.45, { gruppe: 'ruf' }); S('abil', 'sammeln', 'Befehl „Sammeln“', 'stand', 0.45, { gruppe: 'ruf' }); }
    if (T.cmd === 2) S('abil', 'gross', sd === 'D' ? 'Generalangriff' : 'Halten um jeden Preis', sd === 'D' ? 'generalhorn' : 'march', 0.5, { gruppe: 'signal' }); }
  if (T.banner) S('abil', 'banner', 'Banner aufpflanzen', 'bauen', 0.32, { gruppe: 'handgriff', hin: 'Aufnehmen: 0,22.' });
  if (T.cutter) S('abil', 'schneiden', 'Draht schneiden', 'cut', 0.7, { gruppe: 'handgriff' });
  if (T.limber) { S('abil', 'auf', 'Aufprotzen', 'clank', 0.6, { gruppe: 'handgriff' }); S('abil', 'ab', 'Abprotzen', 'abprotzen', 0.6, { gruppe: 'handgriff' }); }
  if (T.roar) S('abil', 'loewe', 'Löwengebrüll', 'loewe', 0.6, { gruppe: 'ruf' });
  if (T.blastLance) S('abil', 'lanze', 'Sprenglanze', 'grenade2', 0.6, { gruppe: 'einschlag' });
  if (T.counterStrike) S('abil', 'gegenstoss', 'Gegenstoß', 'charge', 0.6, { gruppe: 'ruf' });
  // Ankunft
  S('ankunft', 'nachschub', 'Nachschub trifft ein', 'whistle', 0.5, { gruppe: 'signal' });
  return out;
}

const einheiten = [];
for (const sd of ['A', 'D']) for (const t of E.ROSTER[sd]) { const T = TYPES[t];
  einheiten.push({ t, name: T.name, sd, kat: katVon(t), mech: !!E.isMech(t), img: BILDER[t] || '', stimme: SATZ_NAME[stimmSatz(t)], slots: slotsVon(t) }); }
// Wer nutzt welchen Platz (gleiche Seite, gleicher Filter): Hinweis „gilt im Spiel auch für“
const nutzer = {};
for (const u of einheiten) for (const s of u.slots) { const key = s.platz + '|' + (s.platz.startsWith('sv_') ? '' : s.sd) + '|' + (s.v || ''); (nutzer[key] = nutzer[key] || new Set()).add(u.name); }
for (const u of einheiten) for (const s of u.slots) { const n = [...nutzer[s.platz + '|' + (s.platz.startsWith('sv_') ? '' : s.sd) + '|' + (s.v || '')]].filter(x => x !== u.name); s.auch = n; }
const DATA = { stand: new Date().toISOString().slice(0, 10), einheiten, ab: AB, gruppen: GRUPPEN, name: NAME, var: VAR_NAME, satz: SATZ_NAME, pools: POOLS, sndvar: SND_VAR, datei: DATEI, kat: SHOP_KAT };

const css = readFileSync(join(ROOT, 'tools', 'tonpult_seite.css'), 'utf8'), js = readFileSync(join(ROOT, 'tools', 'tonpult_seite.js'), 'utf8');
const html = `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Armargeddon – Ton-Pult</title>
<style>
${css}</style></head>
<body>
<header>
  <h1>Armargeddon · Ton-Pult</h1>
  <span id="status">Töne werden geladen (ca. 22 MB) …</span>
  <div class="hk">
    <label class="regler">Effekte <input id="volEffekte" type="range" min="0" max="100" step="1"><b id="volEffekteW"></b></label>
    <button id="export">Export JSON</button><button id="import">Import</button><button id="allesZurueck">Alles zurücksetzen</button><button id="stopp" class="gold">■ Stopp</button>
  </div>
</header>
<div class="wrap">
  <aside id="liste"><div class="tabs" id="seiten"></div><div class="kat" id="kats"></div><div id="einheiten"></div></aside>
  <main id="pult"></main>
</div>
<dialog id="dlg"><form method="dialog"><h2 id="dlgTitel"></h2><p id="dlgText" class="hin"></p><textarea id="dlgFeld" spellcheck="false"></textarea>
  <div class="dlgk" id="dlgKnoepfe"></div></form></dialog>
<script>
const D = ${JSON.stringify(DATA)};
${js}</script>
</body></html>
`;
writeFileSync(join(ROOT, 'tonpult.html'), html);
const nPl = einheiten.reduce((s, u) => s + u.slots.length, 0);
console.log('tonpult.html', Math.round(html.length / 1024), 'KB,', einheiten.length, 'Einheiten,', nPl, 'Tonplätze, Bilder', Object.keys(BILDER).length);
