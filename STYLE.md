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
| `--s-life`      | `#BF4638` | Leben; Fraktionsfarbe **Konkordat** (Blutrot) |
| `--s-foe-dark`  | `#713B36` | Feind dunkel |
| `--s-friend`    | `#7D8471` | Fraktionsfarbe **Aschenwacht** (Feldgrau grünlich) |
| `--s-friend-hi` | `#A0AC88` | Feldgrau aufgehellt, nur Füllung des Kampfkraft-Balkens der Aschenwacht |
| `--s-legion`    | `#6F8FB5` | Fraktionsfarbe **Blaue Legion** (Horizontblau, einziges erlaubtes Blau) |
| `--s-gas`       | `#8A8A2E` | Gas, Gefahr |
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
- **Konkordat:** Blutrot `#BF4638`.
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

## Bauteile
- Konturen 2–3 px in `--s-ink`, harter Schatten nach unten (kein Weichzeichner).
- Balken: Rahmen texturiert, Füllung flach mit Segmentstrichen. Leben `--s-life`, Moral `--s-brass`.
- **Ausnahme Kampfkraft-Balken (obere Leiste):** Füllung gemalt – Pinselform mit ausgefranstem Ende, feine Pinselstriche, Tintenkontur. Farbe bleibt die volle Fraktionsfarbe, Segmentstriche dünn.
- **Zielfeld-Marken (obere Leiste):** kleine gemalte Messingmünzen (Verlauf aus Messingtönen um `--s-brass`) mit eingeprägter Zahl (dunkles Braun, heller Grat darunter), Rand immer `--s-rust`. Erobert: Wimpel aus `ui-quelle/wimpel_fraktionen.png` mit Stange und Messingknauf am rechten Münzrand (Konkordat rot-weißes Schrägkreuz, Aschenwacht Schwarz-Weiß-Rot, Legion Blau-Weiß-Rot), kein farbiger Rand. Fester Abstand zwischen den Münzen, damit die Leiste beim Erobern nicht springt; der letzte Wimpel ragt nicht in die Messingecke. Fehlt das Bild, greift der gezeichnete Wimpel (`pennant` in ui.js).
- Symbol-Knöpfe: Rostknopf aus Bogen 2, Symbol aus `bogen3b_symbole`. Symbol mit dünner Kontur (1 px) in Knochenweiß `#F0EDE1`, Knopffläche dahinter leicht abgedunkelt. Tooltip als Pergamentzettel mit Name, Kosten (nur Zahl), Kurztext.
- Zustände: gewählt = Messingrand (Knopf „gewählt“); gesperrt = Knopf „gesperrt“, Symbol grau und gedimmt, **ohne** helle Kontur, dazu große Zahl (Abklingzeit).
- Leistensymbole (Lupe, Lautsprecher, Vorspulen, Vollbild): einfache flache Zeichen in Knochenweiß `#F0EDE1`, kein gemalter Bogen.
