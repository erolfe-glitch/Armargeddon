# Gemini-Prompts: erste Lieferung Figurenbögen (neue Ansicht, Variante D)

Stand 2026-11-16. Je Fraktion 6 Bögen: Sturmtruppe, Pionier, MG (Einzelmodell), Geschütz (Einzelmodell), Anführer (Einzelmodell), Panzer (Einzelmodell); dazu für die Aschenwacht zusätzlich der Bohrkoloss.

## So vorgehen

1. Bei **jedem** Prompt zwei Bilder mitgeben:
   - `ui-quelle/konzept/einzel_konzept.png` (Stilvorlage),
   - `ui-quelle/figuren/konkordat_soldat.png` bzw. `ui-quelle/figuren/aschenwacht_soldat.png` (Blickwinkel, Maßstab, Uniform der Fraktion). **Der Blickwinkel richtet sich genau nach diesen beiden Bögen, nicht steiler** – Einheitlichkeit geht vor.
2. Prompt unten kopieren (Englisch), Ergebnis als **PNG** unter dem angegebenen Dateinamen in `ui-quelle/figuren/` speichern.
3. Ich stelle die Bögen dann mit `tools/figure_cut.py` frei. Bei Trupp-Bögen müssen die 4 Posen im 2×2-Raster stehen, bei Einzelmodellen genau ein Modell in der Bildmitte.

Prüfen vor dem Speichern: reiner Magenta-Hintergrund ohne Verlauf, nichts berührt den Bildrand oder die Nachbarpose, kein Boden, kein Schatten, kein Mündungsfeuer, kein Rauch, Blick nach rechts.

---

## Gemeinsamer Baustein (steht in jedem Prompt schon drin)

> Style: dark gothic trench-warfare comic illustration, exactly like the attached style reference (einzel_konzept.png): thick black ink outlines, hand-inked hatching, gritty painted textures, muted desaturated colours, rust and mud, a world inspired by the First World War but our own fictional setting – no real nations, no real insignia, no existing franchise. Camera: exactly the same viewing angle, perspective and scale as the attached soldier sheet – three-quarter view from front-right, slightly from above, figures facing right, light from top-left. Background: flat pure magenta (#FF00FF) everywhere, no gradient, no floor, no ground plane, no cast shadow, no smoke, no muzzle flash, no sparks, no text, no frame. Nothing may touch the image border.

## Fraktionen (Kurzbeschreibung)

- **Konkordat von Valmor:** long ragged oxblood-red greatcoats (#8E2B22, weathered and muddy), khaki-brown trousers with puttees, flat round steel helmets (brodie shape), dark steel breastplate with an embossed lion head, gas masks with round yellow-glowing lenses and corrugated hose, brown leather webbing and pouches.
- **Aschenwacht des Grauwalls:** long ragged field-grey greatcoats with a greenish tint (#7D8471, weathered, blood and mud stains), steel spiked helmets, dark steel breastplate with an embossed visored-helm emblem, gas masks with round yellow-glowing lenses and corrugated hose, brown leather webbing and pouches.

---

## Konkordat

### 1. Sturmtruppe (Grabenräumer) → `konkordat_sturm.png`

```
Create a character sheet of ONE soldier type in 4 different poses, arranged in a 2×2 grid on a square 1264×1264 image, each pose centred in its quarter with clear magenta space around it, all poses at the same scale as the attached soldier sheet (konkordat_soldat.png).

Unit: a trench raider (close-assault trooper) of the "Konkordat von Valmor": long ragged oxblood-red greatcoat (#8E2B22, weathered and muddy), khaki-brown trousers with puttees, flat round steel helmet (brodie shape), dark steel breastplate with an embossed lion head, extra steel shoulder plate, gas mask with round yellow-glowing lenses and corrugated hose, brown leather webbing with grenade bags. Weapons: spiked trench club and trench knife, stick grenades on the belt, a short pump shotgun slung on the back.

Poses (top left, top right, bottom left, bottom right):
1. advancing crouched, club raised at the side, ready to strike
2. throwing a stick grenade overhand (grenade still in the hand, no explosion)
3. kneeling, shotgun shouldered and aimed to the right (no muzzle flash)
4. charging forward at full run, club swung high

Style: dark gothic trench-warfare comic illustration, exactly like the attached style reference (einzel_konzept.png): thick black ink outlines, hand-inked hatching, gritty painted textures, muted desaturated colours, rust and mud, a world inspired by the First World War but our own fictional setting – no real nations, no real insignia, no existing franchise. Camera: exactly the same viewing angle, perspective and scale as the attached soldier sheet – three-quarter view from front-right, slightly from above, figures facing right, light from top-left. Background: flat pure magenta (#FF00FF) everywhere, no gradient, no floor, no ground plane, no cast shadow, no smoke, no muzzle flash, no sparks, no text, no frame. Nothing may touch the image border.
```

### 2. Pionier (Graben-Pioniere, Mineure, Sprengtrupp) → `konkordat_pionier.png`

```
Create a character sheet of ONE soldier type in 4 different poses, arranged in a 2×2 grid on a square 1264×1264 image, each pose centred in its quarter with clear magenta space around it, all poses at the same scale as the attached soldier sheet (konkordat_soldat.png).

Unit: a combat engineer (sapper) of the "Konkordat von Valmor": long ragged oxblood-red greatcoat (#8E2B22) shortened and tucked up for work, khaki-brown trousers with puttees, flat round steel helmet (brodie shape), dark steel breastplate with an embossed lion head, heavy leather apron, gas mask with round yellow-glowing lenses and corrugated hose, tool belt. Equipment: long-handled wire cutters, entrenching shovel, a coil of barbed wire, a satchel demolition charge with a fuse cord, carbine slung on the back.

Poses (top left, top right, bottom left, bottom right):
1. standing, cutting barbed wire with long-handled wire cutters held in front
2. digging, shovel driven into the ground (no ground visible, only the tool)
3. kneeling, placing a satchel charge in front of him, fuse cord in hand
4. walking to the right, carrying a coil of barbed wire on the shoulder

Style: dark gothic trench-warfare comic illustration, exactly like the attached style reference (einzel_konzept.png): thick black ink outlines, hand-inked hatching, gritty painted textures, muted desaturated colours, rust and mud, a world inspired by the First World War but our own fictional setting – no real nations, no real insignia, no existing franchise. Camera: exactly the same viewing angle, perspective and scale as the attached soldier sheet – three-quarter view from front-right, slightly from above, figures facing right, light from top-left. Background: flat pure magenta (#FF00FF) everywhere, no gradient, no floor, no ground plane, no cast shadow, no smoke, no muzzle flash, no sparks, no text, no frame. Nothing may touch the image border.
```

### 3. MG „Mahlwerk“ (Einzelmodell) → `konkordat_mg.png`

```
Create ONE single model, centred on a square 1264×1264 image, filling about 80% of the width, at the same soldier scale as the attached soldier sheet (konkordat_soldat.png).

Model: a heavy machine-gun team of the "Konkordat von Valmor", shown as one group: a heavy water-cooled machine gun with a thick ribbed cooling jacket on a low tripod, ammunition belt feeding from a wooden box. Crew of two: the gunner sitting/kneeling behind the gun with both hands on the grips, aiming to the right; the loader kneeling at the left side feeding the belt. Both wear long ragged oxblood-red greatcoats (#8E2B22), flat round steel helmets (brodie shape), dark steel breastplates with an embossed lion head, gas masks with round yellow-glowing lenses. A few sandbags may be stacked directly in front of the gun (attached to the model, not a ground plane). Gun pointing to the right, no muzzle flash, no smoke, no spent cases flying.

Style: dark gothic trench-warfare comic illustration, exactly like the attached style reference (einzel_konzept.png): thick black ink outlines, hand-inked hatching, gritty painted textures, muted desaturated colours, rust and mud, a world inspired by the First World War but our own fictional setting – no real nations, no real insignia, no existing franchise. Camera: exactly the same viewing angle, perspective and scale as the attached soldier sheet – three-quarter view from front-right, slightly from above, facing right, light from top-left. Background: flat pure magenta (#FF00FF) everywhere, no gradient, no floor, no ground plane, no cast shadow, no smoke, no muzzle flash, no sparks, no text, no frame. Nothing may touch the image border.
```

### 4. Geschütz „Donnerrohr-Batterie“ (Einzelmodell) → `konkordat_geschuetz.png`

```
Create ONE single model, centred on a square 1264×1264 image, filling about 85% of the width, at the same soldier scale as the attached soldier sheet (konkordat_soldat.png).

Model: a heavy field howitzer of the "Konkordat von Valmor" with its crew: a short thick barrel raised at about 30 degrees, pointing to the right, heavy recoil cylinders, two large spoked wooden wheels with iron rims, a riveted steel gun shield with an embossed lion head, a long trail behind. Crew of two in long ragged oxblood-red greatcoats (#8E2B22), flat round steel helmets (brodie shape), gas masks with round yellow-glowing lenses: one loader carrying a large shell in both arms at the breech, one gunner at the side holding the firing lanyard. One open ammunition crate with shells beside the wheel. No muzzle flash, no smoke.

Style: dark gothic trench-warfare comic illustration, exactly like the attached style reference (einzel_konzept.png): thick black ink outlines, hand-inked hatching, gritty painted textures, muted desaturated colours, rust and mud, a world inspired by the First World War but our own fictional setting – no real nations, no real insignia, no existing franchise. Camera: exactly the same viewing angle, perspective and scale as the attached soldier sheet – three-quarter view from front-right, slightly from above, facing right, light from top-left. Background: flat pure magenta (#FF00FF) everywhere, no gradient, no floor, no ground plane, no cast shadow, no smoke, no muzzle flash, no sparks, no text, no frame. Nothing may touch the image border.
```

### 5. Anführer „Hauptmann“ (Einzelmodell) → `konkordat_hauptmann.png`

```
Create ONE single figure, centred on a square 1264×1264 image, at the same soldier scale as the attached soldier sheet (konkordat_soldat.png) – the figure is exactly as tall as the standing soldier there.

Figure: an officer (captain) of the "Konkordat von Valmor", standing in a commanding pose, one arm pointing forward to the right, the other hand holding a raised trench whistle; a revolver in a holster, a sabre at the hip. Long ragged oxblood-red officer's greatcoat (#8E2B22) with brass buttons and a short cape over the shoulders, flat round steel helmet (brodie shape) with a small brass crest, ornate dark steel breastplate with an embossed lion head, gas mask with round yellow-glowing lenses hanging open on the chest so the stern scarred face is visible, leather map case, binoculars. A small pennant on a short pole strapped to his back (oxblood red, lion emblem, no text).

Style: dark gothic trench-warfare comic illustration, exactly like the attached style reference (einzel_konzept.png): thick black ink outlines, hand-inked hatching, gritty painted textures, muted desaturated colours, rust and mud, a world inspired by the First World War but our own fictional setting – no real nations, no real insignia, no existing franchise. Camera: exactly the same viewing angle, perspective and scale as the attached soldier sheet – three-quarter view from front-right, slightly from above, facing right, light from top-left. Background: flat pure magenta (#FF00FF) everywhere, no gradient, no floor, no ground plane, no cast shadow, no smoke, no muzzle flash, no sparks, no text, no frame. Nothing may touch the image border.
```

### 6. Panzer „Landkoloss“ (Einzelmodell) → `konkordat_koloss.png`

```
Create ONE single vehicle, centred on a wide 1792×1024 image, filling about 85% of the width, at the same soldier scale as the attached soldier sheet (konkordat_soldat.png): the hull is about 1.4 times as tall as a standing soldier.

Vehicle: the "Landkoloss", a huge early tank of the "Konkordat von Valmor": rhomboid hull with tracks running all the way around, heavily riveted iron plates, side sponsons with short cannons, a few vision slits, exhaust pipes on top, rust, mud caked on the tracks, oxblood-red (#8E2B22) paint worn and chipped on the armour, an embossed lion head on the side plate. Orientation: seen mostly from the side, driving to the RIGHT, only a slight three-quarter turn so the front is a little visible – not strongly angled. No crew outside, no muzzle flash, no exhaust smoke.

Style: dark gothic trench-warfare comic illustration, exactly like the attached style reference (einzel_konzept.png): thick black ink outlines, hand-inked hatching, gritty painted textures, muted desaturated colours, rust and mud, a world inspired by the First World War but our own fictional setting – no real nations, no real insignia, no existing franchise. Camera: same height and tilt as the attached soldier sheet, light from top-left. Background: flat pure magenta (#FF00FF) everywhere, no gradient, no floor, no ground plane, no cast shadow, no smoke, no muzzle flash, no sparks, no text, no frame. Nothing may touch the image border.
```

---

## Aschenwacht

### 7. Sturmtruppe (Sturmbrecher, Grabenkämpfer, Eingreiftrupp) → `aschenwacht_sturm.png`

```
Create a character sheet of ONE soldier type in 4 different poses, arranged in a 2×2 grid on a square 1264×1264 image, each pose centred in its quarter with clear magenta space around it, all poses at the same scale as the attached soldier sheet (aschenwacht_soldat.png).

Unit: a storm trooper of the "Aschenwacht des Grauwalls": long ragged field-grey greatcoat with a greenish tint (#7D8471, weathered, blood and mud stains), steel spiked helmet, dark steel breastplate with an embossed visored-helm emblem, extra steel shoulder plate, gas mask with round yellow-glowing lenses and corrugated hose, brown leather webbing with grenade bags and a bag of stick grenades over the chest. Weapons: sharpened entrenching spade, stick grenades, a short carbine.

Poses (top left, top right, bottom left, bottom right):
1. advancing crouched, sharpened spade held ready
2. throwing a stick grenade overhand (grenade still in the hand, no explosion)
3. kneeling, carbine shouldered and aimed to the right (no muzzle flash)
4. charging forward at full run, spade swung high

Style: dark gothic trench-warfare comic illustration, exactly like the attached style reference (einzel_konzept.png): thick black ink outlines, hand-inked hatching, gritty painted textures, muted desaturated colours, rust and mud, a world inspired by the First World War but our own fictional setting – no real nations, no real insignia, no existing franchise. Camera: exactly the same viewing angle, perspective and scale as the attached soldier sheet – three-quarter view from front-right, slightly from above, figures facing right, light from top-left. Background: flat pure magenta (#FF00FF) everywhere, no gradient, no floor, no ground plane, no cast shadow, no smoke, no muzzle flash, no sparks, no text, no frame. Nothing may touch the image border.
```

### 8. Pionier (Drahtpioniere, Minenleger) → `aschenwacht_pionier.png`

```
Create a character sheet of ONE soldier type in 4 different poses, arranged in a 2×2 grid on a square 1264×1264 image, each pose centred in its quarter with clear magenta space around it, all poses at the same scale as the attached soldier sheet (aschenwacht_soldat.png).

Unit: a combat engineer (sapper) of the "Aschenwacht des Grauwalls": long ragged field-grey greatcoat with a greenish tint (#7D8471) shortened and tucked up for work, steel spiked helmet, dark steel breastplate with an embossed visored-helm emblem, heavy leather apron, gas mask with round yellow-glowing lenses and corrugated hose, tool belt. Equipment: long-handled wire cutters, entrenching shovel, a coil of barbed wire, a round anti-tank mine (dish shape), carbine slung on the back.

Poses (top left, top right, bottom left, bottom right):
1. standing, cutting barbed wire with long-handled wire cutters held in front
2. digging, shovel driven down (no ground visible, only the tool)
3. kneeling, placing a round mine in front of him
4. walking to the right, carrying a coil of barbed wire on the shoulder

Style: dark gothic trench-warfare comic illustration, exactly like the attached style reference (einzel_konzept.png): thick black ink outlines, hand-inked hatching, gritty painted textures, muted desaturated colours, rust and mud, a world inspired by the First World War but our own fictional setting – no real nations, no real insignia, no existing franchise. Camera: exactly the same viewing angle, perspective and scale as the attached soldier sheet – three-quarter view from front-right, slightly from above, figures facing right, light from top-left. Background: flat pure magenta (#FF00FF) everywhere, no gradient, no floor, no ground plane, no cast shadow, no smoke, no muzzle flash, no sparks, no text, no frame. Nothing may touch the image border.
```

### 9. MG „Sensenwerk“ (Einzelmodell) → `aschenwacht_mg.png`

```
Create ONE single model, centred on a square 1264×1264 image, filling about 80% of the width, at the same soldier scale as the attached soldier sheet (aschenwacht_soldat.png).

Model: a heavy machine-gun team of the "Aschenwacht des Grauwalls", shown as one group: a heavy water-cooled machine gun with a smooth cylindrical cooling jacket mounted on a low sled-type carriage, ammunition belt feeding from a metal box. Crew of two: the gunner lying/kneeling behind the gun with both hands on the grips, aiming to the right; the loader kneeling at the left side feeding the belt. Both wear long ragged field-grey greatcoats with a greenish tint (#7D8471), steel spiked helmets, dark steel breastplates with an embossed visored-helm emblem, gas masks with round yellow-glowing lenses. A few sandbags may be stacked directly in front of the gun (attached to the model, not a ground plane). Gun pointing to the right, no muzzle flash, no smoke, no spent cases flying.

Style: dark gothic trench-warfare comic illustration, exactly like the attached style reference (einzel_konzept.png): thick black ink outlines, hand-inked hatching, gritty painted textures, muted desaturated colours, rust and mud, a world inspired by the First World War but our own fictional setting – no real nations, no real insignia, no existing franchise. Camera: exactly the same viewing angle, perspective and scale as the attached soldier sheet – three-quarter view from front-right, slightly from above, facing right, light from top-left. Background: flat pure magenta (#FF00FF) everywhere, no gradient, no floor, no ground plane, no cast shadow, no smoke, no muzzle flash, no sparks, no text, no frame. Nothing may touch the image border.
```

### 10. Geschütz „Grabengeschütz“ (Einzelmodell) → `aschenwacht_geschuetz.png`

```
Create ONE single model, centred on a square 1264×1264 image, filling about 85% of the width, at the same soldier scale as the attached soldier sheet (aschenwacht_soldat.png).

Model: a field gun of the "Aschenwacht des Grauwalls" with its crew: a long slim barrel pointing to the right, slightly raised, a riveted angular steel gun shield with an embossed visored-helm emblem, two large spoked wooden wheels with iron rims, a box trail behind. Crew of two in long ragged field-grey greatcoats with a greenish tint (#7D8471), steel spiked helmets, gas masks with round yellow-glowing lenses: one loader pushing a shell into the breech, one gunner at the sight holding the firing lanyard. One open wicker shell basket beside the wheel. No muzzle flash, no smoke.

Style: dark gothic trench-warfare comic illustration, exactly like the attached style reference (einzel_konzept.png): thick black ink outlines, hand-inked hatching, gritty painted textures, muted desaturated colours, rust and mud, a world inspired by the First World War but our own fictional setting – no real nations, no real insignia, no existing franchise. Camera: exactly the same viewing angle, perspective and scale as the attached soldier sheet – three-quarter view from front-right, slightly from above, facing right, light from top-left. Background: flat pure magenta (#FF00FF) everywhere, no gradient, no floor, no ground plane, no cast shadow, no smoke, no muzzle flash, no sparks, no text, no frame. Nothing may touch the image border.
```

### 11. Anführer „Hauptmann“ (Einzelmodell) → `aschenwacht_hauptmann.png`

```
Create ONE single figure, centred on a square 1264×1264 image, at the same soldier scale as the attached soldier sheet (aschenwacht_soldat.png) – the figure is exactly as tall as the standing soldier there.

Figure: an officer (captain) of the "Aschenwacht des Grauwalls", standing in a commanding pose, one arm pointing forward to the right with a drawn sabre, the other hand on a holstered pistol. Long ragged field-grey officer's greatcoat with a greenish tint (#7D8471), dark fur collar, silver buttons, steel spiked helmet with a small skull-and-wings crest (fictional, no real insignia), ornate dark steel breastplate with an embossed visored-helm emblem, gas mask with round yellow-glowing lenses hanging open on the chest so the stern scarred face with a monocle is visible, leather map case, binoculars. A small pennant on a short pole strapped to his back (black, white and red stripes, visored-helm emblem, no text).

Style: dark gothic trench-warfare comic illustration, exactly like the attached style reference (einzel_konzept.png): thick black ink outlines, hand-inked hatching, gritty painted textures, muted desaturated colours, rust and mud, a world inspired by the First World War but our own fictional setting – no real nations, no real insignia, no existing franchise. Camera: exactly the same viewing angle, perspective and scale as the attached soldier sheet – three-quarter view from front-right, slightly from above, facing right, light from top-left. Background: flat pure magenta (#FF00FF) everywhere, no gradient, no floor, no ground plane, no cast shadow, no smoke, no muzzle flash, no sparks, no text, no frame. Nothing may touch the image border.
```

### 12. Panzer „Sturmpanzer“ (Einzelmodell) → `aschenwacht_panzer.png`

Eigener Panzer der Aschenwacht (Wunsch 2026-11-16): schwer und kastenförmig, angelehnt an den A7V, aber düster-fantastisch und eigene Welt.

```
Create ONE single vehicle, centred on a wide 1792×1024 image, filling about 85% of the width, at the same soldier scale as the attached soldier sheet (aschenwacht_soldat.png): the hull is about 1.4 times as tall as a standing soldier.

Vehicle: the "Sturmpanzer" of the "Aschenwacht des Grauwalls", a huge heavy assault tank with a tall boxy armoured hull – inspired by the early box-shaped German tank of 1918, but a dark gothic fantasy version of our own world, not a real vehicle: steep slab sides of heavily riveted dark iron plates, a blunt front with a short heavy cannon in the bow pointing to the RIGHT, several machine-gun ports with stubby barrels along the side, a raised command cupola with vision slits on the roof, low tracks almost hidden behind armoured skirts that hang down to the ground, spikes and chains on the skirts, exhaust stacks at the back, field-grey paint with a greenish tint (#7D8471) worn, rusted and caked with mud, an embossed visored-helm emblem on the side plate, faded black-white-red stripes painted on the bow (no real insignia, no crosses). Orientation: seen mostly from the side, driving to the RIGHT, only a slight three-quarter turn so the front is a little visible – not strongly angled. No crew outside, no muzzle flash, no exhaust smoke.

Style: dark gothic trench-warfare comic illustration, exactly like the attached style reference (einzel_konzept.png): thick black ink outlines, hand-inked hatching, gritty painted textures, muted desaturated colours, rust and mud, a world inspired by the First World War but our own fictional setting – no real nations, no real insignia, no existing franchise. Camera: same height and tilt as the attached soldier sheet, light from top-left. Background: flat pure magenta (#FF00FF) everywhere, no gradient, no floor, no ground plane, no cast shadow, no smoke, no muzzle flash, no sparks, no text, no frame. Nothing may touch the image border.
```

### 13. Koloss „Bohrkoloss“ (Einzelmodell, zusätzlich) → `aschenwacht_bohrkoloss.png`

Hinweis: Der Bohrkoloss ist eine Kampfmaschine und erscheint nur mit eingeschalteten Kampfmaschinen im Spiel. Er bleibt zusätzlich zum Sturmpanzer drin.

```
Create ONE single vehicle, centred on a wide 1792×1024 image, filling about 85% of the width, at the same soldier scale as the attached soldier sheet (aschenwacht_soldat.png): the machine is about 1.5 times as tall as a standing soldier.

Vehicle: the "Bohrkoloss", a massive tracked siege machine of the "Aschenwacht des Grauwalls": a low armoured hull on wide tracks, heavily riveted dark iron plates painted field-grey with a greenish tint (#7D8471), worn and rusted, a huge conical rotary drill bit mounted at the front pointing to the RIGHT, a small armoured cupola with vision slits, exhaust stacks at the back, an embossed visored-helm emblem on the side plate, chains and mud on the tracks. Orientation: seen mostly from the side, facing to the RIGHT, only a slight three-quarter turn so the front is a little visible – not strongly angled. No crew outside, no smoke, no sparks.

Style: dark gothic trench-warfare comic illustration, exactly like the attached style reference (einzel_konzept.png): thick black ink outlines, hand-inked hatching, gritty painted textures, muted desaturated colours, rust and mud, a world inspired by the First World War but our own fictional setting – no real nations, no real insignia, no existing franchise. Camera: same height and tilt as the attached soldier sheet, light from top-left. Background: flat pure magenta (#FF00FF) everywhere, no gradient, no floor, no ground plane, no cast shadow, no smoke, no muzzle flash, no sparks, no text, no frame. Nothing may touch the image border.
```
