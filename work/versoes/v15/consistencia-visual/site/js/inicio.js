"use strict";

// Integra tema, cabeçalho e iluminação da entrada sem carregar produtos.
(() => {
  const movimentoReduzido = matchMedia("(prefers-reduced-motion: reduce)");
  const DURACAO_RESPOSTA = 300, INTERVALO_CENA = 14000;
  function iniciarCabecalho() {
    const cabecalho = document.querySelector(".cabecalho");
    const raiz = document.documentElement, celular = matchMedia("(max-width:750px)");
    const LIMIAR_RECOLHER = 120, LIMIAR_EXPANDIR = 16, DISTANCIA_GESTO = 8;
    let referencia = Math.max(0, scrollY), quadro = null;
    function atualizar() {
      quadro = null;
      const posicao = Math.max(0, scrollY), diferenca = posicao - referencia;
      let oculto = raiz.dataset.cabecalhoOculto === "true";
      if (celular.matches) {
        cabecalho.dataset.recolhido = "false";
        if (posicao <= LIMIAR_EXPANDIR || cabecalho.contains(document.activeElement)) oculto = false;
        else if (Math.abs(diferenca) >= DISTANCIA_GESTO) oculto = diferenca > 0;
      } else {
        oculto = false;
        if (posicao > LIMIAR_RECOLHER) cabecalho.dataset.recolhido = "true";
        else if (posicao < LIMIAR_EXPANDIR) cabecalho.dataset.recolhido = "false";
      }
      raiz.dataset.cabecalhoOculto = String(oculto);
      cabecalho.inert = oculto;
      if (Math.abs(diferenca) >= DISTANCIA_GESTO || posicao <= LIMIAR_EXPANDIR) referencia = posicao;
    }
    const medir = () => raiz.style.setProperty("--altura-cabecalho", cabecalho.getBoundingClientRect().height + "px");
    new ResizeObserver(medir).observe(cabecalho);
    addEventListener("scroll", () => { if (quadro === null) quadro = requestAnimationFrame(atualizar); }, { passive: true });
    celular.addEventListener("change", atualizar);
    atualizar(); medir();
  }

  function iniciarSuporte() {
    const botoes = [...document.querySelectorAll("[data-painel]")];
    function mostrar(botao, aberto) {
      const painel = document.getElementById(botao.dataset.painel);
      painel.hidden = !aberto; botao.setAttribute("aria-expanded", String(aberto));
      if (aberto) { painel.focus({ preventScroll: true }); painel.scrollIntoView({ behavior: movimentoReduzido.matches ? "instant" : "smooth", block: "start" }); }
    }
    botoes.forEach(botao => botao.addEventListener("click", () => {
      const abrir = botao.getAttribute("aria-expanded") !== "true";
      botoes.forEach(outro => mostrar(outro, false));
      mostrar(botao, abrir);
    }));
    document.querySelectorAll("[data-fechar-painel]").forEach(fechar => fechar.addEventListener("click", () => {
      const botao = botoes.find(item => item.dataset.painel === fechar.dataset.fecharPainel);
      mostrar(botao, false); botao.focus();
    }));
  }

  // Cores ilustrativas locais: não alteram os presets ou temperaturas do catálogo.
  const PRESETS_ENTRADA = {
    quente: { nome: "Branco quente", corVisual: "#ffb975", temperaturaReferencia: 3000 },
    neutro: { nome: "Branco neutro", corVisual: "#fff4df", temperaturaReferencia: 4000 },
    frio: { nome: "Branco frio", corVisual: "#c1dfff", temperaturaReferencia: 6000 }
  };
  const CENAS_JANELA = [
    { periodo: "dia", estacao: "primavera", clima: "nublado", tom: "neutro" },
    { periodo: "noite", estacao: "primavera", clima: "chuva", tom: "quente" },
    { periodo: "dia", estacao: "verao", clima: "limpo", tom: "frio" },
    { periodo: "noite", estacao: "verao", clima: "limpo", tom: "neutro" },
    { periodo: "dia", estacao: "outono", clima: "nublado", tom: "quente" },
    { periodo: "noite", estacao: "outono", clima: "chuva", tom: "frio" },
    { periodo: "dia", estacao: "inverno", clima: "neve", tom: "neutro" },
    { periodo: "noite", estacao: "inverno", clima: "neve", tom: "quente" }
  ];

  function escolherTomDaVisita() {
    let tom = "neutro";
    try {
      tom = sessionStorage.getItem("experiencia.ultimoTom") === "neutro" ? "frio" : "neutro";
      sessionStorage.setItem("experiencia.ultimoTom", tom);
    } catch { /* Sem armazenamento, mantém 4000 K nesta visita. */ }
    return tom;
  }

  function criarLuz(elemento, tom, brilho) {
    const motor = Iluminacao.criarMotor({
      renderizador: Iluminacao.criarRenderizadorCSS(elemento), presets: PRESETS_ENTRADA
    });
    motor.atualizar({ tom, brilho }); motor.suspender(false);
    return motor;
  }

  function prepararBotaoLuminoso(link, tom) {
    const BRILHO_REPOUSO = 0, BRILHO_FOCO = 18, BRILHO_CLIQUE = 30;
    const motor = criarLuz(link, tom, BRILHO_REPOUSO);
    let sobre = false, pressionado = false, navegando = false;
    function atualizar() {
      const focado = link.matches(":focus-visible");
      motor.atualizar({ brilho: pressionado ? BRILHO_CLIQUE : sobre || focado ? BRILHO_FOCO : BRILHO_REPOUSO });
    }
    link.addEventListener("pointerenter", evento => { sobre = evento.pointerType === "mouse"; atualizar(); });
    link.addEventListener("pointerleave", () => { sobre = false; if (!navegando) pressionado = false; atualizar(); });
    link.addEventListener("pointerdown", evento => { if (evento.button === 0) { pressionado = true; atualizar(); } });
    link.addEventListener("pointerup", () => { pressionado = false; atualizar(); });
    link.addEventListener("pointercancel", () => { pressionado = false; sobre = false; atualizar(); });
    link.addEventListener("focus", atualizar);
    link.addEventListener("blur", () => { pressionado = false; atualizar(); });
    link.addEventListener("click", evento => {
      if (evento.ctrlKey || evento.metaKey || evento.shiftKey || evento.altKey || evento.button !== 0 || movimentoReduzido.matches) return;
      evento.preventDefault();
      if (navegando) return;
      navegando = true; pressionado = true; atualizar();
      setTimeout(() => { navegando = false; pressionado = false; sobre = false; atualizar(); location.assign(link.href); }, DURACAO_RESPOSTA);
    });
    return motor;
  }

  function aplicarCena(cena, indice, luzes) {
    const atual = CENAS_JANELA[indice];
    cena.dataset.periodo = atual.periodo;
    cena.dataset.estacao = atual.estacao;
    cena.dataset.clima = atual.clima;
    cena.dataset.temperatura = String(PRESETS_ENTRADA[atual.tom].temperaturaReferencia);
    for (const [tom, motor] of Object.entries(luzes)) motor.atualizar({ brilho: tom === atual.tom ? 46 : 0 });
  }

  function iniciarLuzes() {
    const cena = document.querySelector(".previa-ambiente"), tomDaVisita = escolherTomDaVisita();
    const luzes = {
      quente: criarLuz(cena.querySelector(".luz-ambiente-quente"), "quente", 0),
      neutro: criarLuz(cena.querySelector(".luz-ambiente-neutra"), "neutro", 0),
      frio: criarLuz(cena.querySelector(".luz-ambiente-fria"), "frio", 0)
    };
    const cabecalho = criarLuz(document.querySelector(".cabecalho"), tomDaVisita, 22);
    const botoes = [...document.querySelectorAll(".acao-luminosa")].map(link => prepararBotaoLuminoso(link, tomDaVisita));
    let indice = tomDaVisita === "neutro" ? 0 : 2, visivel = true, temporizador = null;
    const motores = [...Object.values(luzes), cabecalho, ...botoes];
    function sincronizar() {
      clearInterval(temporizador); temporizador = null;
      const suspenso = document.hidden || !visivel;
      cena.dataset.pausada = String(suspenso || movimentoReduzido.matches);
      Object.values(luzes).forEach(motor => motor.suspender(suspenso));
      [cabecalho, ...botoes].forEach(motor => motor.suspender(document.hidden));
      if (!suspenso && !movimentoReduzido.matches) temporizador = setInterval(() => {
        indice = (indice + 1) % CENAS_JANELA.length; aplicarCena(cena, indice, luzes);
      }, INTERVALO_CENA);
    }
    aplicarCena(cena, indice, luzes);
    new IntersectionObserver(entradas => { visivel = entradas[0].isIntersecting; sincronizar(); }).observe(document.querySelector(".intro-experiencia"));
    document.addEventListener("visibilitychange", sincronizar);
    movimentoReduzido.addEventListener("change", sincronizar);
    addEventListener("pagehide", () => { clearInterval(temporizador); motores.forEach(motor => motor.suspender()); });
    addEventListener("pageshow", sincronizar);
    sincronizar();
  }

  iniciarInterruptorTema(); iniciarCabecalho(); iniciarSuporte();
  try { iniciarLuzes(); } catch (erro) { console.error("Iluminação da entrada indisponível:", erro); }
})();
