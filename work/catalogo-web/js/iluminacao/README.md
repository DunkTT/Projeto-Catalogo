# Motor de iluminação — API v1

Carregamento por scripts clássicos, sem build, compatível com abertura local. Ordem: presets.js, motor.js, renderizador-css.js, integracao-catalogo.js, catalogo.js.

O núcleo não conhece DOM, produtos ou tema da interface. A integração recebe os elementos e traduz a seleção do catálogo; o brilho do slider vai diretamente ao motor. Os métodos antigos de estado permanecem como ponte de compatibilidade. Cor da prévia nunca altera SKU; temperatura do cadastro continua independente dos três tons ilustrativos.

Configuração inicial: `configuracaoDoCatalogo.iluminacao = { ativo: true, qualidade: "padrao" }`. Use `ativo: false` ou qualidade `desligado` para iniciar sem efeitos. O seletor permite reativar durante a sessão. A preferência não é persistida.

## API

`Iluminacao.criarMotor({ renderizador, agendar?, cancelar?, presets? })` retorna uma instância inicialmente suspensa. Renderizadores implementam `renderizar(snapshot)` e `limpar()`. O CSS deve ser criado por `Iluminacao.criarRenderizadorCSS(elemento)`.

- `atualizar({ tom?, brilho? })`: quente/neutro/frio; brilho numérico finito limitado a 0–100. Descarta valores repetidos e reúne alterações em um quadro.
- `ativar(boolean)`: desativa efeitos e cancela trabalho, preservando escolhas.
- `definirQualidade("padrao" | "economico" | "desligado")`: econômico usa uma única camada plana e sem transição; desligado remove os efeitos.
- `suspender(boolean = true)`: cancela quadro e limpa efeitos; retomar pinta o estado mais recente.
- `definirRenderizador(adapter)`: limpa o anterior e agenda o novo.
- `obterEstado()` e `observar(callback)`: snapshot; observar retorna função de remoção.
- `destruir()`: cancela trabalho, limpa efeitos e observadores; chamadas posteriores não reativam a instância.
- `definirCena({ ambiente, paleta, fontes })`: ambiente/paleta são IDs ou null; fontes possuem ID único, tipo pontual/linear/ambiente, posição [x,y,z] finita, tom válido e intensidade 0–1. Coordenadas são locais à cena, com interpretação definida pelo renderizador. Os dados são copiados e congelados.

O renderizador CSS atual declara `capacidades` com ambientes, paletas e múltiplas fontes desativados: conserva esses dados no núcleo para futuros renderizadores, mas ainda não desenha uma sala ou lustre. O tema da interface continua fora do motor. Nenhum cálculo fotométrico ou conversão física Kelvin–RGB é prometido.

## Integração e validação

O adaptador suspende ao fechar a prévia, selecionar produto não simulável ou ocultar a aba. `destruir()` do adaptador também remove seus ouvintes. O modo de movimento reduzido suprime transições via CSS. Não há loop de animação em repouso.

Na raiz do projeto, execute `node work/verificar-iluminacao.cjs`, `node work/verificar-catalogo.cjs` e `node work/verificar-experiencia.cjs`. Empacote com `node work/preparar-publicacao.cjs work/catalogo-web <nova-pasta>`; os cinco arquivos novos estão na lista pública explícita.

Compare no mesmo navegador/dispositivo o arraste contínuo do brilho, alternância rápida de tons, abertura/fechamento, tema claro/escuro, teclado e modo econômico. Testes do núcleo demonstram uma renderização para 100 entradas antes do quadro, mas não substituem medição de pintura/FPS em dispositivos reais.
