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

export const DOORDASH_QUOTE_TTL_MS = 5 * 60 * 1000;

export const DOORDASH_WEBHOOK_EVENTS = new Set([
  "delivery_created",
  "dasher_confirmed",
  "dasher_enroute_to_pickup",
  "dasher_picked_up",
  "dasher_enroute_to_dropoff",
  "dasher_dropped_off",
  "delivery_cancelled",
  "DELIVERY_CREATED",
  "DASHER_CONFIRMED",
  "DASHER_ENROUTE_TO_PICKUP",
  "DASHER_PICKED_UP",
  "DASHER_ENROUTE_TO_DROPOFF",
  "DASHER_DROPPED_OFF",
  "DELIVERY_CANCELLED",
]);
