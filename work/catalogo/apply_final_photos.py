exec(open('work/catalogo/fix_photos.py',encoding='utf-8-sig').read().split('changes={}')[0])
exec(open('work/catalogo/fix_photos.py',encoding='utf-8-sig').read().split('def fetch(c):')[1].split('unique=')[0].join(['def fetch(c):','']))
ch=json.loads((s/'photo_corrections.json').read_text(encoding='utf8'))
joelho=fetch({'url':'https://cdn.awsli.com.br/800x800/1709/1709002/produto/202585107/1-mgcitrol9k.jpg','source':'https://www.guemat.com.br/joelho-90-soldavel-25mm-tigre','title':'Joelho 90 soldavel 25mm Tigre','brand':'Guemat'})
linear=fetch(a[2859]);bulbo=fetch(a[1860])
for x in p:
 id=x['id'];n=norm(x['nome']);c=None
 if id not in im or not im[id]['approx']:continue
 if n.startswith('COTOVELO') and 'MARROM' in n:c=joelho
 if n.startswith('LAMPADA LINEAR'):c=linear
 if n.startswith('LAMPADA BULBO') and id in ch:
  del ch[id]
  if any(z in norm(im[id].get('title','')) for z in ['KIT','FILAMENTO','STELLA','G45']):
   c=existing('LAMPADA BULBO 50W') if '100W' in n else bulbo
 if c:ch[id]=dict(c,id=id,approx=True)
for id,c in ch.items():im[id]=c
(s/'final_images.json').write_text(json.dumps(list(im.values()),ensure_ascii=False),encoding='utf8')
(s/'photo_corrections.json').write_text(json.dumps(ch,ensure_ascii=False),encoding='utf8')
print('updated',len(ch))
for name,c in [('joelho',joelho),('linear',linear),('bulbo',bulbo)]:print(name,c['file'])

