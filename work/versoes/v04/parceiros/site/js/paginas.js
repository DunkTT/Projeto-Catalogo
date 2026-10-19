"use strict";

function iniciarTemaDasPaginas() {
  const botao = document.getElementById("alternar-tema");
  let tema = "escuro";
  try { tema = localStorage.getItem("catalogo.tema") === "claro" ? "claro" : "escuro"; } catch { /* Preferência opcional. */ }
  function aplicar() {
    document.documentElement.dataset.tema = tema;
    botao.textContent = tema === "claro" ? "Tema escuro" : "Tema claro";
    botao.setAttribute("aria-label", `Ativar tema ${tema === "claro" ? "escuro" : "claro"}`);
    botao.setAttribute("aria-pressed", String(tema === "claro"));
  }
  botao.addEventListener("click", () => { tema = tema === "claro" ? "escuro" : "claro"; try { localStorage.setItem("catalogo.tema", tema); } catch { /* Continua nesta sessão. */ } aplicar(); });
  aplicar();
}

function iniciarHub() {
  const produtos = typeof dadosDoEstoque === "undefined" ? [] : dadosDoEstoque.produtos;
  document.getElementById("resumo-hub").textContent = `${produtos.length.toLocaleString("pt-BR")} produtos cadastrados para explorar`;
  const etapas = [
    ["Olá!", "Bem-vindo ao nosso espaço."],
    ["Explore com calma.", "Encontre o que faz sentido para o seu projeto."],
    ["Compare possibilidades.", "Veja cores, acabamentos e detalhes dos produtos."],
    ["O espaço é seu.", "Tudo pronto para descobrir o catálogo."]
  ];
  const abertura = document.getElementById("abertura-hub");
  try { if (sessionStorage.getItem("catalogo.aberturaVista") === "sim") { abertura.hidden = true; document.getElementById("conteudo-principal").inert = false; return; } } catch { /* A apresentação segue normalmente. */ }
  const marcadores = document.getElementById("marcadores-hub");
  marcadores.replaceChildren(...etapas.map(() => document.createElement("span")));
  let indice = 0, temporizador = null;
  function mostrar() {
    const texto = document.getElementById("texto-abertura");
    texto.classList.remove("entrando");
    document.getElementById("numero-abertura").textContent = `${String(indice + 1).padStart(2, "0")} / ${String(etapas.length).padStart(2, "0")}`;
    document.getElementById("titulo-abertura").textContent = etapas[indice][0];
    document.getElementById("descricao-abertura").textContent = etapas[indice][1];
    [...marcadores.children].forEach((marcador, posicao) => marcador.classList.toggle("ativo", posicao <= indice));
    void texto.offsetWidth; texto.classList.add("entrando");
  }
  function encerrar() {
    if (temporizador) clearTimeout(temporizador);
    abertura.hidden = true;
    document.getElementById("conteudo-principal").inert = false;
    try { sessionStorage.setItem("catalogo.aberturaVista", "sim"); } catch { /* Acesso local opcional. */ }
    document.querySelector(".acao-principal").focus({ preventScroll: true });
  }
  document.getElementById("entrar-hub").addEventListener("click", encerrar);
  document.getElementById("pular-hub").addEventListener("click", encerrar);
  abertura.addEventListener("keydown", evento => { if (evento.key === "Escape") encerrar(); });
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) indice = etapas.length - 1;
  mostrar();
  if (indice === 0) {
    const avancar = () => { if (indice >= etapas.length - 1) return; indice++; mostrar(); temporizador = window.setTimeout(avancar, 1450); };
    temporizador = window.setTimeout(avancar, 1450);
  }
  document.getElementById("entrar-hub").focus();
}

function iniciarOficina() {
  const grade = document.getElementById("grade-oficina");
  const secoes = configuracaoDeApoio.oficina.secoes;
  for (const secao of secoes) {
    const cartao = document.createElement("article"); cartao.className = "cartao-oficina";
    const simbolo = document.createElement("span"); simbolo.className = "simbolo-oficina"; simbolo.textContent = secao.simbolo;
    const titulo = document.createElement("h3"); titulo.textContent = secao.titulo;
    const descricao = document.createElement("p"); descricao.textContent = secao.descricao;
    cartao.append(simbolo, titulo, descricao);
    const ferramentas = (secao.ferramentas || []).filter(item => item.nome && /^(?:\.\/?|https:\/\/)/i.test(item.url || ""));
    if (ferramentas.length) {
      const lista = document.createElement("div"); lista.className = "ferramentas-oficina";
      for (const ferramenta of ferramentas) {
        const link = document.createElement("a"); link.textContent = `${ferramenta.nome} ↗`; link.href = ferramenta.url;
        if (link.protocol === "https:") { link.target = "_blank"; link.rel = "noopener noreferrer"; }
        lista.append(link);
      }
      cartao.append(lista);
    } else { const aviso = document.createElement("span"); aviso.className = "oficina-em-breve"; aviso.textContent = "Em preparação"; cartao.append(aviso); }
    grade.append(cartao);
  }
}

async function iniciarPaginas() {
  iniciarTemaDasPaginas();
  if (document.body.dataset.pagina === "inicio") iniciarHub();
  if (document.body.dataset.pagina === "oficina") iniciarOficina();
}
void iniciarPaginas();
