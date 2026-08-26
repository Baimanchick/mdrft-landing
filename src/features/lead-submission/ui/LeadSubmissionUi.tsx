"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/shared/lib/i18n/LanguageContext";
import type { LeadSubmissionState } from "../model/useLeadSubmission";

type LeadConsentFieldProps = {
  readonly id: string;
  readonly checked: boolean;
  readonly disabled: boolean;
  readonly onChange: (checked: boolean) => void;
};

export function LeadConsentField({
  id,
  checked,
  disabled,
  onChange,
}: LeadConsentFieldProps) {
  const [showError, setShowError] = useState(false);
  const { t } = useLanguage();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  return (
    <div className="space-y-1.5">
      <label className="flex items-start gap-3 text-xs sm:text-sm text-[#b5b5bd] leading-relaxed cursor-pointer">
        <input
          id={id}
          type="checkbox"
          required
          checked={checked}
          disabled={disabled}
          aria-invalid={showError || undefined}
          aria-describedby={`${hintId}${showError ? ` ${errorId}` : ""}`}
          onInvalid={() => setShowError(true)}
          onChange={(event) => {
            setShowError(false);
            onChange(event.target.checked);
          }}
          className="mt-0.5 size-5 shrink-0 accent-[#ea4043]"
        />
        <span id={hintId}>{t.leadSubmission.consent}</span>
      </label>
      <p id={errorId} role="alert" className="pl-8 text-xs text-[#ff6b6e]">
        {showError ? t.leadSubmission.consentRequired : ""}
      </p>
    </div>
  );
}

function getErrorMessage(
  state: Extract<LeadSubmissionState, { readonly status: "failed" }>,
  messages: ReturnType<typeof useLanguage>["t"]["leadSubmission"],
): string {
  if (state.reason === "disabled") {
    return messages.disabled;
  }

  if (state.reason === "forbidden") {
    return messages.forbidden;
  }

  if (state.reason === "rate_limited") {
    return messages.rateLimited(state.retryAfterSeconds);
  }

  if (state.reason === "validation") {
    return messages.validation;
  }

  if (state.reason === "uncertain") {
    return messages.uncertain;
  }

  if (state.reason === "unavailable") {
    return messages.unavailable;
  }

  return messages.unexpected;
}

export function LeadSubmissionFeedback({ state }: { readonly state: LeadSubmissionState }) {
  const { t } = useLanguage();
  const errorRef = useRef<HTMLDivElement | null>(null);
  const errorMessage =
    state.status === "failed" ? getErrorMessage(state, t.leadSubmission) : "";

  useEffect(() => {
    if (state.status === "failed") {
      errorRef.current?.focus({ preventScroll: true });
    }
  }, [state]);

  return (
    <div className="space-y-2">
      <p role="status" aria-atomic="true" className="min-h-4 text-xs text-[#b5b5bd] text-center">
        {state.status === "submitting" ? t.leadSubmission.submitting : ""}
      </p>
      <div
        ref={errorRef}
        role="alert"
        aria-atomic="true"
        tabIndex={-1}
        className="focus:outline-none"
      >
        {errorMessage ? (
          <p className="rounded-xl border border-[#ea4043]/40 bg-[#ea4043]/10 px-4 py-3 text-sm text-[#ffb4b6]">
            {errorMessage}
          </p>
        ) : null}
      </div>
    </div>
  );
}

type LeadSubmissionSuccessProps = {
  readonly titleId: string;
  readonly title: string;
  readonly description: string;
  readonly closeLabel: string;
  readonly onClose: () => void;
};

export function LeadSubmissionSuccess({
  titleId,
  title,
  description,
  closeLabel,
  onClose,
}: LeadSubmissionSuccessProps) {
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <div role="status" aria-live="polite" className="relative z-10 py-16 space-y-6 text-center">
      <div
        aria-hidden="true"
        className="w-20 h-20 rounded-full bg-[#ea4043]/15 text-[#ea4043] border border-[#ea4043]/30 flex items-center justify-center mx-auto text-4xl font-bold shadow-[0_0_30px_rgba(234,64,67,0.3)]"
      >
        ✓
      </div>
      <h3
        ref={headingRef}
        id={titleId}
        tabIndex={-1}
        className="text-3xl sm:text-4xl font-bold text-white uppercase tracking-tight focus:outline-none"
      >
        {title}
      </h3>
      <p className="text-base sm:text-lg text-[#a0a0a8] max-w-lg mx-auto leading-relaxed">
        {description}
      </p>
      <div className="pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-12 py-4.5 bg-white/10 hover:bg-white text-white hover:text-black font-bold uppercase tracking-wider text-sm sm:text-base rounded-xl transition-all cursor-pointer"
        >
          {closeLabel}
        </button>
      </div>
    </div>
  );
}
