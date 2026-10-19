# AGENTS.md: regras principais do projeto (catálogo da loja)

Estas regras valem para todos os chats e agentes que trabalharem neste projeto. Em caso de conflito, siga as instruções mais recentes e explícitas do usuário.

## 1. Regras do projeto

- O Bling é SOMENTE LEITURA. Nunca altere, crie ou apague dados nele.
- O banco do catálogo é separado e local.
- Interface: estilo industrial, pouco texto, sem pop-ups.
- Sem testes automáticos, a menos que o usuário peça.
- Antes de concluir que algo não está integrado, consulte o histórico do projeto e a conexão MCP existente.
- Trabalhe só no projeto atual. Se o destino do pedido parecer outro projeto, pergunte.

## 2. Modo de trabalho

- Se o usuário disser "vamos pensar", "ideias", "desenho" ou "como seria": NÃO altere arquivos. Entregue só o desenho do fluxo e as decisões em aberto.
- Só implemente quando o usuário disser "implemente", "faça" ou "aplique".
- Se o pedido tiver instruções que se contradizem (por exemplo, "só diff" e "só faça no projeto"), aponte a contradição antes de agir.
- Se algo importante estiver ambíguo (fluxo de tela, qual depósito, quais campos), pergunte em uma única lista curta. Se for detalhe pequeno, escolha o mais simples e avise qual escolheu.
- Nunca invente dados, pesos ou regras e apresente como comprovados. Marque o que é hipótese e o que tem fonte.
- Não escreva o código na conversa quando a tarefa for editar o projeto. Edite os arquivos diretamente.

## 3. Postura de desenvolvimento

- Entenda o problema antes de codar. Se houver caminho mais simples que o pedido, explique em duas linhas e deixe o usuário decidir.
- Faça a menor mudança que resolve. Não refatore, renomeie ou "melhore" o que não foi pedido.
- Não crie abstração, biblioteca ou camada nova sem necessidade real e presente. Simples antes de esperto.
- Respeite o que já existe: siga o estilo, a estrutura de pastas e os padrões do projeto.
- Aponte riscos relevantes que o usuário não perguntou (perda de dados, lentidão com 1.600+ produtos, casos de borda), de forma curta.
- Se errar ou encontrar um erro antigo, diga com clareza o que era e como corrigiu.

## 4. Código limpo

- Cada função faz uma coisa e tem nome que diz o que ela faz.
- Prefira funções curtas. Se passar de aproximadamente 30 linhas ou misturar leitura, regra e tela, divida quando isso simplificar o código.
- Evite código duplicado; se uma lógica se repetir três vezes, avalie extraí-la para uma função.
- Sem números ou textos mágicos soltos: use constantes com nome (por exemplo, `LIMITE_ESTOQUE_BAIXO`).
- Separe acesso a dados, regras de negócio e interface em lugares diferentes.
- Trate erros de forma explícita: mensagem clara para o usuário e detalhe útil no log. Nunca engula erro em silêncio.
- Sem código morto, comentado ou "para depois". Remova o que não é usado.
- Valide entradas externas (XML, resposta da API, campos vazios) antes de usar.

## 5. Código legível por pessoas

- Use nomes em português claro, sem abreviações obscuras: `precoComDesconto`, não `pcd`.
- Escreva para que outra pessoa consiga entender o código daqui a seis meses sem contexto.
- Comentários explicam o porquê, não o que a linha faz. Exemplo: `// O Bling pagina em 100 itens, por isso buscamos página a página`.
- Todo arquivo novo começa com duas a quatro linhas dizendo para que ele serve. Não acrescente cabeçalhos sem necessidade a arquivos existentes que não forem parte da tarefa.
- Prefira código direto e legível a código curto e enigmático. Evite one-liners difíceis de entender.
- Condições complicadas viram variáveis com nome, por exemplo: `const produtoSemEstoque = saldo <= 0;`.
- Organize arquivos e pastas para que sejam fáceis de encontrar pelo nome.

## 6. Qualidade visual

- Mantenha layout consistente: mesmo espaçamento, cores e tipografia em todas as telas. Defina valores em variáveis CSS custom properties, não em valores soltos.
- Funcione bem em telas pequenas e grandes, sem rolagem horizontal.
- Trate estados de carregamento, vazio, erro e sucesso.
- Ações importantes dão resposta visível (salvou, falhou, aguardando).

## 7. Ao terminar

- Liste arquivos alterados, o que mudou em uma linha cada, limitações e o que não foi feito.
- Se escolheu algo por conta própria, liste "decisões que tomei".
- Diga como o usuário pode conferir manualmente que está certo, em passos curtos, já que não há testes automáticos.
- Responda de forma curta e sem repetir o que o usuário já sabe.

## 8. Regras específicas já existentes

Este repositório é o catálogo ULTRALED e suas ferramentas locais. Leia `README.md`, `work/README.md` e `work/documentacao/CONTINUIDADE-NUVEM.md` antes de alterar arquivos.

- É estritamente proibido alterar dados no Bling. Consultas podem ser feitas somente para leitura. Nunca executar chamadas de criação, edição ou exclusão no Bling.
- O catálogo publicado e o banco da ferramenta de gestão são independentes. Propostas de produto ficam no banco local até revisão, cruzamento e validação explícita; não aplicar automaticamente ao catálogo.
- A fonte ativa do site fica em `work/catalogo-web/`. `work/versoes/` contém instantâneos históricos e não deve ser editado como fonte.
- Não executar testes automáticos sem pedido explícito do usuário. Verificações manuais e leitura de arquivos podem ser feitas quando necessárias.
- Não incluir credenciais, tokens, arquivos de autenticação ou estado interno da instalação Codex em pacotes de nuvem. Documentar apenas configurações reproduzíveis e sem segredos.
- Preservar `work/ferramentas/gestao-local/dados-locais/`: pode conter dados operacionais do usuário. Para backup, criar uma cópia consistente do SQLite em vez de copiar os arquivos WAL/SHM de um banco em uso.

## Padrão de alternância da interface

- Novos controles de dois estados, como claro/escuro, devem usar interruptor com pino deslizante, nome acessível estável e estado anunciado por `role="switch"` e `aria-checked`. Reutilizar o padrão visual de `styles.css` e respeitar `prefers-reduced-motion`. Não converter ações de navegação em interruptores.

## 9. Visão geral do produto: catálogo e Experiência visual

- O projeto reúne duas partes conectadas: o catálogo ULTRALED ajuda o cliente a encontrar produtos reais e informações verificáveis; a Experiência visual deve ajudar a imaginar esses produtos em um ambiente e testar visualmente opções de iluminação.
- O catálogo é a referência dos produtos. A Experiência visual pode apontar para produtos do catálogo, mas uma simulação de cor ou luz não altera cadastro, SKU, disponibilidade ou especificação técnica.
- A experiência pública deve apresentar ambientes preparados pelo sistema. A ideia discutida é que escolhas explícitas do visitante — por exemplo, cômodo, estilo ou iluminação, se aprovadas — restrinjam combinações compatíveis; não é um editor livre para montar qualquer ambiente.
- A direção visual é industrial, limpa e econômica em texto, com tema claro/escuro. A navegação e as cenas devem funcionar bem em telas pequenas. A Home apresenta a identidade ULTRALED e oferece os caminhos para iniciar a Experiência visual ou abrir o Catálogo.
- A experiência de ambientes ainda está em preparação. `ambientes.html` é um placeholder; não documentar cômodos interativos como recurso já disponível.

## 10. Contexto técnico e arquitetura conhecida

- O site ativo é estático e usa HTML, CSS e JavaScript sem framework obrigatório ou etapa de build. A fonte de edição é `work/catalogo-web/`; publicação e instantâneos históricos ficam em `work/versoes/`.
- `js/estoque.js` contém uma fotografia local de cadastros do Bling, não saldo atualizado em tempo real. `js/catalogo.js` contém taxonomia, busca, filtros e regras de apresentação; metadados curados e estilos ficam em módulos separados. Consulte `ORGANIZACAO.md` antes de alterar integrações.
- `js/iluminacao/` separa presets, núcleo do motor, renderizador CSS e integração com o catálogo. A API v1 usa scripts clássicos. O núcleo é independente do DOM e dos produtos; a integração traduz a seleção da interface. O renderizador atual é uma prévia ilustrativa: não calcula iluminação física, não desenha ambientes 2.5D e declara indisponíveis ambientes, paletas e múltiplas fontes.
- O motor mantém separadas a cena, a paleta, as fontes e o tema da interface. Mudanças na prévia visual não podem modificar a temperatura cadastrada nem os dados do produto. Respeite suspensão fora de vista, qualidade econômica/desligada, limpeza do renderizador e `prefers-reduced-motion` conforme `js/iluminacao/README.md`.
- A proposta de ferramenta interna para ambientes ainda é desenho, não implementação. A direção sugerida nas conversas é avaliar geração em lote, revisão numa galeria e exportação apenas de composições aprovadas; começar com JSON e validador antes de criar editor visual; manter regras de compatibilidade fora dos itens; e definir um contrato de cena neutro com adaptadores de renderização. Avaliar detecção de conflitos entre itens e vínculo de presets a referências de produto em estrutura separada. Não tratar essas escolhas como já aprovadas ou construídas sem confirmação explícita.
- Qualquer integração futura com produtos deve usar referências locais revisadas e preservar a separação do Bling. Nenhuma ferramenta ou processo pode escrever no Bling.
- Para retomar, leia `README.md`, `work/README.md`, `work/documentacao/CONTINUIDADE-NUVEM.md`, `work/catalogo-web/ORGANIZACAO.md` e, para mudanças no motor, `work/catalogo-web/js/iluminacao/README.md`.

## 11. Contexto atual: correções críticas de navegação mobile

- A prioridade atual de interface é melhorar exclusivamente a navegação e a leitura do catálogo em celulares, com layout claro, compacto e limpo. Em qualquer ajuste mobile, preserve o modelo desktop, os dados exibidos, os temas claro/escuro e o comportamento já existente, salvo pedido explícito em contrário.
- Trabalhe um tópico por vez e faça a menor mudança necessária. Use os tokens e padrões existentes; evite rolagem horizontal, controles enormes, sobreposição de conteúdo e áreas vazias que não ajudam o usuário.
- Os seis tópicos levantados a partir dos prints são: (1) cards e lista de produtos; (2) cabeçalho e botões que cobrem conteúdo; (3) navegação por categorias e subcategorias; (4) entrada no catálogo e ordem das seções; (5) banners e área de parceiros; (6) correção do rótulo duplicado “Filtrar Filtrar”. Trate-os como pauta de trabalho, não como autorização para implementar vários tópicos juntos.
- Nos produtos mobile, priorize leitura rápida do nome, categoria, disponibilidade e acesso aos detalhes. Use miniatura proporcional quando houver imagem e não reserve um bloco grande quando ela estiver ausente. Ajuste a quantidade de colunas à largura real, sem apertar nomes longos.
- O tópico 1 foi implementado em `work/catalogo-web/css_style/refinamentos.css`: cards compactos, miniatura de 64 px, ausência de bloco grande para imagem ausente e uma ou duas colunas conforme a largura disponível. Ainda precisa de conferência visual manual em tamanhos estreitos e largos, nos dois temas, inclusive com nomes longos, imagens presentes/ausentes e detalhes. Não afirmar que a validação visual foi concluída.
- O tópico 2 foi implementado na fonte ativa: em telas de até 750 px, os acessos secundários do cabeçalho ficam num menu recolhível; o interruptor de tema continua visível, o cabeçalho acompanha a direção da rolagem e os botões flutuantes Home/Filtro são ocultados porque há acessos equivalentes no logo do cabeçalho e na barra do catálogo. A validação visual manual ainda está pendente.
- O tópico 3 foi implementado na fonte ativa: no celular, as categorias formam uma faixa rolável de uma linha, com opção “Todas”, que não permanece sobre os produtos; o caminho dos resultados identifica a seleção; subcategorias aparecem apenas quando há mais de uma opção disponível; a seleção leva imediatamente aos resultados e transfere o foco do teclado para a contagem. O desktop mantém sua grade e navegação. A validação visual manual ainda está pendente.
- O tópico 4 foi implementado na fonte ativa: no celular, a entrada é curta e a sequência de leitura e tabulação é categorias, resultados e parceiros. Ao voltar à largura desktop, a área de parceiros retorna à posição anterior. A validação visual manual ainda está pendente.
- O tópico 5 foi implementado na fonte ativa: no celular, o banner de parceiros usa altura natural, não reserva mídia quando não há imagem, reduz imagens presentes e compacta cabeçalho, controles e cartões da vitrine. O desktop mantém a altura estabilizada dos banners. A validação visual manual ainda está pendente.
- O tópico 6 foi implementado na fonte ativa: a atualização do estado dos botões de filtro altera apenas seu rótulo, preservando o ícone; ao fechar o painel no celular, o foco retorna ao botão visível da barra do catálogo. A validação visual manual ainda está pendente.

## 12. Ferramenta local de prévia mobile e uso do Cursor

- O simulador fica em `work/ferramentas/verificacao/simulador-mobile.html`, com instruções em `work/ferramentas/verificacao/README.md`. O modo **Publicação online · consulta** abre a publicação em outra aba; o modo **Fonte local · testar atualização** carrega a fonte ativa de `work/catalogo-web/` em tamanhos de viewport móveis.
- O modo online é somente para consulta e não atualiza a publicação. A prévia interna serve para revisão antes de publicar; publicação continua sendo um passo separado e manual conforme `work/documentacao/publicar-online.md`.
- O simulador pode ser aberto diretamente no Chrome ou Edge sem Node.js. O servidor local opcional requer Node.js e é apenas uma alternativa de recarga sem cache; não o trate como requisito para editar ou conferir o código no Cursor.
- No Cursor, abra a raiz `C:\Users\estoque\Documents\ChatGPT\AGENTE BLING` e edite a fonte em `work/catalogo-web/`. Salve e recarregue a prévia local. Não use `work/versoes/` como fonte de edição.
- A moldura interna não representa perfeitamente gestos reais, rede móvel ou dispositivos físicos. Para finalizar um tópico mobile, descreva uma conferência manual curta em celular real ou viewport do navegador, sem executar testes automáticos salvo pedido explícito.

## Regra de interface mobile first

- Para telas, componentes e fluxos novos ou reconstruídos, comece pelo celular: defina primeiro a hierarquia, as medidas, os alvos de toque e a navegação em viewport estreito; amplie o layout progressivamente para telas maiores. Preserve os comportamentos desktop já existentes, salvo pedido explícito em contrário.
- Em correções responsivas, reproduza o problema no contexto e revise o componente junto dos elementos vizinhos. Antes de criar uma solução própria, procure um padrão equivalente que já funcione no projeto e reutilize sua estrutura e comportamento quando forem adequados.
- Carrosséis e faixas horizontais devem manter no celular o comportamento esperado de passagem pela página e navegação horizontal dos itens, sem bloquear o gesto, prender a rolagem ou ampliar a página horizontalmente. Confira os gestos e controles existentes em outros trilhos antes de alterar um carrossel.
- Botões e controles devem ser avaliados nas larguras estreitas e largas: tamanho visual proporcional, texto e ícone alinhados, área de toque confortável sem dominar a tela, estados de foco e interação visíveis e ausência de sobreposição ou corte. Não corrigir apenas uma captura isolada se a regra de estilo afeta outros componentes.
- No modelo de reconstrução por partes, substitua somente módulos delimitados cuja revisão tenha mostrado um problema estrutural. Antes de reconstruir, registre o comportamento atual que precisa ser preservado; depois compare a versão nova em celular e desktop, nos temas aplicáveis, e confira acessibilidade e estados. Não iniciar uma reescrita global por conveniência.
- Para cada tópico de interface, faça conferência visual manual no viewport estreito, num tamanho intermediário e no desktop. Inclua rolagem da página e interação horizontal quando houver trilhos ou carrosséis. Registre o que foi conferido e o que continua pendente; não declare validação concluída sem observação real.

## 13. Preferências de trabalho e fluxo multi-task

### Preferências de trabalho

- Mantenha as respostas curtas, objetivas e diretas ao assunto.
- Use boas práticas de desenvolvimento e princípios SOLID quando forem adequados ao escopo, sem criar complexidade desnecessária.
- Dê nomes claros e descritivos a variáveis e funções.
- Em caso de dúvida relevante, pergunte antes de agir.
- Avise o usuário antes de começar quando a implementação for muito complexa.

### Agentes

#### Astra — avaliadora e orquestradora

- Recebe a ideia e avalia viabilidade, riscos e complexidade.
- Se houver dúvida, pergunta ao usuário antes de prosseguir.
- Se a ideia for muito complexa, avisa o usuário e propõe alternativas ou etapas.
- Divide a ideia em tarefas pequenas, cada uma com objetivo e critério de aceite claros.
- Delega as tarefas para a Luna e define a ordem, sequencial ou paralela.
- Revisa as entregas da Luna e confirma se atendem aos critérios de aceite.
- Nunca implementa código.

#### Luna — implementadora

- Implementa somente o que a Astra delegou, uma tarefa por vez.
- Segue as preferências de trabalho, os princípios SOLID e as boas práticas aplicáveis.
- Se encontrar dúvida ou bloqueio, devolve a questão à Astra em vez de assumir.
- Ao finalizar cada tarefa, informa brevemente o que foi feito.
- Nunca altera o escopo definido pela Astra.

### Fluxo multi-task

1. O usuário descreve a ideia.
2. Astra avalia e, se necessário, pergunta ou avisa sobre a complexidade.
3. Astra cria a lista de tarefas com nome, objetivo, critério de aceite e dependências.
4. Tarefas independentes podem rodar em paralelo; tarefas dependentes seguem em ordem.
5. Luna implementa cada tarefa e reporta o resultado.
6. Astra revisa cada entrega e aprova ou devolve para ajustes.
7. Ao concluir todas as tarefas, Astra entrega um resumo final curto.
