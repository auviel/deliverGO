import { describe, expect, it } from "vitest";
import { createDoorDashJwt } from "@/lib/integrations/delivery/doordash/auth";
import {
  mapDoorDashQuoteResponse,
  mapDoorDashStatusToDomain,
} from "@/lib/integrations/delivery/doordash/mappers";

describe("createDoorDashJwt", () => {
  it("creates a three-part JWT", () => {
    const token = createDoorDashJwt({
      developerId: "developer-id",
      keyId: "key-id",
      signingSecret: Buffer.from("secret").toString("base64"),
      externalBusinessId: "business-id",
      apiBase: "https://openapi.doordash.com",
      liveMode: false,
    });

    expect(token.split(".")).toHaveLength(3);
  });
});

describe("mapDoorDashStatusToDomain", () => {
  it("maps delivered to completed", () => {
    expect(mapDoorDashStatusToDomain("delivered")).toBe("completed");
  });

  it("maps dasher_confirmed to en_route_to_pickup", () => {
    expect(mapDoorDashStatusToDomain("dasher_confirmed")).toBe("en_route_to_pickup");
  });
});

describe("mapDoorDashQuoteResponse", () => {
  it("uses the external delivery id as quote id", () => {
    const quote = mapDoorDashQuoteResponse(
      {
        external_delivery_id: "DG-123",
        fee: 999,
        currency: "CAD",
        dropoff_time_estimated: "2026-06-03T12:30:00.000Z",
      },
      "DG-123",
    );

    expect(quote.id).toBe("DG-123");
    expect(quote.feeCents).toBe(999);
  });
});
