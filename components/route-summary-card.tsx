"use client";

import { motion } from "framer-motion";
import { Banknote, BusFront, Car, Clock3, MapPinned } from "lucide-react";
import type { RouteLocationContext } from "@/lib/location-context";
import type { RouteRecord } from "@/lib/mock-data";
import {
  getBestRouteLabel,
  getRouteDisplayState,
  getSelectedOption,
  type RouteOptionKey,
} from "@/lib/route-presentation";
import { GlassCard } from "@/components/ui/glass-card";

type RouteSummaryCardProps = {
  route: RouteRecord;
  locationContext: RouteLocationContext;
  selectedOptionKey: null | RouteOptionKey;
};

const summaryItems = [
  { key: "fare", label: "Estimated fare", icon: Banknote, color: "text-emerald-600" },
  { key: "time", label: "Estimated time", icon: Clock3, color: "text-sky-700" },
  { key: "vehicle", label: "Transport type", icon: BusFront, color: "text-amber-600" },
] as const;

export function RouteSummaryCard({
  route,
  locationContext,
  selectedOptionKey,
}: RouteSummaryCardProps) {
  const selectedOption = getSelectedOption(route, selectedOptionKey);
  const values = getRouteDisplayState(route, selectedOption, locationContext);

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      <GlassCard className="overflow-hidden p-0">
        <div className="border-b border-slate-200 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(239,246,255,0.98),rgba(224,242,254,0.92))] px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="chip border-sky-200 bg-white text-sky-700">
                  Your Route To {route.destination.toUpperCase()}
                </span>
                <span className="chip border-emerald-200 bg-emerald-50 text-emerald-700">
                  {route.confidence} confidence
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Destination
                </p>
                <h3 className="mt-2 font-display text-3xl tracking-tight text-slate-950 sm:text-[2.4rem]">
                  {route.destination}
                </h3>
              </div>
              <div className="rounded-[22px] border border-slate-200 bg-white px-4 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
                <div className="flex items-center gap-2 text-sm font-semibold text-sky-700">
                  <MapPinned className="h-4 w-4" />
                  Best route
                </div>
                <p className="mt-2 text-base font-semibold text-slate-900">
                  {getBestRouteLabel(route, locationContext)}
                </p>
                {selectedOption ? (
                  <p className="mt-2 text-xs font-medium text-slate-600">
                    Active option: {selectedOption.label}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="w-full max-w-sm rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_14px_34px_rgba(37,99,235,0.06)]">
              <p className="text-xs uppercase tracking-[0.18em] text-sky-700">
                Fast answer
              </p>
              <div className="mt-3 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Start</span>
                  <span className="font-semibold text-slate-950">
                    {locationContext.originLabel}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Board at</span>
                  <span className="font-semibold text-slate-950">
                    {values.boardAt}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Vehicle</span>
                  <span className="font-semibold text-slate-950">{values.vehicle}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Tell the mate</span>
                  <span className="max-w-[190px] text-right font-semibold text-slate-950">
                    {values.driverPhrase}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Alight</span>
                  <span className="font-semibold text-slate-950">{values.alightAt}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Walking distance</span>
                  <span className="font-semibold text-slate-950">
                    {values.walkingDistance}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 px-5 py-5 sm:grid-cols-3 sm:px-6">
          {summaryItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.key}
                className={`rounded-[22px] border p-4 ${
                  item.key === "vehicle"
                    ? "border-amber-200 bg-amber-50"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className={`flex items-center gap-2 text-sm font-semibold ${item.color}`}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-900">{values[item.key]}</p>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </motion.div>
  );
}
