# Prüfung U7 Moral – Ergebnis (27.11.2026)

Auftrag: `PRUEFAUFTRAG_FABLE_U7.md`. Nur gelesen, gerechnet und gemessen; in `src/` und `tools/` ist nichts geändert.
Verbraucht: 6 Läufe `sim.js` (je 100 Schlachten, 55–63 s), kein Browser-Lauf, etwa 35 Minuten.
Zahlen wie in der Anzeige (Moral 70, Stärke 100), Konstanten wie im Code (`P.FALLBACK_MOR` 3 = 30).

## Das Wichtigste in fünf Sätzen
1. **U7 ist so gebaut wie vorgeschlagen:** Es fehlt nichts, alle Werte stimmen mit dem Vorschlag überein, und die Messung aus dem Bericht ist exakt nachvollziehbar (Startwert 1: 54 / 47 / 54 %, mit `STUFEN_ALT` 54 / 45 / 54 % wie in Schritt 2).
2. **Einen Regelfehler, der Schlachten kippt, habe ich nicht gefunden.** Die Fehler sitzen in der Anzeige und in der KI: Zustandsmarke, Moralbalken der Einheitenkarte und KI rechnen noch mit der alten Schwelle 30, und die Marke „Flieht“ erklärt noch die alte Regel.
3. **Die Rechnung zeigt zwei tote Stellen:** Unter reinem Beschuss endet ein Linientrupp weiter fast immer *zerschlagen* (endgültig) und nie in *Panik* (sammelbar), und im Offenen *weicht* er nicht mehr, weil ein Wankender schon beim ersten Treffer niedergehalten ist und Niedergehaltene liegen bleiben.
4. **Die KI jagt Fliehende:** 40–54 % aller Fliehenden werden auf der Flucht vernichtet, auch Zerschlagene, die keine Punkte mehr bringen und nie zurückkommen.
5. **Urteil: U7 kann so bleiben.** Ich empfehle ein kleines Paket U7b (Anzeige, KI, vier kleine Regelstellen); zwei größere Regelfragen stehen unten für Enrico.

## 1. Abweichungen vom Vorschlag

**Fehlt:** nichts. Alle drei Schritte sind gebaut, jeder mit eigenem Rückweg.

**Werte:** alle wie vorgeschlagen.
- Schritt 1: `FURCHT_BASIS` 0,35, `ROAR_BASIS` 0,5, `ROAR_BESTANDEN` 0,5.
- Schritt 2: `RALLY_ALLEIN` 0,2, `RALLY_DECKUNG` 0,15, `RALLY_BANNER` 0,2, `RALLY` 0,6, `RALLY_GENERAL` 0,8, `RALLY_MUEDE` 0,15, `RALLY_MAX` 0,9, `RALLY_MOR` 3,5, `FLUCHT_BP` 2, `SAMMELN_R` 2 / 3, `SAMMELN_BEFEHL` 0,2.
- Schritt 3: `WANKT` 0,6, `WANKT_ATK` 0,85, `SUPP_WANKT` 0,3, `RECOVER_SUPP` 0,5, `FALLBACK_DECKUNG` 2.

**Anders gebaut:**

| Was | Wie gebaut | Urteil |
|---|---|---|
| Befehl „Sammeln“ | wirkt auf alle Fliehenden im Umkreis zugleich, jeder würfelt einzeln | besser |
| Schweißtropfen | beim Anwählen bei *wankt*, zu Rundenbeginn nur bei *weicht* | besser, weniger Zeichen |
| „eingegraben“ | zählt bei Schwelle 20 und halber Erholung wie Graben | besser |
| `moralStufe` als eine Funktion für alles | gebaut, aber nur der Balken-Tooltip ruft sie auf; Regel und Kartenbalken rechnen gleichwertig, Einheitenkarte, Marke und KI nicht | schlechter, siehe Fehler 1–2 und 9 |
| Rundenbeginn eines Fliehenden | erst „am Rand = fort“, dann Sammelversuch | etwas schlechter: Wer am Rand steht, bekommt keinen Versuch |
| KI-Feldwert `W_SAMMEL` | „Wankende“ sind Trupps unter Moral 30, nicht die Stufe *wankt* | etwas schlechter |
| Zerschlagene | fliehen ebenfalls nur noch 2 Felder je Runde (im Vorschlag nicht geregelt) | neutral, gibt der KI aber mehr Zeit, auf sie zu schießen |
| Furcht-Aura und Entsetzen | lösen weiter keine Flucht aus (im Bericht als Absicht genannt) | in Ordnung |

## 2. Fehler und Lücken

### Mittel
1. **Marke „Moral wankt“ rechnet mit der alten Schwelle** (`ui.js:423`).
   - Sie erscheint unter `P.FALLBACK_MOR` 30 und sagt „Beim nächsten Treffer weicht die Einheit zurück“. Im Graben gilt aber 20.
   - Der Name „Moral wankt“ meint hier die Stufe *weicht*; seit Schritt 3 heißt *wankt* etwas anderes (unter 60 %).
   - Behebung: Marke über `E.moralStufe(G, u) === 'weicht'`, Name „Weicht“, Text mit der Schwelle aus `E.fallbackSchwelle`.
2. **Moralbalken der Einheitenkarte zeigt Gelb fast nie** (`ui.js:4283`).
   - Die Klasse `bad` (rot) greift unter `P.FALLBACK_MOR + 1` = 40 und geht vor. Gelb bleibt nur zwischen 40 und 60 % der Typmoral.
   - Das sind bei der Linie (Typmoral 70) nur die Werte 40–42, bei Typmoral 60 (Geschütze, Mörser, Sanitäter, Scharfschützen) gar keine.
   - Der Balken auf der Karte (`ui.js:658`) ist richtig. Behebung: auch hier nach `moralStufe` färben.
3. **Marke „Flieht“ erklärt die alte Regel** (`ui.js:416`).
   - Text: „Ein Anführer in der Nähe kann sie wieder sammeln.“ Das stimmt für Zerschlagene nicht, und für Panik fehlt, dass auch ohne Anführer 20 % bestehen.
   - Behebung: zwei Texte. Zerschlagen: „Reste ziehen ab und kommen nicht wieder.“ Panik: „Sammel-Chance zu Beginn der nächsten Runde x %“ aus `E.sammelChance(G, u)`.
4. **KI gibt jedem Schuss auf einen Fliehenden den Bonus „Ziel bricht“** (`ai.js:346`).
   - Ein Fliehender hat Moral 0 oder Stärke unter 15, also gilt immer `strAfter < 1.5 || morAfter <= 0` und damit +2,5. Dazu trifft man Fliehende ×1,6.
   - Folge in der Messung: 40–54 % aller Fliehenden werden auf der Flucht vernichtet.
   - Bei Zerschlagenen ist der Schuss verschenkt: Punkte und Verlust sind schon voll gezählt, der Trupp kommt nie zurück.
   - Behebung: Fliehende Ziele gesondert bewerten. Zerschlagen: kein Bonus und Wert stark gekürzt. Panik: nur `W_FLUCHT_ZIEL` wie gebaut.
5. **Im Offenen weicht ein Trupp unter Beschuss nicht mehr zurück** (`engine.js:1370` und `1387`).
   - Wer unter 30 fällt, wankt immer (30 liegt unter 60 % jeder Typmoral über 50). Ein Wankender ist ab 3 Schaden niedergehalten, ein Gewehrtreffer im Offenen macht 3,2–5,4.
   - Der Treffer hält ihn also zuerst nieder, und Zeile 1387 lässt Niedergehaltene liegen.
   - Das ist kein Programmierfehler, sondern die Folge aus zwei Teilen meines eigenen Vorschlags. Siehe Abschnitt 4 und Frage 1.

### Klein
6. **Am Rand kein Sammelversuch** (`engine.js:1786–1788`): Die Rand-Prüfung steht vor dem Versuch. Trupps, die höchstens 2 Felder vor dem eigenen Rand in Panik geraten, sind ohne Versuch fort. Behebung: erst würfeln, dann fort.
7. **„Halten um jeden Preis“ und Banner-Nähe verhindern Flucht, aber nicht das Zurückweichen** (`engine.js:1387`, `fallBack` 1434 prüft nur den Bannerträger selbst). Ein Trupp mit Haltebefehl verlässt so sein Zielfeld. Behebung: bei `noFlee(G, d)` nicht zurückweichen.
8. **Wankende Geschütze schießen mit voller Kraft** (`engine.js:1640` `shellDmg`): ×0,85 steht nur in `preview`. Betroffen sind alle Schüsse von Geschützen, Mörsern und Minenwerfern (1699), Sperrfeuer (1709), Feuerschlag (2073) und die Fähigkeiten in 2009 / 2019 / 2024. Behebung: Faktor in `shellDmg` aufnehmen oder im Regeltext „gilt nicht für Geschütze“ schreiben.
9. **Feste alte Schwellen in der KI:** `ai.js:266` (`P.FALLBACK_MOR` statt *wankt*), `ai.js:345–346` (fest 0,8 je Schaden, 3 und 1,5, ohne Graben-Halbierung und ohne Schwelle 20), `ai.js:544` und `547` (Halten-Befehl), dazu `engine.js:1450` (Kettenflucht fest unter 30, auch im Graben).
10. **Drei verschiedene Listen für „Deckung“:**
    - `engine.js:1217` (Schwelle 20, halbe Erholung): Graben, Bunker, Fabrik, Kirche/Haus/Kapelle/Mühle, eingegraben.
    - `engine.js:1376` (halber Moralverlust): ohne Fabrik und ohne eingegraben.
    - `engine.js:1811` (Erholung 10 statt 5): kennt Haus, Kapelle und Mühle nicht. Ein Trupp im Haus erholt sich nur wie im Offenen.
    - Behebung: eine gemeinsame Funktion.
11. **Panik-Trupp, der auf der Flucht unter 15 Stärke fällt, bleibt „Panik“** (`engine.js:1383`): Er ist nie mehr sammelbar (`sammelChance` gibt 0), zählt aber weiter nur halb und steht als Ziel des Befehls mit 0 % da. Behebung: dort `aufgerieben` setzen und die Punkte gutschreiben.
12. **Flucht ohne freies Feld** (`engine.js:1459–1475`): Ohne freies Nachbarfeld und ohne Feind daneben bleibt der Trupp stehen und flieht ohne Ende. Selten, in der Messung nicht auffällig. Dazu: Ein MG bleibt auf der Flucht „aufgebaut“ (`fallBack` baut ab, `flee` nicht).
13. **Balken flackert und Tooltip sagt „weicht beim nächsten Treffer“ auch bei Geschützen** (`ui.js:658`, `3487`): Geschütze weichen nie. Marke und Kopfzeichen nehmen sie richtig aus.
14. **Info-Fenster zeigt Moral „7“** (`ui.js:4596`), Karte und Tooltip zeigen „70“.
15. **Regeln-Fenster** (`index.html:1242`): „eingegraben“ fehlt bei „Graben, Bunker oder Gebäude“.

### Geprüft und in Ordnung
- **Entsetzen einmal je gegnerischer Runde:** Der Merker ist ein Schlüssel aus Runde und Seite am Zug (`engine.js:1402`), er muss nicht zurückgesetzt werden. Generalangriff und Meldegänger liegen in derselben Runde und lösen keinen zweiten Test aus. Sperrfeuer kommt von MGs und löst nie einen Test aus. Reaktionsfeuer eines Fahrzeugs im Zug des Opfers zählt als eigene Runde, also höchstens zwei Tests je voller Runde.
- **Prozentzahl beim Befehl „Sammeln“:** Knopf (`ui.js:4230`), Ziel (`ui.js:4136`) und Würfel (`engine.js:2154`) rufen dieselbe Funktion `sammelChance(G, o, true)`. Der Knopf zeigt den höchsten Wert der Ziele. Ob die Zahl über dem Trupp wirklich erscheint (offen aus dem Bericht zu Schritt 2), habe ich ohne Browser nicht geprüft.
- **Zwei Fluchtarten:** Übergänge stimmen. Pendeln ist begrenzt: Jedes Sammeln kostet 15 %, allein ist nach zwei Erfolgen Schluss. Nach dem Sammeln steht der Trupp mit 35 als *wankt* da; ein MG-Treffer im Offenen wirft ihn sofort wieder in Panik, das ist nachvollziehbar.
- **Punkte erst am Rand und Zusammenbruch:** Die Punkte fallen genau einmal. Der Zusammenbruch kommt weiter vor (Sankt Ruß 10 von 100, Grauwall 1 von 100). Ein Fliehender zählt statt 100 nur 100 − halbe Stärke; das verzögert den Zusammenbruch höchstens um eine Runde und verhindert ihn nicht.
- **Wankt ×0,85** wirkt bei Schuss, Nahkampf, Gegenschlag, Reaktions- und Sperrfeuer, Zweitwaffe, Breitseite und Faustsalve (alle über `preview`). Der Freischlag hat einen festen Wert, das passt.
- **`SUPP_WANKT`** wirkt bei jedem Beschuss, auch Steilfeuer und Minen. Geprüft wird vor dem Moralverlust desselben Treffers; das passt zur Vorschau.
- **Rote Faust (`standhaft`), Banner, eingegraben:** arbeiten richtig mit den Stufen zusammen (weniger Moralverlust, Schwelle 20, halbe Erholung). Ausnahme ist Punkt 7.
- **Rückwege:** `STUFEN_ALT` stellt Schritt 2 exakt wieder her (gleiche Siegquoten wie der erste Lauf in `schritt2.json`).

## 3. Messwerte

Je 100 Schlachten, Startwert 1, `MISCHEN=1`. Werte je Schlacht, Konkordat / Aschenwacht.

| | Grauwall | Sankt Ruß | Winterdorf |
|---|---|---|---|
| Konkordat neu (Bericht, 1. Lauf) | **54 %** (54) | **47 %** (47) | **54 %** (54) |
| Konkordat mit `STUFEN_ALT` | 54 % | 45 % | 54 % |
| Runden neu / alt | 15,2 / 15,2 | 14,3 / 13,8 | 14,2 / 14,3 |
| Zusammenbruch (von 100) | 1 | 10 | 0 |
| Rundenanfänge *wankt* | 6,8 / 8,4 | 13,6 / 14,4 | 9,7 / 8,7 |
| Rundenanfänge *weicht* | 4,6 / 5,4 | 13,8 / 13,3 | 9,2 / 7,7 |
| Anteil *wankt* + *weicht* | 4,5 / 5,8 % | 11,0 / 10,9 % | 7,2 / 6,6 % |
| niedergehalten zu Rundenbeginn | 11 / 7 % | 14 / 8 % | 11 / 8 % |
| zurückgewichen neu | 3,3 / 4,1 | 9,5 / 8,9 | 4,8 / 4,9 |
| zurückgewichen `STUFEN_ALT` | 4,6 / 5,4 | 11,3 / 10,5 | 6,3 / 6,2 |
| Flucht wegen Stärke (zerschlagen) | 2,7 / 1,6 | 3,0 / 1,6 | 2,4 / 2,0 |
| Flucht wegen Moral (Panik) | 2,0 / 2,8 | 4,9 / 3,8 | 2,4 / 3,0 |
| gesammelt | 0,52 / 0,91 | 1,49 / 1,36 | 0,63 / 0,85 |
| – Anteil an den Panik-Fluchten | 26 / 32 % | 30 / 36 % | 26 / 29 % |
| – davon durch Befehl | 0,06 / 0,14 | 0,24 / 0,25 | 0,07 / 0,07 |
| vernichtet auf der Flucht | 2,4 / 2,3 | 3,8 / 2,6 | 2,6 / 2,0 |
| – Anteil an allen Fluchten | 50 / 48 % | 47 / 44 % | 54 / 40 % |
| entkommen am Rand | 0,9 / 0,9 | 1,4 / 1,1 | 0,4 / 1,5 |
| noch fliehend am Ende | 1,0 / 0,6 | 1,4 / 0,8 | 1,2 / 0,6 |

**Einordnung**
- **Die Zahlen aus dem Bericht stimmen.** Alle drei Siegquoten treffen den ersten Lauf in `schritt3.json` genau, die Zähler liegen dicht an den Mittelwerten.
- **Sammeln findet jetzt statt:** Rund 30 % der Trupps in Panik kommen zurück (vor U7: 2–11 % aller Fliehenden). Der Befehl der KI trägt dazu wenig bei.
- **Stufen ändern die Siegquote nicht** (0 bis +2 Punkte gegen `STUFEN_ALT`). Zurückgewichen wird 14–29 % seltener, niedergehalten 3–17 % öfter.
- **Winterdorf 56,5 % ist keine Folge von U7:** Schon die Grundmessung vor U7 hatte 58 %. Das ist eine Frage des Kartenabgleichs.
- **Winterdorf, Rand:** Fliehende der Aschenwacht entkommen dort dreimal so oft wie die des Konkordats (1,5 gegen 0,4), weil ihr Rand näher liegt.
- **Kein Dauerfliehen im Mittel:** Auf eine Flucht kommt etwa ein Rundenanfang auf der Flucht. Die längste Einzelflucht habe ich nicht gemessen.
- **Verluste je Typ unauffällig:** Sturmtruppen und Grabenräumer 69–80 %, Linie 26–53 %, Anführer 4–19 %; mit und ohne Stufen gleich.

## 4. Abwärtsspirale mit den neuen Regeln

Linientrupp (Moral 70, Stärke 100), 1 / 2 / 3 Schützen je Runde, Median aus 4000 Durchläufen. Schaden wie in der ersten Prüfung.

| Offen | *wankt* ab Runde | Schwelle *weicht* ab Runde | Ende in Runde | niedergehalten |
|---|---|---|---|---|
| Gewehr | – / 5 / 3 | – / 6 / 4 | 20 / 10 / 7 | 0 / 90 / 86 % der Runden |
| MG | 4 / 2 / 2 | 5 / 3 / 2 | 8 / 4 / 3 | 88 / 77 / 67 % |
| Mörser | 4 / 2 / 2 | 5 / 3 / 2 | 8 / 4 / 3 | 88 / 76 / 67 % |
| Geschütz | 3 / 2 / 1 | 4 / 2 / 2 | 7 / 4 / 3 | 85 / 72 / 60 % |

| Graben | *wankt* | *weicht* | Ende in Runde |
|---|---|---|---|
| Gewehr | nie | nie | 54 / 27 / 18 |
| MG, Geschütz | nie | nie | 22 / 11 / 8 |
| Mörser | nie | nie | 27 / 14 / 9 |

**Was die Rechnung zeigt**
- **Im Offenen ist die Leiter sichtbar:** nach 2–5 Runden *wankt*, eine Runde später unter der Schwelle *weicht*, 2–4 Runden danach das Ende. Das ist nachvollziehbar.
- **Das Ende ist fast immer *zerschlagen*:** in 82–100 % der Durchläufe (der Rest wird direkt vernichtet), **Panik in 0 %**. 85 Stärke Verlust kosten nur 68 Moral. Unter Beschuss gibt es also nichts zu sammeln; Panik entsteht nur durch Nahkampf, Entsetzen, Gas und Flammen.
- **Tote Stufe im Offenen:** Wirklich zurückgewichen wird in 0 % der Durchläufe (mit `STUFEN_ALT`: 100 % bei zwei oder drei Gewehrtrupps). Der Trupp liegt bis zum Ende. Im Spiel wird trotzdem 3–10-mal je Seite gewichen, aber durch Nahkampf, Entsetzen und schwache Treffer.
- **Im Graben werden die Stufen durch Beschuss nie erreicht:** Die halbe Erholung (5 je Runde) ist größer als der Moralverlust. Mit `STUFEN_ALT` wankte ein Trupp im Graben unter MG-Feuer ab Runde 18. Das passt zu „Deckung entscheidet“.
- **Sprung über eine Stufe** gibt es nur nach dem Sammeln: von 35 (*wankt*) mit einem MG-Treffer direkt in die Panik.

## 5. Anzeige und KI

**Anzeige**
- **Sichtbar ist die Stufe auf der Karte:** Balken gelb bei *wankt*, flackernd bei *weicht*; Schweißtropfen; Schlagworte „wankt ×0,85“ und „Ziel wankt: leichter niedergehalten“; Tooltip nennt die Stufe.
- **Nicht stimmig sind** die Einheitenkarte (Fehler 2), die beiden Marken (Fehler 1 und 3) und Geschütze (Fehler 13).
- **Regeln-Fenster:** Der Absatz „Moral und Flucht“ ist vollständig und richtig, aber ein einziger Block mit etwa 1100 Zeichen. Für „undurchsichtig“ (Punkt 86) würde ich ihn als Leiter mit vier Zeilen setzen (*wankt*, *weicht*, *Panik*, *zerschlagen*) und das Sammeln als eigene kurze Liste.
- **Info-Fenster der Einheit:** nennt nur die Typmoral (Fehler 14). Es fehlen die Schwellen dieser Einheit, zum Beispiel „wankt unter 42, weicht unter 30, im Graben unter 20“. Das gehört in den Tooltip des Moralbalkens.
- **Sammel-Chance:** Sie steht nur beim Befehl. Die Chance zu Rundenbeginn sieht der Spieler nirgends (Fehler 3).

**KI**
- **Sinnvoll:** Sammeln-Befehl ab 50 % Chance und 40 Stärke, Anführer und Banner stellen sich an Fliehende, Zuschlag für Schüsse, die ein Ziel zum Wanken bringen.
- **Dummheit:** Schüsse auf Zerschlagene (Fehler 4).
- **Lücke:** Die KI zieht einen eigenen wankenden Trupp nicht aus dem Offenen in Deckung, obwohl er dort jede Runde von einem einzigen Gewehrtrupp niedergehalten wird und sich nie erholt.
- **Klein:** Der Befehl wird je Anführer nur einmal zu Beginn des Zugs geprüft, also vor dem Ziehen (`ai.js:569–570`). Deshalb sammelt die KI per Befehl nur 0,06–0,25-mal je Schlacht.

## 6. Nachbesserungs-Paket U7b

| Nr. | Was | Stelle | Konstante | Aufwand | Risiko | Modell |
|---|---|---|---|---|---|---|
| 1 | Anzeige einheitlich über `E.moralStufe`: Marke „Weicht“, Balken der Einheitenkarte, kein Flackern bei Geschützen | `ui.js:423`, `658`, `3487`, `4283` | – | klein | keins (nur Anzeige) | Sonnet |
| 2 | Marke „Flieht“ mit zwei Texten und Sammel-Chance; Balken-Tooltip mit den Schwellen der Einheit; Info-Fenster Moral ×10; Regeln-Fenster als Leiter, „eingegraben“ ergänzen | `ui.js:416`, `3487`, `4596`; `index.html:1242` | – | klein | keins | Sonnet |
| 3 | KI: Zerschlagene nicht mehr beschießen, Schwellen aus `P` und `fallbackSchwelle`, `W_SAMMEL` nach Stufe *wankt* | `ai.js:266`, `345–346`, `544`, `547` | neu `W_ZERSCHLAGEN` 0,3 (Faktor auf den Zielwert) | klein bis mittel | klein bis mittel, messen (3 Karten × 4 Startwerte) | Opus |
| 4 | Kleine Regelstellen: am Rand erst Sammelversuch; Panik-Trupp unter 15 Stärke wird zerschlagen; MG baut auf der Flucht ab; eine Deckungs-Funktion (Haus, Kapelle, Mühle erholen sich mit 10); Wankt auch in `shellDmg` oder Regeltext anpassen | `engine.js:1383`, `1459`, `1640`, `1786`, `1217` / `1376` / `1811` | – | klein | klein, messen | Opus |
| 5 | Nur nach Frage 3: Haltebefehl und Banner-Nähe verhindern auch das Zurückweichen | `engine.js:1387` | – | klein | klein bis mittel (Konkordat hält Zielfelder besser) | Opus |
| 6 | Nur nach Frage 1: Zurückweichen geht vor Niederhalten (der erste Treffer der Runde, der unter die Schwelle drückt, wirft zurück; der Trupp liegt dann am neuen Feld) | `engine.js:1387` | – | klein | mittel, messen | Opus |
| 7 | Nur nach Frage 2: zuerst Probe-Messung ohne Umbau mit `P_MOR_PER_DMG=1` (sim.js kennt den Schalter), dann entscheiden | Messung | `P.MOR_PER_DMG` 0,8 → 1,0 | Messung klein | groß (trifft den Angreifer im Offenen) | Opus, Bewertung Fable |

Reihenfolge: 1 und 2 zusammen, dann 3 mit Messung, dann 4 mit Messung. 5–7 erst nach Enricos Antwort, jedes einzeln messen.

## Fragen an Enrico
1. **Soll ein Trupp im Offenen wieder zurückweichen, statt niedergehalten liegen zu bleiben, bis er zerschlagen ist?** Empfehlung: ja (Paket-Punkt 6). Sonst sieht man die Stufe *weicht* unter Beschuss im Offenen nie.
2. **Soll schwerer Beschuss im Offenen eher zu Panik (sammelbar) führen als zu „zerschlagen“ (endgültig)?** Empfehlung: erst nur messen (Punkt 7) und nur übernehmen, wenn die Siegquoten in der Streuung bleiben. Heute lohnt das Sammeln nur nach Nahkampf, Entsetzen, Gas und Flammen.
3. **Sollen „Halten um jeden Preis“ und ein aufgepflanztes Banner auch das Zurückweichen verhindern, nicht nur die Flucht?** Empfehlung: ja, das erwartet man vom Namen.
4. **Soll ein Trupp, der den eigenen Rand erreicht hat, dort noch einen letzten Sammelversuch bekommen?** Empfehlung: ja, das ist eine Zeile und hilft vor allem Trupps aus den hinteren Stellungen.
