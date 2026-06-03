import type { DeliveryProvider } from "../provider.interface";
import type {
  ProviderCancelRequest,
  ProviderCreateDeliveryRequest,
  ProviderDelivery,
  ProviderQuote,
  ProviderQuoteRequest,
  ProviderWebhookEvent,
} from "../types";
import { AppError } from "@/lib/utils/errors";

/** Uber Direct adapter — HTTP implementation added in Phase 3. */
export const uberDirectAdapter: DeliveryProvider = {
  id: "uber_direct",

  async createQuote(_input: ProviderQuoteRequest): Promise<ProviderQuote> {
    throw new AppError(
      "PROVIDER_ERROR",
      "Uber Direct quote is not implemented yet (Phase 3).",
      501,
    );
  },

  async createDelivery(
    _input: ProviderCreateDeliveryRequest,
  ): Promise<ProviderDelivery> {
    throw new AppError(
      "PROVIDER_ERROR",
      "Uber Direct create delivery is not implemented yet (Phase 3).",
      501,
    );
  },

  async getDelivery(_externalId: string): Promise<ProviderDelivery> {
    throw new AppError(
      "PROVIDER_ERROR",
      "Uber Direct get delivery is not implemented yet (Phase 3).",
      501,
    );
  },

  async cancelDelivery(
    _externalId: string,
    _input: ProviderCancelRequest,
  ): Promise<void> {
    throw new AppError(
      "PROVIDER_ERROR",
      "Uber Direct cancel is not implemented yet (Phase 3).",
      501,
    );
  },

  async parseWebhook(
    _raw: unknown,
    _headers: Headers,
  ): Promise<ProviderWebhookEvent | null> {
    throw new AppError(
      "PROVIDER_ERROR",
      "Uber webhook parsing is not implemented yet (Phase 9).",
      501,
    );
  },
};
