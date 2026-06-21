const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function formatCurrency(value) {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  return formatter.format(Number(value));
}
