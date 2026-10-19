"use strict";

// Conteúdo editável separado da renderização. Não insira dados de prestadores sem autorização deles.
const configuracaoDeApoio = {
  dicas: {
    porIdentificador: {}, // Ex.: "ID_INTERNO": { uso: "...", materiais: [{ titulo: "...", orientacao: "...", busca: "..." }] }
    porSubcategoria: {
      plafons: { uso: "Iluminação geral de ambientes internos, conforme a proteção e a instalação indicadas pelo fabricante.", materiais: [
        { titulo: "Fios e conexões", orientacao: "Confira tensão, potência, bitola, distância e método de instalação antes de escolher o condutor e os conectores.", busca: "FIO" },
        { titulo: "Fixação", orientacao: "Selecione parafusos e buchas de acordo com o peso do conjunto e o material do teto.", busca: "BUCHA" }
      ] },
      lampadas: { uso: "Iluminação de ambientes compatíveis com o soquete, a tensão e a aplicação informados no cadastro.", materiais: [
        { titulo: "Soquete", orientacao: "Confira o tipo de base da lâmpada e a tensão antes de escolher o soquete.", busca: "SOQUETE" }
      ] },
      pendentes: { uso: "Iluminação decorativa e pontual em áreas com altura e estrutura adequadas.", materiais: [
        { titulo: "Suporte e fixação", orientacao: "Verifique peso, altura de instalação e capacidade da base; confirme o kit recomendado pelo fabricante.", busca: "BUCHA" },
        { titulo: "Conexão elétrica", orientacao: "Dimensione os condutores pela instalação real e confira tensão e potência do conjunto.", busca: "FIO" }
      ] },
      spots: { uso: "Luz de destaque ou apoio, respeitando o recorte, a dissipação de calor e o ambiente de instalação.", materiais: [
        { titulo: "Instalação", orientacao: "Confira dimensões de recorte, alimentação e espaço para dissipação antes da montagem.", busca: "CONECTOR" }
      ] },
      cabos: { uso: "Condução ou ligação elétrica conforme o tipo de cabo e as condições do circuito.", materiais: [
        { titulo: "Dimensionamento", orientacao: "A bitola depende de corrente, percurso, método de instalação e proteção. Consulte um profissional habilitado.", busca: "DISJUNTOR" }
      ] },
      parafusos: { uso: "Fixação de peças em bases compatíveis com o modelo e a carga aplicada.", materiais: [
        { titulo: "Bucha e base", orientacao: "Combine diâmetro, comprimento, carga e material da parede ou do teto antes de escolher a bucha.", busca: "BUCHA" }
      ] },
      buchas: { uso: "Apoio à fixação em materiais compatíveis com o modelo da bucha.", materiais: [
        { titulo: "Parafuso", orientacao: "Confira a faixa de diâmetro indicada pelo fabricante da bucha e a carga prevista.", busca: "PARAFUSO" }
      ] },
      fitas: { uso: "Iluminação linear e decorativa quando a fita, a fonte e o perfil são compatíveis.", materiais: [
        { titulo: "Fonte e perfil", orientacao: "Confirme tensão, potência por metro, comprimento total e dissipação recomendada.", busca: "FONTE" }
      ] }
    },
    porCategoria: {
      iluminacao: { uso: "Iluminação do ambiente conforme a finalidade e as especificações do modelo.", materiais: [{ titulo: "Instalação", orientacao: "Confira tensão, base, fixação, proteção e instruções do fabricante antes de instalar.", busca: "CONECTOR" }] },
      eletrica: { uso: "Composição de instalações elétricas compatíveis com o projeto.", materiais: [{ titulo: "Compatibilidade", orientacao: "Confirme corrente, tensão, bitola, método de instalação e proteção do circuito com profissional habilitado.", busca: "CABO" }] },
      fixacao: { uso: "Fixação mecânica em base e carga compatíveis.", materiais: [{ titulo: "Base de aplicação", orientacao: "Verifique carga, material da base e orientações do fabricante antes de combinar peças.", busca: "BUCHA" }] }
    },
    padrao: { uso: "Uso conforme a descrição e as especificações do fabricante.", materiais: [{ titulo: "Antes de usar", orientacao: "Confira medidas, compatibilidade e orientações do fabricante para a aplicação desejada.", busca: "" }] }
  },
  ajuda: [
    { id: "buscar", titulo: "Encontrar um produto", resumo: "Use a busca por nome, SKU ou medida; combine com categoria e filtros.", termos: "pesquisa procurar estoque", acao: "catalogo" },
    { id: "categorias", titulo: "Explorar categorias", resumo: "Escolha uma categoria e refine pelas subcategorias logo abaixo.", termos: "navegacao secao", acao: "categorias" },
    { id: "variacoes", titulo: "Cores e acabamentos", resumo: "Abra os detalhes para comparar tons de luz e selecionar cadastros e acabamentos disponíveis.", termos: "branco quente neutro frio tonalidade", acao: "catalogo" },
    { id: "disponibilidade", titulo: "Disponibilidade", resumo: "Itens cadastrados aparecem como em estoque, mas a quantidade deve ser confirmada com a loja.", termos: "saldo encomenda comprar", acao: "contato" },
    { id: "dicas", titulo: "Dicas do produto", resumo: "Nos detalhes, a aba Dicas reúne usos habituais e cuidados para escolher materiais complementares.", termos: "fio parafuso instalacao finalidade", acao: "catalogo" },
    { id: "oficina", titulo: "Oficina de ferramentas", resumo: "Um espaço preparado para futuras calculadoras, guias e listas de verificação.", termos: "calculadora ferramentas prestador", acao: "oficina" },
    { id: "profissionais", titulo: "Prestadores de serviço", resumo: "Acesse a lista de profissionais por especialidade quando os contatos forem cadastrados.", termos: "eletricista gesseiro instalador arquiteto", acao: "profissionais" },
    { id: "localizacao", titulo: "Contato e localização", resumo: "No contato você encontrará os canais da loja, o mapa e as opções de rota quando configurados.", termos: "endereco maps uber chegar", acao: "contato" }
  ],
  oficina: {
    secoes: [
      { id: "calculadoras", simbolo: "◫", titulo: "Calculadoras", descricao: "Medidas e estimativas para planejar uma instalação.", ferramentas: [] },
      { id: "guias", simbolo: "◇", titulo: "Guias rápidos", descricao: "Orientações de escolha e uso para tarefas frequentes.", ferramentas: [] },
      { id: "checklists", simbolo: "☷", titulo: "Listas de verificação", descricao: "Passos e materiais para organizar um serviço.", ferramentas: [] }
    ]
  },
  prestadores: {
    categorias: [
      { id: "eletricista", nome: "Eletricistas" }, { id: "instalador", nome: "Instaladores" },
      { id: "gesseiro", nome: "Gesseiros" }, { id: "arquiteto", nome: "Arquitetos" },
      { id: "outros", nome: "Outras especialidades" }
    ],
    profissionais: [] // { nome, categoria, regiao, descricao, whatsappNumero, links:[{rotulo,url}] }
  },
  localizacao: {
    endereco: "Rua Joseph Paul Julien Burlandy, 395 - Parque Gabriel, Hortolândia - SP, 13186-620",
    googleMapsUrl: "https://www.google.com/maps/place/ULTRALED+Hortol%C3%A2ndia/@-22.8786581,-47.2127832,17z/data=!3m1!4b1!4m6!3m5!1s0x94c8b92e47552159:0x96e7c689f71741fb!8m2!3d-22.8786581!4d-47.2127832!16s%2Fg%2F11x_mb5_sf",
    googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3675.9404503613105!2d-47.21278319999999!3d-22.8786581!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c8b92e47552159%3A0x96e7c689f71741fb!2sULTRALED%20Hortol%C3%A2ndia!5e0!3m2!1spt-BR!2sbr!4v1791914960312!5m2!1spt-BR!2sbr",
    linksDeRota: [] // Ex.: { rotulo: "Uber", url: "https://m.uber.com/..." }
  }
};

function obterDicasDoProduto(produto, cadastro, configuracao = configuracaoDeApoio.dicas) {
  const modelo = configuracao.porIdentificador[cadastro.identificador] || configuracao.porSubcategoria[produto.subcategoria] || configuracao.porCategoria[produto.categoria] || configuracao.padrao;
  return { uso: modelo.uso, materiais: modelo.materiais || [], personalizado: Boolean(configuracao.porIdentificador[cadastro.identificador]) };
}

function buscarTopicosDeAjuda(termo, topicos = configuracaoDeApoio.ajuda) {
  const normalizar = valor => String(valor || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
  const termos = normalizar(termo).split(/\s+/).filter(Boolean);
  return topicos.filter(topico => termos.every(parte => normalizar([topico.titulo, topico.resumo, topico.termos].join(" ")).includes(parte)));
}
