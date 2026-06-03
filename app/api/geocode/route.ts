import { handleApiError } from "@/lib/utils/errors";

export async function POST() {
  try {
    return Response.json(
      { error: "Geocoding is not implemented yet (Phase 4).", code: "NOT_FOUND" },
      { status: 501 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
