// Opcional para manutenção: execute com Node.js. Não é necessário para abrir o catálogo.
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const contexto = vm.createContext({ console });
vm.runInContext(fs.readFileSync(require("node:path").join(__dirname, "js/iluminacao/presets.js"), "utf8"), contexto);
vm.runInContext(fs.readFileSync(path.join(__dirname, "js/estoque.js"), "utf8"), contexto);
vm.runInContext(fs.readFileSync(path.join(__dirname, "js/metadados-produtos.js"), "utf8"), contexto);
vm.runInContext(fs.readFileSync(path.join(__dirname, "js/catalogo.js"), "utf8").replace("void inicializarCatalogo();", ""), contexto);
vm.runInContext(`
  globalThis.organizacao = {
    fonte: dadosDoEstoque.fonte,
    totalCadastros: dadosDoEstoque.produtos.length,
    familias: validarConfiguracao(configuracaoDoCatalogo, agruparProdutosDoEstoque(dadosDoEstoque.produtos, configuracaoDoCatalogo)),
    regras: configuracaoDoCatalogo.regrasDeAgrupamento.map(regra => ({ padrao: regra.padrao.source, categoria: regra.categoria, subcategoria: regra.subcategoria, emissor: Boolean(regra.emissor) }))
  };
`, contexto);
const organizacao = contexto.organizacao;
organizacao.totalFamilias = organizacao.familias.length;
organizacao.cadastrosSemSku = organizacao.familias.flatMap(familia => familia.variacoes).filter(cadastro => !cadastro.sku).map(cadastro => cadastro.identificador);
organizacao.familiasParaRevisao = organizacao.familias.filter(familia => familia.classificacaoInterna.revisaoPendente).map(familia => ({ identificador: familia.identificador, nome: familia.nome }));
organizacao.indicePorIdentificador = {};
organizacao.indicePorSku = {};
for (const familia of organizacao.familias) {
  for (const cadastro of familia.variacoes) {
    organizacao.indicePorIdentificador[cadastro.identificador] = { familia: familia.identificador, codigoInterno: familia.classificacaoInterna.codigo, marcaVerificada: familia.marcaId || null, nomeRevisado: cadastro.nomeRevisado, especificacoesDeclaradas: cadastro.especificacoes, acabamento: cadastro.acabamento, corDaLuz: cadastro.cor };
    if (cadastro.sku) {
      organizacao.indicePorSku[cadastro.sku] ||= [];
      organizacao.indicePorSku[cadastro.sku].push(cadastro.identificador);
    }
  }
}
fs.mkdirSync(path.join(__dirname, "dados"), { recursive: true });
fs.writeFileSync(path.join(__dirname, "dados/categorizacao-interna.json"), JSON.stringify(organizacao, null, 2) + "\n", "utf8");
console.log(`${organizacao.totalCadastros} cadastros, ${organizacao.totalFamilias} famílias, ${organizacao.familiasParaRevisao.length} famílias para revisão.`);
