"use strict";
Iluminacao.criarRenderizadorCSS = function (recipiente) {
  const propriedades = ["--cor-luz", "--brilho"];
  const originais = propriedades.map(nome => [nome, recipiente.style.getPropertyValue(nome), recipiente.style.getPropertyPriority(nome)]);
  const classeAnterior = recipiente.classList.contains("iluminacao-previa");
  const modoAnterior = recipiente.getAttribute("data-iluminacao");
  let anterior = {};
  return {
    capacidades: Object.freeze({ multiplasFontes: false, ambientes: false, paletas: false }),
    renderizar({ preset, brilho, qualidade }) {
      recipiente.classList.add("iluminacao-previa");
      if (anterior.cor !== preset.corVisual) recipiente.style.setProperty("--cor-luz", preset.corVisual);
      if (anterior.brilho !== brilho) recipiente.style.setProperty("--brilho", String(brilho / 100));
      if (anterior.qualidade !== qualidade) recipiente.dataset.iluminacao = qualidade;
      anterior = { cor: preset.corVisual, brilho, qualidade };
    },
    limpar() {
      for (const [nome, valor, prioridade] of originais) {
        if (valor) recipiente.style.setProperty(nome, valor, prioridade); else recipiente.style.removeProperty(nome);
      }
      if (!classeAnterior) recipiente.classList.remove("iluminacao-previa");
      if (modoAnterior === null) recipiente.removeAttribute("data-iluminacao"); else recipiente.setAttribute("data-iluminacao", modoAnterior);
      anterior = {};
    }
  };
};
