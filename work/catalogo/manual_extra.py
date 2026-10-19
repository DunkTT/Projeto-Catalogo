import json,urllib.request,urllib.parse
from pathlib import Path
from lxml import html
r=Path('work/catalogo/similar')
targets=[
('abajur','https://tgplugs.com.br/products/abajur-de-mesa-artesanal-em-bambu-tg'),
('adaptador','https://broketto.com.br/adaptador-de-tomada-triplo-benjamin-10a-20a'),
('modulo_led','https://paraisodoseletronicos.com.br/produto/modulo-led-barra-com-10-pcs-de-leds-rgb-colorido-iluminacao-para-decoracao-12v-tb1561/'),
('lampada_ventilador','https://www.eletricaraio.com.br/produtos/ventilador-de-bocal-30w-e27-bivolt-lampada-ventilador-galaxy-3000-4000-6000k-twmn1/')]
out=json.loads((r/'manual_sources.json').read_text())
for fam,u in targets:
 try:
  b=urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0'}),timeout=30).read();d=html.fromstring(b)
  (r/(fam+'_manual.html')).write_bytes(b)
  ims=d.xpath('//meta[@property="og:image"]/@content')
  title=d.xpath('//meta[@property="og:title"]/@content') or d.xpath('//title/text()')
  if ims:out.append({'title':title[0],'family':fam,'source':u,'url':urllib.parse.urljoin(u,ims[0]),'brand':urllib.parse.urlparse(u).netloc})
  print(fam,ims[:1])
 except Exception as e:print(fam,str(e))
out.extend([
{'family':'stretch','title':'Filme Stretch Rolinho','source':'https://plaswill.com.br/filme-stretch-rolinho/','url':'https://plaswill.com.br/wp-content/uploads/filme-stretch-rolinho.png','brand':'Plaswill'},
{'family':'saco','title':'Saco de ráfia para entulho','source':'https://www.agrojuta.com.br/produto/ze-entulho/','url':'https://www.agrojuta.com.br/wp-content/uploads/2020/03/Foto-4.jpg','brand':'Agro Juta'}])
(r/'manual_sources.json').write_text(json.dumps(out,ensure_ascii=False),encoding='utf8')

