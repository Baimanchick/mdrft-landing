import { randomUUID } from "node:crypto";
import { z } from "zod";
import type { LeadType } from "@/entities/lead";
import {
  getTelegramConfig,
  LeadDeliveryError,
  sendTelegramMessage,
  type LeadDeliveryErrorCode,
} from "@/features/lead-delivery";
import {
  closePostgresPool,
  getPostgresPool,
  withPostgresTransaction,
} from "@/shared/server/postgres";

const pollIntervalMs = 2_000;
const leaseSeconds = 120;
const maximumAttempts = 10;
const cleanupIntervalMs = 6 * 60 * 60 * 1_000;
const leadTypes = ["booking", "certificate", "club", "partnership"] as const satisfies
  readonly LeadType[];

const workerConfigSchema = z.strictObject({
  retentionDays: z.coerce.number().int().min(1).max(3_650),
});

type WorkerConfig = z.output<typeof workerConfigSchema>;

type OutboxJob = {
  readonly id: string;
  readonly lead_id: string;
  readonly lead_type: LeadType;
  readonly telegram_message: string;
  readonly attempt_count: number;
  readonly lock_token: string;
};

function getWorkerConfig(): WorkerConfig {
  const result = workerConfigSchema.safeParse({
    retentionDays: process.env.LEAD_RETENTION_DAYS,
  });

  if (!result.success) {
    throw new Error("worker_configuration");
  }

  return result.data;
}

function writeEvent(
  event: string,
  values: Record<string, string | number | undefined> = {},
): void {
  process.stdout.write(`${JSON.stringify({ event, ...values })}\n`);
}

function sleep(milliseconds: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolveSleep) => {
    if (signal.aborted) {
      resolveSleep();
      return;
    }

    const timeout = setTimeout(resolveSleep, milliseconds);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timeout);
        resolveSleep();
      },
      { once: true },
    );
  });
}

async function claimJob(): Promise<OutboxJob | undefined> {
  return withPostgresTransaction(async (client) => {
    const lockToken = randomUUID();
    const result = await client.query<OutboxJob>(
      `
        WITH candidate AS (
          SELECT outbox.id
          FROM telegram_outbox AS outbox
          WHERE
            (outbox.status = 'pending' AND outbox.available_at <= clock_timestamp())
            OR (
              outbox.status = 'processing'
              AND outbox.locked_at <= clock_timestamp() - ($1::integer * interval '1 second')
            )
          ORDER BY outbox.id
          FOR UPDATE OF outbox SKIP LOCKED
          LIMIT 1
        )
        UPDATE telegram_outbox AS outbox
        SET
          status = 'processing',
          attempt_count = outbox.attempt_count + 1,
          locked_at = clock_timestamp(),
          lock_token = $2,
          updated_at = clock_timestamp()
        FROM candidate, leads
        WHERE outbox.id = candidate.id AND leads.submission_id = outbox.lead_id
        RETURNING
          outbox.id,
          outbox.lead_id,
          leads.lead_type,
          leads.telegram_message,
          outbox.attempt_count,
          outbox.lock_token
      `,
      [leaseSeconds, lockToken],
    );

    return result.rows[0];
  });
}

async function markDelivered(job: OutboxJob, telegramMessageId: number): Promise<void> {
  const result = await getPostgresPool().query(
    `
      UPDATE telegram_outbox
      SET
        status = 'delivered',
        telegram_message_id = $3,
        delivered_at = clock_timestamp(),
        locked_at = NULL,
        lock_token = NULL,
        last_error_code = NULL,
        updated_at = clock_timestamp()
      WHERE id = $1 AND status = 'processing' AND lock_token = $2
    `,
    [job.id, job.lock_token, telegramMessageId],
  );

  if (result.rowCount !== 1) {
    throw new Error("outbox_lease_lost");
  }
}

function isRetryable(code: LeadDeliveryErrorCode): boolean {
  return (
    code === "network" ||
    code === "timeout" ||
    code === "rate_limited" ||
    code === "telegram_rejected" ||
    code === "invalid_response"
  );
}

function getRetryDelaySeconds(error: LeadDeliveryError, attemptCount: number): number {
  const exponentialDelay = Math.min(15 * 60, 10 * 2 ** Math.max(0, attemptCount - 1));
  return Math.max(exponentialDelay, error.retryAfterSeconds ?? 0);
}

async function settleFailure(job: OutboxJob, error: LeadDeliveryError): Promise<void> {
  const shouldRetry = isRetryable(error.code) && job.attempt_count < maximumAttempts;
  const retryDelaySeconds = getRetryDelaySeconds(error, job.attempt_count);
  const result = await getPostgresPool().query(
    `
      UPDATE telegram_outbox
      SET
        status = $3::text,
        available_at = CASE
          WHEN $3::text = 'pending' THEN clock_timestamp() + ($4::integer * interval '1 second')
          ELSE available_at
        END,
        locked_at = NULL,
        lock_token = NULL,
        last_error_code = $5,
        updated_at = clock_timestamp()
      WHERE id = $1 AND status = 'processing' AND lock_token = $2
    `,
    [
      job.id,
      job.lock_token,
      shouldRetry ? "pending" : "dead_letter",
      retryDelaySeconds,
      error.code,
    ],
  );

  if (result.rowCount !== 1) {
    throw new Error("outbox_lease_lost");
  }

  writeEvent(shouldRetry ? "delivery_retry_scheduled" : "delivery_dead_letter", {
    outboxId: job.id,
    attempt: job.attempt_count,
    errorCode: error.code,
  });
}

async function processJob(job: OutboxJob): Promise<void> {
  try {
    const config = getTelegramConfig(job.lead_type);
    const telegramMessageId = await sendTelegramMessage(
      config,
      job.telegram_message,
    );
    await markDelivered(job, telegramMessageId);
    writeEvent("delivery_complete", {
      outboxId: job.id,
      attempt: job.attempt_count,
    });
  } catch (error) {
    const deliveryError =
      error instanceof LeadDeliveryError
        ? error
        : new LeadDeliveryError("invalid_response");
    await settleFailure(job, deliveryError);
  }
}

async function cleanup(retentionDays: number): Promise<void> {
  await withPostgresTransaction(async (client) => {
    await client.query(
      `
        DELETE FROM leads
        WHERE submission_id IN (
          SELECT leads.submission_id
          FROM leads
          INNER JOIN telegram_outbox ON telegram_outbox.lead_id = leads.submission_id
          WHERE
            telegram_outbox.status IN ('delivered', 'dead_letter')
            AND telegram_outbox.updated_at < clock_timestamp() - ($1::integer * interval '1 day')
        )
      `,
      [retentionDays],
    );
    await client.query(
      `
        DELETE FROM lead_rate_limits
        WHERE window_started_at < clock_timestamp() - interval '2 days'
      `,
    );
  });
  writeEvent("retention_cleanup_complete");
}

async function runWorker(signal: AbortSignal): Promise<void> {
  const config = getWorkerConfig();
  let nextCleanupAt = 0;

  for (const leadType of leadTypes) {
    getTelegramConfig(leadType);
  }

  writeEvent("worker_started");

  while (!signal.aborted) {
    if (Date.now() >= nextCleanupAt) {
      await cleanup(config.retentionDays);
      nextCleanupAt = Date.now() + cleanupIntervalMs;
    }

    const job = await claimJob();

    if (!job) {
      await sleep(pollIntervalMs, signal);
      continue;
    }

    await processJob(job);
  }

  writeEvent("worker_stopped");
}

const controller = new AbortController();
const stop = () => controller.abort();
process.once("SIGINT", stop);
process.once("SIGTERM", stop);

try {
  await runWorker(controller.signal);
} catch {
  process.stderr.write(`${JSON.stringify({ event: "worker_failed" })}\n`);
  process.exitCode = 1;
} finally {
  await closePostgresPool().catch(() => undefined);
}
