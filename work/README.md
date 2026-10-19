# Mapa da pasta `work`

| Caminho | Conteúdo | Como tratar |
|---|---|---|
| `catalogo-web/` | Fonte atual da Home, catálogo, estilos, scripts e dados curados | Edite aqui a versão de trabalho. |
| `versoes/<versao>/<tema>/site/` | Cópia completa de uma publicação | Instantâneo histórico; não editar como fonte ativa. |
| `versoes/<versao>/<tema>/pacote.zip` | ZIP correspondente ao instantâneo, quando disponível | Pacote preparado para distribuição. |
| `versoes/20261013/cloudflare/` | Cópia e pacote enviados ao Cloudflare em 13/10/2026 | Registro da publicação datada. |
| `ferramentas/laboratorio-luz/` | Palco local de luz, cor e clipes JSON | Ferramenta interna; não editar o catálogo a partir daqui. |
| `ferramentas/verificacao/` | Ferramentas de conferência existentes | Seus caminhos padrão apontam para `catalogo-web/`. |
| `ferramentas/publicacao/` | Gerador do pacote público | Gere sempre em uma nova pasta dentro do próximo caminho de versão. |
| `ferramentas/migracoes/` | Scripts antigos usados durante mudanças específicas | Histórico de trabalho; não execute sobre a fonte atual sem revisar. |
| `documentacao/` | Publicação e notas específicas de funções | Instruções para publicação e classificação visual. |
| `catalogo/` | Pesquisa auxiliar, fontes, scripts, imagens e análises de produtos | Mantenha os caminhos locais: os scripts de pesquisa usam arquivos relativos. |

## Caminhos versionados

Versões seguem `versoes/vNN/<tema>/`. Cada tema pode conter `site/` e `pacote.zip`. A versão preparada mais recente é `v16/catalogo-final/`; o envio ao Cloudflare está pendente. O catálogo ativo continua sendo `catalogo-web/`; um pacote preparado não substitui automaticamente a fonte nem a publicação.

| Path | Alteração registrada |
|---|---|
| `versoes/v02/navegacao/` | Navegação |
| `versoes/v03/parceiros/` e `versoes/v04/parceiros/` | Parceiros |
| `versoes/v05/trilhos/` | Trilhos |
| `versoes/v06/experiencia/` | Experiência |
| `versoes/v07/home/`, `v08/home/`, `v09/home/` | Revisões da Home |
| `versoes/v10/acessibilidade/` | Acessibilidade |
| `versoes/v11/css/` | CSS |
| `versoes/v12/parceiros/` | Parceiros |
| `versoes/v13/classificacao/` | Classificação |
| `versoes/v14/iluminacao/` | Motor de iluminação |
| `versoes/v15/consistencia-visual/` | Botões da Home e interruptor claro/escuro compartilhado; ZIP pronto para envio manual ao Cloudflare |
| `versoes/v16/catalogo-final/` | Catálogo público preparado a partir da fonte ativa, sem a ferramenta local de criação de cenas; ZIP pronto para envio manual |
| `versoes/20261013/cloudflare/` | Cópia datada da publicação Cloudflare |

## Criar a próxima versão

Escolha o próximo número e o tema antes de gerar. Por exemplo, `work/versoes/v16/<tema>/site/` deve ainda não existir. A partir da raiz do projeto, execute:

`node work/ferramentas/publicacao/preparar-publicacao.cjs work/catalogo-web work/versoes/v16/<tema>/site`

Comprima o conteúdo da pasta `site` como `pacote.zip` na pasta `<tema>`. A saída é um conjunto público de arquivos; distribua apenas o pacote. O formato do ZIP do Cloudflare e as etapas de envio estão em `documentacao/publicar-online.md`.

Os scripts em `ferramentas/migracoes/` guardam intervenções antigas e algumas esperam trechos que já mudaram. Consulte o histórico, mas não os use como comandos para recriar a fonte atual.
