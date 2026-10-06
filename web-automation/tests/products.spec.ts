import { test, expect } from '../fixtures';
import products from '../test-data/products.json';

test.describe('Product browsing, search and details', () => {
  test('lists all products @smoke', async ({ loggedIn }) => {
    await expect(loggedIn.items).toHaveCount(products.totalCount);
  });

  test('sort by price low to high', async ({ loggedIn }) => {
    await loggedIn.sortBy('lohi');
    const prices = await loggedIn.prices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sort by name Z to A', async ({ loggedIn }) => {
    await loggedIn.sortBy('za');
    const names = await loggedIn.names();
    expect(names).toEqual([...names].sort().reverse());
  });

  // SauceDemo has no search box, so "search" = filtering the product list by name
  test('product names can be filtered by keyword', async ({ loggedIn }) => {
    const matches = await loggedIn.namesMatching('bike');
    expect(matches).toEqual([products.bikeLight.name]);
  });

  test('product details page shows name, price and description', async ({ loggedIn, productPage, page }) => {
    await loggedIn.openProduct(products.backpack.name);
    await expect(page).toHaveURL(/inventory-item\.html\?id=/);
    await expect(productPage.name).toHaveText(products.backpack.name);
    await expect(productPage.price).toHaveText(products.backpack.price);
    await expect(productPage.description).not.toBeEmpty();
  });

  test('back button returns to the product list', async ({ loggedIn, productPage }) => {
    await loggedIn.openProduct(products.onesie.name);
    await productPage.backButton.click();
    await loggedIn.expectLoaded();
  });
});
