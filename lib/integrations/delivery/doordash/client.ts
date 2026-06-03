import { logger } from "@/lib/utils/logger";
import { generateDeliveryExternalId } from "@/lib/utils/id";
import type {
  ProviderCancelRequest,
  ProviderCreateDeliveryRequest,
  ProviderDelivery,
  ProviderQuote,
  ProviderQuoteRequest,
} from "../types";
import { createDoorDashJwt } from "./auth";
import { getDoorDashConfig, type DoorDashConfig } from "./config";
import { mapDoorDashApiError } from "./errors";
import {
  buildDoorDashAcceptQuoteBody,
  buildDoorDashQuoteBody,
  mapDoorDashDeliveryResponse,
  mapDoorDashQuoteResponse,
} from "./mappers";
import type { DoorDashDeliveryResponse, DoorDashQuoteResponse } from "./types";

export class DoorDashDriveClient {
  constructor(private readonly config: DoorDashConfig) {}

  get isLiveMode(): boolean {
    return this.config.liveMode;
  }

  async createQuote(input: ProviderQuoteRequest): Promise<ProviderQuote> {
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
    _input: ProviderCancelRequest,
  ): Promise<void> {
    await this.request<unknown>(
      `/drive/v2/deliveries/${encodeURIComponent(externalDeliveryId)}/cancel`,
      { method: "PUT" },
    );
  }

  private async request<T>(
    path: string,
    options: {
      method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
      body?: Record<string, unknown>;
    },
  ): Promise<T> {
    const token = createDoorDashJwt(this.config);
    const url = `${this.config.apiBase}${path}`;

    const response = await fetch(url, {
      method: options.method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      ...(options.body ? { body: JSON.stringify(options.body) } : {}),
    });

    const text = await response.text();
    const parsed = text ? JSON.parse(text) : {};

    if (!response.ok) {
      logger.error("doordash.api.error", {
        path,
        status: response.status,
        message: (parsed as { message?: string }).message,
      });
      throw mapDoorDashApiError(response.status, parsed);
    }

    return parsed as T;
  }
}

export function createDoorDashDriveClient(): DoorDashDriveClient {
  return new DoorDashDriveClient(getDoorDashConfig());
}
