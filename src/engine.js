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
  AP: 1, MV2: 0.5, ZOC_STOP: 1, GUIDED: 1.25, ORDER_CD: 2, ORDER_MOR: 1.5, ORDER_ATK: 1.25,
  OFFICER_ATK: 1.15, OFFICER_MOR: 0.8, OFFICER_RANGE: 2, RALLY: 0.6,
  RECOVER: 0.5, RECOVER_COVER: 1,
  MAXT: 16, WIN_A: 5, DRAW_A: 4,
  SUPP: 0.6, SUPP_ATK: 0.5,
  ART_MIN: 2, ART_MIN_GROSS: 3, BREAKER_WIRE: 0.8, SPOT: 4, SCATTER: 0.25, HE_WIRE: 0.5, HE_CRATER: 0.3, ART_DIRECT: 3, ART_VS_WALKER: 2.5,
  GAS_TTL: 3, GAS_STR: 0.5, GAS_MOR: 1.5, GAS_ATK: 0.7, WIND_SHIFT: 0.15,
  BREAKDOWN: 0.05, STUCK: 0.08, WALKER_FEAR: 1, MELEE_VS_WALKER: 0.4, STORM_VS_WALKER: 1.5,
  CHARGE: 1.5, CHARGE_MIN: 3, CAV_VS_ROUT: 2, FLAME_HIT: 1.5, FLAME_MOR: 2,
  REINF_TURN: 8, LIMBER_MV: 3,
  PTS_TURN: { A: 10, D: 10 }, PTS_KILL: 20, PTS_OBJ: 10, HEAL: 2.5, HEAL_MOR: 1.5,
  // Bewegung und Aktionen (Paket 1, seit Fahrplan 2 mit BP/AP): Marsch = Aktion für +50 % BP, Feuerbereitschaft, Aufbauen der MG, Abklingzeiten
  GOAL_K: 7, MAX_ROUNDS: 40, D_BAND: 6,
  // Kirche von Sankt Ruß (2026-11-19, entwurf/KARTE_SANKT_RUSS.md): Deckung ×1,8 und halber Moralverlust (nur Fußtruppen und Anführer kommen hinein);
  // Turm +1 Reichweite und +1 Sicht; Bauzustand KIRCHE_HP, jeder Treffer schwerer Waffen (Artillerie, Mörser, Kanonen der Kolosse) −1 (Minenwerfer −2);
  // bei 0 Einsturz: Kirche und Turm werden Ruine, wer drin ist, nimmt EINSTURZ_DMG Schaden und wird niedergehalten. GARTEN_DEF: Garten-/Friedhofsmauer gegen Beschuss
  KIRCHE_DEF: 1.8, KIRCHE_HP: 6, EINSTURZ_DMG: 2.5, TURM_RNG: 1, TURM_SPOT: 1, GARTEN_DEF: 1.2,
  MARCH: 2, OW_DMG: 0.8, MINE_DMG: 2.6, TUNNEL_DMG: 6, CHARGE_DMG: 3.2, HEAL_CD: 2, RALLY_CD: 3, STORM_CD: 2, RECOVER_CD: 2, STUCK_TURNS: 2,
  // Gelände-Gefahren (2026-11-16): Stacheldraht kostet Stärke beim Betreten, Gas wirkt nach (vergiftet: ½, dann ¼ des Gasschadens), Sperrfeuer mit Abklingzeit
  WIRE_DMG: 1.0, POISON_TURNS: 2, POISON_K: [0.25, 0.5], BARRAGE_CD: 2,
  // Gruppe 1 (2026-11-16): MG-Sperrfeuer 2 Schüsse, Ziel markieren (bis zum nächsten eigenen Zug), Feuerschlag des Fernsprechtrupps
  SPERR_SHOTS: 2, STRIKE_CD: 3, STRIKE_SCATTER: 0.25,
  // Gruppe 2 Führung (2026-11-16): Feuer frei (Konkordat) ×1,25 Fernkampf, „Halten um jeden Preis“ Abwehr ×1,25, Banner aufgepflanzt 3 Felder
  FIRE_FREE: 1.25, NEBEL_IN: 0.5, NEBEL_AUS: 0.75, HOLD_DEF: 1.25,   // Nebelwand (2026-11-18): Beschuss auf Ziele im Nebel ×0,5, aus dem Nebel heraus ×0,75
  BANNER_R: 2, BANNER_R_PLANTED: 3,
  // Spieltest Runde 2, Paket 8 (2026-11-17): Pannen/Festfahren seltener (oben ≈ ⅓), dafür 3 eigene Runden; Befehle 1 Feld, 3× je Anführer; großer Befehl 3 Felder;
  // Gas 3 Runden Abklingzeit; Artillerie-Sperrfeuer höchstens 2× je Geschütz, Schaden ×0,7 eines Einzelschusses; Zweitwaffe (Seiten-MG, Turm-MG) ×0,5, Reichweite 2
  // Fahrplan 2 (2026-11-17): Schusswinkel für Fahrzeuge und Schreiter – Hauptwaffe ±60°, Seitenwaffen (Zweitwaffe, zweiter Schuss der Breitseite) vorn und seitlich bis 135°;
  // Drehen auf der Stelle kostet sie 1 Punkt je Runde (danach in derselben Runde frei)
  FZ_FAN: 60, ZWEIT_FAN: 135, DREH_BP: 1,
  // Fahrplan 2, Schritt 1 (2026-11-17): Bewegungspunkte (BP) und eine Aktion (AP) getrennt – Marsch +50 % BP für die Aktion; Nahkampf nur mit höchstens halb verbrauchten BP
  MARSCH_BP: 0.5, GENERAL_BP: 2, MELDER_BP: 2,
  PANNE_RUNDEN: 3, ORDER_R: 1, ORDER_MAX: 3, BIG_R: 2, GAS_CD: 3, BARRAGE_MAX: 2, BARRAGE_DMG: 0.7, ZWEIT_MUL: 0.5,
  // Gruppe 3 Infanterie und Sturm (2026-11-16): Eingraben Abwehr ×1,3, Schilde vor Beschuss ×0,75 in den Nachbarfeldern, Sturmlauf bis 4 Felder geradeaus
  DIG_DEF: 1.3, SHIELDS: 0.75, RUSH: 4, BROADSIDE: 0.6, BLAST_LANCE: 1.5,
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
// Löwenmaul-Kanone des Kreuzschreiters: Schaden gegen Fahrzeuge und Schreiter ×P_STUFE3_AT (wie die Panzerbüchse über T.at).
const P_STUFE3_AT = 1.5;
const TYPES = {
  kohorte: { side: 'A', name: 'Schützenkohorte', cls: 'inf', dig: true, atk: 4, def: 4, mor: 7, mv: 3, rng: 2, fs: 2,
    can: 'Schießt 2 Felder weit, stürmt Gräben im Nahkampf, schneidet Draht. Eingraben (Aktion, im offenen Gelände oder Trichter): Abwehr ×1,3, bis die Einheit wieder zieht.',
    real: 'Im Ersten Weltkrieg trugen Infanteristen oft rund 30 kg Ausrüstung in den Angriff, quer durch Schlamm und Trichter.' },
  mahlwerk: { side: 'A', name: 'Mahlwerk-Trupp', cls: 'mg', atk: 2, def: 3, mor: 7, mv: 2, rng: 3, fs: 5, mg: true,
    can: 'Maschinengewehr, 3 Felder weit. Wer zieht, schießt nicht. Sperrfeuer (Aktion und alle Bewegungspunkte, aufgebaut und unbewegt): schießt in der gegnerischen Runde bis zu 2-mal auf Gegner, die sich im Schussfeld im Offenen bewegen.',
    real: 'Maschinengewehre wie das britische Vickers oder das deutsche MG 08 schossen rund 450 bis 500 Schuss pro Minute.' },
  haubitze: { side: 'A', name: 'Donnerrohr-Batterie', cls: 'art', limber: true, atk: 0, def: 3, mor: 6, mv: 1, rng: 6, fs: 5, gas: 2,
    can: 'Mittlere Artillerie, kein direkter Schuss. Schießt über eigene Truppen hinweg, wenn eine eigene Einheit das Ziel sieht. Sprenggranaten, Sperrfeuer oder Gas. Aufgeprotzt zieht sie 3 Felder, kann dann aber nicht feuern. Im Nahkampf wehrlos.',
    real: 'Artillerie verursachte im Ersten Weltkrieg die meisten Verluste, nach gängigen Schätzungen deutlich mehr als die Hälfte.' },
  koloss: { side: 'A', name: 'Landkoloss', cls: 'walker', zweit: { name: 'Seiten-MG', rng: 2, seiten: true }, atk: 6, def: 7, mor: 8, mv: 2, rng: 2, fs: 4,
    can: 'Gepanzert: Gewehre und MG prallen ab, kein Gas. Walzt Draht nieder, überquert Gräben. Kanone vorn, Seiten-MG (2 Felder, einmal je Runde zusätzlich) nach links und rechts. Selten Panne: 3 Runden aus.',
    real: 'Die ersten Panzer fuhren im September 1916 an der Somme. Sie waren kaum schneller als ein Fußgänger und fielen oft durch Pannen aus.' },
  sturmpz: { side: 'D', name: 'Sturmpanzer', cls: 'walker', broadside: true, zweit: { name: 'Bord-MG', rng: 2, seiten: true }, atk: 6, def: 7, mor: 8, mv: 2, rng: 2, fs: 4,
    can: 'Gepanzert: Gewehre und MG prallen ab, kein Gas. Walzt Draht nieder, überquert Gräben, selten Panne. Breitseite: nach dem ersten Schuss ein zweiter auf ein anderes Ziel bis 2 Felder, beide ×0,6 (eine Aktion). Bord-MG der Bordschützen (2 Felder, einmal je Runde zusätzlich) nach links und rechts.',
    real: 'Der deutsche A7V hatte 18 Mann Besatzung, eine Kanone und sechs Maschinengewehre ringsum. Gebaut wurden nur 20 Stück; bei Villers-Bretonneux trafen im April 1918 erstmals Panzer auf Panzer.' },
  reiter: { side: 'A', name: 'Lanzenreiter', cls: 'cav', atk: 5, def: 2, mor: 7, mv: 4, rng: 0, fs: 0,
    can: 'Sehr schnell. Ansturm nach 3 Feldern ×1,5, gegen Fliehende ×2. Kommt nicht durch Draht und Totholz. MG-Feuer trifft doppelt.',
    real: 'Die Kavallerie wartete an der Westfront jahrelang auf den Durchbruch. Gegen Maschinengewehre und Stacheldraht war sie fast machtlos.' },
  grenadier: { side: 'D', name: 'Aschengrenadiere', cls: 'inf', dig: true, atk: 4, def: 4, mor: 7, mv: 3, rng: 2, fs: 2,
    can: 'Schießt 2 Felder weit, hält Gräben und Ruinen, schneidet Draht. Eingraben (Aktion, im offenen Gelände oder Trichter): Abwehr ×1,3, bis die Einheit wieder zieht.',
    real: 'Gräben verliefen im Zickzack. So konnte ein eingedrungener Gegner nicht den ganzen Graben entlang schießen.' },
  sense: { side: 'D', name: 'Sensenwerk-Trupp', cls: 'mg', atk: 2, def: 3, mor: 7, mv: 2, rng: 3, fs: 5, mg: true,
    can: 'Maschinengewehr, 3 Felder weit. Wer zieht, schießt nicht. Sperrfeuer (Aktion und alle Bewegungspunkte, aufgebaut und unbewegt): schießt in der gegnerischen Runde bis zu 2-mal auf Gegner, die sich im Schussfeld im Offenen bewegen.',
    real: 'Am ersten Tag der Somme-Schlacht, dem 1. Juli 1916, hatte die britische Armee rund 57.000 Tote und Verwundete, sehr viele durch MG-Feuer.' },
  geschuetz: { side: 'D', name: 'Grabengeschütz', cls: 'art', limber: true, atk: 0, def: 3, mor: 6, mv: 1, rng: 6, fs: 5, gas: 1,
    can: 'Mittlere Artillerie. Schießt über eigene Truppen hinweg, wenn eine eigene Einheit das Ziel sieht. Direkter Schuss bis 3 Felder trifft Landkolosse ×2,5. Aufgeprotzt zieht es 3 Felder, kann dann aber nicht feuern. Im Nahkampf wehrlos.',
    real: 'Bei Flesquières schossen deutsche Feldgeschütze am 20. November 1917 im direkten Richten zahlreiche britische Panzer ab.' },
  sturm: { side: 'D', name: 'Sturmbrecher', cls: 'storm', cutter: true, atk: 6, def: 5, mor: 9, mv: 3, rng: 0, fs: 0,
    can: 'Sickert durch: Gegner halten ihn nicht auf. Schneidet Draht vom Nachbarfeld aus (Aktion). Handgranaten heben den Grabenschutz auf. Gegen Landkolosse im Nahkampf ×1,5.',
    real: 'Deutsche Stoßtrupps griffen ab 1916 in kleinen Gruppen mit Handgranaten an und umgingen starke Stellungen.' },
  brand: { side: 'D', name: 'Brandwerfer', cls: 'flame', atk: 2, def: 3, mor: 7, mv: 2, rng: 1, fs: 7, flame: true,
    can: 'Flammenstrahl auf ein Nachbarfeld. Deckung schützt nicht, doppelter Moralverlust. Das Feld brennt bis zum nächsten eigenen Zug: wer dort steht oder hineinzieht, nimmt Feuerschaden, Draht verbrennt. Wird er beschossen, trifft es ihn ×1,5.',
    real: 'Flammenwerfer setzte die deutsche Armee ab 1915 ein, etwa bei Hooge in Flandern. Sie reichten meist nur rund 20 Meter weit.' }
};

Object.assign(TYPES, {
  feldscher: { side: 'A', name: 'Feldscher', cls: 'medic', atk: 1, def: 2, mor: 6, mv: 3, rng: 0, fs: 0,
    can: 'Versorgt statt eines Angriffs eine eigene Nachbareinheit: Stärke +15 und Moral +10, heilt auch Vergiftung. Kaum Kampfkraft.',
    real: 'Sanitäter und Krankenträger holten Verwundete oft unter Beschuss aus dem Niemandsland. Viele von ihnen fielen dabei selbst.' },
  moerser: { side: 'A', name: 'Grabenmörser', cls: 'art', fig: 'mortar', mobile: true, atk: 0, def: 3, mor: 6, mv: 2, rng: 4, fs: 4, gas: 0,
    can: 'Mörser: leichte Steilfeuerwaffe, 4 Felder weit. Sprenggranaten oder Sperrfeuer. Kann in derselben Runde ziehen und feuern.',
    real: 'Der britische Stokes-Mörser von 1915 war so leicht, dass ihn wenige Männer in den vordersten Graben tragen konnten.' },
  heiler: { side: 'D', name: 'Aschenpfleger', cls: 'medic', atk: 1, def: 2, mor: 6, mv: 3, rng: 0, fs: 0,
    can: 'Versorgt statt eines Angriffs eine eigene Nachbareinheit: Stärke +15 und Moral +10, heilt auch Vergiftung. Kaum Kampfkraft.',
    real: 'Auf den Verbandplätzen direkt hinter der Front wurden Verwundete zuerst versorgt und nach Dringlichkeit sortiert.' },
  minenwerfer: { side: 'D', name: 'Minenwerfer', cls: 'art', fig: 'mortar', mobile: true, noMoveFire: true, heMul: 1.5, breaker: true, atk: 0, def: 3, mor: 6, mv: 2, rng: 4, fs: 4, gas: 0,
    can: 'Mörser: schwere Wurfminen, 4 Felder weit. Sprenggranaten ×1,5 und zerstören Draht und Barrikaden im Zielfeld; auch Sperrfeuer. Ziehen oder feuern, nicht beides in einer Runde.',
    real: 'Deutsche Minenwerfer schossen schwere Sprengladungen im steilen Bogen in die gegnerischen Gräben.' }
});

// Weitere Truppen für die Armee-Auswahl und den Nachschub
Object.assign(TYPES, {
  lanzeD: { side: 'D', name: 'Sprenglanzen-Reiter', cls: 'cav', blastLance: true, atk: 5, def: 2, mor: 7, mv: 4, rng: 0, fs: 0,
    can: 'Sehr schnell. Ansturm nach 3 Feldern ×1,5, gegen Fliehende ×2. Der erste Nahkampfangriff der Schlacht mit der Sprenglanze ×1,5, danach normale Lanze. Kommt nicht durch Draht und Totholz. MG-Feuer trifft doppelt.',
    real: 'Sprenglanzen gab es im Ersten Weltkrieg nicht. Die deutsche Kavallerie trug bis Kriegsende Stahlrohrlanzen von rund 3,2 Metern Länge.' },
  scharf: { side: 'A', name: 'Scharfschütze', cls: 'inf', fig: 'sniper', pin: true, atk: 1, def: 2, mor: 6, mv: 3, rng: 4, fs: 3,
    can: 'Schießt 4 Felder weit. Jeder Treffer hält das Ziel nieder. Im Nahkampf fast wehrlos.',
    real: 'Scharfschützen mit Zielfernrohr lauerten oft stundenlang getarnt. Schon ein kurz über die Grabenkante gehobener Kopf konnte tödlich sein.' },
  melder: { side: 'A', name: 'Meldegänger mit Hund', cls: 'inf', fig: 'dog', courier: true, atk: 2, def: 2, mor: 7, mv: 5, rng: 0, fs: 0,
    can: 'Schnell (5 Felder). Befehl überbringen: einmal je Runde bekommt eine eigene Einheit bis 3 Felder +2 Bewegungspunkte, zum Beispiel für einen weiteren Zug. Kaum Kampfkraft.',
    real: 'Weil Telefonleitungen im Trommelfeuer ständig rissen, überbrachten Meldegänger, Brieftauben und Meldehunde die Nachrichten.' },
  pionier: { side: 'A', name: 'Graben-Pioniere', cls: 'inf', cutter: true, fig: 'sapper', sapper: true, recover: true, abil: 'charge', atk: 4, def: 3, mor: 7, mv: 3, rng: 2, fs: 2,
    can: 'Schneidet Draht vom Nachbarfeld aus (Aktion). Haftladung an ein Nachbarfeld (Aktion, 2 Runden Pause): schwerer Schaden, doppelt gegen Kolosse (dazu 50 % Panne); Bunker und Barrikaden werden Trichter, Draht wird zerrissen. Nahkampf ×1,5 gegen Kolosse. Bergt festgefahrene Fahrzeuge.',
    real: 'Pioniere schnitten nachts Gassen in den Draht, legten Sprengladungen und gruben Stollen unter die gegnerischen Linien.' },
  raeumer: { side: 'A', name: 'Grabenräumer', cls: 'storm', cutter: true, fig: 'raider', atk: 6, def: 4, mor: 8, mv: 3, rng: 0, fs: 0,
    can: 'Nahkämpfer ohne Gewehr. Schneidet Draht vom Nachbarfeld aus (Aktion). Sickert durch: Gegner halten ihn nicht auf. Handgranaten heben den Grabenschutz auf. Gegen Kampfmaschinen im Nahkampf ×1,5.',
    real: 'Für nächtliche Grabenüberfälle nutzten Soldaten Grabendolche, Keulen und geschärfte Spaten, weil Gewehre im engen Graben zu lang waren.' },
  buechse: { side: 'D', name: 'Panzerbüchsen-Trupp', cls: 'inf', fig: 'atr', at: 2, atk: 2, def: 3, mor: 7, mv: 2, rng: 3, fs: 3,
    can: 'Schießt 3 Felder weit. Durchschlägt Panzerung: Beschuss trifft Landkolosse ×2.',
    real: 'Das deutsche Tankgewehr M1918 war die erste Panzerbüchse der Welt. Es verschoss 13-mm-Geschosse und hatte einen sehr starken Rückstoß.' },
  schwer: { side: 'D', name: 'Schwere Grabenwacht', cls: 'inf', fig: 'heavy', wireProof: true, shieldWall: true, atk: 4, def: 6, mor: 8, mv: 2, rng: 0, fs: 0,
    can: 'Schild und Streitkolben: sehr zäh, langsam, nur Nahkampf. Draht verletzt und hält nicht auf. Schilde vor (Aktion): eigene Nachbarn nehmen bis zum nächsten eigenen Zug Beschuss ×0,75.',
    real: 'Im Stellungskrieg wurden Stahlschilde und Brustpanzer erprobt, etwa der deutsche Grabenpanzer ab 1916. Sie waren schwer und schützten vor allem gegen Splitter.' },
  signal: { side: 'D', name: 'Signaltrupp', cls: 'inf', fig: 'signal', spot: 6, relay: true, abil: 'mark', atk: 2, def: 2, mor: 7, mv: 3, rng: 0, fs: 0,
    can: 'Ziel markieren (Aktion): ein Feld in Sicht (bis 6 Felder) bis zu deinem nächsten Zug; eigener Beschuss dorthin ×1,25 ohne Streuung, getarnte Gegner und Minen dort und daneben werden sichtbar. Anführer bis 3 Felder geben jede Runde einen Befehl. Kaum Kampfkraft.',
    real: 'Leuchtpistolen gaben vereinbarte Zeichen an die Artillerie, zum Beispiel für Sperrfeuer. Grabenperiskope erlaubten den Blick über die Brustwehr.' },
  saeger: { side: 'D', name: 'Sägeschreiter', cls: 'walker', fig: 'mechA', mech: true, gat: true, atk: 7, def: 7, mor: 8, mv: 2, rng: 2, fs: 4,
    can: 'Schreitende Kampfmaschine mit Drehlauf-Waffe und Kreissäge. Gepanzert wie ein Landkoloss: Gewehre und MG prallen ab. Bleibt manchmal mit einer Panne liegen.',
    real: 'Schreitende Kampfmaschinen gab es nie. Deutsche Sturmtruppen nahmen 1918 aber erbeutete britische Panzer in Dienst, weil eigene kaum gebaut wurden.' },
  klaue: { side: 'D', name: 'Klauenschreiter', cls: 'walker', fig: 'mechB', mech: true, gat: true, atk: 6, def: 7, mor: 8, mv: 2, rng: 3, fs: 4,
    can: 'Schreitende Kampfmaschine mit Maschinenwaffe und Greifklaue. Gepanzert wie ein Landkoloss: Gewehre und MG prallen ab. Bleibt manchmal mit einer Panne liegen.',
    real: 'Der deutsche A7V trug sechs Maschinengewehre und eine 5,7-cm-Kanone. Am 24. April 1918 traf er bei Villers-Bretonneux auf britische Panzer, das erste Panzergefecht.' },
  turm: { side: 'A', name: 'Turmschreiter', cls: 'walker', zweit: { name: 'Turm-MG', rng: 2 }, fig: 'mechT', mech: true, atk: 6, def: 7, mor: 8, mv: 2, rng: 3, fs: 4,
    can: 'Schreitende Kampfmaschine: Kanone, dazu Turm-MG (2 Felder, einmal je Runde zusätzlich). Gepanzert: Gewehre und MG prallen ab. Selten Panne: 3 Runden aus.',
    real: 'Britische Panzer gab es als „Male“ mit 6-Pfünder-Kanonen und als „Female“ nur mit Maschinengewehren. Ab 1917 kamen „Hermaphrodites“ mit beidem.' },
  orden: { side: 'A', name: 'Ordensschreiter', cls: 'walker', fig: 'mechK', mech: true, gat: true, atk: 7, def: 7, mor: 8, mv: 2, rng: 2, fs: 4,
    can: 'Kampfmaschine in Ritterrüstung mit Drehlauf-Waffe und Kettensäge. Stark auf kurze Entfernung und im Nahkampf. Bleibt manchmal mit einer Panne liegen.',
    real: 'Auch die Briten bauten keine Schreitmaschinen. Ihr erster Panzer, der Mark I von 1916, hatte acht Mann Besatzung und fuhr etwa so schnell wie ein Fußgänger.' },
  kreuz: { side: 'A', name: 'Kreuzschreiter', cls: 'walker', stufe3: true, roar: true, at: P_STUFE3_AT, zweit: { name: 'Unterarm-Kanone', rng: 2, kanone: true }, fig: 'mechC', mech: true, atk: 8, def: 9, mor: 9, mv: 3, rng: 2, fs: 5,
    can: 'Stufe 3, höchstens einer je Schlacht. Löwenmaul-Kanone (stark gegen Fahrzeuge und Schreiter, trifft die Kirche) und Kriegshammer; am zähesten von allen, Bewegung 3. Unterarm-Kanone (2 Felder, einmal je Runde zusätzlich, auch gegen Panzerung). Löwengebrüll (einmal je Schlacht, kostenlos): Gegner ohne Panzerung bis 2 Felder Moral −20 und niedergehalten. Selten Panne.',
    real: 'Panzerbesatzungen trugen Lederhelme und Kettenmasken gegen Splitter, die beim Beschuss innen von der Panzerwand absprangen.' },
  stahl: { side: 'A', name: 'Stahlgänger-Trupp', cls: 'inf', fig: 'suitA', mech: true, suit: true, abil: 'rush', atk: 5, def: 5, mor: 8, mv: 3, rng: 2, fs: 3,
    can: 'Motorisierte Kampfanzüge: Gewehr- und MG-Feuer ×0,5, Draht verletzt und hält nicht auf. Sturmlauf (Aktion und alle BP): bis 4 Felder geradeaus, dann sofort Nahkampf. Geschütze und Nahkampf treffen voll.',
    real: 'Motorisierte Kampfanzüge gab es nie. Käuflich war aber Körperpanzer wie der britische „Dayfield Body Shield“, der gegen Splitter half, gegen Gewehrkugeln kaum.' },
  // Neue Einheiten im Stil Retro-Zukunft (2026-11-20, Bögen ui-quelle/figuren/konkordat_loewenoger.png, aschenwacht_eiserne_huenen.png);
  // fig = alte Ersatzzeichnung (Grabenräumer bzw. Panzerknecht), nur solange die neuen Bilder laden (ui.js FIGMAP)
  oger: { side: 'A', name: 'Löwenoger', cls: 'storm', fig: 'raider', abil: 'sprung', atk: 8, def: 5, mor: 9, mv: 4, rng: 1, fs: 6,
    can: 'Riesige Krieger mit Löwenköpfen: schnell, im Nahkampf sehr stark, leicht gepanzert. Schrotflinte nur auf 1 Feld. Gegner halten ihn nicht auf. Sprungangriff (Aktion und alle BP, 2 Runden Pause, nur aus dem Stand): bis 2 Felder neben einen Gegner, auch über Draht und Gräben, sofort Nahkampf.',
    real: 'Amerikanische Soldaten nahmen 1918 Vorderschaftrepetierflinten (Winchester M1897, „Grabenflinte“) mit in den Grabenkampf. Deutschland protestierte im September 1918 offiziell gegen diese Waffe.' },
  huenen: { side: 'D', name: 'Eiserne Hünen', cls: 'inf', fig: 'suitD', suit: true, mgfire: true, pin: true, dauerfeuer: true, atk: 5, def: 6, mor: 9, mv: 2, rng: 3, fs: 7,
    can: 'Riesen in Rüstung mit schwerem MG aus der Hüfte (3 Felder, kein Aufbauen, jeder Treffer hält nieder). Langsam, Gewehr- und MG-Feuer ×0,5, Draht hält nicht auf. Dauerfeuer: eine zweite Salve in derselben Runde, danach eine eigene Runde kein Schuss.',
    real: 'Das deutsche MG 08 wog mit Schlitten und Kühlwasser rund 60 Kilogramm und brauchte eine Bedienung. MG-Schützen trugen ab 1916 teils Stahlbrustpanzer von etwa zehn Kilogramm. Das leichtere MG 08/15 kam 1917.' },
  panzerk: { side: 'D', name: 'Panzerknechte', cls: 'inf', fig: 'suitD', mech: true, suit: true, abil: 'rush', atk: 5, def: 5, mor: 8, mv: 3, rng: 2, fs: 3,
    can: 'Motorisierte Kampfanzüge: Gewehr- und MG-Feuer ×0,5, Draht verletzt und hält nicht auf. Sturmlauf (Aktion und alle BP): bis 4 Felder geradeaus, dann sofort Nahkampf. Geschütze und Nahkampf treffen voll.',
    real: 'Motorisierte Kampfanzüge gab es nie. Der deutsche Grabenpanzer aus Stahlplatten wog rund zehn Kilogramm und wurde vor allem von Posten und MG-Schützen getragen.' },
  flammen: { side: 'A', name: 'Flammentrupp', cls: 'flame', fig: 'flamer', atk: 2, def: 3, mor: 7, mv: 2, rng: 1, fs: 7, flame: true,
    can: 'Flammenstrahl auf ein Nachbarfeld. Deckung schützt nicht, doppelter Moralverlust. Das Feld brennt bis zum nächsten eigenen Zug: wer dort steht oder hineinzieht, nimmt Feuerschaden, Draht verbrennt. Wird er beschossen, trifft es ihn ×1,5.',
    real: 'Auch die Briten setzten Flammenwerfer ein. An der Somme wurden 1916 riesige fest eingebaute Livens-Flammenwerfer unter dem Niemandsland vorgeschoben.' },
  schildwall: { side: 'A', name: 'Schildwall', cls: 'inf', fig: 'shieldA', shieldWall: true, atk: 4, def: 6, mor: 8, mv: 2, rng: 0, fs: 0,
    can: 'Schwer gepanzert und langsam. Gut, um Gräben und Ruinen zu halten, die man genommen hat. Keine Schusswaffe. Schilde vor (Aktion): eigene Einheiten in den Nachbarfeldern nehmen bis zum nächsten eigenen Zug Beschuss ×0,75.',
    real: 'Beide Seiten erprobten Stahlschilde und Körperpanzer. Sie waren schwer und schützten vor allem gegen Splitter, kaum gegen Gewehrkugeln aus der Nähe.' },
  feldkanone: { side: 'A', name: 'Feldkanone', cls: 'art', fig: 'fgun', limber: true, atk: 0, def: 3, mor: 6, mv: 1, rng: 5, fs: 5,
    can: 'Leichte Artillerie: 5 Felder Reichweite, kein Gas. Direkter Schuss bis 3 Felder trifft Kolosse und Kampfmaschinen ×2,5. Aufgeprotzt zieht sie 3 Felder. Im Nahkampf wehrlos.',
    real: 'Die britische 18-Pfünder-Feldkanone war das wichtigste Geschütz der britischen Armee. Bis 1918 verschoss sie rund 100 Millionen Granaten.' },
  fernsprech: { side: 'A', name: 'Fernsprechtrupp', cls: 'inf', fig: 'phone', spot: 6, relay: true, abil: 'strike', atk: 2, def: 2, mor: 7, mv: 3, rng: 0, fs: 0,
    can: 'Feuerschlag (Aktion und alle BP, 3 Runden Pause): wie ein Haubitzenschuss auf ein Feld in Sicht (bis 6 Felder), 25 % Streuung. Anführer bis 3 Felder geben jede Runde einen Befehl.',
    real: 'Feldtelefone verbanden die Gräben mit den Batterien. Die Leitungen wurden tief eingegraben, rissen im Trommelfeuer aber trotzdem ständig.' },
  pionierD: { side: 'D', name: 'Drahtpioniere', cls: 'inf', cutter: true, fig: 'sapperD', sapper: true, recover: true, wirelayer: true, abil: 'mine', mines: 3, atk: 3, def: 3, mor: 7, mv: 3, rng: 2, fs: 2,
    can: 'Schneidet Draht vom Nachbarfeld aus (Aktion). Je Runde Draht ziehen (aufs Feld, in das er blickt) oder eine Mine auf ein freies Nachbarfeld (3 Stück): unsichtbar, wer hineinzieht, nimmt Schaden und bleibt stehen. Danach kein Angriff mehr.',
    real: 'Drahtverhaue wurden meist nachts gebaut. Arbeitstrupps schraubten Eisenpfähle in den Boden und spannten Rollen Stacheldraht dazwischen.' },
  banner: { side: 'D', name: 'Bannerträger', cls: 'inf', fig: 'banner', banner: true, atk: 3, def: 3, mor: 9, mv: 3, rng: 1, fs: 2,
    can: 'Eigene Truppen bis 2 Felder verlieren weniger Moral (×0,75) und erholen sich jede Runde um 0,5 Moral mehr. Banner aufpflanzen (Aktion): wirkt 3 Felder weit, dort flieht niemand; der Träger zieht nicht, bis er es wieder aufnimmt (Aktion).',
    real: 'Im Ersten Weltkrieg trugen Regimenter ihre Fahnen kaum noch ins Gefecht. Sie waren zu auffällig und wurden ab 1914 meist hinter der Front verwahrt.' },
  hauptA: { side: 'A', name: 'Hauptmann mit Stab', cls: 'inf', fig: 'leader1', cmd: 1, atk: 3, def: 4, mor: 9, mv: 3, rng: 2, fs: 2,
    can: 'Kommandotrupp: bis zu 3 Befehle je Schlacht an Nachbarn: „Sammeln“ (Moral +15, Niederhalten endet) oder „Feuer frei“ (Fernkampf ×1,25 bis zu ihrem nächsten Zug). Truppen in der Nähe verlieren weniger Moral.',
    real: 'Ein Hauptmann führte eine Kompanie von rund 200 Mann. Die Verluste unter jungen Offizieren waren sehr hoch, weil sie beim Angriff vorangingen.' },
  generalA: { side: 'A', name: 'General mit Stab', cls: 'inf', fig: 'leader4', cmd: 2, atk: 2, def: 5, mor: 10, mv: 3, rng: 1, fs: 1,
    can: 'Pflicht, genau einer je Armee; schwach im Kampf. Bis zu 3 Befehle je Schlacht an Nachbarn („Sammeln“, „Feuer frei“). Einmal je Schlacht „Halten um jeden Preis“: Einheiten bis 2 Felder fliehen bis zum nächsten eigenen Zug nicht, Abwehr ×1,25.',
    real: 'Generäle führten meist aus Hauptquartieren weit hinter der Front, verbunden über Telefon und Meldegänger. Trotzdem fielen im Ersten Weltkrieg über 70 britische Generäle.' },
  hauptD: { side: 'D', name: 'Hauptmann mit Stab', cls: 'inf', fig: 'leader1', cmd: 1, atk: 3, def: 4, mor: 9, mv: 3, rng: 2, fs: 2,
    can: 'Kommandotrupp: bis zu 3 Befehle je Schlacht an Nachbarn: „Sammeln“ (Moral +15, Niederhalten endet) oder „Sturmbefehl“ (Nahkampf ×1,25 in dieser Runde). Truppen in der Nähe verlieren weniger Moral.',
    real: 'In der deutschen Armee führte ein Hauptmann meist eine Kompanie. Ab 1916 übernahmen oft Leutnants diese Aufgabe, weil zu viele Offiziere gefallen waren.' },
  generalD: { side: 'D', name: 'General mit Stab', cls: 'inf', fig: 'leader4', cmd: 2, atk: 2, def: 5, mor: 10, mv: 3, rng: 1, fs: 1,
    can: 'Pflicht, genau einer je Armee; schwach im Kampf. Bis zu 3 Befehle je Schlacht an Nachbarn („Sammeln“, „Sturmbefehl“). Einmal je Schlacht „Generalangriff“: Einheiten bis 2 Felder dürfen sofort noch einmal angreifen (+1 Aktion, +2 BP, auch nach weitem Zug in den Nahkampf), Niederhalten endet.',
    real: 'Deutsche Divisionen wurden von Generalmajoren geführt. Die Stäbe arbeiteten mit Karten, Telefon und Luftbildern meist mehrere Kilometer hinter der Front.' },
  knecht: { side: 'D', name: 'Eisenknecht', cls: 'walker', stufe3: true, faust: true, fig: 'mech', mech: true, atk: 8, def: 10, mor: 9, mv: 3, rng: 2, fs: 7,
    can: 'Stufe 3, höchstens einer je Schlacht. Doppelte Sturmkanonen an beiden Unterarmen und Hackklinge; gepanzert, Gewehre und MG prallen ab. Faustsalve (einmal je Schlacht, statt des Schusses): zwei Schüsse auf zwei verschiedene Ziele, je ×2. Selten Panne.',
    real: 'Schreitende Kampfmaschinen gab es nie. Der einzige deutsche Panzer des Krieges, der A7V, wurde nur 20-mal gebaut und hatte 18 Mann Besatzung.' },
  bohrer: { side: 'D', name: 'Bohrkoloss', cls: 'walker', zweit: { name: 'Flammenstoß', rng: 1, flamme: true }, fig: 'drill', mech: true, atk: 8, def: 7, mor: 8, mv: 2, rng: 0, fs: 0,
    can: 'Kampfmaschine mit Bohrkopf: sehr stark im Nahkampf. Flammenstoß (einmal je Runde zusätzlich) auf ein Nachbarfeld: halb so stark wie ein Flammentrupp, das Feld brennt. Selten Panne: 3 Runden aus.',
    real: 'Unter der Erde tobte ein Minenkrieg. Bei Messines zündeten die Briten am 7. Juni 1917 neunzehn Minen unter den deutschen Stellungen.' }
});
// Nachschub: Kosten in Punkten und Angebot je Seite
// Kosten in Punkten (großer Maßstab, Wunsch des Nutzers): aus Werten und Fähigkeiten berechnet.
// Kampfwert = 6·Angriff + 5·Zähigkeit + 5·Zug − 45, auf 5 gerundet.
//   Angriff = stärkere Waffe + 0,4 × schwächere (Feuer = Feuerkraft × (1 + 0,15 je Feld Reichweite über 1), Steilfeuer ×1,3;
//             Nahkampf = Angriff, Reiter ×1,2, Sturmtruppen ×1,15). Zähigkeit = Abwehr (Kolosse ×1,6, Rüstung ×1,4) + halbe Moral.
// Dazu Fähigkeiten (ABIL) und ein kleiner Abgleich aus der Simulation (ADJ). Prüfen: node tools/costcheck.js
const ABIL = { feldscher: ['Versorgen', 30], heiler: ['Versorgen', 30], scharf: ['Niederhalten', 15], buechse: ['Panzerbrechend', 25],
  signal: ['Ziel markieren', 5], fernsprech: ['Feuerschlag anfordern', 10], melder: ['Befehl überbringen', 5], banner: ['Banner', 15],
  hauptA: ['Befehle (3)', 10], hauptD: ['Befehle (3)', 10], generalA: ['Befehle (3), großer Befehl', 35], generalD: ['Befehle (3), großer Befehl', 35],
  pionierD: ['Draht ziehen oder Minen (3), Bergen', 10], pionier: ['Haftladung, Bergen', 15], knecht: ['Doppelte Sturmkanonen, Faustsalve', 30], oger: ['Sprungangriff', 15], huenen: ['Dauerfeuer', 10], kreuz: ['Löwenmaul-Kanone gegen Panzerung, Unterarm-Kanone, Löwengebrüll', 30],
  rauch: ['Nebelwand', 15], mineur: ['Stollen', 10], werkstatt: ['Reparieren, Bergen, Nachladen', 40], ballon: ['Ziel markieren, Sicht von oben', 50],
  eingreif: ['Gegenstoß', 40], gasschutz: ['Gasschutz', 15], munition: ['Reparieren, Bergen, Nachladen', 40], pirsch: ['Getarnt, Niederhalten', 35] };
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
const ADJ = { kohorte: 5, grenadier: -5, scharf: 5, moerser: -15, minenwerfer: -15, reiter: -10, lanzeD: -15, feldscher: -10, heiler: -10,
  sturm: 40, knecht: -10, huenen: -15, bohrer: 80, brand: 0, sturmpz: 10, eingreif: 10, klaue: 25, saeger: 20, gasschutz: -10, rauch: -5, melder: -5,
  feldkanone: -10, haubitze: -10, flammen: -5, werkstatt: -5, schildwall: -5, mahlwerk: -5, koloss: -10, turm: -10, kreuz: -25, orden: -10,
  schwer: -5, banner: -5, munition: -5 };
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
  rauch: { side: 'A', name: 'Rauchwerfer-Trupp', cls: 'inf', fig: 'smoke', abil: 'smoke', atk: 2, def: 3, mor: 7, mv: 3, rng: 0, fs: 0,
    can: 'Nebelwand (Aktion, 3 Runden Pause): Feld bis 3 Felder und seine Nachbarn bis zur nächsten eigenen Runde im Nebel. Ziel im Nebel: Beschuss ×0,5; Schütze im Nebel ×0,75; keine Sicht hindurch. Vor dem Vorrücken legen.',
    real: 'Bei Loos legten die Briten im September 1915 neben Gas auch künstlichen Nebel aus Rauchkerzen, um den Angriff zu verschleiern. Später verschossen Stokes-Mörser Nebelgranaten.' },
  mineur: { side: 'A', name: 'Mineure (Tunnelgräber)', cls: 'inf', fig: 'miner', abil: 'tunnel', sapper: true, atk: 3, def: 3, mor: 7, mv: 3, rng: 0, fs: 0,
    can: 'Stollen graben (Aktion, alle 4 Runden): unter einen Graben, Bunker oder ein Gebäude bis 2 Felder. Zwei eigene Runden später fliegt das Feld in die Luft (schwerer Schaden, wird zum Trichter).',
    real: 'Bei Messines zündeten britische Tunnelbauer am 7. Juni 1917 19 Minen unter den deutschen Stellungen. Die Explosionen waren bis nach London zu hören.' },
  werkstatt: { side: 'A', name: 'Versorgungstrupp', cls: 'medic', fig: 'wrench', repair: true, recover: true, abil: 'ammo', atk: 2, def: 2, mor: 6, mv: 3, rng: 0, fs: 0,
    can: 'Je Runde eine Aufgabe: Koloss oder Kampfmaschine daneben reparieren (Stärke +25, 2 Runden Pause), festgefahrene Fahrzeuge bergen oder Nachladen (Aktion, 2 Runden Pause): ein MG oder Geschütz daneben schießt noch einmal.',
    real: 'Bei Cambrai 1917 fiel ein großer Teil der britischen Panzer durch Pannen und Festfahren aus. Bergungs- und Werkstattzüge holten sie zurück; Trägertrupps brachten Granaten und Gurte nach vorn.' },
  ballon: { side: 'A', name: 'Ballonbeobachter', cls: 'inf', fig: 'balloon', relay: true, abil: 'mark', aerial: true, spot: 8, atk: 0, def: 1, mor: 4, mv: 0, rng: 0, fs: 0,
    can: 'Fesselballon: zieht nicht, wehrlos, sieht 8 Felder über Wald und Häuser. Ziel markieren (Aktion): ein Feld in Sicht bis zu deinem nächsten Zug; eigener Beschuss dorthin ×1,25 ohne Streuung, getarnte Gegner und Minen dort und daneben werden sichtbar.',
    real: 'Gefesselte Beobachtungsballone standen hinter der Front und lenkten das Artilleriefeuer per Telefon. Als einzige Flieger trugen ihre Beobachter schon früh Fallschirme.' },
  eingreif: { side: 'D', name: 'Eingreiftrupp', cls: 'storm', fig: 'counter', counterStrike: true, atk: 6, def: 4, mor: 8, mv: 3, rng: 0, fs: 0,
    can: 'Gegenstoß: Betritt ein Gegner ein Zielfeld bis 3 Felder entfernt, stürmt der Trupp sofort heran und greift an (einmal je gegnerischer Runde).',
    real: 'Die deutsche Abwehr setzte ab 1917 auf Eingreiftruppen, die eingebrochene Angreifer sofort im Gegenstoß zurückwarfen.' },
  gasschutz: { side: 'D', name: 'Gasschutz-Trupp', cls: 'inf', fig: 'gasmask', gasproof: true, abil: 'clear', atk: 3, def: 3, mor: 7, mv: 3, rng: 1, fs: 2,
    can: 'Gas schadet ihm und seinen Nachbarn nicht, auch keine Vergiftung. Entgiften (Aktion, alle 2 Runden): löst Gaswolken bis 1 Feld auf.',
    real: 'Gasschutzoffiziere schulten die Truppe im schnellen Aufsetzen der Masken und prüften die Filter. Nach einem Angriff wurden Unterstände mit Feuer und Chlorkalk entgiftet.' },
  munition: { side: 'D', name: 'Versorgungstrupp', cls: 'medic', fig: 'ammo', repair: true, recover: true, abil: 'ammo', atk: 2, def: 2, mor: 6, mv: 3, rng: 0, fs: 0,
    can: 'Je Runde eine Aufgabe: Koloss oder Kampfmaschine daneben reparieren (Stärke +25, 2 Runden Pause), festgefahrene Fahrzeuge bergen oder Nachladen (Aktion, 2 Runden Pause): ein MG oder Geschütz daneben schießt noch einmal.',
    real: 'Ein MG 08 verschoss rund 500 Schuss in der Minute. Munitionsträger schleppten die schweren Gurtkästen unter Feuer nach vorn; Instandsetzungstrupps flickten liegengebliebene Panzer.' },
  pirsch: { side: 'D', name: 'Pirschjäger', cls: 'inf', fig: 'stalker', pin: true, hidden: true, atk: 1, def: 2, mor: 6, mv: 3, rng: 4, fs: 3,
    can: 'Getarnt: nur aus dem Nachbarfeld angreifbar, bis er schießt (dann eine gegnerische Runde sichtbar). Jeder Treffer hält nieder.',
    real: 'Deutsche Scharfschützen mit Zielfernrohr beherrschten 1915 das Niemandsland. Die Briten richteten daraufhin eigene Scharfschützenschulen ein.' }
});
for (const k in TYPES) if (COST[k] == null) COST[k] = costParts(k).total;
const SPECIALS = {"kohorte": ["Schneidet Draht", "Schuss 2 Felder", "Eingraben"], "grenadier": ["Schneidet Draht", "Schuss 2 Felder", "Eingraben"], "mahlwerk": ["Sperrfeuer: 2 Schüsse", "Zieht oder schießt"], "sense": ["Sperrfeuer: 2 Schüsse", "Zieht oder schießt"], "haubitze": ["Feuert über Truppen", "Gas und Sperrfeuer", "Aufprotzen"], "geschuetz": ["Feuert über Truppen", "Direktschuss ×2,5 auf Kolosse", "Aufprotzen"], "koloss": ["Gepanzert", "Walzt Draht nieder", "Pannen"], "sturmpz": ["Gepanzert", "Breitseite: 2 Ziele ×0,6", "Bord-MG", "Walzt Draht nieder", "Pannen"], "reiter": ["Ansturm ×1,5", "Kein Draht, kein Totholz"], "lanzeD": ["Ansturm ×1,5", "Sprenglanze ×1,5 (einmal)", "Kein Draht, kein Totholz"], "sturm": ["Sickert durch", "Handgranaten", "×1,5 gegen Kolosse"], "brand": ["Flammenstrahl", "Deckung schützt nicht", "Feld brennt"], "feldscher": ["Versorgt einen Nachbarn", "Heilt Vergiftung"], "heiler": ["Versorgt einen Nachbarn", "Heilt Vergiftung"], "moerser": ["Mörser", "Ziehen und feuern", "Steilfeuer 4 Felder"], "minenwerfer": ["Steilfeuer 4 Felder", "Sprenggranaten ×1,5", "Zerstört Draht und Barrikaden", "Ziehen oder feuern"], "scharf": ["Schuss 4 Felder", "Hält das Ziel nieder"], "melder": ["Befehl überbringen: +2 Bewegung", "Zieht 5 Felder"], "signal": ["Ziel markieren: ×1,25, keine Streuung, deckt auf", "Sieht 6 Felder", "Anführer befehlen jede Runde"], "pionier": ["Draht schneiden und angreifen", "×1,5 gegen Kolosse"], "raeumer": ["Sickert durch", "Handgranaten", "×1,5 gegen Kolosse"], "buechse": ["Schuss 3 Felder", "×2 gegen Kolosse"], "schwer": ["Sehr zäh", "Nur Nahkampf", "Draht hält nicht auf", "Schilde vor"], "knecht": ["Stufe 3: einmal je Schlacht", "Gepanzert", "Doppelte Sturmkanonen", "Faustsalve: einmal je Schlacht", "Hackklinge", "Pannen"], "klaue": ["Gepanzert", "Maschinenwaffe", "Pannen"], "stahl": ["Kampfanzug: Beschuss ×0,5", "Draht hält nicht auf", "Sturmlauf"], "flammen": ["Flammenstrahl", "Deckung schützt nicht", "Feld brennt"], "schildwall": ["Sehr zäh", "Keine Schusswaffe", "Schilde vor"], "feldkanone": ["Reichweite 5", "Direktschuss ×2,5 auf Kolosse", "Aufprotzen"], "fernsprech": ["Feuerschlag anfordern (alle 3 Runden)", "Sieht 6 Felder", "Anführer befehlen jede Runde"], "pionierD": ["Zieht Stacheldraht", "Schuss 2 Felder"], "banner": ["Moralverlust ×0,75 in 2 Feldern", "Erholung +5", "Aufpflanzen: 3 Felder, keine Flucht"], "hauptA": ["Befehl alle 2 Runden, 2 Felder", "Sammeln, Feuer frei"], "hauptD": ["Befehl alle 2 Runden, 2 Felder", "Sammeln, Sturmbefehl"], "generalA": ["Befehl jede Runde, 3 Felder", "Einmal: Halten um jeden Preis", "Höchstens einer"], "generalD": ["Befehl jede Runde, 3 Felder", "Einmal: Generalangriff (zweiter Angriff)", "Höchstens einer"], "panzerk": ["Kampfanzug: Beschuss ×0,5", "Draht hält nicht auf", "Sturmlauf"], "bohrer": ["Gepanzert", "Nur Nahkampf", "Pannen"], "saeger": ["Gepanzert", "Maschinenwaffe und Säge", "Pannen"], "oger": ["Sprungangriff (alle 2 Runden)", "Schrotflinte 1 Feld", "Sickert durch"], "huenen": ["Dauerfeuer: 2 Salven, dann abkühlen", "Panzerung: Beschuss ×0,5", "Hält nieder", "Draht hält nicht auf"]};
for (const t in SPECIALS) TYPES[t].sp = SPECIALS[t];
Object.assign(SPECIALS, { turm: ["Gepanzert", "Geschützturm", "Schuss 3 Felder", "Panne möglich"], orden: ["Gepanzert", "Drehlauf", "Kettensäge", "Panne möglich"], kreuz: ["Stufe 3: einmal je Schlacht", "Schwer gepanzert", "Löwenmaul-Kanone: stark gegen Panzerung", "Kriegshammer", "Löwengebrüll: einmal je Schlacht", "Panne möglich"] });
// Paket 1: Schlagworte für neue Regeln
Object.assign(SPECIALS, { rauch: ['Nebelwand'], mineur: ['Stollen sprengen'],
  werkstatt: ['Repariert Kolosse', 'Nachladen'], ballon: ['Sicht von oben 8 Felder', 'Ziel markieren', 'Zieht nicht'],
  eingreif: ['Gegenstoß auf Zielfelder'], gasschutz: ['Gasfest, schützt Nachbarn', 'Entgiften'], munition: ['Repariert Kolosse', 'Nachladen'], pirsch: ['Getarnt', 'Schuss 4 Felder', 'Hält nieder'] });
for (const t in TYPES) if (!TYPES[t].sp && SPECIALS[t]) TYPES[t].sp = SPECIALS[t].slice();
for (const t in TYPES) { const T = TYPES[t], sp = T.sp || (T.sp = []);
  if (T.mg) { const i = sp.indexOf('Zieht oder schießt'); if (i >= 0) sp[i] = 'Erst aufbauen, dann feuern'; }
  if (T.recover) sp.push('Bergt Kolosse und Maschinen');
  { const i = sp.indexOf('Schneidet Draht'); if (i >= 0) sp.splice(i, 1); }   // Paket 8: nur noch die Drahtschneider (cutter) schneiden, vom Nachbarfeld aus
  if (T.cutter) sp.unshift('Draht schneiden (Nachbarfeld, Aktion)');
  if (T.zweit) sp.push(T.zweit.name + (T.zweit.rng > 1 ? ` (${T.zweit.rng} Felder)` : ' (Nachbarfeld)'));
  if (T.rng >= 2 && T.cls !== 'art' && T.cls !== 'walker' && !T.mg) sp.push('Feuerbereitschaft');
}
const SHOP = { A: ['hauptA', 'generalA', 'kohorte', 'melder', 'fernsprech', 'feldscher', 'pionier', 'scharf', 'schildwall', 'mahlwerk', 'moerser', 'reiter', 'raeumer', 'oger', 'flammen', 'feldkanone', 'haubitze', 'koloss', 'stahl', 'turm', 'orden', 'kreuz', 'rauch', 'mineur', 'werkstatt', 'ballon'],
  D: ['hauptD', 'generalD', 'grenadier', 'lanzeD', 'signal', 'heiler', 'pionierD', 'schwer', 'banner', 'buechse', 'sense', 'minenwerfer', 'brand', 'sturm', 'huenen', 'geschuetz', 'panzerk', 'knecht', 'sturmpz', 'bohrer', 'saeger', 'klaue', 'eingreif', 'gasschutz', 'munition', 'pirsch'] };

const TERRAIN = {
  open:    { name: 'Offenes Feld', cost: 1, info: 'Keine Deckung.' },
  mud:     { name: 'Schlamm', cost: 2, info: 'Kostet 2 Bewegung. Landkolosse bleiben hier manchmal stecken.' },
  crater:  { name: 'Granattrichter', cost: 2, info: 'Kostet 2 Bewegung. Abwehr ×1,2 gegen Beschuss.',
             real: 'Trichter füllten sich oft mit Wasser. 1917 bei Passchendaele ertranken Soldaten im Schlamm.' },
  trench:  { name: 'Schützengraben', cost: 1, info: 'Abwehr ×1,6 gegen Beschuss und Angriffe von vorn. Halber Moralverlust.',
             real: 'Die Gräben waren oft über zwei Meter tief, mit Sandsäcken, Unterständen und Verbindungsgräben nach hinten.' },
  wire:    { name: 'Stacheldraht', cost: 1, info: 'Wer ihn betritt, verliert etwa 10 Stärke und bleibt stehen. Wer drinsteht: Abwehr ×0,6, MG-Feuer ×2. Infanterie kann ihn schneiden, Landkolosse walzen ihn nieder. Gepanzerte Infanterie geht unverletzt hindurch.',
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
             real: 'Eisenbahnen brachten Truppen und Granaten an die Front. Bahndämme dienten oft als Deckung.' },
  // Sankt Ruß (2026-11-19)
  schiff:  { name: 'Kirche', cost: 1, info: 'Nur Fußtruppen und Anführer kommen hinein. Abwehr ×1,8, halber Moralverlust. Versperrt die Sicht. Treffer von Artillerie, Mörsern und Kanonen bringen die Kirche zum Einsturz.',
             real: 'Ab September 1914 lag die Kathedrale von Reims unter deutschem Artilleriefeuer; das Dach brannte aus, die Glocken schmolzen.' },
  turm:    { name: 'Kirchturm', cost: 1, info: 'Wie die Kirche. Wer im Turm steht, schießt und sieht 1 Feld weiter. Stürzt mit der Kirche ein.',
             real: 'Kirchtürme waren begehrte Beobachtungsposten. In Albert hing die vergoldete Madonna ab 1915 nach einem Treffer fast waagerecht vom Turm.' },
  friedhof: { name: 'Friedhof', cost: 1, info: 'Gräber und niedrige Mauer: Abwehr ×1,2 gegen Beschuss.',
             real: 'Auf dem Hügel Notre-Dame-de-Lorette, 1914/15 heftig umkämpft, liegt heute der größte französische Soldatenfriedhof.' },
  garten:  { name: 'Garten', cost: 1, info: 'Niedrige Gartenmauern: Abwehr ×1,2 gegen Beschuss.',
             real: 'In den Dörfern an der Westfront wurde um jede Mauer gekämpft; Gärten und Hecken waren oft die einzige Deckung zwischen den Häusern.' }
};
const KIRCHE = new Set(['schiff', 'turm']);

const GRAUWALL_OBJ = [
  { id: 'veskar', name: 'Ruinen von Veskar', c: 15, r: 4, pts: 2 },
  { id: 'schanze', name: 'Grauwall-Schanze', c: 13, r: 6, pts: 2 },
  { id: 'totholz', name: 'Totholz von Ilm', c: 17, r: 1, pts: 3 },
  { id: 'marn', name: 'Brücke von Marn', c: 18, r: 9, pts: 2 }
];

const GRAUWALL_SETUP = [
  ['kohorte', 3, 0], ['kohorte', 3, 2], ['kohorte', 3, 4], ['kohorte', 3, 6], ['kohorte', 3, 8], ['kohorte', 3, 10],
  ['kohorte', 1, 3], ['kohorte', 1, 5], ['kohorte', 1, 7],
  ['mahlwerk', 2, 0], ['mahlwerk', 2, 5], ['mahlwerk', 2, 10],
  ['koloss', 2, 2], ['koloss', 2, 4], ['koloss', 2, 7], ['koloss', 2, 9],
  ['haubitze', 0, 2], ['haubitze', 0, 5], ['haubitze', 0, 8],
  ['reiter', 1, 1], ['reiter', 1, 9],
  ['grenadier', 9, 0], ['grenadier', 9, 4], ['grenadier', 9, 8],
  ['sense', 9, 2], ['sense', 9, 6], ['sense', 9, 10],
  ['grenadier', 13, 2], ['grenadier', 13, 6], ['grenadier', 13, 9],
  ['sense', 13, 4], ['sense', 13, 8],
  ['grenadier', 15, 4], ['grenadier', 17, 1], ['grenadier', 18, 9],
  ['geschuetz', 16, 5], ['geschuetz', 15, 1], ['geschuetz', 15, 8]
];
const GRAUWALL_REINF = [['sturm', 19, 2], ['sturm', 19, 4], ['sturm', 19, 6], ['brand', 19, 3], ['brand', 19, 5], ['geschuetz', 18, 5]];

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
// Karte aus Zeichenraster (für Karten nach gemaltem Bild): eine Zeile je Reihe, ein Zeichen je Spalte
const GRID_CODE = { '.': 'open', ',': 'mud', o: 'crater', f: 'forest', W: 'wald', '=': 'trench', x: 'wire', U: 'bunker', '~': 'canal', B: 'bridge', F: 'furt', s: 'sumpf', V: 'village', K: 'fabrik', '+': 'kirche', '#': 'barrikade', '-': 'bahn',
  S: 'schiff', t: 'turm', h: 'friedhof', g: 'garten' };
function gridMap(grid) {
  const T = mapTools(grid[0].length, grid.length, 1);
  grid.forEach((row, r) => [...row].forEach((ch, c) => { T.set(c, r, GRID_CODE[ch] || 'open'); if ('~BF'.includes(ch)) T.M[c][r].river = true; }));
  return T.M;
}
const MAPS = {
  grauwall: { id: 'grauwall', name: 'Der Grauwall', size: 'Klassisch', cols: 16, rows: 10, zoneA: 2, zoneD: 7,
    desc: 'Die erste Schlacht: Niemandsland, zwei Grabenlinien, Kanal mit Brücke.',
    maxT: 14, reinfTurn: 7, winA: 5, drawA: 4, armyMax: { A: 22, D: 18 },
    objectives: [
      { id: 'vorposten', name: 'Vorposten', c: 3, r: 4, pts: 1 },
      { id: 'nordgraben', name: 'Nordgraben', c: 7, r: 2, pts: 2 },
      { id: 'suedgraben', name: 'Südgraben', c: 7, r: 7, pts: 2 },
      { id: 'schanze', name: 'Die Schanze', c: 10, r: 5, pts: 2 },
      { id: 'veskar', name: 'Veskar', c: 12, r: 4, pts: 1 }],
    army: { A: { kohorte: 8, mahlwerk: 3, koloss: 3, haubitze: 2, reiter: 2, generalA: 1, hauptA: 1 }, D: { grenadier: 10, sense: 5, geschuetz: 2, generalD: 1, hauptD: 1 } },
    reinf: [],   // F44 (2026-11-20): keine Verstärkungswelle mehr; dafür 2 Grenadiere mehr von Anfang an (vorher 8 + Welle in Runde 7: 3 Sturm, 2 Brand, 1 Geschütz)
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
      T.path([[0, 4], [12, 4], [14, 8], [15, 8]], 'road');   // alte Landstraße nach Veskar und über die Marnbrücke
      return T.M;
    } },
  // Sankt Ruß (2026-11-19, Plan entwurf/KARTE_SANKT_RUSS.md): Dorf in der Mitte, beide Seiten aus ihren Gräben am Dorfrand (Konkordat West, Aschenwacht Ost).
  // Raster punktsymmetrisch (c, r) ↔ (15 − c, 9 − r), nur Kirche, Friedhof, Dorfplatz und Straße nicht gespiegelt. Kirche: Schiff (8,5)+(9,5), Turm (9,4).
  // Balance (Simulation 2026-11-19, entwurf/BALANCE.md): das Konkordat zieht zuerst und gewinnt sonst den Lauf zu den neutralen Fahnen –
  // deshalb steht der Turm auf der Ostseite, die Aschenwacht stellt bis in ihren Graben auf (band 4) und rückt wie ein Angreifer vor (ki).
  sanktruss: { id: 'sanktruss', name: 'Sankt Ruß', size: 'Klassisch', cols: 16, rows: 10, zoneA: 2, zoneD: 9, band: 4,
    desc: 'Ein zerschossenes Dorf um eine ausgebrannte Kirche. Beide Seiten stürmen aus ihren Gräben am Dorfrand; dazwischen Häuserkampf um Friedhof, Dorfplatz und die Kirche, die am meisten zählt. Vom Turm sieht und schießt man weiter, schwere Granaten bringen die Kirche zum Einsturz.',
    maxT: 14, reinfTurn: 7, winA: 5, drawA: 4, armyMax: { A: 22, D: 23 },
    objectives: [
      { id: 'gutshof', name: 'Gutshof', c: 5, r: 2, pts: 1 },
      { id: 'friedhof', name: 'Friedhof', c: 8, r: 3, pts: 2 },
      { id: 'kirche', name: 'Kirche von Sankt Ruß', c: 8, r: 5, pts: 3 },   // 3 statt 4 (2026-11-20): die Kirche liegt näher an der Aschenwacht (Turm 3 Felder vor ihrem Graben, 7 vor dem des Konkordats); mit 4 nur 40 % fürs Konkordat
      { id: 'dorfplatz', name: 'Dorfplatz', c: 8, r: 7, pts: 2 },
      { id: 'wegkreuz', name: 'Wegkreuz', c: 10, r: 7, pts: 1 }],
    bauten: [{ art: 'kirche', name: 'Kirche von Sankt Ruß', felder: [[8, 5], [9, 5]], turm: [9, 4] }],
    ki: { D: { prog: 0.6, threat: 0.35, obj: 0.35, cover: 0.5 } },
    // Beide Seiten greifen an: Aschenwacht etwa gleich viel wert wie das Konkordat (940 zu 910 – ein Grenadier-Trupp mehr gleicht den ersten Zug aus), ohne Reserve zur Mitte der Schlacht
    army: { A: { kohorte: 8, mahlwerk: 3, koloss: 3, haubitze: 2, reiter: 2, generalA: 1, hauptA: 1 }, D: { grenadier: 11, sense: 3, geschuetz: 2, sturmpz: 2, lanzeD: 2, minenwerfer: 1, generalD: 1, hauptD: 1 } },
    reinf: [],
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
  selm: { id: 'selm', name: 'Die Ruinen von Selm', size: 'Klein', cols: 14, rows: 11, zoneA: 2, zoneD: 5,
    desc: 'Kurz und hart: ein Graben, ein Drahtgürtel, drei kleine Ziele dicht hinter der Front. Siegen kann nur, wer den Kirchhügel nimmt.',
    maxT: 12, reinfTurn: 6, winA: 5, drawA: 3, armyMax: { A: 20, D: 16 },
    objectives: [
      { id: 'vorfeld', name: 'Vorfeld', c: 3, r: 5, pts: 1 },
      { id: 'nordhof', name: 'Nordhof', c: 7, r: 1, pts: 2 },
      { id: 'kreuz', name: 'Kreuzung', c: 7, r: 5, pts: 3 },
      { id: 'suedwald', name: 'Südwald', c: 8, r: 9, pts: 2 },
      { id: 'ostgraben', name: 'Ostgraben', c: 10, r: 5, pts: 1 }],
    army: { A: { kohorte: 6, mahlwerk: 2, koloss: 2, haubitze: 2, reiter: 2, feldscher: 2, generalA: 1, hauptA: 1 }, D: { grenadier: 6, sense: 4, geschuetz: 2, heiler: 1, generalD: 1, hauptD: 1 } },
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
      T.path([[0, 5], [13, 5]], 'road'); T.path([[7, 0], [7, 10]], 'road');   // die Kreuzung von Selm
      return T.M;
    } },
  lerne: { id: 'lerne', name: 'Das Tal der Lerne', size: 'Mittel', cols: 18, rows: 13, zoneA: 2, zoneD: 7,
    desc: 'Mühle, Bahnhof und Kalkwald vorn, die Nordbrücke über den Kanal und die Höhe 304 im Rücken. Mehrere Wege, mehrere Schwerpunkte.',
    maxT: 16, reinfTurn: 8, winA: 6, drawA: 5, armyMax: { A: 26, D: 24 },
    objectives: [
      { id: 'vorfeld', name: 'Vorfeld', c: 4, r: 6, pts: 1 },
      { id: 'muehle', name: 'Mühle', c: 8, r: 2, pts: 2 },
      { id: 'bahnhof', name: 'Bahnhof', c: 9, r: 6, pts: 3 },
      { id: 'kalkwald', name: 'Kalkwald', c: 10, r: 10, pts: 2 },
      { id: 'nordbruecke', name: 'Nordbrücke', c: 13, r: 3, pts: 1 }],
    army: { A: { kohorte: 10, mahlwerk: 3, koloss: 3, haubitze: 3, reiter: 2, feldscher: 1, moerser: 1, generalA: 1, hauptA: 1 }, D: { grenadier: 12, sense: 6, geschuetz: 3, heiler: 1, minenwerfer: 1, generalD: 1, hauptD: 1 } },
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
      T.line(13, 0, 5, 'canal'); T.set(13, 3, 'bridge'); T.set(13, 4, 'furt');   // Kanal endet am Becken (13,5)
      T.line(14, 0, 4, 'trench', [3]);
      T.line(15, 5, 10, 'trench');
      T.ridge(15, 16, 6, 9);
      T.set(16, 7, 'kirche'); T.set(15, 6, 'bunker'); T.set(15, 9, 'bunker'); T.many([[16, 8], [17, 7]], 'village');
      T.blob(17, 1, 1, 'forest'); T.blob(17, 11, 1, 'forest');
      T.path([[9, 0], [9, 6]], 'rail');   // Bahnlinie läuft durch den Bahnhof weiter nach Norden
      T.path([[0, 2], [8, 2], [13, 3], [16, 7], [17, 7]], 'road'); T.path([[9, 6], [10, 9]], 'road'); T.path([[10, 11], [10, 12]], 'road');
      return T.M;
    } },
  front: { id: 'front', name: 'Die Grauwall-Front', size: 'Groß', cols: 22, rows: 16, zoneA: 2, zoneD: 9,
    desc: 'Die ganze Front: mehrere Grabensysteme, zwei Vorposten, der Kreuzhof, Wald und Kanalschleuse, dahinter die Feste Grauwall. Lange Schlacht.',
    maxT: 18, reinfTurn: 9, winA: 8, drawA: 6, armyMax: { A: 34, D: 32 },
    objectives: [
      { id: 'vorwerk', name: 'Vorwerk', c: 5, r: 8, pts: 1 },
      { id: 'kessel', name: 'Kessel', c: 10, r: 3, pts: 2 },
      { id: 'brand', name: 'Brandstätte', c: 10, r: 12, pts: 2 },
      { id: 'kreuzhof', name: 'Kreuzhof', c: 13, r: 8, pts: 3 },
      { id: 'riegel', name: 'Riegel', c: 16, r: 8, pts: 1 }],
    army: { A: { kohorte: 12, mahlwerk: 4, koloss: 4, haubitze: 4, reiter: 3, feldscher: 2, moerser: 1, generalA: 1, hauptA: 1 }, D: { grenadier: 15, sense: 8, geschuetz: 4, heiler: 1, minenwerfer: 2, generalD: 1, hauptD: 1 } },
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
      T.path([[12, 7], [12, 15]], 'rail');
      T.path([[15, 3], [13, 7], [13, 8]], 'road'); T.path([[0, 8], [13, 8], [19, 7]], 'road');
      T.path([[0, 3], [12, 3]], 'road'); T.path([[0, 12], [10, 12], [17, 13], [21, 13]], 'road');
      return T.M;
    } },
  // Karte nach einem gemalten Bild: Gelände je Feld so, wie es auf dem Bild zu sehen ist (Zeilen = Reihen, Zeichen = Spalten)
  stein: { id: 'stein', name: 'Die Steinbrücke', size: 'Klassisch', cols: 16, rows: 10, zoneA: 2, zoneD: 5, img: 'stein',
    desc: 'Gemalte Karte: Vor dem Fluss die Grabenlinie mit zwei Bunkern, darüber nur die alte Steinbrücke und die Furt am Steg. Dahinter Bunker, Dorf, Fabrik und die Kirche.',
    maxT: 14, reinfTurn: 7, winA: 4, drawA: 3, armyMax: { A: 22, D: 18 },
    objectives: [
      { id: 'sbunkers', name: 'Südbunker', c: 5, r: 8, pts: 1 },
      { id: 'sbunkerw', name: 'Westbunker', c: 6, r: 3, pts: 1 },
      { id: 'steg', name: 'Furt am Steg', c: 7, r: 2, pts: 2 },
      { id: 'steinbr', name: 'Steinbrücke', c: 8, r: 7, pts: 3 },
      { id: 'sbunkero', name: 'Ostbunker', c: 10, r: 3, pts: 1 },
      { id: 'dorfrand', name: 'Dorfrand', c: 11, r: 6, pts: 1 }],
    army: { A: { kohorte: 6, mahlwerk: 3, koloss: 3, haubitze: 2, reiter: 2, generalA: 1, hauptA: 1 }, D: { grenadier: 6, sense: 5, geschuetz: 2, generalD: 1, hauptD: 1 } },
    reinf: ['sturm', 'sturm', 'brand', 'sturm', 'brand', 'geschuetz'],
    grid: [
      'off..==.~VU.WWWW',
      'ffffx=.~~V..WWWW',
      'fffox=.FF...WWWW',
      'fof.x=U~~=U.WWW.',
      '..f.x==~~===....',
      '....x=.~~==..K.V',
      '=....=.B~..VVV+V',
      '=.oo.=.~B=.VVVVV',
      'o..xxU.~~=VVVVVK',
      'oxx..=.~~.VVVVVV'],
    build() { return gridMap(this.grid); } },
  waldfl: { id: 'waldfl', name: 'Der Waldfluss', size: 'Klassisch', cols: 16, rows: 10, zoneA: 2, zoneD: 5, img: 'waldfl',
    desc: 'Gemalte Karte: Dichter Wald auf beiden Seiten, dazwischen ein Fluss mit Holzbrücke und Steg. Bunker im Unterholz, wenig freie Sicht.',
    maxT: 14, reinfTurn: 7, winA: 4, drawA: 3, armyMax: { A: 22, D: 18 },
    objectives: [
      { id: 'wbunkers', name: 'Südbunker', c: 5, r: 8, pts: 1 },
      { id: 'wbunkerw', name: 'Bunker am Hang', c: 6, r: 3, pts: 1 },
      { id: 'wsteg', name: 'Steg', c: 8, r: 2, pts: 2 },
      { id: 'holzbr', name: 'Holzbrücke', c: 8, r: 7, pts: 3 },
      { id: 'wbunkerm', name: 'Waldbunker', c: 10, r: 3, pts: 1 },
      { id: 'ostgraben', name: 'Ostgraben', c: 10, r: 5, pts: 1 }],
    army: { A: { kohorte: 8, mahlwerk: 3, koloss: 2, haubitze: 2, reiter: 2, generalA: 1, hauptA: 1 }, D: { grenadier: 6, sense: 4, geschuetz: 2, generalD: 1, hauptD: 1 } },
    reinf: ['sturm', 'sturm', 'brand', 'sturm', 'brand', 'geschuetz'],
    grid: [
      'WWWW.==.~V..WWWW',
      'WWWW.=..~.U.WWWW',
      'WWWWo=..F=..WWWW',
      'WWW..=U.~=U.WWWW',
      '...WW==~~===....',
      '.....=.~~==..U.W',
      '=....=.B~=.....W',
      '=.o..=.~B=....WW',
      'o..xxU.~~=...WWW',
      '.xx..=.~~...WWWW'],
    build() { return gridMap(this.grid); } },
  kasem: { id: 'kasem', name: 'Die Kasematten', size: 'Klassisch', cols: 16, rows: 10, zoneA: 2, zoneD: 5, img: 'kasem',
    desc: 'Gemalte Karte: Aus dem eigenen Grabengewirr über offenes Feld gegen eine Zickzack-Linie, dahinter zwei Geschützkasematten und ein zerschossener Ort.',
    maxT: 14, reinfTurn: 7, winA: 5, drawA: 4, armyMax: { A: 22, D: 18 },
    objectives: [
      { id: 'eigenb', name: 'Vorderer Bunker', c: 2, r: 7, pts: 1 },
      { id: 'kgraben', name: 'Zickzack-Graben', c: 5, r: 4, pts: 2 },
      { id: 'kbunker', name: 'Grabenbunker', c: 8, r: 3, pts: 3 },
      { id: 'vorwerk', name: 'Ziegelhof', c: 11, r: 7, pts: 2 },
      { id: 'riegelg', name: 'Riegelgraben', c: 12, r: 6, pts: 1 }],
    army: { A: { kohorte: 6, mahlwerk: 3, koloss: 3, haubitze: 2, reiter: 2, generalA: 1, hauptA: 1 }, D: { grenadier: 11, sense: 4, geschuetz: 2, generalD: 1, hauptD: 1 } },
    reinf: ['sturm', 'sturm', 'brand', 'sturm', 'brand', 'geschuetz'],
    grid: [
      'o===.f.~~.fff...',
      '.===fff.~~ff..U.',
      'o==.oof==.f.....',
      '==....==U.......',
      '=x.=====......U.',
      'x.=.=..x........',
      '===..ox.....==..',
      '=.U.o....ooV===V',
      'o.xxx...o.VVVVVK',
      'oxx...........VV'],
    build() { return gridMap(this.grid); } },
  kanal: { id: 'kanal', name: 'Die Kanalstadt', size: 'Klassisch', cols: 16, rows: 10, zoneA: 2, zoneD: 5, img: 'kanal',
    desc: 'Gemalte Karte: Häuserkampf. Ein Kanal teilt die Stadt; hinüber führen die Steinbrücke, die Bahnbrücke und eine Furt. Dahinter Fabrik und Kathedrale.',
    maxT: 14, reinfTurn: 7, winA: 5, drawA: 4, armyMax: { A: 22, D: 18 },
    objectives: [
      { id: 'eigenb', name: 'Vorderer Bunker', c: 2, r: 7, pts: 1 },
      { id: 'kfront', name: 'Vorderer Graben', c: 5, r: 4, pts: 2 },
      { id: 'ksteinbr', name: 'Steinbrücke', c: 8, r: 3, pts: 3 },
      { id: 'kbahnbr', name: 'Bahnbrücke', c: 8, r: 7, pts: 3 },
      { id: 'kfab', name: 'Fabrik', c: 10, r: 2, pts: 2 },
      { id: 'ostviertel', name: 'Ostviertel', c: 11, r: 6, pts: 2 }],
    army: { A: { kohorte: 8, mahlwerk: 3, koloss: 3, haubitze: 2, reiter: 2, generalA: 1, hauptA: 1 }, D: { grenadier: 15, sense: 5, geschuetz: 2, generalD: 1, hauptD: 1 } },
    reinf: ['sturm', 'sturm', 'brand', 'sturm', 'brand', 'geschuetz'],
    grid: [
      'VVVVVVV.~.VVV.VV',
      'V.VVVVV~~..KoVVV',
      'V..VV..~..KV.V+V',
      '.VV.o.=.B.......',
      'o.V=====~~......',
      'o.===.=x.~...K.V',
      '===.oox.~..V.VVV',
      '=.U.oo..BVVVVVVV',
      'o.xxx..~~VVVVVVK',
      'oxx....F..VVVVVV'],
    build() { return gridMap(this.grid); } },
  varn: { id: 'varn', name: 'Das Varntal', size: 'Mittel', cols: 18, rows: 14, zoneA: 2, zoneD: 7,
    desc: 'Ein zusammenhängendes Tal: Die Varn fließt von Nord nach Süd mitten durch Varnheim. Zwei Brücken, zwei Furten, eine Bunkerlinie davor, Bahn und Höhe 212 dahinter.',
    maxT: 16, reinfTurn: 8, winA: 5, drawA: 4, armyMax: { A: 26, D: 24 },
    objectives: [
      { id: 'vorfeld', name: 'Vorfeld', c: 4, r: 6, pts: 1 },
      { id: 'westbunker', name: 'Westbunker', c: 7, r: 3, pts: 1 },
      { id: 'varnwald', name: 'Varnwald', c: 9, r: 2, pts: 2 },
      { id: 'vkirche', name: 'Kirche von Varnheim', c: 10, r: 6, pts: 3 },
      { id: 'suedfurt', name: 'Südfurt', c: 11, r: 9, pts: 2 },
      { id: 'vbruecke', name: 'Nordbrücke', c: 12, r: 3, pts: 1 }],
    army: { A: { kohorte: 8, mahlwerk: 3, koloss: 3, haubitze: 3, reiter: 2, feldscher: 1, moerser: 1, generalA: 1, hauptA: 1 }, D: { grenadier: 17, sense: 6, geschuetz: 3, heiler: 1, minenwerfer: 1, generalD: 1, hauptD: 1 } },
    reinf: ['sturm', 'sturm', 'brand', 'sturm', 'geschuetz'],
    build: () => {
      const T = mapTools(18, 14, 1915);
      // Straßen und Bahn zuerst (nur Zeichen-Merkmale), dann das Gelände
      T.path([[0, 6], [9, 6], [11, 6], [13, 6], [17, 6]], 'road'); T.path([[0, 3], [12, 3], [17, 3]], 'road'); T.path([[13, 6], [16, 10], [17, 11]], 'road');
      T.path([[14, 0], [14, 13]], 'rail');
      // Ausgangsgraben, Niemandsland, Draht, vordere Linie mit zwei Bunkern
      T.line(2, 0, 13, 'trench');
      T.field(3, 5, 0, 13, [['crater', 0.3], ['mud', 0.2]]);
      T.many([[4, 10], [4, 11], [5, 11]], 'sumpf');
      T.line(6, 0, 13, 'wire', [3, 7, 11]);
      T.line(7, 0, 13, 'trench'); T.set(7, 3, 'bunker'); T.set(7, 10, 'bunker');
      T.field(8, 9, 8, 13, [['crater', 0.14]]);
      // Varnwald mit Waldweg
      T.many([[8, 0], [8, 1], [10, 0], [10, 1], [10, 2], [8, 2], [11, 1]], 'wald'); T.path([[9, 0], [9, 3]], 'waldweg');
      // die Varn: von Nord nach Süd, Brücken und Furten
      T.path([[12, 0], [12, 4], [11, 5], [11, 9], [10, 10], [10, 13]], 'canal'); T.path([[12, 0], [12, 4], [11, 5], [11, 9], [10, 10], [10, 13]], 'river');
      T.set(12, 3, 'bridge'); T.set(11, 6, 'bridge'); T.set(11, 9, 'furt'); T.set(10, 12, 'furt');
      T.many([[9, 11], [9, 12]], 'sumpf');
      // Varnheim an beiden Ufern
      T.many([[9, 5], [10, 5], [10, 7], [9, 6]], 'village'); T.set(10, 6, 'kirche'); T.set(9, 7, 'barrikade');
      T.set(12, 6, 'fabrik'); T.many([[13, 5], [12, 7], [13, 6]], 'village');
      T.many([[14, 6], [14, 7], [14, 8]], 'bahn');
      // zweite Linie und Höhe 212
      T.path([[15, 1], [15, 12]], 'trench'); T.set(15, 4, 'bunker'); T.set(15, 9, 'bunker');
      T.ridge(15, 17, 8, 11); T.set(16, 10, 'bunker');
      T.many([[17, 1], [17, 2], [16, 1]], 'forest'); T.many([[17, 12], [17, 13], [16, 13]], 'forest');
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
function bpMax(u) { const T = TYPES[u.type]; if (T.cls === 'art') return T.mobile ? T.mv : (u.limbered ? P.LIMBER_MV : 0); return T.cls === 'cav' || T.cls === 'walker' ? T.mv + 1 : T.mv; }
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
function defaultArmy(side) { if (MAP.army) return Object.assign({}, MAP.army[side]); const a = {}; for (const s of SETUP) if (TYPES[s[0]].side === side) a[s[0]] = (a[s[0]] || 0) + 1; return a; }
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
  const zD = Math.max(MAP.zoneD, COLS - (+(TOG.M_band || 0) || MAP.band || P.D_BAND)), depth = COLS - zD, placed = [];   // Siegpunkt-Modus: beide starten am eigenen Rand
  const role = t => { const T = TYPES[t]; return T.cls === 'art' && !T.mobile ? 'art' : (T.cls === 'medic' || T.relay || T.mobile) ? 'back' : T.mg ? 'mg' : 'inf'; };
  const objs = OBJECTIVES.slice().sort((a, b) => b.pts - a.pts || a.c - b.c);
  const score = (t, c, r) => {
    const h = G.map[c][r], rl = role(t), d = (c - zD) / depth;
    let v = { trench: 3, village: 2.6, forest: 2, crater: 0.6, open: 0, mud: -1, wire: -4, bridge: 1, bunker: 3.6, fabrik: 3, kirche: 2.8, barrikade: 2.8, wald: 2.2, waldweg: 0.8, bahn: 1, furt: -2, sumpf: -2, schiff: 3.4, turm: 3.4, garten: 0.8, friedhof: 0.8 }[h.t] || 0;
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
  if (army) deploy(G, side, army); else if (SETUP) { for (const s of SETUP) if (TYPES[s[0]].side === side) addUnit(G, s[0], s[1], s[2], s[3]); } else deploy(G, side, defaultArmy(side));
  for (const u of G.units) if (u.side === side) { if (TYPES[u.type].mg) u.setup = true; if (TYPES[u.type].mines) u.mines = TYPES[u.type].mines; if (TYPES[u.type].counterStrike) u.cready = true; }
}
function newGame(opts) {
  opts = opts || {};
  useMapArmy(opts.map);
  const G = {
    mapId: MAP.id, maxT: MAP.maxT || P.MAXT, winA: MAP.winA || P.WIN_A, drawA: MAP.drawA || P.DRAW_A, reinfTurn: MAP.reinfTurn || P.REINF_TURN,
    map: buildMap(), units: [], turn: 1, side: 'A', over: null,
    rng: mulberry32(opts.seed != null ? opts.seed : (Date.now() & 0xffffffff)),
    mischen: !!opts.mischen, ctrl: {}, nextId: 1, clouds: [], smoke: [], lit: [], tunnels: [], mines: [], marks: [], fires: [], wind: 1, reinfDone: false, pts: { A: 0, D: 0 }, mechs: !!opts.mechs,
    bauten: (MAP.bauten || []).map(b => ({ ...b, hp: +(TOG.M_kirche || 0) || P.KIRCHE_HP, max: +(TOG.M_kirche || 0) || P.KIRCHE_HP, kaputt: false }))   // große Gebäude mit Bauzustand (Kirche)
  };
  for (const o of OBJECTIVES) G.ctrl[o.id] = null;   // Zielfelder sind zu Beginn neutral (Wunsch des Nutzers)
  G.vp = { A: 0, D: 0 }; G.goal = +(TOG.M_goal || 0) || MAP.goal || Math.round(OBJECTIVES.reduce((n, o) => n + o.pts, 0) * P.GOAL_K);
  G.armee = {};
  for (const side of ['A', 'D']) {
    const army = opts.army && opts.army[side];
    if (army && (opts.free || armyOk(side, army, !!opts.mechs))) { deploy(G, side, army); G.armee[side] = army; }   // free: nur für Tests ohne Budgetgrenze
    else if (SETUP) { for (const s of SETUP) if (TYPES[s[0]].side === side) addUnit(G, s[0], s[1], s[2], s[3]); }
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
function cutCost(u) { return 1; }
function cost(G, u, c, r) {
  const t = hex(G, c, r).t, k = cls(u);
  if (!TOG.NOROAD && hex(G, c, r).road && TERRAIN[t].cost > 1 && !['wire', 'canal', 'trench', 'wald', 'sumpf', 'furt'].includes(t) && k !== 'cav') return 1;   // Straße
  if (t === 'canal') return 99;
  if (KIRCHE.has(t) && (k === 'cav' || k === 'walker' || k === 'art')) return 99;   // Kirche: nur Fußtruppen und Anführer
  if ((t === 'garten' || t === 'friedhof') && (k === 'walker' || k === 'art')) return 2;   // niedrige Mauern
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
      if ((here !== s0 || !first) && ((hex(G, c, r).t === 'wire' && T.cls !== 'walker' && !wireProof(T)) || (!free && isZOC(G, c, r, u.side)))) continue;
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
function autoFace(G, u) {
  const e = nearestEnemy(G, u);
  if (e && dist(u.c, u.r, e.c, e.r) <= 4) u.face = faceIndex(angleTo(u.c, u.r, e.c, e.r));
  else u.face = u.side === 'A' ? 0 : 3;
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
    if (h.t === 'wire' && T.cls !== 'walker' && !wireProof(T) && !TOG.NOWIREDMG) {   // Stacheldraht: Schnitte und Hängenbleiben kosten Stärke
      flush(); ev.push({ t: 'wirehurt', u: u.id, c: nc, r: nr });
      const n0 = ev.length; applyDamage(G, null, u, P.WIRE_DMG * (0.8 + G.rng() * 0.4), 'front', ev, { morMul: 0.5 });
      for (let i = n0; i < ev.length; i++) if (ev[i].t === 'hit') ev[i].wire = true;   // Anzeige: kleines, dunkles Blut
      if (!alive(u) || u.status !== 'ok') { claimObjective(G, u); ev.push(...checkEnd(G)); return ev; }
    }
    claimObjective(G, u);
    if (T.cls === 'walker' && (h.t === 'mud' || h.t === 'sumpf') && G.rng() < P.STUCK * (h.t === 'sumpf' ? 2 : 1)) { flush(); u.stuck = P.PANNE_RUNDEN + 1; u.bp = 0; ev.push({ t: 'stuck', u: u.id }); break; }
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
    for (const e of G.units) if (e.side !== u.side && active(e) && !e.seenWalker && cls(e) !== 'walker' && dist(e.c, e.r, u.c, u.r) <= 2) {
      e.seenWalker = true; e.mor = Math.max(0.5, e.mor - P.WALKER_FEAR);
      ev.push({ t: 'fear', u: e.id, morv: e.mor });
    }
    if (G.rng() < P.BREAKDOWN) { u.broken = P.PANNE_RUNDEN + 1; u.attacked = true; ev.push({ t: 'breakdown', u: u.id }); }   // fällt die nächsten 3 eigenen Runden aus
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
  if (u.limbered) { u.limbered = false; u.bp = 0; u.attacked = true; u.moved = u.ap <= 0; }
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
  if (rng >= 1 && hex(G, a.c, a.r).t === 'turm') rng += P.TURM_RNG;   // Kirchturm: weiter schießen
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
    if (t === 'forest' || t === 'village' || t === 'wald' || t === 'fabrik' || t === 'kirche' || KIRCHE.has(t)) return false;
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
function immune(A, D) { return D.cls === 'walker' && !A.at && (A.cls === 'inf' || A.cls === 'mg' || A.cls === 'cav' || A.cls === 'storm'); }
function nahFrei(a) { const T = TYPES[a.type]; return T.cls === 'cav' || T.cls === 'storm' || !!T.suit || !!T.nahSchreiter || !!a.sturmlauf || (a.bpUsed || 0) <= bpMax(a) / 2; }
// F31 (2026-11-20): Nahkampf-Schreiter (Ordens-, Säge-, Klauenschreiter, Eisenknecht, Kreuzschreiter) dürfen nach mehr als halber Bewegung noch in den Nahkampf, schießen dann aber nicht mehr
const NAH_SCHREITER = ['orden', 'saeger', 'klaue', 'knecht', 'kreuz'];
for (const t of NAH_SCHREITER) if (TYPES[t]) TYPES[t].nahSchreiter = true;
function schussNachZug(a) { return !(TYPES[a.type].nahSchreiter && (a.bpUsed || 0) > bpMax(a) / 2); }   // Nahkampf nur mit höchstens halb verbrauchten BP
function canMelee(G, a, d) {
  return active(a) && a.ap >= 1 && !a.attacked && !a.broken && !(a.supp > 0 && !TOG.NOSUPP) && TYPES[a.type].atk > 0 && alive(d) && d.side !== a.side && dist(a.c, a.r, d.c, d.r) === 1 && nahFrei(a);
}
// Dauerfeuer (2026-11-20): nach der ersten Salve der Runde ist eine zweite frei (dfN 1), danach kühlt das MG eine eigene Runde lang ab (kuehl)
function dauerOk(a) { const T = TYPES[a.type]; return !!T.dauerfeuer && a.attacked && (a.dfN || 0) === 1 && !(a.kuehl > 0) && !a.fellBack && !(a.supp > 0); }
function canFire(G, a, d) {
  const T = TYPES[a.type];
  const bs = T.broadside && a.attacked && (a.bsT || []).length === 1 && !a.bsT.includes(d.id) && dist(a.c, a.r, d.c, d.r) <= 2;   // Breitseite: zweiter Schuss
  const df = dauerOk(a);   // Dauerfeuer (Eiserne Hünen): zweite Salve in derselben Runde
  if (T.dauerfeuer && a.kuehl > 0) return false;   // MG kühlt ab
  if (!active(a) || (a.attacked && !bs && !df) || a.broken || !T.rng || T.cls === 'art' || !alive(d) || d.side === a.side) return false;
  if ((a.ap < 1 && !bs && !df) || (T.mg && !a.setup && !TOG.NOSETUP)) return false;   // MG muss aufgebaut sein; zweiter Schuss der Breitseite gehört zur Aktion
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
  if (KIRCHE.has(t)) { m *= P.KIRCHE_DEF; tags.push(`${t === 'turm' ? 'Kirchturm' : 'Kirche'} ×${String(P.KIRCHE_DEF).replace('.', ',')}`); }
  if ((t === 'garten' || t === 'friedhof') && ranged) { m *= P.GARTEN_DEF; tags.push(`${t === 'garten' ? 'Gartenmauer' : 'Friedhofsmauer'} ×${String(P.GARTEN_DEF).replace('.', ',')}`); }
  if (t === 'barrikade') { m *= 1.6; tags.push('Barrikade ×1,6'); }
  if (t === 'bahn' && ranged) { m *= 1.3; tags.push('Bahndamm ×1,3'); }
  if (d.holdB) { m *= P.HOLD_DEF; tags.push('Halten um jeden Preis ×1,25'); }
  if (d.dug) { m *= P.DIG_DEF; tags.push('eingegraben ×1,3'); }
  return m;
}
// Deckung durch das Gelände für die Anzeige (Schild Bronze/Silber/Gold): Faktor gegen Beschuss von vorn; Stufe 0–3
function coverOf(G, u) { const f = defMods(G, u, 'front', true, []); return { f, tier: f >= 1.7 ? 3 : f >= 1.35 ? 2 : f >= 1.15 ? 1 : 0 }; }
function hexDef(G, c, r, isWalker) {
  const t = hex(G, c, r).t;
  return KIRCHE.has(t) ? P.KIRCHE_DEF : t === 'village' || t === 'kirche' ? (isWalker ? 0.7 : P.VILLAGE_DEF) : t === 'fabrik' ? (isWalker ? 0.7 : 1.7) : t === 'forest' ? P.FOREST_DEF : t === 'wire' ? P.WIRE_DEF
    : t === 'furt' ? 0.8 : t === 'wald' ? 1.5 : t === 'waldweg' ? 1.2 : t === 'bunker' ? 2 : t === 'barrikade' ? 1.6 : 1;
}

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
  if (D.cls === 'walker') {
    if (ranged && immune(A, D)) { m = 0; tags.push('Panzerung: wirkungslos'); }
    if (ranged && A.at) { m *= A.at; tags.push((A.cls === 'walker' ? 'Kanone gegen Panzerung ×' : 'Panzerbüchse ×') + String(A.at).replace('.', ',')); }
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
  if (ranged && a.fireFree) { m *= P.FIRE_FREE; tags.push('Feuer frei ×1,25'); }
  if (ranged && TYPES[a.type].broadside) { m *= P.BROADSIDE; tags.push('Breitseite ×0,6'); }
  if (!ranged && TYPES[a.type].blastLance && !a.lanceUsed) { m *= P.BLAST_LANCE; tags.push('Sprenglanze ×1,5'); }
  if (ranged && G.units.some(o => o.shields && o.side === d.side && active(o) && dist(o.c, o.r, d.c, d.r) === 1)) { m *= P.SHIELDS; tags.push('Schilde vor ×0,75'); }
  if (a.supp > 0) { m *= P.SUPP_ATK; tags.push('niedergehalten ×0,5'); }
  if (a.gassed) { m *= P.GAS_ATK; tags.push('im Gas ×0,7'); }
  let dm = 1;
  if (flame) tags.push('Flammen: Deckung schützt nicht');
  else dm = defMods(G, d, geo, ranged, tags, (!ranged && A.cls === 'storm') || (ranged && A.lob), ranged && A.lob);
  if (ranged && litAt(G, d.c, d.r, a.side)) { m *= 1.25; tags.push('ausgeleuchtet ×1,25'); }
  if (ranged && smokeAt(G, d.c, d.r)) { m *= P.NEBEL_IN; tags.push('Ziel im Nebel ×0,5'); }
  if (ranged && smokeAt(G, ac, ar)) { m *= P.NEBEL_AUS; tags.push('aus dem Nebel ×0,75'); }
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
  if ((t === 'trench' || t === 'bunker' || KIRCHE.has(t)) && !o.flame) ml *= 0.5;
  if (officerAt(G, d.side, d.c, d.r)) ml *= P.OFFICER_MOR;
  if (bannerAt(G, d.side, d.c, d.r)) ml *= 0.75;
  d.mor = Math.max(0, d.mor - ml);
  ev.push({ t: 'hit', u: d.id, dmg, str: d.str, morv: d.mor });
  if (d.str < 0.3) { killUnit(G, d, ev, 'destroyed'); return; }
  if (d.status === 'rout') return;
  if ((d.str < P.ROUT_STR || d.mor <= 0) && noFlee(G, d)) { d.mor = Math.max(d.mor, 0.1); ev.push({ t: 'steadfast', u: d.id }); return; }   // hält stand
  if (d.str < P.ROUT_STR || d.mor <= 0) { routUnit(G, d, a, ev); return; }
  if (d.mor < P.FALLBACK_MOR && cls(d) !== 'art' && !(d.supp > 0 && !TOG.NOSUPP)) fallBack(G, d, a, ev);   // Niedergehaltene bleiben liegen
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
    applyDamage(G, a, d, p.dmg * (0.75 + G.rng() * 0.5) * P.ZWEIT_MUL * (Z.kanone && cls(d) === 'walker' ? 2 : 1), p.arc, ev, { ranged: true });   // Kanone: gegen Panzerung voll
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
  if (TYPES[a.type].blastLance && !a.lanceUsed) { a.lanceUsed = true; ev.push({ t: 'lanceblast', a: a.id, c: d.c, r: d.r }); }   // Sprenglanze (preview hat ×1,5 schon eingerechnet)
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
    a.c = dc; a.r = dr; a.dug = false;
    if (k === 'walker' && hex(G, dc, dr).t === 'wire') { hex(G, dc, dr).t = 'open'; ev.push({ t: 'crush', u: a.id, c: dc, r: dr }); }
    claimObjective(G, a);
    ev.push({ t: 'advance', u: a.id, path: [[fc, fr], [dc, dr]] });
  }
  for (const x of ev) x.nk = nk;
  ev.push(...checkEnd(G));
  return ev;
}
function claimObjective(G, u) {
  if (!active(u) || cls(u) === 'art') return;
  const o = hex(G, u.c, u.r).obj;
  if (o && G.ctrl[o] !== u.side) { G.ctrl[o] = u.side; G.pts[u.side] += OBJECTIVES.find(x => x.id === o).pts * P.PTS_OBJ; }
}

// ---------- Artillerie ----------
function spotted(G, side, c, r) {
  if (litAt(G, c, r, side)) return true;
  if (smokeAt(G, c, r)) return false;   // in den Nebel hinein sieht kein Beobachter (Artillerie, Feuerschlag, Markieren)
  return G.units.some(u => u.side === side && active(u) && cls(u) !== 'art' && dist(u.c, u.r, c, r) <= sichtOf(G, u) && hasLOS(G, u.c, u.r, c, r, TYPES[u.type].aerial));
}
function sichtOf(G, u) { const t = hex(G, u.c, u.r).t; return Math.max(TYPES[u.type].spot || P.SPOT, t === 'kirche' ? 6 : 0) + (t === 'turm' ? P.TURM_SPOT : 0); }   // alter Kirchturm 6 Felder, Sankt Ruß +1
// ---------- Große Gebäude (Kirche von Sankt Ruß) ----------
function bauAt(G, c, r) { const i = inMap(c, r) ? hex(G, c, r).bau : null; return i != null && G.bauten && G.bauten[i] && !G.bauten[i].kaputt ? G.bauten[i] : null; }
const schwereWaffe = a => { const T = a && TYPES[a.type]; return !!T && (T.cls === 'art' || (T.cls === 'walker' && !T.gat && !T.mgfire && T.rng >= 2)); };
// Treffer schwerer Waffen auf ein Kirchenfeld ziehen den Bauzustand herunter; bei 0 stürzt die Kirche ein
function kircheTreffer(G, a, c, r, ev, n = 1) {
  const b = bauAt(G, c, r); if (!b || !schwereWaffe(a) || TOG.NOEINSTURZ) return;
  b.hp = Math.max(0, b.hp - n); ev.push({ t: 'bauschaden', bau: G.bauten.indexOf(b), hp: b.hp, max: b.max, c, r });
  if (b.hp <= 0) einsturz(G, b, ev);
}
function einsturz(G, b, ev) {
  b.kaputt = true; const i = G.bauten.indexOf(b), felder = [...b.felder, ...(b.turm ? [b.turm] : [])];
  for (const [c, r] of felder) hex(G, c, r).t = 'village';   // Kirche und Turm werden Ruine (Abwehr ×1,5), Turmvorteil weg
  ev.push({ t: 'einsturz', bau: i, c: b.turm ? b.turm[0] : felder[0][0], r: b.turm ? b.turm[1] : felder[0][1], felder });
  for (const [c, r] of felder) { const u = unitAt(G, c, r); if (!u || !alive(u)) continue;
    applyDamage(G, null, u, P.EINSTURZ_DMG * (0.8 + G.rng() * 0.4), 'front', ev, {});
    if (active(u) && !u.supp) { u.supp = 1; ev.push({ t: 'supp', u: u.id }); } }
}
function isDirect(G, a, c, r) { return dist(a.c, a.r, c, r) <= P.ART_DIRECT && hasLOS(G, a.c, a.r, c, r); }
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
  return d >= minSteil(a) && spotted(G, a.side, c, r);   // F37
}
// Markiertes Ziel (Ballonbeobachter, Signaltrupp): keine Streuung, Sprenggranaten ×1,25 – gilt bis zum nächsten eigenen Zug
function guided(G, side, c, r) { return (G.marks || []).some(m => m.side === side && m.c === c && m.r === r); }
function shellDmg(G, a, d, direct, tags) {
  tags = tags || [];
  let m = 1;
  if (cls(d) === 'walker' && direct) { m *= P.ART_VS_WALKER; tags.push('direkter Schuss auf Koloss ×2,5'); }
  if (direct && smokeAt(G, d.c, d.r)) { m *= P.NEBEL_IN; tags.push('Ziel im Nebel ×0,5'); }   // direkter Schuss in den Nebel
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
// Sperrfeuer: Geschütze decken Ziel und alle Nachbarn (7 Felder), Mörser nur Ziel und die zwei Nachbarn zum Schützen hin (Wunsch des Nutzers: kleineres Gebiet)
function barrageCells(G, a, c, r) {
  const nb = neighbors(c, r);
  if (!TYPES[a.type].mobile) return [[c, r], ...nb];
  const d = h => dist(a.c, a.r, h[0], h[1]) + Math.hypot(h[0] - a.c, h[1] - a.r) * 0.001;
  return [[c, r], ...nb.slice().sort((x, y) => d(x) - d(y)).slice(0, 2)];
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
  } else if (mode === 'barrage') {
    for (const [hc, hr] of barrageCells(G, a, tc, tr)) {
      const u = unitAt(G, hc, hr);
      if (u && alive(u)) applyDamage(G, a, u, shellDmg(G, a, u, false) * P.BARRAGE_DMG * (0.75 + G.rng() * 0.5), 'front', ev, { ranged: true });   // Paket 8: Schaden ×0,7 eines Einzelschusses
      if (u && active(u) && cls(u) !== 'walker' && !u.supp) { u.supp = 1; ev.push({ t: 'supp', u: u.id }); }
    }
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
    if (G.rng() < P.WIND_SHIFT) { G.wind = (G.wind + (G.rng() < 0.5 ? 1 : 5)) % 6; ev.push({ t: 'wind', dir: G.wind }); }
    if (G.clouds.length) {
      for (const k of G.clouds) { k.ttl--; const p = step(k.c, k.r, G.wind); k.c = p[0]; k.r = p[1]; }
      G.clouds = G.clouds.filter(k => k.ttl > 0 && inMap(k.c, k.r));
      ev.push({ t: 'gascloud' });
    }
  }
  if (s === 'D' && G.turn === G.reinfTurn && !G.reinfDone && REINF.length) {   // F44: Karten ohne Welle (Grauwall) melden nichts
    G.reinfDone = true;
    const ids = [];
    const RO = rowsOut();
    const list = REINF.map((x, i) => Array.isArray(x) ? x : [x, COLS - 1 - (i >= ROWS ? 1 : 0), RO[i % ROWS], null]);
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
      u.ap = P.AP; u.bp = bpMax(u); u.bpUsed = 0; u.sturmlauf = false; u.mvd = 0; u.zocStop = false; u.moved = false; u.attacked = false; u.turnOnly = false; u.run = 0; u.gassed = false; u.sent = false; u.ow = false; u.ordered = false; u.ammoed = false; u.fellBack = false; u.sperr = 0; u.fireFree = false; u.shields = false; u.bsT = []; u.task = null; u.zw = false; u.holdB = false; u.gedreht = false;
      for (const k of ['cd', 'cdR', 'cdS', 'cdH', 'cdB', 'cdA', 'cdP', 'cdG', 'kuehl']) if (u[k] > 0) u[k]--;
      u.dfN = 0;
      if (u.revealed > 0) u.revealed--;
      if (TYPES[u.type].counterStrike) u.cready = true;
      if (u.stuck > 0) { u.stuck--; if (!u.stuck) ev.push({ t: 'unstuck', u: u.id }); }
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
function canSend(G, m, t) { return active(m) && !!TYPES[m.type].courier && m.side === G.side && m.ap >= 1 && !(m.supp > 0) && !m.sent && t && t !== m && t.side === m.side && active(t) && !t.broken && !TYPES[t.type].courier && (t.ap || 0) < 3 && dist(m.c, m.r, t.c, t.r) <= 3; }
function sendOrder(G, m, t) { if (!canSend(G, m, t)) return []; m.sent = true; spend(m, 1); t.bp = (t.bp || 0) + P.MELDER_BP; t.moved = false; return [{ t: 'sent', u: t.id, by: m.id, bp: t.bp }]; }   // Meldegänger: +2 BP

// MG aufbauen (1 Punkt): erst dann feuert es und gibt Reaktionsfeuer. Ziehen baut es wieder ab.
function canSetup(G, u) { return active(u) && !!TYPES[u.type].mg && u.side === G.side && !u.setup && (u.bp || 0) >= 1 && !u.broken && u.supp <= 0; }   // 1 BP, nimmt alle restlichen BP
function setupMG(G, u) { if (!canSetup(G, u)) return []; u.setup = true; u.bp = 0; u.moved = u.ap <= 0; return [{ t: 'setup', u: u.id }]; }
// MG abbauen (Wunsch 2026-11-16): eigene Aktion für 1 Aktionspunkt. Aufgebaut kann das MG schießen, aber nicht ziehen; abgebaut umgekehrt.
function canTeardown(G, u) { return active(u) && !!TYPES[u.type].mg && u.side === G.side && !!u.setup && (u.bp || 0) >= 1 && !u.broken && !TOG.NOSETUP; }   // 1 BP
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
  sprung: { name: 'Sprungangriff', icon: '⤴', ap: 1, cd: 2, atk: true, all: true }
};
const FORT = ['trench', 'bunker', 'barrikade', 'kirche', 'fabrik', 'village', 'schiff', 'turm'];
function gasSafe(G, u) { return !!TYPES[u.type].gasproof || TYPES[u.type].cls === 'walker' ||   // Kolosse und Maschinen: geschlossen, immun
   G.units.some(o => o.side === u.side && active(o) && TYPES[o.type].gasproof && dist(o.c, o.r, u.c, u.r) === 1); }
// Sturmlauf: gerade Linie (eine der 6 Richtungen), 1–4 Felder, keine Einheit im Weg, Ziel frei und betretbar; Draht hält nicht auf
function rushPath(G, u, c, r) {
  if (u.mvd || u.ap < 1 || unitAt(G, c, r)) return null;   // Sturmlauf: die Aktion, nur aus dem Stand
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
function abilTargets(G, u) {
  const T = TYPES[u.type], k = T.abil, A = ABILS[k];
  if (!A || !active(u) || u.side !== G.side || u.ap < 1 || u.cdA > 0 || u.supp > 0 || u.broken > 0 || (A.atk && u.attacked)) return [];
  const out = [], foe = (c, r) => { const x = unitAt(G, c, r); return x && x.side !== u.side ? x : null; };
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) {
    const d = dist(u.c, u.r, c, r), t = hex(G, c, r).t, x = unitAt(G, c, r);
    if (k === 'smoke' && d >= 1 && d <= 3) out.push([c, r]);
    else if (k === 'tunnel' && d >= 1 && d <= 2 && FORT.includes(t) && !(x && x.side === u.side) && !G.tunnels.some(q => q.c === c && q.r === r)) out.push([c, r]);
    else if (k === 'charge' && d === 1 && (foe(c, r) || (!x && ['bunker', 'barrikade', 'wire'].includes(t)))) out.push([c, r]);
    else if (k === 'mine' && !(T.wirelayer && u.attacked) && d === 1 && (u.mines || 0) > 0 && !x && !hex(G, c, r).obj && cost(G, { type: 'grenadier', side: u.side }, c, r) < 99 && !G.mines.some(q => q.c === c && q.r === r)) out.push([c, r]);
    else if (k === 'light' && d >= 1 && d <= 4 && hasLOS(G, u.c, u.r, c, r)) out.push([c, r]);
    else if (k === 'clear' && d === 0 && G.clouds.some(q => dist(q.c, q.r, c, r) <= 1)) out.push([c, r]);
    else if (k === 'rush' && rushPath(G, u, c, r)) out.push([c, r]);
    else if (k === 'sprung' && x && x.side !== u.side && alive(x) && d <= P.SPRUNG + 1 && sprungLand(G, u, x)) out.push([c, r]);
    else if ((k === 'mark' || k === 'strike') && d >= 1 && d <= (T.spot || P.SPOT) && !smokeAt(G, c, r) && hasLOS(G, u.c, u.r, c, r, T.aerial) && !(k === 'mark' && guided(G, u.side, c, r))) out.push([c, r]);
    else if (k === 'ammo' && !u.task && d === 1 && x && x.side === u.side && active(x) && (TYPES[x.type].mg || TYPES[x.type].cls === 'art') && x.attacked && !x.ammoed) out.push([c, r]);
  }
  return out;
}
function canAbil(G, u, c, r) { return abilTargets(G, u).some(([a, b]) => a === c && b === r); }
function useAbil(G, u, c, r) {
  if (!canAbil(G, u, c, r)) return [];
  const T = TYPES[u.type], k = T.abil, A = ABILS[k], ev = [];
  spend(u, 1); u.cdA = A.cd; if (A.atk) u.attacked = true; if (A.all) { u.ap = 0; u.bp = 0; u.moved = true; }
  u.face = faceToward(u.face, u.c, u.r, c, r);
  const area = [[c, r], ...neighbors(c, r)].filter(([a, b]) => inMap(a, b));
  if (k === 'smoke') { for (const [a, b] of area) if (!smokeAt(G, a, b)) G.smoke.push({ c: a, r: b, side: u.side }); ev.push({ t: 'smoke', u: u.id, c, r, cells: area }); }
  else if (k === 'tunnel') { G.tunnels.push({ c, r, side: u.side, t: 2, by: u.id }); ev.push({ t: 'tunnel', u: u.id, c, r }); }
  else if (k === 'charge') {
    const d = unitAt(G, c, r); ev.push({ t: 'blast', u: u.id, c, r });
    if (d && d.side !== u.side) {
      const wk = cls(d) === 'walker', dmg = P.CHARGE_DMG * (wk ? 2 : 1) * (0.4 + 0.6 * u.str / 10) * (0.8 + G.rng() * 0.4) / Math.max(1, TYPES[d.type].def / 4);
      applyDamage(G, u, d, dmg, 'front', ev);
      if (alive(d) && wk && G.rng() < 0.5) { d.broken = Math.max(d.broken || 0, 1); ev.push({ t: 'breakdown', u: d.id }); }
    }
    const h = hex(G, c, r);
    if (h.t === 'bunker' || h.t === 'barrikade') { h.t = 'crater'; ev.push({ t: 'terrain', c, r, what: 'gesprengt' }); }
    else if (h.t === 'wire') { h.t = 'open'; ev.push({ t: 'terrain', c, r, what: 'Draht zerrissen' }); }
    ev.push(...checkEnd(G));
  }
  else if (k === 'mine') { G.mines.push({ c, r, side: u.side }); u.mines--; if (T.wirelayer) u.attacked = true;   // Drahtpioniere: Mine statt Draht
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
function canBuy(G, side, type) { return !G.over && !(TYPES[type].stufe3 && G.units.some(u => u.side === side && TYPES[u.type].stufe3)) && !(TYPES[type].cmd === 2 && G.units.some(u => u.side === side && alive(u) && TYPES[u.type].cmd === 2)) && (G.mechs || !isMech(type)) && G.side === side && SHOP[side].includes(type) && G.pts[side] >= COST[type]; }
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

const E = {
  P, SIDES, TYPES, TERRAIN, MAPS, costParts, deploy, barrageCells, coverOf, defMods, useMap: useMapArmy, totalPts: () => OBJECTIVES.reduce((n, o) => n + o.pts, 0), COST, SHOP, spawnHexes, canBuy, buy, limber, canLimber, heal, canHeal, order, canOrder, cmdRange, canSend, sendOrder, pass, canCut, guided, layWire, canLay, layTarget, bannerAt, defaultArmy, armyCost, armyCount, armyOk, ARMY_BUDGET, ARMY_MAX, ARMY_MIN, ROSTER, isMech, buildMap,
  newGame, startTurn, endTurn, bpMax, fahrzeugArt, nahFrei, reachable, moveUnit, turnUnit, drehKosten, fanOf, angDiff, faceToward, startZone, inStartZone, canPlaceStart, aufstellen, autoAufstellen, cutWire, canCut, cutTargets, canZweit, zweitTargets, zweitFire, fire, melee, shell,
  canMarch, cutCost, canSetup, setupMG, canTeardown, teardownMG, inFan, MG_FAN, canOverwatch, overwatch, canRecover, recover, canOrderKind, orderCd,
  sizeOf, heldAt, held,
  roar, canRoar, roarTargets, faust, canFaust, faustTargets, sprungLand, dauerOk, feindNah, minSteil, schussNachZug, leererDraht, ABILS, abilTargets, canAbil, useAbil, canSperr, sperr, fireAt, canDig, dig, canShields, shieldsUp, rushPath, orderKinds, canBig, bigOrder, BIG, canPlant, plantBanner, noFlee, smokeAt, litAt, concealed, gasSafe, wireProof, openGround, hasFlanks, freeBlows,
  canFire, canMelee, canShell, preview, shellDmg, gasCells, isDirect, spotted, immune, sichtOf, bauAt, schwereWaffe, KIRCHE,
  unitAt, hex, neighbors, step, dist, angleTo, faceIndex, arcOf, inMap, cloudAt, cost,
  isZOC, adjEnemies, losses, points, alive, active, cls, hasLOS, rangeOf, officerAt, key, mulberry32, nearestEnemy
};
for (const [k, f] of Object.entries({ COLS: () => COLS, ROWS: () => ROWS, OBJECTIVES: () => OBJECTIVES, SETUP: () => SETUP, REINF: () => REINF, MAP: () => MAP, ARMY_CAP: () => ARMY_CAP, ARMY_WALKERS: () => ARMY_WALKERS }))
  Object.defineProperty(E, k, { get: f, enumerable: true });
if (typeof module !== 'undefined' && module.exports) module.exports = E; else root.E = E;
})(this);
