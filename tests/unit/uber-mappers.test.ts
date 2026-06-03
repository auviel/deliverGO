import { describe, expect, it } from "vitest";
import { formatUberAddressJson, mapUberDeliveryStatus } from "@/lib/integrations/delivery/uber/mappers";
import { normalizeCanadianPhone } from "@/lib/utils/phone";

describe("normalizeCanadianPhone", () => {
  it("normalizes 10-digit numbers to E.164", () => {
    expect(normalizeCanadianPhone("4165550199")).toBe("+14165550199");
  });

  it("normalizes numbers with formatting characters", () => {
    expect(normalizeCanadianPhone("(416) 555-0199")).toBe("+14165550199");
  });

  it("accepts +1 prefixed numbers", () => {
    expect(normalizeCanadianPhone("+14165550199")).toBe("+14165550199");
  });

  it("returns null for invalid numbers", () => {
    expect(normalizeCanadianPhone("123")).toBeNull();
  });
});

describe("formatUberAddressJson", () => {
  it("formats Canadian addresses for Uber API", () => {
    const json = formatUberAddressJson({
      line1: "123 Queen Street West",
      line2: "Unit 1",
      city: "Toronto",
      province: "ON",
      postalCode: "M5H 2M9",
      country: "CA",
      latitude: 43.648809,
      longitude: -79.390984,
      formatted: "123 Queen Street West, Unit 1, Toronto, ON M5H 2M9, CA",
    });

    expect(JSON.parse(json)).toEqual({
      street_address: ["123 Queen Street West", "Unit 1"],
      city: "Toronto",
      state: "ON",
      zip_code: "M5H 2M9",
      country: "CA",
    });
  });

  it("omits empty address line 2", () => {
    const json = formatUberAddressJson({
      line1: "123 Queen Street West",
      city: "Toronto",
      province: "ON",
      postalCode: "M5H 2M9",
      country: "CA",
      latitude: 43.648809,
      longitude: -79.390984,
      formatted: "123 Queen Street West, Toronto, ON M5H 2M9, CA",
    });

    expect(JSON.parse(json).street_address).toEqual(["123 Queen Street West"]);
  });
});

describe("mapUberDeliveryStatus", () => {
  it("maps Uber API statuses to domain statuses", () => {
    expect(mapUberDeliveryStatus("pending")).toBe("pending");
    expect(mapUberDeliveryStatus("pickup")).toBe("en_route_to_pickup");
    expect(mapUberDeliveryStatus("pickup_complete")).toBe("arrived_at_pickup");
    expect(mapUberDeliveryStatus("dropoff")).toBe("en_route_to_dropoff");
    expect(mapUberDeliveryStatus("delivered")).toBe("completed");
    expect(mapUberDeliveryStatus("canceled")).toBe("cancelled");
  });

  it("maps webhook-style statuses", () => {
    expect(mapUberDeliveryStatus("EN_ROUTE_TO_PICKUP")).toBe("en_route_to_pickup");
    expect(mapUberDeliveryStatus("COMPLETED")).toBe("completed");
  });
});
