// ===== ARMARGEDDON ENGINE =====
// Reine Spiellogik ohne Browser. Läuft im Browser (window.E) und in Node (require).
(function (root) {
'use strict';

// ---------- Grundwerte (per Simulation abgestimmt) ----------
const P = {
  DMG: 0.61,
  ROAR_R: 2, ROAR_MOR: 2,   // Löwengebrüll des Kreuzschreiters (2026-11-20): einmal je Schlacht, kostet nichts; Gegner ohne Panzerung bis ROAR_R Felder: Moral −ROAR_MOR, niedergehalten bis zum Ende ihrer nächsten Runde
  FAUST_MUL: 2,
  SPRUNG: 2,   // Sprungangriff der Löwenoger (2026-11-20): Landefeld bis so viele Felder entfernt   // Faustsalve des Eisenknechts (2026-11-20): einmal je Schlacht statt des Schusses zwei Schüsse auf zwei verschiedene Ziele, je ×FAUST_MUL
  FLANK: 1.4, REAR: 1.8, VS_ROUT: 1.6, FREEBLOW: 1.0,   // FLANK/REAR nur für Fahrzeuge; FREEBLOW: Freischlag beim Rückzug, Stärke je Schlag (≈ 10 wie Stacheldraht, ±20 % Zufall, Paket 4)
  COUNTER: { front: 0.6, flank: 0.3, rear: 0 },
  MOR_PER_DMG: 0.8, MOR_FLANK: 0.5, MOR_REAR: 1, MOR_SURR: 1,
  FALLBACK_MOR: 3, ROUT_STR: 1.5,
  BREAK: { A: 0.55, D: 0.64 },   // D höher seit Aktionspunkten und Marsch (Angreifer kommt schneller heran)
  TRENCH_DEF: 1.6, CRATER_FIRE: 1.2, VILLAGE_DEF: 1.5, FOREST_DEF: 1.4, WIRE_DEF: 0.6,
  MG_VS_WIRE: 2, MG_VS_CAV: 2,
  AP: 1, ZOC_STOP: 1, GUIDED: 1.25, ORDER_MOR: 1.5, ORDER_ATK: 1.25,
  OFFICER_ATK: 1.15, OFFICER_MOR: 0.8, OFFICER_RANGE: 2, RALLY: 0.6,
  RECOVER: 0.5, RECOVER_COVER: 1,
  SUPP: 0.6, SUPP_ATK: 0.5,
  ART_MIN: 2, ART_MIN_GROSS: 3, BREAKER_WIRE: 0.8, SPOT: 4, SCATTER: 0.25, HE_WIRE: 0.5, HE_CRATER: 0.3, ART_DIRECT: 3, ART_VS_WALKER: 2.5,
  GAS_TTL: 3, GAS_STR: 0.5, GAS_MOR: 1.5, GAS_ATK: 0.7, WIND_SHIFT: 0.15,
  BREAKDOWN: 0.05, STUCK: 0.08, WALKER_FEAR: 1,
  CHARGE: 1.5, CHARGE_MIN: 3, CAV_VS_ROUT: 2, FLAME_HIT: 1.5, FLAME_MOR: 2,
  LIMBER_MV: 3,
  PTS_TURN: { A: 10, D: 10 }, PTS_KILL: 20, PTS_OBJ: 10, HEAL: 2.5, HEAL_MOR: 1.5,
  // Bewegung und Aktionen (Paket 1, seit Fahrplan 2 mit BP/AP): Marsch = Aktion für +50 % BP, Feuerbereitschaft, Aufbauen der MG, Abklingzeiten
  GOAL_K: 7, MAX_ROUNDS: 40, D_BAND: 6,
  // Kirche von Sankt Ruß (2026-11-19, entwurf/KARTE_SANKT_RUSS.md): Deckung ×1,8 und halber Moralverlust (nur Fußtruppen und Anführer kommen hinein);
  // Turm +1 Reichweite und +1 Sicht; Bauzustand KIRCHE_HP, jeder Treffer schwerer Waffen (Artillerie, Mörser, Kanonen der Kolosse) −1 (Minenwerfer −2);
  // bei 0 Einsturz: Kirche und Turm werden Ruine, wer drin ist, nimmt EINSTURZ_DMG Schaden und wird niedergehalten. GARTEN_DEF: Garten-/Friedhofsmauer gegen Beschuss
  EISBRUCH_DMG: 2.0, EISBRUCH_RUNDEN: 2, EISBRUCH_SPERR: 0.5,   /* Eis bricht ein (Enrico 2026-11-22 20:50): Schaden, Runden offen, Chance beim Sperrfeuer (Zielfeld) */
  KIRCHE_DEF: 1.8, KIRCHE_HP: 6, HAUS_DEF: 1.6, HAUS_HP: 3, KAPELLE_HP: 4, MUEHLE_HP: 3, SPERRE_DEF: 1.2,   /* G6 (2026-11-25): Windmühle, Panzersperre */   /* Winterdorf (2026-11-22): heile Häuser und Kapelle mit Bauzustand */ EINSTURZ_DMG: 2.5, TURM_RNG: 1, TURM_SPOT: 1, GARTEN_DEF: 1.2,
  OW_DMG: 0.8, MINE_DMG: 2.6, TUNNEL_DMG: 6, CHARGE_DMG: 3.2, HEAL_CD: 2, RALLY_CD: 3, STORM_CD: 2, RECOVER_CD: 2,
  // Gelände-Gefahren (2026-11-16): Stacheldraht kostet Stärke beim Betreten, Gas wirkt nach (vergiftet: ½, dann ¼ des Gasschadens), Sperrfeuer mit Abklingzeit
  WIRE_DMG: 1.0, POISON_TURNS: 2, POISON_K: [0.25, 0.5], BARRAGE_CD: 2,
  // Gruppe 1 (2026-11-16): MG-Sperrfeuer 2 Schüsse, Ziel markieren (bis zum nächsten eigenen Zug), Feuerschlag des Fernsprechtrupps
  SPERR_SHOTS: 2, STRIKE_SCATTER: 0.25,
  // Gruppe 2 Führung (2026-11-16): Feuer frei (Konkordat) ×1,25 Fernkampf, „Halten um jeden Preis“ Abwehr ×1,25, Banner aufgepflanzt 3 Felder
  FIRE_FREE: 1.25, NEBEL_IN: 0.5, NEBEL_AUS: 0.75, HOLD_DEF: 1.25,   // Nebelwand (2026-11-18): Beschuss auf Ziele im Nebel ×0,5, aus dem Nebel heraus ×0,75
  BANNER_R: 2, BANNER_R_PLANTED: 3,
  // Spieltest Runde 2, Paket 8 (2026-11-17): Pannen/Festfahren seltener (oben ≈ ⅓), dafür 3 eigene Runden; Befehle 1 Feld, 3× je Anführer; großer Befehl 3 Felder;
  // Gas 3 Runden Abklingzeit; Artillerie-Sperrfeuer höchstens 2× je Geschütz, Schaden ×0,7 eines Einzelschusses; Zweitwaffe (Seiten-MG, Turm-MG) ×0,5, Reichweite 2
  // Fahrplan 2 (2026-11-17): Schusswinkel für Fahrzeuge und Schreiter – Hauptwaffe ±60°, Seitenwaffen (Zweitwaffe, zweiter Schuss der Breitseite) vorn und seitlich bis 135°;
  // Drehen auf der Stelle kostet sie 1 Punkt je Runde (danach in derselben Runde frei)
  FZ_FAN: 60, ZWEIT_FAN: 135, DREH_BP: 1,
  // Fahrplan 2, Schritt 1 (2026-11-17): Bewegungspunkte (BP) und eine Aktion (AP) getrennt – Marsch +50 % BP für die Aktion; Nahkampf nur mit höchstens halb verbrauchten BP
  MARSCH_BP: 0.5, GENERAL_BP: 2, MELDER_BP: 2, MELDER_CD: 2,
  PANNE_RUNDEN: 3, ORDER_R: 1, ORDER_MAX: 3, BIG_R: 2, GAS_CD: 3, BARRAGE_MAX: 2, BARRAGE_DMG: 0.7, ZWEIT_MUL: 0.5,
  // Gruppe 3 Infanterie und Sturm (2026-11-16): Eingraben Abwehr ×1,3, Schilde vor Beschuss ×0,75 in den Nachbarfeldern, Sturmlauf bis 4 Felder geradeaus
  BALLON_SICHT_UNTEN: 4,   // F70: eingeholter Ballon sieht wie Fußtruppen 4 Felder (Enrico 2026-11-21)
  RAMM_BAU: 1, RAMM_SELBST: 0.6, RAMM_PANNE: 0.15, RUINE_FEST: 0.12,   // F79 Rammen (Bauschaden, eigener Schaden, Pannengefahr) und Trümmer (Festfahr-Gefahr)
  PZG_DMG: 1.8, PZG_RNG: 2, PZG_PANNE: 0.15,   // F80 Panzergranate: Schaden (gegen den Landkoloss etwa 20, wie früher die geballte Ladung), Reichweite, Pannengefahr
  ROLLEN_DMG: 2.4, ROLLEN_MOR: 1.5, ROLLEN_WAND: 1.5,   // F54 Sturmrollen (×10 in der Anzeige: 24 Schaden, Moral −15)
  ROLLEN_GRABEN: 0.3,
  KANTE_SANDSACK: 1.5, KANTE_MAUER: 1.7, KANTE_HECKE: 1.25,   // R3 (2026-11-26): Deckung an der Feldkante – nur gegen Beschuss über diese Kante (Rückweg KANTE_ALT)
  // U5a (2026-11-26) Schaden über Modelle, Rückweg MODELLSCHADEN_ALT: Feuerkraft-Kurve (kraft), ungedeckt ×OFFEN_MUL, Deckung über 1 ×DECK_STARK verstärkt, Splitter schwerer Waffen gegen Trupps im Offenen, Löwenmaul gegen Panzer, Furcht-Aura, Pannen 1 (schwer 2) Runden
  OFFEN_MUL: 1.4, DECK_STARK: 1.5, SPLITTER: 1.3, LOEWE_PZ: 2.2, FURCHT_MOR_U5: 1, PANNE_KURZ: 1, PANNE_LANG: 2, PANNE_SCHWER: 0.25, TRAEGER_WEG: 0.45, TRAEGER_SCHUETZE: 0.15,   // SP-2 84.4: Sturmrollen gegen Graben/Bunker/eingegraben – Schaden ×0,3, kein Wegstoßen, niedergehalten
  // Helden (2026-11-21, Vorschlag): Durchbruch der Roten Faust (Schaden, Moral, an der Wand ×ROLLEN_WAND), Standhaft-Aura (Moralverlust durch Beschuss ×FAUST_AURA neben ihr),
  // Hinrichtung des Kürassiers (Ziel unter HINRICHT_STR = 40 % Stärke, Enrico 17:03; vorher 30 %), Furcht-Aura (Gegner daneben zu Beginn ihrer Runde −FURCHT_MOR), Festfahren in Schlamm/Graben (STECKEN),
  // Fall eines Helden: ganze Seite −HELD_FALL_MOR Moral
  DURCH_DMG: 2.6, DURCH_MOR: 1.5, FAUST_AURA: 0.5, HINRICHT_STR: 4, FURCHT_MOR: 0.4, STECKEN: 0.3, HELD_FALL_MOR: 1,
  DIG_DEF: 1.3, AUSGRABEN_BP: 1, AUSGRABEN_AP: 1, SHIELDS: 0.75, RUSH: 4, BROADSIDE: 0.6, BLAST_LANCE: 1.5, GRANAT_NAH: 1.25, GRANAT_FERN: 0.85, HANDGR_DMG: 0.7, HANDGR_RNG: 2, SCHARF_INF: 1.6, KOPF_MOR: 1, FK_VS_WALKER: 1.25, ENTSETZ_BASIS: 0.08, ENTSETZ_MOR: 0.8, PZS_S: 3.5, PZS_L: 2, PZS_U: 0.6, PZS_LADUNGEN: 3, GEGENSTOSS: 1.25, GEGENSTOSS_VOR: 0.85,   /* F103 Rollen schärfen (2026-11-22) */   // F36: Ausgraben kostet die Aktion (Abstimmung siehe BERICHT)
  // Gruppe 4 (2026-11-17): Flammenstrahl setzt das Zielfeld bis zum nächsten eigenen Zug in Brand; Feuerschaden wie Draht, Kolosse halb
  FIRE_DMG: 1.0, FIRE_WALKER: 0.5
};

// Größe des Schlachtfelds: hängt von der gewählten Karte ab (useMap), Grauwall 16 × 10
let COLS = 16, ROWS = 10;
// Test-Schalter für die Simulation (im Browser leer)
const TOG = (typeof process !== 'undefined' && process.env) || {};

const SIDES = {
  A: { name: 'Konkordat von Valmor', short: 'Konkordat', edge: 0, dir: 1 },
  D: { name: 'Aschenwacht des Grauwalls', short: 'Aschenwacht', edge: 15, dir: -1 }
};

// Stufe-3-Schreiter (2026-11-19): Kreuzschreiter und Eisenknecht, höchstens einer je Seite und Schlacht (armyOk, canBuy: auch nicht nachkaufen, wenn er gefallen ist).
const TYPES = {
  kohorte: { side: 'A', name: 'Schützenkohorte', cls: 'inf', dig: true, atk: 4, def: 4, mor: 7, mv: 3, rng: 2, fs: 2,
    can: 'Schießt 2 Felder weit, stürmt Gräben im Nahkampf, schneidet Draht. Eingraben (Aktion, im offenen Gelände oder Trichter): Abwehr ×1,3; zum Ziehen erst ausgraben (Aktion).',
    chronik: { quelle: 'Feldtagebuch eines Korporals, Grauwall, 115 n. G.', text: 'Wir graben uns tief in den zähen Schlamm, halten den Feind auf mittlere Distanz nieder und zerschneiden im Dunkeln seinen Stacheldraht. Wenn der Pfiff ertönt, bleibt nur der Sprung in den gegnerischen Graben mit aufgepflanztem Bajonett.' } },
  mahlwerk: { side: 'A', name: 'Mahlwerk-Trupp', cls: 'mg', atk: 2, def: 3, mor: 7, mv: 2, rng: 3, fs: 5, mg: true,
    can: 'Maschinengewehr, 3 Felder weit. Wer zieht, schießt nicht. Sperrfeuer (Aktion und alle Bewegungspunkte, aufgebaut und unbewegt): schießt in der gegnerischen Runde bis zu 2-mal auf Gegner, die sich im Schussfeld im Offenen bewegen.',
    chronik: { quelle: 'Ausbildungsvorschrift der Kronarmee, Punkt 14', text: 'Das schwere Maschinengewehr beherrscht weite Abschnitte des Niemandslands, doch im Marsch schweigt die Waffe. Erst wenn der Dreifuß fest im Schlamm verankert ist, beginnt das unaufhörliche Hämmern.' } },
  haubitze: { side: 'A', name: 'Donnerrohr-Batterie', cls: 'art', limber: true, atk: 0, def: 3, mor: 6, mv: 1, rng: 6, fs: 5, gas: 2,
    can: 'Mittlere Artillerie, kein direkter Schuss. Schießt über eigene Truppen hinweg, wenn eine eigene Einheit das Ziel sieht. Sprenggranaten, Sperrfeuer oder Gas; gegen Fahrzeuge und Schreiter nur ×0,5. Aufgeprotzt zieht sie 3 Felder, kann dann aber nicht feuern. Im Nahkampf wehrlos.',
    chronik: { quelle: 'Richtlinien für Artilleriebeobachter, Sankt Ruß', text: 'Die Bedienungen der Donnerrohre sehen den Feind nie, sondern feuern in hohem Bogen über die eigenen Gräben hinweg. Solange vorn ein Späher das Ziel meldet, schlagen ihre Granaten erbarmungslos hinter jeder Deckung ein.' } },
  koloss: { side: 'A', name: 'Landkoloss', cls: 'walker', abil: 'rollen', keinNah: true, zweit: { name: 'Seiten-MG', rng: 2, seiten: true }, atk: 6, def: 7, mor: 8, mv: 2, rng: 2, fs: 4,
    can: 'Gepanzert: Gewehre und MG prallen ab, kein Gas. Walzt Draht nieder, überquert Gräben. Kanone vorn, Seiten-MG (2 Felder, einmal je Runde zusätzlich) nach links und rechts. Kein Nahkampf, dafür Sturmrollen: ein schwerer Aufprall auf Fußtruppen oder Geschütz daneben oder 2 Felder geradeaus; im Graben nur Schock, kein Wegstoßen (Aktion und alle Bewegung, höchstens alle 3 Runden). Selten Panne: 1 Runde aus (schwer 2).',
    chronik: { quelle: 'Verhörprotokoll eines Gefangenen der Aschenwacht', text: 'Gewehrkugeln und MG-Garben prallen funkenschlagend an der dicken Stahlhaut ab, und Giftgas dringt nicht durch die Luken. Unaufhaltsam walzt der Koloss Stacheldraht nieder und überquert selbst breite Gräben unter ohrenbetäubendem Rasseln.' } },
  sturmpz: { side: 'D', name: 'Sturmpanzer', cls: 'walker', abil: 'rollen', keinNah: true, broadside: true, zweit: { name: 'Bord-MG', rng: 2, seiten: true }, atk: 6, def: 7, mor: 8, mv: 2, rng: 2, fs: 4,
    can: 'Gepanzert: Gewehre und MG prallen ab, kein Gas. Walzt Draht nieder, überquert Gräben, selten Panne. Breitseite: nach dem ersten Schuss ein zweiter auf ein anderes Ziel bis 2 Felder, beide ×0,6 (eine Aktion). Bord-MG der Bordschützen (2 Felder, einmal je Runde zusätzlich) nach links und rechts. Kein Nahkampf, dafür Sturmrollen: ein schwerer Aufprall auf Fußtruppen oder Geschütz daneben oder 2 Felder geradeaus; im Graben nur Schock, kein Wegstoßen (Aktion und alle Bewegung, höchstens alle 3 Runden).',
    chronik: { quelle: 'Werksbericht der Hochöfen von Karden-Ost', text: 'Gas dringt nicht durch seine Luken, Gewehrkugeln prallen ab, und selbst Stacheldraht oder Gräben halten den Koloss nur selten mit einer Panne auf. Im Gefecht feuert er verheerende Breitseiten gleichzeitig auf zwei Ziele.' } },
  reiter: { side: 'A', name: 'Lanzenreiter', cls: 'cav', atk: 5, def: 2, mor: 7, mv: 4, rng: 0, fs: 0,
    can: 'Sehr schnell. Ansturm nach 3 Feldern ×1,5, gegen Fliehende ×2. Kommt nicht durch Draht und Totholz. MG-Feuer trifft doppelt.',
    chronik: { quelle: 'Brief eines Leutnants aus Krähenfurt', text: 'Wo der Boden trägt, preschen die Schwadronen schneller vor als jede andere Truppe des Westlichen Konvents. Gerät eine feindliche Linie ins Wanken, verwandelt ihr wuchtiger Lanzenangriff den Rückzug in ein Gemetzel.' } },
  grenadier: { side: 'D', name: 'Aschengrenadiere', cls: 'inf', dig: true, atk: 4, def: 4, mor: 7, mv: 3, rng: 2, fs: 2,
    can: 'Schießt 2 Felder weit, hält Gräben und Ruinen, schneidet Draht. Eingraben (Aktion, im offenen Gelände oder Trichter): Abwehr ×1,3; zum Ziehen erst ausgraben (Aktion).',
    chronik: { quelle: 'Feldpostbrief aus den Gräben vor Grauwall', text: 'Mit Spaten, Drahtzangen und Gewehren krallen wir uns in zerschossene Gräben und Ruinen fest. Kommt der Feind auf Sprungweite heran, entscheiden geballte Handgranaten den Kampf im Schlamm.' } },
  sense: { side: 'D', name: 'Sensenwerk-Trupp', cls: 'mg', atk: 2, def: 3, mor: 7, mv: 2, rng: 3, fs: 5, mg: true,
    can: 'Maschinengewehr, 3 Felder weit. Wer zieht, schießt nicht. Sperrfeuer (Aktion und alle Bewegungspunkte, aufgebaut und unbewegt): schießt in der gegnerischen Runde bis zu 2-mal auf Gegner, die sich im Schussfeld im Offenen bewegen.',
    chronik: { quelle: 'Ausbildungsvorschrift der Aschenwacht, Abschnitt 9', text: 'Solange das schwere Sensenwerk-MG geschleppt wird, bleibt sein Lauf kalt und stumm. Erst fest im Dreck verankert, mäht sein Dauerfeuer auf weite Distanz alles nieder.' } },
  geschuetz: { side: 'D', name: 'Grabengeschütz', cls: 'art', limber: true, atk: 0, def: 3, mor: 6, mv: 1, rng: 6, fs: 5, gas: 1,
    can: 'Mittlere Artillerie. Schießt über eigene Truppen hinweg, wenn eine eigene Einheit das Ziel sieht. Steilfeuer trifft Fahrzeuge und Schreiter nur ×0,5, der direkte Schuss bis 3 Felder dagegen ×2,5. Aufgeprotzt zieht es 3 Felder, kann dann aber nicht feuern. Im Nahkampf wehrlos.',
    chronik: { quelle: 'Artillerie-Merkblatt, Frontabschnitt Sankt Ruß', text: 'Hinter der eigenen Linie eingegraben, feuern die Grabengeschütze im Steilfeuer über die Köpfe unserer Truppen hinweg. Sobald ein Späher vorn ein Ziel meldet, schlagen die Granaten ein.' } },
  sturm: { side: 'D', name: 'Sturmbrecher', cls: 'storm', cutter: true, abil: 'pzgranate', atk: 6, def: 5, mor: 9, mv: 3, rng: 0, fs: 0,
    can: 'Sickert durch: Gegner halten ihn nicht auf. Schneidet Draht vom Nachbarfeld aus (Aktion). Handgranaten heben den Grabenschutz auf. Panzergranate (Aktion, alle 2 Runden): 1–2 Felder gegen Fahrzeuge und Schreiter.',
    chronik: { quelle: 'Tagebuch eines Stoßtruppführers, 115 n. G.', text: 'Wie Schatten sickern die Sturmbrecher durch Lücken in der feindlichen Front und zerschneiden im Rücken der Verteidiger den Draht. Stählerne Kolosse knacken sie aus nächster Nähe mit schweren Panzergranaten.' } },
  brand: { side: 'D', name: 'Brandwerfer', cls: 'flame', atk: 2, def: 3, mor: 7, mv: 2, rng: 2, fs: 7, flame: true,
    can: 'Flammenstrahl bis 2 Felder weit (F81), auch in Feindberührung auf ein Nachbarfeld. Deckung schützt nicht, doppelter Moralverlust. Das Feld brennt bis zum nächsten eigenen Zug: wer dort steht oder hineinzieht, nimmt Feuerschaden, Draht verbrennt. Wird er beschossen, trifft es ihn ×1,5.',
    chronik: { quelle: 'Verhörprotokoll eines Gefangenen des Westlichen Konvents', text: 'Ihr brennendes Öl kriecht bis in die tiefsten Unterstände, wo weder Sandsack noch Beton Schutz bieten. Der Gestank verbrannten Fleisches raubt ganzen Zügen sofort den letzten Rest an Kampfmoral.' } }
};

Object.assign(TYPES, {
  feldscher: { side: 'A', name: 'Feldscher', cls: 'medic', atk: 1, def: 2, mor: 6, mv: 3, rng: 0, fs: 0,
    can: 'Versorgt statt eines Angriffs eine eigene Nachbareinheit: Stärke +15 und Moral +10, heilt auch Vergiftung. Kaum Kampfkraft.',
    chronik: { quelle: 'Lazarettbericht hinter der Front, 116 n. G.', text: 'Mit blutverschmierter Schürze und Gegengift-Ampullen kriecht der Feldscher von Trichter zu Trichter, statt selbst zur Waffe zu greifen. Er kann sich im Gefecht kaum wehren, rettet aber verätzte und verwundete Kameraden dicht neben sich vor dem sicheren Tod.' } },
  moerser: { side: 'A', name: 'Grabenmörser', cls: 'art', fig: 'mortar', mobile: true, abil: 'smoke', atk: 0, def: 3, mor: 6, mv: 2, rng: 4, fs: 4, gas: 0,
    can: 'Mörser: leichte Steilfeuerwaffe, 4 Felder weit. Sprenggranaten oder Sperrfeuer; gegen Fahrzeuge und Schreiter nur ×0,5. Rauchmunition statt des Schusses: Nebelwand auf ein Feld bis 3 Felder und seine Nachbarn (alle 3 Runden). Kann in derselben Runde ziehen und feuern.',
    chronik: { quelle: 'Soldatenlied aus den Gräben vor Grauwall', text: 'Steil in den grauen Himmel geschossen, fallen die leichten Mörsergranaten direkt in feindliche Deckungen. Wenn die Kohorten vorgehen, legen dieselben Rohre eine Wand aus beißendem Nebel vor die feindlichen Gewehre.' } },
  heiler: { side: 'D', name: 'Aschenpfleger', cls: 'medic', atk: 1, def: 2, mor: 6, mv: 3, rng: 0, fs: 0,
    can: 'Versorgt statt eines Angriffs eine eigene Nachbareinheit: Stärke +15 und Moral +10, heilt auch Vergiftung. Kaum Kampfkraft.',
    chronik: { quelle: 'Predigt der Grauen Liturgie im Feldlazarett', text: 'Ohne nennenswerte Bewaffnung folgen die Aschenpfleger den Stoßtrupps direkt in den Granathagel. Statt selbst zu kämpfen, verbinden sie Verwundete und spülen Lungen voller Giftgas aus.' } },
  minenwerfer: { side: 'D', name: 'Minenwerfer', cls: 'art', fig: 'mortar', mobile: true, noMoveFire: true, heMul: 1.5, breaker: true, atk: 0, def: 3, mor: 6, mv: 2, rng: 4, fs: 4, gas: 0,
    can: 'Mörser: schwere Wurfminen, 4 Felder weit. Sprenggranaten ×1,5 (gegen Fahrzeuge und Schreiter nur halb) und zerstören Draht und Barrikaden im Zielfeld; auch Sperrfeuer. Ziehen oder feuern, nicht beides in einer Runde.',
    chronik: { quelle: 'Grabenlied aus den Trichtern vor Grauwall', text: 'Schwerfällig taumeln die dicken Wurfminen durch den grauen Himmel, ehe sie mit dumpfem Grollen einschlagen. Ihre Druckwelle zerreißt Stacheldraht sowie Barrikaden oder legt ein dichtes Sperrfeuer über das Feld.' } }
});

// Weitere Truppen für die Armee-Auswahl und den Nachschub
Object.assign(TYPES, {
  lanzeD: { side: 'D', name: 'Sprenglanzen-Reiter', cls: 'cav', blastLance: true, atk: 5, def: 2, mor: 7, mv: 4, rng: 0, fs: 0,
    can: 'Sehr schnell. Ansturm nach 3 Feldern ×1,5, gegen Fliehende ×2. Der erste Nahkampfangriff der Schlacht mit der Sprenglanze ×1,5, danach normale Lanze. Kommt nicht durch Draht und Totholz. MG-Feuer trifft doppelt.',
    chronik: { quelle: 'Brief eines Rittmeisters, Krähenfurt, 116 n. G.', text: 'Auf gepanzerten Rössern preschen diese Reiter schneller über gefrorenen Boden als jede Infanterie. Beim ersten Aufprall zündet die Sprenglanze an der Spitze und reißt eine blutige Bresche in den Feind.' } },
  scharf: { side: 'A', name: 'Scharfschütze', cls: 'inf', fig: 'sniper', pin: true, atk: 1, def: 2, mor: 6, mv: 3, rng: 4, fs: 3,
    can: 'Schießt 4 Felder weit. Jeder Treffer hält das Ziel nieder. Im Nahkampf fast wehrlos.',
    chronik: { quelle: 'Befehl an alle Offiziere im Frontabschnitt', text: 'Aus verborgenen Nestern nimmt der Scharfschütze Ziele auf weite Distanz ins Visier. Schon ein einziger Schuss zwingt ganze Trupps in den Dreck und lässt niemanden mehr den Kopf heben.' } },
  melder: { side: 'A', name: 'Meldegänger mit Hund', cls: 'inf', fig: 'dog', courier: true, atk: 2, def: 2, mor: 7, mv: 5, rng: 0, fs: 0,
    can: 'Schnell (5 Felder). Befehl überbringen: einmal je Runde bekommt eine eigene Einheit bis 3 Felder +2 Bewegungspunkte, zum Beispiel für einen weiteren Zug. Kaum Kampfkraft.',
    chronik: { quelle: 'Tagesbefehl des Stabs, 114 n. G.', text: 'Wo Feldleitungen im Trommelfeuer zerreißen, rasen Meldegänger und abgerichtete Hunde durch Granattrichter und Rauch. Ihr Eintreffen treibt erschöpfte Einheiten sofort zu einem weiteren Gewaltmarsch an.' } },
  pionier: { side: 'A', name: 'Graben-Pioniere', cls: 'inf', cutter: true, fig: 'sapper', sapper: true, recover: true, abil: 'charge', atk: 4, def: 3, mor: 7, mv: 3, rng: 2, fs: 2,
    can: 'Schneidet Draht vom Nachbarfeld aus (Aktion). Haftladung an ein Nachbarfeld (Aktion, alle 2 Runden): schwerer Schaden, doppelt gegen Kolosse (dazu 50 % Panne); Bunker und Barrikaden werden Trichter, Draht wird zerrissen. Bergt festgefahrene Fahrzeuge.',
    chronik: { quelle: 'Aus dem Nachlass eines Pioniers', text: 'Mit schweren Zangen bahnen sie Gassen durch den Stacheldraht, während um sie herum die Erde bebt. Auf Armeslänge pressen sie ihre geballten Haftladungen an Bunkerwände und stählerne Kolosse, bis der Stahl birst.' } },
  raeumer: { side: 'A', name: 'Grabenräumer', cls: 'storm', cutter: true, abil: 'pzgranate', fig: 'raider', atk: 6, def: 4, mor: 8, mv: 3, rng: 0, fs: 0,
    can: 'Nahkämpfer ohne Gewehr. Schneidet Draht vom Nachbarfeld aus (Aktion). Sickert durch: Gegner halten ihn nicht auf. Handgranaten heben den Grabenschutz auf. Panzergranate (Aktion, alle 2 Runden): 1–2 Felder gegen Fahrzeuge und Schreiter.',
    chronik: { quelle: 'Grabeninschrift in den Ruinen von Sankt Ruß', text: 'In den engen, verwinkelten Gängen taugen lange Gewehre nichts, also tragen diese Männer nur Keulen, Messer und Drahtzangen. Sie schneiden Gassen durch Verhaue und stürzen sich lautlos in den tödlichen Kampf Mann gegen Mann.' } },
  buechse: { side: 'D', name: 'Panzerbüchsen-Trupp', cls: 'inf', fig: 'atr', at: true, atk: 2, def: 3, mor: 7, mv: 2, rng: 3, fs: 3,
    can: 'Schießt 3 Felder weit. Panzerbrechend: gegen Fahrzeuge und Schreiter ×1,5, gegen Fußtruppen nur ×0,5.',
    chronik: { quelle: 'Schießvorschrift der Panzerjäger-Kompanien', text: 'Gegen einzelne Schützen taugt das überlange, unhandliche Gewehr kaum im Gefecht. Doch auf mittlere Distanz durchschlagen seine schweren Stahlkerngeschosse selbst dicke Panzerplatten und Schreit-Maschinen.' } },
  schwer: { side: 'D', name: 'Schwere Grabenwacht', cls: 'inf', fig: 'heavy', wireProof: true, shieldWall: true, atk: 4, def: 6, mor: 8, mv: 2, rng: 0, fs: 0,
    can: 'Schild und Streitkolben: sehr zäh, langsam, nur Nahkampf. Draht verletzt und hält nicht auf. Schilde vor (Aktion): eigene Nachbarn nehmen bis zum nächsten eigenen Zug Beschuss ×0,75.',
    chronik: { quelle: 'Befehl zur Verteidigung von Sankt Ruß', text: 'Langsam, aber zäh wie Ambosse schreiten sie mit eisenbeschlagenen Streitkolben durch Stacheldraht, als wäre er Spinnweb. Im Beschuss verketten sie ihre schweren Turmschilde zu einer Wand, die auch Kameraden daneben deckt.' } },
  signal: { side: 'D', name: 'Signaltrupp', cls: 'inf', fig: 'signal', spot: 6, relay: true, abil: 'mark', atk: 2, def: 2, mor: 7, mv: 3, rng: 0, fs: 0,
    can: 'Ziel markieren (Aktion): ein Feld in Sicht (bis 6 Felder) bis zu deinem nächsten Zug; eigener Beschuss dorthin ×1,25 ohne Streuung, getarnte Gegner und Minen dort und daneben werden sichtbar. Anführer bis 3 Felder können ihre Befehle eine Runde früher wieder geben. Kaum Kampfkraft.',
    chronik: { quelle: 'Funk- und Beobachtungsbericht, Abschnitt Mitte', text: 'Grell brennende Leuchtkugeln tauchen das Niemandsland in fahles Licht und entlarven verborgene Schützen wie versteckte Minen. Gleichzeitig weisen die Rauchzeichen der eigenen Artillerie das nächste Ziel.' } },
  saeger: { side: 'D', name: 'Sägeschreiter', cls: 'walker', fig: 'mechA', mech: true, gat: true, atk: 7, def: 7, mor: 8, mv: 2, rng: 2, fs: 4,
    can: 'Schreitende Kampfmaschine mit Drehlauf-Waffe und Kreissäge. Gepanzert wie ein Landkoloss: Gewehre und MG prallen ab. Bleibt manchmal mit einer Panne liegen.',
    chronik: { quelle: 'Schmiedepredigt vor dem Ausrücken, 114 n. G.', text: 'Gewehrfeuer prallt funkend von seiner geweihten Panzerung ab, während die Drehlauf-Waffe den Weg freischießt. Im Nahkampf frisst sich seine kreischende Kreissäge durch Holz, Fleisch und Stahl.' } },
  klaue: { side: 'D', name: 'Klauenschreiter', cls: 'walker', fig: 'mechB', mech: true, gat: true, atk: 6, def: 7, mor: 8, mv: 2, rng: 3, fs: 4,
    can: 'Schreitende Kampfmaschine mit Maschinenwaffe und Greifklaue. Gepanzert wie ein Landkoloss: Gewehre und MG prallen ab. Bleibt manchmal mit einer Panne liegen.',
    chronik: { quelle: 'Werksprotokoll der Eisenhütte Sieben', text: 'Gepanzert gegen Gewehr- und MG-Garben stapft diese Kampfmaschine ungerührt durch das Sperrfeuer der Gräben. Während ihre Maschinenwaffe Deckungen zersiebt, zermalmt die hydraulische Greifklaue jeden Gegner auf Armeslänge.' } },
  turm: { side: 'A', name: 'Turmschreiter', cls: 'walker', zweit: { name: 'Turm-MG', rng: 2 }, fig: 'mechT', mech: true, atk: 6, def: 7, mor: 8, mv: 2, rng: 3, fs: 4,
    can: 'Schreitende Kampfmaschine: Kanone, dazu Turm-MG (2 Felder, einmal je Runde zusätzlich). Gepanzert: Gewehre und MG prallen ab. Selten Panne: 1 Runde aus (schwer 2).',
    chronik: { quelle: 'Werkstattprotokoll der Kronkirche, 113 n. G.', text: 'Auf stählernen Beinen stapft der gepanzerte Schreiter durch Trichterfelder, während Gewehr- und MG-Feuer wirkungslos an ihm abprallen. Sein drehbarer Turm bekämpft mit einer schweren Kanone feste Ziele und hält Infanterie mit dem Maschinengewehr nieder.' } },
  orden: { side: 'A', name: 'Ordensschreiter', cls: 'walker', fig: 'mechK', mech: true, gat: true, atk: 7, def: 7, mor: 8, mv: 2, rng: 2, fs: 4,
    can: 'Kampfmaschine in Ritterrüstung mit Drehlauf-Waffe und Kettensäge. Stark auf kurze Entfernung und im Nahkampf. Bleibt manchmal mit einer Panne liegen.',
    chronik: { quelle: 'Predigt vor dem Ausrücken, Kronkirche', text: 'Geweihte Panzerplatten in Form alter Ritterrüstungen schützen diese Kampfmaschine auf dem Weg direkt in die feindliche Linie. Auf kurze Distanz zersiebt ihre Drehlauf-Waffe jede Deckung, ehe die kreischende Kettensäge im Nahkampf den Rest besorgt.' } },
  kreuz: { side: 'A', name: 'Kreuzschreiter', cls: 'walker', stufe3: true, roar: true, at: true,   /* Löwenmaul-Kanone panzerbrechend wie die Panzerbüchse (Faktortabelle FAK.at) */ zweit: { name: 'Unterarm-Kanone', rng: 2, kanone: true }, fig: 'mechC', mech: true, atk: 8, def: 9, mor: 9, mv: 3, rng: 2, fs: 5,
    can: 'Stufe 3, höchstens einer je Schlacht. Panzerjäger: Löwenmaul-Kanone panzerbrechend (Fahrzeuge und Schreiter ×1,5, Fußtruppen nur ×0,5, trifft die Kirche) und Kriegshammer (gegen Fußtruppen im Nahkampf ×1,5); am zähesten von allen, Bewegung 3. Unterarm-Kanone (2 Felder, einmal je Runde zusätzlich, ebenfalls panzerbrechend). Löwengebrüll (einmal je Schlacht, kostenlos): Gegner ohne Panzerung bis 2 Felder Moral −20 und niedergehalten. Selten Panne.',
    chronik: { quelle: 'Chronik der 2. Inselgarde, 115 n. G.', text: 'Nur ein einziger dieser gewaltigen Panzerjäger schreitet je aufs Feld, bewaffnet mit der Löwenmaul-Kanone und einem Kriegshammer. Wenn sein metallenes Löwengebrüll über den Schlamm grollt, verlässt selbst abgehärtete Veteranen der Mut.' } },
  stahl: { side: 'A', name: 'Stahlgänger-Trupp', cls: 'inf', fig: 'suitA', mech: true, suit: true, abil: 'rush', atk: 5, def: 5, mor: 8, mv: 3, rng: 2, fs: 3,
    can: 'Motorisierte Kampfanzüge. Leicht gepanzert: Gewehr, MG und Klingen treffen nur ×0,5, panzerbrechende Waffen ×1,5. Draht verletzt und hält nicht auf. Sturmlauf (Aktion und alle BP): bis 4 Felder geradeaus, dann sofort Nahkampf. Stark im Nahkampf.',
    chronik: { quelle: 'Bericht eines Überlebenden von Krähenfurt', text: 'Aus dem Rauch tauchen Gestalten in motorisierten Kampfanzügen auf, deren Gasmasken-Gläser unheimlich glühen. Leicht gepanzert, aber erstaunlich beweglich, überrennen sie im schnellen Sturmlauf ganze Grabenabschnitte.' } },
  // Neue Einheiten im Stil Retro-Zukunft (2026-11-20, Bögen ui-quelle/figuren/konkordat_loewenoger.png, aschenwacht_eiserne_huenen.png);
  // fig = alte Ersatzzeichnung (Grabenräumer bzw. Panzerknecht), nur solange die neuen Bilder laden (ui.js FIGMAP)
  oger: { side: 'A', name: 'Löwenoger', cls: 'storm', fig: 'raider', abil: 'sprung', atk: 8, def: 5, mor: 9, mv: 4, rng: 1, fs: 6,
    can: 'Riesige Krieger mit Löwenköpfen: schnell, im Nahkampf sehr stark (Pranken gegen Fußtruppen ×1,5, gegen Panzer ×1). Leicht gepanzert: Gewehr, MG und Klingen treffen nur ×0,5, panzerbrechende Waffen ×1,5. Schrotflinte nur auf 1 Feld (gegen Fußtruppen ×1,5, an Panzern wirkungslos). Gegner halten ihn nicht auf. Sprungangriff (Aktion und alle BP, alle 2 Runden, nur aus dem Stand): bis 2 Felder neben einen Gegner, auch über Draht und Gräben, sofort Nahkampf.',
    chronik: { quelle: 'Geheimakte „Projekt Mähne“, Kronkirche', text: 'In rostige Platten und Ketten geschlagen, setzen diese gezüchteten Bestien mit gewaltigen Sprüngen über Hindernisse hinweg. Aus nächster Nähe fegen ihre schweren Schrotflinten und Klauen ganze Stellungen leer, ehe man sie wieder anketten muss.' } },
  huenen: { side: 'D', name: 'Eiserne Hünen', cls: 'inf', fig: 'suitD', suit: true, mgfire: true, pin: true, dauerfeuer: true, atk: 5, def: 6, mor: 9, mv: 2, rng: 3, fs: 7,
    can: 'Riesen in Rüstung mit schwerem MG aus der Hüfte (3 Felder, kein Aufbauen, jeder Treffer hält nieder). Langsam. Leicht gepanzert: Gewehr, MG und Klingen treffen nur ×0,5, panzerbrechende Waffen ×1,5. Draht hält nicht auf. Stark im Nahkampf. Dauerfeuer: eine zweite Salve in derselben Runde, danach eine eigene Runde kein Schuss.',
    chronik: { quelle: 'Verhörprotokoll eines Gefangenen bei Krähenfurt', text: 'Schwerfällig stampfen die gepanzerten Riesen voran und feuern schwere Maschinengewehre aus der Hüfte, sodass jeder Treffer den Feind niederhält. Nach einer verheerenden Dauerfeuer-Salve müssen die glühenden Läufe erst abkühlen.' } },
  // Helden (2026-11-21): Einzelmodell, höchstens einer je Armee und Schlacht (auch wenn er gefallen ist); Aura, Spezialschlag, klare Schwäche; fällt er, verliert die Seite Moral
  faust: { side: 'A', name: 'Die Rote Faust', cls: 'storm', fig: 'suitA', suit: true, held: true, abil: 'durchbruch', aura: 'standhaft', atk: 9, def: 6, mor: 10, mv: 3, rng: 1, fs: 2,
    can: 'Held, höchstens einer je Armee: Oberst im Kampfanzug mit dampfgetriebener Schlagfaust. Leicht gepanzert: Gewehr, MG und Klingen treffen nur ×0,5, panzerbrechende Waffen ×1,5. Im Nahkampf sehr stark. Durchbruch (Aktion und alle BP, alle 2 Runden): stürmt in eine Einheit daneben oder mit Anlauf (nur aus dem Stand) bis 2 Felder geradeaus (keine Panzer oder Schreiter) – bis 26 Schaden, gegen Gepanzerte weniger, Moral −15, niedergehalten, sie wird ein Feld zurückgeschleudert (an einer Wand ×1,5). Standhaft: er selbst und eigene Einheiten neben ihm verlieren unter Beschuss nur halb so viel Moral. Schwäche: kaum Fernkampf (Revolver, 1 Feld). Fällt er, verliert die ganze Seite Moral (−10).',
    chronik: { quelle: 'Tagesbefehl des Westlichen Konvents, 116 n. G.', text: 'Der Oberst schreitet in seinem Kampfanzug voran, während der Rückenofen Dampf in die rot emaillierte Schlagfaust presst. Sein wuchtiger Durchbruch sprengt feindliche Reihen, und Soldaten an seiner Seite weichen keinen Schritt zurück.' } },
  kuerass: { side: 'D', name: 'Der Eiserne Kürassier', cls: 'storm', fig: 'suitD', suit: true, held: true, abil: 'hinrichtung', aura: 'furcht', stecken: true, atk: 10, def: 8, mor: 10, mv: 2, rng: 0, fs: 0,
    can: 'Held, höchstens einer je Armee: riesiger gepanzerter Ritter mit Kettenklinge. Leicht gepanzert: Gewehr, MG und Klingen treffen nur ×0,5, panzerbrechende Waffen ×1,5. Im Nahkampf sehr stark. Hinrichtung (Aktion, alle 3 Runden): eine angeschlagene Einheit daneben (unter 40 Stärke, keine Panzer oder Schreiter) wird sofort vernichtet. Furcht: Gegner neben ihm (keine Fahrzeuge oder Schreiter) verlieren zu Beginn ihrer Runde Moral (−4), höchstens bis 5; das allein löst keine Flucht aus. Schwäche: langsam (2 Bewegung), kein Fernkampf, bleibt in Schlamm, Sumpf und Gräben leicht stecken (30 %, dann eine Runde fest). Fällt er, verliert die ganze Seite Moral (−10).',
    chronik: { quelle: 'Chronik der Grauen Liturgie, 116 n. G.', text: 'In geweihten Hochofenstahl gehüllt, verbreitet er blanke Furcht und richtet geschwächte Feinde mit seiner kreischenden Kettenklinge hin. Doch sein gewaltiges Gewicht lässt ihn in tiefem Schlamm und Gräben immer wieder steckenbleiben.' } },
  panzerk: { side: 'D', name: 'Panzerknechte', cls: 'inf', fig: 'suitD', mech: true, suit: true, abil: 'rush', atk: 5, def: 5, mor: 8, mv: 3, rng: 2, fs: 3,
    can: 'Motorisierte Kampfanzüge. Leicht gepanzert: Gewehr, MG und Klingen treffen nur ×0,5, panzerbrechende Waffen ×1,5. Draht verletzt und hält nicht auf. Sturmlauf (Aktion und alle BP): bis 4 Felder geradeaus, dann sofort Nahkampf. Stark im Nahkampf.',
    chronik: { quelle: 'Aus dem Notizbuch eines Zugführers', text: 'Leicht gepanzerte, motorisierte Kampfanzüge verleihen diesen Stoßtruppen die Kraft für schnelle Sturmläufe über das Trichterfeld. Mit schweren Zangen schneiden sie im Lauf Gassen durch den Stacheldraht.' } },
  flammen: { side: 'A', name: 'Flammentrupp', cls: 'flame', fig: 'flamer', atk: 2, def: 3, mor: 7, mv: 2, rng: 2, fs: 7, flame: true,
    can: 'Flammenstrahl bis 2 Felder weit (F81), auch in Feindberührung auf ein Nachbarfeld. Deckung schützt nicht, doppelter Moralverlust. Das Feld brennt bis zum nächsten eigenen Zug: wer dort steht oder hineinzieht, nimmt Feuerschaden, Draht verbrennt. Wird er beschossen, trifft es ihn ×1,5.',
    chronik: { quelle: 'Verhörprotokoll nach dem Gefecht, Grauwall', text: 'Unter dem Druck ihrer Rückentanks schießt flüssiges Feuer bis in die hintersten Winkel von Bunkern und Gräben. Keine Deckung schützt vor der Hitze, und die Schreie der Brennenden brechen den Kampfwillen ganzer Kompanien.' } },
  schildwall: { side: 'A', name: 'Schildwall', cls: 'inf', fig: 'shieldA', shieldWall: true, atk: 4, def: 6, mor: 8, mv: 2, rng: 0, fs: 0,
    can: 'Schwer gepanzert und langsam. Gut, um Gräben und Ruinen zu halten, die man genommen hat. Keine Schusswaffe. Schilde vor (Aktion): eigene Einheiten in den Nachbarfeldern nehmen bis zum nächsten eigenen Zug Beschuss ×0,75.',
    chronik: { quelle: 'Befehl zur Verteidigung von Sankt Ruß', text: 'Ohne Schusswaffen, aber hinter mannshohen Stahlschilden verschanzt, rücken diese schwer gepanzerten Männer nur langsam vor. Einmal in einem eroberten Graben oder einer Ruine postiert, sind sie kaum noch daraus zu vertreiben.' } },
  feldkanone: { side: 'A', name: 'Feldkanone', cls: 'art', fig: 'fgun', limber: true, atk: 0, def: 3, mor: 6, mv: 1, rng: 5, fs: 5,
    can: 'Leichte Artillerie: 5 Felder Reichweite, kein Gas. Direkter Schuss bis 3 Felder trifft Kolosse und Kampfmaschinen ×2,5. Aufgeprotzt zieht sie 3 Felder. Im Nahkampf wehrlos.',
    chronik: { quelle: 'Handbuch der leichten Geschützbrigaden', text: 'Die beweglichen Geschütze schießen im direkten Richten auf weite Distanz über das offene Feld. Ihre Wuchtgeschosse durchschlagen selbst die Panzerung anrückender Landkolosse und Schreit-Maschinen.' } },
  fernsprech: { side: 'A', name: 'Fernsprechtrupp', cls: 'inf', fig: 'phone', spot: 6, relay: true, abil: 'strike', atk: 2, def: 2, mor: 7, mv: 3, rng: 0, fs: 0,
    can: 'Feuerschlag (Aktion und alle BP, alle 3 Runden): wie ein Haubitzenschuss auf ein Feld in Sicht (bis 6 Felder), 25 % Streuung. Anführer bis 3 Felder können ihre Befehle eine Runde früher wieder geben.',
    chronik: { quelle: 'Funk- und Leitungsprotokoll, Abschnitt Nord', text: 'Geduckt im Trichter kurbeln sie ihr Feldtelefon an und geben die Koordinaten jedes Ziels durch, das sie einsehen können. Wenige Augenblicke später verwandelt schweres Hinterland-Feuer den gemeldeten Abschnitt in aufgewühlten Schlamm.' } },
  pionierD: { side: 'D', name: 'Drahtpioniere', cls: 'inf', cutter: true, fig: 'sapperD', sapper: true, recover: true, wirelayer: true, abil: 'mine', mines: 3, atk: 3, def: 3, mor: 7, mv: 3, rng: 2, fs: 2,
    can: 'Schneidet Draht vom Nachbarfeld aus (Aktion). Je Runde Draht ziehen (aufs Feld, in das er blickt) oder eine Mine auf ein freies Nachbarfeld (3 Stück): unsichtbar, wer hineinzieht, nimmt Schaden und bleibt stehen. Danach kein Angriff mehr.',
    chronik: { quelle: 'Pionierbefehl für den Abschnitt Grauwall', text: 'Im Schutz der Dunkelheit schneiden sie feindliche Verhaue auf oder spannen neue Rollen rostigen Stacheldrahts vor der eigenen Linie. Ebenso lautlos vergraben sie heimtückische Minen im aufgeweichten Boden.' } },
  banner: { side: 'D', name: 'Bannerträger', cls: 'inf', fig: 'banner', banner: true, atk: 3, def: 3, mor: 9, mv: 3, rng: 1, fs: 2,
    can: 'Eigene Truppen bis 2 Felder verlieren weniger Moral (×0,75) und erholen sich jede Runde um 0,5 Moral mehr. Banner aufpflanzen (Aktion): wirkt 3 Felder weit, dort flieht niemand; der Träger zieht nicht, bis er es wieder aufnimmt (Aktion).',
    chronik: { quelle: 'Predigt der Schmiedepriester vor der Schlacht', text: 'Wo das geweihte Feldzeichen der Grauen Liturgie über dem Rauch aufragt, wanken umliegende Truppen deutlich seltener im Beschuss. Rammt der Träger die Stange fest in den Schlamm, weicht dort kein Soldat mehr zurück.' } },
  hauptA: { side: 'A', name: 'Hauptmann mit Stab', cls: 'inf', fig: 'leader1', cmd: 1, atk: 3, def: 4, mor: 9, mv: 3, rng: 2, fs: 2,
    can: 'Kommandotrupp: bis zu 3 Befehle je Schlacht an Nachbarn: „Sammeln“ (Moral +15, Niederhalten endet) oder „Feuer frei“ (Fernkampf ×1,25 bis zu ihrem nächsten Zug). Truppen in der Nähe verlieren weniger Moral.',
    chronik: { quelle: 'Aus dem Notizbuch eines Kompaniechefs', text: 'Mit Trillerpfeife und Meldeblock hält der Hauptmann inmitten des Beschusses die Ordnung in seinem Abschnitt aufrecht. Seine knappen Befehle sammeln wankende Nachbartrupps oder peitschen die Schützen zu konzentriertem Feuer an.' } },
  generalA: { side: 'A', name: 'General mit Stab', cls: 'inf', fig: 'leader4', cmd: 2, atk: 2, def: 5, mor: 10, mv: 3, rng: 1, fs: 1,
    can: 'Pflicht, genau einer je Armee; schwach im Kampf. Bis zu 3 Befehle je Schlacht an Nachbarn („Sammeln“, „Feuer frei“). Einmal je Schlacht „Halten um jeden Preis“: Einheiten bis 2 Felder fliehen bis zum nächsten eigenen Zug nicht, Abwehr ×1,25.',
    chronik: { quelle: 'Stabsbefehl vor der Schlacht bei Grauwall', text: 'Im Kampf kaum wehrhaft, lenkt der oberste Befehlshaber der Armee die Schlacht von einer vorgeschobenen Befehlsstelle aus. Er ordnet die Linien neu und fordert in der höchsten Not das bedingungslose Halten der Stellung um jeden Preis.' } },
  hauptD: { side: 'D', name: 'Hauptmann mit Stab', cls: 'inf', fig: 'leader1', cmd: 1, atk: 3, def: 4, mor: 9, mv: 3, rng: 2, fs: 2,
    can: 'Kommandotrupp: bis zu 3 Befehle je Schlacht an Nachbarn: „Sammeln“ (Moral +15, Niederhalten endet) oder „Sturmbefehl“ (Nahkampf ×1,25 in dieser Runde). Truppen in der Nähe verlieren weniger Moral.',
    chronik: { quelle: 'Tagesbefehl des Regiments, 115 n. G.', text: 'Im vordersten Graben hält der Hauptmann mit seinem Stab die Linie unter eiserner Disziplin zusammen. Mit knappen Rufen sammelt er erschütterte Nachbartrupps oder peitscht sie mit einem Sturmbefehl nach vorn.' } },
  generalD: { side: 'D', name: 'General mit Stab', cls: 'inf', fig: 'leader4', cmd: 2, atk: 2, def: 5, mor: 10, mv: 3, rng: 1, fs: 1,
    can: 'Pflicht, genau einer je Armee; schwach im Kampf. Bis zu 3 Befehle je Schlacht an Nachbarn („Sammeln“, „Sturmbefehl“). Einmal je Schlacht „Generalangriff“: Einheiten bis 2 Felder dürfen sofort noch einmal angreifen (+1 Aktion, +2 BP, auch nach weitem Zug in den Nahkampf), Niederhalten endet.',
    chronik: { quelle: 'Stabsprotokoll der Heeresgruppe Mitte', text: 'Im direkten Kampf kaum wehrhaft, lenkt der einzige General der Armee das Gefecht durch harte Befehle zum Sammeln und Stürmen. Einmal pro Schlacht entfesselt er mit einem gellenden Kampfschrei den vernichtenden Generalangriff.' } },
  knecht: { side: 'D', name: 'Eisenknecht', cls: 'walker', stufe3: true, faust: true, fig: 'mech', mech: true, atk: 8, def: 10, mor: 9, mv: 3, rng: 2, fs: 7,
    can: 'Stufe 3, höchstens einer je Schlacht. Doppelte Sturmkanonen an beiden Unterarmen und Hackklinge; gepanzert, Gewehre und MG prallen ab. Faustsalve (einmal je Schlacht, statt des Schusses): zwei Schüsse auf zwei verschiedene Ziele, je ×2. Selten Panne.',
    chronik: { quelle: 'Feldtagebuch eines Pioniers vor Grauwall', text: 'Nur ein einziger dieser gewaltigen Kolosse schreitet je aufs Feld, bewaffnet mit Zwillings-Sturmkanonen und einer schweren Hackklinge. Einmal pro Schlacht entfesselt er eine vernichtende Faustsalve auf zwei Ziele zugleich.' } },
  bohrer: { side: 'D', name: 'Bohrkoloss', cls: 'walker', zweit: { name: 'Flammenstoß', rng: 2, flamme: true }, fig: 'drill', mech: true, atk: 8, def: 7, mor: 8, mv: 2, rng: 0, fs: 0,
    can: 'Kampfmaschine mit Bohrkopf: sehr stark im Nahkampf. Flammenstoß (einmal je Runde zusätzlich) bis 2 Felder: halb so stark wie ein Flammentrupp, das Feld brennt. Selten Panne: 1 Runde aus (schwer 2).',
    chronik: { quelle: 'Bericht eines Überlebenden aus den Kohlegruben', text: 'Aus den tiefen Kohlegruben an die Front geholt, zermalmt sein rotierender Bohrkopf im Nahkampf jede Befestigung. Ein glühender Flammenstoß aus dem Rumpf setzt zudem das gesamte Vorfeld in Brand.' } }
});
// Nachschub: Kosten in Punkten und Angebot je Seite
// Kosten in Punkten (großer Maßstab, Wunsch des Nutzers): aus Werten und Fähigkeiten berechnet.
// Kampfwert = 6·Angriff + 5·Zähigkeit + 5·Zug − 45, auf 5 gerundet.
//   Angriff = stärkere Waffe + 0,4 × schwächere (Feuer = Feuerkraft × (1 + 0,15 je Feld Reichweite über 1), Steilfeuer ×1,3;
//             Nahkampf = Angriff, Reiter ×1,2, Sturmtruppen ×1,15). Zähigkeit = Abwehr (Kolosse ×1,6, Rüstung ×1,4) + halbe Moral.
// Dazu Fähigkeiten (ABIL) und ein kleiner Abgleich aus der Simulation (ADJ). Prüfen: node tools/costcheck.js
const ABIL = { grenadier: ['Handgranaten', 10], ...(TOG.PZS_ALT ? {} : { feldkanone: ['Panzergranate (3×)', 10] }), feldscher: ['Versorgen', 30], heiler: ['Versorgen', 30], scharf: [!TOG.SCHARF_NEU ? 'Niederhalten' : 'Kopf runter!', 15], buechse: ['Panzerbrechend', 25],
  signal: ['Ziel markieren', 5], fernsprech: ['Feuerschlag anfordern', 10], melder: ['Befehl überbringen', 5], banner: ['Banner', 15],
  hauptA: ['Befehle (3)', 10], hauptD: ['Befehle (3)', 10], generalA: ['Befehle (3), großer Befehl', 35], generalD: ['Befehle (3), großer Befehl', 35],
  pionierD: ['Draht ziehen oder Minen (3), Bergen', 10], pionier: ['Haftladung, Bergen', 15], knecht: ['Doppelte Sturmkanonen, Faustsalve', 30], oger: ['Sprungangriff', 15], huenen: ['Dauerfeuer', 10],
  faust: ['Durchbruch, Standhaft-Aura', 20], kuerass: ['Hinrichtung, Furcht-Aura', 20], kreuz: ['Löwenmaul-Kanone gegen Panzerung, Unterarm-Kanone, Löwengebrüll', 30],
  moerser: ['Rauchmunition (Nebelwand)', 15], mineur: ['Stollen', 10], werkstatt: ['Reparieren, Bergen, Nachladen', 40], ballon: ['Ziel markieren, Sicht von oben', 50],
  eingreif: ['Gegenstoß', 40], gasschutz: ['Gasschutz', 15], munition: ['Reparieren, Bergen, Nachladen', 40], pirsch: [!TOG.SCHARF_NEU ? 'Getarnt, Niederhalten' : 'Getarnt, Kopf runter!', 35] };
// Abgleich nach tools/costcheck.js (Grauwall, 140 Spiele je Typ): Angreifer-Infanterie nimmt Zielfelder und ist für den Angreifer mehr wert,
// Sturmtruppen, Kampfmaschinen, Scharfschützen waren zu billig, Mörser, Reiter und Sanitäter zu teuer.
// Paket 2 nach tools/costcheck.js 120: Minenleger +23 %, Eingreiftrupp +26 % (zu billig), Rauchwerfer −34 %, Mineure −17 %, Werkstatt nur mit Kolossen sinnvoll
// Balance 2026-11-17 (entwurf/BALANCE.md, costcheck ADD=80, 200 Spiele, Probe-Einheiten zufällig in der Startzone): Aschenwacht-Sturm und
// -Fahrzeuge zu billig (+15 bis +27 Punkte Siegquote gegenüber gleich viel Grundinfanterie), Konkordat-Spezialisten zu teuer (−16 bis −37).
// Zweite Runde 2026-11-18 (costcheck mit der neuen KI: Fahrzeuge vorsichtiger, Spezialisten gezielter): Konkordat-Kolosse/Schreiter −19 bis −24,
// Aschenwacht-Spezialisten −13 bis −29, Aschenwacht-Maschinen weiter +10 bis +16.
// Eisenknecht 2026-11-20: Preis 150 (ADJ −10). Budget-Tausch (MISCHEN=1, MECHS=1, Grauwall, je 2×800 Schlachten): Aschenwacht ohne Tausch 61,5 %,
// Knecht statt 4 Grenadiere 62 %, statt 5 (150 Punkte) 59,5 %, statt 6 nur 46 %: der Knecht ist etwa 4–5 Grenadiere wert.
// Löwenoger und Eiserne Hünen 2026-11-20: Budget-Tausch MISCHEN=1, Grauwall, je 600 Schlachten. Oger statt Kohorten (Konkordat ohne Tausch 36 % / Startwert 5: 41 %):
// statt 2 → 40 %, statt 3 → 38 % / 35 %, statt 4 → 26 %, 2 Oger statt 6 → 25 %: neutral bei etwa 2,6 Kohorten = 105. Hünen (Feuer 7, Reichweite 3) statt Grenadiere
// (Aschenwacht ohne Tausch 65 %): statt 3 → 66 %, statt 4 → 57 %; neutral bei 3 Grenadieren = 90 (ADJ −15). Mit Feuer 5/Reichweite 2 waren sie keine 2 Grenadiere wert.
const ADJ = { kohorte: 5, grenadier: -15, scharf: 5, moerser: -15, minenwerfer: -15, reiter: -10, lanzeD: -15, feldscher: -10, heiler: -10,
  sturm: 40, knecht: -10, huenen: -15, bohrer: 80, brand: 0, sturmpz: 20, eingreif: 10, klaue: 25, saeger: 20, gasschutz: -10, ballon: -5, mineur: 10, melder: 15,
  feldkanone: TOG.PZS_ALT ? -10 : -20, haubitze: -10, flammen: -5, werkstatt: -5, schildwall: -5, mahlwerk: -5, koloss: -10, turm: -10, kreuz: -25, orden: -10,
  schwer: -5, banner: -5, munition: -5, faust: -15, kuerass: -25 };   // Helden vorläufig je 110 (unter den Stufe-3-Schreitern), Abgleich per Simulation
function costParts(k) {
  const t = TYPES[k], c = t.cls;
  let F = t.rng > 0 ? (t.fs || 0) * (1 + 0.15 * (t.rng - 1)) : 0; if (c === 'art') F *= 1.3;
  const N = t.atk * (c === 'cav' ? 1.2 : c === 'storm' ? 1.15 : 1), A = Math.max(F, N) + 0.4 * Math.min(F, N);
  const Z = t.def * (c === 'walker' ? 1.6 : t.suit ? 1.4 : 1) + 0.5 * t.mor;
  const base = 6 * A + 5 * Z + 5 * t.mv - 45, abil = [];
  if (ABIL[k]) abil.push(ABIL[k]);
  if (c === 'walker') abil.push(['Pannen', -10]);
  if (ADJ[k]) abil.push(['Abgleich', ADJ[k]]);
  const total = Math.max(15, Math.round((base + abil.reduce((n, a) => n + a[1], 0)) / 5) * 5);
  return { base: Math.round(base), abil, total };
}
const COST = {}; for (const k in TYPES) COST[k] = costParts(k).total;
// Kurze Schlagworte zu den Besonderheiten, für die Einheitenkarte
// Paket 2: Skirmish-Trupps (Bögen des Nutzers)
Object.assign(TYPES, {
  mineur: { side: 'A', name: 'Mineure (Tunnelgräber)', cls: 'inf', fig: 'miner', abil: 'tunnel', ladungen: 3, sapper: true, atk: 3, def: 3, mor: 7, mv: 3, rng: 0, fs: 0,
    can: 'Stollen graben (Aktion, alle 4 Runden): unter einen Graben, Bunker oder ein Gebäude bis 2 Felder. Zwei eigene Runden später fliegt das Feld in die Luft (schwerer Schaden, wird zum Trichter). Höchstens 3 Ladungen je Schlacht.',
    chronik: { quelle: 'Letzter Brief aus Schacht Vier, Grauwall', text: 'Tagelang wühlen sich die Mineure lautlos durch Lehm und Fels bis direkt unter feindliche Gräben oder Bunker. Sobald die Sprengkammern gezündet werden, reißt die verzögerte Detonation die gesamte Stellung in den Abgrund.' } },
  werkstatt: { side: 'A', name: 'Versorgungstrupp', cls: 'medic', fig: 'wrench', repair: true, recover: true, abil: 'ammo', atk: 2, def: 2, mor: 6, mv: 3, rng: 0, fs: 0,
    can: 'Je Runde eine Aufgabe: Koloss oder Kampfmaschine daneben reparieren (Stärke +25, alle 2 Runden), festgefahrene Fahrzeuge bergen oder Nachladen (Aktion, alle 2 Runden): ein MG oder Geschütz daneben schießt noch einmal.',
    chronik: { quelle: 'Schichtbuch der Feldwerkstatt hinter der Linie', text: 'Mit Schweißbrennern, schweren Winden und Munitionskisten folgen diese Mechaniker den Stahlkolossen ins Feuer. Sie flicken zerfetzte Panzerplatten, ziehen festgefahrene Fahrzeuge aus dem Schlamm und füllen leere Magazine auf.' } },
  ballon: { side: 'A', name: 'Ballonbeobachter', cls: 'inf', fig: 'balloon', relay: true, abil: 'mark', aerial: true, fessel: true, spot: 6, atk: 0, def: 1, mor: 4, mv: 2, rng: 0, fs: 0,
    can: 'Fesselballon, wehrlos. Aufgestiegen: sieht 6 Felder über Wald und Häuser, zieht nicht. Einholen (1 Bewegungspunkt): zieht 2 Felder, sieht 4 Felder wie Fußtruppen, kein Markieren. Aufsteigen kostet alle Bewegung, nicht die Aktion. Ziel markieren (Aktion): ein Feld in Sicht bis zu deinem nächsten Zug; eigener Beschuss dorthin ×1,25 ohne Streuung, getarnte Gegner und Minen dort und daneben werden sichtbar.',
    chronik: { quelle: 'Logbuch einer Fesselballon-Besatzung, 116 n. G.', text: 'Wehrlos im engen Weidenkorb unter der Gasblase schwebend, überblicken die Beobachter Wälder, Ruinen und feindliche Linien. Per Draht melden sie jedes verborgene Ziel nach unten und lenken das Feuer der eigenen Artillerie ins Ziel.' } },
  eingreif: { side: 'D', name: 'Eingreiftrupp', cls: 'storm', fig: 'counter', counterStrike: true, abil: 'pzgranate', atk: 6, def: 4, mor: 8, mv: 3, rng: 0, fs: 0,
    can: 'Gegenstoß: Betritt ein Gegner ein Zielfeld bis 3 Felder entfernt, stürmt der Trupp sofort heran und greift an (einmal je gegnerischer Runde). Panzergranate (Aktion, alle 2 Runden): 1–2 Felder gegen Fahrzeuge und Schreiter.',
    chronik: { quelle: 'Einsatzbericht aus den Ruinen von Sankt Ruß', text: 'Geduckt hinter Mauerresten warten diese Veteranen, bis ein Feind in den überwachten Abschnitt vorrückt. Dann stürmen sie sofort zum Gegenstoß heran und schleudern geballte Panzergranaten auf Stahl wie Infanterie.' } },
  gasschutz: { side: 'D', name: 'Gasschutz-Trupp', cls: 'inf', fig: 'gasmask', gasproof: true, abil: 'clear', atk: 3, def: 3, mor: 7, mv: 3, rng: 1, fs: 2,
    can: 'Gas schadet ihm und seinen Nachbarn nicht, auch keine Vergiftung. Entgiften (Aktion, alle 2 Runden): löst Gaswolken bis 1 Feld auf.',
    chronik: { quelle: 'Merkblatt für den Gaskrieg, Aschenwacht', text: 'Mit schweren Filtertornistern und Neutralisations-Zerstäubern trotzen diese Männer jedem Giftgas und schützen auch Kameraden direkt neben sich. Wo sie vorrücken, lösen ihre Geräte selbst dichte Gaswolken rasch auf.' } },
  munition: { side: 'D', name: 'Versorgungstrupp', cls: 'medic', fig: 'ammo', repair: true, recover: true, abil: 'ammo', atk: 2, def: 2, mor: 6, mv: 3, rng: 0, fs: 0,
    can: 'Je Runde eine Aufgabe: Koloss oder Kampfmaschine daneben reparieren (Stärke +25, alle 2 Runden), festgefahrene Fahrzeuge bergen oder Nachladen (Aktion, alle 2 Runden): ein MG oder Geschütz daneben schießt noch einmal.',
    chronik: { quelle: 'Werkstattbuch der 3. Kolonnen-Kompanie', text: 'Mit Winden, Schweißgerät und schweren Munitionskisten folgen sie den Maschinen bis in die Feuerzone. Sie flicken beschädigte Schreiter, ziehen festgefahrene Kolosse aus dem Dreck und füllen leere Gurte nach.' } },
  pirsch: { side: 'D', name: 'Pirschjäger', cls: 'inf', fig: 'stalker', pin: true, hidden: true, atk: 1, def: 2, mor: 6, mv: 3, rng: 4, fs: 3,
    can: 'Getarnt: nur aus dem Nachbarfeld angreifbar, bis er schießt (dann eine gegnerische Runde sichtbar). Jeder Treffer hält nieder.',
    chronik: { quelle: 'Jagd- und Spähprotokoll, Dunkelwald', text: 'Lautlos pirschen diese kundigen Jäger durch Wälder, Ruinen und Trichterfelder, um den Feind ungesehen aufzuklären. Aus gedeckten Stellungen nehmen sie wertvolle Ziele präzise aufs Korn, ehe sie wieder im Nebel verschwinden.' } }
});
// F103 Rollen schärfen (Enrico 2026-11-22 13:35): klarere Aufgaben je Einheit
if (TOG.SCHARF_NEU) for (const t of ['scharf', 'pirsch']) Object.assign(TYPES[t], { pin: false, standSchuss: true, scharfInf: true, abil: 'kopfrunter' });   // Punkt 3 (2026-11-24): Schuss nur aus dem Stand, gegen ungepanzerte Ziele ×P.SCHARF_INF, Niederhalten nur noch als Fähigkeit; vorerst nur Vorschlag: SCHARF_NEU=1 schaltet sie ein (Messung: Siegquote schwankt um bis zu 28 Punkte)
Object.assign(TYPES.grenadier, TOG.NOHANDGRANATE ? { granatSturm: true } : { abil: 'handgranate' });   // Punkt 34 (Enrico 2026-11-24): Handgranaten als Fähigkeit (Aktion, Abklingzeit 2) statt fester Regel; NOHANDGRANATE = alte Regel   // Stoßinfanterie: Handgranaten vor dem Nahkampf (×P.GRANAT_NAH), Schuss schwächer (×P.GRANAT_FERN)
Object.assign(TYPES.eingreif, { gegenstoss: true });     // Gegenstoß: Nahkampf auf eigenen Zielfeldern und in eigenen Gräben ×P.GEGENSTOSS, sonst ×P.GEGENSTOSS_VOR
delete TYPES.raeumer.abil;                               // Grabenräumer: billiger Grabenkampf ohne Panzerabwehr (Panzergranate bleibt beim Sturmbrecher)
Object.assign(TYPES.feldkanone, { direkt: true, fahrbar: true, mv: 2 }); delete TYPES.feldkanone.limber;
if (!TOG.PZS_ALT) Object.assign(TYPES.feldkanone, { abil: 'pzschuss', ladungen: P.PZS_LADUNGEN });   // Punkt 16 (2026-11-24): Panzergranate mit begrenzten Ladungen; normaler Schuss gegen Panzer schwächer (P.FK_VS_WALKER); PZS_ALT=1 = vorher   // Feldkanone: nur direktes Feuer mit Sicht über ihre ganze Reichweite; ohne Protzen, zieht immer 2 Felder und schießt danach noch (Enrico 2026-11-22 17:40)
Object.assign(TYPES.panzerk, { cutter: true });          // Panzerknechte: Nahkampf und Draht
for (const k in TYPES) if (COST[k] == null) COST[k] = costParts(k).total;
const SPECIALS = {"kohorte": ["Schneidet Draht", "Schuss 2 Felder", "Eingraben"], "grenadier": ["Schneidet Draht", "Schuss 2 Felder", "Eingraben"], "mahlwerk": ["Sperrfeuer: 2 Schüsse", "Zieht oder schießt"], "sense": ["Sperrfeuer: 2 Schüsse", "Zieht oder schießt"], "haubitze": ["Feuert über Truppen", "Gas und Sperrfeuer", "Aufprotzen"], "geschuetz": ["Feuert über Truppen", "Direktschuss ×2,5 auf Kolosse", "Aufprotzen"], "koloss": ["Gepanzert", "Sturmrollen", "Walzt Draht nieder", "Pannen"], "sturmpz": ["Gepanzert", "Breitseite: 2 Ziele ×0,6", "Bord-MG", "Sturmrollen", "Walzt Draht nieder", "Pannen"], "reiter": ["Ansturm ×1,5", "Kein Draht, kein Totholz"], "lanzeD": ["Ansturm ×1,5", "Sprenglanze ×1,5 (einmal)", "Kein Draht, kein Totholz"], "sturm": ["Sickert durch", "Handgranaten", "Panzergranate"], "brand": ["Flammenstrahl", "Deckung schützt nicht", "Feld brennt"], "feldscher": ["Versorgt einen Nachbarn", "Heilt Vergiftung"], "heiler": ["Versorgt einen Nachbarn", "Heilt Vergiftung"], "moerser": ["Mörser", "Ziehen und feuern", "Steilfeuer 4 Felder", "Rauchmunition: Nebelwand"], "minenwerfer": ["Steilfeuer 4 Felder", "Sprenggranaten ×1,5", "Zerstört Draht und Barrikaden", "Ziehen oder feuern"], "scharf": ["Schuss 4 Felder", "Hält das Ziel nieder"], "melder": ["Befehl überbringen: +2 Bewegung", "Zieht 5 Felder"], "signal": ["Ziel markieren: ×1,25, keine Streuung, deckt auf", "Sieht 6 Felder", "Befehle 1 Runde früher"], "pionier": ["Draht schneiden und angreifen", "Haftladung gegen Panzer"], "raeumer": ["Sickert durch", "Handgranaten", "Panzergranate"], "buechse": ["Schuss 3 Felder", "Panzer ×1,5, Fußtruppen ×0,5"], "schwer": ["Sehr zäh", "Nur Nahkampf", "Draht hält nicht auf", "Schilde vor"], "knecht": ["Stufe 3: einmal je Schlacht", "Gepanzert", "Doppelte Sturmkanonen", "Faustsalve: einmal je Schlacht", "Hackklinge", "Pannen"], "klaue": ["Gepanzert", "Maschinenwaffe", "Pannen"], "stahl": ["Leicht gepanzert: Gewehr, MG, Klinge ×0,5", "Draht hält nicht auf", "Sturmlauf"], "flammen": ["Flammenstrahl", "Deckung schützt nicht", "Feld brennt"], "schildwall": ["Sehr zäh", "Keine Schusswaffe", "Schilde vor"], "feldkanone": ["Reichweite 5", "Direktschuss ×2,5 auf Kolosse", "Aufprotzen"], "fernsprech": ["Feuerschlag anfordern (alle 3 Runden)", "Sieht 6 Felder", "Befehle 1 Runde früher"], "pionierD": ["Zieht Stacheldraht", "Schuss 2 Felder"], "banner": ["Moralverlust ×0,75 in 2 Feldern", "Erholung +5", "Aufpflanzen: 3 Felder, keine Flucht"], "hauptA": ["3 Befehle je Schlacht, an Nachbarn", "Sammeln, Feuer frei"], "hauptD": ["3 Befehle je Schlacht, an Nachbarn", "Sammeln, Sturmbefehl"], "generalA": ["3 Befehle je Schlacht, an Nachbarn", "Einmal: Halten um jeden Preis", "Höchstens einer"], "generalD": ["3 Befehle je Schlacht, an Nachbarn", "Einmal: Generalangriff (zweiter Angriff)", "Höchstens einer"], "panzerk": ["Leicht gepanzert: Gewehr, MG, Klinge ×0,5", "Draht hält nicht auf", "Sturmlauf"], "bohrer": ["Gepanzert", "Nur Nahkampf", "Pannen"], "saeger": ["Gepanzert", "Maschinenwaffe und Säge", "Pannen"], "oger": ["Sprungangriff (alle 2 Runden)", "Schrotflinte 1 Feld", "Sickert durch"], "faust": ["Held", "Durchbruch: 2 Felder, schleudert zurück", "Standhaft-Aura", "Leicht gepanzert", "Kaum Fernkampf"], "kuerass": ["Held", "Hinrichtung unter 40 %", "Furcht-Aura", "Leicht gepanzert", "Langsam, bleibt stecken"], "huenen": ["Dauerfeuer: 2 Salven, dann abkühlen", "Leicht gepanzert: Gewehr, MG, Klinge ×0,5", "Hält nieder", "Draht hält nicht auf"]};
for (const t in SPECIALS) TYPES[t].sp = SPECIALS[t];
Object.assign(SPECIALS, { turm: ["Gepanzert", "Geschützturm", "Schuss 3 Felder", "Panne möglich"], orden: ["Gepanzert", "Drehlauf", "Kettensäge", "Panne möglich"], kreuz: ["Stufe 3: einmal je Schlacht", "Schwer gepanzert", "Panzerjäger: Panzer ×1,5, Fußtruppen ×0,5", "Kriegshammer", "Löwengebrüll: einmal je Schlacht", "Panne möglich"] });
// Paket 1: Schlagworte für neue Regeln
Object.assign(SPECIALS, { mineur: ['Stollen sprengen', '3 Ladungen je Schlacht', 'Keine Panzerwaffe'],
  werkstatt: ['Repariert Kolosse', 'Nachladen'], ballon: ['Sicht von oben 8 Felder', 'Ziel markieren', 'Zieht nicht'],
  eingreif: ['Gegenstoß auf Zielfelder', 'Panzergranate'], gasschutz: ['Gasfest, schützt Nachbarn', 'Entgiften'], munition: ['Repariert Kolosse', 'Nachladen'], pirsch: ['Getarnt', 'Schuss 4 Felder', 'Hält nieder'] });
for (const t in TYPES) if (!TYPES[t].sp && SPECIALS[t]) TYPES[t].sp = SPECIALS[t].slice();
for (const t in TYPES) { const T = TYPES[t], sp = T.sp || (T.sp = []);
  if (T.mg) { const i = sp.indexOf('Zieht oder schießt'); if (i >= 0) sp[i] = 'Erst aufbauen, dann feuern'; }
  if (T.recover) sp.push('Bergt Kolosse und Maschinen');
  { const i = sp.indexOf('Schneidet Draht'); if (i >= 0) sp.splice(i, 1); }   // Paket 8: nur noch die Drahtschneider (cutter) schneiden, vom Nachbarfeld aus
  if (T.cutter) sp.unshift('Draht schneiden (Nachbarfeld, Aktion)');
  if (T.zweit) sp.push(T.zweit.name + (T.zweit.rng > 1 ? ` (${T.zweit.rng} Felder)` : ' (Nachbarfeld)'));
  if (T.rng >= 2 && T.cls !== 'art' && T.cls !== 'walker' && !T.mg) sp.push('Feuerbereitschaft');
}
const SHOP = { A: ['hauptA', 'generalA', 'kohorte', 'melder', 'fernsprech', 'feldscher', 'pionier', 'scharf', 'schildwall', 'mahlwerk', 'moerser', 'reiter', 'raeumer', 'oger', 'flammen', 'feldkanone', 'haubitze', 'koloss', 'stahl', 'turm', 'orden', 'kreuz', 'mineur', 'werkstatt', 'ballon', 'faust'],
  D: ['hauptD', 'generalD', 'grenadier', 'lanzeD', 'signal', 'heiler', 'pionierD', 'schwer', 'banner', 'buechse', 'sense', 'minenwerfer', 'brand', 'sturm', 'huenen', 'geschuetz', 'panzerk', 'knecht', 'sturmpz', 'bohrer', 'saeger', 'klaue', 'eingreif', 'gasschutz', 'munition', 'pirsch', 'kuerass'] };

const TERRAIN = {
  open:    { name: 'Offenes Feld', cost: 1, info: 'Keine Deckung.',
             chronik: { quelle: 'Merkblatt für Rekruten der Kronarmee', text: 'Auf offenem Feld gibt es nur zwei Arten von Soldaten: die schnellen und die gezählten.' } },
  mud:     { name: 'Schlamm', cost: 2, info: 'Kostet 2 Bewegung. Landkolosse bleiben hier manchmal stecken.',
             chronik: { quelle: 'Brief aus den Schlammjahren, 116 n. G.', text: 'Der Schlamm vor Grauwall frisst Stiefel, Pferde und manchmal ganze Kolosse bis an die Ketten.' } },
  crater:  { name: 'Granattrichter', cost: 2, info: 'Kostet 2 Bewegung. Abwehr ×1,2 gegen Beschuss.',
             chronik: { quelle: 'Feldtagebuch, Sankt Ruß', text: 'Jeder Trichter ist ein Grab, das noch auf seinen Bewohner wartet – und bis dahin die beste Deckung weit und breit.' } },
  trench:  { name: 'Schützengraben', cost: 1, info: 'Abwehr ×1,6 gegen Beschuss und Angriffe von vorn. Halber Moralverlust.',
             chronik: { quelle: 'Grabenlied der Aschengrenadiere', text: 'Zwei Meter Erde über dem Kopf sind mehr wert als jeder Segen der Liturgie.' } },
  wire:    { name: 'Stacheldraht', cost: 1, info: 'Wer ihn betritt, verliert etwa 10 Stärke und bleibt stehen. Wer drinsteht: Abwehr ×0,6, MG-Feuer ×2. Infanterie kann ihn schneiden, Landkolosse walzen ihn nieder. Gepanzerte Infanterie geht unverletzt hindurch.',
             chronik: { quelle: 'Pionierbefehl, Abschnitt Grauwall', text: 'Ein Drahtgürtel hält keinen Mann auf, aber er hält ihn genau dort fest, wo das MG hinzielt.' } },
  village: { name: 'Ruinen', cost: 1, info: 'Abwehr ×1,5.',
             chronik: { quelle: 'Brief nach Hause, 115 n. G.', text: 'Von dem Dorf stehen nur noch Mauerreste, doch hinter jedem Stein liegt jetzt ein Schütze.' } },
  forest:  { name: 'Totholz', cost: 2, info: 'Kostet 2 Bewegung. Abwehr ×1,4. Versperrt die Sicht.',
             chronik: { quelle: 'Spähbericht, Abschnitt Mitte', text: 'Wo einst ein Wald stand, ragen nur noch zersplitterte Stümpfe – Deckung für Schützen, Hindernis für alles andere.' } },
  canal:   { name: 'Kanal', cost: 99, info: 'Nicht passierbar, nur über die Brücke.',
             chronik: { quelle: 'Pionierkarte des Westlichen Konvents', text: 'Der alte Kohlenkanal ist zu tief zum Waten, und nur eine einzige Brücke führt hinüber.' } },
  eis:     { name: 'Eis', cost: 2, info: 'Zugefrorenes Wasser: trägt Fußtruppen, Anführer und Helden (2 Bewegung, keine Deckung). Fahrzeuge, Schreiter, Geschütze und Reiter brechen ein und kommen nicht hinüber. Schwerer Beschuss (Haubitze, Minenwerfer, Feuerschlag, Sperrfeuer) kann es aufbrechen: 2 Runden offenes Wasser, wer darauf steht, nimmt Schaden und rettet sich ans Ufer.',
             chronik: { quelle: 'Wachbuch, Krähenfurt, Winter 115 n. G.', text: 'Das Eis trägt einen Mann mit Gewehr, aber kein Pferd, kein Geschütz und keinen Koloss.' } },
  eisloch: { name: 'Eisloch', cost: 99, info: 'Aufgebrochenes Eis: offenes Wasser, für alle unpassierbar. Friert nach 2 Runden wieder zu.',
             chronik: { quelle: 'Feldtagebuch, Krähenfurt', text: 'Nach dem Sperrfeuer brach das Eis, und der Fluss nahm sich, was darauf stand.' } },
  haus:    { name: 'Haus', cost: 1, info: 'Heiles Fachwerkhaus: nur Fußtruppen und Anführer kommen hinein (keine Helden). Abwehr ×1,6, halber Moralverlust. Versperrt die Sicht. Schwere Treffer machen es zur Ruine.',
             chronik: { quelle: 'Befehl zur Häuserverteidigung', text: 'Ein heiles Haus ist eine Festung, bis die erste schwere Granate durchs Dach kommt.' } },
  kapelle: { name: 'Kapelle', cost: 1, info: 'Kleine Steinkapelle mit Türmchen: wie ein Haus (Abwehr ×1,6, halber Moralverlust, Sicht gesperrt), etwas fester gebaut. Wer drin steht, sieht 1 Feld weiter.',
             chronik: { quelle: 'Predigt der Kronkirche, Krähenfurt', text: 'Die kleine Kapelle hat drei Kriege überstanden; ihr Türmchen dient heute den Beobachtern statt den Glocken.' } },
  steinbruecke: { name: 'Steinbrücke', cost: 1, info: 'Fester Übergang über den Fluss, trägt auch Kolosse und Geschütze.',
             chronik: { quelle: 'Pionierbericht, Krähenfurt', text: 'Die alte Steinbrücke trägt selbst Kolosse – deshalb liegt sie im Visier jeder Batterie.' } },
  bridge:  { name: 'Brücke', cost: 1, info: 'Einziger Weg über den Kanal. Zu schwach für Landkolosse.',
             chronik: { quelle: 'Pionierkarte des Westlichen Konvents', text: 'Die hölzerne Brücke ist der einzige Weg über den Kanal, doch einen Koloss trägt sie nicht.' } },
  furt:    { name: 'Furt', cost: 3, info: 'Seichtes Wasser: kostet 3 Bewegung, Abwehr ×0,8. Geschütze kommen nicht durch.',
             chronik: { quelle: 'Brief eines Rittmeisters, Krähenfurt', text: 'An der Furt steht man bis zu den Knien im eisigen Wasser – ein leichtes Ziel für jeden Schützen am Ufer.' } },
  sumpf:   { name: 'Sumpf', cost: 3, info: 'Kostet 3 Bewegung. Kolosse bleiben oft stecken, Geschütze kommen nicht durch.',
             chronik: { quelle: 'Verhörprotokoll, Westlicher Konvent', text: 'Der Sumpf hat mehr Kolosse verschluckt als alle Panzerbüchsen der Aschenwacht zusammen.' } },
  wald:    { name: 'Dichter Wald', cost: 3, info: 'Kostet 3 Bewegung. Abwehr ×1,5. Versperrt die Sicht. Reiter, Geschütze und Kolosse kommen nicht durch.',
             chronik: { quelle: 'Jagdprotokoll der Pirschjäger', text: 'Im dichten Wald sieht man den Feind erst, wenn man ihn riechen kann.' } },
  waldweg: { name: 'Waldweg', cost: 1, info: 'Schneise durch den Wald: kostet 1 Bewegung, auch für Geschütze und Kolosse. Abwehr ×1,2.',
             chronik: { quelle: 'Nachschubbefehl, 114 n. G.', text: 'Ohne die Bohlenwege durch den Wald käme weder Munition noch Brot an die Front.' } },
  bunker:  { name: 'Betonbunker', cost: 1, info: 'Abwehr ×2 gegen alles. Halber Moralverlust.',
             chronik: { quelle: 'Werksbericht, Grauwall', text: 'Der Betonbunker überstand drei Tage Trommelfeuer – die Männer darin nur zwei.' } },
  fabrik:  { name: 'Fabrikruine', cost: 2, info: 'Kostet 2 Bewegung. Abwehr ×1,7. Versperrt die Sicht.',
             chronik: { quelle: 'Brief aus dem Kohlerevier', text: 'In der zerschossenen Fabrik wird um jede Halle gekämpft, als ginge es noch um Kohle.' } },
  kirche:  { name: 'Kirchenruine', cost: 1, info: 'Abwehr ×1,5. Versperrt die Sicht. Vom Turm sieht man 6 Felder weit.',
             chronik: { quelle: 'Predigt der Grauen Liturgie', text: 'Auch eine zerschossene Kirche bietet Deckung, und ihr Turmstumpf blickt weit über das Land.' } },
  barrikade: { name: 'Barrikade', cost: 2, info: 'Kostet 2 Bewegung. Abwehr ×1,6 von allen Seiten. Reiter kommen nicht durch.',
             chronik: { quelle: 'Befehl zur Verteidigung von Sankt Ruß', text: 'Karren, Schutt und Möbel sperren die Gasse – hier kommt kein Reiter durch.' } },
  bahn:    { name: 'Bahndamm', cost: 1, info: 'Abwehr ×1,3 gegen Beschuss. Fester Untergrund: Kolosse kommen gut voran.',
             chronik: { quelle: 'Stabsbefehl, Heeresgruppe Mitte', text: 'Um die Bahnlinien wird dieser Krieg geführt, und ihre Dämme sind die besten Straßen für Kolosse.' } },
  // Sankt Ruß (2026-11-19)
  schiff:  { name: 'Kirche', cost: 1, info: 'Nur Fußtruppen und Anführer kommen hinein (keine Helden). Abwehr ×1,8, halber Moralverlust. Versperrt die Sicht. Treffer von Artillerie, Mörsern und Kanonen bringen die Kirche zum Einsturz.',
             chronik: { quelle: 'Chronik von Sankt Ruß, 116 n. G.', text: 'Die Mauern der Kirche halten mehr aus als jeder Graben – bis sie einstürzen.' } },
  turm:    { name: 'Kirchturm', cost: 1, info: 'Wie die Kirche. Wer im Turm steht, schießt und sieht 1 Feld weiter. Stürzt mit der Kirche ein.',
             chronik: { quelle: 'Logbuch eines Beobachters, Sankt Ruß', text: 'Wer den Kirchturm hält, sieht das ganze Tal; deshalb zielen beide Seiten zuerst auf ihn.' } },
  friedhof: { name: 'Friedhof', cost: 1, info: 'Gräber und niedrige Mauer: Abwehr ×1,2 gegen Beschuss.',
             chronik: { quelle: 'Feldtagebuch, Sankt Ruß', text: 'Wir lagen hinter den Grabsteinen und hofften, dass die Toten uns ihren Platz noch eine Weile leihen.' } },
  garten:  { name: 'Garten', cost: 1, info: 'Niedrige Gartenmauern: Abwehr ×1,2 gegen Beschuss.',
             chronik: { quelle: 'Brief nach Hause, Sankt Ruß', text: 'Die Gartenmauern sind kaum kniehoch, aber im Kugelhagel ist jeder Stein ein Freund.' } },
  acker:   { name: 'Acker', cost: 1, info: 'Gepflügter Acker unter Schnee, an den Rändern Hecken und Feldraine: Abwehr ×1,2 gegen Beschuss.',   // G4 (2026-11-25): Krähenfurt, gleiche Regel wie Garten
             chronik: { quelle: 'Bauernkalender von Krähenfurt, Winter 116 n. G.', text: 'Die Furchen sind gefroren und die Hecken kahl, doch wer sich an den Feldrain duckt, wird von den Kugeln eher übersehen als vom Frost.' } }
};
Object.assign(TERRAIN, {   // G6 (2026-11-25): Panzersperre, Windmühle, Koloss-Wrack (Rückweg ORTE_ALT: Karten ohne diese Felder)
  sperre:  { name: 'Panzersperre', cost: 99, info: 'Niemand kommt hindurch, auch kein Koloss. Fußtruppen daneben sind gegen Beschuss über die Sperre geschützt (×1,2). Nur Graben-Pioniere können sie sprengen. Die Sicht bleibt frei.',
             chronik: { quelle: 'Pionierbefehl, Abschnitt Grauwall', text: 'Stahl und Beton halten keinen Mann auf, aber jeden Koloss – und wo der Koloss nicht weiterkommt, hält bald auch der Mann.' } },
  muehle:  { name: 'Windmühle', cost: 1, info: 'Nur Fußtruppen und Anführer. Abwehr ×1,6, halber Moralverlust. Wer oben steht, schießt und sieht 1 Feld weiter. Versperrt die Sicht. Schwere Treffer bringen sie zum Einsturz.',
             chronik: { quelle: 'Meldung eines Beobachtungspostens', text: 'Die Flügel sind längst zerschossen, doch vom Mahlboden sieht man bis zu den feindlichen Gräben – deshalb steht die Mühle noch, und deshalb wird sie fallen.' } },
  wrack:   { name: 'Koloss-Wrack', cost: 2, info: 'Ausgebrannter Landkoloss. Fußtruppen finden Deckung (×1,5). Fahrzeuge, Reiter und Geschütze kommen nicht durch. Versperrt die Sicht.',
             chronik: { quelle: 'Bericht einer Bergungsmannschaft', text: 'Der Koloss brannte zwei Tage; seitdem liegt er da wie ein toter Berg aus Eisen, und jeder Spähtrupp kriecht in seinen Schatten.' } },
});
const KIRCHE = new Set(['schiff', 'turm', 'haus', 'kapelle', 'muehle']);
const orteAlt = () => !!(TOG.ORTE_ALT || (typeof window !== 'undefined' && window.ORTE_ALT));   // G6: Karten ohne Panzersperren und besondere Orte   // große Gebäude: nur Fußtruppen und Anführer, Sicht gesperrt, halber Moralverlust (Winterdorf: auch Häuser und Kapelle)
const gebDef = t => t === 'haus' || t === 'kapelle' || t === 'muehle' ? P.HAUS_DEF : P.KIRCHE_DEF;
const RUINE = new Set(['village', 'fabrik', 'kirche']);   // F79 (2026-11-21): Trümmer – Fahrzeuge/Schreiter: Bewegung endet dort, Gefahr festzufahren

function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// ---------- Feste Karten (Wunsch des Nutzers: wählbar, drei Größen, quadratischer) ----------
// Jede Karte ist reine Daten: Gelände-Bauplan, Zielfelder, Standardarmeen, Verstärkung, Runden, Siegpunkte.
// Neue Karte: Eintrag in MAPS ergänzen; Aufstellung und Kaufbudget ergeben sich daraus.
function mapTools(cols, rows, seed) {
  const rnd = mulberry32(seed), M = [];
  for (let c = 0; c < cols; c++) { M.push([]); for (let r = 0; r < rows; r++) M[c].push({ t: 'open', ridge: false, obj: null }); }
  const ok = (c, r) => c >= 0 && c < cols && r >= 0 && r < rows;
  const T = {
    M, rnd,
    set: (c, r, t) => { if (ok(c, r)) M[c][r].t = t; },
    line: (c, r0, r1, t, gaps) => { for (let r = r0; r <= r1; r++) if (!(gaps || []).includes(r)) T.set(c, r, t); },
    field: (c0, c1, r0, r1, list) => { for (let c = c0; c <= c1; c++) for (let r = r0; r <= r1; r++) { let x = rnd(); for (const [t, p] of list) { if (x < p) { T.set(c, r, t); break; } x -= p; } } },
    blob: (c, r, rad, t) => { for (let cc = c - rad - 1; cc <= c + rad + 1; cc++) for (let rr = r - rad - 1; rr <= r + rad + 1; rr++) if (ok(cc, rr) && dist(c, r, cc, rr) <= rad) T.set(cc, rr, t); },
    ridge: (c0, c1, r0, r1) => { for (let c = c0; c <= c1; c++) for (let r = r0; r <= r1; r++) if (ok(c, r)) M[c][r].ridge = true; },
    many: (list, t) => { for (const [c, r] of list) T.set(c, r, t); },
    // path: Feldkette über Wegpunkte. what = Geländeart, oder 'road'/'rail'/'river' als reine Zeichen-Merkmale (Regeln bleiben)
    path: (pts, what, keep) => {
      const hexes = [];
      for (let i = 0; i < pts.length; i++) { hexes.push(pts[i]); if (i + 1 < pts.length) hexes.push(...line(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1])); }
      for (const [c, r] of hexes) if (ok(c, r)) {
        if (what === 'road' || what === 'rail' || what === 'river') M[c][r][what] = true;
        else if (!(keep || []).includes(M[c][r].t)) M[c][r].t = what;
      }
      return hexes;
    }
  };
  return T;
}
// Zeichenraster (Sankt Ruß): ein Zeichen je Feld
const GRID_CODE = { '.': 'open', ',': 'mud', o: 'crater', f: 'forest', W: 'wald', '=': 'trench', x: 'wire', U: 'bunker', '~': 'canal', B: 'bridge', F: 'furt', s: 'sumpf', V: 'village', K: 'fabrik', '+': 'kirche', '#': 'barrikade', '-': 'bahn',
  S: 'schiff', t: 'turm', h: 'friedhof', g: 'garten', E: 'eis', H: 'haus', C: 'kapelle', R: 'steinbruecke' };
const MAPS = {
  grauwall: { get bauten() { return orteAlt() ? [] : [{ art: 'muehle', name: 'Windmühle', felder: [[5, 6]] }]; },   /* G6: Bauzustand der Windmühle */ id: 'grauwall', name: 'Der Grauwall', size: 'Klassisch', cols: 16, rows: 10, zoneA: 2, zoneD: 7,
    desc: 'Die erste Schlacht: Niemandsland, zwei Grabenlinien, Kanal mit Brücke.',
    armyMax: { A: 22, D: 18 },
    objectives: [
      { id: 'vorposten', name: 'Vorposten', c: 3, r: 4, pts: 1 },
      { id: 'nordgraben', name: 'Nordgraben', c: 7, r: 2, pts: 2 },
      { id: 'suedgraben', name: 'Südgraben', c: 7, r: 7, pts: 2 },
      { id: 'schanze', name: 'Die Schanze', c: 10, r: 5, pts: 2 },
      { id: 'veskar', name: 'Veskar', c: 12, r: 4, pts: 1 }],
    // G2a (Enrico 2026-11-25): Gräben als Linien (Bild = Regel) – Feuergräben mit Buchten, Laufgräben zum Hinterland bzw. zwischen den Linien, Sappen nach vorn;
    // die Grabenfelder der Regeln sind genau die Felder der Linien. Rückweg: GRAEBEN_ALT=1 (bzw. window.GRAEBEN_ALT) = alte drei durchgehenden Linien.
    graeben: [
      { art: 'feuer', linie: [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7], [2, 8], [2, 9]] },
      { art: 'feuer', linie: [[7, 0], [7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6], [7, 7], [7, 8], [7, 9]] },
      { art: 'feuer', linie: [[10, 1], [10, 2], [10, 3], [10, 4], [10, 5], [10, 6], [10, 7], [10, 8], [10, 9]] },   // endet im Norden (Abgleich 2026-11-25: Ende im Süden 23 %, durchgehend 39 %, Ende im Norden 47 % mit einer Sappe)
      { art: 'lauf', linie: [[2, 3], [1, 3], [0, 3]] }, { art: 'lauf', linie: [[2, 7], [1, 7], [0, 7]] },   // Konkordat: Annäherungsgräben aus dem Hinterland
      { art: 'lauf', linie: [[7, 2], [8, 2], [9, 2], [10, 2]] }, { art: 'lauf', linie: [[7, 6], [8, 6], [9, 6], [10, 6]] },   // Aschenwacht: Verbindungsgräben zwischen den Linien
      { art: 'sappe', linie: [[7, 8], [6, 8]] }],   // Sappe der Aschenwacht nach vorn (eine Konkordat-Sappe bei (3,5) hob die Quote auf 63 %)
    ki: { A: { artRunden: 5 }, D: { artRunden: 4 } },   /* F94-Abgleich (2026-11-22): Geschütze ziehen erst nach 5 bzw. 4 Runden ohne Ziel nach – feste Aufstellung 54,3 % (8 × 200) */
    army: { A: { kohorte: 5, mahlwerk: 2, koloss: 2, haubitze: 2, reiter: 1, pionier: 1, scharf: 1, moerser: 1, feldscher: 1, raeumer: 1, flammen: 1, generalA: 1, hauptA: 1 },   // F94 (Enrico 2026-11-22 13:35): gemischte Startarmeen, höchstens 5 vom selben Typ
      D: { grenadier: 5, gasschutz: 2, banner: 1, sense: 3, geschuetz: 2, sturm: 1, sturmpz: 1, minenwerfer: 1, signal: 1, heiler: 1, generalD: 1, hauptD: 1 } },   /* Abgleich nach F103 (je 8 × 200): feste Aufstellung 46,5 %, gemischt 57,1 % */   // vorher A: 8 Kohorten, 3 Mahlwerk, 3 Kolosse, 2 Donnerrohre, 2 Reiter; D: 8 Grenadiere, 5 Sensenwerk, 2 Geschütze, 2 Sturmbrecher   // F66/F54/F80 (2026-11-21): +2 Sturmbrecher (Panzergranate gegen die Kolosse), 8 statt 10 Grenadiere (Sim 52 %)
    build: () => {
      const T = mapTools(16, 10, 1917);
      const alt = TOG.GRAEBEN_ALT || (typeof window !== 'undefined' && window.GRAEBEN_ALT);
      if (alt) T.line(2, 0, 9, 'trench');
      T.field(3, 4, 0, 9, [['crater', 0.3], ['mud', 0.16]]);
      const drahtAlt = TOG.DRAHT_ALT || (typeof window !== 'undefined' && window.DRAHT_ALT);   // G5 (2026-11-25): Draht als Gürtel mit Plan; Rückweg DRAHT_ALT
      if (drahtAlt) { T.line(5, 0, 9, 'wire', [2, 7]); T.line(6, 0, 9, 'wire', [4, 8]); }
      else { T.many([[4, 0], [4, 1], [5, 3], [4, 5], [4, 6], [5, 8], [5, 9]], 'wire'); T.set(5, 4, 'barrikade'); T.line(6, 0, 9, 'wire', [4, 8]); }   // Spanischer Reiter auf der Landstraße (5,4); äußerer Gürtel im Zickzack (Gassen bei Zeile 2 und 7), innerer Gürtel ein Feld vor dem Graben (Gassen 4 und 8)
      if (alt) T.line(7, 0, 9, 'trench');
      T.field(8, 8, 0, 9, [['crater', 0.25]]);
      if (drahtAlt) T.line(9, 0, 9, 'wire', [1, 5, 8]); else T.line(9, 0, 9, 'wire', [0, 4, 7]);   // G5: Gassen vor den MG-Stellungen des hinteren Grabens (Sensenwerke 10,0 / 11,4 / 10,7) – Angreifer laufen ins Schussfeld
      if (alt) T.line(10, 0, 9, 'trench');
      else for (const g of MAPS.grauwall.graeben) for (const [c, r] of g.linie) T.set(c, r, 'trench');   // G2a: Grabenfelder aus den Linien
      T.ridge(11, 13, 3, 5);
      T.many([[12, 4], [12, 3], [13, 4]], 'village');
      T.many([[13, 0], [14, 0], [14, 1], [15, 1], [13, 1]], 'forest');
      T.line(14, 6, 9, 'canal'); T.set(14, 8, 'bridge');
      T.many([[15, 7], [15, 8]], 'village');
      T.path([[0, 4], [12, 4], [14, 8], [15, 8]], 'road');   // alte Landstraße nach Veskar und über die Marnbrücke
      if (!orteAlt()) { T.set(5, 6, 'muehle'); T.M[5][6].bau = 0; T.many([[3, 2], (typeof process !== 'undefined' && process.env && process.env.SPERRE_ALT) || (typeof window !== 'undefined' && window.SPERRE_ALT) ? [3, 4] : [3, 5], [8, 3], [8, 5]], 'sperre'); }   // Punkt 89 (2026-11-26): Sperre stand auf dem Vorposten (3,4) und sperrte das Zielfeld ganz – jetzt (3,5) (Rückweg SPERRE_ALT); G6: Windmühle im Niemandsland; Panzersperren beiderseits der Landstraße vor den Gräben (Fahrzeuge auf die Straße gelenkt)
      return T.M;
    } },
  // Sankt Ruß (2026-11-19, Plan entwurf/KARTE_SANKT_RUSS.md): Dorf in der Mitte, beide Seiten aus ihren Gräben am Dorfrand (Konkordat West, Aschenwacht Ost).
  // Raster punktsymmetrisch (c, r) ↔ (15 − c, 9 − r), nur Kirche, Friedhof, Dorfplatz und Straße nicht gespiegelt. Kirche: Schiff (8,5)+(9,5), Turm (9,4).
  // Balance (Simulation 2026-11-19, entwurf/BALANCE.md): das Konkordat zieht zuerst und gewinnt sonst den Lauf zu den neutralen Fahnen –
  // deshalb steht der Turm auf der Ostseite, die Aschenwacht stellt bis in ihren Graben auf (band 4) und rückt wie ein Angreifer vor (ki).
  sanktruss: { id: 'sanktruss', name: 'Sankt Ruß', size: 'Klassisch', cols: 16, rows: 10, zoneA: 2, zoneD: 9, band: 4,
    desc: 'Ein zerschossenes Dorf um eine ausgebrannte Kirche. Beide Seiten stürmen aus ihren Gräben am Dorfrand; dazwischen Häuserkampf um Friedhof, Dorfplatz und die Kirche, die am meisten zählt. Vom Turm sieht und schießt man weiter, schwere Granaten bringen die Kirche zum Einsturz.',
    armyMax: { A: 22, D: 23 },
    objectives: [
      { id: 'gutshof', name: 'Gutshof', c: 5, r: 2, pts: 1 },
      { id: 'friedhof', name: 'Friedhof', c: 8, r: 3, pts: 2 },
      { id: 'kirche', name: 'Kirche von Sankt Ruß', c: 8, r: 5, pts: 3 },   // 3 statt 4 (2026-11-20): die Kirche liegt näher an der Aschenwacht (Turm 3 Felder vor ihrem Graben, 7 vor dem des Konkordats); mit 4 nur 40 % fürs Konkordat
      { id: 'dorfplatz', name: 'Dorfplatz', c: 8, r: 7, pts: 2 },
      { id: 'wegkreuz', name: 'Wegkreuz', c: 10, r: 7, pts: 1 }],
    bauten: [{ art: 'kirche', name: 'Kirche von Sankt Ruß', felder: [[8, 5], [9, 5]], turm: [9, 4] }],
    ki: { D: { prog: 0.6, threat: 0.35, obj: 0.35, cover: 0.5 } },
    // Beide Seiten greifen an: Aschenwacht etwa gleich viel wert wie das Konkordat (940 zu 910 – ein Grenadier-Trupp mehr gleicht den ersten Zug aus), ohne Reserve zur Mitte der Schlacht
    army: { A: { kohorte: 5, mahlwerk: 2, koloss: 2, haubitze: 2, reiter: 1, pionier: 2, scharf: 1, moerser: 1, feldscher: 1, raeumer: 1, flammen: 1, generalA: 1, hauptA: 1 },   /* F94 (2026-11-22): gemischte Startarmeen, höchstens 5 vom selben Typ; vorher 8 Kohorten, 3 Mahlwerk, 3 Kolosse, 2 Donnerrohre, 2 Reiter, 2 Pioniere */
      D: { grenadier: 5, pionierD: 2, gasschutz: 2, sense: 2, geschuetz: 2, sturmpz: 2, sturm: 1, minenwerfer: 1, heiler: 1, generalD: 1, hauptD: 1 } },   /* vorher 11 Grenadiere, 3 Sensenwerk, 2 Geschütze, 2 Sturmpanzer, 2 Sprenglanzen, 1 Minenwerfer; Abgleich: feste Aufstellung 49,4 %, gemischt 77,5 % */
    grid: [
      '...=xg.gVg.x=f..',
      '.f.=.VV.gVgx=..,',
      '...=.g.V..V.=...',
      'o..=xVgghh.o=.o.',
      '..o=xoVghtg.=...',
      '...=.gggSSox=o..',
      '.o.=o.V...Vx=..o',
      '...=.V....g.=...',
      ',..=xgVgVVV.=.f.',
      '..f=x.gVg.gx=...'],
    deko: { '8,6': 'brunnen', '9,6': 'platz', '8,7': 'platzleer', '5,2': 'karren', '10,7': 'wegkreuz', '9,3': 'figur' },
    strasse: [[0, 6], [5, 6], [7, 7], [8, 7], [9, 7], [10, 7], [11, 7], [12, 7], [13, 7], [14, 7], [15, 7]],
    build() {
      const T = mapTools(16, 10, 1);
      this.grid.forEach((row, r) => [...row].forEach((ch, c) => T.set(c, r, GRID_CODE[ch] || 'open')));
      for (const [c, r] of T.path(this.strasse, 'road')) if (T.M[c] && T.M[c][r] && ['village', 'garten', 'wire'].includes(T.M[c][r].t) && !this.deko[c + ',' + r]) T.M[c][r].t = 'open';   // Straße frei halten
      for (const k in this.deko) { const [c, r] = k.split(',').map(Number); T.M[c][r].deko = this.deko[k]; }
      this.bauten.forEach((b, i) => { for (const [c, r] of [...b.felder, b.turm]) T.M[c][r].bau = i; });
      return T.M;
    } },
  // Winterdorf (Arbeitstitel, Enrico 2026-11-22, Plan entwurf/KARTE_WINTERDORF.md, Bauplan entwurf/karte_winterdorf/konzept_flux.png): Dorf am zugefrorenen Fluss,
  // noch fast heil. Konkordat von Westen (Dorfseite), Aschenwacht von Osten (Felder jenseits des Flusses). Eis trägt nur Fußvolk; Fahrzeuge über Steinbrücke oder Furt.
  // Raster: E Eis, H Haus (je eigener Bauzustand), C Kapelle, R Steinbrücke, F Furt, g Feld mit Zaun, W Tannenwald, f lichter Wald
  winterdorf: { id: 'winterdorf', name: 'Krähenfurt',   /* Name von Enrico (2026-11-22 17:30), intern weiter winterdorf */ size: 'Groß', cols: 18, rows: 12, zoneA: 2, zoneD: 14,   /* Paket C2 Punkt 36 (2026-11-24): zoneD 13 → 14 nach den Handgranaten (Konkordat 41,5 → 54 %) */ band: 5, nebelRand: true, winter: true,   /* Abgleich 2026-11-22: Aschenwacht stellt bis ans Ostufer auf (mit zoneD 15: Konkordat 97 %) */
    ki: { D: { prog: 0.6, threat: 0.35, obj: 0.35, cover: 0.5 } },   // wie Sankt Ruß: die Aschenwacht muss über den Fluss vorgehen
    desc: 'Ein verschneites Dorf am zugefrorenen Fluss, noch fast unversehrt. Das Eis trägt Fußtruppen, Fahrzeuge brauchen die Steinbrücke oder die Furt. Um Dorfplatz, Kapelle und Brücke wird gekämpft.',
    armyMax: { A: 24, D: 24 },
    objectives: [
      { id: 'teich', name: 'Teichufer', c: 4, r: 7, pts: 1 },
      { id: 'dorfplatz', name: 'Dorfplatz', c: 8, r: 5, pts: 3 },
      { id: 'kapelle', name: 'Kapelle', c: 11, r: 5, pts: 2 },
      { id: 'bruecke', name: 'Steinbrücke', c: 12, r: 8, pts: 2 },
      { id: 'gehoeft', name: 'Gehöft am Ostufer', c: 14, r: 3, pts: 1 }],
    get bauten() { const out = []; this.grid.forEach((row, r) => [...row].forEach((ch, c) => { if (ch === 'C') out.push({ art: 'kapelle', name: 'Kapelle', felder: [[c, r]] }); else if (ch === 'H') out.push({ art: 'haus', name: 'Haus', felder: [[c, r]] }); })); return out; },   // jedes H ein Haus, C die Kapelle
    army: { A: { kohorte: 5, mahlwerk: 3, koloss: 2, haubitze: 2, reiter: 1, pionier: 2, scharf: 1, moerser: 1, feldscher: 1, raeumer: 1, flammen: 1, generalA: 1, hauptA: 1 },
      D: { grenadier: 5, pionierD: 2, gasschutz: 2, sense: 2, geschuetz: 2, sturmpz: 2, sturm: 1, minenwerfer: 1, heiler: 1, generalD: 1, hauptD: 1 } },
    //         012345678901234567
    grid: [
      'WWWWWWWEWWWWWWWWWW',   //  0  Wald oben, Fluss kommt herein
      'WW..ggg.EE.ggggg.W',   //  1  Felder mit Zäunen
      'Wf..ggH..EE.ggg..W',   //  2  
      'Wf.....H.H.FE..H.W',   //  3  Furt (11,3), Gehöft (15,3)
      'Wf...H....H.EE..gW',   //  4  
      'W...H......C.E..gW',   //  5  Dorfplatz (8,5) mit Brunnen, Kapelle (11,5)
      'Wf....H......E.ggW',   //  6  
      'W......H.H..EE.ggW',   //  7  
      'W.EEE.......R..ggW',   //  8  Teich links, Steinbrücke (12,8)
      'WfEEE..f...EE...gW',   //  9  
      'Wf.E...ff.EE...ggW',   // 10  
      'WWWWWWWWWWEWWWWWWW'],   // 11  Fluss läuft unten hinaus
    deko: { '8,5': 'brunnen', '13,9': 'karren' },
    deckung: [],   // Punkt 12 (2026-11-24): vorbereitet, aber leer – Trichter in der Mitte (6,7/8,8) senkten das Konkordat von 41,5 auf 32,5 % (2 Startwerte), auf der Ostseite (14,6/14,8, Aufstellungszone der Aschenwacht) stieg es auf 84 %; Probe: KF_DECKUNG="6,7;8,8", ohne: KF_ALT=1
    strasse: [[0, 8], [4, 6], [7, 5], [8, 5], [9, 5], [11, 6], [12, 8], [14, 9], [17, 10]],
    strasse2: [[3, 0], [6, 3], [8, 5], [10, 7], [10, 9]],
    build() {
      const T = mapTools(18, 12, 1);
      this.grid.forEach((row, r) => [...row].forEach((ch, c) => T.set(c, r, ch === 'g' ? 'acker' : GRID_CODE[ch] || 'open')));
      if (!orteAlt()) { const w = TOG.KF_WRACK ? String(TOG.KF_WRACK).split(',').map(Number) : [6, 10]; T.set(w[0], w[1], 'wrack'); }   /* Messung: KF_WRACK=c,r; (8,8) vor der Brücke kostete das Konkordat 16 Punkte, (6,10) am Teich +4 */   // G6: ausgebranntes Koloss-Wrack westlich der Steinbrücke   // G4 (2026-11-25): 'g' ist hier Acker (gleiche Regel wie Garten)
      for (const w of [this.strasse, this.strasse2]) for (const [c, r] of T.path(w, 'road')) if (T.M[c] && T.M[c][r] && ['acker', 'garten', 'forest', 'wald'].includes(T.M[c][r].t)) T.M[c][r].t = 'open';   // Straßen frei halten
      for (const k in this.deko) { const [c, r] = k.split(',').map(Number); T.M[c][r].deko = this.deko[k]; }
      const dk = TOG.KF_DECKUNG != null ? String(TOG.KF_DECKUNG).split(';').filter(Boolean).map(x => x.split(',').map(Number)) : this.deckung;   // Messung: KF_DECKUNG="6,7;8,8"
      if (!TOG.KF_ALT) for (const [c, r] of dk) if (T.M[c][r].t === 'open' && !T.M[c][r].road) T.M[c][r].t = 'crater';
      this.bauten.forEach((b, i) => { for (const [c, r] of b.felder) T.M[c][r].bau = i; });
      return T.M;
    } },
};
let MAP = MAPS.grauwall, OBJECTIVES = MAPS.grauwall.objectives;
function useMap(id) {
  MAP = MAPS[id] || MAPS.grauwall;
  COLS = MAP.cols; ROWS = MAP.rows; OBJECTIVES = MAP.objectives;
  SIDES.D.edge = COLS - 1;
  return MAP;
}
function buildMap() { const M = MAP.build(1917); for (const o of OBJECTIVES) M[o.c][o.r].obj = o.id; return M; }

// ---------- Hex-Geometrie (flache Oberseite, ungerade Spalten nach unten versetzt) ----------
const AX = [[1, -1], [1, 0], [0, 1], [-1, 1], [-1, 0], [0, -1]];
const SQ3 = Math.sqrt(3);
function toAx(c, r) { return [c, r - (c - (c & 1)) / 2]; }
function fromAx(q, a) { return [q, a + (q - (q & 1)) / 2]; }
function inMap(c, r) { return c >= 0 && c < COLS && r >= 0 && r < ROWS; }
function neighbors(c, r) {
  const [q, a] = toAx(c, r), out = [];
  for (const [dq, da] of AX) { const [nc, nr] = fromAx(q + dq, a + da); if (inMap(nc, nr)) out.push([nc, nr]); }
  return out;
}
function step(c, r, k) { const [q, a] = toAx(c, r); return fromAx(q + AX[k][0], a + AX[k][1]); }
function dist(c1, r1, c2, r2) {
  const [q1, a1] = toAx(c1, r1), [q2, a2] = toAx(c2, r2);
  const dq = q1 - q2, da = a1 - a2;
  return Math.max(Math.abs(dq), Math.abs(da), Math.abs(dq + da));
}
function pos(c, r) { return [1.5 * c, SQ3 * (r + 0.5 * (c & 1))]; }
function angleTo(c1, r1, c2, r2) {
  const [x1, y1] = pos(c1, r1), [x2, y2] = pos(c2, r2);
  return (Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI + 360) % 360;
}
function faceIndex(angle) { return Math.round(angle / 60) % 6; }
// Blickrichtung zu einem Feld. Genau senkrecht (gerade hoch/runter) liegt zwischen zwei Richtungen: dann die bisherige Seite (links/rechts)
// behalten, sonst kippt die Figur bei jedem senkrechten Schritt (Spieltest 2026-11-17: „dreht sich nach dem Einzug in den Graben zurück“).
const faceLeft = f => f === 2 || f === 3 || f === 4;
function faceToward(f0, c1, r1, c2, r2) {
  if (c1 === c2 && r1 === r2) return f0;
  const a = angleTo(c1, r1, c2, r2);
  if (Math.abs(a - 90) < 1) return faceLeft(f0) ? 2 : 1;
  if (Math.abs(a - 270) < 1) return faceLeft(f0) ? 4 : 5;
  return faceIndex(a);
}
function angDiff(a, b) { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; }
// MG-Schussfächer (Wunsch 2026-11-16): drei Feldseiten in Blickrichtung (vorn, schräg links und rechts), also ±90°. Außerhalb weder Schuss
// noch Reaktionsfeuer. Drehen (frei) richtet den Fächer aus. Andere Einheiten schießen rundum. Abschalter für die Sim: NOFAN.
const MG_FAN = 90;
function fanOf(u, zweit) { const T = TYPES[u.type]; return T.mg ? MG_FAN : T.cls === 'walker' ? (zweit ? P.ZWEIT_FAN : P.FZ_FAN) : 180; }   // halber Schusswinkel in Grad (180 = rundum)
function inFan(G, u, c, r, zweit) { const f = fanOf(u, zweit); if (f >= 180 || TOG.NOFAN || (u.c === c && u.r === r)) return true; return angDiff(angleTo(u.c, u.r, c, r), u.face * 60) <= f + 1; }
const key = (c, r) => c * 100 + r;
function line(c1, r1, c2, r2) {
  const n = dist(c1, r1, c2, r2), out = [];
  const [q1, a1] = toAx(c1, r1), [q2, a2] = toAx(c2, r2);
  for (let i = 1; i < n; i++) {
    const t = i / n + 1e-6;
    let q = q1 + (q2 - q1) * t, a = a1 + (a2 - a1) * t, s = -q - a;
    let rq = Math.round(q), ra = Math.round(a), rs = Math.round(s);
    const dq = Math.abs(rq - q), da = Math.abs(ra - a), ds = Math.abs(rs - s);
    if (dq > da && dq > ds) rq = -ra - rs; else if (da > ds) ra = -rq - rs;
    out.push(fromAx(rq, ra));
  }
  return out;
}

// ---------- Spielstand ----------
// Aktionspunkte: jede Einheit hat je Runde P.AP (2). Ziehen 1, Schießen 1 (MG 2), Steilfeuer 2 (Mörser 1), Nahkampf alle,
// Befehl, Versorgen, Draht 1. Je Runde höchstens ein Angriff. `moved` heißt: keine Punkte mehr zum Ziehen.
function spend(u, n) { u.ap = Math.max(0, (u.ap || 0) - n); u.moved = u.ap <= 0 && !(u.bp > 0); }
// Bewegungspunkte je Klasse (Vorschlag entwurf/BP_AP_VORSCHLAG.md): Reiter, Fahrzeuge und Schreiter +1 gegenüber der alten Zugweite, Geschütz abgeprotzt 0 / aufgeprotzt LIMBER_MV
function bpMax(u) { const T = TYPES[u.type]; if (T.cls === 'art') return T.mobile || T.fahrbar ? T.mv : (u.limbered ? P.LIMBER_MV : 0); return T.cls === 'cav' || T.cls === 'walker' ? T.mv + 1 : T.mv; }
function fahrzeugArt(u) { const T = TYPES[u.type]; return T.cls !== 'walker' ? null : T.mech && u.type !== 'bohrer' ? 'schreiter' : 'fahrzeug'; }
function addUnit(G, type, c, r, officer) {   // MG stehen zu Spielbeginn aufgebaut (siehe newGame)
  const T = TYPES[type];
  const u = { id: G.nextId++, type, side: T.side, c, r, officer: T.cmd ? officer || (T.cmd === 2 ? 'General' : 'Hauptmann') : null, ap: P.AP, bp: 0, bpUsed: 0,
    str: 10, mor: T.mor, face: T.side === 'A' ? 0 : 3, status: 'ok',
    moved: false, attacked: false, sperr: 0, supp: 0, fireDmg: 0, turnOnly: false,
    run: 0, broken: 0, gassed: false, seenWalker: false, limbered: false, gas: T.gas || 0, mines: T.mines || 0, startC: c, startR: r };   // Minen auch für gekaufte Trupps
  u.bp = bpMax(u); G.units.push(u);
  return u;
}
// ---------- Armee-Auswahl ----------
// Jede Seite darf vor der Schlacht für den Wert der Standardarmee selbst Truppen wählen.
function defaultArmy(side) { return Object.assign({}, MAP.army[side]); }
function armyCost(army) { let n = 0; for (const t in army) n += (COST[t] || 0) * army[t]; return n; }
function armyCount(army) { let n = 0; for (const t in army) n += army[t]; return n; }
const ARMY_BUDGET = {}, ARMY_MAX = {};   // je Karte, siehe armySync()
function armySync() { for (const sd of ['A', 'D']) { ARMY_BUDGET[sd] = armyCost(defaultArmy(sd)); ARMY_MAX[sd] = Math.max(MAP.armyMax[sd], Object.values(MAP.army[sd]).reduce((a, b) => a + b, 0) + 2); } ARMY_CAP = COLS * ROWS > 300 ? 16 : COLS * ROWS > 200 ? 13 : 9; for (const sd of ['A', 'D']) for (const t in MAP.army[sd]) ARMY_CAP = Math.max(ARMY_CAP, MAP.army[sd][t]); ARMY_WALKERS = COLS * ROWS > 300 ? 7 : COLS * ROWS > 200 ? 5 : 4; }
let ARMY_CAP = 9, ARMY_WALKERS = 4; const ARMY_MIN = { A: 8, D: 8 };   // je Typ höchstens 9, höchstens 4 Kolosse/Kampfmaschinen
const ROSTER = { A: SHOP.A.slice(), D: SHOP.D.slice() };
armySync();
function useMapArmy(id) { useMap(id); armySync(); return MAP; }
const isMech = t => !!TYPES[t] && !!TYPES[t].mech;
function armyOk(side, army, mechs) {
  for (const t in army) if (!ROSTER[side].includes(t) || (army[t] > 0 && isMech(t) && !mechs) || !(army[t] >= 0) || army[t] !== Math.floor(army[t])) return false;
  const n = armyCount(army); let walkers = 0;
  for (const t in army) { if (army[t] > ARMY_CAP) return false; if (TYPES[t].cls === 'walker') walkers += army[t]; }
  if (walkers > ARMY_WALKERS) return false;
  if (Object.keys(army).reduce((n, t) => n + (TYPES[t].stufe3 ? army[t] : 0), 0) > 1) return false;   // Stufe-3-Schreiter: höchstens einer je Armee
  if (Object.keys(army).reduce((n, t) => n + (TYPES[t].held ? army[t] : 0), 0) > 1) return false;   // Helden: höchstens einer je Armee
  if ((army.generalA || 0) + (army.generalD || 0) !== 1 || (army.hauptA || 0) + (army.hauptD || 0) > 3) return false;   // genau ein General je Armee (Pflicht, Spieltest 2026-11-17)
  return armyCost(army) <= ARMY_BUDGET[side] && n >= ARMY_MIN[side] && n <= ARMY_MAX[side];
}
function rowsOut() { const m = Math.floor(ROWS / 2), out = [m]; for (let k = 2; out.length < ROWS; k += 2) { for (const r of [m - k, m + k]) if (r >= 0 && r < ROWS) out.push(r); if (k > ROWS) break; } for (let r = 0; r < ROWS; r++) if (!out.includes(r)) out.push(r); return out; }
function deploy(G, side, army) {
  // Reihenfolge: Typen abwechselnd, damit sich die Truppen über die Front verteilen
  const left = Object.assign({}, army), list = [];
  for (let more = true; more;) { more = false; for (const t of ROSTER[side]) if (left[t] > 0) { left[t]--; list.push(t); more = true; } }
  if (G.mischen) for (let i = list.length - 1; i > 0; i--) { const j = Math.floor(G.rng() * (i + 1)); [list[i], list[j]] = [list[j], list[i]]; }   // nur Tests (sim.js MISCHEN=1): Aufstellung je Schlacht anders
  const ROWS_OUT = rowsOut(), zA = MAP.zoneA;
  const lead = () => null;   // Offiziere nur noch als eigene Einheiten (Hauptmann/General mit Stab), keine Titel mehr für Schützen (Spieltest 2026-11-17)
  const free = (t, c, r) => inMap(c, r) && !unitAt(G, c, r) && cost(G, { type: t, side }, c, r) < 99;
  if (TOG.AUFSTELLUNG_NEU) return deployZone(G, side, list, lead, free);   // Versuch 2026-11-22 (Enrico 17:30): beide Seiten nach Rollen – noch nicht Standard: fest/gemischt teils weiter weit auseinander, Krähenfurt 80–100 % (siehe BERICHT)
  if (side === 'A') {
    const pref = t => { const T = TYPES[t], k = T.cls === 'art' && !T.mobile ? 0 : (T.mobile || T.pin || T.relay || T.cls === 'cav' || T.cls === 'medic' || T.fig === 'bike') ? 1 : (T.cls === 'walker' || T.cls === 'mg') ? 2 : 3; return Math.round(k * zA / 3); };
    for (const t of list) {
      const p = pref(t); let done = false;
      for (const c of [p, p - 1, p + 1, p - 2, p + 2, p - 3, p + 3]) {
        if (c < 0 || c > zA || done) continue;
        for (const r of ROWS_OUT) if (free(t, c, r)) { addUnit(G, t, c, r, lead(t)); done = true; break; }
      }
    }
  } else if (true) deployD(G, list, lead, free);
  else {
    const back = [[16, 5], [15, 1], [15, 8], [17, 5], [16, 3]];
    const front = [[15, 4], [13, 6], [17, 1], [18, 9], [9, 4], [9, 8], [9, 0], [9, 2], [9, 6], [9, 10], [13, 2], [13, 9], [13, 4], [13, 8], [17, 3], [11, 5], [11, 1], [11, 9], [16, 7], [12, 3], [12, 7], [14, 5]];
    for (const t of list) {
      const T = TYPES[t], rear = T.cls === 'art' || T.cls === 'medic' || T.relay;
      const sl = (rear ? back.concat(front) : front.concat(back)).find(([c, r]) => free(t, c, r));
      if (sl) addUnit(G, t, sl[0], sl[1], lead(t));
    }
  }
}

// Robuste Aufstellung (Enrico 2026-11-22 17:30): beide Seiten nach Rollen in fester Folge – Fußtruppen/Nahkämpfer vorn, Fahrzeuge an Straßen und
// im Offenen, MG vorn in Deckung, Unterstützung (Sanität, Beobachter, Reiter, Mörser) und Geschütze hinten; je Platz bewertet (Deckung, Abstand,
// Nähe zu Fahnen, Tiefe in der Zone). Mischen (Tests) vertauscht nur innerhalb einer Rolle – so sind die Plätze gleich gut verteilt.
function deployZone(G, side, list, lead, free) {
  const zD = Math.max(MAP.zoneD, COLS - (+(TOG.M_band || 0) || MAP.band || P.D_BAND)), zA = MAP.zoneA, placed = [];
  const c0 = side === 'A' ? 0 : zD, c1 = side === 'A' ? zA : COLS - 1, tiefe = Math.max(1, c1 - c0);
  const dOf = c => side === 'A' ? (zA - c) / tiefe : (c - zD) / tiefe;   // 0 = vorderste Spalte der Zone, 1 = hinterste
  const role = t => { const T = TYPES[t]; return T.cmd ? 'back' /* Anführer hinten (stabilste Fassung: fest/gemischt höchstens 7 Punkte auseinander; vorn bzw. nah an der Front schwankte es um 40–55 Punkte) */ : T.cls === 'art' && !T.mobile ? 'art' : T.cls === 'walker' ? 'fz' : (T.cls === 'medic' || T.relay || T.mobile || T.spot || T.cls === 'cav' || T.abil === 'mark' || T.abil === 'smoke' || T.courier) ? 'back' : T.mg ? 'mg' : 'inf'; };
  const RANG = { inf: 0, fz: 1, fuehrung: 2, mg: 3, back: 4, art: 5 };
  const objs = OBJECTIVES.slice().sort((a, b) => b.pts - a.pts || a.c - b.c);
  const DECK = { trench: 3, village: 2.6, forest: 2, crater: 0.6, open: 0, mud: -1, wire: -4, bridge: 1, bunker: 3.6, fabrik: 3, kirche: 2.8, barrikade: 2.8, wald: 2.2, waldweg: 0.8, bahn: 1, furt: -2, sumpf: -2, schiff: 3.4, turm: 3.4, muehle: 3.2, wrack: 2.6, garten: 0.8, acker: 0.8, friedhof: 0.8, haus: 3.2, kapelle: 3.2, eis: -2, steinbruecke: 0.5 };
  const score = (t, c, r) => {
    const h = G.map[c][r], rl = role(t), d = dOf(c);
    let v = rl === 'fz' ? (h.road ? 2 : ['open', 'crater', 'grass'].includes(h.t) ? 1 : -1.5) : (DECK[h.t] || 0);   // Fahrzeuge: Straße und Offenes statt Deckung
    if (h.ridge) v += 1;
    for (const o of objs) { const dd = dist(c, r, o.c, o.r); if (dd === 0) v -= 50; else if (dd === 1) v += 1.2; }
    if (rl === 'art') v += d * 6 - (d < 0.45 ? 5 : 0);
    else if (rl === 'back') v += d * 3;
    else if (rl === 'mg') v += (1 - d) * 3;
    else if (rl === 'fz') v += (1 - Math.abs(d - 0.4)) * 2;
    else if (rl === 'fuehrung') { v += (1 - Math.abs(d - 0.45)) * 2.5; let n = 0; for (const p of placed) if (dist(c, r, p[0], p[1]) === 1) n++; v += Math.min(n, 3) * 2.2; }   // nah bei eigenen Trupps (gleicht den Abstands-Abzug aus)
    else v += (1 - d) * 3.2;   // Fußtruppen und Nahkämpfer vorn
    for (const p of placed) { const dd = dist(c, r, p[0], p[1]); if (dd <= 1) v -= 3.2; else if (dd === 2) v -= 1.2; else if (dd === 3) v -= 0.3; }
    return v;
  };
  const order = list.map((t, i) => [t, i]).sort((a, b) => RANG[role(a[0])] - RANG[role(b[0])] || a[1] - b[1]).map(x => x[0]);
  for (const t of order) {
    let best = null, bv = -1e9;
    for (let c = c0; c <= c1; c++) for (let r = 0; r < ROWS; r++) { if (!free(t, c, r)) continue; const v = score(t, c, r); if (v > bv) { bv = v; best = [c, r]; } }
    if (best) { addUnit(G, t, best[0], best[1], lead(t)); placed.push(best); }
  }
}
// Verteidiger auf neuen Karten: Besatzung für jedes Zielfeld, MG in die vorderen Gräben, Geschütze nach hinten,
// alles mit Abstand, damit die ganze Front besetzt ist.
function deployD(G, list, lead, free) {
  const zD = Math.max(MAP.zoneD, COLS - (+(TOG.M_band || 0) || MAP.band || P.D_BAND)), depth = COLS - zD, placed = [];   // Siegpunkt-Modus: beide starten am eigenen Rand
  const role = t => { const T = TYPES[t]; return T.cls === 'art' && !T.mobile ? 'art' : (T.cls === 'medic' || T.relay || T.mobile) ? 'back' : T.mg ? 'mg' : 'inf'; };
  const objs = OBJECTIVES.slice().sort((a, b) => b.pts - a.pts || a.c - b.c);
  const score = (t, c, r) => {
    const h = G.map[c][r], rl = role(t), d = (c - zD) / depth;
    let v = { trench: 3, village: 2.6, forest: 2, crater: 0.6, open: 0, mud: -1, wire: -4, bridge: 1, bunker: 3.6, fabrik: 3, kirche: 2.8, barrikade: 2.8, wald: 2.2, waldweg: 0.8, bahn: 1, furt: -2, sumpf: -2, schiff: 3.4, turm: 3.4, muehle: 3.2, wrack: 2.6, garten: 0.8, acker: 0.8, friedhof: 0.8 }[h.t] || 0;
    if (h.ridge) v += 1;
    for (const o of objs) { const dd = dist(c, r, o.c, o.r); if (dd === 0) v -= 50; else if (dd === 1) v += 1.2; }
    if (rl !== 'art' && rl !== 'back') v += (1 - d) * 2;   // Kampftruppen vorn im Band
    if (rl === 'art') v += d * 6 - (d < 0.45 ? 5 : 0);
    else if (rl === 'back') v += d * 3;
    else if (rl === 'mg') v += (1 - d) * 3;
    else v += (1 - d) * 1.2;
    for (const p of placed) { const dd = dist(c, r, p[0], p[1]); if (dd <= 1) v -= 3.2; else if (dd === 2) v -= 1.2; else if (dd === 3) v -= 0.3; }
    return v;
  };
  const order = list.slice().sort((a, b) => ({ inf: 0, mg: 1, back: 2, art: 3 }[role(a)] - { inf: 0, mg: 1, back: 2, art: 3 }[role(b)]));
  for (const t of order) {
    let best = null, bv = -1e9;
    for (let c = zD; c < COLS; c++) for (let r = 0; r < ROWS; r++) { if (!free(t, c, r)) continue; const v = score(t, c, r); if (v > bv) { bv = v; best = [c, r]; } }
    if (best) { addUnit(G, t, best[0], best[1], lead(t)); placed.push(best); }
  }
}

// Aufstellungsphase (Fahrplan 2, 2026-11-17): Startzone je Seite (Konkordat Spalten 0–zoneA, Aschenwacht das Band am eigenen Rand wie deployD);
// Einheiten darin frei setzen oder tauschen, „Automatisch aufstellen“ = Kartenvorgabe. G.aufstellung = Seite, solange sie aufstellt.
function startZone(G, side) {
  const zD = Math.max(MAP.zoneD, COLS - (+(TOG.M_band || 0) || MAP.band || P.D_BAND)), out = [];
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) if (side === 'A' ? c <= MAP.zoneA : c >= zD) out.push([c, r]);
  return out;
}
function inStartZone(G, side, c, r) { return startZone(G, side).some(h => h[0] === c && h[1] === r); }
function canPlaceStart(G, u, c, r) { return !!G.aufstellung && u.side === G.aufstellung && inMap(c, r) && inStartZone(G, u.side, c, r) && cost(G, u, c, r) < 99; }
function aufstellen(G, u, c, r) {   // setzen oder mit der Einheit dort tauschen
  if (!canPlaceStart(G, u, c, r)) return false;
  const o = unitAt(G, c, r); if (o === u) return true;
  if (o) { if (o.side !== u.side || !canPlaceStart(G, o, u.c, u.r)) return false; o.c = u.c; o.r = u.r; }
  u.c = c; u.r = r; return true;
}
function autoAufstellen(G, side) {   // Kartenvorgabe: Seite neu aufstellen wie beim Spielstart
  G.units = G.units.filter(u => u.side !== side);
  const army = G.armee && G.armee[side];
  deploy(G, side, army || defaultArmy(side));
  for (const u of G.units) if (u.side === side) { if (TYPES[u.type].mg) u.setup = true; if (TYPES[u.type].mines) u.mines = TYPES[u.type].mines; if (TYPES[u.type].counterStrike) u.cready = true; }
}
function newGame(opts) {
  opts = opts || {};
  useMapArmy(opts.map);
  const G = {
    mapId: MAP.id,
    map: buildMap(), units: [], turn: 1, side: 'A', over: null,
    rng: mulberry32(opts.seed != null ? opts.seed : (Date.now() & 0xffffffff)),
    mischen: !!opts.mischen, ctrl: {}, nextId: 1, clouds: [], smoke: [], lit: [], tunnels: [], mines: [], marks: [], fires: [], wind: 1, pts: { A: 0, D: 0 }, mechs: !!opts.mechs,
    kanten: null,   // R3: Deckung an Feldkanten (unten aus Karte und Gelände)
    bauten: (MAP.bauten || []).map(b => { const hp = +(TOG.M_kirche || 0) || (b.art === 'haus' ? P.HAUS_HP : b.art === 'kapelle' ? P.KAPELLE_HP : b.art === 'muehle' ? P.MUEHLE_HP : P.KIRCHE_HP); return { ...b, hp, max: hp, kaputt: false }; })   // große Gebäude mit Bauzustand (Kirche)
  };
  for (const o of OBJECTIVES) G.ctrl[o.id] = null;   // Zielfelder sind zu Beginn neutral (Wunsch des Nutzers)
  G.kanten = { ...kantenGelaende(G.map), ...kantenBau(MAP.id) };   // Punkt 103: Gelände-Kanten (Bild = Regel) und die gesetzten Kanten der Karte
  G.vp = { A: 0, D: 0 }; G.goal = +(TOG.M_goal || 0) || MAP.goal || Math.round(OBJECTIVES.reduce((n, o) => n + o.pts, 0) * P.GOAL_K);
  G.armee = {};
  for (const side of ['A', 'D']) {
    const army = opts.army && opts.army[side];
    if (army && (opts.free || armyOk(side, army, !!opts.mechs))) { deploy(G, side, army); G.armee[side] = army; }   // free: nur für Tests ohne Budgetgrenze
    else { G.armee[side] = defaultArmy(side); deploy(G, side, G.armee[side]); }
  }
  for (const u of G.units) { if (TYPES[u.type].mg) u.setup = true; if (TYPES[u.type].mines) u.mines = TYPES[u.type].mines; if (TYPES[u.type].counterStrike) u.cready = true; }   // MG stehen zu Spielbeginn aufgebaut
  return G;
}

const alive = u => u.status === 'ok' || u.status === 'rout';
const active = u => u.status === 'ok';
const cls = u => TYPES[u.type].cls;
function unitAt(G, c, r) { return G.units.find(u => alive(u) && u.c === c && u.r === r) || null; }
function hex(G, c, r) { return G.map[c][r]; }
function cloudAt(G, c, r) { return G.clouds.some(k => k.c === c && k.r === r); }

function adjEnemies(G, u) {
  const out = [];
  for (const [c, r] of neighbors(u.c, u.r)) { const o = unitAt(G, c, r); if (o && o.side !== u.side && active(o)) out.push(o); }
  return out;
}
function isZOC(G, c, r, side) {
  for (const [nc, nr] of neighbors(c, r)) { const o = unitAt(G, nc, nr); if (o && o.side !== side && active(o) && cls(o) !== 'art') return true; }
  return false;
}
function bannerAt(G, side, c, r) { return G.units.some(o => TYPES[o.type].banner && o.side === side && active(o) && dist(o.c, o.r, c, r) <= (o.planted ? P.BANNER_R_PLANTED : P.BANNER_R)); }
// Wer flieht nicht? Konkordat unter „Halten um jeden Preis“ (bis zum nächsten eigenen Zug) und alle Einheiten im Bereich eines aufgepflanzten Banners
function noFlee(G, u) { return !!u.holdB || G.units.some(o => TYPES[o.type].banner && o.planted && o.side === u.side && active(o) && dist(o.c, o.r, u.c, u.r) <= P.BANNER_R_PLANTED); }
function officerAt(G, side, c, r) {
  return G.units.some(o => o.officer && o.side === side && active(o) && dist(o.c, o.r, c, r) <= cmdRange(o));
}
// Flanken und Rücken mit Schadens-, Moral- und Gegenschlag-Wirkung haben nur Fahrzeuge: Kolosse, Schreiter, Sturmpanzer (Klasse walker).
// Infanterie, Reiter und Geschütze nicht (Paket 3, 2026-11-17). Die Lage (arcOf) zählt weiter für Deckung von vorn und das MG-Schussfeld.
function hasFlanks(T) { return T.cls === 'walker'; }
function arcOf(G, d, ac, ar) {
  const diff = angDiff(angleTo(d.c, d.r, ac, ar), d.face * 60);
  return diff <= 61 ? 'front' : diff <= 121 ? 'flank' : 'rear';
}

// ---------- Bewegung ----------
// Marsch: Fußtruppen und Reiter tauschen die Aktion gegen +50 % Bewegungspunkte, dürfen nicht neben dem Feind enden
function canMarch(u) { const k = cls(u); return k !== 'art' && k !== 'walker' && !u.limbered; }
function cost(G, u, c, r) {
  const t = hex(G, c, r).t, k = cls(u);
  if (!TOG.NOROAD && hex(G, c, r).road && TERRAIN[t].cost > 1 && !['wire', 'canal', 'trench', 'wald', 'sumpf', 'furt', 'eis', 'sperre', 'wrack'].includes(t) && k !== 'cav') return 1;   // Straße
  if (t === 'canal' || t === 'eisloch' || t === 'sperre') return 99;   // G6: Panzersperre – niemand kommt hinein
  if (t === 'wrack' && (k === 'cav' || k === 'walker' || k === 'art')) return 99;   // G6: Wrack nur für Fußtruppen
  if (t === 'eis' && (k === 'cav' || k === 'walker' || k === 'art')) return 99;   // Winterdorf: Eis trägt nur Fußvolk (auch nicht über eine Straße)
  if (KIRCHE.has(t) && (k === 'cav' || k === 'walker' || k === 'art' || TYPES[u.type].held)) return 99;   // Kirche: nur Fußtruppen und Anführer; K11 (Enrico 2026-11-22): Helden nicht ins Schiff und nicht auf den Turm
  if ((t === 'garten' || t === 'acker' || t === 'friedhof') && (k === 'walker' || k === 'art')) return 2;   // niedrige Mauern
  if (k === 'cav') { if (['wire', 'forest', 'wald', 'barrikade', 'fabrik'].includes(t)) return 99; if (t === 'crater' || t === 'trench') return 3; }
  if (k === 'walker') { const sch = fahrzeugArt(u) === 'schreiter';   // Fahrplan 2: Graben/Trichter teurer, Schreiter kommen durch Wald (3)
    if (t === 'bridge') return 99; if (t === 'forest' || t === 'wald') return sch ? 3 : 99; if (t === 'trench') return 2; if (t === 'crater') return sch ? 2 : 1;
    if (t === 'wire') return 1; if (t === 'furt' || t === 'sumpf') return 3; if (t === 'barrikade' || t === 'fabrik' || t === 'mud') return 2; }
  if (k === 'art') { if (['wire', 'forest', 'wald', 'furt', 'sumpf', 'barrikade', 'fabrik'].includes(t)) return 99; if (t === 'trench' || t === 'crater') return 2; if (t === 'mud') return 3; }
  return TERRAIN[t].cost;
}
function reachable(G, u, opt) {
  const res = new Map(), march = !!(opt && opt.march);
  if (!active(u) || u.supp > 0 || u.broken > 0 || u.stuck > 0 || u.zocStop) return res;
  if (TYPES[u.type].mg && u.setup && !TOG.NOSETUP) return res;   // aufgebautes MG zieht nicht (erst abbauen)
  if (u.planted) return res;   // aufgepflanztes Banner: erst aufnehmen
  if (u.dug && !TOG.NOAUSGRABEN) return res;
  if (TYPES[u.type].fessel && !u.eingeholt) return res;   // F70 (2026-11-21): aufgestiegener Ballon zieht nicht (erst einholen)   // F36 (2026-11-21): eingegraben – erst ausgraben (wie MG abbauen)
  if (TYPES[u.type].noMoveFire && u.attacked) return res;   // Minenwerfer: nach dem Feuern kein Zug
  const T = TYPES[u.type], free = T.cls === 'storm' || T.cls === 'walker';
  const retreat = !free && !TOG.NORETREAT && isZOC(G, u.c, u.r, u.side);   // Rückzug aus der Feindberührung: kostet die Aktion und alle restlichen BP
  if (retreat && (u.ap < 1 || u.attacked || march)) return res;   // Rückzug aus der Feindberührung: kostet die Aktion und alle restlichen BP
  if (march && (u.ap < 1 || u.attacked || !canMarch(u))) return res;   // Marsch: die Aktion für +50 % BP
  const voll = bpMax(u), mp = (u.bp || 0) + (march ? Math.floor(voll * P.MARSCH_BP) : 0);
  if (mp < 1) return res;
  // Dijkstra nach Zugkosten (kürzester Weg). Gefahren (Gas, Feuer) werden nicht umgangen; Draht und Feindberührung beenden den Zug dort.
  // Kein Feld mit einer Einheit darauf, auch nicht im Weg (Paket 3: eigene Truppen versperren den Weg, nie zwei Einheiten auf einem Feld).
  const run = (sc, sr, c0, first) => {
    const s0 = key(sc, sr), best = new Map([[s0, c0]]), prev = new Map(), queue = [[c0, sc, sr]];
    while (queue.length) {
      queue.sort((a, b) => a[0] - b[0]);
      const [cst, c, r] = queue.shift();
      if (cst > best.get(key(c, r))) continue;
      const here = key(c, r);
      if ((here !== s0 || !first) && ((hex(G, c, r).t === 'wire' && T.cls !== 'walker' && !wireProof(T)) || (!free && isZOC(G, c, r, u.side)) || (T.cls === 'walker' && RUINE.has(hex(G, c, r).t) && !TOG.NORUINE))) continue;   // F79: in Trümmern endet der Zug
      for (const [nc, nr] of neighbors(c, r)) {
        if (unitAt(G, nc, nr)) continue;
        const mc = cost(G, u, nc, nr);
        if (mc >= 99) continue;
        const nCost = cst + mc;
        if (nCost > mp && !(first && here === s0 && (u.bp || 0) >= voll && !march)) continue;   // ein Feld geht immer, wenn noch nichts verbraucht ist
        const k = key(nc, nr);
        if (best.has(k) && best.get(k) <= nCost) continue;
        best.set(k, nCost); prev.set(k, here); queue.push([nCost, nc, nr]);
      }
    }
    return { s0, best, prev };
  };
  const pathTo = (R, k) => { const path = []; let cur = k; while (cur !== R.s0) { path.unshift([Math.floor(cur / 100), cur % 100]); cur = R.prev.get(cur); } return path; };
  const start = key(u.c, u.r), R1 = run(u.c, u.r, 0, true);
  let R = R1, pre = [];
  if (opt && opt.via) {   // Wegpunkt: erst dorthin (kürzester Weg), von dort weiter mit der restlichen Zugweite
    const vk = key(opt.via[0], opt.via[1]);
    if (vk === start || !R1.best.has(vk) || unitAt(G, opt.via[0], opt.via[1])) return res;
    pre = pathTo(R1, vk); R = run(opt.via[0], opt.via[1], R1.best.get(vk), false);
  }
  for (const [k, cst] of R.best) {
    if (k === start || k === R.s0 && pre.length === 0) continue;
    const c = Math.floor(k / 100), r = k % 100;
    if (unitAt(G, c, r)) continue;
    if (march && (cst <= (u.bp || 0) || isZOC(G, c, r, u.side))) continue;   // Marsch nur für Felder jenseits der normalen BP, nicht in Feindberührung
    const path = pre.concat(k === R.s0 ? [] : pathTo(R, k));
    if (!path.length) continue;
    res.set(k, { c, r, cost: cst, path, rest: Math.max(0, mp - cst), march, retreat, via: opt && opt.via ? opt.via.slice() : null });
  }
  return res;
}
// Freischläge beim Rückzug: [{ a: Gegner, dmg, lo, hi }] – je Schlag etwa 10 Stärke (P.FREEBLOW, ±20 %), nur aktive, nicht niedergehaltene Nahkämpfer
function freeBlows(G, u) {
  const out = [];
  for (const [c, r] of neighbors(u.c, u.r)) { const e = unitAt(G, c, r);
    if (!e || e.side === u.side || !active(e) || e.supp > 0 || e.broken > 0 || !(TYPES[e.type].atk > 0) || cls(e) === 'art') continue;
    out.push({ a: e, dmg: P.FREEBLOW, lo: P.FREEBLOW * 0.8, hi: P.FREEBLOW * 1.2 }); }   // erwartet, kleinster und größter Wert (Vorschau)
  return out;
}
function nearestEnemy(G, u) {
  let best = null, bd = 1e9;
  for (const o of G.units) if (o.side !== u.side && active(o)) { const d = dist(u.c, u.r, o.c, o.r); if (d < bd) { bd = d; best = o; } }
  return best;
}
// Gepanzerte Infanterie (Kampfanzug, Rüstung, Brustpanzer): Draht verletzt sie nicht und hält sie nicht auf
function wireProof(T) { return T.cls !== 'walker' && !!(T.suit || T.wireProof); }
function openGround(G, c, r) { return ['open', 'mud', 'crater', 'wire', 'bridge', 'furt', 'sumpf', 'waldweg', 'bahn'].includes(hex(G, c, r).t); }

function moveUnit(G, u, c, r, forced) {   // forced: fester Weg (Sturmlauf), ohne Zugweiten-Prüfung
  const ev = [];
  const opt = forced || reachable(G, u).get(key(c, r)) || reachable(G, u, { march: true }).get(key(c, r));
  if (!opt) return ev;
  const T = TYPES[u.type];
  if (!opt.rush) { const vor = u.bp || 0; u.bp = opt.retreat ? 0 : Math.max(0, opt.rest != null ? opt.rest : vor - opt.cost); u.bpUsed = (u.bpUsed || 0) + Math.max(0, vor - u.bp); }   // Bewegung kostet nur BP
  u.run = 0; u.mvd = (u.mvd || 0) + 1; u.setup = false; u.ow = false;
  if (opt.march || opt.retreat) { u.attacked = true; u.ap = 0; if (opt.retreat) u.bp = 0; }
  u.moved = u.ap <= 0 && !(u.bp > 0);
  if (opt.march) ev.push({ t: 'march', u: u.id });
  if (opt.retreat) ev.push({ t: 'retreatmove', u: u.id });
  if (opt.retreat) {   // Freischlag (Paket 3): jeder angrenzende Gegner, der im Nahkampf angreifen kann, trifft mit halbem Nahkampfschaden
    for (const fb of freeBlows(G, u)) {
      if (!alive(u)) break;
      const dmg = fb.dmg * (0.8 + G.rng() * 0.4); u.str = Math.max(0, u.str - dmg);
      ev.push({ t: 'freeblow', a: fb.a.id, u: u.id, dmg });
      ev.push({ t: 'hit', u: u.id, dmg, str: u.str, morv: u.mor, freeblow: true });   // kein Moralverlust, kein Moralbruch allein dadurch
      if (u.str < 0.3) { killUnit(G, u, ev, 'destroyed'); ev.push(...checkEnd(G)); return ev; }
    }
  }
  const startC = u.c, startR = u.r;
  let seg = [[u.c, u.r]];
  const flush = () => { if (seg.length > 1) ev.push({ t: 'move', u: u.id, path: seg }); seg = [[u.c, u.r]]; };
  for (const [nc, nr] of opt.path) {
    u.face = faceToward(u.face, u.c, u.r, nc, nr);   // Blick in Zugrichtung schon unterwegs, damit er auch nach einem Halt (Mine, Draht, Sperrfeuer) stimmt
    u.c = nc; u.r = nr; u.run++; u.dug = false; seg.push([nc, nr]);
    const h = hex(G, nc, nr);
    const mi = G.mines.findIndex(k => k.c === nc && k.r === nr && k.side !== u.side);
    if (mi >= 0) {   // verdeckte Mine
      flush(); G.mines.splice(mi, 1); ev.push({ t: 'mine', u: u.id, c: nc, r: nr });
      applyDamage(G, null, u, P.MINE_DMG * (0.8 + G.rng() * 0.4), 'front', ev, { ranged: true });
      if (alive(u) && T.cls === 'walker') { u.broken = Math.max(u.broken || 0, 2); ev.push({ t: 'breakdown', u: u.id }); }
      u.ap = 0; u.bp = 0; u.moved = true; claimObjective(G, u); ev.push(...checkEnd(G)); return ev;
    }
    if (T.cls === 'walker' && h.t === 'wire') { h.t = 'open'; flush(); ev.push({ t: 'crush', u: u.id, c: nc, r: nr }); }
    if (fireAt(G, nc, nr)) { flush(); burn(G, u, ev); if (!alive(u) || u.status !== 'ok') { claimObjective(G, u); ev.push(...checkEnd(G)); return ev; } }   // durch Feuer
    if (h.t === 'wire' && T.cls !== 'walker' && !wireProof(T)) u.bp = 0;   // Draht: Halt, restliche BP verfallen
    if (T.cls === 'walker' && RUINE.has(h.t) && !TOG.NORUINE) { u.bp = 0; if (G.rng() < P.RUINE_FEST) { flush(); u.stuck = panneDauer(G); ev.push({ t: 'stuck', u: u.id, truemmer: true }); break; } }   // F79: Trümmer kosten alle restliche Bewegung, Festfahr-Gefahr
    if (h.t === 'wire' && T.cls !== 'walker' && !wireProof(T) && !TOG.NOWIREDMG) {   // Stacheldraht: Schnitte und Hängenbleiben kosten Stärke
      flush(); ev.push({ t: 'wirehurt', u: u.id, c: nc, r: nr });
      const n0 = ev.length; applyDamage(G, null, u, P.WIRE_DMG * (0.8 + G.rng() * 0.4), 'front', ev, { morMul: 0.5 });
      for (let i = n0; i < ev.length; i++) if (ev[i].t === 'hit') ev[i].wire = true;   // Anzeige: kleines, dunkles Blut
      if (!alive(u) || u.status !== 'ok') { claimObjective(G, u); ev.push(...checkEnd(G)); return ev; }
    }
    claimObjective(G, u);
    if (T.cls === 'walker' && (h.t === 'mud' || h.t === 'sumpf') && G.rng() < P.STUCK * (h.t === 'sumpf' ? 2 : 1)) { flush(); u.stuck = panneDauer(G); u.bp = 0; ev.push({ t: 'stuck', u: u.id }); break; }
    if (T.stecken && ['mud', 'sumpf', 'trench'].includes(h.t) && G.rng() < P.STECKEN) { flush(); u.stuck = 2; u.bp = 0; ev.push({ t: 'stuck', u: u.id }); break; }   // Held Kürassier: eine eigene Runde fest
    if (T.cls !== 'walker' && openGround(G, nc, nr)) {
      const mg = !concealed(G, u, -99, -99) && G.units.find(m => m.side !== u.side && active(m) && TYPES[m.type].mg && m.sperr > 0 && m.setup && !m.supp && !m.fellBack && !held(G, m) &&
        dist(m.c, m.r, nc, nr) <= rangeOf(G, m, nc, nr) && hasLOS(G, m.c, m.r, nc, nr) && inFan(G, m, nc, nr));
      if (mg) {
        flush();
        mg.sperr--;
        ev.push(...resolveFire(G, mg, u, true));
        if (u.status !== 'ok' || u.c !== nc || u.r !== nr || u.supp > 0) { ev.push(...checkEnd(G)); return ev; }
      }
    }
    // Feuerbereitschaft: der erste Gegner, der sich in Reichweite und Sicht bewegt, wird beschossen (einmal)
    const ow = !concealed(G, u, -99, -99) && G.units.find(m => m.side !== u.side && m.ow && active(m) && !m.supp && !held(G, m) && !immune(TYPES[m.type], T) &&
      dist(m.c, m.r, nc, nr) <= rangeOf(G, m, nc, nr) && hasLOS(G, m.c, m.r, nc, nr));
    if (ow) {
      flush();
      ow.ow = false;
      ev.push(...resolveFire(G, ow, u, true, P.OW_DMG));
      if (u.status !== 'ok' || u.c !== nc || u.r !== nr || u.supp > 0) { ev.push(...checkEnd(G)); return ev; }
    }
  }
  flush();
  ev.push({ t: 'face', u: u.id, face: u.face });
  if (T.cls === 'walker') {
    if (TOG.ENTSETZ_ALT && !opt.keineFurcht) for (const e of G.units) if (e.side !== u.side && active(e) && !e.seenWalker && cls(e) !== 'walker' && dist(e.c, e.r, u.c, u.r) <= 2) {   // Enrico 2026-11-22: Sturmrollen-Anlauf (keineFurcht) löst keine Kolossfurcht aus
      e.seenWalker = true; e.mor = Math.max(0.5, e.mor - P.WALKER_FEAR);
      ev.push({ t: 'fear', u: e.id, morv: e.mor });
    }
    if (G.rng() < P.BREAKDOWN) { u.broken = panneDauer(G); u.attacked = true; ev.push({ t: 'breakdown', u: u.id }); }   // fällt die nächsten 3 eigenen Runden aus
  }
  if (P.ZOC_STOP && T.cls !== 'storm' && T.cls !== 'walker' && isZOC(G, u.c, u.r, u.side)) { u.zocStop = true; u.bp = 0; }   // Feindberührung beendet die Bewegung für die Runde
  ev.push(...checkEnd(G));
  if (alive(u) && u.status === 'ok') counterStrike(G, u, ev);
  return ev;
}
function drehKosten(u, face) { if (cls(u) !== 'walker' || TOG.NODREH) return 0; const f = face == null ? (u.face + 1) % 6 : ((face % 6) + 6) % 6, d = Math.abs(f - u.face) % 6; return Math.min(d, 6 - d) * P.DREH_BP; }
function turnUnit(G, u, face) {
  if (!active(u) || u.supp > 0 || u.broken > 0) return [];
  const f = ((face % 6) + 6) % 6; if (f === u.face) return [];
  const k = drehKosten(u, f); if (k) { if ((u.bp || 0) < k) return []; u.bp -= k; u.moved = u.ap <= 0 && !(u.bp > 0); }   // Fahrzeuge und Schreiter: 1 BP je 60°; übrige Einheiten drehen kostenlos
  u.face = f;
  return [{ t: 'face', u: u.id, face: u.face }];
}
// Aufprotzen: Geschütz an die Pferde hängen (zieht dann 4 Felder, feuert nicht). Abprotzen: wieder feuerbereit ab der nächsten Runde.
function canLimber(G, u) {
  if (!active(u) || !TYPES[u.type].limber || u.supp > 0) return false;
  return u.limbered ? true : !u.attacked;   // Abprotzen kostet alle BP, Aufprotzen 1 BP (vom neuen Vorrat)
}
function limber(G, u) {
  if (!canLimber(G, u)) return [];
  if (u.limbered) { u.limbered = false; u.bp = 0; if (!TYPES[u.type].direkt) { u.attacked = true; u.abgeprotzt = true; } u.moved = u.ap <= 0; }   // F103: Feldkanone schnell abgeprotzt, darf noch schießen
  else { u.limbered = true; u.attacked = true; u.bp = Math.max(0, P.LIMBER_MV - 1); u.bpUsed = 0; }
  return [{ t: 'limber', u: u.id, on: u.limbered }];
}
// Draht schneiden (Spieltest Runde 2, Paket 8): nur die Drahtschneider (cutter: Graben-Pioniere, Grabenräumer, Drahtpioniere, Sturmbrecher), 1 Punkt,
// vom Nachbarfeld (oder dem eigenen Feld) aus, ohne hineinzulaufen und ohne Drahtschaden; kostet die Aktion, danach darf die Einheit noch ziehen. Kolosse walzen Draht nieder.
function cutTargets(G, u) { const T = TYPES[u.type]; if (!active(u) || !T.cutter || u.side !== G.side || u.supp > 0 || u.ap < 1) return [];
  return [[u.c, u.r], ...neighbors(u.c, u.r)].filter(([c, r]) => inMap(c, r) && hex(G, c, r).t === 'wire' && !(unitAt(G, c, r) && unitAt(G, c, r).side !== u.side)); }
function canCut(G, u, c, r) { const t = cutTargets(G, u); return c == null ? t.length > 0 : t.some(h => h[0] === c && h[1] === r); }
function cutWire(G, u, c, r) {
  const t = cutTargets(G, u); if (!t.length) return [];
  if (c == null) [c, r] = t[0]; else if (!t.some(h => h[0] === c && h[1] === r)) return [];
  hex(G, c, r).t = 'open'; spend(u, 1); u.face = faceToward(u.face, u.c, u.r, c, r);
  return [{ t: 'cut', u: u.id, c, r }];
}

// ---------- Kampf ----------
function rangeOf(G, a, tc, tr) {
  let rng = TYPES[a.type].rng || 0;
  if (rng > 1 && hex(G, a.c, a.r).ridge && !hex(G, tc, tr).ridge) rng += 1;
  if (rng >= 1 && (hex(G, a.c, a.r).t === 'turm' || hex(G, a.c, a.r).t === 'muehle')) rng += P.TURM_RNG;   // G6: Windmühle wie Kirchturm   // Kirchturm: weiter schießen
  return rng;
}
function smokeAt(G, c, r) { return !!(G.smoke && G.smoke.some(k => k.c === c && k.r === r)); }
function litAt(G, c, r, side) { return !!(G.lit && G.lit.some(k => k.c === c && k.r === r && k.side === side)); }
// Getarnt (Pirschjäger): nur aus dem Nachbarfeld angreifbar, bis er geschossen hat
function concealed(G, d, c, r) { return !!TYPES[d.type].hidden && !(d.revealed > 0) && dist(c, r, d.c, d.r) > 1; }
// Nebelwand (2026-11-18): Wer IM Nebel steht, ist sichtbar und schießt heraus (Schaden siehe preview: ×0,5 auf ihn, ×0,75 von ihm);
// eine Sichtlinie, die nur DURCH den Nebel geht (Schütze und Ziel außerhalb), ist gesperrt.
function hasLOS(G, c1, r1, c2, r2, aerial) {
  const drin = smokeAt(G, c2, r2) || smokeAt(G, c1, r1);
  for (const [c, r] of line(c1, r1, c2, r2)) {
    if (!inMap(c, r)) continue;
    if (!drin && smokeAt(G, c, r)) return false;
    if (aerial) continue;
    if (!inMap(c, r)) continue;
    const t = hex(G, c, r).t;
    if (t === 'forest' || t === 'village' || t === 'wald' || t === 'fabrik' || t === 'kirche' || t === 'wrack' || KIRCHE.has(t)) return false;
  }
  return true;
}
function surrounded(G, u) {
  const adj = adjEnemies(G, u);
  if (adj.length >= 3) return true;
  if (!adj.length) return false;
  return !retreatHex(G, u, null);
}
// Größe: Fußtruppen 1, Reiter/Kampfanzüge/Geschütze 2, Kolosse und Kampfmaschinen 3.
// Im Nahkampf gebunden (Wunsch des Nutzers): steht ein gleich großer oder größerer Gegner im Nachbarfeld, kann die Einheit nicht schießen. Flammenwerfer sind ausgenommen.
function sizeOf(u) { const T = TYPES[u.type]; return T.cls === 'walker' ? 3 : (T.cls === 'cav' || T.suit || (T.cls === 'art' && !T.mobile)) ? 2 : 1; }
function heldAt(G, u, c, r) {
  if (TYPES[u.type].flame || TOG.NOHELD) return false;
  const sz = sizeOf(u);
  for (const [a, b] of neighbors(c, r)) { const o = unitAt(G, a, b); if (o && o.side !== u.side && o.status === 'ok' && alive(o) && sizeOf(o) >= sz) return true; }
  return false;
}
function held(G, u) { return heldAt(G, u, u.c, u.r); }
// ---------- F66 (2026-11-21): Schere-Stein-Papier – Waffenart gegen Panzerklasse, feste Faktoren ×1,5 / ×1 / ×0,5 ----------
// Panzerklasse: U ungepanzert, L leicht (Kampfanzüge, Löwenoger), S schwer (Fahrzeuge, Schreiter). Waffenart aus den Werten (Text und Werte stimmen so immer überein).
const FAK = { gewehr: { U: 1, L: 0.5, S: 0 }, schrot: { U: 1.5, L: 1, S: 0 }, at: { U: 0.5, L: 1.5, S: 1.5 }, kanone: { U: 1, L: 1, S: 1 },
  explosiv: { U: 1, L: 1, S: 0.5 }, flamme: { U: 1, L: 1, S: 0.5 }, klinge: { U: 1, L: 0.5, S: 0.5 }, schwer: { U: 1.5, L: 1, S: 1 },
  saege: { U: 1, L: 1.5, S: 1.5 }, klaue: { U: 2, L: 0.75, S: 0.5 } };   // F103: Sägeschreiter gegen Gepanzerte, Klauenschreiter gegen Fußtruppen (packen und schleudern)
const WAFFE_NAME = { saege: 'Panzersäge', klaue: 'Stahlklaue', gewehr: 'Gewehr/MG', schrot: 'Schrot', at: 'panzerbrechend', kanone: 'Kanone', explosiv: 'Sprenggranate', flamme: 'Flamme', klinge: 'Klinge/Kolben', schwer: 'schwerer Nahkampf' };
const KLASSE_NAME = { U: 'ungepanzert', L: 'leicht gepanzert', S: 'schwer gepanzert' };
const NAH_SCHWACH = ['mahlwerk', 'sense', 'haubitze', 'geschuetz', 'moerser', 'minenwerfer', 'feldkanone', 'scharf', 'pirsch', 'feldscher', 'heiler', 'werkstatt', 'munition', 'melder', 'signal', 'fernsprech', 'ballon'];
const NAH_STARK = ['sturm', 'raeumer', 'eingreif', 'schildwall', 'schwer', 'oger', 'stahl', 'panzerk', 'huenen'];
function panzerKl(t) { const T = TYPES[t]; return T.cls === 'walker' ? 'S' : (T.suit || t === 'oger') ? 'L' : 'U'; }
function waffeArt(t, ranged) { const T = TYPES[t];
  if (!ranged) return t === 'saeger' ? 'saege' : t === 'klaue' ? 'klaue' : T.cls === 'walker' || t === 'oger' || T.held ? 'schwer' : 'klinge';
  if (T.flame || T.cls === 'flame') return 'flamme';
  if (T.cls === 'art' || T.lob) return 'explosiv';
  if (t === 'oger') return 'schrot';
  if (T.at) return 'at';
  if (T.cls === 'walker' && !T.gat) return 'kanone';
  return 'gewehr'; }
const nahRolle = t => TOG.NOROLLE ? null : NAH_SCHWACH.includes(t) ? 'schwach' : NAH_STARK.includes(t) ? 'stark' : null;
// F80 (Enrico 2026-11-21): keine „geballte Ladung ×1,5“ im Nahkampf mehr – Sturmtrupps schlagen normal zu; Panzerabwehr über die Fähigkeit Panzergranate (Sturmbrecher, Grabenräumer, Eingreiftrupp) bzw. Haftladung (Pioniere)
function faktor(a, d, ranged) {   // Sim-Abschalter NOFAK (Tabelle), NOROLLE (Nahkampf-Rollen)
  if (TOG.NOFAK) return { f: 1, txt: '' }; const kl = panzerKl(d);
  const w = waffeArt(a, ranged); return { f: FAK[w][kl], txt: WAFFE_NAME[w] + ' gegen ' + KLASSE_NAME[kl], w, kl }; }
// Medaillen im Panel: gegen Infanterie (Schuss gegen ungepanzert), gegen Panzer (Schuss bzw. Ladung gegen schwer), Nahkampf (gegen ungepanzert, mit Rolle)
function medaillen(t) { const T = TYPES[t], fern = T.rng > 0 || T.cls === 'art';
  const stufe = f => f >= 1.5 ? 'gold' : f >= 1 ? 'silber' : 'bronze';
  const inf = fern ? FAK[waffeArt(t, true)].U : 0;
  const pz = Math.max(fern ? FAK[waffeArt(t, true)].S : 0, T.abil === 'pzgranate' || T.abil === 'charge' ? 1.5 : 0, t === 'oger' ? FAK.schwer.S : 0);   // Panzergranate bzw. Haftladung
  const r = nahRolle(t), nah = r === 'schwach' ? 0.5 : r === 'stark' ? 1.5 : FAK[waffeArt(t, false)].U;
  return { inf: fern ? stufe(inf) : 'keine', panzer: pz > 0 ? stufe(pz) : 'keine', nah: T.atk > 0 ? stufe(nah) : 'keine', fInf: fern ? inf : 0, fPz: pz, fNah: nah, rolle: r, klasse: panzerKl(t), waffe: fern ? waffeArt(t, true) : null }; }
function immune(A, D) { return D.cls === 'walker' && !A.at && (A.cls === 'inf' || A.cls === 'mg' || A.cls === 'cav' || A.cls === 'storm' || !!A.gat); }   // F66: auch Drehlauf-Schreiter (Gewehr/MG) prallen an Panzerung ab
function nahFrei(a) { const T = TYPES[a.type]; return T.cls === 'cav' || T.cls === 'storm' || !!T.suit || !!T.nahSchreiter || !!a.sturmlauf || (a.bpUsed || 0) <= bpMax(a) / 2; }
// F31 (2026-11-20): Nahkampf-Schreiter (Ordens-, Säge-, Klauenschreiter, Eisenknecht, Kreuzschreiter) dürfen nach mehr als halber Bewegung noch in den Nahkampf, schießen dann aber nicht mehr
const NAH_SCHREITER = ['orden', 'saeger', 'klaue', 'knecht', 'kreuz'];
for (const t of NAH_SCHREITER) if (TYPES[t]) TYPES[t].nahSchreiter = true;
function schussNachZug(a) { return !(TYPES[a.type].nahSchreiter && (a.bpUsed || 0) > bpMax(a) / 2); }   // Nahkampf nur mit höchstens halb verbrauchten BP
function canMelee(G, a, d) {
  return !(TYPES[a.type].keinNah && !TOG.NAHPANZER) && active(a) && a.ap >= 1 && !a.attacked && !a.broken && !(a.supp > 0 && !TOG.NOSUPP) && TYPES[a.type].atk > 0 && alive(d) && d.side !== a.side && dist(a.c, a.r, d.c, d.r) === 1 && nahFrei(a);
}
// Dauerfeuer (2026-11-20): nach der ersten Salve der Runde ist eine zweite frei (dfN 1), danach kühlt das MG eine eigene Runde lang ab (kuehl)
function dauerOk(a) { const T = TYPES[a.type]; return !!T.dauerfeuer && a.attacked && (a.dfN || 0) === 1 && !(a.kuehl > 0) && !a.fellBack && !(a.supp > 0); }
function canFire(G, a, d) {
  const T = TYPES[a.type];
  const bs = T.broadside && a.attacked && (a.bsT || []).length === 1 && !a.bsT.includes(d.id) && dist(a.c, a.r, d.c, d.r) <= 2;   // Breitseite: zweiter Schuss
  const df = dauerOk(a);   // Dauerfeuer (Eiserne Hünen): zweite Salve in derselben Runde
  if (T.dauerfeuer && a.kuehl > 0) return false;   // MG kühlt ab
  if (!active(a) || (a.attacked && !bs && !df) || a.broken || !T.rng || T.cls === 'art' || !alive(d) || d.side === a.side) return false;
  if ((a.ap < 1 && !bs && !df) || (T.mg && !a.setup && !TOG.NOSETUP)) return false;
  if (T.standSchuss && a.mvd) return false;   // Scharfschützen: nur aus dem Stand   // MG muss aufgebaut sein; zweiter Schuss der Breitseite gehört zur Aktion
  if ((a.supp > 0 && !TOG.NOSUPP) || a.fellBack || held(G, a)) return false;   // niedergehalten, zurückgewichen oder im Nahkampf gebunden
  if (!schussNachZug(a)) return false;   // F31
  if (immune(T, TYPES[d.type])) return false;
  const dd = dist(a.c, a.r, d.c, d.r);
  if (concealed(G, d, a.c, a.r)) return false;
  if (!inFan(G, a, d.c, d.r, bs)) return false;   // MG nur im Schussfächer; Fahrzeuge/Schreiter: Hauptwaffe nach vorn, zweiter Schuss der Breitseite auch seitlich
  return dd >= 1 && dd <= rangeOf(G, a, d.c, d.r) && hasLOS(G, a.c, a.r, d.c, d.r);
}
function defMods(G, d, arc, ranged, tags, noTrench, lob) {
  const t = hex(G, d.c, d.r).t;
  let m = 1;
  if (t === 'trench' && (ranged || arc === 'front')) {
    if (noTrench) tags.push(lob ? 'Bogenwurf: kein Grabenschutz' : 'Handgranaten: kein Grabenschutz'); else { m *= P.TRENCH_DEF; tags.push('Graben ×1,6'); }
  }
  if (t === 'crater' && ranged) { m *= P.CRATER_FIRE; tags.push('Trichter ×1,2'); }
  if (t === 'village') { if (cls(d) === 'walker') { m *= 0.7; tags.push('Koloss in Ruinen ×0,7'); } else { m *= P.VILLAGE_DEF; tags.push('Ruinen ×1,5'); } }
  if (t === 'forest') { m *= P.FOREST_DEF; tags.push('Totholz ×1,4'); }
  if (t === 'wire') { m *= P.WIRE_DEF; tags.push('im Draht ×0,6'); }
  const wk = cls(d) === 'walker';
  if (t === 'furt') { m *= 0.8; tags.push('in der Furt ×0,8'); }
  if (t === 'wald') { m *= 1.5; tags.push('Wald ×1,5'); }
  if (t === 'waldweg') { m *= 1.2; tags.push('Waldweg ×1,2'); }
  if (t === 'bunker') { if (lob) tags.push('Bogenwurf: kein Bunkerschutz'); else { m *= 2; tags.push('Bunker ×2'); } }
  if (t === 'fabrik') { m *= wk ? 0.7 : 1.7; tags.push(wk ? 'Koloss in Ruinen ×0,7' : 'Fabrik ×1,7'); }
  if (t === 'kirche') { m *= wk ? 0.7 : 1.5; tags.push(wk ? 'Koloss in Ruinen ×0,7' : 'Kirche ×1,5'); }
  if (KIRCHE.has(t)) { m *= gebDef(t); tags.push(`${t === 'turm' ? 'Kirchturm' : t === 'muehle' ? 'Windmühle' : t === 'haus' ? 'Haus' : t === 'kapelle' ? 'Kapelle' : 'Kirche'} ×${String(gebDef(t)).replace('.', ',')}`); }
  if ((t === 'garten' || t === 'acker' || t === 'friedhof') && ranged) { m *= P.GARTEN_DEF; tags.push(`${t === 'acker' ? 'Hecke/Feldrain' : t === 'garten' ? 'Gartenmauer' : 'Friedhofsmauer'} ×${String(P.GARTEN_DEF).replace('.', ',')}`); }
  if (t === 'barrikade') { m *= 1.6; tags.push('Barrikade ×1,6'); }
  if (t === 'wrack') { if (wk) { m *= 0.7; tags.push('Koloss am Wrack ×0,7'); } else { m *= P.VILLAGE_DEF; tags.push('Wrack ×1,5'); } }   // G6
  if (t === 'bahn' && ranged) { m *= 1.3; tags.push('Bahndamm ×1,3'); }
  if (d.holdB) { m *= P.HOLD_DEF; tags.push('Halten um jeden Preis ×1,25'); }
  if (d.dug) { m *= P.DIG_DEF; tags.push('eingegraben ×1,3'); }
  return m;
}
// Deckung durch das Gelände für die Anzeige (Schild Bronze/Silber/Gold): Faktor gegen Beschuss von vorn; Stufe 0–3
function hinterSperre(G, ac, ar, d) {   // G6: Fußtruppen (nicht Fahrzeuge/Schreiter) neben einer Panzersperre, die in der Schusslinie liegt
  if (!d || cls(d) === 'walker' || ac == null) return false;
  return line(ac, ar, d.c, d.r).some(([c, r]) => inMap(c, r) && dist(c, r, d.c, d.r) === 1 && hex(G, c, r).t === 'sperre'); }
function coverOf(G, u) { let f = defMods(G, u, 'front', true, []);
  if (G.kanten && !kanteAus() && cls(u) !== 'walker') { let e = null, dmin = 99; for (const o of G.units) if (o.side !== u.side && active(o) && TYPES[o.type].rng > 0) { const dd = dist(o.c, o.r, u.c, u.r); if (dd < dmin) { dmin = dd; e = o; } } if (e) f *= kanteDeck(G, u.c, u.r, e.c, e.r).f; }   // R3: Kante zum nächsten feindlichen Schützen zählt fürs Schild
  return { f, tier: f >= 1.7 ? 3 : f >= 1.35 ? 2 : f >= 1.15 ? 1 : 0 }; }
function hexDef(G, c, r, isWalker) {
  const t = hex(G, c, r).t;
  return KIRCHE.has(t) ? gebDef(t) : t === 'village' || t === 'kirche' ? (isWalker ? 0.7 : P.VILLAGE_DEF) : t === 'fabrik' ? (isWalker ? 0.7 : 1.7) : t === 'forest' ? P.FOREST_DEF : t === 'wire' ? P.WIRE_DEF
    : t === 'furt' ? 0.8 : t === 'wald' ? 1.5 : t === 'waldweg' ? 1.2 : t === 'bunker' ? 2 : t === 'barrikade' ? 1.6 : 1;
}

// U5a (2026-11-26): Schaden über Modelle. Rückweg MODELLSCHADEN_ALT (Node: Umgebung, Browser: window). Feuerkraft-Fassung KRAFT=traeger (sonst weiche Stufen).
const u5aus = () => !!(TOG.MODELLSCHADEN_ALT || (typeof window !== 'undefined' && window.MODELLSCHADEN_ALT));
const kraftArt = () => TOG.KRAFT || 'stufen';   // Fassung 2 nur für Messungen (Enrico 16:00), im Spiel nicht erreichbar
// U5c (Punkt 90, Enrico 2026-11-26): Truppgrößen in sieben Gruppen – Linie 8, Sturm/Nahkampf 6, Waffentrupp 3 Mann (+ Waffe), Fachtrupp 4,
// kleine Gruppe 2–3 (+ Beiwerk: Trage, Karren, Kiste zählen nicht), gepanzerte Infanterie 2, Einzelmodell 1, Reiter 6. Rückweg TRUPP_ALT (Node: Umgebung, Browser: window).
const TRUPP = { kohorte: 8, grenadier: 8, raeumer: 6, sturm: 6, eingreif: 6, schildwall: 6, schwer: 6, mahlwerk: 3, sense: 3, buechse: 3, flammen: 3, brand: 3,
  pionier: 4, pionierD: 4, mineur: 4, gasschutz: 4, signal: 4, fernsprech: 4, pirsch: 4, feldscher: 2, heiler: 2, werkstatt: 2, munition: 2, scharf: 2, melder: 1, banner: 2,   /* Punkt 99: Hund ist Beiwerk */
  hauptA: 3, hauptD: 3, generalA: 3, generalD: 3, stahl: 3, panzerk: 3, huenen: 3, oger: 3, ballon: 1 };   // Punkt 100: gepanzerte Infanterie 3
const truppAlt = () => !!(TOG.TRUPP_ALT || (typeof window !== 'undefined' && window.TRUPP_ALT));
function modelle(t) { const T = TYPES[t]; if (!truppAlt() && TRUPP[t] != null) return TRUPP[t]; if (t === 'kohorte' || t === 'grenadier') return 8; if (T.cls === 'cav') return 6; if (T.cls === 'walker' || T.cls === 'art' || T.held || T.mech) return 1; return 3; }   // wie die Anzeige (R1: Linie 8, Reiter 6, Spezialtrupps 3; Geschütze, Fahrzeuge, Schreiter, Helden 1)
const modelleDa = u => Math.max(0, Math.ceil(u.str / 10 * modelle(u.type) - 1e-6));
// Feuerkraft nach Stärke. Alt: 0,4 + 0,6 × Anteil. Stufen: 100–70 voll, 69–40 → 75 %, unter 40 → 50 %, Übergänge weich (etwa ±3 Stärke um 67 und 37).
// Waffenträger: Linie/Reiter 0,5 + 0,5 × Anteil lebender Modelle; Spezialtrupps (3 Modelle) je gefallenem Schützen −TRAEGER_SCHUETZE, fällt der Waffenträger: TRAEGER_WEG; Einzelmodelle wie Stufen.
function kraft(u) {
  const s = Math.max(0, Math.min(1, u.str / 10));
  if (u5aus()) return 0.4 + 0.6 * s;
  const n = modelle(u.type);
  if (kraftArt() === 'traeger' && n > 1) { const k = modelleDa(u); if (n === 3) return u.traegerWeg ? P.TRAEGER_WEG : Math.max(P.TRAEGER_WEG, 1 - P.TRAEGER_SCHUETZE * (n - k)); return 0.5 + 0.5 * k / n; }
  const sig = x => 1 / (1 + Math.exp(-x / 0.015));
  return 0.5 + 0.25 * sig(s - 0.67) + 0.25 * sig(s - 0.37);
}
function kraftText(t) { if (u5aus()) return 'Feuerkraft sinkt mit der Stärke: 0,4 + 0,6 × Stärke.'; const n = modelle(t);
  if (kraftArt() === 'traeger' && n === 3) return 'Feuerkraft: voll, je gefallenem Schützen −' + Math.round(P.TRAEGER_SCHUETZE * 100) + ' %; fällt der Waffenträger, nur noch ' + Math.round(P.TRAEGER_WEG * 100) + ' %.';
  if (kraftArt() === 'traeger' && n > 1) return 'Feuerkraft: 50 % + 50 % × Anteil der stehenden Modelle.';
  return 'Feuerkraft: Stärke 100–70 voll, 69–40 → 75 %, unter 40 → 50 %.'; }
// Deckung stärker (U5a): Beschuss auf Fußtruppen und Geschütze – Deckung über 1 wirkt ×DECK_STARK stärker, ungedeckt (Faktor ≤ 1) Schaden ×OFFEN_MUL.
function deckU5(G, d, dm, tags) {
  if (u5aus() || cls(d) === 'walker') return dm;
  if (dm > 1.05) { const n = 1 + (dm - 1) * P.DECK_STARK; tags.push('Deckung verstärkt ×' + String(+(n / dm).toFixed(2)).replace('.', ',')); return n; }
  if (dm <= 1) { tags.push('ungedeckt ×' + String(P.OFFEN_MUL).replace('.', ',')); return dm / P.OFFEN_MUL; }
  return dm;
}
const splitterWaffe = t => { const T = TYPES[t]; return T.cls === 'art' || !!T.flame || T.cls === 'flame' || t === 'kreuz'; };   // Geschütze, Mörser, Minenwerfer, Flammenwerfer, Löwenmaul-Kanone
function splitterU5(G, a, d, dm, tags) { if (u5aus() || !splitterWaffe(a.type) || modelle(d.type) < 2 || dm > 1) return 1; tags.push('Splitter ×' + String(P.SPLITTER).replace('.', ',')); return P.SPLITTER; }
function panneDauer(G) { return u5aus() ? P.PANNE_RUNDEN + 1 : (G.rng() < P.PANNE_SCHWER ? P.PANNE_LANG : P.PANNE_KURZ) + 1; }   // +1: zählt zu Beginn der eigenen Runde herunter

// R3 (2026-11-26): Deckung an der Feldkante. Sandsackwall, Mauer oder Hecke liegen auf der Kante zwischen zwei Feldern und schützen beide Seiten,
// aber nur gegen Beschuss, der über diese Kante kommt (Schussrichtung zum Schützen; genau über eine Ecke: die bessere der beiden Kanten).
// Nicht gegen Steilfeuer, Bogenwurf, Flammen; Fahrzeuge und Schreiter ragen darüber. Karten: KANTEN_KARTE [Feld c, r, Seite 'ost'|'west', Art]
// → beide Nachbarn auf dieser Seite. Rückweg KANTE_ALT (Node: Umgebung, Browser: window), Sim-Abschalter NOKANTE.
const KANTE_ART = { sandsack: { name: 'Sandsäcke', p: 'KANTE_SANDSACK' }, mauer: { name: 'Mauer', p: 'KANTE_MAUER' }, hecke: { name: 'Hecke', p: 'KANTE_HECKE' } };
const KANTEN_KARTE = {
  grauwall: [[3, 4, 'ost', 'sandsack'], [5, 2, 'ost', 'mauer'], [5, 7, 'ost', 'sandsack'], [9, 4, 'west', 'sandsack'], [9, 7, 'west', 'sandsack']],
  sanktruss: [[8, 7, 'ost', 'sandsack'], [9, 2, 'ost', 'mauer'], [11, 4, 'west', 'sandsack'], [11, 7, 'west', 'sandsack']],
  winterdorf: [[4, 7, 'ost', 'sandsack'], [7, 4, 'ost', 'hecke'],   /* Punkt 103: Gehöft (14,3) ohne Sandsäcke */ [10, 6, 'ost', 'hecke'], [8, 5, 'west', 'mauer']],
};
const kanteAus = () => !!(TOG.KANTE_ALT || TOG.NOKANTE || (typeof window !== 'undefined' && window.KANTE_ALT));
const kKey = (c1, r1, c2, r2) => (c1 < c2 || (c1 === c2 && r1 < r2)) ? c1 + ',' + r1 + '|' + c2 + ',' + r2 : c2 + ',' + r2 + '|' + c1 + ',' + r1;
// Punkt 103 (Bild = Regel): Gartenmauern, Friedhofsmauer und die Sandsäcke an der Schanze, die GBau früher nur zeichnete, sind echte Kantendeckung.
// Dieselbe Rechnung wie früher in GBau (Kantenindex e wie GBau nbE, Zufall hrnd mit Startwert 1917); GBau zeichnet sie jetzt aus G.kanten (cfg.kantenRegel). Rückweg BILDKANTE_ALT.
const nbE = (c, r, e) => { const o = c & 1; return [[c + 1, r + o], [c, r + 1], [c - 1, r + o], [c - 1, r - 1 + o], [c, r - 1], [c + 1, r - 1 + o]][e]; };
const hrndK = (c, r, k) => { let s = (c * 73856093) ^ (r * 19349663) ^ (k * 83492791) ^ 1917; s = (s ^ (s >>> 13)) * 1274126177; return ((s ^ (s >>> 16)) >>> 0) / 4294967296; };
const bildKanteAus = () => !!(TOG.BILDKANTE_ALT || (typeof window !== 'undefined' && window.BILDKANTE_ALT));
function kantenGelaende(map) {
  const out = {}; if (bildKanteAus()) return out;
  const t = (c, r) => inMap(c, r) ? map[c][r].t : 'out', WI = !!MAP.winter, BAU = new Set();
  for (const b of MAP.bauten || []) if (!b.art || b.art === 'kirche') for (const f of [...b.felder, ...(b.turm ? [b.turm] : [])]) BAU.add(f[0] + ',' + f[1]);
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) {
    if (t(c, r) === 'friedhof') for (let e = 0; e < 6; e++) { const [nc, nr] = nbE(c, r, e); if (t(nc, nr) !== 'friedhof' && !BAU.has(nc + ',' + nr)) out[kKey(c, r, nc, nr)] = 'mauer'; }   // Friedhofsmauer außen herum
    if (t(c, r) === 'garten' && !WI) { const mitZaun = hrndK(c, r, 252) < 0.55;   // Gärten: hinten Zaun (ohne Deckung) oder Bruchsteinmauer, vorn nur die Mauer
      for (const e of [4, hrndK(c, r, 250) < 0.5 ? 3 : 5, ...(hrndK(c, r, 251) < 0.35 ? [1] : [])]) { const [nc, nr] = nbE(c, r, e); if (t(nc, nr) === 'garten' || BAU.has(nc + ',' + nr) || t(nc, nr) === 'friedhof') continue; if (!(e >= 3 && mitZaun)) out[kKey(c, r, nc, nr)] = 'mauer'; } }
  }
  for (const o of OBJECTIVES) if (/schanze/i.test(o.id)) { const ex = o.c <= (MAP.zoneA ?? 2) ? 2 : 0, [n1c, n1r] = nbE(o.c, o.r, ex), [n2c, n2r] = nbE(n1c, n1r, 4);   // Sandsackhaken am Bunker: vordere Kante zur eigenen Seite und die Oberkante des Nachbarfelds
    out[kKey(o.c, o.r, n1c, n1r)] = 'sandsack'; out[kKey(n1c, n1r, n2c, n2r)] = 'sandsack'; }
  return out;
}
function kantenBau(id) { const out = {}; for (const [c, r, seite, art] of KANTEN_KARTE[id] || []) for (let k = 0; k < 6; k++) { const [nc, nr] = step(c, r, k); if (!inMap(nc, nr) || (seite === 'ost' ? nc !== c + 1 : nc !== c - 1)) continue; out[kKey(c, r, nc, nr)] = art; } return out; }
function kanteAt(G, c1, r1, c2, r2) { return (!kanteAus() && G.kanten && G.kanten[kKey(c1, r1, c2, r2)]) || null; }
function kantenVon(G, c, r) { const out = []; if (kanteAus() || !G.kanten) return out; for (let k = 0; k < 6; k++) { const [nc, nr] = step(c, r, k); const a = inMap(nc, nr) && kanteAt(G, c, r, nc, nr); if (a) out.push({ k, c: nc, r: nr, art: a }); } return out; }
const axXY = (c, r) => { const [q, a] = toAx(c, r); return [1.5 * q, Math.sqrt(3) * (a + q / 2)]; };
// Kante, über die ein Schuss von (ac, ar) ins Feld (c, r) kommt: Faktor und Art (1 = keine)
function kanteDeck(G, c, r, ac, ar) {
  if (ac == null || (ac === c && ar === r) || kanteAus() || !G.kanten) return { f: 1, art: null };
  const [x0, y0] = axXY(c, r), [x1, y1] = axXY(ac, ar), dl = Math.hypot(x1 - x0, y1 - y0) || 1, dx = (x1 - x0) / dl, dy = (y1 - y0) / dl;
  const w = []; for (let k = 0; k < 6; k++) { const [nc, nr] = step(c, r, k), [nx, ny] = axXY(nc, nr), l = Math.hypot(nx - x0, ny - y0) || 1; w.push({ k, nc, nr, dot: ((nx - x0) * dx + (ny - y0) * dy) / l }); }
  w.sort((a, b) => b.dot - a.dot);
  let best = { f: 1, art: null };
  for (const e of w.slice(0, w[0].dot - w[1].dot < 0.02 ? 2 : 1)) { const art = inMap(e.nc, e.nr) && kanteAt(G, c, r, e.nc, e.nr); if (art && P[KANTE_ART[art].p] > best.f) best = { f: P[KANTE_ART[art].p], art }; }
  return best;
}
function kanteFaktor(G, d, ac, ar, tags) { if (!d || cls(d) === 'walker') return 1; const kd = kanteDeck(G, d.c, d.r, ac, ar); if (kd.f > 1 && tags) tags.push(KANTE_ART[kd.art].name + ' an der Kante ×' + String(kd.f).replace('.', ',')); return kd.f; }

// Schaden ohne Zufall, für Vorschau und KI. kind: 'melee' | 'fire'
function preview(G, a, d, kind, o) {
  o = o || {};
  const ac = o.c != null ? o.c : a.c, ar = o.r != null ? o.r : a.r, run = o.run != null ? o.run : a.run;
  const A = TYPES[a.type], D = TYPES[d.type], tags = [], ranged = kind === 'fire';
  const geo = arcOf(G, d, ac, ar), arc = hasFlanks(D) ? geo : 'front';   // Lage für die Deckung, Bonus nur bei Fahrzeugen
  const flame = ranged && A.flame;
  let m = 1;
  if (arc === 'flank') { m *= P.FLANK; tags.push('Flanke ×1,4'); }
  if (arc === 'rear') { m *= P.REAR; tags.push('Rücken ×1,8'); }
  if (d.status === 'rout') {
    if (A.cls === 'cav' && !ranged) { m *= P.CAV_VS_ROUT; tags.push('Reiter gegen Fliehende ×2'); }
    else { m *= P.VS_ROUT; tags.push('fliehend ×1,6'); }
  }
  if (D.cls === 'walker' && ranged && immune(A, D)) { m = 0; tags.push('Panzerung: wirkungslos'); }
  else { const fk = faktor(a.type, d.type, ranged); if (fk.f !== 1) { m *= fk.f; tags.push(fk.txt + ' ×' + String(fk.f).replace('.', ',')); } }   // F66
  if (!ranged && nahRolle(d.type) === 'schwach') { m *= 1.5; tags.push('schwach im Nahkampf ×1,5'); }   // F66: MG, Geschütze, Beobachter … sehen im Nahkampf alt aus
  if (ranged && A.mg) {
    if (hex(G, d.c, d.r).t === 'wire') { m *= P.MG_VS_WIRE; tags.push('MG gegen Draht ×2'); }
    if (D.cls === 'cav') { m *= P.MG_VS_CAV; tags.push('MG gegen Reiter ×2'); }
  }
  if (!ranged && A.cls === 'cav' && run >= P.CHARGE_MIN) { m *= P.CHARGE; tags.push('Ansturm ×1,5'); }
  if (!ranged && hex(G, ac, ar).t === 'wire') { m *= 0.7; tags.push('aus dem Draht ×0,7'); }
  if (ranged && D.cls === 'flame') { m *= P.FLAME_HIT; tags.push('Brandtank getroffen ×1,5'); }
  if (officerAt(G, a.side, ac, ar)) { m *= P.OFFICER_ATK; tags.push('Offizier ×1,15'); }
  if (!ranged && a.zeal) { m *= P.ORDER_ATK; tags.push('Sturmbefehl ×1,25'); }
  if (ranged && a.fireFree) { m *= P.FIRE_FREE; tags.push('Feuer frei ×1,25'); }
  if (ranged && TYPES[a.type].broadside) { m *= P.BROADSIDE; tags.push('Breitseite ×0,6'); }
  if (!ranged && TYPES[a.type].blastLance && !a.lanceUsed) { m *= P.BLAST_LANCE; tags.push('Sprenglanze ×1,5'); }
  if (A.scharfInf && ranged && panzerKl(d.type) === 'U') { m *= P.SCHARF_INF; tags.push('gezielter Schuss ×1,6'); }   // Punkt 3: Scharfschützen treffen Fußtruppen hart
  if (A.granatSturm) { if (ranged) { m *= P.GRANAT_FERN; tags.push('Stoßtrupp: Schuss ×0,85'); } else { m *= P.GRANAT_NAH; tags.push('Handgranaten ×1,25'); } }   // F103
  if (!ranged && A.gegenstoss) { if (gegenstossFeld(G, a.side, d.c, d.r)) { m *= P.GEGENSTOSS; tags.push('Gegenstoß ×1,25'); } else { m *= P.GEGENSTOSS_VOR; tags.push('im Vorgehen ×0,85'); } }
  if (ranged && G.units.some(o => o.shields && o.side === d.side && active(o) && dist(o.c, o.r, d.c, d.r) === 1)) { m *= P.SHIELDS; tags.push('Schilde vor ×0,75'); }
  if (a.supp > 0) { m *= P.SUPP_ATK; tags.push('niedergehalten ×0,5'); }
  if (a.gassed) { m *= P.GAS_ATK; tags.push('im Gas ×0,7'); }
  let dm = 1;
  if (flame) tags.push('Flammen: Deckung schützt nicht');
  else dm = defMods(G, d, geo, ranged, tags, (!ranged && A.cls === 'storm') || (ranged && A.lob), ranged && A.lob);
  if (ranged && !flame && !A.lob) dm *= kanteFaktor(G, d, ac, ar, tags);   // R3: Deckung an der Kante, über die der Schuss kommt
  if (ranged) { m *= splitterU5(G, a, d, dm, tags); if (!flame) dm = deckU5(G, d, dm, tags); }   // U5a
  if (ranged && a.type === 'kreuz' && cls(d) === 'walker' && !u5aus()) { m *= P.LOEWE_PZ; tags.push('Löwenmaul gegen Panzer ×' + String(P.LOEWE_PZ).replace('.', ',')); }   // Punkt 43
  if (ranged && !flame && !(A.lob) && hinterSperre(G, ac, ar, d)) { m /= P.SPERRE_DEF; tags.push('hinter Panzersperre ×1,2'); }   // G6: Schusslinie läuft durch eine Sperre neben dem Ziel
  if (ranged && litAt(G, d.c, d.r, a.side)) { m *= 1.25; tags.push('ausgeleuchtet ×1,25'); }
  if (ranged && smokeAt(G, d.c, d.r)) { m *= P.NEBEL_IN; tags.push('Ziel im Nebel ×0,5'); }
  if (ranged && smokeAt(G, ac, ar)) { m *= P.NEBEL_AUS; tags.push('aus dem Nebel ×0,75'); }
  const dmg = P.DMG * ((ranged ? A.fs : A.atk) / (D.def * dm)) * kraft(a) * m;
  let counter = 0;
  if (!ranged && d.status === 'ok' && D.atk > 0) counter = counterDmg(G, d, a, ac, ar, arc, Math.max(0, d.str - dmg));
  return { dmg, counter, arc, tags };
}
// F103: Gegenstoß wirkt auf eigenen Zielfeldern (gehalten) und in Gräben der eigenen Kartenhälfte
function gegenstossFeld(G, side, c, r) { const h = hex(G, c, r); if (!h) return false; if (h.obj && G.ctrl[h.obj] === side) return true; return h.t === 'trench' && (side === 'D' ? c >= COLS / 2 : c < COLS / 2); }
function counterDmg(G, d, a, ac, ar, arc, dStr) {
  const A = TYPES[a.type], D = TYPES[d.type];
  let m = P.COUNTER[arc];
  m *= faktor(d.type, a.type, false).f;   // F66: Nahkampfwaffe des Verteidigers gegen die Panzerklasse des Angreifers
  { const r = nahRolle(d.type); if (r === 'schwach') m *= 0.5; else if (r === 'stark') m *= 1.25; }
  return P.DMG * (D.atk / (A.def * hexDef(G, ac, ar, A.cls === 'walker'))) * kraft({ type: d.type, str: dStr, traegerWeg: d.traegerWeg }) * m;
}

function applyDamage(G, a, d, dmg, arc, ev, o) {
  o = o || {};
  const t = hex(G, d.c, d.r).t, k0 = modelleDa(d);
  d.str = Math.max(0, d.str - dmg);
  const fall = Math.max(0, k0 - modelleDa(d));   // U5a: gefallene Modelle (Anzeige in U5b)
  if (fall && !u5aus() && kraftArt() === 'traeger' && modelle(d.type) === 3) for (let j = 0; j < fall && !d.traegerWeg; j++) if (G.rng() < 1 / Math.max(1, k0 - j)) d.traegerWeg = true;   // der Waffenträger fällt mit der Chance 1 / stehende Modelle
  if (o.ranged && d.status === 'ok' && cls(d) !== 'walker') {
    d.fireDmg += dmg;
    if ((d.fireDmg >= P.SUPP || (dmg > 0 && a && TYPES[a.type] && TYPES[a.type].pin)) && !d.supp) { d.supp = 1; ev.push({ t: 'supp', u: d.id }); }
  }
  let ml = dmg * P.MOR_PER_DMG * (o.morMul || 1) + (o.morPlus || 0);   // morPlus: fester Moralverlust (Sturmrollen)
  if (arc === 'flank') ml += P.MOR_FLANK;
  if (arc === 'rear') ml += P.MOR_REAR;
  if (d.status === 'ok' && surrounded(G, d)) ml += P.MOR_SURR;
  if ((t === 'trench' || t === 'bunker' || KIRCHE.has(t)) && !o.flame) ml *= 0.5;
  if (officerAt(G, d.side, d.c, d.r)) ml *= P.OFFICER_MOR;
  if (bannerAt(G, d.side, d.c, d.r)) ml *= 0.75;
  const standH = o.ranged && G.units.find(h => h.side === d.side && alive(h) && TYPES[h.type].aura === 'standhaft' && dist(h.c, h.r, d.c, d.r) <= 1); if (standH) ml *= P.FAUST_AURA;   // Held Rote Faust
  d.mor = Math.max(0, d.mor - ml);
  ev.push(standH ? { t: 'hit', u: d.id, dmg, str: d.str, morv: d.mor, stand: standH.id, fall } : { t: 'hit', u: d.id, dmg, str: d.str, morv: d.mor, fall });   // stand: Aura hat gewirkt (F86, nur Anzeige)
  if (d.str < 0.3) { killUnit(G, d, ev, 'destroyed'); return; }
  if (d.status === 'rout') return;
  if ((d.str < P.ROUT_STR || d.mor <= 0) && noFlee(G, d)) { d.mor = Math.max(d.mor, 0.1); ev.push({ t: 'steadfast', u: d.id }); return; }   // hält stand
  if (d.str < P.ROUT_STR || d.mor <= 0) { routUnit(G, d, a, ev); return; }
  if (entsetzen(G, a, d, ev)) return;   // Punkt 18: Entsetzenstest bei Angriff durch Fahrzeug/Schreiter
  if (d.mor < P.FALLBACK_MOR && cls(d) !== 'art' && !(d.supp > 0 && !TOG.NOSUPP)) fallBack(G, d, a, ev);   // Niedergehaltene bleiben liegen
}
// Punkt 18 (2026-11-24): Entsetzenstest – nur wenn ein Fahrzeug/Schreiter angreift (statt Moralverlust beim bloßen Annähern; ENTSETZ_ALT=1 = alte Regel).
// Immun: Helden, Fahrzeuge/Schreiter, Kampfanzüge. Durchgefallen: niedergehalten, Moral −P.ENTSETZ_MOR, unter 60 Stärke zurückweichen (keine Sofortflucht).
function entsetzenImmun(t) { const T = TYPES[t]; return !T || !!T.held || T.cls === 'walker' || !!T.suit || !!T.mech; }
function entsetzenP(G, d) {
  const T = TYPES[d.type]; let p = P.ENTSETZ_BASIS + (1 - d.str / 10) * 0.25 + Math.max(0, (5 - d.mor) / 10) * 0.3;
  p += [0.08, 0.03, 0, -0.03][coverOf(G, d).tier];
  if (T.cls === 'art' || T.mg) p += 0.08; else if (T.cls === 'storm' || T.cls === 'cav') p -= 0.05;
  if (T.cmd) p -= 0.1;
  if (G.units.some(o => o !== d && o.side === d.side && alive(o) && (TYPES[o.type].cmd || TYPES[o.type].banner) && dist(o.c, o.r, d.c, d.r) <= (o.planted ? 2 : 1))) p -= 0.1;
  return Math.max(0.02, Math.min(0.6, p));
}
function entsetzen(G, a, d, ev) {
  if (TOG.ENTSETZ_ALT || !a || !alive(a) || cls(a) !== 'walker' || a.side === d.side || !active(d) || entsetzenImmun(d.type)) return false;
  const p = entsetzenP(G, d), ok = G.rng() >= p; G.entsetzen = G.entsetzen || { n: 0, fail: 0 }; G.entsetzen.n++;
  const evE = { t: 'entsetzen', u: d.id, ok, p: +p.toFixed(2) }; ev.push(evE); if (ok) return false; G.entsetzen.fail++;
  d.mor = Math.max(0.1, d.mor - P.ENTSETZ_MOR); evE.morv = d.mor;
  if (!d.supp) { d.supp = 1; ev.push({ t: 'supp', u: d.id }); }
  if (d.str < 6 && cls(d) !== 'art') { fallBack(G, d, a, ev); return true; }
  return false;
}
function credit(G, u) { if (!u.credited) { u.credited = true; G.pts[u.side === 'A' ? 'D' : 'A'] += P.PTS_KILL; } }
function killUnit(G, u, ev, how) {
  if (how !== 'escaped') credit(G, u);
  u.status = how === 'escaped' ? 'gone' : 'dead';
  if (u.officer && how !== 'escaped') ev.push({ t: 'officer', u: u.id, name: u.officer });
  if (TYPES[u.type].held && how !== 'escaped') { for (const o of G.units) if (o.side === u.side && o !== u && alive(o)) o.mor = Math.max(0, o.mor - P.HELD_FALL_MOR); ev.push({ t: 'heldfall', u: u.id, side: u.side }); }   // ganze Seite verliert Moral
  ev.push({ t: how, u: u.id });
}
function retreatHex(G, u, from) {
  const dir = SIDES[u.side].dir;
  let best = null, bs = -1e9;
  for (const [c, r] of neighbors(u.c, u.r)) {
    if (unitAt(G, c, r) || cost(G, u, c, r) >= 99) continue;
    const t = hex(G, c, r).t;
    let s = -(c - u.c) * dir * 3;
    if (from) s += dist(c, r, from.c, from.r) * 2;
    let adj = 0; for (const [nc, nr] of neighbors(c, r)) { const o = unitAt(G, nc, nr); if (o && o.side !== u.side && active(o)) adj++; }
    s -= adj * 2;
    if (['trench', 'village', 'bunker', 'fabrik', 'kirche', 'barrikade', 'wald', 'schiff', 'turm'].includes(t)) s += 1;
    if (t === 'wire') s -= 2;
    if (s > bs) { bs = s; best = [c, r]; }
  }
  return best;
}
function fallBack(G, u, from, ev) {
  if (u.planted) return;   // aufgepflanztes Banner weicht nicht
  const h = retreatHex(G, u, from);
  if (!h) return;
  const fc = u.c, fr = u.r;
  u.c = h[0]; u.r = h[1]; u.ow = false; u.dug = false;
  if (TYPES[u.type].mg) { u.setup = false; u.sperr = 0; u.fellBack = true; }   // MG: abgebaut, schießt in dieser Runde nicht mehr
  ev.push({ t: 'fallback', u: u.id, path: [[fc, fr], h] });
}
function routUnit(G, u, from, ev) {
  u.status = 'rout'; u.supp = 0; credit(G, u);
  ev.push({ t: 'rout', u: u.id });
  for (const [c, r] of neighbors(u.c, u.r)) {
    const o = unitAt(G, c, r);
    if (o && o.side === u.side && active(o)) {
      o.mor = Math.max(0, o.mor - 0.5);
      ev.push({ t: 'hit', u: o.id, dmg: 0, panic: true, str: o.str, morv: o.mor });
      if (o.mor <= 0 && !noFlee(G, o)) { o.status = 'rout'; credit(G, o); ev.push({ t: 'rout', u: o.id }); }
    }
  }
  flee(G, u, 2, ev);
}
function flee(G, u, steps, ev) {
  const edge = SIDES[u.side].edge, dir = SIDES[u.side].dir;
  const path = [[u.c, u.r]];
  for (let i = 0; i < steps; i++) {
    if (u.c === edge) break;
    let best = null, bs = -1e9;
    for (const [c, r] of neighbors(u.c, u.r)) {
      if (unitAt(G, c, r) || cost(G, u, c, r) >= 99) continue;
      const s = -(c - u.c) * dir * 4 - (isZOC(G, c, r, u.side) ? 3 : 0) - (hex(G, c, r).t === 'wire' ? 2 : 0);
      if (s > bs) { bs = s; best = [c, r]; }
    }
    if (!best) break;
    u.c = best[0]; u.r = best[1]; u.dug = false; path.push(best);
    if (hex(G, u.c, u.r).t === 'wire') break;
  }
  if (path.length > 1) ev.push({ t: 'flee', u: u.id, path });
  else if (adjEnemies(G, u).length) { killUnit(G, u, ev, 'destroyed'); return; }
  u.face = u.side === 'A' ? 3 : 0;
}
function fireKind(a) { const T = TYPES[a.type]; return T.mg ? 'mg' : T.flame ? 'flame' : T.gat ? 'minigun' : T.mgfire ? 'mg' : T.cls === 'walker' ? 'cannon' : 'rifle'; }
function resolveFire(G, a, d, reaction, mul) {
  const ev = [];
  const p = preview(G, a, d, 'fire');
  const dmg = p.dmg * (0.75 + G.rng() * 0.5) * (mul || 1);
  if (!reaction) { const zweiter = a.attacked && (a.bsT || []).length === 1; a.attacked = true; if (!zweiter) spend(a, 1); a.face = faceToward(a.face, a.c, a.r, d.c, d.r); if (TYPES[a.type].broadside) a.bsT = (a.bsT || []).concat(d.id); }
  if (TYPES[a.type].hidden) a.revealed = 1;
  const flame = !!TYPES[a.type].flame;
  ev.push({ t: 'fire', a: a.id, d: d.id, kind: fireKind(a), reaction: !!reaction, face: a.face });
  const dc = d.c, dr = d.r;
  applyDamage(G, a, d, dmg, p.arc, ev, { ranged: true, flame, morMul: flame ? P.FLAME_MOR : 1 });
  if (flame && !reaction) ignite(G, a.side, d.c, d.r, ev);
  if (!reaction || cls(a) === 'walker') kircheTreffer(G, a, dc, dr, ev);   // Kanonen der Kolosse und Sturmpanzer auf ein Kirchenfeld
  return ev;
}
// Brennendes Feld (Flammentrupp, Brandwerfer): bis zum nächsten Zug der Seite, die es angezündet hat; Draht im Feld verbrennt
function ignite(G, side, c, r, ev) {
  G.fires = (G.fires || []).filter(f => !(f.c === c && f.r === r)); G.fires.push({ c, r, side });
  const h = hex(G, c, r); if (h.t === 'wire') { h.t = 'open'; ev.push({ t: 'terrain', c, r, what: 'Draht verbrannt' }); }
  ev.push({ t: 'ignite', c, r });
}
function fireAt(G, c, r) { return (G.fires || []).some(f => f.c === c && f.r === r); }
function burn(G, u, ev) {   // Feuerschaden beim Hineinziehen oder Stehen im brennenden Feld
  if (!alive(u) || TOG.NOFIRE) return;
  const dmg = P.FIRE_DMG * (cls(u) === 'walker' ? P.FIRE_WALKER : 1) * (0.8 + G.rng() * 0.4);
  ev.push({ t: 'burn', u: u.id, c: u.c, r: u.r });
  const n0 = ev.length; applyDamage(G, null, u, dmg, 'front', ev, { morMul: 0.5 });
  for (let i = n0; i < ev.length; i++) if (ev[i].t === 'hit') ev[i].burn = true;
}
// Zweitwaffe (Paket 8): Landkoloss Seiten-MG nur seitlich (nicht vorn, nicht hinten), Turmschreiter Turm-MG rundum; 1 Punkt, einmal je Runde, neben dem Hauptangriff
function canZweit(G, a, d) {
  const T = TYPES[a.type], Z = T.zweit; if (!Z || !active(a) || a.side !== G.side || a.zw || a.broken || a.supp > 0 || (!Z.flamme && held(G, a))) return false;   // Flammenstoß auch im Nahkampf
  if (!d || !alive(d) || d.side === a.side || (cls(d) === 'walker' && !Z.flamme && !Z.kanone) || concealed(G, d, a.c, a.r)) return false;   // MG gegen Panzerung wirkungslos
  const dd = dist(a.c, a.r, d.c, d.r); if (dd < 1 || dd > Z.rng || !hasLOS(G, a.c, a.r, d.c, d.r)) return false;
  if (!inFan(G, a, d.c, d.r, true)) return false;   // Seitenwaffen: vorn und seitlich, nicht nach hinten
  return true;
}
function zweitTargets(G, a) { return G.units.filter(d => canZweit(G, a, d)); }
function zweitFire(G, a, d) {
  if (!canZweit(G, a, d)) return [];
  const Z = TYPES[a.type].zweit, ev = []; a.zw = true;
  if (Z.flamme) {   // Flammenstoß: halbe Stärke eines Flammentrupps, Feld brennt danach
    a.face = faceToward(a.face, a.c, a.r, d.c, d.r);
    const ft = a.side === 'A' ? 'flammen' : 'brand', p = preview(G, Object.assign({}, a, { type: ft }), d, 'fire');
    ev.push({ t: 'fire', a: a.id, d: d.id, kind: 'flame', zweit: Z.name, face: a.face });
    applyDamage(G, a, d, p.dmg * (0.75 + G.rng() * 0.5) * 0.5, p.arc, ev, { ranged: true, flame: true, morMul: P.FLAME_MOR });
    ignite(G, a.side, d.c, d.r, ev);
  } else {
    const p = preview(G, a, d, 'fire');
    ev.push({ t: 'fire', a: a.id, d: d.id, kind: Z.kanone ? 'cannon' : 'mg', zweit: Z.name, face: a.face });
    const kl = panzerKl(d.type), fH = FAK[waffeArt(a.type, true)][kl], fZ = Z.kanone ? FAK.at[kl] : FAK.gewehr[kl];   // F66: Zweitwaffe nach eigener Waffenart (MG bzw. Kanone gegen Panzerung)
    applyDamage(G, a, d, p.dmg * (0.75 + G.rng() * 0.5) * P.ZWEIT_MUL * (fH > 0 ? fZ / fH : fZ) * (Z.kanone && cls(d) === 'walker' ? 2 : 1), p.arc, ev, { ranged: true });   // Kanone: gegen Panzerung voll
  }
  ev.push(...checkEnd(G)); return ev;
}
function fire(G, a, d) {
  if (!canFire(G, a, d)) return [];
  const zweite = dauerOk(a);
  const ev = resolveFire(G, a, d, false);
  if (TYPES[a.type].dauerfeuer) { a.dfN = (a.dfN || 0) + 1; if (zweite) { a.kuehl = 2; ev.push({ t: 'dauerfeuer', u: a.id }); } }
  ev.push(...checkEnd(G));
  return ev;
}
let nkZahl = 0;   // F63 (2026-11-20): alle Ereignisse eines Nahkampfs tragen dieselbe Nummer nk – die Anzeige spielt sie zusammen in einer Szene ab
function melee(G, a, d) {
  if (!canMelee(G, a, d)) return [];
  const ev = [], nk = ++nkZahl;
  const p = preview(G, a, d, 'melee');
  a.attacked = true; a.ap = 0; a.bp = 0; a.moved = true;
  a.face = faceToward(a.face, a.c, a.r, d.c, d.r);
  ev.push({ t: 'melee', a: a.id, d: d.id, face: a.face });
  if (TYPES[a.type].blastLance && !a.lanceUsed) { a.lanceUsed = true; ev.push({ t: 'lanceblast', a: a.id, c: d.c, r: d.r }); }
  if (TYPES[a.type].granatSturm) ev.push({ t: 'handgranate', a: a.id, d: d.id });   // F103: Grenadiere werfen vor dem Nahkampf (im Schaden schon eingerechnet)   // Sprenglanze (preview hat ×1,5 schon eingerechnet)
  const dmg = p.dmg * (0.75 + G.rng() * 0.5);
  const dc = d.c, dr = d.r;
  applyDamage(G, a, d, dmg, p.arc, ev);
  if (alive(d) && (!hasFlanks(TYPES[d.type]) || fahrzeugArt(d) === 'schreiter')) d.face = faceToward(d.face, d.c, d.r, a.c, a.r);   // F76 (Enrico 2026-11-21): Verteidiger wendet sich zum Angreifer und bleibt so (Flankenbonus galt nur für diesen Angriff; Einkesseln lohnt sich) – Fußtruppen, Reiter und Schreiter ohne Drehkosten; Panzer/Kettenfahrzeuge drehen sich nicht
  if (d.status === 'ok' && d.c === dc && d.r === dr && p.arc !== 'rear' && TYPES[d.type].atk > 0) {
    const cd = counterDmg(G, d, a, a.c, a.r, p.arc, d.str) * (0.75 + G.rng() * 0.5);
    if (cd > 0) { ev.push({ t: 'counter', a: d.id, d: a.id }); applyDamage(G, d, a, cd, 'front', ev); }
  }
  const k = cls(a);
  if (active(a) && !unitAt(G, dc, dr) && k !== 'mg' && k !== 'flame' && cost(G, a, dc, dr) < 99) {
    const fc = a.c, fr = a.r;
    a.c = dc; a.r = dr; a.dug = false;
    if (k === 'walker' && hex(G, dc, dr).t === 'wire') { hex(G, dc, dr).t = 'open'; ev.push({ t: 'crush', u: a.id, c: dc, r: dr }); }
    claimObjective(G, a);
    ev.push({ t: 'advance', u: a.id, path: [[fc, fr], [dc, dr]] });
  }
  for (const x of ev) x.nk = nk;
  ev.push(...checkEnd(G));
  return ev;
}
// Punkt 15 (Enrico 2026-11-23): solange eine Markierung („Ziel markieren“) gilt, deckt ihr Lichtkreis (Feld und Nachbarn) auch neu gelegte Minen und hineinziehende versteckte Einheiten sofort auf
function imLicht(G, side, c, r) { return (G.marks || []).some(m => m.side !== side && dist(m.c, m.r, c, r) <= 1); }
function lichtAufdecken(G, u) { if (!u || !alive(u) || TOG.NOLICHT) return; if (TYPES[u.type].hidden && imLicht(G, u.side, u.c, u.r)) u.revealed = Math.max(u.revealed || 0, 1); }
function claimObjective(G, u) { lichtAufdecken(G, u);
  if (!active(u) || cls(u) === 'art') return;
  const o = hex(G, u.c, u.r).obj;
  if (o && G.ctrl[o] !== u.side) { G.ctrl[o] = u.side; G.pts[u.side] += OBJECTIVES.find(x => x.id === o).pts * P.PTS_OBJ; }
}

// ---------- Artillerie ----------
function spotted(G, side, c, r) {
  if (litAt(G, c, r, side)) return true;
  if (smokeAt(G, c, r)) return false;   // in den Nebel hinein sieht kein Beobachter (Artillerie, Feuerschlag, Markieren)
  return G.units.some(u => u.side === side && active(u) && cls(u) !== 'art' && dist(u.c, u.r, c, r) <= sichtOf(G, u) && hasLOS(G, u.c, u.r, c, r, luft(u)));
}
function sichtOf(G, u) { if (TYPES[u.type].fessel && u.eingeholt) return P.BALLON_SICHT_UNTEN; const t = hex(G, u.c, u.r).t; return Math.max(TYPES[u.type].spot || P.SPOT, t === 'kirche' ? 6 : 0) + (t === 'turm' || t === 'kapelle' || t === 'muehle' ? P.TURM_SPOT : 0); }   /* Kapelle mit Türmchen: +1 Sicht, keine Reichweite (Enrico 2026-11-22 17:30) */   // alter Kirchturm 6 Felder, Sankt Ruß +1
// ---------- Große Gebäude (Kirche von Sankt Ruß) ----------
function bauAt(G, c, r) { const i = inMap(c, r) ? hex(G, c, r).bau : null; return i != null && G.bauten && G.bauten[i] && !G.bauten[i].kaputt ? G.bauten[i] : null; }
const schwereWaffe = a => { const T = a && TYPES[a.type]; return !!T && (T.cls === 'art' || (T.cls === 'walker' && !T.gat && !T.mgfire && T.rng >= 2)); };
// Treffer schwerer Waffen auf ein Kirchenfeld ziehen den Bauzustand herunter; bei 0 stürzt die Kirche ein
function kircheTreffer(G, a, c, r, ev, n = 1) {
  const b = bauAt(G, c, r); if (!b || !schwereWaffe(a) || TOG.NOEINSTURZ) return;
  b.hp = Math.max(0, b.hp - n); ev.push({ t: 'bauschaden', bau: G.bauten.indexOf(b), art: b.art || 'kirche', hp: b.hp, max: b.max, c, r });
  if (b.hp <= 0) einsturz(G, b, ev);
}
// F79 (2026-11-21): Rammen – Fahrzeug/Schreiter gegen ein intaktes großes Gebäude im Nachbarfeld (Aktion): Bauschaden bis zum Einsturz, eigener Schaden, Pannengefahr; Truppen im Gebäude werden niedergehalten
function rammZiele(G, u) { if (!u || !active(u) || cls(u) !== 'walker' || u.side !== G.side || u.ap < 1 || u.attacked || u.broken > 0 || u.supp > 0 || TOG.NORAMMEN) return [];
  return neighbors(u.c, u.r).filter(([c, r]) => inMap(c, r) && bauAt(G, c, r)); }
function rammen(G, u, c, r) {
  if (!rammZiele(G, u).some(([a, b]) => a === c && b === r)) return [];
  const b = bauAt(G, c, r), ev = []; spend(u, 1); u.attacked = true; u.bp = 0; u.moved = true; u.face = faceToward(u.face, u.c, u.r, c, r);
  ev.push({ t: 'rammen', u: u.id, c, r });
  b.hp = Math.max(0, b.hp - P.RAMM_BAU); ev.push({ t: 'bauschaden', bau: G.bauten.indexOf(b), art: b.art || 'kirche', hp: b.hp, max: b.max, c, r });
  for (const [a, q] of [...b.felder, ...(b.turm ? [b.turm] : [])]) { const x = unitAt(G, a, q); if (x && active(x) && !x.supp) { x.supp = 1; ev.push({ t: 'supp', u: x.id }); } }
  if (b.hp <= 0) einsturz(G, b, ev);
  applyDamage(G, null, u, P.RAMM_SELBST * (0.8 + G.rng() * 0.4), 'front', ev, { morMul: 0.3 });
  if (alive(u) && G.rng() < P.RAMM_PANNE) { u.broken = Math.max(u.broken || 0, panneDauer(G)); ev.push({ t: 'breakdown', u: u.id }); }
  ev.push(...checkEnd(G)); return ev;
}
function einsturz(G, b, ev) {
  b.kaputt = true; const i = G.bauten.indexOf(b), felder = [...b.felder, ...(b.turm ? [b.turm] : [])];
  for (const [c, r] of felder) hex(G, c, r).t = 'village';   // Kirche und Turm werden Ruine (Abwehr ×1,5), Turmvorteil weg
  ev.push({ t: 'einsturz', bau: i, art: b.art || 'kirche', c: b.turm ? b.turm[0] : felder[0][0], r: b.turm ? b.turm[1] : felder[0][1], felder });
  for (const [c, r] of felder) { const u = unitAt(G, c, r); if (!u || !alive(u)) continue;
    applyDamage(G, null, u, P.EINSTURZ_DMG * (0.8 + G.rng() * 0.4), 'front', ev, {});
    if (active(u) && !u.supp) { u.supp = 1; ev.push({ t: 'supp', u: u.id }); } }
}
function isDirect(G, a, c, r) { return dist(a.c, a.r, c, r) <= (TYPES[a.type].direkt ? TYPES[a.type].rng : P.ART_DIRECT) && hasLOS(G, a.c, a.r, c, r); }   // F103: Feldkanone flache Bahn über die ganze Reichweite
// F37 (2026-11-20): Mindestreichweite im Steilfeuer – kleine Werfer (Grabenmörser, Minenwerfer: mobile) ab 2 Feldern, große Geschütze ab 3 Feldern
function minSteil(a) { return TYPES[a.type].mobile ? P.ART_MIN : P.ART_MIN_GROSS; }
// F38 (2026-11-20): kein Beschuss leerer Drahtfelder – Draht geht nur nebenbei kaputt, wenn das Ziel im Draht steht
function leererDraht(G, c, r) { return hex(G, c, r).t === 'wire' && !unitAt(G, c, r); }
function canShell(G, a, c, r, mode) {
  const T = TYPES[a.type];
  if (!active(a) || T.cls !== 'art' || a.limbered || a.attacked || a.ap < 1 || a.supp > 0 || held(G, a)) return false;
  const d = dist(a.c, a.r, c, r);
  if (d < 1 || d > T.rng) return false;
  if (mode === 'he' && leererDraht(G, c, r)) return false;   // F38
  if (mode === 'gas' && (a.gas <= 0 || a.cdG > 0)) return false;   // Gas: 3 Runden Abklingzeit
  if (mode === 'barrage' && (a.cdP > 0 || (a.barr || 0) >= P.BARRAGE_MAX)) return false;   // Sperrfeuer: Abklingzeit, höchstens 2× je Schlacht
  if (T.noMoveFire && a.mvd) return false;   // Minenwerfer: ziehen oder feuern
  if (isDirect(G, a, c, r)) return mode === 'he';
  if (T.direkt) return false;   // F103: Feldkanone nur direkt
  return d >= minSteil(a) && spotted(G, a.side, c, r);   // F37
}
// Markiertes Ziel (Ballonbeobachter, Signaltrupp): keine Streuung, Sprenggranaten ×1,25 – gilt bis zum nächsten eigenen Zug
function guided(G, side, c, r) { return (G.marks || []).some(m => m.side === side && m.c === c && m.r === r); }
function shellDmg(G, a, d, direct, tags) {
  tags = tags || [];
  let m = 1;
  if (cls(d) === 'walker' && direct && TYPES[a.type].abil === 'pzschuss') { m *= P.FK_VS_WALKER; tags.push('Standardgranate auf Panzerung ×1,25'); }   // Punkt 16: der Panzerknacker ist die Panzergranate
  else if (cls(d) === 'walker' && direct) { m *= P.ART_VS_WALKER; tags.push('direkter Schuss auf Koloss ×2,5'); }
  else if (cls(d) === 'walker') { m *= FAK.explosiv.S; tags.push('Sprenggranate gegen schwer gepanzert ×0,5'); }   // F66
  if (direct && smokeAt(G, d.c, d.r)) { m *= P.NEBEL_IN; tags.push('Ziel im Nebel ×0,5'); }   // direkter Schuss in den Nebel
  if (cls(d) === 'flame') m *= P.FLAME_HIT;
  let dm = defMods(G, d, 'front', true, tags);
  if (direct) dm *= kanteFaktor(G, d, a.c, a.r, tags);   // R3: nur der direkte Schuss, Steilfeuer fällt von oben
  m *= splitterU5(G, a, d, dm, tags); dm = deckU5(G, d, dm, tags);   // U5a
  return P.DMG * (TYPES[a.type].fs / (TYPES[d.type].def * dm)) * kraft(a) * m;
}
function gasCells(G, c, r) {
  const out = [[c, r]];
  let p = [c, r];
  for (let i = 0; i < 2; i++) { p = step(p[0], p[1], G.wind); if (inMap(p[0], p[1])) out.push(p); }
  return out;
}
// Sperrfeuer: Geschütze decken Ziel und alle Nachbarn (7 Felder), Mörser nur Ziel und die zwei Nachbarn zum Schützen hin (Wunsch des Nutzers: kleineres Gebiet)
function barrageCells(G, a, c, r) {
  const nb = neighbors(c, r);
  if (!TYPES[a.type].mobile) return [[c, r], ...nb];
  const d = h => dist(a.c, a.r, h[0], h[1]) + Math.hypot(h[0] - a.c, h[1] - a.r) * 0.001;
  return [[c, r], ...nb.slice().sort((x, y) => d(x) - d(y)).slice(0, 2)];
}
// Eis bricht ein (Enrico 2026-11-22 20:50, nur Winterkarten, Sim-Abschalter NOEISBRUCH): schwere Geschütze (Haubitze, Minenwerfer – nicht Feldkanone/Grabenmörser) und Feuerschlag.
// Das Feld wird für P.EISBRUCH_RUNDEN Runden Eisloch (unpassierbar); wer darauf steht, nimmt Schaden und rettet sich aufs nächste freie Ufer, sonst niedergehalten.
function eisSchwer(G, a) { if (!MAP.winter || TOG.NOEISBRUCH) return false; const T = TYPES[a.type]; return T.cls === 'art' && !T.direkt && (!T.mobile || (T.heMul || 1) > 1); }
function eisBruch(G, c, r, ev) {
  const h = hex(G, c, r); if (!MAP.winter || TOG.NOEISBRUCH || !h || h.t !== 'eis') return false;
  h.t = 'eisloch'; h.eisBis = G.turn + P.EISBRUCH_RUNDEN; G.eisBrueche = (G.eisBrueche || 0) + 1;
  const u = unitAt(G, c, r); ev.push({ t: 'eisbruch', c, r, u: u && alive(u) ? u.id : null });
  if (u && alive(u)) {
    applyDamage(G, null, u, P.EISBRUCH_DMG * (0.8 + G.rng() * 0.4), 'front', ev, {});
    if (alive(u)) {
      let best = null, bv = -1e9;
      for (const [nc, nr] of neighbors(c, r)) { if (!inMap(nc, nr) || unitAt(G, nc, nr)) continue; const t = hex(G, nc, nr).t; if (t === 'eis' || t === 'eisloch' || cost(G, u, nc, nr) >= 99) continue;
        const v = (u.side === 'A' ? -nc : nc) * 0.1 + (t === 'open' ? 0.2 : 0) + G.rng() * 0.05; if (v > bv) { bv = v; best = [nc, nr]; } }   // lieber zur eigenen Seite
      if (best) { ev.push({ t: 'eisweg', u: u.id, path: [[c, r], best] }); u.c = best[0]; u.r = best[1]; }
      else if (active(u) && !u.supp) { u.supp = 1; ev.push({ t: 'supp', u: u.id }); }
    }
  }
  return true;
}
function shell(G, a, c, r, mode) {
  if (!canShell(G, a, c, r, mode)) return [];
  const ev = [];
  a.attacked = true; spend(a, 1);
  if (mode === 'barrage') { a.cdP = P.BARRAGE_CD; a.barr = (a.barr || 0) + 1; }
  if (mode === 'gas') a.cdG = P.GAS_CD;
  a.face = faceToward(a.face, a.c, a.r, c, r);
  const direct = isDirect(G, a, c, r);
  let tc = c, tr = r, sc = false;
  const gd = !direct && guided(G, a.side, c, r), roll = direct ? 1 : G.rng();
  if (!direct && !gd && roll < P.SCATTER) { const nb = neighbors(c, r); const p = nb[Math.floor(G.rng() * nb.length)]; tc = p[0]; tr = p[1]; sc = true; }
  ev.push({ t: 'shell', a: a.id, c: tc, r: tr, mode, scatter: sc, guided: gd, face: a.face, cells: mode === 'barrage' ? barrageCells(G, a, tc, tr) : null });
  if (mode === 'he') {
    const d = unitAt(G, tc, tr);
    if (d) applyDamage(G, a, d, shellDmg(G, a, d, direct) * (gd ? P.GUIDED : 1) * (TYPES[a.type].heMul || 1) * (0.75 + G.rng() * 0.5), 'front', ev, { ranged: true });
    kircheTreffer(G, a, tc, tr, ev, (TYPES[a.type].heMul || 1) > 1 ? 2 : 1);
    const h = hex(G, tc, tr);
    if (TYPES[a.type].breaker && (h.t === 'barrikade' || (h.t === 'wire' && G.rng() < P.BREAKER_WIRE))) { const w = h.t === 'wire'; h.t = w ? 'open' : 'crater'; ev.push({ t: 'terrain', c: tc, r: tr, what: w ? 'Draht zerschossen' : 'gesprengt' }); }   // F38: Minenwerfer am stärksten, aber nicht sicher   // Minenwerfer räumt Draht und Barrikaden
    else if (h.t === 'wire' && G.rng() < P.HE_WIRE) { h.t = 'open'; ev.push({ t: 'terrain', c: tc, r: tr, what: 'Draht zerschossen' }); }
    else if (h.t === 'open' && G.rng() < P.HE_CRATER) { h.t = 'crater'; ev.push({ t: 'terrain', c: tc, r: tr }); }
    else if (h.t === 'eis' && eisSchwer(G, a)) eisBruch(G, tc, tr, ev);
  } else if (mode === 'barrage') {
    for (const [hc, hr] of barrageCells(G, a, tc, tr)) {
      const u = unitAt(G, hc, hr);
      if (u && alive(u)) applyDamage(G, a, u, shellDmg(G, a, u, false) * P.BARRAGE_DMG * (0.75 + G.rng() * 0.5), 'front', ev, { ranged: true });   // Paket 8: Schaden ×0,7 eines Einzelschusses
      if (u && active(u) && cls(u) !== 'walker' && !u.supp) { u.supp = 1; ev.push({ t: 'supp', u: u.id }); }
    }
    if (hex(G, tc, tr).t === 'eis' && eisSchwer(G, a) && G.rng() < P.EISBRUCH_SPERR) eisBruch(G, tc, tr, ev);   // Sperrfeuer: Zielfeld bricht manchmal ein
    { const getroffen = new Set(); for (const [hc, hr] of barrageCells(G, a, tc, tr)) { const b = bauAt(G, hc, hr); if (b && !getroffen.has(b)) { getroffen.add(b); kircheTreffer(G, a, hc, hr, ev); } } }   // Sperrfeuer: je Gebäude ein Treffer
  } else if (mode === 'gas') {
    a.gas--;
    for (const [gc, gr] of gasCells(G, tc, tr)) {
      const k = G.clouds.find(x => x.c === gc && x.r === gr);
      if (k) k.ttl = P.GAS_TTL; else G.clouds.push({ c: gc, r: gr, ttl: P.GAS_TTL });
    }
    ev.push({ t: 'gascloud' });
  }
  ev.push(...checkEnd(G));
  return ev;
}

// ---------- Rundenablauf ----------
function startTurn(G) {
  const ev = [];
  const s = G.side;
  if (s === 'A' && G.turn > 1) {
    if (MAP.winter) for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) { const h = G.map[c][r]; if (h.t === 'eisloch' && G.turn >= h.eisBis) { h.t = 'eis'; delete h.eisBis; ev.push({ t: 'eiszu', c, r }); } }   // Eisloch friert wieder zu
    if (G.rng() < P.WIND_SHIFT) { G.wind = (G.wind + (G.rng() < 0.5 ? 1 : 5)) % 6; ev.push({ t: 'wind', dir: G.wind }); }
    if (G.clouds.length) {
      for (const k of G.clouds) { k.ttl--; const p = step(k.c, k.r, G.wind); k.c = p[0]; k.r = p[1]; }
      G.clouds = G.clouds.filter(k => k.ttl > 0 && inMap(k.c, k.r));
      ev.push({ t: 'gascloud' });
    }
  }
  G.pts[s] += P.PTS_TURN[s];
  { // Siegpunkte: jedes Zielfeld, das die Seite über die gegnerische Runde gehalten hat, zählt
    let add = 0; for (const o of OBJECTIVES) if (G.ctrl[o.id] === s) add += o.pts;
    if (add) { G.vp[s] += add; ev.push({ t: 'score', side: s, add, vp: G.vp[s], goal: G.goal }); }
    if (G.vp[s] >= G.goal) { G.over = { winner: s, why: 'points', pts: G.vp[s], vp: { ...G.vp } }; ev.push({ t: 'over', result: G.over }); return ev; }
  }
  if (G.hold) G.hold[s] = false;   // „Halten um jeden Preis“ gilt bis zum nächsten eigenen Zug
  if (G.fires && G.fires.length) { const n = G.fires.length; G.fires = G.fires.filter(f => f.side !== s); if (G.fires.length !== n) ev.push({ t: 'fireout' }); }   // eigene Brände erlöschen
  for (const u of G.units) if (u.side === s && alive(u) && fireAt(G, u.c, u.r)) burn(G, u, ev);   // wer im Feuer steht, nimmt Schaden
  G.smoke = G.smoke.filter(k => k.side !== s); G.lit = G.lit.filter(k => k.side !== s); G.marks = (G.marks || []).filter(k => k.side !== s);
  ev.push(...tunnelsTick(G, s));
  for (const u of G.units) {
    u.fireDmg = 0;
    if (u.side === s) {
      u.ap = P.AP; u.bp = bpMax(u); u.bpUsed = 0; u.sturmlauf = false; u.mvd = 0; u.zocStop = false; u.moved = false; u.attacked = false; u.turnOnly = false; u.run = 0; u.gassed = false; u.sent = false; u.ow = false; u.ordered = false; u.ammoed = false; u.fellBack = false; u.sperr = 0; u.fireFree = false; u.shields = false; u.bsT = []; u.task = null; u.zw = false; u.holdB = false; u.gedreht = false; u.abgeprotzt = false;
      for (const k of ['cd', 'cdR', 'cdS', 'cdH', 'cdB', 'cdA', 'cdP', 'cdG', 'cdM', 'kuehl']) if (u[k] > 0) u[k]--;
      u.dfN = 0;
      if (u.revealed > 0) u.revealed--;
      if (TYPES[u.type].counterStrike) u.cready = true;
      if (u.stuck > 0) { u.stuck--; if (!u.stuck) ev.push({ t: 'unstuck', u: u.id }); }
      if (u.status === 'ok' && cls(u) !== 'walker') { const fh = G.units.find(h => h.side !== u.side && alive(h) && TYPES[h.type].aura === 'furcht' && dist(h.c, h.r, u.c, u.r) <= 1);   // Held Kürassier: Furcht
        if (fh) { u.mor = Math.max(0.5, u.mor - (u5aus() ? P.FURCHT_MOR : P.FURCHT_MOR_U5)); ev.push({ t: 'furcht', u: u.id, by: fh.id, mor: u.mor }); } }
    }
  }
  for (const u of G.units.filter(x => x.side === s && alive(x))) {
    if (cloudAt(G, u.c, u.r) && !gasSafe(G, u)) {
      u.str = Math.max(0, u.str - P.GAS_STR); u.mor = Math.max(0, u.mor - P.GAS_MOR); u.gassed = true;
      u.poison = P.POISON_TURNS;   // wirkt nach dem Verlassen der Wolke noch nach
      ev.push({ t: 'gas', u: u.id, str: u.str, morv: u.mor, poison: u.poison });
      if (u.str < 0.3) { killUnit(G, u, ev, 'destroyed'); continue; }
      if (u.status === 'ok' && (u.str < P.ROUT_STR || u.mor <= 0) && !noFlee(G, u)) { u.status = 'rout'; u.supp = 0; credit(G, u); ev.push({ t: 'rout', u: u.id }); }
    }
    else if (u.poison > 0) {   // vergiftet (außerhalb der Wolke): halber, dann viertel Gasschaden
      const k = P.POISON_K[Math.min(u.poison, P.POISON_K.length) - 1]; u.poison--;
      if (!gasSafe(G, u) && !TOG.NOPOISON) {
        u.str = Math.max(0, u.str - P.GAS_STR * k); u.mor = Math.max(0, u.mor - P.GAS_MOR * k);
        ev.push({ t: 'gas', u: u.id, str: u.str, morv: u.mor, poison: u.poison, late: true });
        if (u.str < 0.3) { killUnit(G, u, ev, 'destroyed'); continue; }
        if (u.status === 'ok' && (u.str < P.ROUT_STR || u.mor <= 0) && !noFlee(G, u)) { u.status = 'rout'; u.supp = 0; credit(G, u); ev.push({ t: 'rout', u: u.id }); }
      }
    }
    if (u.broken > 0) {
      u.broken--;
      if (u.broken > 0) { u.ap = 0; u.bp = 0; u.moved = true; u.attacked = true; } else ev.push({ t: 'repaired', u: u.id });
    }
    if (u.status === 'rout') {
      const off = G.units.find(o => o.officer && o.side === s && active(o) && dist(o.c, o.r, u.c, u.r) <= P.OFFICER_RANGE);
      if (off && !adjEnemies(G, u).length && u.str >= P.ROUT_STR && G.rng() < P.RALLY) {
        u.status = 'ok'; u.mor = 3; u.face = s === 'A' ? 0 : 3;
        ev.push({ t: 'rally', u: u.id, by: off.officer });
        u.ap = 0; u.bp = 0; u.moved = true; u.attacked = true;
        continue;
      }
      if (u.c === SIDES[s].edge) { killUnit(G, u, ev, 'escaped'); continue; }
      flee(G, u, TYPES[u.type].mv + 1, ev);
      if (alive(u) && u.c === SIDES[s].edge) killUnit(G, u, ev, 'escaped');
      u.ap = 0; u.bp = 0; u.moved = true; u.attacked = true;
      continue;
    }
    if (!adjEnemies(G, u).length && !u.supp && !u.gassed) {
      const t = hex(G, u.c, u.r).t;
      const rec = ['trench', 'village', 'forest', 'bunker', 'wald', 'fabrik', 'kirche', 'barrikade', 'schiff', 'turm'].includes(t) ? P.RECOVER_COVER : P.RECOVER;
      u.mor = Math.min(TYPES[u.type].mor, u.mor + rec * (officerAt(G, u.side, u.c, u.r) ? 1.5 : 1) + (bannerAt(G, u.side, u.c, u.r) ? 0.5 : 0));
    }
  }
  ev.push(...checkEnd(G));
  return ev;
}
// Einheit für diese Runde abschließen (Knopf „Fertig“)
function pass(G, u) { if (!u || !active(u) || u.side !== G.side) return []; u.ap = 0; u.bp = 0; u.moved = true; u.attacked = true; return [{ t: 'pass', u: u.id }]; }

// Drahtpioniere: Stacheldraht auf das Feld legen, in das die Einheit blickt
function layTarget(G, u) { const [c, r] = step(u.c, u.r, u.face); return inMap(c, r) && ['open', 'crater', 'mud'].includes(hex(G, c, r).t) && !unitAt(G, c, r) && !hex(G, c, r).obj ? [c, r] : null; }
function canLay(G, u) { return active(u) && !!TYPES[u.type].wirelayer && u.side === G.side && u.ap >= 1 && !u.attacked && u.supp <= 0 && !!layTarget(G, u); }
function layWire(G, u) { if (!canLay(G, u)) return []; const [c, r] = layTarget(G, u); hex(G, c, r).t = 'wire'; u.attacked = true; spend(u, 1); return [{ t: 'terrain', c, r, what: 'Draht gezogen' }]; }

// Meldegänger mit Hund: bringt einer eigenen Einheit bis 3 Felder einen Befehl, sie bekommt +1 Aktionspunkt (einmal je Runde)
function canSend(G, m, t) { return active(m) && !!TYPES[m.type].courier && m.side === G.side && m.ap >= 1 && !(m.supp > 0) && !m.sent && !(m.cdM > 0 && !TOG.NOMELDERCD) && t && t !== m && t.side === m.side && active(t) && !t.broken && !TYPES[t.type].courier && (t.ap || 0) < 3 && dist(m.c, m.r, t.c, t.r) <= 3; }
function sendOrder(G, m, t) { if (!canSend(G, m, t)) return []; m.sent = true; m.cdM = P.MELDER_CD; spend(m, 1); t.bp = (t.bp || 0) + P.MELDER_BP; t.moved = false; return [{ t: 'sent', u: t.id, by: m.id, bp: t.bp }]; }   // Meldegänger: +2 BP, danach Abklingzeit P.MELDER_CD (Punkt 7, 2026-11-24: jede zweite eigene Runde)

// MG aufbauen (1 Punkt): erst dann feuert es und gibt Reaktionsfeuer. Ziehen baut es wieder ab.
function canSetup(G, u) { return active(u) && !!TYPES[u.type].mg && u.side === G.side && !u.setup && (u.bp || 0) >= 1 && !u.broken && u.supp <= 0; }   // 1 BP, nimmt alle restlichen BP
function setupMG(G, u) { if (!canSetup(G, u)) return []; u.setup = true; u.bp = 0; u.moved = u.ap <= 0; return [{ t: 'setup', u: u.id }]; }
// MG abbauen (Wunsch 2026-11-16): eigene Aktion für 1 Aktionspunkt. Aufgebaut kann das MG schießen, aber nicht ziehen; abgebaut umgekehrt.
function canTeardown(G, u) { return active(u) && !!TYPES[u.type].mg && u.side === G.side && !!u.setup && (u.bp || 0) >= 1 && !u.broken && !TOG.NOSETUP; }   // 1 BP
// F70 (2026-11-21): Fesselballon einholen (1 BP; danach zieht er 2 Felder, Sicht 4, kein Markieren) bzw. aufsteigen (alle BP, nicht die Aktion – markieren geht danach noch)
const luft = u => !!TYPES[u.type].aerial && !u.eingeholt;
function canEinholen(G, u) { return active(u) && !!TYPES[u.type].fessel && u.side === G.side && !u.eingeholt && (u.bp || 0) >= 1; }
function einholen(G, u) { if (!canEinholen(G, u)) return []; u.eingeholt = true; u.bp -= 1; u.bpUsed = (u.bpUsed || 0) + 1; return [{ t: 'einholen', u: u.id }]; }
function canAufsteigen(G, u) { return active(u) && !!TYPES[u.type].fessel && u.side === G.side && !!u.eingeholt && !(u.supp > 0); }
function aufsteigen(G, u) { if (!canAufsteigen(G, u)) return []; u.eingeholt = false; u.bpUsed = (u.bpUsed || 0) + (u.bp || 0); u.bp = 0; return [{ t: 'aufsteigen', u: u.id }]; }
function teardownMG(G, u) { if (!canTeardown(G, u)) return []; u.setup = false; u.ow = false; u.bp -= 1; u.moved = u.ap <= 0 && !(u.bp > 0); return [{ t: 'teardown', u: u.id }]; }
// MG-Sperrfeuer (Gruppe 1, 2026-11-16): ersetzt das automatische Reaktionsfeuer. Nur aufgebaut, in dieser Runde nicht bewegt und nicht geschossen;
// kostet die restlichen Punkte. In der gegnerischen Runde bis zu 2 Schüsse auf Gegner, die sich im Schussfeld im Offenen bewegen.
// F55 (2026-11-20): in Feindberührung (aktiver Gegner im Nachbarfeld) weder Feuerbereitschaft noch Sperrfeuer – wie beim Schießen
function feindNah(G, u) { return neighbors(u.c, u.r).some(([c, r]) => { const o = inMap(c, r) && unitAt(G, c, r); return o && o.side !== u.side && active(o); }); }
function canSperr(G, u) { return active(u) && !!TYPES[u.type].mg && u.side === G.side && !!u.setup && !u.mvd && !u.attacked && u.ap >= 1 && !u.broken && !(u.supp > 0) && !feindNah(G, u); }
function sperr(G, u) { if (!canSperr(G, u)) return []; u.sperr = P.SPERR_SHOTS; u.ap = 0; u.bp = 0; u.moved = true; u.attacked = true; return [{ t: 'sperr', u: u.id }]; }
// Feuerbereitschaft (Aktion, nur ohne Bewegung): schießt in der gegnerischen Runde auf den ersten Gegner, der sich in Reichweite bewegt (Schaden ×0,8)
function canOverwatch(G, u) { const T = TYPES[u.type]; return active(u) && u.side === G.side && u.ap >= 1 && !u.attacked && !u.mvd && T.rng >= 2 && T.cls !== 'art' && T.cls !== 'walker' && !T.mg && u.supp <= 0 && !feindNah(G, u); }
function overwatch(G, u) { if (!canOverwatch(G, u)) return []; u.ow = true; u.ap = 0; u.bp = 0; u.moved = true; u.attacked = true; return [{ t: 'ow', u: u.id }]; }
// Bergen: Pioniere befreien einen festgefahrenen oder liegengebliebenen eigenen Koloss bzw. eine Kampfmaschine im Nachbarfeld (1 Punkt, 2 Runden Abklingzeit)
function canRecover(G, m, t) { return active(m) && !!TYPES[m.type].recover && m.side === G.side && m.ap >= 1 && !(m.supp > 0) && !(m.cdB > 0) && m.task !== 'ammo' && t && t.side === m.side && alive(t) && cls(t) === 'walker' && (t.stuck > 0 || t.broken > 0) && dist(m.c, m.r, t.c, t.r) === 1; }
function recover(G, m, t) {
  if (!canRecover(G, m, t)) return [];
  spend(m, 1); m.cdB = P.RECOVER_CD; m.task = 'fix'; m.face = faceToward(m.face, m.c, m.r, t.c, t.r);
  t.stuck = 0; const wasBroken = t.broken > 0; t.broken = 0;
  return [{ t: 'recovered', u: t.id, by: m.id, broken: wasBroken }];
}

// ---------- Fähigkeiten der Skirmish-Trupps (T.abil) ----------
const ABILS = {
  smoke: { name: 'Nebelwand', icon: '☁', ap: 2, cd: 3, atk: true },
  tunnel: { name: 'Stollen graben', icon: '⛏', ap: 2, cd: 4 },
  charge: { name: 'Haftladung', icon: '✸', ap: 2, cd: 2, atk: true },
  mine: { name: 'Mine legen', icon: '◍', ap: 1, cd: 0 },
  light: { name: 'Ausleuchten', icon: '☀', ap: 1, cd: 2 },
  clear: { name: 'Entgiften', icon: '✚', ap: 1, cd: 2 },
  ammo: { name: 'Nachladen', icon: '▤', ap: 1, cd: 2 },
  mark: { name: 'Ziel markieren', icon: '◎', ap: 1, cd: 0 },
  strike: { name: 'Feuerschlag anfordern', icon: '✹', ap: 1, cd: 3, atk: true, all: true },
  rush: { name: 'Sturmlauf', icon: '➹', ap: 2, cd: 0, atk: true, all: true },
  sprung: { name: 'Sprungangriff', icon: '⤴', ap: 1, cd: 2, atk: true, all: true },
  rollen: { name: 'Sturmrollen', icon: '⇶', ap: 1, cd: 3, atk: true, all: true },
  durchbruch: { name: 'Durchbruch', icon: '✊', ap: 1, cd: 2, atk: true, all: true },
  hinrichtung: { name: 'Hinrichtung', icon: '⚔', ap: 1, cd: 3, atk: true },
  pzgranate: { name: 'Panzergranate werfen', icon: '✸', ap: 1, cd: 2, atk: true },
  handgranate: { name: 'Handgranaten', icon: '✸', ap: 1, cd: 2, atk: true },
  kopfrunter: { name: 'Kopf runter!', icon: '⌖', ap: 1, cd: 2, atk: true },
  pzschuss: { name: 'Panzergranate', icon: '✸', ap: 1, cd: 0, atk: true }
};
const FORT = ['trench', 'bunker', 'barrikade', 'kirche', 'fabrik', 'village', 'schiff', 'turm'];
function gasSafe(G, u) { return !!TYPES[u.type].gasproof || TYPES[u.type].cls === 'walker' ||   // Kolosse und Maschinen: geschlossen, immun
   G.units.some(o => o.side === u.side && active(o) && TYPES[o.type].gasproof && dist(o.c, o.r, u.c, u.r) === 1); }
// Sturmlauf: gerade Linie (eine der 6 Richtungen), 1–4 Felder, keine Einheit im Weg, Ziel frei und betretbar; Draht hält nicht auf
function rushPath(G, u, c, r) {
  if (u.mvd || u.ap < 1 || unitAt(G, c, r)) return null;   // Sturmlauf: die Aktion, nur aus dem Stand
  if (!TOG.RUSH_GERADE) {   // Punkt 8 (Enrico 2026-11-23): kürzester Weg bis P.RUSH Felder statt nur gerade Linien; Feindberührung hält nicht auf, durch Einheiten nicht hindurch; Minen, Draht, Gas, Feuer werden betreten (moveUnit hält dort an bzw. verletzt)
    const prev = new Map([[key(u.c, u.r), null]]); let front = [[u.c, u.r]];
    for (let i = 0; i < P.RUSH && front.length; i++) { const nf = [];
      for (const [a, b] of front) for (const [x, y] of neighbors(a, b)) { if (!inMap(x, y)) continue; const k = key(x, y); if (prev.has(k) || cost(G, u, x, y) >= 99 || unitAt(G, x, y)) continue;
        prev.set(k, [a, b]); nf.push([x, y]); if (x === c && y === r) { const path = []; let p = [x, y]; while (p && !(p[0] === u.c && p[1] === u.r)) { path.unshift(p); p = prev.get(key(p[0], p[1])); } return path; } }
      front = nf; }
    return null; }
  for (let f = 0; f < 6; f++) { const path = []; let p = [u.c, u.r];
    for (let i = 0; i < P.RUSH; i++) { p = step(p[0], p[1], f); if (!inMap(p[0], p[1]) || cost(G, u, p[0], p[1]) >= 99) break; const x = unitAt(G, p[0], p[1]); if (x) break; path.push(p); if (p[0] === c && p[1] === r) return path; } }
  return null;
}
// Sprungangriff (Löwenoger, 2026-11-20): Landefeld bis P.SPRUNG Felder vom Oger, neben dem Gegner, frei und betretbar (kein Draht als Landefeld);
// Weg egal (über Draht, Gräben, Gegner hinweg). Bestes Landefeld: viel Deckung, dann nah am Oger. Nur aus dem Stand.
function sprungLand(G, u, d) {
  if (!d || !alive(d) || d.side === u.side || u.mvd || u.ap < 1) return null;
  let best = null, bv = -1e9;
  for (const [c, r] of neighbors(d.c, d.r)) {
    if (!inMap(c, r) || unitAt(G, c, r)) continue;
    const k = dist(u.c, u.r, c, r); if (k < 1 || k > P.SPRUNG || cost(G, u, c, r) >= 99 || hex(G, c, r).t === 'wire') continue;
    const v = coverOf(G, Object.assign({}, u, { c, r })).tier * 2 - k * 0.5 - (fireAt(G, c, r) ? 5 : 0) - (cloudAt(G, c, r) ? 3 : 0);
    if (v > bv) { bv = v; best = [c, r]; }
  }
  return best;
}
// F54 (2026-11-21): Sturmrollen (Landkoloss, Sturmpanzer) – Ziel Fußtruppe oder Geschütz (keine Panzer/Schreiter) im Nachbarfeld oder 2 Felder geradeaus mit freiem Feld dazwischen (Anlauf, nur aus dem Stand).
// Liefert { mitte, richtung } oder null. Ein Aufprall: P.ROLLEN_DMG, niedergehalten, Moral −P.ROLLEN_MOR; das Ziel rutscht ein Feld zurück, sonst ×P.ROLLEN_WAND.
function rollenWeg(G, u, d) {
  if (TOG.NOROLLEN) return null;   // Sim-Abschalter
  if (!d || !alive(d) || d.side === u.side || cls(d) === 'walker') return null;
  for (let f = 0; f < 6; f++) { const p1 = step(u.c, u.r, f); if (p1[0] === d.c && p1[1] === d.r) return { mitte: null, richtung: f };
    if (u.mvd || !inMap(p1[0], p1[1]) || unitAt(G, p1[0], p1[1]) || cost(G, u, p1[0], p1[1]) >= 99) continue;
    const p2 = step(p1[0], p1[1], f); if (p2[0] === d.c && p2[1] === d.r) return { mitte: p1, richtung: f }; }
  return null;
}
const pzgDmg = (u, d) => P.PZG_DMG * 2 * kraft(u) / Math.max(1, TYPES[d.type].def / 4);   // wie die Haftladung gegen Kolosse
const rollenGraben = (G, d) => !TOG.NOROLLGRABEN && (d.dug || ['trench', 'bunker'].includes(hex(G, d.c, d.r).t));   // SP-2 84.4: der Graben schützt (Sim-Abschalter NOROLLGRABEN)
function rollenDmg(G, u, d, wand) { const gr = rollenGraben(G, d); return P.ROLLEN_DMG * kraft(u) * (TYPES[d.type].suit ? 0.5 : 1) * (gr ? P.ROLLEN_GRABEN : wand ? P.ROLLEN_WAND : 1) / Math.max(1, TYPES[d.type].def / 4); }
function abilTargets(G, u) {
  const T = TYPES[u.type], k = T.abil, A = ABILS[k];
  if (T.ladungen && (u.ladUsed || 0) >= T.ladungen) return [];   // F78 (2026-11-21): Sprengladungen der Mineure, höchstens T.ladungen je Trupp und Schlacht
  if (!A || !active(u) || u.side !== G.side || u.ap < 1 || u.cdA > 0 || u.supp > 0 || u.broken > 0 || (A.atk && u.attacked)) return [];
  const out = [], foe = (c, r) => { const x = unitAt(G, c, r); return x && x.side !== u.side ? x : null; };
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) {
    const d = dist(u.c, u.r, c, r), t = hex(G, c, r).t, x = unitAt(G, c, r);
    if (k === 'smoke' && d >= 1 && d <= 3) out.push([c, r]);
    else if (k === 'tunnel' && d >= 1 && d <= 2 && FORT.includes(t) && !(x && x.side === u.side) && !G.tunnels.some(q => q.c === c && q.r === r)) out.push([c, r]);
    else if (k === 'charge' && d === 1 && (foe(c, r) || (!x && ['bunker', 'barrikade', 'wire', 'sperre'].includes(t)))) out.push([c, r]);
    else if (k === 'mine' && !(T.wirelayer && u.attacked) && d === 1 && (u.mines || 0) > 0 && !x && !hex(G, c, r).obj && cost(G, { type: 'grenadier', side: u.side }, c, r) < 99 && !G.mines.some(q => q.c === c && q.r === r)) out.push([c, r]);
    else if (k === 'light' && d >= 1 && d <= 4 && hasLOS(G, u.c, u.r, c, r)) out.push([c, r]);
    else if (k === 'clear' && d === 0 && G.clouds.some(q => dist(q.c, q.r, c, r) <= 1)) out.push([c, r]);
    else if (k === 'rush' && rushPath(G, u, c, r)) out.push([c, r]);
    else if (k === 'sprung' && x && x.side !== u.side && alive(x) && d <= P.SPRUNG + 1 && sprungLand(G, u, x)) out.push([c, r]);
    else if (k === 'rollen' && x && d <= 2 && rollenWeg(G, u, x)) out.push([c, r]);
    else if (k === 'durchbruch' && x && d <= 2 && rollenWeg(G, u, x)) out.push([c, r]);   // Held Rote Faust: wie Sturmrollen (geradeaus, keine Panzer/Schreiter)
    else if (k === 'hinrichtung' && x && d === 1 && x.side !== u.side && alive(x) && cls(x) !== 'walker' && x.str < P.HINRICHT_STR) out.push([c, r]);
    else if (k === 'pzschuss' && x && x.side !== u.side && alive(x) && panzerKl(x.type) !== 'U' && !u.limbered && !(u.supp > 0) && d >= 1 && d <= T.rng && isDirect(G, u, c, r)) out.push([c, r]);   // Punkt 16: nur gepanzerte Ziele, direkter Schuss
    else if (k === 'kopfrunter' && x && x.side !== u.side && !u.mvd && !(x.supp > 0) && canFire(G, Object.assign({}, u, { attacked: false }), x)) out.push([c, r]);   // Punkt 3: gezielter Schuss zum Niederhalten, nur aus dem Stand, wie ein Schuss in Reichweite und Sicht
    else if (k === 'handgranate' && x && x.side !== u.side && alive(x) && d >= 1 && d <= P.HANDGR_RNG && !concealed(G, x, u.c, u.r) && hasLOS(G, u.c, u.r, c, r)) out.push([c, r]);   // Punkt 34: Feind daneben oder ein Feld weiter
    else if (k === 'pzgranate' && x && x.side !== u.side && alive(x) && cls(x) === 'walker' && d >= 1 && d <= P.PZG_RNG && hasLOS(G, u.c, u.r, c, r)) out.push([c, r]);   // F80: nur gegen Fahrzeuge und Schreiter
    else if ((k === 'mark' || k === 'strike') && !(T.fessel && u.eingeholt) && d >= 1 && d <= (T.spot || P.SPOT) && !smokeAt(G, c, r) && hasLOS(G, u.c, u.r, c, r, luft(u)) && !(k === 'mark' && guided(G, u.side, c, r))) out.push([c, r]);
    else if (k === 'ammo' && !u.task && d === 1 && x && x.side === u.side && active(x) && (TYPES[x.type].mg || TYPES[x.type].cls === 'art') && x.attacked && !x.ammoed) out.push([c, r]);
  }
  return out;
}
// K4 (Enrico 2026-11-22): Anlauf von Durchbruch und Sturmrollen nach den normalen Zugregeln (moveUnit: Minen, Sperrfeuer, Feuerbereitschaft, Freischlag, Feuer, Gas, Draht);
// kommt der Angreifer nicht unversehrt am Anlauffeld an (Halt, niedergehalten, geflohen), entfällt der Stoß – die Fähigkeit ist trotzdem verbraucht.
function anlauf(G, u, mitte, ev) {
  ev.push(...moveUnit(G, u, mitte[0], mitte[1], { path: [mitte], ap: 0, rush: true, keineFurcht: true }));
  return !G.over && alive(u) && u.status === 'ok' && u.c === mitte[0] && u.r === mitte[1] && !(u.supp > 0) && !(u.stuck > 0) && !(u.broken > 0);
}
// K4: das zurückgeschleuderte Ziel löst eine Mine aus (ein aufgebautes MG bleibt aufgebaut, Enrico 2026-11-22)
function rueckstossFolgen(G, d, ev) {
  if (TYPES[d.type].mg && d.setup && TOG.RUECKMG_AB) { d.setup = false;   // Enrico 2026-11-22: Rückstoß schiebt ein MG nur zurück, baut es nicht ab (RUECKMG_AB=1 nur zum Messen)
    d.ow = false; d.sperr = 0; ev.push({ t: 'teardown', u: d.id }); }
  const mi = G.mines.findIndex(k => k.c === d.c && k.r === d.r && k.side !== d.side);
  if (mi >= 0) { G.mines.splice(mi, 1); ev.push({ t: 'mine', u: d.id, c: d.c, r: d.r }); applyDamage(G, null, d, P.MINE_DMG * (0.8 + G.rng() * 0.4), 'front', ev, { ranged: true }); }
  if (alive(d) && fireAt(G, d.c, d.r)) burn(G, d, ev);
  claimObjective(G, d);
}
function canAbil(G, u, c, r) { return abilTargets(G, u).some(([a, b]) => a === c && b === r); }
function useAbil(G, u, c, r) {
  if (!canAbil(G, u, c, r)) return [];
  const T = TYPES[u.type], k = T.abil, A = ABILS[k], ev = [];
  const rw = k === 'rollen' || k === 'durchbruch' ? rollenWeg(G, u, unitAt(G, c, r)) : null;   // vor dem Verbuchen prüfen (aus dem Stand)
  if (k === 'rollen' || k === 'durchbruch' || k === 'sprung') ev.push({ t: 'abilTitel', u: u.id, k });   // Enrico 2026-11-22: Titel vor dem Anlauf/Sprung (nur Anzeige)
  spend(u, 1); u.cdA = A.cd; if (T.ladungen) u.ladUsed = (u.ladUsed || 0) + 1; if (A.atk) u.attacked = true; if (A.all) { u.ap = 0; u.bp = 0; u.moved = true; }
  u.face = faceToward(u.face, u.c, u.r, c, r);
  const area = [[c, r], ...neighbors(c, r)].filter(([a, b]) => inMap(a, b));
  if (k === 'smoke') { for (const [a, b] of area) if (!smokeAt(G, a, b)) G.smoke.push({ c: a, r: b, side: u.side }); ev.push({ t: 'smoke', u: u.id, c, r, cells: area }); }
  else if (k === 'tunnel') { G.tunnels.push({ c, r, side: u.side, t: 2, by: u.id }); ev.push({ t: 'tunnel', u: u.id, c, r }); }
  else if (k === 'charge') {
    const d = unitAt(G, c, r); ev.push({ t: 'blast', u: u.id, c, r });
    if (d && d.side !== u.side) {
      const wk = cls(d) === 'walker', dmg = P.CHARGE_DMG * (wk ? 2 : 1) * kraft(u) * (0.8 + G.rng() * 0.4) / Math.max(1, TYPES[d.type].def / 4);
      applyDamage(G, u, d, dmg, 'front', ev);
      if (alive(d) && wk && G.rng() < 0.5) { d.broken = Math.max(d.broken || 0, 1); ev.push({ t: 'breakdown', u: d.id }); }
    }
    const h = hex(G, c, r);
    if (h.t === 'bunker' || h.t === 'barrikade') { h.t = 'crater'; ev.push({ t: 'terrain', c, r, what: 'gesprengt' }); }
    else if (h.t === 'sperre') { h.t = 'crater'; h.gesprengt = true; ev.push({ t: 'terrain', c, r, what: 'Panzersperre gesprengt' }); }   // G6: Trümmer im Trichter
    else if (h.t === 'wire') { h.t = 'open'; ev.push({ t: 'terrain', c, r, what: 'Draht zerrissen' }); }
    ev.push(...checkEnd(G));
  }
  else if (k === 'mine') { G.mines.push({ c, r, side: u.side, ...(!TOG.NOLICHT && imLicht(G, u.side, c, r) ? { known: (G.marks.find(m => m.side !== u.side && dist(m.c, m.r, c, r) <= 1) || {}).side } : {}) }); u.mines--; if (T.wirelayer) u.attacked = true;   // Drahtpioniere: Mine statt Draht
    ev.push({ t: 'mineLaid', u: u.id, c, r, left: u.mines }); }
  else if (k === 'light') { for (const [a, b] of area) { G.lit.push({ c: a, r: b, side: u.side }); G.smoke = G.smoke.filter(q => !(q.c === a && q.r === b)); } ev.push({ t: 'light', u: u.id, c, r, cells: area }); }
  else if (k === 'clear') { const n = G.clouds.length; G.clouds = G.clouds.filter(q => dist(q.c, q.r, c, r) > 1); ev.push({ t: 'clear', u: u.id, c, r, n: n - G.clouds.length }); }
  else if (k === 'rush') {   // Sturmlauf: Lauf (Sperrfeuer und Feuerbereitschaft unterwegs wie sonst), dann Nahkampf auf den schwächsten Gegner daneben
    u.ap = 1; const path = rushPath(G, u, c, r) || [];   // Weg mit den Punkten von vor useAbil prüfen
    u.attacked = false; u.sturmlauf = true;   // useAbil hat die Aktion schon verbucht; für Lauf und Schlag wieder freigeben
    ev.push({ t: 'rush', u: u.id, c, r });
    ev.push(...moveUnit(G, u, c, r, { path, ap: 0, rush: true }));
    if (alive(u) && u.status === 'ok' && !(u.supp > 0)) {
      const foes = neighbors(u.c, u.r).map(([a, b]) => unitAt(G, a, b)).filter(o => o && o.side !== u.side && alive(o)).sort((x, y) => x.str - y.str);
      u.ap = 1; u.attacked = false; u.broken = 0;
      if (foes.length) ev.push(...melee(G, u, foes[0]));
    }
    u.ap = 0; u.attacked = true; u.moved = true;
  }
  else if (k === 'pzschuss') {   // Punkt 16: Panzergranate – stark gegen schwer gepanzert, mittel gegen leicht gepanzert
    const d = unitAt(G, c, r), kl = panzerKl(d.type), mul = kl === 'S' ? P.PZS_S : kl === 'L' ? P.PZS_L : P.PZS_U, dm = defMods(G, d, 'front', true, []);
    ev.push({ t: 'pzschuss', u: u.id, d: d.id, c, r, face: u.face });
    applyDamage(G, u, d, P.DMG * (T.fs / (TYPES[d.type].def * dm)) * kraft(u) * mul * (0.85 + G.rng() * 0.3), 'front', ev, { ranged: true });
    if (alive(d) && cls(d) === 'walker' && G.rng() < P.PZG_PANNE) { d.broken = Math.max(d.broken || 0, panneDauer(G)); ev.push({ t: 'breakdown', u: d.id }); }
  }
  else if (k === 'kopfrunter') {   // Punkt 3: kein Schaden – Ziel niedergehalten, Moral −P.KOPF_MOR
    const d = unitAt(G, c, r); if (TYPES[u.type].hidden) u.revealed = 1; ev.push({ t: 'kopfrunter', u: u.id, d: d.id });
    d.mor = Math.max(0, d.mor - P.KOPF_MOR * (TYPES[d.type].suit || cls(d) === 'walker' ? 0.5 : 1)); if (active(d) && !d.supp) { d.supp = 1; ev.push({ t: 'supp', u: d.id }); }
  }
  else if (k === 'handgranate') {   // Punkt 34: Wurf, Schaden P.HANDGR_DMG (Graben/Haus schützen nicht), gegen Panzer schwach, Ziel niedergehalten
    const d = unitAt(G, c, r); ev.push({ t: 'handgranate', a: u.id, d: d.id, wurf: true });
    const m = cls(d) === 'walker' ? 0.4 : TYPES[d.type].suit ? 0.75 : 1; applyDamage(G, u, d, P.HANDGR_DMG * m * (0.8 + G.rng() * 0.4), 'front', ev, { ranged: true });
    if (alive(d) && active(d) && !d.supp && cls(d) !== 'walker') { d.supp = 1; ev.push({ t: 'supp', u: d.id }); }
  }
  else if (k === 'pzgranate') {   // F80: Panzergranate – ein kräftiger Treffer am Fahrzeug/Schreiter, wie die Haftladung
    const d = unitAt(G, c, r); ev.push({ t: 'pzgranate', u: u.id, d: d.id, c, r });
    applyDamage(G, u, d, pzgDmg(u, d) * (0.8 + G.rng() * 0.4), 'front', ev, { ranged: true });
    if (alive(d) && G.rng() < P.PZG_PANNE) { d.broken = Math.max(d.broken || 0, panneDauer(G)); ev.push({ t: 'breakdown', u: d.id }); }
  }
  else if (k === 'rollen' && rw) {   // F54 Sturmrollen: Anlauf, ein Aufprall, Ziel rutscht zurück
    const d = unitAt(G, c, r);
    if (rw.mitte && !anlauf(G, u, rw.mitte, ev)) { u.ap = 0; u.bp = 0; u.attacked = true; u.moved = true; ev.push(...checkEnd(G)); return ev; }   // K4
    const gr = rollenGraben(G, d), ziel = step(d.c, d.r, rw.richtung), frei = !gr && inMap(ziel[0], ziel[1]) && !unitAt(G, ziel[0], ziel[1]) && cost(G, d, ziel[0], ziel[1]) < 99 && hex(G, ziel[0], ziel[1]).t !== 'wire';
    ev.push({ t: 'rollen', u: u.id, d: d.id, path: null, wand: !frei && !gr, graben: gr });   // K4: der Anlauf läuft schon als normaler Zug (moveUnit)
    const dc = d.c, dr = d.r; applyDamage(G, u, d, rollenDmg(G, u, d, !frei && !gr) * (0.8 + G.rng() * 0.4), 'front', ev, { morPlus: P.ROLLEN_MOR });
    if (alive(d) && d.status === 'ok') { if (!d.supp) { d.supp = 1; ev.push({ t: 'supp', u: d.id }); }
      if (frei && d.c === dc && d.r === dr) { d.c = ziel[0]; d.r = ziel[1]; d.dug = false; ev.push({ t: 'rollstoss', u: d.id, path: [[dc, dr], ziel] }); rueckstossFolgen(G, d, ev); } }
    ev.push(...checkEnd(G)); u.ap = 0; u.bp = 0; u.attacked = true; u.moved = true;
  }
  else if (k === 'durchbruch' && rw) {   // Held Rote Faust: Anlauf bis 2 Felder, Schlag, Ziel ein Feld zurück (wie Sturmrollen, ohne Draht niederzuwalzen)
    const d = unitAt(G, c, r);
    if (rw.mitte && !anlauf(G, u, rw.mitte, ev)) { u.ap = 0; u.bp = 0; u.attacked = true; u.moved = true; ev.push(...checkEnd(G)); return ev; }   // K4
    const ziel = step(d.c, d.r, rw.richtung), frei = inMap(ziel[0], ziel[1]) && !unitAt(G, ziel[0], ziel[1]) && cost(G, d, ziel[0], ziel[1]) < 99 && hex(G, ziel[0], ziel[1]).t !== 'wire';
    ev.push({ t: 'durchbruch', u: u.id, d: d.id, path: null, wand: !frei });   // K4: Anlauf schon als normaler Zug
    const dc = d.c, dr = d.r, dmg = P.DURCH_DMG * kraft(u) * (TYPES[d.type].suit ? 0.5 : 1) * (frei ? 1 : P.ROLLEN_WAND) / Math.max(1, TYPES[d.type].def / 4);
    applyDamage(G, u, d, dmg * (0.8 + G.rng() * 0.4), 'front', ev, { morPlus: P.DURCH_MOR });
    if (alive(d) && d.status === 'ok') { if (!d.supp) { d.supp = 1; ev.push({ t: 'supp', u: d.id }); }
      if (frei && d.c === dc && d.r === dr) { d.c = ziel[0]; d.r = ziel[1]; d.dug = false; ev.push({ t: 'rollstoss', u: d.id, path: [[dc, dr], ziel] }); rueckstossFolgen(G, d, ev); } }
    ev.push(...checkEnd(G)); u.ap = 0; u.bp = 0; u.attacked = true; u.moved = true;
  }
  else if (k === 'hinrichtung') {   // Held Kürassier: angeschlagene Einheit sofort vernichtet
    const d = unitAt(G, c, r); ev.push({ t: 'hinrichtung', u: u.id, d: d.id });
    applyDamage(G, u, d, d.str, 'front', ev); ev.push(...checkEnd(G));
  }
  else if (k === 'sprung') {   // Sprungangriff: landen, dann sofort Nahkampf (Aktion für den Schlag wieder freigeben wie beim Sturmlauf)
    const d = unitAt(G, c, r); u.ap = 1; const land = sprungLand(G, u, d);
    if (land) { const von = [u.c, u.r]; u.c = land[0]; u.r = land[1]; u.dug = false; u.mvd = (u.mvd || 0) + 1;
      ev.push({ t: 'sprung', u: u.id, path: [von, land], d: d.id }); claimObjective(G, u);
      u.attacked = false; u.sturmlauf = true;
      if (alive(u) && u.status === 'ok' && alive(d)) ev.push(...melee(G, u, d)); }
    u.ap = 0; u.bp = 0; u.attacked = true; u.moved = true;
  }
  else if (k === 'mark') {   // Ziel markieren: eine Markierung je Beobachter; deckt versteckte Gegner und Minen im Feld und daneben auf
    G.marks = G.marks.filter(m => m.by !== u.id); G.marks.push({ c, r, side: u.side, by: u.id });
    const rev = []; let nm = 0;
    for (const [a, b] of area) { const x = unitAt(G, a, b); if (x && x.side !== u.side && TYPES[x.type].hidden) { x.revealed = Math.max(x.revealed || 0, 1); rev.push(x.id); }
      for (const q of G.mines) if (q.c === a && q.r === b && q.side !== u.side && q.known !== u.side) { q.known = u.side; nm++; } }
    ev.push({ t: 'mark', u: u.id, c, r, rev, mines: nm });
  }
  else if (k === 'strike') {   // Feuerschlag: Batterie hinter der Front, wirkt wie eine Haubitze, 25 % Streuung (auf markierten Feldern keine)
    const gd = guided(G, u.side, c, r); let tc = c, tr = r, sc = false;
    if (!gd && G.rng() < P.STRIKE_SCATTER) { const nb = neighbors(c, r).filter(([a, b]) => inMap(a, b)); const q = nb[Math.floor(G.rng() * nb.length)]; tc = q[0]; tr = q[1]; sc = true; }
    ev.push({ t: 'shell', a: u.id, c: tc, r: tr, mode: 'he', scatter: sc, guided: gd, face: u.face, strike: true });
    const bat = { type: 'haubitze', side: u.side, c: u.c, r: u.r, str: 10, id: u.id };
    const d = unitAt(G, tc, tr);
    if (d && alive(d)) applyDamage(G, u, d, shellDmg(G, bat, d, false) * (gd ? P.GUIDED : 1) * (0.75 + G.rng() * 0.5), 'front', ev, { ranged: true });
    kircheTreffer(G, bat, tc, tr, ev);
    const h = hex(G, tc, tr);
    if (h.t === 'wire' && G.rng() < P.HE_WIRE) { h.t = 'open'; ev.push({ t: 'terrain', c: tc, r: tr, what: 'Draht zerschossen' }); }
    else if (h.t === 'open' && G.rng() < P.HE_CRATER) { h.t = 'crater'; ev.push({ t: 'terrain', c: tc, r: tr }); }
    else if (h.t === 'eis' && MAP.winter && !TOG.NOEISBRUCH) eisBruch(G, tc, tr, ev);   // Feuerschlag wirkt wie eine Haubitze
    ev.push(...checkEnd(G));
  }
  else if (k === 'ammo') { u.task = 'ammo'; const x = unitAt(G, c, r); x.attacked = false; x.ammoed = true; x.ap = Math.max(x.ap || 0, 1); x.moved = false; ev.push({ t: 'ammo', u: x.id, by: u.id }); }
  return ev;
}
// Stollen: zählt in den Runden der grabenden Seite herunter, dann fliegt das Feld in die Luft
function tunnelsTick(G, s) {
  const ev = [];
  for (const q of G.tunnels) if (q.side === s) q.t--;
  for (const q of G.tunnels.filter(q => q.side === s && q.t <= 0)) {
    ev.push({ t: 'tunnelBlow', c: q.c, r: q.r });
    const d = unitAt(G, q.c, q.r);
    if (d && alive(d)) applyDamage(G, null, d, P.TUNNEL_DMG * (0.8 + G.rng() * 0.4), 'front', ev, { morMul: 1.5 });
    hex(G, q.c, q.r).t = 'crater';
    ev.push({ t: 'terrain', c: q.c, r: q.r, what: 'Stollen gesprengt' });
  }
  G.tunnels = G.tunnels.filter(q => q.t > 0);
  if (ev.length) ev.push(...checkEnd(G));
  return ev;
}
// Gegenstoß: Eingreiftrupp stürmt auf einen Gegner, der ein Zielfeld bis 3 Felder entfernt betreten hat
function counterStrike(G, mover, ev) {
  if (!hex(G, mover.c, mover.r).obj) return;
  const ct = G.units.filter(x => x.side !== mover.side && active(x) && TYPES[x.type].counterStrike && x.cready && !x.supp && !x.broken && dist(x.c, x.r, mover.c, mover.r) <= 3)
    .sort((a, b) => dist(a.c, a.r, mover.c, mover.r) - dist(b.c, b.r, mover.c, mover.r))[0];
  if (!ct) return;
  let spot = dist(ct.c, ct.r, mover.c, mover.r) === 1 ? [ct.c, ct.r] : null;
  if (!spot) spot = neighbors(mover.c, mover.r).filter(([a, b]) => inMap(a, b) && !unitAt(G, a, b) && cost(G, ct, a, b) < 99 && hex(G, a, b).t !== 'wire')
    .sort((p, q) => dist(p[0], p[1], ct.c, ct.r) - dist(q[0], q[1], ct.c, ct.r))[0];
  if (!spot) return;
  ct.cready = false;
  ev.push({ t: 'counterstrike', u: ct.id, d: mover.id });
  if (spot[0] !== ct.c || spot[1] !== ct.r) { const from = [ct.c, ct.r]; ct.c = spot[0]; ct.r = spot[1]; ev.push({ t: 'advance', u: ct.id, path: [from, spot] }); }
  ct.face = faceToward(ct.face, ct.c, ct.r, mover.c, mover.r);
  const keep = [ct.ap, ct.attacked, ct.moved]; ct.ap = 1; ct.attacked = false;
  ev.push(...melee(G, ct, mover));
  ct.ap = keep[0]; ct.attacked = true; ct.moved = keep[2];
}

// ---------- Befehle der Anführer ----------
// Einmal alle zwei eigenen Runden. 'rally' = Sammeln (Moral +1,5, Niederhalten endet), 'storm' = Sturmbefehl (Nahkampf ×1,25 in dieser Runde).
function cmdRange(u) { return P.ORDER_R; }   // Paket 8: normale Befehle nur 1 Feld weit (auch der General)
// Abklingzeit je Befehl: Sammeln 3 Runden, Sturmbefehl/Feuer frei 2; General und Funker in der Nähe je 1 weniger (mindestens 1). Höchstens ein Befehl je Runde.
// Befehle je Seite (Gruppe 2, 2026-11-16): beide „Sammeln“; Konkordat „Feuer frei“ (Fernkampf ×1,25 bis zum nächsten eigenen Zug), Aschenwacht „Sturmbefehl“ (Nahkampf ×1,25 in dieser Runde).
const ORDER_KINDS = { A: ['rally', 'fire'], D: ['rally', 'storm'] };
function orderKinds(u) { return ORDER_KINDS[u.side] || ['rally', 'storm']; }
function canOrderKind(G, u, kind) { return !G.over && u && active(u) && !!u.officer && u.side === G.side && orderKinds(u).includes(kind) && u.ap >= 1 && !(u.supp > 0) && !u.ordered && (u.befehle || 0) < P.ORDER_MAX && !((kind === 'rally' ? u.cdR : u.cdS) > 0); }
function canOrder(G, u) { return orderKinds(u || {}).some(k => canOrderKind(G, u, k)); }
function orderCd(G, u, kind) {
  const relay = G.units.some(o => o.side === u.side && active(o) && TYPES[o.type].relay && dist(o.c, o.r, u.c, u.r) <= 3);
  return Math.max(1, (kind === 'rally' ? P.RALLY_CD : P.STORM_CD) - (TYPES[u.type].cmd === 2 ? 1 : 0) - (relay ? 1 : 0));
}
function order(G, u, kind) {
  if (!canOrderKind(G, u, kind)) return [];
  if (kind === 'rally') u.cdR = orderCd(G, u, kind); else u.cdS = orderCd(G, u, kind);
  u.ordered = true; u.befehle = (u.befehle || 0) + 1; spend(u, 1); const ids = [];
  for (const o of G.units) {
    if (o.side !== u.side || !active(o) || cls(o) === 'walker' || dist(o.c, o.r, u.c, u.r) > cmdRange(u)) continue;
    if (kind === 'rally') { o.mor = Math.min(TYPES[o.type].mor, o.mor + P.ORDER_MOR); o.supp = 0; } else if (kind === 'fire') o.fireFree = true; else o.zeal = true;
    ids.push(o.id);
  }
  return [{ t: 'order', u: u.id, kind, name: u.officer, ids, mors: ids.map(id => G.units.find(x => x.id === id).mor) }];
}

// Großer Befehl des Generals (einmal je Schlacht und Seite, 1 Punkt): Konkordat „Halten um jeden Preis“ (bis zum nächsten eigenen Zug keine Flucht, Abwehr ×1,25),
// Aschenwacht „Generalangriff“ (alle eigenen Einheiten sofort +1 Aktionspunkt)
const BIG = { A: { k: 'hold', name: 'Halten um jeden Preis' }, D: { k: 'assault', name: 'Generalangriff' } };
function canBig(G, u) { return !G.over && u && active(u) && TYPES[u.type].cmd === 2 && u.side === G.side && u.ap >= 1 && !(u.supp > 0) && !(G.bigUsed && G.bigUsed[u.side]); }
function bigOrder(G, u) {
  if (!canBig(G, u)) return [];
  G.bigUsed = G.bigUsed || {}; G.bigUsed[u.side] = true; spend(u, 1);
  const B = BIG[u.side], ids = [];
  const inR = o => o.side === u.side && active(o) && dist(o.c, o.r, u.c, u.r) <= P.BIG_R;   // F53: seit 2026-11-20 nur noch 2 Felder (BIG_R), sonst war der neue Generalangriff zu stark
  if (B.k === 'hold') { for (const o of G.units) if (inR(o)) { o.holdB = true; ids.push(o.id); } }
  else for (const o of G.units) if (inR(o) && o.status === 'ok' && !(o.broken > 0) && !(o.stuck > 0)) {   // F53 (2026-11-20): Generalangriff = echter zweiter Angriff – +1 Aktion, +2 BP,
    o.ap = (o.ap || 0) + 1; o.bp = (o.bp || 0) + P.GENERAL_BP; o.moved = false; o.attacked = false; o.sturmlauf = true; o.fellBack = false;   // auch wer schon angegriffen hat; Nahkampf auch nach weitem Zug (wie Sturmlauf)
    if (o.supp > 0) { o.supp = 0; } ids.push(o.id); }   // Niederhalten aufgehoben; ausgeschlossen: auf der Flucht, Panne, festgefahren
  return [{ t: 'bigorder', u: u.id, side: u.side, kind: B.k, name: B.name, ids }];
}
// Eingraben (Schützenkohorte, Aschengrenadiere, 1 Punkt): nur im offenen Gelände oder Trichter; Abwehr ×1,3, bis die Einheit zieht
function canDig(G, u) { return active(u) && !!TYPES[u.type].dig && u.side === G.side && u.ap >= 1 && !u.dug && !(u.supp > 0) && ['open', 'crater'].includes(hex(G, u.c, u.r).t); }
function dig(G, u) { if (!canDig(G, u)) return []; u.dug = true; spend(u, 1); return [{ t: 'dig', u: u.id }]; }
// F36 (2026-11-21): Ausgraben vor dem Ziehen – kostet P.AUSGRABEN_BP Bewegungspunkte (bzw. die Aktion, wenn P.AUSGRABEN_AP); die Deckung ×1,3 endet
function canUndig(G, u) { return active(u) && u.side === G.side && !!u.dug && !(u.broken > 0) && !TOG.NOAUSGRABEN && (P.AUSGRABEN_AP ? u.ap >= 1 : (u.bp || 0) >= P.AUSGRABEN_BP); }
function undig(G, u) { if (!canUndig(G, u)) return []; u.dug = false; if (P.AUSGRABEN_AP) spend(u, 1); else { u.bp -= P.AUSGRABEN_BP; u.bpUsed = (u.bpUsed || 0) + P.AUSGRABEN_BP; u.moved = u.ap <= 0 && !(u.bp > 0); } return [{ t: 'undig', u: u.id }]; }
// Schilde vor (Schildwall, Schwere Grabenwacht, 1 Punkt): eigene Nachbarn nehmen bis zum nächsten eigenen Zug Beschuss ×0,75
function canShields(G, u) { return active(u) && !!TYPES[u.type].shieldWall && u.side === G.side && u.ap >= 1 && !u.shields && !(u.supp > 0); }
function shieldsUp(G, u) { if (!canShields(G, u)) return []; u.shields = true; spend(u, 1); const ids = neighbors(u.c, u.r).map(([c, r]) => unitAt(G, c, r)).filter(o => o && o.side === u.side && active(o)).map(o => o.id); return [{ t: 'shields', u: u.id, ids }]; }
// Banner aufpflanzen / aufnehmen (je 1 Punkt): aufgepflanzt wirkt es 3 statt 2 Felder weit, Einheiten in diesem Bereich fliehen nicht; der Träger zieht nicht.
function canPlant(G, u) { return active(u) && !!TYPES[u.type].banner && u.side === G.side && u.ap >= 1 && !(u.supp > 0); }
function plantBanner(G, u) { if (!canPlant(G, u)) return []; u.planted = !u.planted; spend(u, 1); if (u.planted) u.moved = true; return [{ t: 'banner', u: u.id, planted: u.planted }]; }

// ---------- Sanitäter ----------
function canHeal(G, m, t) {
  return active(m) && cls(m) === 'medic' && m.ap >= 1 && !m.attacked && !(m.supp > 0) && !(m.cdH > 0) && m.task !== 'ammo' && t && t !== m && t.side === m.side && active(t) && (cls(t) === 'walker') === !!TYPES[m.type].repair &&
    dist(m.c, m.r, t.c, t.r) === 1 && (t.str < 10 || t.mor < TYPES[t.type].mor || t.poison > 0);
}
function heal(G, m, t) {
  if (!canHeal(G, m, t)) return [];
  m.attacked = true; spend(m, 1); m.cdH = P.HEAL_CD; if (TYPES[m.type].repair) m.task = 'fix'; m.face = faceToward(m.face, m.c, m.r, t.c, t.r);
  t.str = Math.min(10, t.str + P.HEAL); t.mor = Math.min(TYPES[t.type].mor, t.mor + P.HEAL_MOR);
  const cured = t.poison > 0; t.poison = 0;   // Sanitäter heilen auch die Vergiftung
  return [{ t: 'heal', u: t.id, by: m.id, str: t.str, morv: t.mor, cured }];
}
// ---------- Nachschub ----------
function spawnHexes(G, side, type) {
  const out = [], probe = { type, side }, seen = new Set(), add = (c, r) => { const k = key(c, r); if (seen.has(k) || !inMap(c, r) || unitAt(G, c, r) || cost(G, probe, c, r) >= 99) return; seen.add(k); out.push([c, r]); };
  for (let c = 0; c < COLS; c++) { if (side === 'A' ? c > 1 : c < COLS - 2) continue; for (let r = 0; r < ROWS; r++) add(c, r); }
  // Paket 3: jedes eigene Zielfeld ist ein Aufstellungsort – das Feld und seine Nachbarn, wenn frei und nicht in Feindberührung
  for (const o of OBJECTIVES) if (G.ctrl[o.id] === side) for (const [c, r] of [[o.c, o.r], ...neighbors(o.c, o.r)]) if (inMap(c, r) && (side === 'A' ? c <= o.c : c >= o.c) && !isZOC(G, c, r, side)) add(c, r);   // Paket 8: nie hinter der Flagge Richtung Gegner
  return out;
}
function canBuy(G, side, type) { return !G.over && !(TYPES[type].stufe3 && G.units.some(u => u.side === side && TYPES[u.type].stufe3)) && !(TYPES[type].held && G.units.some(u => u.side === side && TYPES[u.type].held)) && !(TYPES[type].cmd === 2 && G.units.some(u => u.side === side && alive(u) && TYPES[u.type].cmd === 2)) && (G.mechs || !isMech(type)) && G.side === side && SHOP[side].includes(type) && G.pts[side] >= COST[type]; }
function buy(G, side, type, c, r) {
  if (!canBuy(G, side, type) || !spawnHexes(G, side, type).some(h => h[0] === c && h[1] === r)) return [];
  G.pts[side] -= COST[type];
  const u = addUnit(G, type, c, r);
  u.ap = 0; u.bp = 0; u.moved = true; u.attacked = true; u.sperr = 0;
  return [{ t: 'spawn', u: u.id }];
}
// Löwengebrüll (Kreuzschreiter): einmal je Schlacht, ohne Aktion; Gegner ohne Panzerung im Umkreis verlieren Moral und werden niedergehalten (u.angst bis zu ihrer nächsten Runde)
function roarTargets(G, u) { return G.units.filter(o => o.side !== u.side && o.status === 'ok' && cls(o) !== 'walker' && dist(u.c, u.r, o.c, o.r) <= P.ROAR_R); }
function canRoar(G, u) { return !!TYPES[u.type].roar && active(u) && u.side === G.side && !u.roared && !(u.broken > 0) && roarTargets(G, u).length > 0; }
function roar(G, u) {
  if (!canRoar(G, u)) return [];
  const ts = roarTargets(G, u), ev = [{ t: 'roar', u: u.id, d: ts.map(o => o.id) }]; u.roared = true;
  for (const o of ts) {
    let ml = P.ROAR_MOR; if (officerAt(G, o.side, o.c, o.r)) ml *= P.OFFICER_MOR; if (bannerAt(G, o.side, o.c, o.r)) ml *= 0.75;
    o.mor = Math.max(0, o.mor - ml); o.angst = 1;
    if (o.mor <= 0 && !noFlee(G, o)) { routUnit(G, o, u, ev); continue; }
    if (!(o.supp > 0)) { o.supp = 1; ev.push({ t: 'supp', u: o.id }); }
  }
  ev.push(...checkEnd(G)); return ev;
}
// Faustsalve (Eisenknecht): einmal je Schlacht, statt des Schusses (kostet die Aktion): beide Unterarm-Kanonen zugleich auf zwei verschiedene Ziele, die er beschießen könnte
function faustTargets(G, u) { return TYPES[u.type].faust ? G.units.filter(d => canFire(G, u, d)) : []; }
function canFaust(G, u, d1, d2) {
  if (!TYPES[u.type].faust || u.faustUsed || u.side !== G.side) return false;
  const ts = faustTargets(G, u); if (ts.length < 2) return false;
  return d1 == null || (d1 !== d2 && ts.includes(d1) && (d2 == null || ts.includes(d2)));
}
function faust(G, u, d1, d2) {
  if (!d1 || !d2 || !canFaust(G, u, d1, d2)) return [];
  const ev = [{ t: 'faust', u: u.id, d: [d1.id, d2.id] }]; u.faustUsed = true;
  u.face = faceToward(u.face, u.c, u.r, (d1.c + d2.c) / 2, (d1.r + d2.r) / 2);
  const plan = [d1, d2].map(d => ({ d, p: preview(G, u, d, 'fire'), c: d.c, r: d.r }));   // beide Schüsse zugleich: Schaden vor dem ersten Treffer berechnen
  for (const [i, q] of plan.entries()) {
    if (!alive(q.d)) continue;
    ev.push({ t: 'fire', a: u.id, d: q.d.id, kind: 'cannon', faust: i + 1, face: u.face });
    applyDamage(G, u, q.d, q.p.dmg * (0.75 + G.rng() * 0.5) * P.FAUST_MUL, q.p.arc, ev, { ranged: true });
    kircheTreffer(G, u, q.c, q.r, ev);
  }
  u.attacked = true; spend(u, 1);
  ev.push(...checkEnd(G)); return ev;
}
function endTurn(G) {
  if (G.over) return [];
  for (const u of G.units) if (u.side === G.side) { if (u.supp > 0) u.supp--; u.zeal = false; u.angst = 0; }
  if (G.side === 'A') G.side = 'D';
  else {
    if (G.turn >= P.MAX_ROUNDS) { G.over = finalResult(G); return [{ t: 'over', result: G.over }]; }
    G.turn++; G.side = 'A';
  }
  return startTurn(G);
}
function losses(G, side) {
  let total = 0, lost = 0;
  for (const u of G.units) if (u.side === side) { total += 10; lost += u.status === 'ok' ? 10 - u.str : 10; }
  return lost / total;
}
function points(G) { let p = 0; for (const o of OBJECTIVES) if (G.ctrl[o.id] === 'A') p += o.pts; return p; }
function finalResult(G) {   // nur Notbremse nach P.MAX_ROUNDS Runden
  const w = G.vp.A > G.vp.D ? 'A' : G.vp.D > G.vp.A ? 'D' : null;
  return { winner: w, why: 'time', pts: w ? G.vp[w] : G.vp.A, vp: { ...G.vp } };
}
function checkEnd(G) {
  if (G.over) return [];
  const la = losses(G, 'A'), ld = losses(G, 'D');
  if (ld >= P.BREAK.D) G.over = { winner: 'A', why: 'break', pts: G.vp.A, vp: { ...G.vp } };
  else if (la >= P.BREAK.A) G.over = { winner: 'D', why: 'break', pts: G.vp.D, vp: { ...G.vp } };
  return G.over ? [{ t: 'over', result: G.over }] : [];
}

// F103 Rollen schärfen (Enrico 2026-11-22 13:35): Texte und Schlagworte zu den neuen Aufgaben (Regeln oben bei COST)
{ const T = TYPES, ers = (t, alt, neu) => { const i = T[t].sp.indexOf(alt); if (i >= 0) T[t].sp[i] = neu; else T[t].sp.push(neu); };
  T.kohorte.can = 'Schützenlinie: schießt 2 Felder weit, hält Zielfelder mit Feuerbereitschaft, schneidet Draht. Eingraben (Aktion, im offenen Gelände oder Trichter): Abwehr ×1,3; zum Ziehen erst ausgraben (Aktion).';
  if (T.feldkanone.abil === 'pzschuss') { T.feldkanone.can = `Leichte Artillerie, direkter flacher Schuss bis 5 Felder (Standardgranate, gegen Panzerung nur ×${String(P.FK_VS_WALKER).replace('.', ',')}). Panzergranate (Aktion, ${P.PZS_LADUNGEN} Ladungen je Schlacht): gegen Fahrzeuge und Schreiter ×${String(P.PZS_S).replace('.', ',')}, gegen Kampfanzüge ×${P.PZS_L}. Zieht 2 Felder und schießt. Im Nahkampf wehrlos.`;
    T.feldkanone.sp = T.feldkanone.sp.filter(x => !/×2,5 auf Kolosse/.test(x)); ers('feldkanone', '-', 'Direktschuss 5 Felder'); ers('feldkanone', '-', `Panzergranate (${P.PZS_LADUNGEN}×)`); }
  if (T.scharf.standSchuss) {   // Punkt 3 (2026-11-24): Scharfschützen
    T.scharf.can = `Schießt 4 Felder weit, nur aus dem Stand (nicht nach dem Ziehen); im Nahkampf fast wehrlos. Gezielter Schuss: gegen ungepanzerte Ziele ×${String(P.SCHARF_INF).replace('.', ',')}. Fähigkeit „Kopf runter!“ (Aktion, alle 2 Runden): kein Schaden, Ziel niedergehalten und Moral −${Math.round(P.KOPF_MOR * 10)}.`;
    T.pirsch.can = `Getarnt: nur aus dem Nachbarfeld angreifbar, bis er schießt (dann eine gegnerische Runde sichtbar). Schießt nur aus dem Stand, gegen ungepanzerte Ziele ×${String(P.SCHARF_INF).replace('.', ',')}. Fähigkeit „Kopf runter!“ (Aktion, alle 2 Runden): Ziel niedergehalten, Moral −${Math.round(P.KOPF_MOR * 10)}.`;
    ers('scharf', 'Hält das Ziel nieder', 'Kopf runter!'); ers('pirsch', 'Hält nieder', 'Kopf runter!'); ers('scharf', '-', 'Nur aus dem Stand'); ers('pirsch', '-', 'Nur aus dem Stand'); }
  if (T.grenadier.granatSturm) { T.grenadier.can = 'Stoßinfanterie: wirft vor jedem Nahkampf Handgranaten (Nahkampf ×1,25), schießt dafür schwächer (×0,85, 2 Felder). Schneidet Draht. Eingraben (Aktion, im offenen Gelände oder Trichter): Abwehr ×1,3; zum Ziehen erst ausgraben (Aktion).'; ers('grenadier', 'Schuss 2 Felder', 'Handgranaten vor dem Nahkampf'); }
  else { T.grenadier.can = `Stoßinfanterie: schießt 2 Felder weit. Handgranaten (Aktion, alle 2 Runden): Wurf auf einen Gegner bis ${P.HANDGR_RNG} Felder, Graben und Häuser schützen nicht, Ziel niedergehalten; gegen Panzer schwach. Schneidet Draht. Eingraben (Aktion, im offenen Gelände oder Trichter): Abwehr ×1,3; zum Ziehen erst ausgraben (Aktion).`; ers('grenadier', '-', 'Handgranaten'); }
  T.raeumer.can = 'Billiger Grabenkampf: Nahkämpfer ohne Gewehr und ohne Panzerabwehr. Schneidet Draht vom Nachbarfeld aus (Aktion). Sickert durch: Gegner halten ihn nicht auf. Handgranaten heben den Grabenschutz auf.';
  T.raeumer.sp = T.raeumer.sp.filter(x => x !== 'Panzergranate');
  T.sturm.can = 'Sturm und Panzerabwehr: Panzergranate (Aktion, alle 2 Runden) 1–2 Felder gegen Fahrzeuge und Schreiter – sein Kern. Sickert durch: Gegner halten ihn nicht auf. Schneidet Draht vom Nachbarfeld aus (Aktion). Handgranaten heben den Grabenschutz auf.';
  T.eingreif.can = 'Gegenstoß: Betritt ein Gegner ein Zielfeld bis 3 Felder entfernt, stürmt der Trupp sofort heran und greift an (einmal je gegnerischer Runde). Nahkampf auf eigenen Zielfeldern und in eigenen Gräben ×1,25, beim Vorgehen ins Feindgebiet ×0,85. Panzergranate (Aktion, alle 2 Runden): 1–2 Felder gegen Fahrzeuge und Schreiter.';
  ers('eingreif', 'Gegenstoß auf Zielfelder', 'Gegenstoß: ×1,25 auf eigenen Zielfeldern');
  T.feldkanone.can = 'Direktes Feuer: flache Bahn bis 5 Felder, nur auf Ziele in Sicht, kein Gas, kein Sperrfeuer. Trifft Kolosse und Kampfmaschinen ×2,5. Ohne Protzen: zieht immer 2 Felder und darf danach noch schießen. Im Nahkampf wehrlos.';
  if (T.feldkanone.abil !== 'pzschuss') ers('feldkanone', 'Direktschuss ×2,5 auf Kolosse', 'Direktschuss 5 Felder, ×2,5 auf Kolosse'); ers('feldkanone', 'Aufprotzen', 'Zieht 2 Felder und schießt');
  T.haubitze.can = 'Steil- und Sperrfeuer: ' + T.haubitze.can;
  T.panzerk.can = T.panzerk.can.replace('Motorisierte Kampfanzüge.', 'Motorisierte Kampfanzüge für Nahkampf und Draht. Schneidet Draht vom Nachbarfeld aus (Aktion).');
  if (!T.panzerk.sp.includes('Draht schneiden (Nachbarfeld, Aktion)')) T.panzerk.sp.unshift('Draht schneiden (Nachbarfeld, Aktion)');
  T.saeger.can += ' Die Panzersäge trifft Gepanzerte im Nahkampf ×1,5 (Fußtruppen ×1).'; ers('saeger', 'Maschinenwaffe und Säge', 'Panzersäge gegen Gepanzerte ×1,5');
  T.klaue.can += ' Die Stahlklaue packt und schleudert Fußtruppen im Nahkampf ×2, gegen Gepanzerte nur ×0,75.'; ers('klaue', 'Maschinenwaffe', 'Stahlklaue gegen Fußtruppen ×2');
  T.huenen.can = 'Schweres Feuer: ' + T.huenen.can;
  T.fernsprech.can = 'Feuerleitung: ' + T.fernsprech.can; T.ballon.can = 'Aufklärung: ' + T.ballon.can; }
const E = {
  P, SIDES, TYPES, TERRAIN, MAPS, costParts, deploy, eisSchwer, eisBruch, barrageCells, coverOf, defMods, useMap: useMapArmy, COST, SHOP, spawnHexes, canBuy, buy, limber, canLimber, heal, canHeal, order, canOrder, cmdRange, canSend, sendOrder, pass, canCut, guided, layWire, canLay, layTarget, bannerAt, defaultArmy, armyCost, armyCount, armyOk, ARMY_BUDGET, ARMY_MAX, ARMY_MIN, ROSTER, isMech, buildMap,
  newGame, startTurn, endTurn, bpMax, fahrzeugArt, nahFrei, reachable, moveUnit, turnUnit, drehKosten, fanOf, angDiff, faceToward, startZone, inStartZone, canPlaceStart, aufstellen, autoAufstellen, cutWire, canCut, cutTargets, canZweit, zweitTargets, zweitFire, fire, melee, shell,
  canMarch, canSetup, setupMG, canTeardown, teardownMG, inFan, MG_FAN, canOverwatch, overwatch, canRecover, recover, canOrderKind, orderCd,
  sizeOf, heldAt, held,
  canUndig, undig, pzgDmg, canEinholen, einholen, canAufsteigen, aufsteigen, luft, rammZiele, rammen, RUINE, kraft, kraftText, modelle, modelleDa, u5aus, TRUPP, truppAlt, kanteAt, kantenVon, kanteDeck, kanteFaktor, KANTE_ART, KANTEN_KARTE, kanteAus, rollenWeg, rollenDmg, rollenGraben, FAK, WAFFE_NAME, KLASSE_NAME, panzerKl, waffeArt, nahRolle, faktor, medaillen, roar, canRoar, roarTargets, faust, canFaust, faustTargets, sprungLand, dauerOk, feindNah, minSteil, schussNachZug, leererDraht, ABILS, abilTargets, canAbil, useAbil, canSperr, sperr, fireAt, canDig, dig, canShields, shieldsUp, rushPath, orderKinds, canBig, bigOrder, BIG, canPlant, plantBanner, noFlee, smokeAt, litAt, concealed, gasSafe, wireProof, openGround, hasFlanks, freeBlows,
  canFire, canMelee, canShell, preview, shellDmg, gasCells, isDirect, spotted, immune, sichtOf, bauAt, schwereWaffe, KIRCHE,
  unitAt, hex, neighbors, step, dist, angleTo, faceIndex, arcOf, inMap, cloudAt, cost,
  isZOC, adjEnemies, losses, points, alive, active, cls, hasLOS, rangeOf, officerAt, key, mulberry32, nearestEnemy
};
for (const [k, f] of Object.entries({ COLS: () => COLS, ROWS: () => ROWS, OBJECTIVES: () => OBJECTIVES, MAP: () => MAP, ARMY_CAP: () => ARMY_CAP, ARMY_WALKERS: () => ARMY_WALKERS }))
  Object.defineProperty(E, k, { get: f, enumerable: true });
if (typeof module !== 'undefined' && module.exports) module.exports = E; else root.E = E;
})(this);
