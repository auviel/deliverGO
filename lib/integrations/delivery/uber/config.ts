import { AppError } from "@/lib/utils/errors";

export type UberDirectConfig = {
  clientId: string;
  clientSecret: string;
  customerId: string;
  apiBase: string;
  authUrl: string;
  liveMode: boolean;
};

export function getUberDirectConfig(): UberDirectConfig {
  const clientId = process.env.UBER_CLIENT_ID?.trim();
  const clientSecret = process.env.UBER_CLIENT_SECRET?.trim();
  const customerId = process.env.UBER_CUSTOMER_ID?.trim();

  if (!clientId || !clientSecret || !customerId) {
    throw new AppError(
      "PROVIDER_ERROR",
      "Uber Direct credentials are not configured. Set UBER_CLIENT_ID, UBER_CLIENT_SECRET, and UBER_CUSTOMER_ID.",
      500,
    );
  }

  return {
    clientId,
    clientSecret,
    customerId,
    apiBase: process.env.UBER_API_BASE?.trim() || "https://api.uber.com",
    authUrl: "https://auth.uber.com/oauth/v2/token",
    liveMode: process.env.UBER_LIVE_MODE === "true",
  };
}
