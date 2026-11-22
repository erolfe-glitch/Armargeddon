// Klare Rollen je Einheit (F103, Enrico 2026-11-22): aus den Zahlen abgeleitet, nicht frei geschrieben – Faktortabelle (E.medaillen: Waffenart gegen
// Panzerklasse U/L/S, Nahkampf-Rolle), Fähigkeiten und Klasse. Bleibt richtig, wenn an der Balance gedreht wird. Feste Begriffe überall gleich.
(function (root) {
  'use strict';
  const ZIEL = { fuss: 'Fußtruppen', gep: 'Gepanzerte', gesch: 'Geschütze', reiter: 'Reiter', stell: 'Stellungen und Gebäude', nah: 'Nahkampf' };
  function rolleVon(E, t) {
    const T = E.TYPES[t], A = T.abil;
    if (T.held) return 'Held';
    if (T.cmd) return T.cmd === 2 ? 'Führung (General)' : 'Führung';
    if (T.cls === 'medic') return T.repair || A === 'ammo' ? 'Versorgung' : 'Sanität';
    if (T.cls === 'art') return T.mobile ? 'Steilfeuer' : 'Fernfeuer';
    if (A === 'mark' || A === 'strike' || T.relay || T.spot) return 'Aufklärung und Feuerleitung';
    if (T.courier) return 'Unterstützung (Meldegänger)';
    if (A === 'smoke') return 'Nebel';
    if (T.cls === 'mg') return 'Feuerunterstützung (MG)';
    if (T.cls === 'walker') { const m = E.medaillen(t); return T.stufe3 ? 'Durchbruch (Stufe 3)' : m.fPz >= 1 && T.at ? 'Panzerjäger' : E.isMech(t) ? 'Kampfmaschine' : 'Durchbruch (Panzer)'; }
    if (T.at) return 'Panzerjäger';
    if (T.cls === 'flame' || T.flame) return 'Flammen';
    if (T.cls === 'storm') return 'Grabenstürmer';
    if (T.cutter || A === 'charge' || A === 'mine' || A === 'tunnel' || T.wirelayer) return 'Pioniere';
    if (T.cls === 'cav') return 'Reiter (schneller Stoß)';
    if (T.suit) return 'Schwere Infanterie';
    if (T.shieldWall) return 'Schutz (Schildwall)';
    if (T.banner) return 'Moral (Banner)';
    if (A === 'clear' || T.gasSafe) return 'Gasschutz';
    if (T.wireProof) return 'Grabenwacht (schwer)';
    if (T.pin || T.hidden) return 'Scharfschützen';
    return 'Linieninfanterie';
  }
  function rollenVon(E, t) {
    const T = E.TYPES[t], m = E.medaillen(t), stark = [], schwach = [];
    if (m.fInf >= 1.5) stark.push(ZIEL.fuss);
    if (m.fPz >= 1.5) stark.push(ZIEL.gep);
    if (m.fInf >= 1 && T.cls === 'mg') stark.push(ZIEL.fuss);
    if (!T.keinNah && (m.rolle === 'stark' || (T.atk > 0 && m.fNah >= 1.5))) stark.push(ZIEL.nah);
    if (T.cls === 'cav' || T.cls === 'storm') stark.push(ZIEL.gesch);
    if (T.cls === 'art' || T.flame || T.cls === 'flame' || T.breaker || T.abil === 'charge' || (T.cls === 'walker' && !T.gat)) stark.push(ZIEL.stell);
    if (T.cls === 'mg' || T.pin) stark.push(ZIEL.reiter);
    const hilfe = T.cmd || T.cls === 'medic' || ['mark', 'strike', 'smoke', 'ammo'].includes(T.abil) || T.relay || T.spot || T.banner || T.courier;   // Führung und Unterstützung: kein „stark gegen“ nur aus der Grundwaffe
    if (!stark.length && m.fInf >= 1 && !hilfe) stark.push(ZIEL.fuss);
    const fern = T.rng > 0 || T.cls === 'art';
    if (fern && m.fPz === 0) schwach.push(ZIEL.gep);
    if (m.rolle === 'schwach' || (T.atk > 0 && m.fNah <= 0.5)) schwach.push(ZIEL.nah);
    if (!fern && T.atk > 0 && T.cls !== 'walker') schwach.push('Beschuss auf Abstand');
    if (m.klasse === 'S' || m.klasse === 'L') schwach.push('Panzerbrechende Waffen');
    if (m.klasse === 'U' && T.cls === 'art') schwach.push(ZIEL.reiter);
    const konter = m.klasse === 'S' ? ['Panzerjäger', 'Pioniere mit Ladung'] : m.klasse === 'L' ? ['Panzerjäger', 'Schwerer Nahkampf'] :
      (m.rolle === 'schwach' || T.cls === 'art') ? ['Grabenstürmer', 'Reiter'] : T.cls === 'storm' || T.cls === 'cav' ? ['MG-Trupps', 'Feuerbereitschaft'] : ['MG-Trupps', 'Artillerie'];
    return { rolle: rolleVon(E, t), stark: [...new Set(stark)], schwach: [...new Set(schwach)], konter };
  }
  const R = { rollenVon, rolleVon, ZIEL };
  if (typeof module !== 'undefined' && module.exports) module.exports = R; else root.ROLLEN = R;
})(this);
