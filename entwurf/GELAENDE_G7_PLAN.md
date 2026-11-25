# G7 – Gräben eingegraben statt Pappe (Plan, Stand G7a, 2026-11-25)

Grundlage: Punkt 70 (Enrico 16:03), Zielbild `entwurf/probe/zielbild_graben/zielbild_graben_eingegraben.jpg`.
Probe: `entwurf/probe/gelaende_g7a/`, jeweils links heute, rechts Probe: `vergleich_nah.jpg`, `vergleich_nah2.jpg`, `vergleich_ganz.jpg`.
Die Probe läuft nur über `window.GB_PROBE = { eingegraben: true }` bzw. `G7=1 node tools/gelaende_probe.mjs`; im Spiel ist nichts geändert.

## 1. Warum es heute wie Pappe wirkt (Analyse)

1. **Beide Grabenwände stehen als aufrechte Streifen auf dem Boden.** GBau zeichnet jede Grabenkante mit `wall()`: ein Bildstreifen, der von der Bodenlinie *nach oben* steht, also wie ein Zaun.
   - Die vordere Wand (Graben nördlich der Kante) dürfte von unserem Blickpunkt aus gar nicht zu sehen sein. Sie steht aber als hohe Platte vor dem Graben.
   - Die hintere Wand steht ebenfalls nach oben, statt von der Kante nach unten in den Graben zu laufen.
2. **Die Kante ist eine gerade, saubere Linie.** Zwischen Boden und Wand gibt es keine Erdlippe. Der Boden endet nicht am Graben, sondern läuft unter der Pappe durch.
3. **Die Wandbilder sind für aufrechte Wände gemalt** (`graben_kante_hinten/vorn`: von vorn gesehen, Oberkante oben, hell). Für eine Wand, die man von oben in die Tiefe sieht, fehlen Schräge und Verdunklung nach unten.
4. **Die Sandsäcke sind ein aufrechter Streifen** (`graben_brustwehr`) ohne Erdkörper darunter und ohne Schatten auf dem Boden. Deshalb wirken sie aufgeklebt.
5. **Ecken:**
   - Die Kanten werden je Abschnitt als einzelne Streifen gezeichnet. An Ecken treffen zwei Streifen stumpf aufeinander; die Kachel wird senkrecht abgeschnitten (z. B. oben links in `u2/boden_nah.jpg`).
   - Querwände und Eckstücke (G2b) stehen als einzelne Aufsteller davor und decken das nur teilweise.
6. **Tiefe fehlt:** Die Sohle ist kaum dunkler als der Boden, Wände werfen keinen Schatten in den Graben.

## 2. Was die Probe macht (nur Code, mit den heutigen Bildern)

- **Nahe Wand weg:** An Kanten, hinter denen der Graben nördlich liegt, steht keine Wand mehr. Es bleibt nur die Erdlippe.
- **Ferne Wand hängt:** Ihre Oberkante liegt auf der Bodenkante, sie läuft schräg nach unten und leicht nach innen und ist etwas abgedunkelt (`strip` mit Option `ab`).
- **Querwände und Unterstand hängen** ebenfalls von der Kante in den Graben (`stand` mit Option `haengen`).
- **Erdlippe an allen Kanten:** dunkles Band mit unruhigem Außenrand, heller Krümelrand, Erdkrümel und aufgeworfene Erde auf dem Boden.
- **Brustwehr:** niedriger (0,3 statt 0,4 SH), darunter ein Erdhügel mit Licht oben links und Schatten unten rechts.
- **Rückwall:** flacher Erdhügel statt aufrechtem Streifen.
- **Sohle** deutlich dunkler.

**Ergebnis:**
- **Aus der Ferne** (`vergleich_ganz.jpg`) wirken die Gräben deutlich mehr wie in den Boden geschnitten. Das breite dunkle Band ist weg, man sieht den Umriss im Boden.
- **Nah** (`vergleich_nah.jpg`) ist die Richtung richtig: Die vordere Pappe ist weg, die hinteren Wände laufen in die Tiefe. Aber:
  - Die **Seitenwände** (Nord–Süd) wirken weiter wie Platten, weil das heutige Wandbild senkrecht gemalt ist.
  - Die Lippe aus Code ist eine brauchbare Andeutung, aber nicht so bröckelig und körperhaft wie im Zielbild.
  - Die Sandsäcke sind weiter ein Streifen; mit Hügel darunter wirken sie schon weniger aufgeklebt.
  - Lauf- und Sappengräben (ohne Buchten) zeigen in der Probe noch einzelne dunkle Platten (unten Mitte in `vergleich_ganz.jpg`); dort greift der neue Aufbau noch nicht sauber.
- **Fazit:** Mit Code allein kommen wir etwa halb an das Zielbild heran. Für den Rest braucht es Bilder, die für den Blick *von oben in den Graben* gemalt sind.

## 3. Bausteine, die neu gemalt werden müssen (für den Berater)

Machart wie bisher: Magenta-Hintergrund, Licht von links oben, Tuschekonturen, keine gemalten Schatten außerhalb des Teils. **Neu:** Blickwinkel wie im Spiel (etwa 40° von oben). Die Wände sind so gemalt, wie man sie von oben in den Graben hinein sieht.

| # | Name (Vorschlag) | Inhalt | Größe | Hinweise |
|---|---|---|---|---|
| G7-1 | `graben_lippe` | Erdlippe der Grabenkante von oben: unregelmäßige, bröckelige Abbruchkante, aufgeworfene Erde und Krümel, nahtlos kachelbar als Streifen | Streifen, 0,25 R breit | wichtigstes Teil; liegt flach auf allen Kanten |
| G7-2 | `graben_wand_innen` | Innenwand von oben gesehen, schräg in die Tiefe laufend: Bretter, Flechtwerk, Sandsäcke; oben hell, nach unten dunkel; nahtlos kachelbar; 3 Varianten (Bretter / Flechtwerk / Sandsack) | Streifen, 0,35 SH tief | ersetzt `graben_kante_hinten` für die ferne Wand |
| G7-3 | `graben_wand_seite` | Seitenwand (Graben läuft in die Tiefe): schmale, stark verkürzte Wandfläche, oben hell, unten dunkel, nahtlos kachelbar | Streifen, 0,2 R breit | gegen die „Platten“ an Nord–Süd-Gräben |
| G7-4 | `graben_brustwehr_wall` | Sandsack-Brustwehr als Wall mit Körper: Säcke auf aufgeworfener Erde, oben hell, Seiten dunkel, lose Erde davor, nahtlos kachelbar | Streifen, 0,3 SH hoch | ersetzt `graben_brustwehr` |
| G7-5 | `graben_lippe_ecke_innen` / `_aussen` | Lippe um 90°-Ecken (innen und außen), je 2 Varianten | etwa 0,4 × 0,4 R | schließt die Ecken der Zinnenform |
| G7-6 | `graben_querwand_tief` | Querwand/Traverse von oben: Erdblock mit Sandsackkrone, Vorderseite fällt in den Graben ab; 3 Varianten | 0,6–1,0 R breit | ersetzt die aufrechten Querwände aus G2b |
| G7-7 | `graben_rueckwall_hang` | aufgeworfene Erde hinter dem Graben als flacher Hang (von oben), nahtlos kachelbar | Streifen, 0,3 R breit | flacher, dunkler als G7-4 |

Nicht nötig: Roste, Pfützen, Kram, Leitern, Stahlschilde und der Unterstand aus G2b bleiben.

## 4. Aufwand und Folgen

**G7b (Einbau)**, mit den gemalten Teilen etwa ein ganzes Paket (L):
- Wände der Grabenkanten neu ordnen:
  - nahe Wand weg;
  - ferne Wand hängend aus G7-2;
  - Seitenwände aus G7-3, je nach Richtung der Kante überblendet.
- Lippe (G7-1) als Streifen entlang aller Kanten, Ecken aus G7-5.
- Brustwehr-Wall (G7-4) und Rückwall-Hang (G7-7) flach ins Bodenbild.
- Querwände hängend (G7-6). Lauf- und Sappengräben auf denselben Aufbau bringen.
- Bilder, Partietest; „Bild = Regel“ ist nicht betroffen (die Grabenfelder bleiben).

**Mit in G7b (laut Auftrag):**
- **R2:** Gräben als freie gerade Linien; die Teile werden ohnehin neu gelegt.
- **Bremse 2:** Weil Lippe, Brustwehr-Wall, Rückwall und Wände von oben flach im Bodenbild liegen, fallen viele aufrechte Teile weg, die heute in jedem Bild nach Tiefe gemischt werden. Das entlastet die Bildzeit von selbst. Was aufrecht bleibt (Querwände, Kram), wird je Tiefenband zwischengespeichert.
- **Bremse 4:** Erst messen, welcher Feldwechsel den vollen Neuaufbau auslöst.

**Folgen für U2 (Grabenplätze):**
- Die Plätze bleiben gleich (Bucht und Durchgang ändern sich nicht).
- Die Figuren stehen dann wirklich *im* Graben: Die nahe Wand verdeckt sie nicht mehr als Pappe, die Lippe schneidet sie unten ab (heute `eingesunken`).
- Prüfen muss man nur die Höhe, bis zu der sie einsinken.

**Folgen für die Leistung:** eher besser (siehe Bremse 2). Die Probe selbst rechnet noch mit Filtern je Streifen; das fällt mit fertigen Bildern weg.

## 5. Fragen an Enrico

1. Geht die Richtung der Probe so in Ordnung (nahe Wand weg, ferne Wand hängt, Lippe)?
2. Sollen die sieben Teile so beim Berater bestellt werden, oder lieber zuerst nur G7-1 (Lippe) und G7-2 (Innenwand) als Test?
