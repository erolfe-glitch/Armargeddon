# Gelände-Paket G – Probe G1 und Plan (Stand 2026-11-25)

**G1 = nur Probe und Plan.** Die Probe-Schalter sind im Code, aber nur über `window.GB_PROBE` aktiv (`__dbg.gbProbe({...})`); ohne den Schalter sieht das Spiel aus wie vorher. Bilder: `entwurf/probe/gelaende_g1/`, Werkzeug `node tools/gelaende_probe.mjs` (Einheiten ausgeblendet, nah + ganze Karte, je Variante frisch geladen).

## 1. Gräben Grauwall (Punkt 56)

### Warum sie heute wie Schlangen wirken
- Die Mittellinie ist ein **Dreiecks-Zickzack** (Ausschlag 0,3 R, alle 0,87 R), der danach **geglättet** wird (`chaikin`). So entstehen weiche Wellen.
- Sohle 1,3 R breit, an beiden Kanten **dasselbe** Wandstück als Kachelstreifen. Auf der Feindseite steht nur an den in die Tiefe laufenden Stücken zusätzlich eine Sandsackreihe.
- Verlauf: Die Gräben folgen den Rasterketten der Grabenfelder (Spalten 2, 7, 10), deshalb sind es drei Parallelen.

### Probe-Varianten (`vergleich_graeben_nah.jpg`, `vergleich_graeben_ganz.jpg`)

| Variante | Schalter | Ergebnis |
|---|---|---|
| vorher | – | gewellte Bänder |
| **V1 Feuerbuchten + Querwände** | `grabenForm: 'buchten'` | Mittellinie als **Rechteck-Welle**: abwechselnd Feuerbucht (0,6 R zur Feindseite vorgezogen, 0,85–1,15 R lang) und Durchgang hinter einer Querwand (0,45–0,6 R), Ecken ungeglättet, Sohle schmaler (0,85 R). Der Graben ist **eckig und gebrochen**, die Querwände stehen als Erd-/Sandsackblöcke quer. |
| **V2** | + `grabenRueckwall`, `grabenPfuetzen` | dazu ein niedriger Erdwall auf der Rückseite (flach gemalt) und Schlammpfützen auf der Sohle |
| **V3** | + Raster geändert (Verbindungsgraben Spalte 7→10 in Zeile 5, Sappe bei (3,1), Graben 10 endet vor dem Rand) | **Zeigt eine Grenze:** Rasterketten verbinden versetzte Hexfelder diagonal, der Verbindungsgraben wird zum „X“. |

### Was die Probe zeigt
- **Die Form trägt (V1/V2):** eckig, gebrochen, Feuerbuchten lesbar.
- **Es fehlen die Bilder:** Querwände, Ecken und die Brustwehr nutzen dasselbe Wandstück `graben_kante_vorn`. Das wiederholt sich sichtbar und wirkt an den Ecken wie Stückwerk. Für den Eindruck „echter Schützengraben“ braucht es **eigene gemalte Teile** (Liste in Abschnitt 3).
- **Verbindungsgräben und Sappen nicht über Rasterketten:** Die Linien müssen **ausdrücklich je Karte** angegeben werden. Die Grabenfelder der Regeln werden daraus abgeleitet (jedes Feld, durch das eine Linie läuft), damit Bild und Regel übereinstimmen (wie heute bei Draht: „Bild = Regel“).
- Pfützen und Rückwall sind im Code machbar, wirken aber erst mit besserer Sohle und Kante richtig.

### Plan G2 Gräben
1. **Form:** `buchten` wird Standard für Grauwall (Rechteck-Welle, schmalere Sohle). Längen und Tiefe der Feuerbuchten bekommen Zufall je Graben, damit nichts gleichförmig wirkt.
2. **Verlauf je Karte als Linien:** `MAP.graeben = [{ linie: [[c, r], …], art: 'feuer' | 'lauf' | 'sappe' }]`.
   - `feuer` = mit Buchten;
   - `lauf` = Verbindungsgraben, schmaler, leichtes Zickzack ohne Buchten;
   - `sappe` = kurzer Stich nach vorn, endet in einer kleinen Bucht.
   - Daraus werden die Grabenfelder (Regeln), die Wege und die Bilder.
   - Für Grauwall: 2 Laufgräben je Seite zwischen den Linien, 1–2 Sappen, eine Linie endet bzw. teilt sich.
   - Danach **Balance messen**: Grauwall, 4 Startwerte gemittelt, Ziel etwa 50 %, nicht unter ±7 Punkten feilen.
3. **Teile an Buchten und Querwänden** (neu gemalt, Abschnitt 3):
   - Querwand-Block als aufrechtes Teil an jedem Knick;
   - Brustwehr mit Sandsäcken durchgehend auf der Feindseite;
   - niedriger Erdwall auf der Rückseite;
   - in manchen Buchten/Querwänden: Leiter, Unterstand-Eingang, Stahlschild, Stützbalken, Kiste/Kanister, eingestürzte Stelle, Drahtrolle am Rand; nach Zufall, aber nie zwei gleiche nebeneinander.
4. **Sohle:** Lattenrost in Stücken statt durchgehend, dazwischen Schlamm und Pfützen.
5. **10 Grabenplätze (U2):** GBau gibt je Grabenfeld die **Feuerbuchten** zurück (Mitte, Richtung, Länge). Die Figuren stehen auf der Schützenstufe in den Buchten, 2–3 je Bucht, und füllen bei Bedarf die Durchgänge auf. Das ersetzt die vorläufige Verteilung aus U1 (`grabenPunkt`).
6. **Sankt Ruß** nutzt dieselben Grabenteile; dort die Form später anpassen (eigener Schritt, nach Grauwall).

## 2. Felder Krähenfurt (Punkt 57)

### Warum sie heute künstlich wirken
Eine gekachelte Furchen-Textur (`boden_acker_schnee`), gleichmäßig gedreht, unter einer weichen Maske, 62 % Deckkraft. Das ergibt gleichmäßige graue Streifen ohne Erde und ohne Relief.

### Probe-Varianten (`vergleich_acker_nah.jpg`, `vergleich_acker_ganz.jpg`)
- **Acker A** (`ackerNeu: true`):
  - Furchen im Code gezeichnet: je Furche eine dunkle **Erdrinne** und darüber ein heller **Schneekamm** (Relief, Licht von oben).
  - Fast parallel, aber Abstand, Breite, Helligkeit, leichte Krümmung und Lücken unregelmäßig; Erdkrümel.
  - Leichter Erdton unter dem ganzen Feld.
  - **Feldrain** als weiche Schneewehe statt ausgefranstem Rand.
- **Acker B:** wie A, kräftiger und breiter (mehr Erde sichtbar).
- **Ergebnis:** A liest sich als „gepflügter Acker unter Schnee“, B wirkt eher wie aufgetauter Boden. **Empfehlung: A.** Eine gemalte Fassung (Abschnitt 3) wäre noch schöner. Der Code-Weg hat aber keine Kachelkanten und folgt jeder Feldform.

### Plan G3 Felder
1. Acker A als Standard für Krähenfurt (Schalter `ACKER_ALT` bleibt).
2. Furchenrichtung **je zusammenhängendem Acker** eigen (heute eine Richtung für alle), höchstens ±25°.
3. **Mehr Leben:**
   - am Rand: Koppelzaun (gibt es schon, `zaun_schnee`), dazu **Hecke**;
   - im Acker oder am Rand: **Heuhaufen/Strohmieten**, **Vogelscheuche**, **liegengebliebener Pflug**, ein **Feldweg** mit Wagenspuren zwischen zwei Äckern (Spuren gibt es schon: `spurSchnee`, Räder).
   - Alles als `deko` je Feld oder aufrechtes Teil.
4. **Regeln:** nur wenn Hecke/Heuhaufen Deckung geben sollen (Vorschlag: Hecke wie Garten ×1,2 gegen Beschuss, Heuhaufen keine Deckung), dann Krähenfurt messen (4 Startwerte).

## 3. Bausteine, die neu gemalt werden müssen (für den Berater)

Machart wie `ui-quelle/gelaende/`: Magenta-Hintergrund, Ansicht schräg von vorn oben (wie die vorhandenen Grabenteile), **keine gemalten Schatten am Boden**, Licht von links oben, Tuschekonturen. Größen in Soldatenhöhen (SH, 1 SH = Soldat im alten Maßstab; im neuen Maßstab E1 ist ein Soldat 0,65 SH hoch).

| # | Name (Vorschlag) | Inhalt | Größe | Hinweise |
|---|---|---|---|---|
| G-1 | `graben_querwand` | Querwand (Traverse): Erdblock mit Sandsack-Krone und Holzverschalung, von vorn gesehen; 3 Varianten | etwa 1,2 R breit, 0,5 SH hoch | steht quer im Graben an jedem Knick; links/rechts nicht spiegeln (Licht) |
| G-2 | `graben_brustwehr` | Brustwehr Feindseite: aufgeworfene Erde mit Sandsackreihe, nahtlos kachelbar als Streifen | Streifen, 0,4 SH hoch | ersetzt die heute wiederverwendete Kante als Sandsackreihe |
| G-3 | `graben_rueckwall` | niedriger Erdwall der Rückseite, nahtlos kachelbar | Streifen, 0,2 SH | flacher, dunkler als G-2 |
| G-4 | `graben_ecke_innen` / `_aussen` | Eckstücke der Grabenwand (90°), je 2 Varianten | 0,3 SH hoch | gegen das Stückwerk an den Ecken |
| G-5 | `graben_sohle_rost` | Lattenrost in kurzen Stücken (3–4 Varianten), dazwischen Schlamm | flach, 0,8 R lang | einzeln gestreut statt Endlosband |
| G-6 | `graben_pfuetze` | Schlammpfützen auf der Sohle, 3 Varianten | flach, 0,3–0,5 R | ersetzt die gezeichneten Ellipsen |
| G-7 | `graben_leiter` | Holzleiter an der Wand (Sturmleiter), 2 Varianten | 0,45 SH | in Feuerbuchten |
| G-8 | `graben_unterstand` | Unterstand-Eingang: Balkenrahmen mit Plane, in die Wand gesetzt | 0,5 SH, 0,6 R breit | auf der Rückseite einer Querwand |
| G-9 | `graben_stahlschild` | Schießscharte/Stahlschild auf der Brustwehr | 0,25 SH | 2 Varianten |
| G-10 | `graben_kram` | Kisten, Kanister, Stützbalken, Drahtrolle, eingestürzte Stelle (Erde in den Graben gerutscht) | je 0,15–0,35 SH | 6–8 Einzelteile auf einem Bogen |
| F-1 | `acker_schnee_neu` (optional) | Acker unter Schnee: dunkle Erde in den Furchen, Schnee auf den Kämmen, nahtlos kachelbar, 2 Varianten | Kachel ≈ 3 R | nur falls der Code-Acker nicht reicht |
| F-2 | `feldrain_schnee` | Schneewehe/Feldrain als Randstreifen, nahtlos | Streifen | weicher Übergang Acker → Schnee |
| F-3 | `hecke_schnee` | Hecke mit Schnee, kachelbar als Streifen, 2 Varianten | 0,6 SH | Feldrand |
| F-4 | `heuhaufen_schnee` | Heuhaufen/Strohmiete mit Schneehaube, 3 Varianten | 0,6–0,8 SH | im Acker |
| F-5 | `vogelscheuche_schnee` | Vogelscheuche (zerlumpt, finster, kein Kitsch) | 1,1 SH | einmal je Karte |
| F-6 | `pflug_schnee` | liegengebliebener Pflug, halb im Schnee | 0,4 SH | am Feldrand |

**Reihenfolge für den Berater:** zuerst G-1, G-2, G-4 (Form und Brustwehr), dann G-5–G-10 (Abwechslung), dann F-3–F-6. F-1/F-2 nur, wenn Enrico der Code-Acker nicht reicht.

## 4. Aufwand und Reihenfolge
- **G2 Gräben:**
  - Form und Linien je Karte (`MAP.graeben`): M.
  - Teile einbauen, sobald die Bilder da sind: M.
  - Balance Grauwall: S–M.
  - Zusammen etwa ein Paket, eventuell zwei.
- **G3 Felder:** Acker A Standard und Richtung je Acker: S. Deko-Teile, sobald gemalt: S–M. Balance nur bei Deckung: S.
- **Danach U2:** 10 Grabenplätze an den Feuerbuchten.

## 5. Fragen an Enrico
1. **Gräben:** Geht die Richtung V2 (eckig mit Feuerbuchten und Querwänden) – mit gemalten Teilen statt der wiederholten Kante?
2. **Verlauf:** Laufgräben und Sappen als eigene Linien je Karte (statt über Grabenfelder) – einverstanden? Dafür ändert sich das Raster von Grauwall, und ich messe die Balance neu.
3. **Acker:** A (Empfehlung) oder B?
4. **Deckung:** Soll die Hecke Deckung geben (Vorschlag ×1,2 wie Garten)? Heuhaufen keine?
5. Soll der Berater F-1 (gemalter Acker) überhaupt machen, oder reicht der Code-Acker?

## 6. Stand G2a + G3a (2026-11-25, ohne neue Bilder)
- **Gräben Grauwall:**
  - Form `buchten` als Standard (Feuerbuchten/Querwände, Rückwall, Pfützen; Längen und Tiefen mit Zufall).
  - Gräben als Linien in `MAP.graeben` (engine.js, Grauwall); die Grabenfelder werden daraus abgeleitet.
  - GBau gibt `buchtenJeFeld` zurück (Mitte, Richtung, Länge je Feuerbucht, `__dbg.buchten()`), die Grundlage für U2.
  - Rückweg: `GRAEBEN_ALT=1` bzw. `window.GRAEBEN_ALT`.
- **Linien Grauwall (abgeglichen):**
  - Feuergräben Spalte 2, 7 und 10; **Graben 10 endet im Norden** (beginnt bei Zeile 1).
  - Laufgräben: Konkordat aus dem Hinterland (Zeilen 3 und 7), Aschenwacht zwischen den Linien (Zeilen 2 und 6).
  - Sappe der Aschenwacht (7,8)→(6,8).
  - Messung: Konkordat 48,0 % (4 × 200; vorher 46,5 %).
  - Wie empfindlich das ist (je 4 × 100):

    | Graben 10 / Sappen | Konkordat |
    |---|---|
    | endet im Süden | 23 % |
    | durchgehend | 39 % |
    | endet im Norden, mit Konkordat-Sappe | 63 % |
    | endet im Norden, ohne Konkordat-Sappe | 47 % |

- **Felder Krähenfurt:**
  - Acker A als Standard, Furchenrichtung je zusammenhängendem Acker (±25°).
  - Hecken an etwa 40 % der Ackerränder (Ersatzbild Unterholz bis `hecke_schnee_*`); die Deckung kommt über die Feldart Garten (×1,2 gegen Beschuss), also keine Regeländerung.
  - Heuhaufen, Vogelscheuche und Pflug erscheinen, sobald die Bilder in `GELAENDE` sind.
  - Rückweg: `window.ACKER_C2` (Acker vom 24.11.).
  - Messung unverändert: 59 % (4 × 200, wie der eingefrorene alte Stand).
- **Offen:** die gemalten Teile G-1…G-10 und F-3…F-6 einbauen, sobald sie geliefert sind; danach U2 (10 Grabenplätze an den Feuerbuchten).
