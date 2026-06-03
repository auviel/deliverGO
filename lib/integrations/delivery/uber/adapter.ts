import type { DeliveryProvider } from "../provider.interface";
import type {
  ProviderCancelRequest,
  ProviderCreateDeliveryRequest,
  ProviderDelivery,
  ProviderQuote,
  ProviderQuoteRequest,
  ProviderWebhookEvent,
} from "../types";
import { createUberDirectClient } from "./client";

function getClient() {
  return createUberDirectClient();
}

export const uberDirectAdapter: DeliveryProvider = {
  id: "uber_direct",

  async createQuote(input: ProviderQuoteRequest): Promise<ProviderQuote> {
    return getClient().createQuote(input);
  },

  async createDelivery(
    input: ProviderCreateDeliveryRequest,
  ): Promise<ProviderDelivery> {
    return getClient().createDelivery(input);
  },

  async getDelivery(externalId: string): Promise<ProviderDelivery> {
    return getClient().getDelivery(externalId);
  },

  async listDeliveries(options?: {
    limit?: number;
    offset?: number;
  }): Promise<ProviderDelivery[]> {
    return getClient().listDeliveries(options);
  },

  async cancelDelivery(
    externalId: string,
    input: ProviderCancelRequest,
  ): Promise<void> {
    await getClient().cancelDelivery(externalId, input);
  },

  async parseWebhook(
    _raw: unknown,
    _headers: Headers,
  ): Promise<ProviderWebhookEvent | null> {
    throw new Error("Uber webhook parsing is not implemented yet (Phase 9).");
  },
};
