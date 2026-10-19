const path = require("node:path");
const projetoWork = path.resolve(__dirname, "../..");
"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const pasta = process.argv[2] || path.join(projetoWork, "catalogo-web");
const contexto = vm.createContext({ console, URL });
for (const arquivo of ["js/iluminacao/presets.js", "js/classificacao-visual.js", "js/estoque.js", "js/metadados-produtos.js", "js/disponibilidade.js", "js/conteudo-auxiliar.js", "js/cadastro-anuncios-parceiros.js", "js/anuncios-parceiros.js", "js/pacotes-parceiros.js", "js/catalogo.js"]) {
  vm.runInContext(fs.readFileSync(`${pasta}/${arquivo}`, "utf8").replace("void inicializarCatalogo();", ""), contexto);
}
const resultado = vm.runInContext(`(() => {
  const produtos = agruparProdutosDoEstoque(dadosDoEstoque.produtos, configuracaoDoCatalogo);
  const cadastro = produtos[0].variacoes[0];
  const vazio = { porIdentificador: new Map(), porSku: new Map() };
  const positivo = { porIdentificador: new Map([[cadastro.identificador, { saldo: 4 }]]), porSku: new Map() };
  return {
    familias: produtos.length,
    interno: resolverDisponibilidade(cadastro, vazio),
    externo: resolverDisponibilidade(null, vazio, "parceiro"),
    comSaldo: resolverDisponibilidade(cadastro, positivo),
    nomes: produtos.map(produto => produto.nome),
    parceiro: configuracaoDoCatalogo.parceiros[0],
    familiasDoParceiro: configuracaoDoCatalogo.parceiros[0].linhas.map(linha => produtos.filter(produto => produto.marcaId === "nitrolux" && (!linha.termoDaLinha || normalizarTexto(produto.nome).includes(linha.termoDaLinha))).length),
    parceiros: configuracaoDoCatalogo.parceiros.map(item => item.identificador),
    marcasCentrais: ["embuled", "jr-perfis", "avant"].map(id => produtos.filter(item => item.marcaId === id).length),
    pacotes: criarPacotesDeParceiros(produtos, marcasVerificadas, () => .42),
    anuncios: gerenciadorDeMiniAnuncios.selecionar({ parceiro: configuracaoDoCatalogo.parceiros[0], linha: configuracaoDoCatalogo.parceiros[0].linhas[0], produtos, registros: cadastroDeMiniAnuncios.anuncios }),
    enderecoInseguro: gerenciadorDeMiniAnuncios.fonteSegura("javascript:alert(1)"),
    anuncioSemReferencia: gerenciadorDeMiniAnuncios.selecionar({ parceiro: configuracaoDoCatalogo.parceiros[0], linha: configuracaoDoCatalogo.parceiros[0].linhas[0], produtos, registros: [{ identificador: "pendente", parceiro: "nitrolux", fonteUrl: "https://www.nitrolux.com.br/", referenciaInterna: "", titulo: "Pendente", chamada: "", prioridade: 5, ativo: true }] }),
    dicas: obterDicasDoProduto(produtos.find(item => item.subcategoria === "plafons"), produtos.find(item => item.subcategoria === "plafons").variacoes[0]),
    ajuda: buscarTopicosDeAjuda("localização"),
    profissionais: configuracaoDeApoio.prestadores.profissionais.length,
    oficina: configuracaoDeApoio.oficina.secoes.length,
    localizacao: configuracaoDeApoio.localizacao,
    nomeDaLoja: configuracaoDoCatalogo.marca.nome
  };
})()`, contexto);
assert.equal(resultado.familias, 1346);
assert.equal(resultado.interno.tipo, "estoque");
assert.equal(resultado.externo.tipo, "encomenda");
const curadoria = vm.runInContext(`(() => {
  const externos = criarFamiliasExternas(dadosDoEstoque.produtos);
  const marcas = marcasVerificadas.map(item => item.identificador);
  return { externos, marcas, especificacoes: extrairEspecificacoesDeclaradas("LÂMPADA 10W 127V 800LM E27 IP65") };
})()`, contexto);
assert.equal(curadoria.externos.length, 3);
assert.ok(curadoria.externos.every(item => item.origem === "parceiro" && curadoria.marcas.includes(item.marcaId) && item.fonteOficial.startsWith("https://")));
assert.ok(curadoria.externos.flatMap(item => item.variacoes).every(item => !item.sku && item.codigoFabricante));
assert.equal(curadoria.especificacoes["Potência"], "10 W");
assert.equal(curadoria.especificacoes["Base / soquete"], "E27");
assert.match(resultado.comSaldo.detalhe, /4 unidade/);
assert.ok(resultado.nomes.includes("10 unidades de bucha para gesso dry fix"));
assert.equal(resultado.parceiro.linhas.length, 1);
assert.equal(resultado.parceiros.length, new Set(resultado.parceiros).size);
assert.ok(resultado.marcasCentrais.every(quantidade => quantidade > 0));
assert.ok(resultado.pacotes.length >= 3);
assert.ok(resultado.pacotes.every(pacote => pacote.produtos.length >= 2 && new Set(pacote.produtos.map(item => item.marcaId)).size === pacote.produtos.length && pacote.produtos.every(item => item.origem === "interna")));
assert.equal(new Set(resultado.pacotes.flatMap(pacote => pacote.produtos.map(item => item.identificador))).size, resultado.pacotes.flatMap(pacote => pacote.produtos).length);
assert.ok(resultado.pacotes.every(pacote => pacote.produtos.every((produto, indice) => produto.categoria === pacote.grupos[indice][0] && produto.subcategoria === pacote.grupos[indice][1])));
for (const pacote of resultado.pacotes.filter(item => item.identificador === "linear")) {
  const fita = pacote.produtos.find(item => item.subcategoria === "fitas");
  const fonte = pacote.produtos.find(item => item.subcategoria === "fontes");
  const tensaoDaFita = fita?.nome.match(/\b(12|24)\s*V\b/i)?.[1];
  if (tensaoDaFita && fonte) assert.match(fonte.nome, new RegExp(`\\b${tensaoDaFita}\\s*V\\b`, "i"));
}
assert.ok(resultado.parceiro.linhas.every(linha => !Object.hasOwn(linha, "paginaOficial")));
assert.ok(resultado.familiasDoParceiro.every(quantidade => quantidade > 0));
assert.equal(resultado.anuncios.length, 3);
assert.ok(resultado.anuncios.every(item => item.produto.variacoes.some(variacao => variacao.identificador === item.registro.referenciaInterna)));
assert.equal(resultado.enderecoInseguro, "");
assert.equal(resultado.anuncioSemReferencia.length, 0);
assert.ok(resultado.dicas.materiais.some(item => item.busca === "FIO"));
assert.ok(resultado.ajuda.some(item => item.id === "localizacao"));
assert.equal(resultado.profissionais, 0);
assert.equal(resultado.oficina, 3);
assert.equal(resultado.nomeDaLoja, "ULTRALED Hortolândia");
assert.match(resultado.localizacao.endereco, /Joseph Paul Julien Burlandy, 395/);
assert.equal(new URL(resultado.localizacao.googleMapsUrl).hostname, "www.google.com");
assert.equal(new URL(resultado.localizacao.googleMapsEmbedUrl).pathname, "/maps/embed");
const html = fs.readFileSync(`${pasta}/catalogo_estoque_proto1.html`, "utf8");
// A abertura saiu do catálogo: o contrato agora são os destinos entre páginas.
function verificarLink(conteudo, destino, rotulo) {
  const links = [...conteudo.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)];
  assert.ok(links.some(([, atributos, corpo]) => {
    const texto = corpo.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
    return atributos.includes(`href="${destino}"`) && rotulo.test(texto);
  }), `Link esperado: ${destino} (${rotulo})`);
}
const home = fs.readFileSync(`${pasta}/index.html`, "utf8");
verificarLink(home, "./ambientes.html", /Iniciar experiência/);
verificarLink(home, "./catalogo_estoque_proto1.html", /Catálogo/);
verificarLink(html, "./index.html", /Home|Experiência visual/);
verificarLink(html, "#inicio-catalogo", /Encontrar produtos/);
assert.ok(html.includes('id="inicio-catalogo"'), "Destino da entrada do catálogo");
const ambientes = fs.readFileSync(`${pasta}/ambientes.html`, "utf8");
verificarLink(ambientes, "./catalogo_estoque_proto1.html", /Explorar catálogo/);
const anterior = fs.readFileSync(`${pasta}/experiencia.html`, "utf8");
assert.match(anterior, /<meta\b[^>]*http-equiv="refresh"[^>]*content="0;\s*url=\.\/index\.html"/i);
verificarLink(anterior, "./index.html", /Home/);
assert.ok(!/<script\b[^>]*src="\.\/js\/(estoque|catalogo)\.js"/.test(home), "Home independente dos produtos");
assert.ok(!/Referência Bling/i.test(html));
assert.ok(html.indexOf('id="comparacao"') < html.indexOf('id="nome-produto"'));
assert.ok(!/site-parceiro|target="_blank"/.test(html));
assert.ok(html.indexOf('cadastro-anuncios-parceiros.js') < html.indexOf('anuncios-parceiros.js'));
for (const id of ["ir-parceiros", "grade-parceiro", "pontos-destaque", "pontos-parceiro", "busca-marca", "home-flutuante", "aviso-disponibilidade", "aba-tecnica", "aba-dicas", "modal-ajuda", "busca-ajuda", "modal-profissionais", "mapa-loja"]) assert.ok(html.includes(`id="${id}"`), `Catálogo: ${id}`);
assert.ok(!html.includes('id="voltar-home"'));
assert.ok(!html.includes('id="oficina"'));
assert.ok(fs.readFileSync(`${pasta}/oficina.html`, "utf8").includes('id="grade-oficina"'));
assert.ok(fs.readFileSync(`${pasta}/index.html`, "utf8").includes('id="conteudo-principal"'));
for (const pagina of ["index.html", "oficina.html", "ambientes.html", "experiencia.html"]) {
  const conteudo = fs.readFileSync(`${pasta}/${pagina}`, "utf8");
  const identificadores = [...conteudo.matchAll(/\bid="([^"]+)"/g)].map(item => item[1]);
  assert.equal(identificadores.length, new Set(identificadores).size, pagina);
  for (const referencia of conteudo.matchAll(/(?:src|href)="\.\/([^"]+)"/g)) {
    const destino = referencia[1].split("#")[0];
    assert.ok(fs.existsSync(`${pasta}/${destino}`), `${pagina}: ${destino}`);
  }
}
assert.ok(html.indexOf('conteudo-auxiliar.js') < html.indexOf('catalogo.js'));
const scripts = [...html.matchAll(/<script\b[^>]*src="\.\/([^"]+)"/g)].map(item => item[1]);
for (const dependencia of ["estoque", "metadados-produtos", "classificacao-visual", "iluminacao/presets"]) {
  assert.ok(scripts.includes(`js/${dependencia}.js`), `Dependência presente: ${dependencia}`);
  assert.ok(scripts.indexOf(`js/${dependencia}.js`) < scripts.indexOf("js/catalogo.js"), `Ordem: ${dependencia}`);
}
assert.ok(html.indexOf('experiencia.css') < html.indexOf('refinamentos.css'));
const estilos = fs.readFileSync(`${pasta}/css_style/experiencia.css`, "utf8");
for (const seletor of ['html[data-tema="claro"] .cartao', 'html[data-tema="claro"] .midia', 'html[data-tema="claro"] .destaque', 'html[data-tema="claro"] .painel-filtros', '.indicador-etapa[aria-current="step"]']) assert.ok(estilos.includes(seletor), seletor);
const refinamentos = fs.readFileSync(`${pasta}/css_style/refinamentos.css`, "utf8");
for (const seletor of ['html[data-tema="claro"] .cartao', 'html[data-tema="claro"] .modulo-oficina', 'html[data-tema="claro"] .mapa-loja', 'html[data-tema="claro"] .botao-cabecalho']) assert.ok(refinamentos.includes(seletor), seletor);
console.log("OK: disponibilidade, parceiros, nomenclatura e estrutura do mostrador validados.");
