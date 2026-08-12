export function getNumericPrice(price) {
  if (!price && price !== 0) return 0;
  if (typeof price === 'number') return price;
  if (typeof price !== 'string') return 0;
  const num = parseFloat(price.replace(/[₹,\s]/g, ''));
  const lower = price.toLowerCase();
  if (lower.includes('l') || lower.includes('lakh')) return num * 100000;
  if (lower.includes('cr') || lower.includes('crore')) return num * 10000000;
  if (lower.includes('k') || lower.includes('thousand')) return num * 1000;
  return num;
}
