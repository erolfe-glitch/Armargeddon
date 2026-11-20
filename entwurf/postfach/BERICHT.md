# Berichte von Claude Code (neuester oben)

## 2026-11-21 – Nachträge F49–F65 erledigt, F44 Grauwall, Paket-E-Regeln; Vorschläge F54, F59-Preis und F66 zur Entscheidung

**Commits (alle gepusht):**
- `10b9b3a` neue Töne 5b und F49
- `13b2a89` F50, F52
- `f3d9c26` F51
- `8b580b2` F56, F57
- `bb273c0` F36 Bild
- `995b8ad` F44 und Regeln F53, F55, F31, F37, F38
- `d521862` F60, F62
- `19c8ff6` F61
- `cfc7083` F58
- `f90ae96` F59, F65
- `1153d41` F63
- `d379432` F67 und 2c
- `d8a24f1` + `f606e55` F64

**Bilder:**
- `entwurf/probe/spieltest4_paketD/f58_reiter_vorher.jpg` und `f58_reiter_nachher.jpg` (beide Seiten)
- `entwurf/probe/spieltest4_nachtraege/`:
  - `f59_bordmg.jpg`
  - `f63_nahkampf_folge.jpg`, `f63_nahkampf_flucht_folge.jpg`
  - `f64_blut_kanone.jpg`, `f64_blut_gewehr.jpg`
  - `f65_saeger_auf_panzer.jpg`
  - `f67_tonpult_alle_toene.jpg`

### Erledigt
- **5b neue Töne:** 25 Pixabay-Dateien sind einsortiert, im Ton-Pult unter „(neu)“. Fünf bitgleiche Doppelte liegen in `sound-quelle/_neu_doppelt`.
- **F49:** Beim Marsch nur Schritte, keine Trommel.
- **F50:** mehr Blut im Nahkampf.
- **F51:** Beide Seiten schlagen gleichzeitig zu, danach ein gemeinsamer Wucht-Moment mit beiden Schadenszahlen.
- **F52:** dünner Moralbalken unter dem Lebensbalken.
- **F53 Generalangriff:** ist jetzt ein echter zweiter Angriff.
  - Wirkung: +1 Aktion, +2 BP, auch für Einheiten, die schon angegriffen haben; Nahkampf auch nach weitem Zug; Niederhalten endet.
  - Nicht für Fliehende, Panne oder Festgefahrene.
  - Die KI nutzt ihn, wenn mindestens 40 % ihrer Einheiten in Reichweite schon angegriffen haben oder niedergehalten sind.
  - **Großer Befehl beider Seiten jetzt 2 statt 3 Felder:** Mit 3 Feldern kam das Konkordat auf Sankt Ruß nur auf 35 %.
  - „Halten um jeden Preis“ bleibt unverändert: keine Flucht, Abwehr ×1,25, 2 Felder.
- **F55:** Feuerbereitschaft und Sperrfeuer gehen nicht in Feindberührung (Knopf grau mit Grund).
- **F56:** Lauerschuss mit Kamera.
- **F57:** Ausgegraute Einheiten bleiben grau, während eine andere Einheit handelt.
- **F58:** Reiter zu dritt: zwei vorn, einer hinten in der Mitte, Maßstab 0,8, bleiben im eigenen Feld.
- **F59:** Sturmpanzer mit Bord-MG (Zweitwaffe wie beim Landkoloss), Mündung an der mittleren Bordschützen-Luke. Preis siehe unten.
- **F60:** Vorschau beim Ziehen: Gewehr, Schwert oder durchgestrichen. Ein echter Regelfehler lag nicht vor: In 548 von 566 Fällen konnte die Infanterie nach dem Zug schießen, die übrigen waren unterwegs niedergehalten worden.
- **F61:** Bewegungspunkte und Aktionsmünze groß unter der eigenen Figur, im Panel „Bewegung 2/3 · Aktion frei“.
- **F62:** Feuerknöpfe passen zur Regel.
- **F63:** Der ganze Nahkampf läuft in der Zoom-Szene (Gegenschlag, Ergebnis, Flucht, Nachrücken). Dauer bei 1× etwa 1,6 s, mit Flucht 2,4 s; bei ½× 3,2 s statt 4,4 s.
- **F64:**
  - Einschlag-Ton nach dem Ziel (Prüfliste unten).
  - Gewehrtreffer mit kleinem Blutnebel, Kanone und Granate auf Fußtruppen mit Erd- und Blutfontäne, Erdklumpen und Fleck.
  - Gewehrtöne siehe 2c im F67-Bericht.
  - Nebenbei gefunden: Der Einschlag-Ton nach Gewehrsalven fehlte seit der längeren Salve (F24) ganz. Behoben.
- **F65:** Schüsse auf große Ziele zielen jetzt auf die Mitte der Figur. Vorher lag der Zielpunkt über dem Panzer. Die Leuchtspuren fliegen flach.
- **F31, F37, F38:** Nahkampf-Schreiter nach weitem Zug nur Nahkampf; Steilfeuer ab 2 bzw. 3 Feldern; leere Drahtfelder nicht beschießbar.
- **F44 (nur Grauwall):** keine Welle mehr.
  - Die Aschenwacht startet mit **10 statt 8 Grenadieren**. Die alte Welle in Runde 7 waren 3 Sturmbrecher, 2 Brandwerfer und 1 Geschütz.
  - Ergebnis: Grauwall Konkordat **51 %**, mit gemischter Aufstellung 44 %; Sankt Ruß 47 % (je 200 Schlachten).
  - Andere Karten unverändert, die Abstimmung dort ist abgebrochen.

### F59 – Preis des Sturmpanzers (Vorschlag)
- Grauwall: unverändert 51 %, dort fährt kein Sturmpanzer.
- Sankt Ruß: Konkordat **44 %** statt 47 % (200 Schlachten, gleicher Startwert). Das Bord-MG wird etwa 8,5-mal je Schlacht benutzt.
- Die Kosten rechnen die Zweitwaffe nicht ein: Sturmpanzer 90, Landkoloss (mit Seiten-MG) 70.
- **Vorschlag:** Sturmpanzer +10 auf **100**.
  - Das wirkt nur beim Nachkauf, denn die Kartenarmeen sind fest.
  - Wenn Sankt Ruß wieder näher an 50 % soll, eher dort die Aschenwacht-Armee leicht schwächen.

### F64 – Prüfliste Einschlag-Ton (jede Waffe × Ziel)

Ziel weich = Fußtruppen, Reiter, Bedienungen. Gepanzert = Fahrzeuge, Schreiter, Kampfanzüge.

| Waffe | weiches Ziel | gepanzert, Waffe wirkt | gepanzert, prallt ab |
|---|---|---|---|
| Gewehr (Salve, Scharfschütze, Pistole, Halbautomat) | `einschlag` dumpf bzw. `vorbei` | – | `einschlag_abpraller` (gegen Kampfanzüge; auf Fahrzeuge dürfen Gewehre nicht schießen) |
| MG, Drehlauf, Seiten- und Bord-MG | `einschlag` tief und kurz, mit Spritzer | – | `einschlag_abpraller` |
| Panzerbüchse, Kanone gegen Panzerung (`at`), Unterarm-Kanone | `einschlag` | `einschlag_panzer` | – |
| Kanone (Koloss, Sturmpanzer, Turm, Feldkanone direkt) | Granateinschlag + `einschlag` tief | `einschlag_panzer` | – |
| Artillerie, Mörser, Minenwerfer, Feuerschlag | Einschlag schwer + `einschlag` tief | `einschlag_panzer` | – |
| Flamme, Gas | kein Kugeleinschlag (Feuer bzw. Gaswolke) | – | – |
| Nahkampf gegen Panzer | – | wie bisher `armor` bzw. `heavy` (im Nahkampf-Ablauf) | – |
| Sturmrollen (F54), Lauerschüsse (F56) | wie die Waffe | wie die Waffe | wie die Waffe |

- Im Ton-Pult hat jede schießende Einheit unter „Einschlag beim Ziel“ jetzt die Zeile „Treffer auf Panzerung (Waffe wirkt)“ bzw. „(Abpraller)“. Die Plätze gelten für alle Einheiten.
- **Abpraller:** In `sound-quelle` gibt es keinen echten Querschläger-Ton. Die drei Pings sind hochgestimmte Metalltöne. Wenn du 2–3 echte „ricochet“-Töne findest, tausche ich sie ein.
- Bis F66 gebaut ist, gilt vereinfacht: wirkt = Kanone, Granate, Panzerbüchse, panzerbrechend; alles andere prallt ab.

### F54 – Vorschlag „Sturmrollen“ (noch nicht gebaut, Entscheidung nötig; F26 ist derselbe Punkt)
- **Betroffen:** Landkoloss und Sturmpanzer verlieren den normalen Nahkampf, sie schießen.
  - **Frage:** Der Bohrkoloss ist ein Kettenfahrzeug, sein Bohrkopf ist aber eine Nahkampfwaffe. Soll er Nahkampf behalten (mein Vorschlag) oder auch Sturmrollen bekommen?
  - Schreiter bleiben im Nahkampf.
- **Sturmrollen** ist eine Fähigkeit. Sie kostet die Aktion und alle Bewegungspunkte, danach 2 Runden Pause.
  - **Ziel:** eine Fußtruppe oder ein Geschütz im Nachbarfeld, oder 2 Felder geradeaus mit freiem Feld dazwischen (Anlauf).
  - **Wirkung:** ein einziger Aufprall mit etwa 24 Schaden (rund doppelt so viel wie heute ein Nahkampf-Hieb des Kolosses gegen Grenadiere), dazu niedergehalten und Moral −15. Kein Gegenschlag.
  - **Rückstoß:** Das Ziel rutscht ein Feld zurück, wenn dort frei und begehbar ist. Sonst +50 % Schaden (gegen Wand, Draht oder eigene Truppen gedrückt). Der Panzer bleibt auf seinem Feld; beim Anlauf bleibt er im Zwischenfeld.
  - Draht im Weg wird niedergewalzt. Kampfanzüge nehmen nur die Hälfte. Gegen Panzer und Schreiter geht es nicht.
- **Animation:** Anlauf, ein Aufprall mit Kampfszene, Ziel rutscht zurück. Ton: tiefes Kettenrollen und schwerer Aufprall.
- **KI:** nutzt es, wenn der erwartete Schaden größer ist als der eines Schusses, zum Beispiel gegen ein Ziel in Deckung.
- Die Werte stimme ich nach deiner Zustimmung per Simulation ab (Grauwall und Sankt Ruß).

### F66 – Vorschlag „Schere-Stein-Papier“ (noch nicht gebaut, Entscheidung nötig)

**Faktortabelle (Waffe gegen Panzerklasse):**

| Waffenart | ungepanzert | leicht gepanzert | schwer gepanzert | heute |
|---|---|---|---|---|
| Gewehr, MG, Drehlauf | ×1 | ×0,5 | wirkungslos | gleich (Kampfanzug ×0,5, Panzer immun) |
| Schrot (Löwenoger) | **×1,5** | ×1 | wirkungslos | neu: ×1,5 gegen Fußtruppen |
| panzerbrechend (Panzerbüchse, Löwenmaul, Unterarm-Kanone) | **×0,5** | **×1,5** | **×1,5** | Panzerbüchse ×2 → ×1,5; gegen Infanterie neu ×0,5 |
| Kanone direkt (Koloss, Sturmpanzer, Turm, Faust, Feldkanone) | ×1 | ×1 | ×1 | gleich |
| Explosiv indirekt (Artillerie, Mörser, Minenwerfer, Granaten) und Flamme | ×1 (Deckung zählt weniger, wie heute) | ×1 | **×0,5** | neu: ×0,5 gegen Panzer |
| Nahkampf Klinge/Kolben | ×1 | **×0,5** | ×0,5 | Panzer ×0,4 → ×0,5; Kampfanzug neu ×0,5 |
| Nahkampf schwer (Säge, Klaue, Bohrkopf, Pranken) | **×1,5** | ×1 | ×1 | neu ×1,5 gegen Fußtruppen |
| geballte Ladung (Sturm- und Pioniertrupps gegen Panzer) | – | – | **×1,5** | gleich (bleibt als Ausnahme, macht die Sturmtrupps aus) |

**Rollen:**
- **Schwach im Nahkampf:** MG, Geschütze, Mörser/Minenwerfer, Scharfschütze/Pirschjäger, Sanitäter/Versorgung, Melder, Signal, Fernsprech, Ballon, Rauchwerfer. Wirkung: Angreifer ×1,5 gegen sie, ihr Gegenschlag ×0,5.
- **Stark im Nahkampf:** Sturmtrupps, Schildwall, Schwere Grabenwacht, Löwenoger, Kampfanzüge. Wirkung: Gegenschlag ×1,25.
- Bleibt als Ausnahme: MG gegen Reiter ×2 (macht das MG aus), Flankenangriff auf Fahrzeuge.

**Anzeige:**
- Unter dem Bild im Einheiten-Panel drei Medaillen, alle aus denselben Werten erzeugt:
  - **gegen Infanterie** (Schuss gegen ungepanzert),
  - **gegen Panzer** (Schuss gegen schwer),
  - **Nahkampf**.
- Bronze = ×0,5 oder wirkungslos, Silber = ×1, Gold = ×1,5.
- Im Info-Fenster stehen dieselben Punkte in Worten mit Faktor.
- Beim Zielen kurz „×1,5 panzerbrechend“.

**Jede Einheit (K = Konkordat, A = Aschenwacht):**
- Landkoloss und Sturmpanzer verlieren mit F54 den Nahkampf.
- Feldkanone zählt als „Kanone direkt“, nicht als Explosiv.

| Einheit | Seite | Panzerklasse | Fernwaffe | Nahkampf | Rolle |
|---|---|---|---|---|---|
| Schützenkohorte | K | ungepanzert | Gewehr/MG | Klinge/Kolben |  |
| Mahlwerk-Trupp | K | ungepanzert | Gewehr/MG | Klinge/Kolben | schwach im Nahkampf |
| Donnerrohr-Batterie | K | ungepanzert | Explosiv (Steilfeuer/Granate) | Klinge/Kolben | schwach im Nahkampf |
| Landkoloss | K | schwer | Kanone + Seiten-MG | schwer (Säge/Klaue/Rammen) |  |
| Lanzenreiter | K | ungepanzert | – (kein Fernkampf) | Klinge/Kolben |  |
| Feldscher | K | ungepanzert | – (kein Fernkampf) | Klinge/Kolben | schwach im Nahkampf |
| Grabenmörser | K | ungepanzert | Explosiv (Steilfeuer/Granate) | Klinge/Kolben | schwach im Nahkampf |
| Scharfschütze | K | ungepanzert | Gewehr/MG | Klinge/Kolben | schwach im Nahkampf |
| Meldegänger mit Hund | K | ungepanzert | – (kein Fernkampf) | Klinge/Kolben | schwach im Nahkampf |
| Graben-Pioniere | K | ungepanzert | Gewehr/MG | Klinge + geballte Ladung |  |
| Grabenräumer | K | ungepanzert | – (kein Fernkampf) | Klinge + geballte Ladung | stark im Nahkampf |
| Turmschreiter | K | schwer | Kanone + Turm-MG | schwer (Säge/Klaue/Rammen) |  |
| Ordensschreiter | K | schwer | Gewehr/MG (Drehlauf) | schwer (Säge/Klaue/Rammen) |  |
| Kreuzschreiter | K | schwer | panzerbrechend (Löwenmaul) + Unterarm-Kanone | schwer (Säge/Klaue/Rammen) |  |
| Stahlgänger-Trupp | K | leicht | Gewehr/MG | Klinge/Kolben | stark im Nahkampf |
| Löwenoger | K | leicht | Schrot | schwer (Pranken) | stark im Nahkampf |
| Flammentrupp | K | ungepanzert | Flamme | Klinge/Kolben |  |
| Schildwall | K | ungepanzert | – (kein Fernkampf) | Klinge/Kolben | stark im Nahkampf |
| Feldkanone | K | ungepanzert | Kanone direkt | Klinge/Kolben | schwach im Nahkampf |
| Fernsprechtrupp | K | ungepanzert | – (kein Fernkampf) | Klinge/Kolben | schwach im Nahkampf |
| Hauptmann mit Stab | K | ungepanzert | Gewehr/MG | Klinge/Kolben |  |
| General mit Stab | K | ungepanzert | Gewehr/MG | Klinge/Kolben |  |
| Rauchwerfer-Trupp | K | ungepanzert | – (kein Fernkampf) | Klinge/Kolben | schwach im Nahkampf |
| Mineure (Tunnelgräber) | K | ungepanzert | – (kein Fernkampf) | Klinge/Kolben |  |
| Versorgungstrupp | K | ungepanzert | – (kein Fernkampf) | Klinge/Kolben | schwach im Nahkampf |
| Ballonbeobachter | K | ungepanzert | – (kein Fernkampf) | Klinge/Kolben | schwach im Nahkampf |
| Sturmpanzer | A | schwer | Kanone + Bord-MG | schwer (Säge/Klaue/Rammen) |  |
| Aschengrenadiere | A | ungepanzert | Gewehr/MG | Klinge/Kolben |  |
| Sensenwerk-Trupp | A | ungepanzert | Gewehr/MG | Klinge/Kolben | schwach im Nahkampf |
| Grabengeschütz | A | ungepanzert | Explosiv (Steilfeuer/Granate) | Klinge/Kolben | schwach im Nahkampf |
| Sturmbrecher | A | ungepanzert | – (kein Fernkampf) | Klinge + geballte Ladung | stark im Nahkampf |
| Brandwerfer | A | ungepanzert | Flamme | Klinge/Kolben |  |
| Aschenpfleger | A | ungepanzert | – (kein Fernkampf) | Klinge/Kolben | schwach im Nahkampf |
| Minenwerfer | A | ungepanzert | Explosiv (Steilfeuer/Granate) | Klinge/Kolben | schwach im Nahkampf |
| Sprenglanzen-Reiter | A | ungepanzert | – (kein Fernkampf) | Klinge/Kolben |  |
| Panzerbüchsen-Trupp | A | ungepanzert | panzerbrechend | Klinge/Kolben |  |
| Schwere Grabenwacht | A | ungepanzert | – (kein Fernkampf) | Klinge/Kolben | stark im Nahkampf |
| Signaltrupp | A | ungepanzert | – (kein Fernkampf) | Klinge/Kolben | schwach im Nahkampf |
| Sägeschreiter | A | schwer | Gewehr/MG (Drehlauf) | schwer (Säge/Klaue/Rammen) |  |
| Klauenschreiter | A | schwer | Gewehr/MG (Drehlauf) | schwer (Säge/Klaue/Rammen) |  |
| Eiserne Hünen | A | leicht | Gewehr/MG | Klinge/Kolben | stark im Nahkampf |
| Panzerknechte | A | leicht | Gewehr/MG | Klinge/Kolben | stark im Nahkampf |
| Drahtpioniere | A | ungepanzert | Gewehr/MG | Klinge + geballte Ladung |  |
| Bannerträger | A | ungepanzert | Gewehr/MG | Klinge/Kolben |  |
| Hauptmann mit Stab | A | ungepanzert | Gewehr/MG | Klinge/Kolben |  |
| General mit Stab | A | ungepanzert | Gewehr/MG | Klinge/Kolben |  |
| Eisenknecht | A | schwer | Kanone (Faust) | schwer (Säge/Klaue/Rammen) |  |
| Bohrkoloss | A | schwer | – (nur Nahkampf, Bohrkopf) + Flammenstoß | schwer (Säge/Klaue/Rammen) |  |
| Eingreiftrupp | A | ungepanzert | – (kein Fernkampf) | Klinge + geballte Ladung | stark im Nahkampf |
| Gasschutz-Trupp | A | ungepanzert | Gewehr/MG | Klinge/Kolben |  |
| Versorgungstrupp | A | ungepanzert | – (kein Fernkampf) | Klinge/Kolben | schwach im Nahkampf |
| Pirschjäger | A | ungepanzert | Gewehr/MG | Klinge/Kolben | schwach im Nahkampf |

**Was sich spürbar ändert:**
- Panzerbüchse und Löwenmaul gegen Infanterie schwächer.
- Artillerie gegen Panzer schwächer.
- Löwenoger und Schreiter im Nahkampf gegen Fußtruppen stärker.
- MG-Trupps und Geschütze im Nahkampf deutlich schwächer.

Nach deiner Zustimmung baue ich das, stimme es auf Grauwall und Sankt Ruß ab, und die KI-Zielwahl nutzt die Faktoren.

### Offen
- **F36 Regelteil:** Ausgraben vor dem Ziehen. Baue ich als Nächstes.
- F54 und F66 warten auf deine Entscheidung.
- Helden stehen in IDEEN.md.

### Fragen an Enrico
1. **F54:** Sturmrollen wie oben? Behält der Bohrkoloss den Nahkampf?
2. **F66:** Tabelle so? Besonders zu entscheiden:
   - Gewehr gegen Panzer bleibt wirkungslos, oder ×0,5?
   - Panzerbüchse gegen Infanterie ×0,5?
   - Artillerie gegen Panzer ×0,5?
3. **F59:** Sturmpanzer auf 100?

## 2026-11-21 – F67 Ton-Pult neu (fehlende Töne, „Alle Töne“), Gewehre mit Nachhall (2c)

**Ton-Pult neu – bitte neu laden (Strg+F5).** Deine bisherige Auswahl bleibt erhalten: kein vorhandener Schlüssel wurde umbenannt.

- **87 der 88 Dateien eingebaut**, als 124 Einzeltöne in neuen Plätzen `neu2_*`, die unter „Einzelne Töne“ in den passenden Gruppen stehen: Gewehr, Pistole, Autokanone, Kanone, Einschlag, Metalltreffer, Knall, Einsturz, Nahkampf, Blut, Stimmen, Brüllen, Gasmaske, **Monster (später Dämonen)**, Horn, Musik, Punkt, Knopf, Tür, Aufprall/Maschine, Flugzeug, Schritte, Hund, Feuer, Wasser.
  - Lange Dateien sind geschnitten. Dateien mit mehreren Lauten sind in Einzeltöne geteilt: bis 4 je Datei, bei Monster und Stimmen bis 2 (wegen der Dateigröße).
  - In der Ton-Probe stehen sie in der Gruppe „Weitere Töne aus sound-quelle“.
- **Nicht eingebaut:** `Musiker/…nicol-singing-seven-nation-army.wav`. Grund: gesungenes, bekanntes Lied, Rechte unklar, passt nicht ins Spiel. Die Datei bleibt liegen.
- **Drei AIFF-Dateien** (Waldbrand, Kugeltreffer, Turmeinsturz Bologna) kann der Browser nicht lesen. Daneben liegen jetzt WAV-Kopien mit gleichem Namen. Die Originale sind unverändert.
- **Neu: Knopf „Alle Töne …“ in jeder Zeile.**
  - Er zeigt jeden Ton des Spiels, nach Gruppen geordnet (Gewehre, MG und Autokanonen, Kanonen, Einschläge, Nahkampf, Stimmen, Motoren, Monster …).
  - Mit Suchfeld (Name, Schlüssel, Datei), ▶ zum Probehören und „Wählen“.
  - Ein Ton aus einer fremden Gruppe bekommt beim Einbau deines Exports einen eigenen Platz nur für diese Einheit.
- **Eisenknecht:** vier Autokanonen-Kandidaten `neu2_autokanone_1–4` stehen in den Gruppen Kanone und MG:
  - 50er-MG tiefer gestimmt, in zwei Stufen,
  - schweres MG tiefer,
  - drei schnelle Kanonenschüsse.
- **2c, Gewehre mit vollem Nachhall:**
  - „Gewehr 3“ (`rifle3`, Aschenwacht) war die M1-Garand-Aufnahme, bei 0,8 s abgeschnitten. Jetzt kommt sie aus der Quelle mit Ausklang bis 1,7 s.
  - `rifle2` (battle-rifle, Hauptgewehr der Aschenwacht) war bei 0,6 s gekappt, jetzt 0,9 s mit Ausklang.
  - Alle übrigen Schusstöne geprüft: Gefechtslärm, Halbautomat, MG, Drehlauf, Sturmpanzer-Kanone und Schrot klingen jetzt weich aus.
  - Die kleine Kolosskanone ist schon in der Quelle nur 0,4 s lang.
  - Die Zuordnung im Spiel habe ich nicht geändert. Deine Wahl „Gewehr 3“ für die Aschengrenadiere baue ich mit deinem Export ein.
- **Größe:** `index.html` ist jetzt 61 MB. GitHub warnt ab 50 MB, die harte Grenze liegt bei 100 MB.

**Seit dem letzten Bericht ebenfalls erledigt (Bericht folgt ausführlich):**
- F58 drei Reiter (`cfc7083`)
- F59 Bord-MG Sturmpanzer und F65 Schüsse auf große Ziele (`f90ae96`)
- F63 Nahkampf ganz in der Szene, 1× ca. 1,6 s (`1153d41`)

Bilder: `entwurf/probe/spieltest4_paketD/f58_*`, `entwurf/probe/spieltest4_nachtraege/`.

**Fragen an Enrico:** keine, erst dein Ton-Pult-Export.

## 2026-11-21 – Paket C abgeschlossen (Posen, F48), Paket D erledigt; F44 Feinabstimmung läuft

**Commits:** `8dc70ec` weitere Posenbögen · `84c62a7` F48 Kampfszene · `f383ac0` Hauptmann-Posen · `8a58a6b` Paket D – gepusht.
**Bilder:** `entwurf/probe/spieltest4_paketC/` (posen_weitere_freigestellt.jpg, posen_weitere_im_spiel.jpg, f48_kampfszene_folge.jpg), `entwurf/probe/spieltest4_paketD/f6_aufstellung.jpg`

### Paket C – Rest
- **Alle Posenbögen eingebaut** (Sanitäter, Flammentrupps, Kampfanzüge, Versorgung, Schildwall, Schwere Grabenwacht, Scharfschütze, Pirschjäger, Melder → Fernsprech-/Signaltrupp, Mineur, Hauptmann). Posen kommen beim Ziehen (Laufen), Schießen/Flammenstoß, Nahkampf, Heilen, Reparieren, Nachladen, Schilde vor, Ziel markieren/Feuerschlag, Stollen, Sturmlauf, Befehl (Hauptmann) und Getroffen.
- Pflichtpunkte: Adler auf allen Sanitäter- und Melder-Pickelhauben übermalt, Helmplakette Flammentrupp übermalt, Konkordat-Flagge auf Ochsenblut, Aschenwacht-Läufer gespiegelt, loser Stiefel weg, Geisterfigur und Rauchwolken der Kampfanzüge weg, Lampenschein Mineur, Pistole Konkordat-Hauptmann gespiegelt, unbrauchbare Versorgungs-Posen (Hämmern, Kette) ausgelassen, kleine kniende Aschenwacht-Versorgung vergrößert. Sich berührende Figuren (Sanitäter Konkordat, Scharfschütze) per Naht getrennt.
- Melder-Bögen: Der Meldegänger hat einen Hund im Grundbogen; die Melder-Posen nutze ich deshalb für den **Fernsprechtrupp** (Konkordat, Feldtelefon) und den **Signaltrupp** (Aschenwacht, Signalflagge). Der Meldegänger mit Hund bleibt wie er war.
- **F48 Kampfszene**: Nahkampf, Löwengebrüll, Haftladung: Kamera fährt heran, Rand dunkel, Ziel in Getroffen-Pose mit Rückstoß, kurzer Stillstand und Rütteln, dann zurück. Optionen „Kampfszenen: an / kurz / aus“, Klick überspringt. Nicht umgesetzt: Szene beim Vernichten eines Trupps durch Beschuss (ich wollte Schießen schnell lassen) – sag, ob du das trotzdem willst.
- Hinweis Dateigröße: `index.html` ist durch die vielen Posenbilder jetzt **52,5 MB** (GitHub warnt ab 50 MB, die harte Grenze ist 100 MB). Noch kein Problem, aber Platz ist endlich.

### Paket D – erledigt
| Punkt | Ergebnis |
|---|---|
| F11 | „Fertig“ für alle Einheiten; abgehakt = grau, auch wenn noch die Zweitwaffe ginge |
| F17 | grau erst, wenn wirklich nichts mehr geht (zählt jetzt auch Zweitwaffe, Löwengebrüll, Eingraben, Schilde, Banner, Sperrfeuer, Draht); Hinweis „Zweitwaffe noch frei“ |
| F25 | Drehen-Knöpfe für alle Einheiten (außer niedergehalten/Panne) |
| F33 | Zeiger aus den Bogen-Symbolen je Fähigkeit über gültigem Ziel; ungültig = Verbotszeichen |
| F6 | Aufstellung: Einheitenkarte sichtbar, Startzustand per Knopf (Geschütz auf-/abgeprotzt, MG auf-/abgebaut) |
| F41 | Warnung 2 bzw. 1 Runde vor einem möglichen Sieg (Einblendung + Horn/Trommel, Punkte oben pulsieren) |
| KI-Einstellung | Optionen „KI: angriffslustig / ruhig“, Standard angriffslustig |

### F44 – Zwischenstand (gemischte Aufstellung, ohne Welle, Konkordat-Siegquote)
| Karte | heute (mit Welle) | ohne Welle | bisher beste Startarmee |
|---|---|---|---|
| Grauwall | 35 % | 63 % | +2 Grenadiere → 48 % |
| Selm | 47 % | 75 % | +1 Sturmtrupp → 53 % |
| Lerne | 89 % | 91 % | +3 Sturm +1 Brand → 41 % (Feinabstimmung läuft) |
| Front | 13 % | 21 % | Aschenwacht zu stark – Feinabstimmung läuft (weniger Grenadiere / mehr Kohorten) |
| Stein | 79 % | 81 % | +1 Sturmtrupp → 56 % |
| Waldflanke | 69 % | 82 % | +1 Sturmtrupp → 45 % (läuft) |
| Kasem | 53 % | 79 % | +1 Sturmtrupp → 63 % (läuft) |
| Kanal | 38 % | 63 % | ein Sturmtrupp schon zu viel (28 %) – läuft |
| Varn | 37 % | 49 % | ohne Zusatz 49 % |
Ein Sturmtrupp verschiebt bis zu 35 Punkte, deshalb stimme ich mit Grenadieren/Brandwerfern fein ab. Danach baue ich die Armeen ein (Welle weg) und melde die Endwerte.

### Fragen an Enrico
- F48: Soll auch das **Vernichten eines Trupps durch Beschuss** eine Kampfszene auslösen, oder bleibt Schießen schnell?


## 2026-11-20 21:55 – Paket B (Ton) erledigt, Paket C zum größten Teil, F44 läuft

**Commits:** `33038ac` Paket B · `ffdf027` Paket C Teil 1 · `5d5b382` Posen Sturmtrupps/Pioniere – gepusht.
**Bilder:** `entwurf/probe/spieltest4_paketC/` (Kanone/Hünen-Ablauf, Nahkampf mit Blut, Posen Sturm/Pionier)

### Paket B – Ton (alle Punkte erledigt)
| Punkt | Ergebnis |
|---|---|
| F4 | Schlachtmusik etwa −4 dB |
| F5 | Musik senkt sich weich auf 45 %, solange jemand spricht oder marschiert wird, dann wieder hoch |
| F8 | Den „Zug-Pfiff“ per Tonhöhenanalyse gefunden: das Wagenknarren unter dem Gespann hat einen Dauerton um 700 Hz. Entfernt; Hufe und Wiehern bleiben. |
| F9 | Konkordat-Marsch: Schritte vorn, Trommel leise darunter |
| F14 | Auf-/Abprotzen Aschenwacht: tiefer, mit Bass und Begrenzer (eigene Töne nur für die Aschenwacht) |
| F29 | Ursache: die Enfield-Aufnahme hat in den ersten 20 ms ein metallisches Klicken vor dem Knall. Abgeschnitten. |
| F30 | Waffenton fest je Seite und Einheitentyp; Ton-Pult nachgezogen |
| F32 | Eingraben nur noch 72199 (Graben mit Atmen); Spatenhiebe 96216 im Nahkampf der Infanterie |
| F35 | Schmerzensschreie auch bei MG-Treffern (gut die Hälfte der Treffer ab 4 Schaden), mit Stimmfilter der getroffenen Einheit |
| F39 | Reparieren klingt nach Werkstatt (Schraubenschlüssel, Ratsche), Nachladen nach Ladegeräusch |

### Paket C – Effekte, Animation, Kamera
| Punkt | Ergebnis |
|---|---|
| Schadenszahlen (dein Wunsch) | gelb unter 15, hellrot 15–29, kräftiges Rot und größer ab 30 (Anteil der vollen Stärke 100) |
| F16/F20/F47 | Mündungen aus den Bildern gemessen: Landkoloss-Kanone (Rohrende statt Sehschlitz), Sturmpanzer, Turmschreiter-MG, Säge-/Klauenschreiter, Löwenoger-Flinte. **Hünen:** schießen jetzt aus dem MG auf Hüfthöhe (eigener Punkt je Pose). Kanonen: Mündungsfeuer + Qualm, kein fliegendes Geschoss, Explosion am Ziel. Kreuzschreiter/Eisenknecht hatten schon gemessene Punkte. |
| F24 | Drehlauf-Salve etwa 1 s länger, zweiter Feuerstoß im Ton |
| F28 | Gewehrsalven über 2–3 s (je Figur 1–2 Schüsse, unregelmäßig), Schaden erst nach dem letzten Schuss; MG zwei Feuerstöße; Nahkampf als Folge von Hieben (Angriff 3–5, Gegenschlag 2–3 zusammen mit dem ersten) mit Klirren, Trefferbild, Spritzern. Bei ½× dauert ein Nahkampf etwa 6 s, bei 1× etwa 3 s. |
| F27 | Blut als gemalte Spritzer und Bodenflecken aus deinem Effektbogen (die Bodenflecken 4–6 waren bisher unbenutzt) statt runder Punkte; Flecken bleiben bis Schlachtende |
| F34 | Kamera weicher (sanft an-/auslaufend, mindestens 0,38 s) und neu auch zum Nahkampf; abschaltbar wie bisher |
| F39 | Zeichen: goldener Schraubenschlüssel (Reparieren/Bergen), Munitionskiste (Nachladen); grünes Kreuz nur noch Heilen |
| F40 | Zurückweichen/Rückzug: Kehrtwende-Pfeil statt Schweißtropfen (gezeichnet; ein gemaltes Bild kann später kommen) |
| Posen | **Sturmtrupps** (Grabenräumer, Sturmbrecher): Ausholen/Loslassen beim Granatwurf im Sturmangriff, Graben, Getroffen. **Pioniere** (beide): Draht schneiden, Haftladung, Mine, Graben, Getroffen. |
| F21 | **nicht gelöst** – im Code nicht eindeutig nachzustellen, siehe Frage |

**Noch offen in Paket C:** die übrigen Posenbögen (Hauptmann, Sanitäter, Flammen, Kampfanzüge, Versorgung, Schildwall, Schwer, Scharfschütze/Pirschjäger, Melder, Mineur – mit den Pflicht-Übermalungen) und **F48 Kampfszene**. Die mache ich als Nächstes.

### F44 – Stand
Die Abstimmung läuft (alle 9 Karten mit Welle, je 150 Schlachten, gemischte Aufstellung). Erster Befund: **Mit gemischter Aufstellung liegen die Karten schon heute weit auseinander** – Grauwall 35 %, Selm 47 %, Lerne 89 %, Front 13 % Konkordat. Auf dem Grauwall ist schon die halbe Welle von Anfang an zu stark (20 %). Ein Sturmtrupp mehr oder weniger verschiebt bis zu 40 Punkte. Ich suche je Karte die Menge, die am nächsten an 50 % liegt (auch „nur Welle weg“), und melde die Startarmeen.

### Fragen an Enrico
- **F21:** Bei welcher Einheit und welcher Deckung hast du den durchscheinenden Lebensbalken gesehen (Graben, Ruine, Wald)? War es beim eigenen Angriff (Maus auf dem Ziel) oder im Gegnerzug? Ein Bildschirmfoto hilft.
- **F44:** Wenn eine Karte auch ohne Welle und ohne Zusatzeinheiten weit weg von 50 % liegt (z. B. Lerne 89 %): darf ich dort auch die Startarmee des Konkordats anpassen?


## 2026-11-20 20:51 – Paket F (KI, Gegnerarmee): F43 erledigt, F44 Vorschlag – Entscheidung nötig

**Commits:** `968e0ae` F43 aktive KI (gepusht). Werkzeug neu: `tools/ki_aktiv.js` (misst Vorrücken, Angriffe, Rückzüge, Zielfelder; `HALTEN=1` = Gegner hält nur wie ein vorsichtiger Spieler).

### F43 – KI zu passiv: Ursache und Lösung
- **Ursache:** Die KI rechnet für jedes Feld die „Bedrohung“ zusammen – und zählt dabei jeden Gegner voll, der das Feld erreichen könnte, als würden alle zugleich auf diesen einen Trupp schießen. Vor einer gegnerischen Linie ergibt das −12 bis −19 Punkte, ein Feld Vorrücken bringt nur +0,8. Ergebnis: Die Aschenwacht blieb vor dem eigenen Graben stehen (Grauwall: vordere Trupps ab Runde 2 bei Spalte ~5,7 von ihrer Kante) und 23 % ihrer Züge gingen nach hinten.
- **Lösung (nur für die Seite, die gegen dich spielt):** Bedrohung über 1,5 zählt nur noch zu einem Drittel; muss die KI angreifen (du hältst mindestens so viele Fahnen oder führst), zählen Vorrücken und Fahnen ×1,5; gesunde Trupps (Stärke ab 50, nicht auf der Flucht) ziehen nicht mehr grundlos zurück.
- **Messung Grauwall:** vordere Trupps bis Spalte 8 statt 6,8; Rückzug 10 % statt 23 % der Züge; gegen einen Gegner, der ab Runde 5 nur noch hält, gewinnt die KI 28 von 30 Schlachten (vorher kaum Druck).
- **Warum nur die Computerseite:** Für beide KI-Seiten zugleich verschob es die Balance stark (Grauwall Konkordat 51 % → 16 %, Sankt Ruß 47 % → 70 %), weil dann auch die KI-Konkordat in die MG-Linie läuft. Die Balance-Simulation misst deshalb weiter mit gleich spielenden Seiten – **Balance unverändert** (geprüft: bitgleich mit vorher, Grauwall 59 %, Sankt Ruß 48 % bei 200 Schlachten).
- **Wichtig für deinen nächsten Spieltest:** Die KI ist jetzt deutlich stärker als vorher. Wenn sie dir zu hart wird, ist das ein Regler (drei Zahlen in `ai.js`, `AKTIV`).

### F44 – Gegnerarmee: Vorschlag (noch nichts gebaut)
Heute auf dem Grauwall: Aschenwacht startet mit 675 Punkten, in Runde 7 kommt eine Welle (3 Sturmtrupps, 2 Brandtrupps, 1 Geschütz = 450 Punkte) am Rand. Gemessen (200 Schlachten, KI gegen KI, Anteil Siege Konkordat):

| Variante | Konkordat |
|---|---|
| heute (Welle Runde 7) | 59 % |
| **A** ganze Welle von Anfang an in der Startarmee | 15 % (viel zu stark) |
| **A2** zwei Drittel der Welle von Anfang an | 68 % |
| **B** keine Welle, Nachschub-Einkommen 40 statt 10 je Runde | 82 % |
| **B2** keine Welle, Einkommen 60 | 76 % |

**Empfehlung: Variante A** – keine Welle mehr, dafür von Anfang an etwa drei Viertel der Welle in der Startarmee (z. B. 3 Sturm, 1 Brand, 1 Geschütz zusätzlich), über die ganze Breite verteilt; genaue Menge per Simulation auf ~50 %. Gründe: Du siehst den Gegner von Anfang an, nichts kommt überraschend; frühe Einheiten zählen viel mehr als späte (darum ist die volle Welle von Anfang an viel zu stark). Variante B wirkt kaum, weil die KI ihr Geld nur am Rand und ohne Plan ausgibt – das müsste ich erst verbessern. Gilt für alle Karten mit Welle (alle außer Sankt Ruß).

### Fragen an Enrico
- **F44:** Variante A (mehr Einheiten von Anfang an, ich stimme die Menge per Simulation ab) – einverstanden? Oder B (Nachschub über Fahnen wie bei dir; dann zuerst die Kauf-KI verbessern)?
- **F43:** Soll die aktive KI später als Einstellung „KI: ruhig / angriffslustig“ wählbar sein?

Weiter geht es jetzt mit Paket B (Ton); F44 setze ich nach deiner Entscheidung um.


## 2026-11-20 20:16 – Paket A (Fehler, Lesbarkeit, Menüs) erledigt

**Commits:** `eb75779` Postfach-Regel in CLAUDE.md · `678cd04` Paket A · `429d231` Auftrag + POSEN_PROMPTS.md (Enricos Dateien) – alles gepusht.
**Screenshots:** `entwurf/probe/spieltest4_paketA/`

| Punkt | Ergebnis |
|---|---|
| F12 Drahtschneiden | Ursache: (1) Nach jedem Schnitt wurde die ganze Geländewelt neu gebaut (0,4–0,6 s) → das Stocken. (2) Die „Kugeln“ waren alte Funken-Partikel, die in der neuen Ansicht als flache Farbkreise erscheinen. Jetzt: nur die Drahtstücke des Felds verschwinden (kein Neuaufbau, gilt auch für Niederwalzen/Zerschießen), dazu eine Staubwolke. Bild: `f12_draht_vorher_nachher.jpg`, `f12_staub_statt_kugeln.jpg` |
| F1 | Bildwirkung startet auf „stark“ (auch bei dir, die alte Einstellung wird nicht übernommen) |
| F2 | Menü im Spiel: „Zurück zum Spiel“ oben, „Beenden“ unten; Beenden fragt einmal („Wirklich beenden?“), dann Startbildschirm. `f2_spielmenue.jpg` |
| F3 + F7 | Tooltips, Pergament-Details, Nachschub, Armee-Auswahl: Schrift 16–21 px statt 12–14, dunkle Tinte. 21 lange Einheitentexte gekürzt (Ø 234 → 195 Zeichen). 1280 px geprüft (Namen umbrechen, nichts überlappt). `f3_*.jpg` |
| F19 | Fähigkeitsknöpfe zeigten bisher die ganze Einheitenbeschreibung. Jetzt eigener Kurztext je Fähigkeit, Zahlen direkt aus den Regeln. Abweichung gefunden: „Draht schneiden – danach noch Angriff“ stimmte nicht (es kostet die Aktion); Text korrigiert. Haftladung: 50 % Panne bei Kolossen fehlte im Text. |
| F42 | Auswertung: Werte hell auf den dunklen Kacheln, Fragen dunkel auf dem Pergament, größer. `f42_*.jpg` |
| F10 | Geländehinweis beim Ziehen kleiner |
| F15 | Optionen → „Meldungen: Text / Symbole / aus“. Schadenszahlen, Punkte, „fällt“, „aufgerieben“, große Befehle bleiben immer. |
| F18 | Lautsprecher bei Ton aus rot durchgestrichen, kurzer Hinweis; neu: Taste M |
| F22 / F23 | Niedergehalten: kleine dunkle Plakette, kein Leuchtkreis. Zahnrad (Panne) heller, deckend, dunkle Kontur. `f22_f23_marken.jpg` |
| F13 | „Runde beenden“ pulsiert langsam, wenn alle Einheiten fertig/abgehakt sind |

**Tests:** Partietest 4 Runden ohne Konsolenfehler; Draht Bild = Regel ok. `test_draht.js` meldet einen Fehler (Straßenbau Zeile 504) – der war schon vor Paket A da, nicht von mir; schaue ich mir bei Gelegenheit an. Keine Regeländerung → keine Simulation nötig.

**Offen / Hinweise:** Gegenüber der Liste nicht verändert: die Kurztexte der Schlagwort-Chips (z. B. „Draht schneiden (Nachbarfeld, 1 Punkt)“ – „Punkt“ ist noch die alte Sprache); nehme ich mit, wenn F17/F11 die Bedienung umbauen.

### Fragen an Enrico
- F15: Reichen „Text / Symbole / aus“ so, oder sollen Schadenszahlen auch abschaltbar sein?
- F3/F7: Ist die neue Schriftgröße so richtig, oder noch größer (bei 1280 px wird es dann eng)?


