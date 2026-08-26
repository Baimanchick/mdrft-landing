import { z } from "zod";
import { bookingProgramIds } from "./booking-program";

const singleLineControlCharacters =
  /[\u0000-\u001f\u007f-\u009f\u061c\u200b-\u200f\u2028-\u202e\u2060\u2066-\u2069\ufeff]/u;
const multilineControlCharacters =
  /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f\u061c\u200b-\u200f\u2028-\u202e\u2060\u2066-\u2069\ufeff]/u;
const phoneCharacters = /^[+\d().\-\s]+$/u;

function singleLine(minLength: number, maxLength: number) {
  return z
    .string()
    .trim()
    .min(minLength)
    .max(maxLength)
    .refine((value) => !singleLineControlCharacters.test(value));
}

function optionalSingleLine(maxLength: number) {
  return z
    .string()
    .trim()
    .max(maxLength)
    .refine((value) => !singleLineControlCharacters.test(value))
    .transform((value) => value || undefined)
    .optional();
}

const optionalMultiline = z
  .string()
  .trim()
  .max(1000)
  .refine((value) => !multilineControlCharacters.test(value))
  .transform((value) => value.replace(/\r\n?/gu, "\n") || undefined)
  .optional();

const phone = singleLine(7, 32)
  .refine((value) => phoneCharacters.test(value))
  .refine((value) => {
    const digitCount = value.replace(/\D/gu, "").length;
    return digitCount >= 7 && digitCount <= 15;
  });

const email = z.string().trim().max(254).pipe(z.email());

const commonLeadShape = {
  submissionId: z.uuidv4(),
  locale: z.enum(["ru", "en"]),
  privacyConsent: z.literal(true),
} as const;

const bookingLeadSchema = z.strictObject({
  ...commonLeadShape,
  type: z.literal("booking"),
  programId: z.enum(bookingProgramIds),
  carModel: singleLine(2, 120),
  name: singleLine(1, 100),
  phone,
  telegram: optionalSingleLine(100),
});

const certificateLeadSchema = z.strictObject({
  ...commonLeadShape,
  type: z.literal("certificate"),
  plan: z.discriminatedUnion("kind", [
    z.strictObject({
      kind: z.literal("preset"),
      id: z.enum([
        "first-touch",
        "asphalt-start",
        "pro-progress",
        "mastery-control",
      ]),
    }),
    z.strictObject({
      kind: z.literal("custom"),
      amount: z.number().int().min(30_000).refine(Number.isSafeInteger),
    }),
  ]),
  deliveryType: z.enum(["digital", "box"]),
  recipientName: optionalSingleLine(100),
  buyerName: singleLine(1, 100),
  phone,
  email,
});

const clubLeadSchema = z.strictObject({
  ...commonLeadShape,
  type: z.literal("club"),
  carModel: singleLine(2, 120),
  name: singleLine(1, 100),
  phone,
  telegram: optionalSingleLine(100),
  city: optionalSingleLine(100),
});

const partnershipLeadSchema = z.strictObject({
  ...commonLeadShape,
  type: z.literal("partnership"),
  direction: z.enum(["invest", "brand", "collab", "proposal"]),
  name: singleLine(1, 100),
  company: optionalSingleLine(150),
  phone,
  contactMethod: optionalSingleLine(160),
  comment: optionalMultiline,
});

export const leadSchema = z.union([
  bookingLeadSchema,
  certificateLeadSchema,
  clubLeadSchema,
  partnershipLeadSchema,
]);

export type Lead = z.output<typeof leadSchema>;
export type LeadType = Lead["type"];
export type BookingLead = Extract<Lead, { readonly type: "booking" }>;
export type CertificateLead = Extract<Lead, { readonly type: "certificate" }>;
export type ClubLead = Extract<Lead, { readonly type: "club" }>;
export type PartnershipLead = Extract<Lead, { readonly type: "partnership" }>;
export type PartnershipDirection = PartnershipLead["direction"];
export type LeadDraft = Lead extends infer LeadItem
  ? LeadItem extends Lead
    ? Omit<LeadItem, "submissionId">
    : never
  : never;
