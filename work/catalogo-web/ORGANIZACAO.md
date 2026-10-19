# Organização do catálogo

## Motor de iluminação independente

O motor e sua API estão em `js/iluminacao/`; consulte `js/iluminacao/README.md`. Os presets compartilhados carregam antes de `catalogo.js`. O slider altera diretamente o motor; as operações antigas de estado ficam como ponte de compatibilidade. O seletor de efeitos oferece Padrão, Econômico e Desligado, com configuração inicial em `configuracaoDoCatalogo.iluminacao`.

`css_style/iluminacao.css` carrega por último e controla as camadas locais da prévia. O núcleo recebe cenas com ambiente, paleta e fontes separados, mas o renderizador CSS atual continua sendo uma prévia ilustrativa simples. Novos ambientes e múltiplas fontes requerem um renderizador que declare essas capacidades.

Os testes automatizados do núcleo e da integração não substituem conferência visual e medição no navegador. A publicação deve incluir os arquivos listados em `work/ferramentas/publicacao/preparar-publicacao.cjs`.

Abra `index.html` para acessar a Home com a introdução visual, `catalogo_estoque_proto1.html` para o catálogo, `ambientes.html` para a próxima etapa da experiência ou `oficina.html` para a oficina. Não há instalações obrigatórias.

## Experiência visual — separação das páginas

A Home reúne a antiga apresentação inicial do catálogo com a introdução animada da Experiência visual. Oferece os caminhos Iniciar experiência e Catálogo. O catálogo abre diretamente, sem a antiga apresentação em quatro etapas; seu carrossel de parceiros permanece. O endereço anterior `experiencia.html` redireciona para a Home.

A introdução na Home não usa carrossel; sua ilustração em CSS alterna luzes discretas sem carregar imagens. O botão Iniciar experiência abre `ambientes.html`, página própria reservada para cômodos e iluminação interativa. A Home carrega o núcleo e o renderizador CSS do motor de iluminação para as luzes ilustrativas da cena e o retorno dos botões. Não carrega produtos. A página de ambientes continua sendo um placeholder. Não há cópia do banco ou dos produtos.

Próximos tópicos: navegação por miniaturas de cômodos, tema/subtema/paleta, cenas 2.5D, luz branca e RGB global, comparação lado a lado, luz em fundo neutro e seleção temporária durante a sessão. Esses recursos ainda não estão implementados. Quando forem adicionados, devem usar os mesmos produtos do catálogo e priorizar o celular. O arquivo `ambientes.html` integra a lista pública do empacotador.

## Dados e organização dos produtos

`js/estoque.js` guarda a lista local importada do projeto Bling: IDs, SKUs e nomes originais. A fonte disponível não inclui preços nem quantidades. Esta integração é uma fotografia local dos cadastros, sem conexão em tempo real.

`js/catalogo.js` concentra taxonomia, regras de identificação, correções de nomes, acabamentos, cores de luz e exceções por ID. O agrupamento usa a descrição-base, preservando potência, tensão, dimensão, marca declarada, material e embalagem. Cores de luz identificadas e acabamentos físicos são separados. Cadastros distintos permanecem acessíveis pelo seletor de cadastro.

`js/metadados-produtos.js` contém a lista conservadora de marcas com domínio brasileiro verificado, a extração de especificações literalmente declaradas no nome e três modelos de fontes oficiais ainda ausentes do cadastro interno. Esses modelos são exibidos como **Sob encomenda**, com código do fabricante, sem SKU ou referência interna inventados. A URL oficial é metadado de auditoria, não link público. O catálogo não sincroniza automaticamente mudanças dessas páginas: cada novo produto externo exige curadoria e conferência da variante. Marcas de cadastro sem fonte oficial suficientemente confiável não entram automaticamente na aba de parceiros.

Execute `node auditar-catalogo.cjs` para gerar `dados/auditoria-produtos.md`. A auditoria atual registra todos os 1.693 cadastros, 1.346 famílias, cobertura dos campos extraídos, cinco registros sem SKU e uma família com classificação pendente. Potência, tensão, base, fluxo, proteção e medidas só aparecem quando o dado é explícito. A aba técnica segue inativa; o resumo essencial exibe os dados verificáveis.

`dados/categorizacao-interna.json` é o índice para organização interna: famílias, código de categoria/subcategoria, chave de agrupamento, regra aplicada, nomes originais/revisados e todos os IDs/SKUs. Os índices `indicePorIdentificador` e `indicePorSku` permitem localizar diretamente um cadastro; SKUs repetidos apontam para todos os IDs associados. Cadastros sem identificação suficiente ficam sinalizados para revisão. O arquivo é documental; o navegador gera a organização a partir da configuração e da lista de estoque.

Para corrigir um caso específico, use `configuracaoDoCatalogo.ajustesPorIdentificador`, informando o ID real do Bling e os campos necessários: `categoria`, `subcategoria`, `nomeDaFamilia` ou `cor`. As subcategorias devem pertencer à taxonomia. Mudanças de agrupamento e nomes afetam apenas o catálogo local.

Para regenerar o índice após uma alteração, execute `node atualizar-organizacao.cjs`, se tiver Node.js instalado. O Node.js é necessário apenas para esta manutenção opcional.

Os três tons da prévia estão disponíveis para produtos classificados como iluminação. Um tom sem cadastro compatível muda somente a simulação e mantém a identificação real do produto. O filtro de cor considera exclusivamente os tons identificados nos nomes do estoque. Acabamentos selecionam registros reais; a camada visual está preparada para futura integração de imagens ou renderização de acabamento.

Os títulos exibidos passam por correções de grafia, acentuação, caixa e espaçamento de unidades. O nome original de cada cadastro permanece preservado para busca e auditoria. Ajustes individuais continuam em `ajustesPorIdentificador`. A formatação automática não substitui revisão editorial de cada um dos 1.693 registros.

Imagens ficam sob configuração manual no módulo `moduloDeMidia`, por SKU ou ID. O módulo do logo aceita caminho e função de animação com retorno opcional de uma função de limpeza. O filtro abre/fecha, aceita posição esquerda/direita e guarda essa posição no navegador quando o armazenamento está disponível.

`js/disponibilidade.js` prepara a importação opcional de um relatório datado com `atualizadoEm`, `validadeEmHoras` e `itens` (`identificador`, `sku`, `saldo`). Como o relatório atual não é confiável, a regra acordada usa o cadastro interno como “Em estoque”, sem prometer quantidade. Quando houver relatório confiável e recente, saldo positivo acrescenta a quantidade informada, sempre com indicação para confirmação. A integração em tempo real exigirá um backend próprio e credenciais mantidas no servidor.

Testes visuais e interativos no navegador permanecem sob responsabilidade do usuário.

## Apresentação e contatos

Todas as categorias aparecem em uma grade compacta. O botão Home abre `index.html`; as subcategorias usam um trilho com setas. `atmosferaPorCategoria` controla a cor de fundo da navegação. A Home é um hub independente com apresentação inicial automática e acessos diretos a catálogo, marcas e oficina. O antigo módulo de destaques permanece configurado no catálogo para futura reutilização, mas está oculto nesta organização para manter o foco na navegação.

Configure o logo e sua animação em `configuracaoDoCatalogo.marca`. O caminho preenchido também aparece na abertura. `animacaoAbertura` pode receber o elemento do logo da abertura e devolver uma função de limpeza. As quatro etapas em `configuracaoDoCatalogo.abertura` começam automaticamente; a última permanece até o usuário clicar em Entrar, Pular ou pressionar Escape. Entrar e Pular encerram a apresentação imediatamente. Com movimento reduzido, aparece diretamente a última etapa.

Preencha os canais em `configuracaoDoCatalogo.contato`: `whatsappNumero` com DDI e DDD, `telefone`, `email`, `endereco` e `links` com `rotulo`, `url` HTTPS e `descricao`. O módulo não exibe links até que haja dados válidos. `configuracaoDoCatalogo.idiomas` define as opções do seletor, por enquanto apenas pt-BR; adicionar uma língua exigirá preparar as traduções antes de marcá-la disponível. Os usuários podem alternar entre tema claro e escuro; a escolha é salva no navegador quando disponível.

O módulo de parceiros cria uma única aba por marca verificada em `js/metadados-produtos.js` que esteja presente no catálogo. A identificação usa padrões exatos e aliases: PERFIL JR pertence a JR Perfis, CTB/XCTB/XBCTB ocupam uma única aba e TRAMOTINA é normalizado para Tramontina. Embuled, Avant e JR Perfis foram incluídas. O campo de busca filtra as abas sem alterar os produtos. Cada botão abre detalhes de um produto do catálogo ou filtra a marca na grade. Produtos externos curados da própria marca aparecem com selo **Sob encomenda**. Não há links públicos para sites de fornecedores.

A aba **Descobrir** monta pacotes de produtos internos de marcas distintas e subcategorias complementares (luz geral, iluminação linear, elétrica, acabamento e área externa). `js/pacotes-parceiros.js` define os temas e sorteia itens dentro de cada grupo, com preferência moderada por mini anúncios válidos. A seleção reduz a repetição de produtos e marcas dentro do ciclo, entre pacotes vizinhos e na passagem para um novo ciclo. Em iluminação linear, uma fonte de 12/24 V só entra com fita da mesma tensão quando esse dado consta no nome dos produtos; isso não substitui a conferência de potência e demais requisitos técnicos. Os pacotes avançam a cada 11 segundos somente quando visíveis; pausar por ponteiro, foco, aba inativa ou movimento reduzido continua ativo. Selecionar uma aba de marca interrompe a rotação para permitir exploração. As imagens e logos seguem vazios em `moduloDeMidia.parceiros`. Arrastar com mouse/caneta permite avançar os pacotes ou navegar entre marcas.

## Fontes externas e mini anúncios

Abra `gerenciador_parceiros.html` para cadastrar fontes HTTPS, vincular cada anúncio por ID interno ou SKU único, editar título/chamada, ajustar prioridade, pausar ou excluir. Um link sem vínculo fica pendente para auditoria e não aparece para clientes. O vínculo precisa apontar para um cadastro interno com o nome do parceiro. Na vitrine, a prioridade editorial é combinada com a categoria/subcategoria visitada e os termos buscados; cada anúncio abre os detalhes do produto interno. Quando uma linha não possui anúncios válidos, mostra produtos internos comuns como alternativa. As URLs de origem não são botões nem links na vitrine pública.

O gerenciador salva um rascunho no armazenamento deste navegador quando disponível. Para publicar para todos os clientes, clique em **Exportar para publicar** e substitua `js/cadastro-anuncios-parceiros.js` pelo arquivo baixado, mantendo `js/anuncios-parceiros.js` intacto. O arquivo estático é a fonte publicada; um rascunho local válido tem precedência apenas naquele navegador. **Restaurar arquivo atual** descarta o rascunho. Como esta é uma página estática sem autenticação ou servidor, URLs no arquivo JavaScript publicado podem ser lidas por quem inspecionar o código; não coloque credenciais ou dados confidenciais nelas. Para uma nova marca aparecer como aba, cadastre seu padrão e sua fonte oficial em `js/metadados-produtos.js`; o módulo de mídia aceita posteriormente caminhos locais para logo e imagens.

Futuros campos de raridade podem ficar na configuração de apresentação de cada família, separados dos registros do Bling. Análises de região e comportamento exigirão uma camada própria de eventos e consentimento; esta versão não coleta esses metadados.

## Ajuda, dicas, oficina, profissionais e localização

`js/conteudo-auxiliar.js` guarda esses conteúdos sem misturar dados e renderização. A aba **Dicas e recomendações** dos detalhes combina orientação por ID interno, subcategoria, categoria e um padrão geral, nessa ordem. Cada dica tem `uso` e uma lista `materiais` com `titulo`, `orientacao` e busca opcional no próprio catálogo. A busca apresenta opções relacionadas, sem afirmar compatibilidade técnica específica. Preencha `porIdentificador` apenas quando houver especificação validada do item; bitola de fio, parafuso e bucha não são deduzidos do nome do produto.

O botão **Ajuda** abre uma busca por tópicos configurados em `configuracaoDeApoio.ajuda`; cada resultado pode levar a catálogo, categorias, oficina, contato ou profissionais. A **Oficina de ferramentas** fica em `oficina.html`, separada do catálogo, com três áreas iniciais e `ferramentas: []`. Futuras ferramentas entram como `{ nome, url }` com caminho relativo ou HTTPS, sem alterar a renderização. Nenhuma calculadora foi publicada nesta etapa.

O botão **Profissionais** abre uma lista filtrada por especialidade. As categorias já incluem eletricistas, instaladores, gesseiros, arquitetos e outras áreas; `profissionais` começa vazio porque nenhum contato real foi fornecido. Cada registro futuro aceita `{ nome, categoria, regiao, descricao, whatsappNumero, links: [{ rotulo, url }] }`. Canais HTTPS e WhatsApp válidos são exibidos apenas quando preenchidos.

`configuracaoDeApoio.localizacao` concentra o endereço da loja, link da ficha no Google Maps, URL de incorporação e links de rota. O endereço da **ULTRALED Hortolândia** foi confirmado pela ficha compartilhada: Rua Joseph Paul Julien Burlandy, 395, Parque Gabriel, Hortolândia–SP, 13186-620. O mapa incorporado usa o código fornecido por **Compartilhar → Incorporar um mapa** no Google Maps; o botão ao lado abre a ficha diretamente. Caso a loja mude, atualize esses três campos juntos. A API Maps Embed v1 é outra integração e exigiria chave própria. Uber e outros serviços entram em `linksDeRota` com URLs HTTPS configuradas manualmente; nenhum link de corrida foi adicionado sem a configuração exigida pelo serviço.

O tema claro agora usa superfícies neutras em camadas, texto secundário consistente, contornos suaves para cartões e contornos mais firmes nos controles interativos. Os tokens e ajustes ficam em `css_style/refinamentos.css`, carregado por último. Referências de papéis de cor: Material Design 3 e IBM Carbon Design System.

A entrada usa cabeçalho compacto no desktop e ocultação por direção da rolagem no celular, com altura medida por ResizeObserver. Ajuda e contato aparecem em seções na própria página. O interruptor de tema em `css_style/interruptor-tema.css` e `js/tema.js` é compartilhado pela Home, catálogo, ambientes e oficina, com estado salvo no navegador. A revelação inicial e as luzes respeitam movimento reduzido; a alternância de luz pausa fora da tela e em abas ocultas.
A cena da Home dissolve os quatro lados com máscaras lineares e funciona como fundo da introdução. Os botões usam desenhos locais em SVG; a luz fica contida no botão e nasce junto ao desenho, com intensidade 18 no hover/foco e 30 ao pressionar (escala do motor de 0 a 100). A cada nova carga da página, sessionStorage alterna o tom dos botões entre 4000 K e 6000 K; sem armazenamento, começa em 4000 K. As cores são aproximações ilustrativas locais, sem mudar os presets do catálogo.

A janela percorre oito cenas a cada 14 segundos: dia e noite nas quatro estações, incluindo céu limpo, nuvens, chuva e neve. É uma ambientação artística, sem consulta à previsão do tempo ou à estação real. A iluminação principal faz transições de opacidade entre camadas de 3000 K, 4000 K e 6000 K. Movimento reduzido mantém a cena parada, e sair da área visível ou ocultar a aba pausa os ciclos.
