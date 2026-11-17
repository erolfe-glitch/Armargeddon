// Erzeugt von tools/entwurf_bedienfeld.js – Daten für entwurf/probe/bedienfeld.html (Entwurf, nicht im Spiel)
window.ENTWURF = {
 "shop": [
  {
   "t": "hauptA",
   "name": "Hauptmann mit Stab",
   "kosten": 45,
   "kat": "Kommando",
   "tags": [
    "Befehl alle 2 Runden, 2 Felder",
    "Sammeln, Feuer frei",
    "Feuerbereitschaft"
   ],
   "text": "Kommandotrupp: gibt jede zweite Runde einen Befehl an alle eigenen Truppen bis 2 Felder: „Sammeln“ oder „Feuer frei“ (Fernkampf ×1,25 bis zu ihrem nächsten Zug). Eigene Truppen in der Nähe verlieren weniger Moral und sammeln sich eher.",
   "real": "Ein Hauptmann führte eine Kompanie von rund 200 Mann. Die Verluste unter jungen Offizieren waren sehr hoch, weil sie beim Angriff vorangingen.",
   "bild": "konkordat_hauptmann",
   "mech": false,
   "werte": {
    "Angriff": 3,
    "Abwehr": 3,
    "Moral": 9,
    "Zug": 3,
    "Reichweite": 2
   }
  },
  {
   "t": "generalA",
   "name": "General mit Stab",
   "kosten": 75,
   "kat": "Kommando",
   "tags": [
    "Befehl jede Runde, 3 Felder",
    "Einmal: Halten um jeden Preis",
    "Höchstens einer"
   ],
   "text": "Kommandotrupp: gibt jede Runde einen Befehl an alle eigenen Truppen bis 3 Felder („Sammeln“ oder „Feuer frei“). Einmal je Schlacht „Halten um jeden Preis“: alle eigenen Einheiten fliehen bis zum nächsten eigenen Zug nicht, Abwehr ×1,25. Jede Armee hat genau einen (Pflicht), schwach im Kampf.",
   "real": "Generäle führten meist aus Hauptquartieren weit hinter der Front, verbunden über Telefon und Meldegänger. Trotzdem fielen im Ersten Weltkrieg über 70 britische Generäle.",
   "bild": "konkordat_general",
   "mech": false,
   "werte": {
    "Angriff": 2,
    "Abwehr": 3,
    "Moral": 10,
    "Zug": 3,
    "Reichweite": 1
   }
  },
  {
   "t": "kohorte",
   "name": "Schützenkohorte",
   "kosten": 40,
   "kat": "Standard",
   "tags": [
    "Schneidet Draht",
    "Schuss 2 Felder",
    "Eingraben"
   ],
   "text": "Schießt 2 Felder weit, stürmt Gräben im Nahkampf, schneidet Draht. Eingraben (1 ●, im offenen Gelände oder Trichter): Abwehr ×1,3, bis die Einheit wieder zieht.",
   "real": "Im Ersten Weltkrieg trugen Infanteristen oft rund 30 kg Ausrüstung in den Angriff, quer durch Schlamm und Trichter.",
   "bild": "konkordat_soldat_1",
   "mech": false,
   "werte": {
    "Angriff": 4,
    "Abwehr": 4,
    "Moral": 7,
    "Zug": 3,
    "Reichweite": 2
   }
  },
  {
   "t": "melder",
   "name": "Meldegänger mit Hund",
   "kosten": 25,
   "kat": "Standard",
   "tags": [
    "Befehl überbringen: +1 Aktionspunkt",
    "Zieht 5 Felder"
   ],
   "text": "Schnell (5 Felder). Befehl überbringen: einmal je Runde bekommt eine eigene Einheit bis 3 Felder +1 Aktionspunkt, zum Beispiel für einen weiteren Zug. Kaum Kampfkraft.",
   "real": "Weil Telefonleitungen im Trommelfeuer ständig rissen, überbrachten Meldegänger, Brieftauben und Meldehunde die Nachrichten.",
   "bild": "konkordat_melder_1",
   "mech": false,
   "werte": {
    "Angriff": 2,
    "Abwehr": 2,
    "Moral": 7,
    "Zug": 5,
    "Reichweite": 0
   }
  },
  {
   "t": "fernsprech",
   "name": "Fernsprechtrupp",
   "kosten": 25,
   "kat": "Spezial",
   "tags": [
    "Feuerschlag anfordern (alle 3 Runden)",
    "Sieht 6 Felder",
    "Anführer befehlen jede Runde"
   ],
   "text": "Feuerschlag anfordern (alle Punkte, alle 3 Runden): eine Batterie hinter der Front schießt auf ein Feld in Sicht (6 Felder), wie eine Haubitze; 25 % Streuung auf ein Nachbarfeld. Anführer bis 3 Felder Entfernung dürfen jede Runde einen Befehl geben.",
   "real": "Feldtelefone verbanden die Gräben mit den Batterien. Die Leitungen wurden tief eingegraben, rissen im Trommelfeuer aber trotzdem ständig.",
   "bild": "konkordat_fernsprech_3",
   "mech": false,
   "werte": {
    "Angriff": 2,
    "Abwehr": 2,
    "Moral": 7,
    "Zug": 3,
    "Reichweite": 0
   }
  },
  {
   "t": "feldscher",
   "name": "Feldscher",
   "kosten": 25,
   "kat": "Standard",
   "tags": [
    "Versorgt einen Nachbarn",
    "Heilt Vergiftung"
   ],
   "text": "Versorgt statt eines Angriffs eine eigene Nachbareinheit: Stärke +15 und Moral +10, heilt auch Vergiftung. Kaum Kampfkraft.",
   "real": "Sanitäter und Krankenträger holten Verwundete oft unter Beschuss aus dem Niemandsland. Viele von ihnen fielen dabei selbst.",
   "bild": "konkordat_sanitaeter_4",
   "mech": false,
   "werte": {
    "Angriff": 1,
    "Abwehr": 2,
    "Moral": 6,
    "Zug": 3,
    "Reichweite": 0
   }
  },
  {
   "t": "pionier",
   "name": "Graben-Pioniere",
   "kosten": 55,
   "kat": "Spezial",
   "tags": [
    "Draht schneiden und angreifen",
    "×1,5 gegen Kolosse",
    "Bergt Kolosse und Maschinen"
   ],
   "text": "Schneidet Draht und kann danach noch angreifen. Haftladung (2 ●, alle 2 Runden) an einem Nachbarfeld: schwerer Schaden, doppelt gegen Kolosse und Kampfmaschinen, Bunkerschutz zählt nicht; Bunker und Barrikaden werden zu Trichtern, Draht wird zerrissen. Im Nahkampf ×1,5 gegen Kolosse und Kampfmaschinen. Bergt festgefahrene Fahrzeuge.",
   "real": "Pioniere schnitten nachts Gassen in den Draht, legten Sprengladungen und gruben Stollen unter die gegnerischen Linien.",
   "bild": "konkordat_pionier_1",
   "mech": false,
   "werte": {
    "Angriff": 4,
    "Abwehr": 3,
    "Moral": 7,
    "Zug": 3,
    "Reichweite": 2
   }
  },
  {
   "t": "scharf",
   "name": "Scharfschütze",
   "kosten": 50,
   "kat": "Spezial",
   "tags": [
    "Schuss 4 Felder",
    "Hält das Ziel nieder",
    "Feuerbereitschaft"
   ],
   "text": "Schießt 4 Felder weit. Jeder Treffer hält das Ziel nieder. Im Nahkampf fast wehrlos.",
   "real": "Scharfschützen mit Zielfernrohr lauerten oft stundenlang getarnt. Schon ein kurz über die Grabenkante gehobener Kopf konnte tödlich sein.",
   "bild": "konkordat_scharfschuetze_3",
   "mech": false,
   "werte": {
    "Angriff": 1,
    "Abwehr": 2,
    "Moral": 6,
    "Zug": 3,
    "Reichweite": 4
   }
  },
  {
   "t": "schildwall",
   "name": "Schildwall",
   "kosten": 40,
   "kat": "Spezial",
   "tags": [
    "Sehr zäh",
    "Keine Schusswaffe",
    "Schilde vor"
   ],
   "text": "Schwer gepanzert und langsam. Gut, um Gräben und Ruinen zu halten, die man genommen hat. Keine Schusswaffe. Schilde vor (1 ●): eigene Einheiten in den Nachbarfeldern nehmen bis zum nächsten eigenen Zug Beschuss ×0,75.",
   "real": "Beide Seiten erprobten Stahlschilde und Körperpanzer. Sie waren schwer und schützten vor allem gegen Splitter, kaum gegen Gewehrkugeln aus der Nähe.",
   "bild": "konkordat_schildwall_1",
   "mech": false,
   "werte": {
    "Angriff": 4,
    "Abwehr": 6,
    "Moral": 8,
    "Zug": 2,
    "Reichweite": 0
   }
  },
  {
   "t": "mahlwerk",
   "name": "Mahlwerk-Trupp",
   "kosten": 40,
   "kat": "Standard",
   "tags": [
    "Sperrfeuer: 2 Schüsse",
    "Erst aufbauen, dann feuern"
   ],
   "text": "Maschinengewehr, 3 Felder weit. Wer zieht, schießt nicht. Sperrfeuer (alle Punkte, aufgebaut und unbewegt): schießt in der gegnerischen Runde bis zu 2-mal auf Gegner, die sich im Schussfeld im Offenen bewegen.",
   "real": "Maschinengewehre wie das britische Vickers oder das deutsche MG 08 schossen rund 450 bis 500 Schuss pro Minute.",
   "bild": "konkordat_mg",
   "mech": false,
   "werte": {
    "Angriff": 2,
    "Abwehr": 3,
    "Moral": 7,
    "Zug": 2,
    "Reichweite": 3
   }
  },
  {
   "t": "moerser",
   "name": "Grabenmörser",
   "kosten": 30,
   "kat": "Artillerie",
   "tags": [
    "Mörser",
    "Ziehen und feuern",
    "Steilfeuer 4 Felder"
   ],
   "text": "Mörser: leichte Steilfeuerwaffe, 4 Felder weit. Sprenggranaten oder Sperrfeuer. Kann in derselben Runde ziehen und feuern.",
   "real": "Der britische Stokes-Mörser von 1915 war so leicht, dass ihn wenige Männer in den vordersten Graben tragen konnten.",
   "bild": "konkordat_moerser",
   "mech": false,
   "werte": {
    "Angriff": 0,
    "Abwehr": 3,
    "Moral": 6,
    "Zug": 2,
    "Reichweite": 4
   }
  },
  {
   "t": "reiter",
   "name": "Lanzenreiter",
   "kosten": 30,
   "kat": "Standard",
   "tags": [
    "Ansturm ×1,5",
    "Kein Draht, kein Totholz"
   ],
   "text": "Sehr schnell. Ansturm nach 3 Feldern ×1,5, gegen Fliehende ×2. Kommt nicht durch Draht und Totholz. MG-Feuer trifft doppelt.",
   "real": "Die Kavallerie wartete an der Westfront jahrelang auf den Durchbruch. Gegen Maschinengewehre und Stacheldraht war sie fast machtlos.",
   "bild": "konkordat_reiter_1",
   "mech": false,
   "werte": {
    "Angriff": 5,
    "Abwehr": 2,
    "Moral": 7,
    "Zug": 4,
    "Reichweite": 0
   }
  },
  {
   "t": "raeumer",
   "name": "Grabenräumer",
   "kosten": 50,
   "kat": "Spezial",
   "tags": [
    "Sickert durch",
    "Handgranaten",
    "×1,5 gegen Kolosse"
   ],
   "text": "Nahkämpfer ohne Gewehr. Sickert durch: Gegner halten ihn nicht auf. Handgranaten heben den Grabenschutz auf. Gegen Kampfmaschinen im Nahkampf ×1,5.",
   "real": "Für nächtliche Grabenüberfälle nutzten Soldaten Grabendolche, Keulen und geschärfte Spaten, weil Gewehre im engen Graben zu lang waren.",
   "bild": "konkordat_sturm_1",
   "mech": false,
   "werte": {
    "Angriff": 6,
    "Abwehr": 4,
    "Moral": 8,
    "Zug": 3,
    "Reichweite": 0
   }
  },
  {
   "t": "flammen",
   "name": "Flammentrupp",
   "kosten": 45,
   "kat": "Spezial",
   "tags": [
    "Flammenstrahl",
    "Deckung schützt nicht",
    "Feld brennt"
   ],
   "text": "Flammenstrahl auf ein Nachbarfeld. Deckung schützt nicht, doppelter Moralverlust. Das Feld brennt bis zum nächsten eigenen Zug: wer dort steht oder hineinzieht, nimmt Feuerschaden, Draht verbrennt. Wird er beschossen, trifft es ihn ×1,5.",
   "real": "Auch die Briten setzten Flammenwerfer ein. An der Somme wurden 1916 riesige fest eingebaute Livens-Flammenwerfer unter dem Niemandsland vorgeschoben.",
   "bild": "konkordat_flammen_1",
   "mech": false,
   "werte": {
    "Angriff": 2,
    "Abwehr": 3,
    "Moral": 7,
    "Zug": 2,
    "Reichweite": 1
   }
  },
  {
   "t": "feldkanone",
   "name": "Feldkanone",
   "kosten": 50,
   "kat": "Artillerie",
   "tags": [
    "Reichweite 5",
    "Direktschuss ×2,5 auf Kolosse",
    "Aufprotzen"
   ],
   "text": "Leichte Artillerie: 5 Felder Reichweite, kein Gas. Direkter Schuss bis 3 Felder trifft Kolosse und Kampfmaschinen ×2,5. Aufgeprotzt zieht sie 3 Felder. Im Nahkampf wehrlos.",
   "real": "Die britische 18-Pfünder-Feldkanone war das wichtigste Geschütz der britischen Armee. Bis 1918 verschoss sie rund 100 Millionen Granaten.",
   "bild": "konkordat_feldkanone",
   "mech": false,
   "werte": {
    "Angriff": 0,
    "Abwehr": 3,
    "Moral": 6,
    "Zug": 1,
    "Reichweite": 5
   }
  },
  {
   "t": "haubitze",
   "name": "Donnerrohr-Batterie",
   "kosten": 60,
   "kat": "Artillerie",
   "tags": [
    "Feuert über Truppen",
    "Gas und Sperrfeuer",
    "Aufprotzen"
   ],
   "text": "Mittlere Artillerie, kein direkter Schuss. Schießt über eigene Truppen hinweg, wenn eine eigene Einheit das Ziel sieht. Sprenggranaten, Sperrfeuer oder Gas. Aufgeprotzt zieht sie 3 Felder, kann dann aber nicht feuern. Im Nahkampf wehrlos.",
   "real": "Artillerie verursachte im Ersten Weltkrieg die meisten Verluste, nach gängigen Schätzungen deutlich mehr als die Hälfte.",
   "bild": "konkordat_geschuetz",
   "mech": false,
   "werte": {
    "Angriff": 0,
    "Abwehr": 3,
    "Moral": 6,
    "Zug": 1,
    "Reichweite": 6
   }
  },
  {
   "t": "koloss",
   "name": "Landkoloss",
   "kosten": 80,
   "kat": "Fahrzeuge und Kampfmaschinen",
   "tags": [
    "Gepanzert",
    "Walzt Draht nieder",
    "Pannen"
   ],
   "text": "Gepanzert: Gewehre und MG prallen ab, Gas schadet nicht. Walzt Stacheldraht nieder, überquert Gräben. Bleibt manchmal mit einer Panne liegen.",
   "real": "Die ersten Panzer fuhren im September 1916 an der Somme. Sie waren kaum schneller als ein Fußgänger und fielen oft durch Pannen aus.",
   "bild": "konkordat_koloss",
   "mech": false,
   "werte": {
    "Angriff": 6,
    "Abwehr": 7,
    "Moral": 8,
    "Zug": 2,
    "Reichweite": 2
   }
  },
  {
   "t": "stahl",
   "name": "Stahlgänger-Trupp",
   "kosten": 65,
   "kat": "Fahrzeuge und Kampfmaschinen",
   "tags": [
    "Kampfanzug: Beschuss ×0,5",
    "Draht hält nicht auf",
    "Sturmlauf"
   ],
   "text": "Kleiner Trupp in motorisierten Kampfanzügen. Gewehr- und MG-Feuer wirkt nur halb, Stacheldraht verletzt und hält ihn nicht auf. Sturmlauf (alle Punkte): bis 4 Felder geradeaus, Draht hält nicht auf, am Ende sofort Nahkampf. Kein Koloss: Geschütze und Nahkampf treffen voll.",
   "real": "Motorisierte Kampfanzüge gab es nie. Käuflich war aber Körperpanzer wie der britische „Dayfield Body Shield“, der gegen Splitter half, gegen Gewehrkugeln kaum.",
   "bild": "konkordat_stahl_1",
   "mech": true,
   "werte": {
    "Angriff": 5,
    "Abwehr": 5,
    "Moral": 8,
    "Zug": 3,
    "Reichweite": 2
   }
  },
  {
   "t": "turm",
   "name": "Turmschreiter",
   "kosten": 80,
   "kat": "Fahrzeuge und Kampfmaschinen",
   "tags": [
    "Gepanzert",
    "Geschützturm",
    "Schuss 3 Felder"
   ],
   "text": "Schreitende Kampfmaschine mit Geschützturm und Maschinengewehr. Gepanzert wie ein Landkoloss: Gewehre und MG prallen ab. Bleibt manchmal mit einer Panne liegen.",
   "real": "Britische Panzer gab es als „Male“ mit 6-Pfünder-Kanonen und als „Female“ nur mit Maschinengewehren. Ab 1917 kamen „Hermaphrodites“ mit beidem.",
   "bild": "konkordat_turmschreiter",
   "mech": true,
   "werte": {
    "Angriff": 6,
    "Abwehr": 7,
    "Moral": 8,
    "Zug": 2,
    "Reichweite": 3
   }
  },
  {
   "t": "orden",
   "name": "Ordensschreiter",
   "kosten": 85,
   "kat": "Fahrzeuge und Kampfmaschinen",
   "tags": [
    "Gepanzert",
    "Drehlauf",
    "Kettensäge"
   ],
   "text": "Kampfmaschine in Ritterrüstung mit Drehlauf-Waffe und Kettensäge. Stark auf kurze Entfernung und im Nahkampf. Bleibt manchmal mit einer Panne liegen.",
   "real": "Auch die Briten bauten keine Schreitmaschinen. Ihr erster Panzer, der Mark I von 1916, hatte acht Mann Besatzung und fuhr etwa so schnell wie ein Fußgänger.",
   "bild": "konkordat_ordensschreiter",
   "mech": true,
   "werte": {
    "Angriff": 7,
    "Abwehr": 7,
    "Moral": 8,
    "Zug": 2,
    "Reichweite": 2
   }
  },
  {
   "t": "kreuz",
   "name": "Kreuzschreiter",
   "kosten": 90,
   "kat": "Fahrzeuge und Kampfmaschinen",
   "tags": [
    "Schwer gepanzert",
    "Stahlfaust",
    "Panne möglich"
   ],
   "text": "Schwer gepanzerte Kampfmaschine mit Maschinengewehr und Stahlfaust. Am zähesten von allen, schießt aber schwächer. Bleibt manchmal mit einer Panne liegen.",
   "real": "Panzerbesatzungen trugen Lederhelme und Kettenmasken gegen Splitter, die beim Beschuss innen von der Panzerwand absprangen.",
   "bild": "konkordat_kreuzschreiter",
   "mech": true,
   "werte": {
    "Angriff": 7,
    "Abwehr": 8,
    "Moral": 8,
    "Zug": 2,
    "Reichweite": 2
   }
  },
  {
   "t": "rauch",
   "name": "Rauchwerfer-Trupp",
   "kosten": 30,
   "kat": "Spezial",
   "tags": [
    "Nebelwand"
   ],
   "text": "Nebelwand (2 ●, alle 3 Runden): Zielfeld bis 3 Felder und alle Nachbarn liegen bis zur nächsten eigenen Runde im Nebel. Dort kann niemand hinein- oder herausschießen.",
   "real": "Bei Loos legten die Briten im September 1915 neben Gas auch künstlichen Nebel aus Rauchkerzen, um den Angriff zu verschleiern. Später verschossen Stokes-Mörser Nebelgranaten.",
   "bild": "konkordat_rauchwerfer",
   "mech": false,
   "werte": {
    "Angriff": 2,
    "Abwehr": 3,
    "Moral": 7,
    "Zug": 3,
    "Reichweite": 0
   }
  },
  {
   "t": "mineur",
   "name": "Mineure (Tunnelgräber)",
   "kosten": 40,
   "kat": "Spezial",
   "tags": [
    "Stollen sprengen",
    "Draht schneiden für 1 Punkt"
   ],
   "text": "Stollen graben (2 ●, alle 4 Runden): unter einen Graben, Bunker oder ein Gebäude bis 2 Felder. Zwei eigene Runden später fliegt das Feld in die Luft (schwerer Schaden, wird zum Trichter).",
   "real": "Bei Messines zündeten britische Tunnelbauer am 7. Juni 1917 19 Minen unter den deutschen Stellungen. Die Explosionen waren bis nach London zu hören.",
   "bild": "konkordat_mineur_1",
   "mech": false,
   "werte": {
    "Angriff": 3,
    "Abwehr": 3,
    "Moral": 7,
    "Zug": 3,
    "Reichweite": 0
   }
  },
  {
   "t": "werkstatt",
   "name": "Versorgungstrupp",
   "kosten": 45,
   "kat": "Spezial",
   "tags": [
    "Repariert Kolosse",
    "Nachladen",
    "Bergt Kolosse und Maschinen"
   ],
   "text": "Je Runde eine Aufgabe: einen Koloss oder eine Kampfmaschine im Nachbarfeld reparieren (Stärke +25, alle 2 Runden) bzw. festgefahrene oder liegengebliebene Fahrzeuge bergen – oder Nachladen (1 ●, alle 2 Runden): ein MG oder Geschütz im Nachbarfeld darf noch einmal feuern.",
   "real": "Bei Cambrai 1917 fiel ein großer Teil der britischen Panzer durch Pannen und Festfahren aus. Bergungs- und Werkstattzüge holten sie zurück; Trägertrupps brachten Granaten und Gurte nach vorn.",
   "bild": "konkordat_versorgung_1",
   "mech": false,
   "werte": {
    "Angriff": 2,
    "Abwehr": 2,
    "Moral": 6,
    "Zug": 3,
    "Reichweite": 0
   }
  },
  {
   "t": "ballon",
   "name": "Ballonbeobachter",
   "kosten": 25,
   "kat": "Spezial",
   "tags": [
    "Sicht von oben 8 Felder",
    "Ziel markieren",
    "Zieht nicht"
   ],
   "text": "Fesselballon: zieht nicht, sieht 8 Felder über Wald und Häuser hinweg. Ziel markieren (1 ●): ein Feld in Sicht; bis zum nächsten eigenen Zug trifft Artillerie dort ohne Streuung und ×1,25, versteckte Gegner und Minen im Feld und daneben werden aufgedeckt. Wehrlos.",
   "real": "Gefesselte Beobachtungsballone standen hinter der Front und lenkten das Artilleriefeuer per Telefon. Als einzige Flieger trugen ihre Beobachter schon früh Fallschirme.",
   "bild": "konkordat_ballon",
   "mech": false,
   "werte": {
    "Angriff": 0,
    "Abwehr": 1,
    "Moral": 4,
    "Zug": 0,
    "Reichweite": 0
   }
  }
 ],
 "einheit": {
  "name": "Schützenkohorte",
  "seite": "Konkordat",
  "feld": "Schützengraben",
  "leben": 100,
  "moral": 70,
  "moralMax": 70,
  "ap": 2,
  "zug": 3,
  "rng": 2,
  "tags": [
   "Schneidet Draht",
   "Schuss 2 Felder",
   "Eingraben",
   "Feuerbereitschaft"
  ],
  "text": "Schießt 2 Felder weit, stürmt Gräben im Nahkampf, schneidet Draht. Eingraben (1 ●, im offenen Gelände oder Trichter): Abwehr ×1,3, bis die Einheit wieder zieht.",
  "real": "Im Ersten Weltkrieg trugen Infanteristen oft rund 30 kg Ausrüstung in den Angriff, quer durch Schlamm und Trichter.",
  "bild": "konkordat_soldat_1",
  "werte": {
   "Angriff": 4,
   "Abwehr": 4,
   "Moral": 7,
   "Zug": 3,
   "Reichweite": 2
  },
  "deckung": "Gold (Graben)",
  "zustand": [
   "bereit"
  ],
  "knoepfe": [
   [
    "zielen",
    "Beschuss",
    1
   ],
   [
    "nahkampf",
    "Nahkampf",
    2
   ],
   [
    "auge",
    "Feuerbereitschaft",
    2
   ],
   [
    "spitzhacke",
    "Eingraben",
    1
   ],
   [
    "drehpfeil",
    "Nach links drehen",
    0
   ],
   [
    "drehpfeil",
    "Nach rechts drehen",
    0,
    1
   ],
   [
    "haken",
    "Fertig",
    0
   ]
  ]
 },
 "punkte": 140
};
