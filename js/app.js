/* ============================================================
   Expense & Budget Visualizer / Visualisasi Pengeluaran
   js/app.js — with EN/ID language toggle
   ============================================================ */
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// Translations
// ─────────────────────────────────────────────────────────────────────────────

const TRANSLATIONS = {
  id: {
    appTitle:              'Visualisasi Pengeluaran & Anggaran',
    totalBalance:          'Total Saldo',
    monthlyLimit:          'Batas Bulanan (Rp)',
    setLimitPlaceholder:   'Atur batas…',
    tabTransactions:       'Transaksi',
    tabMonthly:            'Ringkasan Bulanan',
    addTransaction:        'Tambah Transaksi',
    itemName:              'Nama Item',
    itemNamePlaceholder:   'mis. Makan siang, Tiket bus',
    amount:                'Jumlah (Rp)',
    category:              'Kategori',
    newCategory:           '+ Baru',
    closeCategoryManager:  '✕ Tutup',
    manageCategories:      'Kelola Kategori',
    categoryNamePlaceholder:'Nama kategori',
    pickColor:             'Pilih warna',
    add:                   'Tambah',
    sortBy:                'Urutkan:',
    sortTransactions:      'Urutkan transaksi',
    sortDate:              'Tanggal ↓',
    sortAmount:            'Jumlah',
    sortCategory:          'Kategori',
    spendingByCategory:    'Pengeluaran per Kategori',
    chartAriaLabel:        'Diagram lingkaran pengeluaran per kategori',
    noTransactions:        'Belum ada transaksi.',
    noChartData:           'Belum ada data pengeluaran.',
    noCustomCategories:    'Belum ada kategori khusus.',
    overLimit:             'Melebihi batas sebesar',
    remaining:             'tersisa',
    overLimitBadge:        '⚠ melebihi batas',
    deleteLabel:           'Hapus',
    removeLabel:           'Hapus',
    confirmDelete:         'Hapus',
    confirmDeleteSuffix:   '?',
    fallbackTx:            'transaksi ini',
    total:                 'Total',
    storageUnavailable:    'Penyimpanan lokal tidak tersedia. Data tidak akan disimpan.',
    saveError:             'Gagal menyimpan transaksi baru. Silakan coba lagi.',
    deleteError:           'Gagal menghapus transaksi. Silakan coba lagi.',
    categoryInUseError:    'Tidak dapat menghapus — masih digunakan oleh transaksi yang ada.',
    errNameRequired:       'Nama item wajib diisi.',
    errNameTooLong:        'Nama item maksimal 100 karakter.',
    errAmountRequired:     'Jumlah wajib diisi.',
    errAmountNaN:          'Jumlah harus berupa angka.',
    errAmountZero:         'Jumlah harus lebih dari nol.',
    errAmountMax:          'Jumlah tidak boleh melebihi Rp999.999.999.',
    errAmountDecimals:     'Jumlah maksimal 2 angka desimal.',
    errCategoryRequired:   'Silakan pilih kategori.',
    errCatNameRequired:    'Nama kategori wajib diisi.',
    errCatNameTooLong:     'Nama kategori maksimal 30 karakter.',
    errCatNameDuplicate:   'Kategori dengan nama ini sudah ada.',
    themeAriaLabel:        'Ganti tema',
    langToggleAriaLabel:   'Ganti ke Bahasa Inggris',
    langToggleFlag:        '🇮🇩',
    langName:              'ID',
    catFood:               'Makanan',
    catTransport:          'Transportasi',
    catFun:                'Hiburan',
    monthLocale:           'id-ID',
  },
  en: {
    appTitle:              'Expense & Budget Visualizer',
    totalBalance:          'Total Balance',
    monthlyLimit:          'Monthly Limit (Rp)',
    setLimitPlaceholder:   'Set limit…',
    tabTransactions:       'Transactions',
    tabMonthly:            'Monthly Summary',
    addTransaction:        'Add Transaction',
    itemName:              'Item Name',
    itemNamePlaceholder:   'e.g. Lunch, Bus ticket',
    amount:                'Amount (Rp)',
    category:              'Category',
    newCategory:           '+ New',
    closeCategoryManager:  '✕ Close',
    manageCategories:      'Manage Categories',
    categoryNamePlaceholder:'Category name',
    pickColor:             'Pick a colour',
    add:                   'Add',
    sortBy:                'Sort by:',
    sortTransactions:      'Sort transactions',
    sortDate:              'Date ↓',
    sortAmount:            'Amount',
    sortCategory:          'Category',
    spendingByCategory:    'Spending by Category',
    chartAriaLabel:        'Pie chart of spending by category',
    noTransactions:        'No transactions recorded.',
    noChartData:           'No spending data to display.',
    noCustomCategories:    'No custom categories yet.',
    overLimit:             'Over limit by',
    remaining:             'remaining',
    overLimitBadge:        '⚠ over limit',
    deleteLabel:           'Delete',
    removeLabel:           'Remove',
    confirmDelete:         'Delete',
    confirmDeleteSuffix:   '?',
    fallbackTx:            'this transaction',
    total:                 'Total',
    storageUnavailable:    'Local Storage is unavailable. Data will not be saved.',
    saveError:             'Could not save the new transaction. Please try again.',
    deleteError:           'Could not delete the transaction. Please try again.',
    categoryInUseError:    'Cannot remove — it is used by existing transactions.',
    errNameRequired:       'Item name is required.',
    errNameTooLong:        'Item name must be 100 characters or fewer.',
    errAmountRequired:     'Amount is required.',
    errAmountNaN:          'Amount must be a number.',
    errAmountZero:         'Amount must be greater than zero.',
    errAmountMax:          'Amount must not exceed Rp999,999,999.',
    errAmountDecimals:     'Amount may have at most 2 decimal places.',
    errCategoryRequired:   'Please select a category.',
    errCatNameRequired:    'Category name is required.',
    errCatNameTooLong:     'Category name must be 30 characters or fewer.',
    errCatNameDuplicate:   'A category with this name already exists.',
    themeAriaLabel:        'Toggle theme',
    langToggleAriaLabel:   'Switch to Indonesian',
    langToggleFlag:        '🇬🇧',
    langName:              'EN',
    catFood:               'Food',
    catTransport:          'Transport',
    catFun:                'Fun',
    monthLocale:           'en-US',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Language state
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY_LANG = 'expense_language';
let currentLang = 'id';

/** Return the translation string for key in the current language */
function t(key) {
  return (TRANSLATIONS[currentLang] || TRANSLATIONS.id)[key] || key;
}

// ─────────────────────────────────────────────────────────────────────────────
// Apply translations to static DOM elements
// ─────────────────────────────────────────────────────────────────────────────

function applyTranslations() {
  const lang = currentLang;

  // Update html lang attribute
  document.documentElement.setAttribute('lang', lang);

  // Stamp text content onto elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const val = t(key);
    // Don't clobber child elements — only update if purely a text node container
    if (el.children.length === 0) el.textContent = val;
  });

  // Stamp placeholder attributes
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });

  // Stamp title attributes
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.title = t(el.dataset.i18nTitle);
  });

  // Stamp aria-label attributes
  document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
    el.setAttribute('aria-label', t(el.dataset.i18nAriaLabel));
  });

  // Update page title
  document.title = t('appTitle');

  // Update lang toggle button
  const langBtn = document.getElementById('lang-toggle');
  if (langBtn) {
    langBtn.textContent  = t('langToggleFlag');
    langBtn.title        = t('langToggleAriaLabel');
    langBtn.setAttribute('aria-label', t('langToggleAriaLabel'));
  }

  // Update theme button aria-label
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) themeBtn.setAttribute('aria-label', t('themeAriaLabel'));

  // Update category manager open/close button text (respects open state)
  const manageCatBtn = document.getElementById('manage-categories-btn');
  const catManager   = document.getElementById('cat-manager');
  if (manageCatBtn && catManager) {
    manageCatBtn.textContent = catManager.hidden ? t('newCategory') : t('closeCategoryManager');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Switch language and re-render everything
// ─────────────────────────────────────────────────────────────────────────────

function applyLanguage(lang) {
  currentLang = lang;
  StorageService.save(STORAGE_KEY_LANG, lang);

  // Rebuild built-in category labels for the active language
  BUILT_IN_CATEGORIES.Food.label      = t('catFood');
  BUILT_IN_CATEGORIES.Transport.label = t('catTransport');
  BUILT_IN_CATEGORIES.Fun.label       = t('catFun');

  applyTranslations();
  rebuildCategorySelect();
  renderCustomCatList();
  renderAll();
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const BUILT_IN_CATEGORIES = {
  Food:      { color: '#FF6384', label: 'Makanan',      builtIn: true },
  Transport: { color: '#36A2EB', label: 'Transportasi', builtIn: true },
  Fun:       { color: '#FFCE56', label: 'Hiburan',      builtIn: true },
};

const STORAGE_KEY       = 'expense_transactions';
const STORAGE_KEY_CATS  = 'expense_custom_categories';
const STORAGE_KEY_LIMIT = 'expense_spend_limit';
const STORAGE_KEY_THEME = 'expense_theme';

// ─────────────────────────────────────────────────────────────────────────────
// State
// ─────────────────────────────────────────────────────────────────────────────

let transactions       = [];
let customCategories   = {};
let spendLimit         = 0;
let storageUnavailable = false;
let chartInstance      = null;
let currentSort        = 'date';
let theme              = 'light';

function allCategories() {
  return Object.assign({}, BUILT_IN_CATEGORIES, customCategories);
}

// ─────────────────────────────────────────────────────────────────────────────
// StorageService
// ─────────────────────────────────────────────────────────────────────────────

const StorageService = {
  load(key) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return null;
      return JSON.parse(raw);
    } catch (_) { return null; }
  },
  save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (_) { return false; }
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Validator (uses t() so messages update on language switch)
// ─────────────────────────────────────────────────────────────────────────────

const Validator = {
  validateName(value) {
    const v = (value || '').trim();
    if (!v)           return t('errNameRequired');
    if (v.length > 100) return t('errNameTooLong');
    return null;
  },
  validateAmount(value) {
    const v = (value || '').trim();
    if (!v) return t('errAmountRequired');
    const n = parseFloat(v);
    if (isNaN(n))           return t('errAmountNaN');
    if (n <= 0)             return t('errAmountZero');
    if (n > 999_999_999.99) return t('errAmountMax');
    const dec = v.split('.')[1];
    if (dec && dec.length > 2) return t('errAmountDecimals');
    return null;
  },
  validateCategory(value) {
    if (!value || !Object.prototype.hasOwnProperty.call(allCategories(), value))
      return t('errCategoryRequired');
    return null;
  },
  validateCategoryName(value, existing) {
    const v = (value || '').trim();
    if (!v)           return t('errCatNameRequired');
    if (v.length > 30) return t('errCatNameTooLong');
    const lower = v.toLowerCase();
    const taken = Object.keys(existing).map(k => k.toLowerCase());
    if (taken.includes(lower)) return t('errCatNameDuplicate');
    return null;
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Currency formatter
// ─────────────────────────────────────────────────────────────────────────────

const _fmt = new Intl.NumberFormat('id-ID', {
  style: 'currency', currency: 'IDR',
  minimumFractionDigits: 0, maximumFractionDigits: 0,
});
function formatCurrency(n) { return _fmt.format(n); }

// ─────────────────────────────────────────────────────────────────────────────
// Escape HTML
// ─────────────────────────────────────────────────────────────────────────────

function esc(s) {
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

// ─────────────────────────────────────────────────────────────────────────────
// Theme
// ─────────────────────────────────────────────────────────────────────────────

function applyTheme(th) {
  theme = th;
  document.documentElement.setAttribute('data-theme', th);
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = th === 'dark' ? '☀️' : '🌙';
  StorageService.save(STORAGE_KEY_THEME, th);
}

// ─────────────────────────────────────────────────────────────────────────────
// Spend limit
// ─────────────────────────────────────────────────────────────────────────────

function totalSpend() {
  return transactions.reduce((s, tx) => s + tx.amount, 0);
}

function updateSpendLimitDisplay() {
  const status = document.getElementById('spend-limit-status');
  const balEl  = document.getElementById('balance-display');
  if (!status || !balEl) return;
  if (spendLimit > 0) {
    const spent = totalSpend();
    const over  = spent > spendLimit;
    status.hidden = false;
    status.textContent = over
      ? `${t('overLimit')} ${formatCurrency(spent - spendLimit)}`
      : `${formatCurrency(spendLimit - spent)} ${t('remaining')}`;
    status.style.background = over ? 'var(--over-limit)' : '';
    status.style.color      = over ? 'var(--over-limit-txt)' : 'var(--text-muted)';
    balEl.classList.toggle('balance-amount--over', over);
  } else {
    status.hidden = true;
    balEl.classList.remove('balance-amount--over');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Categories
// ─────────────────────────────────────────────────────────────────────────────

function saveCustomCategories() {
  StorageService.save(STORAGE_KEY_CATS, customCategories);
}

function rebuildCategorySelect() {
  const sel = document.getElementById('item-category');
  if (!sel) return;
  const prev = sel.value;
  sel.innerHTML = `<option value="" disabled>${t('errCategoryRequired').replace('.','')}…</option>`;
  // Use a proper placeholder option
  sel.innerHTML = `<option value="" disabled>${currentLang === 'id' ? 'Pilih kategori' : 'Select a category'}</option>`;
  Object.entries(allCategories()).forEach(([key, cfg]) => {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = cfg.label;
    sel.appendChild(opt);
  });
  if (prev && allCategories()[prev]) sel.value = prev;
}

function renderCustomCatList() {
  const container = document.getElementById('custom-cat-list');
  if (!container) return;
  container.innerHTML = '';
  if (Object.keys(customCategories).length === 0) {
    container.innerHTML = `<p style="font-size:.8rem;color:var(--text-muted)">${t('noCustomCategories')}</p>`;
    return;
  }
  Object.entries(customCategories).forEach(([key, cfg]) => {
    const chip = document.createElement('span');
    chip.className = 'cat-chip';
    chip.style.background = cfg.color;
    chip.innerHTML = `${esc(cfg.label)}<button class="cat-chip__remove" data-remove="${esc(key)}" aria-label="${t('removeLabel')} ${esc(cfg.label)}">✕</button>`;
    container.appendChild(chip);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// State mutations
// ─────────────────────────────────────────────────────────────────────────────

function loadAll() {
  const txData = StorageService.load(STORAGE_KEY);
  if (txData === null) {
    storageUnavailable = true;
    transactions = [];
  } else {
    transactions = Array.isArray(txData) ? txData : [];
  }

  const catData = StorageService.load(STORAGE_KEY_CATS);
  customCategories = (catData && typeof catData === 'object') ? catData : {};

  const lim = StorageService.load(STORAGE_KEY_LIMIT);
  spendLimit = (typeof lim === 'number' && lim > 0) ? lim : 0;

  const savedTheme = StorageService.load(STORAGE_KEY_THEME);
  applyTheme(savedTheme === 'dark' ? 'dark' : 'light');

  const savedLang = StorageService.load(STORAGE_KEY_LANG);
  currentLang = (savedLang === 'en' || savedLang === 'id') ? savedLang : 'id';
  // Sync built-in labels to loaded language immediately
  BUILT_IN_CATEGORIES.Food.label      = t('catFood');
  BUILT_IN_CATEGORIES.Transport.label = t('catTransport');
  BUILT_IN_CATEGORIES.Fun.label       = t('catFun');
}

function addTransaction(tx) {
  transactions.push(tx);
  if (!StorageService.save(STORAGE_KEY, transactions)) {
    transactions.pop();
    showErrorBanner(t('saveError'));
    return;
  }
  renderAll();
}

function deleteTransaction(id) {
  const prev = [...transactions];
  transactions = transactions.filter(tx => tx.id !== id);
  if (!StorageService.save(STORAGE_KEY, transactions)) {
    transactions = prev;
    showErrorBanner(t('deleteError'));
    return;
  }
  renderAll();
}

// ─────────────────────────────────────────────────────────────────────────────
// Sort
// ─────────────────────────────────────────────────────────────────────────────

function sortedTransactions() {
  const copy = [...transactions];
  if (currentSort === 'amount')   return copy.sort((a, b) => b.amount - a.amount);
  if (currentSort === 'category') return copy.sort((a, b) => a.category.localeCompare(b.category));
  return copy.sort((a, b) => b.createdAt - a.createdAt);
}

// ─────────────────────────────────────────────────────────────────────────────
// Render — balance
// ─────────────────────────────────────────────────────────────────────────────

function renderBalance() {
  const el = document.getElementById('balance-display');
  if (!el) return;
  const total = totalSpend();
  el.textContent = formatCurrency(total);
  el.style.color = total < 0 ? 'var(--danger)' : '';
  updateSpendLimitDisplay();
}

// ─────────────────────────────────────────────────────────────────────────────
// Render — transaction list
// ─────────────────────────────────────────────────────────────────────────────

function renderTransactionList() {
  const container = document.getElementById('transaction-list');
  if (!container) return;
  container.innerHTML = '';

  const sorted = sortedTransactions();
  if (sorted.length === 0) {
    const p = document.createElement('p');
    p.className = 'empty-state';
    p.textContent = t('noTransactions');
    container.appendChild(p);
    return;
  }

  const cats  = allCategories();
  const limit = spendLimit;
  const ul    = document.createElement('ul');

  sorted.forEach(tx => {
    const cat  = cats[tx.category] || { color: '#999', label: tx.category };
    const over = limit > 0 && tx.amount > limit;
    const li   = document.createElement('li');
    li.className = 'transaction-item' + (over ? ' transaction-item--over' : '');
    li.dataset.id = tx.id;
    li.innerHTML = `
      <div class="transaction-item__info">
        <div class="transaction-item__name" title="${esc(tx.name)}">${esc(tx.name)}</div>
        <div class="transaction-item__amount">${formatCurrency(tx.amount)}${over ? ` <strong style="color:var(--over-limit-txt)">${esc(t('overLimitBadge'))}</strong>` : ''}</div>
      </div>
      <span class="category-badge" style="background:${cat.color};${cat.color === '#FFCE56' ? 'color:#333;' : ''}">${esc(cat.label)}</span>
      <button class="btn btn--delete" data-id="${esc(tx.id)}" aria-label="${esc(t('deleteLabel'))} ${esc(tx.name)}" type="button">✕</button>`;
    ul.appendChild(li);
  });

  container.appendChild(ul);
}

// ─────────────────────────────────────────────────────────────────────────────
// Render — chart
// ─────────────────────────────────────────────────────────────────────────────

function renderChart() {
  const canvas      = document.getElementById('spending-chart');
  const placeholder = document.getElementById('chart-placeholder');
  if (!canvas) return;

  const cats   = allCategories();
  const totals = Object.entries(cats).map(([key, cfg]) => ({
    label: cfg.label,
    color: cfg.color,
    total: transactions.filter(tx => tx.category === key).reduce((s, tx) => s + tx.amount, 0),
  })).filter(d => d.total > 0);

  if (totals.length === 0) {
    canvas.hidden = true;
    if (placeholder) { placeholder.hidden = false; placeholder.textContent = t('noChartData'); }
    return;
  }
  canvas.hidden = false;
  if (placeholder) placeholder.hidden = true;

  const labels = totals.map(d => d.label);
  const data   = totals.map(d => d.total);
  const colors = totals.map(d => d.color);

  if (chartInstance) {
    chartInstance.data.labels = labels;
    chartInstance.data.datasets[0].data = data;
    chartInstance.data.datasets[0].backgroundColor = colors;
    chartInstance.update();
  } else {
    chartInstance = new Chart(canvas, {
      type: 'pie',
      data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 2, borderColor: '#fff' }] },
      options: {
        responsive: true, maintainAspectRatio: true,
        plugins: {
          legend: { position: 'bottom', labels: { padding: 16, font: { size: 13 } } },
          tooltip: {
            callbacks: {
              label(ctx) {
                const tot = ctx.dataset.data.reduce((a, b) => a + b, 0);
                const pct = tot > 0 ? ((ctx.parsed / tot) * 100).toFixed(1) : 0;
                return ` ${ctx.label}: ${formatCurrency(ctx.parsed)} (${pct}%)`;
              },
            },
          },
        },
      },
    });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Render — monthly summary
// ─────────────────────────────────────────────────────────────────────────────

function renderMonthlySummary() {
  const container = document.getElementById('monthly-summary');
  if (!container) return;

  if (transactions.length === 0) {
    container.innerHTML = `<p class="empty-state">${t('noTransactions')}</p>`;
    return;
  }

  const groups = {};
  transactions.forEach(tx => {
    const d   = new Date(tx.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(tx);
  });

  const cats         = allCategories();
  const sortedMonths = Object.keys(groups).sort((a, b) => b.localeCompare(a));

  container.innerHTML = '';
  sortedMonths.forEach(monthKey => {
    const txs   = groups[monthKey];
    const total = txs.reduce((s, tx) => s + tx.amount, 0);

    const catTotals = {};
    txs.forEach(tx => { catTotals[tx.category] = (catTotals[tx.category] || 0) + tx.amount; });

    const [yr, mo] = monthKey.split('-');
    const label = new Date(+yr, +mo - 1, 1).toLocaleString(t('monthLocale'), { month: 'long', year: 'numeric' });

    const block  = document.createElement('div');
    block.className = 'month-block';

    const header = document.createElement('div');
    header.className = 'month-block__header';
    header.innerHTML = `<span>${esc(label)}</span><span>${formatCurrency(total)}</span>`;
    header.setAttribute('role', 'button');
    header.setAttribute('aria-expanded', 'true');

    const body = document.createElement('div');
    body.className = 'month-block__body';

    Object.entries(catTotals).forEach(([catKey, amt]) => {
      const cfg = cats[catKey] || { color: '#999', label: catKey };
      const row = document.createElement('div');
      row.className = 'month-cat-row';
      row.innerHTML = `
        <span class="month-cat-row__name">
          <span class="month-dot" style="background:${cfg.color}"></span>${esc(cfg.label)}
        </span>
        <span>${formatCurrency(amt)}</span>`;
      body.appendChild(row);
    });

    const totalRow = document.createElement('div');
    totalRow.className = 'month-cat-row month-total';
    totalRow.innerHTML = `<span>${t('total')}</span><span>${formatCurrency(total)}</span>`;
    body.appendChild(totalRow);

    header.addEventListener('click', () => {
      const hidden = body.hasAttribute('hidden');
      if (hidden) { body.removeAttribute('hidden'); header.setAttribute('aria-expanded', 'true'); }
      else        { body.setAttribute('hidden', '');  header.setAttribute('aria-expanded', 'false'); }
    });

    block.appendChild(header);
    block.appendChild(body);
    container.appendChild(block);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// renderAll
// ─────────────────────────────────────────────────────────────────────────────

function renderAll() {
  renderBalance();
  renderTransactionList();
  renderChart();
  renderMonthlySummary();
}

// ─────────────────────────────────────────────────────────────────────────────
// Event handlers
// ─────────────────────────────────────────────────────────────────────────────

function handleFormSubmit(e) {
  e.preventDefault();
  const form      = e.currentTarget;
  const nameInput = form.elements['name'];
  const amtInput  = form.elements['amount'];
  const catSelect = form.elements['category'];

  clearFieldErrors(form);

  const ne = Validator.validateName(nameInput.value);
  const ae = Validator.validateAmount(amtInput.value);
  const ce = Validator.validateCategory(catSelect.value);
  let bad = false;

  if (ne) { showFieldError('name-error', ne);     nameInput.classList.add('is-invalid'); bad = true; }
  if (ae) { showFieldError('amount-error', ae);   amtInput.classList.add('is-invalid');  bad = true; }
  if (ce) { showFieldError('category-error', ce); catSelect.classList.add('is-invalid'); bad = true; }
  if (bad) return;

  const tx = {
    id:        typeof crypto !== 'undefined' && crypto.randomUUID
                 ? crypto.randomUUID()
                 : String(Date.now()) + Math.random().toString(36).slice(2),
    name:      nameInput.value.trim(),
    amount:    parseFloat(amtInput.value),
    category:  catSelect.value,
    createdAt: Date.now(),
  };

  addTransaction(tx);
  form.reset();
}

function handleListClick(e) {
  const btn = e.target.closest('[data-id]');
  if (!btn) return;
  const id   = btn.dataset.id;
  const name = btn.getAttribute('aria-label')?.replace(t('deleteLabel') + ' ', '') || t('fallbackTx');
  if (window.confirm(`${t('confirmDelete')} "${name}"${t('confirmDeleteSuffix')}`)) deleteTransaction(id);
}

function handleNewCatSubmit(e) {
  e.preventDefault();
  const nameInput  = document.getElementById('new-cat-name');
  const colorInput = document.getElementById('new-cat-color');
  const errSpan    = document.getElementById('new-cat-error');
  errSpan.textContent = '';

  const err = Validator.validateCategoryName(nameInput.value, allCategories());
  if (err) { errSpan.textContent = err; return; }

  const label = nameInput.value.trim();
  customCategories[label] = { color: colorInput.value, label, builtIn: false };

  saveCustomCategories();
  rebuildCategorySelect();
  renderCustomCatList();
  nameInput.value  = '';
  colorInput.value = '#8b5cf6';
}

function handleRemoveCat(key) {
  const inUse = transactions.some(tx => tx.category === key);
  if (inUse) {
    showErrorBanner(`"${key}" — ${t('categoryInUseError')}`);
    return;
  }
  delete customCategories[key];
  saveCustomCategories();
  rebuildCategorySelect();
  renderCustomCatList();
}

function handleSortClick(e) {
  const btn = e.target.closest('[data-sort]');
  if (!btn) return;
  currentSort = btn.dataset.sort;
  document.querySelectorAll('.btn--sort').forEach(b => b.classList.remove('btn--sort--active'));
  btn.classList.add('btn--sort--active');
  renderTransactionList();
}

function handleSpendLimitChange(e) {
  const val = parseFloat(e.target.value);
  spendLimit = isNaN(val) || val <= 0 ? 0 : val;
  StorageService.save(STORAGE_KEY_LIMIT, spendLimit);
  renderAll();
}

function handleTabClick(e) {
  const tab = e.target.closest('[data-tab]');
  if (!tab) return;
  const target = tab.dataset.tab;
  document.querySelectorAll('.tab').forEach(t => {
    const active = t.dataset.tab === target;
    t.classList.toggle('tab--active', active);
    t.setAttribute('aria-selected', String(active));
  });
  document.querySelectorAll('.tab-panel').forEach(p => {
    p.hidden = p.id !== `panel-${target}`;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Banner helpers
// ─────────────────────────────────────────────────────────────────────────────

function showWarningBanner(msg) {
  const el = document.getElementById('storage-warning');
  if (!el) return;
  el.textContent = '⚠️ ' + msg;
  el.hidden = false;
}

function showErrorBanner(msg) {
  const el = document.getElementById('storage-error');
  if (!el) return;
  el.textContent = '❌ ' + msg;
  el.hidden = false;
  setTimeout(() => { el.hidden = true; }, 5000);
}

function showFieldError(id, msg) {
  const s = document.getElementById(id);
  if (s) s.textContent = msg;
}

function clearFieldErrors(form) {
  ['name-error','amount-error','category-error'].forEach(id => {
    const s = document.getElementById(id);
    if (s) s.textContent = '';
  });
  ['name','amount','category'].forEach(n => {
    const el = form.elements[n];
    if (el) el.classList.remove('is-invalid');
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Init
// ─────────────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  loadAll();

  // Apply saved language first so everything renders correctly
  applyTranslations();

  if (storageUnavailable) showWarningBanner(t('storageUnavailable'));

  rebuildCategorySelect();
  renderCustomCatList();

  const limitInput = document.getElementById('spend-limit');
  if (limitInput && spendLimit > 0) limitInput.value = spendLimit;

  // ── Wire events ──

  const form = document.getElementById('transaction-form');
  if (form) form.addEventListener('submit', handleFormSubmit);

  const list = document.getElementById('transaction-list');
  if (list) list.addEventListener('click', handleListClick);

  const newCatForm = document.getElementById('new-cat-form');
  if (newCatForm) newCatForm.addEventListener('submit', handleNewCatSubmit);

  const catList = document.getElementById('custom-cat-list');
  if (catList) catList.addEventListener('click', e => {
    const btn = e.target.closest('[data-remove]');
    if (btn) handleRemoveCat(btn.dataset.remove);
  });

  const manageCatBtn = document.getElementById('manage-categories-btn');
  const catManager   = document.getElementById('cat-manager');
  if (manageCatBtn && catManager) {
    manageCatBtn.addEventListener('click', () => {
      catManager.hidden = !catManager.hidden;
      manageCatBtn.textContent = catManager.hidden ? t('newCategory') : t('closeCategoryManager');
    });
  }

  const sortBtns = document.querySelector('.sort-btns');
  if (sortBtns) sortBtns.addEventListener('click', handleSortClick);

  if (limitInput) limitInput.addEventListener('change', handleSpendLimitChange);

  const tabBar = document.querySelector('.tab-bar');
  if (tabBar) tabBar.addEventListener('click', handleTabClick);

  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) themeBtn.addEventListener('click', () => applyTheme(theme === 'dark' ? 'light' : 'dark'));

  // Language toggle
  const langBtn = document.getElementById('lang-toggle');
  if (langBtn) langBtn.addEventListener('click', () => {
    applyLanguage(currentLang === 'id' ? 'en' : 'id');
  });

  renderAll();
});
