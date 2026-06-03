export type GeocodeConfidence = "high" | "medium" | "low";

export type GeocodeResult = {
  relevance: number;
  confidence: GeocodeConfidence;
};

/** Minimum Mapbox relevance score (0–1) required to accept an address. */
export const MIN_GEOCODE_RELEVANCE = 0.7;

export function getGeocodeConfidence(relevance: number): GeocodeConfidence {
  if (relevance >= 0.85) {
    return "high";
  }
  if (relevance >= MIN_GEOCODE_RELEVANCE) {
    return "medium";
  }
  return "low";
}

export function isGeocodeConfidenceAcceptable(relevance: number): boolean {
  return relevance >= MIN_GEOCODE_RELEVANCE;
}
