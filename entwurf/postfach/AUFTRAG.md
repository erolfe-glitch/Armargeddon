# Aktueller Auftrag (von Claude/Berater, 2026-11-20 abends)

**Modell: Opus.** Grundlage: `entwurf/SPIELTEST_LISTE.md`, Abschnitt „Funde Spieltest Runde 4“ (F1–F44, Pakete A–F). Datei frisch lesen.

## Reihenfolge
1. **Postfach-Regel** aus `entwurf/postfach/LIESMICH.md` in CLAUDE.md übernehmen (kurz, Verweis auf LIESMICH.md). Committen.
2. **Paket A** – Fehler, Lesbarkeit, Menüs. Zuerst F12 (gelbe Kugeln beim Drahtschneiden).
3. **Paket F** – KI und Gegnerarmee (F43, F44). Bei F44 erst Vorschlag in BERICHT.md, Entscheidung durch Enrico abwarten; F43 schon umsetzen.
4. **Paket B** – Ton.
5. **Paket C** – Effekte, Animation, Kamera.
5b. **Neue Töne** aus `sound-quelle/_neu/` einbauen (Abschnitt unten) – nach Paket C, vor Paket D.
5c. **Nachträge F49–F66** (kamen dazu, als Paket C/D schon fertig waren): zuerst prüfen, was davon schon erledigt ist; Rest **jetzt vor Paket E** abarbeiten – Töne + F49, Blut F50, gleichzeitiger Nahkampf F51, Moralbalken F52; Regeln F53 (Generalangriff) und F54 (Sturmrollen) zusammen mit Paket E. F55/F57 (Fehler) und F56 (Lauer-Kamera) gleich mit.
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

- **F51 (geändert, Enrico 2026-11-20 22:47, Paket C, zu F28/F48):** Kamera-Zoom beim Nahkampf ist gut und gefällt schon besser. Heute schlägt erst die eine Seite, dann Pause, dann die andere – Enrico möchte stattdessen: **beide schlagen gleichzeitig zu** (Hiebe beider Seiten überlappend, Getümmel), und **danach wird der Schaden auf beiden Seiten gleichzeitig gezeigt** (ein gemeinsamer Wucht-Moment aus F48: kurzer Stillstand, Rütteln, Blut/F50 an beiden, beide Schadenszahlen zugleich, Getroffen-Posen zugleich). Erst danach Ergebnis (Zurückweichen, Flucht, Vernichtung). Gesamtdauer etwa wie heute oder kürzer. Gilt für alle Nahkämpfe, auch für „kurz“ ohne Zoom. (Ersetzt die vorige Fassung „Schlagabtausch abwechselnd“.)

- **F54 (neu, Enrico 2026-11-20, Regel Paket E + Animation Paket C):** **Panzer rammen nicht mehr im normalen Nahkampf.** Heute fährt ein Panzer im Nahkampf mehrfach vor und zurück (Hieb-Folge aus F28) – sieht albern aus. Neu:
  - **Panzer** (Landkoloss, Sturmpanzer und andere Kettenfahrzeuge; Schreiter mit Klauen/Sägen bleiben im Nahkampf) haben **keinen normalen Nahkampf** mehr; sie **schießen**.
  - Dafür neue Fähigkeit **„Sturmrollen“**: Der Panzer rollt in eine benachbarte (oder auf kurzem Weg erreichbare) **Infanterie-/Geschützeinheit** hinein – **ein einziger schwerer Aufprall** statt mehrerer Stöße. Wirkung als Vorschlag, per Simulation abstimmen: kräftiger Schaden, Niederhalten, Moralverlust; Ziel weicht ein Feld zurück, wenn Platz ist, sonst mehr Schaden. Kostet die Aktion, Abklingzeit (z. B. 2 Runden), nicht gegen andere Panzer/Schreiter (oder stark verringert – Vorschlag machen). Draht wird dabei wie beim Überrollen niedergewalzt.
  - Animation: Anlauf, ein Aufprall mit Stillstand/Rütteln/Staub, Blut (F50), Ziel fliegt/rutscht zurück, Panzer bleibt stehen – kein Hin- und Herfahren. Tiefes Kettenrollen + schwerer Aufprall (neue Töne aus `_neu`, z. B. `dragon-studio-heavy-impact-loud`, `lordsonny-heavy-cineamtic-hit`). Löst die F48-Kampfszene aus.
  - KI soll Sturmrollen nutzen. Fähigkeitstexte (F19) anpassen. Bevor gebaut wird: Regelvorschlag mit Zahlen in BERICHT.md, Enrico entscheidet (nicht blockierend – solange am Rest weiterarbeiten).

- **F55 (neu, Enrico 2026-11-20, Fehler):** Eine Einheit in **Feindberührung/Nahkampf** kann nicht schießen, aber trotzdem **Feuerbereitschaft** wählen (engine.js `canOverwatch` prüft keine Nachbarn). Feuerbereitschaft sperren, solange ein aktiver Gegner benachbart ist (gleiche Bedingung wie beim Schießen); Knopf ausgegraut mit kurzem Grund. Gleich mitprüfen: MG-Sperrfeuer und andere Bereitschaften in Feindberührung.

- **F56 (neu, Enrico 2026-11-20, Paket C-Art, wie XCOM 2):** Wenn eine Einheit (eigene oder gegnerische) in das Schussfeld einer Einheit in **Feuerbereitschaft** oder eines MG im **Sperrfeuer** läuft und der Lauerschuss ausgelöst wird: Bewegung kurz anhalten, Kamera zoomt kurz auf Schützen und Ziel (F34/F48-Kamera, Vignette), kleines Kopfzeichen/Auge über dem Schützen („Lauer!“), Schuss mit Mündungsfeuer und Trefferbild, Schadenszahl, kurzer Halt – dann zurück, Bewegung läuft weiter (oder endet, falls niedergehalten/vernichtet). Etwa 1 s, per Klick überspringbar, folgt der Option „Kampfszenen: an / kurz / aus“. Gilt auch in KI-Zügen.

- **F57 (neu, Enrico 2026-11-20, Fehler Anzeige):** Wenn ein MG in Feuerposition/Sperrfeuer geht (wahrscheinlich auch bei anderen Bereitschaften/Fähigkeiten), werden **für einen Moment alle Einheiten wieder als aktiv angezeigt** – auch die, die schon ausgegraut/fertig sind. Verwirrt jedes Mal. Ursache suchen (vermutlich wird beim Abspielen des Ereignisses die Darstellung ohne den Fertig-Zustand neu gezeichnet) und beheben: ausgegraute Einheiten bleiben durchgehend ausgegraut. Alle Aktionen kurz durchtesten (Sperrfeuer, Feuerbereitschaft, Eingraben, Befehl, Fähigkeiten, Abprotzen).

- **F58 (neu, Enrico 2026-11-20, Grafik):** **Reitereinheiten mit 3 statt 2 Reitern** (beide Seiten: Konkordat-Reiter und Aschenwacht-Lanzenreiter `lanzeD`, ggf. weitere Reiter). Zwei wirken mickrig. Aufstellung leicht gestaffelt und etwas überlappend: zwei vorn links/rechts wie heute, der dritte **hinten in der Mitte**, etwas versetzt, sodass man sein Pferd noch gut sieht (Tiefe passend zur schrägen Ansicht, hinterer Reiter zuerst gezeichnet). Prüfen, ob es auf dem Feld Platz hat und nicht in Nachbarfelder ragt; wenn zu eng, Reiter minimal verkleinern oder Abstand anpassen und im Bericht mit Screenshot (vorher/nachher, beide Seiten) zeigen. Posen/Bewegung/Nahkampf/Getroffen für alle drei.

- **F59 (neu, Enrico 2026-11-20, Regel Paket E):** **Sturmpanzer** (Aschenwacht, `sturmpz`) hat im Bild Bordschützen, aber keine Zweitwaffe. Enricos Wahl: **Bord-MG zusätzlich** – Breitseite bleibt, dazu Zweitwaffe „Bord-MG“ wie beim Landkoloss (`zweit`, Seiten-MG: einmal je Runde, 2 Felder, ×`P.ZWEIT_MUL` 0,5, nicht gegen Kolosse). Mündungspunkte an den Bordschützen im Bild messen (F47-Verfahren), MG-Ton. Fähigkeitstexte/SPECIALS anpassen, KI nutzt die Zweitwaffe. Balance auf Grauwall/Sankt Ruß simulieren; wird die Aschenwacht zu stark, Kosten des Sturmpanzers erhöhen (Vorschlag im Bericht).

- **F60 (neu, Enrico 2026-11-20, Bedienung + Fehlersuche):** Enrico zieht Infanterie bewusst nur bis zum Feld **vor** dem Marschfeld („Marsch – danach keine Aktion mehr“), trotzdem kann sie danach oft **nichts mehr tun**. Laut Regeln darf sie nach normalem Ziehen noch schießen – vermutlich greifen die Fallen: Ende neben einem Gegner = im Nahkampf gebunden (`held`, kein Schuss) und bei mehr als halb verbrauchten BP auch kein Sturm (`nahFrei`); kein Ziel in Reichweite/Sicht; niedergehalten/zurückgewichen.
  1. **Erst prüfen, ob ein echter Fehler vorliegt:** Infanterie normal ziehen (ohne Marsch, nicht neben Gegner, Ziel in Reichweite und Sicht) → muss schießen können. Mehrere Typen und Gelände testen (auch Draht/Schlamm/Mine, wo BP verfallen – Aktion muss bleiben). Ergebnis im Bericht.
  2. **Vorschau beim Ziehen:** Jedes erreichbare Feld zeigt klein, was danach noch geht: **Gewehr** (Schuss auf mindestens ein Ziel möglich), **Schwert** (Sturm möglich, schon vorhanden), **ausgegraut/durchgestrichen** (danach weder Schuss noch Sturm – z. B. gebunden und zu viel Bewegung verbraucht). Im Feld-Hinweis kurz der Grund („neben Feind: gebunden, Sturm nur bis halbe Bewegung“).
  3. Im Einheiten-Panel nach dem Zug, wenn keine Aktion mehr geht, kurzer Grund statt nur ausgegrauter Knöpfe.

- **F61 (neu, Enrico 2026-11-20, Bedienung, wie XCOM 2):** Bewegungspunkte und Aktion sind schlecht zu sehen (winziger Stiefel unten im Menü); Enrico dachte, Schießen koste 2. Enricos Wahl: **Anzeige an der Figur wie XCOM**:
  - Auf der Karte unter Lebensbalken und Moralbalken (F52): **kleine Stiefel-Punkte** für die Bewegungspunkte (frei hell, verbraucht grau) und ein deutliches **Aktions-Symbol** (frei = hell/leuchtend, verbraucht = grau). Gemalter Stil wie die übrigen Anzeigen, gut lesbar, darf nicht überladen – zusammen mit F52 als eine saubere Leiste unter der Figur planen. Gegnerische Einheiten: nur zeigen, wenn es nicht stört (Vorschlag machen).
  - Im Einheiten-Panel dasselbe **groß** mit Zahl („Bewegung 2/3 · Aktion frei“).
  - Alle Kostentexte auf die neue Sprache prüfen: Schießen/Nahkampf/Fähigkeit = „die Aktion“, Ziehen = Bewegungspunkte; nirgends mehr „2 Punkte“ o. Ä. (auch die Schlagwort-Chips, siehe Bericht Paket A). Regel-Fenster/Kurzhilfe: 3 Sätze zu Bewegung + Aktion + Marsch.
  - Screenshot in den Bericht (eigene und gegnerische Einheit, ausgewählt und nicht).

- **F62 (neu, Enrico 2026-11-20, Fehler Anzeige):** Deutscher Mörser (Aschenwacht **Minenwerfer**, „Ziehen oder feuern“) wurde bewegt → ist ausgegraut, aber die Oberfläche zeigt **trotzdem noch an, dass er feuern kann** (Knopf/Zielfelder). Anzeige und Regel in Einklang bringen: Nach dem Ziehen keine Feuer-Anzeige mehr (oder, falls die Regel Feuern doch erlaubt, nicht ausgrauen). Alle Einheiten mit „Ziehen oder feuern“ / `noMoveFire` / MG ab-/aufgebaut / Geschütze auf-/abgeprotzt mitprüfen: Ausgrauen, Knöpfe und Zielfelder müssen immer zur Regel passen.

- **F63 (neu, Enrico 2026-11-20 23:40, Nachbesserung F51/F48):** Gleichzeitiger Nahkampf ist besser, aber: **Nach dem Rauszoomen schlägt die andere Einheit noch einmal nachträglich zu** und bekommt ihren Schaden (regelkonform) – das sieht man dann kaum noch, und es nimmt die Wucht. Ändern:
  - **Alles, was zu einem Nahkampf gehört** (Angriff, Gegenschlag, Folge-/Freischläge, Schadenszahlen beider Seiten, Zurückweichen/Flucht/Vernichtung, Blut), läuft **innerhalb der Zoom-Szene**. Kamera zoomt erst raus, wenn das letzte Nahkampf-Ereignis abgespielt ist. Ereignisse vor dem Abspielen bündeln (auch die, die die Engine erst danach erzeugt).
  - **Insgesamt kürzer:** Ziel etwa 2–2,5 s bei 1× (heute bei ½× 4,4 s), Wucht-Moment bleibt, Wartezeiten dazwischen raus.
  - Gilt genauso für KI-Züge und für „kurz“ ohne Zoom. Kurzes Video/Screenshotfolge in den Bericht.

- **F64 (neu, Enrico 2026-11-20 23:41, Ton + Effekte):**
  1. **Gewehre der Aschenwacht klingen zu schwach** – sollen mehr knallen/scheppern. Früher gab es schon deutlich bessere Gewehrtöne. Prüfen, was sich seit Paket B (F29 Anschnitt, F30 feste Waffentöne) geändert hat; die besten Kandidaten aus `sound-quelle/Infantry Guns` und den alten Spieltönen (`aus_spiel`) im Ton-Pult als Auswahl anbieten, Standard auf den kräftigsten setzen. Gleich auch Konkordat-Gewehr gegenhören.
  2. **Einschlaggeräusche bei Treffern:** Wenn Schüsse in eine Einheit einschlagen, ein hörbarer Treffer (dumpfer Körpertreffer, Erde/Holz/Stein je Gelände, Metall-Pling bei Panzern/Schreitern/Kampfanzügen). Leicht versetzt nach dem Schuss, nicht bei jedem Einzelschuss der Salve, damit es nicht matscht.
  3. **Etwas blutiger auch bei Beschuss** (Grimdark, Comic-Stil, kein realistischer Gore): Gewehr-/MG-Treffer kleiner Blutnebel, **Panzer-/Kanonen-/Granattreffer auf Infanterie** Erd- und Blutfontäne, Stofffetzen/Erdklumpen, Blutflecken am Boden. Zusammen mit F50. Ein neuer Effektbogen von Enrico (Gemini) kommt nach `ui-quelle/` – falls er da ist, verwenden.

- **F65 (neu, Enrico 2026-11-20, Fehler Effekt):** Der **Sägeschreiter** hat auf einen Panzer geschossen – die Leuchtspuren **ziehen nach oben**, als wollten sie über den Panzer hinweg. Zielpunkt der Schüsse auf die Mitte/den Rumpf des Ziels legen (nicht über die Figur), Flugbahn flach von Mündung zu Ziel. Alle Schützen gegen große Ziele (Panzer, Schreiter, Kolosse) und kleine Ziele kurz prüfen; gilt auch für die Lauer-Schüsse (F56).

- **F66 (neu, Enrico 2026-11-20, Regeln Paket E): Bonussystem „Schere-Stein-Papier“ – Enricos Wahl: klares Dreieck.**
  - **3 Panzerklassen:** ungepanzert (Infanterie, Reiter, Geschützbedienung), leicht gepanzert (Kampfanzüge, Eiserne Hünen, Löwenoger …), schwer gepanzert (Panzer, Kolosse, Schreiter, Eisenknecht).
  - **Waffenarten:** Gewehr/MG, Schrot, panzerbrechend (Panzerbüchse, Kanone/Geschütz direkt, Haftladung, Pioniere), Explosiv/Flamme (Granaten, Mörser, Minenwerfer, Flammen – gut gegen Deckung/Gruppen), Nahkampf (Klinge/Keule vs. Säge/Klaue/Rammen).
  - **Feste Werte ×1,5 / ×1 / ×0,5** je Waffenart gegen Panzerklasse (Tabelle vorschlagen), statt vieler Einzelboni. Bestehende Sonderboni (×2 gegen Kolosse, ×1,5 gegen Kolosse, Beschuss ×0,5 Kampfanzug, Immunitäten) darin aufgehen lassen; Ausnahmen nur, wenn sie eine Einheit wirklich ausmachen – im Bericht begründen.
  - **Empfindlichkeiten nach Rolle (Enrico 23:49):** Zusätzlich zur Panzerklasse eine Rollen-Schwäche, vor allem **im Nahkampf**: MG-Trupps, Geschützbedienungen, Mörser/Minenwerfer, Scharfschützen/Pirschjäger, Sanitäter, Melder/Signal, Fernsprech „sehen im Nahkampf alt aus“ (z. B. Verteidigung im Nahkampf ×0,5 bzw. Angreifer ×1,5 gegen sie, und kein oder schwacher Gegenschlag). Nahkampf-Spezialisten (Sturmtrupps, Schildwall/Schwere Grabenwacht, Löwenoger, Kampfanzüge) entsprechend stark. Ggf. weitere Rollen-Schwächen vorschlagen (z. B. Reiter gegen MG, Geschütze gegen Flankenangriff). In derselben Tabelle zeigen und als Symbol „schwach im Nahkampf“ anzeigen.
  - **Anzeige:** Im Tooltip/Panel jeder Einheit Symbole „stark gegen / schwach gegen“ und Panzerklasse; Beschreibungen und SPECIALS so, dass Text und Werte **immer übereinstimmen** (Text am besten aus den Werten erzeugen). Beim Zielen auf einen Gegner den wirksamen Faktor kurz anzeigen (z. B. „×1,5 panzerbrechend“).
  - **Bewertung unter dem Einheitenbild (Enrico 23:52):** Im Einheiten-Panel direkt unter dem kleinen Bild eine Reihe winziger **Medaillen Bronze / Silber / Gold** je Kategorie (Vorschlag: gegen Infanterie, gegen Panzer, Nahkampf, ggf. Reichweite/Zähigkeit) – Bronze = schwach (×0,5), Silber = normal, Gold = stark (×1,5). Gemalter Stil, auf einen Blick lesbar. Die **genaue Beschreibung** (Tooltip/Pergament-Details) erklärt dieselben Punkte noch einmal in Worten mit Symbol und Faktor, damit man es nachlesen kann. Alles aus denselben Werten erzeugt.
  - **Vorgehen:** Zuerst Tabelle in BERICHT.md (jede Einheit → Panzerklasse + Waffenart, Faktortabelle, was sich gegenüber heute ändert). Enrico bestätigt per Berater, dann bauen (bis dahin an Anderem weiterarbeiten). Danach Balance-Simulation Grauwall + Sankt Ruß, KI-Zielwahl nutzt die Faktoren.

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

## Antworten von Enrico (2026-11-20 23:13) – F44 nur für die neuen Karten
- **Neu gemacht sind bisher nur zwei Karten: Grauwall und Sankt Ruß.** Die übrigen Karten sind alt und werden später ohnehin neu gebaut.
- **F44 deshalb nur auf dem Grauwall** umsetzen und abstimmen (Welle weg, Startarmeen beider Seiten anpassen bis ~50 %). Sankt Ruß hat keine Welle – nur zur Kontrolle mitmessen.
- **Laufende Abstimmung für die anderen sieben Karten abbrechen**, dort nichts ändern (Welle bleibt vorerst, wie sie ist). Grund auch: die Simulationen lasten den Rechner aus und Enricos Spiel ruckelt dabei.
- Lange Simulationen künftig nur für Grauwall und Sankt Ruß, außer der Auftrag sagt ausdrücklich etwas anderes.

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
- [x] F44 nur Grauwall: Welle weg, Aschenwacht 10 statt 8 Grenadiere (995b8ad); andere Karten unverändert, Abstimmung abgebrochen
- [x] 5b. Neue Töne (10b9b3a)
- [ ] 5c. Nachträge: erledigt F49 (10b9b3a), F50/F52 (13b2a89), F51 (f3d9c26), F56/F57 (8b580b2), F53/F55 (995b8ad), F60/F62 (d521862), F61 (19c8ff6), F58 (dieser Commit); offen F54 (Vorschlag), F59, F63–F66
