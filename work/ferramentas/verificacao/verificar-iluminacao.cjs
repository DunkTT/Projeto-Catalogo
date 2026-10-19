const path = require("node:path");
const projetoWork = path.resolve(__dirname, "../..");
"use strict";
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const contexto = vm.createContext({});
for (const nome of ['presets', 'motor', 'renderizador-css']) vm.runInContext(fs.readFileSync(path.join(projetoWork, 'catalogo-web', 'js', 'iluminacao', nome + '.js'), 'utf8'), contexto);
const { Iluminacao } = contexto;
let contador = 0, desenhos = [], limpezas = 0;
const fila = new Map();
const renderizador = { renderizar: s => desenhos.push(s), limpar: () => limpezas++ };
const motor = Iluminacao.criarMotor({ renderizador, agendar: f => { fila.set(++contador, f); return contador; }, cancelar: id => fila.delete(id) });
const quadro = () => { const callbacks = [...fila.values()]; fila.clear(); callbacks.forEach(f => f()); };
motor.suspender(false);
for (let i = 0; i < 100; i++) motor.atualizar({ brilho: i });
assert.equal(fila.size, 1); quadro();
assert.equal(desenhos.length, 1); assert.equal(desenhos[0].brilho, 99);
motor.atualizar({ brilho: 99 }); assert.equal(fila.size, 0);
assert.throws(() => motor.atualizar({ tom: '7000' }));
assert.throws(() => motor.atualizar({ brilho: NaN }));
motor.atualizar({ brilho: -10 }); quadro(); assert.equal(desenhos.at(-1).brilho, 0);
motor.atualizar({ brilho: 200 }); motor.definirQualidade('desligado');
assert.equal(fila.size, 0); assert.equal(motor.obterEstado().brilho, 100);
motor.atualizar({ tom: 'frio' }); assert.equal(fila.size, 0);
motor.ativar(); quadro(); assert.equal(desenhos.at(-1).preset.temperaturaReferencia, 6500);
motor.definirQualidade('economico'); quadro(); assert.equal(desenhos.at(-1).qualidade, 'economico');
motor.atualizar({ brilho: 30 }); motor.suspender(); assert.equal(fila.size, 0);
motor.suspender(false); quadro(); assert.equal(desenhos.at(-1).brilho, 30);
const cena = { ambiente: 'sala', paleta: 'areia', fontes: [{ id: 'teto', tipo: 'linear', posicao: [0, 1, 0], tom: 'quente', intensidade: .7 }] };
motor.definirCena(cena); cena.fontes[0].posicao[0] = 50;
assert.equal(motor.obterEstado().cena.fontes[0].posicao[0], 0);
assert.ok(Object.isFrozen(motor.obterEstado().cena.fontes[0]));
assert.throws(() => motor.definirCena({ ...cena, fontes: [cena.fontes[0], cena.fontes[0]] }));
let novoDesenho;
motor.definirRenderizador({ renderizar: s => novoDesenho = s, limpar() {} }); quadro();
assert.equal(novoDesenho.cena.ambiente, 'sala');
motor.atualizar({ brilho: 40 }); motor.destruir(); motor.destruir();
assert.equal(fila.size, 0); motor.suspender(false); motor.ativar(); assert.equal(fila.size, 0);
// Contrato do adaptador CSS: delta e restauração, inclusive prioridade original.
let escritas = 0;
const props = new Map([['--brilho', ['.25', 'important']]]), classes = new Set(), attrs = new Map();
const elemento = {
  style: { getPropertyValue: n => props.get(n)?.[0] || '', getPropertyPriority: n => props.get(n)?.[1] || '', setProperty(n,v,p='') { escritas++; props.set(n,[v,p]); }, removeProperty: n => props.delete(n) },
  classList: { contains: n => classes.has(n), add: n => classes.add(n), remove: n => classes.delete(n) },
  dataset: {}, getAttribute: n => attrs.get(n) ?? null, setAttribute: (n,v) => attrs.set(n,v), removeAttribute: n => attrs.delete(n)
};
const css = Iluminacao.criarRenderizadorCSS(elemento);
const frame = { preset: Iluminacao.presets.quente, brilho: 70, qualidade: 'padrao' };
css.renderizar(frame); const antes = escritas; css.renderizar(frame); assert.equal(escritas, antes);
css.limpar(); assert.deepEqual(props.get('--brilho'), ['.25','important']); assert.equal(classes.size, 0);
console.log('OK: coalescência de 100 entradas, valores inválidos, limites, modos, suspensão, retomada, cenas isoladas, troca de renderizador, destruição e deltas CSS.');
// Testa a conexão real dos eventos, sem navegar ou renderizar uma página.
function alvo(extra = {}) {
  const eventos = new Map();
  return { eventos, value: '', parentElement: {}, setAttribute() {},
    addEventListener: (nome, fn) => eventos.set(nome, fn), removeEventListener: nome => eventos.delete(nome), ...extra };
}
const documento = alvo({ hidden: false });
contexto.document = documento;
contexto.requestAnimationFrame = f => { fila.set(++contador, f); return contador; };
contexto.cancelAnimationFrame = id => fila.delete(id);
vm.runInContext(fs.readFileSync(path.join(projetoWork, 'catalogo-web', 'js', 'iluminacao', 'integracao-catalogo.js'), 'utf8'), contexto);
const slider = alvo(), qualidade = alvo(), valor = {}, controle = {}, midia = { firstElementChild: { dataset: {} } };
const integracao = Iluminacao.integrarCatalogo({ recipiente: elemento, midia, slider, qualidade, valor, controle });
integracao.sincronizar({ produtoAberto: 'a', corDaPrevia: 'quente' }, { permiteSimulacao: true }); quadro();
slider.value = '21'; slider.eventos.get('input')(); quadro(); assert.equal(integracao.motor.obterEstado().brilho, 21);
integracao.sincronizar({ produtoAberto: 'b', corDaPrevia: 'quente', brilho: 70 }, { permiteSimulacao: true });
assert.equal(integracao.motor.obterEstado().brilho, 21);
qualidade.value = 'desligado'; qualidade.eventos.get('change')(); assert.equal(slider.disabled, true);
qualidade.value = 'economico'; qualidade.eventos.get('change')(); quadro(); assert.equal(slider.disabled, false);
documento.hidden = true; documento.eventos.get('visibilitychange')(); assert.equal(fila.size, 0); assert.equal(integracao.motor.obterEstado().suspenso, true);
documento.hidden = false; documento.eventos.get('visibilitychange')(); quadro();
integracao.sincronizar({ produtoAberto: 'c' }, { permiteSimulacao: false }); assert.equal(controle.hidden, true); assert.equal(fila.size, 0);
integracao.fechar(); integracao.destruir(); assert.equal(slider.eventos.size, 0); assert.equal(qualidade.eventos.size, 0); assert.equal(documento.eventos.size, 0);
console.log('OK: integração mantém brilho entre produtos, alterna qualidade, suspende aba oculta/produto não simulável e remove ouvintes.');
