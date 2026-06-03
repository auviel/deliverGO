import type { NormalizedAddress } from "@/lib/domain/address/types";
import type { StoreProfile } from "@/lib/domain/store/types";

export function formatStoreProfileAddress(store: StoreProfile): string {
  const line2 = store.addressLine2 ? `, ${store.addressLine2}` : "";
  return `${store.addressLine1}${line2}, ${store.city}, ${store.province} ${store.postalCode}, ${store.country}`;
}

export function storeProfileToAddress(store: StoreProfile): NormalizedAddress {
  return {
    line1: store.addressLine1,
    line2: store.addressLine2,
    city: store.city,
    province: store.province,
    postalCode: store.postalCode,
    country: store.country,
    latitude: store.latitude,
    longitude: store.longitude,
    formatted: formatStoreProfileAddress(store),
  };
}
