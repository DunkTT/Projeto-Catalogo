import json,urllib.request,urllib.parse,hashlib,io
from pathlib import Path
from lxml import html
from PIL import Image
r=Path('work/catalogo/similar')
u='https://othondecarvalho.com.br/products/tela-fibra-vidro-tfv-100-5'
try:
 b=urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0'}),timeout=30).read()
 d=html.fromstring(b);im=d.xpath('//meta[@property="og:image"]/@content')[0];im=urllib.parse.urljoin(u,im).replace('http://','https://')
 f=r/'images'/(hashlib.sha256(im.encode()).hexdigest()[:16]+'.jpg')
 z=Image.open(io.BytesIO(urllib.request.urlopen(im,timeout=30).read())).convert('RGB');z.thumbnail((700,700));z.save(f)
 c={'title':'Tela de fibra de vidro para Eletrofita','source':u,'url':im,'brand':'Othon de Carvalho','file':str(f)}
 (r/'tela_image.json').write_text(json.dumps(c,ensure_ascii=False),encoding='utf8')
 print('tela ok',str(f))
except Exception as e:print(e)

