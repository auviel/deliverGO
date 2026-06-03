import { z } from "zod";
import { normalizeCanadianPhone } from "@/lib/utils/phone";

const canadianPhoneSchema = z
  .string()
  .min(10, "Valid phone number is required")
  .refine((value) => normalizeCanadianPhone(value) !== null, {
    message: "Enter a valid Canadian phone number",
  });

const doordashExternalStoreIdSchema = z
  .string()
  .trim()
  .regex(/^[A-Za-z0-9_-]{3,64}$/, "Use 3–64 letters, numbers, underscores, or hyphens")
  .optional()
  .or(z.literal(""));

export const updateStoreProfileSchema = z.object({
  name: z.string().trim().min(1, "Store name is required"),
  phone: canadianPhoneSchema,
  addressLine2: z.string().trim().optional(),
  addressQuery: z.string().trim().min(5, "Enter a complete Canadian store address"),
  enabledUberDirect: z.boolean().optional(),
  enabledDoorDashDrive: z.boolean().optional(),
  doordashExternalStoreId: doordashExternalStoreIdSchema,
});

export type UpdateStoreProfileInput = z.infer<typeof updateStoreProfileSchema>;
