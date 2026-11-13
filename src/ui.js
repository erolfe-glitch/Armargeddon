// ===== ARMARGEDDON OBERFLÄCHE =====
(function () {
'use strict';
const { TYPES, TERRAIN, SIDES, P } = E;
let COLS = E.COLS, ROWS = E.ROWS, OBJECTIVES = E.OBJECTIVES, mapSel = 'grauwall';
function setMap(id) { E.useMap(id); mapSel = E.MAP.id; COLS = E.COLS; ROWS = E.ROWS; OBJECTIVES = E.OBJECTIVES; }
const figOf = T => T.fig || T.cls;
const figU = u => u.limbered ? 'limber' : figOf(TYPES[u.type]);
const SQ3 = Math.sqrt(3);
// Bilder aus dem UI-Bogen als CSS-Variablen (--ui-end, --ui-frame …) und für das Zeichnen (UIM)
const UIM = {};
{ const A = window.UIART || {}; for (const k in A) { document.documentElement.style.setProperty('--ui-' + k, `url("${A[k]}")`); const im = new Image(); im.onload = () => UIM[k] = im; im.src = A[k]; } }
const $ = id => document.getElementById(id);
const fmt = (x, d = 1) => x.toFixed(d).replace('.', ',');
const WIND_DEG = [-30, 30, 90, 150, 210, 270];

// ---------- Zustand ----------
let G = null, mode = 'A', blood = true, speed = 1, busy = false;
let sel = null, reach = new Map(), targets = new Map(), shellHexes = new Set(), artMode = 'he';
let recSet = new Set();
let previewT = null, hoverHex = null, inspect = null, lastPT = 'mouse', placing = null, spawnSet = new Set(), rangeSet = new Set(), hoverU = null, atkPref = 'auto', healSet = new Set(), sendSet = new Set(), sightSet = new Set(), scoutSet = new Set();
const DU = new Map();
const particles = [], floaters = [], decals = [], tracers = [], shells = [], booms = [], flames = [], rings = [], muzzles = [];
let skinA = 'A';
const LEADER = { 'Prätor Hask': 4, 'Hauptfrau Morn': 1, 'Hauptmann Veyl': 1, 'Kastellan Orsk': 4, 'Sturmführer Kael': 3, 'Legat Corvin': 2, 'Major Dresk': 2, 'General': 4, 'Hauptmann': 1 };
function leaderKind(u) { if (!u.officer || (u.side === 'A' && skinA !== 'A')) return null; const k = 'leader' + (LEADER[u.officer] ?? 0), a = FIG.ARTS[k + '_' + u.side]; return a && a.img.complete && a.img.naturalWidth ? k : null; }
let queue = [], qRunning = false;
let L = null, K = 0.62, tcv = null, now = 0, ZOOM = 1;
const human = side => mode === 'hot' || mode === side;

const board = $('board'), cv = $('map'), ctx = cv.getContext('2d');

// ---------- Layout ----------
function layout() {
  const wrap = board.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  const portrait = matchMedia('(orientation: portrait)').matches;
  const MIN_S = 46;   // kleinste Feldgröße in CSS-Pixeln; größere Karten werden dann verschoben (ziehen, Mausrad, Pfeiltasten)
  const cssW = Math.max(wrap.width, portrait ? 760 : 560, MIN_S * (1.5 * COLS + 0.5)) * ZOOM;
  const s = cssW * dpr / (1.5 * COLS + 0.5);
  const mi = mapImg(), top = s * (mi ? 0.9 : 1.55), bot = s * 0.45;
  K = Math.max(0.42, Math.min(0.86, (wrap.height * ZOOM * dpr - top - bot) / (s * SQ3 * (ROWS + 0.5))));
  if (mi) { const mk = imgK(mi); K = Math.min(mk, Math.max(K, mk * 0.8)); }   // gemaltes Kartenbild: höchstens 20 % gestaucht, sonst verschieben
  const H = Math.ceil(top + s * K * SQ3 * (ROWS + 0.5) + bot);
  L = { dpr, s, top, W: Math.round(cssW * dpr), H };
  cv.width = L.W; cv.height = H;
  cv.style.width = cssW + 'px'; cv.style.height = (H / dpr) + 'px';
  renderTerrain();
  for (const u of G.units) { const d = DU.get(u.id); if (d) { const [x, y] = center(u.c, u.r); d.x = x; d.y = y; } }
}
function center(c, r) { return [L.s * (1 + 1.5 * c), L.top + L.s * K * SQ3 * (r + 0.5 * (c & 1) + 0.5)]; }
function pixToHex(x, y) {
  const X = (x - L.s) / L.s, Y = (y - L.top) / (L.s * K) - SQ3 * 0.5;
  const q = 2 / 3 * X, a = -X / 3 + SQ3 / 3 * Y, s = -q - a;
  let rq = Math.round(q), ra = Math.round(a), rs = Math.round(s);
  const dq = Math.abs(rq - q), da = Math.abs(ra - a), ds = Math.abs(rs - s);
  if (dq > da && dq > ds) rq = -ra - rs; else if (da > ds) ra = -rq - rs;
  const c = rq, r = ra + (rq - (rq & 1)) / 2;
  return E.inMap(c, r) ? [c, r] : null;
}
function hexPath(g, c, r, k = 1) {
  const [x, y] = center(c, r);
  g.beginPath();
  for (let i = 0; i < 6; i++) { const a = Math.PI / 3 * i; g.lineTo(x + L.s * k * Math.cos(a), y + L.s * k * Math.sin(a) * K); }
  g.closePath();
}

// ---------- Bilder für Kacheln und Effekte ----------
const TIMG = {}, FXI = {}, PJI = {}, FLI = {};
{ const D = window.FXDATA || { tiles: {}, fx: {} };
  const load = (store, map) => { for (const k in map) { const im = new Image(); im.onload = () => { store[k] = im; if (store === TIMG && L && G) renderTerrain(); }; im.src = map[k]; } };
  load(TIMG, D.tiles); load(FXI, D.fx); load(PJI, D.proj || {}); load(FLI, D.flags || {}); }
const fxw = (im, h) => h * im.naturalWidth / im.naturalHeight;

// ---------- Gelände ----------
const hash = (a, b) => { const n = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453; return n - Math.floor(n); };
const TC = { open: ['#5a5a3a', '#545436', '#5f5e3d'], mud: ['#4c4030', '#473b2c', '#514433'], crater: ['#575638', '#515034', '#5b5a3b'],
  trench: ['#5c593b', '#565337', '#605d3e'], wire: ['#585639', '#525035', '#5c5a3c'], village: ['#66624f', '#605c4a', '#6b6753'],
  forest: ['#42452f', '#3d402b', '#474a32'], canal: ['#34474f', '#30424a', '#384c54'], bridge: ['#34474f', '#30424a', '#384c54'],
  furt: ['#3e5058', '#3a4b52', '#42545c'], sumpf: ['#45482f', '#40432c', '#4a4d33'], wald: ['#2f3a24', '#2b3521', '#334027'], waldweg: ['#4a4a30', '#45452d', '#4f4f34'],
  bunker: ['#5d5c55', '#57564f', '#63625a'], fabrik: ['#5a4a3e', '#55463a', '#5f4e42'], kirche: ['#5e5c55', '#59574f', '#64625a'], barrikade: ['#5a4f3c', '#554a38', '#5f5440'], bahn: ['#55524a', '#504d45', '#5a574f'] };
// Welche gemalte Kachel ein Feld bekommt: Varianten je nach Nachbarschaft und Zufall (fest je Feld)
function tileKey(c, r, h) {
  const t = h.t, n = hash(c * 1.7, r * 9.1), nb = E.neighbors(c, r).map(([a, b]) => G.map[a][b].t);
  const has = k => TIMG[k] ? k : null, wood = nb.some(x => x === 'wald' || x === 'waldweg' || x === 'forest'), wet = nb.some(x => x === 'canal' || x === 'furt' || x === 'sumpf');
  if (t === 'village') { const v = ['village', 'debris', 'village2', 'village3', 'debris2'].filter(k => TIMG[k]); return v[Math.floor(n * v.length)] || 'village'; }
  if (t === 'forest') return n < 0.5 && has('forest2') || 'forest';
  if (t === 'trench') return (wood && has('trenchF')) || (wet && has('trenchW')) || 'trench';
  if (t === 'canal') return (wood && has('canal1')) || has('canal0') || 'canal';
  if (t === 'waldweg') return n < 0.35 && has('lichtung') || 'waldweg';
  return t;
}
const O = '#16150f';
// ---------- Gemalte Karte (Bögen des Nutzers im Ordner Map) ----------
// Statt einer Kachel je Feld: ein durchgehender Boden, weiche Flächen für Wald, Ort und Sumpf,
// Fluss, Gräben, Wege und Bahn als durchgehende Linien von Feld zu Feld, Gebäude und Bäume als Bilder darauf.
const MIMG = {}, BASE = {};
{ const D = (window.FXDATA || {}).mapimg || {};
  for (const k in D) { const im = new Image(); im.onload = () => { MIMG[k] = im; if (L && G && E.MAPS[G.mapId] && E.MAPS[G.mapId].img === k) layout(); }; im.src = D[k]; } }
function mapImg() { const m = G && E.MAPS[G.mapId]; return m && m.img && MIMG[m.img] || null; }
const imgK = im => (1.5 * COLS + 0.5) / (im.naturalWidth / im.naturalHeight * SQ3 * (ROWS + 0.5));
// Gemaltes Kartenbild: Bild unter das Raster, Änderungen im Spiel (Draht gelegt oder geschnitten) darüber zeichnen
function renderImageMap(g, im) {
  const { s } = L, w = s * (1.5 * COLS + 0.5), h = s * K * SQ3 * (ROWS + 0.5);
  g.drawImage(im, 0, L.top, w, h);
  const id = G.mapId, base = BASE[id] || (BASE[id] = E.MAPS[id].build());
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) {
    const t = G.map[c][r].t, b = base[c][r].t, [x, y] = center(c, r);
    if (t === b) continue;
    if (t === 'wire' && PT.spr.wireS) { const ws = s * 2, wh = ws * PT.spr.wireS.naturalHeight / PT.spr.wireS.naturalWidth * 0.8; g.drawImage(PT.spr.wireS, x - ws / 2, y - wh * 0.55, ws, wh); }
    else if (b === 'wire' && PT.tex.mud) {   // Draht geschnitten: Schlamm darüber
      const R = s * 1.05, m = document.createElement('canvas'); m.width = m.height = Math.ceil(R * 2); const mg = m.getContext('2d');
      const gr = mg.createRadialGradient(R, R, 0, R, R, R); gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(0.6, 'rgba(0,0,0,0.95)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      mg.fillStyle = gr; mg.fillRect(0, 0, R * 2, R * 2); mg.globalCompositeOperation = 'source-in'; mg.fillStyle = mg.createPattern(PT.tex.mud, 'repeat'); mg.fillRect(0, 0, R * 2, R * 2);
      g.drawImage(m, x - R, y - R * K, R * 2, R * 2 * K);
    }
  }
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) {
    if (G.map[c][r].t === 'wire') { hexPath(g, c, r, 0.94); g.strokeStyle = 'rgba(205,210,215,0.55)'; g.lineWidth = Math.max(1.5, s * 0.035); g.setLineDash([s * 0.12, s * 0.08]); g.stroke(); g.setLineDash([]); }
    hexPath(g, c, r, 1); g.strokeStyle = 'rgba(12,10,6,0.22)'; g.lineWidth = Math.max(1, s * 0.016); g.stroke();
  }
}
const PT = { tex: {}, spr: {}, n: 0, need: 0 };
{ const D = (window.FXDATA || {}).paint;
  if (D) for (const grp of ['tex', 'spr']) for (const k in D[grp]) {
    PT.need++; const im = new Image();
    im.onload = () => { PT[grp][k] = im; PT.n++; if (PT.n === PT.need && L && G) renderTerrain(); };
    im.src = D[grp][k];
  } }
const paintReady = () => PT.need > 0 && PT.n === PT.need;
const WATER = new Set(['canal', 'bridge', 'furt']), TOWN = new Set(['village', 'kirche', 'fabrik', 'barrikade', 'bahn']);
function renderPainted(g) {
  const { s, W, H } = L, x0 = 0, y0 = L.top - s * K * 1.2;
  const pat = (k, sc = 1) => { const p = g.createPattern(PT.tex[k], 'repeat'); const f = s * 1.9 / 324 * sc; p.setTransform(new DOMMatrix([f, 0, 0, f * 0.92, 0, 0])); return p; };
  const T = (c, r) => E.inMap(c, r) ? G.map[c][r].t : null;
  // 1) Boden: Gras, darüber Schlamm, wo gekämpft wird
  g.save(); g.beginPath(); g.rect(x0, y0, W, H - y0); g.clip();
  g.fillStyle = pat('grass'); g.fillRect(x0, y0, W, H - y0);
  const layer = (tex, wf, rad = 1.25, sc = 1) => {
    const m = document.createElement('canvas'); m.width = W; m.height = H; const mg = m.getContext('2d');
    for (let c = -1; c <= COLS; c++) for (let r = -1; r <= ROWS; r++) {
      const cc = Math.max(0, Math.min(COLS - 1, c)), rr = Math.max(0, Math.min(ROWS - 1, r));
      const w = wf(G.map[cc][rr], cc, rr); if (w <= 0) continue;
      const [x, y] = center(c, r), R = s * rad * (0.9 + hash(c * 2.3, r * 5.1) * 0.25);
      mg.save(); mg.translate(x, y); mg.scale(1, K * 0.95);
      const gr = mg.createRadialGradient(0, 0, 0, 0, 0, R);
      gr.addColorStop(0, `rgba(0,0,0,${w})`); gr.addColorStop(0.55, `rgba(0,0,0,${w * 0.85})`); gr.addColorStop(1, 'rgba(0,0,0,0)');
      mg.fillStyle = gr; mg.fillRect(-R, -R, R * 2, R * 2); mg.restore();
    }
    mg.globalCompositeOperation = 'source-in'; mg.fillStyle = pat(tex, sc); mg.fillRect(0, 0, W, H);
    g.drawImage(m, 0, 0);
  };
  const mid = c => { const f = c / Math.max(1, COLS - 1); return Math.max(0, 1 - Math.abs(f - 0.5) * 2.2); };   // Niemandsland in der Mitte
  layer('mud', (h, c, r) => ({ mud: 1, crater: 1, wire: 0.95, trench: 0.9, bunker: 0.8, barrikade: 0.6, furt: 0.5 })[h.t] ?? (h.t === 'open' ? 0.25 + mid(c) * 0.6 + (hash(c * 4.1, r * 1.3) > 0.7 ? 0.2 : 0) : 0));
  layer('forestfloor', h => ({ wald: 1, forest: 0.8, waldweg: 0.95 })[h.t] || 0, 1.15);
  layer('rubble', h => TOWN.has(h.t) && h.t !== 'bahn' ? 1 : 0, 1.05);
  layer('swamp', h => h.t === 'sumpf' ? 1 : 0, 1.15);
  // Höhen: heller, mit feinen Schraffen
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) if (G.map[c][r].ridge) {
    const [x, y] = center(c, r); g.save(); g.translate(x, y); g.scale(1, K);
    const gr = g.createRadialGradient(0, 0, 0, 0, 0, s * 1.1); gr.addColorStop(0, 'rgba(235,215,160,0.16)'); gr.addColorStop(1, 'rgba(235,215,160,0)');
    g.fillStyle = gr; g.fillRect(-s * 1.1, -s * 1.1, s * 2.2, s * 2.2); g.restore();
  }
  // kleine Trichter und Pfützen im Schlamm
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) {
    const h = G.map[c][r]; if (!(h.t === 'mud' || h.t === 'open' && mid(c) > 0.4)) continue;
    const n = hash(c * 7.7, r * 3.3); if (n < 0.45) continue;
    const [x, y] = center(c, r), px = x + (n - 0.7) * s * 1.2, py = y + (hash(c, r * 2) - 0.5) * s * K, rr = s * (0.12 + n * 0.12);
    g.fillStyle = 'rgba(30,22,12,0.45)'; g.beginPath(); g.ellipse(px, py, rr * 1.25, rr * K * 1.1, 0, 0, 7); g.fill();
    g.fillStyle = 'rgba(70,88,90,0.55)'; g.beginPath(); g.ellipse(px + rr * 0.1, py + rr * K * 0.15, rr * 0.8, rr * K * 0.6, 0, 0, 7); g.fill();
  }
  // 2) Linien: Wege durch Feld zu Feld (Mittelpunkt zu Mittelpunkt, weich gebogen); am Kartenrand laufen sie hinaus
  // wave(l, L): Versatz quer zur Linie (0 an beiden Enden, damit die Stücke nahtlos aneinander passen)
  const linePath = (inSet, joinSet = inSet, wave = null) => {
    const P = new Path2D();
    let hc = 0, hr = 0;
    const emit = pts => {   // Punktfolge mit Querversatz
      let L = 0; const acc = [0]; for (let i = 1; i < pts.length; i++) { L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); acc.push(L); }
      for (let i = 0; i < pts.length; i++) {
        let [x, y] = pts[i];
        if (wave && L > 0) { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, o = wave(acc[i], L, hc, hr); x += -dy / l * o; y += dx / l * o; }
        i ? P.lineTo(x, y) : P.moveTo(x, y);
      }
    };
    const quad = (a, cx, cy, b) => { const out = []; for (let k = 0; k <= 12; k++) { const t = k / 12, u = 1 - t; out.push([u * u * a[0] + 2 * u * t * cx + t * t * b[0], u * u * a[1] + 2 * u * t * cy + t * t * b[1]]); } return out; };
    const seg = (a, b) => { const out = []; for (let k = 0; k <= 8; k++) { const t = k / 8; out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); } return out; };
    for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) {
      if (!inSet(G.map[c][r], c, r)) continue;
      hc = c; hr = r;
      const [x, y] = center(c, r), pts = [];
      for (const [a, b] of E.neighbors(c, r)) if (joinSet(G.map[a][b], a, b)) { const [ex, ey] = center(a, b); pts.push([(x + ex) / 2, (y + ey) / 2]); }
      if (pts.length <= 1) {   // Ende am Rand: hinaus verlängern
        const out = [];
        if (c === 0) out.push([x - s * 1.6, y]); if (c === COLS - 1) out.push([x + s * 1.6, y]);
        if (r === 0) out.push([x, y - s * K * 1.8]); if (r === ROWS - 1) out.push([x, y + s * K * 1.8]);
        if (out.length && pts.length) { const [px, py] = pts[0]; out.sort((p, q) => Math.hypot(q[0] - px, q[1] - py) - Math.hypot(p[0] - px, p[1] - py)); }
        if (out.length) pts.push(out[0]);
      }
      if (!pts.length) { emit(seg([x - s * 0.3, y], [x + s * 0.3, y])); continue; }
      if (pts.length === 1) { emit(seg([x, y], pts[0])); continue; }
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) emit(quad(pts[i], x, y, pts[j]));
    }
    return P;
  };
  // Zickzack der Gräben (Schulterwehren) und sanfte Windungen des Flusses
  const zig = (l, L, c, r) => s * 0.16 * ((c + r) & 1 ? 1 : -1) * Math.min(1, 2.2 * Math.sin(Math.PI * l / L));
  const meander = (l, L) => s * 0.09 * Math.sin(Math.PI * l / L) * (hash(Math.round(L), 3) > 0.5 ? 1 : -1);
  const stroke = (P, style, w, dash) => { g.strokeStyle = style; g.lineWidth = w; g.setLineDash(dash || []); g.stroke(P); g.setLineDash([]); };
  g.lineCap = 'round'; g.lineJoin = 'round';
  // Fluss und Kanal
  const isW = h => WATER.has(h.t);
  if ([...Array(COLS).keys()].some(c => G.map[c].some(isW))) {
    const P = linePath(isW, isW, meander);
    g.lineCap = 'butt';
    stroke(P, 'rgba(22,18,10,0.45)', s * 1.22); stroke(P, '#463d2a', s * 1.04); stroke(P, '#2c3330', s * 0.84);
    stroke(P, pat('water', 0.8), s * 0.74); stroke(P, 'rgba(160,190,195,0.10)', s * 0.5);
    stroke(P, 'rgba(190,215,220,0.22)', s * 0.04, [s * 0.25, s * 0.5]);
    g.lineCap = 'round';
    // Kanalende mitten im Feld: gemauertes Becken mit Schleusentor
    for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) {
      const h = G.map[c][r]; if (!isW(h)) continue;
      const nb = E.neighbors(c, r).filter(([a, b]) => isW(G.map[a][b])); if (nb.length !== 1) continue;
      if (c === 0 || r === 0 || c === COLS - 1 || r === ROWS - 1) continue;
      const [x, y] = center(c, r), [ex, ey] = center(nb[0][0], nb[0][1]), ang = Math.atan2(ey - y, ex - x);
      g.save(); g.translate(x, y); g.rotate(ang);
      g.fillStyle = '#2c3330'; g.fillRect(0, -s * 0.37, s * 0.1, s * 0.74);
      g.fillStyle = '#6e6a60'; g.strokeStyle = O; g.lineWidth = Math.max(1, s * 0.025);
      g.fillRect(-s * 0.12, -s * 0.52, s * 0.14, s * 1.04); g.strokeRect(-s * 0.12, -s * 0.52, s * 0.14, s * 1.04);
      for (let i = -3; i <= 3; i++) { g.beginPath(); g.moveTo(-s * 0.12, i * s * 0.15); g.lineTo(s * 0.02, i * s * 0.15); g.stroke(); }
      g.fillStyle = '#5a4128'; g.fillRect(s * 0.18, -s * 0.37, s * 0.06, s * 0.74); g.strokeRect(s * 0.18, -s * 0.37, s * 0.06, s * 0.74);
      g.restore();
    }
    // Furt: Steine quer, flacheres Wasser
    for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) if (G.map[c][r].t === 'furt') {
      const [x, y] = center(c, r);
      for (let i = 0; i < 9; i++) { const n = hash(c * 3 + i, r * 5 - i), px = x + (i - 4) * s * 0.14, py = y + (n - 0.5) * s * K * 0.7;
        g.fillStyle = '#6e6a5e'; g.strokeStyle = O; g.lineWidth = Math.max(1, s * 0.02); g.beginPath(); g.ellipse(px, py, s * 0.075, s * 0.055, 0, 0, 7); g.fill(); g.stroke(); }
    }
  }
  // Bahn: Schotter, Schwellen, zwei Schienen
  const isB = h => h.t === 'bahn' || h.rail;
  if ([...Array(COLS).keys()].some(c => G.map[c].some(isB))) {
    const P = linePath(isB);
    g.lineCap = 'butt';
    stroke(P, 'rgba(20,18,14,0.5)', s * 0.62); stroke(P, '#6a655c', s * 0.52); stroke(P, '#3b2c1f', s * 0.44, [s * 0.05, s * 0.07]);
    stroke(P, '#8d9294', s * 0.25); stroke(P, '#4f483f', s * 0.19, [s * 0.05, s * 0.07]); g.lineCap = 'round';
  }
  // Wege (Waldweg und Straßen mit h.road): Fahrspuren im Schlamm
  const isR = h => h.t === 'waldweg' || h.road;
  if ([...Array(COLS).keys()].some(c => G.map[c].some(isR))) {
    const P = linePath(isR);
    stroke(P, 'rgba(25,20,12,0.35)', s * 0.42); stroke(P, '#5d4c35', s * 0.34); stroke(P, '#463826', s * 0.24); stroke(P, '#6c5a40', s * 0.16); stroke(P, '#4b3b28', s * 0.1);
  }
  // Gräben: Brustwehr, dunkle Wände, Laufroste; Bunker liegen in der Linie
  const isT = h => h.t === 'trench', joinT = h => h.t === 'trench' || h.t === 'bunker';
  if ([...Array(COLS).keys()].some(c => G.map[c].some(isT))) {
    const P = linePath(isT, joinT, zig);
    g.lineCap = 'butt';
    stroke(P, 'rgba(18,14,8,0.45)', s * 0.82); stroke(P, '#5b4830', s * 0.68); stroke(P, '#7f6d4b', s * 0.56, [s * 0.11, s * 0.025]);
    stroke(P, '#1d160e', s * 0.38); stroke(P, '#2e2418', s * 0.28); stroke(P, '#6b5434', s * 0.12, [s * 0.03, s * 0.05]);
    g.lineCap = 'round';
  }
  g.restore();
  // 3) Bilder: von hinten nach vorn, damit Vordergrund überdeckt
  const S = PT.spr, items = [];
  const put = (k, c, r, wk, dy = 0, flat = false, dx = 0) => { if (S[k]) { const [x, y] = center(c, r); items.push({ k, x: x + dx * s, y: y + dy * s * K, w: s * wk, flat }); } };
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) {
    const t = G.map[c][r].t, n = hash(c * 1.7, r * 9.1);
    if (t === 'bunker') put(['bunker1', 'bunker2', 'bunker3', 'bunker4'][Math.floor(n * 4)], c, r, 2.1, -0.15, true);
    else if (t === 'kirche') put('church', c, r, 2.5, -0.4);
    else if (t === 'fabrik') put('factory', c, r, 2.5, -0.35);
    else if (t === 'barrikade') put('barric', c, r, 2.1, -0.1, true);
    else if (t === 'village') put(['house1', 'house2', 'ruinwall', 'house1', 'house2'][Math.floor(n * 5)], c, r, 2.3, -0.2, true);
    else if (t === 'wald') put(n < 0.5 ? 'treeD' : 'treeK', c, r, 2.35, -0.5);
    else if (t === 'forest') put(n < 0.75 ? 'treeX' : 'treeA', c, r, 2.2, -0.4);
    else if (t === 'crater') put('craterS', c, r, 1.45, 0.05, true);
    else if (t === 'wire') put('wireS', c, r, 2.0, -0.05, true);
    else if (t === 'trench' && n > 0.86 && !E.neighbors(c, r).some(([a, b]) => G.map[a][b].t === 'bunker')) put(n > 0.93 ? 'dugout' : 'mgnest', c, r, 1.3, -0.1, true, (n - 0.9) * 2);
  }
  items.sort((a, b) => a.y - b.y);
  for (const it of items) {
    const im = S[it.k], w = it.w, hgt = w * im.naturalHeight / im.naturalWidth * (it.flat ? Math.max(0.72, Math.min(1, K / 0.6)) : 1);
    g.save(); g.translate(it.x, it.y + hgt * 0.12); g.scale(1, 0.45);
    const sh = g.createRadialGradient(0, 0, 0, 0, 0, w * 0.5); sh.addColorStop(0, 'rgba(10,8,4,0.45)'); sh.addColorStop(1, 'rgba(10,8,4,0)');
    g.fillStyle = sh; g.fillRect(-w / 2, -w / 2, w, w); g.restore();
    g.drawImage(im, it.x - w / 2, it.y - hgt * 0.55, w, hgt);
  }
  // 4) Brücken quer zum Fluss
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) if (G.map[c][r].t === 'bridge') {
    const [x, y] = center(c, r); let dx = 0, dy = 0;
    for (const [a, b] of E.neighbors(c, r)) if (WATER.has(G.map[a][b].t)) { const [ex, ey] = center(a, b); const ux = ex - x, uy = ey - y, l = Math.hypot(ux, uy); if (dx * ux + dy * uy < 0) { dx -= ux / l; dy -= uy / l; } else { dx += ux / l; dy += uy / l; } }
    if (!dx && !dy) dy = 1;
    const ang = Math.atan2(dy, dx) + Math.PI / 2, lw = Math.max(1.2, s * 0.03);
    g.save(); g.translate(x, y); g.rotate(ang);
    g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(-s * 0.95, -s * 0.2, s * 1.9, s * 0.48);
    g.fillStyle = '#5a5248'; g.fillRect(-s * 0.98, -s * 0.3, s * 0.22, s * 0.6); g.fillRect(s * 0.76, -s * 0.3, s * 0.22, s * 0.6);
    g.fillStyle = '#7d5b36'; g.strokeStyle = O; g.lineWidth = lw; g.fillRect(-s * 0.85, -s * 0.24, s * 1.7, s * 0.48); g.strokeRect(-s * 0.85, -s * 0.24, s * 1.7, s * 0.48);
    g.lineWidth = lw * 0.6; for (let i = -7; i <= 7; i++) { g.beginPath(); g.moveTo(i * s * 0.11, -s * 0.24); g.lineTo(i * s * 0.11, s * 0.24); g.stroke(); }
    g.strokeStyle = '#3a2a1a'; g.lineWidth = lw * 1.6; for (const yy of [-0.26, 0.26]) { g.beginPath(); g.moveTo(-s * 0.85, yy * s); g.lineTo(s * 0.85, yy * s); g.stroke(); }
    g.restore();
  }
  // 5) Draht immer deutlich: Rollen und heller Rand
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) if (G.map[c][r].t === 'wire') {
    hexPath(g, c, r, 0.94); g.strokeStyle = 'rgba(205,210,215,0.6)'; g.lineWidth = Math.max(1.5, s * 0.04); g.setLineDash([s * 0.12, s * 0.08]); g.stroke(); g.setLineDash([]);
  }
  // 6) feine Feldlinien, damit man die Felder noch zählen kann
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) { hexPath(g, c, r, 1); g.strokeStyle = 'rgba(12,10,6,0.2)'; g.lineWidth = Math.max(1, s * 0.018); g.stroke(); }
}
function renderTerrain() {
  const { s, W, H, dpr } = L;
  tcv = tcv || document.createElement('canvas'); tcv.width = W; tcv.height = H;
  const g = tcv.getContext('2d');
  g.fillStyle = '#1c1d17'; g.fillRect(0, 0, W, H);
  const sky = g.createLinearGradient(0, 0, 0, L.top * 1.2);
  sky.addColorStop(0, 'rgba(120,22,12,0.78)'); sky.addColorStop(0.55, 'rgba(110,30,14,0.38)'); sky.addColorStop(1, 'rgba(110,30,14,0)');
  g.fillStyle = sky; g.fillRect(0, 0, W, L.top * 1.2);
  const mimg = mapImg();
  if (mimg || paintReady() && !window.NOPAINT) {
    if (mimg) renderImageMap(g, mimg); else renderPainted(g);
    const vg = g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.72);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(6,5,3,0.5)'); g.fillStyle = vg; g.fillRect(0, 0, W, H);
    return;
  }
  g.lineJoin = 'round'; g.lineCap = 'round';
  const lw = Math.max(1.5, s * 0.045), tiled = new Set();
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) {
    const h = G.map[c][r], n = hash(c * 3.1, r * 7.7);
    const tk = tileKey(c, r, h), tim = TIMG[tk]; if (tim) tiled.add(E.key(c, r));
    hexPath(g, c, r, 1.02);
    if (tim) {
      const [hx, hy] = center(c, r), hw = s * 2.06, hh = s * K * SQ3 * 1.04, fl = !['trench', 'trenchF', 'trenchW', 'bridge', 'kirche', 'fabrik', 'bahn'].includes(tk) && n > 0.5;
      g.save(); g.clip(); g.translate(hx, hy); if (fl) g.scale(-1, 1);
      g.drawImage(tim, -hw / 2, -hh / 2, hw, hh); g.restore(); hexPath(g, c, r, 1.02);
    } else { g.fillStyle = TC[h.t][Math.floor(n * 3)]; g.fill(); }
    if (h.ridge) { g.fillStyle = 'rgba(255,226,160,0.12)'; g.fill(); }
  }
  // Gräben: erst Sandsackwall, dann Grabensohle
  for (const pass of TIMG.trench ? [] : [0, 1]) {
    g.strokeStyle = pass ? '#231d15' : '#b39c69'; g.lineWidth = s * (pass ? 0.3 : 0.52);
    for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) if (G.map[c][r].t === 'trench') {
      const [x, y] = center(c, r);
      const nb = E.neighbors(c, r).filter(([nc, nr]) => G.map[nc][nr].t === 'trench');
      if (!nb.length) { g.beginPath(); g.moveTo(x - s * 0.3, y); g.lineTo(x + s * 0.3, y); g.stroke(); }
      for (const [nc, nr] of nb) { const [ex, ey] = center(nc, nr); g.beginPath(); g.moveTo(x, y); g.lineTo((x + ex) / 2, (y + ey) / 2); g.stroke(); }
    }
    if (!pass) {
      g.strokeStyle = 'rgba(22,21,15,0.55)'; g.lineWidth = lw * 0.7;
      for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) if (G.map[c][r].t === 'trench') {
        const [x, y] = center(c, r);
        for (const ox of [-0.24, 0.24]) for (const oy of [-0.5, 0, 0.5]) { g.beginPath(); g.moveTo(x + ox * s - s * 0.05, y + oy * s * K); g.lineTo(x + ox * s + s * 0.05, y + oy * s * K); g.stroke(); }
      }
    }
  }
  // Große weiche Flecken verbinden die Felder zu einem Boden, darüber feine Feldlinien
  { let sd = 99; const rn = () => { sd = (sd * 1664525 + 1013904223) >>> 0; return sd / 4294967296; };
    for (let i = 0; i < 70; i++) {
      const px = rn() * W, py = L.top + rn() * (H - L.top), rad = s * (1.2 + rn() * 2.6);
      const bg = g.createRadialGradient(px, py, 0, px, py, rad), dark = rn() < 0.6;
      bg.addColorStop(0, dark ? 'rgba(30,22,12,0.14)' : 'rgba(150,130,90,0.07)'); bg.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = bg; g.save(); g.translate(px, py); g.scale(1, K); g.translate(-px, -py); g.fillRect(px - rad, py - rad, rad * 2, rad * 2); g.restore();
    } }
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) { hexPath(g, c, r, 1); g.strokeStyle = 'rgba(12,10,6,0.3)'; g.lineWidth = Math.max(1, s * 0.022); g.stroke(); }
  // Schmutz und Körnung, damit der Boden nicht wie eine glatte Fläche wirkt
  { let sd = 4242; const rn = () => { sd = (sd * 1664525 + 1013904223) >>> 0; return sd / 4294967296; };
    for (let i = 0; i < Math.round(W * H / 1400); i++) {
      const px = rn() * W, py = L.top * 0.7 + rn() * (H - L.top * 0.7), rr0 = s * (0.02 + rn() * 0.09);
      g.fillStyle = rn() < 0.55 ? 'rgba(24,18,10,0.16)' : rn() < 0.6 ? 'rgba(96,74,44,0.16)' : 'rgba(210,200,160,0.05)';
      g.beginPath(); g.ellipse(px, py, rr0, rr0 * K, 0, 0, 7); g.fill();
    } }
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) {
    const h = G.map[c][r], [x, y] = center(c, r), n = hash(c * 5.3, r * 2.9);
    if (tiled.has(E.key(c, r)) && h.t !== 'wire') continue;   // gemalte Kachel: keine gezeichneten Zutaten (Draht wird immer zusätzlich gezeichnet, damit er auffällt)
    if (h.t === 'wire') { hexPath(g, c, r, 0.94); g.strokeStyle = 'rgba(205,210,215,0.55)'; g.lineWidth = Math.max(1.5, s * 0.04); g.setLineDash([s * 0.12, s * 0.08]); g.stroke(); g.setLineDash([]); }
    g.strokeStyle = O; g.lineWidth = lw;
    if (h.t === 'mud') {
      g.fillStyle = '#463826';
      for (const [ox, oy, rx] of [[-0.3, -0.15, 0.22], [0.25, 0.1, 0.28], [-0.05, 0.3, 0.18]]) { g.beginPath(); g.ellipse(x + ox * s, y + oy * s * K, rx * s, rx * s * K * 0.7, 0, 0, 7); g.fill(); }
      g.fillStyle = '#7b8b8c'; g.beginPath(); g.ellipse(x + 0.25 * s, y + 0.1 * s * K, 0.12 * s, 0.07 * s * K, 0, 0, 7); g.fill();
    } else if (h.t === 'crater') {
      g.beginPath(); g.ellipse(x, y, s * 0.58, s * 0.58 * K, 0, 0, 7); g.fillStyle = '#8a7a52'; g.fill(); g.stroke();
      g.beginPath(); g.ellipse(x, y + s * 0.03, s * 0.44, s * 0.44 * K, 0, 0, 7); g.fillStyle = '#3c3122'; g.fill();
      g.beginPath(); g.ellipse(x + s * 0.03, y + s * 0.08 * K, s * 0.24, s * 0.22 * K, 0, 0, 7); g.fillStyle = '#566a6c'; g.fill();
    } else if (h.t === 'wire') {
      for (const row of [-0.32, 0.3]) {
        const yy = y + row * s * K;
        for (const ox of [-0.5, 0, 0.5]) {
          g.strokeStyle = O; g.lineWidth = lw * 2.2;
          g.beginPath(); g.moveTo(x + (ox - 0.1) * s, yy + s * 0.12); g.lineTo(x + (ox + 0.1) * s, yy - s * 0.2); g.moveTo(x + (ox + 0.1) * s, yy + s * 0.12); g.lineTo(x + (ox - 0.1) * s, yy - s * 0.2); g.stroke();
          g.strokeStyle = '#6b4a2b'; g.lineWidth = lw;
          g.beginPath(); g.moveTo(x + (ox - 0.1) * s, yy + s * 0.12); g.lineTo(x + (ox + 0.1) * s, yy - s * 0.2); g.moveTo(x + (ox + 0.1) * s, yy + s * 0.12); g.lineTo(x + (ox - 0.1) * s, yy - s * 0.2); g.stroke();
        }
        g.strokeStyle = '#c3c6c8'; g.lineWidth = Math.max(1, lw * 0.6);
        g.beginPath();
        for (let i = 0; i <= 9; i++) { const cx = x + (-0.62 + i * 0.138) * s; g.moveTo(cx + s * 0.09, yy - s * 0.06); g.ellipse(cx, yy - s * 0.06, s * 0.09, s * 0.11, 0, 0, 7); }
        g.stroke();
      }
    } else if (h.t === 'village') {
      const wall = (wx, wy, w, hh, br) => {
        g.beginPath(); g.moveTo(wx, wy); g.lineTo(wx, wy - hh); g.lineTo(wx + w * 0.3, wy - hh * (0.6 + br)); g.lineTo(wx + w * 0.55, wy - hh * 0.9); g.lineTo(wx + w * 0.8, wy - hh * 0.4); g.lineTo(wx + w, wy - hh * 0.55); g.lineTo(wx + w, wy); g.closePath();
        g.fillStyle = '#9a9483'; g.fill(); g.strokeStyle = O; g.lineWidth = lw; g.stroke();
        g.fillStyle = '#2b2a24'; g.fillRect(wx + w * 0.38, wy - hh * 0.5, w * 0.16, hh * 0.28);
      };
      wall(x - s * 0.62, y - s * 0.12 * K, s * 0.62, s * 0.62, n * 0.3);
      wall(x + s * 0.02, y + s * 0.42 * K, s * 0.56, s * 0.46, 0.2);
      g.fillStyle = '#6d6858'; for (const [ox, oy] of [[-0.2, 0.5], [0.4, -0.2], [0.1, 0.15]]) { g.beginPath(); g.ellipse(x + ox * s, y + oy * s * K, s * 0.09, s * 0.05, 0, 0, 7); g.fill(); }
    } else if (h.t === 'forest') {
      const tree = (tx, ty, hh, lean) => {
        g.strokeStyle = O; g.lineWidth = lw * 3.2;
        const p = () => { g.beginPath(); g.moveTo(tx, ty); g.lineTo(tx + lean, ty - hh); g.moveTo(tx + lean * 0.5, ty - hh * 0.5); g.lineTo(tx + lean * 0.5 + hh * 0.28, ty - hh * 0.78); g.moveTo(tx + lean * 0.7, ty - hh * 0.7); g.lineTo(tx + lean * 0.7 - hh * 0.22, ty - hh * 0.95); g.stroke(); };
        p(); g.strokeStyle = '#4a3b2a'; g.lineWidth = lw * 1.6; p();
      };
      tree(x - s * 0.42, y - s * 0.1 * K, s * 0.95, s * 0.06);
      tree(x + s * 0.3, y - s * 0.35 * K, s * 0.8, -s * 0.05);
      tree(x + s * 0.05, y + s * 0.45 * K, s * 0.6, s * 0.04);
    } else if (h.t === 'canal' || h.t === 'bridge') {
      g.strokeStyle = 'rgba(190,220,225,0.35)'; g.lineWidth = lw;
      for (const [ox, oy] of [[-0.3, -0.3], [0.15, 0], [-0.2, 0.35]]) { g.beginPath(); g.moveTo(x + ox * s, y + oy * s * K); g.quadraticCurveTo(x + (ox + 0.12) * s, y + oy * s * K - s * 0.05, x + (ox + 0.26) * s, y + oy * s * K); g.stroke(); }
      if (h.t === 'bridge') {
        g.fillStyle = '#8a6238'; g.strokeStyle = O; g.lineWidth = lw;
        g.beginPath(); g.rect(x - s * 1.0, y - s * 0.3 * K, s * 2.0, s * 0.6 * K); g.fill(); g.stroke();
        g.lineWidth = lw * 0.6; for (let i = -4; i <= 4; i++) { g.beginPath(); g.moveTo(x + i * s * 0.22, y - s * 0.3 * K); g.lineTo(x + i * s * 0.22, y + s * 0.3 * K); g.stroke(); }
      }
    } else if (h.t === 'open' && n > 0.8) {
      g.strokeStyle = 'rgba(30,36,16,0.5)'; g.lineWidth = lw * 0.8;
      const gx = x + (n - 0.9) * s * 4, gy = y + (hash(c, r) - 0.5) * s * K;
      g.beginPath(); g.moveTo(gx - s * 0.06, gy); g.lineTo(gx - s * 0.09, gy - s * 0.1); g.moveTo(gx, gy); g.lineTo(gx, gy - s * 0.13); g.moveTo(gx + s * 0.06, gy); g.lineTo(gx + s * 0.09, gy - s * 0.1); g.stroke();
    }
  }
  const vg = g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.72);
  vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(6,5,3,0.5)');
  g.fillStyle = vg; g.fillRect(0, 0, W, H);
}

// ---------- Einheiten ----------
function initDU() { DU.clear(); for (const u of G.units) addDU(u); }
function addDU(u) { const [x, y] = L ? center(u.c, u.r) : [0, 0]; DU.set(u.id, { x, y, face: u.face, str: u.str, mor: u.mor, alpha: 1, shake: 0, lunge: null }); }
function syncAll() {
  for (const u of G.units) {
    if (!DU.has(u.id)) addDU(u);
    const d = DU.get(u.id), [x, y] = center(u.c, u.r);
    d.x = x; d.y = y; d.face = u.face; d.str = u.str; d.mor = u.mor; d.lunge = null;
    d.alpha = E.alive(u) ? 1 : 0;
  }
}
const facesLeft = f => f === 2 || f === 3 || f === 4;
// Figuren stehen in der unteren Hälfte ihres Feldes und bleiben schmal, damit sie Nachbarfelder nicht verdecken
const SLOTS = { limber: [[0, 0.38]], medic: [[0.2, 0.4], [-0.22, 0.2]], mortar: [[0, 0.38]], inf: [[0.22, 0.42], [-0.24, 0.22], [0, 0.05]], storm: [[0.22, 0.42], [-0.24, 0.22], [0, 0.05]],
  flame: [[0.2, 0.4], [-0.22, 0.2]], cav: [[0, 0.4]], mg: [[0, 0.38]], art: [[0, 0.38]], walker: [[0, 0.4]],
  bike: [[0, 0.38]], sniper: [[0, 0.38]], dog: [[0, 0.38]], atr: [[0, 0.38]], signal: [[0.15, 0.4], [-0.25, 0.2]], sapper: [[0.2, 0.4], [-0.22, 0.2]], raider: [[0.22, 0.42], [-0.24, 0.22]],
  shield: [[0.2, 0.4], [-0.22, 0.2]], heavy: [[0.2, 0.4], [-0.24, 0.2]], mech: [[0, 0.42]], drill: [[0, 0.42]], mechA: [[0, 0.42]], mechB: [[0, 0.42]], fgun: [[0, 0.38]], leader1: [[0.12, 0.4], [-0.3, 0.2]], leader4: [[0.12, 0.4], [-0.3, 0.2]], flamer: [[0.2, 0.4], [-0.22, 0.2]], shieldA: [[0.2, 0.4], [-0.22, 0.2]], phone: [[0.15, 0.4], [-0.25, 0.2]], brawler: [[0.22, 0.42], [-0.24, 0.22]], knight: [[0.2, 0.4], [-0.22, 0.2]], sapperD: [[0.2, 0.4], [-0.22, 0.2]], banner: [[0, 0.4]], suitA: [[0.24, 0.42], [-0.26, 0.2]], suitD: [[0.24, 0.42], [-0.26, 0.2]] };
const FH = { limber: 0.58, medic: 0.62, mortar: 0.66, inf: 0.62, storm: 0.62, flame: 0.62, mg: 0.68, art: 0.74, walker: 0.86, cav: 0.57,
  bike: 0.62, sniper: 0.64, dog: 0.62, atr: 0.64, signal: 0.6, sapper: 0.6, raider: 0.62, shield: 0.62, heavy: 0.62, mech: 0.64, drill: 0.64, mechA: 0.64, mechB: 0.64, suitA: 0.6, suitD: 0.6,
  fgun: 0.7, leader1: 0.66, leader4: 0.66, flamer: 0.62, shieldA: 0.62, phone: 0.6, brawler: 0.62, knight: 0.64, sapperD: 0.6, banner: 0.74 };
const MAXW = 1.6, MAXWK = { walker: 2.05, limber: 1.95, art: 1.8, cav: 1.7, mech: 2.1, drill: 2.1, mechA: 2.1, mechB: 2.1, fgun: 1.8, atr: 1.5, sniper: 1.4, bike: 1.5, dog: 1.5 };   // größte Bildbreite in Feldradien
// Figuren etwas größer seit den kleineren Karten (Wunsch des Nutzers)
const FSC = 1.12; for (const k in FH) FH[k] *= FSC; for (const k in MAXWK) MAXWK[k] *= 1.06;

function drawUnit(u, d) {
  const T = TYPES[u.type], k = figU(u), s = L.s, flip = facesLeft(d.face) ? 1 : 0, acc = FIG.PAL[u.side].accent;
  let x = d.x, y = d.y;
  if (d.lunge) { x += d.lunge.dx; y += d.lunge.dy; }
  if (d.shake > 0) x += Math.sin(now / 22) * s * 0.05;
  const g = ctx;
  g.globalAlpha = d.alpha * (u.status === 'rout' ? 0.75 : 1);
  const isSel = sel && sel.id === u.id;
  const done = human(u.side) && G.side === u.side && E.active(u) && !busy && spent.has(u.id);
  // Standring mit Blickrichtung
  g.beginPath(); g.ellipse(x, y, s * 0.7, s * 0.7 * K, 0, 0, 7);
  g.fillStyle = acc; g.globalAlpha *= done ? 0.12 : 0.28; g.fill();
  g.globalAlpha = d.alpha * (done ? 0.45 : 1);
  g.lineWidth = Math.max(2, s * (isSel ? 0.09 : 0.06)); g.strokeStyle = isSel ? '#fff7dd' : acc;
  if (u.status === 'rout') g.setLineDash([s * 0.14, s * 0.12]);
  g.stroke(); g.setLineDash([]);
  if (isSel && UIM.ringY) { const rw = s * 1.75, rh = rw * K; g.save(); g.globalAlpha = 0.9; g.drawImage(UIM.ringY, x - rw / 2, y - rh / 2, rw, rh); g.restore(); }
  if (hoverU === u && !isSel) { g.beginPath(); g.ellipse(x, y, s * 0.8, s * 0.8 * K, 0, 0, 7); g.strokeStyle = 'rgba(255,250,225,0.85)'; g.lineWidth = Math.max(1.5, s * 0.045); g.stroke(); }
  if (E.active(u)) {
    const a = d.face * Math.PI / 3, fx = x + Math.cos(a) * s * 0.7, fy = y + Math.sin(a) * s * 0.7 * K;
    g.beginPath(); g.arc(fx, fy, s * 0.11, 0, 7); g.fillStyle = isSel ? '#fff7dd' : acc; g.fill(); g.lineWidth = Math.max(1.5, s * 0.04); g.strokeStyle = O; g.stroke();
  }
  if (previewT && previewT.id === u.id) {
    g.beginPath(); g.ellipse(x, y, s * 0.84, s * 0.84 * K, 0, 0, 7); g.strokeStyle = '#ff4a30'; g.lineWidth = Math.max(2, s * 0.08);
    g.globalAlpha = 0.6 + 0.4 * Math.sin(now / 110); g.stroke();
  }
  g.globalAlpha = d.alpha * (u.status === 'rout' ? 0.75 : 1);
  // Figuren
  const slots = SLOTS[k];
  const n = slots.length === 1 ? 1 : Math.max(1, Math.min(slots.length, Math.ceil(d.str / (10 / slots.length) - 0.001)));
  let sp = FIG.sprite(k, u.side, flip, s * FH[k]);
  { const mw = s * (MAXWK[k] || MAXW); if (sp.cv.width > mw) sp = FIG.sprite(k, u.side, flip, s * FH[k] * mw / sp.cv.width); }
  // Gemalte Bilder sind größer: höchstens zwei Figuren je Einheit, damit es übersichtlich bleibt
  const use = slots.slice(0, sp.painted ? Math.min(n, 2) : n).slice().sort((a, b) => a[1] - b[1]);
  if (done) g.globalAlpha *= 0.6;
  const duck = u.supp > 0 ? s * 0.1 : 0;
  for (const [ox, oy] of use) {
    const fx = x + (flip ? -ox : ox) * s, fy = y + oy * s * K + duck;
    g.fillStyle = 'rgba(10,9,6,0.38)'; g.beginPath(); g.ellipse(fx, fy, s * (k === 'walker' ? 0.5 : 0.3), s * (k === 'walker' ? 0.16 : 0.1), 0, 0, 7); g.fill();
    const lead = ox === slots[0][0] && oy === slots[0][1] ? leaderKind(u) : null;
    if (lead) { const ls = FIG.sprite(lead, u.side, flip, s * FH.inf * 1.12); g.drawImage(ls.cv, Math.round(fx - ls.ox), Math.round(fy - ls.oy)); g.font = `900 ${Math.round(s * 0.34)}px sans-serif`; g.textAlign = 'center'; g.lineWidth = Math.max(2, s * 0.07); g.strokeStyle = O; g.strokeText('★', fx, fy - ls.oy + s * 0.02); g.fillStyle = u.cd > 0 ? '#9a917a' : '#ffd24a'; g.fillText('★', fx, fy - ls.oy + s * 0.02); continue; }
    if (u.officer && ox === slots[0][0] && oy === slots[0][1]) {
      const px = fx + (flip ? 0.2 : -0.2) * s, top = fy - s * 1.35;
      g.strokeStyle = O; g.lineWidth = Math.max(2, s * 0.07); g.beginPath(); g.moveTo(px, fy - s * 0.2); g.lineTo(px, top); g.stroke();
      g.beginPath(); g.moveTo(px, top); g.lineTo(px + (flip ? 1 : -1) * s * 0.42, top + s * 0.13); g.lineTo(px, top + s * 0.28); g.closePath();
      g.fillStyle = acc; g.fill(); g.lineWidth = Math.max(1.5, s * 0.045); g.stroke();
      g.fillStyle = '#ffe9a8'; g.beginPath(); g.arc(px + (flip ? 1 : -1) * s * 0.14, top + s * 0.13, s * 0.045, 0, 7); g.fill();
    }
    g.drawImage(sp.cv, Math.round(fx - sp.ox), Math.round(fy - sp.oy));
  }
  g.globalAlpha = 1;
  if (!E.alive(u)) return;
  // Balken
  const w = s * 0.96, bx = x - w / 2, by = y + s * K * 0.78, bh = Math.max(3, s * 0.09);
  g.fillStyle = O; g.fillRect(bx - 2, by - 2, w + 4, bh * 2 + 5);
  g.fillStyle = '#3a372c'; g.fillRect(bx, by, w, bh); g.fillRect(bx, by + bh + 1, w, bh);
  g.fillStyle = d.str > 3.3 ? '#efe7d2' : '#e2553c'; g.fillRect(bx, by, w * d.str / 10, bh);
  g.fillStyle = '#e5b23a'; g.fillRect(bx, by + bh + 1, w * Math.min(1, d.mor / T.mor), bh);
  // Aktionsmarken: links Bewegung (Pfeil), rechts Angriff (Raute). Leuchtet = noch möglich.
  if (human(u.side) && G.side === u.side && E.active(u)) {
    const ca = !u.attacked && !u.broken && u.ap >= 1, pr = Math.max(4, s * 0.15), py = by + bh, ap = u.broken || u.supp ? 0 : (u.ap || 0);
    g.lineWidth = Math.max(1.5, s * 0.04); g.strokeStyle = O;
    // Aktionspunkte: helle Kugeln links vom Balken (eine je Punkt)
    for (let i = 0; i < Math.max(P.AP, ap); i++) { g.beginPath(); g.arc(bx - pr * (1.1 + i * 1.9), py, pr * 0.8, 0, 7); g.fillStyle = i < ap ? (i >= P.AP ? '#7fd8ff' : '#ffd24a') : '#2f2e25'; g.fill(); g.stroke(); }
    const rx0 = bx + w + pr * 1.4; g.beginPath(); g.moveTo(rx0, py - pr * 1.1); g.lineTo(rx0 + pr * 1.1, py); g.lineTo(rx0, py + pr * 1.1); g.lineTo(rx0 - pr * 1.1, py); g.closePath(); g.fillStyle = ca ? '#ff5a3c' : '#2f2e25'; g.fill(); g.stroke();
  }
  // Zustandsmarken
  const tagY = y - s * (k === 'mech' || k === 'drill' || k === 'mechA' || k === 'mechB' ? 1.55 : k === 'walker' ? 0.95 : k === 'cav' ? 1.05 : 0.85);
  const tag = (glyph, bg, fg, ic) => {
    const cx = x - s * 0.9, cy = y - s * 0.12, r = s * 0.2, im = UIM[ic];
    if (im) {   // helle Scheibe mit Rand dahinter, Symbol aufgehellt: auf dunklem Boden gut zu sehen
      const R = s * 0.34; g.save(); g.beginPath(); g.arc(cx, cy, R, 0, 7); g.fillStyle = bg; g.shadowColor = 'rgba(0,0,0,0.8)'; g.shadowBlur = s * 0.12; g.fill(); g.shadowBlur = 0; g.lineWidth = Math.max(2, s * 0.06); g.strokeStyle = '#1d140d'; g.stroke();
      const hh = s * 0.52, ww = hh * im.naturalWidth / im.naturalHeight; g.filter = 'brightness(1.45) contrast(1.15)'; g.drawImage(im, cx - ww / 2, cy - hh / 2, ww, hh); g.restore(); return; }
    g.beginPath(); g.arc(cx, cy, r, 0, 7); g.fillStyle = bg; g.fill(); g.strokeStyle = '#1d140d'; g.lineWidth = Math.max(1.5, s * 0.045); g.stroke();
    g.font = `900 ${Math.round(s * 0.25)}px system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = fg; g.fillText(glyph, cx, cy + 1);
  };
  if (u.status === 'rout') tag('↩', '#f3ead2', '#7a1c10', 'icSkull');
  else if (u.broken > 0) tag('✖', '#e8e0c8', '#1d140d', 'icGear');
  else if (u.limbered) tag('⇄', '#f0e2b8', '#1d140d', 'icArrows');
  else if (u.supp > 0) tag('▼', '#ffe28a', '#5a1408', 'icDanger');
  else if (u.stuck > 0) tag('≈', '#d9c49a', '#3a2410');
  else if (u.gassed) tag('G', '#e3ec8a', '#1d2408', 'icWarn');
  else if (u.ow) tag('◎', '#cfe9ff', '#0f3550');
  else if (TYPES[u.type].mg && !u.setup && E.active(u)) tag('⤓', '#e9dfc4', '#5a3a10');
  if (TYPES[u.type].relay && E.active(u)) { const cx = x + s * 0.86, cy = y - s * 0.02; g.beginPath(); g.arc(cx, cy, s * 0.2, 0, 7); g.fillStyle = '#bfe0f2'; g.fill(); g.strokeStyle = '#1d140d'; g.lineWidth = Math.max(1.5, s * 0.045); g.stroke(); g.font = `900 ${Math.round(s * 0.24)}px system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#12303f'; g.fillText('◉', cx, cy + 1); }
}

// ---------- Zeichnen ----------
// STEP = vergangene Zeit in 60-Hz-Bildern (gleich schnell bei 30, 60 oder 144 Hz); FS = dazu das Spieltempo, passend zu wait()
let lastT = 0, STEP = 1, FS = 1;
function frame(t) { STEP = lastT ? Math.min(4, Math.max(0.1, (t - lastT) / 16.667)) : 1; lastT = t; FS = STEP * speed; now = t; draw(); requestAnimationFrame(frame); }
function draw() {
  if (!L || !tcv) return;
  const g = ctx, s = L.s;
  g.drawImage(tcv, 0, 0);
  for (const dc of decals) {
    const im = FXI['blood' + dc.v];
    if (im) { const w = dc.r * 5, hh = w * im.naturalHeight / im.naturalWidth * Math.max(0.6, K); g.globalAlpha = 0.85; g.drawImage(im, dc.x - w / 2, dc.y - hh / 2, w, hh); g.globalAlpha = 1; }
    else { g.fillStyle = dc.col; g.beginPath(); g.ellipse(dc.x, dc.y, dc.r, dc.r * K, 0, 0, 7); g.fill(); }
  }
  // Markierungen
  if (sel && human(G.side) && !busy) {
    for (const [, n] of reach) { hexPath(g, n.c, n.r, 0.9); g.fillStyle = n.march ? 'rgba(255,190,70,0.24)' : n.retreat ? 'rgba(255,160,120,0.26)' : 'rgba(255,244,190,0.3)'; g.fill(); g.strokeStyle = n.march ? 'rgba(255,196,90,0.85)' : 'rgba(255,246,205,0.75)'; g.lineWidth = Math.max(1.5, s * 0.04); g.stroke();
      if (G.map[n.c][n.r].t === 'wire') { hexPath(g, n.c, n.r, 0.8); g.strokeStyle = '#e2553c'; g.setLineDash([s * 0.1, s * 0.07]); g.lineWidth = Math.max(2, s * 0.06); g.stroke(); g.setLineDash([]); } }
    if (E.canCut(G, sel)) { const [cx, cy] = center(sel.c, sel.r), pu = 0.5 + 0.5 * Math.sin(now / 220); hexPath(g, sel.c, sel.r, 0.96); g.strokeStyle = `rgba(255,224,120,${0.5 + pu * 0.5})`; g.lineWidth = Math.max(3, s * 0.1); g.stroke();
      g.font = `900 ${Math.round(s * 0.55)}px system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineWidth = Math.max(3, s * 0.1); g.strokeStyle = O; g.strokeText('✂', cx + s * 0.62, cy - s * 0.95); g.fillStyle = '#ffe078'; g.fillText('✂', cx + s * 0.62, cy - s * 0.95); }
    for (const k of rangeSet) { if (shellHexes.has(k)) continue; hexPath(g, Math.floor(k / 100), k % 100, 0.96); g.fillStyle = 'rgba(220,40,30,0.10)'; g.fill(); g.strokeStyle = 'rgba(230,60,45,0.28)'; g.lineWidth = Math.max(1, s * 0.025); g.stroke(); }
    for (const k of shellHexes) {
      const c = Math.floor(k / 100), r = k % 100;
      hexPath(g, c, r, 0.92); g.fillStyle = `rgba(235,40,30,${0.36 + 0.1 * Math.sin(now / 260)})`; g.fill(); g.strokeStyle = '#ff5a40'; g.lineWidth = Math.max(2, s * 0.06); g.stroke();
    }
    if (sightSet.size) for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) if (sightSet.has(E.key(c, r))) {
      hexPath(g, c, r, 0.9); g.fillStyle = E.dist(sel.c, sel.r, c, r) > P.SPOT ? 'rgba(120,200,240,0.30)' : 'rgba(120,200,240,0.13)'; g.fill(); g.strokeStyle = 'rgba(170,225,250,0.55)'; g.lineWidth = Math.max(1, s * 0.03); g.stroke(); }
    if (scoutSet.size) { g.font = `900 ${Math.round(s * 0.34)}px system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
      for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) if (scoutSet.has(E.key(c, r))) { const [hx, hy] = center(c, r); g.lineWidth = Math.max(2, s * 0.08); g.strokeStyle = O; g.strokeText('◉', hx, hy); g.fillStyle = '#bfe0f2'; g.fillText('◉', hx, hy); } }
    for (const id of sendSet) { const hu = unitById(id); hexPath(g, hu.c, hu.r, 0.92); g.fillStyle = 'rgba(120,200,255,0.30)'; g.fill(); g.strokeStyle = '#7fd8ff'; g.lineWidth = Math.max(2, s * 0.06); g.stroke(); }
    for (const id of recSet) { const hu = unitById(id); hexPath(g, hu.c, hu.r, 0.92); g.fillStyle = 'rgba(255,200,90,0.3)'; g.fill(); g.strokeStyle = '#ffcf6a'; g.lineWidth = Math.max(2, s * 0.06); g.stroke(); }
    for (const id of healSet) { const hu = unitById(id); hexPath(g, hu.c, hu.r, 0.92); g.fillStyle = 'rgba(110,220,180,0.34)'; g.fill(); g.strokeStyle = '#8fe0c8'; g.lineWidth = Math.max(2, s * 0.06); g.stroke(); if (PJI.cross) { const [cx, cy] = center(hu.c, hu.r), hh = s * 0.5; g.globalAlpha = 0.75 + 0.25 * Math.sin(now / 200); g.drawImage(PJI.cross, cx - hh / 2, cy - s * 1.25, hh, hh * PJI.cross.naturalHeight / PJI.cross.naturalWidth); g.globalAlpha = 1; } }
    for (const [, t] of targets) {
      const u = unitById(t.id); hexPath(g, u.c, u.r, 0.92);
      g.fillStyle = t.kind === 'fire' ? 'rgba(255,150,40,0.38)' : 'rgba(255,60,40,0.4)'; g.fill();
      g.strokeStyle = t.kind === 'fire' ? '#ffb04a' : '#ff5a40'; g.lineWidth = Math.max(2, s * 0.06); g.stroke();
    }
  }
  if (placing) for (const k of spawnSet) { hexPath(g, Math.floor(k / 100), k % 100, 0.9); g.fillStyle = 'rgba(150,230,120,0.3)'; g.fill(); g.strokeStyle = 'rgba(190,255,160,0.8)'; g.lineWidth = Math.max(1.5, s * 0.04); g.stroke(); }
  if (hoverHex) {
    hexPath(g, hoverHex[0], hoverHex[1], 0.95); g.strokeStyle = 'rgba(255,250,225,0.55)'; g.lineWidth = Math.max(1.5, s * 0.04); g.stroke();
    if (sel && TYPES[sel.type].cls === 'art' && shellHexes.has(E.key(hoverHex[0], hoverHex[1])) && artMode !== 'he') {
      const cells = artMode === 'gas' ? E.gasCells(G, hoverHex[0], hoverHex[1]) : [hoverHex, ...E.neighbors(hoverHex[0], hoverHex[1])];
      for (const [c, r] of cells) { hexPath(g, c, r, 0.9); g.fillStyle = artMode === 'gas' ? 'rgba(196,214,70,0.45)' : 'rgba(255,120,60,0.4)'; g.fill(); }
    }
  }
  // Zielfahnen
  for (const o of OBJECTIVES) {
    const [x, y] = center(o.c, o.r), col = FIG.PAL[G.ctrl[o.id]].accent, px = x + s * 0.5, base = y - s * 0.2 * K, top = base - s * 1.25;
    g.strokeStyle = O; g.lineWidth = Math.max(2, s * 0.08); g.beginPath(); g.moveTo(px, base); g.lineTo(px, top); g.stroke();
    const fim = G.ctrl[o.id] === 'D' ? FLI['flagD' + flagSel.D] : skinA === 'F' ? FLI['flagF' + flagSel.F] : FLI['flagA' + flagSel.A];
    if (fim) { const fh = s * 1.15, fw = fh * fim.naturalWidth / fim.naturalHeight; g.drawImage(fim, px - fw * 0.08, top - s * 0.12, fw, fh); }
    g.beginPath(); g.rect(px, fim ? base - s * 0.36 : top, s * (fim ? 0.36 : 0.5), s * 0.34); g.fillStyle = col; g.fill(); g.strokeStyle = O; g.lineWidth = Math.max(1.5, s * 0.05); g.stroke();
    g.fillStyle = '#16150f'; g.font = `800 ${Math.round(s * 0.28)}px system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(o.pts, px + s * (fim ? 0.18 : 0.25), (fim ? base - s * 0.36 : top) + s * 0.18);
  }
  // Einheiten nach Tiefe
  const list = [];
  for (const u of G.units) { const d = DU.get(u.id); if (d && d.alpha > 0) list.push([d.y, u, d]); }
  list.sort((a, b) => a[0] - b[0]);
  for (const [, u, d] of list) drawUnit(u, d);
  // Gaswolken
  for (const k of G.clouds) {
    const [x, y] = center(k.c, k.r), v = (k.c + k.r) % 2 ? 'gas1' : 'gas2', im = FXI[v];
    if (im) {
      const hh = s * (1.25 + 0.06 * Math.sin(now / 700 + k.c)), w = fxw(im, hh), dx = Math.sin(now / 1300 + k.r) * s * 0.08;
      g.globalAlpha = 0.82; g.drawImage(im, x - w / 2 + dx, y + s * K * 0.6 - hh, w, hh); g.globalAlpha = 1;
    } else {
      for (let i = 0; i < 5; i++) {
        const a = i * 1.26 + now / 1400, rx = s * (0.42 + 0.1 * Math.sin(now / 900 + i));
        g.beginPath(); g.ellipse(x + Math.cos(a) * s * 0.36, y - s * 0.25 + Math.sin(a * 1.3) * s * 0.22 * K, rx, rx * 0.72, 0, 0, 7);
        g.fillStyle = 'rgba(200,216,72,0.26)'; g.fill();
      }
    }
  }
  // Nebelschwaden und Nieselregen
  for (let i = 0; i < 5; i++) {
    const fx = ((now / (38 + i * 9) + i * L.W * 0.27) % (L.W * 1.4)) - L.W * 0.2, fy = L.top + (L.H - L.top) * (0.12 + 0.2 * i);
    const fg = g.createRadialGradient(fx, fy, 0, fx, fy, s * 7); fg.addColorStop(0, 'rgba(176,170,150,0.10)'); fg.addColorStop(1, 'rgba(176,170,150,0)');
    g.fillStyle = fg; g.save(); g.translate(fx, fy); g.scale(1, 0.3); g.translate(-fx, -fy); g.fillRect(fx - s * 7, fy - s * 7, s * 14, s * 14); g.restore();
  }
  g.strokeStyle = 'rgba(200,205,205,0.10)'; g.lineWidth = Math.max(1, s * 0.02); g.beginPath();
  for (let i = 0; i < 70; i++) { const rx = (i * 173.3 + now * 0.25) % L.W, ry = (i * 97.7 + now * 0.9) % L.H; g.moveTo(rx, ry); g.lineTo(rx - s * 0.12, ry + s * 0.5); }
  g.stroke();
  // Effekte
  g.lineCap = 'round';
  for (let i = tracers.length - 1; i >= 0; i--) {
    const tr = tracers[i]; tr.life -= FS;
    if (tr.life <= 0) { tracers.splice(i, 1); continue; }
    const k = 1 - tr.life / tr.max;
    const pim = PJI[tr.img];
    if (pim) {
      const ang = Math.atan2(tr.y2 - tr.y1, tr.x2 - tr.x1), hh = s * tr.sz, w = fxw(pim, hh), reps = tr.n > 1 ? 2 : 1;
      for (let n = 0; n < reps; n++) {
        const p = k * 1.15 - n * 0.3; if (p < 0 || p > 1) continue;
        g.save(); g.translate(tr.x1 + (tr.x2 - tr.x1) * p, tr.y1 + (tr.y2 - tr.y1) * p); g.rotate(ang); if (tr.x2 < tr.x1) g.scale(1, -1);
        g.drawImage(pim, -w, -hh / 2, w, hh); g.restore();
      }
      continue;
    }
    for (let n = 0; n < tr.n; n++) {
      const p = (k * 1.5 + n * 0.16) % 1.15; if (p > 1) continue;
      const q = Math.max(0, p - 0.1);
      const xa = tr.x1 + (tr.x2 - tr.x1) * q, ya = tr.y1 + (tr.y2 - tr.y1) * q, xb = tr.x1 + (tr.x2 - tr.x1) * p, yb = tr.y1 + (tr.y2 - tr.y1) * p;
      g.strokeStyle = O; g.lineWidth = s * 0.11; g.beginPath(); g.moveTo(xa, ya); g.lineTo(xb, yb); g.stroke();
      g.strokeStyle = tr.col; g.lineWidth = s * 0.055; g.beginPath(); g.moveTo(xa, ya); g.lineTo(xb, yb); g.stroke();
    }
    if (tr.life > tr.max - 5) { g.fillStyle = '#fff1a0'; g.beginPath(); g.arc(tr.x1, tr.y1, s * 0.16, 0, 7); g.fill(); }
  }
  for (let i = flames.length - 1; i >= 0; i--) {
    const f = flames[i]; f.life -= FS;
    if (f.life <= 0) { flames.splice(i, 1); continue; }
    const k = Math.min(1, (f.max - f.life) / 6), im = PJI.jet && f.life % 12 >= 8 ? PJI.jet : FXI[f.life % 8 < 4 ? 'flame1' : 'flame2'];
    if (im) {
      const len = Math.hypot(f.x2 - f.x1, f.y2 - f.y1) * 1.2 * k, hh = len * im.naturalHeight / im.naturalWidth * 1.25;
      g.save(); g.translate(f.x1, f.y1); g.rotate(Math.atan2(f.y2 - f.y1, f.x2 - f.x1));
      if (f.x2 < f.x1) g.scale(1, -1);
      g.globalAlpha = Math.min(1, f.life / 6); g.drawImage(im, 0, -hh / 2, len, hh); g.restore(); g.globalAlpha = 1;
    } else {
      const ex = f.x1 + (f.x2 - f.x1) * k, ey = f.y1 + (f.y2 - f.y1) * k;
      const nx = -(ey - f.y1), ny = ex - f.x1, nl = Math.hypot(nx, ny) || 1, wv = s * (0.28 + 0.06 * Math.sin(now / 40));
      for (const [col, m] of [['#16150f', 1.25], ['#f08a2a', 1], ['#ffe07a', 0.5]]) {
        g.beginPath(); g.moveTo(f.x1, f.y1); g.lineTo(ex + nx / nl * wv * m, ey + ny / nl * wv * m); g.lineTo(ex + (ex - f.x1) * 0.12 * m, ey + (ey - f.y1) * 0.12 * m); g.lineTo(ex - nx / nl * wv * m, ey - ny / nl * wv * m); g.closePath(); g.fillStyle = col; g.fill();
      }
    }
  }
  for (let i = shells.length - 1; i >= 0; i--) {
    const sh = shells[i]; sh.t += FS / sh.dur;
    if (sh.t >= 1) { shells.splice(i, 1); continue; }
    const x = sh.x1 + (sh.x2 - sh.x1) * sh.t, y = sh.y1 + (sh.y2 - sh.y1) * sh.t - Math.sin(Math.PI * sh.t) * s * (sh.arc ?? 3.2);
    const pim = PJI[sh.img];
    if (pim) {
      const t2 = Math.min(1, sh.t + 0.02), nx = sh.x1 + (sh.x2 - sh.x1) * t2, ny = sh.y1 + (sh.y2 - sh.y1) * t2 - Math.sin(Math.PI * t2) * s * (sh.arc ?? 3.2);
      const hh = s * (sh.sz || 0.36), w = fxw(pim, hh);
      g.save(); g.translate(x, y); g.rotate(Math.atan2(ny - y, nx - x) + (sh.spin ? sh.t * 9 : 0)); if (sh.x2 < sh.x1 && !sh.spin) g.scale(1, -1);
      g.drawImage(pim, sh.spin ? -w / 2 : -w, -hh / 2, w, hh); g.restore();
    } else { g.beginPath(); g.arc(x, y, s * 0.12, 0, 7); g.fillStyle = sh.col; g.fill(); g.strokeStyle = O; g.lineWidth = Math.max(1.5, s * 0.05); g.stroke(); }
  }
  for (let i = muzzles.length - 1; i >= 0; i--) {
    const mz = muzzles[i]; mz.life -= FS; if (mz.life <= 0) { muzzles.splice(i, 1); continue; }
    const im = PJI[mz.img]; if (!im) continue;
    const hh = s * mz.sz * (0.85 + 0.15 * Math.sin(mz.life)), w = fxw(im, hh);
    g.save(); g.translate(mz.x, mz.y); if (mz.center) { g.globalAlpha = Math.min(1, mz.life / (mz.max * 0.5)); g.drawImage(im, -w / 2, -hh * (mz.up || 0.5), w, hh); }
    else { g.rotate(mz.ang); if (Math.cos(mz.ang) < 0) g.scale(1, -1); g.globalAlpha = Math.min(1, mz.life / (mz.max * 0.5)); g.drawImage(im, -w * (mz.off || 0), -hh / 2, w, hh); }
    g.restore(); g.globalAlpha = 1;
  }
  for (let i = rings.length - 1; i >= 0; i--) {
    const rg = rings[i]; rg.life -= FS; if (rg.life <= 0) { rings.splice(i, 1); continue; }
    const k = 1 - rg.life / rg.max, im = PJI[rg.img];
    if (im) { const hh = s * rg.r * (0.7 + 0.5 * k), w = fxw(im, hh); g.globalAlpha = Math.min(1, rg.life / (rg.max * 0.4)); g.drawImage(im, rg.x - w / 2, rg.y - hh / 2 - k * s * 0.5, w, hh); g.globalAlpha = 1; }
    else { g.beginPath(); g.ellipse(rg.x, rg.y, s * rg.r * k, s * rg.r * k * K, 0, 0, 7); g.strokeStyle = rg.col; g.globalAlpha = 1 - k; g.lineWidth = Math.max(2, s * 0.09); g.stroke(); g.globalAlpha = 1; }
  }
  for (let i = booms.length - 1; i >= 0; i--) {
    const b = booms[i]; if (b.delay > 0) { b.delay -= FS; continue; } b.life -= FS;
    if (b.life <= 0) { booms.splice(i, 1); continue; }
    const k = 1 - b.life / b.max, im = FXI[b.img];
    if (im) {
      const grow = b.kind === 'smoke' ? 0.7 + 0.5 * k : 0.45 + 0.55 * Math.sqrt(Math.min(1, k * 2.2));
      const hh = b.r * 2.3 * grow, w = fxw(im, hh), rise = b.kind === 'smoke' ? k * b.r * 1.2 : 0;
      g.globalAlpha = Math.min(1, b.life / (b.max * 0.45)) * (b.kind === 'smoke' ? 0.8 : 1);
      g.save(); g.translate(b.x, b.y + b.r * 0.35 - rise); if (b.flip) g.scale(-1, 1); g.drawImage(im, -w / 2, -hh, w, hh); g.restore();
    } else {
      const r = b.r * (0.35 + 0.65 * Math.sqrt(k));
      g.globalAlpha = Math.min(1, b.life / (b.max * 0.5));
      for (const [col, m] of b.cols) { g.beginPath(); g.arc(b.x, b.y - r * 0.5, r * m, 0, 7); g.fillStyle = col; g.fill(); if (m === 1) { g.strokeStyle = O; g.lineWidth = Math.max(2, s * 0.06); g.stroke(); } }
    }
    g.globalAlpha = 1;
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]; p.x += p.vx * FS; p.y += p.vy * FS; p.vy += p.g * FS; p.life -= FS;
    if (p.life <= 0) { particles.splice(i, 1); continue; }
    g.globalAlpha = Math.min(1, p.life / 12); g.fillStyle = p.col; g.beginPath(); g.arc(p.x, p.y, p.s, 0, 7); g.fill();
  }
  g.globalAlpha = 1;
  // Schrittzahlen
  g.textAlign = 'center'; g.textBaseline = 'middle';
  if (sel && human(G.side) && !busy) {
    g.font = `800 ${Math.round(s * 0.4)}px system-ui, sans-serif`;
    for (const [, n] of reach) { const [x, y] = center(n.c, n.r); g.fillStyle = 'rgba(22,21,15,0.8)'; g.fillText(n.cost, x + 1.5, y + 1.5); g.fillStyle = '#fff6cf'; g.fillText(n.cost, x, y); }
  }
  for (let i = floaters.length - 1; i >= 0; i--) {
    const f = floaters[i]; f.life -= f.hold ? STEP : FS; f.y -= s * STEP * (f.hold ? (f.life > f.max - 30 ? 0.012 : 0.0015) : 0.012);
    if (f.life <= 0) { floaters.splice(i, 1); continue; }
    g.globalAlpha = Math.min(1, f.life / 18);
    g.font = `900 ${Math.round(s * (f.hold ? (f.big ? 0.66 : 0.54) : f.big ? 0.5 : 0.42))}px system-ui, sans-serif`;
    g.lineWidth = Math.max(3, s * 0.12); g.strokeStyle = O; g.lineJoin = 'round'; g.strokeText(f.text, f.x, f.y);
    g.fillStyle = f.col; g.fillText(f.text, f.x, f.y);
  }
  g.globalAlpha = 1;
}

// ---------- Ton ----------
let soundOn = true;
const lastSnd = {}, SND_GAP = { rifle: 70, mg: 250, cannon: 150, flame: 500, boom: 250, boom2: 400, barrage: 800, gas: 800, tank: 1500, glitch: 500, gallop: 1400, gallop2: 1400, neigh: 2500, march: 2000, win: 3000, launch: 200, grenade: 300, cry: 1200, steps: 1100, tramp: 1100, cut: 300, robot: 2500, armor: 200, smash: 300, sword: 300, axe: 300, minigun: 400, mg2: 250, clank: 300, heal: 900, panic: 3000, whistle: 1500 };
const SND = {};
for (const k in (window.SOUNDS || {})) { SND[k] = new Audio(window.SOUNDS[k]); SND[k].preload = 'auto'; }
// Hintergrundkulisse als leise Schleife
let ambient = null;
function setAmbient(on) {
  if (!SND.ambient) return;
  if (!ambient) { ambient = SND.ambient; ambient.loop = true; ambient.volume = 0.22; }
  try { if (on) { const p = ambient.play(); if (p && p.catch) p.catch(() => {}); } else ambient.pause(); } catch (e) {}
}
function playSound(name, vol = 0.6) {
  if (!soundOn || !SND[name]) return;
  const t = performance.now(); if (lastSnd[name] != null && t - lastSnd[name] < (SND_GAP[name] || 100)) return; lastSnd[name] = t;   // nicht mehrfach im selben Augenblick
  window.__sndBy = window.__sndBy || {}; window.__sndBy[name] = (window.__sndBy[name] || 0) + 1;
  window.__snd = (window.__snd || 0) + 1;
  try { const a = SND[name].cloneNode(); a.volume = vol; a.playbackRate = 0.94 + Math.random() * 0.12; const p = a.play(); if (p && p.catch) p.catch(() => {}); } catch (e) {}
}

// ---------- Effekte ----------
function burst(x, y, n, cols, o = {}) {
  for (let i = 0; i < n; i++) particles.push({ x, y, vx: (Math.random() - 0.5) * L.s * (o.spread || 0.12), vy: -Math.random() * L.s * (o.up || 0.14), g: L.s * 0.008,
    life: 16 + Math.random() * 16, col: cols[i % cols.length], s: L.s * (0.03 + Math.random() * 0.04) });
}
const BOOM_IMG = { he: ['expl'], dust: ['dirt1', 'dirt2'], gas: ['gas2'], blood: ['splash'], smoke: ['smokeL1', 'smokeL2', 'smokeD'] };
function boom(x, y, r, kind, delay = 0) {
  const cols = kind === 'gas' ? [['#a9bd3a', 1], ['#d6e670', 0.6]] : kind === 'dust' ? [['#8a7a52', 1], ['#b7a678', 0.55]] : kind === 'blood' ? [['#8a1a14', 1]] : kind === 'smoke' ? [['#77736a', 1]] : [['#e8762a', 1], ['#ffd15a', 0.62], ['#fff6c4', 0.3]];
  const opts = BOOM_IMG[kind] || [], life = kind === 'smoke' ? 70 : kind === 'he' ? 30 : 24;
  booms.push({ x, y, r, cols, kind, img: opts[Math.floor(Math.random() * opts.length)], flip: Math.random() < 0.5, life, max: life, delay });
  if (kind === 'he') { boom(x, y, r * 0.9, 'dust'); boom(x, y - r * 0.2, r * 0.9, 'smoke', 14); }
}
function floater(x, y, text, col, big, hold) { const life = hold ? 210 : 60 / speed + 22; floaters.push({ x, y, text, col, life, max: life, big, hold }); }
function bodyPos(id) { const d = DU.get(id), u = unitById(id), k = u ? TYPES[u.type].cls : 'inf'; return [d.x, d.y - L.s * (k === 'walker' ? 1.0 : 0.55)]; }
function headPos(id) { const d = DU.get(id), u = unitById(id), k = u ? TYPES[u.type].cls : 'inf'; return [d.x, d.y - L.s * (k === 'walker' ? 2.0 : k === 'cav' ? 1.7 : 1.45)]; }

// ---------- Ereignis-Animation ----------
const wait = ms => new Promise(r => setTimeout(r, ms / speed));
const raf = () => new Promise(r => requestAnimationFrame(r));
async function animPath(id, path, msPer) {
  const d = DU.get(id);
  for (let i = 1; i < path.length; i++) {
    const [x0, y0] = center(path[i - 1][0], path[i - 1][1]), [x1, y1] = center(path[i][0], path[i][1]);
    if (x1 !== x0) d.face = x1 > x0 ? 0 : 3;
    const dur = msPer / speed, t0 = performance.now();
    for (let k = 0; k < 1;) { await raf(); k = Math.min(1, (performance.now() - t0) / dur); d.x = x0 + (x1 - x0) * k; d.y = y0 + (y1 - y0) * k; }
  }
}
const unitById = id => G.units.find(u => u.id === id);
const nm = u => `${TYPES[u.type].name} (${SIDES[u.side].short})`;

async function playEvent(e) {
  const u = e.u != null ? unitById(e.u) : null, s = L.s;
  switch (e.t) {
    case 'move': { const k0 = TYPES[u.type].cls; if (k0 === 'cav') playSound('gallop2', 0.55); else if (u.limbered) playSound('gallop', 0.5); else if (k0 === 'walker') playSound(TYPES[u.type].fig ? 'mech' : 'tank', 0.5); else if (TYPES[u.type].mech) playSound('mech', 0.45); else { if (TYPES[u.type].fig === 'dog') playSound('dog', 0.5); playSound(e.path.some(h => G.map[h[0]][h[1]].t === 'mud') ? 'steps' : 'tramp', 0.5); } } await animPath(e.u, e.path, TYPES[u.type].cls === 'cav' ? 110 : 170); break;
    case 'advance': await animPath(e.u, e.path, 200); break;
    case 'fallback': await animPath(e.u, e.path, 200); floater(...headPos(e.u), 'weicht zurück', '#f0d27a'); break;
    case 'flee': await animPath(e.u, e.path, 120); break;
    case 'face': DU.get(e.u).face = e.face; break;
    case 'fire': {
      const a = DU.get(e.a), [x1, y1] = bodyPos(e.a), [x2, y2] = bodyPos(e.d);
      if (e.face != null && !e.reaction) a.face = e.face; else a.face = x2 >= x1 ? 0 : 3;
      if (e.reaction) floater(...headPos(e.a), 'Reaktionsfeuer!', '#ffd860');
      if (e.kind === 'flame') { playSound('flame', 0.6); flames.push({ x1, y1, x2, y2, life: 26, max: 26 }); await wait(420); }
      else {
        const mini = e.kind === 'minigun', mg = e.kind === 'mg' || mini, can = e.kind === 'cannon', au = unitById(e.a), ang = Math.atan2(y2 - y1, x2 - x1);
        playSound(e.kind === 'rifle' ? 'rifle' : mini ? 'minigun' : mg ? (au && au.side === 'D' ? 'mg2' : 'mg') : 'cannon', mg ? 0.55 : 0.6);
        if (mini) muzzles.push({ img: 'muzzle', x: x1 + Math.cos(ang) * s * 0.3, y: y1 + Math.sin(ang) * s * 0.3, ang, sz: 0.8, off: 0.12, life: 24, max: 24 });
        else if (mg && PJI.mgfire) muzzles.push({ img: 'mgfire', x: x1 + Math.cos(ang) * s * 0.25, y: y1 + Math.sin(ang) * s * 0.25, ang, sz: 0.85, off: 0.02, life: 26, max: 26 });
        else if (can) muzzles.push({ img: 'dust', x: x1 + Math.cos(ang) * s * 0.5, y: y1 + Math.sin(ang) * s * 0.5, ang, sz: 0.6, off: 0.15, life: 26, max: 26 });
        tracers.push({ x1: x1 + (x2 > x1 ? 1 : -1) * s * 0.5, y1, x2, y2, life: mg ? 26 : 15, max: mg ? 26 : 15, n: mg ? 5 : 1, col: can ? '#ff9a3a' : '#ffe27a', img: mg ? 'burst' : can ? 'shard' : 'bullet', sz: mg ? 0.5 : can ? 0.34 : 0.2 });
        await wait((mg ? 26 : 15) * 16.667 * 0.9);
        if (can) { boom(x2, y2 + s * 0.4, s * 0.5, 'he'); playSound('boom', 0.45); }
      }
      break;
    }
    case 'shell': {
      const a = DU.get(e.a), [x1, y1] = bodyPos(e.a), [x2, y2] = center(e.c, e.r);
      a.face = e.face; playSound(TYPES[unitById(e.a).type].mobile ? 'launch' : 'cannon', 0.7);   // Mörser: Mörserton, Geschütze: Kanonenschuss
      if (PJI.dust) muzzles.push({ img: 'dust', x: x1 + (x2 > x1 ? 1 : -1) * s * 0.4, y: y1 - s * 0.15, ang: x2 > x1 ? -0.6 : Math.PI + 0.6, sz: 0.7, off: 0.15, life: 30, max: 30 }); else boom(x1 + (x2 > x1 ? 1 : -1) * s * 0.7, y1, s * 0.35, 'he');
      const dur = 34;   // in 60-Hz-Bildern bei Tempo 1; wait() teilt durch das Tempo wie die Flugbahn
      shells.push({ x1, y1, x2, y2, t: 0, dur, col: e.mode === 'gas' ? '#c4d646' : '#2a2a26', img: TYPES[unitById(e.a).type].mobile ? (PJI.rocket ? 'rocket' : 'shellB') : 'shellA', sz: 0.4 });
      await wait(dur * 16.667);
      if (e.scatter) floater(x2, y2 - s, 'Streuung!', '#f0d27a');
      if (e.guided) floater(x2, y2 - s * 1.5, '◉ gelenkt ×1,25', '#bfe0f2', false, true);
      playSound(e.mode === 'gas' ? 'gas' : e.mode === 'barrage' ? 'barrage' : 'boom', 0.7);
      if (e.mode === 'he') { boom(x2, y2, s * 0.95, 'he'); burst(x2, y2, 16, ['#5a4632', '#3d3024', '#8a7a52'], { up: 0.3, spread: 0.3 }); }
      else if (e.mode === 'gas') boom(x2, y2, s * 1.0, 'gas');
      else { boom(x2, y2, s * 0.7, 'he'); E.neighbors(e.c, e.r).forEach(([c, r], i) => { const [bx, by] = center(c, r); boom(bx, by, s * 0.6, i % 2 ? 'dust' : 'he', 3 + i * 3); }); }
      await wait(e.mode === 'barrage' ? 420 : 260); break;
    }
    case 'melee': case 'counter': {
      const a = DU.get(e.a), d = DU.get(e.d);
      if (e.face != null) a.face = e.face; else a.face = d.x >= a.x ? 0 : 3;
      const au = unitById(e.a), du = unitById(e.d), af = au && TYPES[au.type].fig, armored = du && TYPES[du.type].cls === 'walker';
      if (e.t === 'melee') playSound(au && TYPES[au.type].mech ? 'smash' : af === 'shield' ? 'sword' : af === 'raider' ? 'axe' : au && TYPES[au.type].cls === 'storm' ? 'grenade' : 'cry', 0.55);
      let thrown = false;
      { const kc = au && TYPES[au.type].cls; if (e.t === 'melee' && (kc === 'inf' || kc === 'storm') && af !== 'shield' && af !== 'raider') (thrown = true, shells.push({ x1: a.x, y1: a.y - s * 0.5, x2: d.x, y2: d.y - s * 0.2, t: 0, dur: 16, arc: 0.9, spin: true, img: au.side === 'A' ? 'pine' : 'stick', sz: 0.3 })); }
      a.lunge = { dx: (d.x - a.x) * 0.38, dy: (d.y - a.y) * 0.38 }; await wait(thrown ? 16 * 16.667 : 140);   // Handgranate: Knall erst beim Aufschlag
      const mx = (a.x + d.x) / 2 + (d.x - a.x) * 0.2, my = (a.y + d.y) / 2 - s * 0.5;
      boom(mx, my + s * 0.25, s * 0.38, 'dust'); burst(mx, my, 8, ['#fff1c0', '#d9d2bd'], { spread: 0.2 });
      if (au && TYPES[au.type].mech && TYPES[au.type].cls === 'walker' && PJI.hammer) muzzles.push({ img: 'hammer', x: d.x, y: d.y + s * 0.35, center: true, up: 0.75, sz: 1.7, life: 34, max: 34 });
      if (af === 'drill') muzzles.push({ img: 'crash', x: d.x, y: d.y + s * 0.3, center: true, up: 0.9, sz: 1.3, life: 30, max: 30 });
      if (armored || af === 'drill' || af === 'mechA') { if (armored) playSound('armor', 0.6); muzzles.push({ img: 'sparks', x: d.x, y: d.y - s * 0.45, center: true, sz: 0.95, life: 22, max: 22 }); }
      await wait(170); a.lunge = null; await wait(70); break;
    }
    case 'hit': {
      const d = DU.get(e.u), [x, y] = bodyPos(e.u);
      if (E.isMech(u.type)) playSound('robot', 0.5);
      d.str = e.str; d.mor = e.morv; d.shake = 1; setTimeout(() => d.shake = 0, 260 / speed);
      if (!e.panic) {
        if (TYPES[u.type].cls === 'cav' || u.limbered) playSound('neigh', 0.5);
        burst(x, y + s * 0.3, 8, ['#5a4632', '#3d3024', '#7a6448'], { up: 0.16 });
        if (blood && TYPES[u.type].cls !== 'walker') { const nb = Math.min(5, 1 + Math.round(e.dmg * 2)); burst(x, y, 6 + nb * 3, ['#9a1612', '#74100c', '#b3221a'], { up: 0.16, spread: 0.2 });
          boom(x, y + s * 0.5, s * 0.34, 'blood');
          for (let q = 0; q < nb; q++) decals.push({ v: 1 + Math.floor(Math.random() * 4), x: d.x + (Math.random() - 0.5) * s * 1.1, y: d.y + (Math.random() - 0.3) * s * 0.7 * K, r: s * (0.06 + Math.random() * 0.13), col: Math.random() < 0.5 ? 'rgba(110,16,12,0.62)' : 'rgba(78,10,8,0.6)' });
          while (decals.length > 700) decals.shift(); }
        floater(...headPos(e.u), '−' + fmt(e.dmg), e.dmg >= 1.5 ? '#ff6a4a' : '#ff9a7a', e.dmg >= 1.5, true);
        if (human(G.side) || human(u.side)) toast(`${nm(u)}: −${fmt(e.dmg)} Stärke · ${e.dmg >= 2 ? 'schwerer Treffer' : e.dmg >= 1 ? 'guter Treffer' : e.dmg >= 0.4 ? 'leichter Treffer' : 'kaum Wirkung'} · noch ${fmt(e.str)}`);
      } else floater(...headPos(e.u), 'Panik', '#f0d27a');
      await wait(e.panic ? 180 : 300); break;
    }
    case 'gas': { const d = DU.get(e.u); d.str = e.str; d.mor = e.morv; floater(...headPos(e.u), 'Gas!', '#d6e670'); await wait(220); break; }
    case 'fear': { DU.get(e.u).mor = e.morv; floater(...headPos(e.u), 'Schreck: Moral −1', '#f0d27a'); await wait(200); break; }
    case 'supp': floater(...headPos(e.u), 'niedergehalten', '#e9cf5a'); await wait(170); break;
    case 'rout': playSound('panic', 0.4); floater(...headPos(e.u), 'flieht!', '#ffffff', true); toast(`${nm(u)} flieht.`); await wait(360); break;
    case 'destroyed': {
      const d = DU.get(e.u); floater(...headPos(e.u), 'aufgerieben', '#ff6a50', true); toast(`${nm(u)} ist aufgerieben.`);
      if (TYPES[u.type].cls === 'walker' || TYPES[u.type].cls === 'art') { boom(d.x, d.y, s * 1.1, 'he'); playSound('boom2', 0.75); }
      else if (blood) { boom(d.x, d.y, s * 0.6, 'blood'); decals.push({ v: 3, x: d.x, y: d.y, r: s * 0.36, col: 'rgba(84,10,8,0.6)' }); for (let q = 0; q < 6; q++) decals.push({ v: 1 + Math.floor(Math.random() * 4), x: d.x + (Math.random() - 0.5) * s * 1.3, y: d.y + (Math.random() - 0.5) * s * 0.9 * K, r: s * (0.08 + Math.random() * 0.14), col: 'rgba(110,16,12,0.6)' }); burst(d.x, d.y - s * 0.4, 18, ['#9a1612', '#74100c'], { up: 0.2, spread: 0.3 }); }
      for (let k = 0; k < 10; k++) { d.alpha = 1 - k / 10; await wait(28); } d.alpha = 0; break;
    }
    case 'escaped': DU.get(e.u).alpha = 0; toast(`${nm(u)} hat das Schlachtfeld verlassen.`); break;
    case 'officer': toast(`${e.name} ist gefallen.`); floater(...headPos(e.u), e.name + ' fällt', '#ff6a50', true); await wait(300); break;
    case 'sent': { playSound('dog', 0.55); const d = DU.get(e.u), m = DU.get(e.by); if (m) m.face = d.x >= m.x ? 0 : 3; floater(...headPos(e.u), '+1 Aktion', '#7fd8ff', true); await wait(300); break; }
    case 'order': {
      const d0 = DU.get(e.u), rl = e.kind === 'rally'; playSound(rl ? 'stand' : 'forward', 0.75);
      toast(`${e.name}: ${rl ? 'Sammeln!' : 'Sturmbefehl!'}`); floater(...headPos(e.u), rl ? 'Sammeln!' : 'Vorwärts!', rl ? '#b8ff7c' : '#ffb04a', true);
      for (let q = 0; q < 2; q++) rings.push({ x: d0.x, y: d0.y, r: 2.6 + q * 1.4, col: rl ? '#b8ff7c' : '#ffb04a', life: 34 + q * 10, max: 34 + q * 10 });
      await wait(260);
      e.ids.forEach((id, i) => { const dd = DU.get(id); if (!dd) return; if (rl) dd.mor = e.mors[i]; if (id !== e.u) floater(...headPos(id), rl ? 'Moral +' : 'Sturm!', rl ? '#b8ff7c' : '#ffb04a'); });
      await wait(260); break;
    }
    case 'rally': floater(...headPos(e.u), 'gesammelt!', '#b8ff7c', true); toast(`${e.by} sammelt ${TYPES[u.type].name}.`); DU.get(e.u).face = u.face; await wait(300); break;
    case 'cut': { playSound('cut', 0.7); const [x, y] = center(e.c, e.r); burst(x, y - s * 0.2, 10, ['#c8ccd0', '#ffe090'], { spread: 0.2 }); floater(x, y - s, 'Draht geschnitten', '#e6e9ec'); renderTerrain(); await wait(280); break; }
    case 'crush': { const [x, y] = center(e.c, e.r); boom(x, y, s * 0.5, 'dust'); floater(x, y - s * 1.2, 'Draht niedergewalzt', '#e6e9ec'); renderTerrain(); await wait(160); break; }
    case 'terrain': { renderTerrain(); if (e.what) { const [x, y] = center(e.c, e.r); floater(x, y - s * 0.6, e.what, '#e6e9ec'); } break; }
    case 'stuck': { playSound('crash', 0.65); const d0 = DU.get(e.u); muzzles.push({ img: 'mudsplash', x: d0.x, y: d0.y + s * 0.4, center: true, up: 0.85, sz: 1.8, life: 56, max: 56 }); } playSound('steps', 0.7); floater(...headPos(e.u), 'steckt im Schlamm', '#d9c9a0'); await wait(250); break;
    case 'breakdown': { const d0 = DU.get(e.u); muzzles.push({ img: 'engine', x: d0.x + s * 0.1, y: d0.y + s * 0.35, center: true, up: 0.92, sz: 2.3, life: 80, max: 80 }); }
      if (TYPES[u.type].fig) { const d0 = DU.get(e.u); muzzles.push({ img: 'bolt', x: d0.x - s * 0.5, y: d0.y - s * 0.7, ang: -0.25, sz: 0.55, off: 0.1, life: 34, max: 34 }); }
      playSound('glitch', 0.6); floater(...headPos(e.u), 'Panne!', '#ffb04a', true); toast(`${nm(u)} bleibt mit einer Panne liegen.`); await wait(350); break;
    case 'repaired': floater(...headPos(e.u), 'wieder flott', '#b8ff7c'); await wait(200); break;
    case 'unstuck': floater(...headPos(e.u), 'wieder frei', '#b8ff7c'); await wait(150); break;
    case 'recovered': { playSound('clank', 0.7); floater(...headPos(e.u), e.broken ? 'instand gesetzt' : 'geborgen', '#b8ff7c', true); await wait(320); break; }
    case 'setup': { playSound('clank', 0.5); floater(...headPos(e.u), 'aufgebaut', '#ffe7a0'); await wait(200); break; }
    case 'ow': floater(...headPos(e.u), 'Feuerbereit', '#9fd8ff', true); await wait(220); break;
    case 'march': floater(...headPos(e.u), 'Marsch', '#ffd27a'); break;
    case 'retreatmove': floater(...headPos(e.u), 'Rückzug', '#ffd27a'); break;
    case 'wind': toast('Der Wind dreht.'); updateTop(); break;
    case 'limber': playSound('clank', 0.6); floater(...headPos(e.u), e.on ? 'aufgeprotzt' : 'abgeprotzt', '#e9d9a8'); await wait(220); break;
    case 'spawn': { playSound('whistle', 0.5); addDU(u); const d = DU.get(e.u), [x] = center(u.c, u.r), dir = u.side === 'A' ? -1 : 1; toast(`Nachschub: ${nm(u)} trifft ein.`);
      for (let k = 0; k < 16; k++) { d.x = x + dir * s * 2 * (1 - (k + 1) / 16); await raf(); } floater(...headPos(e.u), 'Nachschub', '#b8ff7c'); await wait(200); break; }
    case 'heal': { playSound('heal', 0.5); const d = DU.get(e.u); d.str = e.str; d.mor = e.morv; if (e.by != null) { const m = DU.get(e.by); m.face = d.x >= m.x ? 0 : 3; shells.push({ x1: m.x, y1: m.y - s * 0.5, x2: d.x, y2: d.y - s * 0.4, t: 0, dur: 14, arc: 0.5, img: 'bandage', sz: 0.34 }); await wait(240); }
      rings.push({ x: d.x, y: d.y - s * 0.55, r: 0.8, img: ['crossF1', 'crossF2', 'crossF3', 'crossG'][Math.floor(Math.random() * 4)], life: 50, max: 50 }); floater(...headPos(e.u), 'versorgt +1,5', '#8fe0c8', true); await wait(350); break; }
    case 'gascloud': break;
    case 'reinf': {
      for (const id of e.ids) { const nu = unitById(id); addDU(nu); const d = DU.get(id); d.x += s * 2; }
      banner('Gegenstoß der Aschenwacht', 'Sturmbrecher und Brandwerfer treffen ein'); playSound('march', 0.45);
      await Promise.all(e.ids.map(async id => { const d = DU.get(id), nu = unitById(id), [x] = center(nu.c, nu.r); for (let k = 0; k < 20; k++) { d.x = x + s * 2 * (1 - (k + 1) / 20); await raf(); } }));
      await wait(900); break;
    }
  }
}
function play(events) {
  queue.push(...events);
  if (!qRunning) runQueue();
  return new Promise(res => { const chk = () => (!qRunning && !queue.length) ? res() : setTimeout(chk, 30); chk(); });
}
async function runQueue() {
  qRunning = true;
  while (queue.length) { const e = queue.shift(); try { await playEvent(e); } catch (err) { console.error(err); } }
  syncAll(); qRunning = false; updateUI();
  if (G.over) setTimeout(showEnd, 500);
}

// ---------- Eingabe ----------
function evToPx(ev) { const r = cv.getBoundingClientRect(); return [(ev.clientX - r.left) * cv.width / r.width, (ev.clientY - r.top) * cv.height / r.height]; }
// Was liegt unter dem Zeiger? h = Feld, uHex = Einheit auf diesem Feld, uFig = vorderste Figur, deren Körper man dort sieht
function pick(x, y) {
  const h = pixToHex(x, y), uHex = h ? E.unitAt(G, h[0], h[1]) : null;
  let uFig = null;
  for (const u of G.units) {
    if (!E.alive(u)) continue;
    const d = DU.get(u.id);
    if (Math.abs(x - d.x) < L.s * 0.42 && y < d.y + L.s * K * 0.5 && y > d.y - L.s * Math.min(0.62, SQ3 * K * 0.55)) if (!uFig || d.y > DU.get(uFig.id).y) uFig = u;
  }
  return { h, uHex, uFig };
}
function unitAtPixel(x, y) { const p = pick(x, y); return p.uFig || p.uHex; }
const targetOf = p => p.uHex && targets.has(p.uHex.id) ? p.uHex : p.uFig && targets.has(p.uFig.id) ? p.uFig : null;
let drag = null, dragged = 0;
cv.addEventListener('pointerdown', ev => { lastPT = ev.pointerType || 'touch'; if (ev.pointerType === 'mouse') drag = { x: ev.clientX, y: ev.clientY, sl: board.scrollLeft, st: board.scrollTop, moved: false }; });
window.addEventListener('pointerup', () => { if (drag && drag.moved) dragged = performance.now(); drag = null; cv.style.cursor = ''; });
board.addEventListener('wheel', ev => { if (ev.ctrlKey || ev.shiftKey) return; const canV = board.scrollHeight > board.clientHeight + 2; if (!canV && board.scrollWidth > board.clientWidth + 2) { board.scrollLeft += ev.deltaY; ev.preventDefault(); } }, { passive: false });
cv.addEventListener('pointermove', ev => {
  if (drag && (ev.buttons & 1)) { const dx = ev.clientX - drag.x, dy = ev.clientY - drag.y; if (drag.moved || Math.hypot(dx, dy) > 8) { drag.moved = true; cv.style.cursor = 'grabbing'; board.scrollLeft = drag.sl - dx; board.scrollTop = drag.st - dy; return; } }
  if (!G || ev.pointerType !== 'mouse') return;
  const [x, y] = evToPx(ev), p = pick(x, y);
  hoverHex = p.h;
  const movable = sel && !busy && p.h && reach.has(E.key(p.h[0], p.h[1]));
  hoverU = movable ? null : (p.uFig || p.uHex);
  if (sel && !busy) { const np = targetOf(p); if (np !== previewT) { previewT = np; updateHud(); } }
});
cv.addEventListener('pointerleave', () => { hoverHex = null; hoverU = null; });
cv.addEventListener('click', ev => {
  if (performance.now() - dragged < 250) return;   // war ein Verschieben, kein Klick
  if (!G || busy || G.over || !human(G.side)) return;
  const [x, y] = evToPx(ev), p = pick(x, y), h = p.h;
  if (placing) { if (h && spawnSet.has(E.key(h[0], h[1]))) return doBuy(h[0], h[1]); return; }
  if (sel) {
    // Mit gewählter Einheit zählt zuerst das Feld: Ziel, Zugfeld oder Beschussfeld, egal welche Figur davorsteht
    if (TYPES[sel.type].cls === 'art' && h && shellHexes.has(E.key(h[0], h[1]))) return doShell(h[0], h[1]);
    const tu = targetOf(p);
    if (tu) { if (previewT === tu || lastPT === 'mouse') return doAttack(tu); previewT = tu; updateHud(); return; }
    if (h && reach.has(E.key(h[0], h[1]))) return doMove(h[0], h[1]);
  }
  const u = p.uFig || p.uHex;
  { const hu = [p.uHex, p.uFig].find(q => q && healSet.has(q.id)); if (sel && hu) return act(m => E.heal(G, m, hu)); }
  { const ru = [p.uHex, p.uFig].find(q => q && recSet.has(q.id)); if (sel && ru) return act(m => E.recover(G, m, ru)); }
  { const su = [p.uHex, p.uFig].find(q => q && sendSet.has(q.id)); if (sel && su) return act(m => E.sendOrder(G, m, su)); }
  if (u && u.side === G.side && E.active(u)) return select(u);
  if (u) { select(null); inspect = { unit: u }; updateHud(); return; }
  select(null);
  if (h) { inspect = { hex: h }; updateHud(); }
});

function select(u) {
  sel = u; previewT = null; inspect = null; artMode = 'he'; atkPref = 'auto';
  computeOptions(); updateHud();
}
function computeOptions() {
  reach = new Map(); targets = new Map(); shellHexes = new Set(); rangeSet = new Set(); healSet = new Set(); sightSet = new Set(); scoutSet = new Set();
  if (!sel || !E.active(sel) || sel.side !== G.side) return;
  if (TYPES[sel.type].relay) for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) { const dd = E.dist(sel.c, sel.r, c, r); if (dd > 0 && dd <= TYPES[sel.type].spot && E.hasLOS(G, sel.c, sel.r, c, r)) sightSet.add(E.key(c, r)); }
  reach = E.reachable(G, sel);
  for (const [k, n] of E.reachable(G, sel, { march: true })) if (!reach.has(k)) reach.set(k, n);   // Marsch: gelbe Felder
  recSet = new Set(); if (TYPES[sel.type].recover) for (const o of G.units) if (E.canRecover(G, sel, o)) recSet.add(o.id);
  if (TYPES[sel.type].cls === 'medic') for (const o of G.units) if (E.canHeal(G, sel, o)) healSet.add(o.id);
  sendSet = new Set(); if (TYPES[sel.type].courier) for (const o of G.units) if (E.canSend(G, sel, o)) sendSet.add(o.id);
  { const T0 = TYPES[sel.type], can = T0.cls === 'art' ? (!sel.limbered && !sel.attacked && sel.ap >= (T0.mobile ? 1 : 2) && !sel.supp) : (T0.rng > 1 && !sel.attacked && sel.ap >= 1 && (!T0.mg || sel.setup));
    if (can) for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) { const d = E.dist(sel.c, sel.r, c, r); if (d >= 1 && d <= (T0.cls === 'art' ? T0.rng : E.rangeOf(G, sel, c, r))) rangeSet.add(E.key(c, r)); } }
  if (TYPES[sel.type].cls === 'art') {
    const foe = (c, r) => { const x = E.unitAt(G, c, r); return x && x.side !== sel.side; };
    for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) {
      if (!E.canShell(G, sel, c, r, artMode)) continue;
      const ok = artMode === 'he' ? (foe(c, r) || G.map[c][r].t === 'wire')
        : artMode === 'barrage' ? [[c, r], ...E.neighbors(c, r)].some(h => foe(h[0], h[1]))
        : E.gasCells(G, c, r).some(h => foe(h[0], h[1]));
      if (ok) { shellHexes.add(E.key(c, r));
        if (E.guided(G, sel.side, c, r)) scoutSet.add(E.key(c, r)); }
    }
    return;
  }
  for (const d of G.units) {
    if (d.side === sel.side || !E.alive(d)) continue;
    const m = E.canMelee(G, sel, d), f = E.canFire(G, sel, d);
    if (m && f) { const pm = E.preview(G, sel, d, 'melee'), pf = E.preview(G, sel, d, 'fire'); targets.set(d.id, { id: d.id, both: true, kind: atkPref !== 'auto' ? atkPref : (pf.dmg > pm.dmg - pm.counter ? 'fire' : 'melee') }); }
    else if (m) targets.set(d.id, { id: d.id, kind: 'melee' });
    else if (f) targets.set(d.id, { id: d.id, kind: 'fire' });
  }
}
async function act(fn) {
  busy = true; const u = sel;
  previewT = null; recSet = new Set(); reach = new Map(); targets = new Map(); shellHexes = new Set(); rangeSet = new Set(); healSet = new Set(); sendSet = new Set(); sightSet = new Set(); scoutSet = new Set(); updateHud();
  await play(fn(u));
  busy = false;
  sel = (u && E.active(u) && u.ap >= 1) ? u : null;
  computeOptions(); updateUI();
}
const doMove = (c, r) => act(u => E.moveUnit(G, u, c, r));
const doAttack = d => { const t = targets.get(d.id); return act(u => t.kind === 'fire' ? E.fire(G, u, d) : E.melee(G, u, d)); };
const doShell = (c, r) => { const m = artMode; return act(u => E.shell(G, u, c, r, m)); };

// ---------- Nachschub ----------
function openShop() {
  if (busy || G.over || !human(G.side)) return;
  const sd = G.side;
  $('shopPts').textContent = G.pts[sd];
  $('shopList').innerHTML = E.SHOP[sd].filter(t => G.mechs || !E.isMech(t)).map(t => { const T = TYPES[t], ok = E.canBuy(G, sd, t) && E.spawnHexes(G, sd, t).length;
    return `<button class="item ${sd}" data-t="${t}" ${ok ? '' : 'disabled'}><canvas data-k="${figOf(T)}"></canvas><b>${T.name}</b><span class="cost">★ ${E.COST[t]}</span><small>${T.can}</small></button>`; }).join('');
  $('shop').hidden = false;
  requestAnimationFrame(() => $('shopList').querySelectorAll('canvas').forEach(c => drawPortrait(c, c.dataset.k, sd)));
  $('shopList').querySelectorAll('.item').forEach(b => b.onclick = () => {
    $('shop').hidden = true; select(null);
    placing = b.dataset.t; spawnSet = new Set(E.spawnHexes(G, sd, placing).map(h => E.key(h[0], h[1]))); updateHud();
  });
}
function cancelPlace() { placing = null; spawnSet = new Set(); updateHud(); }
async function doBuy(c, r) {
  const t = placing; placing = null; spawnSet = new Set();
  busy = true; await play(E.buy(G, G.side, t, c, r)); busy = false; updateUI();
}

// ---------- Rundenablauf ----------
async function endTurn() {
  if (busy || G.over) return;
  placing = null; spawnSet = new Set();
  select(null); busy = true;
  const ev = E.endTurn(G);
  updateUI();
  await play(ev);
  busy = false; updateUI();
  if (G.over) return;
  if (mode === 'hot') return showHandover();
  if (!human(G.side)) await aiTurn();
}
async function aiTurn() {
  busy = true; updateUI();
  await wait(300);
  { const bev = AI.buy(G); if (bev.length) await play(bev); }
  let guard = 0;
  while (!G.over && guard++ < 300) {
    const a = AI.next(G);
    if (!a) break;
    for (const s of a.steps) { const ev = AI.exec(G, a.u, s); if (ev.length) await play(ev); if (G.over) break; }
    await wait(60);
  }
  if (G.over) { busy = false; return; }
  await play(E.endTurn(G));
  busy = false; updateUI();
}

// ---------- Anzeige ----------
let toastT = 0;
function toast(text) { const el = $('toast'); el.textContent = text; el.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('on'), 3800); }
function banner(title, sub) {
  const el = $('banner'); el.innerHTML = `<b>${title}</b><span>${sub || ''}</span>`;
  el.classList.remove('on'); void el.offsetWidth; el.classList.add('on');
}
function updateTop() {
  $('turn').textContent = `Runde ${G.turn}/${G.maxT}`;
  const ch = $('sidechip'); ch.className = 'chip ' + G.side; ch.textContent = SIDES[G.side].short + (human(G.side) ? '' : ' · KI');
  { const D = (window.FXDATA || {}).flags || {}, fs = G.side === 'D' ? D['flagD' + flagSel.D] : skinA === 'F' ? D['flagF' + flagSel.F] : D['flagA' + flagSel.A]; const fi = $('sideFlag'); if (fs && fi.getAttribute('src') !== fs) fi.src = fs; fi.hidden = !fs; }
  $('windArrow').style.transform = `rotate(${WIND_DEG[G.wind]}deg)`;
  for (const sd of ['A', 'D']) {
    const v = 1 - E.losses(G, sd), el = $('meter' + sd);
    el.style.setProperty('--v', Math.max(0, v)); el.style.setProperty('--brk', 1 - P.BREAK[sd]);
    el.querySelector('span').textContent = `${SIDES[sd].short} ${Math.round(v * 100)} %`;
  }
  $('objs').innerHTML = OBJECTIVES.map(o => `<span class="obj ${G.ctrl[o.id]}" title="${o.name}">${OBJECTIVES.length > 4 ? '' : '⚑ '}${o.pts}</span>`).join('') + `<span class="pts">${E.points(G)}/${G.winA}</span>`;
}
// Einheiten, die in dieser Runde nichts mehr tun können (gezogen und kein Ziel mehr, oder „Fertig“ gedrückt)
const spent = new Set();
function hasAction(u) {
  if (u.broken > 0) return false;
  if (u.ap < 1) return false;
  if (!u.supp && E.reachable(G, u).size) return true;
  if (E.canOrder(G, u) || G.units.some(o => E.canSend(G, u, o) || E.canRecover(G, u, o))) return true;
  if (E.canSetup(G, u)) return true;
  if (u.attacked) return false;
  const T = TYPES[u.type];
  if (T.cls === 'medic') return G.units.some(o => E.canHeal(G, u, o));
  if (T.cls === 'art') { for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) if (E.canShell(G, u, c, r, 'he')) return true; }
  if (E.canCut(G, u)) return true;
  return G.units.some(d => d.side !== u.side && E.alive(d) && (E.canFire(G, u, d) || E.canMelee(G, u, d)));
}
function refreshSpent() { spent.clear(); if (!G || G.over || !human(G.side)) return; for (const u of G.units) if (u.side === G.side && E.active(u) && !hasAction(u)) spent.add(u.id); }
function updateUI() {
  if (!G) return;
  refreshSpent();
  updateTop();
  const be = $('btnEnd');
  be.disabled = busy || !!G.over || !human(G.side);
  be.textContent = !human(G.side) && !G.over ? 'KI zieht …' : 'Runde beenden';
  const bs = $('btnShop'), hs = human(G.side) ? G.side : (mode === 'hot' ? G.side : mode);
  bs.disabled = busy || !!G.over || !human(G.side); bs.innerHTML = `Nachschub <b>★ ${G.pts[hs]}</b>`;
  if (sel && (!E.active(sel) || sel.side !== G.side)) sel = null;
  computeOptions(); updateHud();
}
function drawPortrait(canvas, kind, side) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2.5), cw = canvas.clientWidth || 84, chh = canvas.clientHeight || 84;
  canvas.width = cw * dpr; canvas.height = chh * dpr;
  const g = canvas.getContext('2d'), W = canvas.width, H = canvas.height;
  const gr = g.createRadialGradient(W / 2, H * 0.55, W * 0.1, W / 2, H * 0.55, W * 0.75);
  gr.addColorStop(0, side === 'A' ? '#8a7a45' : '#5c6f82'); gr.addColorStop(1, '#22231c');
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  g.fillStyle = 'rgba(0,0,0,0.28)'; g.beginPath(); g.ellipse(W / 2, H * 0.88, W * 0.36, H * 0.07, 0, 0, 7); g.fill();
  const t0 = FIG.sprite(kind, side, 0, 100);
  const k0 = Math.min(H * 0.84 / t0.cv.height, W * 0.94 / t0.cv.width);
  const sp = FIG.sprite(kind, side, 0, 100 * k0);
  g.drawImage(sp.cv, Math.round((W - sp.cv.width) / 2), Math.round(H * 0.93 - sp.cv.height));
}
const pill = (k, v, cls = '') => `<div class="pill ${cls}"><small>${k}</small><b>${v}</b></div>`;
const bar = (k, v, max, kind, cls = '') => `<div class="sbar ${kind} ${cls}" title="${k}" style="--v:${Math.max(0, Math.min(1, v / max))}"><i></i><span>${k} ${fmt(v)}</span></div>`;
function updateHud() {
  if (!G) return;
  const hud = $('hud'), u = placing ? null : (sel || (inspect && inspect.unit) || null);
  hud.className = 'hud' + (u ? ' ' + u.side : '');
  if (u && E.alive(u)) {
    const T = TYPES[u.type], h = G.map[u.c][u.r];
    $('portrait').hidden = false; drawPortrait($('portrait'), figU(u), u.side);
    $('hudName').textContent = T.name;
    const st = u.status === 'rout' ? 'flieht' : u.broken > 0 ? 'Panne' : u.supp > 0 ? 'niedergehalten' : u.gassed ? 'im Gas' : null;
    $('hudSub').innerHTML = `${SIDES[u.side].short}${u.officer ? ' · ★ ' + u.officer : ''} · ${h.river && h.t === 'canal' ? 'Fluss' : TERRAIN[h.t].name}${h.ridge ? ' (Höhe)' : ''}${st ? ` · <em>${st}</em>` : ''}`;
    $('hudStats').innerHTML = (u.side === G.side && E.active(u) ? pill('Aktion', '●'.repeat(Math.max(0, u.ap || 0)) + '○'.repeat(Math.max(0, P.AP - (u.ap || 0))) || '–', 'gold') : '') + `<div class="sbars">${bar('Stärke', u.str, 10, 'H', u.str <= 3.3 ? 'bad' : '')}${bar('Moral', u.mor, TYPES[u.type].mor, 'C', u.mor < P.FALLBACK_MOR + 1 ? 'bad' : '')}</div>` +
      pill('Angriff', T.atk || '–') + pill('Abwehr', T.def) + pill('Zug', u.limbered ? P.LIMBER_MV : T.mv) + pill('Schuss', T.rng ? `${T.rng}·${T.fs}` : '–') +
      `<div class="sps">${(u.officer ? ['★ Anführer: gibt Befehle'] : []).concat(T.sp || []).map(x => `<span class="sp">${x}</span>`).join('')}</div>`;
    $('btnInfo').hidden = false;
    let row = '';
    if (previewT && sel) {
      const t = targets.get(previewT.id), p = E.preview(G, sel, previewT, t.kind);
      row = `<div class="prev"><b>${t.kind === 'fire' ? 'Beschuss' : 'Nahkampf'} → ${TYPES[previewT.type].name}</b><span>Schaden ≈ <i>${fmt(p.dmg)}</i></span>${t.kind === 'fire' ? '' : `<span>Gegenschlag ≈ <i>${fmt(p.counter)}</i></span>`}<span class="tags">${p.tags.join(' · ') || 'keine Zu- oder Abschläge'}</span><em>${lastPT === 'mouse' ? 'Klicken' : 'Nochmal tippen'} zum Angreifen</em></div>` + (t.both ? `<button class="act ${t.kind === 'melee' ? 'on' : ''}" data-act="p-melee">⚔ Nahkampf</button><button class="act ${t.kind === 'fire' ? 'on' : ''}" data-act="p-fire">➶ Beschuss</button>` : '');
    } else if (sel && human(sel.side) && sel.side === G.side) {
      const acts = [];
      if (T.cls === 'art') {
        const can = !sel.attacked && sel.ap >= (T.mobile ? 1 : 2) && !sel.supp && !sel.limbered;
        if (E.canLimber(G, sel)) acts.push(`<button class="act" data-act="limber">${sel.limbered ? '⚓ Abprotzen' : '🐎 Aufprotzen'}</button>`);
        if (can) {
          acts.push(`<button class="act ${artMode === 'he' ? 'on' : ''}" data-act="m-he">Sprenggranate</button><button class="act ${artMode === 'barrage' ? 'on' : ''}" data-act="m-barrage">Sperrfeuer</button><button class="act ${artMode === 'gas' ? 'on' : ''}" data-act="m-gas" ${sel.gas > 0 ? '' : 'disabled'}>Gas (${sel.gas})</button>`);
          acts.push(`<span class="hint">${shellHexes.size ? (artMode === 'he' ? 'Trifft ein Feld. Zerstört auch Draht.' : artMode === 'barrage' ? 'Hält Ziel und Nachbarfelder nieder. Kein Schaden.' : 'Wolke treibt 3 Runden mit dem Wind. Trifft auch eigene Truppen.') : 'Kein Ziel: Eine eigene Einheit muss es sehen (5 Felder).'}</span>`);
        } else acts.push(`<span class="hint">${sel.supp ? 'Niedergehalten: kann nicht feuern.' : sel.limbered ? 'Aufgeprotzt: zieht 4 Felder, feuert nicht. Nach dem Abprotzen ab der nächsten Runde feuerbereit.' : 'Hat diese Runde schon gehandelt.'}</span>`);
      } else {
        if ([...targets.values()].some(t => t.both)) acts.push(`<button class="act ${atkPref === 'melee' ? 'on' : ''}" data-act="p-melee">⚔ Nahkampf</button><button class="act ${atkPref === 'fire' ? 'on' : ''}" data-act="p-fire">➶ Beschuss</button>`);
        if (!spent.has(sel.id)) acts.push(`<button class="act pass" data-act="pass" title="Diese Einheit ist für diese Runde fertig">✓ Fertig</button>`);
        if (sel.officer) {
          const ob = (k, ic, lbl, tip) => { const cd = k === 'rally' ? sel.cdR : sel.cdS; return E.canOrderKind(G, sel, k) ? `<button class="act" data-act="o-${k}" title="${tip}">${ic} ${lbl}</button>` : `<button class="act" disabled title="${tip}">${ic} ${lbl}${cd > 0 ? ` (${cd})` : ''}</button>`; };
          acts.push(ob('rally', '📯', 'Sammeln', 'Eigene Truppen in Reichweite: Moral +1,5, Niederhalten endet. Abklingzeit ' + E.orderCd(G, sel, 'rally') + ' Runden.') + ob('storm', '⚔', 'Sturmbefehl', 'Eigene Truppen in Reichweite: Nahkampf ×1,25 in dieser Runde. Abklingzeit ' + E.orderCd(G, sel, 'storm') + ' Runden.'));
        }
        if (T.relay) acts.push(`<span class="hint"><i>◉ Blau:</i> Hier lenkt der Trupp eure Artillerie: keine Streuung, Sprenggranaten ×1,25.</span>`);
        if (T.cls === 'art' && scoutSet.size) acts.push(`<span class="hint"><i>◉ ${scoutSet.size} Felder</i> vom Aufklärer gelenkt: keine Streuung, ×1,25.</span>`);
        if (T.cls === 'medic' && !sel.attacked) acts.push(`<span class="hint">${sel.cdH > 0 ? `Versorgen wieder in ${sel.cdH} Runde${sel.cdH > 1 ? 'n' : ''}.` : healSet.size ? 'Grün: diese Nachbarn kannst du versorgen (Stärke +2,5, Moral +1,5).' : 'Kein verwundeter Nachbar. Zieh neben eine angeschlagene eigene Einheit.'}</span>`);
        if (T.courier && sel.ap >= 1 && !sel.sent) acts.push(`<span class="hint"><i>Blau:</i> Befehl überbringen – angeklickte Einheit bekommt +1 Aktionspunkt.</span>`);
        if (sel.ap >= 1 && !sel.attacked && !sel.supp && !sel.broken) acts.push('<button class="act" data-act="tl">↺ Drehen</button><button class="act" data-act="tr">↻ Drehen</button>');
        if (E.canCut(G, sel)) acts.push(`<button class="act on" data-act="cut">✂ Draht schneiden (${E.cutCost(sel)} ●)</button>`);
        else if (G.map[sel.c][sel.r].t === 'wire' && !sel.attacked) acts.push(`<span class="hint">${['cav', 'art', 'walker'].includes(T.cls) || T.noCut ? 'Kann keinen Draht schneiden.' : `Draht schneiden braucht ${E.cutCost(sel)} Aktionspunkte.`}</span>`);
        if (E.canSetup(G, sel)) acts.push('<button class="act on" data-act="setup" title="MG in Stellung bringen: erst dann feuert es und gibt Reaktionsfeuer. Ziehen baut es wieder ab.">🛠 Aufbauen (1 ●)</button>');
        else if (T.mg && !sel.setup) acts.push('<span class="hint">MG abgebaut: erst aufbauen, dann feuern.</span>');
        if (E.canOverwatch(G, sel)) acts.push('<button class="act" data-act="ow" title="Beide Aktionspunkte: schießt in der gegnerischen Runde auf den ersten Gegner, der sich in Reichweite bewegt (Schaden ×0,8).">◎ Feuerbereitschaft (2 ●)</button>');
        if (recSet.size) acts.push('<span class="hint"><i>Gelb:</i> Koloss bzw. Maschine anklicken zum Bergen (1 ●).</span>');
        else if (T.recover && sel.cdB > 0) acts.push(`<span class="hint">Bergen wieder in ${sel.cdB} Runde${sel.cdB > 1 ? 'n' : ''}.</span>`);
        if (TYPES[sel.type].wirelayer && !sel.attacked) acts.push(E.canLay(G, sel) ? '<button class="act on" data-act="lay" title="Stacheldraht auf das Feld legen, in das die Einheit blickt">⌇ Draht ziehen</button>' : '<span class="hint">Draht ziehen: zum freien Feld drehen (Drehen-Knöpfe).</span>');
        const hint = sel.broken ? 'Panne: fällt diese Runde aus.' : sel.supp ? 'Niedergehalten: kann nicht ziehen.' : sel.ap < 1 ? 'Keine Aktionspunkte mehr.' :
          `${sel.ap} Aktionspunkt${sel.ap > 1 ? 'e' : ''}. ${reach.size ? (sel.mvd ? 'Helle Felder: ziehen (2. Zug halb so weit). ' : [...reach.values()].some(n => n.retreat) ? 'Rückzug aus der Feindberührung: beide Punkte. ' : [...reach.values()].some(n => n.march) ? 'Hell: ziehen (1 ●). Gelb: Marsch (2 ●, danach keine Aktion). ' : 'Helle Felder: ziehen. ') : ''}${sel.attacked ? '' : targets.size ? 'Rot: Nahkampf, Orange: Beschuss.' : 'Kein Ziel in Reichweite.'}`;
        acts.push(`<span class="hint">${hint}</span>`);
      }
      row = acts.join('');
    } else row = `<span class="hint">${T.can}</span>`;
    $('hudRow').innerHTML = row;
  } else {
    $('portrait').hidden = true; $('btnInfo').hidden = true; $('hudStats').innerHTML = '';
    if (placing) {
      $('hudName').textContent = 'Nachschub: ' + TYPES[placing].name;
      $('hudSub').innerHTML = 'Aufstellen';
      $('hudRow').innerHTML = '<span class="hint">Tippe ein grünes Feld am eigenen Rand an. Die Einheit kann ab der nächsten Runde handeln.</span><button class="act" data-act="cancel">Abbrechen</button>';
    } else if (inspect && inspect.hex) {
      const h = G.map[inspect.hex[0]][inspect.hex[1]], T = TERRAIN[h.t], o = OBJECTIVES.find(x => x.c === inspect.hex[0] && x.r === inspect.hex[1]);
      $('hudName').textContent = (h.river && h.t === 'canal' ? 'Fluss' : T.name) + (h.ridge ? ' auf der Höhe' : '');
      $('hudSub').innerHTML = o ? `Zielfeld: ${o.name} · ${o.pts} Punkte` : 'Gelände';
      $('hudRow').innerHTML = `<span class="hint">${h.river && h.t === 'canal' ? 'Nicht passierbar, nur über Brücken und Furten.' : T.info}${h.road ? ' Hier verläuft eine Straße.' : ''}${h.rail ? ' Hier verläuft die Bahnlinie.' : ''}${h.ridge ? ' Höhe: Fernkampf +1 Reichweite.' : ''}${E.cloudAt(G, inspect.hex[0], inspect.hex[1]) ? ' Gaswolke: schadet jeder Einheit, die hier ihren Zug beginnt.' : ''}${T.real ? ' <i>Im echten Krieg: ' + T.real + '</i>' : ''}</span>`;
    } else {
      $('hudName').textContent = G.over ? 'Schlacht beendet' : human(G.side) ? SIDES[G.side].name : 'Die KI ist am Zug';
      $('hudSub').innerHTML = `${E.MAP.name} · Runde ${G.turn} von ${G.maxT}`;
      $('hudRow').innerHTML = `<span class="hint">${human(G.side) ? 'Tippe eine eigene Einheit an. Tippe auf Gegner oder Gelände für Infos.' : 'Bitte warten …'}</span>`;
    }
  }
  $('hudRow').querySelectorAll('[data-act]').forEach(b => b.onclick = () => panelAct(b.dataset.act));
}
async function panelAct(a) {
  if (a === 'cancel') return cancelPlace();
  if (a === 'pass') { E.pass(G, sel); sel = null; computeOptions(); updateUI(); return; }
  if (a === 'o-rally' || a === 'o-storm') return act(() => E.order(G, sel, a.slice(2)));
  if (a === 'p-melee' || a === 'p-fire') { const v = a.slice(2); atkPref = atkPref === v ? 'auto' : v; const keep = previewT; computeOptions(); previewT = keep && targets.has(keep.id) ? keep : null; updateHud(); return; }
  if (!sel || busy) return;
  if (a.startsWith('m-')) { artMode = a.slice(2); previewT = null; computeOptions(); updateHud(); return; }
  if (a === 'tl' || a === 'tr') { const nf = (sel.face + (a === 'tr' ? 1 : 5)) % 6; await play(E.turnUnit(G, sel, nf)); computeOptions(); updateHud(); return; }
  if (a === 'cut') return act(u => E.cutWire(G, u));
  if (a === 'lay') return act(u => E.layWire(G, u));
  if (a === 'limber') return act(u => E.limber(G, u));
  if (a === 'setup') return act(u => E.setupMG(G, u));
  if (a === 'ow') return act(u => E.overwatch(G, u));
}
function showDetail() {
  const u = sel || (inspect && inspect.unit); if (!u) return;
  const T = TYPES[u.type];
  drawPortraitLater($('detPortrait'), figOf(T), u.side);
  $('detName').textContent = T.name; $('detSide').textContent = SIDES[u.side].name;
  $('detCan').textContent = T.can; $('detReal').textContent = T.real;
  $('detSp').innerHTML = (T.sp || []).map(x => `<span class="sp">${x}</span>`).join('');
  $('detStats').innerHTML = pill('Angriff', T.atk || '–') + pill('Abwehr', T.def) + pill('Moral', T.mor) + pill('Zug', T.mv) + pill('Schuss', T.rng ? `${T.rng} Felder` : '–') + pill('Kosten', '★ ' + (E.COST[u.type] || '–'));
  const cp = E.costParts(u.type);
  $('detCost').innerHTML = `Kosten <b>★ ${cp.total}</b> = Kampfwert ${cp.base}` + cp.abil.map(([n, v]) => ` ${v < 0 ? '−' : '+'} ${n} ${Math.abs(v)}`).join('') + (cp.total !== cp.base + cp.abil.reduce((s, a) => s + a[1], 0) ? ' (gerundet)' : '');
  $('detOff').hidden = !u.officer;
  $('detail').hidden = false;
}
function drawPortraitLater(c, k, s) { requestAnimationFrame(() => drawPortrait(c, k, s)); }

// ---------- Bildschirme ----------
const ATTACKERS = { A: { name: 'Konkordat von Valmor', short: 'Konkordat' }, F: { name: 'Blaue Legion von Arvenne', short: 'Legion' } };
function applySkin(sk) {
  skinA = sk; FIG.setSkin('A', sk); SIDES.A.name = ATTACKERS[sk].name; SIDES.A.short = ATTACKERS[sk].short;
  $('facAName').textContent = ATTACKERS[sk].name;
  drawPortraitLater($('pA1'), 'inf', 'A'); drawPortraitLater($('pA2'), 'walker', 'A'); drawPortraitLater($('pA3'), 'art', 'A');
}
function showStart(first) {
  $('start').hidden = false; setMap(mapSel); drawMapPick(); armyInfo(); drawFlagPick(); $('setSpeed').textContent = 'Tempo ' + speed + '×'; $('setZoom').textContent = 'Zoom ' + String(ZOOM).replace('.', ',') + '×'; $('closeStart').hidden = first;
  drawPortraitLater($('pA1'), 'inf', 'A'); drawPortraitLater($('pA2'), 'walker', 'A'); drawPortraitLater($('pA3'), 'art', 'A');
  drawPortraitLater($('pD1'), 'mg', 'D'); drawPortraitLater($('pD2'), 'storm', 'D'); drawPortraitLater($('pD3'), 'flame', 'D');
}
// ---------- Armee-Auswahl vor der Schlacht ----------
const customArmy = { A: null, D: null }, flagSel = { D: 0, F: 0, A: 0 };
const mechsOn = () => $('optMechs').checked;
function mechChanged() { if (!mechsOn()) for (const sd of ['A', 'D']) if (customArmy[sd]) { for (const t in customArmy[sd]) if (E.isMech(t)) delete customArmy[sd][t]; if (!E.armyOk(sd, customArmy[sd], false)) customArmy[sd] = null; } armyInfo(); }
const roster = sd => E.ROSTER[sd].filter(t => mechsOn() || !E.isMech(t));
function drawFlagPick() {
  const D = (window.FXDATA || {}).flags || {};
  for (const k of ['A', 'D', 'F']) $('flags' + k).innerHTML = [0, 1, 2, 3].map(i => `<button class="flagbtn ${flagSel[k] === i ? 'on' : ''}" data-k="${k}" data-i="${i}" aria-label="Flagge ${i + 1}"><img src="${D['flag' + k + i] || ''}" alt=""></button>`).join('');
  { const fsk = (document.querySelector('input[name=skin]:checked') || {}).value || 'A'; $('flagRowF').hidden = fsk !== 'F'; $('flagRowA').hidden = fsk === 'F';
    $('facFlagA').src = D[fsk === 'F' ? 'flagF' + flagSel.F : 'flagA' + flagSel.A] || ''; $('facFlagD').src = D['flagD' + flagSel.D] || ''; }
  document.querySelectorAll('.flagbtn').forEach(b => b.onclick = () => { flagSel[b.dataset.k] = +b.dataset.i; drawFlagPick(); });
}
let armySide = 'A', armyDraft = {};
const curMode = () => document.querySelector('input[name=mode]:checked').value;
function armyInfo() {
  const sides = curMode() === 'hot' ? ['A', 'D'] : [curMode()];
  $('armyInfo').textContent = sides.map(sd => SIDES[sd].short + ': ' + (customArmy[sd] ? `eigene Armee (${E.armyCost(customArmy[sd])}/${E.ARMY_BUDGET[sd]} Punkte, ${E.armyCount(customArmy[sd])} Einheiten)` : 'Standardarmee')).join(' · ');
}
function openArmy(sd) {
  armySide = sd; armyDraft = Object.assign({}, customArmy[sd] || E.defaultArmy(sd));
  applySkin((document.querySelector('input[name=skin]:checked') || {}).value || 'A');
  $('armyName').textContent = SIDES[sd].name; $('armySwap').hidden = curMode() !== 'hot'; $('armyMechRow').hidden = mechsOn();
  for (const t in armyDraft) if (E.isMech(t) && !mechsOn()) delete armyDraft[t];
  $('armyList').innerHTML = roster(sd).map(t => { const T = TYPES[t];
    return `<div class="item pick ${sd}" data-t="${t}"><canvas data-k="${figOf(T)}"></canvas><b>${T.name}</b><span class="cost">★ ${E.COST[t]}</span><small>${T.can}</small><span class="stepper"><button class="tbtn" data-d="-1" aria-label="weniger">−</button><i>0</i><button class="tbtn" data-d="1" aria-label="mehr">+</button></span></div>`; }).join('');
  $('army').hidden = false;
  requestAnimationFrame(() => $('armyList').querySelectorAll('canvas').forEach(c => drawPortrait(c, c.dataset.k, sd)));
  $('armyList').querySelectorAll('.stepper button').forEach(b => b.onclick = () => {
    const t = b.closest('.item').dataset.t; armyDraft[t] = Math.max(0, Math.min(E.ARMY_CAP, (armyDraft[t] || 0) + +b.dataset.d)); armyRefresh();
  });
  armyRefresh();
}
function armyRefresh() {
  const sd = armySide, cost = E.armyCost(armyDraft), n = E.armyCount(armyDraft), bud = E.ARMY_BUDGET[sd];
  let walkers = 0; for (const t in armyDraft) if (TYPES[t].cls === 'walker') walkers += armyDraft[t];
  $('armyList').querySelectorAll('.item').forEach(it => { const v = armyDraft[it.dataset.t] || 0; it.querySelector('i').textContent = v; it.classList.toggle('has', v > 0); });
  $('armyPts').textContent = `${cost} / ${bud}`; $('armyPts').classList.toggle('over', cost > bud);
  $('armyCnt').textContent = `${n} Einheiten (${E.ARMY_MIN[sd]} bis ${E.ARMY_MAX[sd]})`;
  const msg = cost > bud ? `${cost - bud} Punkte zu viel.` : n < E.ARMY_MIN[sd] ? `Mindestens ${E.ARMY_MIN[sd]} Einheiten.` : n > E.ARMY_MAX[sd] ? `Höchstens ${E.ARMY_MAX[sd]} Einheiten.`
    : walkers > E.ARMY_WALKERS ? `Höchstens ${E.ARMY_WALKERS} Kolosse und Kampfmaschinen.` : cost < bud ? `Noch ${bud - cost} Punkte frei.` : 'Alle Punkte verteilt.';
  $('armyMsg').textContent = msg; $('armyOk').disabled = !E.armyOk(sd, armyDraft, mechsOn());
}
function armyKeep() { if (!E.armyOk(armySide, armyDraft, mechsOn())) return false; const a = {}; for (const t in armyDraft) if (armyDraft[t] > 0) a[t] = armyDraft[t]; customArmy[armySide] = a; return true; }

// ---------- Kartenwahl ----------
const TCOL = { open: '#6d6250', mud: '#4f4433', crater: '#5c5141', trench: '#2e271e', wire: '#7a6e5c', village: '#8a7e66', forest: '#3f4a2c', canal: '#355260', bridge: '#9a8a6a',
  furt: '#4f7480', sumpf: '#4b5a36', wald: '#24331c', waldweg: '#6b6a44', bunker: '#a7a59a', fabrik: '#8a5a44', kirche: '#c2bba8', barrikade: '#7a5a3a', bahn: '#56524a' };
function drawMapPreview(cvs, id) {
  const prev = mapSel; setMap(id); const M = E.buildMap(), m = E.MAP; setMap(prev);
  const W = cvs.clientWidth || 180, H = cvs.clientHeight || 120, dpr = Math.min(2, window.devicePixelRatio || 1);
  cvs.width = W * dpr; cvs.height = H * dpr; const g2 = cvs.getContext('2d'); g2.scale(dpr, dpr);
  const pim = m.img && MIMG[m.img], kp = pim ? (1.5 * m.cols + 0.5) / (pim.naturalWidth / pim.naturalHeight * SQ3 * (m.rows + 0.5)) : 0.58;   // gestaucht wie im Spiel (Seitenansicht)
  const s2 = Math.min(W / (1.5 * m.cols + 0.5), H / (SQ3 * kp * (m.rows + 0.5)));
  const ox = (W - s2 * (1.5 * m.cols + 0.5)) / 2, oy = (H - s2 * SQ3 * kp * (m.rows + 0.5)) / 2;
  const hp = (c, r) => [ox + s2 * (1 + 1.5 * c), oy + s2 * SQ3 * kp * (r + 0.5 * (c & 1) + 0.5)];
  if (pim) g2.drawImage(pim, ox, oy, s2 * (1.5 * m.cols + 0.5), s2 * SQ3 * kp * (m.rows + 0.5));
  for (let c = 0; c < m.cols; c++) for (let r = 0; r < m.rows; r++) {
    const [x, y] = hp(c, r); g2.beginPath(); for (let k = 0; k < 6; k++) { const a = Math.PI / 3 * k; g2.lineTo(x + s2 * Math.cos(a), y + s2 * kp * Math.sin(a)); }
    g2.closePath(); if (!pim) { g2.fillStyle = TCOL[M[c][r].t] || '#6d6250'; g2.fill(); }
    if (M[c][r].ridge) { g2.fillStyle = 'rgba(255,226,160,0.18)'; g2.fill(); }
    if (c <= m.zoneA) { g2.fillStyle = 'rgba(224,138,52,0.22)'; g2.fill(); }
  }
  for (const o of m.objectives) { const [x, y] = hp(o.c, o.r); g2.beginPath(); g2.arc(x, y, Math.max(5, s2 * 0.95), 0, 7); g2.fillStyle = '#5a9fd8'; g2.fill(); g2.lineWidth = 1.5; g2.strokeStyle = '#0a0706'; g2.stroke();
    g2.fillStyle = '#fff'; g2.font = `800 ${Math.max(8, Math.round(s2 * 1.3))}px system-ui`; g2.textAlign = 'center'; g2.textBaseline = 'middle'; g2.fillText(o.pts, x, y + 0.5); }
}
// Hintergrund hinter dem Startmenü zeigt die gewählte Karte
function bgGame() { G = E.newGame({ seed: 7, map: mapSel }); decals.length = 0; initDU(); layout(); syncAll(); updateUI(); }
function drawMapPick() {
  $('mapPick').innerHTML = Object.values(E.MAPS).map(m => { const tot = m.objectives.reduce((n, o) => n + o.pts, 0);
    return `<label class="mapcard"><input type="radio" name="map" value="${m.id}" ${m.id === mapSel ? 'checked' : ''}><canvas data-map="${m.id}"></canvas><b>${m.name}</b><span class="msize">${m.size} · ${m.cols} × ${m.rows} · ${m.maxT || P.MAXT} Runden</span><small>${m.desc}</small><span class="mwin">⚑ ${m.objectives.length} Ziele, ${tot} Punkte · Sieg ab ${m.winA || P.WIN_A}, Remis ab ${m.drawA || P.DRAW_A}</span></label>`; }).join('');
  requestAnimationFrame(() => document.querySelectorAll('#mapPick canvas').forEach(c => drawMapPreview(c, c.dataset.map)));
  document.querySelectorAll('input[name=map]').forEach(i => i.addEventListener('change', () => { setMap(i.value); customArmy.A = customArmy.D = null; armyInfo(); bgGame(); }));
}

function startGame() {
  mode = document.querySelector('input[name=mode]:checked').value;
  blood = $('optBlood').checked; soundOn = $('optSound').checked; $('btnSound').textContent = soundOn ? '🔊' : '🔇';
  applySkin((document.querySelector('input[name=skin]:checked') || {}).value || 'A');
  $('start').hidden = true; $('end').hidden = true;
  setMap(mapSel);
  G = E.newGame({ map: mapSel, mechs: mechsOn(), army: { A: human('A') ? customArmy.A : null, D: human('D') ? customArmy.D : null } });
  decals.length = particles.length = floaters.length = tracers.length = shells.length = booms.length = flames.length = rings.length = muzzles.length = 0;
  initDU(); layout(); syncAll();
  E.startTurn(G);
  sel = null; inspect = null; placing = null; spawnSet = new Set(); updateUI();
  banner(E.MAP.name, `${SIDES.A.name} greift an · Sieg ab ${G.winA} von ${E.totalPts()} Punkten`); playSound('march', 0.45); playSound('whistle', 0.5); setAmbient(soundOn);
  if (mode === 'hot') showHandover(); else if (!human(G.side)) aiTurn();
}
function showHandover() {
  $('handover').hidden = false; $('handover').className = 'overlay center hand ' + G.side;
  $('handTitle').textContent = SIDES[G.side].name; $('handText').textContent = `Runde ${G.turn}. Gebt das Gerät weiter.`;
}
function showEnd() {
  const r = G.over, me = mode === 'hot' ? null : mode, win = r.winner;
  let title = win ? SIDES[win].short + ' siegt' : 'Unentschieden';
  if (me) title = win === me ? 'Sieg' : win ? 'Niederlage' : 'Unentschieden';
  const why = r.why === 'break' ? (win === 'A' ? 'Die Aschenwacht ist zusammengebrochen.' : 'Der Angriff ist zusammengebrochen.')
    : `Nach ${G.maxT} Runden hält der Angreifer ${r.pts} von ${E.totalPts()} Punkten. Sieg ab ${G.winA}, Unentschieden ab ${G.drawA}.`;
  let stars = 0;
  if (me) { if (win === me) stars = 2 + (E.losses(G, me) < 0.3 ? 1 : 0); else if (!win) stars = 1; }
  $('endTitle').textContent = title; $('endWhy').textContent = why;
  $('endStars').textContent = me ? '★'.repeat(stars) + '☆'.repeat(3 - stars) : '';
  $('endStats').innerHTML = `<div><dt>Ausfälle ${SIDES.A.short}</dt><dd>${Math.round(E.losses(G, 'A') * 100)} %</dd></div><div><dt>Ausfälle Aschenwacht</dt><dd>${Math.round(E.losses(G, 'D') * 100)} %</dd></div>` +
    OBJECTIVES.map(o => `<div class="${G.ctrl[o.id]}"><dt>${o.name}</dt><dd>${SIDES[G.ctrl[o.id]].short}</dd></div>`).join('');
  $('end').hidden = false;
  setAmbient(false);
  if (win && (!me || win === me)) playSound('win', 0.6);
}

// ---------- Knöpfe ----------
$('btnEnd').onclick = endTurn;
$('startBtn').onclick = startGame;
$('btnArmy').onclick = () => openArmy(curMode() === 'D' ? 'D' : 'A');
$('armyStd').onclick = () => { armyDraft = Object.assign({}, E.defaultArmy(armySide)); armyRefresh(); };
$('armyClear').onclick = () => { armyDraft = {}; armyRefresh(); };
$('armyOk').onclick = () => { if (armyKeep()) { $('army').hidden = true; armyInfo(); } };
$('armyCancel').onclick = () => { $('army').hidden = true; armyInfo(); };
$('armySwap').onclick = () => { if (E.armyOk(armySide, armyDraft, mechsOn())) armyKeep(); openArmy(armySide === 'A' ? 'D' : 'A'); };
document.querySelectorAll('input[name=mode]').forEach(i => i.addEventListener('change', armyInfo));
document.querySelectorAll('input[name=skin]').forEach(i => i.addEventListener('change', drawFlagPick));
document.querySelectorAll('input[name=mechs]').forEach(i => i.addEventListener('change', mechChanged));
$('armyMech').onclick = () => { $('optMechs').checked = true; mechChanged(); const keep = armyDraft; openArmy(armySide); armyDraft = keep; armyRefresh(); };
// Einstellungen schon im Startmenü
$('setFull').onclick = () => $('btnFull').onclick();
$('setSpeed').onclick = () => { $('btnSpeed').onclick(); $('setSpeed').textContent = 'Tempo ' + speed + '×'; };
$('setZoom').onclick = () => { ZOOM = ZOOM === 1 ? 1.3 : ZOOM === 1.3 ? 1.6 : 1; const t = String(ZOOM).replace('.', ',') + '×'; $('btnZoom').textContent = '🔍 ' + t; $('setZoom').textContent = 'Zoom ' + t; if (G) { layout(); syncAll(); } };
document.addEventListener('fullscreenchange', () => { $('setFull').classList.toggle('on', !!document.fullscreenElement); });
$('btnMenu').onclick = () => showStart(false);
$('closeStart').onclick = () => { $('start').hidden = true; };
$('btnRules').onclick = $('btnRules2').onclick = () => { $('rules').hidden = false; };
$('closeRules').onclick = () => { $('rules').hidden = true; };
$('againBtn').onclick = () => { $('end').hidden = true; showStart(true); };
$('reviewBtn').onclick = () => { $('end').hidden = true; };
$('handBtn').onclick = () => { $('handover').hidden = true; updateUI(); };
$('btnInfo').onclick = showDetail;
$('btnZoom').onclick = () => {
  const fx = (board.scrollLeft + board.clientWidth / 2) / board.scrollWidth, fy = (board.scrollTop + board.clientHeight / 2) / board.scrollHeight;
  ZOOM = ZOOM === 1 ? 1.3 : ZOOM === 1.3 ? 1.6 : 1;
  $('btnZoom').textContent = '🔍 ' + String(ZOOM).replace('.', ',') + '×';
  layout(); syncAll();
  board.scrollLeft = fx * board.scrollWidth - board.clientWidth / 2; board.scrollTop = fy * board.scrollHeight - board.clientHeight / 2;
};
$('btnSound').onclick = () => { soundOn = !soundOn; $('optSound').checked = soundOn; $('btnSound').textContent = soundOn ? '🔊' : '🔇'; setAmbient(soundOn && !!G && !G.over); if (soundOn) playSound('whistle', 0.4); };
document.querySelectorAll('input[name=skin]').forEach(r => r.onchange = () => { applySkin(r.value); if (G) { updateUI(); } });
$('btnShop').onclick = openShop;
$('closeShop').onclick = () => { $('shop').hidden = true; };
$('closeDetail').onclick = () => { $('detail').hidden = true; };
$('btnSpeed').onclick = () => { speed = speed === 1 ? 2 : speed === 2 ? 3 : 1; $('btnSpeed').textContent = speed + '×'; };
$('btnFull').onclick = () => { const d = document, el = d.documentElement; if (!d.fullscreenElement) (el.requestFullscreen || el.webkitRequestFullscreen || (() => {})).call(el); else d.exitFullscreen(); };
let rT = 0;
window.addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(() => { if (G) { layout(); updateHud(); } }, 120); });
document.addEventListener('keydown', e => {
  const pan = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
  if (pan && $('start').hidden && !e.target.closest('input')) { board.scrollBy({ left: pan[0] * 160, top: pan[1] * 120, behavior: 'smooth' }); e.preventDefault(); }
  if (e.key === 'Escape') { cancelPlace(); $('shop').hidden = true; select(null); $('detail').hidden = true; $('rules').hidden = true; } });

// ---------- Start ----------
G = E.newGame({ seed: 7 });
initDU(); layout(); syncAll(); updateUI();
requestAnimationFrame(frame);
showStart(true);
window.__dbg = { PT, tcv: () => tcv, renderTerrain: () => renderTerrain(), paintReady: () => paintReady(),
  hexCss: (c, r) => { const [x, y] = center(c, r), rc = cv.getBoundingClientRect(); return [rc.left + x * rc.width / cv.width, rc.top + y * rc.height / cv.height]; },
  get reach() { return [...reach.values()]; }, get targets() { return [...targets.values()]; }, get shellHexes() { return [...shellHexes]; },
  setSpeed: v => speed = v, get sndCount() { return window.__snd || 0; }, get sndBy() { return window.__sndBy || {}; }, get G() { return G; }, get busy() { return busy || qRunning; }, E, AI,
  sync: () => syncAll(), play: async evs => { for (const e of evs) await playEvent(e); }, get pji() { return Object.keys(PJI); }, get mz() { return muzzles.map(m => m.img + ':' + Math.round(m.life)); }, get fx() { return { sh: shells.length, tr: tracers.length, bo: booms.length, fl: floaters.length }; }, get scoutN() { return scoutSet.size; }, get sightN() { return sightSet.size; }, get spentN() { return spent.size; },
  select: id => select(G.units.find(u => u.id === id)), get sel() { return sel; }
};
})();
