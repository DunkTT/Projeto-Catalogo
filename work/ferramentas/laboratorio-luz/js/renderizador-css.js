"use strict";
// Pinta o palco com variáveis CSS. Não calcula fotometria; é prévia gráfica.
LaboratorioLuz.criarRenderizadorCSS = function (palco) {
  const nomes = ["--cor-luz", "--acento-luz", "--brilho", "--progresso-cena", "--x-foco", "--y-foco", "--opacidade-ambiente", "--opacidade-linear", "--opacidade-pontual", "--cor-ambiente", "--cor-linear", "--cor-pontual"];
  const originais = nomes.map(nome => [nome, palco.style.getPropertyValue(nome)]);
  let anterior = {};

  function camada(snapshot, tipo) {
    return snapshot.camadas.find(item => item.tipo === tipo) || { cor: snapshot.cor, opacidade: 0, posicao: [0.5, 0.5, 0] };
  }
  function escrever(nome, valor) {
    if (anterior[nome] !== valor) palco.style.setProperty(nome, valor);
    anterior[nome] = valor;
  }

  return {
    renderizar(snapshot) {
      palco.classList.add("palco-ativo");
      palco.dataset.qualidade = snapshot.qualidade;
      const pontual = camada(snapshot, "pontual");
      const linear = camada(snapshot, "linear");
      const ambiente = camada(snapshot, "ambiente");
      escrever("--cor-luz", snapshot.cor);
      escrever("--acento-luz", snapshot.acento);
      escrever("--brilho", String(snapshot.brilho / 100));
      escrever("--progresso-cena", String(snapshot.progresso));
      escrever("--x-foco", String(pontual.posicao[0]));
      escrever("--y-foco", String(pontual.posicao[1]));
      escrever("--opacidade-ambiente", String(ambiente.opacidade));
      escrever("--opacidade-linear", String(linear.opacidade));
      escrever("--opacidade-pontual", String(pontual.opacidade));
      escrever("--cor-ambiente", ambiente.cor);
      escrever("--cor-linear", linear.cor);
      escrever("--cor-pontual", pontual.cor);
    },
    limpar() {
      nomes.forEach((nome, indice) => {
        const valor = originais[indice][1];
        if (valor) palco.style.setProperty(nome, valor);
        else palco.style.removeProperty(nome);
      });
      palco.classList.remove("palco-ativo");
      palco.removeAttribute("data-qualidade");
      anterior = {};
    }
  };
};
