import "server-only";

import { Pool, type PoolClient } from "pg";
import { getPostgresConfig } from "./postgres-config";

declare global {
  var mDriftPostgresPool: Pool | undefined;
}

function createPool(): Pool {
  const config = getPostgresConfig();
  const pool = new Pool({
    connectionString: config.connectionString,
    host: config.connectionString ? undefined : config.host,
    port: config.connectionString ? undefined : config.port,
    database: config.connectionString ? undefined : config.database,
    user: config.connectionString ? undefined : config.user,
    password: config.connectionString ? undefined : config.password,
    max: config.max,
    connectionTimeoutMillis: 3_000,
    idleTimeoutMillis: 10_000,
    allowExitOnIdle: false,
    application_name: process.env.POSTGRES_APPLICATION_NAME?.trim() || "mdrift-next",
    statement_timeout: config.statementTimeoutMs,
  });

  pool.on("error", () => {
    process.stderr.write("postgres_pool_error\n");
  });

  return pool;
}

export function getPostgresPool(): Pool {
  if (!globalThis.mDriftPostgresPool) {
    globalThis.mDriftPostgresPool = createPool();
  }

  return globalThis.mDriftPostgresPool;
}

export async function withPostgresTransaction<T>(
  operation: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await getPostgresPool().connect();

  try {
    await client.query("BEGIN");
    const result = await operation(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined);
    throw error;
  } finally {
    client.release();
  }
}

export async function closePostgresPool(): Promise<void> {
  const pool = globalThis.mDriftPostgresPool;

  if (!pool) {
    return;
  }

  globalThis.mDriftPostgresPool = undefined;
  await pool.end();
}
