import json,pathlib,urllib.request,concurrent.futures,re
from lxml import html
root=pathlib.Path(__file__).parent
def get(url):
 return urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=50).read()
def job(pair):
 name,url=pair
 if (root/name).exists():return [name,'cached']
 try:
  b=get(url);(root/name).write_bytes(b);return [name,len(b)]
 except Exception as e:return [name,str(e)]
jobs=[(f'starlumen{i}.json',f'https://www.starlumen.com.br/products.json?limit=250&page={i}') for i in range(2,9)]
jobs += [('nitro_sobrepor.html','https://nitrolux.com.br/sobrepor.html'),('nitro_pendentes.html','https://nitrolux.com.br/pendentes.html'),('aaatop.html','https://sites.google.com/view/ledaaatop'),('margirius.html','https://www.margirius.com.br/')]
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:print(list(pool.map(job,jobs)))
stars=json.loads((root/'starlumen.html').read_text(encoding='utf8'))['products']
for i in range(2,9):
 f=root/f'starlumen{i}.json'
 if f.exists():stars+=json.loads(f.read_text(encoding='utf8'))['products']
(root/'starlumen_all.json').write_text(json.dumps(stars,ensure_ascii=False),encoding='utf8')
products=json.loads((root/'products.json').read_text(encoding='utf8'))
candidate=[]
for p in products:
 m=re.search(r'\bST(\d{3,4})(?!\d)',p['nome'])
 if not m:continue
 model='ST'+m[1]
 found=[s for s in stars if any(re.match(re.escape(model)+r'(?!\d)',(v.get('sku') or '').upper()) for v in s['variants'])]
 if found:candidate.append({'id':p['id'],'name':p['nome'],'matches':[{'title':s['title'],'handle':s['handle'],'variants':s['variants'],'images':s['images']} for s in found]})
(root/'starlumen_candidates.json').write_text(json.dumps(candidate,ensure_ascii=False),encoding='utf8')
print('stars',len(stars),'candidate products',len(candidate))
for c in candidate:print(c['id'],c['name'],[(m['title'],[(v['sku'],v['title'],v.get('featured_image')) for v in m['variants']]) for m in c['matches']])
nitro=[]
for fn,url in [('nitrolux.html','https://nitrolux.com.br/plafons.html'),('nitro_sobrepor.html','https://nitrolux.com.br/sobrepor.html'),('nitro_pendentes.html','https://nitrolux.com.br/pendentes.html')]:
 if not (root/fn).exists():continue
 h=html.fromstring((root/fn).read_text(encoding='utf8'))
 for n in h.xpath('//div[starts-with(@id,"imCell_")]'):
  prev=n.getprevious()
  if prev is None:continue
  imgs=prev.xpath('.//img/@src')
  if not imgs:continue
  text=' '.join(n.itertext());text=re.sub(r'\s+',' ',text).strip()
  if 'Garantia' not in text:continue
  nitro.append({'text':text,'image':urllib.parse.urljoin(url,imgs[0]),'source':url})
(root/'nitro_blocks.json').write_text(json.dumps(nitro,ensure_ascii=False),encoding='utf8')
print('nitro blocks',len(nitro))
aa=html.fromstring((root/'aaatop.html').read_bytes())
imgs=aa.xpath('//img/@src');(root/'aa_urls.json').write_text(json.dumps(imgs),encoding='utf8'); print('aa images',len(imgs),imgs[:2])

