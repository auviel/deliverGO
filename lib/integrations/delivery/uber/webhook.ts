import { createHmac, timingSafeEqual } from "crypto";
import { z } from "zod";

const uberStatusChangedMetaSchema = z.object({
  status: z.string().min(1),
  external_order_id: z.string().optional(),
  order_id: z.string().optional(),
  courier_trip_id: z.string().optional(),
  is_returning: z.boolean().optional(),
});

export const uberStatusChangedWebhookSchema = z.object({
  event_id: z.string().min(1),
  event_type: z.string().min(1),
  event_time: z.number().optional(),
  resource_href: z.string().optional(),
  meta: uberStatusChangedMetaSchema,
});

export type UberStatusChangedWebhook = z.infer<typeof uberStatusChangedWebhookSchema>;

export const UBER_STATUS_CHANGED_EVENT = "dapi.status_changed";

/** Primary webhook signing key from dashboard, or client secret as fallback. */
export function getUberWebhookSigningSecret(): string | null {
  return (
    process.env.UBER_WEBHOOK_SIGNING_SECRET?.trim() ||
    process.env.UBER_CLIENT_SECRET?.trim() ||
    null
  );
}

/** Verify X-Uber-Signature HMAC-SHA256 of the raw request body. */
export function verifyUberWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string,
): boolean {
  if (!signatureHeader) {
    return false;
  }

  const expected = createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("hex")
    .toLowerCase();

  const received = signatureHeader.trim().toLowerCase();

  if (expected.length !== received.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(expected), Buffer.from(received));
}

export function parseUberStatusChangedWebhook(rawBody: string): UberStatusChangedWebhook {
  const json = JSON.parse(rawBody) as unknown;
  return uberStatusChangedWebhookSchema.parse(json);
}
