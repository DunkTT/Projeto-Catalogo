"use strict";

// A página e os links funcionam sem JavaScript; somente preferências e saudação dependem dele.
(() => {
  const botao = document.getElementById("alternar-tema");
  let tema = "escuro";
  try { tema = localStorage.getItem("catalogo.tema") === "claro" ? "claro" : "escuro"; } catch { /* Preferência opcional. */ }
  function aplicarTema() {
    document.documentElement.dataset.tema = tema;
    botao.textContent = tema === "claro" ? "Tema escuro" : "Tema claro";
    botao.setAttribute("aria-label", "Ativar " + botao.textContent.toLowerCase());
    botao.setAttribute("aria-pressed", String(tema === "claro"));
  }
  aplicarTema();
  botao.disabled = false;
  botao.addEventListener("click", () => {
    tema = tema === "claro" ? "escuro" : "claro";
    aplicarTema();
    try { localStorage.setItem("catalogo.tema", tema); } catch { /* Mantém o tema nesta visita. */ }
  });

  // A saudação permanece na mesma área; título e navegação nunca ficam cobertos.
  const saudacao = document.getElementById("saudacao");
  const movimentoReduzido = matchMedia("(prefers-reduced-motion: reduce)");
  const etapas = ["Explore com calma.", "Compare possibilidades.", "O espaço é seu. Vamos começar?"];
  let etapa = 0, temporizador = 0;
  function avancar() {
    if (document.hidden || movimentoReduzido.matches || etapa >= etapas.length) return;
    saudacao.textContent = etapas[etapa++];
    saudacao.animate([{ opacity: .65 }, { opacity: 1 }], { duration: 240, easing: "ease-out" });
    if (etapa < etapas.length) temporizador = setTimeout(avancar, 1800);
  }
  function interromper() { clearTimeout(temporizador); }
  if (!movimentoReduzido.matches) temporizador = setTimeout(avancar, 1800);
  document.addEventListener("visibilitychange", () => { if (document.hidden) interromper(); });
  movimentoReduzido.addEventListener("change", interromper);
})();
