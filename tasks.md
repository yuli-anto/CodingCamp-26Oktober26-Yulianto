# Implementation Plan: Expense & Budget Visualizer

## Overview

Build a single-page client-side web application from scratch using three files: `index.html`, `css/style.css`, and `js/app.js`. Implementation proceeds bottom-up: data model and storage first, then pure business logic, then rendering, then the HTML shell, then CSS polish. Each step wires directly into the previous one so there is no orphaned code.

## Tasks

- [ ] 1. Scaffold the project file structure and HTML shell
  - Create `index.html` with `<!DOCTYPE html>`, `<meta charset>`, `<meta name="viewport">`, and a `<title>`
  - Add a `<link>` tag referencing `css/style.css`
  - Add a `<script>` tag loading Chart.js from CDN (`https://cdn.jsdelivr.net/npm/chart.js`) before the app script
  - Add a deferred `<script src="js/app.js">` tag
  - Create empty `css/style.css` and `js/app.js` files
  - _Requirements: 7.1_

- [ ] 2. Implement the data model, CATEGORY_CONFIG, and StorageService
  - [ ] 2.1 Define the Transaction data model and CATEGORY_CONFIG constant
    - Document the `Transaction` shape: `{ id, name, amount, category, createdAt }`
    - Define `CATEGORY_CONFIG` with `Food`, `Transport`, `Fun` entries, each with a `color` and `label` field
    - _Requirements: 1.2, 5.5_

  - [ ] 2.2 Implement `StorageService.load()` and `StorageService.save()`
    - Wrap all `localStorage` calls in try/catch
    - `load()` returns parsed `Transaction[]` or `null` on any failure (unavailable storage, corrupt JSON)
    - `save(transactions)` calls `JSON.stringify` + `setItem`, returns `true` on success, `false` on any throw
    - Use `"expense_transactions"` as the storage key
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ]* 2.3 Write property test for StorageService round-trip (Property 8)
    - **Property 8: Storage round-trip preserves all transaction fields**
    - **Validates: Requirements 6.1, 6.2**

- [ ] 3. Implement the Validator module
  - [ ] 3.1 Implement `Validator.validateName(value)`
    - Return `null` if trimmed value is non-empty and length ≤ 100
    - Return an error string for empty/whitespace-only or >100 character inputs
    - _Requirements: 1.1, 1.4_

  - [ ]* 3.2 Write property test for `Validator.validateName` (Property 2)
    - **Property 2: Whitespace-only or empty name is rejected**
    - **Validates: Requirements 1.4**

  - [ ] 3.3 Implement `Validator.validateAmount(value)`
    - Return `null` if value is a parseable float, > 0, ≤ 999,999,999.99, and has ≤ 2 decimal places
    - Return an error string for zero, negative, over-limit, more than 2 decimal places, or non-numeric input
    - _Requirements: 1.1, 1.5_

  - [ ]* 3.4 Write property test for `Validator.validateAmount` (Property 3)
    - **Property 3: Amount boundary validation**
    - **Validates: Requirements 1.5**

  - [ ] 3.5 Implement `Validator.validateCategory(value)`
    - Return `null` if value is exactly `"Food"`, `"Transport"`, or `"Fun"`
    - Return an error string for empty string or any other value
    - _Requirements: 1.1, 1.4_

- [ ] 4. Implement `formatCurrency()` and the in-memory state layer
  - [ ] 4.1 Implement `formatCurrency(amount)`
    - Use `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })`
    - Correctly handles negative values (e.g., `-$50.00`) via native formatter
    - _Requirements: 4.1, 4.4, 4.5_

  - [ ]* 4.2 Write property test for `formatCurrency` (Property 9)
    - **Property 9: Currency formatter produces correct format for all valid sums**
    - **Validates: Requirements 4.1, 4.4, 4.5**

  - [ ] 4.3 Implement in-memory `transactions` array and `loadFromStorage()`
    - Declare `let transactions = []` as the single source of truth
    - `loadFromStorage()` calls `StorageService.load()`; if result is `null`, keeps `transactions = []` and sets a flag to show the warning banner
    - _Requirements: 6.1, 6.3_

  - [ ] 4.4 Implement `addTransaction(tx)` and `deleteTransaction(id)`
    - `addTransaction`: pushes to `transactions`, calls `StorageService.save()`; if save returns `false`, reverts the push and sets error banner flag
    - `deleteTransaction`: filters out the matching id, calls `StorageService.save()`; if save returns `false`, restores the previous array and sets error banner flag
    - Both functions call `renderAll()` only on successful save
    - _Requirements: 1.2, 3.3, 6.2, 6.4_

  - [ ]* 4.5 Write property test for `addTransaction` persistence (Property 1)
    - **Property 1: Valid transaction persists and appears in list**
    - **Validates: Requirements 1.2, 6.2**

  - [ ]* 4.6 Write property test for `deleteTransaction` (Property 7)
    - **Property 7: Delete removes transaction from storage**
    - **Validates: Requirements 3.3, 6.2**

- [ ] 5. Checkpoint — Verify pure logic before touching the DOM
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Build the HTML structure for all UI regions
  - [ ] 6.1 Add the Balance Display region to `index.html`
    - Create a `<section>` with `aria-labelledby` pointing to a visible heading
    - Add an element with `id="balance-display"` that will receive the formatted total
    - _Requirements: 4.1, 7.2_

  - [ ] 6.2 Add the Input Form region to `index.html`
    - Create a `<form id="transaction-form">` with `aria-labelledby` or `aria-label`
    - Add a text `<input>` for item name (`maxlength="100"`) with an associated `<label>` and an error `<span>`
    - Add a number `<input>` for amount with an associated `<label>` and an error `<span>`
    - Add a `<select>` for category with a blank default option and options Food, Transport, Fun, with an associated `<label>` and an error `<span>`
    - Add a submit `<button>` labelled "Add"
    - _Requirements: 1.1, 1.3, 1.4, 7.2, 7.4_

  - [ ] 6.3 Add the Transaction List region to `index.html`
    - Create a `<section>` with `aria-labelledby` and a scrollable container (`id="transaction-list"`)
    - _Requirements: 2.1, 2.2, 7.2_

  - [ ] 6.4 Add the Chart region to `index.html`
    - Create a `<section>` with `aria-labelledby`
    - Add a `<canvas id="spending-chart">` and a sibling `<p id="chart-placeholder">` for the empty state
    - _Requirements: 5.4, 7.2_

  - [ ] 6.5 Add the error/warning banner elements to `index.html`
    - Add a `<div id="storage-warning">` (hidden by default) for storage-unavailable warnings
    - Add a `<div id="storage-error">` (hidden by default) for write-failure errors
    - _Requirements: 6.3, 6.4_

- [ ] 7. Implement the Render Layer
  - [ ] 7.1 Implement `renderBalance()`
    - Sum `transactions` amounts with `Array.reduce`, format with `formatCurrency`, set `#balance-display` `textContent`
    - Show `$0.00` when array is empty
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ] 7.2 Implement `renderTransactionList()`
    - Clear `#transaction-list` and rebuild a `<ul>` in reverse index order (newest first)
    - Each `<li>` shows: item name, amount formatted with `formatCurrency`, category badge styled per `CATEGORY_CONFIG`, and a delete `<button>` with `data-id` attribute
    - When `transactions` is empty, insert `<p>No transactions recorded.</p>`
    - _Requirements: 2.1, 2.3, 2.4, 3.1, 3.4_

  - [ ]* 7.3 Write property test for reverse-chronological render order (Property 5)
    - **Property 5: Transaction list renders in reverse chronological order**
    - **Validates: Requirements 2.1**

  - [ ]* 7.4 Write property test for delete control presence (Property 6)
    - **Property 6: Every rendered transaction entry has a delete control**
    - **Validates: Requirements 3.1**

  - [ ] 7.5 Implement `renderChart()`
    - Aggregate `transactions` amounts by category using `CATEGORY_CONFIG` keys
    - On first call, create a new `Chart` instance (type `'doughnut'` or `'pie'`) on `#spending-chart` canvas
    - On subsequent calls, update `chartInstance.data.labels`, `chartInstance.data.datasets[0].data`, and call `chartInstance.update()` — do NOT destroy and recreate
    - When all category totals are zero (empty state), hide the canvas and show `#chart-placeholder`; otherwise show canvas and hide placeholder
    - Guard with `if (!canvas) return` before any Chart.js calls
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ]* 7.6 Write property test for chart segments and colors (Property 10)
    - **Property 10: Chart segments cover exactly the active categories with distinct colors**
    - **Validates: Requirements 5.1, 5.5**

  - [ ] 7.7 Implement `renderAll()` and the balance property test helper
    - Call `renderTransactionList()`, `renderBalance()`, and `renderChart()` in sequence
    - _Requirements: 2.3, 4.2, 4.3, 5.2, 5.3_

  - [ ]* 7.8 Write property test for balance equals sum of amounts (Property 4)
    - **Property 4: Balance equals sum of all amounts**
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.5**

- [ ] 8. Implement event handlers and wire everything together
  - [ ] 8.1 Implement the form submit handler `handleFormSubmit(event)`
    - Call `event.preventDefault()`
    - Run `Validator.validateName`, `Validator.validateAmount`, `Validator.validateCategory`; display inline errors in the corresponding `<span>` elements for any failures; return early if any error
    - Clear all error spans before re-validating on each submit attempt
    - On passing validation, build a `Transaction` object with `id` from `crypto.randomUUID()` (or `Date.now().toString()` fallback), parsed `amount`, trimmed `name`, `category`, and `Date.now()` for `createdAt`
    - Call `addTransaction(tx)`, then reset the form
    - _Requirements: 1.2, 1.3, 1.4, 1.5_

  - [ ] 8.2 Implement the delete button click handler using event delegation
    - Attach a single `click` listener to `#transaction-list`
    - On click, check if `event.target` matches `[data-id]` delete button
    - Show `confirm()` dialog; on confirmation call `deleteTransaction(id)`
    - _Requirements: 3.2, 3.3, 3.4, 3.5, 3.6_

  - [ ] 8.3 Implement the `DOMContentLoaded` initialisation block
    - Call `loadFromStorage()`
    - Show `#storage-warning` banner if storage was unavailable on load
    - Attach form submit and delete click handlers
    - Call `renderAll()` to populate UI from loaded data
    - _Requirements: 6.1, 6.3_

- [ ] 9. Checkpoint — Verify full application flow in the browser
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Implement CSS — layout, responsiveness, and accessibility
  - [ ] 10.1 Implement base layout and desktop styles
    - Define a centered max-width container; lay out Balance Display, Input Form, Transaction List, and Chart as distinct visual sections
    - Style the category badges using colors from `CATEGORY_CONFIG`
    - Style the warning banner (yellow background) and error banner (red background)
    - _Requirements: 7.1_

  - [ ] 10.2 Implement responsive layout for 320px–1920px viewports
    - Use CSS media queries or fluid units so no element's right edge exceeds viewport width at any width in 320px–1920px
    - Stack sections vertically on narrow viewports; two-column layout optional on wider ones
    - _Requirements: 7.1_

  - [ ] 10.3 Implement focus indicators with 3:1 contrast ratio
    - Add visible `:focus-visible` styles to all interactive elements (inputs, select, buttons)
    - Ensure the focus indicator color achieves at least 3:1 contrast ratio against the adjacent background
    - _Requirements: 7.3_

  - [ ] 10.4 Implement minimum 44×44 CSS px tap targets on mobile
    - Apply `min-height: 44px; min-width: 44px` (or equivalent padding) to all interactive elements on viewports 320px–1024px
    - _Requirements: 7.4_

  - [ ] 10.5 Set scroll behaviour on the Transaction List container
    - Apply `overflow-y: auto` (or `scroll`) and a fixed `max-height` to `#transaction-list` so it becomes scrollable when content overflows
    - _Requirements: 2.2_

- [ ] 11. Final checkpoint — Ensure all tests pass, full manual smoke test
  - Ensure all automated tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP; all core functionality is deliverable without them
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation before moving to the next layer
- Property tests reference the design's Correctness Properties section (Properties 1–10) and require a property-based testing library such as [fast-check](https://fast-check.dev/) to execute
- Unit tests cover pure functions (Validator, formatCurrency, StorageService) with mocked localStorage
- The Chart.js `chartInstance` must be a module-scoped variable to support the update-in-place strategy

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["2.1"] },
    { "id": 1, "tasks": ["2.2", "3.1", "3.3", "3.5", "4.1"] },
    { "id": 2, "tasks": ["2.3", "3.2", "3.4", "4.2", "4.3"] },
    { "id": 3, "tasks": ["4.4", "4.5", "4.6", "6.1", "6.2", "6.3", "6.4", "6.5"] },
    { "id": 4, "tasks": ["7.1", "7.2", "7.5"] },
    { "id": 5, "tasks": ["7.3", "7.4", "7.6", "7.7", "8.1", "8.2"] },
    { "id": 6, "tasks": ["7.8", "8.3"] },
    { "id": 7, "tasks": ["10.1"] },
    { "id": 8, "tasks": ["10.2", "10.3", "10.4", "10.5"] }
  ]
}
```
