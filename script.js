const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const STORAGE_KEY = 'bucks2bar_data_v1';

const currencyFormatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
});

let chartInstance = null;

function getDefaultData() {
	return {
		incomes: Array(12).fill(0),
		expenses: Array(12).fill(0),
	};
}

function loadStoredData() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) {
			return getDefaultData();
		}

		const parsed = JSON.parse(raw);
		if (!parsed || !Array.isArray(parsed.incomes) || !Array.isArray(parsed.expenses)) {
			return getDefaultData();
		}

		return {
			incomes: parsed.incomes.slice(0, 12).map((value) => Number(value) || 0),
			expenses: parsed.expenses.slice(0, 12).map((value) => Number(value) || 0),
		};
	} catch (error) {
		console.warn('Unable to load stored data:', error);
		return getDefaultData();
	}
}

function saveStoredData(data) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function buildTableRows() {
	const tbody = document.getElementById('data-table-body');
	tbody.innerHTML = '';

	MONTHS.forEach((month, index) => {
		const row = document.createElement('tr');
		row.innerHTML = `
			<th scope="row">${month}</th>
			<td>
				<input type="number" min="0" step="0.01" class="form-control month-input" id="income-${index}" data-month="${index}" data-type="income" aria-label="Income for ${month}" placeholder="0.00">
			</td>
			<td>
				<input type="number" min="0" step="0.01" class="form-control month-input" id="expense-${index}" data-month="${index}" data-type="expense" aria-label="Expense for ${month}" placeholder="0.00">
			</td>
		`;
		tbody.appendChild(row);
	});
}

function renderInputs(data) {
	data.incomes.forEach((value, index) => {
		const incomeInput = document.getElementById(`income-${index}`);
		if (incomeInput) {
			incomeInput.value = Number(value).toFixed(2);
		}
	});

	data.expenses.forEach((value, index) => {
		const expenseInput = document.getElementById(`expense-${index}`);
		if (expenseInput) {
			expenseInput.value = Number(value).toFixed(2);
		}
	});
}

function readCurrentData() {
	const incomes = [];
	const expenses = [];

	MONTHS.forEach((_, index) => {
		const incomeInput = document.getElementById(`income-${index}`);
		const expenseInput = document.getElementById(`expense-${index}`);

		const incomeValue = incomeInput ? parseFloat(incomeInput.value) : 0;
		const expenseValue = expenseInput ? parseFloat(expenseInput.value) : 0;

		incomes.push(Number.isFinite(incomeValue) ? incomeValue : 0);
		expenses.push(Number.isFinite(expenseValue) ? expenseValue : 0);
	});

	return { incomes, expenses };
}

function updateChart() {
	if (!chartInstance) {
		return;
	}

	const data = readCurrentData();
	chartInstance.data.datasets[0].data = data.incomes;
	chartInstance.data.datasets[1].data = data.expenses;
	chartInstance.update('active');
}

function createChart() {
	const ctx = document.getElementById('income-expense-chart').getContext('2d');
	chartInstance = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: MONTHS,
			datasets: [
				{
					label: 'Income',
					data: [],
					backgroundColor: '#0d6efd',
					borderRadius: 4,
					barThickness: 24,
				},
				{
					label: 'Expense',
					data: [],
					backgroundColor: '#dc3545',
					borderRadius: 4,
					barThickness: 24,
				},
			],
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			interaction: {
				mode: 'index',
				intersect: false,
			},
			plugins: {
				tooltip: {
					callbacks: {
						label(context) {
							return `${context.dataset.label}: ${currencyFormatter.format(context.parsed.y)}`;
						},
					},
				},
				legend: {
					labels: {
						boxWidth: 16,
						boxHeight: 16,
					},
				},
			},
			scales: {
				x: {
					stacked: false,
				},
				y: {
					beginAtZero: true,
					ticks: {
						callback(value) {
							return currencyFormatter.format(value);
						},
					},
				},
			},
		},
	});
}

function attachInputListeners() {
	const inputs = document.querySelectorAll('.month-input');
	inputs.forEach((input) => {
		input.addEventListener('input', () => {
			updateChart();
			saveStoredData(readCurrentData());
		});
		input.addEventListener('blur', () => {
			if (input.value === '' || Number.isNaN(parseFloat(input.value))) {
				input.value = '0.00';
			} else {
				input.value = parseFloat(input.value).toFixed(2);
			}
		});
	});
}

function initControls() {
	const saveButton = document.getElementById('save-btn');
	const resetButton = document.getElementById('reset-btn');
	const updateChartButton = document.getElementById('update-chart-btn');
	const chartRefreshButton = document.getElementById('chart-refresh-btn');

	if (saveButton) {
		saveButton.addEventListener('click', () => {
			saveStoredData(readCurrentData());
			updateChart();
			saveButton.textContent = 'Saved';
			setTimeout(() => {
				saveButton.textContent = 'Save Data';
			}, 1200);
		});
	}

	if (resetButton) {
		resetButton.addEventListener('click', () => {
			const defaults = getDefaultData();
			renderInputs(defaults);
			saveStoredData(defaults);
			updateChart();
		});
	}

	if (updateChartButton) {
		updateChartButton.addEventListener('click', () => {
			updateChart();
		});
	}

	if (chartRefreshButton) {
		chartRefreshButton.addEventListener('click', () => {
			updateChart();
		});
	}

	const downloadChartButton = document.getElementById('chart-download-btn');
	if (downloadChartButton) {
		downloadChartButton.addEventListener('click', () => {
			if (!chartInstance) return;
			try {
				// Ensure chart uses latest data and layout
				chartInstance.update();
				// Use Chart.js helper to get a PNG data URL
				const url = chartInstance.toBase64Image();
				// Create a temporary anchor to trigger download
				const a = document.createElement('a');
				a.href = url;
				a.download = 'bucks2bar-chart.png';
				document.body.appendChild(a);
				a.click();
				a.remove();
			} catch (err) {
				console.error('Chart download failed:', err);
				// Fallback: try to use canvas directly
				try {
					const canvas = document.getElementById('income-expense-chart');
					const url2 = canvas.toDataURL('image/png');
					const a2 = document.createElement('a');
					a2.href = url2;
					a2.download = 'bucks2bar-chart.png';
					document.body.appendChild(a2);
					a2.click();
					a2.remove();
				} catch (err2) {
					console.error('Fallback chart download failed:', err2);
				}
			}
		});
	}
}

function initApp() {
	buildTableRows();
	const storedData = loadStoredData();
	renderInputs(storedData);
	attachInputListeners();
	createChart();
	updateChart();
	initControls();
	initManualTabs();

	// Tab visibility and focus/resize are handled by our manual tab controller
}

// Fallback/manual tab handling to ensure only the selected pane is visible
function initManualTabs() {
	// Select the buttons using our `data-target` attribute.
	const tabButtons = document.querySelectorAll('[data-target]');
	const panes = document.querySelectorAll('.tab-pane');

	function deactivateAll() {
		tabButtons.forEach((btn) => btn.classList.remove('active'));
		tabButtons.forEach((btn) => btn.setAttribute('aria-selected', 'false'));
		panes.forEach((p) => p.classList.remove('show', 'active'));
	}

	tabButtons.forEach((btn) => {
		btn.addEventListener('click', (e) => {
			const targetSelector = btn.getAttribute('data-target');
			if (!targetSelector) return;
			const target = document.querySelector(targetSelector);
			if (!target) return;

			e.preventDefault();
			deactivateAll();
			btn.classList.add('active');
			btn.setAttribute('aria-selected', 'true');
			target.classList.add('show', 'active');

			// If we activated the chart pane, trigger chart resize/update
			if (target.id === 'tab-chart' && chartInstance) {
				try {
					chartInstance.resize();
					chartInstance.update();
				} catch (err) {
					console.warn('Chart refresh error:', err);
				}
			}

			// If we activated the data pane, focus the first input
			if (target.id === 'tab-data') {
				const firstInput = document.querySelector('.month-input');
				if (firstInput) firstInput.focus();
			}
		});
	});
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initApp);
} else {
	// If the script is loaded after DOMContentLoaded (script at end of body),
	// call initApp immediately so the app initializes correctly.
	initApp();
}
