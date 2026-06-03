import type { DeliveryQuote } from "./types";

/** Sort quotes for display: lowest fee first, then earliest dropoff ETA. */
export function sortQuotesForDisplay(quotes: DeliveryQuote[]): DeliveryQuote[] {
  return [...quotes].sort((left, right) => {
    if (left.feeCents !== right.feeCents) {
      return left.feeCents - right.feeCents;
    }

    const leftEta = left.dropoffEta?.getTime() ?? Number.POSITIVE_INFINITY;
    const rightEta = right.dropoffEta?.getTime() ?? Number.POSITIVE_INFINITY;
    return leftEta - rightEta;
  });
}

/** Cheapest quote when multiple providers succeeded; sole quote when only one. */
export function getRecommendedQuote(quotes: DeliveryQuote[]): DeliveryQuote | null {
  if (quotes.length === 0) {
    return null;
  }

  return sortQuotesForDisplay(quotes)[0] ?? null;
}

export function isRecommendedQuote(
  quote: DeliveryQuote,
  quotes: DeliveryQuote[],
): boolean {
  if (quotes.length <= 1) {
    return false;
  }

  const recommended = getRecommendedQuote(quotes);
  return recommended?.providerId === quote.providerId;
}
