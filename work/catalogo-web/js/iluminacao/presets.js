"use strict";
globalThis.Iluminacao = globalThis.Iluminacao || {};
Iluminacao.presets = Object.freeze({
  quente: Object.freeze({ nome: "Branco quente", corVisual: "#ffb04c", temperaturaReferencia: 3000 }),
  neutro: Object.freeze({ nome: "Branco neutro", corVisual: "#fff7e8", temperaturaReferencia: 4000 }),
  frio: Object.freeze({ nome: "Branco frio", corVisual: "#99d3ff", temperaturaReferencia: 6500 })
});
