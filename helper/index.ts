/**
 * Formats a number as Philippine Peso currency
 * @param amount - The amount to format
 * @param includeSymbol - Whether to include the ₱ symbol (default: true)
 * @returns Formatted currency string (e.g., "₱1,234.56")
 */
export const formatPHPCurrency = (
  amount: number,
  includeSymbol: boolean = true,
): string => {
  // Handle edge cases
  if (isNaN(amount)) return includeSymbol ? "₱0.00" : "0.00";

  // Format with 2 decimal places and comma separators
  const formatted = amount.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return includeSymbol ? `₱${formatted}` : formatted;
};

/**
 * Formats a number as compact PHP currency (e.g., ₱1.2K, ₱1.5M)
 * @param amount - The amount to format
 * @param includeSymbol - Whether to include the ₱ symbol (default: true)
 * @returns Compact formatted currency string
 */
export const formatCompactPHPCurrency = (
  amount: number,
  includeSymbol: boolean = true,
): string => {
  if (isNaN(amount)) return includeSymbol ? "₱0" : "0";

  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";

  let formatted: string;

  if (absAmount >= 1_000_000_000) {
    formatted =
      (absAmount / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  } else if (absAmount >= 1_000_000) {
    formatted = (absAmount / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (absAmount >= 1_000) {
    formatted = (absAmount / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  } else {
    formatted = absAmount.toFixed(2).replace(/\.00$/, "");
  }

  const result = sign + formatted;
  return includeSymbol ? `₱${result}` : result;
};

/**
 * Parses a PHP currency string back to a number
 * @param currencyString - The currency string to parse (e.g., "₱1,234.56" or "1,234.56")
 * @returns The parsed number value
 */
export const parsePHPCurrency = (currencyString: string): number => {
  if (!currencyString) return 0;

  // Remove currency symbol and spaces
  const cleanString = currencyString.replace(/₱|\s/g, "");

  // Remove commas and parse as float
  const parsed = parseFloat(cleanString.replace(/,/g, ""));

  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Validates if a string is a valid PHP currency format
 * @param currencyString - The string to validate
 * @returns True if valid currency format
 */
export const isValidPHPCurrency = (currencyString: string): boolean => {
  if (!currencyString) return false;

  // Regex for valid PHP currency format: optional ₱, numbers with optional commas, and 2 decimal places
  const phpCurrencyRegex = /^₱?\s*\d{1,3}(,\d{3})*(\.\d{2})?$/;

  return phpCurrencyRegex.test(currencyString.trim());
};

/**
 * Formats amount for input fields (without currency symbol)
 * @param amount - The amount to format
 * @returns Formatted string for input fields
 */
export const formatCurrencyInput = (amount: number): string => {
  return formatPHPCurrency(amount, false);
};
