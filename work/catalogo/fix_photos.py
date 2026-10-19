import json,re,unicodedata,urllib.request,hashlib,io,concurrent.futures
from pathlib import Path
from PIL import Image,ImageOps,ImageDraw
r=Path('work/catalogo');s=r/'similar'
a=json.loads((s/'pool.json').read_text())
p=json.loads((r/'products.json').read_text(encoding='utf8'))
imgs=json.loads((s/'final_images.json').read_text(encoding='utf8')); im={x['id']:x for x in imgs}
norm=lambda t:unicodedata.normalize('NFD',t).encode('ascii','ignore').decode().upper()
def query(q,k=0):return json.loads((s/('search_'+q.replace(' ','_')+'.json')).read_text(encoding='utf8'))[k]
def existing(t):
 for x in p:
  if t in norm(x['nome']) and x['id'] in im:return im[x['id']]
 raise Exception(t)
def choose(n,pattern):
 pool=[x for x in a if re.search(pattern,norm(x['title']))]
 assert pool,pattern
 def score(x):
  t=norm(x['title']);v=len(set(n.split())&set(t.split()))
  for w in ['PRETO','BRANCO','REDONDO','QUADRADO','DUPLO','TRIPLO','QUADRUPLO','MR16','MR11','AR70','AR111','PAR20','PAR30']:
   if w in n:v+=10 if w in t else -5
  return v
 return max(pool,key=score)
changes={}
for x in p:
 id=x['id'];n=norm(x['nome'])
 if id not in im or not im[id]['approx']:continue
 c=None
 if n.startswith('CABO ') and not any(w in n for w in ['ACO','PARALELO',' PP','PENDENTE','LUSTRE','CRISTAL','SILICONE']):
  c=choose(n,r'^(ROLO .* CABO FLEXIVEL)')
 elif n.startswith('BALIZADOR DE CHAO') and 'FACHO LATERAL' not in n:c=existing('BALIZADOR DE CHAO 7W COBY')
 elif n.startswith('EMBUTIDO '):
  c=choose(n,r'^SPOT.*EMBUT.*(P/|PARA).*\b(MR11|MR16|PAR20|PAR30|AR70|AR111)\b')
 elif 'CANALETA' in n and 'LED' in n:c=a[2848]
 elif n.startswith('CAIXA PLAST') and 'CONDULETE' in n:c=a[5097]
 elif n.startswith('CAIXA SOBREPOR') and 'EBONY' in n:c=query('caixa sobrepor 4x2')
 elif 'CONECTOR' in n and 'P4' in n and 'MACHO' in n:c=a[4072]
 elif 'CONECTOR LINEAR' in n:c=a[4139]
 elif n.startswith('INTERRUPTOR RETANG'):c=query('interruptor pera')
 elif n.startswith('LAMPADA BULBO') and not 'CAMARIM' in n:c=existing('LAMPADA BULBO 15W 3000K')
 elif n.startswith('LAMPADA LINEAR'):c=existing('LUMINARIA LINEAR HERMETICA')
 elif n.startswith('LAMPADA T5') or n.startswith('LUMINARIA T5'):c=a[2848]
 elif n.startswith('LAMPADA DE GELADEIRA'):c=query('lampada geladeira',0)
 elif n.startswith('LAMPADA RETRO') and ('G9' in norm(im[id].get('title',''))):c=existing('LAMPADA RETRO ST64')
 elif n.startswith('MODULO TOMADA') and not any(w in n for w in ['RJ','TV']):
  c=a[4608] if 'CINZA' in n or 'ARGILA' in n else a[4607] if 'VERMELH' in n else a[4605]
 elif n.startswith('PERFIL') and any(z in n for z in ['25X14','25X07']):c=existing('PERFIL JR EMBUTIR 24X14X2000MM BRANCO') if 'BRANCO' in n else existing('PERFIL JR EMBUTIR 24X14X2000MM PRETO')
 elif n.startswith('PLAFON') and not any(z in n for z in ['NITROLUX','REBAT','SEM LAMPADA','AR111']):
  title=norm(im[id].get('title',''))
  if any(w in title for w in ['SPOT','P/','CRISTAL','LUSTRE']) or ('RED.' in n and 'RETANG' in title):
   if 'RETANG' in n:c=existing('PLAFON RETANGULAR EMBUTIR 10X60') if 'EMBUTIR' in n else existing('PLAFON RETANGULAR SOBREPOR 10X')
   elif 'REDOND' in n or 'RED.' in n:c=existing('PLAFON REDONDO EMBUTIR 12W') if 'EMBUTIR' in n else existing('PLAFON REDONDO SOBREPOR 12W')
   else:c=existing('PLAFON BORDA PRETA SOBREPOR QUADRADO 25W') if 'PRETA' in n or 'PRETO' in n else existing('PLAFON QUADRADO SOBREPOR 25W')
 elif n.startswith('SOQUETE LOUCA E27'):c=a[2460]
 elif n.startswith('SOQUETE LOUCA E14'):c=a[2462]
 elif n.startswith('SOQUETE COM SUPORTE T8'):c=a[3294]
 elif n.startswith('SPOT') and 'REDONDO' in n and not any(w in n for w in ['SOBREPOR','PRETO']):c=a[111]
 elif n.startswith('SPOT') and 'QUADRADO' in n and not any(w in n for w in ['SOBREPOR','PRETO','SEM LAMPADA']):c=a[110]
 elif n.startswith('TRILHO ') and any(w in n for w in ['CANTONEIRA','CRUZ','TRILHO T ']):
  c=a[(1701 if 'PRET' in n else 1799) if 'CRUZ' in n else (1702 if 'PRET' in n else 1161) if n.startswith('TRILHO T ') else (1703 if 'PRET' in n else 1801)]
 elif n.startswith('VARAL DE LED'):c=query('varal lampadas',1)
 elif n.startswith('PRESILHA TRILHO'):c=a[5326]
 elif n.startswith('PRESILHA PARA PERFIL') or n.startswith('PERFIL PRESILHA'):c=query('presilha perfil led')
 elif n.startswith('VENTILADOR VENTUS RETRATIO PRETO'):c=existing('VENTILADOR VENTUS RETRATIO BRANCO')
 elif n.startswith('SENSOR PARA PORTA'):c=existing('SENSOR DE PORTA')
 if c and c.get('file')!=im[id].get('file'):changes[id]=dict(c)
def fetch(c):
 if c.get('file') and Path(c['file']).exists():return c
 url=c['url'];f=s/'images'/(hashlib.sha256(url.encode()).hexdigest()[:16]+'.jpg')
 if not f.exists():
  b=urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=40).read()
  z=ImageOps.exif_transpose(Image.open(io.BytesIO(b))).convert('RGB');z.thumbnail((700,700));z.save(f,quality=86)
 c['file']=str(f.resolve());return c
unique={c.get('url') or c.get('file'):c for c in changes.values()}
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as ex:
 for k,c in zip(unique,list(ex.map(fetch,unique.values()))):unique[k]=c
for id,c in changes.items():
 c=unique[c.get('url') or c.get('file')];changes[id]=dict(c,id=id,approx=True)
(s/'photo_corrections.json').write_text(json.dumps(changes,ensure_ascii=False),encoding='utf8')
u=list({c['file']:c for c in changes.values()}.values())
for offset in range(0,len(u),24):
 sheet=Image.new('RGB',(1200,1600),'white');d=ImageDraw.Draw(sheet)
 for j,c in enumerate(u[offset:offset+24]):
  z=Image.open(c['file']);z.thumbnail((270,210));xx=(j%4)*300;yy=(j//4)*265
  sheet.paste(z,(xx+(300-z.width)//2,yy));d.text((xx+4,yy+215),str(offset+j)+' '+c.get('title',c.get('name',''))[:42],fill='black')
 sheet.save(s/('corrections-'+str(offset//24+1)+'.jpg'))
print('changes',len(changes),'unique',len(u))
(s/'correction_unique.json').write_text(json.dumps(u,ensure_ascii=False),encoding='utf8')


