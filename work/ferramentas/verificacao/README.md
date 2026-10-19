<!-- Orientações rápidas para as ferramentas locais de conferência do catálogo. -->
# Ferramentas de conferência visual

## Verificações automatizadas — execução somente quando autorizada

Na raiz do projeto, com Node.js disponível:

```powershell
node work/ferramentas/verificacao/verificar-catalogo.cjs
node work/ferramentas/verificacao/verificar-experiencia.cjs
node work/ferramentas/verificacao/verificar-gestos.cjs
node work/ferramentas/verificacao/verificar-iluminacao.cjs
```

Os três primeiros aceitam o caminho opcional da fonte como primeiro argumento; sem argumento usam `work/catalogo-web`, independentemente da pasta do terminal. A verificação de iluminação usa a fonte ativa. Não executam navegador nem acessam Bling ou SQLite.

Resultados, cobertura e contratos dos trilhos recuperados no tópico 1: [BASE-VERIFICACAO-2026-10-17.md](../../documentacao/BASE-VERIFICACAO-2026-10-17.md). A autorização de 17/10/2026 foi específica para esse tópico e não altera a regra geral do projeto.

## Simulador mobile

Para usar sem instalar Node.js, abra `simulador-mobile.html` no Chrome ou Edge. Selecione **Fonte local · testar atualização**, escolha uma página e um tamanho de tela e use **Recarregar fonte local** depois de editar no Cursor. A ferramenta carrega os arquivos diretamente de `work/catalogo-web/`.

Se Node.js estiver disponível, o servidor opcional oferece recarga com cache desativado. Inicie-o na raiz do projeto:

```powershell
node work/ferramentas/verificacao/servidor-simulador-mobile.cjs
```

Depois, abra `http://127.0.0.1:4173/` no Chrome ou Edge. O simulador tem dois modos:

- **Publicação online · consulta:** abre a versão publicada em uma aba separada. O site bloqueia sua incorporação em molduras por política de segurança.
- **Fonte local · testar atualização:** mostra a versão de `work/catalogo-web/` na moldura mobile. As respostas usam `no-store`, então **Recarregar fonte local** busca novamente o HTML, CSS e JavaScript atuais.

O servidor opcional aceita somente leituras dos arquivos públicos necessários do catálogo, está vinculado a `127.0.0.1` e não é incluído no pacote público. A ferramenta faz inspeção visual manual; não simula hardware, rede móvel nem gestos reais de toque.

No Cursor, abra a pasta raiz do projeto e edite a fonte em `work/catalogo-web/`. Salve o arquivo e recarregue a prévia interna. O projeto já traz as instruções em `AGENTS.md`.
