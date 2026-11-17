# KI-Durchsicht (BP/AP Schritt 2, Fahrplan Punkt 3) – 2026-11-17

Gemessen mit `node tools/sim.js` (KI gegen KI, Standardarmeen, Siegpunkt-Modus). **Nicht ausgeglichen** – Werte und Kosten unverändert (das ist Fahrplan Punkt 5).

## Was an der KI geändert wurde (ai.js)

- **Nicht mehr passiv:** Feuerbereitschaft nur noch in Deckung, mit Gegner in Reichweite + 1 und nur, wenn die Seite nicht angreifen muss (`mussAngreifen`: Gegner hält mindestens so viele Zielfelder oder liegt bei Siegpunkten vorn). Vorher nahm die KI sie 27 bzw. 43× je Schlacht und blieb stehen.
- **Zug und Aktion gemeinsam:** Angriffe werden von jedem erreichbaren Feld aus bewertet, die Nahkampfregel (höchstens halbe BP) ist eingerechnet. Neu: **Sturmstellung** – Nahkämpfer, die angreifen müssen, enden 2 Felder vor einem Gegner auf einem Zielfeld oder im Graben, damit nächste Runde ein halber Zug plus Sturm reicht (`W_STURM` 0,8). Zielfelder stürmen zählt beim Angreifer mehr (`W_OBJSTURM` 1,6).
- **Schießen, dann in Deckung:** Einheiten, die gehandelt haben und noch BP haben, ziehen danach auf ein besseres Feld (Deckung bzw. vor), wenn es die Lage verbessert.
- Eingraben kommt dadurch häufiger vor (Einheiten, die stehen bleiben und nicht in Feuerbereitschaft gehen).
- Unverändert und weiter genutzt: Befehle, großer Befehl, Artillerie (Sprenggranate, Sperrfeuer, Gas), MG aufbauen + Sperrfeuer, Zweitwaffen, Drehen für den Schusswinkel, Nachschub an eroberten Flaggen.

## Grauwall, 200 Schlachten

| | Schritt 1 (vorher) | jetzt |
|---|---|---|
| Siegquote Konkordat / Aschenwacht | 24 % / 76 % | **60 % / 41 %** |
| Runden Ø | 14,7 | 15,1 |
| Zielfelder am Ende beim Konkordat | Vorposten 97 %, Nordgraben 93 %, Südgraben 50 %, Schanze 2 %, Veskar 9 % | Vorposten 87 %, Nordgraben 81 %, Südgraben 60 %, Schanze 17 %, Veskar 9 % |
| Ausfälle Konkordat / Aschenwacht | 31 % / 26 % | 36 % / 27 % |

## Andere Karten, je 50 Schlachten (Siegquote Konkordat, Runden Ø)

| Karte | vorher | jetzt | Zielfelder beim Konkordat (jetzt) |
|---|---|---|---|
| Selm | 68 %, 13,9 | 56 %, 14,1 | Vorfeld 56, Nordhof 68, Kreuz 52, Südwald 32, Ostgraben 8 |
| Lerne | 84 %, 14,0 | 90 %, 13,8 | Vorfeld 90, Mühle 100, Bahnhof 72, Kalkwald 52, Nordbrücke 4 |
| Varntal | 34 %, 14,5 | 40 %, 14,4 | Vorfeld 92, Westbunker 94, Varnwald 94, Kirche 44, Südfurt 22, Brücke 4 |
| Grauwall-Front | 10 %, 14,7 | 6 %, 14,4 | Vorwerk 94, Kessel 78, Brand 80, Kreuzhof 0, Riegel 0 |
| Steinbrücke | 22 %, 15,2 | 24 %, 15,4 | Bunker S/W 100, Steg 30, Steinbrücke 24, Bunker O 0, Dorfrand 0 |
| Waldfluss | 32 %, 23,1 | 72 %, 18,2 | Bunker S/W 100, Steg 48, Holzbrücke 48, Bunker M 0, Ostgraben 0 |
| Kasematten | 0 %, 11,1 | 0 %, 11,8 | Eigene Basis 38, Graben 6, Bunker 6, Vorwerk 26, Riegel 4 |
| Kanalstadt | 60 %, 20,5 | 70 %, 19,2 | Basis 92, Front 100, Steinbrücke 74, Bahnbrücke 28, Fabrik 0, Ostviertel 0 |

Auffällig für die Balance (Fahrplan 5): **Kasematten** (0 %) und **Grauwall-Front** (6 %) sind schon vorher einseitig. Das Konkordat greift dort viel an (27–36 Nahkämpfe je Schlacht), kommt aber an die hinteren Zielfelder nicht heran; auf den Kasematten verliert es sogar oft seine eigene Basis. Das ist eine Frage von Karte, Armee und Zielpunkten, nicht von passiver KI.

## Nutzung je Schlacht, Grauwall (Konkordat / Aschenwacht)

| Handlung | K | A | | Handlung | K | A |
|---|---|---|---|---|---|---|
| Zug | 142 | 100 | | Sprenggranate | 18,9 | 25,6 |
| Marsch | 10,3 | 10,0 | | Artillerie-Sperrfeuer (max. 2×) | 0,78 | 0,67 |
| Beschuss | 75,8 | 46,9 | | Gas | 0,18 | 0,27 |
| Nahkampf | 24,4 | 39,2 | | Befehl Feuer frei / Sturmbefehl | 4,8 | 4,2 |
| Zweitwaffe (Seiten-MG) | 22,2 | – | | Befehl Sammeln | 0,21 | 1,36 |
| MG aufbauen / abbauen | 6,9 / 7,1 | 4,9 / 5,7 | | großer Befehl (1× je Schlacht) | 0,47 | 0,80 |
| MG-Sperrfeuer | 6,7 | 18,7 | | Eingraben | 5,1 | 4,8 |
| Feuerbereitschaft | 2,1 | 4,7 | | Drehen | 4,8 | 9,2 |
| Reaktionsfeuer | 1,4 | 1,3 | | Draht schneiden | 0,35 | 0,25 |
| Nachschub am Rand / an Zielfeld | 3,6 / 2,1 | 4,2 / 2,7 | | Sanitäter | 0,45 | 1,04 |
| Haftladung (Pioniere) | 0,35 | – | | Aufprotzen | 2,0 | – |

Mit erweiterten Armeen (60 Schlachten, Ballon, Fernsprech-, Mineur-, Rauch-, Werkstatt-, Signal-, Minen-, Munitions-, Gasschutztrupp, Kampfanzüge, Banner, Schwere Grabenwacht):

| Fähigkeit | K | A |
|---|---|---|
| Ziel markieren | 4,3 | 5,4 |
| Feuerschlag | 3,8 | – |
| Rauch | 3,8 | – |
| Stollen | 1,3 | – |
| Minen | – | 3,0 |
| Sturmlauf (Kampfanzüge) | 5,1 | 4,7 |
| Munition/Versorgung | 1,5 | 3,8 |
| Banner aufpflanzen | – | 1,1 |
| Schilde vor | – | 3,3 |

**Fast nie:** Bergen (0,01 – Pannen sind seit Paket 8 selten), Entgiften (0,07 – nur, wenn Gas liegt; Gas selbst ist selten, 0,2 je Schlacht), Banner und Schilde in Standardschlachten (nur, wenn die KI diese Einheiten nachkauft). Gas könnte die KI öfter nehmen (Abklingzeit 3, Vorrat 1–2) – Kandidat für die nächste KI-Runde.
