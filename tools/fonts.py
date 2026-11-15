# Erzeugt src/fonts.css: eingebettete Schriften (OFL, Quelle ui-quelle/schriften/), auf Latein/Deutsch gekürzt, als woff2.
#  "Arm Kopf"  = IM Fell English SC für Überschriften, Knöpfe, Namen. Ziffern und Rechenzeichen kommen über
#               unicode-range aus Alegreya Sans Medium, damit alle Zahlen klar lesbar sind (auch "Runde 1").
#  "Arm Text"  = Alegreya Sans Regular/Bold für Werte und Fließtext.
# Aufruf: python tools/fonts.py   (danach tools/build.py)
import base64, io, pathlib
from fontTools import subset
from fontTools.ttLib import TTFont

root = pathlib.Path(__file__).resolve().parent.parent
srcdir = root / 'ui-quelle' / 'schriften'
TEXT = 'U+0020-007E,U+00A0-00FF,U+0152-0153,U+2010-2027,U+2030,U+2039-203A,U+20AC,U+2122,U+2190-2199,U+2212'
DIGITS = 'U+0025,U+002B,U+0030-0039,U+00D7,U+2212'

def woff2(name, ranges):
    font = TTFont(srcdir / name)
    if name.startswith('Alegreya'):   # Alegreya hat Mediävalziffern als Standard: fest auf Versalziffern mit fester Breite (.tf) umstellen
        names = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
        for t in font['cmap'].tables:
            for i, n in enumerate(names):
                if 0x30 + i in t.cmap: t.cmap[0x30 + i] = n + '.tf'
    opt = subset.Options(); opt.layout_features = ['*']; opt.flavor = 'woff2'; opt.name_IDs = []
    sub = subset.Subsetter(opt); sub.populate(unicodes=subset.parse_unicodes(ranges)); sub.subset(font)
    buf = io.BytesIO(); font.flavor = 'woff2'; font.save(buf)
    return base64.b64encode(buf.getvalue()).decode()

def face(fam, name, weight, ranges, urange=None):
    ur = f' unicode-range: {urange};' if urange else ''
    return f'@font-face {{ font-family: "{fam}"; src: url(data:font/woff2;base64,{woff2(name, ranges)}) format("woff2"); font-weight: {weight}; font-display: block;{ur} }}'

css = [
    '/* Erzeugt von tools/fonts.py – nicht von Hand ändern, nicht komplett lesen. Lizenzen: ui-quelle/schriften/OFL-*.txt */',
    face('Arm Kopf', 'IMFeENsc28P.ttf', 400, TEXT),
    face('Arm Kopf', 'AlegreyaSans-Medium.ttf', 400, DIGITS, DIGITS),   # später deklariert = gewinnt bei Ziffern
    face('Arm Text', 'AlegreyaSans-Regular.ttf', 400, TEXT),
    face('Arm Text', 'AlegreyaSans-Bold.ttf', 700, TEXT),
]
out = root / 'src' / 'fonts.css'
out.write_text('\n'.join(css) + '\n', encoding='utf8')
print(out.name, out.stat().st_size // 1024, 'KB')
