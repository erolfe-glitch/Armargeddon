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


---

# Gelände-Aufsteller (Umbauplan Schritt 4)

Stand 2026-11-16. Hohe Geländeobjekte stehen in der neuen Ansicht als aufrechte Einzelbilder („Aufsteller“) auf ihrem Feld und werden mit den Figuren nach Tiefe sortiert. Der flache Boden (Schlamm, Gras, Trichter, Gräben, Wege) kommt **nicht** von hier.

## So vorgehen

1. Bei **jedem** Prompt zwei Bilder mitgeben:
   - `ui-quelle/konzept/einzel_konzept.png` (Stilvorlage),
   - `ui-quelle/figuren/konkordat_soldat.png` (Blickwinkel und Maßstab). **Der Blickwinkel ist genau der der Figurenbögen, nicht steiler.**
2. Ergebnis als **PNG** unter dem angegebenen Dateinamen in einem neuen Ordner **`ui-quelle/aufsteller/`** speichern.
3. Bögen mit Varianten: 4 Objekte im **2×2-Raster** (je Viertel eins, mittig, mit Magenta-Rand drumherum). Einzelobjekte: genau eins in der Bildmitte.

Maßstab (verbindlich, STYLE.md): ein Feld ist etwa **2,5 stehende Soldaten breit**. Ein Haus bzw. eine Ruine füllt etwa ein Feld. In bespielbaren Feldern bleiben Objekte **niedrig** (Mauerreste, Stümpfe, Stämme), damit Figuren dahinter sichtbar bleiben; hohe Baumkronen nur für den Kartenrand.

Prüfen vor dem Speichern: reiner Magenta-Hintergrund ohne Verlauf, nichts berührt den Bildrand oder das Nachbarobjekt, **kein Boden außerhalb des eigenen Sockels**, kein Schatten, kein Rauch, kein Feuer, kein Licht, kein Text.

## Gemeinsamer Baustein (steht in jedem Prompt schon drin)

> Style: dark gothic trench-warfare comic illustration, exactly like the attached style reference (einzel_konzept.png): thick black ink outlines, hand-inked hatching, gritty painted textures, muted desaturated colours (grey-green-brown), rust, mud and soot, a world inspired by the First World War but our own fictional setting – no real places, no real insignia, no existing franchise. Camera: exactly the same viewing angle, perspective and scale as the attached soldier sheet (konkordat_soldat.png) – three-quarter view from front-right, slightly from above, light from top-left. Scale: one standing soldier of the attached sheet is the reference; the objects are drawn at the same scale. Each object stands on its own small, flat, irregular base of mud and rubble (only directly under the object, the base edge visible as a slightly flattened shape) – no ground beyond that base. Background: flat pure magenta (#FF00FF) everywhere, no gradient, no cast shadow, no smoke, no fire, no light beams, no people, no text, no frame. Nothing may touch the image border or the neighbouring object.

---

### A1. Ruinen (Dorf) → `aufsteller_ruinen.png`

```
Create a sheet of 4 different ruin pieces for a village, arranged in a 2×2 grid on a square 1264×1264 image, each piece centred in its quarter with clear magenta space around it, all at the same scale as the soldier on the attached sheet.

Pieces (top left, top right, bottom left, bottom right):
1. a low L-shaped corner of a shattered brick-and-stone house wall, about 1.2 soldiers high, broken top edge, a few loose bricks on its base
2. a low broken wall section with an empty window frame, about 1.3 soldiers high, about 2 soldiers long, a splintered wooden shutter hanging
3. a collapsed heap of bricks, roof tiles and a charred roof beam sticking out, about 0.8 soldiers high, about 2 soldiers wide
4. a half-destroyed small house: two walls still standing up to the first floor (about 2 soldiers high), no roof, gaping holes, broken rafters, footprint about 2.5 soldiers wide

Style: dark gothic trench-warfare comic illustration, exactly like the attached style reference (einzel_konzept.png): thick black ink outlines, hand-inked hatching, gritty painted textures, muted desaturated colours (grey-green-brown), rust, mud and soot, a world inspired by the First World War but our own fictional setting – no real places, no real insignia, no existing franchise. Camera: exactly the same viewing angle, perspective and scale as the attached soldier sheet (konkordat_soldat.png) – three-quarter view from front-right, slightly from above, light from top-left. Scale: one standing soldier of the attached sheet is the reference; the objects are drawn at the same scale. Each object stands on its own small, flat, irregular base of mud and rubble (only directly under the object, the base edge visible as a slightly flattened shape) – no ground beyond that base. Background: flat pure magenta (#FF00FF) everywhere, no gradient, no cast shadow, no smoke, no fire, no light beams, no people, no text, no frame. Nothing may touch the image border or the neighbouring object.
```

### A2. Kirche → `aufsteller_kirche.png`

```
Create ONE single object, centred on a square 1264×1264 image, at the same scale as the soldier on the attached sheet.

Object: the ruin of a small village church: the stump of a square bell tower with a broken pointed top and an empty belfry opening, about 3.5 soldiers high; attached to it the low remains of the nave walls with two tall gothic window openings without glass, about 1.5 soldiers high; a toppled bell lying on the rubble; footprint about 2.5 soldiers wide and deep.

Style: dark gothic trench-warfare comic illustration, exactly like the attached style reference (einzel_konzept.png): thick black ink outlines, hand-inked hatching, gritty painted textures, muted desaturated colours (grey-green-brown), rust, mud and soot, a world inspired by the First World War but our own fictional setting – no real places, no real insignia, no existing franchise. Camera: exactly the same viewing angle, perspective and scale as the attached soldier sheet (konkordat_soldat.png) – three-quarter view from front-right, slightly from above, light from top-left. Scale: one standing soldier of the attached sheet is the reference; the objects are drawn at the same scale. Each object stands on its own small, flat, irregular base of mud and rubble (only directly under the object, the base edge visible as a slightly flattened shape) – no ground beyond that base. Background: flat pure magenta (#FF00FF) everywhere, no gradient, no cast shadow, no smoke, no fire, no light beams, no people, no text, no frame. Nothing may touch the image border or the neighbouring object.
```

### A3. Fabrik → `aufsteller_fabrik.png`

```
Create ONE single object, centred on a square 1264×1264 image, at the same scale as the soldier on the attached sheet.

Object: the ruin of a small brick factory hall: a tall round brick chimney with a broken top, about 4 soldiers high, standing at the back; in front of it low brick walls with large arched window openings, about 1.5 soldiers high; bent iron roof girders and a fallen riveted steel beam; a rusty pulley and chains; footprint about 2.5 soldiers wide and deep.

Style: dark gothic trench-warfare comic illustration, exactly like the attached style reference (einzel_konzept.png): thick black ink outlines, hand-inked hatching, gritty painted textures, muted desaturated colours (grey-green-brown), rust, mud and soot, a world inspired by the First World War but our own fictional setting – no real places, no real insignia, no existing franchise. Camera: exactly the same viewing angle, perspective and scale as the attached soldier sheet (konkordat_soldat.png) – three-quarter view from front-right, slightly from above, light from top-left. Scale: one standing soldier of the attached sheet is the reference; the objects are drawn at the same scale. Each object stands on its own small, flat, irregular base of mud and rubble (only directly under the object, the base edge visible as a slightly flattened shape) – no ground beyond that base. Background: flat pure magenta (#FF00FF) everywhere, no gradient, no cast shadow, no smoke, no fire, no light beams, no people, no text, no frame. Nothing may touch the image border or the neighbouring object.
```

### A4. Bunker → `aufsteller_bunker.png`

```
Create a sheet of 2 variants of the same concrete bunker, side by side on a wide 1792×1024 image, each centred in its half with clear magenta space around it, at the same scale as the soldier on the attached sheet.

Object: a squat reinforced-concrete machine-gun bunker, about 1.4 soldiers high and 2.5 soldiers wide, rounded edges, a wide horizontal firing slit facing to the right, rusty steel door, sandbags piled against the base, earth heaped over the back half of the roof.
Left: intact but weathered, stained concrete. Right: damaged – shell craters chipped into the concrete, exposed bent rebar, a cracked corner.

Style: dark gothic trench-warfare comic illustration, exactly like the attached style reference (einzel_konzept.png): thick black ink outlines, hand-inked hatching, gritty painted textures, muted desaturated colours (grey-green-brown), rust, mud and soot, a world inspired by the First World War but our own fictional setting – no real places, no real insignia, no existing franchise. Camera: exactly the same viewing angle, perspective and scale as the attached soldier sheet (konkordat_soldat.png) – three-quarter view from front-right, slightly from above, light from top-left. Scale: one standing soldier of the attached sheet is the reference; the objects are drawn at the same scale. Each object stands on its own small, flat, irregular base of mud and rubble (only directly under the object, the base edge visible as a slightly flattened shape) – no ground beyond that base. Background: flat pure magenta (#FF00FF) everywhere, no gradient, no cast shadow, no smoke, no fire, no light beams, no people, no text, no frame. Nothing may touch the image border or the neighbouring object.
```

### A5. Totholz → `aufsteller_totholz.png`

```
Create a sheet of 4 different pieces of shell-shattered dead wood, arranged in a 2×2 grid on a square 1264×1264 image, each piece centred in its quarter with clear magenta space around it, all at the same scale as the soldier on the attached sheet.

Pieces (top left, top right, bottom left, bottom right):
1. a single tall splintered tree trunk without branches, jagged broken top, about 2.5 soldiers high
2. two charred trunks of different height leaning against each other, about 2 soldiers high
3. a low cluster of three jagged tree stumps with torn roots, about 0.8 soldiers high
4. a fallen trunk lying across a stump, broken branches pointing up, about 1 soldier high and 2.5 soldiers long

No leaves, no green, dead grey-brown wood with soot.

Style: dark gothic trench-warfare comic illustration, exactly like the attached style reference (einzel_konzept.png): thick black ink outlines, hand-inked hatching, gritty painted textures, muted desaturated colours (grey-green-brown), rust, mud and soot, a world inspired by the First World War but our own fictional setting – no real places, no real insignia, no existing franchise. Camera: exactly the same viewing angle, perspective and scale as the attached soldier sheet (konkordat_soldat.png) – three-quarter view from front-right, slightly from above, light from top-left. Scale: one standing soldier of the attached sheet is the reference; the objects are drawn at the same scale. Each object stands on its own small, flat, irregular base of mud and rubble (only directly under the object, the base edge visible as a slightly flattened shape) – no ground beyond that base. Background: flat pure magenta (#FF00FF) everywhere, no gradient, no cast shadow, no smoke, no fire, no light beams, no people, no text, no frame. Nothing may touch the image border or the neighbouring object.
```

### A6. Wald im Spielfeld → `aufsteller_wald.png`

```
Create a sheet of 4 different forest pieces for playable forest fields, arranged in a 2×2 grid on a square 1264×1264 image, each piece centred in its quarter with clear magenta space around it, all at the same scale as the soldier on the attached sheet.

Pieces (top left, top right, bottom left, bottom right):
1. a group of three tall bare trunks (the crowns are out of frame/cut off by shell fire, the trunks end in jagged tops at about 3 soldiers high) with dense dark undergrowth and ferns at their feet
2. a group of two trunks with a few sparse living branches and dark needles, about 3 soldiers high, brambles at the base
3. dense low undergrowth with thorn bushes and young saplings, about 1 soldier high, about 2.5 soldiers wide
4. one thick old trunk with moss and a broken low branch, roots spreading, about 2.5 soldiers high

Muted dark green and brown, no bright colours. Figures must still be visible behind these pieces, so keep them open and not wider than about 2.5 soldiers.

Style: dark gothic trench-warfare comic illustration, exactly like the attached style reference (einzel_konzept.png): thick black ink outlines, hand-inked hatching, gritty painted textures, muted desaturated colours (grey-green-brown), rust, mud and soot, a world inspired by the First World War but our own fictional setting – no real places, no real insignia, no existing franchise. Camera: exactly the same viewing angle, perspective and scale as the attached soldier sheet (konkordat_soldat.png) – three-quarter view from front-right, slightly from above, light from top-left. Scale: one standing soldier of the attached sheet is the reference; the objects are drawn at the same scale. Each object stands on its own small, flat, irregular base of mud and rubble (only directly under the object, the base edge visible as a slightly flattened shape) – no ground beyond that base. Background: flat pure magenta (#FF00FF) everywhere, no gradient, no cast shadow, no smoke, no fire, no light beams, no people, no text, no frame. Nothing may touch the image border or the neighbouring object.
```

### A7. Waldrand (nur Kartenrand) → `aufsteller_waldrand.png`

```
Create a sheet of 4 different tall trees for the edge of the battlefield, arranged in a 2×2 grid on a square 1264×1264 image, each tree centred in its quarter with clear magenta space around it, all at the same scale as the soldier on the attached sheet.

Trees (top left, top right, bottom left, bottom right):
1. a tall dark spruce, full crown, about 6 soldiers high
2. a large old oak with a wide dark crown, partly shell-damaged, about 5 soldiers high
3. a tall birch with a thin crown, some branches broken off, about 5 soldiers high
4. a group of two dark firs of different height, about 5 soldiers high

Muted dark green and brown, no bright colours.

Style: dark gothic trench-warfare comic illustration, exactly like the attached style reference (einzel_konzept.png): thick black ink outlines, hand-inked hatching, gritty painted textures, muted desaturated colours (grey-green-brown), rust, mud and soot, a world inspired by the First World War but our own fictional setting – no real places, no real insignia, no existing franchise. Camera: exactly the same viewing angle, perspective and scale as the attached soldier sheet (konkordat_soldat.png) – three-quarter view from front-right, slightly from above, light from top-left. Scale: one standing soldier of the attached sheet is the reference; the objects are drawn at the same scale. Each object stands on its own small, flat, irregular base of mud and rubble (only directly under the object, the base edge visible as a slightly flattened shape) – no ground beyond that base. Background: flat pure magenta (#FF00FF) everywhere, no gradient, no cast shadow, no smoke, no fire, no light beams, no people, no text, no frame. Nothing may touch the image border or the neighbouring object.
```

### A8. Drahtgestelle → `aufsteller_draht.png`

```
Create a sheet of 4 different barbed-wire obstacles, arranged in a 2×2 grid on a square 1264×1264 image, each obstacle centred in its quarter with clear magenta space around it, all at the same scale as the soldier on the attached sheet.

Obstacles (top left, top right, bottom left, bottom right):
1. a row of crooked wooden stakes with dense tangled barbed wire strung between them, about 0.9 soldiers high, about 2.5 soldiers long
2. rusty iron screw pickets with barbed wire in several tight rows, about 0.8 soldiers high, about 2.5 soldiers long
3. a "Spanish rider": a wooden beam with crossed stakes wrapped in barbed wire, about 0.8 soldiers high, about 2 soldiers long
4. a loose coil of concertina-style barbed wire lying on the ground with a few snapped stakes, about 0.6 soldiers high, about 2.5 soldiers long

The wire is drawn clearly with thick ink lines so it stays readable at small size.

Style: dark gothic trench-warfare comic illustration, exactly like the attached style reference (einzel_konzept.png): thick black ink outlines, hand-inked hatching, gritty painted textures, muted desaturated colours (grey-green-brown), rust, mud and soot, a world inspired by the First World War but our own fictional setting – no real places, no real insignia, no existing franchise. Camera: exactly the same viewing angle, perspective and scale as the attached soldier sheet (konkordat_soldat.png) – three-quarter view from front-right, slightly from above, light from top-left. Scale: one standing soldier of the attached sheet is the reference; the objects are drawn at the same scale. Each object stands on its own small, flat, irregular base of mud and rubble (only directly under the object, the base edge visible as a slightly flattened shape) – no ground beyond that base. Background: flat pure magenta (#FF00FF) everywhere, no gradient, no cast shadow, no smoke, no fire, no light beams, no people, no text, no frame. Nothing may touch the image border or the neighbouring object.
```

### A9. Barrikaden → `aufsteller_barrikade.png`

```
Create a sheet of 4 different street barricades, arranged in a 2×2 grid on a square 1264×1264 image, each centred in its quarter with clear magenta space around it, all at the same scale as the soldier on the attached sheet.

Barricades (top left, top right, bottom left, bottom right):
1. stacked timber beams and railway sleepers with barbed wire on top, about 1 soldier high, about 2.5 soldiers long
2. a curved wall of sandbags three layers high, about 0.9 soldiers high, about 2.5 soldiers long
3. an overturned wooden cart with broken wheels, crates and a mattress piled against it, about 1.1 soldiers high
4. a heap of rubble, a wardrobe, chairs and a bent iron bed frame, about 1 soldier high

Style: dark gothic trench-warfare comic illustration, exactly like the attached style reference (einzel_konzept.png): thick black ink outlines, hand-inked hatching, gritty painted textures, muted desaturated colours (grey-green-brown), rust, mud and soot, a world inspired by the First World War but our own fictional setting – no real places, no real insignia, no existing franchise. Camera: exactly the same viewing angle, perspective and scale as the attached soldier sheet (konkordat_soldat.png) – three-quarter view from front-right, slightly from above, light from top-left. Scale: one standing soldier of the attached sheet is the reference; the objects are drawn at the same scale. Each object stands on its own small, flat, irregular base of mud and rubble (only directly under the object, the base edge visible as a slightly flattened shape) – no ground beyond that base. Background: flat pure magenta (#FF00FF) everywhere, no gradient, no cast shadow, no smoke, no fire, no light beams, no people, no text, no frame. Nothing may touch the image border or the neighbouring object.
```

### A10. Grabenkanten → `aufsteller_graben.png`

```
Create a sheet of 4 different trench parapet pieces (the raised front edge of a trench), arranged in a 2×2 grid on a square 1264×1264 image, each centred in its quarter with clear magenta space around it, all at the same scale as the soldier on the attached sheet.

Pieces (top left, top right, bottom left, bottom right):
1. a straight sandbag parapet, two layers, about 0.5 soldiers high, about 2.5 soldiers long
2. a sandbag parapet with a small wooden loophole box and a steel sniper plate, about 0.6 soldiers high, about 2.5 soldiers long
3. a timber-revetted parapet: vertical planks and stakes holding back earth, about 0.5 soldiers high, about 2.5 soldiers long
4. a corner piece of sandbags bending by about 60 degrees, about 0.5 soldiers high

Low pieces only – soldiers in the trench must remain visible behind them.

Style: dark gothic trench-warfare comic illustration, exactly like the attached style reference (einzel_konzept.png): thick black ink outlines, hand-inked hatching, gritty painted textures, muted desaturated colours (grey-green-brown), rust, mud and soot, a world inspired by the First World War but our own fictional setting – no real places, no real insignia, no existing franchise. Camera: exactly the same viewing angle, perspective and scale as the attached soldier sheet (konkordat_soldat.png) – three-quarter view from front-right, slightly from above, light from top-left. Scale: one standing soldier of the attached sheet is the reference; the objects are drawn at the same scale. Each object stands on its own small, flat, irregular base of mud and rubble (only directly under the object, the base edge visible as a slightly flattened shape) – no ground beyond that base. Background: flat pure magenta (#FF00FF) everywhere, no gradient, no cast shadow, no smoke, no fire, no light beams, no people, no text, no frame. Nothing may touch the image border or the neighbouring object.
```

### A11. Bahn → `aufsteller_bahn.png`

```
Create a sheet of 4 different railway objects, arranged in a 2×2 grid on a square 1264×1264 image, each centred in its quarter with clear magenta space around it, all at the same scale as the soldier on the attached sheet.

Objects (top left, top right, bottom left, bottom right):
1. a tall iron railway signal mast with a semaphore arm, bent and leaning, about 3 soldiers high
2. an overturned wooden freight wagon lying on its side, planks splintered, wheels in the air, about 1.3 soldiers high, about 2.5 soldiers long
3. a wooden telegraph pole with two cross-arms and a few snapped wires hanging, about 3 soldiers high
4. an iron buffer stop at the end of a short piece of track, about 0.8 soldiers high

Style: dark gothic trench-warfare comic illustration, exactly like the attached style reference (einzel_konzept.png): thick black ink outlines, hand-inked hatching, gritty painted textures, muted desaturated colours (grey-green-brown), rust, mud and soot, a world inspired by the First World War but our own fictional setting – no real places, no real insignia, no existing franchise. Camera: exactly the same viewing angle, perspective and scale as the attached soldier sheet (konkordat_soldat.png) – three-quarter view from front-right, slightly from above, light from top-left. Scale: one standing soldier of the attached sheet is the reference; the objects are drawn at the same scale. Each object stands on its own small, flat, irregular base of mud and rubble (only directly under the object, the base edge visible as a slightly flattened shape) – no ground beyond that base. Background: flat pure magenta (#FF00FF) everywhere, no gradient, no cast shadow, no smoke, no fire, no light beams, no people, no text, no frame. Nothing may touch the image border or the neighbouring object.
```

### A12. Böschungskante für Höhenfelder → `aufsteller_boeschung.png`

Hinweis: Das ist kein Einzelobjekt, sondern ein **waagrecht kachelbarer Streifen** (linker und rechter Rand müssen nahtlos aneinanderpassen). Er wird an der vorderen Kante angehobener Höhenfelder gezeigt.

```
Create ONE horizontally tileable strip on a wide 1792×512 image: the front face of a low earth embankment (the edge of a raised hill field), seen exactly from the same angle as the attached soldier sheet. The strip runs across the full width of the image and its left and right ends must match seamlessly so it can be repeated side by side. Height of the embankment face about 0.5 soldiers (relative to the attached soldier): packed dark earth and mud, a few stones, exposed roots, tufts of dead grass hanging over the top edge, a darker shaded lower part. The top edge is the level of the raised field (no ground drawn above it), the bottom edge is where it meets the lower ground (no ground drawn below it).

Style: dark gothic trench-warfare comic illustration, exactly like the attached style reference (einzel_konzept.png): thick black ink outlines, hand-inked hatching, gritty painted textures, muted desaturated colours (grey-green-brown), mud and soot, a world inspired by the First World War but our own fictional setting. Light from top-left. Background above and below the strip: flat pure magenta (#FF00FF), no gradient, no shadow, no text, no frame.
```
