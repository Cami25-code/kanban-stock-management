export function formatPercentChange(value) {
  if (value === null || value === undefined) {
    return { label: 'New', className: 'percent-change--neutral' };
  }

  if (value > 0) {
    return { label: `${value}% ↑`, className: 'percent-change--up' };
  }

  if (value < 0) {
    return { label: `${Math.abs(value)}% ↓`, className: 'percent-change--down' };
  }

  return { label: '0%', className: 'percent-change--neutral' };
}
