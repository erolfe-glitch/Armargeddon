// Ton-Pult: Seitenlogik (tools/tonpult_bau.mjs bettet das nach „const D = …“ ein). Abspielen wie im Spiel (src/ui.js: sndPick, playSound, motorRev, Salve).
'use strict';
const SPEICHER = 'arm.tonpult', SPEICHER_SEL = 'arm.tonpult.sel', DUCK_F = 0.4;
let SND = null, effektVol = 1, laufend = new Set(), zeiten = [];
let AEND = {};   // { typ: { platzId: { w: 'p:platz' | 'k:schlüssel' | '-', vol, ton } } } – nur Abweichungen von der Grundeinstellung
try { const f = localStorage.getItem('arm.effektvol'); if (f != null && f !== '') effektVol = +f; } catch (e) {}
try { AEND = JSON.parse(localStorage.getItem(SPEICHER) || '{}') || {}; } catch (e) { AEND = {}; }
let sel = null, seite = 'A', kat = 'Alle';
try { const s = JSON.parse(localStorage.getItem(SPEICHER_SEL) || 'null'); if (s) { sel = s.sel; seite = s.seite || 'A'; kat = s.kat || 'Alle'; } } catch (e) {}
const U = Object.fromEntries(D.einheiten.map(u => [u.t, u]));
if (!U[sel]) sel = D.einheiten.find(u => u.sd === seite).t;
const merkeSel = () => { try { localStorage.setItem(SPEICHER_SEL, JSON.stringify({ sel, seite, kat })); } catch (e) {} };
// Paket G 4b (2026-11-21): zusätzlich ein Verlauf der letzten 20 Stände (Zeitstempel) – falls Auswahl verloren geht, lässt sie sich wiederherstellen
const SPEICHER_VERLAUF = 'arm.tonpult.verlauf';
let verlaufT = 0;
const speichern = () => { try { localStorage.setItem(SPEICHER, JSON.stringify(AEND));
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
function setze(u, s, feld, x) {
  const g = grund(s), a = AEND[u.t] = AEND[u.t] || {}, e = a[s.id] = a[s.id] || {};
  if (feld === 'vol' || feld === 'ton' || feld === 'fst' ? Math.abs(x - g[feld]) < 1e-6 : x === g[feld]) delete e[feld]; else e[feld] = x;
  if (!Object.keys(e).length) delete a[s.id]; if (!Object.keys(a).length) delete AEND[u.t];
  speichern();
}
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

// ---- Auswahlliste: wie im Spiel, andere Plätze der Gruppe, einzelne Töne ----
function optionen(u, s) {
  const g = grund(s).w, opts = [], gesehen = new Set();
  const platzName = p => { const m = p.match(/^sv_([a-z]+)_[AD](\d*)$/); return m ? (D.satz[m[1]] || m[1]) + (m[2] ? ', Stimme ' + m[2] : ', Stimmen reihum') : (D.name[p] || p); };
  const lab = p => { const n = kandidaten(p, s.sd, s.v).length; return `${platzName(p)} · Platz ${p}${n > 1 ? ` (Zufall aus ${n})` : ''}`; };
  opts.push(['Wie im Spiel', [[g, g === '-' ? 'Kein Ton (wie im Spiel)' : lab(s.platz) + ' – wie im Spiel']]]);
  let plaetze;
  if (s.gruppe === 'spruch') { const m = s.platz.match(/^sv_([a-z]+)_([AD])$/), alle = Object.keys(D.pools).filter(p => (p.match(/^sv_[a-z]+_([AD])\d+$/) || [])[1] === m[2]);
    plaetze = [...alle.filter(p => p.startsWith(s.platz)), ...[...new Set(alle.map(p => p.replace(/\d+$/, '')))].filter(p => p !== s.platz)]; }
  else plaetze = (D.gruppen[s.gruppe] || []).filter(p => p !== s.platz);
  const andere = plaetze.filter(p => kandidaten(p, s.sd, s.v).length).map(p => ['p:' + p, lab(p)]);
  if (andere.length) opts.push([s.gruppe === 'spruch' ? 'Andere Stimmen' : 'Andere Plätze derselben Gruppe', andere]);
  const keyQuellen = s.gruppe === 'spruch' ? [s.platz] : [s.platz, ...plaetze];
  const einzeln = [];
  for (const p of keyQuellen) for (const c of kandidaten(p, s.sd, s.v)) { if (gesehen.has(c.k)) continue; gesehen.add(c.k); einzeln.push(['k:' + c.k, `${c.k}${c.sd ? (c.sd === 'A' ? ' (Konkordat)' : ' (Aschenwacht)') : ''} · ${kurz(datei(c.k))}`]); }
  if (einzeln.length) opts.push(['Einzelne Töne', einzeln]);
  if (g !== '-') opts.push(['Stumm', [['-', 'Kein Ton']]]);
  return opts;
}
function tonText(u, s) {
  const w = wert(u, s).w;
  if (w === '-') return 'kein Ton';
  if (w.startsWith('k:')) return `<b>${esc(w.slice(2))}</b> · ${esc(datei(w.slice(2)))}`;
  const l = kandidaten(w.slice(2), s.sd, s.v), p = w.slice(2);
  if (l.length === 1) return `<b>${esc(l[0].k)}</b> · ${esc(datei(l[0].k))}`;
  return `Platz <b>${esc(p)}</b>${s.v ? ' (' + esc(D.var[s.v]) + ')' : ''} · Zufall aus ${l.length}: ${esc(l.slice(0, 5).map(c => c.k).join(', '))}${l.length > 5 ? ' …' : ''}`;
}
function zeigeZuletzt(u, s, k) { const el = document.querySelector(`.p[data-id="${s.id}"] .zul`); if (el && u.t === sel) el.innerHTML = `zuletzt: <b>${esc(k)}</b> · ${esc(datei(k))}`; }

// ---- Aufbau ----
function liste() {
  const sw = document.getElementById('seiten'); sw.innerHTML = '';
  for (const [sd, n] of [['A', 'Konkordat'], ['D', 'Aschenwacht']]) sw.append(h('button', { cls: sd + (seite === sd ? ' an' : ''), on: () => { seite = sd; const erst = D.einheiten.find(u => u.sd === sd && (kat === 'Alle' || u.kat === kat)) || D.einheiten.find(u => u.sd === sd); sel = erst.t; merkeSel(); liste(); pult(); } }, n));
  const kw = document.getElementById('kats'); kw.innerHTML = '';
  for (const k of ['Alle', ...D.kat]) kw.append(h('button', { cls: kat === k ? 'an' : '', on: () => { kat = k; merkeSel(); liste(); } }, k === 'Fahrzeuge und Kampfmaschinen' ? 'Fahrzeuge' : k));
  const ew = document.getElementById('einheiten'); ew.innerHTML = '';
  const reihe = D.kat.flatMap(k => D.einheiten.filter(u => u.sd === seite && u.kat === k && (kat === 'Alle' || kat === k)));
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
  sel_.value = w.w; if (sel_.value !== w.w) { sel_.append(h('option', { value: w.w }, w.w.startsWith('k:') ? `${w.w.slice(2)} · ${kurz(datei(w.w.slice(2)))} (aus „Alle Töne“)` : w.w.slice(2) + ' (aus Import)')); sel_.value = w.w; }
  const alleB = h('button', { cls: 'alle', title: 'Alle Töne des Spiels durchsuchen (auch aus anderen Gruppen)', 'aria-label': 'Alle Töne für ' + s.titel, disabled: !SND, on: () => alleToene(u, s, row) }, 'Alle Töne …');
  sel_.onchange = () => { setze(u, s, 'w', sel_.value); auffrischen(u, s, row); spielPlatz(u, s); };
  const vol = h('input', { type: 'range', min: 0, max: 100, step: 1, value: Math.round(w.vol * 100) }), volB = h('b', {}, Math.round(w.vol * 100));
  vol.oninput = () => { setze(u, s, 'vol', vol.value / 100); volB.textContent = vol.value; auffrischen(u, s, row, true); };
  vol.onchange = () => spielPlatz(u, s);
  const ton = h('input', { type: 'range', min: 50, max: 150, step: 1, value: Math.round(w.ton * 100) }), tonB = h('b', {}, Math.round(w.ton * 100) + ' %');
  ton.oninput = () => { setze(u, s, 'ton', ton.value / 100); tonB.textContent = ton.value + ' %'; auffrischen(u, s, row, true); };
  ton.onchange = () => spielPlatz(u, s);
  const zur = h('button', { cls: 'x', title: 'Diesen Platz zurücksetzen', 'aria-label': 'Zurücksetzen: ' + s.titel, on: () => { delete (AEND[u.t] || {})[s.id]; if (AEND[u.t] && !Object.keys(AEND[u.t]).length) delete AEND[u.t]; speichern(); const neu = zeile(u, s); row.replaceWith(neu); liste(); } }, '↺');
  const hin = [s.hin, s.auch.length ? `Dieser Platz klingt im Spiel auch bei: ${s.auch.slice(0, 6).join(', ')}${s.auch.length > 6 ? ` und ${s.auch.length - 6} weiteren` : ''}.` : ''].filter(Boolean).join(' ');
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
// ---- „Alle Töne“ (F67, 2026-11-21): jeder Ton des Spiels wählbar, nach Gruppen geordnet, mit Suchfeld ----
// Wird ein Ton aus einer fremden Gruppe gewählt, bekommt die Einheit beim Einbau des Exports einen eigenen Platz; andere Einheiten ändern sich nicht.
const GR_TITEL = { held: 'Helden', gewehr: 'Gewehre und Pistolen', mg: 'MG und Autokanonen', kanone: 'Kanonen und Artillerie', flamme: 'Flammen und Feuer', einschlag: 'Einschläge', nahkampf: 'Nahkampf', ruf: 'Stimmen und Rufe',
  fahrzeug: 'Motoren, Fahrzeuge, Schreiter', bewegung: 'Bewegung und Schritte', pferd: 'Pferde', handgriff: 'Handgriffe', signal: 'Signale und Musik' };
let ALLE = null;
function alleListe() {
  if (ALLE) return ALLE; const gesehen = new Set(), sek = [];
  const nimm = (titel, pools) => { const e = []; for (const p of pools) for (const [k, sd] of (D.pools[p] || [[p, null]])) { if (gesehen.has(k) || (SND && !SND[k])) continue; gesehen.add(k); e.push({ k, p, sd, name: D.name[p] || p, f: datei(k) }); } if (e.length) sek.push({ titel, e }); };
  nimm('Monster (später Dämonen)', ['neu2_monster']);
  for (const g of Object.keys(GR_TITEL)) if (D.gruppen[g]) nimm(GR_TITEL[g], D.gruppen[g]);
  nimm('Übrige Töne', Object.keys(D.pools).filter(p => !/^sv_/.test(p)));
  nimm('Sprüche beim Anklicken', Object.keys(D.pools).filter(p => /^sv_/.test(p)));
  if (SND) nimm('Ältere Einzeltöne', Object.keys(SND));
  return ALLE = sek;
}
function alleToene(u, s, row) {
  const alt = document.getElementById('alleDlg'); if (alt) alt.remove();
  const such = h('input', { type: 'search', placeholder: 'Suchen: Name, Schlüssel oder Datei …', 'aria-label': 'Töne suchen' }), liste_ = h('div', { cls: 'al' });
  const zu = () => { dlg.remove(); document.removeEventListener('keydown', esc_); }, esc_ = e => { if (e.key === 'Escape') zu(); };
  const dlg = h('div', { id: 'alleDlg', role: 'dialog', 'aria-label': 'Alle Töne' }, h('div', { cls: 'ak' },
    h('div', { cls: 'akopf' }, h('b', {}, 'Alle Töne für: ' + s.titel), h('button', { cls: 'x', 'aria-label': 'Schließen', on: zu }, '✕')),
    h('p', { cls: 'hin' }, 'Ton aus einer anderen Gruppe wählen: Beim Einbau des Exports bekommt nur diese Einheit einen eigenen Platz – andere Einheiten klingen weiter wie bisher.'), such, liste_));
  dlg.onclick = e => { if (e.target === dlg) zu(); }; document.addEventListener('keydown', esc_);
  const zeige = () => { const q = such.value.trim().toLowerCase(); liste_.innerHTML = ''; let n = 0;
    for (const sk of alleListe()) { const e = sk.e.filter(x => !q || (x.k + ' ' + x.name + ' ' + x.f + ' ' + sk.titel).toLowerCase().includes(q)); if (!e.length) continue;
      const box = h('details', { open: !!q || sk.e.length < 12 }, h('summary', {}, `${sk.titel} (${e.length})`));
      for (const x of e.slice(0, 400)) { n++; box.append(h('div', { cls: 'ai' + (wert(u, s).w === 'k:' + x.k ? ' an' : '') },
        h('button', { cls: 'play', 'aria-label': 'Abspielen: ' + x.k, on: () => { for (const a of laufend) a.pause(); laufend.clear(); spiel(x.k, wert(u, s).vol, wert(u, s).ton); } }, '▶'),
        h('span', {}, h('b', {}, x.k), x.sd ? (x.sd === 'A' ? ' (Konkordat)' : ' (Aschenwacht)') : '', h('small', {}, ` · ${x.name} · ${kurz(x.f)}`)),
        h('button', { cls: 'gold', on: () => { setze(u, s, 'w', 'k:' + x.k); zu(); const neu = zeile(u, s); row.replaceWith(neu); liste(); spielPlatz(u, s); } }, 'Wählen'))); }
      liste_.append(box); }
    if (!n) liste_.append(h('p', { cls: 'hin' }, 'Nichts gefunden.')); };
  such.oninput = zeige; zeige(); document.body.append(dlg); such.focus();
}
function auffrischen(u, s, row) { row.classList.toggle('geaendert', geaendert(u, s)); row.querySelector('.ton').innerHTML = tonText(u, s); liste(); }
function pult() {
  const u = U[sel], m = document.getElementById('pult'); m.innerHTML = '';
  const sn = u.sd === 'A' ? 'Konkordat' : 'Aschenwacht';
  m.append(h('div', { cls: 'kopf' }, u.img ? h('img', { src: u.img, alt: '' }) : null,
    h('div', {}, h('h2', {}, u.name), h('div', { cls: 'unter' }, `${sn} · ${u.kat}${u.mech ? ' (nur mit Kampfmaschinen)' : ''} · Stimme: ${u.stimme}`)),
    h('div', { cls: 'hk' }, h('button', { id: 'kette', cls: 'gold', disabled: !SND, on: e => kette(u, e.currentTarget) }, '▶ Im Zusammenhang hören'),
      h('button', { on: () => { if (!zahlGeaendert(u) || confirm(`Alle ${zahlGeaendert(u)} Änderungen bei ${u.name} zurücksetzen?`)) { delete AEND[u.t]; speichern(); liste(); pult(); } } }, 'Einheit zurücksetzen'))));
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
    ['Übernehmen', f => { try { const o = JSON.parse(f.value), neu = {};
        if (o.roh && typeof o.roh === 'object') Object.assign(neu, o.roh);
        else for (const a of o.aenderungen || []) { const e = ((neu[a.einheit] = neu[a.einheit] || {})[a.platz_id] = {}); e.w = a.wahl; e.vol = a.lautstaerke; e.ton = a.tonhoehe; }
        let n = 0; for (const t of Object.keys(neu)) { if (!U[t]) continue; AEND[t] = AEND[t] || {}; for (const id of Object.keys(neu[t])) { const s = U[t].slots.find(x => x.id === id); if (!s) continue; const e = neu[t][id];
            for (const k of ['w', 'vol', 'ton']) if (e[k] != null) setze(U[t], s, k, e[k]); n++; } if (!Object.keys(AEND[t]).length) delete AEND[t]; }
        speichern(); liste(); pult(); dlg.close(); meldung(`${n} ${n === 1 ? "Platz" : "Plätze"} übernommen.`); } catch (e) { meldung('Das ist kein gültiger Export: ' + e.message); } }, true]]);
};
document.getElementById('allesZurueck').onclick = () => { const n = Object.values(AEND).reduce((a, x) => a + Object.keys(x).length, 0); if (n && confirm(`Alle ${n} Änderungen bei allen Einheiten zurücksetzen?`)) { AEND = {}; speichern(); liste(); pult(); } };
document.getElementById('stopp').onclick = stoppAlles;
let meldT = 0; function meldung(t) { const s = document.getElementById('status'); s.textContent = t; clearTimeout(meldT); meldT = setTimeout(() => s.textContent = SND ? Object.keys(SND).length + ' Töne geladen.' : '', 4000); }
// Effekte-Regler wie im Spiel (gleicher Speicherplatz)
{ const r = document.getElementById('volEffekte'), b = document.getElementById('volEffekteW'); r.value = Math.round(effektVol * 100); b.textContent = r.value;
  r.oninput = () => { effektVol = r.value / 100; b.textContent = r.value; try { localStorage.setItem('arm.effektvol', effektVol); } catch (e) {} for (const a of laufend) if (a._vol != null) try { a.volume = Math.min(1, a._vol * effektVol); } catch (e) {} }; }
liste(); pult();
// Töne nachladen
{ const sp = document.createElement('script'); sp.src = 'src/sound_pult.js'; sp.async = false; document.body.append(sp);   // M9: nur im Pult wählbare Töne (vor sound.js, feste Reihenfolge)
  const sc = document.createElement('script'); sc.src = 'src/sound.js'; sc.async = false;
  sc.onload = () => { SND = window.SOUNDS || {}; const n = Object.values(AEND).reduce((a, x) => a + Object.keys(x).length, 0); document.getElementById('status').textContent = Object.keys(SND).length + ' Töne geladen · ' + n + ' eigene Wahlen, gespeichert für ' + (location.origin === 'null' ? 'diese Datei' : location.host); pult(); };   // Hinweis: die Auswahl liegt je Adresse getrennt (lokal ≠ GitHub Pages)
  sc.onerror = () => { document.getElementById('status').textContent = 'Töne konnten nicht geladen werden (src/sound.js).'; };
  document.body.append(sc); }
