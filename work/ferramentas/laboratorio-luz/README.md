<!-- Laboratório local para testar luz, cor e clipes sem tocar no catálogo publicado. -->
# Laboratório de luz

Ferramenta interna em `work/ferramentas/laboratorio-luz/`. Não faz parte da publicação do site e não carrega produtos.

Abra `index.html` no Chrome ou Edge (arquivo local). Não exige Node.js.

O estudo de sala fica em `sala/previa.html`: usa o núcleo do catálogo com um adaptador SVG local, contrato JSON e duas fontes independentes. Consulte `sala/README.md` para os limites e a conferência manual pendente. Essa prévia também abre diretamente, sem servidor.

Use o palco para ver presets, padrões e JSON gerado por outras IAs. O contrato está em `CONTRATO.md`. Rascunhos ficam só neste navegador, chave `laboratorio-luz.rascunhos`.

Módulos:

| Arquivo | Papel |
|---|---|
| `js/regras.js` | limites de brilho, duração e qualidade |
| `js/presets.js` | paletas ilustrativas |
| `js/padroes.js` | curvas de tempo |
| `js/misturador.js` | junta preset + padrão + fontes |
| `js/validador.js` | recusa JSON fora do contrato |
| `js/motor.js` | relógio sem quadro ocioso |
| `js/renderizador-css.js` | camadas no palco |

Nada daqui altera `catalogo-web/` nem o Bling. Para levar um efeito ao site no futuro, copie só o JSON aprovado e integre num passo separado.
