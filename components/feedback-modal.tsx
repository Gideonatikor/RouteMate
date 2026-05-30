"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Send, CheckCircle } from "lucide-react";
import { reportActions } from "@/lib/mock-data";
import type { RouteRecord } from "@/lib/mock-data";

type FeedbackEntry = {
  routeId: string;
  routeLabel: string;
  action: string;
  details: string;
  submittedAt: string;
};

function saveFeedback(entry: FeedbackEntry) {
  try {
    const existing: FeedbackEntry[] = JSON.parse(
      localStorage.getItem("routemate_feedback") ?? "[]",
    );
    existing.push(entry);
    localStorage.setItem("routemate_feedback", JSON.stringify(existing));
  } catch {
    // localStorage unavailable — silently skip persistence
  }
}

type Props = {
  route: RouteRecord;
  onClose: () => void;
  onSubmitted: () => void;
};

export function FeedbackModal({ route, onClose, onSubmitted }: Props) {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (!selectedAction) return;

    saveFeedback({
      routeId: route.id,
      routeLabel: `${route.from} → ${route.destination}`,
      action: selectedAction,
      details: details.trim(),
      submittedAt: new Date().toISOString(),
    });

    setSubmitted(true);

    const timeout = window.setTimeout(() => {
      onSubmitted();
      onClose();
    }, 1800);

    return () => window.clearTimeout(timeout);
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 backdrop-blur-sm sm:items-center"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.97 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="w-full max-w-md rounded-t-[28px] border border-slate-200 bg-white px-6 pb-8 pt-6 shadow-[0_-20px_60px_rgba(15,23,42,0.12)] dark:border-slate-700 dark:bg-slate-900 sm:rounded-[28px]"
        >
          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <CheckCircle className="h-12 w-12 text-emerald-500" />
              <p className="font-display text-xl font-bold text-slate-950 dark:text-white">
                Thanks for the report
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Your feedback helps us improve route data for everyone.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-bold text-slate-950 dark:text-white">
                    Report or Improve This Route
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {route.from} → {route.destination}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2">
                {reportActions.map((action) => (
                  <button
                    key={action}
                    type="button"
                    onClick={() => setSelectedAction(action)}
                    className={[
                      "flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-medium transition",
                      selectedAction === action
                        ? "border-sky-400 bg-sky-50 text-sky-800 dark:border-sky-600 dark:bg-sky-950 dark:text-sky-200"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "flex h-4 w-4 shrink-0 rounded-full border-2",
                        selectedAction === action
                          ? "border-sky-500 bg-sky-500"
                          : "border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900",
                      ].join(" ")}
                    />
                    {action}
                  </button>
                ))}
              </div>

              <div className="mt-4">
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Additional details (optional) — e.g. the correct fare, where the station moved to…"
                  rows={3}
                  maxLength={400}
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:ring-sky-900"
                />
                {details.length > 0 && (
                  <p className="mt-1 text-right text-[11px] text-slate-400">
                    {details.length}/400
                  </p>
                )}
              </div>

              <button
                type="button"
                disabled={!selectedAction}
                onClick={handleSubmit}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#0284c7,#2563eb)] px-5 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:brightness-100"
              >
                <Send className="h-4 w-4" />
                Submit Report
              </button>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
