"use strict";
// Clipe de demonstração. Outras IAs devem seguir o mesmo contrato, não este arquivo.
LaboratorioLuz.efeitosExemplo = Object.freeze([
  LaboratorioLuz.validarEfeito({
    contrato: "1",
    id: "respirar-quente",
    nome: "Respirar quente",
    laco: true,
    duracaoMs: 4200,
    preset: "quente",
    padrao: "respirar",
    brilho: { minimo: 16, maximo: 74 },
    mistura: { de: "ambar", para: "quente" },
    fontes: [
      { id: "ambiente", tipo: "ambiente", padrao: "respirar", peso: 1, fase: 0 },
      { id: "foco", tipo: "pontual", padrao: "pulso", peso: 0.8, fase: 0.08, posicao: [0.52, 0.2, 0] },
      { id: "faixa", tipo: "linear", padrao: "constante", peso: 0.28, posicao: [0.5, 0.06, 0] }
    ]
  }).efeito,
  LaboratorioLuz.validarEfeito({
    contrato: "1",
    id: "ciclo-temperatura",
    nome: "Ciclo de temperatura",
    laco: true,
    duracaoMs: 9000,
    preset: "neutro",
    padrao: "suave",
    brilho: { minimo: 22, maximo: 68 },
    mistura: { de: "quente", para: "frio" },
    fontes: [
      { id: "ambiente", tipo: "ambiente", padrao: "suave", peso: 1 },
      { id: "foco", tipo: "pontual", preset: "frio", padrao: "varredura", peso: 0.55, fase: 0.25, posicao: [0.48, 0.24, 0] },
      { id: "faixa", tipo: "linear", preset: "quente", padrao: "onda", peso: 0.4, fase: 0.5, posicao: [0.5, 0.1, 0] }
    ]
  }).efeito,
  LaboratorioLuz.validarEfeito({
    contrato: "1",
    id: "varredura-linear",
    nome: "Varredura linear",
    laco: true,
    duracaoMs: 3200,
    preset: "ciano",
    padrao: "varredura",
    brilho: { minimo: 10, maximo: 80 },
    mistura: { de: "ciano", para: "magenta" },
    fontes: [
      { id: "ambiente", tipo: "ambiente", padrao: "constante", peso: 0.35 },
      { id: "faixa", tipo: "linear", padrao: "varredura", peso: 1, posicao: [0.5, 0.12, 0] },
      { id: "foco", tipo: "pontual", padrao: "pulso", peso: 0.5, fase: 0.4, posicao: [0.7, 0.3, 0] }
    ]
  }).efeito
].filter(Boolean));
