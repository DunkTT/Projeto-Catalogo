// Verifica a lógica de ponteiros em cenários isolados, sem navegador ou CSS.
// Não comprova rolagem nativa, geometria, foco visível ou gestos em celular.
"use strict";
const path = require("node:path");
const fs = require("node:fs");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const pasta = process.argv[2] || path.resolve(__dirname, "../../catalogo-web");
const codigo = fs.readFileSync(path.join(pasta, "js/catalogo.js"), "utf8");
const inicio = codigo.indexOf("  function habilitarGesto(");
const fim = codigo.indexOf("  function habilitarArrasteParaRolagem(", inicio);
assert.ok(inicio >= 0 && fim > inicio, "Extração de habilitarGesto: revisar preparação se o módulo mudar");
const funcao = codigo.slice(inicio, fim);

function criarElemento() {
  const eventos = {}, captura = new Set(), estilos = new Map(), classes = new Set();
  return {
    dataset: {}, clientWidth: 400, scrollWidth: 800, scrollLeft: 0,
    style: { setProperty: (nome, valor) => estilos.set(nome, valor), removeProperty: nome => estilos.delete(nome) },
    classList: { add: nome => classes.add(nome), remove: nome => classes.delete(nome) },
    estilos, classes,
    addEventListener(nome, acao) { (eventos[nome] ||= []).push(acao); },
    setPointerCapture(id) { captura.add(id); },
    hasPointerCapture(id) { return captura.has(id); },
    releasePointerCapture(id) { captura.delete(id); },
    emitir(nome, dados = {}) {
      const evento = {
        pointerId: 1, isPrimary: true, button: 0, pointerType: "mouse", clientX: 0, clientY: 0, detail: 1,
        target: { closest: seletor => seletor === "[data-gesto]" ? this : null },
        preventDefault() { this.impedido = true; },
        stopImmediatePropagation() { this.propagacaoInterrompida = true; }, ...dados
      };
      for (const acao of eventos[nome] || []) acao(evento);
      return evento;
    }
  };
}
function criarCenario(eixo = "horizontal", trocarSlide = true) {
  const janela = criarElemento(), elemento = criarElemento(), movimentos = [];
  const cenario = { janela, elemento, movimentos, rolagem: 0, agora: 100 };
  janela.scrollBy = opcoes => { cenario.rolagem += opcoes.top; };
  const contexto = vm.createContext({ window: janela, performance: { now: () => cenario.agora } });
  vm.runInContext(funcao, contexto);
  contexto.habilitarGesto(elemento, eixo, trocarSlide ? passo => movimentos.push(passo) : null);
  return cenario;
}
function arrastar(elemento, dados) {
  elemento.emitir("pointerdown", dados.inicio);
  const evento = elemento.emitir("pointermove", dados.fim);
  elemento.emitir("pointerup", dados.fim);
  return evento;
}
function verificarLimpeza(elemento) {
  assert.equal(elemento.hasPointerCapture(1), false);
  assert.equal(elemento.classes.has("arrastando"), false);
  assert.equal(elemento.estilos.has("--arraste-x"), false);
}
let quantidade = 0;
function verificar(nome, acao) {
  try { acao(); quantidade++; console.log("OK: " + nome); }
  catch (erro) { erro.message = nome + ": " + erro.message; throw erro; }
}

verificar("slide nos dois sentidos e liberação de captura", () => {
  const { elemento, movimentos } = criarCenario();
  arrastar(elemento, { fim: { clientX: -90 } });
  arrastar(elemento, { fim: { clientX: 90 } });
  assert.deepEqual(movimentos, [1, -1]);
  verificarLimpeza(elemento);
});
verificar("clique bloqueado após arraste, teclado e expiração preservados", () => {
  const cenario = criarCenario();
  arrastar(cenario.elemento, { fim: { clientX: -90 } });
  const clique = cenario.elemento.emitir("click");
  assert.equal(clique.impedido, true);
  assert.equal(clique.propagacaoInterrompida, true);
  assert.equal(cenario.elemento.emitir("click", { detail: 0 }).impedido, undefined);
  cenario.agora += 351;
  assert.equal(cenario.elemento.emitir("click").impedido, undefined);
});
verificar("clique sem arraste e movimento curto não trocam slide", () => {
  const { elemento, movimentos } = criarCenario();
  arrastar(elemento, { fim: { clientX: 4 } });
  assert.equal(elemento.emitir("click").impedido, undefined);
  arrastar(elemento, { fim: { clientX: 40 } });
  assert.deepEqual(movimentos, []);
  verificarLimpeza(elemento);
});
verificar("arraste vertical com mouse sobre slide rola a página em -90", () => {
  const cenario = criarCenario();
  arrastar(cenario.elemento, { fim: { clientY: 90 } });
  assert.equal(cenario.rolagem, -90);
  assert.deepEqual(cenario.movimentos, []);
  verificarLimpeza(cenario.elemento);
});
for (const evento of ["pointercancel", "lostpointercapture", "blur"]) {
  verificar("limpeza por " + evento, () => {
    const { elemento, janela, movimentos } = criarCenario();
    elemento.emitir("pointerdown");
    elemento.emitir("pointermove", { clientX: 90 });
    assert.equal(elemento.hasPointerCapture(1), true);
    (evento === "blur" ? janela : elemento).emitir(evento);
    elemento.emitir("pointerup", { clientX: 90 });
    assert.deepEqual(movimentos, []);
    verificarLimpeza(elemento);
  });
}
verificar("trilho com overflow rola 40 e sem overflow ignora arraste", () => {
  const { elemento } = criarCenario("horizontal", false);
  arrastar(elemento, { fim: { clientX: -40 } });
  assert.equal(elemento.scrollLeft, 40);
  elemento.scrollLeft = 0;
  elemento.scrollWidth = elemento.clientWidth;
  const evento = arrastar(elemento, { fim: { clientX: -40 } });
  assert.equal(elemento.scrollLeft, 0);
  assert.equal(evento.impedido, undefined);
});
verificar("área aninhada não rola o recipiente externo", () => {
  const cenario = criarCenario("vertical", false);
  arrastar(cenario.elemento, { inicio: { target: { closest: () => criarElemento() } }, fim: { clientY: -100 } });
  assert.equal(cenario.rolagem, 0);
});
for (const eixo of ["horizontal", "vertical"]) {
  verificar("toque nativo não interceptado no eixo " + eixo, () => {
    const cenario = criarCenario(eixo, false);
    const evento = arrastar(cenario.elemento, { inicio: { pointerType: "touch" }, fim: { pointerType: "touch", clientX: -100, clientY: -100 } });
    assert.equal(evento.impedido, undefined);
    assert.equal(cenario.rolagem, 0);
    assert.equal(cenario.elemento.scrollLeft, 0);
    verificarLimpeza(cenario.elemento);
  });
}
verificar("arraste vertical próprio rola 60 sem herdar outros cenários", () => {
  const cenario = criarCenario("vertical", false);
  arrastar(cenario.elemento, { fim: { clientY: -60 } });
  assert.equal(cenario.rolagem, 60);
});
verificar("toque horizontal em slide chama ação; vertical não é interceptado", () => {
  const { elemento, movimentos } = criarCenario();
  arrastar(elemento, { inicio: { pointerType: "touch" }, fim: { pointerType: "touch", clientX: -90 } });
  const evento = arrastar(elemento, { inicio: { pointerType: "touch" }, fim: { pointerType: "touch", clientY: -90 } });
  assert.deepEqual(movimentos, [1]);
  assert.equal(evento.impedido, undefined);
  verificarLimpeza(elemento);
});
verificar("botão em slide conserva clique e não inicia gesto (limitação atual)", () => {
  const { elemento, movimentos } = criarCenario();
  const target = { closest: seletor => ["[data-gesto]", "button"].includes(seletor) ? elemento : null };
  arrastar(elemento, { inicio: { target }, fim: { clientX: -90 } });
  assert.deepEqual(movimentos, []);
  assert.equal(elemento.emitir("click").impedido, undefined);
});
verificar("ponteiro secundário e outro identificador não movem slide", () => {
  const { elemento, movimentos } = criarCenario();
  arrastar(elemento, { inicio: { isPrimary: false }, fim: { clientX: -90 } });
  elemento.emitir("pointerdown");
  elemento.emitir("pointermove", { pointerId: 2, clientX: -90 });
  elemento.emitir("pointerup", { pointerId: 2, clientX: -90 });
  elemento.emitir("pointerup");
  assert.deepEqual(movimentos, []);
  verificarLimpeza(elemento);
});
console.log("OK: " + quantidade + " cenários isolados de lógica de gestos. Rolagem real e integração dos componentes não avaliadas.");
