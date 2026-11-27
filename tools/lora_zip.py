"""W2a (Punkt 147): Lernbilder des Gelände-LoRA (entwurf/lora_gelaende/K*.png) mit kurzen Beschreibungen (Schlüsselwort armgelaende) als ZIP für fal.
Aufruf: python tools/lora_zip.py  → entwurf/probe/stil/lora_gelaende.zip (nicht in git)"""
import zipfile, pathlib
R = pathlib.Path(__file__).resolve().parent.parent; Q = R / 'entwurf' / 'lora_gelaende'; Z = R / 'entwurf' / 'probe' / 'stil' / 'lora_gelaende.zip'
T = {'K01': 'damaged stone windmill on muddy ground', 'K02': 'collapsed ruined windmill with rubble on mud', 'K03': 'damaged stone windmill on snowy ground', 'K04': 'collapsed ruined windmill with timber rubble in snow',
     'K05': 'wrecked rusty armoured tank on mud', 'K08': 'wrecked armoured tank in snow', 'K09': 'ruined brick house without roof', 'K11': 'ruined brick cottage with chimney',
     'K13': 'small stone chapel with bell tower and fence in snow', 'K15': 'half collapsed timber framed house in snow', 'K17': 'timber framed farmhouse with snowy roof', 'K19': 'timber framed house with shed and firewood in snow',
     'K21': 'stone village well with wooden roof and bucket in snow', 'K23': 'stacked pile of logs in snow', 'K24': 'empty wooden hand cart in snow', 'K26': 'pile of felled logs and branches in snow',
     'K29': 'single snowy fir tree', 'K32': 'shattered dead tree stump in snow', 'K33': 'wooden czech hedgehog tank traps on mud', 'K36': 'blown up wooden tank traps and splinters on mud',
     'K37': 'row of wooden tank traps on mud', 'K40': 'row of sharpened wooden stakes on mud', 'K56': 'broken wooden cart with loose wheel on mud', 'K58': 'pile of brick rubble and a broken chimney', 'K64': 'barbed wire fence with wooden posts and wire coils on mud'}
with zipfile.ZipFile(Z, 'w', zipfile.ZIP_DEFLATED) as z:
    for k, t in T.items():
        z.write(Q / f'{k}.png', f'{k}.png')
        z.writestr(f'{k}.txt', f'armgelaende, {t}, hand-drawn grimdark ink illustration, isometric game terrain piece, flat magenta background')
print(Z, Z.stat().st_size // 1024, 'KB,', len(T), 'Bilder')
