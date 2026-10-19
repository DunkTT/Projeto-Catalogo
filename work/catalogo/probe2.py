import urllib.request,json
from pathlib import Path
from lxml import html
r=Path('work/catalogo')
u='https://www.lojaeletrica.com.br/catalogsearch/result/?q=cabo'
try:
 b=urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0'}),timeout=30).read();(r/'loja_search.html').write_bytes(b)
 d=html.fromstring(b)
 print('LOJA',len(b));print([(x.get('alt'),x.get('src'),x.get('data-src')) for x in d.xpath('//img')][:15])
 print('items',[(x.text_content().strip()[:100],x.get('href')) for x in d.xpath('//a[contains(@class,"product-item-link")]')][:5])
except Exception as e:print(e)
d=html.fromstring((r/'tramontina_probe.txt').read_bytes())
print('TRAM imgs',[(x.get('alt','')[:90],x.get('src','')[:200]) for x in d.xpath('//img') if len(x.get('alt',''))>20][:12])
print('jsonld',[(x.text or '')[:600] for x in d.xpath('//script[@type="application/ld+json"]')][:3])

