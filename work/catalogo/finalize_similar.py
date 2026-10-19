import json,re,unicodedata,urllib.request,urllib.parse,hashlib,io,concurrent.futures
from pathlib import Path
from lxml import html
from PIL import Image,ImageOps
r=Path('work/catalogo');s=r/'similar'
def norm(t):
 t=unicodedata.normalize('NFKD',t).encode('ascii','ignore').decode().upper()
 return t.replace('BRANCA','BRANCO').replace('PRETA','PRETO')
def get(u):return urllib.request.urlopen(urllib.request.Request(u.replace('http://','https://'),headers={'User-Agent':'Mozilla/5.0'}),timeout=30).read()
manual=json.loads((s/'manual_sources.json').read_text())
for fam,u in [('lapis','https://www.lojachimas.com.br/lapis-para-carpinteiro'),('termoretratil','https://www.dexyiloja.com.br/8449-tubo-termo-retratil-preto-com-diametro-10-mm/p/56983')]:
 try:
  d=html.fromstring(get(u));ims=d.xpath('//meta[@property="og:image"]/@content');title=d.xpath('//title/text()')
  if ims:manual.append({'family':fam,'title':title[0],'url':urllib.parse.urljoin(u,ims[0]),'source':u,'brand':urllib.parse.urlparse(u).netloc})
 except Exception as e:print(fam,e)
manual.append({'family':'modulo_led','title':'Módulo de 3 LED RGB','url':'https://paraisodoseletronicos.com.br/wp-content/uploads/2022/09/modulo-led-barra-com-10-pcs-de-leds-rgb-1-3.png','source':'https://paraisodoseletronicos.com.br/produto/modulo-led-barra-com-10-pcs-de-leds-rgb-colorido-iluminacao-para-decoracao-12v-tb1561/','brand':'Paraíso dos Eletrônicos'})
(s/'manual_sources.json').write_text(json.dumps(manual,ensure_ascii=False),encoding='utf8')
rows=json.loads((s/'candidates.json').read_text())
raw=[x for f in s.glob('search_*.json') for x in json.loads(f.read_text())]
pool=list({x['url']:x for x in rows+raw+manual if x.get('url')}.values())
def query(q,pattern=None):
 a=json.loads((s/('search_'+q+'.json')).read_text())
 return [x for x in a if not pattern or re.search(pattern,norm(x['title']))]
def choose(p,opts):
 if not opts:return None
 a=norm(p['nome']);at=set(re.findall(r'[A-Z]+|\d+(?:[.,]\d+)?',a))
 def sc(c):
  b=norm(c['title']);bt=set(re.findall(r'[A-Z]+|\d+(?:[.,]\d+)?',b))
  score=len(at&bt)
  for w in ['BRANCO','PRETO','AZUL','VERMELHO','CINZA','AMARELO','VERDE','FEMEA','MACHO','QUADRADO','REDONDO','SOBREPOR','EMBUTIR','DUPLO','TRIPLO','COB','RGB','TUBULAR','BIPOLAR','MONOPOLAR']:
   if w in a and w in b:score+=10
   elif w in a:score-=5
  return score
 return max(opts,key=sc)
def contains(pat):return [c for c in pool if re.search(pat,norm(c['title']))]
matches={x['id']:x for x in json.loads((s/'matches.json').read_text())}
missing=json.loads((s/'missing.json').read_text())
for p in list(matches.values())+missing:
 a=norm(p['nome']);fam=p['family'];opts=None
 special=[c for c in manual if c.get('family')==fam]
 if special and (fam!='adaptador' or 'BEJAMIN' in a):opts=special
 if fam=='adaptador' and 'FEMEA' in a:opts=query('plug_femea',r'^PLUG FEMEA')
 if fam=='barra':opts=query('barra_roscada',r'VERGALHAO')
 if fam=='durepoxi':opts=query('massa_epoxi')
 if fam=='tubo':opts=query('estanho',r'^(SOLDA|ESTANHO)')
 if fam=='lapis' and not special:opts=[]
 if fam=='abajur':opts=[c for c in manual if c['family']=='abajur']
 if fam=='cabo_aco':opts=query('cabo_aco',r'^CABO ACO GALVANIZADO')
 if fam=='gancho':opts=query('gancho_bucha')
 if 'SPLIT BOLT' in a:opts=query('conector_split_bolt',r'FENDIDO')
 if fam=='barramento' and ('BIFASICO' in a or 'MONOPOLAR' in a):
  opts=query('barramento_pente',r'BIFASICO' if 'BIFASICO' in a else r'MONOFASICO')
 if fam=='terminal' and ('ILHOS' in a):opts=query('terminal_ilhos')
 if fam=='fita_isolante' and 'AUTOFUSAO' in a:opts=query('fita_autofusao',r'^FITA')
 if fam=='tomada':opts=query('tomada_multipla',r'(MODULO TOMADA MULTIPLA|^EXTENSAO)')
 if fam=='pino' and '3 SAIDA' in a:opts=[c for c in manual if c['family']=='adaptador']
 if fam=='trilho' and ('DISJUNTOR' in a or ' DIM ' in a):opts=query('trilho_din',r'^TRILHO DIN')
 if fam=='interruptor' and ('REDONDO' in a or 'COM FIO' in a):opts=query('interruptor_redondo',r'^CHAVE 16123')
 if fam=='sensor' and 'FOTOCELULA' in a:opts=query('fotocelula',r'^RELE FOTOELETRICO')
 if fam=='perfil':opts=[c for c in rows if c['family']=='perfil' and any(w in norm(c['title']) for w in ['EMBUTIR','SOBREPOR','PERFIL ALUMINIO'])]
 if fam=='boxit':
  # allow current official variants of the same form
  opts=contains(r'BOXIT|SPOT SOBREPOR.*(PAR20|PAR30|MR16)')
  if 'BRANCO' in a:
   white=[c for c in opts if 'BRANCO' in norm(c['title'])]
   if white:opts=white
 if fam=='pu':opts=query('adesivo_pu',r'PU40|PU 40')
 if fam=='canaleta' and 'COTOVELO' in a:opts=query('cotovelo_canaleta',r'COTOVELO')
 if fam=='modulo' and 'WIFI' in a:opts=query('interruptor_wifi',r'MODULO|INTERRUPTOR')
 if fam=='conjunto' and 'CAMPAINHA' in a:opts=contains(r'(MODULO|CONJUNTO).*(CAMPAINHA|PULSADOR)')
 if fam=='conjunto' and 'SAIDA DE FIO' in a:opts=query('cabo_pendente',r'MODULO SAIDA')
 if fam=='eletrofita' and 'TELA' in a:opts=[] # not equivalent to a conductive strip
 if fam=='presilha' and 'FIXA' in a:opts=query('fixa_fio',r'FIXA|FIXADOR')
 if fam=='lampada_ventilador' and not special:opts=[c for c in rows if c['family']=='ventilador']
 if fam=='lampada' and 'TUBULAR' in a:
  opts=[c for c in rows if c['family']=='lampada' and re.search(r'TUBULAR|T8|T5',norm(c['title']))]
 if fam=='luminaria_linear':
  opts=[c for c in rows if re.search(r'(LINEAR|HERMETICA|REGUA|CALHA|T5)',norm(c['title'])) and c.get('family') in ['luminaria_linear','lampada','luminaria']]
 if fam=='caneta':opts=query('caneta_marcador')
 if fam=='luminaria' and 'MESA' in a:
  opts=[c for c in rows if 'MESA' in norm(c['title'])]
 if opts is not None:
  c=choose(p,opts)
  if c:matches[p['id']]=p|{'candidate':c,'reviewed':True}
  else:matches.pop(p['id'],None)
# Missing image is preferable to a different object when the name cannot be interpreted.
(s/'final_matches.json').write_text(json.dumps(list(matches.values()),ensure_ascii=False),encoding='utf8')
assets={x['candidate'].get('url'):x['candidate'] for x in matches.values() if not x['candidate'].get('file')}
(s/'images').mkdir(exist_ok=True)
def download(c):
 try:
  u=c['url'];f=s/'images'/(hashlib.sha256(u.encode()).hexdigest()[:16]+'.jpg')
  if not f.exists():
   im=Image.open(io.BytesIO(get(u)));im=ImageOps.exif_transpose(im)
   if im.mode in ['RGBA','P']:
    im=im.convert('RGBA');bg=Image.new('RGBA',im.size,'white');bg.alpha_composite(im);im=bg
   im=im.convert('RGB');im.thumbnail((700,700));im.save(f,quality=85)
  return c|{'file':str(f)}
 except Exception as e:return c|{'error':str(e)}
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:
 result=[]
 for i,c in enumerate(ex.map(download,assets.values())):
  result.append(c)
  if i%50==0:print('download',i,'/',len(assets),flush=True)
(s/'downloaded.json').write_text(json.dumps(result,ensure_ascii=False),encoding='utf8')
print('selected',len(matches),'unique photos',len(assets),'ok',sum('file'in c for c in result),'failed',[(c['title'],c['error']) for c in result if 'error'in c])

