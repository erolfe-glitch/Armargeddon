# Stimmen-Plan V1b (Punkt 109, 2026-11-26): erzeugt entwurf/stimmen_texte.csv aus den Texten unten.
# Aufruf: python tools/stimmen_plan.py [--md]   (nur Text, keine Töne; --md druckt die Tabellen für STIMMEN_PLAN.md)
# Spalten: id, fraktion, sprecher, anlass, einheit, ton, text. Konkordat Englisch (auch Blaue Legion), Aschenwacht Deutsch.
# 5 Sprecher je Seite über die K1-Kategorien: 1 Linie, 2 Unterstützung, 3 Sturm/Elite, 4 Reiter, 5 Anführer + Panzer (+ Schreiter mit Maschinenfilter).
import csv, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FRAKTION = {'K': 'Konkordat', 'A': 'Aschenwacht'}
STIMME = {'K': {1: 'Brian', 2: 'Daniel', 3: 'Callum', 4: 'George', 5: 'Bill'},
          'A': {1: 'Charlie', 2: 'Callum', 3: 'Bill (schroff)', 4: 'Will', 5: 'Liam'}}
GRUPPE_SPRECHER = {'linie': 1, 'unterst': 2, 'sturm': 3, 'reiter': 4, 'fuehrer': 5, 'panzer': 5, 'schreiter': 5}
# Not-Anlässe werden gerufen (Spalte ton = ruf), alles andere ruhig, tief, abgehackt
RUF = {'rueckzug', 'panik', 'verwundet', 'niedergehalten', 'gas', 'koloss', 'getroffen', 'panne'}

# Einheit (TYPES-Schlüssel) → Gruppe; Kommentar = Besonderheit
EINHEIT = {
 'K': {'kohorte': 'linie',
       'melder': 'unterst', 'fernsprech': 'unterst', 'feldscher': 'unterst', 'pionier': 'unterst', 'scharf': 'unterst', 'mahlwerk': 'unterst', 'moerser': 'unterst',
       'flammen': 'unterst', 'mineur': 'unterst', 'werkstatt': 'unterst', 'feldkanone': 'unterst', 'haubitze': 'unterst', 'ballon': 'unterst',
       'raeumer': 'sturm', 'oger': 'sturm',
       'reiter': 'reiter',
       'hauptA': 'fuehrer', 'generalA': 'fuehrer', 'koloss': 'panzer',
       'turm': 'schreiter', 'orden': 'schreiter', 'kreuz': 'schreiter'},
 'A': {'grenadier': 'linie',
       'signal': 'unterst', 'heiler': 'unterst', 'pionierD': 'unterst', 'buechse': 'unterst', 'sense': 'unterst', 'minenwerfer': 'unterst', 'brand': 'unterst',
       'gasschutz': 'unterst', 'munition': 'unterst', 'pirsch': 'unterst', 'geschuetz': 'unterst',
       'sturm': 'sturm', 'schwer': 'sturm', 'huenen': 'sturm', 'panzerk': 'sturm',
       'lanzeD': 'reiter',
       'hauptD': 'fuehrer', 'generalD': 'fuehrer', 'banner': 'fuehrer', 'sturmpz': 'panzer', 'bohrer': 'panzer',
       'knecht': 'schreiter', 'saeger': 'schreiter', 'klaue': 'schreiter'},
}

RUFE = {
 'K': {
  'linie': {
   'anwahl': ['Ready.', 'Sir?', 'Standing by.', 'Orders?'],
   'befehl': ['Understood.', 'Moving out.', 'On our way.', 'Right away.'],
   'angriff': ['Open fire!', 'At them!', 'Fix bayonets!', 'For the Crown!'],
   'rueckzug': ['Fall back! Fall back!', 'Pull back!', 'Back to the line!'],
   'panik': ['Get out of here!', "We can't hold!", 'Run!'],
   'verwundet': ['Medic!', 'Man down!', 'Need help here!'],
   'sammeln': ["We're steady.", 'Line holds.', 'Form up, lads.'],
   'tod': ["We're done…", 'No one left…', "Line's broken…"],
   'niedergehalten': ['Heads down!', "We're pinned!", 'Take cover!'],
   'gas': ['Gas! Masks on!', 'Gas, gas!', 'Gas attack!'],
   'granate': ['Grenade!', 'Throwing!', 'Fire in the hole!'],
   'feuerbereit': ['Watching the line.', 'Ready when they come.', 'Sector covered.'],
   'feuer': ['Fire!', 'Volley!', 'Target sighted.'],
   'zielfeld': ['Position taken.', 'Ground held.', "Flag's ours."],
   'koloss': ['Walker ahead!', 'Steel coming!', 'Tank! Tank!'],
  },
  'unterst': {
   'anwahl': ['Crew ready.', 'Standing by.', "What's the job?"],
   'befehl': ['Moving the kit.', 'Understood.', 'Relocating.'],
   'angriff': ['Firing!', 'Rounds away!', 'On target!'],
   'rueckzug': ['Pack up, fall back!', 'Leave the kit, go!', 'Pulling back!'],
   'panik': ["We're overrun!", 'Get out!', 'Run for it!'],
   'verwundet': ['Medic, now!', 'Crew hit!', "We're hurt!"],
   'sammeln': ['Crew steady.', 'Back in position.', 'Carry on.'],
   'tod': ["Crew's gone…", 'Nobody left…', "Gun's silent…"],
   'niedergehalten': ['Keep down!', 'Pinned at the gun!', "Can't move!"],
   'gas': ['Gas! Masks!', 'Gas on the crew!', 'Gas, gas!'],
   'feuerbereit': ["Gun's up.", 'Covering.', 'Ready to fire.'],
   'feuer': ['Shot out!', 'Fire!', 'Rounds on the way!'],
  },
  'sturm': {
   'anwahl': ['Clearers ready.', 'Shields up.', 'Say the word.'],
   'befehl': ['Moving in.', 'Confirmed.', 'Going in.'],
   'angriff': ['Into the trench!', 'Clear it!', 'Shields, push!'],
   'rueckzug': ['Out, out!', 'Behind the shields!', 'Fall back!'],
   'panik': ['Too much!', 'Get out!', 'Drop the shields, run!'],
   'verwundet': ['Medic, quick!', 'Two men hit!', "We're hurt bad!"],
   'sammeln': ['Shields up again.', 'We stand.', 'Reform.'],
   'tod': ['Trench… not cleared…', "We're finished…", 'Shields… down…'],
   'granate': ['Grenade in!', 'Throwing!', 'Charge in!'],
   'schilde': ['Shields forward!', 'Close the wall!', 'Shield to shield!'],
   'zielfeld': ['Trench cleared.', 'Section clean.', "It's ours."],
  },
  'reiter': {
   'anwahl': ['Squadron ready.', "Steam's up.", 'Mounted.'],
   'befehl': ['At the trot.', 'Squadron, forward.', 'Riding.'],
   'angriff': ['Charge!', 'Blades up!', 'Break through!'],
   'rueckzug': ['Wheel away!', 'Turn back!', 'Break off!'],
   'panik': ['Horses are bolting!', 'Away, away!', "Can't hold them!"],
   'verwundet': ['Rider down!', 'Horse hit!', 'Losing steam!'],
   'sammeln': ['Squadron, rally.', 'Back in line.', 'Easy now.'],
   'tod': ['Squadron… lost…', 'No riders left…', "Steam's… out…"],
  },
  'panzer': {
   'anwahl': ['Colossus ready.', 'Engine running.', 'Crew listening.'],
   'befehl': ['Driver, advance.', 'Rolling.', 'Course confirmed.'],
   'angriff': ['Gunner, fire!', 'On the way!', 'Target acquired.'],
   'getroffen': ["We're hit!", 'Armour holding!', 'Hit up front!'],
   'panne': ["Track's gone!", "We're stuck!", "Engine's dead!"],
   'rueckzug': ['Reverse, reverse!', 'Pull back!', 'Out of the line!'],
   'panik': ['Get out of this thing!', "We're burning!", 'Bail out!'],
   'verwundet': ['Badly damaged!', 'Engine fire!', 'Losing pressure!'],
   'sammeln': ['Crew steady.', 'Back in action.', 'Systems up.'],
   'tod': ['Bail out, bail out!', 'Colossus lost…', 'Radio… dead…'],
  },
  'fuehrer': {
   'anwahl': ['Go ahead.', 'Report.', "I'm listening."],
   'befehl': ['Carry on.', 'Make it so.', 'Good. Forward.'],
   'angriff': ['Open fire!', 'Give them hell!', 'Aim… fire!'],
   'befehl_sammeln': ['Rally on me!', 'Steady, men!', 'Hold the line!'],
   'befehl_feuerfrei': ['Fire at will!', 'Free fire!', 'Let them come – fire!'],
   'grossbefehl': ['Not one step back!', 'This line holds!', 'We hold here!'],
   'rueckzug': ['Back to the trench!', 'Orderly withdrawal!', 'Fall back, in order!'],
   'panik': ['Staff is pulling out!', 'We have to go!', 'Every man for himself!'],
   'verwundet': ['Staff hit!', 'Medic to the staff!', "I'm wounded!"],
   'sammeln': ['Staff ready.', 'Order restored.', 'Carry on.'],
   'tod': ['Command… is down…', 'Take over…', 'Staff… lost…'],
  },
  'schreiter': {
   'anwahl': ['Unit ready.', 'Boiler pressurised.', 'Awaiting orders.'],
   'befehl': ['Advancing.', 'Course confirmed.', 'Moving.'],
   'angriff': ['Target engaged.', 'Firing.', 'Target in sight.'],
   'nahkampf': ['Close combat.', 'Crushing.', 'Contact.'],
   'getroffen': ['Damage reported.', 'Armour damaged.', 'Hit.'],
   'schwer': ['Systems failing.', 'Pressure critical.', 'Boiler breached.'],
   'feind': ['Enemy detected.', 'Target sighted.', 'Hostiles ahead.'],
   'tod': ['Shutting down…', 'Boiler… out…', 'End…'],
  },
 },
 'A': {
  'linie': {
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
  'unterst': {
   'anwahl': ['Trupp bereit.', 'Bereit.', 'Auftrag?'],
   'befehl': ['Verlegen.', 'Bestätigt.', 'Stellungswechsel.'],
   'angriff': ['Feuer!', 'Schuss raus!', 'Im Ziel!'],
   'rueckzug': ['Abbauen, zurück!', 'Gerät liegen lassen!', 'Absetzen!'],
   'panik': ['Überrannt!', 'Raus hier!', 'Weg, weg!'],
   'verwundet': ['Sanitäter, schnell!', 'Bedienung getroffen!', 'Verwundete!'],
   'sammeln': ['Trupp steht.', 'Wieder in Stellung.', 'Weitermachen.'],
   'tod': ['Trupp… gefallen…', 'Keiner mehr…', 'Gerät… verloren…'],
   'niedergehalten': ['Unten bleiben!', 'Liegen fest!', 'Kein Durchkommen!'],
   'gas': ['Gas! Masken!', 'Gas am Gerät!', 'Gasalarm!'],
   'feuerbereit': ['Gerät steht.', 'Sichern.', 'Feuerbereit.'],
   'feuer': ['Schuss!', 'Feuer!', 'Raus damit!'],
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
   'dauerfeuer': ['Dauerfeuer!', 'Nicht nachlassen!', 'Weiter feuern!'],
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
   'banner': ['Banner hoch!', 'Banner steht!', 'Banner auf, weiter!'],
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
  },
 },
}

# Erscheinen (Nachschub/Aufstellung): je Einheit 2 Fassungen; Sprecher über EINHEIT
ERSCHEINEN = {
 'K': {'hauptA': ['Captain reporting.', "Staff's here – orders?"], 'generalA': ['The General has the field.', 'High command takes over.'],
       'kohorte': ['Rifle cohort, reporting!', 'Cohort ready.'], 'melder': ['Runner ready.', 'Runner and dog, reporting.'],
       'fernsprech': ["Signals team, line's up.", 'Telephone section reporting.'], 'feldscher': ['Medic reporting.', 'Field surgeon ready.'],
       'pionier': ['Trench sappers, reporting!', 'Sappers ready, spades out.'], 'scharf': ['Snipers in position.', 'Eyes on the line.'],
       'mahlwerk': ['Grinder team, reporting!', 'Gun ready to set up.'], 'moerser': ['Trench mortar ready.', 'Mortar team reporting.'],
       'flammen': ['Flame team, reporting!', 'Burners lit.'], 'feldkanone': ['Field gun, reporting!', 'Gun ready.'],
       'haubitze': ['Thunder battery, reporting!', 'Battery standing by.'], 'mineur': ['Miners, reporting!', 'Tunnellers ready.'],
       'werkstatt': ['Supply team, reporting!', 'Tools and rounds here.'], 'ballon': ['Balloon observer, going up.', 'Balloon ready, clear view.'],
       'raeumer': ['Trench clearers, reporting!', 'Clearers and shields ready.'], 'reiter': ['Steel riders, reporting!', 'Squadron under steam.'],
       'koloss': ['Land colossus rolling in.', 'Colossus ready.'], 'turm': ['Tower walker, operational.', 'Tower rising.'],
       'orden': ['Order walker, operational.', 'The Order marches.'], 'kreuz': ['Cross walker, operational.', 'The Lion walks.']},
 'A': {'hauptD': ['Hauptmann zur Stelle.', 'Stab eingetroffen.'], 'generalD': ['Der General führt.', 'Oberkommando im Feld.'],
       'grenadier': ['Aschengrenadiere, zur Stelle!', 'Grenadiere melden sich.'], 'signal': ['Signaltrupp, zur Stelle!', 'Leuchtzeichen bereit.'],
       'heiler': ['Sanitäter zur Stelle.', 'Verbandsplatz steht.'], 'pionierD': ['Drahtpioniere, zur Stelle!', 'Draht und Minen bereit.'],
       'banner': ['Bannerträger, zur Stelle!', 'Das Banner ist da.'], 'buechse': ['Panzerbüchse, zur Stelle!', 'Büchse geladen.'],
       'sense': ['Sensenwerk, zur Stelle!', 'MG bereit.'], 'minenwerfer': ['Minenwerfer, zur Stelle!', 'Werfer bereit.'],
       'brand': ['Brandtrupp, zur Stelle!', 'Brenner gezündet.'], 'geschuetz': ['Geschütz, zur Stelle!', 'Batterie bereit.'],
       'gasschutz': ['Gasschutztrupp, zur Stelle!', 'Entgiftung bereit.'], 'munition': ['Munitionstrupp, zur Stelle!', 'Nachschub ist da.'],
       'pirsch': ['Pirschjäger, zur Stelle.', 'Wir sind schon da.'], 'sturm': ['Sturmbrecher, zur Stelle!', 'Stoßtrupp bereit.'],
       'schwer': ['Schwere Grabenwacht, zur Stelle!', 'Schilde geschlossen.'], 'panzerk': ['Panzerknechte, zur Stelle!', 'Anzüge unter Druck.'],
       'huenen': ['Eiserne Hünen, zur Stelle!', 'Hünen marschieren.'], 'lanzeD': ['Sprenglanzen-Reiter, zur Stelle!', 'Lanzen geladen.'],
       'sturmpz': ['Sturmpanzer rollt an.', 'Panzer einsatzbereit.'], 'bohrer': ['Bohrkoloss rollt an.', 'Bohrer läuft an.'],
       'knecht': ['Eisenknecht, betriebsbereit.', 'Eisenknecht marschiert.'], 'saeger': ['Sägeschreiter, betriebsbereit.', 'Säge läuft.'],
       'klaue': ['Klauenschreiter, betriebsbereit.', 'Klauen frei.']},
}


def sprecher(fr, gruppe): return f'{fr}{GRUPPE_SPRECHER[gruppe]}'


def zeilen():
    rows = []
    for fr, gruppen in RUFE.items():
        for gr, anl in gruppen.items():
            for an, texte in anl.items():
                for i, t in enumerate(texte, 1):
                    rows.append((f'{fr}_{gr}_{an}_{i}', FRAKTION[fr], sprecher(fr, gr), an, gr, 'ruf' if an in RUF else 'ruhig', t))
        for typ, texte in ERSCHEINEN[fr].items():
            for i, t in enumerate(texte, 1):
                rows.append((f'{fr}_erscheinen_{typ}_{i}', FRAKTION[fr], sprecher(fr, EINHEIT[fr][typ]), 'erscheinen', typ, 'ruhig', t))
    return rows


def main():
    rows = zeilen()
    out = ROOT / 'entwurf' / 'stimmen_texte.csv'
    with open(out, 'w', newline='', encoding='utf-8-sig') as f:
        w = csv.writer(f, delimiter=';')
        w.writerow(['id', 'fraktion', 'sprecher', 'anlass', 'einheit', 'ton', 'text'])
        w.writerows(rows)
    lang = [r for r in rows if len(r[6].replace('–', ' ').split()) > 5]
    print(out, len(rows), 'Zeilen,', sum(len(r[6]) for r in rows), 'Zeichen', '| zu lang:', [r[0] for r in lang])
    if '--md' in sys.argv:
        print('\n| Sprecher | Stimme | Zeilen | davon ruf | Zeichen |\n|---|---|---|---|---|')
        for fr in RUFE:
            for n in range(1, 6):
                sp = f'{fr}{n}'; rs = [r for r in rows if r[2] == sp]
                print(f'| {sp} | {STIMME[fr][n]} | {len(rs)} | {sum(r[5] == "ruf" for r in rs)} | {sum(len(r[6]) for r in rs)} |')
        print('\n| Fraktion | Sprecher | Einheiten (TYPES-Schlüssel) |\n|---|---|---|')
        for fr in RUFE:
            for n in range(1, 6):
                ts = [t for t, g in EINHEIT[fr].items() if GRUPPE_SPRECHER[g] == n]
                print(f'| {FRAKTION[fr]} | {fr}{n} {STIMME[fr][n]} | ' + ', '.join(f'`{t}`' + (' (Schreiter, Maschinenfilter)' if EINHEIT[fr][t] == 'schreiter' else ' (Bordfunk)' if EINHEIT[fr][t] == 'panzer' else '') for t in ts) + ' |')


if __name__ == '__main__':
    main()
