const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

const resolveSiteOrigin = (): string | null => {
  if (!rawSiteUrl) {
    return null;
  }

  const url = new URL(rawSiteUrl);

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_SITE_URL must use http or https");
  }

  return url.origin;
};

export const siteConfig = {
  name: "M Drift School",
  shortName: "M Drift",
  title: "M Drift School — школа управления BMW M",
  description:
    "Школа управляемого заноса и уверенного владения автомобилями BMW M-серии: индивидуальные тренировки, контраварийная и трековая подготовка.",
  locale: "ru_RU",
  language: "ru",
  url: resolveSiteOrigin(),
} as const;

export const absoluteUrl = (path = "/"): string | null => {
  if (!siteConfig.url) {
    return null;
  }

  return new URL(path, siteConfig.url).toString();
};
