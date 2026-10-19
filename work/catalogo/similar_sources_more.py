import json,urllib.request,urllib.parse,concurrent.futures,time
from pathlib import Path
from lxml import html
r=Path('work/catalogo');(r/'similar').mkdir(exist_ok=True)
queries=['chumbador','barra roscada','conector fita','conector mangueira','emenda fita','tampa perfil','presilha perfil','difusor perfil','termorretratil','massa epoxi','engate rapido','esguincho','estanho','saco entulho','filme stretch','barramento pente','bucha drywall','interruptor redondo','soquete t8','soquete rabicho','fotocelula','sensor porta','abajur bambu','tela fibra vidro','modulo led','lampada ventilador','refletor recarregavel','trilho din','adaptador benjamin','gancho bucha','parafuso madeira','bucha expansao','caneta marcador','tampa condulete','fita autofusao','luminaria high bay','luminaria ufo','conector torcao','fixa fio','luminaria tartaruga','cola instantanea','cordao paralelo','conector trilho l','conector trilho t','conector trilho cruz','plug femea']
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

