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

- Nachschub: 1 Punkt pro Runde, 2 je geschlagener Einheit, dazu die Punkte eroberter Zielfelder. Dafür kommen neue Einheiten an den eigenen Rand.
- Zusätzliche Einheiten im Nachschub: Feldscher/Aschenpfleger (versorgen Nachbarn), Grabenmörser/Minenwerfer.
- Geschütze können aufprotzen (4 Felder Zug, kein Feuer) und wieder abprotzen. Das Schussfeld wird rot angezeigt.
- Aktionsmarken an jeder eigenen Einheit: grüner Pfeil = kann ziehen, rote Raute = kann angreifen.

Simulation, 150 Schlachten KI gegen KI (beide kaufen Nachschub): Konkordat 28 %, Aschenwacht 31 %, unentschieden 41 %.
Sieg des Konkordats ab 5 Punkten aus den Zielfeldern, Unentschieden bei 4.

## Aufbau

- `src/engine.js` Spiellogik und Schlachtdaten, läuft auch ohne Browser in Node
- `src/ai.js` KI, `src/figures.js` Comic-Figuren, `src/ui.js` Oberfläche, `src/index.html` Seite und Stil
- `python3 tools/build.py` baut daraus die Einzeldatei `index.html`
- `node tools/sim.js 200` lässt die KI 200-mal gegen sich selbst spielen
