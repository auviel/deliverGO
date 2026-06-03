import { getDoorDashWebhookAuthorization } from "./config";

export function verifyDoorDashWebhookAuthorization(headers: Headers): boolean {
  const expected = getDoorDashWebhookAuthorization();
  if (!expected) {
    return true;
  }

  const authorization = headers.get("authorization");
  return authorization === expected || authorization === `Bearer ${expected}`;
}

export function parseDoorDashWebhook(rawBody: string) {
  return JSON.parse(rawBody) as {
    event_type?: string;
    event_id?: string;
    external_delivery_id?: string;
    delivery_id?: number;
    delivery_status?: string;
    created_at?: string;
  };
}
