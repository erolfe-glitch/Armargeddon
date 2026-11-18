# Einheiten-Durchsicht

Ziel: Jeder Trupp bekommt eine klare Aufgabe. Doppelte Rollen werden zusammengelegt oder gestrichen.
Bilder werden nur noch für Einheiten gemalt, die bleiben.

**Stand 2026-11-18:** 50 Einheiten (25 je Seite, `E.ROSTER`). Alle haben einen Figurenbogen im neuen Stil (`FIGMAP` in ui.js, Bögen in `src/figs.js`). Die Blaue Legion (zweites Bilderset des Konkordats, gleiche Werte) zeigt weiter die alten Bilder aus `art.js`.
(KM) = nur mit dem Startmenü-Schalter „Kampfmaschinen“. Kosten in Klammern (aus `costParts`, Stand nach der zweiten Kostenrunde).

## Einheiten nach Rolle

| Rolle | Konkordat (A) | Aschenwacht (D) |
|---|---|---|
| Führung | Hauptmann (45), General (70, Pflicht) | Hauptmann (45), General (70, Pflicht), Bannerträger (40) |
| Befehle / Beobachter | Meldegänger mit Hund (20), Fernsprechtrupp (20, Feuerschlag), Ballonbeobachter (20, Ziel markieren) | Signaltrupp (15, Ziel markieren) |
| Linieninfanterie | Schützenkohorte (40) | Aschengrenadiere (30) |
| Sturm / Nahkampf | Grabenräumer (50, Draht schneiden) | Sturmbrecher (100, Draht schneiden), Eingreiftrupp (100) |
| Gepanzerte Infanterie | Stahlgänger-Trupp (65, KM, Sturmlauf) | Panzerknechte (65, KM, Sturmlauf) |
| Schild / schwer | Schildwall (35, Schilde vor) | Schwere Grabenwacht (35, Schilde vor) |
| Scharfschützen | Scharfschütze (45) | Pirschjäger (60) |
| Maschinengewehr | Mahlwerk-Trupp (35) | Sensenwerk-Trupp (40) |
| Artillerie | Donnerrohr-Batterie (50, mittel), **Feldkanone (40, leichte Artillerie, direkter Schuss)**, Grabenmörser (25) | Grabengeschütz (60, mittel, direkter Schuss), Minenwerfer (25) |
| Werfer / Panzerabwehr | Flammentrupp (40), Rauchwerfer-Trupp (25, Nebelwand) | Brandwerfer (45), Panzerbüchsen-Trupp (50) |
| Pioniere / Technik | Graben-Pioniere (45, Haftladung, Draht schneiden), Mineure (30, Stollen), Versorgungstrupp (40) | Drahtpioniere (35, Draht oder Minen, Draht schneiden), Gasschutz-Trupp (30), Versorgungstrupp (40) |
| Sanitäter | Feldscher (20) | Aschenpfleger (20) |
| Reiter | Lanzenreiter (30) | Sprenglanzen-Reiter (25) |
| Fahrzeuge | Landkoloss (70, Seiten-MG) | Sturmpanzer (90, Breitseite) |
| Kampfmaschinen (KM) | Turmschreiter (70, Turm-MG), Ordensschreiter (75), Kreuzschreiter (80, Löwenmaul-Kanone) | Bohrkoloss (160, Flammenstoß), Eisenknecht (150), Sägeschreiter (105), Klauenschreiter (105) |

Gestrichen seit der Durchsicht: Radfahrer-Trupp, Scheinwerfer-Trupp (Gruppe 1), Grabenkämpfer, Kettenritter, Schildträger (Gruppe 3), Granatwerfer-Trupp (Gruppe 4), Sprengtrupp, Minenleger (Gruppe 5). Werkstatt-Trupp und Munitionsträger heißen jetzt beide „Versorgungstrupp“.

Offen für später (IDEEN.md): leichte Artillerie für die Aschenwacht als Gegenstück zur Feldkanone, schwere Artillerie für beide Seiten, zweites Fahrzeug für das Konkordat.

## Wünsche und Beobachtungen (Enrico)

- **Aufklärer doppeln sich** (z. B. Ballon und Fernsprechtrupp: beide sehen weit und lenken Artillerie) und haben im Spiel oft nichts zu tun.
- **MG-Sperrfeuer aktiv befehlen:** Das MG soll nicht mehr von selbst feuern. Man gibt ihm den Befehl „Sperrfeuer", wenn es das darf. Hat es sich zu viel bewegt, beendet man es mit dem Häkchen „Erledigt".

## Wie es im Code war (Stand vor Gruppe 1, 2026-11-16 – überholt, nur zur Nachvollziehbarkeit)

- MG (aufgebaut) schießt einmal pro gegnerischer Runde **von selbst** auf den ersten Gegner, der sich in seinem Schussfeld über offenes Gelände bewegt.
- Andere Fernkämpfer (Reichweite ≥ 2) haben den Befehl **„Feuerbereitschaft"**: kostet alle Punkte, nur ohne Bewegung und ohne Angriff, schießt einmal mit Schaden ×0,8. MG sind davon ausgenommen.
- „Lenkt Artillerie" (keine Streuung, Sprenggranaten ×1,25): Fernsprechtrupp, Ballonbeobachter, Signaltrupp.
- Meldegänger: Befehl überbringen. Radfahrer: schnelle Infanterie, Schuss 2.

## Entscheidungen – Gruppe 1: MG und Aufklärer (2026-11-16)

- **MG-Sperrfeuer:** Kein automatisches Feuer mehr. Neuer Befehl „Sperrfeuer" (MG aufgebaut, in dieser Runde nicht bewegt und nicht geschossen, kostet die restlichen Punkte). Im gegnerischen Zug bis zu **2 Schüsse** auf Gegner, die sich im Schussfeld bewegen. Sonst Häkchen „Erledigt".
- **Ballonbeobachter** (Konkordat) und **Signaltrupp** (Aschenwacht) = die Beobachter. Neuer Befehl **„Ziel markieren"**: ein Feld in Sicht markieren; dort trifft Artillerie ohne Streuung und stärker, versteckte Gegner und Minen im Feld und daneben werden aufgedeckt.
- **Fernsprechtrupp:** neue Aufgabe **„Feuerschlag anfordern"** – alle 3 Runden ein Artillerieschlag von außerhalb der Karte auf ein Feld in Sicht, mit etwas Streuung.
- **Gestrichen:** Radfahrer-Trupp, Scheinwerfer-Trupp.
- Meldegänger mit Hund: bleibt (Befehl überbringen) – wird mit der Gruppe „Führung" besprochen.

## Wünsche: Gelände-Gefahren und Effekte (2026-11-16)

- **Ziel markieren – Effekt (später):** z. B. ein Leuchtgeschoss ins Zielfeld oder ein kurzes Aufblitzen am Ballon (Fernrohr-Glanz). Gestaltung kommt später.
- **Artillerie-Sperrfeuer:** bekommt eine Abklingzeit.
- **Stacheldraht:** macht den meisten Einheiten beim Betreten leichten Schaden, mit Bluteffekt. Gepanzerte Einheiten kommen besser durch.
- **Giftgas:** Giftschaden, der nach dem Verlassen der Wolke noch weiter runtertickt. Geschützte Einheiten (z. B. Gasschutz-Trupp) sind davon nicht betroffen.

Jetzt im Code: Draht macht keinen Schaden (beendet nur die Bewegung, Abwehr ×0,6). Gas schadet nur, solange man in der Wolke steht. Sperrfeuer hat keine Abklingzeit.

## Entscheidungen – Gruppe 2: Führung (2026-11-16)

- **Hauptmann:** Befehle je Seite eigen. Beide: „Sammeln". Konkordat zusätzlich **„Feuer frei"** (Fernkampf +25 %), Aschenwacht **„Sturmbefehl"** (Nahkampf +25 %). Reichweite 2, je 2 Runden Pause wie bisher.
- **General:** normale Befehle wie bisher (jede Runde, 3 Felder) plus **ein großer Befehl einmal pro Schlacht**: Konkordat **„Halten um jeden Preis"** (eine Runde lang keine Flucht, Abwehr +25 % für alle eigenen Einheiten), Aschenwacht **„Generalangriff"** (alle eigenen Einheiten +1 Aktionspunkt).
- **Bannerträger:** neuer Befehl **„Banner aufpflanzen"** (1 Punkt): bleibt stehen, Wirkung auf 3 Felder, Einheiten darin fliehen nicht. Aufnehmen kostet wieder 1 Punkt.
- **Meldegänger mit Hund:** bleibt wie er ist.

## Gruppe 2: Führung (2026-11-16, umgesetzt)
- **Hauptmann:** Befehle je Seite. Beide „Sammeln“. Konkordat „Feuer frei“ (eigene Einheiten bis 2 Felder: Fernkampf ×1,25 bis zu ihrem nächsten Zug), Aschenwacht „Sturmbefehl“ (Nahkampf ×1,25). Reichweite und Pausen wie bisher.
- **General:** Befehle seiner Seite jede Runde, 3 Felder. Einmal je Schlacht großer Befehl für alle eigenen Einheiten: Konkordat „Halten um jeden Preis“ (bis zum nächsten eigenen Zug keine Flucht, Abwehr ×1,25), Aschenwacht „Generalangriff“ (sofort +1 Aktionspunkt). Eigener Knopf, danach grau „verbraucht“; Ansage mit Pfeife bzw. Horn. KI frühestens ab Runde 3, nur wenn es zählt.
- **Bannerträger:** „Banner aufpflanzen“ (1 Punkt): Träger zieht nicht, Wirkung 3 statt 2 Felder, dort flieht niemand. „Banner aufnehmen“ (1 Punkt). Banner im Boden neben der Figur, Bereich golden, wenn gewählt.
- **Meldegänger:** unverändert.

## Gruppe 3: Infanterie und Sturm (2026-11-17, umgesetzt)
- **Gestrichen:** Grabenkämpfer, Kettenritter (keine Karte nutzte sie fest).
- **Schildträger + Schwere Grabenwacht → „Schwere Grabenwacht“:** Werte wie der Schildwall (Angriff 4, Abwehr 6, Moral 8, 2 Felder, nur Nahkampf), Bild aschenwacht_schwer, Draht stoppt sie nicht.
- **Eingraben** (Schützenkohorte, Aschengrenadiere, 1 Punkt): nur offenes Gelände oder Trichter, Abwehr ×1,3, bis die Einheit zieht; kleiner Erdwall vor der Figur.
- **Schilde vor** (Schildwall, Schwere Grabenwacht, 1 Punkt): eigene Nachbarn bis zum nächsten eigenen Zug Beschuss ×0,75; Nachbarfelder stahlgrau umrandet.
- **Sturmlauf** (Stahlgänger, Panzerknechte, alle Punkte): bis 4 Felder geradeaus, Draht hält nicht auf, Sperrfeuer/Feuerbereitschaft unterwegs wie sonst, am Ende sofort Nahkampf gegen den schwächsten Gegner daneben.
- Neuer Ton beim Betreten von Stacheldraht: `latch-metallic` (Platz `drahtlatch`).

## Entscheidungen – Gruppe 4: Artillerie und Werfer (2026-11-17)
- **Gestrichen:** Feldkanone, Granatwerfer-Trupp. *(Nachtrag: Die Feldkanone wurde doch nicht gestrichen, sie bleibt als leichte Artillerie des Konkordats; siehe „umgesetzt“ unten.)*
- **Donnerrohr-Batterie:** bekommt den direkten Schuss bis 3 Felder (×2,5 gegen Kolosse/Kampfmaschinen) wie das Grabengeschütz. Beide Seiten haben damit je ein schweres Geschütz und einen Werfer.
- **Grabenmörser (Konkordat):** leicht, darf in derselben Runde ziehen und feuern (wie bisher).
- **Minenwerfer (Aschenwacht):** schwere Mine ×1,5 Schaden, zerstört Draht und Barrikaden im Zielfeld, darf aber nicht in derselben Runde ziehen und feuern.
- **Flammentrupp / Brandwerfer:** Zielfeld brennt bis zum nächsten eigenen Zug: Feuerschaden für alle, die dort stehen oder hineinziehen; Draht im Feld verbrennt.
- **Unverändert:** Rauchwerfer-Trupp, Panzerbüchsen-Trupp, Grabengeschütz.

## Gruppe 4: Artillerie und Werfer (2026-11-17, umgesetzt)
- **Gestrichen:** Granatwerfer-Trupp (keine Karte nutzte ihn fest).
- **Stufen im Tooltip:** Grabenmörser und Minenwerfer = Mörser, Feldkanone = leichte Artillerie (unverändert), Donnerrohr = mittlere Artillerie ohne direkten Schuss, Grabengeschütz = mittlere Artillerie mit direktem Schuss (vorerst).
- **Minenwerfer:** Sprenggranaten ×1,5, zerstört Draht und Barrikaden im Zielfeld, ziehen oder feuern (nicht beides).
- **Flammentrupp, Brandwerfer:** Zielfeld brennt bis zum nächsten eigenen Zug; wer dort steht (zu Beginn seines Zugs) oder hineinzieht, nimmt Feuerschaden (wie Draht, Kolosse halb); Draht verbrennt. Glut und kleine Flammen, leise Feuer-Schleife. KI meidet brennende Felder.

## Entscheidungen – Gruppe 5: Pioniere und Technik (2026-11-17)
- **Sprengtrupp → in Graben-Pioniere:** Graben-Pioniere bekommen die Haftladung (2 Punkte, alle 2 Runden; schwerer Schaden, doppelt gegen Kolosse, sprengt Bunker/Barrikaden, zerreißt Draht). Sprengtrupp entfällt.
- **Minenleger → in Drahtpioniere:** Drahtpioniere können Draht ziehen ODER eine Mine legen (3 Minen je Trupp). Minenleger entfällt.
- **Versorgungstrupp je Seite:** Werkstatt-Trupp (Konkordat) und Munitionsträger (Aschenwacht) werden zu Versorgungstrupps mit beiden Aufgaben: Kolosse/Kampfmaschinen reparieren und bergen sowie MG/Geschütz nachladen.
- **Unverändert:** Mineure (Konkordat), Gasschutz-Trupp (Aschenwacht) – je Seite ein eigener Spezialist.

## Gruppe 6: Fahrzeuge und Reiter der Aschenwacht (2026-11-17, umgesetzt)
- **Sturmpanzer** (neu, Aschenwacht, Bild aschenwacht_panzer): Werte und Kosten (80) wie der Landkoloss. **Breitseite:** in einer Runde zwei Schüsse auf zwei verschiedene Ziele bis 2 Felder, jeder ×0,6. Im Nachschub und bei der KI (zweiter Schuss auf das schwächste Ziel).
- **Sprenglanzen-Reiter** (neu, Aschenwacht, Bild aschenwacht_reiter): Werte und Kosten (30) wie der Lanzenreiter. Der erste Nahkampf der Schlacht mit der Sprenglanze ×1,5 (kleine Explosion), danach normale Lanze. Zustandsmarke im Panel: „Sprenglanze bereit“ bzw. „verbraucht“.
- **Schreiter:** unverändert.
- **Anführer** (Hauptmann, General beider Seiten) zeigen überall ihre eigenen Bögen.
- **Nachschub-Liste:** Name, Preis und Text überlappen nicht mehr; Porträts größer (96 px) und heller.
- Sim (200, Grauwall, Standardarmee): vorher Konkordat 26 % / Aschenwacht 75 %, nachher 26 % / 74 %, Dauer 14,3 Runden; die neuen Einheiten kommen nur über den Nachschub ins Spiel.

## Gruppe 5: Pioniere und Technik (2026-11-17, umgesetzt)
- **Sprengtrupp gestrichen:** Graben-Pioniere haben die Haftladung (2 ●, alle 2 Runden, Nachbarfeld; schwerer Schaden, doppelt gegen Kolosse und Kampfmaschinen, Bunkerschutz zählt nicht, Bunker/Barrikaden → Trichter, Draht zerrissen). Draht schneiden und Bergen bleiben. Kosten 40 → 55.
- **Minenleger gestrichen:** Drahtpioniere legen statt Draht eine Mine (1 ●, freies Nachbarfeld, 3 Minen je Trupp, Regeln wie beim Minenleger). Je Runde entweder Draht oder eine Mine, danach kein Angriff. Kosten 35 → 55.
- **Versorgungstrupp** (Werkstatt-Trupp und Munitionsträger, je Seite eigenes Bild): reparieren/bergen ODER nachladen, je Runde eine der beiden Aufgaben (u.task). Werte für beide gleich (Angriff 2, Abwehr 2, Moral 6, 3 Felder), Kosten 45.
- Mineure und Gasschutz-Trupp unverändert. Behoben: gekaufte Trupps mit Minen hatten bisher keine Minen.
- Sim (200, Grauwall, Standardarmee): vorher Konkordat 26 % / Aschenwacht 74 %, nachher 24 % / 76 %, Dauer 14,3 Runden (Standardarmee ohne die gestrichenen Einheiten; Unterschied im Rahmen des Zufalls).
