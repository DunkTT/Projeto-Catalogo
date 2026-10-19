"use strict";

// Expanda a taxonomia, as regras e as exceções sem alterar a renderização.
const configuracaoDoCatalogo = {
  marca: { nome: "ULTRALED Hortolândia", assinatura: "Catálogo do estoque", simbolo: "✧", caminho: "", animacao: null },
  // Preencha apenas os canais usados. Números devem conter DDI + DDD + telefone.
  contato: { whatsappNumero: "", whatsappMensagem: "Olá! Gostaria de saber mais sobre os produtos do catálogo.", telefone: "", email: "", endereco: "Rua Joseph Paul Julien Burlandy, 395 · Parque Gabriel · Hortolândia, SP", links: [] },
  idiomas: [{ codigo: "pt-BR", nome: "Português (Brasil)", abreviacao: "PT-BR", disponivel: true }],
  parceiros: [],
  atmosferaPorCategoria: { home: "#7ba9eb", iluminacao: "#f1b764", "sistemas-led": "#70d5d1", eletrica: "#90b5f2", fixacao: "#dda6a0", ferramentas: "#c2a9e7", seguranca: "#8fc3c1", utilidades: "#a7cb85", outros: "#a9b9cf" },
  destaques: [
    { categoria: "iluminacao", chamada: "A luz muda tudo.", descricao: "Explore luminárias, lâmpadas e os tons que transformam cada espaço." },
    { categoria: "eletrica", chamada: "Seu projeto começa aqui.", descricao: "Cabos, tomadas e conexões organizados para encontrar o item certo." },
    { categoria: "sistemas-led", chamada: "Crie novas possibilidades.", descricao: "Fitas, perfis e sistemas LED reunidos em um só lugar." },
    { categoria: "fixacao", chamada: "Cada detalhe conta.", descricao: "Fixadores e ferragens para completar a instalação." }
  ],
  quantidadesPorPagina: [12, 24, 48],
  iluminacao: { ativo: true, qualidade: "padrao" },
  cores: Iluminacao.presets,
  acabamentos: {
    branco: { nome: "Branco", corVisual: "#f2f2ef", padrao: /\bBRANC[OA]\b/g },
    preto: { nome: "Preto", corVisual: "#242833", padrao: /\bPRET[OA]\b/g },
    cinza: { nome: "Cinza", corVisual: "#8b929e", padrao: /\bCINZA\b/g },
    prata: { nome: "Prata", corVisual: "#c5cbd2", padrao: /\bPRATA\b/g },
    dourado: { nome: "Dourado", corVisual: "#cba762", padrao: /\bDOURAD[OA]\b/g },
    cromado: { nome: "Cromado", corVisual: "#b6c3d1", padrao: /\bCROMAD[OA]\b/g },
    bronze: { nome: "Bronze", corVisual: "#9c754c", padrao: /\bBRONZE\b/g },
    rose: { nome: "Rosé", corVisual: "#d7a99f", padrao: /\bROSE\b/g },
    azul: { nome: "Azul", corVisual: "#4c82ca", padrao: /\bAZUL\b/g },
    verde: { nome: "Verde", corVisual: "#479e69", padrao: /\bVERDE\b/g },
    vermelho: { nome: "Vermelho", corVisual: "#ca5151", padrao: /\bVERMELH[OA]\b/g },
    amarelo: { nome: "Amarelo", corVisual: "#ead265", padrao: /\bAMAREL[OA]\b/g },
    laranja: { nome: "Laranja", corVisual: "#e4984c", padrao: /\bLARANJA\b/g },
    rosa: { nome: "Rosa", corVisual: "#d6a4be", padrao: /\bROSA\b/g },
    transparente: { nome: "Transparente", corVisual: "#c6d8df", padrao: /\bTRANSPARENTE\b/g }
  },
  correcoesDeNomes: [
    [/\bFAXO\b/g, "FACHO"], [/\bFAXOS\b/g, "FACHOS"], [/\bBUXA\b/g, "BUCHA"],
    [/\bARUELA\b/g, "ARRUELA"], [/\bCOLTROLE\b/g, "CONTROLE"], [/\bTUBOLAR\b/g, "TUBULAR"],
    [/\bSLIN\b/g, "SLIM"], [/\bPAR\s+(20|30|38)\b/g, "PAR$1"], [/\b3\s*EM\s*1\b/g, "3 EM 1"],
    [/\bBEJAMIN\b/g, "BENJAMIN"], [/\bMARRON\b/g, "MARROM"],
    [/\bDIJUNTOR\b/g, "DISJUNTOR"], [/\bTRIAGULAR\b/g, "TRIANGULAR"],
    [/\bMULTIPLAS\b/g, "MÚLTIPLAS"], [/\bBMODULAR\b/g, "MODULAR"],
    [/\bP\\R\\/g, "PARA"], [/\bP\/R\b/g, "PARA"], [/\bP\/(?!\w)/g, "PARA "], [/\bUNI\b/g, "UN"],
    [/\bBANCO\b(?=\s+EMBULED)/g, "BRANCO"], [/\bTRAMOTINA\b/g, "TRAMONTINA"]
  ],
  categorias: [
    { identificador: "iluminacao", nome: "Iluminação", simbolo: "✧", subcategorias: [
      ["lampadas", "Lâmpadas"], ["plafons", "Plafons e painéis"], ["spots", "Spots e embutidos"], ["pendentes", "Pendentes e lustres"], ["arandelas", "Arandelas"], ["externa", "Exterior e jardim"], ["emergencia", "Emergência e portáteis"], ["decorativa", "Iluminação decorativa"], ["luminarias", "Outras luminárias"]
    ] },
    { identificador: "sistemas-led", nome: "Sistemas LED", simbolo: "≋", subcategorias: [
      ["fitas", "Fitas, neon e mangueiras"], ["perfis", "Perfis e difusores"], ["fontes", "Fontes e drivers"], ["conexoes", "Conexões e controles"], ["trilhos", "Trilhos e acessórios"], ["modulos-led", "Módulos LED"]
    ] },
    { identificador: "eletrica", nome: "Elétrica", simbolo: "ϟ", subcategorias: [
      ["cabos", "Cabos e fios"], ["tomadas", "Tomadas e interruptores"], ["conectores", "Conectores e terminais"], ["protecao", "Proteção e distribuição"], ["infraestrutura", "Caixas e canaletas"], ["alimentacao", "Plugues e extensões"], ["automacao", "Sensores e automação"], ["acessorios", "Acessórios elétricos"]
    ] },
    { identificador: "fixacao", nome: "Fixação", simbolo: "⊕", subcategorias: [["parafusos", "Parafusos e chumbadores"], ["buchas", "Buchas"], ["ferragens", "Porcas, arruelas e ferragens"], ["fixadores", "Abraçadeiras e suportes"]] },
    { identificador: "ferramentas", nome: "Ferramentas", simbolo: "⌁", subcategorias: [["manuais", "Ferramentas e medição"], ["soldagem", "Soldagem"], ["consumiveis", "Colas, fitas e consumíveis"]] },
    { identificador: "seguranca", nome: "Segurança", simbolo: "◈", subcategorias: [["monitoramento", "Câmeras e monitoramento"]] },
    { identificador: "utilidades", nome: "Utilidades", simbolo: "⌂", subcategorias: [["casa", "Casa e organização"], ["jardim", "Jardim e hidráulica"], ["embalagens", "Embalagens e proteção"]] },
    { identificador: "outros", nome: "Outros produtos", simbolo: "⋯", subcategorias: [["revisar", "Demais cadastros"]] }
  ],
  regrasDeAgrupamento: [
    { padrao: /\b(?:SISTEMA X|TAMPA CEGA)\b/, categoria: "eletrica", subcategoria: "infraestrutura" },
    { padrao: /\b(?:DIMERIZADOR|DIMMER|CONTROLE|CONTROLADOR)\b/, categoria: "eletrica", subcategoria: "automacao" },
    { padrao: /\bFILETE\b.*\bLED\b/, categoria: "sistemas-led", subcategoria: "modulos-led", emissor: true },
    { padrao: /\b(?:MICROBORDA|MR11)\b/, categoria: "iluminacao", subcategoria: "spots", emissor: true },
    { padrao: /\bLUSTRES\b/, categoria: "iluminacao", subcategoria: "pendentes", emissor: true },
    { padrao: /\b(?:FIXA TUDO|PU\s?40|VEDA CALHA|TEK BONDER|TYTAN BOND|OLEO ANTICORROSIVO)\b/, categoria: "ferramentas", subcategoria: "consumiveis" },
    { padrao: /\bCOTOVELO\b.*\bTIGRE\b/, categoria: "utilidades", subcategoria: "jardim" },
    { padrao: /\bCABO\s+(?:DE\s+)?ACO\b/, categoria: "fixacao", subcategoria: "ferragens" },
    { padrao: /\bCABO\b/, categoria: "eletrica", subcategoria: "cabos" },
    { padrao: /\b(?:SOQUETE|RABICHO)\b/, categoria: "eletrica", subcategoria: "acessorios" },
    { padrao: /\b(?:CAMERA|DVR|NVR|CFTV)\b/, categoria: "seguranca", subcategoria: "monitoramento" },
    { padrao: /\b(?:CONECTOR|EMENDA|CONTROLE|CONTROLADOR|SENSOR|PRESILHA|TAMPA|CANTONEIRA)\b.*\b(?:FITA|MANGUEIRA|NEON|LED|PERFIL)\b/, categoria: "sistemas-led", subcategoria: "conexoes" },
    { padrao: /\b(?:TRILHO|CONECTOR.*TRILHO)\b(?!\s*DIN)/, categoria: "sistemas-led", subcategoria: "trilhos" },
    { padrao: /\b(?:PERFIL|DIFUSOR)\b/, categoria: "sistemas-led", subcategoria: "perfis" },
    { padrao: /\b(?:FONTE|DRIVER|TRANSFORMADOR|REATOR)\b/, categoria: "sistemas-led", subcategoria: "fontes" },
    { padrao: /\b(?:MODULO|PLACA)\s+(?:DE\s+)?LED\b/, categoria: "sistemas-led", subcategoria: "modulos-led", emissor: true },
    { padrao: /\b(?:FITA|MANGUEIRA|NEON)\b.*\b(?:LED|RGB|\d+V|\d+K|NEON)\b|\bNEON\b/, categoria: "sistemas-led", subcategoria: "fitas", emissor: true },
    { padrao: /\b(?:ARANDELA|BOXIT)\b/, categoria: "iluminacao", subcategoria: "arandelas", emissor: true },
    { padrao: /\b(?:PENDENTE|LUSTRE|ABAJUR)\b/, categoria: "iluminacao", subcategoria: "pendentes", emissor: true },
    { padrao: /\b(?:PLAFON|PAINEL LED)\b/, categoria: "iluminacao", subcategoria: "plafons", emissor: true },
    { padrao: /\b(?:SPOT|EMBUTIDO|DOWNLIGHT)\b/, categoria: "iluminacao", subcategoria: "spots", emissor: true },
    { padrao: /\b(?:REFLETOR|BALIZADOR|ESPETO|POSTE|TARTARUGA|HIGH BAY|UFO)\b/, categoria: "iluminacao", subcategoria: "externa", emissor: true },
    { padrao: /\b(?:EMERGENCIA|LANTERNA|LUZ NOTURNA)\b/, categoria: "iluminacao", subcategoria: "emergencia", emissor: true },
    { padrao: /\b(?:CORDAO LED|PISCA|VARAL.*LAMP|DECORATIVA)\b/, categoria: "iluminacao", subcategoria: "decorativa", emissor: true },
    { padrao: /\b(?:LAMPADA|AR111|AR70|DICROICA|PAR20|PAR30|PAR38|MR16|GU10)\b/, categoria: "iluminacao", subcategoria: "lampadas", emissor: true },
    { padrao: /\bLUMINARIA\b/, categoria: "iluminacao", subcategoria: "luminarias", emissor: true },
    { padrao: /\b(?:SENSOR|FOTOCELULA|RELE|TEMPORIZADOR|INTERRUPTOR.*(?:WIFI|INTELIGENTE))\b/, categoria: "eletrica", subcategoria: "automacao" },
    { padrao: /\b(?:DISJUNTOR|BARRAMENTO|DPS|DR|QUADRO|TRILHO DIN)\b/, categoria: "eletrica", subcategoria: "protecao" },
    { padrao: /\b(?:TOMADA|INTERRUPTOR|MODULO|PLACA|CONJ|CONJUNTO)\b/, categoria: "eletrica", subcategoria: "tomadas" },
    { padrao: /\b(?:CONECTOR|TERMINAL|ILHOS|SPLIT BOLT)\b/, categoria: "eletrica", subcategoria: "conectores" },
    { padrao: /\b(?:FILTRO.*LINHA|EXTENSAO|BENJAMIN|PLUG|PINO|ADAPTADOR)\b/, categoria: "eletrica", subcategoria: "alimentacao" },
    { padrao: /\b(?:CABO|FIO|CORDAO PARALELO|ELETROFITA)\b/, categoria: "eletrica", subcategoria: "cabos" },
    { padrao: /\b(?:CAIXA|CONDULETE|CANALETA|ELETRODUTO|PASSA FIO)\b/, categoria: "eletrica", subcategoria: "infraestrutura" },
    { padrao: /\b(?:SOQUETE|RABICHO|PILHA|BATERIA|FITA ISOLANTE|AUTOFUSAO|TERMORRETRATIL|TERMORETRATIL)\b/, categoria: "eletrica", subcategoria: "acessorios" },
    { padrao: /\b(?:PARAFUSO|CHUMBADOR)\b/, categoria: "fixacao", subcategoria: "parafusos" },
    { padrao: /\b(?:BUCHA|BUXA)\b/, categoria: "fixacao", subcategoria: "buchas" },
    { padrao: /\b(?:PORCA|PORCAS|ARRUELA|ARUELA|GANCHO|BARRA ROSCADA|CABO ACO)\b/, categoria: "fixacao", subcategoria: "ferragens" },
    { padrao: /\b(?:ABRACADEIRA|FIXA FIO|SUPORTE|PRESILHA)\b/, categoria: "fixacao", subcategoria: "fixadores" },
    { padrao: /\b(?:SOLDA|ESTANHO|FERRO SOLDAR)\b/, categoria: "ferramentas", subcategoria: "soldagem" },
    { padrao: /\b(?:COLA|ADESIVO|SILICONE|EPOXI|DUREPOXI|LUBRIFICANTE|ESPUMA|FITA|DISCO)\b/, categoria: "ferramentas", subcategoria: "consumiveis" },
    { padrao: /\b(?:TRENA|ALICATE|MARTELO|CHAVE|BROCA|LAPIS|CANETA|TESTE|MULTIMETRO|ESTILETE)\b/, categoria: "ferramentas", subcategoria: "manuais" },
    { padrao: /\b(?:ESGUINCHO|ENGATE|JOELHO|TORNEIRA|MANGUEIRA)\b/, categoria: "utilidades", subcategoria: "jardim" },
    { padrao: /\b(?:STRETCH|SACO|EMBALAGEM|LONA)\b/, categoria: "utilidades", subcategoria: "embalagens" },
    { padrao: /\b(?:TELA|VARAL|VENTILADOR|ORGANIZADOR)\b/, categoria: "utilidades", subcategoria: "casa" }
  ],
  // Exceções por ID real do Bling: { "id": { categoria, subcategoria, nomeDaFamilia, cor } }.
  ajustesPorIdentificador: {}
};

// Módulo de mídia único. Insira caminhos relativos ou HTTPS manualmente, por SKU ou ID.
const moduloDeMidia = {
  caminhosPorSku: {}, caminhosPorIdentificador: {},
  parceiros: { nitrolux: { logo: "", linhas: ["", "", ""] } },
  obterCaminho(cadastro) { return this.caminhosPorIdentificador[cadastro.identificador] || this.caminhosPorSku[cadastro.sku] || ""; }
};

// Marcas verificadas que aparecem nos cadastros entram automaticamente no carrossel.
// A fonte oficial permanece apenas nos metadados editoriais internos.
configuracaoDoCatalogo.parceiros = marcasVerificadas.map(marca => ({
  identificador: marca.identificador, nome: marca.nome, simbolo: "✧", intervaloEntreLinhas: 11000,
  linhas: [{ nome: `${marca.nome} no catálogo`, descricao: `Explore os produtos ${marca.nome} cadastrados na nossa seleção.`, termoDaLinha: "" }]
}));

function normalizarTexto(texto) {
  return String(texto || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleUpperCase("pt-BR").replace(/\s+/g, " ").trim();
}
function identificarTonalidade(nome, emissor) {
  if (!emissor) return { cor: null, temperaturaKelvin: null };
  const temperaturas = [...normalizarTexto(nome).matchAll(/\b([2-9]\d{3})\s*K\b/g)].map(item => Number(item[1]));
  if (new Set(temperaturas).size > 1 || /\b(?:RGB|3 EM 1|TRICOLOR|MULTICOR)\b/.test(normalizarTexto(nome))) return { cor: null, temperaturaKelvin: null };
  const temperaturaKelvin = temperaturas[0] || null;
  if (temperaturaKelvin) return { temperaturaKelvin, cor: temperaturaKelvin < 3500 ? "quente" : temperaturaKelvin < 5000 ? "neutro" : "frio" };
  const texto = normalizarTexto(nome);
  const cor = /BRANC[OA]\s+QUENTE|AMAREL[OA]\s+QUENTE/.test(texto) ? "quente" : /BRANC[OA]\s+NEUTR[OA]/.test(texto) ? "neutro" : /BRANC[OA]\s+FRI[OA]/.test(texto) ? "frio" : null;
  return { cor, temperaturaKelvin: null };
}
function revisarNomeDoProduto(nome, configuracao) {
  let revisado = normalizarTexto(nome);
  for (const [padrao, substituicao] of configuracao.correcoesDeNomes) revisado = revisado.replace(padrao, substituicao);
  return revisado;
}
function humanizarNome(nome) {
  const acentos = { LAMPADA: "lâmpada", LUMINARIA: "luminária", ELETRICO: "elétrico", ELETRICA: "elétrica", ELETRIFICADO: "eletrificado", ALUMINIO: "alumínio", FEMEA: "fêmea", ILHOS: "ilhós", ABRACADEIRA: "abraçadeira", FIXACAO: "fixação", EMERGENCIA: "emergência", PLASTICO: "plástico", AGUA: "água", TORCAO: "torção", MODULO: "módulo", CAMERA: "câmera", FOTOCELULA: "fotocélula", PARAFUSO: "parafuso", LUSTRE: "lustre", RETANGULO: "retângulo", QUADRUPLO: "quádruplo", TRIPLO: "triplo", TRILHO: "trilho", SILICONE: "silicone", OLEO: "óleo", FLEXIVEL: "flexível", DIMERIZAVEL: "dimerizável", CONEXAO: "conexão", CONSTRUCAO: "construção", PENDULO: "pêndulo", PORCELANA: "porcelana", ACO: "aço", EPOXI: "epóxi", NITROLUX: "Nitrolux", STARLUMEN: "Starlumen", EMBULED: "Embuled", LUMANT: "Lumant", LUMANTI: "Lumanti", TRAMONTINA: "Tramontina", GOLIGHT: "Golight", OPUS: "Opus", MAYLER: "Mayler", MULTIPLAS: "múltiplas", TRIANGULAR: "triangular", MAGNETICO: "magnético", TERMORRETRATIL: "termorretrátil", ACRILICO: "acrílico", BASTAO: "bastão", TEXTURIZADA: "texturizada", MICROTEXTURIZADA: "microtexturizada", JARDIM: "jardim", PENDENTE: "pendente", SOBREPOR: "sobrepor", EMBUTIDO: "embutido", PRISIONEIRO: "prisioneiro", PINTURA: "pintura", ANTICORROSIVO: "anticorrosivo" };
  Object.assign(acentos, { AVANT: "Avant", JR: "JR", PERFIS: "Perfis", STECK: "Steck", TIGRE: "Tigre", BLUMENAU: "Blumenau", COBRECOM: "Cobrecom", JNG: "JNG", ILUMI: "Ilumi", TYTAN: "Tytan", GAYA: "Gaya", XCTB: "XCTB", XBCTB: "XBCTB" });
  const siglas = new Set(["LED", "RGB", "USB", "RJ45", "RJ11", "BNC", "PVC", "DVR", "CFTV", "DPS", "DR", "DIN", "PP", "AAATOP", "XCTB", "CTB", "PMT", "IP20", "IP65", "IP67", "IRC"]);
  const texto = String(nome || "").replace(/\b(\d+)\s+UN\s+/g, "$1 unidades de ").replace(/\s+/g, " ").trim().split(" ").map(palavra => {
    const token = palavra.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
    if (!token) return palavra;
    const formatado = acentos[token] || (siglas.has(token) || /\d/.test(token) ? token : token.toLocaleLowerCase("pt-BR"));
    return palavra.replace(token, formatado);
  }).join(" ").replace(/(\d+(?:[.,]\d+)?)\s*(W|V|MM|CM|LM|K)\b/gi, (_, valor, unidade) => `${valor.replace(".", ",")} ${["MM", "CM", "LM"].includes(unidade.toUpperCase()) ? unidade.toLowerCase() : unidade.toUpperCase()}`);
  return texto.charAt(0).toLocaleUpperCase("pt-BR") + texto.slice(1);
}
function extrairAcabamento(nomeSemTonalidade, configuracao, emissor) {
  let nomeBase = nomeSemTonalidade;
  const acabamentos = [];
  for (const [identificador, acabamento] of Object.entries(configuracao.acabamentos)) {
    if (emissor && ["azul", "verde", "vermelho", "amarelo", "laranja", "rosa"].includes(identificador) && !/\b(?:ACABAMENTO|CARCACA|CORPO)\b/.test(nomeSemTonalidade)) continue;
    acabamento.padrao.lastIndex = 0;
    if (acabamento.padrao.test(nomeBase)) {
      acabamentos.push(identificador);
      acabamento.padrao.lastIndex = 0;
      nomeBase = nomeBase.replace(acabamento.padrao, " ");
    }
  }
  // Nunca interpreta "cobre" ou "madeira" como simples cores: são materiais.
  return { identificador: acabamentos.sort().join("+") || "nao-informado", nomeBase: nomeBase.replace(/\s+/g, " ").trim() };
}
function obterNomeDoAcabamento(identificador, configuracao) {
  return identificador === "nao-informado" ? "Não informado" : identificador.split("+").map(item => configuracao.acabamentos[item].nome).join(" / ");
}
function obterNomeDaFamilia(nome, tonalidade) {
  if (!tonalidade.cor) return nome;
  // Preserva acabamento, marca, potência, tensão, medidas e embalagem.
  return nome.replace(/\b[2-9]\d{3}\s*K\b/gi, "").replace(/\b(?:BRANC[OA]\s+(?:QUENTE|NEUTR[OA]|FRI[OA])|AMAREL[OA]\s+QUENTE)\b/gi, "").replace(/\s+/g, " ").trim();
}
function agruparProdutosDoEstoque(cadastros, configuracao) {
  const familias = new Map(), identificadores = new Set();
  for (const cadastro of cadastros) {
    if (!cadastro.id || !cadastro.nome || identificadores.has(String(cadastro.id))) throw new Error("Cadastro inválido ou ID duplicado no estoque.");
    identificadores.add(String(cadastro.id));
    const nomeNormalizado = revisarNomeDoProduto(cadastro.nome, configuracao);
    const regra = configuracao.regrasDeAgrupamento.find(item => item.padrao.test(nomeNormalizado)) || { categoria: "outros", subcategoria: "revisar", emissor: false };
    const ajuste = configuracao.ajustesPorIdentificador[cadastro.id] || {};
    const tonalidade = identificarTonalidade(nomeNormalizado, regra.emissor);
    if (Object.hasOwn(ajuste, "cor")) tonalidade.cor = ajuste.cor;
    const categoria = ajuste.categoria || regra.categoria, subcategoria = ajuste.subcategoria || regra.subcategoria;
    const nomeSemTonalidade = obterNomeDaFamilia(nomeNormalizado, tonalidade);
    // Remove os nomes de luz mesmo de cadastros mistos antes de extrair cores físicas.
    const nomeParaAcabamento = nomeSemTonalidade.replace(/\bBRANC[OA]\s+(?:QUENTE|FRI[OA]|NEUTR[OA])\b/g, "");
    const acabamento = extrairAcabamento(nomeParaAcabamento, configuracao, regra.emissor);
    const nome = ajuste.nomeDaFamilia || acabamento.nomeBase;
    const chave = [categoria, subcategoria, normalizarTexto(nome)].join("|");
    const marca = identificarMarcaVerificada(nomeNormalizado);
    const variacao = { identificador: String(cadastro.id), sku: String(cadastro.sku || ""), nomeOriginal: cadastro.original || cadastro.nome, nomeRevisado: humanizarNome(nomeNormalizado), acabamento: acabamento.identificador, cor: tonalidade.cor, temperaturaKelvin: tonalidade.temperaturaKelvin, especificacoes: extrairEspecificacoesDeclaradas(nomeNormalizado), preco: null, estoque: null };
    if (!familias.has(chave)) {
      const potencia = nomeNormalizado.match(/\b(\d+(?:[.,]\d+)?)\s*W\b/);
      familias.set(chave, { identificador: "familia-" + cadastro.id, nome: humanizarNome(nome), categoria, subcategoria, marcaId: marca?.identificador || "", origem: "interna", permiteSimulacao: Boolean(regra.emissor), potencia: potencia ? potencia[1].replace(".", ",") + " W" : "Não informada", classificacaoInterna: { codigo: categoria + "/" + subcategoria, metodo: ajuste.categoria ? "ajuste-manual" : regra.padrao ? "regra-textual" : "revisao-pendente", padraoIdentificado: regra.padrao?.source || null, chaveDeAgrupamento: chave, revisaoPendente: !regra.padrao && !ajuste.categoria }, variacoes: [] });
    }
    familias.get(chave).variacoes.push(variacao);
  }
  return [...familias.values()].sort((primeiro, segundo) => primeiro.nome.localeCompare(segundo.nome, "pt-BR"));
}
function validarConfiguracao(configuracao, produtos) {
  const identificadores = new Set(), cadastros = new Set();
  for (const produto of produtos) {
    const categoria = configuracao.categorias.find(item => item.identificador === produto.categoria);
    if (identificadores.has(produto.identificador) || !categoria?.subcategorias.some(item => item[0] === produto.subcategoria) || !produto.variacoes.length) throw new Error("Família inválida.");
    identificadores.add(produto.identificador);
    for (const variacao of produto.variacoes) {
      if (cadastros.has(variacao.identificador) || (variacao.cor && !configuracao.cores[variacao.cor])) throw new Error("Variação inválida.");
      cadastros.add(variacao.identificador);
    }
  }
  return produtos;
}
const repositorioDeProdutos = {
  async carregar() {
    // Substitua por await fetch em uma API própria; tokens Bling permanecem no servidor.
    const internos = agruparProdutosDoEstoque(dadosDoEstoque.produtos, configuracaoDoCatalogo);
    const produtos = [...internos, ...criarFamiliasExternas(dadosDoEstoque.produtos)].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
    return { produtos: validarConfiguracao(configuracaoDoCatalogo, produtos), fonte: dadosDoEstoque.fonte };
  }
};

const repositorioDeDisponibilidade = {
  async carregar() {
    const dados = typeof relatorioDeDisponibilidade === "undefined" ? null : relatorioDeDisponibilidade;
    const data = Date.parse(dados?.atualizadoEm || "");
    const validade = Number(dados?.validadeEmHoras) || 24;
    const confiavel = Number.isFinite(data) && Date.now() - data >= 0 && Date.now() - data <= validade * 60 * 60 * 1000;
    const porIdentificador = new Map(), porSku = new Map();
    if (confiavel && Array.isArray(dados.itens)) for (const item of dados.itens) {
      if (!Number.isFinite(Number(item.saldo)) || Number(item.saldo) < 0) continue;
      if (item.identificador) porIdentificador.set(String(item.identificador), item);
      if (item.sku) porSku.set(String(item.sku), item);
    }
    return { porIdentificador, porSku, atualizadoEm: confiavel ? dados.atualizadoEm : "" };
  }
};
function resolverDisponibilidade(cadastro, relatorio, origem = "interna") {
  if (origem === "parceiro") return { tipo: "encomenda", titulo: "Sob encomenda", detalhe: "Item de fonte externa; consulte prazo e condições com a loja." };
  const informado = relatorio.porIdentificador.get(cadastro.identificador) || relatorio.porSku.get(cadastro.sku);
  const saldo = Number(informado?.saldo);
  return { tipo: "estoque", titulo: "Em estoque", detalhe: informado && saldo > 0 ? `${saldo.toLocaleString("pt-BR")} unidade(s) no último relatório. Confirme antes de comprar.` : "Produto no cadastro interno. Confirme quantidade antes de comprar." };
}

// Estado e consultas não acessam o DOM nem o armazenamento do navegador.

// Sugere uma exploração da obra; não estabelece compatibilidade técnica entre itens.
const ORDEM_EDITORIAL_DA_OBRA = [
  "iluminacao/lampadas", "iluminacao/plafons", "iluminacao/spots",
  "iluminacao/pendentes", "iluminacao/arandelas", "iluminacao/luminarias",
  "sistemas-led/fitas", "sistemas-led/perfis", "sistemas-led/fontes",
  "eletrica/cabos", "eletrica/tomadas", "fixacao/fixadores"
];

function ordenarProdutosParaObra(produtos, contexto, registros) {
  const prioridades = new Map(ORDEM_EDITORIAL_DA_OBRA.map((codigo, indice) => [codigo, indice]));
  const grupos = new Map();
  for (const produto of produtos) {
    const codigo = produto.classificacaoInterna.codigo;
    if (!grupos.has(codigo)) grupos.set(codigo, []);
    grupos.get(codigo).push(produto);
  }
  const codigos = [...grupos.keys()].sort((a, b) => (prioridades.get(a) ?? Infinity) - (prioridades.get(b) ?? Infinity) || a.localeCompare(b, "pt-BR"));
  for (const codigo of codigos) {
    const pontuacoes = grupos.get(codigo).map(produto => ({ produto, pontos: classificacaoVisual.classificar(produto, contexto, registros).pontuacao }));
    pontuacoes.sort((a, b) => b.pontos - a.pontos || a.produto.nome.localeCompare(b.produto.nome, "pt-BR"));
    grupos.set(codigo, pontuacoes.map(item => item.produto));
  }
  const posicoes = new Map(codigos.map(codigo => [codigo, 0]));
  const ordenados = [];
  while (ordenados.length < produtos.length) for (const codigo of codigos) {
    const posicao = posicoes.get(codigo), grupo = grupos.get(codigo);
    if (posicao < grupo.length) { ordenados.push(grupo[posicao]); posicoes.set(codigo, posicao + 1); }
  }
  return ordenados;
}

function criarEstadoDoCatalogo(produtos, configuracao, registrosEditoriais) {
  const inicial = { categoria: "", subcategoria: "", marcaId: "", busca: "", cor: "", acabamento: "", ordenacao: "obra", porPagina: configuracao.quantidadesPorPagina[0], pagina: 1, produtoAberto: "", cadastroSelecionado: "", corDaPrevia: "neutro", brilho: 70 };
  let estadoDoProdutoAtual = { ...inicial };
  const observadores = new Set();
  const textosDeBusca = new WeakMap();
  let chaveDaConsulta = "", consultaAnterior = null;
  function consultar() {
    const atual = estadoDoProdutoAtual, termos = normalizarTexto(atual.busca).split(" ").filter(Boolean);
    const chave = JSON.stringify([atual.categoria, atual.subcategoria, atual.marcaId, atual.busca, atual.cor, atual.acabamento, atual.ordenacao, atual.porPagina, atual.pagina]);
    if (chave === chaveDaConsulta && consultaAnterior) return consultaAnterior;
    let resultados = produtos.filter(produto => {
      if (atual.categoria && produto.categoria !== atual.categoria) return false;
      if (atual.subcategoria && produto.subcategoria !== atual.subcategoria) return false;
      if (atual.marcaId && produto.marcaId !== atual.marcaId) return false;
      let texto = textosDeBusca.get(produto);
      if (termos.length && texto === undefined) {
        texto = normalizarTexto([produto.nome, produto.classificacaoInterna.codigo, ...produto.variacoes.flatMap(item => [item.sku, item.nomeOriginal, item.nomeRevisado, item.identificador])].join(" "));
        textosDeBusca.set(produto, texto);
      }
      const varianteCompativel = produto.variacoes.some(item => (!atual.cor || item.cor === atual.cor) && (!atual.acabamento || item.acabamento === atual.acabamento));
      return (!atual.categoria || produto.categoria === atual.categoria) && (!atual.subcategoria || produto.subcategoria === atual.subcategoria) && (!atual.marcaId || produto.marcaId === atual.marcaId) && varianteCompativel && termos.every(termo => texto.includes(termo));
    });
    if (atual.ordenacao === "obra") resultados = ordenarProdutosParaObra(resultados, atual, registrosEditoriais);
    else resultados.sort((primeiro, segundo) => (atual.ordenacao === "variacoes" ? segundo.variacoes.length - primeiro.variacoes.length : 0) || primeiro.nome.localeCompare(segundo.nome, "pt-BR"));
    const totalPaginas = Math.max(1, Math.ceil(resultados.length / atual.porPagina));
    const pagina = Math.max(1, Math.min(totalPaginas, atual.pagina));
    chaveDaConsulta = chave;
    consultaAnterior = { anteriores: resultados.slice(Math.max(0, pagina - 2) * atual.porPagina, (pagina - 1) * atual.porPagina), seguintes: resultados.slice(pagina * atual.porPagina, (pagina + 1) * atual.porPagina), produtos: resultados.slice((pagina - 1) * atual.porPagina, pagina * atual.porPagina), total: resultados.length, totalCadastros: resultados.reduce((total, produto) => total + produto.variacoes.length, 0), totalPaginas, pagina };
    return consultaAnterior;
  }
  function atualizar(alteracoes, motivo) {
    estadoDoProdutoAtual = { ...estadoDoProdutoAtual, ...alteracoes, corDaPrevia: motivo === "luz" ? alteracoes.corDaPrevia : estadoDoProdutoAtual.corDaPrevia };
    estadoDoProdutoAtual.pagina = consultar().pagina;
    const atual = { ...estadoDoProdutoAtual, consulta: consultar() };
    observadores.forEach(observador => observador(atual, motivo));
  }
  function filtrar(alteracoes, rolar = true) {
    const permitidos = ["busca", "cor", "acabamento", "ordenacao", "porPagina"];
    if (Object.keys(alteracoes).some(chave => !permitidos.includes(chave))) return;
    if (alteracoes.cor && !configuracao.cores[alteracoes.cor]) return;
    if (alteracoes.porPagina && !configuracao.quantidadesPorPagina.includes(alteracoes.porPagina)) return;
    atualizar({ ...alteracoes, pagina: 1 }, rolar ? "catalogo" : "busca");
  }
  return {
    observar(observador) { observadores.add(observador); observador({ ...estadoDoProdutoAtual, consulta: consultar() }, "iniciar"); return () => observadores.delete(observador); },
    filtrar,
    selecionarCategoria(categoria) { if (categoria && !configuracao.categorias.some(item => item.identificador === categoria)) return; atualizar({ categoria, subcategoria: "", marcaId: "", pagina: 1 }, "navegar"); },
    selecionarSubcategoria(subcategoria) { const categoria = configuracao.categorias.find(item => item.identificador === estadoDoProdutoAtual.categoria); if (subcategoria && !categoria?.subcategorias.some(item => item[0] === subcategoria)) return; atualizar({ subcategoria, pagina: 1 }, "navegar"); },
    voltarParaHome() { atualizar({ ...inicial, brilho: estadoDoProdutoAtual.brilho }, "navegar"); },
    explorarMarca(marcaId, termoDaLinha = "") { if (!configuracao.parceiros.some(item => item.identificador === marcaId)) return; atualizar({ ...inicial, marcaId, busca: termoDaLinha, brilho: estadoDoProdutoAtual.brilho }, "navegar"); },
    buscarNoCatalogo(termo) { atualizar({ ...inicial, busca: String(termo || "").trim(), brilho: estadoDoProdutoAtual.brilho }, "navegar"); },
    limparFiltros() { atualizar({ marcaId: "", busca: "", cor: "", acabamento: "", ordenacao: "obra", pagina: 1 }, "catalogo"); },
    limparMarca() { atualizar({ marcaId: "", pagina: 1 }, "catalogo"); },
    mudarPagina(deslocamento) { atualizar({ pagina: estadoDoProdutoAtual.pagina + deslocamento }, "paginar"); },
    abrirProduto(identificador) { const produto = produtos.find(item => item.identificador === identificador); if (!produto) return; const variacao = produto.variacoes.find(item => (!estadoDoProdutoAtual.cor || item.cor === estadoDoProdutoAtual.cor) && (!estadoDoProdutoAtual.acabamento || item.acabamento === estadoDoProdutoAtual.acabamento)) || produto.variacoes[0]; atualizar({ produtoAberto: identificador, cadastroSelecionado: variacao.identificador, corDaPrevia: estadoDoProdutoAtual.corDaPrevia }, "abrir"); },
    selecionarCadastro(identificador) { const produto = produtos.find(item => item.identificador === estadoDoProdutoAtual.produtoAberto); const variacao = produto?.variacoes.find(item => item.identificador === identificador); if (variacao) atualizar({ cadastroSelecionado: identificador, corDaPrevia: estadoDoProdutoAtual.corDaPrevia }, "variacao"); },
    selecionarCor(cor) {
      const produto = produtos.find(item => item.identificador === estadoDoProdutoAtual.produtoAberto);
      if (!produto?.permiteSimulacao || !configuracao.cores[cor]) return;
      if (estadoDoProdutoAtual.corDaPrevia === cor) return;
      atualizar({ corDaPrevia: cor }, "luz");
    },
    selecionarAcabamento(acabamento) {
      const produto = produtos.find(item => item.identificador === estadoDoProdutoAtual.produtoAberto);
      if (!produto) return;
      const variantes = produto.variacoes.filter(item => item.acabamento === acabamento);
      const variacao = variantes.find(item => item.cor === estadoDoProdutoAtual.corDaPrevia) || variantes[0];
      if (variacao) atualizar({ cadastroSelecionado: variacao.identificador }, "variacao");
    },
    ajustarBrilho(valor) { const brilho = Number(valor); if (Number.isFinite(brilho)) atualizar({ brilho: Math.max(0, Math.min(100, brilho)) }, "brilho"); },
    fecharProduto() { atualizar({ produtoAberto: "", cadastroSelecionado: "" }, "fechar"); }
  };
}

// Preferências locais são opcionais: funciona mesmo com armazenamento bloqueado.
const preferenciasDoFiltro = {
  carregar() { try { const dados = JSON.parse(localStorage.getItem("catalogo.preferenciasFiltro") || "{}"); return { lado: dados.lado === "esquerda" ? "esquerda" : "direita" }; } catch { return { lado: "direita" }; } },
  salvar(preferencias) { try { localStorage.setItem("catalogo.preferenciasFiltro", JSON.stringify(preferencias)); } catch { /* Mantém a preferência durante a sessão. */ } }
};

function criarVisualizacao(produtos, configuracao, fonte, estado, relatorio, registrosDeAnuncios) {
  const obterElemento = identificador => document.getElementById(identificador);
  const preferencias = preferenciasDoFiltro.carregar();
  let rotacaoParceirosPausada = false;
  let filtroAberto = false, indiceDoDestaque = 0, indiceDoParceiro = 0, indiceDoPacote = 0, modoParceiros = "descobrir", temporizadorDoDestaque = null, temporizadorDoParceiro = null, destaqueVisivel = false, parceiroVisivel = false, estadoAtualParaNavegacao = null, limparAnimacaoDoLogo = () => {};
  const contagens = new Map();
  produtos.forEach(produto => { contagens.set(produto.categoria, (contagens.get(produto.categoria) || 0) + 1); contagens.set(produto.categoria + "/" + produto.subcategoria, (contagens.get(produto.categoria + "/" + produto.subcategoria) || 0) + 1); });
  const categoriasDisponiveis = configuracao.categorias.filter(item => contagens.has(item.identificador));
  const destaquesDisponiveis = configuracao.destaques.filter(item => contagens.has(item.categoria));
  const linhasDosParceiros = [...new Map(configuracao.parceiros.filter(parceiro => produtos.some(produto => produto.marcaId === parceiro.identificador)).map(parceiro => [parceiro.identificador, parceiro])).values()].map(parceiro => ({ parceiro, linha: parceiro.linhas[0], indice: 0 }));
  const identificadoresAnunciados = registrosDeAnuncios.filter(registro => registro.ativo && gerenciadorDeMiniAnuncios.fonteSegura(registro.fonteUrl)).map(registro => ({ registro, produto: gerenciadorDeMiniAnuncios.localizarProduto(registro, produtos) })).filter(({ registro, produto }) => produto?.origem === "interna" && produto.marcaId === registro.parceiro).map(({ produto }) => produto.identificador);
  let pacotesDeParceiros = criarPacotesDeParceiros(produtos, linhasDosParceiros.map(item => item.parceiro), Math.random, [], [], identificadoresAnunciados);
  let categoriaProfissionalSelecionada = "";
  const numero = valor => valor.toLocaleString("pt-BR");
  function criarElemento(tag, classe, texto) { const elemento = document.createElement(tag); if (classe) elemento.className = classe; if (texto !== undefined) elemento.textContent = texto; return elemento; }
  const paginacao = criarComponentePaginacaoDoCatalogo({
    obterElemento,
    criarElemento,
    criarCartao: (produto, atual) => criarCartaoDoCatalogo(produto, atual),
    obterConsultaAtual: () => estadoAtualParaNavegacao?.consulta,
    cancelarTrilho,
    deslizarTrilho,
    habilitarGesto: (elemento, navegar) => habilitarArrasteDeSlides(elemento, navegar),
    mudarPagina: passo => estado.mudarPagina(passo)
  });
  function criarDecoracao(texto, classe = "") {
    const elemento = criarElemento("span", classe, texto);
    elemento.setAttribute("aria-hidden", "true");
    return elemento;
  }
  function criarBotao(texto, acao, classe, selecionado) { const botao = criarElemento("button", classe, texto.replace(/\s*↗/g, "")); botao.type = "button"; if (selecionado !== undefined) botao.setAttribute("aria-pressed", String(selecionado)); botao.addEventListener("click", acao); return botao; }
  function criarOpcao(valor, texto) { const opcao = criarElemento("option", "", texto); opcao.value = valor; return opcao; }
  function caminhoSeguro(caminho) { const valor = String(caminho || "").trim(); return !valor || /^[\\/]/.test(valor) || (/^[a-z][a-z\d+.-]*:/i.test(valor) && !/^https:\/\//i.test(valor)) ? "" : valor; }
  function renderizarLogo() {
    limparAnimacaoDoLogo();
    const logo = obterElemento("logo"), marca = configuracao.marca;
    logo.replaceChildren(criarElemento("span", "", marca.simbolo));
    const caminho = caminhoSeguro(marca.caminho);
    if (caminho) { const imagem = criarElemento("img"); imagem.alt = ""; imagem.addEventListener("load", () => logo.replaceChildren(imagem), { once: true }); imagem.src = caminho; }
    const nomeDaMarca = String(marca.nome || "").trim();
    const separadorDoNome = nomeDaMarca.indexOf(" ");
    obterElemento("nome-marca").textContent = separadorDoNome < 0 ? nomeDaMarca : nomeDaMarca.slice(0, separadorDoNome);
    obterElemento("localidade-marca").textContent = separadorDoNome < 0 ? "" : nomeDaMarca.slice(separadorDoNome + 1);
    obterElemento("assinatura-marca").textContent = marca.assinatura;
    const limpeza = typeof marca.animacao === "function" ? marca.animacao(logo) : null;
    limparAnimacaoDoLogo = typeof limpeza === "function" ? limpeza : () => {};
  }
  function criarLinkDeContato(rotulo, endereco, detalhe) {
    const elemento = criarElemento("a", "link-contato");
    elemento.href = endereco;
    if (/^https:\/\//i.test(endereco)) { elemento.target = "_blank"; elemento.rel = "noopener noreferrer"; }
    const textos = criarElemento("span"); textos.append(criarElemento("strong", "", rotulo), criarElemento("small", "", detalhe));
    elemento.append(textos, criarDecoracao("↗", "")); return elemento;
  }
  function renderizarContato() {
    const contato = configuracao.contato, canais = [];
    const numeroWhatsapp = String(contato.whatsappNumero || "").replace(/\D/g, "");
    if (numeroWhatsapp.length >= 10 && numeroWhatsapp.length <= 15) canais.push(criarLinkDeContato("WhatsApp", `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(contato.whatsappMensagem || "")}`, contato.whatsappNumero));
    const telefone = String(contato.telefone || "").trim();
    if (/^[+\d() .-]{8,25}$/.test(telefone)) canais.push(criarLinkDeContato("Telefone", `tel:${telefone.replace(/[^+\d]/g, "")}`, telefone));
    const email = String(contato.email || "").trim();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) canais.push(criarLinkDeContato("E-mail", `mailto:${email}`, email));
    for (const link of contato.links || []) if (link.rotulo && /^https:\/\/[^\s]+$/i.test(link.url || "")) canais.push(criarLinkDeContato(link.rotulo, link.url, link.descricao || "Abrir canal"));
    obterElemento("lista-contatos").replaceChildren(...canais);
    obterElemento("mensagem-contato").hidden = canais.length > 0;
    if (contato.endereco) obterElemento("descricao-contato").textContent = contato.endereco;
    renderizarLocalizacao();
  }
  function urlHttps(endereco) {
    try { const url = new URL(String(endereco || "").trim()); return url.protocol === "https:" && url.hostname && !url.username && !url.password ? url : null; }
    catch { return null; }
  }
  function renderizarLocalizacao() {
    const localizacao = configuracaoDeApoio.localizacao;
    const endereco = String(localizacao.endereco || "").trim();
    obterElemento("endereco-loja").textContent = endereco || "Localização em preparação.";
    const quadro = obterElemento("mapa-loja");
    const previa = urlHttps(localizacao.googleMapsEmbedUrl);
    if (endereco && previa && ["www.google.com", "google.com"].includes(previa.hostname) && previa.pathname.startsWith("/maps/embed")) {
      const mapa = criarElemento("iframe");
      mapa.title = "Localização da loja no Google Maps";
      mapa.loading = "lazy";
      mapa.referrerPolicy = "strict-origin-when-cross-origin";
      mapa.src = previa.href;
      quadro.replaceChildren(mapa);
    } else quadro.replaceChildren(criarElemento("span", "", "⌖"), criarElemento("small", "", endereco ? "Use o botão abaixo para abrir o mapa." : "Mapa disponível após configurar o endereço da loja."));
    const rotas = [];
    if (endereco) {
      const informado = urlHttps(localizacao.googleMapsUrl);
      const google = informado && ["www.google.com", "google.com", "maps.google.com"].includes(informado.hostname) && informado.pathname.startsWith("/maps") ? informado.href : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`;
      rotas.push(criarLinkDeContato("Abrir no Google Maps", google, "Mapa e rotas"));
      for (const link of localizacao.linksDeRota || []) {
        const url = urlHttps(link.url);
        if (link.rotulo && url) rotas.push(criarLinkDeContato(link.rotulo, url.href, "Abrir serviço de rota"));
      }
    }
    obterElemento("rotas-loja").replaceChildren(...rotas);
  }
  function executarAcaoDeAjuda(acao) {
    obterElemento("modal-ajuda").close();
    if (acao === "contato") { obterElemento("modal-contato").showModal(); return; }
    if (acao === "profissionais") { obterElemento("modal-profissionais").showModal(); return; }
    if (acao === "oficina") { window.location.href = "./oficina.html"; return; }
    const destino = { catalogo: "inicio-catalogo", categorias: "titulo-navegacao" }[acao];
    if (destino) obterElemento(destino).scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }
  function renderizarAjuda(termo = "") {
    const topicos = buscarTopicosDeAjuda(termo);
    obterElemento("ajuda-vazia").hidden = topicos.length > 0;
    obterElemento("lista-ajuda").replaceChildren(...topicos.map(topico => {
      const botao = criarBotao("", () => executarAcaoDeAjuda(topico.acao), "topico-ajuda");
      const texto = criarElemento("span"); texto.append(criarElemento("strong", "", topico.titulo), criarElemento("small", "", topico.resumo));
      botao.append(texto, criarDecoracao("↗", "seta-ajuda"));
      return botao;
    }));
  }
  function renderizarProfissionais() {
    const configuracaoDeProfissionais = configuracaoDeApoio.prestadores;
    const opcoes = [{ id: "", nome: "Todos" }, ...configuracaoDeProfissionais.categorias];
    obterElemento("categorias-profissionais").replaceChildren(...opcoes.map(categoria => criarBotao(categoria.nome, () => { categoriaProfissionalSelecionada = categoria.id; renderizarProfissionais(); }, "categoria-profissional", categoriaProfissionalSelecionada === categoria.id)));
    const cadastrados = configuracaoDeProfissionais.profissionais.filter(pessoa => !categoriaProfissionalSelecionada || pessoa.categoria === categoriaProfissionalSelecionada);
    obterElemento("profissionais-vazio").hidden = cadastrados.length > 0;
    obterElemento("lista-profissionais").replaceChildren(...cadastrados.map(pessoa => {
      const cartao = criarElemento("article", "cartao-profissional");
      const categoria = configuracaoDeProfissionais.categorias.find(item => item.id === pessoa.categoria);
      cartao.append(criarElemento("span", "sobretitulo", categoria?.nome || "Profissional"), criarElemento("h3", "", pessoa.nome), criarElemento("p", "", [pessoa.regiao, pessoa.descricao].filter(Boolean).join(" · ")));
      const links = criarElemento("div", "links-profissional");
      const telefone = String(pessoa.whatsappNumero || "").replace(/\D/g, "");
      if (telefone.length >= 10 && telefone.length <= 15) links.append(criarLinkDeContato("WhatsApp", `https://wa.me/${telefone}`, "Conversar"));
      for (const link of pessoa.links || []) { const url = urlHttps(link.url); if (link.rotulo && url) links.append(criarLinkDeContato(link.rotulo, url.href, "Perfil do profissional")); }
      cartao.append(links); return cartao;
    }));
  }
  function renderizarIdiomas() {
    const idiomas = configuracao.idiomas.filter(idioma => idioma.disponivel);
    obterElemento("lista-idiomas").replaceChildren(...idiomas.map(idioma => {
      const botao = criarBotao(`${idioma.nome}  ✓`, () => obterElemento("modal-idioma").close(), "opcao-idioma", true);
      botao.lang = idioma.codigo;
      return botao;
    }));
    const atual = idiomas.find(idioma => idioma.codigo === "pt-BR") || idiomas[0];
    if (atual) {
      obterElemento("abrir-idioma").setAttribute("aria-label", `Idioma: ${atual.nome}`);
      obterElemento("abrir-idioma").querySelector("span:last-child").textContent = atual.abreviacao;
    }
  }
  function obterFamiliasDoParceiro(parceiro, linha) {
    return produtos.filter(produto => produto.marcaId === parceiro.identificador && (!linha.termoDaLinha || normalizarTexto(produto.nome).includes(linha.termoDaLinha)));
  }
  function atualizarIndicadores(identificador, rotulos, selecionado, selecionar) {
    const navegacao = obterElemento(identificador);
    if (navegacao.children.length !== rotulos.length) navegacao.replaceChildren(...rotulos.map((rotulo, indice) => {
      const botao = criarBotao("", () => selecionar(indice), "indicador-etapa");
      botao.setAttribute("aria-label", `${rotulo} (${indice + 1} de ${rotulos.length})`);
      return botao;
    }));
    [...navegacao.children].forEach((botao, indice) => {
      botao.setAttribute("aria-label", `${rotulos[indice]} (${indice + 1} de ${rotulos.length})`);
      if (indice === selecionado) botao.setAttribute("aria-current", "step");
      else botao.removeAttribute("aria-current");
    });
  }
  function aplicarClassificacaoVisual(elemento, avaliacao, recipiente = elemento) {
    elemento.dataset.nivelVisual = avaliacao.nivel.id;
    let selo = recipiente.querySelector(":scope > .selo-classificacao");
    if (!selo) {
      selo = criarElemento("span", "selo-classificacao");
      recipiente.append(selo);
    }
    const simbolo = criarDecoracao(avaliacao.nivel.simbolo, "simbolo-classificacao");
    selo.replaceChildren(simbolo, document.createTextNode(avaliacao.nivel.rotulo));
    // A explicação funciona com mouse, toque e teclado, sem depender da cor.
    let explicacao = recipiente.querySelector(":scope > .explicacao-classificacao");
    if (!explicacao && elemento.tagName !== "BUTTON") {
      explicacao = criarElemento("details", "explicacao-classificacao");
      recipiente.append(explicacao);
    }
    if (explicacao) {
      const aberta = explicacao.open;
      explicacao.replaceChildren(criarElemento("summary", "", "Sobre este destaque"),
        criarElemento("p", "", (avaliacao.motivos.join(" ") || "Produto disponível para explorar no catálogo.") + " O nível indica relevância editorial, não qualidade, raridade ou saldo em estoque."));
      explicacao.open = aberta;
    }
  }
  function avaliarSelecaoVisual(produtosDaSelecao) {
    const avaliacoes = classificacaoVisual.classificarGrupo(produtosDaSelecao, estadoAtualParaNavegacao || {}, registrosDeAnuncios);
    return avaliacoes.sort((a, b) => b.indice - a.indice || b.pontuacao - a.pontuacao)[0]
      || { nivel: classificacaoVisual.configuracao.niveis[0], motivos: [] };
  }
  function renderizarParceiro() {
    const modulo = obterElemento("parceiros"), atual = linhasDosParceiros[indiceDoParceiro];
    modulo.hidden = !atual;
    if (!atual) return;
    const descobrindo = modoParceiros === "descobrir" && pacotesDeParceiros.length > 0;
    const { parceiro, linha } = atual;
    const marca = obterElemento("marca-parceiro"), midia = obterElemento("midia-parceiro");
    if (descobrindo) {
      const pacote = pacotesDeParceiros[indiceDoPacote];
      obterElemento("contagem-parceiro").textContent = `${numero(linhasDosParceiros.length)} marcas · ${numero(pacotesDeParceiros.length)} seleções`;
      marca.textContent = "Descobrir juntos";
      obterElemento("indice-parceiro").textContent = `Seleção ${String(indiceDoPacote + 1).padStart(2, "0")} / ${String(pacotesDeParceiros.length).padStart(2, "0")}`;
      obterElemento("linha-parceiro").textContent = pacote.titulo;
      obterElemento("descricao-parceiro").textContent = pacote.descricao;
      midia.replaceChildren(criarElemento("span", "simbolo-parceiro", "✦"), criarElemento("small", "", pacote.produtos.map(item => configuracao.parceiros.find(marcaAtual => marcaAtual.identificador === item.marcaId)?.nome).join(" · ")));
      obterElemento("explorar-parceiro").textContent = "Ver produtos da seleção";
      obterElemento("explorar-parceiro").onclick = () => obterElemento("vitrine-parceiro").scrollIntoView({ block: "center", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      const anuncios = new Map(linhasDosParceiros.flatMap(item => gerenciadorDeMiniAnuncios.selecionar({ parceiro: item.parceiro, linha: item.linha, produtos: obterFamiliasDoParceiro(item.parceiro, item.linha), contexto: estadoAtualParaNavegacao || {}, registros: registrosDeAnuncios })).map(item => [item.produto.identificador, item.registro]));
      preencherVitrine(pacote.produtos.map(produto => ({ produto, registro: anuncios.get(produto.identificador) || null })), `${pacote.produtos.length} produtos · ${new Set(pacote.produtos.map(item => item.marcaId)).size} marcas`, "Produtos que se complementam");
    } else {
      const cadastrados = obterFamiliasDoParceiro(parceiro, linha);
      obterElemento("contagem-parceiro").textContent = `${numero(cadastrados.length)} famílias · ${numero(linhasDosParceiros.length)} marcas`;
      marca.textContent = parceiro.nome;
      const caminhoDoLogo = caminhoSeguro(moduloDeMidia.parceiros[parceiro.identificador]?.logo);
      if (caminhoDoLogo) { const imagem = criarElemento("img"); imagem.alt = parceiro.nome; imagem.addEventListener("load", () => { if (modoParceiros === "marca" && linhasDosParceiros[indiceDoParceiro] === atual) marca.replaceChildren(imagem); }, { once: true }); imagem.src = caminhoDoLogo; }
      obterElemento("indice-parceiro").textContent = `Marca ${String(indiceDoParceiro + 1).padStart(2, "0")} / ${String(linhasDosParceiros.length).padStart(2, "0")}`;
      obterElemento("linha-parceiro").textContent = linha.nome;
      obterElemento("descricao-parceiro").textContent = linha.descricao;
      midia.replaceChildren(criarElemento("span", "simbolo-parceiro", parceiro.simbolo), criarElemento("small", "", "Imagem da marca em preparação"));
      const caminhoDaLinha = caminhoSeguro(moduloDeMidia.parceiros[parceiro.identificador]?.linhas?.[0]);
      if (caminhoDaLinha) { const imagem = criarElemento("img"); imagem.alt = parceiro.nome; imagem.addEventListener("load", () => { if (modoParceiros === "marca" && linhasDosParceiros[indiceDoParceiro] === atual) midia.replaceChildren(imagem); }, { once: true }); imagem.src = caminhoDaLinha; }
      obterElemento("explorar-parceiro").textContent = "Ver marca no catálogo";
      obterElemento("explorar-parceiro").onclick = () => estado.explorarMarca(parceiro.identificador);
      renderizarVitrineDoParceiro(parceiro, linha);
    }
    const nomesDasAbas = linhasDosParceiros.map(item => item.parceiro.nome);
    atualizarIndicadores("pontos-parceiro", nomesDasAbas, descobrindo ? -1 : indiceDoParceiro, indice => selecionarAbaDoParceiro(indice + 1));
    obterElemento("descobrir-marcas").setAttribute("aria-pressed", String(descobrindo));
    [...obterElemento("pontos-parceiro").children].forEach((botao, posicao) => {
      botao.textContent = nomesDasAbas[posicao];
    });
    filtrarAbasDeMarcas();
    obterElemento("controles-pacotes").hidden = !descobrindo;
    atualizarIndicadores("pontos-pacotes", pacotesDeParceiros.map(item => item.titulo), indiceDoPacote, indice => {
      if (indice === indiceDoPacote) return;
      transicionarParceiro(indice > indiceDoPacote ? 1 : -1, () => { indiceDoPacote = indice; });
      iniciarParceiros();
    });
    atualizarControleDaRotacao();
    const produtosDaSelecao = descobrindo ? pacotesDeParceiros[indiceDoPacote].produtos : obterFamiliasDoParceiro(parceiro, linha);
    aplicarClassificacaoVisual(obterElemento("palco-parceiro"), avaliarSelecaoVisual(produtosDaSelecao), obterElemento("conteudo-parceiro"));
    renderizarPreviasDoParceiro();
    estabilizarBanners();
  }
  function filtrarAbasDeMarcas(reiniciar = false) {
    const busca = normalizarTexto(obterElemento("busca-marca").value);
    const trilho = obterElemento("pontos-parceiro");
    [...trilho.children].forEach(botao => { botao.hidden = Boolean(busca) && !normalizarTexto(botao.textContent).includes(busca); });
    obterElemento("marcas-vazias").hidden = [...trilho.children].some(botao => !botao.hidden);
    obterElemento("limpar-busca-marca").hidden = !obterElemento("busca-marca").value;
    if (reiniciar) trilho.scrollTo({ left: 0, behavior: "instant" });
  }
  function atualizarControleDaRotacao() {
    const controle = obterElemento("pausar-pacotes");
    const rotulo = rotacaoParceirosPausada ? "Retomar rotação automática" : "Pausar rotação automática";
    controle.textContent = rotacaoParceirosPausada ? "▶" : "Ⅱ";
    controle.setAttribute("aria-label", rotulo);
    controle.title = rotulo;
    controle.setAttribute("aria-pressed", String(rotacaoParceirosPausada));
  }
  const animacoesDosTrilhos = new Map();
  let larguraDosBanners = 0, alturaDosBanners = 0, direcaoDaVitrine = 1;
  const animacoesDaVitrine = new Set();
  function estabilizarBanners() {
    const trilho = obterElemento("trilho-parceiros");
    if (!trilho || !trilho.getClientRects().length) return;
    const paineis = [...trilho.children];
    if (window.matchMedia("(max-width:750px)").matches) {
      larguraDosBanners = 0;
      alturaDosBanners = 0;
      paineis.forEach(painel => { if (painel.style.minHeight) painel.style.removeProperty("min-height"); });
      return;
    }
    const largura = trilho.parentElement.clientWidth;
    if (Math.abs(largura - larguraDosBanners) > 1) {
      larguraDosBanners = largura;
      alturaDosBanners = 0;
      paineis.forEach(painel => painel.style.removeProperty("min-height"));
    }
    // Mantém a maior altura natural nesta largura, inclusive na troca do centro.
    alturaDosBanners = Math.ceil(Math.max(alturaDosBanners, ...paineis.map(painel => painel.getBoundingClientRect().height)));
    paineis.forEach(painel => { painel.style.minHeight = alturaDosBanners + "px"; });
  }
  function cancelarAnimacoesDaVitrine() {
    animacoesDaVitrine.forEach(animacao => animacao.cancel());
    animacoesDaVitrine.clear();
  }
  function animarVitrine(elemento, quadros, duracao) {
    const animacao = elemento.animate(quadros, { duration: duracao, easing: "cubic-bezier(.22,.72,.18,1)" });
    animacoesDaVitrine.add(animacao);
    animacao.onfinish = () => { animacoesDaVitrine.delete(animacao); animacao.cancel(); };
  }
  function cancelarTrilho(trilho) {
    const animacao = animacoesDosTrilhos.get(trilho);
    if (animacao) { animacao.cancel(); animacoesDosTrilhos.delete(trilho); }
  }
  function deslizarTrilho(trilho, direcao, concluir, usarPosicoesResponsivas = false) {
    if (animacoesDosTrilhos.has(trilho)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { concluir(); return; }
    let quadros;
    if (usarPosicoesResponsivas) {
      // Percentuais e o recorte acompanham o painel se a janela mudar durante a transição.
      const posicaoCentral = "translateX(calc(-100% + var(--recorte) + var(--recorte) + var(--recorte) - var(--espaco-4)))";
      const posicaoAnterior = "translateX(var(--recorte))";
      const posicaoSeguinte = "translateX(calc(-200% + var(--recorte) + var(--recorte) + var(--recorte) + var(--recorte) + var(--recorte) - var(--espaco-4) - var(--espaco-4)))";
      quadros = [
        { transform: posicaoCentral },
        { transform: direcao > 0 ? posicaoSeguinte : posicaoAnterior }
      ];
    } else {
      const passo = trilho.children[1].getBoundingClientRect().width + (parseFloat(getComputedStyle(trilho).columnGap) || 0);
      const posicaoInicial = getComputedStyle(trilho).transform;
      const matriz = new DOMMatrixReadOnly(posicaoInicial);
      quadros = [{ transform: posicaoInicial }, { transform: "translateX(" + (matriz.m41 - Math.sign(direcao) * passo) + "px)" }];
    }
    const animacao = trilho.animate(quadros, { duration: 620, easing: "cubic-bezier(.22,.72,.18,1)", fill: "forwards" });
    animacoesDosTrilhos.set(trilho, animacao);
    animacao.onfinish = () => { animacoesDosTrilhos.delete(trilho); concluir(); animacao.cancel(); };
  }
  function transicionarParceiro(direcao, alterarSelecao) {
    const trilho = obterElemento("trilho-parceiros");
    if (animacoesDosTrilhos.has(trilho)) return;
    const anterior = { modo: modoParceiros, pacote: indiceDoPacote, parceiro: indiceDoParceiro };
    alterarSelecao();
    const destino = { modo: modoParceiros, pacote: indiceDoPacote, parceiro: indiceDoParceiro };
    const descoberta = modoParceiros === "descobrir";
    const item = descoberta ? pacotesDeParceiros[indiceDoPacote] : linhasDosParceiros[indiceDoParceiro];
    modoParceiros = anterior.modo; indiceDoPacote = anterior.pacote; indiceDoParceiro = anterior.parceiro;
    preencherBannerVizinho(obterElemento(direcao > 0 ? "previa-parceiro-proxima" : "previa-parceiro-anterior"), item, descoberta, direcao);
    estabilizarBanners();
    direcaoDaVitrine = Math.sign(direcao) || 1;
    cancelarAnimacoesDaVitrine();
    const vitrine = obterElemento("vitrine-parceiro");
    if (!vitrine.hidden && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      animarVitrine(obterElemento("grade-parceiro"), [
        { opacity: 1, transform: "translateX(0)" },
        { opacity: .45, transform: "translateX(" + (-direcaoDaVitrine * 12) + "px)" }
      ], 620);
    }
    deslizarTrilho(trilho, direcao, () => {
      modoParceiros = destino.modo; indiceDoPacote = destino.pacote; indiceDoParceiro = destino.parceiro;
      renderizarParceiro(); revelarAbaDaMarca(); iniciarParceiros();
    }, true);
  }
  function renderizarPreviasDoParceiro() {
    const descoberta = modoParceiros === "descobrir" && pacotesDeParceiros.length > 0;
    const colecao = descoberta ? pacotesDeParceiros : linhasDosParceiros;
    const indice = descoberta ? indiceDoPacote : indiceDoParceiro;
    for (const [lado, passo] of [["anterior", -1], ["proxima", 1]]) {
      const botao = obterElemento("previa-parceiro-" + lado);
      const item = colecao[(indice + passo + colecao.length) % colecao.length];
      preencherBannerVizinho(botao, item, descoberta, passo);
    }
  }
  function preencherBannerVizinho(botao, item, descoberta, passo) {
      if (!item) return;
      const titulo = descoberta ? item.titulo : item.linha.nome;
      const marca = descoberta ? "Descobrir juntos" : item.parceiro.nome;
      const midia = criarElemento("span", "midia-parceiro");
      midia.append(criarElemento("span", "simbolo-parceiro", descoberta ? "✦" : item.parceiro.simbolo));
      midia.append(criarElemento("small", "", descoberta ? item.produtos.map(produto => configuracao.parceiros.find(marca => marca.identificador === produto.marcaId)?.nome).join(" · ") : "Imagem da marca em preparação"));
      const conteudo = criarElemento("span", "conteudo-parceiro");
      const colecao = descoberta ? pacotesDeParceiros : linhasDosParceiros;
      const indice = colecao.indexOf(item);
      const referencia = `${descoberta ? "Seleção" : "Marca"} ${String(indice + 1).padStart(2, "0")} / ${String(colecao.length).padStart(2, "0")}`;
      conteudo.append(criarElemento("span", "marca-parceiro", marca), criarElemento("span", "sobretitulo", referencia), criarElemento("strong", "titulo-banner-vizinho", titulo), criarElemento("span", "descricao-banner-vizinho", descoberta ? item.descricao : item.linha.descricao));
      const acao = criarElemento("span", "acoes-parceiro");
      acao.append(criarElemento("span", "acao-previa", descoberta ? "Ver produtos da seleção ↗" : "Ver marca no catálogo ↗"));
      conteudo.append(acao);
      botao.replaceChildren(midia, conteudo);
      const produtosDaSelecao = descoberta ? item.produtos : obterFamiliasDoParceiro(item.parceiro, item.linha);
      aplicarClassificacaoVisual(botao, avaliarSelecaoVisual(produtosDaSelecao), conteudo);
      botao.setAttribute("aria-label", (passo < 0 ? "Anterior: " : "Próxima: ") + titulo);
  }
  function selecionarAbaDoParceiro(indice) {
    const anterior = modoParceiros === "descobrir" ? 0 : indiceDoParceiro + 1;
    if (indice === anterior) return;
    transicionarParceiro(indice > anterior ? 1 : -1, () => {
      modoParceiros = indice === 0 ? "descobrir" : "marca";
      if (indice > 0) indiceDoParceiro = indice - 1;
    });
    revelarAbaDaMarca(); iniciarParceiros();
  }
  function revelarAbaDaMarca() {
    const trilho = obterElemento("pontos-parceiro"), ativa = trilho.querySelector('[aria-current="step"]');
    if (!ativa || ativa.hidden) return;
    const limite = trilho.getBoundingClientRect(), posicao = ativa.getBoundingClientRect();
    if (posicao.left < limite.left || posicao.right > limite.right) trilho.scrollTo({ left: trilho.scrollLeft + posicao.left - limite.left - 12, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }
  function renderizarVitrineDoParceiro(parceiro, linha) {
    const familias = obterFamiliasDoParceiro(parceiro, linha);
    const anuncios = gerenciadorDeMiniAnuncios.selecionar({ parceiro, linha, produtos: familias, contexto: estadoAtualParaNavegacao || {}, registros: registrosDeAnuncios });
    const selecionados = anuncios.length ? anuncios : familias.slice(0, 3).map(produto => ({ produto, registro: null }));
    preencherVitrine(selecionados, anuncios.length ? `${numero(familias.length)} famílias · seleção em destaque` : `${numero(familias.length)} famílias no nosso catálogo`, `Produtos ${parceiro.nome}`);
  }
  function preencherVitrine(selecionados, resumo, titulo) {
    const vitrine = obterElemento("vitrine-parceiro");
    const grade = obterElemento("grade-parceiro");
    const alturaAnterior = vitrine.hidden ? 0 : vitrine.getBoundingClientRect().height;
    cancelarAnimacoesDaVitrine();
    obterElemento("vitrine-parceiro").hidden = !selecionados.length;
    obterElemento("titulo-vitrine").textContent = titulo;
    obterElemento("resumo-vitrine").textContent = resumo;
    const classificacoes = new Map(classificacaoVisual.classificarGrupo(selecionados.map(item => item.produto), estadoAtualParaNavegacao || {}, registrosDeAnuncios).map(item => [item.produto.identificador, item]));
    grade.replaceChildren(...selecionados.map(({ produto, registro }) => {
      const nomeDaMarca = configuracao.parceiros.find(item => item.identificador === produto.marcaId)?.nome || "Marca";
      const disponibilidade = resolverDisponibilidade(produto.variacoes[0], relatorio, produto.origem);
      const cartao = criarElemento("article", "item-parceiro" + (registro ? " mini-anuncio" : ""));
      cartao.style.setProperty("--cor-anuncio", configuracao.atmosferaPorCategoria[produto.categoria] || "#9ebade");
      cartao.append(criarElemento("span", "codigo-parceiro", registro ? `${nomeDaMarca} · Em destaque` : nomeDaMarca));
      if (registro?.titulo) cartao.append(criarElemento("span", "titulo-mini-anuncio", registro.titulo));
      cartao.append(criarElemento("strong", "", produto.nome));
      if (registro?.chamada) cartao.append(criarElemento("p", "chamada-mini-anuncio", registro.chamada));
      const status = criarElemento("span", "selo-disponibilidade", disponibilidade.titulo); status.dataset.tipo = disponibilidade.tipo; cartao.append(status);
      aplicarClassificacaoVisual(cartao, classificacoes.get(produto.identificador));
      cartao.append(criarBotao("Ver detalhes ↗", () => estado.abrirProduto(produto.identificador), "abrir-item-parceiro"));
      return cartao;
    }));
    grade.scrollLeft = 0;
    if (alturaAnterior > 0 && selecionados.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const alturaNova = vitrine.getBoundingClientRect().height;
      animarVitrine(vitrine, [{ height: alturaAnterior + "px" }, { height: alturaNova + "px" }], 420);
      animarVitrine(obterElemento("grade-parceiro"), [
        { opacity: .45, transform: "translateX(" + (direcaoDaVitrine * 12) + "px)" },
        { opacity: 1, transform: "translateX(0)" }
      ], 420);
    }
  }
  function pausarParceiros() { if (temporizadorDoParceiro) clearTimeout(temporizadorDoParceiro); temporizadorDoParceiro = null; }
  function iniciarParceiros() {
    pausarParceiros();
    if (rotacaoParceirosPausada || modoParceiros !== "descobrir" || pacotesDeParceiros.length < 2 || !parceiroVisivel || document.hidden || document.querySelector("dialog[open]") || obterElemento("parceiros").matches(":hover, :focus-within") || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    temporizadorDoParceiro = window.setTimeout(() => { moverParceiro(1); iniciarParceiros(); }, 11000);
  }
  function moverParceiro(deslocamento) {
    transicionarParceiro(deslocamento, () => {
      if (modoParceiros === "descobrir") {
      if (!pacotesDeParceiros.length) return;
      const proximo = (indiceDoPacote + deslocamento + pacotesDeParceiros.length) % pacotesDeParceiros.length;
      indiceDoPacote = proximo;
      } else indiceDoParceiro = (indiceDoParceiro + deslocamento + linhasDosParceiros.length) % linhasDosParceiros.length;
    });
    if (modoParceiros === "marca") revelarAbaDaMarca();
  }
  function renderizarDestaque() {
    const destaque = destaquesDisponiveis[indiceDoDestaque];
    obterElemento("destaque").hidden = !destaque;
    if (!destaque) return;
    const categoria = configuracao.categorias.find(item => item.identificador === destaque.categoria);
    obterElemento("destaque-indice").textContent = `${String(indiceDoDestaque + 1).padStart(2, "0")} / ${String(destaquesDisponiveis.length).padStart(2, "0")} · ${categoria.nome}`;
    obterElemento("destaque-titulo").textContent = destaque.chamada;
    obterElemento("destaque-descricao").textContent = destaque.descricao;
    atualizarIndicadores("pontos-destaque", destaquesDisponiveis.map(item => item.chamada), indiceDoDestaque, indiceSelecionado => { indiceDoDestaque = indiceSelecionado; renderizarDestaque(); iniciarDestaques(); });
    obterElemento("destaque").dataset.indice = String(indiceDoDestaque);
    obterElemento("destaque-explorar").onclick = () => estado.selecionarCategoria(destaque.categoria);
    obterElemento("destaque-conteudo").classList.remove("entrando");
    void obterElemento("destaque-conteudo").offsetWidth;
    obterElemento("destaque-conteudo").classList.add("entrando");
  }
  function moverDestaque(deslocamento) {
    if (!destaquesDisponiveis.length) return;
    indiceDoDestaque = (indiceDoDestaque + deslocamento + destaquesDisponiveis.length) % destaquesDisponiveis.length;
    renderizarDestaque();
  }
  function pausarDestaques() { if (temporizadorDoDestaque) clearInterval(temporizadorDoDestaque); temporizadorDoDestaque = null; }
  function iniciarDestaques() {
    pausarDestaques();
    if (destaquesDisponiveis.length < 2 || !destaqueVisivel || document.hidden || obterElemento("destaque").matches(":hover, :focus-within") || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    temporizadorDoDestaque = window.setInterval(() => moverDestaque(1), 9000);
  }
  function criarMidia(produto, cadastro) {
    const area = criarElemento("div", "midia"), cor = configuracao.cores[cadastro.cor];
    area.dataset.iluminado = String(Boolean(cor)); area.style.setProperty("--cor-luz", cor?.corVisual || "#7894ba");
    const ausencia = criarElemento("div", "sem-midia"), simbolo = criarElemento("span", "", cor ? "✧" : configuracao.categorias.find(item => item.identificador === produto.categoria).simbolo);
    simbolo.setAttribute("aria-hidden", "true"); ausencia.append(simbolo, criarElemento("small", "", "Imagem ainda não cadastrada")); area.append(ausencia);
    const caminho = caminhoSeguro(moduloDeMidia.obterCaminho(cadastro));
    if (caminho) {
      const imagem = criarElemento("img"); imagem.alt = cadastro.nomeOriginal; imagem.hidden = true; imagem.decoding = "async";
      imagem.addEventListener("load", () => { imagem.hidden = false; ausencia.hidden = true; }, { once: true });
      imagem.addEventListener("error", () => { imagem.remove(); ausencia.lastElementChild.textContent = "Imagem indisponível"; }, { once: true });
      area.append(imagem); imagem.src = caminho;
    }
    return area;
  }
  function renderizarPainel() {
    const estrutura = obterElemento("estrutura-catalogo"), painel = obterElemento("painel-filtros");
    estrutura.dataset.lado = preferencias.lado; estrutura.dataset.aberto = String(filtroAberto); painel.hidden = !filtroAberto;
    obterElemento("lado-filtro").value = preferencias.lado;
    for (const identificador of ["alternar-filtro", "filtro-flutuante"]) {
      const botao = obterElemento(identificador); botao.setAttribute("aria-expanded", String(filtroAberto)); botao.querySelector(".rotulo-filtro").textContent = filtroAberto ? "Esconder filtros" : "Filtrar";
    }
    obterElemento("filtro-flutuante").dataset.lado = preferencias.lado;
    obterElemento("home-flutuante").dataset.lado = preferencias.lado === "esquerda" ? "direita" : "esquerda";
  }
  function alternarPainel(abrir) {
    const focoDentro = obterElemento("painel-filtros").contains(document.activeElement);
    filtroAberto = abrir; renderizarPainel();
    if (abrir) obterElemento("busca").focus({ preventScroll: true });
    else if (focoDentro) obterElemento(window.matchMedia("(max-width:750px)").matches ? "alternar-filtro" : "filtro-flutuante").focus({ preventScroll: true });
  }
  function renderizarNavegacao(atual) {
    const foco = document.activeElement, navegacao = foco?.closest("nav"), chaveComFoco = foco?.dataset.chave;
    document.documentElement.style.setProperty("--cor-categoria", configuracao.atmosferaPorCategoria[atual.categoria || "home"] || configuracao.atmosferaPorCategoria.home);
    const categorias = obterElemento("categorias");
    const todas = criarBotao("Todas", () => estado.selecionarCategoria(""), "categoria categoria-todas", !atual.categoria);
    todas.dataset.chave = "";
    todas.setAttribute("aria-label", "Todas as categorias");
    categorias.replaceChildren(todas, ...categoriasDisponiveis.map(categoria => {
      const botao = criarBotao("", () => estado.selecionarCategoria(categoria.identificador), "categoria", atual.categoria === categoria.identificador); botao.dataset.chave = categoria.identificador;
      botao.setAttribute("aria-label", `${categoria.nome}, ${numero(contagens.get(categoria.identificador))} famílias`);
      const simbolo = criarElemento("span", "icone-categoria", categoria.simbolo); simbolo.setAttribute("aria-hidden", "true");
      const textos = criarElemento("span"); textos.append(criarElemento("strong", "", categoria.nome)); botao.append(simbolo, textos); return botao;
    }));
    const categoria = configuracao.categorias.find(item => item.identificador === atual.categoria), subcategoria = categoria?.subcategorias.find(item => item[0] === atual.subcategoria);
    const subcategorias = obterElemento("subcategorias");
    const disponiveis = categoria?.subcategorias.filter(item => contagens.has(categoria.identificador + "/" + item[0])) || [];
    const celular = window.matchMedia("(max-width:750px)").matches;
    const mostrarSubcategorias = Boolean(categoria && (!celular || disponiveis.length > 1));
    obterElemento("trilho-subcategorias").hidden = !mostrarSubcategorias;
    const criarAtalho = (identificador, nome, quantidade) => { const botao = criarBotao(nome, () => estado.selecionarSubcategoria(identificador), "", atual.subcategoria === identificador); botao.dataset.chave = identificador; botao.append(criarElemento("span", "", numero(quantidade))); return botao; };
    subcategorias.replaceChildren(...(categoria ? [criarAtalho("", "Todos", contagens.get(categoria.identificador) || 0), ...disponiveis.map(item => criarAtalho(item[0], item[1], contagens.get(categoria.identificador + "/" + item[0])))] : []));
    window.requestAnimationFrame(() => {
      if (celular) {
        const selecionada = categorias.querySelector('[aria-pressed="true"]');
        if (selecionada) categorias.scrollTo({ left: selecionada.offsetLeft - categorias.offsetLeft - 12, behavior: "auto" });
      }
      if (mostrarSubcategorias && atual.subcategoria) {
        const selecionada = subcategorias.querySelector('[aria-pressed="true"]');
        if (selecionada) subcategorias.scrollTo({ left: selecionada.offsetLeft - subcategorias.offsetLeft - 12, behavior: "auto" });
      }
      if (mostrarSubcategorias) atualizarSetasSubcategorias();
    });
    if (navegacao && chaveComFoco !== undefined) Array.from(navegacao.children).find(botao => botao.dataset.chave === chaveComFoco)?.focus({ preventScroll: true });
    const marcaSelecionada = configuracao.parceiros.find(item => item.identificador === atual.marcaId);
    obterElemento("caminho").textContent = ["Catálogo", marcaSelecionada?.nome, categoria?.nome, subcategoria?.[1]].filter(Boolean).join(" / ");
    obterElemento("titulo").textContent = subcategoria?.[1] || categoria?.nome || "Tudo para o seu próximo projeto.";
  }
  function atualizarSetasSubcategorias() {
    const trilho = obterElemento("subcategorias");
    obterElemento("subcategoria-anterior").disabled = trilho.scrollLeft <= 2;
    obterElemento("subcategoria-proxima").disabled = trilho.scrollLeft + trilho.clientWidth >= trilho.scrollWidth - 2;
  }
  function rolarParaCatalogo(focarResultados = false) {
    window.requestAnimationFrame(() => {
      const celular = window.matchMedia("(max-width:750px)").matches;
      const movimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      obterElemento("inicio-catalogo").scrollIntoView({ block: "start", behavior: celular || movimentoReduzido ? "auto" : "smooth" });
      if (celular && focarResultados) obterElemento("contagem").focus({ preventScroll: true });
    });
  }
  function encaixarMarcaAposArraste(trilho) {
    const marcas = [...trilho.children].filter(botao => !botao.hidden);
    if (!marcas.length) return;
    const inicio = marcas[0].offsetLeft;
    const posicoes = marcas.map(botao => botao.offsetLeft - inicio);
    const destino = posicoes.reduce((maisProxima, posicao) =>
      Math.abs(posicao - trilho.scrollLeft) < Math.abs(maisProxima - trilho.scrollLeft) ? posicao : maisProxima);
    trilho.scrollTo({ left: destino, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }
  function habilitarGesto(elemento, eixo, mudarSlide = null) {
    elemento.dataset.gesto = eixo;
    let gesto = null, bloquearCliqueAte = 0;
    const limpar = () => {
      const anterior = gesto; gesto = null;
      elemento.classList.remove("arrastando"); elemento.style.removeProperty("--arraste-x");
      if (anterior && elemento.hasPointerCapture(anterior.id)) elemento.releasePointerCapture(anterior.id);
    };
    elemento.addEventListener("pointerdown", evento => {
      if (!evento.isPrimary || evento.button !== 0 || gesto || evento.target.closest("[data-gesto]") !== elemento) return;
      if (evento.target.closest("input,select,textarea,summary,a,dialog") || ((eixo === "vertical" || mudarSlide) && evento.target.closest("button"))) return;
      if (!mudarSlide && eixo === "horizontal" && elemento.scrollWidth <= elemento.clientWidth) return;
      if (evento.pointerType === "touch" && !mudarSlide) return; // Rolagem nativa preserva inércia e zoom no celular.
      bloquearCliqueAte = 0;
      gesto = { id: evento.pointerId, x: evento.clientX, y: evento.clientY, ultimoX: evento.clientX, ultimoY: evento.clientY, ativo: false, eixoAtivo: "" };
    });
    elemento.addEventListener("pointermove", evento => {
      if (!gesto || evento.pointerId !== gesto.id) return;
      const horizontal = evento.clientX - gesto.x, vertical = evento.clientY - gesto.y;
      const principal = eixo === "horizontal" ? horizontal : vertical, transversal = eixo === "horizontal" ? vertical : horizontal;
      if (!gesto.ativo) {
        if (Math.max(Math.abs(principal), Math.abs(transversal)) < 8) return;
        const rolarPagina = eixo === "horizontal" && Math.abs(vertical) > Math.abs(horizontal) && evento.pointerType !== "touch";
        if (Math.abs(transversal) > Math.abs(principal) && !rolarPagina) { limpar(); return; }
        gesto.eixoAtivo = rolarPagina ? "vertical" : eixo;
        gesto.ativo = true; elemento.setPointerCapture(evento.pointerId); elemento.classList.add("arrastando");
      }
      evento.preventDefault();
      if (gesto.eixoAtivo === "vertical") window.scrollBy({ top: gesto.ultimoY - evento.clientY, behavior: "auto" });
      else if (mudarSlide) elemento.style.setProperty("--arraste-x", `${Math.max(-65, Math.min(65, horizontal * .3))}px`);
      else if (eixo === "horizontal") elemento.scrollLeft -= evento.clientX - gesto.ultimoX;
      gesto.ultimoX = evento.clientX; gesto.ultimoY = evento.clientY;
    }, { passive: false });
    elemento.addEventListener("pointerup", evento => {
      if (!gesto || evento.pointerId !== gesto.id) return;
      const distancia = evento.clientX - gesto.x, ativo = gesto.ativo, eixoAtivo = gesto.eixoAtivo;
      if (ativo) bloquearCliqueAte = performance.now() + 350;
      limpar();
      if (ativo && eixoAtivo === "horizontal" && elemento.id === "pontos-parceiro") encaixarMarcaAposArraste(elemento);
      if (ativo && eixoAtivo === "horizontal" && mudarSlide && Math.abs(distancia) >= Math.min(70, elemento.clientWidth * .16)) mudarSlide(distancia < 0 ? 1 : -1);
    });
    for (const evento of ["pointercancel", "lostpointercapture"]) elemento.addEventListener(evento, limpar);
    window.addEventListener("pointerup", () => { if (gesto && !gesto.ativo) limpar(); });
    window.addEventListener("blur", limpar);
    elemento.addEventListener("dragstart", evento => evento.preventDefault());
    elemento.addEventListener("click", evento => { if (evento.detail !== 0 && performance.now() < bloquearCliqueAte) { evento.preventDefault(); evento.stopImmediatePropagation(); } }, true);
  }
  function habilitarArrasteParaRolagem(elemento, eixo) { habilitarGesto(elemento, eixo); }
  function habilitarArrasteDeSlides(elemento, mudar) { habilitarGesto(elemento, "horizontal", mudar); }
  function renderizarFiltrosAtivos(atual) {
    const filtros = [];
    if (atual.marcaId) filtros.push(criarBotao(`Marca: ${configuracao.parceiros.find(item => item.identificador === atual.marcaId)?.nome || atual.marcaId} ×`, () => estado.limparMarca()));
    if (atual.busca.trim()) filtros.push(criarBotao(`Busca: ${atual.busca.trim()} ×`, () => estado.filtrar({ busca: "" })));
    if (atual.cor) filtros.push(criarBotao(`${configuracao.cores[atual.cor].nome} ×`, () => estado.filtrar({ cor: "" })));
    if (atual.acabamento) filtros.push(criarBotao(`${obterNomeDoAcabamento(atual.acabamento, configuracao)} ×`, () => estado.filtrar({ acabamento: "" })));
    obterElemento("filtros-ativos").replaceChildren(...filtros); obterElemento("filtros-ativos").hidden = !filtros.length;
    document.querySelectorAll(".contador-filtros").forEach(elemento => { elemento.hidden = !filtros.length; elemento.textContent = filtros.length; });
  }
  function criarCartaoDoCatalogo(produto, atual) {
      const cadastro = produto.variacoes.find(item => (!atual.cor || item.cor === atual.cor) && (!atual.acabamento || item.acabamento === atual.acabamento)) || produto.variacoes[0];
      const cartao = criarElemento("article", "cartao"), conteudo = criarElemento("div", "cartao-conteudo");
      const categoria = configuracao.categorias.find(item => item.identificador === produto.categoria), subcategoria = categoria.subcategorias.find(item => item[0] === produto.subcategoria);
      const disponibilidade = resolverDisponibilidade(cadastro, relatorio, produto.origem);
      const selo = criarElemento("span", "selo-disponibilidade", disponibilidade.titulo); selo.dataset.tipo = disponibilidade.tipo;
      conteudo.append(criarElemento("span", "etiqueta", subcategoria[1]), criarElemento("h2", "", produto.nome), selo);
      const cores = [...new Set(produto.variacoes.map(item => item.cor).filter(Boolean))], paleta = criarElemento("div", "cores-cartao");
      cores.forEach(identificador => { const cor = configuracao.cores[identificador], ponto = criarElemento("span", "ponto"); ponto.style.setProperty("--cor-amostra", cor.corVisual); ponto.title = cor.nome; ponto.setAttribute("role", "img"); ponto.setAttribute("aria-label", cor.nome); paleta.append(ponto); });
      if (cores.length) conteudo.append(paleta);
      const atributos = { ...(produto.especificacoes || {}), ...(cadastro.especificacoes || {}) };
      if (!atributos.Potência && produto.potencia && produto.potencia !== "Não informada") atributos.Potência = produto.potencia;
      const escolhas = Object.entries(atributos).filter(([nome, valor]) => valor && !/temperatura|cor|referência|código/i.test(nome)).slice(0, 2);
      if (escolhas.length) conteudo.append(criarElemento("p", "resumo-variacoes", escolhas.map(([nome, valor]) => nome + ": " + valor).join(" · ")));
      const abrir = criarBotao("Ver detalhes", () => estado.abrirProduto(produto.identificador), "abrir"); abrir.setAttribute("aria-label", `Ver detalhes de ${produto.nome}`); abrir.append(criarDecoracao("↗", ""));
      conteudo.append(abrir); cartao.append(criarMidia(produto, cadastro), conteudo); return cartao;
  }

  function prepararTrilhos() {
    const palco = obterElemento("palco-parceiro"), janela = palco.parentElement;
    janela.classList.add("janela-trilho");
    const trilho = criarElemento("div", "trilho-continuo"); trilho.id = "trilho-parceiros";
    trilho.append(obterElemento("previa-parceiro-anterior"), palco, obterElemento("previa-parceiro-proxima")); janela.append(trilho);
    // Os vizinhos servem apenas à transição e não devem receber foco fora da janela.
    for (const previa of trilho.querySelectorAll(".previa-parceiro")) { previa.inert = true; previa.setAttribute("aria-hidden", "true"); }
    new ResizeObserver(estabilizarBanners).observe(janela);
    habilitarArrasteDeSlides(janela, passo => { moverParceiro(passo); iniciarParceiros(); });
  }
  function renderizarCatalogo(atual) {
    renderizarNavegacao(atual); renderizarFiltrosAtivos(atual);
    for (const [identificador, valor] of [["busca", atual.busca], ["filtro-cor", atual.cor], ["filtro-acabamento", atual.acabamento], ["ordenacao", atual.ordenacao], ["por-pagina", atual.porPagina]]) obterElemento(identificador).value = String(valor);
    const { produtos: resultados, total, totalCadastros, pagina, totalPaginas } = atual.consulta;
    paginacao.renderizar(atual);
    const inicio = total ? (pagina - 1) * atual.porPagina + 1 : 0, fim = Math.min(pagina * atual.porPagina, total);
    obterElemento("contagem").textContent = total ? `${numero(inicio)}–${numero(fim)} de ${numero(total)} famílias · ${numero(totalCadastros)} cadastros` : "Nenhum produto encontrado";
    obterElemento("vazio").hidden = total !== 0;

  }
  const produtosPorId = new Map(produtos.map(produto => [produto.identificador, produto]));
  const iluminacao = Iluminacao.integrarCatalogo({
    recipiente: obterElemento("midia-modal").parentElement, midia: obterElemento("midia-modal"),
    slider: obterElemento("brilho"), valor: obterElemento("valor-brilho"),
    controle: obterElemento("controle-brilho"), qualidade: obterElemento("qualidade-iluminacao"),
    configuracao: configuracao.iluminacao
  });
  function renderizarAtmosfera(atual) {
    iluminacao.sincronizar(atual, produtosPorId.get(atual.produtoAberto));
  }
  function renderizarPaletaUnificada(produto, cadastro, atual) {
    const paleta = obterElemento("paleta");
    obterElemento("comparacao").hidden = !produto.permiteSimulacao;
    if (!paleta.children.length) {
      paleta.replaceChildren(...Object.entries(configuracao.cores).map(([id, cor]) => {
        const botao = criarBotao("", () => estado.selecionarCor(id), "amostra tom-selecionavel");
        botao.dataset.cor = id; botao.style.setProperty("--cor-amostra", cor.corVisual);
        const luz = criarElemento("span", "amostra-luz"); luz.setAttribute("aria-hidden", "true");
        luz.append(criarElemento("span", "superficie"));
        const legenda = criarElemento("span", "legenda-tom", cor.nome);
        legenda.append(criarElemento("small")); botao.append(luz, legenda);
        return botao;
      }));
    }
    for (const botao of paleta.children) {
      const selecionada = botao.dataset.cor === atual.corDaPrevia;
      botao.dataset.selecionada = String(selecionada);
      botao.setAttribute("aria-pressed", String(selecionada));
      botao.querySelector("small").textContent = selecionada ? "✓ Na prévia" : "Experimentar";
    }
    const cor = configuracao.cores[atual.corDaPrevia];
    obterElemento("status-previa").textContent = cadastro.cor === atual.corDaPrevia ? "Tom da prévia presente no modelo selecionado." : "Simulação visual. Confirme os tons disponíveis neste modelo.";
    obterElemento("nota-temperatura").textContent = produto.permiteSimulacao ? "Prévia: " + cor.nome + ", referência " + cor.temperaturaReferencia + " K. A iluminação escolhida é mantida ao trocar o modelo ou acabamento." : "Acabamentos e características do modelo selecionado.";
    obterElemento("anuncio").textContent = produto.permiteSimulacao ? cor.nome + " na prévia." : "Modelo selecionado: " + cadastro.identificador;
  }
  function alternarAbaInformacao(aba) {
    const mostrarDicas = aba === "dicas";
    for (const [identificador, selecionada] of [["aba-essencial", !mostrarDicas], ["aba-dicas", mostrarDicas]]) {
      const botao = obterElemento(identificador); botao.setAttribute("aria-selected", String(selecionada)); botao.tabIndex = selecionada ? 0 : -1;
    }
    obterElemento("informacoes-essenciais").hidden = mostrarDicas;
    obterElemento("dicas-produto").hidden = !mostrarDicas;
  }
  function renderizarDicasDoProduto(produto, cadastro) {
    const dicas = obterDicasDoProduto(produto, cadastro);
    obterElemento("uso-habitual").textContent = dicas.uso;
    obterElemento("materiais-recomendados").replaceChildren(...dicas.materiais.map(material => {
      const cartao = criarElemento("article", "material-recomendado");
      cartao.append(criarElemento("h4", "", material.titulo), criarElemento("p", "", material.orientacao));
      if (material.busca) cartao.append(criarBotao("Explorar opções no catálogo ↗", () => {
        obterElemento("modal").close(); estado.buscarNoCatalogo(material.busca);
      }, "buscar-material"));
      return cartao;
    }));
  }
  function renderizarMostrador(atual, motivo) {
    if (motivo === "brilho") { iluminacao.motor.atualizar({ brilho: atual.brilho }); return; }
    const produto = produtos.find(item => item.identificador === atual.produtoAberto); if (!produto) return;
    const cadastro = produto.variacoes.find(item => item.identificador === atual.cadastroSelecionado), cor = configuracao.cores[atual.corDaPrevia];
    if (motivo === "luz") { renderizarPaletaUnificada(produto, cadastro, atual); renderizarAtmosfera(atual); return; }
    if (motivo === "abrir") alternarAbaInformacao("essencial");
    renderizarDicasDoProduto(produto, cadastro);
    obterElemento("nome-produto").textContent = produto.nome;
    obterElemento("descricao-produto").textContent = cadastro.nomeRevisado;
    const categoria = configuracao.categorias.find(item => item.identificador === produto.categoria);
    obterElemento("categoria-modal").textContent = categoria.nome + " / " + categoria.subcategorias.find(item => item[0] === produto.subcategoria)[1];
    const acabamentos = [...new Set(produto.variacoes.map(item => item.acabamento))];
    if (motivo === "abrir") obterElemento("acabamento-selecionado").replaceChildren(...acabamentos.map(identificador => criarOpcao(identificador, obterNomeDoAcabamento(identificador, configuracao))));
    obterElemento("acabamento-selecionado").value = cadastro.acabamento;
    renderizarPaletaUnificada(produto, cadastro, atual);
    // Todos os IDs permanecem acessíveis, incluindo registros com SKU ausente.
    obterElemento("cadastro-selecionado").replaceChildren(...produto.variacoes.map(item => criarOpcao(item.identificador, produto.origem === "parceiro" ? `${configuracao.cores[item.cor]?.nome || "Tom não informado"} · ${item.temperaturaKelvin || "?"} K · fabricante ${item.codigoFabricante}` : `${obterNomeDoAcabamento(item.acabamento, configuracao)} · ${configuracao.cores[item.cor]?.nome || "Tom não informado"}${item.temperaturaKelvin ? " · " + item.temperaturaKelvin + " K" : ""} · SKU ${item.sku || "não informado"} · Ref. ${item.identificador}`)));
    obterElemento("cadastro-selecionado").value = cadastro.identificador; obterElemento("selecao-cadastro").hidden = produto.variacoes.length === 1;
    const recipiente = obterElemento("midia-modal"), caminho = caminhoSeguro(moduloDeMidia.obterCaminho(cadastro));
    if (motivo === "abrir" || recipiente.dataset.caminho !== caminho) { recipiente.replaceChildren(criarMidia(produto, cadastro)); recipiente.dataset.caminho = caminho; }
    else { const imagem = recipiente.querySelector("img"); if (imagem) imagem.alt = cadastro.nomeOriginal; }
    const marcaDoProduto = marcasVerificadas.find(marca => marca.identificador === produto.marcaId);
    obterElemento("linha-marca").hidden = !marcaDoProduto;
    obterElemento("marca-produto").textContent = marcaDoProduto?.nome || "";
    obterElemento("linha-codigo-fabricante").hidden = !cadastro.codigoFabricante;
    obterElemento("codigo-fabricante").textContent = cadastro.codigoFabricante || "";
    const especificacoes = { ...(produto.especificacoes || {}), ...(cadastro.especificacoes || {}) };
    const adicionais = Object.entries(especificacoes).filter(([nome]) => !["Potência", "Temperatura de cor"].includes(nome));
    obterElemento("especificacoes-adicionais").replaceChildren(...adicionais.map(([nome, valor]) => {
      const linha = criarElemento("div"); linha.append(criarElemento("dt", "", nome), criarElemento("dd", "", valor)); return linha;
    }));
    obterElemento("especificacoes-adicionais").hidden = !adicionais.length;
    obterElemento("potencia").textContent = especificacoes.Potência || (produto.potencia === "Não informada" && !produto.permiteSimulacao ? "Não se aplica ou não informada" : produto.potencia);
    obterElemento("sku").textContent = cadastro.sku || "Não cadastrado";
    obterElemento("referencia").textContent = produto.origem === "parceiro" ? "A cadastrar" : cadastro.identificador;
    const disponibilidade = resolverDisponibilidade(cadastro, relatorio, produto.origem), aviso = obterElemento("aviso-disponibilidade");
    aviso.dataset.tipo = disponibilidade.tipo;
    obterElemento("titulo-disponibilidade").textContent = disponibilidade.titulo;
    obterElemento("detalhe-disponibilidade").textContent = disponibilidade.detalhe;
    obterElemento("especificacao-temperatura").hidden = !produto.permiteSimulacao;
    obterElemento("temperatura").textContent = cadastro.temperaturaKelvin ? `${cadastro.temperaturaKelvin} K · no cadastro` : "Não informada no cadastro";
    renderizarAtmosfera(atual);
  }
  function prepararMenuCabecalho() {
    const menu = document.querySelector(".menu-mobile-cabecalho");
    const botao = menu.querySelector(".menu-mobile-resumo");
    const acoes = menu.querySelector(".acoes-cabecalho");
    const celular = window.matchMedia("(max-width:750px)");
    const fechar = () => {
      acoes.hidden = true;
      botao.setAttribute("aria-expanded", "false");
    };
    const atualizar = () => {
      botao.hidden = !celular.matches;
      if (celular.matches) fechar();
      else acoes.hidden = false;
    };
    botao.addEventListener("click", () => {
      const abrir = acoes.hidden;
      acoes.hidden = !abrir;
      botao.setAttribute("aria-expanded", String(abrir));
    });
    acoes.addEventListener("click", evento => {
      if (!celular.matches || !evento.target.closest("a,button")) return;
      fechar();
      queueMicrotask(() => {
        if (acoes.contains(document.activeElement)) botao.focus({ preventScroll: true });
      });
    });
    menu.addEventListener("keydown", evento => {
      if (evento.key !== "Escape" || acoes.hidden) return;
      fechar();
      botao.focus();
    });
    atualizar();
    celular.addEventListener("change", atualizar);
  }
  function prepararCabecalhoFixo() {
    const cabecalho = document.querySelector(".pagina > .cabecalho");
    const raiz = document.documentElement;
    const celular = window.matchMedia("(max-width:750px)");
    const LIMIAR_RECOLHER = 120, LIMIAR_EXPANDIR = 16, DISTANCIA_GESTO = 8;
    let referencia = Math.max(0, window.scrollY), quadro = null;
    const medir = () => raiz.style.setProperty("--altura-cabecalho", `${cabecalho.getBoundingClientRect().height}px`);
    const mostrar = oculto => {
      if (raiz.dataset.cabecalhoOculto === String(oculto)) return;
      raiz.dataset.cabecalhoOculto = String(oculto);
      cabecalho.inert = oculto;
    };
    const atualizar = () => {
      quadro = null;
      const posicao = Math.max(0, window.scrollY), diferenca = posicao - referencia;
      if (celular.matches) {
        cabecalho.dataset.recolhido = "false";
        if (posicao <= LIMIAR_EXPANDIR || cabecalho.contains(document.activeElement)) mostrar(false);
        else if (Math.abs(diferenca) >= DISTANCIA_GESTO) mostrar(diferenca > 0);
      } else {
        mostrar(false);
        if (posicao > LIMIAR_RECOLHER) cabecalho.dataset.recolhido = "true";
        else if (posicao < LIMIAR_EXPANDIR) cabecalho.dataset.recolhido = "false";
      }
      if (Math.abs(diferenca) >= DISTANCIA_GESTO || posicao <= LIMIAR_EXPANDIR) referencia = posicao;
    };
    window.addEventListener("scroll", () => { if (quadro === null) quadro = requestAnimationFrame(atualizar); }, { passive: true });
    celular.addEventListener("change", atualizar);
    new ResizeObserver(medir).observe(cabecalho);
    atualizar(); medir();
  }
  function prepararLuzDaInterface() {
    const raiz = document.documentElement;
    let quadro = null;
    const pintar = () => {
      quadro = null;
      const atual = iluminacao.motor.obterEstado();
      raiz.style.setProperty("--cor-luz-interface", Iluminacao.presets[atual.tom].corVisual);
      raiz.style.setProperty("--brilho-interface", String(atual.ativo && !document.hidden ? atual.brilho / 100 : 0));
      raiz.dataset.luzInterface = atual.qualidade;
    };
    // Fechar a prévia suspende sua pintura, mas preserva o último tom escolhido na interface.
    const agendar = () => { if (quadro === null) quadro = requestAnimationFrame(pintar); };
    iluminacao.motor.observar(agendar);
    document.addEventListener("visibilitychange", agendar);
  }
  function iniciar() {
    const larguraMobile = window.matchMedia("(max-width:750px)");
    const organizarSecoes = () => {
      obterElemento("grade-parceiro").tabIndex = larguraMobile.matches ? 0 : -1;
      const parceiros = obterElemento("parceiros");
      const proximaSecao = obterElemento(larguraMobile.matches ? "fonte-dados" : "navegacao-catalogo");
      if (parceiros.nextElementSibling !== proximaSecao) proximaSecao.before(parceiros);
    };
    organizarSecoes();
    larguraMobile.addEventListener("change", organizarSecoes);
    prepararTrilhos();
    paginacao.preparar();
    renderizarLogo(); renderizarPainel(); iniciarInterruptorTema(); renderizarContato(); renderizarIdiomas(); renderizarAjuda(); renderizarProfissionais(); renderizarDestaque(); renderizarParceiro();
    prepararMenuCabecalho(); prepararCabecalhoFixo(); prepararLuzDaInterface();
    const totalCadastros = produtos.filter(produto => produto.origem !== "parceiro").reduce((total, produto) => total + produto.variacoes.length, 0);
    obterElemento("resumo-estoque").replaceChildren(...[[totalCadastros, "cadastros"], [produtos.length, "famílias de produtos"], [contagens.size ? configuracao.categorias.filter(item => contagens.has(item.identificador)).length : 0, "categorias"]].map(([quantidade, nome]) => { const item = criarElemento("span"); item.append(criarElemento("strong", "", numero(quantidade)), document.createTextNode(nome)); return item; }));
    obterElemento("fonte-dados").textContent = "Catálogo baseado nos cadastros internos. A indicação Em estoque segue o cadastro, sem garantia de quantidade imediata. Itens exibidos apenas por fontes externas são sob encomenda. Preços sob consulta; cores da prévia são simulações ilustrativas.";
    obterElemento("filtro-cor").replaceChildren(criarOpcao("", "Todas as cores"), ...Object.entries(configuracao.cores).map(([identificador, cor]) => criarOpcao(identificador, cor.nome)));
    const acabamentosDisponiveis = [...new Set(produtos.flatMap(produto => produto.variacoes.map(item => item.acabamento)))].sort((primeiro, segundo) => obterNomeDoAcabamento(primeiro, configuracao).localeCompare(obterNomeDoAcabamento(segundo, configuracao), "pt-BR"));
    obterElemento("filtro-acabamento").replaceChildren(criarOpcao("", "Todos os acabamentos"), ...acabamentosDisponiveis.map(identificador => criarOpcao(identificador, obterNomeDoAcabamento(identificador, configuracao))));
    obterElemento("por-pagina").replaceChildren(...configuracao.quantidadesPorPagina.map(valor => criarOpcao(valor, valor)));
    obterElemento("marca").addEventListener("click", () => { window.location.href = "./index.html"; });
    obterElemento("subcategoria-anterior").addEventListener("click", () => obterElemento("subcategorias").scrollBy({ left: -Math.max(180, obterElemento("subcategorias").clientWidth * .7), behavior: "smooth" }));
    obterElemento("subcategoria-proxima").addEventListener("click", () => obterElemento("subcategorias").scrollBy({ left: Math.max(180, obterElemento("subcategorias").clientWidth * .7), behavior: "smooth" }));
    obterElemento("subcategorias").addEventListener("scroll", atualizarSetasSubcategorias, { passive: true });
    window.addEventListener("resize", () => { if (estadoAtualParaNavegacao) { renderizarNavegacao(estadoAtualParaNavegacao); atualizarSetasSubcategorias(); } });
    obterElemento("ir-parceiros").addEventListener("click", () => obterElemento("parceiros").scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }));
    obterElemento("busca-marca").addEventListener("input", () => filtrarAbasDeMarcas(true));
    obterElemento("limpar-busca-marca").addEventListener("click", () => {
      obterElemento("busca-marca").value = "";
      filtrarAbasDeMarcas(true);
      obterElemento("busca-marca").focus();
    });
    obterElemento("descobrir-marcas").addEventListener("click", () => selecionarAbaDoParceiro(0));
    obterElemento("pausar-pacotes").addEventListener("click", () => { rotacaoParceirosPausada = !rotacaoParceirosPausada; atualizarControleDaRotacao(); iniciarParceiros(); });
    for (const [id, passo] of [["previa-parceiro-anterior", -1], ["previa-parceiro-proxima", 1]]) obterElemento(id).addEventListener("click", () => { moverParceiro(passo); iniciarParceiros(); });
    const navegacaoFixa = obterElemento("navegacao-catalogo");
    new ResizeObserver(() => document.documentElement.style.setProperty("--altura-navegacao", `${navegacaoFixa.getBoundingClientRect().height}px`)).observe(navegacaoFixa);
    obterElemento("ir-oficina").addEventListener("click", () => { window.location.href = "./oficina.html"; });
    obterElemento("abrir-profissionais").addEventListener("click", () => obterElemento("modal-profissionais").showModal());
    obterElemento("fechar-profissionais").addEventListener("click", () => obterElemento("modal-profissionais").close());
    obterElemento("abrir-contato").addEventListener("click", () => obterElemento("modal-contato").showModal());
    obterElemento("fechar-contato").addEventListener("click", () => obterElemento("modal-contato").close());
    const abrirAjuda = () => { obterElemento("modal-ajuda").showModal(); obterElemento("busca-ajuda").focus(); };
    obterElemento("abrir-ajuda").addEventListener("click", abrirAjuda);
    obterElemento("fechar-ajuda").addEventListener("click", () => obterElemento("modal-ajuda").close());
    obterElemento("busca-ajuda").addEventListener("input", evento => renderizarAjuda(evento.target.value));
    obterElemento("abrir-idioma").addEventListener("click", () => obterElemento("modal-idioma").showModal());
    obterElemento("fechar-idioma").addEventListener("click", () => obterElemento("modal-idioma").close());
    obterElemento("destaque").addEventListener("mouseenter", pausarDestaques);
    obterElemento("destaque").addEventListener("mouseleave", iniciarDestaques);
    obterElemento("destaque").addEventListener("focusin", pausarDestaques);
    obterElemento("destaque").addEventListener("focusout", evento => { if (!obterElemento("destaque").contains(evento.relatedTarget)) iniciarDestaques(); });
    obterElemento("parceiros").addEventListener("mouseenter", pausarParceiros);
    obterElemento("parceiros").addEventListener("mouseleave", iniciarParceiros);
    obterElemento("parceiros").addEventListener("focusin", pausarParceiros);
    obterElemento("parceiros").addEventListener("focusout", evento => { if (!obterElemento("parceiros").contains(evento.relatedTarget)) queueMicrotask(iniciarParceiros); });
    obterElemento("parceiros").addEventListener("pointerdown", pausarParceiros);
    obterElemento("parceiros").addEventListener("pointerup", () => queueMicrotask(iniciarParceiros));
    obterElemento("parceiros").addEventListener("pointercancel", () => queueMicrotask(iniciarParceiros));
    document.addEventListener("focusin", evento => { if (evento.target.closest?.("dialog[open]")) pausarParceiros(); });
    document.querySelectorAll("dialog").forEach(modal => modal.addEventListener("close", iniciarParceiros));
    window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", evento => {
      if (!evento.matches) { iniciarParceiros(); return; }
      pausarParceiros();
      cancelarAnimacoesDaVitrine();
      const animacaoDoBanner = animacoesDosTrilhos.get(obterElemento("trilho-parceiros"));
      if (animacaoDoBanner) animacaoDoBanner.finish();
    });
    const observarApresentacao = new IntersectionObserver(entradas => entradas.forEach(entrada => {
      if (entrada.target.id === "destaque") { destaqueVisivel = entrada.isIntersecting; entrada.isIntersecting ? iniciarDestaques() : pausarDestaques(); }
      else { parceiroVisivel = entrada.isIntersecting; entrada.isIntersecting ? iniciarParceiros() : pausarParceiros(); }
    }), { threshold: 0 });
    observarApresentacao.observe(obterElemento("destaque")); observarApresentacao.observe(obterElemento("parceiros"));
    document.addEventListener("visibilitychange", () => { if (document.hidden) { pausarDestaques(); pausarParceiros(); } else { iniciarDestaques(); iniciarParceiros(); } });
    habilitarArrasteParaRolagem(obterElemento("categorias"), "horizontal");
    habilitarArrasteParaRolagem(obterElemento("subcategorias"), "horizontal");
    habilitarArrasteParaRolagem(obterElemento("pontos-parceiro"), "horizontal");
    habilitarArrasteDeSlides(obterElemento("destaque"), deslocamento => { moverDestaque(deslocamento); iniciarDestaques(); });
    habilitarArrasteParaRolagem(obterElemento("grade-parceiro"), "horizontal");

    for (const identificador of ["alternar-filtro", "filtro-flutuante"]) obterElemento(identificador).addEventListener("click", () => alternarPainel(!filtroAberto));
    obterElemento("esconder-filtro").addEventListener("click", () => alternarPainel(false));
    obterElemento("lado-filtro").addEventListener("change", evento => { preferencias.lado = evento.target.value === "esquerda" ? "esquerda" : "direita"; preferenciasDoFiltro.salvar(preferencias); renderizarPainel(); });
    obterElemento("filtros").addEventListener("submit", evento => evento.preventDefault());
    const campoDeBusca = obterElemento("busca");
    let temporizadorDaBusca = null, compondoBusca = false;
    function cancelarBuscaPendente() {
      clearTimeout(temporizadorDaBusca);
      temporizadorDaBusca = null;
    }
    function agendarBusca() {
      cancelarBuscaPendente();
      if (compondoBusca) return;
      temporizadorDaBusca = setTimeout(() => {
        temporizadorDaBusca = null;
        estado.filtrar({ busca: campoDeBusca.value }, false);
      }, 300);
    }
    function aplicarFiltrosDoFormulario(alteracoes) {
      cancelarBuscaPendente();
      estado.filtrar({ ...alteracoes, busca: campoDeBusca.value });
    }
    campoDeBusca.addEventListener("input", agendarBusca);
    campoDeBusca.addEventListener("compositionstart", () => { compondoBusca = true; cancelarBuscaPendente(); });
    campoDeBusca.addEventListener("compositionend", () => { compondoBusca = false; agendarBusca(); });
    obterElemento("filtro-cor").addEventListener("change", evento => aplicarFiltrosDoFormulario({ cor: evento.target.value }));
    obterElemento("filtro-acabamento").addEventListener("change", evento => aplicarFiltrosDoFormulario({ acabamento: evento.target.value }));
    obterElemento("ordenacao").addEventListener("change", evento => aplicarFiltrosDoFormulario({ ordenacao: evento.target.value }));
    obterElemento("por-pagina").addEventListener("change", evento => aplicarFiltrosDoFormulario({ porPagina: Number(evento.target.value) }));
    obterElemento("limpar").addEventListener("click", () => estado.limparFiltros());
    obterElemento("cadastro-selecionado").addEventListener("change", evento => estado.selecionarCadastro(evento.target.value));
    obterElemento("acabamento-selecionado").addEventListener("change", evento => estado.selecionarAcabamento(evento.target.value));
    obterElemento("aba-essencial").addEventListener("click", () => alternarAbaInformacao("essencial"));
    obterElemento("aba-dicas").addEventListener("click", () => alternarAbaInformacao("dicas"));
    obterElemento("aba-essencial").parentElement.addEventListener("keydown", evento => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(evento.key)) return;
      evento.preventDefault();
      const proxima = evento.key === "ArrowRight" || evento.key === "End" ? "dicas" : "essencial";
      alternarAbaInformacao(proxima); obterElemento(proxima === "dicas" ? "aba-dicas" : "aba-essencial").focus();
    });
    obterElemento("fechar").addEventListener("click", () => obterElemento("modal").close());
    obterElemento("modal").addEventListener("close", () => estado.fecharProduto());
    obterElemento("painel-filtros").addEventListener("keydown", evento => { if (evento.key === "Escape") { evento.stopPropagation(); alternarPainel(false); } });
    estado.observar((atual, motivo) => {
      estadoAtualParaNavegacao = atual;
      if (motivo === "fechar") iluminacao.fechar();
      if (["iniciar", "catalogo", "busca", "navegar", "paginar"].includes(motivo)) cancelarBuscaPendente();
      if (["iniciar", "catalogo", "busca", "navegar", "paginar"].includes(motivo)) renderizarCatalogo(atual);
      if (["catalogo", "busca", "navegar"].includes(motivo) && linhasDosParceiros[indiceDoParceiro]) {
        cancelarTrilho(obterElemento("trilho-parceiros"));
        renderizarParceiro();
      }
      if (["abrir", "variacao", "brilho", "luz"].includes(motivo)) renderizarMostrador(atual, motivo);
      if (motivo === "abrir" && !obterElemento("modal").open) obterElemento("modal").showModal();
      if (["catalogo", "navegar"].includes(motivo)) rolarParaCatalogo(motivo === "navegar");
    });
    obterElemento("pagina").setAttribute("aria-busy", "false");
    if (location.hash === "#ajuda") abrirAjuda();
  }
  return { iniciar, renderizarLogo, iluminacao: iluminacao.motor };
}
async function inicializarCatalogo() {
  try { const [{ produtos, fonte }, relatorio] = await Promise.all([repositorioDeProdutos.carregar(), repositorioDeDisponibilidade.carregar()]); const registrosDeAnuncios = gerenciadorDeMiniAnuncios.carregar(); const estado = criarEstadoDoCatalogo(produtos, configuracaoDoCatalogo, registrosDeAnuncios); criarVisualizacao(produtos, configuracaoDoCatalogo, fonte, estado, relatorio, registrosDeAnuncios).iniciar(); }
  catch (erro) { console.error("Falha ao carregar o catálogo:", erro); document.getElementById("contagem").textContent = "Não foi possível carregar o catálogo. Confira os dados e recarregue a página."; document.getElementById("pagina").setAttribute("aria-busy", "false"); }
}
void inicializarCatalogo();
