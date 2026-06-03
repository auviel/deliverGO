import { describe, expect, it } from "vitest";
import {
  getRecommendedQuote,
  isRecommendedQuote,
  sortQuotesForDisplay,
} from "@/lib/domain/delivery/compare-quotes";
import type { DeliveryQuote } from "@/lib/domain/delivery/types";

const uberQuote: DeliveryQuote = {
  providerId: "uber_direct",
  id: "uber-1",
  feeCents: 1200,
  currency: "CAD",
  expiresAt: new Date("2026-06-03T12:00:00.000Z"),
  dropoffEta: new Date("2026-06-03T12:30:00.000Z"),
};

const doorDashQuote: DeliveryQuote = {
  providerId: "doordash_drive",
  id: "dd-1",
  feeCents: 900,
  currency: "CAD",
  expiresAt: new Date("2026-06-03T12:05:00.000Z"),
  dropoffEta: new Date("2026-06-03T12:40:00.000Z"),
};

describe("sortQuotesForDisplay", () => {
  it("sorts by lowest fee first", () => {
    const sorted = sortQuotesForDisplay([uberQuote, doorDashQuote]);
    expect(sorted[0]?.providerId).toBe("doordash_drive");
  });

  it("uses ETA as tiebreaker when fees match", () => {
    const tiedUber = { ...uberQuote, feeCents: 900 };
    const tiedDoorDash = {
      ...doorDashQuote,
      feeCents: 900,
      dropoffEta: new Date("2026-06-03T13:00:00.000Z"),
    };

    const sorted = sortQuotesForDisplay([tiedDoorDash, tiedUber]);
    expect(sorted[0]?.providerId).toBe("uber_direct");
  });
});

describe("getRecommendedQuote", () => {
  it("returns the cheapest quote when multiple exist", () => {
    expect(getRecommendedQuote([uberQuote, doorDashQuote])?.providerId).toBe(
      "doordash_drive",
    );
  });

  it("does not mark a single quote as recommended", () => {
    expect(isRecommendedQuote(uberQuote, [uberQuote])).toBe(false);
  });
});
