import json, pathlib, urllib.request, concurrent.futures, io, importlib.util
from PIL import Image,ImageOps
root=pathlib.Path(__file__).parent
(root/'images').mkdir(exist_ok=True)
def fetch(url):
    req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
    return urllib.request.urlopen(req,timeout=45).read()
def photo(x):
    try:
        b=fetch(x['url']); im=Image.open(io.BytesIO(b)); im=ImageOps.exif_transpose(im).convert('RGB'); im.thumbnail((900,900))
        f=root/'images'/f"{x['id']}.jpg"; im.save(f,quality=88)
        return {'id':x['id'],'file':str(f),'source':'Bling','size':im.size}
    except Exception as e:return {'id':x['id'],'error':str(e)}
photos=json.loads((root/'bling_photos.json').read_text(encoding='utf-8-sig'))
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool: result=list(pool.map(photo,photos))
(root/'images_manifest.json').write_text(json.dumps(result,ensure_ascii=False),encoding='utf8')
pages={'nitrolux':'https://nitrolux.com.br/plafons.html','starlumen':'https://www.starlumen.com.br/products.json?limit=250','embuled':'https://embuled.com/categoria/luminarias-internas/page/2/'}
def page(item):
    k,url=item
    try:
        b=fetch(url);(root/f'{k}.html').write_bytes(b);return [k,len(b)]
    except Exception as e:return [k,str(e)]
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool: print(list(pool.map(page,pages.items())))
print(json.dumps({'downloaded':sum('file' in r for r in result),'errors':[x for x in result if 'error' in x],'modules':{m:bool(importlib.util.find_spec(m)) for m in ['docx','PIL','lxml','fitz','pypdf','pdf2image','bs4']}}))

