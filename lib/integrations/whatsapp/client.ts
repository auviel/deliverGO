import {
  getWhatsAppGraphBaseUrl,
  requireWhatsAppConfig,
  type WhatsAppConfig,
} from "@/lib/integrations/whatsapp/config";
import { AppError } from "@/lib/utils/errors";
import { logger } from "@/lib/utils/logger";

type SendMessageBase = {
  to: string;
  phoneNumberId?: string;
  config?: WhatsAppConfig;
};

type SendTextMessageInput = SendMessageBase & {
  body: string;
};

type ReplyButton = {
  id: string;
  title: string;
};

type ListRow = {
  id: string;
  title: string;
  description?: string;
};

export type SendReplyButtonsInput = SendMessageBase & {
  body: string;
  buttons: ReplyButton[];
};

export type SendListMessageInput = SendMessageBase & {
  body: string;
  buttonLabel: string;
  sectionTitle: string;
  rows: ListRow[];
};

function stripPhonePrefix(phoneE164: string): string {
  return phoneE164.replace(/\D/g, "");
}

async function postWhatsAppMessage(
  to: string,
  phoneNumberId: string,
  config: WhatsAppConfig,
  messagePayload: Record<string, unknown>,
): Promise<void> {
  const url = `${getWhatsAppGraphBaseUrl(config.apiVersion)}/${phoneNumberId}/messages`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: stripPhonePrefix(to),
      ...messagePayload,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    logger.error("whatsapp.send.failed", {
      status: response.status,
      body: errorBody.slice(0, 500),
    });
    throw new AppError(
      "PROVIDER_ERROR",
      "Unable to send WhatsApp message. Check Meta API credentials.",
      502,
    );
  }
}

export async function sendTextMessage(input: SendTextMessageInput): Promise<void> {
  const config = input.config ?? requireWhatsAppConfig();
  const phoneNumberId = input.phoneNumberId ?? config.phoneNumberId;

  await postWhatsAppMessage(input.to, phoneNumberId, config, {
    type: "text",
    text: {
      body: input.body,
      preview_url: input.body.includes("https://"),
    },
  });
}

export async function sendReplyButtons(input: SendReplyButtonsInput): Promise<void> {
  const config = input.config ?? requireWhatsAppConfig();
  const phoneNumberId = input.phoneNumberId ?? config.phoneNumberId;

  await postWhatsAppMessage(input.to, phoneNumberId, config, {
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: input.body.slice(0, 1024) },
      action: {
        buttons: input.buttons.slice(0, 3).map((button) => ({
          type: "reply",
          reply: {
            id: button.id.slice(0, 256),
            title: button.title.slice(0, 20),
          },
        })),
      },
    },
  });
}

export async function sendListMessage(input: SendListMessageInput): Promise<void> {
  const config = input.config ?? requireWhatsAppConfig();
  const phoneNumberId = input.phoneNumberId ?? config.phoneNumberId;

  await postWhatsAppMessage(input.to, phoneNumberId, config, {
    type: "interactive",
    interactive: {
      type: "list",
      body: { text: input.body.slice(0, 4096) },
      action: {
        button: input.buttonLabel.slice(0, 20),
        sections: [
          {
            title: input.sectionTitle.slice(0, 24),
            rows: input.rows.slice(0, 10).map((row) => ({
              id: row.id.slice(0, 200),
              title: row.title.slice(0, 24),
              ...(row.description ? { description: row.description.slice(0, 72) } : {}),
            })),
          },
        ],
      },
    },
  });
}
