# Raster-Studie – Ergebnis (Fable, 25.11.2026)

Nur geprüft, gezählt und Probebilder gemacht. In `src/` ist nichts geändert. Keine Simulationsläufe (ein Quadrat-Raster lässt sich nicht messen, ohne es zu bauen).

## Kurz gesagt

**Empfehlung: bei den Sechsecken bleiben** – und die drei Dinge, die an den Quadraten reizen, einzeln auf den Sechsecken nachbauen:

1. **Gräben und Mauern als freie Linie** (das Bild läuft gerade, die Regel gilt für die Felder, durch die die Linie geht),
2. **Deckung an der Feldkante** (Sandsäcke, Mauer, Hecke liegen zwischen zwei Feldern) – geht auf Sechsecken genauso,
3. **Kettenfahrzeuge über 2 Felder** – das ist ein eigener großer Umbau, der in jedem Raster gleich viel kostet. Auf Sechsecken passt er sogar besser.

Das Bild dazu: `entwurf/probe/raster/raster_hexfrei.jpg` (Variante 1b).

## Warum nicht wechseln – die drei wichtigsten Befunde

1. **Die viele Arbeit an den Gräben (G4–G7) kommt nicht vom Sechseck.**
   - Die Feuergräben auf Grauwall laufen entlang der Spalten. Die sind auf unseren Sechsecken **schon schnurgerade** (siehe `raster_hex.jpg`).
   - Das Zickzack darin (Feuerbuchten, Querwände) ist **gewollt** und bliebe bei Quadraten genau gleich.
   - „Pappe statt Graben“ (G7) liegt an der Bauweise (aufrechte Wandstreifen statt eingegraben). **G7 fällt bei Quadraten nicht weg.**
   - Wirklich am Sechseck liegt nur: **Quergräben springen von Feldmitte zu Feldmitte** (das „X“ aus der G1-Probe). Das löst die freie Linie: Eine gerade Linie eine Viertel-Feldhöhe neben den Feldmitten läuft durch genau dieselbe Feldkette. Die Figuren stehen seit U2 ohnehin an der Grabenlinie und nicht in der Feldmitte.
2. **Mehrere Felder je Fahrzeug ist der teure Teil – und der hat mit der Feldform nichts zu tun.** Heute gilt überall „eine Einheit = ein Feld“ (76 Stellen fragen „wer steht auf diesem Feld“, rund 400 Stellen nutzen den einen Standort einer Einheit: Wegsuche, Sicht, Nahkampf, KI, Zeichnen, Anklicken, Tests).
3. **Ein Wechsel wirft das Gleichgewicht und alle drei Karten weg**, mitten im Umbau. Ein Feld hätte 8 statt 6 Nachbarn (Befehle, Auren, Gas, Umzingeln, Nahkampf wirken auf ein Drittel mehr Felder), Reichweiten und Zugweiten ändern sich (Bild `raster_quad_zugweite.jpg`: mit 2 Punkten 12 Felder statt 18). Grauwall reagiert schon auf ein versetztes Grabenende mit 23 % statt 47 %.

## Vergleichstabelle

| | **1 Sechsecke** (mit freier Linie, Kanten-Deckung, 2-Feld-Fahrzeugen = „1b“) | **2 Quadrate, 8 Richtungen, Deckung an Kanten** | **3 Frei ohne Raster** |
|---|---|---|---|
| **Bewegung, Aufstellung** | 6 gleich lange Richtungen, ganze Bewegungspunkte. 8 Mann (3-2-3) passen ins Feld. | 8 Richtungen, aber schräg ist 41 % weiter: braucht halbe Punkte (1,5) und Eckenregeln (darf man zwischen zwei Gegnern schräg durch? Sicht über Ecken?). Wirkt eckiger, nicht freier. 8 Mann passen gleich gut. | Am freiesten. Jede Regel wird Abstand in Zentimetern statt Feldern. |
| **Gelände, gerade Gräben** | Längs schon gerade. Quer und schräg mit freier Linie gerade. Häuser bleiben im Sechseck etwas „eingepasst“. | Längs und quer gerade von selbst, Häuser und Mauern passen sauber. Schräge Gräben werden Treppen. Feuerbuchten und G7 bleiben gleich viel Arbeit. | Alles frei setzbar. Deckung muss je Schuss geometrisch gerechnet werden. |
| **Fahrzeuge über mehrere Felder** | 2 Felder hintereinander, **alle 6 Richtungen gleichwertig**; 4 davon liegen fast quer und passen zu den vorhandenen Seitenansichten. | 2×1 nur in **4 Richtungen** sauber (schräg hängen die zwei Felder nur an einer Ecke). 2×2 dreht sich frei, ist aber für unseren Maßstab zu groß (Bild). | Am natürlichsten (Umriss statt Felder). |
| **Touch** | Gut (Feld antippen). Wie heute. | Gleich gut. | Schwierig: genaues Ziehen mit dem Finger, Maßband-Vorschau nötig, Figuren verdecken sich. |
| **KI** | Bleibt. Für Kanten-Deckung und 2-Feld-Fahrzeuge je ein Stück Arbeit. | Rechnet nach dem Wechsel weiter (Grundrechnen ist gekapselt), aber alle Gewichte neu; dazu dieselbe Arbeit für Kanten und Mehrfeld. | Neu schreiben (Wege, Stellungswahl, Reichweiten). |
| **Aufwand** | etwa **4–5 Pakete**, einzeln und in beliebigem Abstand | etwa **10–12 Pakete**, bevor der Umbau (U5 …) weitergeht, dazu ein deutlich größeres U9 | **15+ Pakete**, praktisch ein Neubau |
| **Risiko** | niedrig bis mittel (2-Feld-Fahrzeuge: mittel) | hoch: alles gleichzeitig offen, Messbasis weg, Karten neu | sehr hoch |

## Was am Sechseck hängt (grobe Größe bei einem Wechsel)

S = bis 1 Stunde · M = halber Tag · L = ganzes Paket

| Teil | Befund | Größe |
|---|---|---|
| Grundrechnen (Nachbarn, Abstand, Winkel, Linie zwischen zwei Feldern) | sauber an einer Stelle (engine.js, etwa 45 Zeilen) | S |
| Blickrichtung, Schussfächer, Flanke/Rücken, Drehkosten | fest auf 6 Richtungen in 60°-Schritten (Fächer ±60/±90/±135°, Flanke bis 121°) → 8 Richtungen in 45° | M |
| Wegsuche und Kosten | schräg 1,5 → halbe Bewegungspunkte in Anzeige und Regeln, Eckenregeln | M |
| Sichtlinie | neue Linie, Ecken, dazu Kanten-Deckung | M |
| Flächen und Reichweiten (Gas, Feuer, Sperrfeuer, Befehle, Auren, Nachschubfelder, Zielfelder; 48 Abstands- und 25 Nachbar-Stellen in den Regeln) | laufen von selbst mit – aber jede Wirkung ändert sich | S im Code, **L im Abgleich** |
| KI (36 Abstands-, 10 Nachbar-Stellen) | läuft mit, Gewichte neu | M + U9 |
| Karten (Grauwall, Sankt Ruß, Krähenfurt): Raster, Grabenlinien, Drahtplan, Aufstellzonen, Kirche | neu zeichnen und neu abgleichen | L–2 L |
| Gelände-Aufbau GBau (1000 Zeilen) | Gräben laufen schon entlang von Linien (bleibt großteils). Drahtgürtel, Mauerzüge, Gebäudekanten, Straßen wählen Stücke nach Sechseck-Nachbarn → neu | L |
| Ansicht und Bedienung (Felder zeichnen, Klick → Feld, Markierungen; 32 Stellen plus viele 60°-Winkel) | umstellen | M |
| Tests und Messwerkzeuge (14 Testdateien, sim, costcheck, Statistik) | anpassen; alle alten Messwerte gelten nicht mehr | M |
| **„Eine Einheit = ein Feld“** (76 + rund 400 Stellen) | nur für Fahrzeuge über mehrere Felder nötig – **in jedem Raster gleich** | **L–2 L** |

## Gelände im Vergleich

- **Leichter mit Quadraten:** Quergräben, gerade Mauern, rechteckige Häuser und Kirche, Drahtgürtel quer. Deckung an der Kante ist dort üblich und gut lesbar.
- **Gleich:** Feuerbuchten/Querwände, eingegrabene Bauweise (G7), Grabenboden, Grabenplätze der Figuren, Panzersperren (G6).
- **Schwerer mit Quadraten:** alles Schräge (Treppen statt Linie), runde Formen (Trichterfelder, Waldränder wirken kästchenhaft), Reichweiten sehen eckig aus.
- **Mit freier Linie auf Sechsecken** (1b) bekommt man gerade Gräben und Mauern in **jeder** Richtung, auch schräg. Nachteil: Ein Trupp im Quergraben steht bis zu einer knappen halben Feldhöhe neben der Feldmitte. Ring und Balken müssen dann an der Figur sitzen statt in der Feldmitte (bei den Grabenplätzen ist das schon so).

## Fahrzeuge über mehrere Felder

| | Sechsecke (2 Felder hintereinander) | Quadrate (2×1, Koloss 2×2) |
|---|---|---|
| Drehen | 6 Stellungen, das Heck schwenkt um ein Feld (muss frei sein), 1 Punkt je 60° wie heute | 4 Stellungen, je Drehung 90° und ein freies Feld; 2×2 dreht ohne Platzbedarf |
| Enge Stellen | Drahtgasse von 1 Feld Breite geht (fährt der Länge nach durch) | gleich; 2×2 braucht 2 Felder breite Gassen → Karten müssten größer werden |
| Sicht und Schuss | vom vorderen Feld aus; das Fahrzeug ist auf beiden Feldern Ziel | gleich |
| Nahkampf | 8 statt 6 Felder Berührung → leichter zu umstellen; das Heckfeld ist eindeutig „Rücken“ | 10 Felder Berührung bei 2×1, 12 bei 2×2 |
| Überrollen | Weg in Blickrichtung, Heck folgt; trifft, was auf dem vorderen Feld steht | gleich; 2×2 walzt zwei Felder breit |
| Bild | 4 von 6 Stellungen liegen fast quer → vorhandene Seitenansichten passen (gespiegelt). Die 2 senkrechten Stellungen brauchen neue Bögen (von vorn/hinten) | 2 von 4 Stellungen passen, die 2 senkrechten brauchen neue Bögen |

- **Maßstab:** 2 Felder Länge passen gut zum Landkoloss (etwa 6 Soldatenhöhen). **2×2 wäre so groß wie ein Haus** und auf 16×10 Feldern kaum zu bewegen.
- **Günstigere Zwischenlösung** (ein kleines Paket): Das Fahrzeug bleibt in den Regeln auf 1 Feld, sperrt aber das Feld hinter sich für andere („Heckfeld“). Sieht größer aus, kostet fast keinen Umbau. Kein echtes 2-Feld-Ziel.

## Aufstellung 8 / 6 / 3

- 8 Mann als 3-2-3 passen in beide Feldformen ohne Überstand (Sechseck auf Höhe der äußeren Reihen 1,5 Feldradien breit, Quadrat 1,6).
- Im Graben längs stehen 8 Mann in beiden Rastern eng (Sechseck 1,73 Feldradien Länge je Feld, Quadrat 1,61). Zwei versetzte Reihen wie heute (Feindwand und dahinter) bleiben nötig.
- **8/6/3 hängt nicht am Raster** und kann sofort kommen (Punkt 72).

## Balance

- **Bei Quadraten: alles neu** – Zugweiten, Reichweiten, alle Flächenwirkungen, drei Karten, Armeen, KI-Gewichte, Preise. Die Zwischenmessungen nach U5/U7/U8 hätten keinen Vergleichsstand mehr.
- **Bei 1b:** freie Linie nichts (Felder bleiben dieselben). Kanten-Deckung: die betroffenen Karten neu messen. 2-Feld-Fahrzeuge: Kettenfahrzeuge neu bepreisen, alle Karten neu messen (passt in U9).

## Aufwand für einen Wechsel zu Quadraten (falls doch gewünscht)

Müsste **jetzt** kommen, vor G7 und U5, weil alles Weitere auf Feldern aufbaut. U0/U1 bleiben gültig, von G2–G5b und U2 bleibt die Grabenform; Drahtgürtel-Wahl und Karten müssten neu.

1. **Q1** Raster und Ansicht: Grundrechnen, Felder zeichnen, Anklicken, Markierungen (M–L)
2. **Q2** 8 Blickrichtungen: Schussfächer, Flanken, Drehkosten (M)
3. **Q3** Bewegung mit halben Punkten, Eckenregeln, Sichtlinie (M)
4. **Q4** Grauwall neu zeichnen (L)
5. **Q5** Sankt Ruß und Krähenfurt neu zeichnen (L)
6. **Q6** Gelände-Aufbau: Draht, Mauern, Gebäude, Straßen (L, eher zwei Pakete)
7. **Q7** Deckung an Feldkanten: Regel, Anzeige, KI (L)
8. **Q8** Fahrzeuge über mehrere Felder (L, zwei Pakete)
9. **Q9** KI, Tests, Messwerkzeuge (M)
10. dann erst G7, U5–U8, und **U9 deutlich größer** (alles neu abgleichen)

**Was wegfiele:** das „X“ bei Quergräben und Mauerzüge im Zickzack um Sechseck-Kanten. **Nicht:** G7, Feuerbuchten, G6.

## Empfohlener Weg (Sechsecke, Variante 1b)

| Paket | Inhalt | Größe | Wann |
|---|---|---|---|
| **R1** | 8/6/3 (Punkt 72) und Feldlinien dezenter | S | sofort |
| **R2** | Gräben und Mauern als freie Linie: Punkte dürfen zwischen Feldmitten liegen, Grabenfelder werden daraus abgeleitet („Bild = Regel“ bleibt) | S–M | zusammen mit G7b (der Grabenaufbau wird dort ohnehin neu gemacht) |
| **R3** | Deckung an der Feldkante als neue Regel (Sandsackwall, Mauer, Hecke auf der Kante; schützt nur gegen Beschuss über diese Kante), mit Schild-Zeichen und KI | M–L | nach U5 (dort wird Deckung ohnehin wichtiger), spätestens mit G6 |
| **R4** | Kettenfahrzeuge über 2 Felder (Landkoloss, Sturmpanzer, Bohrkoloss; Schreiter bleiben auf 1 Feld). Vorher die Zwischenlösung „Heckfeld gesperrt“ als Probe | L, eher zwei Pakete | nach U8, vor U9 |

## Fragen an Enrico

1. Reicht dir Variante 1b (Bild `raster_hexfrei.jpg`) als „mehr Freiheit“ – oder willst du die Quadrate trotz des Aufwands?
2. Fahrzeuge: erst die günstige Zwischenlösung (Heckfeld gesperrt) ausprobieren oder gleich echte 2 Felder?
3. Deckung an Feldkanten (R3): gewünscht?

## Probebilder (`entwurf/probe/raster/`)

Gleicher Grauwall-Ausschnitt, gleiche Ansicht, echte Figuren und Bodenbilder; Gräben, Sandsäcke und Raster sind vereinfacht gezeichnet (nicht der Spiel-Aufbau).

- `vergleich_drei_varianten.jpg` – alle drei untereinander
- `raster_hex.jpg` – Variante 1: Sechsecke wie heute, Koloss auf 1 Feld, Quergraben im Zickzack
- `raster_hexfrei.jpg` – Variante 1b: Sechsecke, Quergraben als gerade Linie, Sandsäcke an der Feldkante, Koloss über 2 Felder
- `raster_quad.jpg` – Variante 2: Quadrate, Deckung an Feldkanten, Koloss 2×1, Umriss 2×2 zum Größenvergleich
- `raster_hex_zugweite.jpg`, `raster_quad_zugweite.jpg` – Zugweite mit 2 und 3 Bewegungspunkten
- `raster.html` – die Probeseite (`?v=hex`, `hexfrei`, `quad`, dazu `&reich=1`)
