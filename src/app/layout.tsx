import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { absoluteUrl, siteConfig } from "@/shared/config/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
});

const canonicalUrl = absoluteUrl("/");

export const metadata: Metadata = {
  metadataBase: siteConfig.url ? new URL(siteConfig.url) : undefined,
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "дрифт школа",
    "BMW M drift",
    "обучение дрифту",
    "контраварийная подготовка",
    "трековая подготовка",
  ],
  alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    url: canonicalUrl ?? undefined,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: canonicalUrl
    ? { index: true, follow: true }
    : { index: false, follow: false, noarchive: true },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#040404",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`dark ${inter.variable}`}>
      <body className="antialiased bg-[#040404] text-[#f5f5f7]">{children}</body>
    </html>
  );
}
