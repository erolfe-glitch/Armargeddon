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

## Entscheidungen – Gelände-Gefahren (2026-11-16, umgesetzt)

- **Stacheldraht:** Betreten kostet ca. 10 Stärke (Blut + Zahl). Gepanzerte Infanterie (Stahlgänger, Panzerknechte, Schwere Grabenwacht, Kettenritter) unverletzt, Draht hält sie nicht auf. Kolosse walzen ihn wie bisher.
- **Giftgas:** Nach der Wolke 2 Runden vergiftet (½, dann ¼ des Gasschadens), grünlich umrandetes Gas-Symbol. Feldscher und Aschenpfleger heilen die Vergiftung. Gasschutz-Trupp (mit Nachbarn) und Kolosse immun.
- **Artillerie-Sperrfeuer:** 2 Runden Abklingzeit, Sanduhr am Knopf.
- KI meidet Draht und Gas stärker.
