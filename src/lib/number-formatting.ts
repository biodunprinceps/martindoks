/**
 * Number formatting utilities for mortgage calculator
 * Formats numbers with commas for display while maintaining numeric values for calculations
 */

/**
 * Format a number string with commas (e.g., 1000000 -> "1,000,000")
 */
export function formatNumberWithCommas(value: string | number): string {
  if (!value && value !== 0) return '';
  
  // Remove any existing commas and non-numeric characters except decimal point
  const cleaned = String(value).replace(/[^\d.]/g, '');
  
  if (!cleaned) return '';
  
  // Split by decimal point if present
  const parts = cleaned.split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1];
  
  // Format integer part with commas
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  // Combine with decimal part if present
  return decimalPart !== undefined ? `${formattedInteger}.${decimalPart}` : formattedInteger;
}

/**
 * Remove formatting and return numeric string (e.g., "1,000,000" -> "1000000")
 */
export function removeNumberFormatting(value: string): string {
  if (!value) return '';
  return value.replace(/,/g, '');
}

/**
 * Parse a formatted number string to a number
 */
export function parseFormattedNumber(value: string): number {
  const cleaned = removeNumberFormatting(value);
  return parseFloat(cleaned) || 0;
}

/**
 * Handle input change with automatic formatting
 * Returns the formatted value for display
 */
export function handleNumberInputChange(
  value: string,
  setValue: (value: string) => void
): void {
  // Remove all non-numeric characters except decimal point
  const cleaned = value.replace(/[^\d.]/g, '');
  
  // Prevent multiple decimal points
  const parts = cleaned.split('.');
  const formatted = parts.length > 2 
    ? parts[0] + '.' + parts.slice(1).join('')
    : cleaned;
  
  // Format with commas
  const formattedValue = formatNumberWithCommas(formatted);
  setValue(formattedValue);
}

