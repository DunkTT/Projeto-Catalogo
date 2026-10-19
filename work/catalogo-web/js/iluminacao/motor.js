"use strict";
// Núcleo sem DOM, catálogo, armazenamento ou temporizador contínuo.
Iluminacao.criarMotor = function ({ renderizador, agendar = callback => requestAnimationFrame(callback), cancelar = id => cancelAnimationFrame(id), presets = Iluminacao.presets } = {}) {
  const observadores = new Set();
  let estado = { tom: "neutro", brilho: 70, ativo: true, qualidade: "padrao", cena: null };
  let quadro = null, suspenso = true, destruido = false;
  function validarRenderizador(valor) {
    if (!valor || typeof valor.renderizar !== "function" || typeof valor.limpar !== "function") throw new TypeError("Renderizador requer renderizar e limpar.");
  }
  validarRenderizador(renderizador);
  function cancelarPendente() { if (quadro !== null) cancelar(quadro); quadro = null; }
  function obterEstado() { return { ...estado, suspenso }; }
  function notificar() { for (const observar of observadores) observar(obterEstado()); }
  function solicitar() {
    if (destruido || suspenso || !estado.ativo || quadro !== null) return;
    quadro = agendar(() => {
      quadro = null;
      if (!destruido && !suspenso && estado.ativo) renderizador.renderizar({ ...obterEstado(), preset: presets[estado.tom] });
    });
  }
  function atualizar(alteracoes) {
    if (destruido) return;
    if (Object.keys(alteracoes).some(chave => !["tom", "brilho"].includes(chave))) throw new TypeError("Use as operações específicas para cena e qualidade.");
    const proximo = { ...estado };
    if (Object.hasOwn(alteracoes, "tom")) {
      if (!Object.hasOwn(presets, alteracoes.tom)) throw new RangeError("Tom desconhecido.");
      proximo.tom = alteracoes.tom;
    }
    if (Object.hasOwn(alteracoes, "brilho")) {
      if (typeof alteracoes.brilho !== "number" || !Number.isFinite(alteracoes.brilho)) throw new TypeError("Brilho deve ser finito.");
      proximo.brilho = Math.max(0, Math.min(100, alteracoes.brilho));
    }
    if (proximo.tom === estado.tom && proximo.brilho === estado.brilho) return;
    estado = proximo; notificar(); solicitar();
  }
  function congelar(valor) {
    if (valor && typeof valor === "object") { Object.values(valor).forEach(congelar); Object.freeze(valor); }
    return valor;
  }
  return {
    obterEstado, atualizar,
    definirCena(cena) {
      if (destruido) return;
      if (!cena || typeof cena !== "object" || Array.isArray(cena) ||
          Object.keys(cena).some(chave => !["ambiente", "paleta", "fontes"].includes(chave)) ||
          !Array.isArray(cena.fontes)) throw new TypeError("Cena requer ambiente, paleta e lista de fontes.");
      for (const chave of ["ambiente", "paleta"]) if (cena[chave] !== null && typeof cena[chave] !== "string") throw new TypeError("Ambiente e paleta devem ser IDs ou null.");
      const ids = new Set();
      for (const fonte of cena.fontes) {
        if (!fonte || typeof fonte.id !== "string" || !fonte.id || ids.has(fonte.id) || !["pontual", "linear", "ambiente"].includes(fonte.tipo)) throw new TypeError("Fonte inválida ou repetida.");
        ids.add(fonte.id);
        if (!Array.isArray(fonte.posicao) || fonte.posicao.length !== 3 || !fonte.posicao.every(Number.isFinite)) throw new TypeError("Posição requer três coordenadas finitas.");
        if (!Object.hasOwn(presets, fonte.tom) || !Number.isFinite(fonte.intensidade) || fonte.intensidade < 0 || fonte.intensidade > 1) throw new TypeError("Tom ou intensidade inválidos.");
      }
      const copia = congelar({ ambiente: cena.ambiente, paleta: cena.paleta, fontes: cena.fontes.map(f => ({ id: f.id, tipo: f.tipo, posicao: [...f.posicao], tom: f.tom, intensidade: f.intensidade })) });
      if (JSON.stringify(copia) === JSON.stringify(estado.cena)) return;
      estado = { ...estado, cena: copia }; notificar(); solicitar();
    },
    definirRenderizador(novo) {
      if (destruido || novo === renderizador) return;
      validarRenderizador(novo); cancelarPendente(); renderizador.limpar(); renderizador = novo; solicitar();
    },
    definirQualidade(qualidade) {
      if (destruido) return;
      if (!["desligado", "economico", "padrao"].includes(qualidade)) throw new RangeError("Qualidade desconhecida.");
      if (estado.qualidade === qualidade && estado.ativo === (qualidade !== "desligado")) return;
      estado = { ...estado, qualidade, ativo: qualidade !== "desligado" };
      if (!estado.ativo) { cancelarPendente(); renderizador.limpar(); }
      notificar(); solicitar();
    },
    ativar(ativo = true) {
      if (destruido) return;
      if (typeof ativo !== "boolean") throw new TypeError("Ativo deve ser booleano.");
      if (estado.ativo === ativo) return;
      estado = { ...estado, ativo, qualidade: ativo && estado.qualidade === "desligado" ? "padrao" : estado.qualidade };
      if (!ativo) { cancelarPendente(); renderizador.limpar(); }
      notificar(); solicitar();
    },
    suspender(valor = true) {
      if (destruido) return;
      if (typeof valor !== "boolean") throw new TypeError("Suspensão deve ser booleana.");
      if (suspenso === valor) return;
      suspenso = valor;
      if (valor) { cancelarPendente(); renderizador.limpar(); }
      notificar(); solicitar();
    },
    observar(callback) { if (destruido) return () => {}; observadores.add(callback); callback(obterEstado()); return () => observadores.delete(callback); },
    destruir() { if (destruido) return; destruido = true; cancelarPendente(); renderizador.limpar(); observadores.clear(); }
  };
};
