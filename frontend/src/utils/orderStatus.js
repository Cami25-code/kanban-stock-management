const STATUS_CLASSES = {
  Confirmed: 'order-status--confirmed',
  'Out for delivery': 'order-status--out-for-delivery',
  Delayed: 'order-status--delayed',
  Delivered: 'order-status--delivered',
  Returned: 'order-status--returned',
};

export function getOrderStatusClass(status) {
  return STATUS_CLASSES[status] || 'order-status--confirmed';
}

export function isFinalStatus(status) {
  return status === 'Delivered' || status === 'Returned';
}
