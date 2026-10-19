const path = require("node:path");
const projetoWork = path.resolve(__dirname, "../..");
const fs = require('node:fs');
const raiz = path.join(projetoWork, "catalogo-web") + path.sep;
let html = fs.readFileSync(raiz + 'catalogo_estoque_proto1.html', 'utf8');
html = html.replace('  <script src="./js/anuncios-parceiros.js"', '  <script src="./js/classificacao-visual.js" defer></script>\n  <script src="./js/anuncios-parceiros.js"');
fs.writeFileSync(raiz + 'catalogo_estoque_proto1.html', html);
let js = fs.readFileSync(raiz + 'js/catalogo.js', 'utf8');
js = js.replace('  function renderizarParceiro() {', `  function aplicarClassificacaoVisual(elemento, avaliacao, recipiente = elemento) {
    elemento.dataset.nivelVisual = avaliacao.nivel.id;
    let selo = recipiente.querySelector(":scope > .selo-classificacao");
    if (!selo) {
      selo = criarElemento("span", "selo-classificacao");
      recipiente.append(selo);
    }
    const simbolo = criarDecoracao(avaliacao.nivel.simbolo, "simbolo-classificacao");
    selo.replaceChildren(simbolo, document.createTextNode(avaliacao.nivel.rotulo));
    // A explicação funciona com mouse, toque e teclado, sem depender da cor.
    let explicacao = recipiente.querySelector(":scope > .explicacao-classificacao");
    if (!explicacao && elemento.tagName !== "BUTTON") {
      explicacao = criarElemento("details", "explicacao-classificacao");
      recipiente.append(explicacao);
    }
    if (explicacao) {
      const aberta = explicacao.open;
      explicacao.replaceChildren(criarElemento("summary", "", "Por que este destaque?"),
        criarElemento("p", "", (avaliacao.motivos.join(" ") || "Produto disponível para explorar no catálogo.") + " O nível indica relevância editorial, não qualidade, raridade ou saldo em estoque."));
      explicacao.open = aberta;
    }
  }
  function avaliarSelecaoVisual(produtosDaSelecao) {
    const avaliacoes = classificacaoVisual.classificarGrupo(produtosDaSelecao, estadoAtualParaNavegacao || {}, registrosDeAnuncios);
    return avaliacoes.sort((a, b) => b.indice - a.indice || b.pontuacao - a.pontuacao)[0]
      || { nivel: classificacaoVisual.configuracao.niveis[0], motivos: [] };
  }
  function renderizarParceiro() {`);
js = js.replace('    renderizarPreviasDoParceiro();\n    estabilizarBanners();', `    const produtosDaSelecao = descobrindo ? pacotesDeParceiros[indiceDoPacote].produtos : obterFamiliasDoParceiro(parceiro, linha);
    aplicarClassificacaoVisual(obterElemento("palco-parceiro"), avaliarSelecaoVisual(produtosDaSelecao), obterElemento("conteudo-parceiro"));
    renderizarPreviasDoParceiro();
    estabilizarBanners();`);
js = js.replace('      botao.replaceChildren(midia, conteudo);', `      botao.replaceChildren(midia, conteudo);
      const produtosDaSelecao = descoberta ? item.produtos : obterFamiliasDoParceiro(item.parceiro, item.linha);
      aplicarClassificacaoVisual(botao, avaliarSelecaoVisual(produtosDaSelecao), conteudo);`);
js = js.replace('    obterElemento("grade-parceiro").replaceChildren(...selecionados.map(({ produto, registro }) => {', `    const classificacoes = new Map(classificacaoVisual.classificarGrupo(selecionados.map(item => item.produto), estadoAtualParaNavegacao || {}, registrosDeAnuncios).map(item => [item.produto.identificador, item]));
    obterElemento("grade-parceiro").replaceChildren(...selecionados.map(({ produto, registro }) => {`);
js = js.replace('      cartao.append(criarBotao("Ver detalhes ↗", () => estado.abrirProduto(produto.identificador), "abrir-item-parceiro"));', `      aplicarClassificacaoVisual(cartao, classificacoes.get(produto.identificador));
      cartao.append(criarBotao("Ver detalhes ↗", () => estado.abrirProduto(produto.identificador), "abrir-item-parceiro"));`);
fs.writeFileSync(raiz + 'js/catalogo.js', js);
let anuncios = fs.readFileSync(raiz + 'js/anuncios-parceiros.js', 'utf8');
anuncios = anuncios.replace(/      const busca = String\(contexto.busca[\s\S]*?      candidatos.push/, `      const pontuacao = classificacaoVisual.classificar(produto, contexto, [registro]).pontuacao;
      candidatos.push`);
fs.writeFileSync(raiz + 'js/anuncios-parceiros.js', anuncios);
let pacote = fs.readFileSync(path.join(projetoWork, "ferramentas", "publicacao", "preparar-publicacao.cjs"), 'utf8');
pacote = pacote.replace('"js/anuncios-parceiros.js",', '"js/anuncios-parceiros.js", "js/classificacao-visual.js",');
fs.writeFileSync(path.join(projetoWork, "ferramentas", "publicacao", "preparar-publicacao.cjs"), pacote);
fs.appendFileSync(raiz + 'css_style/refinamentos.css', `
/* Níveis editoriais: borda constante, cor + símbolo + texto, sem pulsação. */
[data-nivel-visual]{--cor-nivel:#adbdc9;--tinta-nivel:#e4edf2;--halo-nivel:transparent}
[data-nivel-visual="incomum"]{--cor-nivel:#76bff0;--tinta-nivel:#c6e7ff;--halo-nivel:#76bff012}
[data-nivel-visual="raro"]{--cor-nivel:#c4a0f4;--tinta-nivel:#e4d3ff;--halo-nivel:#c4a0f418}
[data-nivel-visual="epico"]{--cor-nivel:#ebc675;--tinta-nivel:#ffe6ad;--halo-nivel:#ebc67520}
html[data-tema="claro"] [data-nivel-visual]{--cor-nivel:#71818c;--tinta-nivel:#354651}
html[data-tema="claro"] [data-nivel-visual="incomum"]{--cor-nivel:#36739a;--tinta-nivel:#235574}
html[data-tema="claro"] [data-nivel-visual="raro"]{--cor-nivel:#8059a6;--tinta-nivel:#654087}
html[data-tema="claro"] [data-nivel-visual="epico"]{--cor-nivel:#977021;--tinta-nivel:#755115}
#trilho-parceiros>[data-nivel-visual],#grade-parceiro>[data-nivel-visual]{
  border-color:var(--cor-nivel);box-shadow:inset 0 2px 0 var(--cor-nivel),inset 0 0 36px var(--halo-nivel);
}
.selo-classificacao{display:inline-flex;align-items:center;gap:8px;max-width:100%;min-height:28px;margin-top:12px;padding:4px 9px;border:1px solid var(--cor-nivel);border-radius:8px;color:var(--tinta-nivel);font:600 .72rem/1.5 system-ui,sans-serif;letter-spacing:.015em}
.simbolo-classificacao{flex:none;font-size:1rem}
.explicacao-classificacao{margin-top:4px;font-size:.72rem;color:var(--tinta-nivel)}
.explicacao-classificacao summary{display:list-item;min-height:48px;padding:12px 0;cursor:pointer}
.explicacao-classificacao summary:focus-visible{outline:3px solid var(--cor-nivel);outline-offset:3px}
.explicacao-classificacao p{max-width:65ch;line-height:1.6;color:inherit}
@media(forced-colors:active){#trilho-parceiros>[data-nivel-visual],#grade-parceiro>[data-nivel-visual],.selo-classificacao{border-color:CanvasText;box-shadow:none;color:CanvasText}.explicacao-classificacao{color:CanvasText}}
`);
