/**
 * Exchange rates used for display purposes across the platform.
 * Update these values to reflect current market rates.
 * Last updated: April 2026
 */

/** How many Naira per 1 US Dollar */
export const USD_TO_NGN = 1_620;

/** Convert a Naira amount to approximate USD */
export function ngnToUsd(naira: number): number {
  return Math.round(naira / USD_TO_NGN);
}

/** Format a USD amount as a display string, e.g. "$43,750" */
export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
