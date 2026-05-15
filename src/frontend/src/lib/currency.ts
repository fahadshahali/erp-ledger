/**
 * Format a number (or bigint) as Indian Rupees with ₹ symbol.
 * Indian numbering: last 3 digits, then groups of 2.
 * e.g., 1200000 → ₹12,00,000
 */
export function formatCurrency(value: bigint | number): string {
  const num = typeof value === "bigint" ? Number(value) : value;

  // Indian number formatting
  const absNum = Math.abs(num);
  const str = absNum.toFixed(0);

  if (str.length <= 3) {
    return `₹${num < 0 ? "-" : ""}${str}`;
  }

  const lastThree = str.slice(-3);
  const rest = str.slice(0, str.length - 3);
  const formatted = `${rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${lastThree}`;

  return `₹${num < 0 ? "-" : ""}${formatted}`;
}

/**
 * Format currency compact (e.g., ₹12L, ₹1.2Cr)
 */
export function formatCurrencyCompact(value: bigint | number): string {
  const num = typeof value === "bigint" ? Number(value) : value;
  if (num >= 10_000_000) return `₹${(num / 10_000_000).toFixed(2)}Cr`;
  if (num >= 100_000) return `₹${(num / 100_000).toFixed(2)}L`;
  return formatCurrency(num);
}

/**
 * Parse a string to bigint (paise = 0, rupees only)
 */
export function parseCurrency(value: string): bigint {
  const cleaned = value.replace(/[₹,\s]/g, "");
  const num = Number.parseFloat(cleaned);
  if (Number.isNaN(num)) return 0n;
  return BigInt(Math.round(num));
}
