"use strict";
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const contexto = vm.createContext({ console });
for (const arquivo of ["iluminacao/presets.js", "estoque.js", "metadados-produtos.js", "catalogo.js"]) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, "js", arquivo), "utf8").replace("void inicializarCatalogo();", ""), contexto);
}
const dados = vm.runInContext(`(() => {
  const familias = agruparProdutosDoEstoque(dadosDoEstoque.produtos, configuracaoDoCatalogo);
  const cadastros = familias.flatMap(item => item.variacoes);
  const porMarca = Object.fromEntries(marcasVerificadas.map(marca => [marca.nome, cadastros.filter(item => identificarMarcaVerificada(item.nomeOriginal)?.identificador === marca.identificador).length]).filter(([, quantidade]) => quantidade));
  const porCategoria = Object.fromEntries(configuracaoDoCatalogo.categorias.map(categoria => [categoria.nome, familias.filter(item => item.categoria === categoria.identificador).length]));
  const campos = Object.fromEntries(["Potência", "Tensão", "Fluxo luminoso", "Base / soquete", "Proteção", "Corrente", "Medida declarada"].map(campo => [campo, cadastros.filter(item => item.especificacoes[campo]).length]));
  return { total: cadastros.length, familias: familias.length, porMarca, porCategoria, campos, semSku: cadastros.filter(item => !item.sku).map(item => item.identificador), revisar: familias.filter(item => item.classificacaoInterna.revisaoPendente).map(item => item.nome) };
})()`, contexto);
const candidatosSemFonteValidada = ["AAATOP", "LEFLEX", "MAYLER", "MGC", "YOE", "ULTRON", "ROYA", "LUMANT", "COBIX", "EMAVI"];
const nomesOriginais = vm.runInContext("dadosDoEstoque.produtos.map(item => item.nome)", contexto);
const contagensPendentes = candidatosSemFonteValidada.map(nome => [nome, nomesOriginais.filter(produto => new RegExp(`(^|[^A-Z0-9])${nome}(?=$|[^A-Z0-9])`).test(produto.toUpperCase())).length]).filter(([, quantidade]) => quantidade);
const linhas = ["# Auditoria do catálogo", "", `Cadastros internos: **${dados.total}**. Famílias: **${dados.familias}**. Cadastros sem SKU: **${dados.semSku.length}**. Famílias que exigem revisão manual de categoria: **${dados.revisar.length}**.`, "", "## Marcas verificadas presentes no nome do cadastro", "", ...Object.entries(dados.porMarca).map(([nome, quantidade]) => `- ${nome}: ${quantidade} cadastros`), "", "Aliases normalizados: PERFIL JR → JR Perfis; CTB, XCTB e XBCTB → CTB / XBCTB; TRAMOTINA → Tramontina. Cada marca tem uma única aba pública.", "", "## Nomes de marca ainda sem fonte oficial suficientemente confirmada", "", ...contagensPendentes.map(([nome, quantidade]) => `- ${nome}: ${quantidade} cadastros`), "", "Esses nomes continuam pesquisáveis como produtos internos, mas não geram uma aba de marca nem produtos externos automaticamente. A lista é uma fila de investigação editorial, não uma afirmação de parceria.", "", "## Campos declarados no próprio nome", "", ...Object.entries(dados.campos).map(([nome, quantidade]) => `- ${nome}: ${quantidade} cadastros`), "", "Não são inferidos preço, quantidade física, bitola adequada, certificação ou compatibilidade. Os três produtos externos curados constam em `js/metadados-produtos.js` com página oficial por modelo e são sempre ‘Sob encomenda’.", "", "## Famílias por categoria", "", ...Object.entries(dados.porCategoria).map(([nome, quantidade]) => `- ${nome}: ${quantidade}`), "", "## Revisão editorial pendente", "", ...dados.revisar.map(nome => `- ${nome}`), ""];
fs.writeFileSync(path.join(__dirname, "dados", "auditoria-produtos.md"), linhas.join("\n"));
console.log(`${dados.total} cadastros, ${dados.familias} famílias, ${dados.revisar.length} famílias para revisão manual.`);
