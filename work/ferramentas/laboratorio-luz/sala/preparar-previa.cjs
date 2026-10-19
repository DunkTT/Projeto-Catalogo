// Atualiza as cópias locais do SVG e do JSON incorporadas à prévia HTML.
// Só precisa ser executado após editar esses arquivos; não executa testes.
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const caminho = nome => path.join(__dirname, nome);
try {
  const svg = fs.readFileSync(caminho("sala-estar.svg"), "utf8").trim();
  const contrato = JSON.parse(fs.readFileSync(caminho("cena.json"), "utf8"));
  const jsonSeguro = JSON.stringify(contrato, null, 2).replaceAll("<", "\\u003c");
  const atual = fs.readFileSync(caminho("previa.html"), "utf8");
  const padrao = /<!-- INICIO DADOS SALA -->[\s\S]*?<!-- FIM DADOS SALA -->/;
  if (!padrao.test(atual)) throw new Error("Marcadores da prévia ausentes.");
  const trecho = `<!-- INICIO DADOS SALA -->\n<script type="application/json" id="contrato-sala">${jsonSeguro}</script>\n<template id="arte-sala">${svg}</template>\n<!-- FIM DADOS SALA -->`;
  fs.writeFileSync(caminho("previa.html"), atual.replace(padrao, () => trecho), "utf8");
  console.log("Prévia local atualizada. Abra previa.html no navegador.");
} catch (erro) {
  console.error("Falha ao preparar a prévia:", erro);
  process.exitCode = 1;
}
