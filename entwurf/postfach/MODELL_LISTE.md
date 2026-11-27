# Modell-Liste – Figurenbögen überarbeiten (gepflegt vom Berater)

Werkzeug: ComfyUI lokal (Qwen Image 2.1 Image Edit), Ergebnisse in `C:\Users\erolf\AppData\Local\Comfy-Desktop\ComfyUI-Shared\output\Armargeddon\`.
Fertige, von Enrico abgenommene Bögen kommen nach `ui-quelle/figuren/<fraktion>/<name>_neu*.png` (Ordner je Fraktion seit U4); eingebaut werden sie später per Auftrag (figure_cut, figur_plastik).

**Stil-Ziel (Enrico 24.11.):** Detailgrad und Zeichenstil wie die stärksten Bögen: Konkordat MG, Konkordat Pioniere, Konkordat Reiter, Aschenwacht Reiter (drei Reiter mit Fahnen). Im Spiel verlieren die Figuren an Wirkung → Plastik-Probe (Punkt 27) und Maßstab A abwarten.

| # | Einheit / Bogen | Problem (Enrico) | Stand |
|---|---|---|---|
| 1 | Löwenoger `konkordat_loewenoger` | kitschig, zu groß; Stirnband; Krallen | ✓ abgenommen: **`konkordat_loewenoger_neu3.png`** (Panzerhandschuhe mit Klingen, Variante 2). Hintergrund dunkleres Pink (≈ 199/20/172) – beim Schneiden beachten. Einbau mit Maßstab A (Punkt 26) |
| 2 | Konkordat Sanitäter `konkordat_sanitaeter` + `_posen` | linke Figur hält zwei Mini-Tragen | ✓ abgenommen: **`konkordat_sanitaeter_neu.png`**, **`konkordat_sanitaeter_posen_neu.png`** (eine Trage über der Schulter) |
| 3 | Konkordat Scharfschützen | Läufe im Spiel abgeschnitten | Schnittfehler → Auftrag Punkt 32 (Paket B2) |
| 4a | Aschenwacht Flammen Grundbogen | Rohre ohne Schlauch | ✓ abgenommen: **`aschenwacht_flammen_neu.png`** (Fassung „nur Schlauch“; die zweite Fassung mit geraden Lanzen veränderte zu viel) |
| 4b | Konkordat Flammen Grundbogen | Waffen schief/Knüppel | ✓ abgenommen: **`konkordat_flammen_neu.png`** |
| 4c | Konkordat Flammen Posen | Mini-Röhrchen, halbe Waffen | ✓ abgenommen: **`konkordat_flammen_posen_neu.png`** |
| 4d | Aschenwacht Flammen Posen | Schlauch fehlt beim Getroffenen; Qwen-Versuch 1 hat die Getroffen-Pose verloren | ✓ abgenommen: **`aschenwacht_flammen_posen_neu.png`** (Getroffener einzeln bearbeitet) |
| 5 | Aschenwacht Gasschutz | Glocken; Pistole am Gürtel | ✓ 25.11.: **`aschenwacht_gasschutz_neu.png`** (Grundbogen neu und scharf, fal.ai, ohne Glocken/Pistole) und **`aschenwacht_gasschutz_posen_neu.png`** (Posen ohne Gürtelpistole). Einbau in U4 |
| 6 | Aschenwacht Panzerknechte | Gewehre zu klein | ✓ abgenommen: **`aschenwacht_panzerknecht_neu.png`** (große Gewehre, Kreuze weg) |
| 7 | Konkordat Reiter | Säbel wie halbes Messer | ✓ abgenommen: **`konkordat_reiter_neu.png`** (Säbel links lang, mit Blut). ✓ 25.11.: **`konkordat_reiter_neu2.png`** – rechtes Pferd hat jetzt auch die vordere Filterdose (nur der Kopfbereich ersetzt). Einbau in U4 |
| 8 | Stahlgänger `konkordat_stahl` | plastischer Probebogen | `konkordat_stahl_plastisch.jpg` im Projekt, Vergleich in Punkt 27 |
| 9 | Ordensschreiter | unscharf | ✓ 25.11.: **`konkordat_ordensschreiter_neu.png`** (Grundbogen scharf, 2398 px, Aussehen gleich). Posenbögen noch alt. Einbau in U4 |

**Arbeitsweise:** Bögen mit mehreren Posen immer Figur für Figur bearbeiten (ausschneiden → bearbeiten → zurücksetzen). Ganzer Bogen auf einmal verändert die Posen; ein Vorlagebild kann ganze Figuren kopieren.

## Effekt-Bögen und Töne (Wünsche von CC aus Paket D, 24.11.)
Stil wie `fx_faehigkeiten`: Tinte, Magenta-Hintergrund, keine Bodenschatten.

| # | Wunsch | Wofür | Stand |
|---|---|---|---|
| E1 | Gasschliere (sinkende, gebogene Gasfahne, 3 Varianten) | Gasgranate platzt in der Luft (Punkt 19) | ✓ 25.11. `fx_gasschliere.png` (dünn) + `fx_gasschliere_dick.png` (Hauptbild) |
| E2 | Befehlsruf (Bodenring, Schallwelle mit Staub, kleiner als Gebrüll) | großer Befehl | ✓ 25.11. `fx_befehlsruf.png` (nur die 2 Ringe oben links/Mitte) |
| E3 | Filterdampf (grauweiße Dampfschwaden) | Gasschutz-Trupp entgiftet | ✓ 25.11. `fx_filterdampf.png` |
| E4 | Mündungsdonner Löwenmaul-Kanone (Feuerstoß seitlich aus dem Maul) | Kreuzschreiter | ✓ 25.11. `fx_loewenmaul.png` |
| E5 | Doppelter Mündungsblitz beider Unterarm-Kanonen | Eisenknecht Faustsalve | ✓ 25.11. `fx_faustsalve.png` |
| E6 | Schnittbogen der Kettenklinge (kalt) | Kürassier Hinrichtung | ✓ 25.11. `fx_kettenklinge.png` |
| T1 | Dampfpfeife (tief, 1–1,5 s) | Sturmrollen | ✓ von Enrico gefunden (Pixabay), liegt in `sound-quelle/Moving tanks/`, Einbau = Auftrag Punkt 42 |
| T3 | Panzergranate der Feldkanone: heller, scharfer Abschuss („Peitschenknall“) + metallisches Durchschlagen | Feldkanone, Fähigkeit Panzergranate (Paket E Teil 3) | **macht Enrico selbst** (24.11. 21:41); Behelf: Kanone + `einschlag_panzer` |
| T2 | Bessere Einschläge (Matsch/Erde/Stein) | Granaten | Stable Audio verworfen; Sonniss GDC 2026 hat keine Einschläge (Enrico). **Töne macht Enrico selbst**, Berater nur auf Zuruf |

**Stand 25.11. 13:20:** Alle Effektbögen E1–E6 liegen in `ui-quelle/effekte/neu/` (Einbau in U3, Auftrag Punkt 62). fal.ai-Kosten heute ca. 0,40 $.

**Stand 24.11. 21:41:** Töne (T2, T3) übernimmt Enrico selbst. Geklonte Stimmen für fehlende Befehle: später.

## Gelände-Teile für Paket G (Liste aus `entwurf/GELAENDE_G_PLAN.md` Abschnitt 3, Stand 25.11.)
Machart wie `ui-quelle/gelaende/`: Magenta, schräg von vorn oben, keine gemalten Bodenschatten, Licht links oben, Tuschekonturen.

| # | Teil | Stand |
|---|---|---|
| G-1 | Querwand (Traverse), 3 Varianten | ✓ gemalt 25.11. (`ui-quelle/gelaende/neu_g/`) |
| G-2 | Brustwehr mit Sandsäcken, kachelbarer Streifen | ✓ gemalt 25.11. (`ui-quelle/gelaende/neu_g/`) |
| G-4 | Grabenecken innen/außen, je 2 | ✓ gemalt 25.11. (`ui-quelle/gelaende/neu_g/`) |
| G-3 | Rückwall, kachelbarer Streifen | ✓ gemalt 25.11. (`ui-quelle/gelaende/neu_g/`) |
| G-5 | Lattenrost-Stücke, 3–4 | ✓ gemalt 25.11. (`ui-quelle/gelaende/neu_g/`) |
| G-6 | Pfützen, 3 | ✓ gemalt 25.11. (`ui-quelle/gelaende/neu_g/`) |
| G-7 | Leiter, 2 | ✓ gemalt 25.11. (`ui-quelle/gelaende/neu_g/`) |
| G-8 | Unterstand-Eingang | ✓ gemalt 25.11. (`ui-quelle/gelaende/neu_g/`) |
| G-9 | Stahlschild/Schießscharte, 2 | ✓ gemalt 25.11. (`ui-quelle/gelaende/neu_g/`) |
| G-10 | Kram: Kisten, Kanister, Balken, Drahtrolle, Einsturz | ✓ gemalt 25.11. (`ui-quelle/gelaende/neu_g/`) |
| F-3 | Hecke mit Schnee, Streifen, 2 | ✓ gemalt 25.11. (`ui-quelle/gelaende/neu_g/`) |
| F-4 | Heuhaufen mit Schneehaube, 3 | ✓ gemalt 25.11. (`ui-quelle/gelaende/neu_g/`) |
| F-5 | Vogelscheuche (finster, kein Kitsch) | ✓ gemalt 25.11. (`ui-quelle/gelaende/neu_g/`) |
| F-6 | Pflug halb im Schnee | ✓ gemalt 25.11. (`ui-quelle/gelaende/neu_g/`) |
| F-1/F-2 | gemalter Acker / Feldrain | nicht nötig (Enrico 25.11.) |
