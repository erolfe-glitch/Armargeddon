// KO-A2 (Punkt 155): feste Aufstellung, 200 Schlachten je Karte, je zwei Karten parallel (abgestürzte Läufe bis zu 3× wiederholt). Aufruf: SW=<startwert> node tools/ko_a2_fest.mjs <name> "ENV=1 ENV2=x" [karten] → entwurf/probe/ko_a2/messung/
import { spawn } from 'node:child_process';
import { writeFileSync, appendFileSync } from 'node:fs';
const [name, envs = '', kartenArg] = process.argv.slice(2);
const KARTEN = (kartenArg || 'grauwall,sanktruss,winterdorf').split(','), D = 'entwurf/probe/ko_a2/messung';
const env = { ...process.env }; for (const kv of envs.split(' ').filter(Boolean)) { const [k, v] = kv.split('='); env[k] = v; }
const lauf = karte => new Promise(res => { let out = ''; const p = spawn('node', ['tools/sim.js', '200', process.env.SW || '1'], { env: { ...env, MAP: karte } }); p.stdout.on('data', d => out += d); p.stderr.on('data', d => out += d);
  const t = setTimeout(() => p.kill(), 590000); p.on('close', () => { clearTimeout(t); res(out); }); });
const erg = {};
const eine = async karte => { for (let v = 0; v < 3; v++) { const out = await lauf(karte); const m = out.match(/Konkordat (\d+) %/); if (m && out.includes('Schlachten')) { writeFileSync(`${D}/${name}_${karte}.txt`, out); erg[karte] = +m[1]; return; } } erg[karte] = null; };
const q = [...KARTEN]; await Promise.all([0, 1].map(async () => { while (q.length) await eine(q.shift()); }));
const z = `${name} (${envs}): ` + KARTEN.map(k => `${k} ${erg[k]} %`).join(', ');
appendFileSync(`${D}/ergebnisse.txt`, z + '\n'); console.log(z);
