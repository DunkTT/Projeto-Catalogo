from pathlib import Path
from lxml import etree
import zipfile,json
r=Path('work/catalogo')
meta=json.loads((r/'similar/build.json').read_text())
with zipfile.ZipFile(meta['output']) as z:x=etree.fromstring(z.read('word/document.xml'))
ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
t='\n'.join(x.xpath('//w:t/text()',namespaces=ns))
products=json.loads((r/'products.json').read_text())
assert all(p['nome'] in t and (not p['sku'] or p['sku'] in t) for p in products)
assert len(x.xpath('//w:bookmarkStart',namespaces=ns))==1693
assert len(x.xpath('//w:drawing',namespaces=ns))==1692
assert 'Foto ilustrativa' in t
print('1693 registros preservados, 1692 imagens incorporadas, etiquetas ilustrativas presentes.')

