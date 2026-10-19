# Gestão local de produtos e compras

Protótipo interno separado do catálogo público. Requer Node.js 24 ou superior. Execute, na raiz do projeto:

```powershell
node work/ferramentas/gestao-local/server.cjs
```

Abra no navegador o endereço `http://127.0.0.1:PORTA` exibido no terminal. O serviço escuta apenas em `127.0.0.1` e escolhe uma porta livre. Os dados ficam em `dados-locais/gestao.sqlite`, ignorado pelo Git. Faça backup pelo botão **Exportar banco em JSON** e guarde também os PDFs anexados em `dados-locais/documentos/`. O JSON exportado é uma cópia para auditoria; esta versão não possui restauração automática.

## Fluxo disponível

- Catálogo inicial: importa IDs, nomes, SKUs, categorias, subcategorias e parceiros do índice local em `work/catalogo-web/`. O cadastro original fica preservado; propostas são campos separados no SQLite.
- Produtos: bancada compacta com busca, filtros por categoria, subcategoria, parceiro e estado. A lista e o painel fixo exibem cadastro atual e proposta local campo a campo. Alterações não salvas permanecem em rascunho ao trocar de produto; **Salvar proposta** grava apenas os campos alterados. Use as setas ↑/↓ na lista para percorrer os produtos. Produto bloqueado não entra em sugestões de compra.
- Parceiros: cadastro local e bloqueio. Parceiro bloqueado retira seus produtos vinculados das sugestões.
- Faltas: informe fornecedor, quantidade pedida e recebida; a diferença aparece no próximo pedido. Fornecedor da compra e parceiro/marca do catálogo ficam em campos diferentes. **Esquecer sugestão** muda a pendência para esquecida, preservando o histórico. O CSV exporta apenas sugestões ativas sem bloqueio.
- Notas: importe XML de NF-e, anexe o PDF da mesma nota e registre a contagem física por item. Um GTIN que corresponda a um único SKU pode gerar vínculo preliminar; confira e salve o vínculo manualmente. O código `cProd` da nota é tratado como código do fornecedor.
- Imagens: carregue PNG, JPEG ou WebP na proposta de cada produto. O arquivo fica em `dados-locais/imagens/`, vinculado pelo ID do Bling. A publicação no catálogo continua uma etapa separada de revisão, usando o `moduloDeMidia` já existente.

A interface não usa janelas de confirmação nem avisos flutuantes. Resultados e erros aparecem na faixa de estado da própria tela. Em telas estreitas, a lista fica acima da edição; selecionar um produto leva diretamente ao painel.

## Limites desta versão

Esta versão **não se conecta ao Bling** e não possui credenciais ou rotas de escrita para ele. Usa a fotografia de produtos já presente no projeto; ainda não traz saldo atual, depósitos nem pedidos de compra do Bling. Não modifica `work/catalogo-web/`. Não interpreta o PDF por OCR e não publica imagens no catálogo. O CSV de próximo pedido é uma proposta local, não um pedido criado no Bling.

O próximo passo é adicionar um conector de leitura da API do Bling para produtos, saldos por depósito e pedidos de compra, preservando fotografias datadas no banco local. Depois, cruzar **pedido × XML × contagem** e revisar variações de unidade e embalagem antes de qualquer recomendação de quantidade.
