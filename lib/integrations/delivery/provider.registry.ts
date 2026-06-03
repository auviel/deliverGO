import type { DeliveryProviderId } from "@/lib/domain/delivery/types";
import type { StoreProfile } from "@/lib/domain/store/types";
import {
  getConfiguredDeliveryProviderIds,
  isDoorDashConfigured,
  isUberConfigured,
} from "@/lib/config/environment";
import type { DeliveryProvider } from "./provider.interface";
import { doorDashDriveAdapter } from "./doordash/adapter";
import { uberDirectAdapter } from "./uber/adapter";

const providersById: Record<DeliveryProviderId, DeliveryProvider> = {
  uber_direct: uberDirectAdapter,
  doordash_drive: doorDashDriveAdapter,
};

/** Providers configured in the environment and available for quoting. */
export function getEnabledDeliveryProviders(): DeliveryProvider[] {
  return getConfiguredDeliveryProviderIds().map(
    (providerId) => providersById[providerId],
  );
}

/** Resolve the default delivery provider for a store. Uses first configured provider. */
export function getDeliveryProviderForStore(_store: StoreProfile): DeliveryProvider {
  const enabled = getEnabledDeliveryProviders();
  if (enabled.length === 0) {
    throw new Error(
      "No delivery providers configured. Set Uber or DoorDash credentials in the environment.",
    );
  }

  return enabled[0]!;
}

export function getDeliveryProviderById(providerId: DeliveryProviderId): DeliveryProvider {
  if (providerId === "uber_direct" && !isUberConfigured()) {
    throw new Error("Uber Direct is not configured.");
  }

  if (providerId === "doordash_drive" && !isDoorDashConfigured()) {
    throw new Error("DoorDash Drive is not configured.");
  }

  return providersById[providerId];
}
