## 2026-11-25 – R1: Truppstärke 8 / 6 / 3, Feldlinien dezenter (Punkte 72, 73 R1) (`dac0dba`)

Gepusht, **index.html gebaut und eingecheckt.** Der PC ist mitten im Paket abgestürzt; der Code war vollständig erhalten, fehlende Bilder und Tests sind nachgeholt.

### Was geändert ist
- **Linieninfanterie** (Schützenkohorte, Grenadiere): 8 statt 10 Figuren. Im offenen Feld stehen sie **3-2-3 versetzt**: Die mittlere Reihe steht in den Lücken, die vordere und hintere Reihe sind leicht gegeneinander verschoben. Niemand ragt aus dem Feld.
- **Reiter:** wie bisher 6.
- **Spezialtrupps:** 3 statt 4 (einer hinten, zwei vorn). Trupps mit weniger Figuren, etwa Löwenoger mit 2, bleiben, wie sie sind.
- **Graben:** 8 Plätze je Feld, mit derselben Verteilung wie in U2/U2b.
- **Klone und Größenstreuung** bleiben.
- **Feldlinien dezenter:** Deckkraft 0,06 statt 0,09. Die Kanten liegen doppelt, sichtbar sind also etwa 0,12 statt 0,17.
- **Rückwege:** `window.STAERKE_ALT = true` (10 / 6 / 4) und `window.RASTER_ALT = true` (alte Linien).
- **Messung:** Die Figurenzahl ist reine Anzeige; Stärke und Schaden rechnen die Regeln nicht über Figuren. Deshalb gab es keinen sim-Lauf.

### Bilder (`entwurf/probe/r1/`, jeweils links vorher, rechts nachher)
- `vergleich_sanktruss_feld.jpg` (offenes Feld)
- `vergleich_grauwall_graben.jpg`
- `vergleich_grauwall_graben_weit.jpg`

### Tests
- test_kommentare bestanden.
- Partietest ohne Konsolenfehler.

### Nebenbei
`tools/u2_bilder.mjs` wartet jetzt vor jeder Aufnahme, bis das Bild aufgebaut ist; vorher war die Aufnahme von Sankt Ruß schwarz.

### Fragen an Enrico
Keine. Als Nächstes kommt G7a (Gräben eingegraben, Probe und Plan).

## 2026-11-25 – L1: Leistung (Punkt 71, Teil L1) (`9102fdc`)

Gepusht, **index.html gebaut und eingecheckt.** Keine Regeländerung.

### Was geändert ist
1. **Bremse 1 – Canvas-Filter:** Die Filter für hintere Reihe, graue (fertige) Einheiten, dunkle Felder und die Kettenfarbe der Fahrzeuge werden je Figurenbild einmal vorgerechnet und gemerkt (`filtBild`, wie `bwBild`). Der weiche Kettenschatten (vorher `blur` in jedem Bild) ist ein fertiges Bild je Fahrzeug.
2. **Bremse 3 – Kontaktschatten:** Fleck und Kern sind ein fertiges Bild je Bildwirkungs-Stufe, statt je Figur einen neuen Farbverlauf zu bauen. Ein Trupp-Zwischenbild für die Übersicht habe ich nicht gebaut; nach den Zahlen unten ist es nicht nötig.
3. **Ton:** `anBus` trennt einen Ton jetzt auch nach `pause()` vom Tonweg, z. B. Einzelschuss mit `dur` oder die Getümmel-Schleife. Beim nächsten `play()` hängt er ihn wieder an, damit Schleifen, die später weiterlaufen, nicht stumm werden.
- Rückweg und Vergleich: `window.LEISTUNG_ALT = true` (alles wie vorher in jedem Bild).

### Messung
- **Werkzeug:** `node tools/leistung_messen.mjs`, nach Fables Art: unsichtbarer Chrome, 1920 × 1080, Abstand zwischen zwei Bildern. Gemessen wurde je 5 s direkt nach dem Schlachtstart, alt und neu im selben Stand.
- **Ergebnis** (ms je Bild, Mittel / schlechteste 5 %):

| Ansicht | alt | neu |
|---|---|---|
| Grauwall, Zoom 1 | 6,9 / 11,2 | 5,8 / 5,7 |
| Grauwall, ganze Karte | 11,7 / **22,2** | 9,5 / **16,6** |
| Sankt Ruß, Zoom 1 | 6,0 / 11,0 | 5,7 / 5,7 |
| Sankt Ruß, ganze Karte | 10,0 / 16,6 | 8,2 / 11,2 |

- Das Ziel „ganze Karte, schlechteste 5 % deutlich unter 20 ms“ ist erreicht.
- Die alten Werte liegen etwas unter Fables Messung. Fable ließ den Profiler mitlaufen und hat in Runde 5 gemessen, ich direkt nach dem Start.
- Rohdaten: `entwurf/probe/leistung_l1/messung.json`.

### Vergleichsbild
- Bilder (`entwurf/probe/leistung_l1/`, jeweils links alt, rechts neu):
  - `vergleich_grauwall_ganz.jpg`, `vergleich_grauwall_nah.jpg`
  - `vergleich_sanktruss_ganz.jpg`, `vergleich_sanktruss_nah.jpg`
- Kein sichtbarer Unterschied: Im Mittel weichen die Bildpunkte um 1–3 Helligkeitsstufen ab, das kommt von Regen und Figurenbewegung. Unter 0,3 % der Bildpunkte weichen deutlich ab.

### Offener Punkt Sankt Ruß (erste Sekunden nach dem Start)
- Im unsichtbaren Chrome gemessen, Bilder je Sekunde in den ersten 10 s:
  - Sankt Ruß neu: **17**, dann 151–178;
  - Sankt Ruß alt: 106–128, ab Sekunde 7 rund 170;
  - Grauwall neu: 162–173 von Anfang an.
- Eine Zehn-Sekunden-Lücke wie bei Fable sehe ich nicht; nur die erste Sekunde ist langsam. In dieser Sekunde werden einmalig die Bildfassungen vorgerechnet und die Plastik-Karten der Gelände-Teile aufgebaut.
- Im sichtbaren Browser habe ich das nicht nachgestellt.

### Tests
- test_ton (keine Seitenfehler, alle Plätze belegt) bestanden.
- test_kommentare bestanden.
- Partietest ohne Konsolenfehler.

### Noch offen aus Punkt 71
Bremsen 2 und 4 kommen in G7b, Bremse 5 vor dem Teilen des Spiels. Den Haken an Punkt 71 setze ich deshalb erst dann.

### Fragen an Enrico
Keine. Als Nächstes kommt G7a (Gräben eingegraben, Probe und Plan).

## 2026-11-25 – G5b: Drahtgürtel aus gemalten Stücken (Punkt 69) (`c6d9357`)

Gepusht, **index.html gebaut und eingecheckt.** Es gibt keine Regeländerung und keinen sim-Lauf. Lage und Spanischer Reiter bleiben wie in G5.

### Schnitt
- Alle Stücke aus `ui-quelle/gelaende/neu_draht/` sind nach der Liste im LIESMICH dort geschnitten.
- Der automatische Bogenschnitt hat Stücke vermischt: Ein Ausschnitt enthielt zwei Teile, heiles und beschädigtes Querstück waren vertauscht. Deshalb gibt es in `gelaende_cut.py` die neue Schnittart `stueck`:
  - fester Ausschnitt je Teil;
  - nur das größte Teil, dazu lose Drahtreste, die höchstens 25 px entfernt liegen;
  - gemeinsamer Maßstab.
- Rosa Säume sind entfernt. Plastik-Karten sind gerechnet, die Teile eingebettet.
- Die unteren Stücke von `drahtguertel_b` sind wie empfohlen nicht dabei.

### Welches Stück wo
- **Gürtel nach Norden/Süden** (alle Gürtel auf Grauwall und Sankt Ruß): Das Tiefenstück läuft über das ganze Feld, die Felder schließen zu durchgehenden Gürteln aneinander.
- **Diagonal angrenzende Drahtfelder:** ein schräges Stück, gespiegelt je Richtung.
- **Ost–West:** Querstück, selten beschädigt.
- **An Gassen** (der Gürtel endet nach Norden oder Süden): Endstück mit loser Rolle.
- Selten liegt das kurze beschädigte Stück daneben.
- Unter dem Gürtel ist der Boden dunkler und zertrampelt.
- Der hingeworfene Draht fern von Gräben bleibt.
- Rückweg zum Code-Draht aus G5: `window.GUERTEL_ALT = true`.

### Bilder (`entwurf/probe/gelaende_g5b/`, jeweils links vorher = G5, rechts nachher)
- `vergleich_grauwall_nah.jpg`
- `vergleich_grauwall_ganz.jpg` (auch aus der Ferne klar als Drahtgürtel zu erkennen)
- `vergleich_sanktruss_nah.jpg`
- `vergleich_sanktruss_ganz.jpg`

### Tests
- test_draht und test_draht_bild bestanden („Bild = Regel“: jedes Drahtfeld zeigt Draht, kein anderes Feld).
- test_kommentare bestanden.
- Partietest ohne Konsolenfehler.

### Hinweis
- Steht eine Einheit auf oder hinter einem Drahtfeld, wird das hohe Tiefenstück halb durchsichtig, wie Häuser und Bäume.
- Ob das Tiefenstück bei steilerer Kamera (stark herausgezoomt) noch gut sitzt, zeigt das Ganz-Bild: Es passt.

### Fragen an Enrico
Keine. Als Nächstes kommt L1 (Leistung).

## 2026-11-25 – G5: Stacheldraht mit Plan (Punkt 65) (`81e86bd`)

Gepusht, **index.html gebaut und eingecheckt.**

### Bild
- Drahtfelder, die höchstens 3,6 R vor einem Graben liegen, bekommen 2–3 versetzte Pfahlreihen, parallel zur Linie der Grabenfelder. Feuergräben zählen dabei vor Lauf- und Sappengräben.
- Für die Pfähle nehme ich die gemalten Einzelpfähle `draht_pfahl_1–4`; sie sind wieder eingebettet.
- Zwischen den Pfählen ist der Draht im Code gespannt: drei Stränge mit leichtem Durchhang, darunter eine Drahtrolle aus unregelmäßigen Schlingen, dazu eine Schattenlinie am Boden.
- Die Reihen laufen bis an den Feldrand, damit benachbarte Drahtfelder einen durchgehenden Gürtel bilden.
- Gelegentlich liegt ein loses Drahtstück daneben. Auf Straßen bleibt eine Lücke.
- Fern von Gräben (Niemandsland) bleibt der Draht wie bisher hingeworfen.
- Die Gräben auf Sankt Ruß sind Zickzack-Gräben. Damit die Reihen dort nicht schräg stehen, folgen sie der Linie durch die Grabenfelder und nicht dem Zickzack.
- **Bild = Regel:** test_draht und test_draht_bild bestanden (jedes Drahtfeld zeigt Draht, kein anderes Feld).

### Lage
- **Grauwall:**
  - Der äußere Gürtel vor dem vorderen Aschenwacht-Graben läuft jetzt im Zickzack zwischen Spalte 4 und 5, mit Gassen in Zeile 2 und 7.
  - Auf der Landstraße bei (5,4) steht ein Spanischer Reiter (Barrikade) statt Draht.
  - Der innere Gürtel ein Feld vor dem Graben bleibt (Gassen in Zeile 4 und 8).
  - Der Gürtel vor dem hinteren Graben (Spalte 9) hat seine Gassen jetzt genau vor den drei Sensenwerken (10,0 / 11,4 / 10,7). Wer durch eine Gasse kommt, läuft ins MG-Feuer.
  - Die Zahl der Drahtfelder bleibt fast gleich: 20 plus 1 Spanischer Reiter statt 21.
- **Sankt Ruß:** Die Lage bleibt. Dort liegen schon zwei punktsymmetrische Gürtel ein Feld vor den Gräben, mit Gassen vor den MG-Feldern; nur das Bild ist neu.
- **Krähenfurt:** Dort liegt kein Draht.
- Rückweg für Bild und Lage: `DRAHT_ALT=1` (Simulation) bzw. `window.DRAHT_ALT = true` vor dem Schlachtstart.

### Messung (Grauwall, `sim.js 100`, gleicher Startwert)

| | Konkordat | Runden Ø | Ausfälle Konkordat / Aschenwacht |
|---|---|---|---|
| vorher | 48 % | 15,0 | 32 % / 42 % |
| nachher | **40 %** | 14,2 | 30 % / 36 % |

- Die Quote ändert sich um **8 Punkte**, genau an der Grenze. Wie gewünscht gleiche ich nichts aus; der Abgleich kommt in U9.
- Vermutlich wirkt am stärksten, dass die Gassen jetzt vor den MGs liegen: Sensenwerke verlieren 54 % statt 68 %, Grabenräumer fallen zu 94 % statt 46 %. Auch der Spanische Reiter auf der Straße könnte mitwirken.
- Bei 100 Schlachten liegt die Streuung bei etwa ±5 Punkten.
- Verluste je Typ: siehe Messausgabe, auffällig außerdem Haubitze 20 → 1 %, Flammenwerfer 74 → 38 %, Grabengeschütz 45 → 12 %.

### Bilder (`entwurf/probe/gelaende_g5/`, jeweils links vorher, rechts nachher)
- `vergleich_grauwall_ganz.jpg`
- `vergleich_grauwall_nah.jpg`
- `vergleich_sanktruss_ganz.jpg`
- `vergleich_sanktruss_nah.jpg`

### Tests
- test_regeln, test_draht, test_draht_bild und test_kommentare bestanden.
- Partietest ohne Konsolenfehler.

### Fragen an Enrico
1. Aus der Ferne sind die neuen Gürtel feine Reihen und unauffälliger als die alten Einzelstücke (`vergleich_grauwall_ganz.jpg`). Reicht das, oder sollen Pfähle und Draht kräftiger werden, zum Beispiel mit dickeren Schlingen oder mehr losen Drahtrollen?
2. Soll der Spanische Reiter auf der Landstraße bleiben? Er ist eine Barrikade, also Deckung, und Geschütze und Reiter kommen dort nicht durch.

## 2026-11-25 – U2b: Grabenplätze im Zickzack, Klone ohne Spiegeln (Punkt 67) (`2951635`)

Gepusht, **index.html gebaut und eingecheckt.** Es gibt keine Regeländerung, deshalb keinen sim-Lauf.

### Was sich geändert hat
- **Gräben, die in die Tiefe laufen:** Sie werden erkannt, wenn das Grabenstück des Felds mehr als 1,3-mal so tief wie breit ist. Dort bleiben alle 10 Plätze, verteilen sich aber gleichmäßig über die ganze Tiefe des Abschnitts. Die Figuren stehen abwechselnd an der linken und an der rechten Wand, jeweils am äußersten Grabenstück in dieser Tiefe; Knicke und Buchtenden werden mitbenutzt. Statt einer Warteschlange stehen jetzt zwei versetzte Reihen.
- **Waagerechte Gräben** bleiben wie in U2.
- **Klone:** Es wird nicht mehr gespiegelt. Größe, Neigung und Versatz bleiben.
- Rückweg für die Zickzack-Plätze: `window.ZICKZACK_ALT = true`.

### Bilder (`entwurf/probe/u2b/`, links vorher, rechts nachher)
- `vergleich_grauwall_graben.jpg`
- `vergleich_grauwall_graben_weit.jpg`

Im „Vorher“-Bild ist das Spiegeln schon aus; der Vergleich zeigt also nur die neuen Plätze.

### Tests
Partietest ohne Konsolenfehler.

### Fragen an Enrico
Keine. Als Nächstes kommt dein Leistungs-Check mit Fable, danach G5.

## 2026-11-25 – U2: Klone und Grabenplätze (Punkt 64) (`9bc0b5e`, vorher `29fbd6f`)

Gepusht, **index.html gebaut und eingecheckt.** Es gibt keine Regeländerung, deshalb keinen sim-Lauf. Der PC ist mitten im Paket abgestürzt; es ging nichts verloren, die Arbeit ist danach fertig gestellt.

### Zuerst: Restpunkte Grabenboden
1. **Pfützen:** Spiegelung und Glanzrand sind kräftiger, dazu ein zweiter schwacher Glanzbogen. Sie bleiben dunkel und glitzern nicht.
2. **Laufsteg:** Die Kacheln werden jetzt in Originalgröße aneinandergelegt und am Ende sauber abgeschnitten, nicht mehr gestreckt. Das Teil mit gebrochenen Latten (rost_2) liegt nicht mehr im Steg.
3. **Kaputtes Teil mit Loch:** Das war das Kram-Teil „Einsturz“ (eingestürzte Bretter). Es liegt nicht mehr in Durchgängen.
4. **Durchgang ohne Steg:** Das war in Wirklichkeit eine lange Feuerbucht (1,9 R), in der zufällig nur ein Rost lag. Lange Buchten bekommen jetzt einen Rost je etwa 0,6 R, mindestens einen.
- Bilder: `entwurf/probe/u2/boden_nah.jpg`, `boden_mittel.jpg`.

### Grabenplätze
- Jedes Grabenfeld auf einem Zinnengraben hat jetzt **10 Plätze**. Sie verteilen sich über das Stück des Grabens, das zu diesem Feld gehört.
- Feuerbuchten werden bevorzugt, Durchgänge etwas weniger, Knicke kaum.
- In der Bucht stehen die Figuren abwechselnd an der Feindwand und dahinter, im Durchgang abwechselnd links und rechts der Mitte.
- Trupps mit weniger Figuren verteilen sich gleichmäßig auf die Plätze.
- Die Tiefensortierung je Figur stimmt, keine Figur steht vor einer Wand, hinter der sie stehen müsste.
- Sankt Ruß hat noch die alte Grabenform und behält deshalb die bisherigen Plätze.
- Rückweg zu den Plätzen aus U1: `window.GRABENPLATZ_ALT = true`.

### Klone
- Jede Figur ist etwas anders: Größe ±6 %, leicht geneigt, leicht versetzt.
- Steht der Trupp in Ruhe, schaut etwa jede fünfte Figur zur anderen Seite. Beim Schießen und in jeder anderen Pose schauen wieder alle nach vorn.
- Ruheposen-Liste: Der Code nimmt weiter die vorhandenen Bilder. Sobald der Berater mehrere Ruheposen je Trupp malt, trage ich sie in `POSE_SETS` ein.
- Rückweg: `window.KLONE_ALT = true`.

### Bilder (`entwurf/probe/u2/`, jeweils links vorher, rechts nachher)
- `vergleich_grauwall_graben.jpg`
- `vergleich_grauwall_graben_weit.jpg`
- `vergleich_sanktruss_feld.jpg` (Klone im offenen Feld)

Erzeugt mit `node tools/u2_bilder.mjs`.

### Tests
- test_kommentare und test_draht bestanden.
- Partietest ohne Konsolenfehler.

### Nebenbei
In G4 und G4b hatten sich die Zeilenenden verstellt (ui.js, CLAUDE.md und BERICHT.md auf CRLF, gelaende_bau.js teils auf LF). Das ist zurückgestellt (`29fbd6f`), Inhalte sind unverändert.

### Fragen an Enrico
1. Zieht sich ein Graben lang in die Tiefe (Blick von vorn), stehen die Figuren dort zwangsläufig hintereinander und wirken gedrängt (oben in `vergleich_grauwall_graben.jpg`). Reicht das so, oder sollen in solchen Feldern weniger Figuren im Graben zu sehen sein?
2. Gefällt das Spiegeln jeder fünften Figur in Ruhe, oder lieber ganz ohne?

## 2026-11-25 – Gelände G4b: Grabentakt + Grabenboden (Punkt 63) (`77f45ba`)

Gepusht, **index.html gebaut und eingecheckt.** Es gibt keine Regeländerung, deshalb keinen sim-Lauf.

### Takt
- Jeder Graben hat jetzt seinen eigenen Takt. Vorher liefen alle Gräben im selben Takt, das war ein Hauptgrund für das Muster.
- Buchten sind 0,72–1,57 R lang, gelegentlich 1,75–2,2 R. Durchgänge sind 0,85–1,45 R lang, gelegentlich bis 1,9 R.
- Die Tiefe jeder Bucht schwankt um ±15 %.
- Alles ist zufällig, aber fest je Karte.
- `buchtenJeFeld` gibt jetzt jedem Feld eines Feuergrabens mindestens eine Bucht. Auf Grauwall sind es alle 29 von 29; vorher hatten mit dem neuen Takt einige Felder keine.

### Grabenboden
- **Durchgänge:** Hier liegt ein durchgehender Laufsteg von Ende zu Ende, die Latten quer zur Laufrichtung.
- **Buchten:** Hier liegen ein oder zwei einzelne Roste, sonst Schlamm.
- Die Roste sind schmaler als die Sohle (78 %), halten Abstand zu den Enden und sind kaum gedreht. Nichts ragt mehr in die Wände.
- Das Kram-Teil „Balken“ ist ganz raus, das war das schräge Brett in der Wand.
- Die Roste sind kräftiger (mehr Kontrast) und werfen einen eigenen kleinen Schatten.
- Die Pfützen sind jetzt im Code gezeichnet: dunkles Braungrau mit nassem Rand, schwacher Spiegelung und schmalem Glanzbogen, kein weißer Fleck mehr.
- Es gibt weniger Pfützen. Sie liegen nur in Buchten ohne Rost und gelegentlich an einem Knick, nie auf einem Rost.
- Rückweg zum Stand von G4: `window.G4B_ALT = true`.

### Bilder (`entwurf/probe/gelaende_g4b/`, jeweils links vorher, rechts nachher)
- `vergleich_ganz.jpg`: Aus der Ferne wirken die Gräben jetzt deutlich unregelmäßiger.
- `vergleich_nah.jpg`
- `vergleich_boden.jpg`: nur der Grabenboden, ganz nah.

### Tests
- test_kommentare und test_draht bestanden.
- Partietest ohne Konsolenfehler.
- Gelände-Probe ohne Seitenfehler, Aufbau Grauwall 583 ms.

### Fragen an Enrico
1. Die Pfützen sind jetzt eher unauffällig (dunkel, wenig Glanz). Sollen sie mehr glänzen?

## 2026-11-25 – Gelände G4: Zinnenverlauf + Acker (Punkt 61) (`3225c4d`)

Gepusht, **index.html gebaut und eingecheckt.**

### 1. Zinnenverlauf (nur Darstellung, Regeln und Grabenfelder gleich)
- Der Graben ist schmaler (0,6 R statt 0,85 R). Bucht und Durchgang liegen 0,9 R auseinander und überlappen nicht mehr. Dazwischen steht ein Erdblock (Querwand).
- Die Grabenkanten folgen dem Rechteckumriss mit scharfen Ecken (Versatz mit Gehrung). Vorher waren die Ecken abgeschrägt.
- Die Brustwehr steht nur vor den Buchten und knickt an deren Enden ein kurzes Stück (0,4 R) mit.
- Der Rückwall folgt der Rückseite und springt hinter den Durchgängen zurück.
- Roste und Pfützen sind passend zum schmalen Graben kleiner.
- `buchtenJeFeld` liefert weiter die Feuerbuchten je Grabenfeld (Grauwall: 23 Felder), damit ist U2 vorbereitet.
- Rückweg zum Stand von G2b: `window.ZINNEN_ALT = true`.

### 2. Knicke ohne Teile
An etwa 20 % der Knicke stehen weder Querwand noch Eckstück; die Auswahl ist fest je Karte. Auf Grauwall bleiben 8 von 45 Knicken leer. Der Unterstand fällt nie weg.

### 3. Feldart „Acker“ auf Krähenfurt
- Eigene Feldart `acker`, nur auf Krähenfurt (dort wird das Rasterzeichen `g` zum Acker).
- Die Regel ist dieselbe wie beim Garten: ×1,2 gegen Beschuss, Fahrzeuge und Geschütze zahlen 2 BP. Die Deckung heißt „Hecke/Feldrain ×1,2“; auf Sankt Ruß bleibt es „Gartenmauer“.
- Kurztext und Chronik wie vorgegeben, im Browser im Infofenster geprüft. Die Zeile `acker` steht in `entwurf/welt/gelaende_chroniken.md`.
- Das Bild bleibt gleich: Der Acker wird weiter mit den Acker-Teilen gezeichnet.
- Messung `MAP=winterdorf node tools/sim.js 100` mit gleichem Startwert, vorher und nachher: Konkordat je **52 %**. Die Änderung wirkt also nicht auf die Regeln. Die 59 % aus dem Bericht zu G2a/G3a waren ein Mittel über vier Startwerte. Der Abgleich folgt wie gewünscht in U9.

### Bilder (`entwurf/probe/gelaende_g4/`)
- `vergleich_ganz.jpg`: links vorher, rechts nachher, ganze Karte. Die Grabenränder springen jetzt sichtbar mit, das Band liest sich weniger wie eine Leiter. Ganz unregelmäßig wirkt es aus der Ferne aber noch nicht, weil sich Buchten und Durchgänge in festem Takt abwechseln.
- `vergleich_nah.jpg` sowie `grauwall_*_nah.jpg` / `_nah2.jpg`: nah sieht es jetzt aus wie ein echter Graben mit Querwänden.

### Tests
- test_kommentare, test_regeln, test_draht und test_belegung (20) bestanden.
- test_partie ohne Konsolenfehler.
- Gelände-Probe ohne Seitenfehler, Aufbau Grauwall 575 ms.

### Fragen an Enrico
1. Gefällt der Zinnenverlauf aus der Ferne, oder sollen die Längen von Bucht und Durchgang stärker schwanken? Dann wäre der Takt unregelmäßiger, etwa 15 Minuten Arbeit.
2. Kann U2 als Nächstes kommen? Die Grabenplätze würden an den neuen, weiter vorn liegenden Buchten sitzen.

## 2026-11-25 – Gelände G2b + G3b: gemalte Teile eingebaut (Punkte 59, 60) (`024c127`)

Gepusht, **index.html gebaut und eingecheckt.** Alle 14 Teile aus `neu_g/` sind geschnitten, mit Plastizität versehen und im Spiel. Es gibt keine Regeländerung, deshalb kein sim-Lauf; Krähenfurt gleiche ich wie gewünscht erst in U9 ab.

### Was eingebaut ist
- **Querwände (G-1)** stehen an jedem Knick auf der Feindseite: der Erdblock vor dem Durchgang zeigt seine Front in die Bucht. Gezeigt wird nur, was zum Betrachter schaut.
- **Eckstücke (G-4)** passen tatsächlich als Stirnseiten. Sie stehen an den Knicken auf der Rückseite (Block hinter der Bucht). Echte Innenecken habe ich nicht gebraucht.
- **Unterstand (G-8):** einmal je Feuergraben anstelle eines Eckstücks. Das kleine Holzstück davor bleibt dran.
- **Brustwehr (G-2)** als Sandsackreihe auf der Feindseite, **Rückwall (G-3)** als gemalter Erdwall hinter der Linie.
- **Sohle:** Über dem durchgehenden Mittelrost liegt jetzt ein Schlammband. Darauf liegen einzelne Lattenroste (G-5) und Pfützen (G-6); die Knicke bleiben Schlamm, sonst sah es wieder nach Leitersprossen aus.
- **Ausstattung:**
  - in den Buchten Leitern (G-7), Stahlschilde (G-9) und Drahtrollen;
  - in den Durchgängen Kisten, Kanister, Eimer, Spaten, Einsturz und Balken (G-10);
  - nie zweimal dasselbe Teil hintereinander.
- **Krähenfurt:**
  - Hecke aus beiden Streifen (F-3), nur die unteren Streifen des Bogens, je Acker gemischt.
  - Heuhaufen in 5 Fassungen (F-4, der Pilz ist aussortiert).
  - Vogelscheuche (F-5).
  - Pflug (F-6) mit seinem Schneefleck; der fügt sich in den Schnee ein und bleibt.
- **Punkt 60:** Auf Krähenfurt heißt die Deckung „Hecke/Feldrain ×1,2“, auf Sankt Ruß weiter „Gartenmauer“. Die Regel ist unverändert.
- **Rückweg:** `window.GTEILE_ALT = true` holt den Stand von G2a/G3a zurück. Test: `__dbg.gbTeile()` (65 Stirnseiten auf Grauwall).

### Bilder (`entwurf/probe/gelaende_g2b/`)
- Grauwall nah: `grauwall_vorher_nah.jpg` / `grauwall_nachher_nah.jpg`, zweiter Ausschnitt Westgraben `…_nah2.jpg`.
- Grauwall ganz: `grauwall_vorher_ganz.jpg` / `grauwall_nachher_ganz.jpg`.
- Krähenfurt: `winterdorf_vorher_nah.jpg` / `winterdorf_nachher_nah.jpg` und `…_ganz.jpg`.
- Probe tiefere Buchten: `vergleich_zinnen_ganz.jpg`.

### Einschätzung „Leiter“ und zinnenförmiger Verlauf (Punkt 60)
- **Nah** wirkt der Graben jetzt deutlich wie ein Schützengraben, mit Querwänden, Unterständen, Kram und Schlamm.
- **Aus der Ferne** liest sich jeder Feuergraben noch als gerades Band mit regelmäßigen Sprossen.
  - Ursache: Bucht und Durchgang liegen nur 0,6 R auseinander, der Graben ist aber 0,84 R breit, die beiden Streifen überlappen also. Dazu laufen Brustwehr und Rückwall gerade durch und bilden die Außenkanten des Bandes.
  - Tiefere Buchten allein helfen nicht, das Band wird nur breiter (`vergleich_zinnen_ganz.jpg`, rechts).
- **Echter Zinnenverlauf** (Buchten wirklich nach vorn versetzt, Brustwehr knickt mit):
  - Aufwand etwa ein halbes Paket, nur Darstellung:
    - die Grabenkanten folgen dem Rechteckumriss statt der versetzten Mittellinie;
    - die Brustwehr läuft nur vor den Buchten und knickt mit;
    - der Rückwall springt hinter den Durchgängen zurück;
    - der Graben selbst wird schmaler (etwa 0,6 R statt 0,84 R).
  - Regeln und Grabenfelder bleiben gleich. Die Feuerbuchten für U2 liefert GBau weiter (`buchtenJeFeld`).
  - Am besten vor U2 entscheiden, weil die 10 Grabenplätze an den Buchten hängen.

### Tests
- test_kommentare, test_regeln, test_draht, test_belegung: in Ordnung.
- Partietest: Konsole frei, keine Fehler.

### Fragen an Enrico
1. Gefällt dir der Graben nah (`grauwall_nachher_nah.jpg`)? Soll ich danach den echten Zinnenverlauf bauen (etwa ein halbes Paket, vor U2), oder reicht der jetzige Stand?
2. Querwände und Eckstücke erscheinen sehr regelmäßig, an jedem Knick. Soll ich an manchen Knicken eins weglassen (z. B. 20 %), damit es weniger gleichförmig wirkt?
3. Auf Krähenfurt heißt das Feld im Infofenster weiter „Garten“ (mit dem Text „Niedrige Gartenmauern“). Soll es dort „Acker“ heißen, mit eigenem Text und Chronik?

## 2026-11-25 – Gelände G2a + G3a: Gräben als Linien, Acker A (Punkt 58) (`5c1ea2c`)

Gepusht, **index.html gebaut und eingecheckt.** Alles, was ohne neue Bilder geht, ist eingebaut. Ich warte jetzt auf die gemalten Teile vom Berater; **U2 kommt erst, wenn die Grabenform mit den gemalten Teilen steht.**

### Gräben Grauwall (G2a)
- **Form:** Feuergräben mit Feuerbuchten und Querwänden (eckig, Länge und Tiefe mit Zufall), dazu Rückwall und Pfützen. Bis G-1…G-10 geliefert sind, stehen die heutigen Teile als Ersatz.
- **Gräben als Linien** in `MAP.graeben` (engine.js): `feuer`, `lauf`, `sappe`. Die Grabenfelder der Regeln sind genau die Felder der Linien (Bild = Regel).
- **Grauwall:**
  - Feuergräben in Spalte 2, 7 und 10; **Graben 10 endet im Norden**.
  - Je 2 Laufgräben: Konkordat aus dem Hinterland, Aschenwacht zwischen ihren Linien.
  - 1 Sappe der Aschenwacht nach vorn.
- **Feuerbuchten für U2:** Der Gelände-Aufbau gibt sie je Grabenfeld zurück (`buchtenJeFeld`, Test `__dbg.buchten()`).
- **Rückweg:** `GRAEBEN_ALT=1` bzw. `window.GRAEBEN_ALT = true`.

### Balance Grauwall
**Sehr empfindlich.** Mein erster Entwurf (Graben 10 endet im Süden, 2 Sappen) fiel auf **23 %** für das Konkordat. Die Varianten (je 4 × 100 oder 2 × 100):

| Variante | Konkordat |
|---|---|
| ohne Laufgräben/Sappe der Aschenwacht, Graben 10 durchgehend | 44 % |
| alles, Graben 10 durchgehend | 39 % |
| Graben 10 endet im Norden, mit Konkordat-Sappe | 63 % |
| Graben 10 endet im Norden, **ohne Konkordat-Sappe** | **47 %** |

**Gewählt** ist die letzte Variante. **Endmessung 4 × 200: 45 / 48 / 52 / 47 → 48,0 %** (vorher 46,5 %), Runden Ø 15,0, Ausfälle Konkordat 32 %, Aschenwacht 43 %.

### Felder Krähenfurt (G3a)
- **Acker A** ist Standard; jeder zusammenhängende Acker hat seine eigene Furchenrichtung (±25°).
- **Hecken** an etwa 40 % der Ackerränder, bis `hecke_schnee` kommt mit dem Unterholz als Ersatzbild.
  - **Deckung:** Die Äcker sind schon Feldart Garten (×1,2 gegen Beschuss), die Hecke steht an deren Rand. Damit gibt es keine neue Regel, und die Messung bleibt gleich.
  - Hinweis: In der Vorschau steht dafür heute „Gartenmauer ×1,2“. Auf Krähenfurt könnte das „Hecke/Feldrain“ heißen, wenn du willst.
- **Heuhaufen, Vogelscheuche, Pflug** sind als Platzhalter eingebaut und erscheinen, sobald die Bilder da sind. Noch nicht gelieferte Bilder lädt das Spiel gar nicht erst.
- **Rückweg:** `window.ACKER_C2 = true` (Acker vom 24.11.).
- **Messung Krähenfurt 4 × 200:** 52 / 59 / 64 / 61 → **59 %**. Das ist genau wie der eingefrorene alte Stand (keine Regeländerung). Es liegt aber über dem Abgleich vom 22.11. (52,9 %); die Verschiebung stammt aus den Regelpaketen seitdem (D–F), nicht aus G3a.

### Bilder (`entwurf/probe/gelaende_g2/`)
- `g2_grauwall_nah.jpg`: Aschenwacht- und Konkordat-Seite, vorher/nachher.
- `g2_g3_ganz.jpg`: beide Karten ganz, vorher/nachher.
- `g3_kraehenfurt_nah.jpg`: Acker vorher/nachher.
- Neu erzeugen: `G2=1 node tools/gelaende_probe.mjs`.

### Tests
- `test_regeln`, `test_belegung`, `test_kommentare` ok; Partietest rot-frei.
- **`test_draht` angepasst:** Die Prüfung „Minenwerfer räumt Draht“ hing an der Startlage. Seit F38 darf die Sprenggranate nicht auf leeren Draht schießen, und mit dem neuen Raster war das Zielfeld leer. Jetzt stellt der Test einen Gegner hinein. Alle Prüfungen bestanden.

### Fragen an Enrico
- Krähenfurt liegt bei 59 % für das Konkordat, seit den Regelpaketen D–F. Jetzt abgleichen oder erst in U9 (Karten abgleichen nach dem Umbau)? Mein Vorschlag: U9.
- Soll die Deckungsanzeige auf Krähenfurt „Hecke/Feldrain“ statt „Gartenmauer“ heißen?

## 2026-11-25 – Gelände-Paket G1: Probe und Plan (Punkte 56/57)

Gepusht. **Nur Probe und Plan, nichts fest eingebaut.** Die Probe-Schalter sind im Code, aber nur aktiv mit `window.GB_PROBE` bzw. `__dbg.gbProbe({...})`. Ohne den Schalter sieht das Spiel aus wie vorher; der Partietest ist ok. Plan und Bausteinliste: **`entwurf/GELAENDE_G_PLAN.md`**.

### Bilder (`entwurf/probe/gelaende_g1/`)
- `vergleich_graeben_nah.jpg`, `vergleich_graeben_ganz.jpg`: vorher, V1, V2, V3.
- `vergleich_acker_nah.jpg`, `vergleich_acker_ganz.jpg`: vorher, A, B, A auf der ganzen Karte.
- Neu erzeugen: `node tools/gelaende_probe.mjs` (Einheiten ausgeblendet; `NUR_K=`, `NUR_V=`).

### Gräben Grauwall
- **Ursache der „Schlangen“:** ein geglättetes Dreiecks-Zickzack, überall dieselbe Wand und Sohle, drei Parallelen aus den Rasterketten.
- **V1** (Feuerbuchten + Querwände): Die Mittellinie ist eine Rechteck-Welle (Feuerbucht 0,6 R zur Feindseite vorgezogen, dazwischen Durchgang hinter einer Querwand), ungeglättet, mit schmalerer Sohle. Der Graben wirkt **eckig und gebrochen**.
- **V2:** dazu ein niedriger Erdwall auf der Rückseite und Schlammpfützen.
- **V3:** dazu ein Verbindungsgraben, eine Sappe und ein Graben, der vor dem Rand endet. Das zeigt eine Grenze: Über Rasterfelder werden Verbindungsgräben zum „X“. **Plan:** Gräben als eigene Linien je Karte (`MAP.graeben` mit Feuer-, Lauf- und Sappen-Linien), die Grabenfelder der Regeln werden daraus abgeleitet (Bild = Regel). Danach Balance messen.
- **Was fehlt, sind Bilder:** Querwände, Ecken und Brustwehr nutzen heute alle dasselbe Wandstück. Das wiederholt sich und wirkt an den Ecken wie Stückwerk. Deshalb gibt es eine **Liste mit 10 Grabenteilen** zum Malen (Querwand, Brustwehr, Rückwall, Ecken, Lattenrost-Stücke, Pfützen, Leiter, Unterstand, Stahlschild, Kleinkram).
- **10 Grabenplätze (U2):** Die Figuren sollen in den Feuerbuchten auf der Schützenstufe stehen (2–3 je Bucht).

### Felder Krähenfurt
- **Ursache:** eine gekachelte Furchen-Textur mit 62 % Deckkraft, also gleichmäßige graue Streifen.
- **Acker A (Empfehlung):** Furchen im Code gezeichnet, je Furche eine dunkle Erdrinne und darüber ein heller Schneekamm. Unregelmäßig in Abstand, Breite, Helligkeit, Krümmung und Lücken; leichter Erdton; Feldrain als weiche Schneewehe. Das liest sich als gepflügter Acker unter Schnee.
- **Acker B:** wie A, kräftiger. Wirkt eher wie aufgetauter Boden.
- **Mehr Leben:** Hecke, Heuhaufen, Vogelscheuche, Pflug, Feldweg mit Wagenspuren. Dafür 6 Teile auf der Malliste, davon 2 nur bei Bedarf (gemalter Acker, Feldrain).

### Fragen an Enrico
Stehen auch am Ende von `GELAENDE_G_PLAN.md`:
1. Gräben in Richtung V2, mit gemalten Teilen?
2. Lauf- und Sappengräben als eigene Linien je Karte – das ändert das Raster von Grauwall, die Balance messe ich neu?
3. Acker A oder B?
4. Hecke mit Deckung ×1,2, Heuhaufen ohne?
5. Gemalter Acker (F-1) nötig oder reicht der Code-Acker?

## 2026-11-25 – Umbau U1: Maßstab E1 im Spiel (`efeeb18`)

Gepusht, **index.html gebaut und eingecheckt.** U1 ist fertig. **Hier halte ich an:** Als Nächstes kommt das Gelände-Paket G (Berater mit Enrico).

### Was jetzt im Spiel ist
- **Größen:**
  - Soldaten, Reiter (Pferd samt Reiter), Helden, Anführer, MG und Geschütze (auch das Gespann): ×0,65, Soldat damit 0,52 Feldradien.
  - Landkoloss, Sturmpanzer, Bohrkoloss und alle Schreiter: ×0,85.
  - Der Fesselballon bleibt unverändert.
- **Figurenzahl:** Schützenkohorte und Grenadiere 10 Figuren, Reiter 6, Spezialtrupps wie bisher. Bei 10 Figuren fällt je 10 % Stärke eine Figur weg; das macht der vorhandene Code von selbst.
- **Aufstellung:** zwei lockere Reihen, so breit wie in der Probe E1. Kein Modell ragt ins Nachbarfeld.
- **Graben:** Grabenplätze gibt es bisher nur für 4 Figuren. Bis U2 verteilt das Spiel größere Trupps gleichmäßig entlang der Grabenlinie, abwechselnd quer versetzt. Das ist noch dicht; die richtigen 10 Grabenplätze kommen in U2, nach dem Gelände-Paket.
- **Absenken:** Im Graben und beim Eingraben sinken die Figuren im neuen Maßstab entsprechend weniger tief ein.
- **Posen-Versatz:** 25 ms je Figur statt 60, sonst dauert eine Salve von 10 Figuren 0,6 s.
- **Rückweg:** `window.MASSSTAB_ALT = true` in der Konsole oder `__dbg.massstab(0)`, zurück mit `__dbg.massstab(1)`. Der Git-Tag `vor-umbau` bleibt ebenfalls.

### Bilder
- `entwurf/probe/massstab/u1_vorher_nachher.jpg`: Grauwall und Krähenfurt, oben vorher, unten U1. Gleiche Gruppe und Kamera wie die Proben.
- Einzeln: `grauwall_U1_nah.jpg`, `winterdorf_U1_nah.jpg`, `*_U1_ganz.jpg`.
- Das Probe-Werkzeug kennt jetzt die Variante `U1` (Spiel ohne Haken); die alten Varianten rechnet es vom alten Maßstab aus (`MASSSTAB_ALT`).

### Tests
- Partietest: alle 19 Kartenprüfungen ok, Konsole rot-frei. Geprüft wurden auch 1280, 2560 und Vollbild.
- `test_kommentare` ok.
- Zeichenzeit unverändert: Grauwall Median 5,9–6,0 ms, Krähenfurt 5,6 ms je Bild.

### Noch nicht in U1 (wie geplant)
- **U2:** Klone (10 gleiche Schützen in Ruhe).
- **U3:** Mündungsfeuer bei 10 Figuren (heute blitzt jede Figur), Treffer-Spritzer, Nahzoom, Klickflächen.

### Fragen an Enrico
- Keine. Bitte einmal im Spiel ansehen: Wirken Reiter und Geschütze im neuen Maßstab richtig?

## 2026-11-25 – Umbau U0: Rückweg gesetzt (Punkt 55)

Gepusht. **U0 ist fertig**, als Nächstes kommt **U1 Maßstab** (eigener `pa`), danach halte ich für das Gelände-Paket G an.

- **Git-Tag `vor-umbau`** zeigt auf `7240128` (Bauplan Fassung 2, letzter Stand vor dem ersten Umbau-Commit). Er ist auf GitHub gepusht.
  - Ansehen ohne etwas zu ändern: `git checkout vor-umbau`, zurück mit `git checkout main`.
  - Eine einzelne Datei zurückholen: `git checkout vor-umbau -- src/ui.js`.
- **Bauplan:** Abschnitt 12 ist jetzt „beantwortet“ (deine sechs Antworten mit Paketzuordnung). Neu ist Abschnitt 13 „Stand der Pakete“.
- Das Probe-Werkzeug `tools/massstab_bilder.mjs` bleibt als Vergleich (A–E, E1f90/E1f85).

### Fragen an Enrico
- Keine.

## 2026-11-25 – Paket BP2: Bauplan überarbeitet (Punkte 52–54), nur Plan

Gepusht. **Nichts gebaut.** Datei: **`entwurf/BAUPLAN_UMBAU.md`** (Fassung 2). U0 erst nach eurer Freigabe.

### Was sich geändert hat
- **Antworten eingetragen (52):**
  - Liegende Modelle verblassen, abschaltbar.
  - Schlachtlänge 12/18/24 Runden, je Karte anpassbar.
  - Halten 2 Runden.
  - Schalter bis nach dem Spieltest.
  - Reihenfolge Mittelweg: **U0 → U1 → G (Gelände-Paket des Beraters) → U2 → U5 → U3 → U4 → U6 → U7 → U8 → S (Scharfschützen allein) → U9.** U3 stimmt Spritzer und Mündungsfeuer auf die fallenden Modelle ab.
- **Ordner je Fraktion (53)** stehen in U4: zuerst umziehen, dann die neuen Bögen. Prüfung: `figs.js` vorher und nachher gleich, Partietest ok. Punkt 53 bleibt im Auftrag offen, weil er erst in U4 gebaut wird.
- **Fremde Prüfungen (54)** als neue Abschnitte 7–11:
  - **Begriffe:** Hauptaktion, Hauptangriff, Mehrfach-Angriff, Zusatzwaffe, Reaktion, kostenlose Fähigkeit, Befehl. Dazu, wie Breitseite, Dauerfeuer, Faustsalve, Seiten-MG, Sturmrollen, Generalangriff, Feuerbereitschaft und Sperrfeuer heute zählen, und eine Kampfprognose vor dem Angriff.
  - **Feuerkraft:** weich statt in harten Stufen; in U5 werden zwei Fassungen gemessen.
  - **Pannen:** 1 Runde, schwere Panne 2.
  - **Nachschub-Schneeball:** messen; Vorschlag Abschuss 10–15 und kein Nachschub auf umkämpften Zielfeldern.
  - **Halten der Zielfelder:** Ein umkämpftes Feld hält den Zähler an, ein Besitzerwechsel setzt ihn zurück.
  - **Risiko-Anzeige** für Freischlag, Entsetzenschance, Panne/Festfahren.
  - **Zwischenmessungen** nach U5, U7 und U8 mit Siegart, Nachschub-Verlauf und gespiegelten Läufen; nicht unter etwa 7 Punkten feilen.
  - **Preise in U9:** nur ändern, wo die Messung es trägt.
- **Antworten aus dem Code (54.8):**
  - **Relais:** Abklingzeit −1, die Grenze bleibt 3 Befehle; die Befehle kommen also schneller, aber nicht häufiger.
  - **Zusammenbruch:** gezählt wird die aktuelle Armee mit Verstärkungen; 0,55/0,64 sind Abgleichwerte. Vorschlag: gleiche Schwelle, ausgleichen über Armeen.
  - **MG:** darf im selben Zug aufbauen und schießen (das Aufbauen kostet BP, keine Aktion).
  - **Ziehen nach dem Schuss:** ja, mit klaren Ausnahmen (Nahkampf, Minenwerfer, aufgebautes MG, „alle BP“-Aktionen).
  - **Entsetzenstest:** heute bei jedem Treffer; Vorschlag höchstens einmal je Runde.

### Fragen an Enrico
Stehen am Ende des Bauplans (Abschnitt 12):
1. Feuerkraft als weiche Kurve oder an Waffenträger gekoppelt?
2. Gleiche Zusammenbruch-Schwelle für beide Seiten?
3. Umkämpftes Zielfeld: anhalten oder zurücksetzen?
4. Pannen 1/2 Runden?
5. Kein Nachschub auf umkämpften Zielfeldern?

## 2026-11-24 – Bauplan großer Umbau (Punkt 51 + Bauplan), nur Plan

Gepusht. **Nichts gebaut.** Datei: **`entwurf/BAUPLAN_UMBAU.md`**.

### Kurzfassung
- **Feste Entscheidungen:**
  - Maßstab E1: 10 / 6 / 4 Figuren, Soldat 0,52 Feldradien.
  - MG, Geschütze, Reiter und Helden ×0,65; Fahrzeuge und alle Schreiter ×0,85 (Punkt 51).
  - Klone zuerst im Code, Ruheposen als Liste vorbereitet.
  - 10 Grabenplätze.
  - Ringe, Balken und Marken bleiben gleich groß.
  - Stimmen klonen erst später.
- **Liste „skaliert von selbst / muss nachgezogen werden“** mit Aufwand S/M/L.
  - Von selbst: Mündungen, Trefferpunkt, Kopfzeichen, Schadenszahlen, Leuchtspuren, Schatten, Figurenzahl je Stärke.
  - Nachziehen: Figurenfaktor für Modelle mit Tiefe, Plätze 10/6/4, Klone, Graben, Absenken, figurennahe Effekte (Mündungsfeuer, Spritzer, Blut), Posen-Versatz, Nahzoom, Klickflächen.
  - Leistung: kein Grafikumbau nötig.
- **Etappe 4:**
  - Schaden über Modelle: Splitter, Deckung stärker, Modelle fallen sichtbar; dazu Punkt 43 und 44.
  - Mehr Blut, abschaltbar.
  - Moral in Stufen wie Radious, mit Punkt 45b (Entsetzenstest).
  - Schlachtende aus Zusammenbruch, Halten über Zeit und Rundengrenze nach Größe.
- **Modelle:** Löwenoger neu3 (3 oder 4 Modelle, Probebild), dazu die abgenommenen Bögen aus MODELL_LISTE.
- **Pakete U0–U9** in dieser Reihenfolge:
  - Tag `vor-umbau`;
  - Maßstab;
  - Klone/Graben;
  - Effekte;
  - neue Bögen;
  - Schaden über Modelle;
  - Blut;
  - Moral;
  - Schlachtende;
  - Karten abgleichen.

  Jedes Paket hat einen Rückweg-Schalter. Zwischendurch messe ich nur grob (sim 100 Schlachten), der genaue Abgleich aller drei Karten kommt einmal am Ende (U9).

### Fragen an Enrico
Stehen gesammelt am Ende von `BAUPLAN_UMBAU.md`:
1. Löwenoger 3 oder 4 Modelle?
2. Gefallene Modelle liegen lassen oder ausblenden?
3. Schlachtlänge 12/18/24 Runden?
4. Halten über 2 oder 3 Runden?
5. Wie lange bleiben die Rückweg-Schalter?
6. Erst Sichtbares, dann Regeln – passt die Reihenfolge?

## 2026-11-24 – Paket F2: Nachträge vor dem Bauplan, Punkt 50 (`faf0f64`, Aufräumen `145240f`, `1acad4f`)

Gepusht, **index.html gebaut und eingecheckt.** Paket F2 ist abgeschlossen. Als Nächstes kommt der Bauplan für den großen Umbau (eigenes `pa`, Maßstab E1).

### (a) Maßstab E1
Ist als Ziel-Maßstab für den Bauplan vermerkt.

### (b) Fahrzeuge und Schreiter kleiner – Probe
- **Bilder:** `entwurf/probe/massstab/vergleich_E1_fahrzeuge_grauwall_nah.jpg` und `vergleich_E1_fahrzeuge_winterdorf_nah.jpg`, jeweils E1 heute, ×0,9 und ×0,85. Einzelbilder: `grauwall_E1f90_nah.jpg`, `grauwall_E1f85_nah.jpg`, dasselbe für winterdorf. Gleiche Gruppe und Kamera wie A–E.
- **Was schrumpft mit:** alle Kettenfahrzeuge (Landkoloss, Sturmpanzer, Bohrkoloss) und alle Schreiter, auch Kreuzschreiter und Eisenknecht.
- **Feldgrenzen:** Kein Fahrzeug ragt ins Nachbarfeld. Schon heute begrenzt `FIGW_VEH` die Breite.
- **Empfehlung: ×0,85.** Der Kreuzschreiter bleibt das größte Modell, erdrückt aber die Nachbarfelder nicht mehr. Der Panzer wirkt weiter klar schwerer als ein Trupp. Bei ×0,9 ist der Schreiter noch etwa so breit wie zwei Trupps.
- Kosten: keine (Zeichenzeit 5,6–6,2 ms je Bild).

### (c) Schadenszahlen Aschenwacht kräftiger
- **Neu bei Aschenwacht:**
  - heller Knochenweiß-Kern (oben fast weiß);
  - Feldgrau nur im unteren Drittel als Verlauf zum Rand;
  - dickere dunkle Kontur;
  - **derselbe helle Stempelrand und Schatten wie bei den roten Zahlen.**
- **Blaue Legion** ist genauso aufgebaut: heller Kern, Horizontblau zum Rand. Gegengeprüft, gut lesbar.
- **Bild:** `entwurf/probe/schadenszahlen/vorher_nachher.jpg`, oben vorher, unten nachher, jeweils Schlamm und Schnee bei 2560 px. Unten zeigt −26 am Panzer die Blaue-Legion-Optik. Beide Seiten sind jetzt gleich gut lesbar; −18 und −42 fallen auf Schnee nicht mehr ab.

### Nebenbei
Der Kommentar-Test meldete eine Zeile im Probe-Werkzeug. Code war nicht verschluckt; der Test hielt nur Gleichheitszeichen im Kommentartext für Code. Ich habe die Zeile umformuliert, der Test ist wieder ohne Meldung.

### Fragen an Enrico
- Fahrzeuge und Schreiter **×0,85** (Empfehlung) oder ×0,9?

## 2026-11-24 – Paket F, Teil 4 und Abschluss: Punkte 48, 17, 49 (`dceec61`, `d36fccf`)

Gepusht, **index.html gebaut und eingecheckt – Paket F ist abgeschlossen.** Als Nächstes kommt der Bauplan für den großen Umbau (eigenes `pa`).

### Punkt 48 – Antworten
In `STIMMEN_FEHLEN.md` geändert: Aschenwacht beim Koloss „Panzer!“ statt „Stahl kommt!“, bei der Granate „Handgranate!“ statt „Wurf!“. Die übrigen Antworten (Maßstab noch offen, Klone zuerst im Code, Helden schrumpfen mit, 10 Grabenplätze, Stimmen klonen später) nehme ich in den Bauplan auf.

### Punkt 17 – Schadenszahlen im Spielstil
- **Neu:** Die Zahl über einer getroffenen Einheit trägt die Farbe der **getroffenen Seite**:
  - **Konkordat:** Ochsenblut-Verlauf mit hellem Stempelrand, weil Rot auf dunklem Schlamm sonst untergeht (STYLE.md);
  - **Aschenwacht:** Knochenweiß bis Feldgrau;
  - **Blaue Legion:** Horizontblau.
- **Gestaltung:**
  - Schrift weiter „Arm Ziffer“;
  - rauer Stempel-Look mit ausgestanzter Körnung und 2–3 Kratzern, für jede Zahl immer gleich;
  - dicke dunkle Kontur und Schatten;
  - kurzes Aufploppen;
  - schwere Treffer (ab 30) etwas größer.
- **Technik:** Jede Zahl wird einmal je Text, Seite und Größe vorgezeichnet (`SCHADEN_BILD`), das kostet beim Zeichnen nichts. Mit `window.SCHADEN_ALT = true` kommen die alten Farben nach Schadenshöhe zurück.
- **Kritische Treffer** gibt es in den Regeln nicht. „Krit!“ (gold, neben der Zahl) ist nur vorbereitet und erscheint, sobald ein Treffer-Ereignis `krit: true` trägt.
- **Bilder** in `entwurf/probe/schadenszahlen/`:
  - `grauwall_1280.jpg`, `grauwall_2560.jpg` (Schlamm, dunkel);
  - `winterdorf_1280.jpg`, `winterdorf_2560.jpg` (Schnee, hell);
  - Übersicht mit Vergrößerung: `uebersicht.jpg`.
  - Gezeigt werden je 2 Treffer auf Konkordat (−6, −34 mit „Krit!“) und Aschenwacht (−18, −42). Auf beiden Böden gut lesbar. Die Aschenwacht-Zahlen sind auf Schnee etwas weniger auffällig als die roten, aber klar lesbar.
- Test-Hilfe: `__dbg.schaden(id, dmg, krit)`. Partietest: alles ok, Konsole rot-frei.

### Punkt 49 – Maßstab-Probe E
- Aufruf: `VARIANTEN=D,E1,E2 node tools/massstab_bilder.mjs grauwall winterdorf`. Das Spiel bleibt unverändert.
- **E1:** Soldat 0,52, **E2:** Soldat 0,48 Feldradien. Beide mit Figurenzahl wie D (10 / Reiter 6 / Spezial 4), lockerer verteilt (Reihen weiter auseinander, Trupp nutzt die Feldbreite).
- **Schrumpfen im selben Verhältnis mit:** MG-Trupps, Geschütze und Reiter (Pferde samt Reiter), außerdem Helden.
- **Bleiben gleich:** Panzer und Schreiter.
- **Bilder:**
  - `entwurf/probe/massstab/vergleich_E_grauwall_nah.jpg` und `vergleich_E_winterdorf_nah.jpg`: D, E1, E2 nah, dazu E2 auf der ganzen Karte;
  - einzeln: `grauwall_E1_nah.jpg`, `grauwall_E2_nah.jpg`, `winterdorf_E1_nah.jpg`, `winterdorf_E2_nah.jpg`.
- **Beobachtung:**
  - Mit kleinerem MG und Geschütz passt die Infanterie jetzt zusammen, und die Reihen wirken weniger gedrängt.
  - **Panzer und vor allem der Kreuzschreiter wirken dadurch sehr groß.** Der Schreiter ist fast so hoch wie zwei Felder voller Soldaten. Wenn das zu viel ist, könnten beide um etwa 10–15 % mitschrumpfen. Das ist noch nicht gezeigt.
- **Leistung:** D, E1 und E2 gleich (Median 5,6–6,1 ms je Bild, 95 % unter 10 ms).

### Fragen an Enrico
- Gefällt E1 (0,52) oder E2 (0,48) besser – oder keine von beiden?
- Sollen Panzer und Schreiter bei E etwas mitschrumpfen (z. B. ×0,9)? In E wirken sie sehr groß.
- Passen die Schadenszahlen so? Besonders die Aschenwacht-Zahlen auf Schnee: so lassen oder kräftiger machen?

## 2026-11-24 – Paket F, Teil 2 und 3: Sprachbefehle, Brainstorm, Probebild Maßstab (`5e57aba`, `13a006f`, `09581a5`)

Gepusht. **Paket F ist noch nicht fertig:** Punkt 17 (Schadenszahlen) fehlt noch. index.html wird erst am Ende des Pakets eingecheckt. Ich habe nach Sparregel 5 hier aufgehört.

**Nachtrag zu Punkt 47:** Enrico hat während der Läufe nebenher gespielt. Das erklärt die schwarzen Bilder. Belegt ein Spiel die Grafikkarte, verliert der unsichtbare Chrome seine Zeichenfläche und liefert leere Bilder. Genau das passierte heute noch einmal bei einem Maßstab-Lauf (Grauwall ganz schwarz, Krähenfurt im selben Lauf normal). Der Partietest misst deshalb jetzt dreimal nach und meldet eine verlorene Zeichenfläche eigens.

### Abschnitt 17:20 – fehlende Sprachbefehle (`5e57aba`)
- **Liste:** `entwurf/postfach/STIMMEN_FEHLEN.md`, je Sprechergruppe eine Tabelle: Moment, wer spricht, heutiger Ton, Satzvorschlag EN/DE, Zahl der Fassungen.
- **Wichtigster Befund:** `rufBeiEreignis` ruft schon heute 14 Anlässe auf: Vorrücken, Feuer, Sturm, Niedergehalten, Rückzug, Sammeln, Granate, Gas, Koloss, Feuerbereit, Sanitäter, Held kommt, Held fällt, Sieg. Weil dafür aber kein Ton hinterlegt ist, **bleiben sie stumm**. Wirklich klingen nur „Feuer!“ (beim Befehl), Panik und Sterben. Neue Sätze lassen sich ohne neue Abspielstelle einhängen: Tonplatz `ruf_<anlass>` und ein Eintrag in `RUF_STANDARD`.
- **Weitere Lücken:**
  - Panzer sprechen nur beim Anklicken.
  - Schreiter haben 8 Anlässe, aber dieselben Sätze für beide Seiten (keine getrennte Sprache).
  - Bei Aschenwacht-Befehlen kommt nur Brüllen, kein Wort.
  - Konkordat-„Sammeln“ nutzt einen alten Ruf.
- **Stimmproben:** liegen in `entwurf/postfach/stimmproben/`, 14 WAV, je 7–12 s:
  - Infanterie je Seite 3 Stimmen;
  - Panzer und Schreiter je Seite 2 Stimmen.

  Quelle sind die **ungefilterten** Suno-Originale. Die Sprechpausen sind gekürzt, damit die Probe dicht ist. Ausgewählt habe ich nach dem Abstand Sprache zu Grundrauschen, also gemessen, nicht gehört. Infanterie, Kampfanzug, Hauptmann und General sind dieselben Sprecher, deshalb gibt es dafür eine gemeinsame Gruppe. Die Proben sind **nicht in git** (26 MB, .gitignore); die Originale sind ja gesichert.

### Abschnitt 17:10 – Brainstorm und Maßstab (`13a006f`, `09581a5`)
- **IDEEN.md:** neuer Abschnitt „Brainstorm Spielsystem (2026-11-23)“ mit allen Punkten aus dem Auftrag. Die älteren, noch nicht eingecheckten Einträge in IDEEN.md (Flux-Angleich, Rollen-Aufstellung, Großer Fahrplan) sind mit eingecheckt.
- **Probebild im Spiel:** `node tools/massstab_bilder.mjs [grauwall winterdorf]`. **Das Spiel bleibt unverändert.** Das Werkzeug fängt beim Laden index.html ab und hängt nur im Speicher drei Haken ein: Figurenzahl/-größe, Grabenplätze, Zeitmessung. Gezeigt wird je Karte eine gemischte Gruppe:
  - 2 Schützenkohorten, 2 Reiter, MG, Landkoloss, Haubitze, Kreuzschreiter, Rote Faust;
  - 1 Grenadiertrupp der Aschenwacht.
- **Bilder:**
  - `entwurf/probe/massstab/vergleich_grauwall_nah.jpg`, `vergleich_winterdorf_nah.jpg` (je A, B, C, D nebeneinander), dazu die `_ganz`-Fassungen;
  - Zielvariante D einzeln: `grauwall_D_nah.jpg`, `winterdorf_D_nah.jpg`.
  - Kamera: nah = Zoom 1,5; ganz = ganze Karte.
- **Varianten:**
  - A = heute.
  - B = 8 Schützen / 5 Reiter, Soldat 0,6.
  - C = 11 / 7, Soldat 0,65, Felder ×1,3. Die größeren Felder sind nur über die Kamera nachgestellt.
  - **D = 10 Schützen in zwei Reihen, 6 Reiter, Spezialtrupps 4, alle Soldaten 0,58 Feldradien; Fahrzeuge, Schreiter, MG und Geschütze unverändert.**
- **Was man in D sieht:**
  - Die Reihen wirken wie eine Linie, die Reiter als Schwadron, und Panzer und Schreiter dominieren deutlich.
  - Ringe, Balken und Marken bleiben gleich groß und damit antippbar.
  - Die Figuren bleiben im eigenen Feld.
- **Was für D fehlt:**
  1. **Klone:** Schützenkohorte und Grenadiere zeigen in Ruhe alle dasselbe Bild „bereit“ (Posen Stufe 1). Bei 10 Figuren stehen also 10 gleiche Männer da. Nötig ist **eines von beidem**:
     - mehr Ruheposen, etwa 3–4 Varianten je Fraktion;
     - oder je Figur gespiegelt und leicht gedreht. Das wäre eine kleine Code-Änderung in `drawNewFigs`, weil heute der ganze Trupp gemeinsam gespiegelt wird.

     Die Reiter haben schon 3 Posen und wirken deshalb besser.
  2. **Graben:** Die Grabenplätze (`gbPlatz`) gibt es nur für 4 Figuren. In der Probe stehen größere Trupps deshalb auf normalen Reihenplätzen und wirken im Graben nicht abgesenkt. Für D braucht der Graben 10 Plätze entlang der Grabenlinie.
  3. Die Rote Faust ist als Einzelmodell mit auf 0,58 geschrumpft. Ob Helden mitschrumpfen sollen, ist offen (siehe Fragen).
- **Leistung:** Zeichenzeit je Bild bei ganzer Karte, beide Armeen, unsichtbarer Chrome:

  | Karte | A | B | C | D |
  |---|---|---|---|---|
  | Grauwall (Median / 95 %) | 5,7 / 8,0 ms | 5,9 / 8,1 ms | 6,3 / 8,8 ms | 6,0 / 8,6 ms |
  | Krähenfurt | 5,3 / 9,2 ms | 5,8 / 9,9 ms | 6,2 / 7,6 ms | 5,9 / 6,7 ms |

  Mehr Figuren kosten kaum etwas: Selbst bei 10 je Trupp bleibt die Zeit unter 10 ms, also weit unter den 16 ms für 60 Bilder je Sekunde. **D geht ohne Grafikumbau.** Einschränkung: Gemessen ist der unsichtbare Chrome, nicht Enricos Rechner mit Bildschirm.

### Fragen an Enrico
- Klone bei 10 Schützen: lieber **neue Ruheposen malen** (3–4 je Fraktion) oder erst einmal **im Code spiegeln und versetzen**?
- Sollen **Helden** beim neuen Maßstab mitschrumpfen? In der Probe tun sie es. Fahrzeuge und Schreiter bleiben wie gewünscht gleich groß.
- Sind die Satzvorschläge in `STIMMEN_FEHLEN.md` im Ton richtig, besonders auf Aschenwacht-Seite?

## 2026-11-24 – Paket F, Teil 1: Punkte 46 und 47 (`0459293`, `c6b2a40`)

Gepusht. index.html kommt erst am Ende von Paket F mit.

- **Punkt 46 – Drehknöpfe:** In der Aufstellung zeigen die beiden Drehpfeile jetzt in entgegengesetzte Richtungen. Das Bogensymbol dreht gegen den Uhrzeigersinn; deshalb ist der **rechte** Knopf („Blick nach rechts drehen“) gespiegelt, der linke bleibt wie gemalt. Bild: `entwurf/probe/aufstellung/drehknoepfe.jpg` (MG-Trupp, Knöpfe MG/links/rechts). Das ganze Bild mit Schussfeld liegt in `aufstellung_mg_reichweite.jpg`.
- **Punkt 47 – Partietest:** Der Fehler „Karte schwarz“ trat heute nicht mehr auf. Ein voller Lauf ohne Änderung bestand alle 19 Kartenprüfungen (Helligkeit 41–46). Schwarz war also ein **vorübergehender Aussetzer des unsichtbaren Chrome**, kein Fehler im Spiel. Am wahrscheinlichsten hat Chrome die Zeichenfläche verloren (Context Loss) oder das Zeichnen gedrosselt, als der Rechner stark belastet war (vorher liefen gleichzeitig Sim-Läufe). Bei Context Loss liefert das Auslesen nur Nullen, also „Helligkeit 0, Streuung 0“. Genau das stand in den Meldungen. Umgebaut:
  - Chrome startet ohne Hintergrund-Drosselung (`--disable-background-timer-throttling`, `--disable-renderer-backgrounding`, `--disable-backgrounding-occluded-windows`).
  - Jede Kartenprüfung misst bis zu 3× im Abstand von 1 s. Ein einmaliger Aussetzer zählt nicht, ein bleibend dunkles oder stehendes Bild schon. In der Zeile steht dann „Messungen n“.
  - Eine verlorene Zeichenfläche wird eigens gemeldet („Zeichenfläche verloren (Context Loss)“), damit der Grund beim nächsten Mal sofort klar ist.
  - **Gegenprobe:** `GEGENPROBE=schwarz` (Karte wird nach dem Start nur noch leer gezeichnet) und `GEGENPROBE=steht` (Bildschleife angehalten). Der Test endet dann nach der Bildprüfung. **Beide werden als Fehler erkannt** (schwarz: Helligkeit 0; steht: „Bild läuft false“). Laufzeit je Gegenprobe etwa 30 s, voller Lauf etwa 6 min.
  - Ergebnis voller Lauf: alle Prüfungen ok, Konsole rot-frei.

**Weiter in Paket F:** Abschnitt 17:20 (fehlende Sprachbefehle), 17:10 (Brainstorm und Maßstab-Probebild), Punkt 17 (Schadenszahlen).

### Fragen an Enrico
- Keine.

## 2026-11-24 – Paket E, Teil 5 (Abschluss): Aufstellungsphase (Punkt 2) (`041f50f`)

Gepusht, index.html gebaut. Punkte 44 und 45 sind abgehakt (keine Arbeit nötig). **Paket E ist damit abgeschlossen.**

- **Startzustand in der Aufstellung, kostenlos:**
  - wie bisher: Geschütz auf-/abgeprotzt, MG auf-/abgebaut;
  - **neu:** Fesselballon oben/eingeholt;
  - **neu:** Blickrichtung um 60° nach links/rechts drehen, wichtig für MG-Schussfeld und Fahrzeuge.
- **Wer wohin:**
  - Beim Antippen zeigt die Einheitenkarte wie bisher Leben, Moral, Bewegung und Rolle. Neu steht in der Hinweiszeile „Rolle · Reichweite · Fähigkeit · Schlagworte“ (z. B. „Feuerunterstützung (MG) · Reichweite 3 Felder · Sperrfeuer: 2 Schüsse · Erst aufbauen, dann feuern“).
  - Beim Überfahren bzw. Halten über einem Feld der Startzone erscheinen **Reichweite und Sichtlinie von dort** am Boden (Messing, dezent). Bei MG und Fahrzeugen nur das Schussfeld in Blickrichtung; beim Ziehen gilt das Zielfeld.
  - Bild: `entwurf/probe/aufstellung/aufstellung_mg_reichweite.jpg`.
- **Eingraben als Startzustand – Vorschlag: nein.** Eingraben kostet im Spiel die Aktion und hindert am Ziehen. Als kostenloser Startzustand wäre es ein klarer Vorteil für den Verteidiger, und die KI nutzt es beim automatischen Aufstellen nicht. Das verschiebt die Karten-Abgleiche. Besser: so lassen (erste Runde eingraben kostet die Aktion).
- **Noch nicht schön:** Beide Drehknöpfe haben dasselbe Symbol (Drehpfeil). Ein gespiegeltes Symbol für „links“ wäre ein Wunsch an den Berater.
- **Test-Hinweis:** Der Partietest (`test_partie.mjs`) meldet bei der Bildprüfung inzwischen „Karte schwarz“ (Helligkeit 0) – **auch für den Stand von Paket B**, bei dem er damals bestanden hat. Das ist also ein Problem der Testumgebung (Chrome auf diesem Rechner), nicht des Spiels. In meinem eigenen Browser-Lauf ist die Karte nach Schlachtbeginn normal gezeichnet. Alle übrigen Prüfungen im Partietest sind ok (Drehen, F88, F97, F100, Paket-A-Prüfungen, Blickrichtung aller 54 Typen).

### Fragen an Enrico
- Keine.

---

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

