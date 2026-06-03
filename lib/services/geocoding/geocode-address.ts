import { geocodeRequestSchema } from "@/lib/domain/address/validation";
import { storeRepository } from "@/lib/db/repositories/store.repository";
import { geocodeCanadianAddress } from "@/lib/integrations/geocoding/mapbox/client";
import type { GeocodedAddress } from "@/lib/integrations/geocoding/types";
import { AppError } from "@/lib/utils/errors";

export type GeocodeAddressInput = {
  query: string;
  storeId: string;
};

export async function geocodeAddress(
  input: GeocodeAddressInput,
): Promise<GeocodedAddress> {
  const parsed = geocodeRequestSchema.parse({ query: input.query });
  const store = await storeRepository.findById(input.storeId);

  if (!store) {
    throw new AppError("NOT_FOUND", "Store not found", 404);
  }

  return geocodeCanadianAddress(parsed.query, {
    proximity: {
      latitude: store.latitude,
      longitude: store.longitude,
    },
  });
}
