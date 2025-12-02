import { z } from "zod";

export const listingCategoryOptions = [
  "FOOD",
  "ART",
  "ADVENTURE",
  "CULTURE",
  "PHOTOGRAPHY",
  "NIGHTLIFE",
  "NATURE",
  "ARCHITECTURE",
  "SHOPPING",
  "FAMILY",
  "SPORTS",
  "HISTORY",
] as const;

export const listingStatusOptions = [
  "DRAFT",
  "ACTIVE",
  "INACTIVE",
  "BLOCKED",
] as const;

export const feeTypeOptions = ["PER_PERSON", "PER_GROUP"] as const;

export const createListingSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000),
  itinerary: z.string().max(5000).optional(),
  city: z.string().min(1, "City is required").max(100),
  country: z.string().min(1, "Country is required").max(100),
  category: z.enum(listingCategoryOptions),
  languages: z
    .array(z.string())
    .min(1, "At least one language is required"),
  tourFee: z.number().positive("Tour fee must be positive"),
  feeType: z.enum(feeTypeOptions).default("PER_PERSON"),
  duration: z
    .number()
    .int()
    .positive("Duration must be a positive number"),
  meetingPoint: z.string().max(500).optional(),
  meetingLat: z.number().min(-90).max(90).optional(),
  meetingLng: z.number().min(-180).max(180).optional(),
  maxGroupSize: z
    .number()
    .int()
    .positive("Max group size must be a positive number"),
  status: z.enum(listingStatusOptions).optional().default("DRAFT"),
  images: z.array(z.string().url("Invalid image URL")).optional(),
});

export const updateListingSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().min(10).max(2000).optional(),
  itinerary: z.string().max(5000).optional(),
  city: z.string().min(1).max(100).optional(),
  country: z.string().min(1).max(100).optional(),
  category: z.enum(listingCategoryOptions).optional(),
  languages: z.array(z.string()).optional(),
  tourFee: z.number().positive().optional(),
  feeType: z.enum(feeTypeOptions).optional(),
  duration: z.number().int().positive().optional(),
  meetingPoint: z.string().max(500).optional(),
  meetingLat: z.number().min(-90).max(90).optional(),
  meetingLng: z.number().min(-180).max(180).optional(),
  maxGroupSize: z.number().int().positive().optional(),
  status: z.enum(listingStatusOptions).optional(),
  images: z.array(z.string().url()).optional(),
});

export type CreateListingFormData = z.infer<typeof createListingSchema>;
export type UpdateListingFormData = z.infer<typeof updateListingSchema>;

