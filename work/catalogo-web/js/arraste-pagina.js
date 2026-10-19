"use strict";

// Permite rolar páginas e detalhes do produto arrastando com mouse ou caneta.
// No toque, o navegador mantém a rolagem vertical, a inércia e o zoom nativos.
(() => {
  const ALVO_INTERATIVO = "a, button, input, select, textarea, summary, [contenteditable], [role='button'], [data-gesto], .painel-filtros";
  const DISTANCIA_MINIMA = 8;
  function habilitarArrasteVertical(elemento, obterAreaRolavel) {
    if (!elemento) return;
    let gesto = null, bloquearCliqueAte = 0;

    function encerrar(evento) {
      if (!gesto || (evento instanceof PointerEvent && evento.pointerId !== gesto.identificador)) return;
      const identificador = gesto.identificador;
      if (gesto.ativo) bloquearCliqueAte = performance.now() + 350;
      gesto = null;
      elemento.classList.remove("arrastando-vertical");
      if (elemento.hasPointerCapture(identificador)) elemento.releasePointerCapture(identificador);
    }

    elemento.addEventListener("pointerdown", evento => {
      if (gesto || !evento.isPrimary || evento.button !== 0 || evento.pointerType === "touch") return;
      if (evento.target.closest(ALVO_INTERATIVO)) return;
      const areaRolavel = obterAreaRolavel();
      if (!areaRolavel || areaRolavel.scrollHeight <= areaRolavel.clientHeight) return;
      bloquearCliqueAte = 0;
      gesto = { identificador: evento.pointerId, inicioX: evento.clientX, inicioY: evento.clientY,
        ultimoY: evento.clientY, ativo: false };
    });

    elemento.addEventListener("pointermove", evento => {
      if (!gesto || gesto.identificador !== evento.pointerId) return;
      const distanciaX = evento.clientX - gesto.inicioX;
      const distanciaY = evento.clientY - gesto.inicioY;
      if (!gesto.ativo) {
        if (Math.max(Math.abs(distanciaX), Math.abs(distanciaY)) < DISTANCIA_MINIMA) return;
        if (Math.abs(distanciaX) > Math.abs(distanciaY)) { encerrar(); return; }
        gesto.ativo = true;
        elemento.setPointerCapture(evento.pointerId);
        elemento.classList.add("arrastando-vertical");
      }
      evento.preventDefault();
      obterAreaRolavel().scrollBy({ top: gesto.ultimoY - evento.clientY, behavior: "auto" });
      gesto.ultimoY = evento.clientY;
    }, { passive: false });

    elemento.addEventListener("pointerup", encerrar);
    elemento.addEventListener("pointercancel", encerrar);
    elemento.addEventListener("lostpointercapture", encerrar);
    window.addEventListener("pointerup", encerrar);
    window.addEventListener("blur", encerrar);
    elemento.addEventListener("dragstart", evento => {
      if (gesto && !evento.target.closest(ALVO_INTERATIVO)) evento.preventDefault();
    });
    elemento.addEventListener("click", evento => {
      if (evento.detail !== 0 && performance.now() < bloquearCliqueAte) {
        evento.preventDefault();
        evento.stopImmediatePropagation();
      }
    }, true);
  }

  habilitarArrasteVertical(document.querySelector(".pagina, .painel"), () => document.scrollingElement);
  const detalhesDoProduto = document.getElementById("modal");
  if (detalhesDoProduto) habilitarArrasteVertical(detalhesDoProduto, () => detalhesDoProduto);
})();
