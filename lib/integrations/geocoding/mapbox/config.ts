import { AppError } from "@/lib/utils/errors";

export function getMapboxAccessToken(): string {
  const token = process.env.MAPBOX_ACCESS_TOKEN?.trim();

  if (!token) {
    throw new AppError(
      "INTERNAL_ERROR",
      "Mapbox geocoding is not configured. Set MAPBOX_ACCESS_TOKEN.",
      500,
    );
  }

  return token;
}
