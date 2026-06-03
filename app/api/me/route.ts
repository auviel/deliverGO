import { getSessionContext } from "@/lib/auth/session";
import { handleApiError } from "@/lib/utils/errors";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const context = await getSessionContext();

    if (!context) {
      return NextResponse.json(
        { error: "Authentication required", code: "UNAUTHORIZED" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      data: {
        user: context.user,
        store: context.store,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
