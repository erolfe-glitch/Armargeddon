// Gelände aus Bausteinen für die neue Ansicht. Regeln: STYLE.md „Gelände-Bausteine“.
// Genutzt vom Spiel (ui.js, neue Ansicht, zuerst nur Grauwall) und von den Testseiten entwurf/probe/gelaende.html und karte.html.
// Bilder: im Spiel aus window.GELAENDE (src/gelaende.js, erzeugt mit tools/gelaende_cut.py --einbetten), auf den Testseiten gelaende/g_*.webp.
//
// GBau.bilder(quelle)       lädt alle Bausteine → Promise<IM>; quelle(name) liefert die Bildadresse
// GBau.aufbauen(cfg, IM)    baut das flache Weltbild (Boden, flache Details, Grabensohle, Schatten) und die Liste der aufrechten Teile:
//   cols, rows              Kartengröße in Feldern
//   terr(c, r)              Geländeart je Feld (Namen wie TERRAIN in engine.js: open, mud, crater, trench, wire, village, forest, wald,
//                           bunker, barrikade, sumpf, canal, bridge; dazu 'rubble' = Trümmerfeld, 'grass' = Gras, 'sperre' = Panzersperren)
//   flags(c, r)             { road, river } (optional)
//   trench                  Grabenzüge als Listen von Feldkoordinaten [c, r] (optional; sonst aus den trench-Feldern zusammengesetzt)
//   zickzack, grabenSeite(c, r) → 'A'|'D'   Gräben im Zickzack, Brustwehr zur Feindseite
//   R, rand {mx, top, mb}   Feldradius im Weltbild und Ränder um die Karte (Spiel: R = L.s, mx 0, top L.top)
//   raster (Standard an), seed, edgeCrowns, edgeCrownsX
//   bauten                  große Gebäude über mehrere Felder (Sankt Ruß, 2026-11-19): [{ art: 'kirche', felder: [[c, r], …], turm: [c, r], kaputt }]
//                           Wandstücke je Feld (Außenkanten: hinten hoch, vorn niedrig), innen keine Wände, nur Bänke/Altar/Säulen;
//                           Turm als hoher Aufsteller (durchsichtig, wenn er Einheiten verdeckt); kaputt = eingestürzt (Mauerreste, Turmstumpf, Glocke)
//   flags(c, r).deko        Schmuck je Feld: 'platz' (Kopfstein), 'brunnen' (Platz mit Brunnen), 'wegkreuz', 'karren', 'figur' (Friedhof);
//                           Feldarten 'friedhof', 'garten' (niedrige Bruchsteinmauern)
// → { ground, pieces, platz(c, r), setView({ g, proj, F, U, units }), hexC, R, SH, WW, WH, TR }
//   pieces: [{ y, f }] nach Tiefe sortiert; f() zeichnet mit den zuletzt per setView gesetzten Werten (proj(x, y) → [sx, sy, Tiefe], F = Brennweite).
//   platz(c, r): wie Trupps im Feld stehen (Graben: Weltpunkte auf der Grabenlinie + Absenkung; Ruine: Tiefe gestaucht) oder null.
// GBau.bauen(cfg)           Testseiten: alles laden, aufbauen, eigene Kamera, Trupps, auf cfg.canvas zeichnen.
(function () {
'use strict';
const load = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; });
const SQ3 = Math.sqrt(3);
const LISTE = {
  tex: [...['schlamm', 'gras', 'waldboden', 'truemmer', 'sumpf', 'wasser', 'kopfstein'].map(n => 'boden_' + n), 'boden_schnee', 'boden_acker_schnee', 'strasse_matsch', 'boden_eis', ...[1, 2, 3, 4].map(k => 'boden_schnee_rein_' + k)],
  flach: [...[1, 2, 3, 4, 5, 6, 7, 8].map(k => 'flach_details_' + k), 'trichter_gross_1', 'furt_schnee', 'krater_schnee_1', 'krater_schnee_2', 'brand_schnee', 'ufer_flach_1', 'ufer_flach_2', 'ufer_flach_3'],
  wand: ['graben_sohle', 'graben_kante_vorn', 'graben_kante_hinten', 'ruine_hinten', 'ruine_vorn', 'barrikade', 'wald_unterholz',
    'kirche_hinten', 'kirche_vorn', 'mauer_niedrig', 'zaun', 'zaun_schnee', 'ufer_schnee', 'unterholz_schnee'],   // Sankt Ruß (2026-11-19): Kirchenmauer hoch/niedrig, Bruchsteinmauer (Friedhof, Gärten)
  stand: [...[1, 2, 3, 4].map(k => 'ruine_ecken_' + k), 'bunker_1', 'bunker_2',
    ...['wald_staemme', 'wald_staemme_b'].flatMap(b => [1, 2, 3, 4].map(k => `${b}_${k}`)),
    ...['stuempfe', 'stuempfe_b', 'stuempfe_c'].flatMap(b => [1, 2, 3, 4].map(k => `${b}_${k}`)),
    ...['truemmer', 'truemmer_b', 'truemmer_c', 'truemmer_d'].flatMap(b => [1, 2, 3, 4].map(k => `${b}_${k}`)),
    ...[1, 2, 3, 4].map(k => 'panzersperren_' + k), 'panzersperren_b_4', ...[1, 2, 3, 4].map(k => 'draht_stuecke_' + k), ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map(k => 'festung_' + k),
    'kirchturm_1', 'kirchturm_2', ...['kirche_innen', 'friedhof', 'dorf_aufsteller'].flatMap(b => [1, 2, 3, 4].map(k => `${b}_${k}`)),
    // Krähenfurt (2026-11-22, Flux): Winter-Bausteine, nur mit cfg.winter benutzt
    ...[1, 2, 3, 4].map(k => 'haus_heil_' + k), 'kapelle', 'kapelle_ruine', 'haus_ruine_schnee_1', 'haus_ruine_schnee_2', ...[1, 2, 3, 4].map(k => 'tanne_schnee_' + k),
    'baum_tot_schnee_1', 'baum_tot_schnee_2', 'bruecke_stein_hinten', 'bruecke_stein_vorn', 'brunnen_schnee', 'holzstapel_1', 'holzstapel_2', 'karren_schnee', 'schilf'],   // Draht nur noch aus ganzen Stücken (2026-11-16)   // panzersperren_b_1–3 sind gleich wie panzersperren_1–3
};
const NAMEN = [...LISTE.tex, ...LISTE.flach, ...LISTE.wand, ...LISTE.stand];

async function bilder(quelle) {
  const IM = {};
  await Promise.all(NAMEN.map(async n => IM[n] = await load(quelle(n))));
  return IM;
}

// Figur im Graben: der untere Teil (cut = Anteil der Bildhöhe, etwa bis zur Hüfte) fehlt, darüber ein weicher Übergang in die dunkle Grabensohle.
// Zwischengespeichert je Bild; gezeichnet wird das Ergebnis mit seiner Unterkante auf dem Grabenboden.
const EINSINK = 0.3, SUNK = new Map();   // 30 % der Bildhöhe weg: bis etwa Oberschenkel/Hüfte, Gürtel und Taschen bleiben sichtbar
function eingesunken(im, cut = EINSINK) {
  const key = im; if (SUNK.has(key)) return SUNK.get(key);
  const W = im.naturalWidth || im.width, H = im.naturalHeight || im.height, h = Math.round(H * (1 - cut));
  const c = document.createElement('canvas'); c.width = W; c.height = h; const x = c.getContext('2d');
  x.drawImage(im, 0, 0, W, h, 0, 0, W, h);
  x.globalCompositeOperation = 'source-atop';   // nur auf der Figur: unten abdunkeln (Erde, Schatten im Graben)
  const gd = x.createLinearGradient(0, h * 0.62, 0, h); gd.addColorStop(0, 'rgba(26,19,13,0)'); gd.addColorStop(1, 'rgba(26,19,13,0.92)'); x.fillStyle = gd; x.fillRect(0, 0, W, h);
  x.globalCompositeOperation = 'destination-out';   // und die letzten Pixel weich ausblenden
  const ga = x.createLinearGradient(0, h * 0.9, 0, h); ga.addColorStop(0, 'rgba(0,0,0,0)'); ga.addColorStop(1, 'rgba(0,0,0,1)'); x.fillStyle = ga; x.fillRect(0, 0, W, h);
  const r = { cv: c, frac: 1 - cut }; SUNK.set(key, r); return r;
}

// Bildwirkung (ui.js, 2026-11-19): aufrechte Teile mit demselben Filter wie der Boden (einmal je Filter vorberechnet)
// Winter (Enrico 18:35): weiße Schneekante oben auf aufrechten Teilen (Grabenränder, Sandsäcke, Draht) – im Code, kein neuer Bogen.
// Je Spalte die obersten Pixel unter einer freien Stelle aufhellen (Dicke leicht schwankend), einmal je Bild gerechnet.
const SCHNEE = new Map();
function schneeKante(im, anteil, minPx = 2) {
  if (!im) return im; const key = im; if (SCHNEE.has(key)) return SCHNEE.get(key);
  const W = im.naturalWidth || im.width, H = im.naturalHeight || im.height, c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d'); x.drawImage(im, 0, 0); const id = x.getImageData(0, 0, W, H), d = id.data, k0 = Math.max(minPx, H * anteil);
  for (let px = 0; px < W; px++) { const k = k0 * (0.7 + 0.3 * Math.sin(px * 0.11) * Math.sin(px * 0.037 + 1)); let tief = 0;
    for (let py = 0; py < H; py++) { const i = (py * W + px) * 4; if (d[i + 3] < 90) { tief = 0; continue; }
      if (tief < k) { const f = 0.88 * Math.pow(1 - tief / k, 0.6); d[i] += (226 - d[i]) * f; d[i + 1] += (231 - d[i + 1]) * f; d[i + 2] += (238 - d[i + 2]) * f; } tief++; } }
  x.putImageData(id, 0, 0); SCHNEE.set(key, c); return c;
}
const TEILF = new Map();
function teileGefiltert(IM, flt) {
  if (!flt) return IM;
  if (!TEILF.has(flt)) TEILF.set(flt, new Map());
  const C = TEILF.get(flt), out = { ...IM };
  for (const n of [...LISTE.wand, ...LISTE.stand]) {
    const im = IM[n]; if (!im || n === 'graben_sohle') continue;   // Sohle liegt flach im Weltbild und wird dort mit dem Boden gefiltert
    if (!C.has(im)) { const c = document.createElement('canvas'); c.width = im.naturalWidth || im.width; c.height = im.naturalHeight || im.height;
      const x = c.getContext('2d'); x.filter = flt; x.drawImage(im, 0, 0); C.set(im, c); }
    out[n] = C.get(im);
  }
  return out;
}
function aufbauen(cfg, IM) {
  IM = teileGefiltert(IM, cfg.teilFilter);
  // Winterkarten (Krähenfurt, 2026-11-22): Schneeboden statt Schlamm/Gras/Waldboden, Eis statt Wasser, verschneite Zäune, Unterholz, Brunnen und Karren;
  // Häuser, Kapelle, Tannen, Steinbrücke, Ufer und Acker eigene Zweige (winterFeld). Fehlt der Schneeboden, bleibt alles wie bisher.
  const WI = !!cfg.winter && !!IM.boden_schnee;
  if (WI) { const ali = { boden_schlamm: IM.boden_schnee_rein_1 ? 'boden_schnee_rein_1' : 'boden_schnee', boden_wasser: 'boden_eis', wald_unterholz: 'unterholz_schnee', zaun: 'zaun_schnee', dorf_aufsteller_1: 'brunnen_schnee', dorf_aufsteller_3: 'karren_schnee' };
    IM = { ...IM }; for (const k in ali) if (IM[ali[k]]) IM[k] = IM[ali[k]];
    if (cfg.schneeKante !== false) { for (const [n, a, mp] of [['graben_kante_vorn', 0.14], ['graben_kante_hinten', 0.12], ['barrikade', 0.1], ['bunker_1', 0.05], ['bunker_2', 0.05], ...[1, 2, 3, 4].map(k => ['draht_stuecke_' + k, 0.012, 2]), ...[1, 2, 3, 4].map(k => ['panzersperren_' + k, 0.05])]) if (IM[n]) IM[n] = schneeKante(IM[n], a, mp); } }
  const KIPP = cfg.kipp ?? 1;   // schräge Wandstücke kippen (Stärke, 0 = aus)
  const AO = cfg.ao || 0;   // Kantenverdeckung: dunkler, weicher Saum, wo Graben, Wälle und Befestigungen auf den flachen Boden treffen
  const pool = pre => LISTE.stand.filter(n => n.startsWith(pre)).map(n => IM[n]).filter(Boolean);
  const DRAHT = pool('draht_stuecke'), SPERREN = pool('panzersperren'), STAEMME = pool('wald_staemme'), STUEMPFE = pool('stuempfe'), TRUEMMER = pool('truemmer'), BUNKER = [IM.bunker_1, IM.bunker_2];
  // Ansicht (setView): wird erst beim Zeichnen gebraucht
  let g = null, proj = null, F = 1, U = 1, UNITS = [];
  const Fk = () => F;

  // ---------- Welt ----------
  const R = cfg.R || 120, SH = 0.8 * R, COLS = cfg.cols, ROWS = cfg.rows;
  const rd = cfg.rand || {}, MX = rd.mx ?? R * 1.4, TOP = rd.top ?? R * 2.4, MB = rd.mb ?? R * 1.2;   // Ränder: Gelände läuft über die Karte hinaus
  const WW = Math.round(MX * 2 + R * (1.5 * COLS + 0.5)), WH = Math.round(TOP + R * SQ3 * (ROWS + 0.5) + MB);
  const hexC = (c, r) => [MX + R * (1 + 1.5 * c), TOP + R * SQ3 * (r + 0.5 * (c & 1) + 0.5)];
  const atW = (c, r) => [MX + R * (1 + 1.5 * c), TOP + R * SQ3 * (r + 0.5 * (Math.round(c) & 1) + 0.5)];   // Feldkoordinate mit Bruchteil
  const corner = (c, r, i, k = 1) => { const [x, y] = hexC(c, r), a = i * Math.PI / 3; return [x + R * k * Math.cos(a), y + R * k * Math.sin(a)]; };
  const edgeMid = (c, r, i, k = 1) => { const a = corner(c, r, i, k), b = corner(c, r, (i + 1) % 6, k); return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; };
  const inMap = (c, r) => c >= 0 && c < COLS && r >= 0 && r < ROWS;
  const terr = (c, r) => inMap(c, r) ? cfg.terr(c, r) : 'out';
  const flags = (c, r) => (inMap(c, r) && cfg.flags && cfg.flags(c, r)) || {};
  const nbrs = (c, r) => (c & 1 ? [[0, -1], [0, 1], [-1, 0], [1, 0], [-1, 1], [1, 1]] : [[0, -1], [0, 1], [-1, -1], [1, -1], [-1, 0], [1, 0]]).map(([dc, dr]) => [c + dc, r + dr]);
  let seed = cfg.seed || 1917; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const hrnd = (c, r, k = 0) => { let s = (c * 73856093) ^ (r * 19349663) ^ (k * 83492791) ^ (cfg.seed || 1917); s = (s ^ (s >>> 13)) * 1274126177; return ((s ^ (s >>> 16)) >>> 0) / 4294967296; };

  const WCV = document.createElement('canvas'); WCV.width = WW; WCV.height = WH; const w = WCV.getContext('2d');
  const TILE = (cfg.kachel || 3.2) * R;   // eine Texturkachel deckt gut 1,5 Feldbreiten: die ruhigen Texturen haben große, flache Formen, die sonst verschwimmen
  const pattern = (ctx, im, ox = 0, oy = 0, k = 1) => { const p = ctx.createPattern(im, 'repeat'); p.setTransform(new DOMMatrix().translate(ox, oy).scale(TILE * k / im.width)); return p; };

  // ---------- 1. Boden: Grundboden Schlamm, darüber weiche Schichten je Geländeart ----------
  w.fillStyle = pattern(w, IM.boden_schlamm); w.fillRect(0, 0, WW, WH);
  const MK = document.createElement('canvas'), LY = document.createElement('canvas'); MK.width = LY.width = WW; MK.height = LY.height = WH;
  const m = MK.getContext('2d'), l = LY.getContext('2d');
  function schicht(tex, zeichne, blur = 0.16, alpha = 1, ox = 0, hell = 1) {
    m.setTransform(1, 0, 0, 1, 0, 0); m.clearRect(0, 0, WW, WH); m.filter = `blur(${R * blur}px)`; m.fillStyle = '#fff'; m.strokeStyle = '#fff'; zeichne(m); m.filter = 'none';
    l.globalCompositeOperation = 'source-over'; l.clearRect(0, 0, WW, WH); l.fillStyle = pattern(l, IM[tex], ox, ox * 0.6); if (hell !== 1) l.filter = `brightness(${hell})`; l.fillRect(0, 0, WW, WH); l.filter = 'none';
    l.globalCompositeOperation = 'destination-in'; l.drawImage(MK, 0, 0); l.globalCompositeOperation = 'source-over';
    w.globalAlpha = alpha; w.drawImage(LY, 0, 0); w.globalAlpha = 1;
  }
  function jitterHex(ctx, x, y, k) {   // Feld mit unruhigem Rand: Übergänge folgen nicht der Hexkante
    ctx.beginPath(); for (let i = 0; i <= 36; i++) { const a = i / 36 * Math.PI * 2, rr = R * k * (1 + 0.16 * Math.sin(a * 3 + x * 0.05) + 0.1 * Math.sin(a * 7 + y * 0.07));
      i ? ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.92) : ctx.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.92); } ctx.fill();
  }
  const felder = test => { const out = []; for (let c = -1; c <= COLS; c++) for (let r = -2; r <= ROWS; r++) if (test(terr(c, r), c, r)) out.push([c, r]); return out; };
  // Gras: offene Felder nach großflächigem Rauschen (nicht feldweise), Feldart 'grass' immer
  const noise = (x, y) => Math.sin(x * 0.011 * 120 / R + 1.3) * Math.sin(y * 0.013 * 120 / R + 0.4) + 0.6 * Math.sin((x * 0.023 + y * 0.017) * 120 / R);
  if (!WI) schicht('boden_gras', ctx => { for (const [c, r] of felder((t, c, r) => t === 'grass' || ((t === 'open' || t === 'out') && noise(...hexC(c, r)) > 0.15))) jitterHex(ctx, ...hexC(c, r), 1.05); }, 0.22, 0.95, 37);
  if (!WI && felder(t => t === 'garten' || t === 'friedhof').length) schicht('boden_gras', ctx => { for (const [c, r] of felder(t => t === 'garten' || t === 'friedhof')) jitterHex(ctx, ...hexC(c, r), 0.95); }, 0.2, 0.9, 41);   // Gärten, Friedhof: Gras
  if (!WI) schicht('boden_waldboden', ctx => { for (const [c, r] of felder(t => t === 'forest' || t === 'wald')) jitterHex(ctx, ...hexC(c, r), 1.05); }, 0.16, 1, 91);
  if (!WI) schicht('boden_truemmer', ctx => {   // Trümmerboden leicht gedämpft (unruhiger als die übrigen)
    for (const [c, r] of felder(t => t === 'village' || t === 'rubble' || t === 'barrikade' || t === 'fabrik' || t === 'kirche' || t === 'schiff' || t === 'turm')) jitterHex(ctx, ...hexC(c, r), 1.0); }, 0.14, 0.92, 13, 0.86);
  const PLATZ = felder((t, c, r) => inMap(c, r) && /platz|brunnen/.test(flags(c, r).deko || ''));
  if (PLATZ.length && !(typeof window !== 'undefined' && window.NOPLATZ)) schicht('boden_kopfstein', ctx => { for (const [c, r] of PLATZ) jitterHex(ctx, ...hexC(c, r), 1.0); }, 0.1, 1, 7, (cfg.hell || 1.2) * 1.05);   // Dorfplatz: Kopfstein
  // Winter (Enrico 19:15): reine Schneefassungen je Feld gemischt (Felsen-Fassung etwa 1 von 8), die fleckige Kachel nur zertrampelt im Dorf
  if (WI && IM.boden_schnee_rein_1) {
    const fass = (c, r) => { const v = hrnd(c, r, 290); return v < 0.125 ? 4 : v < 0.45 ? 2 : v < 0.75 ? 3 : 1; };
    for (const k of [2, 3, 4]) if (IM['boden_schnee_rein_' + k]) schicht('boden_schnee_rein_' + k, ctx => { for (const [c, r] of felder((t, c, r) => fass(c, r) === k)) jitterHex(ctx, ...hexC(c, r), 1.0); }, 0.22, 1, 29 * k);
    schicht('boden_schnee', ctx => { for (const [c, r] of felder(t => ['haus', 'kapelle', 'village', 'steinbruecke'].includes(t))) jitterHex(ctx, ...hexC(c, r), 0.85); }, 0.25, 0.55, 17);   // Punkt 1: Dorfboden weniger fleckig
  }
  if (!WI) schicht('boden_sumpf', ctx => { for (const [c, r] of felder(t => t === 'sumpf' || t === 'mud')) jitterHex(ctx, ...hexC(c, r), 0.95); }, 0.2, 0.9, 53);
  // Acker im Schnee: je Feld ein ganzes Stück (gemalte Furchen kacheln nicht sauber), leicht gedreht, manche Felder quer – wie ein Flickenteppich
  // Paket C2 Punkt 37 (2026-11-24): Äcker als zusammenhängende Fläche – eine gemeinsame, weich gezeichnete Maske über alle Gartenfelder, darin die Furchen
  // als durchgehendes Muster in einer Richtung (vorher je Feld ein eigenes Stück mit ausgefranstem Rand: Flickenteppich). Vergleich: window.ACKER_ALT = true
  // G1-Probe (2026-11-25, nur mit cfg.ackerNeu): Acker unter Schnee aus gezeichneten Furchen – dunkle Erde in unregelmäßigen, leicht gebogenen,
  // unterbrochenen Furchen, Schnee auf den Kämmen dazwischen, Erdkrümel; weicher Feldrain mit Schneewehe statt ausgefranstem Rand
  if (WI && cfg.ackerNeu) { const AF = felder((t, c, r) => inMap(c, r) && t === 'garten'); if (AF.length) {
    const A = cfg.ackerNeu === true ? {} : cfg.ackerNeu;
    w.save(); w.filter = `blur(${R * 0.3}px)`; w.fillStyle = `rgba(246,248,250,${A.rain ?? 0.35})`; for (const [c, r] of AF) jitterHex(w, ...hexC(c, r), 1.12); w.restore();   // Schneewehe am Feldrain
    m.setTransform(1, 0, 0, 1, 0, 0); m.clearRect(0, 0, WW, WH); m.filter = `blur(${R * 0.22}px)`; m.fillStyle = '#fff'; for (const [c, r] of AF) jitterHex(m, ...hexC(c, r), 0.92); m.filter = 'none';
    l.globalCompositeOperation = 'source-over'; l.setTransform(1, 0, 0, 1, 0, 0); l.clearRect(0, 0, WW, WH);
    const P = AF.map(f => hexC(...f)), x0 = Math.min(...P.map(q => q[0])) - R * 1.5, x1 = Math.max(...P.map(q => q[0])) + R * 1.5, y0 = Math.min(...P.map(q => q[1])) - R * 1.5, y1 = Math.max(...P.map(q => q[1])) + R * 1.5;
    const D = Math.hypot(x1 - x0, y1 - y0) / 2; let sd = 4711; const rr = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
    l.save(); l.translate((x0 + x1) / 2, (y0 + y1) / 2); l.rotate(A.winkel ?? 0.12); l.lineCap = 'round'; l.lineJoin = 'round';
    l.fillStyle = `rgba(96,84,72,${A.grund ?? 0.22})`; l.fillRect(-D, -D, 2 * D, 2 * D);   // leichter Erdton unter dem ganzen Acker
    for (let v = -D; v < D; v += R * (A.abstand ?? 0.1) * (0.88 + rr() * 0.24)) {   // Furchen: fast parallel, Abstand ±12 %, Breite/Helligkeit/Lücken unregelmäßig
      const ph = rr() * 6.28, amp = R * (0.015 + rr() * 0.025), per = R * (3 + rr() * 3); let u = -D;
      while (u < D) { const len = R * (0.4 + rr() * 1.4), gap = rr() < 0.4 ? R * (0.04 + rr() * 0.18) : 0, e = Math.min(D, u + len), lw = R * (0.028 + rr() * 0.022) * (A.breite ?? 1), da = (A.dunkel ?? 1) * (0.5 + rr() * 0.4);
        const linie = (dy, farbe, wd) => { l.beginPath(); let first = true; for (let t = u; t <= e + 1e-6; t += R * 0.12) { const yy = v + dy + Math.sin(t / per * 6.28 + ph) * amp; if (first) { l.moveTo(t, yy); first = false; } else l.lineTo(t, yy); } l.lineWidth = wd; l.strokeStyle = farbe; l.stroke(); };
        linie(0, `rgba(${42 + rr() * 16 | 0},${33 + rr() * 10 | 0},${25 + rr() * 8 | 0},${da})`, lw);   // Erdrinne
        linie(-lw * 0.9, `rgba(250,251,252,${0.28 + rr() * 0.22})`, lw * 0.7);   // Schnee auf dem Kamm darüber (Licht von oben)
        u = e + gap; } }
    for (let i = 0; i < AF.length * 70; i++) { l.fillStyle = `rgba(50,40,30,${0.2 + rr() * 0.3})`; l.beginPath(); l.arc((rr() - 0.5) * 2 * D, (rr() - 0.5) * 2 * D, R * (0.006 + rr() * 0.016), 0, 7); l.fill(); }   // Erdkrümel
    l.restore(); l.globalCompositeOperation = 'destination-in'; l.drawImage(MK, 0, 0); l.globalCompositeOperation = 'source-over'; w.drawImage(LY, 0, 0); } }
  else if (WI && IM.boden_acker_schnee && !(typeof window !== 'undefined' && window.ACKER_ALT)) { const AF = felder((t, c, r) => inMap(c, r) && t === 'garten'); if (AF.length) {
    m.setTransform(1, 0, 0, 1, 0, 0); m.clearRect(0, 0, WW, WH); m.filter = `blur(${R * 0.16}px)`; m.fillStyle = '#fff'; for (const [c, r] of AF) jitterHex(m, ...hexC(c, r), 1.04); m.filter = 'none';
    const im = IM.boden_acker_schnee, pat = l.createPattern(im, 'repeat'); pat.setTransform(new DOMMatrix().rotate(7).scale(R * 3.8 / im.width));
    l.globalCompositeOperation = 'source-over'; l.clearRect(0, 0, WW, WH); l.fillStyle = pat; l.fillRect(0, 0, WW, WH);
    l.globalCompositeOperation = 'destination-in'; l.drawImage(MK, 0, 0); l.globalCompositeOperation = 'source-over'; w.globalAlpha = 0.62; w.drawImage(LY, 0, 0); w.globalAlpha = 1; } }
  else if (WI && IM.boden_acker_schnee) for (const [c, r] of felder((t, c, r) => inMap(c, r) && t === 'garten')) {
    const [x, y] = hexC(c, r), S = Math.ceil(R * 2.6), cv = document.createElement('canvas'); cv.width = cv.height = S; const a = cv.getContext('2d'), im = IM.boden_acker_schnee, k = S * 1.45 / im.width;
    a.translate(S / 2, S / 2); a.rotate(0.12 + (hrnd(c, r, 260) - 0.5) * 0.08); a.drawImage(im, -im.width * k / 2, -im.height * k / 2, im.width * k, im.height * k);   // Paket C Punkt 1 (2026-11-24): alle Äcker in einer Furchenrichtung – vorher je Feld anders gedreht, wirkte unruhig
    a.setTransform(1, 0, 0, 1, 0, 0); a.globalCompositeOperation = 'destination-in'; a.filter = `blur(${R * 0.1}px)`; a.fillStyle = '#fff'; a.translate(S / 2 - x, S / 2 - y); jitterHex(a, x, y, 0.88);
    w.globalAlpha = 0.62; w.drawImage(cv, x - S / 2, y - S / 2); w.globalAlpha = 1;   // blasser (Punkt 1)
  }
  // Großflächige Helligkeitsflecken gegen Kachelwiederholung
  for (let i = 0; i < WW * WH / (R * R) * 0.35; i++) { const x = rnd() * WW, y = rnd() * WH, rr = R * (0.8 + rnd() * 1.8), d = rnd() < 0.55;
    const gr = w.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, d ? 'rgba(10,7,5,0.2)' : 'rgba(150,130,100,0.08)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); w.fillStyle = gr; w.fillRect(x - rr, y - rr, rr * 2, rr * 2); }
  // Boden insgesamt aufhellen: die gelieferten Texturen sind sehr dunkel (Helligkeit 0,08–0,17), Figuren sollen sich abheben
  l.globalCompositeOperation = 'source-over'; l.clearRect(0, 0, WW, WH); l.filter = `brightness(${cfg.hell || 1.2}) contrast(${cfg.kontrast || 1.12}) saturate(0.95)`; l.drawImage(WCV, 0, 0); l.filter = 'none';   // ruhige Texturen (seit 2026-11-16) sind heller als die ersten
  w.clearRect(0, 0, WW, WH); w.drawImage(LY, 0, 0);

  // ---------- Linienzüge (Gräben, Straßen, Kanal) aus Feldern ----------
  function ketten(test) {   // Felder mit test() zu Ketten verbinden: von Enden/Knoten bis zum nächsten Ende/Knoten
    const key = (c, r) => c + ',' + r, set = new Set(felder((t, c, r) => inMap(c, r) && test(c, r)).map(([c, r]) => key(c, r)));
    const adj = k => { const [c, r] = k.split(',').map(Number); return nbrs(c, r).map(([a, b]) => key(a, b)).filter(n => set.has(n)); };
    const used = new Set(), edge = (a, b) => a < b ? a + '|' + b : b + '|' + a, out = [];
    const walk = (a, b) => { const ch = [a, b]; used.add(edge(a, b)); let prev = a, cur = b;
      while (adj(cur).length === 2) { const nx = adj(cur).find(n => n !== prev); if (used.has(edge(cur, nx))) break; used.add(edge(cur, nx)); ch.push(nx); prev = cur; cur = nx; }
      return ch; };
    for (const k of set) if (adj(k).length !== 2) for (const n of adj(k)) if (!used.has(edge(k, n))) out.push(walk(k, n));
    for (const k of set) for (const n of adj(k)) if (!used.has(edge(k, n))) out.push(walk(k, n));
    for (const k of set) if (!adj(k).length) out.push([k]);
    return out.map(ch => ch.map(k => k.split(',').map(Number)));
  }
  function verlaengern(ch) {   // Kettenenden am Kartenrand bis zur Kante weiterführen
    const pts = ch.map(([c, r]) => hexC(c, r)), rand = ([c, r]) => c === 0 || r === 0 || c === COLS - 1 || r === ROWS - 1;
    const ends = [false, false], add = [null, null], n = pts.length;
    if (n > 1) for (const [i, j, e] of [[0, 1, 0], [n - 1, n - 2, 1]]) if (rand(ch[i])) {
      const [c, r] = ch[i], dx = pts[i][0] - pts[j][0], dy = pts[i][1] - pts[j][1], L = Math.hypot(dx, dy);
      const out = (dy < 0 && r === 0) || (dy > 0 && r === ROWS - 1) || (dx < 0 && c === 0) || (dx > 0 && c === COLS - 1);
      if (out) { add[e] = [pts[i][0] + dx / L * R * 0.95, pts[i][1] + dy / L * R * 0.95]; ends[e] = true; }
    }
    return { pts: [...(add[0] ? [add[0]] : []), ...pts, ...(add[1] ? [add[1]] : [])], ends };
  }
  const chaikin = (pts, n = 3) => { for (let k = 0; k < n; k++) { const o = [pts[0]]; for (let i = 0; i < pts.length - 1; i++) { const [a, b] = [pts[i], pts[i + 1]];
      o.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]); } o.push(pts[pts.length - 1]); pts = o; } return pts; };
  const distTo = (p, pts) => { let d = 1e9; for (let i = 0; i < pts.length - 1; i++) { const [a, b] = [pts[i], pts[i + 1]], vx = b[0] - a[0], vy = b[1] - a[1], t = Math.max(0, Math.min(1, ((p[0] - a[0]) * vx + (p[1] - a[1]) * vy) / (vx * vx + vy * vy || 1)));
    d = Math.min(d, Math.hypot(p[0] - a[0] - vx * t, p[1] - a[1] - vy * t)); } return d; };
  const strokeLines = (ctx, lines, wd) => { ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = wd; for (const p of lines) { ctx.beginPath(); p.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.stroke(); } };

  // Straßen (Kopfstein) und Kanal (Wasser mit dunkler Uferkante)
  // cfg.strassen (Winterkarten): Straßen entlang der Wegpunkte der Karte statt aus den Straßenfeldern (dort liegen Straßenfelder in Gruppen, die Ketten wurden ein Netz)
  const ROADS = cfg.strassen ? cfg.strassen.filter(z => z.length > 1).map(z => chaikin(verlaengern(z).pts, 3))
    : ketten((c, r) => flags(c, r).road && terr(c, r) !== 'canal' && terr(c, r) !== 'eis').filter(ch => ch.length > 1).map(ch => chaikin(verlaengern(ch).pts, 2));
  // Winter: Matschstraße mit Radspuren entlang des Wegs gedreht (Textur läuft senkrecht, wird je Stück in Wegrichtung gelegt), Schneeränder laufen in den Boden aus
  function strasseWinter(lines) {   // Paket C2 Punkt 35 (2026-11-24): jede Straße mit ihrer eigenen Maske – vorher eine gemeinsame Schicht für alle, dann übermalte der verschneite Texturrand der zweiten Straße das Matschband der ersten (gerade Kante entlang der Hauptstraße am Dorfplatz)
    const im = IM.strasse_matsch, B = R * 1.7, k = B / im.width;   // Matschband (gut die Hälfte der Kachel) etwa so breit wie die Maske
    for (const p of lines) {
      l.globalCompositeOperation = 'source-over'; l.clearRect(0, 0, WW, WH);
      let v = 0; for (let i = 0; i < p.length - 1; i++) { const a = p[i], b = p[i + 1], len = Math.hypot(b[0] - a[0], b[1] - a[1]); if (len < 0.5) continue;
        l.save(); l.translate(a[0], a[1]); l.rotate(Math.atan2(b[1] - a[1], b[0] - a[0]) - Math.PI / 2);
        const pat = l.createPattern(im, 'repeat'); pat.setTransform(new DOMMatrix().translate(-B * 0.53, -v).scale(k)); l.fillStyle = pat; l.fillRect(-B / 2, -3, B, len + 6); l.restore(); v += len; }
      m.setTransform(1, 0, 0, 1, 0, 0); m.clearRect(0, 0, WW, WH); m.filter = `blur(${R * 0.09}px)`; m.strokeStyle = '#fff'; strokeLines(m, [p], R * 0.8); m.filter = 'none';
      m.globalCompositeOperation = 'destination-out';   // Enden innerhalb der Karte laufen über gut ein halbes Feld weich aus (statt runder, harter Kappe)
      for (const [e, f] of [[p[0], p[Math.min(3, p.length - 1)]], [p[p.length - 1], p[Math.max(0, p.length - 4)]]]) {
        if (!(e[0] > R && e[1] > R && e[0] < WW - R && e[1] < WH - R)) continue;
        const dx = e[0] - f[0], dy = e[1] - f[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
        const gr = m.createLinearGradient(e[0] - ux * R * 0.75, e[1] - uy * R * 0.75, e[0] + ux * R * 0.2, e[1] + uy * R * 0.2); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,1)');
        m.fillStyle = gr; m.beginPath(); m.arc(e[0], e[1], R * 1.1, 0, 7); m.fill(); }
      m.globalCompositeOperation = 'source-over';
      l.globalCompositeOperation = 'destination-in'; l.drawImage(MK, 0, 0); l.globalCompositeOperation = 'source-over'; w.drawImage(LY, 0, 0);
    }
  }
  if (ROADS.length && WI && IM.strasse_matsch) { if (IM.boden_schnee_rein_1) schicht('boden_schnee', ctx => strokeLines(ctx, ROADS, R * 1.05), 0.25, 0.45, 11); strasseWinter(ROADS); }   // Wegränder zertrampelt – Punkt 1 (2026-11-24): schmaler und schwächer, Straßen ruhiger lesbar
  else if (ROADS.length) { w.save(); w.filter = `blur(${R * 0.06}px)`; w.strokeStyle = 'rgba(30,22,15,0.5)'; strokeLines(w, ROADS, R * 0.78); w.restore(); schicht('boden_kopfstein', ctx => strokeLines(ctx, ROADS, R * 0.62), 0.05, 1, 7, (cfg.hell || 1.2) * 1.05); w.save(); w.globalCompositeOperation = 'soft-light'; w.filter = `blur(${R * 0.05}px)`; w.strokeStyle = 'rgba(255,240,210,0.35)'; strokeLines(w, ROADS, R * 0.5); w.restore(); }
  const RIVERS = ketten((c, r) => flags(c, r).river || ['canal', 'bridge', 'furt', 'eis', 'steinbruecke'].includes(terr(c, r))).filter(ch => ch.length > 1).map(ch => chaikin(verlaengern(ch).pts, 2));
  if (RIVERS.length) {
    w.save(); w.filter = `blur(${R * 0.08}px)`; w.strokeStyle = WI ? 'rgba(30,34,38,0.55)' : 'rgba(28,21,14,0.95)'; strokeLines(w, RIVERS, R * (WI ? 1.4 : 1.55)); w.restore();
    schicht('boden_wasser', ctx => strokeLines(ctx, RIVERS, R * 1.22), 0.03, 1, 0);
  }
  // Winter: Eisfelder ganz füllen (Teich, breite Stellen), nicht nur entlang der Flusslinie
  const EISF = WI ? felder((t, c, r) => inMap(c, r) && t === 'eis') : [];
  if (EISF.length) schicht('boden_eis', ctx => { for (const [c, r] of EISF) jitterHex(ctx, ...hexC(c, r), 0.8); }, 0.22, 1, 0);
  // Uferkante flach (Enrico 19:45): Streifen (oben Schnee, Uferlinie bei 58 %, unten Eis) entlang der weichen Eisgrenze, nicht an den Feldkanten.
  // Eisgrenze aus einer kleinen Maske (Flusslinien + Eisfelder, weichgezeichnet); alle 0,5 R ein Punkt auf der Grenze, Richtung aus dem Gefälle der Maske.
  // Streifen 1–2 meist, 3 (steinig) selten; Enden weich, damit sich überlappende Stücke nicht hart absetzen.
  const UFER = { n: 0 };   // Test: Anzahl gelegter Uferstreifen (__dbg.gbw.UFER)
  if (EISF.length && IM.ufer_flach_1) {
    const f = 0.125, MW = Math.ceil(WW * f), MH = Math.ceil(WH * f), mc = document.createElement('canvas'); mc.width = MW; mc.height = MH; const mx = mc.getContext('2d');
    mx.scale(f, f); mx.fillStyle = mx.strokeStyle = '#fff'; strokeLines(mx, RIVERS, R * 1.22); for (const [c, r] of EISF) jitterHex(mx, ...hexC(c, r), 0.8);
    const tmp = document.createElement('canvas'); tmp.width = MW; tmp.height = MH; const tx = tmp.getContext('2d'); tx.filter = `blur(${Math.max(2, R * f * 0.35)}px)`; tx.drawImage(mc, 0, 0);
    const md = tx.getImageData(0, 0, MW, MH).data, mv = (x, y) => { const X = Math.max(0, Math.min(MW - 1, Math.round(x * f))), Y = Math.max(0, Math.min(MH - 1, Math.round(y * f))); return md[(Y * MW + X) * 4 + 3] / 255; };   // Alpha (weiße Maske: Farbe bleibt 255, nur Alpha läuft aus)
    const ENDF = new Map(), enden = im => { if (ENDF.has(im)) return ENDF.get(im); const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const x = c.getContext('2d'); x.drawImage(im, 0, 0);
      x.globalCompositeOperation = 'destination-in'; const gr = x.createLinearGradient(0, 0, im.width, 0); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(0.22, 'rgba(0,0,0,1)'); gr.addColorStop(0.78, 'rgba(0,0,0,1)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = gr; x.fillRect(0, 0, im.width, im.height); ENDF.set(im, c); return c; };
    const S = R * 0.5, d = Math.max(R * 0.3, 2 / f);   // Gefälle über mindestens 2 Maskenpixel
    for (let y = S / 2; y < WH; y += S) for (let x = S / 2; x < WW; x += S) {
      const jx = x + (hrnd(Math.round(x), Math.round(y), 320) - 0.5) * S * 0.6, jy = y + (hrnd(Math.round(x), Math.round(y), 321) - 0.5) * S * 0.6, v = mv(jx, jy);
      if (v < 0.2 || v > 0.8) continue;   // nur auf der Grenze (weichgezeichneter Saum)
      const gx = mv(jx + d, jy) - mv(jx - d, jy), gy = mv(jx, jy + d) - mv(jx, jy - d), gl = Math.hypot(gx, gy); if (gl < 0.05) continue;
      const nx = -gx / gl, ny = -gy / gl;   // zum Land
      const q = hrnd(Math.round(jx), Math.round(jy), 322), im0 = IM['ufer_flach_' + (q < 0.42 ? 1 : q < 0.84 ? 2 : 3)] || IM.ufer_flach_1, im = enden(im0);
      const L = R * 1.35, H = L * im.height / im.width, px = jx + nx * (v - 0.5) * R * 0.5, py = jy + ny * (v - 0.5) * R * 0.5;
      UFER.n++; w.save(); w.translate(px, py); w.rotate(Math.atan2(nx, -ny)); if (q * 7 % 1 < 0.5) w.scale(-1, 1); w.drawImage(im, -L / 2, -H * 0.58, L, H); w.restore(); } }

  // ---------- 2. Flache Details ----------
  let FZ = null;   // Ziel für flach(): sonst das Weltbild w (flachNeu zeichnet ein einzelnes Feld nach, Enrico 2026-11-22: kein Neuaufbau bei Einschlägen)
  function flach(im, x, y, size, rot, alpha = 1) {   // size: größte Ausdehnung in R
    if (!im) return;
    const k = size * R / Math.max(im.width, im.height), z = FZ || w;
    z.save(); z.globalAlpha = alpha * (FZ ? z.globalAlpha : 1); z.translate(x, y); z.rotate(rot); z.drawImage(im, -im.width * k / 2, -im.height * k / 2, im.width * k, im.height * k); z.restore();
  }
  const WEICH = new Map(), weich = im => { if (!im) return im; if (WEICH.has(im)) return WEICH.get(im);   // Rand weich ausblenden (Spuren-Bild ist eckig)
    const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const x = c.getContext('2d'); x.drawImage(im, 0, 0); x.globalCompositeOperation = 'destination-in';
    const r0 = Math.min(im.width, im.height) / 2, gr = x.createRadialGradient(im.width / 2, im.height / 2, r0 * 0.35, im.width / 2, im.height / 2, r0); gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = gr; x.fillRect(0, 0, im.width, im.height); WEICH.set(im, c); return c; };
  // Wasser in Pfützen und Trichtern schlammig: helle, graublaue Flächen → dunkles Braun-Oliv mit leichtem Glanz (sonst wirken sie wie Löcher im Bild)
  const SCHL = new Map(), schlammig = im => { if (!im) return im; if (SCHL.has(im)) return SCHL.get(im);
    const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const x = c.getContext('2d'); x.drawImage(im, 0, 0);
    const id = x.getImageData(0, 0, c.width, c.height), d = id.data;
    for (let i = 0; i < d.length; i += 4) { if (!d[i + 3]) continue;
      const r = d[i], gg = d[i + 1], b = d[i + 2], mx = Math.max(r, gg, b), mn = Math.min(r, gg, b), lum = 0.3 * r + 0.59 * gg + 0.11 * b;
      const kalt = Math.min(1, Math.max(0, (b - r + 25) / 15)), hell = Math.min(1, Math.max(0, (lum - 55) / 30)), grau = Math.min(1, Math.max(0, (40 - (mx - mn)) / 25));
      const m = kalt * hell * grau; if (m <= 0) continue;
      const gl = Math.max(0, lum - 125) * 0.45;   // Glanz nur an den hellsten Stellen
      const nr = 50 + lum * 0.12 + gl, ng = 44 + lum * 0.12 + gl, nb = 27 + lum * 0.08 + gl * 0.8;
      d[i] = r + (nr - r) * m; d[i + 1] = gg + (ng - gg) * m; d[i + 2] = b + (nb - b) * m; }
    x.putImageData(id, 0, 0); SCHL.set(im, c); return c; };
  const Fd = i => i === 8 ? weich(IM.flach_details_8) : i <= 4 ? schlammig(IM['flach_details_' + i]) : IM['flach_details_' + i];   // 1 Trichter klein, 2 groß, 3 Pfütze, 4 lange Pfütze, 5 Bretter, 6 Laufrost (nur Brücke), 7 Trümmerstreu; 8 Spuren nicht verwendet (wirkt als dunkles Rechteck)
  const jit = (c, r, k, s) => { const [x, y] = hexC(c, r); return [x + (hrnd(c, r, k) - 0.5) * R * s, y + (hrnd(c, r, k + 1) - 0.5) * R * s * 0.9]; };
  function flachDetail(c, r) {
    const t = terr(c, r), q = hrnd(c, r, 9);
    if (WI && t === 'crater' && IM.krater_schnee_1) { flach(q < 0.5 ? IM.krater_schnee_1 : IM.krater_schnee_2, ...jit(c, r, 1, 0.3), 1.05 + q * 0.35, q * 20); return; }   // Winter: Trichter im Schnee
    if (WI && t === 'furt' && IM.furt_schnee) {   // Winter: gemalte Furt (Fluss waagrecht im Bild) in Flussrichtung gedreht, Rand weich
      const [hx, hy] = hexC(c, r), rv = RIVERS.find(p => distTo([hx, hy], p) < R * 0.6); let ang = 0;
      if (rv) { let bi = 0, bd = 1e9; rv.forEach((p, i) => { const d = Math.hypot(p[0] - hx, p[1] - hy); if (d < bd) { bd = d; bi = i; } }); const a = rv[Math.max(0, bi - 1)], b = rv[Math.min(rv.length - 1, bi + 1)]; ang = Math.atan2(b[1] - a[1], b[0] - a[0]); }
      flach(weich(IM.furt_schnee), hx, hy, 2.5, ang); return; }
    if (WI && IM.krater_schnee_1 && ['open', 'grass', 'mud', 'village', 'rubble', 'wire'].includes(t)) return;   // Winter: keine Erd-Trichter, Pfützen und Trümmerstreu auf dem Schnee
    if (t === 'crater') { if (q < 0.55) flach(q < 0.28 ? schlammig(IM.trichter_gross_1) : Fd(2), ...jit(c, r, 1, 0.3), 1.15 + q * 0.3, q * 20); else { flach(Fd(1), ...jit(c, r, 1, 0.9), 0.6, q * 9); flach(Fd(1), ...jit(c, r, 3, 0.9), 0.55, q * 13); } }
    else if (t === 'mud') { if (q < 0.3) flach(Fd(q < 0.15 ? 3 : 4), ...jit(c, r, 1, 0.8), 0.6 + q * 0.6, q * 30); else if (q > 0.75) flach(Fd(8), ...jit(c, r, 3, 0.6), 0.85, q * 17, 0.8); }   // sparsam: Pfütze oder Spuren
    else if (t === 'open' || t === 'grass') { if (q < 0.18) flach(Fd(1), ...jit(c, r, 1, 1), 0.55, q * 40); else if (q < 0.3) flach(Fd(5), ...jit(c, r, 1, 0.8), 0.6, q * 40); else if (q < 0.34) flach(Fd(3), ...jit(c, r, 1, 0.9), 0.5, q * 40); else if (q < 0.38) flach(Fd(8), ...jit(c, r, 1, 0.8), 0.8, q * 40, 0.75); }
    else if (t === 'village' || t === 'rubble') { flach(Fd(7), ...jit(c, r, 1, 0.6), 0.9, q * 30, 0.9); }
    else if (t === 'wire') { if (q < 0.4) flach(Fd(1), ...jit(c, r, 1, 0.9), 0.5, q * 40); }
  }
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) flachDetail(c, r);

  // ---------- 3. Aufrechte Teile (gezeichnet erst mit setView) ----------
  const DRAW = [], SHADOW = []; let FELD = null, BAUMFELD = null;   // BAUMFELD: Feld, dessen Bäume gerade entstehen (cfg.baumAlpha macht sie durchsichtig, Enrico 2026-11-22)   // FELD: Drahtfeld, dessen Teile gerade entstehen (drahtWeg nimmt sie ohne Neuaufbau heraus, F12 2026-11-20)
  // Durchsichtig nur, wenn eine Einheit wirklich dahinter steht: seitlich innerhalb der Teilbreite, nicht bloß daneben (2026-11-16)
  const hides = (x, y, hb = R * 0.45, hW = SH) => UNITS.some(([hx, hy]) => hy < y - R * 0.2 && y - hy < hW * 1.3 + R * 0.3 && Math.abs(hx - x) < hb * 0.75);
  const offscreen = (p, q) => { const W = g.canvas.width, H = g.canvas.height, m = W * 0.15; return (p[0] < -m && q[0] < -m) || (p[0] > W + m && q[0] > W + m) || (p[1] < -m && q[1] < -m) || (p[1] > H + m * 3 && q[1] > H + m * 3); };
  function wall(im, A, B, hW, o = {}) {   // Wandstück: Bild steht über der Bodenlinie A→B, entlang der Linie gekachelt
    if (!im) return o.u0 || 0;
    const len = Math.hypot(B[0] - A[0], B[1] - A[1]), iwW = hW * im.width / im.height * (o.stretch || 1), n = Math.max(1, Math.ceil(len / (R * 0.25)));
    let u = o.u0 || 0;
    if (!o.lean && o.mitte && KIPP > 0) o = { ...o, lean: kippen(A, B, o.mitte, hW) };
    for (let i = 0; i < n; i++) {
      const a = [A[0] + (B[0] - A[0]) * i / n, A[1] + (B[1] - A[1]) * i / n], b = [A[0] + (B[0] - A[0]) * (i + 1) / n, A[1] + (B[1] - A[1]) * (i + 1) / n], du = len / n / iwW, u0 = u;
      u += du; const my = (a[1] + b[1]) / 2;
      if (o.skip && o.skip((a[0] + b[0]) / 2, my)) continue;
      DRAW.push({ feld: FELD, y: my + (o.bias || 0), f: () => strip(im, a, b, hW, u0, du, o) });
    }
    if (o.shade !== 0) SHADOW.push(() => { w.save(); w.filter = `blur(${R * 0.05}px)`; w.strokeStyle = `rgba(8,6,4,${o.shade ?? 0.5})`; w.lineWidth = R * (o.shadeW || 0.14); w.lineCap = 'round'; w.beginPath(); w.moveTo(A[0], A[1] + R * 0.03); w.lineTo(B[0], B[1] + R * 0.03); w.stroke();
      if (AO) { w.filter = `blur(${R * 0.1}px)`; w.strokeStyle = `rgba(6,4,3,${0.17 * AO})`; w.lineWidth = R * 0.34; w.stroke();   // Kantenverdeckung: breiter weicher Saum
        w.filter = `blur(${R * 0.025}px)`; w.strokeStyle = `rgba(4,3,2,${0.2 * AO})`; w.lineWidth = R * 0.07; w.stroke(); }   // und eine schmale dunkle Fuge direkt an der Kante
      w.restore(); });
    return u;
  }
  // Wandstücke, die in die Tiefe laufen (schräge Feldkanten), wirken in der gekippten Ansicht als schmale Platte: wie bei den Grabenwänden
  // die Oberkante versetzen (Wand kippt) und etwas absenken, damit die Wand als Fläche sichtbar wird; stufenlos nach Richtung, quer laufende
  // Stücke bleiben unverändert. Nur hintere Kanten, nach außen (weg von mitte = Feld- bzw. Bunkermitte, also weg vom Betrachter); vordere Kanten
  // bleiben stehen (nach vorn gekippt würden sie schmaler, nach innen verdecken sie Fahne und Trupps im Feld). Versatz höchstens KIPP_MAX
  // Feldradien, damit hohe Mauern nicht umzufallen scheinen. cfg.kipp: Stärke, 0 = aus.
  const KIPP_MAX = 0.26;
  function kippen(A, B, M, hW) {
    const dx = B[0] - A[0], dy = B[1] - A[1], l = Math.hypot(dx, dy) || 1; let nx = -dy / l, ny = dx / l;
    if (nx * ((A[0] + B[0]) / 2 - M[0]) + ny * ((A[1] + B[1]) / 2 - M[1]) < 0) { nx = -nx; ny = -ny; }
    if (ny >= 0) return null;
    const sd = Math.max(0, 1 - Math.abs(ny) / 0.85) * KIPP; if (sd < 0.05) return null;
    return { nx, ny, L: Math.min(0.9 * sd, R * KIPP_MAX * KIPP / hW), U: 1 - 0.2 * sd };
  }
  function strip(im, a, b, hW, u0, du, o) {
    const pa = proj(a[0], a[1]), pb = proj(b[0], b[1]); if (pa[2] <= 1 || pb[2] <= 1 || offscreen(pa, pb)) return;
    const sc = Fk() / ((pa[2] + pb[2]) / 2), hS = hW * sc, iw = im.width, ih = im.height;
    let s0 = ((u0 % 1) + 1) % 1, s1 = s0 + du; const parts = s1 <= 1 ? [[s0, s1, 0, 1]] : [[s0, 1, 0, (1 - s0) / du], [0, s1 - 1, (1 - s0) / du, 1]];
    let V = [0, -hS];
    if (o.lean) { const mm = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], pm = proj(mm[0], mm[1]), pt = proj(mm[0] + o.lean.nx * o.lean.L * hW, mm[1] + o.lean.ny * o.lean.L * hW); V = [pt[0] - pm[0], pt[1] - pm[1] - o.lean.U * hS]; }
    for (const [x0, x1, t0, t1] of parts) {
      const qa = [pa[0] + (pb[0] - pa[0]) * t0, pa[1] + (pb[1] - pa[1]) * t0], qb = [pa[0] + (pb[0] - pa[0]) * t1, pa[1] + (pb[1] - pa[1]) * t1], sw = (x1 - x0) * iw;
      if (sw < 0.5) continue;
      g.save(); g.setTransform((qb[0] - qa[0]) / sw, (qb[1] - qa[1]) / sw, -V[0] / ih, -V[1] / ih, qa[0] + V[0], qa[1] + V[1] + (o.sink || 0) * sc);
      const flt = typeof o.filter === 'function' ? o.filter(hS) : o.filter; if (flt) g.filter = flt; if (o.alpha) g.globalAlpha = typeof o.alpha === 'function' ? o.alpha(hS) : o.alpha;
      if (hW > 0.6 * SH && hides((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, R * 0.45, hW)) g.globalAlpha = 0.45;
      g.drawImage(im, x0 * iw, 0, Math.min(sw + 0.6, iw - x0 * iw), ih, 0, 0, Math.min(sw + 0.6, iw - x0 * iw), ih); g.restore();
    }
    if (cfg.punkte) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.strokeStyle = '#E2B04A'; g.lineWidth = 2 * U; g.beginPath(); g.moveTo(pa[0], pa[1]); g.lineTo(pb[0], pb[1]); g.stroke(); g.restore(); }
  }
  function stand(im, x, y, hW, o = {}) {   // Aufsteller am Fußpunkt (x, y), Höhe hW
    if (!im) return;
    const baum = BAUMFELD;
    DRAW.push({ feld: FELD, y: y + (o.bias || 0), f: () => {
      const p = proj(x, y), [px, py, zc] = p; if (zc <= 1 || offscreen(p, p)) return;
      const sc = Fk() / zc, h = hW * sc, wd = h * im.width / im.height;
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); if (!o.fest && hW > 0.6 * SH && hides(x, y, hW * im.width / im.height / 2, hW)) g.globalAlpha = 0.45;   /* fest: nie durchsichtig (Brückenbrüstung) */ if (baum && cfg.baumAlpha) g.globalAlpha = Math.min(g.globalAlpha, cfg.baumAlpha(baum));
      g.translate(px, py + h * 0.015); if (o.rot) g.rotate(o.rot); if (o.flip) g.scale(-1, 1); if (o.filter) g.filter = o.filter;
      g.drawImage(im, -wd * 0.5, -h, wd, h); g.restore();
      if (cfg.punkte) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#E2B04A'; g.beginPath(); g.arc(px, py, 4 * U, 0, 7); g.fill(); g.restore(); }
    } });
    if (!o.noShadow) SHADOW.push(() => { const rr = hW * im.width / im.height * (o.shadeK || 0.42) * (1 + 0.08 * AO); const gr = w.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, `rgba(8,6,4,${0.55 + 0.12 * AO})`); gr.addColorStop(1, 'rgba(8,6,4,0)'); w.save(); w.translate(x, y); w.scale(1, 0.5); w.translate(-x, -y); w.fillStyle = gr; w.beginPath(); w.arc(x, y, rr, 0, 7); w.fill(); w.restore(); });
  }
  const flipR = (c, r, k) => hrnd(c, r, k) < 0.5;

  // Graben
  // Zickzack wie echte Gräben (Schulterwehren): der Zug wird alle ZZ_STEP neu gesetzt und abwechselnd um ±ZZ_A seitlich versetzt.
  // Nur Darstellung innerhalb der Grabenfelder – die Regeln (welches Feld Graben ist) bleiben gleich.
  const ZZ_A = R * 0.3, ZZ_STEP = R * 0.866, BU = cfg.grabenForm === 'buchten', GW = BU ? 0.85 : 1.3, GK = BU ? 0.42 : 0.5;   // G1-Probe: bei Buchten schmalere Sohle, damit die eckige Form im Boden sichtbar wird   // GW: Grabenbreite (Sohlenstreifen) in R, GK: Abstand der Kanten von der Linie in R
  function zickzack(pts) {
    const segL = []; let L = 0; for (let i = 0; i < pts.length - 1; i++) { const d = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); segL.push(d); L += d; }
    const n = Math.max(2, Math.round(L / ZZ_STEP)), out = [];
    for (let j = 0; j <= n; j++) {
      let s = L * j / n, i = 0; while (i < segL.length - 1 && s > segL[i]) { s -= segL[i]; i++; }
      const a = pts[i], b = pts[i + 1], t = segL[i] ? s / segL[i] : 0, dx = (b[0] - a[0]) / (segL[i] || 1), dy = (b[1] - a[1]) / (segL[i] || 1);
      const o = j === 0 || j === n ? 0 : (j % 2 ? ZZ_A : -ZZ_A);
      out.push([a[0] + (b[0] - a[0]) * t - dy * o, a[1] + (b[1] - a[1]) * t + dx * o]);
    }
    return out;
  }
  // G1-Probe (2026-11-25, nur mit cfg.grabenForm === 'buchten'): eckiger Graben wie echte Schützengräben – abwechselnd Feuerbucht (zur Feindseite
  // vorgezogen) und Durchgang hinter einer Querwand (Traverse); Längen leicht unregelmäßig, Ecken nicht geglättet.
  function buchten(pts, ch) {
    const GB = cfg.grabenBuchten || {}, A = R * (GB.tief ?? 0.6), own = cfg.grabenSeite && ch ? cfg.grabenSeite(...ch[0]) : null, ex = own === 'A' ? 1 : own === 'D' ? -1 : 1;
    const segL = []; let L = 0; for (let i = 0; i < pts.length - 1; i++) { const d = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); segL.push(d); L += d; }
    const at = s => { let i = 0; while (i < segL.length - 1 && s > segL[i]) { s -= segL[i]; i++; } const a = pts[i], b = pts[i + 1], t = segL[i] ? s / segL[i] : 0, dx = (b[0] - a[0]) / (segL[i] || 1), dy = (b[1] - a[1]) / (segL[i] || 1);
      let nx = -dy, ny = dx; if (Math.sign(nx || 1) !== ex) { nx = -nx; ny = -ny; } return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, nx, ny]; };
    const out = [], put = (s, o) => { const [x, y, nx, ny] = at(Math.max(0, Math.min(L, s))); out.push([x + nx * o, y + ny * o]); };
    let s = 0, k = 0, bucht = hrnd(pts.length, ch ? ch[0][0] : 0, 301) < 0.5; put(0, 0);
    while (s < L) { const len = R * (bucht ? (GB.bucht ?? 0.85) + hrnd(k, 7, 302) * 0.3 : (GB.quer ?? 0.45) + hrnd(k, 7, 303) * 0.15), o = bucht ? A / 2 : -A / 2;
      const e = Math.min(L, s + len); if (e - s < R * 0.12) break; put(s, o); put(e, o); s = e; bucht = !bucht; k++; }
    put(L, 0); return out;
  }
  const TRENCH = cfg.trench ? cfg.trench.map(z => ({ pts: z.map(p => atW(...p)), ends: [false, false] }))
    : ketten((c, r) => terr(c, r) === 'trench').filter(ch => ch.length > 1).map(ch => { const v = verlaengern(ch); return { ...v, ch, pts: BU ? (ch.length >= 4 ? buchten(v.pts, ch) : v.pts) : cfg.zickzack ? zickzack(v.pts) : v.pts }; });
  const TR = TRENCH.map(z => chaikin(z.pts, cfg.grabenForm === 'buchten' ? 0 : cfg.zickzack && z.ch ? 1 : 3));
  if (TR.length && IM.graben_sohle) {
    const TW = GW * R, SOHLE = IM.graben_sohle;
    w.save(); w.filter = `blur(${R * 0.08}px)`; w.strokeStyle = 'rgba(70,56,40,0.7)'; strokeLines(w, TR, R * (GW + 0.15)); w.restore();
    // Sohle als durchgehendes Band: an jedem Punkt eine gemittelte Normale (Gehrung), je Abschnitt zwei Dreiecke mit Bildzuordnung –
    // keine Lücken oder Sprünge an Feldgrenzen und Zickzack-Knicken; das Bild läuft entlang des ganzen Zugs fortlaufend weiter.
    const dreieck = (im, s0, s1, s2, d0, d1, d2) => {   // Bilddreieck s → Zieldreieck d (affin), Ziel minimal vergrößert gegen Haarrisse
      const den = (s1[0] - s0[0]) * (s2[1] - s0[1]) - (s2[0] - s0[0]) * (s1[1] - s0[1]); if (Math.abs(den) < 1e-9) return;
      const a = ((d1[0] - d0[0]) * (s2[1] - s0[1]) - (d2[0] - d0[0]) * (s1[1] - s0[1])) / den, b = ((d1[1] - d0[1]) * (s2[1] - s0[1]) - (d2[1] - d0[1]) * (s1[1] - s0[1])) / den;
      const c = ((d2[0] - d0[0]) * (s1[0] - s0[0]) - (d1[0] - d0[0]) * (s2[0] - s0[0])) / den, d = ((d2[1] - d0[1]) * (s1[0] - s0[0]) - (d1[1] - d0[1]) * (s2[0] - s0[0])) / den;
      const e = d0[0] - a * s0[0] - c * s0[1], f = d0[1] - b * s0[0] - d * s0[1];
      const mx = (d0[0] + d1[0] + d2[0]) / 3, my = (d0[1] + d1[1] + d2[1]) / 3, gr = q => { const vx = q[0] - mx, vy = q[1] - my, l = Math.hypot(vx, vy) || 1; return [q[0] + vx / l * 0.7, q[1] + vy / l * 0.7]; };
      const [e0, e1, e2] = [gr(d0), gr(d1), gr(d2)];
      w.save(); w.beginPath(); w.moveTo(e0[0], e0[1]); w.lineTo(e1[0], e1[1]); w.lineTo(e2[0], e2[1]); w.closePath(); w.clip();
      w.setTransform(a, b, c, d, e, f); w.drawImage(im, 0, 0); w.restore();
    };
    const sohleAlong = (pts, rows) => {
      const im = SOHLE, ih = im.height, iw = im.width, s = TW / ih, [ya, yb] = rows || [0, ih], n = pts.length;
      const seg = i => { const a = pts[i], b = pts[i + 1], l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [(b[0] - a[0]) / l, (b[1] - a[1]) / l, l]; };
      const N = pts.map((p, i) => {   // Gehrung: Mittel der angrenzenden Abschnittsnormalen, Länge so, dass die Breite erhalten bleibt (begrenzt)
        const A = i > 0 ? seg(i - 1) : seg(0), B = i < n - 1 ? seg(i) : seg(n - 2), nx = -(A[1] + B[1]), ny = A[0] + B[0], l = Math.hypot(nx, ny) || 1;
        const cos = (nx / l) * -B[1] + (ny / l) * B[0]; const k = 1 / Math.max(0.66, cos); return [nx / l * k, ny / l * k]; });
      const at = (i, v) => [pts[i][0] + N[i][0] * (v - ih / 2) * s, pts[i][1] + N[i][1] * (v - ih / 2) * s];
      let u = hrnd(n, 3, 1) * iw;
      for (let i = 0; i < n - 1; i++) {
        const len = seg(i)[2]; if (len < 0.01) continue;
        let done = 0;
        while (done < len - 1e-6) {   // an der Bildkante teilen (Bild wiederholt sich entlang des Zugs)
          const sx = u % iw, part = Math.min(len - done, (iw - sx) * s), t0 = done / len, t1 = (done + part) / len, sx1 = sx + part / s;
          const P = (t, v) => { const p0 = at(i, v), p1 = at(i + 1, v); return [p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t]; };
          const a0 = P(t0, ya), a1 = P(t0, yb), b0 = P(t1, ya), b1 = P(t1, yb);
          dreieck(im, [sx, ya], [sx1, ya], [sx, yb], a0, b0, a1);
          dreieck(im, [sx1, ya], [sx1, yb], [sx, yb], b0, b1, a1);
          done += part; u += part / s;
        }
      }
      w.setTransform(1, 0, 0, 1, 0, 0);
    };
    if (cfg.grabenRueckwall) TR.forEach((pts, ti) => {   // G1-Probe: niedriger aufgeworfener Erdwall auf der Rückseite (flach, dunkler Erdstreifen)
      const own = cfg.grabenSeite && TRENCH[ti].ch ? cfg.grabenSeite(...TRENCH[ti].ch[0]) : null, ex = own === 'A' ? -1 : own === 'D' ? 1 : 0; if (!ex) return;
      w.save(); w.filter = `blur(${R * 0.07}px)`; w.strokeStyle = 'rgba(58,44,30,0.75)'; w.lineWidth = R * 0.2; w.lineJoin = 'round'; w.beginPath();
      pts.forEach((p, i) => { const x = p[0] + ex * R * (GK + 0.2); i ? w.lineTo(x, p[1]) : w.moveTo(x, p[1]); }); w.stroke(); w.restore(); });
    for (const p of TR) sohleAlong(p);
    for (const p of TR) sohleAlong(p, [SOHLE.height * 0.33, SOHLE.height * 0.67]);
    if (cfg.grabenPfuetzen) TR.forEach((pts, ti) => {   // G1-Probe: Schlammpfützen auf der Sohle (dunkel, nasser Glanz)
      for (let i = 1; i < pts.length - 1; i++) { if (hrnd(ti, i, 310) > 0.45) continue; const [x, y] = pts[i], rx = R * (0.12 + hrnd(ti, i, 311) * 0.12), ry = rx * 0.45;
        const g2 = w.createRadialGradient(x, y, 0, x, y, rx); g2.addColorStop(0, 'rgba(28,24,20,0.85)'); g2.addColorStop(0.7, 'rgba(34,28,22,0.6)'); g2.addColorStop(1, 'rgba(34,28,22,0)');
        w.save(); w.translate(x, y); w.scale(1, ry / rx); w.translate(-x, -y); w.fillStyle = g2; w.beginPath(); w.arc(x, y, rx, 0, 7); w.fill();
        w.strokeStyle = 'rgba(170,160,140,0.22)'; w.lineWidth = R * 0.012; w.beginPath(); w.arc(x - rx * 0.15, y - rx * 0.1, rx * 0.55, 3.6, 4.6); w.stroke(); w.restore(); } });
    TRENCH.forEach((z, ti) => [0, 1].forEach(e => {   // offenes Ende (nicht am Kartenrand, nicht am Abzweig): Erdwall
      const p = TR[ti], pt = e ? p[p.length - 1] : p[0];
      if (z.ends[e] || TR.some((q, j) => j !== ti && distTo(pt, q) < R * (GK + 0.1))) return;
      const gr = w.createRadialGradient(pt[0], pt[1], 0, pt[0], pt[1], R * (GW * 0.45)); gr.addColorStop(0, 'rgba(48,37,26,1)'); gr.addColorStop(0.55, 'rgba(48,37,26,0.8)'); gr.addColorStop(1, 'rgba(48,37,26,0)');
      w.fillStyle = gr; w.beginPath(); w.arc(pt[0], pt[1], R * (GW * 0.45), 0, 7); w.fill();
    }));
    const TRIM = TR.map((pts, ti) => TR.map((q, j) => j === ti ? [] : q.filter(pt => distTo(pt, pts) > R * (GK - 0.02))));
    TR.forEach((pts, ti) => {
      for (const side of [-1, 1]) {
        const off = pts.map((p, i) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], ln = Math.hypot(dx, dy) || 1; return [p[0] - dy / ln * side * R * GK, p[1] + dx / ln * side * R * GK]; });
        const uu = { v: hrnd(ti, side, 4), h: hrnd(ti, side, 5), p: hrnd(ti, side, 6) };
        // Feindseite des Grabens (cfg.grabenSeite: wem gehört der Graben): Konkordat schaut nach Osten (+x), Aschenwacht nach Westen
        const own = cfg.grabenSeite && TRENCH[ti].ch ? cfg.grabenSeite(...TRENCH[ti].ch[0]) : null, ex = own === 'A' ? 1 : own === 'D' ? -1 : 0;
        for (let i = 0; i < off.length - 1; i++) {
          const mx = (off[i][0] + off[i + 1][0]) / 2, my = (off[i][1] + off[i + 1][1]) / 2, cx = (pts[i][0] + pts[i + 1][0]) / 2, cy = (pts[i][1] + pts[i + 1][1]) / 2;
          const dl = Math.hypot(cx - mx, cy - my) || 1, inY = (cy - my) / dl, back = inY > -0.5, key = back ? 'h' : 'v';
          const sd = Math.max(0, 1 - Math.abs(inY) / 0.85), lean = sd > 0.05 ? { nx: (mx - cx) / dl, ny: (my - cy) / dl, L: 0.9 * sd, U: 1 - 0.35 * sd } : null;
          uu[key] = wall(back ? IM.graben_kante_hinten : IM.graben_kante_vorn, off[i], off[i + 1], (back ? 0.28 : 0.32) * SH, { u0: uu[key], shade: 0.4, shadeW: 0.1, lean,
            skip: (x, y) => TRIM[ti].some(q => q.length > 1 && distTo([x, y], q) < R * (GK + 0.04)) });
          // Stücke, die in die Tiefe laufen: auf der Feindseite zusätzlich eine aufrechte Brustwehr aus Sandsäcken, etwas weiter außen
          if (ex && sd > 0.3 && Math.sign(mx - cx) === ex) {
            const nx = (mx - cx) / dl, ny = (my - cy) / dl, o2 = R * 0.24, A2 = [off[i][0] + nx * o2, off[i][1] + ny * o2], B2 = [off[i + 1][0] + nx * o2, off[i + 1][1] + ny * o2];
            uu.p = wall(IM.graben_kante_vorn, A2, B2, 0.4 * SH, { u0: uu.p, shade: 0.45, shadeW: 0.14, bias: R * 0.02,
              skip: (x, y) => TRIM[ti].some(q => q.length > 1 && distTo([x, y], q) < R * (GK + 0.17)) });
          }
        }
      }
    });
  }

  // Felder mit aufrechten Teilen
  const DRAHTFELD = new Set();
  const BAUFELD = new Map(); for (const b of cfg.bauten || []) for (const f of [...b.felder, ...(b.turm ? [b.turm] : [])]) BAUFELD.set(f[0] + ',' + f[1], b);
  const nbE = (c, r, e) => { const o = c & 1; return [[c + 1, r + o], [c, r + 1], [c - 1, r + o], [c - 1, r - 1 + o], [c, r - 1], [c + 1, r - 1 + o]][e]; };   // Nachbar über Kante e
  const px = (im, k = 1) => im ? im.height / 320 * SH * k : 0;   // Höhe im Malmaßstab (320 px = 1 SH)
  // Winterfelder (Krähenfurt): true = Feld fertig, sonst weiter mit den üblichen Teilen. Größen nach Breite in Feldradien (breit), Gebäude nie gespiegelt (Licht von links). Häuser/Kapelle seit Enrico 19:45 15 % größer; steht ein Trupp dahinter, werden sie durchsichtig (stand/hides).
  const WP = pre => LISTE.stand.filter(n => n.startsWith(pre)).map(n => IM[n]).filter(Boolean);
  const TANNEN = WP('tanne_schnee'), HAEUSER = WP('haus_heil'), HRUINEN = WP('haus_ruine_schnee'), HOLZ = WP('holzstapel');
  const breit = (im, wR) => im ? wR * R * im.height / im.width : 0;
  const WASSER = new Set(['eis', 'canal', 'bridge', 'furt', 'steinbruecke', 'out']);
  const pick = (arr, v) => arr[Math.min(arr.length - 1, Math.floor(v * arr.length))];
  function winterFeld(c, r, t, hx, hy, q) {
    if (t === 'haus' && HAEUSER.length) {
      stand(pick(HAEUSER, q(300)), hx + (q(301) - 0.5) * R * 0.12, hy - R * 0.04, breit(HAEUSER[0], 2.0), { shadeK: 0.5 });
      if (HOLZ.length && q(302) < 0.45) { const im = pick(HOLZ, q(305)); stand(im, ...corner(c, r, q(303) < 0.5 ? 0 : 3, 0.74), breit(im, 0.62), { flip: q(304) < 0.5, shadeK: 0.35 }); }
      return true;
    }
    if (t === 'kapelle' && IM.kapelle) { stand(IM.kapelle, hx, hy - R * 0.05, breit(IM.kapelle, 2.1), { shadeK: 0.5 }); return true; }
    if (t === 'village') {   // eingestürztes Haus bzw. eingestürzte Kapelle (Regeln machen daraus Ruine)
      const art = cfg.bauArt && cfg.bauArt(c, r), im = art === 'kapelle' ? IM.kapelle_ruine : HRUINEN.length ? pick(HRUINEN, q(310)) : null;
      if (!im) return false;
      stand(im, hx, hy - R * 0.04, breit(im, art === 'kapelle' ? 2.1 : 2.0), { shadeK: 0.5 }); return true;
    }
    if (t === 'wald' && TANNEN.length) {   // verschneite Tannen an den hinteren Ecken, Unterholz an der vorderen Kante
      const ecken = [[4, 0.82], [5, 0.82], ...(q(60) < 0.6 ? [[q(61) < 0.5 ? 3 : 0, 0.78]] : [])];
      for (const [e, k] of ecken) stand(pick(TANNEN, q(e + 62)), ...corner(c, r, e, k), 2.0 * SH * (0.82 + q(e + 70) * 0.3), { flip: flipR(c, r, e + 80), shadeK: 0.3 });
      wall(IM.wald_unterholz, corner(c, r, 2, 0.88), corner(c, r, 1, 0.88), 0.34 * SH, { u0: q(90) * 4, shade: 0.3 });
      return true;
    }
    if (t === 'forest' && (IM.baum_tot_schnee_1 || TANNEN.length)) {   // lichter Winterwald: toter Baum hinten, Stumpf, manchmal eine junge Tanne
      if (IM.baum_tot_schnee_1) stand(IM.baum_tot_schnee_1, ...corner(c, r, q(50) < 0.5 ? 4 : 5, 0.62), 1.7 * SH * (0.85 + q(51) * 0.25), { flip: flipR(c, r, 52), shadeK: 0.3 });
      if (IM.baum_tot_schnee_2) stand(IM.baum_tot_schnee_2, ...corner(c, r, q(53) < 0.5 ? 3 : 0, 0.55), 0.95 * SH * (0.85 + q(54) * 0.3), { flip: flipR(c, r, 55) });
      if (TANNEN.length && q(56) < 0.5) stand(pick(TANNEN, q(57)), ...corner(c, r, q(58) < 0.5 ? 2 : 1, 0.45), 1.45 * SH * (0.85 + q(59) * 0.25), { flip: flipR(c, r, 59), shadeK: 0.3 });
      return true;
    }
    if (t === 'steinbruecke' && IM.bruecke_stein_hinten) {   // Steinbrücke: hinten (Brüstung, Fahrbahn) hinter den Figuren, vorn (Brüstung, Bogen) davor; gemalt von links oben nach rechts unten
      const rd = ROADS.find(p => distTo([hx, hy], p) < R * 0.6); let flip = false;
      if (rd) { let bi = 0, bd = 1e9; rd.forEach((p, i) => { const d = Math.hypot(p[0] - hx, p[1] - hy); if (d < bd) { bd = d; bi = i; } }); const a = rd[Math.max(0, bi - 2)], b = rd[Math.min(rd.length - 1, bi + 2)]; flip = (b[1] - a[1]) * (b[0] - a[0]) < 0; }
      const hW = breit(IM.bruecke_stein_hinten, 2.5), x = hx, y = hy + R * 0.85;   // Fuß weit vorn: die Fahrbahn liegt dann etwa auf Höhe der Feldmitte (Figuren stehen auf der Brücke)
      stand(IM.bruecke_stein_hinten, x, y, hW, { bias: -R * 1.3, flip, noShadow: true, fest: true });
      stand(IM.bruecke_stein_vorn, x, y, hW, { bias: R * 0.05, flip, noShadow: true, fest: true });
      return true;
    }
    if (t === 'eis') return true;   // Uferkante: entlang der Flusslinie (ufer() unten), nicht an Feldkanten
    if ((t === 'open' || t === 'garten') && IM.schilf && q(280) < 0.4) {   // Schilf am Ufer
      const e = [0, 1, 2, 3, 4, 5].find(e => terr(...nbE(c, r, e)) === 'eis');
      if (e != null) { const p = edgeMid(c, r, e, 0.72); stand(IM.schilf, p[0], p[1], breit(IM.schilf, 0.62), { flip: q(281) < 0.5, shadeK: 0.25 }); }
    }
    return false;
  }
  function feldTeile(c, r) {   // aufrechte Teile eines Felds (einzeln aufrufbar: feldNeu, z. B. eingestürztes Haus in Krähenfurt)
    const t = terr(c, r), [hx, hy] = hexC(c, r), q = k => hrnd(c, r, k); FELD = c + ',' + r; BAUMFELD = t === 'forest' || t === 'wald' ? c + ',' + r : null;
    if (BAUFELD.has(c + ',' + r)) return;   // große Gebäude: eigener Aufbau weiter unten
    const deko = flags(c, r).deko || '';
    if (deko === 'brunnen') stand(IM.dorf_aufsteller_1, hx - R * 0.58, hy + R * 0.02, px(IM.dorf_aufsteller_1), { shadeK: 0.4 });   // Brunnen am linken Rand des Platzes (nicht vor der Kirchenmauer)
    if (deko === 'wegkreuz') stand(IM.dorf_aufsteller_2, hx + R * 0.55, hy - R * 0.45, px(IM.dorf_aufsteller_2), { shadeK: 0.3, flip: q(201) < 0.5 });
    if (deko === 'karren' || (deko === 'platz' && q(202) < 0.5)) stand(IM.dorf_aufsteller_3, hx - R * 0.55, hy - R * 0.5, px(IM.dorf_aufsteller_3), { flip: q(203) < 0.5 });
    if (deko === 'platz' && q(204) < 0.4) stand(IM.dorf_aufsteller_4, ...corner(c, r, q(205) < 0.5 ? 1 : 2, 0.72), px(IM.dorf_aufsteller_4, 0.85), { flip: q(206) < 0.5, shadeK: 0.2 });   // Laterne selten, vorn im Feld
    if (WI && winterFeld(c, r, t, hx, hy, q)) return;
    if (t === 'friedhof') {   // Grabkreuze, Grabsteine, Grabplatte an den Rändern; Heiligenfigur nur mit Schmuck 'figur'
      const plaetze = [[4, 0.62], [5, 0.62], [3, 0.6], [1, 0.62], [0, 0.6]].sort((a, b) => q(a[0] + 210) - q(b[0] + 210)).slice(0, deko === 'figur' ? 2 : 3);
      plaetze.forEach(([e, kk], i) => { const im = IM['friedhof_' + [1, 2, 3, 1, 2][(Math.floor(q(e + 220) * 5) + i) % 5]]; stand(im, ...corner(c, r, e, kk), px(im), { flip: q(e + 230) < 0.5 }); });
      if (deko === 'figur') stand(IM.friedhof_4, hx - R * 0.05, hy - R * 0.55, px(IM.friedhof_4), { shadeK: 0.3 });
    } else if (t === 'garten' && q(240) < 0.55) {   // Garten: ein zerschossener Obstbaum oder ein umgekippter Karren
      if (q(241) < 0.7) stand(STUEMPFE[Math.floor(q(242) * STUEMPFE.length)], ...corner(c, r, q(243) < 0.5 ? 4 : 5, 0.55), 0.8 * SH * (0.8 + q(244) * 0.3), { flip: q(245) < 0.5 });
      else stand(IM.dorf_aufsteller_3, ...corner(c, r, 3, 0.5), px(IM.dorf_aufsteller_3), { flip: q(246) < 0.5 });
    }
    if (t === 'village') {   // Ruine zweiteilig: Mauern hinten, Mauerrest vorn (weiter innen), Ecken auf den Stößen
      const k = 0.86, kv = 0.66; let u = q(1) * 3;
      for (const e of [3, 4, 5]) u = wall(IM.ruine_hinten, corner(c, r, e, k), corner(c, r, (e + 1) % 6, k), 1.2 * SH, { u0: u, mitte: [hx, hy] });
      wall(IM.ruine_vorn, corner(c, r, 2, kv), corner(c, r, 1, kv), 0.45 * SH, { u0: q(2) * 3, shade: 0.45, filter: 'brightness(0.85)', mitte: [hx, hy] });
      const A = corner(c, r, 3, kv), B = corner(c, r, 2, kv); wall(IM.ruine_vorn, A, [A[0] + (B[0] - A[0]) * 0.55, A[1] + (B[1] - A[1]) * 0.55], 0.45 * SH, { u0: q(3) * 3, shade: 0.45, filter: 'brightness(0.85)', mitte: [hx, hy] });
      const hoch = q(4) < 0.5 ? [IM.ruine_ecken_1, 1.2] : [IM.ruine_ecken_4, 1.4];
      stand(IM.ruine_ecken_2, ...corner(c, r, 3, k), 0.8 * SH, { bias: R * 0.01, flip: flipR(c, r, 5) });
      stand(hoch[0], ...corner(c, r, q(6) < 0.5 ? 4 : 5, k), hoch[1] * SH, { bias: R * 0.01, flip: flipR(c, r, 7), shadeK: 0.3 });
      stand(IM.ruine_ecken_2, ...corner(c, r, 0, k), 0.8 * SH, { flip: !flipR(c, r, 5), bias: R * 0.01 });
      stand(IM.ruine_ecken_3, ...corner(c, r, 1, kv), 0.45 * SH, { flip: flipR(c, r, 8) });
    } else if (t === 'rubble') {   // Trümmerfeld: zwei Haufen und ein niedriger Mauerrest
      stand(TRUEMMER[Math.floor(q(1) * TRUEMMER.length)], ...corner(c, r, 4, 0.55), 0.6 * SH * (0.8 + q(2) * 0.3), { flip: flipR(c, r, 3) });
      stand(TRUEMMER[Math.floor(q(4) * TRUEMMER.length)], ...corner(c, r, 1, 0.6), 0.5 * SH * (0.8 + q(5) * 0.3), { flip: flipR(c, r, 6) });
      wall(IM.ruine_vorn, corner(c, r, 4, 0.8), corner(c, r, 5, 0.8), 0.4 * SH, { u0: q(7) * 3, mitte: [hx, hy] });   // quer zur Blickrichtung
    } else if (t === 'forest') {   // Totholz: Stümpfe verteilt, ein schlanker Stamm hinten
      const slots = [[4, 0.6], [5, 0.62], [3, 0.55], [0, 0.58], [2, 0.5]].sort((a, b) => q(a[0] + 10) - q(b[0] + 10)).slice(0, 3);
      for (const [e, kk] of slots) { const [x, y] = corner(c, r, e, kk); stand(STUEMPFE[Math.floor(q(e + 20) * STUEMPFE.length)], x, y, 0.9 * SH * (0.7 + q(e + 30) * 0.35), { flip: flipR(c, r, e + 40) }); }
      if (q(50) < 0.7) stand(STAEMME[Math.floor(q(51) * STAEMME.length)], ...corner(c, r, q(52) < 0.5 ? 4 : 5, 0.8), 1.6 * SH * (0.85 + q(53) * 0.2), { flip: flipR(c, r, 54), shadeK: 0.3 });
    } else if (t === 'wald') {   // dichter Wald im Spielfeld, licht: schlanke Stämme an den hinteren Ecken, Unterholz an der vorderen Kante
      for (const [e, k] of [[4, 0.85], [5, 0.85], [q(60) < 0.5 ? 3 : 0, 0.8]]) stand(STAEMME[Math.floor(q(e + 61) * STAEMME.length)], ...corner(c, r, e, k), 1.8 * SH * (0.8 + q(e + 70) * 0.2), { flip: flipR(c, r, e + 80), shadeK: 0.3 });
      wall(IM.wald_unterholz, corner(c, r, 2, 0.88), corner(c, r, 1, 0.88), 0.3 * SH, { u0: q(90) * 4, shade: 0.35 });
      if (q(91) < 0.6) stand(STUEMPFE[Math.floor(q(92) * STUEMPFE.length)], ...corner(c, r, 3, 0.45), 0.6 * SH, { flip: flipR(c, r, 93) });
    } else if (t === 'sperre') {   // Panzersperren: zwei Teile je Feld, quer verteilt
      for (const [e, kk, k] of [[4, 0.5, 1], [1, 0.45, 2]]) stand(SPERREN[Math.floor(q(k) * SPERREN.length)], ...corner(c, r, e, kk), 0.8 * SH * (0.85 + q(k + 4) * 0.25), { flip: flipR(c, r, k + 8) });
    } else if (t === 'bunker') {
      stand(BUNKER[q(1) < 0.5 ? 0 : 1], hx, hy + R * 0.25, 1.15 * SH, { flip: flipR(c, r, 2), shadeK: 0.45 });
    } else if (t === 'wire') {   // Drahtfeld (DRAHTFELD: Felder mit gezeichnetem Draht, für den Test Bild = Regel): 1–2 ganze Drahtverhau-Stücke (nicht zerschnitten), versetzt und gespiegelt, nach Tiefe mit den Figuren; nichts auf Straßen
      const aufWeg = (x, y) => ROADS.some(rd => distTo([x, y], rd) < R * 0.45);
      const n = q(1) < 0.4 ? 1 : 2, used = [];
      for (let k = 0; k < n; k++) {
        let x = hx + (q(k * 7 + 2) - 0.5) * R * (n === 1 ? 0.5 : 0.8), y = hy + (n === 1 ? (q(k * 7 + 3) - 0.5) * 0.4 : (k ? 0.32 : -0.3) + (q(k * 7 + 3) - 0.5) * 0.16) * R;
        if (aufWeg(x, y)) {   // neben die Straße ausweichen: Stelle rund ums Feld mit dem größten Abstand zur Straße; nie ganz weglassen (Bild = Regel, 2026-11-17)
          let best = null, bd = -1;
          for (let a = 0; a < 12; a++) { const px = hx + Math.cos(a * Math.PI / 6) * R * 0.55, py = hy + Math.sin(a * Math.PI / 6) * R * 0.42, d = Math.min(...ROADS.map(rd => distTo([px, py], rd)));
            if (d > bd && !used.some(u => Math.hypot(u.x - px, u.y - py) < R * 0.3)) { bd = d; best = [px, py]; } }
          if (best) [x, y] = best;
        }
        let i = Math.floor(q(k * 7 + 4) * DRAHT.length); if (used.some(u => u.i === i)) i = (i + 1) % DRAHT.length; used.push({ i, x, y });
        stand(DRAHT[i], x, y, 0.8 * SH * (0.85 + q(k * 7 + 5) * 0.25), { flip: flipR(c, r, k * 7 + 6), shadeK: 0.45 }); DRAHTFELD.add(c + ',' + r);
      }
    } else if (t === 'barrikade') {
      const ang = (q(1) - 0.5) * 0.5; wall(IM.barrikade, [hx - Math.cos(ang) * R * 0.75, hy - Math.sin(ang) * R * 0.75 - R * 0.15], [hx + Math.cos(ang) * R * 0.75, hy + Math.sin(ang) * R * 0.75 - R * 0.15], 0.55 * SH, { u0: q(2) * 3 });
    } else if (t === 'bridge') {   // Brücke: Bohlen quer über das Wasser
      const rv = RIVERS.find(p => distTo([hx, hy], p) < R * 0.6); let ang = Math.PI / 2;
      if (rv) { let bi = 0, bd = 1e9; rv.forEach((p, i) => { const d = Math.hypot(p[0] - hx, p[1] - hy); if (d < bd) { bd = d; bi = i; } }); const a = rv[Math.max(0, bi - 1)], b = rv[Math.min(rv.length - 1, bi + 1)]; ang = Math.atan2(b[1] - a[1], b[0] - a[0]); }
      const im = Fd(6), L = R * 1.9, Wd = R * 0.7;
      if (im) SHADOW.push(() => { w.save(); w.translate(hx, hy); w.rotate(ang + Math.PI / 2); w.fillStyle = 'rgba(8,6,4,0.55)'; w.fillRect(-L / 2, -Wd / 2 + R * 0.06, L, Wd); w.drawImage(im, -L / 2, -Wd / 2, L, Wd); w.restore(); });
    }
  }
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) feldTeile(c, r);
  // Winter: Uferkante (Schneewall mit Steinen) nur am hinteren Ufer – parallel zur geglätteten Flusslinie, wo das Ufer zum Betrachter zeigt; nicht an Brücke und Furt
  // Aus (2026-11-22): als aufrechter Streifen wirkt die Uferkante wie eine Mauer und kreuzt im Teich die Flusslinien; Schalter cfg.ufer zum Ausprobieren
  if (WI && IM.ufer_schnee && cfg.ufer) { FELD = null; BAUMFELD = null;
    const QUER = felder((t, c, r) => inMap(c, r) && ['steinbruecke', 'bridge', 'furt'].includes(t)).map(([c, r]) => hexC(c, r));
    const naechstes = (x, y) => { let best = null, bd = 1e9; for (let c = -1; c <= COLS; c++) for (let r = -1; r <= ROWS; r++) { const [hx, hy] = hexC(c, r), d = (hx - x) ** 2 + (hy - y) ** 2; if (d < bd) { bd = d; best = [c, r]; } } return best; };
    const land = (x, y) => !WASSER.has(terr(...naechstes(x, y)));
    for (const p of RIVERS) { const off = R * 0.72; let u = 0;
      for (let i = 0; i < p.length - 1; i++) { const a = p[i], b = p[i + 1], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy); if (l < 1) continue;
        for (const s of [1, -1]) { const nx = -dy / l * s, ny = dx / l * s; if (ny > -0.3) continue;   // Normale nach oben = hinteres Ufer
          const A = [a[0] + nx * off, a[1] + ny * off], B = [b[0] + nx * off, b[1] + ny * off], M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
          if (QUER.some(([x, y]) => Math.hypot(x - M[0], y - M[1]) < R * 0.95)) continue;
          if (!land(M[0] + nx * R * 0.45, M[1] + ny * R * 0.45)) continue;   // dahinter Wasser (Teich, Flussbiegung): keine Kante mitten im Eis
          u = wall(IM.ufer_schnee, A[0] < B[0] ? A : B, A[0] < B[0] ? B : A, 0.26 * SH, { u0: u, shade: 0.3 }); } } } }
  // ---------- Mauerzüge entlang von Feldkanten (Gebäude, Friedhof, Gärten) ----------
  // kanten: [{ c, r, e }]; zusammenhängende Kanten werden zu Zügen verbunden und von links nach rechts gezogen (das Bild läuft durch).
  // passend: Zug auf ganze bzw. halbe Kacheln dehnen und bei u = 0 beginnen (Kirchenmauer: Anfang und Ende mitten im Strebepfeiler).
  function mauerzug(kanten, im, hW, o = {}) {
    if (!im || !kanten.length) return;
    const key = p => Math.round(p[0] * 10) + ',' + Math.round(p[1] * 10), k = o.k || 1;
    const segs = kanten.map(({ c, r, e }) => { let A = corner(c, r, e, k), B = corner(c, r, (e + 1) % 6, k); if (A[0] > B[0] + 1e-6) [A, B] = [B, A]; return { A, B, M: hexC(c, r) }; });
    const vonA = new Map(); segs.forEach(s => { if (!vonA.has(key(s.A))) vonA.set(key(s.A), s); });
    const endeB = new Set(segs.map(s => key(s.B)));
    const used = new Set(), zuege = [];
    const zug = s0 => { const z = [s0]; used.add(s0); let cur = s0; while (vonA.has(key(cur.B)) && !used.has(vonA.get(key(cur.B)))) { cur = vonA.get(key(cur.B)); used.add(cur); z.push(cur); } zuege.push(z); };
    for (const s of segs) if (!endeB.has(key(s.A))) zug(s);   // Anfänge zuerst
    for (const s of segs) if (!used.has(s)) zug(s);
    zuege.forEach((z, zi) => {
      const L = z.reduce((n, s) => n + Math.hypot(s.B[0] - s.A[0], s.B[1] - s.A[1]), 0), T = hW * im.width / im.height;
      let stretch = 1, u = o.passend ? 0 : hrnd(zi, z.length, o.seed || 7) * 3;
      if (o.passend) { const n = Math.max(0.5, Math.round(L / T * 2) / 2); stretch = L / (n * T); }
      for (const s of z) u = wall(im, s.A, s.B, hW, { ...(o.wall || {}), u0: u, stretch, mitte: s.M });
    });
  }
  const aussenKanten = (fs, istInnen, nur) => { const out = []; for (const [c, r] of fs) for (let e = 0; e < 6; e++) { if (nur && !nur.includes(e)) continue; const [nc, nr] = nbE(c, r, e); if (!istInnen(nc, nr)) out.push({ c, r, e }); } return out; };

  // ---------- Große Gebäude über mehrere Felder (IDEEN.md „große Gebäude“, Sankt Ruß 2026-11-19) ----------
  for (const b of cfg.bauten || []) {
    const alle = [...b.felder, ...(b.turm ? [b.turm] : [])], drin = (c, r) => alle.some(f => f[0] === c && f[1] === r);
    const ostFeld = b.felder.reduce((a, f) => f[0] > a[0] ? f : a, b.felder[0]);
    if (!b.kaputt) {
      // Schiff: Außenkanten hinten hohe Kirchenmauer (Fenster, Strebepfeiler), vorn niedriger Mauerrest; zum Turm hin offen
      mauerzug(aussenKanten(b.felder, drin, [3, 4, 5]), IM.kirche_hinten, 1.6 * SH, { passend: true, k: 0.98, wall: { shade: 0.5, shadeW: 0.16 } });
      mauerzug(aussenKanten(b.felder, drin, [0, 1, 2]), IM.kirche_vorn, 0.5 * SH, { k: 0.96, seed: 11, wall: { shade: 0.45 } });
      for (const [c, r] of b.felder) { const [hx, hy] = hexC(c, r), q = k => hrnd(c, r, k + 300);
        stand(IM.kirche_innen_4, ...corner(c, r, q(1) < 0.5 ? 4 : 5, 0.62), px(IM.kirche_innen_4, 0.85), { flip: q(2) < 0.5 });   // Säulenstumpf hinten
        stand(IM.kirche_innen_1, hx + (q(3) - 0.5) * R * 0.15, hy + R * 0.02, px(IM.kirche_innen_1, 0.8), { flip: q(4) < 0.5 });   // umgestürzte Bänke in der Mitte
        if (c === ostFeld[0] && r === ostFeld[1]) stand(IM.kirche_innen_2, hx + R * 0.48, hy - R * 0.42, px(IM.kirche_innen_2, 0.85), { flip: true });   // Altar im Osten
      }
      if (b.turm) { const [tx, ty] = hexC(...b.turm);
        stand(IM.kirchturm_1, tx, ty - R * 0.42, px(IM.kirchturm_1), { shadeK: 0.32 });   // Turm hinten im Feld, Einheiten stehen davor
        stand(TRUEMMER[0], tx - R * 0.6, ty + R * 0.12, 0.45 * SH, { flip: true }); }
    } else {
      // eingestürzt: ringsum nur noch niedrige Mauerreste, Trümmerhaufen, Säulenstümpfe; Turmstumpf mit Schutt, die Glocke liegt davor
      mauerzug(aussenKanten(alle, drin), IM.kirche_vorn, 0.5 * SH, { k: 0.97, seed: 13, wall: { shade: 0.45, filter: 'brightness(0.85)' } });
      for (const [c, r] of b.felder) { const [hx, hy] = hexC(c, r), q = k => hrnd(c, r, k + 320);
        stand(TRUEMMER[Math.floor(q(1) * TRUEMMER.length)], hx + (q(2) - 0.5) * R * 0.3, hy - R * 0.05, 0.6 * SH * (0.85 + q(3) * 0.3), { flip: q(4) < 0.5 });
        stand(IM.kirche_innen_4, ...corner(c, r, q(5) < 0.5 ? 4 : 5, 0.62), px(IM.kirche_innen_4, 0.7), { flip: q(6) < 0.5 });
        stand(TRUEMMER[Math.floor(q(7) * TRUEMMER.length)], ...corner(c, r, q(8) < 0.5 ? 3 : 0, 0.6), 0.5 * SH, { flip: q(9) < 0.5 });
        if (c === ostFeld[0] && r === ostFeld[1]) stand(IM.kirche_innen_2, hx + R * 0.48, hy - R * 0.42, px(IM.kirche_innen_2, 0.8), { flip: true });
      }
      if (b.turm) { const [tx, ty] = hexC(...b.turm);
        stand(IM.kirchturm_2, tx, ty - R * 0.4, px(IM.kirchturm_2), { shadeK: 0.32 });
        stand(IM.kirche_innen_3, tx + R * 0.5, ty + R * 0.12, px(IM.kirche_innen_3, 0.85), { flip: true }); }
    }
  }
  // Friedhofsmauer (außen um alle Friedhofsfelder, nicht an Gebäuden) und Gartenmauern (hinten, oft eine Seite dazu)
  mauerzug(aussenKanten(felder((t, c, r) => inMap(c, r) && t === 'friedhof'), (c, r) => terr(c, r) === 'friedhof' || BAUFELD.has(c + ',' + r)), IM.mauer_niedrig, 0.5 * SH, { k: 0.97, seed: 17, wall: { shade: 0.45 } });
  // Gärten: hinten (Kanten 3–5) je Garten entweder zerschossener Zaun (1 SH, Latten durchsichtig, nur hinten erlaubt) oder Bruchsteinmauer, vorn nur die Mauer
  { const mauer = [], zaun = []; for (const [c, r] of felder((t, c, r) => inMap(c, r) && t === 'garten')) {
      const mitZaun = !!IM.zaun && (WI || hrnd(c, r, 252) < 0.55);   // Winter: Koppelzaun um die Äcker
      for (const e of [4, hrnd(c, r, 250) < 0.5 ? 3 : 5, ...(hrnd(c, r, 251) < 0.35 ? [1] : [])]) { const [nc, nr] = nbE(c, r, e); if (terr(nc, nr) === 'garten' || BAUFELD.has(nc + ',' + nr) || terr(nc, nr) === 'friedhof') continue;
        (e >= 3 && mitZaun ? zaun : WI ? [] : mauer).push({ c, r, e }); } }
    mauerzug(mauer, IM.mauer_niedrig, 0.45 * SH, { k: 0.9, seed: 19, wall: { shade: 0.45 } });
    mauerzug(zaun, IM.zaun, (WI ? 0.7 : 1.0) * SH, { k: 0.9, seed: 23, wall: { shade: 0.35, shadeW: 0.1 } }); }

  // Schanze (cfg.schanzen: Feldkoordinaten [c, r]): Bunker hinter dem Graben auf der eigenen Seite, davor und daneben Sandsack-Barrikaden.
  // Ersetzt die Festungsteile (zu hoch, Zinnen wirken mittelalterlich – 2026-11-16).
  for (const [c, r] of cfg.schanzen || []) {
    const [hx, hy] = hexC(c, r), q = k => hrnd(c, r, k + 100), own = cfg.grabenSeite ? cfg.grabenSeite(c, r) : 'D', ex = own === 'A' ? -1 : 1;   // eigene Seite = hinter dem Graben
    const bx = hx + ex * R * 0.8, by = hy - R * 0.12;
    stand(BUNKER[0], bx, by, 0.95 * SH, { flip: ex < 0, shadeK: 0.45 });
    // Sandsackwall als Haken um den Bunker: vorn quer, an der Außenseite schräg nach hinten (kurze Stücke, keine frei stehenden Blöcke)
    const P0 = [bx + ex * R * 0.02, by + R * 0.34], P1 = [bx + ex * R * 0.5, by + R * 0.3], P2 = [bx + ex * R * 0.92, by + R * 0.02];
    const u1 = wall(IM.barrikade, P0, P1, 0.36 * SH, { u0: q(1) * 3, shade: 0.45, mitte: [bx, by] });
    wall(IM.barrikade, P1, P2, 0.36 * SH, { u0: u1, shade: 0.45, mitte: [bx, by] });
  }
  // Festung (Vorschlag, cfg.festung, nur Testseite): Teile an Feldkoordinaten { k: 1–9, c, r, dx, dy (in R), h (SH), flip }
  // 1 Mauer mit Zinnen, 2 Ecke, 3 Mauer glatt, 4 Tor klein, 5 Tor groß, 6 Tor zerstört, 7 Bunker heil, 8 Bunker zerstört, 9 Turm
  for (const f of cfg.festung || []) { const [x, y] = atW(f.c, f.r); stand(IM['festung_' + f.k], x + (f.dx || 0) * R, y + (f.dy || 0) * R, (f.h || 1.4) * SH, { flip: !!f.flip, shadeK: 0.5 }); }
  // Waldrand mit Kronen hinter der Karte (Platzhalter, bis A7 geliefert ist)
  if (cfg.edgeCrowns) { const im = cfg.edgeCrowns; for (let x = R * 0.2; x < WW; x += R * (0.8 + rnd() * 0.5)) { const y = TOP - R * (0.3 + rnd() * 0.8); if (cfg.edgeCrownsX && x > cfg.edgeCrownsX) break; stand(im, x, y, 2.6 * SH * (0.85 + rnd() * 0.3), { flip: rnd() < 0.5, shadeK: 0.35 }); } }

  // Schatten der Teile ins Weltbild, dann Raster und abgedunkelter Kartenrand
  for (const s of SHADOW) s();
  if (cfg.raster !== false) {
    w.lineWidth = R * 0.012; w.strokeStyle = 'rgba(240,237,225,0.09)';   // dezent: auf dem ruhigen Boden fällt das Raster sonst stark auf
    for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) { w.beginPath(); for (let i = 0; i <= 6; i++) { const p = corner(c, r, i); i ? w.lineTo(p[0], p[1]) : w.moveTo(p[0], p[1]); } w.stroke(); }
  }
  if (MX > 0) { w.save(); w.fillStyle = 'rgba(10,7,5,0.32)'; w.beginPath(); w.rect(0, 0, WW, WH);
    const out = []; for (let c = 0; c < COLS; c++) { const p4 = corner(c, 0, 4), p5 = corner(c, 0, 5); out.push(p4, p5); }
    for (let c = COLS - 1; c >= 0; c--) { const p1 = corner(c, ROWS - 1, 1), p2 = corner(c, ROWS - 1, 2); out.push(p1, p2); }
    w.moveTo(corner(0, 0, 3)[0], corner(0, 0, 3)[1]); for (const p of out) w.lineTo(p[0], p[1]); w.lineTo(corner(0, ROWS - 1, 3)[0], corner(0, ROWS - 1, 3)[1]); w.closePath();
    w.fill('evenodd'); w.restore(); }
  if (cfg.punkte) { w.fillStyle = '#E2B04A'; for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) for (let i = 0; i < 6; i++) { const p = corner(c, r, i), mm = edgeMid(c, r, i); w.fillRect(p[0] - 3, p[1] - 3, 6, 6); w.beginPath(); w.arc(mm[0], mm[1], 3, 0, 7); w.fill(); } }
  DRAW.sort((a, b) => a.y - b.y);

  // Wie stehen Trupps im Feld? Graben: vier Weltpunkte auf der Grabenlinie, entlang ihrer Richtung, Absenkung 0,32 SH. Ruine: Tiefe × 0,85.
  function platz(c, r) {
    const t = terr(c, r), [hx, hy] = hexC(c, r);
    if (t === 'trench' && TR.length) {
      let best = null; for (const p of TR) p.forEach((pt, i) => { const d = Math.hypot(pt[0] - hx, pt[1] - hy); if (!best || d < best.d) best = { d, p, i }; });
      if (!best || best.d > R * 0.9) return null;
      // entlang des Zugs (auch durch die Zickzack-Knicke) hintereinander, leicht versetzt; seitlich höchstens 0,06 R: alle Füße in der Sohle (0,4 R breit)
      const p = best.p, arc = [0]; for (let i = 1; i < p.length; i++) arc.push(arc[i - 1] + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]));
      const at = sx => { sx = Math.max(0, Math.min(arc[arc.length - 1], sx)); let i = 1; while (i < arc.length - 1 && arc[i] < sx) i++;
        const t = (sx - arc[i - 1]) / ((arc[i] - arc[i - 1]) || 1), dx = p[i][0] - p[i - 1][0], dy = p[i][1] - p[i - 1][1], l = Math.hypot(dx, dy) || 1;
        return [p[i - 1][0] + dx * t, p[i - 1][1] + dy * t, dx / l, dy / l]; };
      return { pts: [-0.6, -0.2, 0.2, 0.6].map((o, i) => { const [x, y, dx, dy] = at(arc[best.i] + o * R), q = (i % 2 ? 0.07 : -0.07) * R; return [x - dy * q, y + dx * q]; }), sink: 0.32, cut: EINSINK };
    }
    if (t === 'village' || BAUFELD.has(c + ',' + r)) return { sy: 0.85 };
    if (t === 'steinbruecke' && WI) return { sy: 0.35 };   // Trupp eng auf der Fahrbahn (sonst steht die vordere Figur unter dem Bogen)
    return null;
  }
  FELD = null; BAUMFELD = null;
  // Draht eines Felds entfernen, ohne die Welt neu aufzubauen (Drahtschneiden, Niederwalzen, Zerschießen): nur die aufrechten Drahtstücke fallen weg,
  // der weiche Schatten am Boden bleibt als zertretene Stelle. Der volle Neuaufbau dauert 0,4–0,6 s und ließ das Spiel stocken (F12, 2026-11-20).
  function drahtWeg(c, r) { const k = c + ',' + r; for (let i = DRAW.length - 1; i >= 0; i--) if (DRAW[i].feld === k) DRAW.splice(i, 1); DRAHTFELD.delete(k); }
  // Einzelfeld ohne Neuaufbau (2026-11-22): flache Details eines Felds nachzeichnen (z. B. neuer Trichter) – ins Weltbild oder in ein anderes Ziel (gefiltertes Bodenbild)
  function flachNeu(c, r, ziel) { FZ = ziel || null; try { flachDetail(c, r); } finally { FZ = null; } }
  // aufrechte Teile eines Felds herausnehmen (zerstörte Barrikade, Bunker, Draht); Schatten im Boden bleiben schwach stehen
  function feldWeg(c, r) { const k = c + ',' + r; for (let i = DRAW.length - 1; i >= 0; i--) if (DRAW[i].feld === k) DRAW.splice(i, 1); DRAHTFELD.delete(k); }
  // aufrechte Teile eines Felds neu aufbauen (Krähenfurt: Haus/Kapelle eingestürzt → Ruine), ohne die ganze Welt neu zu bauen; Bodenschatten bleiben
  function feldNeu(c, r) { feldWeg(c, r); try { feldTeile(c, r); } finally { FELD = null; BAUMFELD = null; } DRAW.sort((a, b) => a.y - b.y); }
  return { ground: WCV, pieces: DRAW, platz, hexC, R, SH, WW, WH, TR, terr, drahtFelder: DRAHTFELD, drahtWeg, flachNeu, feldWeg, feldNeu, UFER,
    setView(v) { g = v.g; proj = v.proj; F = v.F; U = v.U || 1; UNITS = v.units || []; } };
}

// ---------- Testseiten: alles in einem ----------
async function bauen(cfg) {
  const cv = cfg.canvas, g = cv.getContext('2d');
  const W = cv.width = Math.round(innerWidth * devicePixelRatio), H = cv.height = Math.round(innerHeight * devicePixelRatio), U = W / 1920;
  const IM = await bilder(cfg.bild || (n => `gelaende/g_${n}.webp`));
  const FIG = {}; for (const s of ['konkordat', 'aschenwacht']) FIG[s] = await Promise.all([1, 2, 3, 4].map(i => load(`gelaende/fig_${s}_soldat_${i}.webp`)));
  const B = aufbauen(cfg, IM), { R, SH, hexC } = B, WCV = B.ground, w = WCV.getContext('2d'), COLS = cfg.cols, ROWS = cfg.rows;
  const TOP = hexC(0, 0)[1] - R * SQ3 * 0.5;

  // Kamera (wie im Spiel: 39°, beim Herauszoomen steiler)
  let ZOOM = cfg.zoom || 1, TGT;
  const cam = () => {
    const pitch = (39 + 19 * Math.max(0, Math.min(1, (1 - ZOOM) / 0.65))) * Math.PI / 180, ca = Math.cos(pitch), sa = Math.sin(pitch), RC = 23 * R;
    const Fo = W * RC / ((8.5 / ZOOM) * 1.5 * R);
    return { F: Fo, C: [TGT[0], TGT[1] + RC * ca, RC * sa], f: [-ca, -sa], up: [-sa, ca] };
  };
  let K;
  const proj = (x, y, z = 0) => { const dy = y - K.C[1], dz = z - K.C[2], zc = dy * K.f[0] + dz * K.f[1]; return [W / 2 + K.F * (x - K.C[0]) / zc, H / 2 - K.F * (dy * K.up[0] + dz * K.up[1]) / zc, zc]; };
  const unprojY = sy => { const k = -(sy - H / 2) / K.F, dy = K.f[0] + k * K.up[0], dz = K.f[1] + k * K.up[1]; if (dz >= -1e-6) return null; return K.C[1] - K.C[2] / dz * dy; };
  const atW = (c, r) => [hexC(0, 0)[0] + R * 1.5 * c, TOP + R * SQ3 * (r + 0.5 * (Math.round(c) & 1) + 0.5)];
  const x0 = hexC(0, 0)[0] - R, x1 = hexC(COLS - 1, 0)[0] + R, y0 = TOP, y1 = hexC(0, ROWS - 1)[1] + R * SQ3 * 0.5 + R * 0.4;
  if (cfg.ganz) {   // größter Zoom, bei dem alle vier Kartenecken ins Bild passen (wie „ganze Karte“ im Spiel)
    TGT = [(x0 + x1) / 2, (y0 + y1) / 2];
    const fits = z => { ZOOM = z; K = cam(); return [[x0, y0], [x1, y0], [x0, y1], [x1, y1]].every(([x, y]) => { const p = proj(x, y); return p[2] > 0 && p[0] >= -2 && p[0] <= W + 2 && p[1] >= H * 0.05 && p[1] <= H + 2; }); };
    let lo = 0.08, hi = 1; for (let i = 0; i < 40; i++) { const md = (lo + hi) / 2; if (fits(md)) lo = md; else hi = md; } ZOOM = lo;
    K = cam(); const off = (H * 0.985 - proj(x0, y1)[1]); if (off > 0) { for (let i = 0; i < 30; i++) { TGT[1] -= R * 0.1; K = cam(); if (proj(x0, y1)[1] >= H * 0.985 || proj(x0, y0)[1] < H * 0.04) { TGT[1] += R * 0.1; break; } } }
  } else TGT = cfg.ziel ? atW(...cfg.ziel) : hexC(COLS / 2, ROWS / 2);
  K = cam();

  // Trupps
  const SLOTS4 = [[-0.36, -0.26], [0.3, -0.34], [-0.24, 0.3], [0.36, 0.22]];
  const NAMES = [], UNITS = [], OWN = [];
  for (const tp of cfg.trupps || []) {
    const { side, c, r } = tp, ims = side === 'A' ? FIG.konkordat : FIG.aschenwacht, flip = side === 'D', [hx, hy] = hexC(c, r);
    { // Standring: nah dezent; herausgezoomt kräftiger und etwas größer, damit man die Trupps findet
      const sc = K.F / proj(hx, hy)[2], fern = Math.max(0, Math.min(1, (130 * U - R * sc) / (70 * U)));   // 0 = nah (Feldradius ≥ 130 px), 1 = weit (≤ 60 px)
      const lw = Math.max(R * 0.03, (2.2 + 2.3 * fern) * U / sc), rr = 1 + 0.1 * fern, col = side === 'A' ? [196, 62, 46] : [178, 188, 160];
      w.save();
      if (fern > 0) { w.lineWidth = lw * 2.2; w.strokeStyle = `rgba(10,7,5,${0.55 * fern})`; w.beginPath(); w.ellipse(hx, hy + R * 0.02, R * 0.78 * rr, R * 0.7 * rr, 0, 0, 7); w.stroke(); }
      w.lineWidth = lw; w.strokeStyle = fern > 0 ? `rgba(${col},${0.85 + 0.15 * fern})` : (side === 'A' ? 'rgba(142,43,34,0.85)' : 'rgba(125,132,113,0.9)');
      w.beginPath(); w.ellipse(hx, hy + R * 0.02, R * 0.78 * rr, R * 0.7 * rr, 0, 0, 7); w.stroke(); w.restore();
    }
    const pl = B.platz(c, r);
    const pos = pl && pl.pts ? pl.pts : SLOTS4.map(([ox, oy]) => [hx + ox * R * (flip ? -1 : 1), hy + oy * R * (pl && pl.sy || 1)]);
    const sink = pl && pl.sink || 0;
    pos.forEach(([x, y], i) => {
      const im = ims[(i + c + r) % 4], back = y < hy - R * 0.1;
      OWN.push({ y, f: () => {
        const [px, py, zc] = proj(x, y); if (zc <= 1) return;
        const sc = K.F / zc, h = im.height / 320 * SH * sc, wd = h * im.width / im.height, sk = sink * SH * sc;
        g.save(); g.fillStyle = 'rgba(6,4,3,0.5)'; g.beginPath(); g.ellipse(px, py, wd * 0.3, wd * 0.08, 0, 0, 7); g.fill(); g.restore();
        g.save(); g.translate(px, py); if (flip) g.scale(-1, 1); if (back) g.filter = 'brightness(0.88)';
        if (pl && pl.cut) { const e = eingesunken(im, pl.cut), hh = h * e.frac; g.drawImage(e.cv, -wd / 2, -hh + h * 0.02, wd, hh); }   // im Graben: nur Oberkörper ragt heraus
        else g.drawImage(im, -wd / 2, -h, wd, h);
        g.restore();
      } });
    });
    UNITS.push([hx, hy]); NAMES.push([hx, hy, tp.name]);
  }

  // Zeichnen
  const sky = g.createLinearGradient(0, 0, 0, H * 0.55); sky.addColorStop(0, '#0d0907'); sky.addColorStop(0.6, '#241a14'); sky.addColorStop(1, '#3a2a1e'); g.fillStyle = sky; g.fillRect(0, 0, W, H);
  for (let ys = 0; ys < H; ys++) {
    const wy = unprojY(ys + 0.5); if (wy == null || wy < 0 || wy > B.WH) continue;
    const zc = (wy - K.C[1]) * K.f[0] + (0 - K.C[2]) * K.f[1], sw = W * zc / K.F;
    g.drawImage(WCV, K.C[0] - sw / 2, wy, sw, 1, 0, ys, W, 1);
  }
  B.setView({ g, proj, F: K.F, U, units: UNITS });
  [...B.pieces, ...OWN].sort((a, b) => a.y - b.y).forEach(d => d.f());
  const fog = g.createLinearGradient(0, 0, 0, H); fog.addColorStop(0, 'rgba(18,13,11,0.55)'); fog.addColorStop(0.4, 'rgba(18,13,11,0.12)'); fog.addColorStop(1, 'rgba(18,13,11,0)'); g.fillStyle = fog; g.fillRect(0, 0, W, H);
  if (cfg.namen) { g.font = `600 ${Math.round(17 * U)}px "Segoe UI", sans-serif`; g.textAlign = 'center';
    for (const [x, y, n] of NAMES) if (n) { const p = proj(x, y + R * 0.95); g.lineWidth = 5 * U; g.strokeStyle = '#120D0B'; g.strokeText(n, p[0], p[1]); g.fillStyle = '#E2B04A'; g.fillText(n, p[0], p[1]); } }
  return { proj, hexC, R };
}
window.GBau = { bilder, aufbauen, bauen, eingesunken, NAMEN };
})();
