import { AppError } from "@/lib/utils/errors";
import type { UberErrorResponse } from "./types";

export function mapUberApiError(status: number, body: unknown): AppError {
  const error = (body ?? {}) as UberErrorResponse;
  const code = error.code ?? "unknown";
  const message = error.message ?? "Uber Direct request failed";
  const details = error.metadata?.param_details;

  if (status === 401 || status === 403) {
    return new AppError(
      "PROVIDER_ERROR",
      "Uber Direct authentication failed. Check your API credentials.",
      502,
    );
  }

  if (code === "quote_expired" || message.toLowerCase().includes("quote")) {
    return new AppError(
      "QUOTE_EXPIRED",
      "The delivery quote has expired. Please request a new quote.",
      400,
    );
  }

  if (code === "invalid_params" || status === 400) {
    const detail = details ? ` ${details}` : "";
    return new AppError(
      "VALIDATION_ERROR",
      `Uber rejected the request:${detail || ` ${message}`}`,
      400,
    );
  }

  if (status === 404) {
    return new AppError("NOT_FOUND", "Delivery not found in Uber Direct.", 404);
  }

  return new AppError(
    "PROVIDER_ERROR",
    details ? `${message} (${details})` : message,
    status >= 500 ? 502 : 400,
  );
}
