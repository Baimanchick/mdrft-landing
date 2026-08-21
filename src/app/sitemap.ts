import type { MetadataRoute } from "next";

import { siteConfig } from "@/shared/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteConfig.url) {
    return [];
  }

  return [
    {
      url: siteConfig.url,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
