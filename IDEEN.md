# Armargeddon – Ideen für später

Sammelstelle für Ideen, die nicht sofort umgesetzt werden. Neue Ideen kommen hier hinein (kurz, mit Datum), erledigte werden gestrichen oder mit Verweis auf den Commit abgehakt.

## Offen

- **Schussfeld-Anzeige** (2026-11-15): erst nach Klick auf „Schießen“ zeigen oder immer bei Auswahl? Später ausprobieren.
- Ordner Units/Russia ansehen (aus CLAUDE.md übernommen).
- Bildkarten 1, 4, 7, 8 des Nutzers verbauen (aus CLAUDE.md übernommen).
- Kartenbeschreibungen (`desc`) an den Siegpunkt-Modus anpassen (aus CLAUDE.md übernommen).

- Optional: feine helle Umrandung um Figuren als Schalter in den Optionen (2026-11-16, noch nicht bauen).
- **Wurfposen für Sturmtruppen und Räumer** (2026-11-19): eigene Wurfposen als Gemini-Bogen (Ausholen, Loslassen), dann den fertigen Wurfablauf `poseWurf` (ui.js, Animation Stufe 1) für ihre Granaten nutzen. Einheiten mit Soldatenbild (Schützenkohorte, Aschengrenadiere) bekommen vorerst keine Handgranaten.

## Gesamtplan (Stand 2026-11-18)

Erledigt: Etappe 1 UI-Feinschliff, Etappe 2 Übersicht auf dem Feld, Etappe 3 Kamera und Spielgefühl, Etappe 4a UI-Flächen gekachelt, Darstellung geklärt (neue gekippte Ansicht, seit 2026-11-17 fest), Etappe 4b Einheitenbilder (alle 50 Einheiten mit neuem Bogen, außer Blaue Legion), Etappe 4c Ton und Musik, die Grundregeln aus Etappe 5 und Etappe 7 für den Grauwall. Der aktuelle Arbeitsplan steht unten unter „Fahrplan bis zum Content-Ausbau“; als Nächstes kommt Content (Karten, Missionstypen, KI-Charaktere, Blaue Legion, Feldzug).

- ~~**Etappe 4a – UI-Flächen scharf:**~~ erledigt (Commit 0250727): kachelbare Texturen, Rahmen und Ecken per 9-Slice.
- ~~**Vor Etappe 4b – Darstellung klären.**~~ erledigt: neue Ansicht seit 2026-11-17 die einzige (CLAUDE.md „Feste Regeln“). Ursprüngliche Punkte:
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
  - Umbau im Spiel (damals hinter dem Schalter „Neue Ansicht (Test)“, seit 2026-11-17 fest und ohne Schalter): Schritt 0 (Schalter, Ansichts-Abschnitt in ui.js) und Schritt 1 (Kamera und Boden: Weltbild flach, perspektivisch projiziert, Einheiten als Aufsteller, Klicks/Ziehen/Zoom/Kamera-Folgen) erledigt 2026-11-16; Schritt 3 (Figuren: Trupps zu viert, Einzelmodelle, Zuordnung FIGMAP in ui.js) erledigt 2026-11-16, vor Schritt 2; Schritt 2 (Zielfahnen, Symbole, Klammern, Vorschau, Rauch, Gas, Effekte aufrecht) erledigt 2026-11-16; weiter mit 4 Aufsteller (Gelände in zwei Ebenen, Höhenfelder mit Böschung), 5 Feinschliff. Stand 2026-11-18: Gelände in zwei Ebenen über die Gelände-Bausteine auf dem Grauwall umgesetzt; Höhenfelder mit Böschung noch offen.
  - Gelände muss für diesen Winkel neu gemalt werden: plastisch, Draht, Trichter und Gräben mit Tiefe (Seitenwände, Schatten, Pfähle stehen hoch). Das heutige Gelände ist für die Draufsicht gemalt und wirkt gekippt flach.
  - **Baustein-System festgelegt (2026-11-16):**
    - Probe mit Platzhaltern: `entwurf/probe/gelaende.html`.
    - Regeln: STYLE.md „Gelände-Bausteine“. Vier Arten: Bodentextur, flaches Detail, Wandstück, Aufsteller.
    - Prompts G1–G14 in `entwurf/GEMINI_PROMPTS.md`; die Bilder kommen nach `ui-quelle/gelaende/`.
    - Danach: Freistell-Werkzeug für Streifen und Texturen, Einbau in die neue Ansicht. Die Karten werden dann aus Feldcodes zusammengesetzt statt aus gemalten Ganzbildern.
    - Stand 2026-11-16: alle Bausteine G1–G14 geliefert und freigestellt; Grauwall als ganze Karte aus Bausteinen auf der Testseite `entwurf/probe/karte.html`. Offen: Baumkronen für den Kartenrand (A7, noch Platzhalter), übrige Karten (Kirche/Fabrik als große Gebäude, Bahn).
    - Stand 2026-11-16: im Spiel eingebaut für Grauwall (neue Ansicht): Boden, Gräben im Zickzack, Draht, Ruinen, Totholz, Kanal; Trupps im Graben abgesenkt, in Ruinen gestaucht. Nächste Karten: in `GB_KARTEN` aufnehmen, fehlende Geländearten (Kirche, Fabrik, Bahn, Furt) ergänzen.
  - **Festung abgelehnt (2026-11-16):** Zinnen wirken mittelalterlich, Teile zu hoch. Bleibt nur auf der Testseite (`karte.html?festung=1`), nie im Spiel.
  - **Schanze (2026-11-16, im Spiel):** Zielfelder mit „schanze“ in der id bekommen einen Bunker hinter dem Graben (eigene Seite) und einen Sandsack-Haken (barrikade.png) davor (`cfg.schanzen` in GBau).
  - **Zielflagge (Standard seit 2026-11-16):** Stofffahne am Holzpfahl statt weißer Tafel, 55 % (alte Ansicht 90 %), hinterer rechter Feldrand hinter den Einheiten, in Ruinenfeldern vorn links (`fahneOrt`). Obere Leiste: keine Wimpel mehr, erobert = Münzrand in Fraktionsfarbe.
  - **Neue Figurenbögen (2026-11-16):** Sanitäter (beide), Mörser, Minenwerfer, Scharfschütze, Schildwall, Schwere Grabenwacht, Melder, Banner, Rauchwerfer, Panzerbüchse, General, Bohrkoloss neu – alle Einheiten gibt es schon, im Spiel zugeordnet (FIGMAP). Übersicht: `entwurf/probe/figuren.html`. Dazu Pirschjäger und Aschenwacht-General (generalD). ~~Sturmpanzer der Aschenwacht hat weiter keine Einheit.~~ Einheit Sturmpanzer seit 2026-11-17 (Gruppe 6). Seit 2026-11-17 haben alle 50 Einheiten einen Bogen (Schreiter, Signal-, Fernsprech-, Versorgungs-, Gasschutz-Trupp, Ballon, Mineure, Kampfanzüge, Eingreiftrupp).
  - ~~**Aschenwacht-Reiter (2026-11-16):** Bogen `aschenwacht_reiter` ist freigestellt, aber die Aschenwacht hat noch keine Reitereinheit.~~ erledigt 2026-11-17: Sprenglanzen-Reiter (Gruppe 6).
  - **Später: große Gebäude über mehrere Felder (2026-11-16).** Kirche, Fabrik, Bahnhof, Gutshof über 2–4 Felder. Idee:
    - jedes Feld bekommt seine eigenen Wandstücke (hinten hoch, vorn niedrig);
    - ein Turm bzw. Schornstein steht als einzelner hoher Aufsteller auf einem Randfeld des Gebäudes und wird durchsichtig, wenn er Einheiten verdeckt;
    - innen keine Wände zwischen den Feldern, nur Trümmer.
    
    Offen: Regeln (gemeinsame Deckung, Sicht durch das Gebäude), Prompts A2/A3 dafür umschreiben.
- ~~**Etappe 4b – Einheitenbilder:**~~ erledigt 2026-11-17: alle 50 Einheiten als Figurenbögen im neuen Stil (`FIGMAP`). Offen: Blaue Legion (zeigt noch die alten `art.js`-Bilder), Russland, später die dämonische Seite.
- ~~**Etappe 4c – Sound und Musik:**~~ erledigt 2026-11-17: Tonplätze neu gebaut (sound_bau), eigene Musik (Titelthema, Schlachtmusik), Sprüche und Stimmfilter. Offen: Credits-Fenster für CC-BY-Töne (siehe „Töne“).
- **Etappe 5 – Gameplay:** offen sind noch Missionstypen (nicht nur Siegpunkte), KI mit Charakter (siehe „Spielmodi, KI und Armee-Grenzen“) und die Blaue Legion als vollwertige Seite. Erledigt (2026-11-17/18):
  - ~~Aufstellung zu Beginn: automatisch oder selbst platzieren.~~ (fb74781)
  - ~~Bewegungs- und Aktionspunkte sauber trennen; Bewegungskosten nach Klasse und Gelände staffeln.~~ (16fa417)
  - ~~Draht schneiden nur für Spezialisten.~~ (Paket 8)
  - ~~Festfahren seltener.~~ (Paket 8; „nach Reparatur längerer Schutz“ nicht gebaut)
  - ~~Beim Ziehen über Gelände sofort Vor- und Nachteil des Felds als Symbol zeigen.~~ (2026-11-18, `feldWirkung`)
  - ~~Fähigkeiten: Radius und betroffene Felder bzw. Einheiten anzeigen.~~ (Paket 2, `areaAct`)
  - ~~Bohrkoloss: Flammenstoß.~~ (52b5db5)
  - ~~Fahrzeuge belegen 2 Felder?~~ entschieden: bleiben auf 1 Feld.
  - ~~Aschenwacht-Panzer „Sturmpanzer“.~~ (Gruppe 6)
- **Etappe 6 – Karten neu:** alle Karten im Stil der gemalten Ganzbilder bzw. aus Gelände-Bausteinen (Grauwall fertig), Kamera 30–35°, logisch zusammenhängend, mehrere Größen. Prüfen: AI-Map-Generator mit Hexfeldern als mögliche Quelle. **Als Nächstes** (Fahrplan Punkt 6).
- ~~**Etappe 7 – Balance:**~~ für den Grauwall erledigt (entwurf/BALANCE.md); jede neue Karte wird beim Neubau eigens abgestimmt.
- **Etappe 8 – Feldzug:** Weltkarte mit aufeinanderfolgenden Schlachten, Land- und Seeschlachten.

## Töne (2026-11-16)
- **Kugelhagel** (spätere Fähigkeit): ganze Datei `sound-quelle/Infantry Guns/337773__lubini__street-battle-lviv…` dafür aufgehoben.
- **Luftschiff/Verstärkung aus der Luft:** `Musiker/704440__roemergruft__viking-horn-in-d.wav` gekürzt, wenn es Luftschiffe gibt.
- **Frauenstimmen** (`woman-fighting`, `communication-voicelines-woman`) für später aufgehoben.
- **Titanen/Railgun der Mechs:** `509015`, `510084` (Notizen des Nutzers).
- **Namensnennung im Spiel:** CC-BY-Töne (siehe `CREDITS.md`) in einem Credits-Fenster nennen; CC-BY-NC-Töne vor einem Verkauf ersetzen.
- **Dämonen-Stimmen** (2026-11-17, noch nicht eingebaut): `four_voices_whispering`, `schizophrenic-voices`, `sisters-voices`, `the-prowler` in `sound-quelle/`.
- **Löwengebrüll des Kreuzschreiters** (2026-11-18; Testknopf ohne Wirkung seit 2026-11-18: ui.js `loewenGebruell`, Ton `loewe_mr`, Zeichen vorläufig `s_flucht`): Ton liegt in `sound-quelle/Monster/613685__czghost__roar05.wav` (CC BY 4.0, CZghost), mit Roboterfilter (stimmen_cut.py `roboter`) als Löwengebrüll; dazu Fähigkeit „verängstigt“, einmal je Spiel, wirkt auf Gegner im Umkreis von 1 Feld.
- **Abprotzen** (2026-11-18): zwei eigene Töne des Nutzers fehlen noch in `sound-quelle/`; bis dahin Platzhalter `abprotzen_1` (loading-gun).

## Spielmodi, KI und Armee-Grenzen (Enrico, 2026-11-17)
- **Erst Skirmish, später Kampagne:** Schlachten zuerst flexibel als Einzelgefechte (Skirmish) auslegen. Eine Kampagne kommt später.
- **KI stärker individualisieren:** weg von einem einheitlichen System – die KI soll je nach Schlacht/Gegner unterschiedlich spielen (Charakter, Vorlieben, Armeezusammenstellung). Wie genau, klären wir noch.
- **Einheitenbegrenzung je Typ (später):** nicht nur eine Gesamtgrenze, sondern bestimmte Typen gezielt begrenzen (z. B. höchstens 1 General, wenige Kolosse, wenige MG). Ändert das Balancing stark – deshalb erst nach der Einheiten-Durchsicht.
  - Jetzt im Code: je Typ höchstens 9 (ARMY_CAP), höchstens 4 Kolosse/Kampfmaschinen, General höchstens 1.

## Artillerie später (2026-11-17)
- **Leichte Artillerie für die Aschenwacht** (Gegenstück zur Feldkanone: direkter Schuss, beweglich, gut gegen Kolosse).
- **Schwere Artillerie für beide Seiten** (große Reichweite, langsam, starke Einschläge). Danach entscheiden, ob das Grabengeschütz seinen direkten Schuss behält.

## Fahrzeuge (2026-11-17)
- Zweites Fahrzeug für das Konkordat, z. B. Flammenpanzer oder Mörserpanzer (Gegengewicht zu Sturmpanzer + Bohrkoloss der Aschenwacht).

## Tempo (2026-11-17)
- Vorschlag: eigenes Tempo für den Gegnerzug, z. B. eigenes Tempo × 1,2 (bei ½× also 0,6×). Messung Grauwall: ein Gegnerzug dauert bei 0,5× etwa 21 s, bei 0,6× etwa 19 s, bei 1× etwa 17 s (KI-Denkzeit und feste Wartezeiten zählen mit).

## Einheitlicher Stimmfilter (2026-11-17) – erledigt (tools/stimmfilter.py)
- Für ALLE Stimm-Tonplätze ein Filter je Sprecher: Infanterie, Sturmtruppen, Pioniere, Sanitäter, Reiter usw. Gasmaske; Kampfanzüge (Stahlgänger, Panzerknechte) Gasmaske etwas stärker; Hauptmann und General ohne Filter; Panzerbesatzung Bordfunk; Schreiter und Eisenknecht (auch robot-voice-damage) Roboter. Waffen, Explosionen, Motoren bleiben unverändert.

## Zweitwaffen – Vorschlag (2026-11-17) – entschieden und gebaut: Bohrkoloss Flammenstoß (statt Turm-MG), Kreuzschreiter Löwenmaul-Kanone, Sturmpanzer behält nur die Breitseite
- Sturmpanzer: Seiten-MG wie der Landkoloss (Modell zeigt mehrere Schießscharten an der Seite). Dafür die Breitseite (zweiter Kanonenschuss) streichen oder behalten – Entscheidung offen.
- Bohrkoloss: kleines Turm-MG (Modell hat einen Lauf auf dem Aufbau), Reichweite 2; bisher nur Nahkampf mit dem Bohrer.
- Kreuzschreiter: Kanone im Löwenmaul als Zweitwaffe (Reichweite 2–3) neben dem schweren MG in der Hand.
- Keine Zweitwaffe: Ordens-, Säge-, Klauenschreiter, Eisenknecht (eine Fernwaffe + Nahkampfarm), Stahlgänger und Panzerknechte (Infanterie).

## Fahrplan bis zum Content-Ausbau (Enrico + Claude, 2026-11-17)
Ziel: Erst muss das Grundspiel auf einer Karte (Grauwall) „sitzen", dann mehr Karten, Modi, Seiten.
1. ~~Oberfläche fertig: Paket 5 (unteres Bedienfeld im Total-War-Stil, Rekrutierung nach Kategorien) + neues Titelbild.~~ erledigt 2026-11-17 (6b357f6 Bedienfeld A1 und Nachschub B, 708f955 Titelbild).
2. ~~Restliche Grundregeln aus Etappe 5~~ erledigt: Aufstellungsphase und Schusswinkel (fb74781); Bewegungs- und Aktionspunkte getrennt (16fa417, KI f5735db); Draht schneiden nur Spezialisten; Festfahren seltener; Bohrkoloss-Flammenstoß; „Fahrzeuge auf 2 Feldern“ entschieden: bleiben auf 1 Feld; Geländehinweis beim Ziehen erledigt 2026-11-18 (Leiste unter dem Zielfeld mit ▲ Vor- und ▼ Nachteilen für die gewählte Einheit, ui.js `feldWirkung`).
3. ~~KI-Durchsicht: nutzt sie alle neuen Befehle sinnvoll, ist sie nicht zu defensiv, spielt sie den Grauwall gut.~~ erledigt 2026-11-17, Bericht entwurf/KI_DURCHSICHT.md (Grauwall 60 %; offen: Gas selten, Kasematten/Front einseitig → Punkt 5).
4. ~~Grauwall komplett: Gelände, Effekte, Ton, Musik, Hilfe/Regeltexte auf neuem Stand.~~ erledigt 2026-11-17: Gelände-Bausteine, Effektbögen, Ton-Pakete 4/6, eigene Musik (7edff61), Sprüche und Stimmfilter, Hilfe- und Regeltexte (ba527e5). Kleinkram offen: Baumkronen am Kartenrand noch Platzhalter; Stimmen selbst anhören (Spieltest-Liste Punkt 51).
5. ~~Balance (Etappe 7): Anführer-Befehle, Kolosse, Kosten, Siegquote um 50 %.~~ erledigt 2026-11-17/18 (f00352b, 6e54782, d033826; Bericht entwurf/BALANCE.md): Grauwall 48 % über 800 Schlachten, Landkoloss-Verluste 88 → 46 %, Gas für die KI, Nebelwand neu, zwei Kostenrunden. Bewusst offen: Konkordat-Spezialisten messen für die KI schwächer als ihr Preis; alte Karten (Kasematten 1 %, Front 15 %, Lerne 94 %) erst beim Neubau.
6. **Als Nächstes:** Content – weitere Karten (zuerst die nächste Karte auf Gelände-Bausteine umstellen; fehlende Geländearten Kirche, Fabrik, Bahn, Furt), Missionstypen, KI-Charaktere, Einheitengrenzen je Typ, Blaue Legion, Feldzug.
