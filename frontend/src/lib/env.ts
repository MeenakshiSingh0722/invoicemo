import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:5001/api/v1"),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
  // In Next.js client side, we might not want to hard exit, but we should know.
}

export const env = parsed.data || { NEXT_PUBLIC_API_URL: "http://localhost:5001/api/v1" };
