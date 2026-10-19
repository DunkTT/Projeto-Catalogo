import json,re,unicodedata,html,math,collections
from pathlib import Path
r=Path(__file__).parent
from functools import lru_cache
@lru_cache(maxsize=20000)
def norm(t):
 t=html.unescape(t);t=re.sub('<[^>]+>',' ',t)
 t=unicodedata.normalize('NFKD',t).encode('ascii','ignore').decode().upper()
 t=t.replace('COBY','COB').replace('SLIN','SLIM').replace('EMBULED','EMBU LED').replace('EBULED','EMBU LED')
 t=re.sub(r'\bBR\b','BRANCO',t);t=re.sub(r'\bPT\b|\bEBONY\b','PRETO',t)
 for a,b in [('BRANCA','BRANCO'),('PRETA','PRETO'),('VERMELHA','VERMELHO'),('AMARELA','AMARELO'),('DOURADA','DOURADO'),('QUADRADA','QUADRADO'),('REDONDA','REDONDO'),('LAMPADAS','LAMPADA'),('PLAFONS','PLAFON'),('PAINEIS','PAINEL'),('PERFIS','PERFIL'),('PENDENTES','PENDENTE'),('ARANDELAS','ARANDELA'),('LUSTRES','LUSTRE'),('FONTES','FONTE'),('FITAS','FITA'),('SOQUETES','SOQUETE'),('LUMINARIAS','LUMINARIA'),('BALIZADORES','BALIZADOR'),('TOMADAS','TOMADA'),('INTERRUPTORES','INTERRUPTOR'),('SPOTS','SPOT'),('SENSORES','SENSOR'),('CABOS','CABO'),('BARRAMENTOS','BARRAMENTO'),('REFLETORES','REFLETOR')]:t=t.replace(a,b)
 return re.sub(r'\s+',' ',t).strip()
def family(t):
 t=norm(t)
 t=re.sub(r'^\d+\s+(UNI?\s+)?','',t)
 t=re.sub(r'^(ROLO \d+ METROS |CARRETEL \d+ METROS |SONDA |KIT \d+X? |KIT COM \d+ |\d+X )','',t)
 t=t.replace('FITA ADESIVA','FITA').replace('CORDAO PARALELO','CABO PARALELO').replace('PASTA PARA SOLDA','PASTA DE SOLDA').replace('HASTE ROSCADA','BARRA ROSCADA')
 t=re.sub(r'^STARLUMEN\s+','',t)
 if 'SERVICO' in t:return 'servico'
 rules=[
 ('boxit',r'.*BOXIT'),('chumbador',r'^CHUMBADOR'),('lampada_ventilador',r'^LAMPADA.*VENTILADOR'),
 ('modulo_led',r'^MODULO.*(LED|SMD)'),('teste',r'^TESTADOR'),('dvr',r'^GRAVADOR'),('tubo',r'.*ESTANHO'),
 ('luz_emergencia',r'^(LUMINARIA|LUZ).*EMERGENCIA'),('highbay',r'^LUMINARIA.*(HIGH.?BAY|UFO)'),('luminaria_publica',r'^LUMINARIA.*PUBLICA'),('luminaria_piscina',r'^LUMINARIA.*PISCINA'),('luminaria_linear',r'^LUMINARIA.*(LINEAR|HERMETICA|T5|T8)'),
 ('termoretratil',r'.*TERMO.?RETRATIL'),('fita_dupla',r'^FITA.*DUPLA'),('fita_crepe',r'^FITA.*CREPE'),
 ('tomada',r'^(BARRA DE TOMADA|CALHA COM.*TOMADA|EXTENSAO)'),('cabo_aco',r'^CABO (DE )?ACO'),
 ('conector_led',r'^(EMENDA|CONECTOR|TAMPA|RABICHO).*FITA'),('perfil_acessorio',r'^(TAMPA|DIFUSOR|PRESILHA).*PERFIL|^PERFIL.*(TAMPA|DIFUSOR|PRESILHA)'),
 ('conector_trilho',r'^(JUNCAO|CONECTOR|EMENDA).*TRILHO'),('perfil_acessorio',r'^JUNCAO.*PERFIL'),
 ('lampada',r'^(T8|T5|BULBO|BIPINO|LEITOSA|FILAMENTO)'),
 
 ('conector_led',r'^(FITA (CONECTOR|EMENDA|CANTONEIRA)|CONECTOR.*(FITA|LED|MANGUEIRA|PERFIL)|EMENDA.*FITA)'),
 ('conector_trilho',r'^(CONECTOR.*TRILHO|TRILHO (EMENDA|CRUZ|CANTONEIRA|L\b|T\b|I\b)|HASTE.*TRILHO)'),
 ('perfil_acessorio',r'^(PERFIL (BARRA|PRESILHA|DIFUSOR)|EMENDA PARA PERFIL|PRESILHA.*PERFIL)'),
 ('fita_isolante',r'^FITA ISOLANTE'),('fita_crepe',r'^FITA CREPE'),('fita_dupla',r'^FITA DUPLA'),
 ('termoretratil',r'^(FITA )?TERMORETRATIL'),
 ('fita_led',r'^(FITA|FILETE|CORDAO|VARAL|NEON|MANGUEIRA|LUZ DE LED)'),
 ('trilho_spot',r'^(TRILHO (SPOT|LUMINARIA)|SPOT.*TRILHO)'),
 ('trilho',r'^TRILHO'),
 ('perfil',r'^PERFIL'),
 ('modulo',r'^MODULO'),
 ('placa',r'^(CONJ.*PLACA|PLACA)'),
 ('suporte_modular',r'^SUPORTE'),
 ('tampa',r'^TAMPA'),
 ('conjunto',r'^CONJ'),
 ('interruptor',r'^INTERRUPTOR'),
 ('tomada',r'^TOMADA'),
 ('pino',r'^(PINO|PLUGUE|PLUG )'),
 ('adaptador',r'^(ADAPTADOR|BEJAMIN|BENJAMIN)'),
 ('caixa',r'^CAIXA'),
 ('arandela',r'^ARANDELA'),
 ('lustre',r'^LUSTRE'),
 ('pendente',r'^(PENDENTE|GLOORIA|GLORIA)'),
 ('plafon',r'^(PLAFON|PAINEL LED|PAINEL DE LED)'),
 ('boxit',r'^BOXIT'),('embutido',r'^(EMBUTIDO|MICROBORDA)'),
 ('spot',r'^(SPOT|PICO)'),
 ('lampada',r'^(LAMPADA|MR16|MR11|AR111|AR70|PAR20|PAR30|PAR38)'),
 ('refletor',r'^REFLETOR'),
 ('balizador',r'^BALIZADOR'),
 ('espeto',r'^ESPETO'),
 ('abajur',r'^ABAJUR'),
 ('ventilador',r'^VENTILADOR'),
 ('fonte',r'^(FONTE|DRIVE)'),
 ('soquete',r'^SOQUETE'),
 ('sensor',r'^(SENSOR|FOTOCELULA)'),
 ('controle',r'^(CONTROLE|DIMERIZADOR|DIMMER)'),
 ('luz_emergencia',r'^LUZ DE EMERGENCIA'),
 ('luminaria',r'^LUMINARIA'),
 ('cabo_aco',r'^CABO DE ACO'),
 ('cabo',r'^(CABO|FIO\b)'),
 ('terminal',r'^(TERMINAL|CONECTOR (ILHOS|TUBULAR ILHOS|FORQUILHA))'),
 ('conector',r'^CONECTOR'),
 ('arruela',r'^ARRUELA'),('porca',r'^PORCA'),('parafuso',r'^PARAFUSO'),
 ('bucha',r'^BUCHA'),('gancho',r'^GANCHO'),('barra',r'^BARRA ROSCADA'),
 ('abracadeira',r'^ABRACADEIRA'),('disjuntor',r'^DISJUNTOR'),
 ('barramento',r'^BARRAMENTO'),('eletrofita',r'^ELETROFITA'),
 ('canaleta',r'^(CANALETA|COTOVELO|SISTEMA X)'),
 ('presilha',r'^(PRESILHA|FIXA TUDO|CANTONEIRA)'),
 ('cola',r'^(COLA|TEK BONDER|TYTAN BOND)'),
 ('silicone',r'^SILICONE'),('pu',r'^(PU40|PU |VEDA CALHA|ADESIVO)'),
 ('espuma',r'^ESPUMA'),('durepoxi',r'^DUREPOXI'),
 ('passafio',r'^PASSA FIO'),('pilha',r'^PILHA'),('caneta',r'^CANETA'),
 ('lapis',r'^LAPIS'),('martelo',r'^MARTELO'),('ferro',r'^FERRO DE SOLDA'),
 ('pasta',r'^PASTA DE SOLDA'),('disco',r'^DISCO'),('trena',r'^TRENA'),
 ('teste',r'^TESTE'),('lanterna',r'^LANTERNA'),('camera',r'^CAMERA'),
 ('dvr',r'^DVR'),('filtro',r'^FILTRO DE LINHA'),('lubrificante',r'^(LUBRIFICANTE|OLEO)'),
 ('saco',r'^SACO'),('stretch',r'^STRETCH|^FILME STRETCH'),
 ('rabicho',r'^RABICHO'),('engate',r'^ENGATE'),('esguincho',r'^ESGUINCHO'),
 ('tubo',r'^TUBO'),('bob',r'^BOB')]
 for f,pat in rules:
  if re.search(pat,t):return f
 return None
rows=[]
for s in json.loads((r/'starlumen_all.json').read_text(encoding='utf8')):
 if not s.get('images'):continue
 title=html.unescape(s['title'])
 f=family(title)
 if not f:
  f={'Lustres e Pendentes':'pendente','Arandelas':'arandela','Plafons':'plafon','Spots':'spot','Painéis Led':'plafon','Lâmpadas':'lampada','Fitas de Led':'fita_led','Perfis de Led':'perfil','Fonte de Alimentação':'fonte','Postes':'balizador'}.get(s['product_type'])
 if f:rows.append({'title':title,'family':f,'url':s['images'][0]['src'],'source':'https://www.starlumen.com.br/products/'+s['handle'],'brand':'Starlumen','extra':s.get('product_type','')})
ecats={
'arandela':'arandela','pendente':'pendente','abajur':'abajur','painel':'plafon','plafon':'plafon','perfil':'perfil',
'drivers':'fonte','soquete':'soquete','sensores':'sensor','mangueira':'fita_led','fitas':'fita_led',
'abracadeira':'abracadeira','bulbo':'lampada','bipino':'lampada','filamento':'lampada','leitosa':'lampada','fume':'lampada','tubulares':'lampada','lampada':'lampada',
'espeto':'espeto','balizador':'balizador','high bay':'luminaria','luminaria publica':'luminaria','linear hermetica':'luminaria','linear slim':'luminaria',
'bambu':'pendente','corda':'pendente','glass':'pendente','refletores':'refletor','slim eco':'refletor','mini eco':'refletor','profissional ip66':'refletor','modular ip66':'refletor',
'fleshwind':'ventilador','breezehome':'ventilador','ventagio':'ventilador','miniwind':'ventilador','ringwind':'ventilador',
'spot sem lampada para trilho':'trilho_spot','spot trilho':'trilho_spot','aster':'trilho_spot','linear trilho':'trilho_spot',
'spot plana':'embutido','spot recuado s':'embutido','spot embutir':'spot','spot sobrepor':'spot','spot minimalista':'spot','spot recuado':'spot',
'acessorios trilho':'conector_trilho'}
for s in json.loads((r/'embuled_all.json').read_text(encoding='utf8')):
 if not s.get('images'):continue
 cats=' '.join(c['name'] for c in s['categories'])
 cn=norm(cats).lower();f=None
 for k,v in sorted(ecats.items(),key=lambda a:-len(a[0])):
  if norm(k).lower() in cn:f=v;break
 title=html.unescape(s['name'])
 f=f or family(title)
 if not f:continue
 rows.append({'title':title,'family':f,'url':s['images'][0]['src'],'source':s['permalink'],'brand':'Embuled','extra':cats+' '+s.get('sku','')})
f=r/'similar'/'extra_sources.json'
if f.exists():
 for s in json.loads(f.read_text(encoding='utf8')):
  fam=family(s['title'])
  if fam:rows.append(s|{'family':fam,'extra':''})
# consolidate ongoing source results
for f in (r/'similar').glob('search_*.json'):
 for s in json.loads(f.read_text(encoding='utf8')):
  fam=family(s['title'])
  if fam:rows.append(s|{'family':fam,'extra':''})
rows=list({x['source']:x for x in rows}.values())
for c in rows:
 t=norm(c['title']);f=family(t)
 if f:c['family']=f
 if c['brand']=='Embuled':
  cat=norm(c.get('extra',''))
  if 'HIGH BAY' in cat:c['family']='highbay'
  if 'LUMINARIA PUBLICA' in cat:c['family']='luminaria_publica'
  if 'LINEAR HERMETICA' in cat or 'LINEAR SLIM' in cat:c['family']='luminaria_linear'
 if 'CANETA' in t and c['brand']!='Loja Elétrica':c['family']='arandela'
 if 'EMBUTIDO DE SOLO' in t:c['family']='balizador'
 if 'CABO ACO' in t or 'CABO DE ACO' in t:c['family']='cabo_aco'
 if 'TESTEF'==t:c['family']='ignore'
prods={x['id']:x for x in json.loads((r/'products.json').read_text(encoding='utf8'))}
for x in json.loads((r/'all_images.json').read_text(encoding='utf8')):
 if x['id']=='16508437975':continue
 p=prods[x['id']]
 rows.append({'title':p['nome'],'family':family(p['nome']),'url':'','file':x['file'],'source':x['source'],'brand':x.get('brand','Bling'),'extra':''})

stop=set('DE DA DO PARA COM SEM EM E A O LED W V K CM MM METROS METRO LAMPADA'.split())
@lru_cache(maxsize=20000)
def tokens(t):return set(re.findall(r'[A-Z]+|\d+(?:[.,]\d+)?',norm(t)))-stop
df=collections.Counter(w for x in rows for w in tokens(x['title']))
idf={w:math.log((len(rows)+1)/(n+1)) for w,n in df.items()}
groups=[['BRANCO','PRETO','VERMELHO','VERDE','AZUL','AMARELO','ROSA','LARANJA','CINZA','DOURADO','COBRE','MARROM'],['QUADRADO','REDONDO','RETANGULAR'],['EMBUTIR','SOBREPOR'],['MR16','MR11','AR70','AR111','PAR20','PAR30','E27','G9','GU10']]
def score(p,c):
 a=norm(p['nome']);b=norm(c['title']+' '+c.get('extra',''))
 at=tokens(a);bt=tokens(b)
 sc=sum(min(idf.get(w,2),6)*(1 if not w.isdigit() else .45) for w in at&bt)
 for group in groups:
  aset={w for w in group if re.search(r'\b'+w+r'\b',a)}
  bset={w for w in group if re.search(r'\b'+w+r'\b',b)}
  if aset and bset:
   sc+=8*len(aset&bset)
   if not aset&bset:sc-=20
 for w in ['COB','RGB','RECUADO','MAGNETICO','PARALELO','BIPOLAR','MONOPOLAR','TUBULAR','VENTILADOR','DUPLO','TRIPLO','QUADRUPLO','FILAMENTO','FLEXIVEL','PP','TORCAO','BNC','P4','RJ45','RJ11','BORDA INFINITA','BORDA PRETO','CREPE','CEGA','FORQUILHA','ILHOS','TARTARUGA','BAMBU','GLOBO','CONE','MOVEL','SOBREPOR']:
  ia=w in a;ib=w in b
  if ia and ib:sc+=8
  elif ia!=ib:sc-=4
 for word in ['TOMADA','INTERRUPTOR','CEGO','CAMPAINHA','RJ45','RJ11','USB','DIMMER','ANTENA','FORQUILHA','ILHOS','TORCAO','BNC','P4','SPLIT','PORCELANA','WAGO','FLEXIVEL','PARALELO','PP','DRYWALL','NYLON','BAMBU','TARTARUGA','TRILHO','COB','NEON','RGB','TUBULAR','RETRO','VELA','BULBO','CHAO','SOLO','JARDIM','AUTO','BROCA','FEMEA','MACHO','AUTOFUSAO','PRETO','BRANCO','QUADRADO','REDONDO','SOBREPOR','EMBUTIR','PORTATIL','RECARREGAVEL','SENSOR','COM FIO','WIFI','VENTILADOR','DIN','TELA','PENTE']:
  aa=bool(re.search(r'\b'+word+r'\b',a));bb=bool(re.search(r'\b'+word+r'\b',b))
  if aa and bb:sc+=13
  elif aa and not bb:sc-=10
  elif bb and not aa:sc-=5
 for w in at&bt:
  if len(w)>3 and not w.isdigit() and idf.get(w,0)>5:sc+=9
 if c['brand']=='Loja Elétrica':sc-=.5
 return sc
products=json.loads((r/'products.json').read_text(encoding='utf8'))
exact={x['id']:x for x in json.loads((r/'all_images.json').read_text(encoding='utf8')) if x['id']!='16508437975'}
by=collections.defaultdict(list)
for c in rows:by[c['family']].append(c)
matches=[];missing=[]
for p in products:
 if p['id'] in exact:continue
 fam=family(p['nome'])
 opts=by.get(fam,[])
 if not opts:missing.append(p|{'family':fam});continue
 a=norm(p['nome'])
 if fam=='adaptador':
  filtered=[c for c in opts if any(w in norm(c['title']) for w in ['TOMADA','BENJAMIN','PLUG'])]
  if filtered:opts=filtered
 if fam=='balizador' and 'CHAO' in a:
  filtered=[c for c in opts if 'SOLO' in norm(c['title']) or 'EMBUTIR' in norm(c['title'])]
  if filtered:opts=filtered
 for word in ['BAMBU','FEMEA','MACHO','QUADRADO','REDONDO','TARTARUGA','TUBULAR','COB','NEON','FORQUILHA','ILHOS','P4','BNC','TORCAO','WAGO','PP','PARALELO','FLEXIVEL']:
  if re.search(r'\b'+word+r'\b',a):
   filtered=[c for c in opts if re.search(r'\b'+word+r'\b',norm(c['title']+' '+c.get('extra','')))]
   if filtered:opts=filtered
 ranked=sorted([(score(p,c),c) for c in opts],key=lambda a:-a[0])[:3]
 sc,c=ranked[0]
 matches.append(p|{'family':fam,'score':round(sc,1),'candidate':c,'alternatives':[v for _,v in ranked[1:]]})
(r/'similar'/'candidates.json').write_text(json.dumps(rows,ensure_ascii=False),encoding='utf8')
(r/'similar'/'matches.json').write_text(json.dumps(matches,ensure_ascii=False),encoding='utf8')
(r/'similar'/'missing.json').write_text(json.dumps(missing,ensure_ascii=False),encoding='utf8')
(r/'similar'/'review.tsv').write_text('\n'.join(f"{x['family']}\t{x['score']}\t{x['id']}\t{x['nome']}\t{x['candidate']['title']}" for x in sorted(matches,key=lambda x:(x['family'],x['score']))),encoding='utf8')
print('sources',len(rows),'matched',len(matches),'missing',len(missing))
print('missing families',collections.Counter(x['family'] for x in missing))
print('unclassified',[(x['id'],x['nome']) for x in missing if not x['family']])


