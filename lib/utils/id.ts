import { randomBytes } from "crypto";

/** Human-readable reference sent to Uber as external_id. */
export function generateDeliveryExternalId(): string {
  const suffix = randomBytes(4).toString("hex");
  return `DG-${Date.now()}-${suffix}`;
}
