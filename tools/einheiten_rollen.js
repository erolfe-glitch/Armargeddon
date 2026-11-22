// Rolle, Stark gegen, Schwach gegen, Kontert man mit – aus den Werten abgeleitet (F103, 2026-11-22). Gleiche Logik wie src/rollen.js im Spiel.
const E = require('../src/engine.js');
const R = require('../src/rollen.js');
module.exports = t => R.rollenVon(E, t);
