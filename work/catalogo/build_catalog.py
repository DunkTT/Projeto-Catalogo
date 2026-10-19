from pathlib import Path
import json,math,unicodedata
from PIL import Image
from docx import Document
from docx.shared import Inches,Pt,RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT,WD_CELL_VERTICAL_ALIGNMENT,WD_ROW_HEIGHT_RULE
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.opc.constants import RELATIONSHIP_TYPE as RT
root=Path(__file__).parent
out=Path('C:/Users/estoque/Documents/Codex/2026-10-08/erifique-se-o-mcp-do-bling/outputs/catalogo-produtos.docx')
products=json.loads((root/'products.json').read_text(encoding='utf8'))
images={x['id']:x for x in json.loads((root/'all_images.json').read_text(encoding='utf8'))}
images.pop('16508437975',None)
key=lambda p:unicodedata.normalize('NFD',p['nome']).encode('ascii','ignore').decode().upper()
pictured=sorted([p for p in products if p['id'] in images],key=key)
missing=sorted([p for p in products if p['id'] not in images],key=key)
doc=Document();sec=doc.sections[0]
sec.page_width=Inches(8.5);sec.page_height=Inches(11)
sec.top_margin=sec.bottom_margin=Inches(.6)
sec.left_margin=sec.right_margin=Inches(.6);sec.header_distance=sec.footer_distance=Inches(.25)
for name in ['Normal','Title','Subtitle','Heading 1','Heading 2']:
 s=doc.styles[name];s.font.name='Arial';s.font.color.rgb=RGBColor(0,0,0)
 s.paragraph_format.space_after=Pt(6)
doc.styles['Normal'].font.size=Pt(11)
doc.styles['Normal'].paragraph_format.line_spacing=1.05
doc.styles['Title'].font.size=Pt(25)
doc.styles['Title'].paragraph_format.space_after=Pt(5)
doc.styles['Heading 1'].font.size=Pt(16)
doc.styles['Heading 1'].paragraph_format.space_before=Pt(0)
doc.core_properties.title='Catálogo de produtos'
doc.core_properties.subject='Produtos ativos com nomes códigos SKU e fotografias'
doc.core_properties.author=''
footer=sec.footer.paragraphs[0];footer.alignment=WD_ALIGN_PARAGRAPH.RIGHT
run=footer.add_run('Catálogo de produtos  |  ');run.font.size=Pt(8)
field=OxmlElement('w:fldSimple');field.set(qn('w:instr'),'PAGE');footer._p.append(field)
def borders(table):
 tblpr=table._tbl.tblPr
 b=OxmlElement('w:tblBorders')
 for tag in ['top','left','bottom','right','insideH','insideV']:
  e=OxmlElement('w:'+tag);e.set(qn('w:val'),'single');e.set(qn('w:sz'),'4');e.set(qn('w:color'),'D9D9D9');b.append(e)
 tblpr.append(b)
def cellpad(cell,val=100):
 pr=cell._tc.get_or_add_tcPr();m=OxmlElement('w:tcMar')
 for side in ['top','left','bottom','right']:
  e=OxmlElement('w:'+side);e.set(qn('w:w'),str(val));e.set(qn('w:type'),'dxa');m.append(e)
 pr.append(m)
def no_split(row):
 p=row._tr.get_or_add_trPr();p.append(OxmlElement('w:cantSplit'))
def bookmark(p,id):
 e=OxmlElement('w:bookmarkStart');e.set(qn('w:id'),str(len(visited)));e.set(qn('w:name'),'produto_'+id);p._p.insert(0,e)
 e=OxmlElement('w:bookmarkEnd');e.set(qn('w:id'),str(len(visited)));p._p.append(e)
def link(p,label,url):
 e=OxmlElement('w:hyperlink');e.set(qn('r:id'),p.part.relate_to(url,RT.HYPERLINK,is_external=True))
 r=OxmlElement('w:r');pr=OxmlElement('w:rPr')
 size=OxmlElement('w:sz');size.set(qn('w:val'),'16');pr.append(size)
 color=OxmlElement('w:color');color.set(qn('w:val'),'555555');pr.append(color)
 r.append(pr);t=OxmlElement('w:t');t.text=label;r.append(t);e.append(r);p._p.append(e)
visited=[]
for page in range(math.ceil(len(pictured)/6)):
 if page:doc.add_page_break();doc.add_heading('Produtos com foto',level=1)
 else:
  doc.add_paragraph('Catálogo de produtos',style='Title')
  p=doc.add_paragraph('Produtos ativos   Outubro de 2026')
  p.paragraph_format.space_after=Pt(5)
  p=doc.add_paragraph(f'{len(products):,} produtos • {len(pictured)} com foto • Nome e código SKU'.replace(',','.'))
  p.paragraph_format.space_after=Pt(8)
  for r in p.runs:r.font.size=Pt(10)
 group=pictured[page*6:page*6+6]
 table=doc.add_table(rows=math.ceil(len(group)/2),cols=2);table.autofit=False
 table.alignment=WD_TABLE_ALIGNMENT.CENTER
 for c in table.columns:c.width=Inches(3.65)
 borders(table)
 for idx,item in enumerate(group):
  row=table.rows[idx//2];row.height=Inches(2.6);row.height_rule=WD_ROW_HEIGHT_RULE.AT_LEAST;no_split(row)
  cell=row.cells[idx%2];cell.width=Inches(3.65);cell.vertical_alignment=WD_CELL_VERTICAL_ALIGNMENT.CENTER;cellpad(cell,100)
  im=images[item['id']];w,h=Image.open(im['file']).size
  # preserve aspect ratio and avoid excessive upscaling of low resolution photos
  scale=min(3.1/w,1.45/h);width=w*scale;height=h*scale
  p=cell.paragraphs[0];p.alignment=WD_ALIGN_PARAGRAPH.CENTER;p.paragraph_format.space_after=Pt(6)
  pic=p.add_run().add_picture(im['file'],width=Inches(width),height=Inches(height))
  pic._inline.docPr.set('descr',item['nome'])
  p=cell.add_paragraph(item['nome']);p.alignment=WD_ALIGN_PARAGRAPH.CENTER
  p.paragraph_format.space_after=Pt(4);p.paragraph_format.line_spacing=1.0
  for r in p.runs:r.font.size=Pt(10.5);r.bold=True
  visited.append(item['id']);bookmark(p,item['id'])
  p=cell.add_paragraph('SKU '+(item['sku'] or 'não cadastrado'));p.alignment=WD_ALIGN_PARAGRAPH.CENTER;p.paragraph_format.space_after=Pt(3)
  for r in p.runs:r.font.size=Pt(10)
  p=cell.add_paragraph();p.alignment=WD_ALIGN_PARAGRAPH.CENTER;p.paragraph_format.space_after=Pt(0)
  if im['source']=='Bling':
   r=p.add_run('Foto do cadastro');r.font.size=Pt(8);r.font.color.rgb=RGBColor.from_string('555555')
  else:link(p,'Foto '+im['brand'],im['source'])
 # reduce final table paragraph
 spacer=doc.add_paragraph();spacer.paragraph_format.space_after=Pt(0);spacer.paragraph_format.space_before=Pt(0)
 spacer.paragraph_format.line_spacing=Pt(1);spacer.add_run().font.size=Pt(1)
doc.add_heading('Produtos sem foto',level=1)
p=doc.add_paragraph(f'{len(missing):,} produtos em ordem alfabética. Identificação por nome e SKU.'.replace(',','.'))
p.paragraph_format.space_after=Pt(8)
table=doc.add_table(rows=1,cols=2);table.autofit=False;table.alignment=WD_TABLE_ALIGNMENT.CENTER
table.columns[0].width=Inches(1.6);table.columns[1].width=Inches(5.7);borders(table)
header=table.rows[0];header.cells[0].width=Inches(1.6);header.cells[1].width=Inches(5.7);header.cells[0].text='Código SKU';header.cells[1].text='Nome do produto'
repeat=OxmlElement('w:tblHeader');header._tr.get_or_add_trPr().append(repeat)
for cell in header.cells:
 shd=OxmlElement('w:shd');shd.set(qn('w:fill'),'E9EEF3');cell._tc.get_or_add_tcPr().append(shd);cellpad(cell,85)
 for p in cell.paragraphs:
  p.paragraph_format.space_after=Pt(0)
  for r in p.runs:r.bold=True;r.font.size=Pt(10)
for item in missing:
 row=table.add_row();no_split(row)
 row.cells[0].width=Inches(1.6);row.cells[1].width=Inches(5.7)
 row.cells[0].text=item['sku'] or 'Não cadastrado\nID '+item['id']
 row.cells[1].text=item['nome']
 for cell in row.cells:
  cell.vertical_alignment=WD_CELL_VERTICAL_ALIGNMENT.CENTER;cellpad(cell,70)
  for p in cell.paragraphs:
   p.paragraph_format.space_after=Pt(0);p.paragraph_format.line_spacing=1.0
   for run in p.runs:run.font.size=Pt(10)
 visited.append(item['id']);bookmark(row.cells[1].paragraphs[0],item['id'])
assert len(visited)==1693 and len(set(visited))==1693
out.parent.mkdir(exist_ok=True,parents=True);doc.save(out)
(root/'catalog_build.json').write_text(json.dumps({'output':str(out),'total':len(products),'photos':len(pictured),'withoutPhoto':len(missing),'photoIds':[x['id'] for x in pictured],'allIds':visited},ensure_ascii=False),encoding='utf8')
print(json.dumps({'output':str(out),'total':len(products),'photos':len(pictured),'withoutPhoto':len(missing),'bytes':out.stat().st_size},ensure_ascii=False))



