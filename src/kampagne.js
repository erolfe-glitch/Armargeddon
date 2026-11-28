// Kampagne (K-A, Punkt 156, 2026-11-28): Daten und Regeln der Kampagnenkarte – Provinzen, Orte, Hexfeld mit Gelände, Spielstand, Bewegung, Übergang Schlacht ↔ Karte.
// Alles als Daten (erweiterbar); die Ansicht und der Ablauf im Spiel stehen in ui.js (Abschnitt „Kampagne“). Läuft auch in Node (tools/test_kampagne.mjs).
// Grundlage: entwurf/KAMPAGNE_PLAN.md Abschnitte 2–5, 8, 10, 12–14, 16. K-B1 (Punkt 157): Kronen, Unterhalt, Ausheben, Kaserne, Werkstatt, Auffüllen, Rundenbericht.
// Noch nicht: Lazarett/Befestigung (K-B2), Ränge (K-C), Feldschlachten, Forschung und Gegner-KI (K-D), Renegaten (K-F), Ereignisse (K-G).
(function (root) {
  'use strict';
  const VERSION = 3, SPEICHER = 'arm.kampagne', STARTKASSE = 2000, BP_RUNDE = 10;
  // Besitzer: A = Konkordat (Spieler), D = Aschenwacht, R = Renegaten (in K-A gesperrt). Farben nach STYLE.md / AUFTRAG 156.
  const SEITEN = { A: { name: 'Konkordat', farbe: '#8E2B22', kontur: '#E9D9A8' }, D: { name: 'Aschenwacht', farbe: '#7D8471', kontur: '#1E1B18' }, R: { name: 'Renegaten', farbe: '#2E2A28', kontur: '#9A9089' } };
  // Unsichtbares Hexfeld (Abschnitt 16): 30 × 20 flache Sechsecke, ungerade Spalten halb nach unten versetzt. Ein Zeichen je Feld:
  // . offenes Land 2 · = Straße 1 · w Wald 3 · s Sumpf 4 · f Furt 3 · b Brücke 1 · ~ Fluss, ^ Gebirge, o See gesperrt · O Ort (Straße, 1)
  // Engpässe: Pass bei der Grauwall-Stellung (Spalten 9–10, Zeilen 9–10), Furt bei Furtdorf und Brücke bei Krähenfurt über den Fluss, Waldweg im Süden als Umweg,
  // Hügelkette vor Aschenhof mit Durchgängen im Norden (Zeile 7) und an der Straße (Zeile 14). Erzeugt mit einem Hilfsskript, danach von Hand lesbar gehalten.
  const RASTER = [
    '..............................',
    '....................ss...oo...',
    '...........O......O..ww..oo...',
    '..ww.....==.......=.....O.....',
    '...w...==.........=...........',
    '......=..^^~~f~~~~b~~~~~~~~~~~',
    '.....=O.^^^^.....==...........',
    '...===...^^..s.O=...........ww',
    '..=...==.^^.s==....^...O....w.',
    '..=.....==.==.....^^...=......',
    '..O.......=.O......^^..=......',
    '..=...ww.^^.==.....^^...==....',
    '..=...w..^^...==...^...==.O...',
    '..=......^^.....O=.^.==.......',
    '..==....^^^.......===......ww.',
    '....=O...^^^..ww.ss........www',
    '.........^^...ww.ss..O........',
    '...wwwwwwwwwwwwwwwwwww..oo....',
    '...wwsswwwwwwwwwwwwwww..ooo...',
    '...wwwwwwwwwwwwwwwwwww........',
  ];
  const SPALTEN = 30, ZEILEN = 20;
  const GELAENDE = { '.': { name: 'offenes Land', k: 2 }, '=': { name: 'Straße', k: 1 }, w: { name: 'Wald', k: 3 }, s: { name: 'Sumpf', k: 4 }, f: { name: 'Furt', k: 3 }, b: { name: 'Brücke', k: 1 },
    '~': { name: 'Fluss', k: 99 }, '^': { name: 'Gebirge', k: 99 }, o: { name: 'See', k: 99 }, O: { name: 'Ort', k: 1 } };
  const PROVINZEN = [
    { id: 'valmor', name: 'Valmor', text: 'Brückenkopf des Konkordats an der Küste, Sitz des Feldstabs.', schrift: [3, 1] },
    { id: 'grauwall', name: 'Grauwall', text: 'Das Grabensystem der Pufferzone – umkämpft seit dem Vertrag von Grauwall.', schrift: [14, 18] },
    { id: 'kraehenfurt', name: 'Krähenfurt', text: 'Vereister Nordabschnitt mit dem alten Stahlwerk, in der Hand von Banden.', schrift: [14, 0] },
    { id: 'aschenhof', name: 'Aschenhof', text: 'Industriestadt der Aschenwacht hinter der Front.', schrift: [26, 19] },
  ];
  // Provinz eines Feldes: Valmor westlich des Kamms, Krähenfurt nördlich des Flusses, dazwischen Grauwall, im Osten Aschenhof
  const provVon = (c, r) => c <= 8 ? 'valmor' : r <= 5 ? 'kraehenfurt' : c <= 18 ? 'grauwall' : 'aschenhof';
  // Orte auf Feldern (c, r); karte = Schlachtkarte, seed = Abwandlung (Startwert). Wetter folgt der Karte (Winter nur Winterdorf; andere Karten im Winter brauchen erst Gelände-Teile).
  const ORTE = [
    { id: 'valmor', name: 'Valmor-Stadt', besitz: 'A', art: 'hauptstadt', c: 2, r: 10, karte: 'sanktruss', seed: 101 },
    { id: 'muehlenhof', name: 'Mühlenhof', besitz: 'A', art: 'ort', c: 6, r: 6, karte: 'grauwall', seed: 102 },
    { id: 'sanktruss', name: 'Sankt Ruß', besitz: 'A', art: 'ort', c: 5, r: 15, karte: 'sanktruss', seed: 103 },
    { id: 'grauwall', name: 'Grauwall-Stellung', besitz: 'A', art: 'hauptort', c: 12, r: 10, karte: 'grauwall', seed: 201, text: 'sperrt den Pass' },
    { id: 'kreidegrube', name: 'Kreidegrube', besitz: 'D', art: 'ort', c: 16, r: 13, karte: 'grauwall', seed: 202, garnison: { grenadier: 3, sense: 1, pionierD: 1 } },
    { id: 'drahtfeld', name: 'Drahtfeld', besitz: 'R', art: 'ort', c: 15, r: 7, karte: 'grauwall', seed: 203, garnison: { kohorte: 2, grenadier: 2, sense: 1 } },
    { id: 'kraehenfurt', name: 'Krähenfurt', besitz: 'R', art: 'hauptort', c: 18, r: 2, karte: 'winterdorf', seed: 301, text: 'Stahlwerk', garnison: { kohorte: 2, grenadier: 2, mahlwerk: 1, sense: 1 } },
    { id: 'furtdorf', name: 'Furtdorf', besitz: 'R', art: 'ort', c: 11, r: 2, karte: 'winterdorf', seed: 302, garnison: { kohorte: 2, grenadier: 2 } },
    { id: 'eisweiher', name: 'Eisweiher', besitz: 'R', art: 'ort', c: 24, r: 3, karte: 'winterdorf', seed: 303, garnison: { grenadier: 2, kohorte: 1, sense: 1 } },
    { id: 'aschenhof', name: 'Aschenhof-Stadt', besitz: 'D', art: 'hauptstadt', c: 26, r: 12, karte: 'grauwall', seed: 401, garnison: { grenadier: 3, sense: 1, geschuetz: 1, sturmpz: 1 } },
    { id: 'russhuette', name: 'Rußhütte', besitz: 'D', art: 'ort', c: 23, r: 8, karte: 'sanktruss', seed: 402, garnison: { grenadier: 3, sturm: 1, minenwerfer: 1 } },
    { id: 'grauerhang', name: 'Grauer Hang', besitz: 'D', art: 'ort', c: 21, r: 16, karte: 'grauwall', seed: 403, garnison: { grenadier: 3, sense: 1, minenwerfer: 1, hauptD: 1 } },
  ];
  for (const o of ORTE) o.prov = provVon(o.c, o.r);
  // Geometrie: Mitte eines Feldes als Anteil der Kartenfläche (0–1), damit eine spätere gemalte Landkarte sie übernehmen kann
  const BREITE = (SPALTEN - 1) * 1.5 + 2, HOEHE = (ZEILEN + 0.5) * Math.sqrt(3);
  const mitte = (c, r) => [(c * 1.5 + 1) / BREITE, (r * Math.sqrt(3) + (c % 2 ? Math.sqrt(3) / 2 : 0) + Math.sqrt(3) / 2) / HOEHE];
  const ecken = (c, r) => { const [x, y] = mitte(c, r); return [0, 1, 2, 3, 4, 5].map(i => [x + Math.cos(i * Math.PI / 3) / BREITE, y + Math.sin(i * Math.PI / 3) * 1 / HOEHE]); };
  for (const o of ORTE) [o.x, o.y] = mitte(o.c, o.r);
  const imFeld = (c, r) => c >= 0 && c < SPALTEN && r >= 0 && r < ZEILEN;
  const nachbarn = (c, r) => (c % 2 === 0 ? [[1, -1], [1, 0], [-1, -1], [-1, 0], [0, -1], [0, 1]] : [[1, 0], [1, 1], [-1, 0], [-1, 1], [0, -1], [0, 1]]).map(([a, b]) => [c + a, r + b]).filter(([x, y]) => imFeld(x, y));
  const zeichen = (c, r) => RASTER[r][c];
  const kosten = (c, r) => GELAENDE[zeichen(c, r)].k;
  const key = (c, r) => c + ',' + r;
  const ortVon = id => ORTE.find(o => o.id === id);
  const ortAuf = (c, r) => ORTE.find(o => o.c === c && o.r === r) || null;
  const benachbart = (a, b) => nachbarn(a.c, a.r).some(([c, r]) => c === b.c && r === b.r);
  // K-B1 (Punkt 157, Abschnitt 13): Kronen = Gefechtspreis × 20; Einnahmen je Ort, Unterhalt je Kategorie in Prozent des Kampagnenpreises, Gebäude, Auffüllen
  let ENG = null; const nutze = e => { ENG = e; }, eng = () => ENG || (typeof E !== 'undefined' ? E : null);   // Engine (Preise, Kategorien) – im Browser global, in Node über neu()/nutze()
  const KRONEN = 20, ARMEE_MAX = 20, BEUTE = { aschenhof: 3000 };
  const EINNAHME = o => o.id === 'valmor' ? 1200 : o.art !== 'ort' ? 600 : 300;   // Valmor-Stadt 1.200, Hauptorte (auch Aschenhof-Stadt) 600, kleine Orte 300
  const UNTERHALT = { linie: 0.05, unterst: 0.08, elite: 0.12, geraet: 0.15, selten: 0.10, sehrselten: 0.10 };   // Kommandant, Hauptmann und Held 10 %
  const AUFFUELLEN = { valmor: 4, eigen: 2.5, feind: 1 }, VERWUNDETE = 1.5;   // Stärke-Einheiten (10 = 100)
  const GEBAEUDE = {
    kaserne: { name: 'Kaserne', kosten: [1600, 3200], runden: [1, 2], text: ['Unterstützung ausheben', 'Elite ausheben (nur Valmor-Stadt)'] },
    werkstatt: { name: 'Werkstatt', kosten: [2000, 4000], runden: [1, 2], text: ['Gerät ausheben (Geschütze)', 'Landkoloss und Schreiter ausheben'] },
  };   // Lazarett und Befestigung folgen in K-B2 (Bauplätze dafür bleiben frei)
  const bauplaetze = o => o.id === 'valmor' ? 4 : o.art !== 'ort' ? 2 : 0;
  const zahl = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');   // 2000 → „2.000“
  const truppenAus = (st, liste) => { const t = []; for (const [typ, n] of Object.entries(liste || {})) for (let i = 0; i < n; i++) t.push({ id: st.nextId++, typ, str: 10, rang: 0, schlachten: 0, abschuesse: 0 }); return t; };

  // Neue Kampagne: Startarmee = Gefechtsarmee von Grauwall (Konkordat, mit Feldmarschall), Standort Valmor-Stadt
  function neu(E) {
    nutze(E); const v = ortVon('valmor');
    const st = { version: VERSION, runde: 1, kasse: STARTKASSE, nextId: 1, phase: 'karte', schlacht: null, ende: null, weiter: false, letzteMeldung: null, orte: {},
      armee: { c: v.c, r: v.r, bp: BP_RUNDE, angriff: false, trupps: [] } };
    for (const o of ORTE) st.orte[o.id] = { besitz: o.besitz, garnison: o.besitz === 'A' ? [] : truppenAus(st, o.garnison), seit: 0, bauten: {}, bau: null, ankunft: [] };
    st.moralMalus = false; st.bericht = null; st.beute = {};
    st.armee.trupps = truppenAus(st, E.MAPS.grauwall.army.A);
    return st;
  }
  const armeeOrt = st => { const o = ortAuf(st.armee.c, st.armee.r); return o ? o.id : null; };
  // Sperrbereich (Abschnitt 16): 1 Feld um jeden feindlichen Ort mit Besatzung (und später um jede feindliche Armee). Wer ihn betritt, muss anhalten.
  // Gebirge, Fluss und See gehören nicht dazu (dort kann ohnehin niemand stehen), deshalb reicht er nicht über einen Fluss ohne Brücke.
  function sperrbereich(st) {
    const s = new Map();
    for (const o of ORTE) { const x = st.orte[o.id]; if (x.besitz === 'A' || !x.garnison.length) continue;
      for (const [c, r] of nachbarn(o.c, o.r)) if (kosten(c, r) < 99 && !ortAuf(c, r)) s.set(key(c, r), o.id); }
    return s;
  }
  const betretbar = (st, c, r) => { if (kosten(c, r) >= 99) return false; const o = ortAuf(c, r); return !o || st.orte[o.id].besitz === 'A'; };   // feindliche Orte nur durch Angriff
  // Reichweite: kürzester Weg nach Kosten (Dijkstra) mit den Bewegungspunkten der Armee; im Sperrbereich endet der Zug (wer dort steht, darf ihn verlassen)
  function reichweite(st, bp) {
    const A = st.armee, sp = sperrbereich(st), start = key(A.c, A.r), max = bp == null ? A.bp : bp;
    const m = new Map([[start, { c: A.c, r: A.r, k: 0, vor: null, halt: false }]]), q = [[0, A.c, A.r]];
    while (q.length) { q.sort((a, b) => a[0] - b[0]); const [k0, c0, r0] = q.shift(), n0 = m.get(key(c0, r0)); if (n0.k < k0) continue;
      if (n0.halt && key(c0, r0) !== start) continue;
      for (const [c, r] of nachbarn(c0, r0)) { if (!betretbar(st, c, r)) continue; const k = k0 + kosten(c, r); if (k > max) continue;
        const kk = key(c, r), alt = m.get(kk); if (alt && alt.k <= k) continue;
        m.set(kk, { c, r, k, vor: key(c0, r0), halt: sp.has(kk) }); q.push([k, c, r]); } }
    m.delete(start); return m;
  }
  function pfad(m, ziel) { const p = []; let k = ziel; while (k && m.get(k)) { p.unshift(m.get(k)); k = m.get(k).vor; } return p; }
  // Ziehen auf ein Feld in Reichweite; im Sperrbereich verfallen die restlichen Punkte
  function ziehenNach(st, c, r) {
    if (st.phase !== 'karte') return { ok: false, warum: 'Erst die Schlacht schlagen.' };
    if (st.ende && !st.weiter) return { ok: false, warum: 'Die Kampagne ist zu Ende.' };
    const m = reichweite(st), n = m.get(key(c, r)); if (!n) return { ok: false, warum: st.armee.bp <= 0 ? 'Keine Bewegungspunkte mehr in dieser Runde.' : 'Zu weit oder nicht erreichbar.' };
    st.armee.c = c; st.armee.r = r; st.armee.bp = n.halt ? 0 : st.armee.bp - n.k; st.letzteMeldung = null;
    return { ok: true, weg: pfad(m, key(c, r)), halt: n.halt ? sperrbereich(st).get(key(c, r)) : null };
  }
  // Angriff auf einen Ort: nur vom Nachbarfeld aus, einmal je Runde (auch nach dem Halt im Sperrbereich)
  function angriffWarum(st, id) {
    const o = ortVon(id), x = st.orte[id];
    if (st.ende && !st.weiter) return 'Die Kampagne ist zu Ende.';
    if (st.phase !== 'karte') return 'Erst die Schlacht schlagen.';
    if (x.besitz === 'A') return 'Eigener Ort.';
    if (x.besitz === 'R') return 'Renegaten – kommt später.';
    if (!benachbart(st.armee, o)) return 'Erst auf ein Nachbarfeld ziehen.';
    if (st.armee.angriff) return 'In dieser Runde wurde schon angegriffen.';
    return '';
  }
  function angreifen(st, id) {
    const w = angriffWarum(st, id); if (w) return { ok: false, warum: w };
    st.armee.angriff = true; st.armee.bp = 0; st.phase = 'schlacht'; st.schlacht = { ort: id, von: { c: st.armee.c, r: st.armee.r } }; st.letzteMeldung = null;
    return { ok: true, schlacht: true };
  }
  // Rundenende (K-B1): Bauten schreiten fort, Ausgehobene kommen an; neue Runde: Einnahmen, Unterhalt, Auffüllen → Rundenbericht
  function rundeBeenden(st) {
    if (st.phase !== 'karte') return false;
    const b = { runde: st.runde + 1, fertig: [], ankunft: [], einnahmen: [], unterhalt: { armee: 0, besatzung: 0 }, auffuellen: { armee: 0, besatzung: 0 }, knapp: false };
    for (const o of ORTE) { const x = st.orte[o.id];
      if (x.bau && x.besitz === 'A' && --x.bau.rest <= 0) { x.bauten[x.bau.art] = x.bau.stufe; b.fertig.push({ ort: o.id, art: x.bau.art, stufe: x.bau.stufe }); x.bau = null; }
      for (const t of x.ankunft || []) { x.garnison.push({ id: st.nextId++, typ: t, str: 10, rang: 0, schlachten: 0, abschuesse: 0 }); b.ankunft.push({ ort: o.id, typ: t }); } x.ankunft = []; }
    st.runde++; st.armee.bp = BP_RUNDE; st.armee.angriff = false;
    b.einnahmen = einnahmen(st); const ein = b.einnahmen.reduce((n, e) => n + e.betrag, 0), u = unterhalt(st); b.unterhalt = u;
    st.kasse += ein; const kosten = u.armee + u.besatzung;
    if (st.kasse >= kosten) { st.kasse -= kosten; b.auffuellen = auffuellen(st); }
    else { st.kasse = 0; st.moralMalus = true; b.knapp = true; }   // Kasse reicht nicht: kein Auffüllen, nächste Schlacht −1 Moral
    b.saldo = ein - kosten; b.kasse = st.kasse; st.bericht = b; return b;
  }
  // Einnahmen je eigenem Ort (erst nach einer ganzen Runde Besitz), Provinz-Bonus +50 % wenn alle drei Orte der Provinz gehalten
  function einnahmen(st) {
    const r = [];
    for (const o of ORTE) { const x = st.orte[o.id]; if (x.besitz !== 'A' || st.runde < (x.seit || 0) + 2) continue;
      const voll = ORTE.filter(q => q.prov === o.prov).every(q => st.orte[q.id].besitz === 'A');
      r.push({ ort: o.id, betrag: Math.round(EINNAHME(o) * (voll ? 1.5 : 1)), bonus: voll }); }
    return r;
  }
  const preis = (st, t) => { const e = eng(); let p = e.COST[t] * KRONEN; if (st.orte.kraehenfurt.besitz === 'A' && e.katOf(t) === 'geraet') p *= 0.8; return Math.round(p / 10) * 10; };   // Stahlwerk Krähenfurt: Gerät −20 %
  const unterhaltVon = t => { const e = eng(); return Math.round(e.COST[t] * KRONEN * (UNTERHALT[e.katOf(t)] || 0.08)); };
  function unterhalt(st) {
    const armee = st.armee.trupps.reduce((n, t) => n + unterhaltVon(t.typ), 0);
    let besatzung = 0; for (const o of ORTE) if (st.orte[o.id].besitz === 'A') besatzung += st.orte[o.id].garnison.reduce((n, t) => n + unterhaltVon(t.typ), 0);
    return { armee, besatzung };
  }
  const saldoVorschau = st => { const ein = einnahmen(Object.assign({}, st, { runde: st.runde + 1 })).reduce((n, e) => n + e.betrag, 0), u = unterhalt(st); return ein - u.armee - u.besatzung; };
  // Land unter der Armee: Valmor-Stadt, eigenes Land (der nächste Ort ist eigen) oder Feindland
  const hexDist = (a, b) => { const k = p => { const x = p.c, z = p.r - (p.c - (p.c & 1)) / 2; return [x, z, -x - z]; }, [x1, z1, y1] = k(a), [x2, z2, y2] = k(b); return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2), Math.abs(z1 - z2)); };
  function landArt(st, c, r) { const o = ortAuf(c, r); if (o && o.id === 'valmor' && st.orte.valmor.besitz === 'A') return 'valmor';
    const n = ORTE.slice().sort((a, b) => hexDist({ c, r }, a) - hexDist({ c, r }, b))[0]; return st.orte[n.id].besitz === 'A' ? 'eigen' : 'feind'; }
  function auffuellen(st) {
    const plus = AUFFUELLEN[landArt(st, st.armee.c, st.armee.r)], a = { armee: 0, besatzung: 0 };
    for (const t of st.armee.trupps) { const v = Math.min(10, t.str + plus) - t.str; if (v > 0) { t.str = Math.round((t.str + v) * 10) / 10; a.armee += v; } }
    for (const o of ORTE) { const x = st.orte[o.id]; if (x.besitz !== 'A') continue; const p2 = o.id === 'valmor' ? AUFFUELLEN.valmor : AUFFUELLEN.eigen;
      for (const t of x.garnison) { const v = Math.min(10, t.str + p2) - t.str; if (v > 0) { t.str = Math.round((t.str + v) * 10) / 10; a.besatzung += v; } } }
    a.armee = Math.round(a.armee * 10); a.besatzung = Math.round(a.besatzung * 10); return a;   // Anzeige ×10
  }
  // Ausheben (nur in eigenen Orten mit Bauplatz): Linie überall, Unterstützung mit Kaserne, Elite in Valmor-Stadt mit Kaserne 2, Gerät mit Werkstatt (Landkoloss und Schreiter mit Werkstatt 2)
  function aushebbar(st, id) {
    const e = eng(), o = ortVon(id), x = st.orte[id], B = x.bauten || {}, r = [];
    if (x.besitz !== 'A' || !bauplaetze(o)) return r;
    const imSpiel = t => st.armee.trupps.concat(...ORTE.map(q => st.orte[q.id].besitz === 'A' ? st.orte[q.id].garnison : [])).some(u => u.typ === t) || ORTE.some(q => (st.orte[q.id].ankunft || []).includes(t));
    for (const t of e.SHOP.A) { const T = e.TYPES[t]; if (T.cmd === 2 || T.held || (T.mech && !T.stufe3)) continue;   // Kommandant, Helden (HE-A/B), Kampfmaschinen (Schalter) nicht
      const k = e.katOf(t), pr = preis(st, t); let w = '';
      if (k === 'unterst' || k === 'selten') { if (!(B.kaserne >= 1)) w = 'Braucht eine Kaserne.'; }
      else if (k === 'elite') { if (id !== 'valmor') w = 'Elite nur in Valmor-Stadt.'; else if (!(B.kaserne >= 2)) w = 'Braucht Kaserne Stufe 2.'; }
      else if (k === 'geraet' || T.stufe3) { if (T.cls === 'walker' || T.stufe3) { if (!(B.werkstatt >= 2)) w = 'Braucht Werkstatt Stufe 2.'; } else if (!(B.werkstatt >= 1)) w = 'Braucht eine Werkstatt.'; }
      if (!w && T.stufe3 && imSpiel(t)) w = 'Nur einer je Kampagne.';
      if (!w && st.kasse < pr) w = 'Nicht genug Kronen.';
      r.push({ t, preis: pr, warum: w, unterhalt: unterhaltVon(t) }); }
    return r;
  }
  function ausheben(st, id, t) {
    if (st.phase !== 'karte') return { ok: false, warum: 'Erst die Schlacht schlagen.' };
    const a = aushebbar(st, id).find(x => x.t === t); if (!a) return { ok: false, warum: 'Hier nicht auszuheben.' }; if (a.warum) return { ok: false, warum: a.warum };
    st.kasse -= a.preis; st.orte[id].ankunft = st.orte[id].ankunft || []; st.orte[id].ankunft.push(t); return { ok: true, preis: a.preis };
  }
  // Gebäude: je Ort ein Bau gleichzeitig; Stufe 1 dauert 1 Runde, Stufe 2 noch einmal 2 Runden
  function bauWarum(st, id, art) {
    const o = ortVon(id), x = st.orte[id], G0 = GEBAEUDE[art], st0 = (x.bauten || {})[art] || 0;
    if (x.besitz !== 'A') return 'Nur in eigenen Orten.';
    if (!bauplaetze(o)) return 'Kein Bauplatz.';
    if (st0 >= 2) return 'Schon voll ausgebaut.';
    if (x.bau) return `Hier wird schon gebaut (${GEBAEUDE[x.bau.art].name}).`;
    if (!st0 && Object.keys(x.bauten || {}).length >= bauplaetze(o)) return 'Alle Bauplätze belegt.';
    if (st.kasse < G0.kosten[st0]) return 'Nicht genug Kronen.';
    return '';
  }
  function bauen(st, id, art) {
    if (st.phase !== 'karte') return { ok: false, warum: 'Erst die Schlacht schlagen.' };
    const w = bauWarum(st, id, art); if (w) return { ok: false, warum: w };
    const x = st.orte[id], stufe = ((x.bauten || {})[art] || 0) + 1; x.bauten = x.bauten || {};
    if (stufe === 1) x.bauten[art] = 0;   // Bauplatz ist ab Baubeginn belegt
    st.kasse -= GEBAEUDE[art].kosten[stufe - 1]; x.bau = { art, stufe, rest: GEBAEUDE[art].runden[stufe - 1] }; return { ok: true };
  }
  // Tauschen zwischen Armee und Besatzung, wenn die Armee im Ort steht (Armee höchstens 20 Trupps, Kategorien-Grenzen wie im Gefecht, der Kommandant bleibt bei der Armee)
  function tauschWarum(st, id, truppId, zurArmee) {
    const o = ortVon(id), x = st.orte[id], e = eng();
    if (st.phase !== 'karte') return 'Erst die Schlacht schlagen.';
    if (x.besitz !== 'A' || st.armee.c !== o.c || st.armee.r !== o.r) return 'Die Armee muss im Ort stehen.';
    if (zurArmee) { const t = x.garnison.find(q => q.id === truppId); if (!t) return 'Trupp nicht gefunden.';
      if (st.armee.trupps.length >= ARMEE_MAX) return `Die Armee hat schon ${ARMEE_MAX} Trupps.`;
      const z = zaehle(st.armee.trupps.concat([t])); const f = e.katFehler ? e.katFehler(z) : ''; if (f) return f; return ''; }
    const t = st.armee.trupps.find(q => q.id === truppId); if (!t) return 'Trupp nicht gefunden.';
    if (e.TYPES[t.typ].cmd === 2) return 'Der Kommandant bleibt bei der Armee.';
    if (st.armee.trupps.length <= 1) return 'Die Armee braucht mindestens einen Trupp.';
    return '';
  }
  function tauschen(st, id, truppId, zurArmee) {
    const w = tauschWarum(st, id, truppId, zurArmee); if (w) return { ok: false, warum: w };
    const x = st.orte[id], von = zurArmee ? x.garnison : st.armee.trupps, nach = zurArmee ? st.armee.trupps : x.garnison, i = von.findIndex(q => q.id === truppId);
    nach.push(von.splice(i, 1)[0]); return { ok: true };
  }
  // Armeen für newGame: Anzahl je Typ (E.newGame mit free: true, die Stärke setzt zuordnen danach)
  const zaehle = trupps => trupps.reduce((m, t) => (m[t.typ] = (m[t.typ] || 0) + 1, m), {});
  function schlachtOpts(st) {
    const o = ortVon(st.schlacht.ort);
    return { map: o.karte, seed: o.seed * 1000 + st.runde, free: true, kampagne: true, army: { A: zaehle(st.armee.trupps), D: zaehle(st.orte[o.id].garnison) } };
  }
  // Nach newGame (und nach „Automatisch aufstellen“): jede Einheit bekommt ihren Trupp (kId) und dessen Reststärke; je Typ in der Reihenfolge der Liste
  function zuordnen(st, G) {
    const liste = { A: st.armee.trupps, D: st.orte[st.schlacht.ort].garnison };
    for (const sd of ['A', 'D']) { const frei = liste[sd].slice();
      for (const u of G.units) { if (u.side !== sd) continue; const i = frei.findIndex(t => t.typ === u.type); if (i < 0) continue; const t = frei.splice(i, 1)[0]; u.kId = t.id; u.str = Math.max(0.5, Math.min(10, t.str)); if (sd === 'A' && st.moralMalus && !u.kMalus) { u.mor = Math.max(1, u.mor - 1); u.kMalus = true; } } }   // K-B1: Kasse war leer → −1 Moral (einmal je Einheit)
  }
  // Rückzug: nächster eigener Ort (Weglänge über betretbare Felder, ohne Bewegungsgrenze)
  function naechsterEigenerOrt(st, von) {
    const s = key(von.c, von.r), d = new Map([[s, 0]]), q = [[0, von.c, von.r]];
    while (q.length) { q.sort((a, b) => a[0] - b[0]); const [k0, c0, r0] = q.shift(); const o = ortAuf(c0, r0); if (o && st.orte[o.id].besitz === 'A') return o;
      for (const [c, r] of nachbarn(c0, r0)) { if (!betretbar(st, c, r)) continue; const k = k0 + kosten(c, r); if (k < (d.get(key(c, r)) ?? 1e9)) { d.set(key(c, r), k); q.push([k, c, r]); } } }
    return ortVon('valmor');
  }
  // Nach der Schlacht: Stärken übernehmen, Gefallene und Zerschlagene streichen, Entkommene bleiben, im Gefecht ausgehobene Trupps kommen dazu; Besitz und Rückzug
  function nachSchlacht(st, G) {
    const ort = st.schlacht.ort, sieg = G.over && G.over.winner === 'A', abschuesse = {};
    for (const u of G.units) if (u.side === 'D' && (u.status === 'dead' || u.aufgerieben) && u.lastHitBy != null) abschuesse[u.lastHitBy] = (abschuesse[u.lastHitBy] || 0) + 1;
    const lebt = u => u.status !== 'dead' && !u.aufgerieben && u.str > 0;
    const alt = new Map(st.armee.trupps.map(t => [t.id, t])), neuListe = [], verloren = [];
    for (const u of G.units) { if (u.side !== 'A') continue;
      let t = u.kId != null ? alt.get(u.kId) : null;
      if (!t) { if (!lebt(u)) continue; t = { id: st.nextId++, typ: u.type, str: 10, rang: 0, schlachten: 0, abschuesse: 0 }; }   // im Gefecht ausgehoben
      if (!lebt(u)) { verloren.push(t.typ); continue; }
      t.str = Math.round(u.str * 10) / 10; t.schlachten++; t.abschuesse += abschuesse[u.id] || 0; neuListe.push(t); }
    st.armee.trupps = neuListe;
    const garn = [];
    if (!sieg) for (const u of G.units) if (u.side === 'D' && lebt(u)) { const t = st.orte[ort].garnison.find(x => x.id === u.kId) || { id: st.nextId++, typ: u.type, rang: 0, schlachten: 0, abschuesse: 0 }; t.str = Math.round(u.str * 10) / 10; garn.push(t); }
    st.orte[ort].garnison = garn;
    let rueck = null;
    if (sieg) { st.orte[ort].besitz = 'A'; st.orte[ort].seit = st.runde; const o = ortVon(ort); st.armee.c = o.c; st.armee.r = o.r;
      for (const t of neuListe) t.str = Math.min(10, Math.round((t.str + VERWUNDETE) * 10) / 10);   // Verwundete kehren zurück (+15 je überlebendem Trupp)
      if (BEUTE[ort] && !(st.beute || {})[ort]) { st.beute = st.beute || {}; st.beute[ort] = true; st.kasse += BEUTE[ort]; } }
    else { const o = naechsterEigenerOrt(st, st.schlacht.von); st.armee.c = o.c; st.armee.r = o.r; rueck = o.id; }   // Rückzug zum nächsten eigenen Ort
    st.armee.bp = 0; st.moralMalus = false;
    const ergebnis = { ort, sieg, verloren, uebrig: neuListe.length, rueck, beute: sieg && BEUTE[ort] && st.beute[ort] ? BEUTE[ort] : 0 };
    st.letzteMeldung = ergebnis; st.phase = 'karte'; st.schlacht = null;
    if (!st.armee.trupps.length) st.ende = 'niederlage';
    else if (!st.weiter && st.orte.aschenhof.besitz === 'A' && st.orte.valmor.besitz === 'A') st.ende = 'sieg';
    return ergebnis;
  }
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
  const chronikVor = st => (CHRONIK_VOR[st.schlacht.ort] || CHRONIK_STANDARD_VOR).replace('{ort}', ortVon(st.schlacht.ort).name);
  const chronikNach = (st, e) => (e.sieg ? CHRONIK_SIEG : CHRONIK_NIEDERLAGE).replace('{ort}', ortVon(e.ort).name).replace('{rueck}', e.rueck ? ortVon(e.rueck).name : 'Valmor');
  // Speichern/Laden (localStorage im Browser; in Node übergibt der Test einen eigenen Speicher); alte Spielstände (Version 1, feste Wege) gelten nicht mehr
  function speichern(st, ls) { try { (ls || root.localStorage).setItem(SPEICHER, JSON.stringify(st)); return true; } catch (e) { return false; } }
  function laden(ls) { try { const s = JSON.parse((ls || root.localStorage).getItem(SPEICHER) || 'null'); return s && s.version === 2 ? umwandeln(s) : s && s.version === VERSION ? s : null; } catch (e) { return null; } }
  function umwandeln(s) {   // Version 2 (K-A) → 3 (K-B1): Gebäude, Ankunft, Besitz-seit, Kassen-Felder ergänzen
    for (const o of ORTE) { const x = s.orte[o.id]; if (!x) continue; x.seit = x.seit || 0; x.bauten = x.bauten || {}; x.bau = x.bau || null; x.ankunft = x.ankunft || []; }
    s.moralMalus = false; s.bericht = null; s.beute = s.beute || {}; s.version = VERSION; s.umgewandelt = true; return s;
  }
  function loeschen(ls) { try { (ls || root.localStorage).removeItem(SPEICHER); } catch (e) {} }

  const API = { VERSION, SPEICHER, STARTKASSE, BP_RUNDE, SEITEN, PROVINZEN, ORTE, RASTER, SPALTEN, ZEILEN, GELAENDE, provVon, mitte, ecken, nachbarn, zeichen, kosten, key, ortVon, ortAuf, zahl,
    neu, nutze, armeeOrt, KRONEN, ARMEE_MAX, GEBAEUDE, UNTERHALT, AUFFUELLEN, bauplaetze, einnahmen, unterhalt, unterhaltVon, saldoVorschau, preis, landArt, aushebbar, ausheben, bauWarum, bauen, tauschWarum, tauschen, umwandeln, sperrbereich, betretbar, reichweite, pfad, ziehenNach, angriffWarum, angreifen, rundeBeenden, schlachtOpts, zuordnen, naechsterEigenerOrt, nachSchlacht, chronikVor, chronikNach, speichern, laden, loeschen };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.KAMPAGNE = API;
})(typeof window !== 'undefined' ? window : globalThis);
