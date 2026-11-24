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
const ctx = {}; vm.createContext(ctx); vm.runInContext(src, ctx); if (existsSync(join(ROOT, 'src', 'sound_pult.js'))) vm.runInContext(readFileSync(join(ROOT, 'src', 'sound_pult.js'), 'utf8'), ctx);   // M9: ausgelagerte Pult-Töne
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
const SHOP_KAT = ['Kommando', 'Standard', 'Spezial', 'Artillerie', 'Fahrzeuge und Kampfmaschinen', 'Stimmen'];
const SHOP_STANDARD = ['kohorte', 'grenadier', 'mahlwerk', 'sense', 'reiter', 'lanzeD', 'feldscher', 'heiler', 'melder'];
const katVon = t => { const T = TYPES[t]; return T.cmd ? 'Kommando' : T.cls === 'walker' || E.isMech(t) ? 'Fahrzeuge und Kampfmaschinen' : T.cls === 'art' ? 'Artillerie' : SHOP_STANDARD.includes(t) ? 'Standard' : 'Spezial'; };
const fireKind = T => T.mg ? 'mg' : T.flame ? 'flame' : T.gat ? 'minigun' : T.mgfire ? 'mg' : T.cls === 'walker' ? 'cannon' : 'rifle';

// Gruppen für die Auswahlliste (passende Alternativen); Stimm-Gruppen nehmen den Filter des Sprechers mit
const GRUPPEN = {
  winter: ['schnee_einzeln', 'schnee_gruppe', 'schnee_rennen', 'stampfen_schnee', 'panzerketten_schnee', 'pferde_schnee', 'eis_knackt', 'eis_bricht', 'winterwind', 'winterwind_stark', 'kraehe', 'wind'],   // Wintertöne (Enrico 2026-11-22 17:05)
  stimmen: ['hst_faust_auswahl', 'hst_faust_bewegen', 'hst_faust_angriff', 'hst_faust_durchbruch', 'hst_faust_getroffen', 'hst_faust_gegner_erledigt', 'hst_faust_schwer_verwundet', 'hst_faust_tod', 'hst_kuerass_auswahl', 'hst_kuerass_bewegen', 'hst_kuerass_angriff', 'hst_kuerass_hinrichtung', 'hst_kuerass_getroffen', 'hst_kuerass_gegner_erledigt', 'hst_kuerass_schwer_verwundet', 'hst_kuerass_tod', 'ruf_feuer', 'panik_einzeln', 'panik_gruppe', 'sterben_einzeln', 'sterben_gruppe', 'sst_auswahl', 'sst_bewegen', 'sst_angriff', 'sst_nahkampf', 'sst_getroffen', 'sst_schwer_beschaedigt', 'sst_feind_gesichtet', 'sst_zerstoert', 'stimmen_paket', 'medic'],   // Stimmenpaket (Enrico 2026-11-22): Kandidaten für die Rufe je Ereignis
  schritte_schwer: ['schreiter_schritte', 'kampfanzug_schritte', 'mech', 'held_schritt_ritter2', 'neu_schritte_schwer'],
  draht: ['draht_schneiden', 'draht_ueberrollen', 'draht_infanterie', 'cut', 'ueberrollen', 'drahtlatch', 'drahtwackeln'],
  saege: ['stahlklaue_fleisch', 'stahlklaue_eisen', 'krallen_fleisch', 'krallen_eisen', 'neu3_fleisch', 'neu3_biss', 'saege_einschlag', 'saege_fleisch', 'saege_metall', 'held_kschwert_metall', 'held_kschwert_fleisch', 'heavy'],
  waffen_neu: ['neu4_pistole_schwer', 'neu4_granatwerfer', 'neu4_gewehr_schwer', 'neu4_mg_schwer'],
  gewehr: ['rifle', 'rifle2', 'rifle3', 'rifle4', 'sniper', 'neu4_pistole_schwer', 'neu4_gewehr_schwer', 'neu4_granatwerfer', 'pistol', 'semi', 'buechse', 'flinte', 'neu_schrot', 'grenade2', 'neu2_gewehr', 'neu2_pistole'],
  mg: ['mg', 'minigun', 'neu_mg_schwer', 'rifle4', 'neu2_gewehr', 'neu2_autokanone'],
  kanone: ['cannon', 'neu_kanone', 'kolosskanone', 'loewenkanone', 'panzerkanone', 'cannonH', 'artD', 'launch', 'werfer', 'neu2_kanone', 'neu2_knall', 'neu2_autokanone'],
  flamme: ['flame', 'werfer', 'feuer', 'neu2_feuer'],
  einschlag: ['neu3_fzaufprall', 'einschlag', 'vorbei', 'boom', 'boomH', 'einschlagH', 'barrage', 'gas', 'rauch', 'boom2', 'blast', 'grenade2', 'wasser', 'impact', 'armor', 'feuer', 'neu2_einschlag', 'neu2_metall', 'neu2_knall', 'neu2_einsturz', 'neu2_blut', 'neu2_wasser', 'neu2_crash', 'neu3_aufprall', 'neu3_gore', 'einschlag_panzer', 'einschlag_abpraller'],
  nahkampf: ['loewen_landung', 'nahA', 'nahD', 'saebel', 'sword', 'axe', 'slash', 'smash', 'heavy', 'neu_wucht', 'armor', 'grenade2', 'flinte', 'punch', 'neu2_nahkampf', 'neu2_metall', 'neu2_blut', 'neu2_monster', 'neu3_bestie', 'neu3_loewe', 'neu3_loewe2', 'neu3_fleisch', 'neu3_biss', 'neu3_gore'],
  gespann: ['gespann', 'gallop', 'wagenknarren', 'pferd_unruhe', 'pferde_schnee'],   // Feldkanone ziehen (2026-11-22)
  bewegung: ['schritte', 'steps', 'stepsWald', 'marschtritt', 'holzknacken', 'gallop2', 'dog', 'gespann', 'wagenknarren', 'tank', 'mech', 'neu_schritte_schwer', 'ueberrollen', 'drahtlatch', 'drahtwackeln', 'neu2_schritte', 'neu2_hund', 'neu2_flug', 'neu2_wasser'],
  fahrzeug: ['motor_auswahl', 'tank', 'mech', 'ueberrollen', 'crash', 'tiger', 'oger_bruell', 'neu_tiger_mech', 'neu_roboter', 'robot', 'neu2_crash', 'neu2_flug', 'neu2_monster', 'neu3_bestie', 'neu3_aufprall', 'neu3_fzaufprall', 'ballon_brenner'],
  pferd: ['pferd_auswahl', 'pferd_unruhe', 'neigh', 'gallop2'],
  handgriff: ['mg_aufbauen', 'mg_abbauen', 'geschuetz_aufprotzen', 'geschuetz_abprotzen', 'sandsaecke', 'cut', 'clank', 'abprotzen', 'mgsetup', 'mgladen', 'nachladen', 'neu_nachladen', 'neu_versorgung', 'schaufel', 'bauen', 'heal', 'reparieren', 'gasmaske_1', 'tick', 'ui', 'leuchtschuss', 'leuchtbrand', 'crash', 'steps', 'drahtlatch', 'drahtwackeln', 'ballon_brenner', 'neu2_knopf', 'neu2_tuer', 'neu2_crash'],
  signal: ['whistle', 'dampfpfeife', 'march', 'generalhorn', 'horn', 'leuchtschuss', 'zug_eigen', 'zug_gegner', 'neu2_horn', 'neu2_punkt', 'neu2_musik'],
  held: ['held_faustschlag2', 'held_fausteinschlag', 'held_schritt_ritter2', 'held_saege_start2', 'held_saege_schnitt2', 'held_kschwert_metall', 'held_kschwert_fleisch', 'held_aufladen', 'held_faustschlag', 'held_faustboom', 'held_dampfstoss', 'held_dampf', 'held_kolben', 'held_schritt_ritter', 'held_saege_start', 'held_saege_schnitt', 'held_ruestung', 'held_ritter_schrei', 'held_fall_horn', 'neu3_fzaufprall', 'heavy', 'sword', 'neu_wucht', 'horn'],
  ruf: ['neu3_loewe', 'neu3_loewe2', 'pain', 'medic', 'cry', 'scream', 'panic', 'forward', 'stand', 'roar', 'charge', 'comeon', 'husten', 'grunzen', 'gasmaske_2', 'atmen', 'robot', 'loewe', 'oger_bruell', 'neu_roboter', 'neu_tiger_mech', 'neu2_stimme', 'neu2_schrei', 'neu2_maske', 'neu2_monster', 'neu3_bestie'],
  spruch: [] };
const SND_VAR = { cry: ['cry', 'scream'], grenade: ['grenade2'], axe: ['axe', 'slash'], punch: ['punch1', 'punch2', 'punch3', 'swords'], artD: ['cannonH', 'cannon'], boom: ['boomH_1'] };
const gibt = p => POOLS[p] || KEYS.includes(p) || SND_VAR[p];
for (const g in GRUPPEN) GRUPPEN[g] = GRUPPEN[g].filter(gibt);
const NAME = { held_faustschlag2: 'Rote Faust: Servo lädt + Schlag (ElevenLabs)', held_fausteinschlag: 'Rote Faust: nur Einschlag (ElevenLabs)', held_schritt_ritter2: 'Kürassier: Ritter-Schritt (ElevenLabs)', held_saege_start2: 'Kürassier: Kettenschwert springt an (ElevenLabs)', held_saege_schnitt2: 'Kürassier: Schwung mit Schnitt (ElevenLabs)', held_kschwert_metall: 'Kettenschwert trifft Panzerung (ElevenLabs)', held_kschwert_fleisch: 'Kettenschwert trifft Fußtruppen (ElevenLabs)', held_aufladen: 'Rote Faust: Aufladen (Vortex)', held_faustschlag: 'Rote Faust: Hydraulik lädt + Boom', held_faustboom: 'Rote Faust: Boom', held_dampfstoss: 'Rote Faust: Dampfstoß', held_dampf: 'Rote Faust: Dampfzischen', held_kolben: 'Rote Faust: Kolben/Presse', held_schritt_ritter: 'Kürassier: Schritt', held_saege_start: 'Kürassier: Kettensäge springt an', held_saege_schnitt: 'Kürassier: Kettensäge schneidet', held_ruestung: 'Held getroffen: Rüstung', held_ritter_schrei: 'Kürassier: Ächzen', held_fall_horn: 'Held fällt: Horn', einschlag_panzer: 'Treffer Panzer – Waffe wirkt', einschlag_abpraller: 'Treffer Panzer – Abpraller', neu2_autokanone: 'Autokanone (neu 21.11.)', neu2_gewehr: 'Gewehr (Quelle, neu 21.11.)', neu2_pistole: 'Pistole Walther (neu 21.11.)', neu2_kanone: 'Schwere Bordkanone (neu 21.11.)', neu2_einschlag: 'Einschlag/Kugeltreffer (neu 21.11.)', neu2_metall: 'Metalltreffer (neu 21.11.)', neu2_knall: 'Knallkörper (neu 21.11.)', neu2_einsturz: 'Turm stürzt ein (neu 21.11.)', neu2_nahkampf: 'Faust/Axt/Schild (neu 21.11.)', neu2_blut: 'Blutspritzer (neu 21.11.)', neu2_schrei: 'Brüllen (neu 21.11.)', neu2_stimme: 'Stimmen englisch/Gefechtsrufe (neu 21.11.)', neu2_maske: 'Schmerz in Gasmaske (neu 21.11.)', neu2_monster: 'Monster (später Dämonen, neu 21.11.)', neu2_horn: 'Kriegshorn (neu 21.11.)', neu2_musik: 'Heldenmarsch, Schleife (neu 21.11.)', neu2_punkt: 'Punkt gewonnen (neu 21.11.)', neu2_knopf: 'Knopfklick (neu 21.11.)', neu2_tuer: 'Tür/Riegel (neu 21.11.)', neu2_crash: 'Aufprall/Maschine (neu 21.11.)', neu2_flug: 'Flugzeug (neu 21.11.)', neu2_schritte: 'Maschinen-/Schneeschritte (neu 21.11.)', neu2_hund: 'Hund bellt (neu 21.11.)', neu2_feuer: 'Großes Feuer (neu 21.11.)', neu2_wasser: 'Wasser/Schwimmen (neu 21.11.)',
  neu3_bestie: 'Bestien-Nahkampf: Tiger-Attacke (neu 21.11.)', neu3_loewe: 'Löwe getroffen 1 (neu 21.11.)', neu3_loewe2: 'Löwe getroffen 2 (neu 21.11.)', neu3_fzaufprall: 'Fahrzeug-Aufprall ohne Klinge (neu 21.11.)', neu3_fleisch: 'Gore-Treffer: Stich ins Fleisch (neu 21.11.)', neu3_biss: 'Bestien-Nahkampf: Biss auf Panzerung (neu 21.11.)', neu3_gore: 'Gore-Treffer: Blut/Spaten (neu 21.11.)', neu3_aufprall: 'Aufprall/Einsturz schwer (neu 21.11.)', ballon_brenner: 'Ballon-Brenner, Fauchen (neu 21.11.)',
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
  ui: 'Knopf', leuchtschuss: 'Leuchtpistole', leuchtbrand: 'Leuchtkugel brennt', whistle: 'Pfeife', dampfpfeife: 'Dampfpfeife (Lok)', march: 'Marsch/Verstärkung', generalhorn: 'Generalhorn', horn: 'Signalhorn', zug_eigen: 'Trommelwirbel', zug_gegner: 'Wirbel + Horn',
  pain: 'Schmerz', medic: '„Sanitäter!“', cry: 'Kampfschrei', scream: 'Schrei', panic: 'Panik', forward: '„Vorwärts“', stand: '„Haltet stand“', roar: 'Ruf Aschenwacht', charge: 'Gegenstoß', comeon: 'Befehl überbringen',
  husten: 'Husten', grunzen: 'Grunzen', gasmaske_2: 'Maskenlaut', atmen: 'Schweres Atmen', loewe: 'Löwengebrüll' };

// ---- Tonplätze je Einheit (nach src/ui.js) ----
const AB = [['stimme', 'Rufe (Stimmen)'], ['anw', 'Anwählen'], ['zug', 'Bewegung'], ['schuss', 'Schuss'], ['ziel', 'Einschlag beim Ziel'], ['nah', 'Nahkampf'], ['treffer', 'Getroffen'], ['tod', 'Tod und Ausfall'], ['abil', 'Fähigkeiten und Handgriffe'], ['ankunft', 'Ankunft']];
function slotsVon(t) {
  const T = TYPES[t], sd = T.side, k = T.cls, fig = T.fig, v = stimmVar(t), out = [];
  const S = (ab, id, titel, platz, vol, o = {}) => out.push({ ab, id, titel, platz, vol: +vol.toFixed(3), v: STIMM_PL.has(platz) ? (o.v === undefined ? v : o.v) : null, gruppe: o.gruppe, mode: o.mode || 'eins', rate: o.rate || null, dur: o.dur || 0, hin: o.hin || '', kette: o.kette || null, sd: o.sd || sd, spiel: o.spiel || null });   // spiel: eigener Tonplatz im Spiel (Wahl getrennt), gespielt wird im Pult weiter „platz“ (Enrico 21:00)
  const fuss = ['inf', 'mg', 'storm', 'medic', 'flame'].includes(k), stimme = vol => vol * STIMM_VOL;
  // Anwählen (selectVoice)
  if (t === 'oger') S('anw', 'spruch', 'Brüllen beim Anklicken', 'oger_bruell', 0.4, { gruppe: 'fahrzeug', kette: 'anw', hin: 'Löwenoger: Brüllen statt Spruch.' }); else
  S('anw', 'spruch', 'Spruch beim Anklicken', `sv_${stimmSatz(t)}_${sd}`, SPRUCH, { gruppe: 'spruch', mode: 'stimme', rate: 1, hin: `Feste Stimme je Einheit, reihum vergeben; Beutel ohne Wiederholung. Sprecher: ${SATZ_NAME[stimmSatz(t)]}.`, kette: 'anw' });
  if (PANZER.includes(t)) S('anw', 'motor', 'Motor beim Anklicken', 'motor_auswahl', 0.13, { gruppe: 'fahrzeug', mode: 'motor', hin: 'Kurz aufheulen (0,7 s, Tonhöhe 0,8 → 1,2), unter der Stimme auf 40 % abgesenkt.', kette: 'anw' });
  if (k === 'cav') S('anw', 'pferd', 'Pferd beim Anklicken', 'pferd_auswahl', 0.26, { gruppe: 'pferd', kette: 'anw' });
  // Bewegung (move)
  if (k === 'cav') S('zug', 'ziehen', 'Ziehen (Galopp)', 'gallop2', 0.55, { gruppe: 'bewegung', kette: 'zug' });
  else if (T.limber) { S('zug', 'ziehen', 'Ziehen aufgeprotzt: Gespann', 'gespann', 0.5, { gruppe: 'bewegung', kette: 'zug' }); }
  else if (T.fahrbar) { S('zug', 'ziehen', 'Ziehen (ohne Protzen): Räder und Pferde', 'wagenknarren', 0.8, { gruppe: 'gespann', kette: 'zug', spiel: 'feldkanone_zug', hin: 'Feldkanone (Enrico 2026-11-22 18:45): Standard Wagenknarren (Tiefpass 1,2 kHz gegen Quietscher); Kandidaten Gespann und Galopp-Gespann. Im Winter Pferde im Schnee darunter.' }); }   // F8: unter dem Gespann entfernt (pfiff wie ein Zug); hier allein und gedämpft
  else if (k === 'walker') { S('zug', 'ziehen', fig ? (['saeger', 'klaue', 'turm', 'orden', 'kreuz', 'knecht'].includes(t) ? 'Ziehen (Schreiter-Schritte im Takt)' : 'Ziehen (Maschinenschritte)') : 'Ziehen (Kettenrollen)', fig ? (['saeger', 'klaue', 'turm', 'orden', 'kreuz', 'knecht'].includes(t) ? 'schreiter_schritte' : 'mech') : 'tank', fig ? (['saeger', 'klaue', 'turm', 'orden', 'kreuz', 'knecht'].includes(t) ? 0.45 : 0.5) : 0.3, { gruppe: 'bewegung', kette: 'zug', hin: 'Unter einer Stimme auf 40 % abgesenkt.' });
    S('zug', 'walzen', 'Draht niederwalzen', 'draht_ueberrollen', 0.6, { gruppe: 'draht' });
    if (T.abil !== 'rollen') S('zug', 'barrikade', 'Über eine Barrikade', 'ueberrollen', 0.5, { gruppe: 'fahrzeug' }); }   // Ton-Spur 2026-11-23 (bei Landkoloss und Sturmpanzer derselbe Platz wie „Sturmrollen: Krachen“)
  else if (t === 'kuerass') S('zug', 'ziehen', 'Ziehen: schwere Ritter-Schritte (im Takt)', 'held_schritt_ritter2', 0.55, { gruppe: 'held', kette: 'zug', hin: 'Je Schritt ein Stampfen (M8, wie im Spiel).' });   // M8 (2026-11-22)
  else if (t === 'faust') { S('zug', 'ziehen', 'Ziehen (Schritte)', 'schritte', 0.4, { gruppe: 'bewegung', kette: 'zug' }); S('zug', 'dampf', 'Ziehen: leiser Dampfstoß (jedes zweite Mal)', 'held_dampfstoss', 0.22, { gruppe: 'held' }); }   // M8
  else if (T.mech || T.dauerfeuer) S('zug', 'ziehen', 'Ziehen (Kampfanzug-Schritte)', 'kampfanzug_schritte', 0.45, { gruppe: 'schritte_schwer', kette: 'zug' });
  else {
    if (fig === 'dog') S('zug', 'hund', 'Hund beim Ziehen', 'dog', 0.5, { gruppe: 'bewegung', kette: 'zug' });
    S('zug', 'ziehen', 'Ziehen (Schritte)', 'schritte', 0.5, { gruppe: 'bewegung', kette: 'zug' });
    if (k !== 'art') S('zug', 'marsch', 'Marsch und Sturmlauf', 'schritte', 0.6, { gruppe: 'bewegung', spiel: 'marsch_schritte', hin: 'Nur Schritte, keine Trommel mehr (F49). Eigener Tonplatz, getrennt von „Ziehen“ (Enrico 21:00).' });
    S('zug', 'schlamm', 'Ziehen durch Schlamm', 'steps', 0.5, { gruppe: 'bewegung' });
    if (k !== 'art') S('zug', 'wald', 'Ziehen durch Wald', 'stepsWald', 0.5, { gruppe: 'bewegung' });
    if (k !== 'art') S('zug', 'holz', 'Äste knacken (Wald, 2×)', 'holzknacken', 0.45, { gruppe: 'bewegung' });
    if (fuss && !T.wireProof && !T.suit) S('zug', 'draht1', 'Im Stacheldraht (Stärkeverlust)', 'draht_infanterie', 0.55, { gruppe: 'draht', hin: 'Zufällig aus drei Fassungen, nie zweimal dieselbe hintereinander.' });
  }
  // Schuss und Einschlag (fire, shell)
  const gepZiele = Object.keys(TYPES).filter(z => TYPES[z].side !== sd && (TYPES[z].cls === 'walker' || TYPES[z].suit) && (k === 'art' || !E.immune(T, TYPES[z])));   // gepanzerte Ziele, auf die diese Einheit schießen darf
  const wirkt = gepZiele.some(z => E.faktor(t, z, true).f >= 1), prallt = gepZiele.some(z => E.faktor(t, z, true).f < 1);   // wie ui.js einschlagArt
  const PZ = () => { if (wirkt) S('ziel', k === 'walker' ? 'zielpanzer' : 'panzer', 'Treffer auf Panzerung (Waffe wirkt)', 'einschlag_panzer', 0.5, { gruppe: 'einschlag', hin: 'Ziel ist ein Fahrzeug, Schreiter oder Kampfanzug, und die Waffe wirkt dagegen (F64).' });
    if (prallt) S('ziel', 'abpraller', 'Treffer auf Panzerung (Abpraller)', 'einschlag_abpraller', 0.3, { gruppe: 'einschlag', hin: 'Ziel ist ein Fahrzeug, Schreiter oder Kampfanzug; die Waffe prallt ab (F64).' }); };
  const SPLITTER = () => S('ziel', 'splitter', 'Splitter treffen Fußtruppen (dumpf)', 'einschlag', 0.3, { gruppe: 'einschlag', rate: 0.76, dur: 320, hin: 'Zusätzlich zum Granateinschlag, wenn weiche Ziele Schaden nehmen; tief gestimmt und kurz.' });
  const kanone = (x, Tx) => x === 'kreuz' ? 'loewenkanone' : ['koloss', 'turm'].includes(x) ? 'kolosskanone' : Tx.side === 'D' && Tx.cls === 'walker' ? 'panzerkanone' : 'cannon';
  if (k === 'art') {
    const mob = T.mobile, ab = mob ? 'launch' : t === 'feldkanone' ? 'cannon' : sd === 'D' ? 'artD' : 'cannonH';
    S('schuss', 'schuss', mob ? 'Abschuss (Steilfeuer)' : 'Abschuss', ab, mob ? 0.42 : 0.8, { gruppe: 'kanone', kette: 'schuss', hin: `Sperrfeuer: ${mob ? 3 : 4} Abschüsse desselben Tons mit ${mob ? '0,42' : '0,75'}.` });
    S('ziel', 'ziel', 'Einschlag Einzelschuss', mob ? 'boom' : 'einschlagH', mob ? 0.7 : 0.8, { gruppe: 'einschlag', kette: 'ziel', hin: 'Nach der Flugzeit (ca. 0,57 s).' });
    if (!T.direkt) S('ziel', 'sperr', 'Einschläge Sperrfeuer', mob ? 'boom' : 'boomH', 0.5, { gruppe: 'einschlag', spiel: mob ? 'sperr_boom' : 'sperr_boomH', hin: 'Je Feld ein Einschlag, versetzt. Eigener Tonplatz, getrennt vom Einzelschuss (Enrico 21:00).' });
    if (T.gas) S('ziel', 'gas', 'Gasgranate', 'gas', 0.7, { gruppe: 'einschlag' });
    S('ziel', 'wasser', 'Einschlag im Wasser (zusätzlich)', 'wasser', 0.6, { gruppe: 'einschlag' });
    SPLITTER(); PZ();
  } else if (T.rng > 0) {   // Ton-Spur 2026-11-23: Einheiten ohne Fernkampf haben keine Schuss- und Treffer-Zeilen
    const fk = fireKind(T);
    if (fk === 'flame') { S('schuss', 'schuss', 'Flammenstrahl', 'flame', 0.6, { gruppe: 'flamme', kette: 'schuss' }); S('ziel', 'feuer', 'Feld fängt Feuer', 'flame', 0.4, { gruppe: 'flamme', kette: 'ziel' }); }
    else if (fk === 'rifle') {
      const rs = t === 'oger' ? 'flinte' : T.lob ? 'grenade' : T.pin || T.hidden ? 'sniper' : T.cmd ? 'neu4_pistole_schwer' : T.suit ? 'semi' : 'rifle', p = t === 'buechse' ? 'neu4_gewehr_schwer' : rs;   // Standard 2026-11-22: schwere Pistole (Offiziere), schweres Gewehr (Panzerbüchse)
      if (p === 'rifle') S('schuss', 'schuss', 'Gewehrsalve (je Figur ein Schuss)', 'rifle', 0.3, { gruppe: 'gewehr', mode: 'salve', kette: 'schuss', hin: 'Bis 4 Schüsse aus derselben Datei, unregelmäßig versetzt, nur der letzte klingt voll aus.' });
      else S('schuss', 'schuss', 'Schuss', p, 0.6, { gruppe: 'gewehr', kette: 'schuss' });
      S('ziel', 'ziel', 'Treffer am Ziel', 'einschlag', 0.35, { gruppe: 'einschlag', kette: 'ziel' });
      S('ziel', 'vorbei', 'Streifschuss / daneben', 'vorbei', 0.35, { gruppe: 'einschlag' });
      PZ();
    } else if (fk === 'mg' || fk === 'minigun') {
      if (T.dauerfeuer) { S('schuss', 'schuss', 'Schweres MG aus der Hüfte', 'mg', 0.62, { gruppe: 'mg', kette: 'schuss', rate: 0.83, hin: 'Tiefer gestimmt (0,80–0,86). Dauerfeuer: dieselbe Salve ein zweites Mal.' }); }
      else if (t === 'orden' || t === 'klaue') S('schuss', 'schuss', 'MG am Arm (schweres MG)', 'neu4_mg_schwer', 0.55, { gruppe: 'mg', kette: 'schuss', hin: 'Standard 2026-11-22 (Enrico 15:26), vorher Drehlauf.' });
      else S('schuss', 'schuss', fk === 'mg' ? 'MG-Feuer' : 'Drehlauf', fk, 0.55, { gruppe: 'mg', kette: 'schuss' });
      S('ziel', 'ziel', 'Einschlag in den Körper (dumpf)', 'einschlag', 0.22, { gruppe: 'einschlag', rate: 0.82, dur: 260, kette: 'ziel', hin: 'Tiefer gestimmt (0,78–0,86) und nach 0,26 s ausgeblendet.' });
      PZ();   // „Daneben“ gibt es beim MG nicht: jeder Treffer klingt als dumpfer Einschlag (Ton-Spur 2026-11-23)
    } else if (fk === 'cannon') {
      S('schuss', 'schuss', 'Kanone', kanone(t, T), 0.6, { gruppe: 'kanone', kette: 'schuss' });
      S('ziel', 'ziel', 'Granateinschlag', 'boom', 0.45, { gruppe: 'einschlag', kette: 'ziel' });
      SPLITTER(); PZ();
    }
  }
  if (T.zweit) { const Z = T.zweit; if (Z.flamme) S('schuss', 'zweit', 'Zweitwaffe: ' + Z.name, 'flame', 0.6, { gruppe: 'flamme' });
    else S('schuss', 'zweit', 'Zweitwaffe: ' + Z.name, Z.kanone ? kanone(t, T) : t === 'turm' ? 'neu4_mg_schwer' : 'mg', Z.kanone ? 0.6 : 0.55, { gruppe: Z.kanone ? 'kanone' : 'mg' }); }   // Turm-MG: schweres MG (Enrico 15:26)
  if (T.faust) { S('schuss', 'faust', 'Faustsalve (zwei Kanonen)', 'panzerkanone', 0.6, { gruppe: 'kanone', mode: 'doppel' }); S('ziel', 'faustziel', 'Faustsalve: Einschläge', 'boom', 0.5, { gruppe: 'einschlag' }); }
  if (T.broadside) S('schuss', 'breit', 'Breitseite (zweiter Schuss)', kanone(t, T), 0.6, { gruppe: 'kanone', hin: 'Zwei Schüsse auf zwei Ziele, je derselbe Ton.' });
  // Nahkampf (melee/counter: strikeSnd)
  { const tank = k === 'walker' && !T.mech, base = sd === 'D' ? 'nahD' : 'nahA';
    const p = t === 'oger' ? 'neu3_bestie' : t === 'faust' ? 'held_faustschlag2' : t === 'kuerass' ? 'held_saege_schnitt2' : T.mech ? 'heavy' : tank ? 'armor' : T.suit ? 'sword' : k === 'cav' ? 'saebel' : fig === 'raider' || fig === 'brawler' ? 'axe' : base;   // M8 (2026-11-22): Löwenoger und Helden wie im Spiel (vorher axe bzw. sword)
    if (t === 'faust') S('nah', 'ausholen', 'Ausholen: Aufladen', 'held_aufladen', 0.5, { gruppe: 'held' });
    if (t === 'kuerass') { S('nah', 'treffer_kschwert', 'Treffer: Kettenschwert (Fußtruppen; gegen Gepanzerte Platz held_kschwert_metall)', 'held_kschwert_fleisch', 0.5, { gruppe: 'held' }); S('nah', 'treffer_kschwert_metall', 'Treffer: Kettenschwert gegen Gepanzerte', 'held_kschwert_metall', 0.5, { gruppe: 'held' }); S('nah', 'ausholen', 'Ausholen: Kettenschwert springt an', 'held_saege_start2', 0.55, { gruppe: 'held' }); S('nah', 'ausholen_schrei', 'Ausholen: Kampfschrei hinter dem Helm (nur beim Angriff)', 'held_ritter_schrei', 0.45, { gruppe: 'held' }); }   // F80: Sturmtrupps schlagen normal zu
    const kaempft = !T.keinNah && T.atk > 0, hieb = t === 'oger' ? 'neu3_fleisch' : k === 'walker' ? (T.mech ? 'heavy' : 'armor') : T.suit ? 'sword' : k === 'cav' ? 'saebel' : base;   // ui.js hiebTon
    if (kaempft) S('nah', 'schlag', T.cls === 'walker' && fig === 'drill' ? 'Bohrstoß (ein langer Stoß)' : t === 'faust' ? 'Schlag: Hydraulik-Boom' : t === 'kuerass' ? 'Schlag: Säge heult auf und schneidet' : 'Schlag', p, T.mech || tank ? 0.7 : T.held ? 0.65 : t === 'oger' ? 0.5 : 0.55, { gruppe: 'nahkampf', hin: 'Bei jedem Schlag, beim Gegenschlag ×0,85.' });
    if (kaempft && fig === 'drill') S('nah', 'bohrton', 'Bohrstoß: Bohrer', 'smash', 0.65, { gruppe: 'nahkampf' });
    if (!kaempft || (fig !== 'drill' && hieb !== p)) S('nah', kaempft ? 'abtausch' : 'schlag', kaempft ? 'Schlagabtausch: schnelle Hiebe' : 'Im Nahkampf angegriffen: Abwehrhieb', hieb, 0.4, { gruppe: 'nahkampf', hin: kaempft ? 'Hieb und Gegenhieb im Wechsel vor dem letzten, harten Schlag.' : 'Die Einheit kämpft nicht selbst, wehrt sich im Bild aber mit einem Hieb.' });   // Ton-Spur 2026-11-23
    if (k === 'inf' && !T.suit && !T.cmd) S('nah', 'spaten', 'Spatenhiebe im Grabenkampf', 'schaufel', 0.4, { gruppe: 'handgriff', hin: 'In 60 % der Schläge (F32).' });
    if (['raeumer', 'sturm'].includes(t)) S('nah', 'flinte', 'Kurzer Schuss im Grabenkampf', 'flinte', 0.5, { gruppe: 'gewehr' });
    if (t === 'klaue') { S('nah', 'klaue_fl', 'Stahlklaue gegen Fußtruppen', 'stahlklaue_fleisch', 0.6, { gruppe: 'saege' }); S('nah', 'klaue_ei', 'Stahlklaue gegen Gepanzerte', 'stahlklaue_eisen', 0.6, { gruppe: 'saege' }); }
    if (t === 'oger') { S('nah', 'fleisch', 'Krallen gegen Fußtruppen', 'krallen_fleisch', 0.55, { gruppe: 'nahkampf', hin: 'Zusammen mit der Tiger-Attacke (Enricos Wahl 21.11.).' }); S('nah', 'biss', 'Krallen gegen Gepanzerte', 'krallen_eisen', 0.55, { gruppe: 'nahkampf', hin: 'Statt des Fleisch-Treffers gegen Fahrzeuge, Schreiter und Kampfanzüge.' }); }
    if (t === 'faust') S('nah', 'nachdampf', 'Nach dem Schlag: Dampfstoß', 'held_dampfstoss', 0.35, { gruppe: 'held' });
    if (t === 'oger') S('nah', 'schrei', 'Brüllen im Nahkampf', 'oger_bruell', 0.45, { gruppe: 'fahrzeug', hin: 'Beim Angriff immer, beim Gegenschlag jedes zweite Mal.' });
    else if (k === 'storm') S('nah', 'schrei', 'Kampfschrei beim Sturm', 'cry', 0.45, { gruppe: 'ruf' });
    else if (kaempft && fuss && !T.suit) S('nah', 'schrei', 'Kampfschrei (manchmal)', 'cry', 0.35, { gruppe: 'ruf', hin: 'In 35 % der Schläge, wenn beide Seiten Fußtruppen sind.' });
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
    if (t === 'oger') S('treffer', 'loewe', 'Leicht bis mittel getroffen: Löwe', 'neu3_loewe', 0.45, { gruppe: 'ruf', hin: 'Treffer unter 20 Stärke (Enricos Wahl 21.11.); schwere Treffer: Zeile „Schwer getroffen“.' }); else {   // Paket G 2026-11-21
    S('treffer', 'grunzen', 'Leicht getroffen: Grunzen', 'grunzen', 0.4, { gruppe: 'ruf', hin: '60 % Grunzen, sonst Maskenlaut.' });
    S('treffer', 'maske', 'Leicht getroffen: Maskenlaut', 'gasmaske_2', 0.4, { gruppe: 'ruf' }); }
  }
  if ((fuss || k === 'cav' || k === 'art') && !T.gasproof) S('treffer', 'husten', 'Im Gas: Husten', 'husten', 0.4, { gruppe: 'ruf', v: 'gm', hin: 'Immer mit Gasmaske leicht, 1–2 Figuren.' });
  S('treffer', 'panik', 'Flieht', 'panic', 0.4, { gruppe: 'ruf' });
  // Tod und Ausfall (destroyed, breakdown, stuck)
  if (k === 'walker' || k === 'art') S('tod', 'tod', 'Zerstört', 'boom2', 0.75, { gruppe: 'einschlag' }); else S('tod', 'tod', 'Aufgerieben', '-', 0.5, { gruppe: 'ruf', spiel: 'aufgerieben', hin: 'Im Spiel ohne eigenen Ton (nur Blut), bis hier einer gewählt wird (Spiel-Platz „aufgerieben“, seit 21:00).' });
  if (k === 'walker') { S('tod', 'brand', 'Wrack brennt', 'feuer', 0.35, { gruppe: 'flamme' }); S('tod', 'panne', 'Panne / festgefahren', 'crash', 0.7, { gruppe: 'fahrzeug' }); S('tod', 'schlamm', 'Ketten im Schlamm', 'steps', 0.6, { gruppe: 'bewegung' }); }
  // Fähigkeiten und Handgriffe
  const A = T.abil;
  if (A === 'sprung') { S('abil', 'sprung', 'Sprungangriff: Brüllen', 'loewe', 0.55, { gruppe: 'ruf' }); S('abil', 'landung', 'Sprungangriff: Landung', 'loewen_landung', 0.6, { gruppe: 'nahkampf', hin: 'Darunter leise der alte Landeton (steps 0,2).' }); }
  // Prüfliste 2.17 (2026-11-21): neue Abläufe – Enrico wählt die Töne selbst
  if (A === 'durchbruch') { S('abil', 'durch_aufladen', 'Ausholen: Aufladen', 'held_aufladen', 0.6, { gruppe: 'held' }); S('abil', 'durch_schlag', 'Durchbruch-Aufprall: Einschlag', 'held_fausteinschlag', 0.8, { gruppe: 'held', hin: 'Normaler Faustschlag: Zeile Nahkampf (Servo lädt + Schlag). Robot-Boom: Platz held_faustboom.' }); S('abil', 'durch_dampfstoss', 'Danach: Dampfstoß', 'held_dampfstoss', 0.5, { gruppe: 'held' }); S('abil', 'durch_dampf', 'Danach: Dampfzischen', 'held_dampf', 0.35, { gruppe: 'held' }); }   // Held Rote Faust (2026-11-21)
  if (A === 'hinrichtung') { S('abil', 'hinr_start', 'Ausholen: Kettenschwert springt an', 'held_saege_start2', 0.6, { gruppe: 'held', hin: 'Auch vor dem Querhieb.' }); S('abil', 'hinr_schrei', 'Ausholen: Ächzen hinter dem Helm', 'held_ritter_schrei', 0.5, { gruppe: 'held' }); S('abil', 'hinr_schnitt', 'Schlag: Schwung mit Schnitt', 'held_saege_schnitt2', 0.7, { gruppe: 'held', hin: 'Auch beim Querhieb.' }); S('abil', 'ritter_schritt', 'Schritte (zwei je Feld)', 'held_schritt_ritter2', 0.55, { gruppe: 'held' }); }
  if (T.held) { S('treffer', 'held_ruestung', 'Getroffen: Schlag auf Rüstung', 'held_ruestung', 0.5, { gruppe: 'held' }); S('tod', 'held_horn', 'Fällt: Horn', 'held_fall_horn', 0.6, { gruppe: 'held' }); }   // Held Kürassier
  if (A === 'rollen') { S('abil', 'rollen_pfeife', 'Sturmrollen: Dampfpfeife (Ankündigung)', 'dampfpfeife', 0.6, { gruppe: 'fahrzeug' }); S('abil', 'rollen_zischen', 'Sturmrollen: Dampfzischen unter der Pfeife', 'held_dampf', 0.18, { gruppe: 'fahrzeug' }); S('abil', 'rollen_anlauf', 'Sturmrollen: Anlauf (Kettenrollen)', 'tank', 0.5, { gruppe: 'fahrzeug' }); S('abil', 'rollen_aufprall', 'Sturmrollen: Aufprall', 'neu3_fzaufprall', 0.7, { gruppe: 'fahrzeug', spiel: 'aufprall_rollen' }); S('abil', 'rollen_krach', 'Sturmrollen: Krachen beim Aufprall', 'ueberrollen', 0.45, { gruppe: 'fahrzeug' }); }
  if (k === 'walker') { if (!out.some(z => z.platz === 'tank')) S('abil', 'rammen_anlauf', 'Gebäude rammen: Anlauf', 'tank', 0.5, { gruppe: 'fahrzeug' });   // Ton-Spur 2026-11-23
    S('abil', 'rammen', 'Gebäude rammen: Aufprall', 'impact', 0.7, { gruppe: 'einschlag' }); S('abil', 'rammen_wucht', 'Gebäude rammen: Wucht', 'neu3_fzaufprall', 0.6, { gruppe: 'fahrzeug', spiel: 'aufprall_rammen' }); }   // „Gebäude stürzt ein“ steht unter „Gelände und Gebäude“
  if (A === 'pzgranate') { S('abil', 'pzg_wurf', 'Panzergranate: Explosion', 'boom', 0.6, { gruppe: 'einschlag' }); S('abil', 'pzg_metall', 'Panzergranate: Treffer am Panzer', 'einschlag_panzer', 0.55, { gruppe: 'einschlag' }); S('abil', 'pzg_abprall', 'Panzergranate: prallt ab', 'einschlag_abpraller', 0.3, { gruppe: 'einschlag', hin: 'Gegen Ziele, bei denen die Granate nach der Tabelle nicht voll wirkt.' }); }
  if (fig === 'drill') S('abil', 'bohr_wucht', 'Bohrstoß: Wucht', 'neu3_fzaufprall', 0.45, { gruppe: 'fahrzeug', spiel: 'aufprall_bohr', hin: 'Zusammen mit dem Bohrton (Nahkampf-Zeile), Bohrkopf dreht etwa 0,9 s.' });
  if (T.fessel) { S('abil', 'brenner', 'Aufsteigen: Brenner faucht', 'ballon_brenner', 0.4, { gruppe: 'handgriff' }); S('abil', 'winde', 'Ballon einholen/aufsteigen: Winde', 'drahtwackeln', 0.45, { gruppe: 'handgriff' }); S('abil', 'ratsche', 'Ballon: Ratsche', 'mgladen', 0.35, { gruppe: 'handgriff' }); }
  if (T.flame || (T.zweit && T.zweit.flamme)) S('abil', 'nachbrennen', 'Flammenstoß: Nachbrennen (nach der Schleife)', 'feuer', 0.3, { gruppe: 'flamme', hin: 'Der Strahl selbst ist die Zeile „Flammenstrahl“; er läuft als Schleife genau so lange wie der Strahl (1,5 s, Bohrkoloss 1,1 s).' });
  if (T.dig) S('abil', 'sandsack', 'Eingraben: Sandsäcke', 'sandsaecke', 0.4, { gruppe: 'handgriff', hin: 'Standard 2026-11-22 (Enrico 15:26), zusammen mit dem Atmen.' });
  if (T.dig) S('abil', 'atmen', 'Eingraben: Graben mit schwerem Atmen', 'atmen', 0.42, { gruppe: 'ruf', hin: 'Nur noch 72199 (F32).' });
  if (T.shieldWall) S('abil', 'schilde', 'Schilde vor', 'armor', 0.5, { gruppe: 'handgriff' });
  if (A === 'rush') S('abil', 'rush', 'Sturmlauf: Ruf', sd === 'D' ? 'roar' : 'forward', 0.7, { gruppe: 'ruf' });
  if (T.mg) { S('abil', 'mgauf', 'MG aufstellen', 'mg_aufbauen', 0.55, { gruppe: 'handgriff', hin: 'Standard 2026-11-22; vorher mgsetup + mgladen.' });
    S('abil', 'mgab', 'MG abbauen', 'mg_abbauen', 0.5, { gruppe: 'handgriff', hin: 'Klingt auch, wenn das MG durch Durchbruch/Sturmrollen zurückgeschoben wird.' }); S('abil', 'sperr', 'MG-Sperrfeuer bereit', 'nachladen', 0.4, { gruppe: 'handgriff' }); }
  if (A === 'mark') { S('abil', 'leucht', 'Ziel markieren: Leuchtpistole', 'leuchtschuss', 0.5, { gruppe: 'signal' }); S('abil', 'brand', 'Leuchtkugel brennt', 'leuchtbrand', 0.22, { gruppe: 'handgriff' }); }
  if (A === 'strike') { S('abil', 'strike', 'Feuerschlag: Abschuss', 'cannonH', 0.35, { gruppe: 'kanone' }); S('abil', 'strikeziel', 'Feuerschlag: Einschlag', 'einschlagH', 0.8, { gruppe: 'einschlag' }); S('abil', 'strikesplitter', 'Feuerschlag: Splitter treffen Fußtruppen (dumpf)', 'einschlag', 0.3, { gruppe: 'einschlag', rate: 0.76, dur: 320 }); }
  if (A === 'smoke') { S('abil', 'werfer', 'Nebelwand: Abschuss', 'werfer', 0.55, { gruppe: 'flamme' }); S('abil', 'nebel', 'Nebelwand: Geschoss', 'gas', 0.5, { gruppe: 'einschlag' }); }
  if (A === 'tunnel') { S('abil', 'stollen', 'Stollen graben', 'bauen', 0.3, { gruppe: 'handgriff' }); S('abil', 'stollentick', 'Stollen graben: Ticken', 'tick', 0.45, { gruppe: 'handgriff' }); }   // „Stollen gesprengt“ steht unter „Gelände und Gebäude“ (passiert zu Rundenbeginn ohne Einheit)
  if (A === 'charge') { S('abil', 'tick', 'Haftladung: Zünder', 'tick', 0.5, { gruppe: 'handgriff' }); S('abil', 'spreng', 'Haftladung: Sprengung', 'blast', 0.8, { gruppe: 'einschlag' }); }
  if (A === 'mine') { S('abil', 'mine', 'Mine legen', 'bauen', 0.3, { gruppe: 'handgriff' }); S('abil', 'minetick', 'Mine legen: Ticken', 'tick', 0.4, { gruppe: 'handgriff' }); }
  if (T.wirelayer) S('abil', 'draht', 'Draht ziehen', 'bauen', 0.3, { gruppe: 'handgriff' });
  if (A === 'clear') S('abil', 'entgiften', 'Entgiften', 'gasmaske_1', 0.5, { gruppe: 'handgriff' });
  if (A === 'ammo') S('abil', 'munition', 'Munition verteilen', 'nachladen', 0.55, { gruppe: 'handgriff' });
  if (T.repair || T.recover) S('abil', 'bergen', T.repair ? 'Reparieren / Bergen' : 'Bergen / instand setzen', 'reparieren', 0.6, { gruppe: 'handgriff', hin: T.repair ? 'Werkstatt-Töne statt Sanitäter (F39).' : undefined });
  if (k === 'medic' && !T.repair) S('abil', 'heilen', 'Versorgen', 'heal', 0.5, { gruppe: 'handgriff' });
  if (T.courier) { S('abil', 'befehlhund', 'Befehl überbringen: Hund', 'dog', 0.55, { gruppe: 'bewegung' }); S('abil', 'ruf', 'Befehl überbringen: Ruf', 'comeon', 0.45, { gruppe: 'ruf' }); }
  if (T.cmd) { if (sd === 'D') S('abil', 'befehl', 'Befehl (Sammeln, Sturmbefehl)', 'roar', 0.45, { gruppe: 'ruf' });
    else { S('abil', 'befehl', 'Befehl „Feuer frei“', 'forward', 0.45, { gruppe: 'ruf' }); S('abil', 'sammeln', 'Befehl „Sammeln“', 'stand', 0.45, { gruppe: 'ruf' }); }
    if (T.cmd === 2) S('abil', 'gross', sd === 'D' ? 'Generalangriff' : 'Halten um jeden Preis', sd === 'D' ? 'generalhorn' : 'march', 0.5, { gruppe: 'signal' }); }
  if (T.banner) S('abil', 'banner', 'Banner aufpflanzen', 'bauen', 0.32, { gruppe: 'handgriff', hin: 'Aufnehmen: 0,22.' });
  if (T.cutter) S('abil', 'schneiden', 'Draht schneiden', 'draht_schneiden', 0.7, { gruppe: 'draht' });
  if (t === 'saeger') { S('nah', 'saege_ein', 'Sägehieb: Einschlag (Fußtruppen)', 'saege_einschlag', 0.6, { gruppe: 'saege' }); S('nah', 'saege_fl', 'Sägehieb: Sägen (Fußtruppen, danach)', 'saege_fleisch', 0.45, { gruppe: 'saege' }); S('nah', 'saege_me', 'Sägehieb gegen Gepanzerte', 'saege_metall', 0.6, { gruppe: 'saege' }); }
  if (t === 'orden') S('nah', 'kettensaege_me', 'Kettensäge gegen Gepanzerte', 'held_kschwert_metall', 0.5, { gruppe: 'saege' });
  if (T.limber) { S('abil', 'auf', 'Aufprotzen', 'geschuetz_aufprotzen', 0.6, { gruppe: 'handgriff' }); S('abil', 'ab', 'Abprotzen', 'geschuetz_abprotzen', 0.6, { gruppe: 'handgriff' }); }
  if (T.roar) S('abil', 'loewe', 'Löwengebrüll', 'loewe', 0.6, { gruppe: 'ruf' });
  if (T.blastLance) S('abil', 'lanze', 'Sprenglanze', 'grenade2', 0.6, { gruppe: 'einschlag' });
  if (T.granatSturm) S('nah', 'handgranate', 'Handgranaten vor dem Nahkampf', 'grenade', 0.55, { gruppe: 'einschlag' });   // F103 (2026-11-22)
  else if (T.abil === 'handgranate') S('abil', 'handgranate', 'Handgranaten (Fähigkeit): Wurf und Explosion', 'grenade', 0.55, { gruppe: 'einschlag' });   // Paket B2 (2026-11-24): Fähigkeit statt fester Regel
  if (T.counterStrike) S('abil', 'gegenstoss', 'Gegenstoß', 'charge', 0.6, { gruppe: 'ruf' });
  // Ankunft
  S('ankunft', 'nachschub', 'Nachschub trifft ein', 'whistle', 0.5, { gruppe: 'signal' });
  { const ids = out.map(z => z.id), dopp = ids.filter((x, i) => ids.indexOf(x) !== i); if (dopp.length) throw new Error('doppelte Zeilen-Kennung bei ' + t + ': ' + dopp.join(', ')); }   // jede Zeile braucht eine eigene Kennung (Speicher je Einheit und Zeile)
  return out;
}

const einheiten = [];
for (const sd of ['A', 'D']) for (const t of E.ROSTER[sd]) { const T = TYPES[t];
  einheiten.push({ t, name: T.name, sd, kat: katVon(t), mech: !!E.isMech(t), img: BILDER[t] || '', stimme: SATZ_NAME[stimmSatz(t)], slots: slotsVon(t) }); }
// Stimmen (Enrico 2026-11-22): je Seite eine Zeile je Ereignis; Standard „kein Ton“, Enrico wählt aus dem Stimmenpaket. Filter live: Gasmaske + Rauschen (Standard), nur Rauschen, roh.
const RUFE = [['auswahl', 'Auswahl / Bestätigung (etwa jede dritte Auswahl)'], ['vorruecken', 'Vorrücken'], ['feuer', 'Feuer'], ['sturm', 'Sturm / Nahkampf'], ['niedergehalten', 'Niedergehalten'], ['rueckzug', 'Rückzug / Flucht'], ['sammeln', 'Sammeln'],
  ['granate', 'Granate'], ['gas', 'Gas'], ['koloss', 'Koloss / Panzer gesichtet'], ['feuerbereit', 'Feuerbereitschaft'], ['sanitaeter', 'Sanitäter!'], ['held_an', 'Held tritt an'], ['held_faellt', 'Held fällt'], ['sieg', 'Sieg'],
  ['feuer_befehl', 'Feuer-Befehl (Hauptmann/General: Feuer frei, Feuerschlag, Feuerbereitschaft)', 'ruf_feuer'], ['panik_einzeln', 'Panik, einzeln (kleiner Trupp flieht)', 'panik_einzeln'], ['panik_gruppe', 'Panik, Gruppe (großer Trupp oder mehrere fliehen)', 'panik_gruppe'],
  ['sterben_einzeln', 'Sterben, einzeln (etwa jede dritte Vernichtung, nach 5 s ausgeblendet)', 'sterben_einzeln'], ['sterben_gruppe', 'Sterben, Gruppe (schwere Verluste, leise)', 'sterben_gruppe']];   // dritter Wert = Standard-Platz (Enrico 2026-11-22 14:50)
const SST_RUFE = [['auswahl', 'Auswahl (jede dritte)'], ['bewegen', 'Bewegen'], ['angriff', 'Angriff (Fernkampf)'], ['nahkampf', 'Nahkampf'], ['getroffen', 'Getroffen'], ['schwer_beschaedigt', 'Schwer beschädigt (einmal je Schreiter)'], ['feind_gesichtet', 'Feindliche Maschine gesichtet'], ['zerstoert', 'Zerstört']];
for (const sd of ['A', 'D']) einheiten.push({ t: 'stimmen_' + sd, name: sd === 'A' ? 'Stimmen Konkordat' : 'Stimmen Aschenwacht', sd, kat: 'Stimmen', mech: false, img: '', stimme: '',
  slots: RUFE.filter(([id]) => id !== 'held_faellt' && !(id === 'granate' && sd === 'A')).map(([id, titel, std]) => ({   // Held fällt: die Heldenstimme übernimmt; Granate: nur die Aschenwacht hat Panzergranaten (Ton-Spur 2026-11-23)
     ab: 'stimme', id: 'ruf_' + id, titel, platz: std || '-', vol: 0.5, v: null, gruppe: 'stimmen', mode: 'ruf', rate: null, dur: 0, hin: 'Höchstens ein Ruf gleichzeitig, je Ereignis höchstens alle 7 s. Filter und Stärke gelten für diese Zeile.', kette: null, sd, auch: [] })) });
// Schreiter-Stimmen (Enrico 2026-11-22 14:40): Gruppe „Schreiter“ unter Stimmen, Roboter-Filter je Zeile
for (const sd of ['A', 'D']) einheiten.push({ t: 'stimmen_schreiter_' + sd, name: sd === 'A' ? 'Schreiter Konkordat' : 'Schreiter Aschenwacht', sd, kat: 'Stimmen', mech: false, img: '', stimme: '',
  slots: SST_RUFE.map(([id, titel]) => ({ ab: 'stimme', id: 'ruf_' + id, titel, platz: 'sst_' + id, vol: 0.55, v: null, gruppe: 'stimmen', mode: 'ruf', filt: 'roboter', fst: sd === 'D' ? 0.7 : 0.45, rate: null, dur: 0, hin: 'Gilt für alle Schreiter (Säge, Klaue, Turm, Orden, Kreuz, Eisenknecht). Höchstens ein Ruf gleichzeitig, je Anlass höchstens alle 7 s.', kette: null, sd, auch: [] })) });
// Heldenstimmen (Enrico 2026-11-22 15:58/16:08): Gruppen „Held Rote Faust“ und „Held Eiserner Kürassier“
const HELD_RUFE = [['auswahl', 'Auswahl (etwa jede zweite)'], ['bewegen', 'Ziehen'], ['angriff', 'Angriff (Nahkampf)'], ['spezial', null], ['getroffen', 'Getroffen (höchstens alle 8 s)'], ['gegner_erledigt', 'Gegner vernichtet'], ['schwer_verwundet', 'Schwer verwundet (einmal je Schlacht)'], ['tod', 'Tod']];
for (const [t, name, sd, filt, fst, spezial, pre] of [['stimmen_held_faust', 'Held Rote Faust', 'A', 'roh', 0, ['durchbruch', 'Durchbruch (beim Anlauf)'], 'hst_faust_'], ['stimmen_held_kuerass', 'Held Eiserner Kürassier', 'D', 'helm', 0.6, ['hinrichtung', 'Hinrichtung (vor dem Säge-Schnitt)'], 'hst_kuerass_']])
  einheiten.push({ t, name, sd, kat: 'Stimmen', mech: false, img: '', stimme: '', slots: HELD_RUFE.map(([id, titel]) => ({ ab: 'stimme', id: 'ruf_' + id, titel: titel || spezial[1], platz: pre + (id === 'spezial' ? spezial[0] : id), vol: 0.6, v: null, gruppe: 'stimmen', mode: 'ruf', filt, fst, rate: null, dur: 0,
    hin: (t.endsWith('kuerass') ? 'Stimme Ragnar mit Helm-Filter, im Spiel tiefer (0,92); je Anlass zwei Fassungen im Wechsel. ' : 'Ohne Filter. ') + 'Höchstens ein Ruf gleichzeitig, je Anlass höchstens alle 7 s.', kette: null, sd, auch: [] })) });
// Winter (Karte) (Enrico 2026-11-22 17:05): alle Wintertöne an einer Stelle; eine Wahl hier gilt im Spiel auf Winterkarten (ui.js tonWahl → TONWAHL.winter)
{ const W = (ab, id, titel, platz, vol, hin) => ({ ab, id, titel, platz, vol, v: null, gruppe: 'winter', mode: null, rate: null, dur: 0, hin, kette: null, sd: null, auch: [] });
  einheiten.push({ t: 'winter', name: 'Winter (Karte)', sd: null, kat: 'Stimmen', mech: false, img: '', stimme: '', slots: [
    W('zug', 'schnee_einzeln', 'Schritte kleiner Trupps im Schnee', 'schnee_einzeln', 0.5, 'Anführer, Melder, Scharfschützen und Trupps mit 1–2 Figuren.'),
    W('zug', 'schnee_gruppe', 'Schritte der Fußtrupps im Schnee', 'schnee_gruppe', 0.5, 'Statt der normalen Schritte.'),
    W('zug', 'schnee_rennen', 'Marsch, Sturmlauf, Rückzug im Schnee', 'schnee_rennen', 0.5, 'Bei Marsch und Sturmlauf leise unter den Schritten.'),
    W('zug', 'stampfen_schnee', 'Stampfen im Schnee (unter Schreitern und Kampfanzügen)', 'stampfen_schnee', 0.25, 'Unterlage, gleicher Takt.'),
    W('zug', 'panzerketten_schnee', 'Ketten im Schnee (unter dem Kettenrollen)', 'panzerketten_schnee', 0.35, 'Landkoloss, Sturmpanzer, Bohrkoloss.'),
    W('zug', 'pferde_schnee', 'Pferde mit Protze im Schnee', 'pferde_schnee', 0.5, 'Aufgeprotzte Geschütze; leise (0,22) auch unter Reitern.'),
    W('zug', 'eis_knackt', 'Eis knackt (Fußtruppen auf Eis)', 'eis_knackt', 0.5, 'Nur der Anfang (1,5 s). Ganzer Ton mit Einbrechen: Platz eis_bricht, nur im Pult.'),
    W('ankunft', 'winterwind_stark', 'Böe (selten, Kulisse)', 'winterwind_stark', 0.12, 'Grundschleife: winterwind (0,13, zwei Spuren mit Überblendung).') ] }); }
// Gelände und Gebäude (2026-11-23): Töne ohne Einheit; eine Wahl hier gilt im Spiel immer (ui.js tonWahl → TONWAHL.gelaende)
{ const W = (ab, id, titel, platz, vol, hin, spiel) => ({ ab, id, titel, platz, vol, v: null, gruppe: 'einschlag', mode: null, rate: null, dur: 0, hin, kette: null, sd: null, spiel: spiel || null, auch: [] });
  einheiten.push({ t: 'gelaende', name: 'Gelände und Gebäude', sd: null, kat: 'Stimmen', mech: false, img: '', stimme: '', slots: [
    W('tod', 'einsturz', 'Gebäude stürzt ein', 'einsturz', 0.95, 'Kirche, Haus, Kapelle; auch nach Rammen und Sprengen.'),
    W('tod', 'stollenboom', 'Stollen wird gesprengt: Explosion', 'boom2', 0.8, 'Zu Rundenbeginn, zwei Runden nach dem Graben. Eigener Tonplatz im Spiel.', 'stollen_boom'),
    W('tod', 'stollenknall', 'Stollen wird gesprengt: Nachknall', 'grenade2', 0.6, 'Zusammen mit der Explosion.', 'stollen_knall'),
    W('tod', 'stollenblast', 'Stollen wird gesprengt: Erdreich bricht ein', 'blast', 0.8, 'Gleich danach, zusammen mit dem Einsturz-Ton.', 'stollen_blast') ] }); }
// Wer nutzt welchen Platz (gleiche Seite, gleicher Filter): Hinweis „gilt im Spiel auch für“
const nutzer = {};
for (const u of einheiten) for (const s of u.slots) { if (s.mode === 'ruf') continue; const key = s.platz + '|' + (s.platz.startsWith('sv_') ? '' : s.sd) + '|' + (s.v || ''); (nutzer[key] = nutzer[key] || new Set()).add(u.name); }
for (const u of einheiten) for (const s of u.slots) { if (s.mode === 'ruf') continue; const n = [...nutzer[s.platz + '|' + (s.platz.startsWith('sv_') ? '' : s.sd) + '|' + (s.v || '')]].filter(x => x !== u.name); s.auch = n; }
// ================= Ton-Pult 2 (Enrico 2026-11-22 19:10) =================
// Bibliothek nach dem, was man hört (ersetzt in der Auswahl die Code-Gruppen GRUPPEN, die intern bleiben). Je Rubrik Unterüberschriften mit Tonplätzen;
// „x_*“ nimmt alle Plätze mit diesem Anfang. Ein Platz darf in zwei Rubriken stehen (Schritte im Schnee: Schritte und Winter). Neue Plätze hier eintragen –
// was fehlt, landet in „Übrige Töne“ und wird beim Bauen gemeldet.
const HOER = [   // Ton-Pult 3 (Enrico 2026-11-23): nach Inhalt statt Dateiname, jeder Platz nur noch an EINER Stelle; „?“ hinter dem Namen = Einsortierung unsicher (Enrico prüft beim Hören, kann im Pult umsortieren)
  ['stimmen', 'Stimmen und Rufe', [['Rufe und Befehle', 'forward stand roar charge? comeon cry scream ruf_feuer mgsetup?'], ['Schmerz, Panik, Sterben', 'pain medic panic panik_einzeln panik_gruppe sterben_einzeln sterben_gruppe neu2_schrei'],
    ['Husten, Atmen, Maske', 'husten grunzen gasmaske selGas neu2_maske'], ['Stimmenpaket und Gefechtsrufe', 'stimmen_paket neu2_stimme'], ['Helden', 'hst_faust_* hst_kuerass_* held_ritter_schrei'], ['Schreiter-Stimmen', 'sst_*'],
    ['Brüllen und Bestien', 'loewe oger_bruell tiger neu3_loewe neu3_loewe2 neu3_bestie neu_tiger_mech'], ['Monster (später Dämonen)', 'neu2_monster'], ['Sprüche beim Anklicken', 'sv_*']]],
  ['schritte', 'Schritte', [['', 'schritte steps stepsWald marschtritt holzknacken'], ['Im Schnee', 'schnee_einzeln schnee_gruppe schnee_rennen neu2_schritte?'], ['Schwere Schritte', 'kampfanzug_schritte neu_schritte_schwer held_schritt_ritter? held_schritt_ritter2 stampfen_schnee'],
    ['Schreiter und Maschinen', 'schreiter_schritte mech']]],
  ['pferde', 'Pferde und Gespann', [['', 'pferd_auswahl pferd_unruhe neigh gallop gallop2'], ['Gespann und Wagen', 'gespann wagenknarren pferde_schnee']]],
  ['motoren', 'Motoren und Ketten', [['', 'motor_auswahl tank panzerketten_schnee dampfpfeife'], ['Überrollen und Panne', 'ueberrollen draht_ueberrollen crash'], ['Flugzeug', 'neu2_flug']]],
  ['schreiter', 'Maschinen, Dampf, Hydraulik', [['', 'smash'], ['Maschinenstimmen', 'robot neu_roboter'], ['Dampf und Hydraulik', 'held_aufladen? held_dampfstoss held_dampf held_kolben']]],
  ['gewehre', 'Gewehre', [['', 'rifle rifle2 rifle3 rifle4 neu2_gewehr neu4_gewehr_schwer sniper semi buechse'], ['Pistolen', 'pistol neu4_pistole_schwer neu2_pistole'], ['Flinten', 'flinte neu_schrot']]],
  ['mg', 'MG', [['', 'mg minigun neu_mg_schwer neu4_mg_schwer neu2_autokanone?']]],
  ['kanonen', 'Kanonen und Artillerie', [['', 'cannon neu_kanone neu2_kanone kolosskanone loewenkanone panzerkanone'], ['Schwere Artillerie', 'cannonH?'], ['Mörser und Werfer', 'launch launch2 werfer neu4_granatwerfer']]],
  ['einschlaege', 'Einschläge', [['', 'einschlag vorbei boomH einschlagH barrage grenade2 blast boom2 wasser neu2_einschlag neu2_knall?'], ['Auf Panzerung und Stein', 'armor impact einschlag_panzer einschlag_abpraller neu2_metall held_ruestung'],
    ['Aufprall und Einsturz', 'neu3_fzaufprall neu3_aufprall neu2_crash einsturz neu2_einsturz']]],
  ['nahkampf', 'Nahkampf', [['', 'nahA nahD saebel sword axe slash heavy neu_wucht neu2_nahkampf getuemmel'], ['Fleisch und Blut', 'neu3_fleisch neu3_gore neu2_blut'], ['Klauen und Bisse', 'stahlklaue_fleisch stahlklaue_eisen krallen_fleisch krallen_eisen neu3_biss loewen_landung'],
    ['Sägen und Kettenschwert', 'saege_einschlag saege_fleisch saege_metall held_saege_start held_saege_start2 held_saege_schnitt held_saege_schnitt2 held_kschwert_metall held_kschwert_fleisch'], ['Rote Faust', 'held_faustschlag held_faustschlag2 held_fausteinschlag held_faustboom']]],
  ['graben', 'Graben und Schanzen', [['Schaufeln und Atmen', 'schaufel atmen'], ['Sandsäcke und Bauen', 'sandsaecke bauen?'], ['Draht', 'cut draht_schneiden draht_infanterie drahtlatch? drahtwackeln']]],
  ['feuer', 'Feuer, Gas, Rauch', [['', 'flame feuer neu2_feuer ballon_brenner'], ['Gas und Rauch', 'gas rauch'], ['Leuchtkugel', 'leuchtschuss leuchtbrand']]],
  ['natur', 'Natur, Kulisse und Winter', [['', 'wind kraehe ambient wetter neu_versorgung?'], ['Winter', 'winterwind winterwind_stark eis_knackt eis_bricht'], ['Glocken', 'glocke glocke_fern glocke_fall'], ['Tiere und Wasser', 'dog neu2_hund neu2_wasser']]],
  ['oberflaeche', 'Oberfläche', [['', 'ui klick neu2_knopf'], ['Signale', 'whistle horn generalhorn held_fall_horn neu2_horn march zug_eigen zug_gegner erobert verloren win neu2_punkt'], ['Musik', 'musik_titel musik_schlacht musikNiederlage neu2_musik']]],
  ['handgriffe', 'Handgriffe und Gerät', [['MG und Nachladen', 'mg_aufbauen mg_abbauen mgladen nachladen neu_nachladen huelsen'], ['Geschütz', 'geschuetz_aufprotzen geschuetz_abprotzen clank abprotzen'], ['Zünder und Riegel', 'tick neu2_tuer'], ['Versorgen', 'heal reparieren']]] ];
const UNSICHER = [];   // Plätze mit „?“ in HOER
const istVariante = p => { const m = p.match(/^(.+)_(gm|gs|bf|mr)$/); return !!(m && POOLS[m[1]]); };
const POOL_KEYS = new Set(Object.values(POOLS).flat().map(x => x[0])), BIB_PLAETZE = [...Object.keys(POOLS).filter(p => !istVariante(p)), ...KEYS.filter(k => !POOL_KEYS.has(k))], inBib = new Set();
const BIB = HOER.map(([id, titel, teile]) => { const e = [];
  for (const [unter, liste] of teile) for (let w of liste.split(' ')) { const frag = w.endsWith('?'); if (frag) w = w.slice(0, -1); for (const p of (w.endsWith('*') ? BIB_PLAETZE.filter(x => x.startsWith(w.slice(0, -1))) : BIB_PLAETZE.includes(w) ? [w] : [])) { e.push([p, unter || null]); inBib.add(p); if (frag) UNSICHER.push(p); } }
  return { id, titel, e }; });
{ const rest = BIB_PLAETZE.filter(p => !inBib.has(p)); if (rest.length) { BIB.push({ id: 'rest', titel: 'Übrige Töne', e: rest.map(p => [p, null]) }); console.log('Ton-Pult: ohne Rubrik in HOER (jetzt unter „Übrige Töne“):', rest.join(' ')); } }
Object.assign(NAME, { saege_einschlag: 'Säge: Einschlag', saege_fleisch: 'Säge: Sägen in Fußtruppen', saege_metall: 'Säge gegen Panzerung', neu4_pistole_schwer: 'Schwere Pistole (Offiziere)', neu4_gewehr_schwer: 'Schweres Gewehr (Panzerbüchse)', neu4_mg_schwer: 'Schweres MG (Schreiter)',
  neu4_granatwerfer: 'Granatwerfer', draht_schneiden: 'Draht schneiden (neu)', draht_ueberrollen: 'Draht niederwalzen', draht_infanterie: 'Im Stacheldraht (Fußtruppen)', schreiter_schritte: 'Schreiter-Schritte', kampfanzug_schritte: 'Kampfanzug-Schritte',
  stahlklaue_fleisch: 'Stahlklaue gegen Fußtruppen', stahlklaue_eisen: 'Stahlklaue gegen Panzerung', krallen_fleisch: 'Krallen gegen Fußtruppen', krallen_eisen: 'Krallen gegen Panzerung', einsturz: 'Gebäude stürzt ein', glocke: 'Kirchenglocke', glocke_fern: 'Glocke, fern',
  glocke_fall: 'Glocke fällt', kraehe: 'Krähen', wind: 'Wind', gasmaske: 'Gasmaske / Maskenlaut', erobert: 'Zielfeld erobert', verloren: 'Zielfeld verloren', win: 'Sieg', getuemmel: 'Nahkampf-Getümmel (Schleife)', ambient: 'Ferner Gefechtslärm', wetter: 'Regen und Donner',
  musik_titel: 'Musik: Titel', musik_schlacht: 'Musik: Schlacht', musikNiederlage: 'Musik: Niederlage', klick: 'Klick (Nächste Einheit, Fertig)', ruf_feuer: 'Ruf: Feuer-Befehl', panik_einzeln: 'Panik, einzeln', panik_gruppe: 'Panik, Gruppe', sterben_einzeln: 'Sterben, einzeln',
  sterben_gruppe: 'Sterben, Gruppe', mg_aufbauen: 'MG aufbauen', mg_abbauen: 'MG abbauen', geschuetz_aufprotzen: 'Geschütz aufprotzen', geschuetz_abprotzen: 'Geschütz abprotzen', sandsaecke: 'Sandsäcke (Eingraben)', loewen_landung: 'Löwen-Landung (Sprungangriff)',
  schnee_einzeln: 'Schritte im Schnee, einzeln', schnee_gruppe: 'Schritte im Schnee, Gruppe', schnee_rennen: 'Rennen im Schnee', stampfen_schnee: 'Stampfen im Schnee', panzerketten_schnee: 'Ketten im Schnee', pferde_schnee: 'Pferde im Schnee', eis_knackt: 'Eis knackt',
  eis_bricht: 'Eis bricht', winterwind: 'Winterwind', winterwind_stark: 'Winterwind, Böe', huelsen: 'Patronenhülsen fallen', stimmen_paket: 'Stimmenpaket (ElevenLabs)', selGas: 'Atmen in der Gasmaske (Gasschutz angeklickt)', launch2: 'Mörser (alt)', gallop: 'Galopp (alt)',
  horn: 'Signalhorn', neigh: 'Wiehern', tiger: 'Brüllen (Klauenschreiter)' });
{ const SST = { auswahl: 'Auswahl', bewegen: 'Bewegen', angriff: 'Angriff', nahkampf: 'Nahkampf', getroffen: 'Getroffen', schwer_beschaedigt: 'Schwer beschädigt', feind_gesichtet: 'Feind gesichtet', zerstoert: 'Zerstört', durchbruch: 'Durchbruch', hinrichtung: 'Hinrichtung', gegner_erledigt: 'Gegner vernichtet', schwer_verwundet: 'Schwer verwundet', tod: 'Tod' };
  for (const p of BIB_PLAETZE) { const m = p.match(/^(sst|hst_faust|hst_kuerass)_(.+)$/); if (m && !NAME[p]) NAME[p] = (m[1] === 'sst' ? 'Schreiter-Stimme: ' : m[1] === 'hst_faust' ? 'Rote Faust spricht: ' : 'Kürassier spricht: ') + (SST[m[2]] || m[2]); }
  const ohne = BIB_PLAETZE.filter(p => !NAME[p] && !/^sv_/.test(p)); if (ohne.length) console.log('Ton-Pult: Plätze ohne lesbaren Namen (NAME ergänzen):', ohne.join(' ')); }
// Länge je Ton (Sekunden) aus den eingebetteten Daten: AAC (ADTS-Rahmen zählen) bzw. MP3 (Rahmen zählen)
function dauerVon(uri) { const m = /^data:([^;]+);base64,/.exec(uri); if (!m) return null; const b = Buffer.from(uri.slice(m[0].length), 'base64'); let i = 0, t = 0;
  if (m[1] === 'audio/aac') { const SR = [96000, 88200, 64000, 48000, 44100, 32000, 24000, 22050, 16000, 12000, 11025, 8000, 7350];
    while (i + 7 < b.length) { if (b[i] !== 0xFF || (b[i + 1] & 0xF0) !== 0xF0) return null; const len = ((b[i + 3] & 3) << 11) | (b[i + 4] << 3) | (b[i + 5] >> 5); if (len < 7) return null; t += 1024 / SR[(b[i + 2] >> 2) & 15]; i += len; } return t; }
  const BR1 = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320], BR2 = [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160];
  if (b.slice(0, 3).toString('latin1') === 'ID3') i = 10 + (((b[6] & 127) << 21) | ((b[7] & 127) << 14) | ((b[8] & 127) << 7) | (b[9] & 127));
  while (i + 4 < b.length) { const ver = (b[i + 1] >> 3) & 3, lay = (b[i + 1] >> 1) & 3, bri = b[i + 2] >> 4, sri = (b[i + 2] >> 2) & 3;
    if (b[i] !== 0xFF || (b[i + 1] & 0xE0) !== 0xE0 || ver === 1 || lay !== 1 || bri === 0 || bri === 15 || sri === 3) { i++; continue; }
    const sr = [44100, 48000, 32000][sri] / (ver === 3 ? 1 : ver === 2 ? 2 : 4), spf = ver === 3 ? 1152 : 576; t += spf / sr; i += Math.floor(spf / 8 * (ver === 3 ? BR1 : BR2)[bri] * 1000 / sr) + ((b[i + 2] >> 1) & 1); }
  return t || null; }
const DAUER = {}; for (const k of KEYS) { const d = dauerVon(ctx.SOUNDS[k]); if (d != null) DAUER[k] = +d.toFixed(2); }
// Schnellwahl: Art und Hauptwaffe je Einheit; „gleich“ = andere Zeilen derselben Einheit mit demselben Tonplatz (im Spiel gilt eine Wahl je Einheit und Platz, also für alle diese Zeilen)
for (const u of einheiten) { const T = TYPES[u.t];
  u.art = !T ? null : T.held ? 'held' : T.cmd ? 'anfuehrer' : T.cls === 'cav' ? 'reiter' : T.cls === 'art' ? 'geschuetz' : T.cls === 'walker' ? (PANZER.includes(u.t) ? 'fahrzeug' : 'schreiter') : T.suit ? 'anzug' : 'fuss';
  const hs = u.slots.find(s => s.ab === 'schuss' && s.id === 'schuss'); u.waffe = !T || !hs ? null : ({ gewehr: 'gewehr', mg: 'mg', kanone: 'kanone', flamme: 'flamme' })[hs.gruppe] || null;
  for (const s of u.slots) s.gleich = s.mode === 'ruf' || s.platz === '-' ? [] : u.slots.filter(x => x !== s && x.mode !== 'ruf' && (x.spiel || x.platz) === (s.spiel || s.platz)).map(x => x.id); }   // gleicher Spiel-Platz (eigene Plätze über spiel)
// ================= Ton-Pult 3 (Enrico 2026-11-23 16:50) =================
// Herkunft je Ton (aus der Quelldatei): suno = eigene Sprüche (Suno), el = ElevenLabs-Stimmen, helden = Heldenstimmen (ElevenLabs, eigene Gruppe), sonst = Stimmen von Freesound/Pixabay/älter,
// elfx = ElevenLabs-Geräusche, fx = Geräusche von Freesound/Pixabay/älter. Filter-Fassungen (_gm …) erben vom Grundton.
const HEIMAT = {}; for (const b of BIB) for (const [p] of b.e) for (const [k] of (POOLS[p] || [[p]])) if (!HEIMAT[k]) HEIMAT[k] = b.id;
const EL_FX = /^(Winter|Waffen_neu|Schreiter|Aufbau|Draht)[/]|^Helden[/](el_|loewen_sprung|kettenschwert_ruestung)/;
const herkunftVon = k => { const f = DATEI[k] || '', stimme = f.startsWith('Voices/') || HEIMAT[k] === 'stimmen';
  return f.startsWith('Voices/eigene/sprueche') || /^sv_/.test(k) ? 'suno' : f.startsWith('Voices/elevenlabs/helden') ? 'helden' : f.startsWith('Voices/elevenlabs') ? 'el' : stimme ? 'sonst' : EL_FX.test(f) ? 'elfx' : 'fx'; };
const HERKUNFT = {}; for (const k of KEYS) HERKUNFT[k] = herkunftVon(k);
for (const p of Object.keys(POOLS)) { const m = p.match(/^(.+)_(gm|gs|bf|mr)$/); if (!m || !POOLS[m[1]]) continue; const g = POOLS[m[1]]; POOLS[p].forEach(([k], i) => { HERKUNFT[k] = HERKUNFT[(g[g.length === POOLS[p].length ? i : 0] || g[0])[0]]; }); }   // Filter-Fassung = Herkunft des Grundtons
for (const p of Object.keys(POOLS)) if (/^sv_/.test(p)) for (const [k] of POOLS[p]) HERKUNFT[k] = 'suno';
const HERKUNFT_NAME = [['suno', 'Suno (eigene Sprüche)', 1], ['el', 'ElevenLabs (Stimmen)', 1], ['helden', 'Helden (ElevenLabs)', 1], ['sonst', 'Freesound und sonstige (Stimmen)', 1], ['elfx', 'ElevenLabs (Geräusche)', 0], ['fx', 'Freesound, Pixabay, sonstige (Geräusche)', 0]];
// Sprechergruppen: jede Spruch-Stimme einzeln, dazu die ElevenLabs-Pakete
const SPRECHER = [];
for (const p of Object.keys(POOLS)) { const m = p.match(/^sv_([a-z]+)_([AD])([0-9]+)$/); if (m) SPRECHER.push({ id: p, name: (SATZ_NAME[m[1]] || m[1]).split(' (')[0] + ' ' + (m[2] === 'A' ? 'Konkordat' : 'Aschenwacht') + ' · Stimme ' + m[3], plaetze: [p], herkunft: 'suno' }); }
for (const [id, name, re, hk] of [['rufe_el', 'Rufe: Feuer, Panik, Sterben', /^(ruf_feuer|panik_|sterben_)/, 'el'], ['stimmenpaket', 'Stimmenpaket (30 Rufe)', /^stimmen_paket$/, 'el'], ['sani_el', '„Sanitäter!“', /^medic$/, 'el'], ['schreiter_el', 'Schreiter-Stimmen', /^sst_/, 'el'],
  ['held_faust', 'Held Rote Faust', /^hst_faust_/, 'helden'], ['held_kuerass', 'Held Eiserner Kürassier', /^hst_kuerass_/, 'helden']]) SPRECHER.push({ id, name, plaetze: Object.keys(POOLS).filter(p => re.test(p) && !istVariante(p)), herkunft: hk });
// Bestehende Mischtöne aus tools/sound_bau.json (mix): Rezept zum Öffnen im Mischton-Bereich; Spuren, soweit möglich, einem Bibliotheks-Ton aus derselben Quelldatei zugeordnet (Nachbau, nicht derselbe Ausschnitt/Filter)
const BAU = JSON.parse(readFileSync(join(ROOT, 'tools', 'sound_bau.json'), 'utf8')).eintraege, KEY_VON_DATEI = {};
const MIX_KEYS = new Set(BAU.map((e, i) => e.mix && rows[i] && rows[i].pool === e.pool ? rows[i].key : null).filter(Boolean));   // fertig gemischte Töne taugen nicht als Spur ihres eigenen Rezepts
for (const k of KEYS) if (DATEI[k] && !KEY_VON_DATEI[DATEI[k]] && !MIX_KEYS.has(k)) KEY_VON_DATEI[DATEI[k]] = k;
const MIXE = []; BAU.forEach((e, i) => { if (!e.mix || !rows[i] || rows[i].pool !== e.pool || !ctx.SOUNDS[rows[i].key]) return;
  MIXE.push({ key: rows[i].key, platz: e.pool, notiz: e.note || '', spuren: [{ f: e.f, k: KEY_VON_DATEI[e.f] || null, ms: 0, db: 0 }, ...e.mix.map(m => ({ f: m.f, k: KEY_VON_DATEI[m.f] || null, ms: Math.round((m.at || 0) * 1000), db: m.db || 0 }))] }); });
// Gemeinsame Stimmen je Einheit (Rufe gelten je Seite bzw. für alle Schreiter; Helden haben eigene)
const SCHREITER_T = ['saeger', 'klaue', 'turm', 'orden', 'kreuz', 'knecht'];
for (const u of einheiten) { if (!TYPES[u.t]) continue; u.gemeinsam = u.t === 'faust' ? ['stimmen_held_faust'] : u.t === 'kuerass' ? ['stimmen_held_kuerass'] : SCHREITER_T.includes(u.t) ? ['stimmen_schreiter_' + u.sd] : ['stimmen_' + u.sd]; }
const DATA = { unsicher: UNSICHER, herkunft: HERKUNFT, herkunftName: HERKUNFT_NAME, sprecher: SPRECHER, mixe: MIXE, bib: BIB, dauer: DAUER, stand: new Date().toISOString().slice(0, 10), einheiten, ab: AB, gruppen: GRUPPEN, name: NAME, var: VAR_NAME, satz: SATZ_NAME, pools: POOLS, sndvar: SND_VAR, datei: DATEI, kat: SHOP_KAT };

const css = readFileSync(join(ROOT, 'tools', 'tonpult_seite.css'), 'utf8') + readFileSync(join(ROOT, 'tools', 'tonpult3_seite.css'), 'utf8');
const js0 = readFileSync(join(ROOT, 'tools', 'tonpult_seite.js'), 'utf8'), MARKE = '// <<TONPULT3>>';
if (!js0.includes(MARKE)) throw new Error('Marke ' + MARKE + ' fehlt in tools/tonpult_seite.js');
const js = js0.replace(MARKE, () => readFileSync(join(ROOT, 'tools', 'tonpult3_seite.js'), 'utf8'));
const html = `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Armargeddon – Ton-Pult</title>
<style>
${css}</style></head>
<body>
<header>
  <h1>Armargeddon · Ton-Pult</h1>
  <div class="tabs" id="ansichten"><button data-a="einfach">Töne einstellen</button><button data-a="alle">Alle Töne</button><button data-a="kammer">Abstellkammer</button><button data-a="misch">Mischton bauen</button><button id="expKnopf" aria-expanded="false" title="Ton-Pult 2: Tabelle, Bibliothek, Einzelne Einheit">Experten ▾</button>
    <span id="expTabs" hidden><button data-a="tabelle">Tabelle</button><button data-a="bib">Bibliothek</button><button data-a="einzeln">Einzelne Einheit</button></span></div>
  <span id="status">Töne werden geladen (ca. 22 MB) …</span>
  <div class="hk">
    <button id="undo" disabled>↶ Rückgängig</button>
    <label class="regler">Effekte <input id="volEffekte" type="range" min="0" max="100" step="1"><b id="volEffekteW"></b></label>
    <button id="export">Export JSON</button><button id="import">Import</button><button id="allesZurueck">Alles zurücksetzen</button><button id="stopp" class="gold">■ Stopp</button>
  </div>
</header>
<div id="vEinfach" hidden></div><div id="vAlle" hidden></div><div id="vKammer" hidden></div><div id="vMisch" hidden></div>
<div id="vTabelle" hidden><div id="tKopf"></div><div class="ttw" id="tWrap"></div><div id="leiste"></div></div>
<div id="vBib" hidden></div>
<div class="wrap" id="vEinzeln" hidden>
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
