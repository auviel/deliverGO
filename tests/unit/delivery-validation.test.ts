import { describe, expect, it } from "vitest";
import { listDeliveriesQuerySchema } from "@/lib/domain/delivery/validation";

describe("listDeliveriesQuerySchema", () => {
  it("accepts valid query params", () => {
    expect(
      listDeliveriesQuerySchema.parse({
        filter: "active",
        q: "Jane",
        limit: "25",
        offset: "0",
      }),
    ).toEqual({
      filter: "active",
      q: "Jane",
      limit: 25,
      offset: 0,
    });
  });

  it("rejects limits above 100", () => {
    expect(() =>
      listDeliveriesQuerySchema.parse({ limit: "500" }),
    ).toThrow();
  });
});
