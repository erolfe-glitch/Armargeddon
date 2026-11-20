# Aktueller Auftrag (von Claude/Berater, 2026-11-20 abends)

**Modell: Opus.** Grundlage: `entwurf/SPIELTEST_LISTE.md`, Abschnitt „Funde Spieltest Runde 4“ (F1–F44, Pakete A–F). Datei frisch lesen.

## Reihenfolge
1. **Postfach-Regel** aus `entwurf/postfach/LIESMICH.md` in CLAUDE.md übernehmen (kurz, Verweis auf LIESMICH.md). Committen.
2. **Paket A** – Fehler, Lesbarkeit, Menüs. Zuerst F12 (gelbe Kugeln beim Drahtschneiden).
3. **Paket F** – KI und Gegnerarmee (F43, F44). Bei F44 erst Vorschlag in BERICHT.md, Entscheidung durch Enrico abwarten; F43 schon umsetzen.
4. **Paket B** – Ton.
5. **Paket C** – Effekte, Animation, Kamera.
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
  Hinweise: In der Bildmitte oben steht eine **blasse Geisterfigur** (Bewegungsunschärfe) – ignorieren/weglassen, keine echte Pose. Erdkrümel an den Füßen (Pose 1) und Blutspritzer (Pose 4) beim Freistellen entfernen. Aschenwacht-Bogen folgt.
Mit Nahtmethode freistellen, Plastizität, gleicher Maßstab wie die Grundbögen. Weitere Posenbögen folgen nach `entwurf/POSEN_PROMPTS.md`.

- **F47 (neu, Paket C, zusammen mit F16):** Eiserne Hünen – der Schuss (Leuchtspur/Mündungsfeuer) startet zu hoch, etwa auf Brusthöhe statt an der Mündung des schweren MG. Mündungspunkt an das Laufende im Figurenbild legen, beide Figuren. Dabei alle Einheiten mit eigenem Mündungspunkt kurz durchsehen (Schreiter, Kolosse, Löwenoger-Schrot) und im Bericht nennen, was angepasst wurde. Unabhängig von späteren Posen – die Hünen haben keinen Posenbogen.

## Antworten von Enrico (2026-11-20, zu Bericht Paket A)
- **F15:** „Text / Symbole / aus“ reicht so. **Neu:** Schadenszahlen in drei Farbstufen nach Höhe des Schadens – gelb (wenig), hellrot (mittel), intensives Rot (viel), damit man sieht, wenn es richtig gekracht hat. Schwellen selbst sinnvoll wählen (z. B. nach Anteil an den Lebenspunkten des Ziels), im Bericht nennen. Passt zu Paket C.
- **F3/F7:** Schriftgröße bleibt vorerst so; Enrico beurteilt sie beim nächsten Spieltest.

## Erledigt
- [x] 1. Postfach-Regel in CLAUDE.md (eb75779)
- [x] 2. Paket A (678cd04)
- [x] 3. Paket F: F43 erledigt (968e0ae); F44 Vorschlag im Bericht, wartet auf Entscheidung
