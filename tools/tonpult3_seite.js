// ================= Ton-Pult 3 (Enrico 2026-11-23 16:50) =================
// Wird von tools/tonpult_bau.mjs an der Marke „<<TONPULT3>>“ in tools/tonpult_seite.js eingesetzt (gleicher Geltungsbereich, nutzt deren Helfer).
// Neu: Hauptansicht in drei Schritten (Wer? – Wann? – Welcher Ton?) mit Fortschritt je Einheit, Bibliothek mit Umsortieren, Abstellkammer
// (aussortieren statt löschen, ganze Bereiche abschalten), Herkunft der Stimmen, eigene Mischtöne (WebAudio).
// Speicher: arm.tonpult (AEND) bleibt unverändert; dazu arm.tonpult.fertig („passt so“), .aus (Abstellkammer), .rubrik (Umsortieren), .misch (Mischtöne).
const SP_FERTIG = 'arm.tonpult.fertig', SP_AUS = 'arm.tonpult.aus', SP_RUBRIK = 'arm.tonpult.rubrik', SP_MISCH = 'arm.tonpult.misch', SP_E3 = 'arm.tonpult.e3';
const lies3 = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k) || 'null'); return v == null ? d : v; } catch (e) { return d; } };
const el3 = id => document.getElementById(id);
const uniq3 = l => [...new Set(l)];
let FERTIG = lies3(SP_FERTIG, {}), AUS = Object.assign({ toene: [], bereiche: [] }, lies3(SP_AUS, {})), RUBRIK = lies3(SP_RUBRIK, {});
MISCH = lies3(SP_MISCH, {});
function zusatzSpeichern() { try { localStorage.setItem(SP_FERTIG, JSON.stringify(FERTIG)); localStorage.setItem(SP_AUS, JSON.stringify(AUS)); localStorage.setItem(SP_RUBRIK, JSON.stringify(RUBRIK)); localStorage.setItem(SP_MISCH, JSON.stringify(MISCH)); } catch (e) {} }
zusatzStand = () => JSON.stringify({ fertig: FERTIG, aus: AUS, rubrik: RUBRIK, misch: MISCH });
zusatzSetzen = j => { const o = JSON.parse(j); FERTIG = o.fertig || {}; AUS = Object.assign({ toene: [], bereiche: [] }, o.aus || {}); RUBRIK = o.rubrik || {}; MISCH = o.misch || {}; zusatzSpeichern(); allesNeu3(); };

// ---------- Bibliothek: Rubriken mit Umsortieren ----------
const BIB0 = D.bib.map(b => ({ id: b.id, titel: b.titel, e: b.e.map(x => x.slice()) }));   // Einsortierung ab Werk
const RUB_TITEL = Object.fromEntries(BIB0.map(b => [b.id, b.titel])); RUB_TITEL.misch = 'Eigene Mischtöne';
const idVon = p => D.pools[p] ? 'p:' + p : 'k:' + p;
const HEIM = {}; for (const b of BIB0) for (const [p, unter] of b.e) if (!HEIM[idVon(p)]) HEIM[idVon(p)] = [b.id, unter || ''];
const RUB_WAHL = []; for (const b of BIB0) for (const un of uniq3(b.e.map(x => x[1] || ''))) RUB_WAHL.push([b.id + '|' + un, b.titel + (un ? ' – ' + un : '')]);
function rubrikVon(id) {   // [Rubrik, Unterrubrik] – eigene Einsortierung geht vor
  const o = RUBRIK[id]; if (o) { const i = o.indexOf('|'); return i < 0 ? [o, ''] : [o.slice(0, i), o.slice(i + 1)]; }
  if (HEIM[id]) return HEIM[id];
  if (id.startsWith('k:')) { const k = id.slice(2); if (MISCH[k]) return [MISCH[k].rubrik && RUB_TITEL[MISCH[k].rubrik] ? MISCH[k].rubrik : 'misch', 'Eigene Mischtöne']; const e = KEYPOOL[k]; if (e && idVon(basis(e[0])) !== id) return rubrikVon('p:' + basis(e[0])); }
  return ['rest', ''];
}
function bibNeu() {   // D.bib (auch für die Experten-Ansicht) aus der Werks-Einsortierung plus eigenen Änderungen neu aufbauen
  for (const b of D.bib) b.e = [];
  for (const b0 of BIB0) for (const [p] of b0.e) { const [r, u] = rubrikVon(idVon(p)), z = BIBKAT[r] || BIBKAT[b0.id]; z.e.push([p, u || null]); }
  for (const b of D.bib) { const folge = uniq3(b.e.map(x => x[1] || '')); b.e.sort((x, y) => folge.indexOf(x[1] || '') - folge.indexOf(y[1] || '')); }
  for (const k of Object.keys(PLATZKAT)) delete PLATZKAT[k];
  for (const b of D.bib) for (const [p] of b.e) if (!PLATZKAT[p]) PLATZKAT[p] = b.id;
}
function bibListe(rid) {   // Einträge einer Rubrik: Plätze (mit ihren Tönen), einzeln umsortierte Töne, eigene Mischtöne
  const out = [], b = BIBKAT[rid];
  if (b) for (const [p, unter] of b.e) out.push({ id: idVon(p), unter: unter || '', kinder: D.pools[p] ? D.pools[p].filter(([k]) => !RUBRIK['k:' + k]) : null });
  for (const id of Object.keys(RUBRIK)) if (id.startsWith('k:') && !HEIM[id] && !MISCH[id.slice(2)] && D.dauer[id.slice(2)] != null) { const [r, u] = rubrikVon(id); if (r === rid) out.push({ id, unter: u, kinder: null }); }
  for (const k of Object.keys(MISCH)) { const [r, u] = rubrikVon('k:' + k); if (r === rid) out.push({ id: 'k:' + k, unter: u || 'Eigene Mischtöne', kinder: null }); }
  return out;
}
const herk3 = k => MISCH[k] ? 'mix' : D.herkunft[k] || 'fx';
const HERK_KURZ = { suno: 'Suno', el: 'ElevenLabs', helden: 'Helden', sonst: 'Freesound u. a.', elfx: 'ElevenLabs', fx: 'Freesound u. a.', mix: 'Mischton' };
const istStimmeK = k => ['suno', 'el', 'helden', 'sonst'].includes(herk3(k));

// ---------- Abstellkammer ----------
const VARS3 = ['gm', 'gs', 'bf', 'mr'];
function keysVon(id) {   // alle Tonschlüssel eines Eintrags, samt Filter-Fassungen (_gm, _gs, _bf, _mr)
  const out = [];
  if (id.startsWith('p:')) { const p = id.slice(2); for (const [k] of D.pools[p] || []) out.push(k); for (const v of VARS3) for (const [k] of D.pools[p + '_' + v] || []) out.push(k); }
  else { const k = id.slice(2), e = KEYPOOL[k]; out.push(k);
    if (e) { const p = basis(e[0]), i = (D.pools[p] || []).findIndex(x => x[0] === k); if (i >= 0) for (const v of VARS3) { const q = D.pools[p + '_' + v]; if (q && q.length === D.pools[p].length) out.push(q[i][0]); } } }
  return out;
}
function bereichKeys(b) {   // 'r:<Rubrik>' | 'h:<Herkunft>' | 's:<Sprechergruppe>'; Heldenstimmen bleiben außen vor, außer man schaltet sie selbst ab
  const art = b[0], x = b.slice(2); let out = [];
  if (art === 'r') for (const it of bibListe(x)) out.push(...(it.kinder ? it.kinder.flatMap(([k]) => keysVon('k:' + k)) : keysVon(it.id)));
  if (art === 'h') out = Object.keys(D.herkunft).filter(k => D.herkunft[k] === x);
  if (art === 's') { const s = D.sprecher.find(y => y.id === x); if (s) for (const p of s.plaetze) out.push(...keysVon('p:' + p)); }
  return (art === 'h' && x === 'helden') || (art === 's' && /^held_/.test(x)) ? out : out.filter(k => D.herkunft[k] !== 'helden');
}
function ausNeu() { const s = new Set(); for (const id of AUS.toene) for (const k of keysVon(id)) s.add(k); for (const b of AUS.bereiche) for (const k of bereichKeys(b)) s.add(k); AUS_K = s; NUTZ = null; }
bibAus = id => { const ks = id.startsWith('p:') ? (D.pools[id.slice(2)] || []).map(x => x[0]) : [id.slice(2)]; return ks.length > 0 && ks.every(k => AUS_K.has(k)); };
function brauchtErsatz(u, s) {   // die Stelle spielt nur noch aussortierte Töne: im Spiel bleibt der Ton, bis Ersatz gewählt ist
  const w = wert(u, s).w; if (w === '-') return false; if (w.startsWith('k:')) return AUS_K.has(w.slice(2));
  const l = kandidaten(w.slice(2), s.sd, s.v); return l.length > 0 && l.every(c => AUS_K.has(c.k));
}
function aussortieren(id) { merke('Aussortiert: ' + wahlName(id), []); if (!AUS.toene.includes(id)) AUS.toene.push(id); ausNeu(); zusatzSpeichern(); zeichne(); meldung('„' + wahlName(id) + '“ liegt jetzt in der Abstellkammer – dort mit einem Klick zurückholen.'); }
function zurueckholen(id) { merke('Zurückgeholt: ' + wahlName(id), []); AUS.toene = AUS.toene.filter(x => x !== id); ausNeu(); zusatzSpeichern(); zeichne(); meldung('„' + wahlName(id) + '“ ist wieder in der Auswahl.'); }

// ---------- Mischtöne (WebAudio): Spuren { k, vol (1 = 100 %), ms (Startversatz), ton (Tonhöhe) } ----------
let MIX_AC = null; const MIX_BUF = {};
const mixAC = () => { MIX_AC = MIX_AC || new (window.AudioContext || window.webkitAudioContext)(); if (MIX_AC.state === 'suspended') MIX_AC.resume(); return MIX_AC; };
async function mixPuffer(k) { if (MIX_BUF[k]) return MIX_BUF[k]; if (!SND || !SND[k]) return null;
  const b = atob(SND[k].slice(SND[k].indexOf(',') + 1)), a = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) a[i] = b.charCodeAt(i);
  return MIX_BUF[k] = await mixAC().decodeAudioData(a.buffer); }
spielMisch = (spuren, vol = 1, rate = 1) => {
  const ac = mixAC(), quellen = [], griff = { aus: false, pause() { this.aus = true; for (const q of quellen) try { q.stop(); } catch (e) {} laufend.delete(griff); } };
  laufend.add(griff);
  Promise.all(spuren.map(sp => mixPuffer(sp.k).catch(() => null))).then(bufs => { if (griff.aus) return; const t0 = ac.currentTime + 0.03; let ende = 0;
    spuren.forEach((sp, i) => { if (!bufs[i]) return; const q = ac.createBufferSource(), g = ac.createGain(); q.buffer = bufs[i]; q.playbackRate.value = Math.max(0.25, Math.min(4, (sp.ton || 1) * rate));
      g.gain.value = Math.max(0, Math.min(2, (sp.vol == null ? 1 : sp.vol) * vol * effektVol)); q.connect(g); g.connect(ac.destination); q.start(t0 + (sp.ms || 0) / 1000); quellen.push(q);
      ende = Math.max(ende, (sp.ms || 0) / 1000 + bufs[i].duration / q.playbackRate.value); });
    setTimeout(() => laufend.delete(griff), ende * 1000 + 200); });
  return griff;
};
const mixDauer = spuren => Math.max(0, ...spuren.map(sp => (sp.ms || 0) / 1000 + (D.dauer[sp.k] || 0) / (sp.ton || 1)));
function mischNeu() { for (const [k, m] of Object.entries(MISCH)) D.dauer[k] = +mixDauer(m.spuren).toFixed(2); }
// Zeilen, die umgezogen sind (Ton-Spur 2026-11-23): „Stollen sprengen“ stand beim Mineur, gehört aber zu „Gelände und Gebäude“ – eine alte Wahl zieht mit
function verlegen() { const alt = AEND.mineur && AEND.mineur.stollenboom; if (!alt || (AEND.gelaende && AEND.gelaende.stollenboom)) return; (AEND.gelaende = AEND.gelaende || {}).stollenboom = alt; delete AEND.mineur.stollenboom; if (!Object.keys(AEND.mineur).length) delete AEND.mineur; speichern(); }
function allesNeu3() { verlegen(); mischNeu(); ausNeu(); bibNeu(); ausNeu(); }
allesNeu3();

// ---------- Export / Import ----------
exportZusatz = () => ({ pult3: 1, fertig: FERTIG, aussortiert: { toene: AUS.toene, bereiche: AUS.bereiche, schluessel: [...AUS_K].sort() }, rubriken: RUBRIK,
  mischtoene: Object.entries(MISCH).map(([key, m]) => ({ key, name: m.name, rubrik: m.rubrik || null, spuren: m.spuren })) });
importZusatz = o => { let n = 0;   // ergänzt nur, löscht nichts
  for (const [t, f] of Object.entries(o.fertig || {})) for (const id of Object.keys(f)) { (FERTIG[t] = FERTIG[t] || {})[id] = 1; n++; }
  for (const id of (o.aussortiert && o.aussortiert.toene) || []) if (!AUS.toene.includes(id)) { AUS.toene.push(id); n++; }
  for (const b of (o.aussortiert && o.aussortiert.bereiche) || []) if (!AUS.bereiche.includes(b)) { AUS.bereiche.push(b); n++; }
  for (const [id, r] of Object.entries(o.rubriken || {})) { RUBRIK[id] = r; n++; }
  for (const m of o.mischtoene || []) if (m && m.key && Array.isArray(m.spuren)) { MISCH[m.key] = { name: m.name || m.key, rubrik: m.rubrik || '', spuren: m.spuren }; n++; }
  zusatzSpeichern(); allesNeu3(); return n; };

// ---------- Fortschritt: „eingestellt“ = eigener Ton gewählt oder „passt so“ bestätigt ----------
const AB3 = [['anw', 'Anklicken', '👆'], ['zug', 'Bewegen', '🥾'], ['schuss', 'Schießen', '🎯'], ['ziel', 'Einschlag beim Ziel', '💥'], ['nah', 'Nahkampf', '⚔️'], ['treffer', 'Wird getroffen', '🩸'], ['tod', 'Tod und Ausfall', '☠️'],
  ['abil', 'Fähigkeiten und Handgriffe', '⭐'], ['ankunft', 'Ankunft', '📯'], ['stimme', 'Rufe', '🗣️']];
const AB3_NAME = Object.fromEntries(AB3.map(a => [a[0], a[1]]));
const AB_RUB = { anw: 'stimmen', zug: 'schritte', schuss: 'gewehre', ziel: 'einschlaege', nah: 'nahkampf', treffer: 'stimmen', tod: 'stimmen', abil: 'handgriffe', ankunft: 'oberflaeche', stimme: 'stimmen' };
const istFertig = (u, s) => (!!((AEND[u.t] || {})[s.id]) || !!((FERTIG[u.t] || {})[s.id])) && !brauchtErsatz(u, s);
const momenteVon = u => AB3.map(a => a[0]).filter(ab => u.slots.some(s => s.ab === ab));
function fortschritt(us) { let n = 0, von = 0; for (const ab of uniq3(us.flatMap(momenteVon))) { von++; if (us.every(u => u.slots.filter(s => s.ab === ab).every(s => istFertig(u, s)))) n++; } return { n, von }; }
function setzeFertig(ziele, an) { for (const { u, s } of ziele) { if (an) (FERTIG[u.t] = FERTIG[u.t] || {})[s.id] = 1; else if (FERTIG[u.t]) { delete FERTIG[u.t][s.id]; if (!Object.keys(FERTIG[u.t]).length) delete FERTIG[u.t]; } } }

// ---------- Hauptansicht: ① Wer? ② Wann? ③ Welcher Ton? ----------
let E3 = Object.assign({ wer: [], mehr: false, ab: null, slot: null, seite: 'A' }, lies3(SP_E3, {}));
const e3Merke = () => { try { localStorage.setItem(SP_E3, JSON.stringify(E3)); } catch (e) {} };
const e3Offen = new Set();   // aufgeklappte Gruppen/Plätze in Schritt 3
const seiteVon = u => echt(u) ? u.sd : 'G';
const reihe3 = sd => sd === 'G' ? D.einheiten.filter(u => !echt(u)) : D.kat.flatMap(k => D.einheiten.filter(u => echt(u) && u.sd === sd && u.kat === k));
function werListe() { let us = E3.wer.map(t => U[t]).filter(Boolean); if (!us.length) { us = [reihe3(E3.seite)[0]]; E3.wer = [us[0].t]; } return us; }
function slotsGemeinsam(us, ab) { const m = new Map(); for (const u of us) for (const s of u.slots) if (s.ab === ab) { let e = m.get(s.id); if (!e) m.set(s.id, e = { s, ziele: [] }); e.ziele.push({ u, s }); } return m; }
function e3Auto(nurOffen) {   // ersten offenen Moment und darin die erste offene Stelle wählen
  const us = werListe(), abs = AB3.map(a => a[0]).filter(ab => us.some(u => u.slots.some(s => s.ab === ab)));
  const offen = ab => [...slotsGemeinsam(us, ab)].find(([, e]) => !e.ziele.every(z => istFertig(z.u, z.s)));
  let ab = abs.find(offen); if (!ab) { if (nurOffen) return false; ab = abs.includes(E3.ab) ? E3.ab : abs[0]; }
  const o = offen(ab); E3.ab = ab; E3.slot = o ? o[0] : [...slotsGemeinsam(us, ab).keys()][0]; e3Merke(); return true;
}
function e3Wahl(ts, mehr) { E3.wer = ts; if (mehr != null) E3.mehr = mehr; if (ts.length) E3.seite = seiteVon(U[ts[0]]); e3Auto(); stoppAlles(); zeichneEinfach(); }
let e3Zeig = false;   // gewählte Einheit einmal ins Bild rollen (nach einem Sprung von woanders)
function springZu(u, s) { ansicht = 'einfach'; e3Zeig = true; E3.wer = [u.t]; E3.mehr = false; E3.seite = seiteVon(u); E3.ab = s.ab; E3.slot = s.id; e3Merke(); merkeSel(); zeichne(); }

function waehle3(ziele, id, was) {   // Ton zuweisen heißt eingestellt (ein Schritt für „Rückgängig“)
  const ne = new Set(ziele.map(z => z.u.t)).size, text = (id === '-' ? 'kein Ton' : '„' + wahlName(id) + '“') + ' → ' + (ne === 1 ? ziele[0].u.name : ne + ' Einheiten') + ' · ' + was;
  merke(text, ziele); for (const { u, s } of ziele) setzeRoh(u, s, 'w', id); setzeFertig(ziele, true);
  speichern(); zusatzSpeichern(); zeichne(); meldung('Gewählt: ' + text + ' – „↶ Rückgängig“ nimmt es zurück.');
  stoppAlles(); if (id !== '-') spielPlatz(ziele[0].u, ziele[0].s);
}
function passtSo(ziele, text, weiter) { merke('Passt so: ' + text, ziele); setzeFertig(ziele, true); zusatzSpeichern(); if (weiter) e3Auto(true); zeichne(); }
function wieImSpiel(ziele, text) { merke('Wie im Spiel: ' + text, ziele); for (const { u, s } of ziele) if (AEND[u.t]) { delete AEND[u.t][s.id]; if (!Object.keys(AEND[u.t]).length) delete AEND[u.t]; } setzeFertig(ziele, false); speichern(); zusatzSpeichern(); zeichne(); }
function vorhoeren(id, z) { stoppAlles(); let k, vol = 0.6, ton = 1;
  if (istPk(id)) k = zieh(vorhanden(pkKeys(id).map(x => ({ k: x })))); else if (id.startsWith('k:')) k = id.slice(2); else { const p = id.slice(2), alle = platzKeys(p).map(x => ({ k: x[0] })), frei = alle.filter(c => !AUS_K.has(c.k)); k = zieh(vorhanden(z ? kandidaten(p, z.s.sd, z.s.v) : frei.length ? frei : alle)); }
  if (z) { const w = wert(z.u, z.s); vol = w.vol; ton = w.ton; } if (k) spiel(k, vol, ton); }

function passend(u, s) {   // nur Töne, die zu diesem Moment passen: die Rubrik des Spiel-Tons (und des gewählten), die passende Unterrubrik aufgeklappt
  const g = grund(s).w, w = wert(u, s).w, gruppen = [];
  if (s.gruppe === 'spruch') { const satz = (s.platz.match(/^sv_([a-z]+)_/) || [])[1], ps = Object.keys(D.pools).filter(p => new RegExp('^sv_[a-z]+_' + s.sd + '\\d+$').test(p) && !bibAus('p:' + p));
    gruppen.push({ titel: 'Stimmen dieser Truppe', offen: true, items: ps.filter(p => p.startsWith('sv_' + satz + '_')).map(p => ({ id: 'p:' + p, kinder: D.pools[p] })) });
    gruppen.push({ titel: 'Stimmen anderer Truppen', offen: false, items: ps.filter(p => !p.startsWith('sv_' + satz + '_')).map(p => ({ id: 'p:' + p, kinder: D.pools[p] })) });
    return gruppen.filter(x => x.items.length); }
  const heim = id => { if (!id || id === '-') return null; if (istPk(id)) { const l = pkKeys(id); if (!l.length) return null; id = 'k:' + l[0]; } let x = id; if (id.startsWith('p:')) { const p = id.slice(2); x = D.pools[p] ? id : D.sndvar[p] && D.sndvar[p].length ? idVon(D.sndvar[p][0]) : 'k:' + p; } const r = rubrikVon(x); return r[0] === 'rest' ? null : r; };
  const h0 = heim(g) || [s.mode === 'ruf' ? 'stimmen' : AB_RUB[s.ab], s.mode === 'ruf' ? 'Stimmenpaket und Gefechtsrufe' : s.ab === 'tod' ? 'Schmerz, Panik, Sterben' : null], hw = heim(w);
  const seiteOk = it => it.id.startsWith('p:') ? kandidaten(it.id.slice(2), s.sd, s.v).length > 0 : !(s.mode === 'ruf' && MISCH[it.id.slice(2)]);   // Rufe laufen im Spiel über einen eigenen Weg: dort keine Mischtöne
  for (const rid of uniq3([h0[0], hw && hw[0]].filter(Boolean))) { const items = bibListe(rid).filter(it => !bibAus(it.id) && !/^p:sv_/.test(it.id) && seiteOk(it));
    for (const un of uniq3(items.map(it => it.unter))) gruppen.push({ titel: (RUB_TITEL[rid] || rid) + (un ? ' – ' + un : ''), offen: (rid === h0[0] && (h0[1] == null || un === h0[1] || items.length <= 20 || un === 'Eigene Mischtöne')) || !!(hw && rid === hw[0] && un === hw[1]), items: items.filter(it => it.unter === un) }); }   // kleine Rubriken ganz aufgeklappt
  return gruppen.sort((a, b) => b.offen - a.offen);
}

// eine Ton-Zeile (Schritt 3, „Alle Töne“, Abstellkammer): ▶, Name, Angaben, aufklappen, wählen, aussortieren
function tonReihe(id, o = {}) {
  const k = id.startsWith('k:') ? id.slice(2) : null, p = k ? null : id.slice(2), keys = k ? [k] : platzKeys(p).map(x => x[0]), name = wahlName(id);
  const marken = [];
  if (p && D.unsicher.includes(p) && !RUBRIK[id]) marken.push(h('span', { cls: 'mk frage', title: 'Einsortierung unsicher – bitte beim Hören prüfen und, wenn nötig, über „Rubrik“ umsortieren.' }, '?'));
  if (keys.some(istStimmeK) || (k && MISCH[k])) marken.push(h('span', { cls: 'mk hk-' + herk3(keys[0]) }, HERK_KURZ[herk3(keys[0])]));
  const meta = k && MISCH[k] ? `Mischton aus ${MISCH[k].spuren.length} Spuren · ${sek(D.dauer[k] || 0)} · ${esc(k)}` : k ? tonMeta(k, null) : platzMeta(p);
  const row = h('div', { cls: 't3' + (o.kind ? ' kind' : '') + (o.aktiv ? ' an' : '') + (o.wahl ? ' klick' : ''), 'data-id': id },
    h('button', { cls: 'play', 'aria-label': 'Abspielen: ' + name, disabled: !SND, on: e => { e.stopPropagation(); (o.hoer || vorhoeren)(id, o.ziel); } }, '▶'),
    h('div', { cls: 'tn' }, h('b', {}, name, ...marken), h('small', { html: meta }), o.nutz ? nutzEl(id) : null));
  const rechts = h('div', { cls: 'tr' });
  if (o.auf) rechts.append(o.auf);
  if (o.rubrik) { const rb = h('button', { cls: 'kl3 rub', title: 'In eine andere Rubrik einsortieren' }, 'Rubrik …');
    rb.onclick = e => { e.stopPropagation(); const [r, u] = rubrikVon(id), sel_ = h('select', { 'aria-label': 'Rubrik für ' + name }); for (const [v, l] of RUB_WAHL) sel_.append(h('option', { value: v }, l));
      sel_.value = r + '|' + u; sel_.onclick = ev => ev.stopPropagation(); sel_.onchange = () => { merke('Umsortiert: ' + name, []); RUBRIK[id] = sel_.value; allesNeu3(); zusatzSpeichern(); o.rubrik(); meldung('„' + name + '“ steht jetzt unter ' + (RUB_WAHL.find(x => x[0] === sel_.value) || ['', ''])[1] + '.'); undoKnopf(); }; rb.replaceWith(sel_); sel_.focus(); };
    rechts.append(rb); }
  if (o.paket) { const pk = o.paket.keys(id); if (pk.length) { const st = o.paket.stand(pk), cb = h('input', { type: 'checkbox', 'aria-label': 'Ins eigene Paket: ' + name }); cb.checked = st === 'ja'; cb.indeterminate = st === 'teil';
      const lb = h('label', { cls: 'pk3' + (st !== 'nein' ? ' an' : ''), title: pk.length > 1 ? 'Alle ' + pk.length + ' Töne dieses Pakets in das eigene Paket dieser Stelle nehmen (bzw. wieder herausnehmen)' : 'Diesen Ton in das eigene Paket dieser Stelle nehmen (bzw. wieder herausnehmen) – im Spiel klingt zufällig einer der angekreuzten Töne' }, cb, st === 'ja' ? ' im Paket' : ' + ins Paket');
      lb.onclick = e => e.stopPropagation(); cb.onchange = () => o.paket.um(pk); rechts.append(lb); } }
  if (o.wahl) rechts.append(h('button', { cls: 'gold', on: e => { e.stopPropagation(); o.wahl(id); } }, o.aktiv ? '✓ jetzt' : 'Wählen'));
  if (o.zurueck) rechts.append(h('button', { cls: 'gold', on: e => { e.stopPropagation(); zurueckholen(id); } }, '↩ Zurückholen'));
  else if (o.aus !== false) rechts.append(h('button', { cls: 'kl3 raus', title: 'Aussortieren: verschwindet aus allen Auswahllisten und liegt dann in der Abstellkammer (nichts wird gelöscht).', 'aria-label': 'Aussortieren: ' + name, on: e => { e.stopPropagation(); aussortieren(id); } }, '✕ aussortieren'));
  row.append(rechts); if (o.wahl) row.onclick = () => o.wahl(id);
  return row;
}

function jetztText(u, s) { const w = wert(u, s).w; if (w === '-') return ''; if (istPk(w)) return 'im Spiel zufällig einer von ' + pkKeys(w).length + ' Tönen, nie zweimal hintereinander derselbe'; if (w.startsWith('k:')) { const k = w.slice(2); return MISCH[k] ? 'Mischton aus ' + MISCH[k].spuren.length + ' Spuren' : tonMeta(k, null); }
  const l = kandidaten(w.slice(2), s.sd, s.v); return l.length === 1 ? tonMeta(l[0].k, null) : 'im Spiel zufällig einer von ' + l.length + ' Tönen · Platz ' + esc(w.slice(2)); }
function zeichneWer() {
  const el = el3('e3wer'), alt = el.querySelector('.e3roll'), y = alt ? alt.scrollTop : 0; el.innerHTML = '';
  const us = werListe(), an = new Set(us.map(u => u.t));
  el.append(h('h2', { cls: 'e3t' }, h('span', { cls: 'nr' }, '1'), 'Wer?'));
  const tabs = h('div', { cls: 'tabs' });
  for (const [sd, n] of [['A', 'Konkordat'], ['D', 'Aschenwacht'], ['G', 'Gemeinsam']]) tabs.append(h('button', { cls: sd + (E3.seite === sd ? ' an' : ''), 'aria-pressed': E3.seite === sd ? 'true' : 'false', on: () => { E3.seite = sd; if (!E3.mehr) E3.wer = []; werListe(); e3Auto(); zeichneEinfach(); } }, n));
  el.append(tabs);
  const liste_ = reihe3(E3.seite), roll = h('div', { cls: 'e3roll' });
  if (E3.seite !== 'G') { const gr = h('div', { cls: 'sg e3chips' });   // Gruppenknöpfe: Art und Waffe, wählen gleich mehrere
    const chip = (name, pass) => { const ts = liste_.filter(pass).map(u => u.t); if (!ts.length) return; const ist = ts.length === an.size && ts.every(t => an.has(t)); gr.append(h('button', { cls: 'chip' + (ist ? ' an' : ''), 'aria-pressed': ist ? 'true' : 'false', on: () => e3Wahl(ist ? [ts[0]] : ts, !ist) }, name)); };
    chip('alle', () => true); for (const [id, n] of ARTEN) chip(n, u => u.art === id); for (const [id, n] of WAFFEN) chip(n, u => u.waffe === id);
    roll.append(gr); }
  roll.append(h('button', { cls: 'e3mehr' + (E3.mehr ? ' an' : ''), 'aria-pressed': E3.mehr ? 'true' : 'false', on: () => { E3.mehr = !E3.mehr; if (!E3.mehr) E3.wer = [us[0].t]; e3Auto(); zeichneEinfach(); } }, (E3.mehr ? '☑' : '☐') + ' Mehrere wählen' + (E3.mehr ? ` (${us.length})` : '')));
  const gitter = h('div', { cls: 'e3gitter' });
  for (const u of liste_) { const f = fortschritt([u]), fertig = f.n === f.von;
    gitter.append(h('button', { cls: 'e3k' + (an.has(u.t) ? ' an' : '') + (fertig ? ' fertig' : ''), 'data-t': u.t, 'aria-pressed': an.has(u.t) ? 'true' : 'false', title: u.name + ': ' + f.n + ' von ' + f.von + ' Momenten eingestellt',
      on: () => { if (E3.mehr) { const ts = an.has(u.t) ? (an.size > 1 ? [...an].filter(t => t !== u.t) : [...an]) : [...an, u.t]; e3Wahl(ts); } else e3Wahl([u.t]); } },
      u.img ? h('img', { src: u.img, alt: '' }) : h('i', {}, u.sd ? '🗣️' : u.t === 'gelaende' ? '🏚️' : '❄️'), h('span', { cls: 'nm' }, u.name), h('span', { cls: 'fs' }, fertig ? '✓ fertig' : f.n + ' / ' + f.von)));
  }
  const alleF = liste_.filter(u => { const f = fortschritt([u]); return f.n === f.von; }).length;
  roll.append(gitter, h('p', { cls: 'hin' }, `${alleF} von ${liste_.length} fertig.`)); el.append(roll); roll.scrollTop = y;
  if (e3Zeig) { e3Zeig = false; const k = gitter.querySelector('.e3k.an'); if (k) k.scrollIntoView({ block: 'nearest' }); }
}
function zeichneWann() {
  const el = el3('e3wann'), alt = el.querySelector('.e3roll'), y = alt ? alt.scrollTop : 0; el.innerHTML = '';
  const us = werListe(), f = fortschritt(us), u1 = us.length === 1 ? us[0] : null;
  el.append(h('h2', { cls: 'e3t' }, h('span', { cls: 'nr' }, '2'), 'Wann?'));
  const kopf = h('div', { cls: 'e3kopf' }, u1 && u1.img ? h('img', { src: u1.img, alt: '' }) : null,
    h('div', {}, h('b', {}, u1 ? u1.name : us.length + ' Einheiten'), h('small', {}, u1 ? (u1.sd ? seiteTxt(u1.sd) : 'beide Seiten') : us.slice(0, 4).map(u => u.name).join(', ') + (us.length > 4 ? ' …' : ''))));
  const balken = h('div', { cls: 'e3fort' + (f.n === f.von ? ' voll' : '') }, h('div', { cls: 'bk' }, h('i', { style: `width:${f.von ? Math.round(f.n / f.von * 100) : 0}%` })), h('span', {}, f.n === f.von ? `✓ fertig – ${f.von} von ${f.von} Momenten eingestellt` : `${f.n} von ${f.von} Momenten eingestellt`));
  const roll = h('div', { cls: 'e3roll' });
  roll.append(kopf, balken);
  const kn = h('div', { cls: 'e3kn' });
  if (u1) kn.append(h('button', { id: 'kette', disabled: !SND, on: e => kette(u1, e.currentTarget) }, '▶ Im Zusammenhang'));
  const rest = us.flatMap(u => u.slots.filter(s => !istFertig(u, s) && !brauchtErsatz(u, s)).map(s => ({ u, s })));
  kn.append(h('button', { disabled: !rest.length, title: 'Alle noch offenen Töne bleiben, wie sie im Spiel sind', on: () => passtSo(rest, (u1 ? u1.name : us.length + ' Einheiten') + ', alles Übrige') }, '✓ Alles Übrige passt so'));
  roll.append(kn);
  for (const [ab, titel, bild] of AB3) { const m = slotsGemeinsam(us, ab); if (!m.size) continue;
    const offen = [...m.values()].filter(e => !e.ziele.every(z => istFertig(z.u, z.s))).length, warn = [...m.values()].some(e => e.ziele.some(z => brauchtErsatz(z.u, z.s)));
    roll.append(h('button', { cls: 'e3m' + (E3.ab === ab ? ' an' : '') + (!offen ? ' fertig' : ''), 'data-ab': ab, 'aria-expanded': E3.ab === ab ? 'true' : 'false', on: () => { E3.ab = ab; const o = [...m].find(([, e]) => !e.ziele.every(z => istFertig(z.u, z.s))); E3.slot = o ? o[0] : [...m.keys()][0]; e3Merke(); zeichneEinfach(); } },
      h('span', { cls: 'bi' }, bild), h('span', { cls: 'mt' }, h('b', {}, titel), h('small', {}, m.size === 1 ? '1 Ton' : m.size + ' Töne')), h('span', { cls: 'st' + (warn ? ' warn' : '') }, warn ? '⚠' : offen ? offen + ' offen' : '✓')));
    if (E3.ab !== ab) continue;
    const box = h('div', { cls: 'e3sl' });
    for (const [id, e] of m) { const u0 = e.ziele[0].u, fertig = e.ziele.every(z => istFertig(z.u, z.s)), w = e.ziele.some(z => brauchtErsatz(z.u, z.s));
      box.append(h('div', { cls: 'e3s1' + (E3.slot === id ? ' an' : '') + (fertig ? ' fertig' : ''), 'data-id': id, role: 'button', tabindex: 0, on: () => { E3.slot = id; e3Merke(); zeichneEinfach(); } },
        h('button', { cls: 'play kl', 'aria-label': 'Abspielen: ' + e.s.titel, disabled: !SND || wert(u0, e.s).w === '-', on: ev => { ev.stopPropagation(); stoppAlles(); spielPlatz(u0, e.s); } }, '▶'),
        h('span', { cls: 'mt' }, h('b', {}, e.s.titel), h('small', {}, tonKurz(u0, e.s) + (e.ziele.length < us.length ? ` · bei ${e.ziele.length} von ${us.length}` : ''))), h('span', { cls: 'st' + (w ? ' warn' : '') }, w ? '⚠' : fertig ? '✓' : '○')));
    }
    roll.append(box);
  }
  if (u1 && u1.gemeinsam) for (const g of u1.gemeinsam) if (U[g]) roll.append(h('button', { cls: 'e3m gem', on: () => { e3Zeig = true; e3Wahl([g], false); } }, h('span', { cls: 'bi' }, '🗣️'), h('span', { cls: 'mt' }, h('b', {}, 'Rufe (gemeinsam)'), h('small', {}, U[g].name + ' – gilt für alle Einheiten dieser Gruppe')), h('span', { cls: 'st' }, '→')));
  el.append(roll); roll.scrollTop = y;
}
// ---------- Eigenes Paket (Punkt 25, 2026-11-24): beliebige Töne einer Stelle zusammenstellen, im Spiel klingt zufällig einer ----------
function paketSetzen(ziele, liste, text) {   // gilt für alle gewählten Einheiten; leeres Paket = wieder wie im Spiel
  merke(text, ziele); for (const { u, s } of ziele) setzeRoh(u, s, 'w', liste.length ? pkId(liste) : grund(s).w);
  setzeFertig(ziele, !!liste.length); speichern(); zusatzSpeichern(); zeichne(); meldung(text + ' – „↶ Rückgängig“ nimmt es zurück.'); }
function paketOpt(ziele, was) { const { u: u0, s } = ziele[0];
  const basis = () => { const w = wert(u0, s).w; return istPk(w) ? pkKeys(w) : w.startsWith('k:') ? [w.slice(2)] : []; };   // Start: das eigene Paket bzw. der eine gewählte Ton; ein ganzes Werks-Paket übernimmt „Paket bearbeiten“
  return { keys: id => (id.startsWith('k:') ? [id.slice(2)] : kandidaten(id.slice(2), s.sd, s.v).map(c => c.k)).filter(k => !AUS_K.has(k) && !(s.mode === 'ruf' && MISCH[k])),
    stand: pk => { const w = wert(u0, s).w; if (!istPk(w)) return 'nein'; const l = pkKeys(w), n = pk.filter(k => l.includes(k)).length; return n === pk.length ? 'ja' : n ? 'teil' : 'nein'; },
    um: pk => { let l = basis(); const drin = istPk(wert(u0, s).w) && pk.every(k => l.includes(k));
      l = drin ? l.filter(k => !pk.includes(k)) : [...l, ...pk.filter(k => !l.includes(k))];
      const ne = new Set(ziele.map(z => z.u.t)).size, nm = pk.length > 1 ? pk.length + ' Töne' : '„' + wahlName('k:' + pk[0]) + '“';
      paketSetzen(ziele, l, (drin ? 'Aus dem Paket: ' : 'Ins Paket: ') + nm + ' → ' + (ne === 1 ? u0.name : ne + ' Einheiten') + ' · ' + was + ' (' + l.length + ' Töne)'); } }; }
function paketBearbeiten(ziele, was) { const { u, s } = ziele[0], w = wert(u, s).w, l = w.startsWith('p:') ? kandidaten(w.slice(2), s.sd, s.v).map(c => c.k).filter(k => !AUS_K.has(k)) : w.startsWith('k:') ? [w.slice(2)] : [];
  paketSetzen(ziele, l, 'Paket bearbeiten: ' + wahlName(w) + ' als eigenes Paket übernommen · ' + was + ' (' + l.length + ' Töne)'); }
function zeichneTon() {
  const el = el3('e3ton'), alt = el.querySelector('.e3roll'), y = alt ? alt.scrollTop : 0, altSlot = el.dataset.slot; el.innerHTML = '';
  el.append(h('h2', { cls: 'e3t' }, h('span', { cls: 'nr' }, '3'), 'Welcher Ton?'));
  const us = werListe(), m = E3.ab ? slotsGemeinsam(us, E3.ab) : null, ent = m && m.get(E3.slot), roll = h('div', { cls: 'e3roll' }); el.append(roll);
  if (!ent) { roll.append(h('p', { cls: 'leer' }, 'In der Mitte einen Moment antippen.')); return; }
  const { s, ziele } = ent, u0 = ziele[0].u, w = wert(u0, s), wer = ziele.length === 1 ? u0.name : ziele.length + ' Einheiten', was = s.titel, fertig = ziele.every(z => istFertig(z.u, z.s)), warn = ziele.some(z => brauchtErsatz(z.u, z.s));
  el.dataset.slot = ziele.map(z => z.u.t).join(',') + '|' + s.id;
  roll.append(h('div', { cls: 'e3st' }, h('b', {}, s.titel), h('small', {}, AB3_NAME[s.ab] + ' · ' + wer + (s.v ? ' · Stimmfilter ' + D.var[s.v] : ''))));
  if (warn) roll.append(h('p', { cls: 'e3warn' }, '⚠ aussortiert, bitte Ersatz wählen – der bisherige Ton liegt in der Abstellkammer. Im Spiel klingt er weiter, bis hier ein anderer gewählt ist.'));
  const jetzt = h('div', { cls: 'e3jetzt' + (fertig ? ' fertig' : '') },
    h('button', { cls: 'play gross', 'aria-label': 'Abspielen', disabled: !SND || w.w === '-', on: () => { stoppAlles(); spielPlatz(u0, s); } }, '▶'),
    h('div', { cls: 'tn' }, h('small', {}, 'Jetzt eingestellt' + (geaendert(u0, s) && (AEND[u0.t][s.id] || {}).w ? ' (von dir gewählt)' : ' (wie im Spiel)')), h('b', {}, tonKurz(u0, s)), h('small', { cls: 'zul', html: jetztText(u0, s) })),
    h('div', { cls: 'jk' }, fertig ? h('span', { cls: 'ok' }, '✓ eingestellt') : h('button', { cls: 'gold', id: 'e3passt', disabled: warn, on: () => passtSo(ziele, wer + ' · ' + was, true) }, '✓ Passt so'),
      fertig ? h('button', { id: 'e3weiter', on: () => { if (!e3Auto(true)) meldung('Alles eingestellt – ' + wer + ' ist fertig.'); zeichneEinfach(); } }, 'Weiter ▶') : null));
  roll.append(jetzt);
  const z0 = { u: u0, s }, pkNow = istPk(w.w) ? pkKeys(w.w) : null, pkO = paketOpt(ziele, was);
  if (pkNow) { const key = 'pk|' + el.dataset.slot, offen = !e3Offen.has('!' + key), box = h('div', { cls: 'e3pk' });
    box.append(h('button', { cls: 'e3g', id: 'e3pkkopf', 'aria-expanded': offen ? 'true' : 'false', on: () => { if (e3Offen.has('!' + key)) e3Offen.delete('!' + key); else e3Offen.add('!' + key); zeichneTon(); } }, (offen ? '▾ ' : '▸ ') + 'Eigenes Paket · ' + pkNow.length + ' Töne', h('small', {}, ' – im Spiel zufällig einer davon; ✕ nimmt nur aus diesem Paket')));
    if (offen) for (const k of pkNow) { const r = tonReihe('k:' + k, { kind: true, ziel: z0, aus: false }), tr = r.querySelector('.tr');
      tr.append(h('button', { cls: 'kl3 raus pkx', 'aria-label': 'Aus dem Paket nehmen: ' + wahlName('k:' + k), title: 'Nur aus diesem Paket nehmen (nicht aussortieren)', on: e => { e.stopPropagation(); pkO.um([k]); } }, '✕ aus dem Paket')); box.append(r); }
    roll.append(box); }
  else if (w.w.startsWith('p:') && kandidaten(w.w.slice(2), s.sd, s.v).length > 1) roll.append(h('div', { cls: 'e3pkneu' }, h('button', { id: 'e3pkbearb', title: 'Alle Töne des jetzigen Pakets ankreuzen; danach einzelne abwählen oder aus anderen Rubriken dazunehmen', on: () => paketBearbeiten(ziele, was) }, '✎ Paket bearbeiten'), h('small', {}, ' oder unten bei einzelnen Tönen „+ ins Paket“ ankreuzen')));
  const reg = h('div', { cls: 'e3reg' });
  const regler = (name, feld, max, lies_, schreib) => { const v0 = lies_({ u: u0, s }), r = h('input', { type: 'range', min: feld === 'ton' ? 50 : 0, max, step: feld === 'ton' ? 1 : 5, value: Math.round(v0 * 100), 'aria-label': name }), b = h('b', {}, Math.round(v0 * 100) + ' %');
    r.oninput = () => { merke(`${name} ${r.value} % → ${wer} · ${was}`, ziele, 'e3|' + feld + '|' + s.id); for (const z of ziele) setzeRoh(z.u, z.s, feld, schreib(z, r.value / 100)); speichern(); b.textContent = r.value + ' %'; undoKnopf(); };
    r.onchange = () => { stoppAlles(); spielPlatz(u0, s); zeichneWann(); zeichneWer(); };
    return h('label', { cls: 'regler' }, name + ' ', r, b); };
  reg.append(regler('Lautstärke', 'vol', 200, z => wert(z.u, z.s).vol / (z.s.vol || 1), (z, f) => Math.min(1, +(z.s.vol * f).toFixed(3))), regler('Tonhöhe', 'ton', 150, z => wert(z.u, z.s).ton, (z, f) => f));
  if (s.mode === 'ruf') { const fs_ = h('select', { 'aria-label': 'Stimmfilter' }); for (const [v, l] of [['maske', 'Gasmaske + Rauschen'], ['roboter', 'Roboter-Lautsprecher'], ['helm', 'Stahlhelm (blechern)'], ['rauschen', 'nur Rauschen'], ['roh', 'ohne Filter']]) fs_.append(h('option', { value: v }, l)); fs_.value = w.filt;
    fs_.onchange = () => { merke('Filter → ' + wer + ' · ' + was, ziele); for (const z of ziele) setzeRoh(z.u, z.s, 'filt', fs_.value); speichern(); undoKnopf(); stoppAlles(); spielPlatz(u0, s); };
    reg.append(h('label', { cls: 'regler' }, 'Filter ', fs_), regler('Stärke', 'fst', 100, z => wert(z.u, z.s).fst, (z, f) => f)); }
  reg.append(h('button', { disabled: w.w === '-', on: () => waehle3(ziele, '-', was) }, 'Kein Ton'), h('button', { disabled: !ziele.some(z => geaendert(z.u, z.s) || (FERTIG[z.u.t] || {})[z.s.id]), title: 'Ton, Lautstärke und Tonhöhe zurück auf den Stand im Spiel; die Stelle ist dann wieder offen', on: () => wieImSpiel(ziele, wer + ' · ' + was) }, '↺ Wie im Spiel'));
  roll.append(reg);
  if (s.hin) roll.append(h('p', { cls: 'hin' }, s.hin));
  roll.append(h('h3', { cls: 'e3h' }, 'Passende Töne', h('small', {}, ' – antippen = gewählt, ▶ = nur hören')));
  for (const gr of passend(u0, s)) { const key = 'g|' + gr.titel, offen = e3Offen.has(key) ? true : e3Offen.has('!' + key) ? false : gr.offen;
    roll.append(h('button', { cls: 'e3g', 'aria-expanded': offen ? 'true' : 'false', on: () => { e3Offen.delete(key); e3Offen.delete('!' + key); e3Offen.add(offen ? '!' + key : key); zeichneTon(); } }, (offen ? '▾ ' : '▸ ') + gr.titel, h('small', {}, ' ' + gr.items.length)));
    if (!offen) continue;
    for (const it of gr.items) { const kinder = (it.kinder || []).filter(([k]) => !AUS_K.has(k)), mehrere = it.id.startsWith('p:') && kinder.length > 1, auf_ = mehrere && (e3Offen.has(it.id) || (w.w.startsWith('k:') && kinder.some(([k]) => 'k:' + k === w.w)));
      const auf = mehrere ? h('button', { cls: 'kl3', 'aria-expanded': auf_ ? 'true' : 'false', title: 'Im Spiel klingt zufällig einer dieser Töne; hier lassen sie sich einzeln hören und wählen', on: e => { e.stopPropagation(); if (e3Offen.has(it.id)) e3Offen.delete(it.id); else e3Offen.add(it.id); zeichneTon(); } }, (auf_ ? '▾ ' : '▸ ') + kinder.length + ' Töne') : null;
      roll.append(tonReihe(it.id, { aktiv: w.w === it.id, ziel: z0, auf, paket: pkO, wahl: id => waehle3(ziele, id, was) }));
      if (auf_) for (const [k] of kinder) roll.append(tonReihe('k:' + k, { kind: true, aktiv: w.w === 'k:' + k, ziel: z0, paket: pkO, wahl: id => waehle3(ziele, id, was) })); }
  }
  roll.append(h('button', { cls: 'e3alle', id: 'e3alle', on: () => bib3Dialog({ titel: 'Alle Töne ansehen – ' + wer + ' · ' + was, ziel: z0, aktiv: w.w, paket: pkO, wahl: id => waehle3(ziele, id, was) }) }, '📚 Alle Töne ansehen …'));
  if (altSlot === el.dataset.slot) roll.scrollTop = y;
}
function zeichneEinfach() {
  const v = el3('vEinfach'); if (!v.firstChild) v.append(h('section', { id: 'e3wer', cls: 'e3s' }), h('section', { id: 'e3wann', cls: 'e3s' }), h('section', { id: 'e3ton', cls: 'e3s' }));
  const us = werListe(); if (!E3.ab || !us.some(u => u.slots.some(s => s.ab === E3.ab && s.id === E3.slot))) e3Auto();
  e3Merke(); zeichneWer(); zeichneWann(); zeichneTon();
}

// ---------- „Alle Töne“: ganze Bibliothek zum Stöbern, Umsortieren und Aussortieren ----------
const B3 = { rub: BIB0[0].id, suche: '', herk: null, offen: new Set(), roll: 0 };
function bib3Bau(o = {}) {   // o: { ziel: {u, s} (Vorhören wie an dieser Stelle), wahl: id => …, aktiv: id, nurKeys: nur einzelne Töne wählbar (Mischton-Spur) }
  const nav = h('div', { cls: 'bibnav' }), such = h('input', { type: 'search', placeholder: 'Suchen: Name, Schlüssel oder Datei …', 'aria-label': 'Töne suchen' }), hk = h('div', { cls: 'sg b3hk' }), lst = h('div', { cls: 'biblist b3list' });
  such.value = B3.suche;
  const frisch = () => { const y = lst.scrollTop; zeig(); lst.scrollTop = y; };
  const pkFrisch = o.paket ? { keys: o.paket.keys, stand: o.paket.stand, um: pk => { o.paket.um(pk); frisch(); } } : null;   // Ankreuzen lässt den Dialog offen
  function zeig() {
    const q = B3.suche.trim().toLowerCase(); lst.innerHTML = ''; nav.innerHTML = ''; hk.innerHTML = ''; let n = 0;
    for (const rid of [...D.bib.map(b => b.id), 'misch']) { const anz = bibListe(rid).filter(it => !bibAus(it.id)).length; if (rid === 'misch' && !anz) continue;
      nav.append(h('button', { cls: !q && B3.rub === rid ? 'an' : '', 'data-k': rid, on: () => { B3.rub = rid; B3.suche = such.value = ''; lst.scrollTop = 0; zeig(); } }, RUB_TITEL[rid], h('small', {}, ' ' + anz))); }
    hk.append(h('span', { cls: 'sgt' }, 'Herkunft'), h('button', { cls: 'chip' + (!B3.herk ? ' an' : ''), on: () => { B3.herk = null; zeig(); } }, 'alle'));
    for (const [id, name] of D.herkunftName) hk.append(h('button', { cls: 'chip' + (B3.herk === id ? ' an' : ''), 'aria-pressed': B3.herk === id ? 'true' : 'false', on: () => { B3.herk = B3.herk === id ? null : id; zeig(); } }, name));
    for (const rid of q || B3.herk ? [...D.bib.map(b => b.id), 'misch'] : [B3.rub]) { let kopf = !(q || B3.herk), ua = null;
      for (const it of bibListe(rid)) { if (bibAus(it.id) || (o.ziel && o.ziel.s.mode === 'ruf' && MISCH[it.id.slice(2)])) continue;
        const istP = it.id.startsWith('p:'), keys = (it.kinder ? it.kinder.map(x => x[0]) : [it.id.slice(2)]).filter(k => !AUS_K.has(k) && (!B3.herk || herk3(k) === B3.herk)); if (!keys.length) continue;
        const txt = (wahlName(it.id) + ' ' + it.id.slice(2) + ' ' + (RUB_TITEL[rid] || '') + ' ' + it.unter).toLowerCase(), pq = !q || txt.includes(q), kt = keys.filter(k => pq || (k + ' ' + datei(k)).toLowerCase().includes(q)); if (!kt.length) continue; n++;
        if (!kopf) { lst.append(h('div', { cls: 'bkopf' }, RUB_TITEL[rid])); kopf = true; }
        if (it.unter !== ua) { ua = it.unter; if (ua) lst.append(h('div', { cls: 'bunter' }, ua)); }
        const mehrere = istP && keys.length > 1, offen = mehrere && (B3.offen.has(it.id) || (q && !pq));
        const auf = mehrere ? h('button', { cls: 'kl3', 'aria-expanded': offen ? 'true' : 'false', on: e => { e.stopPropagation(); if (B3.offen.has(it.id)) B3.offen.delete(it.id); else B3.offen.add(it.id); frisch(); } }, (offen ? '▾ ' : '▸ ') + keys.length + ' Töne') : null;
        const waehlbar = o.wahl && (!o.nurKeys || !mehrere);
        lst.append(tonReihe(it.id, { ziel: o.ziel, auf, nutz: !o.nurKeys, aktiv: o.aktiv === it.id, rubrik: frisch, paket: pkFrisch, wahl: waehlbar ? id => o.wahl(o.nurKeys && id.startsWith('p:') ? 'k:' + keys[0] : id) : null }));
        if (offen) for (const k of (q && !pq ? kt : keys)) lst.append(tonReihe('k:' + k, { kind: true, ziel: o.ziel, nutz: !o.nurKeys, aktiv: o.aktiv === 'k:' + k, rubrik: frisch, paket: pkFrisch, wahl: o.wahl })); } }
    if (!n) lst.append(h('p', { cls: 'leer' }, 'Nichts gefunden.'));
  }
  such.oninput = () => { B3.suche = such.value; zeig(); }; lst.onscroll = () => { B3.roll = lst.scrollTop; };
  zeig();
  return { el: h('div', { cls: 'bib b3' }, nav, h('div', { cls: 'bibmitte' }, such, hk, lst)), lst, such, neu: frisch };
}
let b3Zu = null;
function bib3Dialog(o) {
  if (b3Zu) b3Zu();
  if (o.aktiv && o.aktiv !== '-') { const r = rubrikVon(o.aktiv.startsWith('p:') ? idVon(o.aktiv.slice(2)) : o.aktiv)[0]; if (RUB_TITEL[r]) B3.rub = r; B3.suche = ''; }
  const zu = () => { dlg_.remove(); document.removeEventListener('keydown', taste); b3Zu = null; }, taste = e => { if (e.key === 'Escape') zu(); };
  const bib = bib3Bau({ ...o, wahl: id => { zu(); o.wahl(id); } });
  const dlg_ = h('div', { id: 'bibDlg', role: 'dialog', 'aria-label': 'Alle Töne' }, h('div', { cls: 'ak' }, h('div', { cls: 'akopf' }, h('b', {}, o.titel), h('button', { cls: 'x', 'aria-label': 'Schließen', on: zu }, '✕')), bib.el));
  dlg_.onclick = e => { if (e.target === dlg_) zu(); }; document.addEventListener('keydown', taste); document.body.append(dlg_); b3Zu = zu;
  const an = bib.lst.querySelector('.t3.an'); if (an) an.scrollIntoView({ block: 'center' });
}
function zeichneAlle() {
  const v = el3('vAlle'); v.innerHTML = '';
  const bib = bib3Bau({});
  v.append(h('p', { cls: 'hin v3hin' }, 'Die ganze Bibliothek, nach Gehör sortiert. „Rubrik …“ sortiert einen Ton um (wird gespeichert und exportiert), „✕ aussortieren“ legt ihn in die Abstellkammer. Ein „?“ heißt: Einsortierung unsicher, bitte beim Hören prüfen. Einen Ton zuweisen: Reiter „Töne einstellen“.'), bib.el);
  bib.lst.scrollTop = B3.roll;
}

// ---------- Abstellkammer ----------
function zeichneKammer() {
  const v = el3('vKammer'), y = v.scrollTop; v.innerHTML = '';
  v.append(h('h2', {}, 'Abstellkammer'), h('p', { cls: 'hin' }, 'Aussortierte Töne verschwinden aus allen Auswahllisten, werden aber nie gelöscht. Im Spiel fallen sie aus der Zufallsauswahl; ist ein Ton der einzige für eine Stelle, klingt er weiter, bis du Ersatz wählst (Liste unten).'));
  const ersatz = []; for (const u of D.einheiten) for (const s of u.slots) if (brauchtErsatz(u, s)) ersatz.push({ u, s });
  if (ersatz.length) { v.append(h('h3', { cls: 'warn' }, `⚠ Bitte Ersatz wählen (${ersatz.length})`)); const box = h('div', { cls: 'k3ers' });
    for (const { u, s } of ersatz.slice(0, 80)) box.append(h('button', { on: () => springZu(u, s) }, u.name + ' · ' + s.titel)); if (ersatz.length > 80) box.append(h('span', { cls: 'hin' }, ` … und ${ersatz.length - 80} weitere`)); v.append(box); }
  v.append(h('h3', {}, 'Ganze Bereiche abschalten'), h('p', { cls: 'hin' }, 'Antippen schaltet einen Bereich aus (grau) und wieder ein. Heldenstimmen sind eine eigene Gruppe und bleiben von den anderen Schaltern unberührt.'));
  const gruppe = (titel, liste_) => { const g = h('div', { cls: 'k3gr' }, h('b', {}, titel)), box = h('div', { cls: 'sg' });
    for (const [id, name] of liste_) { const aus = AUS.bereiche.includes(id), n = new Set(bereichKeys(id)).size;
      box.append(h('button', { cls: 'schalter' + (aus ? ' aus' : ''), 'data-b': id, 'aria-pressed': aus ? 'false' : 'true', title: aus ? 'Ausgeschaltet – antippen schaltet wieder ein' : 'Eingeschaltet – antippen schaltet aus',
        on: () => { merke((aus ? 'Eingeschaltet: ' : 'Ausgeschaltet: ') + name, []); AUS.bereiche = aus ? AUS.bereiche.filter(x => x !== id) : [...AUS.bereiche, id]; ausNeu(); zusatzSpeichern(); zeichne(); meldung(name + (aus ? ' ist wieder eingeschaltet.' : ' ist ausgeschaltet (' + n + ' Töne).')); } },
        (aus ? '○ ' : '● ') + name, h('small', {}, ' ' + n))); }
    g.append(box); return g; };
  v.append(gruppe('Herkunft', D.herkunftName.map(([id, name]) => ['h:' + id, name])), gruppe('Rubrik', BIB0.map(b => ['r:' + b.id, b.titel])), gruppe('Sprechergruppe', D.sprecher.map(s => ['s:' + s.id, s.name])));
  v.append(h('h3', {}, `Aussortierte Töne (${AUS.toene.length})`));
  if (!AUS.toene.length) v.append(h('p', { cls: 'hin' }, 'Noch nichts aussortiert. Neben jedem Ton steht „✕ aussortieren“.'));
  else { v.append(h('button', { on: () => { if (confirm(`Alle ${AUS.toene.length} aussortierten Töne zurückholen?`)) { merke('Alle zurückgeholt', []); AUS.toene = []; ausNeu(); zusatzSpeichern(); zeichne(); } } }, '↩ Alle zurückholen'));
    const box = h('div', { cls: 'k3list' }); for (const id of AUS.toene) box.append(tonReihe(id, { zurueck: true, hoer: i => { stoppAlles(); const k = i.startsWith('k:') ? i.slice(2) : zieh(vorhanden(platzKeys(i.slice(2)).map(x => ({ k: x[0] })))); if (k) spiel(k, 0.6, 1); } })); v.append(box); }
  v.scrollTop = y;
}

// ---------- Mischton bauen ----------
let M3 = { key: null, name: '', rubrik: '', spuren: [] };
const mixSlug = n => 'mix_' + (n.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'ton');
function mischSpeichern() {
  const name = M3.name.trim(); if (!name) return meldung('Bitte erst einen Namen eintragen.'); if (M3.spuren.length < 2) return meldung('Ein Mischton braucht mindestens zwei Spuren.');
  let key = M3.key; if (!key) { key = mixSlug(name); let i = 2; while (MISCH[key] || (SND && SND[key]) || D.pools[key]) key = mixSlug(name) + '_' + i++; }
  merke('Mischton gespeichert: ' + name, []); MISCH[key] = { name, rubrik: M3.rubrik || rubrikVon('k:' + M3.spuren[0].k)[0], spuren: M3.spuren.map(sp => ({ k: sp.k, vol: sp.vol, ms: sp.ms, ton: sp.ton })) }; M3.key = key;
  allesNeu3(); zusatzSpeichern(); zeichne(); meldung('„' + name + '“ gespeichert – steht jetzt in der Bibliothek unter „' + (RUB_TITEL[rubrikVon('k:' + key)[0]] || 'Eigene Mischtöne') + '“ und lässt sich wie jeder Ton zuweisen.');
}
function zeichneMisch() {
  const v = el3('vMisch'); v.innerHTML = '';
  const links = h('div', { cls: 'm3l' }), rechts = h('div', { cls: 'm3r' });
  links.append(h('h3', {}, 'Eigene Mischtöne'));
  if (!Object.keys(MISCH).length) links.append(h('p', { cls: 'hin' }, 'Noch keine. Rechts 2–4 Töne übereinanderlegen und speichern.'));
  for (const [k, m] of Object.entries(MISCH)) { const benutzt = nutzListe('k:' + k).length;
    links.append(h('div', { cls: 'm3e' + (M3.key === k ? ' an' : '') }, h('button', { cls: 'play kl', 'aria-label': 'Abspielen: ' + m.name, disabled: !SND, on: () => { stoppAlles(); spiel(k, 0.7, 1); } }, '▶'),
      h('span', { cls: 'mt' }, h('b', {}, m.name), h('small', {}, `${m.spuren.length} Spuren · ${sek(D.dauer[k] || 0)}${benutzt ? ' · an ' + benutzt + (benutzt === 1 ? ' Stelle' : ' Stellen') + ' benutzt' : ''}`)),
      h('button', { on: () => { M3 = { key: k, name: m.name, rubrik: m.rubrik || '', spuren: m.spuren.map(sp => ({ ...sp })) }; zeichneMisch(); } }, 'Öffnen'),
      h('button', { title: benutzt ? 'Wird noch benutzt – erst dort einen anderen Ton wählen' : 'Mischton löschen', disabled: !!benutzt, on: () => { if (confirm('Mischton „' + m.name + '“ löschen?')) { merke('Mischton gelöscht: ' + m.name, []); delete MISCH[k]; delete RUBRIK['k:' + k]; if (M3.key === k) M3.key = null; allesNeu3(); zusatzSpeichern(); zeichne(); } } }, 'Löschen'))); }
  links.append(h('h3', {}, 'Mischtöne im Spiel (fest eingebaut)'), h('p', { cls: 'hin' }, '„Als Vorlage öffnen“ baut das Rezept aus den Bibliothekstönen derselben Quelldateien nach (klingt ähnlich, nicht gleich: im Original sind Ausschnitt und Filter je Spur anders). Liegen nicht alle Spuren einzeln vor, wird der fertige Ton Spur 1. Unter neuem Namen speichern und an der Stelle zuweisen.'));
  for (const x of D.mixe) { const da = x.spuren.filter(sp => sp.k).length;
    links.append(h('div', { cls: 'm3e' }, h('button', { cls: 'play kl', 'aria-label': 'Abspielen: ' + tonName(x.key), disabled: !SND, on: () => { stoppAlles(); spiel(x.key, 0.7, 1); } }, '▶'),
      h('span', { cls: 'mt' }, h('b', {}, tonName(x.key)), h('small', {}, `${x.spuren.length} Spuren${da === x.spuren.length ? '' : ', ' + da + ' davon einzeln in der Bibliothek'} · ${esc(x.key)}`)),
      h('button', { title: da === x.spuren.length ? 'Rezept aus den Bibliothekstönen nachbauen' : 'Nicht alle Spuren liegen einzeln in der Bibliothek: der fertige Ton wird Spur 1, weitere Spuren kannst du darüberlegen', on: () => { M3 = { key: null, name: tonName(x.key) + ' neu', rubrik: rubrikVon('k:' + x.key)[0], spuren: da === x.spuren.length ? x.spuren.slice(0, 4).map(sp => ({ k: sp.k, vol: Math.min(1.5, +Math.pow(10, sp.db / 20).toFixed(2)), ms: sp.ms, ton: 1 })) : [{ k: x.key, vol: 1, ms: 0, ton: 1 }] }; zeichneMisch(); } }, 'Als Vorlage öffnen'))); }
  rechts.append(h('h3', {}, M3.key ? 'Mischton ändern' : 'Neuer Mischton'));
  const nm = h('input', { type: 'text', id: 'm3name', placeholder: 'Name, z. B. Einschlag mit Erdregen', 'aria-label': 'Name des Mischtons', maxlength: 60 }); nm.value = M3.name; nm.oninput = () => { M3.name = nm.value; };
  const rb = h('select', { 'aria-label': 'Rubrik des Mischtons' }); rb.append(h('option', { value: '' }, 'Rubrik: wie der erste Ton')); for (const b of BIB0) rb.append(h('option', { value: b.id }, 'Rubrik: ' + b.titel)); rb.value = M3.rubrik || ''; rb.onchange = () => { M3.rubrik = rb.value; };
  rechts.append(h('div', { cls: 'm3kopf' }, nm, rb));
  M3.spuren.forEach((sp, i) => { const zeile = h('div', { cls: 'm3s' });
    const reg = (name, feld, min, max, step, zeig, lies_, schreib) => { const r = h('input', { type: 'range', min, max, step, value: lies_(sp[feld]), 'aria-label': name + ' Spur ' + (i + 1) }), b = h('b', {}, zeig(sp[feld])); r.oninput = () => { sp[feld] = schreib(+r.value); b.textContent = zeig(sp[feld]); }; return h('label', { cls: 'regler' }, name + ' ', r, b); };
    zeile.append(h('button', { cls: 'play kl', 'aria-label': 'Spur ' + (i + 1) + ' allein hören', disabled: !SND, on: () => { stoppAlles(); spielMisch([{ ...sp, ms: 0 }], 0.7, 1); } }, '▶'),
      h('span', { cls: 'mt' }, h('b', {}, 'Spur ' + (i + 1) + ': ' + tonName(sp.k)), h('small', { html: tonMeta(sp.k, null) })),
      reg('Lautstärke', 'vol', 0, 150, 5, x => Math.round(x * 100) + ' %', x => Math.round(x * 100), x => x / 100), reg('Start', 'ms', 0, 3000, 10, x => x + ' ms', x => x, x => x), reg('Tonhöhe', 'ton', 50, 150, 1, x => Math.round(x * 100) + ' %', x => Math.round(x * 100), x => x / 100),
      h('button', { on: () => bib3Dialog({ titel: 'Ton für Spur ' + (i + 1), nurKeys: true, aktiv: 'k:' + sp.k, wahl: id => { sp.k = id.slice(2); zeichneMisch(); } }) }, 'Ton tauschen …'), h('button', { cls: 'x', 'aria-label': 'Spur ' + (i + 1) + ' entfernen', on: () => { M3.spuren.splice(i, 1); zeichneMisch(); } }, '✕'));
    rechts.append(zeile); });
  rechts.append(h('div', { cls: 'm3fuss' },
    h('button', { id: 'm3plus', disabled: M3.spuren.length >= 4, on: () => bib3Dialog({ titel: 'Ton für Spur ' + (M3.spuren.length + 1), nurKeys: true, wahl: id => { M3.spuren.push({ k: id.slice(2), vol: 1, ms: 0, ton: 1 }); zeichneMisch(); } }) }, '＋ Spur aus der Bibliothek …' + (M3.spuren.length >= 4 ? ' (höchstens 4)' : '')),
    h('button', { cls: 'gold', id: 'm3hoer', disabled: !SND || !M3.spuren.length, on: () => { stoppAlles(); spielMisch(M3.spuren, 0.7, 1); } }, '▶ Mischung hören'),
    h('button', { cls: 'gold', id: 'm3speichern', disabled: M3.spuren.length < 2, on: mischSpeichern }, M3.key ? 'Speichern' : 'Speichern unter diesem Namen'),
    h('button', { on: () => { M3 = { key: null, name: '', rubrik: '', spuren: [] }; zeichneMisch(); } }, 'Neu beginnen')));
  rechts.append(h('p', { cls: 'hin' }, '2 bis 4 Töne liegen übereinander. „Start“ verschiebt eine Spur nach hinten. Ein gespeicherter Mischton steht in der Bibliothek, ist überall zuweisbar und geht im Export als Rezept mit; das Spiel mischt ihn beim Abspielen aus denselben Tönen.'));
  v.append(links, rechts);
}

zeichne3 = () => { if (ansicht === 'einfach') zeichneEinfach(); else if (ansicht === 'alle') zeichneAlle(); else if (ansicht === 'kammer') zeichneKammer(); else if (ansicht === 'misch') zeichneMisch(); };
