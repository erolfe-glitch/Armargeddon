# Symbol-Liste: alle Fähigkeiten, Aktionen und Knöpfe

Symbolbögen (ausgeschnitten in `ui-quelle/teile/<bogen>/`, Namen sind über alle Bögen eindeutig):

- `bogen3c_symbole` (seit 2026-11-18, ersetzt bogen3b; totenkopf nur abgelegt): zielen, nahkampf, marsch, fahne, totenkopf, schild, gas, granate_artillerie, zahnrad, sanitaeter, blitz, handgranate, gewehr, pferd, fernglas, sanduhr
- `bogen4a_symbole`: drahtschere, drahtrolle, auge, haken, drehpfeil, mg_dreibein, sperrfeuer, lafette, flamme
- `bogen4b_symbole`: meldehund, schraubenschluessel, nebel, spitzhacke, sprengladung, tellermine, scheinwerfer, gasmaske, munitionskiste
- `symbol_schaufel` (Einzelsymbol, 2026-11-18): schaufel
- `bogen7_zustandszeichen` (2026-11-19, Kopfzeichen über den Figuren, Schlüssel k_*): blitze, tropfen, schweiss (Staubwolke), angst, gas, gift, feuer, panne, klingen, wut, auge, pfeil, garbe, funkeln (Stern), kreuz, reserve (nur abgelegt)
- `bogen4c_symbole`: panzerbrecher, durchsickern, niedergehalten, flucht, gebrochen (vorläufig), festgefahren, walze

„– (Text)“ heißt: reiner Textknopf, ein Symbol ist nicht nötig.

## 1. Aktionen jeder Einheit

| Name | Symbol | Symbol fehlt? |
|---|---|---|
| Beschuss / Schießen | s_zielen | nein |
| Nahkampf | s_nahkampf | nein |
| Ziehen | s_marsch | nein |
| Marsch (doppelte Zugweite) | s_marsch | nein |
| Feuerbereitschaft | s_auge | nein |
| Fertig (Einheit setzt aus) | s_haken | nein |
| Drehen links | s_drehpfeil | nein |
| Drehen rechts | s_drehpfeil, gespiegelt | nein |
| Draht schneiden | s_drahtschere | nein |
| Abbrechen (Nachschub nicht setzen) | – (Text) | nein |

## 2. Aktionen bestimmter Einheiten

| Name | Wer | Symbol | Symbol fehlt? |
|---|---|---|---|
| MG aufbauen | Mahlwerk, Sense | s_mg_dreibein | nein |
| Sprenggranate | Haubitze, Geschütz, Feldkanone | s_granate_artillerie | nein |
| Sperrfeuer | Haubitze, Geschütz, Feldkanone | s_sperrfeuer | nein |
| Gasgranate | Haubitze | s_gas | nein |
| Aufprotzen | Haubitze, Geschütz, Feldkanone | s_pferd | nein |
| Abprotzen | Haubitze, Geschütz, Feldkanone | s_lafette | nein |
| Steilfeuer | Mörser, Minenwerfer | s_granate_artillerie | nein |
| Granatwurf | Granatwerfer-Trupp | s_handgranate | nein |
| Flammenstrahl | Brandwerfer, Flammentrupp | s_flamme | nein |
| Versorgen | Feldscher, Heiler | s_sanitaeter | nein |
| Befehl überbringen (+1 Aktionspunkt) | Meldegänger mit Hund | s_meldehund | nein |
| Bergen (Koloss/Maschine) | Werkstatt-Trupp | s_schraubenschluessel | nein |
| Draht ziehen | Drahtpioniere | s_drahtrolle | nein |
| Sammeln (Befehl) | Hauptmann, General | s_fahne | nein |
| Sturmbefehl (Befehl) | Hauptmann, General | s_blitz | nein |

## 3. Sonderfähigkeiten (E.ABILS)

| Name | Wer | Symbol | Symbol fehlt? |
|---|---|---|---|
| Nebelwand | Rauchwerfer-Trupp | s_nebel (grau; s_gas ist Giftgas) | nein |
| Stollen graben | Mineure | s_spitzhacke | nein |
| Eingraben (Knopf und Zustandsmarke „Eingegraben“) | Infanterie mit T.dig | s_schaufel | nein |
| Haftladung | Sprengtrupp | s_sprengladung | nein |
| Mine legen | Minenleger | s_tellermine | nein |
| Ausleuchten | Scheinwerfer-Trupp (gestrichen 2026-11-16) | s_scheinwerfer | nein |
| Entgiften | Gasschutz-Trupp | s_gasmaske | nein |
| Nachladen | Munitionsträger | s_munitionskiste | nein |

## 4. Schlagworte (passive Fähigkeiten, gold in Einheitenkarte und Info)

| Schlagwort | Einheiten | Symbol | Symbol fehlt? |
|---|---|---|---|
| Schneidet Draht | Kohorte, Grenadiere | s_drahtschere | nein |
| Draht schneiden und angreifen | Graben-Pioniere | s_drahtschere | nein |
| Schuss 2 / 3 / 4 Felder, Reichweite 5 | viele | s_gewehr | nein |
| Reaktionsfeuer | Mahlwerk, Sense | s_auge | nein |
| Zieht oder schießt | Mahlwerk, Sense | – (Text) | nein |
| Feuert über Truppen | Haubitze, Geschütz | s_granate_artillerie | nein |
| Gas und Sperrfeuer | Haubitze | s_gas | nein |
| Aufprotzen | Haubitze, Geschütz, Feldkanone | s_pferd | nein |
| Direktschuss ×2,5 auf Kolosse | Geschütz, Feldkanone | s_zielen | nein |
| Gepanzert | Koloss, Knecht, Klaue, Bohrer, Säger | s_schild | nein |
| Brustpanzer / Rüstung / Kampfanzug: Beschuss ×0,5 | Schwere, Ritter, Stahl, Panzerkämpfer | s_schild | nein |
| Sehr zäh | Schildträger, Schildwall | s_schild | nein |
| Walzt Draht nieder | Koloss | s_walze | nein |
| Pannen | alle Kolosse | s_zahnrad | nein |
| Ansturm ×1,5 | Reiter | s_pferd | nein |
| Kein Draht, kein Totholz | Reiter | – (Text) | nein |
| Sickert durch | Sturmtrupp, Räumer, Grabenkämpfer | s_durchsickern | nein |
| Handgranaten | Sturmtrupp, Räumer, Grabenkämpfer | s_handgranate | nein |
| ×1,5 / ×2 gegen Kolosse | Sturm, Pioniere, Räumer, Büchse | s_panzerbrecher | nein |
| Flammenstrahl, Deckung schützt nicht | Brandwerfer, Flammentrupp | s_flamme | nein |
| Versorgt einen Nachbarn | Feldscher, Heiler | s_sanitaeter | nein |
| Ziehen und feuern, Steilfeuer 4 Felder | Mörser, Minenwerfer | s_granate_artillerie | nein |
| Zieht 4 / 5 Felder | Radler, Melder | s_marsch | nein |
| Langsam | Schwere | – (Text) | nein |
| Hält das Ziel nieder | Scharfschütze | s_niedergehalten | nein |
| Befehl überbringen | Melder | s_meldehund | nein |
| Lenkt Artillerie, Sieht 6 Felder | Signal, Fernsprech | s_fernglas | nein |
| Anführer befehlen jede Runde | Signal, Fernsprech | s_fahne | nein |
| Keine Schusswaffe / Nur Nahkampf | Schildträger, Ritter, Bohrer | s_nahkampf | nein |
| Sturmkanone / Maschinenwaffe (und Säge) | Knecht, Klaue, Säger | s_gewehr | nein |
| Zieht Stacheldraht | Drahtpioniere | s_drahtrolle | nein |
| Moralverlust ×0,75, Erholung +5 | Bannerträger | s_fahne | nein |
| Befehl alle 2 Runden / jede Runde | Hauptmann, General | s_fahne | nein |
| Höchstens einer | General | – (Text) | nein |

## 5. Knöpfe der Oberfläche

| Name | Symbol | Symbol fehlt? |
|---|---|---|
| Runde beenden | – (Text), optional s_sanduhr | nein |
| Nachschub | – (Text), optional s_munitionskiste | nein |
| i Info | – (Text „i“) | nein |
| Menü | – (Text) | nein |
| Vergrößern (Zoom) | Lupe, flaches Zeichen in Knochenweiß | nein (kein Bogen nötig) |
| Ton an/aus | Lautsprecher, flaches Zeichen in Knochenweiß | nein (kein Bogen nötig) |
| Tempo | Vorspulen-Pfeile, flaches Zeichen in Knochenweiß | nein (kein Bogen nötig) |
| Regeln (?) | „?“ als Text | nein |
| Vollbild | Vier Ecken, flaches Zeichen in Knochenweiß | nein (kein Bogen nötig) |
| Vorschau: Nahkampf / Beschuss umschalten | s_nahkampf / s_zielen | nein |
| Startmenü und Dialoge: Los geht's, Zurück, Verstanden, Abbrechen, Schließen, Schlachtfeld ansehen, Standardarmee, Kampfmaschinen zulassen, Ton | – (Text) | nein |

## 6. Anzeigen und Zustandsmarken (keine Knöpfe, nutzen aber Symbole)

| Name | Symbol | Symbol fehlt? |
|---|---|---|
| Aktionspunkte | s_blitz + Messingpunkte | nein |
| Bewegung | s_marsch | nein |
| Reichweite | s_gewehr | nein |
| Abklingzeit | s_sanduhr | nein |
| Verluste / gefallen | s_totenkopf | nein |
| Deckung Bronze / Silber / Gold | s_schild (dreifach eingefärbt) | nein |
| Niedergehalten | s_niedergehalten | nein |
| Flieht | s_flucht | nein |
| Gebrochen (Moral) | s_gebrochen (vorläufig, wird evtl. ersetzt) | nein |
| Panne | s_zahnrad | nein |
| Aufgeprotzt | s_pferd | nein |
| Festgefahren | s_festgefahren | nein |
| Im Gas | s_gas | nein |
| Feuerbereit | s_auge | nein |
| Aufklärer sieht | s_fernglas | nein |

## Stand

Jede Fähigkeit, Aktion und Zustandsmarke hat jetzt ein Symbol. Offen sind nur die vier flachen Leistenzeichen (Lupe, Lautsprecher, Vorspulen, Vollbild), die ohne Bogen in Knochenweiß gezeichnet werden.

Hinweise:
- s_zahnrad steht für „Pannen“; „MG aufbauen“ und „Bergen“ haben jetzt eigene Symbole.
- s_fahne (Sammeln, Banner) und s_gebrochen (rote Fahne) sehen sich ähnlich; beim Ersetzen von „Gebrochen“ auf deutlichen Unterschied achten.
- `bogen4b` und `bogen4c` sind kleiner aufgelöst (Symbole ca. 250 px) als `bogen4a` (ca. 450–900 px). Für Knöpfe bis 72 px reicht das, für große Darstellungen nicht.
