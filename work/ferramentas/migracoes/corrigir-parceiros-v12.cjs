const path = require("node:path");
const projetoWork = path.resolve(__dirname, "../..");
const fs = require('node:fs');
const arquivo = path.join(projetoWork, "catalogo-web", "js", "catalogo.js");
let js = fs.readFileSync(arquivo, 'utf8');
js = js.replace('  const animacoesDosTrilhos = new Map();', `  const animacoesDosTrilhos = new Map();
  let larguraDosBanners = 0, alturaDosBanners = 0, direcaoDaVitrine = 1;
  const animacoesDaVitrine = new Set();
  function estabilizarBanners() {
    const trilho = obterElemento("trilho-parceiros");
    if (!trilho || !trilho.getClientRects().length) return;
    const largura = trilho.parentElement.clientWidth;
    const paineis = [...trilho.children];
    if (Math.abs(largura - larguraDosBanners) > 1) {
      larguraDosBanners = largura;
      alturaDosBanners = 0;
      paineis.forEach(painel => painel.style.removeProperty("min-height"));
    }
    // Mantém a maior altura natural nesta largura, inclusive na troca do centro.
    alturaDosBanners = Math.ceil(Math.max(alturaDosBanners, ...paineis.map(painel => painel.getBoundingClientRect().height)));
    paineis.forEach(painel => { painel.style.minHeight = alturaDosBanners + "px"; });
  }
  function cancelarAnimacoesDaVitrine() {
    animacoesDaVitrine.forEach(animacao => animacao.cancel());
    animacoesDaVitrine.clear();
  }
  function animarVitrine(elemento, quadros, duracao) {
    const animacao = elemento.animate(quadros, { duration: duracao, easing: "cubic-bezier(.22,.72,.18,1)" });
    animacoesDaVitrine.add(animacao);
    animacao.onfinish = () => { animacoesDaVitrine.delete(animacao); animacao.cancel(); };
  }`);
js = js.replace('    const passo = trilho.children[1].getBoundingClientRect().width + 16;', '    const passo = trilho.children[1].getBoundingClientRect().width + (parseFloat(getComputedStyle(trilho).columnGap) || 0);');
js = js.replace('    renderizarPreviasDoParceiro();', '    renderizarPreviasDoParceiro();\n    estabilizarBanners();');
js = js.replace('    deslizarTrilho(trilho, direcao, () => {\n      modoParceiros', `    estabilizarBanners();
    direcaoDaVitrine = Math.sign(direcao) || 1;
    cancelarAnimacoesDaVitrine();
    const vitrine = obterElemento("vitrine-parceiro");
    if (!vitrine.hidden && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      animarVitrine(obterElemento("grade-parceiro"), [
        { opacity: 1, transform: "translateX(0)" },
        { opacity: .45, transform: "translateX(" + (-direcaoDaVitrine * 12) + "px)" }
      ], 620);
    }
    deslizarTrilho(trilho, direcao, () => {
      modoParceiros`);
js = js.replace('  function preencherVitrine(selecionados, resumo, titulo) {', `  function preencherVitrine(selecionados, resumo, titulo) {
    const vitrine = obterElemento("vitrine-parceiro");
    const alturaAnterior = vitrine.hidden ? 0 : vitrine.getBoundingClientRect().height;
    cancelarAnimacoesDaVitrine();`);
const fim = '    }));\n  }\n  function pausarParceiros()';
js = js.replace(fim, `    }));
    if (alturaAnterior > 0 && selecionados.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const alturaNova = vitrine.getBoundingClientRect().height;
      animarVitrine(vitrine, [{ height: alturaAnterior + "px" }, { height: alturaNova + "px" }], 420);
      animarVitrine(obterElemento("grade-parceiro"), [
        { opacity: .45, transform: "translateX(" + (direcaoDaVitrine * 12) + "px)" },
        { opacity: 1, transform: "translateX(0)" }
      ], 420);
    }
  }
  function pausarParceiros()`);
js = js.replace('    const grade = obterElemento("grade"), janelaGrade', `    new ResizeObserver(estabilizarBanners).observe(janela);
    const grade = obterElemento("grade"), janelaGrade`);
fs.writeFileSync(arquivo, js);
fs.appendFileSync(path.join(projetoWork, "catalogo-web", "css_style", "refinamentos.css"), `
/* Os três banners compartilham geometria; o trilho move sem escala. */
#trilho-parceiros{align-items:stretch}
#trilho-parceiros>.palco-parceiro,#trilho-parceiros>.previa-parceiro{
  align-items:stretch;align-content:stretch;justify-content:normal;
  grid-template-columns:minmax(160px,33%) minmax(0,1fr);
  gap:20px;padding:15px;border-radius:17px;transform:none;scale:none;
}
#trilho-parceiros .conteudo-parceiro{display:block;min-width:0;text-align:left}
#trilho-parceiros :is(.conteudo-parceiro h3,.titulo-banner-vizinho){
  display:block;font-size:clamp(1.2rem,2vw,1.65rem);line-height:1.25;
  font-weight:700;letter-spacing:-.015em;margin:8px 0;
}
#trilho-parceiros :is(.conteudo-parceiro p,.descricao-banner-vizinho){
  display:block;max-width:550px;font-size:.78rem;line-height:1.6;margin:0 0 12px;
}
#trilho-parceiros .acoes-parceiro{display:flex;align-items:center}
#trilho-parceiros :is(.acao-previa,#explorar-parceiro){
  display:inline-flex;align-items:center;justify-content:center;min-height:48px;
  padding:8px 12px;font:650 .7rem/1.5 system-ui,sans-serif;border-radius:9px;
}
#vitrine-parceiro{box-sizing:border-box;overflow:clip;overflow-clip-margin:6px}
@media(max-width:750px){#trilho-parceiros>.palco-parceiro,#trilho-parceiros>.previa-parceiro{grid-template-columns:1fr;gap:20px}}
@media(max-width:540px){#trilho-parceiros>.palco-parceiro,#trilho-parceiros>.previa-parceiro{padding:10px}}
`);
