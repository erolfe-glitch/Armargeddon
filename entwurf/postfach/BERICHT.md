## 2026-11-26 – G7h-1: Graben mit den neuen Bildern + Zielfeld 1 (Punkte 85 Teil 3, 87, 89) (`37b0985`, `9058ac0`)

Gepusht. **Paket geteilt** wie erlaubt: Das hier ist **G7h-1** (Graben). **G7h-2** (Draht-Module, Ruinen, Punkt 88) folgt mit dem nächsten `pa`. **index.html ist noch nicht eingecheckt**, das kommt am Ende von G7h-2.

### Gemacht
1. **Seitenwand breit (G7-3b)** geschnitten und eingebaut: 0,22 R breit, ohne Pfosten. Die „Säulen“ an den Längskanten sind weg.
2. **Querwand als Erdblock (G7-6b)** geschnitten und eingebaut.
   - Sie geht über die volle Grabenbreite (0,95 R), die Oberseite mit der Sandsackreihe ist zu sehen.
   - Sie ist auf 0,42 SH gestaucht, ihr unterer Rand läuft weich in die Sohle aus.
   - **Noch nicht ganz richtig:** An manchen Knicken sitzt der Block halb neben dem Graben. Er ist auf die Mitte zwischen Bucht und Durchgang gesetzt, und die liegen 0,45 R versetzt (`gelaende_g7h/grauwall_leer_nah.jpg`, Block oben links). Das korrigiere ich in G7h-2.
3. **Laufsteg (87.1):** ein durchgehender, gerader Steg in der Grabenmitte, auch durch die Buchten, mit kurzem geradem Versatz am Buchtknick.
   - Die gemalten Rost-Stücke sind selbst schräg gezeichnet und ergaben ein Fischgrät-Muster. Der Steg ist jetzt im Code aus geraden Planken gezeichnet: zwei Längsbalken, Planken quer zur Laufrichtung, nur gedreht, nie geschert, selten fehlt eine Planke.
4. **Zwei versetzte Reihen (87.3):** In Gräben, die in die Tiefe laufen, stehen die Figuren im Wechsel etwa 0,12–0,18 R links und rechts der Mitte. In Buchten bleibt die Verteilung über die Breite aus G7g.
5. **Geschütz (87.4):** Einzelmodelle (Geschütze, Mörser) auf einem Grabenfeld stehen jetzt auf dem nächsten Grabenplatz auf der Sohle, nicht mehr auf der Feldmitte halb auf der Lippe. Fahrzeuge bleiben auf der Feldmitte.
6. **Zielfeld 1 (Punkt 89):**
   - **Ursache:** Auf dem Vorposten (3,4) **selbst** stand eine Panzersperre. Das Feld war damit für alle unbetretbar.
   - Die Sperre steht jetzt auf (3,5); Rückweg `SPERRE_ALT`.
   - **Neuer Test** `node tools/test_zielfelder.js`: für jede Karte, jede Seite und jedes Zielfeld eine Wegsuche mit einem Linientrupp von der Aufstellungszone, ohne Räumen. Das Zielfeld muss betretbar sein und mindestens zwei erreichbare Nachbarfelder haben.
     - Vorher schlug er auf Grauwall zweimal an (beide Seiten, Vorposten), jetzt ist er grün.
     - Er ist ein eigenes Werkzeug, nicht in test_regeln eingebaut.
   - **sim.js 100 Grauwall, vier Startwerte:**

| | Startwert 1 | 2 | 3 | 4 | **Mittel** |
|---|---|---|---|---|---|
| vorher (Sperre auf dem Vorposten) | 35 % | 33 % | 34 % | 30 % | **33 %** |
| nachher (Sperre auf 3,5) | 38 % | 39 % | 50 % | 44 % | **43 %** |

   - Das Konkordat gewinnt 10 Punkte, weil es den Vorposten jetzt halten kann.
   - Nicht ausgeglichen (gehört in Paket S).
   - Für Fahrzeuge ist der Weg an der Straße bei (3,3) damit etwas weniger zugestellt.

### Nicht gemacht (kommt in G7h-2 oder ist offen)
- Ende des Sandsackwalls unregelmäßig.
- Scharfschützen liegend im Graben, Bild.
- Messung „85 % der Grabenfläche in Grabenfeldern“.
- **Bild mit Panzer im Graben:** Die Probe setzt den Koloss auf (2,6), er ist in `vergleich_nah2.jpg` aber nicht zu sehen. Vermutlich findet die Probe ihn nicht unter den Einheiten; das prüfe ich in G7h-2.
- Punkt 84.12 (Warnsymbole am Weg, Mauszeiger): nicht geprüft.

### Bilder (`entwurf/probe/gelaende_g7h/`)
- `vergleich_nah.jpg`, `vergleich_nah2.jpg`, `vergleich_ganz.jpg`: links G7H_ALT, rechts neu, jeweils mit Trupps im Graben und gewähltem Hauptmann.
- `grauwall_leer_nah.jpg`: Graben ohne Einheiten, darauf sieht man Laufsteg, Seitenwand und Querwand am besten.

### Tests
- test_kommentare vor jedem build.py, bestanden. Einmal ein Fehlalarm in einem Werkzeug-Kommentar, umformuliert.
- test_regeln und test_zielfelder bestanden.
- Partietest mit Grafikkarte, 5 Minuten: Runden 1–3, keine Fehler.
- Keine Hänger. Den Chrome im Hintergrund habe ich beendet. Der Vorschau-Server war ausgefallen; ich habe ihn ohne sichtbare Vorschau neu gestartet, er läuft weiter.

### Fragen an Enrico
1. Passt der Laufsteg aus geraden Planken, oder lieber wieder gemalte Roste, sobald der Berater gerade Stücke malt?

