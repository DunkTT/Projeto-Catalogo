import pathlib,json,re,urllib.parse
from lxml import html
root=pathlib.Path(__file__).parent
blocks=[]
for page,fn in [('plafons','nitrolux.html'),('sobrepor','nitro_sobrepor.html'),('pendentes','nitro_pendentes.html'),('pendentes-led','nitro_pendentes-led.html')]:
 h=html.fromstring((root/fn).read_text(encoding='utf8'));css=(root/f'nitro_{page}.css').read_text(encoding='utf8')
 coords={}
 for id,c1,c2,r1,r2 in re.findall(r'#(imCell_\d+)\s*\{\s*display:\s*grid;\s*grid-column:\s*(\d+)\s*/\s*(\d+);\s*grid-row:\s*(\d+)\s*/\s*(\d+)',css):
  if id not in coords:coords[id]=(int(c1),int(c2),int(r1),int(r2))
 images=[]
 for n in h.xpath('//div[starts-with(@id,"imCell_")]'):
  imgs=n.xpath('.//img/@src')
  if imgs and n.get('id') in coords:images.append((coords[n.get('id')],imgs[0]))
 for n in h.xpath('//div[starts-with(@id,"imCell_")]'):
  c=coords.get(n.get('id'));text=re.sub(r'\s+',' ',' '.join(n.itertext())).strip()
  if not c or 'Garantia' not in text or not re.search(r'Cód|Cod',text):continue
  near=[url for xy,url in images if xy[1]==c[0] and xy[2:]==c[2:]]
  if len(near)==1:blocks.append({'text':text,'image':urllib.parse.urljoin('https://nitrolux.com.br/'+page+'.html',near[0]),'source':'https://nitrolux.com.br/'+page+'.html'})
(root/'nitro_blocks.json').write_text(json.dumps(blocks,ensure_ascii=False),encoding='utf8')
print('blocks by grid',len(blocks))
# adjust exact model matcher
p=root/'match_sources.py';s=p.read_text(encoding='utf8')
s=s.replace("if len(norm(model))<7 or norm(model) not in pn:continue","if len(norm(model))<7 or not re.search(r'\\d',model) or norm(model) not in pn:continue")
s=s.replace("if img:c.append","if img and 'ORLUCE' not in s['title'].upper():c.append")
p.write_text(s,encoding='utf8')
exec(compile(s,str(p),'exec'))

