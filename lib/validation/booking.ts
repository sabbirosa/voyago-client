import { z } from "zod";

// Custom datetime validation that accepts datetime-local format (YYYY-MM-DDTHH:mm)
const datetimeLocalSchema = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
    "Date must be in format YYYY-MM-DDTHH:mm"
  )
  .refine(
    (dateString) => {
      const date = new Date(dateString);
      return !isNaN(date.getTime());
    },
    {
      message: "Invalid date",
    }
  )
  .refine(
    (dateString) => {
      const date = new Date(dateString);
      const now = new Date();
      return date > now;
    },
    {
      message: "Booking date must be in the future",
    }
  );

export const createBookingSchema = z.object({
  listingId: z.string().min(1, "Listing ID is required"),
  date: datetimeLocalSchema,
  groupSize: z
    .number()
    .int("Group size must be an integer")
    .min(1, "Group size must be at least 1"),
  note: z.string().max(500, "Note must be less than 500 characters").optional(),
});

export type CreateBookingFormData = z.infer<typeof createBookingSchema>;

