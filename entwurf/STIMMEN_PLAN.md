# Stimmen-Plan V1 (Punkt 102, 2026-11-26) – nur Liste und Texte, nichts gebaut

Ziel (Enrico 17:58/18:08): Alle menschlichen Einheiten klingen wie durch **Gasmaske und Funk** („Vox“). Je Fraktion wenige feste Sprecher, damit es wie aus einem Guss klingt. Kurze, disziplinierte Rufe wie militärische Bestätigungen, gleichmäßiges Tempo, wenig Gefühl. **Ausnahme Not** (Rückzug, Panik, schwer verwundet, Gas, niedergehalten, Tod): lauter und gehetzter, derselbe Funk-Klang. Maschinen behalten ihre Maschinenstimme.

**Sprache:** jetzt für **beide Seiten Deutsch** (der Plan aus Paket F, `entwurf/postfach/STIMMEN_FEHLEN.md`, hatte das Konkordat noch englisch). Blaue Legion = Konkordat-Stimmen. Helden behalten ihre eigenen Stimmen (`HELD_ST`), der Löwenoger brüllt (keine Worte).

**Texte zum Abarbeiten:** `entwurf/stimmen_texte.csv` (477 Zeilen, Semikolon, UTF-8; Spalten id, fraktion, sprecher, anlass, einheit, text). Erzeugt mit `python tools/stimmen_plan.py` – Texte dort ändern, nicht in der CSV.

## 1. Sprecher (Vorschlag)

| Kürzel | Fraktion | Stimme | spricht für | Filter im Spiel (V3) |
|---|---|---|---|---|
| **K1** | Konkordat | Mann um 35, mittlere Lage, ruhig, leicht rau | Fußtruppen: Linie und Unterstützung (Kohorte, MG, Mörser, Pioniere, Sanitäter, Fernsprech, Melder, Flammen, Scharfschützen, Mineure, Versorgung, Ballon, Geschützbedienung) | Funk-Gasmaske leicht |
| **K2** | Konkordat | Mann um 30, tiefer, gepresst, kantig | Grabenräumer, Stahlreiter | mittel |
| **K3** | Konkordat | Mann um 50, tief, klar, befehlsgewohnt | Hauptmann, General; Besatzung Landkoloss | leicht (Anführer) bzw. Bordfunk (Koloss) |
| **KM** | Konkordat | vorhandene Maschinenstimme (`sst_*`, Filter Maschine) | Turm-, Ordens-, Kreuzschreiter | Maschine |
| **A1** | Aschenwacht | Mann um 40, mittlere Lage, trocken, knapp | Fußtruppen: Grenadiere und Unterstützung (Sensenwerk, Minenwerfer, Pioniere, Sanitäter, Signal, Banner, Panzerbüchse, Brand, Gasschutz, Munition, Pirschjäger, Geschützbedienung) | Funk-Gasmaske leicht |
| **A2** | Aschenwacht | Mann um 30, tief, hart | Sturmbrecher, Schwere Grabenwacht, Panzerknechte, Sprenglanzen-Reiter | mittel |
| **A3** | Aschenwacht | Mann um 55, tief, langsam, kalt | Hauptmann, General; Besatzung Sturmpanzer | leicht bzw. Bordfunk |
| **AM** | Aschenwacht | vorhandene Maschinenstimme | Eisenknecht, Säge-, Klauen-, Bohrschreiter, Eiserne Hünen | Maschine |

Damit hat jede Fraktion **drei menschliche Sprecher** und die Maschinenstimme. Für V2: K1/A1 brauchen die meisten Zeilen (je etwa 75), K2/A2 und K3/A3 je 60–70, Maschine je 30–35.

## 2. Anlässe – was es heute gibt, was fehlt

Heute = Tonplatz im Spiel (aus `RUF_STANDARD`, `rufBeiEreignis`, `selectVoice`, `TONWAHL`, `SST`). „Stelle“ = gibt es schon eine Abspielstelle in ui.js? Not-Anlässe sind **fett**.

| Anlass (`anlass` in der CSV) | heute | Stelle | Gruppen mit neuen Texten |
|---|---|---|---|
| anwahl (Anklicken) | Sprüche `sv_inf/anzug/fuehrer/panzer/schreiter_*` (Suno, alte Sätze) | ja (`selectVoice`) | alle – ersetzt die alten Sprüche |
| befehl (Ziehen / Befehl bestätigt) | stumm (`ruf('vorruecken')` nur ab 3 Feldern, ohne Ton) | teils | alle |
| angriff (Schuss bzw. Nahkampf beginnt) | Kampfschrei `cry` (kein Wort), `ruf_feuer` nur bei Anführer-Befehl | ja (`feuer`, `sturm`) | alle |
| **rueckzug** | stumm | ja (`rueckzug`) | alle |
| **panik** (Flucht) | `panik_einzeln/_gruppe` (ElevenLabs, alte Sprecher) | ja | alle – mit den festen Sprechern neu |
| **verwundet** (schwer, Stärke unter 35) | `medic`/Stöhnen | ja (`sanitaeter`) | alle |
| sammeln (Moral zurück) | stumm | ja (`sammeln`) | alle |
| **tod** (aufgerieben) | `sterben_einzeln/_gruppe` (alte Sprecher) | ja | alle |
| erscheinen (Nachschub, Aufstellung) | **keiner** | **nein – neue Abspielstelle in V3** (Ereignis `buy` bzw. Ende der Aufstellung) | je Einheit 2 Fassungen |
| **niedergehalten** | stumm | ja | Fußtruppen |
| **gas** | Husten | ja | Fußtruppen |
| granate | stumm | ja | Fußtruppen, Sturm |
| feuerbereit (Feuerbereitschaft, MG-Sperrfeuer) | stumm | ja | Fußtruppen |
| feuer (eigener Schuss) | stumm | ja | Fußtruppen |
| zielfeld (genommen) | stumm | nein (neue Stelle in `ctrlSync`) | Fußtruppen, Sturm |
| koloss (Entsetzenstest, Feindgerät) | stumm | ja (`koloss`) | Fußtruppen |
| schilde („Schilde vor“) | stumm | nein (Ereignis `shields`) | Grabenräumer |
| gegenstoss | stumm | nein (Ereignis `counterstrike`) | Sturmbrecher |
| dauerfeuer | stumm | nein (Ereignis `dauerfeuer`) | Eiserne Hünen (Maschinenstimme AM) |
| getroffen, panne | Motor/Krach | nein | Panzer |
| befehl_sammeln, befehl_feuerfrei / befehl_sturm, grossbefehl | Konkordat `stand`/`forward`, Aschenwacht Brüllen `roar` | ja (Befehls-Ereignisse) | Anführer |
| nahkampf, schwer, feind (Schreiter) | `sst_*` – **beide Seiten dieselben** 2 Fassungen | ja (`schreiterRuf`) | Schreiter, jetzt je Seite eigene Texte |

**Was heute ganz fehlt:** Erscheinen (alle Einheiten), Ziehen bestätigt, Rückzug, Sammeln, Niedergehalten, Granate, Zielfeld, alle Panzer-Rufe außer Anklicken, Schreiter-Texte getrennt nach Seite. **Was ersetzt wird:** Anklicken-Sprüche (Suno), Panik und Sterben (alte ElevenLabs-Sprecher) – damit alle Rufe von denselben festen Sprechern kommen.

## 3. Gruppen × Anlass (Anzahl Fassungen in der CSV)

| Gruppe | anwahl | befehl | angriff | rueckzug | panik | verwundet | sammeln | tod | weitere |
|---|---|---|---|---|---|---|---|---|---|
| Fußtruppen (fuss) | 4 | 4 | 4 / 3 | 3 | 3 | 3 | 3 | 3 | niedergehalten, gas, granate, feuerbereit, feuer, zielfeld, koloss je 3 |
| Sturm/Elite zu Fuß (sturm) | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | Konkordat: granate, schilde, zielfeld; Aschenwacht: granate, gegenstoss |
| Reiter (reiter) | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | – |
| Panzerbesatzung (panzer) | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | getroffen, panne |
| Anführer (fuehrer) | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | befehl_sammeln, befehl_feuerfrei bzw. befehl_sturm, grossbefehl |
| Schreiter (schreiter, Maschine) | 3 | 3 | 3 | – | – | – | – | 3 | nahkampf, getroffen, schwer, feind; Aschenwacht dazu dauerfeuer (Hünen) |
| Erscheinen | je Einheit 2 (22 Konkordat-, 25 Aschenwacht-Einheiten) | | | | | | | | |

## 4. Beispiele (vollständig in der CSV)

| Anlass | Konkordat | Aschenwacht |
|---|---|---|
| anwahl (Fuß) | „Bereit.“ · „Zu Befehl.“ · „Hier.“ · „Wartet auf Befehl.“ | „Bereit.“ · „Hier.“ · „Befehl?“ · „Gruppe hört.“ |
| befehl (Fuß) | „Verstanden.“ · „Rücken vor.“ · „Wird gemacht.“ | „Bestätigt.“ · „Vorrücken.“ · „Ausgeführt.“ |
| angriff (Sturm) | „Rein in den Graben!“ · „Räumen!“ · „Schilde vor, drauf!“ | „Zum Sturm!“ · „Durch!“ · „Brecht sie!“ |
| **rueckzug** (Reiter) | „Abdrehen!“ · „Wenden, zurück!“ | „Abschwenken!“ · „Wenden, zurück!“ |
| **verwundet** (Panzer) | „Schwer beschädigt!“ · „Feuer im Motorraum!“ | „Schwer beschädigt!“ · „Brand im Heck!“ |
| grossbefehl | „Keinen Schritt zurück!“ · „Diese Linie hält!“ | „Alle Mann – Angriff!“ · „Ganze Linie vor!“ |
| erscheinen | „Grabenräumer, zur Stelle!“ · „Räumer und Schilde bereit.“ | „Sturmbrecher, zur Stelle!“ · „Stoßtrupp bereit.“ |

Ton: sachlich, keine Verherrlichung, keine Formeln echter Armeen; die Aschenwacht nüchtern-hart, das Konkordat etwas ruhiger und förmlicher.

## 5. Hinweise für V2 (Berater, fal.ai) und V3 (CC)

- **V2:** Je Sprecher zuerst die Hörprobe (3–4 Rufe, z. B. `*_anwahl_1`, `*_befehl_2`, `*_rueckzug_1`, `*_tod_1`), Enrico entscheidet, dann der Rest. Not-Anlässe (fett oben) mit „gerufen, gehetzt“ anweisen (Eleven v3 Sprach-Tags), die übrigen „ruhig, knapp, wie über Funk“. Ablage `sound-quelle/Voices/eigene/el/<fraktion>/<id>.mp3` – Dateiname = `id` aus der CSV.
- **V3:** neue Tonplätze `ruf_<anlass>_<gruppe>_<A|D>` (Pools mit den Fassungen), `RUF_STANDARD` erweitern, neue Abspielstellen für erscheinen, zielfeld, schilde, gegenstoss, dauerfeuer, panzer getroffen/panne; Sprecher je Einheit über die Gruppe (Tabelle 1), Filter „Funk-Gasmaske“ ersetzt `_gm/_gs/_bf`, Rückweg-Schalter. Danach `slotsVon`, Ton-Spur, Pult-Bibliothek (`HOER`).
- Häufigkeit im Spiel (Vorschlag): Anwählen wie heute über `selectVoice` (Beutel ohne Wiederholung), Befehl bestätigt höchstens jedes zweite Mal, Not-Rufe immer, sonst wie die heutige Seltenheit in `ruf()`.
