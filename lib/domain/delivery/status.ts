import type { DeliveryStatus } from "./types";

/** Map Uber webhook/API status strings to domain status. Implemented in Phase 3. */
export function mapProviderStatusToDomain(
  providerStatus: string,
): DeliveryStatus {
  const normalized = providerStatus.toUpperCase().replace(/-/g, "_");

  const map: Record<string, DeliveryStatus> = {
    PENDING: "pending",
    SCHEDULED: "scheduled",
    EN_ROUTE_TO_PICKUP: "en_route_to_pickup",
    ARRIVED_AT_PICKUP: "arrived_at_pickup",
    EN_ROUTE_TO_DROPOFF: "en_route_to_dropoff",
    ARRIVED_AT_DROPOFF: "arrived_at_dropoff",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
    FAILED: "failed",
  };

  return map[normalized] ?? "pending";
}

export function isTerminalStatus(status: DeliveryStatus): boolean {
  return status === "completed" || status === "cancelled" || status === "failed";
}

export function isCancellable(status: DeliveryStatus): boolean {
  return !isTerminalStatus(status) && status !== "arrived_at_dropoff";
}
