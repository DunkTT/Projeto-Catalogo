import json,pathlib,re,unicodedata
root=pathlib.Path(__file__).parent
products=json.loads((root/'products.json').read_text(encoding='utf8'))
stars=json.loads((root/'starlumen_all.json').read_text(encoding='utf8'))
matches=[];review=[]
for p in products:
 m=re.search(r'\bST\s*(\d{3,4})(?!\d)',p['nome'])
 if not m:continue
 model='ST'+m[1]
 color='PT' if re.search(r'\bPRET[OA]\b',p['nome']) else 'BR' if re.search(r'\bBRANC[OA]\b',p['nome']) else None
 if not color:review.append([p['id'],p['nome'],'Cor ou variante não identificada']);continue
 target=model+color
 c=[]
 for s in stars:
  for v in s['variants']:
   sku=(v.get('sku') or '').upper().replace('-','')
   if sku not in (target,target+'VCF'):continue
   img=v.get('featured_image')
   if not img and len(s['variants'])==1 and s['images']:img=s['images'][0]
   if img and 'ORLUCE' not in s['title'].upper():c.append({'id':p['id'],'url':img['src'],'source':'https://www.starlumen.com.br/products/'+s['handle'],'brand':'Starlumen','evidence':v['sku'],'title':s['title'],'name':p['nome']})
 if len(c)==1:matches+=c
 else:review.append([p['id'],p['nome'],len(c)])
blocks=json.loads((root/'nitro_blocks.json').read_text(encoding='utf8'))
def norm(s):return re.sub(r'[^A-Z0-9]','',s.upper())
for p in products:
 candidates=[]
 pn=norm(p['nome'])
 for b in blocks:
  model=re.split(r'Cód|CÓD|Cod|Potência|Potencia',b['text'])[0].strip()
  model=re.sub(r'^LUMINÁRIA\s+','',model).strip()
  if len(norm(model))<7 or not re.search(r'\d',model) or norm(model) not in pn:continue
  pw=re.findall(r'\b(\d+)W\b',p['nome']); bw=re.search(r'Potência:\s*(\d+)W',b['text'])
  if pw and bw and pw[0]!=bw[1]:review.append([p['id'],p['nome'],'Potência divergente: '+b['text'][:180]]);continue
  candidates.append({'id':p['id'],'url':b['image'],'source':b['source'],'brand':'Nitrolux','evidence':model,'title':b['text'],'name':p['nome']})
 # prefer longest exact model, reject tied distinct images
 if candidates:
  candidates.sort(key=lambda x:len(norm(x['evidence'])),reverse=True)
  top=[c for c in candidates if len(norm(c['evidence']))==len(norm(candidates[0]['evidence']))]
  if len(set(x['url'] for x in top))==1:matches.append(top[0])
  else:review.append([p['id'],p['nome'],'Várias variantes Nitrolux'])
(root/'official_matches.json').write_text(json.dumps(matches,ensure_ascii=False),encoding='utf8')
(root/'official_review.json').write_text(json.dumps(review,ensure_ascii=False),encoding='utf8')
print(json.dumps({'matches':[{k:v for k,v in x.items() if k not in ['url','source']} for x in matches],'review':review},ensure_ascii=False))

