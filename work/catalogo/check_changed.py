import json,unicodedata
from pathlib import Path
from PIL import Image,ImageDraw
from pypdf import PdfReader
r=Path('work/catalogo');s=r/'similar';qa=s/'qa'
p=sorted(json.loads((r/'products.json').read_text(encoding='utf8')),key=lambda x:unicodedata.normalize('NFD',x['nome']).encode('ascii','ignore').decode().upper())
ch=json.loads((s/'photo_corrections.json').read_text(encoding='utf8'))
pages=sorted({i//9+1 for i,x in enumerate(p) if x['id'] in ch})
pdf=PdfReader(qa/'catalogo.pdf')
assert len(pdf.pages)==189,len(pdf.pages)
assert all(len(x.extract_text().strip())>50 for x in pdf.pages)
for off in range(0,len(pages),6):
 sheet=Image.new('RGB',(1650,2200),'white')
 for j,page in enumerate(pages[off:off+6]):
  im=Image.open(qa/f'page-{page:03}.png');im.thumbnail((550,1100))
  sheet.paste(im,((j%3)*550,(j//3)*1100))
 sheet.save(qa/f'changed-{off//6+1:02}.jpg')
print('189 pages;',len(pages),'changed pages;', (len(pages)+5)//6,'review sheets')

