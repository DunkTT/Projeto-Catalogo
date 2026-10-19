"use strict";

const fs = require("node:fs");
const path = require("node:path");
const projetoWork = path.resolve(__dirname, "../..");
const vm = require("node:vm");

const [origemInformada, destinoInformado] = process.argv.slice(2);
if (!origemInformada || !destinoInformado) {
  throw new Error("Uso: node preparar-publicacao.cjs <pasta-do-catalogo> <pasta-nova-de-saida>");
}
const origem = path.resolve(origemInformada);
const destino = path.resolve(destinoInformado);
if (!fs.statSync(origem).isDirectory() || fs.existsSync(destino)) {
  throw new Error("A origem precisa existir e a pasta de saída precisa ser nova.");
}

const arquivosPublicos = [
  "index.html", "styles.css", "catalogo_estoque_proto1.html", "experiencia.html", "ambientes.html", "oficina.html",
  "css_style/style.css", "css_style/experiencia.css", "css_style/refinamentos.css", "css_style/paginas.css", "css_style/entrada-experiencia.css", "css_style/interruptor-tema.css",
  "css_style/iluminacao.css", "css_style/marca-cabecalho.css", "css_style/controles-cabecalho.css",
  "css_style/arraste-pagina.css", "js/arraste-pagina.js", "js/iluminacao/presets.js", "js/iluminacao/motor.js",
  "js/iluminacao/renderizador-css.js", "js/iluminacao/integracao-catalogo.js",
  "js/paginacao-catalogo.js", "js/catalogo.js", "js/paginas.js", "js/inicio.js", "js/tema.js", "js/metadados-produtos.js", "js/disponibilidade.js",
  "js/conteudo-auxiliar.js", "js/cadastro-anuncios-parceiros.js", "js/anuncios-parceiros.js", "js/classificacao-visual.js", "js/pacotes-parceiros.js"
];
fs.mkdirSync(destino, { recursive: true });
for (const relativo of arquivosPublicos) {
  const entrada = path.join(origem, relativo);
  const saida = path.join(destino, relativo);
  if (!fs.statSync(entrada).isFile()) throw new Error(`Arquivo público ausente: ${relativo}`);
  fs.mkdirSync(path.dirname(saida), { recursive: true });
  fs.copyFileSync(entrada, saida);
}

const codigoDoEstoque = fs.readFileSync(path.join(origem, "js", "estoque.js"), "utf8");
const dados = vm.runInNewContext(`${codigoDoEstoque}\ndadosDoEstoque`, Object.create(null), { timeout: 1000 });
if (!Array.isArray(dados.produtos) || dados.produtos.length === 0) throw new Error("Estoque sem produtos.");
const itensPublicos = dados.produtos.map(item => ({ id: String(item.id), sku: String(item.sku || ""), nome: String(item.nome || "") }));
fs.writeFileSync(path.join(destino, "js", "estoque.js"), `"use strict";\n// Dados públicos do catálogo: nomes, SKUs e referências para navegação.\nconst dadosDoEstoque = ${JSON.stringify({ fonte: "Cadastros de produtos da loja", produtos: itensPublicos })};\n`);

const cabecalhos = `/*
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; frame-src https://www.google.com; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; upgrade-insecure-requests
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Strict-Transport-Security: max-age=31536000
`;
fs.writeFileSync(path.join(destino, "_headers"), cabecalhos);
fs.writeFileSync(path.join(destino, "404.html"), `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Página não encontrada · ULTRALED Hortolândia</title><style>body{font:16px system-ui,sans-serif;background:#122237;color:#f3f7fa;min-height:100vh;display:grid;place-items:center;text-align:center;padding:24px}a{color:#b8dbf5}</style><main><h1>Página não encontrada</h1><p>O endereço solicitado não faz parte do catálogo.</p><a href="/">Voltar para Home</a></main></html>`);
fs.writeFileSync(path.join(destino, "robots.txt"), "User-agent: *\nAllow: /\n");

for (const pagina of ["index.html", "styles.css", "catalogo_estoque_proto1.html", "experiencia.html", "ambientes.html", "oficina.html"]) {
  const html = fs.readFileSync(path.join(destino, pagina), "utf8");
  for (const ocorrencia of html.matchAll(/(?:src|href)=["'](\.\/[^"']+)["']/g)) {
    const relativo = ocorrencia[1].split(/[?#]/)[0];
    if (!fs.existsSync(path.resolve(destino, path.dirname(pagina), relativo))) throw new Error(`Referência ausente em ${pagina}: ${relativo}`);
  }
}
console.log(`${itensPublicos.length} produtos e ${arquivosPublicos.length + 4} arquivos preparados em ${destino}`);
