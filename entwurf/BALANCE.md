# Gleichgewicht (Fahrplan Punkt 5) – 2026-11-17

Gemessen mit `node tools/sim.js` (KI gegen KI, Standardarmeen, Siegpunkt-Modus). Zufallsrauschen: bei 200 Schlachten etwa ±4 Punkte, bei 100 etwa ±5–6 – Entscheidungen deshalb mit 200 Schlachten und zwei Startwerten (1 und 5000).

**Auftrag (während der Arbeit geändert):** Ausgeglichen werden nur Einheiten (Kosten und Werte, gilt für alle Karten) und der Grauwall (Ziel 45–55 %). Die übrigen 8 Karten sind alt und werden neu gebaut; sie wurden nur am Ende zur Info gemessen. **An ihnen wurde nichts geändert.** Armee-Varianten liefen dort nur als Test über Umgebungsvariablen, nichts davon ist im Spiel.

## Änderungen

### 1. Anführer zäher (Werte)
- **Was:** Abwehr General 3 → 5, Hauptmann 3 → 4 (beide Seiten gleich).
- **Warum:**
  - Der Aschenwacht-General fiel in 51 % der Schlachten.
  - Mit ihm fielen Befehle, „Sammeln“ und der große Befehl aus; das Konkordat gewann dadurch zu oft.
  - Die Befehle selbst sind seit Paket 8 begrenzt (1 Feld, 3 je Anführer). Der Sprung „24 % → 58 %“ beim Einführen kam vor allem vom General, der früh fiel, nicht von zu starken Befehlen.
- **Messwert Grauwall, 200 Schlachten:**
  - Siegquote Konkordat: 59 % / 62 % (zwei Startwerte) → 51 % / 49 %.
  - Verluste General Aschenwacht: 51 % → 4–7 %.
- **Verworfen:**
  - Landkoloss/Sturmpanzer Abwehr 7 → 8: Siegquote 50 → 58 %, aber Koloss-Verluste nur 88 → 85 %.
  - Aschenwacht-Zusammenbruch später (BREAK_D 0,7): bewirkte nichts.

### 2. Gas wird genutzt (KI, ai.js `planArt`)
- **Was:**
  - Gas hat jetzt einen Wert je ungeschütztem Gegner in der Wolke (Wolke = 3 Felder mit dem Wind).
  - Gegner in Deckung zählen mehr: Gas fragt nicht nach Deckung, Sprenggranaten schon. Gegen MG gibt es etwas mehr.
  - Eigene Truppen in der Wolke kosten viel, eigene daneben (Drift) etwas.
  - Gas wird genommen, sobald mindestens ein Gegner drin ist und der Wert hoch genug ist.
  - Vorher: nur bei mindestens 2 Gegnern in der Wolke und keinem eigenen Trupp bis 2 Felder um das Ziel. Das kam fast nie vor.
- **Messwert Grauwall:** Gas je Schlacht 0,24 / 0,17 → 1,1 / 1,75 (Konkordat / Aschenwacht). Siegquote unverändert im Ziel (51 % / 47 %).

### 3. Kostenprüfung (tools/costcheck.js) neu gemacht
- **Was:**
  - Die Probe-Einheiten werden jetzt *nach* der unveränderten Standardarmee aufgestellt (`EXTRA_A`/`EXTRA_D` in sim.js), und zwar je Schlacht auf ein zufälliges freies Feld der Startzone.
  - Neue Schalter: `PAR=n` (n Simulationen gleichzeitig), `SEED`.
- **Warum:**
  - Vorher stand die zusätzliche Einheit in der Armeeliste, und `deploy` verteilt die Typen abwechselnd. Jede Einheit mehr verschob also die ganze Aufstellung.
  - Weil die Aufstellung in allen Schlachten gleich ist, verfälschte das jeden Vergleich um 20–40 Punkte. Beispiel: +2 Grenadiere 66 %, +3 Grenadiere 39 %, +5 Grenadiere 83 %.
  - Jetzt steigt es gleichmäßig: +1 Kohorte +19, +2 Kohorten +38.
- **Wichtiger Befund:**
  - Für das Konkordat zählt jede zusätzliche Infanterie sehr viel: Die Siegpunkte entscheiden sich daran, ob genug Trupps die Gräben halten.
  - Für die Aschenwacht bringen zusätzliche Grenadiere wenig (+3 für 30 Punkte); dort entscheiden Sturm und Fahrzeuge.
  - Die alte Regel „eine Einheit mehr oder weniger verschiebt die Quote um 20–40 Punkte“ ist also beim Konkordat echt. Bei den bisherigen Kostenprüfungen kam sie aber zum großen Teil von der Aufstellung.

### 4. Kosten an den gemessenen Wert angeglichen (engine.js ABIL/ADJ)

**Messung:** costcheck ADD=80, 200 Schlachten je Probe, Kampfmaschinen erlaubt, Grauwall.
- Ohne Zusatz gewinnt das Konkordat 50 %.
- „Differenz“ = Siegquote mit etwa 80 Punkten dieses Typs minus Siegquote mit gleich viel Grundinfanterie (Kohorte bzw. Grenadiere).
- Rauschen ±5. Geändert wurde nur bei deutlicher Abweichung und höchstens um etwa 10 Punkte je Einheit, damit Spezialisten für Spieler nicht zu billig werden. Die KI nutzt viele Fähigkeiten schwächer als ein Mensch.

| Einheit | Differenz | Kosten vorher → nachher | Änderung |
|---|---|---|---|
| **Aschenwacht, zu billig** | | | |
| Sturmbrecher | +26 | 90 → 100 | Abgleich 30 → 40 |
| Sturmpanzer | +23 | 80 → 90 | Abgleich +10 |
| Eingreiftrupp | +17 | 90 → 100 | Abgleich +10 |
| Klauenschreiter (Kampfmaschine) | +27 | 80 → 95 | Abgleich +15 |
| Sägeschreiter (Kampfmaschine) | +22 | 85 → 95 | Abgleich +10 |
| Bohrkoloss (Kampfmaschine) | +22 (Vergleich: 150 Punkte Grenadiere +9) | 140 → 150 | Abgleich 60 → 70 |
| Eisenknecht (Kampfmaschine) | +15 (dto.) | 140 → 150 | Abgleich 50 → 60 |
| **Aschenwacht, zu teuer** | | | |
| Signaltrupp | −16 | 25 → 20 | Ziel markieren 15 → 10 |
| Gasschutz-Trupp | −10 | 40 → 35 | Abgleich −5 |
| Drahtpioniere | −8 | 55 → 45 | Fähigkeiten 30 → 20 (Auftrag: Pioniere prüfen) |
| Hauptmann | −7 | 50 → 45 | Befehle 15 → 10 (nur noch 3 Befehle, alle 2 Runden) |
| General | – (Pflicht, nicht prüfbar) | 85 → 70 | „Befehle jede Runde 50“ war veraltet → „Befehle (3), großer Befehl 35“ |
| **Konkordat, zu teuer** | | | |
| Graben-Pioniere | 0 gegenüber 1 Kohorte (40) bei 55 Punkten | 55 → 45 | Haftladung/Bergen 20 → 15, Abgleich +5 entfällt |
| Hauptmann | −31 | 50 → 45 | wie oben |
| General | (zweiter General nicht sinnvoll prüfbar) | 85 → 70 | wie oben |
| Melder mit Hund | −37 | 25 → 20 | Abgleich −5 |
| Fernsprechtrupp | −31 | 25 → 20 | Feuerschlag 15 → 10 |
| Ballonbeobachter | −32 | 25 → 20 | 55 → 50 |
| Mineure | −35 | 40 → 30 | Stollen 20 → 10 |
| Grabenmörser | −36 | 30 → 25 | Abgleich −10 → −15 |
| Feldkanone | −32 | 50 → 40 | Abgleich −10 |
| Flammentrupp | −29 | 45 → 40 | Abgleich −5 |
| Versorgungstrupp (Konkordat) | −28 | 45 → 40 | Abgleich −5 (Aschenwacht-Fassung −2: bleibt 45) |
| Feldscher | −23 | 25 → 20 | Abgleich −5 → −10 |
| Donnerrohr-Batterie | −21 | 60 → 55 | Abgleich −5 |
| Schildwall | −18 | 40 → 35 | Abgleich −5 |
| Mahlwerk-Trupp | −16 | 40 → 35 | Abgleich −5 |
| Scharfschütze | −16 | 50 → 45 | Abgleich 10 → 5 |
| Rauchwerfer | −53 | 30 → 25 | Abgleich −5 (siehe Meldung unten) |

**Unverändert, weil im Rahmen (±10):**

| Seite | Einheiten |
|---|---|
| Konkordat | Landkoloss (−9), Turm-, Kreuz-, Ordensschreiter (−5 bis −10), Stahlkürass (−4), Grabenräumer (−4), Lanzenreiter (0) |
| Aschenwacht | Sensenwerk, Brandwerfer, Panzerbüchse, Schwere Grabenwacht, Pirschjäger, Minenwerfer, Bannerträger, Aschenpfleger, Versorgungstrupp, Geschütz (−2 bis −6), Panzerkürass (+5), Sprenglanzen-Reiter (+8) |

**Kostenformel selbst nicht geändert:**
- Wirksame BP (Reiter und Fahrzeuge mv + 1) und die Zweitwaffen stehen nicht in der Formel. Die Messung zeigt aber, dass Reiter (0) und Kolosse/Schreiter (−5 bis −10) trotzdem passend bepreist sind.
- „Pannen −10“ gleicht die Zweitwaffen ungefähr aus. Eine Formeländerung hätte nur neue Abgleiche nötig gemacht.

**Wirkung auf den Grauwall:** Die Kosten ändern das Budget und den Nachschub der KI.
- Siegquote Konkordat 47 % / 52 % (zwei Startwerte, je 200).
- Budget Grauwall jetzt Konkordat 950, Aschenwacht 675. Es folgt aus den Kosten der Standardarmee; vorher 995 / 695 mit den alten Anführerkosten.

## Ergebnisse

### Grauwall (Ziel 45–55 %)

| | vorher | nachher |
|---|---|---|
| Standardarmeen, 200 Schlachten, Startwert 1 / 5000 | 59 % / 62 % | **47 % / 52 %** |
| Kampfmaschinen erlaubt (Standardarmeen; die KI kauft keine Maschinen nach, deshalb gleich) | 61 % (100) | 47 % / 52 % |
| Konkordat mit Maschinen (Landkoloss, Turmschreiter, Stahlkürass) gegen Standard | – | 47 % |
| Standard gegen Aschenwacht mit Maschinen (Klauenschreiter, Panzerkürass) | – | 37 % |
| beide mit Maschinen | – | 62 % |
| erweiterte Armeen, beide Seiten* | – | 73 % |
| erweitertes Konkordat gegen Standard / Standard gegen erweiterte Aschenwacht | – | 61 % / 42 % |
| Runden Ø | 15,1 | 15,4 |
| Ausfälle Ø Konkordat / Aschenwacht | 36 % / 27 % | 36 % / 28 % |

\* Erweiterte Armeen:
- **Konkordat:** General, Hauptmann, 6 Kohorten, 2 Mahlwerk, 2 Landkolosse, Donnerrohr, Ballon, Fernsprech-, Mineur-, Rauch-, Versorgungstrupp, Stahlkürass, Pioniere, Scharfschütze.
- **Aschenwacht:** General, Hauptmann, 5 Grenadiere, 2 Sensenwerk, Geschütz, Signal-, Drahtpionier-, Munitions-, Gasschutztrupp, Schwere Grabenwacht, Panzerkürass.
- Mit vielen Spezialisten liegt das Konkordat bei 73 %. Erhöht, aber nicht gekippt. Der Panzerkürass der Aschenwacht fällt dabei fast immer (95 %).

### Alte Karten – nur zur Info, nicht ausgeglichen (je 100 Schlachten, Siegquote Konkordat)

| Karte | vorher | nachher |
|---|---|---|
| Selm | 71 % | 76 % |
| Lerne | 96 % | 94 % |
| Varntal | 73 % | 71 % |
| Grauwall-Front | 12 % | 15 % |
| Steinbrücke | 56 % | 48 % |
| Waldfluss | 63 % | 76 % |
| Kasematten | 0 % | 1 % |
| Kanalstadt | 34 % | 26 % |

Für den Neubau dieser Karten:
- Alle Schlachten enden über Siegpunkte, keine über Zusammenbruch.
- Eine Einheit mehr oder weniger in der Kartenarmee verschiebt die Quote stark. Beispiel Kasematten: 11 → 8 Grenadiere ergibt 2 → 57–63 %.

### Verluste je Einheitentyp, Grauwall (200 Schlachten)

| Seite | Einheit | vorher | nachher |
|---|---|---|---|
| Konkordat | Landkoloss | 91 % | 88 % |
| Konkordat | Schützenkohorte | 52 % | 57 % |
| Konkordat | Mahlwerk-Trupp | 13 % | 9 % |
| Konkordat | Graben-Pioniere (Nachschub) | 8 % | 13 % |
| Konkordat | Scharfschütze (Nachschub) | 7 % | 9 % |
| Konkordat | Hauptmann | 9 % | 8 % |
| Konkordat | Grabenmörser (Nachschub) | 7 % | 7 % |
| Konkordat | Feldscher | 6 % | 3 % |
| Konkordat | General | 6 % | 5 % |
| Konkordat | Flammentrupp, Feldkanone, Donnerrohr, Lanzenreiter, Rauchwerfer | 0–14 % | 1–4 % |
| Aschenwacht | Sensenwerk-Trupp | 53 % | 55 % |
| Aschenwacht | Aschengrenadiere | 30 % | 38 % |
| Aschenwacht | Sturmbrecher (Nachschub) | 32 % | 36 % |
| Aschenwacht | Brandwerfer (Nachschub) | 22 % | 23 % |
| Aschenwacht | Hauptmann | 12 % | 8 % |
| Aschenwacht | **General** | **51 %** | **7 %** |
| Aschenwacht | Aschenpfleger | 4 % | 7 % |
| Aschenwacht | Minenwerfer | 7 % | 6 % |
| Aschenwacht | Panzerbüchse, Schwere Grabenwacht, Banner, Sprenglanzen, Geschütz, Sturmpanzer | 0–4 % | 0–4 % |

### Fähigkeiten-Statistik, Grauwall (je Schlacht, Konkordat / Aschenwacht)

| Handlung | vorher | nachher |
|---|---|---|
| Beschuss | 75,9 / 48,3 | 78,6 / 43,4 |
| Nahkampf | 24,5 / 39,7 | 28,4 / 43,0 |
| Sprenggranate | 18,8 / 25,3 | 19,1 / 25,0 |
| **Gas** | **0,24 / 0,17** | **1,11 / 1,75** |
| Artillerie-Sperrfeuer | 0,80 / 0,70 | 0,53 / 0,73 |
| MG-Sperrfeuer | 6,7 / 18,8 | 5,6 / 22,8 |
| Feuerbereitschaft | 2,2 / 5,3 | 1,5 / 8,9 |
| Zweitwaffe (Seiten-MG) | 21,6 / – | 22,8 / – |
| Befehl Feuer frei / Sturmbefehl | 1,8 / 3,0 | 2,8 / 1,3 |
| Befehl Sammeln | 0,58 / 1,59 | 0,77 / 2,70 |
| großer Befehl | 0,40 / 0,82 | 0,62 / 0,98 |
| Eingraben | 4,9 / 4,6 | 5,4 / 4,5 |
| Sanitäter | 0,49 / 1,10 | 0,70 / 1,02 |
| Draht schneiden | 0,45 / 0,27 | 0,43 / 0,21 |
| Haftladung | 0,28 / – | 0,43 / – |
| Nachschub am Rand / an Zielfeld | 3,5 + 2,2 / 4,3 + 2,6 | 4,2 + 2,3 / 3,9 + 3,1 |

Mit erweiterten Armeen (200 Schlachten):

| Fähigkeit | Konkordat | Aschenwacht |
|---|---|---|
| Ziel markieren | 5,6 | 5,6 |
| Feuerschlag | 4,4 | – |
| Rauch | 3,8 | – |
| Stollen | 1,5 | – |
| Minen | – | 3,0 |
| Sturmlauf | 7,6 | 1,9 |
| Versorgen/Nachladen | 1,1 | 2,0 |
| Schilde vor | – | 3,3 |
| Haftladung | 2,4 | – |
| Gas | 0,2 | 1,4 |

Fast nie: Breitseite (der Sturmpanzer kommt in Standardschlachten kaum vor), Bergen, Entgiften, Banner.

## KI-Runde: Fahrzeuge und Spezialisten (2026-11-18)

Nur ai.js; Kosten und Werte unverändert, weil der Grauwall im Ziel bleibt.

### Fahrzeuge (Landkoloss, Sturmpanzer, Bohrkoloss, Schreiter)

**Vorher:**
- Fahrzeuge werteten Bedrohung nur mit 0,2 × dem Gewicht der Infanterie und achteten nicht auf Begleitung.
- Der Koloss fuhr als Spitze allein vor; 70 % seines Schadens kamen von Sturmbrechern im Nahkampf.

**Jetzt** (`fzNahGefahr`, `fzBegleitung` in posValue):
- **Nahkampf-Gefahr:** Erwarteter Nahkampfschaden aller gegnerischen Sturmtruppen, Reiter, Kampfanzüge und Pioniere, die ein Nachbarfeld in ihrer nächsten Runde erreichen (BP + 1). Mit Panzerungs-Faktor (Sturm/Pioniere ×1,5, sonst ×0,4). Jeder eigene Trupp auf einem Nachbarfeld versperrt einen Anmarschweg (−30 %, höchstens −75 %). Gewicht `W_FZ_NAH` 10.
- **Begleitung:** eigene Fußtruppen höchstens 2 Felder entfernt und höchstens 2 Spalten dahinter. Ohne Begleitung kostet ein Feld, das vorwärts geht oder nah am Feind liegt (bis 5 Felder), `W_FZ_BEGL` 4; mit nur einem Trupp 40 % davon.
- Schießen bleibt unverändert attraktiv; bedrohte Fahrzeuge bleiben also auf Abstand und schießen.

**Gewichte gewählt nach 200 Schlachten, zwei Startwerte:**

| W_FZ_NAH / W_FZ_BEGL | Siegquote (Startwert 1 / 5000) | Koloss-Verluste |
|---|---|---|
| 0 / 0 (vorher) | 47 / 52 % | 88–89 % |
| 4 / 1,6 | 47 / 37 % | 67–68 % |
| 7 / 3 | 47 / 46 % | 51–53 % |
| **10 / 4 (gewählt)** | **51 / 46 %** | **44–46 %** |
| 12 / 5 | 45 / 42 % | 37–38 % |

12/5 senkt die Verluste weiter, drückt aber die Siegquote an den Rand. Die Fahrzeuge stehen nicht nur hinten:

| | vorher | nachher |
|---|---|---|
| Zweitwaffe des Kolosses je Schlacht | 22,8 | 29,3 |
| Beschuss Konkordat je Schlacht | 78,6 | 82,0 |
| Südgraben beim Konkordat | 60 % | 82 % |
| Nordgraben beim Konkordat | 82 % | 65 % |

### Spezialisten

- **Rauchwerfer:**
  - Die Nebelwand wird gewertet nach den Sichtlinien gegnerischer Schützen auf eigene Truppen, die sie unterbricht (MG ×1, sonst ×0,4; vorrückende Trupps ×1,3).
  - Abzug für Sichtlinien eigener Schützen auf Gegner, die sie ebenfalls unterbricht.
  - Der Trupp steht jetzt hinten wie Sanitäter und Beobachter (Reichweite 3 genügt). Vorher lief er mit der Infanterie vor und fiel (Verluste 17–52 % → 1–2 %).
  - Rauch kommt jetzt seltener (4,3 → 1,3 je Schlacht), dafür gezielter.
- **Mineure:**
  - Stollen gezielt unter Verteidiger in Graben, Bunker oder auf Zielfeldern, mehr bei MG und Geschützen.
  - Mehr Wert, wenn eigene Angreifer 2–5 Felder entfernt sind; der Stollen fliegt 2 Runden später, also rechtzeitig vor dem Sturm.
  - Die Mineure ziehen bis auf 1–2 Felder an solche Ziele heran.
  - Stollen je Schlacht 0,9 → 1,3.
- **Meldegänger:**
  - +2 BP weiterhin im zweiten Durchgang, also an Einheiten, die noch nicht gehandelt haben und sofort danach ziehen.
  - Neu: Bonus, wenn die Einheit damit ein freies, fremdes Zielfeld oder neue Felder neben einem Gegner (Sturm) erreicht.
  - Ein Versuch im ersten Durchgang (vor allen anderen Zügen) war schlechter (+5 statt +20) und wurde verworfen.
- **Grabenmörser/Minenwerfer:**
  - Sprenggranaten auf Gegner in Graben, Bunker, Ort oder neben Draht zählen +1,5, wenn eigene Angreifer bis 3 Felder heran sind; auf markierte Ziele (Ballon, Signaltrupp) +1 mehr.
  - Draht vor eigener Infanterie beschießen Mörser jetzt eher (0,9 → 1,6).

**Nutzen der Spezialisten:** Siegquote Konkordat mit zusätzlichen Einheiten zur Standardarmee (je 200 Schlachten). Grundwert ohne Zusatz: alte KI 47 % (Startwert 1) / 52 % (5000), neue KI 51 % / 47 %.

| Zusatz | alte KI | neue KI | Gewinn alt → neu |
|---|---|---|---|
| 2 Mineure | 55 % | 65 % | +8 → +14 |
| 3 Grabenmörser | 58 % | 69 % | +11 → +18 |
| 2 Meldegänger (zwei Startwerte) | 67 / 65 % | 64 / 64 % | +16 → +15 |
| 2 Rauchwerfer (zwei Startwerte) | 35 / 44 % | 43 / 45 % | −10 → −5 |
| 3 Minenwerfer der Aschenwacht (Siegquote Aschenwacht) | 35 % | 48 % | −18 → −1 |
| Paket Rauch + Mineure + Melder + 2 Mörser + Ballon (145 Punkte) | 66 % | 80 % | +19 → +29 |
| zum Vergleich: 4 Kohorten (160 Punkte) | 93 % | 92 % | +46 → +41 |

Die Spezialisten bringen der KI jetzt deutlich mehr, bleiben aber hinter gleich viel Infanterie zurück. Der Grund: Siegpunkte entscheiden sich an Trupps auf den Zielfeldern. Tauscht man 4 Kohorten gegen das Paket, fällt das Konkordat auf 8–10 %. Die Aschenwacht verliert dann sogar mehr (31 % statt 28 %), aber der Nordgraben ist nur noch in 24 % der Schlachten beim Konkordat.

### Gesamtmessung nach der KI-Runde (200 Schlachten, Siegquote Konkordat)

| | vorher (Kosten-Runde) | nachher |
|---|---|---|
| Grauwall Standard, Startwert 1 / 5000 | 47 / 52 % | **51 / 47 %** |
| Landkoloss-Verluste | 88 % | **44–46 %** |
| Ausfälle Konkordat / Aschenwacht | 36 / 28 % | 29 / 30 % |
| Gas je Schlacht | 1,1 / 1,75 | 1,5 / 1,7 |
| Konkordat mit Maschinen / Aschenwacht mit Maschinen / beide | 47 / 37 / 62 % | 40 / 34 / 67 % |
| erweiterte Armeen beide | 73 % | 62 % |
| erweitert gegen Standard / Standard gegen erweitert | 61 / 42 % | 77 / 33 % |

Die gemischten Fälle (erweitert gegen Standard) sind auseinandergegangen. Das erweiterte Konkordat profitiert von den besseren Spezialisten. Die erweiterte Aschenwacht hat mit Signaltrupp, Gasschutz und Panzerkürass wenig Nahkampfwucht, und auch ihre Fahrzeuge halten sich jetzt zurück. Nicht korrigiert, weil der Auftrag nur den Grauwall mit Standardarmeen ausgleicht. Bei Bedarf als Nächstes die Kostenprüfung mit der neuen KI wiederholen (`ADD=80 PAR=28 node tools/costcheck.js 200`).

## Nebelwand neu und zweite Kostenrunde (2026-11-18)

### 1. Nebelwand (Regel, Wunsch des Nutzers)

**Regel:**

| Lage | Wirkung |
|---|---|
| Ziel **im** Nebel | Beschuss ×0,5 (`P.NEBEL_IN`; auch direkter Geschützschuss) |
| Schütze im Nebel | schießt heraus mit ×0,75 (`P.NEBEL_AUS`) |
| Schütze und Ziel außerhalb, Sichtlinie geht durch die Wand | gesperrt wie bisher |
| Beobachter | sehen nicht in den Nebel: keine Artillerie, kein Feuerschlag, kein Markieren auf Nebelfelder |

Die Nebelwand gilt weiter bis zur nächsten eigenen Runde. Die Angriffsvorschau zeigt „Ziel im Nebel ×0,5“ bzw. „aus dem Nebel ×0,75“.

**KI:**
- Der Rauchwerfer handelt jetzt **vor** den anderen (wie die Beobachter).
- Er legt die Wand dorthin, wo eigene Truppen in diesem Zug vorrücken können (erreichbare Felder näher am Feind oder auf Zielfeldern) und dabei offen im gegnerischen Schussfeld stünden (MG-Fächer ×1, Schützen ×0,4, Felder mit guter Deckung ×0,4).
- Etwas Wert haben auch eigene Trupps, die schon im Nebelbereich stehen; Abzug für eigene Schützen, deren Sichtlinie durch die Wand ginge.
- Die Bedrohungsrechnung (`threatAt`) halbiert Beschuss auf Nebelfelder, deshalb ziehen die Angreifer von selbst hinein.

**Texte:** Einheitentext Rauchwerfer (Tooltip des Knopfs und Info), Geländeinfo beim Antippen eines Nebelfelds, Regeln „Weitere Fähigkeiten“.

**Messwert** (2 Rauchwerfer zusätzlich zur Standardarmee, Grauwall, je 200 Schlachten; Grundwert 51 % / 47 %):

| | Startwert 1 | Startwert 5000 | Mittel |
|---|---|---|---|
| alte Regel, alte KI | 35 % | 44 % | −10 |
| alte Regel, KI-Runde | 43 % | 45 % | −5 |
| **neue Regel** | **66 %** | **63 %** | **+15,5** |

Rauch je Schlacht: 1,3 → 5,6.

### 2. Kostenprüfung mit der neuen KI

`ADD=80 PAR=28 node tools/costcheck.js 200`. Differenz = Siegquote mit etwa 80 Punkten des Typs minus gleich viel Grundinfanterie; Rauschen ±5.

| Einheit | Differenz vorher (alte KI) → jetzt | Kosten | Änderung |
|---|---|---|---|
| Landkoloss | −9 → −24 | 80 → 70 | Abgleich −10 (vorsichtiger, also weniger Wirkung) |
| Turm-, Kreuz-, Ordensschreiter | −5…−10 → −19…−21 | 80/90/85 → 70/80/75 | Abgleich −10 |
| Donnerrohr-Batterie | −21 → −18 | 55 → 50 | Abgleich −5 → −10 |
| Drahtpioniere | −8 → −29 | 45 → 35 | Fähigkeiten 20 → 10 |
| Signaltrupp | −16 → −22 | 20 → 15 | Ziel markieren 10 → 5 |
| Minenwerfer | −6 → −19 | 30 → 25 | Abgleich −10 → −15 |
| Brandwerfer | −2 → −17 | 50 → 45 | Abgleich 5 → 0 |
| Gasschutz-Trupp | −10 → −16 | 35 → 30 | Abgleich −5 → −10 |
| Schwere Grabenwacht | −3 → −16 | 40 → 35 | Abgleich −5 |
| Bannerträger | −5 → −15 | 45 → 40 | Abgleich −5 |
| Aschenpfleger | −4 → −13 | 25 → 20 | Abgleich −5 → −10 |
| Sprenglanzen-Reiter | +8 → −13 | 30 → 25 | Abgleich −10 → −15 |
| Versorgungstrupp (Aschenwacht) | −2 → −12 | 45 → 40 | Abgleich −5 |
| Klauenschreiter | +27 → +14 | 95 → 105 | Abgleich 15 → 25 |
| Sägeschreiter | +22 → +10 | 95 → 105 | Abgleich 10 → 20 |
| Bohrkoloss | +22 → +16 | 150 → 160 | Abgleich 70 → 80 |

**Jetzt im Rahmen** (nach der ersten Kostenrunde bzw. dank der KI):

| Seite | Einheiten |
|---|---|
| Aschenwacht | Sturmbrecher −3, Sturmpanzer +4, Eingreiftrupp −2, Panzerkürass +2, Pirschjäger −2, Sensenwerk −1 |
| Konkordat | Mahlwerk −1, Scharfschütze +1, Pioniere +3, Grabenräumer +6, Reiter +2, Stahlkürass −2, Rauch −8 |

**Bewusst nicht weiter gesenkt:** Konkordat-Spezialisten (Fernsprech −31, Versorgung −31, Flammen −28, Hauptmann −28, Mörser −27, Ballon −26, Melder −25, Feldkanone −23, Mineure −20, Feldscher −17, Schildwall −17).
- Sie wurden schon einmal gesenkt und bringen der KI etwas (siehe KI-Runde).
- Beim Konkordat schlägt aber jede Kohorte stark zu Buche, weil Zielfelder mit Trupps gehalten werden.
- Billiger würde sie vor allem für menschliche Spieler zu stark machen.

**Budget Grauwall** jetzt Konkordat 910, Aschenwacht 675 (Kolosse und Donnerrohre der Standardarmee sind billiger geworden).

### 3. Gemischte Armeen richtig messen: MISCHEN=1

Die bisherigen Werte „erweitert gegen Standard 77 % / 33 %“ und nach den neuen Kosten „85 % / 58 %“ waren zum großen Teil ein Messfehler:
- Eine feste Armeeliste bekommt in allen 200 Schlachten dieselbe automatische Aufstellung.
- Nimmt man aus der erweiterten Konkordat-Armee eine einzige Einheit heraus, springt die Quote zwischen 2 % und 98 %.

**Neu:**
- `MISCHEN=1` in sim.js mischt je Schlacht die Aufstellungsreihenfolge (`G.mischen`, nur für Tests; im Spiel unverändert).
- Damit werden viele Aufstellungen gemittelt. Zufällige Aufstellung schadet dem Angreifer allgemein: Standard gegen Standard liegt dann bei 34 / 43 %. Deshalb sind die gemischten Fälle mit diesem Wert zu vergleichen.

**Siegquote Konkordat mit MISCHEN=1** (je 200 Schlachten, Startwert 1 / 5000; erweiterte Aschenwacht jetzt mit Bannerträger, um ihr Budget zu füllen):

| | Konkordat |
|---|---|
| Standard gegen Standard (Vergleichswert) | 34 / 43 % |
| erweitertes Konkordat gegen Standard | 36 / 33 % |
| Standard gegen erweiterte Aschenwacht | 47 / 46 % |
| beide erweitert | 43 % |
| Konkordat mit Maschinen gegen Standard | 61 % |
| Standard gegen Aschenwacht mit Maschinen | 34 % |
| beide mit Maschinen | 46 % |

Alle gemischten Fälle liegen in 33–61 %, also im Ziel 35–65 % oder knapp darunter, und keiner kippt. Verglichen mit „Standard gegen Standard“:
- Das erweiterte Konkordat liegt ungefähr gleichauf (−4).
- Die erweiterte Aschenwacht ist etwas schwächer als ihre Standardarmee (−8).
- Konkordat-Maschinen sind etwas stärker (+22, nur eine Zusammenstellung gemessen), Aschenwacht-Maschinen fast gleich.

### 4. Grauwall mit Standardarmeen (feste Aufstellung wie „Automatisch aufstellen“)

| | Siegquote Konkordat |
|---|---|
| Startwerte 1 / 5000 / 9000 / 13000, je 200 Schlachten | 59 / 46 / 47 / 40 % |
| **Mittel über 800 Schlachten** | **48 %** |
| Landkoloss-Verluste | 46 % |

Die Streuung zwischen Startwerten ist hier größer als die ±4 je Messung. Für Entscheidungen deshalb künftig mindestens zwei, besser vier Startwerte nehmen.

## Gemeldet statt geändert (Regel bzw. KI ist das Problem)

0. **Rauch hilft der Seite mit weniger Feuerkraft.** Erledigt mit der neuen Nebelwand-Regel (2026-11-18): Rauch bringt jetzt +15 statt −5.

1. **Landkoloss fällt in 88 % der Schlachten.** Wie oben gemessen war es keine Regel-, sondern eine KI-Frage. **Erledigt in der KI-Runde vom 2026-11-18:** 44–46 %.
2. **(Kosten-Runde) Rauchwerfer, Mineure, Melder, Mörser bringen der KI kaum etwas.** Inzwischen verbessert, siehe KI-Runde; offen bleibt nur Rauch (Punkt 0). Teils ist die Siegquote mit ihnen sogar niedriger als ohne. Das ist eine Frage der KI-Nutzung, nicht der Kosten: Rauch 3,8× je Schlacht, steht aber oft vor den eigenen Schützen. Kosten nur leicht gesenkt. **Vorschlag:** Rauch nur vor eigene Angreifer legen, die in MG-Reichweite ziehen.
3. **Anführer-Befehle:** Kein Regelproblem mehr. Der starke Ausschlag kam von früh fallenden Generälen und ist mit der höheren Abwehr behoben (General-Verluste 51 → 7 %).
4. **Alte Karten** (siehe Tabelle): Kasematten (1 %), Grauwall-Front (15 %) und Lerne (94 %) sind grundsätzlich einseitig. Wie beauftragt nicht korrigiert, gehört zum Neubau.

## Sankt Ruß (2026-11-19)

Ziel um 50 %. Gemessen mit `MAP=sanktruss MISCHEN=1 node tools/sim.js 200 <Startwert>`, Startwerte 1–4.

| Stand | Konkordat |
|---|---|
| Grauwall-Armeen, Turm im Westen | 97–100 % |
| Aschenwacht gleich viel wert (910), ohne Reserve | 97 % |
| dazu Turm nach Osten, Startzone bis in den Graben (band 4), Angriffsgewichte (`ki`) | 53 / 64 / 63 / 68 % (Ø 62 %) |
| dazu 1 Grenadier-Trupp mehr (940 zu 910) | **54 / 52 / 55 / 51 % (Ø 53 %)** |
| derselbe Stand ohne Mischen (feste Aufstellung) | 45 % |

Begründung:
- **Neutrale Fahnen, gleiche Wege:** Das Konkordat zieht zuerst und erreicht Kirche, Friedhof und Dorfplatz eine Runde früher. Wer drin sitzt (Abwehr ×1,8, halber Moralverlust), bleibt drin.
- **Die Grauwall-Armee der Aschenwacht taugt nicht zum Angriff:** 5 MG-Trupps stehen aufgebaut im Graben. Dazu kommt die Verteidiger-KI.
- Ausgleich durch:
  - eine Angriffsarmee (Grenadiere, Sturmpanzer, Lanzenreiter, Minenwerfer) mit einem Trupp mehr;
  - Aufstellung bis in den eigenen Graben;
  - den Turm auf der Ostseite.

Werte der Kirche:
- Deckung 1,5 / 1,8 / 2,0 und Bauzustand 3 / 6 / 8 / 10 verschieben die Quote kaum (±5, im Rauschen).
- **Startwerte bleiben:** Deckung ×1,8, Bauzustand 6 (Einsturz in gut 40 % der Schlachten, im Mittel Runde 9).
- Bauzustand 8 bis 10 ließe die Kirche nur noch in 10–25 % der Schlachten einstürzen; das wäre zu selten für die gewünschte Wendung.

Sonst:
- Den Turm hält die Aschenwacht in rund zwei Drittel der Züge.
- Eingestürzt wird die Kirche meist vom Konkordat: Landkolosse schießen auf die Aschenwacht im Turm.
- Dauer im Mittel 14 Runden, Verluste beider Seiten rund 30 %.

## Eisenknecht-Preis (2026-11-20)
Stufe-3-Schreiter der Aschenwacht mit Faustsalve. Gemessen als Tausch im Budget: Knecht statt n Grenadiere (je 30 Punkte),
`MISCHEN=1 MECHS=1`, Grauwall, je 800 Schlachten mit zwei Startwerten (1 und 5), Siegquote Aschenwacht:

| Tausch | Startwert 1 | Startwert 5 | Mittel |
|---|---|---|---|
| ohne | 63 % | 60 % | 61,5 % |
| statt 3 (90) | – | 69 % | 69 % |
| statt 4 (120) | 60 % | 64 % | 62 % |
| statt 5 (150) | 60 % | 59 % | 59,5 % |
| statt 6 (180) | 46 % | – | 46 % |

Neutral liegt bei 4–5 Grenadieren; mit 6 Grenadieren weniger wird die Verteidigung zu dünn. Preis daher **150** (ADJ −10, vorher 185).

## Löwenoger und Eiserne Hünen (2026-11-20)
Budget-Tausch `MISCHEN=1`, Grauwall, je 600 Schlachten (Startwert 1, beim Oger auch 5).

| Tausch | Seite ohne Tausch | mit Tausch |
|---|---|---|
| 1 Löwenoger (105) statt 2 Kohorten | Konkordat 36 % | 40 % |
| statt 3 Kohorten | 36 % / 41 % | 38 % / 35 % |
| statt 4 Kohorten | 36 % | 26 % |
| 2 Löwenoger statt 6 Kohorten | 36 % | 25 % |
| 1 Hünen-Trupp alt (Feuer 5, Reichweite 2) statt 2 / 3 / 4 Grenadiere | Aschenwacht 65 % | 57 / 52 / 44 % |
| 1 Hünen-Trupp neu (Feuer 7, Reichweite 3) statt 3 Grenadiere | 65 % | 66 % |
| … statt 4 Grenadiere | 65 % | 57 % (Abwehr 7: 60 %, Bewegung 3: 65 %) |

Löwenoger: Werte wie geplant, Preis **105** (neutral bei etwa 2,6 Kohorten). Eiserne Hünen: schweres MG mit Reichweite 3 und Feuer 7, Bewegung bleibt 2, Preis **90** (ADJ −15). Sprungangriffe in der KI: gut 2–3 je Oger und Schlacht, Dauerfeuer etwa 1 je Hünen-Trupp und Schlacht.

## Krähenfurt – Neuabgleich nach den Handgranaten (2026-11-24, Paket C2 Punkt 36)

Nach Paket B2 (Handgranaten als Fähigkeit der Aschengrenadiere) stand Krähenfurt bei Konkordat 41 / 42 % (Startwerte 1 / 2, je 100 Schlachten). Nachgestellt nur über die Kartendaten, nicht an den Handgranaten:

| Variante | Startwert 1 | Startwert 2 | Schnitt |
|---|---|---|---|
| bisher (zoneD 13) | 41 % | 42 % | 41,5 % |
| **zoneD 14** (Aufstellungszone der Aschenwacht eine Spalte zurück) | 58 % | 50 % | **54 %** |
| 1 Grenadier weniger (`MD_grenadier=4`) | 81 % | 80 % | 80,5 % |

Übernommen: **zoneD 14**. Die Messung schwankt bei 100 Schlachten etwa ±5 Punkte. Deckung in der Mitte bleibt leer (Enrico 24.11., siehe Paket C).
