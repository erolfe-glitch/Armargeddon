# Baut aus src/ die spielbare Einzeldatei index.html (ohne Internet lauffähig).
import pathlib
root = pathlib.Path(__file__).resolve().parent.parent
src = root / 'src'
html = (src / 'index.html').read_text(encoding='utf8')
parts = []
for name in ['engine.js', 'figures.js', 'ai.js', 'ui.js']:
    code = (src / name).read_text(encoding='utf8')
    assert '</script' not in code, name
    parts.append(f'<script>\n{code}\n</script>')
out = html.replace('<!--SCRIPTS-->', '\n'.join(parts))
(root / 'index.html').write_text(out, encoding='utf8')
print('index.html', len(out) // 1024, 'KB')
