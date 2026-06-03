import type {
  ProviderCancelRequest,
  ProviderCreateDeliveryRequest,
  ProviderDelivery,
  ProviderQuote,
  ProviderQuoteRequest,
  ProviderWebhookEvent,
} from "./types";
import type { DeliveryProviderId } from "@/lib/domain/delivery/types";

export interface DeliveryProvider {
  readonly id: DeliveryProviderId;

  createQuote(input: ProviderQuoteRequest): Promise<ProviderQuote>;
  createDelivery(input: ProviderCreateDeliveryRequest): Promise<ProviderDelivery>;
  getDelivery(externalId: string): Promise<ProviderDelivery>;
  listDeliveries(options?: {
    limit?: number;
    offset?: number;
  }): Promise<ProviderDelivery[]>;
  cancelDelivery(externalId: string, input: ProviderCancelRequest): Promise<void>;
  parseWebhook(
    raw: unknown,
    headers: Headers,
  ): Promise<ProviderWebhookEvent | null>;
}
