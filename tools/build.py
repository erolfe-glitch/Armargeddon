# Baut aus src/ die spielbare Einzeldatei index.html (ohne Internet lauffähig).
import pathlib
root = pathlib.Path(__file__).resolve().parent.parent
src = root / 'src'
html = (src / 'index.html').read_text(encoding='utf8')
parts = []
for name in ['engine.js', 'figures.js', 'art.js', 'fx.js', 'paint.js', 'mapimg.js', 'uiart.js', 'uipanel.js', 'titlebg.js', 'sound.js', 'ai.js', 'ui.js']:
    code = (src / name).read_text(encoding='utf8')
    assert '</script' not in code, name
    parts.append(f'<script>\n{code}\n</script>')
fonts = (src / 'fonts.css').read_text(encoding='utf8')   # eingebettete Schriften, erzeugt von tools/fonts.py
assert '</style' not in fonts
out = html.replace('<!--FONTS-->', f'<style>\n{fonts}</style>').replace('<!--SCRIPTS-->', '\n'.join(parts))
with open(root / 'index.html', 'w', encoding='utf8', newline='\n') as f:   # LF auch unter Windows
    f.write(out)
print('index.html', len(out) // 1024, 'KB')
