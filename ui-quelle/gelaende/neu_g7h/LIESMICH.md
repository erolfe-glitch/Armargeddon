# G7h – neue Bögen (Berater, 26.11.2026 morgens)

Gemalt mit Nano Banana 2.1 Edit (fal.ai). Format 2752 × 1536, Hintergrund Magenta. Übertragen als WebP 0,97, deshalb können die Ränder leicht rosa sein: beim Schneiden `ENTROSA` bzw. Saum entfernen. Licht kommt von links oben. Die Kästen sind gemessen als (x0, y0, x1, y1).

## `graben_wand_seite_breit_bogen.png` = G7-3b Seitenwand breit
- Drei Streifen über die ganze Breite: Zeilen 42–524 Bretter waagerecht, 554–1041 Flechtwerk, 1065–1536 nackte Erde mit Wurzeln.
- Oben liegt ein Boden- und Krümelstreifen, darunter fällt die Wand schräg ab und wird unten dunkel.
- Die Pfosten sind weg bis auf je einen schmalen Brettstoß. Beim Flechtwerk sind nur dünne Stecken zu sehen.
- Kachelbar machen wie bisher (gelaende_cut.py, nahtlos). Für Nord–Süd-Kanten drehen.

## `graben_querwand_block_bogen.png` = G7-6b Querwand als Erdblock
- Vier Blöcke:
  - (102, 124, 1327, 741) Bretter;
  - (1436, 124, 2652, 740) Flechtwerk;
  - (96, 801, 1336, 1406) Bretter, Variante;
  - (1433, 790, 2666, 1423) zerschossen.
- Gerade von vorn gesehen. Die Oberseite (Erde mit Sandsackreihe hinten) ist gut zu sehen, die Vorderseite fällt dunkel ab.
- Die Vorderseite ist im Bild noch etwa so hoch wie die Oberseite tief. Im Spiel auf die geplante Höhe stauchen (Vorderseite etwa 0,25 SH, Oberseite 0,35 R).
- Breite auf die Grabenbreite (0,95 R) setzen. Die Seiten sind gerade geschnitten.

## `drahtguertel_tiefe_module_bogen.png` = neuer Weg für Drahtgürtel in die Tiefe (Punkt 88.2)
- Der Bildgenerator malt einen Gürtel, der in die Tiefe läuft, immer mit starkem Fluchtpunkt (zwei Versuche, siehe `drahtguertel_tiefe_flucht_verworfen.png`, nicht verwenden).
- Deshalb gibt es jetzt **Querschnitt-Module**. Jedes ist ein Pfahlpaar mit Draht dazwischen und einer Drahtrolle von vorn, auf einem Schlammfleck.
- Kästen:
  - (45, 80, 874, 537), (960, 80, 1790, 537), (1876, 82, 2707, 537), (44, 1004, 875, 1458): heil;
  - (968, 1004, 1791, 1489): ein Pfahl gebrochen, Draht hängt durch;
  - (1899, 1003, 2703, 1492): lose Drahtreste.
- **So bauen:** In GBau einen Tiefen-Gürtel aus 4–6 Modulen hintereinander aufstellen, von hinten nach vorn gezeichnet, in gleicher Breite und mit gleichmäßigem Abstand, Varianten zufällig, selten ein kaputtes. Dazwischen höchstens eine im Code gezeichnete Drahtlinie von Pfahlkopf zu Pfahlkopf. So bleiben die Pfahlreihen parallel, wie es die gekippte Ansicht verlangt.
- Das ersetzt `drahtguertel_tiefe`. Prüfen, ob `_schraeg` dasselbe Fluchtproblem hat; wenn ja, ebenso aus versetzten Modulen bauen.

## `ruinen_haus_bogen.png` = neue Ruinen (Punkt 88.1)
- Vier ganze Hausruinen auf sichtbarem Steinfundament:
  - (182, 6, 1251, 796) zweistöckig;
  - (1476, 87, 2582, 779) einstöckig;
  - (161, 771, 1254, 1522) mit Schornstein;
  - (1480, 921, 2586, 1514) fast eingeebnet.
- Kasten 1 und 3 berühren sich knapp (y 771–796), deshalb mit Naht schneiden.
- **Achtung:** Die Ruinen sind über Eck gesehen (Fundamentecke zeigt zum Betrachter). Ein zweiter Versuch, sie gerade von vorn zu malen, hat nichts geändert.
- Die Wände stehen senkrecht auf dem Fundament, es fächert nichts auf.
- Gedacht als **ein ganzes Modell je Dorf- bzw. Ruinenfeld** statt der aufgestellten Wandstreifen (`ruine_vorn`/`ruine_hinten`).
- Ob die Eckansicht neben den übrigen Bausteinen passt, entscheidet Enrico am Probebild.

## `graben_laufsteg_bogen.png` = gerade Lattenroste (26.11. 10:00, Enricos Frage zu G7h-1)
- Vier waagerechte Streifen, jeweils mit Längsbalken oben und unten und Latten genau quer dazu, dunkel und nass:
  - Zeilen 41–369 sauber;
  - Zeilen 423–752 schlammig;
  - Zeilen 806–1131 mit Pfütze;
  - Zeilen 1186–1511 mit zwei fehlenden Latten.
- Über die ganze Bildbreite, kachelbar machen.
- **Im Spiel:**
  - Den Steg auf etwa 0,35 R Breite skalieren und entlang der Grabenmitte kacheln, nur drehen und nie scheren (in Gräben, die in die Tiefe laufen, um 90° gedreht und in der Tiefe verkürzt).
  - Die Streifen zufällig mischen, den mit Lücke selten nehmen.
  - Er ersetzt den Code-Steg aus G7h-1. Der bleibt als Rückweg.
