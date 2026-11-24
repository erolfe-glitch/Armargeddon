## 2026-11-24 – Paket A4: Gelände-Chroniken, Ton-Pult-Rest, „1 Feld“ (`32be418`)

Gepusht. Tests: `tonpult_test` 93/93, `test_regeln` und `test_kommentare` in Ordnung. Keine Regeländerung, keine Simulation.

- **Punkt 30 – Gelände-Chroniken:** alle 27 Geländearten haben `chronik: { quelle, text }` aus `entwurf/welt/gelaende_chroniken.md` (keine fehlt, keine übrig). Die 17 alten Weltkriegstexte sind weg. Der Feld-Tooltip zeigt „Aus den Chroniken“, darunter die Quelle kursiv, dann den Text. Bild: `entwurf/probe/chronik/feld_friedhof_1920.jpg` (Friedhof Sankt Ruß).
- **Weitere Weltkriegsreste im Spiel gefunden und entfernt:**
  - Siegbild: der Kasten „Wie war es im echten Krieg?“ (Cambrai 1917, drei Lernfragen). Er ist ganz raus.
  - Startmenü-Hinweis „Waffen, Gelände und Taktik entsprechen dem Ersten Weltkrieg 1914–1918“ → „Eine eigene Welt im Stil des Grabenkriegs.“
  - Schalter „Kampfmaschinen: Ohne“: „wie im Ersten Weltkrieg“ → „Nur Truppen und Gerät des Grabenkriegs, ohne Kampfmaschinen.“
  - README (Einleitung „Gedacht auch für den Geschichtsunterricht“, „Lerntexte“) umgeschrieben.
  - Die Suche nach Somme, Passchendaele, Reims, Verdun, Flandern, Argonnen, Loos, Yser, Lorette und Albert findet im Spiel-Code nichts mehr. Treffer gibt es nur noch in eingebetteten Bild- und Tondaten (zufällige Buchstabenfolgen) und in einem Quelldateinamen eines Tons („adrian_sommer“, CREDITS/sound_bau). Die Kartenzufallszahl 1917 bleibt, sie ist nur ein Startwert und nirgends sichtbar.
- **Punkt 29 – Ton-Pult:** Das erste „+ ins Paket“ an einer Stelle, an der das Werks-Paket klingt, nimmt alle seine Töne angekreuzt mit, der neue kommt dazu. Ist ein einzelner Ton gewählt, wird er wie bisher der erste. Neue Prüfung im Pult-Test.
- **Punkt 31 – „1 Feld“:** Die neue Hilfsfunktion `felder(n)` in ui.js wird an 19 Stellen benutzt: Werte-Kasten „Schuss“ im Info-Fenster, Reichweite in der Einheitenkarte, Zweitwaffe, Breitseite, Sicht, Sturmlauf, Sprung, Banner, großer Befehl, Anspannen, „1 Feld“/„1 Feldern“. Die Schlagworte („Schrotflinte 1 Feld“, „Zweitwaffe (Nachbarfeld)“) waren schon richtig. Die Spanne „1–n Felder“ der Panzergranate bleibt so.

### Fragen an Enrico
- Keine.

---

## 2026-11-24 – Paket A3: Chroniken-Texte statt „Im echten Krieg“ (Punkt 28) (`639f648`)

Gepusht. Tests: `test_regeln` in Ordnung (54 Einheiten), `test_kommentare` sauber. Keine Regeländerung, keine Simulation.

- **Alle 54 Einheiten** haben jetzt den Chroniken-Text aus `entwurf/welt/weltbibel.md`: in TYPES ersetzt `chronik: { quelle, text }` das alte Feld `real` (Weltkriegsfakten sind aus den Einheiten raus). Kein Typ ohne Text, kein Text ohne Typ, keiner länger als 280 Zeichen.
- **Anzeige „Aus den Chroniken“**, darunter die Quellenzeile klein und kursiv, dann der Text: im Info-Fenster, in der ausführlichen Einheitenkarte und in den Nachschub- und Armee-Details (eine gemeinsame Funktion `chronikHtml` in ui.js).
- **Blaue Legion:** dieselben Einheiten wie das Konkordat, damit automatisch dieselben Texte.
- `test_regeln` verlangt jetzt Quelle und Text (höchstens 280 Zeichen) und meldet, falls irgendwo noch ein alter `real`-Text steht.
- **CLAUDE.md:** Projektziel (Grabenkrieg-Stil, eigene Welt, Weltbibel) und Textregel wie vorgegeben umgestellt.
- Weltbibel mit eingecheckt (die Texte im Spiel stammen daraus).
- **Bilder** (1920 px): `entwurf/probe/chronik/info_oger_1920.jpg`, `entwurf/probe/chronik/info_knecht_1920.jpg` (neu erzeugbar mit `node tools/chronik_bilder.mjs [typ …]`). Für die Aufnahme wurde eine vorhandene Einheit kurz zum Oger bzw. Eisenknecht umgebaut. Der Block „Anführer“ im Eisenknecht-Bild kommt daher, die Einheit war vorher ein Hauptmann. Im echten Spiel steht er dort nicht.

### Fragen an Enrico
- **Gelände-Texte:** Die Geländearten (Trichter, Graben, Draht, Wald, Kirche, Friedhof …, 17 Stück) haben noch Weltkriegsfakten (Passchendaele, Somme, Reims …). Sie erscheinen im Feld-Tooltip als „Im echten Krieg“. Soll der Berater auch dafür Chroniken-Texte schreiben (gleiche Form: Quelle + 1–2 Sätze), oder sollen die Gelände-Texte einfach weg?

---

## 2026-11-24 – Paket A2: Ton-Pult „Eigenes Paket“ (Punkt 25) + Export 23.11. 22:17

Gepusht (`a90a934`). Tests: `tonpult_test` 92/92 (darin 10 neue Prüfungen zum eigenen Paket), `test_tonpult3_spiel` 17/17 (3 neue), `test_kommentare` sauber. Keine Regeländerung, keine Simulation, kein Ton-Spur-Volllauf (Sparregel).

### Zuerst: Enricos Export vom 23.11. 22:17 eingebaut
- `tonwahl_bau` + `ton_teilen` + Bau gelaufen. **285 von 298 Wahlen wirken im Spiel** (298 = 287 aus dem neuen Export plus 11 ältere Einträge, die im neuen fehlen); Abstellkammer 17 Töne, alle 54 Einheiten „fertig“.
- **Nicht wirksam (13), und warum:**
  - 7× „Schießen“ bei Einheiten ohne Fernkampf (Feldscher/Heiler, Signal-, Fernsprechtrupp, Meldegänger, Sturmtrupp, Eingreiftrupp): diese Zeile gibt es im Pult seit dem Abgleich Spiel == Pult nicht mehr, weil die Einheit den Ton im Spiel nie spielt. Die Wahl stammt aus älteren Exporten.
  - 1× Mineur „Stollen sprengen“: liegt jetzt unter „Gelände und Gebäude“ (dort ist eine eigene Wahl von Enrico eingetragen und wirkt).
  - 5× ohne eigene Wirkung: entweder ist die Wahl gleich dem, was das Spiel ohnehin spielt (Lautstärke/Tonhöhe 100 %), oder zwei Pult-Zeilen fallen im Spiel auf denselben Platz und die zweite überdeckt die erste (z. B. Eingreiftrupp „Schlag“ aus einem alten und dem neuen Export).
- Umgehängt (wirkt, nur anderer Platz im Spiel): bei allen Einheiten die Zeile „Tod“ (Pult zeigte „-“, das Spiel spielt `aufgerieben`), Mörser/Minenwerfer Sperrfeuer → `sperr_boom`, Gelände Stollen → `stollen_boom`.

### Punkt 25 – Eigenes Paket
- **„+ ins Paket“** als Ankreuzfeld (≥ 40 px) an jedem Ton in „Welcher Ton?“ und in „Alle Töne ansehen …“. Bei einer Zeile mit mehreren Tönen nimmt das Kreuz alle Töne dieser Zeile auf (halb angekreuzt = ein Teil davon ist drin). Im Dialog bleibt das Fenster beim Ankreuzen offen, man kann also quer durch die Rubriken sammeln (Suche hilft).
- **Start:** Ist schon ein einzelner Ton gewählt, wird er der erste im Paket; sonst beginnt das Paket leer. **„✎ Paket bearbeiten“** (erscheint, wenn an der Stelle ein Werks-Paket mit mehreren Tönen klingt) übernimmt alle seine Töne angekreuzt; dann einzeln ab- oder dazuwählen.
- **Anzeige** unter „Jetzt eingestellt“: „Eigenes Paket · n Töne“, aufklappbar, je Ton ▶ und „✕ aus dem Paket“ (nimmt nur aus diesem Paket, sortiert nichts aus). Leer gemacht = wieder wie im Spiel. Alles mit „↶ Rückgängig“.
- **Mehrere wählen:** das Paket gilt für alle gewählten Einheiten (gleiche Stelle).
- **Mischtöne** dürfen Mitglied sein (nicht in Ruf-Zeilen – Rufe können im Spiel nicht mischen, wie bisher).
- **Export:** neuer Wahltyp `pk:["schlüssel", …]`, zusätzlich Feld `paket` (Liste) zum Lesen. Alte Exporte lesen sich unverändert ein (Test mit dem Export vom 22.11.).
- **Spiel:** `tonwahl_bau` schreibt `pk` in TONWAHL (fehlende Töne fallen mit Hinweis heraus; ein Paket aus nur noch einem Ton wird zum festen Ton). `ui.js`: `pkZiehen` zieht zufällig einen, **nie zweimal hintereinander denselben**; gilt überall, wo die Pult-Wahl wirkt (Waffentöne, Treffer, Töne ohne playSound, Sprüche, Rufe, Schreiter- und Heldenstimmen).
- Test im Spiel: Paket aus 3 Tönen zweier Rubriken (Einschläge + Treffer auf Stein), 40 Schüsse: Verteilung 13/12/15, 0× derselbe Ton hintereinander.
- Bilder: `entwurf/probe/tonpult3/15_eigenes_paket.png` (Paket aus Mischton, Einschlag und Schritten für zwei Einheiten), `14_eigenes_paket_alle_toene.png` (Ankreuzen im Dialog).

### Fragen an Enrico
- Beim ersten Ankreuzen an einer Stelle, an der noch das Werks-Paket klingt, beginnt das eigene Paket **leer** (nur mit dem angekreuzten Ton). Wer das Werks-Paket erweitern will, drückt vorher „✎ Paket bearbeiten“. Passt das so, oder soll das erste Kreuz das Werks-Paket automatisch mitnehmen?

---

## 2026-11-23 – Paket A: Bedienfehler (18:30, Spieltest-Punkte 9 und 22) (`e2c793c`)

Gepusht. Tests: Partietest Grauwall und Krähenfurt fehlerfrei, darin die drei neuen Prüfungen; test_kommentare sauber. Keine Regeländerung, deshalb keine Simulation.

### 18:30 Geschütze ohne Ziel
- **Ursache 1:** Beim Aufbau der Knöpfe für Geschütze brach die Liste vor dem „Fertig“-Knopf ab, deshalb gab es nie einen Haken. Jetzt hat jede Einheit „Fertig“ (Taste 5, Leertaste, E).
- **Ursache 2:** Geschütze galten als „noch nicht fertig“, sobald irgendein Feld in Reichweite lag, auch ein leeres.
  - Jetzt zählt nur ein Gegner, den sie beschießen können (Sprenggranate oder Sperrfeuer).
  - Einheiten in Stellung (MG aufgebaut, Geschütz abgeprotzt), die nicht ziehen können und kein Ziel haben, werden automatisch grau. Abbauen/Aufprotzen allein hält sie nicht mehr offen.
  - Sie bleiben anwählbar, man kann also trotzdem abbauen oder aufprotzen.
  - Das gilt für alle Einheitenarten (Mörser, Haubitze, Minenwerfer, Scharfschützen, MG). Ballon und Scharfschützen hatten diese Ursache nicht, sie folgten schon der allgemeinen Regel.

### Punkt 9 – nur ein Modus
- Es gibt jetzt nur einen Bedienmodus gleichzeitig: Angriffsart (Kanone/Nahkampf), Geschützart (Sperrfeuer, Gas), Feld-Fähigkeit (Fähigkeit, Zweitwaffe, Draht schneiden, Rammen, Faustsalve) oder Hilfe (Versorgen, Meldegänger, Bergen).
- Ein neuer Knopf löst den alten ab. Abbrechen geht mit demselben Knopf noch einmal, mit **Esc** oder mit **Rechtsklick**; es erscheint die Meldung „Abgebrochen.“.
- **Nicht ausführbar → sofort zurück** mit kurzem Hinweis, warum. Beispiele: „Zweitwaffe: kein Ziel in Reichweite oder Schussfeld.“, „Sperrfeuer: kein Zielfeld (Abklingzeit, Reichweite oder keine Sicht).“, „Draht schneiden: kein Drahtfeld daneben.“
- Befehle, Marsch, Feuerbereitschaft und MG-Sperrfeuer sind sofort-Aktionen ohne Modus; sie können nicht hängen bleiben.

### Punkt 22 – Fähigkeit durch Anklicken
- **Ursache:** Ein eingeschalteter Fähigkeitsmodus blieb aktiv, wenn man über „Nächste Einheit“, Tasten oder das Panel zu einer anderen Einheit wechselte. Danach löste ein Klick auf eine passende eigene Einheit die Fähigkeit aus (Munition an die Feldkanone).
- Jetzt löscht jeder Wechsel der gewählten Einheit den Modus. Ohne Modus wählt ein Klick auf eine eigene Einheit sie nur aus.
- Das gilt für alle Fähigkeiten mit Ziel (Munition, Reparieren, Versorgen, Meldegänger, Bergen, Entgiften, Befehle …).

### Tests (`tools/test_partie.mjs`, neu)
- Haubitze ohne Gegner: „Fertig“-Knopf da, kein Grund offen zu bleiben.
- Panzer: Kanone → Zweitwaffe → Kanone → Kanone (aus) → Esc: nie zwei Modi.
- Versorgungstrupp mit Munitionsmodus, dann Feldkanone gewählt: Modus weg, keine Munition. Danach ein Klick ohne Modus auf die Feldkanone: sie wird nur ausgewählt.
- Nebenbei behoben: Das Schussfeld wurde für eine Einheit außerhalb der Karte gezeichnet. Das ging nur im Test auf, ist aber jetzt auch im Spiel abgesichert.

Als Nächstes laut Reihenfolge: **Paket A2** (Ton-Pult „Eigenes Paket“, Punkt 25).

## 2026-11-23 Abend – Ton-Pult 3 (Auftrag 16:50): einfach, vollständig je Einheit, Abstellkammer, Mischtöne

Gepusht: `ea5037c` (Teil 1: neues Pult), `6627dca` (Teil 2: Spiel und Pult abgeglichen), dazu der Abschluss-Commit mit `index.html` (Titel „Ton-Pult 3, Abschluss“).
Pult: `tonpult.html` (online über GitHub Pages wie bisher). Bilder: `entwurf/probe/tonpult3/`.

**Tests:** `tonpult_test` 82/82 · `test_tonpult3_spiel` 14/14 · `test_tonplaetze` (Spiel == Pult): 0 fehlen, 0 zu viel, 0 Zeilen ohne Wirkung, 43 Hinweise · Partietest Grauwall, `test_ton`, `test_kommentare` fehlerfrei.

**Zu den Sparregeln (19:20):** Ich habe sie erst beim Abhaken gelesen. Bis dahin waren ein Hilfs-Agent (Ton-Spur bauen) und zwei volle Ton-Spur-Läufe (26 und 22 Minuten) schon gelaufen; der zweite war nötig, weil sich das Spiel nach dem ersten noch geändert hatte. Ab jetzt gelten die Regeln: keine weiteren Läufe, die anderen Pakete habe ich nicht angefasst.

### 1. Das neue Pult
- **Hauptansicht „Töne einstellen“ in drei Schritten** auf einem Bildschirm (`01_drei_schritte_1920.png`, `14_drei_schritte_1280.png`, `14_drei_schritte_2560.png`):
  - **Wer?** Große Einheitenbilder, Knöpfe Konkordat / Aschenwacht / Gemeinsam, Gruppen nach Art und Waffe, „Mehrere wählen“ (`04_mehrere_einheiten.png`).
  - **Wann?** Große Kacheln nur für Momente, die diese Einheit hat (Anklicken, Bewegen, Schießen, Einschlag beim Ziel, Nahkampf, Wird getroffen, Tod und Ausfall, Fähigkeiten, Ankunft).
  - **Welcher Ton?** Nur Töne, die zum Moment passen; ▶ = hören, Antippen = gewählt (`02_ton_gewaehlt.png`). „Alle Töne ansehen …“ öffnet die ganze Bibliothek (`05_alle_toene_dialog.png`).
  - **Fortschritt:** „7 von 9 Momenten eingestellt“, jede Einheitenkarte zeigt „3 / 9“ oder „✓ fertig“ (`03_einheit_fertig.png`). „Passt so“ hakt eine Stelle ab, ohne den Ton zu ändern; „Alles Übrige passt so“ hakt den Rest ab.
- **Bibliothek neu nach Inhalt sortiert** (`06_alle_toene_stimmen.png`, `07_rubrik_graben_und_schanzen.png`):
  - Neue Rubrik „Graben und Schanzen“ (Schaufeln, Atmen beim Graben, Sandsäcke, Draht). „Handgriffe und Gerät“ bleibt.
  - Jeder Ton steht nur noch an einer Stelle. Über „Rubrik …“ an jedem Ton sortierst du selbst um; das wird gespeichert und exportiert.
  - **Unsicher einsortiert, mit „?“ markiert (11):**

    | Ton | steht jetzt unter | Zweifel |
    |---|---|---|
    | `charge` (Gegenstoß) | Stimmen – Rufe und Befehle | Quelldatei heißt „loud-tiger-ii-audio-test“, klingt nach Motor |
    | `mgsetup` | Stimmen – Rufe und Befehle | ist ein Ruf („Guns up“), kein Handgriff |
    | `neu2_schritte` | Schritte – Im Schnee | Maschinen- oder Schneeschritte |
    | `held_schritt_ritter` | Schritte – Schwere Schritte | alter Ritter-Schritt |
    | `held_aufladen` | Maschinen – Dampf und Hydraulik | „Vortex“, könnte auch ein Effekt sein |
    | `neu2_autokanone` | MG | Autokanone: MG oder Kanone? |
    | `cannonH` | Kanonen – Schwere Artillerie | enthält auch Einschlag-Anteile |
    | `neu2_knall` | Einschläge | Knallkörper |
    | `bauen` | Graben – Sandsäcke und Bauen | Hämmern oder Schanzen? |
    | `drahtlatch` | Graben – Draht | Riegel-Klacken |
    | `neu_versorgung` | Natur und Kulisse | Versorgungs-Kulisse |
- **Abstellkammer** (`08_abstellkammer.png`, `09_ersatz_waehlen.png`, `10_bereiche_abgeschaltet.png`):
  - Neben jedem Ton steht „✕ aussortieren“. Der Ton verschwindet aus allen Auswahllisten, in der Abstellkammer holt ihn ein Klick zurück. Gelöscht wird nichts.
  - Ganze Bereiche lassen sich abschalten: Rubrik, Herkunft, Sprechergruppe.
  - Im Spiel fällt eine aussortierte Fassung aus der Zufallsgruppe. Ist es der einzige Ton einer Stelle, bleibt er, und das Pult zeigt „⚠ aussortiert, bitte Ersatz wählen“.
- **Stimmen nach Herkunft:** Jede Stimme trägt ein Schild (Suno 289 Töne, ElevenLabs 90, Helden 24, sonstige 167), Filter je Herkunft in „Alle Töne“. Die Heldenstimmen sind eine eigene Gruppe und bleiben bei jedem Bereichs-Schalter unberührt, außer du schaltest ausdrücklich „Helden“ ab.
- **Mischton bauen** (`11_mischton_bauen.png`, `12_mischton_zugewiesen.png`):
  - 2 bis 4 Töne übereinander, je Spur Lautstärke, Startversatz in Millisekunden und Tonhöhe; ▶ spielt sofort.
  - Die 9 bestehenden Mischtöne aus dem Bau lassen sich als Vorlage öffnen. Wo die Einzelspuren nicht mehr einzeln vorliegen, ist der fertige Ton die erste Spur.
  - Speichern unter eigenem Namen: Der Mischton steht in der Bibliothek, ist zuweisbar und steht als Rezept im Export.
  - **Im Spiel wird beim Abspielen gemischt, nicht über `mix` in `sound_bau.json`.** Gründe: kein zweites Komprimieren (kein Qualitätsverlust), `sound.js` wächst nicht, kein Bau-Lauf im Chrome nötig, die Mischung wirkt sofort nach `tonwahl_bau`. Nachteil: Der Versatz schwankt um wenige Millisekunden; im Test lagen 220 ms genau bei 220 ms.
- **Ton-Pult 2** (Tabelle, Bibliothek, Einzelne Einheit) liegt unverändert unter „Experten ▾“.
- Speicher `arm.tonpult`, Verlauf und Rückgängig arbeiten wie bisher. Der Export hat das alte Format plus Abstellkammer, Rubriken, Mischtöne und „passt so“. Dein Export vom 22.11. (20:52) liest sich vollständig ein (`13_export_2211_eingelesen.png`).

### 2. Vollständig je Einheit: Spiel gegen Pult gemessen
- **Messung:** `tools/ton_spur.mjs` spielt für alle 54 Einheiten echte Szenen im Spiel durch (Grauwall und Krähenfurt, ca. 25 Minuten) und schreibt mit, welche Tonplätze klingen. `tools/test_tonplaetze.mjs` vergleicht das mit den Kacheln im Pult.
- **Erster Vergleich (vor dem Abgleich):** 69 Plätze fehlten im Pult, 93 Zeilen waren zu viel, und bei 238 Zeilen kam die Pult-Wahl im Spiel nie an.
- **Jetzt:** 0 Plätze fehlen, 0 Zeilen sind zu viel, bei 0 Zeilen kommt die Wahl nie an. Es bleiben 43 Hinweise (siehe unten). Der Vergleich läuft auch als Prüfung im Pult-Test mit.
- **Im Pult entfernt (die Einheit spielt den Ton nie):**
  - Schuss- und Treffer-Kacheln bei 19 Einheiten ohne Fernkampf (Meldegänger, Fernsprechtrupp, Feldscher, Schildwall, Lanzenreiter, Grabenräumer, Rauchwerfer, Mineure, beide Versorgungstrupps, Ballonbeobachter, Sprenglanzen-Reiter, Signaltrupp, Aschenpfleger, Schwere Grabenwacht, Sturmbrecher, Eingreiftrupp, Kürassier, Bohrkoloss).
  - „Daneben“ bei MG-Einheiten, Marsch und Wald bei Mörser und Minenwerfer, Sperrfeuer bei der Feldkanone, Kampfschrei beim Ballon, Husten beim Gasschutz-Trupp.
  - Rufe „Held fällt“ (die Heldenstimme übernimmt) und „Granate“ beim Konkordat (nur die Aschenwacht hat Panzergranaten).
- **Im Pult ergänzt (klang im Spiel, hatte keine Kachel):**
  - Schlagabtausch (schnelle Hiebe vor dem letzten Schlag) bei Stahlgängern, Panzerknechten, beiden Helden, Löwenoger, Grabenräumer.
  - „Abwehrhieb“ bei Geschützen, Ballon, Landkoloss und Sturmpanzer (sie kämpfen nicht, schlagen im Bild aber zurück).
  - Splitter treffen Fußtruppen (Kanonen, Geschütze, Feuerschlag), Abpraller bei Geschützen und Panzergranaten.
  - Über eine Barrikade und Rammen-Anlauf bei den Schreitern, Ballon-Brenner, Ticken beim Stollen und beim Minenlegen, Bohrer-Ton beim Bohrkoloss.
  - Neue Gruppe **„Gelände und Gebäude“** unter „Gemeinsam“: Gebäude stürzt ein, Stollen wird gesprengt (drei Töne). Diese Töne gehören zu keiner Einheit.
- **Im Spiel behoben (die Wahl aus dem Pult kam nicht an):**
  - **Alle Waffentöne.** Das war der größte Posten: Gewehrsalve, Scharfschütze, Pistole, MG, Drehlauf, alle Kanonen, Zweitwaffen, Breitseite, Faustsalve. Auch deine Wahl für das Hünen-MG und das Grenadier-Gewehr vom 22.11. klang deshalb bisher nicht. Per Test am Beispiel Gewehrsalve geprüft.
  - Treffer am Ziel, Streifschuss, Abpraller: gehören jetzt dem Schützen.
  - Nahkampf-Hiebe: gehören dem, der zuschlägt.
  - Spruch, Motor, Pferd und Oger-Brüllen beim Anklicken.
  - Flammenstrahl, Sperrfeuer-Abschüsse, Stacheldraht, Panne, Heldenfall.
  - Fehler nebenbei: Der zweite Feuerstoß des Turm-MG nahm das normale statt des schweren MG.
- **Hinweise, die bleiben (kein Fehler, im Test als „Hinweis“ gezählt):** Bei einigen Zeilen greift die Wahl nicht in jedem Fall, z. B. „Gebäude rammen: Aufprall“ beim Einsturz oder „Schlag auf die Panzerung“ im Gegenschlag. Liste: `node tools/test_tonplaetze.mjs`.
- **Nicht nachgestellt:** Sieg-Ruf, Kirchen-Einsturz mit Glocke, Kulisse von Sankt Ruß.

### 3. Deine Tonwahl vom 22.11.
- 139 Wahlen aus allen Exporten, **129 wirken im Spiel** (vorher gezählt 136).
- **7 lagen auf „Gewehrsalve“ bei Einheiten, die nie schießen:** Aschenpfleger, Signaltrupp, Sturmbrecher, Eingreiftrupp, Fernsprechtrupp, Melder, Feldscher. Sie bleiben im Pult gespeichert und im Export, klingen aber nicht.
- „Stollen sprengen“ beim Mineur ist nach „Gelände und Gebäude“ umgezogen, deine Wahl zieht mit.
- `mahlwerk.mgladen` aus dem Export hat seit dem 22.11. keine Zeile mehr; der Eintrag bleibt gespeichert.

### 4. Offen
- **Zwei Zeilen, ein Platz:** Bei 15 Stellen teilen sich zwei Zeilen einer Einheit denselben Tonplatz, dann gilt im Spiel eine Wahl für beide. Beispiele: Flammenstrahl und „Feld fängt Feuer“; Kanone und Breitseite beim Sturmpanzer; Kanone und Faustsalve beim Eisenknecht; drei Dampfstoß-Zeilen der Roten Faust; Ziehen und Sturmrollen-Anlauf beim Landkoloss.
- **Mischtöne in Ruf-Zeilen** (Stimmen) kann das Spiel nicht mischen; das Pult bietet sie dort nicht an.
- Lautstärke und Tonhöhe aus dem Pult wirken bei Flammenschleife, Motor beim Anklicken und Sperrfeuer-Abschüssen noch nicht, nur die Tonwahl.

### Fragen an Enrico
1. Die 7 Schuss-Wahlen bei Einheiten ohne Fernkampf (oben): War das nur, weil die Zeile da war, oder sollen diese Einheiten einen Schuss-Ton bekommen (dann bräuchten sie eine Regel dafür)?
2. „Zwei Zeilen, ein Platz“: Soll ich diesen 15 Stellen eigene Tonplätze geben, wie am 22.11. bei Marsch und Sperrfeuer?
3. `charge` (Gegenstoß) klingt nach Motor, die Quelle heißt „tiger-ii“. Bleibt er der Gegenstoß-Ruf, oder soll ein Stimm-Ruf dorthin?

## 2026-11-22 Abend – 21:00: Ton-Pult 2 zusammengeführt, Enricos Tonwahl im Spiel

Gepusht. Tests: `tonpult_test` 40/40, test_ton, Partietest Grauwall, test_kommentare – alle fehlerfrei.

### 1. Zusammenführen
- `origin/tonpult2` ist nach `main` gemergt (Merge-Commit), ohne Konflikte.
- `tonpult_bau.mjs` ist neu gelaufen; `tonpult_test.mjs` bestand nach dem Merge 40/40.
- Der Abschnitt aus Punkt 7 steht in `CLAUDE.md`.
- **Arbeitsordner `C:\Projekte\Armargeddon-ton`:**
  - Er ist sauber (nichts Ungesichertes), alles liegt in `main` auf GitHub, der Zweig `tonpult2` bleibt.
  - Das Entfernen hat meine Sicherheitsabfrage hier blockiert (Löschen eines Ordners).
  - Bitte selbst ausführen, wenn gewünscht: `git worktree remove C:\Projekte\Armargeddon-ton` (im Ordner `C:\Projekte\Armargeddon`).

### 2. Enricos Tonwahl (Export 20:52, 132 Einträge)
- Mit den älteren Exporten zusammengeführt sind es 139 Wahlen, der neueste Export gewinnt. **136 wirken im Spiel**, verteilt auf 51 Einheiten; 3 brauchen keinen Eintrag, weil sie dem Spielstandard entsprechen.
- **Vorher ausgelassen, jetzt übernommen:**
  - **„Aufgerieben“ (34 Einheiten, Sterbe-Rufe):** Diese Zeile hatte im Spiel gar keinen Ton.
    - Sie hat jetzt einen eigenen Spiel-Platz `aufgerieben`.
    - Er klingt, wenn ein Trupp aufgerieben wird; ohne Wahl bleibt es stumm wie bisher.
  - **„Schlag: Fäuste und Klingen“ (`punch`) bei Scharfschützen, Mahlwerk und Rauchwerfern:** Das ist ein Sammelname, kein Tonplatz. Er ist jetzt zulässig.
- Gewählte Töne, die bisher nur im Pult lagen, liegen jetzt auch im Spiel (`ton_teilen.mjs`); geprüft, alle 136 sind vorhanden.

### 3. Aus dem Ton-Bericht
- **Eigene Tonplätze statt Doppelbelegung:**

  | Zeile | Spiel-Platz |
  |---|---|
  | Marsch und Sturmlauf | `marsch_schritte` |
  | Einschläge Sperrfeuer | `sperr_boom` (Mörser, Minenwerfer) / `sperr_boomH` (schwere Geschütze) |
  | Sturmrollen: Aufprall | `aufprall_rollen` |
  | Gebäude rammen: Wucht | `aufprall_rammen` |
  | Bohrstoß: Wucht | `aufprall_bohr` |

  - Alle klingen ohne Wahl wie bisher. Im Pult hört man weiter denselben Ton, die Wahl ist aber getrennt.
  - Der Hinweis „Gilt im Spiel auch für“ verschwindet dort.
  - Die bisherige Wahl wird auf die Schwester-Zeile übertragen, wenn dort keine eigene steht: Beim Minenwerfer gilt die Sperrfeuer-Wahl so weiter auch für den Einzelschuss.
- **`tonKontext`:**
  - Jeder Eintrag weiß jetzt, ob er für den Handelnden gilt (Schuss, Treffer am Ziel, Nahkampf, Ziehen, Fähigkeiten) oder für den Getroffenen (Getroffen, Tod).
  - Die Wahl „Treffer am Ziel“ einer Einheit klingt nicht mehr, wenn sie selbst getroffen wird.
  - Umgekehrt klingt ihre Getroffen-Wahl nicht, wenn sie selbst schießt.
- **`alleKeys`:** Alle Schlüssel aus `src/sound.js` und `src/sound_pult.js` sind zulässig (auch `horn`, `tiger`, `gallop` …). Nichts geht mehr als „Ton fehlt“ verloren.
- `tonpult_test.mjs`: Eine Prüfung ist angepasst. Sie erwartete den Hinweis „gilt auch für“ bei Ziehen/Marsch; jetzt erwartet sie, dass er fehlt (eigener Platz).

### 4./5.
- Antworten notiert, nichts zu ändern.
- Weitere Exporte liegen künftig als `tonpult_export_<datum>_<uhrzeit>.json` im Postfach, der neueste gewinnt. Nach jedem neuen Export: `node tools/tonwahl_bau.mjs`, `node tools/ton_teilen.mjs`, build.

## 2026-11-22 Abend – Entscheidungen 20:50: Eis bricht ein, Spuren dunkler

Gepusht. Tests: test_regeln, test_belegung (alle Karten), test_kommentare, Partietest Krähenfurt – alle fehlerfrei. Bilder in `entwurf/probe/kraehenfurt_spuren/`.

### 1. Eis bricht ein
**Regel** (nur Winterkarten, Sim-Abschalter `NOEISBRUCH=1`):
- **Wer bricht es auf:**
  - Sprenggranaten schwerer Geschütze auf ein Eisfeld: Haubitze, Aschenwacht-Geschütz und Minenwerfer, nicht Feldkanone und Grabenmörser.
  - Der Feuerschlag.
  - Sperrfeuer auf ein Eisfeld zu 50 % (nur das Zielfeld).
- **Folge:** Das Feld wird für 2 Runden **Eisloch**, offenes Wasser und für alle unpassierbar.
- **Einheit auf dem Feld:**
  - Sie nimmt ca. 16–24 Stärke Schaden (P.EISBRUCH_DMG 2,0).
  - Danach rettet sie sich aufs nächste freie Ufer, bevorzugt zur eigenen Seite.
  - Ist kein Ufer frei, wird sie nur niedergehalten.
- **Zufrieren:** Zu Beginn der übernächsten Runde friert das Loch wieder zu; das Bild blendet in knapp 1 s aus.

**Anzeige:**
- Erst beim Abspielen: Krachen (`eis_bricht`), Splitter, Eisloch-Bild (Rand an das Eis angeglichen), Meldung „Das Eis bricht!“. Danach läuft die Einheit sichtbar ans Ufer.
- Beim Zufrieren: leises Knacken und „Eis friert zu“.
- Auf Eis liegt kein Schneetrichter mehr.
- Hinweise:
  - Der Geländehinweis zeigt auf Eis „▼ Eis kann brechen“, wenn der Gegner schwere Geschütze hat.
  - Die Gelände-Info, die auch im Regeln-Fenster steht, erklärt es.
  - Das Protokoll meldet Einbruch und Zufrieren.
- Bilder: `eisbruch.jpg` (Loch, Treffer −22, Grenadiere ans Ufer), `eiszu.jpg`.

**KI:**
- Schwere Geschütze beschießen Gegner auf dem Eis bevorzugt (`W_EISZIEL` 2,0).
- Fußtruppen meiden Eisfelder, die in Reichweite gegnerischer schwerer Geschütze liegen (`W_EIS` 0,8).
- Ein erster Versuch mit pauschalem Meiden (sobald der Gegner überhaupt schwere Artillerie hat) lähmte die angreifende Aschenwacht: Konkordat 61–66 %. Darum gilt das Meiden jetzt nur in Reichweite.

**Messung Krähenfurt** (Sieg Konkordat, 4 × 200, feste Aufstellung):

| Fassung | Sieg Konkordat | Runden Ø | Ausfälle Konkordat / Aschenwacht | Eisbrüche je Schlacht |
|---|---|---|---|---|
| ohne (`NOEISBRUCH=1`) | 51,0 % (50 / 45 / 53 / 56) | 14,2 | 43 % / 32–33 % | 0 |
| **mit (Standard)** | **52,8 % (50 / 52 / 52 / 57)** | 14,0 | 43 % / 32–33 % | 2,5 (davon ca. 70 % mit Einheit darauf) |
| pauschal meiden (verworfen) | 61,5 % | 14,2 | 44 % / 30 % | 2,6 |

### 2. Spuren dunkler
- Spuren sind jetzt dunkler (Helligkeit 0,62, Kontrast 1,35), etwas größer und doppelt gezeichnet, weil die Bilder halbdurchsichtig sind. Stapfen der Fußtruppen 0,75 statt 0,6.
- `vergleich_alt_oben_neu_unten.jpg`: in der Übersicht oben die alte, unten die neue Kettenspur. Nah bleiben sie unaufdringlich.

### 3. Atemwolken
- Unverändert.

