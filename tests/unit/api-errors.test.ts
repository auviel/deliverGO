import { describe, expect, it } from "vitest";
import { z } from "zod";
import { AppError, handleApiError } from "@/lib/utils/errors";

describe("handleApiError", () => {
  it("returns consistent shape for AppError", async () => {
    const response = handleApiError(
      new AppError("NOT_FOUND", "Delivery not found", 404),
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: "Delivery not found",
      code: "NOT_FOUND",
    });
  });

  it("includes Zod field errors in details", async () => {
    const schema = z.object({ email: z.string().email() });

    try {
      schema.parse({ email: "not-an-email" });
    } catch (error) {
      const response = handleApiError(error);
      expect(response.status).toBe(400);

      const body = await response.json();
      expect(body.code).toBe("VALIDATION_ERROR");
      expect(body.error).toBe("Validation failed");
      expect(body.details).toBeDefined();
    }
  });

  it("includes optional details on AppError", async () => {
    const response = handleApiError(
      new AppError("VALIDATION_ERROR", "Invalid input", 400, { field: "quoteId" }),
    );

    await expect(response.json()).resolves.toEqual({
      error: "Invalid input",
      code: "VALIDATION_ERROR",
      details: { field: "quoteId" },
    });
  });
});
