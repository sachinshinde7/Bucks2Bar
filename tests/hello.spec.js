const { test, expect } = require('@playwright/test');

test('Bucks2Bar loads and shows chart canvas', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Bucks2Bar');
  const canvas = page.locator('#income-expense-chart');
  await expect(canvas).toBeVisible();
});
const { test, expect } = require('@playwright/test');

test('hello world test', async ({ page }) => {
    await page.goto('http://localhost:3000'); // Replace with your application's URL
    const title = await page.title();
    expect(title).toBe('Expected Title'); // Replace with the expected title of your application
});