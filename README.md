# Armargeddon – Die Schlacht am Grauwall

Rundenbasiertes Hexfeld-Strategiespiel im Grabenkrieg. Eigene düstere Welt (Grimdark), aber Waffen,
Gelände und Taktik entsprechen dem Ersten Weltkrieg 1914–1918. Jede Einheit und jedes Geländefeld
erklärt, wie es im echten Krieg war. Gedacht auch für den Geschichtsunterricht.

## Spielen

- `index.html` öffnen (Doppelklick). Keine Installation, kein Konto, läuft offline.
- Online über GitHub Pages, sobald es für dieses Repo eingeschaltet ist.
- PC, Handy (quer am besten) und Touch-Digitalboard.
- Modi: als Konkordat (Angriff) gegen KI, als Aschenwacht (Verteidigung) gegen KI, 2 Spieler an einem Gerät.

## Die Welt

- **Konkordat von Valmor** greift von links an: Schützenkohorten, Mahlwerk-Trupps (MG), Donnerrohr-Batterien, Landkolosse, Lanzenreiter.
- **Aschenwacht des Grauwalls** verteidigt rechts: Aschengrenadiere, Sensenwerk-Trupps (MG), Grabengeschütze, später Sturmbrecher und Brandwerfer.
- Zielfelder: Ruinen von Veskar, Grauwall-Schanze, Totholz von Ilm, Brücke von Marn (9 Punkte, Sieg ab 5).

## Stand

Alle geplanten Stufen sind spielbar:

- Infanterie, MG mit Reaktionsfeuer, Niederhalten durch Beschuss
- Artillerie mit Sprenggranaten, Sperrfeuer und Gas (Wolken treiben mit dem Wind)
- Landkolosse (Panzer): immun gegen Gewehr und MG, walzen Draht nieder, Pannen
- Lanzenreiter mit Ansturm
- Ab Runde 8 Gegenstoß der Aschenwacht: Sturmbrecher (Stoßtrupps) und Brandwerfer (Flammenwerfer)
- Gräben, Stacheldraht, Trichter, Schlamm, Ruinen, Totholz, Höhenrücken, Kanal mit Brücke
- Blickrichtung mit Flanke und Rücken, Moral, Zurückweichen, Flucht, Offiziere
- Comic-Grafik mit Einheitenbild, Werteleiste unten, Lerntexte „Im echten Krieg“

Simulation, 200 Schlachten KI gegen KI: Konkordat 36 %, Aschenwacht 40 %, unentschieden 25 %, Dauer Ø 15,8 Runden.
Ohne Landkolosse und Artillerie gewinnt das Konkordat nie (0 von 100).

## Aufbau

- `src/engine.js` Spiellogik und Schlachtdaten, läuft auch ohne Browser in Node
- `src/ai.js` KI, `src/figures.js` Comic-Figuren, `src/ui.js` Oberfläche, `src/index.html` Seite und Stil
- `python3 tools/build.py` baut daraus die Einzeldatei `index.html`
- `node tools/sim.js 200` lässt die KI 200-mal gegen sich selbst spielen
