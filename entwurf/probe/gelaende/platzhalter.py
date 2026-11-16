# Platzhalter für die Gelände-Probe: schneidet aus vorhandenen Spielbildern (paint.js) grobe Bausteine.
# Nur für entwurf/probe/gelaende.html, bis die gemalten Bausteine (GEMINI_PROMPTS.md, Teil „Gelände-Bausteine“) da sind.
# Aufruf im Ordner entwurf/probe/gelaende: python platzhalter.py
from PIL import Image
import numpy as np

# Name: (Quelle, Ausschnitt x0, y0, x1, y1, Rand unten ausblenden 0..1, Rand seitlich 0..1)
CUT = {
    'p_ruine_hinten': ('spr_house2', (38, 12, 138, 150), 0.15, 0.08),
    'p_ruine_vorn':   ('spr_barric', (30, 150, 235, 222), 0.25, 0.08),
    'p_sandsack':     ('spr_treeK', (35, 150, 225, 200), 0.15, 0.04),
    'p_staemme':      ('spr_treeX', (20, 18, 240, 140), 0.22, 0.05),
    'p_unterholz':    ('spr_treeD', (20, 185, 240, 250), 0.3, 0.1),
    'p_krone':        ('spr_treeD', (0, 0, 260, 260), 0.2, 0.05),
    'p_draht':        ('spr_wireS', (30, 12, 240, 100), 0.12, 0.06),
    'p_stumpf':       ('spr_treeX', (30, 30, 112, 138), 0.25, 0.1),
    'p_bunker':       ('spr_bunker1', (0, 0, 260, 275), 0.2, 0.04),
    'p_barrikade':    ('spr_barric', (30, 60, 235, 200), 0.25, 0.06),
}
for name, (src, box, fb, fs) in CUT.items():
    im = np.asarray(Image.open(src + '.webp').convert('RGBA').crop(box)).astype(np.float32)
    h, w = im.shape[:2]
    a = im[..., 3] / 255
    y = np.linspace(0, 1, h)[:, None]; x = np.linspace(0, 1, w)[None, :]
    if fb: a = a * np.clip((1 - y) / fb, 0, 1)
    if fs: a = a * np.clip(x / fs, 0, 1) * np.clip((1 - x) / fs, 0, 1)
    im[..., 3] = a * 255
    Image.fromarray(im.astype(np.uint8)).save(name + '.png')
    print(name, w, h)
# Trichter flach: Schrägbild entzerren (Höhe ÷ 0,62), damit er nach der Projektion rund wirkt
c = Image.open('spr_craterS.webp').convert('RGBA'); c = c.resize((c.width, round(c.height / 0.62)))
c.save('p_trichter.png'); print('p_trichter', c.size)
