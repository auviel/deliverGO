import { describe, expect, it } from "vitest";
import {
  getMaxScheduledPickupAt,
  getMinScheduledPickupAt,
  validateScheduledPickupAt,
} from "@/lib/domain/delivery/schedule";

describe("delivery schedule validation", () => {
  const now = new Date("2026-06-03T12:00:00.000Z");

  it("requires pickup at least 15 minutes ahead", () => {
    const tooSoon = new Date(now.getTime() + 5 * 60_000);
    expect(validateScheduledPickupAt(tooSoon, now)).toMatch(/15 minutes/);
  });

  it("rejects pickup more than 30 days ahead", () => {
    const tooLate = new Date(now.getTime() + 31 * 24 * 60 * 60_000);
    expect(validateScheduledPickupAt(tooLate, now)).toMatch(/30 days/);
  });

  it("accepts pickup within the allowed window", () => {
    const valid = new Date(now.getTime() + 60 * 60_000);
    expect(validateScheduledPickupAt(valid, now)).toBeNull();
  });

  it("computes min and max bounds from now", () => {
    expect(getMinScheduledPickupAt(now).getTime()).toBe(now.getTime() + 15 * 60_000);
    expect(getMaxScheduledPickupAt(now).getTime()).toBe(
      now.getTime() + 30 * 24 * 60 * 60_000,
    );
  });
});
