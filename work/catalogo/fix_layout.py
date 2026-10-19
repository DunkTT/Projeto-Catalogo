from pathlib import Path
from docx import Document
from docx.shared import Inches
import json
r=Path('work/catalogo');m=json.loads((r/'similar/build.json').read_text());d=Document(m['output'])
for row in d.tables[0].rows:row.height=Inches(2.65)
d.save(m['output'])
p=r/'build_similar.py';s=p.read_text();s=s.replace('row.height=Inches(2.8)','row.height=Inches(2.65 if page==0 else 2.8)');p.write_text(s)
print('Primeira página ajustada.')

