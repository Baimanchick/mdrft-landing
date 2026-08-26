import "server-only";

import { z } from "zod";
import type { LeadType } from "@/entities/lead";
import { LeadDeliveryError } from "../model/lead-delivery-error";

const botToken = z
  .string()
  .trim()
  .min(20)
  .max(512)
  .regex(/^\d+:[A-Za-z0-9_-]+$/u);

const chatId = z
  .string()
  .trim()
  .regex(/^-\d+$/u)
  .transform(Number)
  .refine(Number.isSafeInteger);

const messageThreadId = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z
    .string()
    .trim()
    .regex(/^\d+$/u)
    .transform(Number)
    .refine((value) => Number.isSafeInteger(value) && value > 0)
    .optional(),
);

const telegramConfigSchema = z.strictObject({
  botToken,
  chatId,
  messageThreadId,
});

export type TelegramConfig = z.output<typeof telegramConfigSchema>;

function getMessageThreadId(type: LeadType): string | undefined {
  const values: Record<LeadType, string | undefined> = {
    booking: process.env.TELEGRAM_TOPIC_BOOKING_ID,
    certificate: process.env.TELEGRAM_TOPIC_CERTIFICATE_ID,
    club: process.env.TELEGRAM_TOPIC_CLUB_ID,
    partnership: process.env.TELEGRAM_TOPIC_PARTNERSHIP_ID,
  };
  const configuredTopicCount = Object.values(values).filter(
    (value) => value !== undefined && value.trim() !== "",
  ).length;

  if (configuredTopicCount !== 0 && configuredTopicCount !== Object.keys(values).length) {
    throw new LeadDeliveryError("configuration");
  }

  return values[type];
}

export function getTelegramConfig(type: LeadType): TelegramConfig {
  const result = telegramConfigSchema.safeParse({
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    chatId: process.env.TELEGRAM_LEADS_CHAT_ID,
    messageThreadId: getMessageThreadId(type),
  });

  if (!result.success) {
    throw new LeadDeliveryError("configuration");
  }

  return result.data;
}
