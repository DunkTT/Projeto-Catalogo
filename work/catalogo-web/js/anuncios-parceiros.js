"use strict";

const gerenciadorDeMiniAnuncios = (() => {
  const chaveLocal = "catalogo.miniAnuncios.rascunho.v1";
  function fonteSegura(endereco) {
    try {
      const url = new URL(String(endereco || "").trim());
      return url.protocol === "https:" && Boolean(url.hostname) && !url.username && !url.password ? url.href : "";
    } catch { return ""; }
  }
  function normalizarCadastro(registro) {
    if (!registro || typeof registro !== "object") return null;
    const fonteUrl = fonteSegura(registro.fonteUrl);
    const identificador = String(registro.identificador || "").trim();
    const parceiro = String(registro.parceiro || "").trim().toLowerCase();
    if (!fonteUrl || !/^[a-z0-9-]{2,70}$/.test(identificador) || !/^[a-z0-9-]{2,70}$/.test(parceiro)) return null;
    return {
      identificador, parceiro, fonteUrl,
      referenciaInterna: String(registro.referenciaInterna || "").trim(),
      titulo: String(registro.titulo || "").trim().slice(0, 80),
      chamada: String(registro.chamada || "").trim().slice(0, 150),
      prioridade: Math.max(0, Math.min(5, Number(registro.prioridade) || 0)),
      ativo: registro.ativo === true
    };
  }
  function validarLista(registros) {
    if (!Array.isArray(registros)) return null;
    const lista = registros.map(normalizarCadastro);
    if (lista.some(item => !item) || new Set(lista.map(item => item.identificador)).size !== lista.length) return null;
    return lista;
  }
  function carregar() {
    try {
      const rascunho = JSON.parse(localStorage.getItem(chaveLocal) || "null");
      if (rascunho?.versao === 1) {
        const lista = validarLista(rascunho.anuncios);
        if (lista) return lista;
      }
    } catch { /* Arquivo estático continua disponível. */ }
    return validarLista(cadastroDeMiniAnuncios.anuncios) || [];
  }
  function salvar(registros) {
    const lista = validarLista(registros);
    if (!lista) throw new Error("Existem fontes inválidas ou identificadores repetidos.");
    localStorage.setItem(chaveLocal, JSON.stringify({ versao: 1, anuncios: lista }));
    return lista;
  }
  function limparRascunho() { localStorage.removeItem(chaveLocal); }
  function localizarProduto(registro, produtos) {
    if (!registro.referenciaInterna) return null;
    return produtos.find(produto => produto.variacoes.some(item => item.identificador === registro.referenciaInterna || item.sku === registro.referenciaInterna)) || null;
  }
  function selecionar({ parceiro, linha, produtos, contexto = {}, limite = 3, registros = carregar() }) {
    const candidatos = [];
    for (const registro of registros) {
      if (!registro.ativo || registro.parceiro !== parceiro.identificador || !fonteSegura(registro.fonteUrl)) continue;
      const produto = localizarProduto(registro, produtos);
      if (!produto || produto.origem === "parceiro" || produto.marcaId !== parceiro.identificador) continue;
      if (linha.termoDaLinha && !produto.nome.toLocaleUpperCase("pt-BR").includes(linha.termoDaLinha)) continue;
      const pontuacao = classificacaoVisual.classificar(produto, contexto, [registro]).pontuacao;
      candidatos.push({ registro, produto, pontuacao });
    }
    candidatos.sort((a, b) => b.pontuacao - a.pontuacao || a.registro.identificador.localeCompare(b.registro.identificador, "pt-BR"));
    const usados = new Set();
    return candidatos.filter(item => { if (usados.has(item.produto.identificador)) return false; usados.add(item.produto.identificador); return true; }).slice(0, limite);
  }
  return { fonteSegura, normalizarCadastro, validarLista, carregar, salvar, limparRascunho, localizarProduto, selecionar };
})();
