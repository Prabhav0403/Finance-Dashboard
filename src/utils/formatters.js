/**
 * Format a number as currency (USD by default)
 */
export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));
}

/**
 * Format a date string to a readable format
 */
export function formatDate(dateStr, options = {}) {
  const date = new Date(dateStr);
  const defaultOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', { ...defaultOptions, ...options });
}

/**
 * Format a date string to a short format (e.g., "Apr 30")
 */
export function formatDateShort(dateStr) {
  return formatDate(dateStr, { month: 'short', day: 'numeric' });
}

/**
 * Get month name from date string
 */
export function getMonthName(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

/**
 * Format percentage
 */
export function formatPercent(value, decimals = 1) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}

/**
 * Truncate text to given length
 */
export function truncate(text, maxLength = 30) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '…';
}
