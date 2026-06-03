import { handleApiError } from "@/lib/utils/errors";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    return Response.json(
      { error: "Cancel delivery is not implemented yet (Phase 8).", id, code: "NOT_FOUND" },
      { status: 501 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
