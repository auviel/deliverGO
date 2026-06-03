import type { CancelDeliverySchema } from "@/lib/domain/delivery/validation";
import type { DeliveryProviderId } from "@/lib/domain/delivery/types";
import type { ProviderCancelRequest } from "./types";

type DomainCancelReason = CancelDeliverySchema["reason"];

const CANCEL_REASON_LABELS: Record<DomainCancelReason, string> = {
  CUSTOMER_CALLED_TO_CANCEL: "Customer called to cancel",
  OUT_OF_ITEMS: "Out of items",
  RESTAURANT_TOO_BUSY: "Store too busy",
  OTHER: "Other",
};

/** DoorDash optional reason_code values for special cancel flows. */
const DOORDASH_CANCEL_REASON_CODES: Partial<Record<DomainCancelReason, string>> = {
  OUT_OF_ITEMS: "out_of_items",
  RESTAURANT_TOO_BUSY: "store_busy",
};

export function getCancelReasonLabel(reason: DomainCancelReason): string {
  return CANCEL_REASON_LABELS[reason];
}

export function buildProviderCancelRequest(input: {
  providerId: DeliveryProviderId;
  reason: DomainCancelReason;
  details?: string;
}): ProviderCancelRequest {
  return {
    reason: input.reason,
    details: input.details,
    cancellingParty: "MERCHANT",
    providerReasonCode:
      input.providerId === "doordash_drive"
        ? DOORDASH_CANCEL_REASON_CODES[input.reason]
        : undefined,
  };
}

export function buildDoorDashCancelBody(input: ProviderCancelRequest): Record<string, unknown> {
  if (input.providerReasonCode) {
    return { reason_code: input.providerReasonCode };
  }

  return {};
}
