# Karte „Sankt Ruß“ – Plan

Stand 2026-11-19, entschieden mit Enrico. Nächste Karte nach Grauwall, ganz aus Gelände-Bausteinen (Regeln: STYLE.md „Gelände-Bausteine“).

## Eckdaten (entschieden)

- **Neue Karte**, kein Umbau einer alten.
- **Schauplatz:** zerschossenes Dorf um eine ausgebrannte Kirche.
- **Größe:** etwa wie Grauwall.
- **Sieg:** Siegpunkte wie bisher (Fahnen erobern und halten).
- **Aufbau:** Dorf in der Mitte, beide Seiten kommen von außen (Konkordat von Westen, Aschenwacht von Osten).
- **Gräben:** je Seite eine Grabenlinie am eigenen Dorfrand, dazwischen Häuserkampf.
- **Kirche:** betretbar mit starker Deckung, Turm als Beobachtungsposten, kann einstürzen, ist der Hauptsiegpunkt.

## Aufbau (Vorschlag, beim Bauen anpassen)

- **Mitte:** Kirche über 3 Felder (Langhaus 2 Felder, Turm 1 Feld). Nördlich davon der Friedhof mit niedriger Mauer, südlich der Dorfplatz mit Brunnen.
- **Hauptstraße** (Kopfstein) von West nach Ost durchs Dorf, Seitengassen nach Norden und Süden.
- **Häuserruinen** beidseits der Straße, dazwischen Gärten mit niedrigen Mauern und zerschossenen Zäunen, einzelne Trichter und Trümmer.
- **Dorfrand:** je Seite ein Grabenzug (Zickzack wie Grauwall) mit etwas Draht davor, dahinter die Aufstellungszone.
- **Fahnen:** Kirche (Hauptsiegpunkt), Friedhof, Dorfplatz, dazu je eine Fahne nahe jeder Seite (z. B. Gutshof-Ruine, Wegkreuz). Anzahl und Werte wie Grauwall, Kirche zählt doppelt.
- Spiegelbildlich genug für faire Balance, aber nicht exakt gespiegelt.

## Regeln der Kirche (Startwerte, per Simulation abstimmen)

- **Betreten:** nur Infanterie und Anführer. Fahrzeuge, Schreiter, Reiter und Geschütze nicht.
- **Deckung:** ×1,8 (Graben ×1,6, Ruine ×1,5), halber Moralverlust wie im Bunker.
- **Turm:** Einheit im Turmfeld bekommt +1 Reichweite und +1 Sicht.
- **Einsturz:** Die Kirche hat einen Bauzustand. Treffer von Artillerie, Mörsern und schweren Kanonen ziehen ihn herunter. Bei 0 stürzt sie ein: Alle Kirchenfelder werden Ruine (Deckung ×1,5), der Turm fällt (Turmvorteil weg), Einheiten darin bekommen Schaden und Schock. Großer Einsturz-Effekt, Ton „Glocke fällt“.
- **Hauptsiegpunkt:** zählt doppelt.
- **Darstellung** (IDEEN.md „große Gebäude“): Jedes Feld bekommt eigene Wandstücke (hinten hoch, vorn niedrig), der Turm steht als hoher Aufsteller auf seinem Feld und wird durchsichtig, wenn er Einheiten verdeckt. Innen keine Wände zwischen den Feldern, nur Bänke, Trümmer, Säulenstümpfe.

## Neue Bausteine (Gemini-Prompts unten)

| Nr. | Datei | Art | Inhalt |
|---|---|---|---|
| G15 | `kirche_hinten.png` | Wandstück | hohe Kirchenmauer mit Spitzbogenfenstern, Strebepfeilern |
| G16 | `kirche_vorn.png` | Wandstück | niedriger Mauerrest der Kirche |
| G17 | `kirchturm.png` | Aufsteller (2) | Turm heil und zerschossen |
| G18 | `kirche_innen.png` | Aufsteller (4) | Bänke, Altarrest, gefallene Glocke, Säulenstumpf |
| G19 | `friedhof.png` | Aufsteller (4) | Grabkreuze, Grabsteine, kopflose Heiligenfigur |
| G20 | `mauer_niedrig.png` | Wandstück | niedrige Bruchsteinmauer (Friedhof, Gärten) |
| G21 | `dorf_aufsteller.png` | Aufsteller (4) | Brunnen, Wegkreuz, Karren, Laternenpfahl |
| G22 | `zaun.png` | Wandstück | zerschossener Gartenzaun, ca. 1 SH hoch, Lücken zwischen den Latten durchsichtig. Nur an den **hinteren** Feldkanten der Gärten (Kanten 3–5), je Garten Zaun oder Bruchsteinmauer gemischt; vorn bleibt die niedrige Mauer. Deckung wie Garten (×1,2). Eingebaut 2026-11-19. |

Vorhanden und weiter genutzt: Ruinen (G6–G8), Trümmer (G14), Kopfstein- und Trümmerboden, Gräben, Draht, Barrikade, Stümpfe. Noch offen von Grauwall: Bäume mit Kronen am Kartenrand (A7).

Ablage: `ui-quelle/gelaende/`. Bei allen Prompts mitgeben: `ui-quelle/konzept/einzel_konzept.png` (Stil) und `ui-quelle/figuren/konkordat_soldat.png` (Blickwinkel, Maßstab). G15 und G16 im selben Gespräch erzeugen, damit das Mauerwerk gleich bleibt.

## Töne (gesucht)

- Kirchenglocke: einzelner dumpfer Schlag (z. B. Rundenbeginn auf dieser Karte, sparsam)
- Glocke fällt / Turm stürzt ein (Einsturz)
- Krähen (leise Kulisse)
- Wind in Ruinen (leise Kulisse)

## Ablauf

1. Bilder G15–G21 in Gemini (Enrico, bis Samstag).
2. Töne suchen (Enrico).
3. Claude Code: Karte anlegen (Feldcodes, Fahnen, Aufstellung), große Gebäude technisch, Kirchenregeln, Bausteine einbauen, KI auf die Kirche einstellen, Balance per Simulation (Ziel um 50 %).
4. Spieltest Enrico.

## Gemini-Prompts

### G15. Kirchenmauer hinten (Wandstück) → `kirche_hinten.png`

```
Create the BACK walls of a ruined village church as ONE horizontally tileable strip, seen from inside the nave: tall weathered grey stone wall, about 1.6 standing soldiers high, broken jagged top edge, two tall pointed-arch window openings with shattered stone tracery and no glass, a heavy stone buttress between them, soot stains and scorch marks, fragments of faded wall painting, rubble heaped along the foot of the wall.

Format: ONE horizontally tileable strip on a wide 1792×512 image (the strip itself may be lower than the image; keep magenta above it). Camera: seen from the front, the strip runs exactly parallel to the image, slightly from above like the attached soldier sheet so the top edge is just visible, NO perspective convergence – both ends exactly the same size. The left and right ends must match seamlessly so the strip can be repeated side by side. The bottom edge of the strip is a straight horizontal line where it stands on the ground; no ground drawn in front of or behind it. The strip is about 5 standing soldiers long (relative to the attached soldier sheet). Background: flat pure magenta (#FF00FF), no gradient, no cast shadow, no smoke, no fire, no light beams.

Style: dark gothic trench-warfare comic illustration, exactly like the attached style reference (einzel_konzept.png): thick black ink outlines, hand-inked hatching, gritty painted textures, muted desaturated colours (grey-green-brown), rust, mud and soot, a world inspired by the First World War but our own fictional setting – no real places, no real insignia, no existing franchise, no readable inscriptions. No people, no text, no frame.
```

### G16. Kirchenmauer vorn (Wandstück) → `kirche_vorn.png`

```
Same stone as the previous image. Create the FRONT remains of the same ruined church as ONE horizontally tileable strip, seen from outside: a low broken stone wall stump, only about 0.45 standing soldiers high (knee to hip height), uneven top with loose carved stones, the stump of a broken buttress, a few rubble piles leaning against it, one low gap. Soldiers will stand behind it, so it must stay low.

Format: ONE horizontally tileable strip on a wide 1792×512 image (the strip itself may be lower than the image; keep magenta above it). Camera: seen from the front, the strip runs exactly parallel to the image, slightly from above like the attached soldier sheet so the top edge is just visible, NO perspective convergence – both ends exactly the same size. The left and right ends must match seamlessly so the strip can be repeated side by side. The bottom edge of the strip is a straight horizontal line where it stands on the ground; no ground drawn in front of or behind it. The strip is about 5 standing soldiers long (relative to the attached soldier sheet). Background: flat pure magenta (#FF00FF), no gradient, no cast shadow, no smoke, no fire, no light beams.

Style: dark gothic trench-warfare comic illustration, exactly like the attached style reference (einzel_konzept.png): thick black ink outlines, hand-inked hatching, gritty painted textures, muted desaturated colours (grey-green-brown), rust, mud and soot, a world inspired by the First World War but our own fictional setting – no real places, no real insignia, no existing franchise, no readable inscriptions. No people, no text, no frame.
```

### G17. Kirchturm (Aufsteller) → `kirchturm.png`

```
Create a sheet of 2 variants of the same village church bell tower, side by side on a wide 1792×1024 image, each centred in its half with clear magenta space around it, at the same scale as the soldier on the attached sheet.

Object: a square grey stone bell tower, about 3.5 soldiers high and about 1.5 soldiers wide, pointed-arch openings in the belfry, a short broken spire, soot and shell scars.
Left: standing but damaged – holes from shell hits, spire snapped, the bell still hanging in the belfry. Right: collapsed – only the lower third remains, jagged broken top, heap of stones and a charred beam around its base.

Camera: exactly the same viewing angle, perspective and scale as the attached soldier sheet (konkordat_soldat.png) – three-quarter view from front-right, slightly from above, light from top-left. Each object stands on its own small, flat, irregular base of mud (only directly under the object). Background: flat pure magenta (#FF00FF), no gradient, no cast shadow, no smoke, no fire, no light beams. Nothing may touch the image border or the neighbouring object.

Style: dark gothic trench-warfare comic illustration, exactly like the attached style reference (einzel_konzept.png): thick black ink outlines, hand-inked hatching, gritty painted textures, muted desaturated colours (grey-green-brown), rust, mud and soot, a world inspired by the First World War but our own fictional setting – no real places, no real insignia, no existing franchise, no readable inscriptions. No people, no text, no frame.
```

### G18. Kircheninneres (Aufsteller) → `kirche_innen.png`

```
Create a sheet of 4 different objects from inside a ruined church, arranged in a 2×2 grid on a square 1264×1264 image, each centred in its quarter with clear magenta space around it, all at the same scale as the soldier on the attached sheet.

Pieces (top left, top right, bottom left, bottom right):
1. two overturned and splintered wooden church pews, about 0.4 soldiers high, about 1.5 soldiers long
2. the remains of a stone altar block, cracked, with a torn cloth, about 0.5 soldiers high
3. a large fallen bronze church bell lying on its side, cracked, green patina, about 0.6 soldiers high
4. a broken stone column stump with a fallen capital beside it, about 0.7 soldiers high

Camera: exactly the same viewing angle, perspective and scale as the attached soldier sheet (konkordat_soldat.png) – three-quarter view from front-right, slightly from above, light from top-left. Each object stands on its own small, flat, irregular base of mud (only directly under the object). Background: flat pure magenta (#FF00FF), no gradient, no cast shadow, no smoke, no fire, no light beams. Nothing may touch the image border or the neighbouring object.

Style: dark gothic trench-warfare comic illustration, exactly like the attached style reference (einzel_konzept.png): thick black ink outlines, hand-inked hatching, gritty painted textures, muted desaturated colours (grey-green-brown), rust, mud and soot, a world inspired by the First World War but our own fictional setting – no real places, no real insignia, no existing franchise, no readable inscriptions. No people, no text, no frame.
```

### G19. Friedhof (Aufsteller) → `friedhof.png`

```
Create a sheet of 4 different pieces of a shell-torn village graveyard, arranged in a 2×2 grid on a square 1264×1264 image, each centred in its quarter with clear magenta space around it, all at the same scale as the soldier on the attached sheet.

Pieces (top left, top right, bottom left, bottom right):
1. three simple wooden and iron grave crosses, leaning at different angles, about 0.5 soldiers high
2. two weathered stone gravestones, one cracked and tilted, about 0.45 soldiers high
3. a toppled stone grave slab with a broken corner and an upturned mound of earth, about 0.3 soldiers high
4. a headless stone saint statue on a small pedestal, arms broken, soot-stained, about 1 soldier high

Camera: exactly the same viewing angle, perspective and scale as the attached soldier sheet (konkordat_soldat.png) – three-quarter view from front-right, slightly from above, light from top-left. Each object stands on its own small, flat, irregular base of mud (only directly under the object). Background: flat pure magenta (#FF00FF), no gradient, no cast shadow, no smoke, no fire, no light beams. Nothing may touch the image border or the neighbouring object.

Style: dark gothic trench-warfare comic illustration, exactly like the attached style reference (einzel_konzept.png): thick black ink outlines, hand-inked hatching, gritty painted textures, muted desaturated colours (grey-green-brown), rust, mud and soot, a world inspired by the First World War but our own fictional setting – no real places, no real insignia, no existing franchise, no readable inscriptions or names. No people, no text, no frame.
```

### G20. Niedrige Mauer (Wandstück) → `mauer_niedrig.png`

```
Create a low dry-stone village wall as ONE horizontally tileable strip, as used around graveyards and gardens: rough grey field stones, about 0.45 standing soldiers high, moss-free and soot-stained, a few stones knocked off the top, one small gap where a rusty iron gate hangs open.

Format: ONE horizontally tileable strip on a wide 1792×512 image (the strip itself may be lower than the image; keep magenta above it). Camera: seen from the front, the strip runs exactly parallel to the image, slightly from above like the attached soldier sheet so the top edge is just visible, NO perspective convergence – both ends exactly the same size. The left and right ends must match seamlessly so the strip can be repeated side by side. The bottom edge of the strip is a straight horizontal line where it stands on the ground; no ground drawn in front of or behind it. The strip is about 5 standing soldiers long (relative to the attached soldier sheet). Background: flat pure magenta (#FF00FF), no gradient, no cast shadow, no smoke, no fire, no light beams.

Style: dark gothic trench-warfare comic illustration, exactly like the attached style reference (einzel_konzept.png): thick black ink outlines, hand-inked hatching, gritty painted textures, muted desaturated colours (grey-green-brown), rust, mud and soot, a world inspired by the First World War but our own fictional setting – no real places, no real insignia, no existing franchise. No people, no text, no frame.
```

### G21. Dorfplatz (Aufsteller) → `dorf_aufsteller.png`

```
Create a sheet of 4 different village square objects in a war-torn village, arranged in a 2×2 grid on a square 1264×1264 image, each centred in its quarter with clear magenta space around it, all at the same scale as the soldier on the attached sheet.

Pieces (top left, top right, bottom left, bottom right):
1. a round stone village well with a broken wooden roof and a hanging bucket, about 1.1 soldiers high
2. a weathered wooden wayside shrine on a post with a tiny pitched roof, splintered, about 1.2 soldiers high
3. an overturned wooden farm cart with one broken wheel, about 0.6 soldiers high
4. a bent cast-iron street lamp post with shattered lantern, about 1.6 soldiers high, narrow

Camera: exactly the same viewing angle, perspective and scale as the attached soldier sheet (konkordat_soldat.png) – three-quarter view from front-right, slightly from above, light from top-left. Each object stands on its own small, flat, irregular base of mud (only directly under the object). Background: flat pure magenta (#FF00FF), no gradient, no cast shadow, no smoke, no fire, no light beams. Nothing may touch the image border or the neighbouring object.

Style: dark gothic trench-warfare comic illustration, exactly like the attached style reference (einzel_konzept.png): thick black ink outlines, hand-inked hatching, gritty painted textures, muted desaturated colours (grey-green-brown), rust, mud and soot, a world inspired by the First World War but our own fictional setting – no real places, no real insignia, no existing franchise, no readable inscriptions. No people, no text, no frame.
```
