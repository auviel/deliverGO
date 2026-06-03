import { handleUberWebhook } from "@/lib/services/delivery/handle-uber-webhook";
import { handleApiError } from "@/lib/utils/errors";
import { logger } from "@/lib/utils/logger";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    await handleUberWebhook(rawBody, request.headers);

    return new Response(null, { status: 200 });
  } catch (error) {
    logger.error("webhook.handler.failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return handleApiError(error);
  }
}
