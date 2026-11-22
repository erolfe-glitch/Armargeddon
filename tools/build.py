# Baut aus src/ die spielbare Datei index.html (ohne Internet lauffähig). Die Töne liegen seit 2026-11-22 in src/sound.js daneben und werden nachgeladen.
import pathlib
root = pathlib.Path(__file__).resolve().parent.parent
src = root / 'src'
html = (src / 'index.html').read_text(encoding='utf8')
parts = []
for name in ['engine.js', 'rollen.js', 'figures.js', 'art.js', 'fx.js', 'uiart.js', 'uipanel.js', 'zeiger.js', 'figs.js', 'figsplastik.js', 'fxneu.js', 'gelaende.js', 'gelaende_bau.js', 'titlebg.js', 'ai.js', 'ui.js']:   # Töne (sound.js) nicht mehr eingebettet: ui.js lädt src/sound.js daneben nach (Enrico 2026-11-22 17:30)
    code = (src / name).read_text(encoding='utf8')
    assert '</script' not in code, name
    parts.append(f'<script>\n{code}\n</script>')
fonts = (src / 'fonts.css').read_text(encoding='utf8')   # eingebettete Schriften, erzeugt von tools/fonts.py
assert '</style' not in fonts
out = html.replace('<!--FONTS-->', f'<style>\n{fonts}</style>').replace('<!--SCRIPTS-->', '\n'.join(parts))
with open(root / 'index.html', 'w', encoding='utf8', newline='\n') as f:   # LF auch unter Windows
    f.write(out)
print('index.html', len(out) // 1024, 'KB')
