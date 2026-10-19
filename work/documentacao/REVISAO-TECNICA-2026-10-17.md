<!-- Revisão técnica dos blocos ativos do projeto ULTRALED.
     Registra evidências, verificações e propostas de reconstrução; não autoriza publicação. -->
# Revisão técnica — 17/10/2026

## Conclusão

A reconstrução por partes é justificada principalmente na apresentação do catálogo: carrosséis, vitrine, paginação e CSS dos componentes. Há mecanismos diferentes para ações parecidas, responsabilidades concentradas em `criarVisualizacao()` e estilos antigos sobrepostos por correções posteriores. Uma nova camada de ajustes mobile manteria essas causas.

Não há evidência que justifique reconstruir o projeto inteiro, trocar de framework ou substituir o banco. A base de produtos, o núcleo público de iluminação e o contrato da sala podem ser preservados. Na gestão local, os blocos de importação e edição de notas precisam de atenção própria por risco de informação incorreta e perda de alterações ainda não salvas.

## Escopo e método

- Documentação considerada: README da raiz e de `work`, continuidade, organização do catálogo, AGENTS e READMEs do motor, laboratório, sala, gestão e simulador.
- Leitura técnica dos fluxos centrais de catálogo, navegação, gestos, estilos, Home, páginas auxiliares, anúncios, classificação editorial, iluminação, laboratório, gestão, publicação e backup.
- Verificação de sintaxe de 44 arquivos JS/CJS de `catalogo-web` e `ferramentas`, excluindo migrações e dados operacionais. Esta verificação não executa os scripts nem valida visualmente HTML/CSS.
- Quatro verificações existentes executadas, após autorização explícita do usuário nesta etapa. Os testes foram avaliados em contextos Node isolados, preservando seu código e fornecendo os argumentos e globais necessários.
- Reproduções adicionais em memória, usando funções reais do projeto e dados fictícios: quantidade XML ausente/negativa, SKU ambíguo e retomada de efeito pausado.
- Nenhuma alteração na implementação, no SQLite operacional, no Bling ou na publicação. Instantâneos históricos não foram tratados como fonte ativa.
- A revisão é por blocos e caminhos relevantes; não constitui prova de todas as combinações, revisão individual dos 1.693 cadastros ou medição de desempenho.

**Limite visual:** o inventário da ferramenta de navegador retornou nenhuma superfície conectada. Portanto, o relato de travamento mobile não foi reproduzido num navegador nesta sessão. As conclusões abaixo distinguem leitura de código, reprodução isolada e hipótese de manifestação visual.

## 1. Reconstruir navegação horizontal, vitrine e paginação — prioridade alta

### Evidências

- `catalogo-web/js/catalogo.js:897`: `habilitarGesto()` trata arraste para rolagem, troca de slide e arraste vertical da página na mesma função. Usa captura de ponteiro, supressão de clique, limiares e transformação visual.
- `catalogo-web/js/catalogo.js:907`: quando existe troca de slide, iniciar o gesto em um botão é ignorado. Os trilhos de marcas e categorias seguem outro caminho e permitem rolagem nativa de toque (`:909`). Assim, arrastar sobre áreas diferentes do componente tem resultados diferentes por construção.
- `catalogo-web/js/catalogo.js:1271`: o gesto da `grade-parceiro` chama `moverParceiro()`. Ele troca a seleção/marca inteira; não percorre horizontalmente os produtos daquela seleção.
- `catalogo-web/css_style/experiencia.css:161` e `css_style/style.css:9`: a vitrine é uma grade. Não existe ali uma faixa de produtos com overflow horizontal nativo e encaixe por item. Isso confirma a divergência estrutural com o comportamento solicitado para itens horizontais.
- `catalogo-web/js/catalogo.js:973`: cada atualização monta a página atual e duas páginas vizinhas de produtos. Com 48 famílias por página, pode criar até 144 cartões. É custo estrutural comprovado; lentidão em dispositivo real ainda não foi medida.
- `catalogo-web/js/catalogo.js:989`: a montagem dos trilhos altera a estrutura HTML durante a inicialização. Vizinhos, janela, geometria, animação e estado de paginação dependem uns dos outros.
- `catalogo-web/css_style/refinamentos.css:123`: o deslocamento geral usa `16px` literal enquanto o gap usa `--espaco-4`. O banner recebe outra fórmula em `:255`. Hoje o token vale 16px; uma alteração de espaçamento pode desalinhar somente parte do sistema.
- `catalogo-web/js/catalogo.js:1003`: as páginas vizinhas ganham `tabIndex=0`, mas apenas suas grades internas ficam `inert`. O recorte visual não retira o recipiente da sequência de foco. Há risco de foco fora da janela visível quando a página vizinha está habilitada.

### Reconstrução proposta

Delimitar três responsabilidades, com estado e ações explícitos:

1. Banner: seleção ativa, anterior/próximo e pausa da rotação.
2. Vitrine: produtos da seleção em faixa horizontal mobile, aproveitando o padrão nativo já usado nas marcas; percorrer itens não deve trocar a seleção.
3. Catálogo: página de resultados e seus controles. Se o gesto deve trocar páginas inteiras, ele deve respeitar a mesma ação dos botões e os limites da consulta.

Usar a estrutura funcional existente dos trilhos como referência, sem criar um motor universal de gestos. O contrato deve manter rolagem vertical da página, toque nos detalhes, teclado e movimento reduzido. Definir como tratar o início do gesto sobre um botão sem sacrificar o clique.

**Critério de saída:** avançar/voltar por toque e controles produz a mesma seleção; rolar verticalmente sobre banner/cartão funciona; percorrer a vitrine não troca seu conteúdo; primeiro/último resultado não deixam páginas vazias; foco permanece visível; ampliar para desktop conserva o comportamento acordado.

**Ainda aberto para a implementação:** confirmar se “grade mobile passando a página” se refere à paginação do catálogo, à faixa de produtos dos parceiros ou a ambas. A revisão analisou os dois mecanismos sem atribuir ao usuário uma escolha não confirmada.

## 2. Reconstruir CSS dos componentes substituídos — prioridade alta

### Evidências

- O catálogo carrega oito folhas de estilo (`catalogo_estoque_proto1.html:9`), incluindo base, experiência, refinamentos e controles compartilhados. A quantidade de arquivos não é o defeito; a mesma responsabilidade é redefinida em várias camadas.
- Em `css_style/refinamentos.css`, o carrossel tem geometria inicial em `:81`, trilho em `:122`, geometria de banners em `:203`, nova transformação em `:255` e ajustes mobile em `:392`.
- `css_style/refinamentos.css:426` força duas colunas para qualquer largura até 750px. Não há nessa regra a alternância uma/duas colunas descrita no histórico. A legibilidade final dos nomes em tela estreita precisa de observação visual.
- Os controles combinam regras gerais de alvo de toque (`:195`), regras por componente e tamanhos mobile. Alterar uma medida sem rastrear a cascata não garante o resultado em todos os componentes.

### Reconstrução proposta

Ao substituir cada componente, reunir seu layout e seus estados num único lugar, com base mobile e expansão por largura disponível. Remover as regras antigas correspondentes na mesma substituição, após verificar quem mais as usa. Reutilizar tokens de tema, medidas e interruptores existentes.

Começar por cartões/ações e pelos três componentes do bloco 1. Não converter todas as folhas de uma vez. A quantidade de colunas deve responder à largura útil do cartão e ao conteúdo; a escolha não deve ser simplesmente “duas colunas porque é celular”.

**Critério de saída:** 320, 390, 750/751 e 1280px, além dos pontos de quebra afetados; nomes longos; imagem presente, ausente e com erro; foco; filtros abertos; dois temas; zoom e movimento reduzido. Esses tamanhos são a proposta de conferência, não validações já realizadas.

## 3. Reconstruir a coordenação da tela do catálogo por responsabilidades — prioridade média

`catalogo-web/js/catalogo.js:364` inicia `criarVisualizacao()`, que segue até perto de `:1334`. Essa função engloba contato, ajuda, parceiros, gestos, filtros, detalhes, cabeçalho e inicialização. Uma alteração na apresentação precisa conhecer variáveis compartilhadas de muitas áreas.

O arquivo também contém taxonomia, regras de agrupamento, consulta de produtos e disponibilidade. Já existem funções de domínio sem DOM; preservá-las ajuda a proteger os cadastros durante a reconstrução da interface.

**Proposta:** extrair somente os blocos efetivamente reconstruídos, com entradas e ações explícitas. A consulta fornece resultados; componentes apresentam e solicitam ações. Não mover todo o código de uma vez nem criar uma camada de framework. O estado de paginação deve ter uma única autoridade.

**Desempenho a medir:** custo de consulta/ordenação e criação de cartões em 12/24/48 resultados; atualização da vitrine durante filtros; abertura de detalhes. Não há medição que justifique agora virtualização ou backend novo.

## 4. Reconstruir importação e edição de notas da gestão local — prioridade alta para uso operacional

### A. Quantidade inválida aceita — reproduzido em memória

`ferramentas/gestao-local/server.cjs:84` extrai XML com expressões regulares. Em `:91`, aplica `Number(tag(prod, "qCom"))`; quantidade ausente vira zero e quantidade negativa passa por `Number.isFinite()`.

Reprodução com dados fictícios:

| Entrada | Resultado atual |
|---|---|
| Item sem `qCom` | Aceito com quantidade 0 |
| `qCom=-3` | Aceito com quantidade -3 |

**Proposta:** reconstruir a entrada da NF-e em etapas de leitura estrutural, validação explícita dos campos e importação transacional. Não confundir campo ausente com zero. Preservar código do fornecedor, unidade e confirmação manual do vínculo. Avaliar parser XML apropriado quando este bloco for implementado; não escolher dependência nesta revisão.

### B. Alterações em outras linhas podem ser descartadas — evidência no fluxo

`ferramentas/gestao-local/app.js:207` recria o conteúdo inteiro da nota com valores de `state.invoices`. O evento de digitação atualiza a diferença visual, mas não armazena um rascunho da linha. Ao salvar uma linha (`:297`), recarrega as notas e chama `renderInvoices()` (`:306`).

Consequência dedutível do fluxo: preencher duas linhas e salvar apenas uma recria a segunda com o valor anterior do banco. Anexar um PDF também recria essa área (`:410`). Não foi realizado teste visual dessa sequência.

**Proposta:** reconstruir o editor com rascunho por nota/item e retorno de gravação por linha. Salvar uma linha deve preservar as demais. Desabilitar ou versionar gravações concorrentes para não apagar edições feitas enquanto uma requisição está em andamento.

### C. Mesma nota pode ser importada novamente com bytes diferentes — evidência no código

`server.cjs:140` rejeita duplicação por SHA-256 dos bytes. A chave da nota é armazenada, mas não é usada como proteção contra duplicação. Alterar espaços do XML muda o hash sem necessariamente mudar a nota.

**Proposta:** definir identidade pela chave válida da nota e tratar reimportação explicitamente. Antes de adicionar restrição ao SQLite, conferir possíveis duplicatas existentes por leitura e preparar backup consistente. Nenhum banco foi inspecionado ou migrado nesta revisão.

### D. Regra de nome vazio diverge entre tela e exportação — evidência no código

`app.js:33` usa fallback quando `edit_name` está vazio. As consultas de faltas/sugestões/CSV em `server.cjs:115`, `:116` e `:128` usam `COALESCE`, que não trata texto vazio como ausente. Limpar uma proposta pode deixar nome vazio na saída mesmo com nome original disponível.

Isso merece correção pequena na regra comum de leitura, não reconstrução do banco inteiro.

## 5. Unificar resolução de referência de anúncios — prioridade média

`catalogo-web/js/gerenciador-parceiros.js:8` exige exatamente um cadastro correspondente. Porém `js/anuncios-parceiros.js:49` usa `find()` e retorna a primeira família quando um SKU corresponde a várias.

**Reproduzido em memória:** duas famílias fictícias com o mesmo SKU retornaram a primeira. Não foi comprovado anúncio ativo incorreto nos dados atuais.

**Proposta:** uma mesma regra de resolução para editor e consumo: identificar por ID exato; aceitar SKU apenas quando inequívoco; devolver estado explícito de referência ausente/ambígua. Preservar revisão local e a proibição de aplicar propostas automaticamente ao catálogo.

**Disponibilidade:** `resolverDisponibilidade()` mantém “Em estoque” mesmo sem saldo, conforme a decisão registrada em `ORGANIZACAO.md`. Já o comentário de `disponibilidade.js` diz que não afirma disponibilidade sem saldo. É divergência documental/conceitual, não autorização para mudar a regra comercial. Separar o significado de cadastro presente do saldo verificável precisa de decisão explícita.

## 6. Laboratório: corrigir ciclo de vida; preservar núcleo e sala — prioridade média

O motor público em `catalogo-web/js/iluminacao/` mantém separação entre núcleo e renderizador e passou na verificação existente. A sala possui contrato estrito, validação antes da troca, isolamento de SVG e suspensão por visibilidade. Não há motivo demonstrado para reescrever esses blocos.

O laboratório de clipes usa outro motor, em `ferramentas/laboratorio-luz/js/motor.js`. Essa diferença é funcional: clipes temporais não são a mesma operação da prévia estática.

**Defeito reproduzido:** carregar um efeito parado desenha um quadro; suspender limpa a renderização; retomar não redesenha porque `solicitar()` retorna quando `reproduzindo` é falso (`:45`, `:101`). A interface usa esse caminho ao trocar de aba. O mesmo merece conferência nos modos econômico e movimento reduzido.

**Outro ponto confirmado por leitura:** `banco-local.js:5` aceita qualquer array salvo, e `interface.js:46` aplica itens da biblioteca como previamente válidos. Rascunhos recuperados não passam novamente pelo validador. Dados antigos ou corrompidos podem chegar ao motor.

**Proposta:** revisar o ciclo de suspensão/retomada e validar rascunhos na entrada. A interface mobile da sala pode ser reconstruída separadamente; não generalizar seu validador para todos os cômodos antes de existir um segundo caso aprovado.

## 7. Publicação e backup — manter separação, revisar limites

- `ferramentas/publicacao/preparar-publicacao.cjs` usa lista explícita de arquivos públicos e gera saída nova. Preservar esse limite.
- O simulador mantém outra lista de arquivos permitidos. Ao substituir módulos, atualizar ambas e conferir que a prévia local representa o pacote. A revisão não executou empacotamento nem publicação.
- O gerador público não copia automaticamente imagens adicionadas ao módulo de mídia e verifica apenas parte das referências estáticas. É limitação para futuras mídias, não prova de imagem quebrada hoje.
- `criar-pacote-drive.py` usa a API de backup SQLite, em vez de copiar WAL/SHM. Preservar.
- O pacote privado percorre a raiz com uma lista de exclusões. Isso não garante excluir qualquer novo arquivo de credencial criado no futuro. Recomenda-se reconstruir a seleção do pacote por conteúdo permitido antes de ampliar seu uso. Não foram procurados ou expostos segredos, nem foi demonstrado vazamento em pacote existente.

## 8. Reconstruir a cobertura de verificação antes das substituições

O comando `node` não está no PATH do terminal. Foi usado o runtime Node disponibilizado pela ferramenta, com execução em memória e argumentos explícitos. Tentativas iniciais herdaram argumentos do runtime e foram corrigidas; esses erros de invocação não são classificados como defeitos do projeto.

| Verificação | Resultado válido desta revisão | Interpretação |
|---|---|---|
| Sintaxe dos 44 JS/CJS | Passou | Apenas sintaxe; não executa DOM, SQL ou CSS |
| `verificar-iluminacao.cjs` | Passou | Núcleo, integração e adaptador CSS nos cenários existentes |
| `verificar-catalogo.cjs` | Falhou | Não carrega `classificacao-visual.js`; `ReferenceError` antes de completar a suíte |
| `verificar-experiencia.cjs` | Falhou | Ainda exige `ir-home-abertura`, ausente do HTML atual |
| `verificar-gestos.cjs` | Falhou | Espera rolagem acumulada 0, mas cenário anterior já a alterou para -90; precisa revisar isolamento e expectativa |
| Quantidade XML ausente/negativa | Defeitos reproduzidos | Parser aceitou 0 e -3 respectivamente |
| SKU ambíguo de anúncio | Defeito reproduzido | Retornou primeira família |
| Retomada do clipe parado | Defeito reproduzido | Limpou e não redesenhou |

`ferramentas/gestao-local/test.cjs` foi inspecionado: usa diretório temporário próprio. Não foi executado de ponta a ponta; o servidor/SQLite não foi iniciado nesta revisão. Os testes adicionais de XML não gravaram dados.

A suíte de gestos atual usa objetos simulados e não carrega CSS, hit testing, cancelamento nativo do navegador ou viewport. Mesmo corrigida e passando, não comprovará que o toque funciona num celular.

**Proposta:** corrigir a preparação das suítes existentes, acrescentar cenários dos defeitos encontrados e criar verificações de integração em navegador para os componentes reconstruídos. Evitar testes que só procuram nomes de seletores ou IDs antigos. A autorização de testes vale para esta etapa; não foi alterada a regra geral do AGENTS.

## Ordem sugerida de reconstrução

1. Recuperar verificações confiáveis e registrar os comportamentos esperados dos trilhos.
2. Reconstruir vitrine e navegação horizontal mobile, preservando o padrão funcional das marcas.
3. Reconstruir paginação/cartões e seu CSS, removendo as regras substituídas.
4. Reconstruir banner/rotação e consolidar os controles relacionados.
5. Extrair a coordenação desses componentes do controlador principal; não separar arquivos apenas por tamanho.
6. Tratar editor/importação de notas antes do próximo uso operacional relevante; essa prioridade não depende da conclusão visual do site.
7. Corrigir resolução de anúncios e retomada do laboratório; revisar publicação e documentação conforme os módulos forem substituídos.

Cada etapa termina com comparação desktop/mobile e registro dos resultados. Reescrever uma parte não autoriza mudar dados, política comercial, identidade visual ou publicar o site.

## Conferência manual posterior

1. Na fonte local, começar em 320/390px e comparar categorias/marcas com banner, vitrine e paginação. Arrastar sobre texto, espaço vazio e botão; conferir vertical e horizontal.
2. Percorrer primeira, intermediária e última página; abrir detalhes, fechar e conferir foco/seleção. Repetir em desktop e nos dois temas.
3. Em banco descartável, editar duas linhas de uma nota, salvar só uma e verificar se a outra preserva o rascunho; anexar PDF com edição pendente.
4. No laboratório de clipes, pausar, trocar de aba e voltar; repetir em econômico/movimento reduzido. A sala SVG é outro fluxo e deve ser conferida separadamente.

## Entrega desta etapa

Único arquivo criado: este relatório. Nenhum bloco foi reconstruído ainda. As propostas delimitam a implementação seguinte e não apresentam hipóteses visuais como validações concluídas.
