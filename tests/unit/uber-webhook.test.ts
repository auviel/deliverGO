import { createHmac } from "crypto";
import { readFileSync } from "fs";
import { join } from "path";
import { describe, expect, it } from "vitest";
import { mapProviderStatusToDomain } from "@/lib/domain/delivery/status";
import {
  parseUberStatusChangedWebhook,
  UBER_STATUS_CHANGED_EVENT,
  verifyUberWebhookSignature,
} from "@/lib/integrations/delivery/uber/webhook";

const fixturePath = join(process.cwd(), "tests/fixtures/uber/status-changed.json");
const fixtureBody = readFileSync(fixturePath, "utf8");
const testSecret = "test-webhook-secret";

function signBody(body: string, secret: string): string {
  return createHmac("sha256", secret).update(body, "utf8").digest("hex");
}

describe("uber webhook verification", () => {
  it("verifies a valid X-Uber-Signature", () => {
    const signature = signBody(fixtureBody, testSecret);
    expect(verifyUberWebhookSignature(fixtureBody, signature, testSecret)).toBe(true);
  });

  it("rejects an invalid signature", () => {
    expect(
      verifyUberWebhookSignature(fixtureBody, "deadbeef", testSecret),
    ).toBe(false);
  });

  it("parses dapi.status_changed payloads", () => {
    const payload = parseUberStatusChangedWebhook(fixtureBody);

    expect(payload.event_type).toBe(UBER_STATUS_CHANGED_EVENT);
    expect(payload.meta.external_order_id).toBe("DG-1730000000000-abcd1234");
    expect(payload.meta.status).toBe("EN_ROUTE_TO_PICKUP");
  });

  it("maps webhook statuses to domain statuses", () => {
    expect(mapProviderStatusToDomain("EN_ROUTE_TO_PICKUP")).toBe("en_route_to_pickup");
    expect(mapProviderStatusToDomain("COMPLETED")).toBe("completed");
    expect(mapProviderStatusToDomain("FAILED")).toBe("failed");
  });
});
