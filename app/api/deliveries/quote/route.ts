import { handleApiError } from "@/lib/utils/errors";

export async function POST() {
  try {
    return Response.json(
      { error: "Create quote is not implemented yet (Phase 3).", code: "NOT_FOUND" },
      { status: 501 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
