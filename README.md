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

- **Konkordat von Valmor** greift von links an: Schützenkohorten und Mahlwerk-Trupps (MG).
- **Aschenwacht des Grauwalls** verteidigt rechts: Aschengrenadiere und Sensenwerk-Trupps (MG).
- Zielfelder: Ruinen von Veskar, Grauwall-Schanze, Totholz von Ilm, Brücke von Marn (9 Punkte, Sieg ab 5).

## Stand: Stufe 1

Infanterie, MG mit Reaktionsfeuer, Niederhalten durch Beschuss, Gräben, Stacheldraht (schneiden möglich),
Trichter, Schlamm, Ruinen, Totholz, Höhenrücken, Kanal mit Brücke, Blickrichtung mit Flanke und Rücken,
Moral, Zurückweichen, Flucht, Offiziere mit Banner.

Simulation, 200 Schlachten KI gegen KI: Konkordat 22 %, Aschenwacht 52 %, unentschieden 27 %.
Der Angriff ohne Panzer und Artillerie ist bewusst schwer, wie 1915–1917.

Geplant: 2. Artillerie mit Sperrfeuer · 3. Panzer und Kavallerie · 4. Gas, Stoßtrupps, Flammenwerfer, Phase 2 · 5. Grafik, Effekte, Lernteile.

## Aufbau

- `src/engine.js` Spiellogik und Schlachtdaten, läuft auch ohne Browser in Node
- `src/ai.js` KI, `src/sprites.js` Pixel-Figuren, `src/ui.js` Oberfläche, `src/index.html` Seite und Stil
- `python3 tools/build.py` baut daraus die Einzeldatei `index.html`
- `node tools/sim.js 200` lässt die KI 200-mal gegen sich selbst spielen
