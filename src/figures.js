// ===== ARMARGEDDON FIGUREN =====
// Comic-Figuren mit dicker dunkler Kontur, als Vektorformen gezeichnet (eigene Grafik).
// Koordinaten: 1 Einheit = Höhe eines Soldaten, Ursprung an den Füßen, Blick nach rechts.
(function (root) {
'use strict';

const OUT = '#16150f';
const PAL = {
  A: { coat: '#5f5a3c', coatD: '#454128', coatL: '#7a744e', helm: '#4a4d30', helmL: '#676a45', mask: '#2c2a20', lens: '#a8f070',
       pack: '#5e4830', boot: '#211c15', steel: '#7c8078', steelD: '#4e524c', wood: '#5f4229', armor: '#565a40', armorD: '#3b3e2b',
       armorL: '#74785a', accent: '#d07a2c', horse: '#4a3a2b', horseD: '#32271c', cloth: '#b9b29a', skin: '#c9a27e' },
  D: { coat: '#4c5158', coatD: '#373b41', coatL: '#676d75', helm: '#32363b', helmL: '#4f555c', mask: '#1f2124', lens: '#ff4a36',
       pack: '#3f382f', boot: '#17181a', steel: '#868c92', steelD: '#555a60', wood: '#48392a', armor: '#41464d', armorD: '#2c3036',
       armorL: '#5f656e', accent: '#4a94d6', horse: '#33353a', horseD: '#222327', cloth: '#aeb2b6', skin: '#c9a27e' }
};

function rr(g, x, y, w, h, r) {
  g.beginPath();
  if (g.roundRect) g.roundRect(x, y, w, h, r);
  else { g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
}
function fs(g, fill) { g.fillStyle = fill; g.fill(); g.stroke(); }
function box(g, x, y, w, h, r, fill) { rr(g, x, y, w, h, r); fs(g, fill); }
function circ(g, x, y, r, fill) { g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); fs(g, fill); }
function poly(g, pts, fill) { g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.closePath(); fs(g, fill); }
function seg(g, x1, y1, x2, y2, w, col) {
  g.save(); g.lineCap = 'round';
  g.strokeStyle = OUT; g.lineWidth = w + 0.07; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke();
  g.strokeStyle = col; g.lineWidth = w; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke();
  g.restore();
}
function plain(g, x, y, w, h, col) { g.fillStyle = col; g.fillRect(x, y, w, h); }

function helmet(g, p, side, x, y) {
  if (side === 'A') {
    g.beginPath(); g.ellipse(x, y, 0.17, 0.15, 0, Math.PI, 0); g.closePath(); fs(g, p.helm);
    box(g, x - 0.25, y - 0.025, 0.5, 0.06, 0.03, p.helmL);
  } else {
    poly(g, [[x - 0.03, y - 0.15], [x, y - 0.3], [x + 0.03, y - 0.15]], p.steel);
    g.beginPath(); g.ellipse(x, y, 0.18, 0.17, 0, Math.PI, 0); g.lineTo(x + 0.2, y + 0.03); g.lineTo(x - 0.22, y + 0.07); g.closePath(); fs(g, p.helm);
    plain(g, x - 0.1, y - 0.11, 0.2, 0.03, p.helmL);
  }
}
function head(g, p, side, x, y) {
  circ(g, x, y, 0.145, p.mask);
  box(g, x + 0.09, y + 0.02, 0.12, 0.1, 0.035, p.steelD);
  circ(g, x + 0.075, y - 0.02, 0.05, p.lens);
  g.fillStyle = 'rgba(255,255,255,0.75)'; g.beginPath(); g.arc(x + 0.06, y - 0.035, 0.016, 0, 7); g.fill();
  helmet(g, p, side, x, y - 0.06);
}
// o: weapon 'rifle'|'grenade'|'flame'|'none', legs, crouch
function soldier(g, p, side, o) {
  o = o || {};
  g.save();
  if (o.crouch) { g.translate(0, 0); g.scale(1, 0.86); }
  if (o.legs !== false) {
    box(g, -0.17, -0.31, 0.15, 0.27, 0.04, p.coatD); box(g, -0.2, -0.085, 0.21, 0.085, 0.03, p.boot);
    box(g, 0.02, -0.31, 0.15, 0.27, 0.04, p.coatD); box(g, 0.01, -0.085, 0.23, 0.085, 0.03, p.boot);
  }
  if (o.weapon === 'flame') { box(g, -0.42, -0.74, 0.2, 0.4, 0.08, p.accent); plain(g, -0.39, -0.6, 0.14, 0.04, OUT); box(g, -0.36, -0.8, 0.08, 0.08, 0.02, p.steelD); }
  else box(g, -0.36, -0.68, 0.18, 0.27, 0.05, p.pack);
  poly(g, [[-0.25, -0.42], [0.24, -0.42], [0.3, -0.14], [-0.31, -0.14]], p.coat);
  plain(g, -0.02, -0.4, 0.035, 0.24, p.coatD);
  box(g, -0.22, -0.7, 0.43, 0.36, 0.1, p.coat);
  plain(g, -0.17, -0.66, 0.07, 0.24, p.coatL);
  plain(g, -0.215, -0.4, 0.42, 0.05, p.boot);
  box(g, -0.045, -0.415, 0.09, 0.08, 0.015, p.steel);
  if (o.weapon === 'grenade') box(g, -0.13, -0.66, 0.3, 0.24, 0.05, p.steelD);
  box(g, -0.225, -0.63, 0.1, 0.07, 0.02, p.accent);
  if (o.weapon === 'rifle') {
    g.save(); g.translate(-0.12, -0.5); g.rotate(-0.12);
    box(g, 0, -0.035, 0.62, 0.07, 0.02, p.wood); box(g, 0.6, -0.02, 0.2, 0.035, 0.01, p.steel);
    g.restore();
    box(g, 0.0, -0.62, 0.27, 0.11, 0.05, p.coatL); circ(g, 0.28, -0.585, 0.05, p.boot);
  } else if (o.weapon === 'grenade') {
    box(g, 0.02, -0.82, 0.11, 0.28, 0.05, p.coatL);
    g.save(); g.translate(0.08, -0.84); g.rotate(0.5);
    box(g, -0.02, -0.26, 0.04, 0.26, 0.01, p.wood); box(g, -0.055, -0.38, 0.11, 0.14, 0.03, p.steelD);
    g.restore();
    circ(g, 0.075, -0.84, 0.05, p.boot);
  } else if (o.weapon === 'flame') {
    box(g, 0.0, -0.6, 0.26, 0.1, 0.05, p.coatL);
    box(g, 0.1, -0.56, 0.5, 0.07, 0.02, p.steelD); box(g, 0.56, -0.585, 0.08, 0.12, 0.02, p.steel);
    g.beginPath(); g.moveTo(0.64, -0.6); g.quadraticCurveTo(0.86, -0.7, 0.98, -0.5); g.quadraticCurveTo(0.84, -0.42, 0.64, -0.46); g.closePath(); fs(g, '#f08a2a');
    g.fillStyle = '#ffe07a'; g.beginPath(); g.ellipse(0.75, -0.53, 0.08, 0.04, 0, 0, 7); g.fill();
    circ(g, 0.27, -0.55, 0.05, p.boot);
  } else {
    box(g, 0.0, -0.6, 0.22, 0.1, 0.05, p.coatL); circ(g, 0.23, -0.55, 0.05, p.boot);
  }
  head(g, p, side, 0.02, -0.82);
  g.restore();
}

function medic(g, p, side) {
  soldier(g, p, side, { weapon: 'none' });
  box(g, -0.02, -0.5, 0.3, 0.26, 0.05, p.cloth);
  g.fillStyle = '#2f7d6d'; g.fillRect(0.1, -0.455, 0.06, 0.17); g.fillRect(0.045, -0.4, 0.17, 0.06);
  box(g, -0.235, -0.66, 0.12, 0.1, 0.02, p.cloth);
  // Laterne
  seg(g, 0.3, -0.56, 0.3, -0.42, 0.03, p.steelD);
  box(g, 0.22, -0.42, 0.16, 0.2, 0.04, '#e8c35a'); plain(g, 0.22, -0.42, 0.16, 0.045, p.steelD);
}
function mortar(g, p, side) {
  g.save(); g.translate(-0.55, 0); soldier(g, p, side, { weapon: 'none', crouch: true }); g.restore();
  box(g, -0.12, -0.09, 0.62, 0.1, 0.03, p.steelD);
  seg(g, 0.34, -0.5, 0.46, -0.04, 0.045, p.steelD); seg(g, 0.34, -0.5, 0.2, -0.04, 0.045, p.steelD);
  g.save(); g.translate(0.02, -0.1); g.rotate(-1.05);
  box(g, 0, -0.085, 0.78, 0.17, 0.05, p.armorD); box(g, 0.7, -0.105, 0.1, 0.21, 0.03, p.steel); plain(g, 0.08, -0.05, 0.5, 0.035, p.armorL);
  g.restore();
  box(g, 0.52, -0.2, 0.2, 0.2, 0.03, p.wood); circ(g, 0.58, -0.24, 0.055, p.steelD); circ(g, 0.67, -0.24, 0.055, p.steelD);
}
function mgTeam(g, p, side) {
  g.save(); g.translate(-0.42, 0.0); soldier(g, p, side, { weapon: 'none', crouch: true }); g.restore();
  seg(g, 0.2, -0.36, 0.02, 0, 0.045, p.steelD); seg(g, 0.2, -0.36, 0.42, 0, 0.045, p.steelD); seg(g, 0.2, -0.36, 0.2, -0.02, 0.04, p.steelD);
  box(g, -0.12, -0.5, 0.26, 0.17, 0.03, p.steelD);
  box(g, 0.1, -0.475, 0.62, 0.12, 0.05, p.steel);
  plain(g, 0.3, -0.455, 0.03, 0.08, p.steelD); plain(g, 0.42, -0.455, 0.03, 0.08, p.steelD); plain(g, 0.54, -0.455, 0.03, 0.08, p.steelD);
  box(g, 0.7, -0.45, 0.14, 0.07, 0.02, p.steelD);
  box(g, 0.12, -0.74, 0.09, 0.5, 0.03, p.armor); plain(g, 0.14, -0.7, 0.025, 0.4, p.armorL);
  box(g, -0.06, -0.33, 0.2, 0.14, 0.03, p.pack);
}
function wheel(g, p, x, y, r) {
  circ(g, x, y, r, p.wood);
  g.save(); g.lineWidth = 0.035; g.strokeStyle = OUT;
  for (let i = 0; i < 4; i++) { const a = i * Math.PI / 4; g.beginPath(); g.moveTo(x - Math.cos(a) * r, y - Math.sin(a) * r); g.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); g.stroke(); }
  g.restore();
  circ(g, x, y, r * 0.28, p.steelD);
}
function gun(g, p, side) {
  g.save(); g.translate(-0.72, 0); soldier(g, p, side, { weapon: 'none' }); g.restore();
  seg(g, -0.05, -0.24, -0.55, -0.02, 0.07, p.wood);
  g.save(); g.translate(0.02, -0.42); g.rotate(-0.22);
  box(g, -0.2, -0.085, 0.95, 0.17, 0.05, p.armorD); box(g, -0.24, -0.11, 0.3, 0.22, 0.05, p.armor);
  box(g, 0.7, -0.1, 0.1, 0.2, 0.03, p.steel);
  g.restore();
  box(g, 0.1, -0.8, 0.1, 0.62, 0.03, p.armor); plain(g, 0.12, -0.76, 0.03, 0.5, p.armorL);
  wheel(g, p, 0.0, -0.24, 0.24);
}
function walker(g, p, side) {
  // Abgasrohre mit Rauch
  g.fillStyle = 'rgba(60,60,55,0.55)';
  for (const [x, y, r] of [[-0.42, -1.92, 0.1], [-0.5, -2.08, 0.13], [-0.4, -2.24, 0.09]]) { g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
  box(g, -0.5, -1.82, 0.1, 0.36, 0.03, p.steelD); box(g, -0.36, -1.76, 0.09, 0.3, 0.03, p.steelD);
  // Beine
  box(g, -0.4, -0.62, 0.26, 0.5, 0.08, p.armorD); box(g, -0.48, -0.17, 0.42, 0.17, 0.06, p.armor);
  box(g, 0.12, -0.62, 0.26, 0.5, 0.08, p.armorD); box(g, 0.06, -0.17, 0.46, 0.17, 0.06, p.armor);
  box(g, -0.36, -0.44, 0.18, 0.12, 0.04, p.steel); box(g, 0.16, -0.44, 0.18, 0.12, 0.04, p.steel);
  // linker Arm (hinten) mit Greifer
  box(g, -0.72, -1.2, 0.24, 0.52, 0.1, p.armorD); box(g, -0.74, -0.74, 0.28, 0.16, 0.05, p.steelD);
  // Rumpf
  box(g, -0.5, -1.5, 1.0, 0.95, 0.24, p.armor);
  box(g, -0.3, -1.38, 0.62, 0.62, 0.12, p.armorL);
  plain(g, -0.3, -1.08, 0.62, 0.05, OUT);
  box(g, -0.08, -1.02, 0.18, 0.4, 0.03, p.accent);
  g.fillStyle = OUT; for (const [x, y] of [[-0.22, -1.3], [0.24, -1.3], [-0.22, -0.84], [0.24, -0.84], [-0.4, -1.1], [0.42, -1.1]]) { g.beginPath(); g.arc(x, y, 0.025, 0, 7); g.fill(); }
  // Schultern
  circ(g, -0.52, -1.36, 0.25, p.armorD); circ(g, 0.5, -1.36, 0.25, p.armorD);
  g.save(); g.beginPath(); g.arc(0.5, -1.36, 0.25, 0, 7); g.clip(); plain(g, 0.2, -1.42, 0.6, 0.09, p.accent); plain(g, 0.2, -1.31, 0.6, 0.04, '#e9e2cf'); g.restore();
  g.beginPath(); g.arc(0.5, -1.36, 0.25, 0, 7); g.stroke();
  // Kanonenarm
  box(g, 0.42, -1.14, 0.3, 0.3, 0.08, p.armor);
  box(g, 0.62, -1.08, 0.62, 0.18, 0.05, p.steelD); box(g, 1.16, -1.11, 0.12, 0.24, 0.03, p.steel);
  // Kopf
  box(g, -0.17, -1.72, 0.36, 0.3, 0.1, p.armorD);
  box(g, -0.04, -1.63, 0.26, 0.07, 0.02, p.lens);
  poly(g, [[-0.03, -1.72], [0.01, -1.9], [0.05, -1.72]], p.steel);
}
function horse(g, p, side) {
  seg(g, -0.42, -0.5, -0.5, -0.02, 0.09, p.horseD); seg(g, 0.3, -0.5, 0.38, -0.02, 0.09, p.horseD);
  seg(g, -0.3, -0.5, -0.3, -0.02, 0.1, p.horse); seg(g, 0.42, -0.5, 0.5, -0.04, 0.1, p.horse);
  g.beginPath(); g.moveTo(-0.5, -0.74); g.quadraticCurveTo(-0.78, -0.7, -0.74, -0.32); g.quadraticCurveTo(-0.62, -0.5, -0.5, -0.6); g.closePath(); fs(g, p.horseD);
  g.beginPath(); g.ellipse(0, -0.62, 0.56, 0.25, 0, 0, 7); fs(g, p.horse);
  poly(g, [[0.32, -0.76], [0.56, -1.14], [0.78, -1.06], [0.6, -0.56]], p.horse);
  box(g, 0.5, -1.24, 0.42, 0.24, 0.09, p.horse);
  box(g, 0.76, -1.16, 0.24, 0.2, 0.06, p.mask); circ(g, 0.66, -1.15, 0.045, p.lens);
  poly(g, [[0.52, -1.24], [0.56, -1.4], [0.64, -1.24]], p.horseD);
  box(g, -0.3, -0.86, 0.5, 0.2, 0.05, p.pack);
}
function cavalry(g, p, side) {
  horse(g, p, side);
  seg(g, -0.5, -0.86, 1.0, -1.74, 0.045, p.wood);
  poly(g, [[0.72, -1.6], [0.6, -1.86], [0.9, -1.72]], p.accent);
  poly(g, [[0.98, -1.76], [1.14, -1.84], [1.03, -1.7]], p.steel);
  box(g, -0.14, -0.72, 0.16, 0.36, 0.05, p.coatD); box(g, -0.16, -0.42, 0.24, 0.09, 0.03, p.boot);
  g.save(); g.translate(-0.06, -0.52); soldier(g, p, side, { weapon: 'none', legs: false }); g.restore();
}

const KIND = { inf: 'inf', mg: 'mg', art: 'art', walker: 'walker', cav: 'cav', storm: 'storm', flame: 'flame' };
// Maße je Figur in Soldatenhöhen: [links, rechts, oben]
const BOX = { medic: [0.55, 0.6, 1.25], mortar: [1.05, 0.85, 1.25], inf: [0.55, 0.85, 1.25], storm: [0.55, 0.6, 1.4], flame: [0.6, 1.1, 1.25], mg: [1.0, 1.0, 1.25], art: [1.25, 1.0, 1.25], walker: [0.95, 1.45, 2.45], cav: [0.95, 1.3, 1.95] };

function drawFigure(g, kind, side) {
  const p = PAL[side];
  g.lineWidth = 0.05; g.lineJoin = 'round'; g.strokeStyle = OUT;
  if (kind === 'inf') soldier(g, p, side, { weapon: 'rifle' });
  else if (kind === 'storm') soldier(g, p, side, { weapon: 'grenade' });
  else if (kind === 'flame') soldier(g, p, side, { weapon: 'flame' });
  else if (kind === 'mg') mgTeam(g, p, side);
  else if (kind === 'art') gun(g, p, side);
  else if (kind === 'walker') walker(g, p, side);
  else if (kind === 'cav') cavalry(g, p, side);
  else if (kind === 'medic') medic(g, p, side);
  else if (kind === 'mortar') mortar(g, p, side);
}

const cache = new Map();
// Liefert { cv, ox, oy }: Füße liegen bei (ox, oy). h = Höhe eines Soldaten in Pixeln.
function sprite(kind, side, flip, h) {
  h = Math.max(6, Math.round(h));
  const k = kind + side + (flip ? 1 : 0) + '_' + h;
  let s = cache.get(k);
  if (s) return s;
  const [l, r, t] = BOX[kind], pad = 0.08;
  const left = (flip ? r : l) + pad, right = (flip ? l : r) + pad;
  const cv = document.createElement('canvas');
  cv.width = Math.ceil((left + right) * h); cv.height = Math.ceil((t + 0.12) * h);
  const g = cv.getContext('2d');
  const ox = left * h, oy = (t + 0.04) * h;
  g.translate(ox, oy); g.scale(flip ? -h : h, h);
  drawFigure(g, kind, side);
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.globalCompositeOperation = 'source-atop';
  const W = cv.width, H = cv.height;
  let gr = g.createLinearGradient(flip ? W : 0, 0, flip ? 0 : W, H);
  gr.addColorStop(0, 'rgba(255,236,190,0.20)'); gr.addColorStop(0.45, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(8,6,4,0.52)');
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  gr = g.createLinearGradient(0, oy - 0.42 * h, 0, oy);
  gr.addColorStop(0, 'rgba(58,44,28,0)'); gr.addColorStop(1, 'rgba(58,44,28,0.72)');
  g.fillStyle = gr; g.fillRect(0, oy - 0.42 * h, W, 0.5 * h);
  let seed = kind.length * 977 + (side === 'A' ? 13 : 71);
  const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  for (let i = 0; i < Math.round(W * H / 90); i++) {
    g.fillStyle = rnd() < 0.5 ? 'rgba(20,14,8,0.22)' : rnd() < 0.5 ? 'rgba(120,70,36,0.2)' : 'rgba(230,220,190,0.08)';
    const r = h * (0.008 + rnd() * 0.022); g.beginPath(); g.arc(rnd() * W, rnd() * H, r, 0, 7); g.fill();
  }
  g.globalCompositeOperation = 'source-over';
  s = { cv, ox, oy };
  cache.set(k, s);
  return s;
}

const FIG = { PAL, OUT, KIND, BOX, sprite, drawFigure };
if (typeof module !== 'undefined' && module.exports) module.exports = FIG; else root.FIG = FIG;
})(this);
