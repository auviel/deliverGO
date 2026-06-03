import { generateDeliveryExternalId } from "@/lib/utils/id";
import type {
  ProviderCancelRequest,
  ProviderCreateDeliveryRequest,
  ProviderDelivery,
  ProviderQuote,
  ProviderQuoteRequest,
} from "../types";
import { buildDoorDashCancelBody } from "../cancel-reasons";
import { getDoorDashConfig, type DoorDashConfig } from "./config";
import { mapDoorDashApiError } from "./errors";
import {
  buildDoorDashAcceptQuoteBody,
  buildDoorDashQuoteBody,
  buildDoorDashServiceabilityBody,
  mapDoorDashDeliveryResponse,
  mapDoorDashQuoteResponse,
} from "./mappers";
import type {
  DoorDashDeliveryResponse,
  DoorDashQuoteResponse,
  DoorDashServiceabilityResponse,
} from "./types";
import { doordashRequest } from "./request";

export class DoorDashDriveClient {
  constructor(private readonly config: DoorDashConfig) {}

  get isLiveMode(): boolean {
    return this.config.liveMode;
  }

  async createQuote(input: ProviderQuoteRequest): Promise<ProviderQuote> {
    await this.checkServiceability(input);

    const externalDeliveryId = generateDeliveryExternalId();
    const raw = await this.request<DoorDashQuoteResponse>("/drive/v2/quotes", {
      method: "POST",
      body: buildDoorDashQuoteBody(
        input,
        externalDeliveryId,
        this.config.externalBusinessId,
      ),
    });

    return mapDoorDashQuoteResponse(raw, externalDeliveryId);
  }

  async acceptQuote(input: ProviderCreateDeliveryRequest): Promise<ProviderDelivery> {
    const raw = await this.request<DoorDashDeliveryResponse>(
      `/drive/v2/quotes/${encodeURIComponent(input.quoteId)}/accept`,
      {
        method: "POST",
        body: buildDoorDashAcceptQuoteBody(input),
      },
    );

    return mapDoorDashDeliveryResponse(raw);
  }

  async createDelivery(input: ProviderCreateDeliveryRequest): Promise<ProviderDelivery> {
    return this.acceptQuote(input);
  }

  async getDelivery(externalDeliveryId: string): Promise<ProviderDelivery> {
    const raw = await this.request<DoorDashDeliveryResponse>(
      `/drive/v2/deliveries/${encodeURIComponent(externalDeliveryId)}`,
      { method: "GET" },
    );

    return mapDoorDashDeliveryResponse(raw);
  }

  async listDeliveries(): Promise<ProviderDelivery[]> {
    return [];
  }

  async cancelDelivery(
    externalDeliveryId: string,
    input: ProviderCancelRequest,
  ): Promise<void> {
    await this.request<unknown>(
      `/drive/v2/deliveries/${encodeURIComponent(externalDeliveryId)}/cancel`,
      {
        method: "PUT",
        body: buildDoorDashCancelBody(input),
      },
    );
  }

  async checkServiceability(input: ProviderQuoteRequest): Promise<void> {
    const raw = await this.request<DoorDashServiceabilityResponse>(
      "/drive/v2/serviceability",
      {
        method: "POST",
        body: buildDoorDashServiceabilityBody(
          input,
          this.config.externalBusinessId,
        ),
      },
    );

    if (raw.is_serviceable === false) {
      const reasons = raw.reasons_not_serviceable?.join(", ");
      throw mapDoorDashApiError(400, {
        message: reasons
          ? `DoorDash cannot deliver to this address: ${reasons}`
          : "DoorDash cannot deliver to this address.",
      });
    }
  }

  private async request<T>(
    path: string,
    options: {
      method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
      body?: Record<string, unknown>;
    },
  ): Promise<T> {
    return doordashRequest<T>(this.config, path, options);
  }
}

export function createDoorDashDriveClient(): DoorDashDriveClient {
  return new DoorDashDriveClient(getDoorDashConfig());
}
