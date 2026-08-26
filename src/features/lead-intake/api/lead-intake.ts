import "server-only";

import { createHash, createHmac } from "node:crypto";
import { isIP } from "node:net";
import type { PoolClient } from "pg";
import type { Lead } from "@/entities/lead";
import { createLeadMessage, LeadDeliveryError } from "@/features/lead-delivery";
import { withPostgresTransaction } from "@/shared/server/postgres";
import { getLeadIntakeConfig, type LeadIntakeConfig } from "./lead-intake-config";
import { LeadIntakeError } from "../model/lead-intake-error";

const rateLimitWindowSeconds = 10 * 60;
const perClientRequestLimit = 5;
const globalRequestLimit = 100;
const globalRateKey = createHash("sha256").update("global", "utf8").digest("hex");

type RateLimitRow = {
  readonly window_started_at: Date;
};

type ExistingLeadRow = {
  readonly fingerprint: string;
};

export type LeadIntakeContext = {
  readonly clientKey: string;
};

export type LeadIntakeResult =
  | { readonly status: "accepted" | "duplicate" }
  | { readonly status: "conflict" }
  | { readonly status: "rate_limited"; readonly retryAfterSeconds: number };

class RateLimitRejected extends Error {
  readonly retryAfterSeconds: number;

  constructor(retryAfterSeconds: number) {
    super("rate_limited");
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

function digest(secret: string, value: string): string {
  return createHmac("sha256", secret).update(value, "utf8").digest("hex");
}

function getClientIp(request: Request, config: LeadIntakeConfig): string {
  if (config.clientIpSource === "local") {
    const hostname = new URL(request.url).hostname;
    const isLocal =
      process.env.NODE_ENV !== "production" &&
      (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]");

    if (!isLocal) {
      throw new LeadIntakeError("configuration");
    }

    return "local-development";
  }

  const value = request.headers.get("x-real-ip")?.trim();

  if (!value || value.includes(",") || isIP(value) === 0) {
    throw new LeadIntakeError("unavailable");
  }

  return value;
}

function createFingerprint(lead: Lead): string {
  return createHash("sha256").update(JSON.stringify(lead), "utf8").digest("hex");
}

function getRetryAfterSeconds(windowStartedAt: Date): number {
  const resetAt = windowStartedAt.getTime() + rateLimitWindowSeconds * 1_000;
  return Math.max(1, Math.ceil((resetAt - Date.now()) / 1_000));
}

async function consumeRateLimit(
  client: PoolClient,
  scope: "client" | "global",
  bucketKey: string,
  limit: number,
): Promise<void> {
  const accepted = await client.query<RateLimitRow>(
    `
      INSERT INTO lead_rate_limits (scope, bucket_key, window_started_at, request_count)
      VALUES ($1, $2, clock_timestamp(), 1)
      ON CONFLICT (scope, bucket_key) DO UPDATE
      SET
        window_started_at = CASE
          WHEN lead_rate_limits.window_started_at <= clock_timestamp() - ($3::integer * interval '1 second')
            THEN clock_timestamp()
          ELSE lead_rate_limits.window_started_at
        END,
        request_count = CASE
          WHEN lead_rate_limits.window_started_at <= clock_timestamp() - ($3::integer * interval '1 second')
            THEN 1
          ELSE lead_rate_limits.request_count + 1
        END
      WHERE
        lead_rate_limits.window_started_at <= clock_timestamp() - ($3::integer * interval '1 second')
        OR lead_rate_limits.request_count < $4::integer
      RETURNING window_started_at
    `,
    [scope, bucketKey, rateLimitWindowSeconds, limit],
  );

  if (accepted.rowCount === 1) {
    return;
  }

  const current = await client.query<RateLimitRow>(
    `
      SELECT window_started_at
      FROM lead_rate_limits
      WHERE scope = $1 AND bucket_key = $2
    `,
    [scope, bucketKey],
  );
  const row = current.rows[0];

  if (!row) {
    throw new LeadIntakeError("unavailable");
  }

  throw new RateLimitRejected(getRetryAfterSeconds(row.window_started_at));
}

export function createLeadIntakeContext(request: Request): LeadIntakeContext {
  const config = getLeadIntakeConfig();
  const clientIp = getClientIp(request, config);

  return {
    clientKey: digest(config.hmacSecret, `client-ip:${clientIp}`),
  };
}

export async function acceptLead(
  context: LeadIntakeContext,
  lead: Lead,
): Promise<LeadIntakeResult> {
  const fingerprint = createFingerprint(lead);
  const receivedAt = new Date();
  let message: string;

  try {
    message = createLeadMessage(lead, receivedAt);
  } catch (error) {
    if (error instanceof LeadDeliveryError && error.code === "message_too_long") {
      throw new LeadIntakeError("unavailable");
    }

    throw error;
  }

  try {
    return await withPostgresTransaction(async (client) => {
      await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1, 0))", [
        lead.submissionId,
      ]);

      const existing = await client.query<ExistingLeadRow>(
        "SELECT fingerprint FROM leads WHERE submission_id = $1",
        [lead.submissionId],
      );
      const existingLead = existing.rows[0];

      if (existingLead) {
        return existingLead.fingerprint === fingerprint
          ? { status: "duplicate" as const }
          : { status: "conflict" as const };
      }

      await consumeRateLimit(client, "client", context.clientKey, perClientRequestLimit);
      await consumeRateLimit(client, "global", globalRateKey, globalRequestLimit);

      await client.query(
        `
          INSERT INTO leads (
            submission_id,
            fingerprint,
            lead_type,
            payload,
            telegram_message,
            received_at
          )
          VALUES ($1, $2, $3, $4::jsonb, $5, $6)
        `,
        [
          lead.submissionId,
          fingerprint,
          lead.type,
          JSON.stringify(lead),
          message,
          receivedAt,
        ],
      );
      await client.query(
        "INSERT INTO telegram_outbox (lead_id) VALUES ($1)",
        [lead.submissionId],
      );

      return { status: "accepted" as const };
    });
  } catch (error) {
    if (error instanceof RateLimitRejected) {
      return {
        status: "rate_limited",
        retryAfterSeconds: error.retryAfterSeconds,
      };
    }

    if (error instanceof LeadIntakeError) {
      throw error;
    }

    throw new LeadIntakeError("unavailable");
  }
}
