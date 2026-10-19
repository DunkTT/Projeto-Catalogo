const path = require("node:path");
const projetoWork = path.resolve(__dirname, "../..");
const fs = require('node:fs');
const raiz = path.join(projetoWork, "catalogo-web") + path.sep;
const arquivos = ['css_style/style.css', 'css_style/experiencia.css', 'css_style/refinamentos.css', 'css_style/paginas.css'];
for (const arquivo of arquivos) {
  let css = fs.readFileSync(raiz + arquivo, 'utf8');
  // Remove apenas as colunas antigas dessas grades, preservando carrosséis,
  // navegação compacta, seletores combinados e regras específicas de movimento.
  css = css.replace(/\.(grade|grade-parceiro|grade-oficina|grade-atalhos)\{([^{}]*)\}/g, (_, nome, corpo) => {
    const restante = corpo.replace(/grid-template-columns:[^;}]*(?:;|$)/g, '');
    return restante.trim() ? '.' + nome + '{' + restante + '}' : '';
  });
  // Padroniza somente medidas de espaçamento, sem tocar em dimensões de mídia.
  const medidas = { '8px': 'var(--espaco-2)', '12px': 'var(--espaco-3)', '16px': 'var(--espaco-4)', '24px': 'var(--espaco-6)' };
  css = css.replace(/((?:^|[;{])(?:gap|row-gap|column-gap|padding(?:-(?:top|right|bottom|left))?|margin(?:-(?:top|right|bottom|left))?):)([^;}]+)/g, (_, propriedade, valor) =>
    propriedade + valor.replace(/(?<![\d.])(8px|12px|16px|24px)\b/g, medida => medidas[medida])
  );
  const cores = {
    '#17222d': 'var(--fundo-cartao)', '#1c2935': 'var(--fundo-midia-cartao)',
    '#fafbf9': 'var(--fundo-cartao-claro)', '#edf1ef': 'var(--fundo-midia-claro)',
    '#ffffff08': 'var(--camada-translucida)', '#ffffff20': 'var(--contorno-translucido)'
  };
  css = css.replace(/#[\da-f]{3,8}\b/gi, cor => cores[cor.toLowerCase()] || cor);
  // Elimina somente blocos vazios gerados pela retirada dos breakpoints.
  css = css.replace(/@media[^{}]+\{\s*\}/g, '');
  fs.writeFileSync(raiz + arquivo, css);
}
const tokens = `/* Tokens compartilhados: cores preservadas e espaçamentos reutilizáveis. */
:root{
  --espaco-2:8px;--espaco-3:12px;--espaco-4:16px;--espaco-6:24px;
  --largura-minima-card:280px;
  --fundo-cartao:#17222d;--fundo-midia-cartao:#1c2935;
  --fundo-cartao-claro:#fafbf9;--fundo-midia-claro:#edf1ef;
  --camada-translucida:#ffffff08;--contorno-translucido:#ffffff20;
}
.grade,.grade-parceiro,.grade-oficina,.grade-atalhos{
  grid-template-columns:repeat(auto-fit,minmax(min(100%,var(--largura-minima-card)),1fr));
}
`;
const base = raiz + 'css_style/style.css';
fs.writeFileSync(base, tokens + fs.readFileSync(base, 'utf8'));
fs.appendFileSync(raiz + 'css_style/paginas.css', `
/* Área secundária sem elementos fixos ou trilhos animados. */
.oficina-isolada{content-visibility:auto;contain-intrinsic-size:1px 500px;contain-intrinsic-block-size:auto 500px}
@media print{.oficina-isolada{content-visibility:visible;contain-intrinsic-size:none}}
`);
let home = fs.readFileSync(raiz + 'styles.css', 'utf8');
home = home.replace('--largura-card:16rem;', '--largura-card:280px;');
// A seção controla o adiamento; remove o containment redundante nos filhos.
home = home.replace(/\.atalhos \.atalho\s*\{[^{}]*\}/g, '');
home += `
/* Apenas a seção secundária; o Hero permanece disponível imediatamente. */
.atalhos{
  content-visibility:auto;
  contain-intrinsic-size:1px 500px;
  contain-intrinsic-block-size:auto 500px;
}
@media print{.atalhos{content-visibility:visible;contain-intrinsic-size:none}}
`;
fs.writeFileSync(raiz + 'styles.css', home);
