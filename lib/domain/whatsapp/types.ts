import type { DeliveryProviderId } from "@/lib/domain/delivery/types";

export type WhatsAppConversationState =
  | "idle"
  | "awaiting_confirm"
  | "awaiting_customer_pick"
  | "awaiting_address_pick"
  | "awaiting_provider_pick"
  | "awaiting_new_name"
  | "awaiting_new_phone"
  | "awaiting_new_address";

export type WhatsAppAddressOption = {
  id: string;
  formatted: string;
};

export type WhatsAppCustomerOption = {
  id: string;
  name: string;
  phone: string;
  address: string;
};

export type WhatsAppProviderOption = {
  providerId: DeliveryProviderId;
  quoteId: string;
  feeCents: number;
  currency: string;
  dropoffEta?: string;
  label: string;
};

export type WhatsAppSessionPayload = {
  customerId?: string;
  customerName?: string;
  dropoffPhone?: string;
  dropoffAddress?: string;
  customerOptions?: WhatsAppCustomerOption[];
  addressOptions?: WhatsAppAddressOption[];
  quoteId?: string;
  providerId?: DeliveryProviderId;
  feeCents?: number;
  currency?: string;
  dropoffEta?: string;
  providerOptions?: WhatsAppProviderOption[];
  pendingNewName?: string;
  pendingNewPhone?: string;
};

export const WHATSAPP_CONVERSATION_TTL_MS = 30 * 60 * 1000;

export function formatFee(feeCents: number, currency: string): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(feeCents / 100);
}

export function formatEta(iso?: string): string | null {
  if (!iso) {
    return null;
  }

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleTimeString("en-CA", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export type WhatsAppConversationStateValue = WhatsAppConversationState;
