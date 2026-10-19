"use strict";
// Relógio do laboratório: só agenda quadro enquanto o clipe está em curso.
LaboratorioLuz.criarMotor = function ({
  renderizador,
  misturador = LaboratorioLuz.amostrarEfeito,
  agendar = callback => requestAnimationFrame(callback),
  cancelar = id => cancelAnimationFrame(id)
} = {}) {
  if (!renderizador || typeof renderizador.renderizar !== "function" || typeof renderizador.limpar !== "function") {
    throw new TypeError("Renderizador requer renderizar e limpar.");
  }
  const observadores = new Set();
  let efeito = null, qualidade = "padrao", movimentoReduzido = false;
  let reproduzindo = false, suspenso = false, destruido = false;
  let inicioMs = 0, pausadoEm = 0, quadro = null, snapshot = null;

  function obterEstado() {
    return { efeito, qualidade, movimentoReduzido, reproduzindo, suspenso, snapshot };
  }
  function notificar() { for (const observar of observadores) observar(obterEstado()); }
  function cancelarPendente() { if (quadro !== null) cancelar(quadro); quadro = null; }

  function pintar(progressoBruto) {
    if (!efeito) return;
    snapshot = misturador(efeito, progressoBruto, { qualidade, movimentoReduzido });
    if (qualidade !== "desligado") renderizador.renderizar(snapshot);
    else renderizador.limpar();
    notificar();
  }

  function ciclo(agora) {
    quadro = null;
    if (destruido || suspenso || !reproduzindo || !efeito || qualidade === "desligado") return;
    const progressoBruto = (agora - inicioMs) / efeito.duracaoMs;
    pintar(progressoBruto);
    const terminou = !efeito.laco && progressoBruto >= 1;
    if (terminou || movimentoReduzido || qualidade === "economico") {
      reproduzindo = false;
      notificar();
      return;
    }
    quadro = agendar(ciclo);
  }

  function solicitar() {
    if (destruido || suspenso || !reproduzindo || !efeito || quadro !== null) return;
    if (qualidade === "desligado") { renderizador.limpar(); return; }
    if (movimentoReduzido || qualidade === "economico") {
      pintar(efeito.laco ? 0.55 : 1);
      reproduzindo = false;
      notificar();
      return;
    }
    quadro = agendar(ciclo);
  }

  return {
    obterEstado,
    carregar(novoEfeito) {
      if (destruido) return;
      efeito = novoEfeito;
      reproduzindo = false;
      pausadoEm = 0;
      cancelarPendente();
      pintar(0);
    },
    reproduzir() {
      if (destruido || !efeito) return;
      reproduzindo = true;
      suspenso = false;
      inicioMs = (typeof performance !== "undefined" ? performance.now() : Date.now()) - pausadoEm;
      pausadoEm = 0;
      cancelarPendente();
      solicitar();
      notificar();
    },
    pausar() {
      if (destruido || !reproduzindo) return;
      reproduzindo = false;
      cancelarPendente();
      const agora = typeof performance !== "undefined" ? performance.now() : Date.now();
      pausadoEm = agora - inicioMs;
      notificar();
    },
    definirQualidade(valor) {
      if (destruido) return;
      if (!LaboratorioLuz.regras.qualidades.includes(valor)) throw new RangeError("Qualidade desconhecida.");
      qualidade = valor;
      if (valor === "desligado") { cancelarPendente(); reproduzindo = false; renderizador.limpar(); }
      else if (efeito) pintar(snapshot ? snapshot.progresso : 0);
      notificar();
    },
    definirMovimentoReduzido(valor) {
      if (destruido) return;
      movimentoReduzido = Boolean(valor);
      cancelarPendente();
      if (efeito) pintar(snapshot ? snapshot.progresso : 0);
      reproduzindo = false;
      notificar();
    },
    suspender(valor = true) {
      if (destruido) return;
      suspenso = Boolean(valor);
      if (suspenso) { cancelarPendente(); renderizador.limpar(); }
      else solicitar();
      notificar();
    },
    observar(callback) {
      if (destruido) return () => {};
      observadores.add(callback);
      callback(obterEstado());
      return () => observadores.delete(callback);
    },
    destruir() {
      if (destruido) return;
      destruido = true;
      reproduzindo = false;
      cancelarPendente();
      renderizador.limpar();
      observadores.clear();
    }
  };
};
