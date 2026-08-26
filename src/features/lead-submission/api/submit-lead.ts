import {
  isLeadApiErrorCode,
  type LeadApiErrorCode,
  type LeadDraft,
} from "@/entities/lead";

const requestTimeoutMs = 25_000;
const maxResponseSize = 4_096;

export type LeadSubmissionFailureReason =
  | "disabled"
  | "forbidden"
  | "rate_limited"
  | "validation"
  | "uncertain"
  | "unavailable"
  | "unexpected";

export type LeadSubmissionResult =
  | { readonly ok: true }
  | {
      readonly ok: false;
      readonly reason: LeadSubmissionFailureReason;
      readonly retryAfterSeconds?: number;
    };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseRetryAfter(value: string | null): number | undefined {
  if (!value || !/^\d+$/u.test(value)) {
    return undefined;
  }

  const seconds = Number(value);
  return Number.isSafeInteger(seconds) && seconds > 0 ? seconds : undefined;
}

function mapApiError(
  code: LeadApiErrorCode,
  retryAfterSeconds: number | undefined,
): LeadSubmissionResult {
  if (code === "rate_limited") {
    return retryAfterSeconds === undefined
      ? { ok: false, reason: "rate_limited" }
      : { ok: false, reason: "rate_limited", retryAfterSeconds };
  }

  if (code === "disabled") {
    return { ok: false, reason: "disabled" };
  }

  if (code === "forbidden") {
    return { ok: false, reason: "forbidden" };
  }

  if (code === "invalid_request") {
    return { ok: false, reason: "validation" };
  }

  if (code === "configuration") {
    return { ok: false, reason: "unavailable" };
  }

  if (
    code === "delivery_unavailable" ||
    code === "delivery_ambiguous" ||
    code === "submission_in_progress" ||
    code === "idempotency_conflict" ||
    code === "request_timeout"
  ) {
    return { ok: false, reason: "uncertain" };
  }

  return { ok: false, reason: "unexpected" };
}

export async function submitLead(
  draft: LeadDraft,
  submissionId: string,
): Promise<LeadSubmissionResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...draft, submissionId }),
      cache: "no-store",
      credentials: "same-origin",
      mode: "same-origin",
      redirect: "error",
      signal: controller.signal,
    });
    const contentType = response.headers.get("content-type");
    const responseText = await response.text();

    if (
      !contentType?.toLowerCase().startsWith("application/json") ||
      responseText.length > maxResponseSize
    ) {
      return { ok: false, reason: "uncertain" };
    }

    let payload: unknown;

    try {
      payload = JSON.parse(responseText);
    } catch {
      return { ok: false, reason: "uncertain" };
    }

    if (!isRecord(payload) || typeof payload.ok !== "boolean") {
      return { ok: false, reason: "uncertain" };
    }

    if (payload.ok) {
      return response.ok && payload.submissionId === submissionId
        ? { ok: true }
        : { ok: false, reason: "uncertain" };
    }

    if (!isLeadApiErrorCode(payload.code)) {
      return { ok: false, reason: "uncertain" };
    }

    return mapApiError(
      payload.code,
      parseRetryAfter(response.headers.get("retry-after")),
    );
  } catch {
    return { ok: false, reason: "uncertain" };
  } finally {
    clearTimeout(timeoutId);
  }
}
