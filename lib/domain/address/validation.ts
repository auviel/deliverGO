import { z } from "zod";

export const geocodeRequestSchema = z.object({
  query: z.string().trim().min(5, "Enter a full delivery address"),
});

export type GeocodeRequest = z.infer<typeof geocodeRequestSchema>;
