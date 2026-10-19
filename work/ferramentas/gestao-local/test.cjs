"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const os=require("node:os");
const path=require("node:path");
const {spawn}=require("node:child_process");

async function main(){
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),"gestao-local-test-"));
  const child=spawn(process.execPath,[path.join(__dirname,"server.cjs")],{env:{...process.env,GESTAO_LOCAL_DATA_DIR:tmp},stdio:["ignore","pipe","pipe"]});
  try{
    const origin=await new Promise((resolve,reject)=>{
      let log="";child.stdout.on("data",chunk=>{log+=chunk;const m=log.match(/http:\/\/127\.0\.0\.1:\d+/);if(m)resolve(m[0])});
      child.stderr.on("data",chunk=>reject(Error(String(chunk))));child.once("exit",code=>reject(Error(`Servidor encerrou: ${code}`)));
      setTimeout(()=>reject(Error("Servidor não iniciou.")),10000);
    });
    async function call(route,method="GET",value){const res=await fetch(origin+route,{method,headers:value&&typeof value==="object"?{"Content-Type":"application/json"}:undefined,body:value===undefined?undefined:typeof value==="string"?value:JSON.stringify(value)});const data=await res.json();assert.equal(res.ok,true,data.error);return data}
    const products=await call("/api/products");assert.equal(products.length,1693);
    const partners=await call("/api/partners");assert.ok(partners.length>0);
    const counts=new Map();for(const p of products)counts.set(p.original_sku,(counts.get(p.original_sku)||0)+1);
    const product=products.find(p=>p.partner_id&&p.original_sku&&counts.get(p.original_sku)===1);
    assert.ok(product,"produto com parceiro e SKU único");
    const shortage=await call("/api/shortages","POST",{product_id:product.id,partner_id:product.partner_id,supplier_name:"Fornecedor Teste",requested:10,received:6,note:"Teste de falta"});
    assert.equal((await call("/api/suggestions"))[0].pending,4);
    await call(`/api/partners/${product.partner_id}`,"PATCH",{blocked:1});
    assert.equal((await call("/api/suggestions")).length,0);
    await call(`/api/partners/${product.partner_id}`,"PATCH",{blocked:0});
    await call(`/api/products/${product.id}`,"PATCH",{blocked:1});
    assert.equal((await call("/api/suggestions")).length,0);
    await call(`/api/products/${product.id}`,"PATCH",{blocked:0});
    await call(`/api/shortages/${shortage.id}`,"PATCH",{status:"forgotten"});
    assert.equal((await call("/api/suggestions")).length,0);
    const xml=`<?xml version="1.0"?><nfeProc><NFe><infNFe Id="NFe123"><emit><xNome>Fornecedor Teste</xNome></emit><det nItem="1"><prod><cProd>COD-FORN</cProd><cEAN>${product.original_sku}</cEAN><xProd>${product.original_name}</xProd><uCom>UN</uCom><qCom>6.0000</qCom></prod></det></infNFe></NFe></nfeProc>`;
    const imported=await call("/api/import/xml","POST",xml);assert.equal(imported.items,1);
    const invoices=await call("/api/invoices");assert.equal(invoices[0].items[0].product_id,product.id);assert.equal(invoices[0].items[0].confirmed,0);
    let upload=await fetch(`${origin}/api/import/pdf?invoiceId=${imported.id}`,{method:"POST",body:Buffer.from("%PDF-1.4\n%%EOF")});assert.equal(upload.status,200);
    assert.equal((await fetch(`${origin}/api/invoices/${imported.id}/pdf`)).status,200);
    const png=Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=","base64");
    upload=await fetch(`${origin}/api/products/${product.id}/image`,{method:"POST",body:png});assert.equal(upload.status,200);
    assert.equal((await fetch(`${origin}/api/products/${product.id}/image`)).headers.get("content-type"),"image/png");
    await call(`/api/invoice-items/${invoices[0].items[0].id}`,"PATCH",{product_id:product.id,counted_qty:5,confirmed:true});
    assert.equal((await call("/api/invoices"))[0].items[0].counted_qty,5);
    const exported=await call("/api/export");assert.equal(exported.format,"gestao-local-v1");
    console.log("OK: catálogo, falta, bloqueio, esquecimento, XML, PDF, imagem, contagem e exportação.");
  }finally{
    if(child.exitCode===null){
      const stopped=new Promise(resolve=>child.once("exit",resolve));
      child.kill();await stopped;
    }
    if(tmp.startsWith(os.tmpdir()))fs.rmSync(tmp,{recursive:true,force:true,maxRetries:5,retryDelay:200});
  }
}
main().catch(e=>{console.error(e);process.exitCode=1});
