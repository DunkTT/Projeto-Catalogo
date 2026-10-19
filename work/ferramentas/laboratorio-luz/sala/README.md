<!-- Documenta a sala, o contrato JSON e seu adaptador SVG local.
     Inclui limitações e passos de conferência manual sem testes automáticos. -->
# Sala de estar — direção visual

Abra `previa.html` diretamente no Chrome ou Edge. As duas apresentações usam cópias isoladas da mesma sala sobre superfícies clara e escura, com controles compartilhados. Não exige servidor, instalação ou conexão; mantenha a estrutura do projeto, pois a prévia carrega os scripts existentes do núcleo em `catalogo-web/`.

## Decisões visuais

- Um modelo de sala: concreto claro, piso de madeira média, sofá verde acinzentado, mesa baixa e metal grafite.
- Vista frontal com profundidade oblíqua discreta, sem câmera móvel. O desenho não usa projeção isométrica rigorosa.
- Um pendente central e uma luminária de apoio lateral, ambos genéricos e sem vínculo com produtos.
- Fundo externo transparente; materiais da sala permanecem iguais nos dois temas da interface.
- Composição fixa, sem textos internos, pessoas, marcas ou fachos realistas. Controles ficam acima das cenas.

## Camadas do SVG

| ID | Papel |
|---|---|
| `fundo` | Sombra de assentamento da composição |
| `paredes` | Parede principal e lateral, também identificadas individualmente |
| `piso` | Superfície e espessura da base |
| `janela` | Vidro, esquadria e peitoril |
| `tapete` | Delimitação da área de estar |
| `sofa` | Sofá e almofadas |
| `mesa` | Mesa baixa e objeto decorativo |
| `area-luz-principal` | Mancha artística recortada pela parede |
| `area-luz-piso` | Área de luz independente recortada pelo piso |
| `area-luz-apoio` | Mancha artística local junto à luminária lateral |
| `luminaria-principal` | Corpo do pendente e origem visual da luz |
| `luminaria-apoio` | Corpo da luminária lateral e origem visual da luz |

As superfícies iluminadas possuem limites próprios e são desenhadas antes dos objetos que as ocultam. As áreas de luz começam com opacidade zero no SVG; o adaptador revela apenas as fontes declaradas. Cores dos materiais ficam em propriedades CSS no próprio SVG.

Os centros dos elementos `ponto-luz-principal` (460, 231) e `ponto-luz-apoio` (676, 322) são referências 2D no viewBox de 960 × 760. O contrato usa essas unidades locais: origem superior esquerda, X para a direita, Y para baixo e Z fixo em zero. O adaptador aceita somente as posições desta composição.

## Escopo e conferência

### Escolhas do visitante

A prévia identifica Sala de estar e Industrial acolhedor como ambiente/modelo únicos, sem seletores vazios. O visitante escolhe a iluminação geral (Quente, Neutra ou Fria) em um seletor nativo e alterna Luz de apoio em um interruptor com estado visível Ligada/Desligada, nome acessível estável e `aria-checked`.

Os tons e a intensidade usada ao ligar o apoio vêm de `opcoesPermitidas` do contrato validado. O apoio só é mostrado quando a fonte está declarada; só permite alternância quando existem intensidade zero e uma intensidade positiva. A luz geral é obrigatória; o apoio é opcional. Sem apoio, omita sua fonte, suas opções e seu vínculo, e use `multiplasFontes: false` nas capacidades exigidas. As camadas permanecem no inventário da mesma arte; a prévia oculta a luminária lateral e sua área de luz permanece apagada. Não há edição de posição, potência ou geometria.

As mudanças preservam os elementos focados e atualizam as duas prévias. A indicação Visualização ilustrativa fica junto às escolhas. Importação de JSON e qualidade ficam em Ajustes do laboratório, abaixo das cenas. Conferir manualmente Tab, setas do seletor, Espaço/Enter do interruptor e toque em tela estreita; essa conferência ainda está pendente.

O renderizador CSS do site declara ambientes e múltiplas fontes indisponíveis. O adaptador local `renderizador-svg.js` implementa essas capacidades especificamente para esta sala; não oferece troca de paleta ou posicionamento livre. O núcleo existente é reutilizado sem modificações. Só o objeto `cena` é enviado a `definirCena()`.

| Arquivo | Responsabilidade |
|---|---|
| `cena.json` | Fonte do contrato válido, opções, capacidades e vínculos |
| `cena-sem-apoio.json` | Exemplo válido com apenas luz geral e sem controle de apoio |
| `validador.js` | Estrutura estrita, referências SVG e compatibilidade da sala |
| `renderizador-svg.js` | Fontes independentes, gradientes, qualidade e limpeza |
| `previa.js` | Controles, importação de JSON e suspensão por visibilidade |
| `previa.html` | Prévia local, com SVG e contrato incorporados |
| `preparar-previa.cjs` | Atualiza as cópias incorporadas depois de editar JSON ou SVG |
| `exemplos-invalidos/` | Seis documentos completos para conferência manual de rejeição |

O JSON estrito não aceita comentários; sua finalidade está documentada aqui. Nenhum documento contém dados de produto. As intensidades 0,7 e 0,4 são escolhas artísticas iniciais sujeitas a revisão. A luz geral permite quente/neutro/frio; apoio permite quente, ligado (0,4) ou desligado (0). Regras ficam no contrato e no validador da cena, fora de itens de produto.

O carregador aceita somente JSON de até 64 KiB e nunca carrega caminhos informados nele. Um documento inválido é recusado antes de alterar a cena; a página mostra o erro e o console traz os detalhes. Os seis exemplos representam ID repetido, posição não numérica, tom desconhecido, intensidade fora do intervalo, camada inexistente e tom conhecido incompatível com a fonte de apoio.

O modo econômico usa uma área plana por fonte, sem transição nem gradientes ativos. Desligar ou suspender oculta todas as manchas de luz, mantendo mobiliário e materiais. Movimento reduzido remove transições; não existe ciclo contínuo de animação. Cada cena pausa fora de vista ou com a aba oculta. Limpar restaura os estilos anteriores e remove os gradientes criados pelo adaptador; a opacidade zero da arte garante ausência de efeitos após limpeza. As cores usam as chaves dos presets existentes, sem nova tabela de temperaturas.

A importação prepara e valida as duas apresentações antes de substituir os adaptadores pelo método `definirRenderizador()` do núcleo. A saída definitiva da página chama `destruir()`, remove os ouvintes da prévia e desconecta o observador de visibilidade. Ao entrar no cache de navegação do navegador, apenas suspende para permitir o retorno.

O interruptor Tema claro reutiliza o CSS e o script compartilhados do catálogo. Sua preferência é salva pela rotina existente. A mudança altera somente a interface: as duas superfícies de comparação e os materiais da sala permanecem fixos.

Para manter abertura direta por arquivo, `previa.html` contém cópias de `cena.json` e `sala-estar.svg`. Depois de editar essas fontes, execute opcionalmente, a partir de `work/`, `node ferramentas/laboratorio-luz/sala/preparar-previa.cjs`. Isso atualiza a prévia; não é requisito para abri-la e não executa testes. Alterações nos scripts são carregadas ao recarregar a página. A importação pelo controle é temporária e não altera arquivos.

Não houve integração com produtos nem publicação. `ambientes.html` continua sendo o placeholder existente. A ferramenta não acessa o Bling.

Conferência manual no navegador ainda pendente:

1. Abrir `previa.html` a 320, 390 e 1280 pixels; conferir ambas as superfícies, enquadramento e ausência de rolagem horizontal.
2. Alternar os três tons, ligar/desligar apoio com toque e teclado e selecionar Padrão/Econômico/Desligado; alternar Tema claro e conferir a leitura dos controles.
3. Carregar `cena-sem-apoio.json`: luminária lateral e interruptor devem desaparecer, mantendo a luz geral. Carregar `cena.json` novamente e conferir o retorno do apoio, inclusive após uma troca com efeitos desligados.
4. Carregar cada documento em `exemplos-invalidos/`. Todos os inválidos devem mostrar erro e preservar a última cena válida.
5. Ativar movimento reduzido e alternar controles; rolar a cena para fora da tela e trocar de aba, retornando às escolhas anteriores. Sair e voltar pelo histórico do navegador também deve preservar uma prévia utilizável.

Foi feita leitura do código e das capacidades declaradas; nenhum teste automático foi executado. Desempenho e aparência ainda precisam de conferência em navegador/dispositivo real.
