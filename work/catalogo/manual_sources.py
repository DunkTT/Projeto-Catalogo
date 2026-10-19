import json,urllib.request,urllib.parse,concurrent.futures
from pathlib import Path
from lxml import html
r=Path('work/catalogo/similar')
targets=[
('esguincho','https://www.tramontina.com.br/esguicho-em-plastico-tramontina-com-engate-rosqueado-e-jato-regulavel-para-mangueira-1%2F2%22/78514000.html'),
('stretch','https://plaswill.com.br/filme-stretch-rolinho/'),
('saco','https://www.agrojuta.com.br/produto/ze-entulho/')]
out=[]
for fam,u in targets:
 try:
  b=urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0'}),timeout=30).read()
  d=html.fromstring(b);(r/(fam+'.html')).write_bytes(b)
  ims=d.xpath('//meta[@property="og:image"]/@content')
  if not ims:ims=d.xpath('//img[contains(@src,"'+('78514000' if fam=='esguincho' else fam)+'")]/@src')
  print(fam,ims[:5])
  for im in ims[:1]:out.append({'title':{'esguincho':'Esguicho com engate rosqueado Tramontina','stretch':'Filme Stretch Rolinho','saco':'Saco de ráfia para entulho'}[fam],'family':fam,'source':u,'url':urllib.parse.urljoin(u,im),'brand':{'esguincho':'Tramontina','stretch':'Plaswill','saco':'Agro Juta'}[fam]})
 except Exception as e:print(fam,str(e))
(r/'manual_sources.json').write_text(json.dumps(out,ensure_ascii=False),encoding='utf8')

