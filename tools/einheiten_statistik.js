// Einheiten-Statistik (Paket H Schritt 11 / F103, 2026-11-22): KI gegen KI, je Einheitentyp gezählt.
// Aufruf: node tools/einheiten_statistik.js [Schlachten je Karte=200] > entwurf/postfach/einheiten_statistik.csv   (MECHS=1: mit Kampfmaschinen)
// Spalten: schluessel, name, seite, karte, preis, start_je_schlacht, nachschub_je_schlacht, gekauft_je_schlacht (Start + Nachschub), aktionen_je_schlacht,
// schaden_gemacht_je_schlacht (Stärke ×10 wie in der Anzeige), schaden_je_100_punkte, ueberlebt_bis_ende_prozent, einsatz_ki, rolle, stark_gegen, schwach_gegen, kontert_man_mit.
// Schaden wird dem zugeordnet, der gerade schießt oder schlägt (auch Gegenschlag, Sperrfeuer, Feuerbereitschaft); eigener Beschuss zählt nicht.
const E = require('../src/engine.js'), AI = require('../src/ai.js'), rollen = require('./einheiten_rollen.js');
const N = +(process.argv[2] || 200);
const ART = { fire: 'Schießen', melee: 'Nahkampf', move: 'Ziehen', shell: 'Artillerie', abil: 'Fähigkeit', order: 'Befehl', big: 'großer Befehl', heal: 'Heilen', dig: 'Eingraben', setup: 'MG aufbauen', sperr: 'Sperrfeuer', ow: 'Feuerbereitschaft', cut: 'Draht schneiden', lay: 'Draht legen', zweit: 'Zweitwaffe', recover: 'Bergen', send: 'Meldegänger', plant: 'Banner', limber: 'Aufprotzen', unlimber: 'Abprotzen', shields: 'Schilde', roar: 'Gebrüll' };
const zeilen = [];
for (const karte of ['grauwall', 'sanktruss']) {
  const S = {};   // typ → Zähler
  const z = t => S[t] = S[t] || { start: 0, kauf: 0, akt: 0, schaden: 0, ende: 0, lebend: 0, einsatz: {} };
  for (let g = 0; g < N; g++) {
    const G = E.newGame({ seed: 1 + g * 7919, map: karte, mechs: !!process.env.MECHS }); E.startTurn(G);
    for (const u of G.units) z(u.type).start++;
    let guard = 0, bk = '';
    const verbuche = (ev, akteur) => {   // Schaden dem gerade Handelnden zuordnen
      let wer = akteur;
      for (const e of ev) {
        if (['fire', 'melee', 'counter', 'shell', 'freeblow'].includes(e.t) && e.a != null) wer = G.units.find(x => x.id === e.a) || wer;
        else if (['rollen', 'durchbruch', 'hinrichtung', 'pzgranate', 'faust', 'zweit'].includes(e.t) && e.u != null) wer = G.units.find(x => x.id === e.u) || wer;
        if (e.t === 'spawn') { const nu = G.units.find(x => x.id === e.u); if (nu) z(nu.type).kauf++; }
        if (e.t === 'hit' && e.dmg > 0 && wer) { const ziel = G.units.find(x => x.id === e.u); if (ziel && ziel.side !== wer.side) z(wer.type).schaden += e.dmg * 10; }
      }
    };
    try {
      while (!G.over && guard++ < 8000) {
        if (bk !== G.turn + G.side) { bk = G.turn + G.side; verbuche(AI.buy(G) || [], null); }
        const act = AI.next(G); if (!act) { E.endTurn(G); continue; }
        for (const s of act.steps) { const u = G.units.find(x => x.id === act.u); const ev = AI.exec(G, act.u, s) || [];
          if (u && ev.length) { z(u.type).akt++; const a = ART[s.k] || s.k; z(u.type).einsatz[a] = (z(u.type).einsatz[a] || 0) + 1; }
          verbuche(ev, u); if (G.over) break; }
      }
    } catch (err) { continue; }
    for (const u of G.units) { z(u.type).ende++; if (E.alive(u) && u.status === 'ok') z(u.type).lebend++; }
  }
  for (const [t, s] of Object.entries(S)) {
    const T = E.TYPES[t], gekauft = (s.start + s.kauf) / N, r = rollen(t), preis = E.COST[t] || 0;
    const top = Object.entries(s.einsatz).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k, v]) => `${k} ${Math.round(100 * v / Math.max(1, s.akt))} %`).join(' / ');
    zeilen.push([t, T.name, T.side === 'A' ? 'Konkordat' : 'Aschenwacht', karte, preis, (s.start / N).toFixed(2), (s.kauf / N).toFixed(2), gekauft.toFixed(2), (s.akt / N).toFixed(1),
      (s.schaden / N).toFixed(0), gekauft > 0 && preis ? (s.schaden / N / (gekauft * preis) * 100).toFixed(0) : '', s.ende ? Math.round(100 * s.lebend / s.ende) : '', top, r.rolle, r.stark.join(', '), r.schwach.join(', '), r.konter.join(', ')]);
  }
}
const q = v => { const x = String(v); return /[;"\n]/.test(x) ? '"' + x.replace(/"/g, '""') + '"' : x; };
console.log(['schluessel', 'name', 'seite', 'karte', 'preis', 'start_je_schlacht', 'nachschub_je_schlacht', 'gekauft_je_schlacht', 'aktionen_je_schlacht', 'schaden_gemacht_je_schlacht', 'schaden_je_100_punkte', 'ueberlebt_bis_ende_prozent', 'einsatz_ki', 'rolle', 'stark_gegen', 'schwach_gegen', 'kontert_man_mit'].join(';'));
for (const z of zeilen.sort((a, b) => a[2].localeCompare(b[2]) || a[0].localeCompare(b[0]) || a[3].localeCompare(b[3]))) console.log(z.map(q).join(';'));
