// Ton-Pult: Seitenlogik (tools/tonpult_bau.mjs bettet das nach „const D = …“ ein). Ton-Pult 2 (2026-11-22): Ansichten Tabelle, Bibliothek, Einzelne Einheit – siehe Abschnitt „Ton-Pult 2“. Abspielen wie im Spiel (src/ui.js: sndPick, playSound, motorRev, Salve).
'use strict';
const SPEICHER = 'arm.tonpult', SPEICHER_SEL = 'arm.tonpult.sel', DUCK_F = 0.4;
let SND = null, effektVol = 1, laufend = new Set(), zeiten = [];
let AEND = {};   // { typ: { platzId: { w: 'p:platz' | 'k:schlüssel' | '-', vol, ton } } } – nur Abweichungen von der Grundeinstellung
try { const f = localStorage.getItem('arm.effektvol'); if (f != null && f !== '') effektVol = +f; } catch (e) {}
try { AEND = JSON.parse(localStorage.getItem(SPEICHER) || '{}') || {}; } catch (e) { AEND = {}; }
let sel = null, seite = 'A', kat = 'Alle', ansicht = 'tabelle';   // ansicht (Ton-Pult 2): 'tabelle' | 'bib' | 'einzeln'
try { const s = JSON.parse(localStorage.getItem(SPEICHER_SEL) || 'null'); if (s) { sel = s.sel; seite = s.seite || 'A'; kat = s.kat || 'Alle'; if (['tabelle', 'bib', 'einzeln'].includes(s.ansicht)) ansicht = s.ansicht; } } catch (e) {}
const U = Object.fromEntries(D.einheiten.map(u => [u.t, u]));
if (!U[sel]) sel = D.einheiten.find(u => u.sd === seite).t;
const merkeSel = () => { try { localStorage.setItem(SPEICHER_SEL, JSON.stringify({ sel, seite, kat, ansicht })); } catch (e) {} };
// Paket G 4b (2026-11-21): zusätzlich ein Verlauf der letzten 20 Stände (Zeitstempel) – falls Auswahl verloren geht, lässt sie sich wiederherstellen
const SPEICHER_VERLAUF = 'arm.tonpult.verlauf';
let verlaufT = 0;
const speichern = () => { NUTZ = null; try { localStorage.setItem(SPEICHER, JSON.stringify(AEND));
  if (Date.now() - verlaufT > 60000) { verlaufT = Date.now(); const v = JSON.parse(localStorage.getItem(SPEICHER_VERLAUF) || '[]'); v.push({ zeit: new Date().toISOString(), roh: AEND }); while (v.length > 20) v.shift(); localStorage.setItem(SPEICHER_VERLAUF, JSON.stringify(v)); } } catch (e) {} };
const zahl = v => String(v).replace('.', ',');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const datei = k => D.datei[k] || 'älterer Ton (vor 2026-11-16 eingebettet)';
const kurz = f => f.split('/').pop();
const h = (t, a = {}, ...kids) => { const e = document.createElement(t); for (const [x, y] of Object.entries(a)) { if (x === 'on') e.onclick = y; else if (x === 'html') e.innerHTML = y; else if (x === 'cls') e.className = y; else if (y != null && y !== false) e.setAttribute(x, y); } for (const c of kids) if (c != null) e.append(c); return e; };

// ---- Kandidaten wie im Spiel (sndPick): Gruppe (SND_VAR), Stimmfilter-Variante, Seite ----
function kandidaten(name, side, v) {
  if (!name || name === '-') return [];
  if (/^sv_[a-z]+_[AD]$/.test(name)) { const out = []; for (let n = 1; D.pools[name + n]; n++) for (const [k] of D.pools[name + n]) out.push({ k, sd: null }); return out; }
  const cand = [], add = (n, deep) => { if (!deep && D.sndvar[n]) { for (const m of D.sndvar[n]) add(m, true); return; } if (v && D.pools[n + '_' + v]) n += '_' + v;
    if (D.pools[n]) for (const [k, sd, w] of D.pools[n]) cand.push({ k, sd: sd || null, w: w || 1 }); else cand.push({ k: n, sd: null, w: 1 }); };
  add(name);
  const own = cand.filter(c => !c.sd || c.sd === side);
  return own.length ? own : cand.filter(c => !c.sd);
}
const vorhanden = list => SND ? list.filter(c => SND[c.k]) : list;
const zieh = list => { const l = []; for (const c of list) for (let i = 0; i < (c.w || 1); i++) l.push(c); return l.length ? l[Math.floor(Math.random() * l.length)].k : null; };

// ---- Einstellungen je Platz ----
const grund = s => Object.assign({ w: s.platz === '-' ? '-' : 'p:' + s.platz, vol: s.vol, ton: 1 }, s.mode === 'ruf' ? { filt: s.filt || 'maske', fst: s.fst != null ? s.fst : 0.6 } : {});
// Stimmfilter live (Enrico 2026-11-22): „Gasmaske + Rauschen“ = Bandpass ca. 300–3000 Hz mit leichter Resonanz und leichter Verzerrung, dazu leises Feldtelefon-Rauschen/Knistern;
// „nur Rauschen“ = Stimme roh plus Rauschen; „roh“ = ohne. st = Stärke 0–1. Gleiche Kette im Spiel (ui.js) und im Ton-Pult.
let RUF_AC = null, RUF_RAUSCH = null;
function rufKette(a, art, st) {
  if (!a || art === 'roh' || !(st > 0)) return;
  try {
    const ac = RUF_AC = RUF_AC || new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === 'suspended') ac.resume();
    const src = ac.createMediaElementSource(a); let n = src;
    if (art === 'maske') {
      const hp = ac.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 220 + 120 * st;
      const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 4400 - 1500 * st;
      const pk = ac.createBiquadFilter(); pk.type = 'peaking'; pk.frequency.value = 1300; pk.Q.value = 2.2; pk.gain.value = 3 + 6 * st;
      const ws = ac.createWaveShaper(), k = 1 + 6 * st, cur = new Float32Array(1024); for (let i = 0; i < 1024; i++) { const x = i / 511.5 - 1; cur[i] = Math.tanh(k * x) / Math.tanh(k); } ws.curve = cur;
      n.connect(hp); hp.connect(lp); lp.connect(pk); pk.connect(ws); n = ws;
    }
    if (art === 'helm') {   // Kürassier (Enrico 2026-11-22 16:08): hohler Stahlhelm – Bandpass 300–3000 Hz, Resonanz um 1,6 kHz, kurzer Kammfilter, Hauch Nachhall; jedes Wort bleibt verständlich
      const hp = ac.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 300; const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3000;
      const pk = ac.createBiquadFilter(); pk.type = 'peaking'; pk.frequency.value = 1600; pk.Q.value = 4; pk.gain.value = 3 + 6 * st;
      const dl = ac.createDelay(0.05); dl.delayTime.value = 0.0035; const fb = ac.createGain(); fb.gain.value = 0.25 + 0.35 * st; const dg = ac.createGain(); dg.gain.value = 0.35 * st;
      const hall = ac.createDelay(0.2); hall.delayTime.value = 0.045; const hg = ac.createGain(); hg.gain.value = 0.12 * st; const mix = ac.createGain();
      n.connect(hp); hp.connect(lp); lp.connect(pk); pk.connect(mix); pk.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(dg); dg.connect(mix); pk.connect(hall); hall.connect(hg); hg.connect(mix); n = mix;
    }
    if (art === 'roboter') {   // Schreiter-Stimmen (Enrico 2026-11-22): metallischer Lautsprecher – Bandpass, Verzerrung, Ringmodulation (Aschenwacht rauer über st)
      const hp = ac.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 280 + 120 * st;
      const bp = ac.createBiquadFilter(); bp.type = 'peaking'; bp.frequency.value = 1500; bp.Q.value = 1.4; bp.gain.value = 5 + 5 * st;
      const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 4200 - 1200 * st;
      const ws = ac.createWaveShaper(), k = 1.5 + 5 * st, cur = new Float32Array(1024); for (let i = 0; i < 1024; i++) { const x = i / 511.5 - 1; cur[i] = Math.tanh(k * x) / Math.tanh(k); } ws.curve = cur;
      const tr = ac.createGain(); tr.gain.value = 1 - 0.45 * st; const rm = ac.createGain(); rm.gain.value = 0; const osc = ac.createOscillator(); osc.frequency.value = 55 + 35 * (1 - st); const od = ac.createGain(); od.gain.value = 0.45 * st;
      osc.connect(od); od.connect(rm.gain); osc.start(); a.addEventListener('ended', () => { try { osc.stop(); } catch (e) {} }, { once: true }); a.addEventListener('pause', () => { try { osc.stop(); } catch (e) {} }, { once: true });
      const mix = ac.createGain(); n.connect(hp); hp.connect(bp); bp.connect(lp); lp.connect(ws); ws.connect(tr); ws.connect(rm); tr.connect(mix); rm.connect(mix); n = mix;
    }
    n.connect(ac.destination);
    if (!RUF_RAUSCH) { const len = ac.sampleRate * 3; RUF_RAUSCH = ac.createBuffer(1, len, ac.sampleRate); const d = RUF_RAUSCH.getChannelData(0); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * 0.45 + (Math.random() < 0.0012 ? (Math.random() * 2 - 1) * 0.9 : 0); }
    const ns = ac.createBufferSource(); ns.buffer = RUF_RAUSCH; ns.loop = true;
    const nf = ac.createBiquadFilter(); nf.type = 'bandpass'; nf.frequency.value = 2400; nf.Q.value = 0.7;
    const ng = ac.createGain(); ng.gain.value = (0.015 + 0.045 * st) * Math.max(0.2, a.volume);
    ns.connect(nf); nf.connect(ng); ng.connect(ac.destination); ns.start();
    const stop = () => { try { ns.stop(); } catch (e) {} }; a.addEventListener('ended', stop); a.addEventListener('pause', stop);
  } catch (e) {}
}

const wert = (u, s) => Object.assign(grund(s), (AEND[u.t] || {})[s.id] || {});
function setzeRoh(u, s, feld, x) {
  const g = grund(s), a = AEND[u.t] = AEND[u.t] || {}, e = a[s.id] = a[s.id] || {};
  if (feld === 'vol' || feld === 'ton' || feld === 'fst' ? Math.abs(x - g[feld]) < 1e-6 : x === g[feld]) delete e[feld]; else e[feld] = x;
  if (!Object.keys(e).length) delete a[s.id]; if (!Object.keys(a).length) delete AEND[u.t];
}
function setze(u, s, feld, x) { merke(u.name + ': ' + s.titel, [{ u, s }], u.t + '|' + s.id + '|' + feld); setzeRoh(u, s, feld, x); speichern(); undoKnopf(); }
const geaendert = (u, s) => !!((AEND[u.t] || {})[s.id]);
const zahlGeaendert = u => Object.keys(AEND[u.t] || {}).length;
const wahlKand = (u, s) => { const w = wert(u, s).w; return w === '-' ? [] : w.startsWith('k:') ? [{ k: w.slice(2), sd: null }] : kandidaten(w.slice(2), s.sd, s.v); };

// ---- Abspielen ----
const nach = (ms, f) => { const id = setTimeout(f, ms); zeiten.push(id); };
function spiel(k, vol, rate, dur) {
  if (!SND || !SND[k]) return null;
  const a = new Audio(SND[k]); a.preservesPitch = false; a.mozPreservesPitch = false; a.webkitPreservesPitch = false;
  a._vol = vol; a.volume = Math.max(0, Math.min(1, vol * effektVol)); a.playbackRate = Math.max(0.25, Math.min(4, rate));
  laufend.add(a); a.addEventListener('ended', () => laufend.delete(a)); a.play().catch(() => {});
  if (dur) { let n = 0; setTimeout(function aus() { n++; try { a.volume = Math.max(0, a.volume * (1 - n / 5)); } catch (e) {} if (n < 5) setTimeout(aus, 12); else { a.pause(); laufend.delete(a); } }, dur); }
  return a;
}
function motorRev(k, V, Dauer, ton) {   // wie im Spiel: ein-/ausblenden, Tonhöhe 0,8 → 1,2
  if (!SND || !SND[k]) return; const a = new Audio(SND[k]); a.preservesPitch = false; a.volume = 0; a.playbackRate = 0.8 * ton; laufend.add(a); a.play().catch(() => {}); const t0 = performance.now();
  (function tick() { const t = (performance.now() - t0) / 1000; if (t > Dauer || !laufend.has(a)) { a.pause(); laufend.delete(a); return; }
    try { a.volume = Math.min(1, V * effektVol * Math.min(1, t / 0.08) * Math.min(1, Math.max(0, (Dauer - t) / (Dauer * 0.36)))); a.playbackRate = (0.8 + 0.4 * Math.min(1, t / (Dauer * 0.4))) * ton; } catch (e) {}
    setTimeout(tick, 30); })();
}
const streu = () => 0.94 + Math.random() * 0.12;
function spielPlatz(u, s, o = {}) {   // o.duck: Fahrzeugton unter einer Stimme (Zusammenhang)
  const w = wert(u, s), list = vorhanden(wahlKand(u, s)), k = zieh(list); if (!k) return null;
  const vol = w.vol * (o.duck ? DUCK_F : 1), ton = w.ton;
  if (s.mode === 'salve') { let t = 0; for (let q = 0; q < 4; q++) { if (q) t += Math.random() < 0.3 ? Math.random() * 40 : Math.random() * 250; const last = q === 3;
      nach(t, () => spiel(k, vol * (0.8 + Math.random() * 0.4), streu() * ton, last ? 0 : 170 + Math.random() * 60)); } }
  else if (s.mode === 'motor') motorRev(k, vol, 0.7, ton);
  else if (s.mode === 'doppel') { spiel(k, vol, 0.96 * ton); nach(60, () => spiel(k, vol, 1.02 * ton)); }
  else if (s.mode === 'ruf') { const a = spiel(k, vol, ton); if (a) rufKette(a, w.filt, w.fst); }
  else spiel(k, vol, (s.mode === 'stimme' ? 1 : s.rate ? s.rate + (Math.random() - 0.5) * 0.08 : streu()) * ton, s.dur);
  zeigeZuletzt(u, s, k);
  return k;
}
function stoppAlles() { for (const a of laufend) try { a.pause(); } catch (e) {} laufend.clear(); zeiten.forEach(clearTimeout); zeiten = []; document.querySelectorAll('.play.an, #kette.an').forEach(b => b.classList.remove('an')); }

// „Im Zusammenhang hören“: anwählen, ziehen, schießen (mit Einschlag), getroffen – Abstände und Lautstärken wie im Spiel
function kette(u, btn) {
  stoppAlles(); btn.classList.add('an');
  const von = k => u.slots.filter(s => s.kette === k), blink = s => { const b = document.querySelector(`.p[data-id="${s.id}"] .play`); if (b) { b.classList.add('an'); setTimeout(() => b.classList.remove('an'), 700); } };
  const art = u.slots.some(s => s.ab === 'schuss' && /Abschuss/.test(s.titel));
  let t = 0;
  const anw = von('anw'); if (anw.length) { const stimme = anw.some(s => s.mode === 'stimme');
    for (const s of anw) nach(t, () => { blink(s); spielPlatz(u, s, { duck: stimme && s.mode === 'motor' }); }); t += 1500; }
  const zug = von('zug'); if (zug.length) { for (const s of zug) nach(t, () => { blink(s); spielPlatz(u, s); }); t += 2000; }
  const sch = von('schuss')[0]; if (sch) { nach(t, () => { blink(sch); spielPlatz(u, sch); }); const z = von('ziel')[0]; if (z) nach(t + (art ? 570 : sch.mode === 'salve' ? 700 : 450), () => { blink(z); spielPlatz(u, z); }); t += 2200; }
  const tr = von('treffer')[0]; if (tr) { nach(t, () => { blink(tr); spielPlatz(u, tr); }); t += 1200; }
  nach(t + 400, () => btn.classList.remove('an'));
}

// ---- Auswahlliste je Zeile: wie im Spiel, Favoriten, gleiche Art nach Gehör (Ton-Pult 2: statt der alten Code-Gruppen), einzelne Töne ----
function optionen(u, s) {
  const g = grund(s).w, opts = [];
  const lab = p => { const n = kandidaten(p, s.sd, s.v).length; return `${platzName(p)}${n > 1 ? ` (Zufall aus ${n})` : ''}`; };
  opts.push(['Wie im Spiel', [[g, g === '-' ? 'Kein Ton (wie im Spiel)' : lab(s.platz) + ' – wie im Spiel']]]);
  const fav = [...FAV].filter(id => id !== g && (id.startsWith('k:') ? KEYPOOL[id.slice(2)] : D.pools[id.slice(2)])).map(id => [id, '★ ' + (id.startsWith('k:') ? tonName(id.slice(2)) : lab(id.slice(2)))]);
  if (fav.length) opts.push(['Favoriten', fav]);
  const kat = BIBKAT[katVonPlatz(s.platz) || (s.mode === 'ruf' ? 'stimmen' : '')];
  if (kat) { const spruch = s.gruppe === 'spruch';
    const andere = kat.e.map(e => e[0]).filter(p => p !== s.platz && D.pools[p] && (spruch ? new RegExp('^sv_[a-z]+_' + s.sd + '\\d').test(p) : !/^sv_/.test(p)) && kandidaten(p, s.sd, s.v).length).map(p => ['p:' + p, lab(p)]);
    if (andere.length) opts.push([spruch ? 'Andere Stimmen' : 'Gleiche Art: ' + kat.titel, andere]); }
  const einzeln = [], gesehen = new Set(), w = wert(u, s).w;
  for (const p of [s.platz, w.startsWith('p:') ? w.slice(2) : null]) if (p && p !== '-') for (const c of kandidaten(p, s.sd, s.v)) { if (gesehen.has(c.k) || !KEYPOOL[c.k]) continue; gesehen.add(c.k); einzeln.push(['k:' + c.k, `${tonName(c.k)}${c.sd ? ' (' + seiteTxt(c.sd) + ')' : ''} · ${c.k}`]); }
  if (einzeln.length > 1) opts.push(['Einzelne Töne dieses Platzes', einzeln]);
  if (g !== '-') opts.push(['Stumm', [['-', 'Kein Ton']]]);
  return opts;
}
function tonText(u, s) {
  const w = wert(u, s).w;
  if (w === '-') return 'kein Ton';
  if (w.startsWith('k:')) return `<b>${esc(tonName(w.slice(2)))}</b> · ${esc(w.slice(2))} · ${esc(datei(w.slice(2)))}`;
  const l = kandidaten(w.slice(2), s.sd, s.v), p = w.slice(2);
  if (l.length === 1) return `<b>${esc(platzName(p))}</b> · ${esc(l[0].k)} · ${esc(datei(l[0].k))}`;
  return `<b>${esc(platzName(p))}</b> · Platz ${esc(p)}${s.v ? ' (' + esc(D.var[s.v]) + ')' : ''} · Zufall aus ${l.length}: ${esc(l.slice(0, 5).map(c => c.k).join(', '))}${l.length > 5 ? ' …' : ''}`;
}
function zeigeZuletzt(u, s, k) { const el = document.querySelector(`.p[data-id="${s.id}"] .zul`); if (el && u.t === sel) el.innerHTML = `zuletzt: <b>${esc(k)}</b> · ${esc(datei(k))}`; }

// ---- Aufbau ----
function liste() {
  const sw = document.getElementById('seiten'); sw.innerHTML = '';
  for (const [sd, n] of [['A', 'Konkordat'], ['D', 'Aschenwacht']]) sw.append(h('button', { cls: sd + (seite === sd ? ' an' : ''), on: () => { seite = sd; const erst = D.einheiten.find(u => u.sd === sd && (kat === 'Alle' || u.kat === kat)) || D.einheiten.find(u => u.sd === sd); sel = erst.t; merkeSel(); liste(); pult(); } }, n));
  const kw = document.getElementById('kats'); kw.innerHTML = '';
  for (const k of ['Alle', ...D.kat]) kw.append(h('button', { cls: kat === k ? 'an' : '', on: () => { kat = k; merkeSel(); liste(); } }, k === 'Fahrzeuge und Kampfmaschinen' ? 'Fahrzeuge' : k));
  const ew = document.getElementById('einheiten'); ew.innerHTML = '';
  const reihe = D.kat.flatMap(k => D.einheiten.filter(u => (u.sd === seite || !u.sd) && u.kat === k && (kat === 'Alle' || kat === k)));
  for (const u of reihe) { const n = zahlGeaendert(u);
    ew.append(h('button', { cls: 'e' + (u.t === sel ? ' an' : ''), on: () => { sel = u.t; merkeSel(); liste(); pult(); window.scrollTo({ top: 0 }); } },
      u.img ? h('img', { src: u.img, alt: '' }) : h('i'), h('span', {}, h('span', { cls: 'nm' }, u.name, n ? h('span', { cls: 'mark' }, ` ● ${n} geändert`) : null), h('small', {}, (u.kat === 'Fahrzeuge und Kampfmaschinen' ? 'Fahrzeuge' : u.kat) + (u.mech ? ' · Kampfmaschine' : '')))));
  }
}
function zeile(u, s) {
  const w = wert(u, s), row = h('div', { cls: 'p' + (geaendert(u, s) ? ' geaendert' : ''), 'data-id': s.id });
  const play = h('button', { cls: 'play', title: 'Abspielen', 'aria-label': 'Abspielen: ' + s.titel, disabled: !SND, on: () => spielPlatz(u, s) }, '▶');
  const tag = s.v ? h('span', { cls: 'tag' }, D.var[s.v]) : null;
  const info = h('div', {}, h('div', { cls: 'ti' }, s.titel, tag), h('div', { cls: 'ton', html: tonText(u, s) }), h('div', { cls: 'ton zul' }));
  const sel_ = h('select', { 'aria-label': 'Ton für ' + s.titel });
  for (const [titel, list] of optionen(u, s)) { const g = h('optgroup', { label: titel }); for (const [v, l] of list) g.append(h('option', { value: v }, l)); sel_.append(g); }
  sel_.value = w.w; if (sel_.value !== w.w) { sel_.append(h('option', { value: w.w }, wahlName(w.w) + ' · ' + w.w.slice(2) + ' (aus der Bibliothek)')); sel_.value = w.w; }
  const alleB = h('button', { cls: 'alle', title: 'Alle Töne des Spiels, nach Gehör sortiert, mit Suche und Favoriten', 'aria-label': 'Bibliothek für ' + s.titel, on: () => bibDialog([{ u, s }], u.name + ' · ' + s.titel, id => zuweisen([{ u, s }], id, s.titel)) }, 'Bibliothek …');
  sel_.onchange = () => { setze(u, s, 'w', sel_.value); auffrischen(u, s, row); spielPlatz(u, s); };
  const vol = h('input', { type: 'range', min: 0, max: 100, step: 1, value: Math.round(w.vol * 100) }), volB = h('b', {}, Math.round(w.vol * 100));
  vol.oninput = () => { setze(u, s, 'vol', vol.value / 100); volB.textContent = vol.value; auffrischen(u, s, row, true); };
  vol.onchange = () => spielPlatz(u, s);
  const ton = h('input', { type: 'range', min: 50, max: 150, step: 1, value: Math.round(w.ton * 100) }), tonB = h('b', {}, Math.round(w.ton * 100) + ' %');
  ton.oninput = () => { setze(u, s, 'ton', ton.value / 100); tonB.textContent = ton.value + ' %'; auffrischen(u, s, row, true); };
  ton.onchange = () => spielPlatz(u, s);
  const zur = h('button', { cls: 'x', title: 'Diesen Platz zurücksetzen', 'aria-label': 'Zurücksetzen: ' + s.titel, on: () => { merke(u.name + ': ' + s.titel + ' zurückgesetzt', [{ u, s }]); delete (AEND[u.t] || {})[s.id]; if (AEND[u.t] && !Object.keys(AEND[u.t]).length) delete AEND[u.t]; speichern(); const neu = zeile(u, s); row.replaceWith(neu); liste(); undoKnopf(); } }, '↺');
  const gl = (s.gleich || []).map(id => (u.slots.find(x => x.id === id) || {}).titel).filter(Boolean);   // Ton-Pult 2: „gilt auch für“ deutlich
  const hin = [s.hin, gl.length ? `⚠ Gilt im Spiel auch für „${gl.join('“, „')}“ (gleicher Tonplatz bei dieser Einheit).` : '', s.auch.length ? `Gleicher Ton im Spiel auch bei: ${s.auch.slice(0, 6).join(', ')}${s.auch.length > 6 ? ` und ${s.auch.length - 6} weiteren` : ''} – die bleiben unverändert (mehrere auf einmal: Ansicht „Tabelle“).` : ''].filter(Boolean).join(' ');
  row.append(play, info, h('div', { cls: 'wahl' }, sel_, alleB), h('label', { cls: 'r' }, 'Lautstärke ', volB, vol), h('label', { cls: 'r' }, 'Tonhöhe ', tonB, ton), zur);
  if (s.mode === 'ruf') {   // Filter je Ruf (Enrico 2026-11-22)
    const fs_ = h('select', { 'aria-label': 'Filter für ' + s.titel }); for (const [v, l] of [['maske', 'Gasmaske + Rauschen'], ['roboter', 'Roboter-Lautsprecher'], ['helm', 'Stahlhelm (blechern)'], ['rauschen', 'nur Rauschen'], ['roh', 'roh']]) fs_.append(h('option', { value: v }, l)); fs_.value = w.filt;
    fs_.onchange = () => { setze(u, s, 'filt', fs_.value); auffrischen(u, s, row, true); spielPlatz(u, s); };
    const st = h('input', { type: 'range', min: 0, max: 100, step: 5, value: Math.round(w.fst * 100) }), stB = h('b', {}, Math.round(w.fst * 100) + ' %');
    st.oninput = () => { setze(u, s, 'fst', st.value / 100); stB.textContent = st.value + ' %'; auffrischen(u, s, row, true); }; st.onchange = () => spielPlatz(u, s);
    row.append(h('div', { cls: 'rufzeile' }, h('label', { cls: 'r rf' }, 'Filter ', fs_), h('label', { cls: 'r' }, 'Stärke ', stB, st))); }
  if (hin) row.append(h('p', { cls: 'hin' }, hin));
  return row;
}
// ================= Ton-Pult 2 (Enrico 2026-11-22 19:10) =================
// Bibliothek nach Gehör (D.bib), Tabelle Einheiten × Ereignisse mit Mehrfachwahl, „Vom Ton aus“, Schnellwahl, Rückgängig.
// Speicher und Export bleiben wie bisher: AEND[einheit][platz_id] = { w, vol, ton } – eine Mehrfach-Zuweisung schreibt je Einheit einen Eintrag.
const SPALTEN = [['anw', 'Anklicken'], ['zug', 'Ziehen'], ['schuss', 'Schuss'], ['ziel', 'Treffer am Ziel'], ['nah', 'Nahkampf'], ['treffer', 'Getroffen'], ['tod', 'Tod'], ['abil', 'Fähigkeiten'], ['ankunft', 'Ankunft'], ['stimme', 'Rufe']];
const SP_NAME = Object.fromEntries(SPALTEN), SP_EXTRA = { ankunft: 1, stimme: 1 };
const HAUPT = { anw: ['spruch'], zug: ['ziehen'], schuss: ['schuss'], ziel: ['ziel', 'feuer'], nah: ['schlag'], tod: ['tod'], ankunft: ['nachschub'] }, OHNE_HAUPT = { abil: 1, stimme: 1 };
const ARTEN = [['fuss', 'Fußtruppen'], ['anzug', 'Kampfanzüge'], ['fahrzeug', 'Fahrzeuge'], ['schreiter', 'Schreiter'], ['reiter', 'Reiter'], ['geschuetz', 'Geschütze'], ['held', 'Helden'], ['anfuehrer', 'Anführer']];
const SEITEN = [['A', 'ganzes Konkordat'], ['D', 'ganze Aschenwacht']], WAFFEN = [['gewehr', 'Gewehr'], ['mg', 'MG'], ['kanone', 'Kanone'], ['flamme', 'Flammenwerfer']];
const seiteTxt = sd => sd === 'A' ? 'Konkordat' : sd === 'D' ? 'Aschenwacht' : '';
const sek = x => zahl(x.toFixed(1)) + ' s';

// ---- Namen: jeder Ton lesbar (Platzname + laufende Nummer), Filter-Fassungen (_gm, _gs, _bf, _mr) gehören zum Grundplatz ----
const VARIANTE = /^(.+)_(gm|gs|bf|mr)$/;
const basis = p => { const m = p.match(VARIANTE); return m && D.pools[m[1]] ? m[1] : p; };
const platzName = p => { const m = p.match(/^sv_([a-z]+)_([AD])(\d*)$/); return m ? 'Spruch ' + (D.satz[m[1]] || m[1]) + (m[3] ? ', Stimme ' + m[3] : ', Stimmen reihum') : (D.name[p] || p); };
const KEYPOOL = {};   // Schlüssel → [Platz, Nummer im Platz, Anzahl]; bevorzugt der Platz, dessen Name im Schlüssel steckt
for (const p of Object.keys(D.pools)) D.pools[p].forEach(([k], i) => { const alt = KEYPOOL[k], pre = k.startsWith(p); if (!alt || (pre && (!alt[3] || p.length > alt[0].length))) KEYPOOL[k] = [p, i, D.pools[p].length, pre]; });
function tonName(k) { const e = KEYPOOL[k]; if (!e) return D.name[k] || k; const p = basis(e[0]), v = p !== e[0] ? e[0].slice(p.length + 1) : null; return platzName(p) + (e[2] > 1 ? ' ' + (e[1] + 1) : '') + (v ? ' (' + D.var[v] + ')' : ''); }
const BIBKAT = Object.fromEntries(D.bib.map(b => [b.id, b])), PLATZKAT = {};
for (const b of D.bib) for (const [p] of b.e) if (!PLATZKAT[p]) PLATZKAT[p] = b.id;
const katVonPlatz = p => !p || p === '-' ? null : PLATZKAT[basis(p)] || PLATZKAT[p + '1'] || (KEYPOOL[p] ? PLATZKAT[basis(KEYPOOL[p][0])] : null) || (D.sndvar[p] ? katVonPlatz(D.sndvar[p][0]) : null);
const katVonWahl = w => !w || w === '-' ? null : w.startsWith('k:') ? (KEYPOOL[w.slice(2)] ? PLATZKAT[basis(KEYPOOL[w.slice(2)][0])] : PLATZKAT[w.slice(2)]) : katVonPlatz(w.slice(2));
const platzKeys = p => D.pools[p] || [[p, null]];
const platzSeite = p => { const l = platzKeys(p), m = /^sv_[a-z]+_([AD])/.exec(p); return m ? m[1] : l.every(x => x[1] && x[1] === l[0][1]) ? l[0][1] : null; };
const zuweisbar = id => id.startsWith('p:') ? !!D.pools[id.slice(2)] : !!KEYPOOL[id.slice(2)];   // nur was tools/tonwahl_bau.mjs kennt (echte Plätze und Töne darin)
function platzMeta(p) { const keys = platzKeys(p), sd = platzSeite(p), ds = keys.map(x => D.dauer[x[0]]).filter(x => x != null), mn = Math.min(...ds), mx = Math.max(...ds);
  return [keys.length > 1 ? `Zufall aus ${keys.length}` : '', sd ? 'nur ' + seiteTxt(sd) : '', ds.length ? (mx - mn < 0.05 ? sek(mn) : sek(mn) + ' – ' + sek(mx)) : '', esc(keys.length > 1 ? 'Platz ' + p : keys[0][0] + ' · ' + kurz(datei(keys[0][0])))].filter(Boolean).join(' · '); }
const tonMeta = (k, sd) => [sd ? 'nur ' + seiteTxt(sd) : '', D.dauer[k] != null ? sek(D.dauer[k]) : '', esc(k), esc(kurz(datei(k)))].filter(Boolean).join(' · ');
const wahlName = id => id == null ? 'wie im Spiel' : id === '-' ? 'kein Ton' : id.startsWith('k:') ? tonName(id.slice(2)) : platzName(id.slice(2));
function tonKurz(u, s) { const w = wert(u, s).w; if (w === '-') return 'kein Ton'; if (w.startsWith('k:')) return tonName(w.slice(2)); const p = w.slice(2), n = kandidaten(p, s.sd, s.v).length; return platzName(p) + (n > 1 ? ' ×' + n : ''); }

// ---- Favoriten ----
const SPEICHER_FAV = 'arm.tonpult.fav'; let FAV = new Set();
try { FAV = new Set(JSON.parse(localStorage.getItem(SPEICHER_FAV) || '[]')); } catch (e) {}
const favUm = id => { if (FAV.has(id)) FAV.delete(id); else FAV.add(id); try { localStorage.setItem(SPEICHER_FAV, JSON.stringify([...FAV])); } catch (e) {} };

// ---- „benutzt von“: welcher Ton klingt gerade wo (mit den aktuellen Wahlen) ----
let NUTZ = null;
function nutzIndex() { if (NUTZ) return NUTZ; const p = {}, k = {};
  for (const u of D.einheiten) for (const s of u.slots) { const w = wert(u, s).w; if (w === '-') continue;
    if (w.startsWith('k:')) (k[w.slice(2)] = k[w.slice(2)] || []).push({ u, s });
    else { const pl = w.slice(2); for (const x of new Set([pl, ...(D.sndvar[pl] || [])])) (p[x] = p[x] || []).push({ u, s }); for (const c of kandidaten(pl, s.sd, s.v)) (k[c.k] = k[c.k] || []).push({ u, s }); } }
  return NUTZ = { p, k }; }
const nutzListe = id => { const N = nutzIndex(); if (id.startsWith('k:')) return N.k[id.slice(2)] || []; const p = id.slice(2), out = [...(N.p[p] || [])]; if (!D.pools[p]) out.push(...(N.k[p] || [])); return out; };
const istHaupt = (u, s) => !OHNE_HAUPT[s.ab] && slotVon(u, s.ab, '*') === s;
function nutzVoll(l) { const g = new Map(); for (const r of l) { const k = SP_NAME[r.s.ab] || r.s.ab; if (!g.has(k)) g.set(k, []); g.get(k).push(r); }
  const box = h('div', { cls: 'nutzvoll' });
  for (const [k, rs] of g) { const z = h('div', {}, h('b', {}, k + ': ')); rs.forEach((r, i) => z.append(i ? ', ' : '', h('span', { cls: ((AEND[r.u.t] || {})[r.s.id] || {}).w ? 'eigen' : '' }, r.u.name + (istHaupt(r.u, r.s) ? '' : ' (' + r.s.titel + ')')))); box.append(z); }
  return box; }
function nutzEl(id) { const l = nutzListe(id); if (!l.length) return h('span', { cls: 'nutz leer' }, 'noch nirgends benutzt');
  const namen = [...new Set(l.map(r => r.u.name))];
  const d = h('details', { cls: 'nutz' }, h('summary', {}, 'benutzt von ' + namen.slice(0, 2).join(', ') + (namen.length > 2 ? ` und ${namen.length - 2} weiteren` : '')));
  d.addEventListener('toggle', () => { if (d.open && d.children.length < 2) d.append(nutzVoll(l)); }); d.addEventListener('click', e => e.stopPropagation()); return d; }

// ---- Rückgängig: letzte Zuweisung zurück (auch Mehrfach-Zuweisung, Regler, Zurücksetzen, Import) ----
const UNDO = [];
function merke(text, ziele, sch) {   // sch: gleiche Stelle kurz hintereinander (Regler ziehen) = ein Schritt
  const l = UNDO[UNDO.length - 1]; if (sch && l && l.sch === sch && Date.now() - l.zeit < 4000) { l.zeit = Date.now(); return; }
  UNDO.push({ text, sch: sch || null, zeit: Date.now(), alt: ziele.map(({ u, s }) => [u.t, s.id, (AEND[u.t] || {})[s.id] ? JSON.stringify(AEND[u.t][s.id]) : null]) }); if (UNDO.length > 80) UNDO.shift(); }
function merkeAlles(text) { UNDO.push({ text, zeit: Date.now(), ganz: JSON.stringify(AEND) }); if (UNDO.length > 80) UNDO.shift(); }
function rueckgaengig() { const op = UNDO.pop(); if (!op) return;
  if (op.ganz != null) AEND = JSON.parse(op.ganz);
  else for (const [t, id, j] of op.alt) { if (j) (AEND[t] = AEND[t] || {})[id] = JSON.parse(j); else if (AEND[t]) { delete AEND[t][id]; if (!Object.keys(AEND[t]).length) delete AEND[t]; } }
  speichern(); zeichne(); meldung('Zurückgenommen: ' + op.text); }
function undoKnopf() { const b = document.getElementById('undo'); if (!b) return; b.disabled = !UNDO.length; b.title = UNDO.length ? 'Zurücknehmen: ' + UNDO[UNDO.length - 1].text : 'Nichts zum Zurücknehmen'; }

// ---- Häkchen: Schnellwahl (Art, Seite, Waffe – Gruppen wirken zusammen) plus einzelne Häkchen ----
const chips = { art: new Set(), seite: new Set(), waffe: new Set() }, manuell = new Map();
const echt = u => u.kat !== 'Stimmen';
const chipAktiv = () => chips.art.size + chips.seite.size + chips.waffe.size > 0;
const chipTrifft = u => echt(u) && chipAktiv() && (!chips.art.size || chips.art.has(u.art)) && (!chips.seite.size || chips.seite.has(u.sd)) && (!chips.waffe.size || chips.waffe.has(u.waffe));
const istAn = u => manuell.has(u.t) ? manuell.get(u.t) : chipTrifft(u);
const angehakt = () => D.einheiten.filter(istAn);
function hakenUm(u, an) { if (an === chipTrifft(u)) manuell.delete(u.t); else manuell.set(u.t, an); }
function schnellBau(neu) {
  const box = h('div', { cls: 'schnell' }), n = angehakt().length;
  const gruppe = (titel, satz, liste_) => { const g = h('div', { cls: 'sg' }, h('span', { cls: 'sgt' }, titel));
    for (const [id, name] of liste_) g.append(h('button', { cls: 'chip' + (satz.has(id) ? ' an' : ''), 'aria-pressed': satz.has(id) ? 'true' : 'false', on: () => { if (satz.has(id)) satz.delete(id); else satz.add(id); for (const [t, v] of [...manuell]) if (!v) manuell.delete(t); neu(); } }, name));
    return g; };
  box.append(h('b', { cls: 'st' }, 'Schnellwahl'), gruppe('Art', chips.art, ARTEN), gruppe('Seite', chips.seite, SEITEN), gruppe('Waffe', chips.waffe, WAFFEN),
    h('div', { cls: 'sg' }, h('span', { cls: 'zahl' }, n ? `${n} ${n === 1 ? 'Einheit' : 'Einheiten'} angehakt` : 'nichts angehakt'), h('button', { disabled: !n && !chipAktiv(), on: () => { chips.art.clear(); chips.seite.clear(); chips.waffe.clear(); manuell.clear(); neu(); } }, 'Auswahl leeren')),
    h('p', { cls: 'hin' }, 'Die Gruppen wirken zusammen: „Fußtruppen“ + „ganzes Konkordat“ = alle Fußtruppen des Konkordats. Einzelne Häkchen kommen dazu oder nehmen aus.'));
  return box;
}

// ---- Ereignis (Spalte) und Zeile darin: '*' = Hauptton der Spalte, sonst eine bestimmte Zeile (z. B. „Marsch und Sturmlauf“) ----
let zielAb = null, tabSeite = 'alle', tabMehr = false; const spId = {}, SPVAR = {};
const spWahl = ab => spId[ab] != null ? spId[ab] : OHNE_HAUPT[ab] ? '' : '*';
function slotVon(u, ab, id) { if (id == null) id = spWahl(ab); if (!id) return null; const sl = u.slots.filter(s => s.ab === ab); if (!sl.length) return null;
  if (id !== '*') return sl.find(s => s.id === id) || null; if (OHNE_HAUPT[ab]) return null;
  for (const x of HAUPT[ab] || []) { const s = sl.find(y => y.id === x); if (s) return s; } return sl.find(s => s.kette === ab) || sl[0]; }
function spVarianten(ab) { if (SPVAR[ab]) return SPVAR[ab]; const m = new Map();
  for (const u of D.einheiten) { const hs = OHNE_HAUPT[ab] ? null : slotVon(u, ab, '*'); for (const s of u.slots) if (s.ab === ab) { let e = m.get(s.id); if (!e) m.set(s.id, e = { n: 0, neben: 0, t: {} }); e.n++; if (s !== hs) e.neben++; e.t[s.titel] = (e.t[s.titel] || 0) + 1; } }
  const out = OHNE_HAUPT[ab] ? [['', '– bitte wählen –']] : [['*', 'Hauptton']];
  for (const [id, e] of [...m].filter(x => x[1].neben).sort((a, b) => b[1].n - a[1].n)) out.push([id, Object.entries(e.t).sort((a, b) => b[1] - a[1])[0][0] + ' (' + e.n + ')']);
  return SPVAR[ab] = out; }
const zielTitel = ab => { const id = spWahl(ab), v = spVarianten(ab).find(x => x[0] === id); return SP_NAME[ab] + (id && id !== '*' && v ? ' – ' + v[1].replace(/ \(\d+\)$/, '') : ''); };
const zieleFuer = abs => angehakt().flatMap(u => abs.map(ab => ({ u, s: slotVon(u, ab) })).filter(z => z.s));

// ---- Zuweisen (ein Schritt für Rückgängig, je Einheit ein Eintrag wie bisher) ----
function zuweisen(ziele, id, was) { if (!ziele.length) return;
  const ne = new Set(ziele.map(z => z.u.t)).size, text = `${id == null || id === '-' ? wahlName(id) : '„' + wahlName(id) + '“'} → ${ne === 1 ? ziele[0].u.name : ne + ' Einheiten'}${was ? ' · ' + was : ''}`;
  merke(text, ziele);
  for (const { u, s } of ziele) { if (id == null) { if (AEND[u.t]) { delete AEND[u.t][s.id]; if (!Object.keys(AEND[u.t]).length) delete AEND[u.t]; } } else setzeRoh(u, s, 'w', id); }
  speichern(); zeichne(); meldung('Zugewiesen: ' + text + ' – „↶ Rückgängig“ nimmt es zurück.');
  if (id != null && id !== '-') { stoppAlles(); spielPlatz(ziele[0].u, ziele[0].s); } }
// „gilt auch für“: (a) Zeilen derselben Einheit, die im Spiel denselben Tonplatz haben – dort klingt die Wahl ebenfalls; (b) andere Einheiten mit demselben Ton – bleiben unverändert, lassen sich dazunehmen
function hinweisEl(ziele, abs, neu) { const box = h('div', { cls: 'gilt' });
  const mit = ziele.filter(z => (z.s.gleich || []).length);
  if (mit.length) { const t = [...new Set(mit.flatMap(z => z.s.gleich.map(id => (z.u.slots.find(x => x.id === id) || {}).titel)).filter(Boolean))], ne = new Set(mit.map(z => z.u.t)).size;
    box.append(h('p', {}, h('b', {}, '⚠ Gilt im Spiel auch für: '), `„${t.slice(0, 4).join('“, „')}“${t.length > 4 ? ` und ${t.length - 4} weitere` : ''} – bei ${ne === 1 ? mit[0].u.name : ne + ' der Einheiten'} hat dieses Ereignis im Spiel denselben Tonplatz.`)); }
  const key = (ab, s) => ab + '|' + s.platz + '|' + (s.platz.startsWith('sv_') ? '' : s.sd) + '|' + (s.v || ''), pl = new Set(ziele.filter(z => z.s.platz !== '-' && z.s.mode !== 'ruf').map(z => key(z.s.ab, z.s)));
  const auch = D.einheiten.filter(u => !istAn(u) && abs.some(ab => { const s = slotVon(u, ab); return s && pl.has(key(ab, s)); }));
  if (auch.length) box.append(h('p', {}, h('b', {}, 'Gleicher Ton im Spiel auch bei: '), auch.slice(0, 8).map(u => u.name).join(', ') + (auch.length > 8 ? ` und ${auch.length - 8} weiteren` : '') + ' – nicht angehakt, bleiben unverändert. ',
    h('button', { cls: 'kl', on: () => { for (const u of auch) hakenUm(u, true); neu(); } }, 'Auch anhaken')));
  return box.children.length ? box : null; }

// ---- Bibliothek nach Gehör (für den Auswahl-Dialog und die Ansicht „Bibliothek“) ----
let bibKat = D.bib[0].id, bibSuche = '', bibNurFav = false, bibScroll = 0; const bibOffen = new Set();
// o: { ziel: [{u, s}] | null (Vorhören mit Seite/Filter/Lautstärke der ersten Stelle), knopf: Text, wahl: id => …, aktiv: () => id }
function bibBau(o) {
  const z0 = o.ziel && o.ziel[0];
  const such = h('input', { type: 'search', placeholder: 'Suchen: Name, Schlüssel oder Datei …', 'aria-label': 'Töne suchen' }), nav = h('div', { cls: 'bibnav' }), lst = h('div', { cls: 'biblist' });
  such.value = bibSuche;
  const hoer = id => { for (const a of laufend) try { a.pause(); } catch (e) {} laufend.clear(); let k, vol = 0.6, ton = 1;
    if (id.startsWith('k:')) k = id.slice(2); else { const p = id.slice(2); k = zieh(vorhanden(z0 ? kandidaten(p, z0.s.sd, z0.s.v) : platzKeys(p).map(x => ({ k: x[0] })))); }
    if (z0) { const w = wert(z0.u, z0.s); vol = w.vol; ton = w.ton; } if (k) spiel(k, vol, ton); };
  const reihe = (id, titel, meta, kind, auf) => { const ok = zuweisbar(id), fav = FAV.has(id);
    const stern = h('button', { cls: 'stern' + (fav ? ' an' : ''), title: 'Favorit', 'aria-label': 'Favorit: ' + titel, 'aria-pressed': fav ? 'true' : 'false' }, fav ? '★' : '☆');
    stern.onclick = e => { e.stopPropagation(); favUm(id); stern.classList.toggle('an', FAV.has(id)); stern.textContent = FAV.has(id) ? '★' : '☆'; if (bibNurFav) zeig(); };
    const r = h('div', { cls: 'bt' + (kind ? ' kind' : '') + (o.aktiv && o.aktiv() === id ? ' an' : ''), 'data-id': id },
      h('button', { cls: 'play', 'aria-label': 'Abspielen: ' + titel, disabled: !SND, on: e => { e.stopPropagation(); hoer(id); } }, '▶'), stern,
      h('div', { cls: 'bn' }, h('b', {}, titel), h('small', { html: meta }), nutzEl(id)), auf || h('span'),
      h('button', { cls: 'gold', disabled: !ok, title: ok ? '' : 'Älterer Einzelton außerhalb der Tonplätze – lässt sich beim Einbau ins Spiel noch nicht zuweisen.', on: e => { e.stopPropagation(); o.wahl(id); } }, ok ? o.knopf : 'nur Standard'));
    if (o.zeile) r.onclick = () => { if (ok) o.wahl(id); };
    return r; };
  function zeig() {
    const q = bibSuche.trim().toLowerCase(), alle = q || bibNurFav; lst.innerHTML = ''; let n = 0;
    nav.querySelectorAll('button').forEach(b => b.classList.toggle('an', !q && b.dataset.k === (bibNurFav ? '*fav' : bibKat)));
    for (const b of alle ? D.bib : [BIBKAT[bibKat]]) { let kopf = !alle, unterAlt = null;
      for (const [p, unter] of b.e) { const keys = platzKeys(p), pt = (platzName(p) + ' ' + p + ' ' + b.titel + ' ' + (unter || '')).toLowerCase(), pq = !q || pt.includes(q), pf = !bibNurFav || FAV.has('p:' + p);
        const kt = keys.filter(([k]) => (pq || (k + ' ' + datei(k)).toLowerCase().includes(q)) && (pf || FAV.has('k:' + k)));
        if (!kt.length) continue; n++;
        if (!kopf) { lst.append(h('div', { cls: 'bkopf' }, b.titel)); kopf = true; }
        if ((unter || null) !== unterAlt) { unterAlt = unter || null; if (unter) lst.append(h('div', { cls: 'bunter' }, unter)); }
        const erzwungen = keys.length > 1 && ((q && !pt.includes(q)) || (bibNurFav && !FAV.has('p:' + p))), offen = keys.length > 1 && (erzwungen || bibOffen.has(p));
        const auf = keys.length > 1 ? h('button', { cls: 'auf', 'aria-expanded': offen ? 'true' : 'false', on: e => { e.stopPropagation(); if (bibOffen.has(p)) bibOffen.delete(p); else bibOffen.add(p); zeig(); } }, (offen ? '▾ ' : '▸ ') + keys.length + ' Töne') : null;
        lst.append(reihe('p:' + p, platzName(p), platzMeta(p), false, auf));
        if (offen) for (const [k, sd] of (erzwungen ? kt : keys)) lst.append(reihe('k:' + k, tonName(k), tonMeta(k, sd), true)); } }
    if (!n) lst.append(h('p', { cls: 'leer' }, bibNurFav && !q ? 'Noch keine Favoriten – der Stern ☆ an einem Ton merkt ihn hier vor.' : 'Nichts gefunden.'));
  }
  nav.append(h('button', { 'data-k': '*fav', on: () => { bibNurFav = true; bibSuche = such.value = ''; lst.scrollTop = 0; zeig(); } }, '★ Favoriten'));
  for (const b of D.bib) nav.append(h('button', { 'data-k': b.id, on: () => { bibNurFav = false; bibKat = b.id; bibSuche = such.value = ''; lst.scrollTop = 0; zeig(); } }, b.titel, h('small', {}, ' ' + b.e.length)));
  such.oninput = () => { bibSuche = such.value; zeig(); }; lst.onscroll = () => { bibScroll = lst.scrollTop; };
  zeig();
  return { el: h('div', { cls: 'bib' }, nav, h('div', { cls: 'bibmitte' }, such, lst)), neu: () => { const y = lst.scrollTop; zeig(); lst.scrollTop = y; }, such, lst };
}
// Auswahl-Dialog: Ton aus der Bibliothek für eine oder viele Stellen
function bibDialog(ziele, titel, fertig) {
  const alt = document.getElementById('bibDlg'); if (alt) alt.remove();
  const w0 = wert(ziele[0].u, ziele[0].s).w, gleich = ziele.every(z => wert(z.u, z.s).w === w0), k0 = katVonWahl(w0) || katVonPlatz(ziele[0].s.platz) || (ziele[0].s.mode === 'ruf' ? 'stimmen' : null);
  if (k0) { bibKat = k0; bibNurFav = false; bibSuche = ''; }
  const zu = () => { dlg.remove(); document.removeEventListener('keydown', taste); }, taste = e => { if (e.key === 'Escape') zu(); };
  const bib = bibBau({ ziel: ziele, knopf: ziele.length > 1 ? 'Zuweisen' : 'Wählen', wahl: id => { zu(); fertig(id); }, aktiv: () => gleich ? w0 : null });
  const dlg = h('div', { id: 'bibDlg', role: 'dialog', 'aria-label': 'Bibliothek' }, h('div', { cls: 'ak' },
    h('div', { cls: 'akopf' }, h('b', {}, 'Ton wählen für: ' + titel), h('button', { cls: 'x', 'aria-label': 'Schließen', on: zu }, '✕')),
    h('p', { cls: 'hin' }, '▶ spielt mit Lautstärke und Stimmfilter der ' + (ziele.length > 1 ? 'ersten angehakten Einheit' : 'Einheit') + '. Ein Platz mit mehreren Tönen spielt im Spiel zufällig einen davon; „▸ Töne“ zeigt sie einzeln.'), bib.el));
  dlg.onclick = e => { if (e.target === dlg) zu(); }; document.addEventListener('keydown', taste); document.body.append(dlg);
  const an = bib.lst.querySelector('.bt.an'); if (an) an.scrollIntoView({ block: 'center' }); bib.such.focus();
}

// ---- Ansicht „Tabelle“: Zeilen = Einheiten, Spalten = Ereignisse ----
function zelle(u, ab) {
  const td = h('td', { cls: 'z' + (zielAb === ab ? ' ziel' : '') }), id = spWahl(ab), sl = u.slots.filter(s => s.ab === ab);
  td.onclick = () => { zielAb = ab; zeichne(); };
  if (!sl.length) { td.classList.add('leer'); return td; }
  const s = slotVon(u, ab);
  if (!s) { td.classList.add('leer'); if (!id) td.append(h('span', { cls: 'viele' }, sl.length + (sl.length === 1 ? ' Ton' : ' Töne'))); return td; }
  const w = wert(u, s), g = grund(s), zus = [];
  if (geaendert(u, s)) td.classList.add('geaendert'); if (zielAb === ab && istAn(u)) td.classList.add('trifft');
  if (Math.abs(w.vol - g.vol) > 1e-6) zus.push('Lautst. ' + Math.round(w.vol / g.vol * 100) + ' %'); if (Math.abs(w.ton - 1) > 1e-6) zus.push('Höhe ' + Math.round(w.ton * 100) + ' %');
  if (id === '*' && sl.length > 1) zus.push('+' + (sl.length - 1) + ' weitere');
  td.title = s.titel + (sl.length > 1 && id === '*' ? ` (Hauptton; ${sl.length - 1} weitere Zeilen über die Auswahl im Spaltenkopf)` : '');
  td.append(h('div', { cls: 'zi' }, h('button', { cls: 'play kl', 'aria-label': `Abspielen: ${u.name}, ${s.titel}`, disabled: !SND || w.w === '-', on: e => { e.stopPropagation(); spielPlatz(u, s); } }, '▶'),
    h('div', { cls: 'zt' }, h('span', { cls: 'zn' }, tonKurz(u, s)), zus.length ? h('small', {}, zus.join(' · ')) : null)));
  return td;
}
function zeichneTabelle() {
  const kopfEl = document.getElementById('tKopf'), wrap = document.getElementById('tWrap'), x = wrap.scrollLeft, y = wrap.scrollTop; kopfEl.innerHTML = ''; wrap.innerHTML = '';
  kopfEl.append(schnellBau(zeichne));
  const filt = h('div', { cls: 'tfilt' }, h('span', { cls: 'sgt' }, 'Zeilen'));
  for (const [id, name] of [['alle', 'beide Seiten'], ['A', 'Konkordat'], ['D', 'Aschenwacht']]) filt.append(h('button', { cls: 'chip' + (tabSeite === id ? ' an' : ''), on: () => { tabSeite = id; zeichne(); } }, name));
  const mehr = h('input', { type: 'checkbox' }); mehr.checked = tabMehr; mehr.onchange = () => { tabMehr = mehr.checked; if (!tabMehr && SP_EXTRA[zielAb]) zielAb = null; zeichne(); };
  filt.append(h('label', { cls: 'hk1' }, mehr, ' Ankunft, Rufe und Winter zeigen'), h('span', { cls: 'hin' }, 'Spaltenkopf antippen = Ereignis wählen. Messingrand = von dir geändert.'));
  kopfEl.append(filt);
  const sp = SPALTEN.filter(([ab]) => tabMehr || !SP_EXTRA[ab]);
  const gruppen = [];
  for (const sd of ['A', 'D']) if (tabSeite === 'alle' || tabSeite === sd) gruppen.push([seiteTxt(sd), D.kat.flatMap(k => D.einheiten.filter(u => echt(u) && u.sd === sd && u.kat === k)), sd]);
  if (tabMehr) gruppen.push(['Stimmen und Karte', D.einheiten.filter(u => !echt(u) && (tabSeite === 'alle' || !u.sd || u.sd === tabSeite)), '']);
  const sicht = gruppen.flatMap(g => g[1]), alleAn = sicht.length && sicht.every(istAn);
  const haupt = h('input', { type: 'checkbox', 'aria-label': 'Alle sichtbaren Einheiten anhaken' }); haupt.checked = alleAn; haupt.onchange = () => { for (const u of sicht) hakenUm(u, haupt.checked); zeichne(); };
  const kopf = h('tr', {}, h('th', { cls: 'hkz' }, h('label', { cls: 'hkl' }, haupt)), h('th', { cls: 'en' }, 'Einheit'));
  for (const [ab, name] of sp) { const vars = spVarianten(ab), th = h('th', { cls: 'sp' + (zielAb === ab ? ' ziel' : '') }, h('button', { cls: 'spk', 'aria-pressed': zielAb === ab ? 'true' : 'false', on: () => { zielAb = zielAb === ab ? null : ab; zeichne(); } }, name));
    if (vars.length > 1) { const sel_ = h('select', { 'aria-label': 'Zeile in der Spalte ' + name }); for (const [id, t] of vars) sel_.append(h('option', { value: id }, t)); sel_.value = spWahl(ab); sel_.onchange = () => { spId[ab] = sel_.value; zielAb = ab; zeichne(); }; th.append(sel_); }
    kopf.append(th); }
  const tb = h('tbody');
  for (const [titel, es, sd] of gruppen) { if (!es.length) continue;
    tb.append(h('tr', { cls: 'gr ' + sd }, h('td', { colspan: sp.length + 2 }, titel)));
    for (const u of es) { const cb = h('input', { type: 'checkbox', 'aria-label': u.name + ' anhaken' }); cb.checked = istAn(u); cb.onchange = () => { hakenUm(u, cb.checked); zeichne(); };
      const n = zahlGeaendert(u), tr = h('tr', { cls: istAn(u) ? 'an' : '' }, h('td', { cls: 'hkz' }, h('label', { cls: 'hkl' }, cb)),
        h('td', { cls: 'en' }, h('div', { cls: 'enz' }, u.img ? h('img', { src: u.img, alt: '' }) : h('i'), h('span', { cls: 'nm' }, u.name, n ? h('small', { cls: 'mark' }, ` ● ${n}`) : null),
          h('button', { cls: 'kl stift', title: 'Alle Töne dieser Einheit einzeln bearbeiten', 'aria-label': u.name + ' einzeln bearbeiten', on: () => { sel = u.t; if (u.sd) seite = u.sd; kat = 'Alle'; ansicht = 'einzeln'; merkeSel(); zeichne(); window.scrollTo({ top: 0 }); } }, '✎'))));
      for (const [ab] of sp) tr.append(zelle(u, ab));
      tb.append(tr); } }
  wrap.append(h('table', { cls: 'tt' }, h('thead', {}, kopf), tb)); wrap.scrollLeft = x; wrap.scrollTop = y;
}
// Aktionsleiste unten: was ist gewählt, Ton zuweisen, Lautstärke und Tonhöhe für alle angehakten
function zeichneLeiste() {
  const L = document.getElementById('leiste'); L.innerHTML = ''; L.hidden = ansicht !== 'tabelle'; if (L.hidden) return;
  const an = angehakt(), ab = zielAb, id = ab ? spWahl(ab) : null, ziele = ab && id ? zieleFuer([ab]) : [], ohne = ab && id ? an.length - ziele.length : 0;
  const text = h('div', { cls: 'lt' });
  if (!an.length) text.append('① Einheiten anhaken (Häkchen links oder Schnellwahl oben)' + (ab ? '' : ', ② Spaltenkopf antippen, ③ Ton wählen.'));
  else if (!ab) text.append(h('b', {}, `${an.length} ${an.length === 1 ? 'Einheit' : 'Einheiten'} angehakt`), ' – jetzt einen Spaltenkopf antippen (Ereignis).');
  else if (!id) text.append(h('b', {}, `${an.length} angehakt · ${SP_NAME[ab]}`), ' – im Spaltenkopf wählen, welche Zeile gemeint ist.');
  else text.append(h('b', {}, `${ziele.length} ${ziele.length === 1 ? 'Einheit' : 'Einheiten'} · ${zielTitel(ab)}`), ohne ? ` · ${ohne} angehakte ohne diesen Platz (grau) bleiben aus` : '');
  const los = !ziele.length, was = ab ? zielTitel(ab) : '';
  const knoepfe = h('div', { cls: 'lk' },
    h('button', { cls: 'gold', disabled: los, on: () => bibDialog(ziele, `${ziele.length === 1 ? ziele[0].u.name : ziele.length + ' Einheiten'} · ${was}`, w => zuweisen(ziele, w, was)) }, 'Ton aus der Bibliothek …'),
    h('button', { disabled: los, on: () => zuweisen(ziele, '-', was) }, 'Kein Ton'), h('button', { disabled: los, title: 'Ton, Lautstärke und Tonhöhe dieser Stellen zurück auf den Stand im Spiel', on: () => zuweisen(ziele, null, was) }, 'Wie im Spiel'));
  const gem = f => { const w = ziele.map(f); return w.length && w.every(x => Math.abs(x - w[0]) < 0.006) ? w[0] : null; };
  const regler = (name, feld, min, max, step, lies, schreib) => { const g = gem(lies), r = h('input', { type: 'range', min, max, step, 'aria-label': name + ' für alle angehakten' }), b = h('b', {}, los ? '–' : g != null ? Math.round(g * 100) + ' %' : 'verschieden');
    r.value = g != null ? Math.round(g * 100) : 100; r.disabled = los;
    r.oninput = () => { merke(`${name} ${r.value} % → ${ziele.length} Stellen · ${was}`, ziele, 'm|' + feld + '|' + ab + '|' + id); for (const z of ziele) setzeRoh(z.u, z.s, feld, schreib(z, r.value / 100)); speichern(); b.textContent = r.value + ' %'; zeichneTabelle(); undoKnopf(); };
    r.onchange = () => { if (ziele.length) { stoppAlles(); spielPlatz(ziele[0].u, ziele[0].s); } };
    return h('label', { cls: 'regler' }, name + ' ', r, b); };
  knoepfe.append(regler('Lautstärke', 'vol', 0, 200, 5, z => wert(z.u, z.s).vol / z.s.vol, (z, f) => Math.min(1, +(z.s.vol * f).toFixed(3))), regler('Tonhöhe', 'ton', 50, 150, 1, z => wert(z.u, z.s).ton, (z, f) => f));
  L.append(text, knoepfe);
  if (ziele.length) { const hi = hinweisEl(ziele, [ab], zeichne); if (hi) L.append(hi); }
}

// ---- Ansicht „Bibliothek“ (vom Ton aus): Ton wählen → Ereignisse und Einheiten anhaken → zuweisen ----
let bibSel = null, bibAnsicht = null; const bibAbs = new Set();
function zeichneKarte() {
  const K = document.getElementById('karte'); if (!K) return; const y = K.scrollTop; K.innerHTML = '';
  if (!bibSel) { K.append(h('p', { cls: 'leer' }, 'Links einen Ton auswählen. Dann hier anhaken, bei welchen Einheiten und Ereignissen er spielen soll.')); return; }
  const id = bibSel, x = id.slice(2), istP = id.startsWith('p:');
  K.append(h('div', { cls: 'kkopf' }, h('button', { cls: 'play', disabled: !SND, 'aria-label': 'Abspielen', on: () => { stoppAlles(); const k = istP ? zieh(vorhanden(platzKeys(x).map(e => ({ k: e[0] })))) : x; if (k) spiel(k, 0.6, 1); } }, '▶'),
    h('div', {}, h('h2', {}, wahlName(id)), h('div', { cls: 'unter', html: (BIBKAT[katVonWahl(id)] ? esc(BIBKAT[katVonWahl(id)].titel) + ' · ' : '') + (istP ? platzMeta(x) : tonMeta(x, (platzKeys(KEYPOOL[x] ? KEYPOOL[x][0] : x).find(e => e[0] === x) || [])[1])) }))));
  const nl = nutzListe(id); K.append(h('h3', {}, 'Benutzt von'), nl.length ? nutzVoll(nl) : h('p', { cls: 'hin' }, 'Noch nirgends benutzt.'));
  K.append(h('h3', {}, 'Zuweisen: bei welchem Ereignis?'));
  const er = h('div', { cls: 'sg' });
  for (const [ab, name] of SPALTEN) er.append(h('button', { cls: 'chip' + (bibAbs.has(ab) ? ' an' : ''), 'aria-pressed': bibAbs.has(ab) ? 'true' : 'false', on: () => { if (bibAbs.has(ab)) bibAbs.delete(ab); else bibAbs.add(ab); zeichneKarte(); } }, name));
  K.append(er);
  const abs = SPALTEN.map(s => s[0]).filter(ab => bibAbs.has(ab));
  for (const ab of abs) { const vars = spVarianten(ab); if (vars.length < 2) continue; const sel_ = h('select', { 'aria-label': 'Zeile bei ' + SP_NAME[ab] }); for (const [vid, t] of vars) sel_.append(h('option', { value: vid }, t)); sel_.value = spWahl(ab); sel_.onchange = () => { spId[ab] = sel_.value; zeichneKarte(); };
    K.append(h('label', { cls: 'zeilew' }, SP_NAME[ab] + ': ', sel_)); }
  K.append(h('h3', {}, 'Bei welchen Einheiten?'), schnellBau(zeichneKarte));
  const mitPseudo = abs.some(ab => SP_EXTRA[ab]) || D.einheiten.some(u => !echt(u) && istAn(u));
  for (const [titel, es] of [['Konkordat', D.einheiten.filter(u => echt(u) && u.sd === 'A')], ['Aschenwacht', D.einheiten.filter(u => echt(u) && u.sd === 'D')], ...(mitPseudo ? [['Stimmen und Karte', D.einheiten.filter(u => !echt(u))]] : [])]) {
    const g = h('div', { cls: 'eg' });
    for (const u of es) { const sl = abs.map(ab => slotVon(u, ab)).filter(Boolean), cb = h('input', { type: 'checkbox' }); cb.checked = istAn(u); cb.onchange = () => { hakenUm(u, cb.checked); zeichneKarte(); };
      const hat = sl.length && sl.every(s => wert(u, s).w === id);
      g.append(h('label', { cls: 'eh' + (abs.length && !sl.length ? ' ohne' : '') + (hat ? ' hat' : ''), title: abs.length && !sl.length ? 'Hat dieses Ereignis nicht' : hat ? 'Spielt diesen Ton hier schon' : '' }, cb, ' ' + u.name + (hat ? ' ✓' : ''))); }
    K.append(h('div', { cls: 'egt' }, titel), g); }
  const ziele = zieleFuer(abs), ne = new Set(ziele.map(z => z.u.t)).size, fehlt = abs.filter(ab => !spWahl(ab)), ok = zuweisbar(id);
  const hi = ziele.length ? hinweisEl(ziele, abs, zeichneKarte) : null; if (hi) K.append(hi);
  K.append(h('div', { cls: 'kfuss' }, h('button', { cls: 'gold', disabled: !ziele.length || !ok, on: () => zuweisen(ziele, id, abs.map(zielTitel).join(', ')) }, ziele.length ? `Zuweisen: ${ne} ${ne === 1 ? 'Einheit' : 'Einheiten'}${ziele.length > ne ? ', ' + ziele.length + ' Stellen' : ''}` : 'Zuweisen'),
    h('span', { cls: 'hin' }, !ok ? 'Älterer Einzelton außerhalb der Tonplätze – nicht zuweisbar.' : !abs.length ? 'Erst ein Ereignis wählen.' : fehlt.length ? `Bei „${fehlt.map(ab => SP_NAME[ab]).join('“, „')}“ noch die Zeile wählen.` : !ziele.length ? 'Jetzt Einheiten anhaken.' : 'Lautstärke und Tonhöhe bleiben je Einheit, wie sie sind.')));
  K.scrollTop = y;
}
function zeichneBib() {
  const v = document.getElementById('vBib'); v.innerHTML = '';
  if (!bibAbs.size && zielAb) bibAbs.add(zielAb);
  bibAnsicht = bibBau({ ziel: null, knopf: 'Auswählen', zeile: true, wahl: id => { bibSel = id; bibAnsicht.neu(); zeichneKarte(); }, aktiv: () => bibSel });
  v.append(bibAnsicht.el, h('div', { id: 'karte' })); bibAnsicht.lst.scrollTop = bibScroll; zeichneKarte();
}

// ---- Ansichten umschalten ----
const kopfHoehe = () => document.documentElement.style.setProperty('--kopfh', document.querySelector('header').offsetHeight + 'px');
window.addEventListener('resize', kopfHoehe);
function zeichne() {
  const y = window.scrollY; kopfHoehe();
  for (const [id, a] of [['vTabelle', 'tabelle'], ['vBib', 'bib'], ['vEinzeln', 'einzeln']]) document.getElementById(id).hidden = ansicht !== a;
  document.querySelectorAll('#ansichten button').forEach(b => { b.classList.toggle('an', b.dataset.a === ansicht); b.setAttribute('aria-pressed', b.dataset.a === ansicht ? 'true' : 'false'); });
  if (ansicht === 'tabelle') zeichneTabelle(); else if (ansicht === 'bib') zeichneBib(); else { liste(); pult(); }
  zeichneLeiste(); undoKnopf(); window.scrollTo(0, y);
}
document.querySelectorAll('#ansichten button').forEach(b => { b.onclick = () => { ansicht = b.dataset.a; merkeSel(); stoppAlles(); zeichne(); window.scrollTo({ top: 0 }); }; });
document.getElementById('undo').onclick = rueckgaengig;
document.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !/^(INPUT|TEXTAREA|SELECT)$/.test((e.target || {}).tagName || '')) { e.preventDefault(); rueckgaengig(); } });

function auffrischen(u, s, row) { row.classList.toggle('geaendert', geaendert(u, s)); row.querySelector('.ton').innerHTML = tonText(u, s); liste(); }
function pult() {
  const u = U[sel], m = document.getElementById('pult'); m.innerHTML = '';
  const sn = u.sd === 'A' ? 'Konkordat' : u.sd === 'D' ? 'Aschenwacht' : 'beide Seiten';
  m.append(h('div', { cls: 'kopf' }, u.img ? h('img', { src: u.img, alt: '' }) : null,
    h('div', {}, h('h2', {}, u.name), h('div', { cls: 'unter' }, `${sn} · ${u.kat}${u.mech ? ' (nur mit Kampfmaschinen)' : ''} · Stimme: ${u.stimme}`)),
    h('div', { cls: 'hk' }, h('button', { id: 'kette', cls: 'gold', disabled: !SND, on: e => kette(u, e.currentTarget) }, '▶ Im Zusammenhang hören'),
      h('button', { on: () => { if (!zahlGeaendert(u) || confirm(`Alle ${zahlGeaendert(u)} Änderungen bei ${u.name} zurücksetzen?`)) { merkeAlles(u.name + ' zurückgesetzt'); delete AEND[u.t]; speichern(); liste(); pult(); undoKnopf(); } } }, 'Einheit zurücksetzen'))));
  m.append(h('p', { cls: 'hin', style: 'margin-top:8px' }, '„Im Zusammenhang“: anwählen, ziehen, schießen mit Einschlag, getroffen – mit den Einstellungen unten. Lautstärke wie im Spiel (vor dem Effekte-Regler), Tonhöhe 100 % = wie im Spiel (dort leicht gestreut).'));
  for (const [ab, titel] of D.ab) { const sl = u.slots.filter(s => s.ab === ab); if (!sl.length) continue;
    m.append(h('div', { cls: 'ab' }, titel)); for (const s of sl) m.append(zeile(u, s)); }
}

// ---- Export / Import ----
function exportDaten() {
  const aenderungen = [];
  for (const t of Object.keys(AEND)) { const u = U[t]; if (!u) continue;
    for (const id of Object.keys(AEND[t])) { const s = u.slots.find(x => x.id === id); if (!s) continue; const w = wert(u, s);
      aenderungen.push({ einheit: t, name: u.name, seite: u.sd, anlass: (D.ab.find(a => a[0] === s.ab) || [])[1], platz_id: id, titel: s.titel, platz_spiel: s.platz, filter: s.v || null,
        wahl: w.w, schluessel: w.w.startsWith('k:') ? w.w.slice(2) : null, datei: w.w.startsWith('k:') ? datei(w.w.slice(2)) : null, platz_neu: w.w.startsWith('p:') && w.w.slice(2) !== s.platz ? w.w.slice(2) : null,
        lautstaerke_spiel: s.vol, lautstaerke: +w.vol.toFixed(3), tonhoehe: +w.ton.toFixed(3), ...(s.mode === 'ruf' ? { filter_stimme: w.filt, filter_staerke: +w.fst.toFixed(2) } : {}) }); } }
  return { werkzeug: 'Armargeddon Ton-Pult', stand_toene: D.stand, exportiert: new Date().toISOString(), hinweis: 'wahl: p:<Tonplatz> | k:<Tonschlüssel> | - (kein Ton); lautstaerke wie playSound im Spiel (0–1, vor dem Effekte-Regler); tonhoehe = Faktor auf die Abspielrate', aenderungen, roh: AEND };
}
const dlg = document.getElementById('dlg');
function dialog(titel, text, wertTxt, knoepfe) {
  document.getElementById('dlgTitel').textContent = titel; document.getElementById('dlgText').textContent = text;
  const f = document.getElementById('dlgFeld'); f.value = wertTxt; const k = document.getElementById('dlgKnoepfe'); k.innerHTML = '';
  for (const [n, fn, gold] of knoepfe) k.append(h('button', { type: 'button', cls: gold ? 'gold' : '', on: () => fn(f) }, n));
  k.append(h('button', { type: 'submit' }, 'Schließen'));
  if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
}
document.getElementById('export').onclick = () => {
  const txt = JSON.stringify(exportDaten(), null, 1), n = exportDaten().aenderungen.length;
  dialog('Export', n ? `${n} Änderung${n > 1 ? 'en' : ''}. Kopieren oder als Datei speichern und an Claude geben.` : 'Noch keine Änderungen – der Export ist leer.', txt, [
    ['Kopieren', async f => { try { await navigator.clipboard.writeText(f.value); } catch (e) { f.select(); document.execCommand('copy'); } meldung('In die Zwischenablage kopiert.'); }, true],
    ['Als Datei speichern', f => { const a = h('a', { href: URL.createObjectURL(new Blob([f.value], { type: 'application/json' })), download: `tonpult_${new Date().toISOString().slice(0, 10)}.json` }); document.body.append(a); a.click(); a.remove(); }]]);
};
document.getElementById('import').onclick = () => {
  const datei_ = h('input', { type: 'file', accept: '.json,application/json', style: 'display:none' }); document.body.append(datei_);
  dialog('Import', 'Export-Text hier einfügen oder eine Datei laden. Übernehmen setzt die Plätze aus dem Export; alle anderen Einstellungen bleiben erhalten.', '', [
    ['Datei laden', f => { datei_.onchange = async () => { const x = datei_.files[0]; if (x) f.value = await x.text(); }; datei_.click(); }],
    ['Übernehmen', f => { try { const o = JSON.parse(f.value), neu = {}; merkeAlles('Import');
        if (o.roh && typeof o.roh === 'object') Object.assign(neu, o.roh);
        else for (const a of o.aenderungen || []) { const e = ((neu[a.einheit] = neu[a.einheit] || {})[a.platz_id] = {}); e.w = a.wahl; e.vol = a.lautstaerke; e.ton = a.tonhoehe; }
        let n = 0; for (const t of Object.keys(neu)) { if (!U[t]) continue; AEND[t] = AEND[t] || {}; for (const id of Object.keys(neu[t])) { const s = U[t].slots.find(x => x.id === id); if (!s) continue; const e = neu[t][id];
            for (const k of ['w', 'vol', 'ton', ...(s.mode === 'ruf' ? ['filt', 'fst'] : [])]) if (e[k] != null) setzeRoh(U[t], s, k, e[k]); n++; } if (!Object.keys(AEND[t]).length) delete AEND[t]; }
        speichern(); zeichne(); dlg.close(); meldung(`${n} ${n === 1 ? "Platz" : "Plätze"} übernommen.`); } catch (e) { meldung('Das ist kein gültiger Export: ' + e.message); } }, true]]);
};
document.getElementById('allesZurueck').onclick = () => { const n = Object.values(AEND).reduce((a, x) => a + Object.keys(x).length, 0); if (n && confirm(`Alle ${n} Änderungen bei allen Einheiten zurücksetzen?`)) { merkeAlles('Alles zurückgesetzt'); AEND = {}; speichern(); zeichne(); } };
document.getElementById('stopp').onclick = stoppAlles;
let meldT = 0; function meldung(t) { const s = document.getElementById('status'); s.textContent = t; clearTimeout(meldT); meldT = setTimeout(() => s.textContent = SND ? Object.keys(SND).length + ' Töne geladen.' : '', 4000); }
// Effekte-Regler wie im Spiel (gleicher Speicherplatz)
{ const r = document.getElementById('volEffekte'), b = document.getElementById('volEffekteW'); r.value = Math.round(effektVol * 100); b.textContent = r.value;
  r.oninput = () => { effektVol = r.value / 100; b.textContent = r.value; try { localStorage.setItem('arm.effektvol', effektVol); } catch (e) {} for (const a of laufend) if (a._vol != null) try { a.volume = Math.min(1, a._vol * effektVol); } catch (e) {} }; }
zeichne();
// Töne nachladen
{ const sp = document.createElement('script'); sp.src = 'src/sound_pult.js'; sp.async = false; document.body.append(sp);   // M9: nur im Pult wählbare Töne (vor sound.js, feste Reihenfolge)
  const sc = document.createElement('script'); sc.src = 'src/sound.js'; sc.async = false;
  sc.onload = () => { SND = window.SOUNDS || {}; const n = Object.values(AEND).reduce((a, x) => a + Object.keys(x).length, 0); document.getElementById('status').textContent = Object.keys(SND).length + ' Töne geladen · ' + n + ' eigene Wahlen, gespeichert für ' + (location.origin === 'null' ? 'diese Datei' : location.host); zeichne(); };   // Hinweis: die Auswahl liegt je Adresse getrennt (lokal ≠ GitHub Pages)
  sc.onerror = () => { document.getElementById('status').textContent = 'Töne konnten nicht geladen werden (src/sound.js).'; };
  document.body.append(sc); }
