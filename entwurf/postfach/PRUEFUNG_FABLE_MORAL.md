# Prüfung Moral vor U7 – Ergebnis (27.11.2026)

Auftrag: `PRUEFAUFTRAG_FABLE_MORAL.md`. Nur gelesen, gerechnet und gemessen; in `src/` und `tools/` ist nichts geändert.
Zahlen wie im Code (Moral 7 = 70 in der Anzeige, Stärke 10 = 100). Schaden und Moralverlust in den Tabellen schon ×10 wie in der Anzeige.

## Das Wichtigste in fünf Sätzen
1. **Moral entscheidet heute fast nichts.** Unter reinem Beschuss flieht ein Linientrupp immer wegen Stärke < 15, nie wegen Moral; 90–94 % aller Trupps stehen zu Rundenbeginn bei über 60 % Moral.
2. **Die echte Abwärtsspirale ist das Niederhalten:** Zwei Gewehrtrupps auf einen ungedeckten Trupp halten ihn jede Runde nieder – er schießt nie wieder und erholt sich nie.
3. **Sammeln findet praktisch nicht statt:** 2–11 % der Fliehenden werden gesammelt. Der Rand ist nach gut einer Runde erreicht, ein Anführer steht selten nah genug, und wer wegen Stärke flieht, ist gar nicht sammelbar.
4. **Kettenflucht und Zusammenbruch gibt es kaum:** 0,01–0,12 Kettenfluchten je Schlacht; Zusammenbruch in 0 von 100 (Grauwall) bzw. 3 von 100 Schlachten (Sankt Ruß).
5. **Entsetzenstests sind sehr häufig:** 36–45 je Schlacht, ein Viertel bis ein Drittel davon sind Wiederholungen in derselben gegnerischen Runde.

## 1. Stand und Fehler

Der Stand im Prüfauftrag stimmt bis auf diese Punkte:

**Berichtigungen**
- **`P.WALKER_FEAR` läuft nicht mehr.** Es greift nur noch mit dem Schalter `ENTSETZ_ALT` (moveUnit); in allen Läufen 0 Fälle.
- **Furcht-Aura:** −1 Moral (`P.FURCHT_MOR_U5`; `P.FURCHT_MOR` 0,4 gilt nur im Rückweg `MODELLSCHADEN_ALT`), zu Beginn der Runde des Betroffenen, Boden 0,5, ohne Niederhalten, ohne Abzug durch Offizier/Banner.
- **Offizier-Reichweiten sind uneinheitlich:** Moralschutz ×0,8 und Erholung ×1,5 gelten nur **1 Feld** (`officerAt` → `cmdRange` → `P.ORDER_R`), das Sammeln Fliehender **2 Felder** (`P.OFFICER_RANGE`), der Abzug im Entsetzenstest 1 Feld.
- **Graben halbiert nicht bei Flammen** (`!o.flame`), Flammen kosten zudem Moral ×2 (`P.FLAME_MOR`).

**Vergessene Moralabzüge (alle in engine.js; ui.js und ai.js ändern die Moral nirgends, sie zeigen nur an)**
- Gas: −1,5 je Rundenbeginn in der Wolke (`P.GAS_MOR`), vergiftet danach ½ und ¼ davon.
- Löwengebrüll: −2 (`P.ROAR_MOR`, mit Offizier ×0,8 / Banner ×0,75), niedergehalten, kann zur Flucht führen.
- Heldenfall: ganze Seite −1 (`P.HELD_FALL_MOR`). „Kopf runter!“: −1 (`P.KOPF_MOR`) und niedergehalten.
- Sturmrollen `+P.ROLLEN_MOR`, Durchbruch `+P.DURCH_MOR` 1,5, Stollen ×1,5; Draht, Feuer ×0,5; Rammen (selbst) ×0,3; Mine, Einsturz, Eisbruch normal.
- Kettenflucht-Nachbarn −0,5. Aufwärts: Sanitäter +1,5 (`P.HEAL_MOR`), Befehl Sammeln +1,5.

**Fehler und Ungereimtheiten**
1. **Wer wegen Stärke < 15 flieht, kann nie gesammelt werden** (Bedingung `u.str >= P.ROUT_STR` beim Sammeln). Das sind 21–69 % aller Fluchten (je Seite und Karte).
2. **Gesammelte bekommen Moral 3 – genau die Rückzugsschwelle** (`mor < P.FALLBACK_MOR`). Der nächste Treffer lässt sie sofort wieder zurückweichen.
3. **Kettenflucht und Gas-Flucht gehen an `routUnit` vorbei:** kein erster Fluchtschritt, bei Kettenflucht bleibt `supp` stehen. Die Gas-Flucht bekommt noch im selben Rundenbeginn einen Sammelversuch.
4. **Die 20 Punkte (`credit`) fallen schon bei Fluchtbeginn** und bleiben beim Gegner, auch wenn der Trupp gesammelt wird; `losses()` zählt ihn dann wieder normal.
5. **Abzüge ohne Fluchtprüfung:** Furcht-Aura (Boden 0,5), Entsetzen (Boden 0,1), Heldenfall und „Kopf runter!“ lösen selbst nie Flucht aus; der Trupp steht mit Moral 0 da, bis der nächste Treffer kommt.
6. **Zurückweichen mehrmals je gegnerischer Runde:** jeder Treffer unter Moral 3 schiebt den Trupp ein Feld weiter (auch aus dem Graben heraus).
7. **`P.SUPP_ATK` 0,5 ist tot:** Niedergehaltene dürfen gar nicht schießen, der Faktor greift nur mit dem Sim-Schalter `NOSUPP`.
8. **Entsetzenstest auch beim Gegenschlag** eines angegriffenen Fahrzeugs und bei Zweitwaffe/Breitseite (bekannt, Bauplan 11.5).

## 2. Messwerte

Je 100 Schlachten, Startwert 1, feste Aufstellung. Werte **je Schlacht, Konkordat / Aschenwacht**.

| | Grauwall | Sankt Ruß |
|---|---|---|
| Siegquote Konkordat | **20 %** | **86 %** |
| Siegart | 100 × Punkte | 97 × Punkte, 3 × Zusammenbruch (Konkordat bricht) |
| Runden Ø | 14,7 | 12,8 |
| niedergehalten | 34,8 / 26,8 | 38,3 / 18,1 |
| zurückgewichen | 4,9 / 10,3 | 9,7 / 13,2 |
| Flucht gesamt | 4,4 / 4,6 | 4,6 / 5,2 |
| – wegen Stärke < 15 | 3,0 / 1,4 | 1,8 / 1,1 |
| – wegen Moral 0 | 1,4 / 3,1 | 2,8 / 4,1 |
| – davon Kettenflucht | 0,03 / 0,01 | 0,06 / 0,12 |
| – davon Gas zu Rundenbeginn | 0,17 / 0,28 | 0,13 / 0,51 |
| gesammelt (automatisch) | 0,10 / 0,24 | 0,34 / 0,57 |
| entkommen am Rand | 1,7 / 2,2 | 1,6 / 2,0 |
| vernichtet auf der Flucht | 1,9 / 1,6 | 1,6 / 2,1 |
| noch fliehend bei Schlachtende | 0,6 / 0,6 | 1,0 / 0,5 |
| Runden von Flucht bis Rand Ø | 1,1 | 1,3 |
| Rundenanfänge auf der Flucht | 5,4 / 4,7 | 6,7 / 5,5 |
| – Sammel-Chance bestand überhaupt | 0,16 / 0,35 (3 % / 7 %) | 0,60 / 0,87 (9 % / 16 %) |
| Befehl „Sammeln“ (KI) | 1,9 / 1,2 | 1,1 / 1,6 |
| „hält stand“ (Banner/Halten) | 0,1 / 0,5 | 0,4 / 0,1 |
| Entsetzenstests | 45,1 | 36,4 |
| – durchgefallen | 9,8 (22 %) | 7,0 (19 %) |
| – Wiederholung in derselben gegn. Runde | 15,1 (34 %), durchgefallen 3,4 | 8,5 (23 %), durchgefallen 1,6 |
| Furcht-Aura (Abzüge) | 1,0 | 0,5 |
| Löwengebrüll, Heldenfall | 0 (ohne `MECHS`) / 0 | 0 / 0 |
| Moral zu Rundenbeginn (Fußtruppen): ≥ 60 % / 35–60 % / < 35 % | 94 / 3 / 2 % | 90 / 6 / 4 % |
| niedergehalten zu Rundenbeginn | 10 % | 10 % |

**Zusammenbruch und „Flucht zählt erst am Rand“:** Von den 3 Zusammenbrüchen (Sankt Ruß) wären 2 noch nicht eingetreten, wenn Fliehende erst am Rand zählen, und 1, wenn sie halb zählen.

**Empfindlichkeit (Grauwall, je 100 Schlachten, Grundwert 20 %):**

| Lauf | Konkordat | Bemerkung |
|---|---|---|
| `NOSUPP=1` (Niedergehaltene schießen ×0,5 und weichen zurück) | 25 % | Zurückweichen verdoppelt sich (12 / 20) |
| `P_ENTSETZ_BASIS=-1` (Entsetzen fast aus, 2 % durchgefallen) | 18 % | Zurückweichen 4,4 / 7,3 |
| `P_ROUT_STR=0.5` (Flucht erst unter 5 Stärke) | 24 % | Flucht 2,6 / 3,9 |

Alle drei liegen innerhalb der Streuung (±8 Punkte bei 100 Schlachten). **Kein einzelner Moral-Hebel verschiebt die Quote stark.**

**Hinweise zur Messung**
- **Die feste Aufstellung taugt nicht als Basis für U7:** Grauwall 20 %, Sankt Ruß 86 %. Die letzten Berichte messen mit `MISCHEN=1` (etwa 50 / 49 %). Zwischenmessungen für U7 bitte mit `MISCHEN=1` und vier Startwerten.
- sim.js zählt heute nur Flucht (ohne Gas-Flucht zu Rundenbeginn) und Entsetzen. Alles andere habe ich mit einer **Wegwerf-Hülle außerhalb des Repos** gezählt (sie fängt die Ereignisse von `AI.exec`, `E.endTurn`, `E.startTurn` ab; sim.js blieb unverändert).
- **Vorschlag: diese Zähler fest in sim.js aufnehmen:** `supp`, `fallback`, `rout` getrennt nach Stärke/Moral/Kette/Gas, `rally`, `escaped`, vernichtet auf der Flucht, Sammel-Chance je Flucht-Rundenanfang, Entsetzen-Wiederholungen, Moralstufen zu Rundenbeginn; dazu die Ereignisse aus `endTurn`/`startTurn` mitzählen.
- Verbraucht: 6 Läufe (1 Probelauf mit 4 Schlachten, 2 Grundläufe, 3 Empfindlichkeit).

## 3. Abwärtsspirale (Linientrupp, Moral 70, Stärke 100)

Schaden aus `preview`/`shellDmg`, Moral = Schaden × 0,8 (im Graben × 0,5). Niedergehalten ab 6 Schaden in einer Runde.

| Schütze | Offen: Schaden / Moral je Treffer | Graben: Schaden / Moral je Treffer |
|---|---|---|
| Gewehr (Linie) | 4,3 / −3,4 | 1,6 / −0,6 |
| MG | 10,7 / −8,5 | 4,0 / −1,6 |
| Mörser | 11,1 / −8,9 | 3,2 / −1,3 |
| Geschütz / Haubitze | 13,9 / −11,1 | 4,0 / −1,6 |
| Minenwerfer | 16,7 / −13,3 | 4,8 / −1,9 |

**Runden bis zur Flucht** (Median aus 2000 Durchläufen mit Zufall ±25 %, 1 / 2 / 3 Schützen je Runde):

| Schütze | Offen | Graben |
|---|---|---|
| Gewehr | 20 / 10 / 7 | nie / 27 / 18 |
| MG | 8 / 4 / 3 | 22 / 11 / 8 |
| Mörser | 8 / 4 / 3 | 27 / 14 / 9 |
| Geschütz / Haubitze | 7 / 4 / 3 | 22 / 11 / 8 |
| Minenwerfer | 6 / 3 / 2 | 18 / 9 / 6 |

**Was die Rechnung zeigt**
- **Flucht kommt immer über die Stärke:** 85 Stärke Verlust kosten nur 68 Moral (im Graben 34). Die Moral erreicht unter Beschuss nie vor der Stärke die Null.
- **Moral-Fluchten entstehen woanders:** Entsetzen, Nahkampf (umzingelt +1), Gas, Flammen.
- **Niederhalten ist die Falle:** Im Offenen reicht ein MG oder Geschütz bzw. zwei Gewehrtrupps für Niederhalten in jeder Runde. Der Trupp schießt nicht, erholt sich nicht und weicht nicht zurück (er kann nur wegziehen).
- **Der Graben schützt die Moral gut:** etwa 2,7-mal weniger Schaden und 5,4-mal weniger Moralverlust; Gewehre halten dort praktisch nie nieder (3 × 1,6 < 6). „nie“ in der Tabelle = über 40 Runden.

## 4. Vorschlag U7 in drei Schritten

Bau-Reihenfolge vom kleinsten zum größten Risiko, nach jedem Schritt messen (`MISCHEN=1`, vier Startwerte, beide Karten, mit den Zählern aus Abschnitt 2).

### Schritt 1 – Entsetzen einmal je Runde, Aura und Gebrüll über den Test (Punkt 45b)
- **Regel:** höchstens ein Entsetzenstest je Einheit und gegnerischer Runde (`u.entsetztIn` = Runde + Seite).
- **Furcht-Aura:** statt fest −1 ein Test zu Rundenbeginn mit eigenem Grundwert `P.FURCHT_BASIS` 0,35 (gleiche Einflüsse wie `entsetzenP`); durchgefallen Moral −1, kein Niederhalten.
- **Löwengebrüll:** Test je Ziel mit `P.ROAR_BASIS` 0,5; durchgefallen wie heute (−2, niedergehalten), bestanden nur `P.ROAR_BESTANDEN` −0,5.
- **Anzeige:** dieselben Kopfzeichen wie beim Entsetzen (Funkeln / Angst).
- **Rückweg:** `ENTSETZ_OFT`, `FURCHT_ALT`.
- **Erwartete Wirkung:** Tests −23 bis −34 %, Durchfaller −1,6 bis −3,4 je Schlacht; weniger Zurückweichen bei der Seite ohne Fahrzeuge. Die Aura wird im Schnitt schwächer (heute sicher −10 je Runde).
- **Aufwand:** klein. **Risiko:** klein (Entsetzen fast ganz aus verschob Grauwall nur 20 → 18 %). Gebrüll mit `MECHS=1` gesondert messen.

### Schritt 2 – Flucht langsamer, mehrfaches Sammeln, Verlust erst am Rand
- **Zwei Arten Flucht:** Stärke < `P.ROUT_STR` = „aufgerieben“ (Reste gehen zurück, endgültig, zählt sofort wie heute). Moral 0 = „flieht“ (sammelbar).
- **Langsamer:** nach dem ersten Fluchtschritt (2 Felder) je Runde nur `P.FLUCHT_BP` 2 Felder statt mv + 1; am Rand erst zu Beginn der **nächsten** eigenen Runde weg. Das gibt 2–4 Sammelversuche statt einem.
- **Sammeln zu Rundenbeginn für jeden Fliehenden ohne Feind daneben** (eine Funktion `sammelChance(G, u)` für Regel, Anzeige und KI):
  - allein `P.RALLY_ALLEIN` 0,2; in Deckung +`P.RALLY_DECKUNG` 0,15; Banner bis 2 Felder +`P.RALLY_BANNER` 0,2;
  - Hauptmann bis 2 Felder `P.RALLY` 0,6 (wie heute); General bis 2 Felder `P.RALLY_GENERAL` 0,8;
  - jeder frühere Sammelerfolg derselben Einheit −`P.RALLY_MUEDE` 0,15; Obergrenze 0,9.
  - Gesammelt: Moral `P.RALLY_MOR` 3,5 (statt 3, damit nicht der erste Treffer wieder zum Rückzug führt), Runde verloren wie heute.
- **Befehl „Sammeln“ auf Fliehende (Punkt 86):** Hauptmann 2 Felder, General 3 (`P.SAMMELN_R`); Chance = `sammelChance` + `P.SAMMELN_BEFEHL` 0,2, **als Prozent am Knopf und am Ziel**; kostet die Aktion und einen der 3 Befehle; bei Erfolg handelt der Trupp in der nächsten Runde normal.
- **Verlust erst am Rand:** Fliehende zählen in `losses()` halb (Mittel aus „voll“ und „fehlende Stärke“), voll erst bei entkommen/vernichtet; die 20 Punkte (`credit`) ebenfalls erst dann.
- **Kettenflucht:** Werte lassen (sie kommt praktisch nicht vor), nur über `routUnit` vereinheitlichen und auf Nachbarn unter `P.FALLBACK_MOR` begrenzen. Massen-Weglaufen ist heute kein Ketten-Problem, sondern viele Einzelfluchten ohne Rückweg.
- **Rückweg:** `FLUCHT_ALT`.
- **Erwartete Wirkung (Schätzung):** gesammelt von 0,1–0,6 auf etwa 0,5–1,5 je Seite und Schlacht; der Gegner bekommt je Schlacht etwa 10–30 Nachschubpunkte weniger und die übrigen Flucht-Punkte eine bis zwei Runden später; Zusammenbruch noch seltener (heute schon 0–3 %).
- **Aufwand:** mittel (Regel, Knopf mit Prozent, Zustandsmarke „flieht/aufgerieben“, KI). **Risiko:** mittel – die Seite mit mehr Moral-Fluchten gewinnt (Aschenwacht 3,1–4,1 gegen 1,4–2,8).

### Schritt 3 – Moral in Stufen
Eine Funktion `moralStufe(u)` aus dem Anteil `mor / Typmoral`, für Regel, Anzeige und KI:

| Stufe | Schwelle | Wirkung | Anzeige |
|---|---|---|---|
| standhaft | ≥ `P.WANKT` 0,6 | wie heute | – |
| **wankt** | < 0,6 (Linie unter 42) | Schuss und Nahkampf ×`P.WANKT_ATK` 0,85; niedergehalten schon ab `P.SUPP_WANKT` 0,3 statt 0,6 Schaden | Schweißtropfen pulsiert, Moralbalken gelb |
| **niedergehalten** | wie heute (Beschuss) | kein Schuss, kein Sturm (wie heute); neu: in Graben/Bunker/Gebäude halbe Erholung `P.RECOVER_SUPP` 0,5 | Marke wie heute |
| **weicht zurück** | < `P.FALLBACK_MOR` 3; in Graben/Bunker/Gebäude erst < `P.FALLBACK_DECKUNG` 2 | ein Feld zurück, **höchstens einmal je gegnerischer Runde** (`u.gewichen`) | Schweißtropfen steigt |
| **flieht** | Moral 0 | wie Schritt 2 | weiße Fahne / Staubwolke |

- `P.MOR_PER_DMG` bleibt: Im Offenen wankt ein Trupp nach etwa 35 Stärke Verlust und weicht nach 50; im Graben erreicht er die Stufen unter Beschuss fast nie. Das passt zu „Deckung entscheidet“.
- **Rückweg:** `STUFEN_ALT`.
- **Erwartete Wirkung:** betrifft 6–10 % der Trupp-Runden (gemessen unter 60 % Moral). Die Leiter Beschuss → wankt → leichter niedergehalten → weicht wird sichtbar; Zurückweichen sinkt (heute 5–13 je Seite).
- **Aufwand:** mittel bis groß (Regel, Vorschau-Schlagworte, Info-Fenster, Kopfzeichen, KI). **Risiko: am größten** – neuer Abzug für wankende Trupps trifft vor allem den Angreifer im Offenen.

### Was die KI wissen muss (ai.js)
- **Sammeln:** Anführer nutzt den Befehl auf Fliehende ab `sammelChance` ≥ 0,5 und Stärke ≥ 40; heute kennt die KI Fliehende gar nicht.
- **Anführer und Banner stellen:** Feldwert `W_SAMMEL` für Felder bis 2 Felder an wankenden oder fliehenden eigenen Trupps.
- **Fliehende Gegner:** Bonus `W_FLUCHT_ZIEL`, wenn ein gegnerischer Anführer bis 3 Felder steht (sonst kommt der Trupp zurück); heute gibt es nur den Reiter-Bonus.
- **Wankende Ziele:** Bonus `W_WANKT`, wenn der Schuss das Ziel unter eine Schwelle drückt (wie der vorhandene Bonus fürs Niederhalten).
- **Fahrzeuge:** nichts nötig; durch „einmal je Runde“ lohnt der zweite Schuss auf dasselbe Ziel etwas weniger.
- Eigene Fliehende schützen: nicht nötig, sie laufen selbst; nur nicht im Weg stehen (Flucht ohne freies Feld neben Feinden = vernichtet).

## 5. Risiko und Reihenfolge
- **Stärkster Hebel auf die Siegquote: Schritt 3** (neuer Abzug „wankt“), danach die Nachschubpunkte in Schritt 2. Schritt 1 ist fast neutral.
- **Reihenfolge:** Schritt 1 → messen → Schritt 2 → messen → Schritt 3 → messen. Jeder Schritt hat einen eigenen Rückweg-Schalter.
- **Vor Schritt 1:** die Zähler aus Abschnitt 2 in sim.js aufnehmen und eine Grundmessung mit `MISCHEN=1` festhalten.
- **Nicht in U7 anfassen:** `P.BREAK` (gleiche Schwelle ist U8) und `P.MOR_PER_DMG`.

## Fragen an Enrico
1. **Sollen „Aufgeriebene“ (Stärke unter 15) endgültig weg sein und nur Trupps in Panik (Moral 0) sammelbar?** Empfehlung: ja – klar lesbar, und ein gesammelter Rest von 10 Stärke nützt niemandem.
2. **Sollen Fliehende bis zum Rand nur halb als Verlust zählen und die 20 Punkte erst am Rand fallen?** Empfehlung: ja, halb. Voll erst am Rand macht den Zusammenbruch fast unmöglich (heute schon 0–3 %).
3. **Die Furcht-Aura wird über den Test im Schnitt schwächer (heute sicher −10 je Runde, neu etwa jede dritte Runde −10). In Ordnung?** Empfehlung: ja mit Grundwert 0,35; wenn der Kürassier dadurch zu zahm wirkt, auf 0,5 heben.
4. **Niederhalten bleibt „kein Schuss“, bekommt aber in Deckung halbe Erholung – oder sollen Niedergehaltene mit halber Kraft schießen dürfen?** Empfehlung: kein Schuss lassen (die Sperre im Offenen ist gewollt), nur die halbe Erholung in Deckung.
