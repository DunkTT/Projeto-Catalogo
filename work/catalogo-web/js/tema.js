"use strict";
// Mantém o mesmo interruptor de tema nas páginas públicas do catálogo.
// O estado persiste no navegador quando o armazenamento está disponível.
globalThis.iniciarInterruptorTema = function (botao = document.getElementById("alternar-tema")) {
  if (!botao) return;
  let claro = false;
  try { claro = localStorage.getItem("catalogo.tema") === "claro"; }
  catch { /* A troca continua disponível nesta página. */ }

  function aplicarTema() {
    document.documentElement.dataset.tema = claro ? "claro" : "escuro";
    botao.setAttribute("aria-checked", String(claro));
    botao.querySelector(".pino-interruptor").textContent = claro ? "☀" : "☾";
  }

  botao.addEventListener("click", () => {
    claro = !claro;
    aplicarTema();
    try { localStorage.setItem("catalogo.tema", claro ? "claro" : "escuro"); }
    catch { /* A troca continua disponível nesta página. */ }
  });
  aplicarTema();
  botao.disabled = false;
};
