# Hinweise für die Weiterarbeit

- Sprache im Spiel und in Texten: Deutsch. Sachlicher Ton, Krieg nicht verherrlichen, Blut dezent und abschaltbar.
- Eigene Welt, keine fremden Marken oder Figuren (kein Warhammer o. ä.). Jede Einheit hat einen Text „Im echten Krieg“ mit belegbaren Fakten zum Ersten Weltkrieg.
- Nur in `src/` ändern, danach `python3 tools/build.py`. Die Datei `index.html` im Hauptordner ist erzeugt und muss mit eingecheckt werden (GitHub Pages).
- Nach jeder Regeländerung `node tools/sim.js 200` laufen lassen und Siegquote, Dauer und Verluste je Typ berichten.
- Vor „fertig“ im Browser testen (Playwright), PC quer, Handy quer und hoch.
- Stufenplan: 1 Infanterie/MG/Gräben/Draht (fertig) · 2 Artillerie und Sperrfeuer · 3 Panzer („Landkolosse“) und Kavallerie · 4 Gas, Stoßtrupps, Flammenwerfer, Phase 2 · 5 Grafik, Effekte, Lernteile.
