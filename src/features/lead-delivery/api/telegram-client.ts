import "server-only";

import { z } from "zod";
import { LeadDeliveryError } from "../model/lead-delivery-error";
import type { TelegramConfig } from "./telegram-config";

const safeInteger = z.number().int().refine(Number.isSafeInteger);

const telegramResponseSchema = z.discriminatedUnion("ok", [
  z.object({
    ok: z.literal(true),
    result: z.object({
      message_id: safeInteger,
      message_thread_id: safeInteger.optional(),
      chat: z.object({
        id: safeInteger,
      }),
    }),
  }),
  z.object({
    ok: z.literal(false),
    error_code: z.number().int(),
    description: z.string().optional(),
    parameters: z
      .object({
        migrate_to_chat_id: safeInteger.optional(),
        retry_after: z.number().int().positive().optional(),
      })
      .optional(),
  }),
]);

const telegramRequestTimeoutMs = 8_000;

export async function sendTelegramMessage(
  config: TelegramConfig,
  text: string,
): Promise<number> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), telegramRequestTimeoutMs);

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${config.botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: config.chatId,
          message_thread_id: config.messageThreadId,
          text,
          link_preview_options: {
            is_disabled: true,
          },
          protect_content: true,
        }),
        cache: "no-store",
        signal: controller.signal,
      },
    );
    let payload: unknown;

    try {
      payload = await response.json();
    } catch {
      throw new LeadDeliveryError(
        controller.signal.aborted ? "timeout" : "invalid_response",
      );
    }

    const result = telegramResponseSchema.safeParse(payload);

    if (!result.success) {
      throw new LeadDeliveryError("invalid_response");
    }

    if (!result.data.ok) {
      if (result.data.parameters?.retry_after) {
        throw new LeadDeliveryError("rate_limited", {
          retryAfterSeconds: result.data.parameters.retry_after,
        });
      }

      if (result.data.parameters?.migrate_to_chat_id) {
        throw new LeadDeliveryError("chat_migrated");
      }

      throw new LeadDeliveryError("telegram_rejected");
    }

    if (!response.ok || result.data.result.chat.id !== config.chatId) {
      throw new LeadDeliveryError("invalid_response");
    }

    if (
      config.messageThreadId !== undefined &&
      result.data.result.message_thread_id !== config.messageThreadId
    ) {
      throw new LeadDeliveryError("invalid_response");
    }

    return result.data.result.message_id;
  } catch (error) {
    if (error instanceof LeadDeliveryError) {
      throw error;
    }

    throw new LeadDeliveryError(controller.signal.aborted ? "timeout" : "network");
  } finally {
    clearTimeout(timeoutId);
  }
}
