"use strict";

(() => {
  const campo = identificador => document.getElementById(identificador);
  const estoque = dadosDoEstoque.produtos;
  let registros = gerenciadorDeMiniAnuncios.carregar();

  function encontrarCadastro(referencia) {
    const encontrados = estoque.filter(item => item.id === referencia || item.sku === referencia);
    return encontrados.length === 1 ? encontrados[0] : null;
  }
  function verificarVinculo(referencia, parceiro) {
    if (!referencia) return { estado: "pendente", mensagem: "Fonte guardada para auditoria. Vincule uma referência interna para criar o anúncio." };
    const cadastro = encontrarCadastro(referencia);
    if (!cadastro) return { estado: "erro", mensagem: "Referência não encontrada ou SKU repetido. Use o ID interno exato." };
    if (identificarMarcaVerificada(cadastro.nome)?.identificador !== parceiro) return { estado: "erro", mensagem: "O produto encontrado não pertence ao parceiro selecionado." };
    return { estado: "ok", mensagem: `Vínculo confirmado: ${cadastro.nome} · SKU ${cadastro.sku || "não informado"}` };
  }
  function mensagem(texto, estado = "ok") {
    const destino = campo("mensagem-editor");
    destino.textContent = texto;
    destino.dataset.estado = estado;
  }
  function atualizarVinculo() {
    const resultado = verificarVinculo(campo("referencia-anuncio").value.trim(), campo("parceiro-anuncio").value);
    campo("produto-vinculado").textContent = resultado.mensagem;
    campo("produto-vinculado").dataset.estado = resultado.estado;
    return resultado;
  }
  function limparFormulario() {
    campo("formulario-anuncio").reset();
    campo("identificador-anuncio").value = "";
    campo("prioridade-anuncio").value = "3";
    campo("valor-prioridade").textContent = "3 / 5";
    campo("titulo-editor").textContent = "Nova fonte e anúncio";
    atualizarVinculo();
    mensagem("");
  }
  function criarElemento(tag, classe, texto) {
    const elemento = document.createElement(tag);
    if (classe) elemento.className = classe;
    if (texto !== undefined) elemento.textContent = texto;
    return elemento;
  }
  campo("parceiros-sugeridos").replaceChildren(...marcasVerificadas.map(marca => {
    const opcao = document.createElement("option"); opcao.value = marca.identificador; opcao.label = marca.nome; return opcao;
  }));
  function salvarNoNavegador() {
    try { registros = gerenciadorDeMiniAnuncios.salvar(registros); return true; }
    catch { mensagem("Este navegador não permitiu salvar localmente. Exporte o arquivo para conservar as alterações.", "erro"); return false; }
  }
  function renderizarLista() {
    campo("total-anuncios").textContent = `(${registros.length})`;
    const lista = registros.map(registro => {
      const vinculo = verificarVinculo(registro.referenciaInterna, registro.parceiro);
      const status = !registro.ativo ? "pausado" : vinculo.estado;
      const cartao = criarElemento("article", "registro");
      const conteudo = criarElemento("div");
      const selo = criarElemento("span", "selo", status === "ok" ? "Ativo no catálogo" : status === "pausado" ? "Pausado" : status === "pendente" ? "Fonte pendente" : "Revisar vínculo");
      selo.dataset.estado = status;
      conteudo.append(selo, criarElemento("strong", "", registro.titulo || "Fonte sem título"), criarElemento("p", "", registro.chamada || vinculo.mensagem), criarElemento("small", "", `${registro.parceiro} · prioridade ${registro.prioridade}/5 · ${registro.referenciaInterna || "sem referência"} · ${registro.fonteUrl}`));
      const acoes = criarElemento("div", "acoes-registro");
      const editar = criarElemento("button", "acao-lista", "Editar"); editar.type = "button";
      editar.addEventListener("click", () => editarRegistro(registro.identificador));
      const excluir = criarElemento("button", "acao-lista excluir", "Excluir"); excluir.type = "button";
      excluir.addEventListener("click", () => {
        registros = registros.filter(item => item.identificador !== registro.identificador);
        salvarNoNavegador(); renderizarLista();
        if (campo("identificador-anuncio").value === registro.identificador) limparFormulario();
      });
      acoes.append(editar, excluir); cartao.append(conteudo, acoes);
      return cartao;
    });
    campo("lista-anuncios").replaceChildren(...lista);
    if (!lista.length) campo("lista-anuncios").append(criarElemento("p", "ajuda", "Nenhuma fonte cadastrada."));
  }
  function editarRegistro(identificador) {
    const registro = registros.find(item => item.identificador === identificador);
    if (!registro) return;
    campo("identificador-anuncio").value = registro.identificador;
    campo("parceiro-anuncio").value = registro.parceiro;
    campo("fonte-anuncio").value = registro.fonteUrl;
    campo("referencia-anuncio").value = registro.referenciaInterna;
    campo("titulo-anuncio").value = registro.titulo;
    campo("chamada-anuncio").value = registro.chamada;
    campo("prioridade-anuncio").value = String(registro.prioridade);
    campo("valor-prioridade").textContent = `${registro.prioridade} / 5`;
    campo("ativo-anuncio").checked = registro.ativo;
    campo("titulo-editor").textContent = "Editar fonte e anúncio";
    atualizarVinculo(); mensagem("");
    campo("formulario-anuncio").scrollIntoView({ behavior: "smooth", block: "start" });
    campo("fonte-anuncio").focus({ preventScroll: true });
  }
  function gerarIdentificador() {
    return `anuncio-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  }
  function salvarFormulario(evento) {
    evento.preventDefault();
    const fonteUrl = gerenciadorDeMiniAnuncios.fonteSegura(campo("fonte-anuncio").value);
    if (!fonteUrl) { mensagem("Informe uma fonte HTTPS válida, sem usuário ou senha na URL.", "erro"); campo("fonte-anuncio").focus(); return; }
    const referenciaInterna = campo("referencia-anuncio").value.trim();
    const vinculo = atualizarVinculo();
    if (vinculo.estado === "erro") { mensagem(vinculo.mensagem, "erro"); campo("referencia-anuncio").focus(); return; }
    const identificador = campo("identificador-anuncio").value || gerarIdentificador();
    const registro = gerenciadorDeMiniAnuncios.normalizarCadastro({
      identificador, parceiro: campo("parceiro-anuncio").value, fonteUrl, referenciaInterna,
      titulo: campo("titulo-anuncio").value, chamada: campo("chamada-anuncio").value,
      prioridade: Number(campo("prioridade-anuncio").value), ativo: campo("ativo-anuncio").checked
    });
    if (!registro) { mensagem("Não foi possível validar o cadastro.", "erro"); return; }
    const indice = registros.findIndex(item => item.identificador === identificador);
    if (indice >= 0) registros[indice] = registro;
    else registros.push(registro);
    const persistiu = salvarNoNavegador();
    renderizarLista(); limparFormulario();
    mensagem(persistiu ? "Cadastro salvo. Abra o catálogo neste navegador para conferir; exporte para publicar." : "Cadastro mantido nesta sessão. Exporte o arquivo antes de sair.", persistiu ? "ok" : "erro");
  }
  function exportar() {
    const lista = gerenciadorDeMiniAnuncios.validarLista(registros);
    if (!lista) { mensagem("Corrija os cadastros inválidos antes de exportar.", "erro"); return; }
    const codigo = `"use strict";\n\n// Fontes externas servem apenas à auditoria interna. Não exibir seus endereços ao cliente.\nconst cadastroDeMiniAnuncios = ${JSON.stringify({ versao: 1, anuncios: lista }, null, 2)};\n`;
    const endereco = URL.createObjectURL(new Blob([codigo], { type: "text/javascript;charset=utf-8" }));
    const link = document.createElement("a"); link.href = endereco; link.download = "cadastro-anuncios-parceiros.js";
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(endereco), 1000);
    mensagem("Arquivo exportado. Substitua js/cadastro-anuncios-parceiros.js na hospedagem para publicar.");
  }
  campo("formulario-anuncio").addEventListener("submit", salvarFormulario);
  campo("limpar-formulario").addEventListener("click", limparFormulario);
  campo("referencia-anuncio").addEventListener("input", atualizarVinculo);
  campo("parceiro-anuncio").addEventListener("change", atualizarVinculo);
  campo("prioridade-anuncio").addEventListener("input", evento => { campo("valor-prioridade").textContent = `${evento.target.value} / 5`; });
  campo("exportar-anuncios").addEventListener("click", exportar);
  campo("restaurar-anuncios").addEventListener("click", () => {
    try { gerenciadorDeMiniAnuncios.limparRascunho(); } catch { /* O arquivo estático ainda pode ser lido. */ }
    registros = gerenciadorDeMiniAnuncios.validarLista(cadastroDeMiniAnuncios.anuncios) || [];
    renderizarLista(); limparFormulario(); mensagem("Arquivo publicado restaurado neste navegador.");
  });
  atualizarVinculo(); renderizarLista();
})();
