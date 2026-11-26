# Stimmen-Plan V1b/V1c (Punkte 109/110, 2026-11-26) – nur Plan und Texte, nichts gebaut

**V1c (21:10):**
- Spalte `filter` dazu.
- Helden (Rote Faust K5 Bill, Eiserner Kürassier A5 Liam, Filter `helm`) als 56 neue Zeilen **angehängt**.
- Eiserne Hünen bleiben Maschine.
- Löwenoger nur Brüllen.
- Die ersten 552 Zeilen sind unverändert (ids, Reihenfolge, Texte; der Berater erzeugt sie schon).

Stand nach Enricos Hörprobe 3/4 (20:55). Ersetzt die erste Fassung V1 (3 Sprecher, alles Deutsch).

**Entscheidungen:**
- **Alle alten Sprüche werden ersetzt** (Suno-Sprüche `sv_*`, frühere ElevenLabs-Rufe `panik_*`, `sterben_*`, `ruf_feuer`, Schmerz/Sanitäter-Rufe). Keine Mischung alt/neu.
- **Konkordat spricht Englisch** (auch die Blaue Legion, sie nutzt die Konkordat-Stimmen), **Aschenwacht Deutsch**.
- **5 feste Sprecher je Seite**, zugeordnet über die K1-Kategorien.
- **Sprechweise:** tief, rau, abgehackt, wenig Gefühl (Richtung StarCraft 2 / Command & Conquer / Dawn of War 1), nicht „gespielt“. Gerufen wird nur in Not.
- **Filter „Schlachtfunk“** für alle Einheiten beider Seiten (Abschnitt 5).

**Texte:** `entwurf/stimmen_texte.csv`:
- 608 Zeilen (552 + 56 Helden), Semikolon, UTF-8.
- Spalten `id; fraktion; sprecher; anlass; einheit; ton; filter; text`.
- `ton` = `ruhig` oder `ruf`.
- `filter` = `funk` (Standard), `bordfunk` (Panzer/Kolosse), `maschine` (Schreiter, Hünen), `helm` (Helden).
- Erzeugt mit `python tools/stimmen_plan.py` (mit `--md` druckt das Skript die Tabellen unten). Texte nur dort ändern, nicht in der CSV.

## 1. Sprecher

| Sprecher | Gruppe (K1-Kategorie) | Konkordat (EN) | Aschenwacht (DE) |
|---|---|---|---|
| 1 | Linie (Rückgrat) | **K1 Brian** | **A1 Charlie** |
| 2 | Unterstützung: MG, Artillerie, Mörser, Pioniere, Sanitäter, Versorgung, Beobachter, Ballon, Fachtrupps | **K2 Daniel** | **A2 Callum** |
| 3 | Sturm/Elite: Grabenräumer, Sturmbrecher, Schwere Grabenwacht, Hünen, Panzerknechte (Oger) | **K3 Callum** | **A3 Bill, schroff** |
| 4 | Reiter: Stahlreiter, Sprenglanzen-Reiter | **K4 George** | **A4 Will** |
| 5 | Anführer + Panzer: Hauptmann, General, Bannerträger; Landkoloss, Sturmpanzer, Bohrkoloss (Bordfunk) | **K5 Bill** | **A5 Liam** |

### Einheit → Sprecher

| Fraktion | Sprecher | Einheiten (TYPES-Schlüssel) |
|---|---|---|
| Konkordat | K1 Brian | `kohorte` |
| Konkordat | K2 Daniel | `melder`, `fernsprech`, `feldscher`, `pionier`, `scharf`, `mahlwerk`, `moerser`, `flammen`, `mineur`, `werkstatt`, `feldkanone`, `haubitze`, `ballon` |
| Konkordat | K3 Callum | `raeumer` (der Löwenoger `oger` brüllt nur, keine Zeilen) |
| Konkordat | K4 George | `reiter` |
| Konkordat | K5 Bill | `hauptA`, `generalA`, `koloss` (Bordfunk), `turm`, `orden`, `kreuz` (Schreiter, Maschinenfilter) |
| Aschenwacht | A1 Charlie | `grenadier` |
| Aschenwacht | A2 Callum | `signal`, `heiler`, `pionierD`, `buechse`, `sense`, `minenwerfer`, `brand`, `gasschutz`, `munition`, `pirsch`, `geschuetz` |
| Aschenwacht | A3 Bill (schroff) | `sturm`, `schwer`, `huenen`, `panzerk` |
| Aschenwacht | A4 Will | `lanzeD` |
| Aschenwacht | A5 Liam | `hauptD`, `generalD`, `banner`, `sturmpz` (Bordfunk), `bohrer` (Bordfunk), `knecht`, `saeger`, `klaue` (Schreiter, Maschinenfilter) |

**Bannerträger** (`banner`) spricht mit Sprecher 5, wie Enrico es in der Tabelle vorgesehen hat. Seine Rufe stehen in der Gruppe Anführer, dazu „Banner hoch!“.

**Eiserne Hünen (V1c):** Sie sprechen die Sturm-Zeilen von A3 Bill, bekommen im Spiel aber den **Maschinenfilter** (wie heute `_mr`, darüber leichter Schlachtfunk). Weil die Sturm-Zeilen (`A_sturm_*`) auch Sturmbrecher, Grabenwacht und Panzerknechte nutzen, stehen sie in der CSV auf `funk`. Den Maschinenfilter setzt V3 je Einheit; die Hünen-Erscheinen-Zeilen stehen schon auf `maschine`. Ihr „Dauerfeuer!“ ist `A_sturm_dauerfeuer_*`.

### Helden und Schreiter (V1c: beschlossen)

- **Helden** (`HELD_ST`, heute `hst_faust_*`, `hst_kuerass_*`):
  - Rote Faust = K5 Bill (Englisch), Eiserner Kürassier = A5 Liam (Deutsch), Filter `helm`.
  - Ids `K_held_faust_<anlass>_<n>` / `A_held_kuerass_<anlass>_<n>`.
  - Anlässe wie heute: auswahl, bewegen, angriff, spezial (Durchbruch bzw. Hinrichtung), getroffen, gegner_erledigt, schwer_verwundet (ruf), tod, dazu erscheinen 2.
- **Schreiter** (`SST`, heute `sst_*` für beide Seiten gleich):
  - Kreuz-, Turm- und Ordensschreiter = K5 Bill, Eisenknecht, Säge- und Klauenschreiter = A5 Liam, Filter `maschine`.
  - Die Zeilen gab es schon in V1b (`K_schreiter_*`, `A_schreiter_*`). Zuordnung zu den heutigen Plätzen: anwahl → `sst_auswahl`, befehl → `sst_bewegen`, angriff, nahkampf, getroffen, schwer → `sst_schwer_beschaedigt`, feind → `sst_feind_gesichtet`, tod → `sst_zerstoert`.

## 2. Anlässe – heute und neu

| Anlass (`anlass`) | heute | Abspielstelle in ui.js | `ton` | Gruppen |
|---|---|---|---|---|
| anwahl | Sprüche `sv_*` (Suno) | ja (`selectVoice`) | ruhig | alle |
| befehl (Ziehen/Befehl bestätigt) | stumm | teils (`ruf('vorruecken')`) | ruhig | alle |
| angriff | Kampfschrei `cry`, `ruf_feuer` | ja (`feuer`, `sturm`) | ruhig | alle |
| rueckzug | stumm | ja | **ruf** | alle |
| panik | `panik_*` (alt) | ja | **ruf** | alle |
| verwundet (Sanitäter, Hilfe) | `medic`/Stöhnen | ja (`sanitaeter`) | **ruf** | alle |
| sammeln | stumm | ja | ruhig | alle |
| tod (aufgerieben) | `sterben_*` (alt) | ja | ruhig (verlöschend „…“) | alle |
| erscheinen (Nachschub, Aufstellung) | keiner | **neu** (Ereignis `buy`, Ende der Aufstellung) | ruhig | je Einheit 2 |
| niedergehalten (unter Beschuss) | stumm | ja | **ruf** | Linie, Unterstützung |
| gas | Husten | ja | **ruf** | Linie, Unterstützung |
| koloss (Feindgerät, Entsetzen) | stumm | ja | **ruf** | Linie |
| granate | stumm | ja | ruhig | Linie, Sturm |
| feuerbereit, feuer | stumm | ja | ruhig | Linie, Unterstützung |
| zielfeld (genommen) | stumm | neu (`ctrlSync`) | ruhig | Linie, Sturm (Konkordat) |
| schilde, gegenstoss, dauerfeuer | stumm | neu (Ereignisse `shields`, `counterstrike`, `dauerfeuer`) | ruhig | Sturm |
| getroffen, panne | Motor/Krach | neu | **ruf** | Panzer |
| befehl_sammeln, befehl_feuerfrei / befehl_sturm, grossbefehl, banner | `stand`/`forward`/Brüllen `roar` | ja (Befehls-Ereignisse) | ruhig | Anführer |
| nahkampf, schwer, feind | `sst_*` (beide Seiten gleich) | ja (`schreiterRuf`) | ruhig | Schreiter |

**Ruf-Anlässe** (`ton = ruf`): Rückzug, Panik, verwundet/Sanitäter, niedergehalten (unter Beschuss), Gas, Koloss, Panzer getroffen/Panne. Alles andere ruhig, tief, abgehackt.

## 3. Umfang je Sprecher (für die Kosten auf fal, ca. 0,10 $ je 1000 Zeichen)

| Sprecher | Stimme | Zeilen | davon ruf | Zeichen |
|---|---|---|---|---|
| K1 | Brian | 50 | 18 | 602 |
| K2 | Daniel | 62 | 15 | 979 |
| K3 | Callum | 35 | 9 | 477 |
| K4 | George | 26 | 9 | 339 |
| K5 | Bill | 99 | 27 | 1437 |
| A1 | Charlie | 49 | 18 | 636 |
| A2 | Callum | 58 | 15 | 889 |
| A3 | Bill (schroff) | 41 | 9 | 606 |
| A4 | Will | 26 | 9 | 355 |
| A5 | Liam | 106 | 27 | 1510 |
| **gesamt** | | **552** | **156** | **7830** |

Dazu V1c, nur Helden (angehängt):

| Sprecher | Zeilen | davon ruf | Zeichen |
|---|---|---|---|
| K5 Bill (Rote Faust) | 28 | 3 | ≈ 357 |
| A5 Liam (Kürassier) | 28 | 3 | ≈ 327 |
| **neu gesamt** | **56** | **6** | **684** |

Zusammen 608 Zeilen und 8514 Zeichen, also **etwa 0,85 $** für einen Durchgang. Mit Nachgenerierungen eher 1,50–2,50 $.

## 4. Beispiele (vollständig in der CSV)

| Anlass | Konkordat (EN) | Aschenwacht (DE) |
|---|---|---|
| anwahl (Linie) | „Ready.“ · „Sir?“ · „Standing by.“ · „Orders?“ | „Bereit.“ · „Hier.“ · „Befehl?“ · „Gruppe hört.“ |
| befehl (Unterstützung) | „Moving the kit.“ · „Relocating.“ | „Verlegen.“ · „Stellungswechsel.“ |
| angriff (Sturm) | „Into the trench!“ · „Shields, push!“ | „Zum Sturm!“ · „Brecht sie!“ |
| rueckzug (Reiter), ruf | „Wheel away!“ · „Break off!“ | „Abschwenken!“ · „Wenden, zurück!“ |
| grossbefehl | „Not one step back!“ · „This line holds!“ | „Alle Mann – Angriff!“ · „Ganze Linie vor!“ |
| erscheinen | „Steel riders, reporting!“ · „Squadron under steam.“ | „Sturmbrecher, zur Stelle!“ · „Stoßtrupp bereit.“ |

Ton: sachlich, keine Verherrlichung. Keine echten Länder-, Orts- oder Truppennamen; „For the Crown!“ ist als einziger Pathos-Ruf drin (Enrico: ok).

## 5. Filter „Schlachtfunk“ (wird in V3 gebaut)

- **Ersetzt:** die leichte Funk-Gasmaske und die Stimmfilter `_gm/_gs/_bf/_mr` (tools/stimmfilter.py); Rückweg-Schalter.
- **Gilt für:** alle Einheiten beider Seiten.
- **Kette** nach der Hörprobe des Beraters (WebAudio-Vorlage, in V3 in Python nachbauen):
  1. Tonhöhe ×0,86 (tiefer und langsamer)
  2. Hochpass 260 Hz
  3. Low-Shelf 300 Hz +4 dB
  4. Glocke 1100 Hz, Q 1,4, +7 dB
  5. Sättigung tanh, k = 5,5
  6. Tiefpass 2900 Hz
  7. Kompressor −28 dB, 8:1, Attack 3 ms, Release 120 ms
  8. Kammfilter: Verzögerung 6 ms, Rückkopplung 0,45, Anteil 0,5 (metallischer Klang)
  9. Funkrauschen (Bandpass 2200 Hz, leise) über die ganze Länge, dazu ein kurzer Rauschklick (60 ms) am Anfang
- **Panzer/Kolosse (Bordfunk):** etwas mehr Rauschen.
- **Schreiter:** Schlachtfunk und danach der Maschinenfilter `roboter`.
- **Helden:** Helm-Filter, dann Schlachtfunk (Vorschlag).

## 6. V2 und V3

- **V2 (Berater, fal.ai Eleven v3):**
  - Roh erzeugen, ohne Filter.
  - Ablage `sound-quelle/Voices/eigene/el/<konkordat|aschenwacht>/<id>.mp3`, `id` wie in der CSV.
  - `ton = ruf` → Schrei-Hinweis setzen; `ruhig` → tief, abgehackt, wie über Funk.
- **V3 (CC):**
  - Schlachtfunk-Filter in stimmfilter.py/sound_bau.
  - Neue Tonplätze `ruf_<anlass>_<gruppe>_<A|D>` (Pools mit den Fassungen); Sprecher je Einheit über die Tabelle in Abschnitt 1.
  - Neue Abspielstellen: erscheinen, zielfeld, schilde, gegenstoss, dauerfeuer, Panzer getroffen/Panne.
  - Alte Plätze (`sv_*`, `panik_*`, `sterben_*` …) aus dem Spiel nehmen; die Dateien bleiben liegen.
  - Danach `slotsVon`, Pult-Bibliothek (`HOER`), Ton-Spur, Hörprobe vorher/nachher in `tonprobe.html`.
