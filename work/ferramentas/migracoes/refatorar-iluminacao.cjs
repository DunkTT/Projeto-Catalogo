const path = require("node:path");
const projetoWork = path.resolve(__dirname, "../..");
const fs = require('node:fs');
const base = path.join(projetoWork, "catalogo-web") + path.sep;
function editar(path, transformar) { const antes = fs.readFileSync(path, 'utf8'); fs.writeFileSync(path, transformar(antes)); }
editar(base + 'js/catalogo.js', s => {
  s = s.replace('  cores: {\n    quente:', '  cores: {\n    quente:');
  s = s.replace(/  cores: \{[\s\S]*?\n  \},/, '  iluminacao: { ativo: true, qualidade: "padrao" },\n  cores: Iluminacao.presets,');
  const inicio = s.indexOf('  let quadroDaLuz = 0, estadoDaLuzPendente = null;');
  const fim = s.indexOf('  function renderizarPaletaUnificada', inicio);
  if (inicio < 0 || fim < 0) throw Error('Trecho de iluminação ausente');
  s = s.slice(0, inicio) + `  const produtosPorId = new Map(produtos.map(produto => [produto.identificador, produto]));
  const iluminacao = Iluminacao.integrarCatalogo({
    recipiente: obterElemento("midia-modal").parentElement, midia: obterElemento("midia-modal"),
    slider: obterElemento("brilho"), valor: obterElemento("valor-brilho"),
    controle: obterElemento("controle-brilho"), qualidade: obterElemento("qualidade-iluminacao"),
    configuracao: configuracao.iluminacao
  });
  function renderizarAtmosfera(atual) {
    iluminacao.sincronizar(atual, produtosPorId.get(atual.produtoAberto));
  }
` + s.slice(fim);
  s = s.replace('if (motivo === "brilho") { agendarAtmosfera(atual); return; }', 'if (motivo === "brilho") { iluminacao.motor.atualizar({ brilho: atual.brilho }); return; }');
  s = s.replace('agendarAtmosfera(atual); return;', 'renderizarAtmosfera(atual); return;');
  s = s.replace(/    if \(quadroDaLuz\).*\r?\n/, '');
  s = s.replace(/    obterElemento\("brilho"\)\.addEventListener\("input"[^\n]*\n/, '');
  s = s.replace('      estadoAtualParaNavegacao = atual;', '      estadoAtualParaNavegacao = atual;\n      if (motivo === "fechar") iluminacao.fechar();');
  s = s.replace('  return { iniciar, renderizarLogo };', '  return { iniciar, renderizarLogo, iluminacao: iluminacao.motor };');
  return s;
});
editar(base + 'catalogo_estoque_proto1.html', s => s
  .replace('<link rel="stylesheet" href="./css_style/refinamentos.css">', '<link rel="stylesheet" href="./css_style/refinamentos.css">\n  <link rel="stylesheet" href="./css_style/iluminacao.css">')
  .replace('<section class="comparacao" id="comparacao"', '<label class="qualidade-iluminacao">Efeitos de luz<select id="qualidade-iluminacao"><option value="padrao">Padrão</option><option value="economico">Econômico</option><option value="desligado">Desligado</option></select></label><section class="comparacao" id="comparacao"')
  .replace('  <script src="./js/catalogo.js" defer></script>', ['presets', 'motor', 'renderizador-css', 'integracao-catalogo'].map(nome => `  <script src="./js/iluminacao/${nome}.js" defer></script>`).join('\n') + '\n  <script src="./js/catalogo.js" defer></script>'));
editar(base + 'css_style/refinamentos.css', s => s.replace(/\/\* A luz vive[^\n]*\n[\s\S]*?(?=\.comparacao \.paleta)/, '/* Efeitos da prévia: iluminacao.css. */\n').replace('@media(prefers-reduced-motion:reduce){#midia-modal:after,.ambiente:before,.tom-selecionavel{transition:none}}', '@media(prefers-reduced-motion:reduce){.tom-selecionavel{transition:none}}'));
editar(path.join(projetoWork, "ferramentas", "publicacao", "preparar-publicacao.cjs"), s => s.replace('  "js/catalogo.js",', '  "css_style/iluminacao.css", "js/iluminacao/presets.js", "js/iluminacao/motor.js",\n  "js/iluminacao/renderizador-css.js", "js/iluminacao/integracao-catalogo.js",\n  "js/catalogo.js",'));
editar('work/verificar-catalogo.cjs', s => s.replace('const javascript =', 'vm.runInContext(fs.readFileSync(pasta + "/js/iluminacao/presets.js", "utf8"), contexto);\nconst javascript =').replace('assert.equal(contexto.atual.corDaPrevia, "quente");', 'assert.equal(contexto.atual.corDaPrevia, "neutro");'));
editar(path.join(projetoWork, "ferramentas", "verificacao", "verificar-experiencia.cjs"), s => s.replace('["js/estoque.js",', '["js/iluminacao/presets.js", "js/classificacao-visual.js", "js/estoque.js",'));
// Demais ferramentas que avaliam catalogo.js precisam carregar os presets primeiro.
for (const nome of ['auditar-catalogo.cjs', 'atualizar-organizacao.cjs']) {
  editar(path.join(base, nome), s => {
    const linhas = s.split('\n');
    const i = linhas.findIndex(l => /vm\.runInContext/.test(l));
    if (i < 0) throw Error('Carregador não reconhecido: ' + nome);
    const linha = linhas[i];
    const contexto = linha.match(/,\s*(\w+)\);/);
    if (!contexto) throw Error('Contexto não reconhecido: ' + nome);
    linhas.splice(i, 0, `vm.runInContext(fs.readFileSync(require("node:path").join(__dirname, "js/iluminacao/presets.js"), "utf8"), ${contexto[1]});`);
    return linhas.join('\n');
  });
}
