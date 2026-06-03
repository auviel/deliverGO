import { z } from "zod";

export const proofOfDeliveryConfigSchema = z.object({
  signature: z.boolean(),
  picture: z.boolean(),
});

export const createDeliverySchema = z.object({
  dropoffName: z.string().min(1, "Customer name is required"),
  dropoffPhone: z.string().min(10, "Valid phone number is required"),
  dropoffAddress: z.string().min(5, "Dropoff address is required"),
  scheduledPickupAt: z.coerce.date().optional(),
  proofOfDelivery: proofOfDeliveryConfigSchema.default({
    signature: false,
    picture: true,
  }),
  idempotencyKey: z.string().optional(),
});

export const createQuoteSchema = z.object({
  dropoffAddress: z.string().min(5, "Dropoff address is required"),
  scheduledPickupAt: z.coerce.date().optional(),
});

export const cancelDeliverySchema = z.object({
  reason: z.enum([
    "CUSTOMER_CALLED_TO_CANCEL",
    "OUT_OF_ITEMS",
    "RESTAURANT_TOO_BUSY",
    "OTHER",
  ]),
  details: z.string().optional(),
});

export type CreateDeliverySchema = z.infer<typeof createDeliverySchema>;
export type CreateQuoteSchema = z.infer<typeof createQuoteSchema>;
export type CancelDeliverySchema = z.infer<typeof cancelDeliverySchema>;
