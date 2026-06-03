import type { DeliveryProviderId } from "./types";

/** Approximate quote accept windows shown in the UI. */
export const QUOTE_ACCEPT_WINDOW_MINUTES: Record<DeliveryProviderId, number> = {
  uber_direct: 15,
  doordash_drive: 5,
};

export function getQuoteAcceptWindowMinutes(providerId: DeliveryProviderId): number {
  return QUOTE_ACCEPT_WINDOW_MINUTES[providerId];
}

export function getQuoteAcceptWindowLabel(providerId: DeliveryProviderId): string {
  const minutes = getQuoteAcceptWindowMinutes(providerId);
  return `Accept within ${minutes} min`;
}
