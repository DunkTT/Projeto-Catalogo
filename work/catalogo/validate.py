from pathlib import Path
import json,zipfile
from lxml import etree
r=Path('work/catalogo')
m=json.loads((r/'catalog_build.json').read_text(encoding='utf8'))
p=json.loads((r/'products.json').read_text(encoding='utf8'))
with zipfile.ZipFile(m['output']) as z:
 x=etree.fromstring(z.read('word/document.xml'))
ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
text='\n'.join(x.xpath('//w:t/text()',namespaces=ns))
assert all(v['nome'] in text and (not v['sku'] or v['sku'] in text) for v in p)
assert len(x.xpath('//w:bookmarkStart',namespaces=ns))==1693
assert len(x.xpath('//w:drawing',namespaces=ns))==61
print('Verificado: 1693 nomes e SKUs preservados; 61 imagens; arquivo Word valido.')

