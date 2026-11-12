// ===== ARMARGEDDON ENGINE =====
// Reine Spiellogik ohne Browser. Läuft im Browser (window.E) und in Node (require).
(function (root) {
'use strict';

// ---------- Grundwerte (per Simulation abgestimmt) ----------
const P = {
  DMG: 0.61,
  FLANK: 1.4, REAR: 1.8, VS_ROUT: 1.6,
  COUNTER: { front: 0.6, flank: 0.3, rear: 0 },
  MOR_PER_DMG: 0.8, MOR_FLANK: 0.5, MOR_REAR: 1, MOR_SURR: 1,
  FALLBACK_MOR: 3, ROUT_STR: 1.5,
  BREAK: { A: 0.55, D: 0.5 },
  TRENCH_DEF: 1.6, CRATER_FIRE: 1.2, VILLAGE_DEF: 1.5, FOREST_DEF: 1.4, WIRE_DEF: 0.6,
  MG_VS_WIRE: 2, MG_VS_CAV: 2,
  ORDER_CD: 2, ORDER_MOR: 1.5, ORDER_ATK: 1.25,
  OFFICER_ATK: 1.15, OFFICER_MOR: 0.8, OFFICER_RANGE: 2, RALLY: 0.6,
  RECOVER: 0.5, RECOVER_COVER: 1,
  MAXT: 16, WIN_A: 5, DRAW_A: 4,
  SUPP: 0.6, SUPP_ATK: 0.5,
  ART_MIN: 2, SPOT: 5, SCATTER: 0.25, HE_WIRE: 0.5, HE_CRATER: 0.3, ART_DIRECT: 3, ART_VS_WALKER: 2.5,
  GAS_TTL: 3, GAS_STR: 0.5, GAS_MOR: 1.5, GAS_ATK: 0.7, WIND_SHIFT: 0.15,
  BREAKDOWN: 0.14, STUCK: 0.25, WALKER_FEAR: 1, MELEE_VS_WALKER: 0.4, STORM_VS_WALKER: 1.5,
  CHARGE: 1.5, CHARGE_MIN: 3, CAV_VS_ROUT: 2, FLAME_HIT: 1.5, FLAME_MOR: 2,
  REINF_TURN: 8, LIMBER_MV: 4,
  PTS_TURN: { A: 1, D: 1 }, PTS_KILL: 2, HEAL: 1.5, HEAL_MOR: 1
};

const COLS = 20, ROWS = 11;   // kleineres Feld, dafür größere Figuren

const SIDES = {
  A: { name: 'Konkordat von Valmor', short: 'Konkordat', edge: 0, dir: 1 },
  D: { name: 'Aschenwacht des Grauwalls', short: 'Aschenwacht', edge: COLS - 1, dir: -1 }
};

const TYPES = {
  kohorte: { side: 'A', name: 'Schützenkohorte', cls: 'inf', atk: 4, def: 4, mor: 7, mv: 3, rng: 2, fs: 2,
    can: 'Schießt 2 Felder weit, stürmt Gräben im Nahkampf, schneidet Draht.',
    real: 'Im Ersten Weltkrieg trugen Infanteristen oft rund 30 kg Ausrüstung in den Angriff, quer durch Schlamm und Trichter.' },
  mahlwerk: { side: 'A', name: 'Mahlwerk-Trupp', cls: 'mg', atk: 2, def: 3, mor: 7, mv: 2, rng: 3, fs: 5, mg: true,
    can: 'Maschinengewehr, 3 Felder weit. Feuert von selbst auf Gegner, die sich im Offenen bewegen. Wer zieht, schießt nicht.',
    real: 'Maschinengewehre wie das britische Vickers oder das deutsche MG 08 schossen rund 450 bis 500 Schuss pro Minute.' },
  haubitze: { side: 'A', name: 'Donnerrohr-Batterie', cls: 'art', limber: true, atk: 0, def: 3, mor: 6, mv: 1, rng: 8, fs: 5, gas: 2,
    can: 'Schießt über eigene Truppen hinweg, wenn eine eigene Einheit das Ziel sieht. Sprenggranaten, Sperrfeuer oder Gas. Aufgeprotzt zieht sie 4 Felder, kann dann aber nicht feuern. Im Nahkampf wehrlos.',
    real: 'Artillerie verursachte im Ersten Weltkrieg die meisten Verluste, nach gängigen Schätzungen deutlich mehr als die Hälfte.' },
  koloss: { side: 'A', name: 'Landkoloss', cls: 'walker', atk: 6, def: 7, mor: 8, mv: 2, rng: 2, fs: 4,
    can: 'Gepanzert: Gewehre und MG prallen ab. Walzt Stacheldraht nieder, überquert Gräben. Bleibt manchmal mit einer Panne liegen.',
    real: 'Die ersten Panzer fuhren im September 1916 an der Somme. Sie waren kaum schneller als ein Fußgänger und fielen oft durch Pannen aus.' },
  reiter: { side: 'A', name: 'Lanzenreiter', cls: 'cav', atk: 5, def: 2, mor: 7, mv: 5, rng: 0, fs: 0,
    can: 'Sehr schnell. Ansturm nach 3 Feldern ×1,5, gegen Fliehende ×2. Kommt nicht durch Draht und Totholz. MG-Feuer trifft doppelt.',
    real: 'Die Kavallerie wartete an der Westfront jahrelang auf den Durchbruch. Gegen Maschinengewehre und Stacheldraht war sie fast machtlos.' },
  grenadier: { side: 'D', name: 'Aschengrenadiere', cls: 'inf', atk: 4, def: 4, mor: 7, mv: 3, rng: 2, fs: 2,
    can: 'Schießt 2 Felder weit, hält Gräben und Ruinen, schneidet Draht.',
    real: 'Gräben verliefen im Zickzack. So konnte ein eingedrungener Gegner nicht den ganzen Graben entlang schießen.' },
  sense: { side: 'D', name: 'Sensenwerk-Trupp', cls: 'mg', atk: 2, def: 3, mor: 7, mv: 2, rng: 3, fs: 5, mg: true,
    can: 'Maschinengewehr, 3 Felder weit. Feuert von selbst auf Gegner, die sich im Offenen bewegen. Wer zieht, schießt nicht.',
    real: 'Am ersten Tag der Somme-Schlacht, dem 1. Juli 1916, hatte die britische Armee rund 57.000 Tote und Verwundete, sehr viele durch MG-Feuer.' },
  geschuetz: { side: 'D', name: 'Grabengeschütz', cls: 'art', limber: true, atk: 0, def: 3, mor: 6, mv: 1, rng: 8, fs: 5, gas: 1,
    can: 'Schießt über eigene Truppen hinweg, wenn eine eigene Einheit das Ziel sieht. Direkter Schuss bis 3 Felder trifft Landkolosse ×2,5. Aufgeprotzt zieht es 4 Felder, kann dann aber nicht feuern. Im Nahkampf wehrlos.',
    real: 'Bei Flesquières schossen deutsche Feldgeschütze am 20. November 1917 im direkten Richten zahlreiche britische Panzer ab.' },
  sturm: { side: 'D', name: 'Sturmbrecher', cls: 'storm', atk: 6, def: 5, mor: 9, mv: 3, rng: 0, fs: 0,
    can: 'Sickert durch: Gegner halten ihn nicht auf. Handgranaten heben den Grabenschutz auf. Gegen Landkolosse im Nahkampf ×1,5.',
    real: 'Deutsche Stoßtrupps griffen ab 1916 in kleinen Gruppen mit Handgranaten an und umgingen starke Stellungen.' },
  brand: { side: 'D', name: 'Brandwerfer', cls: 'flame', atk: 2, def: 3, mor: 7, mv: 2, rng: 1, fs: 7, flame: true,
    can: 'Flammenstrahl auf ein Nachbarfeld. Deckung schützt nicht, doppelter Moralverlust. Wird er beschossen, trifft es ihn ×1,5.',
    real: 'Flammenwerfer setzte die deutsche Armee ab 1915 ein, etwa bei Hooge in Flandern. Sie reichten meist nur rund 20 Meter weit.' }
};

Object.assign(TYPES, {
  feldscher: { side: 'A', name: 'Feldscher', cls: 'medic', atk: 1, def: 2, mor: 6, mv: 3, rng: 0, fs: 0,
    can: 'Versorgt statt eines Angriffs eine eigene Nachbareinheit: Stärke +1,5 und Moral +1. Kaum Kampfkraft.',
    real: 'Sanitäter und Krankenträger holten Verwundete oft unter Beschuss aus dem Niemandsland. Viele von ihnen fielen dabei selbst.' },
  moerser: { side: 'A', name: 'Grabenmörser', cls: 'art', fig: 'mortar', mobile: true, atk: 0, def: 3, mor: 6, mv: 2, rng: 4, fs: 4, gas: 0,
    can: 'Leichte Steilfeuerwaffe, 4 Felder weit. Sprenggranaten oder Sperrfeuer. Kann in derselben Runde ziehen und feuern.',
    real: 'Der britische Stokes-Mörser von 1915 war so leicht, dass ihn wenige Männer in den vordersten Graben tragen konnten.' },
  heiler: { side: 'D', name: 'Aschenpfleger', cls: 'medic', atk: 1, def: 2, mor: 6, mv: 3, rng: 0, fs: 0,
    can: 'Versorgt statt eines Angriffs eine eigene Nachbareinheit: Stärke +1,5 und Moral +1. Kaum Kampfkraft.',
    real: 'Auf den Verbandplätzen direkt hinter der Front wurden Verwundete zuerst versorgt und nach Dringlichkeit sortiert.' },
  minenwerfer: { side: 'D', name: 'Minenwerfer', cls: 'art', fig: 'mortar', mobile: true, atk: 0, def: 3, mor: 6, mv: 2, rng: 4, fs: 4, gas: 0,
    can: 'Leichte Steilfeuerwaffe, 4 Felder weit. Sprenggranaten oder Sperrfeuer. Kann in derselben Runde ziehen und feuern.',
    real: 'Deutsche Minenwerfer schossen schwere Sprengladungen im steilen Bogen in die gegnerischen Gräben.' }
});

// Weitere Truppen für die Armee-Auswahl und den Nachschub
Object.assign(TYPES, {
  radler: { side: 'A', name: 'Radfahrer-Trupp', cls: 'inf', fig: 'bike', atk: 3, def: 3, mor: 6, mv: 5, rng: 2, fs: 2,
    can: 'Schnelle Infanterie: zieht 5 Felder, kämpft aber schwächer als die Kohorte. Schlamm, Trichter und Draht bremsen wie bei allen Fußtruppen.',
    real: 'Viele Armeen hatten Radfahrtruppen, etwa britische Cyclist Battalions oder deutsche Radfahr-Kompanien. Auf Straßen waren sie schnell und leise, im Trichterfeld mussten sie schieben.' },
  scharf: { side: 'A', name: 'Scharfschütze', cls: 'inf', fig: 'sniper', pin: true, atk: 1, def: 2, mor: 6, mv: 3, rng: 5, fs: 3,
    can: 'Schießt 5 Felder weit. Jeder Treffer hält das Ziel nieder. Im Nahkampf fast wehrlos.',
    real: 'Scharfschützen mit Zielfernrohr lauerten oft stundenlang getarnt. Schon ein kurz über die Grabenkante gehobener Kopf konnte tödlich sein.' },
  melder: { side: 'A', name: 'Meldegänger mit Hund', cls: 'inf', fig: 'dog', spot: 8, relay: true, atk: 2, def: 2, mor: 7, mv: 4, rng: 0, fs: 0,
    can: 'Sieht für die Artillerie 8 statt 5 Felder weit. Anführer bis 3 Felder Entfernung dürfen jede Runde einen Befehl geben. Kaum Kampfkraft.',
    real: 'Weil Telefonleitungen im Trommelfeuer ständig rissen, überbrachten Meldegänger, Brieftauben und Meldehunde die Nachrichten.' },
  pionier: { side: 'A', name: 'Graben-Pioniere', cls: 'inf', fig: 'sapper', sapper: true, atk: 4, def: 3, mor: 7, mv: 3, rng: 2, fs: 2,
    can: 'Schneidet Draht und kann danach noch angreifen. Sprengladungen: im Nahkampf ×1,5 gegen Kolosse und Kampfmaschinen.',
    real: 'Pioniere schnitten nachts Gassen in den Draht, legten Sprengladungen und gruben Stollen unter die gegnerischen Linien.' },
  raeumer: { side: 'A', name: 'Grabenräumer', cls: 'storm', fig: 'raider', atk: 6, def: 4, mor: 8, mv: 3, rng: 0, fs: 0,
    can: 'Nahkämpfer ohne Gewehr. Sickert durch: Gegner halten ihn nicht auf. Handgranaten heben den Grabenschutz auf. Gegen Kampfmaschinen im Nahkampf ×1,5.',
    real: 'Für nächtliche Grabenüberfälle nutzten Soldaten Grabendolche, Keulen und geschärfte Spaten, weil Gewehre im engen Graben zu lang waren.' },
  schild: { side: 'D', name: 'Schildträger', cls: 'inf', fig: 'shield', atk: 4, def: 6, mor: 8, mv: 2, rng: 0, fs: 0,
    can: 'Schwer gepanzert und langsam. Hält Gräben und Ruinen sehr zäh, hat aber keine Schusswaffe.',
    real: 'Im Stellungskrieg wurden Stahlschilde und Brustpanzer erprobt, etwa der deutsche Grabenpanzer ab 1916. Sie waren schwer und schützten vor allem gegen Splitter.' },
  buechse: { side: 'D', name: 'Panzerbüchsen-Trupp', cls: 'inf', fig: 'atr', at: 2, atk: 2, def: 3, mor: 7, mv: 2, rng: 4, fs: 3,
    can: 'Schießt 4 Felder weit. Durchschlägt Panzerung: Beschuss trifft Landkolosse ×2.',
    real: 'Das deutsche Tankgewehr M1918 war die erste Panzerbüchse der Welt. Es verschoss 13-mm-Geschosse und hatte einen sehr starken Rückstoß.' },
  schwer: { side: 'D', name: 'Schwere Grabenwacht', cls: 'inf', fig: 'heavy', atk: 4, def: 5, mor: 8, mv: 2, rng: 2, fs: 2,
    can: 'Infanterie mit Brustpanzer: bessere Abwehr und Moral als Grenadiere, aber nur 2 Felder Bewegung.',
    real: 'Der deutsche Stahlhelm wurde 1916 eingeführt und senkte die Zahl der Kopfverletzungen deutlich. Für Posten gab es zusätzlich eine Stirnplatte.' },
  signal: { side: 'D', name: 'Signaltrupp', cls: 'inf', fig: 'signal', spot: 8, relay: true, atk: 2, def: 2, mor: 7, mv: 3, rng: 0, fs: 0,
    can: 'Sieht für die Artillerie 8 statt 5 Felder weit. Anführer bis 3 Felder Entfernung dürfen jede Runde einen Befehl geben. Kaum Kampfkraft.',
    real: 'Leuchtpistolen gaben vereinbarte Zeichen an die Artillerie, zum Beispiel für Sperrfeuer. Grabenperiskope erlaubten den Blick über die Brustwehr.' },
  saeger: { side: 'A', name: 'Sägeschreiter', cls: 'walker', fig: 'mechA', mech: true, gat: true, atk: 7, def: 6, mor: 8, mv: 2, rng: 2, fs: 4,
    can: 'Schreitende Kampfmaschine mit Drehlauf-Waffe und Kreissäge. Gepanzert wie ein Landkoloss: Gewehre und MG prallen ab. Bleibt manchmal mit einer Panne liegen.',
    real: 'Auch die Briten bauten keine Schreitmaschinen. Ihr erster Panzer, der Mark I von 1916, hatte acht Mann Besatzung und fuhr etwa so schnell wie ein Fußgänger.' },
  knecht: { side: 'D', name: 'Eisenknecht', cls: 'walker', fig: 'mech', mech: true, gat: true, atk: 6, def: 6, mor: 8, mv: 2, rng: 2, fs: 4,
    can: 'Schreitende Kampfmaschine mit Maschinenwaffe. Gepanzert wie ein Landkoloss: Gewehre und MG prallen ab. Bleibt manchmal mit einer Panne liegen.',
    real: 'Schreitende Kampfmaschinen gab es nie. Der einzige deutsche Panzer des Krieges, der A7V, wurde nur 20-mal gebaut und hatte 18 Mann Besatzung.' },
  bohrer: { side: 'D', name: 'Bohrkoloss', cls: 'walker', fig: 'drill', mech: true, atk: 8, def: 7, mor: 8, mv: 2, rng: 0, fs: 0,
    can: 'Kampfmaschine mit Bohrkopf, nur für den Nahkampf. Sehr stark gegen alles, was er erreicht. Bleibt manchmal mit einer Panne liegen.',
    real: 'Unter der Erde tobte ein Minenkrieg. Bei Messines zündeten die Briten am 7. Juni 1917 neunzehn Minen unter den deutschen Stellungen.' }
});
// Nachschub: Kosten in Punkten und Angebot je Seite
const COST = { kohorte: 3, mahlwerk: 4, feldscher: 3, moerser: 4, reiter: 4, haubitze: 6, koloss: 7,
  grenadier: 3, sense: 4, heiler: 3, minenwerfer: 4, brand: 5, sturm: 6, geschuetz: 6,
  radler: 3, melder: 2, scharf: 4, pionier: 3, raeumer: 4, signal: 2, schild: 4, buechse: 5, schwer: 4, knecht: 9, bohrer: 9, saeger: 9 };
// Kurze Schlagworte zu den Besonderheiten, für die Einheitenkarte
const SPECIALS = {"kohorte": ["Schneidet Draht", "Schuss 2 Felder"], "grenadier": ["Schneidet Draht", "Schuss 2 Felder"], "mahlwerk": ["Reaktionsfeuer", "Zieht oder schießt"], "sense": ["Reaktionsfeuer", "Zieht oder schießt"], "haubitze": ["Feuert über Truppen", "Gas und Sperrfeuer", "Aufprotzen"], "geschuetz": ["Feuert über Truppen", "Direktschuss ×2,5 auf Kolosse", "Aufprotzen"], "koloss": ["Gepanzert", "Walzt Draht nieder", "Pannen"], "reiter": ["Ansturm ×1,5", "Kein Draht, kein Totholz"], "sturm": ["Sickert durch", "Handgranaten", "×1,5 gegen Kolosse"], "brand": ["Flammenstrahl", "Deckung schützt nicht"], "feldscher": ["Versorgt einen Nachbarn"], "heiler": ["Versorgt einen Nachbarn"], "moerser": ["Ziehen und feuern", "Steilfeuer 4 Felder"], "minenwerfer": ["Ziehen und feuern", "Steilfeuer 4 Felder"], "radler": ["Zieht 5 Felder"], "scharf": ["Schuss 5 Felder", "Hält das Ziel nieder"], "melder": ["Sieht 8 Felder", "Anführer befehlen jede Runde"], "signal": ["Sieht 8 Felder", "Anführer befehlen jede Runde"], "pionier": ["Draht schneiden und angreifen", "×1,5 gegen Kolosse"], "raeumer": ["Sickert durch", "Handgranaten", "×1,5 gegen Kolosse"], "schild": ["Sehr zäh", "Keine Schusswaffe"], "buechse": ["Schuss 4 Felder", "×2 gegen Kolosse"], "schwer": ["Brustpanzer", "Langsam"], "knecht": ["Gepanzert", "Maschinenwaffe", "Pannen"], "bohrer": ["Gepanzert", "Nur Nahkampf", "Pannen"], "saeger": ["Gepanzert", "Maschinenwaffe und Säge", "Pannen"]};
for (const t in SPECIALS) TYPES[t].sp = SPECIALS[t];
const SHOP = { A: ['kohorte', 'radler', 'melder', 'feldscher', 'pionier', 'scharf', 'mahlwerk', 'moerser', 'reiter', 'raeumer', 'haubitze', 'koloss', 'saeger'],
  D: ['grenadier', 'signal', 'heiler', 'schwer', 'schild', 'buechse', 'sense', 'minenwerfer', 'brand', 'sturm', 'geschuetz', 'knecht', 'bohrer'] };

const TERRAIN = {
  open:    { name: 'Offenes Feld', cost: 1, info: 'Keine Deckung.' },
  mud:     { name: 'Schlamm', cost: 2, info: 'Kostet 2 Bewegung. Landkolosse bleiben hier manchmal stecken.' },
  crater:  { name: 'Granattrichter', cost: 2, info: 'Kostet 2 Bewegung. Abwehr ×1,2 gegen Beschuss.',
             real: 'Trichter füllten sich oft mit Wasser. 1917 bei Passchendaele ertranken Soldaten im Schlamm.' },
  trench:  { name: 'Schützengraben', cost: 1, info: 'Abwehr ×1,6 gegen Beschuss und Angriffe von vorn. Halber Moralverlust.',
             real: 'Die Gräben waren oft über zwei Meter tief, mit Sandsäcken, Unterständen und Verbindungsgräben nach hinten.' },
  wire:    { name: 'Stacheldraht', cost: 1, info: 'Beendet die Bewegung. Wer drinsteht: Abwehr ×0,6, MG-Feuer ×2. Infanterie kann ihn schneiden, Landkolosse walzen ihn nieder.',
             real: 'Vor den Gräben lagen Drahtgürtel, oft viele Meter tief. Artillerie sollte sie zerschießen, scheiterte aber oft daran.' },
  village: { name: 'Ruinen', cost: 1, info: 'Abwehr ×1,5.' },
  forest:  { name: 'Totholz', cost: 2, info: 'Kostet 2 Bewegung. Abwehr ×1,4. Versperrt die Sicht.',
             real: 'Nach Monaten Beschuss blieben von ganzen Wäldern nur Baumstümpfe, etwa im Wald von Delville an der Somme.' },
  canal:   { name: 'Kanal', cost: 99, info: 'Nicht passierbar, nur über die Brücke.' },
  bridge:  { name: 'Brücke', cost: 1, info: 'Einziger Weg über den Kanal. Zu schwach für Landkolosse.' }
};

const OBJECTIVES = [
  { id: 'veskar', name: 'Ruinen von Veskar', c: 15, r: 4, pts: 2 },
  { id: 'schanze', name: 'Grauwall-Schanze', c: 13, r: 6, pts: 2 },
  { id: 'totholz', name: 'Totholz von Ilm', c: 17, r: 1, pts: 3 },
  { id: 'marn', name: 'Brücke von Marn', c: 18, r: 9, pts: 2 }
];

const SETUP = [
  ['kohorte', 3, 0], ['kohorte', 3, 2], ['kohorte', 3, 4, 'Prätor Hask'], ['kohorte', 3, 6], ['kohorte', 3, 8, 'Hauptfrau Morn'], ['kohorte', 3, 10],
  ['kohorte', 1, 3], ['kohorte', 1, 5], ['kohorte', 1, 7],
  ['mahlwerk', 2, 0], ['mahlwerk', 2, 5], ['mahlwerk', 2, 10],
  ['koloss', 2, 2], ['koloss', 2, 4], ['koloss', 2, 7], ['koloss', 2, 9],
  ['haubitze', 0, 2], ['haubitze', 0, 5], ['haubitze', 0, 8],
  ['reiter', 1, 1], ['reiter', 1, 9],
  ['grenadier', 9, 0], ['grenadier', 9, 4], ['grenadier', 9, 8, 'Hauptmann Veyl'],
  ['sense', 9, 2], ['sense', 9, 6], ['sense', 9, 10],
  ['grenadier', 13, 2], ['grenadier', 13, 6, 'Kastellan Orsk'], ['grenadier', 13, 9],
  ['sense', 13, 4], ['sense', 13, 8],
  ['grenadier', 15, 4], ['grenadier', 17, 1], ['grenadier', 18, 9],
  ['geschuetz', 16, 5], ['geschuetz', 15, 1], ['geschuetz', 15, 8]
];
const REINF = [['sturm', 19, 2], ['sturm', 19, 4, 'Sturmführer Kael'], ['sturm', 19, 6], ['brand', 19, 3], ['brand', 19, 5], ['geschuetz', 18, 5]];

function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// ---------- Karte ----------
function buildMap(seed) {
  const rnd = mulberry32(seed || 1917);
  const M = [];
  for (let c = 0; c < COLS; c++) { M.push([]); for (let r = 0; r < ROWS; r++) M[c].push({ t: 'open', ridge: false, obj: null }); }
  const set = (c, r, t) => { if (c >= 0 && c < COLS && r >= 0 && r < ROWS) M[c][r].t = t; };
  for (let c = 4; c <= 6; c++) for (let r = 0; r < ROWS; r++) { const x = rnd(); if (x < 0.3) set(c, r, 'crater'); else if (x < 0.44) set(c, r, 'mud'); }
  for (let c = 10; c <= 11; c++) for (let r = 0; r < ROWS; r++) if (rnd() < 0.2) set(c, r, 'crater');
  for (let r = 0; r < ROWS; r++) set(3, r, 'trench');
  for (let r = 0; r < ROWS; r++) {
    if (![2, 8].includes(r)) set(7, r, 'wire');
    if (![5, 9].includes(r)) set(8, r, 'wire');
    set(9, r, 'trench');
    if (![1, 5, 9].includes(r)) set(12, r, 'wire');
    set(13, r, 'trench');
  }
  for (let c = 14; c <= 16; c++) for (let r = 3; r <= 6; r++) M[c][r].ridge = true;
  set(15, 4, 'village'); set(15, 5, 'village'); set(16, 4, 'village');
  for (const [c, r] of [[16,0],[17,0],[18,0],[16,1],[17,1],[18,1],[17,2]]) set(c, r, 'forest');
  for (let r = 7; r < ROWS; r++) set(17, r, 'canal');
  set(17, 9, 'bridge');
  set(18, 8, 'village'); set(18, 9, 'village'); set(19, 9, 'village');
  for (const o of OBJECTIVES) M[o.c][o.r].obj = o.id;
  return M;
}

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
function angDiff(a, b) { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; }
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
function addUnit(G, type, c, r, officer) {
  const T = TYPES[type];
  const u = { id: G.nextId++, type, side: T.side, c, r, officer: officer || null,
    str: 10, mor: T.mor, face: T.side === 'A' ? 0 : 3, status: 'ok',
    moved: false, attacked: false, react: true, supp: 0, fireDmg: 0, turnOnly: false,
    run: 0, broken: 0, gassed: false, seenWalker: false, limbered: false, gas: T.gas || 0, startC: c, startR: r };
  G.units.push(u);
  return u;
}
// ---------- Armee-Auswahl ----------
// Jede Seite darf vor der Schlacht für den Wert der Standardarmee selbst Truppen wählen.
function defaultArmy(side) { const a = {}; for (const s of SETUP) if (TYPES[s[0]].side === side) a[s[0]] = (a[s[0]] || 0) + 1; return a; }
function armyCost(army) { let n = 0; for (const t in army) n += (COST[t] || 0) * army[t]; return n; }
function armyCount(army) { let n = 0; for (const t in army) n += army[t]; return n; }
const ARMY_BUDGET = { A: armyCost(defaultArmy('A')), D: armyCost(defaultArmy('D')) };
const ARMY_MAX = { A: 26, D: 22 }, ARMY_MIN = { A: 8, D: 8 }, ARMY_CAP = 9, ARMY_WALKERS = 4;   // je Typ höchstens 9, höchstens 4 Kolosse/Kampfmaschinen
const ROSTER = { A: SHOP.A.slice(), D: SHOP.D.slice() };
const isMech = t => !!TYPES[t] && !!TYPES[t].mech;
function armyOk(side, army, mechs) {
  for (const t in army) if (!ROSTER[side].includes(t) || (army[t] > 0 && isMech(t) && !mechs) || !(army[t] >= 0) || army[t] !== Math.floor(army[t])) return false;
  const n = armyCount(army); let walkers = 0;
  for (const t in army) { if (army[t] > ARMY_CAP) return false; if (TYPES[t].cls === 'walker') walkers += army[t]; }
  if (walkers > ARMY_WALKERS) return false;
  return armyCost(army) <= ARMY_BUDGET[side] && n >= ARMY_MIN[side] && n <= ARMY_MAX[side];
}
const ROWS_OUT = [5, 3, 7, 1, 9, 4, 6, 2, 8, 0, 10];
function deploy(G, side, army) {
  // Reihenfolge: Typen abwechselnd, damit sich die Truppen über die Front verteilen
  const left = Object.assign({}, army), list = [];
  for (let more = true; more;) { more = false; for (const t of ROSTER[side]) if (left[t] > 0) { left[t]--; list.push(t); more = true; } }
  const names = side === 'A' ? ['Prätor Hask', 'Hauptfrau Morn'] : ['Hauptmann Veyl', 'Kastellan Orsk'];
  const lead = t => { const T = TYPES[t]; return (T.cls === 'inf' || T.cls === 'storm') && !T.relay && !T.pin && names.length ? names.shift() : null; };
  const free = (t, c, r) => inMap(c, r) && !unitAt(G, c, r) && cost(G, { type: t, side }, c, r) < 99;
  if (side === 'A') {
    const pref = t => { const T = TYPES[t]; return T.cls === 'art' && !T.mobile ? 0 : (T.mobile || T.pin || T.relay || T.cls === 'cav' || T.cls === 'medic' || T.fig === 'bike') ? 1 : (T.cls === 'walker' || T.cls === 'mg') ? 2 : 3; };
    for (const t of list) {
      const p = pref(t); let done = false;
      for (const c of [p, p - 1, p + 1, p - 2, p + 2, p - 3, p + 3]) {
        if (c < 0 || c > 3 || done) continue;
        for (const r of ROWS_OUT) if (free(t, c, r)) { addUnit(G, t, c, r, lead(t)); done = true; break; }
      }
    }
  } else {
    const back = [[16, 5], [15, 1], [15, 8], [17, 5], [16, 3]];
    const front = [[15, 4], [13, 6], [17, 1], [18, 9], [9, 4], [9, 8], [9, 0], [9, 2], [9, 6], [9, 10], [13, 2], [13, 9], [13, 4], [13, 8], [17, 3], [11, 5], [11, 1], [11, 9], [16, 7], [12, 3], [12, 7], [14, 5]];
    for (const t of list) {
      const T = TYPES[t], rear = T.cls === 'art' || T.cls === 'medic' || T.relay;
      const sl = (rear ? back.concat(front) : front.concat(back)).find(([c, r]) => free(t, c, r));
      if (sl) addUnit(G, t, sl[0], sl[1], lead(t));
    }
  }
}

function newGame(opts) {
  opts = opts || {};
  const G = {
    map: buildMap(1917), units: [], turn: 1, side: 'A', over: null,
    rng: mulberry32(opts.seed != null ? opts.seed : (Date.now() & 0xffffffff)),
    ctrl: {}, nextId: 1, clouds: [], wind: 1, reinfDone: false, pts: { A: 0, D: 0 }, mechs: !!opts.mechs
  };
  for (const o of OBJECTIVES) G.ctrl[o.id] = 'D';
  for (const side of ['A', 'D']) {
    const army = opts.army && opts.army[side];
    if (army && armyOk(side, army, !!opts.mechs)) deploy(G, side, army);
    else for (const s of SETUP) if (TYPES[s[0]].side === side) addUnit(G, s[0], s[1], s[2], s[3]);
  }
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
function officerAt(G, side, c, r) {
  return G.units.some(o => o.officer && o.side === side && active(o) && dist(o.c, o.r, c, r) <= P.OFFICER_RANGE);
}
function arcOf(G, d, ac, ar) {
  const diff = angDiff(angleTo(d.c, d.r, ac, ar), d.face * 60);
  return diff <= 61 ? 'front' : diff <= 121 ? 'flank' : 'rear';
}

// ---------- Bewegung ----------
function cost(G, u, c, r) {
  const t = hex(G, c, r).t, k = cls(u);
  if (t === 'canal') return 99;
  if (k === 'cav') { if (t === 'wire' || t === 'forest') return 99; if (t === 'crater' || t === 'trench') return 3; }
  if (k === 'walker') { if (t === 'forest' || t === 'bridge') return 99; if (t === 'crater') return 1; }
  if (k === 'art') { if (t === 'wire' || t === 'forest') return 99; }
  return TERRAIN[t].cost;
}
function reachable(G, u) {
  const res = new Map();
  if (!active(u) || u.moved || u.supp > 0 || u.broken > 0) return res;
  const T = TYPES[u.type], free = T.cls === 'storm' || T.cls === 'walker';
  const mp = (!free && isZOC(G, u.c, u.r, u.side)) ? 1 : u.limbered ? P.LIMBER_MV : T.mv;
  const start = key(u.c, u.r);
  const best = new Map([[start, 0]]), prev = new Map();
  const queue = [[0, u.c, u.r]];
  while (queue.length) {
    queue.sort((a, b) => a[0] - b[0]);
    const [cst, c, r] = queue.shift();
    if (cst > best.get(key(c, r))) continue;
    const here = key(c, r);
    if (here !== start && ((hex(G, c, r).t === 'wire' && T.cls !== 'walker') || (!free && isZOC(G, c, r, u.side)))) continue;
    for (const [nc, nr] of neighbors(c, r)) {
      const occ = unitAt(G, nc, nr);
      if (occ && (occ.side !== u.side || occ.status === 'rout')) continue;
      const mc = cost(G, u, nc, nr);
      if (mc >= 99) continue;
      const nCost = cst + mc;
      if (nCost > mp && here !== start) continue;
      const k = key(nc, nr);
      if (best.has(k) && best.get(k) <= nCost) continue;
      best.set(k, nCost); prev.set(k, here); queue.push([nCost, nc, nr]);
    }
  }
  for (const [k, cst] of best) {
    if (k === start) continue;
    const c = Math.floor(k / 100), r = k % 100;
    if (unitAt(G, c, r)) continue;
    const path = []; let cur = k;
    while (cur !== start) { path.unshift([Math.floor(cur / 100), cur % 100]); cur = prev.get(cur); }
    res.set(k, { c, r, cost: cst, path });
  }
  return res;
}
function nearestEnemy(G, u) {
  let best = null, bd = 1e9;
  for (const o of G.units) if (o.side !== u.side && active(o)) { const d = dist(u.c, u.r, o.c, o.r); if (d < bd) { bd = d; best = o; } }
  return best;
}
function autoFace(G, u) {
  const e = nearestEnemy(G, u);
  if (e && dist(u.c, u.r, e.c, e.r) <= 4) u.face = faceIndex(angleTo(u.c, u.r, e.c, e.r));
  else u.face = u.side === 'A' ? 0 : 3;
}
function openGround(G, c, r) { return ['open', 'mud', 'crater', 'wire', 'bridge'].includes(hex(G, c, r).t); }

function moveUnit(G, u, c, r) {
  const ev = [];
  const opt = reachable(G, u).get(key(c, r));
  if (!opt) return ev;
  const T = TYPES[u.type];
  u.moved = true; u.run = 0;
  if (T.mg || (T.cls === 'art' && !T.mobile)) u.attacked = true;
  let seg = [[u.c, u.r]];
  const flush = () => { if (seg.length > 1) ev.push({ t: 'move', u: u.id, path: seg }); seg = [[u.c, u.r]]; };
  for (const [nc, nr] of opt.path) {
    u.c = nc; u.r = nr; u.run++; seg.push([nc, nr]);
    const h = hex(G, nc, nr);
    if (T.cls === 'walker' && h.t === 'wire') { h.t = 'open'; flush(); ev.push({ t: 'crush', u: u.id, c: nc, r: nr }); }
    claimObjective(G, u);
    if (T.cls === 'walker' && h.t === 'mud' && G.rng() < P.STUCK) { flush(); ev.push({ t: 'stuck', u: u.id }); break; }
    if (T.cls !== 'walker' && openGround(G, nc, nr)) {
      const mg = G.units.find(m => m.side !== u.side && active(m) && TYPES[m.type].mg && m.react && !m.supp &&
        dist(m.c, m.r, nc, nr) <= rangeOf(G, m, nc, nr) && hasLOS(G, m.c, m.r, nc, nr));
      if (mg) {
        flush();
        mg.react = false;
        ev.push(...resolveFire(G, mg, u, true));
        if (u.status !== 'ok' || u.c !== nc || u.r !== nr || u.supp > 0) { ev.push(...checkEnd(G)); return ev; }
      }
    }
  }
  flush();
  autoFace(G, u);
  ev.push({ t: 'face', u: u.id, face: u.face });
  if (T.cls === 'walker') {
    for (const e of G.units) if (e.side !== u.side && active(e) && !e.seenWalker && cls(e) !== 'walker' && dist(e.c, e.r, u.c, u.r) <= 2) {
      e.seenWalker = true; e.mor = Math.max(0.5, e.mor - P.WALKER_FEAR);
      ev.push({ t: 'fear', u: e.id, morv: e.mor });
    }
    if (G.rng() < P.BREAKDOWN) { u.broken = 3; u.attacked = true; ev.push({ t: 'breakdown', u: u.id }); }
  }
  ev.push(...checkEnd(G));
  return ev;
}
function turnUnit(G, u, face) {
  if (!active(u) || (u.moved && !u.turnOnly) || u.attacked || u.supp > 0 || u.broken > 0) return [];
  u.face = ((face % 6) + 6) % 6; u.moved = true; u.turnOnly = true;
  return [{ t: 'face', u: u.id, face: u.face }];
}
// Aufprotzen: Geschütz an die Pferde hängen (zieht dann 4 Felder, feuert nicht). Abprotzen: wieder feuerbereit ab der nächsten Runde.
function canLimber(G, u) {
  if (!active(u) || !TYPES[u.type].limber || u.supp > 0) return false;
  return u.limbered ? !u.unlimbered : (!u.moved && !u.attacked);
}
function limber(G, u) {
  if (!canLimber(G, u)) return [];
  if (u.limbered) { u.limbered = false; u.moved = true; u.attacked = true; }
  else { u.limbered = true; u.attacked = true; }
  return [{ t: 'limber', u: u.id, on: u.limbered }];
}
function canCut(G, u) { return active(u) && !u.attacked && cls(u) === 'inf' && hex(G, u.c, u.r).t === 'wire'; }
function cutWire(G, u) {
  if (!canCut(G, u)) return [];
  hex(G, u.c, u.r).t = 'open'; u.attacked = !TYPES[u.type].sapper; u.moved = true;
  return [{ t: 'cut', u: u.id, c: u.c, r: u.r }];
}

// ---------- Kampf ----------
function rangeOf(G, a, tc, tr) {
  let rng = TYPES[a.type].rng || 0;
  if (rng > 1 && hex(G, a.c, a.r).ridge && !hex(G, tc, tr).ridge) rng += 1;
  return rng;
}
function hasLOS(G, c1, r1, c2, r2) {
  for (const [c, r] of line(c1, r1, c2, r2)) {
    if (!inMap(c, r)) continue;
    const t = hex(G, c, r).t;
    if (t === 'forest' || t === 'village') return false;
  }
  return true;
}
function surrounded(G, u) {
  const adj = adjEnemies(G, u);
  if (adj.length >= 3) return true;
  if (!adj.length) return false;
  return !retreatHex(G, u, null);
}
function immune(A, D) { return D.cls === 'walker' && !A.at && (A.cls === 'inf' || A.cls === 'mg' || A.cls === 'cav' || A.cls === 'storm'); }
function canMelee(G, a, d) {
  return active(a) && !a.attacked && !a.broken && TYPES[a.type].atk > 0 && alive(d) && d.side !== a.side && dist(a.c, a.r, d.c, d.r) === 1;
}
function canFire(G, a, d) {
  const T = TYPES[a.type];
  if (!active(a) || a.attacked || a.broken || !T.rng || T.cls === 'art' || !alive(d) || d.side === a.side) return false;
  if (T.mg && a.moved) return false;
  if (immune(T, TYPES[d.type])) return false;
  const dd = dist(a.c, a.r, d.c, d.r);
  return dd >= 1 && dd <= rangeOf(G, a, d.c, d.r) && hasLOS(G, a.c, a.r, d.c, d.r);
}
function defMods(G, d, arc, ranged, tags, noTrench) {
  const t = hex(G, d.c, d.r).t;
  let m = 1;
  if (t === 'trench' && (ranged || arc === 'front')) {
    if (noTrench) tags.push('Handgranaten: kein Grabenschutz'); else { m *= P.TRENCH_DEF; tags.push('Graben ×1,6'); }
  }
  if (t === 'crater' && ranged) { m *= P.CRATER_FIRE; tags.push('Trichter ×1,2'); }
  if (t === 'village') { if (cls(d) === 'walker') { m *= 0.7; tags.push('Koloss in Ruinen ×0,7'); } else { m *= P.VILLAGE_DEF; tags.push('Ruinen ×1,5'); } }
  if (t === 'forest') { m *= P.FOREST_DEF; tags.push('Totholz ×1,4'); }
  if (t === 'wire') { m *= P.WIRE_DEF; tags.push('im Draht ×0,6'); }
  return m;
}
function hexDef(G, c, r, isWalker) {
  const t = hex(G, c, r).t;
  return t === 'village' ? (isWalker ? 0.7 : P.VILLAGE_DEF) : t === 'forest' ? P.FOREST_DEF : t === 'wire' ? P.WIRE_DEF : 1;
}

// Schaden ohne Zufall, für Vorschau und KI. kind: 'melee' | 'fire'
function preview(G, a, d, kind, o) {
  o = o || {};
  const ac = o.c != null ? o.c : a.c, ar = o.r != null ? o.r : a.r, run = o.run != null ? o.run : a.run;
  const A = TYPES[a.type], D = TYPES[d.type], tags = [], ranged = kind === 'fire';
  const arc = arcOf(G, d, ac, ar);
  const flame = ranged && A.flame;
  let m = 1;
  if (arc === 'flank') { m *= P.FLANK; tags.push('Flanke ×1,4'); }
  if (arc === 'rear') { m *= P.REAR; tags.push('Rücken ×1,8'); }
  if (d.status === 'rout') {
    if (A.cls === 'cav' && !ranged) { m *= P.CAV_VS_ROUT; tags.push('Reiter gegen Fliehende ×2'); }
    else { m *= P.VS_ROUT; tags.push('fliehend ×1,6'); }
  }
  if (D.cls === 'walker') {
    if (ranged && immune(A, D)) { m = 0; tags.push('Panzerung: wirkungslos'); }
    if (ranged && A.at) { m *= A.at; tags.push('Panzerbüchse ×' + String(A.at).replace('.', ',')); }
    if (!ranged) { if (A.cls === 'storm' || A.sapper) { m *= P.STORM_VS_WALKER; tags.push('geballte Ladung ×1,5'); } else if (A.cls !== 'walker') { m *= P.MELEE_VS_WALKER; tags.push('Panzerung ×0,4'); } }
  }
  if (ranged && A.mg) {
    if (hex(G, d.c, d.r).t === 'wire') { m *= P.MG_VS_WIRE; tags.push('MG gegen Draht ×2'); }
    if (D.cls === 'cav') { m *= P.MG_VS_CAV; tags.push('MG gegen Reiter ×2'); }
  }
  if (!ranged && A.cls === 'cav' && run >= P.CHARGE_MIN) { m *= P.CHARGE; tags.push('Ansturm ×1,5'); }
  if (!ranged && hex(G, ac, ar).t === 'wire') { m *= 0.7; tags.push('aus dem Draht ×0,7'); }
  if (ranged && D.cls === 'flame') { m *= P.FLAME_HIT; tags.push('Brandtank getroffen ×1,5'); }
  if (officerAt(G, a.side, ac, ar)) { m *= P.OFFICER_ATK; tags.push('Offizier ×1,15'); }
  if (!ranged && a.zeal) { m *= P.ORDER_ATK; tags.push('Sturmbefehl ×1,25'); }
  if (a.supp > 0) { m *= P.SUPP_ATK; tags.push('niedergehalten ×0,5'); }
  if (a.gassed) { m *= P.GAS_ATK; tags.push('im Gas ×0,7'); }
  let dm = 1;
  if (flame) tags.push('Flammen: Deckung schützt nicht');
  else dm = defMods(G, d, arc, ranged, tags, !ranged && A.cls === 'storm');
  const dmg = P.DMG * ((ranged ? A.fs : A.atk) / (D.def * dm)) * (0.4 + 0.6 * a.str / 10) * m;
  let counter = 0;
  if (!ranged && d.status === 'ok' && D.atk > 0) counter = counterDmg(G, d, a, ac, ar, arc, Math.max(0, d.str - dmg));
  return { dmg, counter, arc, tags };
}
function counterDmg(G, d, a, ac, ar, arc, dStr) {
  const A = TYPES[a.type], D = TYPES[d.type];
  let m = P.COUNTER[arc];
  if (A.cls === 'walker' && D.cls !== 'walker') m *= D.cls === 'storm' ? P.STORM_VS_WALKER : P.MELEE_VS_WALKER;
  return P.DMG * (D.atk / (A.def * hexDef(G, ac, ar, A.cls === 'walker'))) * (0.4 + 0.6 * dStr / 10) * m;
}

function applyDamage(G, a, d, dmg, arc, ev, o) {
  o = o || {};
  const t = hex(G, d.c, d.r).t;
  d.str = Math.max(0, d.str - dmg);
  if (o.ranged && d.status === 'ok' && cls(d) !== 'walker') {
    d.fireDmg += dmg;
    if ((d.fireDmg >= P.SUPP || (dmg > 0 && a && TYPES[a.type] && TYPES[a.type].pin)) && !d.supp) { d.supp = 1; ev.push({ t: 'supp', u: d.id }); }
  }
  let ml = dmg * P.MOR_PER_DMG * (o.morMul || 1);
  if (arc === 'flank') ml += P.MOR_FLANK;
  if (arc === 'rear') ml += P.MOR_REAR;
  if (d.status === 'ok' && surrounded(G, d)) ml += P.MOR_SURR;
  if (t === 'trench' && !o.flame) ml *= 0.5;
  if (officerAt(G, d.side, d.c, d.r)) ml *= P.OFFICER_MOR;
  d.mor = Math.max(0, d.mor - ml);
  ev.push({ t: 'hit', u: d.id, dmg, str: d.str, morv: d.mor });
  if (d.str < 0.3) { killUnit(G, d, ev, 'destroyed'); return; }
  if (d.status === 'rout') return;
  if (d.str < P.ROUT_STR || d.mor <= 0) { routUnit(G, d, a, ev); return; }
  if (d.mor < P.FALLBACK_MOR && cls(d) !== 'art') fallBack(G, d, a, ev);
}
function credit(G, u) { if (!u.credited) { u.credited = true; G.pts[u.side === 'A' ? 'D' : 'A'] += P.PTS_KILL; } }
function killUnit(G, u, ev, how) {
  if (how !== 'escaped') credit(G, u);
  u.status = how === 'escaped' ? 'gone' : 'dead';
  if (u.officer && how !== 'escaped') ev.push({ t: 'officer', u: u.id, name: u.officer });
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
    if (t === 'trench' || t === 'village') s += 1;
    if (t === 'wire') s -= 2;
    if (s > bs) { bs = s; best = [c, r]; }
  }
  return best;
}
function fallBack(G, u, from, ev) {
  const h = retreatHex(G, u, from);
  if (!h) return;
  const fc = u.c, fr = u.r;
  u.c = h[0]; u.r = h[1];
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
      if (o.mor <= 0) { o.status = 'rout'; credit(G, o); ev.push({ t: 'rout', u: o.id }); }
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
    u.c = best[0]; u.r = best[1]; path.push(best);
    if (hex(G, u.c, u.r).t === 'wire') break;
  }
  if (path.length > 1) ev.push({ t: 'flee', u: u.id, path });
  else if (adjEnemies(G, u).length) { killUnit(G, u, ev, 'destroyed'); return; }
  u.face = u.side === 'A' ? 3 : 0;
}
function fireKind(a) { const T = TYPES[a.type]; return T.mg ? 'mg' : T.flame ? 'flame' : T.gat ? 'minigun' : T.cls === 'walker' ? 'cannon' : 'rifle'; }
function resolveFire(G, a, d, reaction) {
  const ev = [];
  const p = preview(G, a, d, 'fire');
  const dmg = p.dmg * (0.75 + G.rng() * 0.5);
  if (!reaction) { a.attacked = true; a.face = faceIndex(angleTo(a.c, a.r, d.c, d.r)); }
  const flame = !!TYPES[a.type].flame;
  ev.push({ t: 'fire', a: a.id, d: d.id, kind: fireKind(a), reaction: !!reaction, face: a.face });
  applyDamage(G, a, d, dmg, p.arc, ev, { ranged: true, flame, morMul: flame ? P.FLAME_MOR : 1 });
  return ev;
}
function fire(G, a, d) {
  if (!canFire(G, a, d)) return [];
  const ev = resolveFire(G, a, d, false);
  ev.push(...checkEnd(G));
  return ev;
}
function melee(G, a, d) {
  if (!canMelee(G, a, d)) return [];
  const ev = [];
  const p = preview(G, a, d, 'melee');
  a.attacked = true; a.moved = true;
  a.face = faceIndex(angleTo(a.c, a.r, d.c, d.r));
  ev.push({ t: 'melee', a: a.id, d: d.id, face: a.face });
  const dmg = p.dmg * (0.75 + G.rng() * 0.5);
  const dc = d.c, dr = d.r;
  applyDamage(G, a, d, dmg, p.arc, ev);
  if (d.status === 'ok' && d.c === dc && d.r === dr && p.arc !== 'rear' && TYPES[d.type].atk > 0) {
    const cd = counterDmg(G, d, a, a.c, a.r, p.arc, d.str) * (0.75 + G.rng() * 0.5);
    if (cd > 0) { ev.push({ t: 'counter', a: d.id, d: a.id }); applyDamage(G, d, a, cd, 'front', ev); }
  }
  const k = cls(a);
  if (active(a) && !unitAt(G, dc, dr) && k !== 'mg' && k !== 'flame' && cost(G, a, dc, dr) < 99) {
    const fc = a.c, fr = a.r;
    a.c = dc; a.r = dr;
    if (k === 'walker' && hex(G, dc, dr).t === 'wire') { hex(G, dc, dr).t = 'open'; ev.push({ t: 'crush', u: a.id, c: dc, r: dr }); }
    claimObjective(G, a);
    ev.push({ t: 'advance', u: a.id, path: [[fc, fr], [dc, dr]] });
  }
  ev.push(...checkEnd(G));
  return ev;
}
function claimObjective(G, u) {
  if (!active(u) || cls(u) === 'art') return;
  const o = hex(G, u.c, u.r).obj;
  if (o && G.ctrl[o] !== u.side) { G.ctrl[o] = u.side; G.pts[u.side] += OBJECTIVES.find(x => x.id === o).pts; }
}

// ---------- Artillerie ----------
function spotted(G, side, c, r) {
  return G.units.some(u => u.side === side && active(u) && cls(u) !== 'art' && dist(u.c, u.r, c, r) <= (TYPES[u.type].spot || P.SPOT) && hasLOS(G, u.c, u.r, c, r));
}
function isDirect(G, a, c, r) { return dist(a.c, a.r, c, r) <= P.ART_DIRECT && hasLOS(G, a.c, a.r, c, r); }
function canShell(G, a, c, r, mode) {
  const T = TYPES[a.type];
  if (!active(a) || T.cls !== 'art' || a.limbered || a.attacked || (a.moved && !T.mobile) || a.supp > 0) return false;
  const d = dist(a.c, a.r, c, r);
  if (d < 1 || d > T.rng) return false;
  if (mode === 'gas' && a.gas <= 0) return false;
  if (isDirect(G, a, c, r)) return mode === 'he';
  return d >= P.ART_MIN && spotted(G, a.side, c, r);
}
function shellDmg(G, a, d, direct, tags) {
  tags = tags || [];
  let m = 1;
  if (cls(d) === 'walker' && direct) { m *= P.ART_VS_WALKER; tags.push('direkter Schuss auf Koloss ×2,5'); }
  if (cls(d) === 'flame') m *= P.FLAME_HIT;
  const dm = defMods(G, d, 'front', true, tags);
  return P.DMG * (TYPES[a.type].fs / (TYPES[d.type].def * dm)) * (0.4 + 0.6 * a.str / 10) * m;
}
function gasCells(G, c, r) {
  const out = [[c, r]];
  let p = [c, r];
  for (let i = 0; i < 2; i++) { p = step(p[0], p[1], G.wind); if (inMap(p[0], p[1])) out.push(p); }
  return out;
}
function shell(G, a, c, r, mode) {
  if (!canShell(G, a, c, r, mode)) return [];
  const ev = [];
  a.attacked = true; a.moved = true;
  a.face = faceIndex(angleTo(a.c, a.r, c, r));
  const direct = isDirect(G, a, c, r);
  let tc = c, tr = r, sc = false;
  if (!direct && G.rng() < P.SCATTER) { const nb = neighbors(c, r); const p = nb[Math.floor(G.rng() * nb.length)]; tc = p[0]; tr = p[1]; sc = true; }
  ev.push({ t: 'shell', a: a.id, c: tc, r: tr, mode, scatter: sc, face: a.face });
  if (mode === 'he') {
    const d = unitAt(G, tc, tr);
    if (d) applyDamage(G, a, d, shellDmg(G, a, d, direct) * (0.75 + G.rng() * 0.5), 'front', ev, { ranged: true });
    const h = hex(G, tc, tr);
    if (h.t === 'wire' && G.rng() < P.HE_WIRE) { h.t = 'open'; ev.push({ t: 'terrain', c: tc, r: tr, what: 'Draht zerschossen' }); }
    else if (h.t === 'open' && G.rng() < P.HE_CRATER) { h.t = 'crater'; ev.push({ t: 'terrain', c: tc, r: tr }); }
  } else if (mode === 'barrage') {
    for (const [hc, hr] of [[tc, tr], ...neighbors(tc, tr)]) {
      const u = unitAt(G, hc, hr);
      if (u && active(u) && cls(u) !== 'walker' && !u.supp) { u.supp = 1; ev.push({ t: 'supp', u: u.id }); }
    }
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
    if (G.rng() < P.WIND_SHIFT) { G.wind = (G.wind + (G.rng() < 0.5 ? 1 : 5)) % 6; ev.push({ t: 'wind', dir: G.wind }); }
    if (G.clouds.length) {
      for (const k of G.clouds) { k.ttl--; const p = step(k.c, k.r, G.wind); k.c = p[0]; k.r = p[1]; }
      G.clouds = G.clouds.filter(k => k.ttl > 0 && inMap(k.c, k.r));
      ev.push({ t: 'gascloud' });
    }
  }
  if (s === 'D' && G.turn === P.REINF_TURN && !G.reinfDone) {
    G.reinfDone = true;
    const ids = [];
    for (const [type, c, r, off] of REINF) {
      let rr = r, tries = 0;
      while (unitAt(G, c, rr) && tries++ < ROWS) rr = (rr + 1) % ROWS;
      if (unitAt(G, c, rr)) continue;
      const u = addUnit(G, type, c, rr, off);
      if (type === 'geschuetz') u.gas = 3;
      ids.push(u.id);
    }
    ev.push({ t: 'reinf', ids });
  }
  G.pts[s] += P.PTS_TURN[s];
  for (const u of G.units) {
    u.fireDmg = 0;
    if (u.side === s) { u.moved = false; u.attacked = false; u.turnOnly = false; u.run = 0; u.gassed = false; if (u.cd > 0) u.cd--; }
    else if (TYPES[u.type].mg) u.react = true;
  }
  for (const u of G.units.filter(x => x.side === s && alive(x))) {
    if (cloudAt(G, u.c, u.r)) {
      u.str = Math.max(0, u.str - P.GAS_STR); u.mor = Math.max(0, u.mor - P.GAS_MOR); u.gassed = true;
      ev.push({ t: 'gas', u: u.id, str: u.str, morv: u.mor });
      if (u.str < 0.3) { killUnit(G, u, ev, 'destroyed'); continue; }
      if (u.status === 'ok' && (u.str < P.ROUT_STR || u.mor <= 0)) { u.status = 'rout'; u.supp = 0; credit(G, u); ev.push({ t: 'rout', u: u.id }); }
    }
    if (u.broken > 0) {
      u.broken--;
      if (u.broken > 0) { u.moved = true; u.attacked = true; } else ev.push({ t: 'repaired', u: u.id });
    }
    if (u.status === 'rout') {
      const off = G.units.find(o => o.officer && o.side === s && active(o) && dist(o.c, o.r, u.c, u.r) <= P.OFFICER_RANGE);
      if (off && !adjEnemies(G, u).length && u.str >= P.ROUT_STR && G.rng() < P.RALLY) {
        u.status = 'ok'; u.mor = 3; u.face = s === 'A' ? 0 : 3;
        ev.push({ t: 'rally', u: u.id, by: off.officer });
        u.moved = true; u.attacked = true;
        continue;
      }
      if (u.c === SIDES[s].edge) { killUnit(G, u, ev, 'escaped'); continue; }
      flee(G, u, TYPES[u.type].mv + 1, ev);
      if (alive(u) && u.c === SIDES[s].edge) killUnit(G, u, ev, 'escaped');
      u.moved = true; u.attacked = true;
      continue;
    }
    if (!adjEnemies(G, u).length && !u.supp && !u.gassed) {
      const t = hex(G, u.c, u.r).t;
      const rec = (t === 'trench' || t === 'village' || t === 'forest') ? P.RECOVER_COVER : P.RECOVER;
      u.mor = Math.min(TYPES[u.type].mor, u.mor + rec * (officerAt(G, u.side, u.c, u.r) ? 1.5 : 1));
    }
  }
  ev.push(...checkEnd(G));
  return ev;
}
// Einheit für diese Runde abschließen (Knopf „Fertig“)
function pass(G, u) { if (!u || !active(u) || u.side !== G.side) return []; u.moved = true; u.attacked = true; return [{ t: 'pass', u: u.id }]; }

// ---------- Befehle der Anführer ----------
// Einmal alle zwei eigenen Runden. 'rally' = Sammeln (Moral +1,5, Niederhalten endet), 'storm' = Sturmbefehl (Nahkampf ×1,25 in dieser Runde).
function canOrder(G, u) { return !G.over && u && active(u) && !!u.officer && u.side === G.side && !(u.cd > 0); }
function order(G, u, kind) {
  if (!canOrder(G, u) || (kind !== 'rally' && kind !== 'storm')) return [];
  const relay = G.units.some(o => o.side === u.side && active(o) && TYPES[o.type].relay && dist(o.c, o.r, u.c, u.r) <= 3);
  u.cd = relay ? 1 : P.ORDER_CD; const ids = [];
  for (const o of G.units) {
    if (o.side !== u.side || !active(o) || cls(o) === 'walker' || dist(o.c, o.r, u.c, u.r) > P.OFFICER_RANGE) continue;
    if (kind === 'rally') { o.mor = Math.min(TYPES[o.type].mor, o.mor + P.ORDER_MOR); o.supp = 0; } else o.zeal = true;
    ids.push(o.id);
  }
  return [{ t: 'order', u: u.id, kind, name: u.officer, ids, mors: ids.map(id => G.units.find(x => x.id === id).mor) }];
}

// ---------- Sanitäter ----------
function canHeal(G, m, t) {
  return active(m) && cls(m) === 'medic' && !m.attacked && t && t !== m && t.side === m.side && active(t) && cls(t) !== 'walker' &&
    dist(m.c, m.r, t.c, t.r) === 1 && (t.str < 10 || t.mor < TYPES[t.type].mor);
}
function heal(G, m, t) {
  if (!canHeal(G, m, t)) return [];
  m.attacked = true; m.face = faceIndex(angleTo(m.c, m.r, t.c, t.r));
  t.str = Math.min(10, t.str + P.HEAL); t.mor = Math.min(TYPES[t.type].mor, t.mor + P.HEAL_MOR);
  return [{ t: 'heal', u: t.id, by: m.id, str: t.str, morv: t.mor }];
}
// ---------- Nachschub ----------
function spawnHexes(G, side, type) {
  const out = [], probe = { type, side };
  for (let c = 0; c < COLS; c++) { if (side === 'A' ? c > 1 : c < COLS - 2) continue; for (let r = 0; r < ROWS; r++) if (!unitAt(G, c, r) && cost(G, probe, c, r) < 99) out.push([c, r]); }
  return out;
}
function canBuy(G, side, type) { return !G.over && (G.mechs || !isMech(type)) && G.side === side && SHOP[side].includes(type) && G.pts[side] >= COST[type]; }
function buy(G, side, type, c, r) {
  if (!canBuy(G, side, type) || !spawnHexes(G, side, type).some(h => h[0] === c && h[1] === r)) return [];
  G.pts[side] -= COST[type];
  const u = addUnit(G, type, c, r);
  u.moved = true; u.attacked = true; u.react = false;
  return [{ t: 'spawn', u: u.id }];
}
function endTurn(G) {
  if (G.over) return [];
  for (const u of G.units) if (u.side === G.side) { if (u.supp > 0) u.supp--; u.zeal = false; }
  if (G.side === 'A') G.side = 'D';
  else {
    if (G.turn >= P.MAXT) { G.over = finalResult(G); return [{ t: 'over', result: G.over }]; }
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
function finalResult(G) {
  const p = points(G);
  if (p >= P.WIN_A) return { winner: 'A', why: 'points', pts: p };
  if (p >= P.DRAW_A) return { winner: null, why: 'points', pts: p };
  return { winner: 'D', why: 'points', pts: p };
}
function checkEnd(G) {
  if (G.over) return [];
  const la = losses(G, 'A'), ld = losses(G, 'D');
  if (ld >= P.BREAK.D) G.over = { winner: 'A', why: 'break', pts: points(G) };
  else if (la >= P.BREAK.A) G.over = { winner: 'D', why: 'break', pts: points(G) };
  return G.over ? [{ t: 'over', result: G.over }] : [];
}

const E = {
  P, COLS, ROWS, SIDES, TYPES, TERRAIN, OBJECTIVES, SETUP, REINF, COST, SHOP, spawnHexes, canBuy, buy, limber, canLimber, heal, canHeal, order, canOrder, pass, canCut, defaultArmy, armyCost, armyCount, armyOk, ARMY_BUDGET, ARMY_MAX, ARMY_MIN, ARMY_CAP, ARMY_WALKERS, ROSTER, isMech,
  newGame, startTurn, endTurn, reachable, moveUnit, turnUnit, cutWire, canCut, fire, melee, shell,
  canFire, canMelee, canShell, preview, shellDmg, gasCells, isDirect, spotted, immune,
  unitAt, hex, neighbors, step, dist, angleTo, faceIndex, arcOf, inMap, cloudAt, cost,
  isZOC, adjEnemies, losses, points, alive, active, cls, hasLOS, rangeOf, officerAt, key, mulberry32, nearestEnemy
};
if (typeof module !== 'undefined' && module.exports) module.exports = E; else root.E = E;
})(this);
