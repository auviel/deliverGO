import { handleDoorDashWebhook } from "@/lib/services/delivery/handle-doordash-webhook";
import { handleApiError } from "@/lib/utils/errors";
import { logger } from "@/lib/utils/logger";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    await handleDoorDashWebhook(rawBody, request.headers);

    return new Response(null, { status: 200 });
  } catch (error) {
    logger.error("webhook.handler.failed", {
      provider: "doordash_drive",
      error: error instanceof Error ? error.message : String(error),
    });
    return handleApiError(error);
  }
}
