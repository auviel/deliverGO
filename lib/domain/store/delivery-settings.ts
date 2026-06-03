import type { DeliveryProviderId } from "@/lib/domain/delivery/types";
import type { StoreProfile } from "@/lib/domain/store/types";

/** DoorDash pickup store id — falls back to deliverGO Store.id when unset. */
export function getDoorDashExternalStoreId(store: StoreProfile): string {
  const override = store.doordashExternalStoreId?.trim();
  return override || store.id;
}

export function getStoreEnabledProviderIds(store: StoreProfile): DeliveryProviderId[] {
  const providerIds: DeliveryProviderId[] = [];

  if (store.enabledUberDirect) {
    providerIds.push("uber_direct");
  }

  if (store.enabledDoorDashDrive) {
    providerIds.push("doordash_drive");
  }

  return providerIds;
}
