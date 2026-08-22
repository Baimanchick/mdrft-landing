"use client";

import React, { useState, useEffect, useId } from "react";
import { motion } from "motion/react";
import { useLanguage } from "@/shared/lib/i18n/LanguageContext";
import { useModalA11y } from "@/shared/ui/modal";
import { CustomDropdown } from "@/shared/ui/dropdown/CustomDropdown";

interface BookingModalProps {
  onClose: () => void;
  initialTariffId?: string;
  initialCarModel?: string;
}

export function BookingModal({
  onClose,
  initialTariffId,
  initialCarModel,
}: BookingModalProps) {
  const [selectedTariff, setSelectedTariff] = useState(initialTariffId || "pro-progress");
  const [car, setCar] = useState(initialCarModel || "BMW M4 Competition");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [telegram, setTelegram] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { lang, t } = useLanguage();
  const isRu = lang === "ru";
  const titleId = useId();
  const { panelRef, dialogProps } = useModalA11y({ onClose, labelledById: titleId });

  useEffect(() => {
    if (initialTariffId) setSelectedTariff(initialTariffId);
  }, [initialTariffId]);

  useEffect(() => {
    if (initialCarModel) setCar(initialCarModel);
  }, [initialCarModel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setSubmitted(true);
  };

  return (
    <div {...dialogProps} className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto no-scrollbar font-sans">
      {/* Deep Blur Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-xl"
      />

      {/* Spacious Luxury Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        ref={panelRef}
        tabIndex={-1}
        data-lenis-prevent="true"
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto no-scrollbar bg-[#08080b] border border-white/15 p-8 sm:p-12 rounded-2xl z-10 my-auto shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_60px_rgba(234,64,67,0.08)] space-y-8 transform-gpu overscroll-contain"
      >
        {/* Ambient Motorsport Lighting Effect */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#ea4043]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#ea4043]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Header with Air & Clear Typography */}
        <div className="relative z-10 flex items-start justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#ea4043] font-bold block">
              {isRu ? "// ОНЛАЙН-БРОНИРОВАНИЕ • ADM RACEWAY" : "// ONLINE BOOKING • ADM RACEWAY"}
            </span>
            <h3 id={titleId} className="text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-white">
              {isRu ? "ЗАПИСЬ НА ТРЕНИРОВКУ" : "BOOK TRAINING"}
              <span className="text-gradient-red">.</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#a0a0a8] font-normal leading-relaxed">
              {isRu
                ? "Выберите автомобиль и формат. Шеф-инструктор свяжется с вами для согласования времени."
                : "Select your car and training format. The chief instructor will contact you shortly."}
            </p>
          </div>

          {/* Minimalist Close Button */}
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/15 text-[#a0a0a8] hover:text-white hover:bg-white/15 hover:border-white/30 cursor-pointer transition-all shrink-0 mt-1"
            aria-label={isRu ? "Закрыть" : "Close"}
          >
            ✕
          </button>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="relative z-10 space-y-6 text-sm">
            {/* Car Selection Field */}
            <div>
              <CustomDropdown
                label={t.bookingModal.carLabel}
                value={car}
                options={t.bookingModal.cars}
                onChange={(val) => setCar(val)}
              />
            </div>

            {/* Program Selection Field */}
            <div>
              <CustomDropdown
                label={t.bookingModal.programLabel}
                value={selectedTariff}
                options={t.bookingModal.programs}
                onChange={(val) => setSelectedTariff(val)}
              />
            </div>

            {/* Personal Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor={`${titleId}-name`} className="block text-xs uppercase tracking-wider text-[#8e8e93] font-semibold mb-2">
                  {t.bookingModal.nameLabel}
                </label>
                <input
                  id={`${titleId}-name`}
                  name="name"
                  autoComplete="name"
                  type="text"
                  required
                  placeholder={t.bookingModal.namePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/[0.04] hover:bg-white/[0.07] focus:bg-white/[0.08] border border-white/15 focus:border-[#ea4043] rounded-lg px-4.5 py-4 text-white text-sm placeholder:text-[#55555c] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor={`${titleId}-phone`} className="block text-xs uppercase tracking-wider text-[#8e8e93] font-semibold mb-2">
                  {t.bookingModal.phoneLabel}
                </label>
                <input
                  id={`${titleId}-phone`}
                  name="phone"
                  autoComplete="tel"
                  type="tel"
                  required
                  placeholder={t.bookingModal.phonePlaceholder}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white/[0.04] hover:bg-white/[0.07] focus:bg-white/[0.08] border border-white/15 focus:border-[#ea4043] rounded-lg px-4.5 py-4 text-white text-sm placeholder:text-[#55555c] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Telegram / Messenger */}
            <div>
              <label htmlFor={`${titleId}-telegram`} className="block text-xs uppercase tracking-wider text-[#8e8e93] font-semibold mb-2">
                {t.bookingModal.tgLabel}
              </label>
              <input
                id={`${titleId}-telegram`}
                name="telegram"
                autoComplete="off"
                type="text"
                placeholder={t.bookingModal.tgPlaceholder}
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                className="w-full bg-white/[0.04] hover:bg-white/[0.07] focus:bg-white/[0.08] border border-white/15 focus:border-[#ea4043] rounded-lg px-4.5 py-4 text-white text-sm placeholder:text-[#55555c] focus:outline-none transition-colors"
              />
            </div>

            {/* Submit Button & Instructor Notice */}
            <div className="pt-3 space-y-4">
              <button
                type="submit"
                className="w-full py-4.5 px-6 bg-[#ea4043] hover:bg-white text-white hover:text-black font-bold uppercase tracking-[0.14em] text-xs sm:text-sm rounded-lg transition-all duration-300 shadow-[0_0_35px_rgba(234,64,67,0.35)] cursor-pointer select-none flex items-center justify-center gap-2 group"
              >
                <span>{t.bookingModal.submitBtn}</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-[#8e8e93]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ea4043] animate-pulse" />
                <span>{t.bookingModal.instructorNote}</span>
              </div>
            </div>
          </form>
        ) : (
          <div className="relative z-10 py-12 space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-[#ea4043]/15 text-[#ea4043] border border-[#ea4043]/30 flex items-center justify-center mx-auto text-2xl font-bold shadow-[0_0_30px_rgba(234,64,67,0.3)]">
              ✓
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight">
              {t.bookingModal.successTitle}
            </h3>
            <p className="text-sm sm:text-base text-[#a0a0a8] max-w-md mx-auto leading-relaxed">
              {t.bookingModal.successDesc(name, car)}
            </p>
            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-8 py-3.5 bg-white/10 hover:bg-white text-white hover:text-black font-bold uppercase tracking-wider text-xs rounded-lg transition-all"
              >
                {t.bookingModal.closeBtn}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
