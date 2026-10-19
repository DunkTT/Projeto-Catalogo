// Adaptador SVG específico da sala fixa, usando o núcleo de iluminação existente.
// Aplica tons às áreas recortadas e remove os efeitos durante limpeza ou suspensão.
"use strict";
SalaUltraled.criarRenderizador = function (svg, documento) {
  SalaUltraled.validarContrato(documento, svg);
  const contrato = JSON.parse(JSON.stringify(documento));
  const OPACIDADE_PADRAO = 0.32;
  const OPACIDADE_ECONOMICA = 0.16;
  const DURACAO_TRANSICAO = "180ms";
  const movimentoReduzido = matchMedia("(prefers-reduced-motion: reduce)");
  const elementos = new Map([...svg.querySelectorAll("[id]")].map(elemento => [elemento.id, elemento]));
  const areas = contrato.visual.camadas.filter(camada => camada.papel === "luz").map(camada => elementos.get(camada.id));
  const formas = areas.flatMap(area => [...area.children]);
  const estilosOriginais = new Map([...areas, ...formas].map(elemento => [elemento, elemento.getAttribute("style")]));
  const gradientes = new Map();

  function obterGradiente(identificador, cor) {
    if (!gradientes.has(identificador)) {
      const gradiente = elementos.get("banho-parede").cloneNode(true);
      gradiente.id = `previa-gradiente-${identificador}`;
      svg.querySelector("defs").append(gradiente);
      gradientes.set(identificador, gradiente);
    }
    const gradiente = gradientes.get(identificador);
    for (const parada of gradiente.children) parada.style.stopColor = cor;
    return `url(#${gradiente.id})`;
  }

  function limpar() {
    for (const [elemento, estilo] of estilosOriginais) {
      if (estilo === null) elemento.removeAttribute("style");
      else elemento.setAttribute("style", estilo);
    }
    for (const gradiente of gradientes.values()) gradiente.remove();
    gradientes.clear();
  }
  function pintarFonte(fonte, economico) {
    const vinculo = contrato.visual.vinculos.find(item => item.fonte === fonte.id);
    const cor = Iluminacao.presets[fonte.tom].corVisual;
    const gradiente = economico ? null : obterGradiente(fonte.id, cor);
    for (const [indice, id] of vinculo.camadas.entries()) {
      const area = elementos.get(id);
      const visivel = !economico || indice === 0;
      area.style.transition = economico || movimentoReduzido.matches ? "none" : `opacity ${DURACAO_TRANSICAO}`;
      area.style.opacity = String(visivel ? fonte.intensidade : 0);
      for (const forma of area.children) {
        const usaGradiente = forma.getAttribute("fill") === "url(#banho-parede)";
        forma.style.fill = !economico && usaGradiente ? gradiente : cor;
        forma.style.opacity = String(economico ? OPACIDADE_ECONOMICA : OPACIDADE_PADRAO);
      }
    }
  }
  return {
    capacidades: Object.freeze({ ambientes: true, paletas: false, multiplasFontes: true }),
    renderizar(estado) {
      if (estado.suspenso || !estado.ativo || estado.qualidade === "desligado") return limpar();
      SalaUltraled.validarContrato({ ...contrato, cena: estado.cena }, svg);
      if (estado.qualidade === "economico") {
        for (const gradiente of gradientes.values()) gradiente.remove();
        gradientes.clear();
      }
      for (const fonte of estado.cena.fontes) pintarFonte(fonte, estado.qualidade === "economico");
    },
    limpar
  };
};
