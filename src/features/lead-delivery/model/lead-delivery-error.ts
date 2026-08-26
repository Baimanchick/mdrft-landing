export type LeadDeliveryErrorCode =
  | "configuration"
  | "message_too_long"
  | "network"
  | "timeout"
  | "rate_limited"
  | "chat_migrated"
  | "telegram_rejected"
  | "invalid_response";

type LeadDeliveryErrorOptions = {
  readonly retryAfterSeconds?: number;
};

export class LeadDeliveryError extends Error {
  readonly code: LeadDeliveryErrorCode;
  readonly retryAfterSeconds?: number;

  constructor(code: LeadDeliveryErrorCode, options: LeadDeliveryErrorOptions = {}) {
    super(code);
    this.name = "LeadDeliveryError";
    this.code = code;
    this.retryAfterSeconds = options.retryAfterSeconds;
  }
}
