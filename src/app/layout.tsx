import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "M-Drift School | №1 Дрифт-школа BMW M-серии в России",
  description:
    "Чистый контроль. Баварский характер. Уличный бэкграунд. Обучение дрифту исключительно на BMW M2, M3, M4, M5, M8 без гидроручников — только инерция, масса и газ. Автодром ADM Raceway.",
  keywords: [
    "дрифт школа",
    "BMW M drift",
    "BMW M3 drift",
    "BMW M4 drift",
    "ADM Raceway дрифт",
    "контраварийная подготовка BMW",
    "M-Club Russia",
  ],
  openGraph: {
    title: "M-Drift School | №1 Дрифт-школа BMW M-серии",
    description: "Чистый контроль. Баварский характер. Уличный бэкграунд.",
    type: "website",
    locale: "ru_RU",
  },
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
