"use client";

import React, { useState, useId } from "react";
import { motion } from "motion/react";
import type { PartnershipDirection } from "@/entities/lead";
import {
  LeadConsentField,
  LeadSubmissionFeedback,
  LeadSubmissionSuccess,
  useLeadSubmission,
} from "@/features/lead-submission";
import { useLanguage } from "@/shared/lib/i18n/LanguageContext";
import { useModalA11y } from "@/shared/ui/modal";

interface PartnershipModalProps {
  onClose: () => void;
}

export function PartnershipModal({ onClose }: PartnershipModalProps) {
  const [selectedOption, setSelectedOption] = useState<PartnershipDirection>("invest");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [contactMethod, setContactMethod] = useState("");
  const [comment, setComment] = useState("");
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const { state, submit, isSubmitting, isSucceeded } = useLeadSubmission();
  const { lang } = useLanguage();
  const isRu = lang === "ru";
  const titleId = useId();
  const { panelRef, dialogProps } = useModalA11y({
    onClose: () => {
      if (!isSubmitting) onClose();
    },
    labelledById: titleId,
  });

  const PARTNERSHIP_OPTIONS: readonly {
    readonly id: PartnershipDirection;
    readonly badge: string;
    readonly title: string;
    readonly desc: string;
  }[] = [
    {
      id: "invest",
      badge: "INVEST // SCALE",
      title: isRu ? "ИНВЕСТИРОВАТЬ" : "INVEST",
      desc: isRu
        ? "Инвестиции в развитие школы, автопарк и масштабирование проекта."
        : "Invest in school development, fleet acquisition, and scaling.",
    },
    {
      id: "brand",
      badge: "BRAND // SPONSOR",
      title: isRu ? "БРЕНД-ПАРТНЁР" : "BRAND PARTNER",
      desc: isRu
        ? "Размещение бренда на автомобилях, в медиа и на трек-днях."
        : "Brand placement on M-drift vehicles, media, and track events.",
    },
    {
      id: "collab",
      badge: "COLLABORATION",
      title: isRu ? "СПЕЦПРОЕКТЫ" : "JOINT PROJECTS",
      desc: isRu
        ? "Коллаборации, мероприятия, интеграции и совместные проекты."
        : "Collaborations, events, activations, and joint media projects.",
    },
    {
      id: "proposal",
      badge: "B2B // PROPOSAL",
      title: isRu ? "СВОЁ ПРЕДЛОЖЕНИЕ" : "CUSTOM PROPOSAL",
      desc: isRu
        ? "Если у вас есть идея, продукт или ресурс для сотрудничества."
        : "If you have an idea, product, or resource to build together.",
    },
  ];

  const selectedOptionObj =
    PARTNERSHIP_OPTIONS.find((option) => option.id === selectedOption) ??
    PARTNERSHIP_OPTIONS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!privacyConsent) return;

    const normalizedCompany = company.trim();
    const normalizedContactMethod = contactMethod.trim();
    const normalizedComment = comment.trim();
    void submit({
      type: "partnership",
      locale: lang,
      privacyConsent: true,
      direction: selectedOption,
      name,
      phone,
      ...(normalizedCompany ? { company: normalizedCompany } : {}),
      ...(normalizedContactMethod ? { contactMethod: normalizedContactMethod } : {}),
      ...(normalizedComment ? { comment: normalizedComment } : {}),
    });
  };

  const requestClose = () => {
    if (!isSubmitting) onClose();
  };

  return (
    <div
      {...dialogProps}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-5 md:p-6 lg:p-8 overflow-y-auto no-scrollbar font-sans"
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
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        ref={panelRef}
        tabIndex={-1}
        data-lenis-prevent="true"
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl xl:max-w-6xl max-h-[92vh] sm:max-h-[96vh] bg-[#08080c] border-t sm:border border-white/15 p-5 sm:p-8 lg:p-10 xl:p-12 rounded-t-3xl sm:rounded-2xl z-10 shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_60px_rgba(234,64,67,0.08)] transform-gpu flex flex-col justify-between overflow-y-auto lg:overflow-visible no-scrollbar pb-[max(1.5rem,env(safe-area-inset-bottom))]"
      >
        {/* iOS style drag handle indicator */}
        <div className="w-10 h-1.5 rounded-full bg-white/20 mx-auto mb-3 sm:hidden shrink-0" />

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
              {/* Left Column (5 of 12): Header & Visual Selected Format Showcase */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                <div className="space-y-3 pr-4">
                  <span className="text-xs sm:text-sm uppercase tracking-widest text-[#ea4043] font-bold block">
                    {isRu ? "// ПАРТНЁРСТВО • ИНВЕСТИЦИИ • КОЛЛАБОРАЦИИ" : "// PARTNERSHIP • INVESTMENTS • COLLABORATIONS"}
                  </span>
                  <h3
                    id={titleId}
                    className="text-3xl sm:text-4xl xl:text-5xl font-bold uppercase tracking-tight text-white leading-tight"
                  >
                    {isRu ? "СТАНЬТЕ ЧАСТЬЮ M DRIFT" : "BECOME A PART OF M DRIFT"}
                    <span className="text-gradient-red">.</span>
                  </h3>
                  <p className="text-sm sm:text-base text-[#a0a0a8] font-normal leading-relaxed">
                    {isRu
                      ? "Развивайте премиальный автоспорт вместе с нами. Выберите подходящий формат взаимодействия и отправьте заявку."
                      : "Grow high-performance motorsport with us. Choose your preferred collaboration format and apply."}
                  </p>
                </div>

                {/* Visual Live Format Card */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1c1c24] via-[#111117] to-[#08080c] border border-white/20 relative overflow-hidden shadow-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#ea4043] font-bold">
                      {isRu ? "ВЫБРАННЫЙ ФОРМАТ" : "SELECTED FORMAT"}
                    </span>
                    <span className="text-xs font-mono text-[#a0a0a8] border border-white/15 px-2.5 py-0.5 rounded bg-black/40 font-bold">
                      {selectedOptionObj.badge}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-xl sm:text-2xl font-extrabold uppercase text-white tracking-tight">
                      {selectedOptionObj.title}
                    </div>
                    <p className="text-sm text-[#b5b5bd] leading-relaxed">
                      {selectedOptionObj.desc}
                    </p>
                  </div>
                </div>

                {/* Bottom Guarantee Pill */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs sm:text-sm text-[#b5b5bd] flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ea4043] shrink-0" />
                  <span>
                    {isRu
                      ? "Руководство проекта рассматривает все заявки в течение 24 часов"
                      : "Our executive team reviews applications within 24 hours"}
                  </span>
                </div>
              </div>

              {/* Right Column (7 of 12): Form & Configurator */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
                {/* Step 1: Direction Selection (4 options in 2x2 grid) */}
                <div>
                  <span
                    id={`${titleId}-direction-label`}
                    className="block text-sm sm:text-base uppercase tracking-wider text-white font-bold mb-2.5"
                  >
                    {isRu ? "1. Выберите направление *" : "1. Select Direction *"}
                  </span>
                  <div
                    role="radiogroup"
                    aria-labelledby={`${titleId}-direction-label`}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                  >
                    {PARTNERSHIP_OPTIONS.map((opt) => {
                      const isSelected = selectedOption === opt.id;
                      return (
                        <label
                          key={opt.id}
                          className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between text-left relative overflow-hidden group select-none has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#ea4043] ${
                            isSelected
                              ? "bg-white text-black border-white shadow-[0_0_24px_rgba(255,255,255,0.25)]"
                              : "bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20"
                          }`}
                        >
                          <input
                            type="radio"
                            name="partnershipDirection"
                            value={opt.id}
                            checked={isSelected}
                            onChange={() => setSelectedOption(opt.id)}
                            className="sr-only"
                          />
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={`text-[10px] tracking-widest font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                                  isSelected ? "bg-black/10 text-black" : "bg-white/10 text-[#ea4043]"
                                }`}
                              >
                                {opt.badge}
                              </span>
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
                                  isSelected
                                    ? "border-black bg-black"
                                    : "border-white/30 group-hover:border-white/60"
                                }`}
                              >
                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </div>
                            </div>
                            <h4
                              className={`text-sm sm:text-base font-extrabold uppercase tracking-tight leading-snug ${
                                isSelected ? "text-black" : "text-white"
                              }`}
                            >
                              {opt.title}
                            </h4>
                            <p
                              className={`text-xs leading-relaxed ${
                                isSelected ? "text-[#3a3a42]" : "text-[#a0a0a8]"
                              }`}
                            >
                              {opt.desc}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: Contact Information */}
                <div className="space-y-3.5">
                  <span className="block text-sm sm:text-base uppercase tracking-wider text-white font-bold">
                    {isRu ? "2. Контактные данные" : "2. Contact Information"}
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label
                        htmlFor={`${titleId}-name`}
                        className="block text-xs uppercase tracking-wider text-[#a0a0a8] font-bold mb-1.5"
                      >
                        {isRu ? "Имя / Контактное лицо *" : "Full Name / Contact Person *"}
                      </label>
                      <input
                        id={`${titleId}-name`}
                        name="name"
                        autoComplete="name"
                        type="text"
                        required
                        maxLength={100}
                        placeholder={isRu ? "Константин" : "Konstantin"}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white/[0.04] hover:bg-white/[0.07] focus:bg-white/[0.08] border border-white/15 focus:border-[#ea4043] rounded-xl px-4 py-3 text-white text-sm sm:text-base placeholder:text-[#55555c] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`${titleId}-company`}
                        className="block text-xs uppercase tracking-wider text-[#a0a0a8] font-bold mb-1.5"
                      >
                        {isRu ? "Компания / Бренд" : "Company / Brand"}
                      </label>
                      <input
                        id={`${titleId}-company`}
                        name="organization"
                        autoComplete="organization"
                        type="text"
                        maxLength={150}
                        placeholder={isRu ? "Название бренда" : "Brand or company"}
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full bg-white/[0.04] hover:bg-white/[0.07] focus:bg-white/[0.08] border border-white/15 focus:border-[#ea4043] rounded-xl px-4 py-3 text-white text-sm sm:text-base placeholder:text-[#55555c] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label
                        htmlFor={`${titleId}-phone`}
                        className="block text-xs uppercase tracking-wider text-[#a0a0a8] font-bold mb-1.5"
                      >
                        {isRu ? "Телефон *" : "Phone *"}
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
                        placeholder="+7 (999) 000-00-00"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white/[0.04] hover:bg-white/[0.07] focus:bg-white/[0.08] border border-white/15 focus:border-[#ea4043] rounded-xl px-4 py-3 text-white text-sm sm:text-base placeholder:text-[#55555c] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`${titleId}-contactMethod`}
                        className="block text-xs uppercase tracking-wider text-[#a0a0a8] font-bold mb-1.5"
                      >
                        {isRu ? "Telegram или Email" : "Telegram or Email"}
                      </label>
                      <input
                        id={`${titleId}-contactMethod`}
                        name="contactMethod"
                        autoComplete="off"
                        type="text"
                        maxLength={160}
                        placeholder="@username или partner@company.com"
                        value={contactMethod}
                        onChange={(e) => setContactMethod(e.target.value)}
                        className="w-full bg-white/[0.04] hover:bg-white/[0.07] focus:bg-white/[0.08] border border-white/15 focus:border-[#ea4043] rounded-xl px-4 py-3 text-white text-sm sm:text-base placeholder:text-[#55555c] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor={`${titleId}-comment`}
                      className="block text-xs uppercase tracking-wider text-[#a0a0a8] font-bold mb-1.5"
                    >
                      {isRu ? "Кратко о предложении / идее" : "Brief Proposal Details"}
                    </label>
                    <textarea
                      id={`${titleId}-comment`}
                      name="comment"
                      rows={2}
                      maxLength={1000}
                      placeholder={
                        isRu
                          ? "Расскажите о вашей идее, формате интеграции или объемах..."
                          : "Describe your partnership idea, proposed integration..."
                      }
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full bg-white/[0.04] hover:bg-white/[0.07] focus:bg-white/[0.08] border border-white/15 focus:border-[#ea4043] rounded-xl px-4 py-3 text-white text-sm sm:text-base placeholder:text-[#55555c] focus:outline-none transition-colors resize-none"
                    />
                  </div>
                </div>

                {/* Step 3: CTA Button */}
                <div className="pt-2 space-y-2">
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
                      {isSubmitting
                        ? isRu
                          ? "Отправляем заявку…"
                          : "Submitting request…"
                        : isRu
                          ? "Отправить предложение"
                          : "Submit Proposal"}
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>

                  <p className="text-xs text-[#8e8e93] text-center">
                    {isRu
                      ? "Руководство проекта рассматривает все заявки в течение 24 часов"
                      : "Our executive team reviews all partnership requests within 24 hours"}
                  </p>
                </div>
              </div>
            </div>
            </fieldset>
          </form>
        ) : (
          <LeadSubmissionSuccess
            titleId={titleId}
            title={isRu ? "Предложение отправлено" : "Proposal Submitted"}
            description={
              isRu
                ? `Спасибо, ${name || "партнёр"}. Предложение получено, команда свяжется с вами для обсуждения деталей.`
                : `Thank you, ${name || "partner"}. Your proposal has been received, and our team will contact you to discuss the details.`
            }
            closeLabel={isRu ? "Закрыть" : "Close"}
            onClose={onClose}
          />
        )}
      </motion.div>
    </div>
  );
}
