"use strict";

// Fontes editoriais internas: nunca são exibidas como links de saída ao cliente.
// Só associe uma marca quando ela constar literalmente no nome do cadastro.
const marcasVerificadas = [
  { identificador: "nitrolux", nome: "Nitrolux", padrao: /\bNITROLUX\b/, fonteOficial: "https://www.nitrolux.com.br/Downloads/Catalogo_2026.pdf" },
  { identificador: "embuled", nome: "Embuled", padrao: /\bEMBULED\b/, fonteOficial: "https://embuled.com/" },
  { identificador: "jr-perfis", nome: "JR Perfis", padrao: /\b(?:PERFIL\s+JR|JR\s+PERFIS)\b/, fonteOficial: "https://www.jrperfis.com.br/" },
  { identificador: "avant", nome: "Avant", padrao: /\bAVANT\b/, fonteOficial: "https://avantlux.com.br/produtos/" },
  { identificador: "starlumen", nome: "Starlumen", padrao: /\bSTARLUMEN\b/, fonteOficial: "https://www.starlumen.com.br/collections/starlumen" },
  { identificador: "lumanti", nome: "Lumanti", padrao: /\bLUMANTI\b/, fonteOficial: "https://lumanti.com.br/" },
  { identificador: "opus", nome: "Opus LED", padrao: /\bOPUS\b/, fonteOficial: "https://opusled.com.br/produtos/" },
  { identificador: "steck", nome: "Steck", padrao: /\bSTECK\b/, fonteOficial: "https://www.steck.com.br/produtos" },
  { identificador: "tigre", nome: "Tigre", padrao: /\bTIGRE\b/, fonteOficial: "https://www.tigre.com.br/" },
  { identificador: "blumenau", nome: "Blumenau Iluminação", padrao: /\bBLUMENAU\b/, fonteOficial: "https://blumenauiluminacao.com.br/home" },
  { identificador: "golight", nome: "Golight", padrao: /\bGOLIGHT\b/, fonteOficial: "https://golight.com.br/" },
  { identificador: "cobrecom", nome: "Cobrecom", padrao: /\bCOBRECOM\b/, fonteOficial: "https://cobrecom.com.br/" },
  { identificador: "3m", nome: "3M", padrao: /\b3M\b/, fonteOficial: "https://www.3m.com.br/3M/pt_BR/3m-fitas-vhb/" },
  { identificador: "tramontina", nome: "Tramontina", padrao: /\b(?:TRAMONTINA|TRAMOTINA)\b/, fonteOficial: "https://www.tramontina.com.br/departamentos/iluminacao/materiais-eletricos/interruptores-e-tomadas/" },
  { identificador: "ctb", nome: "CTB / XBCTB", padrao: /\b(?:XBCTB|XCTB|CTB)\b/, fonteOficial: "https://ctbluz.com.br/" },
  { identificador: "jng", nome: "JNG", padrao: /\bJNG\b/, fonteOficial: "https://www.jng.com.br/produtos/protecao/minidisjuntor" },
  { identificador: "ilumi", nome: "Ilumi", padrao: /\bILUMI\b/, fonteOficial: "https://www.ilumi.com.br/" },
  { identificador: "tytan", nome: "Tytan", padrao: /\bTYTAN\b/, fonteOficial: "https://tytan.com/br/produtos/" },
  { identificador: "gaya", nome: "Gaya", padrao: /\bGAYA\b/, fonteOficial: "https://gaya.com.br/portal-gaya/" }
];

function identificarMarcaVerificada(nome) {
  const texto = String(nome || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
  return marcasVerificadas.find(marca => marca.padrao.test(texto)) || null;
}

function extrairEspecificacoesDeclaradas(nome) {
  const texto = String(nome || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
  const encontrar = padrao => texto.match(padrao)?.[1] || "";
  const valores = [
    ["Potência", encontrar(/\b(\d+(?:[.,]\d+)?\s*W)(?!\s*\/\s*M)\b/)],
    ["Tensão", encontrar(/\b(12\s*V|24\s*V|110\s*V|127\s*V|220\s*V|240\s*V|BIVOLT|AUTOVOLT)\b/)],
    ["Fluxo luminoso", encontrar(/\b(\d+(?:[.,]\d+)?\s*LM)\b/)],
    ["Base / soquete", encontrar(/\b(E\s*14|E\s*27|E\s*40|GU\s*10|G\s*9|MR\s*16)\b/)],
    ["Proteção", encontrar(/\b(IP\s*\d{2})\b/)],
    ["Corrente", encontrar(/\b(\d+(?:[.,]\d+)?\s*A)\b/)],
    ["Medida declarada", encontrar(/\b(\d+(?:[.,]\d+)?\s*(?:MM|CM|M))\b/)]
  ];
  return Object.fromEntries(valores.filter(([, valor]) => valor).map(([chave, valor]) => [chave, valor.replace(/(\d)\s*(W|V|LM|A|MM|CM|M)$/i, "$1 $2").replace(/\s+/g, " ")]));
}

// Itens de fonte oficial, ausentes do cadastro interno. Preço e saldo não são importados.
const produtosDeFontesOficiais = [
  { identificador: "externo-starlumen-st176", nome: "Lâmpada LED G9 5 W ST176 Starlumen", marcaId: "starlumen", categoria: "iluminacao", subcategoria: "lampadas", fonteOficial: "https://www.starlumen.com.br/products/lampada-led-g9-5w-st176", especificacoes: { "Potência": "5 W", "Base / soquete": "G9", "Ângulo de abertura": "360°", "Material": "ABS e silicone", "Vida útil declarada": "30.000 h" }, variacoes: [{ codigoFabricante: "ST176-3000K", cor: "quente", temperaturaKelvin: 3000 }, { codigoFabricante: "ST176-6000K", cor: "frio", temperaturaKelvin: 6000 }] },
  { identificador: "externo-lumanti-par38-135", nome: "Lâmpada LED PAR38 13,5 W Lumanti", marcaId: "lumanti", categoria: "iluminacao", subcategoria: "lampadas", fonteOficial: "https://lumanti.com.br/blog/produto/lampada-led-direcional-par38-135w-36-autovolt/", especificacoes: { "Potência": "13,5 W", "Tensão": "Autovolt (100–240 V)", "Fluxo luminoso": "1.063 lm", "Ângulo de abertura": "36°", "Proteção": "IP20", "Dimensões": "Ø 121 × 134 mm" }, variacoes: [{ codigoFabricante: "PAR38313M", cor: "quente", temperaturaKelvin: 3000 }, { codigoFabricante: "PAR38413M", cor: "neutro", temperaturaKelvin: 4000 }, { codigoFabricante: "PAR38613M", cor: "frio", temperaturaKelvin: 6500 }] },
  { identificador: "externo-opus-ar70-dim", nome: "Lâmpada LED AR70 dimerizável 4,8 W Opus", marcaId: "opus", categoria: "iluminacao", subcategoria: "lampadas", fonteOficial: "https://opusled.com.br/produto/ar70-irc-95-4-8w-dim-2700k-24/", especificacoes: { "Potência": "4,8 W", "Base / soquete": "GU10", "Fluxo luminoso": "300 lm", "Ângulo de abertura": "24°", "Proteção": "IP20", "IRC": "> 95", "Dimensões": "Ø 70 × 69 mm" }, variacoes: [{ codigoFabricante: "LP 86152", cor: "quente", temperaturaKelvin: 2700, especificacoes: { "Tensão": "127 V" } }, { codigoFabricante: "LP 86169", cor: "quente", temperaturaKelvin: 2700, especificacoes: { "Tensão": "220 V" } }] }
];

function criarFamiliasExternas(cadastrosInternos) {
  const nomesInternos = new Set(cadastrosInternos.map(item => String(item.nome || "").toUpperCase()));
  return produtosDeFontesOficiais.filter(item => !nomesInternos.has(item.nome.toUpperCase())).map(item => ({
    identificador: item.identificador, nome: item.nome, categoria: item.categoria, subcategoria: item.subcategoria,
    marcaId: item.marcaId, origem: "parceiro", fonteOficial: item.fonteOficial, especificacoes: item.especificacoes,
    permiteSimulacao: true, potencia: item.especificacoes.Potência,
    classificacaoInterna: { codigo: `${item.categoria}/${item.subcategoria}`, metodo: "fonte-oficial", revisaoPendente: false },
    variacoes: item.variacoes.map((variacao, indice) => ({
      identificador: `${item.identificador}-${indice + 1}`, sku: "", codigoFabricante: variacao.codigoFabricante,
      nomeOriginal: `${item.nome} ${variacao.temperaturaKelvin}K ${variacao.codigoFabricante}`,
      nomeRevisado: `${item.nome} · ${variacao.temperaturaKelvin} K`, acabamento: "nao-informado",
      cor: variacao.cor, temperaturaKelvin: variacao.temperaturaKelvin, especificacoes: variacao.especificacoes || {}, preco: null, estoque: null
    }))
  }));
}
