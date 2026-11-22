## 2026-11-22 Nachmittag – Neue Töne als Standard (Aufträge 14:40, 14:50, 15:00) (`841f93f`)

Alle Dateien aus `sound-quelle/_neu/` sind eingebaut. Die Dateien wurden in Ordner kopiert, nichts verschoben oder gelöscht:
- `Voices/elevenlabs/rufe/`
- `Voices/elevenlabs/schreiter/`
- `Aufbau/`
- `Helden/`

Weiter gilt:
- **Alte Töne:** bleiben im Pult wählbar.
- **Pult:** Eine Wahl dort hat Vorrang vor dem neuen Standard.
- **Abgeschlossen:** CREDITS ergänzt, sound-quelle gesichert, `index.html` neu gebaut und eingecheckt.
- **Tests:** test_ton (prüft jetzt alle neuen Plätze, den Feuer-Ruf und eine Schreiter-Stimme mit Roboter-Filter), Partietest und test_kommentare fehlerfrei. `test_kommentare` erkennt jetzt auch verschluckte `let`-Zeilen; der Fehler ist heute zweimal passiert und behoben.
- **Größe:** `index.html` ist jetzt 61,6 MB. GitHub warnt ab 50 MB, die harte Grenze liegt bei 100 MB. Die nur im Pult genutzten Töne liegen weiter getrennt in `sound_pult.js`.

### Platz / Anlass → neuer Standard → Einheiten
| Platz / Anlass | neuer Standard-Ton | für |
|---|---|---|
| Ruf „Feuer-Befehl“ | `ruf_feuer` (Rob „FIRE!“ / Ragnar „FEUER!“) | Hauptmann/General bei „Feuer frei“ und bei Feuerbereitschaft; Feuerschlag anfordern (Fernsprechtrupp) |
| Ruf „Panik, einzeln“ | `panik_einzeln` | flüchtender Trupp mit 1–2 Figuren |
| Ruf „Panik, Gruppe“ | `panik_gruppe` | flüchtender Trupp ab 3 Figuren oder zweite Flucht innerhalb von 3 s |
| Ruf „Sterben, einzeln“ | `sterben_einzeln` (nach 5 s ausgeblendet) | jede dritte vernichtete Fußtruppe |
| Ruf „Sterben, Gruppe“ | `sterben_gruppe` (leise) | Fußtruppe verliert auf einmal ab 25 Stärke (Granaten, Artillerie, schwere Treffer), wenn nicht schon „Sanitäter!“ gerufen wird |
| Schreiter-Stimme (8 Anlässe) | `sst_auswahl` … `sst_zerstoert`, Roboter-Filter (Konkordat 45 %, Aschenwacht 70 %) | Säge-, Klauen-, Turm-, Ordens-, Kreuzschreiter und Eisenknecht; für sie gibt es keine Truppenrufe |
| MG aufbauen / abbauen | `mg_aufbauen` / `mg_abbauen` (vorher mgsetup + mgladen / nachladen) | Mahlwerk-, Sensenwerk-Trupp |
| Aufprotzen / Abprotzen | `geschuetz_aufprotzen` / `geschuetz_abprotzen` (vorher clank / abprotzen) | Feldkanone, Donnerrohr, Grabengeschütz |
| Bauarbeit | `sandsaecke` (vorher bauen) | Draht ziehen (Drahtpioniere), Mine legen, Stollen (Mineure) |
| Sprungangriff, Landung | `loewen_landung`, alter Landeton leise darunter | Löwenoger |
| Schuss Offiziere | `neu4_pistole_schwer` (vorher pistol) | Hauptmann, General (beide Seiten) |
| Schuss Panzerbüchse | `neu4_gewehr_schwer` (vorher buechse) | Panzerbüchsen-Trupp |
| Schuss Eiserne Hünen | `neu4_mg_schwer` (vorher mg, tiefer gestimmt) | Eiserne Hünen |
| schon seit Mittag Standard | Säge, Stahlklaue, Raubkatzen-Krallen, Kettenschwert, Schreiter- und Kampfanzug-Schritte, Stacheldraht | wie im Bericht von Mittag |

- **Schreiter-Regeln:**
  - Auswahl nur jede dritte.
  - „Feind gesichtet“ beim Ziehen, wenn eine gegnerische Maschine bis 6 Felder entfernt ist, höchstens alle 30 s je Seite.
  - „Schwer beschädigt“ einmal je Schreiter (unter 35 Stärke).
- **Für alle Rufe:** höchstens einer zugleich, je Anlass höchstens alle 7 s.
- **Ton-Pult:**
  - Unter „Stimmen“ stehen die fünf neuen Rufe mit ihrem Standard.
  - Neu ist die Gruppe **„Schreiter Konkordat/Aschenwacht“** mit acht Zeilen, Filter „Roboter-Lautsprecher“, Stärke je Zeile.
  - Die Löwen-Landung steht unter „Nahkampf“.

### Fragen an Enrico (nicht geraten)
1. **Granatwerfer** (`granatwerfer_schuss`): Keine Einheit hat einen Granatwerfer. Wofür? Zum Beispiel als Abschuss von Grabenmörser/Minenwerfer, oder für den Handgranaten-Wurf der Grenadiere? Bis dahin nur im Pult.
2. **Schweres MG:** nur bei den Eisernen Hünen, oder auch bei den MG-Trupps (Mahlwerk, Sensenwerk)?
3. **Schweres Gewehr:** nur Panzerbüchse, oder auch Kampfanzüge (Stahlgänger, Panzerknechte; heute Halbautomatik) oder Scharfschützen?
4. **Sandsäcke:** Eine eigene Handlung „Sandsackwall bauen“ gibt es nicht. Ich habe sie bei Draht ziehen, Mine legen und Stollen gesetzt; das Banner-Rammen behält den alten Ton. Passt das?
5. **MG-Rückstoß** (Zurückschieben durch Durchbruch/Sturmrollen): Soll dort `mg_abbauen` klingen? Bisher kein Ton gesetzt.
6. **Feuer-Befehl Aschenwacht:** Die Aschenwacht hat kein „Feuer frei“. Ihr Feuer-Ruf kommt nur bei Feuerbereitschaft von Hauptmann/General. Auch bei Sturmbefehl oder Generalangriff?
7. **Panik:** Grenze einzeln/Gruppe = 3 Figuren bzw. zwei Fluchten in 3 s. Passt das?

## 2026-11-22 Abend – Entscheidungen von 13:35 umgesetzt (`fec57ae` … Abschluss)

Alles eingebaut, gemessen und gepusht, `index.html` am Ende mit eingecheckt.
- **Tests:** Partietest, test_regeln, test_kommentare sowie die zwei neuen Tests `tools/test_ton.mjs` (Ton-Umbau) und `tools/test_feindarmee.mjs` (Feind-Armee) laufen fehlerfrei.
- **Endstand Balance** (je 4 × 200 Schlachten, feste Aufstellung wie bisher gemessen): **Grauwall 54,5 %**, **Sankt Ruß 49,4 %** Sieg Konkordat.
- **`sim.js 200`:**
  - Grauwall: 51 % zu 50 %, 14,9 Runden.
  - Sankt Ruß: 47 % zu 53 %. Kirche stürzt in 52 % der Schlachten ein.
- **Verluste je Typ:** in `sim.js`-Ausgabe; auffällig hoch bei Flammentrupp 80 %, Sensenwerk 70 %, Sturmbrecher 69 % und Banner 63 %.

### F92 Schärfe
- Stufe 1 ist Standard: hochwertige Glättung für Boden und Figuren.
- Stufe 2 bleibt nur als Versuchsschalter (`__dbg.schaerfe(2)`).

### F95 Tonmischung
- **Drei Wege:** Musik, Effekte und Stimmen laufen über WebAudio, mit einem leichten Begrenzer auf der Summe.
- **Neuer Regler „Stimmen“** in den Einstellungen (`arm.stimmvol`). Er regelt Sprüche und Rufe; der Effekte-Regler wirkt nicht mehr auf Stimmen.
- **Abweichung:** Die Töne bleiben `<audio>`-Elemente und werden per `createMediaElementSource` in die Wege gehängt (so liefen die Rufe schon), nicht als Tonpuffer.
  - Ergebnis wie bestellt: Wege, Begrenzer, Regler.
  - Alle Schleifen, Überblendungen, Tonhöhen und Pausen bleiben unverändert. Ein Umbau auf Puffer hätte jede dieser Stellen neu gebraucht.
- **Zielmischung** aus der Tabelle (`MISCH_F` in ui.js):
  - Gewehr 0,7 (Konkordat) bzw. 0,8 (Aschenwacht).
  - MG 0,85, Kanonen 0,8, Panzer 0,8.
  - Schritte 0,75, Kürassier-Schritte 0,9, Schreiter-Schritte 0,7.
  - Rufe 0,3, Kulisse 0,13 (Wetter 0,07).
- **Musik bei Beschuss −6 dB** für 2,5 s (Schuss, Artillerie, Zweitwaffe, Faustsalve, Panzergranate).
- **Gewehr:** Kein Schuss wird mehr abgeschnitten.
  - Standard ist **Variante A** (Feld-Nachhall 0,6 s).
  - **Variante B „Hagel“** ist fertig gebaut. Umschalten: eine Zeile (`GEWEHR_ART = 'B'`), zum Probieren `__dbg.gewehr('B')`.

### F103 Rollen schärfen (alle sieben)
1. **Eingreiftrupp = Gegenstoß:** Nahkampf ×1,25 auf eigenen Zielfeldern und in Gräben der eigenen Kartenhälfte, sonst ×0,85.
   - **Sturmbrecher = „Sturm und Panzerabwehr“:** Panzergranate als Kern im Text.
2. **Grabenräumer = „Grabenkampf“:** ohne Panzergranate. Der Preis bleibt 50, weil die Formel die Granate nicht berechnet hatte.
3. **Kohorte = „Schützenlinie“.**
   - **Grenadiere = „Stoßinfanterie“:** Handgranaten vor jedem Nahkampf ×1,25, mit Wurf-Pose und Explosion (Ereignis `handgranate`, Zeile im Ton-Pult); Schuss ×0,85.
4. **Feldkanone = „Direktes Feuer“:** nur mit Sicht, über die ganze Reichweite (5), ×2,5 gegen Kolosse, kein Steilfeuer. Darf nach dem Abprotzen noch schießen.
   - **Donnerrohr und Grabengeschütz = „Steil- und Sperrfeuer“.**
5. **Fernsprechtrupp = „Feuerleitung“**; Ballon und Signaltrupp = „Aufklärung“.
6. **Sägeschreiter:** Panzersäge, Gepanzerte ×1,5.
   - **Klauenschreiter:** Stahlklaue, Fußtruppen ×2, Gepanzerte ×0,75. Beide nur mit Kampfmaschinen.
7. **Eiserne Hünen = „Schweres Feuer“.**
   - **Panzerknechte = „Nahkampf und Draht“:** schneiden jetzt Draht.
- Texte, Schlagworte, Rollen-Zeilen und die CSV sind angepasst; `einheiten_statistik.csv` ist neu gemessen.

### F94 Gefecht
- **Gemischte Startarmeen, höchstens 5 vom selben Typ**, gleiches Budget:

| Karte | Konkordat | Aschenwacht |
|---|---|---|
| Grauwall (vorher A 8 Kohorten, 3 Mahlwerk, 3 Kolosse …; D 8 Grenadiere, 5 Sensenwerk …) | 5 Kohorten, 2 Mahlwerk, 2 Kolosse, 2 Donnerrohre, je 1 Reiter, Pioniere, Scharfschütze, Mörser, Feldscher, Grabenräumer, Flammen, Rauch | 5 Grenadiere, 2 Gasschutz, 1 Banner, 3 Sensenwerk, 2 Geschütze, je 1 Sturmbrecher, Sturmpanzer, Minenwerfer, Signal, Aschenpfleger |
| Sankt Ruß (vorher D 11 Grenadiere …) | wie Grauwall, aber 3 Mahlwerk und 2 Pioniere | 5 Grenadiere, 2 Drahtpioniere, 2 Gasschutz, 2 Sensenwerk, 2 Geschütze, 2 Sturmpanzer, je 1 Sturmbrecher, Minenwerfer, Aschenpfleger |

- **Nachschub:** Der Einstieg in die Wunschliste ist je Schlacht gemischt, dazu kauft die KI wie bisher nach Lage.
- **Geschütze ziehen sanft nach** (beide Seiten): erst wenn sie mehrere eigene Runden lang kein Ziel hatten, dann bis in Reichweite.
  - Die Rundenzahl ist je Karte einstellbar (`MAP.ki.artRunden`): Grauwall 5 (Konkordat) / 4 (Aschenwacht), Sankt Ruß 2.
  - Das war der wirksamste Abgleich-Hebel. Mit 2 Runden auf beiden Seiten lag Grauwall bei 45 %.
  - Geschütze protzen jetzt in rund 20 % ihrer Handlungen auf; vorher blieben die der Aschenwacht immer stehen.
- **Reiter-KI:**
  - **Ursache:** Reiter haben nur Abwehr 2. Die KI rechnete den Gegenschlag fast immer höher als den eigenen Angriff und mied Bedrohung zusätzlich.
  - **Neu:** Bonus (`W_CAV_ZIEL` 3, mit Anlauf ×1,5) gegen Geschütze, MG, Beobachter, Sanitäter, Fliehende und Niedergehaltene.
  - **Ergebnis:**
    - Lanzenreiter auf Sankt Ruß: Nahkampf in 18 % der Züge (vorher 2 %).
    - Sprenglanzen: 17 %.
    - Grauwall: 4–7 %, dort sperrt der Draht die Wege.
- **Feind-Armee selbst zusammenstellen** (auch gegen die KI):
  - Armee-Auswahl → Knopf **„Feind-Armee“** → **„KI stellt selbst zusammen“** oder **„Ich stelle zusammen“**. Wer an der Feindliste etwas ändert, ist automatisch auf „Ich“.
  - Gleiche Regeln: Budget, ein General, ein Held, ein Stufe-3-Schreiter.
  - Die KI stellt die Armee automatisch auf und kauft weiter selbst.
  - Die Startseite zeigt beide Armeen.
- **Wichtig zur Messung:**
  - Mit gemischter Aufstellung (`MISCHEN=1`) liegen die Werte anders: Grauwall etwa 62 %, Sankt Ruß 77,5 %.
  - Grund: Die automatische Aufstellung vergibt die Plätze gierig der Reihe nach, schon ein Trupp mehr oder weniger verschiebt die Quote um bis zu 40 Punkte (z. B. 45 % gegen 91 %).
  - Abgeglichen ist auf die feste Aufstellung, wie bisher berichtet und wie die KI im Spiel wirklich aufstellt.
  - **Vorschlag für später:** die automatische Aufstellung robuster machen (Rollen vorn/hinten fest, Plätze nicht nur der Reihe nach). Dann gleichen sich beide Messungen an.

### Offen
- **Gewehr A oder B:** Enrico hört in der Tonprobe; Umschalten ist eine Zeile.
- **Roboter-Stimmen** für Schreiter, Bogen C für die doppelten Symbole: kommen später.

## 2026-11-22 Nachmittag – Paket I fertig: F98, Schritt 11, F92, F94, F95, F103 (`6669289` … Abschluss)

Alles gepusht, `index.html` jetzt mit eingecheckt (Ende von Paket I). Tests:
- Partietest fehlerfrei (F88, F97, F100, Blickrichtung aller 54 Typen).
- test_regeln und test_kommentare in Ordnung.
- `sim.js 200` unverändert bei 50 % zu 51 %, 15,1 Runden. Alle Versuchsschalter stehen standardmäßig aus.

### F98 Blut bei Beschuss (eingebaut)
- Kleine Spritzer bei Gewehr, MG, Drehlauf, Schrot und Pistole an Fußtruppen, etwa bei jedem zweiten Treffer, in Schussrichtung.
- Kampfanzüge bluten nur bei wirksamen Treffern; Panzer, Schreiter und Fahrzeuge gar nicht.
- Bildwirkung „leicht“ zeigt weniger, „aus“ keine.

### Schritt 11 Einheiten-Statistik → `entwurf/postfach/einheiten_statistik.csv`
- **Umfang:** je 200 Schlachten KI gegen KI auf Grauwall und Sankt Ruß. Werkzeug: `node tools/einheiten_statistik.js [N]`.
- **Spalten:**
  - Wie bestellt: Start, Nachschub und gekauft (getrennt), Aktionen, Schaden (×10 wie in der Anzeige), Schaden je 100 Punkte, überlebt %, Einsatz der KI (die drei häufigsten Handlungen).
  - Dazu für F103: Rolle, Stark gegen, Schwach gegen, Kontert man mit.
- **Zählweise:** Der Schaden zählt für den, der gerade schießt oder schlägt (auch Gegenschlag, Sperrfeuer und Feuerbereitschaft).
- **Auffällig für die Balance-Tabelle (nur gemessen, nichts geändert):**
  - **Lanzenreiter** (beide Karten) und **Sprenglanzen-Reiter** ziehen zu 98 % nur. Sie greifen fast nie an (Schaden 4 bzw. 5 je Schlacht). Die KI nutzt Reiter praktisch nicht.
  - **Landkoloss** ist mit Abstand der stärkste Schadensbringer: 182 bzw. 168 je 100 Punkte, überlebt zu 94–99 %. **Sturmpanzer** auf Sankt Ruß: 108.
  - **Minenwerfer** auf Sankt Ruß: 163 je 100 Punkte (billig und wirksam).
  - Kaum gekauft und kaum genutzt: Feldkanone, Löwenoger, Schildwall, Mineure, Versorgungstrupps, Schwere Grabenwacht, Flammentrupp.
  - Auf Grauwall gekaufte Einheiten handeln oft nicht mehr, weil die Schlacht vorher endet: Überleben 100 %, Aktionen nahe 0.
- **Kampfmaschinen:** Ein Lauf mit `MECHS=1` gab dieselben Zahlen. Die KI kommt in ihrer Wunschliste nie bis zu den Maschinen. Für Maschinenwerte müssten sie in die Startarmee.

### Schritt 12 F92 Schärfe (nur untersucht, Enrico entscheidet)
- **Bildschirmskalierung ist nicht die Ursache.** Die Zeichenfläche rechnet schon mit `devicePixelRatio` (bis 2,5): bei 125/150 % entsprechend mehr Pixel.
- **Ursache des Grisselns:** Boden und Figuren werden mit der Standard-Glättung „low“ in einem Schritt verkleinert. Der Boden wird zudem zeilenweise aus dem Weltbild geschnitten. Beim Herauszoomen fallen dadurch Pixel weg, das gibt Treppen und Flimmern.
- **Versuchsschalter (Konsole `__dbg.schaerfe(n)`, im Spiel aus):**
  - **Stufe 1:** hochwertige Glättung (`imageSmoothingQuality 'high'`) für Boden und Figuren. Chrome verkleinert damit selbst in Zwischenstufen, also genau die gewünschten „Mipmaps“, ohne eigene Bildstufen.
  - **Stufe 2:** zusätzlich eigene Boden-Mipmaps (halb und viertel), je Bildzeile passend gewählt.
- **Messung** (1920×1080, `tools/schaerfe_bilder.mjs`):

| Zoom / DPR | Stufe 0 heute | Stufe 1 | Stufe 2 |
|---|---|---|---|
| ganz heraus, DPR 1: Bildzeit | 17,5 ms | 21,6 ms | 33,8 ms |
| ganz heraus, DPR 1,5: Bildzeit | 19,3 ms | 23,5 ms | 23,9 ms |
| mittel, DPR 1: Bildzeit / Flimmern | 11,2 ms / 8,96 | 16,1 ms / 6,83 (−24 %) | 16,4 ms / 6,61 |
| mittel, DPR 1,5: Bildzeit / Flimmern | 14,6 ms / 9,39 | 18,5 ms / 7,96 (−15 %) | 18,2 ms / 7,97 |

  - „Flimmern“ = mittlere Pixeländerung bei 1 Pixel Kameraschwenk.
  - Beim Zoom „ganz heraus“ ist der Flimmerwert nicht verwertbar, weil die Kamera dort am Rand festsitzt.
- **Bilder:** `entwurf/probe/schaerfe/vergleich_ganz.jpg` und `vergleich_mittel.jpg` (von oben: Stufe 0, 1, 2). Dazu die ganzen Bildschirme `dpr*_*_stufe*.jpg`.
  - Stufe 0 zeigt sichtbare Treppen an Grabenkanten und Draht und grisselige Figuren.
  - Stufe 1 ist ruhig und trotzdem scharf. Stufe 2 bringt kaum mehr.
- **Vorschlag:**
  - **Stufe 1 einschalten:** eine Zeile, etwa +4 ms je Bild, weiter deutlich unter 25 ms.
  - Stufe 2 lohnt den Aufwand nicht.
  - Kein Nachschärfen der Bilder nötig; Konturen und Sockel bleiben unverändert.

### F94 Gefecht statt Kampagnenmission (nur untersucht, Enrico entscheidet)
**Befund:**
- **Geschütze:** Die KI protzt Geschütze nur auf der Konkordat-Seite auf, und das erst ab Runde 4, wenn der Gegner über 8 Felder weg ist. Aschenwacht-Geschütze werden sofort wieder abgeprotzt und bewegen sich nie (in 1–2 % der Schlachten).
- **Startarmeen:**
  - Die Aschenwacht beginnt auf Grauwall mit 8 Grenadieren und 5 Sensenwerken (6 Typen), das Konkordat mit 8 Kohorten (7 Typen).
  - Nachschub kommt aus einer festen Wunschliste. Die ersten Käufe sind deshalb fast immer gleich (Koloss, Sturmbrecher, Grenadiere, Kohorten je genau 1,0 je Schlacht). Das wirkt wie eine geskriptete Verstärkung.

**Gemessen** (je 4 × 200 Schlachten, Startwerte 1–4, `tools/f94_sim.js`):

| Möglichkeit | Grauwall Sieg Konkordat | Sankt Ruß Sieg Konkordat | Typen zu Beginn A/D | Geschütze bewegt (Aschenwacht) |
|---|---|---|---|---|
| heute | 52,9 % | 52,1 % | 7 / 6 (SR 8 / 8) | 2 % / 1 % |
| **A** KI zieht Geschütze nach (beide Seiten) | 37,6 % | 61,6 % | wie heute | 100 % / 44 % |
| **B** feste gemischte Startarmeen (gleiches Budget, höchstens 5 vom selben Typ) | **53,6 %** | 80,8 % | 14 / 13 | wie heute |
| B + Geschütze nachziehen | 50,5 % | 83,4 % | 14 / 13 | 91 % / 9 % |
| **C** Zufallsarmee je Schlacht mit Mindestvielfalt + gemischter Nachschub | 28,6 % | 77,8 % | 14 / 13 | – |
| C + Geschütze nachziehen | 28,5 % | 78,6 % | 14 / 14 | 37 % / 4 % |

- **A** verschiebt die Balance stark: Auf Grauwall nützen der Aschenwacht nachgezogene Geschütze, auf Sankt Ruß schaden sie ihr. Das ginge nur mit einer sanfteren Regel (z. B. erst nachziehen, wenn zwei Runden kein Ziel in Reichweite war) und einem Nachgleich.
- **B** ist auf Grauwall sofort ausgeglichen. Auf Sankt Ruß fehlt der angreifenden Aschenwacht die Masse. Ihre gemischte Liste braucht dort einen Abgleich (mehr Grenadiere statt Reitern), etwa eine Messrunde.
- **C** ist zu zufällig: Die Karten brauchen bestimmte Truppen (Grauwall: Konkordat-Infanterie; Sankt Ruß: Angriffsmasse der Aschenwacht). Ohne Kartenvorgaben (Mindestanteile) kippt die Quote um 20–30 Punkte.

**Vorschlag:**
- **B** als neue Kartenarmeen (beide Seiten gemischt).
- Nachschub nach Lage mit gemischtem Einstieg in die Wunschliste (`WUNSCH_MISCH`).
- Geschütze sanft nachziehen.
- Zusätzlich **„Feind-Armee selbst zusammenstellen“**:
  - Die Armee-Auswahl kann das schon für Zwei-Spieler (Knopf „Seite wechseln“). Für das Spiel gegen die KI braucht es:
    - den Knopf auch dort,
    - eine Wahl „KI stellt selbst zusammen / ich stelle zusammen“,
    - die Übergabe an `newGame`.
  - Die KI stellt die Armee mit `autoAufstellen` auf und kauft weiter selbst.
  - Gleiche Regeln (Budget, ein General, ein Held, ein Stufe-3-Schreiter).
  - **Aufwand etwa 2–3 Stunden** samt Test.

### F95 Tonmischung (gemessen, Proben gebaut, Enrico wählt)
- **Messung:** alle 880 Töne (`tools/ton_pegel.mjs`): Spitze, lautestes 400-ms-Fenster, Lautstärke im Code. Wirksamer Pegel = Datei + Code-Lautstärke (Regler 100):

| Gruppe | heute wirksam | Vorschlag Code-Lautstärke | danach |
|---|---|---|---|
| Granat-Einschlag | −14,9 dB | bleibt 0,5 | −14,9 |
| Kanone | −18,6 | 0,6 → 0,8 | −16,1 |
| MG Aschenwacht | −21,1 | 0,55 → 0,85 | −17,3 |
| MG Konkordat | −21,7 | 0,55 → 0,85 | −17,9 |
| Gewehr Konkordat (je Schuss) | −22,4 | 0,42 → 0,7 | −18,0 |
| Gewehr Aschenwacht (je Schuss) | −24,1 | 0,42 → 0,8 | −18,5 |
| Panzer fährt | −19,6 (unter einer Stimme −27,5) | 0,5 → 0,8 | −15,5 |
| Schritte Fußtruppen | −23,5 | 0,5 → 0,75 | −20,0 |
| Kürassier-Schritte | −24,3 | 0,63 → 0,9 | −21,2 |
| Schreiter-Schritte | −25,5 | 0,45 → 0,7 | −21,7 |
| Rufe (Schmerz, Schreie) | −20,1 | 0,4 → 0,3 | −22,6 |
| Auswahl-Sprüche | −24,6 | bleibt | −24,6 |
| Kulisse (Grundrauschen) | −25,0 | 0,22 → 0,13 | −29,6 |
| Schlachtmusik | −44,8 (RMS) | bleibt, im Gefecht −6 dB | −50,8 im Gefecht |

- **Warum Effekte zu leise wirken:** Waffen, Stimmen und Kulisse liegen heute alle bei −20 bis −25 dB, ohne Abstand.
  - Das Aschenwacht-Gewehr ist 1,7 dB leiser als das Konkordat-Gewehr.
  - Das Panzer-Rollen sinkt unter jeder Stimme um 8 dB.
  - Die Musik ist schon sehr leise. Lauter wirkt dagegen die Kulisse (Grundrauschen 0,22).
- **Grenze:** Das Spiel spielt Töne als `<audio>` ab, dessen Lautstärke höchstens 1 ist. Die Vorschläge bleiben darunter.
- **Begrenzer und getrennte Regler** gehen nur über WebAudio:
  - `playSound` auf Tonpuffer umstellen, drei Wege Musik / Effekte / Stimmen, Begrenzer auf der Summe.
  - Neuer Regler „Stimmen“; heute gibt es nur Musik und Effekte.
  - Aufwand etwa ein halber Tag.
- **Musik-Ducking** gibt es heute nur unter Stimmen. Vorschlag: auch bei Beschuss −6 dB für 2,5 s.
- **Gewehr abgehackt – Ursache gefunden:** Jeder Schuss einer Salve wird nach 170–230 ms abgeschnitten (`dur` in ui.js), nur der letzte klingt aus.
- **Hörproben in `tonprobe.html`** (oberster Abschnitt „F95 Hörproben“, auch online), je Seite:
  - **heute**
  - **Variante A:** gleicher Ablauf, jeder Schuss klingt voll aus, 0,6 s Feld-Nachhall mit kurzem Scheppern.
  - **Variante B „Hagel“:** 4 Männer, je Mann 1, 2 oder 4 Schüsse, zufällig versetzt, 0,85 s Nachhall und Echo, wuchtiger, etwa gleiche Dauer.
  - Dazu **„Gefecht – Mischung heute“** gegen **„Gefecht – Zielmischung“** (Werte aus der Tabelle, Musik im Gefecht −6 dB) zum direkten Vergleich.
  - A und B laufen schon über einen leichten Begrenzer.

### F103 Klare Rollen (eingebaut, ohne Werteänderung)
- **Herleitung:** `src/rollen.js` leitet für alle 54 Einheiten Rolle, Stark gegen, Schwach gegen und Kontert man mit aus den Werten ab: Faktortabelle (`E.medaillen`), Klasse, Fähigkeit, `at`, Panzerklasse, Nahkampf-Rolle. Die Begriffe sind überall gleich.
- **Wo es steht:**
  - Nachschub- und Armee-Karten (Rolle unter dem Namen).
  - Details beim Überfahren (ganzer Block).
  - Einheitenkarte: kurz = Rolle in der Unterzeile, Maus-Tooltip am Namen; ausführlich = ganzer Block.
  - Info-Fenster, auch für Gegner.
- **Bilder:** `entwurf/probe/rollen/` (kaufmenue, karte_kurz, karte_ausfuehrlich, info, je `_vorher`/`_nachher`).
- **Tabelle aller Einheiten:** steht in `einheiten_statistik.csv`, Spalten 14–17. Kurzfassung:

| Einheit | Rolle | Stark gegen | Schwach gegen | Kontert man mit |
|---|---|---|---|---|
| Schützenkohorte / Aschengrenadiere | Linieninfanterie | Fußtruppen | Gepanzerte | MG-Trupps, Artillerie |
| Mahlwerk / Sensenwerk | Feuerunterstützung (MG) | Fußtruppen, Reiter | Gepanzerte, Nahkampf | Grabenstürmer, Reiter |
| Grabenräumer / Sturmbrecher / Eingreiftrupp | Grabenstürmer | Gepanzerte, Nahkampf, Geschütze | Beschuss auf Abstand | MG-Trupps, Feuerbereitschaft |
| Löwenoger | Grabenstürmer | Fußtruppen, Nahkampf, Geschütze | Panzerbrechende Waffen | Panzerjäger, Schwerer Nahkampf |
| Graben-Pioniere | Pioniere | Gepanzerte, Stellungen und Gebäude | – | MG-Trupps, Artillerie |
| Panzerbüchsen-Trupp | Panzerjäger | Gepanzerte | – | MG-Trupps, Artillerie |
| Grabenmörser / Minenwerfer | Steilfeuer | Stellungen und Gebäude | Nahkampf, Reiter | Grabenstürmer, Reiter |
| Feldkanone / Donnerrohr / Grabengeschütz | Fernfeuer | Stellungen und Gebäude | Nahkampf, Reiter | Grabenstürmer, Reiter |
| Landkoloss / Sturmpanzer | Durchbruch (Panzer) | Stellungen und Gebäude | Panzerbrechende Waffen | Panzerjäger, Pioniere mit Ladung |
| Kreuzschreiter / Eisenknecht | Durchbruch (Stufe 3) | Nahkampf, Stellungen (Kreuz auch Gepanzerte) | Panzerbrechende Waffen | Panzerjäger, Pioniere mit Ladung |
| Lanzen- / Sprenglanzen-Reiter | Reiter (schneller Stoß) | Geschütze | Beschuss auf Abstand | MG-Trupps, Feuerbereitschaft |
| Scharfschütze / Pirschjäger | Scharfschützen | Reiter | Gepanzerte, Nahkampf | Grabenstürmer, Reiter |
| Stahlgänger / Panzerknechte / Eiserne Hünen | Schwere Infanterie | Nahkampf (Hünen auch Reiter) | Gepanzerte, Panzerbrechende Waffen | Panzerjäger, Schwerer Nahkampf |
| Rote Faust / Eiserner Kürassier | Held | Nahkampf, Geschütze | Panzerbrechende Waffen (+ Gepanzerte bzw. Beschuss) | Panzerjäger, Schwerer Nahkampf |
| Hauptmann / General | Führung | – | Gepanzerte | MG-Trupps, Artillerie |
| Feldscher / Aschenpfleger · Versorgungstrupps | Sanität · Versorgung | – | Nahkampf, Beschuss auf Abstand | Grabenstürmer, Reiter |
| Fernsprech-, Signaltrupp, Ballon | Aufklärung und Feuerleitung | – | Nahkampf (+ Beschuss) | Grabenstürmer, Reiter |
| Weitere | Meldegänger: Unterstützung · Rauchwerfer: Nebel · Flammen-/Brandwerfer: Flammen · Schildwall/Schwere Grabenwacht: Schutz · Bannerträger: Moral · Gasschutz: Gasschutz · Mineure, Drahtpioniere: Pioniere | | | |

- **Rollen schärfen (Vorschläge, nichts an Werten geändert):**
  1. **Sturmbrecher ↔ Eingreiftrupp** (Aschenwacht, beide 100, beide Grabenstürmer): echte Dublette.
     - Sturmbrecher = Angriff (Panzergranate gegen Kolosse, Draht schneiden).
     - Eingreiftrupp = **Gegenstoß**: stark gegen Gegner auf eigenen Zielfeldern oder in eigenen Gräben, z. B. ×1,25 dort, schwächer im Vorgehen.
  2. **Sturmbrecher (100) ↔ Grabenräumer (50)** (Seitenspiegel, Enricos Beispiel): gleiche Rolle, doppelter Preis.
     - Grabenräumer = billiger Grabenkampf ohne Panzerabwehr.
     - Sturmbrecher = „Sturm und Panzerabwehr“, die Panzergranate als Kern in den Text.
     - Oder Preis/Werte annähern.
  3. **Kohorte ↔ Grenadiere** (Enricos Beispiel, 40 zu 30): beide Linieninfanterie.
     - Kohorte = **Schützenlinie** (Schuss 2 Felder, Feuerbereitschaft, hält Zielfelder).
     - Grenadiere = **Stoßinfanterie** (Handgranaten vor dem Nahkampf, Nahkampf stärker, Schuss schwächer).
     - Die Rolle hieße dann je Seite anders.
  4. **Feldkanone (40) ↔ Donnerrohr (50)** (Konkordat, beide Fernfeuer).
     - Feldkanone = direktes Feuer, flache Bahn, gegen Gepanzerte und Gebäude, schnell aufgeprotzt.
     - Donnerrohr = Steil- und Sperrfeuer.
  5. **Fernsprechtrupp (20) ↔ Ballonbeobachter (25)** (Konkordat): Rollennamen trennen.
     - Fernsprech = „Feuerleitung“ (Feuerschlag).
     - Ballon = „Aufklärung“ (Sicht, Markieren).
  6. **Sägeschreiter ↔ Klauenschreiter** (Aschenwacht, je 105, nur mit Kampfmaschinen): beide Nahkampf-Maschinen.
     - Säge = gegen Gepanzerte.
     - Klaue = gegen Fußtruppen (packen/schleudern).
  7. **Panzerknechte (65) ↔ Eiserne Hünen (90)**: beide Schwere Infanterie.
     - Hünen = MG-Feuer (Dauerfeuer); so auch die Rolle nennen: „Schweres Feuer“.
     - Panzerknechte = Nahkampf und Draht.

### Noch offen / für Enrico
- Entscheidungen:
  - **F92:** Stufe 1 einschalten?
  - **F94:** B + Feind-Armee selbst wählen + sanftes Nachziehen?
  - **F95:** Zielmischung übernehmen? Gewehr A oder B? WebAudio-Umbau mit Begrenzer und Stimmen-Regler?
  - **F103:** welche Schärfungen?
- MERKEN: Roboter-Stimmen für Schreiter. Im Pult gibt es den Bereich „Stimmen“, dort kommt eine Gruppe „Schreiter“ dazu, sobald die Dateien da sind.
- Aschenwacht-General Säbelhieb: wartet auf Enricos Bogen `aschenwacht_general_posen3.png`.

## 2026-11-22 Mittag – Aufträge 10:25 bis 12:18 erledigt (`66d3315` … `3065341`)

Alles eingebaut, getestet und gepusht. Partietest fehlerfrei, test_regeln und test_kommentare in Ordnung.

### 10:25 Entscheidungen
- **MG-Rückstoß:**
  - Das MG wird nur zurückgeschoben, nicht mehr abgebaut. Zum Messen dient `RUECKMG_AB=1`.
  - Messung (je 200 Schlachten, Startwerte 1–4):
    - Grauwall 50, 58, 56, 49 % → **Ø 53,3 %**.
    - Sankt Ruß 50, 56, 52, 51 % → **Ø 52,3 %**.
- **Konkordat-General:** Hieb und Stoß haben jetzt dieselbe Größe wie die übrigen Posen. Bild: `entwurf/probe/f101_general_nahkampf.jpg`.
- **Heldentöne (ElevenLabs) als Standard**, die alten bleiben im Pult wählbar:
  - Rote Faust: Servo-Faustschlag; beim Durchbruch-Aufprall der Einschlag.
  - Kürassier: neue Schritte, Kettenschwert springt an, Schwung mit Schnitt.
  - Treffer nach Ziel: Metall gegen Gepanzerte, Fleisch gegen Fußtruppen.
- **Sanitäter-Rufe:** Gravel fürs Konkordat und Ragnar für die Aschenwacht, im Platz `medic`, mit den Gasmasken-Filtern. Zugeordnet nach Länge, nicht nach Gehör.
- **Kreuzschreiter-Posen:** Löwenmaul-Schuss, Hammerschlag, Unterarm-Kanone (Zweitwaffe und Gebrüll).
  - Die Geh-Pose aus dem Bogen ist unbrauchbar: Sein Hammerkopf hängt an der Nachbarfigur. Gehen = Grundbild, das zeigt denselben Schritt.
- **Eisenknecht-Posen:** Gehen, Kanonen, Faustsalve, Ausholen und Hieb mit der Hackklinge. Rauch entfernt, Mündungen gemessen.
- Bild: `entwurf/probe/schreiter_posen.jpg`.

### 10:35 Symbole, Heldenfunken, Stimmen
- **bogen8a** (9 Fähigkeiten-Symbole) und **bogen8b** (8 Befehlssymbole, 11:37) sind eingebaut: auf Knöpfen, Mauszeigern, Zustandsmarken und Feld-Meldungen. Die Gaswolke unter „Feuer frei“ ist entfernt.
- **Symbol → Stellen** (Knopf = Bedienfeld, Zustand = Marke/Tooltip, Feld-Meldung = Symbol statt Text):
  - **Eine Bedeutung:**
    - Durchbruch, Hinrichtung, Sturmrollen, Sturmlauf, Sprung (Knopf + Zeiger).
    - Gebrüll, Kanone-Zweitwaffe (Faustsalve und Unterarm-Kanone), Panzergranate, Breitseite.
    - Sammeln (Befehl, „Moral steigt“), Sturmbefehl (Befehl + Zustand), Feuer frei (Befehl + Zustand).
    - Halten (Befehl + Zustand), Generalangriff, Markieren, Feuerschlag, Feuerbereitschaft (Knopf + Zustand).
    - Fahne nur noch Banner, Auge nur noch Sicht und Aufklärer, Schild nur noch „Schilde vor“, Fadenkreuz nur noch „Schuss“ in der Zugvorschau. Der Blitz ist jetzt frei.
    - Marsch (geflügelter Stiefel) nur Bewegung, Nahkampf nur Nahkampf (Knopf, „Gebunden“, Medaille), Artillerie-Granate nur Sprenggranate und Streuung.
  - **Noch doppelt (markiert, Vorschlag: Bogen C):**
    - **Sprengladung** steht für vier Dinge: Haftladung, Sprenglanze, Gebäude rammen und die Medaille „gegen Panzer“.
    - **Stiefel ohne Flügel** steht für „Ziehen“ und für „Ballon einholen“.
    - **Garbe** steht für MG-Sperrfeuer, Dauerfeuer bereit und Reaktionsfeuer. Das ist dieselbe Waffe, deshalb vertretbar.
- **Heldenfunken** (fx_heldenfunken):
  - Kürassier: blau-weißer Einschlag und Funkenstrich bei Kettenschwert-Treffer und Hinrichtung, kaltes Leuchten beim Furcht-Puls.
  - Rote Faust: oranger Einschlag, Strich und Glut bei Faustschlag und Durchbruch.
  - Bilder: `entwurf/probe/heldenfunken_faust.jpg`, `heldenfunken_kalt.jpg`.
- **Stimmenpaket:**
  - Neuer Pult-Bereich **„Stimmen“**: links unter der Kategorie „Stimmen“, je Seite 15 Zeilen (Auswahl, Vorrücken, Feuer, Sturm, Niedergehalten, Rückzug, Sammeln, Granate, Gas, Koloss gesichtet, Feuerbereitschaft, Sanitäter, Held tritt an, Held fällt, Sieg).
  - Alle 26 Dateien sowie Gravel und Ragnar stehen als Kandidaten bereit. Standard ist „kein Ton“; Enrico ordnet zu.
  - Je Zeile ein Filter (Gasmaske + Rauschen, nur Rauschen, roh) mit Stärke. Er läuft live über WebAudio, gleich im Pult und im Spiel.
  - Im Spiel kommt die Wahl über den Export und `tonwahl_bau` an.
  - Regeln: höchstens ein Ruf gleichzeitig, je Ereignis höchstens alle 7 s, Auswahl nur jede dritte (dann statt des Spruchs).
  - Bild: `entwurf/probe/pult_stimmen.jpg`.
  - Die Sprache konnte ich nicht hören, deshalb ist nichts vorsortiert.

### Schreiter mit neuem Aussehen (10:47–12:15)
- **Sägeschreiter:**
  - Grundbild = Ruhe, dazu Gehen, Drehlauf feuert, Ausholen und Sägehieb.
  - Töne: Einschlag und Sägen gegen Fußtruppen, Metall gegen Gepanzerte. Welche der beiden Metall-Dateien Einschlag und welche Sägen ist, konnte ich nicht hören; beide laufen zufällig.
  - Doppelte alte Dateien liegen in `sound-quelle/_neu/doppelt/` (verschoben, nicht gelöscht).
- **Klauenschreiter:**
  - Ruhe, Gehen, MG feuert, Klauenhieb (loses MG-Rohr entfernt), Ausholen aus posen4 (beide Beine), Getroffen aus posen4.
  - Ton Stahlklaue nach Ziel.
- **Turmschreiter:** Gehen = Grundbild. Mündungen: Kanone am hinteren Arm, Turm-MG am vorderen Arm.
- **Ordensschreiter:**
  - Ruhe als Grundbild, dazu Gehen, MG feuert und Kettenschwert-Hieb. Rauch über den Orgelpfeifen entfernt.
  - Treffer gegen Panzerung: Kettenschwert-Töne.
  - **Abweichung:** Enrico schrieb „Gehen = neues Grundbild“. Seit die Ruhepose da ist, steht er im Stand in Ruhe und läuft mit der Geh-Pose, wie Säge- und Klauenschreiter. Wenn Gehen als Standbild gewünscht ist: eine Zeile.
- Bilder: `entwurf/probe/saege_klaue_posen.jpg`, `orden_klaue_posen.jpg`, `turmschreiter_neu.jpg`.

### Weitere Töne (11:18–12:18, alle ElevenLabs, CREDITS ergänzt, sound-quelle gesichert)
- **Kettenschwert gegen Rüstung:** 3 weitere Fassungen, auch für den Ordensschreiter. Allgemein neu: nie zweimal hintereinander dieselbe Fassung.
- **Neue Waffentöne als Pult-Kandidaten** (Gruppe „waffen_neu“), nicht automatisch: schwere Pistole, Granatwerfer, schweres Gewehr, schweres MG.
- **Stacheldraht:** Schneiden, Überrollen (Fahrzeuge/Schreiter) und Infanterie im Draht sind Standard.
- **Schritte:** Schreiter-Schritte im Takt der Beinbewegung (Säge-, Klauen-, Turm-, Ordens-, Kreuzschreiter, Eisenknecht). Kampfanzug-Schritte für Stahlgänger, Hünen und Panzerknechte.
- **Krallen:** Raubkatzen-Krallen gibt es laut Einheitendaten nur beim **Löwenoger** (Pranken). Kreuzschreiter (Löwenkopf, aber Hammer) und Klauenschreiter (Stahlklaue) nehmen sie nicht.

### Noch offen (geht jetzt weiter)
F98 Blut bei Beschuss, Schritt 11 Einheiten-Statistik (mit Rolle/Stark/Schwach für F103), Schritt 12 F92 Schärfe, F94 und F95 (Vorschläge und Proben), F103 Rollen in den Texten.

## 2026-11-22 – Entscheidungen Paket H umgesetzt, Paket I Zwischenbericht (F102, F96, F99, F101) (`2e1ca6c`, `e018a4f`)

### Entscheidungen zum Paket-H-Bericht
- **(1) Sturmrollen-Anlauf ohne Kolossfurcht:** umgesetzt.
  - **Messung** (je 200 Schlachten, Startwerte 1–4):
    - Grauwall: Konkordat 58, 54, 60, 50 % → **Ø 55,5 %**, unverändert. Die Furcht war also nicht die Ursache.
    - Sankt Ruß: 52, 56, 51, 51 % → **Ø 52,5 %**.
  - **Nächster Vorschlag (nichts nachgestellt):** Der Rückstoß baut aufgebaute MG ab (K4). Mit dem Sim-Schalter `NORUECKMG=1` (MG bleibt aufgebaut) liegt Grauwall bei **50, 58, 56, 49 % → Ø 53,3 %**. Vorschlag: Der Rückstoß schiebt das MG zurück, baut es aber nicht ab. Enrico entscheidet.
- **(2) Titel vor dem Anlauf:** Bei Durchbruch, Sturmrollen und Sprungangriff kommt jetzt zuerst der Titel, dann Anlauf bzw. Sprung, dann der Schlag.
  - Helden zeigen den großen Titel. Sturmrollen und Sprung zeigen einen kleineren Titel in der Bildmitte (Konkordat warm, Aschenwacht kalt).
  - Bilder: `entwurf/probe/titel_vor_anlauf_durchbruch.jpg`, `entwurf/probe/titel_vor_anlauf_sturmrollen.jpg`.
- **(6) K13 Posen zugeordnet** (Vorher/Nachher: `entwurf/probe/k13_vorher_nachher.jpg`):
  - **Fernsprechtrupp:** Flaggenwinken als zweite Funk-Pose.
  - **Signaltrupp:** kniend am Telefon als zweite Funk-Pose. Sie sieht der Ruhepose sehr ähnlich, deshalb fällt der Wechsel kaum auf.
  - **Feldscher und Aschenpfleger:** mit Trage als zweite Laufpose.
  - **Schwere Grabenwacht:** Keulenhieb.
  - **Schildwall:** Ausholen mit der Keule, Hieb mit dem Schild vorn, Vorrücken mit dem Schild.
  - **Werkstatt:** Schraubenschlüssel als zweite Reparaturpose, Zeigen beim Bergen.
  - Neu und allgemein: Jede Pose darf eine zweite Fassung haben (`…2`), die zufällig gewählt wird.

### F102 Fertig selbst setzen – so bedient es sich
- Bei jeder gewählten eigenen Einheit, in jedem Zustand: Knopf **„Fertig“** (Haken) im Bedienfeld oder **Leertaste** bzw. **E**.
  - Die Einheit wird grau, und die Auswahl springt zur nächsten offenen Einheit.
- **Rückgängig:** die graue Einheit anklicken und noch einmal „Wieder öffnen“ (derselbe Knopf, Leertaste oder E). Sie hat dann wieder dieselben Bewegungspunkte und dieselbe Aktion wie vorher.
- Die automatische Haken-Logik (F88) bleibt.
- Der Partietest prüft es mit echten Tastendrücken.

### F96 Schussfeld der Feuerbereitschaft und des MG-Sperrfeuers
- **Vorschau:** Beim Überfahren des Knopfs „Feuerbereitschaft“ bzw. „Sperrfeuer“ sind die überwachten Felder gefüllt. Gegner darin bekommen einen Ring, die übrigen Einheiten werden abgedunkelt.
- **Überwachte Felder:** Feuerbereitschaft = Reichweite und Sicht in alle Richtungen, wie die Regel. MG-Sperrfeuer = Reichweite, Sicht und Schussfächer.
- **Solange die Bereitschaft gilt:** eine feine gestrichelte Umrisslinie am Boden (Konkordat Gold, Aschenwacht Graublau). Beim Darüberfahren oder Auswählen ist das Feld leicht gefüllt.
- Gegnerische Bereitschaft wird nur gezeigt, wenn die Einheit sichtbar ist. Bei Bildwirkung „aus“ ist alles blasser.
- Bilder: `entwurf/probe/f96_schussfeld.jpg`, `entwurf/probe/f96_schussfeld_gewaehlt.jpg`.

### F99 Zielpose in Feuerbereitschaft
- Einheiten in Feuerbereitschaft knien in ihrer Zielpose, solange sie gilt. Sie stehen wieder auf, sobald sie geschossen haben oder die Bereitschaft endet.
- **Alle 14 Typen**, die Feuerbereitschaft nehmen können, haben eine kniende Zielpose: Kohorte, Grenadiere, Brandwerfer, Scharfschütze, Pioniere beider Seiten, Panzerbüchse, Stahlgänger, Hünen, Panzerknechte, Flammentrupp, Hauptleute, Pirschjäger.
- **Fehlt:** Mahlwerk und Sensenwerk (MG-Sperrfeuer) sind Einzelmodelle ohne Posen. Das aufgebaute MG zielt im Bild schon. Ein eigener Bogen „MG-Schütze am Abzug“ wäre nur für mehr Bewegung nötig.

### F101 General-Nahkampf
- **Konkordat:**
  - Neuer Bogen `konkordat_general_posen3` geschnitten (Säbelhieb schräg nach unten, Säbelstoß nach vorn; Fahnenträger dahinter wie bei den anderen Posen).
  - Im Nahkampf zufällig: Stoß, oder Ausholen (Säbel erhoben) und dann der Hieb.
  - Bild: `entwurf/probe/f101_general_nahkampf.jpg`. Der General wirkt in der Hieb-Pose etwas größer; wenn das stört, gleiche ich den Maßstab an.
- **Aschenwacht:**
  - Hatte keine Nahkampf-Pose. Jetzt hebt er im Nahkampf den Säbel (vorhandene Pose).
  - **Es fehlt ein Bogen mit Hieb bzw. Stoß** wie beim Konkordat-General. Vorschlag: `aschenwacht_general_posen3.png`, gleiche Machart (2 Figuren, Fahnenträger dahinter).

### Tests
Partietest fehlerfrei (F88, F89, F90, F97, F100, F102), test_regeln und test_kommentare in Ordnung.

Weiter mit: F98 Blut bei Beschuss, Schritt 11 Einheiten-Statistik, Schritt 12 F92 Schärfe, F94 und F95 (nur Vorschläge und Proben).

## 2026-11-22 – Paket H abgeschlossen (Prüfliste 2 + Spieltest Runde 5, F100) (`314fc93`, `30c4e01`)

Nachtarbeit wie gewünscht. Alles ist committet und gepusht, `index.html` erst am Paketende (H2).
- **Tests:** test_partie fehlerfrei bei 1280/1920/2560 px, mit neuen Prüfungen für F88, F89, F90, F97 und F100. test_regeln, test_belegung, test_draht (jetzt ohne Fehlalarm) und test_kommentare in Ordnung.

### Bitte entscheiden (übersprungen oder offen)
1. **Balance nach K4 (Anlauf nach normalen Zugregeln):**
   - **Messung Grauwall** (je 200 Schlachten, Startwerte 1–4): Konkordat **55,5 % statt 52,0 %**.
     - Neu: 58, 54, 60, 50 %.
     - Alt: 53, 50, 56, 49 %.
   - **Sankt Ruß** (Startwert 1): 56–57 % statt 53 %.
   - **Vermutete Ursache:** Das Sturmrollen der Kolosse (Konkordat rollt etwa 10-mal je Schlacht) löst jetzt wie jeder Zug auch die Kolossfurcht (Moral) bei nahen Gegnern aus. Minen, Sperrfeuer und Feuerbereitschaft bremsen den Anlauf dagegen kaum.
   - **Möglichkeiten:**
     - (a) So lassen.
     - (b) Beim Anlauf keine Kolossfurcht.
     - (c) Rollen-Schaden leicht senken.
   - Ich habe nichts nachgestellt.
2. **Ablauf Durchbruch:** Durch K4 läuft die Faust jetzt erst als normaler Zug ans Ziel; danach kommen Titel und Schlag. Soll der Titel schon vor dem Anlauf kommen?
3. **F88 Haken:** Nach der Berater-Regel ist eine Einheit erst fertig, wenn auch Ziehen nicht mehr geht. Mörser, Minenwerfer und Schützen, die schießen, ohne vorher zu ziehen, bekommen deshalb keinen Haken. Neu steht im Bedienfeld „Aktion verbraucht, kann noch ziehen – noch nicht fertig“. Passt das so?
4. **F91 ältere Pult-Wahlen:**
   - Sechs Wahlen stehen nur in älteren Exporten, nicht im neuesten: Schlag bei Sturmtrupp, Eingreiftrupp, Sturmpanzer, Hauptmann D, General D und Schwerer Grabenwacht. Sie sind eingebaut (Auftrag: „zusammenführen“). Wenn Enrico sie im Pult bewusst zurückgesetzt hatte: Bescheid geben, dann nehme ich sie heraus.
   - Schildwall: Die Wahl `punch` gibt es nicht als Platz, deshalb ausgelassen.
5. **Löwenoger-Brüllen:**
   - Das tiefe „Low-Low-Brüllen“ ist **`oger_bruell`**: Lion roars mit Knurren und Einatmen. Es kommt beim **Anwählen** und als **Brüllen im Nahkampf**. Im Pult sind das die Zeilen „Brüllen beim Anklicken“ und „Brüllen im Nahkampf“ (Gruppe Fahrzeug/Monster). Dort kann Enrico gezielt tauschen.
   - Nichts davon ist fest im Code; alle Oger-Töne laufen über Tonplätze.
   - Der normale Oger-Schlag war `neu3_bestie` (Tiger-Attacke). Das Pult hatte dafür fälschlich `axe` gezeigt (M8, behoben). Enricos Wahl „Schlag = sword“ gilt jetzt dort.
6. **K13:** Zehn Posenbilder ohne Verwendung, Zuordnung nach Augenmaß nötig: Melder 3, Sanitäter 1, Schwere Grabenwacht 2, Schildwall posen2_1/2 und posen_3, Versorgung posen2_3/4.
7. **K14 Rest:**
   - `mg3` ist ein alter Ton ohne Quelldatei; ein Ausklang ließe sich nur neu schneiden.
   - `kolosskanone_1` wird beim Bau auf 0,37 s gekürzt (Stille-Erkennung).
   - Beides bitte im Pult anhören. Wenn nötig, tausche ich die Datei.
   - `boomH_1` ist angeglichen.
8. **M6 Grauwall-Einsatz:** Die KI kauft den Kürassier auf Grauwall weiter selten (0,2 je Schlacht). Früher kaufen oder am Zielfeld aufstellen wäre ein KI-Umbau mit Balance-Folgen. Erst nach Punkt 1.

### Schritt 1–3 (Zwischenbericht oben): H1, K1, F89, F90, M7, F97, F88, F93
Dazu kam der Befehlsruf der Offiziere, der stumm war; jetzt hörbar.

### F100 Fähigkeits-Modus
- Ein Klick neben die markierten Ziele löst nichts mehr aus: kein Schuss, kein Zug, keine Pause.
- Stattdessen kommt eine kurze Meldung, z. B. „Sturmrollen: zu weit – reicht 2 Felder geradeaus.“; eigene Texte gibt es für Durchbruch, Hinrichtung und Sprung.
- Gilt für alle Feld-Modi: Fähigkeiten, Draht schneiden, Zweitwaffe, Rammen, Faustsalve.
- Eine andere eigene Einheit anklicken wechselt wie gewohnt die Auswahl.
- Test mit echten Mausklicks im Partietest.

### Schritt 4
- **M1:** Die KI überspringt Held, Stufe-3-Schreiter und General, wenn es sie schon gab. Vorher blieb die Wunschliste daran hängen und die KI kaufte nichts mehr. Mit 150 Punkten je Runde kauft sie jetzt durchgehend.
- **M2/K5:** Armee-Auswahl: „Held: höchstens einer je Armee.“ Nachschub: „Held: nur einer je Schlacht, auch nach seinem Fall.“; ebenso für Stufe 3.

### Schritt 5
- **M3/K12 Mündungen:**
  - Gemessen für 20 Schuss-Posen: Soldat stehend und kniend beider Seiten, Pioniere, Gasschutz, Kampfanzug, Scharfschütze, Pirschjäger, Flammentrupp, Hauptmann-Pistole.
  - Helden und Generäle lesen jetzt ihre gemessenen Werte.
  - Schildwall: Das Gewehr ist hinter dem Schild verdeckt, nicht gemessen.
- **M4:** Der Kürassier „hängt im Graben/im Schlamm fest“ mit Rüstungsschlag und Stampfen statt Autounfall. Schlamm spritzt nur im Schlamm, sonst Staub; Kopfzeichen Schweißtropfen.
- **K6:** „Kugel vorbei“ nur noch nach einem Schuss.
- **K7:** Flug- und Aura-Merker gelten je Schlacht; der Flug nur direkt nach dem Durchbruch.
- **K8:** Ritter-Schritte +8 dB und Bass +6 dB.
- **K10:** Die Helden zeigen auch mit der Blauen Legion ihren eigenen Bogen und ihr Porträt.

### Entscheidungen von Enrico umgesetzt
- **K4:** Der Anlauf von Durchbruch und Sturmrollen läuft als normaler Zug.
  - Minen, Sperrfeuer, Feuerbereitschaft, Freischlag, Feuer, Gas und Draht greifen.
  - Kommt der Angreifer nicht unversehrt an, entfällt der Stoß.
  - Das zurückgeschleuderte Ziel löst Minen aus und brennt im Feuer; ein aufgebautes MG wird abgebaut.
  - Regeltest in Node bestanden: Mine im Anlauf, Mine hinter dem Ziel, MG als Ziel.
  - Sim: siehe Punkt 1 oben.
- **K9:** Helden 1,65, Hünen 1,7 Soldatenhöhen (Maßstab beim Zeichnen, die Bögen bleiben).
- **K11:** Helden nicht ins Kirchenschiff und nicht auf den Turm; Texte ergänzt.
- **K17:** Medaillen 40 px.

### Schritt 6 Texte
- **M5:** Überall „alle N Runden“ bzw. „höchstens alle N Runden“ statt „N Runden Pause“; die Regel bleibt.
- **K2 Durchbruch:**
  - „Kostet die Aktion und alle Bewegung“.
  - „Anlauf nur aus dem Stand“, ein Ziel direkt daneben geht auch nach dem Ziehen.
  - „bis 26 Schaden, gegen Gepanzerte weniger“.
- **K3:**
  - Standhaft wirkt auch auf die Faust selbst.
  - Furcht gilt nicht gegen Fahrzeuge und Schreiter, senkt höchstens bis 5 und löst allein keine Flucht aus.
- **K15:** Regeln „Stark und schwach“: Helden beim schweren Nahkampf; Schrot an Panzern wirkungslos; normaler Nahkampf gegen Kampfanzüge und Panzer ×0,5.
- **K16:** CLAUDE.md berichtigt (Ballon-Sicht 4, Befehle 1 Feld, höchstens 3, großer Befehl 2 Felder).

### Schritt 7 Töne
- **F91:** Neues Werkzeug `tools/tonwahl_bau.mjs`. Es führt alle sechs Pult-Exporte zusammen (der neueste gewinnt; 58 Wahlen, davon 55 wirksam für 35 Einheiten) und schreibt sie als Tabelle `TONWAHL` ins Spiel.
  - `playSound` nimmt die Wahl der Einheit, die gerade schießt, schlägt oder getroffen wird: fester Ton, anderer Platz, still, Lautstärke, Tonhöhe.
  - Im Browser geprüft: Der Löwenoger schlägt mit `sword`.
- **M8:** Die Pult-Zeilen der Helden und des Löwenogers entsprechen jetzt dem Spiel.
  - Faust: Ausholen, Hydraulik-Boom und Dampfstoß; beim Ziehen Schritte und leiser Dampf.
  - Kürassier: Säge springt an, Kampfschrei, Schnitt; beim Ziehen Ritter-Schritte.
  - Löwenoger: Tiger-Attacke statt `axe`.
  - Eine Pult-Wahl an Zeilen, die das Spiel anders benennt, wird beim Einbau auf den echten Platz umgeschrieben.

### Schritt 8 Größe (H2 + M9)
- **Auslagerung:** 162 Töne aus 41 Plätzen, die das Spiel nie spielt, liegen jetzt in **`src/sound_pult.js`** (6 MB).
  - Pult und Tonprobe laden beide Dateien und zeigen alle 785 Töne (geprüft).
  - `sound_bau.mjs` teilt nach jedem Lauf automatisch (`tools/ton_teilen.mjs`).
  - Im Zweifel bleibt ein Ton im Spiel.
- **Ballon:** `ballon_brenner` faucht jetzt beim Aufsteigen.
- **`index.html`: 52,3 MB statt 58,3 MB.**
- **Git:** `git gc` hat den lokalen Git-Ordner von **3,6 GB auf 1,3 GB** verkleinert (2,47 GiB lose Objekte gepackt; Paket jetzt 1,26 GiB). Die Größe bei GitHub habe ich nicht gemessen.
- `index.html` wird künftig nur am Paketende eingecheckt (CLAUDE.md und Gedächtnis).

### Schritt 9
- **M6:**
  - Die KI-Gefahr Graben/Schlamm/Sumpf für den Kürassier ist neu (`W_STECKEN`).
  - Sankt Ruß: steckt fest 21× in 200 Schlachten (0,11 je Schlacht, vorher 0,18), Hinrichtung 0,12 je Schlacht.
  - Heldenfall gezielt (`HELD_STR=2.5`): 14 Heldenfälle in 200 Sankt-Ruß-Schlachten, keine Fehler, Konkordat 53 % statt 57 % (schwache Faust).
- **K18:** Brett-Scroll-Rest und die Exporte `totalPts`/`cutCost` entfernt.
- **K19:** test_draht ohne Fehlalarm; der Kartenaufbau zählt nicht.

### Schritt 10 Größenprobe (nur gemessen, nichts am Spiel geändert)
Grauwall gestapelt (16 Spalten, 10/20/30 Zeilen, Armeen und Ziele ×k), Dateien in `entwurf/probe/groesse/`. Unsichtbarer Chrome 1920×1080.

| Karte | Einheiten | Bild Übersicht Ø / 95 % / max | Bild nah Ø / 95 % | Bild im KI-Zug Ø / 95 % | KI-Rechnen je Seitenzug Ø / 95 % | KI-Zug gesamt (mit Animation) | Speicher | Schlacht bereit |
|---|---|---|---|---|---|---|---|---|
| ×1 (16×10) | 39 | 17 / 28 / 33 ms | 5,6 / 5,7 ms | 16 / 28 ms | 15 / 22 ms | 30 s | 112 MB | 5,1 s |
| ×2 (16×20) | 76 | 37 / 67 / 78 ms | 12 / 28 ms | 30 / 61 ms | 104 / 173 ms | 56 s | 118 MB | 6,2 s |
| ×3 (16×30) | 113 | 46 / 83 / 95 ms | 14 / 33 ms | 41 / 72 ms | 322 / 511 ms | 80 s | 110 MB | 6,1 s |

- **Messbedingungen:** Die KI-Zeiten in Node wurden gemessen, während parallel Sims liefen; die echten Werte sind eher niedriger. Die Probekarten laufen ohne Gelände-Bausteine (klassisches Bodenbild), Grauwall mit.
- **Was gezeichnet wird:** Figuren nur im sichtbaren Ausschnitt. Das **flache Bodenbild wird in jedem Bild für die ganze Karte neu gezeichnet** (`drawGround`); die gekippte Projektion arbeitet zeilenweise nach Bildschirmgröße.
- **Was zuerst bremst:** Das Zeichnen in der Übersicht. Bei ×2 sinkt die Übersicht auf etwa 25 Bilder/s, nah bleibt es flüssig. Die KI-Rechenzeit wächst stark (×3: 0,3–0,5 s je Seitenzug, ohne Worker kurze Ruckler). Der Speicher bleibt unkritisch.
- **Einschätzung:**
  - Bis etwa doppelte Fläche geht es ohne Umbau, wenn das Bodenbild nur bei Änderungen neu gezeichnet wird statt in jedem Bild (Zwischenspeicher, kleiner Umbau).
  - Ab dreifacher Fläche lohnt WebGL (Mittelweg: Gelände und Figuren) und die KI im Worker.

### Vorschlag: wo noch Posen, Effekte und Töne fehlen (je Einheit, zum Auswählen)
- **Ganz ohne Posen** (nur Grundbild): Mahlwerk-Trupp, Sensenwerk-Trupp, Meldegänger mit Hund, Rauchwerfer, Ballonbeobachter. Dazu alle Geschütze, Fahrzeuge und Schreiter (Einzelbild; Bewegung nur über Rückstoß, Rütteln und Effekte).
- **Ohne Nahkampf-Pose** (stehen beim Schlag still): Brandtrupp, Feldscher, Aschenpfleger, Scharfschütze, Panzerbüchse, Signaltrupp, Flammentrupp, Fernsprechtrupp, Bannerträger, Hauptleute, Generäle, Versorgung, Gasschutz, Munition, Pirschjäger.
- **Ohne gemessene Mündung:** Schildwall; Ordensschreiter; Geschütz, Feldkanone, Mörser, Minenwerfer (Mündungsfeuer an der Bildkante).
- **Töne:** Tod und Aufreiben hat bei Fußtruppen keinen eigenen Ton (nur Blut; im Pult wählbar).
- **Ideen, noch nicht geprüft, ob schon etwas davon da ist:** Staub beim Hinfallen und Fliehen, Hülsen beim MG, Fußspuren im Schlamm, eigene Handgriff-Töne beim Heilen und Reparieren.
- Enrico wählt; dann Prompts für die Bögen.

### Nächstes
Paket I (F93 ist schon mit F88 erledigt; F94 Skirmish, F95 Tonmischung, F96 Schussfeld) nach Enricos Entscheidungen oben.

## 2026-11-22 – Paket H, Zwischenbericht nach Schritt 3 (+ F97)

Commits `0ccac2d`, `a61cec6`, `1bc6fc5`, `258c5b4`, `57bce68`. `index.html` ist lokal gebaut, aber nach H2 erst am Paketende eingecheckt – GitHub Pages zeigt bis dahin den alten Stand.

### H1 / K1 Kommentar verschluckt Code
- H1 behoben: Die Siegwarnung (F41) wird je Schlacht wieder zurückgesetzt.
- **Zusätzlicher Fund durch den erweiterten Test:** Der **Befehlsruf der Offiziere** (Hauptmann/General bei Sammeln, Feuer frei, Sturmbefehl) stand seit `f383ac0` (Hauptmann-Posen) ebenfalls hinter einem `//` und war stumm. Behoben.
- `test_kommentare.js` prüft jetzt auch einfache Zuweisungen, beliebige Aufrufe, `return`/`continue`, ganze Kommentarzeilen, stillen `case`-Durchlauf und `tools/`. Gegen den alten Stand findet er genau diese zwei Stellen.

### F89 Mörser-Blickrichtung
- Ursache: Die Bögen **Mörser, Rauchwerfer (Konkordat) und Minenwerfer (Aschenwacht)** sind nach links gemalt (Rohr links, Mannschaft dahinter). Alle anderen Geschütze, Panzer und Schreiter waren richtig (Bildvergleich aller 54 Typen).
- Behoben über eine Liste nach links gemalter Bögen (`BILD_LINKS`), beim Zeichnen gespiegelt.
- Partietest: Blickrichtung aller 54 Typen in beide Richtungen.

### F90 Panzer drehen sich im Nahkampf
- Die Regel drehte Fahrzeuge nicht (F76), aber die **Nahkampf-Szene** drehte den Verteidiger sichtbar zum Angreifer – und beim Gegenschlag den zurückschlagenden Panzer. Fahrzeuge bleiben jetzt auch in der Szene in ihrer Richtung (Schreiter wenden sich wie bisher). Test im Partietest.

### M7 + F97 Getroffen-Richtung
- M7 hatte die Getroffen-Pose bei Angriff von hinten gespiegelt – das sah wie Umdrehen aus (F97).
- Jetzt: **Getroffen wird nie gespiegelt.** Die Blickrichtung bleibt; Taumeln und Kippen gehen vom letzten Angreifer weg (Schuss, Granate, Nahkampf, Spezialschlag, auch von hinten).
- Die Bilder, die nach vorn kippen (F77-Liste), wurden bisher bei jedem Treffer gespiegelt (auch das wirkte wie Umdrehen). Sie werden jetzt stattdessen um den Fußpunkt **nach hinten geneigt**.
- Test: Konkordat und Aschenwacht, Beschuss von vorn, hinten, Seite, Nahkampf – nie gespiegelt, nie gedreht, nie zum Angreifer hin.

### F88 Haken „alles erledigt“ (abgestimmt mit F93, Hinweis des Beraters)
- Fertig (grau, Haken) heißt: **nichts geht mehr** – keine Aktion, keine freie Zweitwaffe, keine Fähigkeit, **kein erlaubtes Ziehen**. Das war schon die Regel im Code.
- Gemessen je Typ: Nahkämpfer verbrauchen beim Angriff alle Bewegungspunkte und werden fertig. **Mörser, Minenwerfer, Schützen**, die ohne vorher zu ziehen schießen, behalten Bewegungspunkte und dürfen laut Regel noch ziehen – darum kein Haken. Kolosse, Turm- und Kreuzschreiter bleiben bereit, solange die Zweitwaffe frei ist. Ein falsches „bereit“ habe ich nicht gefunden.
- **Neu:** Hat eine Einheit ihre Aktion verbraucht, steht im Bedienfeld, warum sie noch nicht fertig ist („Aktion verbraucht, kann noch ziehen – noch nicht fertig. „Fertig“ hakt sie ab.“).
- **F93** gleich mit: Nach dem Schuss bleibt die Einheit gewählt, solange sie noch etwas kann (dieselbe Prüfung). Vorher wurde z. B. der Landkoloss nach der Kanone abgewählt, obwohl das Seiten-MG noch frei war.
- Partietest: Schütze, Mörser, MG mit und ohne Bewegungspunkte.

### Tests
- test_kommentare in Ordnung, test_partie fehlerfrei (mit den neuen Prüfungen). Nur Anzeige, keine Regeländerung – keine Sim.

Weiter mit Schritt 4 (M1 KI-Wunschliste, M2/K5 Gründe für gesperrten Helden).

## 2026-11-21 – F87 Erst Schrift, dann Schlag (`0fa7ebc`)

- **Ablauf jetzt:** Der Fähigkeitsname knallt herein, steht etwa 1 s allein und ist ausgeblendet, **bevor** Ausholen, Anlauf, Druckwelle und Treffer beginnen. Der Schlag läuft danach frei sichtbar.
- **Einfrieren beim Treffer** bleibt (Durchbruch kurz, Hinrichtung etwa 0,2 s).
- **Auren (Standhaft, Furcht):** Die kleine Einblendung steht jetzt oben unter der Leiste, nicht mehr über den Figuren. Während ein großer Titel läuft, entfällt sie. Ring und Aufblitzen am Helden laufen weiter gleichzeitig.
- **Tempo:** Die Wartezeit für den Titel richtet sich nach dem Tempo. Bei „Sofort“ und beim Überspringen der Kampfszene wird nicht gewartet.
- **Bilder** (je 8 Augenblicke, oben Titel → ausgeblendet, unten Schlag):
  - `entwurf/probe/f87_durchbruch.jpg`
  - `entwurf/probe/f87_hinrichtung.jpg`
- **Tests:** test_partie fehlerfrei, test_kommentare in Ordnung. Nur Anzeige, keine Regeländerung, deshalb keine Sim.
- Wie gewünscht jetzt **keine weiteren Umbauten**, bis Prüfliste 2 und Spieltest da sind. `PRUEFLISTE2.md` nicht angefasst.

# Berichte von Claude Code (neuester oben)

## 2026-11-21 – Helden-Töne, Hinrichtung 40, F83–F86 (`df0f6d4`, `0f2593f`, `a67d515`)

### F83 / F85 Blickrichtung und Drehen – behoben
- **Ursache (eine für beide):** Seit F77 (Spiegeln bei „Getroffen“, `d2cd205`) verglich das Zeichnen `flip` (Zahl 0/1) mit einem Wahrheitswert (`!==`). Das ist immer „ungleich“. Deshalb wurden **alle Trupp-Figuren gespiegelt**: Das Konkordat schaute nach links. Beim Drehen änderte sich die Richtung intern richtig, das Bild aber nicht. Die Einzelmodelle (Helden, Schreiter) waren nicht betroffen.
- **Behebung:** `!!flip` an beiden Stellen. Zusätzlich merkt sich die Anzeige je Einheit, ob das Bild nach links blickt (`bildLinks`, für Tests).
- **Neue Prüfungen im Partietest:**
  - **Startausrichtung beider Seiten:** 33/33 richtig, in Graben, Ruine/Dorf, Wald und im Freien.
  - **Drehen über das Bedienfeld:** 3× rechts dreht das Bild um, 3× links bringt es zurück.
  - Der Test lief nach allen Änderungen fehlerfrei.

### F84 Ofen-Glut der Roten Faust – neu gezeichnet
- Die roten „Tropfen“ sind weg. Jetzt steigen **wenige glühende Funken aus dem Schornstein am Rücken (Ofen)** auf:
  - gelb-oranger Kern mit weichem Schein, flackernd;
  - sie treiben leicht zur Seite und verlöschen nach 1,3–2,2 s;
  - beim Spezialschlag kommen mehr.
- Die Bodenglut ist ein weicherer, dunkelroter Schein.
- **Bildwirkung:** „leicht“ zeigt halb so viele und blassere Funken, „aus“ keine.
- **Bild:** `entwurf/probe/f84_glut.jpg` (5 Augenblicke nebeneinander).

### F86 Auftritt der Heldenfähigkeiten – gebaut
- **Einblendung:** Der Fähigkeitsname steht groß in der Titelschrift (Arm Kopf), mit dicker Tintenkontur, leicht schräg, auf einem gerissenen dunklen Streifen. Er knallt herein (groß → kurz zu klein → fest), bleibt etwa 1,5 s und blendet nach oben aus. Darüber steht klein der Heldenname.
  - Rote Faust: glühendes Rot-Orange.
  - Kürassier: Eisweiß mit kaltem Schein.
  - Standhaft und Furcht erscheinen in kleinerer Fassung.
  - Die alte Zeile oben („Durchbruch!“) entfällt dafür.
- **Durchbruch:**
  - Beim Ausholen kommt ein Dampfstoß aus der Faust.
  - Beim Anlauf zieht eine Staubschleppe.
  - Beim Aufprall gibt es eine **Druckwelle als Ring am Boden** mit Staubschleier, eine Erdfontäne, Trümmer, Staubwolken rundum und starkes Rütteln. Dazu kommt ein ganz kurzes Einfrieren.
  - Das Ziel **fliegt im Bogen ein Feld zurück** und schlägt mit Staub auf.
  - Danach kommt noch einmal Dampf.
- **Hinrichtung:**
  - Beim Ausholen kommt der Sägestart.
  - Im Treffer: kaltes Aufblitzen, ein heller Ring, **Funken von der Kettensäge** (`fx_funken`) und **Stillstand** von etwa 0,2 s (die Effekte frieren ein).
  - Danach folgen ein schwerer Blutstoß (`fx_blut2`, zweimal) und die **Lache am Boden**. Bei Maschinen gibt es kein Blut.
- **Auren:** Wenn Standhaft (Beschuss neben der Faust) oder Furcht (Gegner neben dem Kürassier) zum ersten Mal in einer Runde wirkt, pulsiert ein Ring am Boden. Dazu kommen ein Aufblitzen und die kleine Einblendung. Danach bleibt die Aura dezent.
- **Bildwirkung:** Ringe sind bei „leicht“ und „aus“ schwächer, Funken und Staub weniger, der Stillstand bei „aus“ kürzer. Rütteln folgt wie immer dem Rütteln-Schalter.
- **Bilder mitten im Effekt** (je 4 Augenblicke):
  - `entwurf/probe/f86_durchbruch.jpg`: Einblendung, Anlauf, Druckwelle, Ziel fliegt.
  - `entwurf/probe/f86_hinrichtung.jpg`: Einblendung, Ausholen, Funken und Blut, Lache.
- **Gemalte Druckwelle fehlt:** Den Ring zeichnet der Code (Tintenkontur und Farbe, wie das Löwengebrüll). Wenn Enrico ihn gemalt möchte, braucht es einen Effektbogen **`fx_druckwelle`**: flacher Staub-/Druckring von oben schräg gesehen, 4 Größen bzw. Stufen, Magenta oder Schwarzgrund wie die anderen fx-Bögen.

### Helden-Töne (Enricos Liste 16:43–17:11)
- **Rote Faust:**
  - Ausholen: Vortex-Aufladen (`held_aufladen`).
  - Schlag: Hydraulik-Boom (`held_faustboom`, robot-footstep).
  - Danach: Dampfstoß (`held_dampfstoss`, air blast) und Zischen (`held_dampf`).
  - Kolben (Airlock, Compactor) liegen nur als Auswahl im Pult (`held_kolben`).
- **Kürassier:**
  - Ausholen: Sägestart (`held_saege_start`) und Kampfschrei hinter dem Helm (`held_ritter_schrei`, etwas tiefer und dumpfer).
  - Treffer: Säge heult auf und schneidet (`held_saege_schnitt`, 3 Ausschnitte).
  - Beim Ziehen: schwere Schritte im Takt (`held_schritt_ritter`, 4 Stampf-Stücke aus der Blast-Door-Datei).
  - Getroffen: Rüstungstreffer (`held_ruestung`).
- **Held fällt:** Hornstoß (`held_fall_horn`), 3,6 s mit 1,2 s Ausblenden.
- Alle Töne stehen im Ton-Pult (Gruppe „Helden“). Quellen liegen in `sound-quelle/Helden/`, gesichert.
- **Lizenzen** (nachgeschlagen, in CREDITS.md):
  - Horn: CC0.
  - Compactor: CC BY 3.0.
  - Airlock: CC BY-NC 4.0.
  - Air blast: Sampling+.
  - Blast Door: CC BY 4.0, aber laut Beschreibung ein Remix mit zwei CC-BY-NC-Teilen.
  - Die übrigen: Pixabay.
- **Achtung vor einem Verkauf:** Die **Kürassier-Schritte** (Blast Door) und der **Dampfstoß** (Sampling+) stecken im Spiel-Standard und stehen in der Liste „nicht kommerziell“. Für ein reines Hobbyspiel ist das unkritisch, für einen Verkauf müssten sie ersetzt werden.

### Hinrichtung ab unter 40 Stärke
- Grenze 40 statt 30; Texte in Hilfe und Info angepasst.
- **Sankt Ruß:**
  - Hinrichtungen je Schlacht 0,07 → 0,09–0,10.
  - Siegquote unverändert (53 % / 50 %; nach F86 erneut 53 %).
- **Grauwall:**
  - 0,01 Hinrichtungen je Schlacht. Dort kauft die KI den Kürassier selten (0,22–0,24 je Schlacht).
  - Siegquote unverändert (53 % / 50 %).

### Tests
- test_regeln: in Ordnung.
- test_kommentare: keine verschluckten Code-Reste.
- test_partie: fehlerfrei, mit den neuen Prüfungen für Startausrichtung und Drehen.
- Sim Sankt Ruß 200: Konkordat 53 %, keine Fehler.

### Offen / Hinweise
- Im Postfach liegt ein neuer Ton-Pult-Export `tonpult_export_1007_2026-11-21.json`. Ich baue ihn noch nicht ein; eingebaut wird wie vereinbart der letzte, vollständige Export (zusammengeführt mit den älteren).
- Als Nächstes laut AUFTRAG: Spieltest Runde 5 (Enrico) und Fable-Prüfrunde 2 (Auftrag vom Berater).

## 2026-11-21 – Helden: Die Rote Faust und Der Eiserne Kürassier (`c932f69`)

Beide sind im Spiel: kaufbar im Startmenü und im Nachschub, die KI kauft je einen. Sie spielen die Kampfszene, haben Posen, ein eigenes Porträt, eine Aura und Effekte beim Spezialschlag.

### Vorschlag Werte (Enrico entscheidet)

| | Rote Faust (Konkordat) | Eiserner Kürassier (Aschenwacht) |
|---|---|---|
| Preis | **110** (rechnerisch 125, Abgleich −15) | **110** (rechnerisch 135, Abgleich −25) |
| Angriff / Abwehr / Moral | 9 / 6 / 10 | 10 / 8 / 10 |
| Bewegung | 3 | **2** (langsam) |
| Fernkampf | Revolver, 1 Feld, schwach | keiner |
| F66-Dreieck | leicht gepanzert; Nahkampf „schwer“ (wie Löwenoger) | leicht gepanzert; Nahkampf „schwer“ |
| Medaillen | Fern Silber, Nah Gold | Nah Gold |
| Spezialschlag | **Durchbruch:** bis 2 Felder geradeaus in eine Einheit (keine Panzer oder Schreiter), 26 Schaden, Moral −15, niedergehalten, ein Feld zurückgeschleudert (an einer Wand ×1,5). Aktion und alle BP, nur aus dem Stand, **2 Runden Pause** | **Hinrichtung:** eine angeschlagene Einheit daneben (**unter 30 Stärke**, keine Panzer oder Schreiter) fällt sofort. Aktion, **3 Runden Pause** |
| Aura | **Standhaft:** eigene Einheiten neben ihm verlieren unter Beschuss nur halb so viel Moral | **Furcht:** Gegner neben ihm verlieren zu Beginn ihrer Runde 4 Moral |
| Schwäche | kaum Fernkampf | langsam, kein Fernkampf, bleibt in Schlamm, Sumpf und Gräben zu 30 % stecken (eine Runde fest) |

- **Fällt ein Held:** Seine ganze Seite verliert 10 Moral. Es erscheint ein Schild „… ist gefallen“, dazu Horn.
- **Grenze:** Höchstens ein Held je Armee und Schlacht; auch nach seinem Fall kann man keinen zweiten kaufen.

### Simulation (je 200 Schlachten, Konkordat-Siegquote)

| Karte | Startwert | mit Helden | ohne Helden |
|---|---|---|---|
| Grauwall | 1 | 53 % | 48 % |
| Grauwall | 2 | 50 % | 54 % |
| Sankt Ruß | 1 | 53 % | 54 % |
| Sankt Ruß | 2 | 50 % | 53 % |

- **Mittel:** Grauwall 51,5 % mit zu 51 % ohne, Sankt Ruß 51,5 % zu 53,5 %. Die Helden machen also keinen großen Unterschied für eine Seite.
- **Nutzung je Schlacht:**

| | Grauwall | Sankt Ruß |
|---|---|---|
| Rote Faust gekauft | 0,91 | 0,93 |
| Durchbruch | 0,46 | 0,83 |
| Rote Faust verloren | 2 % | 6 % |
| Kürassier gekauft | 0,24 | 0,82 |
| Hinrichtung | 0,01 | 0,07 |
| Kürassier verloren | 1 % | 5 % |

  Die Aschenwacht kauft auf dem Grauwall wenig nach. Hinrichtung braucht einen angeschlagenen Gegner direkt daneben und kommt deshalb selten vor.
- **Messfehler unterwegs, behoben:** Mein erster Abschalter hieß `NOHELD`. Den Namen gab es schon für „gebunden im Nahkampf“; er schaltete also eine andere Regel ab. Er heißt jetzt `OHNEHELD`, die Zahlen oben sind damit gemessen.

### Bilder und Effekte
- **Bilder:**
  - **Rote Faust:** nur die linke Figur als Grundbild; Schnipsel und Fleck sind weg. Die Getroffen-Pose ist gespiegelt.
  - **Kürassier:** Das verblassende zweite Schwert ist weg. Am Schwertschein bleiben keine rosa Säume.
  - **Größe:** 1,5 Soldatenhöhen. Weil die Bögen verschieden aufgelöst sind, habe ich den Maßstab angeglichen: über die stehende Pose bzw. den Grundbogen gleicher Auflösung.
- **Posen:**
  - Rote Faust: Faustschlag mit Ausholen (Faust vor der Brust), Revolverschuss (Mündung gemessen), Getroffen.
  - Kürassier: Schwert über der Schulter beim Ziehen, Querhieb oder Hieb über die Schulter (mit Ausholen), Getroffen kniend.
  - Hinrichtung: Ausholen, dann Schlag nach unten.
- **Aura** (dezent, Bildwirkung „leicht“ schwächer, „aus“ keine):
  - Rote Faust: dunkelrote Glut am Boden, aufsteigende Funken; beim Durchbruch flammt sie auf.
  - Kürassier: kalter, bleicher Bodennebel und fallende Ascheflocken; Gegner neben ihm bekommen einen dünnen kalten Schimmer. Bei der Hinrichtung blitzt es kalt auf, dazu Rütteln. Im ersten Versuch war das zu grell; jetzt ist es gedämpft.
- **Geprüft** im Headless-Chrome mit echten Regeln: Durchbruch mit Rückstoß und Hinrichtung mit Vernichtung. Regeltest und Partietest laufen ohne Fehler.

### Töne (vorläufig aus dem Bestand) – bitte suchen
- **Rote Faust:** Durchbruch = schwerer Aufprall + Metallschlag + Gas-Zischen als Dampf-Ersatz.
  - **Gesucht:** ein kurzes **Dampfventil-Zischen** („steam release“, „pneumatic hiss“) und ein **schwerer Kolbenstoß** („hydraulic punch“, „piston slam“).
- **Kürassier:** Hinrichtung = Schwert + schwerer Axttreffer auf Metall.
  - **Gesucht:** eine **Kettensäge mit kurzem Anlauf und Schnitt** („chainsaw rev“, „chainsaw cut“), möglichst ohne Motorgeräusch-Teppich, und ein **tiefes Kettenklingen-Surren** für den Hieb.
- Die Plätze stehen schon im Ton-Pult (Zeilen „Durchbruch …“ und „Hinrichtung …“) und lassen sich dort umstellen.

## 2026-11-21 – R9 Panzerbüchse, Bannerträger-Pistole, schweres Blut (`2d86333`)

- **Panzerbüchse:** Das Spielbild ist ein Zwei-Mann-Trupp, die Posen zeigen einzelne Männer. Deshalb wird der jeweils andere Mann aus dem Grundbild danebengesetzt.
  - **Schuss:** Schütze kniend angelegt, daneben der Ladeschütze. Mündung neu gemessen; auch das Grundbild hat jetzt eine gemessene Mündung.
  - **Ziehen:** Schütze geht mit dem Gewehr über der Schulter, allein.
  - **Getroffen**, zufällig eine von zwei Posen:
    - Schütze, das Gewehr rutscht weg (Gewehr gehört zur Figur);
    - Ladeschütze, die Patrone fällt (Patrone gehört zur Figur), daneben der liegende Schütze.
  - Die schwebende rosa Geisterhand ist entfernt. Die Helme zeigen keine Adler, auch das Grundbild nicht (geprüft).
- **Bannerträger mit Pistole:** Schuss-Pose aus der linken Figur, Mündung gemessen. Die Fahne ist auf aschgrau, schwarz und knochenweiß umgefärbt.
- **Schweres Blut (`fx_blut2`):**
  - **In der Luft:** Bei jedem Nahkampftreffer und bei schweren Treffern gegen Weiche gibt es einen großen Blutstoß, in Schlagrichtung gedreht. Das alte Blut bleibt für leichte Treffer und Schüsse.
  - **Am Boden:** Bei schweren Treffern ein Fleck, bei Vernichtung eine Lache. Beide verblassen nach 2 Runden.
  - Die rosa Pinselränder sind beim Freistellen blutrot und laufen durchsichtig aus, es bleiben keine rosa Säume.
  - Bildwirkung „leicht“ zeigt weniger und kleiner, „aus“ nichts. Panzer, Schreiter und Geschütze bluten nicht.
- **Prüfung:** im Headless-Chrome mit einem echten Nahkampf (Löwenoger gegen Grenadiere) aufgenommen; Partietest ohne Fehler.

Damit sind alle Posen aus Runde 2 im Spiel. Weiter mit den Helden.

## 2026-11-21 – Kurzbericht zu Enricos Antworten (15:50)

- **Löwengebrüll beider:** schon so gebaut (`3413bcf`).
  - Der **Kreuzschreiter** zeigt bei seiner Fähigkeit die vollen Schallwellen: Bögen mit Tintenkontur, rot-gold, Glühen, Staub, Rütteln, zurückzuckende Gegner. Sie gehen vom Löwenmaul an der Front aus (Mündungspunkt der Löwenmaul-Kanone); im Headless-Test aufgenommen.
  - Der **Löwenoger** zeigt beim Sprung die kleine Fassung.
- **Probebilder** `entwurf/probe/fig/aschenwacht_soldat_1–4.png`: mit `git checkout` zurückgesetzt, der Arbeitsstand ist wieder sauber.

Bereit für Spieltest Runde 5.

## 2026-11-21 – Posenbögen Runde 2, Pflicht-Übermalungen, F82 und zwei alte Fehler

**Commits:**
- `bdb9161` Löschen (`paint.js`, `mapimg.js`, die zwei Welle-Werkzeuge)
- `6c01625` Bögen geschnitten, Übermalungen, Fehlerkorrekturen
- `77a1e38` Posen im Spiel
- `3413bcf` F82

### Posenbögen R1–R8 im Spiel

| Einheit | Posen |
|---|---|
| **Reiter** (Säbel) | Galopp beim Ziehen, Säbelhieb, Aufbäumen (bei 40 % der Treffer), Getroffen |
| **Sprenglanzen-Reiter** | Galopp und Lanzenstoß (Bild oben links), Aufbäumen, Getroffen; oben rechts wie gewünscht nicht verwendet |
| **Eingreiftrupp** | Bajonett-Angriff oder (zufällig) Keulenhieb: Ausholen mit „Keule erhoben“ aus dem Grundbogen, dann Durchzug; Panzergranaten-Bündel werfen; Getroffen. Der lose Schnipsel fällt beim Schneiden weg. |
| **Graben-Pioniere** | Anlegen stehend, Anlegen kniend (in Deckung), geduckt vorrücken; Nahkampf weiter mit der Schaufel |
| **Drahtpioniere** | dieselben Schuss-Posen, dazu Nahkampf-Vorstoß mit Gewehr |
| **Eiserne Hünen** | Hüftfeuer, Sturmlauf, halb kniend (in Deckung), Getroffen mit Hackmesser |
| **Löwenoger** | Sprung mit Krallen, Prankenhieb, Schrot angelegt, Getroffen brüllend |
| **Gasschutz** | Anlegen stehend, Anlegen kniend, Sprühen beim Entgiften, Getroffen. Die zu große linke Figur ist auf Soldatenhöhe gebracht. |
| **Bannerträger** | Fahne hoch beim Ziehen, Stange rammen beim Aufpflanzen, Getroffen (nur die rechte Figur aus `banner_posen2`) |
| **Generäle** | Befehl zeigend, großer Befehl mit erhobenem Säbel, Pistolenschuss, Getroffen (Konkordat nur die untere Reihe des ersten Bogens) |

- **Generäle:** Nur der General posiert. Der Fahnenträger wird an einer Naht aus dem (übermalten) Grundbild geschnitten und steht wie im Grundbild dahinter. Die Bildmitte bleibt dabei, damit die Figur beim Posenwechsel nicht springt.
- **Mündungen neu gemessen:**
  - Hünen-Hüftfeuer: [0,998; 0,698]
  - Hünen kniend: [0,935; 0,80]
  - Oger-Schrot: [0,92; 0,237] (Laufende, nicht die Klinge darunter)
- **Getroffen-Richtung (F77):** Gemessen sind alle neuen Getroffen-Bilder.
  - Gespiegelt, weil sie zum Feind kippen: Eingreiftrupp (+0,34), Hünen (+0,21), Löwenoger (+0,30), Gasschutz (+0,14).
  - Der Bannerträger blickt im Bild nach links und fällt vom Feind weg; er bleibt ungespiegelt.
- **Schnitt:** Bei beiden Reiterbögen und beim ersten Konkordat-General-Bogen hingen Figuren über Lanze bzw. Säbel zusammen. `figure_cut.py` trennt solche Bögen jetzt an Nähten (`raster=2`).
- **Größe:** `figs.js` ist um 2,3 MB gewachsen, `index.html` liegt jetzt bei 56,5 MB.

### Pflicht-Übermalungen
- **Aschenwacht-General, Grundbild:** Helmemblem, Totenkopf-Gürtelschnalle und die zwei kleinen Totenköpfe an den Schulterkordeln sind übermalt. Fahnenspitze und Kreuz-Orden waren schon vorher ersetzt. Ärmelabzeichen sind im Bild keine zu sehen.
- **Beide Aschenwacht-General-Posenbögen:** die Totenköpfe an den Schulterkordeln aller vier Figuren übermalt. Die „Knöpfe“ in `posen2` waren ebenfalls kleine Totenköpfe.
- **Banner-Posenbögen:** Die Fahne war schwarz-weiß-rot und ist jetzt aschgrau, schwarz und knochenweiß, wie beim Grundbogen.
- **Alle 109 Aschenwacht-Bilder geprüft**, dazu die 30 neuen Posen:
  - Brust- und Schildabzeichen sowie die Fahnen zeigen nur das eigene Fraktionszeichen, den Ritterhelm (mit Kranz bzw. am Panzer mit Flügeln).
  - Die goldenen Kreuze an Kampfanzügen und Schreitern sind Visierschlitze; laut Regel bleiben sie.
  - Keine Eisernen Kreuze, Balkenkreuze, Adler oder Totenköpfe mehr.

### F82 Fähigkeits-Effekte
- **Löwengebrüll:**
  - Vom Maul gehen Comic-Schallwellen aus (gezeichnete Bögen mit Tintenkontur, gold und rot), breiten sich aus und verblassen.
  - Dazu kurzes rot-goldenes Glühen am Maul, Staub wird nach vorn weggeblasen, leichtes Rütteln.
  - Die Gegner im Bereich zucken sichtbar zurück, mit Getroffen-Pose und Angst-Zeichen.
  - Beim Sprung des Löwenogers kommt eine kleinere Fassung.
  - **Hinweis:** Die Fähigkeit „Löwengebrüll“ hat laut Regeln der **Kreuzschreiter**, nicht der Löwenoger. Den Löwenoger habe ich beim Sprung brüllen lassen. Eine flatternde Mähne geht mit den festen Bildern nicht.
- **Gasschutz:**
  - Beim Entgiften pulsiert ein blassgrüner Dunst um den Trupp und seine Füße, dazu Dampfstöße aus den Filtern.
  - Solange Gas in der Nähe ist, liegt ein ganz feiner Schleier um den Trupp und die geschützten Nachbarn.
- **Bildwirkung:** „aus“ zeigt keine dieser Effekte, „leicht“ zeigt weniger.

### Zwei alte Fehler „Kommentar verschluckt Code“ (gefunden beim Einbau)
1. **Ziehen:** Ein Kommentar stand vor dem Code und verschluckte `lauf`-Pose, Bewegungsanimation und `break`.
   - Seit dem Commit `10b9b3a` lief jeder Zug über den nächsten Fall `advance` (etwas anderes Tempo).
   - Keine Einheit zeigte die `lauf`-Pose.
2. **Auf-/Abprotzen:** Meldung, Warten und `break` waren verschluckt; der Fall lief in `spawn` durch.
   - Dadurch kamen beim Protzen ein Pfiff und die Meldung „Nachschub: … trifft ein“.
3. Dazu ein eigener Fehler aus den Ton-Nachträgen (`f6eaa7b`): Beim Sturmrollen zuckte das Ziel nicht.

- **Behoben** sind alle drei.
- **Neu:** `node tools/test_kommentare.js` meldet solche Zeilen und steht in CLAUDE.md.

### Tests
- Partietest nach jedem Schritt: Konsole ohne Fehler.
- Posen und Effekte im Headless-Chrome geprüft: jede Pose bei allen 11 Einheiten, Gebrüll und Entgiften mitten im Effekt aufgenommen.

### Frage an Enrico
- Beim ersten Probeschnitt hat `figure_cut.py` vier Probebilder überschrieben: `entwurf/probe/fig/aschenwacht_soldat_1–4.png`. Die Sicherheitsprüfung hat das Zurücksetzen blockiert. Sie sind nicht committet; darf ich sie mit `git checkout` auf den alten Stand bringen?

**Offen bei den Posen:** R9 Panzerbüchse und die Pistolen-Pose des Bannerträgers (Gemini-Bögen folgen).

## 2026-11-21 – Paket G, Schritte 6 und 7 (Leistung, KI) – Abschluss Paket G

**Commits:**
- `93d0bfd` Schritt 6 (Leistung)
- `c7c5132` KI 2.21
- `b2cff21` KI 2.23
- `549d5f2` IDEEN.md

### Schritt 6 – Leistung
- **1.7 Audio-Objekte:** Sie werden erst beim ersten Abspielen angelegt. Vorher waren es beim Start rund 750 Objekte, alle mit `preload 'auto'`.

  | | vorher | nachher |
  |---|---|---|
  | Startmenü bedienbar (Headless-Chrome, lokal) | 1,4–1,6 s | 0,8 s |
  | Heap | 111 MB | 108 MB |

  Geprüft im Headless-Chrome: Titelmusik und Probetöne laden und spielen. Partietest und KI-Partie laufen ohne Fehler.
- **1.3 Schlachtmusik:** 96 kbit/s statt 128, also 3,7 → 2,8 MB. `sound.js` 29,3 → 28,0 MB, `index.html` jetzt **53,5 MB**. Die Titelmusik ist unverändert.
- **1.2 Auswahl-Töne in `sound_pult.js`:** wartet weiter auf deinen vollständigen Ton-Pult-Export.

### Schritt 7 – KI
- **2.21 „Halten um jeden Preis“:** Neu greift der Befehl auch, wenn
  - 2 Einheiten in Reichweite wanken (Moral knapp über der Fluchtgrenze oder angeschlagen in Feindberührung), oder
  - ein gehaltenes Zielfeld bedroht ist (Gegner bis auf 2 Felder heran).
  - Den alten Auslöser gibt es weiter mit `HOLD_ALT=1`.

  | | vorher | nachher |
  |---|---|---|
  | Halten genutzt, Grauwall | 32 % der Schlachten | 98 % |
  | Halten genutzt, Sankt Ruß | 34 % | 99 % |
  | Simulation Grauwall (Konkordat) | 48 % | 50 % |
  | Simulation Sankt Ruß (Konkordat) | 53 % | 50 % |

- **2.23 Kauf nach Lage:**
  - **Wunschliste:** Die bewährte Liste bleibt das Rückgrat, die neuen Einheiten stehen jetzt darin.
    - Konkordat: Mineure, Schildwall, Löwenoger, Versorgung.
    - Aschenwacht: Hünen, Gasschutz, Versorgung.
  - **Lage-Käufe:** Sie gehen bei klarem Bedarf vor:
    - **Beobachter:** Ballon bzw. Signaltrupp, wenn die eigene Artillerie keinen hat.
    - **Panzerabwehr:** Pioniere bzw. Panzerbüchsen, wenn der Gegner 3 Fahrzeuge oder Schreiter mehr hat als man selbst Panzerabwehr.
  - **Abschalter:** alte Liste mit `KAUF_ALT=1`; die Lage-Käufe einzeln mit `NOLAGE_aufkl` bzw. `NOLAGE_abwehr`.
  - **Verworfene Fassungen (je 200 Schlachten):**

    | Fassung | Grauwall | Sankt Ruß |
    |---|---|---|
    | Kauf nur nach Punktwerten | 6 % | 46 % |
    | Punktwerte mit Kerntruppen ohne Abzug | 13 % | 63 % |
    | Beobachter erst ab Runde 4 | 35–39 % | 61–65 % |
    | Mit Lage-Käufen für Sanitäter und Gasschutz | ~45 % | ~54 % |

    Bei der zweiten Fassung kaufte die KI kaum noch Landkolosse und Sturmbrecher. Die Runde-4-Fassung zeigt: Der frühe Beobachter ist für beide Seiten viel wert. Die Lage-Käufe für Sanitäter und Gasschutz habe ich deshalb wieder herausgenommen.
  - **Ergebnis** (Konkordat, Mittel aus zwei Startwerten): Grauwall **51 %**, Sankt Ruß **53,5 %**. Mit der alten Liste waren es je etwa 49 %. Sankt Ruß liegt damit wieder beim früher festgehaltenen Ø 53 %.
- **Ballon und Mineure gezielt gezählt** (je 200 Schlachten, je Schlacht):

  | | Grauwall | Sankt Ruß |
  |---|---|---|
  | Ballon gekauft | 1,06 | 1,47 |
  | Ballon markiert | 5,4-mal | 5,5-mal |
  | Ballon eingeholt / aufgestiegen | 0,29 / 0,18 | 1,03 / 1,01 |
  | Signaltrupp der Aschenwacht gekauft | 1,09 | 1,00 |
  | Signaltrupp markiert | 6,6-mal | 8,0-mal |
  | Mineure gekauft | 0,13 | 0,30 |
  | Stollen gegraben | 0,01 | 0,03 |

  Die Mineure graben also kaum Stollen. Der Auslöser in `ai.js` muss sich das noch ansehen; er steht als offener Punkt in IDEEN.md.
- **Selten gekauft:** Löwenoger, Hünen und Schildwall kauft die KI noch kaum (0–0,17 je Schlacht). Sie stehen weit hinten in der Liste, und die KI macht nur 5–8 Käufe je Schlacht.
- **`sim.js`:** zählt jetzt Käufe je Einheit und Markieren je Einheit (Ballon bzw. Signaltrupp getrennt).

### Erledigt nach deinen Antworten von 13:25
- **CREDITS `neu2_*`:** als offener Punkt in IDEEN.md, zusammen mit „Mineure graben kaum Stollen“ und dem Fehlalarm in `test_draht.js`.
- **Löschen von `src/paint.js`, `src/mapimg.js`, `tools/welle_abgleich.js`, `tools/welle_fein.js`:** Die automatische Sicherheitsprüfung von Claude Code hat das Löschen blockiert, weil die Freigabe nur in AUFTRAG.md steht und nicht direkt im Chat. Bitte einmal im Chat bestätigen, dann lösche ich sie.

**Paket G ist damit abgeschlossen.** Weiter mit den Posenbögen Runde 2 (samt F82-Effekten und Pflicht-Übermalungen).

## 2026-11-21 – Paket G, Schritt 5 (alte Karten raus) und Ton-Nachträge

**Commits:**
- `9940139` Schritt 5
- `f6eaa7b` Ton-Nachträge
- Rückweg: Git-Tag **`vor-alte-karten-raus`** (gepusht)

### Was raus ist
- **Karten:** Nur noch **Grauwall** und **Sankt Ruß**. Entfernt sind die acht alten Karten (Selm, Lerne, Front, Steinbrücke, Waldfluss, Kasematten, Kanalstadt, Varntal), die alten Grauwall-Daten (`GRAUWALL_*`, `buildGrauwall`) und `gridMap`.
- **Verstärkungswelle:** ganz entfernt (`reinf`, `reinfTurn`, Ereignis und Anzeige „Gegenstoß der Aschenwacht“), weil keine der zwei Karten sie nutzt. Der Nachschub über das Kaufmenü bleibt.
- **Alte flache Ansicht in `ui.js`:**
  - alle 27 Abfragen `VIEW.tilt()` und `OPT.tilt`;
  - `renderPainted`, `renderImageMap` und der Kachelboden;
  - die alten Zeichen-, Zeiger-, Scroll- und Zoompfade (das Brett wird nicht mehr gescrollt, nur noch die Kamera bewegt);
  - tote Hilfsfunktionen (`unitAtPixel`, `drawUnits`, `toBoard`).
  - Der Boden kommt nur noch aus den Gelände-Bausteinen; solange sie laden (ca. 0,4 s), ist er dunkel.
- **Prüfliste 5.3:** Diese P-Konstanten liest nichts mehr, sie sind gestrichen: `MV2`, `ORDER_CD`, `MELEE_VS_WALKER`, `STORM_VS_WALKER`, `MARCH`, `STUCK_TURNS`, `STRIKE_CD`, dazu `MAXT`/`WIN_A`/`DRAW_A`/`REINF_TURN`. `P_STUFE3_AT` ist jetzt `at: true`. Die Liste in `tools/p_schluessel.json` habe ich bewusst erneuert, jetzt 128 Schlüssel.
- **Prüfliste 5.4:** `unitAtPixel`, `buildGrauwall` und `autoFace` sind gestrichen.
- **Prüfliste 5.6:** Die verwaisten Schlüssel `arm.tempo`, `arm.bildwirkung` und `arm.bildwirkung2` werden beim Start einmal gelöscht.
- **Prüfliste 1.6:** Die alten Bögen `konkordat_kreuzschreiter` und `aschenwacht_eisenknecht` sind nicht mehr eingebettet; `figure_cut.py` und `figur_plastik.py` lassen sie aus. Die zehn noch keiner Einheit zugeordneten Posenbilder bleiben eingebettet, sie gehören zu 4.4 (später).
- **Prüfliste 2.11:** Die Reserve stand noch im Text der Aschenwacht im Startmenü. Jetzt heißt es dort: „Verteidigt. Zäh in Gräben und Ruinen, mit MG-Nestern und Sturmbrechern gegen die Kolosse.“

### Ersatzbilder, die bleiben
- **`art.js`:** nur noch, was die **Blaue Legion** braucht. Alle 52 Einheiten haben einen neuen Bogen; die Blaue Legion hat aber noch keine neuen Bögen.
  - `_F`-Bilder: `inf_F`, `mg_F`, `art_F`, `limber_F`, `walker_F`, `cav_F`, `medic_F`, `mortar_F`
  - `_A`-Bilder ohne `_F`-Gegenstück: `sniper_A`, `dog_A`, `sapper_A`, `raider_A`, `mechT_A`, `mechK_A`, `mechC_A`, `suitA_A`, `flamer_A`, `shieldA_A`, `fgun_A`, `phone_A`, `leader1_A`, `leader4_A`, `smoke_A`, `miner_A`, `wrench_A`, `balloon_A`
  - Entfernt sind 47 Bilder: alle `_D`, die übrigen `_A` und die nicht genutzten Anführerbilder.
  - Im Browser geprüft: Die Blaue Legion steht mit allen Bildern auf dem Grauwall.
- **`fx.js`:** alte Effekte als Ersatz, wo ein neuer Effektbogen fehlt.
  - `fx` (15): `blood1–4`, `splash`, `dirt1/2`, `smokeD`, `expl`, `smokeL1/2`, `gas1/2`, `flame1/2`
  - `proj` (27): Nahkampf-Bilder `mswing`, `msmash`, `mclaw`, `mstab`, `mimpact`, `msplat`, `hammer`; dazu `mgfire`, `muzzle`, `jet`, `sparks`, `dust`, `crash`, `mudsplash`, Geschosse `rocket`, `bolt`, `bullet`, `shellA/B`, `shard`, und `bandage`, `crossG`, `crossF1–3`, `stick`, `pine`
  - Entfernt sind 61 Bilder: die 27 Bodenkacheln, die 29 alten Textsymbole `i_*` (seit F15 kommen die Symbole aus den Bögen), `engine`, `burst`, `cross`, `smokeC` und `flameS`.
- **`paint.js` und `mapimg.js`:** nicht mehr im Bau. Die Dateien liegen noch in `src/`.

### Größe vorher → nachher

| Datei | vorher | nachher |
|---|---|---|
| **index.html** | **62,1 MB** | **54,6 MB**; mit den neuen Tönen 54,8 MB (`f6eaa7b`) |
| mapimg.js + paint.js | 3,6 MB | 0 (nicht mehr eingebettet) |
| art.js | 2,41 MB | 0,92 MB |
| fx.js | 1,64 MB | 0,89 MB |
| figs.js + figsplastik.js | 11,57 MB | 11,27 MB |
| ui.js | 493 KB | 458 KB |
| engine.js | 184 KB | 164 KB |

GitHub warnt weiter, weil die Datei über 50 MB liegt. Die Töne (29 MB) folgen in Schritt 6.

### Tests
- **test_regeln:** in Ordnung.
- **test_partie:** 4 Runden, Konsole ohne Fehler.
- **test_ki_partie:** ohne Fehler bis zum Ende, auf dem Grauwall (Runde 13, Bildzeit Ø 6 ms, höchstens 26 ms) und in Sankt Ruß (Runde 14).
- **test_belegung:** in Ordnung.
- **Im Browser (1280 px):** Startmenü, Kartenwahl (nur zwei Karten, Vorschau richtig) und eine Schlacht mit der Blauen Legion, Konsole ohne Fehler.
- **`test_draht.js`:** meldet 1 Fehler („keine stillen Geländeänderungen“, Straßenzeile von Sankt Ruß). Den gab es schon vor Schritt 5; vermutlich schlägt der Test fälschlich an, weil die Straße beim Kartenbau gesetzt wird. Noch nicht angefasst.
- **Simulation (je 200):** Grauwall **48 %**, Sankt Ruß **53 %** – unverändert, die Regeln sind gleich geblieben.

### Ton-Nachträge
- **Löwenoger getroffen** (`magiaz-lion2`): Bei leichten bis mittleren Treffern (unter 20 Stärke) brüllt jetzt der Löwe; das ist Standard, im Pult heißt die Zeile „Leicht bis mittel getroffen: Löwe“. Schwere Treffer klingen wie bisher.
- **Zweiter Löwe** (`magiazzz-lion`, kam um 10:52): nur als Auswahl im Pult (`neu3_loewe2`).
- **Klingen-„Sching“ beim Sturmrollen:** Der Platz `neu_wucht` enthielt zwei Axt-Treffer und einen Schwerthieb. Sturmrollen, Gebäude rammen und Bohrstoß nehmen jetzt den neuen Platz `neu3_fzaufprall`: zwei dumpfe schwere Schläge und ein filmischer Treffer, ohne Klinge. Das gilt im Spiel und als Standard der Pult-Zeilen. `neu_wucht` bleibt für die Nahkampf-Schreiter.
- Ton-Pult, Tonprobe und Spiel sind neu gebaut, CREDITS ergänzt, `sound-quelle` gesichert.

### Offen / Frage an Enrico
- **CREDITS für die `neu2_*`-Töne:** 85 Quelldateien stehen noch nicht einzeln drin, davon etwa 45 von Freesound mit Lizenzen, die ich einzeln nachschlagen muss. Das ist ein eigener Arbeitsgang; im Moment wird nichts verkauft.
- **Darf ich löschen?**
  - `src/paint.js` und `src/mapimg.js` – nicht mehr im Bau, Rückweg über den Tag.
  - `tools/welle_abgleich.js` und `tools/welle_fein.js` – haben ohne Welle keinen Zweck mehr.

**Weiter mit Schritt 6 (Leistung: 1.7, 1.3).**

## 2026-11-21 – Paket G, Schritte 4 und 4b (Tests, Ton-Nachträge) – „Ton-Pult neu“

**Commits:**
- `efb1f64` Schritt 4 (Tests)
- `cf3ed93` Ton-Pult: Auswahl-Verlust behoben, Exporte zusammengeführt
- `049910c` neue Töne

### Schritt 4 – Tests (5.1, 5.2, 5.8, 5.9)
- **`node tools/test_regeln.js` (neu, 5.2):** prüft, dass jede P-Konstante eine Zahl ist und keine fehlt (Liste `tools/p_schluessel.json`, 139 Schlüssel). So fällt „Kommentar verschluckt Code“ sofort auf. Dazu:
  - Schadensvorschau und Faktortabelle für alle Paarungen (2704) ohne NaN;
  - Text, Preis und Medaillen für alle 52 Einheiten.
- **`node tools/test_ki_partie.mjs` (neu, 5.1):** KI gegen KI bis zum Ende über die echte Abspielschleife und misst dabei die Bildzeiten. Lief auf Grauwall und Sankt Ruß ohne Fehler (`KARTE=sanktruss`).
- **`test_partie.mjs`:**
  - meldet einen fehlenden Vorschau-Server klar (5.9);
  - prüft, dass eingegrabene Trupps ohne Ausgraben nicht ziehen (5.8).

### 4b (c) – Warum die Ton-Pult-Auswahl verloren ging
- **Ursache:** Der Import hat für jede Einheit im Export zuerst **alle** ihre Wahlen gelöscht und dann nur die aus der Datei gesetzt. Der Export 10:02 enthielt deine Schuss-Wahlen von 09:09 nicht mehr. Hat ein Import diese Wahlen also gelöscht, waren sie weg. An den Platz-Namen lag es nicht; alle 46 Plätze gibt es weiterhin.
- **Behoben:**
  - Der Import **ergänzt** jetzt nur noch.
  - Jede Änderung legt zusätzlich einen Verlauf der letzten 20 Stände an (`arm.tonpult.verlauf`, höchstens einer je Minute).
  - Die Statuszeile zeigt, wie viele Wahlen gespeichert sind und **wo**. Die Auswahl liegt je Adresse getrennt: lokal ≠ GitHub Pages ≠ als Datei geöffnet.
- **`entwurf/postfach/tonpult_zusammen.json`:** alle drei Exporte zusammengeführt, 46 Einträge. Je Einheit und Platz gilt der neueste. 13 Wahlen aus dem 09:09-Export sind wieder drin: die Schüsse von Hünen, Geschütz, Panzerkampfwagen, Klaue, Hauptmann/General Konkordat, Scharfschütze, Oger, Turm, Kreuzschreiter (Schuss und Zweitwaffe), dazu die Sturmpanzer-Zweitwaffe und der Ordens-Schlag. **Bitte im Ton-Pult über „Import“ laden.**

### 4b (b) – Neue Töne aus `_neu`
- **Bitgleich schon vorhanden**, nach `_neu_doppelt/` verschoben: `monster-bite-on-armor` und `axe-hit-head-beheaded`.
- **Einsortiert** (verschoben, nichts gelöscht):

| Datei | Ordner |
|---|---|
| Tiger-Attacke | `Monster/` |
| Stich ins Fleisch, Blutspritzer | `Melee hit infantry/` |
| Spaten mit Gore | `Schaufel/` |
| Big Crash, Bassy Rock | `Impacts/` |
| Ballon-Brenner | `Fire/` |

- **Neue Auswahl im Ton-Pult und in der Tonprobe (Gruppe „Neue Töne 21.11.“):**

| Pool | Töne |
|---|---|
| `neu3_bestie` | Tiger-Attacke, 4 Ausschnitte |
| `neu3_biss` | Biss auf Panzerung |
| `neu3_fleisch` | Stich ins Fleisch, 3 Einzeltöne |
| `neu3_gore` | Blutspritzer, Spaten |
| `neu3_aufprall` | Bassy Rock, 3 Einzeltöne, und Big Crash; Kandidaten für „Gebäude rammen“, Sturmrollen und „Einsturz“ |
| `ballon_brenner` | 2 Fauch-Stöße; wählbar in den Ballon-Zeilen (Gruppe Handgriffe) |

- **Löwenoger nach deiner Wahl im Spiel:** Nahkampf = Tiger-Attacke + Stich ins Fleisch, gegen Fahrzeuge, Schreiter und Kampfanzüge Biss auf Panzerung. Im Pult sind das drei eigene Zeilen (Schlag, Treffer ins Fleisch, Treffer gegen Gepanzerte), alle änderbar.
- **CREDITS:**
  - Pixabay-Töne: Pixabay-Lizenz.
  - Monster Bite on Armor: CC BY 4.0, OGsoundFX.
  - Bassy Rock: CC BY 4.0, Artninja. Laut Beschreibung ist es ein Remix mit einem CC-BY-NC-Teil.
  - **Big Crash: CC BY-NC 3.0, also nicht kommerziell.** Vor einem Verkauf ersetzen.
- **Gefunden:** Die F67-Töne von heute Nacht (`neu2_*`) stehen noch nicht einzeln in CREDITS. Das trage ich nach.
- **Geprüft:**
  - `test_regeln` ohne Fehler.
  - Partietest ohne Fehler, 4 Runden, Konsole frei.
  - sound-quelle gesichert (robocopy).

**Weiter mit Schritt 5 (alte Karten raus).**

## 2026-11-21 – Paket G, Schritte 1–3 (Texte, Sturmrollen, Ton)

**Commits:**
- `a8c201c` Schritt 1
- `8d947ec` Ton und Ton-Pult
- `4e7fe48` Schritt 2 und Spiel gebaut

### Schritt 1 – Texte und Anzeige (Prüfliste 2.1–2.16, 2.25)
- **Panzerbüchse und Kreuzschreiter:** „panzerbrechend: Panzer ×1,5, Fußtruppen ×0,5“. Der Kreuzschreiter heißt im Text „Panzerjäger“ (2.4), dazu Kriegshammer gegen Fußtruppen ×1,5. Der Wert `at: 2` ist jetzt `at: true`; der Preis bleibt 50.
- **Pioniere:** Der Satz „Nahkampf ×1,5 gegen Kolosse“ ist gestrichen.
- **Kampfanzüge, Hünen, Löwenoger:** „leicht gepanzert: Gewehr, MG und Klingen ×0,5, panzerbrechend ×1,5“, dazu „stark im Nahkampf“. Beim Oger stehen jetzt auch Pranken und Schrot gegen Panzer im Text.
- **Bohrkoloss:** Flammenstoß 2 Felder.
- **Anführer:** „3 Befehle je Schlacht, an Nachbarn“.
  - Fernsprech- und Signaltrupp: „Anführer bis 3 Felder können ihre Befehle eine Runde früher wieder geben“. Das ist die tatsächliche Wirkung; vorher stand dort „jede Runde“.
- **Eingraben:** „zum Ziehen erst ausgraben (Aktion)“.
- **Artillerie und Mörser:** „gegen Fahrzeuge und Schreiter nur ×0,5“. Bei Geschütz und Feldkanone steht dazu der Direktschuss ×2,5.
- **Schlagworte:** Eingreiftrupp „Panzergranate“, Mineure „3 Ladungen“ und „Keine Panzerwaffe“.
- **Regeln-Fenster:**
  - Neuer Absatz „Stark und schwach (Medaillen)“ mit der Tabelle in Sätzen und der Medaillen-Legende.
  - Neuer Absatz „Neue Handlungen“: Ausgraben, Sturmrollen, Panzergranate, Gebäude rammen und Trümmer, Ballon, Flammen 2 Felder, Mineur-Ladungen.
  - Der Satz zur Reserve der Aschenwacht ist gestrichen.
- **CLAUDE.md:** Kirchenfahne steht jetzt mit 3 Siegpunkten.
- **2.14:** Landkoloss und Sturmpanzer haben keinen Nahkampf-Knopf mehr.
- **2.15:** Die Zugvorschau zeigt jetzt auch ein Fähigkeiten-Symbol (z. B. Sturmrollen, Panzergranate, Haftladung, Sprung), wenn von dort nur die Fähigkeit geht.
- **2.16:** Der Einschlag-Ton richtet sich jetzt nach der Faktortabelle. Granaten auf Panzer (×0,5) klingen deshalb nach Abpraller, Panzerbüchse und Kanone nach Metallkrach.
- **2.25:** Die KI zählt Pioniere und Mineure nicht mehr als Nahkampf-Gefahr für Panzer.
- **Simulation:** Grauwall 52 %, Sankt Ruß 47 %.

### Schritt 2 – Sturmrollen gedämpft (2.20)
- Pause **3** statt 2 Runden. Die KI rollt nur noch, wenn der erwartete Schaden größer ist als der Schuss × 1,3.
- **Nutzung je Schlacht:**

| Seite | vorher | nachher |
|---|---|---|
| Konkordat (Landkolosse) | 14,1 | 10,5 |
| Aschenwacht (Sturmpanzer, Sankt Ruß) | 8,5 | 6,2 |

- **Abstimmung:**
  - Grauwall: **48 %**, ohne Änderung.
  - Sankt Ruß fiel auf 41 %. Mit **8 Kohorten und 2 Pionieren** (statt 10 und 1) sind es **53 %**.
- Sankt Ruß bleibt sehr empfindlich (je 200 Schlachten):

| Änderung | Konkordat |
|---|---|
| +1 Kohorte | 41 % |
| −1 Grenadier der Aschenwacht | 36 % |
| +1 Pionier, 10 Kohorten | 77 % |
| +1 Pionier, 8 Kohorten | 53 % |

  Auf dieser Karte entscheidet die Panzerabwehr (Haftladung gegen die Sturmpanzer) fast alles.

### Schritt 3 – Ton (3.1–3.7, 2.17)
Pegel im Spiel, je vorher → nachher:

| Ton | vorher | nachher |
|---|---|---|
| Konkordat-Gewehr (`rifle_1`) | −33 dB | **−24,5 dB** (gleichauf mit der Aschenwacht −24,8) |
| Treffer weich | −29 bis −32 dB | −25 bis −28 dB |
| Abpraller | −35 dB | −29,5 dB |
| Schritte (weich begrenzt, die Spitzen lagen am Anschlag) | −32 dB | −25 bis −26 dB |

- **Halbautomat:** längere Ausblendung.
- **Pistole der Aschenwacht:** aus der Walther-Quelle mit Ausklang neu gebaut, der Schlüssel `pistol` bleibt.
- **Kolosskanone (`kolosskanone_1`):** Die Quelle ist nur 0,4 s lang; mit `fo` lässt sich da nichts verlängern. Ich habe sie so gelassen. Im Ton-Pult kannst du für Kolosse die zweite Variante wählen.
- **3.4:** „Kugel vorbei“ spielt nicht mehr, wenn im selben Moment ein Treffer folgt.
- **Ton-Pult (2.17):** neue Zeilen für:
  - Sturmrollen (Anlauf, Aufprall, Krachen),
  - Gebäude rammen (Aufprall, Wucht, Einsturz) bei allen Fahrzeugen und Schreitern,
  - Panzergranate (Explosion, Metalltreffer),
  - Bohrstoß, Ballon (Winde, Ratsche), Flammen-Nachbrennen.
  - Die Nahkampfzeile der Sturmtrupps zeigt jetzt den normalen Hieb (F80); Panzer haben keine Nahkampfzeile mehr.

**Weiter mit Schritt 4 (Tests), danach Schritt 5 (alte Karten raus).**

## 2026-11-21 – F76 (geändert), F78, F70, F80, F81 – bereit für die Prüfrunde

**Commit:** siehe unten (gepusht).

**Bild:** `entwurf/probe/spieltest4_e/f80_panzergranate.jpg`

- **F76 (wie geändert):**
  - Fußtruppen, Reiter und Schreiter drehen sich im Nahkampf zum Angreifer und bleiben so, ohne Drehkosten.
  - Panzer und Kettenfahrzeuge (Landkoloss, Sturmpanzer, Bohrkoloss) drehen sich nur in der Kampfszene sichtbar und stehen danach wieder wie vorher.
  - Die Regeln-Hilfe nennt das Einkesseln.
  - Die KI nutzt es über die Schadensvorschau: Ein zweiter Angriff von hinten zeigt den höheren Schaden.
- **F78:** Mineure kosten 40.
  - Sankt Ruß nachgemessen mit 2 zusätzlichen Mineur-Trupps: Konkordat 77 % (vorher 84 %).
  - Wegen F80 haben die Mineure keine geballte Ladung mehr. Ihr Vorteil auf dieser Karte ist vor allem der Wert zweier zusätzlicher Trupps; Sankt Ruß reagiert darauf sehr empfindlich.
  - **Vorschlag:** 40 lassen; die Stollen bleiben mit 3 Ladungen stark.
- **F70:** Eingeholter Ballon sieht 4 Felder.
- **F80 Panzergranate:**
  - Sturmbrecher, Grabenräumer und Eingreiftrupp schlagen im Nahkampf normal zu: Klinge/Kolben ×0,5 gegen Panzer, normale Hiebtöne, keine geworfene Ladung mehr.
  - Neue Fähigkeit „Panzergranate werfen“:
    - 1–2 Felder, nur gegen Fahrzeuge und Schreiter;
    - kostet die Aktion, danach 2 Runden Pause;
    - Schaden etwa 21 gegen Landkoloss und Sturmpanzer, 14 gegen den Eisenknecht;
    - 15 % Pannengefahr.
  - Animation: Wurf-Pose, Explosion mit Funken am Panzer, Metallkrach.
  - Pioniere behalten die Haftladung. Drahtpioniere und Mineure haben keine Panzerwaffe mehr.
  - Die Medaillen zeigen „Panzergranate“ bzw. „Haftladung“.
  - Die KI wirft etwa 5 Granaten je Schlacht.
  - **Nebenbei gefunden:** Durch denselben Kommentarfehler wie bei den Konstanten war die geballte Ladung seit dem F66-Abgleich schon abgeschaltet. Die Werte im letzten Bericht galten also bereits ohne sie. Ich habe jetzt alle drei Regel-Dateien nach solchen verschluckten Codezeilen abgesucht; es gab keine weitere.
- **F81 Flammenwerfer:** Reichweite 2 für Flammentrupp, Brandwerfer und den Flammenstoß des Bohrkolosses.
  - Ins Nachbarfeld durften Flammen schon immer, auch gebunden.
  - Die Strahllänge richtet sich nach der Entfernung.
  - Preise aus den Werten: Flammentrupp 45, Brandwerfer 50.
  - Ein geringerer Schaden auf 2 Felder war nach der Simulation nicht nötig.
- **Abstimmung** (je 200 Schlachten, alles zusammen):

| Karte | Armee | Konkordat |
|---|---|---|
| Grauwall | Aschenwacht 8 statt 10 Grenadiere, die 2 Sturmbrecher bleiben | **52 %** |
| Sankt Ruß | unverändert | **49 %** |

  - Mit nur 1 Sturmbrecher wären es 75 %, mit 2 Sturmbrechern und 10 Grenadieren 37 %.
- Partietest im Browser ohne Fehler.

**Bereit für die Prüfrunde.**

## 2026-11-21 – F76–F79, F70 Ballon, F46; Paket E abgeschlossen

**Commits:**
- `d2cd205` F76–F79
- `10ded8e` F70, F46, Abhaken
- Alles gepusht.

**Bilder:** `entwurf/probe/spieltest4_e/`
- `f77_stahl_getroffen.jpg`
- `f79_rammen.jpg`
- `f70_ballon_oben_unten_oben.jpg`
- `f46_graben_vorher_nachher.jpg`

### F76 – Verteidiger dreht sich zum Angreifer
- Fußtruppen und Reiter wenden sich im Nahkampf zum Angreifer.
  - In der Kampfszene geschieht das sofort.
  - Nach dem Nahkampf bleiben sie ihm zugewandt.
  - Der Flankenbonus des Angreifers zählt für diesen Angriff noch.
- **Vorschlag:** Fahrzeuge und Schreiter drehen sich **nicht** von selbst.
  - Sie haben Flanken und zahlen Drehkosten.
  - Ein freies Umdrehen nach jedem Nahkampf würde den Flankenangriff entwerten.
  - Wenn du willst, kann ich sie in der Szene nur sichtbar kurz zum Angreifer drehen und danach wieder zurück.
- **Hinweis:** Auch ein MG-Trupp dreht sich zum Angreifer, sein Schussfeld zeigt danach in diese Richtung.

### F77 – Getroffen-Richtung
- Alle Getroffen-Bilder vermessen: Liegt der Kopf vor oder hinter den Füßen, bezogen auf die Blickrichtung?
- Gespiegelt werden alle, die deutlich zum Feind kippen. So fallen sie vom Angreifer weg.
  - Konkordat: Kampfanzug, Scharfschütze, Mineur, Schildwall (beide Bögen), Versorgung, Melder, Soldat, Sturm, Flammen.
  - Aschenwacht: Melder, Sanitäter.
- Die Aschenwacht-Panzerknechte (Kampfanzug) und die Hünen (keine eigene Getroffen-Pose) fallen schon richtig.
- Rückstoß und Taumeln zeigen weiter vom Angreifer weg.

### F78 – Mineure: Ladungen begrenzt
- Höchstens **3 Ladungen je Trupp und Schlacht**. Ich habe „je Trupp“ gewählt: Wer zwei Trupps kauft, zahlt auch doppelt.
- Zähler am Knopf („Stollen graben (Ladungen 2/3)“) und im Hinweistext. Die KI hält die Grenze ein.
- **Simulation** mit 2 zusätzlichen Mineur-Trupps, je 100 Schlachten:

| Karte | 3 Ladungen | unbegrenzt |
|---|---|---|
| Grauwall | 49 % | 49 % |
| Sankt Ruß | 84 % | 84 % |

- Die Grenze greift in der Simulation nicht: Wegen der 4 Runden Pause nach jedem Stollen sprengt die KI nur 1–2-mal je Schlacht.
- **Die 84 % auf Sankt Ruß kommen nicht von den Sprengungen.** Mineure sind Sappeure: Mit der geballten Ladung machen sie gegen die Sturmpanzer im Nahkampf ×1,5. Zwei zusätzliche Trupps für je 30 Punkte sind dort sehr viel wert.
- **Vorschlag:** 3 Ladungen lassen und die Mineure auf **40** verteuern.
  - Oder: Mineure ohne geballte Ladung. Dann sind sie reine Tunnelgräber.

### F79 – Panzer, Schreiter und Gebäude
- **Intakte große Gebäude** (heute die Kirche von Sankt Ruß, Schiff und Turm):
  - Für Fahrzeuge und Schreiter nicht betretbar, aber rammbar (Knopf „Gebäude rammen“, die Aktion und alle Bewegung).
  - Wirkung: Bauzustand −1 (die Kirche hat 6), Truppen im Gebäude werden niedergehalten.
  - Der Rammer nimmt etwa 6 Schaden und hat 15 % Pannengefahr. Bei 0 stürzt das Gebäude ein und wird Ruine.
- **Trümmer** (Ruinen, Fabrikruine, Kirchenruine, eingestürzte Gebäude):
  - Befahrbar, aber dort endet die Bewegung, mit 12 % Gefahr festzufahren.
  - Die Zugvorschau zeigt „Trümmer: Zug endet · Festfahren 12 %“.
- **KI:** rammt besetzte Gebäude, wenn kein besserer Angriff da ist. In der Simulation kam das kaum vor, sie greift lieber direkt an.
- **Animation:** Anlauf, Aufprall mit Rütteln, Staub, Mauerbrocken; Einsturz mit dem Einsturz-Ton.

### F70 – Fesselballon (gebaut wie bestätigt)
- **Oben:** Sicht 6 über Wald und Häuser, Ziel markieren, zieht nicht.
- **Eingeholt:** 2 Felder Zug, Sicht 2, kein Markieren.
- **Kosten:** Einholen 1 BP. Aufsteigen kostet alle BP, nicht die Aktion; markieren geht danach noch.
- **Preis:** 25.
- **KI:** holt ein und rückt nach, wenn in 6 Feldern kein Gegner ist; steigt auf, sobald einer in 6 Feldern ist.
- **Bild und Ton:** Der Ballon sinkt bzw. steigt am Seil zur Winde, dazu Kettenrasseln und Ratsche.
- **Hinweis:** Im letzten Bericht stand „Sicht wie Fußtruppen (2)“. Fußtruppen sehen aber 4 Felder. Gebaut ist die bestätigte **2**. Wenn du 4 meintest, ist das eine Zahl im Code.

### F46 – Graben
- Panzerbüchsen-Trupp, Pirschjäger und Scharfschütze sind niedrig bzw. liegend gemalt. Sie sinken im Graben jetzt weniger tief ein (Panzerbüchse 35 %, die anderen 50 % der normalen Grabentiefe).
- Vorher/nachher im Bild.

### Simulation mit allen Änderungen (je 200 Schlachten)
- Grauwall: Konkordat **52 %**.
- Sankt Ruß: Konkordat **50 %**.
- Paket E ist damit abgeschlossen.

### Fragen an Enrico
1. **F76:** Fahrzeuge und Schreiter drehen sich nicht von selbst zum Angreifer. Einverstanden, oder sollen sie sich in der Szene nur sichtbar drehen?
2. **F78:** Mineure auf 40 Punkte, oder ohne geballte Ladung?
3. **F70:** Eingeholter Ballon Sicht 2 (gebaut) oder 4?

## 2026-11-21 – F54 Sturmrollen, F66 Schere-Stein-Papier, Punkte 7–14; F70 Ballon-Vorschlag; ein Fehler gefunden und behoben

**Commits:**
- `91082c0` Fehlerbehebung, sofort online
- `519e3a0` F54, F66, F59, Abstimmung, Punkte 7–14

**Bilder:** `entwurf/probe/spieltest4_e/`
- Medaillen: `f66_panel_medaillen.jpg`, `_1280.jpg`, `f66_info_medaillen.jpg`
- `f54_sturmrollen_folge.jpg`, `f54_bohrstoss_folge.jpg`
- `p8_armee_tooltip.jpg`
- `f71_pulverdampf.jpg`, `f73_schreiter_gehen.jpg`, `f75_flammenstoss.jpg`

### Wichtig: Fehler im letzten Stand (F36-Commit), behoben
- **Was passiert war:** Beim Eintragen der Ausgraben-Kosten hatte ich einen Kommentar mitten in eine Zeile mit weiteren Regelkonstanten gesetzt. Dadurch waren vier Werte abgeschaltet: Schilde vor, Sturmlauf, Breitseite und Sprenglanze.
  - Der Sturmpanzer machte mit seiner Breitseite ungültigen Schaden („NaN“).
  - Die F36-Zahlen aus dem letzten Bericht (48 %/46 %) waren deshalb nicht gültig.
- **Behoben:** Die Korrektur ging sofort getrennt online (`91082c0`). Alle Zahlen unten sind mit korrekten Werten gemessen.
- Ausgraben kostet weiter die Aktion.

### F66 Schere-Stein-Papier – gebaut wie bestätigt
- **Faktortabelle** Waffenart gegen Panzerklasse, wie im letzten Bericht. Alte Einzelboni gehen darin auf:
  - Panzerbüchse gegen Panzer ×1,5 statt ×2.
  - Klinge gegen Panzer ×0,5 statt ×0,4.
  - Kampfanzug ×0,5 kommt jetzt aus der Tabelle.
- **Ausnahmen:**
  - geballte Ladung ×1,5;
  - MG gegen Reiter ×2;
  - Flanke;
  - direkter Geschützschuss auf Kolosse (×2,5, wie bisher).
- **Rollen:** „schwach im Nahkampf“ (Angreifer ×1,5, Gegenschlag ×0,5) und „stark im Nahkampf“ (Gegenschlag ×1,25).
- **Neu durch die Tabelle:** Drehlauf-Schreiter (Säge, Klaue, Orden) sind Gewehr/MG und prallen an Panzern ab.
- **Anzeige:**
  - Drei Medaillen unter dem Einheitenbild: gegen Infanterie, gegen Panzer, Nahkampf. Tooltip auch per Antippen.
  - Im Info-Fenster der Abschnitt „Stärken und Schwächen“ mit Symbol, Stufe und Faktor in Worten.
  - Beim Zielen erscheint der Faktor in der Vorschau, z. B. „panzerbrechend gegen schwer gepanzert ×1,5“.
  - Alles kommt aus denselben Werten wie die Regeln.
  - Die Medaillen sind 35 px groß, damit drei unter das Bild passen. Bei 1280 px brechen sie in 2 + 1 um. Sie sind Info-Flächen, keine Knöpfe.
- **KI:** Die Zielwahl nutzt die Faktoren automatisch, weil sie über die Schadensvorschau läuft.

### F54 Sturmrollen und Bohrkoloss – gebaut
- **Wer:** Landkoloss und Sturmpanzer haben keinen Nahkampf mehr, dafür Sturmrollen. Das Ziel ist eine Fußtruppe oder ein Geschütz daneben oder 2 Felder geradeaus mit freiem Feld dazwischen (Anlauf, nur aus dem Stand).
- **Endwerte (Simulation):**
  - 24 Schaden, niedergehalten, Moral −15, kein Gegenschlag.
  - Das Ziel rutscht ein Feld zurück. Ist dort kein Platz, ×1,5 („Eingeklemmt!“).
  - Kampfanzüge nehmen nur halben Schaden.
  - Kosten: die Aktion und alle Bewegung, danach 2 Runden Pause.
  - Halber Schaden änderte auf dem Grauwall kaum etwas (93 % statt 96 %). Deshalb habe ich 24 gelassen und über die Armeen abgestimmt.
- **Nutzung durch die KI:** je Schlacht etwa 13–16-mal beim Konkordat (3 Kolosse), etwa 8-mal bei der Aschenwacht (2 Sturmpanzer).
- **Bohrkoloss:** behält den Nahkampf. Es gibt einen einzigen Stoß, der sich etwa 0,9 s hineinbohrt: Rütteln, Funken bzw. Blut, Bohrton hält an.

### Abstimmung (je 200 Schlachten)

| Stand | Grauwall (Konkordat) | Sankt Ruß (Konkordat) |
|---|---|---|
| F66 + F54 + F36, ohne Armee-Anpassung | 96 % | 25 % |
| alle neuen Regeln abgeschaltet (Gegenprobe, 100 Schlachten) | 53 % | – |
| **neu, mit Armee-Anpassung** | **55 %** | **51 %** |

- **Grauwall:** Die Aschenwacht hatte keine Panzerabwehr gegen drei Kolosse (MGs prallen ab, Granaten nur halb). Sie bekommt **+2 Sturmbrecher** (geballte Ladung). Mit Panzerbüchsen statt Sturmbrechern blieb es bei 85–89 %.
- **Sankt Ruß:** Zwei Sturmpanzer rollen in die verteidigende Konkordat-Infanterie, die MG-Trupps sind im Nahkampf schwach. Das Konkordat bekommt **+2 Kohorten und +1 Pionier**. Mit 2 Pionieren lag es bei 88 %, so empfindlich ist die Karte.
- **Sturmpanzer:** kostet **100**.
- **Ausgraben:** Mit allem anderen eingeschaltet machte die Ausgraben-Regel auf dem Grauwall nur etwa 2 Punkte aus (78 % → 80 % in der Gegenprobe).

### Punkte 7–14
- **7 Standard-Optionen:** Bildwirkung „stark“ und Tempo ½× gelten jetzt einmalig auch bei dir (neue Speicherschlüssel). Danach bleibt deine eigene Wahl.
- **8 Armee-Auswahl:** Das Info-Feld steht direkt neben der überfahrenen Karte (rechts, sonst links, sonst darüber), nie mehr über der Übersicht.
  - Die Details im Nachschub-Fenster standen schon neben dem Fenster.
  - Die Panel-Tooltips erscheinen über ihrem Symbol.
- **9 Musikregler:** Der Regler selbst wirkt überall (Test: Titelmusik bei 0 auf Lautstärke 0).
  - Gefunden habe ich etwas anderes: Mit „Ton aus“ (M) startete beim Zurück ins Startmenü die Titelmusik trotzdem. Genauso bei Schlachtmusik, Niederlagenmusik und „Weiter“ aus dem Menü. Alle prüfen jetzt den Ton-Schalter.
  - Falls du etwas anderes gemeint hast, sag mir bitte, wo du den Regler auf 0 gestellt hast.
- **10 F71 Pulverdampf:** an jeder Mündung, durchsichtig, steigt und treibt seitlich, nach etwa 2,5 s weg.
  - Größe je Waffe: Gewehr und Scharfschütze klein, MG je Feuerstoß zwei Wölkchen, Kanone groß.
  - Höchstens 36 Wölkchen gleichzeitig; Bildwirkung „leicht“ halb so viele, „aus“ keine.
- **11 F72 Beschuss-Wucht:**
  - Gewehrsalve um 40 % lauter und dichter gestaffelt, Mündungsfeuer größer.
  - Erd- und Staubspritzer um das Ziel.
  - Mehr Blut bei Gewehrtreffern: Spritzer und Fleck schon ab mittlerem Treffer.
  - Das Bildschirmrütteln bei schweren Treffern gab es schon.
  - Echten Bass kann ich nur über den Ton-Bau anheben. Das mache ich mit deinem Ton-Pult-Export, wenn du einen Gewehrton festlegst.
- **12 F73 Schreiter:**
  - Gehen in zwei Schritten je Feld: anheben, aufstampfen, leicht zur Seite wiegen. Je Schritt eine Staubwolke und ein kleines Bodenbeben, bei Eisenknecht und Kreuzschreiter stärker.
  - Kettenfahrzeuge rattern leicht.
  - Rückstoß beim Schuss (Zweitwaffe kleiner), Ausholen vor dem Nahkampf-Stoß, Wanken bei Treffern.
  - Bei Panne oder Festfahren sackt das Fahrzeug ab, wie bisher.
- **13 F74 Scharfschützen:** je stehender Figur ein Schuss im Abstand von 0,4–0,6 s. Steht nur einer, fällt ein Schuss.
  - Ursache der zwei Schüsse: Die Tondatei enthielt zwei Schüsse. Sie wird jetzt nach dem ersten gekappt.
  - Gewehrsalven richten sich jetzt nach den tatsächlich gezeichneten Figuren statt nach einer festen Zahl.
- **14 F75 Flammenwerfer:** **ein gemeinsamer Stoß je Trupp**, 1,5 s (Zweitwaffe Flammenstoß des Bohrkolosses 1,1 s).
  - Der Strahl wird fortlaufend erneuert.
  - Der Ton läuft als Schleife genau so lange, blendet mit dem Strahl aus, danach knistert es kurz nach.
  - Ich habe den gemeinsamen Stoß gewählt, weil die Figuren dicht stehen und mehrere Strahlen übereinander unruhig wirken.
- **F68:** Steht im Auftrag nur in der Reihenfolge, nirgends beschrieben. Was ist damit gemeint?

### F70 – Vorschlag „Ballon auf- und abbauen“ (noch nicht gebaut)
- **Heute:** Bewegung 0, Sicht 8.
- **Aufgestiegen:** Sicht 6 statt 8, kann „Ziel markieren“, zieht nicht.
- **Eingeholt:** zieht 2 Felder (Wagen mit Winde), Sicht wie Fußtruppen (2), kein Markieren, keine Sicht über Hindernisse.
- **Kosten:** Einholen 1 BP. Aufsteigen kostet alle BP, aber nicht die Aktion, sodass in derselben Runde noch markiert werden kann (wie das MG).
- **Preis:** 20 → 25.
- **KI:** steigt auf, wenn Gegner in 4–6 Feldern liegen. Holt ein und zieht nach, wenn mehr als 6 Felder vor ihm keine Gegner mehr in Sicht sind.
- **Bild und Ton:** Der Ballon sinkt bzw. steigt am Seil, die Höhe wird im Code verändert. Ton: Seilwinde/Ratsche, ein vorhandener Metall-Ratschenton, sonst bitte einen „winch“-Ton.

### Offen
- F76–F79 (neu um 01:47–01:53): baue ich als Nächstes.
- Ton-Pult-Export (Gewehr 3 für die Grenadiere).

### Fragen an Enrico
1. **F70:** Ballon so wie vorgeschlagen?
2. **F68:** Was ist gemeint?
3. **Punkt 9:** Wo hast du die Musik auf 0 gestellt?

## 2026-11-21 – Nachträge F49–F65 erledigt, F44 Grauwall, Paket-E-Regeln; Vorschläge F54, F59-Preis und F66 zur Entscheidung

**Commits (alle gepusht):**
- `10b9b3a` neue Töne 5b und F49
- `13b2a89` F50, F52
- `f3d9c26` F51
- `8b580b2` F56, F57
- `bb273c0` F36 Bild
- `995b8ad` F44 und Regeln F53, F55, F31, F37, F38
- `d521862` F60, F62
- `19c8ff6` F61
- `cfc7083` F58
- `f90ae96` F59, F65
- `1153d41` F63
- `d379432` F67 und 2c
- `d8a24f1` + `f606e55` F64

**Bilder:**
- `entwurf/probe/spieltest4_paketD/f58_reiter_vorher.jpg` und `f58_reiter_nachher.jpg` (beide Seiten)
- `entwurf/probe/spieltest4_nachtraege/`:
  - `f59_bordmg.jpg`
  - `f63_nahkampf_folge.jpg`, `f63_nahkampf_flucht_folge.jpg`
  - `f64_blut_kanone.jpg`, `f64_blut_gewehr.jpg`
  - `f65_saeger_auf_panzer.jpg`
  - `f67_tonpult_alle_toene.jpg`

### Erledigt
- **5b neue Töne:** 25 Pixabay-Dateien sind einsortiert, im Ton-Pult unter „(neu)“. Fünf bitgleiche Doppelte liegen in `sound-quelle/_neu_doppelt`.
- **F49:** Beim Marsch nur Schritte, keine Trommel.
- **F50:** mehr Blut im Nahkampf.
- **F51:** Beide Seiten schlagen gleichzeitig zu, danach ein gemeinsamer Wucht-Moment mit beiden Schadenszahlen.
- **F52:** dünner Moralbalken unter dem Lebensbalken.
- **F53 Generalangriff:** ist jetzt ein echter zweiter Angriff.
  - Wirkung: +1 Aktion, +2 BP, auch für Einheiten, die schon angegriffen haben; Nahkampf auch nach weitem Zug; Niederhalten endet.
  - Nicht für Fliehende, Panne oder Festgefahrene.
  - Die KI nutzt ihn, wenn mindestens 40 % ihrer Einheiten in Reichweite schon angegriffen haben oder niedergehalten sind.
  - **Großer Befehl beider Seiten jetzt 2 statt 3 Felder:** Mit 3 Feldern kam das Konkordat auf Sankt Ruß nur auf 35 %.
  - „Halten um jeden Preis“ bleibt unverändert: keine Flucht, Abwehr ×1,25, 2 Felder.
- **F55:** Feuerbereitschaft und Sperrfeuer gehen nicht in Feindberührung (Knopf grau mit Grund).
- **F56:** Lauerschuss mit Kamera.
- **F57:** Ausgegraute Einheiten bleiben grau, während eine andere Einheit handelt.
- **F58:** Reiter zu dritt: zwei vorn, einer hinten in der Mitte, Maßstab 0,8, bleiben im eigenen Feld.
- **F59:** Sturmpanzer mit Bord-MG (Zweitwaffe wie beim Landkoloss), Mündung an der mittleren Bordschützen-Luke. Preis siehe unten.
- **F60:** Vorschau beim Ziehen: Gewehr, Schwert oder durchgestrichen. Ein echter Regelfehler lag nicht vor: In 548 von 566 Fällen konnte die Infanterie nach dem Zug schießen, die übrigen waren unterwegs niedergehalten worden.
- **F61:** Bewegungspunkte und Aktionsmünze groß unter der eigenen Figur, im Panel „Bewegung 2/3 · Aktion frei“.
- **F62:** Feuerknöpfe passen zur Regel.
- **F63:** Der ganze Nahkampf läuft in der Zoom-Szene (Gegenschlag, Ergebnis, Flucht, Nachrücken). Dauer bei 1× etwa 1,6 s, mit Flucht 2,4 s; bei ½× 3,2 s statt 4,4 s.
- **F64:**
  - Einschlag-Ton nach dem Ziel (Prüfliste unten).
  - Gewehrtreffer mit kleinem Blutnebel, Kanone und Granate auf Fußtruppen mit Erd- und Blutfontäne, Erdklumpen und Fleck.
  - Gewehrtöne siehe 2c im F67-Bericht.
  - Nebenbei gefunden: Der Einschlag-Ton nach Gewehrsalven fehlte seit der längeren Salve (F24) ganz. Behoben.
- **F65:** Schüsse auf große Ziele zielen jetzt auf die Mitte der Figur. Vorher lag der Zielpunkt über dem Panzer. Die Leuchtspuren fliegen flach.
- **F31, F37, F38:** Nahkampf-Schreiter nach weitem Zug nur Nahkampf; Steilfeuer ab 2 bzw. 3 Feldern; leere Drahtfelder nicht beschießbar.
- **F44 (nur Grauwall):** keine Welle mehr.
  - Die Aschenwacht startet mit **10 statt 8 Grenadieren**. Die alte Welle in Runde 7 waren 3 Sturmbrecher, 2 Brandwerfer und 1 Geschütz.
  - Ergebnis: Grauwall Konkordat **51 %**, mit gemischter Aufstellung 44 %; Sankt Ruß 47 % (je 200 Schlachten).
  - Andere Karten unverändert, die Abstimmung dort ist abgebrochen.

### F59 – Preis des Sturmpanzers (Vorschlag)
- Grauwall: unverändert 51 %, dort fährt kein Sturmpanzer.
- Sankt Ruß: Konkordat **44 %** statt 47 % (200 Schlachten, gleicher Startwert). Das Bord-MG wird etwa 8,5-mal je Schlacht benutzt.
- Die Kosten rechnen die Zweitwaffe nicht ein: Sturmpanzer 90, Landkoloss (mit Seiten-MG) 70.
- **Vorschlag:** Sturmpanzer +10 auf **100**.
  - Das wirkt nur beim Nachkauf, denn die Kartenarmeen sind fest.
  - Wenn Sankt Ruß wieder näher an 50 % soll, eher dort die Aschenwacht-Armee leicht schwächen.

### F64 – Prüfliste Einschlag-Ton (jede Waffe × Ziel)

Ziel weich = Fußtruppen, Reiter, Bedienungen. Gepanzert = Fahrzeuge, Schreiter, Kampfanzüge.

| Waffe | weiches Ziel | gepanzert, Waffe wirkt | gepanzert, prallt ab |
|---|---|---|---|
| Gewehr (Salve, Scharfschütze, Pistole, Halbautomat) | `einschlag` dumpf bzw. `vorbei` | – | `einschlag_abpraller` (gegen Kampfanzüge; auf Fahrzeuge dürfen Gewehre nicht schießen) |
| MG, Drehlauf, Seiten- und Bord-MG | `einschlag` tief und kurz, mit Spritzer | – | `einschlag_abpraller` |
| Panzerbüchse, Kanone gegen Panzerung (`at`), Unterarm-Kanone | `einschlag` | `einschlag_panzer` | – |
| Kanone (Koloss, Sturmpanzer, Turm, Feldkanone direkt) | Granateinschlag + `einschlag` tief | `einschlag_panzer` | – |
| Artillerie, Mörser, Minenwerfer, Feuerschlag | Einschlag schwer + `einschlag` tief | `einschlag_panzer` | – |
| Flamme, Gas | kein Kugeleinschlag (Feuer bzw. Gaswolke) | – | – |
| Nahkampf gegen Panzer | – | wie bisher `armor` bzw. `heavy` (im Nahkampf-Ablauf) | – |
| Sturmrollen (F54), Lauerschüsse (F56) | wie die Waffe | wie die Waffe | wie die Waffe |

- Im Ton-Pult hat jede schießende Einheit unter „Einschlag beim Ziel“ jetzt die Zeile „Treffer auf Panzerung (Waffe wirkt)“ bzw. „(Abpraller)“. Die Plätze gelten für alle Einheiten.
- **Abpraller:** In `sound-quelle` gibt es keinen echten Querschläger-Ton. Die drei Pings sind hochgestimmte Metalltöne. Wenn du 2–3 echte „ricochet“-Töne findest, tausche ich sie ein.
- Bis F66 gebaut ist, gilt vereinfacht: wirkt = Kanone, Granate, Panzerbüchse, panzerbrechend; alles andere prallt ab.

### F54 – Vorschlag „Sturmrollen“ (noch nicht gebaut, Entscheidung nötig; F26 ist derselbe Punkt)
- **Betroffen:** Landkoloss und Sturmpanzer verlieren den normalen Nahkampf, sie schießen.
  - **Frage:** Der Bohrkoloss ist ein Kettenfahrzeug, sein Bohrkopf ist aber eine Nahkampfwaffe. Soll er Nahkampf behalten (mein Vorschlag) oder auch Sturmrollen bekommen?
  - Schreiter bleiben im Nahkampf.
- **Sturmrollen** ist eine Fähigkeit. Sie kostet die Aktion und alle Bewegungspunkte, danach 2 Runden Pause.
  - **Ziel:** eine Fußtruppe oder ein Geschütz im Nachbarfeld, oder 2 Felder geradeaus mit freiem Feld dazwischen (Anlauf).
  - **Wirkung:** ein einziger Aufprall mit etwa 24 Schaden (rund doppelt so viel wie heute ein Nahkampf-Hieb des Kolosses gegen Grenadiere), dazu niedergehalten und Moral −15. Kein Gegenschlag.
  - **Rückstoß:** Das Ziel rutscht ein Feld zurück, wenn dort frei und begehbar ist. Sonst +50 % Schaden (gegen Wand, Draht oder eigene Truppen gedrückt). Der Panzer bleibt auf seinem Feld; beim Anlauf bleibt er im Zwischenfeld.
  - Draht im Weg wird niedergewalzt. Kampfanzüge nehmen nur die Hälfte. Gegen Panzer und Schreiter geht es nicht.
- **Animation:** Anlauf, ein Aufprall mit Kampfszene, Ziel rutscht zurück. Ton: tiefes Kettenrollen und schwerer Aufprall.
- **KI:** nutzt es, wenn der erwartete Schaden größer ist als der eines Schusses, zum Beispiel gegen ein Ziel in Deckung.
- Die Werte stimme ich nach deiner Zustimmung per Simulation ab (Grauwall und Sankt Ruß).

### F66 – Vorschlag „Schere-Stein-Papier“ (noch nicht gebaut, Entscheidung nötig)

**Faktortabelle (Waffe gegen Panzerklasse):**

| Waffenart | ungepanzert | leicht gepanzert | schwer gepanzert | heute |
|---|---|---|---|---|
| Gewehr, MG, Drehlauf | ×1 | ×0,5 | wirkungslos | gleich (Kampfanzug ×0,5, Panzer immun) |
| Schrot (Löwenoger) | **×1,5** | ×1 | wirkungslos | neu: ×1,5 gegen Fußtruppen |
| panzerbrechend (Panzerbüchse, Löwenmaul, Unterarm-Kanone) | **×0,5** | **×1,5** | **×1,5** | Panzerbüchse ×2 → ×1,5; gegen Infanterie neu ×0,5 |
| Kanone direkt (Koloss, Sturmpanzer, Turm, Faust, Feldkanone) | ×1 | ×1 | ×1 | gleich |
| Explosiv indirekt (Artillerie, Mörser, Minenwerfer, Granaten) und Flamme | ×1 (Deckung zählt weniger, wie heute) | ×1 | **×0,5** | neu: ×0,5 gegen Panzer |
| Nahkampf Klinge/Kolben | ×1 | **×0,5** | ×0,5 | Panzer ×0,4 → ×0,5; Kampfanzug neu ×0,5 |
| Nahkampf schwer (Säge, Klaue, Bohrkopf, Pranken) | **×1,5** | ×1 | ×1 | neu ×1,5 gegen Fußtruppen |
| geballte Ladung (Sturm- und Pioniertrupps gegen Panzer) | – | – | **×1,5** | gleich (bleibt als Ausnahme, macht die Sturmtrupps aus) |

**Rollen:**
- **Schwach im Nahkampf:** MG, Geschütze, Mörser/Minenwerfer, Scharfschütze/Pirschjäger, Sanitäter/Versorgung, Melder, Signal, Fernsprech, Ballon, Rauchwerfer. Wirkung: Angreifer ×1,5 gegen sie, ihr Gegenschlag ×0,5.
- **Stark im Nahkampf:** Sturmtrupps, Schildwall, Schwere Grabenwacht, Löwenoger, Kampfanzüge. Wirkung: Gegenschlag ×1,25.
- Bleibt als Ausnahme: MG gegen Reiter ×2 (macht das MG aus), Flankenangriff auf Fahrzeuge.

**Anzeige:**
- Unter dem Bild im Einheiten-Panel drei Medaillen, alle aus denselben Werten erzeugt:
  - **gegen Infanterie** (Schuss gegen ungepanzert),
  - **gegen Panzer** (Schuss gegen schwer),
  - **Nahkampf**.
- Bronze = ×0,5 oder wirkungslos, Silber = ×1, Gold = ×1,5.
- Im Info-Fenster stehen dieselben Punkte in Worten mit Faktor.
- Beim Zielen kurz „×1,5 panzerbrechend“.

**Jede Einheit (K = Konkordat, A = Aschenwacht):**
- Landkoloss und Sturmpanzer verlieren mit F54 den Nahkampf.
- Feldkanone zählt als „Kanone direkt“, nicht als Explosiv.

| Einheit | Seite | Panzerklasse | Fernwaffe | Nahkampf | Rolle |
|---|---|---|---|---|---|
| Schützenkohorte | K | ungepanzert | Gewehr/MG | Klinge/Kolben |  |
| Mahlwerk-Trupp | K | ungepanzert | Gewehr/MG | Klinge/Kolben | schwach im Nahkampf |
| Donnerrohr-Batterie | K | ungepanzert | Explosiv (Steilfeuer/Granate) | Klinge/Kolben | schwach im Nahkampf |
| Landkoloss | K | schwer | Kanone + Seiten-MG | schwer (Säge/Klaue/Rammen) |  |
| Lanzenreiter | K | ungepanzert | – (kein Fernkampf) | Klinge/Kolben |  |
| Feldscher | K | ungepanzert | – (kein Fernkampf) | Klinge/Kolben | schwach im Nahkampf |
| Grabenmörser | K | ungepanzert | Explosiv (Steilfeuer/Granate) | Klinge/Kolben | schwach im Nahkampf |
| Scharfschütze | K | ungepanzert | Gewehr/MG | Klinge/Kolben | schwach im Nahkampf |
| Meldegänger mit Hund | K | ungepanzert | – (kein Fernkampf) | Klinge/Kolben | schwach im Nahkampf |
| Graben-Pioniere | K | ungepanzert | Gewehr/MG | Klinge + geballte Ladung |  |
| Grabenräumer | K | ungepanzert | – (kein Fernkampf) | Klinge + geballte Ladung | stark im Nahkampf |
| Turmschreiter | K | schwer | Kanone + Turm-MG | schwer (Säge/Klaue/Rammen) |  |
| Ordensschreiter | K | schwer | Gewehr/MG (Drehlauf) | schwer (Säge/Klaue/Rammen) |  |
| Kreuzschreiter | K | schwer | panzerbrechend (Löwenmaul) + Unterarm-Kanone | schwer (Säge/Klaue/Rammen) |  |
| Stahlgänger-Trupp | K | leicht | Gewehr/MG | Klinge/Kolben | stark im Nahkampf |
| Löwenoger | K | leicht | Schrot | schwer (Pranken) | stark im Nahkampf |
| Flammentrupp | K | ungepanzert | Flamme | Klinge/Kolben |  |
| Schildwall | K | ungepanzert | – (kein Fernkampf) | Klinge/Kolben | stark im Nahkampf |
| Feldkanone | K | ungepanzert | Kanone direkt | Klinge/Kolben | schwach im Nahkampf |
| Fernsprechtrupp | K | ungepanzert | – (kein Fernkampf) | Klinge/Kolben | schwach im Nahkampf |
| Hauptmann mit Stab | K | ungepanzert | Gewehr/MG | Klinge/Kolben |  |
| General mit Stab | K | ungepanzert | Gewehr/MG | Klinge/Kolben |  |
| Rauchwerfer-Trupp | K | ungepanzert | – (kein Fernkampf) | Klinge/Kolben | schwach im Nahkampf |
| Mineure (Tunnelgräber) | K | ungepanzert | – (kein Fernkampf) | Klinge/Kolben |  |
| Versorgungstrupp | K | ungepanzert | – (kein Fernkampf) | Klinge/Kolben | schwach im Nahkampf |
| Ballonbeobachter | K | ungepanzert | – (kein Fernkampf) | Klinge/Kolben | schwach im Nahkampf |
| Sturmpanzer | A | schwer | Kanone + Bord-MG | schwer (Säge/Klaue/Rammen) |  |
| Aschengrenadiere | A | ungepanzert | Gewehr/MG | Klinge/Kolben |  |
| Sensenwerk-Trupp | A | ungepanzert | Gewehr/MG | Klinge/Kolben | schwach im Nahkampf |
| Grabengeschütz | A | ungepanzert | Explosiv (Steilfeuer/Granate) | Klinge/Kolben | schwach im Nahkampf |
| Sturmbrecher | A | ungepanzert | – (kein Fernkampf) | Klinge + geballte Ladung | stark im Nahkampf |
| Brandwerfer | A | ungepanzert | Flamme | Klinge/Kolben |  |
| Aschenpfleger | A | ungepanzert | – (kein Fernkampf) | Klinge/Kolben | schwach im Nahkampf |
| Minenwerfer | A | ungepanzert | Explosiv (Steilfeuer/Granate) | Klinge/Kolben | schwach im Nahkampf |
| Sprenglanzen-Reiter | A | ungepanzert | – (kein Fernkampf) | Klinge/Kolben |  |
| Panzerbüchsen-Trupp | A | ungepanzert | panzerbrechend | Klinge/Kolben |  |
| Schwere Grabenwacht | A | ungepanzert | – (kein Fernkampf) | Klinge/Kolben | stark im Nahkampf |
| Signaltrupp | A | ungepanzert | – (kein Fernkampf) | Klinge/Kolben | schwach im Nahkampf |
| Sägeschreiter | A | schwer | Gewehr/MG (Drehlauf) | schwer (Säge/Klaue/Rammen) |  |
| Klauenschreiter | A | schwer | Gewehr/MG (Drehlauf) | schwer (Säge/Klaue/Rammen) |  |
| Eiserne Hünen | A | leicht | Gewehr/MG | Klinge/Kolben | stark im Nahkampf |
| Panzerknechte | A | leicht | Gewehr/MG | Klinge/Kolben | stark im Nahkampf |
| Drahtpioniere | A | ungepanzert | Gewehr/MG | Klinge + geballte Ladung |  |
| Bannerträger | A | ungepanzert | Gewehr/MG | Klinge/Kolben |  |
| Hauptmann mit Stab | A | ungepanzert | Gewehr/MG | Klinge/Kolben |  |
| General mit Stab | A | ungepanzert | Gewehr/MG | Klinge/Kolben |  |
| Eisenknecht | A | schwer | Kanone (Faust) | schwer (Säge/Klaue/Rammen) |  |
| Bohrkoloss | A | schwer | – (nur Nahkampf, Bohrkopf) + Flammenstoß | schwer (Säge/Klaue/Rammen) |  |
| Eingreiftrupp | A | ungepanzert | – (kein Fernkampf) | Klinge + geballte Ladung | stark im Nahkampf |
| Gasschutz-Trupp | A | ungepanzert | Gewehr/MG | Klinge/Kolben |  |
| Versorgungstrupp | A | ungepanzert | – (kein Fernkampf) | Klinge/Kolben | schwach im Nahkampf |
| Pirschjäger | A | ungepanzert | Gewehr/MG | Klinge/Kolben | schwach im Nahkampf |

**Was sich spürbar ändert:**
- Panzerbüchse und Löwenmaul gegen Infanterie schwächer.
- Artillerie gegen Panzer schwächer.
- Löwenoger und Schreiter im Nahkampf gegen Fußtruppen stärker.
- MG-Trupps und Geschütze im Nahkampf deutlich schwächer.

Nach deiner Zustimmung baue ich das, stimme es auf Grauwall und Sankt Ruß ab, und die KI-Zielwahl nutzt die Faktoren.

### Offen
- **F36 Regelteil – erledigt:** Eingegrabene Trupps müssen erst „Ausgraben“ (Knopf mit Schaufel), dann können sie ziehen; die Deckung ×1,3 endet. Kosten per Simulation (je 200 Schlachten): mit 1 BP Grauwall 42 % / Sankt Ruß 48 %, **mit der Aktion 48 % / 46 % → gewählt: kostet die Aktion** (wie das Eingraben). Die KI gräbt sich aus, wenn sich ein Stellungswechsel lohnt (Grauwall ca. 5–6-mal je Schlacht und Seite).
- F54 und F66 warten auf deine Entscheidung.
- Helden stehen in IDEEN.md.

### Fragen an Enrico
1. **F54:** Sturmrollen wie oben? Behält der Bohrkoloss den Nahkampf?
2. **F66:** Tabelle so? Besonders zu entscheiden:
   - Gewehr gegen Panzer bleibt wirkungslos, oder ×0,5?
   - Panzerbüchse gegen Infanterie ×0,5?
   - Artillerie gegen Panzer ×0,5?
3. **F59:** Sturmpanzer auf 100?

## 2026-11-21 – F67 Ton-Pult neu (fehlende Töne, „Alle Töne“), Gewehre mit Nachhall (2c)

**Ton-Pult neu – bitte neu laden (Strg+F5).** Deine bisherige Auswahl bleibt erhalten: kein vorhandener Schlüssel wurde umbenannt.

- **87 der 88 Dateien eingebaut**, als 124 Einzeltöne in neuen Plätzen `neu2_*`, die unter „Einzelne Töne“ in den passenden Gruppen stehen: Gewehr, Pistole, Autokanone, Kanone, Einschlag, Metalltreffer, Knall, Einsturz, Nahkampf, Blut, Stimmen, Brüllen, Gasmaske, **Monster (später Dämonen)**, Horn, Musik, Punkt, Knopf, Tür, Aufprall/Maschine, Flugzeug, Schritte, Hund, Feuer, Wasser.
  - Lange Dateien sind geschnitten. Dateien mit mehreren Lauten sind in Einzeltöne geteilt: bis 4 je Datei, bei Monster und Stimmen bis 2 (wegen der Dateigröße).
  - In der Ton-Probe stehen sie in der Gruppe „Weitere Töne aus sound-quelle“.
- **Nicht eingebaut:** `Musiker/…nicol-singing-seven-nation-army.wav`. Grund: gesungenes, bekanntes Lied, Rechte unklar, passt nicht ins Spiel. Die Datei bleibt liegen.
- **Drei AIFF-Dateien** (Waldbrand, Kugeltreffer, Turmeinsturz Bologna) kann der Browser nicht lesen. Daneben liegen jetzt WAV-Kopien mit gleichem Namen. Die Originale sind unverändert.
- **Neu: Knopf „Alle Töne …“ in jeder Zeile.**
  - Er zeigt jeden Ton des Spiels, nach Gruppen geordnet (Gewehre, MG und Autokanonen, Kanonen, Einschläge, Nahkampf, Stimmen, Motoren, Monster …).
  - Mit Suchfeld (Name, Schlüssel, Datei), ▶ zum Probehören und „Wählen“.
  - Ein Ton aus einer fremden Gruppe bekommt beim Einbau deines Exports einen eigenen Platz nur für diese Einheit.
- **Eisenknecht:** vier Autokanonen-Kandidaten `neu2_autokanone_1–4` stehen in den Gruppen Kanone und MG:
  - 50er-MG tiefer gestimmt, in zwei Stufen,
  - schweres MG tiefer,
  - drei schnelle Kanonenschüsse.
- **2c, Gewehre mit vollem Nachhall:**
  - „Gewehr 3“ (`rifle3`, Aschenwacht) war die M1-Garand-Aufnahme, bei 0,8 s abgeschnitten. Jetzt kommt sie aus der Quelle mit Ausklang bis 1,7 s.
  - `rifle2` (battle-rifle, Hauptgewehr der Aschenwacht) war bei 0,6 s gekappt, jetzt 0,9 s mit Ausklang.
  - Alle übrigen Schusstöne geprüft: Gefechtslärm, Halbautomat, MG, Drehlauf, Sturmpanzer-Kanone und Schrot klingen jetzt weich aus.
  - Die kleine Kolosskanone ist schon in der Quelle nur 0,4 s lang.
  - Die Zuordnung im Spiel habe ich nicht geändert. Deine Wahl „Gewehr 3“ für die Aschengrenadiere baue ich mit deinem Export ein.
- **Größe:** `index.html` ist jetzt 61 MB. GitHub warnt ab 50 MB, die harte Grenze liegt bei 100 MB.

**Seit dem letzten Bericht ebenfalls erledigt (Bericht folgt ausführlich):**
- F58 drei Reiter (`cfc7083`)
- F59 Bord-MG Sturmpanzer und F65 Schüsse auf große Ziele (`f90ae96`)
- F63 Nahkampf ganz in der Szene, 1× ca. 1,6 s (`1153d41`)

Bilder: `entwurf/probe/spieltest4_paketD/f58_*`, `entwurf/probe/spieltest4_nachtraege/`.

**Fragen an Enrico:** keine, erst dein Ton-Pult-Export.

## 2026-11-21 – Paket C abgeschlossen (Posen, F48), Paket D erledigt; F44 Feinabstimmung läuft

**Commits:** `8dc70ec` weitere Posenbögen · `84c62a7` F48 Kampfszene · `f383ac0` Hauptmann-Posen · `8a58a6b` Paket D – gepusht.
**Bilder:** `entwurf/probe/spieltest4_paketC/` (posen_weitere_freigestellt.jpg, posen_weitere_im_spiel.jpg, f48_kampfszene_folge.jpg), `entwurf/probe/spieltest4_paketD/f6_aufstellung.jpg`

### Paket C – Rest
- **Alle Posenbögen eingebaut** (Sanitäter, Flammentrupps, Kampfanzüge, Versorgung, Schildwall, Schwere Grabenwacht, Scharfschütze, Pirschjäger, Melder → Fernsprech-/Signaltrupp, Mineur, Hauptmann). Posen kommen beim Ziehen (Laufen), Schießen/Flammenstoß, Nahkampf, Heilen, Reparieren, Nachladen, Schilde vor, Ziel markieren/Feuerschlag, Stollen, Sturmlauf, Befehl (Hauptmann) und Getroffen.
- Pflichtpunkte: Adler auf allen Sanitäter- und Melder-Pickelhauben übermalt, Helmplakette Flammentrupp übermalt, Konkordat-Flagge auf Ochsenblut, Aschenwacht-Läufer gespiegelt, loser Stiefel weg, Geisterfigur und Rauchwolken der Kampfanzüge weg, Lampenschein Mineur, Pistole Konkordat-Hauptmann gespiegelt, unbrauchbare Versorgungs-Posen (Hämmern, Kette) ausgelassen, kleine kniende Aschenwacht-Versorgung vergrößert. Sich berührende Figuren (Sanitäter Konkordat, Scharfschütze) per Naht getrennt.
- Melder-Bögen: Der Meldegänger hat einen Hund im Grundbogen; die Melder-Posen nutze ich deshalb für den **Fernsprechtrupp** (Konkordat, Feldtelefon) und den **Signaltrupp** (Aschenwacht, Signalflagge). Der Meldegänger mit Hund bleibt wie er war.
- **F48 Kampfszene**: Nahkampf, Löwengebrüll, Haftladung: Kamera fährt heran, Rand dunkel, Ziel in Getroffen-Pose mit Rückstoß, kurzer Stillstand und Rütteln, dann zurück. Optionen „Kampfszenen: an / kurz / aus“, Klick überspringt. Nicht umgesetzt: Szene beim Vernichten eines Trupps durch Beschuss (ich wollte Schießen schnell lassen) – sag, ob du das trotzdem willst.
- Hinweis Dateigröße: `index.html` ist durch die vielen Posenbilder jetzt **52,5 MB** (GitHub warnt ab 50 MB, die harte Grenze ist 100 MB). Noch kein Problem, aber Platz ist endlich.

### Paket D – erledigt
| Punkt | Ergebnis |
|---|---|
| F11 | „Fertig“ für alle Einheiten; abgehakt = grau, auch wenn noch die Zweitwaffe ginge |
| F17 | grau erst, wenn wirklich nichts mehr geht (zählt jetzt auch Zweitwaffe, Löwengebrüll, Eingraben, Schilde, Banner, Sperrfeuer, Draht); Hinweis „Zweitwaffe noch frei“ |
| F25 | Drehen-Knöpfe für alle Einheiten (außer niedergehalten/Panne) |
| F33 | Zeiger aus den Bogen-Symbolen je Fähigkeit über gültigem Ziel; ungültig = Verbotszeichen |
| F6 | Aufstellung: Einheitenkarte sichtbar, Startzustand per Knopf (Geschütz auf-/abgeprotzt, MG auf-/abgebaut) |
| F41 | Warnung 2 bzw. 1 Runde vor einem möglichen Sieg (Einblendung + Horn/Trommel, Punkte oben pulsieren) |
| KI-Einstellung | Optionen „KI: angriffslustig / ruhig“, Standard angriffslustig |

### F44 – Zwischenstand (gemischte Aufstellung, ohne Welle, Konkordat-Siegquote)
| Karte | heute (mit Welle) | ohne Welle | bisher beste Startarmee |
|---|---|---|---|
| Grauwall | 35 % | 63 % | +2 Grenadiere → 48 % |
| Selm | 47 % | 75 % | +1 Sturmtrupp → 53 % |
| Lerne | 89 % | 91 % | +3 Sturm +1 Brand → 41 % (Feinabstimmung läuft) |
| Front | 13 % | 21 % | Aschenwacht zu stark – Feinabstimmung läuft (weniger Grenadiere / mehr Kohorten) |
| Stein | 79 % | 81 % | +1 Sturmtrupp → 56 % |
| Waldflanke | 69 % | 82 % | +1 Sturmtrupp → 45 % (läuft) |
| Kasem | 53 % | 79 % | +1 Sturmtrupp → 63 % (läuft) |
| Kanal | 38 % | 63 % | ein Sturmtrupp schon zu viel (28 %) – läuft |
| Varn | 37 % | 49 % | ohne Zusatz 49 % |
Ein Sturmtrupp verschiebt bis zu 35 Punkte, deshalb stimme ich mit Grenadieren/Brandwerfern fein ab. Danach baue ich die Armeen ein (Welle weg) und melde die Endwerte.

### Fragen an Enrico
- F48: Soll auch das **Vernichten eines Trupps durch Beschuss** eine Kampfszene auslösen, oder bleibt Schießen schnell?


## 2026-11-20 21:55 – Paket B (Ton) erledigt, Paket C zum größten Teil, F44 läuft

**Commits:** `33038ac` Paket B · `ffdf027` Paket C Teil 1 · `5d5b382` Posen Sturmtrupps/Pioniere – gepusht.
**Bilder:** `entwurf/probe/spieltest4_paketC/` (Kanone/Hünen-Ablauf, Nahkampf mit Blut, Posen Sturm/Pionier)

### Paket B – Ton (alle Punkte erledigt)
| Punkt | Ergebnis |
|---|---|
| F4 | Schlachtmusik etwa −4 dB |
| F5 | Musik senkt sich weich auf 45 %, solange jemand spricht oder marschiert wird, dann wieder hoch |
| F8 | Den „Zug-Pfiff“ per Tonhöhenanalyse gefunden: das Wagenknarren unter dem Gespann hat einen Dauerton um 700 Hz. Entfernt; Hufe und Wiehern bleiben. |
| F9 | Konkordat-Marsch: Schritte vorn, Trommel leise darunter |
| F14 | Auf-/Abprotzen Aschenwacht: tiefer, mit Bass und Begrenzer (eigene Töne nur für die Aschenwacht) |
| F29 | Ursache: die Enfield-Aufnahme hat in den ersten 20 ms ein metallisches Klicken vor dem Knall. Abgeschnitten. |
| F30 | Waffenton fest je Seite und Einheitentyp; Ton-Pult nachgezogen |
| F32 | Eingraben nur noch 72199 (Graben mit Atmen); Spatenhiebe 96216 im Nahkampf der Infanterie |
| F35 | Schmerzensschreie auch bei MG-Treffern (gut die Hälfte der Treffer ab 4 Schaden), mit Stimmfilter der getroffenen Einheit |
| F39 | Reparieren klingt nach Werkstatt (Schraubenschlüssel, Ratsche), Nachladen nach Ladegeräusch |

### Paket C – Effekte, Animation, Kamera
| Punkt | Ergebnis |
|---|---|
| Schadenszahlen (dein Wunsch) | gelb unter 15, hellrot 15–29, kräftiges Rot und größer ab 30 (Anteil der vollen Stärke 100) |
| F16/F20/F47 | Mündungen aus den Bildern gemessen: Landkoloss-Kanone (Rohrende statt Sehschlitz), Sturmpanzer, Turmschreiter-MG, Säge-/Klauenschreiter, Löwenoger-Flinte. **Hünen:** schießen jetzt aus dem MG auf Hüfthöhe (eigener Punkt je Pose). Kanonen: Mündungsfeuer + Qualm, kein fliegendes Geschoss, Explosion am Ziel. Kreuzschreiter/Eisenknecht hatten schon gemessene Punkte. |
| F24 | Drehlauf-Salve etwa 1 s länger, zweiter Feuerstoß im Ton |
| F28 | Gewehrsalven über 2–3 s (je Figur 1–2 Schüsse, unregelmäßig), Schaden erst nach dem letzten Schuss; MG zwei Feuerstöße; Nahkampf als Folge von Hieben (Angriff 3–5, Gegenschlag 2–3 zusammen mit dem ersten) mit Klirren, Trefferbild, Spritzern. Bei ½× dauert ein Nahkampf etwa 6 s, bei 1× etwa 3 s. |
| F27 | Blut als gemalte Spritzer und Bodenflecken aus deinem Effektbogen (die Bodenflecken 4–6 waren bisher unbenutzt) statt runder Punkte; Flecken bleiben bis Schlachtende |
| F34 | Kamera weicher (sanft an-/auslaufend, mindestens 0,38 s) und neu auch zum Nahkampf; abschaltbar wie bisher |
| F39 | Zeichen: goldener Schraubenschlüssel (Reparieren/Bergen), Munitionskiste (Nachladen); grünes Kreuz nur noch Heilen |
| F40 | Zurückweichen/Rückzug: Kehrtwende-Pfeil statt Schweißtropfen (gezeichnet; ein gemaltes Bild kann später kommen) |
| Posen | **Sturmtrupps** (Grabenräumer, Sturmbrecher): Ausholen/Loslassen beim Granatwurf im Sturmangriff, Graben, Getroffen. **Pioniere** (beide): Draht schneiden, Haftladung, Mine, Graben, Getroffen. |
| F21 | **nicht gelöst** – im Code nicht eindeutig nachzustellen, siehe Frage |

**Noch offen in Paket C:** die übrigen Posenbögen (Hauptmann, Sanitäter, Flammen, Kampfanzüge, Versorgung, Schildwall, Schwer, Scharfschütze/Pirschjäger, Melder, Mineur – mit den Pflicht-Übermalungen) und **F48 Kampfszene**. Die mache ich als Nächstes.

### F44 – Stand
Die Abstimmung läuft (alle 9 Karten mit Welle, je 150 Schlachten, gemischte Aufstellung). Erster Befund: **Mit gemischter Aufstellung liegen die Karten schon heute weit auseinander** – Grauwall 35 %, Selm 47 %, Lerne 89 %, Front 13 % Konkordat. Auf dem Grauwall ist schon die halbe Welle von Anfang an zu stark (20 %). Ein Sturmtrupp mehr oder weniger verschiebt bis zu 40 Punkte. Ich suche je Karte die Menge, die am nächsten an 50 % liegt (auch „nur Welle weg“), und melde die Startarmeen.

### Fragen an Enrico
- **F21:** Bei welcher Einheit und welcher Deckung hast du den durchscheinenden Lebensbalken gesehen (Graben, Ruine, Wald)? War es beim eigenen Angriff (Maus auf dem Ziel) oder im Gegnerzug? Ein Bildschirmfoto hilft.
- **F44:** Wenn eine Karte auch ohne Welle und ohne Zusatzeinheiten weit weg von 50 % liegt (z. B. Lerne 89 %): darf ich dort auch die Startarmee des Konkordats anpassen?


## 2026-11-20 20:51 – Paket F (KI, Gegnerarmee): F43 erledigt, F44 Vorschlag – Entscheidung nötig

**Commits:** `968e0ae` F43 aktive KI (gepusht). Werkzeug neu: `tools/ki_aktiv.js` (misst Vorrücken, Angriffe, Rückzüge, Zielfelder; `HALTEN=1` = Gegner hält nur wie ein vorsichtiger Spieler).

### F43 – KI zu passiv: Ursache und Lösung
- **Ursache:** Die KI rechnet für jedes Feld die „Bedrohung“ zusammen – und zählt dabei jeden Gegner voll, der das Feld erreichen könnte, als würden alle zugleich auf diesen einen Trupp schießen. Vor einer gegnerischen Linie ergibt das −12 bis −19 Punkte, ein Feld Vorrücken bringt nur +0,8. Ergebnis: Die Aschenwacht blieb vor dem eigenen Graben stehen (Grauwall: vordere Trupps ab Runde 2 bei Spalte ~5,7 von ihrer Kante) und 23 % ihrer Züge gingen nach hinten.
- **Lösung (nur für die Seite, die gegen dich spielt):** Bedrohung über 1,5 zählt nur noch zu einem Drittel; muss die KI angreifen (du hältst mindestens so viele Fahnen oder führst), zählen Vorrücken und Fahnen ×1,5; gesunde Trupps (Stärke ab 50, nicht auf der Flucht) ziehen nicht mehr grundlos zurück.
- **Messung Grauwall:** vordere Trupps bis Spalte 8 statt 6,8; Rückzug 10 % statt 23 % der Züge; gegen einen Gegner, der ab Runde 5 nur noch hält, gewinnt die KI 28 von 30 Schlachten (vorher kaum Druck).
- **Warum nur die Computerseite:** Für beide KI-Seiten zugleich verschob es die Balance stark (Grauwall Konkordat 51 % → 16 %, Sankt Ruß 47 % → 70 %), weil dann auch die KI-Konkordat in die MG-Linie läuft. Die Balance-Simulation misst deshalb weiter mit gleich spielenden Seiten – **Balance unverändert** (geprüft: bitgleich mit vorher, Grauwall 59 %, Sankt Ruß 48 % bei 200 Schlachten).
- **Wichtig für deinen nächsten Spieltest:** Die KI ist jetzt deutlich stärker als vorher. Wenn sie dir zu hart wird, ist das ein Regler (drei Zahlen in `ai.js`, `AKTIV`).

### F44 – Gegnerarmee: Vorschlag (noch nichts gebaut)
Heute auf dem Grauwall: Aschenwacht startet mit 675 Punkten, in Runde 7 kommt eine Welle (3 Sturmtrupps, 2 Brandtrupps, 1 Geschütz = 450 Punkte) am Rand. Gemessen (200 Schlachten, KI gegen KI, Anteil Siege Konkordat):

| Variante | Konkordat |
|---|---|
| heute (Welle Runde 7) | 59 % |
| **A** ganze Welle von Anfang an in der Startarmee | 15 % (viel zu stark) |
| **A2** zwei Drittel der Welle von Anfang an | 68 % |
| **B** keine Welle, Nachschub-Einkommen 40 statt 10 je Runde | 82 % |
| **B2** keine Welle, Einkommen 60 | 76 % |

**Empfehlung: Variante A** – keine Welle mehr, dafür von Anfang an etwa drei Viertel der Welle in der Startarmee (z. B. 3 Sturm, 1 Brand, 1 Geschütz zusätzlich), über die ganze Breite verteilt; genaue Menge per Simulation auf ~50 %. Gründe: Du siehst den Gegner von Anfang an, nichts kommt überraschend; frühe Einheiten zählen viel mehr als späte (darum ist die volle Welle von Anfang an viel zu stark). Variante B wirkt kaum, weil die KI ihr Geld nur am Rand und ohne Plan ausgibt – das müsste ich erst verbessern. Gilt für alle Karten mit Welle (alle außer Sankt Ruß).

### Fragen an Enrico
- **F44:** Variante A (mehr Einheiten von Anfang an, ich stimme die Menge per Simulation ab) – einverstanden? Oder B (Nachschub über Fahnen wie bei dir; dann zuerst die Kauf-KI verbessern)?
- **F43:** Soll die aktive KI später als Einstellung „KI: ruhig / angriffslustig“ wählbar sein?

Weiter geht es jetzt mit Paket B (Ton); F44 setze ich nach deiner Entscheidung um.


## 2026-11-20 20:16 – Paket A (Fehler, Lesbarkeit, Menüs) erledigt

**Commits:** `eb75779` Postfach-Regel in CLAUDE.md · `678cd04` Paket A · `429d231` Auftrag + POSEN_PROMPTS.md (Enricos Dateien) – alles gepusht.
**Screenshots:** `entwurf/probe/spieltest4_paketA/`

| Punkt | Ergebnis |
|---|---|
| F12 Drahtschneiden | Ursache: (1) Nach jedem Schnitt wurde die ganze Geländewelt neu gebaut (0,4–0,6 s) → das Stocken. (2) Die „Kugeln“ waren alte Funken-Partikel, die in der neuen Ansicht als flache Farbkreise erscheinen. Jetzt: nur die Drahtstücke des Felds verschwinden (kein Neuaufbau, gilt auch für Niederwalzen/Zerschießen), dazu eine Staubwolke. Bild: `f12_draht_vorher_nachher.jpg`, `f12_staub_statt_kugeln.jpg` |
| F1 | Bildwirkung startet auf „stark“ (auch bei dir, die alte Einstellung wird nicht übernommen) |
| F2 | Menü im Spiel: „Zurück zum Spiel“ oben, „Beenden“ unten; Beenden fragt einmal („Wirklich beenden?“), dann Startbildschirm. `f2_spielmenue.jpg` |
| F3 + F7 | Tooltips, Pergament-Details, Nachschub, Armee-Auswahl: Schrift 16–21 px statt 12–14, dunkle Tinte. 21 lange Einheitentexte gekürzt (Ø 234 → 195 Zeichen). 1280 px geprüft (Namen umbrechen, nichts überlappt). `f3_*.jpg` |
| F19 | Fähigkeitsknöpfe zeigten bisher die ganze Einheitenbeschreibung. Jetzt eigener Kurztext je Fähigkeit, Zahlen direkt aus den Regeln. Abweichung gefunden: „Draht schneiden – danach noch Angriff“ stimmte nicht (es kostet die Aktion); Text korrigiert. Haftladung: 50 % Panne bei Kolossen fehlte im Text. |
| F42 | Auswertung: Werte hell auf den dunklen Kacheln, Fragen dunkel auf dem Pergament, größer. `f42_*.jpg` |
| F10 | Geländehinweis beim Ziehen kleiner |
| F15 | Optionen → „Meldungen: Text / Symbole / aus“. Schadenszahlen, Punkte, „fällt“, „aufgerieben“, große Befehle bleiben immer. |
| F18 | Lautsprecher bei Ton aus rot durchgestrichen, kurzer Hinweis; neu: Taste M |
| F22 / F23 | Niedergehalten: kleine dunkle Plakette, kein Leuchtkreis. Zahnrad (Panne) heller, deckend, dunkle Kontur. `f22_f23_marken.jpg` |
| F13 | „Runde beenden“ pulsiert langsam, wenn alle Einheiten fertig/abgehakt sind |

**Tests:** Partietest 4 Runden ohne Konsolenfehler; Draht Bild = Regel ok. `test_draht.js` meldet einen Fehler (Straßenbau Zeile 504) – der war schon vor Paket A da, nicht von mir; schaue ich mir bei Gelegenheit an. Keine Regeländerung → keine Simulation nötig.

**Offen / Hinweise:** Gegenüber der Liste nicht verändert: die Kurztexte der Schlagwort-Chips (z. B. „Draht schneiden (Nachbarfeld, 1 Punkt)“ – „Punkt“ ist noch die alte Sprache); nehme ich mit, wenn F17/F11 die Bedienung umbauen.

### Fragen an Enrico
- F15: Reichen „Text / Symbole / aus“ so, oder sollen Schadenszahlen auch abschaltbar sein?
- F3/F7: Ist die neue Schriftgröße so richtig, oder noch größer (bei 1280 px wird es dann eng)?


