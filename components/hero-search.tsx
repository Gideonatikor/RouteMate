"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Banknote,
  BusFront,
  Car,
  Clock3,
  LocateFixed,
  MapPin,
  Search,
} from "lucide-react";
import {
  userLocationOptions,
  type RouteLocationContext,
  type UserLocationId,
} from "@/lib/location-context";
import type { RouteRecord } from "@/lib/mock-data";
import {
  getRouteDisplayState,
  getSelectedOption,
  type RouteOptionKey,
} from "@/lib/route-presentation";
import { GlassCard } from "@/components/ui/glass-card";

type HeroSearchProps = {
  query: string;
  route: RouteRecord;
  locationContext: RouteLocationContext;
  selectedLocationId: UserLocationId;
  selectedOptionKey: null | RouteOptionKey;
  onLocationChange: (value: UserLocationId) => void;
  onQueryChange: (value: string) => void;
  onSubmit: () => void;
  onLostMode: () => void;
  onQuickSelect: (value: string) => void;
};

const quickDestinations = [
  "KJTL",
  "Tech Junction",
  "Ayeduase",
  "Kejetia",
  "Adum",
  "Republic Hall",
];

const highlights = [
  {
    label: "Fare estimate",
    getValue: (route: RouteRecord, optionKey: null | RouteOptionKey) =>
      getSelectedOption(route, optionKey)?.fare ?? route.fareRange,
    icon: Banknote,
    color: "text-emerald-600",
  },
  {
    label: "Taxi/trotro",
    getValue: (route: RouteRecord, optionKey: null | RouteOptionKey) =>
      getSelectedOption(route, optionKey)?.transportType ?? route.vehicleType,
    icon: BusFront,
    color: "text-amber-600",
  },
  {
    label: "Travel time",
    getValue: (route: RouteRecord, optionKey: null | RouteOptionKey) =>
      getSelectedOption(route, optionKey)?.time ?? route.estimatedTime,
    icon: Clock3,
    color: "text-sky-700",
  },
  {
    label: "You save",
    getValue: (route: RouteRecord) => route.savings,
    icon: Car,
    color: "text-emerald-600",
  },
] as const;

export function HeroSearch({
  query,
  route,
  locationContext,
  selectedLocationId,
  selectedOptionKey,
  onLocationChange,
  onQueryChange,
  onSubmit,
  onLostMode,
  onQuickSelect,
}: HeroSearchProps) {
  const selectedLocation =
    userLocationOptions.find((option) => option.id === selectedLocationId) ??
    userLocationOptions[0];
  const displayState = getRouteDisplayState(
    route,
    getSelectedOption(route, selectedOptionKey),
    locationContext,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
      className="min-w-0 space-y-6 sm:space-y-7"
    >
      <div className="flex flex-wrap gap-2">
        <span className="chip border-sky-200 bg-white text-sky-700">
          RouteMate for public transport
        </span>
        <span className="chip border-cyan-200 bg-cyan-50 text-cyan-700">
          Landmark-based navigation
        </span>
      </div>

      <div className="space-y-5">
        <h1 className="max-w-4xl font-display text-[3.2rem] leading-[0.92] tracking-tight text-slate-950 sm:text-[4.3rem] xl:text-[4.8rem] 2xl:text-[5.2rem]">
          Navigate Public Transport{" "}
          <span className="bg-[linear-gradient(135deg,#0284c7_0%,#06b6d4_42%,#2563eb_100%)] bg-clip-text text-transparent">
            Like a Local
          </span>
        </h1>
        <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
          Find the right taxi or trotro, where to board, what to say, where to alight, and how much you should pay even when you are lost.
        </p>
      </div>

      <GlassCard className="overflow-hidden p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Pick your location and destination
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Start by choosing where you are, then RouteMate will show where to board and what to say.
            </p>
          </div>
          <span className="chip border-emerald-200 bg-emerald-50 text-emerald-700">
            {displayState.vehicle}
          </span>
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            <MapPin className="h-3.5 w-3.5 text-sky-700" />
            Pick your starting location
          </div>
          <div className="min-w-0 overflow-x-auto pb-1">
            <div className="flex gap-2">
            {userLocationOptions.map((location) => {
              const active = location.id === selectedLocationId;

              return (
                <button
                  key={location.id}
                  type="button"
                  onClick={() => onLocationChange(location.id)}
                  className={`min-w-[240px] shrink-0 rounded-[18px] border px-4 py-3 text-left transition sm:min-w-[260px] ${
                    active
                      ? "border-sky-300 bg-sky-50 shadow-[0_10px_24px_rgba(37,99,235,0.08)]"
                      : "border-slate-200 bg-slate-50 hover:border-cyan-300 hover:bg-cyan-50"
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-950">{location.label}</p>
                  <p className="mt-1 text-xs text-slate-500">{location.hint}</p>
                </button>
              );
            })}
            </div>
          </div>
          <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Starting from
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-950">
              {selectedLocation.label}
            </p>
          </div>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
          className="mt-5 flex flex-col gap-3 lg:flex-row"
        >
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sky-600" />
            <input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search KJTL, Kejetia, Tech Junction..."
              className="h-[64px] w-full rounded-[26px] border border-slate-200 bg-slate-50 pl-12 pr-4 text-base text-slate-950 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
            />
          </label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex">
            <button
              type="submit"
              className="inline-flex h-[64px] items-center justify-center gap-2 rounded-[26px] bg-[linear-gradient(135deg,#0284c7,#2563eb)] px-6 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(37,99,235,0.24)] transition hover:-translate-y-0.5 hover:brightness-105 lg:min-w-[180px]"
            >
              Find Route
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onLostMode}
              className="inline-flex h-[64px] items-center justify-center gap-2 rounded-[26px] border border-sky-200 bg-white px-6 text-sm font-semibold text-slate-900 shadow-[0_14px_34px_rgba(14,165,233,0.08)] transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-[0_18px_38px_rgba(245,158,11,0.14)] lg:min-w-[170px]"
            >
              <LocateFixed className="h-4 w-4 text-amber-500" />
              I'm Lost
            </button>
          </div>
        </form>

        <div className="mt-4 min-w-0 overflow-x-auto pb-1">
          <div className="flex gap-2">
            {quickDestinations.map((destination) => (
              <button
                key={destination}
                type="button"
                onClick={() => onQuickSelect(destination)}
                className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-slate-950"
              >
                {destination}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {highlights.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-[22px] border border-slate-200 bg-slate-50 p-4"
              >
                <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] ${item.color}`}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-900">
                  {item.label === "Fare estimate"
                    ? displayState.fare
                    : item.label === "Taxi/trotro"
                      ? displayState.vehicle
                      : item.label === "Travel time"
                        ? displayState.time
                        : displayState.savings}
                </p>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </motion.div>
  );
}
