import pathlib,json,urllib.request,concurrent.futures
root=pathlib.Path(__file__).parent
jobs=[('embuled_api.json','https://embuled.com/wp-json/wc/store/v1/products?per_page=100&page=1'),('utron.html','https://www.utron.com.br/loja/busca.php?loja=1374334&palavra_busca='),('ctb.html','https://ctbluz.com.br/categoria-produto/linha-deco/pendente-lustre/'),('nitro2026.pdf','https://www.nitrolux.com.br/Downloads/Catalogo_2026.pdf')]
def job(pair):
 name,url=pair
 try:
  if not (root/name).exists():
   b=urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=50).read();(root/name).write_bytes(b)
  return [name,(root/name).stat().st_size]
 except Exception as e:return [name,str(e)]
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:print(list(pool.map(job,jobs)))

