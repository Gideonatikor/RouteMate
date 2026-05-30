"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowRight,
  BusFront,
  CircleDot,
  LocateFixed,
  MapPin,
  Minus,
  Plus,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import type { RouteLocationContext } from "@/lib/location-context";
import type { RouteRecord } from "@/lib/mock-data";
import {
  getRouteDisplayState,
  getSelectedOption,
  type RouteOptionKey,
} from "@/lib/route-presentation";

type MockMapProps = {
  route: RouteRecord;
  locationContext: RouteLocationContext;
  lostMode?: boolean;
  activeLandmarkIndex?: number;
  compact?: boolean;
  selectedOptionKey?: null | RouteOptionKey;
};

const points = {
  current: { x: 12, y: 76, label: "Current location" },
  landmark: { x: 24, y: 60, label: "Nearest landmark" },
  boarding: { x: 39, y: 50, label: "Boarding point" },
  alight: { x: 71, y: 29, label: "Alighting point" },
  destination: { x: 85, y: 18, label: "Destination" },
};

function Marker({
  x,
  y,
  label,
  subtitle,
  color,
  icon,
  active = false,
}: {
  x: number;
  y: number;
  label: string;
  subtitle: string;
  color: "sky" | "amber" | "emerald";
  icon: ReactNode;
  active?: boolean;
}) {
  const classes = {
    sky: "border-sky-200 bg-sky-50 text-sky-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
  };

  return (
    <motion.div
      className="absolute z-20"
      style={{ left: `${x}%`, top: `${y}%` }}
      animate={active ? { scale: [1, 1.06, 1], y: [0, -4, 0] } : { scale: 1, y: 0 }}
      transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY }}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${classes[color]} shadow-[0_12px_24px_rgba(15,23,42,0.08)]`}
      >
        {icon}
      </div>
      <div className="mt-2 min-w-[132px] rounded-[18px] border border-slate-200 bg-white/95 px-3 py-2 text-[11px] shadow-[0_8px_20px_rgba(15,23,42,0.08)]">
        <p className="font-semibold text-slate-900">{label}</p>
        <p className="mt-1 text-slate-500">{subtitle}</p>
      </div>
    </motion.div>
  );
}

export function MockMap({
  route,
  locationContext,
  lostMode = false,
  activeLandmarkIndex = 0,
  compact = false,
  selectedOptionKey = null,
}: MockMapProps) {
  const selectedOption = getSelectedOption(route, selectedOptionKey);
  const displayState = getRouteDisplayState(route, selectedOption, locationContext);
  const [zoomLevel, setZoomLevel] = useState(100);
  const mapScale = zoomLevel / 100;

  return (
    <GlassCard className={compact ? "overflow-hidden p-4" : "overflow-hidden p-5 sm:p-6"}>
      <div
        className={`relative overflow-hidden rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#f8fbff_0%,#f8fafc_100%)] ${
          compact ? "h-[360px]" : "h-[420px] sm:h-[500px]"
        }`}
      >
        <div
          className="absolute inset-0 origin-center transition-transform duration-300"
          style={{ transform: `scale(${mapScale})` }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.09)_1px,transparent_1px)] bg-[size:28px_28px]" />
          <div className="absolute inset-x-0 top-[18%] h-[12%] -rotate-6 bg-[linear-gradient(90deg,rgba(203,213,225,0),rgba(203,213,225,0.65),rgba(203,213,225,0))]" />
          <div className="absolute left-[18%] top-[34%] h-[10%] w-[64%] rotate-[8deg] rounded-full bg-white/80 shadow-[0_6px_20px_rgba(148,163,184,0.15)]" />
          <div className="absolute left-[8%] top-[62%] h-[9%] w-[46%] -rotate-[12deg] rounded-full bg-white/80 shadow-[0_6px_20px_rgba(148,163,184,0.15)]" />
          <div className="absolute left-[9%] top-[8%] h-[22%] w-[18%] rounded-[30px] border border-emerald-100 bg-emerald-50/80" />
          <div className="absolute right-[10%] top-[10%] h-[18%] w-[24%] rounded-[30px] border border-cyan-100 bg-cyan-50/70" />
          <div className="absolute bottom-[12%] left-[22%] h-[18%] w-[30%] rounded-[30px] border border-emerald-100 bg-emerald-50/75" />

          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <defs>
              <marker
                id="vehicle-arrow"
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="3"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M0,0 L6,3 L0,6 Z" fill="#2563EB" />
              </marker>
              <marker
                id="walk-arrow"
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="3"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M0,0 L6,3 L0,6 Z" fill="#F59E0B" />
              </marker>
            </defs>

            <path
              d="M8 64 C 18 58, 31 44, 44 35"
              fill="none"
              stroke="rgba(203,213,225,0.8)"
              strokeWidth="3.8"
              strokeLinecap="round"
            />
            <path
              d="M34 77 C 43 70, 55 58, 70 48"
              fill="none"
              stroke="rgba(203,213,225,0.75)"
              strokeWidth="3.8"
              strokeLinecap="round"
            />
            <path
              d="M12 76 C 16 72, 19 67, 24 60 S 33 55, 39 50"
              fill="none"
              stroke="#F59E0B"
              strokeOpacity="0.95"
              strokeWidth="2.3"
              strokeDasharray="2.4 3.2"
              markerEnd="url(#walk-arrow)"
            />
            <path
              d="M39 50 C 46 46, 56 40, 62 35 S 68 31, 71 29"
              fill="none"
              stroke="#2563EB"
              strokeWidth="3.1"
              strokeLinecap="round"
              markerEnd="url(#vehicle-arrow)"
            />
            <path
              d="M71 29 C 76 24, 80 20, 85 18"
              fill="none"
              stroke="#F59E0B"
              strokeOpacity="0.92"
              strokeWidth="2.3"
              strokeDasharray="2.4 3.2"
              markerEnd="url(#walk-arrow)"
            />

            <motion.path
              d="M39 50 C 46 46, 56 40, 62 35 S 68 31, 71 29"
              fill="none"
              stroke="#06B6D4"
              strokeWidth="6"
              strokeLinecap="round"
              strokeOpacity="0.18"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.8, ease: "easeOut" }}
            />
            <motion.circle
              r="1.5"
              fill="#0284C7"
              initial={{ offsetDistance: "0%" }}
              animate={{ offsetDistance: "100%" }}
              transition={{ duration: 4.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              style={{
                offsetPath: "path('M39 50 C 46 46, 56 40, 62 35 S 68 31, 71 29')",
              }}
            />
          </svg>

          <motion.div
            className="absolute z-20"
            style={{ left: `${points.current.x}%`, top: `${points.current.y}%` }}
            animate={
              lostMode
                ? { scale: [1, 1.16, 1], opacity: [0.75, 1, 0.75] }
                : { scale: 1, opacity: 0.95 }
            }
            transition={{ repeat: lostMode ? Number.POSITIVE_INFINITY : 0, duration: 2.4 }}
          >
            <div className="absolute inset-0 rounded-full bg-sky-300/60 blur-xl" />
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-sky-200 bg-sky-500 text-white shadow-[0_12px_30px_rgba(14,165,233,0.25)]">
              <LocateFixed className="h-5 w-5" />
            </div>
            <div className="mt-2 min-w-[132px] rounded-[18px] border border-slate-200 bg-white/95 px-3 py-2 text-[11px] shadow-[0_8px_20px_rgba(15,23,42,0.08)]">
              <p className="font-semibold text-slate-900">{locationContext.currentPinLabel}</p>
              <p className="mt-1 text-slate-500">Your current area</p>
            </div>
          </motion.div>

          <Marker
            x={points.landmark.x}
            y={points.landmark.y}
            label={locationContext.nearestLandmarkName}
            subtitle="Nearest useful landmark"
            color="amber"
            active={lostMode}
            icon={<MapPin className="h-4 w-4" />}
          />
          <Marker
            x={points.boarding.x}
            y={points.boarding.y}
            label={route.boardingPoint}
            subtitle="Board here"
            color="amber"
            icon={<BusFront className="h-4 w-4" />}
          />
          <Marker
            x={points.alight.x}
            y={points.alight.y}
            label={route.alightingPoint}
            subtitle="Alight here"
            color="amber"
            icon={<ArrowRight className="h-4 w-4" />}
          />
          <Marker
            x={points.destination.x}
            y={points.destination.y}
            label={route.destination}
            subtitle="Final destination"
            color="emerald"
            icon={<CircleDot className="h-4 w-4" />}
          />
        </div>

        <div className="absolute left-4 top-4 z-20 rounded-[20px] border border-slate-200 bg-white/95 px-4 py-3 shadow-[0_12px_24px_rgba(15,23,42,0.06)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Route map
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-900">
            {lostMode ? "Landmark-first recovery route" : "Journey movement preview"}
          </p>
        </div>

        <div className="absolute left-4 top-[92px] z-20 rounded-[20px] border border-slate-200 bg-white/95 p-2 shadow-[0_12px_24px_rgba(15,23,42,0.06)]">
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setZoomLevel((current) => Math.min(current + 10, 130))}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-2 text-slate-700 transition hover:bg-sky-50 hover:text-sky-700"
              aria-label="Zoom in"
            >
              <Plus className="h-4 w-4" />
            </button>
            <div className="rounded-2xl border border-slate-200 bg-white px-2 py-2 text-center text-[11px] font-semibold text-sky-700">
              {zoomLevel}%
            </div>
            <button
              type="button"
              onClick={() => setZoomLevel((current) => Math.max(current - 10, 80))}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-2 text-slate-700 transition hover:bg-sky-50 hover:text-sky-700"
              aria-label="Zoom out"
            >
              <Minus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="absolute right-4 top-4 z-20 w-[190px] rounded-[22px] border border-slate-200 bg-white/96 p-4 shadow-[0_12px_24px_rgba(15,23,42,0.06)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Route snapshot
          </p>
          <div className="mt-3 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Fare</span>
              <span className="font-semibold text-emerald-700">
                {displayState.fare}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Time</span>
              <span className="font-semibold text-slate-900">
                {displayState.time}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Vehicle</span>
              <span className="font-semibold text-sky-700">
                {displayState.vehicle}
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 z-20 max-w-[280px] rounded-[24px] border border-slate-200 bg-white/96 p-4 shadow-[0_12px_24px_rgba(15,23,42,0.06)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Direction cue
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-900">
            {locationContext.isAtDestination
              ? `You are already at ${route.destination}. No route boarding is needed.`
              : `Start from ${locationContext.originLabel}, board at ${route.boardingPoint}, ride to ${route.alightingPoint}, then walk to ${route.destination}.`}
          </p>
          <p className="mt-2 text-xs leading-6 text-slate-600">
            {lostMode
              ? `Walk ${locationContext.walkTime} to ${locationContext.nearestLandmarkName} before joining the main route.`
              : `Use ${locationContext.nearestLandmarkName} as the best landmark if you are not sure where to stand.`}
          </p>
        </div>

        <div className="absolute bottom-4 right-4 z-20 rounded-[24px] border border-slate-200 bg-white/96 px-4 py-3 text-xs text-slate-700 shadow-[0_12px_24px_rgba(15,23,42,0.06)]">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Legend
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-6 rounded-full border-t-2 border-dashed border-amber-400" />
              Dotted line = walking
            </div>
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-6 rounded-full bg-blue-600" />
              Solid line = taxi/trotro route
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Green pin = destination
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              Amber pin = boarding/alighting
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
