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

- **Größe zum Feld** (feste Klassen, im Code `SHT` in `figures.js`):
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
