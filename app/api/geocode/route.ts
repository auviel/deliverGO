import { requireStoreManager } from "@/lib/auth/session";
import { geocodeAddress } from "@/lib/services/geocoding/geocode-address";
import { handleApiError, AppError } from "@/lib/utils/errors";
import { checkRateLimit } from "@/lib/utils/rate-limit";
import { geocodeRequestSchema } from "@/lib/domain/address/validation";

const GEOCODE_RATE_LIMIT = 30;
const GEOCODE_RATE_WINDOW_MS = 60_000;

export async function POST(request: Request) {
  try {
    const user = await requireStoreManager();

    const rateLimit = checkRateLimit(
      `geocode:${user.id}`,
      GEOCODE_RATE_LIMIT,
      GEOCODE_RATE_WINDOW_MS,
    );

    if (!rateLimit.allowed) {
      throw new AppError(
        "VALIDATION_ERROR",
        `Too many geocode requests. Try again in ${rateLimit.retryAfterSeconds}s.`,
        429,
      );
    }

    const body = geocodeRequestSchema.parse(await request.json());
    const result = await geocodeAddress({
      query: body.query,
      storeId: user.storeId,
    });

    return Response.json({ data: result });
  } catch (error) {
    return handleApiError(error);
  }
}
