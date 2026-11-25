/** Return the cart subtotal in integer cents. Items have price and quantity. */
export function total(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
