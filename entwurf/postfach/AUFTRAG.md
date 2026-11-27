# >>> GILT AB SOFORT (Enrico 2026-11-23 19:20): SPARREGELN und PAKET-REIHENFOLGE <<<
**Warum:** Enricos Wochen-Nutzungslimit ist knapp (Rücksetzung erst Mittwoch). Ton-Pult 3 hat sehr viel verbraucht (Hilfs-Agent, 20-Minuten-Lauf).

**Sparregeln (für jeden `pa`/`pw`):**
1. **Keine Hilfs-Agenten / Subagenten** ohne ausdrückliche Erlaubnis von Enrico.
2. **Keine Test- oder Simulationsläufe über 10 Minuten** ohne Rückfrage. `sim.js` lieber mit 100 statt 200 Schlachten und einem Startwert, wenn es nur um eine Richtung geht; große Messungen nur, wenn der Abschnitt es ausdrücklich verlangt.
3. **Je `pa` genau EIN Paket** (siehe unten), dann Bericht + „– pb“ und **aufhören**. Nicht von selbst mit dem nächsten Paket weitermachen.
4. Nur das Nötige lesen (gezielt suchen statt ganze Dateien), keine Bilderserien, wenn ein Bild reicht.
5. Wenn ein Paket größer wird als gedacht: Zwischenstand committen, im Bericht sagen, was fehlt, aufhören.
6. **Vorschau schließen (Enrico 2026-11-25 16:55):** Am Ende jedes Pakets die Spiel-Vorschau im CC-Fenster schließen (bzw. `preview_stop`); der Vorschau-Server darf weiterlaufen. Grund: Das Spiel zeichnet jedes Bild neu, auch im Leerlauf, und belastet den PC dauernd (heute Absturz unter Last). **Idee für später (Berater):** Ruhemodus – nur neu zeichnen, wenn sich etwas bewegt.
7. **GELOCKERT ab Paket G7b-Test (Enrico 2026-11-25 20:26):** Der neue NVIDIA-Treiber 617.42 ist seit 19:40 drauf. Ab dem nächsten `pa` (G7b-Test) wieder normal arbeiten wie vor dem 25.11.:
   - Spiel-Vorschau darf wieder sichtbar laufen.
   - Der unsichtbare Chrome darf wieder mit Grafikkarte starten (`MIT_GPU=1` setzen bzw. als Standard zurückdrehen; `--disable-gpu` nur noch als Schalter `OHNE_GPU=1`).
   - Bildzeit-Messungen sind wieder erlaubt.
   - **Bleibt:** nie zwei Browser-Läufe gleichzeitig, keine Läufe über 10 Min. (Regel 2), kein ComfyUI, am Paketende Vorschau/Chrome schließen (Regel 6). Nach jedem Paket kurz im Bericht: lief alles ohne Hänger?
   - **Friert der PC wieder ein:** Enrico sagt Bescheid, dann gilt sofort wieder der alte Text darunter.
   Alter Text: **Grafikkarte schonen, bis Enrico den NVIDIA-Treiber neu installiert hat (Berater 2026-11-25 17:30).** Der PC ist heute zweimal komplett eingefroren (ca. 14:40 und 17:15). Ereignisanzeige: `nvlddmkm` Ereignis 153 (Grafiktreiber hängt, Reset) und danach `dwm.exe`-Absturz. Enrico steuert von unterwegs, ein Hänger wäre dann nicht zu beheben. Deshalb bis auf Widerruf:
   - **Keine sichtbare Spiel-Vorschau** öffnen. Bilder und Tests nur im unsichtbaren Chrome.
   - Den unsichtbaren Chrome in allen Test- und Bildwerkzeugen (`test_partie.mjs`, `test_ki_partie.mjs`, `leistung_messen.mjs`, `*_bilder.mjs` usw.) **ohne Grafikkarte** starten, wenn das ohne großen Umbau geht: `--disable-gpu` bzw. Software-Rendering (`--use-angle=swiftshader`). Messungen der Bildzeit (Leistung) in dieser Zeit **nicht** machen bzw. als „ohne GPU“ kennzeichnen. Wenn das einen Werkzeug-Umbau bräuchte: einfache Umgebungsvariable (z. B. `OHNE_GPU=1`) einführen und nutzen.
   - **Nie zwei Browser-Läufe gleichzeitig**, keine langen Läufe (>10 Min.), kein ComfyUI.
   - Am Paketende Vorschau/Chrome-Prozesse beenden (Server darf laufen).

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
- ✓ **Paket E – Regeln (mit Messung):** **zuerst Punkt 42 (Dampfpfeife, aus Paket D übrig, Abschnitt 24.11. 19:05)**, dann Punkte 3 (Scharfschützen), 16 (Feldkanone Panzergranate), 18 (Entsetzenstest), 2 (Aufstellungsphase).
- ✓ **Paket F – Kleinkram/Listen:** **zuerst Punkte 46–47 (Abschnitt 24.11. 22:02)**, dann Abschnitt 17:20 (Liste fehlender Sprachbefehle), 17:10 (Brainstorm in IDEEN.md + Probebild Maßstab), Punkt 17 (Schadenszahlen). **Danach (nach Paket F): Bauplan für den großen Umbau schreiben, noch nichts bauen** (Etappe 3/4 in PLAN.md; Punkte 26, 43, 44, 45b einbeziehen).
- ✓ **Paket F2 – Nachträge vor dem Bauplan (Abschnitt 24.11. 23:12, Punkt 50), klein:** Aschenwacht-Schadenszahlen kräftiger, Maßstab-Probe E1 mit kleineren Panzern/Schreitern. **Danach eigener `pa`: Bauplan für den großen Umbau** (noch nichts bauen; Maßstab E1).
- ✓ **Bauplan geschrieben** (`entwurf/BAUPLAN_UMBAU.md`, `37f7b67`).
- ✓ **Paket BP2 – Bauplan überarbeiten (Abschnitt „24.11. 23:30 bis 25.11. 00:25“, Punkte 52–54), nur Plan, nichts bauen.** Danach Freigabe durch Enrico, dann U0.
- ✓ **Paket U0 + U1 – Umbau beginnt (Abschnitt 25.11. 06:15, Punkt 55).** Je ein `pa` (erst U0, dann U1). Danach Pause für das Gelände-Paket G.
- ✓ G1 erledigt (Probe+Plan). **Paket G – Gelände (Abschnitt 25.11. 07:00, Punkte 56–57).** Erst **G1 = Probe + Plan** (ein `pa`, Bilder, Liste der Bausteine, die der Berater malen soll), dann nach Enricos Blick **G2 Gräben** und **G3 Felder** bauen. Danach U2.
- **Paket G2a + G3a – ohne neue Bilder (Abschnitt 25.11. 08:35, Punkt 58).** Ein `pa`. Die gemalten Teile (G-1…G-10, F-3…F-6) baut CC ein, sobald der Berater sie geliefert hat (eigener Schritt).
- **Paket G2b + G3b – gemalte Teile einbauen (Abschnitt 25.11. 10:15, Punkt 59).** Eigener `pa` nach G2a/G3a. Bilder liegen fertig in `ui-quelle/gelaende/neu_g/`.
- **Paket G4 – Zinnenverlauf + Acker (Abschnitt 25.11. 13:15, Punkt 61).** Ein `pa`, vor U2.
- **Paket G4b – Grabentakt unregelmäßiger + Grabenboden (Roste, Pfützen) (Abschnitt 25.11. 14:10, Punkt 63).** Ein kleiner `pa`.
- **Paket U2 – Klone und Grabenplätze (Bauplan, Abschnitt 25.11. 14:10, Punkt 64).** Eigener `pa` nach G4b. Am Anfang: Restpunkte Grabenboden (Pfützen-Glanz, Laufsteg scharf, Rost-Teil, fehlender Steg).
- **Paket U2b – Grabenplätze im Zickzack, Klone ohne Spiegeln (Abschnitt 25.11. 15:10, Punkt 67).** Kleiner `pa` direkt nach U2. Danach Leistungs-Check mit Fable (Enrico startet ihn selbst), dann G5.
- **Paket G5 – Stacheldraht mit Sinn und Verstand (Abschnitt 25.11. 14:35, Punkt 65).** Eigener `pa` nach U2b und dem Fable-Check.
- **Paket G5b – Drahtgürtel aus gemalten Stücken (Abschnitt 25.11. 15:55, Punkt 69).** Eigener `pa` nach dem Fable-Check, vor G6.
- **Paket L1 – Leistung: Filter vorrechnen, Schatten, Ton (Abschnitt 25.11. 16:20, Punkt 71).** Kleiner `pa` direkt nach G5b.
- **Paket R1 – 8/6/3 + Feldlinien dezenter (Abschnitt 25.11. 17:05, Punkte 72/73).** Nächster `pa`. Danach G7a.
- **Paket G7 – Gräben eingegraben statt Pappe (Abschnitt 25.11. 16:15, Punkt 70).** Erst G7a = Probe + Plan (ein `pa`), nach Enricos Blick G7b bauen. Nach L1, vor G6. **In G7b auch Fable-Bremsen 2 und 4** (Punkt 71).
- ✓ **Paket G6 – Panzersperren und besondere Orte (Windmühle, Koloss-Wrack) (Abschnitt 25.11. 15:10, Punkt 68).** Erledigt (`1c7bc1c`, `0d96e82`).
- ✓ **Paket G6b – Nachbesserung G6 (Abschnitt 25.11. 19:20, Punkt 75).** Erledigt (`0cd3d13`).
- ✓ **Paket G7b-Test – Erdlippe und Innenwand in die Probe (Punkte 76, 77).** Erledigt (`8caaf72`).
- **Paket G7b voll, Teil 1** erledigt als Zwischenstand (`93b6504`, `aded42e`).
- ✓ **Paket G7c – Graben nachbessern (Punkt 80).** Erledigt (`1b1dc00`).
- **Paket G7d – neuer Graben ins Spiel (Abschnitt 25.11. 22:10, Punkt 81).** Teil 1 erledigt (`c21b8f8`).
- ✓ **Paket G7e – Rest von G7d (Abschnitt 25.11. 22:35, Punkt 82).** Erledigt (`30d8196`, `9d794aa`).
- ✓ **Fable-Check 1** erledigt (`entwurf/postfach/PRUEFUNG_FABLE_GRABEN.md`, Bilder `entwurf/probe/fable_graben/`).
- ~~Paket G7f – R2 (Punkt 83)~~ → ersetzt durch Punkt 85 (Fable: R2 allein schließt die Lücke nicht).
- ✓ **Paket G7f – Reparatur Graben (Punkt 85 Teil 1).** Erledigt (`b7bf1f1`).
- ✓ **Paket G7g – Grabenform (Punkt 85 Teil 2).** Erledigt (`05ae696`).
- ✓ **Paket G7h** (G7h-1 `37b0985`/`9058ac0`, G7h-2 `631a996`/`cf0db67`/`c7b8cc9`) erledigt, index.html drin.
- ✓ **Paket SP-1** erledigt (`0ddd904`, `04659b9`, `08ee033`).
- ✓ **Paket SP-2** erledigt (`6248915`, Salve-Nachtrag `0bd6d5b`).
- ✓ **Paket SP-3 – Töne (84.3, 84.10) + Salve je Figur einmal (Abschnitt 26.11. 14:25).** Erledigt (`0dbe5c3`).
- ✓ **Paket U5a – Regeln und Messung** erledigt (`9924675`).
- ✓ **Paket U5b** erledigt (`fe24c8c`). **Punkt 90 (Truppgrößen) wurde nicht mitgemacht → U5c.**
- ✓ **Paket U5c** erledigt (`a8ffb5b`, `11fa6e5`).
- ✓ **Paket R3 + Nachträge 98–100** erledigt (`9b1c272`, `805e7b1`).
- ✓ **Paket R4** Teil 1 erledigt (`a7763bc`, `dabbae6`, `07dda01`). **Rest R4 (Abschnitt 26.11. 18:45) erledigt (`b958ab7`, `f7fd848`).**
- ✓ **Nachtrag R4b (Abschnitt 26.11. 19:30, Punkt 106) + Paket K1 (Punkt 104)** erledigt (`04f6b2f`, `431a645`); R4b-Punkte 4 und 6 warten auf die Bilder.
- ✓ **Paket R4c + Elite-Messung + Krähenfurt-Check** erledigt (`7d9eece`).
- ✓ **Nachtrag R4d (Abschnitt 26.11. 20:25, Punkt 108)** + **V1 Stimmen-Plan** erledigt (`52046c7`, V1 siehe Bericht).
- ✓ (erledigt `2c7bf3e`) **Nachtrag V1b (Abschnitt 26.11. 20:55, Punkt 109):** Stimmen-Plan auf 5 Sprecher je Seite, Konkordat Englisch, Schlachtfunk – nur Plan/Texte, nichts bauen. Danach V2 (Berater erzeugt), dann V3 (CC baut ein).
- ✓ (erledigt `1704fb4`) **Nachtrag V1c (Abschnitt 26.11. 21:10, Punkt 110):** Helden-, Schreiter- und Hünen-Zeilen in die CSV, nur Text. **V2 läuft beim Berater** (erzeugt die 552 Zeilen, Liste `entwurf/postfach/stimmen_urls.csv`). Danach V3 (CC lädt herunter und baut ein).
- **Paket V3 – Stimmen einbauen (Abschnitt 26.11. 22:25, Punkt 111):** Teil 1 erledigt (`44f4ee9`: Laden, Prüfen, Filter, Hörprobe); **Teil 2 Einbau = nächster `pa`.** 608 Sprüche liegen bereit (`entwurf/postfach/stimmen_urls.csv`).
- ✓ (erledigt `4e8d8d0`, `c7d733e` + Teil 2c) **Paket V3 Teil 2 – Einbau (Abschnitt 26.11. 22:45, Punkt 112):** 30 Heldensprüche neu (`stimmen_urls_nach1.csv`), dann einbauen.
- ✓ (erledigt, Bericht 27.11.) **Paket U4a – neue Figuren vorgezogen (Abschnitt 26.11. 23:00, Punkt 113): direkt nach V3**, vor U3. Danach Spielpause (Enrico spielt).
- ✓ **Nachtrag 114 (alte Stimmen raus) im selben `pa` wie U4a.** erledigt (`763dcf7`)
- ✓ (weitgehend, Bericht 27.11.; 115.1/115.2 offen – Stelle gesucht) **Paket ST1 – Spieltest-Funde (Abschnitt 26.11. 23:40, Punkt 115): eigener `pa` nach U4a.**
- ✓ **Nachtrag ST1b (Abschnitt 27.11. 07:30, Punkt 116):** Kirche, Kisten, Sankt-Ruß-Ausgleich.
- ✓ **Nachtrag ST1c (Abschnitt 27.11. 09:40, Punkt 117):** Windmühle Grauwall überlappt.
- **Danach U3 (Abschnitt 27.11. 09:45, Punkt 118), dann Rest U4.**
- **Rest U4 (Abschnitt 27.11. 12:50, Punkt 119)** – vorher 118.0 (Mühlen-Ruine) nachholen.
- **U4 Teil 2 (Abschnitt 27.11. 13:50, Punkt 120)** – Sicherung Quellbögen, übrige Bögen.
- **U4 Teil 3 (Abschnitt 27.11. 14:40, Punkt 121)** – neue Bögen aus Punkt 90 (Waffentrupps, Führung, Scharfschütze, Beiwerk).
- **U4 Teil 4 (Abschnitt 27.11. 15:05, Punkt 122)** – Löwenoger-Posen (120.1c nachholen).
- **U4 Teil 5 (Abschnitt 27.11. 15:25, Punkt 123)** – Sanitäter mit Trage, Versorgung, Fernsprech.
- **Paket W1 (Abschnitt 27.11. 15:55, Punkt 124)** – fal aus CC, Video je Paket, Fable-Prüfrunde. Parallel: Fable prüft die Moral (`PRUEFAUFTRAG_FABLE_MORAL.md`), danach U7.
- ✓ (erledigt in eigener Sitzung, `entwurf/postfach/BERICHT_T1.md`) **Paket T1 (Abschnitt 27.11. 16:25, Punkt 126)** – 23 Töne aus dem Download-Ordner nur in die Pult-Auswahl, vor U7.
- ✓ **Fix F1 (Punkt 127):** Nachschub-Menü verdeckt – im nächsten `pa` mit erledigen.
- ✓ **Paket U7 Moral (Abschnitt 27.11. 16:10, Punkt 125)** – nach W1, drei Schritte mit Messung.
- ✓ **Fix F2 (Punkt 130)** mit U7 Schritt 3 erledigt (`3a3a2a8`, `b06ebb9`). 5b (Größe der Führung) fehlt → F2b.
- ✓ **Paket F2b (Abschnitt 27.11. 19:35, Punkt 133)** erledigt (`ffcd417`).
- ✓ **Fable-Prüfrunde U7 (Punkt 133/134)** erledigt (`PRUEFUNG_FABLE_U7.md`): U7 bleibt, Nachbesserung U7b.
- ✓ **Paket F3 + U7b Teil 1 (Punkte 135/136)** erledigt (`ca55c0a`, `2d77fef`).
- ✓ **Paket U7b Teil 2 (Punkt 136)** erledigt (`7d3d59c`).
- ✓ **Kurz-Prüfung U7b Teil 2 durch Fable (Punkt 140)** erledigt (`PRUEFUNG_FABLE_U7B.md`).
- ✓ **Paket U7c (Punkt 142)** erledigt (Bericht 27.11. 22:10). Damit ist **U7 komplett**.
- **Danach UI1** – vorher 2–3 Entwürfe vom Berater.
- **Danach Pläne Kommandanten (Punkt 131) + Mini-Kampagne mit Tutorial (Punkt 137)** – Berater schreibt beide zusammen, Enrico nickt ab; dann U8 (mit Punkt 139: Handgranaten einmal je Schlacht, Mindestentfernung Artillerie) → S → P → U9.
- **Paket UI1 Oberfläche (Punkte 128/141)** – Entwurf A gewählt. **Teil 1 = nächster `pa`** (Einheitenkarte, Knopfgruppen, Schrift), dann **Teil 2** (Nachschub-Karten, Info-Fenster, Leisten, Klicktöne). Je Opus Mittel.
- **Paket W2 „Aus einem Guss“ (Punkt 132)** – erst nach U7: zuerst W2a = Stilmodell (LoRA) anlernen und testen, nur Probe.
- Danach U3 → U4 (mit Bildern für 6er-Sturmtrupps und Beiwerk, Punkt 90) → U6 → U7 (vorher Fable-Prüfung Moral) → U8 → S → **P Panzerung/Durchschlag (Punkt 91)** → U9.
- **Effektbögen E1–E6 einbauen (Abschnitt 25.11. 13:20, Punkt 62) – kein eigenes Paket, gehört in U3 (figurennahe Effekte).**
- **Neue Figurenbögen (Punkt 66) – kein eigenes Paket, gehört in U4.**
- **Für U7 vormerken (Enrico 23:45, Punkt 86):** Den Befehl „Sammeln“ von Hauptmann und General auch auf **fliehende** Trupps (weiße Fahne) anwenden können, gezielt statt nur automatisch. Heute: der Befehl wirkt nur auf nicht fliehende Trupps (`orderKind` → `active(o)`), Fliehende werden nur zu Rundenbeginn automatisch gesammelt (P.RALLY 0,6, Anführer bis 2 Felder). Im Knopf bzw. in der Vorschau die Chance anzeigen; Regeln zu Moral und Sammeln im Info-Fenster klarer erklären (Enrico: „manchmal undurchsichtig“).
- **Mit der Maßstab-Umstellung A (noch kein eigenes Paket):** Punkt 26 (Löwenoger neues Modell + kleiner), Punkt 43 (Löwenmaul-Kanone und Furcht-Aura stärker), Punkt 44 (neue Scharfschützen-Regel wieder aufgreifen), Punkt 45b (Furcht-Aura und Gebrüll über den Entsetzenstest).
- **Nur Vorschläge, später:** Punkte 7 Teil 2 (Melder+Sanitäter), 10 (Fähigkeiten am Porträt), 11 (Kommandobunker), 23 (Moral-Aura).

# >>> JETZT (Enrico 2026-11-27 19:35): Antwort zu U7 Schritt 3 / F2 – nächster `pa` = Paket F2b, danach Fable-Prüfrunde U7 <<<
✓ **133. Nächster `pa` = Paket F2b, klein. Einstellung: Sonnet, Mittel.**
Enricos Antworten auf die Fragen im Bericht von U7 Schritt 3 / F2:
1. **Gruppen dicht genug:** Ja, das passt so. Nichts ändern.
2. **Fahne:** etwas kräftiger wehen lassen, `a` in `FAHNE_WEHT` von 1,2 % auf etwa **2 %** der Bildhöhe. Kopf und Hand bleiben weiter ruhig, und es soll nichts Wildes werden.
3. **U7 ist fertig.** Der Berater hat den Prüfauftrag geschrieben (`entwurf/postfach/PRUEFAUFTRAG_FABLE_U7.md`). Enrico startet die Fable-Sitzung selbst, aber **erst nach F2b**. Nie zwei Browser-Läufe gleichzeitig.

**Nachholen aus F2, Punkt 5b (im Bericht fehlte er):** Die Führungsfiguren (Offizier, Fahnenträger, Melder) beider Seiten und der Generäle sind zu klein.
- Die Größe an einen Linien-Soldaten derselben Seite angleichen: Die Kopfhöhe soll gleich sein, der Offizier darf einen Hauch größer sein.
- Die anderen neuen Gruppenteile aus U4 Teil 3 und Teil 5 (Waffentrupps, Sanitäter, Versorgung, Fernsprech, Beiwerk) kurz gegen die Linie prüfen. Nur angleichen, wo es deutlich abweicht.
- Im Bericht eine kleine Tabelle: Teil, Höhe vorher, Höhe nachher.

**Maßstab (Enrico 19:42):** Als Maß gilt die Größe der **Reskin-Einheiten** (Linie `*_soldat_reskin`, Sturm `*_sturm_reskin`), also so, wie die Linie jetzt im Spiel steht. Danach richten sich Führung und alle neuen Gruppenteile.

**Melder:** Der stehende Melder (`*_melder_steht`) bleibt drin. Enrico ist einverstanden, obwohl Punkt 5 ihn gestrichen hatte.

**Bilder:** Vorher/nachher als je eine Übersicht wie bei F2 (`entwurf/probe/f2b/`), dazu ein kurzes Video. Partietest einmal. Am Ende Vorschau bzw. Chrome schließen.

# >>> JETZT (Enrico 2026-11-27 20:45): Antwort zu F3 / U7b Teil 1 – nächster `pa` = U7b Teil 2 <<<
✓ **138. F3 und U7b Teil 1 sind abgenommen.**
1. **Turmschreiter:** Die Zweitwaffe („Turm-MG“) ist das kleine MG vorn an der Brust, so lassen.
2. **Nächster `pa` = U7b Teil 2** (Abschnitt 20:25, Punkt 136, Teil 2). **Einstellung: Opus, Hoch.**
3. **Bei Gelegenheit in Teil 2 mitprüfen** (nur ein Standbild, kein eigener Umbau): die Faustsalve des Eisenknechts und den Schuss des Landkolosses nach hinten (Mündungspunkt, Leuchtspur). Ist dort etwas falsch, kurz beheben und im Bericht nennen.

# >>> JETZT (Enrico 2026-11-27 20:25): Antwort zur Fable-Prüfung U7 – Paket U7b in zwei Teilen <<<
**136. Grundlage: `entwurf/postfach/PRUEFUNG_FABLE_U7.md`**, Abschnitt 6 (Paket U7b) und die Fehler-Nummern aus Abschnitt 2. U7 bleibt wie gebaut.

**Enricos Antworten auf die Fragen der Prüfung:**
1. **Zurückweichen im Offenen:** Ja. Der Treffer, der unter die Schwelle drückt, wirft den Trupp ein Feld zurück. Am neuen Feld darf er dann niedergehalten liegen (U7b Nr. 6).
2. **Panik statt „zerschlagen“ unter Beschuss:** Erst nur messen (U7b Nr. 7, Probelauf mit `P_MOR_PER_DMG=1`, 3 Karten × 1 Startwert). Nichts einbauen. Die Ergebnisse kommen in den Bericht, Enrico entscheidet danach.
3. **Halten um jeden Preis und aufgepflanztes Banner:** Ja, sie verhindern auch das Zurückweichen (U7b Nr. 5).
4. **Am eigenen Rand:** Ja. Erst den Sammelversuch würfeln, dann ist der Trupp fort (Fehler 6).

✓ **Teil 1 – im nächsten `pa` zusammen mit F3 (Punkt 135). Einstellung: Sonnet, Mittel.** Nur Anzeige, keine Regel:
- U7b Nr. 1 (Fehler 1, 2, 13): Anzeige einheitlich über `E.moralStufe`. Dazu gehören die Marke „Weicht“ mit der Schwelle aus `fallbackSchwelle`, der Balken der Einheitenkarte gelb bei *wankt* und kein Flackern oder „weicht“-Tooltip bei Geschützen.
- U7b Nr. 2 (Fehler 3, 14, 15):
  - Marke „Flieht“ mit zwei Texten (zerschlagen / Panik mit Sammel-Chance zu Rundenbeginn).
  - Balken-Tooltip mit den Schwellen der Einheit (z. B. „wankt unter 42, weicht unter 30, im Graben unter 20“).
  - Info-Fenster: Moral ×10.
  - Regeln-Fenster: „Moral und Flucht“ als Leiter mit vier Zeilen (*wankt*, *weicht*, *Panik*, *zerschlagen*), Sammeln als kurze Liste, „eingegraben“ ergänzen.
- **Bilder:** Je ein Bild von Marke, Einheitenkarte und Regeln-Fenster. Den Partietest einmal laufen lassen. Dann Bericht und aufhören.

✓ **Teil 2 – eigener `pa` danach. Einstellung: Opus, Hoch** (Regeln und KI mit Messung):
- U7b Nr. 3 (Fehler 4, 9):
  - KI beschießt Zerschlagene nicht mehr (`W_ZERSCHLAGEN` 0,3).
  - Schwellen aus `P` und `fallbackSchwelle` statt fester Zahlen.
  - `W_SAMMEL` nach Stufe *wankt*.
  - Dazu die Lücke aus Abschnitt 5: Die KI zieht eigene wankende Trupps aus dem Offenen in Deckung.
  - Den Sammeln-Befehl auch nach dem Ziehen prüfen.
- U7b Nr. 4 (Fehler 6, 8, 10, 11, 12):
  - Am Rand erst würfeln.
  - Ein Panik-Trupp unter 15 Stärke wird zerschlagen (Punkte gutschreiben).
  - Ein MG baut auf der Flucht ab.
  - Eine gemeinsame Deckungs-Funktion (Haus, Kapelle und Mühle erholen sich mit 10).
  - Wankt ×0,85 auch in `shellDmg`.
- U7b Nr. 5 (Antwort 3) und Nr. 6 (Antwort 1), je mit eigenem Rückweg-Schalter.
- **Messung:** Nach Nr. 3, Nr. 4 und Nr. 5/6 je kurz (MISCHEN=1, 3 Karten, Läufe unter 10 Minuten). Am Ende ein voller Lauf mit `u7_messen.mjs`. Die Siegquoten sollen in der Streuung ±4 bleiben, sonst nachfragen.
- **Zusätzlich nur messen:** U7b Nr. 7 (Antwort 2), nichts einbauen.
- Regeltest, Partietest und Video wie üblich.

# >>> JETZT (Enrico 2026-11-27 20:10): Fix F3 – Turm-MG am Sturmpanzer der Aschenwacht, erst NACH der Fable-Prüfung U7 <<<
✓ **135. Nächster `pa` = Paket F3, klein. Erst starten, wenn die Fable-Prüfung U7 fertig ist (nie zwei Browser-Läufe gleichzeitig). Einstellung: Sonnet, Mittel.**
1. **Turm-MG des Sturmpanzers der Aschenwacht** (Bogen `aschenwacht_panzer_neu`, Zweitwaffe, `MUZ2`):
   - **Fehler:** Mündungsfeuer und Leuchtspur kommen über dem MG-Schützen auf dem Turm heraus, nicht aus dem Lauf (Enrico 20:05).
   - **Fix:** Den Mündungspunkt genau auf die Laufspitze des Turm-MGs setzen, und zwar für beide Blickrichtungen (gespiegelt) und auf allen Zoomstufen.
   - **Prüfen:** Rechnet `fuss`/`fuss2` den Punkt in der gekippten Ansicht nach oben?
2. **Kurz mitprüfen:** Sitzen die anderen Mündungen (`MUZ`/`MUZ2`) an Panzern, Kolossen und Schreitern ebenfalls an der Laufspitze? Abweichungen gleich mit beheben und im Bericht als Liste aufführen.
3. **Bilder:** Vorher/nachher je ein Standbild im Moment des Schusses (Turm-MG plus die übrigen, falls geändert). Den Partietest einmal laufen lassen.

# >>> JETZT (Enrico 2026-11-27 20:05): Antwort zu F2b – kein neuer `pa`, jetzt Fable-Prüfrunde U7 <<<
**134. F2b ist abgenommen.**
1. **Größe der Führung:** So lassen, also stehende Männer etwa 8 % über dem geduckten Liniensoldaten und den Offizier etwas darüber.
2. **MG-Trupps und Panzerbüchse** (10–12 % größer): So lassen.
3. **Nächstes:** Die Fable-Prüfrunde U7 läuft in einer eigenen Sitzung nach `PRUEFAUFTRAG_FABLE_U7.md` und wird nicht über `pa` gestartet. Bis das Ergebnis da ist, gibt es **keinen neuen `pa`** (danach F3, Punkt 135). Danach kommt UI1, vorher zeigt der Berater Entwürfe.

# >>> NOTIZ (Enrico 2026-11-27 19:25): Alles in einem Zeichenstil – Paket W2, erst NACH U7 <<<
**132. Nur vormerken, vor dem Ende von U7 nichts davon anfassen.** Enrico: Die große neue Mühle gefällt ihm im Stil sehr, aber Bäume und anderes sehen auf anderen Karten ganz anders aus. Er will nicht alles nochmal von Hand neu machen, sondern einen Weg, der **schneller und günstiger ist, aber genauso gut oder besser** aussieht. Neue Modelle und Karten dauern bisher zu lange und wirken „zusammengestückelt“.

**Gedanke:** Die Karten bestehen aus Bausteinen. Wird ein Baustein neu gezeichnet, ändert er sich auf allen Karten, keine Karte muss neu gebaut werden. Darum zuerst einen festen Stil schaffen, dann nur die Bausteine, die herausfallen, in diesem Stil neu zeichnen.

**W2a – Stilmodell (LoRA) anlernen und testen, nur Probe (Einstellung: Opus, Mittel).**
1. Auf fal den passenden LoRA-Trainer wählen (aktuelle Liste prüfen, z. B. Flux- oder Qwen-Image-LoRA-Training; Bildmodell muss mit LoRA malen können und Magenta-Hintergrund schaffen). Kosten vorher im Bericht nennen; Grenze für den Test: **höchstens 5 € Training + 2 € Probebilder**, sonst vorher fragen.
2. **Gelände-Stil zuerst:** 15–25 Lernbilder aus den freigegebenen Bausteinen – Grundlage die **große neue Mühle** (`ui-quelle/gelaende/neu_poi/windmuehle_bogen`), dazu die Teile, die im selben Stil entstanden sind (CC sucht sie und zeigt sie als Übersicht). Keine fremden Marken, nur unsere Bilder. Schlüsselwort z. B. `armgelaende`.
3. **Proben mit dem LoRA:** 3 Bäume (Laubbaum, Tanne, Totholz), 1 Haus, 1 Zaunstück, je Sommer; dazu dieselben Teile ohne LoRA (nano-banana mit der Mühle als Referenz) zum Vergleich. Übersicht `entwurf/probe/stil/lora_gelaende.jpg`: Mühle – mit LoRA – ohne LoRA – bisheriger Baustein.
4. **Kurzer Figuren-Test** (wenn Gelände klappt, sonst weglassen): eigenes LoRA aus 15–20 freigegebenen Konkordat-Bögen, 2 Probefiguren; prüfen, ob Ausrüstung, Gasmaske, Farben gleich bleiben.
5. Bericht: Kosten, Bilder, Einschätzung, ob das LoRA für alle künftigen Bausteine und Modelle taugt. **Nichts einbauen.** Enrico entscheidet danach.

**Nachtrag (Enrico 2026-11-27 19:35):**
- **Punkt 4 (Figuren-Test) ENTFÄLLT.** W2a ist nur Gelände. Ein Figuren-LoRA kommt später mit eigenen, von Enrico gewählten Lernbildern (der Berater stellt sie zusammen).
- **Lernbilder für Punkt 2 sind schon ausgewählt:** 25 Einzelbilder in `entwurf/lora_gelaende/` (Liste und Quellen in `LIESMICH.md`, Übersicht `uebersicht.jpg`). Genau diese nehmen und keine weiteren dazusuchen.

**Nachtrag (Enrico 2026-11-27 19:55) – Figuren-Stil, nur vormerken:**
- **Zielstil für alle Figuren:** die Reskin-Bögen (Linie, Sturm, Schwere Grabenwacht), `aschenwacht_panzer_neu` und `konkordat_fernsprech_neu`. Typisch: wuchtig, Plattenpanzer über dem Mantel, klare dicke Konturen. Die übrigen Bögen weichen ab, deshalb wirkt das Feld so uneinheitlich.
- **Lernbilder für ein späteres Figuren-LoRA** liegen schon bereit: 24 Einzelfiguren in `entwurf/lora_figuren/` (`LIESMICH.md`, `uebersicht.jpg`). Angelernt wird erst nach W2a und Enricos Freigabe.
- **Zu flach („Pappschild“):** die stehenden Melder (`*_melder_steht`) und Fahrzeuge/Kolosse. Sie sollen **leicht plastisch** wirken: mehr Volumen, Licht und Schatten, aber nicht 3D. Für W2b/W2c vormerken. In F2b bleibt der Melder vorerst drin.
- **Neu zeichnen im Zielstil (Liste, W2):** Panzerbüchsen-Trupp Aschenwacht (Enrico 19:52, Bild aus dem Spiel). Die Figuren haben den alten schlanken Stil, die Büchse liegt einzeln und riesig vor dem Schützen. Neu soll der liegende Schütze die Waffe selbst halten, in passender Größe. Dazu kommen alle Bögen, die noch nicht im Zielstil sind (Liste stellt der Berater vor W2b auf).
- **MG-Trupp im Graben (Enrico 20:05, Bild aus dem Spiel, Konkordat):** In einem Graben, der in die Tiefe läuft, steht das MG allein oben, der Schütze kniet weit darunter. Vermutlich verteilen die Grabenplätze (`grabenPlaetze`/Zickzack) die Teile der Gruppe einzeln. Für W2 vormerken: Waffentrupps als **ein Stück** (Schütze an der Waffe) zeichnen und im Graben als Gruppe zusammenhalten. Ursache dann mitprüfen. Jetzt nichts ändern.
- **Laufbilder beim Reskin (Enrico 22:19):** Beim Ziehen wirken die Figuren, als würden sie schweben. Beim Neuzeichnen im Zielstil deshalb je Fußtrupp **2–4 Laufposen** mitmalen (Schritt links, Schritt rechts, ggf. Zwischenpose), dazu Pferde und Schreiter mit Gangposen. Im Spiel wechseln sie beim Ziehen im Takt (wie `d.wipp` bei den Schreitern). Bis dahin **kein** Code-Behelf (Enrico).
- **Lernpaket Figuren:** Es sind jetzt 28 Bilder (dazu 4 Blaue Legion, Hahn übermalt), siehe `entwurf/lora_figuren/LIESMICH.md`.

**Danach (erst nach Enricos Blick, Plan steht hier nur zur Info):**
- **W2b – Bausteine neu im Stil** (nur die, die herausfallen; Ausführen: Sonnet, Mittel).
- **W2c – „Einheit neu“ / „Gelände neu“ in einem Befehl** (malen mit Stil → freistellen → Plastik → Abzeichen prüfen → Probebild neben einem Liniensoldaten).
- **W2d – Karteneditor im Spiel** (Vorschlag des Beraters statt Tiled, weil dort sofort das echte Aussehen zu sehen ist; Enrico entscheidet später).
- **Zurückgestellt:** Rotstich/„matschig“ bei der neuen Linie (Verdacht: Farbangleich zum Ochsenblut, Verkleinern, Plastik-Karte); wird mit W2 angesehen.

# >>> JETZT (Enrico 2026-11-27 22:15): U7c abgenommen – nächster `pa` = UI1 Teil 1 <<<
✓ **143.** U7c ist abgenommen, U7 ist damit fertig. Messung gegen `u7b.json`: Grauwall −2,5, Sankt Ruß +0,5, Winterdorf +0,3, alles in der Streuung.
- **Nächster `pa` = UI1 Teil 1** (Punkt 141). **Einstellung: Opus, Mittel.**
- **Aufräumen nebenbei:** Im letzten Lauf sind die Hilfsskripte `u7c.py` und `doku3.py` entstanden. Wenn sie nur Einmal-Helfer waren, sollen sie nicht im Hauptordner liegen bleiben: löschen oder nach `tools/` verschieben. Im Bericht kurz sagen, was damit passiert ist.
- **Hinweis Modell:** Die letzten Berichte nannten „Sonnet“, obwohl Opus eingestellt war. Im Bericht nur das Modell nennen, das die Sitzung wirklich anzeigt, und sonst „unbekannt“ schreiben.

# >>> JETZT (Enrico 2026-11-27 21:50): Paket U7c – Nachbesserung aus der Fable-Kurzprüfung, VOR UI1 <<<
✓ **142. Nächster `pa` = Paket U7c. Einstellung: Opus, Mittel.** Grundlage: `entwurf/postfach/PRUEFUNG_FABLE_U7B.md` (Fehler-Nummern daraus). UI1 (Punkt 141) kommt erst danach.

**Beheben:**
1. **Fehler 1:** `wanktDeckung` (`ai.js` ca. 55) misst die Feindnähe am Standort des Trupps (`nearestEnemyDist(G, u.side, u.c, u.r) > 5`), nicht am Zielfeld.
2. **Fehler 2:** Ein wankender Trupp auf einem Zielfeld wird nicht durch den Deckungszuschlag weggezogen (`wanktDeckung` gibt 0, wenn er auf einem Zielfeld steht und ein anderes Feld bewertet wird).
3. **Fehler 3:**
   - Eine Hilfsfunktion „Ziel ist zerschlagen“.
   - In `abilPlan`/`foe` solche Ziele auslassen.
   - Zweitwaffe und zweiter Breitseiten-Schuss sortieren sie ans Ende.
   - Dauerfeuer und Faustsalve: ×`W_ZERSCHLAGEN` ohne die +3.
4. **Fehler 4:** `retreatHex` bewertet Gas (`cloudAt`) und Feuer (`fireAt`) mit −4, Draht mit −4 statt −2 (außer `wireProof`).
5. **Fehler 5 (Enrico: nein):** Ein durchgefallener Entsetzenstest wirft wie vorher nur schwache Trupps zurück (unter 60 Stärke). Bei stärkeren greift Nr. 6 dort nicht (`morVor` erst nach `entsetzen` vergleichen oder Entsetzen ausnehmen).
6. **Fehler 6 (Enrico: Feuerschlag nicht schwächer):** Nur den Kommentar in `engine.js` ca. 1661 und den Bericht berichtigen, keine Regeländerung.
7. **Fehler 7:** KI-Zuschlag 1,5 für Schüsse, die einen Panik-Trupp unter `P.ROUT_STR` drücken.
8. **Fehler 8:** `retreatHex` nimmt `erholFeld(t)` (Haus, Kapelle, Mühle).
9. **Fehler 9:** Faustsalve: Die vordere Faust bekommt denselben Laufspitzen-Wert wie `MUZ_FIG`/`MUZ2` (am Bild `4_faustsalve_punkte.jpg` gegenprüfen).

**Nicht ändern:** Zielfelder werden nicht standhafter (Enrico: vorerst nein, im Spieltest beobachten).

**Messung:** ein kurzer Lauf je Karte (MISCHEN=1, 100 Schlachten, unter 10 Minuten je Lauf). Die Quoten sollen in der Streuung ±4 gegen `u7b.json` bleiben. Dazu Regeltest, Partietest und Video. Rückweg-Schalter `U7C_ALT`.

# >>> JETZT (Enrico 2026-11-27 21:45): Paket UI1 – Entwurf A „Eisenplatte“ gewählt, erst NACH der Fable-Kurzprüfung U7b <<<
**141. UI1 in zwei Teilen, je ein `pa`, erst NACH U7c (Punkt 142). Einstellung: Opus, Mittel.** Grundlage ist Punkt 128 (Wünsche) und der gewählte **Entwurf A** des Beraters: `entwurf/ui1/entwurf_A_eisenplatte.dc.html`. Für das Nachschub-Menü kommt `entwurf/ui1/entwurf_C_nachschub.dc.html` dazu (nur der Nachschub-Teil oben). Beides sind HTML-Skizzen mit Platzhalter-Symbolen. Maßgeblich sind **Aufbau, Größen und Anordnung**, nicht die Platzhalter. Im Spiel kommen die gemalten Symbolbögen (`bogen3c`/`bogen4*`, `panel_assets.py`) und die Texturen nach `STYLE.md` zum Einsatz. Wo ein Symbol fehlt: Liste im Bericht, der Berater malt nach.

✓ **Teil 1 – Einheitenkarte, Knöpfe, Schrift** (nächster `pa` nach der Kurzprüfung):
1. **Einheitenkarte links unten** wie Entwurf A, auf Eisen mit Tintenschicht:
   - Porträt mit Messingrahmen, Name groß in der Titelschrift.
   - **Rollen-Schild** (Kategorie, z. B. „LINIE“ mit Schild-Symbol) und Rolle in einem Halbsatz (`rollen.js`).
   - **Rangwinkel** (Platz für Veteranen, vorerst leer/grau, Kampagne Punkt 137).
   - Stärkebalken dick mit Strichen, Moralbalken dünn. Darunter **eine** Zeile Moralstufe („wankt · Angriff ×0,85 · weicht unter 30“).
   - **Fünf Werte als Symbol plus Zahl** (×10): Bewegung, Schuss, Nahkampf, Abwehr, Reichweite.
   - **Gut gegen / schlecht gegen** als ▲-Plaketten (grün `--s-moss`) und ▼-Plaketten (Rand `--s-life`), aus `medaillen()`/FAK, höchstens je zwei.
   - **Eigenschaften** als goldene Symbol-Kästchen. Text nur im Pergament-Tooltip (Maus und langes Drücken).
   - **„Mehr ▾“** klappt die ausführlichen Werte und die Chronik auf (`arm.kartelang` weiter nutzen).
2. **Knopfleiste unten in festen Gruppen mit kleiner Überschrift:** BEWEGEN (Ziehen, Marsch) · ANGRIFF (Schießen, Nahkampf, Zweitwaffe) · FÄHIGKEITEN (alles aus `abil`, Befehle, Eingraben …) · DREHEN. Feste Plätze je Art, auch wenn ein Knopf grau ist. Knöpfe mindestens 56 px, Tasten 1–n bleiben, Gründe für Grau (`ABIL_KEIN`) im Tooltip.
3. **Schrift:**
   - Titel und Knöpfe in **IM Fell English SC**, Text und Zahlen in **Barlow Condensed** (500/600/700). Beide stehen unter der SIL Open Font License: Dateien nach `ui-quelle/schriften/`, Lizenz in `CREDITS.md`, `tools/fonts.py`, lokal einbetten (kein Google-Link im Spiel).
   - Mindestgröße für Text 15 px bei 1920 px Breite.
   - Die Ziffernschrift „Arm Ziffer“ nur dort behalten, wo sie heute für große Schadenszahlen steht.
4. **Prüfen** bei 1280, 1920 und 2560 px, mit Touch-Tooltips. Partietest. Bilder vorher/nachher (`entwurf/probe/ui1/`). Rückweg `window.UI1_ALT`.

**Teil 2 – Nachschub, Fenster, Leisten, Klicks** (eigener `pa` danach):
1. **Nachschub-Menü als Karten** wie in Entwurf C (Stil A):
   - Je Karte: Porträt, Name, Kategorie-Schild, Preis mit Aufschlag („★ 85 +50 %“), 2–3 Werte als Symbole, ▲/▼-Plaketten.
   - Gesperrte Einheiten ausgegraut, mit Grund („Voll: je 2 Linientrupps ein Platz“).
   - Kategorie-Leiste oben, Reiter bleiben. Finger: erst antippen = Details, zweimal = aufstellen.
2. **Info-Fenster** auf Pergament im selben Aufbau wie die Karte (Werte als Symbole oben, Text darunter, Chronik zum Aufklappen).
3. **Obere Leiste** schlanker wie in Entwurf A: Runde links, Siegpunkte mittig, Knöpfe rechts mit `aria-label`/Tooltip.
4. **Klickgeräusche:**
   - 3–4 neue kurze Knopfklänge über `node tools/fal_ton.mjs` (ElevenLabs Geräusche): trocken, metallisch bzw. Holz, unter 0,3 s, kein Nachhall.
   - Als Plätze `klick_neu_1–4` nur zur Auswahl ins Ton-Pult (Rubrik Oberfläche). Enrico wählt dort, und der alte `klick` bleibt bis dahin.
   - Kosten im Bericht.
5. Prüfen wie in Teil 1, Video.

# >>> JETZT (Enrico 2026-11-27 21:35): Antwort zu U7b Teil 2 – kurze Fable-Prüfung, kein neuer `pa` <<<
**140. U7b Teil 2 ist vorläufig abgenommen** (gebaut mit Sonnet statt Opus).
1. **Nr. 7 (Moralverlust je Schaden 1,0):** Nicht übernehmen, es bleibt bei 0,8. Das wird mit der Kampagne (Punkt 137) neu angesehen, weil dort gesammelte Trupps erhalten bleiben und das Sammeln mehr zählt.
2. **Kurze Fable-Prüfung:** Fable liest nur den Code der neuen Regel- und KI-Stellen, nach `entwurf/postfach/PRUEFAUFTRAG_FABLE_U7B.md`, in einer eigenen Sitzung, die nicht über `pa` gestartet wird. Bis das Ergebnis da ist, gibt es **keinen neuen `pa`**.
3. **Danach:** UI1 (vorher Entwürfe vom Berater).

# >>> NOTIZ (Enrico 2026-11-27 21:15): Für U8 – Handgranaten seltener, Mindestentfernung auch beim direkten Schuss <<<
**139. Nur vormerken, gehört zu U8 (mit Messung). Jetzt nichts ändern.**
1. **Handgranaten der Aschenwacht-Grenadiere** (abil `handgranate`, Punkt 34):
   - Heute mit einer Aktion und 2 Runden Abklingzeit. Weil Graben und Haus nicht schützen und das Ziel niedergehalten wird, ist Werfen fast immer besser als Schießen oder Nahkampf. Enrico: „kracht ganz schön rein“.
   - **Neu:** höchstens **einmal je Schlacht** (Merker wie `u.roared`/`u.faustUsed`), Zähler am Knopf.
   - Ein zweiter Wurf kommt später als Freischaltung über Forschung bzw. Entwicklung in der Kampagne (Punkt 137) und muss dann gut gewählt sein.
   - Preis und KI (`abilPlan`) anpassen, im Info-Text „einmal je Schlacht“.
2. **Mindestentfernung der Artillerie auch beim direkten Schuss:**
   - Heute gilt `minSteil` (Mörser/Minenwerfer `P.ART_MIN` 2, große Geschütze `P.ART_MIN_GROSS` 3) nur für das Steilfeuer.
   - Bis `P.ART_DIRECT` 3 Felder mit Sicht schießen Geschütze flach (`isDirect`) und treffen dadurch auch Gegner direkt vor sich.
   - **Neu:** Dieselbe Mindestentfernung gilt auch für den direkten Schuss. Mörser und Minenwerfer schießen ab 2 Feldern, große Geschütze (Haubitze, Geschütz, Mahlwerk u. a.) ab 3.
   - **Ausnahme:** Die Feldkanone (`direkt`) bleibt Nahschutz gegen Panzer und darf weiter auf kurze Entfernung schießen.
   - Mit eigenem Rückweg-Schalter. KI, Zielvorschau und Info-Text anpassen. Messen, denn Geschütze werden dadurch verwundbarer gegen Stürme.

# >>> NOTIZ (Enrico 2026-11-27 20:30): Mini-Kampagne mit Tutorial – Plan zusammen mit dem Kommandanten-Plan <<<
**137. Nur vormerken, nicht bauen.**
- **Warum:** Ohne Kampagne läuft das Balancing in zwei Richtungen. Einzelschlachten haben ein festes Budget, eine Kampagne hat Verluste, Erfahrung und Einkommen. Die Begrenzung starker Einheiten, Helden, Kommandanten und Kategorien soll sich nach der Kampagne richten.
- **Umfang der ersten Mini-Kampagne:** eine Hauptstadt, 2 eigene Provinzen, 1 feindliche Provinz auf einer kleinen Karte, etwa 3–5 Schlachten bis zum Sieg.
- **Zwischen den Schlachten bleibt erhalten:**
  - die Armee mit ihren Verlusten (Überlebende bleiben, Gefallene fehlen),
  - Erfahrung bzw. Veteranen,
  - der Aufstieg von Kommandant und Held (Fähigkeiten freischalten, siehe Punkt 131),
  - das Einkommen aus den Provinzen,
  - **Forschung** (Enricos Frage, im Plan ausarbeiten: z. B. starke Einheiten erst über Forschung freischalten, als Ersatz oder Ergänzung zum Seltenheits-Aufschlag).
- **Tutorial:** Die erste Schlacht wird erklärt, mit kurzen Hinweisen beim ersten Mal (Ziehen, Schießen, Deckung, Moral).
- **Vorbild für die Abläufe (Enrico 20:19):** Die Kampagnenschicht großer Strategiespiele wie Total War: Warhammer 3. Übernommen werden nur Abläufe, keine Namen, Bilder oder Begriffe. Im Plan prüfen:
  - **Auffüllen:** Angeschlagene Trupps füllen sich zwischen den Schlachten um einen Anteil je Runde auf, im eigenen Land mehr, im Feindland weniger und nach Gewaltmarsch gar nicht. Gefallene Trupps sind weg.
  - **Erfahrung:** Ränge je Trupp, die bleiben, solange der Trupp nicht ganz fällt. Nachgefüllte Männer verwässern den Rang etwas.
  - **Kommandant:** Er führt die Armee, steigt in Stufen auf und hat einen kleinen Fähigkeitenbaum. Die Armeegröße ist an ihn gebunden.
  - **Unterhalt:** Jeder Trupp kostet je Runde Sold. Starke Einheiten kosten mehr, und eine zweite Armee macht alles teurer. Das ist eine natürliche Bremse für krasse Einheiten.
  - **Ausheben:** nur in eigenen Provinzen bzw. der Hauptstadt, mit Gebäuden für bestimmte Einheitenarten. Gerät und Elite brauchen ein Gebäude oder Forschung.
  - **Forschung:** schaltet Einheiten, Verbesserungen und Fähigkeiten frei.
  - **Nach der Schlacht:** Verwundete kehren teilweise zurück, und es gibt Beute bzw. Punkte.

- **Plan:** Der Berater schreibt `entwurf/KAMPAGNE_PLAN.md` **zusammen mit** `entwurf/KOMMANDANTEN_PLAN.md`, also nach U7b und UI1 und vor U8. Grundlage: `entwurf/ARMEEAUFBAU_IDEEN.md` (dort steht schon eine Notiz zu Armeeaufbau und Kampagne). Enrico nickt den Plan ab, erst danach wird gebaut.

# >>> NOTIZ (Berater 2026-11-27 18:45): Kommandanten- und Heldensystem – nach U7 und UI1, vor U8 <<<
**131. Nur vormerken, nicht bauen.** Enrico wünscht ein System wie bei Total War: **Kommandant** = mächtige Einzelfigur, die die Armee führt und richtig mitkämpft (3 Klassen je Seite, dazu **legendäre Kommandanten**), plus **Helden** als besondere Einzelfiguren (Rote Faust, Eiserner Kürassier und später weitere). Die jetzigen Führungstrupps (Offizier mit Stab + Fahnenträger + Melder) wirken „wischiwaschi“, Rolle unklar, kämpfen nicht. Der Berater schreibt nach U7 und UI1 einen Plan zum Abnicken (`entwurf/KOMMANDANTEN_PLAN.md`); Skizze steht in `entwurf/ARMEEAUFBAU_IDEEN.md` Abschnitt 6.

# >>> JETZT (Enrico 2026-11-27 18:05): „Sehen aus wie Pappaufsteller“ – Fix F2 mit U7 Schritt 3 <<<
✓ **130. Nächster `pa` = U7 Schritt 3 (Punkt 125) + Fix F2. Einstellung: Opus, Hoch.**
Enrico (Bilder Hauptmann/General Konkordat): Die neuen Gruppen (Führung, aber auch Waffentrupps, Sanitäter, Versorgung, Fernsprech, Beiwerk aus U4 Teil 3/5) wirken wie Pappaufsteller. Fix F2:
1. **Kontaktschatten** unter jedem Gruppenteil wie bei den übrigen Trupps (auch Beiwerk), im Graben auf der Sohle.
2. **Plastik-Karten** (`figur_plastik.py --teil …`) für alle Teile aus U4 Teil 3 und 5 prüfen bzw. nachrechnen, damit Licht/Schatten wie bei den anderen Figuren wirken.
3. **Enger stellen:** Führung als Gruppe – Offizier vorn Mitte, Fahnenträger halb dahinter (leicht versetzt, überdeckt sich etwas), Melder seitlich dicht dran; alles innerhalb des Rings. Waffentrupps/Sanitäter/Versorgung ebenso etwas dichter, aber Beiwerk sichtbar lassen.
4. **Eigenbewegung:** kleine Atem-/Gewichtsverlagerung je Figur (versetzt), **Fahne weht leicht** (Tuch biegen/verzerren, wie `drawFahne`/Wimpel), nichts Wildes. Bildwirkung „aus“ = keine Bewegung.
5. **ENTFÄLLT (Enrico 18:40): kein neuer Melder malen/einbauen** – die Führungsgruppen werden später durch Kommandanten als Einzelfiguren ersetzt (Punkt 131). Für Führung nur Schatten, Plastik, enger stellen und Größe (5b). Alter Text zur Info: **Melder neu (Berater-Malauftrag über `tools/fal_bild.mjs`):** in Ruhe ein **stehender/wartender Melder**, der laufende nur beim Ziehen und bei Befehlen. Auftrag (JSON, CC passt Pfade an die echten Dateien an):
```json
[
 { "name": "konkordat_melder_steht", "ordner": "ui-quelle/figuren/konkordat",
   "refs": ["ui-quelle/figuren/konkordat/konkordat_hauptmann_gruppe.png"],
   "aspect": "1:1", "res": "2K",
   "prompt": "Draw ONLY the messenger runner from the reference (same oxblood red coat, round steel helmet, gas mask with round goggles, leather satchel, rifle slung on his back) but STANDING still and waiting: relaxed upright stance, weight on one leg, one hand on the satchel strap, head turned slightly towards the right as if awaiting orders. Single full-body figure, centred, facing right, on a flat solid magenta background (#FF00FF), no ground, no cast shadow, no text. Same hand-drawn grimdark WW1 ink illustration style and colours as the reference. No skulls, no crosses, no eagles, no emblems." },
 { "name": "aschenwacht_melder_steht", "ordner": "ui-quelle/figuren/aschenwacht",
   "refs": ["ui-quelle/figuren/aschenwacht/aschenwacht_hauptmann_gruppe.png"],
   "aspect": "1:1", "res": "2K",
   "prompt": "Draw ONLY the messenger runner from the reference (same ash-grey greatcoat, spiked helmet, gas mask with yellow goggles, leather satchel, rifle slung on his back) but STANDING still and waiting: relaxed upright stance, weight on one leg, one hand on the satchel strap, head turned slightly towards the right as if awaiting orders. Single full-body figure, centred, facing right, on a flat solid magenta background (#FF00FF), no ground, no cast shadow, no text. Same hand-drawn grimdark WW1 ink illustration style and colours as the reference. No skulls, no crosses, no eagles, no emblems." }
]
```
   Erst die Übersicht `entwurf/probe/fal/<datum>_uebersicht.jpg` im Bericht zeigen; einbauen gleich mit (Enrico sieht es dann im Spiel). Abzeichen prüfen.
5b. **Maßstab (Enrico 18:15):** Die Führungsfiguren (Offizier, Fahnenträger, Melder) sind zu klein. Größe an einen Linien-Soldaten derselben Seite angleichen (Kopfhöhe gleich, Offizier gern einen Hauch größer); dasselbe für die anderen neuen Gruppenteile kurz gegen die Linie prüfen.
6. Bilder vorher/nachher (Führung beider Seiten, ein Waffentrupp, Sanitäter, Versorgung), Video.

# >>> JETZT (Enrico 2026-11-27 17:15): Antwort zu U7 Schritt 1 – nächster `pa` = U7 Schritt 2 + Fix F1 <<<
**129. Nächster `pa`:** **U7 Schritt 2** wie in Punkt 125 und **Fix F1 (Punkt 127, Nachschub-Menü verdeckt)** mit erledigen. **Einstellung: Opus, Hoch** (Flucht/Sammeln/Verluste verschieben die Balance).
- **Antwort Kreuzschreiter:** Die KI soll „sehr seltene“ Einheiten (Kreuzschreiter, Eisenknecht, Helden) gelegentlich kaufen – **aber erst in U9** (mit Messung), nicht jetzt. In IDEEN.md bzw. U9-Liste vermerken.

# >>> JETZT (Enrico 2026-11-27 17:00): Nachschub-Menü verdeckt – Fix F1 sofort, UI-Paket UI1 nach U7 <<<
**127. Fix F1 (klein, im nächsten `pa` mit erledigen, egal bei welchem U7-Schritt; Einstellung: reicht im laufenden Modell):**
- **Nachschub/Rekrutieren auf dem Schlachtfeld:** Das Nachschub-Menü überlappt sich, der obere Teil ist kaum zu sehen (Enrico 27.11.). Prüfen bei 1280, 1920 und 2560 px (auch Vollbild): Fenster darf nicht unter die obere Leiste oder aus dem Bild rutschen, Reiter und Kopf immer sichtbar, Inhalt scrollt notfalls innen. Gespeicherte Position `arm.shoppos` beim Öffnen in den sichtbaren Bereich zurückholen. Bilder vorher/nachher.

**128. Paket UI1 – Oberfläche neu (NACH U7, nicht jetzt bauen; Berater malt erst 2–3 Entwürfe zum Aussuchen):**
Enrico (27.11.): Oberfläche „stylischer, ein Hauch mehr Grimdark“, Schrift überarbeiten, aufgeräumter, **weniger winzige Texte, mehr Symbole**; auf einen Blick erkennen „das macht die Einheit, dagegen ist sie gut/schlecht“ (Vorbild Total War: Warhammer III: Einheitenkarte mit Symbolen für Fähigkeiten/Eigenschaften/Widerstände, Text bei Bedarf **ausklappbar**, Güte-Stufe sichtbar). Dazu **neue Klickgeräusche** für Knöpfe (die jetzigen gefallen nicht). Umfang: Einheitenkarte, Nachschub-Menü, Leisten oben/unten, Knöpfe, Info-Fenster, Schriften, Knopf-Töne. Einbau erst nach Entwurfswahl. **Dazu (Enrico 18:15):** Rollen der Einheiten klarer erkennbar machen (Rollen-Schild/Symbol auf der Karte, F103 `rollen.js` sichtbarer) und die **Anordnung der Fähigkeitsknöpfe** im UI überdenken (feste Plätze je Art: Bewegen, Schießen, Fähigkeit, Befehl …).

# >>> JETZT (Enrico 2026-11-27 16:25): 23 neue Töne nur in die Auswahl – Paket T1 (vor U7) <<<
**126. Paket T1 – ERLEDIGT in einer eigenen Sitzung (Bericht `BERICHT_T1.md`). Die U7-Sitzung macht T1 NICHT noch einmal.** Hinweis an die U7-Sitzung: Der Pult-Test aus T1 hat `src/ui.js` gegen 16:26 kurz geändert und wiederhergestellt – bitte die eigene letzte ui.js-Änderung prüfen.
(alt:) **126. Paket T1 (klein, vor U7 Schritt 1; im selben `pa` erlaubt):**
In `C:\Users\erolf\Downloads\` liegen 23 mp3 von Enrico (26.11., 17:00–18:00), sprechend benannt, z. B. „Riesiges Monsterbrüllen.mp3“, „schnitt mit blut und hand abtrennung.mp3“, „Anti Panzerkanone.mp3“, „Fahlen Hexen Fähigkeit.mp3“ (alle .mp3 mit Änderungszeit 26.11. ab 17:00 außer den Stimmen-Dateien).
1. Nach `sound-quelle/enrico_2611/` kopieren (Namen behalten), robocopy-Sicherung.
2. In sound_bau.json als **neue Plätze nur zur Auswahl** aufnehmen (z. B. `e26_<kurzname>`), Pegel angleichen, Stille schneiden.
3. **Ins Ton-Pult in die passenden Rubriken der Bibliothek (`HOER`)** einsortieren, damit Enrico sie bei den Kategorien auswählen kann. Vorschlag des Beraters zur Rubrik: Monsterbrüllen → Brüllen/Stimmen Bestien; Monster stampfen, Hydraulik-Mech-Schritte → Schritte schwer/Maschine; Faustschlag, metallischer Schlag stumpf, Metall gegen Metall (3), Schwerter prallen, Schild-Block → Nahkampf Metall; Hand-Abtrennung, Körper blutig, blutiger Einschlag, Blutfontäne, Zerquetschen → Nahkampf/Treffer Fleisch; Einschlag auf Metall (2) → Treffer Fahrzeug; Feuerball-Einschlag → Flammen/Einschlag; Anti-Panzerkanone, mittlere Kanone (2), Todesschuss zisch-boom → Kanone/Geschütz; Fahlen Hexen Fähigkeit → Fähigkeiten (Fahle).
4. **Wichtig (Enrico): an keiner Einheit etwas ändern** – keine Zuordnung, keine TONWAHL, kein `slotsVon`. Nur zusätzlich in der Auswahl.
5. tonpult_bau, Pult-Test, build. Kurz im Bericht: Liste Datei → Platz → Rubrik.

# >>> JETZT (Enrico 2026-11-27 16:10): Paket U7 Moral – nach W1 <<<
**125. Paket U7 – Moral (drei Schritte, je Schritt ein `pa` mit Messung; Grundlage `entwurf/postfach/PRUEFUNG_FABLE_MORAL.md`, Abschnitt 4 und 5 – dort stehen Regeln, Konstanten und Rückwege im Einzelnen):**
**Vorab (im ersten `pa`):** die Zähler aus Fable Abschnitt 2 fest in `sim.js` aufnehmen (supp, fallback, rout nach Stärke/Moral/Kette/Gas, rally, escaped, vernichtet auf der Flucht, Sammel-Chance, Entsetzen-Wiederholungen, Moralstufen zu Rundenbeginn; Ereignisse aus endTurn/startTurn mitzählen). **Grundmessung** mit `MISCHEN=1`, vier Startwerten, Grauwall + Sankt Ruß (+ Krähenfurt), 100 Schlachten je Lauf. Dann Schritt 1.
**Enricos Entscheidungen (27.11. 16:05):**
- **Aufgerieben (Stärke < 15) = endgültig weg**, nur Panik (Moral 0) ist sammelbar. (Fable Frage 1: ja)
- **Fliehende zählen bis zum Rand halb als Verlust, die 20 Punkte erst am Rand/bei Vernichtung.** (Frage 2: ja, halb)
- **Furcht-Aura über einen Test** mit `P.FURCHT_BASIS` 0,35. (Frage 3: ja)
- **Niedergehalten: weiter kein Schuss**, in Graben/Bunker/Gebäude halbe Erholung `P.RECOVER_SUPP`. (Frage 4: ja)
**Schritt 1** (Fable 4/Schritt 1): Entsetzen höchstens einmal je Einheit und gegnerischer Runde; Furcht-Aura und Löwengebrüll über den Test (Punkt 45b), Rückweg `ENTSETZ_OFT`/`FURCHT_ALT`. Messen (auch `MECHS=1` für das Gebrüll).
**Schritt 2** (Fable Schritt 2): zwei Fluchtarten, langsamere Flucht (`P.FLUCHT_BP` 2, am Rand erst nächste Runde weg), `sammelChance` für alle Fliehenden ohne Feind daneben (allein 0,2, Deckung +0,15, Banner +0,2, Hauptmann 0,6, General 0,8, müde −0,15, max 0,9, gesammelt Moral 3,5), **Befehl „Sammeln“ auf Fliehende (Punkt 86) mit Prozent am Knopf und am Ziel**, Verlust halb bis zum Rand, Kettenflucht nur über `routUnit` und nur für Nachbarn unter `P.FALLBACK_MOR`. Fehler 2–6 aus Fable Abschnitt 1 dabei beheben (Gas-/Kettenflucht über `routUnit`, Abzüge ohne Fluchtprüfung, Zurückweichen höchstens einmal je gegnerischer Runde). Regeln und Chancen im Info-/Regeln-Fenster klar erklären (Enrico: „manchmal undurchsichtig“). KI: Sammeln-Befehl, Anführer/Banner nah an Wankende/Fliehende, fliehende Gegner nahe gegnerischer Anführer verfolgen. Rückweg `FLUCHT_ALT`. Messen.
**Schritt 3** (Fable Schritt 3): Moral in Stufen (standhaft / wankt / niedergehalten / weicht / flieht) über `moralStufe(u)`, Werte aus der Fable-Tabelle, Kopfzeichen und Moralbalken gelb bei „wankt“, Vorschau-Schlagworte, KI `W_WANKT`. Rückweg `STUFEN_ALT`. Messen.
**Nicht in U7:** `P.BREAK` (U8), `P.MOR_PER_DMG`. Nach jedem Schritt Bericht mit Messtabelle (vorher/nachher, ±-Hinweis) und Video (W1). Danach Fable-Prüfrunde für U7 (Berater schreibt den Prüfauftrag).

# >>> JETZT (Enrico 2026-11-27 15:55): Werkzeuge für schnellere Arbeit – Paket W1 <<<
**124. Paket W1 (ein `pa`, während Fable die Moral prüft; keine Regeländerung):**
1. **fal direkt aus CC (Enrico: ja):** Enrico legt einen eigenen fal-API-Schlüssel als Windows-Benutzer-Umgebungsvariable **`FAL_KEY`** an (macht er selbst; CC fasst den Schlüssel nie an, schreibt ihn nirgends hin, druckt ihn nie aus). Baue `tools/fal_bild.mjs`:
   - `node tools/fal_bild.mjs <auftrag.json>`: je Eintrag `{ name, ordner, prompt, refs: [Dateipfade oder URLs], aspect: "16:9", res: "2K" }` → Modell `fal-ai/nano-banana-2/edit` (ohne refs: `fal-ai/nano-banana-2`), lokale Referenzbilder über den fal-Speicher hochladen, Ergebnis-PNG direkt nach `ordner/name.png` speichern, Liste mit Kosten/Dauer ausgeben. Paket `@fal-ai/client` oder einfacher `fetch` mit `Authorization: Key ${process.env.FAL_KEY}`.
   - Dazu `tools/fal_ton.mjs` für Töne (`fal-ai/elevenlabs/sound-effects/v3`, `fal-ai/elevenlabs/tts/eleven-v3`), gleiche Art, mp3 nach `sound-quelle/…`.
   - Kleine Vorschau-Übersicht je Lauf (`entwurf/probe/fal/<datum>_uebersicht.jpg`), damit der Berater die Ergebnisse sieht.
   - Ohne `FAL_KEY`: klare Meldung, nichts tun. Test mit einem einzigen billigen Bild (1K, ~0,08 $) erst, wenn Enrico „Schlüssel ist da“ sagt.
   - Ab dann schreibt der Berater Malaufträge als JSON-Liste in AUFTRAG; CC erzeugt, schneidet, baut ein.
2. **Video nach jedem Paket (Enrico: ja):** `tools/video_partie.mjs` – Headless-Chrome (Vorschau-Server), KI gegen KI auf einer wählbaren Karte, 20–30 s Spielgeschehen ab Runde 2 bei 1920 px, mit Ton wenn möglich (sonst ohne), Bildrate ≥ 20, als **MP4 (H.264, -preset veryfast)** nach `entwurf/probe/video/<paket>.mp4` (unter ~15 MB). Optional Kamera auf das Gefecht (`__dbg.camSetzen`). Ab jetzt nach jedem Paket ein Video, Pfad im Bericht. Videos nicht in git (`.gitignore`), nur im Ordner.
3. **Fable-Prüfrunde fest (Enrico: ja):** in CLAUDE.md unter „Feste Regeln“ eintragen: „Nach jedem größeren Regelpaket (U7, U8, S, P, U9) prüft eine eigene Fable-Sitzung nach einem Prüfauftrag des Beraters (`entwurf/postfach/PRUEFAUFTRAG_FABLE_*.md`); nur prüfen, Ergebnis `PRUEFUNG_FABLE_*.md`.“
4. Bericht mit Testvideo (eine Partie Grauwall), Fragen.

# >>> JETZT (Enrico 2026-11-27 15:25): Sanitäter, Versorgung, Fernsprech gemalt – Paket U4 Teil 5 <<<
**123. U4 Teil 5 (ein `pa`):** Neue Bögen vom Berater (fal, 2752×1536, Magenta, Blick nach rechts). Zuerst herunterladen nach `ui-quelle/figuren/<fraktion>/`, robocopy.
1. **Sanitäter mit Trage + Verwundetem** (Element 1 = zwei Träger + Trage + Verwundeter als EIN Teil, Element 2 = Sanitäter kniend mit sitzendem Verwundetem als EIN Teil, Element 3 = Sanitäter mit Tasche):
   - `konkordat_sanitaeter_trage.png`: https://v3b.fal.media/files/b/0ab427ba/vV-SBkPesKQK3l-tay6fB_kebUluuG.png
   - `aschenwacht_sanitaeter_trage.png`: https://v3b.fal.media/files/b/0ab427bf/VGD5Y3R8jA9H50Te_Z7HY_y96Effe4.png
   Im Spiel: Trage-Gruppe hinten, Sanitäter mit Verwundetem vorn, Sanitäter mit Tasche daneben; beim Heilen kann die kniende Gruppe nach vorn. Verluste: zuerst der mit Tasche, dann die kniende Gruppe, zuletzt die Trage. **Abzeichen:** kleines weißes Kreuz auf der Konkordat-Sanitätstasche übermalen; Helmplaketten der Aschenwacht-Sanitäter prüfen (Adler?) → übermalen.
2. **Versorgungstrupps neu** (3 klar verschiedene Posen, damit sie sich nicht mehr verdecken):
   - `konkordat_versorgung_neu.png`: https://v3b.fal.media/files/b/0ab427f5/mZZvYQxomLMPzmbdSUZf7_RJwozRZB.png
   - `aschenwacht_versorgung_neu.png`: https://v3b.fal.media/files/b/0ab427f8/FO8ENBKm6xBxJjs-bPOIK_MgK5oMgO.png
3. **Fernsprechtrupp neu** (Telefonist kniend mit Hörer – das Feldtelefon bleibt das Beiwerk daneben; Kabelleger; Melder zeigt nach vorn): `konkordat_fernsprech_neu.png`: https://v3b.fal.media/files/b/0ab427fc/AU9gKos7-YUh3Q-HmfLtk_1IMNuLn4.png – Telefonist so stellen, dass sein Hörerkabel zum Beiwerk-Telefon zeigt.
4. Aufstellung so, dass das Beiwerk sichtbar bleibt (Bericht U4 Teil 3: Männer verdeckten das Telefon). ERSETZT/GRUPPE, SH wie bisher, Farbe angleichen, figur_plastik, Bilder vorher/nachher im Spiel, Partietest, `index.html`, Bericht.
5. **Danach:** Der Berater macht die Moral-Prüfung (vor U7). Kein eigener `pa` dafür.

# >>> JETZT (Enrico 2026-11-27 15:05): Löwenoger-Posen nachholen – Paket U4 Teil 4 <<<
**122. U4 Teil 4 (ein `pa`, klein):**
1. **Punkt 120.1c wurde übersehen:** die drei gemalten Löwenoger-Posen (Sprung, Prankenhieb, Getroffen) – Links und Anweisungen stehen in Punkt 120, Eintrag 1c. Herunterladen, robocopy, schneiden (beim Prankenhieb den gemalten Bewegungsbogen weg), in POSE_SETS (sprung, hieb/nahkampf, getroffen), Bild im Spiel. Die drei Köpfe bleiben gemischt wie in Teil 2.
2. **Noch nicht:** gelaende.js nachladen (später).
3. Danach malt der Berater neue Bögen für Sanitäter mit Trage (beide Seiten), Versorgungs- und Fernsprechtrupp; dann folgt die Moral-Prüfung und U7.
4. Partietest, `index.html`, Bericht.

# >>> JETZT (Enrico 2026-11-27 14:40): Neue Bögen aus Punkt 90 gemalt – Paket U4 Teil 3 (nach Teil 2) <<<
**121. U4 Teil 3 – neue Bögen einbauen (eigener `pa` nach U4 Teil 2, Punkt 120):**
Der Berater hat auf fal gemalt (je 2752×1536, Magenta, Elemente getrennt, Blick nach rechts). **Zuerst alle herunterladen** (Links nicht ewig gültig) nach `ui-quelle/figuren/<fraktion>/` mit den Namen unten, dann robocopy-Sicherung (Punkt 120.2). Enrico hat alle abgenommen.
1. **Waffentrupps „Waffe + 3 Mann“** (Waffe allein, Schütze kniend/liegend ohne Waffe, Ladeschütze, Beobachter mit Fernglas):
   - `konkordat_mg_trupp.png` (Mahlwerk, **Fassung B im Look der neuen Linie**, Enrico): https://v3b.fal.media/files/b/0ab4268c/DPGS4kbdSI9xqVNVlosnD_6QHJOZT5.png
   - `aschenwacht_mg_trupp.png` (Sensenwerk): https://v3b.fal.media/files/b/0ab42631/5WrzOiCYtUIzjHZVheufM_6nfwnI6p.png
   - `aschenwacht_panzerbuechse_trupp.png`: https://v3b.fal.media/files/b/0ab4264b/Ck59QQGNZB6pX5JZXlKX9_gXMuCZ15.png
   Im Spiel: Waffe als Gerät in die Feldmitte, Schütze hinter die Waffe (Hände an den Griffen), Ladeschütze und Beobachter daneben (bei Verlusten fällt zuerst der Beobachter, dann der Lader). Mündung (`MUZ`) neu messen. Alte Einzelbilder bleiben als Rückweg (`WAFFENTRUPP_ALT`).
2. **Führung mit 3 Figuren** (Offizier, Fahnenträger, Melder):
   - `konkordat_hauptmann_gruppe.png`: https://v3b.fal.media/files/b/0ab4264f/tx_XupixLO4AvcbyEmrOH_qcFrWnnP.png
   - `aschenwacht_hauptmann_gruppe.png`: https://v3b.fal.media/files/b/0ab42652/My4_mEgnz4GAQPc9wk4oS_mzcpMVoO.png
   - `konkordat_general_gruppe.png`: https://v3b.fal.media/files/b/0ab42656/SJC14E_VUi8e_PhroqaC0_sIMxduqw.png
   - `aschenwacht_general_gruppe.png`: https://v3b.fal.media/files/b/0ab4267b/bz3Cw3KPG5zoh-4zASS6Q_HL5gDBjR.png
   Drei Einzelfiguren statt des gemeinsamen Bildes; Posen des Offiziers (Befehl, großer Befehl) aus den vorhandenen Posenbögen weiter nutzen, Fahnenträger/Melder ohne Posen. **Abzeichen prüfen** (`ABZEICHEN`): Orden/Abzeichen an Brust und Helm des Aschenwacht-Generals und -Hauptmanns dürfen keine Kreuze sein – sonst übermalen.
3. **Scharfschütze mit Beobachter:** `konkordat_scharfschuetze_trupp.png`: https://v3b.fal.media/files/b/0ab42685/tVdNfM-o8JZncKHMcOdA0_8MsvLH1f.png – Schütze liegend links oben, Beobachter **unten rechts** nehmen (die obere rechte Figur ist eine doppelte Fassung). Prüfen, ob die Aschenwacht (Pirschjäger) auch so einen Trupp braucht → im Bericht melden, der Berater malt ihn.
4. **Beiwerk:** `beiwerk_versorgung.png`: https://v3b.fal.media/files/b/0ab42689/DMFcSNN1k0qnRRmS7jyGS_Q9OTcn0B.png – Munitionskarren und Werkzeugkiste zu den Versorgungstrupps (Munition bzw. Werkstatt), Feldtelefon mit Kabeltrommel zum Fernsprechtrupp. Als Gerät neben den Trupp ins Feld, bleibt stehen, solange der Trupp nicht zieht.
5. **Sanitäter mit Trage + Verwundetem** malt der Berater erst, wenn die neuen Sanitäterbögen aus Teil 2 geschnitten sind (Look soll passen).
6. figure_cut (Einträge, SH, Farbe angleichen), figur_plastik, Bilder vorher/nachher je Einheit im Spiel, Partietest, `index.html`, Bericht.

# >>> JETZT (Enrico 2026-11-27 13:50): Antworten zu U4 Teil 1 – nächster `pa` = U4 Teil 2 <<<
**120. U4 Teil 2 (ein `pa`):**
1. **Löwenoger bleibt bei 3 Modellen** (Enrico). Der Berater malt einen **Posenbogen im neu3-Look** (Sprung, Prankenhieb, Getroffen) – Ablage kommt später nach `ui-quelle/figuren/konkordat/`, dann eigener kleiner Schritt.
1b. **Löwenoger sehen alle gleich aus (Enrico 13:46):** Im Probebild stehen alle drei mit Gasmaske in derselben Ruhe-Pose. In Ruhe sollen die **drei verschiedenen Figuren des neu3-Bogens gemischt** stehen (Gasmaske, ruhiger Kopf, brüllend) – wie bei Trupps ohne `bereit`-Pose (jede Figur ein anderes Bild, POSE_SETS so, dass Ruhe = Grundbogen je Figur). Beim Schießen/Nahkampf dürfen sie die Posen tauschen. Bild im Spiel.
1c. **Löwenoger-Posen im neu3-Look – vom Berater gemalt (fal, 2752×1536, je EINE Figur, Magenta):** herunterladen nach `ui-quelle/figuren/konkordat/` und zu einem Posenbogen `konkordat_loewenoger_posen_neu.png` (REIHE, 3 Posen nebeneinander) zusammensetzen oder einzeln schneiden:
   - Sprung (Gasmaske): https://v3b.fal.media/files/b/0ab4260a/woLNQLU2m6Pfuer-HApFs_VudTbKr7.png
   - Prankenhieb (ruhiger Kopf): https://v3b.fal.media/files/b/0ab4260d/fFSv0U6IaAwr9LKDrxYBM_7h8pac5F.png – **den gemalten Bewegungsbogen rechts der Pranke wegschneiden** (Hieb-Effekt macht das Spiel).
   - Getroffen (brüllend): https://v3b.fal.media/files/b/0ab4260f/Fwfw-i965Gfueawpy-9iU_Pv2pemF7.png
   Einbauen in POSE_SETS (sprung, hieb/nahkampf, getroffen), Größe wie neu3 (1,25 SH, `refpose`), Farbe angleichen, figur_plastik. Bilder im Spiel. Danach robocopy (Punkt 2).
2. **Sicherung der Quellbögen (Enrico: ja, robocopy):** `ui-quelle/figuren/` (alle Fraktionsordner, auch die 38 Bögen außerhalb von git) zusätzlich nach OneDrive sichern – nur kopieren, nie löschen:
   `robocopy C:\Projekte\Armargeddon\ui-quelle\figuren C:\Users\erolf\OneDrive\Armargeddon-Sicherung\ui-quelle\figuren /E /R:1 /W:1 /NP`
   In CLAUDE.md bei „Sicherung außerhalb von git“ als dritte Zeile aufnehmen (nach jeder Änderung an Figurenbögen). Gleich jetzt einmal laufen lassen, Rückgabewert im Bericht. Prüfen, ob auch `ui-quelle/gelaende/` und `ui-quelle/effekte/` Dateien außerhalb von git haben – wenn ja, genauso sichern.
3. **Übrige abgenommene Bögen einbauen** (Liste aus dem Bericht): Sanitäter Konkordat (Grund + Posen), Flammen beider Seiten (vier Bögen), Gasschutz (Grund + Posen), Panzerknechte, Konkordat-Reiter `neu2`, Ordensschreiter (Grundbogen). Übermalungen je Bogen neu setzen und prüfen (Abzeichen, Schädel, Kreuze → keine echten Hoheitszeichen). Vorher/Nachher-Bilder je Einheit.
4. Der Berater malt danach die fehlenden Bilder aus Punkt 90 (Sanitäter mit Trage + Verwundetem, Beiwerk Munitionskarren/Werkzeugkiste/Feldtelefon, MG/Panzerbüchse als Waffe + 3 Mann, Offiziere mit 3 Figuren + Scharfschütze mit Beobachter) – Einbau dann in einem eigenen Paket.
5. Partietest, `index.html`, Bericht.

# >>> JETZT (Enrico 2026-11-27 12:50): U3 fertig – nächster `pa` = Rest U4 <<<
**119. Rest U4 (wie in Punkt 118 beschrieben) und zwei Kleinigkeiten:**
1. **Zuerst den übersehenen Punkt 118.0 nachholen:** eingestürzte Mühle – Maske nur am Boden, die Balken oben rechts **stehen lassen**; Bild im Spiel. (Stand im U3-Abschnitt, ist in U3 nicht erledigt worden.)
2. **Antworten zu U3 Teil 2:** Leuchtspur **bleibt bei 4 von 8** Schützen. Mündungsfeuer-Größe sieht Enrico heute Nachmittag beim Spielen – jetzt nicht ändern.
3. Dann **Rest U4**: Ordner je Fraktion (Punkt 53), Löwenoger `konkordat_loewenoger_neu3.png` mit Probebild **3 und 4 Modelle** (Enrico entscheidet), übrige abgenommene Bögen; Punkt 90 nur, soweit Bilder da sind – fehlende im Bericht auflisten (der Berater malt sie).
4. Partietest, `index.html`, Bericht.

# >>> JETZT (Enrico 2026-11-27 09:45): Weiterarbeiten bis nachmittags – nach ST1c Paket U3 <<<
**118. Reihenfolge, während Enrico erst nachmittags spielt („lass weiter arbeiten“):** ST1c (Punkt 117) → **U3** → Rest **U4**. Jedes Paket einzeln committen und berichten, `index.html` je Paketende. Enrico tippt `pa` bzw. `pw`.

**Paket U3 – figurennahe Effekte (BAUPLAN_UMBAU.md Abschnitt 3/5) plus Effektbögen E1–E6 (Punkt 62):**
1. Mündungsfeuer je Figur: bei 8 Figuren nicht alle blitzen lassen (Auswahl), Takt der Salve anpassen; Mündungsfeuer und Treffer-Spritzer mit Figurenfaktor (passend zur Figurengröße, nicht feldgroß).
2. Treffer-Spritzer aus ST1 (Blut je Treffer) **auf die fallenden Modelle abstimmen**: Spritzer an der Figur, die fällt; Zeitpunkt = Einschlag.
3. Helden-Effekte (Glut, Ringe, Dampf) mit Figurenfaktor; Fesselballon prüfen.
4. Nahzoom der Kampfszene/Kamerafahrt etwa ×1,2; Klickflächen (`UBOX`/pick) prüfen – auf dem Board sollen kleine Figuren gut antippbar bleiben (sonst Klick auf das ganze Feld).
5. **Effektbögen E1–E6 einbauen** wie in Punkt 62 beschrieben (Gasgranate in der Luft, großer Befehl Staubringe, Filterdampf Gasschutz, Löwenmaul, Faustsalve, Kettenklinge Kürassier).
0. **Kleiner Nachtrag zu ST1c (vorweg, Enrico 10:30):** Boden um die Mühle passt so. Bei der **eingestürzten Mühle** die Maske nur unten (Boden) wirken lassen – die Balken, die oben rechts übers Feld ragen, **stehen lassen**. Bild im Spiel (Einsturz z. B. über `__dbg`).
6. Bilder vorher/nachher je Punkt, `entwurf/probe/effekte.html` ergänzen, Partietest, `index.html`, Bericht.

**Danach Rest U4** (BAUPLAN Abschnitt 4): Ordner je Fraktion (Punkt 53), Löwenoger-Bogen `konkordat_loewenoger_neu3.png` mit Probebild **3 und 4 Modelle** (Enrico entscheidet am Bild), übrige abgenommene Bögen. Punkt 90 (6er-Sturmtrupps/Beiwerk) nur, soweit Bilder da sind – fehlende im Bericht auflisten, der Berater malt sie.
**U6 (Mehr Blut)** ist durch ST1 Punkt 6 größtenteils erledigt; Rest (Winter dunkler, kleinere Flecken) später nur, wenn Enrico beim Spielen etwas fehlt.

# >>> JETZT (Enrico 2026-11-27 09:40): Überlappung ist die Windmühle – Nachtrag ST1c <<<
**117. Nachtrag ST1c (klein, ein `pa`):**
1. **Nicht die Kirche, sondern die Windmühle überlappt (Enrico 09:36):** Grauwall, Mühle auf Feld (5,6) (Feldart `muehle`, Bild `windmuehle_bogen`, G6). Sie ragt über andere Teile drüber. Prüfen: Tiefensortierung der Mühle (hoher Turm + Flügel) gegen Nachbarfelder dahinter/davor, Gräben, Draht, Figuren; Größe/Fußpunkt; ob die Flügel ins Nachbarfeld ragen und dort Teile verdecken, die davor liegen müssten. Mühle ggf. etwas kleiner oder in Teile (Sockel/Turm, Flügel) mit eigener Tiefe zerlegen. Auch den Einsturz-Zustand (`muehle_kaputt`) und Krähenfurt (falls dort eine Mühle steht) prüfen. Bilder vorher/nachher bei mittlerem und nahem Zoom.
   **Genauer (Enrico 09:37): „Am Boden überragt sie“** – also der **Sockel/Fuß** der Mühle ist breiter als ihr Feld und liegt unten über den Nachbarfeldern (Boden, Gräben, Draht). Hauptsache: Grundfläche der Mühle auf ihr Feld begrenzen (Sockel schmaler skalieren oder Bild am Fuß beschneiden), Fußpunkt in die Feldmitte; der Turm darf nach oben ragen.
2. Kirche bleibt so (keine Überlappung gefunden).
3. Partietest, `index.html`, Bericht.

# >>> JETZT (Enrico 2026-11-27 07:30): Antworten zu ST1 – Nachtrag ST1b <<<
**116. Nachtrag ST1b (ein `pa`):**
1. **Kirche überlappt – Sankt Ruß:** Enrico hat es auf Sankt Ruß gesehen. Gezielt suchen: Kirchenschiff/Turm (Felder 8,5 / 9,5 / 9,4) gegen die Nachbarfelder (Häuser, Friedhof, Platz, Straße) in der Spielansicht bei mittlerem und nahem Zoom, aus verschiedenen Kamerawinkeln; Tiefensortierung der großen Gebäudeteile gegen Nachbarteile und Figuren prüfen (`drawTilt`, Teile-Tiefe, `cfg.bauten`). Bilder vorher/nachher.
2. **Schwebende Kisten – im Graben:** Kram-Teile in den Grabendurchgängen (seitlicher Versatz) – Vermutung aus ST1 prüfen: in engen Durchgängen nicht über die Sohle hinaus versetzen, Fußpunkt auf die Sohle. Alle Gräben auf allen Karten absuchen (Grauwall, Sankt Ruß, Krähenfurt), notfalls Kram nur dort, wo genug Platz ist. Bilder vorher/nachher.
3. **Sankt Ruß 51 → 40 %: Ursache finden und ausgleichen**, Ziel wieder etwa 50 %. Schrittweise gegen den Stand nach R4d messen (`MISCHEN=1`, gleiche Startwerte): Kategorie „sehr selten“, Elite-Abschlag/Budget, Ballon-Kategorie, U4a/114-Änderungen, ST1-Blut usw. – was die Quote verschiebt, im Bericht als Tabelle. Dann ausgleichen (Kartenarmee, `MAP.ki`, Budget – nicht die Grundregel).
4. **+25 % Aufschlag bleibt** (Enrico).
5. Partietest, `index.html`, Bericht.

# >>> JETZT (Enrico 2026-11-26 23:40): Spieltest-Funde – Paket ST1 (nach U4a) <<<
**115. Paket ST1 – Funde aus Enricos erster Spielrunde (eigener `pa` NACH U4a, nicht im laufenden):**
1. **Kirche überlappt andere Teile (Sankt Ruß):** Die Kirche ragt über benachbarte Gelände-Teile/Häuser drüber. Tiefenreihenfolge und Grenzen der Kirche prüfen; Bild vorher/nachher.
2. **Schwebende Kisten:** vereinzelte Kisten (Kram-Teile) schweben in der Luft. Fußpunkt der Kram-Teile prüfen (auf Boden/Grabensohle setzen), alle Karten absuchen, Bilder.
3. **Begrenzung neu: Aufschlag statt Sperre (Enrico):** Die festen Obergrenzen (Elite höchstens 3, Gerät 2–3) führen dazu, dass man später nur noch Linie nachkaufen kann. Neu: **keine harte Grenze für Elite und Gerät**, stattdessen kostet **jede weitere Einheit derselben Kategorie, die gleichzeitig auf dem Feld steht, +25 %** (1. normal, 2. +25 %, 3. +50 % …; gefallene zählen nicht). Anzeige im Nachschub-Menü und in der Armee-Auswahl („+25 % Seltenheit“), Rechnung im Info-Fenster. Rückgrat-Regel für Unterstützung (1 je 2 Linie) bleibt vorerst. Werte in P (`P.KAT_AUFSCHLAG`), Rückweg `KAT_SPERRE_ALT`. KI kauft nach Preis. Messung `MISCHEN=1` alle drei Karten.
4. **Neue Kategorie „sehr selten“** für **Helden und Stufe-3-Schreiter** (Kreuzschreiter, Eisenknecht), weil es später mehrere geben wird: eigene Kategorie mit eigenem Schild, je Armee weiter höchstens einer je Einheit (wie heute), Kategorie bereit für mehr.
5. **Fesselballon nicht mehr „Gerät“**, sondern **Unterstützung** (nimmt der Artillerie keinen Geräteplatz weg). (Annahme des Beraters, Enrico hat nicht ausdrücklich gewählt.)
6. **Mehr Blut (Enrico):** Bei Treffern durch Beschuss an Infanterie kommt kein Blut; im Nahkampf erst ganz am Schluss. Neu: **bei jedem Treffer an Fußtruppen/Reitern** (Gewehr, MG, Splitter, jeder Nahkampf-Schlag) ein kleiner Blutspritzer an der getroffenen Figur, beim Ausfall eines Mannes ein größerer + Blutfleck am Boden. Gepanzerte/Fahrzeuge: Funken statt Blut. Bleibt über den Blut-Schalter abschaltbar. Bilder.
7. **Feldsymbole nah herangezoomt zu groß** (Folge von 84.2): Obergrenze deutlich senken, sodass sie nah nicht riesig wirken; Bilder bei nah/mittel/fern.
9. **Neuer Aschenwacht-Panzer ersetzt den Sturmpanzer (Enrico 27.11. 06:10):** `ui-quelle/figuren/reskin/aschenwacht_panzer_neu.png` wurde vom Berater **neu abgelegt** (gleicher Name): Turmschütze jetzt im Look der neuen Linie (Pickelhaube, Gasmaske mit gelben Augengläsern), Abzeichen am Helm entfernt. Neu schneiden und als Bild des **Sturmpanzers** (`sturmpz`, bisher `aschenwacht_panzer`) einsetzen – Werte bleiben. Mündungen neu messen: Bugkanone = `MUZ`, Turm-MG oben = Zweitwaffe (`MUZ2`, bisher mittlere Bordschützen-Luke); Seitenluken-MGs dürfen bleiben. Rot-weißer Streifen vorn **bleibt** (Enrico). `aschenwacht_koloss` aus U4a wieder entfernen (Aschenwacht hat keinen Landkoloss). figur_plastik, Vorher/Nachher-Bild im Spiel.
8. Partietest, `index.html`, Bericht mit Fragen.

# >>> JETZT (Enrico 2026-11-26 23:30): Antworten zu V3 Teil 2 – mit U4a erledigen <<<
**114. Nachtrag zu V3 (im selben `pa` wie U4a, Punkt 113):**
1. **Alte Stimmen gleich raus (Enrico 23:30):** alte Stimmdateien aus `src/sound.js` bzw. `sound_pult.js` entfernen (Suno-Anklicken, alte Panik/Sanitäter/Befehlsrufe, `hst_*`, `sst_*`, `_gm/_gs/_bf/_mr`-Fassungen der abgelösten Plätze) und den Rückweg `STIMMEN_ALT` ausbauen. Kampfschrei `cry`, Schmerzlaute, Husten, Atmen bleiben. Die **Quelldateien in `sound-quelle/` bleiben liegen** (nicht löschen), Rückweg nur über git. Danach sound_bau, ton_teilen, tonpult_bau, Pult-Test; Ton-Spur ist nicht nötig, solange keine Abspielstelle geändert wird.
2. Häufigkeit/Lautstärke und fehlende Rufstellen beantwortet Enrico nach der Spielpause – jetzt nichts ändern.
3. **Alter Sanitäter-Ruf noch zu hören (Enrico 23:30, Aschenwacht):** Im Spiel war bei der Aschenwacht noch der alte „Sanitäter“-Ton zu hören – der soll ganz weg. Alle Wege suchen, über die er noch kommt: Heilen/Verbinden des Sanitäter-Trupps (`heiler`, `medic`-Platz, `heal`-Ereignis), Pult-Wahlen in `TONWAHL`, die noch auf alte Sanitäter-Töne zeigen, `RUF_STANDARD`, `stimmVar`-Fassungen `medic_gm` usw. Stattdessen der neue Ruf (`A_*_verwundet` bzw. beim Heilen nichts Gesprochenes oder ein neuer Sanitäter-Spruch aus `A_erscheinen_heiler_*`-Stimme A2). Im Bericht sagen, wo er herkam. Gleich auch beim Konkordat prüfen.

# >>> JETZT (Enrico 2026-11-26 23:00): Paket U4a – neue Figuren vorziehen (nach V3) <<<
**113. Paket U4a (ein `pa`, direkt nach V3 Teil 2; der Rest von U4 und U3 bleibt für später):**
Enrico will vor der Spielpause den neuen Look im Spiel haben. Alle Bilder liegen in `ui-quelle/figuren/reskin/` (siehe LIESMICH dort):
1. **Linie beider Seiten (Punkt 92):** `konkordat_soldat_reskin.png` + `konkordat_soldat_posen_reskin.png` ersetzen `konkordat_soldat` / `_posen`; `aschenwacht_soldat_reskin.png` + `aschenwacht_soldat_posen_reskin.png` ersetzen `aschenwacht_soldat` / `_posen`. Gleiches Raster 2×2 und gleiche Posen, also `POSE_SETS`/SH weiter gültig; `ENTROSA`, beim Aschenwacht-Grundbogen den winzigen Wappen-Rest unter dem Arm oben rechts mit `ABZEICHEN` übermalen. Klone für Truppgröße 8 wie bisher.
2. **Landkoloss Aschenwacht:** `aschenwacht_panzer_neu.png` ersetzt `aschenwacht_koloss` (Einzelmodell, Blick nach rechts, Bugkanone = `MUZ`, Turm-MG/Seitenluken = Zweitwaffe). Größe wie der bisherige Koloss, Kettenschatten, `KETTE_FILTER`.
3. **Prüfen:** Sturmbrecher und Schwere Grabenwacht zeigen im Spiel die **Kürassierhelm-Fassung** (Stand 17:10/17:20, gleiche Dateinamen) – falls noch die ältere geschnitten war, neu schneiden.
4. **Grabenräumer:** die vierte Figur aus `konkordat_sturm_getroffen.png` als dritte Getroffen-Fassung zuordnen (Punkt 108.5).
5. Danach `figur_plastik.py` für alle neuen Bögen, Porträts (`portraitKey`) prüfen, Vorher/Nachher-Bilder (Linie beider Seiten im Feld und im Graben, Landkoloss), Partietest, `index.html`, Bericht. Keine Regeländerung, also kein sim nötig.

# >>> JETZT (Enrico 2026-11-26 22:45): Antworten zu V3 Teil 1 – Teil 2 Einbau <<<
**112. Paket V3 Teil 2 (ein `pa`):**
1. **Heldensprüche neu:** Der Berater hat alle 28 Kürassier-Zeilen (`A_held_kuerass_*`) und `K_held_faust_getroffen_1/2` neu erzeugt, diesmal mit sicherer Zuordnung (Ergebnis-Spieler statt Verlaufsliste). Liste **`entwurf/postfach/stimmen_urls_nach1.csv`** (`id;url`). Herunterladen, die alten Dateien gleicher id ersetzen, robocopy, filtern (`helm`), Längenprüfung wiederholen. Auffälliges im Bericht.
2. **Filter passt so** (Enrico hat die Tonprobe gehört) – keine Änderung.
3. **„Befehl bestätigt“ beim Ziehen etwa jedes zweite Mal**; Anwählen wie heute über den Beutel ohne Wiederholung.
4. **Einbau wie geplant:** alle alten Sprüche raus (Suno-Anklicken, alte Panik/Sterben/Rufe, `hst_*`, `sst_*`), neue Plätze je Sprecher und Anlass (sound_bau, `HOER`, `slotsVon`, Ton-Spur), neue Abspielstellen aus dem Plan (Erscheinen, Zielfeld, Schilde, Gegenstoß, Dauerfeuer, Panzer getroffen/Panne, Koloss gesichtet …), Abstand je Einheit, Vorrang für verwundet/Rückzug/Panik. Rückweg `STIMMEN_ALT`, alte Dateien bleiben liegen.
5. „Angriff!“ (`A_fuehrer_befehl_sturm_2` / `A_fuehrer_angriff_2`) bleibt, ist nur lang gerufen; Stille ist ja abgeschnitten.
6. **Ton-Spur (`ton_spur.mjs`, ca. 25 Min.) nur EINMAL, ganz am Ende nach dem kompletten Einbau** (Enrico 22:50) – nicht nach Teilschritten, nicht für die Heldensprüche allein. Danach `test_tonplaetze`, Partietest, `index.html`, Bericht mit Fragen.

# >>> JETZT (Enrico 2026-11-26 22:25): V2 fertig – Paket V3 Stimmen einbauen <<<
**111. Paket V3 – neue Stimmen einbauen (ein `pa`, Teilschritte einzeln committen):**
V2 ist fertig: der Berater hat **alle 608 Zeilen** aus `entwurf/stimmen_texte.csv` auf fal.ai (ElevenLabs Eleven v3) erzeugt, roh ohne Filter. Liste: **`entwurf/postfach/stimmen_urls.csv`** (Spalten `id;url`, id = Zeile der Text-CSV).

1. **Herunterladen:** alle 608 mp3 nach `sound-quelle/Voices/eigene/el/<konkordat|aschenwacht>/<id>.mp3` (K_ = konkordat, A_ = aschenwacht). Die fal-Links sind nicht ewig gültig – gleich als Erstes laden. Danach `sound-quelle` per robocopy sichern (CLAUDE.md).
2. **Prüfen, ob jede Datei zum Text passt:** Die Zuordnung lief über die Ergebnisliste der fal-Seite; einmal waren zwei Zeilen vertauscht (nachgebessert). Bitte grob prüfen: Länge der Datei gegen Textlänge (Ausreißer melden). Wenn ein Spracherkenner da ist (z. B. whisper), stichprobenartig 30 Dateien abhören lassen. Auffällige ids im Bericht – der Berater erzeugt sie neu.
3. **Eine Textänderung:** `K_held_faust_angriff_3` war vom Inhaltsfilter gesperrt („Hit them hard.“) – gesprochen ist jetzt **„Push forward.“**. In `tools/stimmen_plan.py`/CSV nachziehen.
4. **Filter bauen** (Kette aus Punkt 109.5, Python, im Stil von `tools/stimmfilter.py`): `funk` = Schlachtfunk; `bordfunk` = Schlachtfunk + mehr Rauschen; `maschine` = Maschine (wie `_mr`) + leichter Schlachtfunk; `helm` = Schlachtfunk etwas weniger Kamm, dafür hohler Helmklang. Eiserne Hünen bekommen je Einheit `maschine`, obwohl sie die `A_sturm_*`-Zeilen teilen (eigene gefilterte Fassungen). Ruhe am Anfang/Ende abschneiden, Lautstärke angleichen.
5. **Einbauen:** neue Tonplätze je Sprecher und Anlass (sound_bau, Pult-Bibliothek `HOER`, `slotsVon`, Ton-Spur). Alle alten Sprüche (Suno-Anklicken, alte Panik/Sterben/Ruf-Plätze, alte Heldenstimmen `hst_*`, Schreiter `sst_*`) werden abgelöst; Rückweg-Schalter `STIMMEN_ALT`. Alte Dateien nicht löschen.
6. **Neue Abspielstellen** aus dem Plan: Erscheinen (beim Aufstellen/Nachschub), Zielfeld genommen, Schilde, Gegenstoß, Dauerfeuer, Panzer getroffen/Panne, Koloss gesichtet usw. Nicht zu oft: je Einheit Abstand, Wichtiges (verwundet, Rückzug, Panik) hat Vorrang.
7. **Hörprobe zuerst:** vor dem Einbau in `tonprobe.html` eine Gruppe „Neue Stimmen“ (je Sprecher 6 Sprüche, roh und gefiltert). Enrico hört sie sich nach dem Bericht an.
8. Danach Partietest, `index.html` am Ende, Bericht mit Fragen.

# >>> JETZT (Enrico 2026-11-26 21:10): Antworten zu V1b – Nachtrag V1c <<<
**110. Nachtrag V1c (klein, nur Text, nichts bauen):**
1. **Eiserne Hünen bleiben Maschine:** ihre Zeilen behalten Sprecher A3 (Bill, schroff), bekommen in V3 aber den **Maschinenfilter** statt Schlachtfunk (wie heute `_mr`, darüber leichter Schlachtfunk). In der CSV eine Spalte `filter` ergänzen: `funk` (Standard), `maschine` (Hünen, Schreiter), `helm` (Helden), `bordfunk` (Panzer/Kolosse).
2. **Löwenoger: nur Brüllen**, keine Worte (so lassen, keine Zeilen).
3. **Helden neu sprechen, gleich mit:** Rote Faust = **K5 Bill** (Englisch), Eiserner Kürassier = **A5 Liam** (Deutsch), Filter `helm`. Für jeden Anlass, den die Heldenstimmen heute haben (`HELD_ST`, Plätze `hst_faust_*`/`hst_kuerass_*`), 2–4 neue kurze Texte, dazu Erscheinen 2. Sachlich, grimmig, keine Verherrlichung. Ids `K_held_faust_<anlass>_<n>` bzw. `A_held_kuerass_<anlass>_<n>`.
4. **Schreiter** (`sst_*`): gleich behandeln – Kreuzschreiter K5 Bill, Eisenknecht A5 Liam, Filter `maschine`; Texte für die heutigen Schreiter-Anlässe. Ids `K_schreiter_…` / `A_schreiter_…`.
5. **Die bestehenden 552 Zeilen NICHT umbenennen, umnummerieren oder umtexten** – der Berater erzeugt sie schon (Dateiname = id). Neue Zeilen nur anhängen; im Bericht die Liste der neuen ids.
6. Im Bericht: Anzahl neuer Zeilen und Zeichen.

# >>> JETZT (Enrico 2026-11-26 20:55): Stimmen nach Hörprobe 3/4 – Nachtrag V1b <<<
**109. Nachtrag V1b – Stimmen-Plan anpassen (nur Text, nichts bauen):**
Enrico hat vier Hörproben gehört (Berater, fal.ai ElevenLabs Eleven v3). Ergebnis:

1. **Alle alten Sprüche werden ersetzt** (Suno, frühere ElevenLabs-Sprüche) – keine Mischung alt/neu.
2. **Sprache:** **Konkordat spricht Englisch** (auch Blaue Legion, sie nutzt die Konkordat-Stimmen), **Aschenwacht spricht Deutsch.** Alle Texte des Konkordats in `entwurf/stimmen_texte.csv` und `STIMMEN_PLAN.md` auf **Englisch** umschreiben (kurz, militärisch, an die Welt angepasst – „For the Crown“ ist ok, keine echten Länder-/Ortsnamen). Deutsche Texte der Aschenwacht bleiben, nur auf 5 Sprecher verteilen.
3. **5 Sprecher je Seite** (statt 3), feste Zuordnung über die Kategorien aus K1:
   | Sprecher | Einheiten | Konkordat (EN) | Aschenwacht (DE) |
   |---|---|---|---|
   | 1 Linie | Linien-Infanterie, Rückgrat | Brian | Charlie |
   | 2 Unterstützung | MG, Artillerie, Mörser, Pioniere, Sanitäter, Versorgung, Beobachter, Ballon, Fachtrupps | Daniel | Callum |
   | 3 Sturm/Elite | Sturmtrupps, Schwere, Grabenräumer, Sturmbrecher, Oger/Hünen, Panzerknechte | Callum | **Bill, schroff** |
   | 4 Reiter | Reiter, Lanzen, Stahlreiter | George | Will |
   | 5 Anführer + Panzer | Hauptmann, General, Bannerträger; Panzer/Kolosse (Bordfunk) | Bill | Liam |
   Helden (`hst_*`) und Schreiter-Maschinenstimmen (`sst_*`) bleiben eigene Gruppen; Vorschlag für sie im Plan, ob sie mit Sprecher 5 (Held) bzw. Sprecher 5 + Maschinenfilter (Schreiter) neu gesprochen werden.
   Spalte `sprecher` in der CSV: `K1`…`K5`, `A1`…`A5`. Zuordnung jeder Einheit (TYPES-Schlüssel) zu ihrem Sprecher als eigene Tabelle in `STIMMEN_PLAN.md`.
4. **Sprechweise (für die Erzeugung):** tief, rau, abgehackt, wenig Gefühl – Richtung StarCraft 2 / Command & Conquer / Dawn of War 1, nicht „gespielt“. Rufen/Schreien nur bei Not (Rückzug, Sanitäter, unter Beschuss, Hilfe, Panik, schwer verwundet). Neue Spalte `ton` in der CSV: `ruhig` oder `ruf` (der Berater setzt dann den Schrei-Hinweis).
5. **Filter „Schlachtfunk“ für ALLE Einheiten beider Seiten** (Enrico: „volles Brett in dieser Tiefe“) – ersetzt die leichte Funk-Gasmaske und später auch `_gm/_gs/_bf/_mr`. Vorlage aus der Hörprobe des Beraters (WebAudio, zum Nachbauen in Python für sound_bau / stimmfilter):
   Tonhöhe ×0,86 (tiefer und langsamer) → Hochpass 260 Hz → Low-Shelf 300 Hz +4 dB → Glocke 1100 Hz Q 1,4 +7 dB → Sättigung tanh k = 5,5 → Tiefpass 2900 Hz → Kompressor (−28 dB, 8:1, Attack 3 ms, Release 120 ms) → dazu Kammfilter (Verzögerung 6 ms, Rückkopplung 0,45, Anteil 0,5) für den metallischen Klang; Funkrauschen (Bandpass 2200 Hz, leise) über die ganze Länge und ein kurzer Rauschklick (60 ms) am Anfang. Panzer/Kolosse etwas mehr Rauschen (Bordfunk). In V1b nur im Plan festhalten, gebaut wird in V3.
6. **Ablage für V2:** `sound-quelle/Voices/eigene/el/<konkordat|aschenwacht>/<id>.mp3`, `id` wie in der CSV. Der Berater erzeugt roh (ohne Filter); der Filter kommt in V3.
7. Am Ende im Bericht: Anzahl Zeilen je Sprecher und grobe Zeichenzahl gesamt (für die Kosten auf fal, ca. 0,10 $ je 1000 Zeichen).

# >>> JETZT (Enrico 2026-11-26 20:25): Antworten zu R4c – Nachtrag R4d, dann V1 <<<
**108. Nachtrag R4d (klein):**
1. **Fehler Stahlreiter-Position:** Im Bild `entwurf/probe/r4c/stahlreiter_vorher_nachher.jpg` (rechts) stehen die drei Reiter **ein ganzes Feld zu weit oben** (auf dem Graben), ihr Ring darunter ist leer. Mit dem neuen Bogen stimmt der Fußpunkt nicht (Bildhöhe/Schnitt/Fußlinie, `massSlots3` oder SH). Beheben, sodass die Hufe im eigenen Feld stehen wie bei allen Trupps; Bild im offenen Feld und am Graben.
2. **Farbe der Stahlreiter passt** (Enrico), so lassen.
3. **Krähenfurt-Zielwerte übernehmen:** Dorfplatz 3 → 2, Gehöft 1 → 3 (gemessen 59 %). Kurze Gegenmessung.
4. **Elite je −5 übernehmen:** Stahlreiter 55, Grabenräumer 60, Sturmbrecher 115, Löwenoger 110, Schwere Grabenwacht 30, Hünen 85 (Panzerknechte entsprechend −5). Info-Fenster-Rechnung „Elite-Abschlag −5“.
5. **Vierte Grabenräumer-Figur** (zweite Getroffen-Variante) später in U4 als dritte Fassung – jetzt nicht.

Danach **V1 – Stimmen-Plan (Punkt 102)**: nur Liste, Texte, `stimmen_texte.csv`, keine Töne bauen.

# >>> JETZT (Enrico 2026-11-26 19:55): Antworten zu K1 – Bilder, Elite-Messung, Krähenfurt <<<
Antworten: (1) Zuordnung der Zweifelsfälle **passt so** (Hauptmann Selten, Sprenglanze/Pirschjäger/Scharfschützen Unterstützung, Ballon Gerät). (2) Neue Kartenarmeen **bleiben so**. (3) Elite-Abschlag **messen** (Punkt 107). (4) Reihenfolge wie unten.

**In diesem `pa`:**
1. **R4b-Rest (106.4 und 106.6):** Die Bilder liegen jetzt bereit (Berater 19:45): neuer `konkordat_stahlreiter_reskin.png` (massivere Pferde, ohne Rotschimmer – im Spiel nicht röter/heller machen) und `konkordat_sturm_getroffen.png` (2×2: oben links Getroffen mit Schild, oben rechts Getroffen mit Keule, unten links geduckt hinter dem Schild = gute „Schilde vor“-Pose, unten rechts zweite Getroffen-Variante). Einbauen, Vorher/Nachher-Bilder.
2. **107. Elite günstiger messen:** je Elite-Typ einzeln −5 bzw. −10 Punkte (`MISCHEN=1`, alle drei Karten), Vorschlag mit Zahlen; erst nach Enricos Antwort fest übernehmen.
3. **105. Krähenfurt-Check** (wie beschrieben: Hecken (7,4), (10,6) und Dorfplatz-Mauer (8,5) einzeln abschalten, außerdem prüfen, ob es an der Karte selbst liegt, z. B. Aufstellungszonen, Zielfelder, Eis/Furt) – Ziel gemischt unter ~70 %, Vorschlag.
Bei Platzmangel nach Schritt 1 oder 2 Zwischenstand und aufhören.

# >>> JETZT (Enrico 2026-11-26 19:30): Antworten zu R4 – Nachtrag R4b, dann K1 <<<
**106. Nachtrag R4b:**
1. **„MG gegen Reiter ×2“ gilt NICHT für die gepanzerten Stahlreiter** (Enrico: sie sollen auch gegen MG zäh sein, ×0,5). Für ungepanzerte Reiter (Sprenglanzen-Reiter) bleibt die Regel.
2. **Stahlreiter Preis 50 / Abwehr 3 bleiben** (Feinabgleich U9).
3. **„Zwei Schläge“ einbauen für Stahlreiter und Löwenoger:** zweiter Nahkampfschlag ×0,6, wenn der Gegner danach noch steht; Preis je +10 (Stahlreiter 60). Schlagwort/Medaille und im Nahkampfbild ein zweiter Schlag sichtbar. Kurz messen (`MISCHEN=1`).
4. **Stahlreiter-Bogen wird NEU gemalt (Enrico 19:26: Pferde massiver – Beine, Rumpf, Proportionen).** Der Berater legt ihn als `konkordat_stahlreiter_reskin.png` neu ab (gleicher Name, 3 Posen in einer Reihe). **Neuer Bogen liegt bereit (Berater 19:40, Enrico „passt“):** massivere Kaltblut-Pferde, Panzerung rostiges Eisen/Braun, Rot nur als Akzent – der Rotschimmer ist schon im Bild behoben. Neu schneiden (gleiche 3 Posen); im Spiel **nicht aufhellen oder röter machen**, Vorher/Nachher-Bild. Früher stand hier: **weniger grell:** Im Spiel wirken sie viel greller rot als im gemalten Bogen – Farbe/Sättigung näher an den Bogen bringen (Aufhellung/Plastik prüfen), Vorher/Nachher-Bild.
5. **Sturmbrecher-Ruhe mischen:** nicht 4× Granatwurf in Ruhe; z. B. 2× MG hüfthoch, 2× Spaten, 1× Granatwurf, 1× ruhigste Pose – abwechslungsreich; Wurf-Pose vor allem beim Wurf.
6. **Grabenräumer-Getroffen:** malt der Berater (Ablage folgt als `ui-quelle/figuren/reskin/konkordat_sturm_getroffen.png`); einbauen, sobald sie da ist, bis dahin alte Figur.

Danach **K1** (Punkt 104).

# >>> JETZT (Enrico 2026-11-26 18:45): Antworten zu R4 Teil 1 – Rest von R4 <<<
Antworten: (1) Sturmbrecher **ohne** den Zielfeld-Faktor des alten Eingreiftrupps – richtig so. (2) Preise 120 / 65 passen (Feinabgleich U9). (3) **Ja**, eigene Pult-Zeile „Angriff (Ruf des Pferds)“ für Lanzenreiter und Stahlreiter, Standard = `stahlreiter_wiehern1`. (4) Krähenfurt: nach K1 kurz prüfen (Punkt 105).

**In diesem `pa`:**
1. Neue Bögen der zusammengelegten Trupps einbauen (`aschenwacht_sturm_reskin.png`, `konkordat_sturm_reskin.png`, figure_cut, figur_plastik, Posen; Truppgröße 6).
2. Pult-Zeile „Angriff (Ruf des Pferds)“ (siehe oben), Ton-Spur, `tonpult_test`.
3. Punkt 97 Stahlreiter mit Bogen `konkordat_stahlreiter_reskin.png` (3 Modelle), Messung, Vorschlag „öfter zuschlagen/schießen“ mit Zahlen (nicht fest einbauen). Lanzenreiter-Tonwahl auf die Stahlreiter übertragen.
Bei Platzmangel nach Schritt 2 Zwischenstand und aufhören.

**105. Krähenfurt-Check (nach K1):** gemischt 87–91 % für das Konkordat. Hecken (7,4), (10,6) und die Mauer am Dorfplatz (8,5) einzeln abschalten und messen, dann Vorschlag (versetzen oder weg). Fest bleibt der Maßstab, gemischt soll unter ~70 % kommen.

# >>> JETZT (Enrico 2026-11-26 18:15): Antworten zu R3 – weiter mit Paket R4 (Regeln) <<<
**Reihenfolge in diesem `pa` (bei Platzmangel nach Schritt 2 Zwischenstand committen und aufhören, Sparregel 5):**

**0. Punkt 101 zuerst:** Pferdetöne herunterladen und ablegen (Liste unter Punkt 101; dampf1 nicht nehmen). Gleich ins Ton-Pult als Auswahl stellen und vorläufig den **Lanzenreitern** zuordnen (Anwählen = maske_schnauben2 bzw. schnauben, Angriff = wiehern, Bewegung = galopp-Schleife, Getroffen = aufbäumen), damit Enrico sie schon im Spiel hört.

**1. Punkt 103 – Nacharbeit R3 (Antworten Enrico 18:15):**
- **Krähenfurt:** die Sandsäcke am Gehöft (14,3) entfernen, der Rest der Kanten bleibt. Neu messen.
- **Bild = Regel:** Die Gartenmauern in Sankt Ruß und die Sandsäcke an der Schanze in Grauwall, die heute nur Bild sind, werden echte Kantendeckung (Mauer ×1,7 bzw. Sandsäcke ×1,5, nur über die Kante, an der sie stehen). Messung danach.
- **Werte bleiben:** Sandsäcke ×1,5, Mauer ×1,7, Hecke ×1,25.
- **Sommerhecke:** malt der Berater, Ablage folgt in `ui-quelle/gelaende/neu_hecke/`. Bis dahin auf Grauwall/Sankt Ruß keine Hecken.

**2. Zusammenlegungen 94 (Aschenwacht-Sturm) und 96 (Konkordat-Grabenräumer)** wie in den Notizen beschrieben, mit den neuen Bögen aus `ui-quelle/figuren/reskin/` (Truppgröße 6). Messung mit `MISCHEN=1`.

**3. Punkt 97 – Stahlreiter** (3 Modelle, Bogen `konkordat_stahlreiter_reskin.png`), mit Messung; dazu der Prüfauftrag „öfter zuschlagen/schießen“ als Vorschlag mit Zahlen (nicht fest einbauen).

Danach: V1 (Stimmen-Plan), dann U3.

# >>> JETZT (Enrico 2026-11-26 17:35): Antworten zu U5c – Nachträge, dann R3 <<<
**Zuerst diese Nachträge (klein), dann im selben `pa` R3 (Deckung an der Feldkante).**

**98. Gefallene ganz weglassen (Enrico 17:30).** Die liegenden Figuren aus Punkt 93 machen das Bild unruhig. Fällt ein Mann aus einem Trupp, verschwindet er einfach – keine liegende Figur, keine Bodenspur. Code bitte nur abschalten (Schalter, z. B. `GEFALLEN_AN`, Standard aus), nicht löschen. Der gemalte Bogen `ui-quelle/figuren/reskin/gefallene_bogen.png` wird jetzt **nicht** eingebaut, aber **auf keinen Fall löschen** – Enrico gefällt er, vielleicht später (in IDEEN.md vormerken). Blut-/Krater-Bodenspuren bei Einschlägen bleiben wie sie sind.

**99. Meldegänger: 1 Modell**, der Hund ist Beiwerk (läuft mit, zählt nicht).

**100. Gepanzerte Infanterie: 3 Modelle** (Panzerknechte, Hünen, Löwenoger; Stahlgänger fallen mit Punkt 97 weg). Hauptmann/General: 3 Modelle, Bild bleibt bis U4 ein gemeinsames Bild – einverstanden. MG/Panzerbüchse: einverstanden, Bild bis U4.

Nach den Nachträgen kurz `sim.js 100` Grauwall (ein Startwert), dann R3 wie geplant.

**104. Einheitenkategorien und Rückgrat-Regel im Gefecht (Enrico 18:30) – Paket K1, eigener `pa` nach R4:**
Grundlage: `entwurf/ARMEEAUFBAU_IDEEN.md` (Teile 1, 2 und 4). Später trägt das bis in die Kampagne.
- **Kategorie je Einheit** in TYPES: `kat: 'linie' | 'unterst' | 'elite' | 'geraet' | 'selten'` (Zuordnung wie in der Tabelle; Zweifelsfälle im Bericht auflisten). Sichtbar als kleines Schild im Nachschub-Menü und in der Armee-Auswahl, mit freien/belegten Plätzen je Kategorie.
- **Grenzen** in `armyOk`/`canBuy` (Armee-Auswahl und Nachschub): Linie mindestens ein Drittel der Trupps; **Unterstützung: 1 Platz je 2 Linientrupps (Rückgrat-Regel)**; Elite höchstens 3; Gerät höchstens 2–3; Selten je 1 wie heute. Werte in P, Rückweg-Schalter (z. B. `KAT_ALT`).
- **Noch keine Fraktions-Doktrinen** (Teil 3) – erst die gemeinsamen Grenzen messen; Doktrinen danach einzeln in eigenen kleinen Schritten.
- **Kartenarmeen und KI** halten sich an dieselben Grenzen (Standardarmeen ggf. anpassen, Budget gleich lassen).
- **Messung:** `sim.js` mit `MISCHEN=1` vorher/nachher auf allen drei Karten, Siegquote, Runden, Verluste je Kategorie; Bericht mit Vorschlag, ob Elite je Punkt etwas günstiger werden darf (weil knapp).

**102. Stimmen einheitlich „Funk-Gasmaske“ + alle Rufe (Enrico 17:58) – Paket V in drei Schritten:**
- **Ziel:** Alle menschlichen Einheiten klingen nicht wie normale Menschen, sondern wie durch Gasmaske und Funk (blechern, leicht kratzig, „Vox“ – wie die Einheitenrufe in alten Echtzeit-Strategiespielen). Je Fraktion wenige feste Sprecher, damit es wie aus einem Guss klingt. Maschinen/Schreiter behalten ihre Maschinenstimme.
- **Stilvorgabe von Enrico (18:08), für Texte (V1), Erzeugung (V2) und Filter (V3):** Kurze, entschlossene Einheitenrufe wie militärische Bestätigungen – diszipliniert, professionell, leicht rau, gleichmäßiges Tempo, wenig Gefühl. Klang wie über ein Kopfhörer-Funkgerät: leichtes Rauschen, milde Kompression, etwas mehr Mitten, weniger Bass. Englische Beispiele aus Enricos Vorlage: „Ready.“ „Affirmative.“ „Moving out.“ „Target locked.“ – bei uns **auf Deutsch und an die Welt angepasst** (z. B. „Bereit.“, „Verstanden.“, „Rücken vor.“, „Ziel erfasst.“ – Vorschläge in V1). **Ausnahme:** Bei Not dürfen sie rufen/schreien – Rückzug, Sanitäter, unter Beschuss, Hilfe, Panik, schwer verwundet – dann lauter und gehetzter, aber mit demselben Funk-Klang.
- **Alle Anlässe sollen einen Ruf haben**, mit mehreren Varianten (nicht immer derselbe Satz, auch verschiedene Tonlagen): Anwählen (Anklicken), Ziehen/Befehl bestätigt, Angriff, Rückzug, Panik/Flucht, schwer verwundet, Sammeln, Tod/aufgerieben, **Erscheinen** (Nachschub/Aufstellung: kurze Vorstellung wie „Grabenräumer, zur Stelle!“ – darf je Einheit eigen sein).
- **V1 (CC, ein `pa`, nur Text):** Tabelle `entwurf/STIMMEN_PLAN.md`: je Fraktion (Konkordat, Aschenwacht; Blaue Legion = Konkordat-Stimmen) × Einheitengruppe × Anlass → welche Rufe es heute gibt (aus TONWAHL/HOER/`RUF_STANDARD`, Liste fehlender Sprachbefehle aus Paket F nutzen), was fehlt, und **deutsche Sprechtexte** für alles Fehlende (kurz, 1–5 Wörter, sachlich, Krieg nicht verherrlichen; je Anlass 3–4 Varianten; Erscheinen je Einheit 2 Varianten). Dazu Vorschlag: 2–3 Sprecher je Fraktion (Alter, Tonlage), welche Einheit welchen Sprecher bekommt. Am Ende eine Datei `entwurf/stimmen_texte.csv` (Spalten: id, fraktion, sprecher, anlass, einheit, text), die der Berater direkt in ElevenLabs abarbeiten kann.
- **V2 (Berater):** erzeugt **über fal.ai** (Enricos Guthaben liegt dort, nicht bei ElevenLabs direkt; fal bietet ElevenLabs Eleven v3 Text-zu-Sprache und den Voice Changer) die neuen Sprüche (Text-zu-Sprache) und schickt vorhandene Suno-Sprüche durch den **Voice Changer** auf die festen Sprecher; Ablage `sound-quelle/Voices/eigene/el/<fraktion>/<id>.mp3`.
- **Hörproben zuerst (Enrico 17:59):** Nach den ersten Proben (V2) bekommt Enrico eine kleine Hörprobe (je Fraktion ein Sprecher, 3–4 Rufe, mit und ohne Filter) und entscheidet, bevor alles erzeugt wird. Auch in V3 vor dem Einbau eine Hörprobe in `tonprobe.html`.
- **V3 (CC, ein `pa`):** einbauen (sound_bau, Plätze, Pult-Bibliothek, `slotsVon`, Ton-Spur), Ruf beim **Erscheinen** neu einhängen, und **ein gemeinsamer, kräftigerer Filter „Funk-Gasmaske“** für alle menschlichen Stimmen (Bandpass, leichte Sättigung, Masken-Resonanz, dezentes Knistern; Stärke je Klasse: Linie leicht, Sturm/Schwer mittel, Panzerbesatzung Bordfunk). Vorher/nachher-Hörprobe in `tonprobe.html`. Vorhandene Filter (`_gm/_gs/_bf/_mr`) dabei ablösen, Rückweg-Schalter.

**101. Pferdetöne für die Stahlreiter (Berater 17:58, gehört zum Regel-`pa` mit Punkt 97, nur Ablage + Pult):** Mit ElevenLabs SFX v3 (fal) erzeugt, 10 MP3 (44,1 kHz, 128 kbit). Bitte herunterladen (curl/node, die Adressen sind öffentlich) nach `sound-quelle/stahlreiter/<name>.mp3`, in `CREDITS.md` vermerken (ElevenLabs Sound Effects über fal.ai, KI-erzeugt), danach wie gewohnt per `sound_bau.json` als neue Plätze `stahlreiter_<name>` bauen und in der Ton-Pult-Bibliothek (`HOER`, Gruppe Reiter) zur Auswahl stellen. Enrico wählt dann selbst im Pult. Vorschlag für die Zuordnung: Anwählen = schnauben, Angriff = wiehern, Bewegung = galopp (Schleife), Getroffen = aufbäumen, Dampf zum Mischen.
- schnauben1 https://v3b.fal.media/files/b/0ab40a07/OIPNjod7KGzglXpEqw3-f_sound_effect.mp3
- schnauben2 https://v3b.fal.media/files/b/0ab40a09/3R4UBc9koV280iZVEyq1N_sound_effect.mp3
- wiehern1 https://v3b.fal.media/files/b/0ab40a0a/KeLS0fl6TKjYN_B56KHP8_sound_effect.mp3
- wiehern2 https://v3b.fal.media/files/b/0ab40a0b/s0ELNkGPENRlMN1STHsQh_sound_effect.mp3
- galopp1 (Schleife) https://v3b.fal.media/files/b/0ab40a0b/ZcvwB2eT1pawrrhGAfrQv_sound_effect.mp3
- galopp2 (Schleife, drei Pferde) https://v3b.fal.media/files/b/0ab40a0c/SDNhbNoyt2RO5vRLYxXgv_sound_effect.mp3
- aufbaeumen1 https://v3b.fal.media/files/b/0ab40a0c/adPmLAs1OQu2PknmUvpO7_sound_effect.mp3
- aufbaeumen2 https://v3b.fal.media/files/b/0ab40a0d/jUgG0gUF2mMpbNpoAOM3n_sound_effect.mp3
- ~~dampf1~~ (Enrico 18:03: klingt zu metallisch – nicht nehmen)
- dampf2 https://v3b.fal.media/files/b/0ab40a0e/oovybpE0OJuZRYQJarmWp_sound_effect.mp3
- maske_schnauben1 (durch Gasmaske, Ventile) https://v3b.fal.media/files/b/0ab40a3e/5rmGN7UpdAq9egktx1Y-f_sound_effect.mp3
- maske_schnauben2 (durch Vox-Gitter, mechanisch) https://v3b.fal.media/files/b/0ab40a3f/EtblvK6-EGsqs5eXvE4Ph_sound_effect.mp3
- maske_wiehern (durch Gasmaske/Vox) https://v3b.fal.media/files/b/0ab40a40/1JQ2TqUEGuP-98OF6DYB5_sound_effect.mp3
**Gleich im nächsten `pa` (vor den Nachträgen) nur herunterladen und ablegen**, damit die Adressen nicht verfallen; Einbau später mit Punkt 97.

**97. Schwere Reiter des Konkordats (Enrico 17:28) – NICHT jetzt bauen, Regel-`pa` vor U4 (zusammen mit 94 und 96):**
- **Lanzenreiter (`reiter`) und Stahlgänger-Trupp (`stahl`) werden ein Trupp:** schwere, gepanzerte Reiter. Enrico: Die Stahlgänger sahen gut aus, hatten aber wenig Wirkung („ein bisschen laufen, ein bisschen schießen“); der Sturmlauf war das Beste daran.
- **Regeln:** Klasse `cav`, **3 Modelle** (Enrico 17:33: große, gepanzerte, mechanische Monster-Reiter, deshalb weniger als die 6 normalen Reiter; Stärke je Trupp bleibt gleich, nur weniger Figuren, Aufstellung im Feld 2 vorn/1 hinten), Ansturm ×1,5 wie bisher, **leicht gepanzert** wie die Stahlgänger (Gewehr, MG, Klinge ×0,5 über die FAK-Tabelle), **Sturmlauf** (`abil: 'rush'`), **kein Gewehr** (rng 0), Bewegung wie Reiter. Kein `mech` → kein Kampfmaschinen-Schalter nötig. Preis aus den Werten (wird teurer als die Lanzenreiter). `stahl` aus SHOP und Armeen nehmen (Typ im Code lassen oder mit Rückweg-Schalter), Rolle/Chronik/Schlagworte anpassen. Name: Vorschlag „Stahlreiter“ (Enrico kann ändern). Messung mit `MISCHEN=1`, Siegquote, Verluste je Typ.
- **Idee dazu (Enrico 17:31), im selben Regel-`pa` prüfen:** Manche Einheiten sollen **öfter zuschlagen oder schießen** können (z. B. schwere Reiter zwei Schläge, ähnlich Dauerfeuer der Hünen). Vorschlag mit Messung machen, welche Einheiten dafür passen; erst nach Enricos Antwort fest einbauen.
- **Bild:** Der Berater malt den Bogen (Enricos Vorlagen: Idee wie `Gemini_Generated_Image_n21l5u…` – Dampfrohre am Rücken, Pferdemasken mit Gitter, Umhang –, Zeichenstil wie `…5tmmgq…`). **Fertiger Bogen (Enrico 17:49 „passt“): `ui-quelle/figuren/reskin/konkordat_stahlreiter_reskin.png`** – 3 Posen nebeneinander (REIHE, Blick nach rechts): Trab mit gesenktem Zweihänder, Galopp-Angriff mit erhobenem Schwert, halb aufbäumend mit Seitenhieb. Reiter: offener Mantel, Gasmaske, Rohre am Rücken; Pferd voll gepanzert mit Visier-Schlitzmaske. 3 Modelle = je eine Pose. Entwürfe 1–3 und Enricos Vorlagen in `kavallerie_vorlagen/` (nur Archiv). Bis dahin die alten Reiterbilder.

# >>> NOTIZ (Enrico 2026-11-26 16:30): Aschenwacht-Sturmtrupps zusammenlegen, Schildträger neu – gehört in U4 (nicht in U5c) <<<
- [x] **94. Sturmbrecher und Eingreiftrupp werden eine Einheit (Enrico 16:28/16:30).**
  - Die neue Einheit ist der **Sturmbrecher-Trupp** (Schlüssel `sturm` bleibt, `eingreif` entfällt).
  - Er kann alles aus beiden: Handgranaten, Panzergranate, Draht schneiden, Gegenstoß. Er ist nahkampfstark und hat 6 Mann (Punkt 90).
  - Etwas teurer: Preis neu über costParts, Rechnung im Info-Fenster.
  - Im Bild trägt ein Mann ein **schweres MG hüfthoch mit Munitionsgurt**. Das ist nur Bild, keine eigene Fernwaffe.
  - **Anpassen:** Kartenarmeen, Nachschub, KI-Wunschlisten und abilPlan, Rollen, Chronik-Text, Ton-Pult-Zeilen (Wahlen des Eingreiftrupps sinnvoll auf den Sturmbrecher übertragen, im Bericht auflisten), Schlagworte.
  - `sim.js` auf allen Karten, nacheinander starten.
  - Bild: ein neuer Bogen vom Berater. Bis dahin der heutige Sturmbrecher-Bogen.
- [ ] **95. Schwere Grabenwacht (Schildträger) im Look der neuen Linie (Enrico 16:30).**
  - Rüstung, Mantel und Maske wie die neue Aschenwacht-Linie.
  - **Schilde bleiben wie heute** (Enrico 16:31: nicht rechteckig, denn das Konkordat hat schon die rechteckigen Sturmschilde).
  - **Helm** wie das Aschenwacht-Wappen bzw. die Eisenknechte, mit **T-förmigem Sehschlitz** (Kreuzschlitz ohne oberen Teil).
  - Bild vom Berater.
- [x] **96. Konkordat: Grabenräumer und Schildwall werden eine Einheit (Enrico 16:32).**
  - Die neue Einheit ist der **Grabenräumer-Trupp** (Schlüssel `raeumer` bleibt, `schildwall` entfällt).
  - Er kann alles aus beiden: nahkampfstark, Handgranaten, Draht schneiden, „Schilde vor“. Er hat 6 Mann.
  - Etwas teurer, Preis über costParts.
  - Im Bild tragen einige Mann die rechteckigen Sturmschilde mit Löwe, die anderen Keule bzw. Granate und Gewehr.
  - **Stahlgänger bleiben** als eigene Einheit, Enrico überlegt deren Fähigkeiten und Ausrüstung noch.
  - Anpassen wie bei 94: Armeen, Nachschub, KI, Rollen, Chronik, Pult-Zeilen (Wahlen übertragen, Liste in den Bericht), sim auf allen Karten nacheinander.
- **Bilder liegen bereit (Berater 16:45):** `ui-quelle/figuren/reskin/`, siehe die LIESMICH dort. Linie beider Seiten (Grund- und Posenbogen), Aschenwacht-Sturmtrupp (zusammengelegt, mit MG), Schwere Grabenwacht (T-Visier), Konkordat-Grabenräumer (zusammengelegt, mit Sturmschilden) und Gefallene (3 je Seite).
- **Reihenfolge:** 94, 95 und 96 gehören in **U4** (neue Bögen) bzw. als eigener kleiner Regel-`pa` direkt vor U4. Nicht in U5c.

# >>> JETZT (Enrico 2026-11-26 16:35): Antworten zu U5b – weiter mit U5c (Truppgrößen) <<<
1. **Wie die Gefallenen liegen:** Der Berater malt eigene liegende Posen im neuen Stil (Punkt 92/93). Bis dahin bleibt die gedrehte Figur.
2. **3 Runden liegen bleiben:** passt.
3. **Blutflecken unter den Gefallenen:** erst in U6, richtig so.
4. **Punkt 90 (Truppgrößen in sieben Gruppen) fehlt in U5b.** Er ist der nächste `pa` als **U5c**:
   - Regel (`modelle()`) und Anzeige so wie in der Tabelle unter Punkt 90.
   - Bis die Bilder da sind, mit Klonen bzw. Wiederholung der vorhandenen Posen.
   - Unklare Zuordnungen nicht raten, sondern als Frage in den Bericht.
   - `sim.js 100` Grauwall mit zwei Startwerten, fest und gemischt, nacheinander starten.
   - index.html am Ende.

Danach R3 (Deckung an der Feldkante) → U3 → U4 … wie in der Paketliste.

# >>> JETZT (Enrico 2026-11-26 16:30): Gefallene sehen aus wie Matschflecken – und neuer Look der Fußtruppen (Reskin) <<<
- [ ] **93. Gefallene (Enrico 16:11, gehört sofort in U5b):** Die liegenden Modelle in `entwurf/probe/u5b/*_viele.jpg` sind die **gequetschten Standfiguren** und wirken wie rote, matschige Streifen.
  - **Sofort in U5b:** Nicht mehr flach drücken. Stattdessen die **Getroffen-Pose um etwa 80–90° auf die Seite drehen** (Füße zur Seite, je Figur zufällig links/rechts, leicht verschieden), dunkler und etwas entsättigt, mit kleinem Schatten darunter. Sie bleibt liegen und verblasst wie geplant.
  - Rückweg `GEFALLEN_QUETSCH`. Bilder vorher/nachher im Offenen, im Graben und im Schnee.
  - **Später:** Der Berater malt **echte liegende Gefallene** im neuen Stil (Punkt 92), etwa 6 Posen je Seite. Dann ersetzen sie die gedrehte Pose (Einbau in U4).
- [ ] **92. Neuer Look der Fußtruppen – Reskin (Enrico 16:12–16:15, gehört in U4).**
  - **Umfang eingeschränkt (Enrico 16:19):** Neu gemalt werden nur die **Linie beider Seiten** (Schützenkohorte, Aschengrenadiere) und bei der Aschenwacht zusätzlich **Schwere Grabenwacht** (`aschenwacht_schwer`) und **Sturmbrecher** (`aschenwacht_sturm`). Bei den übrigen Konkordat-Einheiten schaut Enrico noch. **Der Rest bleibt, wie er ist**, damit sich die Einheiten auch optisch unterscheiden. Also etwa 10–14 Bögen statt 60.
  - Vorlagen: `entwurf/konzept_neu/reskin/` (`vorlage_aschenwacht_gemini.jpg`, `vorlage_konkordat_gemini.jpg`, `vorlage_konkordat_maske.png`).
  - **Aschenwacht:** wie `vorlage_aschenwacht_gemini.jpg`:
    - Pickelhaube, Gasmaske mit gelben Augengläsern und Schlauch, Plattenrüstung über dem Mantel, Gewehr mit Trommelmagazin und Bajonett.
    - **Adler und Eisernes Kreuz kommen raus** und werden durch das Aschenwacht-Wappen ersetzt. Das macht der Berater beim Malen.
  - **Konkordat:** Rüstung wie die Figur **oben rechts** in `vorlage_konkordat_gemini.jpg` (Plattenrüstung, Löwe auf der Brust, roter Mantel).
    - **Helm** wie die kniende Figur unten (flacher Stahlhelm mit Krempe).
    - **Maske** wie `vorlage_konkordat_maske.png` (geschlossene Gesichtsplatte mit grünem Sehschlitz und Atemschläuchen).
    - **Gewehr** wie in diesem Bild (Holz, Kastenmagazin, Bajonett).
  - **Enrico:** **Auch die Standard-Infanterie trägt die volle Rüstung.** Die Unterscheidung zu Kampfanzügen läuft über Größe, Form und den Panzerwert (Paket P), nicht über „ohne Rüstung“.
  - **Ablauf:**
    1. Der Berater malt **zuerst je Seite einen Probebogen der Linie** (Grundbogen und Posenbogen, mit den alten Posen als Vorlage, damit Schnitt und Posen passen).
    2. Enrico prüft im Spiel.
    3. Erst dann die übrigen etwa 60 Bögen.
    4. Einbau in U4 in mehreren `pa`.
  - Getroffen-Posen und Gefallene kommen im neuen Stil mit.

# >>> JETZT (Enrico 2026-11-26 16:20): Neue Gliederung der Truppgrößen (U5b) und Panzer-Paket P (vor U9) <<<
Enrico: Sturmtrupps sehen mit 3 Mann zu dünn aus, kleine Trupps mit 2 noch dünner. Er möchte die Einteilung feiner und später ein Panzerungssystem wie in Helldivers.

- [ ] **90. Truppgrößen in sieben Gruppen (Enrico 16:20, gehört in U5b).** Gilt für Regel (`modelle()` in engine.js) **und** Anzeige (`massNF`/`massZahl` in ui.js):

  | Gruppe | Figuren | Einheiten |
  |---|---|---|
  | Linie | 8 | Schützenkohorte, Aschengrenadiere |
  | Sturm/Nahkampf | 6 | Grabenräumer, Sturmbrecher, Eingreiftrupp, Schildwall, Schwere Grabenwacht |
  | Waffentrupp | Waffe + 3 Mann | Mahlwerk, Sensenwerk, Panzerbüchse, Flammentrupp, Brandwerfer |
  | Fachtrupp | 4 | Graben-/Drahtpioniere, Mineure, Gasschutz, Signal-, Fernsprechtrupp, Pirschjäger |
  | Kleine Gruppe + Beiwerk | 2–3 + Gegenstand | Feldscher/Aschenpfleger (2 Träger **mit Trage und Verwundetem**), Versorgungstrupps (2 + Munitionskarren bzw. Werkzeugkiste), Scharfschütze (Schütze + Beobachter), Meldegänger + Hund, Bannerträger, Hauptmann/General (Offizier + Fahnenträger + Melder) |
  | Gepanzerte Infanterie | 2–3 große Figuren | Stahlgänger, Panzerknechte, Hünen, Löwenoger |
  | Einzelmodell | 1 | Geschütze, Mörser, Minenwerfer, Feldkanone, Fahrzeuge, Schreiter, Helden, Ballon |

  - **Beiwerk:** Trage, Karren, Kiste und Feldtelefon zählen **nicht** als Modell. Sie bleiben stehen, wenn die Männer fallen.
  - Gibt es noch kein Bild (Trage, Karren, 6er-Sturmbogen), kommt es in **U4**. Bis dahin werden vorhandene Posen **wiederholt bzw. als Klone** gezeigt (U2-Klone), damit die Zahl schon stimmt.
  - Reiter bleiben 6. Gibt es Abweichungen in der Tabelle (z. B. eine Einheit fehlt oder passt besser woandershin), **nicht raten**, sondern die vollständige Zuordnung aller Einheiten als Tabelle in den Bericht unter „Fragen an Enrico“.
  - Die Regel ändert sich: Ein Mann eines 6er-Trupps entspricht etwa 16,7 Stärke, Splitter gelten ab 2 Modellen. Deshalb danach `sim.js 100` auf Grauwall mit zwei Startwerten, fest und gemischt (nacheinander starten!), Werte in den Bericht.
- [ ] **91. Paket P – Panzerung und Durchschlag als Treppe 0–5 (Enrico 16:20, eigenes Paket vor U9, nach S).** Vorbild Helldivers 2.
  - **Panzerwert (PW):**
    - 0 Fußtruppen;
    - 1 Schild/Schutzpanzer (Schildwall, Schwere Grabenwacht);
    - 2 Kampfanzug (Stahlgänger, Panzerknechte, Hünen, Oger, Helden);
    - 3 Schreiter (Orden, Säger, Klaue, Turm);
    - 4 Panzer (Landkoloss, Sturmpanzer, Bohrkoloss);
    - 5 Stufe 3 (Kreuzschreiter, Eisenknecht).
  - **Durchschlag (DS):**
    - 1 Gewehr/MG;
    - 2 Scharfschütze, Schrot nah, Kettenschwert;
    - 3 Panzerbüchse, Haftladung, Panzersäge;
    - 4 Feldkanone, Panzergranate, Löwenmaul-Kanone;
    - 5 schwere Haubitze, Sprengladung.
  - **Wirkung:**
    - DS > PW: voller Schaden (roter Treffer).
    - DS = PW: halber Schaden (weißer Treffer).
    - DS < PW: abgeprallt, kein Stärkeschaden, Moral und Niederhalten wirken weiter. Kopfzeichen „abgeprallt“.
  - **Zusätze:**
    - Flanke und Heck von Fahrzeugen und Schreitern: PW −1.
    - Sprenggranate: DS 2, aber Fläche und gegen Deckung.
    - Flamme: DS 1, aber ohne Deckung und mit starker Moralwirkung.
  - **Ersetzt** die Tabelle `FAK`/`panzerKl`/`waffeArt` und die Medaillen. Anzeige: Schild mit Zahl an der Einheit, Spitze mit Zahl an der Waffe, beides in Vorschau, Einheitenkarte und Info-Fenster.
  - **Nahkampfwert sichtbar:** Schwert 1–3 auf der Einheitenkarte (aus `nahRolle`: Sturm 3, Linie 2, Geschütze/Sanitäter/Melder 1).
  - KI-Ziele danach, Rückweg `PANZER_ALT`, Balance-Test auf allen Karten (vier Startwerte, nacheinander).
  - Vorher als **G1-artige Probe**: Liste aller Einheiten mit PW/DS/Nahkampf und Vergleich alte Faktoren gegen neue, dann Enricos Blick.

# >>> JETZT (Enrico 2026-11-26 16:00): Antworten zu U5a – weiter mit U5b <<<
1. **Feuerkraft:** **Fassung 1, weiche Stufen** gilt (100–70 voll, 69–40 → 75 %, unter 40 → 50 %). Fassung 2 (`KRAFT=traeger`) darf als Schalter für Messungen bleiben, im Spiel ist sie nicht erreichbar.
2. **Deckung** (offen ×1,4, Deckung ×1,5 stärker) und **Splitter** ×1,3: so lassen.
3. **Stärke stufenlos**, ein Modell fällt beim Unterschreiten seiner Schwelle: einverstanden.
4. **Sankt Ruß** (fest 47,5 %): erst in U9 abgleichen.
5. **Hinweis zu den Abstürzen** (Node 26, Segmentation fault bei parallelen sim-Läufen): sim-Läufe künftig nacheinander statt parallel starten, wenn die Zeit reicht, oder höchstens zwei gleichzeitig. Im Bericht vermerken, falls wieder einer abstürzt.

**Nächster `pa` = U5b, Darstellung** (Bauplan Abschnitt 3a):
- Fallende Modelle sichtbar: Beim Treffer mit `fall` kippt bzw. sinkt die passende Figur um. Sie bleibt liegen und verblasst nach einigen Runden.
- Blut-Schalter beachten.
- Die stehenden Figuren rücken nicht sprunghaft um.
- Im Graben liegen die Gefallenen auf der Sohle.
- Fahrzeuge und Schreiter: kein Umfallen, das kommt in U8 bzw. als Wrack.
- Bilder für den Bericht: ein Trupp vor/nach Beschuss im Offenen und im Graben, Schnee (Krähenfurt).
- Partietest, Leistung kurz messen (viele liegende Figuren!). index.html am Ende.

# >>> JETZT (Enrico 2026-11-26 15:05): Antworten zu SP-3 – Paket SP fertig, weiter mit U5 <<<
**Antworten zu SP-3:**
1. **Salve** 1,4 s mit den etwas weiter auseinanderliegenden mittleren Schüssen: passt.
2. **Streifschuss** für MG- und andere Einheiten im Pult: nicht nötig, keine lange Ton-Spur.
3. **Ordensschreiter:** Kein Einschlag vor dem Kettenschwert, ein Ton reicht.
4. Die **9 neuen stummen Zeilen** unter „Gelände und Gebäude“ und die Trennung der Trommel (Erobern bzw. Rundenschild der Aschenwacht) wählt Enrico selbst im Pult. Kein Auftrag an CC.

**Nächster `pa` = U5 Schaden über Modelle**, so wie im Bauplan `entwurf/BAUPLAN_UMBAU.md` (Abschnitte 3a, 8, 10a, Tabelle Zeile U5):
- Modelle fallen und bleiben liegen.
- Die Figurenzahl zeigt die Stärke (Linie 8, Reiter 6, Spezialtrupps 3; seit R1).
- Splitter.
- Deckung stärker.
- Punkt 43.
- Pannen kürzer.
- Rückweg `MODELLSCHADEN_ALT`.
- **Feuerkraft: beide Fassungen messen** (weiche Stufen 100–70 / 69–40 / unter 40 gegen „Waffenträger“). Enrico entscheidet am Ergebnis, mit Bildern und Zahlen im Bericht.
- **Zwischenmessung nach Abschnitt 10a:** Ø Runden, Siegquote je Seite fest und gemischt, Schaden je Typ, Flucht/Panne, Art der Siege.
- Darf in **U5a** (Regeln und Messung) und **U5b** (Darstellung: fallende Modelle, Bilder) geteilt werden. Jeder Teil einzeln committen und berichten, index.html am Ende des jeweiligen Teils.
- CC-Stufe: Hoch empfohlen, weil viele Regeln betroffen sind.

# >>> JETZT (Enrico 2026-11-26 14:25): Antworten zu SP-2 – weiter mit SP-3 <<<
1. **Balance:** so lassen (Grauwall 54 %, Sankt Ruß 57,5 %). Der feine Abgleich kommt in Paket S bzw. U9.
2. **Bunker** schützt gegen Sturmrollen wie der Graben: bleibt so.
3. **Mörser 40 Punkte:** passt.
4. **Salve:** Der Nachtrag `0bd6d5b` (ein Schuss je Figur) ist erledigt. **Neu (Enrico 14:32):** etwas ruhiger, Abstände **0,15–0,3 s**, die Mitte weiter 1–2 halb überlappend, Ziel **etwa 1,4 s** für einen vollen Trupp. Neue Dauer für einen vollen und einen halben Trupp in den Bericht.

**Nächster `pa` = SP-3:**
- 84.3: Liste der Ereignisse ohne passenden Ton, mit Vorschlag je Ereignis, damit Enrico im Pult wählen kann. Das Erobern eines Zielfelds muss einen Ton bekommen.
- 84.10: Der Ordensschreiter bekommt Kettenschwert-Töne (Fleisch und Metall), dazu den neuesten Pult-Export einbauen.
- Punkt 4 oben.

Am Ende index.html einchecken. Danach geht es laut Plan mit **U5** weiter.

# >>> JETZT (Enrico 2026-11-26 13:50): Antworten zu SP-1 – weiter mit SP-2 <<<
1. **Salve:** **Jede aktive Figur schießt genau einmal**, nicht 1–2-mal. So war es gemeint. Die Abstände aus SP-1 bleiben. In den Bericht: neue Dauer für einen vollen und einen halben Trupp. Das ist nur Anzeige, der Schaden bleibt gleich. Gehört mit in SP-2.
2. **Symbole bei der ganzen Karte:** passen so.
3. **Ruckeln General gegen Panzer:** Enrico achtet beim Spielen darauf und meldet den Ort. Bis dahin nicht weiter suchen.

**Nächster `pa` = SP-2:**
- 84.4 Sturmrollen gegen den Graben;
- 84.7 Rauchwerfer weg, der Mörser bekommt Rauchmunition und wird teurer;
- Punkt 1 oben.

`sim.js` Grauwall mit vier Startwerten gemittelt, dazu Sankt Ruß. index.html am Ende.

# >>> JETZT (Enrico 2026-11-26 11:20): Antworten zu G7h-2 – weiter mit Paket SP (in drei Teilen) <<<
**Antworten zu deinen Fragen aus G7h-2:**
1. **Hausruinen über Eck:** passen, bleiben.
2. **Lattenroste:** etwas **wärmer** (brauner) und **weniger Blauglanz** in den Pfützen, damit der Steg nicht wie ein Gleis wirkt. Gehört in SP-1.
3. **Draht-Module:** **dichter, 5–6 je Feld**. Schlammflecken und Drahtrollen sollen sich überlappen, damit ein geschlossener Gürtel entsteht und keine Leiter. Die Drahtlinien von Pfahl zu Pfahl dichter. Gehört in SP-1.

**Paket SP wird in drei `pa` geteilt.** Jeder Teil wird einzeln committet und berichtet, index.html jeweils am Ende des Teils.
- **SP-1, Darstellung und Ablauf (nächster `pa`):**
  - 84.1 Ruckeln beim Nahkampf des Generals gegen einen Panzer;
  - 84.2 Feldsymbole wachsen mit dem Zoom, mit Grenzen;
  - 84.5 Schleifen und Schuss nach Rundenende;
  - 84.6 Salve dichter;
  - 84.8 und 84.9 Kamera folgt immer und bleibt, bis der Schaden zu sehen ist;
  - 84.11 Geschütze und MGs nicht zu früh grau;
  - die **Sankt-Ruß-Bremse** (30 ms je Bild, Ursache finden; G7h-2 misst dort schon 6,2 ms bei ganzer Karte, also zuerst prüfen, ob sie überhaupt noch da ist);
  - der **Geländehinweis** halb hinter der Fähigkeitenleiste;
  - dazu die Punkte 2 und 3 oben.
- **SP-2, Regeln:**
  - 84.4 Sturmrollen gegen den Graben: kein Wegstoßen, wenig Schaden, niedergehalten.
  - 84.7 Rauchwerfer streichen, der Mörser bekommt Rauchmunition und wird teurer.
  - Mit `sim.js` auf Grauwall und Sankt Ruß, Grauwall mit vier Startwerten gemittelt.
- **SP-3, Töne:**
  - 84.3 Ereignisse ohne passenden Ton auflisten.
  - 84.10 Ordensschreiter mit Kettenschwert, dazu den neuesten Pult-Export einbauen.

# >>> JETZT (Enrico 2026-11-26 10:00): Antworten zu G7h-1 – weiter mit G7h-2 <<<
- **Laufsteg (deine Frage 1):** Der Code-Steg wirkt wie eine **breite, helle Treppe** (`gelaende_g7h/grauwall_leer_nah.jpg`).
  - Der Berater hat **gerade Lattenroste** gemalt: `ui-quelle/gelaende/neu_g7h/graben_laufsteg_bogen.png`, 4 Streifen, Zeilen in der LIESMICH.
  - In G7h-2 einbauen: etwa **0,35 R breit**, entlang der Mitte gekachelt, nur drehen und nie scheren, dunkel wie der Grabenboden.
  - Der Code-Steg bleibt als Rückweg.
- **Sonst G7h-2 wie geplant:**
  - Draht-Module für Gürtel in die Tiefe.
  - Hausruinen (über Eck, mit Rückweg).
  - Querwand-Blöcke, die halb neben dem Graben sitzen, korrigieren.
  - Ende des Sandsackwalls.
  - Scharfschützen im Graben.
  - Bild mit Panzer im Graben: Die Probe muss ihn finden.
  - Messung „85 % der Grabenfläche in Grabenfeldern“.
  - Punkt 84.12 kurz prüfen.
  - **Am Ende index.html einchecken.**
- Grauwall jetzt 43 % für das Konkordat: nicht hier ausgleichen, das ist Paket S.

# >>> JETZT (Enrico 2026-11-26 06:25): Bilder für G7h sind gemalt – `pa` = G7h <<<
Die Bilder liegen in `ui-quelle/gelaende/neu_g7h/`. In `LIESMICH.md` dort stehen Kästen, Zeilen und Hinweise.
- **G7-3b Seitenwand breit:** `graben_wand_seite_breit_bogen.png` (3 Streifen, ohne Pfosten).
- **G7-6b Querwand als Erdblock:** `graben_querwand_block_bogen.png` (4 Blöcke, gerade von vorn, Oberseite sichtbar). Im Spiel auf die geplante Höhe stauchen.
- **G7-1b schmale Lippe:** nicht gemalt. Die heutige Lippe bleibt, bis das Probebild zeigt, dass sie stört.
- **Punkt 88.2 Drahtgürtel in die Tiefe:**
  - Der Bildgenerator malt das immer mit Fluchtpunkt (zwei Versuche verworfen).
  - Stattdessen gibt es **Querschnitt-Module** (`drahtguertel_tiefe_module_bogen.png`, 6 Stück). GBau stellt sie hintereinander zu einem Gürtel mit parallelen Pfahlreihen auf. Die genaue Bauweise steht in der LIESMICH.
  - Prüfen, ob `_schraeg` dasselbe Problem hat.
- **Punkt 88.1 Ruinen:**
  - `ruinen_haus_bogen.png` enthält 4 ganze Hausruinen auf Fundament, je Dorf- bzw. Ruinenfeld ein Modell statt der Wandstreifen.
  - Sie sind **über Eck** gesehen. Enrico (06:25): so einbauen und am Probebild entscheiden.
  - Vorher mit `window.NOKIPP` zeigen, ob das Auffächern der alten Ruinen vom Kippen kam.
  - Rückweg zu den alten Ruinen über einen Schalter.
- **Dazu in G7h:**
  - Punkt 87: Laufsteg durchgehend ohne Scheren, Querwand über die volle Breite, zwei versetzte Reihen statt Säule, Geschütz nicht auf der Lippe, Rest aus G7g.
  - Punkt 89: Zielfeld 1 zugänglich, mit Test und sim.
  - Punkt 84.12, falls es seit G7f kaputt ist.
- Ist das Paket zu groß, darf CC es in **G7h-1** (Graben: 87 + Seitenwand + Querwand + 89) und **G7h-2** (Draht-Module + Ruinen) teilen. Je Teil einzeln committen und berichten. index.html nur am Ende.
- **Bilder für den Bericht:** nah und ganze Karte, jeweils vorher/nachher, mit Einheiten im Graben und einem Panzer. Dazu ein Bild je neuer Ruine im Spiel und ein Drahtgürtel in die Tiefe.

# >>> JETZT (Enrico 2026-11-26 00:10): Antworten zu G7g – weiter mit G7h, sobald die Bilder da sind <<<
**Reihenfolge:** Der Berater malt die Bilder aus `entwurf/GELAENDE_G7H_BILDER.md` am 26.11. Danach `pa` = **G7h** (Punkt 85 Teil 3 und Punkt 87), dann Paket SP. Bis die Bilder da sind, **kein `pa`**. Die Grabenform aus G7g bleibt. Enrico (00:10): Der Aufbau der Gräben gefällt ihm im Großen. Die Einzelheiten stehen in Punkt 87.

- [x] **87. Nachbesserungen nach G7g (Enrico 00:09, Bilder `entwurf/probe/spieltest_g7g/enrico_1–3.png`; Berater).** Gehört in G7h.
  1. **Laufsteg zerhackt** (`enrico_1.png`, `enrico_3.png`): Die Roste liegen als einzelne, **schräg verzerrte** Parallelogramme im Zickzack, springen von Seite zu Seite und wirken wie schwebende Treppenstufen.
     - Soll: **ein durchgehender, gerader Laufsteg** in der Grabenmitte, die Bretter rechtwinklig zur Laufrichtung.
     - **Nicht scheren:** Die Stücke werden nur gedreht und gekachelt, nicht verzerrt.
     - An einem Buchtversatz macht er einen kurzen, geraden Versatz mit, mit einem Brett quer oder einer kleinen Lücke.
     - Lücken und kaputte Bretter höchstens selten.
     - Gilt für Gräben in beide Richtungen.
  2. **Querwand-Blöcke zu klein** (`enrico_1.png`, `enrico_3.png`): Sie liegen als kleine flache Stücke an einer Seite, statt quer über die ganze Grabenbreite zu gehen. Mit dem neuen Bild G7-6b die ganze Breite (0,95 R) nehmen, seitlich an die Wände anschließen.
  3. **Soldaten-Säule:** Im Graben, der in die Tiefe läuft, stehen die Figuren in einer einzigen Reihe auf der Mittellinie (`gelaende_g7g/vergleich_nah.jpg` rechts). Jetzt ist Platz für **zwei versetzte Reihen**, etwa ±0,15 R neben der Mitte, im Wechsel. Bild vorher/nachher.
  4. **Geschütz im Graben bzw. in der Stellung** (`enrico_2.png`): Es wirkt, als stünde es auf der Grabenkante, und die Lippe läuft hinter bzw. unter ihm durch. Prüfen, ob Geschütze in den Graben bzw. auf die Sohle sollen oder davor. Es soll klar stehen, auf der Sohle oder auf dem Boden, nicht halb auf der Lippe.
  5. Aus G7g offen:
     - Ende des Sandsackwalls unregelmäßig.
     - Scharfschützen liegend im Graben (Bild).
     - **Bild mit Panzer im Graben**, nah, Fahrzeug per `ARMEE_A` oder `__dbg` dazustellen.
     - Prüfung „85 % der Grabenfläche in Grabenfeldern“ messen.
  6. **Leistung seit G7f** (6,9 → 7,6 ms ganze Karte) erst in Paket SP eingrenzen, nicht in G7h.

- [x] **89. Zielfeld 1 auf Grauwall ist blockiert (Enrico 00:14, gehört in G7h).** Auf der Konkordat-Seite ist das erste Zielfeld durch Panzersperren und den Spanischen Reiter (Barrikade) so zugestellt, dass man es nur mit einer Einheit besetzen kann, die räumt oder sprengt. Das zwingt einen, eine bestimmte Einheit zu kaufen.
  - **Regel für alle Karten:** Jedes Zielfeld muss für normale Fußtruppen ohne Räumen von der eigenen Seite aus erreichbar sein, über mindestens zwei Zugänge. Panzersperren und Barrikaden dürfen nicht **auf** einem Zielfeld stehen und es nicht ganz einschließen. Sie sollen den Weg für **Fahrzeuge** lenken, nicht für Fußtruppen.
  - **Grauwall:** Die Sperren bzw. den Spanischen Reiter an Zielfeld 1 verschieben, sodass Fußtruppen frei hinkommen und Fahrzeuge weiter einen Umweg fahren müssen. Gilt sinngemäß auch für die Aschenwacht-Seite, falls dort dasselbe ist.
  - **Prüfung als Test:** für jede Karte und jedes Zielfeld eine Wegsuche mit einem Fußtrupp von der Aufstellungszone der Seite aus, ohne Räumen. Das gehört in `tools/test_regeln.js` oder `test_belegung.js`.
  - `sim.js 100` Grauwall vorher und nachher, mit vier Startwerten gemittelt. Werte in den Bericht.

- [x] **88. Weitere Bilder neu malen (Enrico 00:13, Berater malt mit den G7h-Bildern).**
  1. **Ruinen:** Sie wirken wie eine auseinandergeklappte Pappschachtel. Die Wände fächern nach allen Seiten auf, das sieht nicht wie ein Gebäude aus. Der Berater malt neue Ruinen-Teile, bei denen die Wände stehen bzw. auf festen Grundmauern eingestürzt sind, in der Ansicht der übrigen Bausteine.
     - **CC in G7h:** Liste der heutigen Ruinen-Teile (Namen, Maße, wie GBau sie aufstellt, ob sie gekippt werden – `kippen`/`KIPP_MAX`) in `entwurf/GELAENDE_G7H_BILDER.md` ergänzen. Prüfen, ob das Auffächern schon vom Kippen kommt (`window.NOKIPP` vergleichen), und das Ergebnis mit Bild in den Bericht.
  2. **Drahtgürtel in Tiefenrichtung** (`entwurf/probe/spieltest_g7g/enrico_4_draht.png`, Stück `drahtguertel_tiefe` aus G5b): Die Perspektive stimmt nicht. Die Pfähle laufen auf einen Fluchtpunkt zu, der Gürtel „bohrt sich ins Bild“. In der gekippten Ansicht müssen beide Pfahlreihen parallel laufen und nach hinten nur wenig kleiner werden. Der Berater malt das Stück neu. CC prüft in G7h, ob die anderen Drahtstücke (`_schraeg`, `_quer`, `_ende`) dasselbe Problem haben. Bild in den Bericht.

# >>> JETZT (Enrico 2026-11-25 23:35): Fable-Check 1 gelesen – erst Reparatur, dann Grabenform <<<
Grundlage: `entwurf/postfach/PRUEFUNG_FABLE_GRABEN.md` (Bilder `entwurf/probe/fable_graben/`).

**Reihenfolge:** G7f (Reparatur) → G7g (Grabenform) → G7h (neue Bilder, erst nach dem Malen) → Paket SP (Punkt 84 + Sankt Ruß) → U5 → wie geplant.
- **Punkt 83 (R2) entfällt in dieser Form.** Sein Kleinkram (Ende des Sandsackwalls, Abstand der Figuren zur Querwand) geht in G7f.
- Der alte Graben wird **nicht** zurückgeschaltet, weil die Reparatur sofort kommt.
- Je `pa` genau ein Paket. CC-Stufe: Mittel oder Hoch (Enrico entscheidet). Prüfer `test_kommentare` vor jedem build.py.

- [ ] **85. Graben nach dem Fable-Check (Enrico 23:35).**

  **Teil 1 = Paket G7f, Reparatur (nächster `pa`):** die Punkte 1–5 aus Fables Tabelle „Sofort reparieren“.
  1. **Flach liegende Stücke** (Lippe, Seitenwand, Sandsackwall) vor allen Einheiten zeichnen, direkt nach `projectGround`, nicht nach Tiefe gemischt (`gelaende_bau.js` `liegend`, `ui.js` `drawTilt`).
  2. **Fahrzeuge auf Grabenfeldern** nach den Teilen ihres Felds zeichnen. Stärkeleiste und Punkte aller Einheiten im Graben nach den Geländeteilen (`MARKQ`; `ui.js` um Zeile 2014).
  3. **Figuren nicht mehr an der Hüfte abschneiden.** Die Füße stehen auf der Sohle (`cut` nur noch beim alten Graben).
  4. **Grabenplätze zur Mitte:** höchstens 0,08 R neben der Mittellinie, nicht mehr in zwei senkrechten Reihen. Etwas Abstand zu Querwänden (aus Punkt 83).
  5. **Umriss von Zone und Zugbereich** auf Grabenfeldern nach den Geländeteilen noch einmal als Linie zeichnen.
  6. Dazu aus Fables Fehlerliste, soweit klein:
     - Scharfschützen liegen auf den Lippen statt im Graben.
     - Das Ende des Sandsackwalls ist gerade abgeschnitten (unregelmäßig enden lassen, ohne Geisterstücke).
     - Kisten stehen halb in der Seitenwand.
  - **Prüfen:** Bilder vorher/nachher an Fables Stellen (`t0_stelle1…3`, `t0_weit`), jeweils mit Einheiten im Graben und gewählter Einheit, in der Aufstellungsphase **und** in der Schlacht (Zugbereich). Dazu Enricos Stellen aus `entwurf/probe/spieltest_g7e/`. Partietest. index.html am Ende einchecken.

  **Teil 2 = Paket G7g, Grabenform (eigener `pa`)**, nach Fables Vorschlag „R2: anders bauen“:
  - **Breite:** Graben 0,9–1,0 R breit, freie Sohle mindestens 0,6 R.
  - **Buchten:**
    - Der Versatz ist halb so tief (etwa 0,45 R statt 0,9 R).
    - Ein Erdblock kommt etwa alle zwei Felder, keine Zinnen mehr je Feldradius.
    - Querwände gibt es nur an diesen Erdblöcken. In Gräben, die in die Tiefe laufen, sind sie niedrig (halbe Höhe), es gibt keine „gestapelten Kisten“ mehr.
  - **Laufgräben:**
    - Ost–West verlaufen sie als gerade Linie auf der Mittellinie der Reihe, also kein V-Zickzack mehr.
    - Nord–Süd verlaufen sie wie heute durch die Feldmitten.
    - Die Linie wird aus `MAP.graeben` berechnet. Die Grabenfelder bleiben gleich, deshalb ist kein sim-Lauf nötig.
    - Prüfung: mindestens 85 % der gezeichneten Grabenfläche liegt in Grabenfeldern.
  - **Einmündungen schließen:** Wo ein Laufgraben auf einen Feuergraben trifft, sollen Wände und Lippe durchgehen.
  - **Plätze:** Die Figuren stehen entlang der Mittellinie, in der Bucht an der Feindwand.
  - **Licht:** Die Sohle wird weniger abgedunkelt, der Laufrost soll erkennbar sein. Die Lippe wird schmaler und erdiger.
  - **Bilder:** nah, ganze Karte, jeweils neben dem Zielbild. Dazu die Stellen aus Teil 1. Partietest, Leistung kurz messen.
  - **Am Ende:** Liste, welche Bilder der Berater neu malen soll (Seitenwand für den breiten Graben, Querwand als Erdblock mit sichtbarer Oberseite), mit Maßen und Ansicht.

  **Teil 3 = Paket G7h:** Die neuen Bilder vom Berater einbauen. Eigener `pa`, erst wenn sie in `ui-quelle/gelaende/` liegen.

  **Teil 4 = Paket SP (nach G7h):** Punkt 84 ganz (alle Unterpunkte) und dazu die **Sankt-Ruß-Bremse**. Fable misst ohne Bildratendeckel gleichmäßig 30,5 ms je Bild, in beiden Ansichten. Die Ursache ist unklar, siehe `PRUEFUNG_FABLE_GRABEN.md` Teil B und `b_messung_ohne_deckel.json`. Das passt vermutlich zu Enricos „Spiel schleift manchmal“ (84.5).

# >>> NOTIZ (Enrico 2026-11-25 23:12): Gesammelte Spieltest-Funde – noch kein Paket <<<
Nur sammeln. Der Berater teilt die Punkte nach dem Fable-Check einem Paket zu. **Nicht von selbst bearbeiten.**

- [ ] **84. Spieltest-Funde nach G7e (Enrico 23:12).**
  1. **Ruckeln beim Nahkampf General gegen Panzer:** Wenn der General einen Panzer im Nahkampf angreift, ruckelt das Bild kurz. Ursache messen: Effekt, Ton, Neuaufbau oder Pose?
  2. **Symbole auf dem Feld skalieren nicht mit dem Zoom:** Die Marken unten am Feld und über den Einheiten sind nah herangezoomt sehr groß und herausgezoomt sehr klein. Gemeint sind der Geländehinweis (▲/▼, was ein Feld bringt), die BP-Kosten und die Zustands- und Meldungssymbole. Sie sollen mit dem Zoom mitwachsen, mit einer Unter- und Obergrenze, damit sie lesbar bleiben.
  4. **Sturmrollen gegen Einheiten im Graben (Enrico 23:13, Regel):** Der Graben schützt.
     - Rollt ein Fahrzeug mit Sturmrollen über ein Grabenfeld, wird die Einheit darin **nicht weggestoßen** und nimmt **deutlich weniger Schaden**, zum Beispiel ×0,3.
     - Sie ist aber **niedergehalten** (Schock).
     - Gilt für Graben, eingegrabene Einheiten und Unterstand.
     - Neue Konstante in P, KI anpassen (Sturmrollen gegen Grabenfelder lohnt weniger), `sim.js 100` Grauwall, Werte in den Bericht.
  5. **Spiel schleift manchmal, und nach Rundenende wird noch geschossen (Enrico 23:14):**
     - Die Runde war schon zu Ende, dann kam noch ein Schuss.
     - Das Schleifen kann auch daran liegen, dass gleichzeitig der Fable-Check lief. Deshalb erst nachprüfen, wenn nichts anderes läuft.
     - Prüfen: Laufen Ereignisse oder Töne des alten Zugs in den nächsten hinein (Rundenschild, KI-Zug startet zu früh, Sperrfeuer oder Feuerbereitschaft spielt verspätet)?
  6. **Beschuss der Infanterie dauert zu lange (Enrico 23:14, genauer 23:16):**
     - **Nicht weniger Schüsse:** Jede noch lebende, aktive Figur des Trupps feuert wie bisher genau einmal.
     - **Nur die Abfolge schneller:** kürzere Abstände zwischen den Schüssen.
     - In der Mitte der Salve feuern 1–2 Schüsse **halb überlappend**, ganz kurz nacheinander, fast gleichzeitig. So wirkt die Salve weniger gestreckt.
     - Zu schnell darf es nicht werden.
     - In den Bericht: vorher/nachher mit Sekunden je Salve, für einen vollen und einen halben Trupp.
  7. **Rauchwerfer streichen, Mörser bekommt Rauchmunition (Enrico 23:14, Regel):**
     - Die Einheit Rauchwerfer (Rauchmörser) fällt weg, auf beiden Seiten, falls beide sie haben.
     - Der normale **Mörser** bekommt Rauch als zweite Munition. Je Runde wählt er Sprenggranate **oder** Nebelwand (wie bisher beim Rauchwerfer, mit Abklingzeit).
     - Der Mörser wird dafür **teurer** (über costParts/ABIL, Rechnung im Info-Fenster).
     - Anpassen: Kartenarmeen, Wunschlisten der KI, abilPlan (Rauch vor dem Vorrücken jetzt durch den Mörser), Ton-Pult-Zeilen, Rollen (rollen.js), Chronik-Text des Mörsers.
     - `sim.js 100` auf Grauwall und Sankt Ruß, Werte in den Bericht.
  8. **Kamera folgt nicht immer (Enrico 23:15):**
     - Bei manchen Nahkämpfen folgt die Kamera, bei anderen nicht, vermutlich vor allem im KI-Zug.
     - Beim Leuchtschuss (Ziel markieren) folgt sie dem Ereignis nicht.
     - Prüfen, welche Ereignisse eine Kamerafahrt auslösen. Die Regel soll gleich sein für eigenen Zug und KI-Zug: Die Kamera fährt hin, wenn das Ereignis außerhalb des Bildes oder nahe am Rand liegt.
     - Liste der Ereignisse mit bzw. ohne Kamerafahrt in den Bericht.
  9. **Kamera fährt zu früh weg (Enrico 23:23):**
     - Wenn der Feind Granaten wirft und bei manchen Nahkämpfen, ist die Kamera schon weg, bevor man den Schaden sieht.
     - Die Kamera soll bleiben, bis Schadenszahl, Treffer und Kopfzeichen zu sehen sind (etwa 1–1,5 s nach dem letzten Treffer des Ereignisses), und erst dann zum nächsten Ereignis fahren.
     - Gehört zusammen mit 84.8 (Kamera folgt nicht immer).
  10. **Ordensschreiter: Hieb mit Kettenschwert-Tönen (Enrico 23:22):**
     - Heute steht im Pult beim Schlag `heavy3`.
     - Neu: gegen Fußtruppen die Säge-Fleisch-Töne (wie beim Sägeschreiter `held_kschwert_metall_3` bzw. Säge-Fleisch), gegen Gepanzerte `held_kschwert_metall_4` bzw. `kettenschwert_ruestung_1-3`.
     - Eigene Plätze für Fleisch und Metall wie beim Sägeschreiter, TONWAHL für `orden` entsprechend, Pult-Zeilen (`slotsVon`) nachziehen.
     - Dazu nach der Info unten den neuesten Export einbauen: `tonpult_export_2026-11-24_2248.json`. Er unterscheidet sich vom eingebauten Export vom 23.11. nur bei den Handgranaten der Aschengrenadiere. Ablauf: `tonwahl_bau`, `ton_teilen`, build.
  11. **Abgeprotzte Geschütze und aufgebaute MGs werden zu früh grau (Enrico 00:11):** Nach dem Abprotzen bzw. Aufbauen erscheinen sie ausgegraut, obwohl sie noch schießen könnten. Sie sind nur eingesetzt worden. Prüfen in `bereitGrund` bzw. „fertig“: Grau darf eine Einheit nur werden, wenn wirklich nichts mehr geht, also wenn kein Schuss, keine Fähigkeit und kein Befehl mehr möglich ist. Wenn Abprotzen oder Aufbauen die Aktion kostet und danach kein Schuss mehr möglich ist, das im Hinweis sagen, statt die Einheit grau zu machen. Regel prüfen: kostet das Abprotzen heute die Aktion?
  12. **Warnsymbole am Weg und gemalte Mauszeiger scheinen zu fehlen (Enrico 00:11):**
     - Beim Ziehen über Stacheldraht (bzw. Gas, Feuer, MG-Sperrfeuer) kommt die Warnung in der Pfadvorschau anscheinend nicht mehr (`pathHazard`: roter Weg + Warndreieck). Dasselbe gilt für den Geländehinweis ▲/▼ (`drawFeldWirkung`).
     - Die gemalten Mauszeiger (`ZEIGER`, Hand mit Finger usw.) scheinen nicht mehr zu erscheinen.
     - **Prüfen, ob das seit G7f/G7g kaputt ist** (neue Zeichenreihenfolge, `MARKQ`). **Falls ja, gleich in G7h beheben**, sonst in SP. Bild als Beleg.
  3. **Fehlende oder unpassende Töne,** zum Beispiel beim Erobern eines Zielfelds. Ähnliche Stellen auflisten: Wo gibt es ein Ereignis ohne Ton oder mit einem Ton, der nicht passt? Liste in den Bericht, damit Enrico im Ton-Pult wählen kann.

# >>> JETZT (Enrico 2026-11-25 22:55): Antworten zu G7e – erst Fable-Check 1, dann G7f <<<
**Reihenfolge:** Zuerst prüft Fable in einer eigenen Sitzung (`entwurf/postfach/PRUEFAUFTRAG_GRABEN.md`). **Bis dahin kein `pa`** (nie zwei Browser-Läufe gleichzeitig). Danach trägt der Berater das Ergebnis hier ein, dann `pa` = **G7f** (Punkt 83). CC-Stufe: Mittel oder Hoch (Enrico entscheidet). Prüfer `test_kommentare` vor jedem build.py.

- [ ] **83. G7f – R2 gerade Gräben + Kleinkram (Enrico 22:55).**
  1. **R2** (gerade Gräben, Punkt 73) als eigenes Paket, **so wie es der Fable-Check empfiehlt** (Ergebnis `PRUEFUNG_FABLE_GRABEN.md`; der Berater ergänzt hier die Einzelheiten, bevor Enrico `pa` tippt). Mit `sim.js 100` Grauwall, falls sich Grabenfelder ändern.
  2. **Kleinkram nebenbei (Berater, Enrico: ja):**
     - Das Ende des Sandsackwalls bricht in `entwurf/probe/gelaende_g7e/vergleich_fleck.jpg` (rechts) waagerecht gerade ab. Es soll unregelmäßig enden, etwa mit einem letzten, schräg liegenden oder halb verschütteten Sack, oder in Erde auslaufen. Es darf **keine** halbdurchsichtigen Geisterstücke geben.
     - In `vergleich_figuren.jpg` (rechts unten) ragen zwei Soldaten noch über den Querwand-Block. Der eine oben steht knapp an der Kante. Die Grabenplätze sollen etwas mehr Abstand zur Querwand bekommen.
  - Am Ende index.html einchecken. Bilder vorher/nachher, Partietest, Leistung kurz messen.

# >>> JETZT (Enrico 2026-11-25 22:35): Antworten zu G7d (Zwischenstand) – G7e <<<
**Reihenfolge:** nächster `pa` = **G7e** (Punkt 82). CC-Stufe: Mittel oder Hoch (Enrico entscheidet). Prüfer `test_kommentare` vor jedem build.py.

- [ ] **82. G7e – Rest von G7d (Enrico 22:35).**
  1. **Zuerst, sofort: index.html jetzt bauen und einchecken** (Stand G7d mit neuem Graben und Bodenkontakt der Hindernisse), damit Enrico es im Spiel sieht. Eigener Commit, dann weiter.
  2. **Sandsackwall passt** so (Stand G7d), nichts ändern.
  3. **Figuren gegen Querwände (Berater):** In `entwurf/probe/gelaende_g7d/grauwall_figuren_nah.jpg` stehen Soldaten teils auf bzw. vor den neuen, tiefer hängenden Querwand-Blöcken. Die Grabenplätze (U2) dürfen nicht in den Querwänden liegen: Plätze, die jetzt in einer Querwand liegen, in die Bucht bzw. auf die Sohle daneben schieben, oder die Querwand-Tiefe dort begrenzen. Bild vorher/nachher.
  4. **Lippen-Ecken G7-5** ausprobieren (Punkt 81.5).
  5. **R2** (gerade Gräben, Punkt 73), **Bremse 2** und **Bremse 4** (Punkt 81.7). Bremse 2 nur, wenn sie nach der Messung noch etwas bringt.
  6. Den schwachen hellen Fleck am Ende einer liegenden Seitenwand (rechts an der Brustwehr) beheben.
  - Am Ende index.html erneut einchecken. Bilder wie üblich, Partietest, Leistung kurz messen. `sim.js 100` Grauwall nur, falls R2 Grabenfelder ändert.

# >>> JETZT (Enrico 2026-11-25 22:10): Antworten zu G7c – G7d: neuer Graben ins Spiel <<<
**Reihenfolge:** nächster `pa` = **G7d** (Punkt 81). Wenn es zu groß wird: Zwischenstand committen, berichten, aufhören (Sparregel 5); die Reihenfolge unten ist die Priorität. CC-Stufe: Mittel oder Hoch (Enrico entscheidet). Prüfer `test_kommentare` vor jedem build.py.

- [ ] **81. G7d – neuer Graben ins Spiel (Enrico 22:10).**
  1. **Querwände bleiben** wie in G7c (hängend, Flechtwerk/beschädigt).
  2. **Sandsackwall etwas kräftiger:** in der Mitte zwischen G7b (zu hell) und G7c (zu blass). Die Säcke sollen erkennbar sein, aber nicht das Hellste im Bild. Die blassen grauen Flecken rechts in `entwurf/probe/gelaende_g7c/vergleich_ecke.jpg` und `vergleich_ausschnitt.jpg` müssen weg.
  3. **Aufräumen:** das schwarze Rechteck an der kurzen Buchtkante (hängende Innenwand an sehr kurzen Kanten weglassen oder kürzen).
  4. **Ins Spiel:** G7 wird Standard für die Zinnengräben (Rückweg `window.G7_ALT`), dazu **Lauf- und Sappengräben** auf denselben Aufbau (keine Pappwände mehr).
  5. **Lippen-Ecken G7-5** ausprobieren. Wenn gedrehte L-Stücke falsch wirken, bei den überlappenden Streifen bleiben und das im Bericht sagen.
  6. **Figuren im Graben:** prüfen, wie tief sie neben der neuen Lippe einsinken; sie sollen im Graben stehen, nicht davor schweben.
  7. **R2** (Gräben als freie gerade Linien, siehe Punkt 73), **Fable-Bremse 2** (Teile je Tiefenband zwischenspeichern) und **Bremse 4** (voller Neuaufbau seltener).
  8. **Leistungsmessung** vorher/nachher mit Grafikkarte (`node tools/leistung_messen.mjs`).
  - Am Ende index.html neu einchecken (damit auch der Bodenkontakt der Hindernisse im Spiel ist). Bilder: nah, nah2, ganz, Ecke neben Zielbild, dazu Figuren im Graben nah. Partietest. `sim.js 100` Grauwall nur, falls R2 Grabenfelder ändert.

# >>> JETZT (Enrico 2026-11-25 21:55): Antworten zu G7b voll (Zwischenstand) – erst nachbessern <<<
**Reihenfolge:** nächster `pa` = **G7c** (Punkt 80). Noch **nicht** ins Spiel nehmen. Weiter nur in der Probe `GB_PROBE { eingegraben: true }`. CC-Stufe: Mittel. Prüfer `test_kommentare` vor jedem build.py.

- [ ] **80. Nachbesserungen G7b (Enrico 21:55, Bilder `entwurf/probe/gelaende_g7b/vergleich_ausschnitt.jpg` und `vergleich_ecke.jpg`).**
  1. **Querwände:** Sie liegen jetzt wie flache Balken bzw. Brücken quer über dem Graben. Sie sollen als Erdblock wirken, der von der Kante in den Graben fällt:
     - oben die Sandsackkrone auf Bodenhöhe;
     - darunter die Vorderseite, die sichtbar schräg nach unten in den dunklen Graben läuft. Also hängend, mehr Höhe in die Tiefe, nicht flach gestaucht.
     - Wenn das mit G7-6 nicht gelingt: lieber die alten aufrechten Querwände aus dem Test behalten und im Bericht sagen.
  2. **Liegender Sandsackwall (Brustwehr G7-4):** Er wirkt wie eine helle, gleichmäßige Perlenkette. Abhilfe:
     - deutlich dunkler und an Boden und Lippe angleichen (Helligkeit und Sättigung runter, etwas Schmutz bzw. Erde darüber);
     - unregelmäßiger (Fassungen mischen, Stücke versetzt, Lücken, Abschnitte, an denen nur der Erdwall ist);
     - schmaler.
     - Er soll den Graben begleiten, nicht das hellste Ding im Bild sein.
  3. **Lippe:** Sie ist im Bild kaum zu erkennen. Mehr Kontrast an der Abbruchkante: die dunkle Bruchkante zum Graben hin kräftiger, außen die hellen Erdklumpen sichtbar. Vergleich mit dem Zielbild, wo die bröckelige Kante klar zu sehen ist.
  4. **Bodenkontakt der Hindernisse deutlicher:** Den Erdfleck dunkler und etwas größer machen, mit sichtbaren Klumpen, den Kontaktschatten unter Füßen und Balken kräftiger und die Füße sichtbar eingesunken. Im Vorher/nachher-Bild muss der Unterschied klar zu sehen sein.
  - Bilder wie in G7b (Ausschnitt, Ecke, nah, ganz, jeweils G7b-Zwischenstand | neu | Zielbild) plus Hindernisse vorher/nachher. Kurzer Partietest. Kein sim-Lauf.

# >>> JETZT (Enrico 2026-11-25 21:10): Antworten zum G7b-Test – G7b voll nach den neuen Bildern <<<
**Reihenfolge:** **G7b voll** erst, wenn der Berater G7-3 bis G7-7 nach `ui-quelle/gelaende/neu_g7/` gelegt und hier „Bilder da“ vermerkt hat. Liegen sie beim nächsten `pa` noch nicht da: nichts bauen, im Bericht sagen. CC-Stufe: Mittel (bei G7b voll ggf. Hoch, Enrico entscheidet).

- [ ] **78. Antworten zum G7b-Test (Enrico 21:10).**
  1. **Erdlippe scharf:** In G7b voll die Lippe als liegendes Teil in Bildschirmauflösung zeichnen (wie die aufrechten Teile), nicht im Weltbild. Sie muss aus der Nähe scharf und bröckelig wirken wie im Zielbild.
  2. **Lippe breiter:** 0,3 R statt 0,25 R.
  3. **Innenwand passt**, die Bilder bleiben.
  4. **G7b voll** dann wie im Plan (`entwurf/GELAENDE_G7_PLAN.md` Abschnitt 4): nahe Wand weg, ferne Wand hängend aus G7-2, Seitenwände aus G7-3, Lippe überall mit Ecken aus G7-5, Brustwehr-Wall G7-4 und Rückwall-Hang G7-7 flach, Querwände G7-6 hängend, Lauf- und Sappengräben auf denselben Aufbau. Dazu R2 (gerade Gräben) und die Fable-Bremsen 2 und 4. Zwischenstände committen; wenn es zu groß wird: aufhören und berichten (Sparregel 5).
  - Bilder: nah, nah2, ganz, Ecke, jeweils neben Zielbild. Partietest. Leistung messen (mit Grafikkarte, Regel 7 ist gelockert) vorher/nachher.

- [ ] **79. Bilder da + Nachtrag Enrico (21:20).**
  1. **Bilder G7-3 bis G7-6 liegen in `ui-quelle/gelaende/neu_g7/`** (Seitenwand, Lippen-Ecken, Querwand, Brustwehr-Wall). Die genauen Zeilen- und Spaltenbereiche stehen in der LIESMICH. **G7-7 Rückwall-Hang gibt es nicht als Bild**, den weiter im Code zeichnen.
  2. **Brustwehr-Stummel (Enrico):** In `grauwall_ecke_nah.jpg` ragt rechts ein Stück Sandsack-Brustwehr als eckiger Block über die Grabenkante und steht frei in der Luft. Brustwehr-Stücke dürfen nie über das Grabenende bzw. die Kante hinausstehen. Am Ende abgerundet auslaufen lassen (Wall läuft in Erde aus).
  3. **Hindernisse wirken aufgeklebt (Enrico):** Spanische Reiter, Panzersperren und die angespitzten Pfahlreihen stehen ohne Bodenkontakt da. Sie brauchen Bodenkontakt: Kontaktschatten unter jedem Fuß bzw. Balken, einen leicht dunkleren Erdfleck mit aufgewühlter Erde darunter und die Füße etwas in den Boden eingesunken (unteren Rand weich in den Boden überblenden). Gilt für alle Karten. Vorher/nachher-Bild nah.

# >>> JETZT (Enrico 2026-11-25 20:35): Antworten zu G6b <<<
**Reihenfolge:** nächster `pa` = **G7b-Test** (Punkt 76, Abschnitt darunter). Punkt 77 gehört dazu, ist klein. Regel 7 ist ab diesem Paket gelockert (Sparregel 7). CC-Stufe: Mittel.

- [ ] **77. Antworten zu G6b (Enrico 20:35).**
  1. **Windmühle bleibt 1,5× mit Durchsicht**, wenn Figuren dahinter stehen. Nichts ändern.
  2. Einsturzmeldung, Wrack im Schnee und Betonhöcker passen so.
  3. **Kleinigkeit nebenbei (Berater):** `tools/test_kommentare.js` soll auch `src/gelaende_bau.js` prüfen. Das ist die Lücke, die du in G6b gefunden hast. Im Bericht kurz sagen, ob dabei etwas aufgefallen ist.

# >>> JETZT (Berater 2026-11-25 20:05): G7-1 und G7-2 sind gemalt – Paket G7b-Test <<<
**Reihenfolge:** zuerst G6b (Punkt 75), dann **G7b-Test** als eigener kleiner `pa`. Regel 7 ist ab diesem Paket gelockert (siehe Sparregel 7, Enrico 20:26): mit Grafikkarte arbeiten, Vorschau am Ende schließen. Danach aufhören; nicht von selbst G7b voll oder U5 beginnen. CC-Stufe: Mittel.

- [ ] **76. G7b-Test: Erdlippe und Innenwand in die Probe (Punkt 74.2).**
  1. **Bilder:** `ui-quelle/gelaende/neu_g7/graben_lippe_bogen.png` (G7-1, 3 Streifen) und `graben_wand_innen_bogen.png` (G7-2, 3 Streifen: Bretter, Flechtwerk, Sandsäcke). Die Zeilenbereiche der Streifen und die Hinweise stehen in `ui-quelle/gelaende/neu_g7/LIESMICH.md`. Stilvorlage war `entwurf/probe/zielbild_graben/arm_g7_ziel_ausschnitt.jpg`.
  2. **Schnitt:** Beide mit `gelaende_cut.py` als nahtlose Kachelstreifen schneiden (wie die übrigen Wandstücke; die Enden passen noch nicht ganz zueinander), Magenta freistellen.
  3. **Nur in die Probe** `GB_PROBE { eingegraben: true }` (GBau `EG`), im Spiel nichts ändern:
     - Die **Erdlippe** ersetzt die im Code gezeichnete Lippe (`zeichneLippen`). Sie liegt flach auf allen Grabenkanten, die Unterkante zeigt zum Graben. Die drei Streifen wechseln je Abschnitt zufällig, Variante 3 (Wurzeln) seltener. Die Bodenfarbe oben bei Bedarf an den Kartenboden angleichen.
     - Die **Innenwand** ersetzt `graben_kante_hinten` an der fernen, hängenden Wand (`strip` mit `ab`). Die Abdunklung nach unten und die Stauchung in die Tiefe bleiben im Code; die Bilder sind recht frontal gemalt. Varianten je Graben bzw. Abschnitt mischen, Flechtwerk und Bretter häufiger als Sandsäcke.
     - Seitenwände, Brustwehr, Ecken, Querwände und Rückwall bleiben wie in G7a; dafür kommen später G7-3 bis G7-7.
  4. **Bilder:** dieselben Ausschnitte wie in G7a (nah, nah2, ganz), jeweils G7a-Probe | G7b-Test | Zielbild nebeneinander, nach `entwurf/probe/gelaende_g7b_test/`. Dazu eine Nahaufnahme einer Ecke.
  5. **Bericht:** Was gut passt und was nicht, besonders der Maßstab der Lippe (Plan: 0,25 R) und der Wand (0,35 SH). Sag auch, ob die Wand-Bilder für die Tiefe taugen oder ob der Berater sie mit stärkerer Verkürzung neu malen soll. Dazu Wünsche für G7-3 bis G7-7.
  - Tests: test_kommentare, Partietest ohne GPU (kurz). Kein sim-Lauf (keine Regeländerung).

# >>> JETZT (Enrico 2026-11-25 19:20): Antworten zu G6 – kleine Nachbesserung G6b <<<
**Reihenfolge:** nächster `pa` = **G6b** (Punkt 75, klein). Regel 7 (Grafikkarte schonen) gilt weiter. Danach G7b-Test, sobald der Berater G7-1 und G7-2 geliefert hat. Liegen die Teile dann noch nicht da: aufhören und im Bericht sagen, nicht von selbst U5 beginnen. CC-Stufe: Mittel.

- [ ] **75. Antworten zu G6 (Enrico 19:20).**
  1. **Windmühle etwa 1,5× größer** (Landmarke). Sie darf keine Figuren auf Nachbarfeldern verdecken; wenn das bei 1,5× passiert, so groß wie möglich ohne Verdecken und im Bericht sagen. Heil und eingestürzt gleich skalieren.
  2. **Fehler Einsturzmeldung:** Im Bild `vergleich_muehle_ganz.jpg` steht beim Einsturz der Mühle **„Die Kirche stürzt ein!“** und die Meldung sitzt bei Flagge 1 statt an der Mühle. Richtig: „Die Windmühle stürzt ein!“ an der Mühle. Dazu die Sim-Zeile „Kirche“ für die Mühle richtig benennen (Mühle getrennt zählen).
  3. **Koloss-Wrack im Schnee (Krähenfurt):** Es ist braun ohne Schnee und fast ganz von Tannen verdeckt. Schnee auf das Wrack (Bildfassung für Schneekarten, z. B. helle Auflage oben wie bei den Tannen) und die Tannen direkt davor/auf dem Wrackfeld wegnehmen bzw. zur Seite rücken, damit man es sieht. Regeln und Lage bleiben (6,10).
  4. **Betonhöcker** (die hellen Spitzkegel neben dem Graben, Grauwall) sind fast weiß und stechen heraus: dunkler und erdiger machen, wie Beton mit Schmutz, an den Boden angleichen.
  5. **Sankt Ruß bekommt keine Panzersperren** (erst mal nicht, die Kirche reicht als besonderer Ort).
  6. **Grauwall-Gleichgewicht** (Konkordat 35 %) jetzt **nicht** ausgleichen, das kommt gesammelt in Paket S nach G7. Im Bericht nur den Stand nennen.
  - Bilder: Mühle ganz/nah vorher/nachher, Einsturz mit Meldung, Wrack im Schnee, Höcker nah. Tests wie üblich (test_regeln, test_kommentare, Partietest ohne GPU). Kein sim-Lauf nötig, außer Punkt 3 ändert Felder (dann `sim.js 100` Krähenfurt).

# >>> JETZT (Enrico 2026-11-25 18:30): Antworten zu G7a – G6 vorziehen <<<
**Reihenfolge:** nächster `pa` = **G6** (Punkt 68, Bilder liegen in `ui-quelle/gelaende/neu_poi/`). Regel 7 (Grafikkarte schonen) gilt weiter. Danach, sobald der Berater die Teile geliefert hat: **G7b-Test** (nur G7-1 + G7-2), dann die übrigen Teile, dann G7b voll. CC-Stufe: Mittel.

- [ ] **74. Antworten zu G7a (Enrico 18:30).**
  1. **Richtung der Probe stimmt** (nahe Wand weg, ferne Wand hängt schräg in die Tiefe, Erdlippe an der Kante).
  2. **Erst 2 Teile testen:** Der Berater malt zuerst **G7-1 `graben_lippe`** und **G7-2 `graben_wand_innen`** (3 Varianten) nach `entwurf/GELAENDE_G7_PLAN.md` Abschnitt 3, im Stil des Zielbilds. Wenn sie da sind: kleiner `pa` **G7b-Test** – nur diese beiden in die Probe (`GB_PROBE eingegraben`) einbauen, Bilder nah/ganz neben Zielbild, Enrico schaut. Danach malt der Berater G7-3 bis G7-7 im gleichen Stil, dann **G7b voll** (mit R2 und Bremsen 2+4).
  3. **G6 vorziehen**, bis die Teile da sind (Berater malt erst, wenn Enrico zu Hause ist und Chrome offen hat).

# >>> JETZT (Enrico 2026-11-25 17:05): Raster entschieden – Sechsecke bleiben (Variante 1b) <<<
Grundlage: `entwurf/postfach/PRUEFUNG_FABLE_RASTER.md` (Bilder `entwurf/probe/raster/`). **Kein Raster-Wechsel.** Die Vorteile der Quadrate werden auf Sechsecken nachgebaut (Pakete R1–R4).
**Reihenfolge ab jetzt:** R1 → G7a → G7b (mit R2, Bremsen 2+4) → G6 → U5 → R3 → U3 → U4 → U6 → U7 → U8 → R4a → (R4 nur falls Enrico es nach R4a will) → S → U9. CC-Stufe: Mittel.

- [ ] **73. Raster-Pakete (Enrico 17:05).**
  - **R1 (nächster `pa`, klein):** Truppstärke **8 / 6 / 3** umsetzen (Punkt 72: Linie 8, Reiter 6, Spezialtrupps 3; Grabenplätze 8 je Feld; Formation im offenen Feld **3-2-3 versetzt**, niemand ragt aus dem Feld, leicht versetzt statt überlappend; Klone/Größen-Streuung bleiben). Dazu **Feldlinien etwas dezenter** (Enrico: Linien sind okay, dürfen etwas dezenter sein). Bilder offenes Feld + Graben vorher/nachher, Partietest; `sim.js 100` Grauwall nur, falls Stärke/Schaden je Figur irgendwo in Regeln einfließt (sonst nicht nötig).
  - **R2 (in G7b):** Gräben und Mauern als **freie gerade Linie** (Punkte zwischen Feldmitten erlaubt, Grabenfelder daraus abgeleitet, „Bild = Regel“ bleibt) – vor allem Quergräben ohne Zickzack von Feldmitte zu Feldmitte.
  - **R3 (nach U5):** **Deckung an der Feldkante** als neue Regel (Sandsackwall, Mauer, Hecke auf der Kante zwischen zwei Feldern; schützt nur gegen Beschuss über diese Kante; kann umgangen werden). Enrico: „mehr wie ein Deckungssystem“, Angriffsrichtung und Verteidigungsstellung sollen zählen; Deckung auf den Karten dann schlauer setzen. Mit Schild-Zeichen und KI.
  - **R4a (nach U8, klein):** **Zwischenlösung große Fahrzeuge** (Landkoloss, Sturmpanzer, Bohrkoloss; Schreiter bleiben): Fahrzeug bleibt in den Regeln auf 1 Feld, **das Feld direkt hinter ihm (Heckfeld) ist gesperrt** (niemand darf hinein, Wegsuche/Belegung/Aufstellung/Nachschub beachten, wandert mit beim Fahren und Drehen; Drehen nur, wenn das neue Heckfeld frei ist). **Rückenangriffe bleiben möglich:** Beschuss von hinten zählt wie heute als Rücken, Nahkampf von den beiden Feldern schräg hinten zählt als Flanke/Rücken. Danach entscheidet Enrico, ob **R4** (echte 2 Felder) noch nötig ist.

# >>> JETZT (Enrico 2026-11-25 16:50): Truppstärke 8/6/3 und Raster-Frage – G7 wartet <<<
**Reihenfolge:** `pa` = **L1** (Punkt 71) wie geplant. Parallel macht Enrico in einem eigenen Fenster mit Fable eine **Raster-Studie** (`entwurf/postfach/PRUEFAUFTRAG_RASTER.md`). **G7 (Punkt 70) und die 8/6/3-Umstellung (Punkt 72) erst nach Enricos Raster-Entscheidung.** In der Zeit nach L1 nichts Großes beginnen.

- [x] **72. Truppstärke 8 / 6 / 3 oder 10 / 6 / 4 – wird mit dem Raster entschieden (Enrico 16:58: mit anderem Raster braucht es die Verringerung vielleicht nicht).** Bisheriger Stand: Linieninfanterie **8** Figuren (statt 10), Reiter **6**, Spezialtrupps **3** (statt 4). Grund: 10 Mann ragen im offenen Feld links/rechts aus dem Feld. Folgen: Grabenplätze 8 je Feld, Formation im offenen Feld z. B. 3-2-3 bzw. 4-4 versetzt (nicht überlappend, leicht versetzt), U5 dann 1 Figur ≈ 12–13 Stärke. Maßstab-Entscheidung E1 (10/6/4) damit geändert. Umsetzung erst, wenn klar ist, ob das Raster bleibt.
  Enricos Wunsch dahinter (16:45): mehr Freiheit bei **Bewegung, Aufstellung und Gelände** (gerade Gräben leichter) und **große Fahrzeuge über mehrere Felder** → Raster-Studie.

# >>> JETZT (Enrico 2026-11-25 16:20): Fable-Prüfung gelesen – Paket L1 nach G5b <<<
**Reihenfolge:** `pa` = G5b (Punkt 69), danach `pa` = **L1** (Punkt 71), dann G7a. Grundlage: `entwurf/postfach/PRUEFUNG_FABLE_LEISTUNG.md`. CC-Stufe: Mittel.

- [ ] **71. Leistung nach der Fable-Prüfung (Enrico 16:20).** Enrico hat kein Digitalboard und keinen schwächeren PC zum Testen; deshalb vorsorglich die billigen Bremsen lösen.
  **L1 (eigener kleiner `pa`):**
  1. **Bremse 1 – Canvas-Filter je Bild** (`drawNewFigs`, um Zeilen 1766/1784/1811): abgedunkelte hintere Reihe, graue fertige Einheiten, dunkle Felder, Kettenfahrzeug-Farbfilter je Figurenbild **einmal vorrechnen und merken** (wie `bwBild`); den `blur`-Kettenschatten als fertiges Bild. Ziel: ganze Karte schlechteste 5 % deutlich unter 20 ms auf dem Mess-PC.
  2. **Bremse 3 – Kontaktschatten** als fertiges Bild statt neuem Farbverlauf je Figur. Trupp-Zwischenbild in der Übersicht nur, wenn klein machbar.
  3. **Ton-Kleinigkeit:** Töne, die mit `pause()` enden (Einzelschuss mit `dur`, Getümmel-Schleife), auch vom Tonweg trennen (`anBus` hört bisher nur auf `ended`).
  4. Vergleichsbild vorher/nachher (darf sich nicht sichtbar ändern), Messung wie Fable (ganze Karte, Zoom 1, Grauwall + Sankt Ruß, Mittel + schlechteste 5 %), Partietest.
  **In G7b mitnehmen:** Bremse 2 (Geländeteile je Tiefenband zwischenspeichern, solange Kamera/Gelände gleich) und Bremse 4 (vollen Gelände-Neuaufbau seltener; erst bestimmen, welcher Feldwechsel ihn auslöst) – der Grabenaufbau wird dort ohnehin neu gemacht.
  **Später (vor dem Teilen des Spiels):** Bremse 5 – Figuren/Gelände wie die Töne getrennt nachladen.
  **Offener Punkt Sankt Ruß** (erste ~10 s nach Schlachtstart kaum Bilder im unsichtbaren Chrome): Enrico prüft beim nächsten Spielen am eigenen PC. Falls CC es nebenbei im sichtbaren Browser nachstellen kann, im L1-Bericht kurz sagen.

# >>> NOTIZ (Enrico 2026-11-25 16:15): Paket G7 – Gräben eingegraben statt Pappe (nach G5b) <<<
**Noch nicht bauen**, erst nach G5b. Zuerst **G7a = Probe + Plan** (ein `pa`, nur Bilder und Plan, nichts fest einbauen), dann nach Enricos Blick G7b.

- [ ] **70. Gräben sollen wie in die Erde gegraben aussehen (Enrico 16:03).** Enrico: Die Grabenwände wirken wie **hochstehende Pappen**, die auf dem Boden stehen, nicht wie ein Graben. Die Sandsäcke sehen **aufgeklebt** aus statt wie Körper. An den Ecken **schließt die Kante nicht ab** (z. B. oben links in `entwurf/probe/u2/boden_nah.jpg`). Alles wirkt geflickschustert. Die Teile selbst sind neu (G2b), es liegt an der **Bauweise** in GBau.
  **Zielbild:** `entwurf/probe/zielbild_graben/zielbild_graben_eingegraben.jpg` (Vergleich heute/Ziel: `vergleich_heute_ziel.jpg`). **Enrico (16:08): „Das rechte sieht super aus. Das sieht schön aus.“** – also so nah wie möglich an dieses Bild heran (Aufbau, Erdlippe, Tiefe, Sandsack-Wall). Nicht pixelgenau abmalen; Schrift dort ist Unsinn.
  Was das Zielbild anders macht:
  1. **Boden läuft bis an die Grabenkante** und bricht dort mit einer **unregelmäßigen, bröckeligen Erdlippe** ab (keine gerade Linie, keine Karte).
  2. **Nur die dem Betrachter zugewandte Innenwand ist sichtbar**, schräg nach unten ins Dunkle (Bretter, Flechtwerk, Sandsäcke). Die nahe Wand verschwindet fast hinter der Lippe. Heute stehen beide Wände als aufrechte Streifen.
  3. **Tiefe durch Schatten:** Sohle deutlich dunkler, Verlauf nach unten dunkler; Wände werfen Schatten auf die Sohle.
  4. **Sandsack-Brustwehr liegt als Wall AUF dem Boden** (Feindseite), mit Volumen: oben hell, Seiten dunkel, Schatten auf den Boden, lose Erde drumherum.
  5. **Ecken und Knicke geschlossen**, durchgehende Erdkante ohne Nähte, keine senkrecht abgeschnittenen Texturen; gleiche Farbe/Helligkeit über alle Teile.
  **Nebenpunkt aus G5b (Berater 16:40):** Die gemalten Drahtgürtel haben aus der Ferne (`gelaende_g5b/vergleich_grauwall_ganz.jpg`) einen leicht violetten Schimmer – vermutlich Magenta-Reste an den feinen Drähten. In G7 mit prüfen und ggf. entfärben (wie `ENTROSA`).
  **G7a liefert:** (a) Analyse, welche Teile heute aufrecht stehen und warum es pappig wirkt; (b) eine Probe an einem Grauwall-Ausschnitt (nah + ganz) mit dem neuen Aufbau (z. B. nahe Wand weg bzw. nur Lippe, ferne Wand geneigt statt aufrecht, Erdlippe über alle Oberkanten, Schatten/Tiefe, Brustwehr als Hügel); (c) Liste, welche Teile der Berater neu malen soll (z. B. Erdlippen-Streifen, geneigte Wandkacheln, Brustwehr-Hügel, Eckstücke), Format wie G1; (d) Aufwand und Folgen für U2-Grabenplätze und Leistung. Rückweg-Schalter wie üblich.

# >>> JETZT (Enrico 2026-11-25 15:55): Antworten zu G5 – erst Fable-Check, dann G5b <<<
**Reihenfolge:** Enrico lässt **jetzt** den Leistungs-Check mit Fable laufen (eigenes Fenster, `PRUEFAUFTRAG_FABLE.md`). In der Zeit **nichts bauen**. Danach nächster `pa` = **G5b** (Punkt 69), dann G6. CC-Stufe: Mittel.

- [x] **69. Drahtgürtel aus gemalten Stücken (Enrico 15:55).**
  1. **Bild:** Der im Code gezeichnete Draht aus G5 wirkt nah wie senkrechte Ketten aus orangen Ringen und ist aus der Ferne kaum als Stacheldraht zu erkennen. **Ersetzen durch gemalte Stücke** aus `ui-quelle/gelaende/neu_draht/` (welches Stück wofür: `LIESMICH.md` dort). Gürtel quer zur Blickrichtung aus den waagerechten Stücken (`drahtguertel_b.png` oben/Mitte, aneinandergereiht), Gürtel in die Tiefe aus dem Tiefenstück (`drahtguertel_a.png` oben rechts), schräge Abschnitte aus den schrägen Stücken (gespiegelt für die andere Richtung), Enden an Gassen mit dem Endstück. Gelegentlich das beschädigte Stück zur Abwechslung. Die Teile wie andere Gelände-Teile freistellen (gelaende_cut.py), Plastik-Karte (`figur_plastik.py` `gel_…`).
  2. **Lage aus G5 bleibt** (Zickzack-Gürtel, Gassen vor den MGs). **Spanischer Reiter auf der Landstraße bleibt** (Enrico).
  3. **Bild = Regel** weiter prüfen (`test_draht.js`, `test_draht_bild.mjs`). Der hingeworfene Draht fern von Gräben darf bleiben.
  4. Bilder nah und ganz vorher/nachher (`entwurf/probe/gelaende_g5b/`), Partietest. Keine Regeländerung, also kein sim-Lauf nötig.

# >>> NOTIZ (Enrico 2026-11-25 14:28–15:10): Paket G6 – Panzersperren und besondere Orte (nach G5) <<<
**Noch nicht bauen**, erst nach G5 als eigener `pa`. Bilder liegen fertig in `ui-quelle/gelaende/neu_poi/` (Übersicht `LIESMICH.md` dort), die Sperren selbst in `ui-quelle/gelaende/panzersperren.png` / `panzersperren_b.png` (vorhanden).

- [x] **68. Panzersperren und besondere Orte (Enrico).** Enrico fehlen auf den Grabenkarten noch besondere Orte; dazu Panzersperren.
  1. **Panzersperre** (neue Feldart, z. B. `sperre`): **Niemand betritt das Feld** (Fußtruppen, Reiter, Fahrzeuge, Schreiter, auch nicht überrollen). **Infanterie auf einem Nachbarfeld bekommt Deckung gegen Beschuss, der über die Sperre kommt** (Schusslinie läuft durch das Sperrfeld; Stärke wie Hecke/Mauer, Vorschlag ×1,2, mit Deckungsschild). Sichtlinie bleibt frei. **Nur Pioniere mit Sprengladung** (Graben-Pioniere, abil `charge`) können sie vom Nachbarfeld sprengen; danach wird das Feld Trümmer (Bild `panzersperren_gesprengt.png`). KI: Sperren umgehen, Pioniere sprengen, wenn eine Sperre den Weg zu einem Zielfeld versperrt. Bilder: Stahligel, Betonhöcker, Drahtigel, Pfahlsperre aus `panzersperren.png` (gesprengt je die gleiche Stelle aus dem neuen Bogen). Infofenster-Text + Chronik im Format von `entwurf/welt/gelaende_chroniken.md` (Berater liefert den Text auf Zuruf, sonst sachlich selbst schreiben).
  2. **Besondere Orte mit kleiner Wirkung:**
     - **Zerschossene Windmühle** (`windmuehle_bogen.png`, Schlamm/Schnee, beschädigt/zerstört): Beobachtungsposten wie der Kirchturm (mehr Sicht, ggf. +1 Reichweite für Fußtruppen darin), nur Fußtruppen; kann wie die Kirche einstürzen (dann Bild „zerstört“, Wirkung weg).
     - **Ausgebranntes Koloss-Wrack** (`koloss_wrack_bogen.png`, Schlamm/Schnee): Deckung für Fußtruppen (Vorschlag wie Ruine), Fahrzeuge kommen nicht durch, sperrt die Sicht.
     - Je Grabenkarte **einen** besonderen Ort an einer sinnvollen Stelle (Grauwall: Windmühle oder Wrack im Niemandsland, Krähenfurt: der andere), Punktsymmetrie/Gleichgewicht beachten.
  3. **Panzersperren auf die Karten** dort, wo sie Sinn ergeben: vor den Gräben an Straßen und Wegen (Fahrzeuge kanalisieren), mit Lücken; nicht so viele, dass Fahrzeuge nutzlos werden.
  4. Messen: `node tools/sim.js 100` je geänderter Karte vorher/nachher, Fahrzeugverluste und -wirkung im Bericht. Ändert sich eine Quote um mehr als 8 Punkte: melden, nicht selbst ausgleichen (Abgleich U9). `test_regeln.js` mit neuen P-Schlüsseln (`--neu`).
  5. Bilder ganz + nah je Karte, Partietest.

# >>> JETZT (Enrico 2026-11-25 15:10): Antworten zu U2 – Paket U2b <<<
**Reihenfolge:** nächster `pa` = **U2b** (Punkt 67, klein). Bericht, dann aufhören. Danach startet Enrico den Leistungs-Check mit Fable (`PRUEFAUFTRAG_FABLE.md`, eigene Sitzung) – in der Zeit nichts Schweres laufen lassen. Erst danach G5. CC-Stufe: Mittel.

- [x] **67. Grabenplätze im Zickzack, Klone ohne Spiegeln (Enrico 15:10).**
  1. **Gräben, die in die Tiefe laufen** (Blick von vorn, Bild `u2/vergleich_grauwall_graben.jpg` rechts oben): Die Figuren stehen dort wie eine Warteschlange hintereinander. **Alle 10 Plätze bleiben** (ab U5 zeigt die Figurenzahl die Stärke), aber stärker im Zickzack: abwechselnd deutlich an die linke und rechte Grabenwand, über den ganzen Abschnitt des Feldes verteilt (auch Knicke und Buchtenden nutzen), etwas mehr Abstand in der Tiefe, damit sich die Figuren weniger überdecken. Waagerechte Gräben so lassen.
  2. **Klone ohne Spiegeln:** Das Umdrehen jeder fünften Figur in Ruhe wieder herausnehmen. Größe/Neigung/Versatz bleiben.
  3. Bilder vorher/nachher (`entwurf/probe/u2b/`), Partietest.

# >>> JETZT (Enrico 2026-11-25 14:35): Stacheldraht – Paket G5 nach U2 <<<
**Reihenfolge:** U2 zuerst (Punkt 64). **Danach** eigener `pa` = G5 (Punkt 65). CC-Stufe: Mittel.

- [x] **65. Stacheldraht planvoll statt hingeworfen (Enrico 14:27).** Enrico stört, dass der Draht überall aussieht wie einfach hingeworfen. Eine Verteidigungslinie wird mit Plan verdrahtet. Bild **und** Lage ändern.
  1. **Bild (GBau):** Pfähle in geraden Reihen **parallel zum nächsten eigenen Graben**, Draht zwischen den Pfählen gespannt (2–3 Pfahlreihen je Feld, versetzt), dazu wenig loser Draht. Nur dort, wo kein Graben in der Nähe ist (Niemandsland, Trümmer), darf er unordentlicher liegen. „Bild = Regel“ muss weiter stimmen (`tools/test_draht.js`, `tools/test_draht_bild.mjs`).
  2. **Lage auf der Karte (Grauwall, Krähenfurt, Sankt Ruß, soweit dort Draht liegt):** Drahtfelder als **Gürtel vor den Feuergräben**, etwa 1–2 Felder davor, durchgehend mit wenigen **Gassen**. Die Gassen liegen **vor MG-Stellungen bzw. Feuerbuchten** (Angreifer werden ins Schussfeld gelenkt), dazu eine Lücke an Wegen/Straßen, wo ein Spanischer Reiter (Barrikade) stehen darf. Gürtel gern **schräg oder im Zickzack** statt schnurgerade. Punktsymmetrie und Gleichgewicht der Seiten beachten.
  3. **Messen:** `node tools/sim.js 100` je geänderter Karte, vorher/nachher, gleicher Startwert. Siegquote, Dauer, Verluste je Typ. Ändert sich eine Quote um mehr als 8 Punkte: im Bericht melden, **nicht** selbst ausgleichen (Abgleich in U9).
  4. Bilder je Karte ganz + nah, vorher/nachher (`entwurf/probe/gelaende_g5/`). Kurzer Partietest.
  Hintergrund (nur zur Orientierung): Im Ersten Weltkrieg lagen die Drahthindernisse meist 20–50 m vor dem vordersten Graben, oft zwei bis drei Gürtel hintereinander, mehrere Pfahlreihen tief, mit schrägen Abschnitten, die Angreifer in die MG-Schussbahnen lenkten, und mit Lücken für eigene Spähtrupps.

# >>> JETZT (Enrico 2026-11-25 14:10): Antworten zu G4 – erst G4b, dann U2 <<<
**Reihenfolge:** nächster `pa` = **G4b** (Punkt 63, klein). Bericht, dann aufhören. Der `pa` danach = **U2** (Punkt 64). CC-Stufe: Mittel.

- [x] **63. Grabentakt unregelmäßiger (Enrico 14:10, Frage 1 aus G4: Ja).**
  1. Längen von Bucht und Durchgang stärker schwanken lassen (zufällig, aber fest je Karte), damit der Graben aus der Ferne nicht mehr wie ein gleichmäßiges Muster wirkt. Gelegentlich auch zwei Buchten oder zwei Durchgänge hintereinander unterschiedlich lang.
  2. Regeln und Grabenfelder bleiben gleich, `buchtenJeFeld` liefert weiter die Feuerbuchten je Grabenfeld (jedes Grabenfeld braucht mindestens eine Bucht für U2).
  3. **Grabenboden (Enrico 14:15, alles mit in G4b):** Im Nahbild `gelaende_g4/grauwall_nachher_nah.jpg` passen Roste und Pfützen nicht:
     - **Lattenroste** sind nur einzelne kurze Flicken mit dunklen Lücken. In den **Durchgängen** soll ein **durchgehender Laufsteg** liegen (Latten quer zur Laufrichtung, wie jetzt), in den **Buchten** einzelne Stücke reichen.
     - **Nichts darf in die Wände ragen** oder von ihnen abgeschnitten werden (ein Brett liegt schräg halb in der Wand). Roste etwas schmaler als die Sohle, mit kleinem Abstand zu den Wänden.
     - Roste **kräftiger**, sie wirken blass und verwaschen. Mehr Kontrast, eigener kleiner Schatten, wie die übrigen Gelände-Teile (`teilFilter`).
     - **Pfützen** sehen aus wie weiße Rauchflecken. Sie sollen **dunkel und glänzend wie Wasser** wirken (dunkles Braungrau, schmaler heller Glanzrand oder Spiegelung, kein weißer Fleck). Weniger davon, nicht auf den Rosten.
  4. Bilder ganz und nah, vorher/nachher (`entwurf/probe/gelaende_g4b/`), dazu ein Nahbild nur vom Grabenboden. Kurzer Partietest.

- [x] **64. Umbau U2 freigegeben (Enrico 14:10, Frage 2 aus G4: Ja).**
  U2 nach `entwurf/BAUPLAN_UMBAU.md` (Klone und die 10 Grabenplätze). Die Grabenplätze sitzen an den neuen Buchten aus G4/G4b. Eigener `pa` nach G4b.
  **Zuerst, am Anfang von U2 (Enrico 14:30, Antworten zu G4b):** Restpunkte am Grabenboden (Bild `gelaende_g4b/vergleich_boden.jpg`, rechte Hälfte):
  1. **Pfützen etwas mehr Glanz:** dunkel bleiben, aber deutlicherer Glanzrand und Spiegelung, damit man Wasser erkennt. Nicht glitzernd.
  2. **Laufsteg schärfer:** Er wirkt gestreckt und verschmiert. Kachel nicht strecken, sondern in Originalgröße wiederholen (STYLE.md: Flächen gekachelt, nie gestreckt).
  3. **Kaputtes Rost-Teil mit Loch** liegt am linken Rand des Laufstegs halb darüber. Prüfen, was das ist, und so legen, dass es nichts überdeckt, oder in Durchgängen weglassen.
  4. **Ein Durchgang ohne Steg** (oben im Bild): prüfen, ob dort ein Laufsteg fehlt (zählt das Stück als Knick statt als Durchgang?).
  Danach ein Nahbild vom Grabenboden, dann erst die Klone und Grabenplätze.

# >>> NOTIZ (Berater 2026-11-25 14:55): Drei Figurenbögen überarbeitet – Einbau in U4 <<<
**Kein eigener `pa`.** Nur merken für U4 (neue Bögen). Alle in `ui-quelle/figuren/`, die alten Dateien sind unverändert.

- [ ] **66. Überarbeitete Figurenbögen in U4 einbauen.**
  - `konkordat_reiter_neu2.png` statt `konkordat_reiter_neu.png`: rechtes Pferd hat jetzt auch die vordere Filterdose an der Gasmaske (sonst gleich).
  - `aschenwacht_gasschutz_neu.png` (Grundbogen, 2730 px, scharf, ohne Glocken und Pistole) und `aschenwacht_gasschutz_posen_neu.png` (Posen ohne Gürtelpistole) statt der alten Gasschutz-Bögen. Die Grundbogen-Figuren sind größer als im alten 1024-px-Bogen: Höhe über `SH_SINGLE`/Maß wie gewohnt angleichen.
  - `konkordat_ordensschreiter_neu.png` statt `konkordat_ordensschreiter.png` (gleiches Aussehen, viel schärfer, 2398 px). Die Posenbögen bleiben vorerst.
  - Danach `figure_cut.py --game` und `figur_plastik.py`. Vergleichsbild alt/neu je Bogen.

# >>> NOTIZ (Berater 2026-11-25 13:20): Effektbögen E1–E6 sind gemalt – Einbau in U3 <<<
**Kein eigener `pa`.** Nur merken: Die Bögen liegen in `ui-quelle/effekte/neu/` (Übersicht und Hinweise in `LIESMICH.md` dort). Eingebaut werden sie **in U3 (figurennahe Effekte)**, nicht vorher.

- [ ] **62. Effektbögen aus Paket D einbauen (in U3).**
  1. Mit `tools/fx_cut.py` freistellen (Einträge in `CFG` mit Bedeutung je Variante), danach `src/fxneu.js` wie gewohnt. Rosa Säume entfernen (die fal-Bilder kamen als WebP 92 % durchs Netz).
  2. Zuordnung:
     - **E1** Gasgranate platzt in der Luft (Punkt 19): Hauptbild `fx_gasschliere_dick.png` (3 dicke Fahnen), dazu wahlweise feine Fäden aus `fx_gasschliere.png`.
     - **E2** großer Befehl: `fx_befehlsruf.png`, **nur die zwei Staubringe oben links und oben Mitte** (Rest hat das Modell aus der Vorlage abgemalt).
     - **E3** Gasschutz-Trupp entgiftet: `fx_filterdampf.png` (zum Dunst aus F82 `gasschutzFx`).
     - **E4** Kreuzschreiter Löwenmaul-Kanone: `fx_loewenmaul.png`, linker Bildrand = Mündung (`MUZ`); zusammen mit Punkt 43 (Löwenmaul stärker).
     - **E5** Eisenknecht Faustsalve: `fx_faustsalve.png` (zwei parallele Blitze, an `MUZ` und `MUZ2`).
     - **E6** Kürassier Hinrichtung: `fx_kettenklinge.png` (kalter Schnittbogen; Blutstropfen über den Blut-Schalter abschaltbar, `BLUT_FILTER`).
  3. Bilder vorher/nachher je Effekt (ein Bild je Effekt reicht), Testseite `entwurf/probe/effekte.html` ergänzen.

# >>> JETZT (Enrico 2026-11-25 13:15): Antworten zu G2b/G3b – Paket G4 <<<
**Reihenfolge:** nächster `pa` = G4 (Punkt 61), danach Bilder nah + ganz und Partietest. **U2 erst nach G4.** CC-Stufe: Mittel.

- [x] **61. Antworten zu den Fragen aus G2b/G3b (Enrico 13:15).**
  1. **Echter Zinnenverlauf bauen** (wie im Bericht beschrieben: Grabenkanten folgen dem Rechteckumriss, Buchten springen nach vorn, Brustwehr nur vor den Buchten und knickt mit, Rückwall springt hinter den Durchgängen zurück, Graben schmaler ~0,6 R). Nur Darstellung, Regeln/Grabenfelder gleich, `buchtenJeFeld` weiter liefern. Bilder vorher/nachher **ganz** (das Band-Problem sieht man aus der Ferne) und nah.
  2. **Querwände/Eckstücke an ~20 % der Knicke weglassen** (zufällig, aber fest je Karte), damit es weniger gleichförmig wirkt.
  3. **Eigenes Feld „Acker“ auf Krähenfurt** statt „Garten“: gleiche Regel (×1,2 gegen Beschuss, Fahrzeuge/Geschütze 2 BP), Deckungsname „Hecke/Feldrain ×1,2“ (Punkt 60) bleibt. Text im Infofenster und Chronik (Format wie `entwurf/welt/gelaende_chroniken.md`):
     - Kurztext: „Gepflügter Acker unter Schnee, an den Rändern Hecken und Feldraine.“
     - Chronik – Quelle: *Bauernkalender von Krähenfurt, Winter 116 n. G.* – Text: *Die Furchen sind gefroren und die Hecken kahl, doch wer sich an den Feldrain duckt, wird von den Kugeln eher übersehen als vom Frost.*
     - In `gelaende_chroniken.md` die Zeile `acker` ergänzen.

# >>> JETZT (Berater 2026-11-25 10:15): Gelände-Teile sind gemalt – G2b/G3b <<<
**Reihenfolge:** erst G2a + G3a fertig machen (Punkt 58), **dann eigener `pa` für G2b + G3b**: die neuen Bilder einbauen. CC-Stufe: Mittel.

- [x] **59. Neue Gelände-Teile einbauen.** Alle 14 Teile aus `GELAENDE_G_PLAN.md` Abschnitt 3 (ohne F-1/F-2) liegen in **`ui-quelle/gelaende/neu_g/`**, Zuordnung und Hinweise in `neu_g/LIESMICH.md`. Übersicht: `entwurf/probe/gelaende_g1/teile_uebersicht.jpg` (falls nicht da: die Bilder selbst).
  - Mit `tools/gelaende_cut.py` freistellen wie die bisherigen Teile (Höhen in `TEILE` nach Plan-Tabelle; Streifen G-2/G-3/F-3 nahtlos machen), Plastizität mit `figur_plastik.py` (`gel_<name>`), einbetten.
  - **Beachten:** In `hecke_schnee.png` hat das Bildmodell oben Brücke/Brunnen/Holzstapel aus der Vorlage kopiert → **nur die zwei Heckenstreifen unten** nehmen. In `heuhaufen_schnee.png` den „Pilz auf der Stange“ (oben Mitte) weglassen. `graben_ecken.png` sind eher Außenecken/Stirnseiten – prüfen, wo sie passen; wenn echte Innenecken fehlen, im Bericht sagen, der Berater malt nach. `pflug_schnee.png` hat einen gemalten weichen Schneefleck – mitnehmen, wenn er sich in den Schnee fügt, sonst wegschneiden.
  - Verteilung wie im Plan (nie zwei gleiche nebeneinander), Bilder vorher/nachher nah + ganz für Grauwall und Krähenfurt. Gefällt etwas nicht oder fehlt ein Teil: im Bericht unter „Fragen an Enrico“ mit Bild, der Berater malt nach.
- [x] **60. Antworten zu G2a/G3a (Enrico 25.11. 11:25), zusammen mit Punkt 59 erledigen.**
  - **Krähenfurt (59 %) erst in U9 abgleichen**, jetzt nichts ändern.
  - **Deckungsname auf Krähenfurt: „Hecke/Feldrain ×1,2“** statt „Gartenmauer“ (nur Anzeige, Regel gleich; auf Sankt Ruß bleibt „Gartenmauer“).
  - **Grabenbild:** erst die gemalten Teile einbauen (Punkt 59), dann Bilder nah. Berater und Enrico schauen danach, ob die geraden Feuergräben mit den Buchten-Kästen noch „wie eine Leiter“ wirken; erst dann ggf. die Linie selbst eckiger (Feuerbuchten nach außen versetzt statt Kästen im Graben). Das jetzt schon im Bericht kurz einschätzen: Wie aufwendig wäre ein versetzter (zinnenförmiger) Grabenverlauf?

# >>> JETZT (Enrico 2026-11-25 08:35): Antworten zu G1 – jetzt G2a + G3a <<<
**Reihenfolge:** nächster `pa` = G2a + G3a (alles, was **ohne** neue Bilder geht). Danach Bericht mit Bildern und Messung, dann warten auf die gemalten Teile vom Berater. **U2 erst, wenn die Grabenform steht** (Feuerbuchten für die 10 Grabenplätze). CC-Stufe: Mittel.

- [x] **58. Antworten zu `GELAENDE_G_PLAN.md` (Enrico 08:35).**
  1. **Gräben: Richtung V2** (Feuerbuchten + Querwände + Rückwall + Pfützen) **mit gemalten Teilen** – der Berater malt G-1…G-10 (zuerst G-1, G-2, G-4).
  2. **Verbindungs-/Laufgräben und Sappen als eigene Linien je Karte** (`MAP.graeben`, Bild = Regel) – ja. Grauwall-Raster darf sich ändern; danach **Balance messen** (4 Startwerte gemittelt, Ziel ~50 %, nicht unter ±7 feilen).
  3. **Acker A** als Standard für Krähenfurt (Richtung je Acker, Feldrain im Code).
  4. **Hecke gibt Deckung ×1,2** gegen Beschuss (wie Garten), **Heuhaufen, Vogelscheuche, Pflug nur Schmuck**. Krähenfurt danach kurz messen.
  5. **Gemalter Acker (F-1) und Feldrain (F-2): vorerst nicht** – der Code-Acker reicht; nur falls Enrico später unzufrieden ist.
- **G2a jetzt:** Form `buchten` als Standard (Zufall in Länge/Tiefe der Buchten), `MAP.graeben` mit Feuer-/Lauf-/Sappenlinien für Grauwall (2 Laufgräben je Seite, 1–2 Sappen, eine Linie endet oder teilt sich), Grabenfelder daraus ableiten, Rückwall und Pfützen vorerst im Code, Balance messen. GBau soll die Feuerbuchten je Grabenfeld zurückgeben (für U2). Bis die gemalten Teile da sind, die heutigen Teile als Ersatz.
- **G3a jetzt:** Acker A Standard (`ACKER_ALT` bleibt), Furchenrichtung je Acker (±25°), Hecke als Feldart/Deko mit Deckung ×1,2 (vorerst gezeichneter Ersatz oder vorhandener Zaun), Platzhalter für Heuhaufen/Vogelscheuche/Pflug (erscheinen, sobald Bilder da), Krähenfurt messen.
- **Bilder:** vorher/nachher je Karte, nah + ganz.

# >>> JETZT (Enrico 2026-11-25 07:00): Gelände-Paket G – Gräben Grauwall, Felder Krähenfurt <<<
**Reihenfolge:** nächster `pa` = **G1: nur Probe und Plan**, nichts fest einbauen. Bilder + kurzer Plan im Bericht, dazu eine **Liste der Gelände-Bausteine, die neu gemalt werden müssen** (der Berater macht sie mit ComfyUI/Gemini, Machart wie `ui-quelle/gelaende/`, Magenta, keine gemalten Schatten). Danach entscheidet Enrico, dann G2/G3. Grundlage: `entwurf/probe/massstab/grauwall_U1_ganz.jpg`, `winterdorf_U1_ganz.jpg`. Regeln: STYLE.md „Gelände-Bausteine“. CC-Stufe für G1: hoch (Gestaltung + Plan).

- [ ] **56. Gräben auf Grauwall (Enrico: alle vier Punkte stören).**
  1. **Form:** heute gleichmäßig gewellte Bänder „wie Schlangen/Flüsse“. Gewünscht: **Zickzack mit Ecken und Querwänden** (Schulterwehren/Traversen, Feuerbuchten), wie echte Schützengräben – eckig, gebrochen, nicht weich geschwungen.
  2. **Rand:** aufgeworfener **Erdwall/Brustwehr** auf der Feindseite, **Sandsäcke**, auf der Rückseite niedriger Wall; Schlamm, Pfützen.
  3. **Abwechslung:** nicht überall dieselbe Wand und Sohle. Einzelteile: **Unterstand-Eingang** (Balken, Plane), **Leitern**, **Holzstege/Lattenroste** (gibt es teils), Stützbalken, eingestürzte Stelle, Schießscharte/Stahlschild, Drahtrolle am Rand, Kiste, Kanister.
  4. **Verlauf:** nicht drei gerade Parallelen. **Verbindungsgräben** (Laufgräben) zwischen den Linien, **Vorsprünge/Sappen** nach vorn, Knicke, eine Linie darf enden oder sich teilen. Kartendaten (Raster) ändern ist erlaubt; danach **Balance messen** (Grauwall, 4 Startwerte gemittelt, Ziel ~50 %, nicht unter ±7 feilen).
  - Prüfen, wie weit `gelaende_bau.js` (GBau) Zickzack innerhalb des Hexrasters kann (z. B. Graben-Mittellinie mit Knickpunkten statt Kurve, Traversen als aufrechte Teile).
  - **Die 10 Grabenplätze (U2) hängen an der neuen Form** – Plätze an Feuerbuchten denken.
  - Probe G1: 2–3 Varianten auf einem Kartenausschnitt (Nahbild + ganz), vorher/nachher.
- [ ] **57. Felder auf Krähenfurt (Enrico: alle vier Punkte stören).**
  1. **Kaum erkennbar:** heute nur graue Streifen. Es muss sofort als **Acker unter Schnee** lesbar sein: dunkle Erde schaut in den Furchen durch, Schneereste auf den Kämmen.
  2. **Zu künstlich:** Furchen nicht als gleichmäßiges Streifenmuster, sondern unregelmäßig (Breite, Helligkeit, leichte Krümmung, Lücken).
  3. **Ränder:** weicher, natürlicher Übergang zum Schnee (Feldrain, Schneewehe), kein ausgefranster oder harter Rand.
  4. **Mehr Leben:** Zaunreihen/Weidezaun, Hecke, Heuhaufen/Strohmieten, Feldweg mit Spuren, Vogelscheuche, ggf. liegengebliebener Pflug/Karren (als `deko` oder aufrechte Teile; Regeln unverändert, außer Deckung durch Hecke/Heuhaufen – dann messen).
  - Probe G1: Nahbild + ganz, vorher/nachher.

# >>> JETZT (Enrico 2026-11-25 06:15): Freigabe Umbau U0 + U1, Antworten Bauplan Abschnitt 12 <<<
**Reihenfolge:** Punkt 55 in `BAUPLAN_UMBAU.md` eintragen (Abschnitt 12 als beantwortet), dann **U0** bauen (eigener `pa`), danach **U1** (eigener `pa`). **Nach U1 anhalten:** als Nächstes kommt das Gelände-Paket G, das der Berater mit Enrico noch bespricht – nicht selbst anfangen. CC-Stufe beim Bauen: Mittel.

- [x] **55. Freigabe und Antworten (Enrico 25.11. 06:15).**
  - **Umbau freigegeben für U0 und U1.**
  - 1. Feuerkraft: wie vorgeschlagen in U5 beide Fassungen messen, Enrico entscheidet am Ergebnis.
  - 2. **Zusammenbruch: gleiche Schwelle für beide Seiten** (ausgleichen über die Armeen) – in U8/U9.
  - 3. **Umkämpftes Zielfeld: Zähler anhalten**, Besitzerwechsel setzt zurück – in U8.
  - 4. **Pannen/Festfahren: 1 Runde, schwere Panne 2** – in U8 (oder früher, wo es passt).
  - 5. **Kein Nachschub auf umkämpften Zielfeldern** – in U8/U9.
  - 6. **Entsetzenstest höchstens einmal je Einheit und Runde** (CC-Vorschlag angenommen) – in U7.

# >>> JETZT (Enrico 2026-11-24 23:30 bis 25.11. 00:25): Antworten zum Bauplan + zwei fremde Prüfungen <<<
**Reihenfolge:** nächster `pa` = **nur `entwurf/BAUPLAN_UMBAU.md` überarbeiten** mit den Punkten 52–54 (Abschnitt 6 beantwortet, Abschnitt 5 neue Reihenfolge, neue Abschnitte aus den Prüfungen), committen, Bericht mit kurzer Zusammenfassung der Änderungen – **noch nichts bauen**. Enrico und Berater prüfen den überarbeiteten Plan; **U0 erst nach Freigabe**.

- [x] **52. Antworten zu den offenen Fragen des Bauplans.**
  1. **Löwenoger 3 oder 4:** entscheidet Enrico am Probebild in U4 (wie geplant).
  2. **Gefallene Modelle bleiben liegen** (einige Runden, dann verblassen; mit dem Blut-Schalter abschaltbar).
  3. **Schlachtlänge kurz/mittel/lang = 12/18/24 Runden**, Auswahl im Startmenü; Zeiten im Spieltest nachmessen.
  4. **Halten aller Zielfelder: 2 eigene Runden am Stück** = vorzeitiger Sieg.
  5. **Rückweg-Schalter** (`MASSSTAB_ALT`, `MODELLSCHADEN_ALT` usw.) **bleiben bis nach Enricos Spieltest** drin (Berater-Entscheidung, Enrico nicht widersprochen).
  6. **Reihenfolge: Mittelweg** (Enrico nach Abwägung): **U0 → U1 Maßstab → U2 Klone/Graben → U5 Schaden über Modelle → U3 figurennahe Effekte → U4 neue Bögen → U6 Blut → U7 Moral → U8 Schlachtende → U9 Karten abgleichen.** Grund: Schaden kommt früher (Spielgefühl), steht aber auf fertigen Figuren und Gräben, nichts doppelt. Abhängigkeiten in Abschnitt 5 entsprechend anpassen (U3 Treffer-Spritzer/Mündungsfeuer dann schon mit fallenden Modellen abstimmen).
- Für den Bau: CC mit Stufe **Mittel**; nach jedem U-Paket Bericht mit Bildern, Enrico schaut.
- **Gelände vor U2:** Enrico gefallen die **Gräben auf Grauwall** und die **Felder auf Krähenfurt** nicht. Berater klärt mit Enrico die Details und schreibt ein eigenes Gelände-Paket. Im Bauplan einen Platz **zwischen U1 und U2** dafür vorsehen (Grabenplätze in U2 hängen an der Grabenform).
- [ ] **53. Figurenbögen je Fraktion in eigene Ordner (Enrico 23:46), im Umbau-Paket U4 (neue Bögen).** `ui-quelle/figuren/` aufteilen in `konkordat/`, `aschenwacht/`, `blaue_legion/`, `fahle/` (dritte Fraktion, Stil-Entwürfe liegen schon dort, siehe `fahle/LIESMICH.md` – **nicht schneiden, nicht einbauen**). Beim Umzug alle Werkzeuge und Listen anpassen, die Pfade kennen (`figure_cut.py`, `figur_plastik.py`, `panel_assets.py`, Porträts, `entwurf/probe/figuren.html`, MODELL_LISTE/PORTRAETS), Dateinamen behalten. Danach prüfen: `figure_cut.py --game` erzeugt dieselben `figs.js`-Einträge wie vorher (Vergleich vorher/nachher), Partietest ok. In den Bauplan bei U4 aufnehmen.

**Notiz Berater (Enrico 25.11. 00:00), noch kein Auftrag:** Die Fahlen erst nach dem Umbau. Wichtiger sind Enrico die **Gelände-Teile**: Die **Gräben auf Grauwall** gefallen ihm nicht, ebenso die **Felder auf der Winterkarte (Krähenfurt)**. Mit Enrico klären, was genau stört (Bilder), dann eigenes Paket. **Wichtig:** Gräben neu **vor U2** (10 Grabenplätze), sonst doppelte Arbeit.

- [x] **54. Fremde Prüfung einarbeiten (Enrico 25.11. 00:20, alle vier Bündel angenommen).** Ganze Prüfung: `entwurf/postfach/PRUEFUNG_FREMDE_KI_2026-11-25.md` (eine andere KI hat ein Regelwerk-Auszug geprüft; manche „Lücken“ dort sind nur Lücken der Zusammenfassung, im Code längst geregelt – nicht abarbeiten). In `entwurf/BAUPLAN_UMBAU.md` aufnehmen, **nichts bauen**:
  1. **Schaden & Pannen (U5/U8):** Feuerkraft nicht linear an die Modelle koppeln, sondern in Stufen (Vorschlag: 100–70 Stärke volle Kraft, 69–40 → 75 %, unter 40 → 50 %), gegen Abwärtsspirale (Lanchester). Pannen/Festfahren kürzer (1 Runde, schwere Panne 2) wegen 12–24-Runden-Schlachten. Nachschub-Schneeball messen (v. a. 20 Punkte je Abschuss, Zielfeld 10) und ggf. senken.
  2. **Zwischenmessungen:** nach U5, U7 und U8 je grob messen: Ø Runden, Siegquote nach Seite, fest/gemischte Aufstellung, Schaden je Typ, Überleben je Punkt, Anteil Einheiten, die sinnvoll handeln, Häufigkeit Flucht/Panne/Kontrollverlust, Anteil Siege je Art (Zusammenbruch/Ziele/Rundengrenze). Statistik beachten: 200 Schlachten ≈ ±7 Punkte Unsicherheit – nicht an Unterschieden unter ~7 Punkten feilen. **Neue Scharfschützen-Regel als eigenes Paket nach U8** (nicht gleichzeitig mit Schaden/Moral/Schlachtende).
  3. **Klare Begriffe:** verbindlich festlegen und im Bauplan aufschreiben: Hauptaktion, Hauptangriff, Zusatzwaffe (mit eigenem Limit), Reaktion (höchstens eine je gegnerischer Runde?), kostenlose Fähigkeit; prüfen, wie Breitseite, Dauerfeuer, Faustsalve, Seiten-MG, Sturmrollen, Generalangriff, Feuerbereitschaft + Sperrfeuer heute zählen. Vorschlag, wie das im Spiel angezeigt wird (Kampfprognose vor dem Angriff).
  4. **Preise in U9:** Spiegel-Einheiten (Kohorte 40/Grenadiere 30, Mahlwerk 35/Sensenwerk 40, Lanzenreiter 30/Sprenglanzen 25, Flammentrupp 45/Brandwerfer 50), Signaltrupp (15) und Fernsprechtrupp (20) wirken zu billig, Generalangriff (+1 Aktion, F53) – nachmessen, Unterschiede nur, wo die Messung sie trägt, und im Info-Fenster nachvollziehbar.
- **Reihenfolge bleibt der Mittelweg** (Punkt 52), nur Scharfschützen-Paket hinter U8 ergänzt.
- **Zweite Prüfung** (andere KI, `entwurf/postfach/PRUEFUNG_FREMDE_KI_2_2026-11-25.md`) bestätigt fast alles aus der ersten. Zusätzlich in den Bauplan:
  5. **Feuerkraft-Stufen weich machen:** keine harten Knicke (z. B. sanfter Übergang oder an Waffenträger gekoppelt), damit es nachvollziehbar bleibt.
  6. **Risiko-Anzeige vor dem Zug:** Zugvorschau warnt künftig auch vor Freischlag, Entsetzenstest (Chance) und Panne/Festfahren (ähnlich `feldWirkung`/`pathHazard`).
  7. **Halten aller Zielfelder:** festlegen, ob ein umkämpftes Feld den 2-Runden-Zähler anhält oder zurücksetzt; prüfen, ob Haupt-/Nebenziele nötig sind. **Rundengrenze je Karte** anpassbar (Graben-Karte langsamer).
  8. **Kurz beantworten im Bauplan** (aus dem Code, nicht raten): Wie wirkt „Befehle 1 Runde früher“ bei Signal-/Fernsprechtrupp, wenn Befehle als „höchstens 3 je Schlacht“ zählen? Was genau zählt beim Zusammenbruch (Startarmee oder aktuell, mit Verstärkungen?) und warum 0,55 / 0,64? Darf ein MG im selben Zug aufbauen und schießen? Dürfen Einheiten vor und nach der Aktion ziehen?

# >>> JETZT (Enrico 2026-11-24 23:20): Antwort zu Paket F2 – dann BAUPLAN <<<
- [x] **51. Fahrzeuge und Schreiter beim neuen Maßstab ×0,85** (Enrico wählt die Empfehlung). Gilt für alle Kettenfahrzeuge (Landkoloss, Sturmpanzer, Bohrkoloss) und alle Schreiter inkl. Kreuzschreiter und Eisenknecht. Jetzt nichts bauen – in den Bauplan übernehmen.
- **Nächster `pa` = Bauplan für den großen Umbau** (Etappe 3/4 in PLAN.md). **Nur planen, nichts bauen.** Datei `entwurf/BAUPLAN_UMBAU.md`, im Bericht kurz zusammenfassen. Inhalt mindestens:
  - Ziel-Maßstab E1 + Fahrzeuge/Schreiter ×0,85, Klone erst im Code (mehrere Ruheposen vorbereiten), Helden schrumpfen mit, Graben 10 Plätze (Punkte 48–51).
  - Liste „skaliert von selbst / muss nachgezogen werden“ mit grobem Aufwand (Punkt 48).
  - Schaden über Modelle (Treffer kosten sichtbar Männer), mehr Blut (abschaltbar), Moral sinkt schrittweise, Schlachtende aus Punkten + Moral + Zeitgrenze (Etappe 4).
  - Aufgehobene Regeln: Löwenmaul-Kanone/Furcht-Aura (43), neue Scharfschützen-Regel `SCHARF_NEU` (44), Furcht/Gebrüll über den Entsetzenstest (45b), Löwenoger 3 oder 4 Modelle (26).
  - Überarbeitete Figurenbögen aus `MODELL_LISTE.md` einbauen.
  - **Reihenfolge in Paketen** (je Paket ein `pa`, Sparregeln), was zuerst muss, was voneinander abhängt, wo gemessen wird (sim), welche Karten neu abgeglichen werden müssen, und **Rückweg** (Git-Tag vor dem Umbau).
  - Offene Fragen an Enrico gesammelt am Ende.

# >>> JETZT (Enrico 2026-11-24 23:12): Antworten zu Paket F Abschluss – Paket F2 <<<
**Reihenfolge:** eigener `pa` (Paket F2), danach Bericht und aufhören. Der Bauplan kommt im nächsten `pa`.

- [x] **50. Antworten zu Maßstab und Schadenszahlen.**
  - **(a) Maßstab: Enrico wählt E1** (Soldat 0,52 Feldradien, 10 Schützen / 6 Reiter / Spezial 4, lockerer verteilt; MG, Geschütze, Reiter und Helden schrumpfen im selben Verhältnis mit). Das gilt jetzt als **Ziel-Maßstab für den Bauplan** (Punkt 48 „Maßstab offen“ ist damit beantwortet, Rest bleibt: Klone erst im Code, Graben 10 Plätze, Liste skaliert/nachziehen).
  - **(b) Panzer und Schreiter etwas mitschrumpfen** (Enrico: ja, sie wirken in E riesig, besonders der Kreuzschreiter). Erst als **Probe**: E1 mit Fahrzeugen und Schreitern **×0,9** und **×0,85** (Landkoloss, Sturmpanzer, Kreuzschreiter, Eisenknecht, übrige Schreiter), gleiche Gruppe und Kamera. Bild `entwurf/probe/massstab/vergleich_E1_fahrzeuge_grauwall_nah.jpg` (E1 heute / ×0,9 / ×0,85), dasselbe für Winterdorf. Im Bericht Empfehlung, welcher Wert; Enrico entscheidet. Fahrzeuge dürfen nicht ins Nachbarfeld ragen.
  - **(c) Schadenszahlen der Aschenwacht kräftiger** (Enrico: ja). Heute wirken die grauen Zahlen auf Schlamm und Schnee blass neben den roten. Gewünscht: **heller Knochenweiß-Kern, dickere dunkle Kontur und derselbe Stempelrand/Schatten wie bei den roten**, damit beide Seiten gleich gut lesbar sind; Feldgrau nur als Verlauf zum Rand. Blaue Legion bei der Gelegenheit gegenprüfen. Bild wie `schadenszahlen/uebersicht.jpg` (vorher/nachher). Danach index.html bauen und einchecken (Ende von F2).

# >>> JETZT (Enrico 2026-11-24 22:55): Antworten zu Paket F Teil 2/3 <<<
**Reihenfolge:** Punkt 48 nur abhaken und in den Bauplan übernehmen; danach Punkt 17 (Schadenszahlen), dann **Punkt 49 (neue Maßstab-Probe E)**, Abschluss Paket F (index.html), dann Bauplan.

- [x] **48. Antworten (für den Bauplan des großen Umbaus, jetzt nichts bauen):**
  - **ACHTUNG – Maßstab noch NICHT entschieden:** Enrico (22:52): „Ich habe noch keine Schrumpf-Fassung gesehen, mit der ich zufrieden war.“ Weder B, C noch D ist abgenommen. Die folgenden Antworten gelten nur **für den Fall**, dass es auf mehr, kleinere Figuren hinausläuft. Im Bauplan den Maßstab als **offene Entscheidung** führen; der Berater klärt mit Enrico, was ihn stört, und gibt ggf. neue Probebilder in Auftrag.
  - **Klone bei 10 Schützen:** zuerst **im Code** – jede Figur einzeln spiegeln und leicht versetzen/drehen (`drawNewFigs`, heute wird der ganze Trupp gemeinsam gespiegelt). Neue Ruheposen (3–4 je Fraktion) malt der Berater **später** nach und nach, zusammen mit den überarbeiteten Bögen; der Code soll mehrere Ruheposen je Trupp aufnehmen können, sobald sie da sind.
  - **Helden schrumpfen mit** (wie in der Probe, im gleichen Verhältnis zum Soldaten). Fahrzeuge, Schreiter, MG und Geschütze bleiben gleich groß.
  - **Graben:** 10 Plätze entlang der Grabenlinie (`gbPlatz`) gehören in den Bauplan.
  - **Im Bauplan eine Liste „was skaliert von selbst, was muss nachgezogen werden“** (Enrico 22:56 sorgt sich, dass beim Maßstab alles neu muss): je Bereich angeben, ob er schon relativ rechnet (z. B. Effektgrößen in Feldradien `FX_SZ`, Mündungen `MUZ` als Bildanteil, Trefferpunkt `bodyPos` aus den Figurenkästen) oder von Hand angepasst werden muss (Mündungsfeuer je Figur, Posen-Versatz, Grabenplätze, Kopfzeichen-Höhe, Leuchtspuren, Blut/Bodenspuren, Schadenszahlen, Ringe/Balken bleiben bewusst gleich groß). Mit grober Aufwandsschätzung je Punkt.
  - **Sätze in `STIMMEN_FEHLEN.md`:** Berater hat sie gelesen, Ton passt. Drei kleine Änderungen bitte in der Datei eintragen: Aschenwacht Koloss „Stahl kommt!“ → **„Panzer!“**; Aschenwacht Granate „Wurf!“ → **„Handgranate!“**; Rest so lassen. Sprachaufnahmen/Stimmen klonen kommen **später** (nicht im Umbau-Plan einplanen, nur als spätere Stufe erwähnen).
- [x] **49. Neue Maßstab-Probe E (Enrico 22:58, nach dem Vergleichsbild A–D).** Enrico zu D: **Einheitenzahl gefällt** (10 Schützen / 6 Reiter / Spezial 4), wirkt aber **etwas gedrängt**. Klone später. **Außerdem müssen Kanonen/Geschütze, MG und Kavallerie (Pferde samt Reiter) im Modell mit kleiner werden**, damit der Maßstab zusammenpasst – in D waren Geschütze und MG unverändert. Insgesamt darf es **noch etwas kleiner** werden, aber **nicht super-mini**.
  - **Probe E** mit `tools/massstab_bilder.mjs` (Spiel unverändert, nur Haken im Speicher), gleiche Gruppe und Kamera wie A–D:
    - Figurenzahl wie D.
    - Soldaten **etwas kleiner als D** – zwei Stufen zeigen: **E1 = 0,52**, **E2 = 0,48** Feldradien (D war 0,58).
    - **Geschütze, MG-Trupps und Reiter im selben Verhältnis mitschrumpfen** wie die Soldaten (gegenüber heute). Helden schrumpfen mit.
    - **Panzer und Schreiter bleiben gleich groß** (Enrico hat sie nicht genannt; falls es im Bild unpassend wirkt, im Bericht sagen).
    - **Weniger gedrängt:** Figuren innerhalb des Feldes lockerer verteilen (größerer Abstand zwischen Reihen und Figuren, Trupp darf die Feldfläche besser ausnutzen, ohne ins Nachbarfeld zu ragen).
  - Bilder: `entwurf/probe/massstab/vergleich_E_grauwall_nah.jpg` (D, E1, E2 nebeneinander) und dasselbe für Krähenfurt (Winterdorf); dazu E1/E2 je einzeln nah. Kein Volllauf, Sparregel 2.

# >>> JETZT (Enrico 2026-11-24 22:02): Antworten zu Paket E Teil 5 (Aufstellungsphase) <<<
**Reihenfolge:** zu Beginn von Paket F.

- **Eingraben als Startzustand:** Enrico: **nein, so lassen** (wie von CC vorgeschlagen). Nichts bauen.
- [x] **46. Drehknöpfe der Aufstellung: Symbol für „links drehen“ spiegeln.** Beide Knöpfe haben heute denselben Drehpfeil. Kein neues Bild: das vorhandene Symbol im Code waagerecht spiegeln (z. B. CSS `transform: scaleX(-1)` am Symbol), damit links und rechts klar unterscheidbar sind. Bild nachher im Bericht.
- [x] **47. Partietest reparieren (vor dem großen Umbau).** `test_partie.mjs` meldet „Karte schwarz“ (Helligkeit 0) auch für alte Stände, die früher bestanden haben – Problem der Testumgebung, nicht des Spiels. Ursache finden (Headless-Chrome-Version/GPU/WebGL-Flag? Aufnahme zu früh? Canvas-Auslesen durch Filter/`willReadFrequently`?) und beheben, sodass der Test wieder echte Fehler meldet und keine falschen. Gegenprobe: ein Stand, der schwarz sein **müsste** (z. B. Zeichnen absichtlich abgeschaltet), muss weiter als Fehler gemeldet werden. Sparregel 2 beachten (unter 10 Minuten je Lauf).

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

- [x] **44. Antwort zu Paket E Teil 2 (Scharfschützen, Punkt 3): Variante C (Enrico 19:48).** Alte Regel bleibt im Spiel. Die neue Regel (`SCHARF_NEU=1`: nur aus dem Stand, ×1,6 gegen Ungepanzerte, kein `pin`, Fähigkeit „Kopf runter!“) **bleibt im Code und schaltbar**, nicht löschen. Wird beim großen Umbau (Schaden über Modelle, Moral) wieder aufgegriffen und dann zusammen mit den Karten abgeglichen. Jetzt nichts weiter tun, nur abhaken; danach mit Punkt 16 weitermachen.
- [x] **45. Antworten zu Paket E Teil 4 (Entsetzenstest, Enrico 20:45).** (a) Häufigkeit **passt so**, `P.ENTSETZ_BASIS` bleibt; erst im Spieltest nachschärfen. (b) Vorschlag **angenommen, aber erst beim großen Umbau** (zusammen mit Punkt 43): Furcht-Aura des Kürassiers und Löwengebrüll nutzen dann denselben Entsetzenstest (eigener Grundwert, gleiche Einflüsse, gleiche Anzeige) statt pauschalem Moralabzug. Jetzt nichts bauen, nur abhaken.
- **Hinweis an CC:** Die Scharfschützen-Frage aus Teil 2 ist mit **Punkt 44 beantwortet** (Variante C). Bitte 44 und 45 abhaken und im Bericht nicht mehr als offen führen. Danach Punkt 2 (Aufstellungsphase).

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

✓ **2. Aufstellungsphase:**
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

✓ **16. Feldkanone: Sperrfeuer weg, dafür panzerbrechende Granaten:**
- **Sperrfeuer streichen** (die Feldkanone ist ein Direktschuss-Geschütz).
- Normaler Schuss = **Standardgranate** (gegen Infanterie/alles), weiter direkt und flach.
- Neue Fähigkeit **„Panzergranate“** mit **begrenzten Ladungen** (Vorschlag 3 je Schlacht, wie `T.ladungen`/`u.ladUsed` der Mineure): starker Schuss gegen Fahrzeuge, Schreiter und gepanzerte Ziele (Waffenart „schwer/AT“ im Faktor-Dreieck), Zähler am Knopf.
- Balance: Wenn die Feldkanone damit zu stark wird, den **normalen Schuss gegen Panzer etwas schwächer** machen, sodass die Panzergranate der eigentliche Panzerknacker ist. Messen (sim 200, alle drei Karten), Preis neu berechnen, KI: Panzergranate nur gegen gepanzerte Ziele. Kein „Im echten Krieg“-Text dazu (Enrico 18:44: eigene Fantasy-Welt, Weltkriegs-Bezüge nicht mehr nötig – Grundsatzfrage zu den bestehenden Texten folgt). Ton/Effekt für den Panzergranaten-Schuss vorschlagen.

**17. ✓ Schadenszahlen im Spielstil:** Die aufsteigenden Zahlen sollen zum **schroffen Stil** passen (Ziffernschrift „Arm Ziffer“/`tools/ziffern.py`, gern rauer, wie gestempelt/gekratzt), aber **immer gut lesbar** bleiben (Kontur/Schatten). **Je Seite eigene Optik**, damit man sofort sieht, wer Schaden nimmt: z. B. Konkordat Ochsenblut-Töne, Aschenwacht Feldgrau/Knochenweiß – andere Füllung/Textur, gleiche Lesbarkeit. Falls es **kritische Treffer** gibt (prüfen; sonst nur vorbereiten, keine neue Regel): kleines **„Krit!“** daneben. Entwurf mit Screenshots (hell/dunkel, Schnee/Schlamm, 1280/2560 px), dann einbauen.

✓ **18. Schrecken durch Panzer/Fahrzeuge als „Entsetzenstest“:** Heute lösen Fahrzeuge Schrecken (Moralverlust/Flucht) offenbar schon aus, **nur weil sie sich bewegen/nähern**. → Ändern: Schrecken nur, **wenn ein Fahrzeug/Koloss eine Einheit angreift** (Beschuss oder Nahkampf/Überrollen/Sturmrollen). Dann macht die angegriffene Einheit einen **Entsetzenstest** (wie bei Warhammer): **geringe** Grundwahrscheinlichkeit, steigt mit wenig Stärke/wenigen lebenden Figuren, niedriger Moral, schlechter Deckung, Einheitsart (Fußtruppen, Geschützbedienungen anfälliger; Elite/Sturmtruppen weniger); sinkt mit Anführer/Banner in der Nähe. Bei Misserfolg: niedergehalten oder zurückweichen (keine Sofortflucht bei voller Stärke). **Immun:** Helden, Schreiter/Mechs („Roboter“), Kampfanzüge, Fahrzeuge selbst. Kopfzeichen bei bestandenem/nicht bestandenem Test. Formel vorschlagen, sim 200 auf allen Karten (wie oft ausgelöst, wie oft durchgefallen, Siegquote vorher/nachher). Den Test ggf. später auch für Helden-Furcht (Kürassier) und Löwengebrüll vereinheitlichen – im Bericht vorschlagen.

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

# >>> ✓ JETZT (Enrico 2026-11-23 17:20): Liste fehlender Sprachbefehle + Stimmproben zum Klonen (nur Liste, nichts einbauen) <<<
**Reihenfolge:** nach 16:50 (Ton-Pult 3) und 17:10 (Brainstorm/Maßstab). Kleiner Auftrag.

Enrico vermisst gesprochene Befehle (z. B. „Feuer frei“). Der Berater will die fehlenden Sätze mit **geklonten Suno-Stimmen** (die „Command & Conquer“-Sprüche aus `sound-quelle/Voices/eigene/`) bei fal.ai erzeugen. Dafür bitte:

1. **Liste aller Befehle, Fähigkeiten und Momente, die im Spiel keine eigene gesprochene Zeile haben** (aus dem Code, nicht aus der alten TONPLAETZE.md): je Seite (Konkordat = Englisch, Aschenwacht = Deutsch) und je Sprechergruppe (Infanterie/Gasmaske, Kampfanzug, Panzer-Bordfunk, Schreiter, Hauptmann, General; Helden ausgenommen – die haben ElevenLabs-Stimmen). Mit Spalten: Moment/Befehl · wer spricht · heutiger Ton (oder „keiner“) · **Vorschlag für den Satz** (kurz, 1–4 Wörter, Ton wie die bestehenden Sprüche; Englisch bzw. Deutsch; Aschenwacht nüchtern-hart, keine echten Wehrmachts- oder NS-Formeln) · gewünschte Varianten (2–3). Beispiele: Feuer frei, Halten um jeden Preis, Sammeln (Aschenwacht), Sturmangriff, Generalangriff, Marsch, Banner aufpflanzen, Eingraben, MG in Stellung, Sperrfeuer, Ziel markiert, Feuerschlag, Rauch, Gas, Granate, Rückzug, Nachschub angekommen.
2. **Stimmproben zum Klonen:** je Seite und Sprechergruppe die 2–3 besten **ungefilterten** Suno-Originalaufnahmen (klar, ohne Musik/Hall, zusammen 10–30 s) heraussuchen und als WAV nach `entwurf/postfach/stimmproben/<seite>_<gruppe>_<n>.wav` kopieren (nur Kopien, Originale bleiben). Gibt es keine ungefilterte Fassung, die leichteste Filterstufe nehmen und das vermerken.
3. Ergebnis als `entwurf/postfach/STIMMEN_FEHLEN.md` (Tabelle) + kurzer Bericht. Nichts im Spiel ändern.

# >>> ✓ JETZT (Enrico 2026-11-23 17:10): Brainstorm festhalten + Probebild „Maßstab“ (NICHTS im Spiel ändern) <<<
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
