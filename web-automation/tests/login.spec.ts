import { test, expect } from '../fixtures';
import users from '../test-data/users.json';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('valid login opens the products page @smoke', async ({ loginPage, inventoryPage, page }) => {
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.expectLoaded();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('invalid password shows an error', async ({ loginPage, page }) => {
    await loginPage.login(users.wrongPassword.username, users.wrongPassword.password);
    await loginPage.expectError('Username and password do not match');
    await expect(page).not.toHaveURL(/inventory/);
  });

  test('unknown user shows an error', async ({ loginPage }) => {
    await loginPage.login(users.unknown.username, users.unknown.password);
    await loginPage.expectError('Username and password do not match');
  });

  test('locked out user cannot log in', async ({ loginPage }) => {
    await loginPage.login(users.locked.username, users.locked.password);
    await loginPage.expectError('this user has been locked out');
  });

  test('empty username is rejected', async ({ loginPage }) => {
    await loginPage.login('', 'secret_sauce');
    await loginPage.expectError('Username is required');
  });

  test('empty password is rejected', async ({ loginPage }) => {
    await loginPage.login('standard_user', '');
    await loginPage.expectError('Password is required');
  });
});
