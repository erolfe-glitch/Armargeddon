## 2026-11-26 – SP-3: Töne (84.3, 84.10), Pult-Export, Salve ruhiger (`0dbe5c3`, index.html im Folge-Commit)

Gepusht. Alles lief ohne Hänger. Die Vorschau war nicht offen, kein Browser blieb offen, nur der Server läuft. Kein Hilfs-Agent, kein Lauf über 10 Minuten. Keine Regel geändert, deshalb kein sim-Lauf.

### Gemacht
1. **Zielfeld erobern war wirklich stumm – behoben (84.3).**
   - Ursache: Der Ton war seit Langem im Code, kam aber nie an. Beim Ziehen (und beim Sprungangriff) wurde der neue Besitzer still in die Anzeige übernommen; die Stelle mit dem Ton fand danach keinen Unterschied mehr.
   - Jetzt läuft jeder Besitzwechsel über eine Stelle (`ctrlSync`), mit Ton.
   - Im Browser geprüft: Konkordat nimmt ein Feld → `erobert_2` (Win Point 2); Aschenwacht → `erobert_1` (Trommel). Nimmt die KI dir ein Feld weg, klingt wie bisher `verloren`.
   - Im Ton-Pult unter „Gelände und Gebäude“ gibt es dafür neue Zeilen: „Zielfeld erobert: Konkordat“, „Zielfeld erobert: Aschenwacht“, „Eigenes Zielfeld geht verloren“, dazu „Rundenschild: eigener Zug“ und „Zug des Gegners“.
2. **Ordensschreiter mit Kettenschwert-Tönen (84.10).**
   - Der letzte, harte Schlag hat zwei eigene Plätze: gegen Fußtruppen `orden_fleisch`, gegen Gepanzerte `orden_metall`.
   - Eingestellt wie beim Sägeschreiter: Fleisch = `held_kschwert_metall_3`, Metall = `held_kschwert_metall_4`. Das ist eine Vorgabe aus dem Auftrag; sobald du im Pult selbst wählst, gilt deine Wahl.
   - Im Browser geprüft: gegen Grenadiere `held_kschwert_metall_3`, gegen den Eisenknecht `held_kschwert_metall_4`.
   - Im schnellen Schlagabtausch davor klingt weiter `heavy3` (Pult-Zeile „Schlag“), wie beim Sägeschreiter.
   - Zwei Pult-Zeilen „Kettenschwert-Hieb gegen Fußtruppen / gegen Gepanzerte“. Ton-Spur des Ordensschreiters neu gemessen.
3. **Pult-Export vom 24.11. eingebaut** (`tonwahl_bau`, `ton_teilen`, build).
   - Er enthält dieselben 287 Wahlen wie der vom 23.11. Anders ist nur der Titel der Handgranaten-Zeile der Aschengrenadiere; deren Wahl (`grenade2_1`) war schon im Spiel.
   - 300 Wahlen aus allen Exporten zusammengeführt, **286 wirken**.
   - 14 wirken nicht: 8 Zeilen gibt es im Pult nicht mehr (7× „Schuss“ bei Einheiten, die nie schießen; Stollen beim Mineur, liegt jetzt unter „Gelände und Gebäude“), 1 gehört zum gestrichenen Rauchwerfer, 5 sind gleich dem Standard.
4. **Salve ruhiger (Punkt 4):** Abstände 0,15–0,3 s, in der Mitte weiter 1–2 Schüsse dicht hintereinander (0,06–0,12 s). Rückweg `SALVE_KURZ`.

| Dauer der Salve (Mittel über 20 000 gewürfelte Salven) | SP-2 | jetzt |
|---|---|---|
| voller Trupp (8 Figuren) | 1,0 s | 1,4 s |
| halber Trupp (4 Figuren) | 0,4 s | 0,5 s |

### Liste: Ereignisse ohne Ton (84.3)
Ich habe alle 89 Ereignisarten der Regeln gegen die Abspielstellen geprüft. Für die neun Fälle unten gibt es jetzt je eine Zeile im Pult unter „Gelände und Gebäude“. Sie sind **stumm, bis du dort einen Ton wählst**; die Wahl gilt dann für alle Einheiten. Der Vorschlag steht auch im Hinweis der Zeile.

| Ereignis | Vorschlag |
|---|---|
| Siegpunkte werden gezählt (Rundenbeginn, „+3“ über den Feldern) | `neu2_punkt` oder `tick` |
| Hauptmann oder General fällt | `held_fall_horn` leise oder `generalhorn` |
| Fliehender Trupp wird gesammelt (Rundenbeginn) | Ruf `stand` oder die Pfeife `march` |
| Entsetzenstest misslingt („Entsetzt!“) | `panik_einzeln` |
| Furcht-Aura des Kürassiers wirkt | `held_ruestung` leise oder `panik_einzeln` |
| Feuerbereitschaft eingenommen | `neu_nachladen` oder `mgladen` (Durchladen) |
| Panne behoben / wieder freigefahren | `reparieren` oder kurzer Motor `motor_auswahl` |
| Trupp steht im brennenden Feld | `feuer` oder Schmerzlaut `pain` |
| Der Wind dreht | `wind` (kurze Böe) |

Ohne Ton gelassen, weil gleich danach ein anderer Ton kommt oder das Ereignis nur ein Zeichen zeigt: Dauerfeuer-Ansage (das MG folgt), „hält stand“, Moralverlust durch Furcht vor Kolossen (nur Blitz-Zeichen), Feuer erlischt, Zurückweichen (Schritte folgen). Sag Bescheid, wenn eines davon auch eine Zeile bekommen soll.

**Unpassend aufgefallen:** Erobert die Aschenwacht ein Feld, klingt dieselbe Trommel wie beim Rundenschild „eigener Zug“. Das lässt sich jetzt im Pult trennen.

### Tests
- Pult-Test 93/93, „Spiel == Pult“ für 53 Einheiten ohne Abweichung, Partietest ohne Fehler, Regeltest in Ordnung.
- Kleine Änderung an der Prüfung „Spiel == Pult“: Eine Zeile gilt jetzt auch als gespielt, wenn sie nur in den Szenen der Winterkarte klang. Anlass: Der „Streifschuss“ des Ordensschreiters fiel diesmal nur dort (hängt vom Würfel ab). Der Ordensschreiter hat dafür eine Zeile bekommen.

### Fragen an Enrico
1. **Salve:** Mit genau 0,15–0,3 s kommt der volle Trupp auf 1,4 s, weil ich die dichten Schüsse in der Mitte etwas auseinandergezogen habe (0,06–0,12 s statt 0,03–0,06 s). Passt das so, oder sollen die beiden mittleren wieder enger?
2. **Streifschuss bei MG-Einheiten:** Der Ton „Streifschuss / daneben“ kann bei jeder schießenden Einheit fallen, im Pult haben ihn aber nur Gewehr-Einheiten und jetzt der Ordensschreiter. Um das für alle sauber nachzuziehen, müsste die ganze Ton-Spur neu laufen (etwa 25 Minuten, also über der 10-Minuten-Grenze). Soll ich das bei Gelegenheit machen?
3. **Ordensschreiter:** Soll vor dem Kettenschwert noch ein kurzer Einschlag kommen wie beim Sägeschreiter (dort Einschlag, dann Säge), oder reicht der eine Ton?

Nächster Schritt laut Plan: U5.

## 2026-11-26 – SP-2 Nachtrag: Salve je Figur einmal (Antwort 1 von 13:50) (`0bd6d5b` mit index.html)

Deinen Abschnitt von 13:50 habe ich erst nach dem SP-2-Lauf gelesen. Sturmrollen und Rauchwerfer waren da schon fertig (Bericht darunter). Jetzt kam nur noch die Salve dazu. Alles lief ohne Hänger, Partietest ohne Fehler; die Vorschau war nicht offen.

- **Jede stehende Figur schießt genau einmal**, in zufälliger Reihenfolge, damit es nicht von links nach rechts durchläuft.
- Die Abstände aus SP-1 bleiben (0,11–0,23 s, in der Mitte 1–2 halb überlappend).
- Nur Anzeige, der Schaden ist gleich. Deshalb kein sim-Lauf.
- Rückweg `SALVE_DOPPELT`.

| Dauer der Salve (Mittel über 20 000 gewürfelte Salven) | vor SP-1 | SP-1 | jetzt |
|---|---|---|---|
| voller Trupp (8 Figuren) | 3,2 s | 2,0 s | 1,0 s |
| halber Trupp (4 Figuren) | 1,5 s | 0,8 s | 0,4 s |

### Fragen an Enrico
1. Der volle Trupp feuert jetzt in etwa 1 s. Wirkt das richtig, oder sollen die Abstände wieder etwas größer werden (z. B. 0,15–0,3 s, dann etwa 1,4 s)?
2. Die drei Fragen aus dem SP-2-Bericht darunter sind noch offen (Sankt Ruß 57,5 %, Bunker, Mörserpreis).

Nächster Schritt laut Plan: SP-3 (Töne).

## 2026-11-26 – SP-2: Regeln – Sturmrollen gegen Graben, Rauchwerfer gestrichen (84.4, 84.7) (`6248915` mit index.html)

Gepusht. Alles lief ohne Hänger. Kein Browser blieb offen; die Vorschau war in diesem Paket nicht offen, nur der Server läuft.

### Gemacht
1. **84.4 Sturmrollen gegen Graben:**
   - Steht das Ziel im Graben, im Bunker oder ist es eingegraben, wird es **nicht weggestoßen**, bekommt **×0,3 Schaden** und ist **niedergehalten**.
   - Neue Konstante `P.ROLLEN_GRABEN` 0,3, Abschalter für die Messung `NOROLLGRABEN=1`.
   - Einen Feldtyp „Unterstand“ gibt es in den Regeln nicht (nur als Bild im Graben). Der Bunker zählt deshalb wie ein Unterstand.
   - Probe: Koloss gegen Grenadiere im offenen Feld 26 Schaden und ein Feld zurück; im Graben 8 Schaden, bleibt stehen, niedergehalten.
   - KI: Gegen Ziele im Graben zählt weder der Bonus für Deckung noch der für das Zielfeld (sie werden ja nicht heruntergestoßen). Durch den kleineren Schaden lohnt sich dort meist der normale Schuss.
   - Text der Fähigkeit, Einheitentext von Landkoloss und Sturmpanzer und Meldung („– der Graben schützt“) ergänzt.
2. **84.7 Rauchwerfer gestrichen:**
   - Nur das Konkordat hatte ihn. Er ist aus den Einheiten, dem Nachschub, den drei Kartenarmeen, den Wunschlisten der KI, Preisen und Schlagworten entfernt.
   - Der **Grabenmörser** hat jetzt Rauchmunition: Nebelwand statt des Schusses, alle 3 Runden, Feld bis 3 Felder und seine Nachbarn. Je Runde gilt also Sprenggranate **oder** Nebel.
   - **Preis 25 → 40** (Rechnung im Info-Fenster: „Rauchmunition (Nebelwand) 15“).
   - KI: Der Mörser legt Nebel nur, wenn er mehr bringt als sein bester Schuss (Vergleich mit `planArt`). Er handelt nach den Beobachtern, damit markierte Ziele nicht verloren gehen, aber vor dem Vorrücken der Fußtruppen.
   - Weiter angepasst:
     - Schlagwort „Rauchmunition: Nebelwand“.
     - Rolle „Steilfeuer und Nebel“.
     - Chronik-Text des Mörsers (Nebel vor den Gewehren, wenn die Kohorten vorgehen).
     - Ton: Abschuss `werfer` + Rauchgeschoss `gas`, wie beim Rauchwerfer.
   - Ton-Pult neu gebaut (Mörser hat zwei Nebel-Zeilen) und Ton-Spur des Mörsers neu gemessen. `tonpult_test` 93/93.
   - Im Pult-Test werden Wahlen für gestrichene Einheiten jetzt übersprungen. Deine drei Wahlen für den Rauchwerfer (Schlag, Tod, Panik) wirken nicht mehr.
3. **Sankt Ruß nachgezogen:** Durch das Streichen sprang das Konkordat dort von 43 % auf 70 %. Abgleich: Konkordat 2 statt 3 Mahlwerke.

### Messung (`sim.js 100`, Siegquote Konkordat)
| Karte | vorher | nachher |
|---|---|---|
| Grauwall, Startwerte 1–4 | 38 / 39 / 50 / 44 (Ø 43) | 48 / 62 / 56 / 50 (Ø 54) |
| Sankt Ruß, Startwerte 1/2 | 42 / 44 | 54 / 61 (Ø 57,5, mit 2 Mahlwerken) |
| Krähenfurt, Startwert 1 | 56 | 49 |

- **Dauer:** Grauwall Ø 15,0 statt 14,6 Runden.
- **Ausfälle:** Konkordat 31 % (vorher 26 %), Aschenwacht 32 % (vorher 37 %).
- **Verluste je Typ (Grauwall):** Mörser 3–5 % (er steht hinten), Landkoloss 25 %, Sturmpanzer 16 %, Kohorten 65–67 %, Grenadiere 63 %.
- **Nutzung je Schlacht:** Sturmrollen beim Konkordat etwa 7 (vorher 6,6). Nebelwände 3,5 statt 2,5.
- **Woher der Ausschlag kommt:**
  - Mit gemischter Aufstellung (`MISCHEN=1`) ändert sich fast nichts: Sankt Ruß 75 → 77 %, Grauwall 58 → 60 %. Der Ausschlag bei fester Aufstellung kommt also daher, dass eine Einheit weniger die ganze Aufstellungsreihenfolge verschiebt (wie in CLAUDE.md beschrieben).
  - Nur den Graben-Schutz abgeschaltet: Grauwall 66 / 78 %, Sankt Ruß 66 %. Der neue Schutz kostet das Konkordat also rund 15 Punkte.
- **Weitere Versuche für Sankt Ruß:** 4 statt 5 Kohorten → 43 / 47 %; 4 Kohorten und 2 Sanitäter → 29 / 33 %. Genommen habe ich 2 Mahlwerke.
- Einzelheiten in `entwurf/BALANCE.md` (Abschnitt SP-2).

### Fragen an Enrico
1. Grauwall steht jetzt bei Ø 54 %, Sankt Ruß bei Ø 57,5 %. Vor SP-2 lagen beide schon unter dem alten Ziel (43 %). **So lassen** oder auf Sankt Ruß noch feiner abgleichen?
2. Soll der **Bunker** wie ein Unterstand schützen (so gebaut), oder nur Graben und eingegraben?
3. Mörser 40 Punkte: passt der Aufpreis von 15 (so viel kostete die Nebelwand beim Rauchwerfer)?

Nächster Schritt laut Plan: SP-3 (Töne, 84.3 und 84.10).

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

