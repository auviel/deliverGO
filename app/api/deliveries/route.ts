import { NextResponse } from "next/server";
import { createDelivery } from "@/lib/services/delivery/create-delivery";
import { listDeliveries } from "@/lib/services/delivery/list-deliveries";
import { handleApiError } from "@/lib/utils/errors";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const result = await listDeliveries({
      filter: searchParams.get("filter") ?? undefined,
      search: searchParams.get("q") ?? undefined,
    });

    return NextResponse.json({ data: result });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createDelivery(body);

    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
