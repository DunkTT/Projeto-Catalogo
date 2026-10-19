import pathlib,json,urllib.request,concurrent.futures,io
from PIL import Image
root=pathlib.Path(__file__).parent
def get(url):return urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=50).read()
stars=json.loads((root/'starlumen_all.json').read_text(encoding='utf8'))
for i in range(9,21):
 f=root/f'starlumen{i}.json'
 try:
  if not f.exists():f.write_bytes(get(f'https://www.starlumen.com.br/products.json?limit=250&page={i}'))
  data=json.loads(f.read_text(encoding='utf8'))['products'];stars+=data
  if len(data)<250:break
 except Exception as e:print('starlumen',i,str(e));break
(root/'starlumen_all.json').write_text(json.dumps(stars,ensure_ascii=False),encoding='utf8')
print('Starlumen total',len(stars),flush=True)
(root/'aa').mkdir(exist_ok=True)
urls=json.loads((root/'aa_urls.json').read_text())
def job(item):
 i,url=item
 f=root/'aa'/f'page-{i:03}.jpg'
 try:
  if not f.exists():
   im=Image.open(io.BytesIO(get(url))).convert('RGB');im.thumbnail((2200,2200));im.save(f,quality=95)
  return [i,'ok']
 except Exception as e:return [i,str(e)]
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
 result=list(pool.map(job,enumerate(urls)))
(root/'aa_download.json').write_text(json.dumps(result),encoding='utf8')
print('AA',len(result),'errors',[x for x in result if x[1]!='ok'],flush=True)

