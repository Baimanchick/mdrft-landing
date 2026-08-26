import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { closePostgresPool, getPostgresPool } from "@/shared/server/postgres";

type AppliedMigrationRow = {
  readonly checksum: string;
};

const migrationFilename = /^\d{3}_[a-z0-9_]+\.sql$/u;
const databaseIdentifier = /^[a-zA-Z_][a-zA-Z0-9_]*$/u;

function writeStatus(event: string, migration?: string): void {
  process.stdout.write(`${JSON.stringify({ event, migration })}\n`);
}

async function runMigrations(): Promise<void> {
  const migrationsDirectory = resolve(process.env.MIGRATIONS_DIR || "/app/migrations");
  const applicationDatabaseUser = process.env.APP_DATABASE_USER?.trim();
  const filenames = (await readdir(migrationsDirectory))
    .filter((filename) => migrationFilename.test(filename))
    .sort();

  if (filenames.length === 0) {
    throw new Error("migrations_not_found");
  }

  if (!applicationDatabaseUser || !databaseIdentifier.test(applicationDatabaseUser)) {
    throw new Error("migrations_configuration");
  }

  const client = await getPostgresPool().connect();

  try {
    await client.query(
      "SELECT pg_advisory_lock(hashtextextended('mdrift-schema-migrations', 0))",
    );
    await client.query("BEGIN");

    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
          filename text PRIMARY KEY,
          checksum text NOT NULL CHECK (char_length(checksum) = 64),
          applied_at timestamptz NOT NULL DEFAULT now()
        )
      `);
      await client.query(
        `REVOKE ALL PRIVILEGES ON TABLE schema_migrations FROM "${applicationDatabaseUser}"`,
      );
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK").catch(() => undefined);
      throw error;
    }

    for (const filename of filenames) {
      const sql = await readFile(resolve(migrationsDirectory, filename), "utf8");
      const checksum = createHash("sha256").update(sql, "utf8").digest("hex");
      const applied = await client.query<AppliedMigrationRow>(
        "SELECT checksum FROM schema_migrations WHERE filename = $1",
        [filename],
      );
      const existing = applied.rows[0];

      if (existing) {
        if (existing.checksum !== checksum) {
          throw new Error(`migration_checksum_mismatch:${filename}`);
        }

        continue;
      }

      await client.query("BEGIN");

      try {
        await client.query(sql);
        await client.query(
          "INSERT INTO schema_migrations (filename, checksum) VALUES ($1, $2)",
          [filename, checksum],
        );
        await client.query("COMMIT");
        writeStatus("migration_applied", filename);
      } catch (error) {
        await client.query("ROLLBACK").catch(() => undefined);
        throw error;
      }
    }
  } finally {
    await client
      .query("SELECT pg_advisory_unlock(hashtextextended('mdrift-schema-migrations', 0))")
      .catch(() => undefined);
    client.release();
  }
}

try {
  await runMigrations();
  writeStatus("migrations_complete");
} catch {
  process.stderr.write(`${JSON.stringify({ event: "migrations_failed" })}\n`);
  process.exitCode = 1;
} finally {
  await closePostgresPool().catch(() => undefined);
}
