"use client";

import React, { useState, useId, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "@/shared/lib/i18n/LanguageContext";
import { useModalA11y } from "@/shared/ui/modal";

interface CertificateModalProps {
  onClose: () => void;
}

type DeliveryType = "digital" | "box";

interface PlanConfig {
  id: string;
  titleRu: string;
  titleEn: string;
  subtitleRu: string;
  subtitleEn: string;
  badgeRu: string;
  badgeEn: string;
  price: number;
  isCustom?: boolean;
}

const CERTIFICATE_PLANS: readonly PlanConfig[] = [
  {
    id: "first-touch",
    titleRu: "First Touch",
    titleEn: "First Touch",
    subtitleRu: "Скольжение на мокром пластике",
    subtitleEn: "Wet plastic drift induction",
    badgeRu: "1 ЧАС",
    badgeEn: "1 HOUR",
    price: 30000,
  },
  {
    id: "asphalt-start",
    titleRu: "Asphalt Start",
    titleEn: "Asphalt Start",
    subtitleRu: "Первый занос, базовые восьмерки",
    subtitleEn: "First asphalt drift & 8s",
    badgeRu: "1 ЧАС",
    badgeEn: "1 HOUR",
    price: 40000,
  },
  {
    id: "pro-progress",
    titleRu: "Pro Progress",
    titleEn: "Pro Progress",
    subtitleRu: "Интенсив: мокрый + сухой асфальт",
    subtitleEn: "Intensive: wet + dry circuit",
    badgeRu: "2 ЧАСА // ТОП",
    badgeEn: "2 HOURS // TOP",
    price: 70000,
  },
  {
    id: "mastery-control",
    titleRu: "Mastery Control",
    titleEn: "Mastery Control",
    subtitleRu: "Продвинутый курс: полный контроль",
    subtitleEn: "Advanced high-speed mastery",
    badgeRu: "4 ЧАСА // PRO",
    badgeEn: "4 HOURS // PRO",
    price: 140000,
  },
  {
    id: "custom",
    titleRu: "Свой номинал",
    titleEn: "Custom Amount",
    subtitleRu: "Сумма на выбор от 30 000 ₽",
    subtitleEn: "Custom amount from 30 000 ₽",
    badgeRu: "НА ВЫБОР",
    badgeEn: "CUSTOM",
    price: 50000,
    isCustom: true,
  },
];

const PRESET_AMOUNTS = [30000, 50000, 100000, 150000, 200000];

function formatRubles(amount: number): string {
  return `${amount.toLocaleString("ru-RU")} ₽`;
}

export function CertificateModal({ onClose }: CertificateModalProps) {
  const [selectedPlanId, setSelectedPlanId] = useState("pro-progress");
  const [customAmount, setCustomAmount] = useState<number>(50000);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("digital");
  const [recipientName, setRecipientName] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { lang } = useLanguage();
  const isRu = lang === "ru";
  const titleId = useId();
  const { panelRef, dialogProps } = useModalA11y({ onClose, labelledById: titleId });

  const activePlan = useMemo(() => {
    return CERTIFICATE_PLANS.find((p) => p.id === selectedPlanId) ?? CERTIFICATE_PLANS[2];
  }, [selectedPlanId]);

  const activePriceFormatted = useMemo(() => {
    if (activePlan.isCustom) {
      const validAmount = Number.isFinite(customAmount) && customAmount > 0 ? customAmount : 30000;
      return formatRubles(validAmount);
    }
    return formatRubles(activePlan.price);
  }, [activePlan, customAmount]);

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    const parsed = parseInt(raw, 10);
    setCustomAmount(Number.isNaN(parsed) ? 0 : parsed);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setSubmitted(true);
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
        onClick={onClose}
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
        className="relative w-full max-w-[1780px] bg-[#08080c] border border-white/15 p-6 sm:p-8 lg:p-10 xl:p-12 rounded-2xl z-10 my-auto shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_60px_rgba(234,64,67,0.08)] transform-gpu flex flex-col justify-between overflow-y-auto lg:overflow-visible no-scrollbar"
      >
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#ea4043]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#0066b1]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="absolute top-5 sm:top-8 right-5 sm:right-8 z-20">
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/15 text-[#a0a0a8] hover:text-white hover:bg-white/15 hover:border-white/30 cursor-pointer transition-all"
            aria-label={isRu ? "Закрыть" : "Close"}
          >
            ✕
          </button>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="relative z-10 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-stretch">
              {/* Left Column (4 of 12): Hero Presentation & Live Voucher Card */}
              <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
                <div className="space-y-3 pr-6">
                  <span className="text-xs sm:text-sm uppercase tracking-widest text-[#ea4043] font-bold block">
                    {isRu ? "// ПОДАРОЧНЫЕ СЕРТИФИКАТЫ" : "// GIFT CERTIFICATES"}
                  </span>
                  <h3
                    id={titleId}
                    className="text-3xl sm:text-4xl xl:text-5xl font-bold uppercase tracking-tight text-white leading-tight"
                  >
                    {isRu ? "ПОДАРИТЬ ЭМОЦИИ" : "GIFT AN EXPERIENCE"}
                    <span className="text-gradient-red">.</span>
                  </h3>
                  <p className="text-sm sm:text-base text-[#a0a0a8] font-normal leading-relaxed">
                    {isRu
                      ? "Бессрочные сертификаты на управление BMW M-серии. Электронный PDF или премиум металл-бокс."
                      : "Non-expiring BMW M driving vouchers. Instant PDF or luxury metal box."}
                  </p>
                </div>

                {/* Visual Live Voucher Card */}
                <div className="p-6 xl:p-7 rounded-2xl bg-gradient-to-br from-[#1c1c24] via-[#111117] to-[#08080c] border border-white/20 relative overflow-hidden shadow-2xl space-y-5">
                  <div className="absolute top-0 right-0 w-44 h-44 bg-[#ea4043]/20 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-7 bg-[#0066b1] rounded-xs" />
                      <div className="w-2 h-7 bg-[#001f66] rounded-xs" />
                      <div className="w-2 h-7 bg-[#ea4043] rounded-xs" />
                      <span className="text-sm sm:text-base font-black tracking-widest text-white ml-1">M DRIFT ACADEMY</span>
                    </div>
                    <span className="font-mono text-xs text-[#a0a0a8] border border-white/15 px-2.5 py-1 rounded bg-black/50 font-bold">
                      N° 849201
                    </span>
                  </div>

                  <div className="space-y-2 pt-1">
                    <div className="text-xs sm:text-sm font-mono uppercase tracking-wider text-[#ea4043] font-bold">
                      {activePlan.isCustom
                        ? isRu ? "ПОДАРОЧНЫЙ СЕРТИФИКАТ" : "GIFT VOUCHER"
                        : `${isRu ? activePlan.badgeRu : activePlan.badgeEn} // OFFICIAL PASS`}
                    </div>
                    <div className="text-2xl sm:text-3xl xl:text-4xl font-extrabold uppercase text-white tracking-tight leading-snug">
                      {activePlan.isCustom
                        ? isRu ? "Свободный номинал" : "Custom Voucher"
                        : isRu ? activePlan.titleRu : activePlan.titleEn}
                    </div>
                    <div className="text-sm sm:text-base text-[#b5b5bd] leading-relaxed">
                      {recipientName ? (
                        <span>
                          {isRu ? "Пилот: " : "Pilot: "}
                          <strong className="text-white font-semibold">{recipientName}</strong>
                        </span>
                      ) : (
                        <span>{isRu ? activePlan.subtitleRu : activePlan.subtitleEn}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-end justify-between pt-4 border-t border-white/15">
                    <div>
                      <span className="text-sm text-[#b5b5bd] uppercase tracking-wider block font-semibold">
                        {deliveryType === "digital"
                          ? isRu ? "⚡ Электронный PDF" : "⚡ Digital PDF"
                          : isRu ? "📦 Металлическая карта" : "📦 Metal Gift Box"}
                      </span>
                      <span className="text-xs text-[#8e8e93] block mt-0.5">
                        {isRu ? "Без срока действия" : "No expiration date"}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl sm:text-4xl xl:text-5xl font-black text-white tracking-tight font-mono">
                        {activePriceFormatted}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features Badges */}
                <div className="grid grid-cols-1 gap-2.5">
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-[#b5b5bd] flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ea4043] shrink-0" />
                    <span>{isRu ? "Все автомобили M-парка (M2, M3, M4, M5)" : "All BMW M fleet (M2, M3, M4, M5)"}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-[#b5b5bd] flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0066b1] shrink-0" />
                    <span>{isRu ? "Бессрочное действие — в любое удобное время" : "Non-expiring voucher — schedule anytime"}</span>
                  </div>
                </div>
              </div>

              {/* Right Column (8 of 12): Form & Configurator */}
              <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
                {/* Step 1: Tariffs Selection */}
                <div>
                  <span
                    id={`${titleId}-plan-label`}
                    className="block text-sm sm:text-base uppercase tracking-wider text-white font-bold mb-3"
                  >
                    {isRu ? "1. Выберите тариф или номинал" : "1. Select Program or Custom Amount"}
                  </span>

                  <div
                    role="radiogroup"
                    aria-labelledby={`${titleId}-plan-label`}
                    className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3"
                  >
                    {CERTIFICATE_PLANS.map((plan) => {
                      const isSelected = selectedPlanId === plan.id;
                      const priceLabel = plan.isCustom
                        ? isRu ? `От 30 000 ₽` : `From 30 000 ₽`
                        : formatRubles(plan.price);

                      return (
                        <label
                          key={plan.id}
                          className={`p-4 xl:p-5 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between select-none has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#ea4043] ${
                            isSelected
                              ? "bg-white text-black border-white shadow-[0_0_24px_rgba(255,255,255,0.25)]"
                              : "bg-white/[0.03] border-white/15 text-[#a0a0a8] hover:border-white/30 hover:text-white"
                          }`}
                        >
                          <input
                            type="radio"
                            name="certificatePlan"
                            value={plan.id}
                            checked={isSelected}
                            onChange={() => setSelectedPlanId(plan.id)}
                            className="sr-only"
                          />
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-1">
                              <span
                                className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                                  isSelected ? "bg-black/10 text-black" : "bg-white/10 text-[#ea4043]"
                                }`}
                              >
                                {isRu ? plan.badgeRu : plan.badgeEn}
                              </span>
                            </div>
                            <div className={`text-sm sm:text-base xl:text-lg font-extrabold uppercase tracking-wide leading-tight ${isSelected ? "text-black" : "text-white"}`}>
                              {isRu ? plan.titleRu : plan.titleEn}
                            </div>
                            <div className={`text-xs sm:text-sm leading-snug line-clamp-2 ${isSelected ? "text-[#3a3a42]" : "text-[#8e8e93]"}`}>
                              {isRu ? plan.subtitleRu : plan.subtitleEn}
                            </div>
                          </div>
                          <div className={`text-base sm:text-lg xl:text-xl font-black font-mono pt-3 ${isSelected ? "text-black" : "text-white"}`}>
                            {priceLabel}
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  <AnimatePresence>
                    {activePlan.isCustom && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 14 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 sm:p-5 rounded-xl bg-white/[0.04] border border-[#ea4043]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div className="w-full sm:w-auto flex-1">
                            <label
                              htmlFor={`${titleId}-customAmount`}
                              className="text-xs sm:text-sm uppercase tracking-wider text-white font-bold block mb-1.5"
                            >
                              {isRu ? "Сумма номинала (от 30 000 ₽):" : "Voucher Amount (min 30 000 ₽):"}
                            </label>
                            <div className="relative">
                              <input
                                id={`${titleId}-customAmount`}
                                type="text"
                                inputMode="numeric"
                                value={customAmount ? customAmount.toLocaleString("ru-RU") : ""}
                                onChange={handleCustomAmountChange}
                                placeholder="50 000"
                                className="w-full bg-black/70 border border-white/20 focus:border-[#ea4043] rounded-xl px-4.5 py-3 text-white text-xl font-bold font-mono focus:outline-none transition-colors pr-12"
                              />
                              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base font-bold text-[#8e8e93] pointer-events-none font-mono">
                                ₽
                              </span>
                            </div>
                          </div>

                          <div className="w-full sm:w-auto flex flex-wrap items-center gap-2">
                            <span className="text-xs sm:text-sm text-[#8e8e93] w-full sm:w-auto mr-1 font-semibold">
                              {isRu ? "Быстрый выбор:" : "Presets:"}
                            </span>
                            {PRESET_AMOUNTS.map((amt) => (
                              <button
                                key={amt}
                                type="button"
                                onClick={() => setCustomAmount(amt)}
                                className={`text-xs sm:text-sm px-3 py-2 rounded-lg border font-mono transition-all cursor-pointer font-bold ${
                                  customAmount === amt
                                    ? "bg-[#ea4043] border-[#ea4043] text-white"
                                    : "bg-white/5 border-white/15 text-[#a0a0a8] hover:text-white hover:border-white/30"
                                }`}
                              >
                                {formatRubles(amt)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Step 2: Delivery Format */}
                <div>
                  <span
                    id={`${titleId}-delivery-label`}
                    className="block text-sm sm:text-base uppercase tracking-wider text-white font-bold mb-3"
                  >
                    {isRu ? "2. Формат вручения" : "2. Delivery Format"}
                  </span>
                  <div
                    role="radiogroup"
                    aria-labelledby={`${titleId}-delivery-label`}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3.5"
                  >
                    <label
                      className={`p-4 sm:p-5 rounded-xl border text-left cursor-pointer transition-all block select-none has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#ea4043] ${
                        deliveryType === "digital"
                          ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)] font-bold"
                          : "bg-white/[0.03] border-white/15 text-[#8e8e93] hover:text-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryType"
                        value="digital"
                        checked={deliveryType === "digital"}
                        onChange={() => setDeliveryType("digital")}
                        className="sr-only"
                      />
                      <div className="text-sm sm:text-base xl:text-lg uppercase tracking-wider font-bold">
                        {isRu ? "⚡ Электронный (PDF)" : "⚡ Digital (PDF)"}
                      </div>
                      <div className={`text-xs sm:text-sm mt-1 font-normal ${deliveryType === "digital" ? "text-[#3a3a42]" : "text-[#8e8e93]"}`}>
                        {isRu ? "Мгновенно на Email" : "Instant delivery to email"}
                      </div>
                    </label>

                    <label
                      className={`p-4 sm:p-5 rounded-xl border text-left cursor-pointer transition-all block select-none has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#ea4043] ${
                        deliveryType === "box"
                          ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)] font-bold"
                          : "bg-white/[0.03] border-white/15 text-[#8e8e93] hover:text-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryType"
                        value="box"
                        checked={deliveryType === "box"}
                        onChange={() => setDeliveryType("box")}
                        className="sr-only"
                      />
                      <div className="text-sm sm:text-base xl:text-lg uppercase tracking-wider font-bold">
                        {isRu ? "📦 Подарочный бокс" : "📦 Premium Gift Box"}
                      </div>
                      <div className={`text-xs sm:text-sm mt-1 font-normal ${deliveryType === "box" ? "text-[#3a3a42]" : "text-[#8e8e93]"}`}>
                        {isRu ? "Металлическая карта в фирменном боксе" : "Metal card in premium gift box"}
                      </div>
                    </label>
                  </div>
                </div>

                {/* Step 3: Contacts */}
                <div className="space-y-3">
                  <span className="block text-sm sm:text-base uppercase tracking-wider text-white font-bold">
                    {isRu ? "3. Данные получателя и заказчика" : "3. Pilot and Customer Details"}
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
                    <div>
                      <label
                        htmlFor={`${titleId}-recipientName`}
                        className="block text-xs uppercase tracking-wider text-[#a0a0a8] font-bold mb-1.5"
                      >
                        {isRu ? "Имя получателя" : "Recipient Name"}
                      </label>
                      <input
                        id={`${titleId}-recipientName`}
                        name="recipientName"
                        autoComplete="name"
                        type="text"
                        placeholder={isRu ? "Михаил" : "Alex"}
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        className="w-full bg-white/[0.04] hover:bg-white/[0.07] focus:bg-white/[0.08] border border-white/15 focus:border-[#ea4043] rounded-xl px-4 py-3.5 text-white text-sm sm:text-base placeholder:text-[#55555c] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`${titleId}-buyerName`}
                        className="block text-xs uppercase tracking-wider text-[#a0a0a8] font-bold mb-1.5"
                      >
                        {isRu ? "Ваше имя *" : "Your Name *"}
                      </label>
                      <input
                        id={`${titleId}-buyerName`}
                        name="buyerName"
                        autoComplete="name"
                        type="text"
                        required
                        placeholder={isRu ? "Иван" : "John"}
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        className="w-full bg-white/[0.04] hover:bg-white/[0.07] focus:bg-white/[0.08] border border-white/15 focus:border-[#ea4043] rounded-xl px-4 py-3.5 text-white text-sm sm:text-base placeholder:text-[#55555c] focus:outline-none transition-colors"
                      />
                    </div>

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
                        placeholder="+7 (999) 000-00-00"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white/[0.04] hover:bg-white/[0.07] focus:bg-white/[0.08] border border-white/15 focus:border-[#ea4043] rounded-xl px-4 py-3.5 text-white text-sm sm:text-base placeholder:text-[#55555c] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`${titleId}-email`}
                        className="block text-xs uppercase tracking-wider text-[#a0a0a8] font-bold mb-1.5"
                      >
                        Email *
                      </label>
                      <input
                        id={`${titleId}-email`}
                        name="email"
                        autoComplete="email"
                        type="email"
                        required
                        placeholder="pilot@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/[0.04] hover:bg-white/[0.07] focus:bg-white/[0.08] border border-white/15 focus:border-[#ea4043] rounded-xl px-4 py-3.5 text-white text-sm sm:text-base placeholder:text-[#55555c] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Step 4: CTA */}
                <div className="pt-2 space-y-2.5">
                  <button
                    type="submit"
                    className="w-full py-5 px-8 bg-[#ea4043] hover:bg-white text-white hover:text-black font-bold uppercase tracking-[0.14em] text-sm sm:text-base xl:text-lg rounded-xl transition-all duration-300 shadow-[0_0_35px_rgba(234,64,67,0.35)] cursor-pointer select-none flex items-center justify-center gap-2 group"
                  >
                    <span>
                      {isRu
                        ? `Оформить сертификат • ${activePriceFormatted}`
                        : `Order Certificate • ${activePriceFormatted}`}
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>

                  <p className="text-xs text-[#8e8e93] text-center">
                    {isRu
                      ? "Менеджер свяжется с вами в течение 15 минут для подтверждения оплаты и доставки"
                      : "Manager will reach out in 15 minutes to confirm payment and delivery"}
                  </p>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="relative z-10 py-16 space-y-6 text-center">
            <div className="w-20 h-20 rounded-full bg-[#ea4043]/15 text-[#ea4043] border border-[#ea4043]/30 flex items-center justify-center mx-auto text-4xl font-bold shadow-[0_0_30px_rgba(234,64,67,0.3)]">
              ✓
            </div>
            <h3 className="text-3xl sm:text-4xl xl:text-5xl font-bold text-white uppercase tracking-tight">
              {isRu ? "Заказ сертификата оформлен" : "Certificate Ordered"}
            </h3>
            <p className="text-base sm:text-lg text-[#a0a0a8] max-w-lg mx-auto leading-relaxed">
              {isRu
                ? `${buyerName || "Покупатель"}, менеджер свяжется с вами для подтверждения оплаты на сумму ${activePriceFormatted} и отправки сертификата ${recipientName ? `для ${recipientName}` : ""}.`
                : `${buyerName || "Customer"}, our manager will reach out shortly to finalize payment (${activePriceFormatted}) and delivery.`}
            </p>
            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-12 py-4.5 bg-white/10 hover:bg-white text-white hover:text-black font-bold uppercase tracking-wider text-sm sm:text-base rounded-xl transition-all cursor-pointer"
              >
                {isRu ? "Закрыть" : "Close"}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
