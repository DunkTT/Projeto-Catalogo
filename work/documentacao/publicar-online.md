# Publicar o catálogo no Cloudflare Pages

**Produção atual:** <https://ultraled-hortolandia-catalogo.pages.dev/>. Último envio confirmado: 13/10/2026. Projeto Cloudflare Pages: `ultraled-hortolandia-catalogo`.

O pacote público desta publicação está arquivado em `work/versoes/20261013/cloudflare/pacote.zip`. Envie **somente esse ZIP** nas próximas versões, nunca a pasta inteira do projeto: ela também contém editor, dados de pesquisa e relatórios internos.

1. Entre em <https://dash.cloudflare.com/> e abra **Workers & Pages**.
2. Abra o projeto **ultraled-hortolandia-catalogo**.
3. Use **Create a new deployment**, selecione o ZIP de distribuição e confirme a publicação no mesmo projeto.
4. Confira a Home, o catálogo, a oficina, os detalhes dos produtos, o mapa e a troca de tema na URL de produção.

## Pacote pronto para envio

`work/versoes/v16/catalogo-final/pacote.zip` é o pacote preparado mais recente a partir de `work/catalogo-web/`. Contém 1.693 produtos e 36 arquivos públicos, usa caminhos relativos padronizados e não inclui a ferramenta local `work/ferramentas/laboratorio-luz/`. O upload ainda está pendente; confira e envie somente este ZIP se decidir publicar a v16.

`work/versoes/v15/consistencia-visual/pacote.zip` é o pacote anterior, com 1.693 produtos e 32 arquivos públicos. Foi substituído pelo preparo da v16 descrito acima. Até que o novo envio seja concluído, a produção continua na versão publicada em 13/10/2026.

O ZIP usa caminhos relativos, não requer build nem servidor local e inclui `_headers` com política de conteúdo, restrição de iframe e outros cabeçalhos de proteção. O arquivo `404.html` impede que endereços inexistentes sejam confundidos com a Home. O estoque público inclui nomes, SKUs e referências de cadastro necessárias à navegação; não contém preços nem saldos. **Todo JavaScript publicado é visível a visitantes**, inclusive URLs editoriais de fontes de parceiros; nunca coloque chaves, senhas, preços reservados ou dados privados nesses arquivos. Uma futura integração com API de estoque precisa passar por um serviço no servidor, com as credenciais guardadas fora do navegador.

Para preparar versões futuras, use `node work/ferramentas/publicacao/preparar-publicacao.cjs work/catalogo-web work/versoes/v16/<tema>/site`. A pasta de saída precisa ser nova. Comprima o **conteúdo** de `site` como `pacote.zip` na mesma pasta da versão; envie apenas esse arquivo.

Documentação oficial: <https://developers.cloudflare.com/pages/get-started/direct-upload/> · <https://developers.cloudflare.com/pages/configuration/headers/> · <https://developers.cloudflare.com/pages/platform/limits/>.
