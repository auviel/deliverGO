import { createQuote } from "@/lib/services/delivery/create-quote";
import { handleApiError } from "@/lib/utils/errors";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createQuote(body);

    return Response.json({ data: result });
  } catch (error) {
    return handleApiError(error);
  }
}
