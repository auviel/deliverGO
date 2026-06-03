import type { NormalizedAddress } from "@/lib/domain/address/types";

/** Format a normalized address as Uber's JSON address string (Canada). */
export function formatUberAddressJson(address: NormalizedAddress): string {
  return JSON.stringify({
    street_address: [address.line1, address.line2 ?? ""].filter(Boolean),
    city: address.city,
    state: address.province,
    zip_code: address.postalCode,
    country: address.country,
  });
}

/** Map Uber delivery response to provider-agnostic shape — Phase 3. */
export function mapUberDeliveryResponse(_raw: unknown): never {
  throw new Error("Not implemented — Phase 3");
}
