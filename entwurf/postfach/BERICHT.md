## 2026-11-24 – Paket E, Teil 4 (Zwischenstand): Entsetzenstest (Punkt 18) (`00a6778`)

Gepusht, index.html gebaut. Tests: `test_regeln`, `test_kommentare` in Ordnung.

- **Heute (geprüft):** Sobald ein Fahrzeug oder Schreiter auf 2 Felder herankam, verlor jede gegnerische Einheit **einmal je Schlacht** 10 Moral („Fahrzeugfurcht“), ganz ohne Angriff. Das geschah 19–30 Mal je Schlacht.
- **Neu: Entsetzenstest** – nur, wenn ein Fahrzeug oder Schreiter **angreift** (Schuss, Nahkampf, Sturmrollen, Panzerschuss; also jeder Schaden durch so einen Angreifer).
  - **Chance durchzufallen** (zwischen 2 % und 60 %):
    - Grundwert 8 %.
    - Steigt mit fehlender Stärke (bis +25 %), niedriger Moral (unter 50: bis +15 %), schlechter Deckung (offen +8 %, Bronze +3 %, Gold −3 %), bei Geschützbedienungen und MG (+8 %).
    - Sinkt bei Sturmtruppen und Reitern (−5 %), wenn die Einheit selbst Anführer ist (−10 %) und mit Anführer oder Banner daneben (−10 %, aufgepflanztes Banner 2 Felder).
  - **Durchgefallen:** niedergehalten, Moral −8. Unter 60 Stärke weicht die Einheit zusätzlich zurück. Eine Sofortflucht gibt es nicht.
  - **Immun:** Helden, Fahrzeuge und Schreiter, Kampfanzüge.
  - **Anzeige:** Bestanden zeigt ein kurzes goldenes Funkeln, durchgefallen die Schreckstriche, „Entsetzt!“ und den Ruf „Koloss“. Im Logbuch steht die Chance in Prozent.
- **Messung** (je 200 Schlachten; Konkordat alt → neu; Tests je Schlacht; durchgefallen):

| Karte | Siegquote | Tests | durchgefallen |
|---|---|---|---|
| Grauwall | 44 → **47 %** | 41 | 25 % |
| Sankt Ruß | 41 → **46 %** | 46 | 21 % |
| Krähenfurt | 61 → **52 %** | 31 | 26 % |

  Alle drei Karten rücken näher an 50 %, Runden und Ausfälle bleiben fast gleich. Daher eingebaut; die alte Regel gibt es mit `ENTSETZ_ALT=1`. sim.js zählt die Tests jetzt mit.
- **Anmerkung:** Im Schnitt fällt jede vierte getestete Einheit durch. Das liegt daran, dass die meisten Tests schon angeschlagene Einheiten treffen. Eine frische Einheit fällt in guter Deckung (Silber/Gold) mit 5–8 % durch, mit Bronze-Deckung mit 11 %, im Offenen mit 16 %. Wenn es seltener sein soll: Grundwert senken (`P.ENTSETZ_BASIS`).
- **Vorschlag zum Vereinheitlichen:** Furcht-Aura des Kürassiers und Löwengebrüll könnten denselben Test nutzen (eigener Grundwert, dieselben Einflüsse, gleiche Anzeige). Dann wirkt die Furcht-Aura nicht mehr pauschal −4 Moral, sondern als Test je Runde mit sichtbarem Ergebnis. Das passt zu Punkt 43 (beim großen Umbau).

**Noch offen in Paket E:** Punkt 2 (Aufstellungsphase) – nächster `pa`/`pw`.

### Fragen an Enrico
- Keine neuen (Scharfschützen aus Teil 2 noch offen).

---

## 2026-11-24 – Paket E, Teil 3 (Zwischenstand): Feldkanone mit Panzergranate (Punkt 16) (`19a7203`)

Gepusht, index.html und Ton-Pult gebaut. Tests: `test_regeln`, `test_kommentare` in Ordnung, Spiel == Pult für alle Einheiten.

- **Sperrfeuer:** War für die Feldkanone nach den Regeln schon nie möglich (direktes Geschütz → nur Sprenggranate). Es gab aber noch einen grauen Knopf „Sperrfeuer“. Der ist jetzt weg.
- **Normaler Schuss:** Standardgranate, direkt und flach wie bisher. **Gegen Fahrzeuge und Schreiter nur noch ×1,25** statt ×2,5.
- **Neue Fähigkeit „Panzergranate“:**
  - Aktion, **3 Ladungen je Schlacht** (Zähler am Knopf), nur gegen gepanzerte Ziele im direkten Schuss.
  - Schaden gegen schwer gepanzert (Fahrzeuge, Schreiter) **×3,5**, gegen leicht gepanzert (Kampfanzüge, Löwenoger) **×2**.
  - Wie bei der geworfenen Panzergranate gibt es eine kleine Chance auf eine Panne.
  - Anzeige: Kanonenschuss der Feldkanone, Funken und Metalltreffer am Ziel, Meldung „Panzergranate!“.
  - **Ton/Effekt-Vorschlag:** ein eigener heller, scharfer Abschuss („Peitschenknall“) und ein metallisches Durchschlagen, dazu Funken und glühende Splitter. Bis dahin nutze ich vorhandene Töne (Kanone + `einschlag_panzer`).
- **KI:** Die Panzergranate kommt nur gegen gepanzerte Ziele, schwere zuerst, bevorzugt angeschlagene oder auf Zielfeldern.
- **Preis:** bleibt 45 (Rechnung im Info-Fenster: Panzergranate +10, Abgleich −20).
- Texte und Schlagworte („Direktschuss 5 Felder“, „Panzergranate (3×)“) sowie Ton-Pult-Zeile und Ton-Spur sind ergänzt. Kein Chronik-Text dazu, wie gewünscht.
- **Messung** (je 200 Schlachten, Siegquote Konkordat vorher → nachher): Grauwall 43 → 44 %, Sankt Ruß 42 → 41 %, Krähenfurt 61 → 61 %. Die Panzergranate wird 0,6–0,8 Mal je Schlacht genutzt (Feldkanone gekauft in 35–49 % der Schlachten). **Praktisch neutral**, daher eingebaut. Abschalter `PZS_ALT=1`.

**Noch offen in Paket E:** Punkte 18 (Entsetzenstest) und 2 (Aufstellungsphase) – nächster `pa`/`pw`.

### Fragen an Enrico
- Keine neuen (die Frage zu den Scharfschützen aus Teil 2 ist noch offen).

---

## 2026-11-24 – Paket E, Teil 2 (Zwischenstand): Scharfschützen – Vorschlag statt Einbau (Punkt 3) (`29a4dc2`)

Gepusht. Tests: `test_regeln`, `test_kommentare` in Ordnung. **Im Spiel gilt weiter die alte Regel**; die neue ist vollständig gebaut, aber nur mit `SCHARF_NEU=1` aktiv.

- **Heute (geprüft):** Scharfschütze (Konkordat) und Pirschjäger (Aschenwacht) dürfen auch nach dem Ziehen schießen, und **jeder Treffer hält nieder** (`pin`).
- **Gebaute Regel (für beide Seiten gleich):**
  - Schuss **nur aus dem Stand**.
  - Gegen ungepanzerte Ziele **×1,6** (Schlagwort „gezielter Schuss ×1,6“ in der Vorschau). Gegen Gepanzerte bleibt es schwach.
  - **Kein automatisches Niederhalten** mehr.
  - Neue Fähigkeit **„Kopf runter!“**: Aktion, alle 2 Runden, nur aus dem Stand, auf ein Ziel in Reichweite und Sicht, das noch nicht niedergehalten ist. Kein Schaden, das Ziel ist niedergehalten, Moral −10 (Kampfanzüge und Schreiter −5).
  - Anzeige: Schuss wie ein Gewehrschuss, das Ziel duckt sich, Meldung „Kopf runter!“. Symbol „niedergehalten“ aus dem Bogen.
  - KI: hält aufgebaute MG, Geschütze und Gegner nieder, die eigene Truppen bedrängen; sonst schießt sie normal.
  - Kosten unverändert 45 bzw. 60 (Fähigkeit statt `pin`, gleicher Ansatz in costParts).
- **Messung** (je 200 Schlachten, ein Startwert; Siegquote Konkordat, Runden, Ausfälle):

| Karte | alte Regel | neue Regel |
|---|---|---|
| Grauwall | 43 % · 14,7 Runden · Ausfälle 31/40 % | **63 %** · 15,1 · 33/37 % |
| Sankt Ruß | 42 % · 14,6 · 43/48 % | **14 %** · 12,8 · 39/40 % |
| Krähenfurt | 61 % · 14,1 · 38/33 % | **69 %** · 14,2 · 46/31 % |

  - Einsätze „Kopf runter!“ je Schlacht (Konkordat / Aschenwacht): Grauwall 3,4 / 0,2, Sankt Ruß 1,9 / 0,1, Krähenfurt 1,5 / 0,2. Käufe Scharfschütze/Pirschjäger etwa gleich (0,3–0,4 je Schlacht).
- **Bewertung:** Der Ausschlag ist groß und je Karte gegenläufig (+20, −28, +8). Nach Auftrag also **Vorschlag statt Einbau**.
  - Wahrscheinliche Ursache für Sankt Ruß: Der Scharfschütze im Kirchturm hielt bisher mit jedem Treffer nieder. Jetzt bremst das nur noch die seltene Fähigkeit.
  - Auf Grauwall nützt „Kopf runter!“ gegen die MG der Aschenwacht dem Konkordat stark.
- Nebenbei: In der Vergleichsmessung liegt Krähenfurt (alte Regel) bei 61 %. Der Abgleich aus Paket C2 ergab 54 % mit 100 Schlachten; 200 Schlachten zeigen eher etwas mehr fürs Konkordat.

**Noch offen in Paket E:** Punkte 16 (Feldkanone Panzergranate), 18 (Entsetzenstest), 2 (Aufstellungsphase) – nächster `pa`/`pw`.

### Fragen an Enrico
- **Scharfschützen:** (A) neue Regel einschalten und danach Sankt Ruß und Grauwall neu abgleichen (über Kartendaten/KI). (B) nur einen Teil übernehmen, z. B. „nur aus dem Stand“ und „Kopf runter!“ als Zusatz, aber `pin` behalten. (C) bei der alten Regel bleiben.

---

## 2026-11-24 – Paket E, Teil 1 (Zwischenstand): Dampfpfeife (Punkt 42) (`4b7f541`)

Gepusht, index.html, Ton-Pult und Tonprobe gebaut. Tests: `tonpult_test` 93/93 (darin Spiel == Pult für alle 54 Einheiten), `test_kommentare` sauber.

- **Neuer Tonplatz `dampfpfeife`:** Enricos Lok-Pfeife (Pixabay, caboose_canine), etwas tiefer (×0,85), auf 1,6 s mit kurzer Ausblendung, Pegel wie die Pfeife (−17 dB). Im Sturmrollen ersetzt sie den Behelf aus tiefer Pfeife und Zischen; das Dampfzischen bleibt ganz leise darunter. Die Pause bis zum Anlauf ist etwas länger (0,7 s), damit der Akkord ausklingt.
- **Kein Neubau aller Töne:** `sound_bau.mjs` kann jetzt mit `NUR=dampfpfeife` nur einzelne Plätze bauen (unter 2 Sekunden); alle übrigen Töne werden unverändert übernommen. Geprüft: alle 826 Spieltöne gleich.
- **Ton-Pult:** neue Zeilen beim Sturmrollen („Dampfpfeife“, „Dampfzischen“), in der Bibliothek unter „Motoren und Ketten“; Tonprobe neu gebaut.
- **Nebenbei behoben:** Die Pult-Zeile der Aschengrenadiere für Handgranaten hing noch an der alten Regel. Sie heißt jetzt „Handgranaten (Fähigkeit)“, der Wurfton gehört dem Werfer. Die Ton-Spur der Grenadiere (mit neuer Szene) sowie von Landkoloss und Sturmpanzer ist neu gemessen, jeweils als Teil-Lauf von unter 1,5 Minuten. Damit stimmt Spiel == Pult wieder für alle Einheiten.
- `CREDITS.md` ergänzt, `sound-quelle` per robocopy gesichert.

**Noch offen in Paket E:** Punkte 3 (Scharfschützen), 16 (Feldkanone Panzergranate), 18 (Entsetzenstest), 2 (Aufstellungsphase). Das sind Regeländerungen mit je eigener Messung. Nach Sparregel 5 kommen sie im nächsten `pa`/`pw`.

### Fragen an Enrico
- Keine.

---

## 2026-11-24 – Paket D, Teil 3 (Abschluss): Korrekturen 39–41, Effektliste, Wucht (`728a22e`)

Gepusht, index.html gebaut. Tests: `test_kommentare` sauber, Aufnahmen ohne Seitenfehler. Vergleich: `entwurf/probe/effekte_d/teil3_vorher_nachher.jpg` (links Teil 1, rechts jetzt; Gebrüll Kreuzschreiter, Sprung Löwenoger, Furcht-Aura, Hinrichtung).

### Korrekturen
- **39 – Boden-Ringe:** Alle Ringe am Boden werden jetzt an der Mittellinie geteilt.
  - Die **hintere Hälfte** wird nach Tiefe vor der Figur gezeichnet und vom Körper verdeckt, die **vordere Hälfte** nach den Figuren (liegt vor den Füßen).
  - Das gilt für den Staubring des Gebrülls, die Druckwelle (Aufprall, Sprung, Sturmrollen), den Rauchklauen-Ring (Furcht-Aura, Aura-Puls, Hinrichtung) und die glatten Ringe (großer Befehl, Schilde vor, Ziel markieren).
  - Die Ringe sitzen mittig unter den Füßen.
- **40 – graue Pünktchen am Kürassier:** Das waren die „Ascheflocken“ der Furcht-Aura, alte flache Farbkreise (`burst` in Grautönen), die zufällig um den Kürassier fielen. Entfernt. Die gleichen flachen Kreise (weiß) beim Dampfstoß der Faust erscheinen nur noch, wenn das gemalte Dampfbild fehlt.
- **41 – Gebrüll am Maul:**
  - **Ursache Oger-Kegel:** Die Höhenkorrektur, die ich für den Kreuzschreiter brauchte (dort liefert `maulPunkt` die Kanonenmündung über dem Maul), galt für alle. Beim Oger rutschte der Kegel dadurch auf Hüfthöhe. Jetzt gilt sie nur noch für den Kreuzschreiter.
  - Der Kegel ist am linken Bildrand verankert: Die Spitze sitzt genau am Maul bzw. an der Mündung der Löwenmaul-Kanone.
  - **Ursache Oger-Ring:** Er wurde beim Sprung am Absprungort gezeichnet. Jetzt gibt es dort keinen Ring mehr, unter dem Oger liegt nur die Landungs-Druckwelle.

### Schritt 1 – noch glatte Kreise und Leuchtflächen (nicht ersetzt)
| Effekt | Code | Wie heute | Vorschlag |
|---|---|---|---|
| Großer Befehl (Halten / Generalangriff) | `rings` in playEvent `order` | glatter Messingring je Einheit | Bild „Befehlsruf“ (Schallwelle mit Staub, wie Gebrüll-Ring, kleiner) |
| Schilde vor | `rings` `shields` | grauer Ring | Bild „Schildwall“: Metallfunken/Staub am Boden |
| Banner aufpflanzen (Umkreis) | Hexflächen gelblich | Fläche | gemalter Fahnen-Bodenring (Stoffstreifen, Staub) |
| Gasschutz (Entgiften) | `drawNimbus` | grünlicher Verlauf | Bild „Filterdampf“ (grauweiße Dampfschwaden im Tintenstil) |
| Aura Rote Faust (standhaft) | `drawHeldAura` warm | roter Leuchtschein (jetzt gedämpft) | Glut-/Hitzeflimmern-Ring am Boden |
| Wirkungsbereich beim Halten eines Knopfs | `drawArea` | Messingfläche je Feld | bleibt (Bedienhilfe, keine Wirkung) |
| Helden-Aufblitzen | `heldBlitz` | Verlauf | bleibt dezent |

Einzelbilder je Effekt habe ich nach Sparregel 4 nicht gemacht (keine Bilderserie). Die betroffenen Stellen stehen in der Tabelle.

### Schritt 4 – Bildwünsche an den Berater
1. **Befehlsruf** (Bodenring, Schallwelle mit Staub, kleiner als das Gebrüll).
2. **Filterdampf** des Gasschutz-Trupps.
3. **Gasschliere** (sinkende, gebogene Gasfahne, 3 Varianten) – für die Gasgranate (Punkt 19).
4. **Mündungsdonner der Löwenmaul-Kanone** (Feuerstoß aus dem Löwenmaul, seitlich).
5. **Faustsalve:** Doppelter Mündungsblitz beider Unterarm-Kanonen.
6. **Hinrichtungs-Hieb:** Schnittbogen der Kettenklinge (Tinte, kalt).
7. **Ton:** echte tiefe Dampfpfeife, 1–1,5 s (Sturmrollen).

### Schritt 6 – Wucht: Schaden je Fähigkeit (aus den Regeln, Anzeige ×10)
| Fähigkeit | Wirkung | passt? |
|---|---|---|
| Rote Faust – Durchbruch | 26 Schaden, Moral −15, Ziel fliegt ein Feld zurück | ja, deutlich |
| Kürassier – Hinrichtung | vernichtet ein Ziel unter 40 Stärke | ja |
| Kürassier – Furcht | Gegner daneben −4 Moral je Runde | eher schwach für die Inszenierung |
| Kreuzschreiter – Löwengebrüll | kein Schaden; Moral −20, niedergehalten bis 2 Felder | passt (Schreck, nicht Schaden) |
| Kreuzschreiter – Löwenmaul-Kanone | gegen Grenadiere 2, gegen Sturmpanzer 4 je Schuss (2 Felder) | **zu schwach für den Auftritt** |
| Eisenknecht – Faustsalve | 2 Schüsse ×2: je etwa 14 gegen eine Kohorte (gesamt ~28) | ja |
| Landkoloss/Sturmpanzer – Sturmrollen | 24 Schaden, Moral −15 | ja |

Vorschlag für die Balance-Runde „Fleischwolf“: Die Löwenmaul-Kanone braucht mehr Wucht, sonst wirkt der Effekt größer als die Wirkung. Werte habe ich wie vorgegeben nicht geändert.

**Paket D ist damit abgeschlossen** (Teile 1–3). Offen bleiben nur die Bildwünsche.

### Fragen an Enrico
- Löwenmaul-Kanone stärker machen (jetzt oder in der Balance-Runde)?

---

## 2026-11-24 – Paket D, Teil 2 (Zwischenstand): Sturmrollen und Gasgranate (`0f9e557`)

Gepusht, index.html gebaut. Tests: `test_regeln`, `test_kommentare` in Ordnung, Aufnahmen ohne Seitenfehler.

- **Punkt 14 – Sturmrollen (Landkoloss, Sturmpanzer) mit mehr Wucht:** Das ist die gemeinte Fähigkeit (Einblendung „Sturmrollen“).
  - **(a) Ankündigung:** Dampfpfeife und ein weißer Dampfstoß über dem Fahrzeug, danach erst der Anlauf.
    - Der Ton ist zusammengesetzt: die alte Armeepfeife (`whistle`) auf halbe Tonhöhe gestimmt, darunter das Dampfzischen der Roten Faust (`held_dampf`).
    - Einen echten Dampfpfeifen-Ton gibt es in `sound-quelle` nicht. Ein eigener Ton bräuchte den vollen Neubau aller Töne plus Ton-Spur (über 25 Minuten, Sparregel). **Wunsch an den Berater:** eine kurze, tiefe, laute Dampfpfeife (Lok/Fabrik, 1–1,5 s).
  - **(b) Aufprall:**
    - kurzer Stillstand im Treffer, stärkeres Rütteln, das Ziel kippt weiter weg;
    - gemalte Boden-Druckwelle (Bild 3 aus `fx_faehigkeiten`);
    - Erd- bzw. auf Krähenfurt Schneebrocken an drei Stellen, 3–5 Staubwolken ringsum.
  - **(c) Nachhall** (etwa 0,4 s): Staub legt sich, dunkler Auspuffrauch steigt auf, leises Kettengeräusch.
- **Punkt 19 – Gasgranate als Luftzerleger:**
  - Das Geschoss fliegt zur Mitte des Zielbereichs und **zerplatzt gut ein Feld über dem Boden**: kleiner dumpfer Knall (tief gestimmter Einschlag), graue Hülsensplitter, ein kleiner Gaspuff.
  - Dann sinken **drei Gasschlieren** im Bogen auf die neuen Wolkenfelder. Erst beim Aufsetzen erscheint die Wolke (Anzeige-Regel VIS). Gilt für alle Gasgeschosse (Haubitze, Mörser).
  - **Fehlendes Bild:** Für die Schlieren nehme ich vorerst das vorhandene Gaswolken-Bild klein und in Bewegung. **Wunsch an den Berater:** ein Bogen „Gasschliere“ – sinkende, gebogene Gasfahne, 3 Varianten, Tintenstil, Magenta.
- **Bilder:** `entwurf/probe/effekte_d/teil2_uebersicht.jpg`, Einzelbilder `nachher/e_…` bis `i_…`.
  - Belegt sind die Druckwelle mit Staubwirbel nach dem Aufprall sowie Gebrüll und Landung des Ogers.
  - Den Dampfstoß der Pfeife und das Zerplatzen in der Luft haben die festen Aufnahmezeitpunkte **verpasst** (Kamerafahrt und Kampfszene verschieben den Ablauf). Die Effekte sind eingebaut, aber auf den Bildern noch nicht belegt.

**Noch offen in Paket D (nächster Teil):** Liste aller übrigen glatten Kreis-Effekte mit Bild je Effekt (Schritt 1), Bildwünsche (Schritt 4), „Wucht“ mit den Schadenszahlen je Fähigkeit aus der Simulation (Schritt 6) und Aufnahmen, die den Höhepunkt treffen (mit Warten auf das Ereignis statt fester Zeit).

### Fragen an Enrico
- Keine.

---

## 2026-11-24 – Paket D, Teil 1 (Zwischenstand): Fähigkeits-Effekte im Tintenstil (`d135239`)

Gepusht, index.html gebaut. Paket D ist groß; nach Sparregel 5 ist das ein Zwischenstand. Was noch fehlt, steht unten.

**Erledigt (Abschnitt 17:30, Schritte 2, 3 und 5):**
- **Bogen geschnitten:** `fx_faehigkeiten` → 6 Teile, die mitgemalten Düsen in Bild 1 und 4 sind entfernt (neue Option `leeren` in fx_cut.py).
- **Ersetzt:**
  - **Löwengebrüll:** gemalter Kegel (1) vom Maul in Blickrichtung, dazu Staubringe (2) am Boden. **Weg:** die zwei gelben Ringe (`loewenGebruell`, das war Enricos „gelber Kreis“), die goldenen Schallbögen und das rot-goldene Maul-Glühen.
  - **Aufprall (Durchbruch der Roten Faust) und Sprung-Landung des Löwenogers:** Boden-Druckwelle (3) statt glattem Ring.
  - **Rote Faust:** gemalter Dampfstoß (4) zusätzlich zum Rauch; der warme Leuchtschein der Faust-Aura ist gedämpft (60 %).
  - **Furcht-Aura des Kürassiers:** pulsierender Rauchklauen-Ring (5) am Boden statt des kalten Leuchtkreises; Aura-Puls und Hinrichtung ebenfalls mit diesem Ring.
  - **Hinrichtung:** Funken und Kettensplitter (6) am Treffpunkt.
- Glatte Ringe und Bögen werden nur noch gezeichnet, wenn das Bild fehlt. Bei Bildwirkung „aus“ gibt es keine dieser Effekte (wie bisher).
- **Bilder:** `entwurf/probe/effekte_d/alle_vorher_nachher.jpg` (links vorher, rechts nachher: Gebrüll, Sprung, Furcht-Aura, Hinrichtung), Einzelbilder in `vorher/` und `nachher/`. Werkzeug: `node tools/effekt_bilder.mjs`.
  - Bei Sprung und Hinrichtung hat die feste Aufnahmezeit den Aufprall noch verpasst. Die Effekte sind eingebaut, aber im Bild noch nicht zu sehen; das hole ich im nächsten Teil nach.

**Noch offen (nächster `pa`/`pw` für Paket D):**
- Schritt 1: Liste aller glatten Kreis-/Ring-Effekte mit Bild je Effekt (Befehle, großer Befehl, Banner, Gasschutz-Nimbus, Wirkungsbereich).
- Schritt 4: Vorschläge für fehlende Bilder an den Berater.
- Schritt 6 „Wucht“: Schaden je Fähigkeit aus der Simulation; fehlende Bilder (Löwenmaul-Mündung, Faustsalve-Doppelschuss).
- Punkt 14: Sturmrollen mit Dampfpfeife, Trümmer und Nachhall.
- Punkt 19: Gasgranate als Luftzerleger.

### Fragen an Enrico
- Keine.

---

## 2026-11-24 – Paket C2: Krähenfurt-Rest (Punkte 35–38) (`85812fa`)

Gepusht, index.html gebaut. Tests: `test_regeln`, `test_kommentare` in Ordnung, Karten-Aufnahmen ohne Seitenfehler.

- **Punkt 35 – Straßenenden und Kanten: Ursache gefunden.**
  - **Ursache:** Die Straßen waren schon durchgehende Bänder, nicht je Feld gelegt. Aber **alle** Straßen wurden in eine gemeinsame Schicht gemalt und erst danach mit der vereinten Straßenform maskiert. Die Matschtextur hat verschneite Ränder mit Grasbüscheln. Wo zwei Straßen nah beieinander liegen (Dorfplatz, Abzweig zur Kapelle), übermalte der helle Rand der zweiten Straße das Matschband der ersten. Das gab eine gerade Kante parallel zur Hauptstraße, die wie ein abgehacktes Ende aussah.
  - Geprüft und ausgeschlossen: Dorfplatz-Pflaster, Schneekante, Feld-Details, Naht der Textur.
  - **Behoben:** Jede Straße wird mit ihrer eigenen Maske gezeichnet. Abzweige und Kreuzungen gehen jetzt ohne Kante ineinander über. Straßenenden **innerhalb der Karte** laufen über gut ein halbes Feld weich aus (z. B. der Weg, der unten bei 10,9 endet); am Kartenrand laufen sie wie bisher hinaus.
  - **Bilder** (gleiche Kamera wie vorher): vorher `entwurf/probe/kraehenfurt_c/nachher/dorfplatz.jpg` und `strasse_nah.jpg`, nachher `entwurf/probe/kraehenfurt_c2/nachher/dorfplatz.jpg` und `strasse_nah.jpg`.
  - Am Dorfplatz laufen weiterhin zwei Bänder auseinander: Das ist die echte Gabelung (eine Straße zur Kapelle, eine zur Brücke), kein Zerfasern mehr.
- **Punkt 37 – Äcker auf der Ostseite:** Die Gartenfelder sind jetzt **eine zusammenhängende Ackerfläche**: eine gemeinsame, weich gezeichnete Maske über alle Felder, darin durchgehende Furchen in einer Richtung. Innen gibt es keine Feldgrenzen mehr, nur der Außenrand bleibt leicht unregelmäßig. Die Zäune bleiben.
  - Bilder: `entwurf/probe/kraehenfurt_c2/uebersicht_vorher_nachher.jpg` und `unten_rechts_vorher_nachher.jpg` (oben vorher, unten nachher).
  - Zum Vergleich: `window.ACKER_ALT = true`.
- **Punkt 36 – Krähenfurt neu abgeglichen:** Aufstellungszone der Aschenwacht eine Spalte zurück (`zoneD` 13 → 14). Konkordat **41,5 % → 54 %** (Startwert 1/2: 58 / 50 %, je 100 Schlachten). Gegenprobe „ein Grenadier weniger“: 80,5 %, zu stark. An den Handgranaten nichts geändert. Eintrag in `entwurf/BALANCE.md`.
- **Punkt 38 – Bildwirkung „sehr stark“:**
  - Jetzt vierte Stufe im Optionsmenü, gespeichert wie die anderen, Taste B schaltet weiter. Der Standard bleibt „stark“.
  - Den Boden dieser Stufe habe ich gegenüber der Probe etwas heller gemacht (`brightness 0,78` statt 0,74).

### Fragen an Enrico
- Keine.

---

## 2026-11-24 – Paket P: Plastik-Probe (Punkt 27, nur Bilder) (`44fcd56`)

Gepusht. Nichts fest eingebaut: Die Probestufe „sehr stark“ gibt es nur über `__dbg.bild(3)`, nicht im Optionsmenü, und sie wird nicht gespeichert. Der Standard bleibt „stark“.

- **Was die Stufe „sehr stark“ macht:**
  - Plastik-Karte aus `figur_plastik.py` mit ×2,0 statt ×1,3 eingerechnet (Klarheit, Glanz auf Metall).
  - Figuren mit mehr Kontrast (1,24) und Sättigung.
  - **Gerichtetes Licht von oben links:** oben links heller, unten rechts dunkler, je Bild einmal eingerechnet.
  - Kontaktschatten ×1,9 statt ×1,5.
  - Boden und aufrechte Gelände-Teile etwas dunkler, die Kantenverdeckung (`ao`) eine Stufe stärker.
- **Bilder (1920 px, je gleicher Ausschnitt; oben aus, Mitte stark, unten sehr stark):**
  - `entwurf/probe/plastik/a_kraehenfurt_vergleich.jpg` (Häuser und Truppen)
  - `b_sankt_russ_vergleich.jpg` (Kirche)
  - `c_stahlgaenger_vergleich.jpg` (Stahlgänger nah)
  - Einzelbilder `*_aus/_stark/_sehr_stark.jpg`
  - **(d)** `d_stahl_boegen.jpg`: heutiger Bogen, Enricos plastischer Bogen und das Spielbild „sehr stark“ nebeneinander.
- **Kosten** (`tools/plastik_bilder.mjs`, `messung.json`):
  - **Umschalten/Laden:** aus 0,33–0,57 s, stark 0,33–0,58 s, sehr stark **0,55–0,83 s**. Einmalig beim Umschalten bzw. beim ersten Zeichnen eines Bildes, danach zwischengespeichert.
  - **Bildrate** gleich: Krähenfurt 6,6 ms, Sankt Ruß 12,2 ms, Stahlgänger 5,7 ms je Bild bei stark wie bei sehr stark.
- **Einschätzung:**
  - „Sehr stark“ macht Figuren und Häuser kontrastreicher. Durch das Licht von oben links wirken Rüstungen etwas runder.
  - Die Figuren stehen weiter im Gelände: Die Kontaktschatten sind dunkler, nichts wirkt aufgeklebt.
  - Der Gewinn gegenüber „stark“ ist aber **mäßig**. Die Nachberechnung kann nur aufhellen und abdunkeln, sie erfindet keine Formen.
  - Enricos überarbeiteter Bogen (d) ist deutlich plastischer: echte Licht-/Schattenverläufe auf Schulterplatten, Knien und Stiefeln. Das erreicht keine Filterstufe.
  - **Achtung beim Bogen:** Er enthält **gemalte Bodenschatten auf dem Magenta-Grund**. Beim Freistellen bleibt dort ein dunkler bzw. rosa Saum, oder der Schatten wird mit ausgeschnitten. Neue Bögen besser ohne Bodenschatten malen lassen; den Schatten macht das Spiel selbst.

### Fragen an Enrico
- **Weg für mehr Plastik:** (A) neue Bögen im Stil von `konkordat_stahl_plastisch.jpg`, ohne gemalten Bodenschatten – stärkster Effekt, Aufwand je Bogen. (B) „sehr stark“ als dritte Menü-Stufe anbieten (billig, Wirkung mäßig). (C) beides.

**Hinweis zu Paket C2:** Vor deinem Stopp hatte ich mit Punkt 35 (Straßenenden) angefangen. Die harte Kante am Dorfplatz kommt weder von der Schneekante noch von den Feld-Details. Die Straßentextur selbst kachelt ohne Naht. Die Suche geht in Paket C2 weiter. Einzige Änderung daran: das Aufnahmewerkzeug `karte_bilder.mjs` kennt jetzt `INIT` (Skript vor dem Laden, für Vergleiche einzelner Schichten).

---

## 2026-11-24 – Paket C: Krähenfurt (Punkte 4, 1, 13, 12) (`de32997`)

Gepusht, index.html gebaut. Tests: `test_regeln`, `test_kommentare` in Ordnung, KI-Partie Krähenfurt bis zum Ende ohne Fehler, Karten-Aufnahmen ohne Seitenfehler.

- **Punkt 4 – Ruckler: Ursache gefunden und behoben.**
  - **Messung** (KI gegen KI bis zum Ende; Runden 2–3 und ab Runde 11 mit Tempo 1×, dazwischen schnell; `test_ki_partie.mjs` mit neuen Schaltern `SCHNELL_BIS`/`SPAET_1X`):
    - **vorher:** mittlere Bildzeit Runde 2: 10,7 ms, Runde 3: 16,3 ms, Runde 11–12: **27–28 ms** (95 % unter 32 ms).
    - **nachher:** Runde 3: 8,7 ms, Runden 11–15: **8,5–12 ms** (95 % unter 18 ms), auch nach Eisbrüchen.
    - In beiden Läufen gab es kein Einzelbild über 50 ms. Das „Schleifen“ ist also kein einzelner Hänger, sondern das ganze Bild wird langsamer.
  - **Ursache:** Die Bodenspuren (Trichter, Schneespuren, Blut) wachsen bis Spielende auf ~300. Jede wurde **in jedem Bild** mit einem Canvas-Filter gezeichnet (Schneespur dunkler/kontrastreicher und doppelt, Blut im Winter abgedunkelt). Canvas-Filter sind sehr teuer.
  - **Behoben:** Jede gefilterte Fassung wird einmal vorberechnet und danach ohne Filter gezeichnet (ui.js `gmBild`). Das Aussehen ist gleich.
  - Weitere Verdächtige geprüft: Eisloch/Zufrieren (kein Neuaufbau, keine Spitzen), Effekte, Kopfzeichen und Funken (werden aufgeräumt, wenige je Runde), Speicher (80–165 MB, kein Wachstum). Neue Testhilfe `__dbg.zaehler()` (Größen aller Listen).
- **Punkt 1 – Karte aufräumen.**
  - **Ursachen:** (a) Die Äcker (Gartenfelder rechts) lagen je Feld in einer anderen Furchenrichtung, manche quer – ein dunkles Streifen-Durcheinander, vor allem oben rechts. (b) Entlang der Straßen lag ein breiter, kräftiger Streifen „zertrampelter“ Schlammschnee. (c) Der Dorfboden war stark fleckig.
  - **Neu:** Alle Äcker in einer Richtung und blasser, Wegränder schmaler und schwächer, Dorfboden ruhiger. Das gilt nur für Winterkarten, Grauwall und Sankt Ruß bleiben gleich.
  - **Bilder:** `entwurf/probe/kraehenfurt_c/jetzt/` (vorher) und `…/nachher/`, je Übersicht, `strasse_nah`, `ecke_oben_rechts`, `dorfplatz`.
  - Zäune und Holzstapel habe ich nicht ausgedünnt; sie gehören zu Gärten und Häusern und wirkten auf den Bildern nicht störend.
- **Punkt 13 – Zielflaggen:**
  - Gut ein Viertel größer, herausgezoomt zusätzlich bis ×1,6.
  - Kräftigere dunkle Kontur an Pfahl, Tuch und Wimpel; Farben satter.
  - **Neutrale Flaggen ockerbraun** (klar anders als Feldgrau, auf Schnee sichtbar).
  - Dazu ein **flacher Bodenring** am Fuß: erobert in Fraktionsfarbe, neutral knochenweiß gestrichelt.
  - Gilt für alle Karten. Vergleich: `entwurf/probe/kraehenfurt_c/flaggen_vorher_nachher.jpg` (Übersicht, oben vorher).
- **Punkt 12 – Deckung in der Mitte: vorbereitet, aber nicht eingeschaltet.** Getestet mit Granattrichtern (Abwehr ×1,2, im Winter Schneetrichter), je 100 Schlachten:
  - ohne: Konkordat **41 / 42 %** (Startwert 1/2)
  - je zwei Trichter in der Mitte (6,7 · 8,8) und auf der Ostseite (14,6 · 14,8): Konkordat **72 / 84 %**
  - nur Ostseite: **84 %**. Die Felder liegen in der Aufstellungszone der Aschenwacht und bringen ihre Aufstellung/KI aus dem Tritt.
  - nur Mitte: **34 / 31 %**. Die Mitte nutzt vor allem der Angreifer (Aschenwacht).
  - → Keine Variante hielt die Siegquote. `MAP.deckung` ist vorbereitet, aber leer. Ausprobieren mit `KF_DECKUNG="6,7;8,8"`.
  - Grauwall und Sankt Ruß nur angesehen: Grauwall hat in der Mitte Trichter und Gräben, Sankt Ruß Ruinen und Gärten. Dort fehlt Deckung nicht wie in Krähenfurt.
- **Auffällig:** Krähenfurt steht derzeit bei **Konkordat 41–42 %** (abgeglichen war es am 22.11. auf 52,9 %). Vermutlich hat das die neue Handgranaten-Fähigkeit verschoben (Paket B2, dort nur Grauwall und Sankt Ruß gemessen). Neuabgleich nicht gemacht (Sparregel).

### Fragen an Enrico
- **Deckung Krähenfurt:** Die Trichter in der Mitte helfen dem Angreifer (Aschenwacht −9 Punkte fürs Konkordat). Variante A: Trichter in der Mitte **und** Ausgleich (z. B. Aufstellungszone der Aschenwacht `zoneD` eine Spalte weiter zurück oder KI-Gewichte), dann neu abgleichen (Messung ca. 10 Minuten). Variante B: Deckung nur als Zier ohne Regelwirkung. Variante C: so lassen.
- **Krähenfurt-Gleichgewicht:** Soll ich die Karte nach den Handgranaten neu abgleichen (Ziel ~50 %)?

---

## 2026-11-24 – Paket B2: Meldegänger teurer, Handgranaten als Fähigkeit, Scharfschützen-Läufe (`696ca67`)

Gepusht, index.html gebaut. Tests: `test_regeln`, `test_kommentare` in Ordnung, Partietest fehlerfrei (Konsole sauber). Simulationen je 100 Schlachten, ein Startwert.

- **Punkt 33 – Meldegänger: 40 statt 20** (Abgleich +15).
  - Messung: `MA_melder=1` legt den Meldegänger nur zusätzlich in die Armee, der Preis spielt dabei keine Rolle. Deshalb habe ich gegen eine gleich teure Kohorte (40) getauscht, beides mit gemischter Aufstellung (`MISCHEN=1`).
  - Grundarmee: Konkordat 63 %. Mit „1 Kohorte raus, 1 Meldegänger rein“: **44 %**. Bei 40 ist er also deutlich *weniger* wert als eine Kohorte, nicht mehr zu billig. Weiter anheben habe ich deshalb nicht.
  - Neu bewertet wird er bei der Zusammenlegung mit dem Sanitätstrupp.
- **Punkt 34 – Handgranaten (Aschengrenadiere):**
  - Die feste Regel (Nahkampf ×1,25, Schuss ×0,85) ist ersetzt durch die Fähigkeit **„Handgranaten“**.
  - **Regel:** Aktion, Abklingzeit 2 (jede zweite eigene Runde). Wurf auf einen Gegner bis 2 Felder in Sicht. Schaden 0,7 (Anzeige 7), Graben und Häuser schützen nicht. Gegen Panzer ×0,4, gegen Kampfanzüge ×0,75. Das Ziel ist niedergehalten.
  - **Darstellung:** Bild, Ton und Ruf „Granate“ wie bisher (`poseWurf`, Ereignis `handgranate`).
  - **KI:** wirft auf Gegner daneben oder in Graben, Haus, Ruine, Bunker oder eingegrabene Gegner (MG und Geschütze bevorzugt).
  - **Texte und Preis:** Kurztext am Knopf, Text in der Einheitenkarte, Schlagwort „Handgranaten“, Rolle bleibt „Stoßinfanterie“. Der Preis bleibt 30 (Handgranaten +10, Abgleich −15). Die Chronik passt („geballte Handgranaten entscheiden den Kampf“).
  - Abschalter `NOHANDGRANATE=1` = alte Regel.
  - **Messung, Siegquote Aschenwacht (alt / Schaden 0,6 / 0,8 / gewählt 0,7):** Grauwall 52 / 57 / 58 / **60 %**, Sankt Ruß 64 / 52 / 64 / **59 %**; im Schnitt 58 / 54,5 / 61 / **59,5 %**. Bei 0,7 bleiben die Grenadiere also etwa gleich stark (±1 Punkt, Streuung bei 100 Schlachten etwa ±5). Würfe je Schlacht: Grauwall etwa 9,5, Sankt Ruß etwa 16.
- **Punkt 32 – Scharfschützen-Läufe:**
  - **Ursache:** Im Posenbogen berühren sich die kniende Schusspose (oben rechts) und die fallende Pose (unten rechts). Das Schneidewerkzeug trennte sie mit einer **senkrechten** Naht, obwohl sie **übereinander** stehen. Der lange Lauf landete dadurch bei der fallenden Figur; dort sah man oben links ein fremdes Gewehrstück.
  - **Behoben:** neue Option `quer` in figure_cut.py (waagerechte Naht). Spielbilder neu geschnitten, Plastik-Karte neu gerechnet.
  - **Bilder:** `entwurf/probe/scharfschuetze/vorher_posen.jpg` und `nachher_posen.jpg` (jede Pose), dazu der Bogen.
  - Der Grundbogen (liegend, kniend, gehend) war schon vollständig. Die Pirschjäger habe ich mitgeprüft (`pirschjaeger_teile.jpg`): alle Läufe ganz.
- **Korrektur zum Bericht Paket B:** Der Sturmlauf reicht bis **4** Felder (`P.RUSH` 4), nicht 3.

### Fragen an Enrico
- Keine.

---

## 2026-11-24 – Paket B: schnelle Kleinigkeiten (Punkte 5, 6, 7 Teil 1, 8, 15, 20, 21, 24) (`47d616a`, `ef3654e`)

Gepusht, index.html gebaut. Tests: `test_regeln` (mit neuer Prüfung Lichtkreis) und `test_kommentare` in Ordnung; Partietest bis auf eine schwankende Blickrichtungs-Prüfung (siehe unten); Kamera-Probe im Browser ok. Simulationen je 100 Schlachten, Grauwall, ein Startwert.

- **Punkt 7 Teil 1 – Meldegänger:** „Befehl überbringen“ hat jetzt Abklingzeit `P.MELDER_CD` 2 (geht jede zweite eigene Runde), Anzeige am Knopf, Hinweis „Der Meldegänger ist noch unterwegs“. Die KI hält sie über `canSend` ein.
  - **Messung:** Die Standardarmeen haben keinen Meldegänger, die KI kauft keinen; die Grundmessung ist deshalb unverändert (Konkordat 48 % vorher wie nachher). Mit einem zusätzlichen Meldegänger im Konkordat (`MA_melder=1`): **ohne Abklingzeit 83 %, mit Abklingzeit 72 %.** Ein einzelner Meldegänger war also sehr stark; auch mit Abklingzeit ist er viel wert. Er kostet heute nur 20 Punkte.
  - Teil 2 (Zusammenlegen mit dem Sanitätstrupp) ist wie vorgegeben nicht gebaut.
- **Punkt 5 – Spuren:** Winterspuren erscheinen nur noch, wenn Start- und Zielfeld des Schritts Schnee sind: nicht auf Straße, Bahn, Fluss, Eis, Eisloch, Furt, Brücken, Bohlenweg.
- **Punkt 6 – Zielmarke:** Statt des gelben Visiers liegt jetzt ein flacher, gestrichelter Ring in Knochenweiß am Boden **um** die Figur (Radius wie ein Standring, Striche nur nach außen, ruhiges Pulsieren). Der kurze Ring beim Auslösen ist ebenfalls knochenweiß. Der warme Lichtschein der Leuchtkugel am Boden bleibt.
  - Weitere gelbe Overlays (nicht geändert, zur Entscheidung): Wirkungsbereich beim Halten eines Fähigkeitsknopfs (Messing-Fläche), Banner-Umkreis, Marschfelder/Rest-BP gelb (Paket 2, so gewünscht), Wegpunkt-Ring, Ringmarken „Sperrfeuer/Feuer frei/Dauerfeuer bereit“, Ring beim großen Befehl, Meldungen „Ziel markiert“/„Feuerschlag!“ (Text).
- **Punkt 15 – Minen aufdecken:** Die Regel stimmte schon: Die Markierung deckt Minen im Feld und daneben auf. Gezeichnet wurde aber nur ein kleiner Fleck unter den Figuren, daher hat Enrico ihn nie gesehen. **Neu:**
  - Entdeckte Minen des Gegners tragen das Tellerminen-Zeichen über allem.
  - Solange die Markierung gilt, deckt ihr Lichtkreis auch **neu gelegte Minen** und **hineinziehende versteckte Einheiten** sofort auf (engine `imLicht`/`lichtAufdecken`, Abschalter `NOLICHT`).
  - Die Meldung „aufgedeckt: n Minen“ gab es schon.
  - Prüfung in `test_regeln`.
- **Punkt 20 – Heilzeichen:** Ist ein Sanitäts- oder Versorgungstrupp gewählt, steigen über jeder Einheit, die er jetzt versorgen kann, drei kleine Pluszeichen auf (Knochenweiß, das mittlere blassrot, dunkle Kontur). Bei Fahrzeugen sind es Schraubenschlüssel. Die Zeichen erscheinen nur, solange der Trupp gewählt ist.
  - Vorschlag (nicht gebaut): dasselbe für Munition, Entgiften und Befehle (Kiste, Maske, Wimpel).
- **Punkt 21 – Granaten im Nahkampf: geklärt.** Die Granate der Aschengrenadiere ist **Regel**, nicht nur Bild: `granatSturm` (F103), Nahkampf ×1,25 („Handgranaten“), Schuss ×0,85. Das Ereignis `handgranate` kommt in derselben Nahkampf-Szene und wirkt deshalb wie „am Ende“. Andere Fußtruppen werfen keine Granate. **Nicht geändert** – siehe Frage.
  - Nicht gebaut: kleine Zier-Granate für jede Fußtruppe im Nahkampf gegen Fahrzeuge (hängt an der Antwort).
- **Punkt 24 – Kamera zurück:** Nach einem Fernschuss im eigenen Zug (Schuss mit Kamerafahrt, Granatflug, Feuerschlag, Faustsalve) fährt die Kamera nach 0,5 s weich dorthin zurück, wo sie vor der Handlung stand. Im KI-Zug bleibt es wie bisher. Klick, Scrollen, Ziehen oder eine Taste bricht ab.
  - Option „Kamera nach dem Schuss zurück“ (Standard an, gespeichert).
  - Probe im Browser: Die Kamera fuhr 277 px zum Ziel und stand danach wieder genau am Ausgangspunkt.
- **Punkt 8 – Sturmlauf:**
  - **Ursache:** Minen sperrten den Sturmlauf im Regelkern nie. Er ging aber nur in **geraden Linien**; lag schräg etwas im Weg oder stand der Gegner nicht in einer der sechs Richtungen, gab es kein Ziel.
  - **Neu:** kürzester Weg bis 3 Felder in jede Richtung, nie durch Einheiten. Feindberührung hält nicht auf, ohne Freischlag. Minen, Draht, Gas und Feuer werden betreten: Auf einer Mine endet der Lauf mit Schaden.
  - Die Wegvorschau zeigt den Sturmlauf-Weg; bekannte Minen des Gegners bekommen jetzt beim Sturmlauf **und** beim normalen Ziehen das Warndreieck.
  - **Messung mit Kampfmaschinen (`MECHS=1`):** Sturmläufe je Schlacht (Konkordat) 0,55 → 0,76, Siegquote 48 → 49 %. Abschalter `RUSH_GERADE=1`.
- **Partietest:** Bei der Prüfung „Blickrichtung aller 54 Typen“ fielen in zwei Läufen jeweils zwei *andere* Typen auf (lanzeD/orden, dann kohorte/mahlwerk); sonst fehlerfrei. Das ist eine Zeitfrage im Test (120 ms nach dem Drehen, Bilder noch nicht neu gezeichnet), keine Folge dieses Pakets. Beim ersten Lauf liefen zudem drei Simulationen parallel.

### Fragen an Enrico
- **Punkt 21:** Die Granate der Aschengrenadiere ist eine Regel (Handgranaten vor dem Nahkampf, Nahkampf ×1,25, Schuss ×0,85). **Behalten** (dann ist die Granate im Bild richtig), oder **Regel streichen** (dann verschwindet auch die Granate)? Und soll jede Fußtruppe im Nahkampf gegen Fahrzeuge zur Zier eine kleine Granate werfen (ohne Schaden)?
- **Meldegänger:** Mit Abklingzeit bringt ein Meldegänger dem Konkordat in der Messung immer noch +24 Punkte Siegquote. Preis (20) erhöhen, oder erst mit der Zusammenlegung (Punkt 7 Teil 2) neu ansetzen?

---

## 2026-11-24 – Paket A4: Gelände-Chroniken, Ton-Pult-Rest, „1 Feld“ (`32be418`)

Gepusht. Tests: `tonpult_test` 93/93, `test_regeln` und `test_kommentare` in Ordnung. Keine Regeländerung, keine Simulation.

- **Punkt 30 – Gelände-Chroniken:** alle 27 Geländearten haben `chronik: { quelle, text }` aus `entwurf/welt/gelaende_chroniken.md` (keine fehlt, keine übrig). Die 17 alten Weltkriegstexte sind weg. Der Feld-Tooltip zeigt „Aus den Chroniken“, darunter die Quelle kursiv, dann den Text. Bild: `entwurf/probe/chronik/feld_friedhof_1920.jpg` (Friedhof Sankt Ruß).
- **Weitere Weltkriegsreste im Spiel gefunden und entfernt:**
  - Siegbild: der Kasten „Wie war es im echten Krieg?“ (Cambrai 1917, drei Lernfragen). Er ist ganz raus.
  - Startmenü-Hinweis „Waffen, Gelände und Taktik entsprechen dem Ersten Weltkrieg 1914–1918“ → „Eine eigene Welt im Stil des Grabenkriegs.“
  - Schalter „Kampfmaschinen: Ohne“: „wie im Ersten Weltkrieg“ → „Nur Truppen und Gerät des Grabenkriegs, ohne Kampfmaschinen.“
  - README (Einleitung „Gedacht auch für den Geschichtsunterricht“, „Lerntexte“) umgeschrieben.
  - Die Suche nach Somme, Passchendaele, Reims, Verdun, Flandern, Argonnen, Loos, Yser, Lorette und Albert findet im Spiel-Code nichts mehr. Treffer gibt es nur noch in eingebetteten Bild- und Tondaten (zufällige Buchstabenfolgen) und in einem Quelldateinamen eines Tons („adrian_sommer“, CREDITS/sound_bau). Die Kartenzufallszahl 1917 bleibt, sie ist nur ein Startwert und nirgends sichtbar.
- **Punkt 29 – Ton-Pult:** Das erste „+ ins Paket“ an einer Stelle, an der das Werks-Paket klingt, nimmt alle seine Töne angekreuzt mit, der neue kommt dazu. Ist ein einzelner Ton gewählt, wird er wie bisher der erste. Neue Prüfung im Pult-Test.
- **Punkt 31 – „1 Feld“:** Die neue Hilfsfunktion `felder(n)` in ui.js wird an 19 Stellen benutzt: Werte-Kasten „Schuss“ im Info-Fenster, Reichweite in der Einheitenkarte, Zweitwaffe, Breitseite, Sicht, Sturmlauf, Sprung, Banner, großer Befehl, Anspannen, „1 Feld“/„1 Feldern“. Die Schlagworte („Schrotflinte 1 Feld“, „Zweitwaffe (Nachbarfeld)“) waren schon richtig. Die Spanne „1–n Felder“ der Panzergranate bleibt so.

### Fragen an Enrico
- Keine.

---

## 2026-11-24 – Paket A3: Chroniken-Texte statt „Im echten Krieg“ (Punkt 28) (`639f648`)

Gepusht. Tests: `test_regeln` in Ordnung (54 Einheiten), `test_kommentare` sauber. Keine Regeländerung, keine Simulation.

- **Alle 54 Einheiten** haben jetzt den Chroniken-Text aus `entwurf/welt/weltbibel.md`: in TYPES ersetzt `chronik: { quelle, text }` das alte Feld `real` (Weltkriegsfakten sind aus den Einheiten raus). Kein Typ ohne Text, kein Text ohne Typ, keiner länger als 280 Zeichen.
- **Anzeige „Aus den Chroniken“**, darunter die Quellenzeile klein und kursiv, dann der Text: im Info-Fenster, in der ausführlichen Einheitenkarte und in den Nachschub- und Armee-Details (eine gemeinsame Funktion `chronikHtml` in ui.js).
- **Blaue Legion:** dieselben Einheiten wie das Konkordat, damit automatisch dieselben Texte.
- `test_regeln` verlangt jetzt Quelle und Text (höchstens 280 Zeichen) und meldet, falls irgendwo noch ein alter `real`-Text steht.
- **CLAUDE.md:** Projektziel (Grabenkrieg-Stil, eigene Welt, Weltbibel) und Textregel wie vorgegeben umgestellt.
- Weltbibel mit eingecheckt (die Texte im Spiel stammen daraus).
- **Bilder** (1920 px): `entwurf/probe/chronik/info_oger_1920.jpg`, `entwurf/probe/chronik/info_knecht_1920.jpg` (neu erzeugbar mit `node tools/chronik_bilder.mjs [typ …]`). Für die Aufnahme wurde eine vorhandene Einheit kurz zum Oger bzw. Eisenknecht umgebaut. Der Block „Anführer“ im Eisenknecht-Bild kommt daher, die Einheit war vorher ein Hauptmann. Im echten Spiel steht er dort nicht.

### Fragen an Enrico
- **Gelände-Texte:** Die Geländearten (Trichter, Graben, Draht, Wald, Kirche, Friedhof …, 17 Stück) haben noch Weltkriegsfakten (Passchendaele, Somme, Reims …). Sie erscheinen im Feld-Tooltip als „Im echten Krieg“. Soll der Berater auch dafür Chroniken-Texte schreiben (gleiche Form: Quelle + 1–2 Sätze), oder sollen die Gelände-Texte einfach weg?

---

## 2026-11-24 – Paket A2: Ton-Pult „Eigenes Paket“ (Punkt 25) + Export 23.11. 22:17

Gepusht (`a90a934`). Tests: `tonpult_test` 92/92 (darin 10 neue Prüfungen zum eigenen Paket), `test_tonpult3_spiel` 17/17 (3 neue), `test_kommentare` sauber. Keine Regeländerung, keine Simulation, kein Ton-Spur-Volllauf (Sparregel).

### Zuerst: Enricos Export vom 23.11. 22:17 eingebaut
- `tonwahl_bau` + `ton_teilen` + Bau gelaufen. **285 von 298 Wahlen wirken im Spiel** (298 = 287 aus dem neuen Export plus 11 ältere Einträge, die im neuen fehlen); Abstellkammer 17 Töne, alle 54 Einheiten „fertig“.
- **Nicht wirksam (13), und warum:**
  - 7× „Schießen“ bei Einheiten ohne Fernkampf (Feldscher/Heiler, Signal-, Fernsprechtrupp, Meldegänger, Sturmtrupp, Eingreiftrupp): diese Zeile gibt es im Pult seit dem Abgleich Spiel == Pult nicht mehr, weil die Einheit den Ton im Spiel nie spielt. Die Wahl stammt aus älteren Exporten.
  - 1× Mineur „Stollen sprengen“: liegt jetzt unter „Gelände und Gebäude“ (dort ist eine eigene Wahl von Enrico eingetragen und wirkt).
  - 5× ohne eigene Wirkung: entweder ist die Wahl gleich dem, was das Spiel ohnehin spielt (Lautstärke/Tonhöhe 100 %), oder zwei Pult-Zeilen fallen im Spiel auf denselben Platz und die zweite überdeckt die erste (z. B. Eingreiftrupp „Schlag“ aus einem alten und dem neuen Export).
- Umgehängt (wirkt, nur anderer Platz im Spiel): bei allen Einheiten die Zeile „Tod“ (Pult zeigte „-“, das Spiel spielt `aufgerieben`), Mörser/Minenwerfer Sperrfeuer → `sperr_boom`, Gelände Stollen → `stollen_boom`.

### Punkt 25 – Eigenes Paket
- **„+ ins Paket“** als Ankreuzfeld (≥ 40 px) an jedem Ton in „Welcher Ton?“ und in „Alle Töne ansehen …“. Bei einer Zeile mit mehreren Tönen nimmt das Kreuz alle Töne dieser Zeile auf (halb angekreuzt = ein Teil davon ist drin). Im Dialog bleibt das Fenster beim Ankreuzen offen, man kann also quer durch die Rubriken sammeln (Suche hilft).
- **Start:** Ist schon ein einzelner Ton gewählt, wird er der erste im Paket; sonst beginnt das Paket leer. **„✎ Paket bearbeiten“** (erscheint, wenn an der Stelle ein Werks-Paket mit mehreren Tönen klingt) übernimmt alle seine Töne angekreuzt; dann einzeln ab- oder dazuwählen.
- **Anzeige** unter „Jetzt eingestellt“: „Eigenes Paket · n Töne“, aufklappbar, je Ton ▶ und „✕ aus dem Paket“ (nimmt nur aus diesem Paket, sortiert nichts aus). Leer gemacht = wieder wie im Spiel. Alles mit „↶ Rückgängig“.
- **Mehrere wählen:** das Paket gilt für alle gewählten Einheiten (gleiche Stelle).
- **Mischtöne** dürfen Mitglied sein (nicht in Ruf-Zeilen – Rufe können im Spiel nicht mischen, wie bisher).
- **Export:** neuer Wahltyp `pk:["schlüssel", …]`, zusätzlich Feld `paket` (Liste) zum Lesen. Alte Exporte lesen sich unverändert ein (Test mit dem Export vom 22.11.).
- **Spiel:** `tonwahl_bau` schreibt `pk` in TONWAHL (fehlende Töne fallen mit Hinweis heraus; ein Paket aus nur noch einem Ton wird zum festen Ton). `ui.js`: `pkZiehen` zieht zufällig einen, **nie zweimal hintereinander denselben**; gilt überall, wo die Pult-Wahl wirkt (Waffentöne, Treffer, Töne ohne playSound, Sprüche, Rufe, Schreiter- und Heldenstimmen).
- Test im Spiel: Paket aus 3 Tönen zweier Rubriken (Einschläge + Treffer auf Stein), 40 Schüsse: Verteilung 13/12/15, 0× derselbe Ton hintereinander.
- Bilder: `entwurf/probe/tonpult3/15_eigenes_paket.png` (Paket aus Mischton, Einschlag und Schritten für zwei Einheiten), `14_eigenes_paket_alle_toene.png` (Ankreuzen im Dialog).

### Fragen an Enrico
- Beim ersten Ankreuzen an einer Stelle, an der noch das Werks-Paket klingt, beginnt das eigene Paket **leer** (nur mit dem angekreuzten Ton). Wer das Werks-Paket erweitern will, drückt vorher „✎ Paket bearbeiten“. Passt das so, oder soll das erste Kreuz das Werks-Paket automatisch mitnehmen?

---

## 2026-11-23 – Paket A: Bedienfehler (18:30, Spieltest-Punkte 9 und 22) (`e2c793c`)

Gepusht. Tests: Partietest Grauwall und Krähenfurt fehlerfrei, darin die drei neuen Prüfungen; test_kommentare sauber. Keine Regeländerung, deshalb keine Simulation.

### 18:30 Geschütze ohne Ziel
- **Ursache 1:** Beim Aufbau der Knöpfe für Geschütze brach die Liste vor dem „Fertig“-Knopf ab, deshalb gab es nie einen Haken. Jetzt hat jede Einheit „Fertig“ (Taste 5, Leertaste, E).
- **Ursache 2:** Geschütze galten als „noch nicht fertig“, sobald irgendein Feld in Reichweite lag, auch ein leeres.
  - Jetzt zählt nur ein Gegner, den sie beschießen können (Sprenggranate oder Sperrfeuer).
  - Einheiten in Stellung (MG aufgebaut, Geschütz abgeprotzt), die nicht ziehen können und kein Ziel haben, werden automatisch grau. Abbauen/Aufprotzen allein hält sie nicht mehr offen.
  - Sie bleiben anwählbar, man kann also trotzdem abbauen oder aufprotzen.
  - Das gilt für alle Einheitenarten (Mörser, Haubitze, Minenwerfer, Scharfschützen, MG). Ballon und Scharfschützen hatten diese Ursache nicht, sie folgten schon der allgemeinen Regel.

### Punkt 9 – nur ein Modus
- Es gibt jetzt nur einen Bedienmodus gleichzeitig: Angriffsart (Kanone/Nahkampf), Geschützart (Sperrfeuer, Gas), Feld-Fähigkeit (Fähigkeit, Zweitwaffe, Draht schneiden, Rammen, Faustsalve) oder Hilfe (Versorgen, Meldegänger, Bergen).
- Ein neuer Knopf löst den alten ab. Abbrechen geht mit demselben Knopf noch einmal, mit **Esc** oder mit **Rechtsklick**; es erscheint die Meldung „Abgebrochen.“.
- **Nicht ausführbar → sofort zurück** mit kurzem Hinweis, warum. Beispiele: „Zweitwaffe: kein Ziel in Reichweite oder Schussfeld.“, „Sperrfeuer: kein Zielfeld (Abklingzeit, Reichweite oder keine Sicht).“, „Draht schneiden: kein Drahtfeld daneben.“
- Befehle, Marsch, Feuerbereitschaft und MG-Sperrfeuer sind sofort-Aktionen ohne Modus; sie können nicht hängen bleiben.

### Punkt 22 – Fähigkeit durch Anklicken
- **Ursache:** Ein eingeschalteter Fähigkeitsmodus blieb aktiv, wenn man über „Nächste Einheit“, Tasten oder das Panel zu einer anderen Einheit wechselte. Danach löste ein Klick auf eine passende eigene Einheit die Fähigkeit aus (Munition an die Feldkanone).
- Jetzt löscht jeder Wechsel der gewählten Einheit den Modus. Ohne Modus wählt ein Klick auf eine eigene Einheit sie nur aus.
- Das gilt für alle Fähigkeiten mit Ziel (Munition, Reparieren, Versorgen, Meldegänger, Bergen, Entgiften, Befehle …).

### Tests (`tools/test_partie.mjs`, neu)
- Haubitze ohne Gegner: „Fertig“-Knopf da, kein Grund offen zu bleiben.
- Panzer: Kanone → Zweitwaffe → Kanone → Kanone (aus) → Esc: nie zwei Modi.
- Versorgungstrupp mit Munitionsmodus, dann Feldkanone gewählt: Modus weg, keine Munition. Danach ein Klick ohne Modus auf die Feldkanone: sie wird nur ausgewählt.
- Nebenbei behoben: Das Schussfeld wurde für eine Einheit außerhalb der Karte gezeichnet. Das ging nur im Test auf, ist aber jetzt auch im Spiel abgesichert.

Als Nächstes laut Reihenfolge: **Paket A2** (Ton-Pult „Eigenes Paket“, Punkt 25).

## 2026-11-23 Abend – Ton-Pult 3 (Auftrag 16:50): einfach, vollständig je Einheit, Abstellkammer, Mischtöne

Gepusht: `ea5037c` (Teil 1: neues Pult), `6627dca` (Teil 2: Spiel und Pult abgeglichen), dazu der Abschluss-Commit mit `index.html` (Titel „Ton-Pult 3, Abschluss“).
Pult: `tonpult.html` (online über GitHub Pages wie bisher). Bilder: `entwurf/probe/tonpult3/`.

**Tests:** `tonpult_test` 82/82 · `test_tonpult3_spiel` 14/14 · `test_tonplaetze` (Spiel == Pult): 0 fehlen, 0 zu viel, 0 Zeilen ohne Wirkung, 43 Hinweise · Partietest Grauwall, `test_ton`, `test_kommentare` fehlerfrei.

**Zu den Sparregeln (19:20):** Ich habe sie erst beim Abhaken gelesen. Bis dahin waren ein Hilfs-Agent (Ton-Spur bauen) und zwei volle Ton-Spur-Läufe (26 und 22 Minuten) schon gelaufen; der zweite war nötig, weil sich das Spiel nach dem ersten noch geändert hatte. Ab jetzt gelten die Regeln: keine weiteren Läufe, die anderen Pakete habe ich nicht angefasst.

### 1. Das neue Pult
- **Hauptansicht „Töne einstellen“ in drei Schritten** auf einem Bildschirm (`01_drei_schritte_1920.png`, `14_drei_schritte_1280.png`, `14_drei_schritte_2560.png`):
  - **Wer?** Große Einheitenbilder, Knöpfe Konkordat / Aschenwacht / Gemeinsam, Gruppen nach Art und Waffe, „Mehrere wählen“ (`04_mehrere_einheiten.png`).
  - **Wann?** Große Kacheln nur für Momente, die diese Einheit hat (Anklicken, Bewegen, Schießen, Einschlag beim Ziel, Nahkampf, Wird getroffen, Tod und Ausfall, Fähigkeiten, Ankunft).
  - **Welcher Ton?** Nur Töne, die zum Moment passen; ▶ = hören, Antippen = gewählt (`02_ton_gewaehlt.png`). „Alle Töne ansehen …“ öffnet die ganze Bibliothek (`05_alle_toene_dialog.png`).
  - **Fortschritt:** „7 von 9 Momenten eingestellt“, jede Einheitenkarte zeigt „3 / 9“ oder „✓ fertig“ (`03_einheit_fertig.png`). „Passt so“ hakt eine Stelle ab, ohne den Ton zu ändern; „Alles Übrige passt so“ hakt den Rest ab.
- **Bibliothek neu nach Inhalt sortiert** (`06_alle_toene_stimmen.png`, `07_rubrik_graben_und_schanzen.png`):
  - Neue Rubrik „Graben und Schanzen“ (Schaufeln, Atmen beim Graben, Sandsäcke, Draht). „Handgriffe und Gerät“ bleibt.
  - Jeder Ton steht nur noch an einer Stelle. Über „Rubrik …“ an jedem Ton sortierst du selbst um; das wird gespeichert und exportiert.
  - **Unsicher einsortiert, mit „?“ markiert (11):**

    | Ton | steht jetzt unter | Zweifel |
    |---|---|---|
    | `charge` (Gegenstoß) | Stimmen – Rufe und Befehle | Quelldatei heißt „loud-tiger-ii-audio-test“, klingt nach Motor |
    | `mgsetup` | Stimmen – Rufe und Befehle | ist ein Ruf („Guns up“), kein Handgriff |
    | `neu2_schritte` | Schritte – Im Schnee | Maschinen- oder Schneeschritte |
    | `held_schritt_ritter` | Schritte – Schwere Schritte | alter Ritter-Schritt |
    | `held_aufladen` | Maschinen – Dampf und Hydraulik | „Vortex“, könnte auch ein Effekt sein |
    | `neu2_autokanone` | MG | Autokanone: MG oder Kanone? |
    | `cannonH` | Kanonen – Schwere Artillerie | enthält auch Einschlag-Anteile |
    | `neu2_knall` | Einschläge | Knallkörper |
    | `bauen` | Graben – Sandsäcke und Bauen | Hämmern oder Schanzen? |
    | `drahtlatch` | Graben – Draht | Riegel-Klacken |
    | `neu_versorgung` | Natur und Kulisse | Versorgungs-Kulisse |
- **Abstellkammer** (`08_abstellkammer.png`, `09_ersatz_waehlen.png`, `10_bereiche_abgeschaltet.png`):
  - Neben jedem Ton steht „✕ aussortieren“. Der Ton verschwindet aus allen Auswahllisten, in der Abstellkammer holt ihn ein Klick zurück. Gelöscht wird nichts.
  - Ganze Bereiche lassen sich abschalten: Rubrik, Herkunft, Sprechergruppe.
  - Im Spiel fällt eine aussortierte Fassung aus der Zufallsgruppe. Ist es der einzige Ton einer Stelle, bleibt er, und das Pult zeigt „⚠ aussortiert, bitte Ersatz wählen“.
- **Stimmen nach Herkunft:** Jede Stimme trägt ein Schild (Suno 289 Töne, ElevenLabs 90, Helden 24, sonstige 167), Filter je Herkunft in „Alle Töne“. Die Heldenstimmen sind eine eigene Gruppe und bleiben bei jedem Bereichs-Schalter unberührt, außer du schaltest ausdrücklich „Helden“ ab.
- **Mischton bauen** (`11_mischton_bauen.png`, `12_mischton_zugewiesen.png`):
  - 2 bis 4 Töne übereinander, je Spur Lautstärke, Startversatz in Millisekunden und Tonhöhe; ▶ spielt sofort.
  - Die 9 bestehenden Mischtöne aus dem Bau lassen sich als Vorlage öffnen. Wo die Einzelspuren nicht mehr einzeln vorliegen, ist der fertige Ton die erste Spur.
  - Speichern unter eigenem Namen: Der Mischton steht in der Bibliothek, ist zuweisbar und steht als Rezept im Export.
  - **Im Spiel wird beim Abspielen gemischt, nicht über `mix` in `sound_bau.json`.** Gründe: kein zweites Komprimieren (kein Qualitätsverlust), `sound.js` wächst nicht, kein Bau-Lauf im Chrome nötig, die Mischung wirkt sofort nach `tonwahl_bau`. Nachteil: Der Versatz schwankt um wenige Millisekunden; im Test lagen 220 ms genau bei 220 ms.
- **Ton-Pult 2** (Tabelle, Bibliothek, Einzelne Einheit) liegt unverändert unter „Experten ▾“.
- Speicher `arm.tonpult`, Verlauf und Rückgängig arbeiten wie bisher. Der Export hat das alte Format plus Abstellkammer, Rubriken, Mischtöne und „passt so“. Dein Export vom 22.11. (20:52) liest sich vollständig ein (`13_export_2211_eingelesen.png`).

### 2. Vollständig je Einheit: Spiel gegen Pult gemessen
- **Messung:** `tools/ton_spur.mjs` spielt für alle 54 Einheiten echte Szenen im Spiel durch (Grauwall und Krähenfurt, ca. 25 Minuten) und schreibt mit, welche Tonplätze klingen. `tools/test_tonplaetze.mjs` vergleicht das mit den Kacheln im Pult.
- **Erster Vergleich (vor dem Abgleich):** 69 Plätze fehlten im Pult, 93 Zeilen waren zu viel, und bei 238 Zeilen kam die Pult-Wahl im Spiel nie an.
- **Jetzt:** 0 Plätze fehlen, 0 Zeilen sind zu viel, bei 0 Zeilen kommt die Wahl nie an. Es bleiben 43 Hinweise (siehe unten). Der Vergleich läuft auch als Prüfung im Pult-Test mit.
- **Im Pult entfernt (die Einheit spielt den Ton nie):**
  - Schuss- und Treffer-Kacheln bei 19 Einheiten ohne Fernkampf (Meldegänger, Fernsprechtrupp, Feldscher, Schildwall, Lanzenreiter, Grabenräumer, Rauchwerfer, Mineure, beide Versorgungstrupps, Ballonbeobachter, Sprenglanzen-Reiter, Signaltrupp, Aschenpfleger, Schwere Grabenwacht, Sturmbrecher, Eingreiftrupp, Kürassier, Bohrkoloss).
  - „Daneben“ bei MG-Einheiten, Marsch und Wald bei Mörser und Minenwerfer, Sperrfeuer bei der Feldkanone, Kampfschrei beim Ballon, Husten beim Gasschutz-Trupp.
  - Rufe „Held fällt“ (die Heldenstimme übernimmt) und „Granate“ beim Konkordat (nur die Aschenwacht hat Panzergranaten).
- **Im Pult ergänzt (klang im Spiel, hatte keine Kachel):**
  - Schlagabtausch (schnelle Hiebe vor dem letzten Schlag) bei Stahlgängern, Panzerknechten, beiden Helden, Löwenoger, Grabenräumer.
  - „Abwehrhieb“ bei Geschützen, Ballon, Landkoloss und Sturmpanzer (sie kämpfen nicht, schlagen im Bild aber zurück).
  - Splitter treffen Fußtruppen (Kanonen, Geschütze, Feuerschlag), Abpraller bei Geschützen und Panzergranaten.
  - Über eine Barrikade und Rammen-Anlauf bei den Schreitern, Ballon-Brenner, Ticken beim Stollen und beim Minenlegen, Bohrer-Ton beim Bohrkoloss.
  - Neue Gruppe **„Gelände und Gebäude“** unter „Gemeinsam“: Gebäude stürzt ein, Stollen wird gesprengt (drei Töne). Diese Töne gehören zu keiner Einheit.
- **Im Spiel behoben (die Wahl aus dem Pult kam nicht an):**
  - **Alle Waffentöne.** Das war der größte Posten: Gewehrsalve, Scharfschütze, Pistole, MG, Drehlauf, alle Kanonen, Zweitwaffen, Breitseite, Faustsalve. Auch deine Wahl für das Hünen-MG und das Grenadier-Gewehr vom 22.11. klang deshalb bisher nicht. Per Test am Beispiel Gewehrsalve geprüft.
  - Treffer am Ziel, Streifschuss, Abpraller: gehören jetzt dem Schützen.
  - Nahkampf-Hiebe: gehören dem, der zuschlägt.
  - Spruch, Motor, Pferd und Oger-Brüllen beim Anklicken.
  - Flammenstrahl, Sperrfeuer-Abschüsse, Stacheldraht, Panne, Heldenfall.
  - Fehler nebenbei: Der zweite Feuerstoß des Turm-MG nahm das normale statt des schweren MG.
- **Hinweise, die bleiben (kein Fehler, im Test als „Hinweis“ gezählt):** Bei einigen Zeilen greift die Wahl nicht in jedem Fall, z. B. „Gebäude rammen: Aufprall“ beim Einsturz oder „Schlag auf die Panzerung“ im Gegenschlag. Liste: `node tools/test_tonplaetze.mjs`.
- **Nicht nachgestellt:** Sieg-Ruf, Kirchen-Einsturz mit Glocke, Kulisse von Sankt Ruß.

### 3. Deine Tonwahl vom 22.11.
- 139 Wahlen aus allen Exporten, **129 wirken im Spiel** (vorher gezählt 136).
- **7 lagen auf „Gewehrsalve“ bei Einheiten, die nie schießen:** Aschenpfleger, Signaltrupp, Sturmbrecher, Eingreiftrupp, Fernsprechtrupp, Melder, Feldscher. Sie bleiben im Pult gespeichert und im Export, klingen aber nicht.
- „Stollen sprengen“ beim Mineur ist nach „Gelände und Gebäude“ umgezogen, deine Wahl zieht mit.
- `mahlwerk.mgladen` aus dem Export hat seit dem 22.11. keine Zeile mehr; der Eintrag bleibt gespeichert.

### 4. Offen
- **Zwei Zeilen, ein Platz:** Bei 15 Stellen teilen sich zwei Zeilen einer Einheit denselben Tonplatz, dann gilt im Spiel eine Wahl für beide. Beispiele: Flammenstrahl und „Feld fängt Feuer“; Kanone und Breitseite beim Sturmpanzer; Kanone und Faustsalve beim Eisenknecht; drei Dampfstoß-Zeilen der Roten Faust; Ziehen und Sturmrollen-Anlauf beim Landkoloss.
- **Mischtöne in Ruf-Zeilen** (Stimmen) kann das Spiel nicht mischen; das Pult bietet sie dort nicht an.
- Lautstärke und Tonhöhe aus dem Pult wirken bei Flammenschleife, Motor beim Anklicken und Sperrfeuer-Abschüssen noch nicht, nur die Tonwahl.

### Fragen an Enrico
1. Die 7 Schuss-Wahlen bei Einheiten ohne Fernkampf (oben): War das nur, weil die Zeile da war, oder sollen diese Einheiten einen Schuss-Ton bekommen (dann bräuchten sie eine Regel dafür)?
2. „Zwei Zeilen, ein Platz“: Soll ich diesen 15 Stellen eigene Tonplätze geben, wie am 22.11. bei Marsch und Sperrfeuer?
3. `charge` (Gegenstoß) klingt nach Motor, die Quelle heißt „tiger-ii“. Bleibt er der Gegenstoß-Ruf, oder soll ein Stimm-Ruf dorthin?

## 2026-11-22 Abend – 21:00: Ton-Pult 2 zusammengeführt, Enricos Tonwahl im Spiel

Gepusht. Tests: `tonpult_test` 40/40, test_ton, Partietest Grauwall, test_kommentare – alle fehlerfrei.

### 1. Zusammenführen
- `origin/tonpult2` ist nach `main` gemergt (Merge-Commit), ohne Konflikte.
- `tonpult_bau.mjs` ist neu gelaufen; `tonpult_test.mjs` bestand nach dem Merge 40/40.
- Der Abschnitt aus Punkt 7 steht in `CLAUDE.md`.
- **Arbeitsordner `C:\Projekte\Armargeddon-ton`:**
  - Er ist sauber (nichts Ungesichertes), alles liegt in `main` auf GitHub, der Zweig `tonpult2` bleibt.
  - Das Entfernen hat meine Sicherheitsabfrage hier blockiert (Löschen eines Ordners).
  - Bitte selbst ausführen, wenn gewünscht: `git worktree remove C:\Projekte\Armargeddon-ton` (im Ordner `C:\Projekte\Armargeddon`).

### 2. Enricos Tonwahl (Export 20:52, 132 Einträge)
- Mit den älteren Exporten zusammengeführt sind es 139 Wahlen, der neueste Export gewinnt. **136 wirken im Spiel**, verteilt auf 51 Einheiten; 3 brauchen keinen Eintrag, weil sie dem Spielstandard entsprechen.
- **Vorher ausgelassen, jetzt übernommen:**
  - **„Aufgerieben“ (34 Einheiten, Sterbe-Rufe):** Diese Zeile hatte im Spiel gar keinen Ton.
    - Sie hat jetzt einen eigenen Spiel-Platz `aufgerieben`.
    - Er klingt, wenn ein Trupp aufgerieben wird; ohne Wahl bleibt es stumm wie bisher.
  - **„Schlag: Fäuste und Klingen“ (`punch`) bei Scharfschützen, Mahlwerk und Rauchwerfern:** Das ist ein Sammelname, kein Tonplatz. Er ist jetzt zulässig.
- Gewählte Töne, die bisher nur im Pult lagen, liegen jetzt auch im Spiel (`ton_teilen.mjs`); geprüft, alle 136 sind vorhanden.

### 3. Aus dem Ton-Bericht
- **Eigene Tonplätze statt Doppelbelegung:**

  | Zeile | Spiel-Platz |
  |---|---|
  | Marsch und Sturmlauf | `marsch_schritte` |
  | Einschläge Sperrfeuer | `sperr_boom` (Mörser, Minenwerfer) / `sperr_boomH` (schwere Geschütze) |
  | Sturmrollen: Aufprall | `aufprall_rollen` |
  | Gebäude rammen: Wucht | `aufprall_rammen` |
  | Bohrstoß: Wucht | `aufprall_bohr` |

  - Alle klingen ohne Wahl wie bisher. Im Pult hört man weiter denselben Ton, die Wahl ist aber getrennt.
  - Der Hinweis „Gilt im Spiel auch für“ verschwindet dort.
  - Die bisherige Wahl wird auf die Schwester-Zeile übertragen, wenn dort keine eigene steht: Beim Minenwerfer gilt die Sperrfeuer-Wahl so weiter auch für den Einzelschuss.
- **`tonKontext`:**
  - Jeder Eintrag weiß jetzt, ob er für den Handelnden gilt (Schuss, Treffer am Ziel, Nahkampf, Ziehen, Fähigkeiten) oder für den Getroffenen (Getroffen, Tod).
  - Die Wahl „Treffer am Ziel“ einer Einheit klingt nicht mehr, wenn sie selbst getroffen wird.
  - Umgekehrt klingt ihre Getroffen-Wahl nicht, wenn sie selbst schießt.
- **`alleKeys`:** Alle Schlüssel aus `src/sound.js` und `src/sound_pult.js` sind zulässig (auch `horn`, `tiger`, `gallop` …). Nichts geht mehr als „Ton fehlt“ verloren.
- `tonpult_test.mjs`: Eine Prüfung ist angepasst. Sie erwartete den Hinweis „gilt auch für“ bei Ziehen/Marsch; jetzt erwartet sie, dass er fehlt (eigener Platz).

### 4./5.
- Antworten notiert, nichts zu ändern.
- Weitere Exporte liegen künftig als `tonpult_export_<datum>_<uhrzeit>.json` im Postfach, der neueste gewinnt. Nach jedem neuen Export: `node tools/tonwahl_bau.mjs`, `node tools/ton_teilen.mjs`, build.

## 2026-11-22 Abend – Entscheidungen 20:50: Eis bricht ein, Spuren dunkler

Gepusht. Tests: test_regeln, test_belegung (alle Karten), test_kommentare, Partietest Krähenfurt – alle fehlerfrei. Bilder in `entwurf/probe/kraehenfurt_spuren/`.

### 1. Eis bricht ein
**Regel** (nur Winterkarten, Sim-Abschalter `NOEISBRUCH=1`):
- **Wer bricht es auf:**
  - Sprenggranaten schwerer Geschütze auf ein Eisfeld: Haubitze, Aschenwacht-Geschütz und Minenwerfer, nicht Feldkanone und Grabenmörser.
  - Der Feuerschlag.
  - Sperrfeuer auf ein Eisfeld zu 50 % (nur das Zielfeld).
- **Folge:** Das Feld wird für 2 Runden **Eisloch**, offenes Wasser und für alle unpassierbar.
- **Einheit auf dem Feld:**
  - Sie nimmt ca. 16–24 Stärke Schaden (P.EISBRUCH_DMG 2,0).
  - Danach rettet sie sich aufs nächste freie Ufer, bevorzugt zur eigenen Seite.
  - Ist kein Ufer frei, wird sie nur niedergehalten.
- **Zufrieren:** Zu Beginn der übernächsten Runde friert das Loch wieder zu; das Bild blendet in knapp 1 s aus.

**Anzeige:**
- Erst beim Abspielen: Krachen (`eis_bricht`), Splitter, Eisloch-Bild (Rand an das Eis angeglichen), Meldung „Das Eis bricht!“. Danach läuft die Einheit sichtbar ans Ufer.
- Beim Zufrieren: leises Knacken und „Eis friert zu“.
- Auf Eis liegt kein Schneetrichter mehr.
- Hinweise:
  - Der Geländehinweis zeigt auf Eis „▼ Eis kann brechen“, wenn der Gegner schwere Geschütze hat.
  - Die Gelände-Info, die auch im Regeln-Fenster steht, erklärt es.
  - Das Protokoll meldet Einbruch und Zufrieren.
- Bilder: `eisbruch.jpg` (Loch, Treffer −22, Grenadiere ans Ufer), `eiszu.jpg`.

**KI:**
- Schwere Geschütze beschießen Gegner auf dem Eis bevorzugt (`W_EISZIEL` 2,0).
- Fußtruppen meiden Eisfelder, die in Reichweite gegnerischer schwerer Geschütze liegen (`W_EIS` 0,8).
- Ein erster Versuch mit pauschalem Meiden (sobald der Gegner überhaupt schwere Artillerie hat) lähmte die angreifende Aschenwacht: Konkordat 61–66 %. Darum gilt das Meiden jetzt nur in Reichweite.

**Messung Krähenfurt** (Sieg Konkordat, 4 × 200, feste Aufstellung):

| Fassung | Sieg Konkordat | Runden Ø | Ausfälle Konkordat / Aschenwacht | Eisbrüche je Schlacht |
|---|---|---|---|---|
| ohne (`NOEISBRUCH=1`) | 51,0 % (50 / 45 / 53 / 56) | 14,2 | 43 % / 32–33 % | 0 |
| **mit (Standard)** | **52,8 % (50 / 52 / 52 / 57)** | 14,0 | 43 % / 32–33 % | 2,5 (davon ca. 70 % mit Einheit darauf) |
| pauschal meiden (verworfen) | 61,5 % | 14,2 | 44 % / 30 % | 2,6 |

### 2. Spuren dunkler
- Spuren sind jetzt dunkler (Helligkeit 0,62, Kontrast 1,35), etwas größer und doppelt gezeichnet, weil die Bilder halbdurchsichtig sind. Stapfen der Fußtruppen 0,75 statt 0,6.
- `vergleich_alt_oben_neu_unten.jpg`: in der Übersicht oben die alte, unten die neue Kettenspur. Nah bleiben sie unaufdringlich.

### 3. Atemwolken
- Unverändert.

