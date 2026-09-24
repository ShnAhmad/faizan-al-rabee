from pathlib import Path
import openpyxl,re,json,hashlib
ROOT=Path(__file__).resolve().parents[1]
# Explicit category rules are kept separate from UI; change these to adjust assignment.
cats=[
 ('oils','Cooking oils','زيوت الطهي','Food',r'OIL|POMACE'),
 ('spices','Spices & seasonings','التوابل والبهارات','Food',r'SPICE|MASALA|PEPPER|PAPRIKA|OREGANO|TURMERIC|CUMIN|CORIANDER|CINNAMON|GARLIC POWDER|GINGER POWDER|SEASONING|SAFFRON|THYME|ROSEMARY|BAY LEA|CARDAMOM|CLOVE'),
 ('grains','Rice, pasta & dry goods','الأرز والمعكرونة والمواد الجافة','Food',r'RICE|PASTA|MAC[AC]?RONI|VERMIC|SPAGH|PENNE|NOODLE|LENTIL|BULGUR|OAT|BEAN|CHICKPEA|FUSILLI|COUSCOUS'),
 ('tea-coffee','Tea & coffee','الشاي والقهوة','Food',r'TEA|COFFEE|COFEE|NESCAFE|NECAFE|NECSCAFE|CREAMER'),
 ('dairy','Dairy, cheese & butter','الألبان والأجبان والزبدة','Food',r'MILK|CHEESE|BUTTER|GHEE|CREAM|YOG[HU]*URT|LABNEH'),
 ('sauces','Sauces & condiments','الصلصات والتتبيلات','Food',r'SAUCE|KETCHUP|MAYO|MAYOU|MUSTARD|TAHIN|VINEGAR|PICKLE|PESTO|RELISH|HARISSA|MOLASSES|JALAPENO|OLIVE'),
 ('bakery','Bakery & ingredients','المخبوزات ومكوناتها','Food',r'FLOUR|BAKING|BAKERY|SUGAR|SWEETENER|SYRUP|HONEY|BREAD|YEAST|COCOA|CACAO|VANILLA|GELATIN|GELATINE|CORN STARCH|CORNFLOUR|DEXTROSE|MALTODEX|XANTHAN|CITRIC|GLUTAMATE|AJINO|FOOD COLOR|ICING|PANCAKE|BUNS|KHUBS'),
 ('frozen','Frozen foods & produce','الأغذية المجمدة والخضروات','Food',r'FROZEN|CHICKEN|MEAT|NUGGET|POTATO|FRIES|CHERRY|GUAVA|VEGETABLE|VAGETABLE|BROCCOLI|MOLOKHIA|OKRA|CARROT|SPINACH|BEEF|SHRIMP|PRAWN|FISH FILLET'),
 ('beverages','Beverages & juices','المشروبات والعصائر','Food',r'JUICE|WATER|DRINK|PEPSI|COLA|SPRITE|FANTA|VIMTO|RED BULL|CODE RED|7 UP|7UP|KINZA|BEER|MIRINDA|SCHWEPPES'),
 ('snacks','Snacks & confectionery','الوجبات الخفيفة والحلويات','Food',r'CHOCOLATE|CHOCOLAT|CHOCLATE|CHOC|BISCUIT|COOKIE|CANDY|CHIPS|PRINGLE|OREO|KIT ?KAT|TWIX|SNICKER|BOUNTY|SKITTLES|HARIBO|MARSHMALLOW|GUM|JELLY|WAFER|CADBURY|GALAXY|CEREAL'),
 ('nuts','Nuts, seeds & dried fruit','المكسرات والبذور والفواكه المجففة','Food',r'NUT|SEED|ALMOND|PISTACHIO|CASHEW|RAISIN|DRY FRUIT|DATES'),
 ('pantry','Canned & pantry foods','المعلبات والمواد الغذائية','Food',r'.*'),
 ('packaging','Packaging & disposables','التغليف والمنتجات الاستهلاكية','Non-Food',r'CUP|CONTAINER|PLASTIC|PLASTICE|PLATE|SPOON|FORK|SPORK|CUTLERY|FOAM|TAKE.?AWAY|PAPER BAG|PAPER BOX|STRAW|CLING|FOIL|ALUMIN|BAKING PAPER|WRAP|PACKAGING'),
 ('hygiene','Cleaning & hygiene','التنظيف والعناية بالنظافة','Non-Food',r'TISSUE|NAPKIN|GARBAGE|TRASH|DETERGENT|CLEAN|SANITI|SOAP|BLEACH|DISINF|GLOVE|SPONGE|SCOUR|MOP|BROOM|BRUSH|DETTOL|CLOROX|FAIRY|FINISH|HAND WASH|DISHWASH|TOILET|WIPES|TOWEL'),
 ('kitchen','Kitchen & general supplies','مستلزمات المطابخ والتوريد العام','Non-Food',r'SKEWER|TOOTHPICK|CUTTING|BOARD|MATCH|LIGHTER|BATTERY|KNIFE|APRON|HAIR NET|CAP|BAG|ROLL|BAMBOO')]
# Non-food matches take precedence, except clearly named food brands/ingredients.
nonfood=cats[12:];food=cats[:12]
category_map={'OIL':'oils','SPICES':'spices','PASTA':'grains','TEA':'tea-coffee','COFFEE':'tea-coffee','MILK LONG LIFE':'dairy','HONEY':'bakery','SAUCES':'sauces','TOMATO KETCHUP':'sauces','MAYOUNNAISE':'sauces','BREAD CRUMBS':'bakery','RICE':'grains','FLOUR':'bakery','SUGAR':'bakery'}
def category(name,explicit=None):
 if explicit in category_map:return category_map[explicit]
 n=name.upper()
 if not re.search(r'FOAM PATENT FLOUR|TEA BAG|TEA BAGS|BAGUET|CREAM|COFFEE MATE|FINISHING',n):
  for c in nonfood:
   if re.search(c[4],n):return c[0]
 for c in food:
  if re.search(c[4],n):return c[0]
def clean(s):return re.sub(r'\s+',' ',str(s or '')).strip()
def slug(s):return re.sub('[^a-z0-9]+','-',s.lower()).strip('-')
w=openpyxl.load_workbook(ROOT/'data/raw/food-list.xlsx');s=w.active
images={}
for im in s._images:
 row=im.anchor._from.row+1;ext=im.format;name=f'food-{row}.{ext}';(ROOT/'public/products'/name).write_bytes(im._data());images[row]='/products/'+name
products=[];raw=[];heading=''
for row,values in enumerate(s.values,1):
 v=list(values)+[None]*6
 if isinstance(v[0],(int,float)) and v[1]:
  item={'name':clean(v[1]).title(),'brand':clean(v[2]).title(),'packSize':clean(v[3]),'usageUnit':'','image':images.get(row,''),'category':category(clean(v[1]),heading),'source':f'food-list.xlsx:Sheet1:{row}'};products.append(item);raw.append({'source':item['source'],'values':list(values)})
 elif v[0] and not v[1]:heading=clean(v[0])
brands=sorted({p['brand'] for p in products if p['brand']},key=len,reverse=True)
# Only correct clear spelling variants in source brand fields.
aliases={'Hienz':'Heinz','Neslte':'Nestlé','Nestle':'Nestlé','Hellmens':"Hellmann's",'Siracha':'Sriracha'}
for p in products:p['brand']=aliases.get(p['brand'],p['brand'])
w=openpyxl.load_workbook(ROOT/'data/raw/items-list.xlsx',read_only=True,data_only=True)
for row,values in enumerate(w.active.values,1):
 if row==1 or not values[0]:continue
 n=clean(values[0]);brand=''
 for b in brands:
  if re.search(r'\b'+re.escape(b)+r'\b',n,re.I):brand=aliases.get(b,b);break
 # Supplement brands only when their exact name is present in the product title.
 for b in ['Lurpak','Kraft',"Hershey's",'Red Bull','Oreo','Pringles','Mehran','Shan','Pepsi','Sprite','Vimto','Kinza','Sunbulah','Al Kabeer','Foster Clark','Al Shifa','Al Marai','Nestle','Nescafe']:
  if not brand and re.search(r'\b'+re.escape(b)+r'\b',n,re.I):brand=aliases.get(b,b)
 pack=re.search(r'\b\d+(?:\.\d+)?\s*(?:[xX*×]\s*\d+(?:\.\d+)?\s*)+(?:KG|GM|G|ML|LTR|L|PCS|OZ)?\b|\b\d+(?:\.\d+)?\s*(?:KG|GM|ML|LTR|OZ|G|L)\b',n,re.I)
 products.append({'name':n.title(),'brand':brand,'packSize':clean(pack.group(0)) if pack else '', 'usageUnit':clean(values[1] if len(values)>1 else ''),'image':'','category':category(n),'source':f'items-list.xlsx:Items:{row}'})
 raw.append({'source':products[-1]['source'],'values':list(values)})
seen={};result=[]
for p in products:
 key=re.sub(r'[^a-z0-9]','',p['name'].lower())+'|'+re.sub(r'[^a-z0-9]','',p['packSize'].lower())
 if key in seen:
  q=seen[key];q['sources'].append(p['source']);q['image']=q['image'] or p['image'];q['usageUnit']=q['usageUnit'] or p['usageUnit'];continue
 p['id']='far-'+hashlib.sha1(key.encode()).hexdigest()[:10];p['slug']=slug(p['name'])[:100]+'-'+p['id'][-6:];p['sources']=[p.pop('source')];p['type']=next(c[3] for c in cats if c[0]==p['category']);p['featured']=bool(p['image']);p['searchableKeywords']=' '.join([p['name'],p['brand'],p['category'],p['packSize']]);seen[key]=p;result.append(p)
used={p['category'] for p in result}
(ROOT/'data/products.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
(ROOT/'data/categories.json').write_text(json.dumps([{'id':c[0],'name':c[1],'ar':c[2],'type':c[3],'count':sum(p['category']==c[0] for p in result),'image':next((p['image'] for p in result if p['category']==c[0] and p['image']),'' )} for c in cats if c[0] in used],ensure_ascii=False,indent=2))
(ROOT/'data/raw/records.json').write_text(json.dumps(raw,ensure_ascii=False,default=str))
(ROOT/'data/import-report.json').write_text(json.dumps({'sourceRows':len(products),'products':len(result),'exactDuplicatesMerged':len(products)-len(result),'productImages':len(images),'missingBrand':sum(not p['brand'] for p in result),'notes':['Categories are editable keyword mappings, not source-certified taxonomy.','Unknown brands remain empty. Product names retained in source language for accurate enquiries.','Source workbooks are retained for audit and reimport.']},indent=2))
print((ROOT/'data/import-report.json').read_text())
