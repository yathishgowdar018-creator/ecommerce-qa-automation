/** "Sauce Labs Backpack" -> "sauce-labs-backpack" (used in SauceDemo data-test ids) */
export function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}

/** "$29.99" -> 29.99 */
export function priceToNumber(price: string): number {
  return parseFloat(price.replace('$', ''));
}
