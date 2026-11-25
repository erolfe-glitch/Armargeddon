# G7-Test: gemalte Grabenteile (Berater, 2026-11-25)

Gemalt mit Nano Banana 2.1 Edit (fal.ai). Als Stilvorlage diente der Ausschnitt `entwurf/probe/zielbild_graben/arm_g7_ziel_ausschnitt.jpg` aus dem Zielbild.
Die Bögen sind 2752 × 1536 px groß, Hintergrund Magenta. Sie kommen aus einer WebP-Übertragung (Qualität 0,97), deshalb können die Ränder leicht verwaschen sein. Licht von links oben, Blick etwa 40° von oben.
Jeder Bogen hat drei waagerechte Streifen über die ganze Breite. Die Zeilenbereiche sind gemessen (y von–bis):

## `graben_lippe_bogen.png` = G7-1 `graben_lippe`
| Streifen | y | Inhalt |
|---|---|---|
| 1 | 46–498 | trockene, krümelige Erdlippe |
| 2 | 553–1008 | nasser Schlamm mit kleinen Pfützen |
| 3 | 1064–1528 | mit abgebrochenen Wurzeln und Splittern |

Aufbau jedes Streifens: Oben liegt flacher Boden mit unruhigem Rand aus Erdklumpen. Unten ist die Abbruchkante mit dunklem Erdband, dort geht es in den Graben.
In der Probe flach auf alle Grabenkanten legen; die Unterkante zeigt zum Graben. Die Bodenfarbe oben ggf. an den Kartenboden angleichen.

## `graben_wand_innen_bogen.png` = G7-2 `graben_wand_innen`
| Streifen | y | Inhalt |
|---|---|---|
| 1 | 45–492 | Bretter (senkrecht und schräg, mit Pfosten) |
| 2 | 561–1016 | Flechtwerk zwischen Pfählen |
| 3 | 1082–1532 | Sandsäcke mit einzelnen Brettern (reicht fast bis an den unteren Bildrand) |

Oben ist jeweils die Bodenkante, darunter die Wand bis zum Grabenboden. Ersetzt `graben_kante_hinten` für die ferne Wand (hängt von der Kante nach unten).
**Hinweis:** Die Wände sind recht frontal gemalt und unten noch nicht stark abgedunkelt. Die Verdunklung nach unten (`ab`) und die Stauchung in die Tiefe bitte weiter im Code machen.

Die Enden der Streifen passen nicht ganz zueinander. Bitte wie bei den anderen Wandstücken mit gelaende_cut.py nahtlos machen.


# G7-3 bis G7-7 (Berater, 2026-11-25, 21:20)
Die Bögen sind wie oben gemalt: Nano Banana, Stilvorlage Zielbild-Ausschnitt plus `graben_lippe_bogen.png` für die Farben, 2752 × 1536 px, Magenta.

## `graben_wand_seite_bogen.png` = G7-3 Seitenwand
Drei Streifen, Zeilen 46–505 / 554–1010 / 1064–1528: Bretter / Flechtwerk / nackte Erde mit Wurzeln.
Oben liegt die Bodenkante mit Krümeln, darunter eine schmale, stark verkürzte Wand. Für Nord–Süd-Kanten drehen und stauchen. Die Wand ist unten noch nicht dunkel genug, bitte im Code nachdunkeln.

## `graben_lippe_ecken_bogen.png` = G7-5 Lippen-Ecken (gilt)
Vier L-Stücke in den Kästen (x0, y0, x1, y1):
- oben links (146, 50, 1316, 743) und oben rechts (1467, 46, 2622, 743): Abbruchkante innen im L
- unten links (144, 804, 1314, 1516) und unten rechts (1501, 816, 2622, 1527): Abbruchkante außen, mit Wurzeln

Die Bezeichnung innen/außen bitte am Bild prüfen; die Bildkünstlerin hat sie nicht ganz wie bestellt verteilt. Die Arme enden gerade, damit sie an die Lippenstreifen anschließen.
`graben_lippe_ecken_bogen_a.png` ist ein erster, unsauberer Versuch (Teile berühren sich). Nur verwenden, wenn ein Teil daraus besser passt.

## `graben_querwand_tief_bogen.png` = G7-6 Querwand
Drei Stücke, Spalten 29–924 / 957–1824 / 1877–2722, Zeilen 76–1498: Bretter / Flechtwerk / beschädigt.
Oben ist eine Sandsackkrone, die Vorderseite fällt dunkel in den Graben. Die Stücke sind höher als breit gemalt; beim Einbau auf die Grabenbreite skalieren und hängend setzen (wie Option `haengen`).

## `graben_brustwehr_wall_bogen.png` = G7-4 Brustwehr-Wall
Zeilen 58–494: ordentliche Sandsackreihen auf einem Erdhügel. Zeilen 529–986: abgesackt und teils zerrissen.
Zeilen 1064–1527 sind **kein** Brustwehr-Teil (versehentlich ein Lippenstreifen mit Wurzeln) und werden nicht verwendet.

## G7-7 Rückwall-Hang
Es gibt **kein brauchbares Bild**: Zwei Versuche ergaben nur Kopien der Lippe. Den Rückwall-Hang bitte weiter im Code zeichnen (wie in G7a) oder den Erdhügel-Teil unter den Sandsäcken aus G7-4 ohne Säcke verwenden.
