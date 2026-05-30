"use client";

import { motion } from "framer-motion";
import {
  ArrowDownToLine,
  BusFront,
  Footprints,
  LocateFixed,
  Sparkles,
} from "lucide-react";
import type { RouteLocationContext } from "@/lib/location-context";
import type { RouteRecord } from "@/lib/mock-data";
import {
  buildJourneySteps,
  getSelectedOption,
  type RouteOptionKey,
} from "@/lib/route-presentation";
import { GlassCard } from "@/components/ui/glass-card";

type RouteTimelineProps = {
  route: RouteRecord;
  locationContext: RouteLocationContext;
  selectedOptionKey: null | RouteOptionKey;
};

const iconMap = {
  walk: Footprints,
  board: BusFront,
  phrase: Sparkles,
  alight: ArrowDownToLine,
  arrive: LocateFixed,
} as const;

export function RouteTimeline({
  route,
  locationContext,
  selectedOptionKey,
}: RouteTimelineProps) {
  const steps = buildJourneySteps(
    route,
    getSelectedOption(route, selectedOptionKey),
    locationContext,
  );
  const pathStops = [
    locationContext.originLabel,
    route.boardingPoint,
    route.alightingPoint,
    route.destination,
  ];

  return (
    <GlassCard className="p-5 sm:p-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
            Step-By-Step Direction Timeline
          </p>
          <h3 className="mt-2 font-display text-2xl text-slate-950">
            Understand the route in under 5 seconds
          </h3>
        </div>
        <span className="hidden rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600 sm:inline-flex">
          {steps.length} steps
        </span>
      </div>

      <div className="mb-6 rounded-[24px] border border-sky-200 bg-sky-50/70 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
          Journey path
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          {pathStops.map((stop, index) => (
            <div key={`${stop}-${index}`} className="flex items-center gap-2">
              <span
                className={`rounded-full border px-3 py-1.5 font-medium ${
                  index === pathStops.length - 1
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : index === 1 || index === 2
                      ? "border-amber-200 bg-amber-50 text-amber-700"
                      : "border-white bg-white text-slate-700"
                }`}
              >
                {stop}
              </span>
              {index < pathStops.length - 1 ? (
                <span className="text-sky-700">{"->"}</span>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="relative space-y-4">
        <div className="absolute bottom-2 left-[21px] top-2 w-px bg-[linear-gradient(180deg,rgba(2,132,199,0.7),rgba(37,99,235,0.35),rgba(148,163,184,0.22))]" />
        {steps.map((step, index) => {
          const Icon = iconMap[step.kind];

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="relative flex gap-4"
            >
              <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-sky-200 bg-white text-sky-700 shadow-[0_0_0_6px_rgba(239,246,255,0.95)]">
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:px-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700">
                      Step {index + 1}
                    </span>
                    <h4 className="text-base font-semibold text-slate-950">{step.title}</h4>
                  </div>
                  {step.meta ? (
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                      {step.meta}
                    </span>
                  ) : null}
                </div>
                {step.fromLabel && step.toLabel ? (
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-600">
                      From: <span className="font-semibold text-slate-900">{step.fromLabel}</span>
                    </span>
                    <span className="text-sky-700">{"->"}</span>
                    <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-600">
                      To: <span className="font-semibold text-slate-900">{step.toLabel}</span>
                    </span>
                  </div>
                ) : null}
                <p className="mt-3 text-sm leading-7 text-slate-600">{step.instruction}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
}
