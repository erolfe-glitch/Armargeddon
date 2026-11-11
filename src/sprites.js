// ===== ARMARGEDDON PIXEL-FIGUREN =====
// Alle Figuren sind hier als Pixel-Raster gezeichnet (eigene Grafik, nach rechts blickend).
(function (root) {
'use strict';

const PAL = {
  A: { // Konkordat von Valmor: Rostmäntel, Krempenhelm, grüne Linsen
    k: '#140e0a', h: '#5b4a2e', H: '#8f7a4c', m: '#2d2620', l: '#9dff6e', t: '#3a3128',
    c: '#7c4a2a', C: '#a86a3c', d: '#4f2e1b', b: '#2e2117', w: '#5a3d22', s: '#b9b4a6',
    g: '#241a12', f: '#9e3a22', e: '#e8c070', ring: '#d88a3a'
  },
  D: { // Aschenwacht des Grauwalls: Aschgrau, Spitzhelm, rote Linsen
    k: '#0c0d0f', h: '#33373d', H: '#6b727b', m: '#1f2226', l: '#ff4f3a', t: '#2a2d31',
    c: '#555b62', C: '#7d848c', d: '#363a40', b: '#1c1d20', w: '#4a3826', s: '#c4c7cb',
    g: '#18191b', f: '#3a4a5e', e: '#d9dde2', ring: '#5ea4dc'
  }
};

const ART = {
  infA: [
    '....kkk....',
    '...kHHhk...',
    '.kkhhhhhkk.',
    '...kmmlk...',
    '...kmtmk..s',
    '..kccbcc.ks',
    '.kdcCbcwwk.',
    '.kdcCcwwk..',
    '.kdcbbwk...',
    '.kdccbck...',
    '.kdcCcck...',
    '.kdcc.ck...',
    '..kd..dk...',
    '..kg..gk...',
    '.kgg..ggk..'
  ],
  infD: [
    '.....k.....',
    '.....H.....',
    '....kHhk...',
    '...khhhhk..',
    '...khmmlk..',
    '...kmtmk..s',
    '..kccbcc.ks',
    '.kdcCbcwwk.',
    '.kdcCcwwk..',
    '.kdcbbwk...',
    '.kdccbck...',
    '.kdcCcck...',
    '.kdcccck...',
    '..kg..gk...',
    '.kgg..ggk..'
  ],
  mgA: [
    '..kkk...........',
    '.kHHhk..........',
    'kkhhhkk.........',
    '.kmmlk..........',
    '.kmtmk...kk.....',
    'kdccbckkkhhkkk..',
    'kdcCbkssssssssk.',
    'kdccbkkhkkkkkkss',
    '.kdcck.k.k......',
    '.kgggk.k..k.....',
    'kgg.gk.k...k....'
  ],
  mgD: [
    '...k............',
    '...H............',
    '..kHhk..........',
    '.khmmlk.........',
    '.kmtmk...kk.....',
    'kdccbckkkhhkkk..',
    'kdcCbkssssssssk.',
    'kdccbkkhkkkkkkss',
    '.kdcck.k.k......',
    '.kgggk.k..k.....',
    'kgg.gk.k...k....'
  ],
  banner: [
    'wfffff',
    'wfeeff',
    'wfeeff',
    'wffff.',
    'wfff..',
    'wf....',
    'w.....',
    'w.....',
    'w.....',
    'w.....',
    'w.....',
    'w.....'
  ],
  tree1: [
    '...k.....',
    '...k..k..',
    '.k.kk.k..',
    '..kkbkk..',
    '...kb....',
    '...kbk...',
    '...kb....',
    '..kkbk...',
    '...kb....',
    '...kbk...',
    '..kkbkk..',
    '.kkkbkkk.'
  ],
  tree2: [
    '....k..',
    '..k.k..',
    '...kk.k',
    '...kbk.',
    '..kkb..',
    '...kb..',
    '...kbk.',
    '..kkbk.',
    '.kkkbkk'
  ],
  stump: [
    '.k.k.',
    '.kbk.',
    'kkbkk'
  ],
  wall1: [
    '..o.........',
    '.oO.....o...',
    '.ooO...oo...',
    'ooOoo.ooOo..',
    'oOooOoooOoo.',
    'ooOooOooOooo',
    'OooOooOooOoO'
  ],
  wall2: [
    '.......o..',
    'o.....oo..',
    'oO...ooOo.',
    'ooOooOooo.',
    'OooOooOooO'
  ],
  flag: [
    'wfff.',
    'wffff',
    'wfff.',
    'w....',
    'w....',
    'w....',
    'w....',
    'k....'
  ]
};

const PROP_PAL = { k: '#16110d', b: '#4a3a29', o: '#7d756b', O: '#4c4740', w: '#2a2018' };

function build(rows, pal, flip) {
  const h = rows.length, w = Math.max(...rows.map(r => r.length));
  const cv = (typeof document !== 'undefined') ? document.createElement('canvas') : null;
  if (!cv) return null;
  cv.width = w; cv.height = h;
  const x = cv.getContext('2d');
  for (let r = 0; r < h; r++) for (let c = 0; c < rows[r].length; c++) {
    const ch = rows[r][c];
    if (ch === '.' || ch === ' ') continue;
    const col = pal[ch]; if (!col) continue;
    x.fillStyle = col;
    x.fillRect(flip ? w - 1 - c : c, r, 1, 1);
  }
  return cv;
}

// Erzeugt alle Figuren; Ergebnis: S[name][side][0=rechts,1=links]
function makeSprites(flagColors) {
  const S = {};
  for (const side of ['A', 'D']) {
    const pal = PAL[side];
    const add = (name, rows, p) => { S[name] = S[name] || {}; S[name][side] = [build(rows, p || pal, false), build(rows, p || pal, true)]; };
    add('inf', side === 'A' ? ART.infA : ART.infD);
    add('mg', side === 'A' ? ART.mgA : ART.mgD);
    add('banner', ART.banner);
    add('flag', ART.flag, Object.assign({}, PROP_PAL, { f: (flagColors || {})[side] || pal.ring }));
  }
  for (const n of ['tree1', 'tree2', 'stump', 'wall1', 'wall2']) S[n] = [build(ART[n], PROP_PAL, false), build(ART[n], PROP_PAL, true)];
  return S;
}

const SPR = { PAL, ART, makeSprites };
if (typeof module !== 'undefined' && module.exports) module.exports = SPR; else root.SPR = SPR;
})(this);
