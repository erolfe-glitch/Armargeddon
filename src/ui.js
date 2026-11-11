// ===== ARMARGEDDON OBERFLÄCHE =====
(function () {
'use strict';
const { COLS, ROWS, TYPES, TERRAIN, OBJECTIVES, SIDES } = E;
const SQ3 = Math.sqrt(3);
let K = 0.62;
const $ = id => document.getElementById(id);
const fmt = (x, d = 1) => x.toFixed(d).replace('.', ',');

// ---------- Zustand ----------
let G = null, mode = 'A';           // 'A' / 'D' = Mensch spielt diese Seite, 'hot' = 2 Spieler
let blood = true, speed = 1, busy = false;
let sel = null, reach = new Map(), targets = new Map(), previewT = null, hoverHex = null;
const DU = new Map();               // Anzeigezustand je Einheit
const anims = [], particles = [], floaters = [], decals = [], tracers = [];
let queue = [], qRunning = false;
let S = null;                        // Figuren
let L = null;                        // Layout (Maße)
let terrainCv = null, ashes = [];

const human = side => mode === 'hot' || mode === side;

// ---------- Layout ----------
const board = $('board'), cv = $('map'), ctx = cv.getContext('2d');
const lo = document.createElement('canvas'), lx = lo.getContext('2d');

function layout() {
  const wrap = board.getBoundingClientRect();
  const stacked = matchMedia('(orientation: portrait), (max-width: 640px)').matches;
  const cssW = Math.max(wrap.width, stacked ? 760 : 560);
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  const devW = Math.round(cssW * dpr);
  const sDev = devW / (1.5 * COLS + 0.5);
  const PD = Math.max(2, Math.round(sDev / 10.5));
  const sL = sDev / PD;
  const topL = Math.round(sL * 1.7);
  // Tiefe so wählen, dass das Feld die Höhe nutzt (Seitenansicht: gestaucht)
  const availCss = stacked ? window.innerHeight * 0.62 : window.innerHeight - board.getBoundingClientRect().top - 4;
  const availL = availCss * dpr / PD;
  K = Math.max(0.5, Math.min(0.82, (availL - topL - sL * 0.5) / (sL * SQ3 * (ROWS + 0.5))));
  const loW = Math.ceil(devW / PD);
  const loH = Math.ceil(topL + sL * K * SQ3 * (ROWS + 0.5) + sL * 0.5);
  L = { dpr, PD, sL, topL, loW, loH, cssW, cssH: loH * PD / dpr };
  lo.width = loW; lo.height = loH;
  cv.width = loW * PD; cv.height = loH * PD;
  cv.style.width = L.cssW + 'px'; cv.style.height = L.cssH + 'px';
  renderTerrain();
  ashes = Array.from({ length: Math.round(loW * loH / 900) }, () => ({ x: Math.random() * loW, y: Math.random() * loH, v: 0.05 + Math.random() * 0.12, s: Math.random() }));
  for (const u of G.units) { const d = DU.get(u.id); if (d) { const [x, y] = center(u.c, u.r); d.x = x; d.y = y; } }
}

function center(c, r) {
  return [L.sL * (1 + 1.5 * c), L.topL + L.sL * K * SQ3 * (r + 0.5 * (c & 1) + 0.5)];
}
function pixToHex(x, y) {
  const X = (x - L.sL) / L.sL, Y = (y - L.topL) / (L.sL * K) - SQ3 * 0.5;
  const q = 2 / 3 * X, a = -X / 3 + SQ3 / 3 * Y, s = -q - a;
  let rq = Math.round(q), ra = Math.round(a), rs = Math.round(s);
  const dq = Math.abs(rq - q), da = Math.abs(ra - a), ds = Math.abs(rs - s);
  if (dq > da && dq > ds) rq = -ra - rs; else if (da > ds) ra = -rq - rs;
  const c = rq, r = ra + (rq - (rq & 1)) / 2;
  return (c >= 0 && c < COLS && r >= 0 && r < ROWS) ? [c, r] : null;
}
function hexPath(g, c, r, shrink = 1) {
  const [x, y] = center(c, r);
  g.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = Math.PI / 3 * i;
    g.lineTo(x + L.sL * shrink * Math.cos(a), y + L.sL * shrink * Math.sin(a) * K);
  }
  g.closePath();
}

// ---------- Gelände (Pixel für Pixel) ----------
const noise = (x, y) => { const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453; return n - Math.floor(n); };
const BASE = {
  open: [76, 61, 45], mud: [57, 46, 35], crater: [70, 56, 41], trench: [72, 58, 43], wire: [70, 57, 43],
  village: [80, 72, 62], forest: [60, 51, 39], canal: [30, 42, 46], bridge: [30, 42, 46]
};
function segDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay, l = dx * dx + dy * dy;
  let t = l ? ((px - ax) * dx + (py - ay) * dy) / l : 0; t = Math.max(0, Math.min(1, t));
  const qx = ax + t * dx - px, qy = ay + t * dy - py; return Math.sqrt(qx * qx + qy * qy);
}
function renderTerrain() {
  const { loW, loH, sL } = L;
  const img = lx.createImageData(loW, loH), D = img.data;
  const hexOf = new Int16Array(loW * loH).fill(-1);
  for (let y = 0; y < loH; y++) for (let x = 0; x < loW; x++) {
    const h = pixToHex(x + 0.5, y + 0.5); if (h) hexOf[y * loW + x] = h[0] * 100 + h[1];
  }
  const trenchN = {};
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) if (G.map[c][r].t === 'trench') {
    trenchN[c * 100 + r] = E.neighbors(c, r).filter(([nc, nr]) => G.map[nc][nr].t === 'trench');
  }
  for (let y = 0; y < loH; y++) for (let x = 0; x < loW; x++) {
    const i = y * loW + x, hk = hexOf[i], o = i * 4;
    if (hk < 0) { D[o] = 18; D[o + 1] = 15; D[o + 2] = 13; D[o + 3] = 255; continue; }
    const c = Math.floor(hk / 100), r = hk % 100, H = G.map[c][r];
    const [cx, cy] = center(c, r), dx = x + 0.5 - cx, dy = y + 0.5 - cy;
    const n = noise(x, y), n2 = noise(x * 0.37 + 3, y * 0.53 + 7);
    let col = BASE[H.t].slice();
    let v = (n - 0.5) * 14 + (n2 - 0.5) * 10;
    if (H.ridge) v += 9;
    if (H.t === 'open') { if (n > 0.965) col = [96, 92, 52]; else if (n < 0.03) col = [40, 32, 24]; }
    if (H.t === 'mud') { if (n2 > 0.8 && n > 0.4) col = [42, 52, 52]; else if (n > 0.95) col = [104, 94, 74]; }
    if (H.t === 'crater') {
      const ex = dx / (sL * 0.62), ey = dy / (sL * 0.62 * K), d = Math.sqrt(ex * ex + ey * ey);
      if (d < 0.42) col = n > 0.7 ? [52, 66, 66] : [34, 46, 46];
      else if (d < 0.8) col = [44, 35, 27];
      else if (d < 1.0) col = [96, 80, 58];
    }
    if (H.t === 'trench') {
      let dmin = 9;
      const nb = trenchN[hk];
      for (const [nc, nr] of nb) { const [ex, ey] = center(nc, nr); dmin = Math.min(dmin, segDist(x + 0.5, y + 0.5, cx, cy, (cx + ex) / 2, (cy + ey) / 2)); }
      if (!nb.length) dmin = Math.hypot(dx, dy * 1.5);
      const zz = Math.sin((y + c * 3) * 0.9) * 0.8;
      if (dmin + zz * 0.3 < 1.4) col = [22, 18, 14];
      else if (dmin < 2.6) { col = (Math.floor(x / 2) + Math.floor(y)) % 2 ? [122, 108, 78] : [98, 86, 62]; v *= 0.4; }
    }
    if (H.t === 'wire') {
      const z1 = Math.abs(dy - (Math.abs(((dx * 0.9 + 40) % 3) - 1.5) - 0.8) + sL * 0.12);
      const z2 = Math.abs(dy - (Math.abs(((dx * 0.9 + 41.5) % 3) - 1.5) - 0.8) - sL * 0.18);
      if (z1 < 0.55 || z2 < 0.55) col = n > 0.65 ? [128, 78, 46] : [158, 160, 162];
      else if (n > 0.93) col = [100, 66, 40];
    }
    if (H.t === 'village') {
      if (n > 0.72) col = [104, 98, 90]; else if (n < 0.2) col = [58, 54, 50];
    }
    if (H.t === 'forest') { if (n > 0.9) col = [112, 94, 62]; else if (n < 0.15) col = [42, 35, 27]; }
    if (H.t === 'canal' || H.t === 'bridge') {
      if (Math.sin(x * 0.7 + y * 2.1) > 0.92) col = [64, 84, 88];
      if (H.t === 'bridge' && Math.abs(dy) < sL * K * 0.45) col = (x % 3 === 0) ? [70, 50, 32] : [108, 80, 52];
    }
    // Hexkanten
    const right = x + 1 < loW ? hexOf[i + 1] : hk, down = y + 1 < loH ? hexOf[i + loW] : hk;
    let f = (right !== hk || down !== hk) ? 0.8 : 1;
    D[o] = Math.max(0, Math.min(255, (col[0] + v) * f));
    D[o + 1] = Math.max(0, Math.min(255, (col[1] + v) * f));
    D[o + 2] = Math.max(0, Math.min(255, (col[2] + v * 0.8) * f));
    D[o + 3] = 255;
  }
  terrainCv = document.createElement('canvas'); terrainCv.width = loW; terrainCv.height = loH;
  const tx = terrainCv.getContext('2d'); tx.putImageData(img, 0, 0);
  // Drahtpfähle
  tx.fillStyle = '#2c2117';
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) if (G.map[c][r].t === 'wire') {
    const [x, y] = center(c, r);
    for (const ox of [-0.55, 0, 0.55]) tx.fillRect(Math.round(x + ox * sL), Math.round(y - 4 + ox * 2), 1, 5);
  }
  // Fernes Glühen am oberen Rand
  const gr = tx.createLinearGradient(0, 0, 0, L.topL * 1.4);
  gr.addColorStop(0, 'rgba(120,40,20,0.45)'); gr.addColorStop(1, 'rgba(120,40,20,0)');
  tx.fillStyle = gr; tx.fillRect(0, 0, loW, L.topL * 1.4);
  buildProps();
}

let props = [];
function buildProps() {
  props = [];
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) {
    const t = G.map[c][r].t, [x, y] = center(c, r), n = noise(c * 7.1, r * 3.3);
    if (t === 'forest') {
      const spots = [[-0.45, -0.15], [0.35, -0.3], [0, 0.2], [0.5, 0.25]];
      spots.forEach(([ox, oy], i) => {
        const k = noise(c + i * 1.7, r * 2.1);
        props.push({ sp: k < 0.35 ? 'tree1' : k < 0.75 ? 'tree2' : 'stump', x: x + ox * L.sL, y: y + oy * L.sL * K, flip: k > 0.5 ? 1 : 0 });
      });
    }
    if (t === 'village') {
      props.push({ sp: n < 0.5 ? 'wall1' : 'wall2', x: x - L.sL * 0.25, y: y - L.sL * 0.12, flip: n > 0.3 ? 1 : 0 });
      props.push({ sp: n < 0.5 ? 'wall2' : 'wall1', x: x + L.sL * 0.35, y: y + L.sL * 0.3 * K, flip: n > 0.6 ? 1 : 0 });
    }
    if (t === 'open' || t === 'crater') if (n > 0.92 && c > 1) props.push({ sp: 'stump', x: x + (n - 0.95) * 20, y, flip: 0 });
  }
}

// ---------- Einheiten-Anzeige ----------
function initDU() {
  DU.clear();
  for (const u of G.units) {
    const [x, y] = L ? center(u.c, u.r) : [0, 0];
    DU.set(u.id, { x, y, face: u.face, str: u.str, mor: u.mor, alpha: 1, shake: 0, lunge: null });
  }
}
function syncAll() {
  for (const u of G.units) {
    const d = DU.get(u.id); const [x, y] = center(u.c, u.r);
    d.x = x; d.y = y; d.face = u.face; d.str = u.str; d.mor = u.mor; d.lunge = null;
    if (!E.alive(u)) d.alpha = 0;
  }
}
const facesLeft = f => f === 2 || f === 3 || f === 4;

function drawUnit(u, d) {
  if (d.alpha <= 0) return;
  const T = TYPES[u.type], side = u.side, flip = facesLeft(d.face) ? 1 : 0;
  let x = d.x, y = d.y;
  if (d.lunge) { x += d.lunge.dx; y += d.lunge.dy; }
  if (d.shake > 0) x += Math.sin(perfNow / 25) * 1.2;
  lx.globalAlpha = d.alpha * (u.status === 'rout' ? 0.7 : 1);
  // Ring
  const isSel = sel && sel.id === u.id;
  const done = human(u.side) && G.side === u.side && u.moved && u.attacked && E.active(u);
  ringAt(x, y, isSel ? '#f4ecd8' : SPR.PAL[side].ring, done ? 0.35 : (isSel ? 1 : 0.85), u.status === 'rout');
  if (previewT && previewT.id === u.id) ringAt(x, y, '#ff5a3c', 0.6 + 0.4 * Math.sin(perfNow / 120), false, 1.18);
  // Figuren
  const n = d.str > 6.6 ? 3 : d.str > 3.3 ? 2 : 1;
  const crouch = u.supp > 0 ? 3 : 0;
  const sp = T.mg ? S.mg[side][flip] : S.inf[side][flip];
  const slots = T.mg ? [[0, 0], [-0.55, -0.25], [0.5, -0.2]] : [[0, 0.12], [-0.5, -0.12], [0.48, -0.16]];
  const order = [1, 2, 0].filter(i => i < n || (T.mg && i === 0)).slice(0, T.mg ? 1 : n);
  const sorted = slots.map((s, i) => [s, i]).filter(([, i]) => order.includes(i)).sort((a, b) => a[0][1] - b[0][1]);
  for (const [[ox, oy], i] of sorted) {
    const fx = Math.round(x + ox * L.sL - sp.width / 2), fy = Math.round(y + oy * L.sL * K - sp.height + 1 + crouch);
    if (T.mg && i === 0) {
      lx.drawImage(sp, fx, fy);
      if (n >= 2) { const s2 = S.inf[side][flip]; lx.drawImage(s2, Math.round(x + (flip ? 0.55 : -0.55) * L.sL - s2.width / 2), Math.round(y - 0.3 * L.sL * K - s2.height + 1 + crouch)); }
    } else {
      if (u.officer && i === 0) { const b = S.banner[side][flip]; lx.drawImage(b, fx + (flip ? 1 : sp.width - 3), fy - b.height + 6); }
      lx.drawImage(sp, fx, fy);
    }
  }
  lx.globalAlpha = 1;
  // Balken: Stärke und Moral
  if (E.alive(u)) {
    const w = Math.round(L.sL * 1.1), bx = Math.round(x - w / 2), by = Math.round(y + L.sL * K * 0.55);
    lx.fillStyle = '#0d0b0a'; lx.fillRect(bx - 1, by - 1, w + 2, 4);
    lx.fillStyle = d.str > 3.3 ? '#d9cfbf' : '#d0503a'; lx.fillRect(bx, by, Math.max(1, Math.round(w * d.str / 10)), 1);
    lx.fillStyle = '#d6a93a'; lx.fillRect(bx, by + 1, Math.max(0, Math.round(w * d.mor / TYPES[u.type].mor)), 1);
    if (u.supp > 0) { lx.fillStyle = '#e8d070'; for (let k = 0; k < 3; k++) lx.fillRect(Math.round(x - 3 + k * 3), Math.round(y - L.sL * 1.55 + (perfNow / 200 + k) % 3), 1, 2); }
    if (u.status === 'rout') { lx.fillStyle = '#eee'; lx.fillRect(Math.round(x + 4), Math.round(y - L.sL * 1.6), 4, 3); lx.fillStyle = '#555'; lx.fillRect(Math.round(x + 3), Math.round(y - L.sL * 1.6), 1, 8); }
  }
}

const ringCache = new Map();
function ringAt(x, y, color, alpha, dashed, scale = 1) {
  const rx = Math.round(L.sL * 0.72 * scale), ry = Math.max(2, Math.round(L.sL * 0.72 * K * scale));
  const key = color + rx + ry + dashed;
  let rc = ringCache.get(key);
  if (!rc) {
    rc = document.createElement('canvas'); rc.width = rx * 2 + 3; rc.height = ry * 2 + 3;
    const g = rc.getContext('2d'); g.fillStyle = color;
    for (let py = 0; py < rc.height; py++) for (let px = 0; px < rc.width; px++) {
      const ex = (px - rx - 1) / rx, ey = (py - ry - 1) / ry, d = Math.sqrt(ex * ex + ey * ey);
      if (d <= 1.04 && d >= 0.8 && (!dashed || (px + py) % 3)) g.fillRect(px, py, 1, 1);
    }
    ringCache.set(key, rc);
  }
  const old = lx.globalAlpha; lx.globalAlpha = old * alpha;
  lx.drawImage(rc, Math.round(x - rx - 1), Math.round(y - ry - 1));
  lx.globalAlpha = old;
}

// ---------- Zeichnen ----------
let perfNow = 0;
function frame(t) {
  perfNow = t;
  draw();
  requestAnimationFrame(frame);
}
function draw() {
  if (!L) return;
  lx.imageSmoothingEnabled = false;
  lx.drawImage(terrainCv, 0, 0);
  for (const dc of decals) { lx.fillStyle = dc.col; lx.fillRect(dc.x, dc.y, dc.w, 1); }
  // Markierungen
  if (sel) {
    lx.globalAlpha = 0.28; lx.fillStyle = '#f0e2b0';
    for (const [, n] of reach) { hexPath(lx, n.c, n.r, 0.86); lx.fill(); }
    for (const [, t] of targets) { lx.fillStyle = t.ranged ? '#ff9a2e' : '#ff3a2a'; const u = G.units.find(x => x.id === t.id); hexPath(lx, u.c, u.r, 0.86); lx.fill(); }
    lx.globalAlpha = 1;
  }
  if (hoverHex) { lx.strokeStyle = 'rgba(240,230,200,0.5)'; lx.lineWidth = 1; hexPath(lx, hoverHex[0], hoverHex[1], 0.95); lx.stroke(); }
  // Requisiten und Einheiten nach Tiefe
  const items = [];
  for (const p of props) items.push({ y: p.y, f: () => { const sp = S[p.sp][p.flip]; lx.drawImage(sp, Math.round(p.x - sp.width / 2), Math.round(p.y - sp.height + 2)); } });
  for (const o of OBJECTIVES) {
    const [x, y] = center(o.c, o.r), owner = G.ctrl[o.id];
    items.push({ y: y - 1, f: () => { const sp = S.flag[owner][0]; lx.drawImage(sp, Math.round(x + L.sL * 0.45), Math.round(y - sp.height - L.sL * 0.1)); } });
  }
  for (const u of G.units) { const d = DU.get(u.id); if (d && d.alpha > 0) items.push({ y: d.y + 0.01, f: () => drawUnit(u, d) }); }
  items.sort((a, b) => a.y - b.y);
  for (const it of items) it.f();
  // Effekte
  for (let i = tracers.length - 1; i >= 0; i--) {
    const tr = tracers[i]; tr.life -= 1;
    if (tr.life <= 0) { tracers.splice(i, 1); continue; }
    const k = 1 - tr.life / tr.max;
    lx.fillStyle = tr.col;
    for (let s = 0; s < tr.n; s++) {
      const p = (k * 1.6 + s * 0.17) % 1.2; if (p > 1) continue;
      lx.fillRect(Math.round(tr.x1 + (tr.x2 - tr.x1) * p), Math.round(tr.y1 + (tr.y2 - tr.y1) * p), 2, 1);
    }
    if (tr.life > tr.max - 4) { lx.fillStyle = '#fff2a0'; lx.fillRect(Math.round(tr.x1) - 1, Math.round(tr.y1) - 1, 3, 3); }
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]; p.x += p.vx; p.y += p.vy; p.vy += p.g; p.life--;
    if (p.life <= 0) { particles.splice(i, 1); continue; }
    lx.globalAlpha = Math.min(1, p.life / 12); lx.fillStyle = p.col; lx.fillRect(Math.round(p.x), Math.round(p.y), p.s, p.s);
  }
  lx.globalAlpha = 1;
  // Asche
  lx.fillStyle = 'rgba(190,180,170,0.35)';
  for (const a of ashes) { a.y += a.v; a.x += Math.sin((perfNow / 1500) + a.s * 6) * 0.08; if (a.y > L.loH) { a.y = -2; a.x = Math.random() * L.loW; } lx.fillRect(Math.round(a.x), Math.round(a.y), 1, 1); }
  // Hochskalieren
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(lo, 0, 0, cv.width, cv.height);
  // Text in voller Auflösung
  const PD = L.PD;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  if (sel && human(G.side)) {
    ctx.font = `700 ${Math.round(L.sL * PD * 0.42)}px system-ui, sans-serif`;
    for (const [, n] of reach) {
      const [x, y] = center(n.c, n.r);
      ctx.fillStyle = 'rgba(15,12,10,0.75)'; ctx.fillText(n.cost, x * PD + 1, y * PD + 1);
      ctx.fillStyle = '#f3e7c4'; ctx.fillText(n.cost, x * PD, y * PD);
    }
  }
  for (let i = floaters.length - 1; i >= 0; i--) {
    const f = floaters[i]; f.life--; f.y -= 0.25;
    if (f.life <= 0) { floaters.splice(i, 1); continue; }
    ctx.globalAlpha = Math.min(1, f.life / 20);
    ctx.font = `800 ${Math.round(L.sL * PD * (f.big ? 0.55 : 0.45))}px system-ui, sans-serif`;
    ctx.fillStyle = '#100c0a'; ctx.fillText(f.text, f.x * PD + 2, f.y * PD + 2);
    ctx.fillStyle = f.col; ctx.fillText(f.text, f.x * PD, f.y * PD);
  }
  ctx.globalAlpha = 1;
}

// ---------- Effekte ----------
function burst(x, y, n, cols, opts = {}) {
  for (let i = 0; i < n; i++) particles.push({
    x, y, vx: (Math.random() - 0.5) * (opts.spread || 1.2), vy: -Math.random() * (opts.up || 1.4), g: opts.g != null ? opts.g : 0.08,
    life: 18 + Math.random() * 18, col: cols[i % cols.length], s: Math.random() < 0.3 ? 2 : 1
  });
}
function floater(x, y, text, col, big) { floaters.push({ x, y, text, col, life: 70 / speed + 20, big }); }
function bodyPos(id) { const d = DU.get(id); return [d.x, d.y - L.sL * 0.7]; }

// ---------- Ereignis-Animation ----------
const wait = ms => new Promise(r => setTimeout(r, ms / speed));
async function animPath(id, path, msPer) {
  const d = DU.get(id);
  for (let i = 1; i < path.length; i++) {
    const [x0, y0] = center(path[i - 1][0], path[i - 1][1]), [x1, y1] = center(path[i][0], path[i][1]);
    if (x1 !== x0) d.face = x1 > x0 ? 0 : 3;
    const steps = Math.max(4, Math.round(msPer / 16 / speed));
    for (let s = 1; s <= steps; s++) { d.x = x0 + (x1 - x0) * s / steps; d.y = y0 + (y1 - y0) * s / steps; await new Promise(r => requestAnimationFrame(r)); }
  }
}
const unitById = id => G.units.find(u => u.id === id);
const sideName = s => SIDES[s].short;

async function playEvent(e) {
  const u = e.u != null ? unitById(e.u) : null;
  switch (e.t) {
    case 'move': await animPath(e.u, e.path, 170); break;
    case 'advance': case 'fallback': await animPath(e.u, e.path, 200); if (e.t === 'fallback') floater(...bodyPos(e.u), 'weicht', '#e8c070'); break;
    case 'flee': await animPath(e.u, e.path, 120); break;
    case 'face': DU.get(e.u).face = e.face; break;
    case 'fire': {
      const a = DU.get(e.a), [x1, y1] = bodyPos(e.a), [x2, y2] = bodyPos(e.d);
      a.face = e.face != null ? e.face : a.face;
      tracers.push({ x1: x1 + (x2 > x1 ? 5 : -5), y1: y1 + 3, x2, y2: y2 + 3, life: e.mg ? 26 : 16, max: e.mg ? 26 : 16, n: e.mg ? 5 : 1, col: e.mg ? '#ffd860' : '#f5e6b0' });
      if (e.reaction) floater(x1, y1 - 4, 'Reaktionsfeuer!', '#ffd860');
      await wait(e.mg ? 380 : 260); break;
    }
    case 'melee': case 'counter': {
      const a = DU.get(e.a), d = DU.get(e.d);
      if (e.face != null) a.face = e.face;
      const dx = (d.x - a.x) * 0.35, dy = (d.y - a.y) * 0.35;
      a.lunge = { dx, dy }; await wait(140);
      burst((a.x + d.x) / 2, (a.y + d.y) / 2 - L.sL * 0.7, 8, ['#f0e0b0', '#c9c2b0', '#8a1f18'], { spread: 1.6 });
      await wait(160); a.lunge = null; await wait(80); break;
    }
    case 'hit': {
      const d = DU.get(e.u), [x, y] = bodyPos(e.u);
      d.str = e.str; d.mor = e.morv; d.shake = 1; setTimeout(() => d.shake = 0, 260 / speed);
      if (!e.panic) {
        burst(x, y + L.sL * 0.5, 10, ['#5a4632', '#3d3024', '#7a6448'], { up: 1.8 });
        if (blood) { burst(x, y, 4, ['#7a1612', '#5e100d'], { up: 0.8 }); decals.push({ x: Math.round(x + (Math.random() - 0.5) * 8), y: Math.round(y + L.sL * 0.6 + Math.random() * 3), w: 1 + Math.round(Math.random() * 2), col: Math.random() < 0.5 ? '#5a1410' : '#47100d' }); if (decals.length > 400) decals.shift(); }
        floater(x, y - 4, '−' + fmt(e.dmg), '#ff8a6a');
      } else floater(x, y - 4, 'Moral −0,5', '#e8c070');
      await wait(e.panic ? 200 : 300); break;
    }
    case 'supp': floater(...bodyPos(e.u), 'niedergehalten', '#e8d070'); await wait(200); break;
    case 'rout': floater(...bodyPos(e.u), 'flieht!', '#ffffff', true); log(`${TYPES[u.type].name} (${sideName(u.side)}) flieht.`); await wait(380); break;
    case 'destroyed': { const d = DU.get(e.u); floater(...bodyPos(e.u), 'aufgerieben', '#ff6a50', true); log(`${TYPES[u.type].name} (${sideName(u.side)}) ist aufgerieben.`); for (let k = 0; k < 12; k++) { d.alpha = 1 - k / 12; await wait(30); } d.alpha = 0; break; }
    case 'escaped': { const d = DU.get(e.u); log(`${TYPES[u.type].name} (${sideName(u.side)}) hat das Schlachtfeld verlassen.`); d.alpha = 0; break; }
    case 'officer': log(`${e.name} ist gefallen.`); floater(...bodyPos(e.u), e.name + ' fällt', '#ff6a50', true); await wait(300); break;
    case 'rally': floater(...bodyPos(e.u), 'gesammelt!', '#9dff6e', true); log(`${e.by} sammelt ${TYPES[u.type].name}.`); DU.get(e.u).face = u.face; await wait(300); break;
    case 'cut': { const [x, y] = center(e.c, e.r); burst(x, y - 2, 10, ['#c8ccd0', '#ffe090'], { spread: 1 }); floater(x, y - L.sL, 'Draht geschnitten', '#d9dde2'); renderTerrain(); await wait(300); break; }
    case 'over': break;
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
  if (G.over) showEnd();
}

// ---------- Eingabe ----------
function evToLo(ev) {
  const r = cv.getBoundingClientRect();
  return [(ev.clientX - r.left) * (cv.width / r.width) / L.PD, (ev.clientY - r.top) * (cv.height / r.height) / L.PD];
}
function unitAtPixel(x, y) {
  let best = null;
  for (const u of G.units) {
    if (!E.alive(u)) continue;
    const d = DU.get(u.id);
    if (Math.abs(x - d.x) < L.sL * 0.75 && y < d.y + L.sL * K * 0.7 && y > d.y - L.sL * 1.55) if (!best || d.y > DU.get(best.id).y) best = u;
  }
  return best;
}
cv.addEventListener('pointermove', ev => {
  if (!G) return;
  const [x, y] = evToLo(ev);
  hoverHex = pixToHex(x, y);
  if (ev.pointerType === 'mouse' && sel && !busy) {
    const u = unitAtPixel(x, y);
    const t = u && targets.get(u.id);
    const np = t ? u : null;
    if (np !== previewT) { previewT = np; updatePanel(); }
  }
});
cv.addEventListener('pointerleave', () => { hoverHex = null; });
cv.addEventListener('click', ev => {
  if (!G || busy || G.over || !human(G.side)) return;
  const [x, y] = evToLo(ev);
  const u = unitAtPixel(x, y), h = pixToHex(x, y);
  if (sel && u && targets.has(u.id)) {
    if (previewT === u || ev.pointerType === 'mouse') return doAttack(u);
    previewT = u; updatePanel(); return;
  }
  if (sel && h && reach.has(E.key(h[0], h[1])) && !(u && u.side === G.side && u.id !== sel.id)) return doMove(h[0], h[1]);
  if (u && u.side === G.side && E.active(u)) { select(u); return; }
  if (u) { showInfo(u); return; }
  if (h) { select(null); showHexInfo(h); return; }
  select(null);
});

function select(u) {
  sel = u; previewT = null; reach = new Map(); targets = new Map();
  if (u) computeOptions();
  updatePanel();
}
function computeOptions() {
  if (!sel || !E.active(sel) || sel.side !== G.side) { reach = new Map(); targets = new Map(); return; }
  reach = E.reachable(G, sel);
  targets = new Map();
  for (const d of G.units) {
    if (d.side === sel.side || !E.alive(d)) continue;
    if (E.canMelee(G, sel, d)) targets.set(d.id, { id: d.id, ranged: false });
    else if (E.canFire(G, sel, d)) targets.set(d.id, { id: d.id, ranged: true });
  }
}
async function doMove(c, r) {
  busy = true; const u = sel;
  previewT = null; reach = new Map(); targets = new Map();
  await play(E.moveUnit(G, u, c, r));
  busy = false; if (E.active(u)) { sel = u; computeOptions(); } else sel = null;
  updateUI();
}
async function doAttack(d) {
  busy = true; const u = sel, t = targets.get(d.id);
  previewT = null; reach = new Map(); targets = new Map();
  await play(t.ranged ? E.fire(G, u, d) : E.melee(G, u, d));
  busy = false; if (E.active(u) && (!u.moved || !u.attacked)) { sel = u; computeOptions(); } else sel = null;
  updateUI();
}

// ---------- Rundenablauf ----------
async function endTurn() {
  if (busy || G.over) return;
  select(null); busy = true;
  const ev = E.endTurn(G);
  updateUI();
  await play(ev);
  busy = false;
  if (G.over) return;
  if (mode === 'hot') { showHandover(); return; }
  if (!human(G.side)) await aiTurn();
}
async function aiTurn() {
  busy = true; updateUI();
  await wait(350);
  let guard = 0;
  while (!G.over && guard++ < 200) {
    const act = AI.next(G);
    if (!act) break;
    for (const s of act.steps) {
      const ev = AI.exec(G, act.u, s);
      if (ev.length) await play(ev);
      if (G.over) break;
    }
    await wait(90);
  }
  busy = false;
  if (G.over) return;
  const ev = E.endTurn(G);
  busy = true; await play(ev); busy = false;
  updateUI();
}

// ---------- Panel ----------
function log(text) {
  const el = $('log'); const p = document.createElement('p'); p.textContent = text; el.prepend(p);
  while (el.children.length > 30) el.lastChild.remove();
}
function bar(label, val, mark, cls) {
  return `<div class="meter ${cls}"><div class="mlabel"><span>${label}</span><span>${Math.round(val * 100)} %</span></div><div class="mtrack"><i style="width:${Math.max(0, Math.min(100, val * 100))}%"></i><b style="left:${mark * 100}%"></b></div></div>`;
}
function updateUI() {
  if (!G) return;
  $('turn').textContent = `Runde ${G.turn} / ${E.P.MAXT}`;
  const ch = $('sidechip'); ch.className = 'chip ' + G.side; ch.textContent = SIDES[G.side].short + (human(G.side) ? '' : ' (KI)');
  $('btnEnd').disabled = busy || !!G.over || !human(G.side);
  $('btnEnd').textContent = busy && !human(G.side) ? 'KI zieht …' : 'Runde beenden';
  const la = 1 - E.losses(G, 'A'), ld = 1 - E.losses(G, 'D');
  $('forces').innerHTML = bar('Konkordat', la, 1 - E.P.BREAK.A, 'A') + bar('Aschenwacht', ld, 1 - E.P.BREAK.D, 'D');
  $('objs').innerHTML = OBJECTIVES.map(o => `<li class="${G.ctrl[o.id]}"><span>${o.name}</span><b>${o.pts}</b></li>`).join('') +
    `<li class="sum"><span>Konkordat hält</span><b>${E.points(G)} / ${E.P.WIN_A} Punkte</b></li>`;
  if (sel && !E.active(sel)) sel = null;
  if (sel) computeOptions();
  updatePanel();
}
function statRow(k, v) { return `<div><dt>${k}</dt><dd>${v}</dd></div>`; }
function unitCard(u) {
  const T = TYPES[u.type], st = u.status === 'rout' ? 'flieht' : u.supp > 0 ? 'niedergehalten' : 'kampfbereit';
  const h = G.map[u.c][u.r];
  return `<div class="card ${u.side}">
    <div class="ctitle"><span>${T.name}</span><em>${SIDES[u.side].short}${u.officer ? ' · ' + u.officer : ''}</em></div>
    <dl class="stats">${statRow('Stärke', fmt(u.str))}${statRow('Moral', fmt(u.mor) + ' / ' + T.mor)}${statRow('Angriff', T.atk)}${statRow('Abwehr', T.def)}${statRow('Bewegung', T.mv)}${statRow('Reichweite', T.rng ? T.rng + ' (Feuer ' + T.fs + ')' : '–')}</dl>
    <p class="status">${st} · steht auf: ${TERRAIN[h.t].name}${h.ridge ? ' (Höhe)' : ''}${u.side === G.side && human(u.side) ? ' · ' + (u.moved ? 'gezogen' : 'kann ziehen') + ', ' + (u.attacked ? 'hat angegriffen' : 'kann angreifen') : ''}</p>
    <p class="can"><b>Kann:</b> ${T.can}</p>
    ${u.officer ? '<p class="can"><b>Offizier:</b> Angriff ×1,15 und weniger Moralverlust für alle eigenen Einheiten bis 2 Felder entfernt. Sammelt Fliehende.</p>' : ''}
    <p class="real"><b>Im echten Krieg:</b> ${T.real}</p>
  </div>`;
}
function updatePanel() {
  const box = $('info');
  if (!G) return;
  let html = '';
  if (previewT && sel) {
    const t = targets.get(previewT.id);
    const p = E.preview(G, sel, previewT, t.ranged);
    html += `<div class="preview"><div class="ptitle">${t.ranged ? 'Beschuss' : 'Nahkampf'}: ${TYPES[sel.type].name} → ${TYPES[previewT.type].name}</div>
      <div class="pnums"><span>Schaden ≈ <b>${fmt(p.dmg)}</b></span>${t.ranged ? '<span>kein Gegenschlag</span>' : `<span>Gegenschlag ≈ <b>${fmt(p.counter)}</b></span>`}</div>
      <div class="tags">${p.tags.length ? p.tags.map(x => `<i>${x}</i>`).join('') : '<i>keine Zu- oder Abschläge</i>'}</div>
      <p class="hint">${matchMedia('(pointer: fine)').matches ? 'Klicken zum Angreifen.' : 'Nochmal tippen zum Angreifen.'}</p></div>`;
  }
  if (sel) {
    html += unitCard(sel);
    const acts = [];
    if (human(sel.side) && sel.side === G.side && E.active(sel)) {
      if ((!sel.moved || sel.turnOnly) && !sel.attacked && !sel.supp) acts.push('<button class="btn" data-act="tl">↺ drehen</button><button class="btn" data-act="tr">↻ drehen</button>');
      if (!sel.attacked && TYPES[sel.type].cls === 'inf' && G.map[sel.c][sel.r].t === 'wire') acts.push('<button class="btn warn" data-act="cut">Draht schneiden</button>');
    }
    if (acts.length) html += `<div class="acts">${acts.join('')}</div>`;
  } else if (infoUnit) html += unitCard(infoUnit);
  else if (infoHex) {
    const h = G.map[infoHex[0]][infoHex[1]], T = TERRAIN[h.t];
    const o = OBJECTIVES.find(x => x.c === infoHex[0] && x.r === infoHex[1]);
    html += `<div class="card terrain"><div class="ctitle"><span>${T.name}${h.ridge ? ' auf der Höhe' : ''}</span>${o ? `<em>Zielfeld: ${o.name} (${o.pts} Punkte)</em>` : ''}</div><p class="can">${T.info}${h.ridge ? ' Höhe: Fernkampf von hier +1 Reichweite.' : ''}</p>${T.real ? `<p class="real"><b>Im echten Krieg:</b> ${T.real}</p>` : ''}</div>`;
  } else html += `<p class="idle">${human(G.side) ? 'Tippe eine eigene Einheit an. Helle Felder: dorthin ziehen. Rot: Nahkampf. Orange: Beschuss.' : 'Die KI ist am Zug.'}</p>`;
  box.innerHTML = html;
  box.querySelectorAll('[data-act]').forEach(b => b.onclick = () => panelAct(b.dataset.act));
}
let infoUnit = null, infoHex = null;
function showInfo(u) { sel = null; reach = new Map(); targets = new Map(); infoUnit = u; infoHex = null; updatePanel(); infoUnit = null; }
function showHexInfo(h) { infoHex = h; infoUnit = null; updatePanel(); infoHex = null; }
async function panelAct(a) {
  if (!sel || busy) return;
  if (a === 'tl' || a === 'tr') {
    // Drehen verbraucht die Bewegung
    const nf = (sel.face + (a === 'tr' ? 1 : 5)) % 6;
    await play(E.turnUnit(G, sel, nf));
    computeOptions(); updatePanel(); return;
  }
  if (a === 'cut') { busy = true; const u = sel; await play(E.cutWire(G, u)); busy = false; sel = null; updateUI(); }
}

// ---------- Bildschirme ----------
function showStart(first) {
  $('start').hidden = false;
  $('startBtn').textContent = first ? 'Schlacht beginnen' : 'Neue Schlacht beginnen';
}
function startGame() {
  mode = document.querySelector('input[name=mode]:checked').value;
  blood = $('optBlood').checked;
  $('start').hidden = true; $('end').hidden = true;
  G = E.newGame({});
  decals.length = 0; particles.length = 0; floaters.length = 0; tracers.length = 0;
  initDU(); layout(); syncAll();
  $('log').innerHTML = '';
  log('20. Nebelmond, Jahr 1917 nach dem Bruch. Das Konkordat greift den Grauwall an.');
  E.startTurn(G);
  sel = null; updateUI();
  if (mode === 'hot') showHandover();
  else if (!human(G.side)) aiTurn();
}
function showHandover() {
  $('handover').hidden = false;
  $('handTitle').textContent = SIDES[G.side].name;
  $('handText').textContent = `Runde ${G.turn}. Gebt das Gerät weiter.`;
  $('handover').className = 'overlay hand ' + G.side;
}
function showEnd() {
  const r = G.over, me = mode === 'hot' ? null : mode;
  const win = r.winner;
  let title = win ? SIDES[win].name + ' siegt' : 'Unentschieden';
  if (me) title = win === me ? 'Sieg' : win ? 'Niederlage' : 'Unentschieden';
  const why = r.why === 'break' ? (win === 'A' ? 'Die Aschenwacht ist zusammengebrochen.' : 'Der Angriff des Konkordats ist zusammengebrochen.')
    : `Nach ${E.P.MAXT} Runden hält das Konkordat ${r.pts} von 9 Punkten (Sieg ab ${E.P.WIN_A}, Unentschieden ab ${E.P.DRAW_A}).`;
  let stars = 0;
  if (me) {
    if (win === me) stars = 2 + ((me === 'A' ? E.losses(G, 'A') : E.losses(G, 'D')) < 0.3 ? 1 : 0);
    else if (!win) stars = 1;
  }
  $('endTitle').textContent = title;
  $('endWhy').textContent = why;
  $('endStars').textContent = me ? '★'.repeat(stars) + '☆'.repeat(3 - stars) : '';
  $('endStats').innerHTML = `<div><dt>Ausfälle Konkordat</dt><dd>${Math.round(E.losses(G, 'A') * 100)} %</dd></div><div><dt>Ausfälle Aschenwacht</dt><dd>${Math.round(E.losses(G, 'D') * 100)} %</dd></div>` +
    OBJECTIVES.map(o => `<div><dt>${o.name}</dt><dd>${SIDES[G.ctrl[o.id]].short}</dd></div>`).join('');
  $('end').hidden = false;
}

// ---------- Knöpfe ----------
$('btnEnd').onclick = endTurn;
$('startBtn').onclick = startGame;
$('btnMenu').onclick = () => showStart(false);
$('closeStart').onclick = () => { if (G) $('start').hidden = true; };
$('btnRules').onclick = () => { $('rules').hidden = false; };
$('closeRules').onclick = () => { $('rules').hidden = true; };
$('btnRules2').onclick = () => { $('rules').hidden = false; };
$('againBtn').onclick = () => { $('end').hidden = true; showStart(false); };
$('reviewBtn').onclick = () => { $('end').hidden = true; };
$('handBtn').onclick = () => { $('handover').hidden = true; updateUI(); };
$('btnSpeed').onclick = () => { speed = speed === 1 ? 2 : speed === 2 ? 3 : 1; $('btnSpeed').textContent = 'Tempo ' + speed + '×'; };
$('btnFull').onclick = () => { const d = document; if (!d.fullscreenElement) (d.documentElement.requestFullscreen || d.documentElement.webkitRequestFullscreen || (() => {})).call(d.documentElement); else d.exitFullscreen(); };
let rT = 0;
window.addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(() => { if (G) layout(); }, 120); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') select(null); });

// ---------- Start ----------
S = SPR.makeSprites();
G = E.newGame({ seed: 7 });
initDU(); layout(); syncAll(); updateUI();
requestAnimationFrame(frame);
showStart(true);
window.__dbg = { hexCss: (c, r) => { const [x, y] = center(c, r), rc = cv.getBoundingClientRect(); return [rc.left + x * L.PD * rc.width / cv.width, rc.top + y * L.PD * rc.height / cv.height]; }, get reach() { return [...reach.values()]; }, get targets() { return [...targets.values()]; }, setSpeed: v => speed = v, get G() { return G; }, get busy() { return busy; }, E, AI, select: id => select(G.units.find(u => u.id === id)), endTurn, aiTurn, get sel() { return sel; } };
})();
