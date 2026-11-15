# Symbol-Liste: alle Fähigkeiten, Aktionen und Knöpfe

Grundlage: Symbolbogen `bogen3b_symbole` (16 Symbole, ausgeschnitten in `ui-quelle/teile/bogen3b_symbole/`).
Vorhanden: **zielen, nahkampf, marsch, fahne, totenkopf, schild, gas, granate_artillerie, zahnrad, sanitaeter, blitz, handgranate, gewehr, pferd, fernglas, sanduhr.**

„– (Text)“ heißt: reiner Textknopf, ein Symbol ist nicht nötig.

## 1. Aktionen jeder Einheit

| Name | Symbol | Symbol fehlt? |
|---|---|---|
| Beschuss / Schießen | s_zielen | nein |
| Nahkampf | s_nahkampf | nein |
| Ziehen | s_marsch | nein |
| Marsch (doppelte Zugweite) | s_marsch | nein |
| Feuerbereitschaft | Auge oder Wachposten (Notlösung: s_fernglas) | **ja** |
| Fertig (Einheit setzt aus) | Haken | **ja** |
| Drehen links | Drehpfeil links | **ja** |
| Drehen rechts | Drehpfeil rechts | **ja** |
| Draht schneiden | Drahtschere | **ja** |
| Abbrechen (Nachschub nicht setzen) | – (Text) | nein |

## 2. Aktionen bestimmter Einheiten

| Name | Wer | Symbol | Symbol fehlt? |
|---|---|---|---|
| MG aufbauen | Mahlwerk, Sense | Dreibein oder MG (Notlösung: s_zahnrad) | **ja** |
| Sprenggranate | Haubitze, Geschütz, Feldkanone | s_granate_artillerie | nein |
| Sperrfeuer | Haubitze, Geschütz, Feldkanone | Einschlagreihe | **ja** |
| Gasgranate | Haubitze | s_gas | nein |
| Aufprotzen | Haubitze, Geschütz, Feldkanone | s_pferd | nein |
| Abprotzen | Haubitze, Geschütz, Feldkanone | Lafette oder Anker | **ja** |
| Steilfeuer | Mörser, Minenwerfer | s_granate_artillerie | nein |
| Granatwurf | Granatwerfer-Trupp | s_handgranate | nein |
| Flammenstrahl | Brandwerfer, Flammentrupp | Flamme | **ja** |
| Versorgen | Feldscher, Heiler | s_sanitaeter | nein |
| Befehl überbringen (+1 Aktionspunkt) | Meldegänger mit Hund | Meldehund oder Meldekapsel | **ja** |
| Bergen (Koloss/Maschine) | Werkstatt-Trupp | Schraubenschlüssel (s_zahnrad ist schon „Aufbauen“) | **ja** |
| Draht ziehen | Drahtpioniere | Drahtrolle | **ja** |
| Sammeln (Befehl) | Hauptmann, General | s_fahne | nein |
| Sturmbefehl (Befehl) | Hauptmann, General | s_blitz | nein |

## 3. Sonderfähigkeiten (E.ABILS)

| Name | Wer | Symbol | Symbol fehlt? |
|---|---|---|---|
| Nebelwand | Rauchwerfer-Trupp | grauer Rauch (s_gas ist Giftgas, nicht verwechseln) | **ja** |
| Stollen graben | Mineure | Spitzhacke | **ja** |
| Haftladung | Sprengtrupp | Sprengladung | **ja** |
| Mine legen | Minenleger | Tellermine | **ja** |
| Ausleuchten | Scheinwerfer-Trupp | Scheinwerfer | **ja** |
| Entgiften | Gasschutz-Trupp | Gasmaske | **ja** |
| Nachladen | Munitionsträger | Munitionskiste | **ja** |

## 4. Schlagworte (passive Fähigkeiten, gold in Einheitenkarte und Info)

| Schlagwort | Einheiten | Symbol | Symbol fehlt? |
|---|---|---|---|
| Schneidet Draht | Kohorte, Grenadiere | Drahtschere | **ja** |
| Draht schneiden und angreifen | Graben-Pioniere | Drahtschere | **ja** |
| Schuss 2 / 3 / 4 Felder, Reichweite 5 | viele | s_gewehr | nein |
| Reaktionsfeuer | Mahlwerk, Sense | Auge (wie Feuerbereitschaft) | **ja** |
| Zieht oder schießt | Mahlwerk, Sense | – (Text) | nein |
| Feuert über Truppen | Haubitze, Geschütz | s_granate_artillerie | nein |
| Gas und Sperrfeuer | Haubitze | s_gas | nein |
| Aufprotzen | Haubitze, Geschütz, Feldkanone | s_pferd | nein |
| Direktschuss ×2,5 auf Kolosse | Geschütz, Feldkanone | s_zielen | nein |
| Gepanzert | Koloss, Knecht, Klaue, Bohrer, Säger | s_schild | nein |
| Brustpanzer / Rüstung / Kampfanzug: Beschuss ×0,5 | Schwere, Ritter, Stahl, Panzerkämpfer | s_schild | nein |
| Sehr zäh | Schildträger, Schildwall | s_schild | nein |
| Walzt Draht nieder | Koloss | Kette oder Walze | **ja** |
| Pannen | alle Kolosse | s_zahnrad | nein |
| Ansturm ×1,5 | Reiter | s_pferd | nein |
| Kein Draht, kein Totholz | Reiter | – (Text) | nein |
| Sickert durch | Sturmtrupp, Räumer, Grabenkämpfer | Pfeil durch Linie | **ja** |
| Handgranaten | Sturmtrupp, Räumer, Grabenkämpfer | s_handgranate | nein |
| ×1,5 / ×2 gegen Kolosse | Sturm, Pioniere, Räumer, Büchse | Panzerbrecher (Zahnrad mit Riss) | **ja** |
| Flammenstrahl, Deckung schützt nicht | Brandwerfer, Flammentrupp | Flamme | **ja** |
| Versorgt einen Nachbarn | Feldscher, Heiler | s_sanitaeter | nein |
| Ziehen und feuern, Steilfeuer 4 Felder | Mörser, Minenwerfer | s_granate_artillerie | nein |
| Zieht 4 / 5 Felder | Radler, Melder | s_marsch | nein |
| Langsam | Schwere | – (Text) | nein |
| Hält das Ziel nieder | Scharfschütze | Pfeil nach unten (Niederhalten) | **ja** |
| Befehl überbringen | Melder | Meldehund | **ja** |
| Lenkt Artillerie, Sieht 6 Felder | Signal, Fernsprech | s_fernglas | nein |
| Anführer befehlen jede Runde | Signal, Fernsprech | s_fahne | nein |
| Keine Schusswaffe / Nur Nahkampf | Schildträger, Ritter, Bohrer | s_nahkampf | nein |
| Sturmkanone / Maschinenwaffe (und Säge) | Knecht, Klaue, Säger | s_gewehr | nein |
| Zieht Stacheldraht | Drahtpioniere | Drahtrolle | **ja** |
| Moralverlust ×0,75, Erholung +5 | Bannerträger | s_fahne | nein |
| Befehl alle 2 Runden / jede Runde | Hauptmann, General | s_fahne | nein |
| Höchstens einer | General | – (Text) | nein |

## 5. Knöpfe der Oberfläche

| Name | Symbol | Symbol fehlt? |
|---|---|---|
| Runde beenden | – (Text), optional s_sanduhr | nein |
| Nachschub | Kiste (optional, Text reicht) | nein |
| i Info | – (Text „i“) | nein |
| Menü | – (Text) | nein |
| Vergrößern (Zoom) | Lupe, flaches Zeichen in Knochenweiß | nein (kein Bogen nötig) |
| Ton an/aus | Lautsprecher, flaches Zeichen in Knochenweiß | nein (kein Bogen nötig) |
| Tempo | Vorspulen-Pfeile, flaches Zeichen in Knochenweiß | nein (kein Bogen nötig) |
| Regeln (?) | Buch oder „?“ als Text | nein |
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
| Niedergehalten | Pfeil nach unten | **ja** |
| Flieht | weiße Fahne oder Laufpfeil | **ja** |
| Gebrochen (Moral) | gebrochene Fahne (Notlösung: s_totenkopf) | **ja** |
| Panne | s_zahnrad | nein |
| Aufgeprotzt | s_pferd | nein |
| Festgefahren | Kette im Schlamm | **ja** |
| Im Gas | s_gas | nein |
| Feuerbereit | Auge | **ja** |
| Aufklärer sieht | s_fernglas | nein |

## Zusammenfassung: fehlende Symbole (zusammengefasst, 25 Motive; Drehpfeil rechts = gespiegelter linker)

Drahtschere · Drahtrolle · Auge (Feuerbereit, Reaktionsfeuer) · Haken (Fertig) · Drehpfeil links/rechts · MG-Dreibein · Sperrfeuer-Einschläge · Lafette/Abprotzen · Flamme · Meldehund · Schraubenschlüssel (Bergen) · grauer Rauch · Spitzhacke · Sprengladung · Tellermine · Scheinwerfer · Gasmaske · Munitionskiste · Panzerbrecher · Durchsickern-Pfeil · Niederhalten-Pfeil · Flucht (weiße Fahne) · gebrochene Fahne · Festgefahren · Walze (Draht niederwalzen). Die vier Leistensymbole (Lupe, Lautsprecher, Vorspulen, Vollbild) werden flach in Knochenweiß gezeichnet, ohne Bogen.

Ein zweiter Bogen mit 25 Feldern (5 × 5) würde alle Spiel-Motive abdecken.
