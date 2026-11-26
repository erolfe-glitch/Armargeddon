## 2026-11-26 – SP-1: Darstellung und Ablauf (Punkt 84 Teil 1, Antworten 2 und 3) (`0ddd904`, `04659b9`, `08ee033` mit index.html)

Gepusht. Keine Regeländerung außer einem reinen Anzeige-Merker (`u.abgeprotzt`), `test_regeln` grün, deshalb kein sim-Lauf.

### Gemacht
1. **Lattenroste wärmer** (Antwort 2): Sie sind sepiabraun vorgefiltert, die blaue Pfütze im Streifen 3 ist jetzt braun. Rückweg `STEG_KALT`. Bild `entwurf/probe/sp1/steg_waermer_nah.jpg`.
2. **Draht-Module dichter** (Antwort 3):
   - 6 Module je Feld im Abstand 0,3 R; Schlammflecken und Rollen überlappen.
   - Je Pfahlreihe drei Drähte statt einem.
   - Rückweg `MODUL3`.
   - Bild `draht_6_module_nah.jpg`: ein geschlossener Gürtel, keine Leiter mehr.
3. **84.6 Salve dichter:**
   - Gleich viele Schüsse wie bisher: Ich habe die Zahl nicht gesenkt. Heute sind es je Figur 1–2 Schüsse, nicht genau einer.
   - Abstände 0,11–0,23 s statt bisher meist 0,15–0,45 s.
   - In der Mitte kommen 1–2 Schüsse halb überlappend (0,03–0,06 s nach dem vorigen).
   - Rückweg `SALVE_ALT`.
   - Dauer der Salve (Mittel über 20 000 gewürfelte Salven, ohne den Nachhall):

| | vorher | nachher |
|---|---|---|
| voller Trupp (8 Figuren) | 3,2 s | 2,0 s |
| halber Trupp (4 Figuren) | 1,5 s | 0,8 s |

4. **84.11 Geschütze und MGs zu früh grau:**
   - **Abprotzen kostet heute den Schuss dieser Runde** (`limber` setzt `attacked`), außer bei der Feldkanone. Das Grau ist also regelgerecht.
   - Neu steht dann im Hinweis und am Schussknopf: „Gerade abgeprotzt: Das kostet bei Geschützen den Schuss dieser Runde – ab der nächsten Runde feuerbereit.“
   - **MG aufbauen kostet nur Bewegung**, kein Schuss. Grau wird ein aufgebautes MG nur ohne Ziel (auch nach Drehen). Dann steht im Hinweis „MG aufgebaut, aber kein Gegner in Reichweite und Sicht“.
5. **84.8 Kamera folgt:**
   - Einheitliche Regel für den eigenen und den KI-Zug: Liegt der Ort eines Ereignisses außerhalb des Bildes oder im Randstreifen (15 %), fährt die Kamera hin. Rückweg `KAMERA_ALT`.
   - **Schon vorher mit Kamerafahrt:** Ziehen, Schuss, Reaktionsschuss, Granate/Sperrfeuer (erst Schütze, dann Ziel), Nahkampf, Fähigkeitstitel, Sprung, Faustsalve, Wechsel zur nächsten KI-Einheit.
   - **Neu mit Kamerafahrt:** Ziel markieren (Leuchtschuss), Handgranate, Löwengebrüll, Durchbruch, Hinrichtung, Sturmrollen, Rammen, Nebel, Kopf runter, Panzerschuss, Sprenglanze, Sprengladung, Stollensprengung, Mine, Einsturz, Eisbruch, Gaswolke, Gegenstoß, Befehl, großer Befehl, Heilen, Dauerfeuer, Feuerschlag.
   - **Weiter ohne:** reine Zustände und Folgen (Treffer, niedergehalten, Flucht, Punkte, Wetter …); sie folgen auf ein Ereignis mit Kamerafahrt.
   - Wenn der Spieler im KI-Zug selbst die Karte verschiebt, hält die Kamera wie bisher still bis zur nächsten KI-Einheit. Vielleicht war das das „folgt manchmal nicht“.
6. **84.9 Kamera bleibt:** Jeder Treffer mit Schaden setzt eine Haltezeit von 1,2 s. Vor der nächsten Kamerafahrt (außer einer, die der Spieler selbst auslöst) wartet die Kamera, bis sie abgelaufen ist.
7. **84.2 Symbole mit dem Zoom, mit Grenzen:**
   - Gemessene Feldgröße auf dem Bildschirm: ganze Karte etwa 51 px, Zoom 1 etwa 154 px, Zoom 2,6 etwa 400 px.
   - Die Symbole rechnen jetzt mit einer Feldgröße zwischen 90 und 220 px. Bei der ganzen Karte sind sie also gut 1,7-mal so groß wie vorher, ganz nah höchstens so groß wie bei Zoom 1,4.
   - Das gilt für: Geländehinweis, BP-Kosten mit Stiefel, Rest-BP-Kreis, Wegpunkte, Warndreieck, Warnmarke, Markenzeile unter den Figuren (Balken, Zustände, Deckung) und Kopfzeichen.
   - Rückweg `SYM_ALT`.
   - Bilder `entwurf/probe/sp1/vergleich_zoom_0.jpg` und `vergleich_zoom_2.6.jpg` (links vorher, rechts nachher).
8. **Geländehinweis hinter der Fähigkeitenleiste:** Ragt der Kasten in die Leiste, rückt er so weit nach oben, dass er frei steht. Rückweg `HINWEIS_ALT`. Bild `vergleich_zoom_2.6.jpg`: vorher verdeckt, nachher lesbar.
9. **84.5 Schuss nach Rundenende:**
   - Reaktionsschüsse (MG-Sperrfeuer, Feuerbereitschaft) zu Beginn des Gegnerzugs sind gewollt und haben schon eine Überschrift.
   - Gefunden habe ich aber, dass Leuchtspuren und verzögerte Schüsse einer Garbe noch flogen, wenn man sofort „Runde beenden“ drückte bzw. wenn die KI ihren Zug beendete.
   - Jetzt wartet der Zugwechsel, bis nichts mehr fliegt (höchstens 2,5 s). Rückweg `RUHE_ALT`.
   - Ein Schleifen konnte ich ohne gleichzeitige andere Läufe nicht nachstellen.
10. **84.1 Ruckeln General gegen Panzer:**
    - Gemessen mit einem echten Nahkampf (General gegen Sturmpanzer) im unsichtbaren Chrome: im ersten Lauf ein einzelnes Bild mit 59–71 ms, im zweiten Lauf keines über 50 ms.
    - Meine Vermutung, die Posenbilder würden erst beim ersten Hieb aufbereitet, hat die Messung nicht bestätigt (mit und ohne Vorwärmen etwa 35 ms).
    - Das Vorwärmen der Posenbilder im Leerlauf bleibt trotzdem drin (`VORWAERM_ALT`); es kostet nichts sichtbar.
    - Das Profil zeigte dafür, dass die **Grabenplätze in jedem Bild für jede Grabeneinheit neu gerechnet** wurden. Jetzt einmal je Feld (`GPC_ALT`).
    - **Die eigentliche Ursache habe ich nicht gefunden.** Am echten Gerät können Tondekodieren oder das erste Hochladen eines Bildes auf die Grafikkarte dahinterstecken. Bitte sagen, ob es nach diesem Stand noch auftritt.
11. **Sankt-Ruß-Bremse:**
    - Neuer Schalter `OHNE_DECKEL=1` in `leistung_messen.mjs` (Chrome ohne Bildratenbremse, wie Fable gemessen hat).
    - Bildzeit im Mittel bzw. 95 %, längstes Einzelbild:

| | Zoom 1 | ganze Karte |
|---|---|---|
| Grauwall | 4,2 / 5,2 ms | 6,4 / 11,0 ms, längstes 31 ms |
| Sankt Ruß | 3,9 / 4,3 ms | 8,6 / 11,3 ms, **einmal 1,1 s** |

    - **Die gleichmäßigen 30,5 ms sind nicht mehr da.**
    - Geblieben ist **ein einzelnes langes Bild beim ersten Herauszoomen auf die ganze Karte** (1,1 s in dieser Messung, 167 ms in einem zweiten Lauf mit Profil). Danach läuft es glatt.
    - Das Profil zeigt dabei kein Spiel-JavaScript, sondern nur Zeichenarbeit. Vermutlich lädt Chrome dann die großen Bodenbilder zum ersten Mal auf die Grafikkarte.
    - Rohwerte: `entwurf/probe/sp1/leistung_ohne_deckel/messung.json`.

### Prüfungen
- `test_kommentare` vor jedem Build: sauber.
- `test_regeln` grün.
- Partietest ohne Konsolenfehler.
- Alles lief ohne Hänger.

### Fragen an Enrico
1. **Salve:** Soll jede Figur wirklich nur **einmal** schießen? Heute schießt jede 1–2-mal. Ich habe die Zahl gelassen, weil im Auftrag „nicht weniger Schüsse“ stand.
2. **Symbole bei der ganzen Karte** jetzt gut 1,7-mal so groß. Passt das, oder lieber kleiner (untere Grenze 70 statt 90 px)?
3. **Ruckeln beim General:** Tritt es nach diesem Stand noch auf? Dann bitte mit dem Ort, an dem es passiert.

## 2026-11-26 – G7h-2: Lattenroste, Draht-Module, Hausruinen, Rest aus G7h (Punkte 87, 88, 84.12) (`631a996`, `cf0db67`, `c7b8cc9` mit index.html)

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

