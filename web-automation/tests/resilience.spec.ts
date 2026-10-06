import { test, expect } from '../fixtures';
import users from '../test-data/users.json';
import products from '../test-data/products.json';

test.describe('Resilience and error handling (network mocking)', () => {
  test('slow API/asset response: app still loads', async ({ page, loginPage }) => {
    await page.route('**/static/js/*.js', async (route) => {
      await new Promise((r) => setTimeout(r, 2_000)); // simulate slow server
      await route.continue();
    });
    await loginPage.goto();
    await expect(loginPage.loginButton).toBeVisible({ timeout: 15_000 });
  });

  test('image requests fail: shopping still works', async ({ page, loginPage, inventoryPage }) => {
    await page.route(/\.(jpg|jpeg|png)$/, (route) => route.abort());
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.expectLoaded();
    await inventoryPage.addToCart(products.backpack.name);
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  // BUG-003: when the server returns 500 the user sees a blank page with no message.
  // test.fail() = we EXPECT this assertion to fail until the bug is fixed.
  test('server failure (500) should show a friendly error message', async ({ page, loginPage }) => {
    test.fail(true, 'BUG-003: no error state when the app bundle fails to load');
    await page.route('**/static/js/*.js', (route) =>
      route.fulfill({ status: 500, contentType: 'text/plain', body: 'Internal Server Error' }),
    );
    await page.goto('/');
    await expect(page.getByText(/something went wrong|try again|error/i)).toBeVisible({ timeout: 3_000 });
    await expect(loginPage.loginButton).toBeHidden();
  });

  test.fixme('empty product list shows an empty state', async () => {
    // SauceDemo has no products API we can intercept. With a self-hosted store you would use
    // page.route('**/api/products', r => r.fulfill({ json: [] })) and assert an empty-state message.
  });

  const badInputs = [
    { label: 'SQL injection text', value: "' OR '1'='1" },
    { label: 'script tag', value: '<script>alert(1)</script>' },
    { label: 'very long string', value: 'a'.repeat(5_000) },
    { label: 'only spaces', value: '     ' },
  ];

  for (const input of badInputs) {
    test(`invalid input is rejected: ${input.label}`, async ({ loginPage, page }) => {
      await loginPage.goto();
      await loginPage.login(input.value, input.value);
      await loginPage.expectError('Username and password do not match');
      await expect(page).not.toHaveURL(/inventory/);
    });
  }
});
