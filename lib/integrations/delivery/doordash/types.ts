export type DoorDashQuoteResponse = {
  external_delivery_id: string;
  fee?: number;
  currency?: string;
  pickup_time_estimated?: string;
  dropoff_time_estimated?: string;
  pickup_time?: string;
  dropoff_time?: string;
  delivery_status?: string;
};

export type DoorDashDeliveryResponse = {
  external_delivery_id: string;
  delivery_id?: number;
  delivery_status?: string;
  fee?: number;
  currency?: string;
  tracking_url?: string;
  pickup_time_estimated?: string;
  dropoff_time_estimated?: string;
  dasher_name?: string;
  dasher_phone_number?: string;
  dropoff_verification_image_url?: string;
  dropoff_signature_image_url?: string;
  dropoff_contact_name?: string;
};

export type DoorDashErrorResponse = {
  code?: string;
  message?: string;
  field_errors?: Array<{ field?: string; error?: string }>;
};

export type DoorDashWebhookPayload = {
  event_type?: string;
  event_id?: string;
  external_delivery_id?: string;
  delivery_id?: number;
  delivery_status?: string;
  created_at?: string;
};

export type DoorDashServiceabilityResponse = {
  is_serviceable?: boolean;
  reasons_not_serviceable?: string[];
};

export const DOORDASH_QUOTE_TTL_MS = 5 * 60 * 1000;

export const DOORDASH_WEBHOOK_EVENTS = new Set([
  "delivery_created",
  "DELIVERY_CREATED",
  "dasher_confirmed",
  "DASHER_CONFIRMED",
  "dasher_enroute_to_pickup",
  "DASHER_ENROUTE_TO_PICKUP",
  "dasher_at_pickup",
  "DASHER_AT_PICKUP",
  "dasher_picked_up",
  "DASHER_PICKED_UP",
  "dasher_enroute_to_dropoff",
  "DASHER_ENROUTE_TO_DROPOFF",
  "dasher_at_dropoff",
  "DASHER_AT_DROPOFF",
  "dasher_dropped_off",
  "DASHER_DROPPED_OFF",
  "delivery_cancelled",
  "DELIVERY_CANCELLED",
  "delivery_attempted",
  "DELIVERY_ATTEMPTED",
]);
