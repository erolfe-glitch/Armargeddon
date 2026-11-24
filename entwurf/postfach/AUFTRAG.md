# >>> GILT AB SOFORT (Enrico 2026-11-23 19:20): SPARREGELN und PAKET-REIHENFOLGE <<<
**Warum:** Enricos Wochen-Nutzungslimit ist knapp (Rücksetzung erst Mittwoch). Ton-Pult 3 hat sehr viel verbraucht (Hilfs-Agent, 20-Minuten-Lauf).

**Sparregeln (für jeden `pa`/`pw`):**
1. **Keine Hilfs-Agenten / Subagenten** ohne ausdrückliche Erlaubnis von Enrico.
2. **Keine Test- oder Simulationsläufe über 10 Minuten** ohne Rückfrage. `sim.js` lieber mit 100 statt 200 Schlachten und einem Startwert, wenn es nur um eine Richtung geht; große Messungen nur, wenn der Abschnitt es ausdrücklich verlangt.
3. **Je `pa` genau EIN Paket** (siehe unten), dann Bericht + „– pb“ und **aufhören**. Nicht von selbst mit dem nächsten Paket weitermachen.
4. Nur das Nötige lesen (gezielt suchen statt ganze Dateien), keine Bilderserien, wenn ein Bild reicht.
5. Wenn ein Paket größer wird als gedacht: Zwischenstand committen, im Bericht sagen, was fehlt, aufhören.

**Paket-Reihenfolge (die Abschnitte darunter bleiben die Beschreibung, hier steht nur, was in welches Paket gehört):**
- ✓ Ton-Pult 3 (16:50) abgeschlossen.
- ✓ **Paket A – Bedienfehler (zuerst, klein):** Fehler 18:30 (Geschütze ohne Ziel abhaken), Spieltest-Punkt 9 (zwei Knöpfe gleichzeitig aktiv), Punkt 22 (Fähigkeit durch Anklicken ausgelöst). *(22:20-Zusatz Tonwahl noch offen → in Paket A2 verschoben)*
- ✓ **Paket A2 – Ton-Pult „Eigenes Paket“ (Abschnitt 20:30, Punkt 25), direkt nach Paket A.** Zuerst (aus Paket A übrig, wurde dort nicht gemacht): Enricos neuer Pult-Export `entwurf/postfach/tonpult_export_2026-11-23_2217.json` (287 Wahlen, 17 Töne aussortiert, alle 54 Einheiten „fertig“) einbauen: `node tools/tonwahl_bau.mjs`, `node tools/ton_teilen.mjs`, build. Im Bericht: wie viele Wahlen wirken, welche nicht und warum.
- ✓ **Paket A3 – Chroniken-Texte statt „Im echten Krieg“ (Abschnitt 24.11. 15:20, Punkt 28) + Punkt 29 (Ton-Pult: erstes Kreuz nimmt Werks-Paket mit).**
- ✓ **Paket A4 – Gelände-Chroniken + Rest (Abschnitt 24.11. 15:30, Punkte 29–31).**
- ✓ **Paket B – schnelle Kleinigkeiten:** Punkte 5 (Spuren nicht auf Straßen), 6 (Zielmarke Knochenweiß am Boden), 15 (Leuchtsignal: Minen sichtbar aufdecken), 20 (Heil-Pluszeichen), 21 (Granaten in Nahkampf-Animation – erst klären), 24 (Kamera zurück), 7 nur Teil 1 (Meldegänger Abklingzeit 2), 8 (Sturmlauf: vorbeidrücken, Minen), 32 (Scharfschützen-Läufe abgeschnitten).
- ✓ **Paket B2 – Rest aus Paket B + Antworten (Abschnitt 24.11. 16:35):** Punkte 32 (Scharfschützen-Läufe, war in Paket B nicht dabei), 33 (Meldegänger teurer), 34 (Handgranaten als Fähigkeit).
- ✓ **Paket C – Krähenfurt:** Punkte 4 (Ruckler messen + beheben, Langzeitlauf erlaubt, max. 15 Min.), 1 (Karte aufräumen), 12 (Deckung Mitte), 13 (Flaggen sichtbar).
- ✓ **Paket P – Plastik-Probe vorgezogen (Enrico 24.11. 18:23): nur Punkt 27** (Abschnitt 20:30 vom 23.11., nur Bilder, nichts fest einbauen). Danach Paket C2.
- ✓ **Paket C2 – Krähenfurt-Rest (Abschnitt 24.11. 18:20, Punkte 35–38).**
- ✓ **Paket D – Effekte:** Abschnitt 17:30 (Fähigkeits-Effekte Tintenstil, Wucht) + Punkte 14 (Sturmrollen), 19 (Gasgranate Luftzerleger), 27 (Plastik-Probe, nur Bilder). **Teil 1 (`d135239`) und Teil 2 (`0f9e557`) erledigt. Im nächsten Teil ZUERST die Korrekturen 39–42 (Abschnitt 24.11. 19:05), dann der Rest.**
- **Paket E – Regeln (mit Messung):** **zuerst Punkt 42 (Dampfpfeife, aus Paket D übrig, Abschnitt 24.11. 19:05)**, dann Punkte 3 (Scharfschützen), 16 (Feldkanone Panzergranate), 18 (Entsetzenstest), 2 (Aufstellungsphase).
- **Paket F – Kleinkram/Listen:** Abschnitt 17:20 (Liste fehlender Sprachbefehle), 17:10 (Brainstorm in IDEEN.md + Probebild Maßstab), Punkt 17 (Schadenszahlen).
- **Mit der Maßstab-Umstellung A (noch kein eigenes Paket):** Punkt 26 (Löwenoger neues Modell + kleiner), Punkt 43 (Löwenmaul-Kanone und Furcht-Aura stärker).
- **Nur Vorschläge, später:** Punkte 7 Teil 2 (Melder+Sanitäter), 10 (Fähigkeiten am Porträt), 11 (Kommandobunker), 23 (Moral-Aura).

# >>> JETZT (Enrico 2026-11-24 19:05): Korrekturen zu Paket D Teil 1 <<<
**Reihenfolge:** im nächsten `pw` für Paket D **zuerst** diese drei Punkte, danach die offenen Schritte aus dem Bericht (Schritte 1, 4, 6, Punkte 14, 19). Grundlage: `entwurf/probe/effekte_d/alle_vorher_nachher.jpg`. Enrico: „Die Effekte sind schon ganz okay“ – nur diese Fehler beheben.

- [x] **39. Boden-Ringe liegen ÜBER der Figur statt um sie herum (alle Ringe, nicht nur einer).** Beispiel oben rechts im Vergleichsbild: Der weiße Staubring des Löwengebrülls liegt quer über Beinen und Rumpf des Kreuzschreiters. Enrico: Bei einem echten Ring am Boden sieht man den hinteren Teil nicht, der ist hinter der Figur verdeckt – so sieht es „weird“ aus.
  - **Gewünscht:** Jeder Ring am Boden wird an der waagerechten Mittellinie geteilt: **hintere Hälfte vor der Figur zeichnen** (wird vom Körper verdeckt), **vordere Hälfte nach der Figur** (liegt vor den Füßen). Alternativ, wenn das einfacher ist: ganzer Ring in die Bodenschicht (vor allen Figuren) – dann aber prüfen, dass die hochstehenden Zacken vorn nicht abgeschnitten wirken.
  - Gilt für **alle** Boden-Ringe und -Wellen: Staubring Gebrüll (2), Druckwelle Aufprall/Sprung (3), Rauchklauen-Ring Furcht-Aura, Aura-Puls, Hinrichtung (5), und die noch verbliebenen glatten Ringe (Befehle, großer Befehl, Banner, Wirkungsbereich), soweit sie um eine Figur liegen.
  - Der Ring sitzt **mittig unter den Füßen** der Einheit (Fußpunkt bzw. Mitte des Standrings), nicht daneben.
  - Bild nachher: Kreuzschreiter-Gebrüll und Löwenoger-Sprung, gleiche Kamera.
- [x] **40. Kürassier: graue Pünktchen weg.** In der dritten und vierten Reihe des Vergleichsbilds (Furcht-Aura, Hinrichtung) hängen neben bzw. an dem Kürassier hellgraue Kreise/Punkte (z. B. vorher links neben dem Schwert, nachher rechts an der Rüstung und am Boden). Sieht nach flachen Farbkreisen aus (alte Funken-Kugeln `burst`? Dampf-/Staubpartikel der Aura? Sägen-Funken?). **Ursache suchen und entfernen** bzw. durch einen Effekt aus den Bögen ersetzen. Im Bericht sagen, was es war.
- [x] **41. Löwenoger-Gebrüll sitzt falsch (Berater, Fehler in der Lage).** Zweite Reihe rechts: Der Schallkegel kommt aus Hüfthöhe statt aus dem Maul, der Staubring liegt links vor der Figur statt unter ihr. Kegel am Maul ansetzen (`maulPunkt` bzw. eigener Punkt je Bogen/Pose, wie MUZ), Ring nach Punkt 39 unter die Füße. Beim Kreuzschreiter prüfen, dass der Kegel direkt am Löwenmaul beginnt (im Bild setzt er etwas rechts davon an).

- [x] **42. Dampfpfeife fürs Sturmrollen (Wunsch aus Paket D Teil 2, Enrico hat einen Ton gefunden).** Datei: `sound-quelle/Moving tanks/caboose_canine-steam-locomotive-fouled-5-chime-375193.mp3` (Pixabay, Nutzer „caboose_canine“, Pixabay-Inhaltslizenz: frei, auch kommerziell, keine Nennung nötig – trotzdem in `CREDITS.md` eintragen). 1,8 s, mehrstimmiger Lok-Akkord, Grundton um 400–850 Hz, endet bei ~1,7 s.
  - Neuer Tonplatz `dampfpfeife` in `tools/sound_bau.json` (ganz nehmen oder auf ~1,5 s mit kurzer Ausblendung, eher etwas tiefer: `rate` ~0,85; Pegel wie `whistle`). **Nicht** den vollen Neubau aller Töne, falls `sound_bau.mjs` einzelne Plätze bauen kann; sonst im Bericht sagen, wie lange es dauert, und vorher fragen (Sparregel 2).
  - Im Sturmrollen den Behelf (`whistle` halbe Tonhöhe + `held_dampf`) durch `dampfpfeife` ersetzen; das Dampfzischen darf als leise Unterlage bleiben.
  - Danach `sound-quelle` per robocopy sichern (Feste Regeln), Ton-Pult/Tonprobe neu bauen, damit Enrico ihn dort hört.

- [ ] **43. NICHT JETZT – erst beim großen Umbau (Schaden über Modelle, Etappe 3): Löwenmaul-Kanone und Furcht-Aura stärker.** Antwort auf die Frage aus Paket D Teil 3. Enrico (19:19): erst beim Umbau, weil sich dort die Schadensrechnung ohnehin ändert. Laut Bericht zu schwach für den Auftritt: Löwenmaul-Kanone des Kreuzschreiters (2 gegen Grenadiere, 4 gegen Sturmpanzer je Schuss) und Furcht-Aura des Kürassiers (−4 Moral je Runde). Beim Umbau so einstellen, dass die Wirkung zur Inszenierung passt, mit Messung (Sparregel 2). Bis dahin Werte nicht ändern.

# >>> JETZT (Enrico 2026-11-24 18:20): Antworten zu Paket C + Straßenenden (NICHT erledigt) <<<
**Reihenfolge:** Paket C2, eigener `pa`.

- **Deckung Mitte (Punkt 12):** Enrico: **so lassen** (Variante C). `MAP.deckung` bleibt leer.
- [x] **35. Straßenenden Krähenfurt – war Teil von Punkt 1, wurde NICHT gemacht.** Enrico sieht auf den Nachher-Bildern weiter abgehackte, zerstückelte braune Straßen. Beispiele in `entwurf/probe/kraehenfurt_c/nachher/`:
  - `dorfplatz.jpg`: Der Weg von links endet vor dem Brunnen mit einer **geraden, harten Kante** (Feldgrenze); ein zweites Wegstück beginnt/endet unvermittelt; die Straße unter der Fahne zerfasert in mehrere Spuren, die an Feldgrenzen abbrechen.
  - `strasse_nah.jpg`: Der linke Abzweig hört mitten im Feld mit **gerader Kante** auf (bei x≈430, y≈300); die Abzweigung oben (vom Brunnen) beginnt kantig.
  - **Ursache vermutlich:** Straßen werden je Feld als Stück gelegt und enden an der Feldgrenze. **Gewünscht:** Straßen als durchgehende Bänder; an Enden (Brunnen, Haus, Kartenrand, Feld ohne Fortsetzung) **weich auslaufen** (Endkappe/Ausblendung über ~½ Feld) statt gerade abgeschnitten; Abzweige und Kreuzungen ohne Kanten verschmelzen; keine einzelnen Straßenfelder ohne Anschluss.
  - Alle Straßenenden und Abzweige der Karte prüfen. Vorher/nachher je Stelle, dazu `dorfplatz` und `strasse_nah` aus derselben Kamera wie oben.
- [x] **37. Äcker/Feldflächen auf der Ostseite (hinter dem Fluss, vor allem unten rechts) wirken zerstückelt.** Enrico: Die Ränder der Felder sind absichtlich „krakelig“ gemacht, damit es natürlich wirkt – aber jedes Feld ist eine eigene Fläche mit ausgefranstem Rand, dadurch wirkt die ganze Seite wie ein Flickenteppich (siehe `entwurf/probe/kraehenfurt_c/nachher/uebersicht.jpg`, rechte Kartenhälfte). **Gewünscht:** zusammenhängende Ackerflächen über mehrere Felder, nur am Außenrand des ganzen Ackers ein (leicht unregelmäßiger, aber ruhiger) Rand, im Inneren keine Feldgrenzen; dazwischen allenfalls ein paar klare Feldwege. Wenn das nicht sauber geht: lieber weniger Ackerfläche. Vorher/nachher: Übersicht und Nahansicht unten rechts.
- [x] **38. Bildwirkung „sehr stark“ als dritte Menü-Stufe** (Enrico 24.11., Antwort auf Paket P: Weg C). Die Probestufe aus `__dbg.bild(3)` als „Bildwirkung: sehr stark“ ins Optionsmenü (und Taste B weiterschalten), gespeichert wie die anderen Stufen. Standard bleibt „stark“. Bodenverdunklung dieser Stufe etwas zurücknehmen, wenn der Boden zu dunkel wirkt. Weg A (neue plastische Bögen ohne gemalten Bodenschatten) kommt mit dem Maßstab-Umbau.
- [x] **36. Krähenfurt neu abgleichen.** Enrico: ja. Nach den Handgranaten (Paket B2) steht das Konkordat bei 41–42 %, Ziel ≈ 50 %. Messen mit 2 Startwerten à 100 Schlachten (max. 15 Minuten), dann nur über Kartendaten/KI-Gewichte (`MAP.ki`, Armee, Aufstellungszone) nachstellen – nicht an den Handgranaten. Ergebnis in BALANCE.md.

Bericht mit Bildern, im Chat „– pb“.

# >>> JETZT (Enrico 2026-11-24 16:35): Antworten zum Bericht Paket B <<<
**Reihenfolge:** Paket B2, eigener `pa`. Punkt 32 steht im Abschnitt 16:05 darunter (wurde in Paket B nicht gemacht).

- [x] **33. Meldegänger teurer.** Enrico: Preis jetzt erhöhen. Vorschlag 40 statt 20 (über ADJ). Nachmessen mit `MA_melder=1`, 100 Schlachten, ein Startwert: Ziel ist, dass ein Meldegänger nicht mehr als etwa +10 Punkte Siegquote bringt; sonst weiter anheben (in 5er-Schritten, höchstens 60). Endgültig neu bewertet wird er bei der Zusammenlegung mit dem Sanitätstrupp (Punkt 7 Teil 2).
- [x] **34. Handgranaten als aktive Fähigkeit statt fester Regel.** Enrico: Die passive Regel `granatSturm` der Aschengrenadiere (Nahkampf ×1,25, Schuss ×0,85) **ersetzen** durch eine Fähigkeit **„Handgranaten“** (Aktion, **Abklingzeit 2 eigene Runden**): auf ein Feindfeld daneben oder bis 1 Feld weit, Schaden etwa wie der bisherige Granaten-Bonus im Nahkampf (Wert so wählen, dass die Grenadiere in der Summe etwa gleich stark bleiben), Ziel niedergehalten. Der Schuss-Malus ×0,85 entfällt. Granatwurf-Bild/Ton wie bisher (`handgranate`, `poseWurf` ist schon gebaut). KI: abilPlan wirft, wenn ein Gegner daneben steht oder im Graben/Haus sitzt. Keine Zier-Granaten für andere Fußtruppen. Text, Schlagwort, Kosten (costParts) und Chroniken-Bezug prüfen. Messung 100 Schlachten Grauwall + Sankt Ruß, ein Startwert, Siegquote vorher/nachher; Sim-Abschalter `NOHANDGRANATE`.

Bericht kurz, im Chat „– pb“.

# >>> JETZT (Enrico 2026-11-24 16:05): Spieltest-Nachtrag, gehört zu Paket B <<<

- [x] **32. Konkordat-Scharfschützen: Gewehrläufe abgeschnitten (Spieltest 24.11.).** Beim Anlegen/Schießen fehlt im Spiel ein großer Teil des Laufs. Bögen `konkordat_scharfschuetze.png` und `konkordat_scharfschuetze_posen.png` (lange Läufe ragen weit nach rechts, teils über die Nachbarpose). Prüfen, wo der Lauf verloren geht (Nahtschnitt in figure_cut.py, Kastenbreite/FIGW, Beschnitt beim Zeichnen) und so beheben, dass der ganze Lauf bleibt (z. B. wie `UNTEN_LINKS` beim liegenden Schützen oder Naht neu legen). Vorher/Nachher-Bild jeder Pose. Auch die Aschenwacht-Pirschjäger kurz mitprüfen.

# >>> JETZT (Enrico 2026-11-24 15:30): Gelände-Chroniken, Ton-Pult-Rest, „1 Felder“ <<<
**Reihenfolge:** Paket A4, eigener `pa`, klein. Keine Regeländerung, keine Simulation.

- [x] **29.** (aus Paket A3 übrig, wurde nicht gemacht) siehe Abschnitt 15:20: erstes Kreuz „+ ins Paket“ nimmt das Werks-Paket automatisch mit.
- [x] **30. Gelände-Chroniken.** Die Texte stehen in `entwurf/welt/gelaende_chroniken.md` (27 Geländearten, Schlüssel = TERRAIN-Schlüssel, je Quelle + 1 Satz, vom Berater geschrieben). TERRAIN `real` durch `chronik: { quelle, text }` ersetzen (wie bei den Einheiten), Feld-Tooltip zeigt „Aus den Chroniken“ mit `chronikHtml`. Keine Weltkriegsfakten mehr irgendwo im Spiel: grep nach „Im echten Krieg“, `real:`, Somme, Passchendaele, Reims, Verdun, Flandern, Argonnen, Loos, Yser, Lorette, Albert – Funde im Bericht nennen (in Code-Kommentaren und Werkzeugen dürfen sie bleiben, in der Oberfläche nicht). `test_regeln` prüft auch die Gelände-Texte.
- [x] **31. „1 Felder“:** Reichweite 1 heißt „1 Feld“ (Info-Fenster, Werte-Kasten „Schuss“, Schlagworte wie „Schrotflinte 1 Feld“). Überall, wo Feld/Felder aus einer Zahl gebildet wird, die Einzahl richtig.
- Hinweis: In der Weltbibel steht jetzt unten „Offizielle Namen im Spiel“ (Valmor = Doppelinsel des Konkordats, Grauwall = befestigte Westgrenze der Aschenwacht). Im Spiel nichts ändern.

Bericht kurz, ein Bild vom Feld-Tooltip (Friedhof Sankt Ruß), im Chat „– pb“.

# >>> JETZT (Enrico 2026-11-24 15:20): Eigene Welt – Chroniken-Texte statt „Im echten Krieg“ <<<
**Reihenfolge:** Paket A3, eigener `pa`, klein. Keine Regeländerung, keine Simulation.

Enrico hat entschieden: Armargeddon bekommt ein **eigenes Fantasy-Universum** (eigene Dimension/eigener Zeitstrang, Spiegel-Europa, Welt „Morn“, Kontinent „Varnen“). Keine Bezüge mehr auf echte Weltkriegsgeschichte. Die Weltbibel liegt in `entwurf/welt/weltbibel.md` (mit Gemini erarbeitet, vom Berater gegen das Spiel geprüft).

- [x] **28. Chroniken-Texte einsetzen.**
  - In `entwurf/welt/weltbibel.md` stehen am Ende zwei Tabellen (Konkordat und Aschenwacht, je 27 Einheiten): `Schlüssel | Quelle | Text`. Die Schlüssel sind die TYPES-Schlüssel in engine.js.
  - Je Einheit den bisherigen Text `real` (Weltkriegsfakt) durch den Chroniken-Text ersetzen; die Quellenzeile mit speichern (z. B. neues Feld `chronik: { quelle, text }`, oder `real` umbenennen – wie es am saubersten ist).
  - Überall in der Oberfläche die Überschrift „Im echten Krieg“ durch „**Aus den Chroniken**“ ersetzen; die Quellenzeile kursiv und klein über dem Text. Gilt für Info-Fenster, Nachschub-Details und wo der Text sonst erscheint (grep nach `real` und „Im echten Krieg“).
  - Blaue Legion: gleiche Texte wie Konkordat (gleiche Einheiten).
  - Fehlt einem Typ ein Text, im Bericht melden (nicht selbst erfinden).
  - `tools/test_regeln.js` prüft „Text je Einheit“ – anpassen, dass es jetzt den Chroniken-Text verlangt.
  - **CLAUDE.md anpassen:** Die Regel „Jede Einheit hat einen Text ‚Im echten Krieg‘ mit belegbaren Fakten zum Ersten Weltkrieg“ ersetzen durch: „Eigene Welt (Weltbibel `entwurf/welt/weltbibel.md`): jede Einheit hat einen Text ‚Aus den Chroniken‘ (2 Sätze, höchstens 280 Zeichen, mit Quellenzeile), passend zu dem, was sie im Spiel kann. Keine echten Länder-, Orts- oder Personennamen.“ Auch die Zeile „angelehnt an den Ersten Weltkrieg“ im Projektziel entsprechend umformulieren (Grabenkrieg-Stil, eigene Welt).
  - Bild im Bericht: Info-Fenster von Löwenoger und Eisenknecht, 1920 px.
- [x] **29. Ton-Pult, Antwort auf die Frage aus Paket A2:** Das erste Kreuz „+ ins Paket“ an einer Stelle, an der noch das Werks-Paket klingt, nimmt **das Werks-Paket automatisch mit** (alle seine Töne angekreuzt, der neue dazu). Ist an der Stelle ein einzelner Ton gewählt, bleibt es wie bisher (er wird der erste im Paket). Test anpassen.

Bericht mit Bildern, „Fragen an Enrico“, im Chat „– pb“.

# >>> JETZT (Enrico 2026-11-23 20:30, ergänzt 24.11.): Ton-Pult „Eigenes Paket“ + Löwenoger neu + Plastik-Probe <<<
**Reihenfolge:** Punkt 25 = Paket A2 (direkt nach Paket A, eigener `pa`). Punkt 26 erst zusammen mit der Maßstab-Umstellung A.

- [x] **25. Ton-Pult: eigenes Zufalls-Paket zusammenstellen.** Bisher kann Enrico an einer Stelle nur ein ganzes Paket (Zufall aus allen Tönen) oder genau einen Ton wählen; Aussortieren nimmt Töne raus, die Abstellkammer holt sie zurück. Es fehlt: **beliebige Töne dazunehmen.**
  - In „Welcher Ton?“ und in „Alle Töne ansehen …“ je Ton ein Ankreuzfeld „+ ins Paket“. Angekreuzte Töne (auch aus verschiedenen Rubriken und Paketen) bilden für diese Stelle ein **eigenes Paket**; im Spiel klingt zufällig einer davon (gleiche Regel wie die bestehenden Pakete, keine Wiederholung direkt hintereinander, wenn das schon so läuft).
  - Ein vorhandenes Paket als Startpunkt übernehmen können („Paket bearbeiten“: alle seine Töne angekreuzt, dann einzelne ab- oder neue dazuwählen).
  - Anzeige an der Stelle: „Eigenes Paket · 5 Töne“, aufklappbar, je Ton ▶ und ✕ (nur aus diesem Paket nehmen, nicht aussortieren).
  - Mehrere Einheiten gewählt („Mehrere wählen“): das eigene Paket gilt für alle gewählten.
  - Export: neuer Wahltyp (z. B. `pk:[schlüssel, …]`), `tonwahl_bau.mjs` und `playSound` verstehen ihn. Alte Exporte lesen sich weiter ein.
  - Nicht verwechseln mit „Mischton bauen“ (gleichzeitig übereinander) – beides bleibt getrennt; ein eigener Mischton darf aber Mitglied eines eigenen Pakets sein.
  - Test: `tonpult_test` + `test_tonpult3_spiel` um einen Fall erweitern (Paket aus 3 Tönen zweier Rubriken klingt im Spiel abwechselnd). Kein Ton-Spur-Volllauf (Sparregel).
- [ ] **26. Löwenoger: neues, finstereres Modell und kleiner.** Enrico findet das alte Modell kitschig (Stirnband, Bodybuilder, glänzende Krallen). Neuer Bogen: **`ui-quelle/figuren/konkordat_loewenoger_neu2.png`** (2560×1568, Magenta, 3 Posen wie bisher: Ruhe, Schießen, Nahkampf) – Flux-Entwurf 1 (`…_neu.png`), danach mit Qwen Image 2.1 lokal überarbeitet (24.11.): Stirnbänder weg, rostige Eisenringe/Ketten statt glänzender Krallen. `…_neu.png` bleibt als Zwischenstand liegen. Das alte Bild bleibt liegen.
  - Erst mit der Maßstab-Umstellung A einbauen: wie der alte Bogen schneiden (SPALTEN 3, POSE_SETS), Farbe angleichen, figur_plastik.py; Größe kleiner als heute (heute SH 1,5 → Vorschlag 1,25, im Maßstab-A-Verhältnis prüfen).
  - Bild vorher/nachher im Bericht.

- [x] **27. Plastik-Probe: Figuren und Gebäude griffiger (NUR BILDER, nichts fest einbauen).** Enrico findet die Modelle zu flach. Bevor Bögen neu gemalt werden, prüfen, wie weit die vorhandene Bildwirkung trägt.
  - Probe-Stufe „sehr stark“ (nur über `__dbg`, Standard bleibt): kräftigere Licht-/Schattenkarte aus `figur_plastik.py` (Klarheit, Glanz auf Kanten und Nieten), gerichtetes Licht von oben links, dunklerer Kontaktschatten/AO unter den Füßen. Dasselbe für aufrechte Gelände-Teile (Häuser, Kirche, Mauern, Zäune: `gel_<name>`, `teilFilter`, `ao` in GBau).
  - Vergleichsbilder je 1920 px, gleicher Ausschnitt, Stufen aus / stark / sehr stark: (a) Krähenfurt mit Häusern und Truppen, (b) Sankt Ruß mit Kirche, (c) Nahansicht Konkordat-Stahlgänger. Dazu (d) der von Enrico überarbeitete Bogen `ui-quelle/figuren/konkordat_stahl_plastisch.jpg` (Gemini, gleiche Posen wie `konkordat_stahl.png`) nur zum Vergleich daneben ins Bild setzen – nicht einbauen.
  - Bilder nach `entwurf/probe/plastik/`. Im Bericht: was die Stufe kostet (Ladezeit, Bildrate), und ob die Figuren dabei noch im Gelände stehen (nicht aufgeklebt wirken).

Bericht mit Bildern, „Fragen an Enrico“, im Chat „– pb“.

# >>> ✓ JETZT – FEHLER (Enrico 2026-11-23 18:30): Geschütze ohne Ziel lassen sich nicht abhaken <<<
**Reihenfolge:** als Nächstes nach dem gerade laufenden Abschnitt (klein, stört beim Spielen).
- Konkordat, Krähenfurt: **Feldkanone und Geschütz** könnten noch schießen, haben aber **kein Ziel** – dann gibt es **keinen Fertig-Haken**, die Einheit bleibt offen und „Nächste Einheit“ springt immer wieder hin. (Ähnlich wie früher beim Ballon.)
- Regel: **Jede eigene Einheit, die noch nicht fertig ist, hat immer „Fertig“ (Taste 5)** – unabhängig davon, ob Ziele da sind. Zusätzlich: Hat eine Einheit keine mögliche Handlung mehr (kein Ziel in Reichweite, nicht bewegbar), automatisch grau/fertig (`bereitGrund` prüfen: „kein Ziel in Reichweite/Sicht“ muss zählen). Für alle Einheitenarten prüfen, nicht nur Geschütze (Mörser, Haubitze, Minenwerfer, Scharfschützen, aufgebaute MG, Ballon).
- Test in `test_partie.mjs` ergänzen (Einheit ohne Ziel → Fertig vorhanden bzw. automatisch grau).

# >>> JETZT (Enrico 2026-11-23 18:25): Spieltest Krähenfurt – Karte aufräumen, Aufstellungsphase, Scharfschützen <<<
**Reihenfolge:** nach den offenen Abschnitten 16:50–17:30. Teilschritte einzeln committen.

✓ **1. Krähenfurt aufräumen:** Die Karte gefällt Enrico sehr, aber **die Straßen und die Ecke oben rechts wirken „vermüllt“**. Bitte ansehen (Übersicht + nah), Ursache benennen (zu viele Deko-Teile, Trümmer, Überlappungen, Matschstraße mit Flecken/Kanten?) und deutlich ausdünnen bzw. sauberer legen. Straßen sollen klar und ruhig lesbar sein. **Ausdrücklich auch (Enrico 24.11.): die zerstückelten Texturen an Straßenenden** – abgehackte Enden, Kachelbrüche, harte Kanten an Übergängen Straße ↔ Schnee/Feld/Brücke/Kartenrand: sauber auslaufen lassen (weicher Rand/Endstück statt abgeschnittener Kachel). Alle Straßenenden der Karte prüfen, nicht nur eines. Vorher/nachher-Bilder (Übersicht, Straße nah, jedes reparierte Straßenende, Ecke oben rechts).

**2. Aufstellungsphase:**
- Alles, was eine Einheit an ihrer **Grundstellung** ändert, soll schon in der Aufstellung gehen, kostenlos: **Aufprotzen/Abprotzen** (Geschütze), **MG auf-/abbauen**, **Ballon aufsteigen/einholen**, Blickrichtung drehen; wenn sinnvoll auch Eingraben als Startzustand (Vorschlag, im Bericht begründen). Keine Aktionen, die schon Wirkung auf den Gegner haben.
- Beim Antippen einer Einheit in der Aufstellung die **Einheitenkarte mit Fähigkeiten, Rolle und Reichweite** zeigen, dazu beim Halten über einem Feld die Reichweite/den Schussfächer von dort (wie im Spiel), damit man weiß, wen man wo am besten hinstellt.

✓ (Vorschlag, Schalter SCHARF_NEU) **3. Scharfschützen (Regel-Vorschlag des Beraters, bitte messen und berichten):**
- **Nur aus dem Stand:** Haben sie sich in dieser Runde bewegt, können sie nicht schießen (wie Minenwerfer `noMoveFire`). Erst prüfen, ob das heute schon so ist.
- **Normaler Schuss:** **ordentlicher Schaden gegen Infanterie** (ungepanzert: sichtbar Figuren weg; gegen gepanzerte Ziele schwach wie bisher), aber **kein automatisches Niederhalten** mehr.
- **Neue Fähigkeit „Niederhalten“** (Name gern besser, z. B. „Kopf runter!“): ein gezielter Schuss, der das Ziel niederhält und Moral kostet, statt Schaden; **Abklingzeit 2 Runden**; kostet die Aktion; auch nur aus dem Stand. Symbol/Kopfzeichen vorhanden (s_garbe/supp) oder als Wunsch für den Berater melden.
- KI anpassen (Schuss auf Infanterie, Fähigkeit gegen MG/Geschütze/Angreifer), `node tools/sim.js 200` auf allen drei Karten: Siegquote, Kaufzahlen und Wirkung der Scharfschützen vorher/nachher. Kosten neu berechnen lassen (costParts). Ist der Unterschied groß, Vorschlag statt Einbau.

✓ **4. Ruckler auf Krähenfurt:** Enrico hatte gestern immer wieder kurze Hänger („das Spiel hängt, schleift“). Ursache suchen (Messung wie beim Einschlag-Test: längste Bildpausen beim Ziehen, Schießen, Einschlägen, KI-Zug, Schneefall, Spuren, Ufer/Häuser-Neuaufbau, Speicher). Ergebnis mit Zahlen in den Bericht, dann beheben. **Nachtrag (Enrico 19:15):** Das Hängen/Schleifen kommt **gegen Ende der Partie**, vor allem **auf der rechten Kartenseite**, möglicherweise **nachdem Eis gebrochen ist**. Verdacht prüfen: Neuaufbau beim Eisloch/Zufrieren (Überblendung), wachsende Zahl von Bodenspuren/Trichtern/Spuren-Aufklebern, Effekte die nicht aufgeräumt werden (Gas, Rauch, Funken, Kopfzeichen), Speicher (Leinwände je Feld). Langzeit-Messung: eine KI-gegen-KI-Partie Krähenfurt bis zum Ende mit Bildzeiten je Runde (`test_ki_partie.mjs`, KARTE=winterdorf), Verlauf in den Bericht. Hinweis: Am 23.11. lief parallel ein langer Hintergrund-Test im Browser – Enricos Eindruck kann davon mit beeinflusst sein, deshalb messen statt raten.

✓ **5. Spuren auf Straßen weglassen:** Fahren Panzer/Geschütze über die braune Matschstraße (oder andere Nicht-Schnee-Böden), passen die Spuren farblich nicht. → Spuren nur auf Schneeflächen (und ggf. Acker mit Schnee) zeichnen, auf Straßen/Wegen/Eis/Furt gar nicht. Auf Schnee bleiben sie wie bisher.

✓ **6. Zielmarke „Ziel markieren“ (Leuchtpistole):** Unter dem Markierungszeichen erscheint ein **gelbes Zielvisier**, das sich **über die Figur legt**. Gelb sticht heraus und nimmt Immersion. → Farbe **helles Beige/Knochenweiß** (Palette STYLE.md), dezent; das Visier liegt **flach am Boden als Ring um die Figur** (Figur steht in der Mitte, wie die Standringe), nicht über der Figur. Gleiche Regel für andere gelbe Markierungs-Overlays prüfen und im Bericht nennen.

**7. Meldegänger mit Hund:** Die Fähigkeit „+2 Bewegungspunkte für eine Einheit“ (`E.sendOrder`) geht **jede Runde** – zu stark. → **Abklingzeit 2 Runden** (Anzeige am Knopf wie bei anderen Abklingzeiten), KI anpassen, sim messen.
- **Idee Enrico (nur Vorschlag ausarbeiten, nicht bauen):** Meldegänger mit dem **Sanitätstrupp zusammenlegen** zu einem Trupp mit Hund (im Ersten Weltkrieg gab es Sanitätshunde, die Verwundete suchten, und Meldehunde). Bitte 2 Varianten vorschlagen, z. B. (a) Sanitätstrupp mit Hund: heilen + „Melden“ mit Abklingzeit; (b) Meldegänger bekommt zusätzlich eine kleine Sanitätsfähigkeit (Verwundete bergen: etwas Stärke/Moral zurück). Je Variante: Werte, Preis, was mit den Bildern/Tönen passiert, Text „Im echten Krieg“ mit belegbaren Fakten, und kurze sim-Messung. Enrico entscheidet.

✓ **8. Sturmlauf (Stahlgänger u. a., abil `rush`):** Der Sturmlauf soll **nicht von Feindberührung aufgehalten** werden (Panzer oder andere Einheit daneben): die Einheit **läuft an ihnen vorbei** (Gegner werden dabei **nicht** verschoben oder beiseitegeschoben – Enrico 24.11.: es geht nur darum, dass die Feindberührung den Sturmlauf nicht blockiert), **ohne Freischlag/Gegenschlag** (`E.freeBlows`) und ohne dass „gebunden“ (`E.held`) oder Feindberührung die restlichen Punkte verfallen lässt. Ziel-/Belegungsregeln bleiben (kein Feld mit Einheit, nicht durch Einheiten hindurch). Wegvorschau entsprechend. sim kurz messen. **Nachtrag (Enrico 18:53):** Ein Sturmlauf der Stahlgänger auf einen Gegner wurde **gar nicht angeboten bzw. ging nicht**, weil im Weg (bzw. aus diesem Winkel) eine **Mine** lag. → Minen (bekannte wie versteckte) dürfen den Sturmlauf **nicht verhindern**: Der Sturmlauf startet, die Einheit läuft auf die Mine, **löst sie aus und bleibt dort stehen** (Schaden wie üblich, Sturmlauf endet). Wegvorschau zeigt bei bekannter Mine das Warndreieck wie beim normalen Ziehen. Gleiches für andere Hindernisse prüfen, die den Sturmlauf heute still sperren (Draht, Gas, Feuer): lieber hineinlaufen und anhalten/Schaden nehmen als gar nicht erlaubt.

✓ **9. FEHLER Bedienung – zwei Aktionsknöpfe gleichzeitig aktiv, Einheit blockiert:** Beispiel Panzer: „Kanone“ gewählt, nicht geschossen, dann „MG“ (Zweitwaffe) gewählt → **beide bleiben aktiv, nichts geht mehr**. Gleiches bei den Stahlgängern: Fähigkeit gewählt (ging nicht), dann „Schießen“ → blockiert. → Es darf immer **nur ein Modus aktiv** sein: neuer Knopf löst den alten ab; nochmal auf den aktiven Knopf, Rechtsklick oder Esc bricht ab; ein Modus, der nicht ausführbar ist, wird sofort zurückgesetzt (mit kurzem Hinweis warum). Für alle Kombinationen prüfen (Schießen, Zweitwaffe, Fähigkeit, Draht schneiden, Befehl, Marsch, Feuerbereitschaft, Sperrfeuer …) und als Test in `test_partie.mjs` aufnehmen. **Hoher Vorrang** (gleich nach dem Fehler 18:30).

**10. Fähigkeiten-Knöpfe an anderer Stelle (Entwurf, nicht bauen):** Die Fähigkeiten stehen heute mittig unten und wirken verwirrend. Idee Enrico (ähnlich Total War): **Fähigkeiten direkt an der Einheitenkarte** – unten links neben bzw. unter dem Porträt als **runde, eingekreiste Knöpfe**; besonders für Helden- und Schreiter-Fähigkeiten. Bitte 2 Entwürfe als Screenshots (z. B. A: alle Fähigkeiten rund unter dem Porträt, normale Aktionen wie Schießen/Ziehen bleiben in der Leiste; B: nur Sonderfähigkeiten/Heldenfähigkeiten groß am Porträt, Rest wie bisher), nach STYLE.md, Knöpfe ≥ 40 px, bei 1280/1920/2560 px. Enrico wählt.

**11. Kommandobunker für General und Hauptmann (Vorschlag, nicht bauen):** Anführer können im Kampf wenig und können sich z. B. nicht eingraben. Idee Enrico: Fähigkeit **„Kommandobunker“** – der Anführer gräbt sich zu einem Bunker ein (starke Deckung, zieht nicht mehr, bis er ihn verlässt). **Mit Funker in der Nähe** (Signal-/Fernsprechtrupp o. ä. daneben oder in 2 Feldern) behält bzw. vergrößert er seine Befehlsreichweite; **ohne Funker** reicht sein Befehl aus dem Bunker nur 1 Feld. Bitte ausarbeiten: genaue Regeln (Reichweiten mit/ohne Funker, Abwehr, Verlassen), Wechselwirkung mit Befehlen/großem Befehl/Banner, Bild (Bunker-Baustein vorhanden?) und Ton, KI-Nutzung, sim-Messung als Vorschlag. Enrico entscheidet.

**12. Mehr Deckung in der Kartenmitte:** Der Boden in der Mitte (Krähenfurt, offene Schneefelder zwischen den Linien) soll **etwas Deckung bieten**, damit man vorrücken kann, ohne nur im Offenen zu stehen. Vorschlag: einzelne Felder mit Deckungsgelände in der Mitte (Granattrichter, Holzstapel, Zaunreste, Steinmauer-Stück, Karren, Gebüsch/Schneewehe), **leichte Deckung** (Bronze), punktsymmetrisch für beide Seiten fair. Grauwall und Sankt Ruß kurz mitprüfen (gleiches Problem?). Danach sim 200 je Karte (4 Startwerte), Siegquote im Ziel halten. Vorher/nachher-Übersicht.

✓ **13. Zielflaggen besser sichtbar:** Die Flaggenpunkte sieht man schlecht, **besonders die der Aschenwacht** (Feldgrau auf Schnee). → deutlicher darstellen: etwas größer/höher, kräftigere Kontur, Fraktionsfarbe satter, dazu eine **dezente Bodenmarke** am Fuß (Ring/Kreis in Knochenweiß bzw. Fraktionsfarbe, flach, nicht grell), neutrale Flaggen klar von eroberten unterscheidbar; in der herausgezoomten Übersicht prüfen. Gilt für alle Karten.

✓ **14. Panzer-Spezialangriff mehr Wucht** (vermutlich **Sturmrollen** von Landkoloss/Sturmpanzer – bitte bestätigen, sonst die gemeinte Fähigkeit nennen): Die Einblendung/das Schild gefällt Enrico, aber der Effekt **hört zu plötzlich auf**. Wünsche: (a) vorher als Ankündigung eine **Dampfpfeife** (Ton suchen/bauen, tief und laut, kurz), (b) beim Aufprall **mehr ringsherum**: Trümmer, Erd-/Schneebrocken, Staubwolke, Druckwelle (Bild 3 aus `fx_faehigkeiten.png`), Kamerawackeln, Figuren fliegen/kippen, (c) danach ein kurzer **Nachhall** (Staub legt sich, Rauch aus dem Auspuff, Kettenrasseln). Gehört zu Abschnitt 17:30 Punkt 6 („Wucht und Panache“). Fehlen Bilder, im Bericht melden.

✓ **15. „Ziel markieren“ (Leuchtsignal; Ballonbeobachter, Signaltrupp) deckt Minen/Verstecktes auf – prüfen:** Laut Beschreibung deckt die Markierung versteckte Gegner und **Minen** im Feld und daneben auf (`q.known`). Enrico hat **noch nie gesehen, dass dabei Minen sichtbar werden**. → Prüfen, ob es funktioniert und ob die aufgedeckten Minen/Einheiten auch **gezeichnet** werden (Minen-Marke sichtbar für den Spieler, Hinweis/Kopfzeichen „Mine entdeckt“). Neu: **Solange die Markierung aktiv ist** (bis zum nächsten eigenen Zug), werden im Lichtkreis **auch neu gelegte Minen** und neu hineinziehende versteckte Einheiten sofort aufgedeckt. Lichtkreis sichtbar machen (warmes Leuchten am Boden, kein greller Kreis – vgl. Punkt 6). Test in `test_regeln.js`.

**16. Feldkanone: Sperrfeuer weg, dafür panzerbrechende Granaten:**
- **Sperrfeuer streichen** (die Feldkanone ist ein Direktschuss-Geschütz).
- Normaler Schuss = **Standardgranate** (gegen Infanterie/alles), weiter direkt und flach.
- Neue Fähigkeit **„Panzergranate“** mit **begrenzten Ladungen** (Vorschlag 3 je Schlacht, wie `T.ladungen`/`u.ladUsed` der Mineure): starker Schuss gegen Fahrzeuge, Schreiter und gepanzerte Ziele (Waffenart „schwer/AT“ im Faktor-Dreieck), Zähler am Knopf.
- Balance: Wenn die Feldkanone damit zu stark wird, den **normalen Schuss gegen Panzer etwas schwächer** machen, sodass die Panzergranate der eigentliche Panzerknacker ist. Messen (sim 200, alle drei Karten), Preis neu berechnen, KI: Panzergranate nur gegen gepanzerte Ziele. Kein „Im echten Krieg“-Text dazu (Enrico 18:44: eigene Fantasy-Welt, Weltkriegs-Bezüge nicht mehr nötig – Grundsatzfrage zu den bestehenden Texten folgt). Ton/Effekt für den Panzergranaten-Schuss vorschlagen.

**17. Schadenszahlen im Spielstil:** Die aufsteigenden Zahlen sollen zum **schroffen Stil** passen (Ziffernschrift „Arm Ziffer“/`tools/ziffern.py`, gern rauer, wie gestempelt/gekratzt), aber **immer gut lesbar** bleiben (Kontur/Schatten). **Je Seite eigene Optik**, damit man sofort sieht, wer Schaden nimmt: z. B. Konkordat Ochsenblut-Töne, Aschenwacht Feldgrau/Knochenweiß – andere Füllung/Textur, gleiche Lesbarkeit. Falls es **kritische Treffer** gibt (prüfen; sonst nur vorbereiten, keine neue Regel): kleines **„Krit!“** daneben. Entwurf mit Screenshots (hell/dunkel, Schnee/Schlamm, 1280/2560 px), dann einbauen.

**18. Schrecken durch Panzer/Fahrzeuge als „Entsetzenstest“:** Heute lösen Fahrzeuge Schrecken (Moralverlust/Flucht) offenbar schon aus, **nur weil sie sich bewegen/nähern**. → Ändern: Schrecken nur, **wenn ein Fahrzeug/Koloss eine Einheit angreift** (Beschuss oder Nahkampf/Überrollen/Sturmrollen). Dann macht die angegriffene Einheit einen **Entsetzenstest** (wie bei Warhammer): **geringe** Grundwahrscheinlichkeit, steigt mit wenig Stärke/wenigen lebenden Figuren, niedriger Moral, schlechter Deckung, Einheitsart (Fußtruppen, Geschützbedienungen anfälliger; Elite/Sturmtruppen weniger); sinkt mit Anführer/Banner in der Nähe. Bei Misserfolg: niedergehalten oder zurückweichen (keine Sofortflucht bei voller Stärke). **Immun:** Helden, Schreiter/Mechs („Roboter“), Kampfanzüge, Fahrzeuge selbst. Kopfzeichen bei bestandenem/nicht bestandenem Test. Formel vorschlagen, sim 200 auf allen Karten (wie oft ausgelöst, wie oft durchgefallen, Siegquote vorher/nachher). Den Test ggf. später auch für Helden-Furcht (Kürassier) und Löwengebrüll vereinheitlichen – im Bericht vorschlagen.

✓ **19. Gasgranate als Luftzerleger:** Wenn ein Geschütz eine Gasgranate schießt: Geschoss fliegt zur **Mitte** des Zielbereichs, **zerplatzt in der Luft** (kleiner dumpfer Knall, Hülsensplitter) und **drei Gasschlieren** sinken in Bögen auf die betroffenen Felder herab, wo dann die Gaswolke wie bisher entsteht. Gilt für alle Gasgeschosse (Haubitze, ggf. Mörser). Wolke erst beim Aufsetzen der Schlieren zeigen (Anzeige-Regel VIS). Vorhandene Gas-Effekte (`fx_*`, Ton `gas`) nutzen; fehlt ein gemaltes Bild für die Schliere, im Bericht melden (Berater lässt es malen).

✓ **20. Heilbare Einheiten markieren:** Wählt man einen Sanitäts-/Versorgungstrupp (Feldscher, Sanitäter, Werkstatt/Reparatur) bzw. dessen Fähigkeit, erscheinen über den Einheiten, die **jetzt geheilt/repariert werden können**, **3–4 kleine, aufsteigende Pluszeichen** (klassische Heil-Darstellung, dezent, aber gut sichtbar; Farbe passend zur Palette, kein Neongrün – z. B. Knochenweiß/blasses Rot-Kreuz-Rot; bei Reparatur kleine Zahnräder/Schraubenschlüssel). Nur so lange die Einheit gewählt ist. Gleiches Prinzip prüfen für andere „wer kann Ziel sein“-Fähigkeiten (Munition, Entgiften, Befehle).

**21. Handgranaten in der Nahkampf-Animation nur, wo sie hingehören:** Die normalen Aschenwacht-Fußtruppen werfen am Ende ihrer (gelungenen) Nahkampf-Animation **immer eine Granate** – Enrico meint, die normale Infanterie hat gar keine. **Erst klären und im Bericht sagen:** Kommt die Granate aus der Regel **`granatSturm` der Aschengrenadiere** (F103, Ereignis `handgranate`, macht Schaden) oder ist sie nur Animation? Wenn nur Animation: entfernen. Wenn Regel: **nicht eigenmächtig streichen**, sondern als „Frage an Enrico“ (Regel behalten und dann ist die Granate richtig, oder Regel streichen).
- Gewünscht: Granaten-Wurf in der Animation **nur bei Einheiten, die wirklich Granaten/Ladungen haben** (Sturmtruppen, Panzerabwehr, Pioniere mit Ladung usw.).
- **Ausnahme:** Kämpft **irgendeine Fußtruppe im Nahkampf gegen ein Fahrzeug/Koloss**, darf sie zur Darstellung eine **kleine Granate** werfen (nur Bild/Ton, **kein Zusatzschaden**), dazu wie bisher Kolbenschläge/Hiebe.

✓ **22. FEHLER – Fähigkeit wird durch bloßes Anklicken einer anderen Einheit ausgelöst:** Versorgungstrupp gewählt, dann auf die **eigene Feldkanone geklickt** → sie bekam sofort **Munition** (neue Aktion), obwohl Enrico nur die Kanone auswählen wollte. (Beim Sanitäter wurde das am 22.11. schon behoben – Munition/Reparatur/Befehle/Entgiften/Meldegänger offenbar nicht überall.)
- Regel: **Fähigkeiten nur, wenn vorher der Fähigkeitsknopf gedrückt wurde** (Modus aktiv). Ein Klick auf eine andere **eigene** Einheit ohne aktiven Modus = **diese Einheit auswählen**. Klick auf eine **feindliche** Einheit ohne Modus bleibt wie bisher (Angriff/Vorschau des normalen Schusses) – nur Fähigkeiten dürfen nicht nebenbei ausgelöst werden.
- Für **alle** Fähigkeiten mit eigenem Ziel prüfen und in `test_partie.mjs` absichern. **Hoher Vorrang** (zusammen mit Punkt 9 und dem Fehler 18:30).

**23. Moral-Aura für Anführer (Vorschlag, nicht bauen):** Wie bei Total War sollen **General und Hauptmann** (und Helden, soweit sie noch keine haben) eine **Moral-Aura** bekommen: Einheiten im Umkreis (Vorschlag 1–2 Felder) verlieren weniger Moral bzw. erholen sich schneller, fliehen seltener; der Bereich wird beim Auswählen dezent am Boden gezeigt. Später in der Kampagne über Fähigkeiten/Erfahrung **verbesserbar** (größerer Umkreis, stärkere Wirkung). Bitte vorschlagen: Werte, Zusammenspiel mit Befehlen, Banner, Rote-Faust-Aura „standhaft“, Kommandobunker (Punkt 11) und dem Entsetzenstest (Punkt 18); sim-Messung. Enrico entscheidet.

✓ **24. Kamera nach dem Schuss zurück:** Fährt die Kamera bei einem Fernschuss (Kanone, Haubitze, Mörser, Feuerschlag, Faustsalve …) zum Einschlag, soll sie danach **weich und kurz zurück dorthin fahren, wo sie vorher stand** (nach ca. 0,5 s Pause, damit man die Wirkung sieht). **Nur im eigenen Zug** (im KI-Zug folgt sie weiter den Ereignissen). Abbrechbar mit Klick/Scrollen/Leertaste. Einstellung in den Optionen „Kamera nach dem Schuss: zurück / bleibt beim Einschlag“, Standard „zurück“, gespeichert.

Bericht mit Bildern, „Fragen an Enrico“, im Chat „– pb“.

# >>> JETZT (Enrico 2026-11-23 17:30): Fähigkeits-Effekte im Tintenstil statt „blank polierter“ Kreise <<<
**Reihenfolge:** nach 16:50 (Ton-Pult 3), vor oder nach 17:10/17:20 – wie es passt.

**Problem (Enrico):** Beim Löwengebrüll des Kreuzschreiters breitet sich ein **gelber Kreis** aus – wirkt glatt/„blank poliert“, passt nicht zum Tinten-Stil und ist dadurch nicht beeindruckend. **Ähnliches gibt es bei anderen Fähigkeiten.**

**Neuer Bogen:** `ui-quelle/effekte/fx_faehigkeiten.png` (2512×1664, Flux, 3×2, Magenta), gemalt mit Tinte und Schraffur:
1 oben links – Gebrüll von der Seite: Druckwellen-Kegel mit Staub, Steinen, Blättern (links ist eine Rohr-/Düsenspitze mitgemalt → wegschneiden)
2 oben Mitte – Gebrüll von oben: zwei gezackte Staubringe
3 oben rechts – Boden-Druckwelle mit aufgerissener Erde (Landung Sprungangriff, Faustschlag, Durchbruch, schwerer Aufprall)
4 unten links – Dampfstoß (Rote Faust; links Düse wegschneiden)
5 unten Mitte – Furcht-Ring mit Rauchklauen (Aura des Eisernen Kürassiers)
6 unten rechts – Funken und Metallsplitter (Kettenklingen-Treffer, Hinrichtung)

**Auftrag:**
1. **Erst eine Liste** aller Fähigkeits-/Helden-Effekte, die heute im Code als glatte Kreise, Ringe, Wellen oder Leuchtflächen gezeichnet werden (u. a. `gebruellFx`/`drawSchall`, `heldRing`, `drawHeldAura`, `auraPuls`, `faustDampf`, `heldBlitz`, `drawNimbus`, Wirkungsbereich beim Auslösen, Sprung-Landung, Befehle/großer Befehl, Banner, Gasschutz …) – mit Screenshot je Effekt in den Bericht.
2. Bogen mit `tools/fx_cut.py` schneiden (neuer Eintrag in `CFG`), FXNEU.
3. **Ersetzen:** Gebrüll = Kegel (1) in Richtung der Ziele, dazu die Ringe (2) am Boden um den Schreiter, kräftig, mit Kamerawackeln wie bisher; Landung/Aufprall = (3); Dampf = (4); Furcht-Aura = (5) pulsierend am Boden statt Leuchtkreis; Hinrichtung/Kettenklinge = (6). Die gelben/leuchtenden Kreise weg oder höchstens ganz dezent als Untergrund.
4. Für Effekte aus der Liste, die zu keinem der 6 Bilder passen: im Bericht auflisten mit Vorschlag, welches Bild der Berater noch malen lassen soll (keine neuen glatten Kreise bauen).
5. Bildwirkung „aus“ = ohne diese Effekte wie bisher. Vorher/nachher-Bilder in den Bericht.
6. **Nachtrag Enrico (18:04) – Wucht und Panache:** Die Sonderfähigkeiten der **Helden** (Rote Faust: Durchbruch; Eiserner Kürassier: Hinrichtung, Furcht) und der **Stufe-3-Schreiter** (Kreuzschreiter: Löwengebrüll, Löwenmaul-Kanone; Eisenknecht: Faustsalve) sollen **richtig reinhauen** – zuerst diese, die übrigen Fähigkeiten danach. Zusammenspiel prüfen: Bild (gemalter Effekt), kurzer Stillstand im Treffer (`stopBis`), Kamerawackeln/-fahrt, Ton, Ziel fliegt/kippt, Figuren fallen sichtbar. Der Eindruck hängt auch am **Schaden**: im Bericht je Fähigkeit den tatsächlichen Schaden (Durchschnitt aus der Simulation) nennen und sagen, ob er zur Wirkung passt – **Werte nicht ändern**, nur Vorschlag (gehört zur späteren Balance-Runde „Fleischwolf“). Fehlen gemalte Bilder für diese Momente (z. B. Mündungsdonner der Löwenmaul-Kanone, Doppelschuss der Faustsalve, Hinrichtungs-Hieb), im Bericht auflisten – der Berater lässt sie malen.

# >>> JETZT (Enrico 2026-11-23 17:20): Liste fehlender Sprachbefehle + Stimmproben zum Klonen (nur Liste, nichts einbauen) <<<
**Reihenfolge:** nach 16:50 (Ton-Pult 3) und 17:10 (Brainstorm/Maßstab). Kleiner Auftrag.

Enrico vermisst gesprochene Befehle (z. B. „Feuer frei“). Der Berater will die fehlenden Sätze mit **geklonten Suno-Stimmen** (die „Command & Conquer“-Sprüche aus `sound-quelle/Voices/eigene/`) bei fal.ai erzeugen. Dafür bitte:

1. **Liste aller Befehle, Fähigkeiten und Momente, die im Spiel keine eigene gesprochene Zeile haben** (aus dem Code, nicht aus der alten TONPLAETZE.md): je Seite (Konkordat = Englisch, Aschenwacht = Deutsch) und je Sprechergruppe (Infanterie/Gasmaske, Kampfanzug, Panzer-Bordfunk, Schreiter, Hauptmann, General; Helden ausgenommen – die haben ElevenLabs-Stimmen). Mit Spalten: Moment/Befehl · wer spricht · heutiger Ton (oder „keiner“) · **Vorschlag für den Satz** (kurz, 1–4 Wörter, Ton wie die bestehenden Sprüche; Englisch bzw. Deutsch; Aschenwacht nüchtern-hart, keine echten Wehrmachts- oder NS-Formeln) · gewünschte Varianten (2–3). Beispiele: Feuer frei, Halten um jeden Preis, Sammeln (Aschenwacht), Sturmangriff, Generalangriff, Marsch, Banner aufpflanzen, Eingraben, MG in Stellung, Sperrfeuer, Ziel markiert, Feuerschlag, Rauch, Gas, Granate, Rückzug, Nachschub angekommen.
2. **Stimmproben zum Klonen:** je Seite und Sprechergruppe die 2–3 besten **ungefilterten** Suno-Originalaufnahmen (klar, ohne Musik/Hall, zusammen 10–30 s) heraussuchen und als WAV nach `entwurf/postfach/stimmproben/<seite>_<gruppe>_<n>.wav` kopieren (nur Kopien, Originale bleiben). Gibt es keine ungefilterte Fassung, die leichteste Filterstufe nehmen und das vermerken.
3. Ergebnis als `entwurf/postfach/STIMMEN_FEHLEN.md` (Tabelle) + kurzer Bericht. Nichts im Spiel ändern.

# >>> JETZT (Enrico 2026-11-23 17:10): Brainstorm festhalten + Probebild „Maßstab“ (NICHTS im Spiel ändern) <<<
**Reihenfolge:** nach 16:50 (Ton-Pult 3). Reine Ideen und eine Testseite – **keine Änderung an Regeln, Spiel oder Balance.**

**1. In `IDEEN.md` eintragen** als Abschnitt „Brainstorm Spielsystem (Enrico + Berater, 2026-11-23) – noch nichts bauen“:
- **Kampagne:** eigenständige KI-Staaten (jeder für sich), der Spieler ist Teil einer Allianz; Bündnisse in den Einstellungen wählbar (mit/ohne). Später einfacher Handel und Eisenbahnlinien. Langfristig Menschen gegen „das Böse“ (eine einzige böse Fraktion, Horde). Offen: von Anfang an Koop oder erst gegeneinander. Idee Berater: Kampagne gleich für Bündnisse bauen, Aschenwacht spielt zum Testen vorläufig den Feind. „Masse gegen Klasse“: Feind viele billige Armeen, Spieler weniger, aber erfahrene Armeen mit Helden; verbündete KI hält die Front, Spieler-Armee ist die Speerspitze. Koop am selben PC (Hotseat) denkbar.
- **Schlachtende:** Kombination wie Total War – Sieg durch Zusammenbruch/Vernichtung, durch Halten aller Zielfelder über eine Zeit, oder nach Rundengrenze nach Punkten. Rundengrenze nach Schlachtgröße (kurz/mittel/lang ≈ 30/45/60 Minuten), höchstens etwa eine Stunde. Kein „schon gewonnen?!“ mitten in der Schlacht.
- **Moral/Schaden:** Schaden über Modelle statt über Moral – jede Figur ist ein Kämpfer, Feuerkraft hängt an den lebenden Modellen, schwere Waffen töten mehrere Modelle; Moral steuert nur Verhalten (niedergehalten, zurückweichen, sammeln, fliehen; Sammeln mehrmals möglich, Armee bricht erst spät). Vorbild: Radious-Mod (längere Schlachten, fortlaufendes Moralsystem) und Total War: Warhammer 40.000 (jedes Modell eigene Schusslinie, Trupps aus verschiedenen Figuren, Deckung/Stellung entscheidend).
- **Zerstörung spürbar:** Treffer im Offenen tödlich, Deckung macht den großen Unterschied, schwere Waffen „knallen“ (Splitter, Niederhalten, Figuren fallen sichtbar). Gewehrsalve auf ungedeckten Trupp darf nicht wirkungslos wirken.
- **Armee:** feste Formation je Armee (wie Total War), Schlachtgröße mit Grenze je Einheitentyp (Linientruppen doppelt), Verbände je Fraktion mit Armee-Bonus; **Reserve** statt Nachkaufen (Teil der Armee kommt später, Balken zeigt ausstehende Verstärkung). Offen (Enrico denkt nach): Nachschub/„Fleischwolf“.
- **Maßstab (Entscheidung 2026-11-23):** Linien-Infanterie 10 Figuren je Feld, Reiter 6, Spezialtrupps 4; Soldaten ca. 62 % der heutigen Größe, Fahrzeuge bleiben gleich groß. Probebild im Spiel (unten) zur Bestätigung.
- **Zweistufige Tooltips (Enrico 2026-11-23, nicht wichtig, nur Idee):** Beim Verweilen mit der Maus über Gelände, Einheit, Knopf oder Marke erscheint nach ca. 0,6 s ein kleines, **gut lesbares Fenster** (nicht zu kleine Schrift) mit Namen und 1–2 kurzen Zeilen (z. B. „Zugefrorenes Wasser – keine Deckung, kann einbrechen“). Bleibt man **länger** (ca. 2–3 s) darauf oder drückt eine Taste (z. B. Umschalt/i), klappt es zur **ausführlichen Erklärung** mit den Regeln auf. Touch: langes Drücken = Stufe 1, nochmal lang = Stufe 2. Darf nie stören (kein Aufpoppen beim normalen Überfahren).
- **Flieger-Unterstützung (Idee Enrico 2026-11-23, Ausarbeitung später):** Funker/Fliegerleit-Trupp auf beiden Seiten (Umbau Fernsprechtrupp?) ruft einen einmaligen Luftschlag, bezahlt mit **Nachschubpunkten**: **Tiefflieger** (MG-Garbe über eine Linie von 3 Feldern, niederhalten) oder **Bomber** (2–3 schwere Bomben mit Streuung). Flugzeug fliegt einmal schräg übers Bild (Schatten, Motordröhnen, Sirene), wirft ab, weg. Grenzen: Kosten, Abklingzeit bzw. 1–2× je Schlacht, Streuung/Eigenbeschuss, später Flak. Für die Kampagne: Flugplätze schalten Luftschläge frei.
- **Stilrichtung (Enrico 2026-11-23):** eigene Fantasy-Welt; Mischung aus Erstem und Zweitem Weltkrieg, Trench Crusade, ein Hauch Mad Max und Warhammer Fantasy; über die Zeit optisch mehr Richtung Zweiter Weltkrieg (Panzer), später Flugzeuge. Weltkriegs-Bezüge („Im echten Krieg“) sind nicht mehr Pflicht.

**2. Probebild „Maßstab“ als Testseite** (`entwurf/probe/massstab.html` bzw. mit Spiel-Code im Probe-Modus; **das Spiel selbst bleibt unverändert**):
- Derselbe Kartenausschnitt (Krähenfurt Dorfplatz und Grauwall Graben), gleiche Kamera, 1920 px, je Variante ein Bild nah und eins ganz herausgezoomt:
  - **A heute:** 4 Figuren je Trupp, Reiter wie jetzt (2–3), Soldat 0,8 Feldradien.
  - **B mittel:** 8 Figuren je Trupp (zwei lockere Reihen), Reiter 5–6, Soldat ca. 0,6 Feldradien, Felder gleich groß.
  - **C groß:** 10–12 Figuren je Trupp, Reiter 6–8, **Felder größer** (Feldradius ca. ×1,3), Soldat ca. 0,65 – dafür weniger Felder im Bild.
  - **Entscheidung Enrico (2026-11-23 19:36): Maßstab A** – Fotomontage mit echten Figuren liegt in `entwurf/probe/massstab/massstab_A_10_6.jpg` (gewählt) und `massstab_B_12_8.jpg` (verworfen, zu klein/fipsig). D ist damit die Zielvariante (Soldaten ca. 62 % der heutigen Größe); A–C nur noch kurz zum Vergleich.
  - **D – Enricos Wunsch (2026-11-23, wichtigste Variante):** **Linien-Infanterie 10 Figuren** (zwei Reihen à 5), **Reiter 6** (zwei Reihen à 3), **Spezialtrupps bleiben bei 4** (Sturm, Pioniere, Scharfschützen, Kampfanzüge …), Bedienungen von MG/Geschütz wie bisher. **Gleicher Figurenmaßstab für alle Soldaten** (ca. 0,55–0,6 Feldradien), Felder gleich groß; Fahrzeuge/Schreiter behalten ihre Größe (wirken dadurch größer). Gleiche Posen mehrfach nutzen, aber gespiegelt/leicht versetzt/gedreht, damit keine Klone in Reihe stehen; im Bericht sagen, ob zusätzliche Posen nötig wären.
- Gemischte Aufstellung je Bild: Schützen, MG, Reiter (wichtig: **Kavallerie soll nach was aussehen**), ein Panzer, ein Geschütz, ein Schreiter, ein Held. Fahrzeuge/Schreiter bleiben 1 Feld.
- Regeln: Figuren bleiben im eigenen Feld (nichts verdeckt Nachbarfelder), Ringe, Balken, Zustandsmarken bleiben lesbar und antippbar (≥ 40 px).
- Dazu je Variante eine **Leistungsmessung** (Zeichenzeit je Bild bei voller Karte mit beiden Armeen) – damit wir wissen, was ohne Grafikumbau geht.
- Bilder nach `entwurf/probe/massstab/`, im Bericht nebeneinander; Fragen an Enrico.

# >>> ✓ JETZT (Enrico 2026-11-23 16:50): Ton-Pult 3 – einfach, vollständig je Einheit, Abstellkammer, eigene Mischtöne <<<
**Warum:** Ton-Pult 2 ist Enrico zu unübersichtlich („ADHS-gerechter, simpler“). Die Bibliothek ist nach Dateinamen statt nach Gehör sortiert (z. B. Atmen mit Schaufeln unter Stimmen statt bei Graben), und je Einheit fehlen Plätze bzw. es stehen welche drin, die die Einheit nie benutzt. Aufbau gern **neu machen**; Speicher/Export/`tonwahl_bau.mjs` müssen aber weiter passen (Enricos Wahl vom 22.11. darf nicht verloren gehen). Ton-Pult 2 bleibt als „Experten-Ansicht“ erreichbar.

**1. Hauptansicht in drei Schritten (ein Bildschirm, große Flächen, wenig Text):**
- **Wer?** große Einheitenbilder (Porträts), dazu Gruppenknöpfe (Art/Seite/Waffe wie bisher). Mehrere wählbar.
- **Wann?** große Kacheln nur für die Momente, die **diese Einheit im Spiel wirklich hat** (aus dem Spielcode abgeleitet: Waffen, Fähigkeiten, Zweitwaffe, Bewegungsart, Stimmen, Tod, Aufgerieben …). **Nichts anzeigen, was die Einheit nie benutzt** (eine Einheit ohne Schuss hat keine Kachel „Schießen“). **Und nichts darf fehlen**: Jeder Tonplatz, den das Spiel für diese Einheit abspielen kann, braucht eine Kachel. Bitte mit einem Test absichern (je Einheit: Liste der im Spiel möglichen Tonplätze == Kacheln im Pult).
- **Welcher Ton?** Es erscheinen **nur Töne, die zu diesem Moment passen** (Laufen → Schritte, Schießen → Waffen der passenden Art …), mit ▶ und großem Antippen = gewählt. Knopf **„Alle Töne ansehen“** öffnet die ganze Bibliothek zum Stöbern.
- **Fortschritt je Einheit:** Haken/Zähler „7 von 7 Momenten eingestellt“ – Enrico will eine Einheit einmal komplett durchgehen und dann ist sie **fertig**. Liste der Einheiten zeigt fertig / offen.

**2. Bibliothek nach Gehör neu einsortieren:** Rubriken wie bisher, neu dazu **„Graben und Schanzen“** (Schaufeln, Atmen beim Graben, Sandsäcke, Draht). „Handgriffe und Gerät“ bleibt. Einsortieren nach Inhalt, nicht nach Dateiname: Wo unsicher, anhand der Quelldatei/Länge/Pegel abschätzen und mit „?“ markieren, damit Enrico es beim Hören korrigiert. Enrico soll einen Ton selbst **umsortieren** können (Rubrik ändern, wird gespeichert/exportiert).

**3. Abstellkammer (aussortieren, nicht löschen):**
- Neben jedem Ton ein Knopf „aussortieren“ → verschwindet aus allen Auswahllisten, landet in der **Abstellkammer**, dort mit einem Klick zurückholen. Nichts wird gelöscht (weder in `sound-quelle/` noch in `sound.js`).
- **Ganze Bereiche abschalten:** Rubrik, Herkunft oder Sprechergruppe mit einem Schalter ausgrauen (z. B. alle ElevenLabs-Stimmen) und später wieder einschalten.
- Im Spiel: Ist ein aussortierter Ton Teil einer Gruppe mit Varianten, spielt das Spiel nur noch die anderen. Ist er der einzige Ton für einen Moment, bleibt er, bis Enrico Ersatz wählt; das Pult markiert die Stelle mit „⚠ aussortiert, bitte Ersatz wählen“.
- Aussortiert-Liste wird gespeichert und mit exportiert; `tonwahl_bau.mjs` übernimmt sie ins Spiel.

**4. Stimmen nach Herkunft sortieren (nicht aussortieren!):**
- Jede Stimme bekommt sichtbar ihre Herkunft: **Suno** (die „Command & Conquer 1“-Sprüche, gefallen Enrico am besten), **ElevenLabs**, **Freesound/sonstige**.
- Filter/Schalter je Herkunft. Enrico entscheidet selbst, was er abschaltet. **Heldenstimmen (ElevenLabs) gelten als eigene Gruppe „Helden“** und bleiben unberührt.

**5. Mischtöne selbst bauen:**
- Neuer Bereich **„Mischton bauen“**: 2–4 Töne aus der Bibliothek übereinanderlegen, je Spur Lautstärke, Startversatz (ms) und Tonhöhe; ▶ spielt die Mischung sofort (WebAudio). Bestehende Mischtöne (`mix` in sound_bau.json) dort öffnen und ändern können.
- Speichern unter eigenem Namen → erscheint in der Bibliothek wie jeder andere Ton und ist zuweisbar. Im Export als Rezept; im Spiel entweder über `mix` in `tools/sound_bau.json` (neuer Schlüssel, Bau-Lauf) oder zur Laufzeit gemischt – wie es sauberer ist, im Bericht begründen.

**6. Nicht kaputt machen:** `arm.tonpult` (Speicher), Verlauf, Rückgängig, Export-Format bleiben verträglich; alter Export vom 22.11. muss vollständig einlesbar sein. Knöpfe ≥ 40 px, Deutsch, Touch. `node tools/tonpult_test.mjs` erweitern (Vollständigkeit je Einheit, Aussortieren/Zurückholen, Mischton), Bericht mit Screenshots; im Chat „– pb“.

# >>> ✓ JETZT (Enrico 2026-11-22 21:00): Ton-Pult 2 zusammenführen + Enricos neue Tonwahl einbauen <<<
**Reihenfolge:** nach 20:50 (Eisbruch), oder vorher, wenn 20:50 noch läuft und es sich trennen lässt – Enrico möchte seine Töne bald im Spiel hören.

Der zweite Claude Code ist fertig (Zweig `tonpult2`, Bericht `C:\Projekte\Armargeddon-ton\entwurf\postfach\BERICHT_TON.md` – bitte ganz lesen, besonders „Für den Haupt-Claude-Code“ Punkte 1–7).

1. **Zusammenführen:** `git fetch`, Zweig `origin/tonpult2` nach `main` mergen (er setzt auf `a7f424b` auf; berührt nur `tools/tonpult_*`, `tonpult.html`, `entwurf/probe/tonpult2/`, `BERICHT_TON.md`, `AUFTRAG_TON.md`). Danach `node tools/tonpult_bau.mjs` und `node tools/tonpult_test.mjs` (muss 40/40 bestehen). Den Abschnitt aus Punkt 7 in `CLAUDE.md` übernehmen. Danach kann der worktree weg (`git worktree remove C:\Projekte\Armargeddon-ton`, Zweig behalten) – **erst nachdem** alles in main gepusht ist.
2. **Enricos Tonwahl:** neuer Export `entwurf/postfach/tonpult_export_2026-11-22_2052.json` (132 Einträge, u. a. Konkordat neu gewählt). `node tools/tonwahl_bau.mjs` → TONWAHL in ui.js, build. Im Bericht: wie viele Einträge übernommen, welche ausgelassen und warum.
3. **Aus dem Ton-Bericht umsetzen:**
   - Punkt 1/Frage 6 – **Marsch bekommt einen eigenen Tonplatz** (getrennt von „Ziehen“), ebenso andere Doppelbelegungen, wo sinnvoll (Mörser Einschlag/Sperrfeuer, Aufprall Sturmrollen/Rammen/Bohrstoß). Im Pult und in `tonwahl_bau.mjs` nachziehen, bisherige Wahl auf beide Plätze übertragen.
   - Punkt 2 (`tonKontext`): „Treffer am Ziel“-Wahl darf nicht klingen, wenn die Einheit selbst getroffen wird – reparieren.
   - Punkt 3: `alleKeys` in `tonwahl_bau.mjs` um alle Schlüssel aus `SOUNDS` ergänzen, damit nichts als „Ton fehlt“ verloren geht.
4. **Enricos Antworten auf die Fragen im Ton-Bericht:** Rubrik „Handgriffe und Gerät“ bleibt · Kampfanzüge bleiben eigene Art in der Schnellwahl · Lautstärke für mehrere bleibt in Prozent vom Spielwert · Signale/Musik unter „Oberfläche“ passt (keine Einwände) · Einsortierung nach Gehör prüft Enrico beim Durchhören und meldet Fehler.
5. Enrico macht noch weitere Exporte (Aschenwacht). Ablage künftig direkt als `entwurf/postfach/tonpult_export_<datum>_<uhrzeit>.json`, neuester gewinnt (wie bisher).
6. Bericht mit Test-Ergebnissen; im Chat am Ende „– pb“.

# >>> ✓ JETZT (Enrico 2026-11-22 20:50): Entscheidungen zum Bericht „Wintereffekte, Spuren“ <<<
1. **Eis bricht ein – ja, wie vorgeschlagen:** Schwerer Einschlag (Haubitze, Minenwerfer, ggf. Feuerschlag/Sperrfeuer nach deinem Urteil) auf ein Eisfeld → 2 Runden Wasser (unpassierbar), Einheit darauf nimmt Schaden und wird ans nächste freie Ufer geworfen (kein freies Feld: nur Schaden + niedergehalten). Bild `eisloch_schnee`, Ton `eis_bricht`, Splitter. Danach friert es wieder zu (kurzer Übergang). Anzeige erst beim Abspielen des Ereignisses (VIS/syncAll-Regel). KI: kennt die Gefahr (Eis nahe gegnerischer schwerer Artillerie meiden) und nutzt es (Ziel auf Eis bevorzugen, wenn dort Gegner stehen). Sim-Abschalter `NOEISBRUCH`. Info-Text im Geländehinweis/Regeln-Fenster. **`node tools/sim.js 200` auf Krähenfurt** (mit und ohne), Siegquote, Dauer, Zahl der Eisbrüche berichten; `test_regeln.js`, `test_belegung.js`.
2. **Spuren etwas dunkler**, damit man sie auch herausgezoomt erkennt (nah nicht aufdringlich). Vorher/nachher in der Übersicht.
3. **Atemwolken:** so lassen.

# >>> ✓ JETZT (Enrico 2026-11-22 19:45): Entscheidungen zum Bericht „Krähenfurt-Bausteine“ <<<
**Reihenfolge:** nach 18:35, vor 19:40 (oder dazwischen, wie es passt).
1. **Uferkante als flacher Aufkleber:** neuer Bogen `ui-quelle/gelaende/ufer_schnee_flach_bogen.png` (2512×1664, Flux, 3 waagerechte Streifen übereinander, Draufsicht: oben Schneeufer mit Steinen/Schilf, Mitte Uferlinie, unten Eis). Achtung: Die Streifen laufen links und rechts nach Magenta aus und gehen oben/unten bis an den Rand. → Mittelteil ausschneiden, links/rechts **nahtlos** machen, oben und unten mit weicher Maske auslaufen lassen. Flach auf den Boden legen (nicht aufrecht), entlang aller Kanten Schnee ↔ Eis (Fluss und Teich), in Laufrichtung der Kante gedreht, Streifen 1–3 gemischt (3 = steinig seltener). Ecken/Bögen: einfach überlappen lassen, Hauptsache keine harten Kanten. `ufer_schnee` (aufrecht) bleibt aus.
2. **Häuser etwa 15 % größer** (heil und Ruinen gleich). Prüfen, dass sie keine Trupps auf Nachbarfeldern verdecken (Regel aus CLAUDE.md); notfalls durchsichtig wie die Bäume, wenn ein Trupp dahinter steht.
3. **Feldkanone:** Enrico hat den Ton (Wagenknarren, Tiefpass 1,2 kHz) angehört – **passt so**, nichts mehr ändern.
4. Bericht mit Screenshot Ufer (Teich und Fluss) und Dorfplatz vorher/nachher.

# >>> ✓ JETZT (Enrico 2026-11-22 19:40): Krähenfurt – Spuren im Schnee, Eisloch, Schneefall, Blut <<<
**Reihenfolge:** nach 18:35 (Wintereffekte). Zwei Flux-Bögen in `ui-quelle/gelaende/` (je 2512×1664, 3×2, Magenta), Flux ist nicht überall gelungen – **nur diese Felder nehmen:**

| Bogen | Feld | Inhalt | für |
|---|---|---|---|
| `spuren_schnee_bogen_a.png` | oben rechts | Radspuren mit Hufabdrücken dazwischen | Geschütz/Wagen |
| `spuren_schnee_bogen_a.png` | unten Mitte | große dreizehige Schreiter-Fußabdrücke mit Rissen | Schreiter |
| `spuren_schnee_bogen_a.png` | unten rechts | Eisloch: dunkles Wasser, Eisschollen, Risse | Eis bricht (siehe 2.) |
| `spuren_schnee_bogen_b.png` | oben Mitte | zwei gerade Kettenspuren (senkrecht) | Fahrzeuge geradeaus |
| `spuren_schnee_bogen_b.png` | oben rechts | gebogene Kettenspuren | Fahrzeug dreht |
| `spuren_schnee_bogen_b.png` | unten links | Hufspuren zweier Pferde | Reiter |
| `spuren_schnee_bogen_b.png` | unten Mitte | zertrampelter Schnee nach Nahkampf (der kleine rote Fleck ist Blut – entfernen oder nur bei Blut an) | Nahkampf-Feld |
| `spuren_schnee_bogen_b.png` | unten rechts | Radspuren mit Hufeisen dazwischen (Alternative zu a oben rechts) | Geschütz/Wagen |

Nicht nehmen: a oben links (Fußabdrücke zu groß, wie Sandalen), a oben Mitte (wirkt wie Schienen), a unten links (Hufe wie Pfeile), b oben links (Erdflecken). Bogen b besteht aus ganzen Kacheln ohne Magenta-Rand um die Spur → Spur weich auslaufend ausschneiden (Maske), damit sie auf dem reinen Schnee liegt.

**Einbauen (nur Winterkarten):**
1. **Spuren** als Bodenspuren (`gmark`) in Laufrichtung gedreht: Fahrzeuge Ketten (beim Drehen die gebogene), Geschütze/Wagen Räder, Reiter Hufe, Schreiter Fußabdrücke. Bleiben einige Runden und verblassen. Fußtruppen: kleine Stapfen im Code zeichnen (kein Bild), nur dezent. Nicht zu viele gleichzeitig (Obergrenze, Leistung!).
2. **Eisloch:** Frage an dich: Kann Eis im Spiel einbrechen (Regel)? Wenn ja: Eisloch-Bild + Ton `eis_bricht` + Eissplitter dort einsetzen. Wenn nein: nur Bild bereitlegen und im Bericht als Frage an Enrico („Soll Eis einbrechen können?“), keine Regel ohne Entscheidung.
3. **Schneefall:** leichter Schneefall über der ganzen Karte im Code (wenige, langsame Flocken, abschaltbar mit Bildwirkung aus, keine Leistungseinbrüche), dazu ganz selten eine Böe passend zu `winterwind_stark`.
4. **Atemwolken:** kleines Wölkchen am Kopf bei Stimmen/Rufen von Fußtruppen (nicht bei Kampfanzügen/Schreitern/Panzern), im Code.
5. **Blut auf Schnee:** auf Winterkarten dunkler und kleiner (wirkt auf Weiß sonst grell), weiter abschaltbar (Blut-Schalter).
6. Bericht mit Screenshots (Spuren nach 2 Runden, Schneefall, Atem), Leistungsmessung mit Schneefall an/aus.

# >>> ✓ JETZT (Enrico 2026-11-22 19:15): Krähenfurt – reine Schneeflächen <<<
**Reihenfolge:** zusammen mit 18:00 (Bausteine Krähenfurt).
- Neuer Bogen `ui-quelle/gelaende/boden_schnee_rein_bogen.png` (2048², Flux, 2×2, Kacheln durch dünne Magenta-Linien getrennt, Rand ca. 4 px): fast reiner Schnee mit feiner Struktur. Oben links frischer Schnee, oben rechts mit kleinen Kieseln, unten links mit Steinchen und Grasspitzen, unten rechts mit 2–3 halb eingeschneiten Felsen.
- Magenta-Linien abschneiden, Kacheln **nahtlos** machen (wie `tools/ui_textures.py`/die Bodenkacheln), als Grundboden für die **offenen Schneefelder** von Krähenfurt nehmen (statt der fleckigen Schneekachel aus `boden_schnee_bogen.png`; die bleibt für zertrampelte Stellen/Wegränder).
- Die vier Fassungen zufällig je Feld mischen (Felsen-Fassung seltener, etwa 1 von 8), damit keine Wiederholung auffällt. Flächen gekachelt, nie gestreckt (STYLE.md).
- Helligkeit prüfen: Schnee darf Figuren und Markierungen nicht überstrahlen (bei Bildwirkung leicht und stark), notfalls etwas abdunkeln/bläulicher. Vorher/nachher-Screenshot in den Bericht.

# >>> ✓ HINWEIS (Enrico 2026-11-22 19:10): Ton-Pult 2 macht ein zweiter Claude Code <<<
Das Ton-Pult (vorher hier Abschnitt 19:05) übernimmt ein **zweiter Claude Code** in einem eigenen Arbeitsordner `C:\Projekte\Armargeddon-ton` (git worktree, Zweig `tonpult2`). Auftrag: `entwurf/postfach/AUFTRAG_TON.md`. **Du (Haupt-Claude-Code) fasst `tools/tonpult_seite.js`, `tools/tonpult_seite.css`, `tools/tonpult_bau.mjs` und `tonpult.html` ab jetzt nicht mehr an**, außer im Abschnitt 18:45 (Ton der Feldkanone) – den bitte **zuerst** erledigen und pushen. `AUFTRAG_TON.md` darfst du mit committen, aber nicht ändern. Zusammenführen kommt später als eigener Auftrag.

# >>> ✓ JETZT (Enrico 2026-11-22 18:55): Idee notieren <<<
In `IDEEN.md` eintragen (kurz, mit Datum), nichts bauen: **„Gelände-Teile mit Flux angleichen (2026-11-22): Nach Krähenfurt die drei Karten vergleichen. Wenn Flux-Teile (Krähenfurt) und Gemini-Teile (Grauwall, Sankt Ruß) nicht zusammenpassen, nur die herausfallenden Teile mit Flux nachmalen, keine ganze Karte neu. Flux: genauer bei Anzahl, Raster, Blickwinkel und Maßstab, PNG 2k; Gemini: detailreicher und düsterer, bessere Bodentexturen. Enrico (19:23): Die Gräben von Grauwall sehen „krakelig“ aus und gefallen ihm nicht – bei der Überarbeitung zuerst die Grabenteile (Kanten vorn/hinten, Sohle) neu machen. Hat Zeit.“**

# >>> ✓ JETZT (Enrico 2026-11-22 18:50): Neues Titelbild einbauen <<<
**Reihenfolge:** nach 18:45, vor 18:00/18:35 (klein).
- `ui-quelle/titelbild_neu.png` ist ersetzt durch ein neues Flux-Bild (2736×1536, gleiche Szene, Figuren wie im Spiel: Kolosse mit Löwenkopf, Konkordat-Soldaten, Aschenwacht mit Pickelhaube). Das alte liegt als Sicherung in `ui-quelle/titelbild_alt_2026-11-22.png`.
- Bitte `tools/title_bg.py` laufen lassen (TITLEBG neu), danach build. Prüfen: Startmenü bei 1280, 1920 und 2560 px – Titel und Knöpfe gut lesbar, wichtige Bildteile (Panzer links, Mauer rechts) nicht abgeschnitten. Da das Bild schon groß ist, nur noch so weit hochskalieren wie nötig. Auf Dateigröße von `titlebg.js` achten.
- Screenshot des Startmenüs in den Bericht.

# >>> ✓ JETZT (Enrico 2026-11-22 18:45): Entscheidungen zum Bericht „Fehler 17:32 und 17:40“ <<<
**Reihenfolge:** zuerst dieser kleine Abschnitt, dann 18:00 und 18:35.
1. **Fesselballon, Fertig-Haken:** Punkt geschlossen, wir beobachten es. Nichts ändern.
2. **Rollen-Aufstellung:** in `IDEEN.md` parken (kurz: was gebaut ist, `AUFSTELLUNG_NEU=1`, Messtabelle, Idee „eigenes Paket zusammen mit der KI-Startphase“). Alte Aufstellung bleibt Standard, Schalter bleibt drin.
3. **Feldkanone, Bewegungston:** Standard wird `wagenknarren` (Pult-Eintrag „Ziehen (ohne Protzen)“). Achtung: In Paket B wurde ein Dauerton um 700 Hz beim Aufprotzen entfernt, weil er wie eine Zugpfeife klang – prüfen, dass `wagenknarren` das nicht hat; sonst Tiefpass/Ausschnitt anpassen und im Bericht sagen. Im Winter darf `pferde_schnee` darunterliegen.

# >>> ✓ JETZT (Enrico 2026-11-22 18:35): Krähenfurt – Furt, Krater und Wintereffekte einbauen <<<
**Reihenfolge:** nach 17:32, 17:40, 17:30 und 18:00 (darunter). Gemacht mit fal.ai Flux 3 Image Edit, PNG, Hintergrund **kein reines #FF00FF** (etwa RGB 236–252, 20–37, 221–243) – beim Freistellen beachten.

| Bogen | Inhalt (Raster) | für |
|---|---|---|
| `ui-quelle/gelaende/furt_krater_schnee_bogen.png` | Furt-Kachel mit gemalten Ufern (Eis/Wasser, Steine), 2 Granattrichter im Schnee, 1 Brandfleck; Aufkleber auf Magenta mit **weichen rosa Säumen** (ENTROSA wie bei Sankt Ruß) | Furt-Feld auf Krähenfurt; Trichter/Brandfleck als Bodenspuren |
| `ui-quelle/effekte/fx_winter_schnee.png` (2512×1664, 3×2) | oben: 1 großer Einschlag im Schnee (Fontäne mit Erdbrocken), 2 derselbe kurz danach (fällt zusammen), 3 kleiner Einschlag; unten: 4 und 5 zwei Pulverschnee-Wolken (flach), 6 Eissplitter | Effektbogen über `tools/fx_cut.py` (neuer Eintrag in `CFG`) → FXNEU |

**Einbauen (nur auf Winterkarten, Schalter je Karte, z. B. `MAP.winter`):**
1. **Einschlag:** in `fxImpact` statt der Erdfontäne die Schneefontäne – groß (1) → (2) als Folgebild, kleine Geschosse (3). Feuerkern und Rauch bleiben wie bisher.
2. **Bodenspuren:** `gmark` nimmt auf Winterkarten die Schneetrichter und den Brandfleck statt der Erdflecken.
3. **Pulverschnee (4, 5):** hinter Ketten/Rädern beim Fahren, bei Schreiter-Schritten und beim Sprungangriff/Landung; klein und kurz, nicht bei jedem Schritt der Infanterie.
4. **Eissplitter (6):** bei Treffern und Einschlägen auf Eisfeldern (zugefrorener Bach/Teich), dazu der Ton „Eis knackt/bricht“ aus dem Abschnitt 17:05.
5. **Schnee auf Bausteinen im Code:** Grabenränder, Sandsäcke und Draht bekommen auf Winterkarten eine weiße Schneekante oben (im Code aufgehellt/übermalt, kein neuer Bogen). Bitte vorher/nachher-Bilder.
6. Fehlt ein Bild, greifen die bisherigen Effekte (wie immer).

Bericht mit Screenshots (Einschlag im Schnee, Fahrspur, Eistreffer, Trichter nach 2 Runden) in BERICHT.md, Fragen an Enrico dort.

# >>> ✓ JETZT (Enrico 2026-11-22 18:00): Krähenfurt – neue Bausteine (Flux) einbauen <<<
**Reihenfolge:** erst die dringenden Abschnitte 17:32 (Bildhänger) und 17:40 (Sanitäter/Feldkanone/Ballon), dann 17:30, dann dieser.
Alle Bögen in **`ui-quelle/gelaende/`**, gemacht mit fal.ai Flux 3 Image Edit (Vorlagen: Bauplan `entwurf/karte_winterdorf/konzept_flux.png` + `ui-quelle/figuren/konkordat_soldat.png` für Blickwinkel/Maßstab). Schon PNG. **Hintergrund ist kein reines #FF00FF** (etwa RGB 236–241, 20–22, 221–223) – beim Freistellen beachten. Ersetzt die Platzhalter aus Schritt 1 (Bausteinliste im Bericht „Winterdorf, Schritt 1“).

| Bogen | Inhalt (Raster) | für |
|---|---|---|
| `haus_heil_bogen.png` (2048², 2×2) | 4 Fachwerkhäuser heil, verschneit: Kate mit Kamin, zweistöckig mit Gaube, langes Bauernhaus mit Scheunentor, Haus mit Holzschuppen | `haus_heil_1–4`. **Haus 2 (oben rechts) ist andersherum gedreht** (Giebel rechts) – spiegeln, damit alle gleich stehen |
| `kapelle_ruinen_bogen.png` (2048², 2×2) | oben links Kapelle heil (mit Türmchen; der kleine Zaun am Fuß darf weg), oben rechts Kapelle zerschossen (Türmchen steht noch), unten 2 Hausruinen verschneit | `kapelle`, `kapelle_ruine`, `haus_ruine_schnee_1–2` |
| `baeume_schnee_bogen.png` (2512×1664, 3×2) | 4 verschneite Tannen, 1 toter Baum, 1 abgebrochener Stamm | `tanne_schnee_1–4`, `baum_tot_schnee_1–2` (Durchsichtigkeit wie bei den anderen Bäumen) |
| `dorf_objekte_schnee_bogen.png` (2512×1664, 3×2) | Steinbrücke (Bogen), Brunnen verschneit, Holzstapel ordentlich, Holzhaufen locker, Karren, Schilf mit Steinen | `bruecke_stein` (bitte selbst in vorn/hinten teilen, Schneesockel weg), `brunnen_schnee`, `holzstapel_1–2`, `karren_schnee`, `schilf` |
| `boden_schnee_bogen.png` (2048², 2×2, Draufsicht) | Schneeboden mit Grasbüscheln/Matsch, Acker im Schnee (Furchen schräg), Matschstraße mit Radspuren, Flusseis mit Rissen | `boden_schnee`, `boden_acker_schnee`, `strasse_matsch`, `boden_eis`. **Noch nicht nahtlos** – bitte wie `ui_textures.py` nahtlos machen; Furchen/Radspuren in die Richtung drehen, die das Raster braucht |
| `streifen_schnee_bogen.png` (2896×1440, 3 Streifen) | Zaun verschneit, Uferkante (mit Eis darunter), Unterholz verschneit | `zaun_schnee`, `ufer_schnee`, `unterholz_schnee`. Gemini/Flux hat jeweils ein Stück Schneeboden unter den Streifen gemalt (beim Ufer das Eis) – **nur den aufrechten Teil nehmen**, nahtlos machen |
- Danach `figur_plastik.py` für die neuen Gelände-Teile (wie Sankt Ruß), Bilder vorher/nachher und eine Gesamtansicht Krähenfurt in den Bericht.
- Wenn ein Teil nicht taugt (Maßstab, Blickwinkel, Nahtschnitt): im Bericht kurz nennen, der Berater macht es neu.
- CREDITS „Bilder“: fal.ai Flux 3 Image Edit (Enrico).

# >>> ✓ JETZT – DRINGEND (Enrico 2026-11-22 17:40): Spielfehler und Feldkanone <<<
Gleich nach dem Bildhänger-Fehler (17:32) erledigen, vor den übrigen Abschnitten.
1. **Sanitäter heilt aus Versehen:** Wählt man einen Sanitäter und klickt auf eine **eigene Einheit neben ihm**, wird sie manchmal geheilt. **Heilen nur noch über die Fähigkeit** (Knopf → Ziel wählen). Klick auf eine eigene Einheit wählt immer nur diese Einheit aus. Bitte auch die anderen Einheiten mit Hilfsfähigkeiten (Versorgungstrupp: reparieren/Munition, Gasschutz, Melder) prüfen, ob ein normaler Klick dort ungewollt etwas auslöst – überall nur über die Fähigkeit.
2. **Feldkanone (Konkordat) schießt flach:** Sie hat „Direktes Feuer“ (kein Steilfeuer, kein Sperrfeuer – so lassen). Die **Animation** zeigt aber noch eine steile Bogenflugbahn. Bitte **flache, gerade Flugbahn** (wie ein Panzer-/Kanonenschuss: schnelles Geschoss fast gerade, kurzer Leuchtschweif, Einschlag direkt), Mündungsfeuer waagerecht.
3. **Feldkanone ohne Auf-/Abprotzen:** Nur die **Feldkanone** (Donnerrohr, Grabengeschütz und Aschenwacht-Geschütze bleiben wie sie sind). Kein Protzen mehr; sie kann **immer 2 Felder ziehen** und danach noch schießen (direktes Feuer). Knöpfe/Symbole fürs Protzen bei ihr weg, KI anpassen. **Eigener Bewegungston** (z. B. Räderrumpeln mit Pferden/Gespann, ohne das Protz-Klirren): bitte 2–3 Kandidaten aus vorhandenen Tönen im Pult anbieten und einen als Standard setzen, im Bericht nennen. Preis/Balance nachmessen (4 × 200 je Karte).
4. **Fesselballon: Fertig-Haken fehlt.** Beim Ballon fehlt der Knopf, mit dem man die Einheit für diese Runde **fertig meldet** (Zug beenden/Haken), den die anderen Einheiten haben. Bitte ergänzen (auch wenn er oben oder eingeholt ist).
- Partietest und test_regeln laufen lassen; kurze Bestätigung im Bericht.

# >>> ✓ JETZT – ZUERST (Enrico 2026-11-22 17:32): Fehler – Bild hängt bei Artillerie-Einschlag, danach Bodentexturen kaputt <<<
**Vor allen anderen offenen Abschnitten erledigen.** Enrico beim Spielen:
- Wenn **Artillerie (beide Seiten) auf eine Einheit schießt, z. B. auf einen Panzer**, und es **auf einem bestimmten Untergrund** eine Explosion gibt, **stockt das Bild** – manchmal richtig lange („aufgehangen“), dann geht es irgendwann weiter.
- Einmal war das Bild **ganz weg** und danach wurden die **Bodentexturen nicht mehr richtig geladen**.
- Welche Karte genau, weiß Enrico nicht sicher. Verdacht des Beraters (bitte prüfen, nicht darauf festlegen):
  - Einschlag ändert das Gelände (Trichter, Draht weg, Barrikade, `bauschaden`/`einsturz` bei Kirche oder den neuen Häusern auf Krähenfurt) → **voller Neuaufbau in `gbBereit`** (0,4–0,6 s, siehe Paket A „Draht verschwindet ohne Neuaufbau“), bei mehreren Einschlägen hintereinander mehrfach.
  - Oder Speicher/Canvas läuft voll (Bildwirkung „stark“, `bwBild`, Plastik-Karten, große Karte 18×12) → Grafikkontext geht verloren („Bild weg“), danach fehlen Bodenteile.
- **Bitte:** nachstellen (Sperrfeuer/Einzelschuss Artillerie auf Fahrzeuge auf allen Untergründen, alle drei Karten, Bildwirkung leicht und stark, auch mehrere Einschläge kurz hintereinander), Bildzeiten messen (`test_ki_partie.mjs` o. ä.), Ursache finden und beheben:
  - Kein Neuaufbau der ganzen Welt bei einem Einschlag; nur das betroffene Feld ändern bzw. Neuaufbau zusammenfassen und außerhalb des Bildes vorbereiten.
  - Falls der Canvas verloren geht (`contextlost`): sauber neu aufbauen, damit alle Bodentexturen wieder da sind.
- Im Bericht: Ursache, Messung vorher/nachher (längste Bildzeit), wie es behoben ist.

# >>> ✓ JETZT (Enrico 2026-11-22 17:30): Entscheidungen zum Bericht „Winterdorf Schritt 1“ und „Wintertöne“ <<<
1. **Kartenname: „Krähenfurt“** (statt „Winterdorf“). Name in `MAPS`, Startmenü, Texten; Dateien/Plan dürfen intern `winterdorf` heißen bleiben.
2. **Kapelle bekommt ein Türmchen: nur +1 Sicht** (keine Reichweite). Danach Balance kurz nachmessen (4 × 200), Ziel weiter 48–55 %.
3. **Automatische Aufstellung robuster machen – jetzt** (Vorschlag aus F94): Rollen vorn/hinten fest (Fußtruppen und Nahkämpfer vorn, Geschütze/MG/Beobachter/Sanitäter hinten, Fahrzeuge an Straßen/offen), Plätze nicht nur der Reihe nach vergeben. Ziel: feste und gemischte Aufstellung liegen nah beieinander. **Danach Balance aller drei Karten neu messen** (fest und `MISCHEN=1`, je 4 × 200) und mit kleinen Werten nachgleichen, Ziel je 48–55 %. Im Bericht Tabelle vorher/nachher.
4. **Töne auslagern – jetzt:** Töne nicht mehr in `index.html` einbetten, sondern als eigene Datei(en) daneben laden (wie `tonprobe.html`/`tonpult.html` es schon tun). Muss auf GitHub Pages und lokal (Vorschau-Server) funktionieren; Ladeanzeige bzw. Spiel startet erst, wenn die Töne da sind, oder Töne kommen nach (kein Fehler, wenn eine Datei fehlt). Prüfen, dass Pult/Tonprobe weiter gehen. Größe `index.html` vorher/nachher in den Bericht.
- Partietest für Krähenfurt anpassen (Testfeld kein Haus, größere Karte beim Start nicht ganz im Bild = erlaubt).
- Die Bausteine (Liste aus dem Bericht) macht der Berater gerade mit Flux; die kommen in einem eigenen Abschnitt.

# >>> ✓ JETZT (Enrico 2026-11-22 17:05): Wintertöne für die Karte „Winterdorf“ <<<
Alles in **`sound-quelle/_neu/winter/`** (Enrico bzw. ElevenLabs Sound Effects, keine Doppelten). Gilt **nur auf Winterkarten** (vorerst „Winterdorf“; bitte als Karteneigenschaft `MAP.winter` o. ä. lösen, damit spätere Winterkarten es mitbekommen).
| Dateien | Verwendung |
|---|---|
| `schnee_schritte_einzeln.mp3` | Schritte kleiner Trupps/Einzelfiguren (Anführer, Melder, Scharfschütze) im Schnee, ersetzt `schritte` |
| `schnee_schritte_gruppe.mp3` | Schritte der Fußtrupps im Schnee, ersetzt `schritte` (Marschtritt bei Marsch/Sturmlauf bleibt, aber leise Schnee darunter) |
| `schnee_rennen_gruppe.mp3` | Sturmlauf/Marsch/Rückzug im Schnee |
| `stampfen_schnee_1-4.mp3` | **Unterlage** unter die vorhandenen Schreiter- und Kampfanzug-Schritte (leiser darunter mischen, gleicher Takt), nicht ersetzen |
| `panzerketten_schnee_1-4.mp3` | Panzer, Kolosse, Sturmpanzer beim Ziehen im Schnee: als Unterlage unter das bisherige Kettenrollen bzw. dafür, wie es besser klingt |
| `pferde_geschuetz_schnee_1-4.mp3` | **Aufgeprotzte Geschütze** beim Ziehen im Schnee (Pferde mit Protze); gern auch leise unter Reiter im Schnee |
| `eis_knackt_bricht_1-4.mp3` | Fußtruppen auf **Eis** (Fluss/Teich): beim Betreten bzw. Ziehen über Eis den **Anfang** (Knacken, erste ~1,5 s, ausblenden); den ganzen Ton mit Einbrechen nur, falls es je eine Einbruch-Regel gibt (vorerst nicht, nur im Pult) |
| `winterwind_mittel.mp3`, `winterwind_stark.mp3` | **Kulisse** der Winterkarte statt `wind` (`ORT_KULISSE`): mittel als Grundschleife, stark selten als Böe überblendet; unter Stimmen absenken, Pegel wie Kulisse 0,13 |
- Lange Dateien (Wind ~10 MB) zuschneiden/als Schleife bauen und mit `kbps` niedrig halten: **`index.html` ist schon 63 MB** (GitHub warnt ab 50, Grenze 100). Wo möglich nur ins Pult (`sound_pult.js`) oder kürzer schneiden. Größe vorher/nachher in den Bericht.
- Alles im Pult wählbar (neue Gruppe „Winter“). CREDITS: ElevenLabs Sound Effects (Enrico) bzw. Enricos eigene Aufnahmen. sound-quelle sichern.
- Kann zusammen mit Schritt 1 der Winterkarte gebaut werden.

# >>> ✓ JETZT (Enrico 2026-11-22 16:22): Neue Karte „Winterdorf“ (Arbeitstitel) – Schritt 1: Plan, Raster, Regeln <<<
Plan: **`entwurf/KARTE_WINTERDORF.md`** (bitte ganz lesen). Bauplan-Bild: `entwurf/karte_winterdorf/konzept_flux.png` (Vorbild: `vorbild.png` daneben).
Entschieden: **18 × 12 Felder**, Winterdorf am Fluss, **Dorf noch fast heil**, **Eis trägt Fußvolk, keine Fahrzeuge**, **Bäume werden durchsichtig**, wenn Einheiten darin stehen, **leichter Nebel an den Rändern** (Enrico mag genau diesen Hauch im Konzept).

**Schritt 1 (jetzt):**
1. Raster 18 × 12 nach dem Bauplan anlegen (Fluss, Brücke, Furt-Vorschlag, Teich, Straßenkreuz mit Brunnen, Häusergruppen, Kapelle, Felder, Waldränder), Seiten/Fahnen/Aufstellung wie im Plan vorgeschlagen. Neue Feldarten/Regeln: **Eis**, **heile Häuser mit Bauzustand** (Technik der Kirche von Sankt Ruß wiederverwenden), Kapelle.
2. **Bäume durchsichtig** (gilt für alle Karten) und **Nebel am Rand** (nur Bild, Bildwirkung „aus“ = kein Nebel).
3. Wo Bausteine fehlen: vorerst vorhandene Teile als Platzhalter (z. B. Ruinen, Bäume von Grauwall), damit die Karte spielbar ist.
4. **Balance:** je 4 × 200 Schlachten, Ziel Konkordat 48–55 %. Werte in den Bericht.
5. **Bausteinliste in den Bericht:** was wiederverwendet wird und was **neu** gebraucht wird, je Teil: Art (Wandstück/Aufsteller/Boden), Größe in SH, Ansicht, Anzahl Varianten, Dateiname. Der Berater macht danach die Bilder (Flux/Gemini) und legt sie nach `ui-quelle/gelaende/`.
6. Kartenname: vorerst „Winterdorf“; Enrico gibt noch den richtigen Namen. Bilder vom Raster/Spielstand in den Bericht.
- Sankt Ruß und Grauwall dürfen sich dadurch nicht verändern (außer der Baum-Durchsichtigkeit).

# >>> ✓ JETZT (Enrico 2026-11-22 16:08): Heldenstimme „Der Eiserne Kürassier“ (Aschenwacht, Deutsch) <<<
In `sound-quelle/_neu/` (ElevenLabs, Stimme **Ragnar** mit kalter, langsamer Sprechweise; eine eigene Stimme ging ohne Abo nicht). **Je Anlass zwei Fassungen** `_a` und `_b` (keine Doppelten), beim Abspielen **zufällig abwechseln**:
| Dateien | Anlass | Text |
|---|---|---|
| `held_kuerassier_01_auswahl_a/b.mp3` | Anwählen | „Der Kürassier. Zeigt mir, wen ich richten soll.“ |
| `held_kuerassier_02_bewegen_a/b.mp3` | Ziehen | „Vorwärts. Stahl kennt keinen Rückzug.“ |
| `held_kuerassier_03_angriff_a/b.mp3` | Angriff (Nahkampf) | „Für die Asche! Nieder mit ihnen!“ |
| `held_kuerassier_04_hinrichtung_a/b.mp3` | Spezialangriff **Hinrichtung** | „Knie nieder. Dein Urteil ist gefallen.“ |
| `held_kuerassier_05_getroffen_a/b.mp3` | getroffen | „Ein Kratzer. Mehr nicht.“ |
| `held_kuerassier_06_gegner_erledigt_a/b.mp3` | Gegner vernichtet | „Gerichtet. Der Nächste.“ |
| `held_kuerassier_07_schwer_verwundet_a/b.mp3` | schwer verwundet (unter ~35 % Stärke, einmal je Schlacht) | „Die Rüstung bricht... doch ich stehe noch.“ |
| `held_kuerassier_08_tod_a/b.mp3` | Tod (vor/mit `heldfall`) | „Die Asche... ruft mich... heim...“ |
- **Wichtig: Helm-/Blechfilter.** Ragnar ist auch die Stimme der Aschenwacht-Soldaten. Damit der Kürassier anders klingt: blecherner, hohler Klang wie aus einem geschlossenen Stahlhelm (Bandpass etwa 300–3000 Hz, kurzer metallischer Kammfilter/Resonanz um 1–2 kHz, ein Hauch kurzer Nachhall), dazu **etwas tiefer** (rate ~0,92). Nicht so stark wie der Schreiter-Roboterfilter, man soll jedes Wort verstehen. Im Pult Filterstärke wählbar.
- Gleiche Regeln wie bei der Roten Faust (Abschnitt 15:58): Weg „Stimmen“, höchstens ein Ruf gleichzeitig, Abklingzeiten, Auswahl etwa jede zweite, Hinrichtungs-Ruf vor dem Säge-Schnitt, Getroffen höchstens alle 8 s. Bestehende Kürassier-Töne (Säge, Ritterschrei, Schritte, Rüstung) bleiben.
- Im Ton-Pult unter „Stimmen“ eine Gruppe **„Held Eiserner Kürassier“** mit 8 Zeilen (je beide Fassungen wählbar). CREDITS: ElevenLabs (Enrico). sound-quelle sichern.

# >>> ✓ JETZT (Enrico 2026-11-22 15:58): Heldenstimme „Die Rote Faust“ (Konkordat, Englisch) <<<
In `sound-quelle/_neu/` (ElevenLabs, eigene Voice-Design-Stimme „Rote Faust“: kerniger Veteran mit Dampfhammerfäusten; vom Berater nach dem ElevenLabs-Verlauf benannt, keine Doppelten):
| Datei | Anlass | Text |
|---|---|---|
| `held_rotefaust_01_auswahl.mp3` | Anwählen | „Red Fist here. Point me at something.“ |
| `held_rotefaust_02_bewegen.mp3` | Ziehen | „Moving up. Keep the steam up, lads.“ |
| `held_rotefaust_03_angriff.mp3` | Angriff (Nahkampf) | „Right. Let's crack some skulls.“ |
| `held_rotefaust_04_durchbruch.mp3` | Spezialangriff **Durchbruch** | „Out of my way! Breakthrough!“ |
| `held_rotefaust_05_getroffen.mp3` | getroffen | „Ha! That all you've got?“ |
| `held_rotefaust_06_gegner_erledigt.mp3` | Gegner vernichtet | „Down you go. Next!“ |
| `held_rotefaust_07_schwer_verwundet.mp3` | schwer verwundet (unter ~35 % Stärke, einmal je Schlacht) | „Pressure's dropping... but I'm still swinging.“ |
| `held_rotefaust_08_tod.mp3` | Tod (vor/mit `heldfall`) | „Tell them... the Fist... held the line...“ |
- Nur für die Rote Faust (`faust`). **Ohne Gasmasken-/Funkfilter** (wie Hauptmann/General), höchstens ein leichter Raumklang. Weg „Stimmen“ (Regler Stimmen).
- Gleiche Regeln wie die anderen Rufe: höchstens ein Ruf gleichzeitig, Abklingzeit je Anlass, Auswahl nicht jedes Mal (etwa jede zweite). Der Durchbruch-Ruf kommt beim Anlauf, **vor** dem Faustschlag-Ton, und darf die Heldentitel-Einblendung nicht stören. Getroffen höchstens alle 8 s.
- Bestehende Helden-Töne (held_aufladen, held_faustboom, Dampf …) bleiben, die Stimme kommt dazu.
- Im Ton-Pult unter „Stimmen“ eine Gruppe **„Held Rote Faust“** mit den 8 Zeilen anlegen. CREDITS: ElevenLabs (Enrico). sound-quelle sichern.
- Der **Eiserne Kürassier** (Aschenwacht, Deutsch) folgt, der Berater legt ihn nach.

# >>> ✓ JETZT (Enrico 2026-11-22 15:53): Gemalte Mauszeiger je Lage <<<
Enrico wünscht sich einen eigenen, gemalten Mauszeiger im Spielstil, der zeigt, was ein Klick an dieser Stelle tun würde. **Neu: `ui-quelle/bogen_zeiger.png`** (Gemini, Stil wie bogen8b, 4 Spalten × 2 Reihen, Magenta; Herkunft JPG, vom Berater in PNG umgewandelt, auf rosa Säume achten).

Zuordnung (Reihe für Reihe, von links) zu den Lagen, die es schon gibt (`CURSOR`/`cursorFor`, `abilCursor`):
| Nr. | Bild | Lage | Klickpunkt |
|---|---|---|---|
| 1 | Pfeil aus Eisen/Messing | **normal** (überall sonst, auch in Menüs über dem Spielfeld) | Spitze oben links |
| 2 | Panzerhandschuh, Zeigefinger | **über eigener Einheit**, die man anwählen kann | Fingerspitze |
| 3 | genagelter Stiefel | **Ziehen**: über einem erreichbaren Feld bei gewählter Einheit | Stiefelspitze (unten links) |
| 4 | runder Fadenkreuz-Ring | **Schießen**: über einem Gegner in Reichweite | Mitte |
| 5 | Säbel | **Nahkampf**: über einem Gegner, den man angreifen kann (ersetzt das bisherige Schwert) | Klingenspitze oben links |
| 6 | roter Sperrkreis | **geht nicht** (ersetzt das bisherige Verbot). Der Balken läuft von oben rechts nach unten links, bitte waagerecht **spiegeln**, damit er wie gewohnt von oben links nach unten rechts läuft | Mitte |
| 7 | Messing-Zielring, Vieleck | **Feld wählen** für Fähigkeiten/Feuer auf ein Feld (`feld`). Achtung: Gemini hat eher ein Siebeneck gemalt. Wenn es auf dem Hexfeld schief wirkt: auf ein sauberes Sechseck in der Ausrichtung unserer Felder zuschneiden/maskieren, oder notfalls den runden Ring Nr. 4 mit anderer Färbung nehmen. Im Bericht sagen, was genommen wurde. | Mitte |
| 8 | Drahtschere mit Stacheldraht | **Draht schneiden** | Scherenspitze oben links |
- **Leuchtpistole** (`leucht`, Ziel markieren) bleibt wie jetzt (kein neues Bild).
- Rechts neben der Drahtschere schwebt ein **kleines Fremdteil** (Bildfehler, sieht aus wie ein Gewehr mit lila Schein): beim Freistellen weglassen.
- Größe: so, dass die Zeiger auf PC gut lesbar sind (etwa 32–48 px; Chrome nimmt bis 128 px, Windows zeigt große Zeiger aber teils nicht an – bitte prüfen und die sichere Größe nehmen). Klickpunkt (Hotspot) je Zeiger wie in der Tabelle setzen und im Spiel prüfen, dass Klicks genau dort landen.
- Nur Maus; auf Touch ändert sich nichts. Fehlt ein Bild, greift der bisherige gezeichnete Zeiger.
- Sanfter Wechsel ist nicht nötig, aber kein Flackern beim Überfahren von Feldgrenzen.
- Bilder: Bildschirmfoto mit allen 8 Zeigern in Spielgröße (über Feld, Gegner, eigener Einheit) in den Bericht.

# >>> ✓ JETZT (Enrico 2026-11-22 15:26): Antworten auf die Fragen zu den neuen Standard-Tönen <<<
Zum Bericht „Neue Töne als Standard“ (`841f93f`), Fragen 1–7:
1. **Granatwerfer** (`granatwerfer_schuss`): **nur im Pult lassen**, kein Standard.
2. **Schweres MG** (`neu4_mg_schwer`, ElevenLabs `schweres_mg_feuer_1/2`): Standard für die **MGs der Schreiter**: Ordensschreiter (MG am Arm), Turm-MG des Turmschreiters, MG des Klauenschreiters (falls er eins hat). **Nicht** bei den Eisernen Hünen (dort gilt Enricos Pult-Wahl `neu_mg_schwer_1`) und nicht bei den MG-Trupps (Mahlwerk, Sensenwerk), die behalten ihren Ton.
3. **Schweres Gewehr** (`neu4_gewehr_schwer`): **nur Panzerbüchse**, so lassen.
4. **Sandsäcke** (`sandsaecke`): **nur beim Eingraben** (neben `atmen`). Draht ziehen, Mine legen und Stollen bekommen wieder ihren alten Ton (`bauen`).
5. **MG-Rückstoß** (Zurückschieben durch Durchbruch/Sturmrollen): **ja, `mg_abbauen`** abspielen.
6. **Feuer-Ruf Aschenwacht** („FEUER!“): bei **Feuerbereitschaft und Feuerschlag anfordern**. Nicht bei Sturmbefehl und Generalangriff, dort bleibt der Kampfschrei.
7. **Panik einzeln/Gruppe:** Grenze **passt so** (ab 3 Figuren bzw. zwei Fluchten in 3 s).
- Ton-Pult danach nachziehen (Standard-Markierungen), test_ton laufen lassen. Im Bericht nur kurz bestätigen.

# >>> ✓ JETZT (Enrico 2026-11-22 15:23, geändert 15:47): Ordensschreiter Treffer-Pose <<<
**Geändert 15:47: Bitte `ui-quelle/figuren/konkordat_ordensschreiter_posen5.png` nehmen** (neu mit Flux 3 Edit gemacht, schon PNG, eine einzelne Figur, 1980×2016). **`posen4.png` (Gemini) NICHT verwenden**, sie war nur die Geh-Pose mit Funken. Falls du posen4 schon eingebaut hast: durch posen5 ersetzen.
- Inhalt: **echte Treffer-Pose**: schaut nach rechts, Oberkörper leicht nach hinten geneigt, vorderer Fuß hebt ab, Funkenregen und Splitter mitten auf der Brust. Waffen auf derselben Seite wie in allen anderen Posen (MG vorn tief vor dem Körper, Kettenschwert hinten). Kein Rauch.
- **Hintergrund ist kein reines #FF00FF**, sondern ein leicht anderes Magenta (etwa RGB 252, 35, 241). Beim Freistellen beachten.
- **Zusätzlich Wanken im Code** (Enrico hat so entschieden): beim Treffer um den Fußpunkt etwa 6–8° nach hinten kippen (vom Angreifer weg, wie bei `letzterAngreifer`/F97), kurzer Rückstoß, dann zurück in die Ruhe, so wie es `poseFigur` mit dx/dy/rot schon kann. Die Pose ist schon leicht geneigt, also nicht übertreiben.
- Die Funken sind gemalt; Getroffen-Pose nie spiegeln (F97). Falls das mit der Blickrichtung nicht zusammenpasst: im Bericht kurz sagen, wie es gelöst ist.
- **Größe an Gehen/Ruhe angleichen** (Fußlinie und Rumpfhöhe; anderes Format als die übrigen Bögen). Ersetzt die bisherige Ersatzlösung (Wackeln/Aufblitzen).
- Danach `figur_plastik.py` laufen lassen. Vorher/Nachher-Bild in den Bericht.
- Hinweis: Das Bild kommt von fal.ai „Flux 3 Image Edit“ (Enrico, eigenes Konto). In CREDITS bei den Bildquellen ergänzen.

# >>> ✓ JETZT (Enrico 2026-11-22 15:12): Bogen C – doppelte Symbole auflösen <<<
**Neu: `ui-quelle/bogenC_symbole.png`** (Gemini, Stil wie bogen8b, 4 Spalten × 2 Reihen, Magenta). Herkunft war ein JPG, vom Berater schon in PNG umgewandelt, also auf rosa Säume achten (wie `ENTROSA`). Freistellen wie die anderen Symbolbögen (ui_cut.py, Nahtschnitt, falls sich Teile nahe kommen).

Oben jeweils Fassung A, unten Fassung B. **Enrico hat gewählt:**
| Spalte | Bedeutung | Nehmen | Nicht nehmen |
|---|---|---|---|
| 1 | **Sprenglanze** (Sprenglanzen-Reiter, `blastLance`) | **unten**: Lanzenspitze mit Sprengstoffbündel | oben (Lanze zu dünn) |
| 2 | **Gebäude rammen** (`rammen`/`rammZiele`) | **oben**: Eisenbug einer Kampfmaschine kracht in Ziegelmauer | unten (Rammbalken) |
| 3 | **Stark gegen Panzer** (Medaille „gegen Gepanzerte“ in `medaillenZeigen` und „Stärken und Schwächen“) | **unten**: Panzerplatte, von Granate durchschlagen | oben (grüne Wolke unter dem Panzer sieht nach Gas aus, Gekritzel auf der Wand) |
| 4 | **Ballon einholen** (`einholen`) | **unten**: Ballon am Seil, Winde, Pfeil nach unten | oben (ohne Pfeil nicht von „Aufsteigen“ zu unterscheiden) |

- Die vier nicht gewählten Fassungen nur ablegen, nicht ins Spiel (wie der Totenkopf aus 3c).
- **Danach gilt:** Die bisherige Sprengladung bleibt nur noch für die **Haftladung**. Der Stiefel bleibt nur noch für **Ziehen**.
- Größe und Rand an die übrigen Fähigkeits-Symbole angleichen, bei 40 px prüfen.
- Vorher/Nachher-Bilder mit `node tools/symbol_bilder.mjs` in den Bericht.
- `entwurf/symbol-liste.md` nachziehen und im Bericht bestätigen, dass **kein Symbol mehr doppelt belegt** ist (außer der Garbe für MG-Sperrfeuer/Dauerfeuer/Reaktionsfeuer, die darf bleiben). Falls doch noch Doppelte auftauchen: als kurze Liste in den Bericht, der Berater macht dann einen weiteren Bogen.

# >>> ✓ JETZT (Enrico 2026-11-22 15:00): Neue ElevenLabs-Töne werden STANDARD – bei Unklarem fragen <<<
Gilt für alle neuen Töne von heute (ElevenLabs, alles aus `sound-quelle/_neu/`): Säge, Stahlklaue, Raubkatzen-Krallen, Kettenschwert, Löwen-Sprungeinschlag, Schreiter-Schritte, Kampfanzug-Schritte, schwere Pistole, Granatwerfer, schweres Gewehr, schweres MG, Stacheldraht, MG auf/ab, Geschütz auf/ab, Sandsäcke, Schreiter-Roboterstimmen, Feuer-/Panik-/Sterbe-Rufe.
- **Diese neuen Töne sind ab jetzt der Standard** in ihren Plätzen für die passenden Truppen: Schreiter/Kampfmaschinen, Löwen-Einheiten (Löwenoger, Sprungangriff), Kampfanzüge, Infanterie, Geschütze, MG-Trupps. Auch die bisher nur als Pult-Kandidaten eingetragenen (Gruppe „waffen_neu“: schwere Pistole, Granatwerfer, schweres Gewehr, schweres MG) dort einsetzen, wo die Waffe passt (welche Einheit welche Waffe hat, bitte selbst aus den Einheitendaten bestimmen).
- Die alten Töne **nicht löschen**, sie bleiben im Pult als Auswahl.
- **Wenn nicht eindeutig ist, wohin ein Ton gehört** (welche Einheit, welcher Anlass, oder ob er einen guten alten Ton ersetzen soll): **nicht raten**, sondern im Bericht als kurze Frageliste aufführen („Ton X: für A oder B?“). Enrico entscheidet dann bzw. stellt es im Pult selbst ein.
- Im Bericht eine kurze Tabelle: Platz/Anlass → neuer Standard-Ton → für welche Einheiten.

# >>> ✓ JETZT (Enrico 2026-11-22 15:00): Löwen-Sprungangriff Einschlag <<<
In `sound-quelle/_neu/` (ElevenLabs, neutral benannt): `loewen_sprung_einschlag_1.mp3` … `_4.mp3` (je 3 s).
- Inhalt: mehrere schwere, gepanzerte Löwenkrieger landen nacheinander aus dem Sprung, dumpfes Aufschlagen, Panzerplatten krachen, Stahlklauen und Klingen kratzen über Rüstung, kurzes Knurren, Dreck spritzt.
- **Verwendung:** beim **Einschlag des Sprungangriffs** (Fähigkeit „Sprung“/Sprungangriff, Löwen-Einheiten bzw. wer den Sprung hat) genau im Moment der Landung, zufällig eine der 4 Fassungen. Bisherigen Landeton als Unterlage leiser drunter lassen oder ersetzen, wie es besser klingt.
- Lautstärke an die anderen Nahkampf-Töne angleichen. Im Pult unter „Nahkampf“ als Kandidaten eintragen.

# >>> ✓ JETZT (Enrico 2026-11-22 14:50): Rufe Feuer, Panik, Sterben – alles da, bitte verteilen <<<
Ergänzt den Abschnitt 14:40 („Es folgen noch“ ist hiermit erledigt). Alles in `sound-quelle/_neu/`, Konkordat = Englisch, Aschenwacht = Deutsch:
- **Feuer-Befehl** (Stimmen Rob / Ragnar, „FIRE! Fire, damn you, FIRE!“ / „FEUER! Feuer, verdammt, FEUER!“): `konkordat_ruf_feuer_a/b.mp3`, `aschenwacht_ruf_feuer_a/b.mp3` → **Hauptmann/General**: bei „Feuer frei“, „Feuerschlag anfordern“, Feuerbereitschaft-Befehl und ähnlichen Feuerbefehlen.
- **Panik, einzeln** (ein Soldat flieht schreiend, „Get out! Run!“ / „Weg hier! Lauft!“): `konkordat_panik_einzeln_1-4.mp3`, `aschenwacht_panik_einzeln_1-4.mp3` → Trupp bricht/flieht (Moralbruch, Rückzug in Panik), kleine Trupps.
- **Panik, Gruppe** (mehrere schreien durcheinander, „Fall back! Run!“ / „Zurück! Lauft! Weg hier!“): `konkordat_panik_gruppe_1-4.mp3`, `aschenwacht_panik_gruppe_1-4.mp3` → größere Trupps brechen, oder mehrere Einheiten fliehen gleichzeitig.
- **Sterben, einzeln** (elendes Röcheln, ca. 10–12 s): `konkordat_sterben_einzeln_a/b.mp3` (Rob), `aschenwacht_sterben_einzeln_a/b.mp3` (Ragnar, „Mutter... ich kann nicht...“) → Fußtrupp vernichtet, nur ab und zu (etwa jede dritte), nach 4–6 s ausblenden.
- **Sterben, Gruppe** (mehrere Verwundete stöhnen, 3 s): `konkordat_sterben_gruppe_1-4.mp3`, `aschenwacht_sterben_gruppe_1-4.mp3` → nach Granat-/Artillerie-Volltreffern auf Fußtruppen oder wenn ein Trupp schwere Verluste hat; leise, als Nachklang.
- Alle als Kandidaten ins Pult (Bereich „Stimmen“, mit Filtern wie die anderen Rufe), Standard wie oben vorgeschlagen. Gleiche Regeln: höchstens ein Ruf gleichzeitig, Abklingzeit je Ereignis.
- Im Bericht kurz auflisten, welcher Ruf wo hängt.

# >>> ✓ JETZT (Enrico 2026-11-22 14:40): Schreiter-Roboterstimmen, MG/Geschütz/Sandsack-Töne, Sterben einzeln (Konkordat) <<<
Alles in `sound-quelle/_neu/` (ElevenLabs, Enrico, vom Berater benannt). Doppelte Dateien sind schon aussortiert.

**1. Schreiter-Roboterstimmen** (eigene Voice-Design-Stimmen „Konkordat Schreiter“ englisch / „Aschenwacht Schreiter“ deutsch). Je Fraktion 8 Zeilen, Nummer = Anlass:
- `schreiter_konkordat_01_auswahl.mp3` … `_08_zerstoert.mp3`, `schreiter_aschenwacht_01_auswahl.mp3` … `_08_zerstoert.mp3`
- 01 Auswahl, 02 Bewegen, 03 Angriff (Fernkampf), 04 Nahkampf, 05 Getroffen, 06 schwer beschädigt (unter ~35 % Leben, einmal je Schreiter), 07 Feind gesichtet (gegnerische Maschine/Panzer in Sicht, mit Abklingzeit), 08 Zerstört.
- Texte Konkordat: „The Concord endures. I await your command.“ / „Advancing. The earth shall carry my weight.“ / „Open fire. Let iron speak for us.“ / „Close enough to bleed.“ / „Armour breached... I still stand.“ / „Systems failing... I will not fall... not yet.“ / „Enemy machines. Bring them to me.“ / „I return... to the dark.“
- Texte Aschenwacht: „Befehl empfangen. Die Asche wartet.“ / „Vorwärts. Alles zermahlen.“ / „Feuer. Niemand bleibt stehen.“ / „Fleisch. Endlich.“ / „Panzerung durchschlagen. Unwichtig.“ / „Schmerz... wird... verarbeitet.“ / „Ziel erfasst. Keine Gnade.“ / „Asche... zu... Asche.“
- Gilt für alle Schreiter (Säge, Klaue, Turm, Orden, Kreuz, Eisenknecht usw.). **Filter:** metallischer Lautsprecher/Funk-Klang (Bandpass + leichte Verzerrung/Ringmodulation), Aschenwacht etwas rauer. Im Pult unter „Stimmen“ eine Gruppe **„Schreiter“** anlegen (wie im Bericht angekündigt), Filterstärke je Zeile wählbar. Gleiche Regeln wie die anderen Rufe (höchstens ein Ruf gleichzeitig, Abklingzeit, Auswahl nur jede dritte).

**2. MG auf- und abbauen** → beim Auf-/Abbauen der MG-Trupps (und Rückstoß-Zurückschieben, falls passend):
- `mg_aufbauen_mixpaket_1von4.mp3` … `_4von4.mp3`
- `mg_abbauen_mixpaket_1von4.mp3`, `_3von4.mp3`, `_4von4.mp3` (2von4 war doppelt)

**3. Geschütz auf- und abprotzen** → Feldkanone, Donnerrohr, Grabengeschütz usw.:
- `geschuetz_aufprotzen_mixpaket_1von4.mp3`, `_2von4.mp3`, `_4von4.mp3` (3von4 war doppelt)
- `geschuetz_abprotzen_mixpaket_1von4.mp3`, `_3von4.mp3`, `_4von4.mp3` (2von4 war doppelt)

**4. Sandsäcke bauen** → wenn Pioniere/Trupps Stellung oder Sandsackwall bauen (Ton `bauen`):
- `sandsaecke_bauen_mixpaket_1von4.mp3` … `_4von4.mp3`

**5. Sterben, einzeln, Konkordat** (Stimme Rob, englisch, elendiges Röcheln „Ahhh... Mum... I can't... I can't feel my legs...“, ca. 11 s):
- `konkordat_sterben_einzeln_a.mp3`, `_b.mp3` → wenn eine Konkordat-Fußtruppe vernichtet wird (nicht jedes Mal, etwa jede dritte, sonst zu viel; kürzen/ausblenden nach ~4–6 s ist ok).

**Es folgen noch (Berater lädt nach):** Sterben einzeln Aschenwacht (Ragnar), „FEUER!“ (Ragnar) / „FIRE!“ (Rob), Panik-Flucht Gruppe und einzeln (DE/EN), Sterben Gruppe (DE/EN). Enrico: Diese Rufe passend auf **Hauptmann/General und ihre Fähigkeiten** verteilen (z. B. „Feuer!/Fire!“ bei „Feuer frei“ und Feuerbefehlen), Panik bei Rückzug/Flucht/Moralbruch, Sterben bei Vernichtung. Konkordat = Englisch, Aschenwacht = Deutsch.

# >>> ✓ JETZT (Enrico 2026-11-22 13:35): Entscheidungen zum Bericht „Paket I fertig“ – alles wie vom Berater empfohlen <<<
**F92 Schärfe:** **Stufe 1 einschalten** (imageSmoothingQuality 'high' für Boden und Figuren) als Standard. Stufe 2 nicht bauen. Versuchsschalter darf bleiben.

**F94 Gefecht statt Kampagnenmission:**
- **B** feste gemischte Startarmeen für beide Seiten (gleiches Budget, höchstens 5 vom selben Typ).
- Nachschub nach Lage mit gemischtem Einstieg in die Wunschliste (`WUNSCH_MISCH`).
- **Geschütze sanft nachziehen** (z. B. erst nachziehen, wenn zwei Runden kein Ziel in Reichweite war), beide Seiten.
- **Sankt Ruß nachgleichen:** Die gemischte Aschenwacht-Liste dort anpassen (mehr Grenadiere statt Reitern o. ä.), bis das Konkordat wieder bei etwa 50–55 % liegt. Grauwall ebenso im Rahmen 48–55 % halten. Messung je 4 × 200 Schlachten in den Bericht.
- **„Feind-Armee selbst zusammenstellen“** auch gegen die KI bauen: Knopf „Seite wechseln“ dort zeigen, Wahl „KI stellt selbst zusammen / ich stelle zusammen“, Übergabe an `newGame`, Aufstellung per `autoAufstellen`, gleiche Regeln (Budget, ein General, ein Held, ein Stufe-3-Schreiter).

**F95 Tonmischung:**
- **Zielmischung übernehmen** (Werte aus der Tabelle im Bericht, Kulisse 0,13, Rufe 0,3, Musik im Gefecht −6 dB).
- **Musik-Ducking** auch bei Beschuss (−6 dB für 2,5 s).
- **WebAudio-Umbau:** `playSound` auf Tonpuffer, drei Wege Musik / Effekte / Stimmen, Begrenzer auf der Summe, neuer Regler „Stimmen“ in den Einstellungen.
- **Gewehr-Abschneiden beheben:** Kein Schuss wird mehr nach 170–230 ms hart abgeschnitten. Ob Variante A oder B („Hagel“): **Enrico hört noch in `tonprobe.html` und sagt Bescheid.** Bis dahin Variante A als Standard.

**F103 Rollen schärfen – alle sieben Vorschläge übernehmen:**
1. Sturmbrecher = Angriff (Panzergranate, Draht schneiden); **Eingreiftrupp = Gegenstoß** (×1,25 auf eigenen Zielfeldern und in eigenen Gräben, schwächer im Vorgehen).
2. Grabenräumer = billiger Grabenkampf ohne Panzerabwehr; Sturmbrecher = „Sturm und Panzerabwehr“, Panzergranate als Kern im Text.
3. **Kohorte = Schützenlinie** (Schuss 2 Felder, Feuerbereitschaft, hält Zielfelder); **Grenadiere = Stoßinfanterie** (Handgranaten vor dem Nahkampf, Nahkampf stärker, Schuss schwächer). Rollenname je Seite verschieden.
4. **Feldkanone = direktes Feuer** (flache Bahn, gegen Gepanzerte und Gebäude, schnell aufgeprotzt); **Donnerrohr = Steil- und Sperrfeuer**.
5. Fernsprechtrupp = „Feuerleitung“; Ballonbeobachter = „Aufklärung“.
6. **Sägeschreiter = gegen Gepanzerte; Klauenschreiter = gegen Fußtruppen** (packen/schleudern).
7. **Eiserne Hünen = „Schweres Feuer“** (Dauerfeuer); **Panzerknechte = Nahkampf und Draht**.
- Nach den Änderungen **Balance neu messen** (je 4 × 200 Schlachten, beide Karten) und die Rollentexte/CSV aktualisieren. Wenn eine Seite aus 48–55 % fällt, mit kleinen Werten nachgleichen und im Bericht nennen, was geändert wurde.

**Ordensschreiter:** So lassen wie gebaut (Stand = Ruhepose, Laufen = Geh-Pose), passend zu den anderen Schreitern.

**Doppelte Symbole** (Sprengladung ×4, Stiefel ×2): Der Berater macht einen Bogen C, kommt später. Garbe für MG-Sperrfeuer/Dauerfeuer/Reaktionsfeuer darf so bleiben.

**Reiter:** Die KI nutzt Lanzen- und Sprenglanzen-Reiter praktisch nicht (98 % nur ziehen). Bitte im Zuge von F94 prüfen, warum, und der KI beibringen, Reiter gegen Geschütze und ungeschützte Trupps einzusetzen. Im Bericht kurz nennen, was geändert wurde.

# >>> ✓ JETZT (Enrico 2026-11-22 12:18): Krallen- und Klauen-Töne <<<
In `sound-quelle/_neu/` (ElevenLabs, Enrico, schon neutral benannt). Je Gruppe gegen Fleisch (Infanterie) und gegen Eisen (Panzer, Schreiter, Kampfanzüge) getrennt, beim Treffer zufällig eine Variante wählen:
- **Stahlklaue → Klauenschreiter-Hieb** (alles mit großer Metallklaue):
  - `stahlklaue_fleisch_mixpaket_1von4.mp3` … `_4von4.mp3` (4 Stück)
  - `stahlklaue_eisen_mixpaket_1von4.mp3`, `_2von4.mp3`, `_4von4.mp3` (3 Stück). **`3von4` war eine doppelte Datei (gleich wie 2von4) und fehlt absichtlich.**
- **Raubkatzen-Krallen → die tierartigen Einheiten** (Löwen-Einheiten, Löwenoger und was sonst mit Pranken/Krallen angreift; welche das im Code sind, bitte selbst aus den Einheitendaten bestimmen und im Bericht auflisten):
  - `raubkatze_krallen_fleisch_mixpaket_1von4.mp3` … `_4von4.mp3`
  - `raubkatze_krallen_eisen_mixpaket_1von4.mp3` … `_4von4.mp3`
- Damit ist der Punkt aus „MERKEN 10:57“ (Klauen-Töne für Löwenoger und Klauenschreiter) erledigt. Offen bleibt dort nur das Roboter-Stimmenpaket für die Schreiter.
- Lautstärke an die Säge- und Kettenschwert-Töne angleichen und im Tonpult unter „Nahkampf“ einhängen.

# >>> ✓ JETZT (Enrico 2026-11-22 12:15): Ordensschreiter Ruhe und Kettenschwert-Hieb <<<
Beide in `ui-quelle/figuren/`, gleiches Aussehen wie `konkordat_ordensschreiter_posen.png`:
- `konkordat_ordensschreiter_posen2.png`: **nur die linke Figur nehmen = Ruhe** (MG tief am vorderen Arm, Kettenschwert hängt am hinteren Arm). Schaut nach rechts. **Die rechte Figur NICHT verwenden**, sie hat zwei Kettenschwerter.
- `konkordat_ordensschreiter_posen3.png`: **eine einzelne Figur = Kettenschwert-Hieb** (Schwert schräg hochgerissen, Funken an der Klinge, MG tief an der Hüfte). Schaut nach rechts. Die Figur ist größer gezeichnet als in den Zweierbildern, also **Größe an Gehen/Ruhe angleichen** (Fußlinie und Rumpfhöhe), wie schon beim General.
- Damit hat der Ordensschreiter: Gehen (neues Grundbild), Ruhe, MG feuert, Kettenschwert-Hieb. Treffer-Pose fehlt noch, bis dahin die bisherige Lösung (Wackeln/Aufblitzen) nehmen.
- Für den Hieb die Kettenschwert-Töne nehmen (`kettenschwert_ruestung_1-3.mp3` gegen Panzerziele, Säge-Fleisch-Töne gegen Infanterie, falls das schon so verdrahtet ist).

# >>> ✓ JETZT (Enrico 2026-11-22 12:03): Klauenschreiter Ausholen neu, Ordensschreiter mit neuem Aussehen <<<
**Klauenschreiter:** `ui-quelle/figuren/aschenwacht_klauenschreiter_posen4.png`.
- **Links: Ausholen** (Klaue hoch erhoben, beide Beine da). Die Figur schaut nach links, also spiegeln. **Ersetzt das Ausholen aus posen3**, dem dort ein Bein fehlte.
- **Rechts: Getroffen** (wankt zurück, Funken und Splitter an der Brust). Schaut nach rechts. → Neue Treffer-Pose für den Klauenschreiter.

**Ordensschreiter – neues Aussehen (Enrico: „super geworden“):** `ui-quelle/figuren/konkordat_ordensschreiter_posen.png`.
- Aufrechter, gepanzerter Kriegsmönch mit Panzerkapuze und gelbem Sehschlitz, rotem Wappenrock mit weißem Löwen, Orgelpfeifen-Auspuff, schwerem MG am vorderen Arm und langem Kettenschwert am hinteren Arm. Die geraden Beine ersetzen die alten Insektenbeine.
- Das alte Grundbild `konkordat_ordensschreiter.png` wird ersetzt.
- **Links: Gehen** → auch neues Grundbild. **Rechts: MG feuert**, mit Mündungsfeuer und Hülsen. Beide schauen nach rechts. Mündungspunkt messen.
- Aus den Orgelpfeifen steigen **kleine Rauchfahnen** auf. Die beim Freistellen entfernen.
- Die Waffen bleiben in beiden Figuren auf derselben Seite, gut so.
- Bogen 2 (Ruhe, Kettenschwert-Hieb) kommt noch.

# >>> ✓ JETZT (Enrico 2026-11-22 11:57): Schritt-Töne <<<
In `sound-quelle/_neu/` (ElevenLabs, Enrico, neutral umbenannt):
- `schreiter_schritte_1von3.mp3` … `_3von3.mp3` → **Schritte der Schreiter** (Sägeschreiter, Klauenschreiter, Turmschreiter, Ordensschreiter, Kreuzschreiter, Eisenknecht). Beim Ziehen im Takt, zufällig abwechselnd. Die Ritter-Schritte des Kürassiers bleiben für ihn.
- `kampfanzug_schritte_1von4.mp3` … `_4von4.mp3` → **Schritte der schweren Kampfanzüge** (Stahlgänger, Eiserne Hünen, Panzerknechte und ähnliche). Beim Ziehen, zufällig abwechselnd.
- Im Pult wählbar. Leise genug unter dem Kampflärm (Pegel wie F95). CREDITS: ElevenLabs Sound Effects (Enrico).

# >>> ✓ JETZT (Enrico 2026-11-22 11:53): Turmschreiter mit neuem Aussehen <<<
- **Enrico wollte ein neues Design.** Der alte Turm auf Beinen ohne Arme wird ersetzt.
  - Neu: gedrungener, vorgebeugter Läufer ohne Kopf in Blutrot mit Messing.
  - Gelb glühende Sehschlitze unter einem Panzerkamm, Löwe auf der Brustplatte, Ketten.
  - Kanone am rechten Arm, schweres MG am linken Arm, kurzes MG im Rumpf.
  - Das alte Grundbild `konkordat_turmschreiter.png` wird ersetzt.
- **Neu:** `ui-quelle/figuren/konkordat_turmschreiter_posen.png`.
  - **Links: Gehen.** Die Figur schaut nach rechts. **Diese Figur ist auch das neue Grundbild.**
  - **Rechts: Kanonenschuss – nicht verwenden.** Gemini hat dort die Arme vertauscht: Die Kanone ist vorn, das MG hinten. Beim Wechsel zwischen den Posen würden die Waffen die Seite tauschen. Enrico hat es selbst gesehen, und in vier Versuchen kam es immer gleich.
  - **Stattdessen:** Schießen = linke Figur, dazu Mündungsfeuer an der Kanonenmündung des hinteren Arms und ein kurzer Rückstoß im Code. Turm-MG = Mündungsfeuer am MG-Arm vorn bzw. am kurzen Rumpf-MG. Mündungspunkte messen.
  - Bei Spielgröße prüfen. Vorher/Nachher-Bild in den Bericht.
- **Töne „Infanterie im Stacheldraht“** in `sound-quelle/_neu/`: `infanterie_stacheldraht_mixpaket_1von3.mp3`, `_2von3`, `_3von3` (ElevenLabs, Enrico). → Wenn Fußtruppen Stacheldraht betreten bzw. darin hängen bleiben (Stärkeverlust). Zufällig abwechseln, im Pult wählbar.

# >>> ✓ JETZT (Enrico 2026-11-22 11:47): Stacheldraht-Töne <<<
In `sound-quelle/_neu/` (ElevenLabs, Enrico):
- `stacheldraht_durchschneiden.mp3` (drei schnelle, scharfe Schnitte) → **Draht schneiden** (Kohorte, Grenadiere, Pioniere, „Schneidet Draht“).
- `panzer_ueberrollt_stacheldraht.mp3` → wenn **Panzer, Kolosse oder Schreiter durch Stacheldraht fahren** bzw. ihn niederwalzen (Sturmwalze, Sturmrollen durch Draht).
- Beide als Standard für ihre Plätze, im Pult wählbar. CREDITS: ElevenLabs Sound Effects (Enrico).

# >>> ✓ JETZT (Enrico 2026-11-22 11:37): Bogen B – Befehlssymbole <<<
**Neu: `ui-quelle/bogen8b_befehle.png`** (Stil wie 3c, 4×2, Magenta). Damit bitte die Befehle umstellen, die im Abschnitt 10:35 noch zurückgestellt waren. Zuordnung (Reihe für Reihe, von links):
1. Signalhorn mit rotem Band → **Sammeln** (die Fahne bleibt nur noch für das Banner)
2. Erhobener Säbel → **Sturmbefehl**
3. Gewehrmündung mit Mündungsfeuer → **Feuer frei**. **Achtung:** Darunter hängt eine grüne Gaswolke (Bildfehler), die muss beim Freistellen weg. Sonst sieht es nach Gas aus.
4. Anker mit Kette → **Halten um jeden Preis** (das Schild bleibt nur noch für „Schilde vor“)
5. Trillerpfeife mit roten Schallwellen → **Generalangriff**
6. Leuchtpistole mit rotem Signal → **Ziel markieren**
7. Feldtelefon mit Kurbel → **Feuerschlag anfordern**
8. Gewehr auf Sandsäcken → **Feuerbereitschaft** (das Auge bleibt für Sicht bzw. Zustände)
- Danach gilt: Blitz, Fahne, Fadenkreuz und Schild haben je nur noch eine Bedeutung. In der Symbol-Liste im Bericht (siehe 10:35) bitte bestätigen, dass nichts Doppeltes übrig ist.

# >>> ✓ JETZT (Enrico 2026-11-22 11:20): Zwei neue Schuss-Töne <<<
In `sound-quelle/_neu/` (ElevenLabs, Enrico):
- `schwere_pistole_schuss.mp3`: **schwerer Pistolenschuss** mit tiefem Knall, metallischem Rückstoß-Klacken, kurzem Raketenzischen und dumpfer Explosion. → Pistolen von Hauptleuten, General und Offizieren, gern auch Stahlgänger oder Panzerknechte, wo eine schwere Handwaffe passt. Im Pult als Kandidat.
- `granatwerfer_schuss.mp3`: klingt nach Enricos Eindruck wie ein **Granatwerfer-Abschuss**. → Kandidat für Granatwurf bzw. Lob-Schüsse (Grenadiere, Panzergranate, ggf. Rauchwerfer und Minenwerfer-Abschuss). Im Pult wählbar.
- `schweres_gewehr_salve_2.mp3`, `schweres_gewehr_salve_4.mp3`: **schweres Gewehr**, drei einzelne wuchtige Schüsse mit Pause, Raketenzischen und dumpfer Explosion im Ziel. → Kandidaten für schwere Infanteriewaffen: Stahlgänger, Eiserne Hünen, Panzerknechte, Kampfanzüge. Je eine Fassung als Abwechslung.
- `schweres_mg_feuer_1.mp3`, `schweres_mg_feuer_2.mp3`: **schweres MG**, langsames, hämmerndes Dauerfeuer mit Explosionen. → Kandidaten für die Waffen der Schreiter (Klauenschreiter-MG, Turmschreiter-Turm-MG), ggf. schwere MG-Trupps. Im Pult wählbar, nicht automatisch über den bisherigen MG-Ton legen.
- CREDITS: ElevenLabs Sound Effects (Enrico).

# >>> ✓ JETZT (Enrico 2026-11-22 11:18): Neue Kettenschwert-Töne und Sanitäter-Ruf Gravel <<<
- **Kettenschwert trifft Rüstung**, in `sound-quelle/_neu/`: `kettenschwert_ruestung_1.mp3`, `_2.mp3`, `_3.mp3` (ElevenLabs, Enrico).
  - **Für mehr Abwechslung** als weitere zufällige Fassungen in alle Plätze mit Kettenschwert bzw. Kettensäge gegen Gepanzerte aufnehmen: Kürassier, Ordensschreiter und andere Kettensägen-Träger, wo es passt.
  - Nie zweimal hintereinander dieselbe Fassung. Im Pult wählbar.
- **Sanitäter-Ruf Konkordat, Stimme Gravel Midnight:** `stimmen_0922/konkordat_sanitaeter_gravel_a.mp3` und `_b.mp3`.
  - Das sind dieselben Dateien wie `stimme_090847_a/b.mp3` bzw. `stimme_gravel_0908_a/b.mp3`.
  - Bei den anderen Stimmen aus `stimmen_0922` ist der Text noch nicht zugeordnet. Bleibt wie geplant: Enrico ordnet sie im Ton-Pult zu.
- CREDITS: ElevenLabs (Enrico).

# >>> ✓ JETZT (Enrico 2026-11-22 10:58): Klauenschreiter mit neuem Aussehen – Posen-Bogen 1 <<<
- **Enrico wollte, dass sich der Klauenschreiter klar vom Sägeschreiter unterscheidet.** Er hat jetzt ein **ganz neues Aussehen**:
  - rußschwarz mit knochenweißen Platten,
  - runder Kuppelkopf mit drei gelben Sehschlitzen,
  - langer Klauenarm,
  - schweres MG mit Kühlmantel,
  - ein Schornstein.
  - Das alte Grundbild `aschenwacht_klauenschreiter.png` wird ersetzt.
- **Neu:** `ui-quelle/figuren/aschenwacht_klauenschreiter_posen.png`.
  - **Links: Gehen.** Die Figur schaut nach links, also spiegeln.
  - **Rechts: MG feuert**, mit Mündungsfeuer und Hülsen. Mündungspunkt messen.
- **Neu (11:02):** `aschenwacht_klauenschreiter_posen2.png`.
  - **Nur die linke Figur verwenden: Ruhepose = neues Grundbild.** Sie schaut nach links, also spiegeln.
  - **Die rechte Figur nicht verwenden.** Die Klaue bleibt zu dicht am Körper, Enrico gefällt das nicht.
- **Neu (11:12):** `aschenwacht_klauenschreiter_posen3.png`.
  - **Rechts: Klauenhieb**, die Klaue weit vorgestreckt, mit Funken. Die Figur schaut nach rechts. **Gut, verwenden.**
    - Oben rechts schwebt ein **loses MG-Rohr mit Feuer** (Bildfehler). Es muss beim Freistellen weg.
  - **Links: Ausholen**, die Klaue hoch erhoben. Die Figur schaut nach links, also spiegeln.
    - Ihr **fehlt ein Bein**, an der Stelle ist ein dunkler, verwischter Fleck. Der Fleck muss beim Freistellen weg.
    - Bei Spielgröße prüfen, ob das fehlende Bein auffällt. Wenn ja, das Ausholen weglassen: Ruhe → Hieb reicht. Mit Vorher/Nachher-Bild im Bericht.
  - Im Nahkampf: (Ausholen →) Hieb.
- Prüfen: keine Kreuze, Adler oder Totenköpfe.

# >>> ✓ JETZT (Enrico 2026-11-22 10:47): Sägeschreiter neu – Posen-Bogen 1 <<<
- **Neu:** `ui-quelle/figuren/aschenwacht_saegeschreiter_posen.png` (2 Figuren).
  - **Links: Gehen.** Die Figur schaut nach links, also **spiegeln**.
  - **Rechts: Drehlauf feuert**, mit Mündungsfeuer und fallenden Hülsen. Mündungspunkt messen.
- **Enrico findet diese Fassung viel cooler als das alte Modell**, auch wenn sie anders aussieht (glatter Helm mit Sehschlitz und Spitze, Brust-Helmwappen, drei Schornsteine, Säge am anderen Arm).
  - **Diese Fassung wird das neue Aussehen des Sägeschreiters.** Das alte Grundbild `aschenwacht_saegeschreiter.png` wird ersetzt.
  - Bogen 2 kommt gleich von Enrico: links **Ruhepose (neues Grundbild)**, rechts **Sägehieb**. Bis dahin für Ruhe und Ziehen die Geh-Pose nehmen, damit alt und neu nicht gemischt aussehen.
- **Neu (10:50):** `aschenwacht_saegeschreiter_posen2.png`.
  - **Nur die linke Figur verwenden: Ruhepose = neues Grundbild.** Sie schaut nach links, also spiegeln.
  - **Die rechte Figur ist missraten** (zwei Sägen, Drehlauf fehlt) und darf nicht verwendet werden. Der Sägehieb kommt als `aschenwacht_saegeschreiter_posen3.png` nach.
- **Neu (10:52):** `aschenwacht_saegeschreiter_posen3.png`.
  - **Links: Ausholen** (Säge hoch erhoben). Die Figur schaut nach links, also spiegeln.
  - **Rechts: Sägehieb** mit Funken. Die Figur schaut schon nach rechts.
  - Im Nahkampf: Ausholen, dann Hieb.
  - Auf der Brust steht hier ein schlichtes Schild statt des Helm-Wappens. Bei der kleinen Größe fällt das kaum auf, also so lassen.
  - **Säge-Töne (ElevenLabs, Enrico) in `sound-quelle/_neu/`. Endgültige Namen, Stand 11:18:**
    - `saege_fleisch_einschlag.wav/.mp3` → **Einschlag** des Sägehiebs gegen Fußtruppen.
    - `saege_fleisch_saegen.wav/.mp3` → das **Sägen** (laufende Säge im Fleisch), direkt nach dem Einschlag bzw. unter den Hieb gelegt.
    - `saege_metall_1.mp3`, `saege_metall_3.mp3` → Sägehieb gegen **Gepanzerte**. Welche der beiden Einschlag und welche Sägen ist, ist noch offen. Bitte reinhören und entsprechend einsetzen, beide im Pult wählbar.
    - **Ältere Namen derselben Dateien nicht verwenden:** `el_saege_einschlag_1.wav`, `el_saege_roehren_4.wav`, `saege_treffer_fleisch_1/4.wav/.mp3`, `saege_treffer_metall_1/3.mp3`. Diese bitte entfernen (es sind nur Doppel).
    - Klang: dumpf, nicht schrill. Pegel wie F95.
  - Prüfen: keine Kreuze, Adler oder Totenköpfe. Das kleine Ritterhelm-Wappen auf der Brust ist das Helm-Emblem der Aschenwacht und darf bleiben.

# >>> ✓ JETZT (Enrico 2026-11-22 10:35): Neue Fähigkeiten-Symbole, Heldenfunken, Stimmenpaket <<<
Zuerst den Abschnitt 10:25 (darunter) erledigen, dann das hier. Anschließend Paket I wie geplant weiter.

**1. Neuer Symbolbogen `ui-quelle/bogen8a_faehigkeiten.png`** (Stil wie Bogen 3c, 3×3, Magenta). Ziel von Enrico: **kein Symbol darf zwei verschiedene Bedeutungen haben.** Zuordnung (Reihe für Reihe, von links):
1. Rote Panzerfaust → **Durchbruch** (Rote Faust)
2. Kettenschwert → **Hinrichtung** (Eiserner Kürassier)
3. Rammkeil mit Schlammspritzern → **Sturmrollen**
4. Bajonett mit Tempo-Strichen → **Sturmlauf**
5. Bogenpfeil über Sandsäcke → **Sprungangriff**
6. Brüllender Löwenkopf → **Löwengebrüll** (ersetzt `flucht`)
7. Unterarm-Kanone mit Mündungsfeuer → **Kanonen-Zweitwaffe**: Unterarm-Kanone des Kreuzschreiters und Faustsalve des Eisenknechts (gleiche Bedeutung, daher ein Zeichen)
8. Gebündelte Handgranaten → **Panzergranate werfen** (die einfache Handgranate bleibt für normalen Granatwurf)
9. Rohr mit zwei Pfeilen → **Breitseite**
- Danach gilt: geflügelter Stiefel (`marsch`) nur noch für Bewegung, gekreuzte Messer (`nahkampf`) nur noch für normalen Nahkampf, `granate_artillerie` nur noch für Artillerie-Beschuss.
- Sauber freistellen. Bei Nr. 9 liegt ein leichter rosa Schleier vor der Mündung, der muss weg.
- `bogen8a_faehigkeiten_alt.png` ist Enricos zweite Fassung, nur als Reserve (dort stören Staubwolken in der Mitte und unten).
- **Noch nicht umstellen:** Sammeln, Sturmbefehl, Feuer frei, Halten um jeden Preis, Generalangriff, Ziel markieren, Feuerschlag und Feuerbereitschaft. Dafür kommt **Bogen B** von Enrico.
- **Im Bericht:** eine kurze Liste „Symbol → alle Stellen, an denen es benutzt wird“ (Knöpfe, Zustände, Marken, Tooltips, Tagebuch). Doppelte Bedeutungen, die danach noch übrig sind, deutlich markieren.

**2. Effektbogen `ui-quelle/effekte/fx_heldenfunken.png`** (3×2, Magenta).
- Obere Reihe, kalt: blauer Funkenstrich, blau-weißer Einschlag mit Splittern, kaltes Leuchten (Kugel) → **Eiserner Kürassier**. Funkenstrich und Einschlag für Kettenschwert-Treffer und Hinrichtung, das kalte Leuchten für die Furcht-Aura bzw. das Aufladen.
- Untere Reihe, warm: orangener Einschlag mit Brocken, orangener Funkenstrich, Glutsprenkel → **Rote Faust**, für Durchbruch-Aufprall, Ausholen und Glut.
- Nach Augenmaß einbauen, kurz und nicht zu groß. Probebilder in den Bericht.

**3. Stimmenpaket (ElevenLabs, Enrico) → `sound-quelle/_neu/stimmen_0922/`**, 26 kurze Rufe (`stimme_09xxxx_a/b/c.mp3`, 1,6–3,6 s; a/b/c sind Fassungen desselben Satzes).
- Welche Sätze das sind, weiß ich nicht genau (vermutlich die Ruflisten: Konkordat Englisch, Aschenwacht Deutsch). Deshalb:
- **Im Ton-Pult einen Abschnitt „Stimmen“** mit Zeilen je Ereignis (Auswahl/Bestätigung, Vorrücken, Feuer, Sturm/Nahkampf, Niedergehalten, Rückzug, Sammeln, Granate, Gas, Koloss/Panzer gesichtet, Feuerbereitschaft, Sanitäter, Held tritt an, Held fällt, Sieg), je Seite getrennt.
  - Alle 26 neuen Dateien (dazu `stimme_gravel_0908_a/b` und `stimme_ragnar_0914_a/b`) als wählbare Kandidaten.
  - Enrico hört sie dort durch und ordnet zu. Über TONWAHL kommt die Wahl ins Spiel.
  - Wo du die Sprache erkennen kannst (Englisch → Konkordat, Deutsch → Aschenwacht), gern vorsortieren.
- **Filter „Gasmaske + Rauschen“** für alle Stimmen:
  - Dumpf wie durch eine Maske: Bandpass etwa 300–3000 Hz, leichte Resonanz und leichte Verzerrung.
  - Dazu ein leises Rauschen bzw. Knistern wie ein Feldtelefon.
  - Im Pult je Zeile wählbar: „Gasmaske + Rauschen“ (Standard), „nur Rauschen“, „roh“, dazu ein Regler für die Stärke.
  - Fest in die Dateien rechnen oder live im Spiel, wie es günstiger ist.
- **Nicht zu oft:** höchstens ein Ruf gleichzeitig, kurze Sperre je Ereignisart (Richtwert 6–8 s), bei Auswahl/Bestätigung nur ab und zu (etwa jede dritte Auswahl). Rufe etwas leiser als Schüsse, aber verständlich (Pegel wie F95).
- CREDITS: Stimmen mit ElevenLabs Text to Speech erzeugt (Enrico).

# >>> DANACH (Enrico 2026-11-22 11:55): F104 Markierungen auf der Karte im rauen Pinselstil <<<
**Enrico:** Die im Code gezeichneten Markierungen passen vom Stil und von der Textur nicht zu den gemalten Figuren und Symbolen. Sie wirken zu glatt und sauber, wie Vektorgrafik. Er will den rauen, gemalten Ton auch dort.
- **Betrifft:**
  - Ringe und Umkreisungen bei Fähigkeiten und Auswahl
  - Ziel- und Bewegungsfelder
  - Pfeile und Linien (Zugvorschau, Anlauf, Befehlsreichweite)
  - Schussfeld (F96, gestrichelt)
  - Marken und Pfeile über den Köpfen der Einheiten
- **Ziel:** Alles sieht aus wie mit Tusche bzw. trockenem Pinsel gemalt:
  - unregelmäßige, leicht ausgefranste Ränder
  - Pinsel-Körnung und leichte Strichstärken-Schwankung
  - Pfeilspitzen wie gemalt
  - Gestrichelte Linien als einzelne Pinseltupfer
- **Lesbarkeit geht vor:** Der Kern bleibt deckend und kontrastreich. Nur der Rand wird rau. Die STYLE-Regel „Inhalte flach und sauber“ gilt weiter für Text, Zahlen und Balken im Panel. F104 betrifft nur die Markierungen auf der Karte.
- **Umsetzung, Vorschlag:**
  1. Im Code: Linien und Ringe mit einer Pinsel-Textur maskieren (Rauschen bzw. Körnung als Alpha-Maske, leichtes Zittern der Kontur, ungleichmäßige Strichstärke), einmal vorberechnet und zwischengespeichert, damit die Bildrate nicht leidet (6–10 ms je Frame halten).
  2. Wo es besser aussieht, gemalte Vorlagen aus einem Gemini-Bogen nehmen. Enrico erzeugt `ui-quelle/bogen9_markierungen.png` (Pinsel-Ring, Pfeile, Chevrons, Pinseltupfer, Ziel-Haken).
- Vorher/Nachher-Bilder in den Bericht (Auswahl, Fähigkeitsvorschau, Schussfeld, Zugvorschau).

# >>> MERKEN (Enrico 10:57): Töne, die noch kommen <<<
Nur zur Kenntnis, noch nichts tun. Enrico erzeugt sie später:
- **Löwenoger:** metallisches Krallengeräusch (Kratzen, Zugreifen).
- **Klauenschreiter:** metallisches Krallen- bzw. Greifgeräusch.
- **Stimmenpaket für die Schreiter:** Roboter- bzw. Maschinenstimmen, ein paar kurze Sätze je Seite. Später im Ton-Pult unter „Stimmen“ einen eigenen Bereich „Schreiter“ vorsehen.

# >>> ✓ MERKEN (Enrico 2026-11-22 10:43): F103 Klare Rollen in allen Einheitentexten – nach Paket I <<<
Enrico hatte das schon einmal angesprochen (F66 Schere-Stein-Papier, Paket G Texte). Es reicht ihm aber noch nicht. **Ziel:** Man sieht überall auf einen Blick, wofür eine Einheit da ist, wogegen sie gut ist und wer ihr mehr reinhaut. Das gibt mehr Tiefe beim Zusammenstellen.
- **Wo:** überall, wo Einheiten beschrieben werden: Menü bzw. Armee-Zusammenstellung (Kaufen), Einheiten-Panel und Tooltip im Spiel, Einheitenliste bzw. Handbuch, Gegner-Info.
- **Gleiches Schema für alle 54 Einheiten**, kurz:
  - **Rolle:** ein Wort oder eine kurze Wendung (z. B. Linieninfanterie, Panzerjäger, Grabenstürmer, Unterstützung, Fernfeuer, Durchbruch).
  - **Stark gegen:** Fußtruppen / Gepanzerte (Panzer, Kolosse, Schreiter) / Geschütze / Reiter / Stellungen und Gebäude.
  - **Schwach gegen:** dasselbe.
  - **Kontert man mit:** 1–2 eigene Einheiten bzw. Arten, die gegen sie helfen.
  - Optional eine kleine Leiste mit 1–3 Punkten je Zielart (Fuß / Gepanzert / Gebäude / Nahkampf), wenn das im Panel gut lesbar ist.
- **Aus den Zahlen ableiten, nicht frei schreiben:** Rolle und Stark/Schwach aus der Faktortabelle (F66, FAK), `at`, `gat`, Panzerung, Nahkampf-Rolle usw. ableiten. Dann bleibt es richtig, wenn wir später an der Balance drehen. Feste Begriffe überall gleich verwenden.
- **Rollen schärfen:** Liste im Bericht, wo zwei Einheiten derselben Seite fast dieselbe Rolle zu ähnlichem Preis haben (Enrico ist z. B. Sturmbrecher/Grabenräumer und Kohorte/Grenadiere aufgefallen). Mach je einen Vorschlag, wie sie sich klarer unterscheiden. Nichts an den Werten ändern, Enrico entscheidet.
- In `einheiten_statistik.csv` (Schritt 11) bitte auch die Spalten Rolle, Stark gegen und Schwach gegen, damit sie in Enricos Einheiten-Tabelle kommen.
- Bericht: Tabelle aller Einheiten mit den neuen Zeilen und Vorher/Nachher-Bilder von Kaufmenü und Panel.

# >>> ✓ JETZT (Enrico 2026-11-22 10:25): Antworten zum Zwischenbericht Paket I <<<
**Entscheidungen:**
1. **MG-Rückstoß (K4):** **Ja – der Rückstoß schiebt ein aufgebautes MG zurück, baut es aber nicht ab** (wie `NORUECKMG=1`). Fest einbauen, Sim-Schalter zum Messen darf bleiben. Danach Grauwall und Sankt Ruß noch einmal messen und kurz berichten. Weiter nichts nachstellen.
2. **Konkordat-General Hieb-Pose:** **Maßstab angleichen**, gleiche Größe wie in den übrigen Posen.
3. **Aschenwacht-General Säbelhieb:** Enrico macht den Bogen `aschenwacht_general_posen3.png` (gleiche Machart, 2 Figuren, Fahnenträger dahinter) und legt ihn nach `ui-quelle/figuren/`. Bis dahin bleibt der erhobene Säbel.
4. **Mahlwerk/Sensenwerk:** kein eigener Bogen „MG-Schütze am Abzug“ nötig, so lassen.

**Dann weiter wie geplant:** zuerst die neuen Dateien von 10:15 (Kreuzschreiter- und Eisenknecht-Posen, Kettenschwert-Treffer, Stimmen, siehe unten), dann F98, Schritt 11 (`einheiten_statistik.csv`), Schritt 12 (F92 Schärfe), F94 und F95 (nur Vorschläge und Proben).

# >>> JETZT (Enrico 2026-11-22 09:45): Antworten zum Abschlussbericht Paket H, dann Paket I <<<
**Entscheidungen:**
1. **Balance nach K4:** **(b) Beim Sturmrollen-Anlauf keine Kolossfurcht auslösen.** Danach Grauwall und Sankt Ruß neu messen (wie oben, Startwerte 1–4) und berichten. Wenn das Konkordat dann noch deutlich über 54 % liegt, im Bericht nächsten Vorschlag machen, nichts weiter nachstellen.
2. **Durchbruch-Ablauf:** **Titel vor dem Anlauf** – Titel „DURCHBRUCH“ → Anlauf → Schlag. Gilt sinngemäß auch für Sturmrollen und andere Fähigkeiten mit Anlauf/Sprung (Titel zuerst).
3. **F88 Haken:** Regel passt so – und **F102** (Enrico setzt „erledigt“ jederzeit selbst, mit Taste) kommt in Paket I dazu.
4. **F91 ältere Pult-Wahlen:** **behalten.**
5. **Löwenoger-Brüllen:** Danke, Enrico tauscht `oger_bruell` selbst im Pult.
6. **K13 ungenutzte Posen:** **selbst nach Augenmaß zuordnen**, Vorher/Nachher-Bilder im Bericht.
7. **K14** (`mg3`, `kolosskanone_1`): Enrico hört im Pult rein und meldet sich.
8. **M6** Kürassier auf Grauwall: erst nach Punkt 1, vorerst nichts.

**Neue Töne für die Helden (Enrico, ElevenLabs, 09:52) in `sound-quelle/_neu/` – gleich mit einbauen (Ton-Pult-Zeilen, Spiel-Standard, Pegel wie F95):**
- `el_faust_schlag_mit_laden_3.mp3`, `el_faust_schlag_mit_laden_4.mp3` (je ~2,5 s): Servo lädt kurz, dann Schlag mit eigenem Einschlag → **Rote Faust Faustschlag komplett** (Standard: eine der beiden, die andere als Abwechslung). Ersetzt bzw. ergänzt Vortex-Aufladen + Robot-Footstep-Boom; im Pult beide Wege wählbar lassen.
- `el_faust_einschlag_2.mp3`, `el_faust_einschlag_4.mp3` (je ~1,5 s): **nur der Einschlag** der Servofaust (tiefer Wumm, scheppernd, Dampf danach) → **Treffer-Ton** beim Durchbruch-Aufprall und als Einschlag, wenn das Ausholen getrennt läuft.
- `el_kuerassier_schritte_1.mp3` (~3 s, vier schwere Ritter-Schritte): in einzelne Stampfer schneiden → **Schritte des Eisernen Kürassiers** beim Ziehen (im Takt), ersetzt/ergänzt die Blast-Door-Schritte.
- `el_kuerassier_saege_start_1.mp3`: tiefes, knurrendes Anspringen des Kettenschwerts → **Kürassier Ausholen** (ersetzt den schrillen Kettensägen-Start als Standard, alter bleibt im Pult wählbar).
- `el_kuerassier_schwung_schnitt_4.mp3`: schwerer Schwung mit tiefem Motorknurren und Schnitt in Rüstung → **Kürassier Querhieb und Hinrichtung** (ersetzt den schrillen Sägeschnitt als Standard).
- Herkunft für CREDITS: mit ElevenLabs Sound Effects erzeugt (Enrico).

**Neu eingegangen (Enrico 10:15) – Schreiter-Posen, Kettenschwert-Töne, Stimmen:**
- **Kreuzschreiter** (`ui-quelle/figuren/`):
  - `konkordat_kreuzschreiter_posen.png`: links **Gehen** (Schritt mit Hammer), rechts **Löwenmaul-Schuss** (Kanone nach vorn; Rückstoß im Spiel).
  - `konkordat_kreuzschreiter_posen2.png`: links **Hammerschlag** (Hammer unten am Ende des Schlags), rechts **Unterarm-Kanone erhoben** → Zweitwaffe/Löwengebrüll-Pose. Eine Getroffen-Pose fehlt – bleibt bei Rütteln/Rückstoß.
- **Eisenknecht**:
  - `aschenwacht_eisenknecht_posen.png`: links **Gehen**, rechts **beide Kanonen feuern** (Faustsalve).
  - `aschenwacht_eisenknecht_posen2.png`: links **Hackklinge erhoben** = Ausholen, rechts Kanonen nach vorn (zweite Schuss-Variante).
  - `aschenwacht_eisenknecht_posen3.png`: links **Hackklingen-Hieb** nach vorn, rechts derselbe Hieb, **schaut nach links → spiegeln**.
  - Kleine **Rauchfähnchen** aus den Schornsteinen (posen und posen3 links) entfernen oder sauber freistellen. Prüfen: keine Adler/Kreuze/Totenköpfe (die roten Siegel mit Papierstreifen dürfen bleiben).
  - Mündungspunkte messen, Fahne auf dem Rücken wie beim Grundbild.
- **Kettenschwert-Treffer Kürassier** (`sound-quelle/_neu/`): `el_kettenschwert_metall_1/3.mp3` (~2 s) → Treffer **gegen Gepanzerte** (Kampfanzüge, Schreiter, Panzer); `el_kettenschwert_fleisch_2/3.mp3` (~2,6 s) → Treffer **gegen Fußtruppen**. Nach Ziel wählen wie beim Einschlag-System (weich / gepanzert).
- **Stimmen (ElevenLabs, Enrico):** `stimme_gravel_0908_a/b.mp3` (~2,3 s, Stimme „Gravel Midnight“) und `stimme_ragnar_0914_a/b.mp3` (~3,4 s, Stimme „Ragnar“). Vermutlich die **Sanitäter-Rufe**: Gravel = Konkordat „Medic! I need a medic!“, Ragnar = Aschenwacht „Sanitäter! Ich brauche einen Sanitäter!“ – bitte reinhören und so zuordnen, wie es passt (Sprache erkennen), als Ruf, wenn eine Einheit schwer getroffen ist bzw. den Sanitäter braucht. Weitere Rufe folgen.

**Danach Paket I** (Abschnitt „DANACH: Paket I“ weiter unten): F94 (mit Feind-Armee selbst zusammenstellen), F95 Tonmischung mit Gewehr-Hagel, F96 Schussfeld, F98 Blut bei Beschuss, F99 Zielpose bei Feuerbereitschaft, F101 General-Säbelhieb, F102 Erledigt-Taste; dazu aus Paket H noch offen: **Schritt 11 Einheiten-Statistik** (`einheiten_statistik.csv`) und **Schritt 12 F92 Schärfe** (Grisseln beim Herauszoomen), falls noch nicht erledigt. F94 und F95 nur vorschlagen/Proben, Enrico entscheidet. Zwischenbericht nach F102/F96/F99 mit „– pb“.

# >>> ✓ SOFORT (Enrico 02:30, Spieltest): F97 Getroffen-Pose dreht die Figur um <<<
Enrico spielt gerade das Konkordat: Werden seine Einheiten **beschossen oder im Nahkampf getroffen**, **kippen sie nicht mit dem Körper nach hinten, sondern drehen sich um** (Bild gespiegelt). Vermutlich Nebenwirkung von **M7** (`02:19`, Getroffen-Pose richtet Spiegelung nach dem letzten Angreifer aus) oder der neuen Spiegelliste F89.
Gewollt: Die Figur **behält ihre Blickrichtung**; nur das **Kippen/Taumeln** geht vom Angreifer weg. Gespiegelt wird die Getroffen-Pose nur, wenn der Angreifer **hinter** ihr steht – und auch dann soll es nicht wie eine Drehung aussehen. Bitte direkt nach F88 beheben, mit Test (Konkordat und Aschenwacht, Beschuss von vorn und von der Seite, Nahkampf).

✓ **F100 (Enrico 02:43, Spieltest) – Sturmrollen verpufft:** Wählt man beim Panzer **Sturmrollen**, klickt aber auf eine feindliche Einheit, die **zu weit weg** ist, wird das Sturmrollen **nicht** ausgeführt – stattdessen **schießt** der Panzer normal, und die **Fähigkeit ist trotzdem verbraucht** (Pause läuft). Gewollt: Im Fähigkeits-Modus nur gültige Ziele anbieten/hervorheben; ein Klick auf ein ungültiges Ziel macht **nichts außer einer kurzen Meldung** („zu weit – Sturmrollen reicht 2 Felder geradeaus“), **kein Schuss, keine Pause verbraucht**. Bitte alle Fähigkeiten mit Ziel auf denselben Fehler prüfen (Durchbruch, Hinrichtung, Sprungangriff, Panzergranate, Haftladung, Feuerschlag, Markieren, Nebel, Stollen …) und einen Test ergänzen. Ebenfalls direkt nach F88/F97.

# >>> ✓ DANACH: Paket I – Spieltest-Funde Enrico 2026-11-22 02:25 (nach Paket H) <<<
- ✓ **F93 Auswahl bleibt, solange noch etwas geht:** Schießt man mit einer Einheit, die mehrere Waffen hat (z. B. Landkoloss: Kanone **und** Seiten-MG; Turmschreiter, Sturmpanzer mit Breitseite/Bord-MG, Kreuzschreiter, Eisenknecht …), wird sie nach dem ersten Schuss abgewählt. Sie soll **ausgewählt bleiben, solange sie noch etwas tun kann** (zweite Waffe, Bewegung, Fähigkeit) – erst wenn nichts mehr geht, abwählen bzw. zur nächsten Einheit springen. Gilt allgemein für alle Einheiten.
- ✓ **F94 Schlachten sollen sich mehr wie ein Gefecht (Skirmish) anfühlen, nicht wie eine geskriptete Kampagnenmission:**
  - Auf der ersten Karte stellt die KI ihre **Geschütze hinten auf und bewegt sie nie** – sie soll Artillerie auch aufprotzen und nachziehen, wenn die Front sich verschiebt oder keine Ziele mehr in Reichweite sind.
  - Die KI beginnt mit **sehr viel Masse** und bekommt danach Nachschub, der wie eine **geskriptete Verstärkung** wirkt. Enrico wünscht sich: beide Seiten mit **gemischten, unterschiedlichen Einheiten** von Anfang an (Startarmee der KI abwechslungsreicher, nicht viel vom Gleichen), Nachschub abwechslungsreich und nach Lage.
  - **Dazu als Möglichkeit (Enrico 03:16):** Im Startmenü die **Startarmee des Feindes selbst zusammenstellen** können – mit derselben Armee-Auswahl wie für die eigene Seite (gleiche Punktgrenze und Regeln, z. B. ein Held, ein Stufe-3-Schreiter), wahlweise „KI stellt selbst zusammen“ wie bisher. Die KI spielt dann mit dieser Armee und kauft Nachschub weiter selbst. Aufwand im Bericht schätzen und gleich mit vorschlagen.
  - Bitte erst **untersuchen und im Bericht 2–3 Möglichkeiten vorschlagen** (z. B. Startarmeen beider Seiten gleich viele Punkte und frei gemischt; KI-Startarmee mit Mindestvielfalt; Nachschub-Rhythmus), mit Simulation der Siegquote je Möglichkeit. Enrico entscheidet.
- ✓ **F96 Schussfeld bei Feuerbereitschaft anzeigen (Enrico 02:27):** Schickt man eine Einheit in die Feuerbereitschaft (auch MG-Sperrfeuer), soll man **das Feld sehen, das sie abdeckt** – also in welche Richtung sie schaut und welche Felder sie überwacht (Fächer/Reichweite). Beim Auswählen der Aktion als Vorschau, danach dezent sichtbar, solange die Bereitschaft gilt (z. B. beim Darüberfahren oder als feiner Fächer am Boden, Bildwirkung beachten). Gegnerische Feuerbereitschaft nur, wenn sie sichtbar/bekannt ist.
- ✓ **F99 Feuerbereitschaft sichtbar an der Haltung (Enrico 02:33):** Einheiten in **Feuerbereitschaft** (und aufgebaute MG im Sperrfeuer) sollen, solange sie gilt, in der **Ziel-/Anlegepose** stehen bzw. knien (Gewehr angelegt, zielend in Blickrichtung) statt in der Ruhepose – so sieht man auf einen Blick, wer überwacht. Vorhandene Zielposen der Bögen nutzen (kniend zielen, wo es eine gibt); wo keine Zielpose existiert, im Bericht auflisten (dann macht Enrico sie mit Gemini). Passt zu F96 (Fächer am Boden).
- ✓ **F102 „Erledigt“ selbst setzen (Enrico 03:13):** Enrico möchte **bei jeder Einheit jederzeit selbst** sagen können „die ist erledigt“ – auch wenn sie laut Regeln noch ziehen oder schießen dürfte (z. B. Mörser nach dem Schuss, Einheit ohne Ziel). Falls es den Knopf „Fertig“ im Bedienfeld schon gibt: gut sichtbar machen, für **jede** Einheit in jedem Zustand anbieten und mit einer **Taste** belegen (Vorschlag: Leertaste oder E), danach automatisch zur nächsten noch offenen Einheit springen. Rückgängig: Klick auf die erledigte Einheit und erneut „Fertig“ (oder Rückgängig-Taste), solange sie nichts getan hat. Die automatische Haken-Logik aus F88 bleibt zusätzlich bestehen. Im Bericht kurz beschreiben, wie es sich bedient.
- ✓ **F101 Nahkampf-Pose des Konkordat-Generals (Enrico 02:43):** Im Nahkampf hat der Konkordat-General keine Schlag-Animation (hält nichts in der Hand). Prüfen, welche Pose der Nahkampf nutzt. **Neu: `ui-quelle/figuren/konkordat_general_posen3.png`** (zwei Figuren): links **Säbelhieb schräg nach unten** = Nahkampf-Schlag, rechts **Säbelstoß nach vorn** = zweite Nahkampf-Pose/Ausholen-Variante. Beide Figuren haben zusätzlich eine Säbelscheide am Gürtel – so lassen. Fahnenträger wie bei den anderen General-Posen dahinter. Gleiches beim **Aschenwacht-General** prüfen (hat Säbel erhoben, aber evtl. keinen Hieb) und im Bericht sagen, ob ein Bogen fehlt.
- ✓ **F98 Kleine Blutspritzer auch bei Beschuss (Enrico 02:31):** Treffer durch **Gewehre, MG, Schrot** (und Splitter) an Fußtruppen sollen ebenfalls **etwas Blut** zeigen – **kleine** Spritzer (der alte `fx_blut`, verkleinert), nicht bei jedem einzelnen Treffer, aber spürbar (z. B. bei etwa jedem zweiten Treffer bzw. je Salve ein bis zwei kleine Spritzer an getroffenen Männern, in Schussrichtung). Nicht übertreiben. Keine Spritzer an Panzern, Schreitern und Fahrzeugen; bei gepanzerten Kampfanzügen nur bei Treffern, die wirken. Bildwirkung „leicht“ = weniger, „aus“ = keine.
- ✓ **F95 Tonmischung („Tonmeister“-Durchgang):** Insgesamt sind die **Effekte zu leise** gegenüber Musik/Hintergrund und Stimmen – z. B. das **MG der Aschenwacht**, **rollende Panzer**. Bitte einen kompletten Misch-Durchgang wie ein Tontechniker:
  - Lautheit aller Gruppen messen (wie Fable: Pegel je Ton, dazu Lautstärke im Code) und eine **Zielmischung** festlegen: Waffen und Einschläge vorn, Fahrzeuge/Schreiter-Motoren und Schritte gut hörbar, Stimmen etwas darunter, Musik und Hintergrund als Bett dahinter.
  - Ausreißer angleichen (zu leise: Aschenwacht-MG, Panzer-Fahren, Kürassier-Schritte K8; zu laut: was heraussticht).
  - **Musik automatisch etwas leiser** („Ducking“), solange Gefechtslärm läuft; leichter Begrenzer (Limiter) auf der Gesamtsumme, damit Lautes nicht übersteuert.
  - Prüfen, ob es im Optionsmenü getrennte Regler für **Musik / Effekte / Stimmen** gibt, sonst ergänzen.
  - Tabelle vorher/nachher je Gruppe im Bericht.
  - **Gewehrfeuer der Infanterie (Enrico 02:27):** Das Gewehr der normalen Einheiten (Schützenkohorte, Grenadiere usw.) klingt **zu dröge**. Beim Konkordat ist der Klang an sich gut, aber die Schüsse **klingen abgehackt, ohne Nachhall**. Gewünscht:
    - Jeder Schuss mit **kurzem, scheppernden Nachhall/Echo** – nicht zu kurz, nicht zu lang (Richtwert 0,4–0,8 s Ausklang, wie über offenes Feld).
    - Eine Trupp-Salve als **Hagel**: mehrere Schützen feuern leicht versetzt, **unterschiedlich viele Schüsse je Mann** (mal 1, mal 2, mal 4 …), zufällige kleine Abstände und Tonhöhen-/Lautstärke-Streuung – „bam, bam, bam-bam, bam“ –, deutlich **wuchtiger**, aber gleiche Spieldauer wie bisher in etwa.
    - Gilt für beide Seiten (Aschenwacht-Gewehr gleich mitbehandeln), mit Ton-Pult-Wahl wie bisher. Im Bericht 2 Hörproben-Varianten in der Tonprobe anbieten, Enrico wählt.

# >>> ✓ JETZT: Paket H – Prüfliste 2 + Spieltest Runde 5 (Enrico 2026-11-22 02:00) <<<
Grundlage: `entwurf/postfach/PRUEFLISTE2.md` (Fable) und die Spieltest-Funde F88–F91 direkt darunter. Die Sperre „erst nach Prüfliste 2“ ist damit aufgehoben.

**Entscheidungen von Enrico zur Prüfliste 2:**
- **M5 Pausen:** **Texte anpassen**, Regel bleibt (überall „alle N Runden“ statt „N Runden Pause“, für alle Fähigkeiten einheitlich).
- **K4 Anlauf (Durchbruch, Sturmrollen):** **normale Zugregeln** – Minen lösen aus, Feuerbereitschaft/Sperrfeuer/Freischlag greifen, Feuer/Gas schaden; auch das zurückgeschleuderte Ziel löst Minen aus; aufgebautes MG wird durch den Rückstoß abgebaut. Danach kurz nachsimulieren.
- **K9 Größe:** **Helden 1,65**, **Eiserne Hünen 1,7** Soldatenhöhen.
- **K11 Kirche:** Helden **nicht** ins Kirchenschiff und nicht auf den Turm (wie Reiter).
- **K17 MG dreht sich nach Nahkampf zum Angreifer:** **gewollt** (Enrico hatte „Ja, drehen lassen“ entschieden). Medaillen 35 px: auf 40 px wie in 2.18 vorgesehen.

**Reihenfolge (wie von Fable empfohlen, mit Spieltest-Funden eingeordnet):**
1. ✓ **H1** (Zeile vor den Kommentar) und **K1** (Kommentar-Test erweitern).
2. ✓ **F89 Mörser/Geschütze Blickrichtung** und **F90 Panzer drehen sich im Nahkampf** (beide wahrscheinlich Zeichenweg-/Spiegel-Fehler wie F83) + **M7** Getroffen-Richtung vom Angreifer ableiten. Startausrichtungs-Test auf **alle** Typen erweitern.
3. ✓ **F88 Haken „alles erledigt“** für alle Typen + Test.
4. ✓ **M1** KI-Wunschliste, **M2**/**K5** Gründe für gesperrten Helden.
5. ✓ **M3**, **K12** Mündungen (Helden, Generäle, Hauptmann, Pioniere, Soldat zuerst), **M4** Kürassier-Steckenbleiben (eigener Text/Ton), **K6**, **K7**, **K8** (Ritter-Schritte +8 dB, mehr Bass), **K10**.
6. ✓ Text-Durchgang: **M5**, **K2**, **K3**, **K15**, **K16**.
7. ✓ **F91** Ton-Pult-Export einbauen (`tonpult_export_2026-11-22_0151.json`) + **M8** Pult-Zeilen der Helden wie im Spiel + Löwen-Brüllen finden.
8. ✓ **H2 + M9 Größe:** Auswahl-Töne in eine eigene Datei nur für Pult/Tonprobe; `ballon_brenner` beim Aufsteigen einbauen. Danach `git gc` und Größe berichten. Künftig `index.html` **nur am Ende eines Pakets** einchecken, nicht bei jedem Teilschritt.
9. ✓ **M6** Kürassier-KI (Gefahr-Gewicht Graben/Schlamm, Grauwall-Einsatz) + Heldenfall einmal gezielt simulieren; **K13**, **K14**, **K18**, **K19** bei Gelegenheit.

10. ✓ **Größen-Probe (nur messen, nichts am Spiel ändern):** Enrico möchte wissen, wie groß Schlachtfelder im Browser werden können. Baue **Probe-Karten in doppelter und dreifacher Fläche** – nur zum Messen, nicht ins Spielmenü – **aus den vorhandenen Geländestücken** (z. B. Grauwall/Sankt Ruß zusammengesetzt oder vergrößert), **keine neuen Bilder**. Einheiten entsprechend mehr (×2 / ×3). Darauf je eine KI-gegen-KI-Schlacht (headless, ohne dass Enrico spielt) und messen: Bildzeit (Mittel, 95 %, längstes Bild) beim Übersichts-Zoom und nah, KI-Bedenkzeit je Zug, Speicher, Ladezeit. Prüfen und berichten, ob das Spiel heute **nur den sichtbaren Ausschnitt** zeichnet oder immer die ganze Karte, und was bei großen Karten zuerst bremst (Zeichnen, KI, Sicht-/Wegberechnung). Ergebnis als kleine Tabelle im Bericht + Einschätzung, ab welcher Größe ein WebGL-Umbau (Mittelweg: nur Gelände und Figuren) oder ein KI-Rechenkern nötig wäre.

11. ✓ **Einheiten-Statistik für Enricos Balance-Tabelle:** Der Berater hat Enrico eine Tabelle aller 54 Einheiten gebaut (Werte aus `engine.js`). Bitte aus je 200 Simulationen Grauwall und Sankt Ruß je Einheitentyp ermitteln und als `entwurf/postfach/einheiten_statistik.csv` ablegen (Spalten: `schluessel`, `karte`, `gekauft_je_schlacht`, `aktionen_je_schlacht`, `schaden_gemacht_je_schlacht`, `schaden_je_100_punkte`, `ueberlebt_bis_ende_prozent`, `einsatz_ki` kurz: wofür die KI sie nutzt). Startarmeen mitzählen, Nachschub-Käufe getrennt ausweisen, wenn möglich. Der Berater überträgt das in Enricos Tabelle. Nur messen, keine Werte ändern.
12. ✓ **F92 Figuren schärfer (Enrico 02:10)** – erst untersuchen, dann im Bericht Vorschläge mit Vorher/Nachher-Bildern (Übersichts-Zoom und nah), Enrico entscheidet:
    - Wird die Zeichenfläche passend zur **Bildschirm-Skalierung (devicePixelRatio)** gezeichnet? Bei Windows-Skalierung 125/150 % wirkt sonst alles verwaschen. Das ist vermutlich der größte Hebel.
    - Wie werden die Figuren verkleinert (Glättung, `imageSmoothingQuality`, Vorab-Verkleinerung in passenden Stufen statt Verkleinerung in einem Schritt)? Beim Zuschneiden ggf. leicht nachschärfen.
    - **Enrico 02:15: Es geht um SCHÄRFE, nicht um Erkennbarkeit.** Keine Kontur, kein Bodenring in Fraktionsfarbe (die Seiten erkennt man an den Farben gut). Etwas mehr Kontrast ist als Option in Ordnung, Hauptsache die Figuren wirken knackig statt weich/verwaschen.
    - **Enrico 02:17, genauer:** Beim **Herauszoomen werden die Figuren „grisselig“** (flimmernd, krisselige Kanten). Das klingt nach Verkleinern in einem Schritt ohne Zwischenstufen: für jede Figur **vorab verkleinerte Fassungen** (z. B. 100 %, 50 %, 25 %, wie Mipmaps) bereithalten und je nach Zoom die passende nehmen, mit hochwertiger Glättung. Vorher/Nachher-Bilder bei weitestem Zoom zeigen. Die Sockel (Bases) gibt es schon – nichts daran ändern.

Zwischendurch nach Schritt 3 und nach Schritt 6 je ein kurzer Bericht mit „– pb“, am Ende der ausführliche. Leistung ist laut Messung unkritisch (Bildzeit 6–10 ms) – kein WebGL nötig.

# >>> SPIELTEST RUNDE 5 – Funde von Enrico (2026-11-22 01:45) <<<
Erst bearbeiten, **wenn die Prüfliste 2 von Fable da ist** (`PRUEFLISTE2.md`) – dann beides zusammen als nächstes Paket. Bis dahin nur lesen/untersuchen, nichts umbauen.

- ✓ **F88 „Alles erledigt“-Haken fehlt:** Mörser und einige andere Einheiten bekommen nach ihrer Aktion nicht das Zeichen „alles erledigt“ (Haken), andere schon. Alle Einheitentypen prüfen (auch Geschütze, Ballon, Helden, Sanitäter, Signaltrupp …) und einen Test ergänzen.
- ✓ **F89 Mörser schauen in die falsche Richtung:** trotz F83-Fix. Vermutlich eigener Zeichenweg (Geschütz/Mannschaft) mit demselben `flip`-Fehler oder ohne Spiegelung. Startausrichtungs-Test um **alle** Typen erweitern (Mörser, Feldkanone, Geschütze, MG-Trupps, Ballon, Schreiter, Panzer, Helden).
- ✓ **F90 Panzer drehen sich bei Nahkampf-Angriff um:** Laut F76 drehen sich Panzer **nicht** zum Angreifer. Im Spiel drehen sie sich aber um, wenn sie im Nahkampf angegriffen werden (evtl. Getroffen-Spiegelung F77 bei Fahrzeugen, oder die Drehung aus F76 greift doch). Ursache finden; Fahrzeuge bleiben in ihrer Richtung.
- ✓ **F91 Töne stimmen nicht mit dem Ton-Pult überein:** Enrico hat im Ton-Pult u. a. das Löwenoger-Brüllen geändert, im Spiel kommt aber noch das alte tiefe „Low-Low-Brüllen“. Allgemein klingen manche Effekte noch nicht wie im Pult gewählt. Enricos **frischer Gesamt-Export liegt im Postfach: `tonpult_export_2026-11-22_0151.json` (52 Änderungen)** → mit den älteren Exporten zusammenführen (der neue hat Vorrang) und einbauen. Beim Löwenoger stehen darin nur: Schlag = `sword`, „Sanitäter“-Ruf = Weretiger-Brüllen (`neu2_monster_42`), Schuss = Schrot. Das tiefe „Low-Low-Brüllen“, das Enrico stört, kommt also vermutlich von einem anderen Platz (Getroffen leicht/mittel, Löwengebrüll-Sprung oder Bewegung) – herausfinden, welcher Ton das ist, und im Bericht nennen, damit Enrico im Pult gezielt tauschen kann. Zusätzlich prüfen, ob das Löwenoger-Brüllen irgendwo fest im Code statt über den Tonplatz kommt.
- **Allgemein:** Es fehlen noch etwas Effekte/Animationen; nach F88–F91 und der Prüfliste 2 eine Liste vorschlagen, wo noch Effekte/Posen/Töne fehlen (je Einheit), damit Enrico entscheiden kann.

# >>> ✓ JETZT (Enrico 18:06): F87 Einblendung der Heldenfähigkeit nicht über den Schlag legen <<<
Die neue Einblendung (F86) gefällt, liegt aber während des ganzen Schlags mitten über dem Helden und verdeckt Ausholen, Druckwelle und Treffer (siehe `entwurf/probe/f86_durchbruch.jpg`, `f86_hinrichtung.jpg`).
- **Enrico: erst Schrift, dann Schlag.** Name knallt kurz herein (ca. 0,8–1 s), blendet aus, **erst danach** beginnen Ausholen und Schlag – frei sichtbar. Auren (klein) dürfen weiter gleichzeitig laufen, aber nicht über die Figuren legen.
- Das kurze Einfrieren beim Treffer bleibt.
- Kleiner Nachtest im Headless mit neuen Bildern, kurzer Bericht mit „– pb“.

**Wichtig:** Gleichzeitig läuft eine **Fable-Prüfrunde** in einer anderen Sitzung, die nur liest und `entwurf/postfach/PRUEFLISTE2.md` schreibt. Diese Datei nicht anfassen. Nach F87 **keine weiteren Umbauten**, bis Enrico die Prüfliste 2 und seinen Spieltest gebracht hat.

# >>> JETZT (Enrico 17:03): Antworten zum Bericht „Helden“ + neue Töne <<<
**Entscheidungen:**
- **Heldenwerte: so lassen** (Preis je 110, Faust Bewegung 3 / Durchbruch 2 Runden Pause, Kürassier Bewegung 2 / Hinrichtung 3 Runden Pause, −10 Moral beim Fall). Enrico testet sie im Spieltest Runde 5.
- ✓ **Hinrichtung: Grenze von unter 30 auf unter 40 Stärke** anheben. Kurz nachsimulieren (Grauwall/Sankt Ruß, wie oft Hinrichtung, Siegquote) und im Bericht nennen.

✓ **Neue Töne in `sound-quelle/_neu/`** (Enrico 16:43–17:04, auf deine Ton-Wünsche hin) – einsortieren, Ton-Pult-Zeilen, Spiel-Standard setzen, CREDITS (Freesound-Lizenzen dieser paar Dateien bitte gleich mit nachschlagen):
- `dragon-studio-steam-hissing-386157.mp3` (1,1 s) → **Rote Faust Dampfzischen** (Durchbruch, evtl. auch kurz beim Faustschlag)
- `725109__debsound__pneumatic-airlock-door-short-019.wav` (1,4 s) → **Rote Faust** pneumatischer Kolbenstoß/Zischen (Durchbruch oder Faustschlag)
- `46487__phreaksaccount__compactor2.ogg` (1,6 s) → **Rote Faust** Kolben/Presse (Faustschlag)
- `844867__artninja__…blast_door_open_and_close…wav` (9 s) → **Enrico: das sind die SCHRITTE des Kürassiers** (schwerer Ritter-Gang). Kurze dumpfe Stampf-/Mechanik-Stücke herausschneiden und beim Ziehen des Kürassiers im Schritt-Takt abspielen (wie die schweren Schritte der Schreiter, aber zu seinem Gang passend). NICHT für die Rote Faust.
- `bubba4827-chainsaw-start-218438.mp3` (4,6 s) → **Kürassier, Enrico: Kettensäge springt an** – beim **Ausholen** (vor Querhieb und Hinrichtung), Anfang kürzen
- `freesound_community-chainsaw-92374.mp3` (12 s) → **Kürassier, Enrico: dann schlägt sie zu** – kurze Aufheul-/Schnitt-Ausschnitte für den **Treffer** von Querhieb und Hinrichtung. Ablauf also: Säge startet (Ausholen) → heult auf und schneidet (Schlag).
- `dragon-studio-armor-impact-from-sword-393843.mp3` (1,7 s) → **Kürassier** Treffer auf Rüstung (Kürassier getroffen; evtl. auch Rote Faust getroffen)
- `phatphrogstudio-rpg-m-knight-voice-attack-grunt-490291.mp3` (1,3 s) → **Kürassier** Kampfschrei/Ächzen beim Ausholen (dumpf hinter dem Helm, ggf. etwas tiefer stimmen)
- `soundreality-whoosh-vortex-243128.mp3` (8 s) → kurzer Ausschnitt als **Aura-/Furcht-Rauschen** beim Kürassier oder Wusch beim Durchbruch – nur wenn es passt
- `392618__poligonstudio__movie-horn.wav` (29 s) → **Enrico: das Horn, wenn ein Held fällt** – einen kräftigen Hornstoß-Ausschnitt (etwa 2–4 s, sauber ausblenden) als Standard für „Held gefallen“ nehmen.
**Nachtrag Enrico 17:11 – Rote Faust, so hat er es sich gedacht:**
- **NEU** `31474__dkristian__air_blast_002.wav` (1,3 s) → **Dampfstoß**, wenn die Faust Dampf ablässt (nach dem Schlag / beim Durchbruch, gern auch leise beim Ziehen ab und zu).
- `soundreality-whoosh-vortex-243128.mp3` (8 s) → **Aufladen vor dem Schlag**: kurzer ansteigender Ausschnitt beim **Ausholen** (Faust vor der Brust), endet genau, wenn der Schlag kommt. Also NICHT für den Kürassier.
- `dragon-studio-steam-hissing-386157.mp3` → Dampfzischen (wie oben).
- **NEU** `audiopapkin-big-robot-footstep-006-423600.mp3` (2,5 s) → **der Faustschlag selbst** – Enrico: „klingt wie Hydraulik, die kurz lädt, und dann ein ordentlicher Boom“. Das ist der Haupt-Treffer-Ton für Faustschlag und Durchbruch (KEIN Schritt-Ton).
- Ablauf Rote Faust also: Ausholen = Vortex-Aufladen → Schlag = Hydraulik-Boom (robot-footstep) → danach Dampfstoß (air blast) / Zischen. `725109…pneumatic-airlock` und `46487…compactor2` nur als Auswahl im Pult, falls sie nicht passen.

Ziel: Kürassier klingt nach **Kettensäge + schwerer Rüstung**, Rote Faust nach **Dampf + Kolben + schwerem Schlag**. Lautstärken angleichen. Im Pult als Auswahl, Spiel-Standard wie oben.

**Spieltest-Funde Enrico 17:18 (gleich mit erledigen, vor dem Bericht):**
- ✓ **F83 Blickrichtung beim Start falsch:** Enricos eigene Einheiten (Konkordat) im **Graben** schauen beim Start alle nach **links**, sollen aber nach **rechts** (zum Feind) schauen. Vermutlich durch einen der heutigen Umbauten (Spiegelung bei Getroffen F77, Drehen F76, Posen Runde 2 oder Helden). Ursache finden, beheben, und einen Test ergänzen, der die Startausrichtung beider Seiten prüft (auch in Graben, Ruine, Stellung).
- ✓ **F85 Einheiten lassen sich nicht mehr drehen (Enrico 17:19):** Das manuelle Drehen/Ausrichten eigener Einheiten funktioniert nicht. Hängt vermutlich mit F83 zusammen (Blickrichtung). Prüfen: Dreh-Befehl/Taste/Klick, Anzeige der Blickrichtung, ob die Richtung intern gesetzt, aber falsch gezeichnet wird. Im Partietest einen Drehbefehl ergänzen, der die neue Richtung prüft.
- ✓ **F84 Aura der Roten Faust sieht falsch aus:** Aus dem Helden „tröpfeln rote Pünktchen“ – Enrico erkennt nicht, was das sein soll (dachte an Lava). Gewollt ist eine **Ofen-Glut**: Die Funken sollen klar als **glühende Funken/Asche aus dem Ofenkern** lesbar sein – orange-gelber Kern mit weichem Glühen, flackernd, **nach oben steigend** und verlöschend (nicht nach unten tropfen, nicht als harte rote Punkte), eher wenige; dazu die dunkelrote Bodenglut als weicher Schein. Wenn die Funken gemalt besser wirken, die vorhandenen Funken-/Glut-Bilder aus `fx_funken`/`fx_feuer` verkleinert nutzen. Bildwirkung „leicht“/„aus“ beachten. Im Bericht ein Bild davon beilegen (Headless-Aufnahme), damit Enrico es vorher sieht.

- ✓ **F86 Heldenfähigkeiten brauchen einen richtigen Auftritt (Enrico 17:27):**
  - **Schrift:** Die Einblendung des Fähigkeitsnamens („Standhaft“, „Durchbruch“, „Hinrichtung“, „Furcht“ …) ist zu schlicht. Eine **coolere, große Einblendung** im Stil des Spiels: kräftige Titelschrift aus `fonts.css` (wie Titel/Startmenü), Tintenkontur, leicht schräg, kurz hereinknallend und ausblendend, Farbe je Held (Rote Faust: glühendes Rot-Orange, Kürassier: kaltes Eisweiß/Stahl), gern auf einem gemalten Banner-/Riss-Streifen aus den vorhandenen UI-Bögen. Nicht kitschig.
  - **Effekte beim Spezialschlag** deutlich wuchtiger als jetzt:
    - **Durchbruch (Rote Faust):** Dampfstoß aus der Faust beim Ausholen, Staubschleppe beim Sturm, beim Aufprall **Druckwelle/Schockring** am Boden, Erde und Trümmer (`fx_truemmer`, `fx_erdfontaene`), kurzes Bildschirmrütteln, das Ziel fliegt sichtbar ein Feld zurück, danach Dampf.
    - **Hinrichtung (Kürassier):** kurzes kaltes Aufblitzen, **Funken von der Kettensäge** (`fx_funken`), schwerer Blutstoß (`fx_blut2`), kurzer Zeitlupen-/Stillstand-Moment im Treffer, dann Lache am Boden.
    - **Auren** beim Auslösen (Standhaft/Furcht): einmal kurz sichtbar aufpulsieren (Ring am Boden), danach dezent.
  - Bildwirkung „leicht“/„aus“ beachten. Wenn für eine Druckwelle/Schockring ein gemalter Effektbogen fehlt: im Bericht sagen, dann macht Enrico ihn mit Gemini.
  - Im Bericht Headless-Bilder von beiden Spezialschlägen mitten im Effekt.

Danach Bericht mit „– pb“. Anschließend: **Spieltest Runde 5** (Enrico) und parallel eine **Fable-Prüfrunde 2** (nur prüfen) – Auftrag dafür schreibt der Berater.

# >>> DANACH (Enrico 16:20): Helden jetzt bauen <<<
Erst die drei Bilder aus dem Abschnitt direkt darunter (Panzerbüchse, Bannerträger-Pistole, fx_blut2) einbauen und kurz berichten. **Dann die Helden bauen** – Enrico hat entschieden: jetzt, damit sie im Spieltest Runde 5 schon dabei sind. Regeln stehen weiter unten unter „Für später – Helden“ (das „NICHT jetzt bauen“ gilt nicht mehr), Prompts/Aura-Beschreibung in `entwurf/HELDEN_PROMPTS.md` Abschnitt „Aura im Spiel“.

**Bilder (alle in `ui-quelle/figuren/`, Magenta, je zwei Figuren nebeneinander bzw. Porträt):**
- `konkordat_held.png` – Rote Faust. **Nur die LINKE Figur** = Grundbild (Ruhe). Rechte Figur NICHT verwenden (hat fälschlich zwei Kolbenfäuste). Den verschwommenen halben Rücken-Schnipsel in der Mitte und den rosa Fleck rechts entfernen.
- `konkordat_held_posen.png` – links: Faust vor der Brust = **Ausholen**; rechts: ausgestreckter **Faustschlag** (Nahkampf, „Durchbruch“-Aufprall).
- `konkordat_held_posen2.png` – links: **Revolverschuss** (Mündung messen); rechts: **Getroffen** (Faust als Deckung) – blickt nach LINKS, also spiegeln.
- `konkordat_held_portrait.png` – Porträt fürs Einheiten-Panel.
- `aschenwacht_held.png` – Eiserner Kürassier. Links: **Ruhe** (Grundbild), rechts: Schwert über der Schulter = **Ziehen/Marsch**.
- `aschenwacht_held_posen.png` – links: **Ausholen** über die Schulter; rechts: **Hinrichtungsschlag** nach unten. Das zweite, verblassende Schwert neben der linken Figur entfernen.
- `aschenwacht_held_posen2.png` – links: **Querhieb** (normaler Nahkampf); rechts: **Getroffen**, kniend auf das Schwert gestützt.
- `aschenwacht_held_portrait.png` – Porträt.
- Die bläulich glühenden Kettenzähne haben einen hellen Schein ins Magenta – beim Freistellen sauber, keine rosa Säume. Der Rock ist schlicht knochenweiß (ohne Streifen) – so lassen.
- Beide Helden sind **etwa 1,5-mal so groß** wie Soldaten.

**Bitte im Bericht vorschlagen** (vor dem Feinschliff, Enrico entscheidet): Preis, Stärke, Bewegung, Reichweiten, Abklingzeit der Spezialschläge, Einordnung ins F66-Dreieck (Rüstungsklasse, Waffentyp), Moralverlust, wenn er fällt. Simulation Grauwall/Sankt Ruß mit und ohne Helden. Die KI darf je einen Helden kaufen. Aura-Effekte wie in HELDEN_PROMPTS.md, dezent, Bildwirkung „leicht“/„aus“ beachten. Ton: passende vorhandene Töne wählen (Rote Faust: schwerer Schlag + Dampfzischen, Kürassier: Kettensäge-artig/Klinge, falls nichts passt, im Bericht sagen, was Enrico suchen soll).

# >>> JETZT (Enrico 15:50): Antworten zum Bericht „Posenbögen Runde 2, F82“ <<<
- **Löwengebrüll: beide.** Der **Kreuzschreiter** zeigt die Comic-Schallwellen (Ringe mit Tintenkontur, rot-gold, Staub, Rütteln, zurückzuckende Gegner) bei seiner Fähigkeit „Löwengebrüll“ – vom Kopf/Lautsprecher bzw. der Front des Schreiters ausgehend. Der **Löwenoger** brüllt weiter wie jetzt beim Sprung (kleine Fassung). Mein Fehler in F82, danke für den Hinweis.
- **Probebilder** `entwurf/probe/fig/aschenwacht_soldat_1–4.png`: **ja, mit `git checkout` zurücksetzen.** Enrico bestätigt das auch direkt im Chat.
- **Neu eingegangen (15:58): `ui-quelle/figuren/aschenwacht_panzerbuechse_posen.png` (R9)** – gleich mit einbauen. Oben links: Schütze kniend, Gewehr angelegt = **Schuss-Pose** (Mündung neu messen). Oben rechts: Schütze geht, Gewehr über der Schulter = **Ziehen** (Zweibein ausgeklappt – hinnehmen). Unten links: Schütze **Getroffen**, Gewehr rutscht weg (Gewehr ist ein eigenes Teil neben der Figur – mit zur Figur nehmen). Unten rechts: Ladeschütze **Getroffen**, Patrone fällt (Patrone gehört dazu). **Entfernen:** die schwebende rosa Geisterhand mit Patrone unten rechts neben der knienden Figur oben links. Helme sind schlicht – trotzdem auf Adler prüfen (das Grundbild `aschenwacht_panzerbuechse.png` zeigt im Original noch Adler auf den Helmen, bitte prüfen ob übermalt).
- **Neu eingegangen (16:00): `ui-quelle/figuren/aschenwacht_banner_posen3.png`** (Bannerträger, zwei Figuren nebeneinander): **nur die linke Figur** verwenden – Fahne in der linken Hand, Pistole nach rechts ausgestreckt = **Schuss-Pose** des Bannerträgers. Die rechte Figur NICHT verwenden (Stange wird nicht gehalten). Fahne ist wieder schwarz-weiß-rot → wie bei den anderen Banner-Bögen auf **aschgrau, schwarz, knochenweiß** umfärben.
- **Neu eingegangen (16:02): Effektbogen `ui-quelle/effekte/fx_blut2.png`** (schweres Blut, 3×2) – Enrico will im Nahkampf mehr Blut:
  - Obere Reihe: drei große Blutstöße in der Luft nach rechts (Fächer, lange Schlieren, kurzer schwerer Spritzer) → bei **Nahkampftreffern und schweren Treffern** gegen Weiche (Klinge, Biss, Pranke, Bajonett, Keule, Bohrstoß), in Schlagrichtung gedreht. Der alte `fx_blut` bleibt für leichte Treffer/Schüsse.
  - Untere Reihe: Bodenflecken von oben (großer Spritzer, Schleifspur, Lache) → kurz am Boden, wo eine Einheit schwer getroffen/vernichtet wurde, verblassen langsam (nicht dauerhaft zukleistern).
  - Beim Freistellen: unten Mitte (Schleifspur) hat trockene Pinselränder, die ins Rosa übergehen – sauber freistellen, keine rosa Säume.
  - Bildwirkung „leicht“ = weniger/kleiner, „aus“ = keine. Panzer, Schreiter und Fahrzeuge bluten nicht.
- Danach kurzer Bericht mit „– pb“. Dann sind alle Posen-Lücken aus Runde 2 geschlossen; anschließend ist **Spieltest Runde 5** dran (Enrico).

# Antworten von Enrico (13:25) zum Bericht „Paket G, Schritt 5“
- **Löschen: Ja.** `src/paint.js`, `src/mapimg.js`, `tools/welle_abgleich.js`, `tools/welle_fein.js` dürfen raus (Rückweg über Tag `vor-alte-karten-raus`). Gern im nächsten passenden Commit mit erledigen.
- **CREDITS für die `neu2_*`-Töne: später.** Nicht jetzt – erst, wenn Enrico etwas veröffentlichen will. In IDEEN.md oder der Prüfliste als offenen Punkt vermerken.
- Sonst weiter wie geplant: Schritt 6/7 (KI-Kaufliste läuft wohl schon) fertig machen, dann die Posenbögen Runde 2 einbauen.

# Hinweis an Claude Code (Enrico 10:29): Meldungen an den Berater immer mit „– pb“ im **allerletzten Satz** der Chat-Nachricht (siehe LIESMICH.md Regel 4). Außerdem: `magiaz-lion2-327520.mp3` (Löwenoger Getroffen leicht/mittel, siehe 4b) ist um 10:28 in `_neu/` dazugekommen – falls noch nicht drin, mit Schritt 5 nachziehen.

# Klein, gleich mit (Enrico 10:39): Sturmrollen-Aufprall ohne Klingen-„Sching“
Im Ton (Pult und Spiel) beim **Sturmrollen-Aufprall** klingt immer eine **Klinge** mit („Sching“, helle schnelle Zwischennote) – gehört nicht zu Fahrzeugen. Klingen-/Schwert-Schicht aus dem Sturmrollen-Aufprall entfernen (auch aus Gebäude rammen und allen anderen Fahrzeug-Aufprallen prüfen). Fahrzeug-Aufprall nur: dumpfer schwerer Schlag, Metall-Krachen, Kettenrasseln/-rollen. Gilt für Spiel-Standard und die Pult-Zeile.

# F82 Fähigkeits-Effekte (Enrico 11:16) – zusammen mit dem Posen-Einbau
- **Löwengebrüll (Löwenoger):** vom Maul ausgehende **Schallwellen-Ringe** im Comic-Stil (gezeichnete Bögen mit Tintenkontur, die sich ausbreiten und verblassen), Staub/Erde wird weggeblasen, Mähne flattert, kurzes rot-goldenes Glühen in Augen/Mähne, leichtes Bildschirmrütteln; Gegner im Wirkbereich zucken sichtbar (Moral-Treffer erkennbar). Passt zur F48-Kampfszene.
- **Gasschutz-Fähigkeit:** **leichter blassgrüner Dunst/Nimbus**, der um die Figuren und Füße kringelt und langsam pulsiert, kleine Dampfstöße aus den Filtern; geschützte eigene Einheiten in Reichweite bekommen einen ganz feinen Schleier, solange die Wirkung anhält.
- Dezent, gemalt, nicht kitschig; Bildwirkung „leicht“ = weniger, „aus“ = keine.

# PFLICHT-Übermalung (Berater 11:19): Aschenwacht-General Grundbild `aschenwacht_general.png`
Enthält echte Hoheitszeichen/heikle Symbole, die im Spiel nicht sein dürfen: **Eisernes Kreuz** auf der Fahnenstangen-Spitze, **Eiserne Kreuze als Orden** an der Brust, **Emblem auf der Pickelhaube**, **Totenkopf-Gürtelschnalle**, **Ärmelabzeichen**. Alles übermalen (wie bei den Adlern der Sanitäter/Melder): Fahnenspitze schlichte Lanzenspitze, Orden → schlichte runde Medaillen ohne Kreuz, Helm schlicht, Schnalle schlicht, Ärmel ohne Abzeichen. Das Ritterhelm-Emblem und die Fahne mit Ritterhelm im Kranz bleiben (eigenes Fraktionszeichen). Bitte **alle Aschenwacht-Bilder** einmal auf Eiserne Kreuze, Balkenkreuze, Adler, Totenköpfe prüfen und im Bericht auflisten.

# Posenbögen Runde 2 (Enrico/Berater, laufend) – nach Paket G einbauen
Prompts: `entwurf/POSEN_PROMPTS.md` Abschnitt „Runde 2“ (R1–R9). Eingegangene Bögen in `ui-quelle/figuren/`:
- `konkordat_reiter_posen.png` (R1, **Säbel** wie im Grundbogen – keine Lanze; Posen: Galopp mit Säbel vorn, Säbelhieb, Aufbäumen, Getroffen). Kleiner rosa Schleier am Arm unten rechts beim Freistellen entfernen. Auflösung 1928×1080 (von Enrico nachbearbeitet).
- `aschenwacht_reiter_posen.png` (R1, Sprenglanze, Hintergrund Pink wie Grundbogen): **oben rechts NICHT verwenden** (Lanze zeigt fälschlich nach hinten). Oben links = Galopp **und** Lanzenstoß, unten links = Aufbäumen, unten rechts = Getroffen.
- `aschenwacht_eingreif_posen.png` (R2): oben links Bajonett-Angriff; oben rechts Keule unten = Durchzug (mit „Keule erhoben“ aus dem Grundbogen als Ausholen zu einem Hieb verbinden); unten links Wurf Panzergranaten-Bündel; unten rechts Getroffen. **Kleinen losen Schnipsel ganz links neben dem Werfer entfernen.**
- `konkordat_pionier_posen2.png` (R3): Anlegen stehend, Anlegen kniend, geduckt vorrücken, Getroffen → Schuss-Posen für die Graben-Pioniere.
- `aschenwacht_pionier_posen2.png` (R3, Drahtpioniere): Anlegen stehend, Anlegen kniend, geduckt vorrücken, **Nahkampf-Vorstoß mit Gewehr** (Gewehrspitze rechts am Bildrand abgeschnitten – hinnehmen). Konkordat-Pioniere: für Nahkampf die Schaufel-Pose aus dem ersten Bogen nehmen.
- `aschenwacht_eiserne_huenen_posen.png` (R4): Hüftfeuer, Sturmlauf, halb kniend abgestützt, Getroffen mit erhobenem Hackmesser (auch als Hieb-Pose nutzbar). Mündungspunkte (F47) für die neuen Posen neu messen.
- `konkordat_loewenoger_posen.png` (R5): Sprung mit Krallen, Prankenhieb, Schrotschuss angelegt, Getroffen brüllend. Mündungspunkt Schrot neu messen.
- `aschenwacht_gasschutz_posen.png` (R6): **kein 2×2-Raster**, Figuren frei verteilt – einzeln ausschneiden (Zusammenhangs-Flächen statt Raster). **Linke Figur (Gewehr stehend) ist ~30 % größer** als die anderen – auf gleiche Soldatenhöhe bringen. Posen: Gewehr stehend (Sprüher hängt am Gürtel), Sprühen, Gewehr kniend, Getroffen.
- `konkordat_general_posen.png` (R7): **nur die untere Reihe** verwenden (Pistolenschuss, Getroffen) – oben sind die Figuren unten abgeschnitten. `konkordat_general_posen2.png` (2 Figuren nebeneinander): Säbel erhoben/brüllend, mit Stab zeigend. Nur der General posiert; den **Fahnenträger aus dem Grundbild** dahinter setzen (wie im Grundbild).
- `aschenwacht_general_posen.png` (R7, 2 Figuren nebeneinander): Säbel erhoben/brüllend, mit Hand zeigend. **Pflicht-Übermalung: kleine Totenköpfe an den Schulterkordeln (beide Figuren) entfernen.** Säbelspitze links oben abgeschnitten – hinnehmen. Fahnenträger aus dem (übermalten) Grundbild dahinter setzen.
- `aschenwacht_general_posen2.png` (R7, 2 Figuren): Pistolenschuss, Getroffen. Kreuze/Adler/Totenkopf-Schnalle sind hier schon entfernt; **kleine runde Knöpfe an den Schulterkordeln prüfen und ggf. als schlichte Knöpfe übermalen**.
Einbauen erst, wenn Enrico „Posen fertig“ meldet (Liste wächst hier), dann alle zusammen schneiden, Plastik-Karten, POSE_SETS/POSE_TYPEN, Getroffen-Richtung (F77) prüfen.
- `aschenwacht_banner_posen.png` (R8, 2 Figuren): Fahne hoch rufend, Stange in den Boden rammen. Helm schlicht, Fahne mit Ritterhelm bleibt.
- `aschenwacht_banner_posen2.png` (R8): **nur die rechte Figur** verwenden (Getroffen, Fahne gehalten). Die linke ist fehlerhaft (Fahne schwebt ohne Stange) – nicht verwenden; Pistolen-Pose folgt evtl. später.
**Stand 11:32 (Gemini-Limit für heute erreicht):** Fertig sind R1–R8 (Reiter beide, Eingreiftrupp, Pioniere beide, Hünen, Löwenoger, Gasschutz, Generäle beide, Bannerträger). **Offen für später:** R9 Panzerbüchse, Bannerträger-Pistole. → **Nach Paket G die vorhandenen Bögen schon einbauen** (nicht auf den Rest warten), inkl. F82-Effekte, Pflicht-Übermalungen (General, alle Aschenwacht-Bilder prüfen) und Mündungspunkte für die neuen Schuss-Posen.

# >>> JETZT: Paket G – Prüfliste abarbeiten (Enrico 2026-11-21 09:40) <<<
Grundlage: `entwurf/postfach/PRUEFLISTE.md` (Prüfrunde Fable). Modell wieder **Opus**. Jeder Schritt einzeln committen und pushen; nach jeder Regeländerung Simulation Grauwall + Sankt Ruß (je 200).

**Enricos Entscheidungen:**
- **1.5/5.5 Alte Karten: JETZT RAUS.** Nur noch Grauwall und Sankt Ruß spielbar. Vorher Git-Tag `vor-alte-karten-raus` setzen (Rückweg). Dann: die 7 alten Karten aus MAPS/Kartenwahl, `mapimg.js` raus, alte flache Ansicht ausbauen (`VIEW.tilt()`-Abfragen, `OPT.tilt`, `renderPainted`, `renderImageMap`, alte Zeichenpfade), Welle/Nachschub-Code nur entfernen, wenn ihn keine der zwei Karten nutzt; `art.js`/`fx.js` auf das reduzieren, was als Ersatz noch wirklich gebraucht wird (Liste im Bericht). Regeln-Fenster 2.11 entsprechend. Sims, Tests und Ton-Pult/Tonprobe danach lauffähig halten. Größe vorher/nachher im Bericht.
- **2.4 Kreuzschreiter:** gewollt als **Panzerjäger** – nur Text ergänzen (Löwenmaul/Unterarm panzerbrechend: Panzer ×1,5, Fußtruppen ×0,5; gegen Infanterie stark im Nahkampf).
- **2.20 Sturmrollen gleich dämpfen:** Pause **3** statt 2 Runden **und** KI rollt nur, wenn der erwartete Schaden > Schuss × 1,3. Nutzung je Schlacht vorher/nachher + Simulation.
- **4.7 MG drehen:** **so lassen** (MG-Trupps drehen sich wie Fußtruppen).

**Reihenfolge:**
1. **Texte** 2.1–2.3, 2.5–2.10, 2.12–2.13 (am besten aus `E.faktor`/Werten erzeugen), **2.14** Nahkampf-Knopf bei Landkoloss/Sturmpanzer weg → Sturmrollen an seine Stelle, **2.15** Zugvorschau mit Fähigkeiten-Symbol, **2.16** `einschlagArt` über `E.faktor`, **2.25** `sapper` aus `nahKaempfer`.
2. **Entscheidungen oben** (2.4, 2.20).
3. **Ton** 3.1 (Enfield `lvl` ~−15 + `bass: 3`), 3.2 (Abpraller lauter), 3.3 (Treffer weich `lvl` −14), 3.4 (kein Doppelton vorbei+Einschlag), 3.5 (abgehackte Enden, `pistol` aus Walther), 3.7 (Schritte +4–6 dB). Schlüssel/Namen nicht ändern (Enricos Ton-Pult-Auswahl!). Dazu **2.17 jetzt schon**: Ton-Pult-Zeilen für **Sturmrollen** (Anlauf/Kettenrollen + Aufprall), **Gebäude rammen** (Aufprall + Einsturz), **Panzergranate** (Wurf + Explosion am Panzer), **Bohrstoß**, **Ballon** (Winde), **Flammenschleife** – Enrico will diese Töne selbst auswählen. Danach „Ton-Pult neu – pb“ melden.
   **Neue Töne in `sound-quelle/_neu/` (Enrico 09:46):** `826230__artninja__bassy_rock_impact_sounds_09112025.wav` (Mehrfach-Datei – in Einzeltöne teilen; Enricos Idee: **Panzer rammt Gebäude** / schwerer Aufprall Sturmrollen) und `185244__deleted_user_3277771__big-crash.wav` (Einsturz/Crash). Als Auswahl ins Ton-Pult (Gruppen Einschläge/Aufprall), Vorschlag für „Gebäude rammen“ und „Einsturz“; CREDITS (Freesound, Lizenz prüfen und nennen).
   **Weitere neue Töne in `sound-quelle/_neu/` (Enrico 10:01) – „bestialischer Nahkampf“** (vor allem **Löwenoger**, später Dämonen/Monster; gehört zu Paket G Schritt 3): `dffdv-tiger-attack-195840.mp3`, `423010__ogsoundfx__monster-bite-on-armor-wav.wav` (evtl. schon in `Monster/` – bitgleich → `_neu_doppelt/`), `ragecore29-sword-stabbing-flesh-with-splatter-1-3x-588319.mp3` (3 Einzeltöne), `ragecore29-axe-hit-head-beheaded-548103.mp3` (evtl. schon in `Melee hit infantry/`), `ragecore29-htf-blood-splatter-explode-478992.mp3` (Blut/Gore, z. B. schwerer Treffer, Vernichtung), `freesound_community-spade-hacking-sound-with-gore-effects-96909.mp3` (Schaufel/Spaten im Nahkampf, Grabenräumer/Sturmtrupps). Einsortieren, als Auswahl ins Ton-Pult (eigene Gruppe **„Bestien-Nahkampf“** und „Gore-Treffer“), **Neu (Enrico 10:26): `magiaz-lion2-327520.mp3` in `_neu/` = Löwenoger „Getroffen“ bei leichtem bis mittlerem Treffer** (als Standard setzen; schwere Treffer weiter mit dem bisherigen/kräftigeren Ton). **Enricos Wahl (10:09): Löwenoger-Nahkampf = Tiger-Attacke + „sword stabbing flesh“ (Fleisch-Treffer); gegen Gepanzerte „monster bite on armor“.** So als Standard setzen, im Pult änderbar. Die Robotic-Monster-Brüller von gestern bleiben Vorschlag für große Maschinen (Eisenknecht, Schreiter). CREDITS nachtragen.
   **Noch ein neuer Ton (Enrico 10:08):** `freesound_community-hotairbaloontorch-60586.mp3` – Ballon-Brenner/Fauchen; als Auswahl für den **Fesselballon** (Aufsteigen) ins Pult, CREDITS.
   **WICHTIG Ton-Pult-Exporte zusammenführen (Berater 10:06):** Im Export 10:02 (`tonpult_export_1002_2026-11-21.json`) **fehlen 13 Einträge**, die Enrico um 09:09 gewählt hatte (vermutlich durch den Pult-Umbau verloren, nicht absichtlich – Enrico bestätigt: die Auswahl von 09:09 soll bleiben): Hünen Schuss `k:neu_mg_schwer_1`, Grabengeschütz Abschuss `k:kolosskanone_2`, Panzerknechte Schuss `k:semi`, Sturmpanzer Bord-MG `p:neu_mg_schwer`, Klauenschreiter Drehlauf `k:neu2_autokanone_2`, Hauptmann/General Konkordat `k:pistol_2`, Scharfschütze `k:sniper_2`, Löwenoger Schuss `k:neu_schrot_2`, Turmschreiter `k:neu_kanone_1`, Ordensschreiter Schlag `k:heavy3`, Kreuzschreiter Kanone `k:neu_kanone_3` + Unterarm `k:neu_kanone_1`. Beim Einbau: **alle Exporte zusammenführen, neuester Eintrag je (Einheit, Platz) gewinnt, fehlende aus älteren Exporten übernehmen.** Prüfen, warum der Pult-Umbau gespeicherte Auswahl verliert (Platz-IDs/Schlüssel geändert?) und das verhindern; wenn möglich Enricos localStorage beim nächsten Pult-Start aus diesem Zusammenschluss wiederherstellen (Import-Datei `tonpult_zusammen.json` ins Postfach legen, Enrico lädt sie über „Import“).
   **Ton-Pult-Exporte von Enrico liegen im Postfach:** `tonpult_export_aschenwacht_2026-11-21.json` (29) und `tonpult_export_beide_schuesse_2026-11-21.json` (38, neuer Stand, enthält den ersten). Noch **nicht einbauen** – Enrico macht noch Nahkampf usw.; eingebaut wird der letzte, vollständige Export.
4. **Tests** 5.2 (P-Konstanten/NaN-Test, vor jedem Regel-Commit), 5.1 (`tools/test_ki_partie.mjs`), 5.8, 5.9.
4b. **JETZT als Nächstes (vor Schritt 5): Ton-Nachträge zu Schritt 3** – alles, was unter Schritt 3 nach 09:44 ergänzt wurde: (a) Ton-Pult-Zeilen für Sturmrollen, Gebäude rammen, Panzergranate, Bohrstoß, Ballon, Flammenschleife; (b) die **9 neuen Töne in `sound-quelle/_neu/`** einsortieren und als Auswahl ins Pult (Bestien-Nahkampf, Gore-Treffer, Aufprall/Einsturz, Ballon-Brenner) inkl. Enricos Löwenoger-Wahl und CREDITS; (c) **Exporte zusammenführen** und `tonpult_zusammen.json` zum Import ins Postfach; Ursache des Auswahl-Verlusts beheben. Danach „Ton-Pult neu – pb“ melden, dann Schritt 5.
5. **Alte Karten raus** (siehe oben) + 5.3, 5.4, 5.6, 1.6.
6. **Leistung** 1.7 (Audio erst beim ersten Abspielen anlegen), 1.3 (Schlachtmusik 96 kbit/s), **1.2 erst nach Enricos vollständigem Ton-Pult-Export** (Auswahl-Töne in `sound_pult.js`).
7. **KI** 2.21 (Auslöser „Halten um jeden Preis“), 2.23 (Kaufliste nach Lage, auch Ballon, Mineure, Löwenoger, Hünen, Schildwall usw.), danach Ballon/Mineure gezielt simulieren und Nutzung zählen.
**Später, nicht jetzt:** 4.1 Mündungen nachmessen, 4.2, 4.4 Posen-Lücken (Berater schreibt Gemini-Prompts), 4.3 Hünen-Größe (Enrico schaut im Spiel), 4.5.
Bericht nach Schritt 3 und am Ende; im Chat jeweils „pb“.

# >>> ZUERST (Enrico 2026-11-21 00:15, vor allem anderen): F67 – fehlende Töne ins Ton-Pult <<<
Enrico sitzt gerade am **Ton-Pult** und vermisst Töne, die er früher in `sound-quelle/` gelegt hat. Abgleich des Beraters: **88 Tondateien in `sound-quelle/` stehen nirgends in `tools/sound_bau.json`** (ohne `aus_spiel/`, `_neu_doppelt/` und die rohen eigenen Aufnahmen `Voices/eigene/*.wav`, die über `sprueche/` drin sind). Bitte:
1. Alle unten gelisteten Dateien prüfen (gegenhören/Pegel), brauchbare Ausschnitte (lange Dateien schneiden, Mehrfach-Dateien in Einzeltöne teilen) in `sound_bau.json` aufnehmen – als **„Einzelne Töne“ wählbar im Ton-Pult**, in passenden Gruppen. Bestehende Zuordnungen im Spiel **nicht** ändern. Monster-Töne als eigene Gruppe „Monster (später Dämonen)“.
2. Wichtig: **Gewehre** aus `Infantry Guns` (u. a. `battle-rifle`, `m1-garand`, `Rifle Fire Sound Effect`) – vermutlich Enricos „früher bessere Gewehrtöne“; mit sauberem Anschnitt und **vollem Nachhall** (siehe 2c).
3. Wirklich Unbrauchbares nicht einbauen, aber im Bericht mit Grund nennen. Nichts löschen.
4. `sound_bau.mjs`, `tonpult_bau.mjs`, Tonprobe, Spiel neu bauen, committen, pushen; Sicherung sound-quelle (robocopy).
5. Im Chat **sofort** melden „Ton-Pult neu – pb“ (Enrico wartet darauf, um weiterzumachen), dann mit dem Rest weiter. Enricos bisherige Ton-Pult-Auswahl liegt in seinem Browser (localStorage) und darf durch den Neubau nicht verloren gehen – Schlüssel/Namen der vorhandenen Töne nicht umbenennen.

6. **Ton-Pult freier machen (Enrico 00:34, gehört zu F67, gleich mit erledigen):** Heute bietet „Einzelne Töne“ nur Töne **derselben Gruppe** an – zu starr. Beispiel: Der **Eisenknecht** hat keine riesige Kanone, eher eine **Autokanone**, aber im Pult stehen für seinen Schuss nur Kanonen. Neu: In jeder Zeile zusätzlich **„Alle Töne“** wählbar – nach Gruppen geordnet (Gewehre, MG/Autokanonen, Kanonen, Einschläge, Nahkampf, Stimmen, Motoren, Monster …) und mit **Suchfeld** (Name/Datei). Wählt Enrico einen Ton aus einer fremden Gruppe, bekommt die Einheit beim Einbau des Exports einen **eigenen Platz** (wie im Hinweis „klingt auch bei“ beschrieben) – andere Einheiten ändern sich nicht. Gleich mit: für den Eisenknecht passende Autokanonen-Kandidaten (schnelle schwere Schüsse, z. B. aus `Hevay Mech guns`, `Heavy firing sounds`, `freesound_community-066496_heavy-machine-gun-50-caliber`) im Pult bereitstellen. Enricos bisherige Auswahl (localStorage) muss erhalten bleiben.

7. **Standard-Optionen (Enrico 00:41, klein, gleich mit):** **Bildwirkung „stark“** und **Tempo 0,5×** als feste Standardeinstellung. Einmalig auch bei Enrico setzen (alte gespeicherte Werte überschreiben, wie bei F1), danach bleibt seine eigene Wahl erhalten.

8. **Armee-Auswahl: Tooltip verdeckt die Auswahl (Enrico 00:43, klein, gleich mit):** Beim Überfahren einer Einheit in der Armee-Zusammenstellung erscheint das Info-Feld oben und **verdeckt genau die Anzeige, was schon ausgewählt ist**. Neu: Info-Feld **direkt neben der überfahrenen Einheit** (rechts daneben, bei zu wenig Platz links oder darüber), nie über der Auswahl-Übersicht. Grundsatz: Infos dort zeigen, wo man gerade hinschaut – nicht quer über den Bildschirm. Gleich prüfen, ob andere Tooltips (Aufstellung, Nachschub, Panel) dasselbe Problem haben. Screenshot in den Bericht.

9. **Fehler Musikregler (Enrico 00:57, klein, gleich mit):** Musik im Spiel auf 0 gestellt – die **Musik im Startbildschirm läuft trotzdem weiter**. Der Musikregler (`arm.musikvol`) muss überall gelten: Startbildschirm, Armee-Auswahl, Aufstellung, Auswertung, Schlacht – sofort beim Ändern, auch beim Zurückkehren ins Menü. Gleich prüfen, ob der Effekte-Regler und „Ton aus“ (Taste M) ebenfalls überall greifen.
   **Nachtrag 01:04:** Auch **im Spiel selbst** greift es nicht: Musik/Ton ausgestellt → das laufende Lied spielt weiter. Laufende Musik muss beim Ändern sofort leiser/stumm werden (auch gerade spielende Stücke und Überblendungen in `setMusik`).
10. **F71 Pulverdampf (Enrico 01:04, Effekte):** Nach Schüssen etwas **Pulverdampf**, der durch die Luft schwebt – an der Mündung entstehend, langsam aufsteigend/seitlich treibend, **eher transparent**, nach 2–3 s ausgeblendet, **Größe passend zur Waffe** (Gewehr klein, MG mehrere kleine Wölkchen, Geschütz/Panzerkanone größer). Gemalter Comic-Stil, dezent; darf nicht verdecken und Leistung nicht drücken (Anzahl begrenzen). Bildwirkung „schwach“ = weniger/aus.
11. **F72 Infanterie-Beschuss mit mehr Druck (Enrico 01:07):** Nahkampf ist jetzt „richtig gut“. Aber der **Beschuss der normalen Infanterie ballert nicht** – soll mehr Wucht haben. Vorschlag: Gewehrsalve lauter und mit etwas mehr Bass/Knall (Pegel gegenüber MG/Kanone prüfen), dichter gestaffelte Schüsse, kräftigeres Mündungsfeuer, Staub-/Erdspritzer und Querschläger rund um das Ziel, kleiner Ruck/Zusammenzucken der getroffenen Figuren, beim Treffer mit hoher Schadensstufe ein leichtes Bildschirmrütteln. **Blut bei Beschuss (F64 Punkt 3)** ist laut Liste erledigt, wirkt bei Enrico aber noch zu wenig – sichtbar kräftiger machen (Comic-Stil, Grimdark). Vorher/Nachher im Bericht.
12. **F73 Schreiter/Mechs animieren – per Code (Enrico 01:10):** Schreiter, Kolosse, Eisenknecht, Säge-/Klauen-/Turm-/Kreuzschreiter, Bohrkoloss haben noch keine Animation. Jetzt **ohne neue Bilder, per Code**: stampfendes Wippen und leichtes Neigen beim Gehen im Schritttakt, bei jedem Schritt Staub und leichtes Bodenbeben (große Maschinen stärker), Rückstoß beim Schuss (Zweitwaffe kleiner), im Nahkampf Ausholen-Ruck und Vorstoß (Säge/Klaue/Hackklinge), Wanken bei Treffern, Absacken bei Panne. Passt zu F48/F63 (Kampfszene). Schritt-Töne mit dem Takt koppeln. **Später** (nicht jetzt): Posenbögen mit Gemini für die wichtigsten Schreiter – Berater schreibt die Prompts.
13. **F74 Scharfschützen-Schüsse = Anzahl Figuren (Enrico 01:09):** Scharfschützen/Pirschjäger geben **genau so viele Schüsse ab, wie Figuren im Trupp stehen** – je Figur ein Schuss, deutlich nacheinander („pam … pam“, ~0,4–0,6 s Abstand). Steht nur noch einer, fällt nur **ein** Schuss (heute fallen auch dann 2). Gleich prüfen, ob die Schusszahl bei allen Einheiten zur Zahl der lebenden Figuren passt (verlorene Figuren schießen nicht mehr mit).
14. **F75 Flammenwerfer: längerer Feuerstoß, Ton = Strahl (Enrico 01:21):** Beim Konkordat-Flammentrupp (Aschenwacht-Brandwerfer und Bohrkoloss-Flammenstoß mitprüfen) kommen heute zwei ganz kurze Feuerstöße. Ein Flammenwerfer feuert aber einen **längeren Stoß** (z. B. 1,2–1,8 s). Bild und Ton müssen **genau zusammenpassen**: Ton startet mit dem Strahl, hält so lange wie der Feuerstrahl sichtbar ist und klingt mit ihm aus (Zischen/Fauchen, Ende mit kurzem Nachbrennen). Ein Stoß je Figur bzw. ein gemeinsamer Stoß – im Bericht sagen, was gewählt wurde.
15. **F76 Nahkampf von hinten: Verteidiger dreht sich um (Enrico 01:47):** Wird eine Einheit von hinten/der Flanke im Nahkampf angegriffen, **dreht sie sich nicht zum Angreifer** – wirkt komisch. In der Kampfszene sollen sich die Figuren zum Angreifer wenden (Regel: Flankenbonus des Angreifers bleibt für diesen Angriff bestehen; ob die Einheit danach dem Angreifer zugewandt bleibt, als Vorschlag im Bericht – Achtung Fahrzeuge/Schreiter mit Drehkosten).
16. **F77 Getroffen-Richtung falsch (Enrico 01:47):** Beim **Stahlgänger-Trupp** (Konkordat-Kampfanzüge) kippen die Getroffen-Figuren **zum Feind hin**, als ließen sie sich auf ihn fallen – richtig ist **vom Angreifer weg** (weggestoßen). Getroffen-Pose und Rückstoß-Richtung immer vom Angreifer weg ausrichten (ggf. Pose spiegeln). **Bei allen Einheiten mit Getroffen-Pose prüfen**, auch Aschenwacht-Panzerknechte und Hünen.
17. **F78 Mineure: Sprengladung begrenzen (Enrico 01:48, Regel):** Die Sprengladung der Mineure (Konkordat, Sprengen/Unterminieren) macht sehr viel Schaden. Begrenzen auf **3 Einsätze je Schlacht** (je Mineur-Trupp; falls es mehrere Trupps gibt, im Bericht sagen, ob je Trupp oder je Armee sinnvoller ist). Zähler am Knopf und im Panel anzeigen („Ladungen 2/3“), KI beachtet die Grenze. Simulation Grauwall + Sankt Ruß; wenn weiter zu stark, Vorschlag 2 Einsätze.
18. **F79 Panzer/Schreiter und Gebäude (Enrico 01:53, Regel, Wahl „gemischt“):**
   - **Intakte Häuser, Kirche, große Gebäude:** für Fahrzeuge, Kolosse und Schreiter **nicht betretbar**, aber **rammbar** (Aktion): Gebäude nimmt Bauschaden (wie `kircheTreffer`, bis zum Einsturz → Ruine), der Panzer/Schreiter nimmt selbst etwas Schaden und hat Pannengefahr, Truppen im Gebäude werden niedergehalten. Passt zu Sturmrollen (F54).
   - **Ruinen/Trümmer** (auch eingestürzte Gebäude): befahrbar, aber **kostet alle restliche Bewegung** und hat **Pannengefahr** (wie Schlamm). Schreiter genauso (stapfen durch Trümmer).
   - Zug-Vorschau (F60) und Feld-Hinweis zeigen das; KI berücksichtigt es. Werte als Vorschlag, Simulation Grauwall + Sankt Ruß. Animation: Rammen mit Staub, Mauerbrocken, Einsturz-Ton.

Dateien:
  - `Airplanes/568974__trp__201111-ww1-bi-plane-flying-around-close-distant-helicopter-roof-11am.flac`
  - `Airplanes/cryptowista-airplane-jet-take-off-121957.mp3`
  - `Airplanes/u_lbl9t264ov-jet-sound-militar-185708.mp3`
  - `Animals/dragon-studio-dog-barking-406629.mp3`
  - `Buttons/677861__el_boss__ui-button-click.wav`
  - `Crash vehicle damage/509015__audiopapkin__mechanical-sfx_m019.wav`
  - `Crash vehicle damage/510084__audiopapkin__impact-sfx-011.wav`
  - `Crash vehicle damage/511911__audiopapkin__impact-sfx-022.wav`
  - `Crash vehicle damage/511914__audiopapkin__impact-sfx-025.wav`
  - `Crash vehicle damage/712881__audiopapkin__factory-machine-011.wav`
  - `Crash vehicle damage/dragon-studio-car-crash-sound-effect-376874.mp3`
  - `Eroberungspunkte/Win Point.wav`
  - `Explosion/tanweraman-cracker-sound-261119.mp3`
  - `Fire/17548__dynamicell__fire_forest_inferno.aiff`
  - `Fire/612277__robinhood76__10835-big-fire-loop.wav`
  - `Footsteps robot mud marching/daviddumaisaudio-robot-heavy-mechanical-footsteps-194039.mp3`
  - `Footsteps robot mud marching/freesound_community-steps-on-snow-30305.mp3`
  - `Gas smoke/536603__hoggington__pain-sound-in-mask.wav`
  - `Heavy Meelee Mechs large/yodguard-a-massive-axe-impact-hitting-metal-3-450254.mp3`
  - `Impacts/116645__woodingp__bullets-hit-edit.aiff`
  - `Impacts/dragon-studio-elemental-spell-impact-earth-478382.mp3`
  - `Impacts/freesound_community-metal-impact-39652.mp3`
  - `Impacts/lordsonny-small-rock-break-194553.mp3`
  - `Infantry Guns/397370__jgrzinich__forest-gun-shots-and-gunfire.wav`
  - `Infantry Guns/foisal72-gun-fire-346766.mp3`
  - `Infantry Guns/freesound_community-battle-rifle-42734.mp3`
  - `Infantry Guns/freesound_community-m1-garand-rifle-80192.mp3`
  - `Infantry Guns/gutierrreztom-walther-p38-firing-sound-effect-11651.mp3`
  - `Infantry Guns/Rifle Fire Sound Effect.mp3`
  - `Kanone schwer/Heavy_Gun_shells.mp3`
  - `Kanone schwer/Tank_SiteGuns_.mp3`
  - `Melee hit infantry/freesound_community-shield-guard-6963.mp3`
  - `Melee hit infantry/ragecore29-axe-hit-head-beheaded-548103.mp3`
  - `Melee hit infantry/universfield-human-roar-250239.mp3`
  - `Melee hit infantry/universfield-punch-04-383965.mp3`
  - `Melee hit infantry/universfield-punch-140236.mp3`
  - `Melee hit infantry/universfield-punch-impact-hit-567196.mp3`
  - `Monster/155973__mrpokephile__zombie-flesh-bites.mp3`
  - `Monster/185649__headphaze__demon-monster-voice.wav`
  - `Monster/260777__deleted_user_3424813__angry-dog-bark-snarl-with-reverb.wav`
  - `Monster/316393__littlerobotsoundfactory__demon_18.wav`
  - `Monster/320109__smokevhstapes__horror-sfx-3.wav`
  - `Monster/339191__shillsuqat__chewing-zombie_wav.wav`
  - `Monster/423010__ogsoundfx__monster-bite-on-armor-wav.wav`
  - `Monster/467701__lucasduff__monster-bite.wav`
  - `Monster/479380__breviceps__dragon-several-roars-growls-and-snarls.wav`
  - `Monster/547129__szegvari__parrot-bird-creature.wav`
  - `Monster/556701__nachtmahrtv__ghost-monster-scream.wav`
  - `Monster/60992__ifartinurgeneraldirection__pooh-bear-attacks-me-for-a-treat.mp3`
  - `Monster/614068__stormwaveaudio__demon-pain-1.wav`
  - `Monster/617543__teomat23__witch-attack.mp3`
  - `Monster/674223__silverillusionist__acid-breath-attack.wav`
  - `Monster/753850__evanboyerman__monster-growl-1.wav`
  - `Monster/797717__colinleblancsound__warhorn-c3.wav`
  - `Monster/808363__grayepic__pig-zombies.mp3`
  - `Monster/871255__audiomirage__when-the-rain-remembers.wav`
  - `Monster/871498__csstudios__melee_secondary_attack.wav`
  - `Monster/871814__oddlakepro__large-theropod-dinosaur-noise-human-noises-edited.mp3`
  - `Monster/875026__mickrvfy__creature-sounds.wav`
  - `Monster/875757__tommasomotteran__giant-tree-creature-movement-fantasy-monster-sfx.wav`
  - `Monster/878576__artninja__creature_or_zombie_footstep_11032026.wav`
  - `Monster/freesound_community-four_voices_whispering_2_wecho-6755.mp3`
  - `Monster/freesound_community-schizophrenic-voices-62486.mp3`
  - `Monster/freesound_community-sisters-voices-103432.mp3`
  - `Monster/freesound_community-snarlwav-14497.mp3`
  - `Monster/freesound_community-tripod-106078.mp3`
  - `Monster/the-vampires-monster-weretiger-yarik-roar-with-growler-325163.mp3`
  - `Monster/u_20gsgfof6e-the-prowler-332986.mp3`
  - `Musiker/370271__ignacioasmp__nicol-singing-seven-nation-army.wav`
  - `Musiker/704440__roemergruft__viking-horn-in-d.wav`
  - `Musiker/744062__xloenp__heroic-war-march-symphony-loop-2.flac`
  - `Pain death/universfield-blood-splatter-122253.mp3`
  - `Repair reload heal etc/yodguard-locked-door-4-540180.mp3`
  - `Sankt Russ/86322__roccapl__bologna_asinelli_tower_collapse.aiff`
  - `Voices/271631__carmsie__feel-free-to-scream.wav`
  - `Voices/338147__artordie__talking-to-me.wav`
  - `Voices/402019__theuncertainman__yes-british-male.wav`
  - `Voices/405328__drotzruhn__woman-fighting.wav`
  - `Voices/439287__dreamstobecome__battle-laugh.wav`
  - `Voices/529837__airborne80__aint-nothin-like-a-war.mp3`
  - `Voices/639447__laurenponder__communication-voicelines-woman.wav`
  - `Voices/764267__shangusburger__crwdbatl_crowd-yells-charge-continues_shanevincent_gsc24_spacedomni-mk012.wav`
  - `Voices/applehillstudios-combat-voice-forward-march-543679.mp3`
  - `Voices/applehillstudios-combat-voice-stand-your-ground-1-543681.mp3`
  - `Voices/applehillstudios-hurt-amp-death-i-need-a-medic-543678.mp3`
  - `Voices/phatphrogstudio-robot-voice-damage-sustained-487076.mp3`
  - `Voices/universfield-come-on-man-323595.mp3`
  - `Water/freesound_community-swim-44183.mp3`

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
  2b. **Einschlag nach dem ZIEL, nicht nach dem Schützen (Enrico 2026-11-21):** Heute ist der Einschlag-Ton im Ton-Pult je schießender Einheit fest – manche metallisch, manche nicht. Richtig ist: **weiches Ziel** (Infanterie, Reiter, Bedienungen) → dumpfer Körper-/Erdtreffer, nie metallisch; **gepanzertes Ziel** → metallisch, und zwar abhängig davon, ob die Waffe **dagegen wirkt** (F66): wirksam (panzerbrechend, ×1 oder ×1,5) → schwerer Metall-Durchschlag/Krachen; kaum wirksam (×0,5, z. B. Gewehr gegen Panzer) → heller **Abpraller/Querschläger** („Pling“). Im Ton-Pult die Zeile „Einschlag“ entsprechend aufteilen (z. B. „Einschlag weich“, „Einschlag Panzer wirksam“, „Einschlag Panzer Abpraller“) oder global regeln – Vorschlag im Bericht. Enricos bisherige Ton-Pult-Wahl für „Einschlag“ gilt als Ton für weiche Ziele. **Ausdrücklich für ALLE Einheiten und ALLE Waffen** (Gewehr, MG, Schrot, Panzerbüchse, Kanonen, Zweitwaffen, Granaten/Splitter, Nahkampf gegen Panzer, Sturmrollen F54, Lauerschüsse F56) – Enrico ist wichtig, dass es durchgehend stimmig ist, auch wenn es viel Arbeit ist. Am Ende eine Prüfliste im Bericht: jede Waffe × weich / Panzer wirksam / Panzer Abpraller → welcher Ton.
  2c. **Ton-Pult-Sitzung Enrico (2026-11-21, läuft):** Aschengrenadiere Schuss → **„Rifle 3“** (Enricos Wahl im Ton-Pult). Der Ton **bricht zu früh ab** – der leichte Nachhall fehlt. Ausschnitt in `sound_bau.json` verlängern bzw. weicher und später ausblenden (`fo`), sodass der Hall natürlich ausklingt. Dabei **alle Schusstöne** auf abgehackte Enden prüfen und genauso behandeln. Der vollständige Ton-Pult-Export von Enrico folgt.
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

- **F70 (neu, Enrico 2026-11-21, Regel Paket E, zusammen mit F66): Ballonbeobachter auf- und abbauen.** Idee: **Sichtweite etwas kürzer** als heute, dafür kann der Ballon **eingeholt/zusammengepackt** werden, **weiterrollen** und wieder **aufsteigen/auspacken** – wie MG auf-/abbauen bzw. Geschütz auf-/abprotzen. Vorschlag mit Zahlen im Bericht (z. B. aufgestiegen: Sicht und „Ziel markieren“, zieht nicht; eingeholt: zieht normal, keine Fernsicht; Aufsteigen/Einholen kostet BP/Aktion wie MG). Animation: Ballon sinkt/steigt am Seil, Ton Seilwinde/Ratsche. KI muss damit umgehen. Bis zur Bestätigung durch Enrico nicht bauen.

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

## Für später – NICHT jetzt bauen: Helden (Enrico 2026-11-21)
Nur in `IDEEN.md` übernehmen (Abschnitt „Helden“), bauen erst nach Paket E und F66.
- Je Fraktion **ein Held**: Einzelmodell, höchstens einer je Armee, teuer (unter Stufe-3-Schreiter), kein Panzer; drei Merkmale: **Aura**, **Spezialschlag** mit Abklingzeit, **klare Schwäche**. Fällt er, Moralverlust der eigenen Seite. Spielt die F48-Kampfszene. Soll einen Unterschied machen, aber keine Schlacht allein drehen.
- **Konkordat – „Die Rote Faust“:** Oberst im Kampfanzug mit dampfgetriebener Schlagfaust. Spezial „Durchbruch“: stürmt bis 2 Felder in eine Einheit, schleudert sie ein Feld zurück. Aura: Nachbarn verlieren unter Beschuss weniger Moral. Schwäche: kaum Fernkampf (nur Pistole).
- **Aschenwacht – „Der Eiserne Kürassier“:** riesiger gepanzerter Ritter mit Kettenklinge (Spitzhelm schlicht, keine Abzeichen). Spezial „Hinrichtung“: angeschlagene Einheit (unter 30 %) im Nahkampf sofort vernichtet. Aura: Furcht (Gegner in der Nähe verlieren Moral). Schwäche: langsam, bleibt in Schlamm/Graben stecken.
- Werte und Einordnung ins Dreieck (F66) später vorschlagen; Bilder macht Enrico mit Gemini.

### Für später – Wer darf Siegpunkte erobern? (Enrico 2026-11-21 00:44)
Nur in `IDEEN.md` übernehmen, umsetzen später zusammen mit F66/Paket E nach Rücksprache. Idee: Nicht jede Einheit soll Punkte einnehmen können – ein Feldscher/Sanitäter, der eine Stellung erobert, ergibt keinen Sinn; Schreiter/Mechs sind schlagkräftig, können eine Stellung aber nicht „besetzen“. Vorschlag des Beraters (noch nicht entschieden):
- **Erobern:** Linieninfanterie, Sturmtrupps, Pioniere, Kampfanzüge, Schildwall, ggf. Reiter.
- **Nur umkämpft machen** (verhindern gegnerische Einnahme, nehmen selbst nicht ein): Panzer, Kolosse, Schreiter, Hünen, Löwenoger.
- **Gar nicht:** Sanitäter, Melder/Signal/Fernsprech, Geschütze, Mörser/Minenwerfer, MG-Trupps(?), Anführer(?).
Als Symbol in der Einheitenanzeige („kann erobern“). Balance-Auswirkung per Simulation prüfen.

## Antworten von Enrico (2026-11-21 08:45, zum Bericht „F76–F79, F70, F46; Paket E abgeschlossen“)
- **F76 (geändert 08:50):** Wer im Nahkampf von Flanke/hinten angegriffen wird, **dreht sich zum Angreifer und bleibt ihm danach zugewandt** – Flankenbonus zählt nur für diesen ersten Angriff; ein zweiter Trupp kann danach den neuen Rücken angreifen (Einkesseln lohnt sich).
  - **Fußtruppen und Reiter:** wie schon gebaut.
  - **Schreiter** (Säge-, Klauen-, Turm-, Kreuz-, Ordensschreiter, Eisenknecht): ebenso, **wenn sie im Nahkampf gebunden sind** – drehen sich und bleiben so (keine Drehkosten dafür).
  - **Panzer und Kettenfahrzeuge** (Landkoloss, Sturmpanzer, Bohrkoloss): drehen sich **nicht** – nur in der Kampfszene kurz sichtbar zum Angreifer, danach zurück. „Panzer von hinten knacken“ bleibt ein Spielzug.
  - Texte/Hilfe und KI (nutzt Einkesseln) anpassen.
- **F78:** Mineure behalten die geballte Ladung, kosten aber **40** statt 30. Sankt Ruß danach kurz nachmessen.
- **F70:** Eingeholter Ballon sieht **4 Felder** (wie Fußtruppen), nicht 2.
- **F80 (neu 08:47) Granaten-Trupps: Nahkampf normal + Panzergranate als Fähigkeit:** Einheiten mit „geballter Ladung“ im Nahkampf (Sturmbrecher, Grabenräumer, Eingreiftrupp; Pioniere/Drahtpioniere und Mineure mitprüfen) sollen **im Nahkampf ganz normal zuschlagen** (Klinge/Kolben – auch **Ton und Animation** normale Hiebe, keine Explosion). Die Panzerabwehr kommt stattdessen als **eigene Fähigkeit „Panzergranate werfen“** mit Abklingzeit: **nur gegen Panzer/schwer Gepanzerte** (nicht gegen Infanterie), Reichweite 1–2 Felder, kostet die Aktion, Abklingzeit z. B. 2 Runden, kräftiger Schaden (Wert per Simulation, etwa wie heute die geballte Ladung). Ausnahme „geballte Ladung ×1,5 im Nahkampf“ in F66 entfällt dann. Wurf-Pose (Sturmtrupp-Posen vorhanden), Explosion am Panzer, `einschlag_panzer`. Pioniere: Haftladung bleibt, wie sie ist; Mineure: konsistent mit dieser Regel vorschlagen (Preis 40 ggf. neu bewerten). **Achtung Balance:** Grauwall hängt an +2 Sturmbrechern als Panzerabwehr der Aschenwacht – neu abstimmen (Grauwall + Sankt Ruß). KI nutzt die Fähigkeit. Texte/Medaillen anpassen.
- **F81 (neu 08:53) Flammenwerfer-Reichweite:** 1 Feld ist zu kurz – der Flammentrupp steht dann immer in Feindberührung und es wird „komisch mit dem Nahkampf“. Neu: **Reichweite 2 Felder** (Konkordat-Flammentrupp, Aschenwacht-Brandwerfer; Bohrkoloss-Flammenstoß mitprüfen) **und** Flammen dürfen **auch auf ein benachbartes Ziel** gesprüht werden, obwohl die Einheit dann gebunden ist (Ausnahme vom „kein Schuss in Feindberührung“). Strahl-Länge im Bild an 2 Felder anpassen. Simulation Grauwall + Sankt Ruß; falls zu stark, Schaden auf 2 Felder etwas geringer als auf 1 (Vorschlag im Bericht).
- Danach kurzer Bericht „bereit für die Prüfrunde – pb“.

## Danach: Prüfrunde (mit Fable) – NUR prüfen, NICHTS umbauen
Enrico stellt dafür in Claude Code auf das Modell **Fable** um. Ergebnis ist **nur eine Liste** in `entwurf/postfach/PRUEFLISTE.md` (Fund, Ort/Datei, Schwere hoch/mittel/klein, Vorschlag), kein Code ändern, nichts committen außer der Liste. Prüfen:
1. **Leistung:** Bildrate in großen Schlachten (Grauwall, Sankt Ruß, viele Effekte: Pulverdampf, Blut, Kampfszene), Speicher, Ladezeit; `index.html` ~53 MB – was ließe sich verkleinern (Bilder, Töne), ohne Qualität zu verlieren.
2. **Widersprüche Regeln ↔ Texte ↔ KI ↔ Anzeige:** Faktortabelle F66, Medaillen, SPECIALS, Fähigkeitstexte, Zug-Vorschau F60, Knopf-Gründe, Bewegung/Aktion F61; KI nutzt alle neuen Regeln (Generalangriff, Sturmrollen, Ausgraben, Ballon, Gebäude rammen, Ladungen).
3. **Tonmischung:** Pegel der Gruppen zueinander (Gewehr/MG/Kanone/Stimmen/Musik), abgehackte Töne, Dopplungen, Einschlag nach Ziel.
4. **Figuren:** Maßstab der Einheiten zueinander, Mündungspunkte aller Waffen, Getroffen-Richtung, Posen-Lücken.
5. **Sonstiges:** tote Codepfade, alte Draufsicht-Reste, Speicherschlüssel, Konsolenfehler in einer kompletten KI-gegen-KI-Partie auf beiden Karten.
Am Ende im Chat: „Prüfliste fertig – pb“.

## Antworten von Enrico (2026-11-21 08:30, zum Bericht „F54, F66, Punkte 7–14, F70“)
- **F70 Ballon:** **Ja, so bauen** wie vorgeschlagen (oben Sicht 6 + Markieren, eingeholt 2 Felder Zug/Sicht 2, Einholen 1 BP, Aufsteigen alle BP ohne Aktion, Preis 25, KI wie beschrieben, Seil-Animation, Winden-/Ratschenton).
- **F68:** gibt es nicht – Tippfehler des Beraters, entfällt.
- **Punkt 9 Musik:** Enrico hatte sich vertan, Musik war in Ordnung. Deine Korrektur mit dem Ton-Schalter (M) bleibt drin.
- **Reihenfolge jetzt:** F76–F79 → F70 → restliches Paket E → Bericht.

## Antworten von Enrico (2026-11-21 01:15, zum Bericht „Nachträge F49–F65“)
- **F54 Sturmrollen:** **Vorschlag wie beschrieben** (Enrico 01:16), **Bohrkoloss behält seinen Nahkampf** (Bohrkopf) – Enrico 01:16: aber **nur ein einziger Stoß**, der sich einen Moment länger **hineinbohrt** (Bohrkopf dreht, Rütteln, Funken/Blut, Bohr-Ton hält an), statt mehrerer Hiebe. Bauen, per Simulation abstimmen (Grauwall, Sankt Ruß), Endwerte im Bericht. Falls Enrico es anders will, meldet er sich.
- **F66 Bonussystem:** **Tabelle so übernehmen** (Gewehr/MG gegen schwer wirkungslos, Panzerbüchse/Löwenmaul gegen ungepanzert ×0,5, Explosiv/Flamme gegen schwer ×0,5, Schrot und schwerer Nahkampf ×1,5 gegen ungepanzert, Rollen „schwach/stark im Nahkampf“ wie vorgeschlagen, Ausnahmen MG gegen Reiter ×2, geballte Ladung, Flanke). Medaillen Bronze/Silber/Gold, Info-Texte, Faktor beim Zielen, KI-Zielwahl. Danach Simulation Grauwall + Sankt Ruß.
- **F59:** Sturmpanzer kostet **100**. Sankt Ruß bei Bedarf über die Aschenwacht-Armee leicht Richtung 50 % ziehen.
- **Reihenfolge jetzt:** F54 + F66 (+ F70 Ballon-Vorschlag) → F68/F71–F74 und die kleinen Punkte 7–13 aus dem F67-Abschnitt (Standard-Optionen, Armee-Tooltip, Musikregler, Pulverdampf, Beschuss-Wucht, Schreiter-Animation, Scharfschützen-Schüsse) → Bericht.

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
- [x] 5c. Nachträge: erledigt F49 (10b9b3a), F50/F52 (13b2a89), F51 (f3d9c26), F56/F57 (8b580b2), F53/F55 (995b8ad), F60/F62 (d521862), F61 (19c8ff6), F58 (cfc7083), F59/F65 (f90ae96), F63 (1153d41), F67 (d379432), F64 (d8a24f1 + dieser Commit); F36 Ausgraben (dieser Commit)
- [x] F54 Sturmrollen + Bohrstoß, F66 Schere-Stein-Papier, F59 Preis 100, Abstimmung Grauwall/Sankt Ruß (dieser Commit); F70 Vorschlag im Bericht
- [x] Punkte 7–14: Standard-Optionen, Armee-Tooltip, Musik/Ton aus, F71 Pulverdampf, F72 Beschuss-Wucht, F73 Schreiter-Animation, F74 Scharfschützen, F75 Flammenstoß (dieser Commit)
- [x] F76–F79 (d2cd205), Simulation Grauwall 52 % / Sankt Ruß 50 %, Mineur-Test im Bericht
- [x] F70 Ballon, F46 Graben (10ded8e); Paket E abgeschlossen
- [x] Paket G Schritte 1–3 (a8c201c, 8d947ec, 4e7fe48)
- [x] F76 geändert, F78 Preis 40, F70 Sicht 4, F80 Panzergranate, F81 Flammen 2 Felder; Grauwall 52 % / Sankt Ruß 49 % (dieser Commit) – bereit für die Prüfrunde
