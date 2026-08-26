"use client";

import { useRef, useState } from "react";
import type { LeadDraft } from "@/entities/lead";
import {
  submitLead,
  type LeadSubmissionFailureReason,
} from "../api/submit-lead";

export type LeadSubmissionState =
  | { readonly status: "idle" }
  | { readonly status: "submitting" }
  | { readonly status: "succeeded"; readonly submissionId: string }
  | {
      readonly status: "failed";
      readonly reason: LeadSubmissionFailureReason;
      readonly retryAfterSeconds?: number;
    };

type LogicalSubmission = {
  readonly fingerprint: string;
  readonly submissionId: string;
};

function createSubmissionId(): string | undefined {
  return typeof globalThis.crypto?.randomUUID === "function"
    ? globalThis.crypto.randomUUID()
    : undefined;
}

export function useLeadSubmission() {
  const [state, setState] = useState<LeadSubmissionState>({ status: "idle" });
  const logicalSubmissionRef = useRef<LogicalSubmission | undefined>(undefined);
  const isSubmittingRef = useRef(false);

  const submit = async (draft: LeadDraft): Promise<void> => {
    if (isSubmittingRef.current) {
      return;
    }

    let fingerprint: string | undefined;

    try {
      fingerprint = JSON.stringify(draft);
    } catch {
      setState({ status: "failed", reason: "unexpected" });
      return;
    }

    if (!fingerprint) {
      setState({ status: "failed", reason: "unexpected" });
      return;
    }

    const previousSubmission = logicalSubmissionRef.current;
    const submissionId =
      previousSubmission?.fingerprint === fingerprint
        ? previousSubmission.submissionId
        : createSubmissionId();

    if (!submissionId) {
      setState({ status: "failed", reason: "unavailable" });
      return;
    }

    logicalSubmissionRef.current = { fingerprint, submissionId };
    isSubmittingRef.current = true;
    setState({ status: "submitting" });

    const result = await submitLead(draft, submissionId);
    isSubmittingRef.current = false;

    if (result.ok) {
      setState({ status: "succeeded", submissionId });
      return;
    }

    setState({
      status: "failed",
      reason: result.reason,
      retryAfterSeconds: result.retryAfterSeconds,
    });
  };

  return {
    state,
    submit,
    isSubmitting: state.status === "submitting",
    isSucceeded: state.status === "succeeded",
  } as const;
}
