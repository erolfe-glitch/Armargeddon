# Fehlende Sprachbefehle (Stand 2026-11-24, aus dem Code)

Grundlage: `src/ui.js` – `rufBeiEreignis` (Truppenrufe je Ereignis), `RUF_STANDARD` (Rufe mit Standardton), `TONWAHL` (Ton-Pult-Wahl), `selectVoice` (Sprüche beim Anklicken), `schreiterRuf`/`SST` (Schreiter), `HELD_ST` (Helden, ausgenommen) sowie die Tonplätze in `src/sound.js`. Nichts im Spiel geändert.

## Was es heute schon gibt

| Sprechergruppe | vorhanden |
|---|---|
| Infanterie (Gasmaske leicht) | Spruch beim Anklicken (`sv_inf_A1–A5` / `sv_inf_D1–D4`); Rufe **Feuer!** (`ruf_feuer`, nur bei Befehl „Feuer frei“, Feuerschlag, Feuerbereitschaft durch Anführer), **Panik** einzeln/Gruppe, **Sterben** einzeln/Gruppe (ElevenLabs); Schmerz `pain`, Sanitäter `medic`, Kampfschrei `cry` (35 % im Nahkampf), Husten im Gas |
| Kampfanzug (Gasmaske mittel) | dieselben Sprecher mit stärkerem Filter: Spruch beim Anklicken (`sv_anzug_*`), Schmerz/Sanitäter |
| Panzer (Bordfunk) | nur Spruch beim Anklicken (`sv_panzer_A1–2` / `D1–2`) und Panik `panic_bf` |
| Schreiter (Maschine) | Anklicken (`sv_schreiter_*`) und 8 Anlässe `sst_*`: Auswahl, Bewegen, Angriff, Nahkampf, Getroffen, schwer beschädigt, Feind gesichtet, zerstört (je 2 Fassungen, **für beide Seiten dieselben Plätze**) |
| Hauptmann / General | Spruch beim Anklicken (`sv_fuehrer_*`, dieselben Sprecher ohne Filter); Befehl: Konkordat „Sammeln“ = alter Ruf `stand`, sonst `forward`; Aschenwacht jeder Befehl = Brüllen `roar` (kein Wort) |

**Wichtig:** `rufBeiEreignis` ruft schon heute viele Anlässe auf (Vorrücken, Feuer, Sturm, Niedergehalten, Rückzug, Sammeln, Granate, Gas, Koloss, Feuerbereit, Sanitäter, Held kommt, Held fällt, Sieg). Weil es dafür aber **keinen Standardton** und keine Pult-Wahl gibt, bleiben sie **stumm**. Neue Sätze lassen sich dort ohne neue Abspielstelle einhängen: Tonplatz `ruf_<anlass>` mit A/D-Fassungen und Eintrag in `RUF_STANDARD`.

## Fehlende Zeilen

Sprache: Konkordat Englisch, Aschenwacht Deutsch. Aschenwacht nüchtern-hart, keine Wehrmachts- oder NS-Formeln. „Heute“ = was jetzt klingt. **Varianten** = gewünschte Anzahl Fassungen.

### Infanterie (Gasmaske leicht) – Rufe aus `rufBeiEreignis` (Abspielstelle gibt es schon)

| Moment / Befehl | wer spricht | heute | Konkordat (EN) | Aschenwacht (DE) | Var. |
|---|---|---|---|---|---|
| Vorrücken (Zug über mehr als 2 Felder) | ziehender Trupp | keiner | „Move up!“ · „On me, lads!“ · „Forward!“ | „Vorrücken!“ · „Weiter, weiter!“ · „Aufschließen!“ | 3 |
| Schießen (eigener Schuss) | Schütze | keiner | „Open fire!“ · „Give 'em hell!“ · „Fire!“ | „Feuer!“ · „Ziel erfasst – Feuer!“ · „Schießen!“ | 3 |
| Sturm (Nahkampf beginnt) | Angreifer | Kampfschrei `cry` (35 %, kein Wort) | „Charge!“ · „Over the top!“ · „Get stuck in!“ | „Drauf!“ · „Ran an sie!“ · „Zum Sturm!“ | 3 |
| Niedergehalten | getroffener Trupp | keiner | „Heads down!“ · „Pinned! Can't move!“ | „Deckung!“ · „Köpfe runter!“ · „Wir liegen fest!“ | 2–3 |
| Rückzug / Zurückweichen | weichender Trupp | keiner (nur bei Panik ersatzweise) | „Fall back!“ · „Back, back!“ | „Zurück!“ · „Absetzen!“ | 2–3 |
| Gas (Wolke trifft) | getroffener Trupp | Husten | „Gas! Gas! Masks on!“ · „Gas!“ | „Gas! Masken auf!“ · „Gasalarm!“ | 2 |
| Granate (Handgranaten, Panzerknacker-Granate) | Werfer | keiner | „Grenade!“ · „Fire in the hole!“ | „Granate!“ · „Wurf!“ | 2 |
| Koloss / Entsetzenstest nicht bestanden | erschrockener Trupp | keiner | „Tank! Tank!“ · „It's a walker!“ · „God help us…“ | „Stahl kommt!“ · „Koloss!“ · „Der ist zu groß!“ | 3 |
| Feuerbereitschaft / MG-Sperrfeuer gesetzt | Schütze bzw. MG | keiner (nur mit Anführer `ruf_feuer`) | „Watching the line.“ · „Ready when they come.“ | „Feuerbereit.“ · „Wir warten auf sie.“ | 2 |
| Schwer verwundet (Stärke unter 35) | Trupp | Sanitäter `medic`/Stöhnen | „Medic!“ · „Stretcher-bearer!“ | „Sanitäter!“ · „Verwundeter hier!“ | 2 |
| Sieg | siegende Seite | keiner (nur Siegmusik) | „The field is ours!“ · „We held!“ | „Stellung genommen!“ · „Sie weichen!“ | 2 |
| Eigener Held betritt das Feld | eigene Seite | keiner (Held selbst hat Stimme) | „The Red Fist is with us!“ | „Der Kürassier ist da!“ | 1–2 |
| Eigener Held fällt | eigene Seite | Horn `held_fall_horn` | „The Fist is down!“ · „No… not him!“ | „Der Kürassier ist gefallen!“ | 1–2 |

### Infanterie – Momente ohne Ruf-Stelle (bräuchten eine neue Abspielstelle)

| Moment / Befehl | wer spricht | heute | Konkordat (EN) | Aschenwacht (DE) | Var. |
|---|---|---|---|---|---|
| Eingraben | Trupp | Atmen + Schaufel | „Dig in!“ · „Get those spades out!“ | „Eingraben!“ · „Spaten raus!“ | 2 |
| Ausgraben | Trupp | keiner | „Up and out!“ | „Raus aus dem Loch!“ | 1–2 |
| Marsch | Trupp | Marschtritt | „Double time!“ · „Quick march!“ | „Im Laufschritt!“ · „Tempo!“ | 2 |
| Sturmlauf | Sturmtrupp | keiner | „Run for it!“ · „Go, go, go!“ | „Los, los, los!“ · „Durch!“ | 2 |
| MG in Stellung / abbauen | MG-Trupp | `mgsetup`/`mgladen` (Geräusch) | „Gun's up!“ · „Packing up!“ | „MG steht!“ · „MG abbauen!“ | 2 |
| Rauch / Nebelwand | Rauchwerfer, Handgranate Nebel | Geräusch `rauch` | „Smoke out!“ · „Lay the smoke!“ | „Nebel!“ · „Nebelwand!“ | 2 |
| Draht schneiden | Pioniere | Geräusch `draht_schneiden` | „Cutting through!“ | „Draht auf!“ | 1–2 |
| Mine / Draht legen | Drahtpioniere | Geräusch | „Mine's set.“ · „Wire's down.“ | „Mine liegt.“ · „Draht gezogen.“ | 2 |
| Sprengladung / Stollen | Pioniere, Mineure | Geräusch | „Charge set – clear!“ | „Ladung gelegt – weg da!“ | 2 |
| Gegenstoß | Eingreiftrupp | keiner | „Push them back!“ | „Gegenstoß!“ | 2 |
| Kopf runter! (Scharfschützen) | Scharfschützen | keiner | „Got him.“ · „Keep your heads down!“ | „Treffer.“ · „Die bleiben unten.“ | 2 |
| Zielfeld genommen | einnehmender Trupp | keiner | „Position taken!“ · „Flag's ours!“ | „Stellung genommen!“ · „Gehört uns!“ | 2 |
| Zielfeld verloren | eigene Seite | keiner | „We've lost the flag!“ | „Stellung verloren!“ | 1–2 |
| Nachschub angekommen | neuer Trupp | keiner | „Reinforcements, reporting!“ · „Fresh men up!“ | „Verstärkung zur Stelle!“ · „Ersatz eingetroffen!“ | 2 |
| Sammeln geglückt (Moral zurück) | gesammelter Trupp | keiner | „We're steady!“ | „Wieder in Ordnung!“ | 1–2 |
| Gasschutz entgiftet | Gasschutz-Trupp | keiner | „Clear air – masks off!“ | „Luft rein!“ | 1 |

### Kampfanzug (Gasmaske mittel)
Gleiche Sätze wie Infanterie, kürzer und härter. Mindestens: **Vorrücken**, **Schießen**, **Sturm**, **Getroffen** (heute nur `pain_gs`), **Dauerfeuer** (Eiserne Hünen: „Dauerfeuer!“; Konkordat-Anzug „Keep firing!“), **Sprungangriff** (Löwenoger hat Brüllen, keine Worte nötig). 2 Fassungen je Satz.

### Panzer (Bordfunk stark)

| Moment / Befehl | heute | Konkordat (EN) | Aschenwacht (DE) | Var. |
|---|---|---|---|---|
| Bewegen | Motor | „Driver, advance.“ · „Moving up.“ | „Fahrer, vor.“ · „Rollen an.“ | 2 |
| Schießen | Kanone | „Gunner – fire!“ · „On the way!“ | „Richtschütze – Feuer!“ · „Schuss!“ | 2 |
| Getroffen | keiner | „We're hit!“ · „Armour holding!“ | „Treffer am Rumpf!“ · „Panzerung hält!“ | 2 |
| Schwer beschädigt | keiner | „Engine's burning!“ | „Wir brennen!“ | 1–2 |
| Panne / festgefahren | car-crash | „We're stuck!“ · „Track's gone!“ | „Wir sitzen fest!“ · „Kette gerissen!“ | 2 |
| Sturmrollen / Rammen | Aufprall | „Ram them!“ | „Überrollen!“ | 2 |
| Breitseite (Sturmpanzer) | Kanone | „Both sides, fire!“ | „Breitseite!“ | 1 |
| Zerstört | Explosion | „Bail out! Bail out!“ | „Aussteigen!“ | 1–2 |
| Feindpanzer gesichtet | keiner | „Enemy armour!“ | „Feindpanzer!“ | 1–2 |

### Schreiter (Maschine)
Die 8 Anlässe `sst_*` gibt es, aber nur **je 2 Fassungen für beide Seiten zusammen**. Fehlend:
- **Getrennte Sprachen**: Konkordat Englisch, Aschenwacht Deutsch, je Anlass 2 Fassungen (Auswahl, Bewegen, Angriff, Nahkampf, Getroffen, schwer beschädigt, Feind gesichtet, zerstört). Vorschlag Aschenwacht: „Bereit.“ · „Marschiere.“ · „Ziel bekämpft.“ · „Nahkampf.“ · „Schaden gemeldet.“ · „Systeme versagen.“ · „Feind erkannt.“ · „Abschaltung…“. Konkordat: „Ready.“ · „Advancing.“ · „Engaging.“ · „Close combat.“ · „Hull struck.“ · „Systems failing.“ · „Hostile sighted.“ · „Shutting down…“.
- **Fähigkeiten**: Löwengebrüll (Kreuzschreiter, nur Brüllen – Worte nicht nötig), **Faustsalve** (Eisenknecht: „Faustsalve!“, 2), Rauch/Gas-Werfer, falls ein Schreiter sie hat.

### Hauptmann und General (ohne Filter)

| Moment / Befehl | heute | Konkordat (EN) | Aschenwacht (DE) | Var. |
|---|---|---|---|---|
| Befehl Sammeln | Konkordat `stand` (alter Ruf), Aschenwacht Brüllen | „Rally to me!“ · „Steady, men!“ | „Sammeln!“ · „Ruhig, Männer!“ | 3 |
| Befehl „Feuer frei“ (Konkordat) | `forward` + `ruf_feuer` | „Fire at will!“ · „Let them have it!“ | – | 2–3 |
| Befehl „Sturmbefehl“ (Aschenwacht) | Brüllen | – | „Zum Sturm!“ · „Angriff!“ · „Vorwärts, drauf!“ | 3 |
| Großer Befehl „Halten um jeden Preis“ (General Konkordat) | wie Befehl | „Hold this line! Not one step back!“ · „We hold here!“ | – | 2 |
| Großer Befehl „Generalangriff“ (General Aschenwacht) | Brüllen | – | „Alle Mann – Angriff!“ · „Ganze Linie vor!“ | 2 |
| Banner aufpflanzen / aufnehmen | keiner | „Plant the colours!“ · „Colours up, move!“ | „Banner hoch!“ · „Banner auf, weiter!“ | 2 |
| Meldegänger losschicken | Hund + `comeon` | „Runner – go!“ | „Melder – los!“ | 2 |
| Ziel markieren (Ballon, Signaltrupp) | Leuchtschuss | „Target marked!“ · „Flare's up!“ | „Ziel markiert!“ · „Leuchtzeichen!“ | 2 |
| Feuerschlag anfordern (Fernsprechtrupp) | `ruf_feuer` | „Fire mission – now!“ | „Feuerschlag anfordern!“ | 2 |
| Artillerie-Sperrfeuer | Abschüsse | „Barrage – fire!“ | „Sperrfeuer!“ | 2 |
| Rückzugsbefehl / Lage schlecht | keiner | „Pull back to the line!“ | „Zurück in die Stellung!“ | 1–2 |

## Stimmproben zum Klonen

Ordner `entwurf/postfach/stimmproben/` (nur Kopien, Originale in `sound-quelle/Voices/eigene/` unverändert). Quelle sind die **ungefilterten** Suno-Originale (`<fraktion>_stimme_<n>.wav`, `panzer_…`, `schreiter_…`). Sprechpausen über 0,35 s sind auf 0,25 s gekürzt, damit die Probe dicht ist; höchstens 12 s je Datei. Auswahl nach Abstand Sprache zu Grundrauschen (je höher, desto sauberer). Infanterie, Kampfanzug, Hauptmann und General sind **dieselben Sprecher** (nur der Filter im Spiel unterscheidet sie), deshalb eine gemeinsame Gruppe „infanterie“.

| Datei | aus | Länge | Abstand |
|---|---|---|---|
| konkordat_infanterie_1.wav | konkordat_stimme_5 (Spiel: Stimme A5) | 9,0 s | 63 dB |
| konkordat_infanterie_2.wav | konkordat_stimme_3 (A3) | 9,4 s | 58 dB |
| konkordat_infanterie_3.wav | konkordat_stimme_1 (A1) | 12,0 s | 52 dB |
| aschenwacht_infanterie_1.wav | aschenwacht_stimme_4 (D4) | 11,7 s | 62 dB |
| aschenwacht_infanterie_2.wav | aschenwacht_stimme_1 (D1) | 10,1 s | 60 dB |
| aschenwacht_infanterie_3.wav | aschenwacht_stimme_2 (D2) | 12,0 s | 59 dB |
| konkordat_panzer_1/2.wav | panzer_konkordat_stimme_2 / _1 | je 7,2 s | 68 / 60 dB |
| aschenwacht_panzer_1/2.wav | panzer_aschenwacht_stimme_1 / _2 | 7,1 / 8,9 s | 69 / 66 dB |
| konkordat_schreiter_1/2.wav | schreiter_konkordat_stimme_1 / _2 | 8,3 / 11,3 s | 71 / 65 dB |
| aschenwacht_schreiter_1/2.wav | schreiter_aschenwacht_stimme_1 / _2 | je 12,0 s | 72 / 60 dB |

Nicht genommen: konkordat_stimme_4 und _2 (51 / 50 dB), aschenwacht_stimme_3 (46 dB). Panzer- und Schreiter-Originale: Ob Suno dort schon einen Funk- bzw. Maschinenklang eingebaut hat, habe ich nicht gehört (nur gemessen) – bitte beim Anhören prüfen. Der Bordfunk- bzw. Maschinenfilter kommt im Spiel ohnehin erst danach dazu.
