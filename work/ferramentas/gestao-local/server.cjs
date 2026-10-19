"use strict";

// Ferramenta local: não faz requisições nem alterações no Bling.
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { DatabaseSync } = require("node:sqlite");

const root = __dirname;
const dataDir = process.env.GESTAO_LOCAL_DATA_DIR ? path.resolve(process.env.GESTAO_LOCAL_DATA_DIR) : path.join(root, "dados-locais");
const catalogRoot = path.resolve(root, "../../catalogo-web");
fs.mkdirSync(dataDir, { recursive: true });
const db = new DatabaseSync(path.join(dataDir, "gestao.sqlite"));
db.exec("PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;");
db.exec(`
 CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY, original_sku TEXT, original_name TEXT NOT NULL,
  catalog_name TEXT, category TEXT, subcategory TEXT, partner_id TEXT,
  edit_name TEXT, edit_sku TEXT, edit_gtin TEXT, edit_category TEXT,
  edit_subcategory TEXT, edit_partner_id TEXT, image_path TEXT,
  blocked INTEGER NOT NULL DEFAULT 0, updated_at TEXT
 );
 CREATE TABLE IF NOT EXISTS partners (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, blocked INTEGER NOT NULL DEFAULT 0
 );
 CREATE TABLE IF NOT EXISTS shortages (
  id INTEGER PRIMARY KEY AUTOINCREMENT, product_id TEXT NOT NULL,
  partner_id TEXT, supplier_name TEXT, requested REAL NOT NULL, received REAL NOT NULL,
  pending REAL NOT NULL, note TEXT, status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
  FOREIGN KEY(product_id) REFERENCES products(id)
 );
 CREATE TABLE IF NOT EXISTS invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT, sha256 TEXT NOT NULL UNIQUE,
  invoice_key TEXT, supplier TEXT, imported_at TEXT NOT NULL, pdf_path TEXT
 );
 CREATE TABLE IF NOT EXISTS invoice_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT, invoice_id INTEGER NOT NULL,
  line_no INTEGER NOT NULL, supplier_code TEXT, gtin TEXT,
  description TEXT NOT NULL, unit TEXT, invoice_qty REAL NOT NULL,
  counted_qty REAL, product_id TEXT, confirmed INTEGER NOT NULL DEFAULT 0,
  UNIQUE(invoice_id,line_no), FOREIGN KEY(invoice_id) REFERENCES invoices(id)
 );
`);
if(!db.prepare("PRAGMA table_info(shortages)").all().some(c=>c.name==="supplier_name")) db.exec("ALTER TABLE shortages ADD COLUMN supplier_name TEXT");

function seed() {
  if (db.prepare("SELECT COUNT(*) AS n FROM products").get().n) return;
  const index = JSON.parse(fs.readFileSync(path.join(catalogRoot, "dados/categorizacao-interna.json"), "utf8"));
  const brands = fs.readFileSync(path.join(catalogRoot, "js/metadados-produtos.js"), "utf8");
  const addPartner = db.prepare("INSERT OR IGNORE INTO partners(id,name) VALUES (?,?)");
  for (const m of brands.matchAll(/\{ identificador: "([^"]+)", nome: "([^"]+)"/g)) addPartner.run(m[1], m[2]);
  const add = db.prepare("INSERT OR IGNORE INTO products(id,original_sku,original_name,catalog_name,category,subcategory,partner_id) VALUES (?,?,?,?,?,?,?)");
  db.exec("BEGIN");
  try {
    for (const family of index.familias) {
      for (const v of family.variacoes || []) {
        add.run(String(v.identificador), v.sku || "", v.nomeOriginal || v.nomeRevisado || family.nome,
          v.nomeRevisado || family.nome, family.categoria || "outros", family.subcategoria || "revisar", family.marcaId || "");
      }
    }
    db.exec("COMMIT");
  } catch (error) { db.exec("ROLLBACK"); throw error; }
}
seed();

function json(res, status, value) {
  const body = Buffer.from(JSON.stringify(value));
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Content-Length": body.length, "Cache-Control": "no-store" });
  res.end(body);
}
function fail(res, status, message) { json(res, status, { error: message }); }
async function body(req, max = 12_000_000) {
  const parts = []; let size = 0;
  for await (const part of req) { size += part.length; if (size > max) throw Error("Arquivo grande demais."); parts.push(part); }
  return Buffer.concat(parts);
}
function text(s) { return String(s ?? "").trim(); }
function number(n) { const x = Number(n); if (!Number.isFinite(x) || x < 0) throw Error("Quantidade inválida."); return x; }
function entity(s) { return String(s || "").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&#x([\da-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n,16))).replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&apos;/g,"'"); }
function tag(xml, name) { const m = xml.match(new RegExp(`<\\s*(?:[\\w.-]+:)?${name}\\b[^>]*>([\\s\\S]*?)<\\s*\\/(?:[\\w.-]+:)?${name}\\s*>`, "i")); return m ? entity(m[1].replace(/<[^>]+>/g, "")).trim() : ""; }
function attr(s, name) { return s.match(new RegExp(`\\b${name}="([^"]+)"`, "i"))?.[1] || ""; }
function parseInvoice(xml) {
  if (/<!DOCTYPE|<!ENTITY/i.test(xml)) throw Error("XML com DTD ou entidades externas não é aceito.");
  if (!/<(?:[\w.-]+:)?nfeProc\b|<(?:[\w.-]+:)?NFe\b/i.test(xml)) throw Error("Selecione um XML de NF-e.");
  const dets = [...xml.matchAll(/<(?:[\w.-]+:)?det\b([^>]*)>([\s\S]*?)<\/(?:[\w.-]+:)?det\s*>/gi)];
  if (!dets.length) throw Error("Nenhum item de produto encontrado na NF-e.");
  const items = dets.map((m, i) => {
    const prod = m[2].match(/<(?:[\w.-]+:)?prod\b[^>]*>([\s\S]*?)<\/(?:[\w.-]+:)?prod\s*>/i)?.[1] || "";
    const qty = Number(tag(prod, "qCom"));
    if (!prod || !Number.isFinite(qty)) throw Error(`Item ${i + 1} incompleto.`);
    return { line: Number(attr(m[1], "nItem")) || i + 1, code: tag(prod,"cProd"), gtin: tag(prod,"cEAN"), name: tag(prod,"xProd"), unit: tag(prod,"uCom"), qty };
  });
  return { key: attr(xml.match(/<(?:[\w.-]+:)?infNFe\b[^>]*>/i)?.[0] || "", "Id").replace(/^NFe/, ""), supplier: tag(xml.match(/<(?:[\w.-]+:)?emit\b[^>]*>([\s\S]*?)<\/(?:[\w.-]+:)?emit\s*>/i)?.[1] || "", "xNome"), items };
}
function activeProduct(id) {
  return db.prepare(`SELECT p.*, COALESCE(q.blocked,0) AS partner_blocked FROM products p LEFT JOIN partners q ON q.id=COALESCE(NULLIF(p.edit_partner_id,''),p.partner_id) WHERE p.id=?`).get(id);
}
function candidates(item) {
  const gtin = item.gtin && !/^SEM GTIN$/i.test(item.gtin) ? item.gtin : "";
  if (!gtin) return [];
  return db.prepare(`SELECT p.id,p.original_name,p.original_sku FROM products p LEFT JOIN partners q ON q.id=COALESCE(NULLIF(p.edit_partner_id,''),p.partner_id)
   WHERE p.blocked=0 AND COALESCE(q.blocked,0)=0 AND (p.original_sku=? OR p.edit_gtin=?) LIMIT 10`).all(gtin,gtin);
}
function route(req, res, url) {
  const method = req.method;
  if (method === "GET" && url.pathname === "/api/products") {
    const search = `%${text(url.searchParams.get("q"))}%`;
    const rows = db.prepare(`SELECT p.*,COALESCE(q.blocked,0) AS partner_blocked FROM products p LEFT JOIN partners q ON q.id=COALESCE(NULLIF(p.edit_partner_id,''),p.partner_id)
      WHERE (p.original_name LIKE ? OR p.original_sku LIKE ? OR p.id LIKE ? OR p.catalog_name LIKE ?) ORDER BY p.category,p.subcategory,p.original_name LIMIT 2000`).all(search,search,search,search);
    return json(res,200,rows);
  }
  if (method === "GET" && url.pathname === "/api/partners") return json(res,200,db.prepare("SELECT * FROM partners ORDER BY name").all());
  if (method === "GET" && url.pathname === "/api/shortages") return json(res,200,db.prepare(`SELECT s.*,COALESCE(p.edit_name,p.catalog_name,p.original_name) AS product_name,p.original_sku,COALESCE(q.name,'Sem parceiro') AS partner_name,p.blocked,COALESCE(q.blocked,0) AS partner_blocked FROM shortages s JOIN products p ON p.id=s.product_id LEFT JOIN partners q ON q.id=s.partner_id ORDER BY s.status,s.created_at DESC`).all());
  if (method === "GET" && url.pathname === "/api/suggestions") return json(res,200,db.prepare(`SELECT s.id,s.product_id,COALESCE(p.edit_name,p.catalog_name,p.original_name) AS product_name,p.original_sku,s.partner_id,s.supplier_name,COALESCE(q.name,'Sem parceiro') AS partner_name,s.pending,s.note FROM shortages s JOIN products p ON p.id=s.product_id LEFT JOIN partners q ON q.id=s.partner_id WHERE s.status='active' AND s.pending>0 AND p.blocked=0 AND COALESCE(q.blocked,0)=0 ORDER BY s.supplier_name,q.name,p.original_name`).all());
  if (method === "GET" && url.pathname === "/api/invoices") {
    const invoices = db.prepare("SELECT * FROM invoices ORDER BY imported_at DESC LIMIT 50").all();
    for (const inv of invoices) inv.items = db.prepare("SELECT * FROM invoice_items WHERE invoice_id=? ORDER BY line_no").all(inv.id);
    return json(res,200,invoices);
  }
  if (method === "GET" && url.pathname === "/api/export") {
    const value = { format:"gestao-local-v1", exportedAt:new Date().toISOString(), products:db.prepare("SELECT * FROM products").all(),partners:db.prepare("SELECT * FROM partners").all(),shortages:db.prepare("SELECT * FROM shortages").all(),invoices:db.prepare("SELECT * FROM invoices").all(),invoiceItems:db.prepare("SELECT * FROM invoice_items").all() };
    res.setHeader("Content-Disposition", `attachment; filename="gestao-local-${new Date().toISOString().slice(0,10)}.json"`);
    return json(res,200,value);
  }
  if (method === "GET" && url.pathname === "/api/suggestions.csv") {
    const rows = db.prepare(`SELECT s.id,p.id AS product_id,p.original_sku,COALESCE(p.edit_name,p.catalog_name,p.original_name) AS name,s.supplier_name,COALESCE(q.name,'') AS partner,s.pending FROM shortages s JOIN products p ON p.id=s.product_id LEFT JOIN partners q ON q.id=s.partner_id WHERE s.status='active' AND s.pending>0 AND p.blocked=0 AND COALESCE(q.blocked,0)=0 ORDER BY s.supplier_name,q.name,p.original_name`).all();
    const cell = x => `"${String(x??"").replaceAll('"','""')}"`;
    const csv = "pendencia_id;bling_id;sku;produto;fornecedor;parceiro;quantidade_sugerida\r\n" + rows.map(r=>[r.id,r.product_id,r.original_sku,r.name,r.supplier_name,r.partner,r.pending].map(cell).join(";")).join("\r\n");
    res.writeHead(200,{"Content-Type":"text/csv; charset=utf-8","Content-Disposition":"attachment; filename=proximo-pedido.csv"}); return res.end("\ufeff"+csv);
  }
  return false;
}
async function mutation(req,res,url) {
  const m=req.method;
  if (m==="POST" && url.pathname==="/api/import/xml") {
    const raw=await body(req); const xml=raw.toString("utf8"); const invoice=parseInvoice(xml);
    const hash=crypto.createHash("sha256").update(raw).digest("hex");
    if (db.prepare("SELECT id FROM invoices WHERE sha256=?").get(hash)) throw Error("Esta nota já foi importada.");
    db.exec("BEGIN");
    try {
      const id=db.prepare("INSERT INTO invoices(sha256,invoice_key,supplier,imported_at) VALUES (?,?,?,?)").run(hash,invoice.key,invoice.supplier,new Date().toISOString()).lastInsertRowid;
      const insert=db.prepare("INSERT INTO invoice_items(invoice_id,line_no,supplier_code,gtin,description,unit,invoice_qty,product_id) VALUES (?,?,?,?,?,?,?,?)");
      for (const it of invoice.items) { const matches=candidates(it); insert.run(id,it.line,it.code,it.gtin,it.name,it.unit,it.qty,matches.length===1?matches[0].id:null); }
      db.exec("COMMIT"); return json(res,201,{id,items:invoice.items.length});
    } catch(e) { db.exec("ROLLBACK"); throw e; }
  }
  if (m==="POST" && url.pathname==="/api/import/pdf") {
    const inv=number(url.searchParams.get("invoiceId"));
    if (!db.prepare("SELECT id FROM invoices WHERE id=?").get(inv)) throw Error("Nota não encontrada.");
    const raw=await body(req,20_000_000);
    if (raw.subarray(0,5).toString()!=="%PDF-") throw Error("Selecione um PDF válido.");
    const dir=path.join(dataDir,"documentos"); fs.mkdirSync(dir,{recursive:true});
    const file=path.join(dir,`nota-${inv}.pdf`); fs.writeFileSync(file,raw);
    db.prepare("UPDATE invoices SET pdf_path=? WHERE id=?").run(file,inv);
    return json(res,200,{ok:true});
  }
  const imageUpload=url.pathname.match(/^\/api\/products\/([^/]+)\/image$/);
  if(m==="POST" && imageUpload){
    const id=decodeURIComponent(imageUpload[1]);
    if(!activeProduct(id)) return fail(res,404,"Produto não encontrado.");
    const raw=await body(req,8_000_000);
    const sig=raw.subarray(0,12);
    let ext="";
    if(sig.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) ext="png";
    else if(sig.subarray(0,3).equals(Buffer.from([255,216,255]))) ext="jpg";
    else if(sig.subarray(0,4).toString()==="RIFF"&&sig.subarray(8,12).toString()==="WEBP") ext="webp";
    if(!ext) throw Error("Use imagem PNG, JPEG ou WebP.");
    const dir=path.join(dataDir,"imagens");fs.mkdirSync(dir,{recursive:true});
    const hash=crypto.createHash("sha256").update(raw).digest("hex");
    const file=path.join(dir,`${hash}.${ext}`);fs.writeFileSync(file,raw);
    db.prepare("UPDATE products SET image_path=?,updated_at=? WHERE id=?").run(file,new Date().toISOString(),id);
    return json(res,200,{ok:true});
  }
  const raw=await body(req); const v=JSON.parse(raw.toString("utf8")||"{}");
  if (m==="PATCH" && url.pathname.startsWith("/api/products/")) {
    const id=url.pathname.split("/")[3], p=activeProduct(id); if(!p) return fail(res,404,"Produto não encontrado.");
    const fields=["edit_name","edit_sku","edit_gtin","edit_category","edit_subcategory","edit_partner_id","blocked"];
    const changes=fields.filter(f=>Object.hasOwn(v,f)); if(!changes.length) throw Error("Nenhuma alteração informada.");
    for(const f of changes) if(f!=="blocked" && (typeof v[f]!=="string" || v[f].length>300)) throw Error("Campo inválido.");
    if (Object.hasOwn(v,"blocked") && ![0,1,true,false].includes(v.blocked)) throw Error("Bloqueio inválido.");
    if (v.edit_partner_id && !db.prepare("SELECT id FROM partners WHERE id=?").get(v.edit_partner_id)) throw Error("Parceiro não encontrado.");
    db.prepare(`UPDATE products SET ${changes.map(f=>`${f}=?`).join(",")},updated_at=? WHERE id=?`).run(...changes.map(f=>f==="blocked"?Number(v[f]):v[f]),new Date().toISOString(),id);
    return json(res,200,activeProduct(id));
  }
  if (m==="POST" && url.pathname==="/api/partners") {
    const name=text(v.name); if(!name || name.length>120) throw Error("Nome do parceiro inválido.");
    const id=`local-${crypto.randomUUID()}`; db.prepare("INSERT INTO partners(id,name) VALUES (?,?)").run(id,name);
    return json(res,201,{id,name,blocked:0});
  }
  if (m==="PATCH" && url.pathname.startsWith("/api/partners/")) {
    const id=url.pathname.split("/")[3]; if(!db.prepare("SELECT id FROM partners WHERE id=?").get(id)) return fail(res,404,"Parceiro não encontrado.");
    if(![0,1,true,false].includes(v.blocked)) throw Error("Bloqueio inválido.");
    db.prepare("UPDATE partners SET blocked=? WHERE id=?").run(Number(v.blocked),id); return json(res,200,{ok:true});
  }
  if (m==="POST" && url.pathname==="/api/shortages") {
    const p=activeProduct(text(v.product_id)); if(!p) throw Error("Produto não encontrado.");
    const partner=text(v.partner_id)||p.edit_partner_id||p.partner_id||"";
    if(partner && !db.prepare("SELECT id FROM partners WHERE id=?").get(partner)) throw Error("Parceiro não encontrado.");
    const requested=number(v.requested),received=number(v.received);
    if(requested<=received) throw Error("A quantidade pedida deve ser maior que a recebida.");
    const now=new Date().toISOString();
    const supplier=text(v.supplier_name).slice(0,200);
    const id=db.prepare("INSERT INTO shortages(product_id,partner_id,supplier_name,requested,received,pending,note,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?)").run(p.id,partner,supplier,requested,received,requested-received,text(v.note).slice(0,500),now,now).lastInsertRowid;
    return json(res,201,{id});
  }
  if (m==="PATCH" && url.pathname.startsWith("/api/shortages/")) {
    const id=number(url.pathname.split("/")[3]);
    if(!["active","forgotten","resolved"].includes(v.status)) throw Error("Estado inválido.");
    if(!db.prepare("SELECT id FROM shortages WHERE id=?").get(id)) return fail(res,404,"Pendência não encontrada.");
    db.prepare("UPDATE shortages SET status=?,updated_at=? WHERE id=?").run(v.status,new Date().toISOString(),id);
    return json(res,200,{ok:true});
  }
  if (m==="PATCH" && url.pathname.startsWith("/api/invoice-items/")) {
    const id=number(url.pathname.split("/")[3]);
    if(!db.prepare("SELECT id FROM invoice_items WHERE id=?").get(id)) return fail(res,404,"Item não encontrado.");
    const product=text(v.product_id); if(product && !activeProduct(product)) throw Error("Produto não encontrado.");
    const qty=v.counted_qty===""||v.counted_qty===null?null:number(v.counted_qty);
    db.prepare("UPDATE invoice_items SET product_id=?,counted_qty=?,confirmed=? WHERE id=?").run(product||null,qty,Number(Boolean(v.confirmed)),id);
    return json(res,200,{ok:true});
  }
  return false;
}

const staticFiles={"/":"index.html","/index.html":"index.html","/app.css":"app.css","/app.js":"app.js"};
const server=http.createServer(async(req,res)=>{
  try {
    const url=new URL(req.url,"http://127.0.0.1");
    if(req.method!=="GET") {
      const origin=req.headers.origin;
      if(origin && origin!==`http://127.0.0.1:${server.address().port}`) return fail(res,403,"Origem não permitida.");
      const result=await mutation(req,res,url); if(result!==false) return;
    } else {
      const result=route(req,res,url); if(result!==false) return;
      const file=staticFiles[url.pathname];
      if(file) { const bytes=fs.readFileSync(path.join(root,file)); res.writeHead(200,{"Content-Type":file.endsWith(".css")?"text/css; charset=utf-8":file.endsWith(".js")?"text/javascript; charset=utf-8":"text/html; charset=utf-8","Cache-Control":"no-store"}); return res.end(bytes); }
      const pdf=url.pathname.match(/^\/api\/invoices\/(\d+)\/pdf$/);
      if(pdf) { const inv=db.prepare("SELECT pdf_path FROM invoices WHERE id=?").get(Number(pdf[1])); if(!inv?.pdf_path) return fail(res,404,"PDF não encontrado."); res.writeHead(200,{"Content-Type":"application/pdf","Content-Disposition":"inline"}); return fs.createReadStream(inv.pdf_path).pipe(res); }
      const image=url.pathname.match(/^\/api\/products\/([^/]+)\/image$/);
      if(image){const p=activeProduct(decodeURIComponent(image[1]));const allowed=path.join(dataDir,"imagens")+path.sep;if(!p?.image_path||!p.image_path.startsWith(allowed)||!fs.existsSync(p.image_path))return fail(res,404,"Imagem não encontrada.");const type={".png":"image/png",".jpg":"image/jpeg",".webp":"image/webp"}[path.extname(p.image_path)];res.writeHead(200,{"Content-Type":type||"application/octet-stream","X-Content-Type-Options":"nosniff"});return fs.createReadStream(p.image_path).pipe(res)}
    }
    fail(res,404,"Rota não encontrada.");
  } catch(error) { fail(res,400,error.message||"Erro inesperado."); }
});
server.listen(0,"127.0.0.1",()=>console.log(`Gestão local: http://127.0.0.1:${server.address().port}`));
