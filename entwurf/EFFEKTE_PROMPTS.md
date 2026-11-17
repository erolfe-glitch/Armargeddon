# Effekt-Prompts (Stand 2026-11-17)

## So machen wir Effekte am besten

- **Keine Einzelbild-Animation.** Bildprogramme malen keine sauberen Bildfolgen. Stattdessen malen wir **Bögen mit 6 Varianten** eines Effekts. Das Spiel wählt zufällig eine aus und bewegt sie selbst (wachsen, steigen, drehen, verblassen). So wirkt es lebendig, auch ohne Einzelbilder.
- **Zwei Arten von Hintergrund:**
  - **Leuchtendes** (Feuer, Mündungsfeuer, Funken, Explosionskern, Leuchtkugel) → **reines Schwarz**. Das Spiel legt es „aufhellend" über das Bild, Schwarz verschwindet von selbst, der Glüh-Rand bleibt weich. Nichts muss freigestellt werden.
  - **Deckendes** (Rauch, Staub, Erde, Blut, Gas, Brandflecken) → **Magenta** wie bei den Figuren. Damit das sauber freigestellt werden kann, sollen die Wolken **Comic-Tuschekonturen** haben, keine weichen Nebelränder.
- **Stilvorlage:** `ui-quelle/figuren/konkordat_stahl.png` mit hochladen und die erste Zeile im Prompt lassen.
- **Größe:** egal, Claude Code skaliert. Wichtig ist, dass alle 6 Varianten auf einem Bogen gleich groß sind.
- Jedes Bild in einem **neuen Chat**. Speichern unter dem Dateinamen, dann an Claude (Chat) schicken.

| Nr | Effekt | Datei | Hintergrund |
|---|---|---|---|
| 1 | Mündungsfeuer (Gewehr, MG, Pistole, Kanone) | fx_muendung.png | Schwarz |
| 2 | Explosion – Feuerkern | fx_explosion.png | Schwarz |
| 3 | Erdfontäne nach Einschlag | fx_erdfontaene.png | Magenta |
| 4 | Dunkler Rauch | fx_rauch.png | Magenta |
| 5 | Nebelwand (heller, dicker Rauch) | fx_nebel.png | Magenta |
| 6 | Giftgas | fx_gas.png | Magenta |
| 7 | Flammen am Boden | fx_feuer.png | Schwarz |
| 8 | Funken / Querschläger auf Metall | fx_funken.png | Schwarz |
| 9 | Blutspritzer (klein, dunkel) | fx_blut.png | Magenta |
| 10 | Leuchtkugel (Ziel markieren) | fx_leuchtkugel.png | Schwarz |
| 11 | Staub und Trümmer | fx_truemmer.png | Magenta |
| 12 | Brandflecken und Einschlagspuren am Boden | fx_bodenspuren.png | Magenta |

---

## 1. Mündungsfeuer → `fx_muendung.png`

```
Match the drawing style of the uploaded sheet exactly: same hand-inked comic look, same muted colour values. Use it only for the style.

Effect sheet: 6 different muzzle flashes, arranged in a 3 by 2 grid with clear empty space between them, all pointing to the right, seen from the side. Hand-inked comic style, glowing but not neon: warm orange-yellow core fading to deep red edges, a few dark ink lines for shape.
Row 1: small rifle flash; elongated machine-gun flash with several short tongues; small pistol flash.
Row 2: large cannon flash with a wide flame cone; short squat mortar flash pointing upward; long thin flash with a puff of sparks.
Background: solid pure black (#000000) everywhere. No smoke, no gun, no text, no letters, no sound words.
```

## 2. Explosion – Feuerkern → `fx_explosion.png`

```
Match the drawing style of the uploaded sheet exactly: same hand-inked comic look, same muted colour values. Use it only for the style.

Effect sheet: an artillery shell explosion in 4 stages from left to right in one row, plus 2 extra variations below. Hand-inked comic style: a bright yellow-orange fireball with jagged edges, dark red outer flames, a few black ink strokes and flying hot fragments. Stage 1 small bright flash, stage 2 large fireball, stage 3 fireball breaking up into flame tongues, stage 4 fading embers.
Background: solid pure black (#000000) everywhere. No ground, no smoke, no text, no letters, no sound words.
```

## 3. Erdfontäne → `fx_erdfontaene.png`

```
Match the drawing style of the uploaded sheet exactly: same hand-inked comic outlines, hatching and muted colours. Use it only for the style.

Effect sheet: 6 different fountains of mud and earth thrown up by a shell impact, arranged in a 3 by 2 grid with clear empty space between them, slightly from above. Hand-inked comic style with thick black ink outlines: dark brown wet mud, clods of earth, small stones, splinters of wood and scraps of barbed wire flying upward and outward, a few dark smoke wisps with ink outlines. Varied heights, some tall and narrow, some wide and low.
Background: solid flat pure magenta (#FF00FF) everywhere. No fire, no ground surface, no shadow, no text.
```

## 4. Dunkler Rauch → `fx_rauch.png`

```
Match the drawing style of the uploaded sheet exactly: same hand-inked comic outlines, hatching and muted colours. Use it only for the style.

Effect sheet: 6 different puffs and columns of dark battlefield smoke, arranged in a 3 by 2 grid with clear empty space between them. Hand-inked comic style: billowing rounded cloud shapes with clear black ink outlines and hatched shading, sooty dark grey to brown-grey, opaque, not soft or blurry. Sizes from a small puff to a tall rising column.
Background: solid flat pure magenta (#FF00FF) everywhere. No fire, no ground, no shadow, no text.
```

## 5. Nebelwand → `fx_nebel.png`

```
Match the drawing style of the uploaded sheet exactly: same hand-inked comic outlines, hatching and muted colours. Use it only for the style.

Effect sheet: 6 different thick white-grey smoke-screen clouds, arranged in a 3 by 2 grid with clear empty space between them. Hand-inked comic style: dense, rolling, low-lying cloud banks with clear dark ink outlines and soft grey hatched shading, dirty off-white and pale ash-grey, opaque, wider than tall.
Background: solid flat pure magenta (#FF00FF) everywhere. No ground, no shadow, no text.
```

## 6. Giftgas → `fx_gas.png`

```
Match the drawing style of the uploaded sheet exactly: same hand-inked comic outlines, hatching and muted colours. Use it only for the style.

Effect sheet: 6 different clouds of poison gas, arranged in a 3 by 2 grid with clear empty space between them. Hand-inked comic style: heavy, creeping, low cloud shapes with clear dark ink outlines, sickly mustard-yellow to dirty olive-green, darker green hatching in the folds, a few thin tendrils, opaque, wider than tall.
Background: solid flat pure magenta (#FF00FF) everywhere. No ground, no shadow, no skulls, no text.
```

## 7. Flammen am Boden → `fx_feuer.png`

```
Match the drawing style of the uploaded sheet exactly: same hand-inked comic look, same muted colour values. Use it only for the style.

Effect sheet: 6 different small fires burning on the ground, arranged in a 3 by 2 grid with clear empty space between them, seen slightly from above. Hand-inked comic style: flickering flame tongues in orange and yellow with deep red edges and a few black ink strokes, glowing embers at the base. Mix of single flames, small clusters of flames and a burning patch.
Background: solid pure black (#000000) everywhere. No ground, no wood, no smoke, no text.
```

## 8. Funken / Querschläger → `fx_funken.png`

```
Match the drawing style of the uploaded sheet exactly: same hand-inked comic look, same muted colour values. Use it only for the style.

Effect sheet: 6 different bursts of sparks from bullets and shells hitting steel armour, arranged in a 3 by 2 grid with clear empty space between them. Hand-inked comic style: a small white-yellow flash at the centre with sharp orange spark streaks flying outward in a fan, a few glowing metal fragments. Varied sizes and directions.
Background: solid pure black (#000000) everywhere. No metal surface, no smoke, no text.
```

## 9. Blutspritzer → `fx_blut.png`

```
Match the drawing style of the uploaded sheet exactly: same hand-inked comic outlines, hatching and muted colours. Use it only for the style.

Effect sheet: 6 different small blood splatters, arranged in a 3 by 2 grid with clear empty space between them. Row 1: three mid-air sprays of droplets flying to the right. Row 2: three small stains on the ground seen from above. Hand-inked comic style: very dark red to brown-red, almost black in the centre, not bright red, small and irregular, a few drips, no long running streaks.
Background: solid flat pure magenta (#FF00FF) everywhere. No ground surface, no body parts, no text.
```

## 10. Leuchtkugel → `fx_leuchtkugel.png`

```
Match the drawing style of the uploaded sheet exactly: same hand-inked comic look, same muted colour values. Use it only for the style.

Effect sheet: a signal flare, 6 images in a 3 by 2 grid with clear empty space between them. Row 1: a flare rising with a curved trail of sparks; a flare bursting into a bright star; a burning flare hanging under a small parachute. Row 2: three variations of the bright glow – a white-yellow core with a reddish-orange halo and a few ink-drawn rays.
Background: solid pure black (#000000) everywhere. No sky, no smoke, no text.
```

## 11. Staub und Trümmer → `fx_truemmer.png`

```
Match the drawing style of the uploaded sheet exactly: same hand-inked comic outlines, hatching and muted colours. Use it only for the style.

Effect sheet: 6 different clouds of dust and debris, arranged in a 3 by 2 grid with clear empty space between them: a collapsing-wall dust cloud with flying bricks; a burst of wooden splinters and planks; a low dust cloud kicked up by heavy footsteps; a spray of grit and small stones from a drill; flying sandbag scraps and dirt; a wide low dust ring. Hand-inked comic style with clear black ink outlines, dusty grey-brown and brick-red, opaque.
Background: solid flat pure magenta (#FF00FF) everywhere. No ground surface, no shadow, no text.
```

## 12. Bodenspuren → `fx_bodenspuren.png`

```
Match the drawing style of the uploaded sheet exactly: same hand-inked comic outlines, hatching and muted colours. Use it only for the style.

Effect sheet: 6 different marks on muddy ground, seen from above at a slight angle, arranged in a 3 by 2 grid with clear empty space between them: a black scorched burn mark with ash; a small shell scorch with scattered debris; a dark puddle of oil; a patch of burnt barbed-wire remains; churned tank-track ruts; a small fresh crater with dark wet edges. Hand-inked comic style, dark and muted, flat on the ground, the edges blending into irregular broken shapes.
Background: solid flat pure magenta (#FF00FF) everywhere. No units, no shadow, no text.
```
