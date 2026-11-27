## 2026-11-27 – Paket W1 (Punkt 124): fal aus CC, Video je Paket, Fable-Prüfrunde

Gepusht:
- `acd0baf`
- Abschluss-Commit mit index.html und diesem Bericht

**Stand:**
- **Hänger:** keine.
- **Tests:** Partietest „Konsole rot-frei, keine Fehler“.
- **sim:** kein Lauf, weil sich keine Regel geändert hat.

**1. fal direkt aus CC:**
- **Werkzeuge:**
  - `tools/fal_bild.mjs <auftrag.json>`: Nano Banana 2, mit `refs` die Edit-Fassung; lokale Referenzen gehen in den fal-Speicher, notfalls als Daten-URL.
  - `tools/fal_ton.mjs <auftrag.json>`: ElevenLabs-Geräusche (`art: "sfx"`) und Sprache (`art: "tts"`), mp3 in den angegebenen Ordner.
  - Gemeinsame Hilfen stehen in `tools/fal_lib.mjs`.
- **Ablauf:** Vorhandene Dateien werden nicht überschrieben (außer mit `"ueberschreiben": true`). Am Ende kommen eine Liste mit Dauer und geschätzten Kosten und die Übersicht `entwurf/probe/fal/<datum>_uebersicht.jpg`.
- **Schlüssel:**
  - Dein `FAL_KEY` ist als Windows-Benutzervariable gesetzt (Länge geprüft, Wert nicht angesehen).
  - Diese CC-Sitzung lief schon vor dem Anlegen und sieht ihn nicht in der Umgebung. Die Werkzeuge lesen ihn deshalb selbst aus der Benutzer-Umgebung (Registry), nur im Speicher.
  - Er wird nirgends ausgegeben oder gespeichert. Geprüft: in keiner Projektdatei.
  - Ohne Schlüssel gibt es eine klare Meldung, und es wird nichts erzeugt.
- **Test:**
  - Ein Bild (1K, 1:1, etwa 0,08 $), 16 s.
  - Ergebnis `entwurf/probe/fal/test_kiste.png`, Übersicht `entwurf/probe/fal/20261127_1501_uebersicht.jpg`.
  - Der Magenta-Hintergrund ist etwas dunkler und leicht ungleichmäßig. Für figure_cut sollte das reichen; der Hintergrund wird je Bogen gemessen.
- **Nicht getestet:**
  - `fal_ton.mjs` (noch kein Tonauftrag, keine Kosten verursacht).
  - Das Hochladen lokaler Referenzen (das Testbild hatte keine).
  - Beides erst beim ersten echten Auftrag.

**2. Video nach jedem Paket:**
- **Werkzeug:** `tools/video_partie.mjs <paket> [KARTE=…] [DAUER=25]`. KI gegen KI, Runde 1 schnell, ab Runde 2 in Tempo 1×.
- **Aufnahme:** im Browser selbst (MediaRecorder, **MP4 H.264 + AAC**). ffmpeg ist auf dem Rechner nicht installiert und wird so auch nicht gebraucht.
- **Ton:** kommt über einen Abgriff hinter dem Begrenzer im Tonweg (neue Testhilfe `__dbg.tonAbgriff`, ändert am Spielton nichts).
- **Was zu sehen ist:** nur die Spielfläche (1920×1006), ohne die HTML-Leisten oben und unten.
- **Prüfwerkzeug:** `tools/video_pruefen.mjs <datei>` misst Dauer, Bildrate, Bewegung und Tonpegel und legt Standbilder daneben.
- **Testvideo Grauwall:** `entwurf/probe/video/W1_grauwall.mp4`
  - 7,5 MB, 25,3 s, **25 Bilder/s**, Bild bewegt sich, Ton −15 dB im Mittel.
  - Standbilder `entwurf/probe/video/W1_grauwall_bild1–6.jpg`.
- **Nicht in git:** Videos sind in `.gitignore`, sie liegen nur im Ordner.

**3. Fable-Prüfrunde:** Die Regel steht in CLAUDE.md unter „Feste Regeln“, dazu je ein Hinweis zu Video und fal.

**Fragen an Enrico:**
1. Reicht im Video die Spielfläche ohne die Leisten oben und unten? Die ganze Seite mit Leisten ginge über Bildschirmaufnahmen Bild für Bild, wäre aber deutlich aufwendiger.
2. Soll der erste echte Malauftrag des Beraters gleich über `fal_bild.mjs` laufen? Er schreibt dann die JSON-Liste in AUFTRAG.

## 2026-11-27 – U4 Teil 5 (Punkt 123): Sanitäter mit Trage, Versorgung, Fernsprech

Gepusht:
- Commit „U4 Teil 5“ (siehe `git log`)
- Abschluss-Commit mit index.html und diesem Bericht

**Stand:**
- **Hänger:** keine.
- **Tests:** Partietest „Konsole rot-frei, keine Fehler“, keine Seitenfehler bei den Aufnahmen.
- **sim:** kein Lauf, weil sich keine Regel geändert hat.

**Herunterladen und Sichern:**
- Alle 5 Bögen sind geladen (nach deiner Erlaubnis im Chat, zusammen 28,3 MB) und liegen in `ui-quelle/figuren/<fraktion>/`.
- **Sicherung:** robocopy nach OneDrive, Rückgabewert 1 (kopiert, kein Fehler).

**Abzeichen:**
- **Adler übermalt:** auf allen vier Helmen der Aschenwacht-Sanitäter (zwei Träger, der Kniende, der mit Tasche).
- **Kreuz übermalt:** das weiße Kreuz auf der Konkordat-Sanitätstasche.
- **Ohne Abzeichen:** Die Helme der Aschenwacht-Versorgung sind sauber.

**Schnitt:**
- Je Bogen 3 Teile, die Farbe ist an die Fraktion angeglichen, die Plastik-Karten sind neu.
- Beim Aschenwacht-Versorgungsbogen berührt die Werkzeugtasche den Kistenträger. Die Figuren werden dort über eine Naht getrennt.
- Die alten Bögen bleiben unverändert liegen.

**Im Spiel** (Tabelle `GRUPPE`, feste Plätze):
- **Feldscher und Aschenpfleger:**
  - Aufstellung: Trage-Gruppe hinten, Sanitäter mit sitzendem Verwundeten vorn, Sanitäter mit Tasche daneben.
  - Verluste: zuerst der mit Tasche, dann die kniende Gruppe, zuletzt die Trage.
  - Rückweg `window.SANI_TRAGE_ALT`.
- **Versorgung „Munition“:** links zwei Träger (Kiste auf der Schulter bzw. Gepäck, dazu der Kistenträger), rechts der Munitionskarren frei sichtbar.
- **Versorgung „Werkstatt“:** der kniende Schrauber bzw. Hämmerer und der Kistenträger, daneben die Werkzeugkiste.
- Rückweg für beide Versorgungstrupps `window.VERSORGUNG_NEU_ALT`.
- **Fernsprechtrupp (Konkordat):**
  - Der Telefonist kniet rechts hinten direkt vor dem Feldtelefon, sein Hörerkabel zeigt dorthin. Dazu kommen Kabelleger und Melder.
  - Die Regel kennt 4 Modelle, gemalt sind 3 Figuren. Der Kabelleger erscheint deshalb zweimal.
  - Rückweg `window.FERNSPRECH_NEU_ALT`.
- **Bilder:**
  - nachher: `entwurf/probe/u4/teil5/nachher/<typ>_voll.jpg` und `_verluste.jpg`, Übersicht `entwurf/probe/u4/teil5/nachher/uebersicht.jpg`
  - vorher: `entwurf/probe/u4/teil5/vorher/uebersicht.jpg`

**Hinweise:**
- **Keine Posen mehr:** Die neuen Gruppen zeigen keine der alten Posen (Heilen, Reparieren, Laufen), die alle noch im alten Look sind. Für Gefallene nimmt das Spiel weiter die alte Getroffen-Pose.
- **Modelle:** Die Sanitäter haben in der Regel 2 Modelle, gezeigt werden 3 Teile. Die Verluste fallen deshalb in Dritteln der Stärke.
- **Ohne neuen Bogen:** Ein Aschenwacht-Fernsprechtrupp hätte das alte Bild, es gibt keinen Bogen dafür.

**Fragen an Enrico:**
1. Sollen Sanitäter, Versorgung und Fernsprech noch Posen im neuen Look bekommen (Heilen, Reparieren, Laufen, Getroffen)? Dann müsste der Berater sie malen.

## 2026-11-27 – U4 Teil 4 (Punkt 122): Löwenoger-Posen

Gepusht:
- Commit mit den Posen (siehe `git log`, „U4 Teil 4“)
- Abschluss-Commit mit index.html und diesem Bericht

**Stand:**
- **Hänger:** keine.
- **Tests:** Partietest „Konsole rot-frei, keine Fehler“, keine Seitenfehler bei den Aufnahmen.
- **sim:** kein Lauf, weil sich keine Regel geändert hat.

**Ablauf:**
- **Herunterladen:** Die drei Posen sind geladen (nach deiner Erlaubnis im Chat, zusammen 17,3 MB) und liegen in `ui-quelle/figuren/konkordat/` als `konkordat_loewenoger_sprung/_hieb/_getroffen.png`.
- **Sicherung:** robocopy nach OneDrive, Rückgabewert 1 (kopiert, kein Fehler).
- **Schnitt:**
  - Jede Datei ist eine Einzelpose.
  - Beim Prankenhieb ist der gemalte Bewegungsbogen über vier Kästen gelöscht. Über den Krallenspitzen bleibt höchstens ein Hauch davon.
  - Die gemalten Blutspritzer beim Getroffenen fallen als lose Teile weg; das Blut auf der Schulter bleibt.
- **Größe:** Der Prankenhieb ist so hoch wie die Ruhepose, Sprung und Getroffen haben denselben Maßstab. Der Sprung war größer gemalt (Kopf etwa 1,25×) und ist entsprechend verkleinert. Danach habe ich alle drei um 10 % verkleinert, damit die Köpfe so groß sind wie in der Ruhepose.
- **Farbe** an das Konkordat angeglichen, Plastik-Karten neu.
- **Im Spiel (POSE_SETS):**
  - Nahkampf und Hieb: Prankenhieb
  - Sprungangriff: Sprung
  - Getroffen: Getroffen (diese Pose zeigen auch die Gefallenen)
  - Schießen bleibt Pose 2 des neu3-Bogens.
  - In Ruhe stehen weiter die drei Köpfe gemischt.
  - Rückweg `window.OGER_POSEN_NEU3_ALT`.
- **Bilder:** `entwurf/probe/u4/oger_posen/oger_3_<modelle|schiessen|nahkampf|sprung|getroffen>.jpg`, Übersicht `entwurf/probe/u4/oger_posen/uebersicht.jpg` (Werkzeug `N=3 MEHR=1 node tools/oger_probe.mjs entwurf/probe/u4/oger_posen`).

**Hinweis:** In einer Pose zeigen alle drei Oger dasselbe Bild. Beim Prankenhieb ragt der ausgestreckte Arm etwas übers Feld hinaus, das ist nur kurz zu sehen.

**Nicht gemacht:** gelaende.js nachladen (laut Auftrag später).

**Fragen an Enrico:** keine.

## 2026-11-27 – Figurenbilder nachladen statt einbetten (deine Wahl nach U4 Teil 3)

In AUFTRAG.md stand kein neuer Auftrag. Du hast im Chat „Figuren nachladen“ gewählt.

Gepusht:
- `e95eaa5`: Code und index.html
- Nachtrag mit diesem Bericht und dem Hinweis in CLAUDE.md

**Stand:**
- **Hänger:** keine.
- **Tests:** Partietest „Konsole rot-frei, keine Fehler“.
- **sim:** kein Lauf, weil sich keine Regel geändert hat.

**Was sich ändert:**
- **Neues Laden:** `src/figs.js` (17,7 MB) und `src/figsplastik.js` (5 MB) stecken nicht mehr in index.html. Das Spiel lädt sie beim Start nach, so wie seit dem 22.11. die Töne (`figurenNachladen` in ui.js).
- **Größe:** **index.html ist 29 MB statt 50,2 MB.** Die GitHub-Warnung über 50 MB ist damit weg.
- **Bis die Bilder da sind:** kurz die gezeichneten Figuren, wie bisher, wenn ein Bild fehlt. Danach leert das Spiel die Zwischenspeicher, damit Bilder und Bildwirkung richtig erscheinen. Der Geländeaufbau wartet auf die Plastik-Karten.
- **Geprüft:** übers Netz (Vorschau-Server) und direkt von der Festplatte (`file://`). Beide Male kommen alle 360 Figurenbilder und 465 Plastik-Karten an.
- **Kontrollbild:** `entwurf/probe/figuren_nachladen/oger_general.jpg`.
- **Rückweg:** `EINBETTEN_FIGUREN=1 python tools/build.py`. CLAUDE.md ist ergänzt.

**Für GitHub Pages:** Das Spiel braucht jetzt neben index.html auch `src/figs.js` und `src/figsplastik.js`, wie schon `src/sound.js`. Alle liegen in git, online läuft es also wie bisher.

**Möglich als Nächstes:** `src/gelaende.js` (18,8 MB) könnte genauso nachgeladen werden. index.html würde dann etwa 10 MB groß.

**Fragen an Enrico:** keine. Laut Plan ist der nächste Schritt U7 Moral. Davor kommt die Fable-Prüfung der Moral beim Berater.

## 2026-11-27 – U4 Teil 3 (Punkt 121): neue Bögen aus Punkt 90 im Spiel

Gepusht:
- `da6e1cd`: Bögen geladen, geschnitten und eingebettet
- `6a1c705`: Einbau ins Spiel
- Abschluss-Commit mit index.html und diesem Bericht

**Stand:**
- **Hänger:** keine.
- **Tests:** Partietest „Konsole rot-frei, keine Fehler“, keine Seitenfehler bei den Aufnahmen.
- **sim:** kein Lauf, weil sich keine Regel geändert hat. Die Zahl der Modelle bleibt gleich: Waffentrupps 3 Mann, Führung 3, Scharfschütze 2.

**Herunterladen und Sichern:**
- Alle 9 Bögen sind geladen (nach deiner Erlaubnis im Chat, je 2752×1536 px, zusammen 48,5 MB).
- **Ablage:**
  - `konkordat_*` in `ui-quelle/figuren/konkordat/`
  - `aschenwacht_*` in `ui-quelle/figuren/aschenwacht/`
  - `beiwerk_versorgung.png` direkt in `ui-quelle/figuren/` (gehört keiner Fraktion)
- **Sicherung:** robocopy nach OneDrive, Rückgabewert 1 (kopiert, kein Fehler). Die Bögen sind nicht in git, wie die übrigen Quellbögen.

**Abzeichen:**
- Zwei **Adler** übermalt (`ABZEICHEN`): vorn am Helm des Aschenwacht-Hauptmanns und an der Ärmelmanschette des Aschenwacht-Generals.
- Die Orden des Generals sind runde Scheiben, keine Kreuze. Brustwappen und Fahnen zeigen den Ritterhelm bzw. den Löwen.

**So erscheinen die neuen Trupps** (Tabelle `GRUPPE` in ui.js, jedes Teil hat einen festen Platz):
- **Waffentrupps:**
  - **MG** (Mahlwerk, Sensenwerk), nur aufgebaut: Waffe in der Feldmitte, der kniende Schütze an den Griffen, daneben der Lader mit Munitionskiste, hinten der Beobachter. Abgebaut bleibt das alte Marschbild.
  - **Panzerbüchse:** Gewehr auf dem Zweibein, Schütze liegend dahinter.
  - **Verluste:** Es fällt zuerst der Beobachter, dann der Lader, zuletzt der Schütze. Die Waffe fällt nie.
  - **Mündung:** Das Mündungsfeuer sitzt an der Waffe (neu gemessen).
  - Rückweg `window.WAFFENTRUPP_ALT`.
- **Führung** (Hauptmann und General beider Seiten): drei Einzelfiguren, Offizier vorn, Fahnenträger hinten links, Melder rechts.
  - Verluste: Melder, dann Fahnenträger, zuletzt der Offizier.
  - Nur der Offizier nimmt die Befehlsposen aus den bisherigen Posenbögen ein (alter Look).
  - Rückweg `window.FUEHRUNG_ALT`.
- **Scharfschütze** (Konkordat): Schütze liegend vorn, Beobachter mit Fernrohr dahinter (die Figur unten rechts im Bogen). Der Beobachter fällt zuerst. Rückweg `window.SCHARF_TRUPP_ALT`.
- **Beiwerk:** Munitionskarren beim Versorgungstrupp „Munition“, Werkzeugkiste bei „Werkstatt“, Feldtelefon mit Kabeltrommel beim Fernsprechtrupp.
  - Es steht neben dem Trupp und fällt nicht.
  - Beim Ziehen und im Graben wird es nicht gezeigt.
  - Rückweg `window.BEIWERK_ALT`.

**Bilder:**
- nachher: `entwurf/probe/u4/teil3/nachher/<typ>_voll.jpg` und `<typ>_verluste.jpg` (Stärke 4 von 10), Übersicht `entwurf/probe/u4/teil3/nachher/uebersicht.jpg`
- vorher: `entwurf/probe/u4/teil3/vorher/` (Übersicht dort)
- Werkzeug `node tools/u4_gruppen.mjs`

**Hinweise:**
- **Versorgungs- und Fernsprechtrupp:** Die Männer stammen noch aus den alten Bögen und stehen dicht hintereinander. Beim Fernsprechtrupp verdecken sie das Feldtelefon teilweise. Neue Bögen für diese Trupps würden helfen.
- **Pirschjäger (Aschenwacht):** In der Regel ist er ein Fachtrupp mit 4 Modellen, kein Schützen-Paar wie der Konkordat-Scharfschütze. Einen eigenen Trupp mit Beobachter braucht er deshalb nur, wenn du die Regel angleichen willst.
- **Panzerbüchse:** Nur die Aschenwacht hat einen Trupp-Bogen. Hat das Konkordat eine Panzerbüchse, bleibt dort das alte Bild.

**Noch offen:** Sanitäter mit Trage und Verwundetem (malt der Berater, Punkt 121.5).

**Fragen an Enrico:** keine.

## 2026-11-27 – U4 Teil 2 (Punkt 120): Sicherung, gemischte Löwenoger, übrige Bögen

Gepusht:
- `04c02d7`: Sicherung der Quellbögen
- `78dbacc`: Löwenoger gemischt
- `82b31b3`: übrige Bögen
- Abschluss-Commit mit index.html und diesem Bericht

**Stand:**
- **Hänger:** keine.
- **Tests:** Partietest „Konsole rot-frei, keine Fehler“, keine Seitenfehler bei den Aufnahmen.
- **sim und Regeltest:** nicht gelaufen, weil sich keine Regel geändert hat.

**1. Sicherung der Quellbögen (120.2):**
- **Lauf:** `robocopy` für `ui-quelle/figuren`, `ui-quelle/gelaende` und `ui-quelle/effekte` nach OneDrive. **Rückgabewert je 1**, also Dateien kopiert, kein Fehler.
- **Auch außerhalb von git lagen:** in `gelaende` die Ordner `neu_draht/`, `neu_hecke/`, `neu_poi/`; in `effekte` die Ordner `neu/` sowie `fx_faehigkeiten.png` und `fx_heldenfunken.png`. Deshalb habe ich alle drei gesichert.
- **CLAUDE.md:** Unter „Sicherung außerhalb von git“ stehen jetzt drei weitere Zeilen, eine je Ordner.

**2. Löwenoger gemischt (120.1b):**
- In Ruhe stehen jetzt die drei verschiedenen Figuren des neu3-Bogens: mit Gasmaske, mit ruhigem Kopf und brüllend.
- Beim Schießen und im Nahkampf wechseln sie in die Posen.
- **Bild:** `entwurf/probe/u4/oger_gemischt/oger_3_modelle.jpg`.

**3. Übrige abgenommene Bögen (120.3):**
- **Eingebaut über `ERSETZT`** (Spielnamen bleiben gleich):
  - Sanitäter Konkordat (Grund + Posen)
  - Flammen Konkordat und Aschenwacht (je Grund + Posen)
  - Gasschutz (Grund + Posen)
  - Panzerknechte
  - Konkordat-Reiter `neu2`
  - Ordensschreiter (Grundbogen, scharf)
- **Übermalungen:**
  - Panzerknechte (neu ohne Kreuze) und die Helmplaketten der Aschenwacht-Flammen-Posen brauchen keine Übermalung mehr. Die alten Pixelstellen trafen ohnehin nicht mehr.
  - Gasschutz neu ohne Glocken und Pistole.
  - Die Fahnen-Umfärbung der Aschenwacht läuft wie bisher.
  - Ich habe in den Bildern kein Kreuz, keinen Adler und keinen Totenkopf gefunden.
- **Trennung:**
  - Aschenwacht-Flammen (Grundbogen): Die Düse der ersten Pose berührt den Mantel der zweiten. Die Posen werden jetzt über eine Naht getrennt (`SPALTEN`).
  - Konkordat-Flammen-Posen: Die Düse der ersten Pose liegt vor dem Mantel der zweiten. Ein Vieleck gibt das Rohr ganz der ersten Pose. Die Stelle im Mantel der zweiten Pose wird mit der Mantelfarbe gefüllt. Dort sieht man einen kleinen, etwas glatteren Fleck (im Spiel etwa 10 Pixel).
- **Mündungen:** Für beide Flammen-Schusshaltungen neu gemessen. Gasschutz: Die Messung ergab dieselben Werte wie bisher.
- **Bilder:**
  - alt/neu je Bogen: `entwurf/probe/u4/boegen/*.jpg`
  - im Spiel je Einheit Ruhe und Schusspose: `entwurf/probe/u4/einheiten/*_ruhe.jpg`, `*_pose.jpg`, Übersicht `entwurf/probe/u4/einheiten/uebersicht.jpg` (Werkzeug `node tools/u4_einheiten.mjs`)
- **Hinweise:**
  - Bei den Panzerknechten endet ein Gewehr (dritte Pose) schon im gemalten Bogen am Bildrand. Das ist im Spiel kaum zu sehen.
  - Den Konkordat-Reiter-Bogen nutzt das Spiel derzeit nur über den Rückweg `REITER_ALT`. Der Stahlreiter hat seinen eigenen Bogen.
  - Der Ordensschreiter blickt in Ruhe nach links, in der Schusspose nach rechts. Das liegt an den Posen und war vorher genauso.

**4. Fehlende Bilder für den Berater (Punkt 90):**
- Sanitäter mit Trage und Verwundetem
- Beiwerk: Munitionskarren, Werkzeugkiste, Feldtelefon
- MG und Panzerbüchse als Waffe + 3 Mann
- Offiziere mit drei Figuren
- Scharfschütze mit Beobachter
- Löwenoger-Posen im neu3-Look (Sprung, Prankenhieb, Getroffen)

Der Einbau kommt in einem eigenen Paket, sobald die Bilder da sind.

**Fragen an Enrico:** keine.

## 2026-11-27 – Rest U4, erster Teil (Punkt 119): Mühle, Ordner je Fraktion, Löwenoger – Zwischenstand

Gepusht:
- `9d3a398`: eingestürzte Mühle (Punkt 118.0)
- `f6dc54f`: Ordner je Fraktion (Punkt 53)
- `59eb29f`: Löwenoger neu3
- Abschluss-Commit mit index.html und diesem Bericht

**Stand:**
- **Hänger:** keine.
- **Tests:** Partietest „Konsole rot-frei, keine Fehler“, Regeltest in Ordnung.
- **sim:** kein Lauf, weil sich keine Regel geändert hat (der Oger bleibt bei 3 Modellen).
- **Zwischenstand:** Der Rest von U4 war für einen `pa` zu groß. Die übrigen abgenommenen Bögen kommen im nächsten `pa` (Liste unten).

**1. Eingestürzte Mühle (118.0):**
- **Vorher:** Die Maske schnitt die eingestürzte Mühle senkrecht neben dem Turm ab. Dadurch fehlten die Balken, die oben rechts übers Feld ragen.
- **Jetzt:** Turm und Balken (rechts und die kurzen links) bleiben stehen. Beschnitten wird nur der gemalte Boden außerhalb des Felds. Das gilt für die Schlamm- und die Schneefassung (`MUEHLE_BALKEN`, Rückweg `window.MUEHLE_BALKEN_ALT`).
- **Bilder im Spiel:**
  - `entwurf/probe/st1c/kaputt/vorher/` und `…/nachher/muehle_kaputt_nah.jpg`, `muehle_kaputt_mittel.jpg` (Werkzeug `node tools/muehle_bilder.mjs`)
  - Masken: `entwurf/probe/st1c/maske_muehle_kaputt_119.jpg`, `maske_muehle_kaputt_schnee_119.jpg`
- **Rest:** Hinter den Balken rechts bleibt ein schmaler Streifen Boden mit stehen. Er ist kaum zu sehen.

**2. Antworten zu U3:** Die Leuchtspur bleibt bei 4 von 8 Schützen. Am Mündungsfeuer habe ich nichts geändert.

**3. Ordner je Fraktion (Punkt 53):**
- **Neue Ordner:** `ui-quelle/figuren/konkordat/`, `aschenwacht/`, `blaue_legion/` (vorher „Frankreich neu“).
- **Reskin-Bögen:** liegen jetzt in `<fraktion>/reskin/`. Gemeinsame Vorlagen (Gefallene, Kavallerie-Vorlagen) bleiben in `reskin/`, `fahle/` bleibt unberührt. Dateinamen sind gleich geblieben.
- **Werkzeug:** `figure_cut.py` findet die Bögen über `ordner(name)`. Die übrigen Werkzeuge lesen nur die geschnittenen Teile und brauchten keine Änderung. CLAUDE.md und MODELL_LISTE sind angepasst.
- **Prüfung:** Alle 145 Bögen habe ich vor und nach dem Umzug in einen Probeordner geschnitten. Alle **348 Teilbilder sind gleich** (Prüfsummen).
- **Bögen außerhalb von git:** 38 Quellbögen waren nie in git und sind es weiter nicht (191 MB, z. B. alle `*_neu*.png`, Klauenschreiter-Posen). Ich habe sie nur mit verschoben. Sie sind auch nicht in der OneDrive-Sicherung.
- **Gefunden:** Ein voller Lauf `figure_cut.py --game` ohne Namen bricht ab, weil die Bögen nach Namen sortiert werden und `aschenwacht_klauenschreiter_posen` dann vor dem Bogen kommt, den es als Maßstab braucht. Das war vorher schon so. Außerdem dauert das Einbetten aller Bilder über 8 Minuten.
- **Neue Werkzeuge:** `tools/figs_teil.py <schlüssel …>` und `figur_plastik.py --teil <schlüssel …>` ersetzen nur einzelne Einträge in figs.js bzw. figsplastik.js. Für unveränderte Bilder kommt dabei derselbe Eintrag heraus wie vorher.

**4. Löwenoger neu3 (Punkt 26):**
- **Einbau:** über `ERSETZT` (Spielname bleibt `konkordat_loewenoger`), Größe 1,25 SH statt 1,5, Farbe an das Konkordat angeglichen, Plastik-Karten neu.
- **Schnitt:** Der dunklere Pink-Hintergrund wird richtig erkannt. Die Schrotflinte der mittleren Pose ragt unter die Pranke der rechten Pose; ein fester Kasten (`KASTEN_POSE`) gibt sie jetzt ganz der mittleren Pose. An den Krallenspitzen der rechten Pose bleibt eine haarfeine Kante.
- **Posen:** Der alte Posenbogen (rote Rüstung, Stirnband) passt nicht mehr zum neuen Look. Das Spiel nimmt jetzt nur die drei neuen Posen: Ruhe, Schießen (auch kniend) und Nahkampf (auch Sprung). Ein Getroffen-Bild gibt es nicht; Gefallene erscheinen wie bei Trupps ohne Posen. Rückweg `window.OGER_POSEN_ALT`. Die Mündung der Schrotflinte ist neu eingetragen.
- **Probebilder 3 und 4 Modelle:** `entwurf/probe/u4/oger/oger_3_modelle.jpg`, `oger_4_modelle.jpg`, dazu je `_schiessen` und `_nahkampf` (Werkzeug `node tools/oger_probe.mjs`). Im Spiel bleiben es vorerst 3. Bei 4 stehen sie zu zweit hintereinander und decken sich gegenseitig stärker.

**Noch offen in U4 (nächster `pa`), abgenommene Bögen aus MODELL_LISTE:**
- Sanitäter Konkordat (Grund + Posen)
- Flammen beider Seiten (Grund + Posen, vier Bögen)
- Gasschutz (Grund + Posen)
- Panzerknechte
- Konkordat-Reiter (`neu2`)
- Ordensschreiter (Grundbogen)

Einige davon haben Übermalungen mit festen Pixelstellen (Abzeichen, leere Flächen). Die muss ich je Bogen neu setzen und prüfen.

**Punkt 90: Bilder, die fehlen** (für den Berater, nur nach Dateinamen in `ui-quelle/figuren/` gesucht):
- Feldscher und Aschenpfleger: zwei Träger **mit Trage und Verwundetem**. Der neue Sanitäterbogen hat nur eine Trage über der Schulter.
- Versorgungstrupps: Munitionskarren bzw. Werkzeugkiste als Beiwerk.
- Fernsprechtrupp: Feldtelefon als Beiwerk.
- 6er-Sturmtrupps als eigene Bögen mit mehr Posen (Grabenräumer, Sturmbrecher, Eingreiftrupp, Schwere Grabenwacht). Bisher zeigen sie 4 Posen, die sich als Klone wiederholen.
- Waffentrupps „Waffe + 3 Mann“: MG (Mahlwerk, Sensenwerk) und Panzerbüchse sind ein einziges Bild.
- Hauptmann und General mit drei Figuren (Offizier, Fahnenträger, Melder). Bisher ist es ein gemeinsames Bild.
- Scharfschütze mit Beobachter.
- **Löwenoger:** neuer Posenbogen im neu3-Look (Sprung, Prankenhieb, Getroffen).

**Fragen an Enrico:**
1. **Löwenoger: 3 oder 4 Modelle?** Bitte an den Probebildern entscheiden. Bei 4 würde ich die Aufstellung lockerer machen und mit sim messen.
2. Soll der Berater die Löwenoger-Posen im neuen Look malen, oder reichen die drei Posen?

## 2026-11-27 – U3 Teil 3 (Punkt 118.3): Helden-Effekte und Fesselballon – U3 damit fertig

Gepusht: `ac4c361` (mit index.html).
- **Hänger:** keine.
- **Tests:** Partietest „Konsole rot-frei, keine Fehler“, Regeltest in Ordnung.
- **sim:** kein Lauf, weil sich keine Regel geändert hat.

**Helden-Effekte mit Figurenfaktor** (`heldFak`, Rückweg `window.FIGFAK_ALT`):
- **Was mitwächst:** Glut aus dem Ofen der Roten Faust (Größe und Steighöhe), Dampfstoß aus der Faust, Funken beim Aura-Puls.
- **Rechnung:** Diese Effekte richten sich nach der Höhe des gezeichneten Heldenmodells, gemessen gegen 0,75 Feldradien (1,5 SH), für die sie gebaut wurden.
- **Ergebnis:** Gemessen sind beide Helden 85 bzw. 86 Weltpixel hoch, also 0,85 Feldradien. Die Effekte werden dadurch etwa 13 % größer, kaum zu sehen.
- **Wenn die Helden kleiner werden:** Wird das Modell später kleiner gemalt (Maßstab-Umstellung), schrumpfen diese Effekte mit.
- **Bleibt feldgroß:** Druckwellen und Ringe am Boden, Furcht-Ring und Aura-Schein am Boden. Sie wirken auf das Feld.

**Fesselballon:** Er rechnet seine Größe schon aus der Figurhöhe (`FIG_SH`), Ballon und Korb stehen im richtigen Verhältnis zur Winde. Ich habe nichts geändert.

**Bilder:** `entwurf/probe/u3/helden/faust_glut.jpg`, `durchbruch_2.jpg`, `ballon.jpg` (Werkzeug `node tools/u3_helden.mjs`).

**Damit ist U3 komplett** (Teil 1 `136f3cc`, Teil 2 `735cae4`, Teil 3 `ac4c361`). Nächster `pa`: Rest U4.

**Fragen an Enrico:** keine neuen. Die zwei Fragen aus Teil 2 gelten noch: Größe des Mündungsfeuers, Leuchtspur bei 4 oder 8 Schützen.

## 2026-11-27 – U3 figurennahe Effekte (Punkt 118 + Punkt 62), Teil 1 und 2

Gepusht:
- `136f3cc`: Teil 1, Effektbögen E1–E6
- `735cae4`: Teil 2, Figurenfaktor, Spritzer, Nahzoom; mit index.html

**Hänger:** keine. Partietest „Konsole rot-frei, keine Fehler“, Regeltest in Ordnung. Keine Regeländerung, deshalb kein sim-Lauf.

**Noch offen (Teil 3, nächster `pa`):** 118.3, die Helden-Effekte (Glut, Ringe, Dampf) mit Figurenfaktor und die Prüfung des Fesselballons. Index.html ist trotzdem schon drin, damit du heute Nachmittag den Stand spielen kannst.

### 118.5 / Punkt 62 – Effektbögen E1–E6
Freigestellt mit `tools/fx_cut.py`:
- neue Einträge in `CFG` mit Bedeutung je Variante
- liest seit diesem Paket auch `ui-quelle/effekte/neu/` (Option `quelle`)
- `rand` behält Teile am Bildrand
- Fehler behoben: Das Löschen alter Teile von `fx_gasschliere` nahm `fx_gasschliere_dick` mit.

Im Spiel (Rückweg je Effekt `window.E1_ALT` … `E6_ALT`):
- **E1 Gasgranate in der Luft:** dicke Gasfahnen sinken auf die Felder, daneben feine Fäden.
- **E2 großer Befehl:** Staubring am General, kleinere Ringe an bis zu 6 Einheiten. Leicht entsättigt, weil die Ringe rosa angehaucht waren.
- **E3 Gasschutz entgiftet:** 2–3 Dampfschwaden steigen aus den Figuren, dazu der Dunst aus F82.
- **E4 Löwenmaul:** Feuerstoß aus dem Maul, linker Bildrand an der Mündung. Ersetzt das alte Kanonenfeuer, nur beim Hauptschuss des Kreuzschreiters.
- **E5 Faustsalve:** Doppelblitz je Faust statt des alten Mündungsfeuers.
- **E6 Hinrichtung:** kalter Schnittbogen der Kettenklinge. Ohne Blut sind die Tropfen grau.

Testseite `entwurf/probe/effekte.html` ergänzt. Bilder vorher/nachher: `entwurf/probe/u3/vergleich_e1_gas_luft.jpg` … `vergleich_e6_hinrichtung.jpg`, Werkzeug `node tools/u3_bilder.mjs`.

### 118.1 – Mündungsfeuer je Figur
- **Größe:** Das Mündungsfeuer richtet sich nach der Figurhöhe (`figMul`, Rückweg `window.FIGFAK_ALT`). Gemessen ist ein Linien-Soldat etwa 0,5 Feldradien hoch, das Gewehrfeuer war bisher 0,73 Feldradien lang, also größer als der Mann. Jetzt ist es etwa 0,85 × Figurhöhe. Scharfschützen sind gleich angepasst.
- **Auswahl:** Jede Figur blitzt weiter genau einmal, wie in SP-2 gewünscht. Leuchtspur und Pulverdampf gibt es aber nur bei 4 von 8 Schützen, damit das Bild ruhiger bleibt.
- **Takt:** nicht geändert. Er ist seit SP-3 schon auf 8 Mann abgestimmt (voller Trupp etwa 1,4 s).

### 118.2 – Treffer-Spritzer an der fallenden Figur
- Fällt ein Mann, gibt es Spritzer und Bodenfleck an genau dieser Figur, und zwar im Moment des Treffer-Ereignisses (`figurSpritzer`, Rückweg `window.FIGURSPRITZ_ALT`). Die Größe richtet sich nach der Figurhöhe.
- Gepanzerte und Maschinen bekommen Funken statt Blut.
- Der bisher große Spritzer in der Truppmitte ist beim Fallen nur noch der kleine Treffer-Spritzer.
- Blut-Schalter und Bildwirkung gelten.

### 118.4 – Nahzoom und Klickflächen
- Die Kampfszene zoomt jetzt ×1,2 näher heran (Rückweg `window.NAHZOOM_ALT`).
- Klickflächen: `UBOX` ist je Einheit gut 1,5 Feldradien breit und hängt nicht an der Figurengröße. Kleine Figuren bleiben dadurch auf dem Board gut antippbar. Ich habe daran nichts geändert.

Bilder: `entwurf/probe/u3/vergleich_salve_figurenfaktor.jpg`, `vergleich_treffer_fallende_figur.jpg` (Werkzeug `node tools/u3_salve.mjs`).

**Fragen an Enrico:**
1. Passt die Größe der Gewehr-Mündungsfeuer, oder sind sie jetzt zu klein? Der Anteil in `figMul` ist einstellbar.
2. Sollen alle 8 Schützen eine Leuchtspur haben wie bisher, oder bleibt es bei 4?

## 2026-11-27 – ST1c (Punkt 117): Windmühle Grauwall

Gepusht (`9213cd9`, mit index.html). **Hänger:** keine. Partietest „Konsole rot-frei, keine Fehler“. Keine Regeländerung, daher kein sim-Lauf.

**Ursache:** Das Mühlenbild wird 3,6 Feldradien breit gezeichnet (2,4 × MUEHLE_GROSS 1,5), das Feld ist nur gut 2 breit. Der **gemalte Bodenfleck** (Schlamm mit Trichtern und Steinen, Rautenform) lag deshalb unten über den Drahtgürteln links und rechts und über den Nachbarfeldern.

**Änderung** (`src/gelaende_bau.js`, `muehleMaske`, Rückweg `window.MUEHLE_RAND_ALT`):
- Das Bild wird einmal mit einer weichen Maske beschnitten. Unten bleibt nur eine Ellipse um die Feldmitte (Halbachsen 0,95 R und 0,57 R, wie das gekippte Feld).
- Turm, Dach und Flügel bleiben ganz und ragen weiter nach oben. Der Boden neben dem Turm fällt weg.
- Größe und Fußpunkt der Mühle bleiben gleich.
- Für den Einsturz-Zustand und die Schnee-Fassungen gilt dieselbe Maske. Auf Krähenfurt steht keine Mühle.
- Kirche unverändert (Punkt 117.2).

**Bilder:**
- vorher: `entwurf/probe/st1c/vorher/muehle_nah.jpg`, `muehle_mittel.jpg`
- nachher: `entwurf/probe/st1c/nachher/muehle_nah.jpg`, `muehle_mittel.jpg`
- Masken an den anderen Fassungen, außerhalb des Spiels gerechnet: `entwurf/probe/st1c/maske_muehle_kaputt.jpg`, `maske_muehle_heil_schnee.jpg`, `maske_muehle_kaputt_schnee.jpg`
- Die eingestürzte Mühle habe ich im Spiel nicht aufgenommen.

**Fragen an Enrico:**
1. Passt der Boden um die Mühle so, oder soll der Fleck noch kleiner bzw. größer sein? Einstellbar über `MUEHLE_RX`/`MUEHLE_RY`.
2. Bei der eingestürzten Mühle schneidet die Maske die Balken rechts oben ab, die über das Feld hinausragen. Falls das stört, kann ich dort mehr stehen lassen.

Nächster `pa`: Paket U3.

## 2026-11-27 – ST1b (Punkt 116) (`0d6dc86` mit index.html)

Gepusht.
- **Hänger:** keine. Partietest ohne Fehler, Regeltest ok.
- **sim:** alle Läufe nacheinander, kein Absturz.

**3. Sankt Ruß 51 → 40 %: Ursache gefunden und ausgeglichen.**

Gleiche Messung (`MISCHEN=1`, 100 Schlachten, Sankt Ruß, Siegquote Konkordat) auf den Ständen seit R4d:

| Stand | Konkordat |
|---|---|
| R4d `52046c7` | 51 % |
| V1 `8cedd29` | 51 % |
| V3 `4ee7443` | 51 % |
| 114 `763dcf7` | 51 % |
| ST1-Regeln `7a5e728` | **40 %** |

Innerhalb von ST1:

| Variante | Konkordat |
|---|---|
| alte Sperre + Ballon als Gerät (= vorher) | 51 % |
| alte Sperre + Ballon als Unterstützung | 39 % |
| Aufschlag + Ballon als Gerät | 22 % |
| Aufschlag + Ballon als Unterstützung (ST1) | 40 % |
| dazu ohne Lage-Kauf „Aufklärung“ | 45 % |
| dazu Kartenschalter `ohneBallon` | 43 % |
| **dazu 3 statt 2 Mahlwerke (200 Schlachten)** | **49 %** |

- **Ursache:** Mit „Ballon = Gerät“ und der alten Obergrenze 3 konnte die Konkordat-KI auf Sankt Ruß keinen Ballon nachkaufen, weil schon 3 Geräte standen, und kaufte stattdessen Linie. Seit der Ballon Unterstützung ist (bzw. Gerät ohne Grenze), kauft sie Ballone („Artillerie ohne Beobachter“), und die nützen dort nichts.
- Der Aufschlag selbst und „sehr selten“ ändern die Quote nicht.
- Nebenbei behoben: „sehr selten“ lief durch die Linien-Prüfung (Helden/Stufe 3 konnten gesperrt werden); jetzt wie „selten“.
- **Ausgleich (ohne Grundregel):**
  - Sankt Ruß `MAP.ki.A.ohneBallon` (die Konkordat-KI kauft dort keine Ballone, weder über die Wunschliste noch über den Lage-Kauf).
  - Kartenarmee Konkordat 3 statt 2 Mahlwerke.
  - Ergebnis **49 %** (200 Schlachten). Grauwall 50 %, Krähenfurt 54 % unverändert.

**2. Schwebende Kisten:**
- Die Kram-Teile in den Grabendurchgängen hatten keinen Bodenkontakt; die Spanischen Reiter hatten früher dasselbe Problem (Punkt 79.3).
- Jetzt bekommen sie wie diese einen Kontaktschatten und sinken leicht ein (`boden`). Außerhalb des eingegrabenen Grabens stehen sie mittiger (Versatz 0,3 → 0,12).
- Rückweg `KRAM_ALT`.
- **Nicht im Bild geprüft:** Im Vorschaufenster sind die Kisten zu klein. Bitte beim Spielen schauen, ob noch eine schwebt.

**1. Kirche überlappt: nicht gefunden.**
- Nahaufnahmen: `entwurf/probe/st1b/kirche_nah.jpg`, `kirche_mittel.jpg`, `kirche_turm.jpg`.
- Darin sehe ich keine eindeutige Überlappung; Schiff, Wände und Turm stehen in ihren Feldern, die Tiefenfolge gegen Brunnen, Bildstock und Häuser stimmt.

**4.** Der Aufschlag von +25 % bleibt.

**Fragen an Enrico:**
1. Kannst du die Kirchen-Stelle in einem der Bilder markieren oder ein Bildschirmfoto in `entwurf/postfach/` legen?
2. Schwebt nach dem Bodenkontakt noch eine Kiste? Wenn ja, wo?
## 2026-11-27 – Paket ST1 Spieltest-Funde (Punkt 115) (`7a5e728`, `271cf47` mit index.html)

Gepusht.
- **Hänger:** keine. Partietest ohne Fehler, Regeltest ok.
- **sim:** 8 Läufe nacheinander, kein Absturz.
- Der Vorschau-Server war nach dem Herunterfahren aus; er ist neu gestartet.

**9. Neuer Panzer = Sturmpanzer:**
- Neu geschnitten (Turmschütze im neuen Look), als Bild des Sturmpanzers (`aschenwacht_panzer`).
- Mündungen neu gemessen: Bugkanone (0,94 | 0,41), Turm-MG als Zweitwaffe (0,70 | 0,10).
- Der rot-weiße Streifen bleibt (die alte feste Umfärbe-Fläche ist dafür entfernt). `aschenwacht_koloss` ist wieder raus.
- Bild im Spiel: `entwurf/probe/st1/sturmpz_nachher.jpg` (vorher: `sturmpz_vorher.jpg`).

**3. Seltenheits-Aufschlag statt Sperre:**
- Keine Obergrenze mehr für Elite und Gerät. Jede weitere Einheit derselben Kategorie, die gleichzeitig auf dem Feld steht, kostet +25 % (`P.KAT_AUFSCHLAG`). Gefallene zählen nicht.
- Gilt in Nachschub und Armee-Auswahl. Die Karte zeigt den Preis mit „+25 %“ bzw. „+50 %“, mit Erklärung beim Darüberfahren.
- Die Rückgrat-Regel (Unterstützung) bleibt.
- **Budget:** Kartenarmee mit Aufschlag plus Elite-Abschlag, damit die Standardarmee wie bisher passt (Grauwall jetzt 1005/940).
- Rückweg `KAT_SPERRE_ALT`. Die KI kauft nach Preis.
- **Messung** (`MISCHEN=1`, je 100 Schlachten), Konkordat Sperre → Aufschlag: Grauwall 49 → 50 %, Sankt Ruß 39 → 40 %, Krähenfurt 49 → 54 %. Die Regel selbst verschiebt also kaum etwas.
- **Auffällig:** Sankt Ruß liegt in **beiden** Fassungen bei 39–40 %, nach R4d waren es 51 %. Am Ballon liegt es nicht: als Gerät gemessen fällt Sankt Ruß sogar auf 22 %. Die Ursache habe ich noch nicht gefunden (Kandidaten: Kategorie „sehr selten“, Preise im Nachkauf). Ich schaue im nächsten `pa` nach, wenn du willst.

**4. Kategorie „Sehr selten“:** Helden und Stufe-3-Schreiter, eigenes Schild (violett). Je Einheit weiter höchstens eine.

**5. Fesselballon:** jetzt Unterstützung.

**6. Mehr Blut:**
- Jeder Treffer an Fußtruppen und Reitern (Gewehr, MG, Splitter, jeder Nahkampfschlag) zeigt einen kleinen Spritzer.
- Fällt dabei ein Mann, gibt es einen größeren Spritzer und einen Blutfleck am Boden.
- Gepanzerte (Kampfanzüge, Stahlreiter) und Fahrzeuge/Geschütze zeigen Funken.
- Abschaltbar über den Blut-Schalter, Rückweg `TREFFERBLUT_ALT`.
- Bilder dazu habe ich nicht gemacht. Beim nächsten Spiel siehst du es sofort.

**7. Feldsymbole:** Obergrenze 220 → 140 px Feldgröße; nah herangezoomt bleiben sie jetzt etwa so groß wie bei Zoom 1. Keine Bilder gemacht.

**1. Kirche überlappt / 2. schwebende Kisten: noch nicht gelöst.**
- Auf der Übersicht von Sankt Ruß konnte ich beides nicht eindeutig finden.
- Die Kisten stehen in den Grabendurchgängen mit seitlichem Versatz; ich vermute, dass sie in engen Durchgängen über die Sohle hinausragen. Ohne die Stelle wollte ich nicht raten.

**Fragen an Enrico:**
1. Wo genau hast du die schwebenden Kisten und die überlappende Kirche gesehen (Karte, Feld oder ein Bildschirmfoto)?
2. Soll ich dem Rückgang von Sankt Ruß (51 → 40 %) nachgehen?
3. Passt der Aufschlag von +25 % je weitere Elite/Gerät, oder lieber anders gestaffelt?
## 2026-11-27 – Nachtrag 114 (alte Stimmen raus) und U4a (neue Figuren) (`763dcf7`, `38e3f8f` mit index.html)

Gepusht.
- **Hänger:** keine.
- **Tests:**
  - Partietest ohne Fehler.
  - Ton-Pult-Test 93/93.
  - `test_tonplaetze`: Spiel = Pult.
- Kein sim nötig (keine Regeländerung).
- **Danach fährt der PC herunter** (Enricos Wunsch).

### 114 – alte Stimmen raus
- **Woher der alte Sanitäter-Ruf kam:** aus **Pult-Wahlen**. Bei Drahtpionieren, Bannerträger, Panzerbüchse und Sturmbrecher stand die Zeile „Schwer getroffen“ (`pain`) fest auf dem alten Ton `medic_3` („Sanitäter!“).
  - Meine Stummschaltung griff nur beim Platz `medic`, nicht bei einer Wahl auf einem anderen Platz.
  - Beim Konkordat gab es so eine Wahl nicht.
  - Ebenso standen viele „Aufgerieben“-Zeilen auf den alten Sterberufen `sterben_gruppe_*`.
  - Alle diese Wahlen fallen jetzt weg, weil die alten Töne entfernt sind. Keine Pult-Wahl zeigt mehr auf eine alte Stimme (geprüft).
- **Entfernt aus `src/sound.js` / `sound_pult.js`:**
  - Suno-Anklicken (`sv_*`), alte Rufe (`ruf_feuer`, `panik_*`, `sterben_*`), Schreiter `sst_*`, Helden `hst_*`.
  - `medic`, `panic`, `forward`, `stand`, `roar`, `charge`, `comeon` samt Filterfassungen.
  - Spieltöne 46 → 37 MB.
  - Die Quelldateien in `sound-quelle/` bleiben liegen.
- **Kampfschrei, Schmerzlaute, Husten, Atmen bleiben.**
- **Code:**
  - Rückweg `STIMMEN_ALT` und die alten Rufwege (Truppen-, Schreiter-, Heldenrufe, alte Anwahl) sind ausgebaut.
  - Die direkten Aufrufe bei Flucht, Melder, Befehl, Gegenstoß und Sturmlauf sind raus.
  - `stimmfilter.py` rechnet die alten Rufe nicht mehr.
  - `sound_bau` lässt ganz entfernte Plätze weg und kennt `dropKeys`.
- **Pult-Test:** vier Prüfungen, die ausdrücklich an den alten Suno-, Schreiter- und Sprechergruppen-Tönen hingen, sind mit Begründung ausgesetzt.
  - `tools/test_ton.mjs` ruft noch die alten Funktionen `ruf`/`schreiterRuf`/`heldRuf` auf. Den Test müsste man bei Gelegenheit auf `stimme()` umschreiben; er gehört nicht zur Paketprüfung.

### U4a – neue Figuren
- **Linie beider Seiten** (Kohorte, Aschengrenadiere, Punkt 92): neue Grund- und Posenbögen unter den alten Namen (figure_cut `ERSETZT`).
  - Rosa Säume weg (`ENTROSA`). Den Wappen-Rest unter dem Arm (Aschenwacht, oben rechts) habe ich übermalt.
  - Klone für 8 Figuren wie bisher.
- **Schwere Grabenwacht:** jetzt der neue Bogen mit Kürassierhelm und Stahlmaske. Die Ruhe zeigt die neue Pose „Schilde geschlossen“, vorher das alte Grundbild.
- **Sturmbrecher:** war schon die Kürassierhelm-Fassung (geprüft).
- **Grabenräumer:** die vierte Figur ist die dritte Getroffen-Fassung. Getroffen wählt jetzt zufällig aus drei.
- **Neuer Panzer** `aschenwacht_panzer_neu.png`: geschnitten als `aschenwacht_koloss`. **Aber:** Die Aschenwacht hat im Spiel keinen Landkoloss, `koloss` ist nur Konkordat. Das Bild ist deshalb derzeit nirgends zu sehen.
- **Bilder:**
  - Figuren alt/neu: `entwurf/probe/u4a_vorher_nachher.jpg`.
  - Im Spiel: `entwurf/probe/u4a/kohorte_nachher.jpg` und `grenadier_nachher.jpg` (Feld und Graben).
  - Die Grabenwacht steht in keiner Kartenarmee, deshalb gibt es von ihr kein Spielbild.

**Fragen an Enrico:**
1. Der neue Aschenwacht-Panzer: Soll er den **Sturmpanzer** (`sturmpz`, Bild `aschenwacht_panzer`) ersetzen? Oder soll die Aschenwacht einen eigenen Landkoloss bekommen?
2. Am neuen Panzer ist vorn ein rot-weißer Streifen. Ist das so gemalt, oder soll er weg?
## 2026-11-26 – V3 Teil 2: neue Stimmen im Spiel (Punkt 112) (`4e8d8d0`, `c7d733e`, `4ee7443` mit index.html)

Gepusht. **Die neuen Stimmen klingen jetzt im Spiel**, die alten Sprüche sind still.
- **Hänger:** keine.
- **Tests:**
  - Partietest ohne Konsolenfehler.
  - Ton-Pult-Test 93/93.
  - `test_tonplaetze`: Spiel = Pult für alle 50 Einheiten.
- **Ton-Spur:** alle Einheiten neu, in vier Teilen zu je 5–6 Minuten nacheinander, kein Absturz.
- **Vorschau:** zum Prüfen kurz offen, dann geschlossen.

**1. Heldensprüche:**
- 30 neu geladen (`A_held_kuerass_*`, `K_held_faust_getroffen_1/2`). Die alten Fassungen liegen aufgehoben in `sound-quelle/Voices/eigene/el/alt_vor_nach1/`.
- Gefiltert (`helm`), gesichert (robocopy Code 1).
- Längenprüfung wiederholt: **jetzt unauffällig** („Der Kürassier hört.“ 1,68 s, „Hit.“ 0,39 s). Nur „Sprich.“ ist mit 0,84 s etwas gedehnt, klingt aber nach einem Wort.

**4./6. Einbau:**
- **Tonplätze:** `st_<gruppe>_<anlass>` (155 Plätze, 641 Sprüche, Seite A/D = Sprache).
  - `st_erscheinen_<typ>`, `st_held_faust_*` / `st_held_kuerass_*`.
  - Hünen `st_huenen_*` (ihre Sturm-Zeilen mit Maschinenfilter). Der Löwenoger brüllt nur.
- **Spielcode** (ui.js `stimme()` / `stimmeBeiEreignis`): löst Anklick-Sprüche, alte Truppenrufe, Schreiter- und Heldenstimmen ab.
  - Still sind die alten gesprochenen Rufe: Sanitäter `medic`, Panik `panic`, `forward`, `stand`, Brüllen `roar` bei Befehlen, `charge`, `comeon`.
  - Kampfschrei (`cry`), Schmerzlaute, Husten und Atmen bleiben (keine Worte).
- **Abstände:**
  - Höchstens ein Ruf zugleich.
  - Je Einheit und Anlass höchstens alle 7 s, je Einheit mindestens 2,5 s Pause.
  - **Not-Rufe** (verwundet, Rückzug, Panik, Tod) haben Vorrang und dürfen über einen laufenden Ruf.
- **Anwählen:** wie bisher; nie zweimal hintereinander derselbe Spruch, Motor bzw. Pferd darunter.
- **„Befehl bestätigt“:** bei eigenen Zügen jedes zweite Mal, die KI selten (30 % bei längeren Zügen).
- **Neue Abspielstellen:**
  - Erscheinen (Nachschub; beim Schlachtbeginn der eigene General).
  - Zielfeld genommen.
  - Schilde vor, Gegenstoß, Dauerfeuer.
  - Panzer getroffen und Panne/festgefahren.
  - Koloss gesichtet / Entsetzen.
  - Anführer-Befehle (Sammeln, Feuer frei, Sturm), großer Befehl, Banner.
- Die Schreiter sagen „Feind gesichtet“, wenn ein Feindgerät bis 6 Felder nah ist (höchstens alle 30 s).
- **Rückweg:** `window.STIMMEN_ALT = true` vor dem Laden (alles wie vorher). Für das Pult `STIMMEN_ALT=1 node tools/tonpult_bau.mjs`. Alte Dateien bleiben liegen.

**Ton-Pult:**
- Die Stimmzeilen je Einheit kommen jetzt aus der gemessenen Ton-Spur (`st_*`), unter „Anwählen“ bzw. „Rufe (Stimmen)“.
- Die alten Tabs „Stimmen Konkordat/Aschenwacht“, „Schreiter“ und „Held …“ sowie die Spruch-, Sanitäter- und Panikzeilen sind weg.
- Bibliothek: neue Rubrik **„Neue Stimmen (V3, Schlachtfunk)“**, nach Gruppen, mit der Hörprobe.
- 69 alte Pult-Wahlen greifen dadurch nicht mehr:
  - 22 Anklick-Sprüche, 19 Sanitäter-, 10 Panik-, 4 Befehls-, 2 Sammeln-Rufe, 1 Sturmlauf-Ruf.
  - Dazu 11 alte Reste ohne Bezug zu diesem Paket (gestrichene Einheiten, Einheiten ohne Schuss).

**Nebenbei behoben:**
- Das Pult rechnete noch mit dem gestrichenen Stahlgänger als gepanzertem Ziel (Zeile „Abpraller“ bei 14 Aschenwacht-Einheiten). Jetzt zählen nur kaufbare Gegner ohne Helden.
- Die Ordensschreiter-Zeile „Streifschuss“ hängt jetzt an der Spur.
- Der Spezialangriff der Helden (Durchbruch/Hinrichtung) bekam zuerst keinen Ruf; ist ergänzt.

**In den Spur-Szenen nicht ausgelöst** (der Code ist da, die Testszenen spielen es nicht durch):
- Sammeln (Moral zurück), Zielfeld genommen, Koloss gesichtet (Linie).
- „Feind gesichtet“ (Schreiter), Gegner vernichtet (Helden).
- Dauerfeuer/Gegenstoß/Granate der Hünen.
- Im Spiel sollten sie kommen. Bitte beim Spielen darauf achten.

**Größe:** Die Spieltöne wachsen von 31 auf 46 MB (die alten Stimmen bleiben für den Rückweg drin). Sie werden nach dem Start nachgeladen.

**Fragen an Enrico:**
1. Wie wirkt das im Spiel: zu häufig, zu selten, zu laut?
   - Stellschrauben: Abstand je Einheit (2,5 s), je Anlass (7 s), „Befehl bestätigt“ jedes zweite Mal, Lautstärke 0,5.
2. Sollen die alten Stimmdateien später ganz aus `sound.js` (spart etwa 10 MB) und der Rückweg `STIMMEN_ALT` wegfallen, sobald die neuen passen?
3. Fehlt dir eine Stelle, an der jemand etwas sagen sollte?
## 2026-11-26 – V3 Teil 1: Stimmen geladen, geprüft, gefiltert, Hörprobe (Punkt 111) (`44f4ee9`)

Gepusht. **Zwischenstand nach Sparregel 5:** Schritte 1–4 und 7 sind erledigt; der Einbau ins Spiel (Schritte 5, 6 und 8) ist der nächste `pa`. Grund: über 600 Sprüche mit neuen Tonplätzen und Abspielstellen sind ein eigener großer Brocken, und du wolltest den Filter vorher hören.
- **Hänger:** keine.
- **Vorschau:** Tonprobe kurz offen, dann geschlossen.
- **sim:** keine Läufe nötig.

**1. Herunterladen:**
- Alle **608 Dateien** liegen in `sound-quelle/Voices/eigene/el/konkordat|aschenwacht/<id>.mp3`: 300 Konkordat, 308 Aschenwacht, 17 MB, kein Fehler.
- Zweimal per robocopy nach OneDrive gesichert (Code 1 = Dateien kopiert).

**2. Prüfung Datei gegen Text:**
- **Kein Spracherkenner installiert** (whisper, ffmpeg fehlen). Nachinstallieren wäre ein großer Download; das habe ich nicht gemacht.
- **Stattdessen:** reine Sprechdauer (Stille abgeschnitten) gegen die Silbenzahl des Texts. Fast alles passt.
- **Auffällig, bitte vom Berater prüfen bzw. neu erzeugen:**
  - Sprache **zu kurz** für den Text:
    - `A_held_kuerass_auswahl_2` „Der Kürassier hört.“ (0,51 s)
    - `K_held_faust_getroffen_2` „Barely felt it.“ (0,36 s)
    - `A_held_kuerass_gegner_erledigt_1` „Einer weniger.“ (0,70 s)
  - Sprache **zu lang** für ein Wort, vermutlich vertauscht:
    - `A_held_kuerass_auswahl_1` „Sprich.“ (1,59 s)
    - `A_held_kuerass_getroffen_3` „Nichts.“ (1,45 s)
    - `A_held_kuerass_angriff_1` „Fallt.“ (1,28 s)
    - `A_held_kuerass_angriff_3` „Ende.“ (1,63 s)
    - `A_held_kuerass_auswahl_3` „Wen?“ (0,95 s)
    - `K_held_faust_getroffen_1` „Hit.“ (1,06 s)
  - Das Muster spricht dafür, dass beim **Kürassier** mehrere Zeilen vertauscht sind (auswahl_1 ↔ auswahl_2 passt fast genau). Die übrigen 590 Zeilen sind unauffällig.
  - Lang, aber wohl nur gerufen: `A_fuehrer_befehl_sturm_2` / `A_fuehrer_angriff_2` „Angriff!“ (2,2 / 1,8 s).
- Hören kannst du sie in der Tonprobe (Gruppe „Neue Stimmen V3“, Helm) bzw. direkt im Ordner.

**3. Textänderung:** `K_held_faust_angriff_3` = „Push forward.“ in `tools/stimmen_plan.py` und in der CSV.

**4. Filter (`tools/schlachtfunk.py`, Kette aus 109.5):**
- `funk`: Tonhöhe ×0,86, Hochpass 260 Hz, Low-Shelf +4 dB, Glocke 1100 Hz +7 dB, tanh 5,5, Tiefpass 2900 Hz, Kompressor −28 dB 8:1, Kamm 6 ms, Funkrauschen + Klick.
- `bordfunk`: wie funk, Rauschen 7 dB lauter.
- `maschine`: Maschine wie `_mr`, darüber leichter Schlachtfunk.
- `helm`: Kamm halb so stark, dazu hohle Helmresonanz (650 Hz, kurzer 1,6-ms-Kamm).
- **Alle Dateien:** Ruhe vorn und hinten weg, Lautstärke angeglichen (RMS −17 dB).
- **Ergebnis:** 641 gefilterte Dateien in `sound-quelle/Voices/eigene/el/filter/` (608 + 33 Maschinen-Fassungen `A_sturm_*_mx` für die Hünen).
- Neu: `tools/el_wav.mjs` dekodiert die MP3s im stummen Chrome.

**7. Hörprobe:** `tonprobe.html`, ganz oben die Gruppe **„Neue Stimmen V3“**:
- Je Sprecher (K1–K5, A1–A5) 6 Sprüche: Anwählen, Befehl, Angriff, Rückzug, verwundet, Erscheinen. Jeweils **mit Schlachtfunk und roh**.
- Dazu Bordfunk, Maschine (Schreiter), Helm (Helden) und die Hünen mit Maschinenfilter.
- Online nach dem Push über GitHub Pages.

**Nebenbei:**
- `ton_teilen.mjs` hängte bei jedem Lauf eine Kopfzeile an `src/sound.js` an (stand 23-mal drin). Behoben, sie steht jetzt einmal.
- Der Pferde-Angriffsruf `stahlreiter_wiehern1` liegt jetzt richtig in den Spieltönen (vorher nur im Pult).

**Fragen an Enrico:**
1. **Filter nach dem Hören:** passt so, oder stärker/schwächer? Mögliche Stellschrauben: tiefer (×0,86), Rauschen, metallischer Kamm, Sättigung, Helmklang.
2. Die Kürassier-Zeilen (und `K_held_faust_getroffen_1/2`) vom Berater neu erzeugen lassen?
3. Danach Teil 2 (Einbau): alle alten Sprüche raus (Rückweg `STIMMEN_ALT`), neue Abspielstellen wie im Plan. Einverstanden, dass „Befehl bestätigt“ nur etwa jedes zweite Ziehen ruft und Anwählen wie heute über den Beutel ohne Wiederholung läuft?
## 2026-11-26 – V1c Helden, Schreiter, Hünen in den Stimmen-Plan (Punkt 110) (`1704fb4`)

Gepusht. Nur Text, nichts gebaut. Keine Browser- oder sim-Läufe, keine Hänger.

- **Die bestehenden 552 Zeilen sind unverändert.** Geprüft gegen den vorigen Stand: gleiche Reihenfolge, ids, Texte, Sprecher und `ton`. Neu ist nur die Spalte `filter` (zwischen `ton` und `text`).
- **Spalte `filter`:**
  - `funk` 424 Zeilen
  - `bordfunk` 66 (Panzer/Kolosse)
  - `maschine` 62 (Schreiter und Erscheinen der Hünen)
  - `helm` 56 (Helden)
- **Eiserne Hünen:** Sie sprechen die Sturm-Zeilen von A3 Bill (`A_sturm_*`, auch „Dauerfeuer!“). Weil Sturmbrecher, Grabenwacht und Panzerknechte dieselben Zeilen nutzen, stehen diese auf `funk`; den Maschinenfilter für die Hünen setzt V3 je Einheit.
- **Löwenoger:** nur Brüllen, keine Zeilen.
- **Schreiter:** Die Zeilen gab es schon (`K_schreiter_*` K5 Bill, `A_schreiter_*` A5 Liam), jetzt mit Filter `maschine`. Die Zuordnung zu den heutigen `sst_*`-Plätzen steht im Plan. Keine neuen Zeilen nötig.
- **Helden, 56 neue Zeilen angehängt:**
  - Je Held die Anlässe wie heute in `HELD_ST`: auswahl 4, bewegen 4, angriff 3, spezial 3 (Durchbruch bzw. Hinrichtung), getroffen 3, gegner_erledigt 3, schwer_verwundet 3 (`ruf`), tod 3, erscheinen 2.
  - Rote Faust Englisch (K5 Bill), Kürassier Deutsch (A5 Liam), Filter `helm`.
  - Zeichen: Rote Faust 357, Kürassier 327, **neu zusammen 684 Zeichen (≈ 0,07 $)**. Gesamt jetzt 608 Zeilen, 8514 Zeichen.
- **Neue ids** (je Anlass fortlaufend `_1` … `_n`):
  - `K_held_faust_auswahl_1–4`, `_bewegen_1–4`, `_angriff_1–3`, `_spezial_1–3`, `_getroffen_1–3`, `_gegner_erledigt_1–3`, `_schwer_verwundet_1–3`, `_tod_1–3`, `_erscheinen_1–2`
  - `A_held_kuerass_auswahl_1–4`, `_bewegen_1–4`, `_angriff_1–3`, `_spezial_1–3`, `_getroffen_1–3`, `_gegner_erledigt_1–3`, `_schwer_verwundet_1–3`, `_tod_1–3`, `_erscheinen_1–2`
- **Beispiele:**
  - Rote Faust: „Point me at them.“ · „Breaking through!“ · „Plating holds.“ · „Hold… without me…“
  - Kürassier: „Der Kürassier hört.“ · „Es endet hier.“ · „Rüstung hält.“ · „Weicht oder fallt.“

**Fragen an Enrico:** keine. V3 wartet auf `entwurf/postfach/stimmen_urls.csv` vom Berater.
## 2026-11-26 – V1b Stimmen-Plan nach der Hörprobe (Punkt 109) (`2c7bf3e`)

Gepusht. Nur Text, nichts gebaut, keine Browser- oder sim-Läufe. Keine Hänger.

- **`entwurf/STIMMEN_PLAN.md` neu:**
  - Alle alten Sprüche werden ersetzt.
  - Konkordat Englisch (auch Blaue Legion), Aschenwacht Deutsch.
  - **5 Sprecher je Seite** über die K1-Kategorien:
    - Konkordat: K1 Brian, K2 Daniel, K3 Callum, K4 George, K5 Bill.
    - Aschenwacht: A1 Charlie, A2 Callum, A3 Bill (schroff), A4 Will, A5 Liam.
  - Eigene Tabelle Einheit (TYPES-Schlüssel) → Sprecher.
  - Anlass-Tabelle (heute / Abspielstelle / ruhig oder ruf).
  - Filter „Schlachtfunk“ mit der ganzen Kette festgehalten (gebaut wird er in V3).
  - Vorschlag für Helden (K5/A5 mit Helm-Filter) und Schreiter (K5/A5 plus Maschinenfilter, je Seite eigene Texte).
- **`entwurf/stimmen_texte.csv`:**
  - 552 Zeilen, Spalten `id; fraktion; sprecher; anlass; einheit; ton; text`.
  - Konkordat-Texte jetzt Englisch, Aschenwacht-Texte bleiben. Neu: eine Unterstützungs-Gruppe je Seite mit eigenen Rufen.
  - Erzeugt mit `python tools/stimmen_plan.py` (`--md` druckt die Tabellen).

**Zeilen je Sprecher und Zeichen (Kosten auf fal, ca. 0,10 $ je 1000 Zeichen):**

| Sprecher | Zeilen | davon ruf | Zeichen |
|---|---|---|---|
| K1 Brian | 50 | 18 | 602 |
| K2 Daniel | 62 | 15 | 979 |
| K3 Callum | 35 | 9 | 477 |
| K4 George | 26 | 9 | 339 |
| K5 Bill | 99 | 27 | 1437 |
| A1 Charlie | 49 | 18 | 636 |
| A2 Callum | 58 | 15 | 889 |
| A3 Bill | 41 | 9 | 606 |
| A4 Will | 26 | 9 | 355 |
| A5 Liam | 106 | 27 | 1510 |
| **gesamt** | **552** | **156** | **7830** |

Etwa **0,80 $** für einen Durchgang, mit Nachgenerieren eher 1,50–2,50 $.

**Fragen an Enrico:**
1. **Eiserne Hünen:** laut deiner Tabelle Sturm (A3 Bill). Heute sprechen sie mit der Maschinenstimme. Sollen sie menschlich (A3 mit Schlachtfunk) werden oder Maschine bleiben?
2. **Löwenoger:** Er steht bei K3, brüllt aber weiter. Brauchen er oder die Hünen trotzdem Worte?
3. **Helden:** Rote Faust mit K5 Bill und Kürassier mit A5 Liam neu sprechen, als eigener kleiner Auftrag?
## 2026-11-26 – R4d (Punkt 108) und V1 Stimmen-Plan (Punkt 102) (`52046c7` mit index.html, `8cedd29`)

Gepusht.
- **Hänger:** keine. Partietest ohne Fehler, Regeltest ok.
- **Vorschau:** kurz offen, dann geschlossen.
- **sim:** 3 Läufe nacheinander, **kein Absturz**.

### R4d
1. **Stahlreiter zu hoch:**
   - **Ursache:** Seit K1 steht der Stahlreiter in Grauwall auf dem Grabenfeld (1,7). Dort liegt der Graben am oberen Feldrand. Die Reiter wurden wie Fußtruppen auf die Grabenplätze gestellt und standen deshalb ein Feld zu hoch.
   - Das war kein Fehler des neuen Bogens. Mit dem alten Bogen war es genauso; vorher stand der Reiter nur im offenen Feld.
   - **Behoben:** Reiter nehmen nie die Grabenplätze und stehen immer auf ihren drei Feldplätzen im eigenen Ring (Rückweg `REITER_GRABEN_ALT`).
   - Bilder: `entwurf/probe/r4d/stahlreiter_graben_vorher.jpg` / `_nachher.jpg`. Im offenen Feld war es schon richtig: `entwurf/probe/r4/reiter_nachher.jpg`.
2. **Farbe Stahlreiter:** bleibt so.
3. **Krähenfurt:** Dorfplatz 2, Gehöft 3.
4. **Elite je −5:**
   - Neue Preise: Stahlreiter 55, Grabenräumer 60, Sturmbrecher 115, Löwenoger 110, Schwere Grabenwacht 30, Hünen 85, Panzerknechte 60. Im Info-Fenster steht die Zeile „Elite-Abschlag −5“ (`P.ELITE_ABSCHLAG`).
   - **Budget:** Das Armee-Budget rechnet ohne den Abschlag. Es bleibt also wie vorher (z. B. Grauwall 945/885), und die gesparten Punkte kommen beim Spieler an.
5. **Vierte Grabenräumer-Figur:** in U4, jetzt nicht.

- **Gegenmessung** (`MISCHEN=1`, je 100 Schlachten), Siegquote Konkordat:
  - **Krähenfurt 59 %** (vorher 90 %, 14,3 Runden)
  - Grauwall 50 %
  - Sankt Ruß 51 %

### V1 Stimmen-Plan (nur Text, nichts gebaut)
- **`entwurf/STIMMEN_PLAN.md`:**
  - Sprecher-Vorschlag: je Fraktion 3 menschliche Sprecher (Fußtruppen / Sturm und Reiter / Anführer und Panzerbesatzung) plus die vorhandene Maschinenstimme.
  - Tabelle aller Anlässe: was heute klingt, was fehlt, ob es schon eine Abspielstelle gibt.
  - Übersicht Gruppe × Anlass, Beispiele.
  - Hinweise für V2 (Hörprobe zuerst, Dateiname = id) und V3 (neue Plätze, neue Abspielstellen für Erscheinen, Zielfeld, Schilde, Gegenstoß, Dauerfeuer, Panzer getroffen/Panne).
- **`entwurf/stimmen_texte.csv`:**
  - 477 Zeilen, Semikolon, UTF-8.
  - Spalten id, fraktion, sprecher, anlass, einheit, text.
  - Je Anlass 3–4 Fassungen, Erscheinen je Einheit 2 (22 Konkordat-, 25 Aschenwacht-Einheiten).
  - Alles Deutsch, auch das Konkordat, 1–5 Wörter.
  - Erzeugt mit `python tools/stimmen_plan.py`; Texte dort ändern.
- **Ausgenommen:** Helden (eigene Stimmen) und der Löwenoger (Brüllen).

**Fragen an Enrico:**
1. Sprecher-Aufteilung so? (Tabelle 1 im Plan)
2. Sollen die heutigen Anklicken-Sprüche (Suno) sowie Panik und Sterben ganz durch die neuen festen Sprecher ersetzt werden? Das ist mein Vorschlag, damit alles aus einem Guss klingt.
3. Texte durchsehen: Gibt es Rufe, die dir nicht gefallen? Dann ändere ich sie in `tools/stimmen_plan.py`.
## 2026-11-26 – R4c Bilder, Elite-Messung (107), Krähenfurt-Check (105) (`7d9eece` mit index.html)

Gepusht.
- **Hänger:** keine. Partietest ohne Fehler, Regeltest ok.
- **Vorschau:** kurz offen, dann geschlossen. Kein Chrome offen.
- **sim:** 22 Läufe, höchstens zwei gleichzeitig, **kein Absturz**.

### 1. R4b-Rest: neue Bilder
- **Stahlreiter (106.4):** Der neue Bogen ist geschnitten (massivere Pferde), gleiche Posen und Größe.
  - Damit sie im Spiel nicht röter oder greller wirken, bekommen die Stahlreiter-Bilder keine zusätzliche Sättigung und keinen Kontrast mehr (ui.js `BW_FARBTREU`). Die Plastik-Karte (Licht/Schatten) bleibt.
  - Vorher/Nachher: `entwurf/probe/r4c/stahlreiter_vorher_nachher.jpg` (links der alte Bogen im Spiel, rechts der neue).
  - Schnitt: `entwurf/probe/r4c/schnitt_stahlreiter_alt_neu_und_grabenraeumer_getroffen.jpg`.
- **Grabenräumer (106.6):** `konkordat_sturm_getroffen.png` ist geschnitten. Die Größe richtet sich nach der Schild-Pose des Grabenräumers.
  - **Getroffen:** zufällig mit Schild oder mit Keule.
  - **Schilde vor:** neu die geduckte Pose hinter dem Schild.
  - Die vierte Figur (zweite Getroffen-Variante) ist geschnitten, aber noch nicht zugeordnet. Das Spiel kennt bisher nur zwei Fassungen je Pose.
  - Im Spiel: `entwurf/probe/r4c/raeumer_nachher.jpg`.

### 2. Punkt 107: Elite günstiger (nur gemessen, nicht übernommen)
- **Messung:** `MISCHEN=1`, je 100 Schlachten, gleiche Startwerte wie die Basis. Siegquote Konkordat:

| Karte | Basis | alle Elite −5 | alle Elite −10 |
|---|---|---|---|
| Grauwall | 51 % | 50 % | 51 % |
| Sankt Ruß | 50 % | 51 % | 49 % |
| Krähenfurt | 90 % | 89 % | 89 % |

- **Je Typ −10 auf Grauwall:** Stahlreiter, Grabenräumer, Löwenoger, Sturmbrecher, Schwere Grabenwacht und Hünen liegen alle bei 51 %.
- **Ergebnis:** Der Preis der Elite ändert im KI-gegen-KI-Spiel nichts.
  - Elite je Schlacht bleibt bei 3,4–3,7 (Grenze 3 plus Ersatz), die Verluste bleiben bei 47–51 %.
  - Es bindet die Obergrenze, nicht der Preis.
  - Wirken würde der Abschlag nur in der Armee-Auswahl des Spielers: dort bleiben mehr Punkte für Linie und Unterstützung.
- **Vorschlag:** Elite je −5 (Stahlreiter 55, Grabenräumer 60, Sturmbrecher 115, Löwenoger 110, Grabenwacht 30, Hünen 85) als Ausgleich für die knappen Plätze. Die Balance der Karten bleibt dabei unverändert.

### 3. Punkt 105: Krähenfurt
- **Messung:** `MISCHEN=1`, je 100 Schlachten. Siegquote Konkordat, Basis 90 %:

| Änderung | Konkordat |
|---|---|
| Hecke (7,4) weg | 88 % |
| Hecke (10,6) weg | 90 % |
| Mauer am Dorfplatz (8,5) weg | 90 % |
| alle drei weg | 88 % |
| Aufstellung Aschenwacht ab Spalte 13 statt 14 | 83 % |
| Dorfplatz 2 statt 3, Gehöft 2 statt 1 | 72 % |
| dazu Aufstellung ab 13 | 72 % |
| Kapelle 1, Gehöft 2 | 78 % |
| Dorfplatz 2, Kapelle 1, Gehöft 2 | 79 % |
| **Dorfplatz 2, Gehöft 3** | **59 %** |

- **Ursache liegt bei den Zielfeldern, nicht bei den Kanten.**
  - Teich, Dorfplatz und Kapelle (zusammen 6 von 9 Siegpunkten) liegen auf der Dorfseite des Konkordats.
  - Am Ende hält das Konkordat Kapelle 96 %, Dorfplatz 85 %, Brücke 79 %, die Aschenwacht nur das Gehöft (66 %).
  - Die Hecken und die Mauer machen höchstens 2 Punkte aus und können bleiben.
- **Vorschlag:** Dorfplatz 3 → 2 und Gehöft am Ostufer 1 → 3. Damit kommt Krähenfurt auf **59 %**, die Schlachten werden etwas länger (13,4 → 14,3 Runden).
- Die Kanten (Hecken, Mauer) bleiben, wie sie sind.

**Fragen an Enrico:**
1. Krähenfurt: Zielwerte Dorfplatz 2 / Gehöft 3 übernehmen? Alternative Dorfplatz 2 / Gehöft 2 (72 %).
2. Elite je −5 übernehmen, obwohl es in der Messung neutral ist? Oder Preise lassen?
3. Stahlreiter: Gefallen dir die Farben jetzt (Vorher/Nachher-Bild)?
4. Die vierte Grabenräumer-Figur (zweite Getroffen-Variante) später als dritte Fassung einbauen?
## 2026-11-26 – R4b (Punkt 106) und K1 Einheitenkategorien (Punkt 104) (`04f6b2f`, `431a645` mit index.html)

Gepusht.
- **Hänger:** keine. Partietest ohne Fehler, Ton-Pult-Test und Ton-Plätze ok, Regeltest ok.
- **Vorschau:** zum Prüfen kurz offen, danach geschlossen.
- **sim:** 9 Läufe, alle nacheinander, **kein Absturz**.

### R4b
1. **MG gegen Reiter ×2** gilt nicht mehr gegen die gepanzerten Stahlreiter. Das MG trifft sie jetzt ×0,5. Für die Sprenglanzen-Reiter bleibt die Regel.
2. **Zwei Schläge** für Stahlreiter und Löwenoger:
   - Steht der Gegner nach dem ersten Schlag noch, folgt ein zweiter ×0,6 (`P.ZWEISCHLAG`).
   - Preis je +10: Stahlreiter 60, Löwenoger 115. Die Rechnung steht im Info-Fenster als „Zwei Schläge +10“.
   - Schlagwort „Zwei Schläge“. Die Nahkampf-Medaille steigt dadurch auf Gold.
   - Die Angriffs-Vorschau zeigt „dazu 2. Schlag ×0,6“.
   - Im Bild holt der Trupp ein zweites Mal aus (Stahlreiter: aufbäumender Seitenhieb, Oger: Prankenhieb), mit dem Hiebton aus seiner Pult-Zeile „Schlag“.
   - Sim-Abschalter `NOZWEISCHLAG`.
   - **Messung** (`MISCHEN=1`, je 100 Schlachten), Konkordat ohne → mit zwei Schlägen:
     - Grauwall 67 → 67 %
     - Sankt Ruß 75 → 75 %
     - Krähenfurt 89 → 91 %
     - Schaden der Stahlreiter etwa +30 %, des Ogers etwa +25 %.
3. **Stahlreiter-Bogen neu (Punkt 4):** Bis zum Paketende lag noch der alte Bogen (17:50), deshalb übersprungen. Auch „weniger grell“ mache ich mit dem neuen Bogen.
4. **Sturmbrecher in Ruhe:** 2× MG hüfthoch, 3× Spaten (die ruhigste Pose), 1× Granatwurf. Im Nahkampf schlägt er jetzt mit dem Spaten. Die Wurf-Pose kommt nur noch beim Wurf.
5. **Grabenräumer-Getroffen (Punkt 6):** Das Bild ist noch nicht da, bis dahin bleibt die alte Figur.

### K1 Einheitenkategorien
- **Kategorie je Einheit:**

| Kategorie | Einheiten |
|---|---|
| Linie | Schützenkohorte, Aschengrenadiere |
| Unterstützung | alle übrigen Trupps: MG, Mörser, Minenwerfer, Pioniere, Sanitäter, Signal/Fernsprech, Melder, Flammen, Scharfschützen, Pirschjäger, Panzerbüchse, Bannerträger, Gasschutz, Mineure, Versorgung, Sprenglanzen-Reiter |
| Elite | Stahlreiter, Grabenräumer, Sturmbrecher, Löwenoger, Schwere Grabenwacht, Hünen, Panzerknechte |
| Gerät | Feldkanone, Haubitze, Geschütz, Landkoloss, Sturmpanzer, Ballon, Kampfmaschinen-Schreiter (Turm, Orden, Bohr, Säge, Klaue) |
| Selten | General, Hauptmann, Stufe-3-Schreiter, Helden |

- **Grenzen** (in P, Rückweg `KAT_ALT`):
  - Linie mindestens ein Drittel der Trupps; Anführer und Helden zählen dabei nicht mit.
  - Unterstützung 1 Platz je 2 Linientrupps.
  - Elite und Gerät je höchstens 3.
  - Selten wie bisher: General genau 1, Hauptmann bis 3, Stufe 3 und Held je 1.
  - Die Grenzen gelten in der Armee-Auswahl und im Nachschub. Gezählt werden die lebenden Einheiten im Feld.
- **Anzeige:**
  - Kleines Schild auf jeder Karte, vor der Rollenzeile.
  - Leiste „Linie 9 · Unterstützung 4/4 · Elite 2/3 · Gerät 3/3“ rechts in der Armee-Auswahl und oben im Nachschub. Volle Kategorien sind rot.
  - Gesperrte Karten sagen, warum, z. B. „Unterstützung voll (4/4): je 2 Linientrupps ein Platz“.
  - Bilder: `entwurf/probe/k1/armee_1920.jpg`, `armee_1280.jpg`, `nachschub_1280.jpg`.
- **Kartenarmeen:**
  - Die alten Armeen verletzten die Grenzen deutlich (z. B. Grauwall-Konkordat: 5 Linie, 7 Unterstützung, 4 Gerät). Neu aufgestellt, Budget = Wert der alten Armee (alte Armee bleibt als `armyAlt`):
    - **Konkordat Grauwall (945 von 945):** 9 Kohorten, 2 Mahlwerk, Mörser, Pioniere, 2 Landkolosse, 1 Haubitze, Stahlreiter, Grabenräumer, General, Hauptmann. Weggefallen: Scharfschützen, Sanitäter, Flammen, 1 Haubitze.
    - **Konkordat Sankt Ruß (985/990) und Krähenfurt (1020/1025):** wie oben mit 10 Kohorten, in Krähenfurt 3 Mahlwerk.
    - **Aschenwacht Grauwall (875/885):** 10 Grenadiere, 2 Sensenwerke, Minenwerfer, Signaltrupp, 2 Geschütze, Sturmpanzer, Sturmbrecher, General, Hauptmann. Weggefallen: Gasschutz, Banner, 1 Sensenwerk, Sanitäter.
    - **Aschenwacht Sankt Ruß und Krähenfurt (945/960):** 10 Grenadiere, 2 Pioniere, 2 Sensenwerke, 1 Geschütz, 2 Sturmpanzer, Sturmbrecher, General, Hauptmann.
  - Die Regel „höchstens 5 vom selben Typ“ (F94) passt nicht mehr zur Rückgrat-Regel und gilt für die Linie nicht mehr.
- **KI:** Ist der nächste Wunsch durch eine Grenze gesperrt, kauft sie erst Linie. Der Wunsch bleibt stehen.
- **Messung** (`MISCHEN=1`, je 100 Schlachten, vorher = `KAT_ALT`):

| Karte | Konkordat vorher | nachher | Runden | Ausfälle Konkordat / Aschenwacht nachher |
|---|---|---|---|---|
| Grauwall | 67 % | **51 %** | 14,7 → 15,2 | 30 / 28 % (vorher 31 / 42 %) |
| Sankt Ruß | 75 % | **50 %** | 13,1 → 13,9 | 44 / 29 % (vorher 40 / 46 %) |
| Krähenfurt | 91 % | 90 % | 12,8 → 13,4 | 31 / 25 % (vorher 38 / 38 %) |

- **Verluste je Kategorie** (nachher):
  - Linie 29–41 % (vorher 57–71 %, aber jetzt fast dreimal so viele Linientrupps je Schlacht, inklusive Nachschub).
  - Unterstützung 26–32 %, Gerät 27–31 %.
  - **Elite 48–51 %.**
- **Vorschlag Elite:**
  - Elite stirbt am häufigsten (rund jeder zweite Trupp) und ist auf 3 begrenzt.
  - Ich schlage vor, Elite je Punkt etwa 10 % günstiger zu machen (Abgleich −5 bis −10 je Typ) und das einzeln zu messen.
  - Erst nach deiner Antwort.

**Fragen an Enrico:**
1. **Zweifelsfälle bei der Zuordnung:**
   - Hauptmann unter „Selten“ (zählt nicht gegen die Linie, bis 3 wie bisher)?
   - Sprenglanzen-Reiter unter „Unterstützung“ (nicht Elite, weil leicht und billig)?
   - Pirschjäger und Scharfschützen unter „Unterstützung“?
   - Ballon unter „Gerät“?
2. Krähenfurt bleibt bei 90 %. Das prüfe ich als Nächstes im Krähenfurt-Check (Punkt 105). Passt das so?
3. Elite ~10 % günstiger messen?
4. Sollen die neuen Kartenarmeen so bleiben? Grauwall und Sankt Ruß liegen damit fast genau bei 50 %.
## 2026-11-26 – R4 Rest: neue Bögen, Pult-Zeile Pferd, Stahlreiter (`b958ab7`, `f7fd848` mit index.html)

Gepusht, R4 ist damit fertig.
- **Hänger:** keine. Partietest ohne Fehler, Ton-Pult-Test 93/93, Regeltest ok, Bilder ohne Seitenfehler. Am Ende läuft kein Chrome mehr.
- **sim:** 11 Läufe, alle nacheinander, **kein Absturz**.

**1. Neue Bögen (Punkte 94/96):**
- Sturmbrecher `aschenwacht_sturm_reskin` und Grabenräumer `konkordat_sturm_reskin` sind geschnitten. figure_cut liest jetzt auch aus `ui-quelle/figuren/reskin/`.
- Der Sturmbrecher ist so groß wie bisher (1,1 SH), der Grabenräumer so groß wie die Linie.
- Am MG ist das gemalte Mündungsfeuer entfernt; den Feuerstoß zeichnet das Spiel selbst.
- Neu ist eine eigene Ruhe-Pose je Figur (FIGMAP `ruhe`):
  - **Sturmbrecher:** 4× Granatwurf, 1× MG hüfthoch, 1× Spaten.
  - **Grabenräumer:** 2× mit Schild vorstoßend, 1× Revolver hinter dem Schild, 2× Keule, 1× Granatwurf.
- Posen der beiden Trupps:
  - **Sturmbrecher:** Nahkampf und Wurf zeigen den Granatwurf, Graben den Spaten, Getroffen ist neu.
  - **Grabenräumer:** Nahkampf zeigt die Keule, Wurf den Granatwurf, „Schilde vor“ das Vorstoßen mit Schild.
  - **Grabenräumer, Getroffen:** Dafür gibt es noch keine neue Pose. Er nimmt die alte Getroffen-Figur (roter Mantel, ohne Panzer).
- Allgemein: Trupps ohne eigene „bereit“-Pose zeigen in Ruhe jetzt wirklich ihre verschiedenen Figuren. Vorher zeigten alle die erste Figur. Das betrifft auch Reiter und Gasschutz.
- Die Farbe ist wie gemalt. Der Sturmtrupp-Bogen ist von sich aus leicht rötlich, ich habe ihn nicht angeglichen.
- Bilder: `entwurf/probe/r4/sturm_nachher.jpg`, `raeumer_nachher.jpg`, `reiter_nachher.jpg`.

**2. Pult-Zeile „Angriff (Ruf des Pferds)“:**
- Neuer eigener Spiel-Platz `pferd_angriff`, Standard `stahlreiter_wiehern1`. Er klingt beim eigenen Nahkampfangriff, auch nach einem Sturmlauf.
- Im Pult steht die Zeile beim Reiter unter Nahkampf.
- Ton-Spur für Reiter, Sturmbrecher und Grabenräumer neu gemessen.
- Die Lanzenreiter-Wahlen gelten weiter für den Stahlreiter (gleicher Schlüssel `reiter`).

**3. Punkt 97 Stahlreiter:**
- **Regeln:**
  - `reiter` heißt jetzt „Stahlreiter“: cav, 3 Modelle, Bewegung 4.
  - Werte Angriff 5, Abwehr 3 (vorher 2), Moral 8 (vorher 7).
  - **Leicht gepanzert:** Panzerklasse L wie die Stahlgänger, also Gewehr, MG und Klinge ×0,5, panzerbrechende Waffen ×1,5.
  - Ansturm ×1,5, Sturmlauf, keine Fernwaffe. Kein Kampfmaschinen-Schalter nötig.
- **Preis:** 50 (Lanzenreiter 30, Stahlgänger 65). Der alte Abgleich −10 ist weg.
- **Stahlgänger:** nicht mehr im Nachschub und nicht mehr in der KI-Liste; der Typ bleibt im Code.
- **Rückweg:** `REITER_ALT=1` (nur sim).
- Texte, Chronik und Schlagworte sind neu.
- **Bild:** 3 Posen (Trab, Galopp mit erhobenem Schwert, aufbäumend). Die Schwerter bleiben beim Schneiden ganz. Aufstellung 2 vorn, 1 hinten.
- **Messung** (`MISCHEN=1`, je 100 Schlachten, Siegquote Konkordat):

| Karte | Lanzenreiter | Stahlreiter | Schaden der Reiter je Schlacht | Verlust Reiter |
|---|---|---|---|---|
| Grauwall | 63 % | 67 % | 6 → 29 | 10 → 15 % |
| Sankt Ruß | 72 % | 75 % | 13 → 41 | 18 → 30 % |
| Krähenfurt | 87 % | 89 % | 8 → 23 | 16 → 21 % |

Die Siegquote steigt um 2–4 Punkte, das liegt im Rauschen. Der Trupp richtet aber 3- bis 5-mal so viel Schaden an und nutzt den Sturmlauf 2–4× je Schlacht. Die Runden bleiben gleich.

**Vorschlag „öfter zuschlagen“ (nicht eingebaut, nur Mess-Schalter `ZWEISCHLAG=typ`):**
- Gemessen wurde ein zweiter Nahkampfschlag ×0,6, wenn der Gegner danach noch steht. Grauwall, sonst Sankt Ruß, `MISCHEN=1`, je 100 Schlachten.

| Einheit | Schaden je Schlacht | Siegquote Konkordat (ohne → mit) |
|---|---|---|
| Stahlreiter (Grauwall) | 29 → 38 (+31 %) | 67 → 70 % |
| Stahlreiter (Sankt Ruß) | 41 → 59 (+44 %) | 75 → 77 % |
| Löwenoger | 20 → 29 (+45 %) | 67 → 67 % |
| Grabenräumer | 53 → 88 (+66 %) | 67 → 73 % |
| Sturmbrecher (Aschenwacht) | 67 → 86 (+28 %) | 67 → 71 % (Rauschen, eigentlich müsste es fallen) |

- Mein Vorschlag:
  - **Stahlreiter:** „zwei Schläge“ ×0,6, Preis +10 auf 60.
  - **Löwenoger:** Prankenhieb zweimal, Preis +10.
  - **Grabenräumer:** nicht. Er gewinnt am meisten und ist für 65 schon günstig.
  - **Sturmbrecher:** nicht. Er hat schon den Gegenstoß.
- Für die Anzeige bräuchte es noch einen zweiten Schlag im Nahkampfbild und eine Medaille bzw. ein Schlagwort.

**Fragen an Enrico:**
1. Stahlreiter: Soll **„MG gegen Reiter ×2“** auch für die gepanzerten Reiter gelten? Heute hebt sich das mit dem Panzer auf (MG trifft ×1). Ohne die Regel trifft das MG nur ×0,5.
2. Preis 50 und Abwehr 3 so lassen (Feinabgleich U9)?
3. „Zwei Schläge“ für Stahlreiter und Löwenoger wie vorgeschlagen einbauen?
4. Grabenräumer-Getroffen: Soll der Berater eine Getroffen-Pose im neuen Stil malen? Heute steht dort die alte Figur.
5. Soll der Sprenglanzen-Reiter der Aschenwacht auch die Zeile „Angriff (Ruf des Pferds)“ bekommen (mit einem normalen Pferdewiehern)?

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

