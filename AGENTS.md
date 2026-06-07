One-line summary: Tiny static app to enter monthly income/expenses and visualize them with a grouped bar chart.

Purpose
- Project: Track 12 months of income and expenses in USD and visualize them with Chart.js.
- Audience: Humans and automation/AI agents that will read, modify, or extend this repo.

Entry point
- `index.html` — single-page entry that loads Bootstrap, Chart.js, and `script.js`.

Key files & responsibilities
- `index.html`: Markup, tab UI, canvas element, and CDN includes.
- `script.js`: Application logic — data persistence, DOM wiring, chart creation, input listeners, and manual tab handling.
- `css/styles.css`: Layout helpers, chart container sizing, and light fallbacks when Bootstrap is missing.
- `AGENTS.md`: This documentation for agents/maintainers.

Important constants
- `MONTHS`: Array of exactly 12 month labels (indexes 0..11). The app assumes 12 items across inputs, chart labels, and stored arrays.
- `STORAGE_KEY`: `'bucks2bar_data_v1'` — versioned localStorage key. If you change the stored shape, bump the suffix (e.g., `_v2`).

Main functions (what to look for in `script.js`)
- `buildTableRows()`: Creates table rows and monthly inputs with ids `income-<i>` / `expense-<i>` and class `month-input`.
- `renderInputs(data)`: Populates input values from a data object.
- `readCurrentData()`: Reads values from the DOM and returns `{incomes, expenses}` arrays of length 12.
- `loadStoredData()` / `saveStoredData(data)`: Read/write JSON to localStorage under `STORAGE_KEY` and coerce values to numbers.
- `createChart()`: Initializes Chart.js bar chart (datasets ordered `[Income, Expense]`) and configures tooltips and formatting.
- `updateChart()`: Replaces dataset arrays from `readCurrentData()` and calls chart update.
- `attachInputListeners()`: Adds `input` and `blur` listeners to `.month-input` elements to auto-save and format values.
- `initControls()`: Wires `save`, `reset`, `update-chart`, `chart-refresh`, and download buttons.
- `initManualTabs()`: Manual tab controller using `data-target` attributes and toggling `.show` / `.active`.

Data flow
- On init (`initApp()`): `buildTableRows()` → `loadStoredData()` → `renderInputs()` → `attachInputListeners()` → `createChart()` → `updateChart()`.
- User edits an input → `input` event triggers `updateChart()` and `saveStoredData(readCurrentData())`.

Invariants & constraints
- 12-month invariant: `MONTHS` must be length 12. Many functions assume arrays of length 12.
- localStorage versioning: Preserve `STORAGE_KEY` semantics; when changing shape, bump suffix (e.g., `_v2`) and provide a migration.
- Dataset order: Chart datasets are `[Income, Expense]`; UI and tests rely on this order.
- No build step: The repo is static — avoid introducing bundlers/frameworks unless a `package.json` and build config are intentionally added.

How to run locally
- Serve the folder and open `index.html` in a browser. Examples (PowerShell):

```powershell
cd 'c:\Users\2203410\sachin\workspace\nextjs\Bucks2Bar'
python -m http.server 3000
# then open http://localhost:3000
```

Or:

```powershell
cd 'c:\Users\2203410\sachin\workspace\nextjs\Bucks2Bar'
npx serve -p 3000 .
```

Common edit points
- Change chart visuals or tooltip formatting: edit `createChart()` in `script.js`.
- Add/validate inputs or change months: update `buildTableRows()`, `readCurrentData()`, and `renderInputs()` — keep the 12-entry invariant or update all code paths.
- Switch to Bootstrap tab JS: replace `data-target` with Bootstrap `data-bs-*` attributes in `index.html` and remove `initManualTabs()` and related CSS fallbacks.
- Persist shape change: bump `STORAGE_KEY` and add a migration helper that converts old data to the new shape.

Testing & development notes
- No automated tests or build tools; manual testing is expected.
- Verify input formatting (two decimals on blur), chart updates when the Chart tab is activated, and download fallback for chart PNG.
- Inspect `localStorage` key `bucks2bar_data_v1` in devtools to confirm arrays are numeric and length 12 after saves.

Safety & style constraints
- Do not add a bundler/framework unless `package.json` and build config exist.
- Preserve `STORAGE_KEY` versioning unless intentionally migrating; avoid silent breaking changes to stored data.
- Keep changes minimal and consistent with plain HTML/CSS/JS style.

Commit message guidance
- Short, focused messages, e.g.:
	- `feat: update chart colors and tooltip currency formatting`
	- `fix: ensure stored arrays are numeric and length 12`
	- `chore: bump STORAGE_KEY to bucks2bar_data_v2 for storage migration`

Suggested next tasks
- Add a migration helper that safely reads `bucks2bar_data_v1`, converts to a new shape (if needed), and writes `bucks2bar_data_v2` with documentation.
- Add a minimal browser-based test page that validates `readCurrentData()`, `renderInputs()`, and the 12-length invariant.

