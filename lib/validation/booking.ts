import { z } from "zod";

export const createBookingSchema = z.object({
  listingId: z.string().min(1, "Listing ID is required"),
  date: z.string().datetime("Invalid date format"),
  groupSize: z
    .number()
    .int("Group size must be an integer")
    .min(1, "Group size must be at least 1"),
  note: z.string().max(500, "Note must be less than 500 characters").optional(),
});

export type CreateBookingFormData = z.infer<typeof createBookingSchema>;

