import { z } from "zod";

/* ── Application metadata ── */

export const APP_NAME = "tProkash";
export const APP_VERSION = "0.1.0";
export const APP_DESCRIPTION = "Bangladesh Publishing Directory";

/* ── Shared constants ── */

export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 20,
  maxLimit: 100,
} as const;

export const ENTITY_PREFIXES = {
  publisher: "pub",
  book: "bok",
  author: "aut",
  user: "usr",
} as const;

/* ── Environment schema ── */

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  API_PREFIX: z.string().default("api/v1"),
  LOG_LEVEL: z
    .enum(["debug", "info", "warn", "error"])
    .default("info"),
  CORS_ORIGIN: z.string().default("*"),
  DATABASE_URL: z.string().optional(),
});

export type Environment = z.infer<typeof envSchema>;

/* ── Environment loader ── */

let cachedEnv: Environment | null = null;

export const loadEnvironment = (overrides?: Partial<Environment>): Environment => {
  if (cachedEnv && !overrides) return cachedEnv;

  const parsed = envSchema.parse({
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    API_PREFIX: process.env.API_PREFIX,
    LOG_LEVEL: process.env.LOG_LEVEL,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    ...overrides,
  });

  if (!overrides) cachedEnv = parsed;
  return parsed;
};

export const getEnvironment = (): Environment => {
  if (!cachedEnv) return loadEnvironment();
  return cachedEnv;
};

export const resetEnvironment = (): void => {
  cachedEnv = null;
};
