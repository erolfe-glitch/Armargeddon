# Armargeddon – Ideen für später

Sammelstelle für Ideen, die nicht sofort umgesetzt werden. Neue Ideen kommen hier hinein (kurz, mit Datum), erledigte werden gestrichen oder mit Verweis auf den Commit abgehakt.

## Offen
- **Für U9 (Enrico 2026-11-27, Punkt 129):** Die KI soll „sehr seltene“ Einheiten (Kreuzschreiter, Eisenknecht, Helden) gelegentlich kaufen – heute kauft sie sie nie (U7-Messung: auch mit `MECHS=1` kein Löwengebrüll). Erst in U9 mit Messung, nicht vorher.

- **Gefallene liegen lassen (2026-11-26, Punkt 98):** Der Code aus U5b/Punkt 93 ist da, aber abgeschaltet (`window.GEFALLEN_AN`). Enrico gefällt der gemalte Bogen `ui-quelle/figuren/reskin/gefallene_bogen.png` (3 Gefallene je Seite) – **nicht löschen**, vielleicht später statt der gedrehten Getroffen-Pose einbauen, wenn das Bild ruhig genug bleibt.

- **Schussfeld-Anzeige** (2026-11-15): erst nach Klick auf „Schießen“ zeigen oder immer bei Auswahl? Später ausprobieren.
- Ordner Units/Russia ansehen (aus CLAUDE.md übernommen).
- Bildkarten 1, 4, 7, 8 des Nutzers verbauen (aus CLAUDE.md übernommen).
- Kartenbeschreibungen (`desc`) an den Siegpunkt-Modus anpassen (aus CLAUDE.md übernommen).

- Optional: feine helle Umrandung um Figuren als Schalter in den Optionen (2026-11-16, noch nicht bauen).
- **Gelände-Teile mit Flux angleichen** (2026-11-22, Enrico 18:55, nichts bauen): Nach Krähenfurt die drei Karten vergleichen. Wenn Flux-Teile (Krähenfurt) und Gemini-Teile (Grauwall, Sankt Ruß) nicht zusammenpassen, nur die herausfallenden Teile mit Flux nachmalen, keine ganze Karte neu. Flux: genauer bei Anzahl, Raster, Blickwinkel und Maßstab, PNG 2k; Gemini: detailreicher und düsterer, bessere Bodentexturen. Enrico (19:23): Die Gräben von Grauwall sehen „krakelig“ aus – bei der Überarbeitung zuerst die Grabenteile (Kanten vorn/hinten, Sohle) neu machen. Hat Zeit.
- **Rollen-Aufstellung als eigenes Paket, zusammen mit der KI-Startphase** (geparkt 2026-11-22, Enrico 18:45):
  - Gebaut und im Code: `deployZone` in engine.js (beide Seiten nach Rollen: Fußtruppen vorn, Fahrzeuge an Straßen/im Offenen, MG vorn in Deckung, Unterstützung und Geschütze hinten; Plätze bewertet, Mischen nur innerhalb einer Rolle). Abrufbar mit `AUFSTELLUNG_NEU=1`, Standard bleibt die alte Aufstellung.
  - Messung (Sieg Konkordat, je 4 × 200, fest / gemischt): bisher Grauwall 54,3/60,3, Sankt Ruß 48,9/78,3, Krähenfurt 51,0/91,6; Rollen-Aufstellung (Anführer hinten) 46,1/52,9, 78,8/83,8, 99,4/92,8; Anführer vorn 22,1/62,4, 94,3/79,8, 90,0/93,8; Anführer nah hinter den Trupps 42,9/57,4, 28,9/85,1, 99,9/96,0.
  - Befund: kleine Änderungen der Anführer-Plätze kippen das Ergebnis um 40–55 Punkte; die Empfindlichkeit liegt auch daran, wie die KI auf die Startlage reagiert. Idee: KI-Startphase (erste 2–3 Runden) mit untersuchen und beides zusammen abgleichen.
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
    - Stand 2026-11-19: technisch gebaut (GBau `cfg.bauten`, Mauerzüge je Außenkante, Turm als Aufsteller, eingestürzter Zustand), zuerst die Kirche von Sankt Ruß. Offen: Fabrik, Bahnhof, Gutshof als eigene Gebäude.
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
- ~~**Löwengebrüll des Kreuzschreiters**~~ umgesetzt 2026-11-20 (einmal je Schlacht, Umkreis 2, Moral −2 und niedergehalten). Ursprünglich (2026-11-18; Testknopf ohne Wirkung seit 2026-11-18: ui.js `loewenGebruell`, Ton `loewe_mr`, Zeichen vorläufig `s_flucht`): Ton liegt in `sound-quelle/Monster/613685__czghost__roar05.wav` (CC BY 4.0, CZghost), mit Roboterfilter (stimmen_cut.py `roboter`) als Löwengebrüll; dazu Fähigkeit „verängstigt“, einmal je Spiel, wirkt auf Gegner im Umkreis von 1 Feld.
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

## Zweitwaffen – Vorschlag (2026-11-17) – entschieden und gebaut: Bohrkoloss Flammenstoß (statt Turm-MG), Kreuzschreiter Löwenmaul-Kanone, Sturmpanzer behält nur die Breitseite (seit 2026-11-20, F59: dazu Bord-MG)
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

## Stufe-3-Schreiter und neue Einheiten (Enrico, 2026-11-19)
- **Stufe-3-Schreiter als Höhepunkt:** Kreuzschreiter (Konkordat, Löwe) und Eisenknecht (Aschenwacht, Ritter) bekommen ein **neues Modell** (Bilder nach Enricos Vorlagen, Stil siehe STYLE.md „Stil-Erweiterung: Retro-Zukunft“). Höchstens einer pro Seite und Schlacht, teurer und stärker, eigene Ankunft (Ton, Beben), Kamerafahrt bei Hauptangriff und Fähigkeit, scheppernder Nahkampf.
- **Kamerafahrt** (wie in Darkest Dungeon): auch bei großen Momenten (Kircheneinsturz, Volltreffer, ein Koloss oder Schreiter fällt), abschaltbar.
- **Minigun:** Wahl pro Schuss zwischen „Streuen“ (mehrere Ziele, wenig Schaden) und „Bündeln“ (ein Ziel, hoher Schaden), Salve etwas länger.
- **Neue Einheiten im neuen Stil:**
  - Konkordat: **Löwenoger** – riesige Krieger mit Löwenköpfen in schwerer Rüstung mit Sturmgewehren.
  - Aschenwacht: **Eiserne Hünen** – Riesen in Ritterrüstung mit Topfhelm und Sehschlitz, schwere Maschinengewehre.
  - Werte, Kosten und Rolle noch offen.
## Helden (Enrico, 2026-11-21) – erst nach Paket E und F66 bauen
- Je Fraktion **ein Held**: Einzelmodell, höchstens einer je Armee, teuer (unter Stufe-3-Schreiter), kein Panzer. Drei Merkmale: **Aura**, **Spezialschlag** mit Abklingzeit, **klare Schwäche**. Fällt er, verliert die eigene Seite Moral. Spielt die F48-Kampfszene. Soll einen Unterschied machen, aber keine Schlacht allein drehen.
- **Konkordat – „Die Rote Faust“:** Oberst im Kampfanzug mit dampfgetriebener Schlagfaust. Spezial „Durchbruch“: stürmt bis 2 Felder in eine Einheit und schleudert sie ein Feld zurück. Aura: Nachbarn verlieren unter Beschuss weniger Moral. Schwäche: kaum Fernkampf (nur Pistole).
- **Aschenwacht – „Der Eiserne Kürassier“:** riesiger gepanzerter Ritter mit Kettenklinge (Spitzhelm schlicht, keine Abzeichen). Spezial „Hinrichtung“: angeschlagene Einheit (unter 30 %) im Nahkampf sofort vernichtet. Aura: Furcht (Gegner in der Nähe verlieren Moral). Schwäche: langsam, bleibt in Schlamm und Graben stecken.
- Werte und Einordnung ins Dreieck (F66) später vorschlagen; Bilder macht Enrico mit Gemini.

## Offene Punkte aus Paket G (2026-11-21)
- **CREDITS für die neu2_*-Töne (F67):** 85 Quelldateien stehen noch nicht einzeln in CREDITS.md (etwa 45 von Freesound, Lizenz je Datei nachschlagen). Erst nötig, wenn etwas veröffentlicht oder verkauft wird (Enrico 13:25).
- **Mineure graben kaum Stollen:** die KI kauft sie jetzt (Grauwall 0,13, Sankt Ruß 0,30 je Schlacht), gräbt aber nur 0,01 bzw. 0,03 Stollen je Schlacht – Auslöser in ai.js (abilPlan tunnel, posValue Mineure) prüfen.
- **test_draht.js** meldet „keine stillen Geländeänderungen“ bei der Straßenzeile von Sankt Ruß (schon vor Paket G Schritt 5) – vermutlich Fehlalarm, Test anpassen.

## Großer Fahrplan danach (Enrico + Berater, 2026-11-22)
Reihenfolge, damit eins auf dem anderen aufbaut:

1. **Balance: jede Einheit soll zum Tragen kommen.** Enrico ist unzufrieden – viele Einheiten werden kaum eingesetzt, weil man sie „gar nicht eingesetzt kriegt“.
   - Erst **messen**: aus Simulationen und Enricos Partien je Einheit zählen – wie oft gekauft, wie oft gehandelt, Schaden/Wirkung je Punkt, Überlebensdauer.
   - Dann je Einheit die Frage „**Wann kaufe ich die?**“ beantworten. Ohne gute Antwort: Nische schärfen, Karten mit passenden Lagen (Gräben, Ruinen, Brücken, Engstellen), oder Einheiten zusammenlegen.
2. **Leistung und größere Schlachtfelder.** Enrico möchte die Karten später größer haben.
   - Grundlage: Leistungsmessung aus Prüfliste 2 (Bildrate, was kostet die Zeit: Zeichnen oder KI).
   - Wenn das Zeichnen bremst: **WebGL-Umbau** (z. B. PixiJS) – Grafikkarte zeichnet Gelände, Figuren, Effekte; Regeln/KI/Töne bleiben. Dazu KI-Rechnen in einen Hintergrund-Rechenkern (Web Worker), damit größere Karten nicht einfrieren.
   - Optional: eigenes Programmfenster (Electron/Tauri) statt einer 55-MB-HTML-Datei → schnellerer Start, Bilder/Töne als einzelne Dateien.
3. **Kampagne „wie Total War: Warhammer 3“, nur vom Prinzip her.** Die Schlachten sind schon da; die Kampagne ist die Ebene darüber.
   - **Stufe 1 – Feldzug light:** Kette von Schlachten mit derselben Armee; Verluste, Medaillen und Helden werden mitgenommen, Nachschub zwischen den Schlachten.
   - **Stufe 2 – Strategiekarte:** Provinzen, Armeen ziehen, Wirtschaft/Nachschub, Helden als Heerführer.
   - Erst nach 1 und 2 – eine Kampagne würde unausgewogene Einheiten nur verstärken.

## Brainstorm Spielsystem (Enrico + Berater, 2026-11-23) – noch nichts bauen
- **Kampagne:** eigenständige KI-Staaten (jeder für sich), der Spieler gehört zu einer Allianz; Bündnisse in den Einstellungen wählbar (mit/ohne). Später einfacher Handel und Eisenbahnlinien. Langfristig Menschen gegen „das Böse“ (eine einzige böse Fraktion, Horde). Offen: von Anfang an Koop oder erst gegeneinander. Idee Berater: Kampagne gleich für Bündnisse bauen, die Aschenwacht spielt zum Testen vorläufig den Feind. „Masse gegen Klasse“: Feind viele billige Armeen, Spieler weniger, aber erfahrene Armeen mit Helden; verbündete KI hält die Front, die Spieler-Armee ist die Speerspitze. Koop am selben PC (Hotseat) denkbar.
- **Schlachtende:** Kombination wie Total War – Sieg durch Zusammenbruch/Vernichtung, durch Halten aller Zielfelder über eine Zeit oder nach der Rundengrenze nach Punkten. Rundengrenze nach Schlachtgröße (kurz/mittel/lang ≈ 30/45/60 Minuten), höchstens etwa eine Stunde. Kein „schon gewonnen?!“ mitten in der Schlacht.
- **Moral/Schaden:** Schaden über Modelle statt über Moral – jede Figur ist ein Kämpfer, die Feuerkraft hängt an den lebenden Modellen, schwere Waffen töten mehrere Modelle. Moral steuert nur das Verhalten (niedergehalten, zurückweichen, sammeln, fliehen; Sammeln mehrmals möglich, die Armee bricht erst spät). Vorbild: Radious-Mod (längere Schlachten, fortlaufendes Moralsystem) und Total War: Warhammer 40.000 (jedes Modell eigene Schusslinie, Trupps aus verschiedenen Figuren, Deckung/Stellung entscheidend).
- **Zerstörung spürbar:** Treffer im Offenen tödlich, Deckung macht den großen Unterschied, schwere Waffen „knallen“ (Splitter, Niederhalten, Figuren fallen sichtbar). Eine Gewehrsalve auf einen ungedeckten Trupp darf nicht wirkungslos wirken.
- **Armee:** feste Formation je Armee (wie Total War), Schlachtgröße mit Grenze je Einheitentyp (Linientruppen doppelt), Verbände je Fraktion mit Armee-Bonus; **Reserve** statt Nachkaufen (ein Teil der Armee kommt später, ein Balken zeigt die ausstehende Verstärkung). Offen (Enrico denkt nach): Nachschub/„Fleischwolf“.
- **Maßstab (Entscheidung 2026-11-23):** Linien-Infanterie 10 Figuren je Feld, Reiter 6, Spezialtrupps 4; Soldaten ca. 62 % der heutigen Größe, Fahrzeuge bleiben gleich groß. Fotomontage `entwurf/probe/massstab/massstab_A_10_6.jpg` (gewählt), Probebild im Spiel `entwurf/probe/massstab/` (Paket F).
- **Zweistufige Tooltips (nicht wichtig, nur Idee):** Beim Verweilen über Gelände, Einheit, Knopf oder Marke erscheint nach ca. 0,6 s ein kleines, gut lesbares Fenster mit Namen und 1–2 kurzen Zeilen (z. B. „Zugefrorenes Wasser – keine Deckung, kann einbrechen“). Länger darauf (ca. 2–3 s) oder eine Taste (Umschalt/i) klappt die ausführliche Erklärung mit den Regeln auf. Touch: langes Drücken = Stufe 1, noch einmal lang = Stufe 2. Darf nie stören (kein Aufpoppen beim normalen Überfahren).
- **Flieger-Unterstützung (Ausarbeitung später):** Funker/Fliegerleit-Trupp auf beiden Seiten (Umbau Fernsprechtrupp?) ruft einen einmaligen Luftschlag, bezahlt mit **Nachschubpunkten**: **Tiefflieger** (MG-Garbe über eine Linie von 3 Feldern, niederhalten) oder **Bomber** (2–3 schwere Bomben mit Streuung). Das Flugzeug fliegt einmal schräg übers Bild (Schatten, Motordröhnen, Sirene), wirft ab und ist weg. Grenzen: Kosten, Abklingzeit bzw. 1–2× je Schlacht, Streuung/Eigenbeschuss, später Flak. Für die Kampagne: Flugplätze schalten Luftschläge frei.
- **Stilrichtung:** eigene Fantasy-Welt; Mischung aus Erstem und Zweitem Weltkrieg, Trench Crusade, ein Hauch Mad Max und Warhammer Fantasy; über die Zeit optisch mehr Richtung Zweiter Weltkrieg (Panzer), später Flugzeuge. Weltkriegs-Bezüge („Im echten Krieg“) sind nicht mehr Pflicht.

- **2026-11-26 (Berater): Armeeaufbau und Kampagne** – Kategorien (Linie/Unterstützung/Elite/Gerät/Selten) mit Rückgrat-Regel, Fraktionsprofile (Konkordat, Aschenwacht, Blaue Legion, Velya, Sieben Pforten, Fahle) und Kampagnen-Armeen (General + bis 20 Trupps, Nachbar-Armeen als Verstärkungswellen, Garnisonen, Front mit Eingraben): siehe `entwurf/ARMEEAUFBAU_IDEEN.md`. Kategorien im Gefecht = Paket K1 (Punkt 104).
