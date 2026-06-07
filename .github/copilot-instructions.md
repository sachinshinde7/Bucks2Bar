<!-- Copilot instructions tailored to the Bucks2Bar workspace -->
# Bucks2Bar — AI coding agent guide

Purpose: help an AI coding agent be immediately productive on this small static app.

Quick architecture (big picture)
- Single-page static app: `index.html` is the entry. No backend or build step.
- `script.js` holds the app logic (DOM wiring, data persistence, chart creation). `css/styles.css` contains small layout helpers.
- External libs loaded via CDN in `index.html`: Bootstrap (styles/utilities) and Chart.js (chart rendering).

Key files & responsibilities
- `index.html`: markup, CDN includes, and the container for inputs/tabs/chart.
- `script.js`: primary functions to know: `buildTableRows()`, `renderInputs()`, `readCurrentData()`, `saveStoredData()`, `createChart()`, `updateChart()`, `initManualTabs()`, `initControls()`.
- `css/styles.css`: small overrides and fallback styles used by the manual tabs.

Data flow & important invariants
- Persistent state: single localStorage key: `STORAGE_KEY = 'bucks2bar_data_v1'`. If you change the stored shape, bump the suffix (e.g. `_v2`).
- `MONTHS` is an array of exactly 12 month labels — the app assumes 12 items across inputs, chart labels, and stored arrays.
- Inputs: monthly input elements use class `.month-input` and ids `income-<i>` / `expense-<i>` (e.g. `income-0`). Use these selectors when updating or testing DOM behavior.

UI & behavior patterns to preserve
- Tabs are handled manually: buttons use `data-target` and `initManualTabs()` toggles `.show` and `.active`. If you change tab markup, update that function.
- Chart.js dataset order is `[Income, Expense]`. `createChart()` initializes it; updates replace `dataset.data` and call `chartInstance.update()`.
- Currency formatting uses `Intl.NumberFormat('en-US', {currency: 'USD'})` (look for `currencyFormatter`) and is reused in tooltip callbacks.

Developer workflows
- No npm or build: run a simple static server to test. Example PowerShell commands:
```powershell
cd 'c:\Users\2203410\sachin\workspace\nextjs\Bucks2Bar'
python -m http.server 3000
# open http://localhost:3000
```
Or:
```powershell
npx serve -p 3000 .
```
Or use the VS Code Live Server extension.

What to edit for common tasks
- Change chart visuals: edit `createChart()` in `script.js` (labels, colors, dataset order, tooltip callbacks).
- Add/validate inputs: update `buildTableRows()` and `readCurrentData()`; ensure `renderInputs()` and `saveStoredData()` maintain the 12-entry invariant.
- Switch to Bootstrap tab JS: replace `data-target` with `data-bs-toggle` in `index.html`, remove manual tab logic in `initManualTabs()`, and update `css/styles.css` if necessary.

Constraints and safety
- Do not introduce a bundler or framework unless `package.json` and related config exist.
- Preserve `STORAGE_KEY` versioning and `MONTHS` length unless intentionally migrating and updating every code path.

Commit guidance
- Keep commit messages focused: e.g. `feat: update chart color + tooltip currency formatting` or `fix: handle NaN in stored expenses`.

If something specific is unclear or you want more examples (unit test suggestions, end-to-end checks, or CI), tell me which area to expand.
<!-- Copilot instructions tailored to the Bucks2Bar workspace -->
# Bucks2Bar — AI coding agent guide

This repository is a small static web app. The purpose of this file is to give an AI coding agent immediately useful, repository-specific guidance: where the pieces live, key patterns, and concrete examples to change behavior safely.

- **Project entry:** `index.html` — includes Bootstrap and Chart.js via CDN, and loads `script.js` at the end of the body.
- **Client code:** `script.js` — vanilla ES5/ES6 DOM code. Primary responsibilities: build inputs, persist/read `localStorage`, create/update Chart.js chart, and manual tab handling.
- **Styles:** `css/styles.css` — small layout helpers and fallbacks (not a CSS framework).

Key patterns and actionable notes
- **Local storage versioning:** the app uses a single key: `STORAGE_KEY = 'bucks2bar_data_v1'`. When changing stored data shape, bump the suffix (`_v2`) to avoid migrations.
- **Months constant:** `MONTHS` (array of 12 strings) and the app expects exactly 12 months. Inputs, chart datasets, and storage slice to 12 entries — preserve this when editing.
- **Inputs:** monthly inputs have class `.month-input` and ids `income-<i>` / `expense-<i>`. Use these selectors when adding features or tests.
- **Manual tab handling:** the HTML uses a custom mechanism instead of Bootstrap tab JS — buttons use `data-target` attributes and `initManualTabs()` toggles `.show`/`.active`. When changing tab markup, update `initManualTabs()` accordingly.
- **Chart creation:** Chart.js is initialized in `createChart()`. Chart datasets are ordered `[Income, Expense]` and update logic replaces `dataset.data` arrays and calls `chartInstance.update()`; modify `createChart()` to change colors, labels, or bar styling.
- **Formatting & tooltips:** currency formatting uses `Intl.NumberFormat('en-US', {currency: 'USD'})` and tooltip callbacks in the chart options. Prefer reusing `currencyFormatter` for consistency.
- **Event flow:** input `input` events call `updateChart()` and `saveStoredData(readCurrentData())`. `save` and `reset` buttons call higher-level helpers in `initControls()`; reuse those helpers for consistent behavior.

Local development / test commands
- There is no package.json or build step in the repository. Serve the folder statically to test interactive behavior.

PowerShell (recommended if Python is installed):
```powershell
cd 'c:\Users\2203410\sachin\workspace\nextjs\Bucks2Bar'
python -m http.server 3000
# then open http://localhost:3000 in a browser
```

If Node/npm is available:
```powershell
cd 'c:\Users\2203410\sachin\workspace\nextjs\Bucks2Bar'
npx serve -p 3000 .
```

Or use VS Code Live Server extension to preview `index.html`.

Safety and non-inventing constraints for the agent
- Do not introduce a bundler or framework (Next.js, React) unless the repo explicitly contains a `package.json` and related config. The current code is plain static HTML/CSS/JS and should remain that way unless the maintainers ask for migration.
- Preserve `STORAGE_KEY` semantics (versioned key) when changing storage format.
- Preserve the 12-month assumption unless you update `MONTHS` and adapt all code paths (`buildTableRows`, `renderInputs`, storage read/write, chart labels).

Places to edit for common tasks (examples)
- To change chart appearance: edit `createChart()` in `script.js` (labels, colors, dataset order, options.plugins.tooltip callbacks).
- To add validation or new input fields: update `buildTableRows()` and `readCurrentData()`, then ensure `renderInputs()` and `saveStoredData()` remain consistent.
- To change tab semantics to rely on Bootstrap JS: remove `initManualTabs()` usage and replace markup `data-target` attributes with proper `data-bs-toggle` / Bootstrap markup; update `index.html` and remove the fallback CSS in `css/styles.css` if no longer needed.

When committing changes
- Keep commit messages short and focused. Example: `feat: update chart color + tooltip currency formatting` or `fix: handle NaN in stored expenses`.

If anything in this file is unclear or you want more detail (tests, CI, or migration plan to a bundler), tell me which area to expand and I'll iterate.
