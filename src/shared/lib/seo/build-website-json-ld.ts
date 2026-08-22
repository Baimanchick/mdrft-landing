import { absoluteUrl, siteConfig } from "@/shared/config/site";
import type { JsonLdDocument } from "./json-ld";

export const buildWebsiteJsonLd = (): JsonLdDocument | null => {
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
