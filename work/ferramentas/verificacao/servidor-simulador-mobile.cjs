"use strict";

// Serve somente o simulador e os arquivos públicos necessários da fonte ativa.
// Todas as respostas são sem cache e apenas GET/HEAD são aceitos.
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

const HOST = "127.0.0.1";
const PORTA = 4173;
const pastaDaFerramenta = __dirname;
const pastaDoCatalogo = path.resolve(__dirname, "../../catalogo-web");
const arquivosDoCatalogo = new Set([
  "index.html", "styles.css", "catalogo_estoque_proto1.html", "experiencia.html", "ambientes.html", "oficina.html",
  "css_style/style.css", "css_style/experiencia.css", "css_style/refinamentos.css", "css_style/paginas.css",
  "css_style/entrada-experiencia.css", "css_style/interruptor-tema.css", "css_style/iluminacao.css",
  "js/iluminacao/presets.js", "js/iluminacao/motor.js", "js/iluminacao/renderizador-css.js",
  "js/iluminacao/integracao-catalogo.js", "js/catalogo.js", "js/paginas.js", "js/inicio.js", "js/tema.js",
  "js/estoque.js", "js/metadados-produtos.js", "js/disponibilidade.js", "js/conteudo-auxiliar.js",
  "js/cadastro-anuncios-parceiros.js", "js/anuncios-parceiros.js", "js/classificacao-visual.js", "js/pacotes-parceiros.js"
]);
const tiposDeConteudo = new Map([
  [".html", "text/html; charset=utf-8"], [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"], [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"], [".png", "image/png"], [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"], [".webp", "image/webp"]
]);

function cabecalhosDaResposta(caminho, ePaginaDaFerramenta) {
  const politicaDeEnquadramento = ePaginaDaFerramenta ? "'none'" : "'self'";
  const politicaDeScripts = ePaginaDaFerramenta ? "'self' 'unsafe-inline'" : "'self'";
  const politicaDeFrames = ePaginaDaFerramenta ? "'self'" : "'self' https://www.google.com";
  return {
    "Content-Type": tiposDeConteudo.get(path.extname(caminho).toLowerCase()) || "application/octet-stream",
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    "Pragma": "no-cache",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": ePaginaDaFerramenta ? "DENY" : "SAMEORIGIN",
    "Referrer-Policy": "no-referrer",
    "Content-Security-Policy": `default-src 'self'; script-src ${politicaDeScripts}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; frame-src ${politicaDeFrames}; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors ${politicaDeEnquadramento}`
  };
}

function responderErro(resposta, codigo, mensagem) {
  resposta.writeHead(codigo, { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" });
  resposta.end(mensagem);
}

function localizarArquivo(caminhoSolicitado) {
  if (caminhoSolicitado === "/" || caminhoSolicitado === "/simulador-mobile.html") {
    return { caminho: path.join(pastaDaFerramenta, "simulador-mobile.html"), ePaginaDaFerramenta: true };
  }
  if (!caminhoSolicitado.startsWith("/catalogo-web/")) return null;
  const relativo = caminhoSolicitado.slice("/catalogo-web/".length).replaceAll("\\", "/");
  if (!arquivosDoCatalogo.has(relativo)) return null;
  return { caminho: path.join(pastaDoCatalogo, ...relativo.split("/")), ePaginaDaFerramenta: false };
}

const servidor = http.createServer((pedido, resposta) => {
  if (pedido.method !== "GET" && pedido.method !== "HEAD") {
    resposta.setHeader("Allow", "GET, HEAD");
    responderErro(resposta, 405, "Este servidor aceita apenas leitura.");
    return;
  }

  let caminhoSolicitado;
  try {
    caminhoSolicitado = decodeURIComponent(new URL(pedido.url, `http://${HOST}:${PORTA}`).pathname);
  } catch {
    responderErro(resposta, 400, "Endereço inválido.");
    return;
  }

  const arquivo = localizarArquivo(caminhoSolicitado);
  if (!arquivo) {
    responderErro(resposta, 404, "Arquivo não disponível no simulador.");
    return;
  }

  fs.readFile(arquivo.caminho, (erro, conteudo) => {
    if (erro) {
      responderErro(resposta, erro.code === "ENOENT" ? 404 : 500, "Não foi possível ler o arquivo solicitado.");
      return;
    }
    resposta.writeHead(200, cabecalhosDaResposta(arquivo.caminho, arquivo.ePaginaDaFerramenta));
    resposta.end(pedido.method === "HEAD" ? undefined : conteudo);
  });
});

servidor.listen(PORTA, HOST, () => {
  console.log(`Simulador mobile local: http://${HOST}:${PORTA}/`);
  console.log("A fonte é servida sem cache e somente para leitura. Encerre com Ctrl+C.");
});
