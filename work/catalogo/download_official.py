import pathlib,json,urllib.request,concurrent.futures,io
from PIL import Image,ImageOps
root=pathlib.Path(__file__).parent
matches=json.loads((root/'official_matches.json').read_text(encoding='utf8'))
# ambiguity in the description: "30" conflicts with the official 20W
matches=[x for x in matches if x['id']!='16554737084']
candidates=json.loads((root/'embuled_candidates.json').read_text(encoding='utf8'))
for x in candidates:
 if x['id'] not in ['16512246120','16512246320','16633388314']:continue
 matches.append({'id':x['id'],'url':x['images'][0]['src'],'source':x['url'],'brand':'Embuled','evidence':x['ref'],'name':x['nome'],'title':x['official']})
def get(url):return urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=35).read()
# Public variant records distinguish exact model and color
for id,product in [(7726,'16512246608'),(6358,'16686922868')]:
 try:
  data=json.loads(get(f'https://embuled.com/wp-json/wc/store/v1/products/{id}'))
  (root/f'embuled_variant{id}.json').write_text(json.dumps(data,ensure_ascii=False),encoding='utf8')
  if data['images']:
   matches.append({'id':product,'url':data['images'][0]['src'],'source':data['permalink'],'brand':'Embuled','evidence':data['sku'],'name':data['name'],'title':data['name']})
 except Exception as e:print('variant',id,str(e))
bling=json.loads((root/'images_manifest.json').read_text(encoding='utf8'));known={x['id'] for x in bling if 'file' in x}
matches=matches
def download(x):
 try:
  f=root/'images'/f"{x['id']}_official.jpg"
  if not f.exists():
   b=get(x['url']);im=Image.open(io.BytesIO(b));im=ImageOps.exif_transpose(im)
   if im.mode in ['RGBA','P']:im=im.convert('RGBA');bg=Image.new('RGBA',im.size,'white');bg.alpha_composite(im);im=bg
   im=im.convert('RGB');im.thumbnail((900,900));im.save(f,quality=90)
  return x|{'file':str(f)}
 except Exception as e:return x|{'error':str(e)}
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:result=list(pool.map(download,matches))
(root/'official_manifest.json').write_text(json.dumps(result,ensure_ascii=False),encoding='utf8')
official=[x for x in result if 'file' in x]
overrides={x['id'] for x in official}
reject={'16528092308','16380972427','16600753560','16600743522','16473396998'}
valid=[x for x in bling if x['id'] not in overrides and x['id'] not in reject]+official
(root/'all_images.json').write_text(json.dumps(valid,ensure_ascii=False),encoding='utf8')
print(json.dumps({'official':sum('file' in x for x in result),'total':len(valid),'errors':[(x['id'],x['error']) for x in result if 'error' in x]},ensure_ascii=False))

