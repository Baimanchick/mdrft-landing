import type { MetadataRoute } from "next";

import { siteConfig } from "@/shared/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    display: "browser",
    background_color: "#050505",
    theme_color: "#050505",
    lang: siteConfig.language,
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
