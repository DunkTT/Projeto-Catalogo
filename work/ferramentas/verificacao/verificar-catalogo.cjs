const path = require("node:path");
const projetoWork = path.resolve(__dirname, "../..");
"use strict";
const fs = require("node:fs");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const pasta = process.argv[2] || path.join(projetoWork, "catalogo-web");
const contexto = vm.createContext({ console });
vm.runInContext(fs.readFileSync(pasta + "/js/iluminacao/presets.js", "utf8"), contexto);
const javascript = fs.readFileSync(pasta + "/js/catalogo.js", "utf8");
vm.runInContext(fs.readFileSync(pasta + "/js/estoque.js", "utf8"), contexto);
vm.runInContext(fs.readFileSync(pasta + "/js/metadados-produtos.js", "utf8"), contexto);
vm.runInContext(fs.readFileSync(pasta + "/js/classificacao-visual.js", "utf8"), contexto);
vm.runInContext(javascript.replace("void inicializarCatalogo();", ""), contexto);
vm.runInContext(`
  globalThis.produtos = validarConfiguracao(configuracaoDoCatalogo, agruparProdutosDoEstoque(dadosDoEstoque.produtos, configuracaoDoCatalogo));
  globalThis.original = dadosDoEstoque.produtos;
  globalThis.configuracao = configuracaoDoCatalogo;
  globalThis.estado = criarEstadoDoCatalogo(produtos, configuracaoDoCatalogo);
  estado.observar(atual => { globalThis.atual = atual; });
`, contexto);
const { produtos, original, estado } = contexto;
assert.equal(original.length, 1693);
const variacoes = produtos.flatMap(produto => produto.variacoes);
assert.equal(variacoes.length, original.length);
assert.equal(new Set(variacoes.map(item => item.identificador)).size, original.length);
for (const cadastro of original) {
  const importado = variacoes.find(item => item.identificador === cadastro.id);
  assert.equal(importado.sku, cadastro.sku);
  assert.equal(importado.nomeOriginal, cadastro.original || cadastro.nome);
  assert.equal(importado.preco, null);
  assert.equal(importado.estoque, null);
}
assert.equal(variacoes.filter(item => !item.sku).length, 5);
const percorridos = [];
estado.mudarPagina(-1);
assert.equal(contexto.atual.pagina, 1, "Não recuar antes da primeira página");
do { percorridos.push(...contexto.atual.consulta.produtos.map(item => item.identificador)); if (contexto.atual.pagina === contexto.atual.consulta.totalPaginas) break; estado.mudarPagina(1); } while (true);
assert.equal(percorridos.length, produtos.length);
assert.equal(new Set(percorridos).size, produtos.length);
estado.mudarPagina(1);
assert.equal(contexto.atual.pagina, contexto.atual.consulta.totalPaginas, "Não avançar além da última página");
assert.ok(contexto.atual.consulta.produtos.length > 0, "Última página não fica vazia");
estado.filtrar({ busca: "__produto_inexistente_verificacao__" });
assert.equal(contexto.atual.consulta.total, 0);
assert.equal(contexto.atual.consulta.produtos.length, 0);
estado.mudarPagina(1);
assert.equal(contexto.atual.pagina, 1, "Consulta vazia mantém a página 1");
estado.filtrar({ busca: "7899452012286" });
assert.equal(contexto.atual.pagina, 1);
assert.equal(contexto.atual.consulta.total, 1);
estado.abrirProduto(contexto.atual.consulta.produtos[0].identificador);
assert.equal(contexto.atual.corDaPrevia, "neutro");
estado.selecionarCor("frio");
assert.equal(contexto.atual.corDaPrevia, "frio");
const cadastroAntes = contexto.atual.cadastroSelecionado;
assert.equal(cadastroAntes, "16433669408");
estado.selecionarAcabamento("preto");
assert.equal(contexto.atual.cadastroSelecionado, "16504827906");
assert.equal(contexto.atual.corDaPrevia, "frio");
estado.ajustarBrilho(200);
assert.equal(contexto.atual.brilho, 100);
estado.fecharProduto();
assert.equal(contexto.atual.produtoAberto, "");
estado.voltarParaHome();
estado.filtrar({ cor: "quente", acabamento: "preto" });
assert.ok(contexto.atual.consulta.total > 0, "Filtro combinado precisa exercitar produtos reais");
assert.ok(contexto.atual.consulta.produtos.every(produto => produto.variacoes.some(item => item.cor === "quente" && item.acabamento === "preto")));
estado.voltarParaHome();
estado.selecionarCategoria("fixacao");
assert.ok(contexto.atual.consulta.total > 0, "Categoria de fixação precisa conter resultados");
assert.ok(contexto.atual.consulta.produtos.every(produto => produto.categoria === "fixacao"));
vm.runInContext(`
  globalThis.exemplos = agruparProdutosDoEstoque([
    {id:'a', sku:'A', nome:'PLAFON 10W BRANCO 3000K MARCA'},
    {id:'b', sku:'B', nome:'PLAFON 10W PRETO 3000K MARCA'},
    {id:'c', sku:'C', nome:'PLAFON 10W PRETO 6000K MARCA'},
    {id:'d', sku:'D', nome:'PLAFON 12W PRETO 6000K MARCA'},
    {id:'e', sku:'E', nome:'PLAFON 10W PRETO 6000K OUTRAMARCA'},
    {id:'f', sku:'F', nome:'02 UN PARAFUSO PRETO 5X20'},
    {id:'g', sku:'G', nome:'10 UN PARAFUSO PRETO 5X20'},
    {id:'h', sku:'H', nome:'BARRAMENTO NEUTRO 06 TERMINAL'},
    {id:'i', sku:'I', nome:'FITA LED 12V AZUL 5M'}
  ], configuracaoDoCatalogo);
`, contexto);
assert.equal(contexto.exemplos.length, 7);
assert.equal(contexto.exemplos.find(item => item.variacoes.some(variacao => variacao.identificador === "a")).variacoes.length, 3);
assert.equal(contexto.exemplos.find(item => item.variacoes[0].identificador === "h").variacoes[0].cor, null);
assert.equal(contexto.exemplos.find(item => item.variacoes[0].identificador === "i").variacoes[0].acabamento, "nao-informado");
const html = fs.readFileSync(pasta + "/catalogo_estoque_proto1.html", "utf8");
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(item => item[1]);
assert.equal(ids.length, new Set(ids).size);
const idsDinamicos = ['trilho-parceiros', 'trilho-produtos', 'pagina-grade-anterior', 'pagina-grade-seguinte', 'grade-anterior', 'grade-seguinte'];
for (const correspondencia of javascript.matchAll(/obterElemento\("([^"]+)"\)/g)) assert.ok(ids.includes(correspondencia[1]) || idsDinamicos.includes(correspondencia[1]), correspondencia[1]);
for (const correspondencia of html.matchAll(/(?:src|href)="\.\/([^"]+)"/g)) assert.ok(fs.existsSync(pasta + "/" + correspondencia[1]));
console.log(`OK: ${original.length} cadastros preservados em ${produtos.length} famílias. Paginação completa, busca, filtros combinados, acabamentos, simulação sem SKU fictício e referências locais validados.`);
