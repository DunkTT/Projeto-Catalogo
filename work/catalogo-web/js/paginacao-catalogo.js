// Controla a apresentação e os gestos da paginação do catálogo.
// Os dados dos produtos e as mudanças de página continuam sob controle do catálogo.
"use strict";

function criarComponentePaginacaoDoCatalogo({ obterElemento, criarElemento, criarCartao, obterConsultaAtual, cancelarTrilho, deslizarTrilho, habilitarGesto, mudarPagina }) {
  function navegar(passo) {
    const consulta = obterConsultaAtual();
    if (!consulta || consulta.pagina + passo < 1 || consulta.pagina + passo > consulta.totalPaginas) return;
    deslizarTrilho(obterElemento("trilho-produtos"), passo, () => mudarPagina(passo));
  }

  function preparar() {
    obterElemento("anterior").addEventListener("click", () => navegar(-1));
    obterElemento("proxima").addEventListener("click", () => navegar(1));
    const grade = obterElemento("grade");
    const janela = criarElemento("div", "janela-trilho janela-produtos");
    const trilho = criarElemento("div", "trilho-continuo");
    trilho.id = "trilho-produtos";
    grade.before(janela);
    janela.append(trilho);

    for (const [lado, passo] of [["anterior", -1], ["seguinte", 1]]) {
      const pagina = criarElemento("div", "pagina-grade-vizinha");
      pagina.id = "pagina-grade-" + lado;
      pagina.setAttribute("role", "button");
      pagina.tabIndex = 0;
      pagina.setAttribute("aria-label", passo < 0 ? "Página anterior de produtos" : "Próxima página de produtos");
      const previa = criarElemento("div", "grade");
      previa.id = "grade-" + lado;
      previa.inert = true;
      previa.setAttribute("aria-hidden", "true");
      pagina.append(previa);
      pagina.addEventListener("click", () => navegar(passo));
      pagina.addEventListener("keydown", evento => {
        if (!["Enter", " "].includes(evento.key)) return;
        evento.preventDefault();
        navegar(passo);
      });
      trilho.append(pagina);
      if (passo < 0) trilho.append(grade);
    }

    habilitarGesto(janela, navegar);
  }

  function renderizar(atual) {
    const trilho = obterElemento("trilho-produtos");
    cancelarTrilho(trilho);
    for (const [id, itens] of [["grade", atual.consulta.produtos], ["grade-anterior", atual.consulta.anteriores], ["grade-seguinte", atual.consulta.seguintes]]) {
      const fragmento = document.createDocumentFragment();
      for (const produto of itens) fragmento.append(criarCartao(produto, atual));
      obterElemento(id).replaceChildren(fragmento);
    }
    obterElemento("pagina-grade-anterior").setAttribute("aria-disabled", String(atual.consulta.pagina <= 1));
    obterElemento("pagina-grade-seguinte").setAttribute("aria-disabled", String(atual.consulta.pagina >= atual.consulta.totalPaginas));
    obterElemento("anterior").disabled = atual.consulta.pagina <= 1;
    obterElemento("proxima").disabled = atual.consulta.pagina >= atual.consulta.totalPaginas;
    obterElemento("numero-pagina").textContent = `${atual.consulta.pagina} / ${atual.consulta.totalPaginas}`;
    obterElemento("paginacao").hidden = atual.consulta.total === 0;
  }

  return { navegar, preparar, renderizar };
}
