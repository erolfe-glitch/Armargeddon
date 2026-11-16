# Armargeddon – Stilvorgaben für die Oberfläche

Jede UI-Änderung hält sich an diese Datei. Referenzbild: `ui-quelle/referenz_stil.webp.webp`.

## Zielgeräte
- **PC und große Touch-Displays (Digitalboards), ab 1280 px Breite.** Handy wird nicht mehr optimiert und nicht getestet (alten Handy-Code nicht ausbauen, nur nicht pflegen).
- **Touch überall:** Jeder Tooltip auch per Antippen (Anzeigen) bzw. langem Drücken (Knöpfe). Knöpfe mindestens 40 px, für Finger.
- Die obere Leiste passt bei jeder Breite ab 1280 px vollständig; der Titel und der Seitenname stehen nicht in der Leiste (Seite = Wappen, Name im Tooltip). Unter 1800 px fallen die Wappen neben den Kampfkraft-Balken weg.

## Richtung
Rostiges Eisen, Pergament, Holz, Comic-Tinte. Dicke dunkle Konturen, harte Schatten, Nieten.

## Grundregel
- **Rahmen und Hintergründe:** texturiert, dreckig, abgenutzt (Rost, Kratzer, Maserung, Flecken).
- **Inhalte** (Text, Balkenfüllung, Zahlen, Symbole): flach, sauber, hoher Kontrast. Keine Textur, kein Verlauf, kein Schmutz auf Inhalten.
- **Flächen immer gekachelt, nie gestreckt.** Große Flächen (Menüs, Panels, Tafeln, Knöpfe, Tooltips) bekommen eine kachelbare Textur in Originalgröße (`background-repeat`): Bronze (Menüs, Fenster), Rost-Eisen (Tafeln, Knöpfe), Holz (Einheiten-Panel, obere Leiste), Pergament (Tooltips, Tagebuch, Info-Fenster). Abdunkeln nur über eine flache Tintenschicht darüber. Rahmen und Ecken sind Einzelbilder aus dem UI-Bogen per 9-Slice (`border-image`, Innenfläche durchsichtig, Kanten mit Nieten `round`). Quelle `ui-quelle/texturen_ui.png`, aufbereitet mit `tools/ui_textures.py` (nahtlos, Flecken ausgeglichen), eingebettet als `--up-tx*` bzw. `--up-t9/r9/l9/p9`.

## Palette
Zentral als CSS-Variablen in `src/index.html` (Block „STYLE.md – Palette“). Keine neuen Farben ohne Eintrag hier.

| Variable        | Wert      | Einsatz |
|-----------------|-----------|---------|
| `--s-bg`        | `#221B18` | Hintergrund |
| `--s-panel`     | `#322923` | Panelfläche |
| `--s-rust`      | `#66483A` | Rahmen, Rost |
| `--s-text`      | `#F0EDE1` | Text auf dunklem Grund |
| `--s-parch`     | `#BBA583` | Pergament (Text darauf: `--s-bg`) |
| `--s-brass`     | `#C2A461` | Akzent Messing: Auswahl, Fähigkeiten, Hauptknopf |
| `--s-life`      | `#8E2B22` | Leben; Fraktionsfarbe **Konkordat** (Ochsenblut, wie die Konkordat-Wappenflagge) |
| `--s-foe-dark`  | `#713B36` | Feind dunkel |
| `--s-friend`    | `#7D8471` | Fraktionsfarbe **Aschenwacht** (Feldgrau grünlich) |
| `--s-friend-hi` | `#A0AC88` | Feldgrau aufgehellt, nur Füllung des Kampfkraft-Balkens der Aschenwacht |
| `--s-legion`    | `#6F8FB5` | Fraktionsfarbe **Blaue Legion** (Horizontblau, einziges erlaubtes Blau) |
| `--s-gas`       | `#8A8A2E` | Gas, Gefahr |
| `--s-moss`      | `#6B7A3A` | Lebensbalken über 60 % (Moosgrün) |
| `--s-ochre`     | `#B08A2E` | Lebensbalken 30–60 % (Ocker); darunter `--s-life` |
| `--s-range`     | `#A8473A` | Ochsenblut aufgehellt, nur Linien: Kontur der Schussreichweite, Bedrohung in der Vorschau |
| `--s-ink`       | `#120D0B` | Comic-Kontur, harte Schatten |

## Fraktionswappen
Jede Fraktion hat genau ein Wappen (Quelle `ui-quelle/wappen_*.png`, Teile in `ui-quelle/teile/wappen_*/`):
- **Konkordat:** eiserner Löwenkopf im Strahlenkranz, Bronze.
- **Aschenwacht:** Stahlhelm mit Sehschlitz im Strahlenkranz, Stahlgrau.
- **Blaue Legion von Arvenne** (zweites Bilderset des Konkordats): Bronze-Hahn mit Patina im Strahlenkranz. Ersetzt beim Bilderset Frankreich überall das Konkordats-Wappen.

Das **ganze Emblem** (`w_emblem`, immer mit Strahlenkranz, nie beschnitten) ist die Marke der Seite, leicht aufgehellt (`.crest`). **Weniger, aber groß:**
- Obere Leiste: je Seite **ein** Medaillon (`.tb-medal`, bei 1920 px 64 px, unter 1800 px 54 px), darf über den Leistenrand ragen. Links neben dem eigenen Kampfkraft-Balken, rechts neben dem des Gegners; dazu eins bei „Seite am Zug“.
- Am Einheitenbild im Panel (50 px).
- Bei Siegpunkten und anderen kleinen Stellen **kein** Emblem, dort zeigt die Farbe die Seite.

Die **Fassung mit Flagge** (`w_flagge`) steht auf eroberten Zielfeldern und im Startmenü. Die Flaggen dahinter (Union-Jack-artig beim Konkordat, Schwarz-Weiß-Rot bei der Aschenwacht) sind **gewollt** und bleiben so; die alten echten Nationalflaggen-Bilder sind entfernt.

## Fraktionsfarben
Fest je Fraktion, nicht nach Freund/Feind. Alle drei klar verschieden:
- **Konkordat:** Ochsenblut `#8E2B22` (tief, nicht orange). Auf dunklem Grund trägt die Tintenkontur bzw. ein helles Glanzlicht die Farbe, nie ein helleres Orange-Rot. Als Schrift zu dunkel: Seitennamen in Knochenweiß mit Farbstrich darunter.
- **Aschenwacht:** Feldgrau grünlich `#7D8471`.
- **Blaue Legion:** Horizontblau `#6F8FB5` – die **einzige erlaubte Blau-Farbe** im Spiel.

Im Code: CSS `--A` / `--D` und `FIG.PAL.accent`; `applySkin` in ui.js setzt sie nach Bilderset (`sideCol`). Gilt für Kampfkraft-Balken, Siegpunkte, Zielfeld-Marken (Leiste und Karte), Ringe unter den Einheiten und Seitennamen. Hilfsmarkierungen nie blau, sondern Knochenweiß oder Messing.

**Zahlen nie in Fraktionsfarbe** (Rot auf Dunkel ist schlecht lesbar): Siegpunkt-Zahlen in Knochenweiß, die Fraktionsfarbe als dicker Strich (5 px) darunter.

Die Seite erkennt man nie nur an der Farbe: dazu das Wappen bzw. der Name. Ersatzformen, falls ein Wappenbild fehlt: Schild (Konkordat/Legion) und Zackenraute (Aschenwacht). Reihenfolge in der Leiste nach Sicht: eigene Seite links, Gegner rechts.

## Schrift
Eingebettet, keine Online-Abhängigkeit (Quelle `ui-quelle/schriften/`, OFL; `tools/fonts.py` erzeugt `src/fonts.css`).
- **Headline** (`--s-head`, Familie „Arm Kopf“): IM Fell English SC, alte Druckschrift – Titel, Knöpfe, Namen. Großbuchstaben mit etwas Sperrung.
- **Alle Ziffern** sind in „Arm Kopf“ per `unicode-range` aus Alegreya Sans ersetzt, damit Zahlen immer klar lesbar sind (auch „Runde 1“).
- **Werte und Fließtext** (`--s-body`, Familie „Arm Text“): Alegreya Sans, Versalziffern mit fester Breite (in `fonts.py` fest eingestellt). Tooltips, Beschreibungen, kleiner Text.
- Mindestens **14 px** überall, auch in Tooltips und Kleingedrucktem.
- **Kein Text in Grafiken.** Beschriftung immer als echte Schrift im HTML.

## Schärfe
- Grafiken nie hochskalieren: Teile in voller Quellgröße einbetten (`tools/panel_assets.py`), Canvas zeichnet mit `devicePixelRatio`. Wo die Quelle selbst zu klein ist (Holzleiste 1951 px, Titelbild 1024 px), braucht es eine größere Vorlage.

## Bauteile
- Konturen 2–3 px in `--s-ink`, harter Schatten nach unten (kein Weichzeichner).
- Balken: Rahmen texturiert, Füllung flach mit Segmentstrichen und dünnem Tintenrand. **Leben nach Stand** (Karte und Panel gleich): über 60 % `--s-moss`, 30–60 % `--s-ochre`, darunter `--s-life`. Moral `--s-brass`. Die Fraktion zeigen Ring, Wappen und Marken, nicht der Lebensbalken.
- **Ausnahme Kampfkraft-Balken (obere Leiste):** Füllung gemalt – Pinselform mit ausgefranstem Ende, feine Pinselstriche, Tintenkontur. Farbe bleibt die volle Fraktionsfarbe, Segmentstriche dünn.
- **Zielfeld-Marken (obere Leiste):** kleine gemalte Messingmünzen (Verlauf aus Messingtönen um `--s-brass`) mit eingeprägter Zahl (dunkles Braun, heller Grat darunter), Rand immer `--s-rust`. Erobert: Wimpel aus `ui-quelle/wimpel_fraktionen.png` mit Stange und Messingknauf am rechten Münzrand (Konkordat rot-weißes Schrägkreuz, Aschenwacht Schwarz-Weiß-Rot, Legion Blau-Weiß-Rot), kein farbiger Rand. Fester Abstand zwischen den Münzen, damit die Leiste beim Erobern nicht springt; der letzte Wimpel ragt nicht in die Messingecke. Fehlt das Bild, greift der gezeichnete Wimpel (`pennant` in ui.js).
- Symbol-Knöpfe: Rostknopf aus Bogen 2, Symbol aus `bogen3b_symbole`. Fähigkeiten-Knöpfe im Panel bis 84 px breit (teilen sich die Breite, bei 1280 px kleiner, nie Überlauf). Symbol aufgehellt mit Messingkante (1 px, `--s-brass`) und leichtem Goldhauch, damit es sich vom Rostknopf abhebt; Knopffläche dahinter leicht abgedunkelt. Zustandssymbole im Panel 30 px, Deckungsschild 34 px. Tooltip als Pergamentzettel mit Name, Kosten (nur Zahl), Kurztext.
- Zustände: gewählt = Messingrand (Knopf „gewählt“); gesperrt = Knopf „gesperrt“, Symbol grau und gedimmt, **ohne** helle Kontur, dazu große Zahl (Abklingzeit).
- Leistensymbole (Lupe, Lautsprecher, Vorspulen, Vollbild): einfache flache Zeichen in Knochenweiß `#F0EDE1`, kein gemalter Bogen.

## Kartenmarken an den Einheiten
- Eine kompakte Zeile an den Füßen der eigenen Figuren, ganz im eigenen Feld: links **ein** Zustandsplatz (wichtigstes Symbol, „+n“), Mitte Pinsel-Lebensbalken (Farbe nach Stand, siehe Balken) mit kleinen Messingmünzen darunter (Aktionspunkte, nur eigene Einheiten), rechts kleines Deckungsschild (Bronze/Silber/Gold aus `kartenmarken.png`). Anführer: Orden rechts neben der Figur.
- Marken werden in Tiefenreihenfolge mit der eigenen Figur gezeichnet: Figuren davor dürfen sie verdecken, sie malen **nie** über fremde Figuren.
- Ringe: gemalter Pinselstrich in gedämpfter Fraktionsfarbe, Auswahl Messing. Jede Marke hat einen Pergament-Tooltip (Maus und Touch).

## Übersicht auf dem Feld (gewählte Einheit)
Drei Darstellungen, klar getrennt, gedämpft – das Gelände bleibt sichtbar:
- **Bewegung:** Flächen, Knochenweiß (ziehen) bzw. Messing (Marsch/Rückzug).
- **Schuss:** **eine** gestrichelte Kontur um das ganze Reichweitengebiet in `--s-range` auf Tintenschatten, keine Flächen. Ziele in Reichweite: Messing-Eckklammern um die Figur.
- **Sicht:** Felder in Sicht- bzw. Schussweite ohne Sichtlinie mit Tinte abgedunkelt und fein schraffiert.
- **Vorschau** (Maus über erreichbarem Feld, Finger: erstes Antippen, zweites zieht): gestrichelte Messinglinien zu den Zielen von dort, Gegner mit Schussfeld auf das Feld gestrichelt in `--s-range` umrandet, oben links am Feld Warndreieck (Ochsenblut, „!“, Zahl), oben rechts das Deckungsschild des Felds. Tooltip per Maus und Touch.
- **Bereite Einheiten** (eigene Runde): dezenter pulsierender Messingring am Boden. Können nur noch höchstens 3 handeln, zusätzlich ein Messingwinkel über der Figur. Beides in den Optionen abschaltbar („Hilfen“).

## Kamera, Ereigniszeile, Kriegstagebuch
- **Kamera** (Option „Kamera folgt der KI“): fährt weich (ca. 0,4 s) nur, wenn das Geschehen nicht im Bild ist. KI-Einheit am Zug: Messingring. Zu Beginn der eigenen Runde zurück zur zuletzt gewählten Einheit bzw. zur eigenen Front. Wer selbst verschiebt, hat Vorrang.
- **Zoom:** „Ganze Karte“ bis 2×, Mausrad und zwei Finger stufenlos auf den Zeigerpunkt; Knopf: ganze Karte → 1× → 1,3× → 1,6×.
- **Wucht:** kurzer Halt bei Treffern, leichtes Bildwackeln bei schweren Treffern und Einschlägen (Option „Bildwackeln“). Tempo 1×, 2×, Sofort (ohne Kamerafahrt und Ton).
- **Ereigniszeile:** wichtige Ereignisse beider Seiten (niedergehalten, flieht, aufgerieben, schwerer Treffer, Reaktionsfeuer, Panne, festgefahren, Anführer fällt) groß in Headline-Schrift, Knochenweiß auf Tinte, Rostrand, Fraktionsfarbe als 5-px-Strich darunter; ca. 1,7 s.
- **Kriegstagebuch** (Buch-Symbol in der oberen Leiste): Pergament (`--s-parch`, Text `--s-bg`) im Rostrahmen, Runden neueste oben, Einträge mit Fraktionsstrich links, Wichtiges fett; Eintrag antippen fährt die Kamera hin und markiert das Feld in Messing. Einträge mindestens 40 px hoch.

## Bildregeln für Einheiten und Karten
Gelten für jedes neue oder neu gemalte Bild. Bestandsaufnahme und Begründung: `entwurf/bestand/BESTAND.md` (lokal).
Maß: **SH** = Soldatenhöhe (stehender Soldat, Sohle bis Helmspitze). Im Spiel ist **1 SH = 1,18 Feldradien** (gut sichtbar auch auf dunklen gemalten Karten).

- **Maßstab der neuen Ansicht (verbindlich seit 2026-11-16, gekippte Karte, Schalter „Neue Ansicht (Test)“):** gilt für alle neuen Figurenbögen und Aufsteller.
  - Stehender Soldat **0,8 Feldradien** (Feld = 2 Feldradien breit). Trupps (4 Figuren) und Anführer im selben Maßstab.
  - Geschütz in Stellung Bildhöhe 1,38 SH, MG aufgebaut 1,13 SH und marschbereit 1,21 SH (beide etwas größer als Infanterie, Stand 2026-11-16). Aufgeprotztes Geschütz mit Pferdegespann (`geschuetz_marsch`, beim Aufprotzen und Ziehen) **am Reiter gemessen**: Reiter so groß wie ein Infanterist, Pferd mit Reiter ca. 1,4 SH, höchstens 2,4 Feldradien breit, Hufe und Räder auf dem Feldboden.
  - Panzer und Kolosse **1,5 SH** hoch, höchstens **2,4 Feldradien** breit, Breite nach Bild (nicht aufblasen). Belegen ein Feld; Ketten-Unterkante etwas nach vorn (Richtung Betrachter) im Feld auf dem Boden, Kontaktschatten unter der ganzen Kettenlänge.
  - Alle Figuren mit den Füßen auf dem Feldboden, weicher dunkler Kontaktschatten direkt darunter; Ringe klein und dezent.
  - Im Code: `FIG_SH`, `FIGW_MAX`, `FIGW_VEH`, `FIGMAP` in ui.js, Bildhöhen der Einzelmodelle `SH_SINGLE` in `tools/figure_cut.py`.
  - Reiter (Trupp aus 2 der 3 Posen): höchste Pose mit erhobener Waffe/Lanze 1,75 SH. Bögen mit Posen in einer Reihe (`REIHE` in figure_cut.py) werden über zusammenhängende Flächen geteilt. Neue, detailreichere Bögen werden mit `--angleichen` an Sättigung, Wärme und Helligkeit der Soldaten- und Sturmbögen der Fraktion angeglichen.
- **Größe zum Feld, alte Ansicht** (feste Klassen, im Code `SHT` in `figures.js`):
  - stehend 1,0 SH · kniend 0,75 · liegend 0,4 (echte Höhe, nicht aufblasen)
  - Mannschaft an Gerät (MG, Mörser, Geschütz, Gespann) hat **dieselbe** Soldatenhöhe wie Infanterie; das Gerät richtet sich nach ihr
  - Reiter 1,4 SH · Panzer 1,3–1,5 SH · Mech 1,6 SH · Kampfanzug 1,15 SH
  - Breite höchstens 2,2 Feldradien (Feld = 2). Über die obere Feldkante ragt nichts mehr als **drei Viertel Hexhöhe** (Fahnen, Lanzen eingeschlossen); Mechs und Kolosse dürfen so weit hinaus, dass sie ihre 1,6 SH erreichen. Reicht der Platz nicht, wird die Figur kleiner gezeichnet, nie größer.
- **Quellbilder:** stehender Soldat = 200 px, Füße auf gemeinsamer Grundlinie (unten, `ay` 0,975), freigestellt (Alpha). **Kein Boden, kein Rauch, kein Gas, kein Lichtkegel, kein Schatten im Bild** – Effekte kommen aus `fx.js`, Schatten und heller Saum aus dem Code.
- **Perspektive:** Dreiviertelansicht von vorn-rechts, Kamera ca. 20° über Augenhöhe (Sohlen leicht als Ellipse sichtbar). Alle Quellbilder blicken **nach rechts**, gespiegelt wird nur im Code.
- **Karten:** Stil wie die gemalten Ganzbilder (Steinbrücke, Waldfluss, Kasematten, Kanalstadt): feine Tuschschraffur, gedämpftes Grau-Grün-Braun, Gebäude in echtem Maßstab zur Figur (Haus ≈ 1 Feld). **Die Karten richten sich nach den Figuren, nicht umgekehrt:** Kamera ca. **30–35°** über dem Boden (flacher als die bisherigen 45–50°), damit die Figuren nicht wie aufgeklebt wirken.
  - In bespielbaren Feldern **keine hohen Objekte, die man von oben sieht.** Wald = Stämme, Stümpfe, Unterholz; hohe Baumkronen nur am Kartenrand. Gebäude als Ruinen mit niedrigen Mauern, damit Figuren darin stehen können.
  - Alle Karten (auch die Baustein-Karten) werden danach neu gemalt. Bis dahin gleicht der Code aus (siehe „Kontrast im Spiel“).
- **Kontrast im Spiel** (macht der Code, nicht das Bild): weicher dunkler Bodenschatten und kräftiger Kontaktschatten unter den Füßen, feine dunkle Außenkontur, feine helle Randkante oben links (Licht). Figuren auf Wald-, Totholz- und Ruinenfeldern leicht abgedunkelt, damit sie „im“ Gelände stehen.
- **Licht:** Hauptlicht von **oben links vorn** (ca. 45°): Glanzkanten links/oben, Eigenschatten rechts/unten. Gebäudeschatten auf Karten fallen nach rechts unten.
- **Kontur:** Außenkontur Tinte `--s-ink` (`#120D0B`), im Spiel 2–3 px (in der 200-px-Quelle ≈ 5 px), Innenlinien halb so stark. Kleinteile (Nieten, Schnallen) zusammenfassen, nichts feiner als ½ px im Spiel.
- **Farbe:** gedämpft (Sättigung 0,25–0,40), Grundhelligkeit 0,18–0,25. Fraktionsfarbe nur in Uniform und Anstrich: Konkordat Khaki-Braun mit Ochsenblut-Akzent, Aschenwacht Feldgrau, Blaue Legion Horizontblau. Metall, Leder, Holz bei allen gleich (Rost, gedämpftes Messing). Kräftige Farben nur für Feuer, Blut, Mündungsfeuer. Figuren eine Stufe heller und kontrastreicher als der Boden.

## Schanze, Pfützen, Durchsicht (neue Ansicht, 2026-11-16)
- **Schanze** nur aus Bunker + Sandsäcken (bunker.png, barrikade.png), Bunker hinter dem Graben auf der eigenen Seite. Keine Festungsteile mit Zinnen im Spiel.
- **Wasser auf dem Boden** (Pfützen, Trichter) dunkel und schlammig: Braun-Oliv mit leichtem Glanz, nie hell graublau (wirkt sonst wie ein Loch im Bild). Umfärben in `schlammig()` (gelaende_bau.js).
- **Durchsichtige Geländeteile** (45 %) nur, wenn eine Einheit wirklich dahinter steht (seitlich innerhalb der Teilbreite), nicht schon daneben.
- **Fahrzeugschatten** liegt direkt unter den Ketten (Band entlang der gemessenen Unterkante), nicht als Fleck darunter.
- **Reiter** auf 85 %, eng gestellt, bleiben im eigenen Feld.

## Strategie-Marken, Base, Fahrzeuge (neue Ansicht)
Seit 2026-11-16, im Code `drawStratMarks`, `stratSym`, Base in `drawGround`, `schlammrand` in ui.js.
- **Strategie-Marken:** Wird ein stehender Soldat auf dem Schirm kleiner als ca. 40 px, blendet über der Einheit ein Schild ein (fest 38 px, weich zwischen 46 und 32 px Soldatenhöhe). Schild in Fraktionsfarbe mit Tintenrand und dem Symbol der Einheitenart aus dem Panel-Bogen (Gewehr, MG-Dreibein, Lafette, Granate = Mörser, Pferd, Spitzhacke = Pionier, Handgranate = Sturm, Flamme, Sanitäter, Fernglas = Aufklärer, Fahne = Anführer, Zahnrad = Panzer/Koloss – ein eigenes Panzersymbol fehlt noch), darunter schmaler Lebensbalken. Figuren treten beim Einblenden auf 65 % zurück. Eigene Einheiten, die noch handeln können: Messingrand. Anklickbar wie die Einheit; Name unter Maus/Finger. Mit „Alle Marken“ (Knopf, Alt) auch nah.
- **Base (Test, Option „Base“: aus/dezent/mittel/deutlich):** Feld unter jeder Einheit abgedunkelt (16/28/42 %), feiner Rand in gedämpfter Fraktionsfarbe – wie die Base einer Tabletop-Miniatur.
- **Panzer und Kolosse:** Farbstimmung der Umgebung (Helligkeit 0,84, Kontrast 0,92, Sättigung 0,8), breiterer und dunklerer Bodenschatten unter der ganzen Kette, kräftigere Kontaktflecken, dunkler Schlammrand an der Unterkante der Ketten.
- **Draht (seit 2026-11-16):** nur noch ganze Drahtverhau-Stücke (`draht_stuecke_1–4`, 0,8 SH), 1–2 je Feld, versetzt und gespiegelt, nicht zerschnitten, mit den Figuren nach Tiefe sortiert; nichts auf Straßen. Der frühere Streifen und die Einzelpfähle werden nicht mehr verwendet.

## Gelände-Bausteine (neue Ansicht)
Verbindlich seit 2026-11-16. Ziel: das ganze Gelände für die gekippte Ansicht neu malen, aus wenigen Bausteinarten, die der Code zusammensetzt. Probe mit Platzhaltern: `entwurf/probe/gelaende.html` (`?punkte=1` zeigt Anschlusspunkte und Fußlinien). Gemini-Prompts: `entwurf/GEMINI_PROMPTS.md`, Teil „Gelände-Bausteine“. Ablage der gelieferten Bilder: `ui-quelle/gelaende/`. Freistellen: `tools/gelaende_cut.py` (Kachelstreifen werden an der Stelle geschnitten, wo sich das Muster wiederholt, und auf Nahtlosigkeit geprüft; Ergebnis `ui-quelle/teile/gelaende/`, 320 px = 1 SH).

**Maße.** R = Feldradius, Feld = 2 R breit, Hexkante = 1 R lang. 1 SH (stehender Soldat) = 0,8 R; ein Feld ist also gut 2,5 Soldaten breit. Malmaßstab nach dem Freistellen: **320 px = 1 SH, 400 px = 1 R**. Kamera im Spiel 39° (beim Herauszoomen bis 58°).

**Ebenen (Zeichenreihenfolge).**
1. **Boden** – Kacheltexturen, flach im Weltbild, mitprojiziert.
2. **Flache Details** – liegen auf dem Boden (Trichter, Pfützen, Bretter, Grabensohle), flach im Weltbild.
3. **Kontaktschatten** – macht der Code: weicher Streifen unter jedem Wandstück, Ellipse unter jedem Aufsteller, Standring der Einheit.
4. **Aufrechte Teile und Figuren** – gemeinsam nach Tiefe des Fußpunkts sortiert (hinten zuerst). Wandstücke werden dafür in Abschnitte von höchstens 0,25 R zerlegt, jeder Abschnitt sortiert sich selbst.
5. Luft (Rauch, Gas, Effekte), Dunst nach hinten.

**Die vier Bausteinarten**

| Art | Blickwinkel | Format | Anschluss | Beispiele |
|---|---|---|---|---|
| **Bodentextur** | senkrecht von oben (90°) | quadratisch, an allen 4 Seiten nahtlos; 1 Kachel = 2 R × 2 R | Übergänge macht der Code: weiche Maske mit unruhigem Rand (Unschärfe ca. 0,16 R), keine gemalten Übergangskacheln | Schlamm (Grundboden), verbranntes Gras, Waldboden, Trümmerpflaster, Sumpf, Wasser, Kopfstein |
| **Flaches Detail** | senkrecht von oben (90°), Licht neutral | Einzelteil freigestellt, weicher Rand, frei drehbar | Mittelpunkt; Größe als Durchmesser in R | Trichter klein 0,6 R und groß 1,2 R, Pfütze 0,5–1 R, Bretter/Laufrost 0,6 R, Trümmerstreu 1 R, Grabensohle (Streifen, siehe Graben) |
| **Wandstück** (aufrecht, entlang einer Bodenlinie) | von vorn, Wand parallel zum Bild, leicht von oben wie die Figurenbögen (Mauerkrone gerade noch sichtbar), **ohne Fluchtpunkt** (beide Enden gleich groß) | waagrecht kachelbarer Streifen, links/rechts nahtlos; Unterkante = Fußlinie, gerade; 1 Kachel = 4 R lang (= 5 Soldaten) | Fußlinie von Punkt A nach Punkt B (Hexecken, Kantenmitten oder Grabenlinie); der Code schert den Streifen auf die Linie und kachelt ihn fortlaufend, deshalb gehen Kurven, schräge Kanten und Kreuzungen ohne eigene Bilder | Ruinenmauer hinten und vorn, Grabenkante vorn und hinten, Draht, Barrikade, Unterholz, Böschung |
| **Aufsteller** (aufrecht, an einem Punkt) | wie die Figurenbögen: Dreiviertelansicht von vorn rechts, leicht von oben, Licht oben links | Einzelteil freigestellt, kleiner Sockel nur direkt unter dem Objekt | Fußpunkt = Mitte der Unterkante (Sockelmitte); spiegeln erlaubt | Bunker, Stümpfe, Waldstämme, Ruinen-Eckpfeiler, Trümmerhaufen, Bäume mit Krone (nur Rand) |

Für alle Bilder: reiner Magenta-Hintergrund (#FF00FF), PNG, Tuschkontur und Farbe nach „Bildregeln“, **kein Schlagschatten im Bild**, kein Rauch, kein Licht. Die unteren 15–25 % eines Aufstellers bzw. Wandstücks blendet der Code weich in den Boden aus.

**Anschlusspunkte im Feld.** Ecken 0–5 (0 rechts, 1 rechts vorn, 2 links vorn, 3 links, 4 links hinten, 5 rechts hinten), Kanten 0–5 zwischen Ecke i und i+1 (1 = vordere, 4 = hintere Kante). „Einzug k“: Punkt auf k × Radius (k = 1 genau auf der Hexkante).
- **Hinten** (hinter der Einheit): Kanten 3, 4, 5 bzw. Ecken 4, 5 mit Einzug 0,85–0,9.
- **Vorn** (vor der Einheit): Kanten 0, 1, 2 bzw. Ecken 1, 2; vorn nur niedrige Teile.

**Höhen (verbindlich).**
- Hinten: Mauern höchstens **1,2 SH**; einzelne schmale Stämme bis **1,8 SH**, je Stamm höchstens 0,5 R breit.
- Vorn: höchstens **0,5 SH**.
- Bäume mit Kronen (2,5–3 SH): **nur am Kartenrand**, außerhalb der bespielbaren Felder.
- Hohe Teile (über 0,6 SH), die eine Einheit bis 2 R dahinter verdecken, macht der Code **zu 45 % durchsichtig**.

**Gelände-Arten aus Bausteinen**
- **Haus / Ruine (zweiteilig):**
  - Wandstück „Ruine hinten“ (1,2 SH, Innenseite mit Fensterhöhlen) auf den Kanten 3–5, Einzug 0,86.
  - Wandstück „Ruine vorn“ (Mauerrest 0,45 SH) auf den Kanten 1 und halb 2, Einzug **0,66** (weiter innen, damit er die Füße der vorderen Figuren deckt). Lücke an Kante 0 als Eingang.
  - Eckpfeiler (Aufsteller) decken die Stöße.
  - Reihenfolge ergibt sich aus der Tiefe: hinten → Einheit → vorn.
  - Figuren im Haus in der Tiefe auf 85 % gestaucht.
- **Graben (eingelassen):**
  - Grabenzug als Linie über Feldmitten und Kantenmitten (Anschluss an der Kantenmitte, Richtungswechsel 60°/120°/180° ergeben sich von selbst).
  - Flach: Längsstreifen „Grabensohle“ (von oben), Bildhöhe = 1,0 R Grabenbreite, entlang der Linie gekachelt. Zweimal gelegt: erst ganz, dann nur das mittlere Drittel (Sohle) – so verbinden sich an Abzweigen die Böden. Offene Enden bekommen einen Erdwall.
  - Aufrecht: Grabenkante vorn (Sandsäcke Außenseite, 0,32 SH) und hinten (Verschalung Innenseite mit Sandsack obenauf, **0,28 SH**, seit 2026-11-16 auf 2/3 gesenkt), je ±0,38 R neben der Linie. Welche Kante: zeigt die Innenseite eines Abschnitts deutlich vom Betrachter weg (nach Norden), steht dort „vorn“, sonst „hinten“ – fest nach Blickrichtung, damit beim Schwenken nichts wechselt.
  - Abschnitte, die in die Tiefe laufen (Verbindungsgräben): Seitenwände als Verschalung, **nach außen gekippt**. Die Oberkante liegt bis 0,9 × Wandhöhe neben der Fußlinie (projiziert) und auf 0,65 × Höhe, damit die Wand perspektivisch als Fläche sichtbar ist und der Graben nicht wie ein Steg wirkt. Übergang je nach Richtung stufenlos.
  - An Kreuzungen und Abzweigen lässt der Code die Kante dort weg, wo ein anderer Grabenzug näher als 0,42 R ist.
  - Einheit im Graben (seit 2026-11-16): Figuren **eingesunken** – der untere Teil (30 % der Bildhöhe, bis etwa Oberschenkel/Hüfte; Gürtel und Taschen sichtbar) fehlt, darüber ein weicher Übergang in die dunkle Sohle; nur Oberkörper, Helm und Gewehr ragen heraus, unabhängig von der Grabenrichtung. Figuren hintereinander auf der Grabenlinie (Abstand 0,4 R, seitlich höchstens 0,07 R). Jede Figur wird einzeln mit den Wandstücken nach Tiefe sortiert: Sohle → hintere Wand → Figur → vordere Wand.
  - Grabensohle als durchgehendes Band (gemittelte Normalen an jedem Punkt, Bildzuordnung über Dreiecke): keine Lücken an Feldgrenzen und Knicken.
  - Grabenbreite: Sohlenstreifen **1,3 R**, Kanten **0,5 R** neben der Linie (vorher 1,0 R und 0,38 R).
- **Wald im Spielfeld (licht):**
  - Waldboden-Textur.
  - Je Feld schmale Stämme (Aufsteller) an den Ecken 4 und 5, Einzug 0,85, 1,4–1,8 SH.
  - Unterholz (Wandstück, 0,3 SH) an Kante 1, Einzug 0,88.
  - Keine Kronen über bespielbaren Feldern.
- **Draht:** Wandstück 0,6 SH, Drahtlinien kräftig, Zwischenräume durchsichtig.
- **Barrikade:** Wandstück 0,55 SH.
- **Bunker:** Aufsteller 1,15 SH, höchstens 1,8 R breit, Fußpunkt 0,25 R vor der Feldmitte.
- **Stumpf:** Aufsteller 0,6–0,9 SH.
- **Große Gebäude über mehrere Felder** (Kirche, Fabrik): noch offen, siehe IDEEN.md.
- **Zusammensetzen je Geländeart** (umgesetzt in `entwurf/probe/gelaende_bau.js`, gilt für Probe und Karten-Testseite `entwurf/probe/karte.html`):
  - Boden: Schlamm als Grund. Darüber weiche Schichten: Gras auf offenen Feldern nach großflächigem Rauschen (nicht feldweise), Waldboden (Totholz, Wald), Trümmer (Dorf, Trümmerfeld, Barrikade), Sumpf (Sumpf, Schlamm). Straßen als Kopfstein-Band, Kanal als Wasser-Band mit dunkler Uferkante.
  - Die gelieferten Texturen sind sehr dunkel (Helligkeit 0,08–0,17); der Boden wird im Ganzen aufgehellt (siehe Helligkeit unten), Straßen etwas mehr.
  - Flache Details nach Feld: Trichterfeld (ein großer oder zwei kleine Trichter), Schlamm (Pfützen, Spuren), offen (gelegentlich kleiner Trichter, Spuren, Bretter, Pfütze), Dorf/Trümmer (Trümmerstreu).
  - Totholz: drei Stümpfe verteilt, oft ein schlanker Stamm hinten.
  - Wald: drei schlanke Stämme an den hinteren Ecken, Unterholz vorn.
  - Trümmerfeld: zwei Trümmerhaufen und ein niedriger Mauerrest quer zur Blickrichtung (schräge Kanten wirken sonst wie schmale Platten).
  - Draht: zwei Stücke je Feld, quer zur Blickrichtung, leicht schräg, hinten und vorn.
  - Bunker: heil oder beschädigt. Brücke: Laufrost-Bohlen quer über das Wasser.
  - Gräben werden aus den Grabenfeldern zu Zügen verbunden; Züge am Kartenrand laufen bis zur Kante weiter (ohne Erdwall).
  - **Gräben im Zickzack** (Schulterwehren, seit 2026-11-16, Schalter `zickzack`): Der Zug wird alle 0,87 R neu gesetzt und abwechselnd um ±0,3 R seitlich versetzt. Das ist nur Darstellung innerhalb der Grabenfelder; welche Felder Graben sind, bestimmen weiter die Kartendaten (Regeln unverändert).
  - **Brustwehr zur Feindseite:** Bei Stücken, die in die Tiefe laufen, steht auf der Feindseite zusätzlich eine aufrechte Sandsack-Brustwehr (Kante vorn, 0,4 SH), 0,24 R weiter außen. Feindseite: Konkordat nach Osten, Aschenwacht nach Westen; Besitzer nach Aufstellungszone.
  - **Draht:** gemalter Spiralstreifen (`draht`, jeder zweite Pfahl herausgeschnitten, Drähte um 1 px verdickt, voll deckend, ohne halbdurchsichtige Fläche). Je Drahtfeld 1–2 kurze Stücke (0,6–1,2 R), schräg (bis ±30°) und versetzt, dazu 1–3 einzelne schiefe Pfähle (`draht_pfahl_1–4`, bis ±20° geneigt). Nichts auf Straßen und Wegen. Wirr, nicht in Reihen. Drähte mit rostigem Glanz (helle Rostkante oben), von weit etwas aufgehellt.
  - **Standringe:** nah dezent wie bisher. Herausgezoomt (Feldradius unter 130 px auf dem Schirm) werden sie kräftiger, heller, mit dunklem Saum und bis 10 % größer, damit man die Trupps findet.
  - Flaches Detail „Spuren“ (`flach_details_8`) nicht verwenden: wirkt als dunkles Rechteck.
  - **Panzersperren** (Feldart `sperre`): zwei Teile je Feld. Großer Trichter: zweite Variante auf Trichterfeldern.
  - **Helligkeit:** seit den ruhigen Bodentexturen (2026-11-16, `boden_*_ruhig`, ersetzen die ersten; Wasser bleibt) Boden ×1,2, Kontrast ×1,12; eine Texturkachel deckt 3,2 R (große, flache Formen). Trümmerboden gedämpft (×0,86). Pfützen und Fußspuren nur noch als einzelne flache Details, sparsam (Spuren mit weich ausgeblendetem Rand).
  - **Bilder mit schwarzem Hintergrund** lassen sich nicht sauber freistellen (dunkle Trichter und Wasser werden löchrig). Für Gelände immer Magenta verwenden.
  - **Abwechslung:** Jedes Feld wählt Variante, Spiegelung, Größe (±15 %) und Streifen-Anfang aus seinem eigenen Zufallswert; dieselbe Karte sieht immer gleich aus, `seed` ändert die Mischung.
