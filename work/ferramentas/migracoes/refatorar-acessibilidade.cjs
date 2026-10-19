const path = require("node:path");
const projetoWork = path.resolve(__dirname, "../..");
const fs = require('node:fs');
const raiz = path.join(projetoWork, "catalogo-web") + path.sep;
const arquivo = raiz + 'js/catalogo.js';
let js = fs.readFileSync(arquivo, 'utf8');
const controlador = `
// Isola o diálogo e restaura exatamente o estado anterior do conteúdo.
function criarControleDeDialogo(tela, aoSolicitarFechamento, destinoAlternativo) {
  let aberto = false;
  let focoAnterior = null;
  let rolagemAnterior = '';
  const estadosAnteriores = new Map();
  const seletor = 'a[href],button,input,select,textarea,[tabindex],summary';
  function podeReceberFoco(elemento) {
    return elemento instanceof HTMLElement && elemento.isConnected &&
      !elemento.matches(':disabled') && !elemento.closest('[inert],[hidden]') &&
      elemento.getClientRects().length > 0 && getComputedStyle(elemento).visibility !== 'hidden';
  }
  function focaveis() {
    return [...tela.querySelectorAll(seletor)].filter(elemento =>
      podeReceberFoco(elemento) && elemento.tabIndex >= 0
    );
  }
  function manterFoco(evento) {
    if (aberto && !tela.contains(evento.target)) {
      (focaveis()[0] || tela).focus({ preventScroll: true });
    }
  }
  function controlarTeclado(evento) {
    if (!aberto) return;
    if (evento.key === 'Escape') {
      evento.preventDefault();
      evento.stopImmediatePropagation();
      aoSolicitarFechamento();
      return;
    }
    if (evento.key !== 'Tab') return;
    const elementos = focaveis();
    const primeiro = elementos[0];
    const ultimo = elementos[elementos.length - 1];
    const atual = document.activeElement;
    if (!primeiro) {
      evento.preventDefault(); tela.focus();
    } else if (!elementos.includes(atual) || (evento.shiftKey ? atual === primeiro : atual === ultimo)) {
      evento.preventDefault();
      (evento.shiftKey ? ultimo : primeiro).focus();
    }
  }
  function isolarConteudo() {
    for (const elemento of document.body.children) {
      if (!(elemento instanceof HTMLElement) || elemento === tela || elemento.contains(tela) ||
          ['SCRIPT', 'STYLE', 'LINK'].includes(elemento.tagName)) continue;
      if (!estadosAnteriores.has(elemento)) estadosAnteriores.set(elemento, elemento.inert);
      elemento.inert = true;
    }
  }
  const observador = new MutationObserver(isolarConteudo);
  return {
    abrir() {
      if (aberto) return;
      focoAnterior = document.activeElement;
      rolagemAnterior = document.body.style.overflow;
      aberto = true;
      tela.hidden = false;
      tela.tabIndex = -1;
      tela.setAttribute('role', 'dialog');
      tela.setAttribute('aria-modal', 'true');
      tela.setAttribute('aria-hidden', 'false');
      tela.setAttribute('aria-labelledby', 'titulo-abertura');
      tela.setAttribute('aria-describedby', 'orientacao-abertura');
      document.addEventListener('keydown', controlarTeclado, true);
      document.addEventListener('focusin', manterFoco, true);
      (focaveis()[0] || tela).focus({ preventScroll: true });
      isolarConteudo();
      observador.observe(document.body, { childList: true });
      document.body.style.overflow = 'hidden';
    },
    fechar() {
      if (!aberto) return;
      aberto = false;
      observador.disconnect();
      document.removeEventListener('keydown', controlarTeclado, true);
      document.removeEventListener('focusin', manterFoco, true);
      for (const [elemento, inertAnterior] of estadosAnteriores) elemento.inert = inertAnterior;
      estadosAnteriores.clear();
      document.body.style.overflow = rolagemAnterior;
      const destino = podeReceberFoco(focoAnterior) && focoAnterior !== document.body && !tela.contains(focoAnterior)
        ? focoAnterior : destinoAlternativo();
      if (podeReceberFoco(destino)) destino.focus({ preventScroll: true });
      tela.hidden = true;
      tela.setAttribute('aria-hidden', 'true');
      tela.removeAttribute('aria-modal');
    }
  };
}

`;
js = js.replace('function criarEstadoDoCatalogo(', controlador + 'function criarEstadoDoCatalogo(');
js = js.replace('  function finalizarAbertura() {', `  const controleDaAbertura = criarControleDeDialogo(
    obterElemento("boas-vindas"), finalizarAbertura, () => obterElemento("marca")
  );
  function finalizarAbertura() {`);
js = js.replace('    obterElemento("boas-vindas").hidden = true;', '    controleDaAbertura.fechar();');
js = js.replace(/    obterElemento\("pagina"\)\.inert = false;\s*obterElemento\("filtro-flutuante"\)\.inert = false;\s*obterElemento\("home-flutuante"\)\.inert = false;\s*obterElemento\("marca"\)\.focus\(\{ preventScroll: true \}\);/, '');
js = js.replace(/  function prepararAbertura\(\) \{[\s\S]*?\n  \}/, `  function prepararAbertura() {
    iniciarAbertura();
    controleDaAbertura.abrir();
  }`);
js = js.replace('    obterElemento("boas-vindas").addEventListener("keydown", evento => { if (evento.key === "Escape") finalizarAbertura(); });', '');
js = js.replace('      void conteudo.offsetWidth;\n      conteudo.classList.add("entrando");', `      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        conteudo.getAnimations().forEach(animacao => animacao.cancel());
        conteudo.animate([{ opacity: .5, transform: "translateY(6px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 300, easing: "ease-out" });
      }`);
js = js.replace('      obterElemento("saudacao-abertura").textContent = etapas[indice].titulo;', `      obterElemento("numero-etapa").setAttribute("aria-label", "Etapa " + (indice + 1) + " de " + etapas.length);
      obterElemento("saudacao-abertura").textContent = etapas[indice].titulo;`);
// Indicadores apenas visuais: uma única região anuncia o progresso.
js = js.replace('progresso.replaceChildren(...etapas.map(() => criarElemento("span", "marcador-etapa")));', 'progresso.replaceChildren(...etapas.map(() => criarElemento("span", "marcador-etapa")));\n    progresso.setAttribute("aria-hidden", "true");');
js = js.replace(/criarElemento\("span", "([^"\n]*)", "↗"\)/g, 'criarDecoracao("↗", "$1")');
js = js.replace('  function criarBotao(', `  function criarDecoracao(texto, classe = "") {
    const elemento = criarElemento("span", classe, texto);
    elemento.setAttribute("aria-hidden", "true");
    return elemento;
  }
  function criarBotao(`);
// Evita caracteres decorativos nos nomes dos botões gerados.
js = js.replace('const botao = criarElemento("button", classe, texto); botao.type', 'const botao = criarElemento("button", classe, texto.replace(/\\s*↗/g, "")); botao.type');
js = js.replace('Ver produtos da seleção ↗', 'Ver produtos da seleção').replace('Ver marca no catálogo ↗', 'Ver marca no catálogo');
// Pesquisa adiada; controles de filtro incluem o texto ainda não aplicado.
js = js.replace('    obterElemento("busca").addEventListener("input", evento => estado.filtrar({ busca: evento.target.value }, false));', `    const campoDeBusca = obterElemento("busca");
    let temporizadorDaBusca = null, compondoBusca = false;
    function cancelarBuscaPendente() {
      clearTimeout(temporizadorDaBusca);
      temporizadorDaBusca = null;
    }
    function agendarBusca() {
      cancelarBuscaPendente();
      if (compondoBusca) return;
      temporizadorDaBusca = setTimeout(() => {
        temporizadorDaBusca = null;
        estado.filtrar({ busca: campoDeBusca.value }, false);
      }, 300);
    }
    function aplicarFiltrosDoFormulario(alteracoes) {
      cancelarBuscaPendente();
      estado.filtrar({ ...alteracoes, busca: campoDeBusca.value });
    }
    campoDeBusca.addEventListener("input", agendarBusca);
    campoDeBusca.addEventListener("compositionstart", () => { compondoBusca = true; cancelarBuscaPendente(); });
    campoDeBusca.addEventListener("compositionend", () => { compondoBusca = false; agendarBusca(); });`);
for (const campo of ['cor', 'acabamento', 'ordenacao']) js = js.replace(`evento => estado.filtrar({ ${campo}: evento.target.value })`, `evento => aplicarFiltrosDoFormulario({ ${campo}: evento.target.value })`);
js = js.replace('evento => estado.filtrar({ porPagina: Number(evento.target.value) })', 'evento => aplicarFiltrosDoFormulario({ porPagina: Number(evento.target.value) })');
js = js.replace('      estadoAtualParaNavegacao = atual;', '      estadoAtualParaNavegacao = atual;\n      if (["iniciar", "catalogo", "busca", "navegar", "paginar"].includes(motivo)) cancelarBuscaPendente();');
js = js.replace('      obterElemento(id).replaceChildren(...itens.map(produto => criarCartaoDoCatalogo(produto, atual)));', '      const fragmento = document.createDocumentFragment();\n      for (const produto of itens) fragmento.append(criarCartaoDoCatalogo(produto, atual));\n      obterElemento(id).replaceChildren(fragmento);');
fs.writeFileSync(arquivo, js);
let html = fs.readFileSync(raiz + 'catalogo_estoque_proto1.html', 'utf8');
html = html.replace('id="boas-vindas" hidden', 'id="boas-vindas" role="dialog" aria-hidden="true" aria-labelledby="titulo-abertura" aria-describedby="orientacao-abertura" tabindex="-1" hidden');
html = html.replace('<span class="sobretitulo">Bem-vindo ao catálogo</span>', '<span class="sobretitulo" id="titulo-abertura">Bem-vindo ao catálogo</span><p class="somente-leitor" id="orientacao-abertura">Apresentação automática. Entre no catálogo ou pressione Escape para fechar.</p>');
html = html.replace('id="numero-etapa">', 'id="numero-etapa" role="status" aria-live="polite" aria-atomic="true">');
// Decoração textual isolada sem esconder rótulos úteis.
html = html.replace(/>([^<>]*[↗↓←→×✦⌁◈✉◉☷?][^<>]*)</g, (trecho, texto) => '>' + texto.replace(/[↗↓←→×✦⌁◈✉◉☷?]/g, simbolo => '<span aria-hidden="true">' + simbolo + '</span>') + '<');
fs.writeFileSync(raiz + 'catalogo_estoque_proto1.html', html);
fs.appendFileSync(raiz + 'css_style/refinamentos.css', `
/* Acessibilidade: diálogo com rolagem própria e alvos de toque consistentes. */
#boas-vindas[hidden]{display:none!important}
#boas-vindas{overflow-y:auto;overscroll-behavior:contain;align-items:safe center}
#boas-vindas .boas-vindas-conteudo{margin-block:auto}
body[data-pagina="catalogo"] :is(button,a[href],[role="button"]){min-width:48px;min-height:48px}
body[data-pagina="catalogo"] :is(nav,.rodape,.boas-vindas) a[href]{display:inline-flex;align-items:center;justify-content:center}
body[data-pagina="catalogo"] :is(a,button,[tabindex]):focus-visible{outline:3px solid var(--foco,#b97919);outline-offset:4px}
body[data-pagina="catalogo"] .trilho-subcategorias{grid-template-columns:48px minmax(0,1fr) 48px}
@media(forced-colors:active){body[data-pagina="catalogo"] :is(a,button,[tabindex]):focus-visible{outline-color:Highlight}}
`);
