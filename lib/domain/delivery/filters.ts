import type { DeliveryStatus } from "./types";

export type DeliveryListFilter =
  | "all"
  | "active"
  | "scheduled"
  | "completed"
  | "cancelled";

export const DELIVERY_LIST_FILTERS: {
  value: DeliveryListFilter;
  label: string;
}[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const ACTIVE_STATUSES: DeliveryStatus[] = [
  "draft",
  "pending",
  "scheduled",
  "en_route_to_pickup",
  "arrived_at_pickup",
  "en_route_to_dropoff",
  "arrived_at_dropoff",
];

const CANCELLED_STATUSES: DeliveryStatus[] = ["cancelled", "failed"];

export function parseDeliveryListFilter(value?: string): DeliveryListFilter {
  const match = DELIVERY_LIST_FILTERS.find((item) => item.value === value);
  return match?.value ?? "all";
}

export function statusesForFilter(
  filter: DeliveryListFilter,
): DeliveryStatus[] | undefined {
  switch (filter) {
    case "active":
      return ACTIVE_STATUSES;
    case "scheduled":
      return ["scheduled"];
    case "completed":
      return ["completed"];
    case "cancelled":
      return CANCELLED_STATUSES;
    default:
      return undefined;
  }
}

export function shouldPollDeliveries(filter: DeliveryListFilter): boolean {
  return filter === "all" || filter === "active";
}
