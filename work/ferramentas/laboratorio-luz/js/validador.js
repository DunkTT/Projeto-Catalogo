"use strict";
// Aceita JSON de outras IAs, recusa o que quebra o contrato e devolve cópia limpa.
LaboratorioLuz.clonarCongelado = function (valor) {
  if (!valor || typeof valor !== "object") return valor;
  const copia = Array.isArray(valor) ? valor.map(LaboratorioLuz.clonarCongelado) : {};
  if (!Array.isArray(valor)) {
    for (const [chave, item] of Object.entries(valor)) copia[chave] = LaboratorioLuz.clonarCongelado(item);
  }
  return Object.freeze(copia);
};

LaboratorioLuz.validarFonte = function (fonte, indice, ids) {
  const regras = LaboratorioLuz.regras;
  if (!fonte || typeof fonte !== "object" || Array.isArray(fonte)) return "Fonte " + indice + " inválida.";
  if (typeof fonte.id !== "string" || !regras.identificador.test(fonte.id) || ids.has(fonte.id)) return "Fonte com id inválido ou repetido.";
  if (!regras.tiposDeFonte.includes(fonte.tipo)) return "Tipo de fonte desconhecido: " + fonte.tipo + ".";
  if (fonte.padrao && !Object.hasOwn(LaboratorioLuz.padroes, fonte.padrao)) return "Padrão da fonte desconhecido: " + fonte.padrao + ".";
  if (fonte.preset && !Object.hasOwn(LaboratorioLuz.presets, fonte.preset)) return "Preset da fonte desconhecido: " + fonte.preset + ".";
  if (fonte.peso != null && (!Number.isFinite(fonte.peso) || fonte.peso < 0 || fonte.peso > 1)) return "Peso da fonte deve estar entre 0 e 1.";
  if (fonte.fase != null && !Number.isFinite(fonte.fase)) return "Fase da fonte deve ser numérica.";
  if (fonte.posicao) {
    const posicaoValida = Array.isArray(fonte.posicao) && fonte.posicao.length === 3 && fonte.posicao.every(Number.isFinite);
    if (!posicaoValida) return "Posição da fonte requer três números finitos.";
  }
  ids.add(fonte.id);
  return "";
};

LaboratorioLuz.validarEfeito = function (entrada) {
  const regras = LaboratorioLuz.regras;
  const avisos = [];
  if (!entrada || typeof entrada !== "object" || Array.isArray(entrada)) {
    return { ok: false, erros: ["O efeito precisa ser um objeto JSON."], avisos, efeito: null };
  }
  const erros = [];
  if (entrada.contrato && entrada.contrato !== LaboratorioLuz.versaoContrato) avisos.push("Contrato " + entrada.contrato + " diferente da v" + LaboratorioLuz.versaoContrato + ".");
  if (typeof entrada.id !== "string" || !regras.identificador.test(entrada.id)) erros.push("id deve ser minúsculas, números e hífen.");
  if (entrada.nome != null && typeof entrada.nome !== "string") erros.push("nome deve ser texto.");
  if (typeof entrada.laco !== "boolean") erros.push("laco deve ser true ou false.");
  if (!Number.isFinite(entrada.duracaoMs) || entrada.duracaoMs < regras.duracaoMinimaMs || entrada.duracaoMs > regras.duracaoMaximaMs) {
    erros.push("duracaoMs deve ficar entre " + regras.duracaoMinimaMs + " e " + regras.duracaoMaximaMs + ".");
  }
  if (!Object.hasOwn(LaboratorioLuz.presets, entrada.preset)) erros.push("preset desconhecido.");
  if (!Object.hasOwn(LaboratorioLuz.padroes, entrada.padrao)) erros.push("padrao desconhecido.");
  const brilho = entrada.brilho || {};
  if (!Number.isFinite(brilho.minimo) || !Number.isFinite(brilho.maximo) || brilho.minimo > brilho.maximo) erros.push("brilho.minimo e brilho.maximo inválidos.");
  if (brilho.minimo < regras.brilhoMinimo || brilho.maximo > regras.brilhoMaximo) erros.push("brilho fora de 0–100.");
  if (entrada.mistura) {
    if (!Object.hasOwn(LaboratorioLuz.presets, entrada.mistura.de) || !Object.hasOwn(LaboratorioLuz.presets, entrada.mistura.para)) erros.push("mistura.de e mistura.para precisam ser presets.");
  }
  const fontes = Array.isArray(entrada.fontes) ? entrada.fontes : [];
  if (!fontes.length) erros.push("Informe ao menos uma fonte.");
  const ids = new Set();
  fontes.forEach((fonte, indice) => {
    const erro = LaboratorioLuz.validarFonte(fonte, indice, ids);
    if (erro) erros.push(erro);
  });
  const conhecidas = new Set(["contrato", "id", "nome", "laco", "duracaoMs", "preset", "padrao", "brilho", "mistura", "fontes"]);
  Object.keys(entrada).forEach(chave => { if (!conhecidas.has(chave)) avisos.push("Campo ignorado: " + chave + "."); });
  if (erros.length) return { ok: false, erros, avisos, efeito: null };
  const minimo = LaboratorioLuz.limitarBrilho(brilho.minimo);
  const maximo = LaboratorioLuz.limitarBrilho(brilho.maximo);
  const efeito = LaboratorioLuz.clonarCongelado({
    contrato: LaboratorioLuz.versaoContrato,
    id: entrada.id,
    nome: entrada.nome || entrada.id,
    laco: entrada.laco,
    duracaoMs: entrada.duracaoMs,
    preset: entrada.preset,
    padrao: entrada.padrao,
    brilho: { minimo, maximo },
    mistura: entrada.mistura ? { de: entrada.mistura.de, para: entrada.mistura.para } : { de: entrada.preset, para: entrada.preset },
    fontes: fontes.map(fonte => ({
      id: fonte.id,
      tipo: fonte.tipo,
      padrao: fonte.padrao || entrada.padrao,
      preset: fonte.preset || entrada.preset,
      peso: fonte.peso == null ? 1 : fonte.peso,
      fase: fonte.fase || 0,
      posicao: fonte.posicao ? [...fonte.posicao] : [0.5, 0.5, 0]
    }))
  });
  return { ok: true, erros, avisos, efeito };
};

LaboratorioLuz.lerJson = function (texto) {
  try {
    return LaboratorioLuz.validarEfeito(JSON.parse(texto));
  } catch (erro) {
    return { ok: false, erros: ["JSON inválido: " + erro.message], avisos: [], efeito: null };
  }
};
