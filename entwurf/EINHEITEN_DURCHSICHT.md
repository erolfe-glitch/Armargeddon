# Einheiten-Durchsicht

Ziel: Jeder Trupp bekommt eine klare Aufgabe. Doppelte Rollen werden zusammengelegt oder gestrichen.
Bilder werden nur noch für Einheiten gemalt, die bleiben.

Stand: 56 Einheiten (28 je Seite). Bild ✓ = Figurenbogen im neuen Stil vorhanden, – = fehlt.

## Einheiten nach Rolle

| Rolle | Konkordat (A) | Aschenwacht (D) |
|---|---|---|
| Führung | Hauptmann ✓, General ✓ | Hauptmann ✓, General ✓, Bannerträger ✓ |
| Aufklärung / Befehle | Meldegänger mit Hund ✓, Fernsprechtrupp –, Ballonbeobachter –, Radfahrer-Trupp – | Signaltrupp –, Scheinwerfer-Trupp – |
| Linieninfanterie | Schützenkohorte ✓ | Aschengrenadiere ✓ |
| Sturm / Nahkampf | Grabenräumer ✓ | Sturmbrecher ✓, Grabenkämpfer –, Eingreiftrupp –, Kettenritter – |
| Gepanzerte Infanterie | Stahlgänger-Trupp – | Panzerknechte – |
| Schild / schwer | Schildwall ✓ | Schildträger –, Schwere Grabenwacht ✓ |
| Scharfschützen | Scharfschütze ✓ | Pirschjäger ✓ |
| Maschinengewehr | Mahlwerk-Trupp ✓ | Sensenwerk-Trupp ✓ |
| Artillerie | Donnerrohr-Batterie ✓, Feldkanone ?, Grabenmörser ✓ | Grabengeschütz ✓, Minenwerfer ✓ |
| Werfer | Flammentrupp ✓, Granatwerfer –, Rauchwerfer ✓ | Brandwerfer ✓, Panzerbüchsen-Trupp ✓ |
| Pioniere / Technik | Graben-Pioniere ✓, Mineure –, Sprengtrupp –, Werkstatt-Trupp – | Drahtpioniere ✓, Minenleger –, Gasschutz-Trupp –, Munitionsträger – |
| Sanitäter | Feldscher ✓ | Aschenpfleger ✓ |
| Reiter | Lanzenreiter ✓ | (Bild Aschenwacht-Reiter vorhanden, keine Einheit) |
| Kampfmaschinen | Landkoloss ✓, Turmschreiter –, Ordensschreiter –, Kreuzschreiter – | Bohrkoloss ✓, Eisenknecht –, Sägeschreiter –, Klauenschreiter – (Bild Sturmpanzer vorhanden, keine Einheit) |

## Wünsche und Beobachtungen (Enrico)

- **Aufklärer doppeln sich** (z. B. Ballon und Fernsprechtrupp: beide sehen weit und lenken Artillerie) und haben im Spiel oft nichts zu tun.
- **MG-Sperrfeuer aktiv befehlen:** Das MG soll nicht mehr von selbst feuern. Man gibt ihm den Befehl „Sperrfeuer", wenn es das darf. Hat es sich zu viel bewegt, beendet man es mit dem Häkchen „Erledigt".

## Wie es jetzt im Code ist

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
