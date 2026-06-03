import { upsertCustomerFromDropoff } from "@/lib/services/customer/upsert-from-dropoff";
import { geocodeAddress } from "@/lib/services/geocoding/geocode-address";
import { isAppError } from "@/lib/utils/errors";
import { normalizeCanadianPhone } from "@/lib/utils/phone";

export type ResolvedWhatsAppCustomer = {
  customerId: string;
  customerName: string;
  dropoffPhone: string;
  dropoffAddress: string;
  updatedExisting: boolean;
};

export async function resolveNewCustomerForWhatsApp(input: {
  storeId: string;
  name: string;
  phone: string;
  addressQuery: string;
}): Promise<{ ok: true; data: ResolvedWhatsAppCustomer } | { ok: false; error: string }> {
  const name = input.name.trim();
  const phoneE164 = normalizeCanadianPhone(input.phone);

  if (!name) {
    return { ok: false, error: "Customer name is required." };
  }

  if (!phoneE164) {
    return { ok: false, error: "Enter a valid Canadian phone number." };
  }

  if (input.addressQuery.trim().length < 5) {
    return { ok: false, error: "Enter a complete dropoff address." };
  }

  try {
    const geocoded = await geocodeAddress({
      query: input.addressQuery,
      storeId: input.storeId,
    });

    const customerId = await upsertCustomerFromDropoff({
      storeId: input.storeId,
      name,
      phoneE164,
      address: geocoded.address,
    });

    return {
      ok: true,
      data: {
        customerId,
        customerName: name,
        dropoffPhone: phoneE164,
        dropoffAddress: geocoded.address.formatted,
        updatedExisting: true,
      },
    };
  } catch (error) {
    return {
      ok: false,
      error: isAppError(error)
        ? error.message
        : "Unable to save that customer. Check the address and try again.",
    };
  }
}
