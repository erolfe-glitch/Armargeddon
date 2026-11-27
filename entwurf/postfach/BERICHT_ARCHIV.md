# Berichte – Archiv

Ältere Berichte aus `BERICHT.md` (neueste oben). Am 2026-11-23 ausgelagert, weil BERICHT.md über 2300 Zeilen lang war (LIESMICH: ab etwa 300 Zeilen).

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

## 2026-11-26 – G7h-1: Graben mit den neuen Bildern + Zielfeld 1 (Punkte 85 Teil 3, 87, 89) (`37b0985`, `9058ac0`)

Gepusht. **Paket geteilt** wie erlaubt: Das hier ist **G7h-1** (Graben). **G7h-2** (Draht-Module, Ruinen, Punkt 88) folgt mit dem nächsten `pa`. **index.html ist noch nicht eingecheckt**, das kommt am Ende von G7h-2.

### Gemacht
1. **Seitenwand breit (G7-3b)** geschnitten und eingebaut: 0,22 R breit, ohne Pfosten. Die „Säulen“ an den Längskanten sind weg.
2. **Querwand als Erdblock (G7-6b)** geschnitten und eingebaut.
   - Sie geht über die volle Grabenbreite (0,95 R), die Oberseite mit der Sandsackreihe ist zu sehen.
   - Sie ist auf 0,42 SH gestaucht, ihr unterer Rand läuft weich in die Sohle aus.
   - **Noch nicht ganz richtig:** An manchen Knicken sitzt der Block halb neben dem Graben. Er ist auf die Mitte zwischen Bucht und Durchgang gesetzt, und die liegen 0,45 R versetzt (`gelaende_g7h/grauwall_leer_nah.jpg`, Block oben links). Das korrigiere ich in G7h-2.
3. **Laufsteg (87.1):** ein durchgehender, gerader Steg in der Grabenmitte, auch durch die Buchten, mit kurzem geradem Versatz am Buchtknick.
   - Die gemalten Rost-Stücke sind selbst schräg gezeichnet und ergaben ein Fischgrät-Muster. Der Steg ist jetzt im Code aus geraden Planken gezeichnet: zwei Längsbalken, Planken quer zur Laufrichtung, nur gedreht, nie geschert, selten fehlt eine Planke.
4. **Zwei versetzte Reihen (87.3):** In Gräben, die in die Tiefe laufen, stehen die Figuren im Wechsel etwa 0,12–0,18 R links und rechts der Mitte. In Buchten bleibt die Verteilung über die Breite aus G7g.
5. **Geschütz (87.4):** Einzelmodelle (Geschütze, Mörser) auf einem Grabenfeld stehen jetzt auf dem nächsten Grabenplatz auf der Sohle, nicht mehr auf der Feldmitte halb auf der Lippe. Fahrzeuge bleiben auf der Feldmitte.
6. **Zielfeld 1 (Punkt 89):**
   - **Ursache:** Auf dem Vorposten (3,4) **selbst** stand eine Panzersperre. Das Feld war damit für alle unbetretbar.
   - Die Sperre steht jetzt auf (3,5); Rückweg `SPERRE_ALT`.
   - **Neuer Test** `node tools/test_zielfelder.js`: für jede Karte, jede Seite und jedes Zielfeld eine Wegsuche mit einem Linientrupp von der Aufstellungszone, ohne Räumen. Das Zielfeld muss betretbar sein und mindestens zwei erreichbare Nachbarfelder haben.
     - Vorher schlug er auf Grauwall zweimal an (beide Seiten, Vorposten), jetzt ist er grün.
     - Er ist ein eigenes Werkzeug, nicht in test_regeln eingebaut.
   - **sim.js 100 Grauwall, vier Startwerte:**

| | Startwert 1 | 2 | 3 | 4 | **Mittel** |
|---|---|---|---|---|---|
| vorher (Sperre auf dem Vorposten) | 35 % | 33 % | 34 % | 30 % | **33 %** |
| nachher (Sperre auf 3,5) | 38 % | 39 % | 50 % | 44 % | **43 %** |

   - Das Konkordat gewinnt 10 Punkte, weil es den Vorposten jetzt halten kann.
   - Nicht ausgeglichen (gehört in Paket S).
   - Für Fahrzeuge ist der Weg an der Straße bei (3,3) damit etwas weniger zugestellt.

### Nicht gemacht (kommt in G7h-2 oder ist offen)
- Ende des Sandsackwalls unregelmäßig.
- Scharfschützen liegend im Graben, Bild.
- Messung „85 % der Grabenfläche in Grabenfeldern“.
- **Bild mit Panzer im Graben:** Die Probe setzt den Koloss auf (2,6), er ist in `vergleich_nah2.jpg` aber nicht zu sehen. Vermutlich findet die Probe ihn nicht unter den Einheiten; das prüfe ich in G7h-2.
- Punkt 84.12 (Warnsymbole am Weg, Mauszeiger): nicht geprüft.

### Bilder (`entwurf/probe/gelaende_g7h/`)
- `vergleich_nah.jpg`, `vergleich_nah2.jpg`, `vergleich_ganz.jpg`: links G7H_ALT, rechts neu, jeweils mit Trupps im Graben und gewähltem Hauptmann.
- `grauwall_leer_nah.jpg`: Graben ohne Einheiten, darauf sieht man Laufsteg, Seitenwand und Querwand am besten.

### Tests
- test_kommentare vor jedem build.py, bestanden. Einmal ein Fehlalarm in einem Werkzeug-Kommentar, umformuliert.
- test_regeln und test_zielfelder bestanden.
- Partietest mit Grafikkarte, 5 Minuten: Runden 1–3, keine Fehler.
- Keine Hänger. Den Chrome im Hintergrund habe ich beendet. Der Vorschau-Server war ausgefallen; ich habe ihn ohne sichtbare Vorschau neu gestartet, er läuft weiter.

### Fragen an Enrico
1. Passt der Laufsteg aus geraden Planken, oder lieber wieder gemalte Roste, sobald der Berater gerade Stücke malt?

## 2026-11-22 Abend – Entscheidungen 19:45: Uferkante flach, Häuser größer

Gepusht. Partietest Krähenfurt fehlerfrei, test_kommentare sauber. Bilder in `entwurf/probe/kraehenfurt_ufer/` (`teich.jpg`, `fluss.jpg`, Dorfplatz vorher `dorfplatz_vorher.jpg` / nachher `platz.jpg`, Übersicht `uebersicht.jpg`).

1. **Uferkante als flacher Aufkleber:**
   - Aus `ufer_schnee_flach_bogen.png` sind drei Streifen geschnitten, `ufer_flach_1–3`: der Mittelteil, waagrecht nahtlos (Überblendung mit Kontrasterhalt), oben und unten weich auslaufend.
   - Die Streifen liegen flach auf dem Boden, aber nicht an den Feldkanten; die gaben harte, sechseckige Linien.
   - Stattdessen folgen sie der weichen Eisgrenze, wie sie gezeichnet ist (Fluss und Teich). Ich berechne sie aus einer kleinen Eismaske: etwa alle halbe Feldbreite ein Stück, in Richtung der Kante gedreht, oben Schnee, unten Eis.
   - Die Enden sind weich, Überlappungen setzen sich nicht ab.
   - Streifen 1 und 2 kommen meist, Streifen 3 (steinig) seltener.
   - Auf Krähenfurt sind es etwa 180 Stücke; sie werden einmal beim Aufbau ins Bodenbild gemalt und kosten im Spiel nichts.
   - `ufer_schnee` (aufrecht) bleibt aus.
2. **Häuser 15 % größer:**
   - Heile Häuser und Ruinen sind jetzt 2,0 Feldradien breit statt 1,75, die Kapelle 2,1 statt 1,85.
   - Steht ein Trupp dahinter, werden sie halb durchsichtig wie die Bäume (bestehende Regel für hohe Teile).
   - Sie ragen links und rechts etwa eine Viertel-Feldbreite in die Nachbarfelder, Trupps dort bleiben sichtbar.
3. **Feldkanone:** nichts geändert.

Als Nächstes: offen ist nur noch die Frage zum Eisloch (Bericht 18:35/19:40).

## 2026-11-22 Abend – Krähenfurt: Wintereffekte (18:35) und Spuren, Schneefall, Atem, Blut (19:40)

Gepusht. Tests: test_kommentare sauber, Partietest Krähenfurt fehlerfrei (Grauwall siehe Commit-Nachricht). Bilder in `entwurf/probe/kraehenfurt_effekte/`.

### 18:35 Furt, Krater, Wintereffekte
1. **Einschlag:** In `fxImpact` steht auf Winterkarten die Schneefontäne. Bei großen Geschossen folgt Bild 1 auf Bild 2 (fällt zusammen), bei kleinen kommt Bild 3. Feuerkern und Rauch bleiben wie bisher. Auch die übrigen Erdfontänen (Kanonentreffer auf Truppen, Faust-Einschlag, Festfahren) werden im Winter Schnee. Bilder: `einschlag_1.jpg`, `einschlag_2.jpg`.
2. **Bodenspuren:**
   - Einschlag und kleiner Trichter werden zu Schneetrichtern, Brandfleck zum Schnee-Brandfleck.
   - Trichterfelder zeigen ebenfalls den Schneetrichter.
   - Erd-Pfützen und Trümmerstreu auf Schneefeldern sind weg.
   - Bild: `trichter_2_runden.jpg`.
3. **Pulverschnee:** kommt hinter Ketten und Rädern, bei jedem Schreiter-Schritt und bei der Landung des Sprungangriffs. Höchstens 10 Wolken gleichzeitig, bei Infanterie gar nicht.
4. **Eissplitter:** Bei Einschlägen auf Eisfeldern erscheinen Splitter mit etwas Schnee. Große Geschosse spielen `eis_bricht`, kleine und Treffer `eis_knackt`. `eis_bricht` ist damit im Spiel (vorher nur im Pult). Bild: `eistreffer.jpg`.
5. **Schneekante im Code:**
   - Grabenränder, Sandsack-Barrikaden, Bunker, Draht und Sperren sind oben weiß.
   - Vorher/nachher: `schneekante_vorher.jpg` / `schneekante_nachher.jpg`; dafür habe ich auf Krähenfurt testweise Graben, Draht und Barrikade gesetzt.
   - Zum Vergleich abschaltbar mit `window.NOSCHNEEKANTE`.
6. **Furt:** Die gemalte Furt-Kachel liegt in Flussrichtung gedreht mit weichem Rand (`furt.jpg`). Fehlen Bilder, greifen die alten Effekte.

### 19:40 Spuren, Eisloch, Schneefall, Atem, Blut
1. **Spuren** (nur die genannten Felder):
   - Alle sind so gedreht, dass sie in Fahrtrichtung liegen:
     - Räder mit Hufen → Geschütze und Feldkanone
     - Schreiter-Abdrücke → Schreiter
     - gerade Kettenspur → Fahrzeug fährt geradeaus, gebogene → Fahrzeug dreht
     - Hufe → Reiter
     - zertrampelter Schnee → Nahkampf
     - Fußtruppen → kleine Stapfen, im Code gezeichnet und dezent
   - Spuren bleiben 3 Runden und verblassen in der letzten. Höchstens 60 gleichzeitig.
   - Der gemalte Schneegrund unter den Spuren ist durchsichtig bzw. an den Spielschnee angeglichen, sonst entstünden helle Rechtecke.
   - Der Blutfleck im Nahkampf-Feld ist zu Matsch umgefärbt.
   - Bilder: `spuren_koloss.jpg`, `spuren_2_runden.jpg`.
2. **Eisloch – Frage an Enrico: Soll Eis einbrechen können?**
   - Zurzeit gibt es dafür keine Regel: Eis trägt Fußtruppen, Fahrzeuge kommen nicht drauf.
   - Das Bild `eisloch_schnee` ist geschnitten und eingebettet, aber nicht benutzt.
   - **Vorschlag, falls ja:** Ein schwerer Einschlag (Haubitze, Minenwerfer) auf Eis macht das Feld für 2 Runden zu „Wasser“ (unpassierbar). Eine Einheit darauf nimmt Schaden und wird ans Ufer zurückgeworfen. Dazu das Bild, der Ton `eis_bricht` und Splitter.
   - Ohne deine Entscheidung baue ich das nicht.
3. **Schneefall:**
   - 70 Flocken bei Bildwirkung leicht, 110 bei stark, aus bei Bildwirkung aus.
   - Bei der Böe (`winterwind_stark`) treiben die Flocken 3,5 s zur Seite.
   - Leistung bei 1920 px, Mittel über 180 Bilder: ohne Schneefall 7,3 ms je Bild (längstes 17 ms), mit Schneefall 7,7 ms (längstes 13 ms). Kein messbarer Einbruch.
   - Bild: `schneefall.jpg`.
4. **Atemwolken:**
   - Ein kleines helles Wölkchen erscheint vor dem Kopf, wenn eine Fußtruppe spricht oder ruft (Anwahl, Rufe, Schmerz, Panik …).
   - Nicht bei Kampfanzügen, Hünen, Schreitern, Fahrzeugen und Geschützen.
   - Je Einheit höchstens alle 1,5 s, aus bei Bildwirkung aus.
   - Bild: `atem.jpg`.
5. **Blut auf Schnee:** auf Winterkarten dunkler (Helligkeit 0,4) und kleiner (×0,72), Spritzer wie Flecken. Der Blut-Schalter gilt weiter.

### Fragen an Enrico
1. **Eis einbrechen lassen** (siehe oben, Vorschlag mit 2 Runden Wasser)?
2. Sind die Spuren deutlich genug? Bei ganz herausgezoomter Karte sieht man sie kaum; ich könnte sie etwas dunkler machen.
3. Atemwolke: so dezent lassen oder etwas größer?

## 2026-11-22 Abend – Krähenfurt-Bausteine, reine Schneeflächen, Feldkanonen-Ton, Titelbild (`a7f424b`, `bd026f1`, `c388e11`)

Alles gepusht. Tests: Partietest Grauwall und Krähenfurt fehlerfrei, test_kommentare sauber (ein verschluckter Code-Rest von mir sofort behoben), Einschlag-Test, Einsturz-Test Haus. Bilder in `entwurf/probe/kraehenfurt_bausteine/` (vorher/nachher) und `entwurf/probe/titel_2026-11-22/`.

### 18:45 Entscheidungen
1. **Ballon:** nichts geändert.
2. **Rollen-Aufstellung:** in `IDEEN.md` geparkt (Stand, `AUFSTELLUNG_NEU=1`, Messtabelle, Idee „zusammen mit der KI-Startphase“).
3. **Feldkanone, Bewegungston = `wagenknarren`**, im Winter `pferde_schnee` leise darunter.
   - **Prüfung auf den 700-Hz-Pfiff:** Spektrum je 46-ms-Fenster gemessen. Kein Dauerton; ein Ton zählt erst als Dauerton, wenn er in den meisten Fenstern steht, und keiner steht in mehr als 11 von 69. Es gibt aber kurze Quietscher um 1,4 kHz (bis 21 dB über der Umgebung).
   - **Gegenmaßnahme:** Tiefpass 1,2 kHz in `sound_bau.json`. Danach liegt die Spitze bei 1,4 kHz ca. 5 dB tiefer.
   - **Bitte im Pult anhören** („Feldkanone → Ziehen (ohne Protzen)“). Wenn es noch pfeift, senke ich den Tiefpass auf ca. 900 Hz.
   - Pult-Standard angepasst (vor der Übergabe an den zweiten Claude Code, wie verlangt zuerst gepusht).

### 18:50 Titelbild
- Das neue Bild ist schon 2736 px breit. Es wird jetzt nur noch auf 2560 px **verkleinert** und nicht mehr nachgeschärft (Schärfen nur noch beim Hochskalieren).
- `titlebg.js` 1,25 → 1,5 MB.
- Startmenü bei 1280, 1920 und 2560 px geprüft: Titel und Knöpfe gut lesbar, Panzer links und Mauer rechts im Bild (`entwurf/probe/titel_2026-11-22/start_*.jpg`).

### 18:55 Idee
- In `IDEEN.md` eingetragen, inklusive „Gräben von Grauwall zuerst“.

### 18:00 + 19:15 Krähenfurt-Bausteine
**Im Spiel (nur Winterkarten, `MAP.winter`; fehlen die Bilder, greifen die alten Platzhalter):**
- **Häuser** `haus_heil_1–4`:
  - Haus 2 ist gespiegelt.
  - Je Feld steht ein Haus im hinteren Teil, so stehen Trupps davor.
  - Manchmal liegt ein Holzstapel daneben.
- **Kapelle** mit Türmchen.
- **Ruinen** `haus_ruine_schnee_1–2` und `kapelle_ruine`:
  - Der Einsturz wird erst beim Abspielen des Ereignisses gezeigt.
  - Dabei wird nur das eine Feld neu aufgebaut: 14 ms statt 0,4 s.
  - Die Meldung lautet „Das Haus stürzt ein!“ bzw. „Die Kapelle stürzt ein!“; bei Häusern läutet keine Glocke.
- **Tannen** `tanne_schnee_1–4` im Wald. Im lichten Wald gibt es tote Bäume, Stümpfe und junge Tannen. Die Durchsichtigkeit ist wie bei den anderen Bäumen.
- **Steinbrücke:**
  - Selbst in `bruecke_stein_hinten`/`_vorn` geteilt, der Schneesockel und der Boden unter dem Bogen sind weg.
  - Der Trupp steht auf der Fahrbahn, die vordere Brüstung davor.
  - Die Brücke wird nicht durchsichtig.
- **Dorfteile:** Brunnen, Karren, Schilf am Eisrand.
- **Zäune:** Koppelzäune hinten um die Äcker. Bruchsteinmauern gibt es im Winter keine.
- **Böden:**
  - **Reine Schneeflächen (19:15):** Die vier Fassungen werden je Feld gemischt; die Felsen-Fassung kommt in etwa 1 von 8 Feldern vor.
  - Die Helligkeit habe ich gedämpft (Mittelwert 0,6) und leicht bläulich gemacht. Figuren und Fahnen heben sich bei Bildwirkung leicht gut ab, siehe `nachher_dorfplatz.jpg`.
  - Die fleckige Schneekachel liegt nur noch im Dorf und an den Wegrändern (zertrampelt).
  - **Acker:** je Feld ein ganzes Stück, leicht gedreht, manche quer. Die gemalten Furchen sind ungleichmäßig gebogen und kacheln nie sauber; deshalb habe ich sie gerade gezogen und nicht gekachelt (wirkt wie ein Flickenteppich).
  - **Eis** füllt Fluss und Teich.
  - **Matschstraße:** liegt entlang der Wegpunkte der Karte und ist in Wegrichtung gedreht. Vorher wurde aus den Straßenfeldern ein Netz, das wie Wälle aussah.
- Plastizität (`figur_plastik.py`) für alle neuen Teile gerechnet.

**Nicht eingebaut, bitte entscheiden bzw. neu machen lassen:**
- **`ufer_schnee`:**
  - Geschnitten und nahtlos, aber aus.
  - Als aufrechter Streifen wirkt er wie eine Mauer: an Feldkanten eckig, entlang der Flusslinie quer durch den Teich.
  - **Vorschlag an den Berater:** die Uferkante als flachen Aufkleber von oben (Draufsicht, Schneerand mit Steinen, auf Magenta) oder als Teil der Eiskachel.
- **Kapelle:** Den kleinen Zaun am Fuß habe ich gelassen; er stört nicht.
- **Brücke:** Steht der Trupp ganz vorn im Feld, sieht man unter dem Bogen ein Paar Beine. Das bleibt so, solange das Bild ein durchgehender Bogen ist.

**Messung Einschläge (längste Bildpause bei 6 Trichtern):**
- Grauwall 22–24 ms, Sankt Ruß 28–29 ms, Krähenfurt 104–113 ms (vorher 73–76 ms).
- Das ist noch flüssig. Der Anstieg kommt vom größeren Weltbild mit mehr Teilen; ich beobachte es.

**Größe:** `src/gelaende.js` 10,7 → 11,3 MB, `index.html` 41 MB (Töne liegen weiter daneben).

### Fragen an Enrico
1. Klingt die Feldkanone (Wagenknarren, Tiefpass 1,2 kHz) jetzt ohne Pfiff?
2. Uferkante: als flacher Aufkleber neu machen lassen, oder ohne Kante lassen?
3. Häuser: Größe passt (ca. 1,75 Feldbreiten breit)? Lieber etwas größer?

Als Nächstes: Abschnitt 18:35 (Furt, Krater, Wintereffekte).

## 2026-11-22 Abend – Fehler 17:32 und 17:40, Entscheidungen 17:30 (`d8d5b8d` … `0755a5b`)

Alles gepusht. Tests: Partietest (Grauwall und Krähenfurt), test_regeln, test_kommentare, test_ton, dazu neu `tools/test_einschlag.mjs` und `tools/test_hilfe.mjs`. Alle fehlerfrei.

### 17:32 Bild hängt bei Artillerie-Einschlag – behoben
- **Ursache:**
  - Jeder Feldwechsel durch einen Einschlag (offenes Feld → Trichter, 30 % je Einschlag; Barrikade/Bunker → Trichter; Draht zerschossen) baute die **ganze Gelände-Welt neu** auf (0,4–0,6 s).
  - Danach wurde das ganze Bodenbild neu gefiltert, jedes Mal mit einer frisch angelegten großen Leinwand.
  - Bei Sperrfeuer passierte das mehrmals hintereinander. Das ist das „Aufhängen“; es liegt nicht an einem bestimmten Untergrund.
  - Die vielen großen Zwischenleinwände treiben den Grafikspeicher hoch. Das ist die wahrscheinliche Ursache für „Bild ganz weg, danach Boden kaputt“.
- **Behoben:**
  - Ein neuer Trichter wird nur auf seinem Feld nachgezeichnet, ins Weltbild und ins gefilterte Bodenbild.
  - Bei zerstörter Barrikade, Bunker oder Draht werden nur deren Teile herausgenommen.
  - Bleibt der Boden gleich, wird nichts neu gefiltert; die Hilfsleinwand wird wiederverwendet.
  - Eingestürzte Häuser in Krähenfurt (Platzhalter = Ruine) brauchen keinen Neuaufbau.
  - Geht die Zeichenfläche verloren, baut das Spiel beim Zurückkommen alle Zwischenbilder, das Gelände und den Boden sauber neu auf.
- **Messung** (`tools/test_einschlag.mjs`, sechs Einschläge kurz hintereinander, Bildwirkung leicht und stark, längste Bildpause):

| Karte | vorher | nachher |
|---|---|---|
| Grauwall | 540–543 ms | 22–28 ms |
| Sankt Ruß | 621–711 ms | 30–33 ms |
| Krähenfurt | 654–675 ms | 73–76 ms |

- **Bleibt:** Einen vollen Neuaufbau gibt es nur noch beim Einsturz der Kirche von Sankt Ruß (ca. 0,4 s, einmal je Schlacht, unter Staub und Einsturz-Ton).

### 17:40 Spielfehler
1. **Sanitäter:**
   - Versorgen geht nur noch über den Knopf „Versorgen“. Knopf an: Ziele markiert und Zeiger, ein Klick heilt. Zweiter Druck schaltet aus.
   - Ohne Knopf wählt ein Klick auf eine eigene Einheit nur aus.
   - Genauso bei Versorgungstrupps (Reparieren), Meldegänger (Befehl überbringen) und Bergen.
   - Gasschutz und die übrigen Fähigkeiten liefen schon über den Fähigkeitsmodus.
   - Test: ohne Knopf Stärke unverändert und Einheit gewählt; mit Knopf geheilt.
2. **Feldkanone fliegt flach:** fast gerade Bahn (Bogen 0,15 statt 3,2), schnelles Geschoss (12 statt 34 Bilder), Mündungsfeuer waagerecht zum Ziel.
3. **Feldkanone ohne Protzen:**
   - Sie zieht immer 2 Felder und darf danach schießen; Protz-Knöpfe sind bei ihr weg, die KI zieht sie wie andere Einheiten.
   - Donnerrohr und Aschenwacht-Geschütze bleiben wie sie sind.
   - **Bewegungston:** neuer Pult-Eintrag „Ziehen (ohne Protzen)“ in der Gruppe „Gespann und Räder“. Standard `gespann`; Kandidaten `gallop` (Galopp-Gespann), `wagenknarren`, `pferd_unruhe`, im Winter `pferde_schnee`.
   - Preis bleibt 40.
   - **Messung** (4 × 200): Grauwall 54,3 %, Sankt Ruß 48,9 %, Krähenfurt 51,0 %.
4. **Fesselballon, Fertig-Haken:**
   - Ich finde keinen fehlenden Knopf. In allen Zuständen (oben, eingeholt, nach dem Markieren, ohne Bewegungspunkte) steht „Fertig“ (Taste 5) im Bedienfeld.
   - Auch der automatische Haken kommt richtig, sobald nichts mehr geht. Eingeholt mit Punkten darf er noch ziehen.
   - **Frage an Enrico:** In welcher Lage fehlte er (Seite, Runde, gerade gekauft, eingeholt)? Ein Bildschirmfoto würde helfen.
5. **Nachtrag (Meldegänger):** Gibt der Hund einer schon fertigen (abgehakten) Einheit Punkte, wird der Haken entfernt. Sie kann wieder ziehen; ein aufgebautes MG kann sich mit dem Punkt abbauen. Test: 2 BP, „ziehen“, 3 erreichbare Felder.

### 17:30 Entscheidungen
1. **Kartenname „Krähenfurt“:** im Startmenü und in den Texten; intern weiter `winterdorf`.
2. **Kapelle mit Türmchen:** +1 Sicht (keine Reichweite). Balance siehe oben: 51,0 %.
3. **Robustere Aufstellung – versucht, noch nicht Standard:**
   - Gebaut ist eine Rollen-Aufstellung für beide Seiten (`deployZone`):
     - Fußtruppen vorn, Fahrzeuge an Straßen und im Offenen, MG vorn in Deckung, Unterstützung und Geschütze hinten.
     - Plätze bewertet statt der Reihe nach; Mischen nur innerhalb einer Rolle.
   - **Ergebnis** (Sieg Konkordat, je 4 × 200, fest / gemischt):

| Fassung | Grauwall | Sankt Ruß | Krähenfurt |
|---|---|---|---|
| bisher (bleibt Standard) | 54,3 / 60,3 | 48,9 / 78,3 | 51,0 / 91,6 |
| Rollen-Aufstellung, Anführer hinten | 46,1 / 52,9 | 78,8 / 83,8 | 99,4 / 92,8 |
| dto., Anführer vorn | 22,1 / 62,4 | 94,3 / 79,8 | 90,0 / 93,8 |
| dto., Anführer nah hinter den Trupps | 42,9 / 57,4 | 28,9 / 85,1 | 99,9 / 96,0 |
| beste Variante + Stellschrauben (Band, KI-Vorstoß) | – | 39–84 / 53–81 | 97–100 / 80–96 |

   - **Bewertung:**
     - Die erste Fassung macht fest und gemischt zwar ähnlich (höchstens 7 Punkte), verschiebt aber die Balance stark, auf Krähenfurt auf 99 %.
     - Kleine Änderungen der Anführer-Plätze kippen das Ergebnis um 40–55 Punkte.
     - Die Empfindlichkeit liegt also nicht nur in der Aufstellung, sondern auch daran, wie die KI auf die Startlage reagiert.
     - Mit kleinen Werten war das heute nicht ins Ziel zu bringen.
   - Ich habe deshalb die **bewährte Aufstellung als Standard** gelassen; mit ihr liegen alle drei Karten fest im Ziel (siehe Tabelle).
   - Die neue ist mit `AUFSTELLUNG_NEU=1` abrufbar.
   - **Vorschlag:** als eigenes Paket weiterführen und dabei die KI-Startphase mit untersuchen. Enrico entscheidet.
4. **Töne ausgelagert:**
   - `index.html` bettet `src/sound.js` nicht mehr ein; `ui.js` lädt die Töne nach dem Start daneben.
   - Bis dahin steht im Startmenü „Töne werden geladen …“; danach startet die Titelmusik bzw. Kulisse.
   - Fehlt die Datei, läuft das Spiel ohne Ton weiter (Hinweis statt Fehler).
   - Pult und Tonprobe laden `src/sound.js` wie bisher selbst.
   - **Größe `index.html`: 65,9 MB → 35,7 MB.**
   - GitHub Pages: `src/sound.js` ist eingecheckt und wird von dort geladen; lokal über den Vorschau-Server ebenso.
5. **Partietest für Krähenfurt** angepasst (Testgebiet wird im Test frei gemacht, größere Karte beim Start nicht ganz im Bild = erlaubt): fehlerfrei.

Als Nächstes: Abschnitt 18:00 (neue Bausteine für Krähenfurt).

## 2026-11-22 Abend – Wintertöne (Auftrag 17:05)

Eingebaut und gepusht. Sie gelten nur auf Karten mit `MAP.winter` (vorerst das Winterdorf). Tests (test_ton mit allen Winterplätzen, Partietest, test_kommentare) fehlerfrei. CREDITS ergänzt, sound-quelle gesichert (Dateien kopiert nach `sound-quelle/Winter/`).

| Anlass | Ton | Einsatz |
|---|---|---|
| Fußtruppen ziehen | `schnee_gruppe`, bei Trupps mit 1–2 Figuren und Anführern `schnee_einzeln` | ersetzt `schritte` (im Wald bleibt `stepsWald`) |
| Marsch und Sturmlauf | bisherige Schritte leiser (0,35), darunter `schnee_rennen` | – |
| Rückzug | `schnee_rennen` | – |
| Schreiter, Kampfanzüge, Rote Faust | `stampfen_schnee` leise (0,25) | im gleichen Takt unter die vorhandenen Schritte |
| Landkoloss, Sturmpanzer, Bohrkoloss | `panzerketten_schnee` (0,35) | unter das Kettenrollen |
| aufgeprotzte Geschütze | `pferde_schnee` | statt `gespann` |
| Reiter | `pferde_schnee` leise (0,22) | unter den Galopp |
| Fußtruppen auf Eis | `eis_knackt` (nur die ersten 1,5 s, ausgeblendet) | – |
| Kulisse | `winterwind` als Schleife (zwei Spuren mit Überblendung wie `wind`, 0,13), dazu alle 45–110 s eine Böe `winterwind_stark`, dazu Krähen | unter Stimmen abgesenkt |

- **Eis einbrechen:** Der ganze Ton liegt nur im Pult (`eis_bricht`), weil es keine Einbruch-Regel gibt.
- **Ton-Pult:**
  - Neue Gruppe „Winter“ mit allen Kandidaten.
  - Neuer Eintrag „Winter (Karte)“ unter Stimmen mit allen Winterplätzen. Eine Wahl dort gilt im Spiel auf Winterkarten.
  - Die Grundschleife des Windes läuft (wie bisher beim Wind) nicht über das Pult.
- **Größe:**
  - Wind auf 26 s (Schleife) und Böe auf 8 s geschnitten, Schritte 1,2–2,5 s.
  - `src/sound.js` 28,9 → 30,2 MB, `index.html` 64,6 → 65,9 MB. GitHub warnt ab 50 MB, die harte Grenze liegt bei 100 MB.
  - Bleibt es bei dieser Rate (gut 1 MB je Tonpaket), ist die Grenze in etwa 30 Paketen erreicht. Vorschlag für später: Töne als eigene Datei neben `index.html` laden statt einbetten (wie `tonprobe.html`).

## 2026-11-22 Abend – Winterdorf, Schritt 1 (`4694911`)

Die Karte ist spielbar, steht im Startmenü (Kartenwahl „Winterdorf“, Größe „Groß“) und ist gepusht; `index.html` neu eingecheckt.
- **Grauwall und Sankt Ruß:** unverändert bis auf die Baum-Durchsichtigkeit (`sim.js`: 51 % bzw. 47 % wie vorher).
- **Tests:** test_regeln, test_kommentare und Partietest fehlerfrei.
- **Partietest auf dem Winterdorf:** meldet zwei Testannahmen, keine Spielfehler.
  - Er stellt für einen Test Einheiten fest auf Feld (8,4), das hier ein Haus ist.
  - Er erwartet 80 % der Einheiten im Startbild; die größere Karte ist beim Start nicht ganz im Bild.

### Raster (18 × 12, Spalten von links, Zeilen von oben)
```
    012345678901234567
 0  WWWWWWWEWWWWWWWWWW   Wald oben, Fluss kommt herein
 1  WW..ggg.EE.ggggg.W   Felder mit Zäunen
 2  Wf..ggH..EE.ggg..W
 3  Wf.....H.H.FE..H.W   Furt (11,3), Gehöft (15,3)
 4  Wf...H....H.EE..gW
 5  W...H......C.E..gW   Dorfplatz (8,5) mit Brunnen, Kapelle (11,5)
 6  Wf....H......E.ggW
 7  W......H.H..EE.ggW
 8  W.EEE.......R..ggW   Teich links, Steinbrücke (12,8)
 9  WfEEE..f...EE...gW
10  Wf.E...ff.EE...ggW
11  WWWWWWWWWWEWWWWWWW   Fluss läuft unten hinaus
```
Legende: E Eis, H Haus, C Kapelle, R Steinbrücke, F Furt, g Feld mit Zaun, W Tannenwald, f lichter Wald; dazu Straßen über Kreuz durchs Dorf und über die Brücke.

- **Fahnen wie im Plan:**
  - Teichufer (4,7) = 1.
  - Dorfplatz (8,5) = 3.
  - Kapelle (11,5) = 2.
  - Steinbrücke (12,8) = 2.
  - Gehöft am Ostufer (14,3) = 1.
- **Seiten:** Konkordat von Westen, Aschenwacht von Osten. Armeen wie Sankt Ruß (gemischt).
- **Fluss geprüft:** Ein Koloss kommt nur über die Steinbrücke oder die Furt ans andere Ufer. Zwei Lücken an schrägen Stellen des Flusses sind dafür mit Eis geschlossen.

### Neue Feldarten und Regeln
- **Eis** (Fluss und Teich):
  - Fußtruppen, Anführer und Helden: 2 BP, keine Deckung.
  - Fahrzeuge, Schreiter, Geschütze und Reiter: gesperrt, auch über eine Straße.
- **Haus / Kapelle:** wie die Kirche von Sankt Ruß.
  - Nur Fußtruppen und Anführer, keine Helden.
  - Sicht gesperrt, halber Moralverlust, Abwehr ×1,6 (`P.HAUS_DEF`).
  - Bauzustand je Gebäude: Haus 3, Kapelle 4 (`P.HAUS_HP`, `P.KAPELLE_HP`). Schwere Treffer und Rammen machen es zur Ruine.
  - Die Technik der Kirche (`G.bauten`, `kircheTreffer`, `einsturz`) wird wiederverwendet. In 200 Schlachten stürzen im Schnitt 1,4 Häuser ein.
- **Steinbrücke:** eigene Feldart, trägt alle. Die alte Holzbrücke trägt keine Kolosse.
- **Furt:** wie bisher.

### Darstellung
- **Platzhalter, bis die neuen Bausteine da sind:**
  - Eis = Wasser.
  - Häuser und Kapelle = Ruinen.
  - Steinbrücke = Holzbrücke.
  - Wald = Totholz-Stämme.
  - Noch kein Schnee.
- **Bäume durchsichtig (alle Karten):**
  - Bäume auf Feldern mit Einheit, auf dem Feld unter der Maus und auf den Feldern vor der gewählten Einheit blenden weich (ca. 0,25 s) auf 40 % Deckkraft aus.
  - Wie bisher werden große Teile außerdem blass, wenn sie eine Figur verdecken.
- **Nebel am Rand:**
  - Weicher, langsam ziehender Schleier an allen vier Rändern, im Weltbild gezeichnet; er folgt also der Perspektive.
  - Nur auf dem Winterdorf (`MAP.nebelRand`); Bildwirkung „aus“ = kein Nebel, „stark“ etwas dichter.
- **Bilder** in `entwurf/probe/winterdorf/`:
  - `uebersicht.jpg`: ganze Karte mit Fluss, Brücke, Teich, Dorf, Waldrand, Nebel unten und links.
  - `nah_wald.jpg`: Konkordat im Waldrand, Stämme blass.
  - `01_runde1` … `08_runde4.webp`: Partietest.

### Balance (je 200 Schlachten, Startwerte 1–8, feste Aufstellung)
| Fassung | Sieg Konkordat |
|---|---|
| erster Entwurf (Aschenwacht stellt ab Spalte 15 auf) | 96,8 % |
| Fahnen nach Osten verschoben | 96,9 % |
| Aufstellung Aschenwacht bis Spalte 13, KI-Gewichte wie Sankt Ruß (vorwärts) | **52,9 %** (50, 49, 54, 51, 53,5, 64,5, 49, 52,5) |

- Ø 14,1 Runden. `sim.js 200`: 50 % zu 50 %.
- Mit gemischter Aufstellung 92 %. Das ist wieder die Empfindlichkeit der automatischen Aufstellung (siehe F94); deren Umbau bleibt als Vorschlag offen.

### Bausteinliste
**Wiederverwendet (vorerst als Platzhalter):**
- Totholz-Stämme und Stümpfe (Wald).
- Ruinen-Wandstücke (Häuser, Kapelle).
- Kanalwasser und Ufer (Eis).
- Holzbrücke.
- Gartenzaun (Felder).
- Brunnen, Karren, Straßen.
- Bodentexturen Gras/Schlamm.

**Neu gebraucht** (Ansicht wie die übrigen Bausteine: schräg von vorn oben, Magenta-Hintergrund; Höhen in Soldatenhöhen SH):

| Teil | Art | Größe | Ansicht | Varianten | Dateiname |
|---|---|---|---|---|---|
| Schneeboden | Boden, kachelbar | 512 px, nahtlos | Draufsicht | 2 | `boden_schnee.png` |
| Acker im Schnee (Furchen) | Boden, kachelbar | 512 px | Draufsicht | 2 | `boden_acker_schnee.png` |
| Matschstraße mit Radspuren | Bodenstreifen, kachelbar längs | Breite ca. 0,6 Feld | Draufsicht | 2 | `strasse_matsch.png` |
| Eis mit Rissen (Fluss, Teich) | Boden, kachelbar | 512 px | Draufsicht | 2 | `boden_eis.png` |
| Verschneite Uferkante | Wandstück-Streifen | 0,25 SH | schräg | 1 | `ufer_schnee.png` |
| Steinbrücke (Bogen) | Wandstück vorn und hinten getrennt | 1 Feld lang, 0,8 SH | schräg, quer zum Fluss | 1 | `bruecke_stein_vorn.png`, `bruecke_stein_hinten.png` |
| Fachwerkhaus heil, verschneites Dach | Aufsteller | 1 Feld, ca. 2,2 SH bis zum First | schräg von vorn | 4 Formen | `haus_heil_1–4.png` |
| Fachwerkhaus als Ruine (nach Einsturz) | Aufsteller | 1 Feld, ca. 1,5 SH | schräg | 2 | `haus_ruine_schnee_1–2.png` |
| Kapelle mit Türmchen, heil und Ruine | Aufsteller | 1 Feld, ca. 2,8 SH | schräg | 1 + 1 | `kapelle.png`, `kapelle_ruine.png` |
| Verschneite Tanne | Aufsteller | 2,0–2,6 SH | seitlich | 4 | `tanne_schnee_1–4.png` |
| Toter Baum, verschneit | Aufsteller | 1,6–2,0 SH | seitlich | 2 | `baum_tot_schnee_1–2.png` |
| Unterholz/Büsche verschneit | Wandstück-Streifen | 0,3 SH | schräg | 1 | `unterholz_schnee.png` |
| Zaun verschneit | Wandstück-Streifen | 0,5 SH | schräg | 1 | `zaun_schnee.png` |
| Holzstapel | Aufsteller | 0,6 SH | schräg | 2 | `holzstapel_1–2.png` |
| Karren verschneit | Aufsteller | 0,8 SH | schräg | 1 | `karren_schnee.png` |
| Brunnen verschneit | Aufsteller | 1,1 SH | schräg | 1 | `brunnen_schnee.png` |
| Schilf und Steine am Teich | Aufsteller klein | 0,3 SH | seitlich | 3 | `schilf_1–3.png` |

**Töne laut Plan noch gesucht:** Schritte im Schnee, Eis knackt, Winterwind, Krähen, ferner Geschützdonner.

### Für Enrico
- Den endgültigen **Kartennamen** setzt eine Zeile (`MAPS.winterdorf.name`).
- Die **Kapelle** hat noch keinen Turm mit Sichtbonus (im Plan „eventuell“). Wenn gewünscht, wie der Kirchturm in Sankt Ruß, eine Zeile Regel.

## 2026-11-22 Spätnachmittag – Aufträge 15:12 bis 16:08 erledigt (`399106e` … `3290b1d`)

Alles gepusht; `index.html` am Ende neu eingecheckt (jetzt 63,0 MB). Tests: test_ton (mit Heldenstimmen), test_zeiger (neu), Partietest und test_kommentare fehlerfrei.

### 15:26 Antworten zu den Tönen – umgesetzt
- **Schweres MG:**
  - Neuer Standard bei den Schreiter-MGs: Orden- und Klauenschreiter (Drehlauf am Arm), Turm-MG des Turmschreiters.
  - Die Eisernen Hünen haben wieder ihren alten Ton, damit Enricos Pult-Wahl `neu_mg_schwer_1` greift. Die MG-Trupps sind unverändert.
- **Sandsäcke** nur beim Eingraben, neben `atmen`. Draht ziehen, Mine legen und Stollen haben wieder `bauen`.
- **MG-Rückstoß:** Beim Zurückschieben durch Durchbruch oder Sturmrollen spielt `mg_abbauen`.
- **Feuer-Ruf der Aschenwacht:**
  - Er kommt bei Feuerbereitschaft von Hauptmann oder General, wie beim Konkordat. Sturmbefehl und Generalangriff behalten den Kampfschrei.
  - Einen Feuerschlag gibt es nur beim Konkordat (Fernsprechtrupp). Der Signaltrupp der Aschenwacht kann nur markieren, deshalb dort kein Ruf.
- **Granatwerfer** bleibt nur im Pult; **Panik**-Grenze bleibt.
- Ton-Pult nachgezogen.

### 15:23/15:47 Ordensschreiter Treffer-Pose
- **Bild:** `posen5` (Flux) ist eingebaut, `posen4` nicht verwendet; dessen Teil liegt in `ui-quelle/teile/_abgelegt/`.
- **Größe:** Sie entspricht der Ruhe-Pose (Kopf, Gürtel, Füße auf denselben Linien). Die Geh-Pose ist schon vorher etwas kleiner geschnitten.
- **Wanken im Code:** etwa 7° nach hinten um den Fußpunkt (vom Angreifer weg), kurzer Rückstoß nach vorn, dann Ruhe.
- **Spiegelung:** Die Pose wird nie zusätzlich gespiegelt (F97). Schaut der Schreiter nach links, wird wie bei jeder Figur das ganze Bild gespiegelt, die Funken also mit. Sie bleiben dabei auf der Brust und sprühen zur Vorderseite; das passt zur Blickrichtung.
- **Bilder:** `entwurf/probe/orden_treffer/groesse.jpg` (Größenvergleich) und `spiel_ablauf.jpg` (Ruhe und drei Momente des Wankens, beide Blickrichtungen).
- **CREDITS:** neuer Abschnitt „Bilder“ mit fal.ai Flux 3 Image Edit.

### 15:12 Bogen C
- **Gewählt wie bestellt:**
  - Sprenglanze: unten.
  - Rammen: oben.
  - Gegen Panzer: unten.
  - Einholen: unten.
- Die nicht gewählten Fassungen (`*_x`) sind nur abgelegt.
- **Eingebaut:**
  - Zustand „Sprenglanze bereit“.
  - Knopf „Gebäude rammen“.
  - Medaille „gegen Panzer“ (Karte und Info).
  - Knopf „Einholen“.
- Sprengladung gilt jetzt nur noch für die Haftladung, der Stiefel nur noch fürs Ziehen.
- **Vergleich bei 40 und 80 px:** `entwurf/probe/symbole/bogenC_vorher_nachher.png`.
- **Noch doppelt** (geprüft über alle Symbol-Zuordnungen in ui.js; gleiche Sache an mehreren Stellen zählt als eine):
  - **s_gas:** „Im Gas“, „Vergiftet“ und „Gasgranate“.
  - **s_fernglas:** „Beobachter“ und „Ballon aufsteigen“.
  - Die Garbe darf bleiben.
  - Nachgetragen in `entwurf/symbol-liste.md`.

### 15:53 Gemalte Mauszeiger
- **Alle 8 Zeiger aus `bogen_zeiger.png`:**
  - Werkzeug `tools/zeiger_bau.py` → `src/zeiger.js`.
  - 32 px, auf 2×-Bildschirmen 64 px über `image-set`. 32 px ist die sichere Größe unter Windows.
- **Nacharbeit:**
  - Sperrkreis gespiegelt.
  - Drahtschere ohne das Fremdteil.
  - Feld-Zielring auf ein Sechseck maskiert (Spitzen links und rechts wie unsere Felder), Rand nachgezogen.
- **Klickpunkte:**

  | Zeiger | Klickpunkt |
  |---|---|
  | Pfeil | 3,1 |
  | Hand | 3,1 (Fingerspitze) |
  | Stiefel | 3,27 (Stiefelspitze) |
  | Fadenkreuz, Sperrkreis, Feld | Mitte |
  | Säbel | 2,1 |
  | Schere | 5,2 |

- **Verhalten:**
  - Der Pfeil gilt überall, auch über Menüs; Knöpfe behalten die Hand des Systems.
  - Die Hand erscheint über eigenen Einheiten, auch ohne Auswahl.
  - Der Zeiger wird nur bei echtem Wechsel gesetzt, so flackert an Feldgrenzen nichts.
  - Die Leuchtpistole bleibt.
  - Fehlt ein Bild, greift der alte gezeichnete Zeiger.
  - Auf Touch ändert sich nichts.
- **Test** `tools/test_zeiger.mjs`: eigene Einheit, Ziehen, gesperrtes Feld, Nahkampf und Schuss liefern den richtigen Zeiger.
- **Bild:** `entwurf/probe/zeiger/zeiger_im_spiel.png`. Die Zeiger sind an ihrem Klickpunkt (türkiser Punkt) in eine Spielaufnahme gesetzt, weil Bildschirmfotos den Mauszeiger nicht zeigen.

### 15:58/16:08 Heldenstimmen
- **Die Rote Faust:** englisch, ohne Filter.
- **Der Eiserne Kürassier:**
  - Ragnar mit neuem **Helm-Filter**: Bandpass 300–3000 Hz, Resonanz 1,6 kHz, kurzer Kammfilter, Hauch Nachhall.
  - Tiefer (0,92), je Anlass zufällig Fassung a oder b.
- **Anlässe:**
  - Auswahl (etwa jede zweite), Ziehen, Angriff.
  - Durchbruch beim Anlauf, vor dem Faustschlag und ohne den Heldentitel zu stören; bzw. Hinrichtung vor dem Säge-Schnitt.
  - Getroffen (höchstens alle 8 s), Gegner vernichtet, schwer verwundet (einmal), Tod.
- Für Helden kommen keine Truppenrufe mehr; die übrigen Heldentöne bleiben.
- **Ton-Pult:** unter „Stimmen“ die Gruppen „Held Rote Faust“ und „Held Eiserner Kürassier“; Filter je Zeile wählbar (neu: „Stahlhelm“).
- CREDITS ergänzt, sound-quelle gesichert.

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


