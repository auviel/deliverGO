export type DoorDashStoreRecord = {
  name: string;
  external_business_id: string;
  external_store_id: string;
  phone_number: string;
  address: string;
  status?: string;
  is_test?: boolean;
  created_at?: string;
  last_updated_at?: string;
};

export type DoorDashStoreListResponse = {
  result?: DoorDashStoreRecord[];
  stores?: DoorDashStoreRecord[];
  continuation_token?: string | null;
  result_count?: number;
};

export type DoorDashStoreUpsertInput = {
  externalStoreId: string;
  name: string;
  phoneNumber: string;
  address: string;
};
