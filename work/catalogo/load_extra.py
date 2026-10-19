import json,pathlib,urllib.request,concurrent.futures
root=pathlib.Path(__file__).parent
jobs=[(f'embuled{i}.json',f'https://embuled.com/wp-json/wc/store/v1/products?per_page=100&page={i}') for i in range(2,11)]
jobs += [(f'nitro_{x}.css',f'https://nitrolux.com.br/pcss/{x}.css') for x in ['plafons','sobrepor','pendentes','pendentes-led']]
jobs += [('nitro_pendentes-led.html','https://nitrolux.com.br/pendentes-led.html')]
def job(pair):
 name,url=pair
 try:
  if not (root/name).exists():
   b=urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=45).read();(root/name).write_bytes(b)
  return [name,(root/name).stat().st_size]
 except Exception as e:return [name,str(e)]
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:print(list(pool.map(job,jobs)))

