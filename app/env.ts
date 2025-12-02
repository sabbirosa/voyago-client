import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z
    .url("NEXT_PUBLIC_API_URL must be a valid URL")
    .min(1, "NEXT_PUBLIC_API_URL is required"),
});

const parsedClientEnv = clientEnvSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});

if (!parsedClientEnv.success) {
  throw new Error(
    "Invalid client environment variables:\n" +
      parsedClientEnv.error.issues
        .map((issue) => `${issue.path.join(".") || "env"}: ${issue.message}`)
        .join("\n")
  );
}

const rawApiUrl = parsedClientEnv.data.NEXT_PUBLIC_API_URL.replace(/\/+$/, "");

export const clientEnv = {
  /**
   * Base URL for the Voyago API (must include protocol and optional path prefix).
   * Example: "http://localhost:5000/api/v1" or "https://api.voyago.com/api/v1"
   */
  apiUrl: rawApiUrl,
} as const;
