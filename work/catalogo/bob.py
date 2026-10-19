import json,urllib.request,urllib.parse,io
from pathlib import Path
from lxml import html
from PIL import Image
r=Path('work/catalogo/similar')
u='https://www.cena1acessorios.com.br/adaptador-tomada-bob-esponja-branco'
b=urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0'}),timeout=30).read();d=html.fromstring(b)
ims=d.xpath('//meta[@property="og:image"]/@content')
print(ims)
if ims:
 imurl=urllib.parse.urljoin(u,ims[0]);z=Image.open(io.BytesIO(urllib.request.urlopen(imurl,timeout=30).read())).convert('RGB');z.thumbnail((700,700));f=r/'images/bob-esponja.jpg';z.save(f,quality=85)
 a=json.loads((r/'final_images.json').read_text());a=[x for x in a if x['id']!='16531975266'];a.append({'id':'16531975266','file':str(f),'approx':True,'title':'Adaptador tomada Bob Esponja branco 10A 20A','source':u,'brand':'Cena 1 Acessórios'})
 (r/'final_images.json').write_text(json.dumps(a,ensure_ascii=False),encoding='utf8')
 print('foto incluida',len(a))

