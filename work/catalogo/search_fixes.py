from pathlib import Path
s=Path('work/catalogo/similar_sources_more.py').read_text(encoding='utf-8-sig')
head=s[:s.index('queries=')]
fun=s[s.index('def run(q):'):s.index('with concurrent.futures')]
exec(head+fun)
for q in ['joelho soldavel 25','interruptor pera','caixa sobrepor 4x2','conector eletrofita','presilha perfil led','varal lampadas','lampada geladeira','parafuso drywall ponta agulha']:
 run(q)

