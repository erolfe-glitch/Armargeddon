"""Baut entwurf/einheiten-panel.html aus entwurf/einheiten-panel.src.html.

Platzhalter  @@bogen/teil:breite@@  wird durch das Teil aus ui-quelle/teile als WebP-Daten-URL ersetzt
(auf die angegebene Breite verkleinert), damit der Entwurf als einzelne Datei funktioniert.
Platzhalter  @@art:schluessel@@  holt ein Einheitenbild aus src/art.js (nur per Suche, Datei wird nicht ganz geladen).
"""
import base64, io, re
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'entwurf' / 'einheiten-panel.src.html'
DST = ROOT / 'entwurf' / 'einheiten-panel.html'
TEILE = ROOT / 'ui-quelle' / 'teile'


def teil(key, w):
    im = Image.open(TEILE / f'{key}.png')
    if im.width > w:
        im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, 'WEBP', quality=88, method=6)
    return 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode()


def art(key):
    pat = re.compile(r'"' + re.escape(key) + r'": \{"src": "(data:image/webp;base64,[^"]+)"')
    with open(ROOT / 'src' / 'art.js', encoding='utf-8') as f:
        for line in f:
            m = pat.search(line)
            if m:
                return m.group(1)
    raise KeyError(key)


def main():
    html = SRC.read_text(encoding='utf-8')
    html = re.sub(r'@@art:([\w]+)@@', lambda m: art(m.group(1)), html)
    html = re.sub(r'@@([\w/]+):(\d+)@@', lambda m: teil(m.group(1), int(m.group(2))), html)
    DST.write_text(html, encoding='utf-8')
    print(DST, round(len(html) / 1024), 'KB')


if __name__ == '__main__':
    main()
