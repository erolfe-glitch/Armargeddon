// Ton-Spur, Seitenteil (wird von tools/ton_spur.mjs in die laufende Spielseite eingespielt). Baut eine leere Probefläche, stellt je Szene
// frische Einheiten auf, ruft die echten Regeln (E.…) auf und spielt deren Ereignisse durch die UI. Der Spion window.__tonSpur sammelt die Plätze.
// Szenennamen: „art:gegner“ – nach dem Doppelpunkt steht der Typ der Gegenseite (für den Vergleich: deren Pult-Zeilen erklären deren Töne).
window.TS = (() => {
  'use strict';
  const D = window.__dbg, E = D.E, TY = E.TYPES, P = E.P, W = ms => new Promise(r => setTimeout(r, ms));
  let G = null, szene = '', rolle = 'a', XS = new Set(), xSide = null, roh = [], nicht = [], fest = {}, erwartePick = false, inStimme = false, rnd = null;
  const R0 = Math.random; Math.random = () => (rnd != null ? rnd : R0());
  const PN = performance.now.bind(performance); let versatz = 0; performance.now = () => PN() + versatz;   // je Szene springt die Uhr 12 s vor: Abklingzeiten der Rufe und „letzter Schuss“ gelten nicht über Szenen hinweg
  const WINTER_SZ = /^(anwaehlen|ziehen_|rueckzug|moral|granate_eis|granate:(kohorte|grenadier)|sperrfeuer|schuss:(kohorte|grenadier)|nahkampf:(kohorte|grenadier)|vernichtet|ankunft|panne|faehigkeit_(sprung|rollen|durchbruch|sturmlauf))/;
  const POOLS = () => window.SOUND_POOLS || {};
  const keysVon = p => { const out = new Set([p]); for (const n of (D.SND_VAR && D.SND_VAR[p]) || [p]) { out.add(n); for (const v of ['', '_gm', '_gs', '_bf', '_mr']) for (const e of POOLS()[n + v] || []) out.add(e[0]); } return out; };   // Sammelnamen (SND_VAR) mit auflösen
  const STIMM_PICK = /^(ruf_|panik_|sterben_|sst_|hst_|stimmen_paket)/;
  window.__tonSpur = r => { let m = null;
    if (r.ps != null) { erwartePick = true; Promise.resolve().then(() => { erwartePick = false; }); m = { p: r.ps, u: r.u, k: r.k, z: r.z, von: r.von != null ? r.von : null, an: r.an != null ? r.an : null, fest: fest[r.ps] || null }; }
    else if (r.waffe != null) { for (const k of keysVon(r.waffe)) fest[k] = r.waffe; m = { p: r.waffe, festPick: 1 }; }
    else if (r.pick != null) { if (erwartePick) { erwartePick = false; return; } if ((inStimme && r.pick !== 'motor_auswahl') || STIMM_PICK.test(r.pick)) return; for (const k of keysVon(r.pick)) fest[k] = r.pick; m = { p: r.pick, festPick: 1 }; }
    else if (r.ruf != null || 'sel' in r) { inStimme = true; Promise.resolve().then(() => { inStimme = false; }); m = { ruf: r.ruf || null, p: r.ruf ? r.p : r.sel, u: r.u != null ? r.u : null, sel: 'sel' in r }; }
    if (!m) return; m.s = szene; m.ro = rolle;
    if (m.von != null) m.xsV = XS.has(m.von); if (m.an != null) m.xsA = XS.has(m.an); if (m.u != null) m.xsU = XS.has(m.u); if (m.k) { m.xsK = m.k.some(id => XS.has(id)); m.nurX = m.k.length > 0 && m.k.every(id => XS.has(id)); m.leer = !m.k.length; } if (m.z != null) m.xsZ = XS.has(m.z);
    if (m.ruf && m.u == null && m.ruf !== 'stimmen_' + xSide) return;   // Truppenruf der anderen Seite
    roh.push(m); };
  const andere = sd => (sd === 'A' ? 'D' : 'A');
  const ART = { fuss: T => T.cls === 'inf' && !T.suit && !T.cmd && !T.held, anzug: T => !!T.suit && T.cls !== 'walker' && !T.held, panzer: T => T.cls === 'walker' && !T.mech, schreiter: T => T.cls === 'walker' && !!T.mech,
    reiter: T => T.cls === 'cav', art: T => T.cls === 'art' && !T.mobile && !T.direkt, mg: T => !!T.mg };
  const refTyp = (sd, art) => (art === 'fuss' ? (sd === 'A' ? 'kohorte' : 'grenadier') : E.ROSTER[sd].find(t => ART[art](TY[t])) || null);
  function mk(type, c, r, o) {
    const T = TY[type], u = { id: G.nextId++, type, side: T.side, c, r, officer: T.cmd ? (T.cmd === 2 ? 'General' : 'Hauptmann') : null, ap: P.AP, bp: 0, bpUsed: 0, str: 10, mor: T.mor, face: T.side === 'A' ? 0 : 3, status: 'ok',
      moved: false, attacked: false, sperr: 0, supp: 0, fireDmg: 0, turnOnly: false, run: 0, broken: 0, gassed: false, seenWalker: false, limbered: false, gas: T.gas || 0, mines: T.mines || 0, startC: c, startR: r };
    if (T.mg) u.setup = true; if (T.counterStrike) u.cready = true; Object.assign(u, o || {}); u.bp = E.bpMax(u); G.units.push(u); return u;
  }
  let parkIds = new Set();
  function leeren() { G.units = G.units.filter(u => parkIds.has(u.id)); for (const k of ['clouds', 'smoke', 'lit', 'tunnels', 'mines', 'marks', 'fires']) G[k].length = 0; G.over = null; G.bigUsed = null; XS = new Set(); fest = {}; rnd = null; }
  const neu = () => D.neuDU();
  const spiel = async evs => { if (!evs || !evs.length) throw new Error('Regel lieferte kein Ereignis'); await D.spiel(evs); return evs; };
  async function sz(name, ro, fn, nachMs) {
    if (E.MAP.winter && !WINTER_SZ.test(name)) return;
    leeren(); gelaende(); versatz += 12000; szene = name; rolle = ro;
    try { await D.play([{ t: 'tonspur_leer' }]); await fn(); } catch (e) { nicht.push({ szene: szene, grund: String(e && e.message || e).slice(0, 160) }); }
    rnd = null; await W(nachMs || 90); szene = ''; }
  // Probefläche: alles offen, Bahnen je Gelände in den ungeraden Reihen (Spalte 7 und 8)
  const BAHN = { offen: 1, schlamm: 3, totholz: 5, draht: 7, barrikade: 9, eis: 11 }, GEL = { schlamm: 'mud', totholz: 'forest', draht: 'wire', barrikade: 'barrikade', eis: 'eis' };
  const grund = (c, r) => { if (c === 7 || c === 8) for (const [n, br] of Object.entries(BAHN)) if (br === r && GEL[n] && (n !== 'eis' || E.MAP.winter)) return GEL[n]; return 'open'; };
  function gelaende() { for (let c = 0; c < E.COLS; c++) for (let r = 0; r < E.ROWS; r++) { const h = G.map[c][r], w = grund(c, r); if (h.t !== w) h.t = w; } }   // vor jeder Szene: niedergewalzter Draht, Trichter, zerstörte Barrikaden zurück auf den Grundzustand
  function flaeche() {
    for (let c = 0; c < E.COLS; c++) for (let r = 0; r < E.ROWS; r++) { const h = G.map[c][r]; for (const k of Object.keys(h)) delete h[k]; h.t = grund(c, r); h.ridge = false; h.obj = null; }
    G.bauten = []; for (const k of Object.keys(G.ctrl)) G.ctrl[k] = null;
    const gA = G.units.find(u => u.type === 'generalA'), gD = G.units.find(u => u.type === 'generalD'); gA.c = 0; gA.r = E.ROWS - 1; gD.c = E.COLS - 1; gD.r = E.ROWS - 1; parkIds = new Set([gA.id, gD.id]);
    for (const k of Object.keys(D.TONWAHL)) delete D.TONWAHL[k];   // Grundzustand: ohne Pult-Wahl
    leeren(); neu(); try { D.renderTerrain(); } catch (e) {}
  }
  async function start(t) { G = D.G; D.tonSpurTempo(t); flaeche(); await W(1200); roh = []; return true; }

  async function typ(t) {
    const T = TY[t], sd = T.side, es = andere(sd), dir = sd === 'A' ? 1 : -1, cX = sd === 'A' ? 6 : 9, R = BAHN.offen;
    G = D.G; roh = []; nicht = []; xSide = sd;
    const X = (c, r, o) => { const x = mk(t, c == null ? cX : c, r == null ? R : r, o); XS.add(x.id); G.side = sd; return x; };
    const Z = (art, c, r, o) => { const zt = refTyp(es, art); if (!zt) throw new Error('kein Gegner der Art ' + art); return mk(zt, c, r == null ? R : r, o); };
    const F = (art, c, r, o) => { const ft = refTyp(sd, art); if (!ft) throw new Error('kein eigener Typ der Art ' + art); return mk(ft, c, r == null ? R : r, o); };
    const zn = art => refTyp(es, art) || art;
    const fRicht = [0, 1, 2, 3, 4, 5].find(f => E.step(cX, R, f)[0] - cX === dir), linie = n => { let p = [cX, R]; for (let i = 0; i < n; i++) p = E.step(p[0], p[1], fRicht); return p; };   // gerade Linie über Feldkanten (Sturmrollen, Durchbruch)
    const mobil = x => { if (T.mg) x.setup = false; if (T.limber) x.limbered = true; if (T.fessel) x.eingeholt = true; x.bp = E.bpMax(x); };
    const treffer = async (v, liste, strs) => { for (const st of strs || [6]) for (const dmg of liste) for (const q of [0.01, 0.99]) { rnd = q; await D.play([{ t: 'hit', u: v.id, dmg, str: st, morv: v.mor }]); } rnd = null; };
    const ZIELE = ['fuss', 'anzug', 'panzer', 'schreiter', 'reiter'];

    // ---- Anwählen ----
    await sz('anwaehlen', 'a', async () => { const x = X(); neu(); for (let i = 0; i < 4; i++) { D.tonSpurStimme(x.id); await W(50); } }, 150);
    // ---- Ziehen ----
    for (const [n, r] of Object.entries(BAHN)) { if (r >= E.ROWS || (n === 'eis' && !E.MAP.winter)) continue;
      for (const q of n === 'offen' ? [0.01, 0.99] : [0.5]) await sz('ziehen_' + n, 'a', async () => { const x = X(cX, r); mobil(x); neu(); rnd = q;
        let evs = n === 'offen' ? E.moveUnit(G, x, cX + 2 * dir, r) : []; if (!evs.length) evs = E.moveUnit(G, x, cX + dir, r);
        if (!evs.length) throw new Error('Feld nicht betretbar (Regel)'); await D.spiel(evs); }); }
    await sz('ziehen_marsch', 'a', async () => { const x = X(); mobil(x); neu(); const n = [...E.reachable(G, x, { march: true }).values()].filter(k => k.march && k.r === R).sort((a, b) => b.cost - a.cost)[0];
      if (!n) throw new Error('kein Marschfeld (Regel)'); await spiel(E.moveUnit(G, x, n.c, n.r)); });
    await sz('ziehen_feindmaschine', 'a', async () => { const x = X(); mobil(x); Z('panzer', cX + 5 * dir); neu(); await spiel(E.moveUnit(G, x, cX + dir, R)); x.bp = E.bpMax(x); x.moved = false; await spiel(E.moveUnit(G, x, cX, R)); });
    await sz('rueckzug', 'a', async () => { const x = X(); neu(); await D.play([{ t: 'fallback', u: x.id, path: [[cX, R], [cX - dir, R]] }]); x.c = cX - dir; await D.play([{ t: 'retreatmove', u: x.id }]); });
    // ---- Schuss ----
    const schussweite = (x, v) => { for (let d = 1; d <= 4; d++) { v.c = cX + d * dir; if (E.canFire(G, x, v)) return true; } return false; };
    if (T.rng && T.cls !== 'art') for (const za of ZIELE) {
      await sz('schuss:' + zn(za), 'a', async () => { const x = X(), v = Z(za, cX + 2 * dir), hx = G.map[cX][R]; let turm = false;
        if (!schussweite(x, v)) { hx.t = 'turm'; turm = true; if (!schussweite(x, v)) { hx.t = 'open'; throw new Error('darf nicht schießen (Regel: canFire, auch nicht aus dem Kirchturm)'); } szene = 'schuss_nur_aus_turm:' + zn(za); }
        try { neu(); const evs = await spiel(E.fire(G, x, v)); if (E.alive(v)) await treffer(v, [0.1, 0.5, 1.6]);
          if (T.dauerfeuer && E.alive(v)) { if (E.canFire(G, x, v)) await spiel(E.fire(G, x, v)); else nicht.push({ szene: 'dauerfeuer', grund: 'zweite Salve nicht erlaubt' }); }
          if (za === 'fuss') { const f = evs.find(e => e.t === 'fire'); if (f && E.alive(v)) await D.spiel([{ ...f, reaction: true }]); } } finally { if (turm) hx.t = 'open'; } }); }
    if (T.broadside) await sz('breitseite:' + zn('fuss'), 'a', async () => { const x = X(), v = Z('fuss', cX + 2 * dir), v2 = Z('fuss', cX + dir, R + 1); neu(); await spiel(E.fire(G, x, v)); if (!E.canFire(G, x, v2)) throw new Error('zweiter Schuss nicht erlaubt'); await spiel(E.fire(G, x, v2)); });
    if (T.zweit) for (const za of ['fuss', 'anzug']) await sz('zweitwaffe:' + zn(za), 'a', async () => { const x = X(), v = Z(za, cX + dir); let ok = false; for (let d = 1; d <= 3 && !ok; d++) { v.c = cX + d * dir; ok = E.canZweit(G, x, v); }
      if (!ok) throw new Error('Zweitwaffe darf nicht (Regel)'); neu(); await spiel(E.zweitFire(G, x, v)); if (E.alive(v)) await treffer(v, [0.1, 0.5, 1.6]); });
    if (T.faust) await sz('faustsalve:' + zn('fuss'), 'a', async () => { const x = X(), v = Z('fuss', cX + 2 * dir), v2 = Z('panzer', cX + 2 * dir, R + 1); neu(); await spiel(E.faust(G, x, v, v2)); });
    if (T.cls === 'art') { const feld = (x, mode) => { for (let d = 2; d <= T.rng; d++) if (E.canShell(G, x, cX + d * dir, R, mode)) return [cX + d * dir, R]; return null; };
      for (const za of ['fuss', 'panzer', 'anzug']) await sz('granate:' + zn(za), 'a', async () => { const x = X(), v = Z(za, cX + 3 * dir); const h = feld(x, 'he'); if (!h) throw new Error('darf nicht feuern (Regel: canShell)'); v.c = h[0]; neu();
        await spiel(E.shell(G, x, h[0], h[1], 'he')); if (E.alive(v)) await treffer(v, [0.1, 0.5, 1.6]); }, 250);
      await sz('sperrfeuer:' + zn('fuss'), 'a', async () => { const x = X(); F('fuss', cX + 2 * dir, R + 1); const h = feld(x, 'barrage'); if (!h) throw new Error('Sperrfeuer nicht erlaubt (Regel)'); Z('fuss', h[0]); neu(); await spiel(E.shell(G, x, h[0], h[1], 'barrage')); }, 400);
      if (T.gas) await sz('gasgranate:' + zn('fuss'), 'a', async () => { const x = X(); F('fuss', cX + 2 * dir, R + 1); const h = feld(x, 'gas'); if (!h) throw new Error('Gas nicht erlaubt (Regel)'); Z('fuss', h[0]); neu(); await spiel(E.shell(G, x, h[0], h[1], 'gas')); }, 250);
      await sz('granate_wasser', 'a', async () => { const x = X(); const h = feld(x, 'he'); if (!h) throw new Error('darf nicht feuern (Regel)'); const hx = G.map[h[0]][h[1]]; hx.t = 'sumpf'; neu(); try { await spiel(E.shell(G, x, h[0], h[1], 'he')); } finally { hx.t = 'open'; } }, 250);
      if (E.MAP.winter) await sz('granate_eis:' + zn('fuss'), 'a', async () => { const x = X(sd === 'A' ? 5 : 10, BAHN.eis), c = sd === 'A' ? 8 : 7; F('fuss', sd === 'A' ? 6 : 9, BAHN.eis - 1); if (!E.canShell(G, x, c, BAHN.eis, 'he')) throw new Error('darf nicht feuern (Regel)'); Z('fuss', c, BAHN.eis); neu(); try { await spiel(E.shell(G, x, c, BAHN.eis, 'he')); } finally { G.map[c][BAHN.eis].t = 'eis'; } }, 500); }
    // ---- Nahkampf ----
    for (const za of ZIELE) for (const q of [0.01, 0.99]) await sz('nahkampf:' + zn(za), 'a', async () => { const x = X(), v = Z(za, cX + dir); neu(); if (!E.canMelee(G, x, v)) throw new Error('darf nicht in den Nahkampf (Regel)'); rnd = q; await spiel(E.melee(G, x, v)); });
    for (const za of ['fuss', 'anzug', 'schreiter']) for (const q of [0.01, 0.99]) await sz('gegenschlag:' + zn(za), 'z', async () => { const x = X(), v = Z(za, cX + dir); G.side = es; neu(); if (!E.canMelee(G, v, x)) throw new Error('Gegner darf nicht angreifen (Regel)'); rnd = q; await spiel(E.melee(G, v, x)); });
    if (T.held) await sz('gegner_vernichtet:' + zn('fuss'), 'a', async () => { const x = X(), v = Z('fuss', cX + dir, R, { str: 0.2 }); neu(); if (!E.canMelee(G, x, v)) throw new Error('darf nicht in den Nahkampf (Regel)'); await spiel(E.melee(G, x, v)); }, 300);
    // ---- Getroffen ----
    const beschuss = async (x, aa) => { const a = Z(aa, cX + 2 * dir); G.side = es; let ok = false; for (let d = 2; d <= 4 && !ok; d++) { a.c = cX + d * dir; ok = E.canFire(G, a, x); } neu();
      if (!ok) throw new Error('Gegner darf nicht schießen (Regel, z. B. Waffe prallt ab)'); await spiel(E.fire(G, a, x));
      if (E.alive(x)) await treffer(x, [0.25, 0.45, 1.2, 2.6], [8, 3]); };
    for (const aa of ['fuss', 'mg', 'panzer', 'schreiter']) await sz('getroffen:' + zn(aa), 'z', async () => beschuss(X(), aa));
    if (T.limber) await sz('getroffen_aufgeprotzt:' + zn('fuss'), 'z', async () => beschuss(X(cX, R, { limbered: true }), 'fuss'));
    await sz('getroffen:' + zn('art'), 'z', async () => { const x = X(), a = Z('art', cX + 4 * dir); G.side = es; let ok = false; for (let d = 3; d <= 8 && !ok; d++) { a.c = cX + d * dir; if (a.c < 1 || a.c > E.COLS - 2) break; ok = E.canShell(G, a, x.c, x.r, 'he'); } neu();
      if (!ok) throw new Error('Gegner-Geschütz darf nicht feuern (Regel)'); await spiel(E.shell(G, a, x.c, x.r, 'he')); if (E.alive(x)) await treffer(x, [0.25, 0.45, 1.2, 2.6], [8, 3]); }, 250);
    await sz('im_gas', 'z', async () => { const x = X(); if (E.gasSafe(G, x)) throw new Error('gegen Gas immun (Regel)'); neu(); for (const q of [0.01, 0.99]) { rnd = q; await D.play([{ t: 'gas', u: x.id, str: 8, morv: x.mor, poison: 2 }, { t: 'gas', u: x.id, str: 7, morv: x.mor, poison: 1, late: true }]); } });
    await sz('moral', 'z', async () => { const x = X(); neu(); await D.play([{ t: 'supp', u: x.id }, { t: 'hit', u: x.id, dmg: 0, panic: true, str: x.str, morv: x.mor }, { t: 'fear', u: x.id, morv: x.mor }, { t: 'steadfast', u: x.id }]);
      await D.play([{ t: 'rout', u: x.id }]); await D.play([{ t: 'rout', u: x.id }]); await D.play([{ t: 'flee', u: x.id, path: [[cX, R], [cX - dir, R]] }]); x.c = cX - dir; }, 200);
    await sz('feuer', 'z', async () => { const x = X(); neu(); await D.play([{ t: 'burn', u: x.id, c: x.c, r: x.r }, { t: 'hit', u: x.id, dmg: 0.8, str: 8, morv: x.mor, burn: true }]); });
    await sz('freischlag:' + zn('fuss'), 'z', async () => { const x = X(), v = Z('fuss', cX + dir); neu(); await D.play([{ t: 'freeblow', a: v.id, u: x.id, dmg: 1 }, { t: 'hit', u: x.id, dmg: 1, str: 7, morv: x.mor, freeblow: true }]); });
    for (let i = 0; i < 3; i++) await sz('vernichtet', 'z', async () => { const x = X(cX, R, { str: 0.2 }); G.side = es; let evs = [], wer = null;
      for (const aa of ['fuss', 'panzer', 'schreiter']) { const a = Z(aa, cX + 2 * dir, R + (aa === 'fuss' ? 0 : aa === 'panzer' ? 1 : -1)); for (let d = 2; d <= 3 && !evs.length; d++) { a.c = cX + d * dir; if (E.canFire(G, a, x)) { neu(); evs = E.fire(G, a, x); wer = a.type; } } if (evs.length) break; }
      if (!evs.length) { const a = Z('fuss', cX + dir, R + 1); neu(); if (E.canMelee(G, a, x)) { evs = E.melee(G, a, x); wer = a.type; } }   // z. B. versteckte Einheiten: nur im Nahkampf zu fassen
      if (!evs.some(e => e.t === 'destroyed')) throw new Error('keine Vernichtung erreicht'); szene = 'vernichtet:' + wer; await D.spiel(evs); }, 350);
    if (T.cls === 'walker' || T.stecken) await sz('panne', 'z', async () => { const x = X(cX, BAHN.schlamm); x.c = cX + dir; neu(); await D.play([{ t: 'stuck', u: x.id }]); if (T.cls === 'walker') await D.play([{ t: 'breakdown', u: x.id }, { t: 'unstuck', u: x.id }, { t: 'repaired', u: x.id }]); });
    // ---- Handgriffe ----
    const hg = async (name, vor, fn) => sz(name, 'a', async () => { const x = X(); if (vor) vor(x); neu(); await spiel(fn(x)); });
    if (T.mg) { await hg('mg_abbauen', null, x => E.teardownMG(G, x)); await hg('mg_aufbauen', x => { x.setup = false; }, x => E.setupMG(G, x)); await hg('mg_sperrfeuer', null, x => E.sperr(G, x)); }
    if (T.limber) { await hg('aufprotzen', null, x => E.limber(G, x)); await hg('abprotzen', x => { x.limbered = true; x.bp = E.bpMax(x); }, x => E.limber(G, x)); }
    if (T.fessel) { await hg('ballon_einholen', null, x => E.einholen(G, x)); await hg('ballon_aufsteigen', x => { x.eingeholt = true; x.bp = E.bpMax(x); }, x => E.aufsteigen(G, x)); }
    if (T.dig) { await hg('eingraben', null, x => E.dig(G, x)); await hg('ausgraben', x => { x.dug = true; }, x => E.undig(G, x)); }
    if (T.shieldWall) await sz('schilde', 'a', async () => { const x = X(); F('fuss', cX, R + 1); neu(); await spiel(E.shieldsUp(G, x)); });
    if (T.rng >= 2 && T.cls !== 'art' && T.cls !== 'walker' && !T.mg) await sz('feuerbereit', 'a', async () => { const x = X(); neu(); if (!E.canOverwatch(G, x)) throw new Error('nicht erlaubt (Regel)'); await spiel(E.overwatch(G, x)); });
    if (T.cmd) { for (const k of E.orderKinds({ side: sd })) await sz('befehl_' + k, 'a', async () => { const x = X(); F('fuss', cX, R + 1, { mor: 3 }); neu(); if (!E.canOrderKind(G, x, k)) throw new Error('Befehl nicht erlaubt (Regel)'); await spiel(E.order(G, x, k)); });
      if (T.cmd === 2) await sz('grosser_befehl', 'a', async () => { const x = X(); F('fuss', cX, R + 1); neu(); if (!E.canBig(G, x)) throw new Error('nicht erlaubt (Regel)'); await spiel(E.bigOrder(G, x)); }, 300); }
    if (T.banner) { await hg('banner_aufpflanzen', null, x => E.plantBanner(G, x)); await hg('banner_aufnehmen', x => { x.planted = true; }, x => E.plantBanner(G, x)); }
    if (T.cutter) await sz('draht_schneiden', 'a', async () => { const x = X(cX, BAHN.draht); neu(); const h = E.cutTargets(G, x)[0]; if (!h) throw new Error('kein Draht zum Schneiden (Regel)'); const hx = G.map[h[0]][h[1]]; try { await spiel(E.cutWire(G, x, h[0], h[1])); } finally { hx.t = 'wire'; } }, 500);
    if (T.wirelayer) await sz('draht_ziehen', 'a', async () => { const x = X(); neu(); if (!E.canLay(G, x)) throw new Error('nicht erlaubt (Regel)'); const h = E.layTarget(G, x), hx = G.map[h[0]][h[1]]; try { await spiel(E.layWire(G, x)); } finally { hx.t = 'open'; } }, 500);
    if (T.cls === 'medic' && !T.repair) await sz('versorgen', 'a', async () => { const x = X(), f = F('fuss', cX, R + 1, { str: 5, poison: 2 }); neu(); if (!E.canHeal(G, x, f)) throw new Error('nicht erlaubt (Regel)'); await spiel(E.heal(G, x, f)); });
    if (T.repair) await sz('reparieren', 'a', async () => { const x = X(), f = F('panzer', cX, R + 1, { str: 5 }); neu(); if (!E.canHeal(G, x, f)) throw new Error('nicht erlaubt (Regel)'); await spiel(E.heal(G, x, f)); });
    if (T.recover) await sz('bergen', 'a', async () => { const x = X(), f = F('panzer', cX, R + 1, { broken: 3 }); neu(); if (!E.canRecover(G, x, f)) throw new Error('nicht erlaubt (Regel)'); await spiel(E.recover(G, x, f)); });
    if (T.courier) await sz('befehl_ueberbringen', 'a', async () => { const x = X(), f = F('fuss', cX, R + 1, { ap: 0 }); neu(); if (!E.canSend(G, x, f)) throw new Error('nicht erlaubt (Regel)'); await spiel(E.sendOrder(G, x, f)); });
    if (T.roar) await sz('loewengebruell:' + zn('fuss'), 'a', async () => { const x = X(); Z('fuss', cX + 2 * dir); neu(); if (!E.canRoar(G, x)) throw new Error('nicht erlaubt (Regel)'); await spiel(E.roar(G, x)); }, 300);
    if (T.cls === 'walker') for (const hp of [9, 0.5]) await sz(hp > 1 ? 'gebaeude_rammen' : 'gebaeude_rammen_einsturz', 'a', async () => { const x = X(cX, R), hx = G.map[cX + dir][R]; hx.t = 'haus'; hx.bau = 0; G.bauten.length = 0; G.bauten.push({ art: 'haus', felder: [[cX + dir, R]], hp, max: 9, kaputt: false });
      try { neu(); const zs = E.rammZiele(G, x); if (!zs.length) throw new Error('kein Gebäude zum Rammen (Regel)'); await spiel(E.rammen(G, x, zs[0][0], zs[0][1])); await W(hp > 1 ? 0 : 1800); } finally { hx.t = 'open'; delete hx.bau; G.bauten.length = 0; } }, 500);
    if (T.counterStrike) await sz('gegenstoss:' + zn('fuss'), 'a', async () => { const x = X(), v = Z('fuss', cX + 2 * dir); neu(); nicht.push({ szene: szene, grund: 'Ereignis nachgestellt (die Regel löst nur an Zielfeldern aus)' }); await D.play([{ t: 'counterstrike', u: x.id, d: v.id }]); });
    await sz('ankunft', 'a', async () => { const x = X(cX - 2 * dir, R); neu(); await D.play([{ t: 'spawn', u: x.id }]); });
    // ---- Fähigkeit (T.abil): Umfeld mit Gegnern, Draht, eigenen Einheiten; je Zielart einmal ----
    if (T.abil) { const A = T.abil, umfeld = [], nah = ['charge', 'hinrichtung'].includes(A);
      if (['charge', 'sprung', 'rollen', 'durchbruch', 'hinrichtung', 'pzgranate'].includes(A)) { for (const za of A === 'pzgranate' ? ['panzer', 'schreiter'] : ['fuss', 'anzug', 'reiter', 'mg']) umfeld.push({ n: A + ':' + zn(za), bau: () => { const x = X(), p = linie(nah ? 1 : 2), v = Z(za, p[0], p[1], A === 'hinrichtung' ? { str: 2 } : null); return [x, [v.c, v.r]]; } });
        if (A === 'charge') umfeld.push({ n: A + '_draht', bau: () => { const x = X(cX, BAHN.draht); return [x, [cX + dir, BAHN.draht], G.map[cX + dir][BAHN.draht], 'wire']; } }); }
      else if (A === 'rush') umfeld.push({ n: 'sturmlauf', bau: () => { const x = X(); Z('fuss', cX + 5 * dir); return [x, null]; } });
      else if (A === 'ammo') umfeld.push({ n: 'munition', bau: () => { const x = X(), f = F('mg', cX, R + 1, { attacked: true }); return [x, [f.c, f.r]]; } });
      else if (A === 'clear') umfeld.push({ n: 'entgiften', bau: () => { const x = X(); G.clouds.push({ c: cX, r: R, ttl: P.GAS_TTL }); return [x, null]; } });
      else if (A === 'tunnel') umfeld.push({ n: 'stollen', bau: () => { const x = X(), p = linie(2), hx = G.map[p[0]][p[1]]; hx.t = 'trench'; return [x, p, hx, 'open']; } });
      else umfeld.push({ n: A + ':' + zn('fuss'), bau: () => { const x = X(); const v = Z('fuss', cX + 3 * dir); return [x, [v.c, v.r]]; } });
      for (const U of umfeld) await sz('faehigkeit_' + U.n, 'a', async () => { const [x, ziel, hx, zurueck] = U.bau(); neu(); try { const ts = E.abilTargets(G, x); if (!ts.length) throw new Error('kein Ziel für die Fähigkeit (Regel)');
        const h = (ziel && ts.find(q => q[0] === ziel[0] && q[1] === ziel[1])) || ts[Math.floor(ts.length / 2)]; if (ziel && (h[0] !== ziel[0] || h[1] !== ziel[1]) && !['mine', 'smoke', 'mark', 'strike', 'light'].includes(A)) throw new Error('dieses Ziel ist für die Fähigkeit nicht erlaubt (Regel)');
        await spiel(E.useAbil(G, x, h[0], h[1]));
        if (A === 'tunnel') { const tu = G.tunnels[0]; if (tu) await D.play([{ t: 'tunnelBlow', c: tu.c, r: tu.r }, { t: 'terrain', c: tu.c, r: tu.r, what: 'Stollen gesprengt' }]); } } finally { if (hx) hx.t = zurueck === 'wire' ? 'wire' : 'open'; } }, 450); }
    leeren(); neu();

    // ---- Auswertung: Rohmeldungen → a / z / stimmen / wahl ----
    const erg = { a: {}, z: {}, stimmen: {}, wahl: {}, nicht_ausgeloest: nicht }, allgemein = {};
    const dazu = (o, k, s) => { const l = o[k] = o[k] || []; if (!l.includes(s) && l.length < 40) l.push(s); };
    const merk = (p, mode, eimer, s) => { dazu(erg[eimer], p, s); dazu(erg.wahl[p] = erg.wahl[p] || {}, mode + ':' + eimer, s); };
    for (const m of roh) { if (m.p == null) continue;
      if (!m.s) { dazu(allgemein, m.p, '(außerhalb einer Szene)'); continue; }
      if (m.ruf) { if (m.u == null || m.xsU) dazu(erg.stimmen, m.ruf + '|' + m.p, m.s); continue; }
      if (m.sel) { merk(m.p, 'a1', 'a', m.s); continue; }   // Spruch beim Anklicken: Pult-Wahl der Einheit greift (seit 2026-11-23)
      if (m.von != null || m.an != null) { if (m.xsV) merk(m.p, 'a1', 'a', m.s); else if (m.xsA) merk(m.p, 'z1', 'z', m.s); continue; }   // Ton gehört ausdrücklich einer Einheit (playSound-Option von / an): bei einer anderen Einheit ist es deren Ton
      if (m.festPick) { merk(m.p, 'fest', m.ro, m.s); continue; }
      if (m.fest) { merk(m.fest, 'fest', m.ro, m.s); continue; }
      if (m.u != null && !m.xsU) continue;   // spricht eine andere Einheit: deren Ton
      const mode = m.xsU ? 'sp' : m.xsK ? (m.xsZ ? 'z' : 'a') + (m.nurX ? '1' : '') : m.leer ? 'ok0' : 'ok', eimer = m.xsU || m.xsK ? (m.xsZ ? 'z' : 'a') : m.ro;
      merk(m.p, mode, eimer, m.s); }
    return { erg, allgemein };
  }
  return { start, typ, get roh() { return roh; }, refTyp };
})(); true
