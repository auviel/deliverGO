import { handleApiError } from "@/lib/utils/errors";

export async function GET() {
  try {
    return Response.json({ data: [], message: "Phase 6" }, { status: 501 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST() {
  try {
    return Response.json(
      { error: "Create delivery is not implemented yet (Phase 3).", code: "NOT_FOUND" },
      { status: 501 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
