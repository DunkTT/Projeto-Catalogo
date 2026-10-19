// Integra a prévia local, o contrato validado e duas instâncias do motor existente.
// Mantém os controles fora das cenas e suspende efeitos fora de vista.
"use strict";
(() => {
  const controles = document.querySelectorAll("fieldset");
  const mensagem = document.getElementById("estado");
  const tom = document.getElementById("tom");
  const apoio = document.getElementById("apoio");
  const qualidade = document.getElementById("qualidade");
  const arquivo = document.getElementById("arquivo-cena");
  const estadoApoio = document.getElementById("estado-apoio");
  const ROTULOS_TOM = { quente: "Quente", neutro: "Neutra", frio: "Fria" };
  const LIMITE_JSON_BYTES = 65536;
  const eventos = new AbortController();
  const instancias = [];
  let documento;
  let versaoDaLeitura = 0;
  const movimentoReduzido = matchMedia("(prefers-reduced-motion: reduce)");
  const observador = new IntersectionObserver(entradas => {
    for (const entrada of entradas) {
      const instancia = instancias.find(item => item.recipiente === entrada.target);
      if (!instancia) continue;
      instancia.visivel = entrada.isIntersecting;
      atualizarSuspensao(instancia);
    }
  });

  function informarErro(erro) {
    mensagem.textContent = `Não foi possível aplicar a cena: ${erro.message}`;
    console.error("Prévia da sala:", erro);
  }
  function atualizarSuspensao(instancia) {
    instancia.motor.suspender(document.hidden || !instancia.visivel);
  }
  function prepararApresentacao(contrato) {
    const svg = document.getElementById("arte-sala").content.querySelector("svg").cloneNode(true);
    // O SVG fica isolado para que os IDs e estilos das duas cenas não colidam.
    svg.querySelector("style").textContent = svg.querySelector("style").textContent.replace(":root", "svg");
    svg.style.cssText = "display:block;width:100%;height:auto";
    SalaUltraled.validarContrato(contrato, svg);
    const temApoio = contrato.cena.fontes.some(fonte => fonte.id === "luz-apoio");
    if (!temApoio) {
      svg.querySelector("#luminaria-apoio").style.display = "none";
      svg.querySelector("desc").textContent = "Sala de estar com sofá, mesa, janela e uma luminária central. Visualização ilustrativa.";
    }
    const renderizador = SalaUltraled.criarRenderizador(svg, contrato);
    SalaUltraled.verificarCapacidades(contrato.capacidadesExigidas, renderizador);
    return { svg, renderizador };
  }
  function criarInstancia(recipiente) {
    const raiz = recipiente.attachShadow({ mode: "open" });
    const { svg, renderizador } = prepararApresentacao(documento);
    const motor = Iluminacao.criarMotor({ renderizador });
    motor.definirCena(documento.cena);
    raiz.append(svg);
    recipiente.querySelector("img")?.remove();
    const instancia = { recipiente, svg, motor, visivel: false };
    instancias.push(instancia);
    observador.observe(recipiente);
  }
  function sincronizarControles() {
    const principal = documento.cena.fontes.find(fonte => fonte.id === "luz-principal");
    const tonsPermitidos = documento.opcoesPermitidas[principal.id].tons;
    const tonsExibidos = [...tom.options].map(opcao => opcao.value);
    if (JSON.stringify(tonsExibidos) !== JSON.stringify(tonsPermitidos)) {
      tom.replaceChildren(...tonsPermitidos.map(valor => new Option(ROTULOS_TOM[valor], valor)));
    }
    tom.value = principal.tom;
    const fonteApoio = documento.cena.fontes.find(fonte => fonte.id === "luz-apoio");
    const intensidades = documento.opcoesPermitidas[fonteApoio?.id]?.intensidades || [];
    const podeAlternar = intensidades.includes(0) && intensidades.some(valor => valor > 0);
    apoio.hidden = !fonteApoio;
    apoio.disabled = !podeAlternar;
    const ligada = Boolean(fonteApoio && fonteApoio.intensidade > 0);
    apoio.setAttribute("aria-checked", String(ligada));
    estadoApoio.textContent = ligada ? "Ligada" : "Desligada";
  }
  function substituirApresentacoes(proximo) {
    // Prepara todas as cenas antes de limpar as atuais: JSON inválido mantém a prévia.
    const apresentacoes = instancias.map(() => prepararApresentacao(proximo));
    instancias.forEach((instancia, indice) => {
      const { svg, renderizador } = apresentacoes[indice];
      instancia.motor.suspender(true);
      instancia.motor.definirRenderizador(renderizador);
      instancia.motor.definirCena(proximo.cena);
      instancia.recipiente.shadowRoot.replaceChildren(svg);
      instancia.svg = svg;
      atualizarSuspensao(instancia);
    });
  }
  function aplicarDocumento(proximo, substituir = false) {
    for (const instancia of instancias) SalaUltraled.validarContrato(proximo, instancia.svg);
    if (substituir) substituirApresentacoes(proximo);
    else for (const instancia of instancias) instancia.motor.definirCena(proximo.cena);
    documento = proximo;
    sincronizarControles();
    mensagem.textContent = qualidade.value === "desligado" ? "Cena aplicada · efeitos desligados." : "Cena aplicada.";
  }
  function alterarFonte(identificador, alteracoes) {
    try {
      const proximo = JSON.parse(JSON.stringify(documento));
      Object.assign(proximo.cena.fontes.find(fonte => fonte.id === identificador), alteracoes);
      aplicarDocumento(proximo);
    } catch (erro) {
      sincronizarControles();
      informarErro(erro);
    }
  }
  async function importarContrato() {
    const selecionado = arquivo.files[0];
    const leituraAtual = ++versaoDaLeitura;
    if (!selecionado) return;
    mensagem.textContent = "Lendo cena…";
    try {
      if (selecionado.size > LIMITE_JSON_BYTES) throw new RangeError("O JSON excede 64 KiB.");
      const conteudo = await selecionado.text();
      if (leituraAtual !== versaoDaLeitura || eventos.signal.aborted) return;
      aplicarDocumento(JSON.parse(conteudo), true);
    } catch (erro) {
      if (leituraAtual === versaoDaLeitura) informarErro(erro);
    } finally {
      if (leituraAtual === versaoDaLeitura) arquivo.value = "";
    }
  }
  function registrarEventos() {
    const opcoes = { signal: eventos.signal };
    tom.addEventListener("change", () => alterarFonte("luz-principal", { tom: tom.value }), opcoes);
    apoio.addEventListener("click", () => {
      const ligada = apoio.getAttribute("aria-checked") === "true";
      const intensidades = documento.opcoesPermitidas["luz-apoio"]?.intensidades || [];
      const intensidade = ligada ? intensidades.find(valor => valor === 0) : intensidades.find(valor => valor > 0);
      if (intensidade !== undefined) alterarFonte("luz-apoio", { intensidade });
    }, opcoes);
    qualidade.addEventListener("change", () => {
      for (const instancia of instancias) instancia.motor.definirQualidade(qualidade.value);
      mensagem.textContent = qualidade.value === "desligado" ? "Efeitos desligados." : "Qualidade aplicada.";
    }, opcoes);
    arquivo.addEventListener("change", importarContrato, opcoes);
    document.addEventListener("visibilitychange", () => instancias.forEach(atualizarSuspensao), opcoes);
    movimentoReduzido.addEventListener("change", () => {
      for (const instancia of instancias) {
        instancia.motor.suspender(true);
        atualizarSuspensao(instancia);
      }
    }, opcoes);
    window.addEventListener("pagehide", evento => {
      if (evento.persisted) instancias.forEach(item => item.motor.suspender(true));
      else destruir();
    }, opcoes);
    window.addEventListener("pageshow", () => instancias.forEach(atualizarSuspensao), opcoes);
  }
  function destruir() {
    eventos.abort();
    observador.disconnect();
    for (const instancia of instancias) instancia.motor.destruir();
  }
  try {
    iniciarInterruptorTema();
    documento = JSON.parse(document.getElementById("contrato-sala").textContent);
    document.querySelectorAll(".palco").forEach(criarInstancia);
    sincronizarControles();
    registrarEventos();
    for (const grupo of controles) grupo.disabled = false;
    mensagem.textContent = "Sala pronta. Escolha a iluminação.";
  } catch (erro) {
    destruir();
    informarErro(erro);
  }
})();
