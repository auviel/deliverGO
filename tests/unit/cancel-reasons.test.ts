import { describe, expect, it } from "vitest";
import {
  buildDoorDashCancelBody,
  buildProviderCancelRequest,
} from "@/lib/integrations/delivery/cancel-reasons";

describe("buildProviderCancelRequest", () => {
  it("maps DoorDash-specific reason codes when supported", () => {
    const request = buildProviderCancelRequest({
      providerId: "doordash_drive",
      reason: "OUT_OF_ITEMS",
    });

    expect(request.providerReasonCode).toBe("out_of_items");
  });

  it("does not set provider reason codes for Uber", () => {
    const request = buildProviderCancelRequest({
      providerId: "uber_direct",
      reason: "OUT_OF_ITEMS",
    });

    expect(request.providerReasonCode).toBeUndefined();
  });
});

describe("buildDoorDashCancelBody", () => {
  it("returns an empty body for standard merchant cancels", () => {
    expect(
      buildDoorDashCancelBody(
        buildProviderCancelRequest({
          providerId: "doordash_drive",
          reason: "CUSTOMER_CALLED_TO_CANCEL",
        }),
      ),
    ).toEqual({});
  });
});
