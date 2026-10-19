"use strict";

// Regras editoriais locais. Não mede emoções, vendas, escassez ou qualidade.
// Não modifica os produtos, não coleta dados e não faz requisições externas.
const classificacaoVisual = (() => {
  const configuracao = Object.freeze({
    versao: 1,
    pesos: Object.freeze({ categoria: 25, subcategoria: 20, busca: 30, editorial: 20, informacoes: 5 }),
    niveis: Object.freeze([
      { id: "comum", minimo: 0, rotulo: "Descoberta", simbolo: "◇" },
      { id: "incomum", minimo: 20, rotulo: "Seleção em foco", simbolo: "◆" },
      { id: "raro", minimo: 45, rotulo: "Conexão com sua seleção", simbolo: "✦" },
      { id: "epico", minimo: 75, rotulo: "Destaque da sua seleção", simbolo: "✧" }
    ].map(Object.freeze)),
    limiteNivelMaximoPorGrupo: 1
  });
  const textos = new WeakMap();
  const normalizar = valor => String(valor || "").normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");

  function classificar(produto, contexto = {}, registros = []) {
    const motivos = [];
    let pontuacao = 0;
    const adicionar = (pontos, motivo) => { pontuacao += pontos; motivos.push(motivo); };
    if (contexto.categoria && contexto.categoria === produto.categoria) {
      adicionar(configuracao.pesos.categoria, "Pertence à categoria selecionada.");
    }
    if (contexto.subcategoria && contexto.subcategoria === produto.subcategoria) {
      adicionar(configuracao.pesos.subcategoria, "Pertence à subcategoria selecionada.");
    }
    const termos = [...new Set(normalizar(contexto.busca).split(/\s+/).filter(Boolean))];
    if (termos.length) {
      if (!textos.has(produto)) textos.set(produto, normalizar([
        produto.nome, ...(produto.variacoes || []).flatMap(item => [item.sku, item.nomeRevisado, item.nomeOriginal])
      ].join(" ")));
      const correspondencias = termos.filter(termo => textos.get(produto).includes(termo)).length;
      if (correspondencias) adicionar(Math.round(configuracao.pesos.busca * correspondencias / termos.length), "Contém termos da sua busca.");
    }
    const registrosDoProduto = registros.filter(registro => registro.ativo && registro.referenciaInterna && registro.parceiro === produto.marcaId &&
      (produto.variacoes || []).some(item => String(item.identificador) === registro.referenciaInterna || item.sku === registro.referenciaInterna));
    const prioridade = Math.max(0, ...registrosDoProduto.map(item => Math.min(5, Math.max(0, Number(item.prioridade) || 0))));
    if (prioridade) adicionar(Math.round(configuracao.pesos.editorial * prioridade / 5), "Possui prioridade editorial definida pela loja.");
    if (Object.values(produto.especificacoes || {}).some(valor => valor != null && String(valor).trim())) {
      adicionar(configuracao.pesos.informacoes, "Há especificações cadastradas para consulta.");
    }
    const indice = configuracao.niveis.reduce((atual, nivel, posicao) => pontuacao >= nivel.minimo ? posicao : atual, 0);
    return { pontuacao, indice, nivel: configuracao.niveis[indice], motivos };
  }

  function classificarGrupo(produtos, contexto = {}, registros = []) {
    const avaliados = produtos.map(produto => ({ produto, ...classificar(produto, contexto, registros) }));
    let destaquesMaximos = 0;
    const ordenados = [...avaliados].sort((a, b) => b.pontuacao - a.pontuacao || String(a.produto.identificador).localeCompare(String(b.produto.identificador)));
    for (const item of ordenados) {
      if (item.indice === 3 && destaquesMaximos++ >= configuracao.limiteNivelMaximoPorGrupo) {
        item.indice = 2;
        item.nivel = configuracao.niveis[2];
        item.motivos = [...item.motivos, "Ênfase visual moderada para preservar a legibilidade do conjunto."];
      }
    }
    return avaliados;
  }
  return Object.freeze({ configuracao, classificar, classificarGrupo });
})();
