import type { ZodType } from "zod";
import { AppError } from "@/lib/utils/errors";

export async function parseJsonBody<T>(request: Request, schema: ZodType<T>): Promise<T> {
  let json: unknown;

  try {
    json = await request.json();
  } catch {
    throw new AppError("VALIDATION_ERROR", "Request body must be valid JSON.", 400);
  }

  return schema.parse(json);
}

export function parseSearchParams<T>(
  searchParams: URLSearchParams,
  schema: ZodType<T>,
  mapping: (params: URLSearchParams) => unknown,
): T {
  return schema.parse(mapping(searchParams));
}
