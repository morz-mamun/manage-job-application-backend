import { z } from "zod";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z.coerce.number().int().positive().default(5000),

  API_VERSION: z.string().default("v1"),

  // Database
  MONGODB_URI: z
    .url("MONGODB_URI must be a valid URL")
    .min(1, "MONGODB_URI is required"),

  // Auth
  CLERK_SECRET_KEY: z.string().min(1, "CLERK_SECRET_KEY is required"),

  // AI
  GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required"),

  // CORS
  CLIENT_URL: z
    .url("CLIENT_URL must be a valid URL")
    .default("http://localhost:3000"),

  ALLOWED_ORIGINS: z
    .string()
    .default("http://localhost:3000,http://localhost:5173")
    .transform((s) => s.split(",").map((o) => o.trim())),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),

  // Logging
  LOG_LEVEL: z
    .enum(["error", "warn", "info", "debug"])
    .default(process.env.NODE_ENV === "production" ? "info" : "debug"),

  LOG_DIR: z.string().default("logs"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:");
  console.error(_env.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = _env.data;

export const isDev = env.NODE_ENV === "development";
export const isProd = env.NODE_ENV === "production";
export const isTest = env.NODE_ENV === "test";
