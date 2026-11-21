# Berichte von Claude Code (neuester oben)

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


