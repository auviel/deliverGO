import { createHmac, timingSafeEqual } from "crypto";
import { z } from "zod";

const whatsAppTextMessageSchema = z.object({
  from: z.string().min(1),
  id: z.string().min(1),
  timestamp: z.string().optional(),
  type: z.literal("text"),
  text: z.object({
    body: z.string(),
  }),
});

const whatsAppInteractiveMessageSchema = z.object({
  from: z.string().min(1),
  id: z.string().min(1),
  timestamp: z.string().optional(),
  type: z.literal("interactive"),
  interactive: z.discriminatedUnion("type", [
    z.object({
      type: z.literal("button_reply"),
      button_reply: z.object({
        id: z.string().min(1),
        title: z.string().optional(),
      }),
    }),
    z.object({
      type: z.literal("list_reply"),
      list_reply: z.object({
        id: z.string().min(1),
        title: z.string().optional(),
        description: z.string().optional(),
      }),
    }),
  ]),
});

const whatsAppMessageSchema = z.union([
  whatsAppTextMessageSchema,
  whatsAppInteractiveMessageSchema,
]);

const whatsAppWebhookValueSchema = z.object({
  messaging_product: z.literal("whatsapp").optional(),
  metadata: z
    .object({
      display_phone_number: z.string().optional(),
      phone_number_id: z.string().optional(),
    })
    .optional(),
  messages: z.array(whatsAppMessageSchema).optional(),
  statuses: z.array(z.unknown()).optional(),
});

const whatsAppWebhookChangeSchema = z.object({
  field: z.string(),
  value: whatsAppWebhookValueSchema,
});

const whatsAppWebhookEntrySchema = z.object({
  id: z.string().optional(),
  changes: z.array(whatsAppWebhookChangeSchema),
});

export const whatsAppWebhookPayloadSchema = z.object({
  object: z.string(),
  entry: z.array(whatsAppWebhookEntrySchema),
});

export type WhatsAppIncomingMessage =
  | {
      kind: "text";
      from: string;
      messageId: string;
      text: string;
      phoneNumberId: string;
      timestamp?: string;
    }
  | {
      kind: "interactive";
      from: string;
      messageId: string;
      interactiveId: string;
      interactiveTitle: string;
      phoneNumberId: string;
      timestamp?: string;
    };

export function verifyWebhookChallenge(input: {
  mode: string | null;
  verifyToken: string | null;
  challenge: string | null;
  expectedVerifyToken: string;
}): string | null {
  if (
    input.mode === "subscribe" &&
    input.verifyToken === input.expectedVerifyToken &&
    input.challenge
  ) {
    return input.challenge;
  }

  return null;
}

/** Verify X-Hub-Signature-256 HMAC-SHA256 of the raw request body. */
export function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
  appSecret: string,
): boolean {
  if (!signatureHeader?.startsWith("sha256=")) {
    return false;
  }

  const received = signatureHeader.slice("sha256=".length).trim();
  const expected = createHmac("sha256", appSecret)
    .update(rawBody, "utf8")
    .digest("hex");

  if (expected.length !== received.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(expected), Buffer.from(received));
}

function mapMessage(
  message: z.infer<typeof whatsAppMessageSchema>,
  phoneNumberId: string,
): WhatsAppIncomingMessage | null {
  if (message.type === "text") {
    return {
      kind: "text",
      from: message.from,
      messageId: message.id,
      text: message.text.body,
      phoneNumberId,
      timestamp: message.timestamp,
    };
  }

  if (message.interactive.type === "button_reply") {
    return {
      kind: "interactive",
      from: message.from,
      messageId: message.id,
      interactiveId: message.interactive.button_reply.id,
      interactiveTitle: message.interactive.button_reply.title ?? "",
      phoneNumberId,
      timestamp: message.timestamp,
    };
  }

  return {
    kind: "interactive",
    from: message.from,
    messageId: message.id,
    interactiveId: message.interactive.list_reply.id,
    interactiveTitle: message.interactive.list_reply.title ?? "",
    phoneNumberId,
    timestamp: message.timestamp,
  };
}

export function parseIncomingMessages(rawBody: string): WhatsAppIncomingMessage[] {
  const json = JSON.parse(rawBody) as unknown;
  const payload = whatsAppWebhookPayloadSchema.parse(json);
  const messages: WhatsAppIncomingMessage[] = [];

  for (const entry of payload.entry) {
    for (const change of entry.changes) {
      if (change.field !== "messages" || !change.value.messages?.length) {
        continue;
      }

      const phoneNumberId = change.value.metadata?.phone_number_id;
      if (!phoneNumberId) {
        continue;
      }

      for (const message of change.value.messages) {
        const mapped = mapMessage(message, phoneNumberId);
        if (mapped) {
          messages.push(mapped);
        }
      }
    }
  }

  return messages;
}
