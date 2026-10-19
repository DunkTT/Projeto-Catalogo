import urllib.request,json
from lxml import html
u='https://www.guemat.com.br/joelho-90-soldavel-25mm-tigre'
d=html.fromstring(urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0'}),timeout=30).read())
print(d.xpath('//meta[@property="og:image"]/@content'))
import pathlib
a=json.load(open('work/catalogo/similar/pool.json'))
print([(i,x['title']) for i,x in enumerate(a) if i>2300 and any(z in x['title'].upper() for z in ['LINEAR','HERM','BARRA LED'])][:60])

