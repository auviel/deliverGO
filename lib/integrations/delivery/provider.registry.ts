import type { DeliveryProviderId } from "@/lib/domain/delivery/types";
import type { StoreProfile } from "@/lib/domain/store/types";
import type { DeliveryProvider } from "./provider.interface";
import { uberDirectAdapter } from "./uber/adapter";

/** Resolve the delivery provider for a store. v1: always Uber Direct. */
export function getDeliveryProviderForStore(_store: StoreProfile): DeliveryProvider {
  return uberDirectAdapter;
}

/** Resolve provider by id — extend when adding partner carriers. */
export function getDeliveryProviderById(providerId: DeliveryProviderId): DeliveryProvider {
  switch (providerId) {
    case "uber_direct":
      return uberDirectAdapter;
    default: {
      const _exhaustive: never = providerId;
      throw new Error(`Unknown delivery provider: ${_exhaustive}`);
    }
  }
}
