import "server-only";

import { z } from "zod";
import { LeadIntakeError } from "../model/lead-intake-error";

const leadIntakeConfigSchema = z.strictObject({
  clientIpSource: z.enum(["reverse-proxy", "local"]),
  hmacSecret: z.string().min(32).max(512).regex(/^\S+$/u),
});

export type LeadIntakeConfig = z.output<typeof leadIntakeConfigSchema>;

export function getLeadIntakeConfig(): LeadIntakeConfig {
  const result = leadIntakeConfigSchema.safeParse({
    clientIpSource: process.env.LEAD_CLIENT_IP_SOURCE?.trim().toLowerCase(),
    hmacSecret: process.env.LEAD_PROTECTION_HMAC_SECRET?.trim(),
  });

  if (!result.success) {
    throw new LeadIntakeError("configuration");
  }

  return result.data;
}
