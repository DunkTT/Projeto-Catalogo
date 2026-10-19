"use strict";
// Junta preset, padrão e fontes num snapshot de cor e brilho para um instante.
LaboratorioLuz.hexParaRgb = function (hex) {
  const limpo = String(hex || "").replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(limpo)) return [255, 247, 232];
  return [parseInt(limpo.slice(0, 2), 16), parseInt(limpo.slice(2, 4), 16), parseInt(limpo.slice(4, 6), 16)];
};

LaboratorioLuz.rgbParaHex = function (rgb) {
  return "#" + rgb.map(canal => LaboratorioLuz.limitar(Math.round(canal), 0, 255).toString(16).padStart(2, "0")).join("");
};

LaboratorioLuz.misturarRgb = function (origem, destino, peso) {
  const t = LaboratorioLuz.limitarIntensidade(peso);
  return origem.map((canal, indice) => canal + (destino[indice] - canal) * t);
};

LaboratorioLuz.amostrarPadrao = function (idDoPadrao, progresso, fase) {
  const padrao = LaboratorioLuz.padroes[idDoPadrao] || LaboratorioLuz.padroes.suave;
  return LaboratorioLuz.limitarIntensidade(padrao.amostrar(progresso, fase));
};

LaboratorioLuz.comporEfeito = function ({ preset, padrao, duracaoMs, laco, brilho } = {}) {
  const regras = LaboratorioLuz.regras;
  const minimo = LaboratorioLuz.limitarBrilho(brilho && brilho.minimo != null ? brilho.minimo : 14);
  const maximo = LaboratorioLuz.limitarBrilho(brilho && brilho.maximo != null ? brilho.maximo : 78);
  return {
    contrato: LaboratorioLuz.versaoContrato,
    id: "rascunho-local",
    nome: "Rascunho",
    laco: laco !== false,
    duracaoMs: LaboratorioLuz.limitar(duracaoMs || 4000, regras.duracaoMinimaMs, regras.duracaoMaximaMs),
    preset: Object.hasOwn(LaboratorioLuz.presets, preset) ? preset : "quente",
    padrao: Object.hasOwn(LaboratorioLuz.padroes, padrao) ? padrao : "respirar",
    brilho: { minimo, maximo: Math.max(minimo, maximo) },
    mistura: { de: "quente", para: "frio" },
    fontes: [
      { id: "ambiente", tipo: "ambiente", padrao: "constante", peso: 1, fase: 0 },
      { id: "foco", tipo: "pontual", padrao: padrao || "pulso", peso: 0.72, fase: 0.12, posicao: [0.5, 0.22, 0] },
      { id: "faixa", tipo: "linear", padrao: "varredura", peso: 0.45, fase: 0.35, posicao: [0.5, 0.08, 0] }
    ]
  };
};

LaboratorioLuz.amostrarEfeito = function (efeito, progressoBruto, contexto = {}) {
  const progresso = LaboratorioLuz.progressoComRegras(progressoBruto, {
    laco: efeito.laco,
    qualidade: contexto.qualidade || "padrao",
    movimentoReduzido: Boolean(contexto.movimentoReduzido)
  });
  const curva = LaboratorioLuz.amostrarPadrao(efeito.padrao, progresso, 0);
  const minimo = efeito.brilho.minimo;
  const maximo = efeito.brilho.maximo;
  const brilho = LaboratorioLuz.limitarBrilho(minimo + (maximo - minimo) * curva);
  const origem = LaboratorioLuz.presets[efeito.mistura && efeito.mistura.de] || LaboratorioLuz.presets[efeito.preset];
  const destino = LaboratorioLuz.presets[efeito.mistura && efeito.mistura.para] || origem;
  const cor = LaboratorioLuz.rgbParaHex(LaboratorioLuz.misturarRgb(
    LaboratorioLuz.hexParaRgb(origem.corVisual),
    LaboratorioLuz.hexParaRgb(destino.corVisual),
    efeito.mistura ? curva : 0
  ));
  const camadas = (efeito.fontes || []).map(fonte => {
    const peso = LaboratorioLuz.amostrarPadrao(fonte.padrao || efeito.padrao, progresso, fonte.fase);
    const presetFonte = LaboratorioLuz.presets[fonte.preset] || LaboratorioLuz.presets[efeito.preset];
    return {
      id: fonte.id,
      tipo: fonte.tipo,
      posicao: fonte.posicao ? [...fonte.posicao] : [0.5, 0.5, 0],
      cor: presetFonte.corVisual,
      acento: presetFonte.acento,
      opacidade: LaboratorioLuz.limitarIntensidade((fonte.peso || 1) * peso * (brilho / 100))
    };
  });
  return Object.freeze({
    id: efeito.id,
    progresso,
    cor,
    acento: origem.acento,
    brilho,
    qualidade: contexto.qualidade || "padrao",
    camadas: Object.freeze(camadas)
  });
};
