from pathlib import Path
p=Path('work/catalogo/similar_sources.py')
s=p.read_text(encoding='utf-8-sig')
start=s.index("queries=");end=s.index("\ndef run",start)
s=s[:start]+"""queries=['chumbador','barra roscada','conector fita','conector mangueira','emenda fita','tampa perfil','presilha perfil','difusor perfil','termorretratil','massa epoxi','engate rapido','esguincho','estanho','saco entulho','filme stretch','barramento pente','bucha drywall','interruptor redondo','soquete t8','soquete rabicho','fotocelula','sensor porta','abajur bambu','tela fibra vidro','modulo led','lampada ventilador','refletor recarregavel','trilho din','adaptador benjamin','gancho bucha','parafuso madeira','bucha expansao','caneta marcador','tampa condulete','fita autofusao','luminaria high bay','luminaria ufo','conector torcao','fixa fio','luminaria tartaruga','cola instantanea','cordao paralelo','conector trilho l','conector trilho t','conector trilho cruz','plug femea']"""+s[end:]
p.with_name('similar_sources_more.py').write_text(s,encoding='utf8')

