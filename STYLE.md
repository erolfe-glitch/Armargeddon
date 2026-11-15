# Armargeddon – Stilvorgaben für die Oberfläche

Jede UI-Änderung hält sich an diese Datei. Referenzbild: `ui-quelle/referenz_stil.webp.webp`.

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
| `--s-friend`    | `#7A8F99` | Fraktionsfarbe **Aschenwacht** (Feldgrau) |
| `--s-gas`       | `#8A8A2E` | Gas, Gefahr |
| `--s-ink`       | `#120D0B` | Comic-Kontur, harte Schatten |

## Fraktionswappen
Jede Fraktion hat genau ein Wappen (Quelle `ui-quelle/wappen_*.png`, Teile in `ui-quelle/teile/wappen_*/`):
- **Konkordat:** eiserner Löwenkopf im Strahlenkranz, Bronze.
- **Aschenwacht:** Stahlhelm mit Sehschlitz im Strahlenkranz, Stahlgrau.

Das **ganze Emblem** (`w_emblem`, immer mit Strahlenkranz, nie beschnitten) ist die Marke der Seite, leicht aufgehellt (`.crest`). **Weniger, aber groß:**
- Obere Leiste: je Seite **ein** Medaillon (`.tb-medal`, bei 1920 px 64 px, Handy 40–46 px), darf über den Leistenrand ragen. Links neben dem eigenen Kampfkraft-Balken, rechts neben dem des Gegners; dazu eins bei „Seite am Zug“.
- Am Einheitenbild im Panel (50 px).
- Bei Siegpunkten und anderen kleinen Stellen **kein** Emblem, dort zeigt die Farbe die Seite.

Die **Fassung mit Flagge** (`w_flagge`) steht auf eroberten Zielfeldern und im Startmenü. Die Flaggen dahinter (Union-Jack-artig beim Konkordat, Schwarz-Weiß-Rot bei der Aschenwacht) sind **gewollt** und bleiben so; die alten echten Nationalflaggen-Bilder sind entfernt.

## Fraktionsfarben
Fest je Fraktion, nicht nach Freund/Feind:
- **Konkordat:** Blutrot `#BF4638` (`--s-life`, `--A`).
- **Aschenwacht:** Feldgrau `#7A8F99` (`--s-friend`, `--D`).

Gilt für Kampfkraft-Balken, Siegpunkt-Zahlen, Zielfeld-Marken (Leiste und Karte), Ringe unter den Einheiten und Figuren-Akzente (`FIG.PAL.accent`). **Kein Blau im Spiel**, auch nicht für Hilfsmarkierungen (dafür Knochenweiß oder Messing).
Die Seite erkennt man nie nur an der Farbe: dazu das Wappen bzw. der Name. Ersatzformen, falls ein Wappenbild fehlt: Schild (Konkordat) und Zackenraute (Aschenwacht).
Die Reihenfolge in der Leiste folgt der Sicht: eigene Seite links, Gegner rechts.

## Schrift
- **Headline** (`--s-head`): kantig, gut lesbar – Titel, Knöpfe, Namen. Großbuchstaben mit etwas Sperrung.
- **Werte** (`--s-body`): schlicht, Ziffern mit fester Breite (`tabular-nums`).
- Mindestens **14 px** überall, auch in Tooltips und Kleingedrucktem.
- **Kein Text in Grafiken.** Beschriftung immer als echte Schrift im HTML.

## Bauteile
- Konturen 2–3 px in `--s-ink`, harter Schatten nach unten (kein Weichzeichner).
- Balken: Rahmen texturiert, Füllung flach mit Segmentstrichen. Leben `--s-life`, Moral `--s-brass`.
- Symbol-Knöpfe: Rostknopf aus Bogen 2, Symbol aus `bogen3b_symbole`. Symbol mit dünner Kontur (1 px) in Knochenweiß `#F0EDE1`, Knopffläche dahinter leicht abgedunkelt. Tooltip als Pergamentzettel mit Name, Kosten (nur Zahl), Kurztext.
- Zustände: gewählt = Messingrand (Knopf „gewählt“); gesperrt = Knopf „gesperrt“, Symbol grau und gedimmt, **ohne** helle Kontur, dazu große Zahl (Abklingzeit).
- Leistensymbole (Lupe, Lautsprecher, Vorspulen, Vollbild): einfache flache Zeichen in Knochenweiß `#F0EDE1`, kein gemalter Bogen.
