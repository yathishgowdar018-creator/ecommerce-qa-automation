import { Page, Locator } from '@playwright/test';
import { slugify } from '../utils/helpers';

export class CartPage {
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly checkoutButton: Locator;
  readonly continueShopping: Locator;

  constructor(private readonly page: Page) {
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.checkoutButton = page.getByTestId('checkout');
    this.continueShopping = page.getByTestId('continue-shopping');
  }

  async remove(productName: string) {
    await this.page.getByTestId(`remove-${slugify(productName)}`).click();
  }
}
