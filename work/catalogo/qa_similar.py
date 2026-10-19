from pathlib import Path
from pypdf import PdfReader
from PIL import Image,ImageDraw
r=Path('work/catalogo/similar/qa')
pdf=PdfReader(r/'catalogo.pdf')
print('pages',len(pdf.pages))
print('short',[(i+1,len(p.extract_text())) for i,p in enumerate(pdf.pages) if len(p.extract_text())<100])
for i in range(0,len(pdf.pages),4):
 sheet=Image.new('RGB',(1700,2240),'#cccccc')
 for j in range(min(4,len(pdf.pages)-i)):
  f=r/f'page-{i+j+1:03}.png'
  im=Image.open(f).convert('RGB');im.thumbnail((850,1100));sheet.paste(im,((j%2)*850,(j//2)*1120))
  ImageDraw.Draw(sheet).text(((j%2)*850+8,(j//2)*1120+1102),str(i+j+1),fill='black')
 sheet.save(r/f'review-{i//4+1:02}.jpg',quality=88)
print('review sheets ready')

