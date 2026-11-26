## 2026-11-26 – G7h-2: Lattenroste, Draht-Module, Hausruinen, Rest aus G7h (Punkte 87, 88, 84.12) (`631a996`, `cf0db67`, index.html: siehe unten)

Gepusht. Damit ist **G7h fertig**, index.html ist eingecheckt.

### Gemacht
1. **Laufsteg aus den gemalten Lattenrosten** (`graben_laufsteg_bogen.png`, 4 Streifen):
   - 0,35 R breit, entlang der Grabenmitte gekachelt, nur gedreht, nie geschert, dunkel vorgefiltert.
   - Der Streifen mit den fehlenden Latten kommt in etwa 7 % der Kacheln.
   - Der Code-Steg aus G7h-1 bleibt als Rückweg `window.STEG_ALT`.
   - Bild: `entwurf/probe/gelaende_g7h2/vergleich_laufsteg.jpg` (links Code-Steg, rechts Lattenroste).
2. **Drahtgürtel in die Tiefe aus Querschnitt-Modulen** (Punkt 88.2):
   - Je Feld 3 Module hintereinander, gleiche Breite (0,82 R), Abstand 0,6 R, von hinten nach vorn gezeichnet.
   - Zwischen den Modulen läuft eine Drahtlinie im Code von Pfahlkopf zu Pfahlkopf.
   - Etwa 8 % der Module sind kaputt, 5 % lose Reste.
   - Die Pfahlreihen laufen jetzt parallel.
   - Rückweg `window.MODUL_ALT`.
   - Bild: `vergleich_draht_tiefe.jpg` (links das alte Stück mit Fluchtpunkt).
   - **`_schraeg`, `_quer` und `_ende` haben das Problem nicht**, ihre Pfahlreihen laufen parallel. Sie bleiben, wie sie sind.
3. **Hausruinen** (Punkt 88.1):
   - Je Dorffeld ein ganzes Modell `ruine_haus_1–4`, 1,62 R breit, über Eck wie gemalt, nicht gespiegelt (Licht von links), leicht abgedunkelt.
   - Rückweg `window.RUINE_ALT`.
   - Figuren im eigenen Feld stehen **vor** der Ruine. Vorher wurde sie bei jeder Einheit im Feld durchsichtig und war auf Sankt Ruß kaum zu sehen.
   - Gilt für Grauwall (5 Felder) und **Sankt Ruß (16 Felder)**, nicht für Krähenfurt (dort Winterbausteine).
   - Bilder: `vergleich_ruinen.jpg` (Grauwall alt/neu) und `vergleich_sanktruss_ruinen.jpg` (alt/neu mit Einheiten).
   - **NOKIPP-Vergleich:** `vergleich_ruine_kippen.jpg` (links wie im Spiel, rechts ohne Kippen). Das Kippen verstärkt das Auffächern, ist aber nicht die einzige Ursache: Auch ohne Kippen stehen die Wandstreifen als flache Bänder auf den Sechseckkanten.
   - Liste der alten Ruinen-Teile: `entwurf/GELAENDE_G7H_BILDER.md`, Abschnitt „Heutige Ruinen-Teile“.
4. **Querwand-Blöcke** sitzen jetzt mittig auf dem Grabenstück, das sie abschließen, und sind 0,8 R breit. Vorher lag ihre Mitte auf der Grabenkante, halb daneben. Rückweg `QWMITTE_ALT`.
5. **Ende des Sandsackwalls:** Über jedes Ende ragt eine schmalere, kurze Lage Säcke unterschiedlich weit hinaus. Das Ende ist eine Stufe statt eines geraden Schnitts. Rückweg `BRUSTENDE_ALT`.
6. **Scharfschützen liegend im Graben:** Sie liegen auf der Grabenmitte statt in den zwei Reihen, so ragen die langen Gewehre nicht mehr über die Wand. Rückweg `LIEGEND_ALT`. Bild: `grauwall_scharf_nah.jpg`.
7. **Panzer im Graben:** Die Probe findet den Koloss jetzt; wenn keiner in der Armee ist, macht sie einen Trupp zum Koloss. Bild: `grauwall_fz_nah.jpg`. Der Koloss überbrückt den Graben, die Ketten stehen auf beiden Lippen. Das sieht für mich richtig aus.
8. **85-%-Prüfung:** Neues Werkzeug `node tools/graben_anteil.mjs [karte]`.
   - Es tastet die Grabensohle (0,95 R breit um die Mittellinie) alle 0,05 R ab.
   - Grauwall: **97,6 %** der Grabenfläche liegen in Grabenfeldern; kein einzelnes Nachbarfeld bekommt mehr als 0,1 %.
9. **Punkt 84.12 ist nicht kaputt:**
   - Über Draht erscheinen der rote Wegpunkt, das Warndreieck und der Hinweis „Draht ×0,6“ (`pruefung_8412_draht.jpg`).
   - `test_zeiger.mjs` meldet alle gemalten Mauszeiger richtig.
   - Der Geländehinweis liegt bei dieser Kameralage halb hinter der Fähigkeitenleiste. Das ist eine Frage der Anordnung, keine Folge von G7f/G7g; ich habe es für SP notiert.

### Prüfungen
- `test_kommentare` vor jedem Build: sauber.
- Partietest ohne Konsolenfehler.
- `test_zielfelder` grün.
- **Leistung** (`entwurf/probe/leistung_g7h2/messung.json`), Bildzeit im Mittel bzw. 95 %:

| | Zoom 1 | ganze Karte |
|---|---|---|
| Grauwall | 5,6 / 5,7 ms | 6,3 / 11,1 ms |
| Sankt Ruß | 5,6 / 5,7 ms | 6,2 / 11,1 ms |

  Zum Vergleich G7g: Grauwall ganze Karte 7,6 / 16,6 ms. Wahrscheinlich bremsten die vielen Wandstreifen und liegenden Stücke der alten Ruinen und das lange Tiefen-Drahtstück. Für SP heißt das: Die Bremse seit G7f ist zum großen Teil schon weg.
- Keine Regeländerung in G7h-2, deshalb kein sim-Lauf. Grauwall bleibt bei 43 % aus G7h-1 (Paket S).

### Bilder
`entwurf/probe/gelaende_g7h2/`:
- `vergleich_laufsteg.jpg`, `vergleich_draht_tiefe.jpg`, `vergleich_ruinen.jpg`, `vergleich_sanktruss_ruinen.jpg`, `vergleich_ruine_kippen.jpg`, `vergleich_ganz.jpg`
- `grauwall_neu_nah.jpg` (Einheiten im Graben), `grauwall_fz_nah.jpg` (Koloss), `grauwall_scharf_nah.jpg`, `grauwall_leer_nah.jpg`, je Variante auch `_ganz`

### Fragen an Enrico
1. **Hausruinen über Eck:** Passen sie neben den übrigen Bausteinen (`vergleich_sanktruss_ruinen.jpg`)? Wenn nicht: `window.RUINE_ALT` schaltet zurück, oder der Berater malt sie gerade von vorn neu.
2. **Lattenroste:** Hell genug? Ich habe sie dunkel gehalten wie den Grabenboden. Von weitem wirken sie wie ein Gleis.
3. **Draht-Module:** 3 je Feld oder dichter (4) bzw. lockerer (2)?

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

