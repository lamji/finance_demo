import { Debt } from "@/services/query/usegetUser";

/**
 * Formats a number as Philippine Peso currency
 * @param amount - The amount to format
 * @param includeSymbol - Whether to include the ₱ symbol (default: true)
 * @returns Formatted currency string (e.g., "₱1,234.56")
 */
export const formatPHPCurrency = (
  amount: number | string | undefined | null,
  includeSymbol: boolean = true,
): string => {
  // Handle null, undefined, or empty values
  if (amount === null || amount === undefined || amount === "") {
    return includeSymbol ? "₱0.00" : "0.00";
  }

  // Convert string to number if needed
  const numericAmount =
    typeof amount === "string"
      ? parseFloat(amount.replace(/[^\d.-]/g, ""))
      : amount;

  // Handle NaN and invalid numbers
  if (isNaN(numericAmount)) {
    return includeSymbol ? "₱0.00" : "0.00";
  }

  // Format with 2 decimal places and comma separators
  const formatted = Math.abs(numericAmount).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Add negative sign if needed
  const result = numericAmount < 0 ? `-${formatted}` : formatted;

  return includeSymbol ? `₱${result}` : result;
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

export const formatCurrencyForDisplay = (value: number | string): string => {
  if (value === undefined || value === null) return "";

  // If value is a number, convert it directly
  if (typeof value === "number") {
    return value.toLocaleString("en-PH", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }

  // Handle string values
  const cleanValue = value.replace(/[^\d.]/g, "");
  if (!cleanValue) return "";

  const numericValue = parseFloat(cleanValue);
  if (isNaN(numericValue)) return "";

  return numericValue.toLocaleString("en-PH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};


export const calculatePercentage = (debt: Debt) => {
  const total = Number(debt.totalDebt);
  const paid = Number(debt.total_paid) || 0;
  return Math.min(Math.round((paid / total) * 100), 100);
};