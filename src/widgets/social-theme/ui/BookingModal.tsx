"use client";

import React, { useState, useId, useMemo } from "react";
import { motion } from "motion/react";
import {
  isBookingProgramId,
  type BookingProgramId,
} from "@/entities/lead";
import {
  LeadConsentField,
  LeadSubmissionFeedback,
  LeadSubmissionSuccess,
  useLeadSubmission,
} from "@/features/lead-submission";
import { useLanguage } from "@/shared/lib/i18n/LanguageContext";
import { useModalA11y } from "@/shared/ui/modal";
import { CustomDropdown } from "@/shared/ui/dropdown/CustomDropdown";

interface BookingModalProps {
  onClose: () => void;
  initialTariffId?: BookingProgramId;
  initialCarModel?: string;
}

export function BookingModal({
  onClose,
  initialTariffId,
  initialCarModel,
}: BookingModalProps) {
  const [selectedTariff, setSelectedTariff] = useState<BookingProgramId>(
    () => initialTariffId ?? "pro-progress",
  );
  const [car, setCar] = useState(
    () => initialCarModel || "BMW M3 Competition (G80 / F80)",
  );
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [telegram, setTelegram] = useState("");
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const { state, submit, isSubmitting, isSucceeded } = useLeadSubmission();
  const { lang, t } = useLanguage();
  const isRu = lang === "ru";
  const titleId = useId();
  const { panelRef, dialogProps } = useModalA11y({
    onClose: () => {
      if (!isSubmitting) onClose();
    },
    labelledById: titleId,
  });

  const currentProgramObj = useMemo(() => {
    return t.bookingModal.programs.find((program) => program.id === selectedTariff);
  }, [selectedTariff, t.bookingModal.programs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!privacyConsent || !currentProgramObj) return;

    const normalizedTelegram = telegram.trim();
    void submit({
      type: "booking",
      locale: lang,
      privacyConsent: true,
      programId: selectedTariff,
      carModel: car,
      name,
      phone,
      ...(normalizedTelegram ? { telegram: normalizedTelegram } : {}),
    });
  };

  const requestClose = () => {
    if (!isSubmitting) onClose();
  };

  return (
    <div
      {...dialogProps}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 lg:p-8 overflow-y-auto no-scrollbar font-sans"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        aria-hidden="true"
        onClick={requestClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-xl"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        ref={panelRef}
        tabIndex={-1}
        data-lenis-prevent="true"
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl xl:max-w-6xl max-h-[96vh] bg-[#08080c] border border-white/15 p-6 sm:p-8 lg:p-10 xl:p-12 rounded-2xl z-10 my-auto shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_60px_rgba(234,64,67,0.08)] transform-gpu flex flex-col justify-between overflow-y-auto lg:overflow-visible no-scrollbar"
      >
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#ea4043]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#0066b1]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20">
          <button
            onClick={requestClose}
            disabled={isSubmitting}
            className="w-11 h-11 rounded-full flex items-center justify-center bg-white/5 border border-white/15 text-[#a0a0a8] hover:text-white hover:bg-white/15 hover:border-white/30 cursor-pointer transition-all"
            aria-label={isRu ? "Закрыть" : "Close"}
          >
            ✕
          </button>
        </div>

        {!isSucceeded ? (
          <form
            onSubmit={handleSubmit}
            aria-busy={isSubmitting}
            className="relative z-10 w-full"
          >
            <fieldset disabled={isSubmitting} className="contents">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-stretch">
              <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                <div className="space-y-3 pr-4">
                  <span className="text-xs sm:text-sm uppercase tracking-widest text-[#ea4043] font-bold block">
                    {isRu ? "// ОНЛАЙН-БРОНИРОВАНИЕ • ADM RACEWAY" : "// ONLINE BOOKING • ADM RACEWAY"}
                  </span>
                  <h3
                    id={titleId}
                    className="text-3xl sm:text-4xl xl:text-5xl font-bold uppercase tracking-tight text-white leading-tight"
                  >
                    {isRu ? "ЗАПИСЬ НА ТРЕНИРОВКУ" : "BOOK TRAINING"}
                    <span className="text-gradient-red">.</span>
                  </h3>
                  <p className="text-sm sm:text-base text-[#a0a0a8] font-normal leading-relaxed">
                    {isRu
                      ? "Выберите автомобиль и программу. Шеф-инструктор свяжется с вами для согласования даты и времени заезда."
                      : "Select your car and training program. The chief instructor will reach out to schedule your session."}
                  </p>
                </div>

                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#1c1c24] via-[#111117] to-[#08080c] border border-white/20 relative overflow-hidden shadow-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#ea4043] font-bold">
                      {isRu ? "ВЫБРАННЫЙ СЛОТ" : "SELECTED SLOT"}
                    </span>
                    <span className="text-xs font-mono text-[#a0a0a8] border border-white/15 px-2 py-0.5 rounded bg-black/40">
                      ADM RACEWAY
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs text-[#8e8e93] uppercase font-bold tracking-wider">
                      {isRu ? "Автомобиль:" : "Car:"}
                    </div>
                    <div className="text-lg sm:text-xl font-bold uppercase text-white tracking-tight">
                      {car}
                    </div>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-white/10">
                    <div className="text-xs text-[#8e8e93] uppercase font-bold tracking-wider">
                      {isRu ? "Программа:" : "Program:"}
                    </div>
                    <div className="text-sm sm:text-base font-medium text-[#d1d1d6] line-clamp-2">
                      {currentProgramObj?.label || selectedTariff}
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs sm:text-sm text-[#b5b5bd] flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ea4043] shrink-0" />
                  <span>{t.bookingModal.instructorNote}</span>
                </div>
              </div>

              <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                  <span className="block text-sm sm:text-base uppercase tracking-wider text-white font-bold">
                    {isRu ? "1. Параметры тренировки" : "1. Training Parameters"}
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <CustomDropdown
                      label={t.bookingModal.carLabel}
                      value={car}
                      options={t.bookingModal.cars}
                      onChange={(val) => setCar(val)}
                    />

                    <CustomDropdown
                      label={t.bookingModal.programLabel}
                      value={selectedTariff}
                      options={t.bookingModal.programs}
                      onChange={(value) => {
                        if (isBookingProgramId(value)) setSelectedTariff(value);
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <span className="block text-sm sm:text-base uppercase tracking-wider text-white font-bold">
                    {isRu ? "2. Контактные данные пилота" : "2. Pilot Contact Details"}
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor={`${titleId}-name`}
                        className="block text-xs uppercase tracking-wider text-[#a0a0a8] font-bold mb-1.5"
                      >
                        {t.bookingModal.nameLabel}
                      </label>
                      <input
                        id={`${titleId}-name`}
                        name="name"
                        autoComplete="name"
                        type="text"
                        required
                        maxLength={100}
                        placeholder={t.bookingModal.namePlaceholder}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white/[0.04] hover:bg-white/[0.07] focus:bg-white/[0.08] border border-white/15 focus:border-[#ea4043] rounded-xl px-4.5 py-3.5 text-white text-sm sm:text-base placeholder:text-[#55555c] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`${titleId}-phone`}
                        className="block text-xs uppercase tracking-wider text-[#a0a0a8] font-bold mb-1.5"
                      >
                        {t.bookingModal.phoneLabel}
                      </label>
                      <input
                        id={`${titleId}-phone`}
                        name="phone"
                        autoComplete="tel"
                        type="tel"
                        required
                        minLength={7}
                        maxLength={32}
                        pattern="[+0-9().\s-]+"
                        placeholder={t.bookingModal.phonePlaceholder}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white/[0.04] hover:bg-white/[0.07] focus:bg-white/[0.08] border border-white/15 focus:border-[#ea4043] rounded-xl px-4.5 py-3.5 text-white text-sm sm:text-base placeholder:text-[#55555c] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor={`${titleId}-telegram`}
                      className="block text-xs uppercase tracking-wider text-[#a0a0a8] font-bold mb-1.5"
                    >
                      {t.bookingModal.tgLabel}
                    </label>
                    <input
                      id={`${titleId}-telegram`}
                      name="telegram"
                      autoComplete="off"
                      type="text"
                      maxLength={100}
                      placeholder={t.bookingModal.tgPlaceholder}
                      value={telegram}
                      onChange={(e) => setTelegram(e.target.value)}
                      className="w-full bg-white/[0.04] hover:bg-white/[0.07] focus:bg-white/[0.08] border border-white/15 focus:border-[#ea4043] rounded-xl px-4.5 py-3.5 text-white text-sm sm:text-base placeholder:text-[#55555c] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-2 space-y-2.5">
                  <LeadConsentField
                    id={`${titleId}-privacy-consent`}
                    checked={privacyConsent}
                    disabled={isSubmitting}
                    onChange={setPrivacyConsent}
                  />
                  <LeadSubmissionFeedback state={state} />
                  <button
                    type="submit"
                    className="w-full py-4.5 sm:py-5 px-8 bg-[#ea4043] hover:bg-white text-white hover:text-black font-bold uppercase tracking-[0.14em] text-sm sm:text-base rounded-xl transition-all duration-300 shadow-[0_0_35px_rgba(234,64,67,0.35)] cursor-pointer select-none flex items-center justify-center gap-2 group"
                  >
                    <span>
                      {isSubmitting ? t.leadSubmission.submitting : t.bookingModal.submitBtn}
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>

                  <p className="text-xs text-[#8e8e93] text-center">
                    {isRu
                      ? "После отправки шеф-инструктор свяжется с вами для согласования деталей заезда"
                      : "The chief instructor will contact you shortly to confirm your booking"}
                  </p>
                </div>
              </div>
            </div>
            </fieldset>
          </form>
        ) : (
          <LeadSubmissionSuccess
            titleId={titleId}
            title={t.bookingModal.successTitle}
            description={t.bookingModal.successDesc(name, car)}
            closeLabel={t.bookingModal.closeBtn}
            onClose={onClose}
          />
        )}
      </motion.div>
    </div>
  );
}
