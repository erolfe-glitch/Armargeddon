// Paket W1 (Punkt 124, 2026-11-27): Töne direkt aus CC über fal (ElevenLabs).
// Aufruf: node tools/fal_ton.mjs <auftrag.json>
//   auftrag.json = [ { "name": "pfeife_tief", "ordner": "sound-quelle/neu", "art": "sfx", "text": "deep steam whistle, 1.5 s", "dauer": 1.5 },
//                    { "name": "K1_vorwaerts", "ordner": "sound-quelle/Voices/eigene/el/konkordat", "art": "tts", "text": "Forward!", "stimme": "…" }, … ]
//   art sfx → fal-ai/elevenlabs/sound-effects/v3 (text, duration_seconds), art tts → fal-ai/elevenlabs/tts/eleven-v3 (text, voice).
// Ergebnis: <ordner>/<name>.mp3; danach robocopy-Sicherung von sound-quelle (CLAUDE.md). Ohne FAL_KEY: Meldung, nichts tun.
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { keyOderEnde, falLauf, laden } from './fal_lib.mjs';

const datei = process.argv[2]; if (!datei) { console.log('Aufruf: node tools/fal_ton.mjs <auftrag.json>'); process.exit(1); }
const auftrag = JSON.parse(readFileSync(datei, 'utf8')); const liste = Array.isArray(auftrag) ? auftrag : [auftrag];
const key = keyOderEnde(); let n = 0;
for (const e of liste) {
  const ordner = e.ordner || 'sound-quelle/fal'; mkdirSync(ordner, { recursive: true });
  const ziel = join(ordner, e.name + '.mp3'); if (existsSync(ziel) && !e.ueberschreiben) { console.log(`${e.name}: gibt es schon – übersprungen`); continue; }
  const tts = e.art === 'tts', modell = tts ? 'fal-ai/elevenlabs/tts/eleven-v3' : 'fal-ai/elevenlabs/sound-effects/v3';
  const eingabe = tts ? { text: e.text, ...(e.stimme ? { voice: e.stimme } : {}) } : { text: e.text, ...(e.dauer ? { duration_seconds: e.dauer } : {}) };
  try {
    const { ergebnis, sekunden } = await falLauf(modell, eingabe, key);
    const url = (ergebnis.audio && ergebnis.audio.url) || (ergebnis.audio_file && ergebnis.audio_file.url); if (!url) throw new Error('keine Ton-URL in der Antwort');
    await laden(url, ziel); n++; console.log(`${e.name}: ${ziel}, ${sekunden} s, ${modell}`);
  } catch (err) { console.log(`${e.name}: FEHLER ${err.message}`); }
}
console.log(`Fertig: ${n} von ${liste.length}. Kosten siehe fal-Abrechnung. Danach sound-quelle mit robocopy sichern.`);
