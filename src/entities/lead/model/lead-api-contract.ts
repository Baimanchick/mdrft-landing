export const leadApiErrorCodes = [
  "disabled",
  "configuration",
  "forbidden",
  "unsupported_media_type",
  "payload_too_large",
  "request_timeout",
  "invalid_request",
  "rate_limited",
  "submission_in_progress",
  "idempotency_conflict",
  "delivery_ambiguous",
  "delivery_unavailable",
] as const;

export type LeadApiErrorCode = (typeof leadApiErrorCodes)[number];

export type LeadApiResponse =
  | {
      readonly ok: true;
      readonly submissionId: string;
    }
  | {
      readonly ok: false;
      readonly code: LeadApiErrorCode;
    };

export function isLeadApiErrorCode(value: unknown): value is LeadApiErrorCode {
  return typeof value === "string" && leadApiErrorCodes.some((code) => code === value);
}
