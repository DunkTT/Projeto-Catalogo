exec(open('work/catalogo/inspect_pool.py',encoding='utf-8-sig').read().split('patterns=')[0])
for pattern in [r'^(soquete|receptaculo)',r'^(plug|conector).*p4',r'^(spot).*embut.*(dupl|tripl|quadrup|redond|quadrad).*p/',r'^(luminaria|lampada).*\\b(linear|t5)\\b',r'^modulo tomada.*(2p|10a|20a)',r'(conector|emenda).*(eletrificado|trilho)',r'interruptor.*(fio|abajur|10a)',r'condulete',r'presilha',r'eletrofita']:
 print('GROUP',pattern)
 hits=[(i,x['title']) for i,x in enumerate(a) if re.search(pattern,unicodedata.normalize('NFD',x['title']).encode('ascii','ignore').decode().lower())]
 print(*hits[:35],sep='\n')

