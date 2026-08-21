import type { WebSite, WithContext } from "schema-dts";

import { absoluteUrl, siteConfig } from "@/shared/config/site";

export const buildWebsiteJsonLd = (): WithContext<WebSite> | null => {
  if (!siteConfig.url) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: siteConfig.language,
    url: absoluteUrl("/") ?? siteConfig.url,
  };
};
