# Posen-Bögen für die Animation (Stufe 1) – Prompts für Gemini

Stand 2026-11-20. Vorbild: `konkordat_soldat_posen.png` / `aschenwacht_soldat_posen.png` (hat funktioniert).
Jede Einheit bekommt einen zweiten Bogen `<einheit>_posen.png` (2×2, vier neue Posen) zu ihrem vorhandenen Bogen.

## So geht's
1. Für jede Einheit einen **neuen Gemini-Chat**.
2. **Nur** den vorhandenen Bogen dieser Einheit anhängen (`ui-quelle/figuren/<einheit>.png`).
3. Grundprompt unten einfügen und die vier Posen aus der Liste der Einheit in `[POSEN]` einsetzen.
4. Kopiert Gemini die alten Posen: im selben Chat „Do not copy the reference poses. Draw four completely NEW poses as described.“
5. Ergebnis über **Herunterladen** speichern (nicht die Vorschau), an Claude (Berater) schicken. Claude legt es als `ui-quelle/figuren/<einheit>_posen.png` ab.

## Grundprompt
```
Create a new 2x2 character sheet of EXACTLY the same character as in the attached reference sheet: same face/mask, helmet, armour, uniform, colours, equipment and weapon. Same art style: dark gritty ink outlines, hand-drawn hatching, worn, dirty and blood-stained textures, same lighting, same scale and same three-quarter side view facing right.
Do not copy the reference poses. Draw four completely NEW poses, one per quadrant, figures not overlapping:
[POSEN]
No muzzle flash, no flames, no sparks, no bullets, no projectiles, no extra weapons, no extra figures or body parts anywhere.
Solid flat magenta background #FF00FF, no ground, no shadows on the background, no text. No national flags, no Union Jack, no real-world insignia.
```

## Reihenfolge und Posen

### 1. Sturmtrupp – `konkordat_sturm`, `aschenwacht_sturm`
```
1. Top left: winding up to throw a stick grenade, throwing arm raised far back.
2. Top right: the moment of release, throwing arm stretched forward, hand open and empty, body leaning into the throw.
3. Bottom left: digging, bent forward, driving a short trench shovel into the ground with one boot on the blade.
4. Bottom right: hit and staggering backwards, one hand clutching the chest, knees buckling.
```

### 2. Pioniere – `konkordat_pionier`, `aschenwacht_pionier`
```
1. Top left: kneeling, cutting barbed wire with long-handled wire cutters held in both hands.
2. Top right: kneeling, pressing a bundled demolition charge against something low in front, fuse cord in the other hand.
3. Bottom left: digging, bent forward, driving a short trench shovel into the ground with one boot on the blade.
4. Bottom right: hit and staggering backwards, one hand clutching the chest, knees buckling.
```

### 3. Hauptmann – `konkordat_hauptmann`, `aschenwacht_hauptmann`
```
1. Top left: shouting an order, arm stretched forward pointing the way with a sabre.
2. Top right: firing a pistol forward with an outstretched arm.
3. Bottom left: looking through binoculars, standing braced.
4. Bottom right: hit and staggering backwards, one hand clutching the chest, knees buckling.
```

### 4. General – `konkordat_general`, `aschenwacht_general`
```
1. Top left: raising a sabre high above the head, rallying the troops.
2. Top right: pointing forward with a gloved hand while holding a rolled map.
3. Bottom left: firing a pistol forward with an outstretched arm.
4. Bottom right: hit and staggering backwards, one hand clutching the chest, still upright and defiant.
```

### 5. Sanitäter – `konkordat_sanitaeter`, `aschenwacht_sanitaeter`
```
1. Top left: kneeling and wrapping a bandage around something in front of him at knee height (no second person).
2. Top right: kneeling, opening a medical satchel, pulling out a syringe.
3. Bottom left: running bent low, satchel bouncing at the hip.
4. Bottom right: hit and staggering backwards, one hand clutching the chest, knees buckling.
```

### 6. Flammentrupp – `konkordat_flammen`, `aschenwacht_flammen`
```
1. Top left: firing the flamethrower forward from the hip, braced (no flame drawn).
2. Top right: kneeling, flamethrower nozzle pointed forward (no flame drawn).
3. Bottom left: advancing slowly, nozzle held low, tanks heavy on the back.
4. Bottom right: hit and staggering backwards, one hand clutching the chest, knees buckling.
```

### 7. Kampfanzüge – `konkordat_stahl`, `aschenwacht_panzerknecht`
```
1. Top left: charging forward shoulder-first, weapon held low.
2. Top right: smashing forward with an armoured fist in melee, weapon in the other hand.
3. Bottom left: kneeling and firing the weapon forward, braced (no muzzle flash).
4. Bottom right: hit and staggering backwards, one armoured hand clutching the chest plate.
```

### 8. Versorgungstrupp – `konkordat_versorgung`, `aschenwacht_versorgung`
```
1. Top left: kneeling and tightening a bolt with a large wrench at knee height.
2. Top right: hammering with a heavy hammer at waist height.
3. Bottom left: carrying a heavy ammunition box in both arms, walking forward.
4. Bottom right: hit and staggering backwards, one hand clutching the chest, knees buckling.
```

### 9. Schildträger – `konkordat_schildwall`, `aschenwacht_schwer`
```
1. Top left: bracing behind the raised shield, shoulder pressed against it.
2. Top right: shield bash forward, whole body behind the shield.
3. Bottom left: crouching low behind the shield, weapon ready over its edge.
4. Bottom right: hit and staggering backwards behind the shield, knees buckling.
```

### 10. Scharfschützen – `konkordat_scharfschuetze`, `aschenwacht_pirschjaeger`
```
1. Top left: lying prone, aiming the scoped rifle forward.
2. Top right: kneeling, aiming the scoped rifle forward, very steady.
3. Bottom left: crouching low and sneaking forward, rifle held across the body.
4. Bottom right: hit and staggering backwards, one hand clutching the chest, knees buckling.
```

### 11. Melder / Signaltrupp – `konkordat_melder`, `aschenwacht_signal`
```
1. Top left: sprinting forward, message pouch flying.
2. Top right: waving a signal flag high above the head (plain cloth, no symbols).
3. Bottom left: kneeling, speaking into a field telephone handset.
4. Bottom right: hit and staggering backwards, one hand clutching the chest, knees buckling.
```

### 12. Mineure – `konkordat_mineur`
```
1. Top left: swinging a pickaxe down into the ground.
2. Top right: kneeling, placing a bundled charge into a hole, fuse cord in hand.
3. Bottom left: striking forward in melee with a short trench spade.
4. Bottom right: hit and staggering backwards, one hand clutching the chest, knees buckling.
```

Weitere (Gasschutz, Eingreiftrupp, Rauchwerfer, Panzerbüchse, Feldkanone, Fernsprech, Ballon, Reiter, Schreiter, Fahrzeuge) später; Schreiter/Fahrzeuge bewegt der Code.
