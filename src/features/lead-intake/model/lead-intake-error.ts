export type LeadIntakeErrorCode = "configuration" | "unavailable";

export class LeadIntakeError extends Error {
  readonly code: LeadIntakeErrorCode;

  constructor(code: LeadIntakeErrorCode) {
    super(code);
    this.name = "LeadIntakeError";
    this.code = code;
  }
}
