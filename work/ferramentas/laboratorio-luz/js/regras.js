"use strict";
// Limites e modos que todo clipe precisa respeitar antes de pintar.
LaboratorioLuz.regras = Object.freeze({
  brilhoMinimo: 0,
  brilhoMaximo: 100,
  intensidadeMinima: 0,
  intensidadeMaxima: 1,
  duracaoMinimaMs: 200,
  duracaoMaximaMs: 120000,
  identificador: /^[a-z0-9-]{2,64}$/,
  qualidades: Object.freeze(["desligado", "economico", "padrao"]),
  tiposDeFonte: Object.freeze(["pontual", "linear", "ambiente"])
});

LaboratorioLuz.limitar = function (valor, minimo, maximo) {
  return Math.min(maximo, Math.max(minimo, valor));
};

LaboratorioLuz.limitarBrilho = function (valor) {
  return LaboratorioLuz.limitar(valor, LaboratorioLuz.regras.brilhoMinimo, LaboratorioLuz.regras.brilhoMaximo);
};

LaboratorioLuz.limitarIntensidade = function (valor) {
  return LaboratorioLuz.limitar(valor, LaboratorioLuz.regras.intensidadeMinima, LaboratorioLuz.regras.intensidadeMaxima);
};

LaboratorioLuz.progressoComRegras = function (progresso, { laco, qualidade, movimentoReduzido }) {
  const finito = Number.isFinite(progresso) ? progresso : 0;
  if (movimentoReduzido) return laco ? 0.55 : 1;
  if (qualidade === "desligado") return 0;
  if (qualidade === "economico") return laco ? 0.55 : 1;
  if (laco) {
    const ciclo = finito % 1;
    return ciclo < 0 ? ciclo + 1 : ciclo;
  }
  return LaboratorioLuz.limitar(finito, 0, 1);
};
