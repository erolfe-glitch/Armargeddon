## 2026-11-27 – U7c (Punkt 142): Nachbesserung aus der Fable-Kurzprüfung

Gepusht:
- `82c5873`: Änderungen, Messung, Bild
- Abschluss-Commit mit index.html, CLAUDE.md und diesem Bericht

**Stand:**
- **Hänger:** keine. Alle Läufe einzeln nacheinander, keiner über 10 Minuten. Der unsichtbare Chrome ist geschlossen, der Server auf 8765 läuft weiter.
- **Tests:** Partietest „Konsole rot-frei, keine Fehler“, Regeltest in Ordnung. Fehler 5 habe ich einzeln nachgestellt: Ein starker Trupp bleibt nach dem durchgefallenen Test liegen, mit `U7C_ALT` weicht er wie vorher.
- **Video:** `entwurf/probe/video/U7c.mp4` (Grauwall, 25,3 s, mit Ton).
- **Sitzung:** Vorgesehen war Opus, Mittel, gelaufen ist das Paket mit **Sonnet**.

**Behoben** (alles unter dem Rückweg `U7C_ALT`):

| Fehler | Änderung |
|---|---|
| 1 | „Wankende in Deckung“ misst die Feindnähe am Standort des Trupps. |
| 2 | Ein wankender Trupp wird nicht mehr durch den Deckungszuschlag vom Zielfeld weggelockt. |
| 3 | Neue Funktion „Ziel ist zerschlagen“: Fähigkeiten lassen solche Ziele aus, Zweitwaffe und Breitseite nehmen sie zuletzt, Dauerfeuer und Faustsalve rechnen ×0,3 ohne +3. |
| 4 | Beim Zurückweichen meiden Trupps Gas und Feuer (−4) und Draht (−4 statt −2, außer drahtfeste). |
| 5 | Nach einem durchgefallenen Entsetzenstest werden wie früher nur schwache Trupps zurückgeworfen. |
| 6 | Nur der Kommentar ist berichtigt. Der Feuerschlag wird nicht schwächer. **Berichtigung zum Bericht U7b Teil 2:** „Wankt ×0,85“ gilt für Geschütze, Mörser und Sperrfeuer, **nicht** für den Feuerschlag. |
| 7 | Die KI bekommt +1,5 für Schüsse, die einen Panik-Trupp unter 15 Stärke drücken. |
| 8 | Zurückweichen kennt jetzt auch Haus, Kapelle und Mühle als Deckung. |
| 9 | Die vordere Faust nutzt denselben Wert wie `MUZ_FIG`/`MUZ2` (0,984). Im Bild sitzt der Punkt wenige Pixel vor der Laufspitze: `entwurf/probe/u7c/faustsalve_punkte.jpg`. Der Rückweg-Schalter gilt hier nicht. |

Zielfelder werden nicht standhafter, wie du es wolltest.

**Messung** (MISCHEN=1, 4 × 100 Schlachten je Karte, weil `u7b.json` ein Mittel aus vier Startwerten ist; `entwurf/probe/u7/u7c.json`):

| Karte | U7b → U7c | Läufe |
|---|---|---|
| Grauwall | 52 % → **49,5 %** (−2,5) | 52/44/56/46 |
| Sankt Ruß | 45,75 % → **46,25 %** (+0,5) | 46/43/46/50 |
| Winterdorf | 57,25 % → **57,5 %** (+0,3) | 60/53/58/59 |

- Alle drei Karten liegen in der Streuung von ±4, die Runden bleiben gleich.
- Auf der Flucht werden noch einmal 11–17 % weniger Trupps vernichtet, weil die KI Zerschlagene nun auch mit Fähigkeiten und Zweitwaffen in Ruhe lässt. Etwas mehr entkommen am Rand.
- Zurückweichen, Fluchten und Sammeln bleiben praktisch gleich.

**Fragen an Enrico:** keine. Als Nächstes kommt laut Auftrag UI1 Teil 1.

## 2026-11-27 – U7b Teil 2 (Punkt 136) und Punkt 138.3

Gepusht:
- `7d3d59c`: Regeln, KI, Texte, Messungen, Bilder
- Abschluss-Commit mit index.html, CLAUDE.md und diesem Bericht

**Stand:**
- **Hänger:** keine. Alle Läufe einzeln nacheinander, keiner über 10 Minuten. Der unsichtbare Chrome ist geschlossen, der Server auf 8765 läuft weiter.
- **Tests:** Partietest „Konsole rot-frei, keine Fehler“, Regeltest in Ordnung. Die neuen Regeln habe ich zusätzlich einzeln geprüft, mit und ohne Schalter: Halten, Zurückweichen trotz Niederhalten, letzter Versuch am Rand (40 von 200 sammeln sich, vorher 0), wankendes Geschütz ×0,85.
- **Video:** `entwurf/probe/video/U7b_teil2.mp4` (Sankt Ruß, 25,3 s, mit Ton).
- **Sitzung:** Vorgesehen war **Opus, Hoch**, gelaufen ist das Paket mit **Sonnet**. Wenn dir das bei Regeln und KI wichtig ist, lass die Fable-Prüfrunde oder eine Opus-Sitzung darüberschauen.
- **Panne unterwegs:** Ein `sed -i` hatte in `ui.js` die Windows-Zeilenenden entfernt. Vor dem Commit habe ich sie Zeile für Zeile aus dem letzten Stand wiederhergestellt. Der Unterschied umfasst nur die echten Änderungen.

**Gebaut** (jeder Teil hat einen eigenen Rückweg):
- **Nr. 3, KI** (`KI_U7B_ALT`):
  - Schüsse auf Zerschlagene zählen nur noch ×0,3, ohne den Zuschlag „Ziel bricht“. Das gilt auch für den Reiter-Bonus.
  - Die Schwellen kommen jetzt aus den Regelwerten und richten sich nach der Deckung.
  - Wankende Trupps ziehen in Deckung, wenn Gegner bis 5 Felder nah sind.
  - Den Sammeln-Befehl prüft die KI jetzt auch nach dem Ziehen.
- **Nr. 4, kleine Regelstellen** (`U7B4_ALT`):
  - Am Rand wird erst ein letzter Sammelversuch gewürfelt.
  - Ein Panik-Trupp unter 15 Stärke ist zerschlagen, die Punkte zählen sofort. Neue Meldung „Zerschlagen!“.
  - Ein MG ist auf der Flucht abgebaut.
  - Es gibt nur noch eine Quelle für Deckung. Haus, Kapelle und Mühle erholen sich jetzt wie andere Gebäude. Den halben Moralverlust habe ich bewusst nicht ausgeweitet.
  - „Wankt“ ×0,85 gilt auch für Geschütze, Mörser, Sperrfeuer und Feuerschlag.
  - Die Kettenflucht nutzt die Schwelle je nach Deckung.
- **Nr. 5** (`HALTEWEICH_ALT`): „Halten um jeden Preis“ und ein aufgepflanztes Banner verhindern auch das Zurückweichen.
- **Nr. 6** (`WEICHEN_ALT`): Der Treffer, der unter die Schwelle drückt, wirft den Trupp ein Feld zurück, auch wenn er ihn zugleich niederhält. Wer schon darunter liegt, bleibt liegen.
- Die Regeltexte sind angepasst.
- Nicht geändert (Teil von Fehler 12): Ein Fliehender ohne freies Feld und ohne Gegner daneben bleibt weiter stehen. Das ist selten.

**Zwischenmessungen** (Konkordat-Quote, MISCHEN=1, Startwerte 1 und 2; Ausgang = dieselben Startwerte von Schritt 3):

| Karte | Ausgang | nach Nr. 3 | nach Nr. 4 | nach Nr. 5/6 |
|---|---|---|---|---|
| Grauwall | 49 | 52,5 | 52 | 53,5 |
| Sankt Ruß | 46 | 42,5 | 41,5 | 44,5 |
| Winterdorf | 57,5 | 60 | 56,5 | 57 |

**Voller Lauf** (4 Startwerte × 100, `entwurf/probe/u7/u7b.json`):

| Karte | Schritt 3 → U7b | Läufe |
|---|---|---|
| Grauwall | 48,25 % → **52 %** (+3,8) | 61/46/59/42 |
| Sankt Ruß | 48,25 % → **45,75 %** (−2,5) | 43/46/47/47 |
| Winterdorf | 56,5 % → **57,25 %** (+0,8) | 56/58/56/59 |

Alle drei Karten liegen in der Streuung von ±4, Grauwall knapp. Die einzelnen Läufe dort schwanken stark (42–61). Die Runden bleiben gleich.

| je Schlacht (Konkordat / Aschenwacht) | Grauwall | Sankt Ruß | Winterdorf |
|---|---|---|---|
| zurückgewichen | 3,6 / 4,1 → 5,9 / 6,2 | 9,8 / 9,3 → 14,8 / 12,7 | 4,9 / 4,7 → 8,6 / 8,4 |
| Flucht | 4,7 / 4,5 → 4,1 / 4,2 | 7,8 / 5,9 → 7,3 / 5,5 | 4,9 / 5,1 → 4,5 / 4,7 |
| vernichtet auf der Flucht | 2,3 / 2,3 → 1,5 / 1,6 | 3,6 / 2,6 → 2,5 / 1,8 | 2,6 / 2,1 → 1,8 / 1,3 |
| auf der Flucht zerschlagen (neu) | 0,3 / 0,6 | 0,9 / 0,8 | 0,7 / 0,7 |
| gesammelt | 0,47 / 0,71 → 0,41 / 0,73 | 1,36 / 1,41 → 1,39 / 1,47 | 0,60 / 0,85 → 0,61 / 0,99 |
| davon durch Befehl | 0,04 / 0,13 → 0,03 / 0,10 | 0,21 / 0,28 → 0,19 / 0,31 | 0,06 / 0,09 → 0,06 / 0,08 |

- **Zurückweichen** passiert jetzt 40–80 % häufiger. Das ist die Wirkung von Nr. 6.
- **Auf der Flucht vernichtet** werden rund 30 % weniger, weil die KI Zerschlagene nicht mehr jagt.
- **Der zweite Sammeln-Befehl bringt praktisch nichts:** Der Befehl wird weiter genauso selten genutzt. Die Anführer stehen meist nicht nah genug an den Fliehenden.

**Nr. 7 – nur gemessen** (`P_MOR_PER_DMG=1` statt 0,8; **nur 1 Startwert**, also grob; nichts eingebaut), Werte Konkordat / Aschenwacht:

| Karte | Quote 0,8 → 1,0 | Panik-Fluchten | zerschlagen | gesammelt |
|---|---|---|---|---|
| Grauwall | 61 → 60 % | 1,3 / 2,6 → 2,1 / 3,5 | 2,7 / 1,3 → 2,4 / 1,1 | 0,4 / 0,6 → 0,8 / 1,2 |
| Sankt Ruß | 43 → **56 %** | 4,3 / 3,3 → 5,8 / 4,6 | 2,8 / 1,4 → 2,3 / 1,1 | 1,5 / 1,4 → 2,0 / 2,1 |
| Winterdorf | 56 → 61 % | 2,2 / 2,9 → 3,9 / 4,2 | 2,4 / 2,0 → 1,7 / 1,3 | 0,6 / 1,0 → 1,4 / 1,5 |

- Mit 1,0 gibt es deutlich mehr Panik statt „zerschlagen“, und gesammelt wird fast doppelt so oft.
- Sankt Ruß (+13) und Winterdorf (+5) verschieben sich zum Konkordat. Meine Empfehlung: **so nicht übernehmen**, höchstens nach einem Kartenabgleich.

**Punkt 138.3:**
- **Faustsalve des Eisenknechts:** Sie war falsch. Die Blitze entstanden unter bzw. mitten in den Läufen und wurden nicht gespiegelt. Jetzt kommen sie aus beiden Laufspitzen (`entwurf/probe/u7b/4_faustsalve_punkte.jpg`).
- **Landkoloss nach hinten:** Er schießt richtig aus dem hinteren Seiten-MG (`5_koloss_hinten.jpg`). Den Punkt habe ich eine Spur an den Lauf herangerückt.

**Fragen an Enrico:**
1. Nr. 7: So lassen (0,8), oder soll der Berater einen Kartenabgleich mit 1,0 einplanen?
2. Soll die Fable-Prüfrunde auch U7b Teil 2 ansehen, weil es mit Sonnet statt Opus gebaut wurde?

## 2026-11-27 – Fix F3 (Punkt 135) und U7b Teil 1 (Punkt 136)

Gepusht:
- `ca55c0a`: U7b Teil 1 (nur Anzeige)
- `2d77fef`: F3
- Abschluss-Commit mit index.html, CLAUDE.md und diesem Bericht

**Stand:**
- **Hänger:** keine. Alle Browser-Läufe einzeln nacheinander, keiner über 10 Minuten. Der unsichtbare Chrome ist geschlossen, der Server auf 8765 läuft weiter.
- **Tests:** Partietest „Konsole rot-frei, keine Fehler“, Regeltest in Ordnung. Keine Regel geändert, deshalb keine neue Messung.
- **Video:** `entwurf/probe/video/F3_U7b1.mp4` (Grauwall, 25,3 s, mit Ton).
- **Panne unterwegs:** `src/index.html` hat gemischte Zeilenenden. Mein erstes Skript hat deshalb statt einer Zeile einen ganzen Block ersetzt. Das fiel beim Bauen sofort auf (295 KB statt 29 MB). Ich habe die Datei vor jedem Commit wiederhergestellt und nur die eine Zeile ersetzt.

**U7b Teil 1 – Anzeige (Fehler 1, 2, 3, 13, 14, 15):**
- **Eine Quelle:** Marke, Balken auf Karte und Einheitenkarte und Tooltip rechnen jetzt alle wie die Regeln (`E.moralStufe`).
- **Marke „Weicht“** (vorher „Moral wankt“): Sie nennt die Schwelle, die für den Standort gilt (30, in Deckung 20).
- **Einheitenkarte:** Der Balken ist bei *wankt* gelb und bei *weicht* rot. Geschütze flackern nicht mehr und werden nie als „weicht“ gemeldet.
- **Marke „Flieht“** hat zwei Texte:
  - zerschlagen: „Reste ziehen ab und kommen nicht wieder“,
  - Panik: Sammel-Chance zu Beginn der nächsten Runde.
- **Balken-Tooltip:** zum Beispiel „wankt unter 42, weicht unter 30 (in Deckung unter 20)“.
- **Info-Fenster:** Moral jetzt „70“ statt „7“.
- **Regeln-Fenster:** „Moral und Flucht“ als Leiter (wankt, weicht, Panik, zerschlagen), Sammeln als kurze Liste, „eingegraben“ ergänzt.
- **Bilder:** `entwurf/probe/u7b/1_marke_weicht.jpg`, `2_karte_wankt.jpg`, `3_regeln.jpg`.

**F3 – Turm-MG am Sturmpanzer:**
- **Ursache:** Der Mündungspunkt saß schon richtig auf der Laufspitze, in beiden Blickrichtungen. `fuss`/`fuss2` rechnen ihn auch richtig um. Der Fehler war die **Leuchtspur**: Ihr Kopf startete an der Mündung, und ihre volle Länge ragte sofort nach hinten, quer über den MG-Schützen.
- **Fix:** Die Spur wird erst mit dem zurückgelegten Weg lang und reicht nie hinter die Mündung. Das gilt für alle Leuchtspuren. Rückweg `window.SPUR_ALT`.
- **Bilder:** `entwurf/probe/f3/turm_mg_vorher_spur_ueber_schuetzen.jpg` (Fehlerbild, Spalte rechts) und `entwurf/probe/f3/turm_mg_nachher.jpg`.

**Übrige Mündungen** (`entwurf/probe/f3/vorher_punkte.jpg`, `andere_punkte_vorher.jpg`, `andere_punkte_nachher.jpg`, der berechnete Punkt ist rot):

| Waffe | Befund | geändert |
|---|---|---|
| Sturmpanzer Bugkanone und Turm-MG, Landkoloss Kanone, Kreuzschreiter Löwenmaul, Eisenknecht Kanone | passt | nein |
| Turmschreiter **Turm-MG** | schoss aus der Hauptkanone (eine Sonderregel überging den Messwert) | ja, jetzt aus dem MG an der Brust |
| Turmschreiter Kanone | etwas zu hoch | ja |
| Ordensschreiter | über und hinter dem Lauf | ja |
| Säge- und Klauenschreiter | mitten im gemalten Feuer statt am Lauf | ja |
| Landkoloss **Seiten-MG** | aus der glatten Bordwand | ja, aus dem seitlichen Erker (Ziel hinten: hinteres MG) |
| Kreuzschreiter **Unterarm-Kanone** | in der Luft neben den Schornsteinen | ja |

- Die Faustsalve des Eisenknechts hat einen eigenen Weg ohne `MUZ`; die habe ich nicht geprüft.
- Den Schuss des Landkolosses nach hinten habe ich nicht im Bild geprüft.

**Fragen an Enrico:**
1. Beim Turmschreiter habe ich als „Turm-MG“ das kleine MG vorn an der Brust genommen, nicht das große, tief hängende MG am Arm. Ist das richtig?

## 2026-11-27 – Paket F2b (Punkt 133): Größe der Führung, Fahne kräftiger

Gepusht:
- `ffcd417`: Größen, Fahne, Bildwerkzeuge und Bilder
- Abschluss-Commit mit index.html, CLAUDE.md und diesem Bericht

**Stand:**
- **Hänger:** keine. Alle Browser-Läufe einzeln nacheinander, keiner über 10 Minuten. Der unsichtbare Chrome ist geschlossen, der Server auf 8765 läuft weiter.
- **Partietest:** einmal, „Konsole rot-frei, keine Fehler“.
- **Video:** `entwurf/probe/video/F2b.mp4` (Grauwall, 25,3 s, 24,9 Bilder/s, mit Ton).
- **Sitzung:** Das Paket lief in der Fable-Sitzung, in der du `pa` getippt hast, nicht mit Sonnet/Mittel wie im Auftrag vorgeschlagen.
- Ältere Berichte (Paket W1 und davor) sind nach `BERICHT_ARCHIV.md` gewandert, weil BERICHT.md über 1900 Zeilen lang war.

**1. Fahne:** `a` steht jetzt auf 2 % der Bildhöhe statt 1,2 %. Kopf und Hand bleiben ruhig. Rückweg `window.FAHNE_SANFT`.

**2. Größe der Führung (5b):**
- Gemessen habe ich in den Figurenbildern die Scheitelhöhe über den Sohlen, ohne Helmspitze, Fahne und Gewehr. 320 Bildpunkte sind eine Soldatenhöhe. Die Werte sind am vergrößerten Bild abgelesen, auf etwa ±3 genau.
- Der Liniensoldat hat den Scheitel bei 309 (Konkordat) bzw. 305 (Aschenwacht). Er steht aber breitbeinig und geduckt und hat einen deutlich größeren Kopf als die Führungsfiguren (Helmbreite Konkordat 66 gegen 51–57).
- **Meine Auslegung von „Kopfhöhe gleich“:** Stehende Männer (Fahnenträger, Melder) kommen auf das 1,08-Fache des Linien-Scheitels, der Offizier 4 % darüber, der General 6 % darüber. Bei genau gleichem Scheitel wäre der Konkordat-Offizier unverändert geblieben (er lag schon bei 319) und hätte neben der Linie weiter schmächtig gewirkt.
- Die laufenden Melder sind so gesetzt, dass sie nicht größer werden als der stehende Melder, gegen den sie beim Ziehen getauscht werden.
- Der Faktor hängt am Platz in der Gruppe. Die Befehls-Posen des Offiziers wachsen also mit.
- Umsetzung: `GRUPPE_GR` in ui.js (Faktor je Bild, nur Anzeige, die Bilder selbst sind unverändert). Rückweg `window.GRUPPE_GR_ALT`.

| Teil | Scheitel vorher | Scheitel nachher | Faktor |
|---|---|---|---|
| **Konkordat** Liniensoldat (Maß) | 309 | 309 | – |
| Hauptmann: Offizier | 319 | 348 | 1,09 |
| Hauptmann: Fahnenträger | 287 | 333 | 1,16 |
| Melder steht | 310 | 335 | 1,08 |
| Hauptmann: Melder läuft | 292 | 310 | 1,06 |
| General | 304 | 353 | 1,16 |
| General: Fahnenträger | 248 | 322 | 1,30 |
| General: Melder läuft | 262 | 328 | 1,25 |
| MG-Trupp, kniende Bedienung (kniende Linie 257) | 230 | 253 | 1,10 |
| **Aschenwacht** Liniensoldat (Maß) | 305 | 305 | – |
| Hauptmann: Offizier | 302 | 341 | 1,13 |
| Hauptmann: Fahnenträger | 264 | 330 | 1,25 |
| Melder steht | 305 | 329 | 1,08 |
| Hauptmann: Melder läuft | 288 | 328 | 1,14 |
| General | 315 | 350 | 1,11 |
| General: Fahnenträger | 261 | 329 | 1,26 |
| General: Melder läuft | 281 | 329 | 1,17 |
| MG-Trupp, kniende Bedienung (kniende Linie 270) | 237 | 265 | 1,12 |
| Panzerbüchse, kniende Bedienung | 240 | 269 | 1,12 |

**3. Übrige Gruppenteile gegen die Linie geprüft:**
- **MG-Trupps beider Seiten und Panzerbüchse der Aschenwacht:** Die kniende Bedienung war 10–14 % kleiner als der kniende Liniensoldat. Ich habe die ganze Gruppe samt Waffe um 10 bzw. 12 % vergrößert, damit das Verhältnis Mann zu Waffe gleich bleibt.
- **Sanitäter, Versorgung, Fernsprech, Beiwerk:** nicht geändert. Die stehenden Figuren liegen bei 310–345 und damit im selben Bereich wie die Führung jetzt. Der winkende Sanitäter und die beiden Kabelleger des Konkordats sind etwa 5–8 % kleiner als ihre Nachbarn, das fällt im Spiel nicht auf.
- Die Panzerbüchse des Konkordats hat keinen Gruppenbogen, sie zeigt weiter das alte Einzelbild.

**4. Bilder** (je Bild links der Linientrupp, rechts die Gruppe, gleiche Bildhöhe):
- Führung: `entwurf/probe/f2b/vorher_uebersicht.jpg` und `entwurf/probe/f2b/nachher_uebersicht.jpg`.
- Übrige Gruppen: `entwurf/probe/f2b/vorher_uebrige.jpg` und `entwurf/probe/f2b/nachher_uebrige.jpg`.
- Einzelbilder in voller Größe: `entwurf/probe/f2b/vorher/` und `entwurf/probe/f2b/nachher/`.
- Neues Werkzeug: `node tools/f2b_bilder.mjs <ordner>`, Übersichten mit `python tools/f2b_uebersicht.py`.

**Fragen an Enrico:**
1. Passt die Größe der Führung so (stehende Männer 8 % über dem geduckten Liniensoldaten, Offizier noch etwas darüber)? Empfehlung: so lassen. Wenn du den Scheitel genau gleich willst, sind es in `GRUPPE_GR` überall 8 % weniger.
2. Die MG-Trupps und die Panzerbüchse sind 10–12 % größer geworden. Empfehlung: so lassen. Wenn dir das zu viel ist, nehme ich es zurück.

## 2026-11-27 – U7 Schritt 3 (Punkt 125) und Fix F2 (Punkt 130)

Gepusht:
- `3a3a2a8`: U7 Schritt 3
- `b06ebb9`: Fix F2
- Abschluss-Commit mit index.html, CLAUDE.md und diesem Bericht

**Stand:**
- **Hänger:** keine. Alle Läufe einzeln nacheinander, keiner über 10 Minuten. Der unsichtbare Chrome ist geschlossen, der Server auf 8765 läuft weiter.
- **Tests:** Partietest zweimal „Konsole rot-frei, keine Fehler“, nach U7 Schritt 3 und nach F2. Regeltest in Ordnung, 5 neue P-Schlüssel, jetzt 199.
- **Video:** `entwurf/probe/video/U7_schritt3_F2.mp4` (Grauwall, 25,4 s, 24,7 Bilder/s, mit Ton).

**U7 Schritt 3 – Moral in Stufen:**
- Die neue Funktion `moralStufe(G, u)` gilt für Regel, Anzeige und KI. Sie liefert *standhaft*, *wankt*, *weicht* oder *flieht*.
- **Wankt:** Ein Trupp wankt unter 60 % seiner Typmoral, die Linie also unter 42.
  - Schuss, Nahkampf und Gegenschlag wirken dann nur noch zu 85 %.
  - Niedergehalten ist er schon ab halb so viel Beschuss (`P.SUPP_WANKT` 0,3 statt 0,6).
- **Erholung:** Niedergehaltene erholen sich jetzt in Graben, Bunker, Gebäude oder eingegraben zur Hälfte (`P.RECOVER_SUPP`). Im Offenen erholen sie sich wie bisher gar nicht.
- **Zurückweichen:** In Graben, Bunker, Gebäude oder eingegraben weicht ein Trupp erst unter Moral 20 zurück (`P.FALLBACK_DECKUNG`), sonst unter 30.
- **Anzeige:**
  - Der Moralbalken ist bei *wankt* gelb und flackert bei *weicht*. Das gilt auf der Karte und auf der Einheitenkarte.
  - Beim Anwählen pulsiert der Schweißtropfen. Zu Rundenbeginn erscheint er nur, wenn der Trupp beim nächsten Treffer weicht.
  - Neue Vorschau-Schlagworte: „wankt ×0,85“ und „Ziel wankt: leichter niedergehalten“.
  - Der Tooltip des Balkens nennt die Stufe. Das Regeln-Fenster und die Legende der Kopfzeichen sind ergänzt.
- **KI:** Sie bekommt einen Zuschlag `W_WANKT` 0,6 für Schüsse, die ein Ziel unter die Schwelle zum Wanken drücken.
- **Rückweg:** `STUFEN_ALT`, in Node als Umgebungsvariable, im Browser `window.STUFEN_ALT`.

**Messung** (MISCHEN=1, vier Startwerte zu je 100 Schlachten je Karte, Werte je Schlacht Konkordat / Aschenwacht, `entwurf/probe/u7/schritt3.json`):

| Karte | Konkordat Schritt 2 → Schritt 3 | Läufe |
|---|---|---|
| Grauwall | 50,5 % → 48,25 % (−2,3) | 54/44/54/41 |
| Sankt Ruß | 46 % → 48,25 % (+2,3) | 47/45/53/48 |
| Winterdorf | 58,5 % → 56,5 % (−2,0) | 54/61/55/56 |

Alle drei Karten liegen in der Streuung von ±4. Die Runden bleiben gleich (15,2 / 14,2 / 14,2).

| je Schlacht | Grauwall | Sankt Ruß | Winterdorf |
|---|---|---|---|
| Rundenanfänge „wankt“ | 6,7 / 8,0 | 13,6 / 14,3 | 9,3 / 8,3 |
| Rundenanfänge „weicht“ | 4,8 / 5,3 | 14,0 / 13,8 | 9,5 / 7,9 |
| niedergehalten | 35,3 / 23,1 → 36,0 / 24,8 | 44,2 / 22,3 → 45,9 / 25,3 | 38,6 / 26,2 → 38,9 / 27,8 |
| zurückgewichen | 5,0 / 5,6 → 3,6 / 4,1 | 12,4 / 11,4 → 9,8 / 9,3 | 6,5 / 6,7 → 4,9 / 4,7 |
| Flucht | 4,6 / 4,4 → 4,7 / 4,5 | 7,7 / 5,7 → 7,8 / 5,9 | 5,0 / 5,0 → 4,9 / 5,1 |
| gesammelt | 0,44 / 0,66 → 0,47 / 0,71 | 1,24 / 1,35 → 1,36 / 1,41 | 0,6 / 0,81 → 0,6 / 0,85 |

- Wankend oder weichend sind etwa 4–11 % der Rundenanfänge. Das passt zur Erwartung von 6–10 % aus der Fable-Prüfung.
- Das Zurückweichen sinkt um 20–30 %, vor allem durch die Schwelle von 20 in der Deckung.
- Niedergehalten wird etwas öfter (+2–14 %), vor allem bei der Aschenwacht.
- Die Fluchten bleiben gleich.

**Fix F2 – Gruppen wie Pappaufsteller:**
1. **Schatten:**
   - Jede Gruppe hat jetzt einen gemeinsamen weichen Bodenschatten, der die Teile verbindet.
   - Der Kontaktschatten jedes Teils ist etwas größer, das gilt auch für das Beiwerk.
   - Im Graben liegt der Schatten wie bisher auf der Sohle.
   - Rückweg `window.GRUPPENSCHATTEN_ALT`.
2. **Plastik-Karten:** Ich habe alle 45 Teile aus U4 Teil 3 und Teil 5 samt Beiwerk neu gerechnet. Das Ergebnis war byte-gleich, die Karten waren also schon richtig. Neu gerechnet sind nur die beiden neuen Melder.
3. **Enger gestellt:**
   - Führung: Der Offizier steht vorn in der Mitte, der Fahnenträger halb dahinter und etwas versetzt, der Melder dicht daneben. Alle stehen im Ring.
   - MG-Trupps, Panzerbüchse, Sanitäter, Versorgung und Fernsprech stehen dichter. Das Beiwerk bleibt sichtbar.
   - Rückweg `window.GRUPPE_WEIT`, vor dem Laden setzen.
4. **Eigenbewegung:**
   - Jede Figur atmet leicht (±0,9 % Höhe, etwa 2,4 s) und verlagert langsam ihr Gewicht (±0,7°, etwa 7 s), jede versetzt zu den anderen. Rückweg `window.ATEM_ALT`.
   - Die Fahne der Führung weht leicht: Das Tuch wellt sich vom Stab weg, das hängende Banner des Konkordat-Hauptmanns schwingt seitlich.
   - Kopf und Hand bleiben stehen, die Welle läuft dort weich aus. Je Bild werden 16 Wellenbilder einmal gerechnet. Rückweg `window.FAHNE_STILL`.
   - Bei Bildwirkung „aus“ bewegt sich nichts, beim Ziehen und in Posen auch nicht.
5. **Melder neu:**
   - Zwei Bilder über fal (Nano Banana 2 Edit, etwa 0,24 $), Übersicht `entwurf/probe/fal/20261127_1803_uebersicht.jpg`.
   - Abzeichen sind keine zu sehen: kein Totenkopf, kein Kreuz, kein Adler.
   - Die Bilder sind als `konkordat_melder_steht` und `aschenwacht_melder_steht` freigestellt (1,0 SH), eingebettet, mit Plastik-Karte und robocopy-Sicherung.
   - Im Spiel steht der Melder in Ruhe. Beim Ziehen und bei Befehlen des Offiziers läuft er wie bisher. Rückweg `window.MELDER_STEHT_ALT`.
6. **Bilder:**
   - Übersichten: `entwurf/probe/f2/vorher_uebersicht.jpg` und `entwurf/probe/f2/nachher_uebersicht.jpg`. Sie zeigen Hauptmann Konkordat, Hauptmann Aschenwacht, General Konkordat, MG-Trupp, Sanitäter und Versorgung.
   - Einzelbilder liegen in `entwurf/probe/f2/vorher/` und `entwurf/probe/f2/nachher/`, nachher zusätzlich General Aschenwacht, Panzerbüchse, Werkstatt und Fernsprech.

**Fragen an Enrico:**
1. Wirken die Gruppen jetzt dicht genug, oder sollen Fahnenträger und Melder noch näher an den Offizier?
2. Ist die Fahnenbewegung so richtig („leicht“), oder darf sie etwas kräftiger sein? Der Wert dafür ist `a` in `FAHNE_WEHT`, jetzt 1,2 % der Bildhöhe.
3. U7 ist damit fertig. Soll der Berater jetzt den Prüfauftrag für die Fable-Prüfrunde U7 schreiben?

## 2026-11-27 – U7 Schritt 2 (Punkt 125/86) und Fix F1 (Punkt 127)

Gepusht:
- `8ea4cff`: F1 und Vermerk für U9
- `5e1c2f3`: U7 Schritt 2
- Abschluss-Commit mit index.html und diesem Bericht

**Stand:**
- **Hänger:** keine.
- **Tests:** Partietest „Konsole rot-frei, keine Fehler“, Regeltest in Ordnung (11 neue P-Schlüssel).

**Fix F1 – Nachschub-Menü verdeckt:**
- **Ursache:** Seit die Kategorie-Leiste (Linie / Unterstützung / Elite / Gerät, K1) dazukam, hat das Menü fünf Zeilen, das Raster war aber für vier gebaut. Die Reiterzeile (Alle, Kommando, Standard …) landete in der schrumpfbaren Zeile, wurde **0 px hoch** und lag unter den Karten. Das war der kaum sichtbare obere Teil.
- **Jetzt:** Raster mit fünf Zeilen. Titel, Kategorien und Reiter sind bei jeder Größe ganz zu sehen, die Liste scrollt innen.
- **Gespeicherte Lage:** Eine Lage in `arm.shoppos`, die ins Unsichtbare zeigt, wird beim Öffnen zurückgeholt (das tat sie schon) und jetzt auch gleich so gespeichert.
- **Geprüft:** 1280×720, 1280×800, 1920×1080, 2560×1440, je mit normaler und mit verschobener Lage.
- **Bilder:** `entwurf/probe/f1/vorher/` und `entwurf/probe/f1/nachher/shop_*.jpg` (Werkzeug `node tools/f1_shop.mjs`).

**Kreuzschreiter:** Deine Antwort steht in IDEEN.md unter „Offen“: Die KI kauft sehr seltene Einheiten erst ab U9. Beim Speichern von IDEEN.md ist eine noch nicht eingecheckte Notiz des Beraters vom 26.11. (Armeeaufbau und Kampagne) mit eingecheckt worden.

**U7 Schritt 2 – Regeln** (Rückweg `FLUCHT_ALT`):
- **Zwei Arten Flucht:**
  - Stärke unter 15 = **zerschlagen**. Die Reste ziehen ab, das ist endgültig, und der Gegner bekommt die Punkte sofort.
  - Moral 0 = **Panik**, der Trupp ist sammelbar.
- **Langsamer:** Nach dem ersten Fluchtschritt (2 Felder) läuft der Trupp je Runde nur noch `P.FLUCHT_BP` 2 Felder. Am Rand ist er erst zu Beginn der nächsten eigenen Runde weg.
- **Sammeln zu Rundenbeginn** für jeden Fliehenden ohne Feind daneben (`sammelChance`):
  - Grundchance: allein 20 %, mit Hauptmann bis 2 Felder 60 %, mit General 80 %.
  - Deckung +15 %, Banner bis 2 Felder +20 %, je früherem Sammeln −15 %, höchstens 90 %.
  - Gesammelt hat er Moral 35 (vorher 30, genau die Rückzugsschwelle). Nicht in der Runde, in der die Flucht begann.
- **Befehl „Sammeln“ auf Fliehende (Punkt 86):**
  - Er erreicht zusätzlich Fliehende bis 2 Felder (General 3), jeder würfelt mit `sammelChance` + 20 %.
  - Er kostet wie bisher die Aktion und einen der drei Befehle.
  - Die Chance steht am Knopf („Sammeln 80 %“) und im Hinweis je Trupp. Über dem Trupp erscheint sie im Wirkungsbereich (siehe Hinweis unten).
  - Misslungenes Sammeln erscheint als Meldung mit Prozent.
- **Verlust erst am Rand:** Fliehende in Panik zählen in den Verlusten halb, die 20 Punkte für den Gegner gibt es erst am Rand oder bei Vernichtung.
- **Fehler aus der Fable-Prüfung:**
  - **Behoben:** Gas-Flucht und Kettenflucht laufen über `routUnit` (Fehler 3), und die Kettenflucht trifft nur noch Wankende unter Moral 30. Heldenfall und „Kopf runter!“ prüfen auf Flucht (Fehler 5). Zurückweichen gibt es höchstens einmal je gegnerischer Runde (Fehler 6).
  - **Absichtlich unverändert:** Furcht-Aura und Entsetzen haben eigene Untergrenzen und lösen weiter keine Flucht aus.
  - **Mit den Regeln oben erledigt:** Fehler 2 (Moral 35 nach dem Sammeln) und Fehler 4 (Punkte erst am Rand).
- **KI:**
  - Der Anführer gibt „Sammeln“, wenn ein Fliehender mindestens 50 % Chance und 40 Stärke hat.
  - Anführer und Banner suchen Felder bis 2 Felder neben Wankenden oder Fliehenden (`W_SAMMEL` 1,5).
  - Fliehende Gegner nahe eines gegnerischen Anführers sind lohnendere Ziele (`W_FLUCHT_ZIEL` 2).
- **Erklärung:** Das Regeln-Fenster hat einen neuen Absatz „Moral und Flucht“ mit allen Chancen. Der Absatz „Anführer“ nennt jetzt Fliehende.

**Messung Schritt 1 → Schritt 2** (`MISCHEN=1`, je 4×100 Schlachten, Streuung etwa ±4):


**grauwall** – Konkordat 53.5 % → **50.5 %** (-3.0; Läufe 54/50/54/44), Runden 15.28 → 15.25

| je Schlacht (Konkordat / Aschenwacht) | vorher → nachher |
|---|---|
| Flucht | 4.72 / 4.44 → 4.6 / 4.43 |
| Flucht (Moral) | 1.89 / 2.84 → 1.74 / 2.73 |
| Flucht (Stärke) | 2.7 / 1.46 → 2.79 / 1.5 |
| Flucht (Gas) | 0.1 / 0.14 → 0.05 / 0.17 |
| Flucht (Kette) | 0.03 / 0.01 → 0.01 / 0.02 |
| gesammelt | 0.19 / 0.31 → 0.44 / 0.66 |
| gesammelt (Befehl) | 0 / 0 → 0.05 / 0.1 |
| Sammelbefehl misslungen | 0 / 0 → 0.02 / 0.04 |
| Sammel-Chance bestand | 0.18 / 0.33 → 0.86 / 1.24 |
| Rundenanfänge auf der Flucht | 3.16 / 2.21 → 5.01 / 3.19 |
| entkommen am Rand | 1.65 / 1.76 → 0.92 / 0.94 |
| vernichtet auf der Flucht | 2.1 / 1.89 → 2.28 / 2.29 |
| noch fliehend am Ende | 0.78 / 0.49 → 0.96 / 0.54 |
| zurückgewichen | 6.54 / 7.19 → 4.98 / 5.62 |
| niedergehalten | 35.53 / 23.08 → 35.32 / 23.14 |

**sanktruss** – Konkordat 46 % → **46 %** (0.0; Läufe 45/44/44/51), Runden 14.15 → 14.08

| je Schlacht (Konkordat / Aschenwacht) | vorher → nachher |
|---|---|
| Flucht | 7.47 / 5.63 → 7.73 / 5.71 |
| Flucht (Moral) | 4.66 / 3.73 → 4.69 / 3.59 |
| Flucht (Stärke) | 2.6 / 1.45 → 2.8 / 1.63 |
| Flucht (Gas) | 0.13 / 0.41 → 0.15 / 0.43 |
| Flucht (Kette) | 0.08 / 0.05 → 0.1 / 0.05 |
| gesammelt | 0.52 / 0.64 → 1.24 / 1.35 |
| gesammelt (Befehl) | 0 / 0 → 0.18 / 0.26 |
| Sammelbefehl misslungen | 0 / 0 → 0.14 / 0.18 |
| Sammel-Chance bestand | 0.45 / 0.55 → 2.67 / 2.11 |
| Rundenanfänge auf der Flucht | 4.79 / 3.38 → 7.71 / 5.61 |
| entkommen am Rand | 2.95 / 2.29 → 1.45 / 1.04 |
| vernichtet auf der Flucht | 3.14 / 2.09 → 3.64 / 2.44 |
| noch fliehend am Ende | 0.86 / 0.61 → 1.4 / 0.88 |
| zurückgewichen | 15.46 / 14.77 → 12.37 / 11.38 |
| niedergehalten | 44.21 / 22.58 → 44.23 / 22.28 |

**winterdorf** – Konkordat 56.75 % → **58.5 %** (+1.8; Läufe 54/63/57/60), Runden 14.22 → 14.35

| je Schlacht (Konkordat / Aschenwacht) | vorher → nachher |
|---|---|
| Flucht | 4.73 / 4.5 → 5.02 / 4.95 |
| Flucht (Moral) | 2.48 / 2.64 → 2.48 / 2.84 |
| Flucht (Stärke) | 2.19 / 1.79 → 2.46 / 2.03 |
| Flucht (Gas) | 0.04 / 0.06 → 0.06 / 0.05 |
| Flucht (Kette) | 0.02 / 0.01 → 0.01 / 0.02 |
| gesammelt | 0.22 / 0.22 → 0.6 / 0.81 |
| gesammelt (Befehl) | 0 / 0 → 0.06 / 0.09 |
| Sammelbefehl misslungen | 0 / 0 → 0.06 / 0.04 |
| Sammel-Chance bestand | 0.14 / 0.17 → 1.37 / 1.7 |
| Rundenanfänge auf der Flucht | 3.48 / 1.95 → 5.25 / 4.48 |
| entkommen am Rand | 1.48 / 2.29 → 0.53 / 1.39 |
| vernichtet auf der Flucht | 2.25 / 1.59 → 2.72 / 2.07 |
| noch fliehend am Ende | 0.78 / 0.4 → 1.17 / 0.69 |
| zurückgewichen | 7.26 / 7.88 → 6.48 / 6.74 |
| niedergehalten | 37.71 / 25.57 → 38.58 / 26.15 |

**Einordnung:**
- **Wie erwartet:**
  - Gesammelt wird zwei- bis dreimal so oft (0,2–0,6 → 0,4–1,35 je Seite und Schlacht).
  - Am Rand entkommen nur noch etwa halb so viele.
  - Das Zurückweichen sinkt um 10–20 %.
- **Siegquote:** innerhalb der Streuung (Grauwall −3, Sankt Ruß ±0, Winterdorf +2). Kein Ausgleich nötig.
- **Sammelbefehl der KI:** Sie nutzt ihn selten (0,05–0,26 je Schlacht), weil Anführer selten nah genug an Fliehenden stehen.

**Hinweis Anzeige:**
- Am Knopf und im Hinweis ist die Chance zu sehen (`entwurf/probe/u7/sammeln/sammeln_hinweis.jpg`).
- Die Prozentzahl über dem Trupp hängt am vorhandenen Wirkungsbereich beim Überfahren des Knopfs.
- Der Wirkungsbereich selbst erschien in den Aufnahmen des unsichtbaren Chrome nicht, auch nicht mit der neuen Testhilfe `__dbg.area('o-rally')`, obwohl sie einen Bereich meldet. Ob die Zahl dort erscheint, konnte ich deshalb nicht im Bild bestätigen. Bitte beim Spielen kurz darauf achten.

**Video:** `entwurf/probe/video/U7_schritt2_sanktruss.mp4` (25 s, 25 Bilder/s, mit Ton).

**Nächster `pa`:** U7 Schritt 3 (Moral in Stufen, „wankt“).

**Fragen an Enrico:**
1. Siehst du beim Überfahren von „Sammeln“ die Prozentzahl über dem fliehenden Trupp?

## 2026-11-27 – U7 Moral: Zähler, Grundmessung und Schritt 1 (Punkt 125)

Gepusht:
- `4249cbf`: Zähler und Grundmessung
- `e7cb7d6`: Schritt 1
- Abschluss-Commit mit index.html und diesem Bericht

**Stand:**
- **Hänger:** keine.
- **Tests:** Partietest „Konsole rot-frei, keine Fehler“, Regeltest in Ordnung (neue P-Schlüssel aufgenommen).
- **ui.js nach dem Hinweis geprüft:** Die andere Sitzung (Ton-Pult-Test, 16:26) hat nichts von mir überschrieben. Alle Änderungen aus U4, W1 und Schritt 1 sind drin. T1 habe ich nicht angefasst.

**Vorab: Zähler in sim.js.**
- **Was gezählt wird** (je Seite und Schlacht, Zeile „U7 Moral …“): niedergehalten, zurückgewichen, Flucht gesamt und nach Grund (Stärke / Moral / Kette / Gas), gesammelt, entkommen am Rand, vernichtet auf der Flucht, noch fliehend am Ende, Rundenanfänge auf der Flucht, Sammel-Chance bestand, Entsetzenstests mit Durchfallern und Wiederholungen, Furcht-Aura, Löwengebrüll (Ziele), Heldenfall, „hält stand“, Moralstufen der Fußtruppen und Niedergehaltene zu Rundenbeginn.
- **Ereignisse:** Die Ereignisse aus `startTurn`/`endTurn` werden mitgezählt.
- **Messwerkzeug:** `node tools/u7_messen.mjs <name>` (3 Karten × 4 Startwerte × 100 Schlachten, `MISCHEN=1`, nacheinander, etwa 12 min), Vergleich mit `node tools/u7_vergleich.mjs <vorher> <nachher>`. Die Ergebnisse liegen in `entwurf/probe/u7/*.json`.

**Schritt 1:**
- **Entsetzen:** höchstens ein Test je Einheit und gegnerischer Runde. Rückweg `ENTSETZ_OFT`.
- **Furcht-Aura** (Kürassier): Test zu Beginn der Runde mit `P.FURCHT_BASIS` 0,35 und denselben Einflüssen wie beim Entsetzen. Wer durchfällt, verliert Moral −1 wie bisher.
- **Löwengebrüll:** Test je Ziel mit `P.ROAR_BASIS` 0,5.
  - durchgefallen: wie bisher −2 und niedergehalten
  - bestanden: nur −0,5 (`P.ROAR_BESTANDEN`)
- **Rückweg** für Aura und Gebrüll: `FURCHT_ALT`.
- **Anzeige:** Wer besteht, bekommt das Kopfzeichen Funkeln, wer durchfällt, Angst. Das Protokoll nennt die Chance.
- **Texte:** Beschreibung der Furcht des Kürassiers und des Gebrülls im Info-Fenster angepasst. Dort stand noch „−4 Moral“ aus einer alten Fassung.

**Messung Grundmessung → Schritt 1** (`MISCHEN=1`, je 4×100 Schlachten; die Streuung zwischen den vier Läufen liegt bei etwa ±4 Punkten):


**grauwall** – Konkordat 50.5 % → **53.5 %** (+3.0; Läufe 56/53/53/52), Runden 15.3 → 15.28

| je Schlacht (Konkordat / Aschenwacht) | vorher → nachher |
|---|---|
| Entsetzenstests | 13.82 / 25.26 → 10.42 / 17.84 |
| Entsetzen durchgefallen | 3.13 / 5.9 → 2.18 / 3.92 |
| Entsetzen Wiederholung | 3.23 / 7.13 → 0 / 0 |
| Furcht-Aura | 1.26 / 0 → 1.19 / 0 |
| Löwengebrüll (Ziele) | 0 / 0 → 0 / 0 |
| niedergehalten | 36.08 / 23.75 → 35.53 / 23.08 |
| zurückgewichen | 6.95 / 8.22 → 6.54 / 7.19 |
| Flucht | 4.52 / 4.52 → 4.72 / 4.44 |
| Flucht (Moral) | 1.81 / 2.89 → 1.89 / 2.84 |
| Flucht (Stärke) | 2.59 / 1.43 → 2.7 / 1.46 |
| gesammelt | 0.23 / 0.29 → 0.19 / 0.31 |

**sanktruss** – Konkordat 43.25 % → **46 %** (+2.8; Läufe 47/42/49/46), Runden 14 → 14.15

| je Schlacht (Konkordat / Aschenwacht) | vorher → nachher |
|---|---|
| Entsetzenstests | 23.98 / 18.37 → 18.48 / 14.37 |
| Entsetzen durchgefallen | 5.38 / 3.73 → 4 / 2.97 |
| Entsetzen Wiederholung | 5.41 / 4.12 → 0 / 0 |
| Furcht-Aura | 1.04 / 0 → 0.96 / 0 |
| Löwengebrüll (Ziele) | 0 / 0 → 0 / 0 |
| niedergehalten | 44.32 / 22.12 → 44.21 / 22.58 |
| zurückgewichen | 16.25 / 15.54 → 15.46 / 14.77 |
| Flucht | 7.67 / 5.41 → 7.47 / 5.63 |
| Flucht (Moral) | 4.96 / 3.52 → 4.66 / 3.73 |
| Flucht (Stärke) | 2.51 / 1.4 → 2.6 / 1.45 |
| gesammelt | 0.5 / 0.62 → 0.52 / 0.64 |

**winterdorf** – Konkordat 58 % → **56.75 %** (-1.3; Läufe 52/61/59/55), Runden 14.2 → 14.22

| je Schlacht (Konkordat / Aschenwacht) | vorher → nachher |
|---|---|
| Entsetzenstests | 20.99 / 15.79 → 15.77 / 11.42 |
| Entsetzen durchgefallen | 5.15 / 4 → 3.89 / 2.95 |
| Entsetzen Wiederholung | 5.27 / 4.42 → 0 / 0 |
| Furcht-Aura | 1 / 0 → 1 / 0 |
| Löwengebrüll (Ziele) | 0 / 0 → 0 / 0 |
| niedergehalten | 37.55 / 25.73 → 37.71 / 25.57 |
| zurückgewichen | 7.83 / 8.63 → 7.26 / 7.88 |
| Flucht | 4.83 / 4.52 → 4.73 / 4.5 |
| Flucht (Moral) | 2.63 / 2.75 → 2.48 / 2.64 |
| Flucht (Stärke) | 2.12 / 1.69 → 2.19 / 1.79 |
| gesammelt | 0.24 / 0.21 → 0.22 / 0.22 |

**Gebrüll gesondert:**
- **Ohne Gebrüll in den Läufen:** Auch mit `MECHS=1` ist der Kreuzschreiter nicht in der Kartenarmee, und die KI kauft ihn nicht. Das Gebrüll kam deshalb in keinem Lauf vor (Grauwall 49,5 → 53,3 %, Sankt Ruß 42,5 → 42,8 %, `mechs_*.json`).
- **Gezielte Messung:** Grauwall mit einem zusätzlichen Kreuzschreiter (`EXTRA_A=kreuz:1`), vorher über die Rückwege:


**grauwall** – Konkordat 84 % → **80.5 %** (-3.5; Läufe 81/80/76/85), Runden 14.85 → 14.93

| je Schlacht (Konkordat / Aschenwacht) | vorher → nachher |
|---|---|
| Entsetzenstests | 12.79 / 33.86 → 9.64 / 23.28 |
| Entsetzen durchgefallen | 2.71 / 7.9 → 2.13 / 5.22 |
| Entsetzen Wiederholung | 2.99 / 11.24 → 0 / 0 |
| Furcht-Aura | 0.58 / 0 → 0.53 / 0 |
| Löwengebrüll (Ziele) | 3.06 / 0 → 3.22 / 0 |
| niedergehalten | 31.11 / 27.01 → 31.04 / 25.78 |
| zurückgewichen | 6.33 / 10.72 → 5.69 / 9.7 |
| Flucht | 3.45 / 6.28 → 3.33 / 6.21 |
| Flucht (Moral) | 1.58 / 4.13 → 1.5 / 3.87 |
| Flucht (Stärke) | 1.78 / 1.88 → 1.76 / 2.12 |
| gesammelt | 0.13 / 0.4 → 0.12 / 0.42 |

- **Lesart:** „Furcht-Aura“ zählt vorher die Abzüge, nachher die Tests (bestanden oder nicht). Der Unterschied in der Zeile ist deshalb kleiner als die eigentliche Wirkung.

**Einordnung:**
- **Wie erwartet:**
  - Die Wiederholungen sind weg, die Tests gehen um 23–31 % zurück, die Durchfaller um 1–2 je Schlacht.
  - Das Zurückweichen sinkt leicht.
- **Siegquote:** bewegt sich innerhalb der Streuung (Grauwall +3, Sankt Ruß +3, Winterdorf −1; mit Kreuzschreiter −3,5).
- **Ausgleich:** nicht nötig.

**Video:** `entwurf/probe/video/U7_schritt1_grauwall.mp4` (25 s, 25 Bilder/s, mit Ton).

**Nächster `pa`:** U7 Schritt 2 (Flucht langsamer, Sammeln für alle Fliehenden, Befehl „Sammeln“ auf Fliehende, Fehler 2–6).

**Fragen an Enrico:**
1. **Kreuzschreiter:** Die KI kauft ihn nie. Soll das so bleiben, oder soll ein Paket die KI ihn kaufen lassen?

