import { Page, Locator, expect } from '@playwright/test';
import { slugify, priceToNumber } from '../utils/helpers';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage {
  readonly title: Locator;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly images: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly sortDropdown: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.images = page.locator('.inventory_item_img img');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.sortDropdown = page.getByTestId('product-sort-container');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.getByTestId('logout-sidebar-link');
  }

  async expectLoaded() {
    await expect(this.title).toHaveText('Products');
  }

  async names(): Promise<string[]> {
    return this.itemNames.allTextContents();
  }

  async prices(): Promise<number[]> {
    return (await this.itemPrices.allTextContents()).map(priceToNumber);
  }

  /** Client-side "search": SauceDemo has no search box, so we filter by name. */
  async namesMatching(term: string): Promise<string[]> {
    return (await this.names()).filter((n) => n.toLowerCase().includes(term.toLowerCase()));
  }

  async sortBy(option: SortOption) {
    await this.sortDropdown.selectOption(option);
  }

  async addToCart(productName: string) {
    await this.page.getByTestId(`add-to-cart-${slugify(productName)}`).click();
  }

  async removeFromCart(productName: string) {
    await this.page.getByTestId(`remove-${slugify(productName)}`).click();
  }

  async openProduct(productName: string) {
    await this.itemNames.filter({ hasText: productName }).click();
  }

  async openCart() {
    await this.cartLink.click();
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }
}
