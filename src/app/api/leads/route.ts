import { leadSchema, type LeadApiErrorCode } from "@/entities/lead";
import {
  acceptLead,
  createLeadIntakeContext,
  getLeadAllowedOrigin,
  isLeadSubmissionEnabled,
  LeadIntakeError,
} from "@/features/lead-intake";

export const runtime = "nodejs";

const maxBodySize = 16 * 1024;
const bodyReadTimeoutMs = 5_000;

type BodyReadResult =
  | { readonly ok: true; readonly text: string }
  | { readonly ok: false; readonly reason: "payload_too_large" | "request_timeout" };

class BodyReadTimeoutError extends Error {}

function jsonResponse(body: unknown, status: number, retryAfterSeconds?: number): Response {
  const headers = new Headers({
    "Cache-Control": "no-store",
  });

  if (retryAfterSeconds !== undefined) {
    headers.set("Retry-After", String(retryAfterSeconds));
  }

  return Response.json(body, { status, headers });
}

function errorResponse(
  code: LeadApiErrorCode,
  status: number,
  retryAfterSeconds?: number,
): Response {
  return jsonResponse({ ok: false, code }, status, retryAfterSeconds);
}

function isAllowedOrigin(request: Request, allowedOrigin: string): boolean {
  const origin = request.headers.get("origin");

  if (!origin) {
    return false;
  }

  try {
    return new URL(origin).origin === allowedOrigin;
  } catch {
    return false;
  }
}

function hasSupportedContentType(request: Request): boolean {
  const contentType = request.headers.get("content-type");

  if (!contentType) {
    return false;
  }

  return contentType.split(";", 1)[0]?.trim().toLowerCase() === "application/json";
}

function hasSupportedContentEncoding(request: Request): boolean {
  const contentEncoding = request.headers.get("content-encoding");
  return contentEncoding === null || contentEncoding.trim().toLowerCase() === "identity";
}

function exceedsDeclaredBodySize(request: Request): boolean {
  const contentLength = request.headers.get("content-length");

  if (!contentLength || !/^\d+$/u.test(contentLength)) {
    return false;
  }

  return Number(contentLength) > maxBodySize;
}

async function readBody(request: Request): Promise<BodyReadResult> {
  if (!request.body) {
    return { ok: true, text: "" };
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalSize = 0;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new BodyReadTimeoutError()), bodyReadTimeoutMs);
  });

  try {
    while (true) {
      const chunk = await Promise.race([reader.read(), timeout]);

      if (chunk.done) {
        break;
      }

      totalSize += chunk.value.byteLength;

      if (totalSize > maxBodySize) {
        await reader.cancel().catch(() => undefined);
        return { ok: false, reason: "payload_too_large" };
      }

      chunks.push(chunk.value);
    }
  } catch (error) {
    if (error instanceof BodyReadTimeoutError) {
      await reader.cancel().catch(() => undefined);
      return { ok: false, reason: "request_timeout" };
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  const body = new Uint8Array(totalSize);
  let offset = 0;

  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return {
    ok: true,
    text: new TextDecoder("utf-8", { fatal: true }).decode(body),
  };
}

function getIntakeFailureResponse(error: LeadIntakeError): Response {
  return error.code === "configuration"
    ? errorResponse("configuration", 503)
    : errorResponse("delivery_unavailable", 503);
}

function successResponse(submissionId: string): Response {
  return jsonResponse({ ok: true, submissionId }, 200);
}

export async function POST(request: Request): Promise<Response> {
  if (!isLeadSubmissionEnabled()) {
    return errorResponse("disabled", 503);
  }

  const allowedOrigin = getLeadAllowedOrigin();

  if (!allowedOrigin) {
    return errorResponse("configuration", 503);
  }

  if (!isAllowedOrigin(request, allowedOrigin)) {
    return errorResponse("forbidden", 403);
  }

  if (!hasSupportedContentType(request) || !hasSupportedContentEncoding(request)) {
    return errorResponse("unsupported_media_type", 415);
  }

  if (exceedsDeclaredBodySize(request)) {
    return errorResponse("payload_too_large", 413);
  }

  let intakeContext: ReturnType<typeof createLeadIntakeContext>;

  try {
    intakeContext = createLeadIntakeContext(request);
  } catch (error) {
    return error instanceof LeadIntakeError
      ? getIntakeFailureResponse(error)
      : errorResponse("delivery_unavailable", 503);
  }

  let bodyResult: BodyReadResult;

  try {
    bodyResult = await readBody(request);
  } catch {
    return errorResponse("invalid_request", 400);
  }

  if (!bodyResult.ok) {
    return bodyResult.reason === "payload_too_large"
      ? errorResponse("payload_too_large", 413)
      : errorResponse("request_timeout", 408);
  }

  let payload: unknown;

  try {
    payload = JSON.parse(bodyResult.text);
  } catch {
    return errorResponse("invalid_request", 400);
  }

  const leadResult = leadSchema.safeParse(payload);

  if (!leadResult.success) {
    return errorResponse("invalid_request", 400);
  }

  let intakeResult: Awaited<ReturnType<typeof acceptLead>>;

  try {
    intakeResult = await acceptLead(intakeContext, leadResult.data);
  } catch (error) {
    return error instanceof LeadIntakeError
      ? getIntakeFailureResponse(error)
      : errorResponse("delivery_unavailable", 503);
  }

  if (intakeResult.status === "conflict") {
    return errorResponse("idempotency_conflict", 409);
  }

  if (intakeResult.status === "rate_limited") {
    return errorResponse("rate_limited", 429, intakeResult.retryAfterSeconds);
  }

  return successResponse(leadResult.data.submissionId);
}
