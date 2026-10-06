import { test, expect } from '../fixtures';

test.describe('Checkout with an empty cart', () => {
  // Expected behaviour: the user cannot start checkout with nothing in the cart.
  // test.fail() = we EXPECT this to fail until BUG-004 is fixed.
  test('BUG-004: checkout is blocked when the cart is empty @regression', async ({ loggedIn, cartPage, page }) => {
    test.fail(true, 'BUG-004: checkout is allowed with an empty cart');
    await loggedIn.openCart();
    await expect(cartPage.items).toHaveCount(0);
    await cartPage.checkoutButton.click();
    await expect(page).toHaveURL(/cart\.html/);
  });
});
