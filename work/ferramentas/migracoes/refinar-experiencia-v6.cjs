const path = require("node:path");
const projetoWork = path.resolve(__dirname, "../..");
const fs = require('node:fs');
const base = path.join(projetoWork, "catalogo-web") + path.sep;
let codigo = fs.readFileSync(base + 'js/catalogo.js', 'utf8');
function trecho(inicio, fim, novo) {
  const de = codigo.indexOf(inicio), ate = codigo.indexOf(fim, de);
  if (de < 0 || ate < 0) throw new Error('Trecho ausente: ' + inicio);
  codigo = codigo.slice(0, de) + novo + codigo.slice(ate);
}
codigo = codigo.replace('corDaPrevia: "", brilho: 70', 'corDaPrevia: "neutro", brilho: 70');
codigo = codigo.replace('estadoDoProdutoAtual = { ...estadoDoProdutoAtual, ...alteracoes };', 'estadoDoProdutoAtual = { ...estadoDoProdutoAtual, ...alteracoes, corDaPrevia: motivo === "luz" ? alteracoes.corDaPrevia : estadoDoProdutoAtual.corDaPrevia };');
trecho('      const atual = produto.variacoes.find(item => item.identificador === estadoDoProdutoAtual.cadastroSelecionado);\n      const variacao = produto.variacoes.find(item => item.cor === cor', '    selecionarAcabamento(', `      if (estadoDoProdutoAtual.corDaPrevia === cor) return;
      atualizar({ corDaPrevia: cor }, "luz");
    },
`);
// A preferência de iluminação é independente dos cadastros e permanece entre produtos.
codigo = codigo.replace('corDaPrevia: produto.permiteSimulacao ? variacao.cor || "neutro" : ""', 'corDaPrevia: estadoDoProdutoAtual.corDaPrevia');
codigo = codigo.replace('corDaPrevia: produto.permiteSimulacao ? variacao.cor || "neutro" : ""', 'corDaPrevia: estadoDoProdutoAtual.corDaPrevia');
codigo = codigo.replace('cadastroSelecionado: "", corDaPrevia: "" }, "fechar"', 'cadastroSelecionado: "" }, "fechar"');
trecho('  function renderizarAtmosfera(atual) {', '  function alternarAbaInformacao(', `  let quadroDaLuz = 0, estadoDaLuzPendente = null;
  function agendarAtmosfera(atual) {
    estadoDaLuzPendente = atual;
    if (quadroDaLuz) return;
    quadroDaLuz = requestAnimationFrame(() => {
      quadroDaLuz = 0;
      renderizarAtmosfera(estadoDaLuzPendente);
    });
  }
  function renderizarAtmosfera(atual) {
    const produto = produtos.find(item => item.identificador === atual.produtoAberto);
    if (!produto) return;
    const cor = produto.permiteSimulacao ? configuracao.cores[atual.corDaPrevia] : null;
    const ambiente = obterElemento("midia-modal").parentElement;
    const corVisual = cor?.corVisual || "#7894ba";
    if (ambiente.dataset.tom !== corVisual) {
      ambiente.dataset.tom = corVisual;
      ambiente.style.setProperty("--cor-luz", corVisual);
    }
    ambiente.style.setProperty("--brilho", cor ? atual.brilho / 100 : 0);
    const midia = obterElemento("midia-modal").firstElementChild;
    if (midia) midia.dataset.iluminado = String(Boolean(cor));
    obterElemento("brilho").value = atual.brilho;
    obterElemento("valor-brilho").value = atual.brilho + "%";
    obterElemento("brilho").setAttribute("aria-valuetext", atual.brilho + "%");
    obterElemento("controle-brilho").hidden = !cor;
  }
  function renderizarPaletaUnificada(produto, cadastro, atual) {
    const paleta = obterElemento("paleta");
    obterElemento("comparacao").hidden = !produto.permiteSimulacao;
    if (!paleta.children.length) {
      paleta.replaceChildren(...Object.entries(configuracao.cores).map(([id, cor]) => {
        const botao = criarBotao("", () => estado.selecionarCor(id), "amostra tom-selecionavel");
        botao.dataset.cor = id; botao.style.setProperty("--cor-amostra", cor.corVisual);
        const luz = criarElemento("span", "amostra-luz"); luz.setAttribute("aria-hidden", "true");
        luz.append(criarElemento("span", "superficie"));
        const legenda = criarElemento("span", "legenda-tom", cor.nome);
        legenda.append(criarElemento("small")); botao.append(luz, legenda);
        return botao;
      }));
    }
    for (const botao of paleta.children) {
      const selecionada = botao.dataset.cor === atual.corDaPrevia;
      botao.dataset.selecionada = String(selecionada);
      botao.setAttribute("aria-pressed", String(selecionada));
      botao.querySelector("small").textContent = selecionada ? "✓ Na prévia" : "Experimentar";
    }
    const cor = configuracao.cores[atual.corDaPrevia];
    obterElemento("status-previa").textContent = cadastro.cor === atual.corDaPrevia ? "Tom da prévia presente no modelo selecionado." : "Simulação visual. Confirme os tons disponíveis neste modelo.";
    obterElemento("nota-temperatura").textContent = produto.permiteSimulacao ? "Prévia: " + cor.nome + ", referência " + cor.temperaturaReferencia + " K. A iluminação escolhida é mantida ao trocar o modelo ou acabamento." : "Acabamentos e características do modelo selecionado.";
    obterElemento("anuncio").textContent = produto.permiteSimulacao ? cor.nome + " na prévia." : "Modelo selecionado: " + cadastro.identificador;
  }
`);
codigo = codigo.replace('    if (motivo === "brilho") { renderizarAtmosfera(atual); return; }', '    if (motivo === "brilho") { agendarAtmosfera(atual); return; }');
codigo = codigo.replace('    if (motivo === "abrir") alternarAbaInformacao("essencial");', '    if (motivo === "luz") { renderizarPaletaUnificada(produto, cadastro, atual); agendarAtmosfera(atual); return; }\n    if (motivo === "abrir") alternarAbaInformacao("essencial");');
trecho('    if (motivo === "abrir") {\n      obterElemento("variacoes")', '    // Todos os IDs permanecem acessíveis', '    renderizarPaletaUnificada(produto, cadastro, atual);\n');
trecho('    obterElemento("comparacao").hidden = !cor;', '    const marcaDoProduto = marcasVerificadas', '');
trecho('    obterElemento("nota-temperatura").textContent = cor ?', '  function iniciar() {', '    renderizarAtmosfera(atual);\n  }\n');
codigo = codigo.replace('["abrir", "variacao", "brilho"].includes(motivo)', '["abrir", "variacao", "brilho", "luz"].includes(motivo)');
// Cartões mostram atributos de escolha; códigos internos permanecem nos detalhes.
const inicioResumo = codigo.indexOf('      const quantidadeDeAcabamentos = new Set(produto.variacoes.map(item => item.acabamento)).size;');
const fimResumo = codigo.indexOf('      const abrir = criarBotao("Ver detalhes"', inicioResumo);
codigo = codigo.slice(0,inicioResumo) + `      const atributos = { ...(produto.especificacoes || {}), ...(cadastro.especificacoes || {}) };
      if (!atributos.Potência && produto.potencia && produto.potencia !== "Não informada") atributos.Potência = produto.potencia;
      const escolhas = Object.entries(atributos).filter(([nome, valor]) => valor && !/temperatura|cor|referência|código/i.test(nome)).slice(0, 2);
      if (escolhas.length) conteudo.append(criarElemento("p", "resumo-variacoes", escolhas.map(([nome, valor]) => nome + ": " + valor).join(" · ")));
` + codigo.slice(fimResumo);
// O movimento principal já pertence ao trilho; os produtos não precisam animar outra vez.
trecho('    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {\n      const vitrine = obterElemento("grade-parceiro");', '  function filtrarAbasDeMarcas()', '  }\n');
fs.writeFileSync(base + 'js/catalogo.js', codigo);
let html = fs.readFileSync(base + 'catalogo_estoque_proto1.html', 'utf8');
html = html.replace('Os tons, lado a lado', 'Compare e escolha a luz').replace('<span>Comparação visual</span>', '<span>Toque em um tom</span>');
html = html.replace('<p class="nota-paleta">Cores realçadas para facilitar a comparação na tela.</p>', '<p class="nota-tecnica" id="status-previa"></p><p class="nota-paleta">Cores ilustrativas, realçadas para comparação na tela.</p>');
html = html.replace(/\s*<fieldset class="variacoes" id="selecao-cores">[\s\S]*?<\/fieldset>/, '');
html = html.replace('    <section class="modulo-parceiros"', '    <section class="entrada-catalogo"><div><span class="sobretitulo">Catálogo da loja</span><h1>Encontre o que seu projeto precisa.</h1><p>Explore as marcas ou vá direto aos produtos.</p></div><a class="ir-aos-produtos" href="#inicio-catalogo">Encontrar produtos ↓</a></section>\n    <section class="modulo-parceiros"');
fs.writeFileSync(base + 'catalogo_estoque_proto1.html', html);
