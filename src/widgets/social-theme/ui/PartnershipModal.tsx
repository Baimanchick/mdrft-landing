"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "@/shared/lib/i18n/LanguageContext";

interface PartnershipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PartnershipModal({ isOpen, onClose }: PartnershipModalProps) {
  const [selectedOption, setSelectedOption] = useState<string>("invest");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [contactMethod, setContactMethod] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { lang } = useLanguage();
  const isRu = lang === "ru";

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
      setSubmitted(false);
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setSubmitted(true);
  };

  const PARTNERSHIP_OPTIONS = [
    {
      id: "invest",
      badge: "INVESTMENT // SCALE",
      title: isRu ? "ИНВЕСТИРОВАТЬ" : "INVEST",
      desc: isRu
        ? "Инвестиции в развитие M DRIFT SCHOOL, автопарк, новые площадки и масштабирование проекта."
        : "Invest in M DRIFT SCHOOL development, fleet acquisition, new tracks, and project scaling.",
    },
    {
      id: "brand",
      badge: "BRANDING // SPONSORSHIP",
      title: isRu ? "СТАТЬ БРЕНД-ПАРТНЁРОМ" : "BECOME A BRAND PARTNER",
      desc: isRu
        ? "Размещение бренда на автомобилях, в контенте, мероприятиях и социальных сетях школы."
        : "Brand placement on M-drift vehicles, media content, track events, and social channels.",
    },
    {
      id: "collab",
      badge: "COLLABORATION // CO-MARKETING",
      title: isRu ? "СОВМЕСТНЫЕ ПРОЕКТЫ" : "JOINT PROJECTS",
      desc: isRu
        ? "Коллаборации, мероприятия, спецпроекты, рекламные интеграции и совместное развитие продуктов."
        : "Collaborations, events, special activations, advertising integrations, and joint ventures.",
    },
    {
      id: "proposal",
      badge: "CUSTOM // B2B PROPOSAL",
      title: isRu ? "ПРЕДЛОЖИТЬ СОТРУДНИЧЕСТВО" : "PROPOSE PARTNERSHIP",
      desc: isRu
        ? "Если у вас есть предложение, ресурс, продукт или идея, которую можно реализовать вместе."
        : "If you have a proposal, resource, product, or idea to build and grow together.",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-y-auto no-scrollbar font-sans">
          {/* Deep Blur Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-xl"
          />

          {/* Spacious Luxury Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto no-scrollbar bg-[#08080b] border border-white/15 p-6 sm:p-10 lg:p-12 rounded-2xl z-10 my-auto shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_60px_rgba(234,64,67,0.08)] space-y-7 transform-gpu overscroll-contain"
          >
            {/* Ambient Motorsport Lighting Effect */}
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#ea4043]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#ea4043]/5 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 flex items-start justify-between gap-6 pb-6 border-b border-white/10">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-[#ea4043] font-bold block">
                  {isRu ? "// ПАРТНЁРСТВО • ИНВЕСТИЦИИ • КОЛЛАБОРАЦИИ" : "// PARTNERSHIP • INVESTMENTS • COLLABORATIONS"}
                </span>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-white leading-tight">
                  {isRu ? "СТАНЬТЕ ЧАСТЬЮ M DRIFT SCHOOL" : "BECOME A PART OF M DRIFT SCHOOL"}
                  <span className="text-gradient-red">.</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#a0a0a8] font-normal leading-relaxed">
                  {isRu
                    ? "Развивайте премиальный автоспорт вместе с нами. Выберите подходящий формат взаимодействия и отправьте заявку."
                    : "Grow high-performance motorsport with us. Choose your preferred collaboration format and submit your application."}
                </p>
              </div>

              {/* Minimalist Close Button */}
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/15 text-[#a0a0a8] hover:text-white hover:bg-white/15 hover:border-white/30 cursor-pointer transition-all shrink-0 mt-1"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="relative z-10 space-y-6 text-sm">
                {/* 4 Interactive Partnership Category Option Cards */}
                <div className="space-y-3">
                  <label className="block text-xs uppercase tracking-wider text-[#8e8e93] font-semibold">
                    {isRu ? "Выберите направление сотрудничества *" : "Select Partnership Direction *"}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {PARTNERSHIP_OPTIONS.map((opt) => {
                      const isSelected = selectedOption === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => setSelectedOption(opt.id)}
                          className={`p-4 sm:p-5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between text-left relative overflow-hidden group ${
                            isSelected
                              ? "bg-white/[0.08] border-[#ea4043] shadow-[0_0_25px_rgba(234,64,67,0.2)]"
                              : "bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20"
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] tracking-widest font-mono text-[#ea4043] font-bold uppercase">
                                {opt.badge}
                              </span>
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
                                  isSelected
                                    ? "border-[#ea4043] bg-[#ea4043]"
                                    : "border-white/30 group-hover:border-white/60"
                                }`}
                              >
                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </div>
                            </div>
                            <h4 className="text-sm sm:text-[15px] font-bold uppercase tracking-tight text-white leading-snug">
                              {opt.title}
                            </h4>
                            <p className="text-xs text-[#a0a0a8] font-light leading-relaxed">
                              {opt.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Name & Company Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#8e8e93] font-semibold mb-2">
                      {isRu ? "Имя / Контактное лицо *" : "Full Name / Contact Person *"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={isRu ? "Константин" : "Konstantin"}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/[0.04] hover:bg-white/[0.07] focus:bg-white/[0.08] border border-white/15 focus:border-[#ea4043] rounded-lg px-4 py-3.5 text-white text-sm placeholder:text-[#55555c] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#8e8e93] font-semibold mb-2">
                      {isRu ? "Компания / Бренд" : "Company / Brand"}
                    </label>
                    <input
                      type="text"
                      placeholder={isRu ? "Название компании или проекта" : "Company or project name"}
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full bg-white/[0.04] hover:bg-white/[0.07] focus:bg-white/[0.08] border border-white/15 focus:border-[#ea4043] rounded-lg px-4 py-3.5 text-white text-sm placeholder:text-[#55555c] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Phone & Contact Method Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#8e8e93] font-semibold mb-2">
                      {isRu ? "Телефон / WhatsApp *" : "Phone / WhatsApp *"}
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+7 (999) 000-00-00"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white/[0.04] hover:bg-white/[0.07] focus:bg-white/[0.08] border border-white/15 focus:border-[#ea4043] rounded-lg px-4 py-3.5 text-white text-sm placeholder:text-[#55555c] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#8e8e93] font-semibold mb-2">
                      {isRu ? "Telegram или Email" : "Telegram or Email"}
                    </label>
                    <input
                      type="text"
                      placeholder="@username / partner@company.com"
                      value={contactMethod}
                      onChange={(e) => setContactMethod(e.target.value)}
                      className="w-full bg-white/[0.04] hover:bg-white/[0.07] focus:bg-white/[0.08] border border-white/15 focus:border-[#ea4043] rounded-lg px-4 py-3.5 text-white text-sm placeholder:text-[#55555c] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Comment / Details */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8e8e93] font-semibold mb-2">
                    {isRu ? "Кратко о предложении или идее" : "Proposal Details or Vision"}
                  </label>
                  <textarea
                    rows={3}
                    placeholder={
                      isRu
                        ? "Опишите суть предложения, формат участия или пожелания..."
                        : "Describe the format of partnership or your vision..."
                    }
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-white/[0.04] hover:bg-white/[0.07] focus:bg-white/[0.08] border border-white/15 focus:border-[#ea4043] rounded-lg px-4 py-3 text-white text-sm placeholder:text-[#55555c] focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2 space-y-3">
                  <button
                    type="submit"
                    className="w-full py-4 px-6 bg-[#ea4043] hover:bg-white text-white hover:text-black font-bold uppercase tracking-[0.14em] text-xs sm:text-sm rounded-lg transition-all duration-300 shadow-[0_0_35px_rgba(234,64,67,0.35)] cursor-pointer select-none flex items-center justify-center gap-2 group"
                  >
                    <span>{isRu ? "Отправить предложение" : "Submit Partnership Proposal"}</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>

                  <p className="text-xs text-[#8e8e93] text-center">
                    {isRu
                      ? "Прямая связь с руководством проекта. Конфиденциальность гарантируется."
                      : "Direct connection with project leadership. Confidentiality guaranteed."}
                  </p>
                </div>
              </form>
            ) : (
              <div className="relative z-10 py-12 space-y-5 text-center">
                <div className="w-16 h-16 rounded-full bg-[#ea4043]/15 text-[#ea4043] border border-[#ea4043]/30 flex items-center justify-center mx-auto text-2xl font-bold shadow-[0_0_30px_rgba(234,64,67,0.3)]">
                  ✓
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight">
                  {isRu ? "Предложение успешно отправлено" : "Proposal Successfully Submitted"}
                </h3>
                <p className="text-sm sm:text-base text-[#a0a0a8] max-w-md mx-auto leading-relaxed">
                  {isRu
                    ? `Спасибо, ${name || "Партнёр"}! Мы изучим ваше предложение и свяжемся с вами в ближайшее время для обсуждения деталей сотрудничества.`
                    : `Thank you, ${name || "Partner"}! We will review your proposal and get in touch with you shortly to discuss next steps.`}
                </p>
                <div className="pt-4">
                  <button
                    onClick={onClose}
                    className="px-8 py-3.5 bg-white/10 hover:bg-white text-white hover:text-black font-bold uppercase tracking-wider text-xs rounded-lg transition-all"
                  >
                    {isRu ? "Закрыть" : "Close"}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
