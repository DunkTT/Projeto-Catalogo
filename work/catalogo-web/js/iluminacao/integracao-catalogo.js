"use strict";
Iluminacao.integrarCatalogo = function ({ recipiente, midia, slider, valor, controle, qualidade, configuracao = {} }) {
  const motor = Iluminacao.criarMotor({ renderizador: Iluminacao.criarRenderizadorCSS(recipiente) });
  let permitido = false, aberto = false;
  motor.definirQualidade(configuracao.qualidade || "padrao");
  if (configuracao.ativo === false) motor.ativar(false);
  const desobservar = motor.observar(atual => {
    if (slider.value !== String(atual.brilho)) slider.value = String(atual.brilho);
    valor.value = atual.brilho + "%";
    slider.setAttribute("aria-valuetext", atual.brilho + "%");
    slider.disabled = !atual.ativo;
    qualidade.value = atual.ativo ? atual.qualidade : "desligado";
  });
  const aoBrilho = () => motor.atualizar({ brilho: Number(slider.value) });
  const aoQualidade = () => motor.definirQualidade(qualidade.value);
  const aoVisibilidade = () => motor.suspender(!aberto || !permitido || document.hidden);
  slider.addEventListener("input", aoBrilho);
  qualidade.addEventListener("change", aoQualidade);
  document.addEventListener("visibilitychange", aoVisibilidade);
  return {
    motor,
    sincronizar(atual, produto) {
      aberto = Boolean(atual.produtoAberto); permitido = Boolean(produto?.permiteSimulacao);
      controle.hidden = !permitido;
      qualidade.parentElement.hidden = !permitido;
      if (midia.firstElementChild) midia.firstElementChild.dataset.iluminado = String(permitido);
      if (permitido) motor.atualizar({ tom: atual.corDaPrevia });
      aoVisibilidade();
    },
    fechar() { aberto = false; motor.suspender(); },
    destruir() {
      slider.removeEventListener("input", aoBrilho); qualidade.removeEventListener("change", aoQualidade);
      document.removeEventListener("visibilitychange", aoVisibilidade); desobservar(); motor.destruir();
    }
  };
};
