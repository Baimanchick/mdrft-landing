import "server-only";

export { acceptLead, createLeadIntakeContext } from "./api/lead-intake";
export {
  getLeadAllowedOrigin,
  isLeadSubmissionEnabled,
} from "./api/lead-submission-config";
export { LeadIntakeError } from "./model/lead-intake-error";
