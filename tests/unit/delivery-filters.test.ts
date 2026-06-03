import { describe, expect, it } from "vitest";
import {
  parseDeliveryListFilter,
  statusesForFilter,
  shouldPollDeliveries,
} from "@/lib/domain/delivery/filters";

describe("delivery list filters", () => {
  it("parses filter values with fallback to all", () => {
    expect(parseDeliveryListFilter("active")).toBe("active");
    expect(parseDeliveryListFilter("invalid")).toBe("all");
    expect(parseDeliveryListFilter(undefined)).toBe("all");
  });

  it("maps filter tabs to status groups", () => {
    expect(statusesForFilter("scheduled")).toEqual(["scheduled"]);
    expect(statusesForFilter("completed")).toEqual(["completed"]);
    expect(statusesForFilter("cancelled")).toEqual(["cancelled", "failed"]);
    expect(statusesForFilter("active")).toContain("pending");
    expect(statusesForFilter("all")).toBeUndefined();
  });

  it("polls on all and active tabs", () => {
    expect(shouldPollDeliveries("all")).toBe(true);
    expect(shouldPollDeliveries("active")).toBe(true);
    expect(shouldPollDeliveries("completed")).toBe(false);
  });
});
