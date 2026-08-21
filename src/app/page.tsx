"use client";

import React, { useState } from "react";
import { LanguageProvider, useLanguage } from "@/shared/lib/i18n/LanguageContext";
import { SmoothScrollProvider } from "@/shared/ui/smooth-scroll/SmoothScrollProvider";
import { Header } from "@/widgets/social-theme/ui/Header";
import { HeroSection } from "@/widgets/social-theme/ui/HeroSection";
import { AboutSection } from "@/widgets/social-theme/ui/AboutSection";
import { ServicesSection } from "@/widgets/social-theme/ui/ServicesSection";
import { MClubSection } from "@/widgets/social-theme/ui/MClubSection";
import { TrackDaysSection } from "@/widgets/social-theme/ui/TrackDaysSection";
import { TariffsSection } from "@/widgets/social-theme/ui/TariffsSection";
import { MOwnerEliteSection } from "@/widgets/social-theme/ui/MOwnerEliteSection";
import { Footer } from "@/widgets/social-theme/ui/Footer";
import { BookingModal } from "@/widgets/social-theme/ui/BookingModal";
import { CertificateModal } from "@/widgets/social-theme/ui/CertificateModal";
import { MClubModal } from "@/widgets/social-theme/ui/MClubModal";
import { PartnershipModal } from "@/widgets/social-theme/ui/PartnershipModal";
import { VideoPlaceholderBlock } from "@/widgets/social-theme/ui/VideoPlaceholderBlock";
import { SpeedometerPreloader } from "@/widgets/social-theme/ui/SpeedometerPreloader";
import { Bmw5ReelSection } from "@/widgets/social-theme/ui/Bmw5ReelSection";
import { BmwM2ReelSection } from "@/widgets/social-theme/ui/BmwM2ReelSection";
import { AudioPlayer } from "@/widgets/social-theme/ui/AudioPlayer";

function HomeContent() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isClubOpen, setIsClubOpen] = useState(false);
  const [isPartnershipOpen, setIsPartnershipOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedTariffId, setSelectedTariffId] = useState<string | undefined>(undefined);
  const [selectedCarModel, setSelectedCarModel] = useState<string | undefined>(undefined);
  const { t } = useLanguage();

  const handleOpenBooking = (tariffId?: string, carModel?: string) => {
    setSelectedTariffId(tariffId);
    setSelectedCarModel(carModel);
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    setSelectedTariffId(undefined);
    setSelectedCarModel(undefined);
  };

  return (
    <SmoothScrollProvider>
      {/* Interactive Speedometer HUD Preloader on Entrance */}
      <SpeedometerPreloader onComplete={() => setIsLoaded(true)} />

      <main className="min-h-screen bg-black text-white selection:bg-[#ea4043] selection:text-white relative">
        {/* Header */}
        <Header onOpenBooking={() => handleOpenBooking("pro-progress")} />

        {/* 1. Fullscreen Video Hero with 3 Interactive Action Buttons */}
        <HeroSection
          isLoaded={isLoaded}
          onOpenBooking={(carModel) => handleOpenBooking("pro-progress", carModel)}
          onOpenCertificate={() => setIsCertificateOpen(true)}
          onOpenClub={() => setIsClubOpen(true)}
        />

        {/* Interstitial Full-Width Video Slot 01 (~500px) */}
        <VideoPlaceholderBlock
          slotId="01"
          label={t.videoSlots.slot01}
        />

        {/* 2. About / Philosophy Section */}
        <AboutSection />

        {/* Interstitial Full-Width Video Slot 02 (~500px) */}
        <VideoPlaceholderBlock
          slotId="02"
          label={t.videoSlots.slot02}
        />

        {/* 3. Advantages / Why Us Section */}
        <ServicesSection onOpenBooking={() => handleOpenBooking("pro-progress")} />

        {/* 4 BMW M5 Video Reel Between Block 3 (Advantages) and Block 4 (M-Community) */}
        <Bmw5ReelSection />

        {/* 4. M-Community / Club Section */}
        <MClubSection />

        {/* Interstitial Full-Width Slot 03 (~500px) */}
        <VideoPlaceholderBlock
          slotId="03"
          label={t.videoSlots.slot03}
        />

        {/* СПЕЦСОБЫТИЯ И ТРЕК-ДНИ (Dedicated Section with Integrated Speed Video) */}
        <TrackDaysSection onOpenClub={() => setIsClubOpen(true)} />

        {/* Interstitial Full-Width Slot 04 (~500px) */}
        <VideoPlaceholderBlock
          slotId="04"
          label={t.videoSlots.slot04}
        />

        {/* 5. Tariffs & Programs Section (6 Symmetrical Cards) */}
        <TariffsSection onOpenBooking={(tariffId) => handleOpenBooking(tariffId)} />

        {/* Interstitial Full-Width Slot 05 (~500px) */}
        <VideoPlaceholderBlock
          slotId="05"
          label={t.videoSlots.slot05}
        />

        {/* 6. M-Owner Elite Program (Dedicated Standalone Flagship Block) */}
        <MOwnerEliteSection onOpenBooking={(tariffId) => handleOpenBooking(tariffId || "m-owner-elite")} />

        {/* Interstitial Full-Width Slot 06 (~500px) */}
        <VideoPlaceholderBlock
          slotId="06"
          label={t.videoSlots.slot06}
        />

        {/* 2 BMW M2 Video Reel Between Block 6 (Flagship) and Last Block (Footer) */}
        <BmwM2ReelSection
          onOpenBooking={() => handleOpenBooking("pro-progress")}
          onOpenCertificate={() => setIsCertificateOpen(true)}
          onOpenClub={() => setIsClubOpen(true)}
          onOpenPartnership={() => setIsPartnershipOpen(true)}
        />

        {/* Footer */}
        <Footer />

        {/* 1. Training Booking Modal */}
        <BookingModal
          isOpen={isBookingOpen}
          onClose={handleCloseBooking}
          initialTariffId={selectedTariffId}
          initialCarModel={selectedCarModel}
        />

        {/* 2. Gift Certificate Modal */}
        <CertificateModal
          isOpen={isCertificateOpen}
          onClose={() => setIsCertificateOpen(false)}
        />

        {/* 3. M-Community Private Club Modal */}
        <MClubModal
          isOpen={isClubOpen}
          onClose={() => setIsClubOpen(false)}
        />

        {/* 4. Partnership & Investment Modal */}
        <PartnershipModal
          isOpen={isPartnershipOpen}
          onClose={() => setIsPartnershipOpen(false)}
        />

        {/* 5. Fixed Bottom-Right Motorsport Audio Soundtrack Player */}
        <AudioPlayer />
      </main>
    </SmoothScrollProvider>
  );
}

export default function HomePage() {
  return (
    <LanguageProvider>
      <HomeContent />
    </LanguageProvider>
  );
}
