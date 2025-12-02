import { z } from "zod";

const expertiseOptions = [
  "History",
  "Food",
  "Adventure",
  "Photography",
  "Culture",
  "Art",
  "Nightlife",
  "Nature",
  "Architecture",
  "Shopping",
  "Family",
  "Sports",
] as const;

const preferenceOptions = [
  "Foodie",
  "Nightlife",
  "Culture",
  "Family-friendly",
  "Adventure",
  "Relaxation",
  "Budget",
  "Luxury",
] as const;

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  avatarUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  languages: z.array(z.string()).optional(),
  city: z.string().max(100, "City name is too long").optional(),
  country: z.string().max(100, "Country name is too long").optional(),
  preferences: z.array(z.enum(preferenceOptions)).optional(),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

export const updateGuideProfileSchema = z.object({
  expertise: z
    .array(z.enum(expertiseOptions))
    .min(1, "Please select at least one expertise")
    .optional(),
  dailyRate: z.number().positive("Daily rate must be positive").optional(),
  experienceYears: z
    .number()
    .int("Years must be a whole number")
    .min(0, "Years cannot be negative")
    .max(50, "Years cannot exceed 50")
    .optional(),
  verificationStatus: z.enum(["PENDING", "VERIFIED", "REJECTED"]).optional(),
});

export type UpdateGuideProfileFormData = z.infer<
  typeof updateGuideProfileSchema
>;

export const createGuideProfileSchema = z.object({
  expertise: z
    .array(z.enum(expertiseOptions))
    .min(1, "Please select at least one expertise"),
  dailyRate: z.number().positive("Daily rate must be positive"),
  experienceYears: z
    .number()
    .int("Years must be a whole number")
    .min(0, "Years cannot be negative")
    .max(50, "Years cannot exceed 50")
    .optional(),
});

export type CreateGuideProfileFormData = z.infer<
  typeof createGuideProfileSchema
>;

export { expertiseOptions, preferenceOptions };
