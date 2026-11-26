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
  flach: [...[1, 2, 3, 4, 5, 6, 7, 8].map(k => 'flach_details_' + k), ...[1, 2, 3, 4].map(k => 'graben_sohle_rost_' + k), ...[1, 2, 3].map(k => 'graben_pfuetze_' + k), 'trichter_gross_1', 'furt_schnee', 'krater_schnee_1', 'krater_schnee_2', 'brand_schnee', 'ufer_flach_1', 'ufer_flach_2', 'ufer_flach_3'],
  wand: ['graben_sohle', 'graben_kante_vorn', 'graben_kante_hinten', 'ruine_hinten', 'ruine_vorn', 'barrikade', 'wald_unterholz',
    'kirche_hinten', 'kirche_vorn', 'mauer_niedrig', 'zaun', 'zaun_schnee', 'ufer_schnee', 'unterholz_schnee', 'graben_brustwehr', 'graben_rueckwall', 'hecke_schnee_1', 'hecke_schnee_2', ...[1, 2, 3].map(k => 'graben_lippe_' + k), ...[1, 2, 3].map(k => 'graben_wand_innen_' + k), ...[1, 2, 3].map(k => 'graben_wand_seite_' + k), ...[1, 2, 3].map(k => 'graben_wand_seite_breit_' + k), 'graben_brustwehr_wall_1', 'graben_brustwehr_wall_2'],   /* G7b-Test: Erdlippe und Innenwand */   // Sankt Ruß (2026-11-19): Kirchenmauer hoch/niedrig, Bruchsteinmauer (Friedhof, Gärten)
  stand: [...[1, 2, 3, 4].map(k => 'ruine_ecken_' + k), ...[1, 2, 3].map(k => 'graben_querwand_tief_' + k), ...[1, 2, 3, 4].map(k => 'graben_querwand_block_' + k), ...[1, 2, 3, 4].map(k => 'graben_lippe_ecke_' + k), 'bunker_1', 'bunker_2',
    ...['wald_staemme', 'wald_staemme_b'].flatMap(b => [1, 2, 3, 4].map(k => `${b}_${k}`)),
    ...['stuempfe', 'stuempfe_b', 'stuempfe_c'].flatMap(b => [1, 2, 3, 4].map(k => `${b}_${k}`)),
    ...['truemmer', 'truemmer_b', 'truemmer_c', 'truemmer_d'].flatMap(b => [1, 2, 3, 4].map(k => `${b}_${k}`)),
    ...[1, 2, 3, 4].map(k => 'panzersperren_' + k), 'panzersperren_b_4', ...[1, 2, 3, 4].map(k => 'draht_stuecke_' + k), ...[1, 2, 3, 4].map(k => 'draht_pfahl_' + k), ...['schraeg_1', 'schraeg_2', 'schraeg_3', 'kaputt', 'tiefe', 'ende', 'quer_1', 'quer_2'].map(n => 'drahtguertel_' + n), ...[1, 2, 3, 4].map(k => 'sperre_weg_' + k), 'muehle_heil', 'muehle_kaputt', 'muehle_heil_schnee', 'muehle_kaputt_schnee', 'wrack_1', 'wrack_2', 'wrack_schnee_1', 'wrack_schnee_2', ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map(k => 'festung_' + k),
    'kirchturm_1', 'kirchturm_2', ...['kirche_innen', 'friedhof', 'dorf_aufsteller'].flatMap(b => [1, 2, 3, 4].map(k => `${b}_${k}`)),
    // Krähenfurt (2026-11-22, Flux): Winter-Bausteine, nur mit cfg.winter benutzt
    ...[1, 2, 3, 4].map(k => 'haus_heil_' + k), 'kapelle', 'kapelle_ruine', 'haus_ruine_schnee_1', 'haus_ruine_schnee_2', ...[1, 2, 3, 4].map(k => 'tanne_schnee_' + k),
    'baum_tot_schnee_1', 'baum_tot_schnee_2', 'bruecke_stein_hinten', 'bruecke_stein_vorn', 'brunnen_schnee', 'holzstapel_1', 'holzstapel_2', 'karren_schnee', 'schilf',
    ...[1, 2, 3, 4, 5].map(k => 'heuhaufen_schnee_' + k), 'vogelscheuche_schnee', 'pflug_schnee',   // G3b (2026-11-25): Feldteile des Beraters (Hecke steht bei den Wandstücken)
    ...[1, 2, 3, 4, 5, 6].map(k => 'graben_querwand_' + k), ...[1, 2, 3, 4].map(k => 'graben_ecke_' + k), 'graben_leiter_1', 'graben_leiter_2', 'graben_unterstand', 'graben_stahlschild_1', 'graben_stahlschild_2',
    ...['kiste', 'kisten', 'kanister', 'balken', 'drahtrolle', 'einsturz', 'eimer', 'spaten'].map(n => 'graben_' + n)],   // G2b (2026-11-25): Grabenteile des Beraters (nur Feuergräben mit Buchten)   // G3a (2026-11-25): Feldteile – erscheinen, sobald der Berater sie geliefert hat   // Draht nur noch aus ganzen Stücken (2026-11-16)   // panzersperren_b_1–3 sind gleich wie panzersperren_1–3
};
const NAMEN = [...LISTE.tex, ...LISTE.flach, ...LISTE.wand, ...LISTE.stand];

async function bilder(quelle) {
  const IM = {};
  await Promise.all(NAMEN.map(async n => { const q = quelle(n); IM[n] = q ? await load(q) : null; }));   // G3a: noch nicht gelieferte Bilder gar nicht erst laden
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
const MUEHLE_GROSS = 1.5;   // G6b: Windmühle als Landmarke 1,5× (heil und eingestürzt gleich; verdeckt sie Figuren dahinter, wird sie durchsichtig wie andere hohe Teile)
function schneeAuflage(im) {   // G6b (2026-11-25): Koloss-Wrack im Schnee – Schneekappen auf allen Oberkanten, gemalte Schneeflecken verbreitert, leichter Reif
  if (!im) return im; const key = 'auflage'; if (!SCHNEE.has(key)) SCHNEE.set(key, new Map()); const C = SCHNEE.get(key); if (C.has(im)) return C.get(im);
  const W = im.naturalWidth || im.width, H = im.naturalHeight || im.height, c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d'); x.drawImage(im, 0, 0); const id = x.getImageData(0, 0, W, H), d = id.data, f = new Float32Array(W * H), k0 = Math.max(3, H * 0.035);
  for (let i = 0; i < W * H; i++) { const r = d[i * 4], g = d[i * 4 + 1], b = d[i * 4 + 2]; if (d[i * 4 + 3] > 90 && r + g + b > 480 && Math.max(r, g, b) - Math.min(r, g, b) < 40) f[i] = 1; }   // gemalter Schnee
  const g2 = new Float32Array(f); for (let py = 0; py < H; py++) for (let px = 0; px < W; px++) { const i = py * W + px; if (!f[i]) continue; for (let dy = -2; dy <= 3; dy++) for (let dx = -4; dx <= 4; dx++) { const j = (py + dy) * W + px + dx; if (py + dy >= 0 && py + dy < H && px + dx >= 0 && px + dx < W) g2[j] = Math.max(g2[j], 0.85 - 0.08 * (Math.abs(dx) + Math.max(0, dy) * 1.5)); } }
  for (let px = 0; px < W; px++) { const k = k0 * (0.6 + 0.4 * Math.abs(Math.sin(px * 0.13) * Math.sin(px * 0.041 + 1))); let tief = 99;
    for (let py = 0; py < H; py++) { const i = py * W + px; if (d[i * 4 + 3] < 90) { tief = 0; continue; }
      const lum = (d[i * 4] + d[i * 4 + 1] + d[i * 4 + 2]) / 3, oben = py > 2 && (d[((py - 3) * W + px) * 4] + d[((py - 3) * W + px) * 4 + 1] + d[((py - 3) * W + px) * 4 + 2]) / 3 < lum - 45 ? 0.7 : 0;   // Kante dunkel → hell = Oberseite eines Blechs
      if (tief < k) g2[i] = Math.max(g2[i], 0.92 * Math.pow(1 - tief / k, 0.6)); g2[i] = Math.max(g2[i], oben); tief++; } }
  for (let i = 0; i < W * H; i++) { if (d[i * 4 + 3] < 90) continue; const s = Math.min(1, g2[i]), lum = (d[i * 4] + d[i * 4 + 1] + d[i * 4 + 2]) / 3, ziel = [222, 228, 236].map(v => v * (0.82 + 0.18 * lum / 255));
    for (let q = 0; q < 3; q++) { let v = d[i * 4 + q]; v += (ziel[q] - v) * s; v += ([200, 206, 216][q] - v) * 0.12 * (1 - s); d[i * 4 + q] = v; } }   // Rest: leichter Reif
  x.putImageData(id, 0, 0); C.set(im, c); return c;
}
function erdig(im) {   // G6b (2026-11-25): Betonhöcker dunkler und erdiger (graue, helle Flächen wie verschmutzter Beton, unten mehr Erde)
  if (!im) return im; const key = 'erdig'; if (!SCHNEE.has(key)) SCHNEE.set(key, new Map()); const C = SCHNEE.get(key); if (C.has(im)) return C.get(im);
  const W = im.naturalWidth || im.width, H = im.naturalHeight || im.height, c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d'); x.drawImage(im, 0, 0); const id = x.getImageData(0, 0, W, H), d = id.data;
  for (let py = 0; py < H; py++) { const unten = Math.max(0, (py / H - 0.45) / 0.55); for (let px = 0; px < W; px++) { const i = (py * W + px) * 4; if (d[i + 3] < 10) continue;
    const r = d[i], g = d[i + 1], b = d[i + 2], grau = 1 - Math.min(1, (Math.max(r, g, b) - Math.min(r, g, b)) / 110), m = 0.5 - 0.1 * unten, w = 0.35 + 0.65 * grau;
    d[i] = r + (r * m * 1.1 + 8 - r) * w; d[i + 1] = g + (g * m * 0.98 + 4 - g) * w; d[i + 2] = b + (b * m * 0.78 - b) * w; } }
  x.putImageData(id, 0, 0); C.set(im, c); return c;
}
const KLEIN = new Map();
function verkleinert(im, h) {   // G7b-Test (2026-11-25): stufenweise halbieren bis knapp über Zielhöhe (sonst flimmert ein flach ins Weltbild gelegter Streifen grau)
  if (!im) return im; const H0 = im.naturalHeight || im.height; if (H0 <= h * 1.5) return im;
  if (!KLEIN.has(im)) KLEIN.set(im, new Map()); const C = KLEIN.get(im), hk = Math.round(h); if (C.has(hk)) return C.get(hk);
  let src = im, w0 = im.naturalWidth || im.width, h0 = H0;
  while (h0 / 2 >= h) { const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(w0 / 2)); c.height = Math.max(1, Math.round(h0 / 2)); const x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(src, 0, 0, c.width, c.height); src = c; w0 = c.width; h0 = c.height; }
  C.set(hk, src); return src;
}
function lippeBild(im, h) {   // G7b-Test: Erdlippe – verkleinert, Farbe an den Kartenboden angewärmt, oberer Bodenteil läuft weich aus (Boden der Karte scheint durch)
  const v = verkleinert(im, h); if (!v) return v; if (!KLEIN.has('lippe')) KLEIN.set('lippe', new Map()); const C = KLEIN.get('lippe'); if (C.has(v)) return C.get(v);
  const c = document.createElement('canvas'); c.width = v.width || v.naturalWidth; c.height = v.height || v.naturalHeight; const x = c.getContext('2d');
  x.filter = 'sepia(0.45) saturate(1.25) brightness(1.05)'; x.drawImage(v, 0, 0); x.filter = 'none';
  const g = x.createLinearGradient(0, 0, 0, c.height); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.42, 'rgba(0,0,0,0.85)'); g.addColorStop(0.6, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,1)');
  x.globalCompositeOperation = 'destination-in'; x.fillStyle = g; x.fillRect(0, 0, c.width, c.height); C.set(v, c); return c;
}
function gebacken(im, art) {   // G7b voll (2026-11-25): liegende Grabenteile einmal vorbereiten (keine Filter beim Zeichnen): Lippe/Seitenwand – Bodenteil oben läuft weich in den Kartenboden aus, Farbe angewärmt; Seitenwand unten nachgedunkelt
  if (!im) return im; if (!KLEIN.has(art)) KLEIN.set(art, new Map()); const C = KLEIN.get(art); if (C.has(im)) return C.get(im);
  if (im.complete === false || (im.naturalWidth === 0 && !(im instanceof HTMLCanvasElement))) return null;   // noch nicht geladen: nicht leer vorbereiten und merken
  if (art === 'nah') {   // vordere Kante: Abbruch ist von oben nicht zu sehen – nur der Bodenteil, umgedreht (Krümelrand zum Graben), außen weich in den Boden
    const W0 = im.naturalWidth || im.width, H0 = im.naturalHeight || im.height, h = Math.round(H0 * 0.55), c = document.createElement('canvas'); c.width = W0; c.height = h; const x = c.getContext('2d');
    x.filter = 'sepia(0.3) saturate(1.05) brightness(0.76) contrast(1.3)'; x.translate(0, h); x.scale(1, -1); x.drawImage(im, 0, 0, W0, h, 0, 0, W0, h); x.setTransform(1, 0, 0, 1, 0, 0); x.filter = 'none';
    { const d = x.createLinearGradient(0, h * 0.8, 0, h); d.addColorStop(0, 'rgba(0,0,0,0)'); d.addColorStop(1, 'rgba(12,8,5,0.6)'); x.globalCompositeOperation = 'source-atop'; x.fillStyle = d; x.fillRect(0, 0, W0, h); }   // G7c: Kante zum Graben dunkler
    const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.5, 'rgba(0,0,0,0.9)'); g.addColorStop(1, 'rgba(0,0,0,1)'); x.globalCompositeOperation = 'destination-in'; x.fillStyle = g; x.fillRect(0, 0, W0, h);
    const mip = [c]; let q = c; while (q.height > 12) { const n = document.createElement('canvas'); n.width = Math.max(1, Math.round(q.width / 2)); n.height = Math.max(1, Math.round(q.height / 2)); const y = n.getContext('2d'); y.imageSmoothingQuality = 'high'; y.drawImage(q, 0, 0, n.width, n.height); mip.push(n); q = n; }
    C.set(im, mip); return mip; }
  const c = document.createElement('canvas'); c.width = im.naturalWidth || im.width; c.height = im.naturalHeight || im.height; const x = c.getContext('2d');
  x.filter = art === 'brust' ? 'sepia(0.45) saturate(0.75) brightness(0.64) contrast(1.15)' : art === 'lippe' ? 'sepia(0.5) saturate(0.95) brightness(0.74) contrast(1.28)' : 'sepia(0.3) saturate(1.0) brightness(0.64) contrast(1.1)';   /* G7e: Seitenwand dunkler (heller Fleck am Bodenstreifen) */ x.drawImage(im, 0, 0); x.filter = 'none';   /* G7c: Lippe mehr Kontrast, Sandsackwall dunkel und erdig */   // an den dunkleren Kartenboden angeglichen
  if (art === 'lippe') { const d = x.createLinearGradient(0, c.height * 0.55, 0, c.height); d.addColorStop(0, 'rgba(0,0,0,0)'); d.addColorStop(0.35, 'rgba(14,9,6,0.35)'); d.addColorStop(1, 'rgba(8,5,3,0.75)'); x.globalCompositeOperation = 'source-atop'; x.fillStyle = d; x.fillRect(0, 0, c.width, c.height); x.globalCompositeOperation = 'source-over'; }   // G7c: Bruchkante zum Graben kräftig dunkel
  if (art === 'brust') { x.globalCompositeOperation = 'source-atop'; for (let k = 0; k < 60; k++) { const px = (k * 97.3 % 1) * c.width, py = c.height * (0.15 + ((k * 0.618) % 1) * 0.8); x.fillStyle = k % 3 ? 'rgba(58,44,32,0.35)' : 'rgba(40,30,22,0.45)'; x.beginPath(); x.ellipse((px * 7.7 + k * 131) % c.width, py, c.height * (0.12 + (k % 5) * 0.05), c.height * (0.05 + (k % 3) * 0.03), 0, 0, 7); x.fill(); } x.globalCompositeOperation = 'source-over'; }   // G7c: Erde und Schmutz über den Säcken
  if (art === 'seite') { const d = x.createLinearGradient(0, c.height * 0.4, 0, c.height); d.addColorStop(0, 'rgba(0,0,0,0)'); d.addColorStop(1, 'rgba(10,7,5,0.72)'); x.globalCompositeOperation = 'source-atop'; x.fillStyle = d; x.fillRect(0, 0, c.width, c.height); }
  if (art !== 'brust') { const ob = art === 'seite' ? 0.42 : 0.42, g = x.createLinearGradient(0, 0, 0, c.height); g.addColorStop(0, 'rgba(0,0,0,0)'); if (art === 'seite') g.addColorStop(0.2, 'rgba(0,0,0,0)'); g.addColorStop(ob, 'rgba(0,0,0,0.85)'); g.addColorStop(ob + 0.18, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,1)');
    x.globalCompositeOperation = 'destination-in'; x.fillStyle = g; x.fillRect(0, 0, c.width, c.height); }
  const mip = [c]; let q = c; while (q.height > 12) { const n = document.createElement('canvas'); n.width = Math.max(1, Math.round(q.width / 2)); n.height = Math.max(1, Math.round(q.height / 2)); const y = n.getContext('2d'); y.imageSmoothingQuality = 'high'; y.drawImage(q, 0, 0, n.width, n.height); mip.push(n); q = n; }
  C.set(im, mip); return mip;   // Stufen zum Verkleinern (aus der Ferne kein Flimmern)
}
function bodenSink(im, anteil = 0.1) {   // Punkt 79.3 (2026-11-25): Hindernisse sitzen im Boden – unterster Rand läuft weich aus (Füße eingesunken statt aufgeklebt)
  if (!im) return im; if (!KLEIN.has('sink')) KLEIN.set('sink', new Map()); const C = KLEIN.get('sink'); if (C.has(im)) return C.get(im);
  if (im.complete === false || (im.naturalWidth === 0 && !(im instanceof HTMLCanvasElement))) return im;
  const c = document.createElement('canvas'); c.width = im.naturalWidth || im.width; c.height = im.naturalHeight || im.height; const x = c.getContext('2d'); x.drawImage(im, 0, 0);
  const g = x.createLinearGradient(0, 0, 0, c.height); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1 - anteil, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0.05)');
  x.globalCompositeOperation = 'destination-in'; x.fillStyle = g; x.fillRect(0, 0, c.width, c.height); C.set(im, c); return c;   // ganze Fläche (destination-in löscht alles außerhalb)
}
function vorgefiltert(im, flt) {   // G7d (Leistung): Canvas-Filter einmal vorrechnen statt bei jedem Bild
  if (!im) return im; const k = 'f:' + flt; if (!KLEIN.has(k)) KLEIN.set(k, new Map()); const C = KLEIN.get(k); if (C.has(im)) return C.get(im);
  if (im.complete === false || (im.naturalWidth === 0 && !(im instanceof HTMLCanvasElement))) return im;
  const c = document.createElement('canvas'); c.width = im.naturalWidth || im.width; c.height = im.naturalHeight || im.height; const x = c.getContext('2d'); x.filter = flt; x.drawImage(im, 0, 0); C.set(im, c); return c;
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
  if (cfg.teileAlt) { IM = { ...IM }; for (const n of NAMEN) if (/^(graben_(querwand|ecke|leiter|unterstand|stahlschild|kiste|kanister|balken|drahtrolle|einsturz|eimer|spaten|brustwehr|rueckwall|sohle_rost|pfuetze)|hecke_schnee|heuhaufen|vogelscheuche|pflug)/.test(n)) IM[n] = null; }   // G2b/G3b-Rückweg (window.GTEILE_ALT): Stand ohne die gemalten Teile vom 25.11.
  // Winterkarten (Krähenfurt, 2026-11-22): Schneeboden statt Schlamm/Gras/Waldboden, Eis statt Wasser, verschneite Zäune, Unterholz, Brunnen und Karren;
  // Häuser, Kapelle, Tannen, Steinbrücke, Ufer und Acker eigene Zweige (winterFeld). Fehlt der Schneeboden, bleibt alles wie bisher.
  const WI = !!cfg.winter && !!IM.boden_schnee;
  if (!window.ORTE_ALT && !window.G6B_ALT) { IM = { ...IM }; for (const n of ['panzersperren_2', 'panzersperren_b_2']) if (IM[n]) IM[n] = erdig(IM[n]); if (WI) for (const n of ['wrack_schnee_1', 'wrack_schnee_2']) if (IM[n]) IM[n] = schneeAuflage(IM[n]); }   // G6b: Betonhöcker erdig, Wrack verschneit (Rückweg G6B_ALT)
  if (WI) { const ali = { boden_schlamm: IM.boden_schnee_rein_1 ? 'boden_schnee_rein_1' : 'boden_schnee', boden_wasser: 'boden_eis', wald_unterholz: 'unterholz_schnee', zaun: 'zaun_schnee', dorf_aufsteller_1: 'brunnen_schnee', dorf_aufsteller_3: 'karren_schnee' };
    IM = { ...IM }; for (const k in ali) if (IM[ali[k]]) IM[k] = IM[ali[k]];
    if (cfg.schneeKante !== false) { for (const [n, a, mp] of [['graben_kante_vorn', 0.14], ['graben_kante_hinten', 0.12], ['barrikade', 0.1], ['bunker_1', 0.05], ['bunker_2', 0.05], ...[1, 2, 3, 4].map(k => ['draht_stuecke_' + k, 0.012, 2]), ...[1, 2, 3, 4].map(k => ['panzersperren_' + k, 0.05])]) if (IM[n]) IM[n] = schneeKante(IM[n], a, mp); } }
  const KIPP = cfg.kipp ?? 1;   // schräge Wandstücke kippen (Stärke, 0 = aus)
  const AO = cfg.ao || 0;   // Kantenverdeckung: dunkler, weicher Saum, wo Graben, Wälle und Befestigungen auf den flachen Boden treffen
  const pool = pre => LISTE.stand.filter(n => n.startsWith(pre)).map(n => IM[n]).filter(Boolean);
  const PFAEHLE = pool('draht_pfahl'), DRAHT = pool('draht_stuecke'), SPERREN = pool('panzersperren'), STAEMME = pool('wald_staemme'), STUEMPFE = pool('stuempfe'), TRUEMMER = pool('truemmer'), BUNKER = [IM.bunker_1, IM.bunker_2];
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
  if (WI && cfg.ackerNeu) { const AF0 = felder((t, c, r) => inMap(c, r) && t === 'garten'); if (AF0.length) {
    const A = cfg.ackerNeu === true ? {} : cfg.ackerNeu;
    const grp = [], seen = new Set(); for (const f of AF0) { const k0 = f[0] + ',' + f[1]; if (seen.has(k0)) continue; const g0 = [], q = [f]; seen.add(k0); while (q.length) { const [c, r] = q.pop(); g0.push([c, r]); for (const [nc, nr] of nbrs(c, r)) { const k = nc + ',' + nr; if (!seen.has(k) && inMap(nc, nr) && terr(nc, nr) === 'garten') { seen.add(k); q.push([nc, nr]); } } } grp.push(g0); }   // G3a: zusammenhängende Äcker
    w.save(); w.filter = `blur(${R * 0.3}px)`; w.fillStyle = `rgba(246,248,250,${A.rain ?? 0.35})`; for (const [c, r] of AF0) jitterHex(w, ...hexC(c, r), 1.12); w.restore();   // Schneewehe am Feldrain
    grp.forEach((AF, gi) => {
    m.setTransform(1, 0, 0, 1, 0, 0); m.clearRect(0, 0, WW, WH); m.filter = `blur(${R * 0.22}px)`; m.fillStyle = '#fff'; for (const [c, r] of AF) jitterHex(m, ...hexC(c, r), 0.92); m.filter = 'none';
    l.globalCompositeOperation = 'source-over'; l.setTransform(1, 0, 0, 1, 0, 0); l.clearRect(0, 0, WW, WH);
    const P = AF.map(f => hexC(...f)), x0 = Math.min(...P.map(q => q[0])) - R * 1.5, x1 = Math.max(...P.map(q => q[0])) + R * 1.5, y0 = Math.min(...P.map(q => q[1])) - R * 1.5, y1 = Math.max(...P.map(q => q[1])) + R * 1.5;
    const D = Math.hypot(x1 - x0, y1 - y0) / 2; let sd = 4711; const rr = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
    l.save(); l.translate((x0 + x1) / 2, (y0 + y1) / 2); l.rotate((A.winkel ?? 0.12) + (hrnd(AF[0][0], AF[0][1], 320) - 0.5) * 2 * 0.436); l.lineCap = 'round'; l.lineJoin = 'round';   // G3a: Furchenrichtung je Acker (±25°)
    l.fillStyle = `rgba(96,84,72,${A.grund ?? 0.22})`; l.fillRect(-D, -D, 2 * D, 2 * D);   // leichter Erdton unter dem ganzen Acker
    for (let v = -D; v < D; v += R * (A.abstand ?? 0.1) * (0.88 + rr() * 0.24)) {   // Furchen: fast parallel, Abstand ±12 %, Breite/Helligkeit/Lücken unregelmäßig
      const ph = rr() * 6.28, amp = R * (0.015 + rr() * 0.025), per = R * (3 + rr() * 3); let u = -D;
      while (u < D) { const len = R * (0.4 + rr() * 1.4), gap = rr() < 0.4 ? R * (0.04 + rr() * 0.18) : 0, e = Math.min(D, u + len), lw = R * (0.028 + rr() * 0.022) * (A.breite ?? 1), da = (A.dunkel ?? 1) * (0.5 + rr() * 0.4);
        const linie = (dy, farbe, wd) => { l.beginPath(); let first = true; for (let t = u; t <= e + 1e-6; t += R * 0.12) { const yy = v + dy + Math.sin(t / per * 6.28 + ph) * amp; if (first) { l.moveTo(t, yy); first = false; } else l.lineTo(t, yy); } l.lineWidth = wd; l.strokeStyle = farbe; l.stroke(); };
        linie(0, `rgba(${42 + rr() * 16 | 0},${33 + rr() * 10 | 0},${25 + rr() * 8 | 0},${da})`, lw);   // Erdrinne
        linie(-lw * 0.9, `rgba(250,251,252,${0.28 + rr() * 0.22})`, lw * 0.7);   // Schnee auf dem Kamm darüber (Licht von oben)
        u = e + gap; } }
    for (let i = 0; i < AF.length * 70; i++) { l.fillStyle = `rgba(50,40,30,${0.2 + rr() * 0.3})`; l.beginPath(); l.arc((rr() - 0.5) * 2 * D, (rr() - 0.5) * 2 * D, R * (0.006 + rr() * 0.016), 0, 7); l.fill(); }   // Erdkrümel
    l.restore(); l.globalCompositeOperation = 'destination-in'; l.drawImage(MK, 0, 0); l.globalCompositeOperation = 'source-over'; w.drawImage(LY, 0, 0); }); } }
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
  const DRAW = [], SHADOW = [], FLAT = [];   /* G7f: FLAT = flach liegende Stücke (Lippe, Seitenwand, Sandsackwall), vor allen Einheiten gezeichnet */ let FELD = null, BAUMFELD = null;   // BAUMFELD: Feld, dessen Bäume gerade entstehen (cfg.baumAlpha macht sie durchsichtig, Enrico 2026-11-22)   // FELD: Drahtfeld, dessen Teile gerade entstehen (drahtWeg nimmt sie ohne Neuaufbau heraus, F12 2026-11-20)
  // Durchsichtig nur, wenn eine Einheit wirklich dahinter steht: seitlich innerhalb der Teilbreite, nicht bloß daneben (2026-11-16)
  const hides = (x, y, hb = R * 0.45, hW = SH) => UNITS.some(([hx, hy]) => hy < y - R * 0.2 && y - hy < hW * 1.3 + R * 0.3 && Math.abs(hx - x) < hb * 0.75);
  const offscreen = (p, q) => { const W = g.canvas.width, H = g.canvas.height, m = W * 0.15; return (p[0] < -m && q[0] < -m) || (p[0] > W + m && q[0] > W + m) || (p[1] < -m && q[1] < -m) || (p[1] > H + m * 3 && q[1] > H + m * 3); };
  function wall(im, A, B, hW, o = {}) {   // Wandstück: Bild steht über der Bodenlinie A→B, entlang der Linie gekachelt
    if (!im) return o.u0 || 0;
    if (o.boden && !window.BODEN_ALT) { bodenFleck([A, B], Math.max(R * 0.28, hW * 0.65)); im = bodenSink(im, 0.2); o = { ...o, sink: (o.sink || 0) + 0.09 * hW }; }   // Punkt 79.3: Bodenkontakt (Spanische Reiter)
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
    let AB = null; if (o.ab) { const mm = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], pm = proj(mm[0], mm[1]), pt = proj(mm[0] + o.ab.nx * R * 0.16, mm[1] + o.ab.ny * R * 0.16); AB = [pt[0] - pm[0], pt[1] - pm[1] + hS * 0.62]; }   // G7a-Probe: Wand hängt von der Kante nach unten und leicht nach innen (Oberkante = Bodenkante)
    for (const [x0, x1, t0, t1] of parts) {
      const qa = [pa[0] + (pb[0] - pa[0]) * t0, pa[1] + (pb[1] - pa[1]) * t0], qb = [pa[0] + (pb[0] - pa[0]) * t1, pa[1] + (pb[1] - pa[1]) * t1], sw = (x1 - x0) * iw;
      if (sw < 0.5) continue;
      g.save(); if (AB) g.setTransform((qb[0] - qa[0]) / sw, (qb[1] - qa[1]) / sw, AB[0] / ih, AB[1] / ih, qa[0], qa[1]); else g.setTransform((qb[0] - qa[0]) / sw, (qb[1] - qa[1]) / sw, -V[0] / ih, -V[1] / ih, qa[0] + V[0], qa[1] + V[1] + (o.sink || 0) * sc);
      const flt = typeof o.filter === 'function' ? o.filter(hS) : o.filter; if (flt) g.filter = flt; if (o.alpha) g.globalAlpha = typeof o.alpha === 'function' ? o.alpha(hS) : o.alpha;
      if (hW > 0.6 * SH && hides((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, R * 0.45, hW)) g.globalAlpha = 0.45;
      g.drawImage(im, x0 * iw, 0, Math.min(sw + 0.6, iw - x0 * iw), ih, 0, 0, Math.min(sw + 0.6, iw - x0 * iw), ih); g.restore();
    }
    if (cfg.punkte) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.strokeStyle = '#E2B04A'; g.lineWidth = 2 * U; g.beginPath(); g.moveTo(pa[0], pa[1]); g.lineTo(pb[0], pb[1]); g.stroke(); g.restore(); }
  }
  function bodenFleck(pts, breit) {   // Punkt 79.3: aufgewühlte, dunklere Erde unter einem Hindernis (Linie bzw. Punkt), weicher Rand, ein paar Erdklumpen
    SHADOW.push(() => { w.save(); w.lineCap = 'round'; w.lineJoin = 'round'; w.filter = `blur(${R * 0.05}px)`; w.strokeStyle = 'rgba(28,20,14,0.78)'; w.lineWidth = breit; w.beginPath(); pts.forEach((p, k) => k ? w.lineTo(p[0], p[1]) : w.moveTo(p[0], p[1])); if (pts.length === 1) w.lineTo(pts[0][0] + 0.1, pts[0][1]); w.stroke();
      w.filter = `blur(${R * 0.015}px)`; w.strokeStyle = 'rgba(10,7,4,0.7)'; w.lineWidth = breit * 0.3; w.stroke();   // G7c: Kontaktschatten direkt unter Füßen und Balken
      w.filter = 'none'; const n = Math.max(8, Math.round(breit / R * 22)); for (let k = 0; k < n * pts.length; k++) { const p = pts[k % pts.length], h1 = hrnd(Math.round(p[0]) + k, Math.round(p[1]), 431), h2 = hrnd(Math.round(p[1]) + k, Math.round(p[0]), 432), a = h1 * 6.283, d = breit * 0.45 * Math.sqrt(h2);
        w.fillStyle = h1 < 0.5 ? 'rgba(36,26,18,0.85)' : 'rgba(128,104,78,0.75)'; w.beginPath(); w.ellipse(p[0] + Math.cos(a) * d, p[1] + Math.sin(a) * d * 0.7, R * (0.016 + h2 * 0.022), R * (0.011 + h2 * 0.015), a, 0, 7); w.fill(); }
      w.restore(); }); }
  function liegend(mip, A, B, nx, ny, br, aussen, o = {}) {   // G7b voll (2026-11-25): liegendes Teil in Bildschirmauflösung (wie die Aufsteller, nicht im Weltbild): Streifen entlang A→B, Bildoberkante außen (n), Unterkante innen; aussen = Anteil der Breite außerhalb der Linie
    const quelle = mip; mip = typeof quelle === 'function' ? null : quelle; const im0 = o.mass || o.mass2 || (mip && mip[0]); if (!im0) return o.u0 || 0; const len = Math.hypot(B[0] - A[0], B[1] - A[1]); if (len < 1) return o.u0 || 0;
    const ux = (B[0] - A[0]) / len, uy = (B[1] - A[1]) / len, ue = o.ue || 0, L = len + 2 * ue, tw = (im0.naturalWidth || im0.width) && (im0.naturalHeight || im0.height) ? (im0.naturalWidth || im0.width) * br / ((im0.naturalHeight || im0.height) * (o.seit || 1)) : br * 6.5 / (o.seit || 1),   /* Bild noch nicht geladen: übliches Seitenverhältnis */ n = Math.max(1, Math.ceil(L / (R * (o.enden ? 0.14 : 0.45))));   /* G7d: weniger Stücke (Leistung) */
    let u = (o.u0 || 0) - ue; const S = [A[0] - ux * ue + nx * br * aussen, A[1] - uy * ue + ny * br * aussen];
    for (let i = 0; i < n; i++) { const s0 = L * i / n, s1 = L * (i + 1) / n, u0 = u + s0, O = [S[0] + ux * s0, S[1] + uy * s0], ln = s1 - s0;
      const yy = Math.max(O[1], O[1] + uy * ln, O[1] - ny * br, O[1] + uy * ln - ny * br), my = O[1] + uy * ln / 2 - ny * br / 2;
      if (o.skip && o.skip(O[0] + ux * ln / 2 - nx * br * (0.5 - aussen), my)) continue;
      const al = o.enden ? Math.max(0, Math.min(1, Math.min(s0 + ln / 2, L - s0 - ln / 2) / o.enden)) : 0; if (o.enden && al <= 0.02) continue;   // G7c: Enden laufen weich aus
      (window.FLACH_ALT ? DRAW : FLAT).push({ feld: FELD, y: (o.tief === 'mitte' ? my : yy) + (o.bias || 0), f: () => {
        const M = typeof quelle === 'function' ? quelle() : mip; if (!M || !M.length) return;
        const p0 = proj(O[0], O[1]), px = proj(O[0] + ux * ln, O[1] + uy * ln), py = proj(O[0] - nx * br, O[1] - ny * br); if (p0[2] <= 1 || px[2] <= 1 || py[2] <= 1 || offscreen(p0, px)) return;
        const hS = Math.hypot(py[0] - p0[0], py[1] - p0[1]); let k = 0; while (k + 1 < M.length && M[k + 1].height >= hS * 1.15) k++; const im = M[k], ih = im.height, iw = im.width, f = iw / tw;
        let a0 = (((u0 % tw) + tw) % tw), rest = ln, x = 0;
        while (rest > 0.01) { const st = Math.min(rest, tw - a0), sx = a0 * f, sw = st * f; if (sw >= 0.3) {
            const t0 = x / ln, t1 = (x + st) / ln, qa = [p0[0] + (px[0] - p0[0]) * t0, p0[1] + (px[1] - p0[1]) * t0], qb = [p0[0] + (px[0] - p0[0]) * t1, p0[1] + (px[1] - p0[1]) * t1];
            g.save(); g.setTransform((qb[0] - qa[0]) / sw, (qb[1] - qa[1]) / sw, (py[0] - p0[0]) / ih, (py[1] - p0[1]) / ih, qa[0], qa[1]); if (o.alpha) g.globalAlpha = o.alpha; if (o.enden) g.globalAlpha *= al;
            g.drawImage(im, sx, 0, Math.min(sw + 0.5, iw - sx), ih, 0, 0, Math.min(sw + 0.5, iw - sx), ih); g.restore(); }
          rest -= st; x += st; a0 = 0; }
      } }); }
    return u + ue + len;
  }
  function stand(im, x, y, hW, o = {}) {   // Aufsteller am Fußpunkt (x, y), Höhe hW
    if (!im) return;
    if (o.boden && !window.BODEN_ALT) { const bw = hW * im.width / im.height; bodenFleck([[x - bw * 0.4, y], [x + bw * 0.4, y]], Math.max(R * 0.26, hW * 0.65)); im = bodenSink(im, 0.2); o = { ...o, sink: (o.sink || 0) + 0.09 * hW }; }   // Punkt 79.3: Bodenkontakt
    const baum = BAUMFELD;
    DRAW.push({ feld: FELD, y: y + (o.bias || 0), f: () => {
      const p = proj(x, y), [px, py, zc] = p; if (zc <= 1 || offscreen(p, p)) return;
      const sc = Fk() / zc, h = hW * sc, wd = o.breite ? o.breite * sc : h * im.width / im.height;   // breite: feste Breite (G7b: Querwand auf Grabenbreite)
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); if (!o.fest && hW > 0.6 * SH && hides(x, y, hW * im.width / im.height / 2, hW)) g.globalAlpha = o.durch || 0.45;   /* fest: nie durchsichtig (Brückenbrüstung) */ if (baum && cfg.baumAlpha) g.globalAlpha = Math.min(g.globalAlpha, cfg.baumAlpha(baum));
      g.translate(px, py + h * 0.015 + (o.sink ? o.sink * sc : 0)); if (o.rot) g.rotate(o.rot); if (o.flip) g.scale(-1, 1); if (o.filter) g.filter = o.filter;
      g.drawImage(im, -wd * 0.5, o.haengen ? -h * 0.08 : -h, wd, h); g.restore();   // G7a-Probe: haengen = Oberkante an der Bodenkante, Teil reicht in den Graben
      if (cfg.punkte) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#E2B04A'; g.beginPath(); g.arc(px, py, 4 * U, 0, 7); g.fill(); g.restore(); }
    } });
    if (!o.noShadow) SHADOW.push(() => { const rr = hW * im.width / im.height * (o.shadeK || 0.42) * (1 + 0.08 * AO); const gr = w.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, `rgba(8,6,4,${0.55 + 0.12 * AO})`); gr.addColorStop(1, 'rgba(8,6,4,0)'); w.save(); w.translate(x, y); w.scale(1, 0.5); w.translate(-x, -y); w.fillStyle = gr; w.beginPath(); w.arc(x, y, rr, 0, 7); w.fill(); w.restore(); });
  }
  const flipR = (c, r, k) => hrnd(c, r, k) < 0.5;
  // G5 (2026-11-25): Stacheldraht mit Plan – Richtung des nächsten Grabens (Feuergräben zählen voll, Lauf-/Sappengräben erst ab 1,5-fachem Abstand)
  function grabenRichtung(x, y) { let best = null;
    TRENCH.forEach((z, ti) => { const L = z.ch && z.ch.length > 1 ? z.ch.map(([c, r]) => hexC(c, r)) : z.linie || TR[ti], k =   /* Linie durch die Grabenfelder: Zickzack- und Buchtenform zählen nicht */ z.art && z.art !== 'feuer' ? 1.5 : 1; for (let i = 0; i < L.length - 1; i++) { const a = L[i], b = L[i + 1], d = distTo([x, y], [a, b]) * k;
      if (!best || d < best.d) { const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; best = { d, t: [(b[0] - a[0]) / l, (b[1] - a[1]) / l] }; } } });
    return best; }
  // Gespannter Draht zwischen zwei Pfählen: drei Stränge mit leichtem Durchhang, darunter eine Drahtrolle (Schlingen), Schattenlinie am Boden
  function drahtSpann(P1, P2, hW, sd) {
    DRAW.push({ feld: FELD, y: Math.max(P1[1], P2[1]) - R * 0.01, f: () => {
      const a = proj(P1[0], P1[1]), b = proj(P2[0], P2[1]); if (a[2] <= 1 || b[2] <= 1 || offscreen(a, b)) return;
      const sa = Fk() / a[2], sb = Fk() / b[2], ha = hW * sa, hb = hW * sb, lw = Math.max(1, R * 0.011 * (sa + sb));
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.lineCap = 'round'; g.strokeStyle = 'rgba(34,24,18,0.95)'; g.lineWidth = lw;
      for (const f of [0.35, 0.65, 0.92]) { g.beginPath(); g.moveTo(a[0], a[1] - ha * f); g.quadraticCurveTo((a[0] + b[0]) / 2, (a[1] - ha * f + b[1] - hb * f) / 2 + (ha + hb) * 0.035, b[0], b[1] - hb * f); g.stroke(); }
      const dx = b[0] - a[0], dy = b[1] - a[1], sl = Math.hypot(dx, dy), n = Math.max(3, Math.round(sl / Math.max(4, (ha + hb) * 0.16)));   // Drahtrolle: Schlingen entlang der unteren Hälfte
      g.strokeStyle = 'rgba(92,62,44,0.92)'; g.lineWidth = lw * 0.9;
      for (let i = 0; i < n; i++) { const t = (i + 0.5) / n, h = ha + (hb - ha) * t, k = 0.8 + hrnd(sd, i, 396) * 0.4, cx = a[0] + dx * t + (hrnd(sd, i, 397) - 0.5) * h * 0.1, cy = a[1] + dy * t - h * (0.27 + hrnd(sd, i, 398) * 0.08); g.beginPath(); g.ellipse(cx, cy, Math.max(h * 0.22, sl / n * 0.75) * k, h * 0.29 * k, (hrnd(sd, i, 395) - 0.5) * 0.5, 0, 7); g.stroke(); }
      g.restore(); } });
    SHADOW.push(() => { w.save(); w.filter = `blur(${R * 0.03}px)`; w.strokeStyle = 'rgba(8,6,4,0.4)'; w.lineWidth = R * 0.07; w.beginPath(); w.moveTo(P1[0], P1[1] + R * 0.02); w.lineTo(P2[0], P2[1] + R * 0.02); w.stroke(); w.restore(); });
  }
  // G5b (2026-11-25): Drahtgürtel aus gemalten Stücken. Läuft der Gürtel nach Norden/Süden weiter (oder liegt er parallel zu einem Nord-Süd-Graben): Tiefenstück
  // über das ganze Feld; bei diagonalen Nachbarn das schräge Stück (gespiegelt für die andere Schräge); Ost-West: Querstück. Endstück an der Gasse, selten beschädigt.
  function drahtGuertel(c, r, hx, hy, t, q) {
    const nb = [0, 1, 2, 3, 4, 5].map(e => nbE(c, r, e)).filter(([nc, nr]) => terr(nc, nr) === 'wire').map(([nc, nr]) => { const [x, y] = hexC(nc, nr), l = Math.hypot(x - hx, y - hy) || 1; return [(x - hx) / l, (y - hy) / l]; });
    const senk = nb.filter(d => Math.abs(d[0]) < 0.3), schraeg = nb.filter(d => Math.abs(d[0]) >= 0.3);
    const tiefe = senk.length || (!nb.length && Math.abs(t[1]) > 0.6), Q = k => IM['drahtguertel_' + k];
    SHADOW.push(() => { w.save(); w.filter = `blur(${R * 0.08}px)`; w.strokeStyle = 'rgba(30,22,16,0.45)'; w.lineWidth = R * 0.5; w.lineCap = 'round'; w.beginPath();   // Boden unter dem Gürtel zertrampelt und dunkler
      if (tiefe) { w.moveTo(hx, hy - R * 0.8); w.lineTo(hx, hy + R * 0.8); } else { const d = schraeg[0] || [1, 0]; w.moveTo(hx - d[0] * R * 0.8, hy - d[1] * R * 0.8); w.lineTo(hx + d[0] * R * 0.8, hy + d[1] * R * 0.8); } w.stroke(); w.restore(); });
    if (tiefe) { const im = Q('tiefe'); stand(im, hx + (q(80) - 0.5) * R * 0.08, hy + R * 0.84, 1.9 * SH, { flip: q(81) < 0.5, noShadow: true });
      for (const [dy, fehlt] of [[1, !senk.some(d => d[1] > 0)], [-1, !senk.some(d => d[1] < 0)]]) if (fehlt && nb.length) stand(Q('ende'), hx + (q(82) - 0.5) * R * 0.2, hy + dy * R * 0.72, 0.62 * SH, { flip: dy < 0, shadeK: 0.35 });   // Gasse: Endstück mit loser Rolle
    } else if (schraeg.length) { const d = schraeg[0], auf = (d[0] > 0) === (d[1] < 0), im = Q(['schraeg_1', 'schraeg_2', 'schraeg_3'][Math.floor(q(83) * 3)]);   // auf: Gürtel steigt nach rechts oben (wie gemalt)
      stand(im, hx, hy + R * 0.42, 1.9 * R * im.height / im.width, { flip: !auf, noShadow: true });
    } else { const im = Q(q(84) < 0.8 ? 'quer_1' : 'quer_2'); stand(im, hx, hy + R * 0.12, 1.8 * R * im.height / im.width, { flip: q(85) < 0.5, noShadow: true }); }
    if (q(86) < 0.12 && Q('kaputt')) stand(Q('kaputt'), hx + (q(87) < 0.5 ? -1 : 1) * R * 0.45, hy + (q(88) - 0.5) * R * 0.6, 0.6 * SH, { flip: q(89) < 0.5, shadeK: 0.35 });   // selten ein beschädigtes Stück daneben
  }
  // 2–3 Pfahlreihen parallel zum Graben durch das Feld, versetzt; gespannt bis zum Feldrand, damit Nachbarfelder einen durchgehenden Gürtel bilden; Lücke auf Straßen
  function drahtReihen(c, r, hx, hy, t, q, aufWeg) {
    const n = [-t[1], t[0]], reihen = q(40) < 0.5 ? 2 : 3, D = R * 0.42, L = R * 0.92, hW = 0.45 * SH;
    for (let k = 0; k < reihen; k++) { const o = (k - (reihen - 1) / 2) * R * 0.34, st = (k * 0.47 + q(41 + k) * 0.2) % 1 * D; let prev = null;
      for (let s = -L + st; s <= L; s += D) { const x = hx + t[0] * s + n[0] * o, y = hy + t[1] * s + n[1] * o;
        if (Math.hypot(x - hx, (y - hy) * 1.1) > R * 0.93 || aufWeg(x, y)) { prev = null; continue; }
        const i = Math.floor(q(50 + k * 13 + Math.round(s / D + 9)) * PFAEHLE.length); stand(PFAEHLE[i], x, y, hW * (0.9 + q(60 + k * 7 + Math.round(s / D + 9)) * 0.2), { rot: (q(70 + k * 7 + Math.round(s / D + 9)) - 0.5) * 0.14, shadeK: 0.5 });
        if (prev) drahtSpann(prev, [x, y], hW * 0.95, c * 97 + r * 13 + k); prev = [x, y]; } }
    if (q(42) < 0.3 && DRAHT.length) { const so = (q(43) - 0.5) * R * 0.8, oo = (reihen / 2 + 0.4) * R * 0.34 * (q(44) < 0.5 ? -1 : 1), x = hx + t[0] * so + n[0] * oo, y = hy + t[1] * so + n[1] * oo;   // wenig loser Draht
      if (!aufWeg(x, y)) stand(DRAHT[1 + Math.floor(q(45) * 2) % DRAHT.length], x, y, 0.55 * SH, { flip: flipR(c, r, 46), shadeK: 0.4 }); }
  }

  // Graben
  // Zickzack wie echte Gräben (Schulterwehren): der Zug wird alle ZZ_STEP neu gesetzt und abwechselnd um ±ZZ_A seitlich versetzt.
  // Nur Darstellung innerhalb der Grabenfelder – die Regeln (welches Feld Graben ist) bleiben gleich.
  const G7G = cfg.grabenForm === 'buchten' && !cfg.zinnenAlt && !!(cfg.eingegraben ?? !window.G7_ALT) && !window.G7G_ALT && cfg.g7g !== false;   // G7g (2026-11-26): breiter Graben (0,95 R), flache Buchten (0,45 R) im Takt von etwa zwei Feldern, gerade Laufgräben (Rückweg window.G7G_ALT)
  const ZZ_A = R * 0.3, ZZ_STEP = R * 0.866, BU = cfg.grabenForm === 'buchten', ZI = BU && !cfg.zinnenAlt, G4B = ZI && !cfg.g4bAlt, GW = ZI ? (G7G ? 0.95 : 0.6) : BU ? 0.85 : 1.3, GK = ZI ? (G7G ? 0.48 : 0.3) : BU ? 0.42 : 0.5;   // G4 (2026-11-25): Zinnenverlauf – schmaler Graben, Bucht und Durchgang überlappen nicht mehr (Rückweg window.ZINNEN_ALT)   // G1-Probe: bei Buchten schmalere Sohle, damit die eckige Form im Boden sichtbar wird   // GW: Grabenbreite (Sohlenstreifen) in R, GK: Abstand der Kanten von der Linie in R
  const EGW = ZI && !!(cfg.eingegraben ?? !window.G7_ALT);   // G7f: eingegrabener Graben, auch für Grabenplätze (gleiche Bedingung wie EG unten)
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
  const BUCHTEN = [], DURCH = [], GTEILE = { an: false, stirn: 0 };   // G2b: Zähler für Tests (__dbg.gbTeile)
  function buchten(pts, ch, ti) {
    const GB = cfg.grabenBuchten || {}, A = R * (GB.tief ?? (G7G ? 0.45 : ZI ? 0.9 : 0.6)), own = cfg.grabenSeite && ch ? cfg.grabenSeite(...ch[0]) : null, ex = own === 'A' ? 1 : own === 'D' ? -1 : 1;
    const segL = []; let L = 0; for (let i = 0; i < pts.length - 1; i++) { const d = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); segL.push(d); L += d; }
    const at = s => { let i = 0; while (i < segL.length - 1 && s > segL[i]) { s -= segL[i]; i++; } const a = pts[i], b = pts[i + 1], t = segL[i] ? s / segL[i] : 0, dx = (b[0] - a[0]) / (segL[i] || 1), dy = (b[1] - a[1]) / (segL[i] || 1);
      let nx = -dy, ny = dx; if (Math.sign(nx || 1) !== ex) { nx = -nx; ny = -ny; } return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, nx, ny]; };
    const out = [], sA = [], oA = [], put = (s, o) => { const [x, y, nx, ny] = at(Math.max(0, Math.min(L, s))); out.push([x + nx * o, y + ny * o]); sA.push(s); oA.push(o); };
    const merk = (s0, s1, o) => { const [x0, y0, nx, ny] = at((s0 + s1) / 2), [xa, ya] = at(s0), [xb, yb] = at(s1); (o > 0 ? BUCHTEN : DURCH).push({ ti, x: x0 + nx * o, y: y0 + ny * o, nx, ny, len: Math.hypot(xb - xa, yb - ya), a: [xa + nx * o, ya + ny * o], b: [xb + nx * o, yb + ny * o] }); };   // G2a: Feuerbucht für die Grabenplätze (U2)
    let s = 0, k = 0, bucht = hrnd(pts.length, ch ? ch[0][0] : 0, 301) < 0.5; put(0, 0);
    const tk = 7 + 11 * (ti + 2) + (ch ? ch[0][0] * 3 + ch[0][1] * 5 : 0);   // G4b: Takt je Graben eigen (vorher liefen alle Gräben im gleichen Takt)
    const lang = (b, k) => { if (!G4B) return R * (b ? (GB.bucht ?? (ZI ? 0.95 : 0.85)) + hrnd(k, 7, 302) * 0.3 : (GB.quer ?? (ZI ? 0.9 : 0.45)) + hrnd(k, 7, 303) * (ZI ? 0.25 : 0.15));
      const v = hrnd(k, tk, b ? 302 : 303), x = hrnd(k, tk, 305); if (G7G) return R * (b ? 2.0 + v * 0.9 : 0.8 + v * 0.35);   /* G7g: lange Bucht, kurzer Erdblock – ein Block etwa alle zwei Felder */ return R * (b ? (x < 0.15 ? 1.75 + v * 0.45 : 0.72 + v * 0.85) : (x < 0.12 ? 1.6 + v * 0.3 : 0.85 + v * 0.6)); };   // G4b: Bucht 0,72–1,57 R, selten 1,75–2,2; Durchgang 0,85–1,45 R, selten bis 1,9
    while (s < L) { const len = G4B && k === 0 ? Math.min(R * (G7G ? 1.4 : 0.9), lang(bucht, k)) : lang(bucht, k), o =   // G4b: erster Abschnitt kurz, damit das Feld am Grabenanfang eine Bucht nah hat
      (bucht ? A / 2 : -A / 2) * (G4B ? 0.85 + hrnd(k, tk, 304) * 0.3 : 1);   // G4b: Tiefe je Bucht leicht verschieden
      const e = Math.min(L, s + len); if (e - s < R * 0.12) break; put(s, o); put(e, o); merk(s, e, o); s = e; bucht = !bucht; k++; }
    put(L, 0);
    out.stufen = new Set(); out.off = oA; for (let j = 0; j < out.length - 1; j++) if (Math.abs(sA[j] - sA[j + 1]) < 1e-6 && oA[j] && oA[j + 1] && oA[j] !== oA[j + 1]) out.stufen.add(j);   // G2b: Knick zwischen Bucht und Durchgang (Querwand)
    return out;
  }
  const versatz = (pts, d) => pts.map((p, i) => {   // G4: Versatz um d (links der Laufrichtung) mit Gehrung – rechte Winkel bleiben scharf
    const nv = (a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy); return l < 1e-6 ? null : [-dy / l, dx / l]; };
    const nA = i > 0 ? nv(pts[i - 1], p) : null, nB = i < pts.length - 1 ? nv(p, pts[i + 1]) : null, a = nA || nB, b = nB || nA; if (!a) return [p[0], p[1]];
    const k = 1 + a[0] * b[0] + a[1] * b[1]; const m = k < 0.3 ? b : [(a[0] + b[0]) / k, (a[1] + b[1]) / k]; return [p[0] + m[0] * d, p[1] + m[1] * d]; });
  const gerade = pts => {   // G7g: Ost–West-Läufe (Schritte von Spalte zu Spalte) als gerade Linie auf der Mittellinie der Reihe statt V-Zickzack über die Feldmitten
    const out = pts.map(p => [p[0], p[1]]); let i = 0;
    while (i < out.length - 1) { if (Math.abs(out[i + 1][0] - out[i][0]) < R * 1.0) { i++; continue; } let j = i; while (j < out.length - 1 && Math.abs(out[j + 1][0] - out[j][0]) >= R * 1.0) j++;
      const ys = out.slice(i, j + 1).map(p => p[1]), m = (Math.min(...ys) + Math.max(...ys)) / 2; for (let k = i; k <= j; k++) out[k][1] = m; i = j; }
    return out.filter((p, k) => k === 0 || k === out.length - 1 || !(Math.abs(p[1] - out[k - 1][1]) < 0.5 && Math.abs(p[1] - out[k + 1][1]) < 0.5)); };   // Zwischenpunkte auf der Geraden entfallen
  const TRENCH = cfg.graeben ? cfg.graeben.map((g, gi) => { const v = verlaengern(g.linie); const pts = g.art === 'feuer' && BU ? buchten(v.pts, g.linie, gi) : G7G ? gerade(v.pts) : v.pts; return { ...v, ch: g.linie, art: g.art, linie: v.pts, pts, stufen: pts.stufen, off: pts.off }; })   // G2a: Gräben als Linien je Karte (MAP.graeben)
    : cfg.trench ? cfg.trench.map(z => ({ pts: z.map(p => atW(...p)), ends: [false, false] }))
    : ketten((c, r) => terr(c, r) === 'trench').filter(ch => ch.length > 1).map(ch => { const v = verlaengern(ch); return { ...v, ch, pts: BU ? (ch.length >= 4 ? buchten(v.pts, ch, -1) : v.pts) : cfg.zickzack ? zickzack(v.pts) : v.pts }; });
  const TR = TRENCH.map(z => chaikin(z.pts, cfg.grabenForm === 'buchten' ? 0 : cfg.zickzack && z.ch ? 1 : 3));
  const feindSeite = ti => { const z = TRENCH[ti], p = TR[ti], own = cfg.grabenSeite && z.ch ? cfg.grabenSeite(...z.ch[0]) : null, ex = own === 'A' ? 1 : own === 'D' ? -1 : 0; if (!ex || !z.off) return 0;   // G4: welche Seite (links/rechts der Laufrichtung) zum Feind schaut
    for (let j = 0; j < p.length - 1; j++) if (z.off[j] > 0 && z.off[j + 1] > 0) { const dy = p[j + 1][1] - p[j][1]; if (Math.abs(dy) > R * 0.1) return Math.sign(-dy) === ex ? 1 : -1; } return 0; };
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
    const GT = BU && !!IM.graben_querwand_1, A_T = R * ((cfg.grabenBuchten || {}).tief ?? (G7G ? 0.45 : ZI ? 0.9 : 0.6)), hoch = im => im.height / 320 * SH;   // G2b (2026-11-25): gemalte Grabenteile vorhanden
    const EG = ZI && !!(cfg.eingegraben ?? !window.G7_ALT),   /* G7d (2026-11-25): eingegrabener Graben ist Standard; Rückweg window.G7_ALT (vor dem Kartenaufbau) bzw. Probe { eingegraben: false } */ LIPPE = [], HUEGEL = [], RUECK = [];
    const G7T = EG && cfg.g7test !== false && !!IM.graben_lippe_1 && !!IM.graben_wand_innen_1;
    const G7V = G7T && cfg.g7voll !== false && !!IM.graben_wand_seite_1;   // G7b voll (2026-11-25): Lippe und Seitenwand liegend in Bildschirmauflösung, Querwände hängend aus G7-6, Brustwehr-Wall G7-4 (Probe { g7voll: false } = G7b-Test)
    const LIPR = [1, 2, 3].map(k => IM['graben_lippe_' + k]), SEITR = [1, 2, 3].map(k => (G7G && !window.G7H_ALT && IM['graben_wand_seite_breit_' + k]) || IM['graben_wand_seite_' + k]),   /* G7h: breite Seitenwand ohne Pfosten (Rückweg G7H_ALT) */ BRW = [1, 2].map(k => IM['graben_brustwehr_wall_' + k]).filter(Boolean), QWT = [1, 2, 3].map(k => IM['graben_querwand_tief_' + k]).filter(Boolean), QWB = G7G && !window.G7H_ALT ? [1, 2, 3, 4].map(k => IM['graben_querwand_block_' + k]).filter(Boolean) : [];   /* G7h: Querwand als Erdblock über die ganze Breite */
    const LU = {}, KANTEN = [];   // Kachelstand je Kante (Graben, Seite, Art); Kanten für die Lippen-Ecken   // G7b-Test (2026-11-25): gemalte Erdlippe und Innenwand (Probe { eingegraben: true, g7test: false } = G7a)
    const LIP = [1, 2, 3].map(k => IM['graben_lippe_' + k]), WIN = [1, 2, 3].map(k => IM['graben_wand_innen_' + k]);
    const lipVar = (ti, side, j) => { const h = hrnd(ti * 3 + side + 7, j, 421); return h < 0.45 ? 0 : h < 0.85 ? 1 : 2; };   // Wurzeln (3) seltener
    const wandVar = (ti, side, j) => { const h = hrnd(ti * 5 + side + 3, j, 422); return h < 0.4 ? 1 : h < 0.8 ? 0 : 2; };   // Flechtwerk und Bretter häufiger als Sandsäcke
    const LAUF = {};   // Länge entlang jeder Kante (Graben, Seite): Varianten wechseln etwa alle 2 R   // G7a-Probe (2026-11-25): Graben eingegraben statt aufrechter Pappen (nur über GB_PROBE { eingegraben: true })
    const nimm = (arr, v, last) => { let i = Math.min(arr.length - 1, Math.floor(v * arr.length)); if (arr.length > 1 && arr[i] === last) i = (i + 1) % arr.length; return arr[i]; };   // nie zweimal dasselbe Teil hintereinander
    if (cfg.grabenRueckwall && GT && IM.graben_rueckwall) TRENCH.forEach((z, ti) => {   // G2b: gemalter Erdwall auf der Rückseite, entlang der geraden Grabenlinie hinter den Durchgängen
      if (z.art && z.art !== 'feuer') return; const own = cfg.grabenSeite && z.ch ? cfg.grabenSeite(...z.ch[0]) : null, ex = own === 'A' ? -1 : own === 'D' ? 1 : 0; if (!ex) return;
      const L0 = ZI ? TR[ti] : z.linie || TR[ti], o = A_T / 2 + R * (GK + 0.16), fs = ZI ? feindSeite(ti) : 0, q = ZI ? (fs ? versatz(L0, -fs * R * (GK + 0.16)) : []) : L0.map(p => [p[0] + ex * o, p[1]]); let u = hrnd(ti, 1, 320);   // G4: Rückwall folgt der Rückseite (springt hinter den Durchgängen zurück)
      if (EG) { for (let i = 0; i < q.length - 1; i++) RUECK.push([q[i], q[i + 1]]); return; }   // G7a-Probe: Rückwall als flacher Erdhügel (aufgeworfene Erde) statt aufrechtem Streifen
      for (let i = 0; i < q.length - 1; i++) u = wall(IM.graben_rueckwall, q[i], q[i + 1], 0.22 * SH, { u0: u, shade: 0.3, shadeW: 0.12, mitte: [L0[i][0], L0[i][1]],
        skip: (x, y) => TR.some((t, j) => j !== ti && distTo([x, y], t) < R * (GK + 0.1)) }); });
    else if (cfg.grabenRueckwall) TR.forEach((pts, ti) => {   // G1-Probe: niedriger aufgeworfener Erdwall auf der Rückseite (flach, dunkler Erdstreifen)
      const own = cfg.grabenSeite && TRENCH[ti].ch ? cfg.grabenSeite(...TRENCH[ti].ch[0]) : null, ex = own === 'A' ? -1 : own === 'D' ? 1 : 0; if (!ex) return;
      w.save(); w.filter = `blur(${R * 0.07}px)`; w.strokeStyle = 'rgba(58,44,30,0.75)'; w.lineWidth = R * 0.2; w.lineJoin = 'round'; w.beginPath();
      pts.forEach((p, i) => { const x = p[0] + ex * R * (GK + 0.2); i ? w.lineTo(x, p[1]) : w.moveTo(x, p[1]); }); w.stroke(); w.restore(); });
    for (const p of TR) sohleAlong(p);
    for (const p of TR) sohleAlong(p, [SOHLE.height * 0.33, SOHLE.height * 0.67]);
    if (EG) { w.save(); w.globalCompositeOperation = 'multiply'; w.filter = `blur(${R * 0.06}px)`; w.strokeStyle = G7G ? 'rgba(150,136,122,1)' : 'rgba(92,80,70,1)'; strokeLines(w, TR, R * GW * 1.05);   /* G7g: Sohle weniger abgedunkelt, Laufrost erkennbar */ w.restore(); }   // G7a-Probe: Sohle tiefer (dunkler)
    if (GT && IM.graben_sohle_rost_1) {   // G2b: Lattenrost in Stücken, dazwischen Schlamm und Pfützen (statt des durchgehenden Mittelrosts)
      const ROST = [1, 2, 3, 4].map(k => IM['graben_sohle_rost_' + k]).filter(Boolean), PF = [1, 2, 3].map(k => IM['graben_pfuetze_' + k]).filter(Boolean);
      w.save(); w.strokeStyle = pattern(w, IM.boden_schlamm, 0, 0, 0.5); strokeLines(w, TR, R * GW * 0.42); w.globalCompositeOperation = 'multiply'; w.filter = `blur(${R * 0.03}px)`;
      w.strokeStyle = 'rgba(92,74,56,1)'; strokeLines(w, TR, R * GW * 0.42); w.restore();
      if (G4B) {   // G4b (2026-11-25): Durchgänge mit durchgehendem Laufsteg, Buchten mit einzelnen Rosten, dunkle Wasserpfützen; nichts ragt in die Wände
        const KR = new Map(), kraeftig = im => { if (KR.has(im)) return KR.get(im); const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const x = c.getContext('2d');
          x.filter = 'contrast(1.4) saturate(1.15) brightness(0.9)'; x.drawImage(im, 0, 0); KR.set(im, c); return c; };
        const rost = (im, x, y, rot, quer, laengs) => { const c = kraeftig(im); w.save(); w.shadowColor = 'rgba(12,9,6,0.6)'; w.shadowBlur = R * 0.035; w.shadowOffsetY = R * 0.018;
          w.translate(x, y); w.rotate(rot); w.drawImage(c, -quer / 2, -laengs / 2, quer, laengs); w.restore(); };
        const pfuetze = (x, y, rx, sd) => { const ry = rx * 0.7; w.save(); w.beginPath();
          for (let q = 0; q < 3; q++) { const ox = (hrnd(sd, q, 371) - 0.5) * rx * 0.7, oy = (hrnd(sd, q, 372) - 0.5) * ry * 0.6, f = 0.6 + hrnd(sd, q, 373) * 0.4; w.moveTo(x + ox + rx * f, y + oy); w.ellipse(x + ox, y + oy, rx * f, ry * f, 0, 0, 7); }
          w.fillStyle = 'rgba(58,46,34,0.75)'; w.save(); w.filter = `blur(${R * 0.012}px)`; w.lineWidth = R * 0.03; w.strokeStyle = 'rgba(58,46,34,0.6)'; w.stroke(); w.restore();   // nasser Schlammrand
          w.fillStyle = 'rgba(30,27,25,0.94)'; w.fill(); w.clip();
          const gl = w.createLinearGradient(x - rx, y - ry, x + rx * 0.3, y + ry); gl.addColorStop(0, 'rgba(138,146,152,0.6)'); gl.addColorStop(0.45, 'rgba(78,84,90,0.28)'); gl.addColorStop(1, 'rgba(20,18,16,0)'); w.fillStyle = gl; w.fillRect(x - rx * 2, y - ry * 2, rx * 4, ry * 4);   // Spiegelung des Himmels
          w.restore(); w.save(); w.strokeStyle = 'rgba(200,206,208,0.62)'; w.lineWidth = R * 0.011; w.beginPath(); w.ellipse(x - rx * 0.12, y - ry * 0.1, rx * 0.62, ry * 0.5, 0, 3.4, 4.7); w.stroke(); w.strokeStyle = 'rgba(160,168,172,0.35)'; w.lineWidth = R * 0.007; w.beginPath(); w.ellipse(x + rx * 0.1, y + ry * 0.05, rx * 0.7, ry * 0.62, 0, 0.2, 1.1); w.stroke(); w.restore(); };   // schmaler Glanz
        const QUER = R * GW * 0.78, RAND = R * 0.05, STEG = [1, 4, 3].map(k => IM['graben_sohle_rost_' + k]).filter(Boolean);   // Laufsteg ohne das Stück mit gebrochenen Latten (rost_2)
        TR.forEach((pts, ti) => { const z = TRENCH[ti], o = z.off; if (!o) return; let last = null;
          for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], b = pts[i + 1], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy); if (l < R * 0.3) continue;
            let rot = Math.atan2(dy, dx) - Math.PI / 2; if (rot > Math.PI / 2) rot -= Math.PI; else if (rot < -Math.PI / 2) rot += Math.PI;
            const P = t => [a[0] + dx * t, a[1] + dy * t], sd = ti * 131 + i; (GTEILE.boden = GTEILE.boden || []).push({ ti, i, l: +(l / R).toFixed(2), o0: +(o[i] / R).toFixed(2), o1: +(o[i + 1] / R).toFixed(2), knick: !!(z.stufen && z.stufen.has(i)), x: (a[0] + b[0]) / 2, y: (a[1] + b[1]) / 2 });   // Test: Abschnitte des Grabenbodens
            if (G7G && !window.G7H_ALT) {   // G7h (Punkt 87.1): ein durchgehender gerader Laufsteg in der Grabenmitte, auch durch die Buchten; am Buchtversatz ein kurzer gerader Versatz, Kacheln nur gedreht, nie geschert
              const Q2 = R * 0.4, ux = dx / l, uy = dy / l, nx = -uy, ny = ux, knick = z.stufen && z.stufen.has(i), e0 = knick ? -Q2 / 2 : 0, e1 = knick ? -Q2 / 2 : 0, q0 = [a[0] - ux * e0, a[1] - uy * e0], q1 = [b[0] + ux * e1, b[1] + uy * e1], ll = l + e0 + e1, hq = Q2 * 0.55;
              if (ll < R * 0.06) continue;
              w.save(); w.beginPath(); w.moveTo(q0[0] + nx * hq, q0[1] + ny * hq); w.lineTo(q1[0] + nx * hq, q1[1] + ny * hq); w.lineTo(q1[0] - nx * hq, q1[1] - ny * hq); w.lineTo(q0[0] - nx * hq, q0[1] - ny * hq); w.closePath(); w.clip();
              w.save(); w.translate(q0[0], q0[1]); w.rotate(Math.atan2(uy, ux)); w.shadowColor = 'rgba(12,9,6,0.55)'; w.shadowBlur = R * 0.03; w.shadowOffsetY = R * 0.015;   // gerade Planken quer zur Laufrichtung, zwei Längsbalken darunter
              w.fillStyle = '#2c2117'; w.fillRect(0, -Q2 * 0.36, ll, Q2 * 0.08); w.fillRect(0, Q2 * 0.28, ll, Q2 * 0.08); w.shadowColor = 'transparent';
              const pb = R * 0.075; let s0 = R * 0.01, j = 0; while (s0 < ll - pb * 0.6 && j < 80) { const h = hrnd(sd, j, 377), h2 = hrnd(sd, j, 378); if (h > 0.035) { const b = 0.85 + h2 * 0.3, br = Math.round(92 * b), bg = Math.round(74 * b), bb = Math.round(54 * b);
                  w.fillStyle = `rgb(${br},${bg},${bb})`; w.fillRect(s0, -Q2 / 2 + (h2 - 0.5) * R * 0.02, pb * 0.86, Q2); w.fillStyle = 'rgba(20,14,9,0.35)'; w.fillRect(s0, -Q2 / 2 + (h2 - 0.5) * R * 0.02, pb * 0.86, R * 0.008); w.fillRect(s0 + pb * 0.86 - R * 0.006, -Q2 / 2, R * 0.006, Q2); }
                s0 += pb; j++; }   // selten eine fehlende Planke
              w.restore();
              w.restore(); continue; }
            if (z.stufen && z.stufen.has(i)) { if (hrnd(sd, 1, 374) < 0.25) pfuetze(...P(0.5), R * (0.09 + hrnd(sd, 2, 375) * 0.05), sd); continue; }   // Knick: Schlamm, manchmal eine Pfütze
            if (o[i] < 0 && o[i + 1] < 0) {   // Durchgang: Laufsteg von Ende zu Ende
              const ux = dx / l, uy = dy / l, nx = -uy, ny = ux, q0 = [a[0] + ux * RAND, a[1] + uy * RAND], q1 = [b[0] - ux * RAND, b[1] - uy * RAND], hq = QUER * 0.6;   // U2-Rest: Kacheln in Originalgröße wiederholt, am Ende abgeschnitten (nie gestreckt)
              w.save(); w.beginPath(); w.moveTo(q0[0] + nx * hq, q0[1] + ny * hq); w.lineTo(q1[0] + nx * hq, q1[1] + ny * hq); w.lineTo(q1[0] - nx * hq, q1[1] - ny * hq); w.lineTo(q0[0] - nx * hq, q0[1] - ny * hq); w.closePath(); w.clip();
              let s0 = RAND, j = 0; while (s0 < l - RAND - R * 0.02 && j < 40) { const im = nimm(STEG, hrnd(sd, j, 376), last); last = im; const lg = im.height * QUER / im.width; rost(im, ...P((s0 + lg / 2) / l), rot, QUER, lg); s0 += lg * 0.94; j++; }
              w.restore();
            } else if (o[i] > 0 && o[i + 1] > 0) {   // Bucht: ein oder zwei einzelne Roste, sonst Schlamm mit Pfütze
              const n = Math.max(1, Math.round(l / (R * 0.62))); let frei = null, gelegt = 0;   // U2-Rest: lange Buchten bekommen mehr Roste (eine 1,9-R-Bucht sah aus wie ein Durchgang ohne Steg)
              for (let j = 0; j < n; j++) { const t0 = (j + 0.5) / n, t = Math.max((RAND + R * 0.2) / l, Math.min(1 - (RAND + R * 0.2) / l, t0 + (hrnd(sd, j, 378) - 0.5) * 0.1));
                if (hrnd(sd, j, 379) < 0.7 || (j === n - 1 && !gelegt)) { gelegt++; const im = nimm(ROST, hrnd(sd, j, 380), last); last = im; const k = QUER * 0.92 / im.width; rost(im, ...P(t), rot + (hrnd(sd, j, 381) - 0.5) * 0.06, QUER * 0.92, Math.min(im.height * k, l / n - R * 0.06)); } else frei = t; }
              if (frei != null && hrnd(sd, 3, 382) < 0.6) pfuetze(...P(frei), R * (0.1 + hrnd(sd, 4, 383) * 0.06), sd + 7);
            } } });
      } else TR.forEach((pts, ti) => { let last = null;
        for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], b = pts[i + 1], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy); if (l < R * 0.3 || (TRENCH[ti].stufen && TRENCH[ti].stufen.has(i))) continue;   // Knicke bleiben Schlamm
          const n = Math.max(1, Math.round(l / (R * (ZI ? 0.46 : 0.62)))), rot = Math.atan2(dy, dx) - Math.PI / 2;
          for (let j = 0; j < n; j++) { const t = (j + 0.5) / n, x = a[0] + dx * t, y = a[1] + dy * t, v = hrnd(ti * 31 + i, j, 330);
            if (v < 0.62) { const im = nimm(ROST, hrnd(ti * 31 + i, j, 331), last); last = im; flach(im, x, y, (0.52 + hrnd(ti, i * 7 + j, 332) * 0.08) * (ZI ? 0.72 : 1), rot + (hrnd(ti, i * 7 + j, 333) - 0.5) * 0.12); }
            else if (v < 0.86 && PF.length) { const im = nimm(PF, hrnd(ti * 31 + i, j, 334), last); last = im; flach(im, x, y, (0.4 + hrnd(ti, i * 7 + j, 335) * 0.12) * (ZI ? 0.75 : 1), rot + Math.PI / 2, 0.9); } } } });
    } else if (cfg.grabenPfuetzen) TR.forEach((pts, ti) => {   // G1-Probe: Schlammpfützen auf der Sohle (dunkel, nasser Glanz)
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
    function zeichneLippen() {   // bröckelige Erdlippe: dunkles Band an der Kante mit unruhigem Außenrand, heller Krümelrand, Krümel auf dem Boden; Brustwehr-Hügel mit Licht und Schatten
      for (const [A, B] of RUECK) { w.save(); w.lineCap = 'round'; w.filter = `blur(${R * 0.07}px)`; w.strokeStyle = 'rgba(8,6,4,0.22)'; w.lineWidth = R * 0.3; w.beginPath(); w.moveTo(A[0] + R * 0.06, A[1] + R * 0.08); w.lineTo(B[0] + R * 0.06, B[1] + R * 0.08); w.stroke();
        w.strokeStyle = 'rgba(88,72,54,0.5)'; w.lineWidth = R * 0.24; w.beginPath(); w.moveTo(A[0], A[1]); w.lineTo(B[0], B[1]); w.stroke(); w.strokeStyle = 'rgba(140,118,92,0.4)'; w.lineWidth = R * 0.12; w.beginPath(); w.moveTo(A[0] - R * 0.04, A[1] - R * 0.05); w.lineTo(B[0] - R * 0.04, B[1] - R * 0.05); w.stroke(); w.restore(); }
      for (const [A, B] of HUEGEL) { const L = Math.hypot(B[0] - A[0], B[1] - A[1]) || 1, nx = -(B[1] - A[1]) / L, ny = (B[0] - A[0]) / L;
        w.save(); w.lineCap = 'round'; w.filter = `blur(${R * 0.05}px)`; w.strokeStyle = 'rgba(8,6,4,0.5)'; w.lineWidth = R * 0.34; w.beginPath(); w.moveTo(A[0] + R * 0.05, A[1] + R * 0.07); w.lineTo(B[0] + R * 0.05, B[1] + R * 0.07); w.stroke();
        w.strokeStyle = G7V ? 'rgba(58,46,34,0.6)' : 'rgba(96,78,58,0.85)'; w.lineWidth = R * (G7V ? 0.24 : 0.28);   /* G7d: Erdwall unter dem Sandsackwall dunkel (sonst blasse graue Flecken in den Lücken) */ w.beginPath(); w.moveTo(A[0], A[1]); w.lineTo(B[0], B[1]); w.stroke();
        w.strokeStyle = G7V ? 'rgba(92,76,58,0.25)' : 'rgba(150,128,100,0.45)'; w.lineWidth = R * 0.1; w.beginPath(); w.moveTo(A[0] - R * 0.03, A[1] - R * 0.04); w.lineTo(B[0] - R * 0.03, B[1] - R * 0.04); w.stroke(); w.restore(); }
      if (G7V) return;   // G7b voll: Lippe liegt als eigenes Teil in Bildschirmauflösung
      if (G7T) { const BR = R * 0.25, UE = R * 0.05;   // G7b-Test: gemalte Lippe flach auf der Kante, Oberkante (Boden) außen, Abbruchkante am Graben; Kachel in Originalseitenverhältnis, an den Enden etwas überlappend (Ecken geschlossen)
        for (const { a, b, nx, ny, s0, v } of LIPPE) { const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 1) continue; const im = lippeBild(LIP[v] || LIP[0], BR * 1.5), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, tw = im.width * BR / im.height;
          w.save(); w.translate(a[0] + nx * (BR - UE * 0.4), a[1] + ny * (BR - UE * 0.4)); w.transform(ux, uy, -nx, -ny, 0, 0);   // x entlang der Kante, y von außen zum Graben
          let x = -UE; while (x < L + UE) { const u = ((s0 + x) % tw + tw) % tw, n = Math.min(tw - u, L + UE - x); w.drawImage(im, u / tw * im.width, 0, n / tw * im.width, im.height, x, 0, n, BR); x += n; }
          w.restore(); }
        return; }
      for (const { a, b, nx, ny, ti } of LIPPE) { const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 1) continue; const n = Math.max(2, Math.ceil(L / (R * 0.05))), au = [], inn = [];
        for (let k = 0; k <= n; k++) { const t = k / n, x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t, hv = hrnd(Math.round(x), Math.round(y), 401), hv2 = hrnd(Math.round(y), Math.round(x), 404), o = R * (0.035 + hv * 0.045 + (hv2 < 0.12 ? 0.03 : 0)); inn.push([x - nx * R * 0.015, y - ny * R * 0.015]); au.push([x + nx * o, y + ny * o]); }
        w.save(); w.filter = `blur(${R * 0.06}px)`; w.strokeStyle = 'rgba(104,86,66,0.35)'; w.lineWidth = R * 0.16; w.beginPath(); w.moveTo(a[0] + nx * R * 0.14, a[1] + ny * R * 0.14); w.lineTo(b[0] + nx * R * 0.14, b[1] + ny * R * 0.14); w.stroke(); w.filter = 'none';   // aufgeworfene Erde hinter der Lippe (heller)
        w.fillStyle = 'rgba(34,26,20,0.95)'; w.beginPath(); inn.forEach((p, k) => k ? w.lineTo(p[0], p[1]) : w.moveTo(p[0], p[1])); for (let k = au.length - 1; k >= 0; k--) w.lineTo(au[k][0], au[k][1]); w.closePath(); w.fill();
        w.strokeStyle = 'rgba(150,126,98,0.7)'; w.lineWidth = R * 0.018; w.beginPath(); au.forEach((p, k) => k ? w.lineTo(p[0], p[1]) : w.moveTo(p[0], p[1])); w.stroke();
        w.fillStyle = 'rgba(52,40,30,0.8)'; for (let k = 0; k < n * 2; k++) { const hv = hrnd(ti * 7 + k, Math.round(a[0]), 402), t = (k + hv) / n, o = R * (0.09 + hrnd(k, Math.round(a[1]), 403) * 0.12), x = a[0] + (b[0] - a[0]) * (t % 1) + nx * o, y = a[1] + (b[1] - a[1]) * t + ny * o; w.beginPath(); w.fillStyle = hv < 0.5 ? 'rgba(40,30,22,0.85)' : 'rgba(132,110,84,0.7)'; w.ellipse(x, y, R * (0.01 + hv * 0.016), R * (0.007 + hv * 0.01), hv * 3, 0, 7); w.fill(); }
        w.restore(); } }
    if (GT) GTEILE.an = true; const STIRN = GTEILE.st = [];   // G2b: sichtbare Stirnseiten an den Knicken (Querwand bzw. Rückseite der Bucht)
    const TRIM = TR.map((pts, ti) => TR.map((q, j) => j === ti ? [] : q.filter(pt => distTo(pt, pts) > R * (GK - 0.02))));
    TR.forEach((pts, ti) => {
      for (const side of [-1, 1]) {
        const fs = ZI ? feindSeite(ti) : 0, brust = ZI && fs === side ? versatz(pts, side * R * (GK + 0.24)) : null, zo = TRENCH[ti].off, zs = TRENCH[ti].stufen;   // G4: Brustwehr nur vor den Buchten, knickt an den Querwänden mit
        const off = ZI ? versatz(pts, side * R * GK) : pts.map((p, i) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], ln = Math.hypot(dx, dy) || 1; return [p[0] - dy / ln * side * R * GK, p[1] + dx / ln * side * R * GK]; });
        const uu = { v: hrnd(ti, side, 4), h: hrnd(ti, side, 5), p: hrnd(ti, side, 6) };
        // Feindseite des Grabens (cfg.grabenSeite: wem gehört der Graben): Konkordat schaut nach Osten (+x), Aschenwacht nach Westen
        const own = cfg.grabenSeite && TRENCH[ti].ch ? cfg.grabenSeite(...TRENCH[ti].ch[0]) : null, ex = own === 'A' ? 1 : own === 'D' ? -1 : 0;
        for (let i = 0; i < off.length - 1; i++) {
          const mx = (off[i][0] + off[i + 1][0]) / 2, my = (off[i][1] + off[i + 1][1]) / 2, cx = (pts[i][0] + pts[i + 1][0]) / 2, cy = (pts[i][1] + pts[i + 1][1]) / 2;
          const dl = Math.hypot(cx - mx, cy - my) || 1, inY = (cy - my) / dl, back = inY > -0.5, key = back ? 'h' : 'v';
          const sd = Math.max(0, 1 - Math.abs(inY) / 0.85), lean = sd > 0.05 ? { nx: (mx - cx) / dl, ny: (my - cy) / dl, L: 0.9 * sd, U: 1 - 0.35 * sd } : null;
          const lk = ti + ':' + side, l0 = LAUF[lk] || 0; LAUF[lk] = l0 + Math.hypot(off[i + 1][0] - off[i][0], off[i + 1][1] - off[i][1]); const abschn = Math.floor(l0 / (R * 2));
          if (G7V) KANTEN.push({ ti, side, i, a: off[i], b: off[i + 1], nx: (mx - cx) / dl, ny: (my - cy) / dl, art: Math.abs(inY) < 0.55 ? 'seite' : back ? 'hinten' : 'vorn' });   // G7e: für die Lippen-Ecken
          if (G7V) { const nxo = (mx - cx) / dl, nyo = (my - cy) / dl, sk = (x, y) => TRIM[ti].some(q => q.length > 1 && distTo([x, y], q) < R * (GK + 0.04));   // G7b voll: Seitenkanten (Graben läuft in die Tiefe) = liegende Seitenwand G7-3; sonst liegende Lippe, hinten dazu die hängende Innenwand
            if (Math.abs(inY) < 0.55) LU[lk + 's'] = (sv => liegend(() => gebacken(SEITR[sv], 'seite'), off[i], off[i + 1], nxo, nyo, R * (G7G && !window.G7H_ALT ? 0.22 : 0.26), G7G && !window.G7H_ALT ? 0.36 : 0.45, { mass: SEITR[sv], u0: LU[lk + 's'], ue: R * 0.04, skip: sk, tief: 'mitte' }))(Math.floor(hrnd(ti * 7 + side, abschn, 423) * 3));
            else { LU[lk + 'l'] = (lv => liegend(() => gebacken(LIPR[lv], back ? 'lippe' : 'nah'), off[i], off[i + 1], nxo, nyo, R * (back ? (G7G ? 0.24 : 0.3) : (G7G ? 0.17 : 0.2)), back ? 0.85 : 0.88, { mass: back ? LIPR[lv] : null, seit: back ? 0 : 0.55, mass2: LIPR[lv], u0: LU[lk + 'l'], ue: R * 0.05, skip: sk, bias: back ? R * 0.012 : 0 }))(lipVar(ti, side, abschn));
              if (back && (inY > 0.82 || window.SCHRAEG_ALT) && Math.hypot(off[i + 1][0] - off[i][0], off[i + 1][1] - off[i][1]) > R * 0.55) uu[key] = wall(vorgefiltert(WIN[wandVar(ti, side, abschn)], 'brightness(0.72) contrast(1.08)'), off[i], off[i + 1], 0.35 * SH, { u0: uu[key], shade: 0, ab: { nx: (cx - mx) / dl, ny: (cy - my) / dl }, skip: sk }); }
          } else {
          if (EG) LIPPE.push({ a: off[i], b: off[i + 1], nx: (mx - cx) / dl, ny: (my - cy) / dl, ti, s0: l0, v: lipVar(ti, side, abschn) });   // G7a-Probe: Erdlippe an jeder Kante
          if (EG && !back) continue;   // G7a-Probe: nahe Wand verschwindet hinter der Lippe
          uu[key] = EG ? wall(G7T ? WIN[wandVar(ti, side, abschn)] : IM.graben_kante_hinten, off[i], off[i + 1], (G7T ? 0.35 : 0.3) * SH, { u0: uu[key], shade: 0, ab: { nx: (cx - mx) / dl, ny: (cy - my) / dl }, filter: G7T ? 'brightness(0.72) contrast(1.08)' : 'brightness(0.78) contrast(1.05)',
            skip: (x, y) => TRIM[ti].some(q => q.length > 1 && distTo([x, y], q) < R * (GK + 0.04)) }) : wall(back ? IM.graben_kante_hinten : IM.graben_kante_vorn, off[i], off[i + 1], (back ? 0.28 : 0.32) * SH, { u0: uu[key], shade: 0.4, shadeW: 0.1, lean,
            skip: (x, y) => TRIM[ti].some(q => q.length > 1 && distTo([x, y], q) < R * (GK + 0.04)) });
          }   // Ende G7b-voll-Weiche
          // Stücke, die in die Tiefe laufen: auf der Feindseite zusätzlich eine aufrechte Brustwehr aus Sandsäcken, etwas weiter außen
          if (brust && zo && (zo[i] > 0 && zo[i + 1] > 0 && sd > 0.3 || zs && zs.has(i))) {   // G4: vor der Bucht und als kurzer Knick an ihren Enden
            let A2 = brust[i], B2 = brust[i + 1]; if (zs && zs.has(i)) { const L2 = Math.hypot(B2[0] - A2[0], B2[1] - A2[1]) || 1, f = Math.min(1, R * 0.4 / L2); if (zo[i] > 0) B2 = [A2[0] + (B2[0] - A2[0]) * f, A2[1] + (B2[1] - A2[1]) * f]; else A2 = [B2[0] + (A2[0] - B2[0]) * f, B2[1] + (A2[1] - B2[1]) * f]; }
            if (G7V && zs && zs.has(i)) continue;   // G7b voll (Enrico 21:20): kein eckiger Stummel am Knick, der über die Kante ragt; der Erdwall läuft dort rund aus
            if (G7V) { const L3 = Math.hypot(B2[0] - A2[0], B2[1] - A2[1]) || 1, ex = R * 0.12 / L3; HUEGEL.push([[A2[0] - (B2[0] - A2[0]) * ex, A2[1] - (B2[1] - A2[1]) * ex], [B2[0] + (B2[0] - A2[0]) * ex, B2[1] + (B2[1] - A2[1]) * ex]]); }
            else if (EG) HUEGEL.push([A2, B2]);   // G7a-Probe: Brustwehr liegt als Wall auf dem Boden
            if (G7V && BRW.length && sd > 0.3) {   // G7c: Brustwehr an Längsstücken liegend: Fassung je Abschnitt, manche Abschnitte nur Erdwall, Enden laufen weich aus, schmal und dunkel
              const h1 = hrnd(ti * 13 + side, i, 426); if (h1 < 0.18) continue; const bw = BRW[h1 < 0.55 ? 1 % BRW.length : 0];
              liegend(() => gebacken(bw, 'brust'), A2, B2, (mx - cx) / dl, (my - cy) / dl, R * 0.24, 0.5, { mass: bw, u0: h1 * 7 * R, tief: 'mitte', bias: R * 0.02, skip: (x, y) => TRIM[ti].some(q => q.length > 1 && distTo([x, y], q) < R * (GK + 0.17)) });
              continue; }
            uu.p = wall(G7V && BRW.length ? BRW[Math.floor(hrnd(ti, i, 424) * 4) % BRW.length] : GT && IM.graben_brustwehr ? IM.graben_brustwehr : IM.graben_kante_vorn, A2, B2, (G7V ? 0.34 : EG ? 0.3 : 0.4) * SH, { u0: uu.p, shade: 0.45, shadeW: 0.14, bias: R * 0.02,
              skip: (x, y) => TRIM[ti].some(q => q.length > 1 && distTo([x, y], q) < R * (GK + 0.17)) });
          } else if (!ZI && ex && sd > 0.3 && Math.sign(mx - cx) === ex) {
            const nx = (mx - cx) / dl, ny = (my - cy) / dl, o2 = R * 0.24, A2 = [off[i][0] + nx * o2, off[i][1] + ny * o2], B2 = [off[i + 1][0] + nx * o2, off[i + 1][1] + ny * o2];
            uu.p = wall(GT && IM.graben_brustwehr ? IM.graben_brustwehr : IM.graben_kante_vorn, A2, B2, 0.4 * SH, { u0: uu.p, shade: 0.45, shadeW: 0.14, bias: R * 0.02,
              skip: (x, y) => TRIM[ti].some(q => q.length > 1 && distTo([x, y], q) < R * (GK + 0.17)) });
          }
        }
      }
    });
    if (G7V && window.ECKEN_AN && IM.graben_lippe_ecke_1 && IM.graben_lippe_ecke_2) {   // G7e (2026-11-26): gemalte Lippen-Ecken G7-5 – wirkten wie Regalbretter über der Kante, daher aus (nur window.ECKEN_AN); an hinteren Innenecken (hintere Kante trifft Seitenkante, Graben nur in einem Viertel); ungedreht, so wie gemalt
      const k = R * 0.3 / 192, EC = [{ im: IM.graben_lippe_ecke_1, ex: 156, ey: 150 }, { im: IM.graben_lippe_ecke_2, ex: 325, ey: 140 }];
      for (let j = 0; j + 1 < KANTEN.length; j++) { const A = KANTEN[j], B = KANTEN[j + 1]; if (A.ti !== B.ti || A.side !== B.side || B.i !== A.i + 1) continue;
        const H = A.art === 'hinten' ? A : B.art === 'hinten' ? B : null, S = A.art === 'seite' ? A : B.art === 'seite' ? B : null; if (!H || !S) continue;
        const Pt = A.b, lH = Math.hypot(H.b[0] - H.a[0], H.b[1] - H.a[1]), lS = Math.hypot(S.b[0] - S.a[0], S.b[1] - S.a[1]); if (lH < R * 0.7 || lS < R * 0.45) continue;
        const Q = [Pt[0] - H.nx * R * 0.15 + S.nx * R * 0.15, Pt[1] - H.ny * R * 0.15 + S.ny * R * 0.15]; if (distTo(Q, TR[A.ti]) < R * GK) continue;   // Graben in drei Vierteln (Außenecke): keine gemalte Ecke
        const e = EC[-S.nx > 0 ? 0 : 1], O = [Pt[0] - e.ex * k, Pt[1] - e.ey * k], wW = (e.im.naturalWidth || e.im.width) * k, hW = (e.im.naturalHeight || e.im.height) * k; GTEILE.ecken = (GTEILE.ecken || 0) + 1;
        DRAW.push({ feld: null, y: Pt[1] + R * 0.02, f: () => { const p0 = proj(O[0], O[1]), px = proj(O[0] + wW, O[1]), py = proj(O[0], O[1] + hW); if (p0[2] <= 1 || px[2] <= 1 || py[2] <= 1 || offscreen(p0, px)) return;
          const im = vorgefiltert(e.im, 'sepia(0.3) saturate(1.05) brightness(0.78) contrast(1.32)'), iw = im.naturalWidth || im.width, ih = im.naturalHeight || im.height; g.save(); g.setTransform((px[0] - p0[0]) / iw, (px[1] - p0[1]) / iw, (py[0] - p0[0]) / ih, (py[1] - p0[1]) / ih, p0[0], p0[1]); g.drawImage(im, 0, 0); g.restore(); } }); } }
    if (EG) zeichneLippen();
    if (GT) TR.forEach((pts, ti) => { const z = TRENCH[ti]; if (!z.stufen) return;   // Stirnseiten an jedem Knick: der Erdblock vor dem Durchgang (Feindseite, Querwand) schaut in die Bucht,
      for (const i of z.stufen) {                                                        // der Block hinter der Bucht (Rückseite) in den Durchgang; sichtbar nur, was zum Betrachter (Süden) schaut
        const b = z.off[i] > 0 ? i : i + 1, d = b === i ? i + 1 : i, P0 = pts[b], Q0 = pts[d], C = [(P0[0] + Q0[0]) / 2, (P0[1] + Q0[1]) / 2], ln = Math.hypot(P0[0] - Q0[0], P0[1] - Q0[1]) || 1;
        const n = [(P0[0] - Q0[0]) / ln, (P0[1] - Q0[1]) / ln], nb = b === i ? pts[Math.max(0, i - 1)] : pts[Math.min(pts.length - 1, i + 2)], lb = Math.hypot(nb[0] - P0[0], nb[1] - P0[1]) || 1, tb = [(nb[0] - P0[0]) / lb, (nb[1] - P0[1]) / lb];   // n: zum Feind, tb: zur Bucht
        const kd = R * (ZI ? GK : 0.08), weg = ZI && hrnd(ti * 17 + i, 3, 344) < 0.2;   // G4: Stirnseite an der Grabenkante; an ~20 % der Knicke keine (fest je Karte)
        if (tb[1] > 0.3) STIRN.push({ ti, x: C[0] + n[0] * R * GK - tb[0] * kd, y: C[1] + n[1] * R * GK - tb[1] * kd, wd: ln + R * 0.1, feind: true, weg });
        if (tb[1] < -0.3) STIRN.push({ ti, x: C[0] - n[0] * R * GK + tb[0] * kd, y: C[1] - n[1] * R * GK + tb[1] * kd, wd: ln + R * 0.1, feind: false, weg }); } });
    if (GT) {   // G2b: Querwände und Stirnseiten an den Knicken (Unterstand einmal je Feuergraben), in den Buchten Leitern, Stahlschilde, Drahtrollen; Kram in den Durchgängen
      const P = pre => LISTE.stand.filter(n => n.startsWith(pre)).map(n => IM[n]).filter(Boolean), QW = P('graben_querwand_').filter(im => !QWT.includes(im) && !QWB.includes(im)), EK = P('graben_ecke_'), LEI = P('graben_leiter_'), SCH = P('graben_stahlschild_');
      const KRAM = ['kiste', 'kisten', 'kanister', 'eimer', 'spaten', 'kiste', ...(G4B ? [] : ['einsturz', 'balken'])].map(n => IM['graben_' + n]).filter(Boolean), last = {};   // G4b: ohne Balken (lag schräg halb in der Wand)
      const unter = {}; for (const ti of new Set(STIRN.map(st => st.ti))) { const st = STIRN.filter(q => !q.feind && q.ti === ti && !q.weg); if (st.length) unter[ti] = st[Math.floor(hrnd(ti, 5, 340) * st.length)]; }
      STIRN.forEach((st, k) => {
        let im = st.feind ? nimm(QW, hrnd(st.ti, k, 341), last.q) : nimm(EK, hrnd(st.ti, k, 342), last.e); if (!im) return;
        if (!st.feind && IM.graben_unterstand && unter[st.ti] === st) im = IM.graben_unterstand; else if (st.weg) { GTEILE.weg = (GTEILE.weg || 0) + 1; return; } else if (st.feind) last.q = im; else last.e = im;
        if (EG) { st.D = R * (G7V && QWT.length && im !== IM.graben_unterstand ? (G7G ? 0.36 : 0.62) : 0.36); }   // G7e: Tiefe des hängenden Blocks (Grabenplätze dort frei halten)
        if (G7V && QWB.length && im !== IM.graben_unterstand) { const q = bodenSink(QWB[Math.floor(hrnd(st.ti, k, 428) * QWB.length)], 0.25); st.D = R * 0.3; stand(q, st.x, st.y, 0.42 * SH, { bias: R * 0.02, noShadow: true, haengen: true, breite: R * GW * 1.04 }); return; }   // G7h: Erdblock, Oberseite sichtbar, volle Grabenbreite
        if (G7V && QWT.length && im !== IM.graben_unterstand) { const QW2 = QWT.length > 1 ? QWT.slice(1) : QWT, q = bodenSink(QW2[Math.floor(hrnd(st.ti, k, 425) * QW2.length)], 0.35);   /* G7d: unteres Drittel läuft weich in die Sohle aus (schwarzes Rechteck) */   /* G7c: Bretter-Fassung wirkte wie eine Kiste – nur Flechtwerk und beschädigt */ stand(q, st.x, st.y, (G7G ? 0.38 : 0.7) * SH, { bias: R * 0.02, noShadow: true, haengen: true, breite: st.wd * 1.05 }); return; }   /* G7c: mehr Höhe in die Tiefe (Erdblock fällt in den Graben) */   // G7b voll: Querwand G7-6 hängend, auf Grabenbreite
        stand(im, st.x, st.y, Math.min(st.wd * im.height / im.width, (st.feind ? 0.42 : 0.38) * SH), EG ? { bias: R * 0.02, noShadow: true, haengen: true, filter: 'brightness(0.8)' } : { bias: R * 0.02, shadeK: 0.3 }); });
      BUCHTEN.forEach((b, k) => { if (b.ti < 0) return; const v = hrnd(b.ti, k, 350), t = 0.25 + hrnd(b.ti, k, 351) * 0.5, x = b.a[0] + (b.b[0] - b.a[0]) * t, y = b.a[1] + (b.b[1] - b.a[1]) * t, at = o => [x + b.nx * R * o, y + b.ny * R * o];
        if (v < 0.3 && LEI.length) { const im = nimm(LEI, hrnd(b.ti, k, 352), last.b); last.b = im; stand(im, ...at(GK - 0.12), hoch(im) * 0.9, { noShadow: true }); }
        else if (v < 0.55 && SCH.length) { const im = nimm(SCH, hrnd(b.ti, k, 353), last.b); last.b = im; stand(im, ...at(GK + 0.3), hoch(im)); }
        else if (v < 0.65 && IM.graben_drahtrolle && last.b !== IM.graben_drahtrolle) { last.b = IM.graben_drahtrolle; stand(IM.graben_drahtrolle, ...at(GK + 0.55), hoch(IM.graben_drahtrolle)); }
        else last.b = null; });
      DURCH.forEach((d, k) => { if (d.ti < 0 || hrnd(d.ti, k, 360) > 0.55 || !KRAM.length) return; const im = nimm(KRAM, hrnd(d.ti, k, 361), last.k); last.k = im;
        const t = 0.2 + hrnd(d.ti, k, 362) * 0.6, wand = im === IM.graben_einsturz || im === IM.graben_balken ? -(GK - 0.08) : (hrnd(d.ti, k, 363) - 0.5) * (EGW ? 0.08 : 0.3);   // Einsturz und Balken an der hinteren Wand; G7f: im eingegrabenen Graben Kram nahe der Mitte (stand halb in der Seitenwand)
        stand(im, d.a[0] + (d.b[0] - d.a[0]) * t + d.nx * R * wand, d.a[1] + (d.b[1] - d.a[1]) * t + d.ny * R * wand, hoch(im), { flip: hrnd(d.ti, k, 364) < 0.5 }); });
    }
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
  let WRACKS = null;   // G6b (2026-11-25): Tannen vor dem Koloss-Wrack zur Seite rücken oder weglassen, damit man es sieht
  function wrackFrei(x, y) { if (window.G6B_ALT) return [x, y];
    if (!WRACKS) { WRACKS = []; for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) if (terr(c, r) === 'wrack') { const [wx, wy] = hexC(c, r); WRACKS.push([wx, wy + R * 0.5]); } }
    const deckt = (a, b) => WRACKS.some(([wx, wy]) => b > wy - R * 0.35 && b - wy < R * 2.4 && Math.abs(a - wx) < R * 1.2);
    if (!deckt(x, y)) return [x, y];
    for (const w of WRACKS) { const sx = x + Math.sign(x - w[0] || 1) * R * 0.7; if (!deckt(sx, y)) return [sx, y]; }
    return null; }
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
      for (const [e, k] of ecken) { const pt = wrackFrei(...corner(c, r, e, k)); if (pt) stand(pick(TANNEN, q(e + 62)), ...pt, 2.0 * SH * (0.82 + q(e + 70) * 0.3), { flip: flipR(c, r, e + 80), shadeK: 0.3 }); }
      wall(IM.wald_unterholz, corner(c, r, 2, 0.88), corner(c, r, 1, 0.88), 0.34 * SH, { u0: q(90) * 4, shade: 0.3 });
      return true;
    }
    if (t === 'forest' && (IM.baum_tot_schnee_1 || TANNEN.length)) {   // lichter Winterwald: toter Baum hinten, Stumpf, manchmal eine junge Tanne
      { const pt = wrackFrei(...corner(c, r, q(50) < 0.5 ? 4 : 5, 0.62)); if (IM.baum_tot_schnee_1 && pt) stand(IM.baum_tot_schnee_1, ...pt, 1.7 * SH * (0.85 + q(51) * 0.25), { flip: flipR(c, r, 52), shadeK: 0.3 }); }
      if (IM.baum_tot_schnee_2) stand(IM.baum_tot_schnee_2, ...corner(c, r, q(53) < 0.5 ? 3 : 0, 0.55), 0.95 * SH * (0.85 + q(54) * 0.3), { flip: flipR(c, r, 55) });
      { const pt = wrackFrei(...corner(c, r, q(58) < 0.5 ? 2 : 1, 0.45)); if (TANNEN.length && q(56) < 0.5 && pt) stand(pick(TANNEN, q(57)), ...pt, 1.45 * SH * (0.85 + q(59) * 0.25), { flip: flipR(c, r, 59), shadeK: 0.3 }); }
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
    if (t === 'muehle' || t === 'muehle_weg' || t === 'wrack' || t === 'sperre_weg') {   // G6 (2026-11-25): besondere Orte und gesprengte Panzersperren (Bild mit gemaltem Bodenfleck, Schlamm bzw. Schnee)
      const sn = WI && IM.muehle_heil_schnee ? '_schnee' : '';
      if (t === 'sperre_weg') { const W2 = pool('sperre_weg'); for (const [e, kk, k] of [[4, 0.5, 1], [1, 0.45, 2]]) stand(W2[Math.floor(q(k) * W2.length)], ...corner(c, r, e, kk), 0.62 * SH * (0.85 + q(k + 4) * 0.25), { flip: flipR(c, r, k + 8) }); return; }   // gleiche Stellen wie die Sperre
      const im = t === 'wrack' ? IM[(sn ? 'wrack_schnee_' : 'wrack_') + (q(90) < 0.5 ? 1 : 2)] : IM[(t === 'muehle' ? 'muehle_heil' : 'muehle_kaputt') + sn];
      if (im) stand(im, hx, hy + R * (t === 'wrack' ? 0.5 : 0.62), breit(im, t === 'wrack' ? 1.9 : 2.4 * (window.G6B_ALT ? 1 : MUEHLE_GROSS)), { noShadow: true, shadeK: 0.3, durch: t !== 'wrack' && !window.G6B_ALT ? 0.3 : 0 }); return; }   // G6b: große Mühle durchsichtiger, wenn Figuren dahinter stehen
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
      for (const [e, kk, k] of [[4, 0.5, 1], [1, 0.45, 2]]) stand(SPERREN[Math.floor(q(k) * SPERREN.length)], ...corner(c, r, e, kk), 0.8 * SH * (0.85 + q(k + 4) * 0.25), { flip: flipR(c, r, k + 8), boden: true });
    } else if (t === 'bunker') {
      stand(BUNKER[q(1) < 0.5 ? 0 : 1], hx, hy + R * 0.25, 1.15 * SH, { flip: flipR(c, r, 2), shadeK: 0.45 });
    } else if (t === 'wire') {   // Drahtfeld (DRAHTFELD: Felder mit gezeichnetem Draht, für den Test Bild = Regel): 1–2 ganze Drahtverhau-Stücke (nicht zerschnitten), versetzt und gespiegelt, nach Tiefe mit den Figuren; nichts auf Straßen
      const aufWeg = (x, y) => ROADS.some(rd => distTo([x, y], rd) < R * 0.45);
      const gr = !cfg.drahtAlt && PFAEHLE.length ? grabenRichtung(hx, hy) : null;
      if (gr && gr.d < R * 3.6) { if (IM.drahtguertel_tiefe && !cfg.guertelAlt) drahtGuertel(c, r, hx, hy, gr.t, q); else drahtReihen(c, r, hx, hy, gr.t, q, aufWeg); DRAHTFELD.add(c + ',' + r); } else {   // G5b: gemalte Gürtelstücke (Rückweg window.GUERTEL_ALT = Code-Draht aus G5)   // G5 (2026-11-25): vor einem Graben Pfahlreihen parallel zum Graben; sonst (Niemandsland) wie bisher hingeworfene Stücke
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
      } }
    } else if (t === 'barrikade') {
      const ang = (q(1) - 0.5) * 0.5; wall(IM.barrikade, [hx - Math.cos(ang) * R * 0.75, hy - Math.sin(ang) * R * 0.75 - R * 0.15], [hx + Math.cos(ang) * R * 0.75, hy + Math.sin(ang) * R * 0.75 - R * 0.15], 0.55 * SH, { u0: q(2) * 3, boden: true });
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
  { const mauer = [], zaun = [], hecke = []; for (const [c, r] of felder((t, c, r) => inMap(c, r) && t === 'garten')) {
      const mitZaun = !!IM.zaun && (WI || hrnd(c, r, 252) < 0.55), mitHecke = WI && hrnd(c, r, 253) < 0.4;   // Winter: Koppelzaun um die Äcker, an manchen Äckern Hecke (G3a)
      for (const e of [4, hrnd(c, r, 250) < 0.5 ? 3 : 5, ...(hrnd(c, r, 251) < 0.35 ? [1] : [])]) { const [nc, nr] = nbE(c, r, e); if (terr(nc, nr) === 'garten' || BAUFELD.has(nc + ',' + nr) || terr(nc, nr) === 'friedhof') continue;
        (e >= 3 && mitHecke ? hecke : e >= 3 && mitZaun ? zaun : WI ? [] : mauer).push({ c, r, e }); }
      if (WI) { const [x, y] = hexC(c, r), v = hrnd(c, r, 255), HEU = [1, 2, 3, 4, 5].map(k => IM['heuhaufen_schnee_' + k]).filter(Boolean);   // G3a: Schmuck im Acker (ohne Regelwirkung), sobald die Bilder da sind
        if (v < 0.22 && HEU.length) stand(pick(HEU, hrnd(c, r, 256)), x + (hrnd(c, r, 257) - 0.5) * R * 0.8, y + (hrnd(c, r, 258) - 0.5) * R * 0.6, 0.7 * SH);
        else if (v < 0.27 && IM.vogelscheuche_schnee) stand(IM.vogelscheuche_schnee, x, y, 1.1 * SH);
        else if (v < 0.31 && IM.pflug_schnee) stand(IM.pflug_schnee, x + R * 0.3, y + R * 0.2, 0.5 * SH, { noShadow: true }); } }
    mauerzug(mauer, IM.mauer_niedrig, 0.45 * SH, { k: 0.9, seed: 19, wall: { shade: 0.45 } });
    mauerzug(zaun, IM.zaun, (WI ? 0.7 : 1.0) * SH, { k: 0.9, seed: 23, wall: { shade: 0.35, shadeW: 0.1 } });
    for (const v of [1, 2]) mauerzug(IM.hecke_schnee_2 ? hecke.filter(h => (hrnd(h.c, h.r, 254) < 0.5) === (v === 1)) : v === 1 ? hecke : [], IM['hecke_schnee_' + v] || IM.unterholz_schnee || IM.zaun, 0.6 * SH, { k: 0.9, seed: 29 + v, wall: { shade: 0.35, shadeW: 0.1 } }); }   // G3a/G3b: Hecke (zwei gemalte Streifen je Acker gemischt, Ersatz Unterholz); Deckung über die Feldart garten ×1,2

  // Schanze (cfg.schanzen: Feldkoordinaten [c, r]): Bunker hinter dem Graben auf der eigenen Seite, davor und daneben Sandsack-Barrikaden.
  // Ersetzt die Festungsteile (zu hoch, Zinnen wirken mittelalterlich – 2026-11-16).
  for (const [c, r] of cfg.schanzen || []) {
    const [hx, hy] = hexC(c, r), q = k => hrnd(c, r, k + 100), own = cfg.grabenSeite ? cfg.grabenSeite(c, r) : 'D', ex = own === 'A' ? -1 : 1;   // eigene Seite = hinter dem Graben
    const bx = hx + ex * R * 0.8, by = hy - R * 0.12;
    stand(BUNKER[0], bx, by, 0.95 * SH, { flip: ex < 0, shadeK: 0.45 });
    // Sandsackwall als Haken um den Bunker: vorn quer, an der Außenseite schräg nach hinten (kurze Stücke, keine frei stehenden Blöcke)
    const P0 = [bx + ex * R * 0.02, by + R * 0.34], P1 = [bx + ex * R * 0.5, by + R * 0.3], P2 = [bx + ex * R * 0.92, by + R * 0.02];
    const u1 = wall(IM.barrikade, P0, P1, 0.36 * SH, { u0: q(1) * 3, shade: 0.45, mitte: [bx, by], boden: true });
    wall(IM.barrikade, P1, P2, 0.36 * SH, { u0: u1, shade: 0.45, mitte: [bx, by], boden: true });
  }
  // Festung (Vorschlag, cfg.festung, nur Testseite): Teile an Feldkoordinaten { k: 1–9, c, r, dx, dy (in R), h (SH), flip }
  // 1 Mauer mit Zinnen, 2 Ecke, 3 Mauer glatt, 4 Tor klein, 5 Tor groß, 6 Tor zerstört, 7 Bunker heil, 8 Bunker zerstört, 9 Turm
  for (const f of cfg.festung || []) { const [x, y] = atW(f.c, f.r); stand(IM['festung_' + f.k], x + (f.dx || 0) * R, y + (f.dy || 0) * R, (f.h || 1.4) * SH, { flip: !!f.flip, shadeK: 0.5 }); }
  // Waldrand mit Kronen hinter der Karte (Platzhalter, bis A7 geliefert ist)
  if (cfg.edgeCrowns) { const im = cfg.edgeCrowns; for (let x = R * 0.2; x < WW; x += R * (0.8 + rnd() * 0.5)) { const y = TOP - R * (0.3 + rnd() * 0.8); if (cfg.edgeCrownsX && x > cfg.edgeCrownsX) break; stand(im, x, y, 2.6 * SH * (0.85 + rnd() * 0.3), { flip: rnd() < 0.5, shadeK: 0.35 }); } }

  // Schatten der Teile ins Weltbild, dann Raster und abgedunkelter Kartenrand
  for (const s of SHADOW) s();
  if (cfg.raster !== false) {
    w.lineWidth = R * 0.012; w.strokeStyle = `rgba(240,237,225,${cfg.rasterAlt ? 0.09 : 0.06})`;   // R1 (2026-11-25): noch etwas dezenter (Kanten liegen doppelt: wirksam ~0,12 statt ~0,17); dezent: auf dem ruhigen Boden fällt das Raster sonst stark auf
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
  // U2 (2026-11-25): zehn Grabenplätze je Feld – Proben alle 0,05 R entlang der Grabenzüge, jede Probe gehört zum nächsten Grabenfeld;
  // je Feld der Zug mit den meisten Proben. Feuerbuchten zählen voll, Durchgänge etwas, Knicke kaum; in der Bucht steht man an der Feindwand.
  let GPL = null; const GP_W = { bucht: 1, lauf: 1, durch: 0.8, ende: 0.5, knick: 0.3 };
  function grabenProben() { GPL = {}; const TF = []; for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) if (terr(c, r) === 'trench') TF.push([c, r, ...hexC(c, r)]); if (!TF.length) return;
    TR.forEach((pts, ti) => { const z = TRENCH[ti], o = z.off, fs = ZI && o ? feindSeite(ti) : 0;
      for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], b = pts[i + 1], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy); if (l < 1e-6) continue;
        const art = !o ? 'lauf' : z.stufen && z.stufen.has(i) ? 'knick' : o[i] > 0 && o[i + 1] > 0 ? 'bucht' : o[i] < 0 && o[i + 1] < 0 ? 'durch' : 'ende', nx = -dy / l * (fs || 0), ny = dx / l * (fs || 0);
        for (let s = 0; s < l; s += R * 0.05) { const x = a[0] + dx * s / l, y = a[1] + dy * s / l; let best = null, bd = 1e9; for (const f of TF) { const d = Math.hypot(f[2] - x, f[3] - y); if (d < bd) { bd = d; best = f; } }
          if (!best || bd > R * 0.95) continue; if (!window.QUERPLATZ_ALT && (GTEILE.st || []).some(st => st.D && Math.abs(x - st.x) < st.wd * 0.55 + R * 0.1 && y > st.y - R * 0.12 && y < st.y + st.D + R * 0.04)) continue;   /* G7e: keine Grabenplätze in einer hängenden Querwand (Rückweg QUERPLATZ_ALT) */ const k = best[0] + ',' + best[1], L0 = (GPL[k] = GPL[k] || {}), Lz = (L0[ti] = L0[ti] || []); Lz.push({ x, y, art, nx, ny, dx: dx / l, dy: dy / l }); } } }); }
  function grabenPlaetze(c, r, n = cfg.plaetze || 10) { if (!GPL) grabenProben(); const L0 = GPL[c + ',' + r]; if (!L0) return null; let P = null; for (const k in L0) if (!P || L0[k].length > P.length) P = L0[k]; if (!P || P.length < 4) return null;
    const xs = P.map(p => p.x), ys = P.map(p => p.y), y0 = Math.min(...ys), y1 = Math.max(...ys);
    if (!cfg.zickzackAlt && y1 - y0 > 1.3 * (Math.max(...xs) - Math.min(...xs))) {   // U2b (2026-11-25): Graben läuft in die Tiefe – gleichmäßig über die ganze Tiefe des Abschnitts, abwechselnd an die linke und rechte Wand (Knicke und Buchtenden mitbenutzt)
      const out = [], rnd = hrnd(c * 31 + r, 1, 392) < 0.5 ? 1 : -1; for (let j = 0; j < n; j++) { const yt = y0 + (y1 - y0) * (j + 0.5) / n, links = (j % 2 ? 1 : -1) * rnd < 0, h = hrnd(c * 31 + r, j, 393);
        let K = P.filter(p => Math.abs(p.y - yt) < R * 0.05); if (!K.length) { let b = P[0]; for (const p of P) if (Math.abs(p.y - yt) < Math.abs(b.y - yt)) b = p; K = [b]; }
        const p = K.reduce((a, q) => links ? (q.x < a.x ? q : a) : (q.x > a.x ? q : a)); const fw = G7G && p.art === 'bucht' && (p.nx || p.ny), fq = R * [0.24, 0.02, 0.13][j % 3] + (h - 0.5) * R * 0.06; out.push([p.x + (fw ? p.nx * fq : G7G && !window.G7H_ALT ? (j % 2 ? 1 : -1) * rnd * R * (0.12 + h * 0.06) : EGW ? (hrnd(c * 31 + r, j, 394) < 0.5 ? -1 : 1) * R * (0.02 + h * 0.06) :   /* G7h: zwei versetzte Reihen etwa ±0,15 R */ (links ? -1 : 1) * R * (0.14 + h * 0.04)), p.y + (fw ? p.ny * fq : 0) + (h - 0.5) * R * 0.03, p.art]); }   /* G7g: in der Bucht über die Breite verteilt (Feindwand, Mitte, dazwischen), sonst entlang der Mitte */   /* G7f: höchstens 0,08 R neben der Mitte, keine zwei Reihen */
      return out; }
    const cum = [0]; for (const p of P) cum.push(cum[cum.length - 1] + GP_W[p.art]); const S = cum[cum.length - 1], out = [];
    for (let j = 0; j < n; j++) { const ziel = S * (j + 0.5) / n; let i = 0; while (i < P.length - 1 && cum[i + 1] < ziel) i++; const p = P[i], h = hrnd(c * 31 + r, j, 390);
      const q = p.art === 'bucht' ? R * (j % 2 ? (EGW ? 0.07 : 0.1) : -0.02 + h * 0.03) : (j % 2 ? 1 : -1) * R * (0.03 + h * 0.03), ql = (hrnd(c * 31 + r, j, 391) - 0.5) * R * 0.04;   // Bucht: abwechselnd an der Feindwand und dahinter; sonst abwechselnd links/rechts der Mitte
      out.push([p.x + (p.art === 'bucht' && (p.nx || p.ny) ? p.nx * q : -p.dy * q) + p.dx * ql, p.y + (p.art === 'bucht' && (p.nx || p.ny) ? p.ny * q : p.dx * q) + p.dy * ql, p.art]); }
    return out; }
  function platz(c, r) {
    const t = terr(c, r), [hx, hy] = hexC(c, r);
    if (t === 'trench' && TR.length && ZI && !cfg.plaetzeAlt) { const pts = grabenPlaetze(c, r); if (pts) return EGW ? { pts, reihe: true, sink: 0, cut: null } : { pts, reihe: true, sink: 0.32, cut: EINSINK }; }   /* G7f: im eingegrabenen Graben stehen die Füße auf der Sohle, kein Abschneiden an der Hüfte */   // U2: zehn Plätze (Rückweg window.GRABENPLATZ_ALT)
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
  function feldWeg(c, r) { const k = c + ',' + r; for (let i = DRAW.length - 1; i >= 0; i--) if (DRAW[i].feld === k) DRAW.splice(i, 1); for (let i = FLAT.length - 1; i >= 0; i--) if (FLAT[i].feld === k) FLAT.splice(i, 1); DRAHTFELD.delete(k); }
  // aufrechte Teile eines Felds neu aufbauen (Krähenfurt: Haus/Kapelle eingestürzt → Ruine), ohne die ganze Welt neu zu bauen; Bodenschatten bleiben
  function feldNeu(c, r) { feldWeg(c, r); try { feldTeile(c, r); } finally { FELD = null; BAUMFELD = null; } DRAW.sort((a, b) => a.y - b.y); }
  const buchtenJeFeld = {}; for (const b of BUCHTEN) { let best = null, bd = 1e9; for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) { if (terr(c, r) !== 'trench') continue; const [x, y] = hexC(c, r), d = Math.hypot(x - b.x, y - b.y); if (d < bd) { bd = d; best = c + ',' + r; } } if (best && bd < R * 1.2) (buchtenJeFeld[best] = buchtenJeFeld[best] || []).push(b); }
  if (cfg.graeben) for (const g of cfg.graeben) if (g.art === 'feuer') for (const [c, r] of g.linie) { const k = c + ',' + r; if (buchtenJeFeld[k] || terr(c, r) !== 'trench') continue;   // G4b: jedes Feld eines Feuergrabens bekommt mindestens eine Bucht (die nächste, auch wenn sie schon einem Nachbarfeld gehört)
    const p = hexC(c, r); let best = null, bd = 1e9; for (const b of BUCHTEN) { const d = distTo(p, [b.a, b.b]); if (d < bd) { bd = d; best = b; } } if (best && bd < R * 1.2) buchtenJeFeld[k] = [best]; }   // G2a: Feuerbuchten je Grabenfeld (für U2)
  return { ground: WCV, pieces: DRAW, flach: FLAT, platz, hexC, R, SH, WW, WH, TR, terr, buchtenJeFeld, gteile: GTEILE, drahtFelder: DRAHTFELD, drahtWeg, flachNeu, feldWeg, feldNeu, UFER,
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
