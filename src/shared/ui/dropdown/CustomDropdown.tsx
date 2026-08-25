"use client";

import React, { useState, useRef, useEffect, useId } from "react";
import { motion, AnimatePresence } from "motion/react";

export interface DropdownOption {
  id: string;
  label: string;
}

interface CustomDropdownProps {
  label?: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CustomDropdown({
  label,
  value,
  options,
  onChange,
  placeholder,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const fieldId = useId();
  const labelId = `${fieldId}-label`;
  const listId = `${fieldId}-list`;

  const selectedOption = options.find((opt) => opt.id === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const renderTriggerLabel = (text: string) => {
    if (text.includes(" — ")) {
      const [title, price] = text.split(" — ");
      return (
        <div className="flex items-center justify-between w-full min-w-0 gap-2">
          <span className="font-semibold text-white truncate text-sm sm:text-base">
            {title}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-md font-bold font-mono shrink-0 whitespace-nowrap bg-white/10 text-white">
            {price}
          </span>
        </div>
      );
    }
    return (
      <span className="font-semibold text-white truncate text-sm sm:text-base">
        {text}
      </span>
    );
  };

  const renderOptionItem = (text: string, isSelected: boolean) => {
    if (text.includes(" — ")) {
      const [title, price] = text.split(" — ");
      return (
        <div className="flex items-center justify-between w-full min-w-0 gap-3">
          <span className={`font-semibold text-sm sm:text-base ${isSelected ? "text-white" : "text-[#f0f0f5]"}`}>
            {title}
          </span>
          <span
            className={`text-xs px-2.5 py-1 rounded-md font-bold font-mono shrink-0 whitespace-nowrap ${
              isSelected
                ? "bg-black/30 text-white"
                : "bg-white/10 text-white group-hover:bg-white/20"
            }`}
          >
            {price}
          </span>
        </div>
      );
    }
    return (
      <span className={`font-semibold text-sm sm:text-base ${isSelected ? "text-white" : "text-[#f0f0f5]"}`}>
        {text}
      </span>
    );
  };

  return (
    <div className={`relative w-full ${isOpen ? "z-50" : "z-10"}`} ref={dropdownRef}>
      {label && (
        <span
          id={labelId}
          className="block text-xs sm:text-sm uppercase tracking-wider text-white font-bold mb-2"
        >
          {label}
        </span>
      )}

      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listId : undefined}
        aria-labelledby={label ? `${labelId} ${fieldId}-value` : undefined}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-14 min-h-[56px] flex items-center justify-between bg-white/[0.04] hover:bg-white/[0.07] border rounded-xl px-4 text-white text-left transition-all duration-200 cursor-pointer ${
          isOpen
            ? "border-[#ea4043] bg-white/[0.08] shadow-[0_0_20px_rgba(234,64,67,0.25)]"
            : "border-white/15 hover:border-white/30"
        }`}
      >
        <div id={`${fieldId}-value`} className="min-w-0 flex-1 pr-2">
          {selectedOption ? (
            renderTriggerLabel(selectedOption.label)
          ) : (
            <span className="text-[#8e8e93] text-sm sm:text-base">{placeholder || "Выберите..."}</span>
          )}
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-xs text-[#8e8e93] shrink-0 ml-1.5"
        >
          ▼
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            id={listId}
            role="listbox"
            aria-labelledby={labelId}
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="absolute top-full right-0 min-w-full sm:min-w-[420px] max-w-[min(540px,92vw)] mt-2 z-50 bg-[#0d0d14]/98 border border-white/20 rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.98),0_0_40px_rgba(234,64,67,0.2)] backdrop-blur-2xl p-2 max-h-[320px] overflow-y-auto no-scrollbar space-y-1 overscroll-contain"
          >
            {options.map((opt) => {
              const isSelected = opt.id === value;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(opt.id);
                    setIsOpen(false);
                    triggerRef.current?.focus();
                  }}
                  className={`w-full px-4 py-3.5 rounded-xl text-left flex items-center justify-between cursor-pointer transition-all duration-150 group ${
                    isSelected
                      ? "bg-[#ea4043] text-white shadow-[0_0_20px_rgba(234,64,67,0.5)]"
                      : "text-[#d1d1d6] hover:text-white hover:bg-white/10"
                  }`}
                >
                  <div className="w-full flex items-center justify-between gap-3">
                    {renderOptionItem(opt.label, isSelected)}
                    {isSelected && (
                      <span className="text-white text-sm font-bold shrink-0 ml-1.5">✓</span>
                    )}
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
