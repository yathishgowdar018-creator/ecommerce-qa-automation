import { test, expect } from '../fixtures';

test.describe('Session, logout and unauthorized access', () => {
  test('logout returns to the login page @smoke', async ({ loggedIn, loginPage, page }) => {
    await loggedIn.logout();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(page).toHaveURL('/');
  });

  test('protected page is blocked after logout', async ({ loggedIn, loginPage, page }) => {
    await loggedIn.logout();
    await page.goto('/inventory.html');
    await loginPage.expectError(/only access .* when you are logged in/i);
  });

  test('unauthenticated user cannot open inventory', async ({ loginPage, page }) => {
    await page.goto('/inventory.html');
    await loginPage.expectError(/logged in/i);
  });

  test('unauthenticated user cannot open cart', async ({ loginPage, page }) => {
    await page.goto('/cart.html');
    await loginPage.expectError(/logged in/i);
  });

  test('unauthenticated user cannot open checkout', async ({ loginPage, page }) => {
    await page.goto('/checkout-step-one.html');
    await loginPage.expectError(/logged in/i);
  });
});
