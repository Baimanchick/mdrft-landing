import { LanguageProvider } from "@/shared/lib/i18n/LanguageContext";
import { buildWebsiteJsonLd, JsonLd } from "@/shared/lib/seo";
import { LandingExperience } from "@/widgets/social-theme/ui/LandingExperience";

export default function HomePage() {
  const websiteJsonLd = buildWebsiteJsonLd();

  return (
    <>
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[10000] -translate-y-24 rounded bg-white px-4 py-3 font-semibold text-black transition-transform focus:translate-y-0"
      >
        Перейти к содержанию
      </a>
      {websiteJsonLd ? <JsonLd value={websiteJsonLd} /> : null}
      <LanguageProvider>
        <LandingExperience />
      </LanguageProvider>
    </>
  );
}
