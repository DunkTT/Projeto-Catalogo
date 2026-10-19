from pathlib import Path
from PIL import Image,ImageOps,ImageDraw
from pypdf import PdfReader
import json,zipfile
r=Path('work/catalogo/qa')
pages=sorted(r.glob('page-*.png'))
pdf=PdfReader(r/'catalogo-produtos.pdf')
print('pages',len(pdf.pages),'images',len(pages))
print('text lengths',[len(p.extract_text()) for p in pdf.pages])
for i in range(0,len(pages),4):
 ims=[Image.open(p).convert('RGB') for p in pages[i:i+4]]
 sheet=Image.new('RGB',(1700,2240),'#aaaaaa')
 for j,im in enumerate(ims):
  im.thumbnail((850,1100));sheet.paste(im,((j%2)*850,(j//2)*1120))
  ImageDraw.Draw(sheet).text(((j%2)*850+8,(j//2)*1120+1102),pages[i+j].stem,fill='black')
 sheet.save(r/f'review-{i//4+1:02}.jpg',quality=85)

