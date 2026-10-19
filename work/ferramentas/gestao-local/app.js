"use strict";

const $ = selector => document.querySelector(selector);
const state = {
  products: [], partners: [], shortages: [], suggestions: [], invoices: [],
  selectedProduct: null, selectedInvoice: null, view: "products",
  drafts: new Map()
};
const editFields = ["edit_name", "edit_sku", "edit_gtin", "edit_category", "edit_subcategory", "edit_partner_id"];
const esc = value => String(value ?? "").replace(/[&<>"']/g, character => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[character]));
const numberText = value => Number(value || 0).toLocaleString("pt-BR", {maximumFractionDigits: 3});
const shortDate = value => value ? new Date(value).toLocaleDateString("pt-BR") : "—";

function status(message, kind = "") {
  const element = $("#status-message");
  element.textContent = message;
  element.className = kind;
}
async function api(path, options = {}) {
  const response = await fetch(path, options);
  let data;
  try { data = await response.json(); } catch { throw Error("Resposta inválida do serviço local."); }
  if (!response.ok) throw Error(data.error || "Operação não concluída.");
  return data;
}
const send = (path, method, data) => api(path, {
  method, headers: {"Content-Type": "application/json"}, body: JSON.stringify(data)
});
function errorMessage(error) { status(error.message || "Operação não concluída.", "error"); }
function productById(id) { return state.products.find(product => String(product.id) === String(id)); }
function partnerById(id) { return state.partners.find(partner => String(partner.id) === String(id)); }
function partnerName(id) { return partnerById(id)?.name || "—"; }
function productName(product) { return product.edit_name || product.catalog_name || product.original_name || "Sem nome"; }
function productCategory(product) { return product.edit_category || product.category || "—"; }
function productSubcategory(product) { return product.edit_subcategory || product.subcategory || "—"; }
function productPartner(product) { return product.edit_partner_id || product.partner_id || ""; }
function proposed(product) { return editFields.some(field => Boolean(product[field])); }
function draftFor(product) {
  if (!state.drafts.has(String(product.id))) {
    state.drafts.set(String(product.id), Object.fromEntries(editFields.map(field => [field, product[field] || ""])));
  }
  return state.drafts.get(String(product.id));
}
function dirtyFields(product) {
  const draft = draftFor(product);
  return editFields.filter(field => draft[field] !== (product[field] || ""));
}
function option(value, label) { return '<option value="' + esc(value) + '">' + esc(label) + '</option>'; }

async function loadAll() {
  const [products, partners, shortages, suggestions, invoices] = await Promise.all([
    api("/api/products"), api("/api/partners"), api("/api/shortages"),
    api("/api/suggestions"), api("/api/invoices")
  ]);
  Object.assign(state, {products, partners, shortages, suggestions, invoices});
  if (!state.selectedProduct && products.length) state.selectedProduct = String(products[0].id);
  if (!state.selectedInvoice && invoices.length) state.selectedInvoice = String(invoices[0].id);
  renderAll();
  status(products.length + " produtos carregados do banco local.", "success");
}
async function refreshProducts() {
  const [products, shortages, suggestions] = await Promise.all([
    api("/api/products"), api("/api/shortages"), api("/api/suggestions")
  ]);
  Object.assign(state, {products, shortages, suggestions});
  renderCounts();
  renderFilters();
  renderProductRows();
  renderInspector();
  renderShortages();
}
function renderCounts() {
  $("#nav-products").textContent = state.products.length;
  $("#nav-shortages").textContent = state.suggestions.length;
  $("#nav-invoices").textContent = state.invoices.length;
  $("#nav-partners").textContent = state.partners.length;
  $("#shortage-count").textContent = state.shortages.length + " registros";
  $("#suggestion-count").textContent = state.suggestions.length + " itens";
  $("#history-count").textContent = state.shortages.length + " registros";
  $("#invoice-count").textContent = state.invoices.length + " notas";
  $("#partner-count").textContent = state.partners.length + " parceiros";
}
function renderFilters() {
  const categoryEl = $("#category-filter");
  const subcategoryEl = $("#subcategory-filter");
  const partnerEl = $("#partner-filter");
  const previous = [categoryEl.value, subcategoryEl.value, partnerEl.value];
  const categories = [...new Set(state.products.map(productCategory))].sort();
  categoryEl.innerHTML = option("", "Todas as categorias") + categories.map(value => option(value, value)).join("");
  categoryEl.value = previous[0];
  const subs = [...new Set(state.products.filter(product => !categoryEl.value || productCategory(product) === categoryEl.value).map(productSubcategory))].sort();
  subcategoryEl.innerHTML = option("", "Todas as subcategorias") + subs.map(value => option(value, value)).join("");
  subcategoryEl.value = previous[1];
  partnerEl.innerHTML = option("", "Todos os parceiros") + state.partners.map(partner => option(partner.id, partner.name)).join("");
  partnerEl.value = previous[2];
  $("#shortage-product").innerHTML = option("", "Selecione o produto") + state.products.map(product => option(product.id, productName(product) + " · " + (product.original_sku || "sem SKU"))).join("");
  $("#shortage-partner").innerHTML = option("", "Usar parceiro do produto") + state.partners.map(partner => option(partner.id, partner.name)).join("");
  let options = $("#product-options");
  if (options) options.innerHTML = state.products.map(product => '<option value="' + esc(product.id) + '" label="' + esc(productName(product) + " · " + (product.original_sku || "sem SKU")) + '"></option>').join("");
}
function filteredProducts() {
  const query = $("#search").value.trim().toLocaleLowerCase("pt-BR");
  const category = $("#category-filter").value;
  const subcategory = $("#subcategory-filter").value;
  const partner = $("#partner-filter").value;
  const condition = $("#product-status-filter").value;
  return state.products.filter(product => {
    if (query && ![product.id, product.original_sku, product.edit_sku, product.edit_gtin, product.original_name, product.catalog_name, product.edit_name].some(value => String(value || "").toLocaleLowerCase("pt-BR").includes(query))) return false;
    if (category && productCategory(product) !== category) return false;
    if (subcategory && productSubcategory(product) !== subcategory) return false;
    if (partner && String(productPartner(product)) !== partner) return false;
    if (condition === "active" && (product.blocked || product.partner_blocked)) return false;
    if (condition === "blocked" && !product.blocked && !product.partner_blocked) return false;
    if (condition === "changed" && !proposed(product) && !dirtyFields(product).length) return false;
    return true;
  });
}
function renderProductRows() {
  const filtered = filteredProducts();
  if (!filtered.some(product => String(product.id) === state.selectedProduct)) {
    state.selectedProduct = filtered.length ? String(filtered[0].id) : null;
    renderInspector();
  }
  $("#product-count").textContent = filtered.length + " / " + state.products.length;
  $("#product-list").innerHTML = filtered.map(product => {
    const blocked = product.blocked || product.partner_blocked;
    const changed = proposed(product) || dirtyFields(product).length;
    const tag = blocked ? '<span class="state-tag blocked">BLOQUEADO</span>' : changed ? '<span class="state-tag changed">PROPOSTA</span>' : '<span class="state-tag">ATIVO</span>';
    return '<tr data-product="' + esc(product.id) + '" tabindex="' + (String(product.id) === state.selectedProduct ? "0" : "-1") + '" class="' + (String(product.id) === state.selectedProduct ? "selected" : "") + '">' +
      '<td class="mono">' + esc(product.original_sku || "—") + '</td>' +
      '<td><span class="cell-name" title="' + esc(productName(product)) + '">' + esc(productName(product)) + '</span></td>' +
      '<td><span class="cell-category" title="' + esc(productCategory(product) + " / " + productSubcategory(product)) + '">' + esc(productCategory(product)) + ' / ' + esc(productSubcategory(product)) + '</span></td>' +
      '<td>' + esc(partnerName(productPartner(product))) + '</td><td>' + tag + '</td></tr>';
  }).join("") || '<tr><td class="empty-row" colspan="5">Nenhum produto encontrado.</td></tr>';
}
function compareRow(label, original, field, value, placeholder = "") {
  const product = productById(state.selectedProduct);
  const dirty = product && value !== (product[field] || "");
  return '<div class="compare-row' + (dirty ? " dirty" : "") + '" data-compare="' + field + '">' +
    '<div class="compare-label">' + esc(label) + '</div><div class="compare-original">' + esc(original || "—") + '</div>' +
    '<input data-edit="' + field + '" aria-label="Proposta de ' + esc(label) + '" maxlength="300" value="' + esc(value) + '" placeholder="' + esc(placeholder) + '"></div>';
}
function renderInspector() {
  const product = productById(state.selectedProduct);
  if (!product) { $("#product-detail").innerHTML = '<div class="inspector-empty">Selecione um produto.</div>'; return; }
  const draft = draftFor(product);
  const dirty = dirtyFields(product);
  const partnerOptions = option("", "Usar parceiro atual") + state.partners.map(partner => option(partner.id, partner.name + (partner.blocked ? " · bloqueado" : ""))).join("");
  $("#product-detail").innerHTML =
    '<div class="inspector-head"><div class="inspector-kicker">PRODUTO / ' + esc(product.id) + '</div><h2 class="inspector-title">' + esc(productName(product)) + '</h2><div class="inspector-sub">SKU ' + esc(product.original_sku || "—") + ' · ' + esc(productCategory(product)) + '</div></div>' +
    '<div class="compare-head"><span>CAMPO</span><span>ATUAL / CATÁLOGO</span><span>PROPOSTA LOCAL</span></div>' +
    '<form id="edit-form">' +
    compareRow("Nome", product.catalog_name || product.original_name, "edit_name", draft.edit_name, "Manter atual") +
    compareRow("SKU", product.original_sku, "edit_sku", draft.edit_sku, "Manter atual") +
    compareRow("GTIN", "—", "edit_gtin", draft.edit_gtin, "Informar GTIN") +
    compareRow("Categoria", product.category, "edit_category", draft.edit_category, "Manter atual") +
    compareRow("Subcategoria", product.subcategory, "edit_subcategory", draft.edit_subcategory, "Manter atual") +
    '<div class="compare-row' + (dirty.includes("edit_partner_id") ? " dirty" : "") + '" data-compare="edit_partner_id"><div class="compare-label">Parceiro</div><div class="compare-original">' + esc(partnerName(product.partner_id)) + '</div><select data-edit="edit_partner_id" aria-label="Proposta de parceiro">' + partnerOptions + '</select></div>' +
    '<div class="inspector-actions"><button class="primary-button" id="save-product" type="submit"' + (dirty.length ? "" : " disabled") + '>Salvar proposta</button><button class="quiet-button" id="reset-draft" type="button"' + (dirty.length ? "" : " disabled") + '>Desfazer</button><span class="draft-note" id="draft-note">' + (dirty.length ? dirty.length + " campo(s) pendente(s)" : "") + '</span><button class="table-button danger" id="toggle-product" type="button">' + (product.blocked ? "Reativar" : "Bloquear") + '</button></div>' +
    '</form><div class="inspector-meta"><h3>IMAGEM LOCAL</h3><div class="image-control">' +
    (product.image_path ? '<img src="/api/products/' + encodeURIComponent(product.id) + '/image?v=' + encodeURIComponent(product.updated_at || "") + '" alt="Imagem local do produto">' : '<span class="muted">Sem imagem</span>') +
    '<label class="file-button">Adicionar imagem<input id="image-file" type="file" accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"></label></div></div>';
  $('[data-edit="edit_partner_id"]').value = draft.edit_partner_id;
  $("#product-detail").scrollTop = 0;
}
function updateDraftUi(product) {
  const dirty = dirtyFields(product);
  editFields.forEach(field => {
    const row = $('[data-compare="' + field + '"]');
    if (row) row.classList.toggle("dirty", dirty.includes(field));
  });
  $("#save-product").disabled = dirty.length === 0;
  $("#reset-draft").disabled = dirty.length === 0;
  $("#draft-note").textContent = dirty.length ? dirty.length + " campo(s) pendente(s)" : "";
  const row = document.querySelector('[data-product="' + CSS.escape(String(product.id)) + '"]');
  if (row && dirty.length) row.querySelector(".state-tag").textContent = "PROPOSTA";
}
function selectProduct(id, focus = false) {
  state.selectedProduct = String(id);
  document.querySelectorAll("[data-product]").forEach(row => {
    const selected = row.dataset.product === state.selectedProduct;
    row.classList.toggle("selected", selected);
    row.tabIndex = selected ? 0 : -1;
    if (selected && focus) row.focus();
  });
  renderInspector();
  if (window.matchMedia("(max-width: 760px)").matches) {
    $("#product-detail").scrollIntoView({block: "start", behavior: "smooth"});
  }
}
function renderShortages() {
  $("#suggestions").innerHTML = state.suggestions.map(suggestion =>
    '<tr><td>' + esc(suggestion.product_name) + '</td><td class="mono">' + esc(suggestion.original_sku || "—") + '</td><td>' + esc(suggestion.supplier_name || "—") + '</td><td>' + esc(suggestion.partner_name) + '</td><td class="mono">' + numberText(suggestion.pending) + '</td><td>' + esc(suggestion.note || "—") + '</td>' +
    '<td><div class="table-actions"><button class="table-button danger" data-shortage="' + suggestion.id + '" data-status="forgotten">Esquecer</button><button class="table-button" data-shortage="' + suggestion.id + '" data-status="resolved">Resolvida</button></div></td></tr>'
  ).join("") || '<tr><td colspan="7" class="empty-row">Nenhuma sugestão ativa.</td></tr>';
  $("#shortage-list").innerHTML = state.shortages.map(shortage =>
    '<tr><td>' + esc(shortage.product_name) + '</td><td>' + esc(shortage.supplier_name || "—") + '</td><td class="mono">' + numberText(shortage.requested) + '</td><td class="mono">' + numberText(shortage.received) + '</td><td class="mono">' + numberText(shortage.pending) + '</td><td><span class="state-tag ' + (shortage.status === "active" ? "" : "blocked") + '">' + esc(shortage.status === "active" ? "ATIVA" : shortage.status === "forgotten" ? "ESQUECIDA" : "RESOLVIDA") + '</span></td><td class="mono">' + shortDate(shortage.created_at) + '</td><td>' +
    (shortage.status === "active" ? "—" : '<button class="table-button" data-shortage="' + shortage.id + '" data-status="active">Reativar</button>') + '</td></tr>'
  ).join("") || '<tr><td colspan="8" class="empty-row">Nenhuma falta registrada.</td></tr>';
}
function renderInvoices() {
  $("#invoice-list").innerHTML = state.invoices.map(invoice =>
    '<button class="invoice-list-item' + (String(invoice.id) === state.selectedInvoice ? " selected" : "") + '" data-invoice="' + invoice.id + '" type="button"><strong>NF-e ' + esc(invoice.invoice_key || "#" + invoice.id) + '</strong><span>' + esc(invoice.supplier || "Fornecedor não identificado") + ' · ' + invoice.items.length + ' itens</span><span>' + shortDate(invoice.imported_at) + '</span></button>'
  ).join("") || '<div class="inspector-empty">Importe um XML para iniciar a conferência.</div>';
  renderInvoiceDetail();
}
function renderInvoiceDetail() {
  const invoice = state.invoices.find(item => String(item.id) === state.selectedInvoice);
  if (!invoice) { $("#invoice-detail").innerHTML = '<div class="inspector-empty">Selecione uma nota.</div>'; return; }
  $("#invoice-detail").innerHTML =
    '<div class="invoice-detail-head"><div><strong>NF-e ' + esc(invoice.invoice_key || "#" + invoice.id) + '</strong><small>' + esc(invoice.supplier || "Fornecedor não identificado") + ' · ' + invoice.items.length + ' itens · importada ' + shortDate(invoice.imported_at) + '</small></div><div class="invoice-actions">' +
    (invoice.pdf_path ? '<a href="/api/invoices/' + invoice.id + '/pdf" target="_blank" rel="noopener">Abrir PDF ↗</a>' : "") +
    '<label class="file-button">' + (invoice.pdf_path ? "Trocar PDF" : "Anexar PDF") + '<input data-pdf="' + invoice.id + '" type="file" accept=".pdf,application/pdf"></label></div></div>' +
    '<div class="scroll-table" style="max-height:none"><table class="data-table"><thead><tr><th>ITEM DA NOTA</th><th>CÓDIGO / GTIN</th><th>NOTA</th><th>CONTADO</th><th>DIF.</th><th>ID PRODUTO</th><th>AÇÃO</th></tr></thead><tbody>' +
    invoice.items.map(item => {
      const delta = item.counted_qty === null ? "—" : numberText(Number(item.counted_qty) - Number(item.invoice_qty));
      const deltaClass = item.counted_qty === null ? "" : Number(item.counted_qty) === Number(item.invoice_qty) ? " match" : " mismatch";
      return '<tr data-item-row="' + item.id + '" class="' + (item.confirmed ? "confirmed" : "") + '"><td class="description">' + esc(item.description) + '<small>' + esc(item.unit || "") + '</small></td><td class="mono">' + esc(item.supplier_code || "—") + '<small>' + esc(item.gtin || "—") + '</small></td><td class="mono">' + numberText(item.invoice_qty) + '</td><td><input data-count="' + item.id + '" type="number" min="0" step="any" value="' + esc(item.counted_qty ?? "") + '" aria-label="Quantidade contada"></td><td class="delta' + deltaClass + '" data-delta="' + item.id + '">' + delta + '</td><td><input data-link="' + item.id + '" list="product-options" value="' + esc(item.product_id || "") + '" placeholder="ID / buscar" aria-label="ID do produto local"></td><td><button class="table-button" data-save-item="' + item.id + '">Salvar</button></td></tr>';
    }).join("") + '</tbody></table></div>';
}
function renderPartners() {
  const counts = new Map();
  state.products.forEach(product => {
    const key = String(productPartner(product));
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  $("#partner-list").innerHTML = state.partners.map(partner =>
    '<tr><td>' + esc(partner.name) + '</td><td class="mono">' + (counts.get(String(partner.id)) || 0) + '</td><td><span class="state-tag ' + (partner.blocked ? "blocked" : "") + '">' + (partner.blocked ? "BLOQUEADO" : "ATIVO") + '</span></td><td><button class="table-button ' + (partner.blocked ? "" : "danger") + '" data-partner="' + esc(partner.id) + '" data-block="' + (partner.blocked ? 0 : 1) + '">' + (partner.blocked ? "Reativar" : "Bloquear") + '</button></td></tr>'
  ).join("") || '<tr><td colspan="4" class="empty-row">Nenhum parceiro cadastrado.</td></tr>';
}
function renderAll() {
  renderCounts();
  renderFilters();
  renderProductRows();
  renderInspector();
  renderShortages();
  renderInvoices();
  renderPartners();
}
function setView(view) {
  state.view = view;
  document.querySelectorAll("[data-view]").forEach(button => button.classList.toggle("active", button.dataset.view === view));
  document.querySelectorAll(".view").forEach(section => {
    section.hidden = section.id !== "view-" + view;
    section.classList.toggle("active", !section.hidden);
  });
}

document.addEventListener("click", async event => {
  const viewButton = event.target.closest("[data-view]");
  if (viewButton) { setView(viewButton.dataset.view); return; }
  const productRow = event.target.closest("[data-product]");
  if (productRow) { selectProduct(productRow.dataset.product); return; }
  const invoiceButton = event.target.closest("[data-invoice]");
  if (invoiceButton) { state.selectedInvoice = invoiceButton.dataset.invoice; renderInvoices(); return; }
  if (event.target.closest("#clear-filters")) {
    $("#search").value = "";
    ["#category-filter", "#subcategory-filter", "#partner-filter", "#product-status-filter"].forEach(selector => $(selector).value = "");
    state.selectedProduct = state.products.length ? String(state.products[0].id) : null;
    renderFilters(); renderProductRows(); renderInspector(); return;
  }
  if (event.target.closest("#reset-draft")) {
    state.drafts.delete(state.selectedProduct);
    renderInspector(); renderProductRows();
    status("Alterações não salvas descartadas."); return;
  }
  if (event.target.closest("#toggle-product")) {
    const product = productById(state.selectedProduct);
    try {
      await send("/api/products/" + encodeURIComponent(product.id), "PATCH", {blocked: !product.blocked});
      await refreshProducts();
      status(product.blocked ? "Produto reativado." : "Produto bloqueado nas sugestões.", "success");
    } catch (error) { errorMessage(error); }
    return;
  }
  const partnerButton = event.target.closest("[data-partner]");
  if (partnerButton) {
    try {
      await send("/api/partners/" + encodeURIComponent(partnerButton.dataset.partner), "PATCH", {blocked: Number(partnerButton.dataset.block)});
      state.partners = await api("/api/partners");
      await refreshProducts();
      renderPartners();
      status("Estado do parceiro atualizado.", "success");
    } catch (error) { errorMessage(error); }
    return;
  }
  const shortageButton = event.target.closest("[data-shortage]");
  if (shortageButton) {
    try {
      await send("/api/shortages/" + shortageButton.dataset.shortage, "PATCH", {status: shortageButton.dataset.status});
      [state.shortages, state.suggestions] = await Promise.all([api("/api/shortages"), api("/api/suggestions")]);
      renderCounts(); renderShortages();
      status("Pendência atualizada.", "success");
    } catch (error) { errorMessage(error); }
    return;
  }
  const saveItem = event.target.closest("[data-save-item]");
  if (saveItem) {
    const id = saveItem.dataset.saveItem;
    const row = saveItem.closest("[data-item-row]");
    const counted = row.querySelector("[data-count]").value;
    const product = row.querySelector("[data-link]").value.trim();
    try {
      await send("/api/invoice-items/" + id, "PATCH", {counted_qty: counted, product_id: product, confirmed: Boolean(product && counted !== "")});
      state.invoices = await api("/api/invoices");
      renderInvoices();
      status("Contagem salva no banco local.", "success");
    } catch (error) { errorMessage(error); }
  }
});

document.addEventListener("input", event => {
  const edit = event.target.closest("[data-edit]");
  if (edit) {
    const product = productById(state.selectedProduct);
    draftFor(product)[edit.dataset.edit] = edit.value;
    updateDraftUi(product);
    return;
  }
  const counted = event.target.closest("[data-count]");
  if (counted) {
    const invoice = state.invoices.find(item => String(item.id) === state.selectedInvoice);
    const item = invoice?.items.find(value => String(value.id) === counted.dataset.count);
    if (!item) return;
    const delta = counted.closest("tr").querySelector("[data-delta]");
    if (counted.value === "") { delta.textContent = "—"; delta.className = "delta"; }
    else {
      const difference = Number(counted.value) - Number(item.invoice_qty);
      delta.textContent = numberText(difference);
      delta.className = "delta " + (difference === 0 ? "match" : "mismatch");
    }
    counted.closest("tr").classList.add("changed");
  }
});
document.addEventListener("change", event => {
  if (event.target.matches("[data-edit]")) {
    const product = productById(state.selectedProduct);
    draftFor(product)[event.target.dataset.edit] = event.target.value;
    updateDraftUi(product);
  }
});
document.addEventListener("submit", async event => {
  if (event.target.id === "edit-form") {
    event.preventDefault();
    const product = productById(state.selectedProduct);
    const fields = dirtyFields(product);
    if (!fields.length) return;
    const changes = Object.fromEntries(fields.map(field => [field, draftFor(product)[field]]));
    try {
      await send("/api/products/" + encodeURIComponent(product.id), "PATCH", changes);
      state.drafts.delete(String(product.id));
      await refreshProducts();
      status("Proposta salva somente no banco local.", "success");
    } catch (error) { errorMessage(error); }
  }
  if (event.target.id === "shortage-form") {
    event.preventDefault();
    try {
      await send("/api/shortages", "POST", {
        product_id: $("#shortage-product").value, supplier_name: $("#shortage-supplier").value,
        partner_id: $("#shortage-partner").value, requested: $("#shortage-requested").value,
        received: $("#shortage-received").value, note: $("#shortage-note").value
      });
      event.target.reset();
      [state.shortages, state.suggestions] = await Promise.all([api("/api/shortages"), api("/api/suggestions")]);
      renderCounts(); renderShortages();
      status("Falta registrada para o próximo pedido.", "success");
    } catch (error) { errorMessage(error); }
  }
  if (event.target.id === "partner-form") {
    event.preventDefault();
    try {
      await send("/api/partners", "POST", {name: $("#partner-name").value});
      event.target.reset();
      state.partners = await api("/api/partners");
      await refreshProducts();
      renderPartners();
      status("Parceiro adicionado ao banco local.", "success");
    } catch (error) { errorMessage(error); }
  }
});
$("#search").addEventListener("input", renderProductRows);
["#subcategory-filter", "#partner-filter", "#product-status-filter"].forEach(selector => $(selector).addEventListener("change", renderProductRows));
$("#category-filter").addEventListener("change", () => { $("#subcategory-filter").value = ""; renderFilters(); renderProductRows(); });
$("#product-list").addEventListener("keydown", event => {
  if (!["ArrowDown", "ArrowUp"].includes(event.key)) return;
  const rows = [...document.querySelectorAll("[data-product]")];
  const current = rows.findIndex(row => row.dataset.product === state.selectedProduct);
  const next = rows[Math.max(0, Math.min(rows.length - 1, current + (event.key === "ArrowDown" ? 1 : -1)))];
  if (next) { event.preventDefault(); selectProduct(next.dataset.product, true); next.scrollIntoView({block: "nearest"}); }
});
$("#xml-file").addEventListener("change", async event => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const response = await api("/api/import/xml", {method: "POST", headers: {"Content-Type": "application/xml"}, body: file});
    state.invoices = await api("/api/invoices");
    state.selectedInvoice = String(response.id);
    renderCounts(); renderInvoices();
    status("XML importado: " + response.items + " itens para conferência.", "success");
  } catch (error) { errorMessage(error); }
  finally { event.target.value = ""; }
});
document.addEventListener("change", async event => {
  const pdfInput = event.target.closest("[data-pdf]");
  if (pdfInput?.files[0]) {
    try {
      await api("/api/import/pdf?invoiceId=" + pdfInput.dataset.pdf, {method: "POST", headers: {"Content-Type": "application/pdf"}, body: pdfInput.files[0]});
      state.invoices = await api("/api/invoices");
      renderInvoices(); status("PDF anexado à nota.", "success");
    } catch (error) { errorMessage(error); }
    return;
  }
  if (event.target.id === "image-file" && event.target.files[0]) {
    const id = state.selectedProduct;
    try {
      await api("/api/products/" + encodeURIComponent(id) + "/image", {method: "POST", body: event.target.files[0]});
      await refreshProducts();
      status("Imagem guardada localmente.", "success");
    } catch (error) { errorMessage(error); }
  }
});
loadAll().catch(errorMessage);
