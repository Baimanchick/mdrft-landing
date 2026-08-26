import type { Lead } from "@/entities/lead";

const leadTitles = {
  booking: "Бронирование тренировки",
  certificate: "Подарочный сертификат",
  club: "Заявка в M-Community",
  partnership: "Партнёрство",
} as const;

const programTitles = {
  "first-touch": "First Touch",
  "asphalt-start": "Asphalt Start",
  "pro-progress": "Pro Progress",
  "mastery-control": "Mastery Control",
  "adm-track": "ADM Race Track Experience",
  "m-owner-elite": "M-Owner Elite Program",
  "custom-car": "Индивидуальная тренировка на своём BMW M",
} as const;

const directionTitles = {
  invest: "Инвестиции",
  brand: "Бренд-партнёрство",
  collab: "Спецпроект / коллаборация",
  proposal: "Собственное предложение",
} as const;

function optionalLine(label: string, value: string | undefined): string {
  return `${label}: ${value ?? "—"}`;
}

function formatAmount(amount: number): string {
  return `${amount.toLocaleString("ru-RU")} ₽`;
}

function indentMultiline(value: string): string {
  return value
    .split("\n")
    .map((line) => `  ${line}`)
    .join("\n");
}

function formatDetails(lead: Lead): readonly string[] {
  switch (lead.type) {
    case "booking":
      return [
        `Программа: ${programTitles[lead.programId]}`,
        `Автомобиль: ${lead.carModel}`,
        `Имя: ${lead.name}`,
        `Телефон: ${lead.phone}`,
        optionalLine("Telegram / WhatsApp", lead.telegram),
      ];
    case "certificate": {
      const plan =
        lead.plan.kind === "custom"
          ? `Свой номинал — ${formatAmount(lead.plan.amount)}`
          : programTitles[lead.plan.id];

      return [
        `Сертификат: ${plan}`,
        `Формат: ${lead.deliveryType === "digital" ? "Электронный PDF" : "Подарочный бокс"}`,
        optionalLine("Получатель", lead.recipientName),
        `Покупатель: ${lead.buyerName}`,
        `Телефон: ${lead.phone}`,
        `Email: ${lead.email}`,
      ];
    }
    case "club":
      return [
        `Автомобиль: ${lead.carModel}`,
        `Имя: ${lead.name}`,
        `Телефон: ${lead.phone}`,
        optionalLine("Telegram", lead.telegram),
        optionalLine("Город", lead.city),
      ];
    case "partnership":
      return [
        `Направление: ${directionTitles[lead.direction]}`,
        `Контактное лицо: ${lead.name}`,
        optionalLine("Компания / бренд", lead.company),
        `Телефон: ${lead.phone}`,
        optionalLine("Telegram / Email", lead.contactMethod),
        lead.comment ? `Комментарий:\n${indentMultiline(lead.comment)}` : "Комментарий: —",
      ];
  }
}

export function formatLeadMessage(lead: Lead, receivedAt: Date): string {
  return [
    `Новая заявка — ${leadTitles[lead.type]}`,
    `ID: ${lead.submissionId}`,
    `Получено: ${receivedAt.toISOString()}`,
    `Язык формы: ${lead.locale.toUpperCase()}`,
    "",
    ...formatDetails(lead),
  ].join("\n");
}
