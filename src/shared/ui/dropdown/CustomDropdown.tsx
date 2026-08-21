"use client";

import React, { useState, useRef, useEffect } from "react";
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

  const selectedOption = options.find((opt) => opt.id === value);

  // Close dropdown when clicking outside
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

  // Handle ESC key to close
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Helper to split "Title — Price" into two components
  const renderOptionContent = (text: string, isSelected: boolean) => {
    if (text.includes(" — ")) {
      const [title, price] = text.split(" — ");
      return (
        <div className="flex items-center justify-between w-full gap-3">
          <span className={`font-semibold ${isSelected ? "text-white" : "text-[#e5e5ea]"}`}>
            {title}
          </span>
          <span
            className={`text-xs px-2.5 py-0.5 rounded font-bold shrink-0 tracking-wide ${
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
    return <span className="font-semibold">{text}</span>;
  };

  return (
    <div className={`relative w-full ${isOpen ? "z-50" : "z-10"}`} ref={dropdownRef}>
      {label && (
        <label className="block text-xs uppercase tracking-wider text-[#8e8e93] font-semibold mb-2">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-white/[0.04] hover:bg-white/[0.07] border rounded-lg px-4.5 py-3.5 text-white text-sm text-left transition-all duration-200 cursor-pointer ${
          isOpen
            ? "border-[#ea4043] bg-white/[0.08] shadow-[0_0_20px_rgba(234,64,67,0.25)]"
            : "border-white/15 hover:border-white/30"
        }`}
      >
        <div className="w-full pr-2">
          {selectedOption ? (
            renderOptionContent(selectedOption.label, false)
          ) : (
            <span className="text-[#8e8e93]">{placeholder || "Выберите..."}</span>
          )}
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-xs text-[#8e8e93] shrink-0 ml-2"
        >
          ▼
        </motion.span>
      </button>

      {/* Custom Animated Popup List */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#0d0d12]/98 border border-white/20 rounded-xl shadow-[0_25px_70px_rgba(0,0,0,0.98),0_0_40px_rgba(234,64,67,0.18)] backdrop-blur-2xl p-2 pb-3.5 max-h-[260px] overflow-y-auto no-scrollbar space-y-1 overscroll-contain"
          >
            {options.map((opt) => {
              const isSelected = opt.id === value;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    onChange(opt.id);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3.5 py-3 rounded-lg text-sm text-left flex items-center justify-between cursor-pointer transition-all duration-150 group ${
                    isSelected
                      ? "bg-[#ea4043] text-white shadow-[0_0_20px_rgba(234,64,67,0.5)]"
                      : "text-[#d1d1d6] hover:text-white hover:bg-white/10"
                  }`}
                >
                  <div className="w-full flex items-center justify-between gap-3">
                    {renderOptionContent(opt.label, isSelected)}
                    {isSelected && (
                      <span className="text-white text-xs font-bold shrink-0 ml-1">✓</span>
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
