import json,re,unicodedata
from pathlib import Path
r=Path('work/catalogo/similar')
a=json.loads((r/'candidates.json').read_text(encoding='utf8'))
for f in r.glob('search_*.json'):a+=json.loads(f.read_text(encoding='utf8'))
a=list({x['source']+'|'+x.get('url',''):x for x in a}.values())
(r/'pool.json').write_text(json.dumps(a),encoding='utf8')
patterns=['cabo flex.*preto','embut.*(redond|duplo|triplo|quadr).*','(soquete|receptaculo).*(e14|e27|t8)','(interruptor.*(cord|retang|gangorra))','cotovelo|joelho','conector.*(p4|linear|wago)','caixa.*(sobrepor|condulete)','(lampada|luminaria).*(linear|t5)','(spot).*redondo','varal','perfil.*(25x|presilha)','trilho.*(cruz|cantoneira|conector)','modulo.*tomada']
for pattern in patterns:
 print('\nGROUP',pattern)
 hits=[(i,x['title']) for i,x in enumerate(a) if re.search(pattern,unicodedata.normalize('NFD',x['title']).encode('ascii','ignore').decode().lower())]
 print(*hits[:22],sep='\n')

