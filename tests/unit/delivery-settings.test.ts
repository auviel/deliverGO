import { describe, expect, it } from "vitest";
import {
  getDoorDashExternalStoreId,
  getStoreEnabledProviderIds,
} from "@/lib/domain/store/delivery-settings";
import type { StoreProfile } from "@/lib/domain/store/types";

const store: StoreProfile = {
  id: "seed-store-waterloo",
  name: "Demo Market",
  phone: "+15195550199",
  addressLine1: "280 Lester St",
  city: "Waterloo",
  province: "ON",
  postalCode: "N2L 0G2",
  country: "CA",
  latitude: 43.478885,
  longitude: -80.524498,
  enabledUberDirect: true,
  enabledDoorDashDrive: false,
  doordashExternalStoreId: null,
};

describe("getDoorDashExternalStoreId", () => {
  it("falls back to Store.id when override is unset", () => {
    expect(getDoorDashExternalStoreId(store)).toBe("seed-store-waterloo");
  });

  it("uses the configured override when present", () => {
    expect(
      getDoorDashExternalStoreId({
        ...store,
        doordashExternalStoreId: "custom-store-id",
      }),
    ).toBe("custom-store-id");
  });
});

describe("getStoreEnabledProviderIds", () => {
  it("returns only enabled providers for the store", () => {
    expect(getStoreEnabledProviderIds(store)).toEqual(["uber_direct"]);
    expect(
      getStoreEnabledProviderIds({
        ...store,
        enabledDoorDashDrive: true,
      }),
    ).toEqual(["uber_direct", "doordash_drive"]);
  });
});
