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
// Panel-Grafiken (Symbole, Deckungsschilde) auch fürs Zeichnen auf der Karte
const UPI = {};
{ const A = window.UIPANEL || {}; for (const k in A) if (/^(s_|cov|orden|muenze)/.test(k)) { const im = new Image(); im.onload = () => UPI[k] = im; im.src = A[k]; } }
const $ = id => document.getElementById(id);
const fmt = x => String(Math.max(0, Math.round(x * 10)));   // Anzeige in ganzen Zahlen: Stärke 10,0 → 100, Schaden 0,7 → 7 (Wunsch des Nutzers)
const WIND_DEG = [-30, 30, 90, 150, 210, 270];

// ---------- Zustand ----------
let G = null, mode = 'A', blood = true, speed = 1, busy = false;
let sel = null, reach = new Map(), targets = new Map(), shellHexes = new Set(), artMode = 'he';
let recSet = new Set(), abilSet = new Set(), abilMode = false;
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
const TIMG = {}, FXI = {}, PJI = {};
{ const D = window.FXDATA || { tiles: {}, fx: {} };
  const load = (store, map) => { for (const k in map) { const im = new Image(); im.onload = () => { store[k] = im; if (store === TIMG && L && G) renderTerrain(); }; im.src = map[k]; } };
  load(TIMG, D.tiles); load(FXI, D.fx); load(PJI, D.proj || {}); }
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
// Anzeige-Zustand (Wunsch des Nutzers): Zustände und Wolken erscheinen erst, wenn ihr Ereignis abgespielt wird, nicht schon beim Rechnen.
// Die Regeln ändern G sofort; gezeichnet wird VIS bzw. d.vs, das syncAll() nach jedem abgespielten Stapel nachzieht.
const VIS = { clouds: [], smoke: [], lit: [], ctrl: {} };
const vsOf = u => ({ supp: u.supp || 0, gassed: !!u.gassed, rout: u.status === 'rout', broken: u.broken || 0, stuck: u.stuck || 0 });
function visSync(what) { if (!G) return; const cp = a => (a || []).map(k => ({ ...k })); if (!what || what === 'clouds') VIS.clouds = cp(G.clouds); if (!what || what === 'smoke') VIS.smoke = cp(G.smoke); if (!what || what === 'lit') VIS.lit = cp(G.lit); if (!what) VIS.ctrl = { ...(G.ctrl || {}) }; }
function addDU(u) { const [x, y] = L ? center(u.c, u.r) : [0, 0]; DU.set(u.id, { x, y, face: u.face, str: u.str, mor: u.mor, alpha: 1, shake: 0, lunge: null, vs: vsOf(u) }); }
function syncAll() {
  for (const u of G.units) {
    if (!DU.has(u.id)) addDU(u);
    const d = DU.get(u.id), [x, y] = center(u.c, u.r);
    d.x = x; d.y = y; d.face = u.face; d.str = u.str; d.mor = u.mor; d.lunge = null;
    d.alpha = E.alive(u) ? 1 : 0; d.vs = vsOf(u);
  }
  visSync();
}
const facesLeft = f => f === 2 || f === 3 || f === 4;
// Figuren stehen in der unteren Hälfte ihres Feldes und bleiben schmal, damit sie Nachbarfelder nicht verdecken
const SLOTS = { smoke: [[0, 0.38]], lobber: [[0, 0.38]], miner: [[0, 0.38]], demo: [[0, 0.38]], wrench: [[0, 0.38]], balloon: [[0, 0.3]], mines: [[0, 0.38]], light: [[0, 0.38]], counter: [[0, 0.38]], gasmask: [[0, 0.38]], ammo: [[0, 0.38]], stalker: [[0, 0.4]], limber: [[0, 0.38]], medic: [[0.2, 0.4], [-0.22, 0.2]], mortar: [[0, 0.38]], inf: [[0.22, 0.42], [-0.24, 0.22], [0, 0.05]], storm: [[0.22, 0.42], [-0.24, 0.22], [0, 0.05]],
  flame: [[0.2, 0.4], [-0.22, 0.2]], cav: [[0, 0.4]], mg: [[0, 0.38]], art: [[0, 0.38]], walker: [[0, 0.4]],
  bike: [[0, 0.38]], sniper: [[0, 0.38]], dog: [[0, 0.38]], atr: [[0, 0.38]], signal: [[0.15, 0.4], [-0.25, 0.2]], sapper: [[0.2, 0.4], [-0.22, 0.2]], raider: [[0.22, 0.42], [-0.24, 0.22]],
  shield: [[0.2, 0.4], [-0.22, 0.2]], heavy: [[0.2, 0.4], [-0.24, 0.2]], mech: [[0, 0.42]], drill: [[0, 0.42]], mechA: [[0, 0.42]], mechB: [[0, 0.42]], mechT: [[0, 0.42]], mechK: [[0, 0.42]], mechC: [[0, 0.42]], fgun: [[0, 0.38]], leader1: [[0.12, 0.4], [-0.3, 0.2]], leader4: [[0.12, 0.4], [-0.3, 0.2]], flamer: [[0.2, 0.4], [-0.22, 0.2]], shieldA: [[0.2, 0.4], [-0.22, 0.2]], phone: [[0.15, 0.4], [-0.25, 0.2]], brawler: [[0.22, 0.42], [-0.24, 0.22]], knight: [[0.2, 0.4], [-0.22, 0.2]], sapperD: [[0.2, 0.4], [-0.22, 0.2]], banner: [[0, 0.4]], suitA: [[0.24, 0.42], [-0.26, 0.2]], suitD: [[0.24, 0.42], [-0.26, 0.2]] };
const FH = { smoke: 0.7, lobber: 0.66, miner: 0.66, demo: 0.7, wrench: 0.66, balloon: 1.15, mines: 0.6, light: 0.7, counter: 0.68, gasmask: 0.62, ammo: 0.64, stalker: 0.5, limber: 0.58, medic: 0.62, mortar: 0.66, inf: 0.62, storm: 0.62, flame: 0.62, mg: 0.68, art: 0.74, walker: 0.86, cav: 0.57,
  bike: 0.62, sniper: 0.64, dog: 0.62, atr: 0.64, signal: 0.6, sapper: 0.6, raider: 0.62, shield: 0.62, heavy: 0.62, mech: 0.64, drill: 0.64, mechA: 0.64, mechB: 0.64, mechT: 0.64, mechK: 0.64, mechC: 0.64, suitA: 0.6, suitD: 0.6,
  fgun: 0.7, leader1: 0.66, leader4: 0.66, flamer: 0.62, shieldA: 0.62, phone: 0.6, brawler: 0.62, knight: 0.64, sapperD: 0.6, banner: 0.74 };
const MAXW = 1.6, MAXWK = { smoke: 1.6, lobber: 1.5, miner: 1.6, demo: 1.6, wrench: 1.6, balloon: 1.3, mines: 1.5, light: 1.6, counter: 1.5, gasmask: 1.7, ammo: 1.6, stalker: 1.6, walker: 2.05, limber: 1.95, art: 1.8, cav: 1.7, mech: 2.1, drill: 2.1, mechA: 2.1, mechB: 2.1, fgun: 1.8, atr: 1.5, sniper: 1.4, bike: 1.5, dog: 1.5 };   // größte Bildbreite in Feldradien
// Figuren etwas größer seit den kleineren Karten (Wunsch des Nutzers)
const FSC = 1.12; for (const k in FH) FH[k] *= FSC; for (const k in MAXWK) MAXWK[k] *= 1.06;

// Kartenmarken nach STYLE.md (Wunsch des Nutzers): an der Figur nur ein schmaler Lebensbalken in Fraktionsfarbe, das Deckungsschild und EIN Zustandsplatz
// (wichtigster Zustand, „+n“ bei mehreren). Eigene Einheiten am Zug: Messingpunkte unter dem Balken = Aktionspunkte. Alles in einer Zeile unter der Figur.
// STATES: Reihenfolge = Wichtigkeit. on(u, d) liest die Anzeige-Werte d.vs, damit Zustände erst beim Abspielen erscheinen.
const STATES = [
  { k: 'rout', sym: 'flucht', name: 'Flieht', on: (u, d) => d.vs.rout, text: () => 'Moral gebrochen: weicht zurück und gehorcht nicht. Gegner treffen sie ×1,6, Reiter ×2. Ein Anführer in der Nähe kann sie wieder sammeln.' },
  { k: 'broken', sym: 'zahnrad', name: 'Panne', on: (u, d) => d.vs.broken > 0, text: (u, d) => `Liegengeblieben: fällt noch ${upRunden(d.vs.broken)} aus. Ein Werkstatt-Trupp kann sie bergen.` },
  { k: 'supp', sym: 'niedergehalten', name: 'Niedergehalten', on: (u, d) => d.vs.supp > 0, text: () => 'Liegt unter Beschuss flach: kann weder ziehen, schießen noch stürmen, Nahkampf ×0,5. Hält eine eigene Runde an; „Sammeln“ hebt es auf.' },
  { k: 'stuck', sym: 'festgefahren', name: 'Festgefahren', on: (u, d) => d.vs.stuck > 0, text: (u, d) => `Im Schlamm stecken geblieben: kann noch ${upRunden(d.vs.stuck)} nicht ziehen.` },
  { k: 'gas', sym: 'gas', name: 'Im Gas', on: (u, d) => d.vs.gassed, text: () => 'Vom Gas getroffen: Stärke und Moral sinken, Angriffe ×0,7 in dieser Runde.' },
  { k: 'shaky', sym: 'gebrochen', name: 'Moral wankt', on: (u, d) => !d.vs.rout && d.mor < P.FALLBACK_MOR && TYPES[u.type].cls !== 'art', text: () => 'Moral fast am Ende: Beim nächsten Treffer weicht die Einheit zurück.' },
  { k: 'held', sym: 'nahkampf', name: 'Gebunden', on: u => TYPES[u.type].rng > 0 && !TYPES[u.type].flame && E.active(u) && E.held(G, u), text: () => 'Ein gleich großer Gegner steht daneben: Schießen geht nicht, nur Nahkampf.' },
  { k: 'limber', sym: 'pferd', name: 'Aufgeprotzt', on: u => u.limbered, text: () => `Angespannt: zieht ${P.LIMBER_MV} Felder, feuert aber nicht. Abprotzen bringt das Geschütz in Stellung.` },
  { k: 'mgdown', sym: 'mg_dreibein', name: 'Nicht aufgebaut', on: u => TYPES[u.type].mg && !u.setup && E.active(u), text: () => 'Das MG muss erst aufgebaut werden (1 Aktion). Dann feuert es und gibt Reaktionsfeuer.' },
  { k: 'ow', sym: 'auge', name: 'Feuerbereit', on: u => u.ow, text: () => 'Schießt in der gegnerischen Runde auf den ersten Gegner, der sich in Reichweite bewegt (Schaden ×0,8).' },
  { k: 'zeal', sym: 'blitz', name: 'Sturmbefehl', on: u => u.zeal, text: () => 'Befehl des Anführers: Nahkampf ×1,25 in dieser Runde.' },
  { k: 'hidden', sym: 'durchsickern', name: 'Getarnt', on: u => TYPES[u.type].hidden && !(u.revealed > 0) && E.active(u), text: () => 'Der Gegner sieht die Einheit erst vom Nachbarfeld aus. Nach einem Schuss ist sie eine Runde lang enttarnt.' },
  { k: 'relay', sym: 'fernglas', name: 'Aufklärer', on: u => TYPES[u.type].relay && E.active(u), text: () => 'Lenkt die eigene Artillerie: Ziele, die der Trupp sieht, treffen ohne Streuung und ×1,25.' },
];
// Anführer kann jetzt einen Befehl geben (Sammeln oder Sturmbefehl nicht in Abklingzeit, in dieser Runde noch keiner gegeben)
const orderReady = u => !u.ordered && (!(u.cdR > 0) || !(u.cdS > 0));
const statesOf = (u, d) => d && d.vs ? STATES.filter(st => st.on(u, d)) : [];
const COVER_NAME = ['', 'Bronze', 'Silber', 'Gold'];
const coverTip = u => { const cv = E.coverOf(G, u), h = G.map[u.c][u.r]; return cv.tier ? { tier: cv.tier, name: `Deckung ${COVER_NAME[cv.tier]}`, text: `${h.river && h.t === 'canal' ? 'Fluss' : TERRAIN[h.t].name}${h.ridge ? ' auf der Höhe' : ''}: Verteidigung +${Math.round((cv.f - 1) * 100)} %. Bronze = leichte, Silber = gute, Gold = starke Deckung.` } : null; };
// Trefferflächen der Marken auf der Karte (für Tooltips per Maus und Touch), jedes Bild neu gefüllt
const MARKS = [], MARKQ = [];
// „Alle Marken zeigen“: Alt gedrückt halten oder Knopf in der oberen Leiste (Touch); dann liegen die Marken aller Einheiten obenauf
let altHeld = false, marksOn = false;
const marksAll = () => altHeld || marksOn;
// Gemalte Kartenmarken (Wunsch des Nutzers, Stil wie die obere Leiste): Pinsel-Lebensbalken und Pinselstrich-Ringe.
// SVG mit Filtern wird einmal je Farbe in ein Canvas gerastert und dann nur noch kopiert (schnell genug für jedes Bild).
const SPR = {};
function svgSprite(key, svg, w, h) {
  if (key in SPR) return SPR[key];
  SPR[key] = null;
  const im = new Image();
  im.onload = () => { const c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').drawImage(im, 0, 0, w, h); SPR[key] = c; };
  im.src = 'data:image/svg+xml,' + encodeURIComponent(svg);
  return null;
}
// Pinselform des Kampfkraft-Balkens (gleicher Pfad und Filter wie .tb-meter in index.html), mit Tintenkontur
const BRUSH_D = 'M1.5 3.4C30 1.9 70 3.1 110 2.3S170 2.9 191 2.1L196 4.6 193.5 7.8 198.5 11.2 194.5 14 197 16.4 190 17.9C150 18.6 110 17.5 70 18.2S20 17.6 1.5 17.1Z';
const brushBar = col => svgSprite('bar' + col, `<svg xmlns="http://www.w3.org/2000/svg" width="412" height="56" viewBox="-3 -4 206 28" preserveAspectRatio="none">
<filter id="r" x="-5%" y="-30%" width="110%" height="160%"><feTurbulence type="fractalNoise" baseFrequency=".08 .6" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.6"/></filter>
<filter id="s" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".006 .55" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 .07 0 0 0 0 .05 0 0 0 0 .04 2.6 0 0 0 -1.45"/></filter>
<filter id="h" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".008 .7" numOctaves="2" seed="19"/><feColorMatrix values="0 0 0 0 1 0 0 0 0 .95 0 0 0 0 .85 2.4 0 0 0 -1.5"/></filter>
<mask id="m" maskUnits="userSpaceOnUse" x="-3" y="-4" width="206" height="28"><g filter="url(#r)"><path d="${BRUSH_D}" fill="#fff"/></g></mask>
<g filter="url(#r)"><path d="${BRUSH_D}" fill="${col}" stroke="#120D0B" stroke-width="2.8" stroke-linejoin="round"/></g>
<g mask="url(#m)"><rect width="200" height="20" filter="url(#s)" opacity=".7"/><rect width="200" height="20" filter="url(#h)" opacity=".4"/></g></svg>`, 412, 56);
// Unregelmäßiger Pinselstrich-Ring: Tintenschatten, Hauptstrich, trockener Nebenstrich mit Lücken
const brushRing = (col, wide) => svgSprite('ring' + col + (wide ? 'w' : ''), `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 200 200">
<filter id="r" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".03" numOctaves="2" seed="5"/><feDisplacementMap in="SourceGraphic" scale="8"/></filter>
<filter id="q" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="11"/><feDisplacementMap in="SourceGraphic" scale="6"/></filter>
<g filter="url(#r)" fill="none" stroke-linecap="round"><circle cx="100" cy="100" r="84" stroke="#120D0B" stroke-width="${wide ? 15 : 9}" opacity=".5"/><circle cx="100" cy="100" r="84" stroke="${col}" stroke-width="${wide ? 9 : 4.5}" stroke-dasharray="470 18 30 10"/></g>
<g filter="url(#q)" fill="none" stroke-linecap="round"><circle cx="100" cy="100" r="88" stroke="${col}" stroke-width="2.4" opacity=".6" stroke-dasharray="60 25 90 40 120 30"/></g></svg>`, 256, 256);
function drawRing(g, col, x, y, R, wide) {   // R = Radius in Bildpunkten (waagrecht), gestaucht mit K
  const sp = brushRing(col, wide);
  if (!sp) { g.beginPath(); g.ellipse(x, y, R, R * K, 0, 0, 7); g.lineWidth = Math.max(1.5, L.s * (wide ? 0.05 : 0.035)); g.strokeStyle = col; g.stroke(); return; }
  const w = R * 2 * 100 / 84, h = w * K; g.drawImage(sp, x - w / 2, y - h / 2, w, h);
}
function drawBrushBar(g, col, bx, by, bw, bh) {   // Breite bw = gefüllter Anteil; Rand der Form ragt etwas über
  const sp = brushBar(col);
  if (!sp) { g.fillStyle = col; g.fillRect(bx, by, bw, bh); return; }
  g.drawImage(sp, bx - bw * 3 / 200, by - bh * 4 / 20, bw * 206 / 200, bh * 28 / 20);
}
// Ersatzschild, falls das gemalte Bild fehlt
const SHIELD_COL = { 1: ['#e6a868', '#a8662c', '#5c3412'], 2: ['#f4f5f7', '#b4b8be', '#5d6168'], 3: ['#fff1a0', '#e0ad2c', '#7a5408'] };
function drawShield(g, cx, cy, h, tier) {
  const im = UPI['cov' + tier];
  if (im) { const w = h * im.naturalWidth / im.naturalHeight; g.save(); g.shadowColor = 'rgba(18,13,11,0.9)'; g.shadowOffsetY = Math.max(1, h * 0.06); g.drawImage(im, cx - w / 2, cy - h / 2, w, h); g.restore(); return; }
  const w = h * 0.82, [hi, mid, lo] = SHIELD_COL[tier];
  g.save(); g.translate(cx, cy);
  g.beginPath(); g.moveTo(-w / 2, -h / 2); g.lineTo(w / 2, -h / 2); g.lineTo(w / 2, -h * 0.08); g.quadraticCurveTo(w * 0.46, h * 0.32, 0, h / 2); g.quadraticCurveTo(-w * 0.46, h * 0.32, -w / 2, -h * 0.08); g.closePath();
  const gr = g.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); gr.addColorStop(0, hi); gr.addColorStop(0.55, mid); gr.addColorStop(1, lo);
  g.fillStyle = gr; g.fill(); g.lineWidth = Math.max(1.5, h * 0.1); g.strokeStyle = '#120D0B'; g.stroke();
  g.restore();
}
// Symbol auf dunkler Scheibe mit Rostrand (Karte)
function drawSym(g, im, cx, cy, R) {
  g.beginPath(); g.arc(cx, cy, R, 0, 7); g.fillStyle = 'rgba(18,13,11,0.82)'; g.fill(); g.lineWidth = Math.max(1.5, R * 0.14); g.strokeStyle = '#66483A'; g.stroke();
  if (!im) return;
  const ww = Math.min(R * 1.45 * im.naturalWidth / im.naturalHeight, R * 1.6), h2 = ww * im.naturalHeight / im.naturalWidth;
  g.drawImage(im, cx - ww / 2, cy - h2 / 2, ww, h2);
}
function drawUnit(u, d) {
  const T = TYPES[u.type], k = figU(u), s = L.s, flip = facesLeft(d.face) ? 1 : 0, acc = FIG.PAL[u.side].accent;
  let x = d.x, y = d.y;
  if (d.lunge) { x += d.lunge.dx; y += d.lunge.dy; }
  if (d.shake > 0) x += Math.sin(now / 22) * s * 0.05;
  const g = ctx, A0 = d.alpha * (d.vs.rout ? 0.75 : 1);
  const isSel = sel && sel.id === u.id;
  const own = human(u.side) && G.side === u.side && E.active(u);
  const done = own && !busy && !shells.length && !tracers.length && !muzzles.length && spent.has(u.id);
  // Standplatz: dunkler Bodenschatten und dünner Ring in gedämpfter Fraktionsfarbe (keine knalligen Flächen)
  g.globalAlpha = A0; g.beginPath(); g.ellipse(x, y, s * 0.66, s * 0.66 * K, 0, 0, 7); g.fillStyle = 'rgba(18,13,11,0.45)'; g.fill();
  g.globalAlpha = A0 * (done ? 0.25 : d.vs.rout ? 0.3 : 0.45); if (!isSel) drawRing(g, acc, x, y, s * 0.66);   // Pinselstrich-Ring, gedämpft
  if (E.active(u)) {   // Blickrichtung: kleiner Punkt am Ring, so gedämpft wie der Ring
    const a = d.face * Math.PI / 3, fx = x + Math.cos(a) * s * 0.66, fy = y + Math.sin(a) * s * 0.66 * K;
    if (isSel) g.globalAlpha = A0;
    g.beginPath(); g.arc(fx, fy, Math.max(2, s * 0.055), 0, 7); g.fillStyle = isSel ? '#C2A461' : acc; g.fill(); g.lineWidth = Math.max(1, s * 0.03); g.strokeStyle = '#120D0B'; g.stroke();
  }
  g.globalAlpha = A0;
  if (isSel) {   // gewählt: Messingring, leicht pulsierend
    const pz = 0.5 + 0.5 * Math.sin(now / 300);
    g.globalAlpha = A0 * (0.85 + 0.15 * pz); drawRing(g, '#C2A461', x, y, s * (0.7 + 0.02 * pz), true); g.globalAlpha = A0;
  } else if (hoverU === u) { g.beginPath(); g.ellipse(x, y, s * 0.76, s * 0.76 * K, 0, 0, 7); g.strokeStyle = 'rgba(240,237,225,0.5)'; g.lineWidth = Math.max(1.5, s * 0.03); g.stroke(); }
  if (previewT && previewT.id === u.id) {   // Angriffsziel in der Vorschau
    g.beginPath(); g.ellipse(x, y, s * 0.78, s * 0.78 * K, 0, 0, 7); g.strokeStyle = '#8E2B22'; g.lineWidth = Math.max(2.5, s * 0.06);
    g.globalAlpha = A0 * (0.6 + 0.4 * Math.sin(now / 160)); g.stroke(); g.globalAlpha = A0;
  }
  // Figuren
  const slots = SLOTS[k];
  const n = slots.length === 1 ? 1 : Math.max(1, Math.min(slots.length, Math.ceil(d.str / (10 / slots.length) - 0.001)));
  let sp = FIG.sprite(k, u.side, flip, s * FH[k]);
  { const mw = s * (MAXWK[k] || MAXW); if (sp.cv.width > mw) sp = FIG.sprite(k, u.side, flip, s * FH[k] * mw / sp.cv.width); }
  // Gemalte Bilder sind größer: höchstens zwei Figuren je Einheit, damit es übersichtlich bleibt
  const use = slots.slice(0, sp.painted ? Math.min(n, 2) : n).slice().sort((a, b) => a[1] - b[1]);
  if (done) { g.globalAlpha = A0 * 0.85; g.filter = 'grayscale(0.75) brightness(0.8)'; }   // fertig: leicht ausgegraut
  const duck = d.vs.supp > 0 ? s * 0.1 : 0;
  for (const [ox, oy] of use) {
    const fx = x + (flip ? -ox : ox) * s, fy = y + oy * s * K + duck;
    g.fillStyle = 'rgba(10,9,6,0.38)'; g.beginPath(); g.ellipse(fx, fy, s * (k === 'walker' ? 0.5 : 0.3), s * (k === 'walker' ? 0.16 : 0.1), 0, 0, 7); g.fill();
    const lead = ox === slots[0][0] && oy === slots[0][1] ? leaderKind(u) : null;
    if (lead) { const ls = FIG.sprite(lead, u.side, flip, s * FH.inf * 1.12); g.drawImage(ls.cv, Math.round(fx - ls.ox), Math.round(fy - ls.oy)); continue; }
    if (u.officer && ox === slots[0][0] && oy === slots[0][1]) {
      const px = fx + (flip ? 0.2 : -0.2) * s, top = fy - s * 1.35;
      g.strokeStyle = O; g.lineWidth = Math.max(2, s * 0.07); g.beginPath(); g.moveTo(px, fy - s * 0.2); g.lineTo(px, top); g.stroke();
      g.beginPath(); g.moveTo(px, top); g.lineTo(px + (flip ? 1 : -1) * s * 0.42, top + s * 0.13); g.lineTo(px, top + s * 0.28); g.closePath();
      g.fillStyle = acc; g.fill(); g.lineWidth = Math.max(1.5, s * 0.045); g.stroke();
    }
    g.drawImage(sp.cv, Math.round(fx - sp.ox), Math.round(fy - sp.oy));
  }
  g.filter = 'none'; g.globalAlpha = 1;
  if (!E.alive(u)) return;
  if (isSel || hoverU === u || marksAll()) MARKQ.push(() => drawMarks(u, d, x, y, own, done, acc));   // gewählt, überfahren oder „Alle Marken“: obenauf
  else drawMarks(u, d, x, y, own, done, acc);   // Marken gleich nach der eigenen Figur (Tiefenreihenfolge): Figuren davor dürfen sie verdecken, sie malen nie über fremde
}
function drawMarks(u, d, x, y, own, done, acc) {
  const g = ctx, s = L.s;
  // Markenzeile unter der Figur: [Zustand] [Lebensbalken, darunter Aktionspunkte] [Deckung]
  const bw = s * 0.5, bh = Math.max(3.5, s * 0.065), bx = x - bw / 2, by = y + s * K * 0.3, q = Math.max(0, Math.min(1, d.str / 10)), mid = by + bh / 2;
  g.globalAlpha = done ? 0.7 : 1;
  // Pinsel-Lebensbalken wie die Kampfkraft-Balken oben: dunkle Pinselform als Grund, Füllung in Fraktionsfarbe, Segmentstriche
  drawBrushBar(g, '#221B18', bx, by, bw, bh);
  if (q > 0.01) drawBrushBar(g, acc, bx, by, bw * q, bh);
  g.fillStyle = 'rgba(18,13,11,0.7)'; for (let i = 1; i < 10 * q - 0.2; i++) g.fillRect(Math.round(bx + bw * i / 10), by + bh * 0.15, 1, bh * 0.7);
  MARKS.push({ x0: bx - 3, y0: by - 4, x1: bx + bw + 3, y1: by + bh + 4, u, kind: 'hp' });
  if (own) {   // Aktionspunkte: kleine Messingpunkte (leer = dunkel)
    const ap = d.vs.broken || d.vs.supp ? 0 : (u.ap || 0), nn = Math.max(P.AP, ap), r = Math.max(2.5, s * 0.042), py = by + bh + r + 1.5;
    for (let i = 0; i < nn; i++) { const cx = x + (i - (nn - 1) / 2) * r * 2.4, im = UPI[i < ap ? 'muenze' : 'muenzeLeer'];   // volle / leere Messingmünze
      if (im) g.drawImage(im, cx - r, py - r, r * 2, r * 2); else { g.beginPath(); g.arc(cx, py, r, 0, 7); g.fillStyle = i < ap ? '#C2A461' : '#221B18'; g.fill(); g.lineWidth = Math.max(1, r * 0.3); g.strokeStyle = '#120D0B'; g.stroke(); } }
    MARKS.push({ x0: x - nn * r * 1.25, y0: py - r - 1, x1: x + nn * r * 1.25, y1: py + r + 2, u, kind: 'ap' });
  }
  // Deckungsschild rechts (nur wenn die Einheit auf ihrem Feld steht, nicht während einer Bewegung)
  if (E.active(u)) { const [tx, ty] = center(u.c, u.r); if (Math.abs(tx - d.x) + Math.abs(ty - d.y) < 2) { const cv0 = E.coverOf(G, u);
    if (cv0.tier) { const sh = Math.max(9, s * 0.15), cx = bx + bw + sh * 0.55; drawShield(g, cx, mid, sh, cv0.tier); MARKS.push({ x0: cx - sh * 0.45, y0: mid - sh / 2, x1: cx + sh * 0.45, y1: mid + sh / 2, u, kind: 'cover' }); } } }
  // Anführer-Orden rechts neben der Figur, im eigenen Feld; abgedunkelt, solange kein Befehl möglich ist
  if (u.officer && E.active(u)) { const oi = UPI.orden, oh = s * 0.4, ox = x + s * 0.5, oy = y - s * K * 0.3, ready = orderReady(u);
    if (oi) { const ow = oh * oi.naturalWidth / oi.naturalHeight; if (!ready) g.filter = 'grayscale(0.7) brightness(0.45)'; g.drawImage(oi, ox - ow / 2, oy - oh / 2, ow, oh); g.filter = 'none'; }
    else { g.font = `900 ${Math.round(s * 0.3)}px sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineWidth = Math.max(2, s * 0.06); g.strokeStyle = '#120D0B'; g.strokeText('★', ox, oy); g.fillStyle = ready ? '#C2A461' : '#7d7564'; g.fillText('★', ox, oy); }
    MARKS.push({ x0: ox - oh * 0.3, y0: oy - oh / 2, x1: ox + oh * 0.3, y1: oy + oh / 2, u, kind: 'lead' }); }
  // Ein Zustandsplatz links: wichtigster Zustand, „+n“ bei mehreren
  const sts = statesOf(u, d);
  if (sts.length) {
    const R = Math.max(7, s * 0.13), cx = bx - R - 2;
    drawSym(g, UPI['s_' + sts[0].sym], cx, mid, R);
    if (sts.length > 1) { const t = '+' + (sts.length - 1), tx = cx + R * 0.85, ty = mid - R * 0.95; g.font = `700 ${Math.round(Math.max(13, s * 0.2))}px "Arm Text", system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.lineWidth = Math.max(3, s * 0.07); g.lineJoin = 'round'; g.strokeStyle = '#120D0B'; g.strokeText(t, tx, ty); g.fillStyle = '#F0EDE1'; g.fillText(t, tx, ty); }
    MARKS.push({ x0: cx - R * 1.1, y0: mid - R * 1.6, x1: cx + R * 1.6, y1: mid + R * 1.1, u, kind: 'state' });
  }
  g.globalAlpha = 1;
}

// ---------- Zeichnen ----------
// STEP = vergangene Zeit in 60-Hz-Bildern (gleich schnell bei 30, 60 oder 144 Hz); FS = dazu das Spieltempo, passend zu wait()
let lastT = 0, STEP = 1, FS = 1;
// Hilfsmarkierung auf einem Feld: Fläche und Rand in einem Palettenton, wahlweise gestrichelt oder schraffiert, Symbol oben im Feld
const BONE = '240,237,225', BRASS = '194,164,97', PARCH = '187,165,131', LIFE = '142,43,34';
function hexMark(c, r, o) {
  const g = ctx, s = L.s, pz = 0.5 + 0.5 * Math.sin(now / 320);
  hexPath(g, c, r, 0.9); g.fillStyle = `rgba(${o.rgb},${(o.fill ?? 0.14) + 0.05 * pz})`; g.fill();
  if (o.hatch) { g.save(); hexPath(g, c, r, 0.9); g.clip(); const [cx, cy] = center(c, r); g.strokeStyle = `rgba(${o.rgb},0.28)`; g.lineWidth = Math.max(1, s * 0.03); g.beginPath();
    for (let i = -6; i <= 6; i++) { const d = i * s * 0.2; g.moveTo(cx + d - s, cy + s); g.lineTo(cx + d + s, cy - s); } g.stroke(); g.restore(); }
  hexPath(g, c, r, 0.9); g.strokeStyle = `rgba(${o.rgb},${o.soft ? 0.45 : 0.85})`; g.lineWidth = Math.max(o.soft ? 1.2 : 2, s * (o.soft ? 0.025 : 0.05));
  if (o.dash) g.setLineDash([s * 0.14, s * 0.1]);
  g.stroke(); g.setLineDash([]);
  if (o.sym) { const [cx, cy] = center(c, r); MARKQ.push(() => { g.globalAlpha = 0.85 + 0.15 * pz; drawSym(g, o.sym, cx, cy - s * K * (o.inHex ? 0.1 : 0.62), s * 0.2); g.globalAlpha = 1; }); }   // Symbol über den Figuren
}
function frame(t) { STEP = lastT ? Math.min(4, Math.max(0.1, (t - lastT) / 16.667)) : 1; lastT = t; FS = STEP * speed; now = t; draw(); requestAnimationFrame(frame); }
function draw() {
  if (!L || !tcv) return;
  const g = ctx, s = L.s;
  MARKS.length = 0;
  g.drawImage(tcv, 0, 0);
  for (const dc of decals) {
    const im = FXI['blood' + dc.v];
    if (im) { const w = dc.r * 5, hh = w * im.naturalHeight / im.naturalWidth * Math.max(0.6, K); g.globalAlpha = 0.85; g.drawImage(im, dc.x - w / 2, dc.y - hh / 2, w, hh); g.globalAlpha = 1; }
    else { g.fillStyle = dc.col; g.beginPath(); g.ellipse(dc.x, dc.y, dc.r, dc.r * K, 0, 0, 7); g.fill(); }
  }
  // Markierungen
  if (sel && human(G.side) && !busy) {
    // Bewegungsfelder dezent (Wunsch des Nutzers): halbdurchsichtige Fläche, Gelände bleibt sichtbar. Ziehen = Knochenweiß, Marsch/Rückzug = Messing.
    for (const [, n] of reach) { hexPath(g, n.c, n.r, 0.9); const far = n.march || n.retreat; g.fillStyle = far ? 'rgba(194,164,97,0.11)' : 'rgba(240,237,225,0.13)'; g.fill(); g.strokeStyle = far ? 'rgba(194,164,97,0.45)' : 'rgba(240,237,225,0.4)'; g.lineWidth = Math.max(1, s * 0.025); g.stroke();
      if (G.map[n.c][n.r].t === 'wire') { hexPath(g, n.c, n.r, 0.8); g.strokeStyle = 'rgba(142,43,34,0.75)'; g.setLineDash([s * 0.08, s * 0.08]); g.lineWidth = Math.max(1.5, s * 0.035); g.stroke(); g.setLineDash([]); } }
    if (E.canCut(G, sel)) { const [cx, cy] = center(sel.c, sel.r), pu = 0.5 + 0.5 * Math.sin(now / 220); hexPath(g, sel.c, sel.r, 0.96); g.strokeStyle = `rgba(255,224,120,${0.5 + pu * 0.5})`; g.lineWidth = Math.max(3, s * 0.1); g.stroke();
      g.font = `900 ${Math.round(s * 0.55)}px "Arm Text", system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineWidth = Math.max(3, s * 0.1); g.strokeStyle = O; g.strokeText('✂', cx + s * 0.62, cy - s * 0.95); g.fillStyle = '#ffe078'; g.fillText('✂', cx + s * 0.62, cy - s * 0.95); }
    for (const k of rangeSet) { if (shellHexes.has(k)) continue; hexPath(g, Math.floor(k / 100), k % 100, 0.96); g.fillStyle = 'rgba(142,43,34,0.06)'; g.fill(); g.strokeStyle = 'rgba(142,43,34,0.2)'; g.lineWidth = Math.max(1, s * 0.025); g.stroke(); }
    // Hilfsmarkierungen nach STYLE.md: gedämpfte Palettentöne, unterscheidbar über Muster und Symbol (Wunsch des Nutzers)
    { const sym = sel && TYPES[sel.type].abil && UPI['s_' + (ABIL_SYM[TYPES[sel.type].abil] || 'blitz')];
      const hk = hoverHex && E.key(hoverHex[0], hoverHex[1]);
      for (const k of abilSet) hexMark(Math.floor(k / 100), k % 100, { rgb: BRASS, fill: 0.1, soft: true, sym: k === hk ? sym : null, inHex: true }); }   // dezent, Symbol nur unter Maus/Finger
    for (const k of shellHexes) {
      const c = Math.floor(k / 100), r = k % 100;
      hexPath(g, c, r, 0.92); g.fillStyle = `rgba(235,40,30,${0.36 + 0.1 * Math.sin(now / 260)})`; g.fill(); g.strokeStyle = '#ff5a40'; g.lineWidth = Math.max(2, s * 0.06); g.stroke();
    }
    if (sightSet.size) for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) if (sightSet.has(E.key(c, r))) {
      hexPath(g, c, r, 0.9); g.fillStyle = E.dist(sel.c, sel.r, c, r) > P.SPOT ? 'rgba(240,237,225,0.30)' : 'rgba(240,237,225,0.13)'; g.fill(); g.strokeStyle = 'rgba(240,237,225,0.55)'; g.lineWidth = Math.max(1, s * 0.03); g.stroke(); }
    if (scoutSet.size) { g.font = `900 ${Math.round(s * 0.34)}px "Arm Text", system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
      for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) if (scoutSet.has(E.key(c, r))) { const [hx, hy] = center(c, r); g.lineWidth = Math.max(2, s * 0.08); g.strokeStyle = O; g.strokeText('◉', hx, hy); g.fillStyle = '#F0EDE1'; g.fillText('◉', hx, hy); } }
    for (const id of sendSet) { const hu = unitById(id); hexMark(hu.c, hu.r, { rgb: BONE, dash: true, sym: UPI.s_meldehund }); }
    for (const id of recSet) { const hu = unitById(id); hexMark(hu.c, hu.r, { rgb: BRASS, sym: UPI.s_schraubenschluessel }); }
    for (const id of healSet) { const hu = unitById(id); hexMark(hu.c, hu.r, { rgb: BONE, sym: UPI.s_sanitaeter }); }
    for (const [, t] of targets) { const u = unitById(t.id), fire = t.kind === 'fire'; hexMark(u.c, u.r, { rgb: fire ? BRASS : LIFE, fill: 0.2, sym: UPI[fire ? 's_zielen' : 's_nahkampf'] }); }
  }
  if (placing) for (const k of spawnSet) hexMark(Math.floor(k / 100), k % 100, { rgb: PARCH, fill: 0.22, dash: true });
  if (hoverHex) {
    hexPath(g, hoverHex[0], hoverHex[1], 0.95); g.strokeStyle = 'rgba(255,250,225,0.55)'; g.lineWidth = Math.max(1.5, s * 0.04); g.stroke();
    if (sel && TYPES[sel.type].cls === 'art' && shellHexes.has(E.key(hoverHex[0], hoverHex[1])) && artMode !== 'he') {
      const cells = artMode === 'gas' ? E.gasCells(G, hoverHex[0], hoverHex[1]) : E.barrageCells(G, sel, hoverHex[0], hoverHex[1]);
      for (const [c, r] of cells) { hexPath(g, c, r, 0.9); g.fillStyle = artMode === 'gas' ? 'rgba(196,214,70,0.45)' : 'rgba(255,120,60,0.4)'; g.fill(); }
    }
  }
  // Zielfahnen
  for (const o of OBJECTIVES) {
    const [x, y] = center(o.c, o.r), col = VIS.ctrl[o.id] ? FIG.PAL[VIS.ctrl[o.id]].accent : '#b9b4a6', px = x + s * 0.5, base = y - s * 0.2 * K, top = base - s * 1.25;
    g.strokeStyle = O; g.lineWidth = Math.max(2, s * 0.08); g.beginPath(); g.moveTo(px, base); g.lineTo(px, top); g.stroke();
    const fl = VIS.ctrl[o.id] && CFLAG[fac(VIS.ctrl[o.id])], fim = fl && fl.complete && fl.naturalWidth ? fl : null;   // Wappenflagge hängt rechts an der Stange
    if (fim) { const fh = s * 0.95, fw = fh * fim.naturalWidth / fim.naturalHeight; g.drawImage(fim, px + s * 0.02, top - s * 0.04, fw, fh); }
    g.beginPath(); g.rect(px, fim ? base - s * 0.36 : top, s * (fim ? 0.36 : 0.5), s * 0.34); g.fillStyle = col; g.fill(); g.strokeStyle = O; g.lineWidth = Math.max(1.5, s * 0.05); g.stroke();
    g.fillStyle = '#16150f'; g.font = `800 ${Math.round(s * 0.28)}px "Arm Text", system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(o.pts, px + s * (fim ? 0.18 : 0.25), (fim ? base - s * 0.36 : top) + s * 0.18);
  }
  // Einheiten nach Tiefe
  const list = [];
  for (const u of G.units) { const d = DU.get(u.id); if (d && d.alpha > 0) list.push([d.y, u, d]); }
  list.sort((a, b) => a[0] - b[0]);
  for (const [, u, d] of list) drawUnit(u, d);
  for (const f of MARKQ) f(); MARKQ.length = 0;
  // Nebel (grau), ausgeleuchtete Felder (gelb), eigene Stollen und Minen
  for (const k of VIS.lit) { hexPath(g, k.c, k.r, 0.98); g.fillStyle = 'rgba(255,240,170,0.16)'; g.fill(); }
  for (const k of VIS.smoke) {
    const [x, y] = center(k.c, k.r);
    for (let i = 0; i < 4; i++) { const a = i * 1.6 + now / 1700 + k.c, rx = s * (0.5 + 0.08 * Math.sin(now / 800 + i));
      const gr = g.createRadialGradient(x + Math.cos(a) * s * 0.3, y - s * 0.2 + Math.sin(a) * s * 0.15, 0, x + Math.cos(a) * s * 0.3, y - s * 0.2, rx);
      gr.addColorStop(0, 'rgba(225,225,220,0.55)'); gr.addColorStop(1, 'rgba(225,225,220,0)'); g.fillStyle = gr; g.fillRect(x - s * 1.2, y - s * 1.2, s * 2.4, s * 2.4); }
  }
  const mySide = human(G.side) ? G.side : ['A', 'D'].find(human);
  g.font = `900 ${Math.round(s * 0.36)}px "Arm Text", system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
  for (const q of G.tunnels || []) if (q.side === mySide) { const [x, y] = center(q.c, q.r); g.lineWidth = Math.max(2, s * 0.07); g.strokeStyle = O; g.strokeText(`⛏${q.t}`, x, y + s * 0.15); g.fillStyle = '#ffb86a'; g.fillText(`⛏${q.t}`, x, y + s * 0.15); }
  for (const q of G.mines || []) if (q.side === mySide) { const [x, y] = center(q.c, q.r); g.beginPath(); g.ellipse(x, y + s * 0.2, s * 0.17, s * 0.1, 0, 0, 7); g.fillStyle = '#5b5434'; g.fill(); g.strokeStyle = '#e6d48a'; g.lineWidth = Math.max(1.5, s * 0.04); g.stroke(); }
  // Gaswolken
  for (const k of VIS.clouds) {
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
      const ang = Math.atan2(tr.y2 - tr.y1, tr.x2 - tr.x1), hh = s * tr.sz, w = fxw(pim, hh), reps = tr.stream ? tr.n : tr.n > 1 ? 2 : 1;
      for (let n = 0; n < reps; n++) {   // MG: Kette einzelner Geschosse mit kleinem Abstand (Wunsch des Nutzers)
        const p = tr.stream ? k * 1.9 - n * 0.11 : k * 1.15 - n * 0.3; if (p < 0 || p > 1) continue;
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
    g.save(); g.translate(mz.x, mz.y); if (mz.center) { if (mz.flip) g.scale(-1, 1); g.globalAlpha = Math.min(1, mz.life / (mz.max * 0.5)); g.drawImage(im, -w / 2, -hh * (mz.up || 0.5), w, hh); }
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
  // Bewegungskosten nur am Feld unter dem Mauszeiger, klein
  { const n = sel && human(G.side) && !busy && hoverHex && !abilSet.has(E.key(hoverHex[0], hoverHex[1])) && reach.get(E.key(hoverHex[0], hoverHex[1]));
    if (n) { const [x, y] = center(n.c, n.r), t = `${n.cost}${n.march ? ' · Marsch' : n.retreat ? ' · Rückzug' : ''}`; g.font = `700 ${Math.round(Math.max(14, s * 0.24))}px "Arm Text", system-ui, sans-serif`;
      g.lineWidth = Math.max(3, s * 0.07); g.lineJoin = 'round'; g.strokeStyle = '#120D0B'; g.strokeText(t, x, y - s * K * 0.45); g.fillStyle = '#F0EDE1'; g.fillText(t, x, y - s * K * 0.45); } }
  for (let i = floaters.length - 1; i >= 0; i--) {
    const f = floaters[i]; f.life -= f.hold ? STEP : FS; f.y -= s * STEP * (f.hold ? (f.life > f.max - 30 ? 0.012 : 0.0015) : 0.012);
    if (f.life <= 0) { floaters.splice(i, 1); continue; }
    g.globalAlpha = Math.min(1, f.life / 18);
    if (f.icon) {   // Symbol statt Text: kurz aufpoppen, dann langsam steigen
      const k = Math.min(1, (f.max - f.life) / 6), hh = s * (f.big ? 0.95 : 0.8) * (0.7 + 0.3 * k), ww = hh * f.icon.naturalWidth / f.icon.naturalHeight;
      g.save(); g.shadowColor = 'rgba(0,0,0,0.85)'; g.shadowBlur = s * 0.18; g.drawImage(f.icon, f.x - ww / 2, f.y - hh * 0.8, ww, hh); g.restore();
      if (f.sub) { g.font = `900 ${Math.round(s * 0.4)}px "Arm Text", system-ui, sans-serif`; g.textAlign = 'left'; g.lineWidth = Math.max(3, s * 0.1); g.strokeStyle = O; g.lineJoin = 'round';
        g.strokeText(f.sub, f.x + ww * 0.45, f.y - hh * 0.15); g.fillStyle = f.col; g.fillText(f.sub, f.x + ww * 0.45, f.y - hh * 0.15); g.textAlign = 'center'; }
      continue;
    }
    g.font = `900 ${Math.round(s * (f.hold ? (f.big ? 0.44 : 0.36) : f.big ? 0.26 : 0.22))}px "Arm Text", system-ui, sans-serif`;   // kurze Meldungen klein (Wunsch des Nutzers), Schadenszahlen groß
    g.lineWidth = Math.max(2, s * (f.hold ? 0.09 : 0.065)); g.strokeStyle = O; g.lineJoin = 'round'; g.strokeText(f.text, f.x, f.y);
    g.fillStyle = f.col; g.fillText(f.text, f.x, f.y);
  }
  g.globalAlpha = 1;
}

// ---------- Ton ----------
let soundOn = true;
const lastSnd = {}, SND_GAP = { cannonH: 200, boomH: 250, mg3: 250, tankmove: 900, impact: 200, punch1: 120, punch2: 120, punch3: 120, punch4: 600, swords: 200, medic: 5000, pain: 1500, horn: 3000, snarl: 1500, tiger: 1500, rifle: 70, mg: 250, cannon: 150, flame: 500, boom: 250, boom2: 400, barrage: 800, gas: 800, tank: 1500, glitch: 500, gallop: 1400, gallop2: 1400, neigh: 2500, march: 2000, win: 3000, launch: 200, grenade: 300, cry: 1200, steps: 1100, tramp: 1100, cut: 300, robot: 2500, armor: 200, smash: 300, sword: 300, axe: 300, minigun: 400, mg2: 250, clank: 300, heal: 900, panic: 3000, whistle: 1500 };
const SND = {};
for (const k in (window.SOUNDS || {})) { SND[k] = new Audio(window.SOUNDS[k]); SND[k].preload = 'auto'; }
// Hintergrundkulisse als leise Schleife
let ambient = null;
function setAmbient(on) {
  if (!SND.ambient) return;
  if (!ambient) { ambient = SND.ambient; ambient.loop = true; ambient.volume = 0.22; }
  try { if (on) { const p = ambient.play(); if (p && p.catch) p.catch(() => {}); } else ambient.pause(); } catch (e) {}
}
// Abwechslung: Gruppen von Tönen, aus denen zufällig gewählt wird (Wunsch des Nutzers)
const SND_VAR = { rifle: ['rifle', 'rifle2', 'rifle3'], cry: ['cry', 'scream'], heavy: ['heavy1', 'heavy2', 'heavy3'], grenade: ['grenade', 'grenade2'], axe: ['axe', 'slash'], punch: ['punch1', 'punch2', 'punch3', 'punch4', 'swords'] };
function playSound(name, vol = 0.6) {
  if (SND_VAR[name]) { const opts = SND_VAR[name].filter(k => SND[k]); if (opts.length) name = opts[Math.floor(Math.random() * opts.length)]; }
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
// Effekt-Texte als Symbole (Wunsch des Nutzers; Symbolbögen in FXDATA.proj i_*). [Textanfang, Symbol, Zahl aus dem Text]
const FICON = [['weicht zurück', 'retreat'], ['Rückzug', 'retreat'], ['Reaktionsfeuer', 'react'], ['Streuung', 'scatter'], ['Panik', 'rout'], ['flieht', 'rout'],
  ['Gas!', 'gas'], ['Schreck', 'fear', /−\d+/], ['niedergehalten', 'supp'], ['aufgerieben', 'worn'], ['Sammeln', 'rally'], ['gesammelt', 'rally'], ['Moral +', 'morup'],
  ['Vorwärts', 'whistle'], ['Sturm!', 'whistle'], ['Draht geschnitten', 'cut'], ['Draht niedergewalzt', 'crush'], ['steckt im Schlamm', 'stuck'], ['Panne', 'broken'],
  ['wieder flott', 'repair'], ['wieder frei', 'repair'], ['instand gesetzt', 'repair'], ['geborgen', 'repair'], ['Nebelwand', 'smoke'], ['Stollen', 'tunnel', /\d+/],
  ['Mine gelegt', 'mine', /\d+/], ['Mine!', 'mine'], ['Ausgeleuchtet', 'light'], ['Gas entgiftet', 'gasok'], ['kein Gas', 'gasok'], ['nachgeladen', 'ammo'],
  ['Gegenstoß', 'counter'], ['aufgebaut', 'setup'], ['Feuerbereit', 'aim'], ['Marsch', 'march'], ['aufgeprotzt', 'limber'], ['abgeprotzt', 'limber'], ['Nachschub', 'supply'], ['versorgt', 'heal', /\+[\d,]+/]];
function floater(x, y, text, col, big, hold) {
  const life = hold ? 210 : 60 / speed + 22, f = { x, y, text, col, life, max: life, big, hold };
  const m = FICON.find(([p]) => String(text).startsWith(p));
  if (false && m && PJI['i_' + m[1]]) {   // abgeschaltet: Symbole nur noch als Zustandsmarken (Wunsch des Nutzers)
 f.icon = PJI['i_' + m[1]]; const n = m[2] && String(text).match(m[2]); f.sub = n ? n[0] : ''; f.life = f.max = life + 14; }
  floaters.push(f);
}
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
    case 'move': { const k0 = TYPES[u.type].cls; if (k0 === 'cav') playSound('gallop2', 0.55); else if (u.limbered) playSound('gallop', 0.5); else if (k0 === 'walker') playSound(TYPES[u.type].fig ? 'mech' : 'tankmove', TYPES[u.type].fig ? 0.5 : 0.3); else if (TYPES[u.type].mech) playSound('mech', 0.45); else { if (TYPES[u.type].fig === 'dog') playSound('dog', 0.5); playSound(e.path.some(h => G.map[h[0]][h[1]].t === 'mud') ? 'steps' : 'tramp', 0.5); } } await animPath(e.u, e.path, TYPES[u.type].cls === 'cav' ? 110 : 170); VIS.ctrl = { ...G.ctrl }; break;
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
        const AT = au && TYPES[au.type], rs = !AT ? 'rifle' : AT.lob ? 'grenade' : AT.pin || AT.hidden ? 'sniper' : AT.cmd ? 'pistol' : AT.suit ? 'semi' : 'rifle';
        playSound(e.kind === 'rifle' ? rs : mini ? 'minigun' : mg ? (au && au.side === 'D' ? 'mg3' : 'mg') : 'cannon', mg ? 0.55 : 0.6);
        if (mini) muzzles.push({ img: 'muzzle', x: x1 + Math.cos(ang) * s * 0.3, y: y1 + Math.sin(ang) * s * 0.3, ang, sz: 0.8, off: 0.12, life: 24, max: 24 });
        else if (mg && PJI.mgfire) muzzles.push({ img: 'mgfire', x: x1 + Math.cos(ang) * s * 0.25, y: y1 + Math.sin(ang) * s * 0.25, ang, sz: 0.85, off: 0.02, life: 26, max: 26 });
        else if (can) muzzles.push({ img: 'dust', x: x1 + Math.cos(ang) * s * 0.5, y: y1 + Math.sin(ang) * s * 0.5, ang, sz: 0.6, off: 0.15, life: 26, max: 26 });
        tracers.push({ x1: x1 + (x2 > x1 ? 1 : -1) * s * 0.5, y1, x2, y2, life: mg ? 30 : 15, max: mg ? 30 : 15, n: mg ? 9 : 1, stream: mg, col: can ? '#ff9a3a' : '#ffe27a', img: can ? 'shard' : 'bullet', sz: mg ? 0.17 : can ? 0.34 : 0.2 });
        await wait((mg ? 30 : 15) * 16.667 * 0.9);
        if (can) { boom(x2, y2 + s * 0.4, s * 0.5, 'he'); playSound('boom', 0.45); }
      }
      break;
    }
    case 'shell': {
      const a = DU.get(e.a), [x1, y1] = bodyPos(e.a), [x2, y2] = center(e.c, e.r);
      a.face = e.face; playSound(TYPES[unitById(e.a).type].mobile ? 'launch' : 'cannonH', TYPES[unitById(e.a).type].mobile ? 0.42 : 0.8);   // Mörser: Mörserton, Geschütze: Kanonenschuss
      if (PJI.dust) muzzles.push({ img: 'dust', x: x1 + (x2 > x1 ? 1 : -1) * s * 0.4, y: y1 - s * 0.15, ang: x2 > x1 ? -0.6 : Math.PI + 0.6, sz: 0.7, off: 0.15, life: 30, max: 30 }); else boom(x1 + (x2 > x1 ? 1 : -1) * s * 0.7, y1, s * 0.35, 'he');
      const dur = 34;   // in 60-Hz-Bildern bei Tempo 1; wait() teilt durch das Tempo wie die Flugbahn
      shells.push({ x1, y1, x2, y2, t: 0, dur, col: e.mode === 'gas' ? '#c4d646' : '#2a2a26', img: TYPES[unitById(e.a).type].mobile ? (PJI.rocket ? 'rocket' : 'shellB') : 'shellA', sz: 0.4 });
      await wait(dur * 16.667);
      if (e.scatter) floater(x2, y2 - s, 'Streuung!', '#f0d27a');
      if (e.guided) floater(x2, y2 - s * 1.5, '◉ gelenkt ×1,25', '#F0EDE1', false, true);
      playSound(e.mode === 'gas' ? 'gas' : e.mode === 'barrage' ? 'barrage' : TYPES[unitById(e.a).type].mobile ? 'boom' : 'boomH', 0.7);
      if (e.mode === 'he') { boom(x2, y2, s * 0.95, 'he'); burst(x2, y2, 16, ['#5a4632', '#3d3024', '#8a7a52'], { up: 0.3, spread: 0.3 }); }
      else if (e.mode === 'gas') { boom(x2, y2, s * 1.0, 'gas'); visSync('clouds'); }   // Wolke erst beim Einschlag
      else { boom(x2, y2, s * 0.7, 'he'); (e.cells || [[e.c, e.r], ...E.neighbors(e.c, e.r)]).slice(1).forEach(([c, r], i) => { const [bx, by] = center(c, r); boom(bx, by, s * 0.6, i % 2 ? 'dust' : 'he', 3 + i * 3); }); }
      await wait(e.mode === 'barrage' ? 420 : 260); break;
    }
    case 'melee': case 'counter': {
      const a = DU.get(e.a), d = DU.get(e.d);
      if (e.face != null) a.face = e.face; else a.face = d.x >= a.x ? 0 : 3;
      const au = unitById(e.a), du = unitById(e.d), af = au && TYPES[au.type].fig, armored = du && TYPES[du.type].cls === 'walker';
      const strikeSnd = () => {   // Ton für jeden, der zuschlägt: Angreifer (melee) und Verteidiger beim Gegenschlag (counter) – Wunsch des Nutzers; erklingt beim Treffer
        const mech = au && TYPES[au.type].mech;
        const du0 = unitById(e.d), foot = x => x && ['inf', 'mg', 'storm', 'medic', 'flame'].includes(TYPES[x.type].cls) && !TYPES[x.type].suit;
        const tank = au && TYPES[au.type].cls === 'walker' && !mech;
        playSound(mech ? 'heavy' : tank ? 'impact' : af === 'shield' ? 'sword' : af === 'raider' || af === 'brawler' ? 'axe' : foot(au) && foot(du0) ? 'punch' : au && TYPES[au.type].cls === 'storm' && e.t === 'melee' ? 'grenade' : au && TYPES[au.type].cls === 'cav' ? 'slash' : 'punch', (mech || tank ? 0.7 : 0.55) * (e.t === 'counter' ? 0.85 : 1));
        if (foot(au) && foot(du0) && Math.random() < 0.35) playSound('cry', 0.35);
        if (af === 'mechB') playSound(Math.random() < 0.5 ? 'snarl' : 'tiger', 0.4);   // Klauenschreiter knurrt
      };
      let thrown = false;
      { const kc = au && TYPES[au.type].cls; if (e.t === 'melee' && kc === 'storm' && af !== 'shield' && af !== 'raider' && af !== 'brawler') (thrown = true, shells.push({ x1: a.x, y1: a.y - s * 0.5, x2: d.x, y2: d.y - s * 0.2, t: 0, dur: 16, arc: 0.9, spin: true, img: au.side === 'A' ? 'pine' : 'stick', sz: 0.3 })); }
      a.lunge = { dx: (d.x - a.x) * 0.38, dy: (d.y - a.y) * 0.38 }; await wait(thrown ? 16 * 16.667 : 140);   // Handgranate: Knall erst beim Aufschlag
      strikeSnd();
      const mx = (a.x + d.x) / 2 + (d.x - a.x) * 0.2, my = (a.y + d.y) / 2 - s * 0.5;
      boom(mx, my + s * 0.25, s * 0.3, 'dust');
      { // Nahkampf-Bilder aus dem Effektbogen des Nutzers: Hieb, Kolbenstoß, Krallen, Bajonettstich, Aufprall, Blut
        const T0 = au && TYPES[au.type], kc = T0 && T0.cls, fl = d.x < a.x, ang = Math.atan2(d.y - a.y, d.x - a.x);
        let k = null;
        if (af === 'mechB' || af === 'mechK' || af === 'mechA') k = 'mclaw';
        else if (kc === 'cav' || af === 'raider' || af === 'brawler' || af === 'knight') k = 'mswing';
        else if (af === 'shield' || af === 'shieldA' || kc === 'walker') k = 'msmash';
        else if (kc !== 'art') k = ['mstab', 'msmash', 'mswing'][Math.floor(Math.random() * 3)];
        if (k === 'mstab' && PJI.mstab) muzzles.push({ img: 'mstab', x: a.x + (d.x - a.x) * 0.25, y: a.y - s * 0.45 + (d.y - a.y) * 0.25, ang, off: 0, sz: 0.4, life: 34, max: 34 });
        else if (k && PJI[k]) muzzles.push({ img: k, x: d.x, y: d.y - s * 0.1, center: true, up: 0.85, sz: k === 'mswing' ? 1.3 : 1.25, flip: fl, life: 42, max: 42 });
        if (PJI.mimpact) muzzles.push({ img: 'mimpact', x: mx, y: my + s * 0.25, center: true, up: 0.5, sz: kc === 'walker' ? 1.1 : 0.85, life: 26, max: 26 });
        if (blood && PJI.msplat && du && TYPES[du.type].cls !== 'walker' && TYPES[du.type].cls !== 'art') muzzles.push({ img: 'msplat', x: d.x + (fl ? -1 : 1) * s * 0.15, y: d.y - s * 0.35, center: true, up: 0.5, sz: 0.9, flip: fl, life: 54, max: 54 });
      }
      if (au && TYPES[au.type].mech && TYPES[au.type].cls === 'walker' && PJI.hammer) muzzles.push({ img: 'hammer', x: d.x, y: d.y + s * 0.35, center: true, up: 0.75, sz: 1.7, life: 34, max: 34 });
      if (af === 'drill') muzzles.push({ img: 'crash', x: d.x, y: d.y + s * 0.3, center: true, up: 0.9, sz: 1.3, life: 30, max: 30 });
      if (armored || af === 'drill' || af === 'mechA' || af === 'mechK' || af === 'mechC') { if (armored) playSound(du && TYPES[du.type].mech ? 'heavy' : 'armor', 0.6); muzzles.push({ img: 'sparks', x: d.x, y: d.y - s * 0.45, center: true, sz: 0.95, life: 22, max: 22 }); }
      await wait(170); a.lunge = null; await wait(70); break;
    }
    case 'hit': {
      const d = DU.get(e.u), [x, y] = bodyPos(e.u);
      if (E.isMech(u.type)) playSound('robot', 0.5);
      d.str = e.str; d.mor = e.morv; d.shake = 1; setTimeout(() => d.shake = 0, 260 / speed);
      if (!e.panic) {
        if (TYPES[u.type].cls === 'cav' || u.limbered) playSound('neigh', 0.5);
        else if (['inf', 'mg', 'storm', 'medic'].includes(TYPES[u.type].cls) && e.dmg >= 1) playSound(e.str < 3.5 && Math.random() < 0.6 ? 'medic' : 'pain', 0.45);
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
    case 'gas': { const d = DU.get(e.u); d.vs.gassed = true; d.str = e.str; d.mor = e.morv; floater(...headPos(e.u), 'Gas!', '#d6e670'); await wait(220); break; }
    case 'fear': { DU.get(e.u).mor = e.morv; floater(...headPos(e.u), 'Schreck: Moral −10', '#f0d27a'); await wait(200); break; }
    case 'supp': DU.get(e.u).vs.supp = 1; floater(...headPos(e.u), 'niedergehalten', '#e9cf5a'); await wait(170); break;
    case 'rout': DU.get(e.u).vs.rout = true; playSound('panic', 0.4); floater(...headPos(e.u), 'flieht!', '#ffffff', true); toast(`${nm(u)} flieht.`); await wait(360); break;
    case 'destroyed': {
      const d = DU.get(e.u); floater(...headPos(e.u), 'aufgerieben', '#ff6a50', true); toast(`${nm(u)} ist aufgerieben.`);
      if (TYPES[u.type].cls === 'walker' || TYPES[u.type].cls === 'art') { boom(d.x, d.y, s * 1.1, 'he'); playSound('boom2', 0.75); }
      else if (blood) { boom(d.x, d.y, s * 0.6, 'blood'); decals.push({ v: 3, x: d.x, y: d.y, r: s * 0.36, col: 'rgba(84,10,8,0.6)' }); for (let q = 0; q < 6; q++) decals.push({ v: 1 + Math.floor(Math.random() * 4), x: d.x + (Math.random() - 0.5) * s * 1.3, y: d.y + (Math.random() - 0.5) * s * 0.9 * K, r: s * (0.08 + Math.random() * 0.14), col: 'rgba(110,16,12,0.6)' }); burst(d.x, d.y - s * 0.4, 18, ['#9a1612', '#74100c'], { up: 0.2, spread: 0.3 }); }
      for (let k = 0; k < 10; k++) { d.alpha = 1 - k / 10; await wait(28); } d.alpha = 0; break;
    }
    case 'escaped': DU.get(e.u).alpha = 0; toast(`${nm(u)} hat das Schlachtfeld verlassen.`); break;
    case 'officer': toast(`${e.name} ist gefallen.`); floater(...headPos(e.u), e.name + ' fällt', '#ff6a50', true); await wait(300); break;
    case 'sent': { playSound('dog', 0.55); playSound('comeon', 0.45); const d = DU.get(e.u), m = DU.get(e.by); if (m) m.face = d.x >= m.x ? 0 : 3; floater(...headPos(e.u), '+1 Aktion', '#F0EDE1', true); await wait(300); break; }
    case 'order': {
      const d0 = DU.get(e.u), rl = e.kind === 'rally'; playSound(unitById(e.u) && unitById(e.u).side === 'D' ? 'roar' : rl ? 'stand' : 'forward', 0.75);   // Aschenwacht-Führung: Kampfschrei (Wunsch des Nutzers: nur der Anführer)
      toast(`${e.name}: ${rl ? 'Sammeln!' : 'Sturmbefehl!'}`); floater(...headPos(e.u), rl ? 'Sammeln!' : 'Vorwärts!', rl ? '#b8ff7c' : '#ffb04a', true);
      for (let q = 0; q < 2; q++) rings.push({ x: d0.x, y: d0.y, r: 2.6 + q * 1.4, col: rl ? '#b8ff7c' : '#ffb04a', life: 34 + q * 10, max: 34 + q * 10 });
      if (rl) for (const id of e.ids || []) { const dd = DU.get(id); if (dd) dd.vs.supp = 0; }
      await wait(260);
      e.ids.forEach((id, i) => { const dd = DU.get(id); if (!dd) return; if (rl) dd.mor = e.mors[i]; if (id !== e.u) floater(...headPos(id), rl ? 'Moral +' : 'Sturm!', rl ? '#b8ff7c' : '#ffb04a'); });
      await wait(260); break;
    }
    case 'rally': DU.get(e.u).vs.supp = 0; DU.get(e.u).vs.rout = false; floater(...headPos(e.u), 'gesammelt!', '#b8ff7c', true); toast(`${e.by} sammelt ${TYPES[u.type].name}.`); DU.get(e.u).face = u.face; await wait(300); break;
    case 'cut': { playSound('cut', 0.7); const [x, y] = center(e.c, e.r); burst(x, y - s * 0.2, 10, ['#c8ccd0', '#ffe090'], { spread: 0.2 }); floater(x, y - s, 'Draht geschnitten', '#e6e9ec'); renderTerrain(); await wait(280); break; }
    case 'crush': { const [x, y] = center(e.c, e.r); boom(x, y, s * 0.5, 'dust'); floater(x, y - s * 1.2, 'Draht niedergewalzt', '#e6e9ec'); renderTerrain(); await wait(160); break; }
    case 'terrain': { renderTerrain(); if (e.what) { const [x, y] = center(e.c, e.r); floater(x, y - s * 0.6, e.what, '#e6e9ec'); } break; }
    case 'stuck': { DU.get(e.u).vs.stuck = 1; playSound('crash', 0.65); const d0 = DU.get(e.u); muzzles.push({ img: 'mudsplash', x: d0.x, y: d0.y + s * 0.4, center: true, up: 0.85, sz: 1.8, life: 56, max: 56 }); } playSound('steps', 0.7); floater(...headPos(e.u), 'steckt im Schlamm', '#d9c9a0'); await wait(250); break;
    case 'breakdown': { const d0 = DU.get(e.u); d0.vs.broken = 1; muzzles.push({ img: 'engine', x: d0.x + s * 0.1, y: d0.y + s * 0.35, center: true, up: 0.92, sz: 2.3, life: 80, max: 80 }); }
      if (TYPES[u.type].fig) { const d0 = DU.get(e.u); muzzles.push({ img: 'bolt', x: d0.x - s * 0.5, y: d0.y - s * 0.7, ang: -0.25, sz: 0.55, off: 0.1, life: 34, max: 34 }); }
      playSound('crash', 0.7); floater(...headPos(e.u), 'Panne!', '#ffb04a', true); toast(`${nm(u)} bleibt mit einer Panne liegen.`); await wait(350); break;
    case 'repaired': DU.get(e.u).vs.broken = 0; floater(...headPos(e.u), 'wieder flott', '#b8ff7c'); await wait(200); break;
    case 'smoke': { playSound('gas', 0.5); for (const [c, r] of e.cells) { const [x, y] = center(c, r); boom(x, y, s * 0.7, 'dust', Math.random() * 8); } visSync('smoke'); floater(...headPos(e.u), 'Nebelwand', '#e6e6e0'); await wait(450); break; }
    case 'tunnel': { playSound('steps', 0.5); const [x, y] = center(e.c, e.r); floater(x, y - s * 0.6, 'Stollen: 2 Runden', '#ffb86a', true); await wait(300); break; }
    case 'tunnelBlow': { const [x, y] = center(e.c, e.r); playSound('boom2', 0.8); playSound('grenade2', 0.6); boom(x, y, s * 1.6, 'he'); burst(x, y, 30, ['#5a4632', '#3d3024', '#8a7a52'], { up: 0.45, spread: 0.4 }); banner('Stollen gesprengt', ''); await wait(700); break; }
    case 'blast': { const [x, y] = center(e.c, e.r); playSound('grenade2', 0.75); boom(x, y, s * 1.1, 'he'); burst(x, y, 18, ['#ffd27a', '#5a4632'], { up: 0.3, spread: 0.3 }); await wait(380); break; }
    case 'mineLaid': { const [x, y] = center(e.c, e.r); playSound('cut', 0.4); floater(x, y - s * 0.5, `Mine gelegt (${e.left} übrig)`, '#e6d48a'); await wait(220); break; }
    case 'mine': { const [x, y] = center(e.c, e.r); playSound('grenade2', 0.75); boom(x, y, s * 1.0, 'he'); floater(x, y - s * 0.9, 'Mine!', '#ff9a6a', true); await wait(380); break; }
    case 'light': { visSync('lit'); playSound('clank', 0.4); floater(...headPos(e.u), 'Ausgeleuchtet', '#fff0a0'); await wait(260); break; }
    case 'clear': { visSync('clouds'); playSound('flame', 0.35); floater(...headPos(e.u), e.n ? 'Gas entgiftet' : 'kein Gas', '#c4e6a0'); await wait(260); break; }
    case 'ammo': { playSound('clank', 0.5); floater(...headPos(e.u), 'nachgeladen', '#ffe7a0', true); await wait(260); break; }
    case 'counterstrike': { playSound('charge', 0.6); floater(...headPos(e.u), 'Gegenstoß!', '#ff8a6a', true); await wait(250); break; }
    case 'score': { const hs = OBJECTIVES.filter(o => G.ctrl[o.id] === e.side); for (const o of hs) { const [x, y] = center(o.c, o.r); floater(x, y - s * 1.5, '+' + o.pts, sideCol(e.side), true); } await wait(350); updateUI(); break; }
    case 'unstuck': DU.get(e.u).vs.stuck = 0; floater(...headPos(e.u), 'wieder frei', '#b8ff7c'); await wait(150); break;
    case 'recovered': { const dr = DU.get(e.u); if (dr) { dr.vs.broken = 0; dr.vs.stuck = 0; } playSound('clank', 0.7); floater(...headPos(e.u), e.broken ? 'instand gesetzt' : 'geborgen', '#b8ff7c', true); await wait(320); break; }
    case 'setup': { playSound('clank', 0.5); floater(...headPos(e.u), 'aufgebaut', '#ffe7a0'); await wait(200); break; }
    case 'ow': floater(...headPos(e.u), 'Feuerbereit', '#F0EDE1', true); await wait(220); break;
    case 'march': floater(...headPos(e.u), 'Marsch', '#ffd27a'); break;
    case 'retreatmove': floater(...headPos(e.u), 'Rückzug', '#ffd27a'); break;
    case 'wind': toast('Der Wind dreht.'); updateTop(); break;
    case 'limber': playSound('clank', 0.6); floater(...headPos(e.u), e.on ? 'aufgeprotzt' : 'abgeprotzt', '#e9d9a8'); await wait(220); break;
    case 'spawn': { playSound('whistle', 0.5); addDU(u); const d = DU.get(e.u), [x] = center(u.c, u.r), dir = u.side === 'A' ? -1 : 1; toast(`Nachschub: ${nm(u)} trifft ein.`);
      for (let k = 0; k < 16; k++) { d.x = x + dir * s * 2 * (1 - (k + 1) / 16); await raf(); } floater(...headPos(e.u), 'Nachschub', '#b8ff7c'); await wait(200); break; }
    case 'heal': { playSound('heal', 0.5); const d = DU.get(e.u); d.str = e.str; d.mor = e.morv; if (e.by != null) { const m = DU.get(e.by); m.face = d.x >= m.x ? 0 : 3; shells.push({ x1: m.x, y1: m.y - s * 0.5, x2: d.x, y2: d.y - s * 0.4, t: 0, dur: 14, arc: 0.5, img: 'bandage', sz: 0.34 }); await wait(240); }
      rings.push({ x: d.x, y: d.y - s * 0.55, r: 0.8, img: ['crossF1', 'crossF2', 'crossF3', 'crossG'][Math.floor(Math.random() * 4)], life: 50, max: 50 }); floater(...headPos(e.u), 'versorgt', '#8fe0c8', true); await wait(350); break; }
    case 'gascloud': visSync('clouds'); break;
    case 'reinf': {
      for (const id of e.ids) { const nu = unitById(id); addDU(nu); const d = DU.get(id); d.x += s * 2; }
      banner('Gegenstoß der Aschenwacht', 'Sturmbrecher und Brandwerfer treffen ein'); playSound('horn', 0.5); playSound('march', 0.4);
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
// Kleine Pfeile am Rand zeigen, wohin man noch verschieben kann (Wunsch des Nutzers); antippen verschiebt ein Stück
const SCR = {};
for (const [k, ch] of [['l', '◀'], ['r', '▶'], ['u', '▲'], ['d', '▼']]) {
  const el = document.createElement('button'); el.className = 'scrhint ' + k; el.textContent = ch; el.hidden = true; el.setAttribute('aria-label', 'Karte verschieben');
  el.addEventListener('click', () => { const dx = k === 'l' ? -1 : k === 'r' ? 1 : 0, dy = k === 'u' ? -1 : k === 'd' ? 1 : 0; board.scrollBy({ left: dx * board.clientWidth * 0.4, top: dy * board.clientHeight * 0.4, behavior: 'smooth' }); });
  document.body.appendChild(el); SCR[k] = el;
}
function updScroll() {
  const b = board.getBoundingClientRect(), sl = board.scrollLeft, st = board.scrollTop, mx = board.scrollWidth - board.clientWidth, my = board.scrollHeight - board.clientHeight;
  const show = { l: sl > 4, r: sl < mx - 4, u: st > 4, d: st < my - 4 };
  for (const k in SCR) {
    const el = SCR[k]; el.hidden = !show[k] || !G || !document.querySelector('#start')?.hidden; if (el.hidden) continue;
    const x = k === 'l' ? b.left + 6 : k === 'r' ? b.right - 34 : b.left + b.width / 2 - 14, y = k === 'u' ? b.top + 6 : k === 'd' ? b.bottom - 34 : b.top + b.height / 2 - 14;
    el.style.left = x + 'px'; el.style.top = y + 'px';
  }
}
board.addEventListener('scroll', updScroll, { passive: true }); addEventListener('resize', () => setTimeout(updScroll, 50)); setInterval(updScroll, 700);
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
cv.addEventListener('pointerleave', () => { hoverHex = null; hoverU = null; hideTip(); });
// Pergament-Tooltips für Marken (Karte und Panel), per Maus beim Drüberfahren, per Touch durch Antippen oder langes Drücken
const mtip = document.createElement('div'); mtip.className = 'mtip'; mtip.setAttribute('role', 'tooltip'); document.body.appendChild(mtip);
let tipKey = null, tipTm = 0;
const tipHtml = list => list.filter(Boolean).map(t => `<b>${upEsc(t.name)}</b><span>${upEsc(t.text)}</span>`).join('');
function showTip(list, cx, cy, key, ms) {
  clearTimeout(tipTm); if (ms) tipTm = setTimeout(hideTip, ms);
  if (key !== tipKey) { mtip.innerHTML = tipHtml(list); tipKey = key; }
  const w = mtip.offsetWidth, h = mtip.offsetHeight;
  mtip.style.left = Math.round(Math.max(8, Math.min(innerWidth - w - 8, cx - w / 2))) + 'px';
  mtip.style.top = Math.round(cy - h - 18 < 8 ? cy + 26 : cy - h - 18) + 'px';
  mtip.classList.add('show');
}
function hideTip() { clearTimeout(tipTm); tipKey = null; mtip.classList.remove('show'); }
function markAt(x, y) { for (let i = MARKS.length - 1; i >= 0; i--) { const m = MARKS[i]; if (x >= m.x0 && x <= m.x1 && y >= m.y0 && y <= m.y1) return m; } return null; }
function markTips(m) {
  const u = m.u, d = DU.get(u.id), T = TYPES[u.type];
  if (!d || !E.alive(u)) return [];
  if (m.kind === 'state') return statesOf(u, d).map(st => ({ name: st.name, text: st.text(u, d) }));
  if (m.kind === 'cover') return [coverTip(u)];
  if (m.kind === 'lead') { const cd = n => n > 0 ? `wieder in ${upRunden(n)}` : 'bereit'; return [{ name: `Anführer: ${u.officer}`, text: `Befehle an Truppen in Reichweite. Sammeln ${cd(u.cdR)}, Sturmbefehl ${cd(u.cdS)}.${u.ordered ? ' In dieser Runde schon befohlen.' : ''} Dunkler Orden: gerade kein Befehl möglich.` }]; }
  if (m.kind === 'ap') { const ap = d.vs.broken || d.vs.supp ? 0 : (u.ap || 0); return [{ name: 'Aktionspunkte', text: `Noch ${ap} von ${P.AP}. Ziehen, Schießen und Befehle kosten je 1, Nahkampf alle.` }]; }
  return [{ name: `Stärke ${fmt(d.str)} von 100`, text: `Moral ${fmt(d.mor)} von ${fmt(T.mor)}. Der Balken zeigt die Stärke in der Farbe der Seite.` }];
}
const markKey = m => m.u.id + m.kind;
cv.addEventListener('pointermove', ev => {
  if (ev.pointerType !== 'mouse' || !G || (drag && drag.moved)) return;
  const [x, y] = evToPx(ev), m = markAt(x, y);
  if (m) showTip(markTips(m), ev.clientX, ev.clientY, markKey(m)); else if (tipKey && !String(tipKey).startsWith('hud')) hideTip();
});
{ let tm = 0, long = false;
  cv.addEventListener('pointerdown', ev => { long = false; clearTimeout(tm); if (ev.pointerType === 'mouse' || !G) return;
    const [x, y] = evToPx(ev), m = markAt(x, y), cx = ev.clientX, cy = ev.clientY;
    hoverHex = pixToHex(x, y);   // Finger: Feld darunter wie beim Drüberfahren hervorheben (z. B. Symbol auf Fähigkeits-Zielfeldern)
    if (!m) return hideTip();
    showTip(markTips(m), cx, cy, markKey(m), 3000);   // Antippen: zeigt den Tooltip, der Tipp wirkt trotzdem
    tm = setTimeout(() => { long = true; showTip(markTips(m), cx, cy, markKey(m), 4000); }, 420); });   // langes Drücken: nur Tooltip
  const stop = () => clearTimeout(tm);
  cv.addEventListener('pointerup', stop); cv.addEventListener('pointercancel', stop);
  cv.addEventListener('click', ev => { if (long) { long = false; ev.stopImmediatePropagation(); ev.preventDefault(); } }, true);
  cv.addEventListener('contextmenu', ev => { if (ev.pointerType !== 'mouse') ev.preventDefault(); });
}
cv.addEventListener('click', ev => {
  if (performance.now() - dragged < 250) return;   // war ein Verschieben, kein Klick
  if (!G || busy || G.over || !human(G.side)) return;
  const [x, y] = evToPx(ev), p = pick(x, y), h = p.h;
  if (placing) { if (h && spawnSet.has(E.key(h[0], h[1]))) return doBuy(h[0], h[1]); return; }
  if (sel) {
    // Mit gewählter Einheit zählt zuerst das Feld: Ziel, Zugfeld oder Beschussfeld, egal welche Figur davorsteht
    if (abilMode && h && abilSet.has(E.key(h[0], h[1]))) { abilMode = false; return act(m => E.useAbil(G, m, h[0], h[1])); }
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
  abilSet = new Set(); if (abilMode) for (const [c, r] of E.abilTargets(G, sel)) abilSet.add(E.key(c, r));
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
        : artMode === 'barrage' ? E.barrageCells(G, sel, c, r).some(h => foe(h[0], h[1]))
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
  previewT = null; recSet = new Set(); abilSet = new Set(); abilMode = false; reach = new Map(); targets = new Map(); shellHexes = new Set(); rangeSet = new Set(); healSet = new Set(); sendSet = new Set(); sightSet = new Set(); scoutSet = new Set(); updateHud();
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
function updateTop() {   // obere Leiste nach STYLE.md: Freund = Schild/Feldgrau, Feind = Zackenstern/Blutrot (Sicht der Seite am Zug bzw. des Spielers)
  const mine = human(G.side) ? G.side : (mode === 'hot' ? G.side : mode), ff = sd => sd === mine ? 'fr' : 'fo';
  $('turn').textContent = `Runde ${G.turn}`;
  const ch = $('sidechip'); ch.className = 'tb-plate tb-side ' + ff(G.side);
  ch.innerHTML = `<i class="tb-medal">${crest(G.side)}</i><b>${SIDES[G.side].short}</b>${human(G.side) ? '' : '<small>KI</small>'}`;
  ch.dataset.tip = `Am Zug: ${SIDES[G.side].name || SIDES[G.side].short}${human(G.side) ? '' : ' (Computer)'}`;
  $('windArrow').style.transform = `rotate(${WIND_DEG[G.wind]}deg)`;
  for (const sd of ['A', 'D']) {
    const v = Math.max(0, 1 - E.losses(G, sd)), el = $('meter' + sd), pc = Math.round(v * 100);
    el.className = 'tb-meter ' + ff(sd) + ' ' + sd;   // Platz nach Sicht (eigener links), Farbe fest je Fraktion
    el.style.setProperty('--v', Math.max(0.001, v)); el.style.setProperty('--brk', 1 - P.BREAK[sd]);
    el.querySelector('.tb-medal').innerHTML = crest(sd);
    el.querySelector('.val').textContent = pc + ' %';
    el.dataset.tip = `Kampfkraft ${SIDES[sd].short}: ${pc} %. Messingstrich: darunter bricht das Heer zusammen.`;
  }
  const own = c => c === 'A' || c === 'D' ? c : '';
  const foe = mine === 'A' ? 'D' : 'A';
  $('objs').innerHTML = `<span class="tb-plate tb-pts" data-tip="Siegpunkte (eigene : Gegner). Wer ${G.goal} erreicht, gewinnt. Kreise: Zielfelder mit ihren Punkten je Runde."><b class="${mine}">${G.vp[mine]}</b><i class="sep">:</i><b class="${foe}">${G.vp[foe]}</b><small>/ ${G.goal}</small>`
    + `<span class="tb-dots${UP.pA ? ' wim' : ''}">${OBJECTIVES.map(o => { const c = own(G.ctrl[o.id]), fl = c && PENNANT[fac(c)]; return `<span class="tb-obj ${c}">${o.pts}${fl ? `<i class="tb-flag${UP['p' + fac(c)] ? ' img' : ''}"><img src="${fl}" alt=""></i>` : ''}</span>`; }).join('')}</span></span>`;
}
// Tooltips der oberen Leiste per Touch (Digitalboards): Knöpfe lang drücken, Anzeigen kurz antippen. Klick nach langem Druck entfällt.
{ let tm = 0, hide = 0, long = false;
  const tb = $('topbar'), clear = () => tb.querySelectorAll('.tip').forEach(x => x.classList.remove('tip'));
  const show = el => { clear(); clearTimeout(hide); el.classList.add('tip'); hide = setTimeout(clear, 2500); };
  tb.addEventListener('pointerdown', e => { long = false; clearTimeout(tm); if (e.pointerType === 'mouse') return;
    const el = e.target.closest('[data-tip]'); if (!el) return clear();
    if (el.tagName === 'BUTTON') tm = setTimeout(() => { long = true; show(el); }, 420); else show(el); });
  tb.addEventListener('pointerup', () => clearTimeout(tm)); tb.addEventListener('pointercancel', () => clearTimeout(tm));
  tb.addEventListener('click', e => { if (long) { long = false; e.stopPropagation(); e.preventDefault(); } }, true);
  tb.addEventListener('contextmenu', e => { if (e.target.closest('[data-tip]')) e.preventDefault(); });
}
// Knöpfe der oberen Leiste: flache Symbole in Knochenweiß, Werte als kleine Marke
const TB_ICON = (d, fill) => `<svg viewBox="0 0 24 24" fill="${fill ? '#F0EDE1' : 'none'}" stroke="#F0EDE1" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const TB_SVG = {
  zoom: TB_ICON('<circle cx="10" cy="10" r="6"/><path d="M14.5 14.5 20.5 20.5M7.5 10h5M10 7.5v5"/>'),
  sndOn: TB_ICON('<path d="M3.5 9h4l5-4.5v15l-5-4.5h-4z" fill="#F0EDE1"/><path d="M16 9a4.5 4.5 0 0 1 0 6M18.5 6a8.5 8.5 0 0 1 0 12"/>'),
  sndOff: TB_ICON('<path d="M3.5 9h4l5-4.5v15l-5-4.5h-4z" fill="#F0EDE1"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>'),
  speed: TB_ICON('<path d="M3 6l8 6-8 6zM12 6l8 6-8 6z"/>', true),
  rules: TB_ICON('<path d="M8.5 9a3.5 3.5 0 1 1 5.2 3c-1.1.6-1.7 1.3-1.7 2.6"/><circle cx="12" cy="19" r="1.2" fill="#F0EDE1"/>'),
  full: TB_ICON('<path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/>'),
  menu: TB_ICON('<path d="M4 6h16M4 12h16M4 18h16"/>'),
  marks: TB_ICON('<circle cx="6.5" cy="15.5" r="4"/><circle cx="17.5" cy="15.5" r="4"/><path d="M10.5 15h3M4 12.5 6.5 5.5h3.5l.5 7M20 12.5 17.5 5.5H14l-.5 7"/>')
};
const tbNum = n => String(n).replace('.', ',') + '×';
function tbSync() {
  $('btnZoom').innerHTML = TB_SVG.zoom + `<b class="tb-v">${tbNum(ZOOM)}</b>`;
  $('btnSound').innerHTML = soundOn ? TB_SVG.sndOn : TB_SVG.sndOff;
  $('btnSpeed').innerHTML = TB_SVG.speed + `<b class="tb-v">${tbNum(speed)}</b>`;
  $('btnMarks').innerHTML = TB_SVG.marks; $('btnMarks').classList.toggle('on', marksOn); $('btnMarks').setAttribute('aria-pressed', marksOn);
  $('btnRules2').innerHTML = TB_SVG.rules; $('btnFull').innerHTML = TB_SVG.full; $('btnMenu').innerHTML = TB_SVG.menu;
  document.querySelectorAll('.tb-btn').forEach(b => b.setAttribute('aria-label', b.dataset.tip));
}
// Einheiten, die in dieser Runde nichts mehr tun können (gezogen und kein Ziel mehr, oder „Fertig“ gedrückt)
const spent = new Set();
function hasAction(u) {
  if (u.broken > 0) return false;
  if (u.ap < 1) return false;
  if (!u.supp && E.reachable(G, u).size) return true;
  if (E.canOrder(G, u) || G.units.some(o => E.canSend(G, u, o) || E.canRecover(G, u, o))) return true;
  if (E.canSetup(G, u)) return true;
  if (TYPES[u.type].abil && E.abilTargets(G, u).length) return true;
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
  gr.addColorStop(0, side === 'A' ? '#8a7a45' : '#5f6b70'); gr.addColorStop(1, '#22231c');
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  g.fillStyle = 'rgba(0,0,0,0.28)'; g.beginPath(); g.ellipse(W / 2, H * 0.88, W * 0.36, H * 0.07, 0, 0, 7); g.fill();
  const t0 = FIG.sprite(kind, side, 0, 100);
  const k0 = Math.min(H * 0.84 / t0.cv.height, W * 0.94 / t0.cv.width);
  const sp = FIG.sprite(kind, side, 0, 100 * k0);
  g.drawImage(sp.cv, Math.round((W - sp.cv.width) / 2), Math.round(H * 0.93 - sp.cv.height));
}
const pill = (k, v, cls = '') => `<div class="pill ${cls}"><small>${k}</small><b>${v}</b></div>`;
const bar = (k, v, max, kind, cls = '') => `<div class="sbar ${kind} ${cls}" title="${k}" style="--v:${Math.max(0, Math.min(1, v / max))}"><i></i><span>${k} ${fmt(v)}</span></div>`;
// ---------- Einheiten-Panel (STYLE.md): Bild, Werte, Fähigkeiten als Symbol-Knöpfe ----------
const UP = window.UIPANEL || {};
for (const k in UP) document.documentElement.style.setProperty('--up-' + k, `url("${UP[k]}")`);
const upSym = k => UP['s_' + k] || '';
const UP_MARK = {   // Ersatz, falls die Wappenbilder fehlen: Freund = Schild (Feldgrau), Feind = Zackenraute (Rot)
  friend: '<svg viewBox="0 0 40 44"><path d="M4 4h32v16c0 11-7 18-16 21C11 38 4 31 4 20z" fill="#7A8F99" stroke="#120D0B" stroke-width="3" stroke-linejoin="round"/><path d="M12 13h16M12 20h16" stroke="#120D0B" stroke-width="3" stroke-linecap="round"/></svg>',
  foe: '<svg viewBox="0 0 40 44"><path d="M20 2l5 9 9-3-3 10 7 4-7 4 3 10-9-3-5 9-5-9-9 3 3-10-7-4 7-4-3-10 9 3z" fill="#8E2B22" stroke="#120D0B" stroke-width="3" stroke-linejoin="round"/><path d="M14 16l12 12M26 16 14 28" stroke="#120D0B" stroke-width="3" stroke-linecap="round"/></svg>'
};
// Fraktionswappen (ui-quelle/wappen_*): Konkordat = eiserner Löwenkopf, Aschenwacht = Stahlhelm. Emblem allein als Marke, mit Flagge auf Zielfeldern.
// Fraktion je Seite: A = Konkordat oder Blaue Legion (Bilderset F), D = Aschenwacht. Wappen und Farbe hängen an der Fraktion.
const fac = sd => sd === 'D' ? 'D' : skinA === 'F' ? 'F' : 'A';
const FCOL = { A: '#8E2B22', D: '#7D8471', F: '#6F8FB5' };   // Blutrot, Feldgrau grünlich, Horizontblau (STYLE.md)
const sideCol = sd => FCOL[fac(sd)];
const crest = sd => UP['w' + fac(sd)] ? `<img class="crest" src="${UP['w' + fac(sd)]}" alt="${SIDES[sd].short}">` : (sd === 'A' ? UP_MARK.friend : UP_MARK.foe);
const CFLAG = {};
for (const f of ['A', 'D', 'F']) if (UP['f' + f]) { const im = new Image(); im.src = UP['f' + f]; CFLAG[f] = im; }
// Ersatz-Wimpel (nur falls das Bild UP.pA/pD/pF fehlt) für eroberte Zielmarken (oben in der Leiste): Dreieck in Fraktionsfarbe, ausgefranstes Ende, Pinselstriche,
// Tintenkontur, helle Form drauf (Konkordat Krone, Aschenwacht Helmspitze, Legion Hahnenkamm). Als Bild, damit die Filter-IDs getrennt bleiben.
const PENN_SYM = {
  A: 'M6.5 19L6 10.5 9.6 14 13 8 16.4 14 20 10.5 19.5 19Z',
  D: 'M5.5 20h15v-2h-1.2Q19 12.5 13 12 7 12.5 6.7 18H5.5ZM11.6 12.2l1.4-6 1.4 6Z',
  F: 'M6.5 19C6 15 7 13 8.6 13.2L9 9.4 11.4 12.2 12.8 7.6 14.6 11.8 17.2 8.4 17.6 12.8C19.6 12.4 21 15 19.8 19Z'
};
const pennant = f => 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 30">
<filter id="r" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".18 .5" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="2.2"/></filter>
<filter id="s" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".05 .7" numOctaves="2" seed="9"/><feColorMatrix values="0 0 0 0 .07 0 0 0 0 .05 0 0 0 0 .04 2.8 0 0 0 -1.3"/><feComposite in2="SourceGraphic" operator="in"/></filter>
<g filter="url(#r)"><path id="p" d="M2.5 2.5C12 5 22 8 30 10.2L35.5 11.4 33 13.2 38 14.6 31.5 16.6C22 19.5 12 23 2.5 26.5Z" fill="${FCOL[f]}" stroke="#120D0B" stroke-width="2.2" stroke-linejoin="round"/>
<path d="M2.5 2.5C12 5 22 8 30 10.2L35.5 11.4 33 13.2 38 14.6 31.5 16.6C22 19.5 12 23 2.5 26.5Z" filter="url(#s)"/>
<path d="${PENN_SYM[f]}" fill="#F0EDE1" stroke="#120D0B" stroke-width="1.1" stroke-linejoin="round"/></g></svg>`);
const PENNANT = { A: UP.pA || pennant('A'), D: UP.pD || pennant('D'), F: UP.pF || pennant('F') };   // Bild aus ui-quelle/wimpel_fraktionen.png, sonst gezeichnet
const ABIL_SYM = { smoke: 'nebel', tunnel: 'spitzhacke', charge: 'sprengladung', mine: 'tellermine', light: 'scheinwerfer', clear: 'gasmaske', ammo: 'munitionskiste' };
const upEsc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const upRunden = n => `${n} Runde${n > 1 ? 'n' : ''}`;
const upBar = (cls, k, v, max) => `<div class="up-bar ${cls}"><div class="tube"><div class="slot"><i style="width:${Math.round(Math.max(0, Math.min(1, v / max)) * 100)}%"></i></div></div><span class="val"><span class="k">${k}</span>${fmt(v)}<small> / ${fmt(max)}</small></span></div>`;
function upBtn(b, i) {
  const cost = b.cost > 0 ? `<span class="ap">${b.cost}</span>` : '';
  const corner = b.cd > 0 ? `<span class="cdn"><img src="${upSym('sanduhr')}" alt="">${b.cd}</span>` : b.cnt != null ? `<span class="cdn cnt">×${b.cnt}</span>` : '';
  const costTxt = b.costTxt || (b.cost > 0 ? `${b.cost} Aktion${b.cost > 1 ? 'en' : ''}` : 'kostet nichts');
  const tip = `<span class="up-tip" role="tooltip"><b>${b.name}</b><span class="cost">${costTxt}${b.cd > 0 ? ' · wieder bereit in ' + upRunden(b.cd) : ''}</span><span>${b.text}</span>${b.off && b.why ? `<span class="why">${b.why}</span>` : ''}</span>`;
  const cls = 'up-ab' + (b.on ? ' on' : '') + (b.off ? ' off' : '') + (b.pulse && !b.off ? ' pulse' : '') + (b.mirror ? ' mirror' : '');
  return `<div class="up-slot${b.on ? ' on' : ''}"><button class="${cls}" data-act="${b.act}" aria-label="${upEsc(b.name)}, Taste ${i + 1}"${b.off ? ' aria-disabled="true"' : ''}><img src="${upSym(b.sym)}" alt="">${cost}${corner}${tip}</button><span class="up-key">${i + 1}</span></div>`;
}
let upBtns = [];
// Knöpfe der gewählten eigenen Einheit (gleiche Bedingungen wie bisher, nur als Symbole)
function unitButtons(T, hints) {
  const btns = [], tg = [...targets.values()];
  if (T.cls === 'art') {
    const c = T.mobile ? 1 : 2, can = !sel.attacked && sel.ap >= c && !sel.supp && !sel.limbered;
    const why = sel.supp ? 'Niedergehalten: kann nicht feuern.' : sel.limbered ? 'Aufgeprotzt: erst abprotzen.' : sel.attacked ? 'Hat diese Runde schon gehandelt.' : sel.ap < c ? `Braucht ${c} Aktionspunkte.` : '';
    if (E.canLimber(G, sel)) btns.push(sel.limbered
      ? { act: 'limber', sym: 'lafette', name: 'Abprotzen', cost: sel.ap, costTxt: 'alle Aktionen', text: 'In Stellung gehen. Ab der nächsten Runde feuerbereit.' }
      : { act: 'limber', sym: 'pferd', name: 'Aufprotzen', cost: 1, text: `Anspannen: zieht ${P.LIMBER_MV} Felder, feuert aber nicht.` });
    btns.push({ act: 'm-he', sym: 'granate_artillerie', name: 'Sprenggranate', cost: c, text: 'Trifft ein Feld. Zerstört auch Draht.', on: can && artMode === 'he', off: !can, why });
    btns.push({ act: 'm-barrage', sym: 'sperrfeuer', name: 'Sperrfeuer', cost: c, text: T.mobile ? 'Hält das Ziel und zwei Nachbarfelder nieder. Kein Schaden.' : 'Hält Ziel und Nachbarfelder nieder. Kein Schaden.', on: can && artMode === 'barrage', off: !can, why });
    if (sel.gas > 0 || T.gas > 0) btns.push({ act: 'm-gas', sym: 'gas', name: 'Gasgranate', cost: c, cnt: sel.gas, text: 'Wolke treibt 3 Runden mit dem Wind. Trifft auch eigene Truppen.', on: can && artMode === 'gas', off: !can || !(sel.gas > 0), why: sel.gas > 0 ? why : 'Keine Gasgranaten mehr.' });
    hints.push(can ? (shellHexes.size ? 'Zielfeld anklicken.' : 'Kein Ziel: Eine eigene Einheit muss es sehen (5 Felder).') : why);
    if (scoutSet.size) hints.push(`<i>◉ ${scoutSet.size} Felder</i> vom Aufklärer gelenkt: keine Streuung, ×1,25.`);
    return btns;
  }
  const onWire = G.map[sel.c][sel.r].t === 'wire';
  if (E.canCut(G, sel) || (onWire && !sel.attacked)) {
    const no = ['cav', 'art', 'walker'].includes(T.cls) || T.noCut || T.mg;
    btns.push({ act: 'cut', sym: 'drahtschere', name: 'Draht schneiden', cost: E.cutCost(sel), text: 'Entfernt den Stacheldraht auf diesem Feld.', pulse: true, off: !E.canCut(G, sel), why: no ? 'Kann keinen Draht schneiden.' : `Braucht ${E.cutCost(sel)} Aktionspunkte.` });
  }
  if (T.wirelayer && !sel.attacked) btns.push({ act: 'lay', sym: 'drahtrolle', name: 'Draht ziehen', cost: 1, text: 'Stacheldraht auf das Feld legen, in das die Einheit blickt.', pulse: true, off: !E.canLay(G, sel), why: 'Zu einem freien Feld drehen (Drehen-Knöpfe).' });
  const atkWhy = sel.supp > 0 ? 'Niedergehalten: kann nicht schießen oder stürmen.' : sel.attacked ? 'Hat diese Runde schon angegriffen.' : sel.ap < 1 ? 'Keine Aktionspunkte mehr.' : 'Kein Ziel in Reichweite.';
  if (T.rng > 0) {
    const sym = T.lob ? 'handgranate' : T.flame ? 'flamme' : 'zielen', name = T.lob ? 'Granatwurf' : T.flame ? 'Flammenstrahl' : 'Beschuss';
    const why = T.mg && !sel.setup ? 'MG erst aufbauen.' : !sel.supp && !sel.attacked && E.held(G, sel) ? 'Im Nahkampf gebunden: Schießen geht nicht.' : atkWhy;
    btns.push({ act: 'p-fire', sym, name, cost: 1, text: `Ziel auf der Karte anklicken (Messing, Zielsymbol). Reichweite ${T.rng} Felder.`, on: atkPref === 'fire', off: !tg.some(t => t.kind === 'fire' || t.both), why });
  }
  if (T.atk > 0) btns.push({ act: 'p-melee', sym: 'nahkampf', name: 'Nahkampf', cost: Math.max(1, sel.ap), costTxt: 'alle Aktionen', text: 'Gegner auf einem Nachbarfeld anklicken (rot).', on: atkPref === 'melee', off: !tg.some(t => t.kind === 'melee' || t.both), why: atkWhy });
  if (T.abil) { const A = E.ABILS[T.abil], at = E.abilTargets(G, sel);
    btns.push({ act: 'abil', sym: ABIL_SYM[T.abil] || 'blitz', name: A.name, cost: A.ap, cd: sel.cdA, text: T.can, on: abilMode, off: !at.length,
      why: sel.cdA > 0 ? `Wieder in ${upRunden(sel.cdA)}.` : T.abil === 'mine' && !(sel.mines > 0) ? 'Keine Minen mehr.' : sel.ap < A.ap ? `Braucht ${A.ap} Aktionspunkte.` : 'Kein Ziel.' });
    if (abilMode) hints.push('<i>Schraffiert:</i> Zielfeld anklicken.'); }
  if (T.mg && !sel.setup) btns.push({ act: 'setup', sym: 'mg_dreibein', name: 'Aufbauen', cost: 1, text: 'MG in Stellung bringen: erst dann feuert es und gibt Reaktionsfeuer. Ziehen baut es wieder ab.', pulse: E.canSetup(G, sel), off: !E.canSetup(G, sel), why: sel.supp > 0 ? 'Niedergehalten.' : 'Keine Aktionspunkte mehr.' });
  if (T.rng >= 2 && !T.mg && T.cls !== 'walker') btns.push({ act: 'ow', sym: 'auge', name: 'Feuerbereitschaft', cost: 2, text: 'Schießt in der gegnerischen Runde auf den ersten Gegner, der sich in Reichweite bewegt (Schaden ×0,8).', on: !!sel.ow, off: !E.canOverwatch(G, sel), why: sel.ow ? 'Ist schon feuerbereit.' : 'Braucht beide Aktionspunkte, noch nicht gezogen und nicht angegriffen.' });
  if (sel.officer) for (const [k, sym, name, tip] of [['rally', 'fahne', 'Sammeln', 'Eigene Truppen in Reichweite: Moral +15, Niederhalten endet.'], ['storm', 'blitz', 'Sturmbefehl', 'Eigene Truppen in Reichweite: Nahkampf ×1,25 in dieser Runde.']]) {
    const cd = k === 'rally' ? sel.cdR : sel.cdS;
    btns.push({ act: 'o-' + k, sym, name, cost: 1, cd, text: `${tip} Abklingzeit ${E.orderCd(G, sel, k)} Runden.`, off: !E.canOrderKind(G, sel, k), why: cd > 0 ? `Wieder in ${upRunden(cd)}.` : 'Nur ein Befehl je Runde.' });
  }
  if (T.cls === 'medic' && !sel.attacked) btns.push({ act: 'i-heal', sym: 'sanitaeter', name: 'Versorgen', cost: 1, cd: sel.cdH, text: 'Nachbarn mit Sanitätszeichen anklicken: Stärke +25, Moral +15.', off: !healSet.size, why: sel.cdH > 0 ? `Wieder in ${upRunden(sel.cdH)}.` : 'Kein verwundeter Nachbar. Neben eine angeschlagene eigene Einheit ziehen.' });
  if (T.courier && !sel.sent) btns.push({ act: 'i-send', sym: 'meldehund', name: 'Befehl überbringen', cost: 1, text: 'Einheit mit Hundesymbol anklicken: Sie bekommt +1 Aktionspunkt.', off: !sendSet.size, why: 'Keine Einheit in Reichweite.' });
  if (T.recover) btns.push({ act: 'i-rec', sym: 'schraubenschluessel', name: 'Bergen', cost: 1, cd: sel.cdB, text: 'Koloss bzw. Maschine mit Schraubenschlüssel anklicken.', off: !recSet.size, why: sel.cdB > 0 ? `Wieder in ${upRunden(sel.cdB)}.` : 'Kein liegengebliebener Koloss daneben.' });
  if (sel.ap >= 1 && !sel.attacked && !sel.supp && !sel.broken) {
    btns.push({ act: 'tl', sym: 'drehpfeil', name: 'Nach links drehen', text: 'Blickrichtung ändern. Drehen kostet nichts.' });
    btns.push({ act: 'tr', sym: 'drehpfeil', name: 'Nach rechts drehen', mirror: true, text: 'Blickrichtung ändern. Drehen kostet nichts.' });
  }
  if (!spent.has(sel.id)) btns.push({ act: 'pass', sym: 'haken', name: 'Fertig', text: 'Diese Einheit ist für diese Runde fertig.' });
  // Hinweiszeile
  if (sel.supp > 0) hints.push('▼ Niedergehalten: bleibt liegen, kann weder ziehen, schießen noch stürmen.');
  else if (T.rng > 0 && E.held(G, sel)) hints.push('⚔ Im Nahkampf gebunden: Schießen geht nicht.');
  else if (sel.fellBack) hints.push('MG ist zurückgewichen und schießt in dieser Runde nicht mehr.');
  if (T.relay) hints.push('<i>Helle Felder:</i> Hier sieht der Trupp und lenkt eure Artillerie.');
  hints.push(sel.broken ? 'Panne: fällt diese Runde aus.' : sel.ap < 1 ? 'Keine Aktionspunkte mehr.' :
    `${reach.size ? (sel.mvd ? 'Helle Felder: ziehen (2. Zug halb so weit).' : [...reach.values()].some(n => n.retreat) ? 'Rückzug aus der Feindberührung: beide Punkte.' : [...reach.values()].some(n => n.march) ? 'Hell: ziehen (1 ●). Messing: Marsch (2 ●).' : 'Helle Felder: ziehen.') : ''}${sel.attacked ? '' : targets.size ? ' Rot: Nahkampf, Messing: Beschuss.' : ''}`);
  return btns;
}
function updateHud() {
  if (!G) return;
  const hud = $('hud'), u = placing ? null : (sel || (inspect && inspect.unit) || null);
  const hasU = !!(u && E.alive(u));
  const hints = []; let btns = [];
  if (hasU) {
    const T = TYPES[u.type], h = G.map[u.c][u.r];
    $('portrait').hidden = false; drawPortrait($('portrait'), figU(u), u.side);
    const mine = human(G.side) ? G.side : (mode === 'hot' ? G.side : mode);
    $('upMark').innerHTML = crest(u.side);
    $('hudName').textContent = T.name;
    $('hudSub').innerHTML = `<i class="${u.side}">${SIDES[u.side].short}</i>${u.officer ? ` · ${UP.orden ? `<img class="up-orden" src="${UP.orden}" alt="Anführer">` : '★ '}${u.officer}` : ''} · ${h.river && h.t === 'canal' ? 'Fluss' : TERRAIN[h.t].name}${h.ridge ? ' (Höhe)' : ''}`;
    // Zeile mit ALLEN Zuständen als Symbole (Deckung zuerst), Tooltip je Symbol
    { const d = DU.get(u.id), cv = coverTip(u);
      hudTips = [cv && { ...cv, img: UP['cov' + cv.tier], cls: 'cov' }, ...statesOf(u, d).map(st => ({ name: st.name, text: st.text(u, d), img: upSym(st.sym) }))].filter(Boolean);
      $('hudStates').innerHTML = hudTips.map((t, i) => `<span class="up-st${t.cls ? ' ' + t.cls : ''}" data-i="${i}" tabindex="0" aria-label="${upEsc(t.name)}"><img src="${t.img}" alt=""></span>`).join(''); }
    const own = u.side === G.side && E.active(u), ap = Math.max(0, u.ap || 0);
    $('hudStats').innerHTML = upBar('hp', 'Leben', u.str, 10) + upBar('mor' + (u.mor < P.FALLBACK_MOR + 1 ? ' bad' : ''), 'Moral', u.mor, T.mor) +
      `<div class="up-tiles">${own ? `<span class="up-t" title="Aktionspunkte: ${ap} von ${P.AP}"><img src="${upSym('blitz')}" alt="Aktionen">${'<i class="up-pip"></i>'.repeat(Math.min(ap, P.AP))}${'<i class="up-pip used"></i>'.repeat(Math.max(0, P.AP - ap))}</span>` : ''}` +
      `<span class="up-t" title="Bewegung"><img src="${upSym('marsch')}" alt="Bewegung">${u.limbered ? P.LIMBER_MV : T.mv} <small>Felder</small></span>` +
      `<span class="up-t" title="Reichweite"><img class="wide" src="${upSym('gewehr')}" alt="Reichweite">${T.rng ? `${T.rng} <small>Felder</small>` : '–'}</span></div>`;
    $('btnInfo').hidden = false;
    if (previewT && sel) {
      const t = targets.get(previewT.id), p = E.preview(G, sel, previewT, t.kind);
      hints.push(`<b>${t.kind === 'fire' ? 'Beschuss' : 'Nahkampf'} → ${TYPES[previewT.type].name}</b> Schaden ≈ <i>${fmt(p.dmg)}</i>${t.kind === 'fire' ? '' : ` · Gegenschlag ≈ <i>${fmt(p.counter)}</i>`} · ${p.tags.join(' · ') || 'keine Zu- oder Abschläge'} · <em>${lastPT === 'mouse' ? 'Klicken' : 'Nochmal tippen'} zum Angreifen</em>`);
    }
    if (sel && human(sel.side) && sel.side === G.side) btns = unitButtons(T, hints);
    else if (!hints.length) hints.push(T.can);
  } else {
    $('portrait').hidden = true; $('btnInfo').hidden = true; $('hudStats').innerHTML = ''; $('upMark').innerHTML = ''; $('hudStates').innerHTML = ''; hudTips = [];
    if (placing) {
      $('hudName').textContent = 'Nachschub: ' + TYPES[placing].name;
      $('hudSub').innerHTML = 'Aufstellen';
      hints.push('Tippe ein gestricheltes Feld am eigenen Rand an. Die Einheit kann ab der nächsten Runde handeln.');
    } else if (inspect && inspect.hex) {
      const h = G.map[inspect.hex[0]][inspect.hex[1]], T = TERRAIN[h.t], o = OBJECTIVES.find(x => x.c === inspect.hex[0] && x.r === inspect.hex[1]);
      $('hudName').textContent = (h.river && h.t === 'canal' ? 'Fluss' : T.name) + (h.ridge ? ' auf der Höhe' : '');
      $('hudSub').innerHTML = o ? `Zielfeld: ${o.name} · ${o.pts} Punkte` : 'Gelände';
      hints.push(`${h.river && h.t === 'canal' ? 'Nicht passierbar, nur über Brücken und Furten.' : T.info}${h.road ? ' Hier verläuft eine Straße.' : ''}${h.rail ? ' Hier verläuft die Bahnlinie.' : ''}${h.ridge ? ' Höhe: Fernkampf +1 Reichweite.' : ''}${E.cloudAt(G, inspect.hex[0], inspect.hex[1]) ? ' Gaswolke: schadet jeder Einheit, die hier ihren Zug beginnt.' : ''}${T.real ? ' <em>Im echten Krieg: ' + T.real + '</em>' : ''}`);
    } else {
      $('hudName').textContent = G.over ? 'Schlacht beendet' : human(G.side) ? SIDES[G.side].name : 'Die KI ist am Zug';
      $('hudSub').innerHTML = `${E.MAP.name} · Runde ${G.turn} · Siegpunkte ${G.vp.A} : ${G.vp.D}, Ziel ${G.goal}`;
      hints.push(human(G.side) ? 'Tippe eine eigene Einheit an. Tippe auf Gegner oder Gelände für Infos.' : 'Bitte warten …');
    }
  }
  $('hudSub').title = $('hudSub').textContent;
  hud.className = 'upanel' + (hasU ? ' ' + u.side : ' nounit') + (btns.length > 7 ? ' many' : '');
  // Name immer ganz (Wunsch des Nutzers): erst kleiner bis 15 px, reicht das nicht, zweizeilig
  { const el = $('hudName'), rg = document.createRange(), over = () => { rg.selectNodeContents(el); return rg.getBoundingClientRect().width > el.getBoundingClientRect().width + 0.01; };   // genau messen, auch Bruchteile von Pixeln
    el.style.fontSize = ''; el.classList.remove('two');
    for (let fs = 20; fs >= 15 && over(); fs--) el.style.fontSize = fs + 'px';
    if (over()) { el.style.fontSize = ''; el.classList.add('two'); } }
  const hn = $('hudHint'); hn.innerHTML = hints.filter(Boolean).join(' · '); hn.title = hn.textContent;
  // Draht-Knöpfe zuerst (Wunsch des Nutzers), dann die übrigen in fester Reihenfolge
  btns = btns.filter(b => b.pulse && (b.act === 'cut' || b.act === 'lay')).concat(btns.filter(b => !(b.pulse && (b.act === 'cut' || b.act === 'lay'))));
  upBtns = btns;
  $('hudRow').innerHTML = btns.map(upBtn).join('') + (placing ? '<button class="up-text" data-act="cancel">Abbrechen</button>' : '');
  $('hudRow').querySelectorAll('[data-act]').forEach(b => {
    let tm = 0, long = false;
    b.onpointerdown = e => { long = false; if (e.pointerType !== 'mouse') tm = setTimeout(() => { long = true; b.classList.add('show'); }, 420); };
    b.onpointerup = b.onpointercancel = b.onpointerleave = () => { clearTimeout(tm); if (b.classList.contains('show')) setTimeout(() => b.classList.remove('show'), 1600); };
    b.onclick = () => { if (long) { long = false; return; } if (b.classList.contains('off')) return; panelAct(b.dataset.act); };
  });
}
// Tooltips der Zustandssymbole im Panel: Maus beim Drüberfahren, Touch durch Antippen
let hudTips = [];
{ const box = $('hudStates'), at = e => e.target.closest('.up-st'), show = (el, ms) => { const t = hudTips[+el.dataset.i], r = el.getBoundingClientRect(); if (t) showTip([t], r.left + r.width / 2, r.top, 'hud' + el.dataset.i + t.name, ms); };
  box.addEventListener('pointerover', e => { const el = at(e); if (el && e.pointerType === 'mouse') show(el); });
  box.addEventListener('pointerout', e => { if (at(e) && e.pointerType === 'mouse') hideTip(); });
  box.addEventListener('pointerdown', e => { const el = at(e); if (el && e.pointerType !== 'mouse') show(el, 3500); });
  box.addEventListener('focusin', e => { const el = at(e); if (el) show(el); }); box.addEventListener('focusout', hideTip);
  box.addEventListener('contextmenu', e => e.preventDefault()); }
async function panelAct(a) {
  if (a === 'cancel') return cancelPlace();
  if (a.startsWith('i-')) { toast({ 'i-heal': 'Versorgen: Nachbarn mit Sanitätszeichen anklicken.', 'i-send': 'Befehl überbringen: Einheit mit Hundesymbol anklicken.', 'i-rec': 'Bergen: Koloss mit Schraubenschlüssel anklicken.' }[a] || ''); return; }
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
  if (a === 'abil') { abilMode = !abilMode; previewT = null; computeOptions(); updateHud(); return; }
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
  for (const sd of ['A', 'D']) { FIG.PAL[sd].accent = sideCol(sd); document.documentElement.style.setProperty('--' + sd, sideCol(sd)); }   // Ringe, Marken, Balken
  drawFlagPick();
  $('facAName').textContent = ATTACKERS[sk].name;
  drawPortraitLater($('pA1'), 'inf', 'A'); drawPortraitLater($('pA2'), 'walker', 'A'); drawPortraitLater($('pA3'), 'art', 'A');
}
function showStart(first) {
  $('start').hidden = false; setMap(mapSel); drawMapPick(); armyInfo(); drawFlagPick(); $('setSpeed').textContent = 'Tempo ' + speed + '×'; $('setZoom').textContent = 'Zoom ' + String(ZOOM).replace('.', ',') + '×'; $('closeStart').hidden = first;
  drawPortraitLater($('pA1'), 'inf', 'A'); drawPortraitLater($('pA2'), 'walker', 'A'); drawPortraitLater($('pA3'), 'art', 'A');
  drawPortraitLater($('pD1'), 'mg', 'D'); drawPortraitLater($('pD2'), 'storm', 'D'); drawPortraitLater($('pD3'), 'flame', 'D');
}
// ---------- Armee-Auswahl vor der Schlacht ----------
const customArmy = { A: null, D: null };
const mechsOn = () => $('optMechs').checked;
function mechChanged() { if (!mechsOn()) for (const sd of ['A', 'D']) if (customArmy[sd]) { for (const t in customArmy[sd]) if (E.isMech(t)) delete customArmy[sd][t]; if (!E.armyOk(sd, customArmy[sd], false)) customArmy[sd] = null; } armyInfo(); }
const roster = sd => E.ROSTER[sd].filter(t => mechsOn() || !E.isMech(t));
function drawFlagPick() {   // jede Fraktion hat genau ein Wappen (keine Auswahl mehr)
  $('facFlagA').src = UP['f' + fac('A')] || ''; $('facFlagD').src = UP.fD || '';
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
    if (c <= m.zoneA) { g2.fillStyle = 'rgba(201,74,61,0.22)'; g2.fill(); }
  }
  for (const o of m.objectives) { const [x, y] = hp(o.c, o.r); g2.beginPath(); g2.arc(x, y, Math.max(5, s2 * 0.95), 0, 7); g2.fillStyle = '#C2A461'; g2.fill(); g2.lineWidth = 1.5; g2.strokeStyle = '#0a0706'; g2.stroke();
    g2.fillStyle = '#fff'; g2.font = `800 ${Math.max(8, Math.round(s2 * 1.3))}px "Arm Text", system-ui`; g2.textAlign = 'center'; g2.textBaseline = 'middle'; g2.fillText(o.pts, x, y + 0.5); }
}
// Hintergrund hinter dem Startmenü zeigt die gewählte Karte
function bgGame() { G = E.newGame({ seed: 7, map: mapSel }); decals.length = 0; initDU(); layout(); syncAll(); updateUI(); }
function drawMapPick() {
  $('mapPick').innerHTML = Object.values(E.MAPS).map(m => { const tot = m.objectives.reduce((n, o) => n + o.pts, 0);
    return `<label class="mapcard"><input type="radio" name="map" value="${m.id}" ${m.id === mapSel ? 'checked' : ''}><canvas data-map="${m.id}"></canvas><b>${m.name}</b><span class="msize">${m.size} · ${m.cols} × ${m.rows} · Ziel ${m.goal || Math.round(tot * P.GOAL_K)} Siegpunkte</span><small>${m.desc}</small><span class="mwin">⚑ ${m.objectives.length} Ziele, ${tot} Punkte · Sieg ab ${m.winA || P.WIN_A}, Remis ab ${m.drawA || P.DRAW_A}</span></label>`; }).join('');
  requestAnimationFrame(() => document.querySelectorAll('#mapPick canvas').forEach(c => drawMapPreview(c, c.dataset.map)));
  document.querySelectorAll('input[name=map]').forEach(i => i.addEventListener('change', () => { setMap(i.value); customArmy.A = customArmy.D = null; armyInfo(); bgGame(); }));
}

function startGame() {
  mode = document.querySelector('input[name=mode]:checked').value;
  blood = $('optBlood').checked; soundOn = $('optSound').checked; tbSync();
  applySkin((document.querySelector('input[name=skin]:checked') || {}).value || 'A');
  $('start').hidden = true; $('end').hidden = true;
  setMap(mapSel);
  G = E.newGame({ map: mapSel, mechs: mechsOn(), army: { A: human('A') ? customArmy.A : null, D: human('D') ? customArmy.D : null } });
  decals.length = particles.length = floaters.length = tracers.length = shells.length = booms.length = flames.length = rings.length = muzzles.length = 0;
  initDU(); layout(); syncAll();
  E.startTurn(G);
  sel = null; inspect = null; placing = null; spawnSet = new Set(); updateUI();
  banner(E.MAP.name, `Zielfelder besetzen und halten · wer zuerst ${G.goal} Siegpunkte hat, gewinnt`); playSound('march', 0.45); playSound('whistle', 0.5); setAmbient(soundOn);
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
  const why = r.why === 'break' ? (win === 'A' ? 'Die Aschenwacht ist zusammengebrochen.' : 'Das Konkordat ist zusammengebrochen.')
    : r.why === 'time' ? `Nach ${P.MAX_ROUNDS} Runden steht es ${G.vp.A} : ${G.vp.D} Siegpunkte.`
    : `${SIDES[win].short} hat zuerst ${G.goal} Siegpunkte erreicht. Endstand ${G.vp.A} : ${G.vp.D}.`;
  let stars = 0;
  if (me) { if (win === me) stars = 2 + (E.losses(G, me) < 0.3 ? 1 : 0); else if (!win) stars = 1; }
  $('endTitle').textContent = title; $('endWhy').textContent = why;
  $('endStars').textContent = me ? '★'.repeat(stars) + '☆'.repeat(3 - stars) : '';
  $('endStats').innerHTML = `<div><dt>Ausfälle ${SIDES.A.short}</dt><dd>${Math.round(E.losses(G, 'A') * 100)} %</dd></div><div><dt>Ausfälle Aschenwacht</dt><dd>${Math.round(E.losses(G, 'D') * 100)} %</dd></div>` +
    OBJECTIVES.map(o => `<div class="${G.ctrl[o.id] || 'N'}"><dt>${o.name}</dt><dd>${G.ctrl[o.id] ? SIDES[G.ctrl[o.id]].short : 'neutral'}</dd></div>`).join('');
  $('end').hidden = false;
  setAmbient(false);
  if (win && (!me || win === me)) playSound('win', 0.6);
}

// ---------- Knöpfe ----------
$('btnEnd').onclick = endTurn;
$('btnMarks').onclick = () => { marksOn = !marksOn; tbSync(); };
// „Nächste Einheit“ (Tab, Umschalt+Tab rückwärts): nächste eigene Einheit, die noch handeln kann, wählen und die Karte hinschieben.
// Sind alle fertig, leuchtet „Runde beenden“ kurz auf.
function nextUnit(back) {
  if (!G || busy || G.over || !human(G.side) || placing) return;
  refreshSpent();
  const list = G.units.filter(u => u.side === G.side && E.active(u) && !spent.has(u.id)).sort((a, b) => a.c - b.c || a.r - b.r);
  if (!list.length) { const be = $('btnEnd'); be.classList.remove('flash'); void be.offsetWidth; be.classList.add('flash'); setTimeout(() => be.classList.remove('flash'), 1900); return; }
  const i = sel ? list.findIndex(u => u.id === sel.id) : -1;
  const u = list[((i < 0 ? (back ? 0 : -1) : i) + (back ? -1 : 1) + list.length) % list.length];
  select(u);
  const [x, y] = center(u.c, u.r), rc = cv.getBoundingClientRect(), bc = board.getBoundingClientRect();
  board.scrollBy({ left: rc.left + x * rc.width / cv.width - (bc.left + bc.width / 2), top: rc.top + y * rc.height / cv.height - (bc.top + bc.height / 2), behavior: 'smooth' });
}
$('btnNext').onclick = e => { if ($('btnNext').dataset.long) { delete $('btnNext').dataset.long; return; } nextUnit(false); };
// Tooltip am Knopf: Maus beim Drüberfahren, Touch durch langes Drücken (dann kein Klick)
{ const b = $('btnNext'), tip = [{ name: 'Nächste Einheit', text: 'Wählt die nächste eigene Einheit, die noch Aktionspunkte hat, und schiebt die Karte hin. Taste Tab (Umschalt+Tab rückwärts).' }];
  let tm = 0; const at = () => { const r = b.getBoundingClientRect(); return [r.left + r.width / 2, r.top]; };
  b.addEventListener('pointerover', e => { if (e.pointerType === 'mouse') showTip(tip, ...at(), 'next'); });
  b.addEventListener('pointerout', e => { if (e.pointerType === 'mouse') hideTip(); });
  b.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse') return; tm = setTimeout(() => { b.dataset.long = '1'; showTip(tip, ...at(), 'next', 3500); }, 420); });
  b.addEventListener('pointerup', () => clearTimeout(tm)); b.addEventListener('pointercancel', () => clearTimeout(tm));
  b.addEventListener('contextmenu', e => e.preventDefault()); }
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
$('setZoom').onclick = () => { ZOOM = ZOOM === 1 ? 1.3 : ZOOM === 1.3 ? 1.6 : 1; const t = String(ZOOM).replace('.', ',') + '×'; tbSync(); $('setZoom').textContent = 'Zoom ' + t; if (G) { layout(); syncAll(); } };
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
  tbSync();
  layout(); syncAll();
  board.scrollLeft = fx * board.scrollWidth - board.clientWidth / 2; board.scrollTop = fy * board.scrollHeight - board.clientHeight / 2;
};
$('btnSound').onclick = () => { soundOn = !soundOn; $('optSound').checked = soundOn; tbSync(); setAmbient(soundOn && !!G && !G.over); if (soundOn) playSound('whistle', 0.4); };
document.querySelectorAll('input[name=skin]').forEach(r => r.onchange = () => { applySkin(r.value); if (G) { updateUI(); } });
$('btnShop').onclick = openShop;
$('closeShop').onclick = () => { $('shop').hidden = true; };
$('closeDetail').onclick = () => { $('detail').hidden = true; };
$('btnSpeed').onclick = () => { speed = speed === 1 ? 2 : speed === 2 ? 3 : 1; tbSync(); };
tbSync();
$('btnFull').onclick = () => { const d = document, el = d.documentElement; if (!d.fullscreenElement) (el.requestFullscreen || el.webkitRequestFullscreen || (() => {})).call(el); else d.exitFullscreen(); };
let rT = 0;
document.addEventListener('keyup', e => { if (e.key === 'Alt') { altHeld = false; e.preventDefault(); } });   // preventDefault: Alt öffnet sonst das Browsermenü
window.addEventListener('blur', () => { altHeld = false; });
window.addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(() => { if (G) { layout(); updateHud(); } }, 120); });
const gameKeys = e => G && $('start').hidden && $('shop').hidden && $('detail').hidden && $('rules').hidden && $('army').hidden && !(e.target.closest && e.target.closest('input'));
document.addEventListener('keydown', e => {
  if (e.key === 'Alt') { if (gameKeys(e)) e.preventDefault(); altHeld = true; return; }
  if (e.key === 'Tab' && gameKeys(e) && !e.ctrlKey && !e.altKey) { e.preventDefault(); nextUnit(e.shiftKey); return; }
  const pan = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
  if (pan && $('start').hidden && !e.target.closest('input')) { board.scrollBy({ left: pan[0] * 160, top: pan[1] * 120, behavior: 'smooth' }); e.preventDefault(); }
  // Tasten 1–n: Fähigkeiten-Knöpfe des Panels
  if (/^[1-9]$/.test(e.key) && G && $('start').hidden && $('shop').hidden && $('detail').hidden && $('rules').hidden && $('army').hidden && !(e.target.closest && e.target.closest('input')) && !e.ctrlKey && !e.altKey && !e.metaKey) {
    const b = $('hudRow').querySelectorAll('.up-ab')[+e.key - 1]; if (b && !b.classList.contains('off')) { b.click(); e.preventDefault(); } }
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
  sync: () => syncAll(), get vis() { return { clouds: VIS.clouds.length, supp: [...DU.values()].filter(d => d.vs && d.vs.supp).length, shells: shells.length }; }, play: async evs => { for (const e of evs) await playEvent(e); }, get pji() { return Object.keys(PJI); }, get mz() { return muzzles.map(m => m.img + ':' + Math.round(m.life)); }, get fx() { return { sh: shells.length, tr: tracers.length, bo: booms.length, fl: floaters.length }; }, get scoutN() { return scoutSet.size; }, get sightN() { return sightSet.size; }, get spentN() { return spent.size; },
  select: id => select(G.units.find(u => u.id === id)), get sel() { return sel; },
  get marks() { const rc = cv.getBoundingClientRect(); return MARKS.map(m => ({ id: m.u.id, kind: m.kind, x: rc.left + (m.x0 + m.x1) / 2 * rc.width / cv.width, y: rc.top + (m.y0 + m.y1) / 2 * rc.height / cv.height })); },
  ctrl: (i, sd) => { const o = OBJECTIVES[i]; G.ctrl[o.id] = VIS.ctrl[o.id] = sd; updateUI(); }   // Test: Zielfeld i an Seite sd
};
})();
