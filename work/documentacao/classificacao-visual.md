# Classificação editorial ULTRALED

Configuração: `js/classificacao-visual.js`. Os registros de prioridade continuam em `js/cadastro-anuncios-parceiros.js`. Não há alteração no formato do estoque.

## Níveis internos e apresentação

| Interno | Pontos mínimos | Sinal visual | Rótulo público |
| --- | ---: | --- | --- |
| Comum | 0 | Cinza, losango | Descoberta |
| Incomum | 20 | Azul, losango preenchido | Seleção em foco |
| Raro | 45 | Violeta, estrela | Conexão com sua seleção |
| Épico | 75 | Dourado, estrela | Destaque da sua seleção |

Pontuação: categoria selecionada 25; subcategoria 20; proporção dos termos da busca encontrados até 30; prioridade editorial de 0 a 5 até 20; presença de especificações cadastradas 5. Máximo de 100. Os pesos são hipóteses editoriais configuráveis, não resultados de estudos ou previsões de conversão. Não inferem qualidade técnica, estoque disponível, popularidade, emoções ou características pessoais.

Uma seleção exibe no máximo um produto no nível visual máximo; os demais candidatos desse nível usam a apresentação do nível anterior. A pontuação original e a explicação da moderação permanecem disponíveis no resultado interno. Banners adotam o maior nível de relevância entre os produtos associados; isso não certifica todos os itens da marca. Busca e categoria são usadas somente no estado da sessão, sem nova coleta, cookies de rastreamento ou envio de telemetria.

## Fundamentação de design

- [NN/g — Visual Hierarchy](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/): contraste e agrupamento orientam a atenção. Aplicação: cores consistentes, selo curto e borda sem alteração de dimensões.
- [NN/g — Role of Animation and Motion](https://www.nngroup.com/articles/animation-purpose-ux/): movimento atrai atenção e pode distrair. Aplicação: preservar a transição existente, sem pulsação contínua, contadores ou partículas nos níveis.
- [NN/g — Similarity Principle](https://www.nngroup.com/articles/gestalt-similarity/): sinais consistentes ajudam a reconhecer relações. Aplicação: mesma classificação no banner central, nas prévias e nos produtos complementares.

As referências sustentam princípios de interface, não associações universais entre cores e emoções, nem os limiares deste modelo. A escolha de cores é uma convenção visual inspirada em RPG. O texto e o símbolo permitem compreender a classificação sem depender apenas da cor.

## Limites e manutenção

O nível não altera a disponibilidade. Fontes de parceiros continuam apenas internas; os links visíveis abrem o catálogo. O estoque não controla uma raridade artificial. A classificação não comprova compatibilidade elétrica entre produtos.

Não foram executados testes automáticos, estudos com clientes ou medições de conversão. Validar visualmente temas, níveis, expansão de explicações e troca de seleções antes do envio manual. O pacote não inclui este documento interno.
