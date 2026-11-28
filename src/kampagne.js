// Kampagne (K-A, Punkt 156, 2026-11-28): Daten und Regeln der Kampagnenkarte – Provinzen, Orte, Wege, Spielstand, Züge, Übergang Schlacht ↔ Karte.
// Alles als Daten (erweiterbar); die Ansicht und der Ablauf im Spiel stehen in ui.js (Abschnitt „Kampagne“). Läuft auch in Node (tools/test_kampagne.mjs).
// Grundlage: entwurf/KAMPAGNE_PLAN.md Abschnitte 2–4, 8, 10, 13, 14. Nicht in K-A: Wirtschaft (K-B), Ränge (K-C), Gegner-KI (K-D), Renegaten (K-F), Ereignisse (K-G).
(function (root) {
  'use strict';
  const VERSION = 1, SPEICHER = 'arm.kampagne', STARTKASSE = 2000;
  // Besitzer: A = Konkordat (Spieler), D = Aschenwacht, R = Renegaten (in K-A gesperrt). Farben nach STYLE.md / AUFTRAG 156.
  const SEITEN = { A: { name: 'Konkordat', farbe: '#8E2B22', kontur: '#E9D9A8' }, D: { name: 'Aschenwacht', farbe: '#7D8471', kontur: '#1E1B18' }, R: { name: 'Renegaten', farbe: '#2E2A28', kontur: '#9A9089' } };
  const PROVINZEN = [
    { id: 'valmor', name: 'Valmor', text: 'Brückenkopf des Konkordats an der Küste, Sitz des Feldstabs.', schrift: [0.13, 0.2], umriss: [[0, 0], [0.34, 0], [0.33, 0.25], [0.36, 0.5], [0.33, 0.78], [0.35, 1], [0, 1]] },
    { id: 'grauwall', name: 'Grauwall', text: 'Das Grabensystem der Pufferzone – umkämpft seit dem Vertrag von Grauwall.', schrift: [0.5, 0.9], umriss: [[0.33, 0.25], [0.5, 0.23], [0.66, 0.26], [0.64, 0.5], [0.67, 0.75], [0.66, 1], [0.35, 1], [0.33, 0.78], [0.36, 0.5]] },
    { id: 'kraehenfurt', name: 'Krähenfurt', text: 'Vereister Nordabschnitt mit dem alten Stahlwerk, in der Hand von Banden.', schrift: [0.55, 0.05], umriss: [[0.34, 0], [1, 0], [1, 0.29], [0.84, 0.3], [0.66, 0.26], [0.5, 0.23], [0.33, 0.25]] },
    { id: 'aschenhof', name: 'Aschenhof', text: 'Industriestadt der Aschenwacht hinter der Front.', schrift: [0.86, 0.9], umriss: [[0.66, 0.26], [0.84, 0.3], [1, 0.29], [1, 1], [0.66, 1], [0.67, 0.75], [0.64, 0.5]] },
  ];
  // Provinzen: Umriss und Lage der Schrift als Anteile (0–1) der Kartenfläche.
  // Orte: Lage als Anteil der Kartenfläche (x, y 0–1), damit eine spätere gemalte Landkarte sie übernehmen kann.
  // karte = Schlachtkarte, seed = Abwandlung (Startwert), wetter folgt der Karte (Winter nur Krähenfurt/Winterdorf; andere Karten im Winter brauchen erst Gelände-Teile).
  const ORTE = [
    { id: 'valmor', name: 'Valmor-Stadt', prov: 'valmor', besitz: 'A', art: 'hauptstadt', x: 0.12, y: 0.5, karte: 'sanktruss', seed: 101 },
    { id: 'muehlenhof', name: 'Mühlenhof', prov: 'valmor', besitz: 'A', art: 'ort', x: 0.25, y: 0.34, karte: 'grauwall', seed: 102 },
    { id: 'sanktruss', name: 'Sankt Ruß', prov: 'valmor', besitz: 'A', art: 'ort', x: 0.25, y: 0.68, karte: 'sanktruss', seed: 103 },
    { id: 'grauwall', name: 'Grauwall-Stellung', prov: 'grauwall', besitz: 'A', art: 'hauptort', x: 0.43, y: 0.44, karte: 'grauwall', seed: 201 },
    { id: 'kreidegrube', name: 'Kreidegrube', prov: 'grauwall', besitz: 'D', art: 'ort', x: 0.57, y: 0.56, karte: 'grauwall', seed: 202,
      garnison: { grenadier: 3, sense: 1, pionierD: 1 } },
    { id: 'drahtfeld', name: 'Drahtfeld', prov: 'grauwall', besitz: 'R', art: 'ort', x: 0.5, y: 0.3, karte: 'grauwall', seed: 203,
      garnison: { kohorte: 2, grenadier: 2, sense: 1 } },
    { id: 'kraehenfurt', name: 'Krähenfurt', prov: 'kraehenfurt', besitz: 'R', art: 'hauptort', x: 0.62, y: 0.16, karte: 'winterdorf', seed: 301, text: 'Stahlwerk',
      garnison: { kohorte: 2, grenadier: 2, mahlwerk: 1, sense: 1 } },
    { id: 'furtdorf', name: 'Furtdorf', prov: 'kraehenfurt', besitz: 'R', art: 'ort', x: 0.42, y: 0.12, karte: 'winterdorf', seed: 302,
      garnison: { kohorte: 2, grenadier: 2 } },
    { id: 'eisweiher', name: 'Eisweiher', prov: 'kraehenfurt', besitz: 'R', art: 'ort', x: 0.78, y: 0.2, karte: 'winterdorf', seed: 303,
      garnison: { grenadier: 2, kohorte: 1, sense: 1 } },
    { id: 'aschenhof', name: 'Aschenhof-Stadt', prov: 'aschenhof', besitz: 'D', art: 'hauptstadt', x: 0.88, y: 0.55, karte: 'grauwall', seed: 401,
      garnison: { grenadier: 3, sense: 1, geschuetz: 1, sturmpz: 1 } },
    { id: 'russhuette', name: 'Rußhütte', prov: 'aschenhof', besitz: 'D', art: 'ort', x: 0.8, y: 0.38, karte: 'sanktruss', seed: 402,
      garnison: { grenadier: 3, sturm: 1, minenwerfer: 1 } },
    { id: 'grauerhang', name: 'Grauer Hang', prov: 'aschenhof', besitz: 'D', art: 'ort', x: 0.72, y: 0.72, karte: 'grauwall', seed: 403,
      garnison: { grenadier: 3, sense: 1, minenwerfer: 1, hauptD: 1 } },
  ];
  const WEGE = [['valmor', 'muehlenhof'], ['valmor', 'sanktruss'], ['muehlenhof', 'sanktruss'], ['muehlenhof', 'grauwall'], ['sanktruss', 'grauwall'], ['muehlenhof', 'furtdorf'],
    ['grauwall', 'drahtfeld'], ['grauwall', 'kreidegrube'], ['drahtfeld', 'kreidegrube'], ['drahtfeld', 'kraehenfurt'], ['furtdorf', 'kraehenfurt'], ['kraehenfurt', 'eisweiher'],
    ['eisweiher', 'russhuette'], ['kreidegrube', 'grauerhang'], ['kreidegrube', 'russhuette'], ['grauerhang', 'aschenhof'], ['russhuette', 'aschenhof'], ['grauerhang', 'russhuette']];
  // Platzhalter „Aus den Chroniken“ (2–3 Sätze, Namen aus der Weltbibel); vor der Schlacht je Ort, danach je Ausgang
  const CHRONIK_VOR = {
    kreidegrube: 'In den alten Kreidebrüchen hat sich eine Kompanie der Aschenwacht eingegraben. Wer die Grube hält, beherrscht die Straße nach Osten.',
    aschenhof: 'Hinter den Schloten von Aschenhof schlägt das Herz der Aschenwacht. Fällt die Stadt, verstummen die Hochöfen der Grauen Liturgie.',
    russhuette: 'Die Rußhütte speist die Geschütze der Front mit Stahl. Ihre Besatzung weiß, dass es hinter ihr keine Stellung mehr gibt.',
    grauerhang: 'Am Grauen Hang decken Minenwerfer den Weg nach Aschenhof. Der Hang ist kahl geschossen, jede Mulde ist umkämpft.',
  };
  const CHRONIK_STANDARD_VOR = 'Der Feldstab des Konkordats befiehlt den Angriff auf {ort}. Die Truppen des Westlichen Konvents rücken im Morgengrauen vor.';
  const CHRONIK_SIEG = '{ort} ist genommen. Die Fahne des Konkordats weht über den Stellungen, die Verwundeten werden nach Valmor zurückgebracht.';
  const CHRONIK_NIEDERLAGE = 'Der Angriff auf {ort} ist gescheitert. Die Reste der Armee ziehen sich nach {rueck} zurück und sammeln sich.';

  const ortVon = id => ORTE.find(o => o.id === id);
  const nachbarn = id => WEGE.filter(w => w.includes(id)).map(w => w[0] === id ? w[1] : w[0]);
  const zahl = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');   // 2000 → „2.000“
  const truppenAus = (st, liste) => { const t = []; for (const [typ, n] of Object.entries(liste || {})) for (let i = 0; i < n; i++) t.push({ id: st.nextId++, typ, str: 10, rang: 0, schlachten: 0, abschuesse: 0 }); return t; };

  // Neue Kampagne: Startarmee = Gefechtsarmee von Grauwall (Konkordat, mit Feldmarschall), Standort Valmor-Stadt
  function neu(E) {
    const st = { version: VERSION, runde: 1, kasse: STARTKASSE, nextId: 1, gezogen: false, phase: 'karte', schlacht: null, ende: null, weiter: false, letzteMeldung: null, orte: {}, armee: { ort: 'valmor', trupps: [] } };
    for (const o of ORTE) st.orte[o.id] = { besitz: o.besitz, garnison: o.besitz === 'A' ? [] : truppenAus(st, o.garnison) };
    st.armee.trupps = truppenAus(st, E.MAPS.grauwall.army.A);
    return st;
  }
  function gesperrtWarum(st, zu) {
    if (st.ende && !st.weiter) return 'Die Kampagne ist zu Ende.';
    if (st.phase !== 'karte') return 'Erst die Schlacht schlagen.';
    if (!nachbarn(st.armee.ort).includes(zu)) return 'Kein Weg dorthin – die Armee zieht einen Ort je Runde.';
    if (st.gezogen) return 'Die Armee ist in dieser Runde schon gezogen.';
    if (st.orte[zu].besitz === 'R') return 'Renegaten – kommt später.';
    return '';
  }
  // Zug zu einem Nachbarort: eigener Ort → Armee steht dort; Ort der Aschenwacht → Schlacht beginnt (Phase „schlacht“)
  function ziehen(st, zu) {
    const w = gesperrtWarum(st, zu); if (w) return { ok: false, warum: w };
    st.gezogen = true;
    if (st.orte[zu].besitz === 'D') { st.phase = 'schlacht'; st.schlacht = { ort: zu, von: st.armee.ort }; return { ok: true, schlacht: true }; }
    st.armee.ort = zu; return { ok: true };
  }
  function rundeBeenden(st) { if (st.phase !== 'karte') return false; st.runde++; st.gezogen = false; return true; }
  // Armeen für newGame: Anzahl je Typ (E.newGame mit free: true, die Stärke setzt zuordnen danach)
  const zaehle = trupps => trupps.reduce((m, t) => (m[t.typ] = (m[t.typ] || 0) + 1, m), {});
  function schlachtOpts(st) {
    const o = ortVon(st.schlacht.ort);
    return { map: o.karte, seed: o.seed * 1000 + st.runde, free: true, kampagne: true, army: { A: zaehle(st.armee.trupps), D: zaehle(st.orte[o.id].garnison) } };
  }
  // Nach newGame: jede Einheit bekommt ihren Trupp (kId) und dessen Reststärke; je Typ in der Reihenfolge der Liste
  function zuordnen(st, G) {
    const liste = { A: st.armee.trupps, D: st.orte[st.schlacht.ort].garnison };
    for (const sd of ['A', 'D']) { const frei = liste[sd].slice();
      for (const u of G.units) { if (u.side !== sd) continue; const i = frei.findIndex(t => t.typ === u.type); if (i < 0) continue; const t = frei.splice(i, 1)[0]; u.kId = t.id; u.str = Math.max(0.5, Math.min(10, t.str)); } }
  }
  // Nach der Schlacht: Stärken übernehmen, Gefallene und Zerschlagene streichen, Entkommene bleiben, im Gefecht gekaufte Trupps kommen dazu; Besitz und Rückzug
  function nachSchlacht(st, G) {
    const ort = st.schlacht.ort, sieg = G.over && G.over.winner === 'A', abschuesse = {};
    for (const u of G.units) if (u.side === 'D' && (u.status === 'dead' || u.aufgerieben) && u.lastHitBy != null) abschuesse[u.lastHitBy] = (abschuesse[u.lastHitBy] || 0) + 1;
    const lebt = u => u.status !== 'dead' && !u.aufgerieben && u.str > 0;
    const alt = new Map(st.armee.trupps.map(t => [t.id, t])), neuListe = [], verloren = [];
    for (const u of G.units) { if (u.side !== 'A') continue;
      let t = u.kId != null ? alt.get(u.kId) : null;
      if (!t) { if (!lebt(u)) continue; t = { id: st.nextId++, typ: u.type, str: 10, rang: 0, schlachten: 0, abschuesse: 0, neu: true }; }   // im Gefecht ausgehoben
      if (!lebt(u)) { verloren.push(t.typ); continue; }
      t.str = Math.round(u.str * 10) / 10; t.schlachten++; t.abschuesse += abschuesse[u.id] || 0; delete t.neu; neuListe.push(t); }
    st.armee.trupps = neuListe;
    const garn = [];
    if (!sieg) for (const u of G.units) if (u.side === 'D' && lebt(u)) { const t = st.orte[ort].garnison.find(x => x.id === u.kId) || { id: st.nextId++, typ: u.type, rang: 0, schlachten: 0, abschuesse: 0 }; t.str = Math.round(u.str * 10) / 10; garn.push(t); }
    st.orte[ort].garnison = garn;
    if (sieg) { st.orte[ort].besitz = 'A'; st.armee.ort = ort; }
    else st.armee.ort = st.schlacht.von;   // Rückzug zum letzten eigenen Ort
    const ergebnis = { ort, sieg, verloren, uebrig: neuListe.length, rueck: st.schlacht.von };
    st.letzteMeldung = ergebnis; st.phase = 'karte'; st.schlacht = null;
    if (!st.armee.trupps.length) st.ende = 'niederlage';
    else if (!st.weiter && st.orte.aschenhof.besitz === 'A' && st.orte.valmor.besitz === 'A') st.ende = 'sieg';
    return ergebnis;
  }
  const chronikVor = st => (CHRONIK_VOR[st.schlacht.ort] || CHRONIK_STANDARD_VOR).replace('{ort}', ortVon(st.schlacht.ort).name);
  const chronikNach = (st, e) => (e.sieg ? CHRONIK_SIEG : CHRONIK_NIEDERLAGE).replace('{ort}', ortVon(e.ort).name).replace('{rueck}', ortVon(e.rueck).name);
  // Speichern/Laden (localStorage im Browser; in Node übergibt der Test einen eigenen Speicher)
  function speichern(st, ls) { try { (ls || root.localStorage).setItem(SPEICHER, JSON.stringify(st)); return true; } catch (e) { return false; } }
  function laden(ls) { try { const s = JSON.parse((ls || root.localStorage).getItem(SPEICHER) || 'null'); return s && s.version === VERSION ? s : null; } catch (e) { return null; } }
  function loeschen(ls) { try { (ls || root.localStorage).removeItem(SPEICHER); } catch (e) {} }

  const API = { VERSION, SPEICHER, STARTKASSE, SEITEN, PROVINZEN, ORTE, WEGE, ortVon, nachbarn, zahl, neu, gesperrtWarum, ziehen, rundeBeenden, schlachtOpts, zuordnen, nachSchlacht, chronikVor, chronikNach, speichern, laden, loeschen };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.KAMPAGNE = API;
})(typeof window !== 'undefined' ? window : globalThis);
