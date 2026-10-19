# Continuidade do projeto ULTRALED

Atualizado em 16/10/2026. Este documento resume as decisões relevantes do projeto para retomar o trabalho em outro ambiente.

## Estrutura

- `index.html`: entrada do projeto.
- `work/catalogo-web/`: fonte ativa do site e dados curados. Começar por `work/catalogo-web/ORGANIZACAO.md`.
- `work/versoes/`: publicações históricas e pacotes preparados; `v16/catalogo-final/pacote.zip` é o pacote preparado mais recente e aguarda envio manual.
- `work/catalogo/`: pesquisa, fontes de produtos, imagens e análises.
- `work/ferramentas/gestao-local/`: ferramenta local de gestão de produtos, compras e notas. Ler o README da pasta.
- `work/documentacao/`: instruções de publicação e decisões.

## Visão do produto

O projeto conecta o catálogo ULTRALED à futura Experiência visual. O catálogo ajuda o cliente a encontrar produtos reais e informações verificáveis; a Experiência visual deve permitir explorar ambientes preparados e visualizar opções de iluminação associadas aos produtos. A simulação é ilustrativa e nunca altera SKU, dados do Bling, especificações ou disponibilidade.

A Home apresenta a marca e oferece os caminhos para o catálogo ou a Experiência visual. `ambientes.html` continua sendo um placeholder. A navegação e as cenas devem priorizar telas pequenas, mantendo a linguagem industrial, limpa, com pouco texto e temas claro/escuro.

## Estado técnico da Experiência visual

- O laboratório `work/ferramentas/laboratorio-luz/sala/` possui uma prévia SVG 2.5D de sala, contrato JSON, validador e adaptador separado que reutiliza o núcleo do catálogo. Aceita luz geral e apoio opcional, com exemplos de JSON, controles, tema e suspensão. A conferência visual manual está pendente. É uma ferramenta local, sem integração com produtos ou publicação; não amplia as capacidades do renderizador CSS público nem substitui `ambientes.html`.

- O site usa HTML, CSS e JavaScript sem framework ou build obrigatório. A fonte ativa continua em `work/catalogo-web/`.
- O motor modular está em `work/catalogo-web/js/iluminacao/`; seu núcleo não depende do DOM nem dos produtos. O renderizador CSS atual oferece efeitos ilustrativos e não implementa iluminação física, ambientes 2.5D, paletas de cômodo ou múltiplas fontes de luz. Consulte o README do motor antes de alterá-lo.
- A ideia de ferramenta interna para criar ambientes ainda não está implementada. Foram propostas para avaliação: geração em lote com revisão e aprovação de composições; começar por JSON e validador; contrato neutro de cena com adaptadores; regras de compatibilidade externas aos itens; detecção de conflitos; e vínculo separado entre presets e referências de produto. São direções de análise, não decisões de implementação já aprovadas.

## Navegação mobile — estado em 16/10/2026

A prioridade atual é reduzir ocupação e sobreposição de conteúdo no celular, preservando desktop, dados, temas e comportamentos existentes. O trabalho foi dividido em seis tópicos: cards/lista; cabeçalho e controles; categorias/subcategorias; ordem das seções; banners/parceiros; e rótulo duplicado do filtro. Os seis tópicos foram implementados na fonte ativa e ainda aguardam conferência visual manual. No tópico 2, o menu recolhe os acessos secundários, mantém o tema visível e remove os botões flutuantes mobile em favor dos acessos equivalentes já presentes no logo/Home e na barra de filtros. No tópico 3, as categorias mobile passam a uma faixa rolável com opção “Todas” e sem sobreposição dos produtos; subcategorias aparecem apenas quando houver mais de uma disponível e a seleção leva o usuário aos resultados. No tópico 4, a entrada mobile foi encurtada e a ordem de leitura passou a ser categorias, resultados e parceiros; o desktop conserva a ordem original. No tópico 5, o banner de parceiros no celular usa sua altura natural e não reserva bloco vazio para mídia ausente, enquanto cabeçalho, controles e cartões da vitrine ficam mais compactos. No tópico 6, o rótulo do filtro deixa de duplicar e o foco retorna ao botão visível após fechar o painel no celular. Consulte `AGENTS.md` para as instruções de execução e o simulador em `work/ferramentas/verificacao/`.

## Reformulação mobile do catálogo — 19/10/2026

Na fonte ativa `work/catalogo-web/`, a vitrine de produtos dos parceiros foi reconstruída como faixa horizontal no celular; o gesto percorre os produtos e preserva a seleção atual de parceiro/banner. A paginação do catálogo também responde ao gesto horizontal. Cards e trilho de paginação ajustam colunas e apresentação conforme a largura útil, mantendo o comportamento desktop.

A rotação do banner pausa quando o foco entra em um diálogo e acompanha mudanças ao vivo de `prefers-reduced-motion`. A coordenação e apresentação da paginação foram extraídas para `js/paginacao-catalogo.js`, carregado antes de `js/catalogo.js` e incluído na lista pública do empacotador. Os dados, regras de produto e autoridade do estado continuam no catálogo.

O código foi revisado por leitura; a inspeção visual manual ainda está pendente, inclusive em viewports estreitos, intermediários e desktop, nos temas claro e escuro, com gestos, filtros, foco e movimento reduzido. Esta reformulação não foi publicada.

## Decisões desta conversa

1. O Bling é fonte de consulta. O usuário proibiu expressamente qualquer alteração no Bling.
2. A gestão local deve ter banco separado do catálogo. Cruzar e validar dados antes de qualquer futura mudança no site.
3. A tela de produtos deve ser minimalista, industrial, densa e dinâmica. Evitar janelas pop-up e textos dispensáveis. O editor compara o cadastro atual com a proposta local campo a campo e preserva rascunhos ao trocar de produto.
4. A ferramenta organiza produtos por categoria, subcategoria e parceiro; permite propostas de nome, SKU, GTIN, categoria, parceiro e imagem; e bloqueia produtos ou parceiros para que saiam das sugestões.
5. Produtos pedidos mas não entregues geram pendências para o próximo pedido. O usuário pode esquecer ou resolver a pendência, preservando o histórico.
6. Notas fiscais são recebidas em XML e podem ter PDF anexado. A contagem física é feita junto com a nota. O código do fornecedor (`cProd`) não deve ser confundido automaticamente com o SKU interno.
7. O usuário pediu que não sejam executados testes automáticos.

## Estado atual

A ferramenta local usa Node.js 24+, SQLite e escuta apenas em `127.0.0.1`. Foi inicializada a partir de uma fotografia do catálogo com 1.693 produtos e 22 parceiros. Importa XML de NF-e, anexa PDF, registra contagem, guarda faltas, aplica bloqueios locais, recebe imagens e exporta JSON/CSV. O banco próprio fica em `work/ferramentas/gestao-local/dados-locais/`.

A configuração Codex da máquina inclui o servidor MCP oficial do Bling, mas a ferramenta local ainda **não** lê saldos ou pedidos diretamente do Bling. Não interpretar a fotografia de produtos como estoque atualizado. A continuidade prioritária é implementar leitura autenticada de produtos, saldos por depósito e pedidos, salvar fotografias datadas e reconciliar pedido × XML × contagem física sem escrita no Bling.

O pacote público da v16 foi preparado de `work/catalogo-web/` em `work/versoes/v16/catalogo-final/pacote.zip`. Ele não contém `work/ferramentas/laboratorio-luz/`; a ferramenta de criação de cenas segue local e em revisão. O upload ao Cloudflare permanece manual e pendente.

## Catálogo web e publicação

A fonte ativa permanece em `work/catalogo-web/`. A versão `work/versoes/v15/consistencia-visual/` é um instantâneo preparado para distribuição: efeito de luz dos botões da Home contido na forma do botão e interruptor claro/escuro compartilhado entre Home, catálogo, Ambientes e Oficina. O ZIP contém somente os arquivos públicos permitidos pelo gerador e está pronto para envio manual ao projeto Cloudflare Pages `ultraled-hortolandia-catalogo`. O envio ainda está pendente; a produção continua na publicação confirmada em 13/10/2026. Consulte `work/documentacao/publicar-online.md` para o procedimento e o caminho exato do ZIP.

## Retomada em outra máquina

1. Extraia o pacote preservando os caminhos. Leia este documento, `AGENTS.md` e os READMEs.
2. Instale Node.js 24 ou superior. Execute `node work/ferramentas/gestao-local/server.cjs` na raiz para abrir a ferramenta local.
3. O banco incluído no pacote é uma cópia consistente no momento do backup. Se houver trabalho posterior nesta máquina, gere outro backup antes de substituir dados.
4. Configure novamente o MCP do Bling conforme `config-codex-exemplo.toml` e autentique-se no novo ambiente. Credenciais não foram incluídas no pacote.
5. O histórico integral desta conversa continua na conta Codex; este documento traz as decisões necessárias para prosseguir. Arquivos privados da instalação Codex, sessões internas e tokens não fazem parte do pacote.
