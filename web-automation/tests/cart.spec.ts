import { test, expect } from '../fixtures';
import products from '../test-data/products.json';

test.describe('Cart', () => {
  test('add a product to the cart @smoke', async ({ loggedIn, cartPage }) => {
    await loggedIn.addToCart(products.backpack.name);
    await expect(loggedIn.cartBadge).toHaveText('1');
    await loggedIn.openCart();
    await expect(cartPage.itemNames).toHaveText([products.backpack.name]);
  });

  test('add multiple products updates the badge', async ({ loggedIn }) => {
    await loggedIn.addToCart(products.backpack.name);
    await loggedIn.addToCart(products.bikeLight.name);
    await expect(loggedIn.cartBadge).toHaveText('2');
  });

  test('add from the product details page', async ({ loggedIn, productPage }) => {
    await loggedIn.openProduct(products.onesie.name);
    await productPage.addToCartButton.click();
    await expect(productPage.removeButton).toBeVisible();
    await expect(loggedIn.cartBadge).toHaveText('1');
  });

  test('remove a product from the cart', async ({ loggedIn, cartPage }) => {
    await loggedIn.addToCart(products.backpack.name);
    await loggedIn.openCart();
    await cartPage.remove(products.backpack.name);
    await expect(cartPage.items).toHaveCount(0);
    await expect(loggedIn.cartBadge).toBeHidden();
  });

  test('empty cart has no items and no badge', async ({ loggedIn, cartPage }) => {
    await loggedIn.openCart();
    await expect(cartPage.items).toHaveCount(0);
    await expect(loggedIn.cartBadge).toBeHidden();
  });

  test('cart keeps items after continue shopping', async ({ loggedIn, cartPage }) => {
    await loggedIn.addToCart(products.bikeLight.name);
    await loggedIn.openCart();
    await cartPage.continueShopping.click();
    await loggedIn.expectLoaded();
    await expect(loggedIn.cartBadge).toHaveText('1');
  });

  test.fixme('update quantity', async () => {
    // SauceDemo always holds quantity = 1 per product, so there is no UI to test.
    // Quantity update is covered at API level (api-automation CartApiTest).
  });
});
