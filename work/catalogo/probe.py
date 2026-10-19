import urllib.request,json
from pathlib import Path
r=Path('work/catalogo')
for name,url in [('santil','https://www.santil.com.br/api/catalog_system/pub/products/search/cabo?_from=0&_to=9'),('lojaeletrica','https://www.lojaeletrica.com.br/api/catalog_system/pub/products/search/cabo?_from=0&_to=9'),('tramontina','https://www.tramontina.com.br/modulo-tomada-2p-t-tramontina-20-a-250-v-branco/57115038.html')]:
 try:
  b=urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=25).read()
  (r/(name+'_probe.txt')).write_bytes(b)
  print(name,len(b),b[:120])
 except Exception as e:print(name,str(e))

