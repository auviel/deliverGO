import { requireSessionContext } from "@/lib/auth/session";
import { validateScheduledPickupAt } from "@/lib/domain/delivery/schedule";
import type { DeliveryQuote } from "@/lib/domain/delivery/types";
import { createQuoteSchema } from "@/lib/domain/delivery/validation";
import { storeProfileToAddress } from "@/lib/domain/store/format";
import { getDeliveryProviderForStore } from "@/lib/integrations/delivery/provider.registry";
import type { GeocodedAddress } from "@/lib/integrations/geocoding/types";
import { geocodeAddress } from "@/lib/services/geocoding/geocode-address";
import { AppError } from "@/lib/utils/errors";

export type CreateQuoteResult = {
  quote: DeliveryQuote;
  geocoded: GeocodedAddress;
};

export async function createQuote(input: unknown): Promise<CreateQuoteResult> {
  const { store } = await requireSessionContext();
  const parsed = createQuoteSchema.parse(input);

  if (parsed.scheduledPickupAt) {
    const scheduleError = validateScheduledPickupAt(parsed.scheduledPickupAt);
    if (scheduleError) {
      throw new AppError("VALIDATION_ERROR", scheduleError, 400);
    }
  }

  const geocoded = await geocodeAddress({
    query: parsed.dropoffAddress,
    storeId: store.id,
  });

  const provider = getDeliveryProviderForStore(store);
  const quote = await provider.createQuote({
    pickup: storeProfileToAddress(store),
    dropoff: geocoded.address,
    pickupReadyAt: parsed.scheduledPickupAt,
  });

  return { quote, geocoded };
}
