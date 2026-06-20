export function getAvailability(quantity, threshold) {
  if (quantity === 0) {
    return { label: 'Out of stock', className: 'availability--out' };
  }
  if (quantity <= threshold) {
    return { label: 'Low stock', className: 'availability--low' };
  }
  return { label: 'In stock', className: 'availability--in' };
}
