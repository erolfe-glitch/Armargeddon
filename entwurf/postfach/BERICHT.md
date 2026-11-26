## 2026-11-26 – R4 Regel-Paket, Zwischenstand: Schritte 0, 1 und 2 (Regeln) (`a7763bc`, `dabbae6`, `07dda01` mit index.html)

Gepusht. **Zwischenstand nach Sparregel 5:** Schritt 2 ohne die neuen Bögen, Schritt 3 (Stahlreiter) noch nicht begonnen.
- **Hänger:** keine. Partietest ohne Fehler, keine Seitenfehler, kein Chrome offen.
- **sim:** alle Läufe nacheinander, **kein Absturz**.
- **Download:** Den Download der Pferdetöne habe ich vorher bei dir bestätigt. Du hast ihn einmal unterbrochen; 7 der 12 Dateien lagen da schon (18:11), die übrigen 5 habe ich nachgeladen. Alle 12 sind gültige, verschiedene MP3s.

### Schritt 0 – Punkt 101 Pferdetöne (`a7763bc`)
- 12 Dateien in `sound-quelle/stahlreiter/` (ohne `dampf1`), gesichert nach OneDrive, eingetragen in `CREDITS.md`.
- Plätze `stahlreiter_<name>` in `sound_bau.json`. Im Ton-Pult unter **Pferde und Gespann → „Stahlreiter (gepanzertes Pferd)“**.
- **Vorläufig bei den Lanzenreitern:**
  - Anklicken = Schnauben durch Vox-Gitter (`maske_schnauben2`);
  - Ziehen = Galopp 1;
  - Getroffen „Wiehern“ = Wiehern 1.
- **Was nicht greift:**
  - „Pferd unruhig“ (Getroffen): Dort steht deine eigene Wahl aus dem Pult (`pferd_unruhe_2`), die habe ich nicht überschrieben. Aufbäumen ist auswählbar.
  - Eine eigene Zeile „Angriff“ hat der Reiter nicht (beim Schlag klingt der Säbel), deshalb ist Wiehern beim Angriff noch nicht zugeordnet.
- Die Zuordnung steckt in `entwurf/postfach/tonpult_export_2026-11-26_1830_stahlreiter.json`. Die Datei ist absichtlich älter datiert, damit dein neuester Export maßgeblich bleibt.

### Schritt 1 – Punkt 103 Nacharbeit R3 (`dabbae6`, Rückweg `BILDKANTE_ALT`)
- **Krähenfurt:** Die Sandsäcke am Gehöft (14,3) sind weg.
- **Bild = Regel:**
  - Gartenmauern und Friedhofsmauer in Sankt Ruß und der Sandsackhaken an der Schanze in Grauwall sind echte Kantendeckung (Mauer ×1,7, Sandsäcke ×1,5).
  - Die Regel rechnet sie genau so aus wie vorher die Zeichnung, und GBau zeichnet sie jetzt aus der Regel. Bild und Regel können so nicht auseinanderlaufen.
  - Die Lage ist unverändert: Vergleich `entwurf/probe/p103/vorher/` und `…/sanktruss_uebersicht.jpg`.
  - Gartenzäune geben keine Deckung (Latten).
  - Sankt Ruß hat jetzt 26 Mauerkanten mehr, Grauwall 2 Sandsackkanten mehr.
- Werte unverändert. Sommerhecke: Auf Grauwall und Sankt Ruß stehen keine Hecken.

| Siegquote Konkordat (Startwert 1, fest / gemischt) | nach R3 | nach Punkt 103 |
|---|---|---|
| Grauwall | 47 / 64 (Startwert 2: 47 / 54) | 48 / 62 (Startwert 2: 44 / 49) |
| Sankt Ruß | 41 / 70 | 41 / 73 |
| Krähenfurt | 46 / 89 | 46 / 91 |

Krähenfurt bleibt fest bei 46 %. Die Sandsäcke am Gehöft waren also nicht die Ursache für das Minus aus R3; eher die Hecken bzw. die Mauer am Dorfplatz.

### Schritt 2 – Punkte 94 und 96, Regeln (`07dda01`)
- **Sturmbrecher (94):**
  - Hat jetzt zusätzlich den **Gegenstoß** des Eingreiftrupps.
  - Den Nahkampf-Faktor des Eingreiftrupps (×1,25 auf eigenen Zielfeldern, ×0,85 beim Vorgehen) habe ich bewusst nicht übernommen, weil der Sturmbrecher angreift.
  - Preis 100 → **120** (Gegenstoß +20, Rechnung im Info-Fenster). 6 Modelle wie seit U5c.
- **Grabenräumer (96):** Hat jetzt zusätzlich **Schilde vor**. Preis 50 → **65**.
- **Eingreiftrupp und Schildwall sind gestrichen:** aus Nachschub, KI-Wunschlisten, Preisen, Schlagworten und Einheitenliste. In den Kartenarmeen standen sie nicht.
- **Texte:** Einheitentexte, Schlagworte („Gegenstoß auf Zielfelder“, „Schilde vor“) und Chronik beider Einheiten angepasst.
- **Ton-Pult:**
  - Eingreiftrupp → Sturmbrecher: nichts übertragen, der Sturmbrecher hatte für alle Zeilen schon eine eigene Wahl.
  - Schildwall → Grabenräumer: „Schilde vor“ = `neu2_metall_1`.
  - Ton-Spur beider Einheiten neu gemessen, `tonpult_test` 93/93.
  - Die stummen Ereignis-Plätze `ev_*` aus SP-3 prüft der Vergleich jetzt nicht mehr je Einheit, weil sie unter „Gelände und Gebäude“ stehen.

| Siegquote Konkordat (Startwert 1) | gemischt vorher → nachher | fest vorher → nachher |
|---|---|---|
| Grauwall | 62 → 63 | 48 → 50 |
| Sankt Ruß | 73 → 72 | 41 → 50 |
| Krähenfurt | 91 → 87 | 46 → 48 |

Verluste (Grauwall gemischt): Grabenräumer 85 %, Sturmbrecher 76 %. „Schilde vor“ setzt die KI etwa 0,4-mal je Schlacht ein.

### Was fehlt (nächster `pa`)
- **Schritt 2, Bilder:** Die neuen Bögen (`aschenwacht_sturm_reskin.png`, `konkordat_sturm_reskin.png`) über `figure_cut.py` einbauen. Bis dahin zeigen beide Einheiten ihre alten Bögen, mit 6 Figuren.
- **Schritt 3:** Stahlreiter (Punkt 97) mit Bogen `konkordat_stahlreiter_reskin.png`, Messung, dazu der Vorschlag „öfter zuschlagen/schießen“ mit Zahlen.

### Fragen an Enrico
1. Sturmbrecher: Gegenstoß ohne den Zielfeld-Faktor ×1,25 / ×0,85 – richtig so?
2. Preise 120 (Sturmbrecher) und 65 (Grabenräumer) – passt der Aufschlag?
3. Pferdetöne: Soll ich für den Reiter eine eigene Pult-Zeile „Angriff (Ruf des Pferds)“ bauen, damit Wiehern beim Angriff klingt?

## 2026-11-26 – Nachträge 98–100 und R3: Deckung an der Feldkante (`9b1c272`, `805e7b1` mit index.html)

Gepusht. Lief ohne Hänger: Partietest ohne Fehler, keine Seitenfehler in den Bildläufen, kein Chrome offen. Alle sim-Läufe nacheinander, **kein Absturz**. Dein `pa` kam während des Pakets; im Auftrag stand nichts Neues, deshalb habe ich R3 zu Ende gemacht.

### 1. Nachträge (`9b1c272`)
- **98:** Gefallene sind abgeschaltet. Fällt ein Mann, verschwindet er einfach, ohne Bodenspur. Der Code bleibt; einschalten mit `window.GEFALLEN_AN = true`. Der Bogen `gefallene_bogen.png` bleibt liegen und ist in IDEEN.md vorgemerkt.
- **99:** Meldegänger 1 Modell, der Hund ist Beiwerk.
- **100:** Panzerknechte, Hünen, Löwenoger (und die Stahlgänger, bis Punkt 97 sie ablöst) haben 3 Modelle.
- `sim.js 100` Grauwall Startwert 1: Konkordat 57 %, 14,8 Runden (unverändert).

### 2. R3 Deckung an der Feldkante (`805e7b1`, Rückweg `KANTE_ALT`)
- **Regel:**
  - Sandsackwall (×1,5), Mauer (×1,7) oder Hecke (×1,25) liegt auf der Kante zwischen zwei Feldern und schützt beide Seiten.
  - Sie wirkt aber **nur gegen Beschuss, der über diese Kante kommt**: Maßgebend ist die Richtung vom Ziel zum Schützen. Kommt der Schuss genau über eine Ecke, zählt die bessere der beiden Kanten.
  - Nicht gegen Steilfeuer, Bogenwurf und Flammen; Fahrzeuge und Schreiter ragen darüber.
  - Sie wird wie andere Deckung durch U5a verstärkt.
  - **Umgehen geht:** Wer von der Seite oder von hinten schießt, hat keinen Nachteil.
  - Probe: Grenadiere auf dem Vorposten (Sandsäcke nach Osten) nehmen von Osten 1,7 Schaden, von Westen oder Norden 4,3.
- **Anzeige:**
  - Die Teile stehen auf der Kante; GBau zeichnet sie wie die Gartenmauern: Sandsäcke mit dem Barrikaden-Bild der Schanze, Mauer `mauer_niedrig`, Hecke die Winterhecke.
  - Die Vorschau zeigt „Sandsäcke an der Kante ×1,5“.
  - Der Geländehinweis zeigt z. B. „▲ Sandsäcke an der Kante (17/17 Schützen)“: Gegen so viele feindliche Schützen schützt das Feld gerade.
  - Das Deckungsschild am Standring zählt die Kante zum nächsten feindlichen Schützen mit.
- **KI:** Die Bedrohung eines Felds rechnet die Kante zu jedem Schützen ein, so sucht die KI gedeckte Felder in der richtigen Richtung.
- **Wo die Teile stehen (Vorschlag):**

| Karte | Kanten |
|---|---|
| Grauwall | Vorposten (3,4) Sandsäcke nach Osten; Niemandsland (5,2) Mauer und (5,7) Sandsäcke nach Osten (für den Angreifer); (9,4) und (9,7) Sandsäcke nach Westen (vorgeschobene Aschenwacht) |
| Sankt Ruß | Dorfplatz (8,7) Sandsäcke Ost; (9,2) Mauer Ost; (11,4) und (11,7) Sandsäcke West (für die angreifende Aschenwacht) |
| Krähenfurt | Teich (4,7) Sandsäcke Ost; Gehöft (14,3) Sandsäcke West; Hecken (7,4) und (10,6) nach Osten; Dorfplatz (8,5) Mauer nach Westen |

- **Bilder:** `entwurf/probe/r3/<karte>_<c>_<r>_<art>.jpg` und `<karte>_uebersicht.jpg`; Hinweistexte in `hinweise.json`. Am besten: `grauwall_3_4_sandsack.jpg`, `winterdorf_7_4_hecke.jpg`.

### Messung (`sim.js 100`, Siegquote Konkordat, nacheinander)
| Karte | ohne Kanten fest / gemischt | mit Kanten fest / gemischt |
|---|---|---|
| Grauwall Startwert 1 | 57 / 52 | 47 / 64 |
| Grauwall Startwert 2 | 54 / 54 | 47 / 54 |
| Sankt Ruß Startwert 1 | 44 / 78 | 41 / 70 |
| Krähenfurt Startwert 1 | 65 / 86 | 46 / 89 |

- **Runden:** kaum verändert (Grauwall 14,8 → 14,7, Krähenfurt 13,9 → 14,1).
- **Bei fester Aufstellung** verliert das Konkordat:
  - Grauwall etwa −8;
  - Krähenfurt −19, das ist deutlich. Dort sitzt die Aschenwacht im Gehöft hinter Sandsäcken und der Teich nützt dem Konkordat wenig.
- **Bei gemischter Aufstellung** ist es uneinheitlich (Grauwall +6, Sankt Ruß −8).
- Den Abgleich lasse ich wie vereinbart für U9.

### Fragen an Enrico
1. **Standorte:** Passen die Kanten so, oder willst du sie anders (mehr für den Angreifer im Niemandsland, weniger an den Zielfeldern)? Krähenfurt kippt mit dieser Lage um 19 Punkte.
2. **Werte:** Sandsäcke ×1,5, Mauer ×1,7, Hecke ×1,25 – so lassen?
3. **Gartenmauern** (Sankt Ruß) und die Sandsäcke an der Schanze (Grauwall) sind heute nur Bild, die Deckung kommt aus dem Feld (Garten ×1,2). Sollen sie auch Kantendeckung werden („Bild = Regel“)?
4. **Hecke** gibt es nur als Winterbild. Für Grauwall/Sankt Ruß bräuchte es eine Sommerhecke vom Berater.

Nächster Schritt laut Plan: U3 (figurennahe Effekte) – bzw. vorher der Regel-`pa` für 94/96/97, wenn du das so willst.

## 2026-11-26 – U5c: Truppgrößen in sieben Gruppen (Punkt 90) + Punkt 93 Gefallene (`a8ffb5b`, `11fa6e5` mit index.html)

Gepusht. Lief ohne Hänger: Partietest ohne Fehler, keine Seitenfehler in den Bildläufen, kein Chrome offen. Die sim-Läufe habe ich nacheinander gestartet; **diesmal kein Absturz**.

### 1. Punkt 93: Gefallene nicht mehr flach gedrückt (`a8ffb5b`, Rückweg `GEFALLEN_QUETSCH`)
- Die **Getroffen-Pose** der Einheit wird um 80–90° auf die Seite gedreht, je Figur zufällig links/rechts und leicht verschieden. Sie ist dunkler und etwas entsättigt, hat einen kleinen Schatten und wird nicht gestaucht.
- Im Graben ist sie wie die stehenden Figuren unten abgeschnitten und gegen die Wand gesunken. So ragt sie nicht über die Grabenkante (das tat sie im ersten Versuch).
- Bilder vorher/nachher in `entwurf/probe/p93/vorher/` und `…/nachher/`, je `*_3_liegen`, `*_4_noch_mehr`, `*_5_viele` für Offen (Sankt Ruß), Graben (Grauwall) und Schnee (Krähenfurt).

### 2. U5c: Truppgrößen (`11fa6e5`, Rückweg `TRUPP_ALT`)
- Eine Tabelle `TRUPP` in engine.js gilt für Regel (`modelle()`) und Anzeige.
- **Anzeige:** Trupps zeigen so viele Figuren wie Modelle. Fehlen Posen, wiederholen sich die vorhandenen (Klone).
- **Aufstellung im Feld:**
  - 6er neu 3-3, 4er neu 2-2, beide kompakt, Füße im eigenen Feld.
  - 8er und 3er wie bisher.
  - Beim ersten Versuch standen die 4er zu breit und ragten ins Nachbarfeld; das ist behoben.
- **Bilder:** `entwurf/probe/u5c/<typ>_vorher|nachher.jpg` (Sturmbrecher, Grabenräumer, Pioniere, Signaltrupp, Gasschutz, Feldscher, Scharfschütze, Flammentrupp, Bannerträger).
  - Schwere Grabenwacht, Stahlgänger und Versorgungstrupp stehen in keiner Startarmee, deshalb fehlen ihre Bilder.
  - Am besten: `sturm_nachher.jpg`, `signal_nachher.jpg`, `pionier_nachher.jpg` (im Graben).

**Vollständige Zuordnung** (Figuren = Modelle der Regel):

| Gruppe | Modelle | Einheiten | Anzeige heute |
|---|---|---|---|
| Linie | 8 | Schützenkohorte, Aschengrenadiere | 8 |
| Sturm/Nahkampf | 6 | Grabenräumer, Sturmbrecher, Eingreiftrupp, Schildwall, Schwere Grabenwacht | 6 (vorher 3) |
| Waffentrupp | 3 | Mahlwerk, Sensenwerk, Panzerbüchse, Flammentrupp, Brandwerfer | Flammen 3; **MG und Panzerbüchse bleiben ein Bild** (Waffe mit Bedienung) bis U4 |
| Fachtrupp | 4 | Graben-/Drahtpioniere, Mineure, Gasschutz, Signal-, Fernsprechtrupp, Pirschjäger | 4 (vorher 2–3, Posen wiederholt) |
| Kleine Gruppe | 2 | Feldscher, Aschenpfleger, beide Versorgungstrupps, Scharfschütze, Bannerträger | 2 |
| Kleine Gruppe | 2 | Meldegänger mit Hund | **1 Bild** (Mann und Hund zusammen) |
| Kleine Gruppe | 3 | Hauptmann und General (beide Seiten) | **1 Bild** (Offizier mit Stab) bis U4 |
| Gepanzerte Infanterie | 2 | Stahlgänger, Panzerknechte, Hünen, Löwenoger | 2 |
| Einzelmodell | 1 | alle Geschütze, Mörser, Minenwerfer, Feldkanone, Fahrzeuge, Schreiter, Helden, Fesselballon | 1 |
| Reiter | 6 | Lanzenreiter, Sprenglanzen-Reiter | 6 |

Beiwerk (Trage, Karren, Kiste, Feldtelefon) zählt nicht als Modell; Bilder dafür kommen in U4.

### 3. Messung (`sim.js 100` Grauwall, Startwerte 1/2, nacheinander)
| | vorher (`TRUPP_ALT`) | nachher |
|---|---|---|
| fest | 57 / 54 % | 57 / 54 % |
| gemischt | 52 / 54 % | 52 / 54 % |
| Ø Runden | 14,8 / 14,3 | gleich |

- Die Werte sind **genau gleich**. Die Modellzahl wirkt in der Regel nur noch an drei Stellen:
  - **Splitter ab 2 Modellen:** betrifft neu nur Stahlgänger und Panzerknechte; die stehen nicht in der Grauwall-Armee.
  - **Waffenträger-Fassung:** nicht im Spiel.
  - **Gefallene in der Anzeige.**
- Die Feuerkraft (weiche Stufen) hängt nur an der Stärke, nicht an der Modellzahl. Ein Mann im 6er-Trupp ist 16,7 Stärke, ändert aber nichts am Schaden.

### Fragen an Enrico
1. **Meldegänger:** Regel 2 Modelle (Mann + Hund), im Bild bleibt es 1 Bild mit beiden. Oder soll der Hund Beiwerk sein und der Meldegänger 1 Modell haben?
2. **Hauptmann/General 3 Modelle:** Das Bild ist eine Gruppe in einem Bild. Fallen einzelne Figuren erst mit eigenen Bildern in U4 – einverstanden?
3. **Gepanzerte Infanterie:** Ich habe 2 genommen (so viele Figuren zeigen die Bögen heute). Soll eine davon 3 haben (Hünen? Stahlgänger?)?
4. **MG und Panzerbüchse:** Regel 3 Mann. Das Bild bleibt bis U4 ein Geschütz mit 2 Mann Bedienung.

Nächster Schritt laut Plan: R3 (Deckung an der Feldkante).

## 2026-11-26 – U5b: Gefallene Modelle sichtbar (`fe24c8c` mit index.html)

Gepusht. Lief ohne Hänger: Partietest ohne Fehler, keine Seitenfehler in den Bildläufen, kein Chrome offen. In diesem Paket liefen keine sim-Läufe, also auch keine Abstürze.

### Gemacht (Rückweg `window.FALLEN_ALT`)
1. **Feste Plätze:** Jede Figur eines Trupps behält ihren Platz, auch im Graben. Fällt eine, bleibt dort eine Lücke; die anderen rücken nicht um. Welche fällt, ist zufällig.
2. **Fallen:**
   - Sinkt die gezeigte Stärke unter die Schwelle eines Modells (beim Abspielen des Treffers, also nicht zu früh), kippt eine Figur in knapp ½ s um, weg vom Angreifer.
   - Liegt sie dann am Feldrand, kippt sie zur anderen Seite, damit sie nicht ins Nachbarfeld ragt.
   - Sie bleibt abgedunkelt mit Schatten liegen. Die Getroffen-Pose spielt vorher wie bisher.
3. **Im Graben** kippt niemand über die Kante: Die Gefallenen sacken auf der Sohle zusammen, die vordere Grabenwand verdeckt sie teilweise (nach Tiefe einsortiert).
4. **Liegen bleiben:**
   - 3 Runden, danach verblassen sie in 2,5 s.
   - **Blut aus:** Die Figur fällt und verblasst gleich danach (1,2 s).
5. **Aufgerieben:** Statt den ganzen Trupp auszublenden, fallen die letzten Figuren alle und bleiben liegen.
6. **Versorgen / mehr Stärke:** Eine Gefallene steht wieder auf (ohne Bild).
7. **Was nicht fällt:** Fahrzeuge, Schreiter, Geschütze und andere Einzelmodelle fallen nicht (wie gewünscht: kommt in U8 bzw. als Wrack).
8. Feuerkraft-Fassung 2 (`KRAFT=traeger`) ist nur noch für Messungen da, im Spiel nicht erreichbar.

### Bilder (`entwurf/probe/u5b/`)
- Je Lage vier Bilder: `_1_vorher`, `_2_faellt` (0,23 s nach dem Treffer), `_3_liegen`, `_4_noch_mehr` (Stärke 100 → 60 → 25):
  - im Offenen: `sanktruss_offen_*`
  - im Graben: `grauwall_graben_*`
  - im Schnee: `winterdorf_schnee_*`
- `_5_viele`: weiter weg, alle Trupps auf halber Stärke.
- `grauwall_graben_6_200_liegende_zoom_*`: Belastungsprobe.
- Am besten: `sanktruss_offen_3_liegen.jpg`, `winterdorf_schnee_3_liegen.jpg`, `grauwall_graben_4_noch_mehr.jpg`.

### Leistung (Grauwall, ohne Bildratenbremse; `leistung_200.json`)
| Ansicht | ohne Liegende | mit 200 Liegenden |
|---|---|---|
| Zoom 1,6 | 2,5 ms (5 %: 3,0) | 2,9 ms (5 %: 3,9) |
| ganze Karte | 4,7 ms (6,0) | 6,2 ms (10,8) |

200 Liegende auf einmal kommen im Spiel kaum vor (sie verschwinden nach 3 Runden). Ein Spiel hat etwa 10–30 gleichzeitig.

### Fragen an Enrico
1. **Wie sie liegen:** Die Liegenden sind die gedrehte, abgedunkelte Figur (seitlich, von oben verkürzt). Passt das, oder soll der Berater eigene „gefallen“-Posen malen (je Fraktion 2–3 Liegende)? Die würden besser aussehen, vor allem im Graben.
2. **3 Runden liegen bleiben:** passt die Dauer?
3. **Blut:** Blutflecken unter den Gefallenen habe ich bewusst weggelassen, das gehört zu U6 (Mehr Blut). Richtig so?

Nächster Schritt laut Plan: U3 (figurennahe Effekte).

## 2026-11-26 – U5a: Schaden über Modelle – Regeln und Messung (`9924675` mit index.html)

Gepusht. U5 habe ich wie erlaubt geteilt: **U5a = Regeln und Messung** (dieser Teil), **U5b = Darstellung** (fallende, liegende Modelle) im nächsten `pa`.
- **Hänger:** keine. Die Vorschau war nicht offen, kein Chrome blieb offen.
- **Absturz beim Messen:** Parallel gestartete sim-Läufe sind unter Node 26 einige Male mit „Segmentation fault“ abgestürzt. Das ist auch der Grund für die leeren Zeilen in SP-2. Ich habe jeden fehlenden Lauf einzeln wiederholt; alle 36 Läufe sind vollständig.
- Tests: `test_regeln`, `test_kommentare` und Partietest ohne Fehler.

### Gemacht (Rückweg für alles: `MODELLSCHADEN_ALT`)
1. **Modelle in den Regeln:** Linie 8, Reiter 6, Spezialtrupps 3; Geschütze, Fahrzeuge, Schreiter und Helden zählen als 1 Modell, wie in der Anzeige seit R1. Ein Modell der Linie entspricht 12,5 Stärke.
   - **Abweichung vom Bauplan:** Die Stärke bleibt stufenlos. Den Schaden auf ganze Modelle zu runden, habe ich verworfen, weil eine Gewehrsalve im Mittel nur 3,5 Stärke macht (gut ¼ Modell). Gerundet bliebe die meiste Salve ganz ohne Wirkung, und selten fiele gleich ein ganzer Mann.
   - So ist es jetzt: Ein Modell fällt, wenn die Stärke unter seine Schwelle sinkt. Das Treffer-Ereignis meldet dafür, wie viele Modelle gefallen sind (`fall`); das braucht U5b.
2. **Feuerkraft, zwei Fassungen** (Bild `entwurf/probe/u5a/feuerkraft.png`):
   - **Fassung 1, weiche Stufen** (jetzt Standard): Stärke 100–70 voll, 69–40 → 75 %, unter 40 → 50 %. Die Übergänge sind weich, etwa ±3 Stärke.
   - **Fassung 2, Waffenträger** (`KRAFT=traeger`, im Browser `window.KRAFT = 'traeger'`):
     - Linie und Reiter: 50 % + 50 % × Anteil der stehenden Modelle.
     - Spezialtrupps (3 Modelle): je gefallenem Schützen −15 %. Fällt der Waffenträger, bleiben nur noch 45 %. Wer fällt, wird gewürfelt; der Träger fällt mit der Chance 1 / stehende Modelle.
   - Vorher galt 0,4 + 0,6 × Stärke.
   - Das Info-Fenster zeigt unter der Rolle die Kurve und die Modellzahl.
3. **Deckung stärker:**
   - Beschuss auf ungedeckte Fußtruppen und Geschütze macht ×1,4 Schaden (`P.OFFEN_MUL`).
   - Deckung über 1 wirkt um die Hälfte stärker (`P.DECK_STARK` 1,5): Graben 1,6 → 1,9, Bunker 2 → 2,5.
   - Fahrzeuge und Schreiter sind davon ausgenommen.
4. **Splitter:** Geschütze, Mörser, Minenwerfer, Flammenwerfer und die Löwenmaul-Kanone machen gegen Trupps im Offenen ×1,3 (`P.SPLITTER`).
5. **Punkt 43:**
   - Löwenmaul-Kanone gegen Fahrzeuge und Schreiter ×2,2 (`P.LOEWE_PZ`): gegen einen Sturmpanzer von vorn etwa 14 statt 6,5 Schaden, also im Zielbereich 12–18 der Prüfung.
   - Furcht-Aura −10 statt −4 Moral je Runde (`P.FURCHT_MOR_U5`).
6. **Pannen und Festfahren kürzer:** 1 Runde aus, mit 25 % Chance „schwer“ 2 Runden (vorher 3). Die Texte sind angepasst.
7. **sim.js** zählt jetzt nach Bauplan 10a: Flucht, Panne und Festfahren je Schlacht, Anteil der Einheiten, die handeln, verdiente Nachschubpunkte nach Runde 5/10/15 und Schaden je Typ. Die Art des Sieges stand schon in der Zeile „Ausgang“.

**Beispiele (Vorschau, Schaden ×10, vorher → jetzt):**

| Schuss | vorher | jetzt |
|---|---|---|
| Kohorte → Grenadiere im Offenen | 3,5 | 4,9 |
| Kohorte → Grenadiere im Graben | 2,2 | 1,8 |
| Donnerrohr → Grenadiere im Offenen | 7,6 | 13,9 |
| Donnerrohr → Grenadiere im Graben | 4,8 | 4,0 |

Vorher war der Unterschied zwischen offen und Graben 1,6-fach, jetzt 2,7-fach (Artillerie 3,5-fach).

### Messung (100 Schlachten, Startwerte 1 und 2; Siegquote Konkordat, Mittel)
| Karte, Aufstellung | vorher | Fassung 1 Stufen | Fassung 2 Träger |
|---|---|---|---|
| Grauwall fest | 55 | 55,5 | 60,5 |
| Grauwall gemischt | 54 | 53 | 53 |
| Sankt Ruß fest | 57,5 | 47,5 | 47 |
| Sankt Ruß gemischt | 67,5 | 74,5 | 73 |
| Krähenfurt fest | 57,5 | 64 | 67,5 |
| Krähenfurt gemischt | 92,5 | 85,5 | 82 |

- **Ø Runden:** kaum verändert. Grauwall 15,0 → 14,8, Sankt Ruß 14,6 → 14,2, Krähenfurt 14,2 → 14,1 (fest; gemischt gleich).
- **Art der Siege:**
  - Grauwall endet immer über die Zielpunkte.
  - Zusammenbruch auf Sankt Ruß (fest) vorher 20 %, Stufen 31 %, Träger 34 %.
  - Zusammenbruch auf Krähenfurt vorher 3 %, Stufen 12 %, Träger 9 %.
  - Die Schlachten entscheiden sich also öfter durch Zusammenbruch.
- **Ausfälle Konkordat/Aschenwacht (Grauwall fest):** vorher 31/33 %, Stufen 28/35 %. Die Aschenwacht greift über offenes Feld an und verliert mehr.
- **Flucht je Schlacht (Krähenfurt fest, Konkordat/Aschenwacht):** vorher 5,6/6,7, Stufen 6,3/8,5, Träger 6,1/9,1.
- **Pannen** (Anzahl Ereignisse): gleich häufig, sie dauern nur kürzer (1–2 statt 3 Runden).
- **Handeln:** 65–79 % der Einheiten handeln je Runde, in allen Fassungen gleich.
- **Nachschubpunkte verdient (Grauwall, Konkordat/Aschenwacht):**

  | Runde | vorher | Stufen |
  |---|---|---|
  | 5 | 80/89 | 81/89 |
  | 10 | 181/185 | 182/163 |
  | 15 | 304/303 | 326/294 |

  Der Führende zieht nicht davon.
- **Schaden je Typ und Schlacht (Grauwall, ×10), Spitze:**

  | Typ | vorher | Stufen |
  |---|---|---|
  | Landkoloss | 187 | 218 |
  | Grabengeschütz | 101 | 129 |
  | Donnerrohr | 64 | 95 |
  | Kohorten | 82 | 108 |
  | Grenadiere | 146 | 124 |

  Artillerie und Splitterwaffen zählen mehr, die angreifenden Grenadiere weniger.
- **Fassungen im Vergleich:** Sie unterscheiden sich in der Siegquote um höchstens 5 Punkte, also unter der Messgenauigkeit (±10 bei 100 Schlachten). Die Fassungen selbst entscheiden das Spiel kaum; die Verschiebungen kommen von Deckung und Splitter.
- **Wie fest und gemischt auseinanderlaufen:** Auf Sankt Ruß und Krähenfurt liegen feste und gemischte Aufstellung schon vorher 10–35 Punkte auseinander. Das ist ein Thema für U9.

### Fragen an Enrico
1. **Welche Feuerkraft?**
   - Meine Empfehlung: **Fassung 1, weiche Stufen**. Sie ist im Info-Fenster in einem Satz erklärt („100–70 voll, 69–40 → 75 %, unter 40 → 50 %“), und kein Würfel entscheidet, wer zuerst fällt.
   - Für Fassung 2 spricht: Fällt beim MG-Trupp der Schütze am MG, merkt man das deutlich, und das passt zu den fallenden Modellen in U5b.
2. **Deckung (offen ×1,4, Deckung ×1,5 stärker) und Splitter (×1,3):** so lassen? Damit fallen die Schlachten öfter durch Zusammenbruch, und Sankt Ruß fest kippt etwas zur Aschenwacht (57,5 → 47,5 %).
3. **Stärke stufenlos statt ganzer Modelle** (siehe Punkt 1): einverstanden?
4. Den Abgleich der Karten würde ich wie vereinbart erst in U9 machen. Oder soll Sankt Ruß fest schon jetzt wieder nachgezogen werden?

Nächster Schritt: **U5b** (Modelle fallen sichtbar und bleiben liegen, verblassen nach einigen Runden, mit Blut-Schalter; Bilder).

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

