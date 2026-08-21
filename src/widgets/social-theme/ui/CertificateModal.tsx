"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "@/shared/lib/i18n/LanguageContext";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CertificateModal({ isOpen, onClose }: CertificateModalProps) {
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [deliveryType, setDeliveryType] = useState<"digital" | "box">("digital");
  const [recipientName, setRecipientName] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
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

  const CERTIFICATE_PLANS = [
    {
      id: "intro",
      title: isRu ? "Вводная сессия (1.5 ч)" : "Intro Session (1.5h)",
      price: "45 000 ₽",
      desc: isRu ? "Теория заноса, контрруление, базовые восьмерки на BMW M" : "Drift physics, countersteering, figure 8s on BMW M",
    },
    {
      id: "pro",
      title: isRu ? "PRO Дрифт-Курс (3 ч)" : "PRO Drift Course (3h)",
      price: "95 000 ₽",
      desc: isRu ? "Перекладки, работа инерцией, фулл-газ на боевом треке" : "Weight transfer, high-speed clipping points, full throttle",
    },
    {
      id: "mastery",
      title: isRu ? "M-Mastery (2 Дня)" : "M-Mastery (2 Days)",
      price: "180 000 ₽",
      desc: isRu ? "Полный индивидуальный курс + телеметрия + все модели M-парка" : "Full private intensive + telemetry + all M-fleet models",
    },
    {
      id: "custom",
      title: isRu ? "Номинал на выбор" : "Custom Voucher",
      price: isRu ? "От 30 000 ₽" : "From 30 000 ₽",
      desc: isRu ? "Получатель сам выберет программу или доплатит за апгрейд" : "Recipient selects their preferred program",
    },
  ];

  const currentSelectedObj = CERTIFICATE_PLANS.find((p) => p.id === selectedPlan) || CERTIFICATE_PLANS[1];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setSubmitted(true);
  };

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

          {/* Wide 2-Column Luxury Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl lg:max-w-5xl max-h-[92vh] overflow-y-auto no-scrollbar bg-[#08080b] border border-white/15 p-6 sm:p-8 lg:p-10 rounded-2xl z-10 my-auto shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_60px_rgba(234,64,67,0.08)] transform-gpu overscroll-contain"
          >
            {/* Ambient Motorsport Lighting Effect */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#ea4043]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#ea4043]/5 rounded-full blur-3xl pointer-events-none" />

            {/* Top Close Button */}
            <div className="absolute top-5 right-5 z-20">
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/15 text-[#a0a0a8] hover:text-white hover:bg-white/15 hover:border-white/30 cursor-pointer transition-all"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                  {/* Left Column (5 of 12): Header & Live Certificate Preview */}
                  <div className="lg:col-span-5 space-y-6">
                    {/* Header */}
                    <div className="space-y-2 pr-6">
                      <span className="text-xs uppercase tracking-widest text-[#ea4043] font-bold block">
                        {isRu ? "// ПОДАРОЧНЫЕ СЕРТИФИКАТЫ" : "// GIFT CERTIFICATES"}
                      </span>
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-white leading-tight">
                        {isRu ? "ПОДАРИТЬ ЭМОЦИИ" : "GIFT AN EXPERIENCE"}
                        <span className="text-gradient-red">.</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-[#a0a0a8] font-normal leading-relaxed">
                        {isRu
                          ? "Бессрочные сертификаты на управление BMW M-серии. Электронный PDF или премиум-бокс."
                          : "Non-expiring gift vouchers for BMW M-fleet. Instant PDF or metal gift box."}
                      </p>
                    </div>

                    {/* Visual Live Interactive Certificate Card */}
                    <div className="p-5 sm:p-6 rounded-xl bg-gradient-to-br from-[#18181f] via-[#0d0d12] to-[#050508] border border-white/15 relative overflow-hidden shadow-2xl space-y-4">
                      <div className="absolute top-0 right-0 w-44 h-44 bg-[#ea4043]/15 rounded-full blur-3xl pointer-events-none" />
                      <div className="flex items-center justify-between text-xs text-[#8e8e93]">
                        <span className="text-[#ea4043] font-bold uppercase tracking-wider">MDRIFT // OFFICIAL VOUCHER</span>
                        <span className="font-mono text-[11px]">N° 849201</span>
                      </div>

                      <div>
                        <div className="text-lg sm:text-xl font-bold uppercase text-white tracking-tight leading-snug">
                          {currentSelectedObj.title}
                        </div>
                        <div className="text-xs text-[#a0a0a8] mt-1 line-clamp-2 leading-relaxed">
                          {recipientName ? (
                            <span>{isRu ? "Для пилота: " : "For Pilot: "}<strong className="text-white font-medium">{recipientName}</strong></span>
                          ) : (
                            <span>{currentSelectedObj.desc}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-white/10">
                        <span className="text-xs text-[#8e8e93] uppercase tracking-wider font-medium">
                          {deliveryType === "digital" ? "⚡ Электронный PDF" : "📦 Премиум металл-бокс"}
                        </span>
                        <span className="text-lg font-bold text-white tracking-tight">{currentSelectedObj.price}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-white/[0.02] border border-white/10 text-xs text-[#8e8e93] leading-relaxed flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-[#ea4043] shrink-0" />
                      <span>{isRu ? "Действует на всех автомобилях академии без ограничений по времени." : "Valid across all academy cars with no expiry date."}</span>
                    </div>
                  </div>

                  {/* Right Column (7 of 12): Form Inputs in Width */}
                  <div className="lg:col-span-7 space-y-5">
                    {/* Program Selection 2x2 Grid */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#8e8e93] font-semibold mb-2">
                        {isRu ? "1. Выберите программу сертификата" : "1. Select Program"}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {CERTIFICATE_PLANS.map((plan) => {
                          const isSelected = selectedPlan === plan.id;
                          return (
                            <div
                              key={plan.id}
                              onClick={() => setSelectedPlan(plan.id)}
                              className={`p-3.5 rounded-lg border cursor-pointer transition-all duration-200 ${
                                isSelected
                                  ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                                  : "bg-white/[0.03] border-white/15 text-[#a0a0a8] hover:border-white/30 hover:text-white"
                              }`}
                            >
                              <div className="text-xs font-bold uppercase tracking-wider mb-0.5">
                                {plan.title}
                              </div>
                              <div className={`text-xs font-bold ${isSelected ? "text-black" : "text-white"}`}>
                                {plan.price}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Delivery Format */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#8e8e93] font-semibold mb-2">
                        {isRu ? "2. Формат вручения" : "2. Delivery Format"}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={() => setDeliveryType("digital")}
                          className={`p-3.5 rounded-lg border text-left cursor-pointer transition-all ${
                            deliveryType === "digital"
                              ? "bg-white text-black border-white font-bold shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                              : "bg-white/[0.03] border-white/15 text-[#8e8e93] hover:text-white"
                          }`}
                        >
                          <div className="text-xs uppercase tracking-wider font-bold">
                            {isRu ? "Электронный (PDF)" : "Digital PDF"}
                          </div>
                          <div className="text-xs opacity-75 mt-0.5 font-normal">
                            {isRu ? "Мгновенно на Email" : "Instant email delivery"}
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeliveryType("box")}
                          className={`p-3.5 rounded-lg border text-left cursor-pointer transition-all ${
                            deliveryType === "box"
                              ? "bg-white text-black border-white font-bold shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                              : "bg-white/[0.03] border-white/15 text-[#8e8e93] hover:text-white"
                          }`}
                        >
                          <div className="text-xs uppercase tracking-wider font-bold">
                            {isRu ? "Подарочный бокс" : "Gift Box"}
                          </div>
                          <div className="text-xs opacity-75 mt-0.5 font-normal">
                            {isRu ? "Металлическая карта в боксе" : "Metal card with delivery"}
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Names Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#8e8e93] font-semibold mb-1.5">
                          {isRu ? "Имя получателя" : "Recipient Name"}
                        </label>
                        <input
                          type="text"
                          placeholder={isRu ? "Имя на сертификате" : "Recipient name"}
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                          className="w-full bg-white/[0.04] hover:bg-white/[0.07] focus:bg-white/[0.08] border border-white/15 focus:border-[#ea4043] rounded-lg px-4 py-3.5 text-white text-sm placeholder:text-[#55555c] focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#8e8e93] font-semibold mb-1.5">
                          {isRu ? "Ваше имя *" : "Your Name *"}
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={isRu ? "Иван" : "John"}
                          value={buyerName}
                          onChange={(e) => setBuyerName(e.target.value)}
                          className="w-full bg-white/[0.04] hover:bg-white/[0.07] focus:bg-white/[0.08] border border-white/15 focus:border-[#ea4043] rounded-lg px-4 py-3.5 text-white text-sm placeholder:text-[#55555c] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Contacts Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#8e8e93] font-semibold mb-1.5">
                          {isRu ? "Ваш телефон *" : "Phone *"}
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
                        <label className="block text-xs uppercase tracking-wider text-[#8e8e93] font-semibold mb-1.5">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="pilot@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-white/[0.04] hover:bg-white/[0.07] focus:bg-white/[0.08] border border-white/15 focus:border-[#ea4043] rounded-lg px-4 py-3.5 text-white text-sm placeholder:text-[#55555c] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2 space-y-2">
                      <button
                        type="submit"
                        className="w-full py-4 px-6 bg-[#ea4043] hover:bg-white text-white hover:text-black font-bold uppercase tracking-[0.14em] text-xs sm:text-sm rounded-lg transition-all duration-300 shadow-[0_0_35px_rgba(234,64,67,0.35)] cursor-pointer select-none flex items-center justify-center gap-2 group"
                      >
                        <span>{isRu ? "Оформить подарочный сертификат" : "Order Gift Certificate"}</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </button>

                      <p className="text-[11px] text-[#8e8e93] text-center">
                        {isRu
                          ? "Менеджер свяжется с вами в течение 15 минут для подтверждения деталей"
                          : "Manager will contact you within 15 minutes to confirm details"}
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="relative z-10 py-16 space-y-5 text-center">
                <div className="w-16 h-16 rounded-full bg-[#ea4043]/15 text-[#ea4043] border border-[#ea4043]/30 flex items-center justify-center mx-auto text-2xl font-bold shadow-[0_0_30px_rgba(234,64,67,0.3)]">
                  ✓
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight">
                  {isRu ? "Заказ сертификата оформлен" : "Certificate Ordered"}
                </h3>
                <p className="text-sm sm:text-base text-[#a0a0a8] max-w-md mx-auto leading-relaxed">
                  {isRu
                    ? `${buyerName || "Покупатель"}, менеджер свяжется с вами для подтверждения оплаты и доставки сертификата для ${recipientName || "получателя"}.`
                    : `${buyerName || "Customer"}, our manager will reach out shortly to finalize payment and delivery.`}
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
