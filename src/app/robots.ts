import type { MetadataRoute } from "next";

import { absoluteUrl, siteConfig } from "@/shared/config/site";

export default function robots(): MetadataRoute.Robots {
  if (!siteConfig.url) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: absoluteUrl("/sitemap.xml") ?? undefined,
    host: siteConfig.url,
  };
}
