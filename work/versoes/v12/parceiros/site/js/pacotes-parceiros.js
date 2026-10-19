"use strict";

// Coleções editoriais: cada cartão abre um produto da loja, nunca o site de origem.
const temasDePacotes = [
  { identificador: "ambiente", titulo: "Uma luz para cada camada", descricao: "Luz geral, destaque e apoio reunidos para inspirar um ambiente.", grupos: [["iluminacao", "plafons"], ["iluminacao", "spots"], ["iluminacao", "lampadas"]] },
  { identificador: "linear", titulo: "Linhas que desenham espaços", descricao: "Perfis, fitas e alimentação para imaginar uma solução linear.", grupos: [["sistemas-led", "perfis"], ["sistemas-led", "fitas"], ["sistemas-led", "fontes"]] },
  { identificador: "eletrica", titulo: "A base da instalação", descricao: "Cabos, proteção e comandos para comparar. O dimensionamento depende de cada projeto.", grupos: [["eletrica", "cabos"], ["eletrica", "protecao"], ["eletrica", "tomadas"]] },
  { identificador: "acabamento", titulo: "Do detalhe ao ambiente", descricao: "Peças que combinam iluminação e acabamento sem misturar marcas repetidas.", grupos: [["iluminacao", "arandelas"], ["iluminacao", "pendentes"], ["sistemas-led", "perfis"]] },
  { identificador: "externa", titulo: "Ideias para a área externa", descricao: "Iluminação, cabeamento e proteção para planejar o espaço. Confira as especificações antes de combinar os itens.", grupos: [["iluminacao", "externa"], ["eletrica", "cabos"], ["eletrica", "protecao"]] }
];

function criarPacotesDeParceiros(produtos, marcas, aleatorio = Math.random, ignorarIdentificadores = [], evitarMarcas = [], anunciosAtivos = []) {
  const marcasValidas = new Set(marcas.map(item => item.identificador));
  const itens = produtos.filter(item => item.origem === "interna" && marcasValidas.has(item.marcaId));
  const vezesDoProduto = new Map(), vezesDaMarca = new Map(), anteriores = new Set(ignorarIdentificadores), destaques = new Set(anunciosAtivos);
  let marcasDoPacoteAnterior = new Set(evitarMarcas);
  const temas = temasDePacotes.map(tema => ({ tema, sorte: aleatorio() })).sort((a, b) => a.sorte - b.sorte).map(item => item.tema);
  const pacotes = [];
  for (const tema of temas) {
    const escolhidos = [], marcasNoPacote = new Set();
    for (const [categoria, subcategoria] of tema.grupos) {
      let candidatos = itens.filter(item => item.categoria === categoria && item.subcategoria === subcategoria && !marcasNoPacote.has(item.marcaId));
      if (tema.identificador === "linear" && subcategoria === "fontes") {
        const tensaoDaFita = escolhidos.find(item => item.subcategoria === "fitas")?.nome.match(/\b(12|24)\s*V\b/i)?.[1];
        const fontesCompativeis = tensaoDaFita ? candidatos.filter(item => new RegExp(`\\b${tensaoDaFita}\\s*V\\b`, "i").test(item.nome)) : [];
        candidatos = fontesCompativeis; // Sem tensão declarada, não sugerir uma fonte por adivinhação.
      }
      const pontuar = item => (vezesDoProduto.get(item.identificador) || 0) * 100 + (vezesDaMarca.get(item.marcaId) || 0) * 12 + (anteriores.has(item.identificador) ? 50 : 0) + (marcasDoPacoteAnterior.has(item.marcaId) ? 30 : 0) - (destaques.has(item.identificador) ? 9 : 0);
      const escolhido = candidatos.map(produto => ({ produto, pontuacao: pontuar(produto), sorte: aleatorio() })).sort((a, b) => a.pontuacao - b.pontuacao || a.sorte - b.sorte)[0]?.produto;
      if (!escolhido) continue;
      escolhidos.push(escolhido); marcasNoPacote.add(escolhido.marcaId);
      vezesDoProduto.set(escolhido.identificador, (vezesDoProduto.get(escolhido.identificador) || 0) + 1);
      vezesDaMarca.set(escolhido.marcaId, (vezesDaMarca.get(escolhido.marcaId) || 0) + 1);
    }
    if (escolhidos.length >= 2) { pacotes.push({ ...tema, produtos: escolhidos }); marcasDoPacoteAnterior = marcasNoPacote; }
  }
  return pacotes;
}
