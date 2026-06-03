export type DeliveryProviderId = "uber_direct";

export type DeliveryStatus =
  | "draft"
  | "pending"
  | "scheduled"
  | "en_route_to_pickup"
  | "arrived_at_pickup"
  | "en_route_to_dropoff"
  | "arrived_at_dropoff"
  | "completed"
  | "cancelled"
  | "failed";

export type ProofOfDeliveryConfig = {
  signature: boolean;
  picture: boolean;
};

export type CreateDeliveryInput = {
  dropoffName: string;
  dropoffPhone: string;
  dropoffAddress: string;
  scheduledPickupAt?: Date;
  proofOfDelivery: ProofOfDeliveryConfig;
  idempotencyKey?: string;
};

export type DeliveryQuote = {
  id: string;
  feeCents: number;
  currency: string;
  expiresAt: Date;
  pickupDurationMinutes?: number;
  dropoffEta?: Date;
};

export type DeliveryRecord = {
  id: string;
  externalId: string;
  storeId: string;
  providerId: DeliveryProviderId;
  providerDeliveryId: string;
  status: DeliveryStatus;
  feeCents: number;
  currency: string;
  trackingUrl: string;
  liveMode: boolean;
  createdAt: Date;
};

export type DeliveryListItem = {
  id: string;
  externalId: string;
  dropoffName: string;
  dropoffAddress: string;
  status: DeliveryStatus;
  feeCents: number | null;
  currency: string;
  createdAt: Date;
  scheduledFor: Date | null;
};
