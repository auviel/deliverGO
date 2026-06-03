import { NextResponse } from "next/server";
import { requireStoreManager } from "@/lib/auth/session";
import {
  createDeliverySchema,
  listDeliveriesQuerySchema,
} from "@/lib/domain/delivery/validation";
import { createDelivery } from "@/lib/services/delivery/create-delivery";
import { listDeliveries } from "@/lib/services/delivery/list-deliveries";
import { parseJsonBody } from "@/lib/utils/api-request";
import { handleApiError, AppError } from "@/lib/utils/errors";
import { checkRateLimit } from "@/lib/utils/rate-limit";

const CREATE_RATE_LIMIT = 10;
const CREATE_RATE_WINDOW_MS = 60_000;

export async function GET(request: Request) {
  try {
    await requireStoreManager();

    const { searchParams } = new URL(request.url);
    const query = listDeliveriesQuerySchema.parse({
      filter: searchParams.get("filter") ?? undefined,
      q: searchParams.get("q") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
      offset: searchParams.get("offset") ?? undefined,
    });

    const result = await listDeliveries({
      filter: query.filter,
      search: query.q,
      limit: query.limit,
      offset: query.offset,
    });

    return NextResponse.json({ data: result });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireStoreManager();

    const rateLimit = checkRateLimit(
      `delivery-create:${user.id}`,
      CREATE_RATE_LIMIT,
      CREATE_RATE_WINDOW_MS,
    );

    if (!rateLimit.allowed) {
      throw new AppError(
        "VALIDATION_ERROR",
        `Too many delivery requests. Try again in ${rateLimit.retryAfterSeconds}s.`,
        429,
      );
    }

    const body = await parseJsonBody(request, createDeliverySchema);
    const result = await createDelivery(body);

    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
