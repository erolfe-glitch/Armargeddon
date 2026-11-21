# Prüfliste (Prüfrunde 2026-11-21)

Nur geprüft, nichts umgebaut. Stand: Commit `a8ba492`. Jeder Fund: Ort, Schwere (hoch / mittel / klein), Vorschlag.

**Kurzfassung:**
- Keine Konsolenfehler in zwei kompletten KI-gegen-KI-Partien (Grauwall 12 Runden, Sankt Ruß 11 Runden).
- Die Bildrate ist unkritisch. Das eigentliche Leistungsthema ist die Dateigröße (59 MB).
- Die meisten Funde sind veraltete Texte nach den Regeländerungen F54/F66/F80/F81.
- Ein Ton-Fund erklärt „der Infanterie-Beschuss ballert nicht“ (3.1).

**Messgrundlage:** unsichtbarer Chrome (1920×1080) auf Enricos Rechner, Vorschau-Server lokal. Pegel aus den dekodierten Tönen von `src/sound.js` (lauteste 0,4-s-Fenster) mal Spiellautstärke aus `ui.js`.

---

## 1. Leistung

| Nr. | Fund | Ort | Schwere | Vorschlag |
|---|---|---|---|---|
| 1.1 | **Dateigröße 58,8 MB** (GitHub warnt ab 50, Grenze 100). Aufteilung: Töne 28,0 · Figuren 9,2 · Gelände 6,0 · alte Ganzkarten 2,6 · alte Einheitenbilder 2,3 · neue Effekte 2,0 · Panel 1,9 · Plastik-Karten 1,9 · alte Effekte 1,6 · Titelbild 1,2 MB | `index.html`, `src/*.js` | **hoch** | Punkte 1.2–1.5; damit sind etwa 43 MB erreichbar, ohne hörbaren oder sichtbaren Verlust im Spiel |
| 1.2 | **6,0 MB Töne, die das Spiel nie abspielt**: 39 Plätze nur zur Auswahl im Ton-Pult (`neu2_*` 4,65 MB, `neu_*` 1,23 MB, dazu `rifle2/3/4`, `huelsen`, `selGas`, `marschtritt`) | `src/sound.js`, `tools/sound_bau.json` | **hoch** | Auswahl-Töne in eine zweite Datei (`sound_pult.js`) bauen, die nur `tonpult.html`/`tonprobe.html` laden; ins Spiel nur, was `ui.js` benutzt. Nach Enricos Ton-Pult-Export die gewählten übernehmen |
| 1.3 | **Musik 9,45 MB** (Titel 178 s, Schlacht 239 s, Niederlage; Stereo 128 kbit/s) | `sound_bau.json` (Musik) | mittel | Schlachtmusik läuft im Spiel bei etwa −42 dB. Dort reichen 96 kbit/s oder Mono: spart etwa 2–3 MB. Titelmusik so lassen |
| 1.4 | **Sprüche 4,25 MB + Stimmfilter-Varianten 1,17 MB** | `sound.js` (`sv_*`, `*_gm/_gs/_bf/_mr`) | klein | So lassen (wird benutzt). Nur falls nötig: Sprüche auf 64 kbit/s Mono, falls der Encoder das kann |
| 1.5 | **Alte Daten für die abgeschaltete flache Ansicht bzw. alte Karten**: `mapimg.js` 2,6 MB (gemalte Ganzkarten), `art.js` 2,3 MB (alte Einheitenbilder, nur noch Ersatz z. B. Blaue Legion), `fx.js` 1,6 MB (alte Effekte, 15 Zugriffe als Ersatz) | `src/mapimg.js`, `src/art.js`, `src/fx.js` | mittel | Erst entscheiden, ob die 8 alten Karten bleiben, bis sie neu gebaut sind. Wenn ja: liegen lassen. Wenn nein: `mapimg.js` raus (−2,6 MB). `art.js` nur noch die Bilder ohne neuen Bogen behalten |
| 1.6 | Alte Bögen `konkordat_kreuzschreiter` und `aschenwacht_eisenknecht` (zusammen etwa 250 KB) sind eingebettet, werden aber nicht mehr gezeichnet (FIGMAP zeigt auf `_neu`). 10 Posenbilder (270 KB) sind in keiner Tabelle genannt: `*_melder_posen_3`, `*_sanitaeter_posen_1`, `aschenwacht_schwer_posen_2`, `konkordat_schildwall_posen2_1/2`, `konkordat_schildwall_posen_3`, `konkordat_versorgung_posen2_3/4` | `src/figs.js`, `tools/figure_cut.py` | klein | Beim nächsten Figuren-Bau nicht mehr einbetten bzw. die Posen zuordnen (siehe 4.4) |
| 1.7 | **Ladezeit lokal 1,6–3,6 s** bis das Startmenü bedienbar ist; Speicher danach 125–210 MB. Online müssen 59 MB geladen werden. Beim Start werden **742 Audio-Objekte** mit `preload = 'auto'` angelegt | `ui.js` Zeile ~2190 (`SND[k] = new Audio(...)`) | mittel | Audio-Objekte erst beim ersten Abspielen anlegen (oder `preload = 'none'` für selten benutzte). Spart Startzeit und Speicher |
| 1.8 | **Bildrate unkritisch**: Ruhe 5,5 ms je Bild; während der Schlacht bei Tempo 1× im Mittel 5,6–8,6 ms (Sankt Ruß etwas schwerer als Grauwall), 95 % unter 16 ms, längstes Bild 41 ms, **kein Bild über 50 ms**; Speicher 133–149 MB, nach der ganzen Partie 127–140 MB (kein Anwachsen) | Messung Grauwall und Sankt Ruß, je 2 Runden mit allen Effekten | – | Nichts zu tun. Hinweis: gemessen im unsichtbaren Chrome; auf einem Digitalboard mit schwacher Grafik einmal von Hand gegenprüfen |
| 1.9 | Pulverdampf ist auf 36 Wölkchen begrenzt, Blutflecken am Boden (`gmark`) auf 320, alte `decals` auf 700 | `ui.js` (`pulverDampf`, `gmark`, `decals`) | klein | In Ordnung. Blutflecken bleiben für immer (`turns: 9999`); bei sehr langen Schlachten füllt sich die Liste bis zur Grenze, dann verschwinden die ältesten. So lassen |

## 2. Widersprüche Regeln ↔ Texte ↔ KI ↔ Anzeige

### 2a. Texte, die nicht mehr zur Regel passen

| Nr. | Fund | Ort | Schwere | Vorschlag |
|---|---|---|---|---|
| 2.1 | **Panzerbüchse**: Text „trifft Landkolosse ×2“ und Schlagwort „×2 gegen Kolosse“. Die Tabelle gibt ×1,5, und gegen Infanterie ×0,5 steht nirgends. Der Wert `at: 2` im Typ wird nur noch als Ja/Nein benutzt | `engine.js` TYPES `buechse`, SPECIALS | **hoch** | Text und Schlagwort aus `E.faktor` erzeugen („panzerbrechend: Panzer ×1,5, Fußtruppen ×0,5“); `at: 2` → `at: true` |
| 2.2 | **Graben-Pioniere**: Text „Nahkampf ×1,5 gegen Kolosse“ – seit F80 gestrichen (Klinge ×0,5) | TYPES `pionier` (`can`) | **hoch** | Satz streichen; Haftladung bleibt |
| 2.3 | **Stahlgänger/Kampfanzüge**: Text „Geschütze und Nahkampf treffen voll“. Laut Tabelle trifft Klinge/Kolben leicht Gepanzerte nur ×0,5. Gilt auch für Hünen, Panzerknechte, Löwenoger | TYPES `stahl`, `panzerk`, `huenen`, `oger` | **hoch** | Text anpassen: „Gewehr, MG und Klingen ×0,5; panzerbrechend ×1,5“ |
| 2.4 | **Kreuzschreiter**: Löwenmaul-Kanone ist panzerbrechend und trifft Fußtruppen nur ×0,5 (ebenso die Unterarm-Kanone) – im Text steht nur „stark gegen Fahrzeuge“ | TYPES `kreuz` | mittel | Ergänzen. Prüfen, ob gewollt: Der teuerste Schreiter des Konkordats ist damit gegen Infanterie auf Fernkampf schwach |
| 2.5 | **Bohrkoloss**: Text „Flammenstoß … auf ein Nachbarfeld“, Schlagwort „(2 Felder)“ – Regel seit F81: 2 Felder | TYPES `bohrer` (`can`) | mittel | Text auf 2 Felder |
| 2.6 | **Anführer-Schlagworte**: General „Befehl jede Runde, 3 Felder“, Hauptmann „Befehl alle 2 Runden, 2 Felder“. Regel: Befehle nur an Nachbarn (`ORDER_R` 1), höchstens 3 je Schlacht; großer Befehl 2 Felder. Fernsprechtrupp: „Anführer bis 3 Felder geben jede Runde einen Befehl“ | SPECIALS `generalA/D`, `hauptA/D`; TYPES `fernsprech` | **hoch** | Schlagworte neu: „3 Befehle je Schlacht, an Nachbarn“. Beim Fernsprechtrupp prüfen, ob die Relais-Regel noch etwas bewirkt, sonst Satz streichen |
| 2.7 | **Eingraben**: Knopftext und Einheitentext „Abwehr ×1,3, bis die Einheit wieder zieht“ – seit F36 muss man erst ausgraben (kostet die Aktion) | `ui.js` Knopf `dig`; TYPES `kohorte`, `grenadier` u. a. (`can`) | mittel | „…; zum Ziehen erst Ausgraben (Aktion)“ |
| 2.8 | **Artillerie**: Steilfeuer gegen Fahrzeuge/Schreiter nur ×0,5 (F66) steht in keinem Einheitentext; nur „Direktschuss ×2,5 auf Kolosse“ | TYPES `haubitze`, `geschuetz`, `moerser`, `minenwerfer` | mittel | Einen Halbsatz ergänzen |
| 2.9 | **Schlagworte fehlen**: Eingreiftrupp ohne „Panzergranate“, Mineure ohne „3 Ladungen“, Drahtpioniere/Mineure haben keine Panzerwaffe mehr (nirgends gesagt) | SPECIALS | klein | Ergänzen |
| 2.10 | **Regeln-Fenster** kennt nicht: Schere-Stein-Papier und Medaillen, Sturmrollen, Panzergranate, Ausgraben, Gebäude rammen/Trümmer, Ballon einholen, Flammen 2 Felder, Mineur-Ladungen | `src/index.html` (Regeln, Zeilen ~1190–1215) | **hoch** | Einen Absatz „Stark und schwach“ mit der Tabelle in drei Sätzen plus Medaillen-Legende; je ein Satz für die neuen Handlungen |
| 2.11 | Regeln-Fenster: „Zur Mitte der Schlacht trifft die Reserve der Aschenwacht ein“ – auf dem Grauwall gibt es keine Welle mehr (auf 8 alten Karten noch) | `index.html` Regeln „Nachschub“ | klein | „Auf einigen älteren Karten …“ oder streichen |
| 2.12 | Regeln-Fenster: Kirchenfahne „3 Siegpunkte“ stimmt mit den Kartendaten (3). In `CLAUDE.md` steht „zählt doppelt (4)“ | `CLAUDE.md` | klein | CLAUDE.md berichtigen |
| 2.13 | Der Hinweis in der Medaille zeigt beim **Löwenoger** „Schrot gegen schwere Panzerung wirkungslos“-Logik richtig (Silber über die Pranken), aber der Einheitentext sagt nichts zu Panzern | TYPES `oger` | klein | Halbsatz |

### 2b. Anzeige und Bedienung

| Nr. | Fund | Ort | Schwere | Vorschlag |
|---|---|---|---|---|
| 2.14 | **Landkoloss und Sturmpanzer zeigen weiter den Knopf „Nahkampf“** (`p-melee`), obwohl sie keinen Nahkampf mehr haben | `ui.js` `unitButtons` | **hoch** | Knopf für `T.keinNah` weglassen; Sturmrollen an seine Stelle |
| 2.15 | **Zugvorschau F60** kennt nur Schuss und Nahkampf. Für Landkoloss/Sturmpanzer zeigt sie „danach keine Aktion“, obwohl Sturmrollen ginge; Panzergranate, Haftladung, Flammen (jetzt 2 Felder – wird über `canFire` richtig erfasst) | `ui.js` `nachZugBerechnen` | mittel | Fähigkeiten mit Ziel (`abilTargets` vom Zielfeld aus) als drittes Symbol; Achtung: Sturmrollen mit Anlauf geht nur aus dem Stand |
| 2.16 | **Einschlag-Ton** entscheidet „Waffe wirkt“ noch mit einer eigenen Faustregel (`einschlagArt`: „bis F66 vereinfacht“) statt mit der Tabelle | `ui.js` `einschlagArt` | mittel | `E.faktor(a, d, true).f >= 1` benutzen; dann stimmen Ton und Regel immer überein (z. B. Artillerie auf Panzer = ×0,5 → eher Abpraller/dumpf) |
| 2.17 | **Ton-Pult** kennt die neuen Abläufe nicht: Panzergranate, Sturmrollen, Rammen, Ballon, Flammenschleife, Scharfschütze je Figur, Einschlag wirksam/Abpraller sind nur teilweise in `slotsVon` | `tools/tonpult_bau.mjs` | mittel | Mit dem Einbau von Enricos Export nachziehen |
| 2.18 | Medaillen sind 35 px (Regel: Knöpfe ≥ 40 px). Es sind Info-Flächen mit Tooltip per Antippen | `index.html` `.up-med .med` | klein | Auf Digitalboards prüfen; notfalls 40 px und zweizeilig |
| 2.19 | F61 Bewegung/Aktion: Texte sind umgestellt; keine „Aktionspunkte“ mehr in Knopf- oder Einheitentexten gefunden (nur in Kommentaren) | `ui.js`, `engine.js` | – | In Ordnung |

### 2c. KI

| Nr. | Fund | Ort | Schwere | Vorschlag |
|---|---|---|---|---|
| 2.20 | **Sturmrollen dominiert**: Die 3 Landkolosse rollen etwa 14-mal je Schlacht (fast jede dritte Runde je Koloss), die 2 Sturmpanzer etwa 8-mal. Der Schuss wird entsprechend seltener | `ai.js` `abilPlan` (`rollen`), `P.ROLLEN_*` | mittel | Enrico soll es im Spiel ansehen. Wenn es zu viel wirkt: Pause 3 statt 2 Runden oder Schwelle „nur wenn Schaden > Schuss × 1,3“ |
| 2.21 | **„Halten um jeden Preis“ (Konkordat) nur in 35 % der Schlachten**, der Generalangriff der Aschenwacht in fast jeder (0,94–1,0) | `ai.js` (großer Befehl) | mittel | Auslöser für „Halten“ prüfen (z. B. wenn 2+ eigene Einheiten in Reichweite wanken oder ein Zielfeld angegriffen wird) |
| 2.22 | **Gebäude rammen** kommt praktisch nie vor (0,01 je Schlacht auf Sankt Ruß) | `ai.js` (F79) | klein | In Ordnung, solange die KI lieber kämpft. Wenn die Kirche öfter fallen soll: rammen, wenn der Turm besetzt ist und kein Geschütz in Reichweite |
| 2.23 | **Die KI kauft nach fester Liste** (Konkordat zuerst Landkoloss, Aschenwacht zuerst Sturmbrecher) und **nie** Ballon, Mineure, Löwenoger, Hünen, Melder, Signal, Versorgung, Schildwall, Gasschutz. Die neuen Regeln für Ballon (einholen/aufsteigen) und Ladungen werden von der KI also nie gespielt und sind in der Simulation ungetestet | `ai.js` `WISH`, `buy` | mittel | Wunschliste nach Lage (fehlt Panzerabwehr? fehlt Aufklärung?) oder wenigstens die neuen Einheiten aufnehmen. Ballon/Mineure einmal gezielt mit `EXTRA_A` simulieren und die Nutzung zählen |
| 2.24 | Neue Regeln, die die KI nachweislich nutzt (je Schlacht): Ausgraben 3–7, Panzergranate 1–5, Generalangriff ~1, Zweitwaffen 10–32, Breitseite 3, Haftladung 0,2–1 | Simulationen `i_gw1`, `i_sr` | – | In Ordnung |
| 2.25 | Gefahr-Schätzung für Fahrzeuge (`fzNahGefahr`) rechnet Mineure/Drahtpioniere weiter als Nahkämpfer mit (`T.sapper`), obwohl sie keine Panzerwaffe mehr haben | `ai.js` Zeile 44 `nahKaempfer` | klein | `sapper` dort streichen; der Schalter `sapper` hat sonst nur noch die Aufgabe „Symbol Spitzhacke“ |

## 3. Tonmischung

Hörbarer Pegel im Spiel (Dateipegel + Lautstärke), lauteste Stellen:

| Gruppe | Pegel im Spiel |
|---|---|
| Einschlag schwere Artillerie, Sperrfeuer | −13 bis −15 dB |
| Kanonen (Löwenmaul, Panzer, Feldkanone), Panzerbüchse, Flamme | −16 bis −20 dB |
| MG, Drehlauf | −19 bis −23 dB |
| Stimmen (Rufe, Sprüche) | −17 bis −23 dB |
| **Gewehr Aschenwacht (`rifle2`)** | **−25 dB** |
| **Gewehr Konkordat (`rifle_1`, Enfield)** | **−33 dB** |
| Treffer weich (`einschlag`) | −29 bis −32 dB |
| **Abpraller** | **−35 bis −36 dB** |
| Titelmusik / Schlachtmusik | −31 dB / −42 dB |

| Nr. | Fund | Ort | Schwere | Vorschlag |
|---|---|---|---|---|
| 3.1 | **Das Konkordat-Gewehr ist rund 8 dB leiser als das der Aschenwacht und 10–15 dB leiser als MG und Kanonen.** Die Enfield-Datei selbst liegt bei −25,8 dB (alle anderen Schüsse bei −13 bis −17 dB). Das ist die Ursache für „Infanterie-Beschuss ballert nicht“ – die 40 % mehr Lautstärke aus F72 gleichen das nicht aus | `sound_bau.json` Platz `rifle` (Seite A), `lvl` | **hoch** | Enfield mit `lvl` etwa −15 neu bauen (wie die anderen Schüsse), dazu leichte Bassanhebung (`bass: 3`); danach die F72-Lautstärke 0,42 gegenhören |
| 3.2 | **Abpraller kaum hörbar** (−35 dB) und kein echter Querschläger-Ton | `sound_bau.json` `einschlag_abpraller`, `ui.js` Lautstärke 0,3 | mittel | `lvl` −14 statt −19/−20 oder Lautstärke 0,5; echte „ricochet“-Töne von Enrico |
| 3.3 | **Treffer-Ton weich** (`einschlag`, −29 bis −32 dB) geht unter Salve und Stimmen unter | `sound_bau.json` `einschlag` (`lvl` −18), Lautstärke 0,22–0,35 | mittel | `lvl` −14; Enrico wollte hörbare Einschläge (F64) |
| 3.4 | **Doppelter Ton beim selben Treffer**: Bei Scharfschütze und MG spielen „Kugel vorbei“ (vom Niederhalten) und „Einschlag“ zugleich | `ui.js` `case 'supp'` und `case 'hit'` | klein | „vorbei“ nur, wenn kein Treffer-Ereignis im selben Stapel folgt |
| 3.5 | **Abgehackte Enden** (noch laut 150 ms vor Schluss): `kolosskanone_1` (Quelle nur 0,4 s lang), `semi_1` (−20 dB kurz vor Ende), `pistol` und `sniper` (alte Töne ohne Quelle, 0,7 s bzw. 1,2 s) | `sound_bau.json` | klein | `kolosskanone_1` durch die zweite Variante ersetzen oder künstlichen Ausklang (`mix` mit Hall); `semi_1` `fo` 0,9; `pistol` aus der Walther-Quelle neu bauen (liegt als `neu2_pistole` vor) |
| 3.6 | **Schlachtmusik sehr leise** (−42 dB, rund 25 dB unter den Effekten), Titelmusik −31 dB | `ui.js` `MUSIK_VOL` | klein | So gewollt (F4). Nur gegenhören, ob sie bei Musikregler 80 % überhaupt noch wahrnehmbar ist |
| 3.7 | **Schritte sehr leise** (−31 dB), Galopp −25 bis −27 dB, Kettenrollen −17 bis −23 dB | `sound_bau.json` `schritte`, `ui.js` | klein | Schritte `lvl` um 4–6 dB anheben |
| 3.8 | Gleiche Quelle in mehreren Plätzen (gewollt, nur zur Kenntnis): `rifle2` ist zugleich Hauptgewehr Aschenwacht und Platz „Gewehr 2“; `neu2_autokanone_1/2` und `neu_mg_schwer_2` aus derselben 50er-MG-Datei; `einschlag_panzer` und `neu_wucht` aus denselben Axt-auf-Metall-Dateien | `sound_bau.json` | – | In Ordnung |
| 3.9 | Einschlag nach Ziel (F64): im Test richtig – Gewehr→Infanterie dumpf, Gewehr→Kampfanzug Abpraller, Panzerbüchse/Kanone→Panzer Metallkrach | `ui.js` `case 'hit'` | – | In Ordnung (siehe 2.16 für die Tabelle) |

## 4. Figuren

| Nr. | Fund | Ort | Schwere | Vorschlag |
|---|---|---|---|---|
| 4.1 | **Mündungspunkt vermessen** nur bei: MG (beide), Landkoloss, Sturmpanzer (+ Bord-MG), Turm-, Säge-, Klauen-, Kreuzschreiter (+ Unterarm), Eisenknecht, Hünen, Löwenoger. **Nur geschätzt** (vordere Bildkante auf fester Höhe): **Ordensschreiter**, **Donnerrohr/Grabengeschütz**, **Feldkanone**, **Mörser/Minenwerfer**, **Panzerbüchse**, Flammentrupps, Bohrkoloss-Flammenstoß, Seiten-MG des Landkolosses, Turm-MG | `ui.js` `MUZ`, `MUZ2`, `MUZ_FIG` | mittel | Die fett gedruckten mit dem F47-Verfahren nachmessen (Rohrende); bei Mörsern die Rohrmündung nach oben |
| 4.2 | Infanterie-Trupps (Soldat, Sturm, Pionier, Scharfschütze, Pirschjäger, Kampfanzüge, Hauptmann-Pistole) haben keinen Mündungspunkt je Pose; Mündungsfeuer sitzt an der Figurenkante in Laufhöhe | `ui.js` `fxMuzzle` | klein | Für die Anlege-Posen je einen Punkt in `MUZ_FIG` (wie bei den Hünen); zuerst Soldat und Kampfanzug |
| 4.3 | **Maßstab** (Bildhöhe in Soldatenhöhen): Soldaten 0,97–1,06 · Hauptmann 1,25 · Kampfanzüge 1,45 · Löwenoger 1,56 · Sturmpanzer 1,56 · Landkoloss 1,68 (mit Fahne) · Reiter 1,73 · **Hünen 1,92** · Schreiter 1,97 · Kreuzschreiter 2,39 · Eisenknecht 2,55. Auffällig: Die **Eisernen Hünen sind fast so hoch wie die Schreiter** (laut Notiz 1,85 mit Fahne); der **Fernsprechtrupp ist mit 0,81 klein** (kniend gemalt?), **Signaltrupp 1,21** (mit Antenne) | `tools/figure_cut.py` `SH_*`, `ui.js` FIGMAP `sc` | klein | Im Spiel nebeneinander ansehen: Hünen neben Sägeschreiter, Fernsprech neben Soldat. Gegebenenfalls Hünen auf 1,7 |
| 4.4 | **Posen-Lücken** – ohne jede Pose: Reiter und Sprenglanzen-Reiter, Meldegänger, Bannerträger, Eingreiftrupp, Gasschutz-Trupp, General, MG-Bedienungen, Geschütz-/Mörser-Bedienungen, Rauchwerfer, Panzerbüchse, alle Fahrzeuge und Schreiter (dort Code-Animation F73). **Ohne Getroffen-Pose**: Hünen, Löwenoger. **Ohne Schuss-Pose**: Pioniere/Drahtpioniere (schießen 2 Felder), Sturmbrecher (Wurf vorhanden) | `ui.js` `POSE_SETS`, `POSE_TYPEN` | mittel | Reihenfolge nach Häufigkeit: Reiter (Nahkampf, Getroffen), Eingreiftrupp (Sturm-Posen mitbenutzen), Pioniere (Anlegen), Hünen/Oger (Getroffen). Die 10 ungenutzten Posenbilder aus 1.6 prüfen |
| 4.5 | **Getroffen-Richtung** (F77): 12 Bilder gespiegelt, im Test fallen Stahlgänger vom Angreifer weg. Schwelle +0,12 Neigung; knapp darunter und nicht gespiegelt: `aschenwacht_soldat` (+0,08), `konkordat_versorgung_posen2` (+0,08), beide Pioniere (+0,07), beide Hauptleute (±0,07), `aschenwacht_kampfanzug` (+0,07) – das sind vorgebeugte „an die Brust gefasst“-Posen | `ui.js` `GETROFFEN_SPIEGEL` | klein | Enrico soll Grenadiere und Panzerknechte einmal ansehen; wenn sie zum Feind kippen, in die Liste aufnehmen |
| 4.6 | Scharfschütze und Mörser haben nur Konkordat-Bögen; bekommt die andere Seite so eine Einheit (nur im Test möglich), erscheint eine Ersatzfigur | `ui.js` FIGMAP | – | Kein Spielfall, nur zur Kenntnis |
| 4.7 | Verteidiger-Drehung (F76) und MG: Ein MG-Trupp dreht sich nach einem Nahkampf zum Angreifer; sein Schussfächer zeigt danach dorthin | `engine.js` `melee` | klein | Gewollt? Sonst MG ausnehmen (aufgebaut bleibt die Richtung) |

## 5. Sonstiges

| Nr. | Fund | Ort | Schwere | Vorschlag |
|---|---|---|---|---|
| 5.1 | **Komplette KI-gegen-KI-Partien im Browser**: Grauwall 12 Runden (Aschenwacht 57 : 27), Sankt Ruß 11 Runden (Aschenwacht 66 : 13), beide **0 Konsolenfehler**. Hinweis: Die Konkordat-Seite spielte dabei mit den ruhigen KI-Gewichten (die angriffslustige Einstellung gilt nur für die Computerseite), daher die klaren Ergebnisse – kein Balance-Befund | `pr_partie.mjs` (Arbeitsordner) | – | Als `tools/test_ki_partie.mjs` ins Projekt übernehmen – ergänzt `test_partie.mjs` (das nur 4 Runden spielt) |
| 5.2 | **Fehlerklasse „Kommentar verschluckt Code“** ist zweimal aufgetreten (Regelkonstanten bei F36, geballte Ladung bei F66): ein `//`-Kommentar wurde per Skript mitten in eine Zeile gesetzt. Alle drei Regel-Dateien sind jetzt abgesucht, keine weitere Stelle | `engine.js`, `ai.js`, `ui.js` | **hoch** (Vorbeugung) | Kleiner Test in `tools/`: jede P-Konstante muss eine Zahl sein, `E.preview` darf für alle Paarungen nie `NaN` liefern, und die Liste der P-Schlüssel wird mit einer gespeicherten Liste verglichen. Vor jedem Commit mit Regeländerung laufen lassen |
| 5.3 | **Tote Konstanten** (nirgends mehr gelesen): `P.MV2`, `P.ORDER_CD`, `P.MELEE_VS_WALKER`, `P.STORM_VS_WALKER`, `P.MARCH`, `P.STUCK_TURNS`, `P.STRIKE_CD`; `P_STUFE3_AT` und `at: 2` nur noch als Ja/Nein | `engine.js` P | klein | Streichen bzw. `at: true`; Kommentar bei `P_STUFE3_AT` anpassen |
| 5.4 | **Tote Funktionen**: `unitAtPixel` (ui.js), `buildGrauwall`, `autoFace` (engine.js) | – | klein | Streichen |
| 5.5 | **Alte flache Ansicht**: 28 Abfragen `VIEW.tilt()` (immer wahr), `OPT.tilt: false`, `renderPainted`, `renderImageMap`, alte Zeichenpfade für Einheiten (`art.js`), alte Effekte als Ersatz (15 Zugriffe auf `PJI`/`FXDATA`) | `ui.js` | mittel | Erst nach der Entscheidung zu den alten Karten (1.5) ausbauen; bis dahin nicht anfassen. Geschätzt 15–20 % von `ui.js` |
| 5.6 | **Speicherschlüssel**: in Gebrauch `arm.ton`, `arm.tempo2`, `arm.bildwirkung3`, `arm.musikvol`, `arm.effektvol`, `arm.shoppos`, `arm.meldungen`, `arm.hilfen`, `arm.ki`, `arm.kartelang`, `arm.kampfszene`, `arm.tonpult` (+ `.sel`). **Verwaist** bei Enrico: `arm.tempo`, `arm.bildwirkung`, `arm.bildwirkung2` (alte Schlüssel, werden nicht mehr gelesen; `arm.bildwirkung` kommt noch einmal im Code vor) | `ui.js` | klein | Beim Start einmal löschen (`removeItem`), den alten Lesezugriff entfernen |
| 5.7 | Ereignisse der Engine ohne eigene Darstellung: `open`, `over`, `pass` | `engine.js` → `ui.js` `playEvent` | – | Gewollt (kein Bild nötig); nur zur Kenntnis |
| 5.8 | **Ausgraben und `test_partie.mjs`**: Der Test gräbt ein und prüft Schussziele, aber nicht, dass eine eingegrabene Einheit ohne Ausgraben nicht ziehen kann | `tools/test_partie.mjs` | klein | Einen Schritt ergänzen |
| 5.9 | **Vorschau-Server** läuft nach einem Neustart der Sitzung nicht von selbst; alle Browser-Tests schlagen dann still mit „`__dbg` is not defined“ fehl | `tools/test_partie.mjs`, Harness | klein | Im Test zuerst die Seite abrufen und mit klarer Meldung abbrechen („Vorschau-Server auf 8765 läuft nicht“) |
| 5.10 | **Balance hängt an Einzelheiten**: Auf dem Grauwall machen 1 Sturmbrecher mehr oder weniger 38 Punkte Siegquote aus (75 % ↔ 37 %), 2 Grenadiere 15 Punkte; Sankt Ruß springt mit 2 zusätzlichen Trupps um 25–35 Punkte | `engine.js` MAPS `army` | mittel | Nach den Textkorrekturen keine Regeländerung ohne Nachmessen auf beiden Karten; mittelfristig die Karten weniger „auf Kante“ bauen (mehr Einheiten, kleinere Einzelwirkung) |
| 5.11 | `CLAUDE.md` ist an mehreren Stellen überholt: „Halten … Abwehr ×1,25“ stimmt, aber „Hauptmann 2 Felder, General 3 Felder“, „Kirchenfahne zählt doppelt (4)“, „Sturmpanzer … (ohne Bord-MG)“ in älteren Absätzen, Preis Löwenoger/Hünen-Abschnitt ohne F66 | `CLAUDE.md` | klein | Bei Gelegenheit die alten Absätze kürzen; neue Abschnitte (F66, F54, F70–F81) stehen drin |

---

## Empfohlene Reihenfolge

1. **Texte richtigstellen** (2.1–2.11, 2.14): kleine, sichere Änderungen, ohne Regelwirkung, also ohne Simulation.
2. **Gewehr-Pegel** (3.1–3.3): ein Ton-Bau, danach gegenhören.
3. **Vorbeuge-Test** (5.2) und KI-Partie-Test (5.1) ins Projekt.
4. **Dateigröße** (1.2, 1.3): Auswahl-Töne auslagern, sobald Enricos Ton-Pult-Export eingebaut ist.
5. KI-Punkte (2.20–2.23) und Mündungen/Posen (4.1, 4.4) als eigene Pakete.
