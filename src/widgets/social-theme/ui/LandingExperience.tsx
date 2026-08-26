"use client";

import { MotionConfig } from "motion/react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import type { BookingProgramId } from "@/entities/lead";
import { APP_SHELL_ID } from "@/shared/ui/modal";
import { SmoothScrollProvider } from "@/shared/ui/smooth-scroll";
import { AboutSection } from "@/widgets/social-theme/ui/AboutSection";
import { AudioPlayer } from "@/widgets/social-theme/ui/AudioPlayer";
import { Bmw5ReelSection } from "@/widgets/social-theme/ui/Bmw5ReelSection";
import { BmwM2ReelSection } from "@/widgets/social-theme/ui/BmwM2ReelSection";
import { Footer } from "@/widgets/social-theme/ui/Footer";
import { Header } from "@/widgets/social-theme/ui/Header";
import { HeroSection } from "@/widgets/social-theme/ui/HeroSection";
import { MClubSection } from "@/widgets/social-theme/ui/MClubSection";
import { MOwnerEliteSection } from "@/widgets/social-theme/ui/MOwnerEliteSection";
import { ServicesSection } from "@/widgets/social-theme/ui/ServicesSection";
import { TariffsSection } from "@/widgets/social-theme/ui/TariffsSection";
import { TrackDaysSection } from "@/widgets/social-theme/ui/TrackDaysSection";
import { VideoPlaceholderBlock } from "@/widgets/social-theme/ui/VideoPlaceholderBlock";

const BookingModal = dynamic(
  () => import("@/widgets/social-theme/ui/BookingModal").then((module) => module.BookingModal),
  { ssr: false },
);
const CertificateModal = dynamic(
  () =>
    import("@/widgets/social-theme/ui/CertificateModal").then(
      (module) => module.CertificateModal,
    ),
  { ssr: false },
);
const MClubModal = dynamic(
  () => import("@/widgets/social-theme/ui/MClubModal").then((module) => module.MClubModal),
  { ssr: false },
);
const PartnershipModal = dynamic(
  () => import("@/widgets/social-theme/ui/PartnershipModal").then((module) => module.PartnershipModal),
  { ssr: false },
);

export function LandingExperience() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isClubOpen, setIsClubOpen] = useState(false);
  const [isPartnershipOpen, setIsPartnershipOpen] = useState(false);
  const [isUiRevealed, setIsUiRevealed] = useState(false);
  const [selectedTariffId, setSelectedTariffId] = useState<BookingProgramId>();
  const [selectedCarModel, setSelectedCarModel] = useState<string>();

  const triggerUiReveal = useCallback(() => {
    setIsUiRevealed(true);
  }, []);

  useEffect(() => {
    // Reveal UI at 4.2s (towards the end of first 7s video clip) as fallback
    const timer = setTimeout(() => {
      setIsUiRevealed(true);
    }, 4200);

    const handleUserInteraction = () => {
      if (window.scrollY > 20) {
        setIsUiRevealed(true);
      }
    };

    window.addEventListener("scroll", handleUserInteraction, { passive: true, once: true });
    window.addEventListener("touchstart", handleUserInteraction, { passive: true, once: true });
    window.addEventListener("keydown", handleUserInteraction, { passive: true, once: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
    };
  }, []);

  const openBooking = (tariffId?: BookingProgramId, carModel?: string) => {
    setSelectedTariffId(tariffId);
    setSelectedCarModel(carModel);
    setIsBookingOpen(true);
  };

  const closeBooking = () => {
    setIsBookingOpen(false);
    setSelectedTariffId(undefined);
    setSelectedCarModel(undefined);
  };

  return (
    <MotionConfig reducedMotion="user">
      <SmoothScrollProvider>
        <div
          id={APP_SHELL_ID}
          className="relative min-h-screen bg-black text-white selection:bg-[#ea4043] selection:text-white"
        >
          <Header
            isRevealed={isUiRevealed}
            onOpenBooking={() => openBooking("pro-progress")}
          />
          <main id="main-content" tabIndex={-1}>
            <HeroSection
              isRevealed={isUiRevealed}
              onFirstClipNearEnd={triggerUiReveal}
              onOpenBooking={(carModel) => openBooking("pro-progress", carModel)}
              onOpenCertificate={() => setIsCertificateOpen(true)}
              onOpenClub={() => setIsClubOpen(true)}
            />
            <VideoPlaceholderBlock />
            <AboutSection />
            <VideoPlaceholderBlock />
            <ServicesSection onOpenBooking={() => openBooking("pro-progress")} />
            <Bmw5ReelSection />
            <MClubSection />
            <VideoPlaceholderBlock />
            <TrackDaysSection onOpenClub={() => setIsClubOpen(true)} />
            <VideoPlaceholderBlock />
            <TariffsSection onOpenBooking={openBooking} />
            <VideoPlaceholderBlock />
            <MOwnerEliteSection
              onOpenBooking={(tariffId) => openBooking(tariffId || "m-owner-elite")}
            />
            <VideoPlaceholderBlock />
            <BmwM2ReelSection
              onOpenBooking={() => openBooking("pro-progress")}
              onOpenCertificate={() => setIsCertificateOpen(true)}
              onOpenClub={() => setIsClubOpen(true)}
              onOpenPartnership={() => setIsPartnershipOpen(true)}
            />
          </main>
          <Footer />
          <AudioPlayer isRevealed={isUiRevealed} />
        </div>
        {isBookingOpen ? (
          <BookingModal
            onClose={closeBooking}
            initialTariffId={selectedTariffId}
            initialCarModel={selectedCarModel}
          />
        ) : null}
        {isCertificateOpen ? (
          <CertificateModal onClose={() => setIsCertificateOpen(false)} />
        ) : null}
        {isClubOpen ? <MClubModal onClose={() => setIsClubOpen(false)} /> : null}
        {isPartnershipOpen ? (
          <PartnershipModal onClose={() => setIsPartnershipOpen(false)} />
        ) : null}
      </SmoothScrollProvider>
    </MotionConfig>
  );
}
