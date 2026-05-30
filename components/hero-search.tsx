"use client";

import { useEffect, useRef, useState } from "react";
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
import { routes, type RouteRecord } from "@/lib/mock-data";
import { filterKumasiPlaces } from "@/lib/kumasi-places";
import {
  getRouteDisplayState,
  getSelectedOption,
  type RouteOptionKey,
} from "@/lib/route-presentation";
import { GlassCard } from "@/components/ui/glass-card";
import { Skeleton } from "@/components/ui/skeleton";

type HeroSearchProps = {
  query: string;
  route: RouteRecord;
  locationContext: RouteLocationContext;
  selectedLocationId: UserLocationId;
  selectedOptionKey: null | RouteOptionKey;
  gpsDetectedLabel: string | null;
  gpsLocating: boolean;
  onLocationChange: (value: UserLocationId) => void;
  onQueryChange: (value: string) => void;
  onSubmit: () => void;
  onLostMode: () => void;
  onQuickSelect: (value: string) => void;
  onGpsLocate: () => void;
  onReverseRoute: () => void;
};

const quickDestinations = [
  "Tech Junction",
  "Ayeduase",
  "Kejetia",
  "Adum",
  "Republic Hall",
  "Asafo Station",
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
  gpsDetectedLabel,
  gpsLocating,
  onLocationChange,
  onQueryChange,
  onSubmit,
  onLostMode,
  onQuickSelect,
  onGpsLocate,
  onReverseRoute,
}: HeroSearchProps) {
  const [locationSearch, setLocationSearch] = useState("");
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [destDropdownOpen, setDestDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const destDropdownRef = useRef<HTMLDivElement>(null);

  const selectedLocation =
    userLocationOptions.find((option) => option.id === selectedLocationId) ??
    userLocationOptions[0];
  const displayState = getRouteDisplayState(
    route,
    getSelectedOption(route, selectedOptionKey),
    locationContext,
  );

  // Sync search input when location changes externally (GPS, reverse route)
  useEffect(() => {
    setLocationSearch(selectedLocation.label);
    setLocationDropdownOpen(false);
  }, [selectedLocationId]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLocationDropdownOpen(false);
      }
      if (destDropdownRef.current && !destDropdownRef.current.contains(e.target as Node)) {
        setDestDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Origin suggestions: merge location options + all Kumasi places ──
  const normalizedSearch = locationSearch.trim().toLowerCase();
  const filteredLocations = (() => {
    // Known locations with full routing support
    const knownMatches = normalizedSearch && normalizedSearch !== selectedLocation.label.toLowerCase()
      ? userLocationOptions.filter(
          (loc) =>
            loc.label.toLowerCase().includes(normalizedSearch) ||
            loc.hint.toLowerCase().includes(normalizedSearch) ||
            loc.aliases?.some((a) => a.toLowerCase().includes(normalizedSearch)) ||
            loc.id.includes(normalizedSearch),
        )
      : userLocationOptions;

    // Additional Kumasi places (exclude ones already in knownMatches)
    const knownNames = new Set(userLocationOptions.map((l) => l.label.toLowerCase()));
    const placeMatches = filterKumasiPlaces(normalizedSearch)
      .filter((p) => !knownNames.has(p.name.toLowerCase()))
      .map((p) => ({
        id: "knust-main-gate" as UserLocationId, // fallback — will map to nearest
        label: p.name,
        hint: p.area,
        aliases: p.aliases,
        isGeneric: true,
      }));

    return [...knownMatches, ...placeMatches].slice(0, 12);
  })();

  // ── Destination suggestions: merge routes + all Kumasi places ──
  const routeDestinations = routes.map((r) => ({
    name: r.destination,
    hint: `Board at ${r.boardingPoint} · ${r.fareRange}`,
    vehicle: r.vehicleType,
    hasRoute: true,
  }));

  const normalizedDest = query.trim().toLowerCase();
  const filteredDestinations = (() => {
    const routeNames = new Set(routes.map((r) => r.destination.toLowerCase()));
    const placeDestinations = filterKumasiPlaces(normalizedDest)
      .filter((p) => !routeNames.has(p.name.toLowerCase()))
      .map((p) => ({
        name: p.name,
        hint: p.area,
        vehicle: "Route coming soon",
        hasRoute: false,
      }));

    const all = [...routeDestinations, ...placeDestinations];
    const filtered = normalizedDest
      ? all.filter(
          (d) =>
            d.name.toLowerCase().includes(normalizedDest) ||
            d.hint.toLowerCase().includes(normalizedDest),
        )
      : all;

    return filtered.slice(0, 10);
  })();

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
            Where are you right now?
          </div>

          {/* Searchable location input */}
          <div className="relative" ref={dropdownRef}>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-600" />
                {gpsLocating ? (
                  <div className="flex h-[52px] w-full items-center rounded-[20px] border border-slate-200 bg-slate-50 pl-11 pr-4">
                    <Skeleton className="h-4 w-32" />
                  </div>
                ) : (
                  <input
                    value={locationSearch}
                    onChange={(e) => {
                      setLocationSearch(e.target.value);
                      setLocationDropdownOpen(true);
                    }}
                    onFocus={() => setLocationDropdownOpen(true)}
                    placeholder="Type your location... (e.g. Brunei, Engineering Gate)"
                    className="h-[52px] w-full rounded-[20px] border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-950 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                  />
                )}
              </div>
              <button
                type="button"
                onClick={onGpsLocate}
                title="Auto-detect with GPS"
                className={`flex h-[52px] shrink-0 items-center gap-2 rounded-[20px] border px-4 text-sm font-semibold transition ${
                  gpsLocating
                    ? "border-emerald-300 bg-emerald-50 text-emerald-700 animate-pulse"
                    : gpsDetectedLabel
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                      : "border-sky-200 bg-white text-sky-700 hover:border-sky-300 hover:bg-sky-50"
                }`}
              >
                <LocateFixed className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {gpsLocating ? "Detecting..." : gpsDetectedLabel ? "GPS ✓" : "GPS"}
                </span>
              </button>
            </div>

            {/* Dropdown results */}
            {locationDropdownOpen && (
              <div className="absolute left-0 right-0 top-[56px] z-30 max-h-[280px] overflow-y-auto rounded-[20px] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
                {filteredLocations.length > 0 ? (
                  filteredLocations.map((location) => {
                    const active = location.id === selectedLocationId;
                    return (
                      <button
                        key={location.id}
                        type="button"
                        onClick={() => {
                          onLocationChange(location.id);
                          setLocationSearch(location.label);
                          setLocationDropdownOpen(false);
                        }}
                        className={`flex w-full items-start gap-3 px-4 py-3 text-left transition first:rounded-t-[20px] last:rounded-b-[20px] ${
                          active
                            ? "bg-sky-50 text-sky-900"
                            : "hover:bg-slate-50"
                        }`}
                      >
                        <MapPin className={`mt-0.5 h-4 w-4 shrink-0 ${active ? "text-sky-600" : "text-slate-400"}`} />
                        <div>
                          <p className={`text-sm font-semibold ${active ? "text-sky-900" : "text-slate-950"}`}>
                            {location.label}
                          </p>
                          <p className="text-xs text-slate-500">{location.hint}</p>
                        </div>
                        {active && (
                          <span className="ml-auto mt-0.5 shrink-0 rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-700">
                            Selected
                          </span>
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="px-4 py-4 text-center text-sm text-slate-500">
                    No locations matching &quot;{locationSearch}&quot;
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Current selection display */}
          <div className="rounded-[22px] border border-sky-200 bg-sky-50/70 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
              Starting from
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-950">
              📍 {selectedLocation.label}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">{selectedLocation.hint}</p>
          </div>

          {/* Walking direction to boarding point */}
          {!locationContext.isAtDestination && !locationContext.isAtBoardingPoint && (
            <div className="rounded-[22px] border border-amber-200 bg-amber-50/60 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-700">
                🚶 Walking directions
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900">
                {locationContext.walkInstruction}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                Estimated walk: {locationContext.walkTime}
              </p>
            </div>
          )}
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            <Search className="h-3.5 w-3.5 text-sky-700" />
            Where do you want to go?
          </div>

          <div className="relative" ref={destDropdownRef}>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-600" />
              <input
                value={query}
                onChange={(e) => {
                  onQueryChange(e.target.value);
                  setDestDropdownOpen(true);
                }}
                onFocus={() => setDestDropdownOpen(true)}
                placeholder="Type your destination... (e.g. Kejetia, Adum, Tech Junction)"
                className="h-[52px] w-full rounded-[20px] border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-950 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
              />
            </div>

            {/* Destination suggestions dropdown */}
            {destDropdownOpen && (
              <div className="absolute left-0 right-0 top-[56px] z-30 max-h-[300px] overflow-y-auto rounded-[20px] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
                {filteredDestinations.length > 0 ? (
                  filteredDestinations.map((dest) => {
                    const isSelected = query.toLowerCase() === dest.name.toLowerCase();
                    return (
                      <button
                        key={dest.name}
                        type="button"
                        onClick={() => {
                          onQuickSelect(dest.name);
                          setDestDropdownOpen(false);
                        }}
                        className={`flex w-full items-start gap-3 px-4 py-3 text-left transition first:rounded-t-[20px] last:rounded-b-[20px] ${
                          isSelected
                            ? "bg-sky-50"
                            : "hover:bg-slate-50"
                        }`}
                      >
                        <MapPin className={`mt-0.5 h-4 w-4 shrink-0 ${isSelected ? "text-sky-600" : dest.hasRoute ? "text-emerald-500" : "text-slate-400"}`} />
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-semibold ${isSelected ? "text-sky-900" : "text-slate-950"}`}>
                            {dest.name}
                          </p>
                          <p className="text-xs text-slate-500">{dest.hint}</p>
                        </div>
                        <span className={`mt-0.5 shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                          dest.hasRoute
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-slate-50 text-slate-500"
                        }`}>
                          {dest.vehicle}
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <div className="px-4 py-4 text-center text-sm text-slate-500">
                    No routes matching &quot;{query}&quot;
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onSubmit()}
            className="inline-flex h-[52px] flex-1 items-center justify-center gap-2 rounded-[20px] bg-[linear-gradient(135deg,#0284c7,#2563eb)] px-6 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(37,99,235,0.24)] transition hover:-translate-y-0.5 hover:brightness-105 sm:flex-none sm:min-w-[180px]"
          >
            Find Route
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onReverseRoute}
            className="inline-flex h-[52px] items-center justify-center gap-2 rounded-[20px] border border-emerald-200 bg-white px-5 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50"
          >
            <ArrowRight className="h-4 w-4 rotate-180 text-emerald-500" />
            Return Trip
          </button>
          <button
            type="button"
            onClick={onLostMode}
            className="inline-flex h-[52px] items-center justify-center gap-2 rounded-[20px] border border-sky-200 bg-white px-5 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:border-amber-300"
          >
            <LocateFixed className="h-4 w-4 text-amber-500" />
            I'm Lost
          </button>
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
