# Armargeddon – Ideen für später

Sammelstelle für Ideen, die nicht sofort umgesetzt werden. Neue Ideen kommen hier hinein (kurz, mit Datum), erledigte werden gestrichen oder mit Verweis auf den Commit abgehakt.

## Offen

- **Schussfeld-Anzeige** (2026-11-15): erst nach Klick auf „Schießen“ zeigen oder immer bei Auswahl? Später ausprobieren.
- Ordner Units/Russia ansehen (aus CLAUDE.md übernommen).
- Bildkarten 1, 4, 7, 8 des Nutzers verbauen (aus CLAUDE.md übernommen).
- Kartenbeschreibungen (`desc`) an den Siegpunkt-Modus anpassen (aus CLAUDE.md übernommen).

- Optional: feine helle Umrandung um Figuren als Schalter in den Optionen (2026-11-16, noch nicht bauen).

## Gesamtplan (Stand 2026-11-16)

Erledigt: Etappe 1 UI-Feinschliff, Etappe 2 Übersicht auf dem Feld, Etappe 3 Kamera und Spielgefühl, Etappe 4a UI-Flächen gekachelt.

- ~~**Etappe 4a – UI-Flächen scharf:**~~ erledigt (Commit 0250727): kachelbare Texturen, Rahmen und Ecken per 9-Slice.
- **Vor Etappe 4b – Darstellung klären (als Nächstes, 2026-11-16).** Etappe 4b ist angehalten, bis das geklärt ist:
  - Kamerawinkel kippen: mehr Tiefe, nicht senkrecht von oben; Karte deutlich größer.
  - Einheiten aus mehreren kleinen Einzelfiguren statt einem Gruppenbild (z. B. 4–6 Figuren je Trupp, Verluste lassen Figuren wegfallen).
  - Panzer eher seitlich nach rechts ausgerichtet statt stark schräg.
  - Gelände-Tiles und Props plastischer.
  - **Nächster Schritt:** Probebild mit vorhandenen Bildern (gekipptes Hexraster, größere Karte, Trupps aus Einzelfiguren), bevor neu gemalt wird.
- **Festlegungen neue Grafik-Richtung (2026-11-16):**
  - Einheitenstil: Comic-Tinte wie `ui-quelle/konzept/einzel_konzept.png`, düster-gotischer Grabenkrieg (Richtung Trench Crusade, aber eigene Welt, nichts übernehmen).
  - Trupps aus mehreren Einzelfiguren (4 Posen je Figurentyp), Verluste lassen Figuren wegfallen; dazu Einzelmodelle (Helden, Mechs, Panzer).
  - Erst nur Konkordat und Aschenwacht neu; Blaue Legion und Russland später; noch später eine dämonische Gegnerseite (Menschen dann verbündet, Koop).
  - Gekipptes Hexraster mit mehr Tiefe, größere Karten.
  - Probebild dazu: Testseite `entwurf/probe/` (nicht im Spiel), Figuren aus `ui-quelle/figuren/`.
- **Gewählt (2026-11-16, Probebild Variante D, `entwurf/probe/?v=D`):**
  - Kamera: perspektivisch gekippt, ca. 38–40° Blick nach unten (Probe: 39°), hinten kleiner; vorn ca. 8–9 Felder über die Bildbreite (1920 px). Herausgezoomt muss die ganze Karte ins Bild passen (`?v=D&ganz=1`); dabei bleibt oben viel Leerraum, im Spiel deshalb beim Herauszoomen steiler kippen oder Himmel bzw. Hinterland zeigen.
  - **Maßstab verbindlich (2026-11-16, auch in STYLE.md):** stehender Soldat **0,8 Feldradien** (Trupps, Hauptmann); MG und Geschütz 1,2× im Verhältnis; Panzer und Kolosse 1,5 Soldatenhöhen, höchstens 2,4 Feldradien breit, Ketten etwas Richtung Betrachter auf dem Feldboden, belegen ein Feld. Gegen das Schweben: Kontaktschatten unter den Füßen, Ringe kleiner und dezenter.
  - Trupps: 4 Figuren je Trupp in lockerer Formation, Füße alle im eigenen Feld; Verluste lassen Figuren wegfallen.
  - Figurenbögen: Blickwinkel genau wie bei `konkordat_soldat.png` / `aschenwacht_soldat.png`, nicht steiler (Einheitlichkeit geht vor). Prompts für die erste Lieferung: `entwurf/GEMINI_PROMPTS.md`.
  - Umbau im Spiel hinter dem Schalter „Neue Ansicht (Test)“: Schritt 0 (Schalter, Ansichts-Abschnitt in ui.js) und Schritt 1 (Kamera und Boden: Weltbild flach, perspektivisch projiziert, Einheiten als Aufsteller, Klicks/Ziehen/Zoom/Kamera-Folgen) erledigt 2026-11-16; Schritt 3 (Figuren: Trupps zu viert, Einzelmodelle, Zuordnung FIGMAP in ui.js) erledigt 2026-11-16, vor Schritt 2; Schritt 2 (Zielfahnen, Symbole, Klammern, Vorschau, Rauch, Gas, Effekte aufrecht) erledigt 2026-11-16; weiter mit 4 Aufsteller (Gelände in zwei Ebenen, Höhenfelder mit Böschung), 5 Feinschliff.
  - Gelände muss für diesen Winkel neu gemalt werden: plastisch, Draht, Trichter und Gräben mit Tiefe (Seitenwände, Schatten, Pfähle stehen hoch). Das heutige Gelände ist für die Draufsicht gemalt und wirkt gekippt flach.
  - **Baustein-System festgelegt (2026-11-16):**
    - Probe mit Platzhaltern: `entwurf/probe/gelaende.html`.
    - Regeln: STYLE.md „Gelände-Bausteine“. Vier Arten: Bodentextur, flaches Detail, Wandstück, Aufsteller.
    - Prompts G1–G14 in `entwurf/GEMINI_PROMPTS.md`; die Bilder kommen nach `ui-quelle/gelaende/`.
    - Danach: Freistell-Werkzeug für Streifen und Texturen, Einbau in die neue Ansicht. Die Karten werden dann aus Feldcodes zusammengesetzt statt aus gemalten Ganzbildern.
    - Stand 2026-11-16: alle Bausteine G1–G14 geliefert und freigestellt; Grauwall als ganze Karte aus Bausteinen auf der Testseite `entwurf/probe/karte.html`. Offen: Baumkronen für den Kartenrand (A7, noch Platzhalter), Einbau ins Spiel (neue Ansicht), übrige Karten (Kirche/Fabrik als große Gebäude, Bahn).
  - **Später: große Gebäude über mehrere Felder (2026-11-16).** Kirche, Fabrik, Bahnhof, Gutshof über 2–4 Felder. Idee:
    - jedes Feld bekommt seine eigenen Wandstücke (hinten hoch, vorn niedrig);
    - ein Turm bzw. Schornstein steht als einzelner hoher Aufsteller auf einem Randfeld des Gebäudes und wird durchsichtig, wenn er Einheiten verdeckt;
    - innen keine Wände zwischen den Feldern, nur Trümmer.
    
    Offen: Regeln (gemeinsame Deckung, Sicht durch das Gebäude), Prompts A2/A3 dafür umschreiben.
- **Etappe 4b – Einheitenbilder (angehalten):** alle Einheiten nach den Bildregeln in STYLE.md neu bzw. nachgemalt, einheitliche Größen, Farben je Fraktion. Wartet auf das Ergebnis des Probebilds.
- **Etappe 4c – Sound und Musik:** UI-Klicks, Waffen, Einschläge, Gas, Ketten, Atmosphäre; Musik mit Suno: Titelthema und 1–2 Schlachtmusiken.
- **Etappe 5 – Gameplay:** Missionstypen (nicht nur Siegpunkte), stärkere und nachvollziehbare KI, Blaue Legion als vollwertige Seite. Dazu (2026-11-16):
  - Aufstellung zu Beginn: automatisch oder selbst platzieren.
  - Bewegungs- und Aktionspunkte sauber trennen (UI und Logik); Bewegungskosten nach Klasse und Gelände logisch staffeln (Infanterie, Reiter, Panzer).
  - Draht schneiden nur für Spezialisten, nicht für Standard-Infanterie.
  - Festfahren seltener; nach aktiver Reparatur längerer Schutz, nach bloßem Ablaufen kein Schutz.
  - Beim Ziehen über Gelände sofort Vor- und Nachteil des Felds als Symbol zeigen.
  - Fähigkeiten: Radius und betroffene Felder bzw. Einheiten anzeigen.
  - Bohrkoloss: kurzer Flammenstoß auf ein Nachbarfeld als Fähigkeit (das neue Bild zeigt einen Flammenwerfer, 2026-11-16).
  - Fahrzeuge belegen 2 Felder (2026-11-16, prüfen): Panzer und Kolosse sind maßstäblich breiter als ein Feld.
  - Aschenwacht braucht eine eigene Panzer-Einheit „Sturmpanzer“ (Gegenstück zum Landkoloss, ohne Kampfmaschinen-Schalter); Bild `aschenwacht_panzer.png` liegt schon vor, ist aber noch keiner Einheit zugeordnet.
- **Etappe 6 – Karten neu:** alle Karten im Stil der gemalten Ganzbilder, Kamera 30–35°, logisch zusammenhängend, mehrere Größen. Prüfen: AI-Map-Generator mit Hexfeldern als mögliche Quelle.
- **Etappe 7 – Balance:** Kosten, Werte und Siegquoten mit `tools/sim.js` und `tools/costcheck.js` abstimmen.
- **Etappe 8 – Feldzug:** Weltkarte mit aufeinanderfolgenden Schlachten, Land- und Seeschlachten.
