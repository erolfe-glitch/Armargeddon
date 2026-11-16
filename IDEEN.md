# Armargeddon – Ideen für später

Sammelstelle für Ideen, die nicht sofort umgesetzt werden. Neue Ideen kommen hier hinein (kurz, mit Datum), erledigte werden gestrichen oder mit Verweis auf den Commit abgehakt.

## Offen

- **Schussfeld-Anzeige** (2026-11-15): erst nach Klick auf „Schießen“ zeigen oder immer bei Auswahl? Später ausprobieren.
- Ordner Units/Russia ansehen (aus CLAUDE.md übernommen).
- Bildkarten 1, 4, 7, 8 des Nutzers verbauen (aus CLAUDE.md übernommen).
- Kartenbeschreibungen (`desc`) an den Siegpunkt-Modus anpassen (aus CLAUDE.md übernommen).

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
  - Maßstab: stehender Soldat ca. 1,3 Feldradien.
  - Trupps: 4 Figuren je Trupp in lockerer Formation, Füße alle im eigenen Feld; Verluste lassen Figuren wegfallen.
  - Gelände muss für diesen Winkel neu gemalt werden: plastisch, Draht, Trichter und Gräben mit Tiefe (Seitenwände, Schatten, Pfähle stehen hoch). Das heutige Gelände ist für die Draufsicht gemalt und wirkt gekippt flach.
- **Etappe 4b – Einheitenbilder (angehalten):** alle Einheiten nach den Bildregeln in STYLE.md neu bzw. nachgemalt, einheitliche Größen, Farben je Fraktion. Wartet auf das Ergebnis des Probebilds.
- **Etappe 4c – Sound und Musik:** UI-Klicks, Waffen, Einschläge, Gas, Ketten, Atmosphäre; Musik mit Suno: Titelthema und 1–2 Schlachtmusiken.
- **Etappe 5 – Gameplay:** Missionstypen (nicht nur Siegpunkte), stärkere und nachvollziehbare KI, Blaue Legion als vollwertige Seite. Dazu (2026-11-16):
  - Aufstellung zu Beginn: automatisch oder selbst platzieren.
  - Bewegungs- und Aktionspunkte sauber trennen (UI und Logik); Bewegungskosten nach Klasse und Gelände logisch staffeln (Infanterie, Reiter, Panzer).
  - Draht schneiden nur für Spezialisten, nicht für Standard-Infanterie.
  - Festfahren seltener; nach aktiver Reparatur längerer Schutz, nach bloßem Ablaufen kein Schutz.
  - Beim Ziehen über Gelände sofort Vor- und Nachteil des Felds als Symbol zeigen.
  - Fähigkeiten: Radius und betroffene Felder bzw. Einheiten anzeigen.
- **Etappe 6 – Karten neu:** alle Karten im Stil der gemalten Ganzbilder, Kamera 30–35°, logisch zusammenhängend, mehrere Größen. Prüfen: AI-Map-Generator mit Hexfeldern als mögliche Quelle.
- **Etappe 7 – Balance:** Kosten, Werte und Siegquoten mit `tools/sim.js` und `tools/costcheck.js` abstimmen.
- **Etappe 8 – Feldzug:** Weltkarte mit aufeinanderfolgenden Schlachten, Land- und Seeschlachten.
