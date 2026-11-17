# Armargeddon – Hinweise für die Weiterarbeit

## Projektziel
Rundenbasiertes Hexfeld-Strategiespiel im Browser, angelehnt an den Ersten Weltkrieg, aber in einer eigenen Welt. **Reiner Spielspaß, kein Lernspiel.** Die Texte „Im echten Krieg“ sind Beiwerk, keine Lehrinhalte.

## Feste Regeln
- **Diese Dateien NIE komplett lesen** (eingebettete Bilder/Töne, mehrere MB): `src/art.js`, `src/mapimg.js`, `src/fx.js`, `src/sound.js`, `src/paint.js`, `src/uiart.js`, `src/uipanel.js`, `src/titlebg.js`, `src/gelaende.js`, `src/fonts.css`. Nur gezielt mit Grep nach Schlüsseln suchen oder mit offset/limit kleine Stücke lesen.
- Sprache in Spiel und Texten: Deutsch. Sachlicher Ton, Krieg nicht verherrlichen. Blut darf deutlich sein, bleibt aber abschaltbar.
- Eigene Welt, keine fremden Marken oder Figuren (kein Warhammer o. ä.). Jede Einheit hat einen Text „Im echten Krieg“ mit belegbaren Fakten zum Ersten Weltkrieg.
- Nur in `src/` ändern, danach `python3 tools/build.py`. `index.html` im Hauptordner ist erzeugt und wird mit eingecheckt (GitHub Pages).
- Nach jeder Regeländerung `node tools/sim.js 200` laufen lassen und Siegquote, Dauer und Verluste je Typ berichten. Sehr empfindlich: eine Einheit mehr oder weniger verschiebt die Quote um 20–40 Punkte.
- **Zielgeräte: nur PC und große Touch-Displays (Digitalboards), ab 1280 px Breite.** Handy wird nicht mehr optimiert und nicht mehr getestet; vorhandenen Handy-Code nicht extra ausbauen, nur nicht mehr pflegen.
- **Touch muss überall funktionieren:** Tooltips auch per Antippen bzw. langem Drücken, Knöpfe groß genug für Finger (mindestens 40 px).
- Vor „fertig“ im Browser testen: 1920 px, dazu 1280 px (kleinste Zielbreite) und 2560 px. Die obere Leiste darf bei keiner Breite ab 1280 px über den Rand laufen.
- **Jede UI-Änderung hält sich an `STYLE.md`** (Palette, Schrift, Freund/Feind-Formen, Grundregel „Rahmen dreckig, Inhalte sauber“).
- Git: Repo ist mit github.com/erolfe-glitch/Armargeddon verbunden (Branch main). Commits als „Claude <noreply@anthropic.com>“.

## Designvorgaben (Wünsche des Nutzers)
- Oberfläche klar halten, „nicht zu doll“; wenig Text; PC und Digitalboards ab 1280 px, kein Handy.
- Oberfläche komplett aus dem UI-Bogen des Nutzers (uiart.js): Eisenrahmen, Pergament, Holzleisten, Stacheldraht, Rohrbalken; Text kommt aus dem HTML, nicht aus den Bildern.
- Seitenfarben: Konkordat Ochsenblut (#8E2B22), Aschenwacht Feldgrau (#7D8471), Blaue Legion Horizontblau (siehe STYLE.md). Serifenschrift für Titel, Runde, Hauptknopf.
- Menüs und Schrift groß genug; Fähigkeiten als goldene Schlagworte sichtbar; „i Info“-Knopf; Nachschub-Knopf golden.
- Weniger Felder, etwas größere Figuren; Gerät und Pferde größer im Verhältnis zu Soldaten. Figuren dürfen Nachbarfelder nicht verdecken.
- Zustandsmarken klein links am Standring als Symbole (nur Zustände: niedergehalten, flieht, gebrochen, aufgeprotzt, festgefahren, Gas, feuerbereit); Aufklärer rechts mit Auge. Aktionsmeldungen bleiben kurzer Text.
- Deckungsschilde Bronze/Silber/Gold rechts oben am Standring.
- Keine Kommazahlen: Anzeige ×10 als ganze Zahlen. Stärkebalken dick, grün/gelb/rot mit Strichen; Moralbalken dünn, gold.
- Schadenszahlen groß und ca. 3,5 s stehen; kurze Meldungstexte über Einheiten klein.
- Statuseffekte (Gas, Niederhalten …) erscheinen erst beim Einschlag, nicht vorher.
- Einheiten werden erst grau, wenn alle Effekte durch sind; gewählte Einheit mit pulsierendem Ring.
- Draht deutlich sichtbar; Draht-Knöpfe golden pulsierend an erster Stelle.
- Kampfmaschinen sind Wahlsache (Startmenü, Standard aus); je Seite Mechs und Kampfanzug-Trupps.
- Karten: wählbar, feste Karten, mehrere Größen, logisch zusammenhängend, gemalt bzw. nach Bild des Nutzers.
- Siegpunkt-Modus statt Rundengrenze: beide punkten, Zielfelder starten neutral.
- Kosten der Einheiten „berechnet“ aus den Werten, Rechnung im Info-Fenster sichtbar.
- Jede Einheit hat 2 Aktionspunkte (Skirmish-Gefühl, mehr Logik).
- Töne: je Fraktion ein Grundklang (Hauptgewehr Konkordat Enfield, Aschenwacht battle-rifle; Salve aus einer Datei; Nahkampf nahA/nahD; Übersicht entwurf/TONPLAETZE.md); Schüsse variieren; Koloss = tiefes Kettenrollen; Fußtruppen Marschtritt; Schlammschritte nur im Schlamm; Geschütz/Donnerrohr mit Kanonenschuss, Mörserton nur für Mörser; schwere Artillerie mit tiefem Bass; jeder Nahkampf-Schlag macht beim Treffer einen Ton; Kampfschrei nur bei Befehlen der Aschenwacht; Panne und Festfahren mit car-crash.
- Zuordnung England-Bogen = Konkordat, Deutschland-Bogen = Aschenwacht (Bogen mit Kanone = England); Frankreich-Bogen als wählbares Bilderset.

## Projektstruktur
- `src/engine.js` – Regeln, Spielzustand G, Typen (TYPES), Karten (E.MAPS), Kosten (costParts), Konstanten P.
- `src/ai.js` – KI (posValue, abilPlan, zweiter Durchgang). Test-Gewichte W_A_x/W_D_x.
- `src/ui.js` – Zeichnen, Bedienung, Effekte, Töne abspielen (playSound, SND_VAR), Layout. Untere Leiste = Einheiten-Panel nach STYLE.md: `updateHud` + `unitButtons` (Knöpfe je Einheit, Tasten 1–n), CSS-Block „Einheiten-Panel nach STYLE.md“ am Ende von `src/index.html`.
- `src/figures.js` – gezeichnete Ersatzfiguren (FIG, FIG.setSkin).
- `src/index.html` – Gerüst und Stylesheet. Der Block „UI-Bogen des Nutzers“ am Ende überschreibt den älteren „Grimdark-Anstrich“.
- Datendateien (nicht lesen, siehe oben): `art.js` (Einheiten-/Anführerbilder, Schlüssel `_A` Konkordat, `_D` Aschenwacht, `_F` Frankreich-Set; je Bild hs/ax/ay/faces), `fx.js` (FXDATA: tiles, fx, proj inkl. Symbole `i_*`, flags), `paint.js` (FXDATA.paint: Bodentexturen, Objektbilder), `mapimg.js` (FXDATA.mapimg: gemalte Ganzkarten), `sound.js` (Töne, Zuordnung im Dateikopf; seit 2026-11-16 gebaut mit `tools/sound_bau.mjs` nach `tools/sound_bau.json` aus `sound-quelle/` – Ausschnitt, Lautstärke, AAC im lokalen Headless-Chrome, Vorschau-Server muss laufen; Plätze mit Seiten-Varianten in `SOUND_POOLS`, Auswahl in ui.js `sndPick` nach `sndSide`; Übersicht `entwurf/TONPLAETZE.md`, Lizenzen `CREDITS.md`), `uiart.js` (UIART: Oberflächenteile, als CSS-Variablen `--ui-<name>`). `titlebg.js` (TITLEBG: hochskaliertes Titelbild des Startmenüs, erzeugt mit `tools/title_bg.py` aus `ui-quelle/Titelbild.webp`). `uipanel.js` (UIPANEL: Grafiken des Einheiten-Panels, erzeugt mit `tools/panel_assets.py`, als CSS-Variablen `--up-<name>`, Symbole `s_<name>`).
- `tools/ui_textures.py` – schneidet die kachelbaren UI-Texturen aus `ui-quelle/texturen_ui.png`, macht sie nahtlos und erzeugt die 9-Slice-Rahmen (`ui-quelle/teile/texturen/`); danach `tools/panel_assets.py`. Regel: Flächen immer gekachelt, nie gestreckt (STYLE.md).
- `tools/figure_cut.py --game` – stellt die Figurenbögen aus `ui-quelle/figuren/` frei (Trupps 2×2 Posen, sonst Einzelmodell; Höhen der Einzelmodelle in `SH_SINGLE`) nach `ui-quelle/teile/figuren/` und bettet sie in `src/figs.js` ein (Datendatei, nicht lesen). Zuordnung Einheit → Bogen: `FIGMAP` in ui.js; nur in der neuen Ansicht. Bogenarten: `TRUPP` (2×2), `REIHE` (Posen nebeneinander, getrennte Flächen), `SPALTEN` (berührende Posen, senkrecht getrennt), `TEILUNG` (waagerecht: unten Modell, oben `<name>_luft`, z. B. Fesselballon – ui.js `drawBallon`), sonst Einzelmodell; SPALTEN trennt seit 2026-11-17 mit einer Naht durch den freien Hintergrund (`seam`), damit lange Waffen ganz bleiben; Porträts aus den Bögen: ui.js `portraitKey`/`PORTRAIT_POSE`, Liste `entwurf/PORTRAETS.md`; `fahne_umfaerben` färbt bei allen aschenwacht_*-Bögen Schwarz-Weiß-Rot (automatisch gefunden, dazu feste Bereiche `FAHNE`) in Aschgrau/Schwarz/Knochenweiß um; `ABZEICHEN` übermalt Eiserne Kreuze (Schulterplatten, Fahnenspitze, Orden; Visiere bleiben); `LAMPE` färbt rosa Helmlampen gelb (Mineure); `SPIEGELN` dreht nach links blickende Bögen (Aschenwacht-Schreiter); Schreiter knapp 2 SH als Einzelmodelle mit Fahrzeugschatten (ui.js `SCHREITER`, deep); Rand-Hintergrundfarbe nur aus kräftig farbigen Randpixeln (helle Schnittkanten); SPALTEN/SH_REIHE nehmen auch den ganzen Bogennamen (aschenwacht_sturm in einer Reihe, konkordat_sturm 2×2); `--angleichen` gleicht die Farbe an. Übersicht neuer Bögen: `entwurf/probe/figuren.html`.
- **Gelände-Bausteine im Spiel** (nur neue Ansicht, zuerst nur Grauwall, Liste `GB_KARTEN` in ui.js): `src/gelaende_bau.js` (GBau: aufbauen = Weltbild + aufrechte Teile + platz für Trupps) und `src/gelaende.js` (Datendatei mit den Bildern, nicht lesen; erzeugt mit `tools/gelaende_cut.py --einbetten`). In ui.js: `gbBereit` (Aufbau, ersetzt tcv; neu bei Geländeänderung, ca. 0,4 s), `drawTilt` mischt die Teile mit den Einheiten nach Tiefe, `drawNewFigs` stellt Trupps per `gbPlatz` in Graben/Ruine. Abschalten zum Vergleich: `window.NOGB = true`.
- `tools/gelaende_cut.py` – stellt die Gelände-Bausteine aus `ui-quelle/gelaende/` frei (Wandstücke/Sohle als nahtlose Kachelstreifen, Bögen in Einzelteile; Höhen in `TEILE`) nach `ui-quelle/teile/gelaende/` und `entwurf/probe/gelaende/g_*.webp`. Regeln: STYLE.md „Gelände-Bausteine“. Zeichnen: `entwurf/probe/gelaende_bau.js` (GBau.bauen), Probe `entwurf/probe/gelaende.html`, ganze Karte `entwurf/probe/karte.html?karte=grauwall&ganz=1` (Schalter `?zoom=`, `?ziel=c,r`, `?seed=`, `?punkte=1`). Kartendaten dafür: `node tools/karte_json.js <karte> > entwurf/probe/karte_<karte>.json`.
- `tools/build.py` – baut `index.html` (bettet `src/fonts.css` an `<!--FONTS-->` ein). `tools/fonts.py` – erzeugt `src/fonts.css` aus `ui-quelle/schriften/` (braucht fonttools, brotli). `tools/sim.js` – KI gegen KI. `tools/costcheck.js` – Punktwerte prüfen.
- **Neue Einheitenbilder** (Magenta-Hintergrund) in `ui-quelle/einheiten_neu/<schlüssel>.png` ablegen und mit `tools/unit_cut.py <schlüssel>:<sh>[:flip][:sätt,wärme,hell]` in **einem** Schritt freistellen, auf die Bildregeln bringen (Soldat 200 px), farblich an die Fraktion angleichen (Ziel je Fraktion in `FARBE`, WebP-Verlust wird ausgeglichen, nur einmal komprimiert) und in `art.js` sowie `SHT` in `figures.js` eintragen. Immer aus der Magenta-Quelle neu erzeugen, nie ein Bild aus `art.js` mehrfach nachkomprimieren. `tools/unit_color.py` misst bzw. korrigiert die Farbe bestehender Bilder ohne Quelle (`--dry` = nur messen).
- `ui-quelle/` – Bildvorlagen des Nutzers für die Oberfläche. `wimpel_fraktionen.png` = Wimpel der eroberten Zielmarken (Teile `wimpel_fraktionen/`, im Spiel `UP.pA/pD/pF`). Gemini-Bögen (Magenta-Hintergrund) schneidet `tools/ui_cut.py` in `ui-quelle/teile/<bogen>/` (Übersicht: `teile/uebersicht.png`). Symbole: `bogen3b_symbole` und `bogen4a/4b/4c_symbole` gelten, `bogen3_symbole` ist alt. Zuordnung in `entwurf/symbol-liste.md`.
- `entwurf/` – UI-Entwürfe, noch nicht im Spiel. Quelle `einheiten-panel.src.html`, Bau mit `tools/entwurf.py` (bettet Teile und Einheitenbilder ein). `symbol-liste.md`: alle Knöpfe/Fähigkeiten mit Symbolzuordnung.
- Python: `%LOCALAPPDATA%\Programs\Python\Python312\python.exe` (mit Pillow, numpy, scipy).
- Fehlt ein Bild, greift immer die gezeichnete Fassung.

## Seiten und Einheiten
- Konkordat (Karminrot, Bilder England-Bogen) gegen Aschenwacht (Blau, Deutschland-Bogen). Frankreich-Set „Blaue Legion von Arvenne“ = zweites Bilderset fürs Konkordat, gleiche Werte.
- Klassen: inf, mg, art (mit/ohne `mobile`), cav, storm, walker (Kolosse, Mechs), medic. Schalter in TYPES z. B. `suit`, `mech`, `gat`, `pin`, `at`, `relay`, `spot`, `hidden`, `wirelayer`, `banner`, `abil`. Schlagworte `sp` (E.SPECIALS) erscheinen in Einheitenkarte und Info-Fenster.
- Kampfmaschinen nur mit Startmenü-Schalter (G.mechs, E.isMech). Sim: Standard ohne, `MECHS=1` mit.
- Kommandotrupps: Hauptmann (Befehl alle 2 Runden, 2 Felder, max. 3), General (jede Runde, 3 Felder, max. 1). Befehle je Seite (E.orderKinds, Gruppe 2 vom 2026-11-16): beide „Sammeln“, Konkordat „Feuer frei“ (u.fireFree, Fernkampf ×1,25 bis zum nächsten eigenen Zug), Aschenwacht „Sturmbefehl“ (u.zeal). General zusätzlich einmal je Schlacht (G.bigUsed): Konkordat „Halten um jeden Preis“ (G.hold: keine Flucht, Abwehr ×1,25), Aschenwacht „Generalangriff“ (alle +1 Aktionspunkt). Bannerträger: „Banner aufpflanzen/aufnehmen“ (u.planted: 3 statt 2 Felder, dort keine Flucht über E.noFlee, Träger zieht nicht). KI-Abschalter NOBIG_x, NOPLANT.
- Gruppe 3 (2026-11-17): Eingraben (T.dig, u.dug, Abwehr ×1,3 bis zum Zug), Schilde vor (T.shieldWall, u.shields, Nachbarn Beschuss ×0,75), Sturmlauf (abil 'rush', E.rushPath, moveUnit mit festem Weg `forced`). Grabenkämpfer, Kettenritter, Schildträger gestrichen.
- Gruppe 4 (2026-11-17): Granatwerfer gestrichen. Minenwerfer `noMoveFire`, `heMul` 1,5, `breaker` (Draht/Barrikade). Brennende Felder G.fires (E.fireAt, ignite/burn, P.FIRE_DMG, Kolosse ×0,5) nach Flammenstrahl bis zum nächsten Zug des Anzünders; KI `hazard` W_FIRE; Sim-Abschalter NOFIRE.
- Gruppe 5 (2026-11-17): Sprengtrupp und Minenleger gestrichen; Graben-Pioniere `abil: 'charge'`, Drahtpioniere `abil: 'mine'` (mit `wirelayer`: Mine ODER Draht je Runde). Versorgungstrupp = werkstatt/munition (medic, repair, recover, abil ammo; je Runde eine Aufgabe über u.task).
- Gruppe 6 (2026-11-17): Sturmpanzer `sturmpz` (walker, `broadside`: zweiter Schuss auf anderes Ziel bis 2 Felder über u.bsT, beide ×P.BROADSIDE 0,6). Sprenglanzen-Reiter `lanzeD` (cav, `blastLance`: erster Nahkampf ×P.BLAST_LANCE 1,5, u.lanceUsed, Ereignis `lanceblast`).
- Sonderfähigkeiten über T.abil / E.ABILS / abilTargets / useAbil (Rauch, Granaten, Stollen, Sprengladung, Minen, Scheinwerfer, Gegenstoß, Gasschutz, Munition, Pirschjäger …).

## Spielmechanik (Kurzfassung)
- **Siegpunkt-Modus:** keine Rundengrenze. Zielfelder starten neutral; wer sie betritt, hält sie. Zu Beginn der eigenen Runde zählen gehaltene Felder auf G.vp; wer G.goal erreicht (MAP.goal oder Summe × P.GOAL_K = 7), gewinnt. Zusammenbruch (BREAK) gilt weiter, Notbremse P.MAX_ROUNDS 40. maxT/winA/drawA in MAPS sind veraltet.
- **Aktionspunkte:** P.AP = 2 je Runde. Ziehen 1 (zweiter Zug halb so weit), Schießen 1, Steilfeuer 2 (Mörser 1), Nahkampf alle, Befehl/Versorgen/Draht 1. Höchstens ein Angriff je Runde. Drehen frei. Marsch = doppelte Zugweite, danach nichts. Feindberührung stoppt (außer Sturm/Kolosse).
- MG: Aufbauen (E.setupMG) und Abbauen (E.teardownMG) kosten je 1 Aktionspunkt; aufgebaut schießen, nicht ziehen; abgebaut ziehen, nicht schießen. Schussfächer ±90° in Blickrichtung (E.inFan, MG_FAN), auch für Sperrfeuer; Drehen frei. Sim-Abschalter NOFAN. **MG-Sperrfeuer** (E.sperr, seit 2026-11-16 statt automatischem Reaktionsfeuer): aufgebaut, unbewegt, ungeschossen, kostet die restlichen Punkte; im gegnerischen Zug bis zu P.SPERR_SHOTS = 2 Schüsse (u.sperr). KI-Abschalter NOSPERR_x. Feuerbereitschaft (E.overwatch, nicht für MG) schießt einmal mit ×0,8.
- **Gelände-Gefahren (2026-11-16):** Betreten von Stacheldraht kostet ca. 10 Stärke (P.WIRE_DMG, Ereignis `wirehurt` + `hit`); gepanzerte Infanterie (E.wireProof: `suit` oder `wireProof`, z. B. Schwere Grabenwacht) unverletzt und ohne Halt, Kolosse walzen. Gas: wer in der Wolke getroffen wurde, ist vergiftet (u.poison, 2 Runden: ½ dann ¼ des Gasschadens, Ereignis `gas` mit `late`); Sanitäter heilen es, Gasschutz-Trupp (und Nachbarn) und Kolosse immun (E.gasSafe). Sperrfeuer der Artillerie: Abklingzeit P.BARRAGE_CD = 2 (u.cdP). KI: `hazard` in ai.js (W_WIRE, W_GAS). Sim-Abschalter NOWIREDMG, NOPOISON.
- Niedergehaltene schießen/stürmen nicht. Gebunden im Nahkampf (E.held): kein Schuss neben gleich großem Gegner (sizeOf 1/2/3). Flammenwerfer ausgenommen.
- Gelände (TERRAIN, cost, defMods, hasLOS): u. a. Graben, Draht, Trichter, Wald, Totholz, Furt, Sumpf, Bunker, Fabrik, Kirche, Barrikade, Bahn, Straßen (Kosten 1). Deckungsschild nach E.coverOf.
- **Ziel markieren** (abil 'mark': Ballonbeobachter, Signaltrupp, 1 Punkt): Feld in Sicht, bis zum nächsten eigenen Zug G.marks → E.guided (×1,25, keine Streuung), deckt versteckte Gegner und Minen im Feld und daneben auf (q.known). **Feuerschlag** (abil 'strike': Fernsprechtrupp, alle Punkte, Abklingzeit 3): wie ein Haubitzenschuss auf ein Feld in Sicht, 25 % Streuung. Kein passives Lenken mehr. Radfahrer- und Scheinwerfer-Trupp gestrichen (2026-11-16), Sprengtrupp und Minenleger (2026-11-17). Meldegänger mit Hund: +1 Aktionspunkt für eine Einheit (E.sendOrder).
- Punkte/Kosten werden aus Werten berechnet (costParts: Kampfwert + ABIL + ADJ, auf 5 gerundet). Einnahmen: P.PTS_TURN, PTS_KILL, PTS_OBJ. Nachschub-Kaufmenü im Spiel.
- Armee-Auswahl im Startmenü: Budget = Wert der Standardarmee (E.ARMY_BUDGET), Grenzen ARMY_CAP/ARMY_WALKERS. KI nimmt immer die Standardarmee.

## Karten
- E.MAPS in engine.js, jede Karte = Daten: build() mit mapTools oder `img` + `grid` (Zeichen siehe GRID_CODE), objectives, army, reinf, zoneA, band. Neue Karte = neuer Eintrag.
- Vorhanden: grauwall, selm, lerne, varn, front, stein, waldfl, kasem, kanal. Gemalte Karten: renderPainted (paint.js) bzw. renderImageMap (mapimg.js).

## Darstellung (wichtige Fallstricke)
- **Ansicht:** Geometrie, die vom Blick auf die Karte abhängt, nur über den Abschnitt „Ansicht“ in ui.js (`center`, `pixToHex`, `hexCorner`/`hexPath`, `kAt`, `sAt`, `gEllipse`), nie direkt mit `K` rechnen. Grund: neue gekippte Ansicht (Schalter `OPT.tilt`, „Neue Ansicht (Test)“, Umbauplan in IDEEN.md) setzt dort an. Ausnahmen: Geländerendern (zeichnet flach in `tcv`) und `figSprite`.
- **Neue Ansicht (Schalter an):** Weltbild = flache Karte mit K = 1 und Feldradius `WS` in `WCV`; `center()`, `d.x/d.y`, Markierungen und Effekte rechnen dort. `drawTilt` projiziert das Weltbild zeilenweise (`projectGround`), Einheiten werden als Aufsteller per `setTransform` am Fußpunkt gezeichnet (`bbAt`, `VIEW.bbK`). Kamera `CAM` (Ziel, Zoom), `camSetup/proj/unproj`; `evToPx` liefert dort Bodenpunkte im Weltbild, `lastSP` den Schirmpunkt (Aufsteller-Kästen `UBOX`, Marken mit `tf`).
- Anzeige-Zustand: Regeln ändern G sofort, gezeichnet wird VIS und d.vs je Einheit; Ereignisse setzen sie beim Abspielen, syncAll() nach jedem Stapel. **Neue Zustände immer so einhängen**, sonst erscheinen sie zu früh.
- Effekte laufen nach Uhrzeit (STEP/FS in frame()), nicht nach Bildrate.
- Zahlen in der Anzeige ×10 als ganze Zahlen über fmt(); die Regeln rechnen mit 10er-Werten.
- Klick-Treffer: Ist eine Einheit gewählt, zählt zuerst das Feld; beim Auswählen der enge Kasten der vordersten Figur (pick). Figuren klein in der unteren Feldhälfte (SLOTS, FH, MAXW, FSC).

## Test-Werkzeuge
- `node tools/sim.js 200`, Varianten: `MAP=selm`, `MECHS=1`, `ARMY_A="typ:n,…"`, `ARMY_D`, `M_goal`, `MA_<typ>=n`, `MD_<typ>=n`, Abschalter NOMARCH_x, NOOW_x, NOABIL, NOHELD, NOSUPP u. a. (TOG in engine.js).
- `node tools/costcheck.js 140 [typen]`.
- Draht „Bild = Regel“: `node tools/test_draht.js` (Regeln) und `node tools/test_draht_bild.mjs` (Bild, Vorschau-Server nötig).
- Im Browser: `window.__dbg` (fx, vis, mz, play([...])). Headless-Browser rendern langsam, Effekte früh fotografieren.

## Offene Ideen
Alle Ideen für später und der Gesamtplan (Etappen 4–8) stehen in `IDEEN.md`. **Neue Ideen dort eintragen** (kurz, mit Datum), nicht hier.
