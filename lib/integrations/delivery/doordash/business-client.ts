import { getDoorDashConfig, type DoorDashConfig } from "./config";
import type {
  DoorDashStoreListResponse,
  DoorDashStoreRecord,
  DoorDashStoreUpsertInput,
} from "./business-types";
import { doordashRequest, doordashRequestOptional } from "./request";

export class DoorDashBusinessClient {
  constructor(private readonly config: DoorDashConfig) {}

  async getStore(externalStoreId: string): Promise<DoorDashStoreRecord | null> {
    return doordashRequestOptional<DoorDashStoreRecord>(
      this.config,
      `/developer/v1/businesses/${encodeURIComponent(this.config.externalBusinessId)}/stores/${encodeURIComponent(externalStoreId)}`,
      { method: "GET" },
    );
  }

  async listStores(): Promise<DoorDashStoreRecord[]> {
    const response = await doordashRequest<DoorDashStoreListResponse | DoorDashStoreRecord[]>(
      this.config,
      `/developer/v1/businesses/${encodeURIComponent(this.config.externalBusinessId)}/stores`,
      { method: "GET" },
    );

    if (Array.isArray(response)) {
      return response;
    }

    return response.result ?? response.stores ?? [];
  }

  async createStore(input: DoorDashStoreUpsertInput): Promise<DoorDashStoreRecord> {
    return doordashRequest<DoorDashStoreRecord>(
      this.config,
      `/developer/v1/businesses/${encodeURIComponent(this.config.externalBusinessId)}/stores`,
      {
        method: "POST",
        body: {
          external_store_id: input.externalStoreId,
          name: input.name,
          phone_number: input.phoneNumber,
          address: input.address,
        },
      },
    );
  }

  async updateStore(
    externalStoreId: string,
    input: Omit<DoorDashStoreUpsertInput, "externalStoreId">,
  ): Promise<DoorDashStoreRecord> {
    return doordashRequest<DoorDashStoreRecord>(
      this.config,
      `/developer/v1/businesses/${encodeURIComponent(this.config.externalBusinessId)}/stores/${encodeURIComponent(externalStoreId)}`,
      {
        method: "PATCH",
        body: {
          name: input.name,
          phone_number: input.phoneNumber,
          address: input.address,
        },
      },
    );
  }

  /** Create the store or refresh name/phone/address if it already exists. */
  async upsertStore(input: DoorDashStoreUpsertInput): Promise<{
    action: "created" | "updated";
    store: DoorDashStoreRecord;
  }> {
    const existing = await this.getStore(input.externalStoreId);

    if (existing) {
      const store = await this.updateStore(input.externalStoreId, {
        name: input.name,
        phoneNumber: input.phoneNumber,
        address: input.address,
      });
      return { action: "updated", store };
    }

    const store = await this.createStore(input);
    return { action: "created", store };
  }
}

export function createDoorDashBusinessClient(): DoorDashBusinessClient {
  return new DoorDashBusinessClient(getDoorDashConfig());
}
