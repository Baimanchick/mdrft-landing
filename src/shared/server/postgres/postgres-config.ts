import "server-only";

import { z } from "zod";

const connectionStringSchema = z
  .string()
  .trim()
  .url()
  .startsWith("postgresql://")
  .max(2_048);

const postgresConfigSchema = z.strictObject({
  connectionString: connectionStringSchema.optional(),
  host: z.string().trim().min(1).max(253).optional(),
  port: z.coerce.number().int().min(1).max(65_535),
  database: z.string().trim().regex(/^[a-zA-Z_][a-zA-Z0-9_-]*$/u).optional(),
  user: z.string().trim().regex(/^[a-zA-Z_][a-zA-Z0-9_-]*$/u).optional(),
  password: z.string().min(16).max(512).optional(),
  max: z.coerce.number().int().min(1).max(5),
  statementTimeoutMs: z.coerce.number().int().min(1_000).max(60_000),
});

export type PostgresConfig = z.output<typeof postgresConfigSchema>;

export function getPostgresConfig(): PostgresConfig {
  const result = postgresConfigSchema.safeParse({
    connectionString: process.env.DATABASE_URL?.trim() || undefined,
    host: process.env.PGHOST?.trim() || undefined,
    port: process.env.PGPORT ?? "5432",
    database: process.env.PGDATABASE?.trim() || undefined,
    user: process.env.PGUSER?.trim() || undefined,
    password: process.env.PGPASSWORD,
    max: process.env.DATABASE_POOL_MAX ?? "3",
    statementTimeoutMs: process.env.POSTGRES_STATEMENT_TIMEOUT_MS ?? "8000",
  });

  if (
    !result.success ||
    (!result.data.connectionString &&
      (!result.data.host ||
        !result.data.database ||
        !result.data.user ||
        !result.data.password))
  ) {
    throw new Error("postgres_configuration");
  }

  return result.data;
}
