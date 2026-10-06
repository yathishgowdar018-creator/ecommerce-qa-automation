import { test, expect } from '../fixtures';
import users from '../test-data/users.json';
import products from '../test-data/products.json';

/**
 * These tests describe the CORRECT behaviour. They use test.fail() because the demo app's
 * "problem_user" is intentionally broken. When a test.fail() test starts passing, Playwright
 * reports it as a failure -> a signal that the bug was fixed and the annotation can be removed.
 */
test.describe('Known bugs (problem_user)', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(users.problem.username, users.problem.password);
    await inventoryPage.expectLoaded();
  });

  test('BUG-001: every product shows its own image', async ({ inventoryPage }) => {
    test.fail(true, 'BUG-001: all products show the same image for problem_user');
    const srcs = await inventoryPage.images.evaluateAll((imgs) => imgs.map((i) => (i as HTMLImageElement).src));
    expect(new Set(srcs).size).toBe(products.totalCount);
  });

  test('BUG-002: last name field accepts typed text', async ({ page, checkoutPage }) => {
    test.fail(true, 'BUG-002: last name input does not keep typed text for problem_user');
    await page.goto('/checkout-step-one.html');
    await checkoutPage.lastName.fill('Kumar');
    await expect(checkoutPage.lastName).toHaveValue('Kumar');
  });
});
