<!-- Resultado do tópico 1: recuperação das verificações existentes.
     Distingue cobertura em memória, contratos atuais e pendências no navegador. -->
# Base de verificação — 17/10/2026

## Resultado e execução

As três falhas da seção 8 da revisão técnica foram reproduzidas antes das alterações. Após a correção, passaram `verificar-catalogo.cjs`, `verificar-experiencia.cjs` e `verificar-gestos.cjs`. Também passou `verificar-iluminacao.cjs`, sem alterações, como regressão da simulação usada no catálogo.

Node não está no PATH deste terminal. A execução utilizou o runtime da ferramenta Node, com um contexto VM novo por arquivo, `require` resolvido pelo caminho do teste, `__dirname` explícito e `process.argv = ['node', caminhoDoTeste]`. O conteúdo dos arquivos foi executado sem remover asserções ou capturar falhas como sucesso. Isso evita os argumentos herdados mencionados na revisão. Não foi validada a invocação por um executável `node` no terminal desta máquina; os comandos reproduzíveis estão no README das verificações.

## Falha do teste versus aplicação

| Falha reproduzida | Causa e correção |
|---|---|
| Catálogo: `classificacaoVisual is not defined` | Preparação incompleta: carregar o módulo real de classificação antes do catálogo, como já ocorre na página. Não foi criado substituto para a classificação. |
| Experiência: exigência de `ir-home-abertura` | Expectativa anterior à separação das páginas. Substituída por verificações de links Home → ambientes/catálogo, catálogo → Home/resultados, ambientes → catálogo e redirecionamento do endereço antigo. |
| Gestos: `-90 !== 0` | Estado compartilhado: o arraste vertical anterior já havia rolado -90. Cada cenário agora cria janela, elemento, relógio e contexto próprios; o cenário vertical exige explicitamente -90. |
| Gestos: trilho sem `scrollWidth` no objeto simulado | Preparação irreal: a comparação com `undefined` deixava passar o arraste. Agora há dimensões explícitas e cenários com e sem overflow. |

Nenhuma dessas falhas exigiu corrigir a aplicação. Isso não invalida os defeitos e limitações de aplicação identificados na revisão técnica. Nenhum arquivo da interface, dado, banco ou publicação foi alterado.

## Cobertura real

| Verificação | O que foi exercitado | O que não comprova |
|---|---|---|
| Catálogo | 1.693 cadastros em 1.346 famílias; IDs, SKUs e nomes originais preservados; preço/saldo ausentes; cinco SKUs vazios; percurso completo sem duplicação; limites da primeira/última página e consulta vazia; busca por SKU; filtros não vazios; acabamento, brilho e prévia; exemplos de agrupamento; IDs/referências locais | Renderização dos cartões, ordenação editorial em todas as combinações, foco, responsividade ou desempenho |
| Experiência | Disponibilidade conforme regra vigente; três externos curados; especificações declaradas; parceiros, pacotes determinísticos, vínculos de anúncios existentes, rejeição de URL insegura/referência ausente; conteúdos auxiliares; destinos de navegação, ordem de dependências e referências de páginas | Execução dos links/redirect no navegador; aparência, contraste, cascata CSS, rotação real ou todos os sorteios de pacotes |
| Gestos | 15 cenários isolados: dois sentidos, captura/limpeza, bloqueio e expiração de clique, clique de teclado, deslocamento curto, vertical sobre slide, cancelamento/perda de captura/blur, overflow, área aninhada, toque não interceptado nos dois eixos, vertical próprio, toque em slide, botão e ponteiro secundário/outro ID | CSS, hit testing, propagação real, captura nativa, inércia, zoom, limites de scroll do navegador, foco ou integração com ações de cada componente |
| Iluminação | Suíte existente de núcleo/renderizador/integrador: coalescência, limites, modos, suspensão/retomada, cenas, limpeza e integração de produto | Aparência da luz, física, sala SVG ou ciclo de vida do motor separado de clipes |

As verificações estruturais antigas de IDs e seletores que continuam aplicáveis foram mantidas; são apenas verificações textuais. A suíte de gestos ainda extrai `habilitarGesto` do controlador: agora falha com mensagem explícita se os limites de extração mudarem. Na futura extração do módulo, sua preparação deverá acompanhar a nova estrutura.

## Contratos dos trilhos para as próximas reconstruções

| Área | Comportamento atual a considerar | Critério da reconstrução / pendência |
|---|---|---|
| Categorias e marcas | Trilhos horizontais sem callback de slide deixam o toque para o navegador; mouse arrasta quando existe overflow | Preservar passagem vertical, toque e controles. Encaixe específico das marcas e CSS não foram executados nesta suíte. |
| Banner | O gesto de slide em área não interativa chama avanço/recuo; botão não inicia gesto | Ação por gesto e controles deve produzir a mesma seleção. Definir início sobre botão preservando clique; rotação/pausa ainda exigem integração. |
| Vitrine do parceiro | `grade-parceiro` chama `moverParceiro`; o gesto troca a seleção, não percorre itens | Divergência estrutural registrada, não corrigida: a faixa proposta deve percorrer produtos sem trocar a seleção. O teste genérico não certifica esse vínculo. |
| Paginação | Estado limita primeira/última página; consulta vazia fica na página 1 | Preservar os limites e a correspondência entre gesto e botões. Páginas vizinhas, foco visível e custo de cartões dependem de verificação posterior. |

O cenário que registra botão ignorado é caracterização da limitação atual, não aprovação desse comportamento como solução final. A escolha do alcance de “passar a página” (catálogo, vitrine ou ambos) permanece aberta para a etapa de reconstrução.

## Limitações e trabalho não realizado

- Nenhuma conferência visual ou interação em navegador foi realizada nesta etapa, que não alterou a interface. Os seis tópicos mobile continuam com validação visual pendente.
- Defeitos de XML, rascunhos de notas, SKU ambíguo e retomada do clipe parado continuam registrados na revisão. Não foram corrigidos nem incluídos como testes aprovados destas três suítes; pertencem aos blocos seguintes. O motor público aprovado não é o motor de clipes.
- Não foram executados testes da gestão, servidor operacional, migrações, publicação ou acesso ao Bling. Não houve geração de pacote.
- Decisões tomadas: manter contagens da fotografia atual; carregar dependência real; substituir somente expectativa obsoleta por destinos atuais; isolar gestos e explicitar dimensões; ampliar limites de paginação sem alterar regras comerciais.

## Conferência manual posterior

1. Abrir a fonte local pelo simulador e seguir Home → experiência/catálogo e retorno; confirmar que ambientes continua em preparação.
2. Em 320/390 px, tamanho intermediário e desktop, testar vertical e horizontal sobre texto, espaço vazio e botões de marcas, banner, vitrine e produtos. Comparar gesto e setas, nos dois temas.
3. Percorrer primeira/última página, fazer busca sem resultados, abrir/fechar detalhes e conferir foco por teclado. Repetir com movimento reduzido; confirmar toque também em celular real.
