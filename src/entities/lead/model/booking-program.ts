export const bookingProgramIds = [
  "first-touch",
  "asphalt-start",
  "pro-progress",
  "mastery-control",
  "adm-track",
  "m-owner-elite",
  "custom-car",
] as const;

export type BookingProgramId = (typeof bookingProgramIds)[number];

export function isBookingProgramId(value: string): value is BookingProgramId {
  return bookingProgramIds.some((programId) => programId === value);
}
