# Prüfung Leistung nach U2 (Fable, 25.11.2026)

Nur gemessen, nichts in `src/` geändert. Stand: Commit `d58b364` (U2, U2b, G5 sind drin).

**Wichtig zum Lesen der Zahlen**
- Mess-PC: sehr schnell (RTX 5080, 32 Prozessor-Fäden), unsichtbarer Chrome, 1920 × 1080. Ein Digitalboard ist deutlich schwächer; dort habe ich nicht gemessen.
- Der unsichtbare Chrome zeichnet ohne Bildschirmtakt, so schnell er kann. Der Abstand zwischen zwei Bildern ist deshalb die echte Arbeitszeit je Bild. Für 60 Bilder je Sekunde darf sie höchstens 16,7 ms betragen.
- Während der Messung lief der Zeitmesser (Profiler) mit, das kostet einige Prozent.
- Die Prüfung hat länger gedauert als die vorgesehenen 20–30 Minuten (drei zusätzliche Läufe wegen des offenen Punkts unten).

## Messwerte

### Bildzeit in der Schlacht (ms je Bild)

| Was | Grauwall Mittel | Grauwall schlechteste 5 % | Sankt Ruß Mittel | Sankt Ruß schlechteste 5 % |
|---|---|---|---|---|
| Ruhig, Startansicht (Zoom 1) | 7,9–9,2 | 12–15 | 9,2 ¹ | 17 ¹ |
| Ruhig, ganze Karte | 13,9–17,0 | 24–32 | 14,7 ¹ | 32 ¹ |
| Ruhig, nah (Zoom 2,2) | 5,9 | 9,0 | 6,5 | 7,1 |
| Kamera ziehen (Zoom 1,5) | 6,4 | 10,8 | 6,9 | 11,6 |
| Artillerie-Sperrfeuer (Haubitze) | 8,3 | 13,6 | 6,2 | 10,5 |
| KI-Zug, Tempo 1× | 7,3 | 12,4 | 6,0 | 9,7 |

¹ Sankt Ruß in Runde 5 gemessen, nicht direkt nach dem Start (siehe „Offener Punkt“).

Längstes Einzelbild: 69 ms im KI-Zug auf Grauwall (eine Rechenaufgabe von 65 ms), sonst höchstens 53 ms.

### Vergleich „ganze Karte“ mit abgeschalteten Teilen (Runde 5, ms je Bild)

| Variante | Grauwall Mittel / 5 % | Sankt Ruß Mittel / 5 % |
|---|---|---|
| Wie im Spiel | 13,9 / 24,0 | 14,7 / 32,1 |
| Ohne Klone (`KLONE_ALT`) | 14,2 / 22,2 | 13,5 / 27,0 |
| Ohne Canvas-Filter (nur in der Messung abgeschaltet) | 11,3 / 15,9 | 9,6 / 14,6 |
| Bildwirkung aus | 13,0 / 17,9 | 13,1 / 26,9 |

Bei Zoom 1 bringt „ohne Filter“ 8,5 → 6,8 ms (Grauwall) und 9,2 → 6,3 ms (Sankt Ruß).

### Übriges

| Was | Wert |
|---|---|
| Gelände-Aufbau beim Laden (hinter dem Startmenü) | 1,06–1,08 s, einmal |
| Gelände-Aufbau beim Schlachtstart Sankt Ruß | 0,42–0,47 s |
| Voller Neuaufbau im Spiel | 0,36–0,45 s; in 10 Runden je einmal auf beiden Karten |
| KI je Seitenzug (Node, 4 Schlachten) | Grauwall 17 ms (5 %: 28, längster 38), Sankt Ruß 21 ms (5 %: 32, längster 37) |
| KI je Entscheidung (`AI.next`) | 0,75 ms, längste 12 ms |
| `index.html` | 45,6 MB; dazu `src/sound.js` 29,7 MB nachgeladen |
| Laden (vom eigenen Rechner) | Startmenü nach 1,0 s sichtbar, Seite fertig verarbeitet nach 7,3 s |
| Speicher (JavaScript) | Start 78–79 MB, nach 10 Runden 82–83 MB, wächst nicht weiter |
| Ton, Sankt Ruß, 9 Runden | 79 Töne gestartet, 68 wieder abgehängt, nach dem Aufräumen noch 6 Elemente da (5 spielen, davon 2 Schleifen) |

Der Bildspeicher (Leinwände, Texturen) ließ sich hier nicht messen, nur der JavaScript-Speicher.

## Antworten auf die Prüffragen in Kürze
- **Zeichenschleife:** Jedes Bild wird komplett neu gezeichnet, auch wenn nichts passiert. In jedem Bild gibt es kein `getImageData` und keine teure Sortierung. `bwBild` rechnet je Bild und Stufe nur einmal. Teuer sind die Canvas-Filter (Bremse 1) und die Geländeteile (Bremse 2).
- **Klone aus U2:** nicht messbar (Unterschied liegt in der Streuung).
- **Gelände-Aufbau:** selten, aber das Bild steht dann 0,4–0,5 s.
- **KI:** unkritisch. Am teuersten ist `bestAttackFrom` (38 % der KI-Zeit), dann `unitAt`/`heldAt` (21 %, sucht jedes Mal alle Einheiten durch), `reachable` (20 %), `posValue` (14 %).
- **Ton:** keine Häufung. Kleinigkeit im Code: Töne, die mit `pause()` enden (Einzelschuss mit `dur`, Getümmel-Schleife), werden nie vom Tonweg getrennt, weil `anBus` nur auf `ended` hört. In der Messung blieb ein Element hängen.

## Die 5 wichtigsten Bremsen

**1. Canvas-Filter in jedem Bild** – `src/ui.js`, `drawNewFigs` (Zeilen um 1766, 1784, 1811)
- Hintere Reihe jedes Trupps `brightness(0.86)`, fertige Einheiten grau, dunkle Felder, Kettenfahrzeuge mit Farbfilter und `blur`-Schatten.
- Messwert: 127 (Grauwall) bis 195 (Sankt Ruß) Filter je Bild in der Übersicht. Ohne Filter 19–35 % weniger Bildzeit, schlechteste 5 % von 24–32 ms auf 15–16 ms.
- Vorschlag: die abgedunkelten und grauen Fassungen je Figurenbild einmal vorrechnen und merken (wie `bwBild`), den Kettenschatten als fertiges Bild.
- Gewinn: 20–35 % auf dem Mess-PC; auf schwachen Grafikchips vermutlich mehr (nicht gemessen). Aufwand klein bis mittel. Risiko fürs Bild gering, mit Vergleichsbild prüfen.

**2. Geländeteile werden jedes Bild neu berechnet und gezeichnet** – `src/ui.js` `drawTilt` → `gbBis`, `src/gelaende_bau.js` `strip`
- Messwert: 3,0–5,0 ms je Bild, der größte Einzelposten (35–50 % der Zeichenzeit), auch bei stehender Kamera.
- Vorschlag: solange Kamera und Gelände gleich bleiben, die Teile je Tiefenband in ein Zwischenbild legen und nur dieses zeichnen.
- Gewinn: 2–4 ms je Bild bei stehender Kamera, nichts beim Ziehen. Aufwand mittel bis groß. Risiko mittel (Reihenfolge mit den Figuren, durchsichtige Bäume).

**3. Ganze Karte: alle Figuren voll gezeichnet, obwohl die Marken sie dort ersetzen** – `src/ui.js` `drawTilt` (`fade`), `drawNewFigs`, `kontakt`
- Messwert: Einheiten 3,3–3,4 ms je Bild, davon Kontaktschatten 0,6 ms (je Figur ein neuer Farbverlauf).
- Vorschlag: Kontaktschatten als fertiges Bild; in der Übersicht Trupps vereinfachen (in Ruhe ein Zwischenbild je Trupp).
- Gewinn: 1,5–2,5 ms in der Übersicht. Aufwand klein (Schatten) bzw. mittel (Trupp-Zwischenbild). Risiko gering bis mittel.

**4. Voller Gelände-Neuaufbau** – `src/ui.js` `gbBereit` → `GBau.aufbauen`, danach `renderTerrain` mit Filter über den ganzen Boden
- Messwert: 0,36–0,47 s Stillstand, etwa einmal in 10 Runden, dazu bei jeder Fenstergrößen-Änderung.
- Vorschlag: den Weg „nur das Feld neu“ auf weitere Feldwechsel ausdehnen. Welcher Wechsel den vollen Aufbau ausgelöst hat, habe ich nicht bestimmt.
- Gewinn: ein Ruckler weniger je rund 10 Runden. Aufwand mittel. Risiko gering.

**5. Ladegröße** – `tools/build.py`, `index.html` 45,6 MB in einem Stück
- Größte Teile: `figs.js` 15,9 MB, `gelaende.js` 13,7 MB, `figsplastik.js` 4,0 MB.
- Vorschlag: Figuren und Gelände wie die Töne daneben nachladen, dann merkt sich der Browser jede Datei einzeln.
- Gewinn: beim ersten Laden über das Netz viele Sekunden (nicht gemessen, hier nur lokal). Aufwand klein bis mittel. Risiko: kurz Ersatzfiguren, bis die Bilder da sind.

## Offener Punkt (nicht geklärt)
Auf Sankt Ruß kamen in allen drei Läufen in den ersten etwa 10 Sekunden nach dem Schlachtstart fast keine Bilder (0–2 in 5 s), obwohl das Programm nichts zu rechnen hatte. Danach lief alles normal. Mit und ohne Ton gleich. Auf Grauwall trat das beim Start nicht auf, einmal ähnlich nach 10 schnell gespielten Runden. Ob das am unsichtbaren Chrome liegt oder an der Grafikseite, weiß ich nicht. **Bitte am echten Gerät ansehen:** Steht oder ruckelt Sankt Ruß in den ersten Sekunden einer Schlacht?

## Was gut ist
- KI-Rechenzeit (17–21 ms je Seitenzug) und Speicher (bleibt bei 82–83 MB) brauchen keine Arbeit.
- Bildwirkung (`bwBild`), Boden-Projektion (`projectGround`, 0,5 ms) und die Einschläge ohne Neuaufbau sind schon gut gelöst.
- Kamera ziehen, Sperrfeuer und KI-Zug bleiben auch in den schlechtesten 5 % unter 14 ms.

**Ist eine Behebung vor U5 nötig? nein, weil** auf dem Mess-PC alle Fälle im Mittel unter 16,7 ms bleiben und Klone und 10 Grabenplätze nichts Messbares kosten. Die Ansicht „ganze Karte“ hat aber keine Reserve (schlechteste 5 % bei 24–32 ms auf einem sehr schnellen PC). Für Digitalboards würde ich Bremse 1 bald erledigen und vorher den offenen Punkt auf Sankt Ruß am echten Gerät prüfen.
