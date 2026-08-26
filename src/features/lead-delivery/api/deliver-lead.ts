import "server-only";

import type { Lead } from "@/entities/lead";
import { formatLeadMessage } from "../lib/format-lead-message";
import { LeadDeliveryError } from "../model/lead-delivery-error";

const telegramTextLimit = 4_096;

export function createLeadMessage(lead: Lead, receivedAt: Date): string {
  const text = formatLeadMessage(lead, receivedAt);

  if (text.length > telegramTextLimit) {
    throw new LeadDeliveryError("message_too_long");
  }

  return text;
}
