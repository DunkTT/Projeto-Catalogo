const path = require("node:path");
const projetoWork = path.resolve(__dirname, "../..");
const fs = require('node:fs');
const caminho = path.join(projetoWork, "catalogo-web", "js", "catalogo.js");
let codigo = fs.readFileSync(caminho, 'utf8');
function trocar(inicio, fim, novo) {
  const de = codigo.indexOf(inicio), ate = codigo.indexOf(fim, de);
  if (de < 0 || ate < 0) throw new Error(inicio);
  codigo = codigo.slice(0, de) + novo + codigo.slice(ate);
}
codigo = codigo.replace('consultaAnterior = { produtos: resultados.slice', 'consultaAnterior = { anteriores: resultados.slice(Math.max(0, pagina - 2) * atual.porPagina, (pagina - 1) * atual.porPagina), seguintes: resultados.slice(pagina * atual.porPagina, (pagina + 1) * atual.porPagina), produtos: resultados.slice');
trocar('  function transicionarParceiro(', '  function selecionarAbaDoParceiro(', `  const animacoesDosTrilhos = new Map();
  function cancelarTrilho(trilho) {
    const animacao = animacoesDosTrilhos.get(trilho);
    if (animacao) { animacao.cancel(); animacoesDosTrilhos.delete(trilho); }
  }
  function deslizarTrilho(trilho, direcao, concluir) {
    if (animacoesDosTrilhos.has(trilho)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { concluir(); return; }
    const passo = trilho.children[1].getBoundingClientRect().width + 16;
    const posicaoInicial = getComputedStyle(trilho).transform;
    const matriz = new DOMMatrixReadOnly(posicaoInicial);
    const animacao = trilho.animate([{ transform: posicaoInicial }, { transform: "translateX(" + (matriz.m41 - Math.sign(direcao) * passo) + "px)" }], { duration: 620, easing: "cubic-bezier(.22,.72,.18,1)", fill: "forwards" });
    animacoesDosTrilhos.set(trilho, animacao);
    animacao.onfinish = () => { animacoesDosTrilhos.delete(trilho); concluir(); animacao.cancel(); };
  }
  function transicionarParceiro(direcao, alterarSelecao) {
    deslizarTrilho(obterElemento("trilho-parceiros"), direcao, () => { alterarSelecao(); renderizarParceiro(); });
  }
  function renderizarPreviasDoParceiro() {
    const descoberta = modoParceiros === "descobrir" && pacotesDeParceiros.length > 0;
    const colecao = descoberta ? pacotesDeParceiros : linhasDosParceiros;
    const indice = descoberta ? indiceDoPacote : indiceDoParceiro;
    for (const [lado, passo] of [["anterior", -1], ["proxima", 1]]) {
      const botao = obterElemento("previa-parceiro-" + lado);
      const item = colecao[(indice + passo + colecao.length) % colecao.length];
      if (!item) continue;
      const titulo = descoberta ? item.titulo : item.linha.nome;
      const marca = descoberta ? "Descobrir juntos" : item.parceiro.nome;
      const midia = criarElemento("span", "midia-parceiro");
      midia.append(criarElemento("span", "simbolo-parceiro", descoberta ? "✦" : item.parceiro.simbolo));
      midia.append(criarElemento("small", "", descoberta ? item.produtos.map(produto => configuracao.parceiros.find(marca => marca.identificador === produto.marcaId)?.nome).join(" · ") : "Imagem da marca em preparação"));
      const conteudo = criarElemento("span", "conteudo-parceiro");
      conteudo.append(criarElemento("span", "marca-parceiro", marca), criarElemento("strong", "titulo-banner-vizinho", titulo), criarElemento("span", "descricao-banner-vizinho", descoberta ? item.descricao : item.linha.descricao));
      botao.replaceChildren(midia, conteudo);
      botao.setAttribute("aria-label", (passo < 0 ? "Anterior: " : "Próxima: ") + titulo);
    }
  }
`);
// A ordem permanece estável durante cada passagem: a prévia vista é o próximo banner real.
trocar('      if (proximo === 0 && deslocamento > 0) {', '      indiceDoPacote = proximo;', '');
const inicioCartao = codigo.indexOf('    obterElemento("grade").replaceChildren(...resultados.map(produto => {');
const fimCartao = codigo.indexOf('    const inicio = total ?', inicioCartao);
const corpoCartao = codigo.slice(inicioCartao, fimCartao).replace('    obterElemento("grade").replaceChildren(...resultados.map(produto => {', '').replace(/\s*\}\)\);\s*$/, '');
codigo = codigo.slice(0, inicioCartao) + '    preencherPaginasDaGrade(atual);\n' + codigo.slice(fimCartao);
codigo = codigo.replace('  function renderizarCatalogo(atual) {', '  function criarCartaoDoCatalogo(produto, atual) {' + corpoCartao + '\n  }\n' + `
  function preencherPaginasDaGrade(atual) {
    const trilho = obterElemento("trilho-produtos");
    cancelarTrilho(trilho);
    for (const [id, itens] of [["grade", atual.consulta.produtos], ["grade-anterior", atual.consulta.anteriores], ["grade-seguinte", atual.consulta.seguintes]]) {
      obterElemento(id).replaceChildren(...itens.map(produto => criarCartaoDoCatalogo(produto, atual)));
    }
    obterElemento("pagina-grade-anterior").setAttribute("aria-disabled", String(atual.consulta.pagina <= 1));
    obterElemento("pagina-grade-seguinte").setAttribute("aria-disabled", String(atual.consulta.pagina >= atual.consulta.totalPaginas));
  }
  function paginarComMovimento(passo) {
    const consulta = estadoAtualParaNavegacao?.consulta;
    if (!consulta || consulta.pagina + passo < 1 || consulta.pagina + passo > consulta.totalPaginas) return;
    deslizarTrilho(obterElemento("trilho-produtos"), passo, () => estado.mudarPagina(passo));
  }
  function prepararTrilhos() {
    const palco = obterElemento("palco-parceiro"), janela = palco.parentElement;
    janela.classList.add("janela-trilho");
    const trilho = criarElemento("div", "trilho-continuo"); trilho.id = "trilho-parceiros";
    trilho.append(obterElemento("previa-parceiro-anterior"), palco, obterElemento("previa-parceiro-proxima")); janela.append(trilho);
    const grade = obterElemento("grade"), janelaGrade = criarElemento("div", "janela-trilho janela-produtos");
    const trilhoGrade = criarElemento("div", "trilho-continuo"); trilhoGrade.id = "trilho-produtos";
    grade.before(janelaGrade); janelaGrade.append(trilhoGrade);
    for (const [lado, passo] of [["anterior", -1], ["seguinte", 1]]) {
      const pagina = criarElemento("div", "pagina-grade-vizinha"); pagina.id = "pagina-grade-" + lado;
      pagina.setAttribute("role", "button"); pagina.tabIndex = 0; pagina.setAttribute("aria-label", passo < 0 ? "Página anterior de produtos" : "Próxima página de produtos");
      const previa = criarElemento("div", "grade"); previa.id = "grade-" + lado; previa.inert = true; previa.setAttribute("aria-hidden", "true"); pagina.append(previa);
      pagina.addEventListener("click", () => paginarComMovimento(passo));
      pagina.addEventListener("keydown", evento => { if (["Enter", " "].includes(evento.key)) { evento.preventDefault(); paginarComMovimento(passo); } });
      trilhoGrade.append(pagina);
      if (passo < 0) trilhoGrade.append(grade);
    }
    habilitarArrasteDeSlides(janela, passo => { moverParceiro(passo); iniciarParceiros(); });
    habilitarArrasteDeSlides(janelaGrade, paginarComMovimento);
  }
  function renderizarCatalogo(atual) {`);
codigo = codigo.replace('    renderizarLogo(); renderizarPainel();', '    prepararTrilhos();\n    renderizarLogo(); renderizarPainel();');
codigo = codigo.replace('    habilitarArrasteDeSlides(obterElemento("palco-parceiro"), deslocamento => { moverParceiro(deslocamento); iniciarParceiros(); });\n', '');
codigo = codigo.replace('() => estado.mudarPagina(-1)', '() => paginarComMovimento(-1)').replace('() => estado.mudarPagina(1)', '() => paginarComMovimento(1)');
codigo = codigo.replace('["catalogo", "navegar", "paginar"].includes(motivo)', '["catalogo", "navegar"].includes(motivo)');
codigo = codigo.replace('    const grade = obterElemento("grade"); grade.classList.remove("revelando"); void grade.offsetWidth; grade.classList.add("revelando");', '');
fs.writeFileSync(caminho, codigo);
