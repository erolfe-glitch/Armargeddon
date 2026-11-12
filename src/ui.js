// ===== ARMARGEDDON OBERFLÄCHE =====
(function () {
'use strict';
const { COLS, ROWS, TYPES, TERRAIN, OBJECTIVES, SIDES, P } = E;
const figOf = T => T.fig || T.cls;
const figU = u => u.limbered ? 'limber' : figOf(TYPES[u.type]);
const SQ3 = Math.sqrt(3);
const $ = id => document.getElementById(id);
const fmt = (x, d = 1) => x.toFixed(d).replace('.', ',');
const WIND_DEG = [-30, 30, 90, 150, 210, 270];

// ---------- Zustand ----------
let G = null, mode = 'A', blood = true, speed = 1, busy = false;
let sel = null, reach = new Map(), targets = new Map(), shellHexes = new Set(), artMode = 'he';
let previewT = null, hoverHex = null, inspect = null, lastPT = 'mouse', placing = null, spawnSet = new Set(), rangeSet = new Set(), hoverU = null, atkPref = 'auto', healSet = new Set();
const DU = new Map();
const particles = [], floaters = [], decals = [], tracers = [], shells = [], booms = [], flames = [], rings = [];
let skinA = 'A';
const LEADER = { 'Prätor Hask': 2, 'Hauptfrau Morn': 1, 'Hauptmann Veyl': 1, 'Kastellan Orsk': 2, 'Sturmführer Kael': 3 };
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
  const cssW = Math.max(wrap.width, portrait ? 760 : 560) * ZOOM;
  const s = cssW * dpr / (1.5 * COLS + 0.5);
  const top = s * 1.55, bot = s * 0.45;
  K = Math.max(0.42, Math.min(0.86, (wrap.height * ZOOM * dpr - top - bot) / (s * SQ3 * (ROWS + 0.5))));
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
  forest: ['#42452f', '#3d402b', '#474a32'], canal: ['#34474f', '#30424a', '#384c54'], bridge: ['#34474f', '#30424a', '#384c54'] };
const O = '#16150f';
function renderTerrain() {
  const { s, W, H, dpr } = L;
  tcv = tcv || document.createElement('canvas'); tcv.width = W; tcv.height = H;
  const g = tcv.getContext('2d');
  g.fillStyle = '#1c1d17'; g.fillRect(0, 0, W, H);
  const sky = g.createLinearGradient(0, 0, 0, L.top * 1.2);
  sky.addColorStop(0, 'rgba(120,22,12,0.78)'); sky.addColorStop(0.55, 'rgba(110,30,14,0.38)'); sky.addColorStop(1, 'rgba(110,30,14,0)');
  g.fillStyle = sky; g.fillRect(0, 0, W, L.top * 1.2);
  g.lineJoin = 'round'; g.lineCap = 'round';
  const lw = Math.max(1.5, s * 0.045);
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) {
    const h = G.map[c][r], n = hash(c * 3.1, r * 7.7);
    const tk = h.t === 'village' ? (hash(c * 1.7, r * 9.1) < 0.5 && TIMG.debris ? 'debris' : 'village') : h.t, tim = TIMG[tk];
    hexPath(g, c, r, 1.02);
    if (tim) {
      const [hx, hy] = center(c, r), hw = s * 2.06, hh = s * K * SQ3 * 1.04, fl = tk !== 'trench' && n > 0.5;
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
    if (TIMG[h.t]) continue;   // gemalte Kachel: keine gezeichneten Zutaten
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
  flame: [[0.2, 0.4], [-0.22, 0.2]], cav: [[0, 0.4]], mg: [[0, 0.38]], art: [[0, 0.38]], walker: [[0, 0.4]] };
const FH = { limber: 0.58, medic: 0.62, mortar: 0.66, inf: 0.62, storm: 0.62, flame: 0.62, mg: 0.68, art: 0.74, walker: 0.86, cav: 0.57 };
const MAXW = 1.6, MAXWK = { walker: 2.05, limber: 1.95, art: 1.8, cav: 1.7 };   // größte Bildbreite in Feldradien

function drawUnit(u, d) {
  const T = TYPES[u.type], k = figU(u), s = L.s, flip = facesLeft(d.face) ? 1 : 0, acc = FIG.PAL[u.side].accent;
  let x = d.x, y = d.y;
  if (d.lunge) { x += d.lunge.dx; y += d.lunge.dy; }
  if (d.shake > 0) x += Math.sin(now / 22) * s * 0.05;
  const g = ctx;
  g.globalAlpha = d.alpha * (u.status === 'rout' ? 0.75 : 1);
  const isSel = sel && sel.id === u.id;
  const done = human(u.side) && G.side === u.side && u.moved && u.attacked && E.active(u) && !busy;
  // Standring mit Blickrichtung
  g.beginPath(); g.ellipse(x, y, s * 0.7, s * 0.7 * K, 0, 0, 7);
  g.fillStyle = acc; g.globalAlpha *= done ? 0.12 : 0.28; g.fill();
  g.globalAlpha = d.alpha * (done ? 0.45 : 1);
  g.lineWidth = Math.max(2, s * (isSel ? 0.09 : 0.06)); g.strokeStyle = isSel ? '#fff7dd' : acc;
  if (u.status === 'rout') g.setLineDash([s * 0.14, s * 0.12]);
  g.stroke(); g.setLineDash([]);
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
    const cm = !u.moved && !u.supp && !u.broken, ca = !u.attacked && !u.broken, pr = Math.max(4, s * 0.15), py = by + bh;
    g.lineWidth = Math.max(1.5, s * 0.04); g.strokeStyle = O;
    g.beginPath(); g.moveTo(bx - pr * 2.3, py - pr); g.lineTo(bx - pr * 0.5, py); g.lineTo(bx - pr * 2.3, py + pr); g.closePath(); g.fillStyle = cm ? '#7fe36a' : '#2f2e25'; g.fill(); g.stroke();
    const rx0 = bx + w + pr * 1.4; g.beginPath(); g.moveTo(rx0, py - pr * 1.1); g.lineTo(rx0 + pr * 1.1, py); g.lineTo(rx0, py + pr * 1.1); g.lineTo(rx0 - pr * 1.1, py); g.closePath(); g.fillStyle = ca ? '#ff5a3c' : '#2f2e25'; g.fill(); g.stroke();
  }
  // Zustandsmarken
  const tagY = y - s * (k === 'walker' ? 0.95 : k === 'cav' ? 1.05 : 0.85);
  const tag = (text, bg, fg) => {
    g.font = `800 ${Math.round(s * 0.26)}px Georgia, 'Palatino Linotype', serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
    const tw = g.measureText(text).width + s * 0.2;
    const th = s * 0.38, lx = x - tw / 2, ty = tagY - th / 2, n = s * 0.035;
    g.save(); g.translate(x, tagY); g.rotate(-0.035); g.translate(-x, -tagY);
    g.beginPath(); g.moveTo(lx - n, ty); g.lineTo(lx + tw * 0.3, ty - n); g.lineTo(lx + tw * 0.7, ty + n * 0.5); g.lineTo(lx + tw + n, ty - n * 0.5); g.lineTo(lx + tw, ty + th * 0.55); g.lineTo(lx + tw + n, ty + th);
    g.lineTo(lx + tw * 0.6, ty + th + n); g.lineTo(lx + tw * 0.25, ty + th - n * 0.5); g.lineTo(lx - n, ty + th + n * 0.5); g.lineTo(lx, ty + th * 0.45); g.closePath();
    g.fillStyle = bg; g.fill(); g.strokeStyle = '#1d140d'; g.lineWidth = Math.max(1.5, s * 0.045); g.lineJoin = 'round'; g.stroke();
    g.fillStyle = fg; g.fillText(text, x, tagY + 1); g.restore();
  };
  if (u.status === 'rout') tag('FLIEHT', '#e6dcc0', '#7a1c10');
  else if (u.broken > 0) tag('PANNE', '#b9b09a', '#1d140d');
  else if (u.limbered) tag('AUFGEPROTZT', '#d9c698', '#1d140d');
  else if (u.supp > 0) tag('▼ NIEDER', '#dcc070', '#5a1408');
  else if (u.gassed) tag('GAS', '#b9c24a', '#1d2408');
}

// ---------- Zeichnen ----------
function frame(t) { now = t; draw(); requestAnimationFrame(frame); }
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
    for (const [, n] of reach) { hexPath(g, n.c, n.r, 0.9); g.fillStyle = 'rgba(255,244,190,0.3)'; g.fill(); g.strokeStyle = 'rgba(255,246,205,0.75)'; g.lineWidth = Math.max(1.5, s * 0.04); g.stroke(); }
    for (const k of rangeSet) { if (shellHexes.has(k)) continue; hexPath(g, Math.floor(k / 100), k % 100, 0.96); g.fillStyle = 'rgba(220,40,30,0.10)'; g.fill(); g.strokeStyle = 'rgba(230,60,45,0.28)'; g.lineWidth = Math.max(1, s * 0.025); g.stroke(); }
    for (const k of shellHexes) {
      const c = Math.floor(k / 100), r = k % 100;
      hexPath(g, c, r, 0.92); g.fillStyle = `rgba(235,40,30,${0.36 + 0.1 * Math.sin(now / 260)})`; g.fill(); g.strokeStyle = '#ff5a40'; g.lineWidth = Math.max(2, s * 0.06); g.stroke();
    }
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
    g.beginPath(); g.rect(px, top, s * 0.5, s * 0.34); g.fillStyle = col; g.fill(); g.lineWidth = Math.max(1.5, s * 0.05); g.stroke();
    g.fillStyle = '#16150f'; g.font = `800 ${Math.round(s * 0.28)}px system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(o.pts, px + s * 0.25, top + s * 0.18);
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
    const tr = tracers[i]; tr.life--;
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
    const f = flames[i]; f.life--;
    if (f.life <= 0) { flames.splice(i, 1); continue; }
    const k = Math.min(1, (f.max - f.life) / 6), im = FXI[f.life % 8 < 4 ? 'flame1' : 'flame2'];
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
    const sh = shells[i]; sh.t += 1 / sh.dur;
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
  for (let i = rings.length - 1; i >= 0; i--) {
    const rg = rings[i]; rg.life--; if (rg.life <= 0) { rings.splice(i, 1); continue; }
    const k = 1 - rg.life / rg.max, im = PJI[rg.img];
    if (im) { const hh = s * rg.r * (0.7 + 0.5 * k), w = fxw(im, hh); g.globalAlpha = Math.min(1, rg.life / (rg.max * 0.4)); g.drawImage(im, rg.x - w / 2, rg.y - hh / 2 - k * s * 0.5, w, hh); g.globalAlpha = 1; }
    else { g.beginPath(); g.ellipse(rg.x, rg.y, s * rg.r * k, s * rg.r * k * K, 0, 0, 7); g.strokeStyle = rg.col; g.globalAlpha = 1 - k; g.lineWidth = Math.max(2, s * 0.09); g.stroke(); g.globalAlpha = 1; }
  }
  for (let i = booms.length - 1; i >= 0; i--) {
    const b = booms[i]; if (b.delay > 0) { b.delay--; continue; } b.life--;
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
    const p = particles[i]; p.x += p.vx; p.y += p.vy; p.vy += p.g; p.life--;
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
    const f = floaters[i]; f.life--; f.y -= s * 0.012;
    if (f.life <= 0) { floaters.splice(i, 1); continue; }
    g.globalAlpha = Math.min(1, f.life / 18);
    g.font = `900 ${Math.round(s * (f.big ? 0.5 : 0.42))}px system-ui, sans-serif`;
    g.lineWidth = Math.max(3, s * 0.12); g.strokeStyle = O; g.lineJoin = 'round'; g.strokeText(f.text, f.x, f.y);
    g.fillStyle = f.col; g.fillText(f.text, f.x, f.y);
  }
  g.globalAlpha = 1;
}

// ---------- Ton ----------
let soundOn = true;
const lastSnd = {}, SND_GAP = { rifle: 70, mg: 250, cannon: 150, flame: 500, boom: 250, boom2: 400, barrage: 800, gas: 800, tank: 1500, glitch: 500, gallop: 1400, gallop2: 1400, neigh: 2500, march: 2000, win: 3000, launch: 200, grenade: 300, cry: 1200, steps: 1100, tramp: 1100, cut: 300, clank: 300, heal: 900, panic: 3000, whistle: 1500 };
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
function floater(x, y, text, col, big) { floaters.push({ x, y, text, col, life: 60 / speed + 22, big }); }
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
    const steps = Math.max(3, Math.round(msPer / 16 / speed));
    for (let k = 1; k <= steps; k++) { d.x = x0 + (x1 - x0) * k / steps; d.y = y0 + (y1 - y0) * k / steps; await raf(); }
  }
}
const unitById = id => G.units.find(u => u.id === id);
const nm = u => `${TYPES[u.type].name} (${SIDES[u.side].short})`;

async function playEvent(e) {
  const u = e.u != null ? unitById(e.u) : null, s = L.s;
  switch (e.t) {
    case 'move': { const k0 = TYPES[u.type].cls; if (k0 === 'cav') playSound('gallop2', 0.55); else if (u.limbered) playSound('gallop', 0.5); else if (k0 === 'walker') playSound('tank', 0.5); else playSound(e.path.some(h => G.map[h[0]][h[1]].t === 'mud') ? 'steps' : 'tramp', 0.5); } await animPath(e.u, e.path, TYPES[u.type].cls === 'cav' ? 110 : 170); break;
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
        const mg = e.kind === 'mg', can = e.kind === 'cannon';
        playSound(e.kind === 'rifle' ? 'rifle' : mg ? 'mg' : 'cannon', mg ? 0.55 : 0.6);
        tracers.push({ x1: x1 + (x2 > x1 ? 1 : -1) * s * 0.5, y1, x2, y2, life: mg ? 26 : 15, max: mg ? 26 : 15, n: mg ? 5 : 1, col: can ? '#ff9a3a' : '#ffe27a', img: mg ? 'burst' : can ? 'shard' : 'bullet', sz: mg ? 0.5 : can ? 0.34 : 0.2 });
        await wait(mg ? 380 : 250);
        if (can) { boom(x2, y2 + s * 0.4, s * 0.5, 'he'); playSound('boom', 0.45); }
      }
      break;
    }
    case 'shell': {
      const a = DU.get(e.a), [x1, y1] = bodyPos(e.a), [x2, y2] = center(e.c, e.r);
      a.face = e.face; playSound('launch', 0.6);
      boom(x1 + (x2 > x1 ? 1 : -1) * s * 0.7, y1, s * 0.35, 'he');
      const dur = Math.max(12, Math.round(30 / speed));
      shells.push({ x1, y1, x2, y2, t: 0, dur, col: e.mode === 'gas' ? '#c4d646' : '#2a2a26', img: TYPES[unitById(e.a).type].mobile ? 'shellB' : 'shellA', sz: 0.4 });
      await wait(dur * 16.7 * speed);
      if (e.scatter) floater(x2, y2 - s, 'Streuung!', '#f0d27a');
      playSound(e.mode === 'gas' ? 'gas' : e.mode === 'barrage' ? 'barrage' : 'boom', 0.7);
      if (e.mode === 'he') { boom(x2, y2, s * 0.95, 'he'); burst(x2, y2, 16, ['#5a4632', '#3d3024', '#8a7a52'], { up: 0.3, spread: 0.3 }); }
      else if (e.mode === 'gas') boom(x2, y2, s * 1.0, 'gas');
      else { boom(x2, y2, s * 0.7, 'he'); E.neighbors(e.c, e.r).forEach(([c, r], i) => { const [bx, by] = center(c, r); boom(bx, by, s * 0.6, i % 2 ? 'dust' : 'he', 3 + i * 3); }); }
      await wait(e.mode === 'barrage' ? 420 : 260); break;
    }
    case 'melee': case 'counter': {
      const a = DU.get(e.a), d = DU.get(e.d);
      if (e.face != null) a.face = e.face; else a.face = d.x >= a.x ? 0 : 3;
      { const au = unitById(e.a); if (e.t === 'melee') playSound(au && TYPES[au.type].cls === 'storm' ? 'grenade' : 'cry', 0.5); }
      { const au = unitById(e.a), kc = au && TYPES[au.type].cls; if (e.t === 'melee' && (kc === 'inf' || kc === 'storm')) shells.push({ x1: a.x, y1: a.y - s * 0.5, x2: d.x, y2: d.y - s * 0.2, t: 0, dur: 16, arc: 0.9, spin: true, img: au.side === 'A' ? 'pine' : 'stick', sz: 0.3 }); }
      a.lunge = { dx: (d.x - a.x) * 0.38, dy: (d.y - a.y) * 0.38 }; await wait(140);
      const mx = (a.x + d.x) / 2 + (d.x - a.x) * 0.2, my = (a.y + d.y) / 2 - s * 0.5;
      boom(mx, my + s * 0.25, s * 0.38, 'dust'); burst(mx, my, 8, ['#fff1c0', '#d9d2bd'], { spread: 0.2 });
      await wait(170); a.lunge = null; await wait(70); break;
    }
    case 'hit': {
      const d = DU.get(e.u), [x, y] = bodyPos(e.u);
      d.str = e.str; d.mor = e.morv; d.shake = 1; setTimeout(() => d.shake = 0, 260 / speed);
      if (!e.panic) {
        if (TYPES[u.type].cls === 'cav' || u.limbered) playSound('neigh', 0.5);
        burst(x, y + s * 0.3, 8, ['#5a4632', '#3d3024', '#7a6448'], { up: 0.16 });
        if (blood && TYPES[u.type].cls !== 'walker') { const nb = Math.min(5, 1 + Math.round(e.dmg * 2)); burst(x, y, 6 + nb * 3, ['#9a1612', '#74100c', '#b3221a'], { up: 0.16, spread: 0.2 });
          boom(x, y + s * 0.5, s * 0.34, 'blood');
          for (let q = 0; q < nb; q++) decals.push({ v: 1 + Math.floor(Math.random() * 4), x: d.x + (Math.random() - 0.5) * s * 1.1, y: d.y + (Math.random() - 0.3) * s * 0.7 * K, r: s * (0.06 + Math.random() * 0.13), col: Math.random() < 0.5 ? 'rgba(110,16,12,0.62)' : 'rgba(78,10,8,0.6)' });
          while (decals.length > 700) decals.shift(); }
        floater(...headPos(e.u), '−' + fmt(e.dmg), '#ff9a7a', e.dmg >= 1.5);
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
    case 'stuck': playSound('steps', 0.7); floater(...headPos(e.u), 'steckt im Schlamm', '#d9c9a0'); await wait(250); break;
    case 'breakdown': playSound('glitch', 0.6); floater(...headPos(e.u), 'Panne!', '#ffb04a', true); toast('Ein Landkoloss bleibt mit einer Panne liegen.'); await wait(350); break;
    case 'repaired': floater(...headPos(e.u), 'wieder flott', '#b8ff7c'); await wait(200); break;
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
    if (Math.abs(x - d.x) < L.s * 0.42 && y < d.y + L.s * K * 0.5 && y > d.y - L.s * 0.62) if (!uFig || d.y > DU.get(uFig.id).y) uFig = u;
  }
  return { h, uHex, uFig };
}
function unitAtPixel(x, y) { const p = pick(x, y); return p.uFig || p.uHex; }
const targetOf = p => p.uHex && targets.has(p.uHex.id) ? p.uHex : p.uFig && targets.has(p.uFig.id) ? p.uFig : null;
cv.addEventListener('pointerdown', ev => { lastPT = ev.pointerType || 'touch'; });
cv.addEventListener('pointermove', ev => {
  if (!G || ev.pointerType !== 'mouse') return;
  const [x, y] = evToPx(ev), p = pick(x, y);
  hoverHex = p.h;
  const movable = sel && !busy && p.h && reach.has(E.key(p.h[0], p.h[1]));
  hoverU = movable ? null : (p.uFig || p.uHex);
  if (sel && !busy) { const np = targetOf(p); if (np !== previewT) { previewT = np; updateHud(); } }
});
cv.addEventListener('pointerleave', () => { hoverHex = null; hoverU = null; });
cv.addEventListener('click', ev => {
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
  reach = new Map(); targets = new Map(); shellHexes = new Set(); rangeSet = new Set(); healSet = new Set();
  if (!sel || !E.active(sel) || sel.side !== G.side) return;
  reach = E.reachable(G, sel);
  if (TYPES[sel.type].cls === 'medic') for (const o of G.units) if (E.canHeal(G, sel, o)) healSet.add(o.id);
  { const T0 = TYPES[sel.type], can = T0.cls === 'art' ? (!sel.limbered && !sel.attacked && (!sel.moved || T0.mobile) && !sel.supp) : (T0.rng > 1 && !sel.attacked && !(T0.mg && sel.moved));
    if (can) for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) { const d = E.dist(sel.c, sel.r, c, r); if (d >= 1 && d <= (T0.cls === 'art' ? T0.rng : E.rangeOf(G, sel, c, r))) rangeSet.add(E.key(c, r)); } }
  if (TYPES[sel.type].cls === 'art') {
    const foe = (c, r) => { const x = E.unitAt(G, c, r); return x && x.side !== sel.side; };
    for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) {
      if (!E.canShell(G, sel, c, r, artMode)) continue;
      const ok = artMode === 'he' ? (foe(c, r) || G.map[c][r].t === 'wire')
        : artMode === 'barrage' ? [[c, r], ...E.neighbors(c, r)].some(h => foe(h[0], h[1]))
        : E.gasCells(G, c, r).some(h => foe(h[0], h[1]));
      if (ok) shellHexes.add(E.key(c, r));
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
  previewT = null; reach = new Map(); targets = new Map(); shellHexes = new Set(); rangeSet = new Set(); healSet = new Set(); updateHud();
  await play(fn(u));
  busy = false;
  sel = (u && E.active(u) && (!u.moved || !u.attacked)) ? u : null;
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
  $('shopList').innerHTML = E.SHOP[sd].map(t => { const T = TYPES[t], ok = E.canBuy(G, sd, t) && E.spawnHexes(G, sd, t).length;
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
function toast(text) { const el = $('toast'); el.textContent = text; el.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('on'), 2600); }
function banner(title, sub) {
  const el = $('banner'); el.innerHTML = `<b>${title}</b><span>${sub || ''}</span>`;
  el.classList.remove('on'); void el.offsetWidth; el.classList.add('on');
}
function updateTop() {
  $('turn').textContent = `Runde ${G.turn}/${P.MAXT}`;
  const ch = $('sidechip'); ch.className = 'chip ' + G.side; ch.textContent = SIDES[G.side].short + (human(G.side) ? '' : ' · KI');
  $('windArrow').style.transform = `rotate(${WIND_DEG[G.wind]}deg)`;
  for (const sd of ['A', 'D']) {
    const v = 1 - E.losses(G, sd), el = $('meter' + sd);
    el.querySelector('i').style.width = Math.max(0, v * 100) + '%';
    el.querySelector('b').style.left = (1 - P.BREAK[sd]) * 100 + '%';
    el.querySelector('span').textContent = `${SIDES[sd].short} ${Math.round(v * 100)} %`;
  }
  $('objs').innerHTML = OBJECTIVES.map(o => `<span class="obj ${G.ctrl[o.id]}" title="${o.name}">⚑ ${o.pts}</span>`).join('') + `<span class="pts">${E.points(G)}/${P.WIN_A}</span>`;
}
function updateUI() {
  if (!G) return;
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
function updateHud() {
  if (!G) return;
  const hud = $('hud'), u = placing ? null : (sel || (inspect && inspect.unit) || null);
  hud.className = 'hud' + (u ? ' ' + u.side : '');
  if (u && E.alive(u)) {
    const T = TYPES[u.type], h = G.map[u.c][u.r];
    $('portrait').hidden = false; drawPortrait($('portrait'), figU(u), u.side);
    $('hudName').textContent = T.name;
    const st = u.status === 'rout' ? 'flieht' : u.broken > 0 ? 'Panne' : u.supp > 0 ? 'niedergehalten' : u.gassed ? 'im Gas' : null;
    $('hudSub').innerHTML = `${SIDES[u.side].short}${u.officer ? ' · ★ ' + u.officer : ''} · ${TERRAIN[h.t].name}${h.ridge ? ' (Höhe)' : ''}${st ? ` · <em>${st}</em>` : ''}`;
    $('hudStats').innerHTML = pill('Stärke', fmt(u.str), u.str <= 3.3 ? 'bad' : '') + pill('Moral', fmt(u.mor), u.mor < P.FALLBACK_MOR + 1 ? 'bad' : 'gold') +
      pill('Angriff', T.atk || '–') + pill('Abwehr', T.def) + pill('Zug', u.limbered ? P.LIMBER_MV : T.mv) + pill('Schuss', T.rng ? `${T.rng}·${T.fs}` : '–');
    $('btnInfo').hidden = false;
    let row = '';
    if (previewT && sel) {
      const t = targets.get(previewT.id), p = E.preview(G, sel, previewT, t.kind);
      row = `<div class="prev"><b>${t.kind === 'fire' ? 'Beschuss' : 'Nahkampf'} → ${TYPES[previewT.type].name}</b><span>Schaden ≈ <i>${fmt(p.dmg)}</i></span>${t.kind === 'fire' ? '' : `<span>Gegenschlag ≈ <i>${fmt(p.counter)}</i></span>`}<span class="tags">${p.tags.join(' · ') || 'keine Zu- oder Abschläge'}</span><em>${lastPT === 'mouse' ? 'Klicken' : 'Nochmal tippen'} zum Angreifen</em></div>` + (t.both ? `<button class="act ${t.kind === 'melee' ? 'on' : ''}" data-act="p-melee">⚔ Nahkampf</button><button class="act ${t.kind === 'fire' ? 'on' : ''}" data-act="p-fire">➶ Beschuss</button>` : '');
    } else if (sel && human(sel.side) && sel.side === G.side) {
      const acts = [];
      if (T.cls === 'art') {
        const can = !sel.attacked && (!sel.moved || T.mobile) && !sel.supp && !sel.limbered;
        if (E.canLimber(G, sel)) acts.push(`<button class="act" data-act="limber">${sel.limbered ? '⚓ Abprotzen' : '🐎 Aufprotzen'}</button>`);
        if (can) {
          acts.push(`<button class="act ${artMode === 'he' ? 'on' : ''}" data-act="m-he">Sprenggranate</button><button class="act ${artMode === 'barrage' ? 'on' : ''}" data-act="m-barrage">Sperrfeuer</button><button class="act ${artMode === 'gas' ? 'on' : ''}" data-act="m-gas" ${sel.gas > 0 ? '' : 'disabled'}>Gas (${sel.gas})</button>`);
          acts.push(`<span class="hint">${shellHexes.size ? (artMode === 'he' ? 'Trifft ein Feld. Zerstört auch Draht.' : artMode === 'barrage' ? 'Hält Ziel und Nachbarfelder nieder. Kein Schaden.' : 'Wolke treibt 3 Runden mit dem Wind. Trifft auch eigene Truppen.') : 'Kein Ziel: Eine eigene Einheit muss es sehen (5 Felder).'}</span>`);
        } else acts.push(`<span class="hint">${sel.supp ? 'Niedergehalten: kann nicht feuern.' : sel.limbered ? 'Aufgeprotzt: zieht 4 Felder, feuert nicht. Nach dem Abprotzen ab der nächsten Runde feuerbereit.' : 'Hat diese Runde schon gehandelt.'}</span>`);
      } else {
        if ([...targets.values()].some(t => t.both)) acts.push(`<button class="act ${atkPref === 'melee' ? 'on' : ''}" data-act="p-melee">⚔ Nahkampf</button><button class="act ${atkPref === 'fire' ? 'on' : ''}" data-act="p-fire">➶ Beschuss</button>`);
        if (sel.officer) acts.push(E.canOrder(G, sel) ? `<button class="act" data-act="o-rally" title="Eigene Truppen bis 2 Felder: Moral +1,5, Niederhalten endet">📯 Sammeln</button><button class="act" data-act="o-storm" title="Eigene Truppen bis 2 Felder: Nahkampf ×1,25 in dieser Runde">⚔ Sturmbefehl</button>` : `<span class="hint">★ Befehl wieder in ${sel.cd} Runde${sel.cd > 1 ? 'n' : ''}.</span>`);
        if (T.cls === 'medic' && !sel.attacked) acts.push(`<span class="hint">${healSet.size ? 'Grün: diese Nachbarn kannst du versorgen (Stärke +1,5, Moral +1).' : 'Kein verwundeter Nachbar. Zieh neben eine angeschlagene eigene Einheit.'}</span>`);
        if ((!sel.moved || sel.turnOnly) && !sel.attacked && !sel.supp && !sel.broken) acts.push('<button class="act" data-act="tl">↺ Drehen</button><button class="act" data-act="tr">↻ Drehen</button>');
        if (E.canCut(G, sel)) acts.push('<button class="act on" data-act="cut">✂ Draht schneiden</button>');
        const hint = sel.broken ? 'Panne: fällt diese Runde aus.' : sel.supp ? 'Niedergehalten: kann nicht ziehen.' : (sel.moved && sel.attacked) ? 'Fertig für diese Runde.' :
          `${sel.moved ? '' : 'Helle Felder: ziehen. '}${sel.attacked ? '' : targets.size ? 'Rot: Nahkampf, Orange: Beschuss.' : 'Kein Ziel in Reichweite.'}`;
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
      $('hudName').textContent = T.name + (h.ridge ? ' auf der Höhe' : '');
      $('hudSub').innerHTML = o ? `Zielfeld: ${o.name} · ${o.pts} Punkte` : 'Gelände';
      $('hudRow').innerHTML = `<span class="hint">${T.info}${h.ridge ? ' Höhe: Fernkampf +1 Reichweite.' : ''}${E.cloudAt(G, inspect.hex[0], inspect.hex[1]) ? ' Gaswolke: schadet jeder Einheit, die hier ihren Zug beginnt.' : ''}${T.real ? ' <i>Im echten Krieg: ' + T.real + '</i>' : ''}</span>`;
    } else {
      $('hudName').textContent = G.over ? 'Schlacht beendet' : human(G.side) ? SIDES[G.side].name : 'Die KI ist am Zug';
      $('hudSub').innerHTML = `Runde ${G.turn} von ${P.MAXT}`;
      $('hudRow').innerHTML = `<span class="hint">${human(G.side) ? 'Tippe eine eigene Einheit an. Tippe auf Gegner oder Gelände für Infos.' : 'Bitte warten …'}</span>`;
    }
  }
  $('hudRow').querySelectorAll('[data-act]').forEach(b => b.onclick = () => panelAct(b.dataset.act));
}
async function panelAct(a) {
  if (a === 'cancel') return cancelPlace();
  if (a === 'o-rally' || a === 'o-storm') return act(() => E.order(G, sel, a.slice(2)));
  if (a === 'p-melee' || a === 'p-fire') { const v = a.slice(2); atkPref = atkPref === v ? 'auto' : v; const keep = previewT; computeOptions(); previewT = keep && targets.has(keep.id) ? keep : null; updateHud(); return; }
  if (!sel || busy) return;
  if (a.startsWith('m-')) { artMode = a.slice(2); previewT = null; computeOptions(); updateHud(); return; }
  if (a === 'tl' || a === 'tr') { const nf = (sel.face + (a === 'tr' ? 1 : 5)) % 6; await play(E.turnUnit(G, sel, nf)); computeOptions(); updateHud(); return; }
  if (a === 'cut') return act(u => E.cutWire(G, u));
  if (a === 'limber') return act(u => E.limber(G, u));
}
function showDetail() {
  const u = sel || (inspect && inspect.unit); if (!u) return;
  const T = TYPES[u.type];
  drawPortraitLater($('detPortrait'), figOf(T), u.side);
  $('detName').textContent = T.name; $('detSide').textContent = SIDES[u.side].name;
  $('detCan').textContent = T.can; $('detReal').textContent = T.real;
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
  $('start').hidden = false; $('closeStart').hidden = first;
  drawPortraitLater($('pA1'), 'inf', 'A'); drawPortraitLater($('pA2'), 'walker', 'A'); drawPortraitLater($('pA3'), 'art', 'A');
  drawPortraitLater($('pD1'), 'mg', 'D'); drawPortraitLater($('pD2'), 'storm', 'D'); drawPortraitLater($('pD3'), 'flame', 'D');
}
function startGame() {
  mode = document.querySelector('input[name=mode]:checked').value;
  blood = $('optBlood').checked; soundOn = $('optSound').checked; $('btnSound').textContent = soundOn ? '🔊' : '🔇';
  applySkin((document.querySelector('input[name=skin]:checked') || {}).value || 'A');
  $('start').hidden = true; $('end').hidden = true;
  G = E.newGame({});
  decals.length = particles.length = floaters.length = tracers.length = shells.length = booms.length = flames.length = rings.length = 0;
  initDU(); layout(); syncAll();
  E.startTurn(G);
  sel = null; inspect = null; placing = null; spawnSet = new Set(); updateUI();
  banner('Die Schlacht am Grauwall', SIDES.A.name + ' greift an'); playSound('march', 0.45); playSound('whistle', 0.5); setAmbient(soundOn);
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
    : `Nach ${P.MAXT} Runden hält der Angreifer ${r.pts} von 9 Punkten. Sieg ab ${P.WIN_A}, Unentschieden ab ${P.DRAW_A}.`;
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
document.addEventListener('keydown', e => { if (e.key === 'Escape') { cancelPlace(); $('shop').hidden = true; select(null); $('detail').hidden = true; $('rules').hidden = true; } });

// ---------- Start ----------
G = E.newGame({ seed: 7 });
initDU(); layout(); syncAll(); updateUI();
requestAnimationFrame(frame);
showStart(true);
window.__dbg = {
  hexCss: (c, r) => { const [x, y] = center(c, r), rc = cv.getBoundingClientRect(); return [rc.left + x * rc.width / cv.width, rc.top + y * rc.height / cv.height]; },
  get reach() { return [...reach.values()]; }, get targets() { return [...targets.values()]; }, get shellHexes() { return [...shellHexes]; },
  setSpeed: v => speed = v, get sndCount() { return window.__snd || 0; }, get sndBy() { return window.__sndBy || {}; }, get G() { return G; }, get busy() { return busy || qRunning; }, E, AI,
  sync: () => syncAll(),
  select: id => select(G.units.find(u => u.id === id)), get sel() { return sel; }
};
})();
