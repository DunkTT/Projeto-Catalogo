from pathlib import Path
import json,urllib.request,hashlib,io
from PIL import Image,ImageOps
r=Path('work/catalogo');s=r/'similar'
download=json.loads((s/'downloaded.json').read_text())
for c in download:
 if 'file' not in c:
  try:
   b=urllib.request.urlopen(urllib.request.Request(c['url'],headers={'User-Agent':'Mozilla/5.0'}),timeout=45).read()
   f=s/'images'/(hashlib.sha256(c['url'].encode()).hexdigest()[:16]+'.jpg')
   im=Image.open(io.BytesIO(b)).convert('RGB');im.thumbnail((700,700));im.save(f,quality=85);c['file']=str(f);c.pop('error',None)
  except Exception as e:print(c['title'],e)
by={x['url']:x for x in download if 'file'in x}
photos={x['id']:x|{'approx':False} for x in json.loads((r/'all_images.json').read_text()) if x['id']!='16508437975'}
for m in json.loads((s/'final_matches.json').read_text()):
 c=m['candidate'];c=c if 'file'in c else by.get(c.get('url'),{})
 if 'file'in c:photos[m['id']]=c|{'id':m['id'],'approx':True,'name':m['nome']}
tela=json.loads((s/'tela_image.json').read_text())
for id in ['16710564184','16710564818']:photos[id]=tela|{'id':id,'approx':True}
(s/'final_images.json').write_text(json.dumps(list(photos.values()),ensure_ascii=False),encoding='utf8')
print('images',len(photos),'approx',sum(x['approx'] for x in photos.values()))

