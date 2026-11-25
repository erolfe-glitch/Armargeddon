# Prüfung Fable-Check 1: Graben und Leistung nach G7e (Fable, 26.11.2026)

Nur geprüft, gemessen und Bilder gemacht. Nichts in `src/` geändert. Stand: `9d794aa` (G7e).
- Sechs Browser-Läufe nacheinander, alle mit Grafikkarte, **ohne Hänger**. Chrome ist beendet, der Vorschau-Server läuft weiter.
- Die Prüfung hat etwa 65 Minuten gedauert statt 50.
- Alle Bilder liegen in `entwurf/probe/fable_graben/`.

## Teil 0: Enricos Spielbilder

**Vorab eine Berichtigung:** Enricos Bilder stammen aus der **Aufstellungsphase**. Die grünen Felder sind die Aufstellungszone, das gelbe Feld ist die gewählte Einheit. Der Zugbereich in der Schlacht wird aber auf dieselbe Art gezeichnet, die Ursache ist dieselbe. Ich habe die Lage nachgestellt (Panzer und Trupps im vorderen Konkordat-Graben, Mörser gewählt) und kann alle Fehler nachmachen.

### Ursache je Fehler

**1. Zone und Zugbereich zerstückelt** – Bild `t0_stelle1_panzer_jetzt_alt.jpg`, `t0_ohne_und_mit_wahl.jpg`
- Zone, Zugbereich, Standringe und die Grabensohle liegen im **Bodenbild**. Alle Grabenteile werden **danach** darüber gezeichnet (`src/ui.js` `drawTilt`: erst `drawGround` und `projectGround`, dann die Teile).
- Das war vor G7d genauso. Damals standen aber nur dünne aufrechte Wände auf der Kante.
- Neu seit G7b/G7d: Auch die **flach liegenden** Teile (Erdlippe, Seitenwand, Sandsackwall) liegen nicht mehr im Bodenbild, sondern werden als eigene Stücke über den Boden gelegt (`src/gelaende_bau.js` `liegend`, Zeile 461). Zusammen mit den hängenden Blöcken decken sie etwa die Hälfte eines Grabenfelds ab. Deshalb sieht die Farbfläche zerschnitten aus.

**2. Einheiten werden überdeckt** – Bild `t0_stelle1_nah_jetzt_alt.jpg` (links): Lippe quer über dem Panzer, Stärkeleiste und Aktionspunkte des Panzers fast ganz verdeckt, Stärkeleiste des Trupps darüber halb verdeckt
- Ursache A: Steht eine Einheit auf einem Grabenfeld, wird ihr Sockel (Ring, Leisten) und bei Fahrzeugen das ganze Modell **früh** gezeichnet. Alle Geländeteile ab 0,75 Feldradien **hinter** der Feldmitte kommen danach darüber (`src/ui.js` Zeile 2014: `gbBis(d.y - L.s * 0.75)`). Das ist für einzeln einsortierte Soldaten gedacht, gilt aber auch für Panzer und für die Leisten.
- Ursache B: Flach liegende Stücke werden nach ihrem **vordersten** Punkt einsortiert (`gelaende_bau.js` Zeile 469, `yy = Math.max(…)`). Ein Stück, das flach am Boden liegt, landet so über Einheiten, die darauf oder dahinter stehen.
- Die hängenden Teile selbst sind gegenüber Soldaten richtig einsortiert. Falsch ist die Reihenfolge bei den flachen Stücken, bei Fahrzeugen und bei den Leisten.
- Beim alten Graben gab es Ursache A auch (rechts im Bild: Sandsackwand vor dem Panzer). Dort wirkt es aber wie „Panzer steht hinter der Wand“.

**3. Figuren auf und an den Wänden** – Bild `t0_stelle2_schraeg_jetzt_alt.jpg`, `t0_stelle1_panzer_jetzt_alt.jpg` (Trupp oben)
- **Liegen Plätze außerhalb der Sohle?** Außerhalb des Grabens: keiner (0 von 304). Aber **111 von 304 Plätzen (37 %) liegen auf dem gemalten Wandstreifen.** Der Graben ist 0,6 Feldradien breit, die liegenden Seitenwände nehmen innen je 0,14 weg. Frei bleibt eine Sohle von nur 0,31 Feldradien. Die Plätze aus U2b stehen 0,14 bis 0,18 neben der Mitte, also genau auf der Wandkante (`gelaende_bau.js` Zeile 1060). Messwerte: `t0_grabenplaetze.json`.
- **Passt die Zickzack-Verteilung noch?** Nein. Sie stellt die acht Figuren in zwei senkrechte Reihen an die linke und rechte Wand. Im schmalen Graben sieht das aus wie zwei Säulen aus Soldaten.
- **Halb abgeschnittene Soldaten:** Grabenfiguren werden weiter an der Hüfte abgeschnitten (`gelaende_bau.js` Zeile 1069 `cut: EINSINK`, `ui.js` Zeile 1850). Beim alten Graben verdeckte die vordere Wand den Schnitt. Diese Wand gibt es nicht mehr, also schwebt der halbe Soldat.
- An Einmündungen (Laufgraben trifft Feuergraben) werden keine Wände gezeichnet. Dort stehen Figuren scheinbar auf der Wiese (Bild `t0_stelle2…`, Trupp in der Mitte).

**4. Graben, der in die Tiefe läuft** – Bild `t0_weit_jetzt_alt.jpg`, `a_r2_probe_nah.jpg`
- **Kommt nicht vom Zickzack von Feld zu Feld.** Die drei Feuergräben laufen schon heute als gerade Linie durch eine Feldspalte. Die Sprünge sind die **Feuerbuchten aus G4**: Der Graben springt etwa alle 1 Feldradius um 0,9 Feldradien zur Seite. An jedem Sprung hängt eine Querwand.
- **Eigene Fehler:**
  - Die Querwand hängt 0,7 Soldatenhöhen nach unten und wird in der Tiefe nicht verkürzt (`gelaende_bau.js` Zeile 790). Sie verdeckt damit fast einen ganzen Feldradius Sohle. Mehrere hintereinander wirken wie gestapelte Kisten.
  - Die liegende Seitenwand ist ein dunkler Streifen mit senkrechten Balken. An einer Kante, die in die Tiefe läuft, sieht das wie eine Säule aus.
  - Der Graben ist schmaler als ein Soldat hoch ist. Deshalb wirkt alles darin riesig.
- **Was R2 ändern würde:** nur das V-förmige Zickzack der Laufgräben (oben links in Enricos Bildern). Die Kisten und Säulen bleiben auch mit geraden Linien (Probe rechts in `a_r2_probe_nah.jpg`).

**5. Bilder jetzt | alter Graben**, jeweils mit gewählter Einheit:
- `t0_stelle1_panzer_jetzt_alt.jpg`, `t0_stelle1_nah_jetzt_alt.jpg`: Panzer und Trupp im Graben.
- `t0_stelle2_schraeg_jetzt_alt.jpg`: schräger Laufgraben, Trupp an der Kante.
- `t0_stelle3_sued_jetzt_alt.jpg`: Graben weiter südlich.
- `t0_weit_jetzt_alt.jpg`: Übersicht.
- `t0_ohne_und_mit_wahl.jpg`: ohne und mit gewählter Einheit.

### Sofort reparieren

| # | Was | Stelle im Code | Aufwand |
|---|---|---|---|
| 1 | Flach liegende Stücke (Lippe, Seitenwand, Sandsackwall) **vor allen Einheiten** zeichnen, nicht nach Tiefe gemischt | `gelaende_bau.js` `liegend` (Zeile 469): Stück als „flach“ kennzeichnen; `ui.js` `drawTilt`: flache Stücke direkt nach `projectGround` | klein |
| 2 | Fahrzeuge auf Grabenfeldern erst nach den Teilen ihres Felds zeichnen; Stärkeleiste und Punkte aller Graben-Einheiten nach den Geländeteilen | `ui.js` Zeile 2014 (früher Schnitt nur für einzeln einsortierte Soldaten), Leisten über die spätere Liste `MARKQ` | klein |
| 3 | Figuren im neuen Graben nicht mehr an der Hüfte abschneiden, Füße auf die Sohle | `gelaende_bau.js` Zeile 1069 und 1078 (`cut` nur beim alten Graben) | klein, mit Bildkontrolle |
| 4 | Grabenplätze zur Mitte rücken (höchstens 0,08 neben der Mittellinie) und nicht mehr in zwei senkrechten Reihen | `gelaende_bau.js` Zeile 1057–1060 | klein |
| 5 | Umriss von Zone und Zugbereich auf Grabenfeldern nach den Geländeteilen noch einmal als Linie zeichnen | `ui.js` `drawGround` (Zeile 836) und `MARKQ` | klein |
| 6 | Querwände in Gräben, die in die Tiefe laufen, halb so hoch oder weglassen | `gelaende_bau.js` Zeile 790 | klein bis mittel |

Punkte 1 bis 5 passen zusammen in einen `pa`. Punkt 6 gehört schon zur Grabenform (Teil A).

### Soll bis dahin der alte Graben gezeigt werden?
**Ja, wenn die Reparatur nicht der nächste `pa` ist.**
- Die Fehler treten in jeder Partie auf Grauwall auf, sobald Einheiten im Graben stehen.
- Der Rückweg ist eine Zeile (`window.G7_ALT` als Standard) plus neues `index.html`.
- Der alte Graben hat dieselbe Schwäche bei Panzer und Leisten, ist aber lesbar.
- Kommt die Reparatur sofort, lohnt das Zurückschalten nicht.

## Teil A: Graben gegen das Zielbild

Vergleichsbilder: `a_nah_spiel_ziel.jpg` (nah), `a_ganz_spiel_ziel.jpg` (ganze Karte).

### Die 5 größten Unterschiede (nach Wirkung)

1. **Breite (Form).** Im Zielbild ist die Sohle zwei bis drei Soldaten breit, beide Wände sind als schräge Flächen zu sehen. Im Spiel ist der Graben 0,6 Feldradien breit, davon 0,31 frei. Ein Soldat ist 0,8 hoch.
   - Vorschlag: Graben 0,9 bis 1,0 Feldradien breit, Sohle mindestens 0,6.
2. **Zinnen statt ruhiger Verlauf (Form).** Im Zielbild läuft der Graben lange gerade und biegt einmal um einen Erdblock. Im Spiel springt er jeden Feldradius um fast ein halbes Feld.
   - Vorschlag: Sprung halb so tief (0,45 statt 0,9), ein Erdblock je etwa zwei Felder. Probe: `a_r2_probe_nah.jpg`, Mitte.
3. **Wände und Querwände (Teile).** Im Zielbild sind die Wände helle, schräge Bretter- und Flechtwerkflächen, die Querwand ist ein Erdblock mit Oberseite und Sandsackkrone. Im Spiel sind die Seitenwände dunkle Streifen, die Querwände graue flache Tafeln ohne Oberseite.
   - Vorschlag: Seitenwand breiter und heller zeichnen (geht erst mit breiterem Graben), Querwand mit sichtbarer Oberseite neu malen lassen.
4. **Licht und Farbe.** Im Zielbild ist die Sohle mit Laufrost gut zu sehen, das Holz ist warm braun. Im Spiel ist der Graben fast schwarz, die Lippen wirken wie dunkle Bretter.
   - Vorschlag: Sohle weniger abdunkeln, Lippe schmaler und erdiger.
5. **Figuren im Graben.** Siehe Teil 0, Punkt 3: zwei Reihen, abgeschnitten, auf der Wand.
   - Vorschlag: Reparaturen 3 und 4, danach mit breiterem Graben neu verteilen.

### R2 (gerade Gräben): anders bauen

**R2 allein schließt die Hauptlücke nicht.** Die Feuergräben sind schon gerade Linien. Die Probe mit geraden Linien ohne Buchten (`a_r2_probe_nah.jpg` rechts, `a_r2_probe_weit.jpg`, `a_r2_probe_lauf.jpg`) zeigt einen schmalen Schlitz zwischen zwei dunklen Leisten, kein Zielbild. Die Lücke liegt bei Breite, Buchtentiefe und Wandbildern.

So würde ich es bauen:
- **Linien:**
  - Nord–Süd wie heute durch die Feldmitten einer Spalte.
  - Ost–West (Laufgräben) als gerade Linie auf der **Mittellinie der Reihe**, also eine Viertel-Feldhöhe neben den Feldmitten. Diese Linie bleibt in allen Feldern der Reihe.
  - Nicht entlang der Feldkanten. Nicht von Mitte zu Mitte: das ergibt in Ost–West-Richtung immer das V-Zickzack.
- **Grabenfelder:** bleiben die Liste in `MAP.graeben`. Die Linie wird aus den Feldern berechnet, nicht umgekehrt. So bleibt „Bild = Regel“, und es braucht keinen sim-Lauf. Als Prüfung: mindestens 85 % der gezeichneten Grabenfläche liegen in Grabenfeldern.
- **Buchten:** flacher Versatz um einen Erdblock, etwa alle zwei Felder, statt Zinnen.
- **Querwände:** nur an diesen Erdblöcken, als Block mit Oberseite. In Gräben, die in die Tiefe laufen, niedrig.
- **Grabenplätze:** entlang der Mittellinie, in der Bucht an der Feindwand.
- **Grauwall:** keine Feldänderung. Die fünf Lauf- und Sappengräben werden gerade, die drei Feuergräben breiter und ruhiger.
- **Aufwand:** mittel, 2 `pa`. Erster `pa`: Breite, flache Buchten, gerade Laufgräben, Plätze. Zweiter `pa`: Wand- und Querwandbilder.

### Sichtbare Fehler (zusätzlich zu Teil 0)
- `t0_stelle2_schraeg_jetzt_alt.jpg`, links, Mitte: An der Einmündung des Laufgrabens fehlen Wände und Lippe, der Trupp steht scheinbar auf der Wiese vor einem dunklen Block.
- `t0_stelle2_schraeg_jetzt_alt.jpg`, links, oben Mitte: Scharfschützen liegen auf den Lippen statt im Graben.
- `t0_stelle1_nah_jetzt_alt.jpg`, links: Die Lippen enden als gerade, harte Balken und stehen seitlich über die Grabenkante hinaus.
- `t0_stelle1_panzer_jetzt_alt.jpg`, links, rechte Grabenseite: Der Sandsackwall endet gerade abgeschnitten und liegt als heller Zopf neben einer dunklen Leiste.
- `a_nah_spiel_ziel.jpg`, links unten: Kisten stehen halb in der Seitenwand.
- `t0_weit_jetzt_alt.jpg`, links: Aus der Ferne sind Querwände und Sohle kaum zu unterscheiden, der Graben wirkt wie eine Reihe grauer Kästen.

## Teil B: Leistung nach G7e

**Hinweis zum Messwerkzeug:** `tools/leistung_messen.mjs` misst mit Grafikkarte nur in Schritten von 5,6 ms (der unsichtbare Chrome zeigt hier höchstens 180 Bilder je Sekunde). „5,6 ms“ heißt also „am Deckel“. Unterschiede darunter zeigt das Werkzeug nicht; die Tabellen in den Berichten G7d und G7e sind deshalb zu grob. Ich habe zusätzlich ohne diesen Deckel gemessen.

### Messtabelle (ms je Bild, 1920 × 1080, Mittel / schlechteste 5 %)

| Karte | Ansicht | vorher (Fable, vor L1) | jetzt, Werkzeug | jetzt, ohne Deckel |
|---|---|---|---|---|
| Grauwall | Zoom 1 | 7,9–9,2 / 12–15 | 6,6 / 11,2 | 6,6 / 13,3 |
| Grauwall | ganze Karte | 13,9–17,0 / 24–32 | 7,6 / 11,2 | 10,5 / 20,0 |
| Grauwall | Kamera ziehen | 6,4 / 10,8 | – | 4,3 / 8,6 |
| Grauwall | Sperrfeuer | 8,3 / 13,6 (Haubitze) | – | 6,1 / 12,7 (Mörser) |
| Sankt Ruß | Zoom 1 | 9,2 / 17 | 6,8 / 11,2 | siehe unten |
| Sankt Ruß | ganze Karte | 14,7 / 32 | 9,4 / 16,7 | siehe unten |
| Krähenfurt | Zoom 1 | nicht gemessen | 5,9 / 11,1 | 3,8 / 7,9 |
| Krähenfurt | ganze Karte | nicht gemessen | 8,5 / 16,7 | 6,9 / 11,8 |

- **Ruckler über 50 ms auf Grauwall: keiner.** Längstes Einzelbild 42 ms (ganze Karte), 35 ms beim Ziehen und beim Sperrfeuer.
- **Sankt Ruß ohne Deckel:** gleichmäßig 30,5 ms je Bild in beiden Ansichten. Mit dem Werkzeug im Lauf davor 6,8 und 9,4 ms. Das ist kein Rechenaufwand des Spiels, sondern eine Bremse außerhalb; die Ursache habe ich nicht geklärt. Es passt zum offenen Punkt aus der letzten Prüfung. **Bitte Sankt Ruß am echten Gerät ansehen.**
- Rohwerte: `b_messung_werkzeug.json`, `b_messung_ohne_deckel.json`.

### Neuer Graben gegen alten (`G7_ALT`), Grauwall, ohne Deckel

| Ansicht | alter Graben | neuer Graben |
|---|---|---|
| Zoom 1 | 7,7 / 14,6 | 6,6 / 13,3 |
| ganze Karte | 12,0 / 25,5 | 10,5 / 20,0 |
| nah am Graben | 4,3 / 9,3 | 4,1 / 8,7 |
| Kamera ziehen | 5,1 / 10,7 | 4,3 / 8,6 |
| Sperrfeuer | 8,1 / 15,5 | 6,1 / 12,7 |

Der neue Graben ist je Bild 0,2 bis 2 ms **billiger**. Er hat 974 statt 1710 Geländeteile.

### Bremsen 1–5
- **1 (Filter je Bild): gelöst** (L1).
- **2 (Geländeteile je Bild): nicht gebaut.** Auf dem Mess-PC ist sie nicht nötig: Alle Fälle liegen im Mittel bei höchstens 10,5 ms, und der neue Graben hat die Zahl der Teile fast halbiert. Für ein Digitalboard kann ich das nicht sagen; dort ist nicht gemessen. Den Anteil der Teile an der Bildzeit habe ich diesmal nicht neu aufgeschlüsselt.
- **3 (ganze Karte, alle Figuren voll): zum Teil gelöst** (Schatten als fertiges Bild). Das Zwischenbild je Trupp fehlt.
- **4 (voller Neuaufbau): laut G7e gelöst** für Panzersperre und Mühle. Nicht nachgemessen.
- **5 (Ladegröße): offen.** `index.html` hat jetzt 49,7 MB (vorher 45,6).

Offene Bremsen nach Nutzen:
1. Bremse 5, Figuren und Gelände nachladen: Aufwand klein bis mittel.
2. Bremse 3, Trupp-Zwischenbild in der Übersicht: Aufwand mittel.
3. Bremse 2: Aufwand mittel bis groß, erst nach einer Messung am Digitalboard entscheiden.

**Ist vor U5 noch eine Leistungsarbeit nötig? Nein, weil** alle gemessenen Fälle im Mittel unter 16,7 ms liegen, es auf Grauwall keinen Ruckler über 50 ms gibt und der neue Graben billiger ist als der alte. Offen bleibt nur die Frage, wie Sankt Ruß am echten Gerät läuft.

## Empfohlene Reihenfolge (3 Pakete)
1. **Reparatur** der Punkte 1 bis 5 aus Teil 0 in einem `pa`. Danach neue Spielbilder mit Einheiten im Graben und gewählter Einheit, auch in der Aufstellungsphase.
2. **Grabenform:** breiter, flache Buchten um Erdblöcke, gerade Laufgräben, Plätze neu, Querwände niedrig. Kein sim-Lauf nötig, weil die Grabenfelder gleich bleiben.
3. **Bilder:** Seitenwand und Querwand mit Oberseite neu malen lassen, Licht der Sohle anpassen, Einmündungen schließen.

## Bilder und Dateien in `entwurf/probe/fable_graben/`
- `t0_stelle1_panzer_jetzt_alt.jpg`, `t0_stelle1_nah_jetzt_alt.jpg`, `t0_stelle2_schraeg_jetzt_alt.jpg`, `t0_stelle3_sued_jetzt_alt.jpg`, `t0_weit_jetzt_alt.jpg`: jetzt | alter Graben, Aufstellungsphase, Mörser gewählt.
- `t0_ohne_und_mit_wahl.jpg`: dieselbe Stelle ohne und mit gewählter Einheit.
- `t0_grabenplaetze.json`: Abstand der Grabenplätze von der Grabenmitte je Feld.
- `a_nah_spiel_ziel.jpg`, `a_ganz_spiel_ziel.jpg`: Spiel | Zielbild.
- `a_r2_probe_nah.jpg`: jetzt | Buchten halb so tief | gerade Linien ohne Buchten.
- `a_r2_probe_lauf.jpg`, `a_r2_probe_weit.jpg`: jetzt | gerade Linien.
- `b_messung_werkzeug.json`, `b_messung_ohne_deckel.json`: Messwerte.

Die Proben liefen nur über `window.GB_PROBE` im Browser. In der Probe „gerade Linien“ fehlen Buchten, Querwände und Sandsackwall ganz; sie zeigt nur den Verlauf.
