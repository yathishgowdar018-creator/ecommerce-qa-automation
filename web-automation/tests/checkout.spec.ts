import { test, expect } from '../fixtures';
import products from '../test-data/products.json';
import checkout from '../test-data/checkout.json';

test.describe('Checkout', () => {
  test.beforeEach(async ({ loggedIn, cartPage }) => {
    await loggedIn.addToCart(products.backpack.name);
    await loggedIn.openCart();
    await cartPage.checkoutButton.click();
  });

  test('complete checkout end to end @smoke', async ({ checkoutPage, page }) => {
    await checkoutPage.fillInfo(checkout.valid);
    await checkoutPage.continueButton.click();
    await expect(checkoutPage.subtotal).toContainText(products.backpack.price);
    await checkoutPage.finishButton.click();
    await checkoutPage.expectOrderComplete();
    await expect(page).toHaveURL(/checkout-complete/);
  });

  test('order total = item total + tax', async ({ checkoutPage }) => {
    await checkoutPage.fillInfo(checkout.valid);
    await checkoutPage.continueButton.click();
    const num = async (l: typeof checkoutPage.total) => parseFloat((await l.innerText()).split('$')[1]);
    const subtotal = await num(checkoutPage.subtotal);
    const tax = await num(checkoutPage.tax);
    const total = await num(checkoutPage.total);
    expect(total).toBeCloseTo(subtotal + tax, 2);
  });

  test('first name is required', async ({ checkoutPage }) => {
    await checkoutPage.fillInfo({ lastName: 'Kumar', postalCode: '600001' });
    await checkoutPage.continueButton.click();
    await expect(checkoutPage.error).toContainText('First Name is required');
  });

  test('last name is required', async ({ checkoutPage }) => {
    await checkoutPage.fillInfo({ firstName: 'Asha', postalCode: '600001' });
    await checkoutPage.continueButton.click();
    await expect(checkoutPage.error).toContainText('Last Name is required');
  });

  test('postal code is required', async ({ checkoutPage }) => {
    await checkoutPage.fillInfo({ firstName: 'Asha', lastName: 'Kumar' });
    await checkoutPage.continueButton.click();
    await expect(checkoutPage.error).toContainText('Postal Code is required');
  });

  test('cancel returns to the cart', async ({ checkoutPage, page }) => {
    await checkoutPage.cancelButton.click();
    await expect(page).toHaveURL(/cart\.html/);
  });
});
