# Aktueller Auftrag (von Claude/Berater, 2026-11-20 abends)

**Modell: Opus.** Grundlage: `entwurf/SPIELTEST_LISTE.md`, Abschnitt „Funde Spieltest Runde 4“ (F1–F44, Pakete A–F). Datei frisch lesen.

## Reihenfolge
1. **Postfach-Regel** aus `entwurf/postfach/LIESMICH.md` in CLAUDE.md übernehmen (kurz, Verweis auf LIESMICH.md). Committen.
2. **Paket A** – Fehler, Lesbarkeit, Menüs. Zuerst F12 (gelbe Kugeln beim Drahtschneiden).
3. **Paket F** – KI und Gegnerarmee (F43, F44). Bei F44 erst Vorschlag in BERICHT.md, Entscheidung durch Enrico abwarten; F43 schon umsetzen.
4. **Paket B** – Ton.
5. **Paket C** – Effekte, Animation, Kamera.
5b. **Neue Töne** aus `sound-quelle/_neu/` einbauen (Abschnitt unten) – nach Paket C, vor Paket D.
6. **Paket D** – Bedienung.
7. **Paket E** – Regeln und Balance (danach Simulation Grauwall + Sankt Ruß).

## Wie
- Jedes Paket einzeln committen und pushen, erledigte Punkte in SPIELTEST_LISTE.md abhaken.
- Nach jedem Paket einen kurzen Abschnitt in BERICHT.md (oben einfügen): was erledigt, Commits, Screenshots-Pfade, offene Punkte, „Fragen an Enrico“.
- Bei Entscheidungen, die Regeln oder Balance-Richtung ändern und nicht schon in der Liste festgelegt sind: als Frage eintragen; wenn blockierend, beim nächsten Paket weitermachen.
- Nach Paket A und nach Paket F im Chat kurz melden: „Bericht im Postfach – pb“. Danach weiterarbeiten, ohne auf Antwort zu warten, sofern nichts blockiert.
- Nichts löschen, nichts zurücksetzen ohne Rückfrage. Sicherungsregel für sound-quelle beachten.

## Zusätzlich, wenn Paket C (Animation) dran ist: neue Posen-Bögen
In `ui-quelle/figuren/` liegen neue 2×2-Posenbögen (aus JPG, Magenta), Aufbau wie `*_soldat_posen.png`:
- `konkordat_sturm_posen.png`, `aschenwacht_sturm_posen.png`: Granate ausholen, Granate loslassen (Hand leer), Graben, Getroffen. → Sturmtrupps bekommen damit den fertigen Wurfablauf für ihre Handgranaten (siehe IDEEN.md).
  Hinweis: Beim Konkordat-Sturmtrupp hält er in der Graben-Pose zusätzlich ein Gewehr im Anschlag – falls störend, melden.
- `konkordat_pionier_posen.png`, `aschenwacht_pionier_posen.png`: Draht schneiden (Drahtschere, Drahtrolle im Bild), Haftladung anbringen, Graben, Getroffen. → Pioniere: Drahtschneiden und Haftladung mit Pose. Gezeichneten Draht neben der Figur weglassen, wenn er stört.
- `konkordat_hauptmann_posen.png`, `aschenwacht_hauptmann_posen.png`: Befehl mit Säbel (nach vorn zeigend), Pistole zielen, Fernglas, Getroffen. → Hauptmann: Befehl-/Fähigkeitspose, Schuss, Beobachten.
  Hinweis: Beim Konkordat-Hauptmann zielt die Pistole (oben rechts) nach **links** – diese Pose gespiegelt verwenden oder weglassen und melden. Bögen sind nur 1024 px groß; falls zu klein nach dem Freistellen, melden.
- `konkordat_sanitaeter_posen.png`, `aschenwacht_sanitaeter_posen.png` (**vier Figuren in einer Reihe**, nicht 2×2): Gehen mit Trage und Tasche, Kniend verbinden (Heilen), Laufen mit Tasche (Aschenwacht mit Spritze), Getroffen. → Sanitäter: Heilpose für die Heilfähigkeit, Laufpose für Bewegung.
  **Pflicht:** Beim Aschenwacht-Sanitäter ist auf der Pickelhaube ein kleiner **Adler** – in allen vier Figuren übermalen (Helmmetall, schlichte Fläche oder einfache Rosette). Keine Adler im Spiel. Beim Konkordat trägt Figur 3 ein Gewehr quer – darf bleiben. Falls sich Figuren (Trage, Arme) berühren und die Nahtmethode nicht sauber trennt, melden.
- `konkordat_flammen_posen.png` (vier Figuren in einer Reihe), `aschenwacht_flammen_posen.png` (2×2): Vorrücken mit Flammenwerfer, Zielen/Feuern (Flamme kommt aus dem Spiel, nicht aus dem Bild), geduckt vorgehen, Getroffen. → Flammentrupp: Feuerpose für den Flammenstoß, Mündungspunkt = Düsenende.
  Hinweise: Konkordat-Bogen hat einen leicht anderen Magenta-Ton und gezeichnete Bodenschatten unter den Füßen – beim Freistellen mit entfernen; die Düse von Figur 2 reicht nah an Figur 3. **Pflicht:** Beim Aschenwacht-Flammentrupp sitzt vorn auf der Pickelhaube ein kleines goldenes Abzeichen – wie beim Sanitäter übermalen (schlichtes Helmmetall).
- `konkordat_kampfanzug_posen.png` (2×2): Sturmlauf, Faustschlag (Nahkampf), Kniend feuern, Getroffen/fallend. → Kampfanzüge Konkordat (stahl/panzerknecht).
  Hinweise: In der Bildmitte oben steht eine **blasse Geisterfigur** (Bewegungsunschärfe) – ignorieren/weglassen, keine echte Pose. Erdkrümel an den Füßen (Pose 1) und Blutspritzer (Pose 4) beim Freistellen entfernen. 
- `aschenwacht_kampfanzug_posen.png` (2×2): gleiche vier Posen wie Konkordat. Hinweis: Bei Pose 3 (kniend feuern) hängen **Rauchschlieren** links neben der Figur und vor der Mündung – beim Freistellen entfernen. Das gelbe Kreuz ist der leuchtende Sehschlitz des Helms (gehört zum Entwurf).
- `konkordat_versorgung_posen.png` (vier Figuren, frei verteilt): Kniend mit großem Schraubenschlüssel (= **Reparieren**), Munitionskiste tragen (= **Nachladen/Versorgen** und Gehen), Hämmern, Getroffen.
  **Pose 3 (Hämmern) NICHT verwenden:** unten gerade abgeschnitten, keine Beine, mit Maschinenblock. Nur Posen 1, 2, 4 nutzen.
- `konkordat_versorgung_posen2.png` (Zusatzbogen Konkordat): Kniend an Holzkiste (= **Nachladen/Versorgen**, gut geeignet), Stehend mit Schraubenschlüssel, Zeigen/Einweisen. Die **Ketten-Pose (unten links) NICHT verwenden** – Beine unten abgeschnitten. Aus beiden Konkordat-Bögen die passendsten Posen wählen.
- `aschenwacht_versorgung_posen.png`: Gehen mit zwei Munitionskisten (= Gehen/Versorgen), Hammer erhoben (= **Reparieren**), Kniend mit Schraubenschlüssel (kleiner gezeichnet – auf Maßstab der anderen bringen), Getroffen/fallend.
- `konkordat_schildwall_posen.png` (2×2): Keule erhoben (= **Nahkampf**), Revolver durch den Sehschlitz des Schilds (= **Schuss**), Schildstoß, Geduckt hinter dem Schild (= **Halten/Stand**). Keine Getroffen-Pose – für Treffer die Haltepose kurz rütteln/zurücksetzen.
  Hinweis: Der **Sehschlitz im Schild** ist ein eingeschlossenes Magenta-Loch – beim Freistellen mit transparent machen (Nahtmethode erfasst nur den Außenrand).
- `konkordat_schildwall_posen2.png` (Zusatzbogen): Keule erhoben (Schild von hinten), Gestemmt hinter dem Schild, Tief geduckt mit Schulter am Schild (= **Halten**), Ausholen mit Keule. Auch hier Sehschlitz-Löcher transparent machen. Aus beiden Bögen die besten Posen wählen.
- `aschenwacht_schwer_posen.png` (2×2): Keule hoch über dem Kopf (= **Nahkampf**), Ausholen seitlich hinter dem Schild, Kniend hinter dem Schild (= **Halten**), Getroffen/taumelnd (Pose 4). Helm jetzt ohne Abzeichen.
- `konkordat_scharfschuetze_posen.png`, `aschenwacht_pirschjaeger_posen.png`: Liegend zielen (= **Schuss/Lauern**), Kniend zielen, Geduckt schleichen (= **Bewegung**), Getroffen/fallend. Mündungspunkt = Laufende des Gewehrs. Hinweis Konkordat: Figur 2 (kniend) und Figur 4 (fallend) stehen eng beieinander – falls die Nahtmethode sie nicht trennt, melden.
- `konkordat_melder_posen.png`, `aschenwacht_melder_posen.png` (Melder/Signal): Laufen mit Meldetasche (= **Bewegung**), Kniend am Feldtelefon (= **Befehl/Fähigkeit**), Signalflagge schwenken, Getroffen.
  **Pflicht Konkordat:** Die Flagge ist fast weiß – sieht nach Kapitulation aus. Flaggentuch auf das Konkordat-Rot umfärben.
  **Pflicht Aschenwacht:** Auf allen vier Helmen ein goldener **Adler** – übermalen (schlichtes Helmmetall). Der Läufer (oben links) läuft nach **links** – horizontal spiegeln. Unten in der Mitte liegt ein loser Stiefel mit Unschärfe – kein Teil einer Figur, weglassen. Graues Flaggentuch darf bleiben.
- `konkordat_mineur_posen.png` (2×2): Spitzhacke schwingen (= **Graben/Unterminieren**), Kniend Sprengladung mit Zündschnur legen (= **Sprengen**), Schaufelstoß (Nahkampf), Getroffen. Hinweise: Der **Lichtschein der Helmlampe** (weißlicher Hof) und die gezeichneten Bodenstriche/Erdkrümel unter den Füßen und am Sprengbündel beim Freistellen entfernen. (Mineure gibt es nur beim Konkordat.)

**Posenbögen damit vollständig** für alle 12 Einheitentypen aus `entwurf/POSEN_PROMPTS.md`.
Mit Nahtmethode freistellen, Plastizität, gleicher Maßstab wie die Grundbögen. Weitere Posenbögen folgen nach `entwurf/POSEN_PROMPTS.md`.

- **F47 (neu, Paket C, zusammen mit F16):** Eiserne Hünen – der Schuss (Leuchtspur/Mündungsfeuer) startet zu hoch, etwa auf Brusthöhe statt an der Mündung des schweren MG. Mündungspunkt an das Laufende im Figurenbild legen, beide Figuren. Dabei alle Einheiten mit eigenem Mündungspunkt kurz durchsehen (Schreiter, Kolosse, Löwenoger-Schrot) und im Bericht nennen, was angepasst wurde. Unabhängig von späteren Posen – die Hünen haben keinen Posenbogen.

- **F48 (neu, Paket C, baut auf F34 Kamera und den Posenbögen auf): Kampfszene im Stil von Darkest Dungeon.** Auslöser: jeder **Nahkampf**, jede **Spezialfähigkeit** (Löwengebrüll, Haftladung, Sprungangriff, Flammenstoß, Faustsalve …) und jeder Treffer, der einen Trupp **vernichtet**. Normales Schießen bleibt schnell (nur F34-Kamera). Ablauf, gesamt etwa 1–1,5 s:
  1. Kamera zoomt auf Angreifer und Ziel, Rest des Bildes abgedunkelt (Vignette).
  2. Angreifer wechselt in seine **Angriffspose** (aus dem Posenbogen) und rutscht ein Stück aufs Ziel zu; Ziel wechselt gleichzeitig in die **Getroffen-Pose** und wird leicht zurückgestoßen.
  3. Wucht: kurzer Stillstand (~0,1 s), Bildschirmrütteln, Blut/Funken (F27), Schadenszahl in den drei Farbstufen.
  4. Zurückzoomen, beide wieder in Grundpose.
  Einheiten ohne Posenbogen (Schreiter, Fahrzeuge, Geschütze): Rückstoß/Rütteln wie bisher, Zoom trotzdem.
  **Optionen:** „Kampfszenen: an / kurz / aus“ (kurz = ohne Zoom, nur Posenwechsel und Wucht), außerdem per Klick überspringbar. Gilt auch für Züge der KI. Zuerst an einem Beispiel bauen (Konkordat-Sturmtrupp gegen Aschenwacht-Soldat), Screenshots/kurzes Video in den Bericht, dann auf alle ausrollen.

- **F50 (neu, Enrico 2026-11-20, Paket C, zusammen mit F48 und F27):** Kämpfe, vor allem **Nahkämpfe**, sind noch zu harmlos – „es ist irgendwie ohne“. Deutlich blutiger und grausiger machen:
  - Bei jedem Nahkampf-Hieb sichtbare Blutspritzer am Ziel (gemalte Spritzer aus dem Effektbogen, mehrere je Hieb, in Schlagrichtung), nicht nur am Ende.
  - Größere und mehr Blutflecken am Boden nach Nahkampf und bei vernichteten Trupps (bleiben bis Schlachtende); bei fallenden Figuren ein Fleck unter der Figur.
  - In der F48-Kampfszene beim Wucht-Moment ein kräftiger Blutschwall/Spritzer nah an der Kamera, Stärke nach Schadensstufe (gelb wenig, hellrot mehr, kräftiges Rot viel).
  - Auch bei schweren Schusstreffern (MG, Schrot, Kanone auf Infanterie) etwas mehr Spritzer.
  - Maschinen/Schreiter/Fahrzeuge: statt Blut Funken, Öl und Metallsplitter.
  - Comic-Tinten-Stil beibehalten (dunkles Rot, dicke Kontur), kein realistischer Gore. Falls die gemalten Spritzer nicht reichen: im Bericht melden, dann schreibe ich einen Gemini-Prompt für einen neuen Blut-Effektbogen.
  Vorher-/Nachher-Bild in den Bericht.

- **F51 (neu, Enrico 2026-11-20, Paket C, zu F28/F48):** Der Kamera-Zoom beim Nahkampf ist gut. Aber heute schlägt erst die eine Seite, dann kommt eine spürbare Pause, dann schlägt die andere zurück – das nimmt die Wucht. Enricos Wahl: **Schlagabtausch**. Hieb und Gegenhieb schnell abwechselnd und ineinander verzahnt, ohne Pause dazwischen (z. B. A–V–A–V–A, Abstand ~0,15–0,25 s, Gegenhieb setzt ein, während der vorige Hieb noch wirkt). Der **letzte und härteste Hieb kommt vom Angreifer** mit dem Wucht-Moment aus F48 (kurzer Stillstand, Rütteln, Blut, Schadenszahl). Man soll noch sehen, wer gerade trifft (Posenwechsel, kleiner Ruck des Getroffenen). Gesamtdauer etwa wie heute oder kürzer. Gilt für alle Nahkämpfe, auch für „kurz“ ohne Zoom.

- **F52 (neu, Enrico 2026-11-20, Paket D – Bedienung):** Unter dem Lebensbalken jeder Einheit auf der Karte fehlt die vorgesehene **Moralanzeige**: ein **dünner, knochenweißer Balken direkt unter dem Lebensbalken** (unter, nicht über – wegen Platz). Deutlich schmaler als der Lebensbalken, im gemalten Stil der übrigen Anzeigen, gut lesbar auf hellem und dunklem Gelände. Zeigt die aktuelle Moral im Verhältnis zur vollen Moral; bei Erschüttert/Flucht passend erkennbar (z. B. Balken flackert oder färbt sich schmutzig grau). Prüfen, ob es dazu schon einen Plan in STYLE.md/IDEEN.md/CLAUDE.md gibt, und dem folgen. Screenshot in den Bericht.

- **F53 (neu, Enrico 2026-11-20, Paket E – Regeln):** **Generalangriff** (Aschenwacht, engine.js `bigOrder`, `B.k === 'assault'`) wirkt heute kaum: Er gibt +1 Aktion und +2 BP, setzt aber `attacked` nicht zurück (Einheiten, die schon geschossen/gekämpft haben, dürfen nicht nochmal) und hilft niedergehaltenen Einheiten nicht (`supp > 0` sperrt Schuss und Nahkampf). Enricos Entscheidung:
  - **Echter zweiter Angriff:** Jede eigene Einheit in `P.BIG_R` (3 Feldern) darf sofort noch einmal schießen **oder** in den Nahkampf, auch wenn sie in dieser Runde schon angegriffen hat (`attacked = false`, +1 Aktion, +2 BP wie bisher). Nahkampf-Grenze „höchstens halb verbrauchte BP“ für diesen Angriff aufheben.
  - **Niederhalten aufheben:** Niedergehaltene Einheiten in Reichweite sind danach voll kampfbereit (`supp = 0`).
  - Ausgeschaltet/kaputt (broken, fliehend) bleiben ausgeschlossen – bitte im Bericht nennen, was du ausgeschlossen hast.
  - Vor dem Auslösen die 3 Felder und die betroffenen Einheiten markieren; Text der Fähigkeit (Typ-Text Zeile ~205, SPECIALS, Fähigkeitsknopf F19) anpassen.
  - KI soll den Befehl sinnvoll nutzen (wenn viele eigene Einheiten in Reichweite schon angegriffen haben oder niedergehalten sind und Feinde in Reichweite stehen).
  - Danach Balance-Simulation aller Karten; falls die Aschenwacht zu stark wird, zuerst `BIG_R` auf 2 senken und melden.
  - Konkordat-Gegenstück „Halten um jeden Preis“ im Bericht kurz bewerten: Ist es im Vergleich jetzt zu schwach? (Nur Vorschlag, nichts ändern.)

## Neue Töne (nach Paket C, vor Paket D)
In `sound-quelle/_neu/` liegen 25 neue Töne (mp3, Pixabay-Downloads, Enrico 2026-11-20). Ziel: Enrico hört sie im **Ton-Pult** durch und wählt je Einheit aus. Dafür:
1. Sinnvoll in die passenden Unterordner von `sound-quelle/` einsortieren (z. B. `Monster`, `Heavy Mech guns`, `Infantry Guns`, `Impacts`, `Footsteps robot mud marching`, `Repair reload heal etc`) – `_neu` danach leer lassen, nicht löschen. Sicherungsregel (robocopy) beachten.
2. Brauchbare Ausschnitte in `tools/sound_bau.json` aufnehmen (lange Dateien schneiden; „x5“-Dateien in Einzeltöne teilen), als **zusätzliche Auswahl** in den passenden Tonplätzen/Gruppen, sodass sie im Ton-Pult wählbar sind. Bestehende Zuordnungen nur dort ändern, wo der Vorschlag unten klar besser passt.
3. Vorschlag des Beraters (nach Dateinamen, bitte nach Gehör prüfen):
   - **Löwenoger** (Brüllen/Löwengebrüll-Fähigkeit, Anwählen, Getroffen): `dffdv-lion-roars-with-growls-and-inhales`, `soundzee-lion-snarl-growl`, `freesound_community-angry-growl`, `freesound_community-robot-tiger-roar` (mechanischer Löwe – evtl. auch Kreuzschreiter)
   - **Schreiter / Eisenknecht / Hünen** (Schritte): `bannythecoolio-large-mech-robot-steps`, `kalsstockmedia-dinosaur-monster-heavy-foot-steps`, `universfield-heavy-walking-footsteps` (Hünen)
   - **Roboter-Brüllen/Stimme** (Eisenknecht, Schreiter Aschenwacht, später Dämonen): `daviddumaisaudio-robotic-monster-roars-x5`, `freesound_community-robotic-monster-roar`, `freesound_community-robotic_voice`
   - **Schwere MGs** (Hünen, Turmschreiter, Kampfanzüge): `dragon-studio-machine-gun-sfx`, `freesound_community-066496_heavy-machine-gun-50-caliber`, `yodguard-machine-gun-5`
   - **Schrot** (Löwenoger-Flinte): `freesound_community-shotgun-03`, `freesound_community-shotgun-firing-3`
   - **Kanone / schwerer Schuss** (Landkoloss, Sturmpanzer, Geschütze): `freesound_community-cannon-shot`, `soundtaker-heavy-shot-sound`
   - **Schwere Treffer / Nahkampf großer Einheiten** (Säge-/Klauenschreiter, Schildwall, F48-Wucht): `yodguard-a-massive-axe-impact-hitting-metal-1/-2`, `dragon-studio-heavy-impact-loud`, `lordsonny-heavy-cineamtic-hit`, `cyberwave-…-sword-cut`
   - **Nachladen**: `daviddumaisaudio-gun-mechanical-reload-05`, `freesound_community-pistol-cock` (Hauptmann/Pistole)
   - **Versorgung / Kulisse**: `spinopel-military-logistics` (57 s) – prüfen, ob als Versorgungston oder leise Kulisse brauchbar.
4. Lizenzen in `CREDITS.md` nachtragen (Pixabay-Lizenz, Urheber aus Dateinamen).
5. `sound_bau.mjs`, Ton-Pult (`tonpult_bau.mjs`), Tonprobe und Spiel neu bauen, committen, pushen.
6. Bericht: Liste „neuer Ton → Platz/Gruppe“, was nicht gepasst hat, und kurze Anleitung für Enrico, wo er die neuen Töne im Ton-Pult findet.

- **F49 (neu, Enrico 2026-11-20, zusammen mit den neuen Tönen):** Wenn sich manche **Aschenwacht**-Einheiten bewegen, läuft eine Musik-/Marschtrommel („düdüm, düdüm“). Das soll bei Bewegung nicht sein. Prüfen, welche Bewegungstöne der Aschenwacht eine Trommel enthalten (Marsch-Platz, `mix`, Seiten-Varianten), und die Trommel dort entfernen – Bewegung nur mit Schritten/Ausrüstung/Motor. Gleich beim Konkordat-Marsch mitprüfen (F9: Trommel nur leise darunter – falls sie dort auch noch auffällt, ebenfalls raus). Im Bericht nennen, welche Einheiten betroffen waren.

## Antworten von Enrico (2026-11-20, zu Bericht Paket A)
- **F15:** „Text / Symbole / aus“ reicht so. **Neu:** Schadenszahlen in drei Farbstufen nach Höhe des Schadens – gelb (wenig), hellrot (mittel), intensives Rot (viel), damit man sieht, wenn es richtig gekracht hat. Schwellen selbst sinnvoll wählen (z. B. nach Anteil an den Lebenspunkten des Ziels), im Bericht nennen. Passt zu Paket C.
- **F3/F7:** Schriftgröße bleibt vorerst so; Enrico beurteilt sie beim nächsten Spieltest.

## Antworten von Enrico (2026-11-20, zu Bericht Paket F)
- **F44: Variante A.** Keine Welle mehr; die Gegnerarmee bekommt von Anfang an zusätzliche Einheiten (etwa drei Viertel der bisherigen Welle), über die ganze Breite verteilt. Menge per Simulation auf ~50 % abstimmen. Gilt für alle Karten mit Welle, für beide Seiten (wer gegen den Spieler spielt). Nach Paket B umsetzen, im Bericht die neuen Startarmeen und Siegquoten nennen.
- **F43:** Ja – Einstellung in den Optionen „KI: ruhig / angriffslustig“, Standard **angriffslustig**. Gehört zu Paket D (Bedienung).

## Antworten von Enrico (2026-11-20, zu Bericht Paket B/C)
- **F44:** Ja – wo eine Karte auch ohne Welle weit von 50 % liegt, darfst du **beide Startarmeen** anpassen (Konkordat und Aschenwacht: Einheiten dazu oder weg), bis jede Karte bei ~50 % liegt. Im Bericht je Karte alte/neue Armee und Siegquote nennen.
- **F21:** Enrico meint: Bei kleinen Einheiten im Graben sieht er unter Beschuss den Lebensbalken nicht. Ist ihm egal – **darf so bleiben**. F21 schließen, nichts ändern, nicht weiter suchen.

## Erledigt
- [x] 1. Postfach-Regel in CLAUDE.md (eb75779)
- [x] 2. Paket A (678cd04)
- [x] 3. Paket F: F43 erledigt (968e0ae); F44 Vorschlag im Bericht, wartet auf Entscheidung
- [x] 4. Paket B (33038ac)
- [x] 5. Paket C (ffdf027, 5d5b382, 8dc70ec, 84c62a7, f383ac0); F21 geschlossen
- [x] 6. Paket D (8a58a6b)
- [ ] F44 Startarmeen: Feinabstimmung läuft
