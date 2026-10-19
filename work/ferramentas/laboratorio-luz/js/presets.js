"use strict";
// Paletas ilustrativas de temperatura e acentos. Não alteram cadastro nem Kelvin físico.
LaboratorioLuz.presets = Object.freeze({
  quente: Object.freeze({ nome: "Branco quente", corVisual: "#ffb04c", temperaturaReferencia: 3000, acento: "#ff7a18" }),
  neutro: Object.freeze({ nome: "Branco neutro", corVisual: "#fff7e8", temperaturaReferencia: 4000, acento: "#e8d7b0" }),
  frio: Object.freeze({ nome: "Branco frio", corVisual: "#99d3ff", temperaturaReferencia: 6500, acento: "#3aa0ff" }),
  ambar: Object.freeze({ nome: "Âmbar", corVisual: "#ffbf66", temperaturaReferencia: 2200, acento: "#ff8a2a" }),
  ciano: Object.freeze({ nome: "Ciano", corVisual: "#7ef0ff", temperaturaReferencia: null, acento: "#12d4e8" }),
  magenta: Object.freeze({ nome: "Magenta", corVisual: "#ff8ad8", temperaturaReferencia: null, acento: "#ff3dad" })
});
