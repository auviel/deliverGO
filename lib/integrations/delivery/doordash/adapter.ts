import type { DeliveryProvider } from "../provider.interface";
import type {
  ProviderCancelRequest,
  ProviderCreateDeliveryRequest,
  ProviderDelivery,
  ProviderQuote,
  ProviderQuoteRequest,
  ProviderWebhookEvent,
} from "../types";
import { createDoorDashDriveClient } from "./client";
import { mapDoorDashWebhookStatus } from "./mappers";
import { DOORDASH_WEBHOOK_EVENTS, type DoorDashWebhookPayload } from "./types";
import { verifyDoorDashWebhookAuthorization } from "./webhook";

function getClient() {
  return createDoorDashDriveClient();
}

export const doorDashDriveAdapter: DeliveryProvider = {
  id: "doordash_drive",

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

  async listDeliveries(): Promise<ProviderDelivery[]> {
    return getClient().listDeliveries();
  },

  async cancelDelivery(
    externalId: string,
    input: ProviderCancelRequest,
  ): Promise<void> {
    await getClient().cancelDelivery(externalId, input);
  },

  async parseWebhook(
    raw: unknown,
    headers: Headers,
  ): Promise<ProviderWebhookEvent | null> {
    if (typeof raw !== "string") {
      throw new Error("DoorDash webhook body must be a raw string.");
    }

    if (!verifyDoorDashWebhookAuthorization(headers)) {
      throw new Error("Invalid DoorDash webhook authorization.");
    }

    const payload = JSON.parse(raw) as DoorDashWebhookPayload;
    const eventType = payload.event_type;

    if (!eventType || !DOORDASH_WEBHOOK_EVENTS.has(eventType)) {
      return null;
    }

    const status = mapDoorDashWebhookStatus(eventType, payload.delivery_status);

    return {
      eventId:
        payload.event_id ??
        `${eventType}:${payload.external_delivery_id ?? "unknown"}:${payload.created_at ?? Date.now()}`,
      providerOrderId: payload.delivery_id
        ? String(payload.delivery_id)
        : payload.external_delivery_id ?? "",
      status,
      externalOrderId: payload.external_delivery_id,
    };
  },
};
