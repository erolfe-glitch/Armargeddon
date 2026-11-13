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
  BREAK: { A: 0.55, D: 0.58 },   // D höher seit den Aktionspunkten (Angreifer kommt schneller heran)
  TRENCH_DEF: 1.6, CRATER_FIRE: 1.2, VILLAGE_DEF: 1.5, FOREST_DEF: 1.4, WIRE_DEF: 0.6,
  MG_VS_WIRE: 2, MG_VS_CAV: 2,
  AP: 2, MV2: 0.5, ZOC_STOP: 1, GUIDED: 1.25, ORDER_CD: 2, ORDER_MOR: 1.5, ORDER_ATK: 1.25,
  OFFICER_ATK: 1.15, OFFICER_MOR: 0.8, OFFICER_RANGE: 2, RALLY: 0.6,
  RECOVER: 0.5, RECOVER_COVER: 1,
  MAXT: 16, WIN_A: 5, DRAW_A: 4,
  SUPP: 0.6, SUPP_ATK: 0.5,
  ART_MIN: 2, SPOT: 4, SCATTER: 0.25, HE_WIRE: 0.5, HE_CRATER: 0.3, ART_DIRECT: 3, ART_VS_WALKER: 2.5,
  GAS_TTL: 3, GAS_STR: 0.5, GAS_MOR: 1.5, GAS_ATK: 0.7, WIND_SHIFT: 0.15,
  BREAKDOWN: 0.14, STUCK: 0.25, WALKER_FEAR: 1, MELEE_VS_WALKER: 0.4, STORM_VS_WALKER: 1.5,
  CHARGE: 1.5, CHARGE_MIN: 3, CAV_VS_ROUT: 2, FLAME_HIT: 1.5, FLAME_MOR: 2,
  REINF_TURN: 8, LIMBER_MV: 3,
  PTS_TURN: { A: 1, D: 1 }, PTS_KILL: 2, HEAL: 1.5, HEAL_MOR: 1
};

// Größe des Schlachtfelds: hängt von der gewählten Karte ab (useMap), Grauwall 16 × 10
let COLS = 16, ROWS = 10;

const SIDES = {
  A: { name: 'Konkordat von Valmor', short: 'Konkordat', edge: 0, dir: 1 },
  D: { name: 'Aschenwacht des Grauwalls', short: 'Aschenwacht', edge: 15, dir: -1 }
};

const TYPES = {
  kohorte: { side: 'A', name: 'Schützenkohorte', cls: 'inf', atk: 4, def: 4, mor: 7, mv: 3, rng: 2, fs: 2,
    can: 'Schießt 2 Felder weit, stürmt Gräben im Nahkampf, schneidet Draht.',
    real: 'Im Ersten Weltkrieg trugen Infanteristen oft rund 30 kg Ausrüstung in den Angriff, quer durch Schlamm und Trichter.' },
  mahlwerk: { side: 'A', name: 'Mahlwerk-Trupp', cls: 'mg', atk: 2, def: 3, mor: 7, mv: 2, rng: 3, fs: 5, mg: true,
    can: 'Maschinengewehr, 3 Felder weit. Feuert von selbst auf Gegner, die sich im Offenen bewegen. Wer zieht, schießt nicht.',
    real: 'Maschinengewehre wie das britische Vickers oder das deutsche MG 08 schossen rund 450 bis 500 Schuss pro Minute.' },
  haubitze: { side: 'A', name: 'Donnerrohr-Batterie', cls: 'art', limber: true, atk: 0, def: 3, mor: 6, mv: 1, rng: 6, fs: 5, gas: 2,
    can: 'Schießt über eigene Truppen hinweg, wenn eine eigene Einheit das Ziel sieht. Sprenggranaten, Sperrfeuer oder Gas. Aufgeprotzt zieht sie 3 Felder, kann dann aber nicht feuern. Im Nahkampf wehrlos.',
    real: 'Artillerie verursachte im Ersten Weltkrieg die meisten Verluste, nach gängigen Schätzungen deutlich mehr als die Hälfte.' },
  koloss: { side: 'A', name: 'Landkoloss', cls: 'walker', atk: 6, def: 7, mor: 8, mv: 2, rng: 2, fs: 4,
    can: 'Gepanzert: Gewehre und MG prallen ab. Walzt Stacheldraht nieder, überquert Gräben. Bleibt manchmal mit einer Panne liegen.',
    real: 'Die ersten Panzer fuhren im September 1916 an der Somme. Sie waren kaum schneller als ein Fußgänger und fielen oft durch Pannen aus.' },
  reiter: { side: 'A', name: 'Lanzenreiter', cls: 'cav', atk: 5, def: 2, mor: 7, mv: 4, rng: 0, fs: 0,
    can: 'Sehr schnell. Ansturm nach 3 Feldern ×1,5, gegen Fliehende ×2. Kommt nicht durch Draht und Totholz. MG-Feuer trifft doppelt.',
    real: 'Die Kavallerie wartete an der Westfront jahrelang auf den Durchbruch. Gegen Maschinengewehre und Stacheldraht war sie fast machtlos.' },
  grenadier: { side: 'D', name: 'Aschengrenadiere', cls: 'inf', atk: 4, def: 4, mor: 7, mv: 3, rng: 2, fs: 2,
    can: 'Schießt 2 Felder weit, hält Gräben und Ruinen, schneidet Draht.',
    real: 'Gräben verliefen im Zickzack. So konnte ein eingedrungener Gegner nicht den ganzen Graben entlang schießen.' },
  sense: { side: 'D', name: 'Sensenwerk-Trupp', cls: 'mg', atk: 2, def: 3, mor: 7, mv: 2, rng: 3, fs: 5, mg: true,
    can: 'Maschinengewehr, 3 Felder weit. Feuert von selbst auf Gegner, die sich im Offenen bewegen. Wer zieht, schießt nicht.',
    real: 'Am ersten Tag der Somme-Schlacht, dem 1. Juli 1916, hatte die britische Armee rund 57.000 Tote und Verwundete, sehr viele durch MG-Feuer.' },
  geschuetz: { side: 'D', name: 'Grabengeschütz', cls: 'art', limber: true, atk: 0, def: 3, mor: 6, mv: 1, rng: 6, fs: 5, gas: 1,
    can: 'Schießt über eigene Truppen hinweg, wenn eine eigene Einheit das Ziel sieht. Direkter Schuss bis 3 Felder trifft Landkolosse ×2,5. Aufgeprotzt zieht es 3 Felder, kann dann aber nicht feuern. Im Nahkampf wehrlos.',
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
  radler: { side: 'A', name: 'Radfahrer-Trupp', cls: 'inf', fig: 'bike', atk: 3, def: 3, mor: 6, mv: 4, rng: 2, fs: 2,
    can: 'Schnelle Infanterie: zieht 4 Felder, kämpft aber schwächer als die Kohorte. Schlamm, Trichter und Draht bremsen wie bei allen Fußtruppen.',
    real: 'Viele Armeen hatten Radfahrtruppen, etwa britische Cyclist Battalions oder deutsche Radfahr-Kompanien. Auf Straßen waren sie schnell und leise, im Trichterfeld mussten sie schieben.' },
  scharf: { side: 'A', name: 'Scharfschütze', cls: 'inf', fig: 'sniper', pin: true, atk: 1, def: 2, mor: 6, mv: 3, rng: 4, fs: 3,
    can: 'Schießt 4 Felder weit. Jeder Treffer hält das Ziel nieder. Im Nahkampf fast wehrlos.',
    real: 'Scharfschützen mit Zielfernrohr lauerten oft stundenlang getarnt. Schon ein kurz über die Grabenkante gehobener Kopf konnte tödlich sein.' },
  melder: { side: 'A', name: 'Meldegänger mit Hund', cls: 'inf', fig: 'dog', courier: true, atk: 2, def: 2, mor: 7, mv: 5, rng: 0, fs: 0,
    can: 'Schnell (5 Felder). Befehl überbringen: einmal je Runde bekommt eine eigene Einheit bis 3 Felder +1 Aktionspunkt, zum Beispiel für einen weiteren Zug. Kaum Kampfkraft.',
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
  buechse: { side: 'D', name: 'Panzerbüchsen-Trupp', cls: 'inf', fig: 'atr', at: 2, atk: 2, def: 3, mor: 7, mv: 2, rng: 3, fs: 3,
    can: 'Schießt 3 Felder weit. Durchschlägt Panzerung: Beschuss trifft Landkolosse ×2.',
    real: 'Das deutsche Tankgewehr M1918 war die erste Panzerbüchse der Welt. Es verschoss 13-mm-Geschosse und hatte einen sehr starken Rückstoß.' },
  schwer: { side: 'D', name: 'Schwere Grabenwacht', cls: 'inf', fig: 'heavy', atk: 4, def: 5, mor: 8, mv: 2, rng: 2, fs: 2,
    can: 'Infanterie mit Brustpanzer: bessere Abwehr und Moral als Grenadiere, aber nur 2 Felder Bewegung.',
    real: 'Der deutsche Stahlhelm wurde 1916 eingeführt und senkte die Zahl der Kopfverletzungen deutlich. Für Posten gab es zusätzlich eine Stirnplatte.' },
  signal: { side: 'D', name: 'Signaltrupp', cls: 'inf', fig: 'signal', spot: 6, relay: true, atk: 2, def: 2, mor: 7, mv: 3, rng: 0, fs: 0,
    can: 'Lenkt die Artillerie: Auf Felder, die der Trupp sieht (6 Felder weit), streuen Granaten nicht und Sprenggranaten treffen ×1,25. Anführer bis 3 Felder Entfernung dürfen jede Runde einen Befehl geben. Kaum Kampfkraft.',
    real: 'Leuchtpistolen gaben vereinbarte Zeichen an die Artillerie, zum Beispiel für Sperrfeuer. Grabenperiskope erlaubten den Blick über die Brustwehr.' },
  saeger: { side: 'A', name: 'Sägeschreiter', cls: 'walker', fig: 'mechA', mech: true, gat: true, atk: 7, def: 7, mor: 8, mv: 2, rng: 2, fs: 4,
    can: 'Schreitende Kampfmaschine mit Drehlauf-Waffe und Kreissäge. Gepanzert wie ein Landkoloss: Gewehre und MG prallen ab. Bleibt manchmal mit einer Panne liegen.',
    real: 'Auch die Briten bauten keine Schreitmaschinen. Ihr erster Panzer, der Mark I von 1916, hatte acht Mann Besatzung und fuhr etwa so schnell wie ein Fußgänger.' },
  klaue: { side: 'A', name: 'Klauenschreiter', cls: 'walker', fig: 'mechB', mech: true, gat: true, atk: 6, def: 7, mor: 8, mv: 2, rng: 3, fs: 4,
    can: 'Schreitende Kampfmaschine mit Maschinenwaffe und Greifklaue. Gepanzert wie ein Landkoloss: Gewehre und MG prallen ab. Bleibt manchmal mit einer Panne liegen.',
    real: 'Britische Panzer gab es als „Male“ mit Kanonen und als „Female“ nur mit Maschinengewehren. Die MG-Panzer sollten die Kanonenpanzer gegen Infanterie schützen.' },
  stahl: { side: 'A', name: 'Stahlgänger-Trupp', cls: 'inf', fig: 'suitA', mech: true, suit: true, atk: 5, def: 5, mor: 8, mv: 3, rng: 2, fs: 3,
    can: 'Kleiner Trupp in motorisierten Kampfanzügen. Gewehr- und MG-Feuer wirkt nur halb. Stärker als Infanterie, aber kein Koloss: Geschütze und Nahkampf treffen voll.',
    real: 'Motorisierte Kampfanzüge gab es nie. Käuflich war aber Körperpanzer wie der britische „Dayfield Body Shield“, der gegen Splitter half, gegen Gewehrkugeln kaum.' },
  panzerk: { side: 'D', name: 'Panzerknechte', cls: 'inf', fig: 'suitD', mech: true, suit: true, atk: 5, def: 5, mor: 8, mv: 3, rng: 2, fs: 3,
    can: 'Kleiner Trupp in motorisierten Kampfanzügen. Gewehr- und MG-Feuer wirkt nur halb. Stärker als Infanterie, aber kein Koloss: Geschütze und Nahkampf treffen voll.',
    real: 'Motorisierte Kampfanzüge gab es nie. Der deutsche Grabenpanzer aus Stahlplatten wog rund zehn Kilogramm und wurde vor allem von Posten und MG-Schützen getragen.' },
  flammen: { side: 'A', name: 'Flammentrupp', cls: 'flame', fig: 'flamer', atk: 2, def: 3, mor: 7, mv: 2, rng: 1, fs: 7, flame: true,
    can: 'Flammenstrahl auf ein Nachbarfeld. Deckung schützt nicht, doppelter Moralverlust. Wird er beschossen, trifft es ihn ×1,5.',
    real: 'Auch die Briten setzten Flammenwerfer ein. An der Somme wurden 1916 riesige fest eingebaute Livens-Flammenwerfer unter dem Niemandsland vorgeschoben.' },
  schildwall: { side: 'A', name: 'Schildwall', cls: 'inf', fig: 'shieldA', atk: 4, def: 6, mor: 8, mv: 2, rng: 0, fs: 0,
    can: 'Schwer gepanzert und langsam. Gut, um Gräben und Ruinen zu halten, die man genommen hat. Keine Schusswaffe.',
    real: 'Beide Seiten erprobten Stahlschilde und Körperpanzer. Sie waren schwer und schützten vor allem gegen Splitter, kaum gegen Gewehrkugeln aus der Nähe.' },
  feldkanone: { side: 'A', name: 'Feldkanone', cls: 'art', fig: 'fgun', limber: true, atk: 0, def: 3, mor: 6, mv: 1, rng: 5, fs: 5,
    can: 'Leichtes Geschütz: 5 Felder Reichweite, kein Gas. Direkter Schuss bis 3 Felder trifft Kolosse und Kampfmaschinen ×2,5. Aufgeprotzt zieht sie 3 Felder. Im Nahkampf wehrlos.',
    real: 'Die britische 18-Pfünder-Feldkanone war das wichtigste Geschütz der britischen Armee. Bis 1918 verschoss sie rund 100 Millionen Granaten.' },
  fernsprech: { side: 'A', name: 'Fernsprechtrupp', cls: 'inf', fig: 'phone', spot: 6, relay: true, atk: 2, def: 2, mor: 7, mv: 3, rng: 0, fs: 0,
    can: 'Lenkt die Artillerie: Auf Felder, die der Trupp sieht (6 Felder weit), streuen Granaten nicht und Sprenggranaten treffen ×1,25. Anführer bis 3 Felder Entfernung dürfen jede Runde einen Befehl geben.',
    real: 'Feldtelefone verbanden die Gräben mit den Batterien. Die Leitungen wurden tief eingegraben, rissen im Trommelfeuer aber trotzdem ständig.' },
  grabenk: { side: 'D', name: 'Grabenkämpfer', cls: 'storm', fig: 'brawler', atk: 6, def: 3, mor: 8, mv: 3, rng: 0, fs: 0,
    can: 'Nahkämpfer mit Grabenschwert und Keule. Sickert durch: Gegner halten ihn nicht auf. Handgranaten heben den Grabenschutz auf.',
    real: 'Deutsche Stoßtrupps trugen für den Grabenkampf Handgranaten, Pistolen, Grabendolche und geschärfte Spaten statt langer Gewehre.' },
  ritter: { side: 'D', name: 'Kettenritter', cls: 'inf', fig: 'knight', suit: true, atk: 5, def: 6, mor: 9, mv: 2, rng: 0, fs: 0,
    can: 'Gepanzerter Nahkämpfer mit Axt und Stachelschild. Gewehr- und MG-Feuer wirkt nur halb. Langsam, keine Schusswaffe.',
    real: 'Ritterrüstungen gab es im Ersten Weltkrieg nicht. Echte Körperpanzer wogen um die zehn Kilogramm und schützten nur Brust und Bauch.' },
  pionierD: { side: 'D', name: 'Drahtpioniere', cls: 'inf', fig: 'sapperD', wirelayer: true, atk: 3, def: 3, mor: 7, mv: 3, rng: 2, fs: 2,
    can: 'Zieht Stacheldraht: legt einen Drahtgürtel auf das freie Feld, in das er blickt. Danach kein Angriff mehr in der Runde.',
    real: 'Drahtverhaue wurden meist nachts gebaut. Arbeitstrupps schraubten Eisenpfähle in den Boden und spannten Rollen Stacheldraht dazwischen.' },
  banner: { side: 'D', name: 'Bannerträger', cls: 'inf', fig: 'banner', banner: true, atk: 3, def: 3, mor: 9, mv: 3, rng: 1, fs: 2,
    can: 'Eigene Truppen bis 2 Felder verlieren weniger Moral (×0,75) und erholen sich jede Runde um 0,5 Moral mehr.',
    real: 'Im Ersten Weltkrieg trugen Regimenter ihre Fahnen kaum noch ins Gefecht. Sie waren zu auffällig und wurden ab 1914 meist hinter der Front verwahrt.' },
  hauptA: { side: 'A', name: 'Hauptmann mit Stab', cls: 'inf', fig: 'leader1', cmd: 1, atk: 3, def: 3, mor: 9, mv: 3, rng: 2, fs: 2,
    can: 'Kommandotrupp: gibt jede zweite Runde einen Befehl („Sammeln“ oder „Sturmbefehl“) an alle eigenen Truppen bis 2 Felder. Eigene Truppen in der Nähe verlieren weniger Moral und sammeln sich eher.',
    real: 'Ein Hauptmann führte eine Kompanie von rund 200 Mann. Die Verluste unter jungen Offizieren waren sehr hoch, weil sie beim Angriff vorangingen.' },
  generalA: { side: 'A', name: 'General mit Stab', cls: 'inf', fig: 'leader4', cmd: 2, atk: 2, def: 3, mor: 10, mv: 3, rng: 1, fs: 1,
    can: 'Kommandotrupp: gibt jede Runde einen Befehl an alle eigenen Truppen bis 3 Felder. Höchstens einer je Armee. Schwach im Kampf, sein Verlust wiegt schwer.',
    real: 'Generäle führten meist aus Hauptquartieren weit hinter der Front, verbunden über Telefon und Meldegänger. Trotzdem fielen im Ersten Weltkrieg über 70 britische Generäle.' },
  hauptD: { side: 'D', name: 'Hauptmann mit Stab', cls: 'inf', fig: 'leader1', cmd: 1, atk: 3, def: 3, mor: 9, mv: 3, rng: 2, fs: 2,
    can: 'Kommandotrupp: gibt jede zweite Runde einen Befehl („Sammeln“ oder „Sturmbefehl“) an alle eigenen Truppen bis 2 Felder. Eigene Truppen in der Nähe verlieren weniger Moral und sammeln sich eher.',
    real: 'In der deutschen Armee führte ein Hauptmann meist eine Kompanie. Ab 1916 übernahmen oft Leutnants diese Aufgabe, weil zu viele Offiziere gefallen waren.' },
  generalD: { side: 'D', name: 'General mit Stab', cls: 'inf', fig: 'leader4', cmd: 2, atk: 2, def: 3, mor: 10, mv: 3, rng: 1, fs: 1,
    can: 'Kommandotrupp: gibt jede Runde einen Befehl an alle eigenen Truppen bis 3 Felder. Höchstens einer je Armee. Schwach im Kampf, sein Verlust wiegt schwer.',
    real: 'Deutsche Divisionen wurden von Generalmajoren geführt. Die Stäbe arbeiteten mit Karten, Telefon und Luftbildern meist mehrere Kilometer hinter der Front.' },
  knecht: { side: 'D', name: 'Eisenknecht', cls: 'walker', fig: 'mech', mech: true, atk: 6, def: 6, mor: 8, mv: 2, rng: 2, fs: 4,
    can: 'Schreitende Kampfmaschine mit Sturmkanone. Gepanzert wie ein Landkoloss: Gewehre und MG prallen ab. Bleibt manchmal mit einer Panne liegen.',
    real: 'Schreitende Kampfmaschinen gab es nie. Der einzige deutsche Panzer des Krieges, der A7V, wurde nur 20-mal gebaut und hatte 18 Mann Besatzung.' },
  bohrer: { side: 'D', name: 'Bohrkoloss', cls: 'walker', fig: 'drill', mech: true, atk: 8, def: 7, mor: 8, mv: 2, rng: 0, fs: 0,
    can: 'Kampfmaschine mit Bohrkopf, nur für den Nahkampf. Sehr stark gegen alles, was er erreicht. Bleibt manchmal mit einer Panne liegen.',
    real: 'Unter der Erde tobte ein Minenkrieg. Bei Messines zündeten die Briten am 7. Juni 1917 neunzehn Minen unter den deutschen Stellungen.' }
});
// Nachschub: Kosten in Punkten und Angebot je Seite
const COST = { kohorte: 3, mahlwerk: 4, feldscher: 3, moerser: 4, reiter: 4, haubitze: 6, koloss: 7,
  grenadier: 3, sense: 4, heiler: 3, minenwerfer: 4, brand: 5, sturm: 6, geschuetz: 6,
  radler: 3, melder: 2, scharf: 4, pionier: 3, raeumer: 4, signal: 2, schild: 4, buechse: 5, schwer: 4, knecht: 9, bohrer: 9, saeger: 8, klaue: 8, stahl: 6, panzerk: 6,
  hauptA: 4, generalA: 7, hauptD: 4, generalD: 7, flammen: 4, schildwall: 3, feldkanone: 5, fernsprech: 2, grabenk: 5, ritter: 6, pionierD: 3, banner: 4 };
// Kurze Schlagworte zu den Besonderheiten, für die Einheitenkarte
const SPECIALS = {"kohorte": ["Schneidet Draht", "Schuss 2 Felder"], "grenadier": ["Schneidet Draht", "Schuss 2 Felder"], "mahlwerk": ["Reaktionsfeuer", "Zieht oder schießt"], "sense": ["Reaktionsfeuer", "Zieht oder schießt"], "haubitze": ["Feuert über Truppen", "Gas und Sperrfeuer", "Aufprotzen"], "geschuetz": ["Feuert über Truppen", "Direktschuss ×2,5 auf Kolosse", "Aufprotzen"], "koloss": ["Gepanzert", "Walzt Draht nieder", "Pannen"], "reiter": ["Ansturm ×1,5", "Kein Draht, kein Totholz"], "sturm": ["Sickert durch", "Handgranaten", "×1,5 gegen Kolosse"], "brand": ["Flammenstrahl", "Deckung schützt nicht"], "feldscher": ["Versorgt einen Nachbarn"], "heiler": ["Versorgt einen Nachbarn"], "moerser": ["Ziehen und feuern", "Steilfeuer 4 Felder"], "minenwerfer": ["Ziehen und feuern", "Steilfeuer 4 Felder"], "radler": ["Zieht 4 Felder"], "scharf": ["Schuss 4 Felder", "Hält das Ziel nieder"], "melder": ["Befehl überbringen: +1 Aktionspunkt", "Zieht 5 Felder"], "signal": ["Lenkt Artillerie: ×1,25, keine Streuung", "Sieht 6 Felder", "Anführer befehlen jede Runde"], "pionier": ["Draht schneiden und angreifen", "×1,5 gegen Kolosse"], "raeumer": ["Sickert durch", "Handgranaten", "×1,5 gegen Kolosse"], "schild": ["Sehr zäh", "Keine Schusswaffe"], "buechse": ["Schuss 3 Felder", "×2 gegen Kolosse"], "schwer": ["Brustpanzer", "Langsam"], "knecht": ["Gepanzert", "Sturmkanone", "Pannen"], "klaue": ["Gepanzert", "Maschinenwaffe", "Pannen"], "stahl": ["Kampfanzug: Beschuss ×0,5", "Schuss 2 Felder"], "flammen": ["Flammenstrahl", "Deckung schützt nicht"], "schildwall": ["Sehr zäh", "Keine Schusswaffe"], "feldkanone": ["Reichweite 5", "Direktschuss ×2,5 auf Kolosse", "Aufprotzen"], "fernsprech": ["Lenkt Artillerie: ×1,25, keine Streuung", "Sieht 6 Felder", "Anführer befehlen jede Runde"], "grabenk": ["Sickert durch", "Handgranaten"], "ritter": ["Rüstung: Beschuss ×0,5", "Keine Schusswaffe"], "pionierD": ["Zieht Stacheldraht", "Schuss 2 Felder"], "banner": ["Moralverlust ×0,75 in 2 Feldern", "Erholung +0,5"], "hauptA": ["Befehl alle 2 Runden, 2 Felder"], "hauptD": ["Befehl alle 2 Runden, 2 Felder"], "generalA": ["Befehl jede Runde, 3 Felder", "Höchstens einer"], "generalD": ["Befehl jede Runde, 3 Felder", "Höchstens einer"], "panzerk": ["Kampfanzug: Beschuss ×0,5", "Schuss 2 Felder"], "bohrer": ["Gepanzert", "Nur Nahkampf", "Pannen"], "saeger": ["Gepanzert", "Maschinenwaffe und Säge", "Pannen"]};
for (const t in SPECIALS) TYPES[t].sp = SPECIALS[t];
const SHOP = { A: ['hauptA', 'generalA', 'kohorte', 'radler', 'melder', 'fernsprech', 'feldscher', 'pionier', 'scharf', 'schildwall', 'mahlwerk', 'moerser', 'reiter', 'raeumer', 'flammen', 'feldkanone', 'haubitze', 'koloss', 'stahl', 'saeger', 'klaue'],
  D: ['hauptD', 'generalD', 'grenadier', 'signal', 'heiler', 'pionierD', 'schwer', 'schild', 'banner', 'buechse', 'sense', 'grabenk', 'ritter', 'minenwerfer', 'brand', 'sturm', 'geschuetz', 'panzerk', 'knecht', 'bohrer'] };

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
  bridge:  { name: 'Brücke', cost: 1, info: 'Einziger Weg über den Kanal. Zu schwach für Landkolosse.' },
  furt:    { name: 'Furt', cost: 3, info: 'Seichtes Wasser: kostet 3 Bewegung, Abwehr ×0,8. Geschütze kommen nicht durch.',
             real: 'Flüsse waren Hindernisse. Im Oktober 1914 öffneten die Belgier an der Yser die Schleusen und setzten das Land unter Wasser, um den deutschen Vormarsch zu stoppen.' },
  sumpf:   { name: 'Sumpf', cost: 3, info: 'Kostet 3 Bewegung. Kolosse bleiben oft stecken, Geschütze kommen nicht durch.',
             real: 'Zerschossene Entwässerungsgräben machten Flandern 1917 zum Sumpf. Bei Passchendaele blieben Panzer reihenweise stecken.' },
  wald:    { name: 'Dichter Wald', cost: 3, info: 'Kostet 3 Bewegung. Abwehr ×1,5. Versperrt die Sicht. Reiter, Geschütze und Kolosse kommen nicht durch.',
             real: 'Im Argonnerwald kämpften Franzosen und Deutsche jahrelang auf engem Raum, oft mit Minen und Handgranaten.' },
  waldweg: { name: 'Waldweg', cost: 1, info: 'Schneise durch den Wald: kostet 1 Bewegung, auch für Geschütze und Kolosse. Abwehr ×1,2.',
             real: 'Nachschub lief über Feldbahnen und Bohlenwege. Ohne sie versank im Herbst alles im Schlamm.' },
  bunker:  { name: 'Betonbunker', cost: 1, info: 'Abwehr ×2 gegen alles. Halber Moralverlust.',
             real: 'Ab 1917 bauten die Deutschen in Flandern Unterstände aus Stahlbeton. Die Briten nannten sie „Pillboxes“.' },
  fabrik:  { name: 'Fabrikruine', cost: 2, info: 'Kostet 2 Bewegung. Abwehr ×1,7. Versperrt die Sicht.',
             real: 'Bei Loos kämpften Briten und Deutsche 1915 im Kohlerevier um Zechen, Fördertürme und Abraumhalden.' },
  kirche:  { name: 'Kirchenruine', cost: 1, info: 'Abwehr ×1,5. Versperrt die Sicht. Vom Turm sieht man 6 Felder weit.',
             real: 'Kirchtürme waren begehrte Beobachtungsposten und wurden deshalb gezielt beschossen. In Albert hing die vergoldete Madonna jahrelang schief vom zerschossenen Turm.' },
  barrikade: { name: 'Barrikade', cost: 2, info: 'Kostet 2 Bewegung. Abwehr ×1,6 von allen Seiten. Reiter kommen nicht durch.',
             real: 'In umkämpften Dörfern sperrten Soldaten die Straßen mit Schutt, Möbeln, Karren und Sandsäcken.' },
  bahn:    { name: 'Bahndamm', cost: 1, info: 'Abwehr ×1,3 gegen Beschuss. Fester Untergrund: Kolosse kommen gut voran.',
             real: 'Eisenbahnen brachten Truppen und Granaten an die Front. Bahndämme dienten oft als Deckung.' }
};

const GRAUWALL_OBJ = [
  { id: 'veskar', name: 'Ruinen von Veskar', c: 15, r: 4, pts: 2 },
  { id: 'schanze', name: 'Grauwall-Schanze', c: 13, r: 6, pts: 2 },
  { id: 'totholz', name: 'Totholz von Ilm', c: 17, r: 1, pts: 3 },
  { id: 'marn', name: 'Brücke von Marn', c: 18, r: 9, pts: 2 }
];

const GRAUWALL_SETUP = [
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
const GRAUWALL_REINF = [['sturm', 19, 2], ['sturm', 19, 4, 'Sturmführer Kael'], ['sturm', 19, 6], ['brand', 19, 3], ['brand', 19, 5], ['geschuetz', 18, 5]];

function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// ---------- Karte ----------
function buildGrauwall(seed) {
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
  for (const o of GRAUWALL_OBJ) M[o.c][o.r].obj = o.id;
  return M;
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
    many: (list, t) => { for (const [c, r] of list) T.set(c, r, t); }
  };
  return T;
}
const MAPS = {
  grauwall: { id: 'grauwall', name: 'Der Grauwall', size: 'Klassisch', cols: 16, rows: 10, zoneA: 2, zoneD: 7,
    desc: 'Die erste Schlacht: Niemandsland, zwei Grabenlinien, Kanal mit Brücke. Zur Mitte der Schlacht kommt der Gegenstoß.',
    maxT: 14, reinfTurn: 7, winA: 5, drawA: 4, armyMax: { A: 22, D: 18 },
    objectives: [
      { id: 'veskar', name: 'Ruinen von Veskar', c: 12, r: 4, pts: 2 },
      { id: 'schanze', name: 'Grauwall-Schanze', c: 10, r: 5, pts: 2 },
      { id: 'totholz', name: 'Totholz von Ilm', c: 14, r: 1, pts: 3 },
      { id: 'marn', name: 'Brücke von Marn', c: 15, r: 8, pts: 2 }],
    army: { A: { kohorte: 7, mahlwerk: 3, koloss: 3, haubitze: 2, reiter: 2 }, D: { grenadier: 7, sense: 4, geschuetz: 2 } },
    reinf: ['sturm', 'sturm', 'brand', 'sturm', 'brand', 'geschuetz'],
    build: () => {
      const T = mapTools(16, 10, 1917);
      T.line(2, 0, 9, 'trench');
      T.field(3, 4, 0, 9, [['crater', 0.3], ['mud', 0.16]]);
      T.line(5, 0, 9, 'wire', [2, 7]); T.line(6, 0, 9, 'wire', [4, 8]);
      T.line(7, 0, 9, 'trench');
      T.field(8, 8, 0, 9, [['crater', 0.25]]);
      T.line(9, 0, 9, 'wire', [1, 5, 8]);
      T.line(10, 0, 9, 'trench');
      T.ridge(11, 13, 3, 5);
      T.many([[12, 4], [12, 3], [13, 4]], 'village');
      T.many([[13, 0], [14, 0], [14, 1], [15, 1], [13, 1]], 'forest');
      T.line(14, 6, 9, 'canal'); T.set(14, 8, 'bridge');
      T.many([[15, 7], [15, 8]], 'village');
      return T.M;
    } },
  selm: { id: 'selm', name: 'Die Ruinen von Selm', size: 'Klein', cols: 14, rows: 11, zoneA: 2, zoneD: 5,
    desc: 'Kurz und hart: ein Graben, ein Drahtgürtel, drei kleine Ziele dicht hinter der Front. Siegen kann nur, wer den Kirchhügel nimmt.',
    maxT: 12, reinfTurn: 6, winA: 5, drawA: 3, armyMax: { A: 20, D: 16 },
    objectives: [
      { id: 'nordhof', name: 'Nordgehöft', c: 7, r: 1, pts: 1 },
      { id: 'kreuz', name: 'Kreuzung von Selm', c: 7, r: 5, pts: 1 },
      { id: 'suedwald', name: 'Südwald', c: 8, r: 9, pts: 1 },
      { id: 'kirche', name: 'Kirchhügel', c: 12, r: 5, pts: 3 }],
    army: { A: { kohorte: 6, mahlwerk: 2, koloss: 2, haubitze: 2, reiter: 3, feldscher: 1 }, D: { grenadier: 6, sense: 4, geschuetz: 2, heiler: 1 } },
    reinf: ['sturm', 'sturm', 'brand'],
    build: () => {
      const T = mapTools(14, 11, 1871);
      T.line(1, 0, 10, 'trench');
      T.field(2, 3, 0, 10, [['crater', 0.3], ['mud', 0.16]]);
      T.many([[3, 7], [3, 8], [2, 8]], 'sumpf');
      T.line(4, 0, 10, 'wire', [2, 5, 8]);
      T.line(5, 0, 10, 'trench');
      T.field(6, 8, 0, 10, [['crater', 0.14]]);
      T.many([[7, 1], [8, 1], [7, 2]], 'village');
      T.set(7, 5, 'village'); T.set(8, 5, 'fabrik'); T.set(7, 6, 'barrikade');
      T.blob(8, 9, 1, 'forest');
      T.line(9, 0, 10, 'wire', [1, 4, 7, 10]);
      T.line(10, 0, 10, 'trench'); T.set(10, 3, 'bunker'); T.set(10, 7, 'bunker');
      T.ridge(11, 13, 4, 6);
      T.set(12, 5, 'kirche'); T.many([[12, 6], [13, 5]], 'village');
      T.blob(13, 1, 1, 'forest');
      T.line(13, 8, 10, 'bahn');
      return T.M;
    } },
  lerne: { id: 'lerne', name: 'Das Tal der Lerne', size: 'Mittel', cols: 18, rows: 13, zoneA: 2, zoneD: 7,
    desc: 'Mühle, Bahnhof und Kalkwald vorn, die Nordbrücke über den Kanal und die Höhe 304 im Rücken. Mehrere Wege, mehrere Schwerpunkte.',
    maxT: 16, reinfTurn: 8, winA: 6, drawA: 5, armyMax: { A: 26, D: 24 },
    objectives: [
      { id: 'muehle', name: 'Lerner Mühle', c: 8, r: 2, pts: 1 },
      { id: 'bahnhof', name: 'Bahnhof Lerne', c: 9, r: 6, pts: 2 },
      { id: 'kalkwald', name: 'Kalkwald', c: 10, r: 10, pts: 2 },
      { id: 'nordbruecke', name: 'Nordbrücke', c: 13, r: 3, pts: 2 },
      { id: 'hoehe', name: 'Höhe 304', c: 16, r: 7, pts: 3 }],
    army: { A: { kohorte: 10, mahlwerk: 3, koloss: 3, haubitze: 3, reiter: 2, feldscher: 1, moerser: 1 }, D: { grenadier: 11, sense: 6, geschuetz: 3, heiler: 1, minenwerfer: 1 } },
    reinf: ['sturm', 'sturm', 'brand', 'sturm', 'geschuetz'],
    build: () => {
      const T = mapTools(18, 13, 1916);
      T.line(2, 0, 12, 'trench');
      T.field(3, 5, 0, 12, [['crater', 0.32], ['mud', 0.2]]);
      T.line(6, 0, 12, 'wire', [2, 6, 10]);
      T.line(7, 0, 12, 'trench');
      T.field(8, 9, 0, 12, [['crater', 0.16]]);
      T.set(8, 2, 'fabrik'); T.many([[8, 1], [9, 2]], 'village');
      T.many([[9, 5], [10, 6]], 'village'); T.set(9, 6, 'village'); T.line(9, 7, 12, 'bahn');
      T.blob(10, 10, 1, 'wald'); T.many([[10, 9], [10, 10], [10, 11]], 'waldweg');
      T.line(11, 5, 12, 'wire', [7, 10]);
      T.line(12, 4, 12, 'trench');
      T.many([[11, 1], [12, 1], [12, 2]], 'sumpf');
      T.line(13, 0, 5, 'canal'); T.set(13, 3, 'bridge'); T.set(13, 5, 'furt');
      T.line(14, 0, 4, 'trench', [3]);
      T.line(15, 5, 10, 'trench');
      T.ridge(15, 16, 6, 9);
      T.set(16, 7, 'kirche'); T.set(15, 6, 'bunker'); T.set(15, 9, 'bunker'); T.many([[16, 8], [17, 7]], 'village');
      T.blob(17, 1, 1, 'forest'); T.blob(17, 11, 1, 'forest');
      return T.M;
    } },
  front: { id: 'front', name: 'Die Grauwall-Front', size: 'Groß', cols: 22, rows: 16, zoneA: 2, zoneD: 9,
    desc: 'Die ganze Front: mehrere Grabensysteme, zwei Vorposten, der Kreuzhof, Wald und Kanalschleuse, dahinter die Feste Grauwall. Lange Schlacht.',
    maxT: 18, reinfTurn: 9, winA: 8, drawA: 6, armyMax: { A: 34, D: 32 },
    objectives: [
      { id: 'kessel', name: 'Vorposten Kessel', c: 10, r: 3, pts: 1 },
      { id: 'brand', name: 'Gehöft Brand', c: 10, r: 12, pts: 2 },
      { id: 'kreuzhof', name: 'Kreuzhof', c: 13, r: 8, pts: 2 },
      { id: 'schwarzwald', name: 'Schwarzwäldchen', c: 15, r: 2, pts: 2 },
      { id: 'schleuse', name: 'Kanalschleuse', c: 17, r: 13, pts: 2 },
      { id: 'feste', name: 'Feste Grauwall', c: 19, r: 7, pts: 3 }],
    army: { A: { kohorte: 11, mahlwerk: 4, koloss: 4, haubitze: 4, reiter: 3, feldscher: 2, moerser: 1 }, D: { grenadier: 13, sense: 8, geschuetz: 4, heiler: 1, minenwerfer: 2 } },
    reinf: ['sturm', 'sturm', 'sturm', 'brand', 'brand', 'geschuetz', 'geschuetz'],
    build: () => {
      const T = mapTools(22, 16, 1918);
      T.line(2, 0, 15, 'trench');
      T.field(3, 6, 0, 15, [['crater', 0.32], ['mud', 0.2]]);
      T.many([[4, 11], [5, 12], [4, 12], [4, 3], [5, 3]], 'sumpf');
      T.line(7, 0, 15, 'wire', [2, 6, 10, 13]);
      T.line(8, 0, 15, 'wire', [4, 8, 12]);
      T.line(9, 0, 15, 'trench');
      T.field(10, 12, 0, 15, [['crater', 0.15], ['mud', 0.05]]);
      T.set(10, 3, 'barrikade'); T.many([[11, 3], [10, 2]], 'village');
      T.set(10, 12, 'fabrik'); T.set(11, 12, 'village');
      T.line(12, 0, 6, 'bahn');
      T.many([[13, 8], [14, 8], [13, 9]], 'village'); T.set(13, 7, 'kirche'); T.set(12, 8, 'barrikade');
      T.line(14, 4, 15, 'wire', [6, 10, 13]);
      T.line(15, 4, 15, 'trench');
      T.blob(15, 2, 1, 'wald'); T.many([[16, 1], [14, 1], [16, 2]], 'wald'); T.line(15, 0, 3, 'waldweg');
      T.line(17, 10, 15, 'canal'); T.set(17, 13, 'bridge'); T.set(17, 15, 'furt');
      T.line(18, 10, 15, 'trench', [13]); T.line(18, 3, 9, 'trench');
      T.ridge(18, 20, 6, 9);
      T.many([[19, 7], [19, 8], [20, 7], [20, 8]], 'village'); T.set(18, 6, 'bunker'); T.set(18, 9, 'bunker');
      T.blob(20, 1, 1, 'forest'); T.blob(21, 14, 1, 'forest');
      return T.M;
    } }
};
let MAP = MAPS.grauwall, OBJECTIVES = MAPS.grauwall.objectives, SETUP = null, REINF = MAPS.grauwall.reinf;
function useMap(id) {
  MAP = MAPS[id] || MAPS.grauwall;
  COLS = MAP.cols; ROWS = MAP.rows; OBJECTIVES = MAP.objectives; SETUP = MAP.setup || null; REINF = MAP.reinf;
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
// Aktionspunkte: jede Einheit hat je Runde P.AP (2). Ziehen 1, Schießen 1 (MG 2), Steilfeuer 2 (Mörser 1), Nahkampf alle,
// Befehl, Versorgen, Draht 1. Je Runde höchstens ein Angriff. `moved` heißt: keine Punkte mehr zum Ziehen.
function spend(u, n) { u.ap = Math.max(0, (u.ap || 0) - n); u.moved = u.ap <= 0; }
function addUnit(G, type, c, r, officer) {
  const T = TYPES[type];
  const u = { id: G.nextId++, type, side: T.side, c, r, officer: officer || (T.cmd === 2 ? 'General' : T.cmd ? 'Hauptmann' : null), ap: P.AP,
    str: 10, mor: T.mor, face: T.side === 'A' ? 0 : 3, status: 'ok',
    moved: false, attacked: false, react: true, supp: 0, fireDmg: 0, turnOnly: false,
    run: 0, broken: 0, gassed: false, seenWalker: false, limbered: false, gas: T.gas || 0, startC: c, startR: r };
  G.units.push(u);
  return u;
}
// ---------- Armee-Auswahl ----------
// Jede Seite darf vor der Schlacht für den Wert der Standardarmee selbst Truppen wählen.
function defaultArmy(side) { if (MAP.army) return Object.assign({}, MAP.army[side]); const a = {}; for (const s of SETUP) if (TYPES[s[0]].side === side) a[s[0]] = (a[s[0]] || 0) + 1; return a; }
function armyCost(army) { let n = 0; for (const t in army) n += (COST[t] || 0) * army[t]; return n; }
function armyCount(army) { let n = 0; for (const t in army) n += army[t]; return n; }
const ARMY_BUDGET = {}, ARMY_MAX = {};   // je Karte, siehe armySync()
function armySync() { for (const sd of ['A', 'D']) { ARMY_BUDGET[sd] = armyCost(defaultArmy(sd)); ARMY_MAX[sd] = MAP.armyMax[sd]; } ARMY_CAP = COLS * ROWS > 300 ? 16 : COLS * ROWS > 200 ? 13 : 9; ARMY_WALKERS = COLS * ROWS > 300 ? 7 : COLS * ROWS > 200 ? 5 : 4; }
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
  if ((army.generalA || 0) + (army.generalD || 0) > 1 || (army.hauptA || 0) + (army.hauptD || 0) > 3) return false;
  return armyCost(army) <= ARMY_BUDGET[side] && n >= ARMY_MIN[side] && n <= ARMY_MAX[side];
}
function rowsOut() { const m = Math.floor(ROWS / 2), out = [m]; for (let k = 2; out.length < ROWS; k += 2) { for (const r of [m - k, m + k]) if (r >= 0 && r < ROWS) out.push(r); if (k > ROWS) break; } for (let r = 0; r < ROWS; r++) if (!out.includes(r)) out.push(r); return out; }
function deploy(G, side, army) {
  // Reihenfolge: Typen abwechselnd, damit sich die Truppen über die Front verteilen
  const left = Object.assign({}, army), list = [];
  for (let more = true; more;) { more = false; for (const t of ROSTER[side]) if (left[t] > 0) { left[t]--; list.push(t); more = true; } }
  const names = side === 'A' ? ['Prätor Hask', 'Hauptfrau Morn', 'Legat Corvin'] : ['Hauptmann Veyl', 'Kastellan Orsk', 'Major Dresk'];
  if (COLS * ROWS < 400) names.pop();
  const ROWS_OUT = rowsOut(), zA = MAP.zoneA;
  const lead = t => { const T = TYPES[t]; return (T.cls === 'inf' || T.cls === 'storm') && !T.relay && !T.pin && names.length ? names.shift() : null; };
  const free = (t, c, r) => inMap(c, r) && !unitAt(G, c, r) && cost(G, { type: t, side }, c, r) < 99;
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

// Verteidiger auf neuen Karten: Besatzung für jedes Zielfeld, MG in die vorderen Gräben, Geschütze nach hinten,
// alles mit Abstand, damit die ganze Front besetzt ist.
function deployD(G, list, lead, free) {
  const zD = MAP.zoneD, depth = COLS - zD, placed = [];
  const role = t => { const T = TYPES[t]; return T.cls === 'art' && !T.mobile ? 'art' : (T.cls === 'medic' || T.relay || T.mobile) ? 'back' : T.mg ? 'mg' : 'inf'; };
  const objs = OBJECTIVES.slice().sort((a, b) => b.pts - a.pts || a.c - b.c);
  const score = (t, c, r) => {
    const h = G.map[c][r], rl = role(t), d = (c - zD) / depth;
    let v = { trench: 3, village: 2.6, forest: 2, crater: 0.6, open: 0, mud: -1, wire: -4, bridge: 1, bunker: 3.6, fabrik: 3, kirche: 2.8, barrikade: 2.8, wald: 2.2, waldweg: 0.8, bahn: 1, furt: -2, sumpf: -2 }[h.t] || 0;
    if (h.ridge) v += 1;
    for (const o of objs) { const dd = dist(c, r, o.c, o.r); if (dd === 0) v += rl === 'art' ? -2 : 4; else if (dd === 1) v += 1.2; }
    if (rl === 'art') v += d * 6 - (d < 0.45 ? 5 : 0);
    else if (rl === 'back') v += d * 3;
    else if (rl === 'mg') v += (1 - d) * 3;
    else v += (1 - d) * 1.2;
    for (const p of placed) { const dd = dist(c, r, p[0], p[1]); if (dd <= 1) v -= 3.2; else if (dd === 2) v -= 1.2; else if (dd === 3) v -= 0.3; }
    return v;
  };
  const order = list.slice().sort((a, b) => ({ inf: 0, mg: 1, back: 2, art: 3 }[role(a)] - { inf: 0, mg: 1, back: 2, art: 3 }[role(b)]));
  // zuerst je Zielfeld eine Infanterie
  for (const o of objs) { const i = order.findIndex(t => role(t) === 'inf'); if (i < 0 || !free(order[i], o.c, o.r)) continue; const t = order.splice(i, 1)[0]; addUnit(G, t, o.c, o.r, lead(t)); placed.push([o.c, o.r]); }
  for (const t of order) {
    let best = null, bv = -1e9;
    for (let c = zD; c < COLS; c++) for (let r = 0; r < ROWS; r++) { if (!free(t, c, r)) continue; const v = score(t, c, r); if (v > bv) { bv = v; best = [c, r]; } }
    if (best) { addUnit(G, t, best[0], best[1], lead(t)); placed.push(best); }
  }
}

function newGame(opts) {
  opts = opts || {};
  useMapArmy(opts.map);
  const G = {
    mapId: MAP.id, maxT: MAP.maxT || P.MAXT, winA: MAP.winA || P.WIN_A, drawA: MAP.drawA || P.DRAW_A, reinfTurn: MAP.reinfTurn || P.REINF_TURN,
    map: buildMap(), units: [], turn: 1, side: 'A', over: null,
    rng: mulberry32(opts.seed != null ? opts.seed : (Date.now() & 0xffffffff)),
    ctrl: {}, nextId: 1, clouds: [], wind: 1, reinfDone: false, pts: { A: 0, D: 0 }, mechs: !!opts.mechs
  };
  for (const o of OBJECTIVES) G.ctrl[o.id] = 'D';
  for (const side of ['A', 'D']) {
    const army = opts.army && opts.army[side];
    if (army && armyOk(side, army, !!opts.mechs)) deploy(G, side, army);
    else if (SETUP) { for (const s of SETUP) if (TYPES[s[0]].side === side) addUnit(G, s[0], s[1], s[2], s[3]); }
    else deploy(G, side, defaultArmy(side));
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
function bannerAt(G, side, c, r) { return G.units.some(o => TYPES[o.type].banner && o.side === side && active(o) && dist(o.c, o.r, c, r) <= 2); }
function officerAt(G, side, c, r) {
  return G.units.some(o => o.officer && o.side === side && active(o) && dist(o.c, o.r, c, r) <= cmdRange(o));
}
function arcOf(G, d, ac, ar) {
  const diff = angDiff(angleTo(d.c, d.r, ac, ar), d.face * 60);
  return diff <= 61 ? 'front' : diff <= 121 ? 'flank' : 'rear';
}

// ---------- Bewegung ----------
function cost(G, u, c, r) {
  const t = hex(G, c, r).t, k = cls(u);
  if (t === 'canal') return 99;
  if (k === 'cav') { if (t === 'wire' || t === 'forest' || t === 'wald' || t === 'barrikade') return 99; if (t === 'crater' || t === 'trench') return 3; }
  if (k === 'walker') { if (t === 'forest' || t === 'bridge' || t === 'wald') return 99; if (t === 'crater') return 1; }
  if (k === 'art') { if (t === 'wire' || t === 'forest' || t === 'wald' || t === 'furt' || t === 'sumpf') return 99; }
  return TERRAIN[t].cost;
}
function reachable(G, u) {
  const res = new Map();
  if (!active(u) || u.ap < 1 || u.supp > 0 || u.broken > 0 || u.zocStop) return res;
  const T = TYPES[u.type], free = T.cls === 'storm' || T.cls === 'walker';
  let mp = (!free && isZOC(G, u.c, u.r, u.side)) ? 1 : u.limbered ? P.LIMBER_MV : T.mv;
  if (u.mvd > 0) mp = Math.max(1, Math.floor(mp * P.MV2));   // zweiter Zug in derselben Runde: nur halb so weit
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
function openGround(G, c, r) { return ['open', 'mud', 'crater', 'wire', 'bridge', 'furt', 'sumpf', 'waldweg', 'bahn'].includes(hex(G, c, r).t); }

function moveUnit(G, u, c, r) {
  const ev = [];
  const opt = reachable(G, u).get(key(c, r));
  if (!opt) return ev;
  const T = TYPES[u.type];
  spend(u, 1); u.run = 0; u.mvd = (u.mvd || 0) + 1;
  let seg = [[u.c, u.r]];
  const flush = () => { if (seg.length > 1) ev.push({ t: 'move', u: u.id, path: seg }); seg = [[u.c, u.r]]; };
  for (const [nc, nr] of opt.path) {
    u.c = nc; u.r = nr; u.run++; seg.push([nc, nr]);
    const h = hex(G, nc, nr);
    if (T.cls === 'walker' && h.t === 'wire') { h.t = 'open'; flush(); ev.push({ t: 'crush', u: u.id, c: nc, r: nr }); }
    claimObjective(G, u);
    if (T.cls === 'walker' && (h.t === 'mud' || h.t === 'sumpf') && G.rng() < P.STUCK * (h.t === 'sumpf' ? 2 : 1)) { flush(); ev.push({ t: 'stuck', u: u.id }); break; }
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
  if (P.ZOC_STOP && T.cls !== 'storm' && T.cls !== 'walker' && isZOC(G, u.c, u.r, u.side)) u.zocStop = true;   // Feindberührung beendet die Bewegung für die Runde
  ev.push(...checkEnd(G));
  return ev;
}
function turnUnit(G, u, face) {
  if (!active(u) || u.ap < 1 || u.attacked || u.supp > 0 || u.broken > 0) return [];
  u.face = ((face % 6) + 6) % 6;   // Drehen kostet keinen Punkt
  return [{ t: 'face', u: u.id, face: u.face }];
}
// Aufprotzen: Geschütz an die Pferde hängen (zieht dann 4 Felder, feuert nicht). Abprotzen: wieder feuerbereit ab der nächsten Runde.
function canLimber(G, u) {
  if (!active(u) || !TYPES[u.type].limber || u.supp > 0) return false;
  return u.limbered ? u.ap >= 1 : (u.ap >= 1 && !u.attacked);
}
function limber(G, u) {
  if (!canLimber(G, u)) return [];
  if (u.limbered) { u.limbered = false; u.ap = 0; u.moved = true; u.attacked = true; }
  else { u.limbered = true; u.attacked = true; spend(u, 1); }
  return [{ t: 'limber', u: u.id, on: u.limbered }];
}
function canCut(G, u) { return active(u) && u.ap >= 1 && !u.attacked && cls(u) === 'inf' && hex(G, u.c, u.r).t === 'wire'; }
function cutWire(G, u) {
  if (!canCut(G, u)) return [];
  hex(G, u.c, u.r).t = 'open'; u.attacked = !TYPES[u.type].sapper; spend(u, 1);
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
    if (t === 'forest' || t === 'village' || t === 'wald' || t === 'fabrik' || t === 'kirche') return false;
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
  return active(a) && a.ap >= 1 && !a.attacked && !a.broken && TYPES[a.type].atk > 0 && alive(d) && d.side !== a.side && dist(a.c, a.r, d.c, d.r) === 1;
}
function canFire(G, a, d) {
  const T = TYPES[a.type];
  if (!active(a) || a.attacked || a.broken || !T.rng || T.cls === 'art' || !alive(d) || d.side === a.side) return false;
  if (a.ap < (T.mg ? 2 : 1)) return false;   // MG: ziehen oder schießen
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
  const wk = cls(d) === 'walker';
  if (t === 'furt') { m *= 0.8; tags.push('in der Furt ×0,8'); }
  if (t === 'wald') { m *= 1.5; tags.push('Wald ×1,5'); }
  if (t === 'waldweg') { m *= 1.2; tags.push('Waldweg ×1,2'); }
  if (t === 'bunker') { m *= 2; tags.push('Bunker ×2'); }
  if (t === 'fabrik') { m *= wk ? 0.7 : 1.7; tags.push(wk ? 'Koloss in Ruinen ×0,7' : 'Fabrik ×1,7'); }
  if (t === 'kirche') { m *= wk ? 0.7 : 1.5; tags.push(wk ? 'Koloss in Ruinen ×0,7' : 'Kirche ×1,5'); }
  if (t === 'barrikade') { m *= 1.6; tags.push('Barrikade ×1,6'); }
  if (t === 'bahn' && ranged) { m *= 1.3; tags.push('Bahndamm ×1,3'); }
  return m;
}
function hexDef(G, c, r, isWalker) {
  const t = hex(G, c, r).t;
  return t === 'village' || t === 'kirche' ? (isWalker ? 0.7 : P.VILLAGE_DEF) : t === 'fabrik' ? (isWalker ? 0.7 : 1.7) : t === 'forest' ? P.FOREST_DEF : t === 'wire' ? P.WIRE_DEF
    : t === 'furt' ? 0.8 : t === 'wald' ? 1.5 : t === 'waldweg' ? 1.2 : t === 'bunker' ? 2 : t === 'barrikade' ? 1.6 : 1;
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
  if (ranged && D.suit && (A.cls === 'inf' || A.cls === 'mg' || A.cls === 'cav')) { m *= 0.5; tags.push('Kampfanzug ×0,5'); }
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
  if ((t === 'trench' || t === 'bunker') && !o.flame) ml *= 0.5;
  if (officerAt(G, d.side, d.c, d.r)) ml *= P.OFFICER_MOR;
  if (bannerAt(G, d.side, d.c, d.r)) ml *= 0.75;
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
    if (['trench', 'village', 'bunker', 'fabrik', 'kirche', 'barrikade', 'wald'].includes(t)) s += 1;
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
  if (!reaction) { a.attacked = true; spend(a, TYPES[a.type].mg ? 2 : 1); a.face = faceIndex(angleTo(a.c, a.r, d.c, d.r)); }
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
  a.attacked = true; a.ap = 0; a.moved = true;
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
  return G.units.some(u => u.side === side && active(u) && cls(u) !== 'art' && dist(u.c, u.r, c, r) <= Math.max(TYPES[u.type].spot || P.SPOT, hex(G, u.c, u.r).t === 'kirche' ? 6 : 0) && hasLOS(G, u.c, u.r, c, r));
}
function isDirect(G, a, c, r) { return dist(a.c, a.r, c, r) <= P.ART_DIRECT && hasLOS(G, a.c, a.r, c, r); }
function canShell(G, a, c, r, mode) {
  const T = TYPES[a.type];
  if (!active(a) || T.cls !== 'art' || a.limbered || a.attacked || a.ap < (T.mobile ? 1 : 2) || a.supp > 0) return false;
  const d = dist(a.c, a.r, c, r);
  if (d < 1 || d > T.rng) return false;
  if (mode === 'gas' && a.gas <= 0) return false;
  if (isDirect(G, a, c, r)) return mode === 'he';
  return d >= P.ART_MIN && spotted(G, a.side, c, r);
}
// Aufklärer (Meldegänger, Signaltrupp) lenken das Feuer: keine Streuung, Sprenggranaten ×1,25
function guided(G, side, c, r) { return G.units.some(u => u.side === side && active(u) && TYPES[u.type].relay && dist(u.c, u.r, c, r) <= TYPES[u.type].spot && hasLOS(G, u.c, u.r, c, r)); }
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
  a.attacked = true; spend(a, TYPES[a.type].mobile ? 1 : 2);
  a.face = faceIndex(angleTo(a.c, a.r, c, r));
  const direct = isDirect(G, a, c, r);
  let tc = c, tr = r, sc = false;
  const gd = !direct && guided(G, a.side, c, r), roll = direct ? 1 : G.rng();
  if (!direct && !gd && roll < P.SCATTER) { const nb = neighbors(c, r); const p = nb[Math.floor(G.rng() * nb.length)]; tc = p[0]; tr = p[1]; sc = true; }
  ev.push({ t: 'shell', a: a.id, c: tc, r: tr, mode, scatter: sc, guided: gd, face: a.face });
  if (mode === 'he') {
    const d = unitAt(G, tc, tr);
    if (d) applyDamage(G, a, d, shellDmg(G, a, d, direct) * (gd ? P.GUIDED : 1) * (0.75 + G.rng() * 0.5), 'front', ev, { ranged: true });
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
  if (s === 'D' && G.turn === G.reinfTurn && !G.reinfDone) {
    G.reinfDone = true;
    const ids = [];
    const RO = rowsOut();
    const list = REINF.map((x, i) => Array.isArray(x) ? x : [x, COLS - 1 - (i >= ROWS ? 1 : 0), RO[i % ROWS], i === 1 ? 'Sturmführer Kael' : null]);
    for (const [type, c, r, off] of list) {
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
    if (u.side === s) { u.ap = P.AP; u.mvd = 0; u.zocStop = false; u.moved = false; u.attacked = false; u.turnOnly = false; u.run = 0; u.gassed = false; u.sent = false; if (u.cd > 0) u.cd--; }
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
      if (u.broken > 0) { u.ap = 0; u.moved = true; u.attacked = true; } else ev.push({ t: 'repaired', u: u.id });
    }
    if (u.status === 'rout') {
      const off = G.units.find(o => o.officer && o.side === s && active(o) && dist(o.c, o.r, u.c, u.r) <= P.OFFICER_RANGE);
      if (off && !adjEnemies(G, u).length && u.str >= P.ROUT_STR && G.rng() < P.RALLY) {
        u.status = 'ok'; u.mor = 3; u.face = s === 'A' ? 0 : 3;
        ev.push({ t: 'rally', u: u.id, by: off.officer });
        u.ap = 0; u.moved = true; u.attacked = true;
        continue;
      }
      if (u.c === SIDES[s].edge) { killUnit(G, u, ev, 'escaped'); continue; }
      flee(G, u, TYPES[u.type].mv + 1, ev);
      if (alive(u) && u.c === SIDES[s].edge) killUnit(G, u, ev, 'escaped');
      u.ap = 0; u.moved = true; u.attacked = true;
      continue;
    }
    if (!adjEnemies(G, u).length && !u.supp && !u.gassed) {
      const t = hex(G, u.c, u.r).t;
      const rec = ['trench', 'village', 'forest', 'bunker', 'wald', 'fabrik', 'kirche', 'barrikade'].includes(t) ? P.RECOVER_COVER : P.RECOVER;
      u.mor = Math.min(TYPES[u.type].mor, u.mor + rec * (officerAt(G, u.side, u.c, u.r) ? 1.5 : 1) + (bannerAt(G, u.side, u.c, u.r) ? 0.5 : 0));
    }
  }
  ev.push(...checkEnd(G));
  return ev;
}
// Einheit für diese Runde abschließen (Knopf „Fertig“)
function pass(G, u) { if (!u || !active(u) || u.side !== G.side) return []; u.ap = 0; u.moved = true; u.attacked = true; return [{ t: 'pass', u: u.id }]; }

// Drahtpioniere: Stacheldraht auf das Feld legen, in das die Einheit blickt
function layTarget(G, u) { const [c, r] = step(u.c, u.r, u.face); return inMap(c, r) && ['open', 'crater', 'mud'].includes(hex(G, c, r).t) && !unitAt(G, c, r) && !hex(G, c, r).obj ? [c, r] : null; }
function canLay(G, u) { return active(u) && !!TYPES[u.type].wirelayer && u.side === G.side && u.ap >= 1 && !u.attacked && u.supp <= 0 && !!layTarget(G, u); }
function layWire(G, u) { if (!canLay(G, u)) return []; const [c, r] = layTarget(G, u); hex(G, c, r).t = 'wire'; u.attacked = true; spend(u, 1); return [{ t: 'terrain', c, r, what: 'Draht gezogen' }]; }

// Meldegänger mit Hund: bringt einer eigenen Einheit bis 3 Felder einen Befehl, sie bekommt +1 Aktionspunkt (einmal je Runde)
function canSend(G, m, t) { return active(m) && !!TYPES[m.type].courier && m.side === G.side && m.ap >= 1 && !m.sent && t && t !== m && t.side === m.side && active(t) && !t.broken && !TYPES[t.type].courier && (t.ap || 0) < 3 && dist(m.c, m.r, t.c, t.r) <= 3; }
function sendOrder(G, m, t) { if (!canSend(G, m, t)) return []; m.sent = true; spend(m, 1); t.ap = (t.ap || 0) + 1; t.moved = false; return [{ t: 'sent', u: t.id, by: m.id, ap: t.ap }]; }

// ---------- Befehle der Anführer ----------
// Einmal alle zwei eigenen Runden. 'rally' = Sammeln (Moral +1,5, Niederhalten endet), 'storm' = Sturmbefehl (Nahkampf ×1,25 in dieser Runde).
function cmdRange(u) { return TYPES[u.type].cmd === 2 ? 3 : P.OFFICER_RANGE; }
function canOrder(G, u) { return !G.over && u && active(u) && !!u.officer && u.side === G.side && u.ap >= 1 && !(u.cd > 0); }
function order(G, u, kind) {
  if (!canOrder(G, u) || (kind !== 'rally' && kind !== 'storm')) return [];
  const relay = G.units.some(o => o.side === u.side && active(o) && TYPES[o.type].relay && dist(o.c, o.r, u.c, u.r) <= 3);
  u.cd = relay || TYPES[u.type].cmd === 2 ? 1 : P.ORDER_CD; spend(u, 1); const ids = [];
  for (const o of G.units) {
    if (o.side !== u.side || !active(o) || cls(o) === 'walker' || dist(o.c, o.r, u.c, u.r) > cmdRange(u)) continue;
    if (kind === 'rally') { o.mor = Math.min(TYPES[o.type].mor, o.mor + P.ORDER_MOR); o.supp = 0; } else o.zeal = true;
    ids.push(o.id);
  }
  return [{ t: 'order', u: u.id, kind, name: u.officer, ids, mors: ids.map(id => G.units.find(x => x.id === id).mor) }];
}

// ---------- Sanitäter ----------
function canHeal(G, m, t) {
  return active(m) && cls(m) === 'medic' && m.ap >= 1 && !m.attacked && t && t !== m && t.side === m.side && active(t) && cls(t) !== 'walker' &&
    dist(m.c, m.r, t.c, t.r) === 1 && (t.str < 10 || t.mor < TYPES[t.type].mor);
}
function heal(G, m, t) {
  if (!canHeal(G, m, t)) return [];
  m.attacked = true; spend(m, 1); m.face = faceIndex(angleTo(m.c, m.r, t.c, t.r));
  t.str = Math.min(10, t.str + P.HEAL); t.mor = Math.min(TYPES[t.type].mor, t.mor + P.HEAL_MOR);
  return [{ t: 'heal', u: t.id, by: m.id, str: t.str, morv: t.mor }];
}
// ---------- Nachschub ----------
function spawnHexes(G, side, type) {
  const out = [], probe = { type, side };
  for (let c = 0; c < COLS; c++) { if (side === 'A' ? c > 1 : c < COLS - 2) continue; for (let r = 0; r < ROWS; r++) if (!unitAt(G, c, r) && cost(G, probe, c, r) < 99) out.push([c, r]); }
  return out;
}
function canBuy(G, side, type) { return !G.over && !(TYPES[type].cmd === 2 && G.units.some(u => u.side === side && alive(u) && TYPES[u.type].cmd === 2)) && (G.mechs || !isMech(type)) && G.side === side && SHOP[side].includes(type) && G.pts[side] >= COST[type]; }
function buy(G, side, type, c, r) {
  if (!canBuy(G, side, type) || !spawnHexes(G, side, type).some(h => h[0] === c && h[1] === r)) return [];
  G.pts[side] -= COST[type];
  const u = addUnit(G, type, c, r);
  u.ap = 0; u.moved = true; u.attacked = true; u.react = false;
  return [{ t: 'spawn', u: u.id }];
}
function endTurn(G) {
  if (G.over) return [];
  for (const u of G.units) if (u.side === G.side) { if (u.supp > 0) u.supp--; u.zeal = false; }
  if (G.side === 'A') G.side = 'D';
  else {
    if (G.turn >= G.maxT) { G.over = finalResult(G); return [{ t: 'over', result: G.over }]; }
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
  if (p >= G.winA) return { winner: 'A', why: 'points', pts: p };
  if (p >= G.drawA) return { winner: null, why: 'points', pts: p };
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
  P, SIDES, TYPES, TERRAIN, MAPS, useMap: useMapArmy, totalPts: () => OBJECTIVES.reduce((n, o) => n + o.pts, 0), COST, SHOP, spawnHexes, canBuy, buy, limber, canLimber, heal, canHeal, order, canOrder, cmdRange, canSend, sendOrder, pass, canCut, guided, layWire, canLay, layTarget, bannerAt, defaultArmy, armyCost, armyCount, armyOk, ARMY_BUDGET, ARMY_MAX, ARMY_MIN, ROSTER, isMech, buildMap,
  newGame, startTurn, endTurn, reachable, moveUnit, turnUnit, cutWire, canCut, fire, melee, shell,
  canFire, canMelee, canShell, preview, shellDmg, gasCells, isDirect, spotted, immune,
  unitAt, hex, neighbors, step, dist, angleTo, faceIndex, arcOf, inMap, cloudAt, cost,
  isZOC, adjEnemies, losses, points, alive, active, cls, hasLOS, rangeOf, officerAt, key, mulberry32, nearestEnemy
};
for (const [k, f] of Object.entries({ COLS: () => COLS, ROWS: () => ROWS, OBJECTIVES: () => OBJECTIVES, SETUP: () => SETUP, REINF: () => REINF, MAP: () => MAP, ARMY_CAP: () => ARMY_CAP, ARMY_WALKERS: () => ARMY_WALKERS }))
  Object.defineProperty(E, k, { get: f, enumerable: true });
if (typeof module !== 'undefined' && module.exports) module.exports = E; else root.E = E;
})(this);
