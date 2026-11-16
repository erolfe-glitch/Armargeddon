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
// → { ground, pieces, platz(c, r), setView({ g, proj, F, U, units }), hexC, R, SH, WW, WH, TR }
//   pieces: [{ y, f }] nach Tiefe sortiert; f() zeichnet mit den zuletzt per setView gesetzten Werten (proj(x, y) → [sx, sy, Tiefe], F = Brennweite).
//   platz(c, r): wie Trupps im Feld stehen (Graben: Weltpunkte auf der Grabenlinie + Absenkung; Ruine: Tiefe gestaucht) oder null.
// GBau.bauen(cfg)           Testseiten: alles laden, aufbauen, eigene Kamera, Trupps, auf cfg.canvas zeichnen.
(function () {
'use strict';
const load = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; });
const SQ3 = Math.sqrt(3);
const LISTE = {
  tex: ['schlamm', 'gras', 'waldboden', 'truemmer', 'sumpf', 'wasser', 'kopfstein'].map(n => 'boden_' + n),
  flach: [...[1, 2, 3, 4, 5, 6, 7].map(k => 'flach_details_' + k), 'trichter_gross_1'],
  wand: ['graben_sohle', 'graben_kante_vorn', 'graben_kante_hinten', 'ruine_hinten', 'ruine_vorn', 'barrikade', 'wald_unterholz'],
  stand: [...[1, 2, 3, 4].map(k => 'ruine_ecken_' + k), 'bunker_1', 'bunker_2',
    ...['wald_staemme', 'wald_staemme_b'].flatMap(b => [1, 2, 3, 4].map(k => `${b}_${k}`)),
    ...['stuempfe', 'stuempfe_b', 'stuempfe_c'].flatMap(b => [1, 2, 3, 4].map(k => `${b}_${k}`)),
    ...['truemmer', 'truemmer_b', 'truemmer_c', 'truemmer_d'].flatMap(b => [1, 2, 3, 4].map(k => `${b}_${k}`)),
    ...[1, 2, 3, 4].map(k => 'panzersperren_' + k), 'panzersperren_b_4', ...[1, 2, 3, 4].map(k => 'draht_stuecke_' + k)],   // Draht nur noch aus ganzen Stücken (2026-11-16)   // panzersperren_b_1–3 sind gleich wie panzersperren_1–3
};
const NAMEN = [...LISTE.tex, ...LISTE.flach, ...LISTE.wand, ...LISTE.stand];

async function bilder(quelle) {
  const IM = {};
  await Promise.all(NAMEN.map(async n => IM[n] = await load(quelle(n))));
  return IM;
}

// Figur im Graben: der untere Teil (cut = Anteil der Bildhöhe, etwa bis zur Hüfte) fehlt, darüber ein weicher Übergang in die dunkle Grabensohle.
// Zwischengespeichert je Bild; gezeichnet wird das Ergebnis mit seiner Unterkante auf dem Grabenboden.
const EINSINK = 0.44, SUNK = new Map();
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

function aufbauen(cfg, IM) {
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
  const TILE = 2 * R;
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
  schicht('boden_gras', ctx => { for (const [c, r] of felder((t, c, r) => t === 'grass' || ((t === 'open' || t === 'out') && noise(...hexC(c, r)) > 0.15))) jitterHex(ctx, ...hexC(c, r), 1.05); }, 0.22, 0.95, 37);
  schicht('boden_waldboden', ctx => { for (const [c, r] of felder(t => t === 'forest' || t === 'wald')) jitterHex(ctx, ...hexC(c, r), 1.05); }, 0.16, 1, 91);
  schicht('boden_truemmer', ctx => { for (const [c, r] of felder(t => t === 'village' || t === 'rubble' || t === 'barrikade' || t === 'fabrik' || t === 'kirche')) jitterHex(ctx, ...hexC(c, r), 1.0); }, 0.14, 1, 13);
  schicht('boden_sumpf', ctx => { for (const [c, r] of felder(t => t === 'sumpf' || t === 'mud')) jitterHex(ctx, ...hexC(c, r), 0.95); }, 0.2, 0.9, 53);
  // Großflächige Helligkeitsflecken gegen Kachelwiederholung
  for (let i = 0; i < WW * WH / (R * R) * 0.35; i++) { const x = rnd() * WW, y = rnd() * WH, rr = R * (0.8 + rnd() * 1.8), d = rnd() < 0.55;
    const gr = w.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, d ? 'rgba(10,7,5,0.2)' : 'rgba(150,130,100,0.08)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); w.fillStyle = gr; w.fillRect(x - rr, y - rr, rr * 2, rr * 2); }
  // Boden insgesamt aufhellen: die gelieferten Texturen sind sehr dunkel (Helligkeit 0,08–0,17), Figuren sollen sich abheben
  l.globalCompositeOperation = 'source-over'; l.clearRect(0, 0, WW, WH); l.filter = `brightness(${cfg.hell || 1.7}) contrast(${cfg.kontrast || 1.2}) saturate(0.95)`; l.drawImage(WCV, 0, 0); l.filter = 'none';
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
  const ROADS = ketten((c, r) => flags(c, r).road && terr(c, r) !== 'canal').filter(ch => ch.length > 1).map(ch => chaikin(verlaengern(ch).pts, 2));
  if (ROADS.length) { w.save(); w.filter = `blur(${R * 0.06}px)`; w.strokeStyle = 'rgba(30,22,15,0.5)'; strokeLines(w, ROADS, R * 0.78); w.restore(); schicht('boden_kopfstein', ctx => strokeLines(ctx, ROADS, R * 0.62), 0.05, 1, 7, (cfg.hell || 1.7) * 1.05); w.save(); w.globalCompositeOperation = 'soft-light'; w.filter = `blur(${R * 0.05}px)`; w.strokeStyle = 'rgba(255,240,210,0.35)'; strokeLines(w, ROADS, R * 0.5); w.restore(); }
  const RIVERS = ketten((c, r) => flags(c, r).river || ['canal', 'bridge', 'furt'].includes(terr(c, r))).filter(ch => ch.length > 1).map(ch => chaikin(verlaengern(ch).pts, 2));
  if (RIVERS.length) {
    w.save(); w.filter = `blur(${R * 0.08}px)`; w.strokeStyle = 'rgba(28,21,14,0.95)'; strokeLines(w, RIVERS, R * 1.55); w.restore();
    schicht('boden_wasser', ctx => strokeLines(ctx, RIVERS, R * 1.22), 0.03, 1, 0);
  }

  // ---------- 2. Flache Details ----------
  function flach(im, x, y, size, rot, alpha = 1) {   // size: größte Ausdehnung in R
    if (!im) return;
    const k = size * R / Math.max(im.width, im.height);
    w.save(); w.globalAlpha = alpha; w.translate(x, y); w.rotate(rot); w.drawImage(im, -im.width * k / 2, -im.height * k / 2, im.width * k, im.height * k); w.restore();
  }
  const Fd = i => IM['flach_details_' + i];   // 1 Trichter klein, 2 groß, 3 Pfütze, 4 lange Pfütze, 5 Bretter, 6 Laufrost (nur Brücke), 7 Trümmerstreu; 8 Spuren nicht verwendet (wirkt als dunkles Rechteck)
  const jit = (c, r, k, s) => { const [x, y] = hexC(c, r); return [x + (hrnd(c, r, k) - 0.5) * R * s, y + (hrnd(c, r, k + 1) - 0.5) * R * s * 0.9]; };
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) {
    const t = terr(c, r), q = hrnd(c, r, 9);
    if (t === 'crater') { if (q < 0.55) flach(q < 0.28 ? IM.trichter_gross_1 : Fd(2), ...jit(c, r, 1, 0.3), 1.15 + q * 0.3, q * 20); else { flach(Fd(1), ...jit(c, r, 1, 0.9), 0.6, q * 9); flach(Fd(1), ...jit(c, r, 3, 0.9), 0.55, q * 13); } }
    else if (t === 'mud') { flach(Fd(q < 0.5 ? 3 : 4), ...jit(c, r, 1, 0.8), 0.7 + q * 0.4, q * 30); }
    else if (t === 'open' || t === 'grass') { if (q < 0.18) flach(Fd(1), ...jit(c, r, 1, 1), 0.55, q * 40); else if (q < 0.34) flach(Fd(5), ...jit(c, r, 1, 0.8), 0.6, q * 40); else if (q < 0.42) flach(Fd(3), ...jit(c, r, 1, 0.9), 0.5, q * 40); }
    else if (t === 'village' || t === 'rubble') { flach(Fd(7), ...jit(c, r, 1, 0.6), 0.9, q * 30, 0.9); }
    else if (t === 'wire') { if (q < 0.4) flach(Fd(1), ...jit(c, r, 1, 0.9), 0.5, q * 40); }
  }

  // ---------- 3. Aufrechte Teile (gezeichnet erst mit setView) ----------
  const DRAW = [], SHADOW = [];
  const hides = (x, y) => UNITS.some(([hx, hy]) => hy < y - R * 0.2 && y - hy < R * 1.95 && Math.abs(hx - x) < R * 1.0);
  const offscreen = (p, q) => { const W = g.canvas.width, H = g.canvas.height, m = W * 0.15; return (p[0] < -m && q[0] < -m) || (p[0] > W + m && q[0] > W + m) || (p[1] < -m && q[1] < -m) || (p[1] > H + m * 3 && q[1] > H + m * 3); };
  function wall(im, A, B, hW, o = {}) {   // Wandstück: Bild steht über der Bodenlinie A→B, entlang der Linie gekachelt
    if (!im) return o.u0 || 0;
    const len = Math.hypot(B[0] - A[0], B[1] - A[1]), iwW = hW * im.width / im.height * (o.stretch || 1), n = Math.max(1, Math.ceil(len / (R * 0.25)));
    let u = o.u0 || 0;
    for (let i = 0; i < n; i++) {
      const a = [A[0] + (B[0] - A[0]) * i / n, A[1] + (B[1] - A[1]) * i / n], b = [A[0] + (B[0] - A[0]) * (i + 1) / n, A[1] + (B[1] - A[1]) * (i + 1) / n], du = len / n / iwW, u0 = u;
      u += du; const my = (a[1] + b[1]) / 2;
      if (o.skip && o.skip((a[0] + b[0]) / 2, my)) continue;
      DRAW.push({ y: my + (o.bias || 0), f: () => strip(im, a, b, hW, u0, du, o) });
    }
    if (o.shade !== 0) SHADOW.push(() => { w.save(); w.filter = `blur(${R * 0.05}px)`; w.strokeStyle = `rgba(8,6,4,${o.shade ?? 0.5})`; w.lineWidth = R * (o.shadeW || 0.14); w.lineCap = 'round'; w.beginPath(); w.moveTo(A[0], A[1] + R * 0.03); w.lineTo(B[0], B[1] + R * 0.03); w.stroke(); w.restore(); });
    return u;
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
      if (hW > 0.6 * SH && hides((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)) g.globalAlpha = 0.45;
      g.drawImage(im, x0 * iw, 0, Math.min(sw + 0.6, iw - x0 * iw), ih, 0, 0, Math.min(sw + 0.6, iw - x0 * iw), ih); g.restore();
    }
    if (cfg.punkte) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.strokeStyle = '#E2B04A'; g.lineWidth = 2 * U; g.beginPath(); g.moveTo(pa[0], pa[1]); g.lineTo(pb[0], pb[1]); g.stroke(); g.restore(); }
  }
  function stand(im, x, y, hW, o = {}) {   // Aufsteller am Fußpunkt (x, y), Höhe hW
    if (!im) return;
    DRAW.push({ y: y + (o.bias || 0), f: () => {
      const p = proj(x, y), [px, py, zc] = p; if (zc <= 1 || offscreen(p, p)) return;
      const sc = Fk() / zc, h = hW * sc, wd = h * im.width / im.height;
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); if (hW > 0.6 * SH && hides(x, y)) g.globalAlpha = 0.45;
      g.translate(px, py + h * 0.015); if (o.rot) g.rotate(o.rot); if (o.flip) g.scale(-1, 1); if (o.filter) g.filter = o.filter;
      g.drawImage(im, -wd * 0.5, -h, wd, h); g.restore();
      if (cfg.punkte) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#E2B04A'; g.beginPath(); g.arc(px, py, 4 * U, 0, 7); g.fill(); g.restore(); }
    } });
    if (!o.noShadow) SHADOW.push(() => { const rr = hW * im.width / im.height * (o.shadeK || 0.42); const gr = w.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, 'rgba(8,6,4,0.55)'); gr.addColorStop(1, 'rgba(8,6,4,0)'); w.save(); w.translate(x, y); w.scale(1, 0.5); w.translate(-x, -y); w.fillStyle = gr; w.beginPath(); w.arc(x, y, rr, 0, 7); w.fill(); w.restore(); });
  }
  const flipR = (c, r, k) => hrnd(c, r, k) < 0.5;

  // Graben
  // Zickzack wie echte Gräben (Schulterwehren): der Zug wird alle ZZ_STEP neu gesetzt und abwechselnd um ±ZZ_A seitlich versetzt.
  // Nur Darstellung innerhalb der Grabenfelder – die Regeln (welches Feld Graben ist) bleiben gleich.
  const ZZ_A = R * 0.3, ZZ_STEP = R * 0.866, GW = 1.3, GK = 0.5;   // GW: Grabenbreite (Sohlenstreifen) in R, GK: Abstand der Kanten von der Linie in R
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
  const TRENCH = cfg.trench ? cfg.trench.map(z => ({ pts: z.map(p => atW(...p)), ends: [false, false] }))
    : ketten((c, r) => terr(c, r) === 'trench').filter(ch => ch.length > 1).map(ch => { const v = verlaengern(ch); return { ...v, ch, pts: cfg.zickzack ? zickzack(v.pts) : v.pts }; });
  const TR = TRENCH.map(z => chaikin(z.pts, cfg.zickzack && z.ch ? 1 : 3));
  if (TR.length && IM.graben_sohle) {
    const TW = GW * R, SOHLE = IM.graben_sohle;
    w.save(); w.filter = `blur(${R * 0.08}px)`; w.strokeStyle = 'rgba(70,56,40,0.7)'; strokeLines(w, TR, R * (GW + 0.15)); w.restore();
    const sohleAlong = (pts, rows) => {
      const im = SOHLE, ih = im.height, iw = im.width, s = TW / ih, [ya, yb] = rows || [0, ih];
      let u = hrnd(pts.length, 3, 1) * iw;
      for (let i = 0; i < pts.length - 1; i++) {
        const [a, b] = [pts[i], pts[i + 1]], len = Math.hypot(b[0] - a[0], b[1] - a[1]); if (len < 0.01) continue;
        const dx = (b[0] - a[0]) / len, dy = (b[1] - a[1]) / len, nx = -dy, ny = dx;
        let done = 0;
        while (done < len - 1e-6) {
          const sx = u % iw, seg = Math.min(len - done, (iw - sx) * s), sw = seg / s, cw = Math.min(sw + 1.5, iw - sx);
          w.setTransform(dx * s, dy * s, nx * s, ny * s, a[0] + dx * done - nx * TW / 2, a[1] + dy * done - ny * TW / 2);
          w.drawImage(im, sx, ya, cw, yb - ya, 0, ya, cw, yb - ya);
          done += seg; u += sw;
        }
      }
      w.setTransform(1, 0, 0, 1, 0, 0);
    };
    for (const p of TR) sohleAlong(p);
    for (const p of TR) sohleAlong(p, [SOHLE.height * 0.33, SOHLE.height * 0.67]);
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
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) {
    const t = terr(c, r), [hx, hy] = hexC(c, r), q = k => hrnd(c, r, k);
    if (t === 'village') {   // Ruine zweiteilig: Mauern hinten, Mauerrest vorn (weiter innen), Ecken auf den Stößen
      const k = 0.86, kv = 0.66; let u = q(1) * 3;
      for (const e of [3, 4, 5]) u = wall(IM.ruine_hinten, corner(c, r, e, k), corner(c, r, (e + 1) % 6, k), 1.2 * SH, { u0: u });
      wall(IM.ruine_vorn, corner(c, r, 2, kv), corner(c, r, 1, kv), 0.45 * SH, { u0: q(2) * 3, shade: 0.45, filter: 'brightness(0.85)' });
      const A = corner(c, r, 3, kv), B = corner(c, r, 2, kv); wall(IM.ruine_vorn, A, [A[0] + (B[0] - A[0]) * 0.55, A[1] + (B[1] - A[1]) * 0.55], 0.45 * SH, { u0: q(3) * 3, shade: 0.45, filter: 'brightness(0.85)' });
      const hoch = q(4) < 0.5 ? [IM.ruine_ecken_1, 1.2] : [IM.ruine_ecken_4, 1.4];
      stand(IM.ruine_ecken_2, ...corner(c, r, 3, k), 0.8 * SH, { bias: R * 0.01, flip: flipR(c, r, 5) });
      stand(hoch[0], ...corner(c, r, q(6) < 0.5 ? 4 : 5, k), hoch[1] * SH, { bias: R * 0.01, flip: flipR(c, r, 7), shadeK: 0.3 });
      stand(IM.ruine_ecken_2, ...corner(c, r, 0, k), 0.8 * SH, { flip: !flipR(c, r, 5), bias: R * 0.01 });
      stand(IM.ruine_ecken_3, ...corner(c, r, 1, kv), 0.45 * SH, { flip: flipR(c, r, 8) });
    } else if (t === 'rubble') {   // Trümmerfeld: zwei Haufen und ein niedriger Mauerrest
      stand(TRUEMMER[Math.floor(q(1) * TRUEMMER.length)], ...corner(c, r, 4, 0.55), 0.6 * SH * (0.8 + q(2) * 0.3), { flip: flipR(c, r, 3) });
      stand(TRUEMMER[Math.floor(q(4) * TRUEMMER.length)], ...corner(c, r, 1, 0.6), 0.5 * SH * (0.8 + q(5) * 0.3), { flip: flipR(c, r, 6) });
      wall(IM.ruine_vorn, corner(c, r, 4, 0.8), corner(c, r, 5, 0.8), 0.4 * SH, { u0: q(7) * 3 });   // quer zur Blickrichtung (schräge Kanten wirken als schmale Platte)
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
    } else if (t === 'wire') {   // Drahtfeld: 1–2 ganze Drahtverhau-Stücke (nicht zerschnitten), versetzt und gespiegelt, nach Tiefe mit den Figuren; nichts auf Straßen
      const aufWeg = (x, y) => ROADS.some(rd => distTo([x, y], rd) < R * 0.45);
      const n = q(1) < 0.4 ? 1 : 2, used = [];
      for (let k = 0; k < n; k++) {
        let x = hx + (q(k * 7 + 2) - 0.5) * R * (n === 1 ? 0.5 : 0.8), y = hy + (n === 1 ? (q(k * 7 + 3) - 0.5) * 0.4 : (k ? 0.32 : -0.3) + (q(k * 7 + 3) - 0.5) * 0.16) * R;
        if (aufWeg(x, y)) { const alt = [hx + (x > hx ? -1 : 1) * R * 0.45, y]; if (aufWeg(...alt)) continue; [x, y] = alt; }   // neben die Straße ausweichen
        let i = Math.floor(q(k * 7 + 4) * DRAHT.length); if (used.includes(i)) i = (i + 1) % DRAHT.length; used.push(i);
        stand(DRAHT[i], x, y, 0.8 * SH * (0.85 + q(k * 7 + 5) * 0.25), { flip: flipR(c, r, k * 7 + 6), shadeK: 0.45 });
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
  // Waldrand mit Kronen hinter der Karte (Platzhalter, bis A7 geliefert ist)
  if (cfg.edgeCrowns) { const im = cfg.edgeCrowns; for (let x = R * 0.2; x < WW; x += R * (0.8 + rnd() * 0.5)) { const y = TOP - R * (0.3 + rnd() * 0.8); if (cfg.edgeCrownsX && x > cfg.edgeCrownsX) break; stand(im, x, y, 2.6 * SH * (0.85 + rnd() * 0.3), { flip: rnd() < 0.5, shadeK: 0.35 }); } }

  // Schatten der Teile ins Weltbild, dann Raster und abgedunkelter Kartenrand
  for (const s of SHADOW) s();
  if (cfg.raster !== false) {
    w.lineWidth = R * 0.014; w.strokeStyle = 'rgba(240,237,225,0.15)';
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
    if (t === 'village') return { sy: 0.85 };
    return null;
  }
  return { ground: WCV, pieces: DRAW, platz, hexC, R, SH, WW, WH, TR, terr,
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
