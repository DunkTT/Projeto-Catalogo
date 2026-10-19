"use strict";
// Curvas de tempo 0–1. O misturador aplica cada curva a brilho, mistura ou posição.
LaboratorioLuz.envolverProgresso = function (progresso, fase) {
  const deslocado = progresso + (Number.isFinite(fase) ? fase : 0);
  const ciclo = deslocado % 1;
  return ciclo < 0 ? ciclo + 1 : ciclo;
};

LaboratorioLuz.padroes = Object.freeze({
  constante: Object.freeze({ nome: "Constante", amostrar: () => 1 }),
  suave: Object.freeze({
    nome: "Suave",
    amostrar: progresso => {
      const t = LaboratorioLuz.envolverProgresso(progresso, 0);
      return t * t * (3 - 2 * t);
    }
  }),
  respirar: Object.freeze({
    nome: "Respirar",
    amostrar: (progresso, fase) => 0.5 + 0.5 * Math.sin(LaboratorioLuz.envolverProgresso(progresso, fase) * Math.PI * 2 - Math.PI / 2)
  }),
  pulso: Object.freeze({
    nome: "Pulso",
    amostrar: (progresso, fase) => Math.sin(LaboratorioLuz.envolverProgresso(progresso, fase) * Math.PI)
  }),
  varredura: Object.freeze({
    nome: "Varredura",
    amostrar: (progresso, fase) => {
      const t = LaboratorioLuz.envolverProgresso(progresso, fase);
      return t < 0.5 ? t * 2 : 2 - t * 2;
    }
  }),
  onda: Object.freeze({
    nome: "Onda",
    amostrar: (progresso, fase) => 0.5 + 0.5 * Math.sin(LaboratorioLuz.envolverProgresso(progresso, fase) * Math.PI * 4)
  })
});
