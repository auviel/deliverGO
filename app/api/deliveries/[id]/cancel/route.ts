import { requireStoreManager } from "@/lib/auth/session";
import { cancelDeliverySchema } from "@/lib/domain/delivery/validation";
import { cancelDelivery } from "@/lib/services/delivery/cancel-delivery";
import { parseJsonBody } from "@/lib/utils/api-request";
import { handleApiError } from "@/lib/utils/errors";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    await requireStoreManager();

    const { id } = await context.params;
    const body = await parseJsonBody(request, cancelDeliverySchema);
    const delivery = await cancelDelivery(id, body);

    return Response.json({ data: delivery });
  } catch (error) {
    return handleApiError(error);
  }
}
