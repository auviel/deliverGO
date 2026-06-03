import { requireStoreManager } from "@/lib/auth/session";
import { createQuoteSchema } from "@/lib/domain/delivery/validation";
import { createQuote } from "@/lib/services/delivery/create-quote";
import { parseJsonBody } from "@/lib/utils/api-request";
import { handleApiError, AppError } from "@/lib/utils/errors";
import { checkRateLimit } from "@/lib/utils/rate-limit";

const QUOTE_RATE_LIMIT = 20;
const QUOTE_RATE_WINDOW_MS = 60_000;

export async function POST(request: Request) {
  try {
    const user = await requireStoreManager();

    const rateLimit = checkRateLimit(
      `delivery-quote:${user.id}`,
      QUOTE_RATE_LIMIT,
      QUOTE_RATE_WINDOW_MS,
    );

    if (!rateLimit.allowed) {
      throw new AppError(
        "VALIDATION_ERROR",
        `Too many quote requests. Try again in ${rateLimit.retryAfterSeconds}s.`,
        429,
      );
    }

    const body = await parseJsonBody(request, createQuoteSchema);
    const result = await createQuote(body);

    return Response.json({ data: result });
  } catch (error) {
    return handleApiError(error);
  }
}
