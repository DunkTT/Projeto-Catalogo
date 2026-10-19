"use strict";
// Liga o palco, a biblioteca e o editor JSON ao motor. Sem pop-ups.
(() => {
  const movimentoReduzido = matchMedia("(prefers-reduced-motion: reduce)");
  const palco = document.getElementById("palco");
  const editor = document.getElementById("editor-json");
  const status = document.getElementById("status");
  const avisos = document.getElementById("avisos");
  const listaEfeitos = document.getElementById("lista-efeitos");
  const listaRascunhos = document.getElementById("lista-rascunhos");
  const leituraQuadro = document.getElementById("leitura-quadro");
  const motor = LaboratorioLuz.criarMotor({ renderizador: LaboratorioLuz.criarRenderizadorCSS(palco) });
  let efeitoAtual = null;

  function escreverStatus(texto) { status.textContent = texto; }
  function escreverAvisos(lista) {
    avisos.replaceChildren();
    lista.forEach(item => {
      const linha = document.createElement("p");
      linha.textContent = item;
      avisos.append(linha);
    });
  }
  function preencherEditor(efeito) {
    editor.value = JSON.stringify(efeito, null, 2);
  }
  function aplicarValidado(resultado, origem) {
    if (!resultado.ok) {
      escreverAvisos(resultado.erros.concat(resultado.avisos));
      escreverStatus("Efeito recusado.");
      return;
    }
    efeitoAtual = resultado.efeito;
    motor.carregar(efeitoAtual);
    preencherEditor(efeitoAtual);
    escreverAvisos(resultado.avisos);
    escreverStatus(origem + ": " + efeitoAtual.nome);
    motor.reproduzir();
  }

  function botaoDaLista(efeito, grupo) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.textContent = efeito.nome;
    botao.dataset.id = efeito.id;
    botao.addEventListener("click", () => aplicarValidado({ ok: true, avisos: [], efeito }, grupo));
    return botao;
  }
  function pintarBiblioteca() {
    listaEfeitos.replaceChildren();
    LaboratorioLuz.efeitosExemplo.forEach(efeito => listaEfeitos.append(botaoDaLista(efeito, "Exemplo")));
    listaRascunhos.replaceChildren();
    LaboratorioLuz.lerRascunhos().forEach(efeito => listaRascunhos.append(botaoDaLista(efeito, "Rascunho")));
  }

  function aplicarEditor() {
    aplicarValidado(LaboratorioLuz.lerJson(editor.value), "Editor");
  }
  function gerarClipe() {
    const rascunho = LaboratorioLuz.comporEfeito({
      preset: document.getElementById("preset-base").value,
      padrao: document.getElementById("padrao-base").value,
      duracaoMs: Number(document.getElementById("duracao-ms").value),
      laco: document.getElementById("laco").checked
    });
    rascunho.id = "rascunho-" + Date.now().toString(36);
    rascunho.nome = rascunho.preset + " · " + rascunho.padrao;
    aplicarValidado(LaboratorioLuz.validarEfeito(rascunho), "Mistura");
  }
  function guardar() {
    const resultado = LaboratorioLuz.lerJson(editor.value);
    if (!resultado.ok) { aplicarValidado(resultado, "Editor"); return; }
    const gravacao = LaboratorioLuz.guardarRascunho(resultado.efeito);
    escreverStatus(gravacao.mensagem);
    pintarBiblioteca();
  }

  function preencherSelecoes() {
    const preset = document.getElementById("preset-base");
    const padrao = document.getElementById("padrao-base");
    Object.entries(LaboratorioLuz.presets).forEach(([id, item]) => {
      const opcao = document.createElement("option");
      opcao.value = id;
      opcao.textContent = item.nome;
      preset.append(opcao);
    });
    Object.entries(LaboratorioLuz.padroes).forEach(([id, item]) => {
      const opcao = document.createElement("option");
      opcao.value = id;
      opcao.textContent = item.nome;
      padrao.append(opcao);
    });
  }
  function aplicarTema(claro) {
    document.documentElement.dataset.tema = claro ? "claro" : "escuro";
    const interruptor = document.getElementById("alternar-tema");
    interruptor.setAttribute("aria-checked", String(claro));
  }

  motor.observar(estado => {
    const quadro = estado.snapshot;
    if (!quadro) { leituraQuadro.textContent = "—"; return; }
    leituraQuadro.textContent = Math.round(quadro.progresso * 100) + "% · " + Math.round(quadro.brilho) + " · " + quadro.cor;
    palco.dataset.reproduzindo = String(estado.reproduzindo);
  });
  motor.definirMovimentoReduzido(movimentoReduzido.matches);
  movimentoReduzido.addEventListener("change", () => motor.definirMovimentoReduzido(movimentoReduzido.matches));
  document.addEventListener("visibilitychange", () => motor.suspender(document.hidden));

  document.getElementById("reproduzir").addEventListener("click", () => motor.reproduzir());
  document.getElementById("pausar").addEventListener("click", () => motor.pausar());
  document.getElementById("aplicar-json").addEventListener("click", aplicarEditor);
  document.getElementById("gerar-clipe").addEventListener("click", gerarClipe);
  document.getElementById("guardar-rascunho").addEventListener("click", guardar);
  document.getElementById("arquivo-json").addEventListener("change", evento => {
    const arquivo = evento.target.files && evento.target.files[0];
    if (!arquivo) return;
    arquivo.text().then(texto => aplicarValidado(LaboratorioLuz.lerJson(texto), "Arquivo")).catch(erro => {
      escreverStatus("Falha ao ler arquivo.");
      console.error("Leitura de JSON falhou:", erro);
    });
  });
  document.querySelectorAll("[name='qualidade']").forEach(entrada => {
    entrada.addEventListener("change", () => { if (entrada.checked) motor.definirQualidade(entrada.value); });
  });
  document.getElementById("alternar-tema").addEventListener("click", () => {
    aplicarTema(document.documentElement.dataset.tema !== "claro");
  });

  preencherSelecoes();
  pintarBiblioteca();
  aplicarTema(false);
  if (LaboratorioLuz.efeitosExemplo[0]) aplicarValidado({ ok: true, avisos: [], efeito: LaboratorioLuz.efeitosExemplo[0] }, "Exemplo");
})();
