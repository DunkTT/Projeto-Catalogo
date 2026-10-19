from pathlib import Path
p=Path('work/catalogo/match_similar.py')
s=p.read_text(encoding='utf-8-sig')
s=s.replace("t=re.sub(r'^\\d+\\s+(UN\\s+)?','',t)","t=re.sub(r'^\\d+\\s+(UNI?\\s+)?','',t)\n t=re.sub(r'^(ROLO \\d+ METROS |CARRETEL \\d+ METROS |SONDA |KIT \\d+X? |KIT COM \\d+ |\\d+X )','',t)\n t=t.replace('FITA ADESIVA','FITA').replace('CORDAO PARALELO','CABO PARALELO').replace('PASTA PARA SOLDA','PASTA DE SOLDA').replace('HASTE ROSCADA','BARRA ROSCADA')")
s=s.replace("rules=[",r"""rules=[
 ('boxit',r'.*BOXIT'),('chumbador',r'^CHUMBADOR'),('lampada_ventilador',r'^LAMPADA.*VENTILADOR'),
 ('modulo_led',r'^MODULO.*(LED|SMD)'),('teste',r'^TESTADOR'),('dvr',r'^GRAVADOR'),('tubo',r'.*ESTANHO'),
 ('luz_emergencia',r'^(LUMINARIA|LUZ).*EMERGENCIA'),('highbay',r'^LUMINARIA.*(HIGH.?BAY|UFO)'),('luminaria_publica',r'^LUMINARIA.*PUBLICA'),('luminaria_piscina',r'^LUMINARIA.*PISCINA'),('luminaria_linear',r'^LUMINARIA.*(LINEAR|HERMETICA|T5|T8)'),
 ('termoretratil',r'.*TERMO.?RETRATIL'),('fita_dupla',r'^FITA.*DUPLA'),('fita_crepe',r'^FITA.*CREPE'),
 ('tomada',r'^(BARRA DE TOMADA|CALHA COM.*TOMADA|EXTENSAO)'),('cabo_aco',r'^CABO (DE )?ACO'),
 ('conector_led',r'^(EMENDA|CONECTOR|TAMPA|RABICHO).*FITA'),('perfil_acessorio',r'^(TAMPA|DIFUSOR|PRESILHA).*PERFIL|^PERFIL.*(TAMPA|DIFUSOR|PRESILHA)'),
 ('conector_trilho',r'^(JUNCAO|CONECTOR|EMENDA).*TRILHO'),('perfil_acessorio',r'^JUNCAO.*PERFIL'),
 ('lampada',r'^(T8|T5|BULBO|BIPINO|LEITOSA|FILAMENTO)'),
 """)
s=s.replace("if k in cn:f=v;break","if norm(k).lower() in cn:f=v;break")
s=s.replace("rows=list({x['source']:x for x in rows}.values())",r"""rows=list({x['source']:x for x in rows}.values())
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
""")
s=s.replace("if c['brand']=='Loja Elétrica':sc-=.5",r"""for word in ['TOMADA','INTERRUPTOR','CEGO','CAMPAINHA','RJ45','RJ11','USB','DIMMER','ANTENA','FORQUILHA','ILHOS','TORCAO','BNC','P4','SPLIT','PORCELANA','WAGO','FLEXIVEL','PARALELO','PP','DRYWALL','NYLON','BAMBU','TARTARUGA','TRILHO','COB','NEON','RGB','TUBULAR','RETRO','VELA','BULBO','CHAO','SOLO','JARDIM','AUTO','BROCA','FEMEA','MACHO','AUTOFUSAO','PRETO','BRANCO','QUADRADO','REDONDO','SOBREPOR','EMBUTIR','PORTATIL','RECARREGAVEL','SENSOR','COM FIO','WIFI','VENTILADOR','DIN','TELA','PENTE']:
  aa=bool(re.search(r'\b'+word+r'\b',a));bb=bool(re.search(r'\b'+word+r'\b',b))
  if aa and bb:sc+=13
  elif aa and not bb:sc-=10
  elif bb and not aa:sc-=5
 for w in at&bt:
  if len(w)>3 and not w.isdigit() and idf.get(w,0)>5:sc+=9
 if c['brand']=='Loja Elétrica':sc-=.5""")
s=s.replace("ranked=sorted",r"""a=norm(p['nome'])
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
 ranked=sorted""")
p.write_text(s,encoding='utf8')

