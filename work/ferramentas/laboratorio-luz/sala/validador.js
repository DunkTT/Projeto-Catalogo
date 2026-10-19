// Valida o contrato da sala e suas referências ao SVG antes de usar o motor.
// Restringe esta versão à composição fixa aprovada no estudo visual.
"use strict";
globalThis.SalaUltraled = globalThis.SalaUltraled || {};
(() => {
  const regras = {
    "luz-principal": { posicao: [460, 231, 0], origem: "ponto-luz-principal", camadas: ["area-luz-principal", "area-luz-piso"], tons: ["quente", "neutro", "frio"], intensidades: [0.7] },
    "luz-apoio": { posicao: [676, 322, 0], origem: "ponto-luz-apoio", camadas: ["area-luz-apoio"], tons: ["quente"], intensidades: [0, 0.4] }
  };
  const papeis = {
    fundo: "base", paredes: "superficie", piso: "superficie", janela: "objeto",
    tapete: "objeto", sofa: "objeto", mesa: "objeto",
    "area-luz-principal": "luz", "area-luz-piso": "luz", "area-luz-apoio": "luz",
    "luminaria-principal": "objeto", "luminaria-apoio": "objeto"
  };
  function exigir(condicao, mensagem) {
    if (!condicao) throw new TypeError(mensagem);
  }
  function campos(objeto, nomes, caminho) {
    exigir(objeto && typeof objeto === "object" && !Array.isArray(objeto), `${caminho}: objeto obrigatório.`);
    exigir(Object.keys(objeto).length === nomes.length && nomes.every(nome => Object.hasOwn(objeto, nome)), `${caminho}: campos ausentes ou desconhecidos.`);
  }
  function listaIgual(lista, esperada, caminho) {
    exigir(Array.isArray(lista) && lista.length === esperada.length && new Set(lista).size === lista.length && esperada.every(item => lista.includes(item)), `${caminho}: opções incompatíveis.`);
  }
  function elementosDoSvg(svg) {
    exigir(svg?.localName === "svg" && svg.getAttribute("viewBox") === "0 0 960 760", "SVG ou viewBox incompatível.");
    const elementos = new Map();
    for (const elemento of svg.querySelectorAll("[id]")) {
      exigir(!elementos.has(elemento.id), `SVG: ID repetido ${elemento.id}.`);
      elementos.set(elemento.id, elemento);
    }
    exigir(elementos.get("banho-parede")?.localName === "radialGradient", "Gradiente da sala ausente.");
    return elementos;
  }
  function validarFontes(cena, opcoes) {
    campos(cena, ["ambiente", "paleta", "fontes"], "cena");
    exigir(cena.ambiente === "sala-estar" && cena.paleta === null, "Ambiente ou paleta incompatível.");
    exigir(Array.isArray(cena.fontes) && cena.fontes.length >= 1 && cena.fontes.length <= 2, "A sala requer luz geral e permite uma luz de apoio.");
    campos(opcoes, cena.fontes.map(fonte => fonte?.id), "opcoesPermitidas");
    const identificadores = new Set();
    for (const fonte of cena.fontes) {
      campos(fonte, ["id", "tipo", "posicao", "tom", "intensidade"], "fonte");
      exigir(typeof fonte.id === "string" && Object.hasOwn(regras, fonte.id) && !identificadores.has(fonte.id), "Fonte desconhecida ou ID repetido.");
      identificadores.add(fonte.id);
      const regra = regras[fonte.id];
      exigir(fonte.tipo === "pontual", `${fonte.id}: tipo incompatível.`);
      exigir(Array.isArray(fonte.posicao) && fonte.posicao.length === 3 && fonte.posicao.every(Number.isFinite), `${fonte.id}: posição requer três números finitos.`);
      exigir(fonte.posicao.every((valor, indice) => valor === regra.posicao[indice]), `${fonte.id}: posição fora do ponto fixo da sala.`);
      exigir(typeof fonte.tom === "string" && Object.hasOwn(Iluminacao.presets, fonte.tom), `${fonte.id}: tom desconhecido.`);
      exigir(Number.isFinite(fonte.intensidade) && fonte.intensidade >= 0 && fonte.intensidade <= 1, `${fonte.id}: intensidade fora de 0–1.`);
      validarOpcoes(fonte, opcoes[fonte.id], regra);
    }
    exigir(identificadores.has("luz-principal"), "A luz geral é obrigatória.");
  }
  function validarOpcoes(fonte, opcoes, regra) {
    campos(opcoes, ["tons", "intensidades"], fonte.id);
    listaIgual(opcoes.tons, regra.tons, `${fonte.id}.tons`);
    listaIgual(opcoes.intensidades, regra.intensidades, `${fonte.id}.intensidades`);
    exigir(opcoes.tons.includes(fonte.tom) && opcoes.intensidades.includes(fonte.intensidade), `${fonte.id}: opção incompatível com a cena.`);
  }
  function validarCamadas(camadas, elementos) {
    exigir(Array.isArray(camadas) && camadas.length === Object.keys(papeis).length, "Lista de camadas incompleta.");
    const identificadores = new Set();
    for (const camada of camadas) {
      campos(camada, ["id", "papel"], "camada");
      exigir(Object.hasOwn(papeis, camada.id) && !identificadores.has(camada.id), "Camada desconhecida ou repetida.");
      exigir(papeis[camada.id] === camada.papel && elementos.has(camada.id), `Camada inexistente ou papel incompatível: ${camada.id}.`);
      if (camada.papel === "luz") {
        const area = elementos.get(camada.id);
        exigir(area.localName === "g" && area.children.length === 1 && area.firstElementChild.localName === "ellipse", `Área de luz incompatível: ${camada.id}.`);
      }
      identificadores.add(camada.id);
    }
  }
  function validarVinculos(vinculos, elementos, fontesDeclaradas) {
    exigir(Array.isArray(vinculos) && vinculos.length === fontesDeclaradas.length, "Cada fonte declarada requer um vínculo.");
    const fontes = new Set();
    for (const vinculo of vinculos) {
      campos(vinculo, ["fonte", "origem", "camadas"], "vinculo");
      exigir(fontesDeclaradas.some(fonte => fonte.id === vinculo.fonte) && !fontes.has(vinculo.fonte), "Vínculo desconhecido ou repetido.");
      fontes.add(vinculo.fonte);
      const regra = regras[vinculo.fonte];
      const origem = elementos.get(vinculo.origem);
      exigir(vinculo.origem === regra.origem && origem?.localName === "ellipse", "Origem de luz inexistente.");
      exigir(Number(origem.getAttribute("cx")) === regra.posicao[0] && Number(origem.getAttribute("cy")) === regra.posicao[1], "Origem deslocada no SVG.");
      listaIgual(vinculo.camadas, regra.camadas, "Camadas do vínculo");
      exigir(vinculo.camadas.every(id => elementos.has(id)), "Camada de luz inexistente no SVG.");
    }
  }
  SalaUltraled.validarContrato = function (documento, svg) {
    campos(documento, ["versao", "id", "cena", "visual", "opcoesPermitidas", "capacidadesExigidas"], "documento");
    exigir(documento.versao === 1 && documento.id === "sala-estar-industrial", "Versão ou cena desconhecida.");
    validarFontes(documento.cena, documento.opcoesPermitidas);
    const visual = documento.visual;
    campos(visual, ["arquivo", "coordenadas", "viewBox", "camadas", "vinculos"], "visual");
    exigir(visual.arquivo === "sala-estar.svg" && visual.coordenadas === "svg-local", "Recurso visual incompatível.");
    exigir(JSON.stringify(visual.viewBox) === "[0,0,960,760]", "viewBox incompatível.");
    const elementos = elementosDoSvg(svg);
    validarCamadas(visual.camadas, elementos);
    validarVinculos(visual.vinculos, elementos, documento.cena.fontes);
    const capacidades = documento.capacidadesExigidas;
    campos(capacidades, ["ambientes", "paletas", "multiplasFontes"], "capacidadesExigidas");
    const possuiMultiplasFontes = documento.cena.fontes.length > 1;
    exigir(capacidades.ambientes === true && capacidades.paletas === false && capacidades.multiplasFontes === possuiMultiplasFontes, "Capacidades exigidas incompatíveis.");
    return documento;
  };
  SalaUltraled.verificarCapacidades = function (exigidas, renderizador) {
    exigir(typeof renderizador.renderizar === "function" && typeof renderizador.limpar === "function", "Adaptador incompleto.");
    for (const [nome, exigida] of Object.entries(exigidas)) {
      exigir(!exigida || renderizador.capacidades?.[nome] === true, `Renderizador sem suporte a ${nome}.`);
    }
  };
})();
