import json,urllib.request,urllib.parse,concurrent.futures,time
from pathlib import Path
from lxml import html
r=Path('work/catalogo');(r/'similar').mkdir(exist_ok=True)
queries=['cabo flexivel preto','cabo flexivel azul','cabo flexivel branco','cabo flexivel vermelho','cabo flexivel verde','cabo flexivel amarelo','cabo pp','cabo paralelo','cabo aco','conjunto tomada','conjunto interruptor','modulo tomada','modulo interruptor','modulo cego','modulo campainha','modulo rj45','modulo rj11','modulo dimmer','modulo antena','modulo usb','placa 4x2','placa 4x4','caixa sobrepor','caixa luz','caixa condulete','arruela','porca','parafuso','bucha nylon','barra roscada','gancho','abracadeira','conector split bolt','terminal ilhos','terminal forquilha','terminal femea','conector torcao','conector wago','conector bnc','conector p4','conector rj45','conector porcelana','conector mangueira led','conector perfil','disjuntor monopolar','disjuntor bipolar','barramento','fita isolante','fita crepe','fita dupla face','fita termoretratil','cola','silicone','espuma expansiva','adesivo pu','durepoxi','passa fio','eletrofita','tomada barra','tomada multipla','pino macho','pino femea','adaptador tomada','suporte modular','tampa cega','pilha','caneta','lapis','martelo','ferro solda','pasta solda','disco inox','trena','teste digital','lanterna','camera','dvr','filtro linha','lubrificante','saco entulho','filme stretch','cabo usb','cabo cobrecom','cabo pendente','rabicho','cabo flexivel rosa','cabo flexivel laranja','cotovelo canaleta','canaleta','presilha','interruptor wifi','sensor touch','cordao led','fita led','mangueira led','luz emergencia','ventilador','soquete']
def run(q):
 f=r/'similar'/('search_'+q.replace(' ','_')+'.json')
 if f.exists():return json.loads(f.read_text(encoding='utf8'))
 try:
  u='https://www.lojaeletrica.com.br/catalogsearch/result/?'+urllib.parse.urlencode({'q':q})
  b=urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0'}),timeout=40).read()
  d=html.fromstring(b);out=[]
  for li in d.xpath('//li[contains(@class,"product-item")]'):
   links=li.xpath('.//a[contains(@class,"product-item-link")]');imgs=li.xpath('.//img')
   if links and imgs:
    a=links[0];im=imgs[0];src=im.get('src') or im.get('data-src')
    if src and '/media/catalog/' in src:
     out.append({'title':a.text_content().strip(),'url':src.split('?')[0],'source':a.get('href'),'brand':'Loja Elétrica','query':q})
  f.write_text(json.dumps(out,ensure_ascii=False),encoding='utf8')
  print(q,len(out),flush=True);time.sleep(.3);return out
 except Exception as e:print(q,str(e),flush=True);return []
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as ex:
 allrows=[v for result in ex.map(run,queries) for v in result]
unique={x['source']:x for x in allrows}
(r/'similar'/'extra_sources.json').write_text(json.dumps(list(unique.values()),ensure_ascii=False),encoding='utf8')
print('TOTAL',len(unique))

