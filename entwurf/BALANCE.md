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

## Gemeldet statt geändert (Regel bzw. KI ist das Problem)

1. **Landkoloss fällt in 88 % der Schlachten.**
   - Etwa 70 % seines Schadens kommen von Sturmbrechern im Nahkampf, 15 % von Geschützen.
   - Das liegt *nicht* an den Regelwerten:

     | Probe | Koloss-Verluste | Siegquote |
     |---|---|---|
     | Sturmbrecher gegen Koloss ×1,5 → ×1,0 | 84 % | 53 % |
     | Flanke/Rücken ×1,4/×1,8 → ×1,0 | 80 % | 52 % |
     | Abwehr 7 → 8 | 85 % | 58 % |

   - Ursache ist die KI: Der Koloss fährt als Spitze allein vor und wird von den Sturmbrechern (seinem vorgesehenen Gegner) gestellt. Die Siegquote stimmt trotzdem, weil er die Sturmbrecher bindet.
   - **Vorschlag:** In einer KI-Runde den Koloss bei Sturmbrechern in 2 Feldern nur mit Infanterie daneben vorziehen lassen, bzw. ihn gegen Sturmbrecher zurückweichen und schießen lassen. Keine Regeländerung.
2. **Rauchwerfer, Mineure, Melder, Mörser bringen der KI kaum etwas.** Teils ist die Siegquote mit ihnen sogar niedriger als ohne. Das ist eine Frage der KI-Nutzung, nicht der Kosten: Rauch 3,8× je Schlacht, steht aber oft vor den eigenen Schützen. Kosten nur leicht gesenkt. **Vorschlag:** Rauch nur vor eigene Angreifer legen, die in MG-Reichweite ziehen.
3. **Anführer-Befehle:** Kein Regelproblem mehr. Der starke Ausschlag kam von früh fallenden Generälen und ist mit der höheren Abwehr behoben (General-Verluste 51 → 7 %).
4. **Alte Karten** (siehe Tabelle): Kasematten (1 %), Grauwall-Front (15 %) und Lerne (94 %) sind grundsätzlich einseitig. Wie beauftragt nicht korrigiert, gehört zum Neubau.
