# V1 Stimmen-Plan (Punkt 102, 2026-11-26): erzeugt entwurf/stimmen_texte.csv aus den Texten unten.
# Aufruf: python tools/stimmen_plan.py   (nur Text, keine Töne)
# Spalten: id, fraktion, sprecher, anlass, einheit, text. Blaue Legion = Konkordat-Stimmen.
import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Sprecher je Gruppe (Vorschlag, siehe entwurf/STIMMEN_PLAN.md)
SPRECHER = {
    'K': {'fuss': 'K1', 'sturm': 'K2', 'reiter': 'K2', 'panzer': 'K3', 'fuehrer': 'K3', 'schreiter': 'KM'},
    'A': {'fuss': 'A1', 'sturm': 'A2', 'reiter': 'A2', 'panzer': 'A3', 'fuehrer': 'A3', 'schreiter': 'AM'},
}
FRAKTION = {'K': 'Konkordat', 'A': 'Aschenwacht'}

# Rufe je Fraktion, Gruppe und Anlass (3–4 Fassungen, 1–5 Wörter)
RUFE = {
 'K': {
  'fuss': {
   'anwahl': ['Bereit.', 'Zu Befehl.', 'Hier.', 'Wartet auf Befehl.'],
   'befehl': ['Verstanden.', 'Rücken vor.', 'Wird gemacht.', 'Unterwegs.'],
   'angriff': ['Feuer frei!', 'Auf sie!', 'Bajonett vor!', 'Los, Männer!'],
   'rueckzug': ['Zurück! Zurück!', 'Absetzen!', 'Zurück zur Linie!'],
   'panik': ['Raus hier!', 'Wir halten nicht!', 'Lauft!'],
   'verwundet': ['Sanitäter!', 'Mann am Boden!', 'Brauchen Hilfe!'],
   'sammeln': ['Wir stehen wieder.', 'Linie hält.', 'Ordnung, Männer!'],
   'tod': ['Wir fallen…', 'Keiner mehr…', 'Linie gebrochen…'],
   'niedergehalten': ['Köpfe runter!', 'Wir liegen fest!', 'Deckung!'],
   'gas': ['Gas! Masken dicht!', 'Gas, Gas!', 'Gasalarm!'],
   'granate': ['Granate!', 'Wurf!', 'Achtung, Wurf!'],
   'feuerbereit': ['Feuerbereit.', 'Wir warten.', 'Linie bewacht.'],
   'feuer': ['Feuer!', 'Salve!', 'Ziel erfasst.'],
   'zielfeld': ['Stellung genommen.', 'Feld gehalten.', 'Fahne steht.'],
   'koloss': ['Koloss voraus!', 'Stahl kommt!', 'Panzer, Panzer!'],
  },
  'sturm': {
   'anwahl': ['Bereit zum Räumen.', 'Schilde stehen.', 'Sagt an.'],
   'befehl': ['Vorwärts.', 'Bestätigt.', 'Wir gehen rein.'],
   'angriff': ['Rein in den Graben!', 'Räumen!', 'Schilde vor, drauf!'],
   'rueckzug': ['Raus, raus!', 'Hinter die Schilde!', 'Absetzen!'],
   'panik': ['Das ist zu viel!', 'Weg hier!', 'Schilde weg, lauft!'],
   'verwundet': ['Sanitäter, schnell!', 'Zwei Mann verletzt!', 'Wir sind angeschlagen!'],
   'sammeln': ['Schilde wieder hoch.', 'Wir stehen.', 'Neu formieren.'],
   'tod': ['Graben… nicht geräumt…', 'Wir sind durch…', 'Schilde… gefallen…'],
   'granate': ['Granate in den Graben!', 'Wurf!', 'Ladung rein!'],
   'schilde': ['Schilde vor!', 'Wand schließen!', 'Schild an Schild!'],
   'zielfeld': ['Graben geräumt.', 'Abschnitt sauber.', 'Gehört uns.'],
  },
  'reiter': {
   'anwahl': ['Schwadron bereit.', 'Pferde unter Dampf.', 'Aufgesessen.'],
   'befehl': ['Im Trab.', 'Schwadron, vor.', 'Verstanden, wir reiten.'],
   'angriff': ['Attacke!', 'Klingen hoch!', 'Durchbrechen!'],
   'rueckzug': ['Abdrehen!', 'Wenden, zurück!', 'Abschwenken!'],
   'panik': ['Die Pferde scheuen!', 'Weg, nur weg!', 'Nicht zu halten!'],
   'verwundet': ['Reiter am Boden!', 'Pferd getroffen!', 'Wir verlieren Dampf!'],
   'sammeln': ['Schwadron, sammeln.', 'Wieder in Reihe.', 'Pferde ruhig.'],
   'tod': ['Schwadron… gefallen…', 'Kein Reiter mehr…', 'Dampf… erloschen…'],
  },
  'panzer': {
   'anwahl': ['Koloss bereit.', 'Motor läuft.', 'Besatzung hört.'],
   'befehl': ['Fahrer, vor.', 'Rollen an.', 'Kurs bestätigt.'],
   'angriff': ['Richtschütze, Feuer!', 'Schuss!', 'Ziel aufgefasst.'],
   'getroffen': ['Treffer am Rumpf!', 'Panzerung hält!', 'Einschlag vorn!'],
   'panne': ['Kette gerissen!', 'Wir sitzen fest!', 'Motor setzt aus!'],
   'rueckzug': ['Rückwärts, rückwärts!', 'Absetzen!', 'Aus der Linie!'],
   'panik': ['Raus aus dem Ding!', 'Wir brennen!', 'Aussteigen!'],
   'verwundet': ['Schwer beschädigt!', 'Feuer im Motorraum!', 'Wir verlieren Druck!'],
   'sammeln': ['Besatzung ruhig.', 'Wieder einsatzbereit.', 'Systeme stehen.'],
   'tod': ['Aussteigen, aussteigen!', 'Koloss verloren…', 'Funk… tot…'],
  },
  'fuehrer': {
   'anwahl': ['Ich höre.', 'Lage?', 'Sprechen Sie.'],
   'befehl': ['Ausführen.', 'So sei es.', 'Gut. Vorwärts.'],
   'angriff': ['Feuer frei!', 'Gebt es ihnen!', 'Zielen – Feuer!'],
   'befehl_sammeln': ['Sammeln bei mir!', 'Ruhig, Männer!', 'Haltet die Linie!'],
   'befehl_feuerfrei': ['Feuer nach Belieben!', 'Freies Feuer!', 'Lasst sie kommen – Feuer!'],
   'grossbefehl': ['Keinen Schritt zurück!', 'Diese Linie hält!', 'Wir halten hier!'],
   'rueckzug': ['Zurück in die Stellung!', 'Geordnet absetzen!', 'Rückzug, in Ordnung!'],
   'panik': ['Stab zieht ab!', 'Wir müssen weg!', 'Rette sich, wer kann!'],
   'verwundet': ['Stab getroffen!', 'Sanitäter zum Stab!', 'Ich bin verwundet!'],
   'sammeln': ['Stab wieder bereit.', 'Ordnung hergestellt.', 'Weiter.'],
   'tod': ['Führung… gefallen…', 'Übernehmt… ihr…', 'Stab ausgefallen…'],
  },
  'schreiter': {
   'anwahl': ['Einheit bereit.', 'Kessel unter Druck.', 'Erwarte Befehl.'],
   'befehl': ['Schreite vor.', 'Kurs bestätigt.', 'Bewegung.'],
   'angriff': ['Ziel bekämpft.', 'Feuer.', 'Ziel im Visier.'],
   'nahkampf': ['Nahkampf.', 'Zerschmettern.', 'Kontakt.'],
   'getroffen': ['Schaden gemeldet.', 'Panzerung beschädigt.', 'Treffer.'],
   'schwer': ['Systeme versagen.', 'Druck kritisch.', 'Kessel undicht.'],
   'feind': ['Feind erkannt.', 'Ziel im Blick.', 'Gegner voraus.'],
   'tod': ['Abschaltung…', 'Kessel… erloschen…', 'Ende…'],
  },
 },
 'A': {
  'fuss': {
   'anwahl': ['Bereit.', 'Hier.', 'Befehl?', 'Gruppe hört.'],
   'befehl': ['Bestätigt.', 'Vorrücken.', 'Ausgeführt.', 'Aufschließen.'],
   'angriff': ['Feuer!', 'Ran an sie!', 'Drauf!'],
   'rueckzug': ['Zurück!', 'Absetzen, sofort!', 'Zurück in den Graben!'],
   'panik': ['Weg hier!', 'Nicht zu halten!', 'Alles zurück!'],
   'verwundet': ['Sanitäter!', 'Verwundete hier!', 'Wir brauchen Hilfe!'],
   'sammeln': ['Gruppe steht.', 'Wieder in Ordnung.', 'Formiert.'],
   'tod': ['Gruppe… aufgerieben…', 'Keiner mehr…', 'Stellung… verloren…'],
   'niedergehalten': ['Deckung!', 'Köpfe runter!', 'Wir liegen fest!'],
   'gas': ['Gas! Masken dicht!', 'Gasalarm!', 'Gas, Gas!'],
   'granate': ['Granate!', 'Handgranate!', 'Wurf!'],
   'feuerbereit': ['Feuerbereit.', 'Wir warten auf sie.', 'Abschnitt gesichert.'],
   'feuer': ['Feuer!', 'Schießen!', 'Ziel erfasst – Feuer!'],
   'zielfeld': ['Stellung genommen.', 'Gehört uns.', 'Abschnitt gehalten.'],
   'koloss': ['Koloss!', 'Panzer voraus!', 'Stahlungetüm!'],
  },
  'sturm': {
   'anwahl': ['Stoßtrupp bereit.', 'Wir warten.', 'Befehl.'],
   'befehl': ['Durchstoßen.', 'Bestätigt. Vor.', 'Wir gehen.'],
   'angriff': ['Zum Sturm!', 'Durch!', 'Brecht sie!'],
   'rueckzug': ['Absetzen!', 'Zurück, geschlossen!', 'Raus aus dem Feuer!'],
   'panik': ['Zu stark!', 'Weg, weg!', 'Nicht halten!'],
   'verwundet': ['Ausfälle!', 'Sanitäter nach vorn!', 'Schwer getroffen!'],
   'sammeln': ['Neu formieren.', 'Trupp steht.', 'Weiter.'],
   'tod': ['Stoßtrupp… gefallen…', 'Durchbruch… gescheitert…', 'Keiner… mehr…'],
   'granate': ['Bündel!', 'Ladung wirft!', 'Granate rein!'],
   'gegenstoss': ['Gegenstoß!', 'Zurückwerfen!', 'Nachsetzen!'],
  },
  'reiter': {
   'anwahl': ['Reiter bereit.', 'Aufgesessen.', 'Lanzen scharf.'],
   'befehl': ['Im Galopp.', 'Reiten an.', 'Bestätigt.'],
   'angriff': ['Lanzen vor!', 'Attacke!', 'Durchreiten!'],
   'rueckzug': ['Abschwenken!', 'Wenden, zurück!', 'Absetzen!'],
   'panik': ['Pferde gehen durch!', 'Weg hier!', 'Nicht zu halten!'],
   'verwundet': ['Reiter gestürzt!', 'Pferd verletzt!', 'Ausfälle!'],
   'sammeln': ['Sammeln, Reiter.', 'In Reihe.', 'Ruhig.'],
   'tod': ['Schwadron… verloren…', 'Kein Reiter… mehr…', 'Lanzen… gebrochen…'],
  },
  'panzer': {
   'anwahl': ['Panzer bereit.', 'Motor warm.', 'Besatzung hört.'],
   'befehl': ['Fahrer, vor.', 'Rollen an.', 'Kurs liegt an.'],
   'angriff': ['Richtschütze – Feuer!', 'Schuss!', 'Breitseite!'],
   'getroffen': ['Treffer am Rumpf!', 'Panzerung hält!', 'Einschlag!'],
   'panne': ['Kette gerissen!', 'Wir sitzen fest!', 'Motor aus!'],
   'rueckzug': ['Rückwärts!', 'Absetzen!', 'Aus dem Feuer!'],
   'panik': ['Aussteigen!', 'Wir brennen!', 'Raus, raus!'],
   'verwundet': ['Schwer beschädigt!', 'Brand im Heck!', 'Druck fällt!'],
   'sammeln': ['Wieder klar.', 'Systeme stehen.', 'Einsatzbereit.'],
   'tod': ['Panzer… verloren…', 'Aussteigen… zu spät…', 'Funk… aus…'],
  },
  'fuehrer': {
   'anwahl': ['Ich höre.', 'Lage?', 'Befehl?'],
   'befehl': ['Ausführen.', 'So wird es gemacht.', 'Vorwärts.'],
   'angriff': ['Feuer!', 'Angriff!', 'Drauf!'],
   'befehl_sammeln': ['Sammeln!', 'Ruhig, Männer!', 'Linie halten!'],
   'befehl_sturm': ['Zum Sturm!', 'Angriff!', 'Vorwärts, drauf!'],
   'grossbefehl': ['Alle Mann – Angriff!', 'Ganze Linie vor!', 'Jetzt alle!'],
   'rueckzug': ['Zurück in die Stellung!', 'Geordnet absetzen!', 'Rückzug!'],
   'panik': ['Stab zieht ab!', 'Wir müssen weg!', 'Alles verloren!'],
   'verwundet': ['Stab getroffen!', 'Sanitäter zum Stab!', 'Ich bin verwundet!'],
   'sammeln': ['Ordnung hergestellt.', 'Stab bereit.', 'Weiter.'],
   'tod': ['Führung… fällt…', 'Übernehmt…', 'Stab… ausgefallen…'],
  },
  'schreiter': {
   'anwahl': ['Bereit.', 'Antrieb läuft.', 'Erwarte Befehl.'],
   'befehl': ['Marschiere.', 'Bewegung bestätigt.', 'Vorwärts.'],
   'angriff': ['Ziel bekämpft.', 'Vernichten.', 'Feuer.'],
   'nahkampf': ['Nahkampf.', 'Zerschlagen.', 'Kontakt.'],
   'getroffen': ['Schaden gemeldet.', 'Treffer registriert.', 'Panzerung beschädigt.'],
   'schwer': ['Systeme versagen.', 'Kritischer Schaden.', 'Druck fällt.'],
   'feind': ['Feind erkannt.', 'Ziel erfasst.', 'Gegner voraus.'],
   'tod': ['Abschaltung…', 'Ende…', 'Antrieb… aus…'],
   'dauerfeuer': ['Dauerfeuer.', 'Feuer hält an.', 'Nicht nachlassen.'],   # Eiserne Hünen
  },
 },
}

# Erscheinen (Nachschub/Aufstellung): je Einheit 2 Fassungen; Gruppe bestimmt den Sprecher
ERSCHEINEN = {
 'K': [
  ('hauptA', 'fuehrer', ['Hauptmann zur Stelle.', 'Stab ist da – Befehle?']),
  ('generalA', 'fuehrer', ['Der General ist im Feld.', 'Oberkommando übernimmt.']),
  ('kohorte', 'fuss', ['Schützenkohorte, zur Stelle!', 'Kohorte meldet sich.']),
  ('melder', 'fuss', ['Meldegänger bereit.', 'Melder und Hund, zur Stelle.']),
  ('fernsprech', 'fuss', ['Fernsprechtrupp, Leitung steht.', 'Fernsprecher meldet sich.']),
  ('feldscher', 'fuss', ['Sanitäter zur Stelle.', 'Feldscher bereit, Verband frei.']),
  ('pionier', 'fuss', ['Grabenpioniere, zur Stelle!', 'Pioniere bereit, Spaten frei.']),
  ('scharf', 'fuss', ['Scharfschützen in Stellung.', 'Zwei Augen auf die Linie.']),
  ('mahlwerk', 'fuss', ['Mahlwerk-Trupp, zur Stelle!', 'MG bereit zum Aufbau.']),
  ('moerser', 'fuss', ['Grabenmörser bereit.', 'Mörsertrupp meldet sich.']),
  ('flammen', 'fuss', ['Flammentrupp, zur Stelle!', 'Brenner gezündet.']),
  ('feldkanone', 'fuss', ['Feldkanone, zur Stelle!', 'Geschütz bereit.']),
  ('haubitze', 'fuss', ['Donnerrohr-Batterie, zur Stelle!', 'Batterie meldet sich.']),
  ('mineur', 'fuss', ['Mineure, zur Stelle!', 'Stollenbauer bereit.']),
  ('werkstatt', 'fuss', ['Versorgungstrupp, zur Stelle!', 'Werkzeug und Munition da.']),
  ('ballon', 'fuss', ['Ballonbeobachter, steigen auf.', 'Ballon bereit, Sicht frei.']),
  ('raeumer', 'sturm', ['Grabenräumer, zur Stelle!', 'Räumer und Schilde bereit.']),
  ('reiter', 'reiter', ['Stahlreiter, zur Stelle!', 'Schwadron unter Dampf.']),
  ('koloss', 'panzer', ['Landkoloss rollt an.', 'Koloss einsatzbereit.']),
  ('turm', 'schreiter', ['Turmschreiter, betriebsbereit.', 'Turm erhebt sich.']),
  ('orden', 'schreiter', ['Ordensschreiter, betriebsbereit.', 'Orden marschiert.']),
  ('kreuz', 'schreiter', ['Kreuzschreiter, betriebsbereit.', 'Der Löwe schreitet.']),
 ],
 'A': [
  ('hauptD', 'fuehrer', ['Hauptmann zur Stelle.', 'Stab eingetroffen.']),
  ('generalD', 'fuehrer', ['Der General führt.', 'Oberkommando im Feld.']),
  ('grenadier', 'fuss', ['Aschengrenadiere, zur Stelle!', 'Grenadiere melden sich.']),
  ('signal', 'fuss', ['Signaltrupp, zur Stelle!', 'Leuchtzeichen bereit.']),
  ('heiler', 'fuss', ['Sanitäter zur Stelle.', 'Verbandsplatz steht.']),
  ('pionierD', 'fuss', ['Drahtpioniere, zur Stelle!', 'Draht und Minen bereit.']),
  ('banner', 'fuss', ['Bannerträger, zur Stelle!', 'Das Banner ist da.']),
  ('buechse', 'fuss', ['Panzerbüchse, zur Stelle!', 'Büchse geladen.']),
  ('sense', 'fuss', ['Sensenwerk, zur Stelle!', 'MG bereit.']),
  ('minenwerfer', 'fuss', ['Minenwerfer, zur Stelle!', 'Werfer bereit.']),
  ('brand', 'fuss', ['Brandtrupp, zur Stelle!', 'Brenner gezündet.']),
  ('geschuetz', 'fuss', ['Geschütz, zur Stelle!', 'Batterie bereit.']),
  ('gasschutz', 'fuss', ['Gasschutztrupp, zur Stelle!', 'Entgiftung bereit.']),
  ('munition', 'fuss', ['Munitionstrupp, zur Stelle!', 'Nachschub ist da.']),
  ('pirsch', 'fuss', ['Pirschjäger, zur Stelle.', 'Wir sind schon da.']),
  ('sturm', 'sturm', ['Sturmbrecher, zur Stelle!', 'Stoßtrupp bereit.']),
  ('schwer', 'sturm', ['Schwere Grabenwacht, zur Stelle!', 'Schilde geschlossen.']),
  ('panzerk', 'sturm', ['Panzerknechte, zur Stelle!', 'Anzüge unter Druck.']),
  ('huenen', 'schreiter', ['Eiserne Hünen, zur Stelle.', 'Hünen marschieren.']),
  ('lanzeD', 'reiter', ['Sprenglanzen-Reiter, zur Stelle!', 'Lanzen geladen.']),
  ('sturmpz', 'panzer', ['Sturmpanzer rollt an.', 'Panzer einsatzbereit.']),
  ('knecht', 'schreiter', ['Eisenknecht, betriebsbereit.', 'Eisenknecht marschiert.']),
  ('bohrer', 'schreiter', ['Bohrkoloss, betriebsbereit.', 'Bohrer läuft an.']),
  ('saeger', 'schreiter', ['Sägeschreiter, betriebsbereit.', 'Säge läuft.']),
  ('klaue', 'schreiter', ['Klauenschreiter, betriebsbereit.', 'Klauen frei.']),
 ],
}


def main():
    rows = []
    for fr, gruppen in RUFE.items():
        for gr, anl in gruppen.items():
            for an, texte in anl.items():
                for i, t in enumerate(texte, 1):
                    rows.append((f'{fr}_{gr}_{an}_{i}', FRAKTION[fr], SPRECHER[fr][gr], an, gr, t))
        for typ, gr, texte in ERSCHEINEN[fr]:
            for i, t in enumerate(texte, 1):
                rows.append((f'{fr}_erscheinen_{typ}_{i}', FRAKTION[fr], SPRECHER[fr][gr], 'erscheinen', typ, t))
    out = ROOT / 'entwurf' / 'stimmen_texte.csv'
    with open(out, 'w', newline='', encoding='utf-8-sig') as f:
        w = csv.writer(f, delimiter=';')
        w.writerow(['id', 'fraktion', 'sprecher', 'anlass', 'einheit', 'text'])
        w.writerows(rows)
    print(out, len(rows), 'Zeilen')
    for fr in RUFE:
        n = {}
        for r in rows:
            if r[1] == FRAKTION[fr]: n[r[2]] = n.get(r[2], 0) + 1
        print(FRAKTION[fr], n)


if __name__ == '__main__':
    main()
