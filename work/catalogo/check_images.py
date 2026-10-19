from PIL import Image,ImageOps,ImageDraw,ImageFont
import pathlib,json,math,textwrap
r=pathlib.Path(__file__).parent
p={x['id']:x for x in json.loads((r/'products.json').read_text(encoding='utf8'))}
a=json.loads((r/'all_images.json').read_text(encoding='utf8'))
a.sort(key=lambda x:p[x['id']]['nome'])
font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',16)
for page in range(math.ceil(len(a)/16)):
 canvas=Image.new('RGB',(1600,1600),'#dddddd');d=ImageDraw.Draw(canvas)
 for k,x in enumerate(a[page*16:page*16+16]):
  col,row=k%4,k//4;left,top=col*400,row*400
  im=Image.open(x['file']);im.thumbnail((380,285));canvas.paste(im,(left+(400-im.width)//2,top+5+(285-im.height)//2))
  text=x['id']+' '+x.get('brand','Bling')+'\n'+'\n'.join(textwrap.wrap(p[x['id']]['nome'],36)[:4])
  d.multiline_text((left+8,top+294),text,font=font,fill='black',spacing=2)
 canvas.save(r/f'photos-check-{page+1}.jpg')
print('sheets',math.ceil(len(a)/16))
for x in a:
 if x.get('evidence') in ['EBAR80423','MDQ608643']:print(json.dumps(x,ensure_ascii=False))

