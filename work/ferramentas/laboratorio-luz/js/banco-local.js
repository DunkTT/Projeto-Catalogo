"use strict";
// Rascunhos só neste navegador. Sem credenciais e sem vínculo com o catálogo.
LaboratorioLuz.chaveRascunhos = "laboratorio-luz.rascunhos";

LaboratorioLuz.lerRascunhos = function () {
  try {
    const bruto = localStorage.getItem(LaboratorioLuz.chaveRascunhos);
    const lista = bruto ? JSON.parse(bruto) : [];
    return Array.isArray(lista) ? lista : [];
  } catch (erro) {
    console.error("Não foi possível ler rascunhos locais:", erro);
    return [];
  }
};

LaboratorioLuz.guardarRascunho = function (efeito) {
  const lista = LaboratorioLuz.lerRascunhos().filter(item => item.id !== efeito.id);
  lista.unshift(efeito);
  try {
    localStorage.setItem(LaboratorioLuz.chaveRascunhos, JSON.stringify(lista.slice(0, 24)));
    return { ok: true, mensagem: "Rascunho guardado neste navegador." };
  } catch (erro) {
    console.error("Não foi possível guardar rascunho:", erro);
    return { ok: false, mensagem: "Armazenamento local indisponível." };
  }
};

LaboratorioLuz.apagarRascunho = function (id) {
  try {
    const lista = LaboratorioLuz.lerRascunhos().filter(item => item.id !== id);
    localStorage.setItem(LaboratorioLuz.chaveRascunhos, JSON.stringify(lista));
    return { ok: true, mensagem: "Rascunho removido." };
  } catch (erro) {
    console.error("Não foi possível apagar rascunho:", erro);
    return { ok: false, mensagem: "Armazenamento local indisponível." };
  }
};
