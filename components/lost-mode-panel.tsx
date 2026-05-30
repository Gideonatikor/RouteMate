"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BusFront,
  LocateFixed,
  MapPinned,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { RouteLocationContext } from "@/lib/location-context";
import type { RouteRecord } from "@/lib/mock-data";
import { GoogleMapView } from "@/components/google-map-view";
import { GlassCard } from "@/components/ui/glass-card";

type LostModePanelProps = {
  route: RouteRecord;
  locationContext: RouteLocationContext;
  isActive: boolean;
  activeStepIndex: number;
  onActivate: () => void;
};

const stepIcons = [LocateFixed, MapPinned, ArrowRight, BusFront, ArrowRight, Sparkles];

export function LostModePanel({
  route,
  locationContext,
  isActive,
  activeStepIndex,
  onActivate,
}: LostModePanelProps) {
  const landmark = route.nearbyLandmarks.find(
    (item) => item.name === locationContext.nearestLandmarkName,
  ) ?? route.nearbyLandmarks[0];
  const steps = [
    `Detecting your location near ${locationContext.originLabel}...`,
    `Nearest useful landmark found: ${landmark.name}`,
    `Walk ${locationContext.walkTime} to ${landmark.name}`,
    `From ${landmark.name}, board ${route.vehicleType}`,
    `Alight at ${route.alightingPoint}`,
    `Walk 2 minutes to ${route.destination}`,
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
      <GlassCard className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
              Lost Mode
            </p>
            <h3 className="mt-2 font-display text-3xl tracking-tight text-slate-950">
              {isActive ? "Lost Mode Activated" : "When you are unsure where to start"}
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              RouteMate finds the nearest useful landmark, gets the rider to a safe boarding point, and then translates that into the right public transport action.
            </p>
          </div>

          <button
            type="button"
            onClick={onActivate}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-sky-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-[0_14px_28px_rgba(14,165,233,0.08)] transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-[0_18px_38px_rgba(245,158,11,0.14)]"
          >
            <LocateFixed className="h-4 w-4 text-amber-500" />
            {isActive ? "Re-run Lost Mode" : "I'm Lost"}
          </button>
        </div>

        <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-950">Recovery progress</p>
            <span className="text-xs font-medium text-sky-700">
              {Math.min(activeStepIndex + 1, steps.length)}/{steps.length}
            </span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-slate-200">
            <motion.div
              className="h-2 rounded-full bg-[linear-gradient(90deg,#06b6d4,#0284c7,#2563eb)]"
              animate={{ width: `${((Math.min(activeStepIndex + 1, steps.length)) / steps.length) * 100}%` }}
              transition={{ duration: 0.35 }}
            />
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {steps.map((step, index) => {
            const Icon = stepIcons[index];
            const current = isActive && index === activeStepIndex;
            const complete = isActive && index < activeStepIndex;

            return (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-[24px] border p-4 sm:p-5 ${
                  current
                    ? "border-sky-300 bg-sky-50 shadow-[0_18px_36px_rgba(37,99,235,0.08)]"
                    : complete
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                      current
                        ? "bg-sky-100 text-sky-700"
                        : complete
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                        Step {index + 1}
                      </span>
                      {current ? (
                        <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                          Live
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-3 text-sm font-semibold leading-7 text-slate-950">{step}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {isActive ? (
            <motion.div
              key={`${route.id}-${activeStepIndex}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 rounded-[24px] border border-amber-200 bg-amber-50 p-5"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-amber-700">
                <ShieldCheck className="h-4 w-4" />
                Local confidence cue
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                Use the phrase <span className="font-semibold text-slate-950">"{route.driverPhrase}"</span> and stay within <span className="font-semibold text-slate-950">{route.fareRange}</span>.
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </GlassCard>

      <div className="space-y-4">
        <GoogleMapView
          route={route}
          locationContext={locationContext}
          lostMode
          compact
        />

        <GlassCard className="p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[22px] border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-amber-700">
                <MapPinned className="h-4 w-4" />
                Nearest landmark
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-950">{landmark.name}</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">{landmark.clue}</p>
            </div>
            <div className="rounded-[22px] border border-sky-200 bg-sky-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-sky-700">
                <BusFront className="h-4 w-4" />
                Boarding instruction
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-950">{landmark.transportHint}</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">Then continue to {route.alightingPoint} before the final short walk.</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
