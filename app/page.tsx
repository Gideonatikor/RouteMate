"use client";

import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Info, Route, BusFront } from "lucide-react";
import { DarkModeToggle } from "@/components/dark-mode-toggle";
import { FeedbackModal } from "@/components/feedback-modal";
import { ShareRouteButton } from "@/components/share-route-button";
import { DriverPhraseCard } from "@/components/driver-phrase-card";
import { HeroSearch } from "@/components/hero-search";
import { LostModePanel } from "@/components/lost-mode-panel";
import { GoogleMapView } from "@/components/google-map-view";
import { PopularRoutes } from "@/components/popular-routes";
import { RouteOptionCards } from "@/components/route-option-cards";
import { RouteSummaryCard } from "@/components/route-summary-card";
import { RouteTimeline } from "@/components/route-timeline";
import { SafetyTrustCard } from "@/components/safety-trust-card";
import { SectionHeading } from "@/components/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getRouteLocationContext,
  userLocationOptions,
  type UserLocationId,
} from "@/lib/location-context";
import {
  routes,
  type RouteRecord,
} from "@/lib/mock-data";
import { findRouteForOriginAndDestination } from "@/lib/route-matching";
import type { RouteOptionKey } from "@/lib/route-presentation";
import { findNearestLocation, distanceToPlace } from "@/lib/coordinates";
import { kumasiPlaces } from "@/lib/kumasi-places";

export default function HomePage() {
  const [query, setQuery] = useState("Kejetia");
  const [selectedLocationId, setSelectedLocationId] =
    useState<UserLocationId>("knust-main-gate");
  const [selectedRoute, setSelectedRoute] = useState<RouteRecord>(
    routes.find((route) => route.destination === "Kejetia") ?? routes[0],
  );
  const [lostModeActive, setLostModeActive] = useState(false);
  const [lostStepIndex, setLostStepIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedOptionKey, setSelectedOptionKey] = useState<null | RouteOptionKey>(null);
  const [routeNotFound, setRouteNotFound] = useState<string | null>(null);
  const [gpsDetectedLabel, setGpsDetectedLabel] = useState<string | null>(null);
  const [gpsLocating, setGpsLocating] = useState(false);
  const [etaSeconds, setEtaSeconds] = useState<number | null>(null);
  const [arrivalAlert, setArrivalAlert] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isLiveTracking, setIsLiveTracking] = useState(false);
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  
  const [isDemoMode] = useState(
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('demo') === '1'
  );

  // Refs for tracking real-time ETA
  const watchIdRef = useRef<number | null>(null);
  const initialEtaRef = useRef<number | null>(null);
  const initialDistanceRef = useRef<number | null>(null);
  const locationContext = getRouteLocationContext(selectedRoute, selectedLocationId);

  useEffect(() => {
    if (!lostModeActive) {
      return;
    }

    const interval = window.setInterval(() => {
      setLostStepIndex((current) => (current >= 5 ? 5 : current + 1));
    }, 1200);

    return () => window.clearInterval(interval);
  }, [lostModeActive]);

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timeout = window.setTimeout(() => setToastMessage(null), 3000);

    return () => window.clearTimeout(timeout);
  }, [toastMessage]);

  function applyRoute(route: RouteRecord) {
    setIsRouteLoading(true);
    setSelectedRoute(route);
    setQuery(route.destination);
    setLostModeActive(false);
    setLostStepIndex(0);
    setSelectedOptionKey(null);
    setRouteNotFound(null);
    
    setTimeout(() => {
      setIsRouteLoading(false);
    }, 400);
  }

  function handleLocationChange(locationId: UserLocationId) {
    setSelectedLocationId(locationId);
    setLostModeActive(false);
    setLostStepIndex(0);
    setSelectedOptionKey(null);

    const value = query.trim();

    if (!value) {
      return;
    }

    const matchedRoute = findRouteForOriginAndDestination(value, locationId);

    if (!matchedRoute) {
      setRouteNotFound(value);
      setToastMessage("Route not found yet from that starting location.");
      return;
    }

    const nextContext = getRouteLocationContext(matchedRoute.route, locationId);

    setIsRouteLoading(true);
    setSelectedRoute(matchedRoute.route);
    setQuery(matchedRoute.route.destination);
    setRouteNotFound(null);
    
    setTimeout(() => {
      setIsRouteLoading(false);
    }, 400);

    setToastMessage(
      `Route ready from ${nextContext.originLabel} to ${matchedRoute.matchedDestination}.`,
    );
  }

  function handleSearch(submittedQuery?: string) {
    const value = (submittedQuery ?? query).trim();

    if (!value) {
      const matchedRoute = findRouteForOriginAndDestination("", selectedLocationId);

      if (matchedRoute) {
        applyRoute(matchedRoute.route);
        setToastMessage(`Showing the most popular route: ${matchedRoute.route.destination}.`);
      }

      return;
    }

    const matchedRoute = findRouteForOriginAndDestination(value, selectedLocationId);

    if (!matchedRoute) {
      setQuery(value);
      setRouteNotFound(value);
      setLostModeActive(false);
      setLostStepIndex(0);
      setSelectedOptionKey(null);
      return;
    }

    applyRoute(matchedRoute.route);
    setToastMessage(
      `Route ready from ${locationContext.originLabel} to ${matchedRoute.matchedDestination}.`,
    );
  }

  function activateLostMode() {
    setLostModeActive(true);
    setLostStepIndex(0);
    setToastMessage(`Lost Mode is guiding you from ${locationContext.originLabel}.`);
    document
      .getElementById("lost-mode")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleFeedback() {
    setShowFeedback(true);
  }

  /* ── GPS Auto-Detect Location ────────────────────────────── */
  function handleGpsLocate() {
    if (gpsLocating) return;
    setGpsLocating(true);
    setGpsDetectedLabel(null);

    if (!navigator.geolocation) {
      setToastMessage("GPS is not supported on this device.");
      setGpsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const gps = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        const nearest = findNearestLocation(gps);
        setGpsDetectedLabel(nearest.label);
        setGpsLocating(false);
        handleLocationChange(nearest.locationId);

        const distKm = (nearest.distance / 1000).toFixed(1);
        setToastMessage(
          `📍 Detected: ${nearest.label} (${distKm} km away). Location auto-selected.`,
        );
      },
      (err) => {
        setGpsLocating(false);
        setToastMessage(
          err.code === 1
            ? "Location access denied. Please allow GPS."
            : "Could not detect your location. Try again.",
        );
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  /* ── Reverse Route ──────────────────────────────────────── */
  function handleReverseRoute() {
    // The current destination becomes the origin, current origin becomes destination
    const currentDestination = selectedRoute.destination.toLowerCase();
    const currentOrigin = selectedLocationId;

    // Find a location ID that matches the current destination
    const destAsLocation = userLocationOptions.find(
      (loc) =>
        loc.label.toLowerCase().includes(currentDestination) ||
        currentDestination.includes(loc.label.toLowerCase()) ||
        loc.aliases?.some((a) => a.toLowerCase().includes(currentDestination)),
    );

    if (destAsLocation) {
      // Find the origin label to use as the new destination query
      const originLocation = userLocationOptions.find((l) => l.id === currentOrigin);
      const newQuery = originLocation?.label ?? "KNUST";

      setSelectedLocationId(destAsLocation.id);

      const matchedRoute = findRouteForOriginAndDestination(newQuery, destAsLocation.id);
      if (matchedRoute) {
        applyRoute(matchedRoute.route);
        setSelectedLocationId(destAsLocation.id);
        setToastMessage(
          `↩️ Return trip: ${destAsLocation.label} → ${matchedRoute.matchedDestination}`,
        );
      } else {
        setQuery(newQuery);
        setToastMessage(
          `↩️ Reversed to ${destAsLocation.label}. Search for your destination.`,
        );
      }
    } else {
      setToastMessage(
        "Return trip not available yet from this destination. Try selecting a different origin.",
      );
    }
  }

  /* ── Live ETA Countdown & GPS Tracking ──────────────────── */
  function startEta() {
    // 1. Parse initial estimated time from route
    const timeStr = selectedRoute.estimatedTime;
    const match = timeStr.match(/(\d+)/);
    let baseEta = 0;
    if (match) {
      baseEta = parseInt(match[1], 10) * 60;
      setEtaSeconds(baseEta);
      initialEtaRef.current = baseEta;
    }

    // Demo mode: simulate movement so the ETA countdown fires on stage
    if (isDemoMode) {
      setIsLiveTracking(true);
      setToastMessage("📍 Live tracking started! ETA will update as you move.");
      let remaining = 30;
      setEtaSeconds(remaining);
      const interval = window.setInterval(() => {
        remaining -= 1;
        if (remaining <= 0) {
          clearInterval(interval);
          setEtaSeconds(0);
        } else {
          setEtaSeconds(remaining);
        }
      }, 1000);
      return;
    }

    // 2. Start Live GPS Tracking
    if (!navigator.geolocation) {
      setToastMessage("Live ETA relies on GPS, which isn't supported on this device.");
      return;
    }

    setIsLiveTracking(true);
    setToastMessage("📍 Live tracking started! ETA will update as you move.");

    // First get a starting fix to establish initial distance
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const gps = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        const dist = distanceToPlace(gps, selectedRoute.destination);
        initialDistanceRef.current = dist;

        // Now watch for continuous movement
        watchIdRef.current = navigator.geolocation.watchPosition(
          (watchPos) => {
            const liveGps = { lat: watchPos.coords.latitude, lng: watchPos.coords.longitude };
            const liveDist = distanceToPlace(liveGps, selectedRoute.destination);
            
            // If they are within 100 meters, they have arrived!
            if (liveDist <= 100) {
              setEtaSeconds(0);
              return;
            }

            // Proportionally adjust the ETA based on distance covered
            if (initialDistanceRef.current && initialDistanceRef.current > 0 && initialEtaRef.current) {
              const fractionRemaining = liveDist / initialDistanceRef.current;
              // Cap at 1 so ETA doesn't increase if they move backward initially
              const safeFraction = Math.min(1, Math.max(0, fractionRemaining));
              const newEta = Math.floor(initialEtaRef.current * safeFraction);
              setEtaSeconds(newEta);
            }
          },
          (err) => {
            console.error("GPS Watch Error:", err);
          },
          { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
        );
      },
      (err) => {
        console.error("GPS Initial Locate Error:", err);
        setToastMessage("Couldn't get GPS fix for live ETA.");
        setIsLiveTracking(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  // Cleanup watcher when component unmounts or ETA finishes
  useEffect(() => {
    if (etaSeconds === 0) {
      setArrivalAlert(`🎉 You have arrived at ${selectedRoute.destination}!`);
      setIsLiveTracking(false);
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    }
  }, [etaSeconds, selectedRoute.destination]);


  // Cleanup watcher on unmount or route change
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, []);

  // Clear arrival alert after 8 seconds
  useEffect(() => {
    if (!arrivalAlert) return;
    const timeout = window.setTimeout(() => setArrivalAlert(null), 8000);
    return () => window.clearTimeout(timeout);
  }, [arrivalAlert]);

  // Ctrl+Shift+A: emergency escape hatch to fire arrival banner instantly during demo
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') setEtaSeconds(0);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Reset ETA and tracking when route changes
  useEffect(() => {
    setEtaSeconds(null);
    setArrivalAlert(null);
    setIsLiveTracking(false);
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, [selectedRoute.id]);

  function formatEta(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  return (
    <main className="relative overflow-hidden pb-28 text-slate-950 dark:text-slate-100 sm:pb-14">
      <DarkModeToggle />
      <div className="pointer-events-none absolute left-[-180px] top-[120px] h-[320px] w-[320px] rounded-full bg-cyan-300/20 blur-[130px]" />
      <div className="pointer-events-none absolute right-[-120px] top-[520px] h-[300px] w-[300px] rounded-full bg-sky-300/18 blur-[130px]" />
      <div className="pointer-events-none absolute left-[36%] top-[1400px] h-[240px] w-[240px] rounded-full bg-emerald-200/20 blur-[120px]" />

      <section className="section-shell pt-5 sm:pt-7">
        <nav className="flex items-center justify-between rounded-full border border-slate-200 bg-white/85 px-4 py-3 shadow-[0_14px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/85 sm:px-5">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 shrink-0 overflow-hidden rounded-2xl border border-sky-100 shadow-[0_8px_20px_rgba(14,165,233,0.1)] dark:border-sky-950">
              <img
                src="/logo-bus-transparent.png"
                alt="RouteMate Logo"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <div className="font-display text-lg text-slate-950">RouteMate</div>
              <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                Transport-tech navigation
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Link
              href="/about"
              className="chip border-sky-200 bg-sky-50 text-sky-700 transition hover:bg-sky-100 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-300"
            >
              <Info className="h-3.5 w-3.5" />
              About
            </Link>
            <span className="chip border-emerald-200 bg-emerald-50 text-emerald-700 hidden sm:inline-flex">
              Real-time GPS
            </span>
          </div>
        </nav>
      </section>

      <section className="section-shell pb-18 pt-8 sm:pb-20 sm:pt-12">
        <div className="grid gap-8 2xl:min-h-[calc(100vh-132px)] 2xl:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] 2xl:items-center">
          <HeroSearch
            query={query}
            route={selectedRoute}
            locationContext={locationContext}
            selectedLocationId={selectedLocationId}
            selectedOptionKey={selectedOptionKey}
            gpsDetectedLabel={gpsDetectedLabel}
            gpsLocating={gpsLocating}
            onLocationChange={handleLocationChange}
            onQueryChange={setQuery}
            onSubmit={() => handleSearch()}
            onLostMode={activateLostMode}
            onQuickSelect={handleSearch}
            onGpsLocate={handleGpsLocate}
            onReverseRoute={handleReverseRoute}
          />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, ease: "easeOut", delay: 0.08 }}
            className="min-w-0 space-y-4"
          >
            <GoogleMapView
              route={selectedRoute}
              locationContext={locationContext}
              lostMode={lostModeActive}
              selectedOptionKey={selectedOptionKey}
            />


            {/* ETA Countdown & Start Trip */}
            <GlassCard className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      {etaSeconds !== null ? "⏱️ ETA Countdown" : "🚌 Trip Timer"}
                    </p>
                    {isLiveTracking && (
                      <span className="animate-pulse rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        Live
                      </span>
                    )}
                  </div>
                  {isRouteLoading ? (
                    <div className="mt-2 flex items-baseline gap-2">
                      <Skeleton className="h-9 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ) : etaSeconds !== null ? (
                    <p className="mt-2 font-display text-3xl font-bold tabular-nums text-sky-700 dark:text-sky-400">
                      {formatEta(etaSeconds)}
                      <span className="ml-2 text-sm font-normal text-slate-500 dark:text-slate-400">
                        to {selectedRoute.destination}
                      </span>
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      Start the timer when you board. ETA: {selectedRoute.estimatedTime}
                    </p>
                  )}
                </div>
                {etaSeconds !== null ? (
                  <button
                    type="button"
                    onClick={() => {
                      setEtaSeconds(null);
                      setArrivalAlert(null);
                      setIsLiveTracking(false);
                      if (watchIdRef.current !== null) {
                        navigator.geolocation.clearWatch(watchIdRef.current);
                        watchIdRef.current = null;
                      }
                    }}
                    className="rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
                  >
                    Stop Timer
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={startEta}
                    className="rounded-2xl bg-[linear-gradient(135deg,#0284c7,#2563eb)] px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:brightness-105"
                  >
                    🚀 Start Trip
                  </button>
                )}
              </div>
            </GlassCard>

            {/* Share Route */}
            <div className="flex items-center justify-between">
              <ShareRouteButton route={selectedRoute} />
              <Link
                href="/about"
                className="text-xs font-medium text-slate-500 underline decoration-dotted underline-offset-4 transition hover:text-sky-700 dark:text-slate-400"
              >
                How does RouteMate work?
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="search" className="section-shell space-y-8 pb-20">

        {routeNotFound ? (
          <GlassCard className="p-8 sm:p-10">
            <div className="max-w-2xl space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
                🚧 Route coming soon
              </div>
              <h3 className="font-display text-3xl text-slate-950 dark:text-white">
                {routeNotFound}
              </h3>
              {kumasiPlaces.some((p) => p.name.toLowerCase() === routeNotFound.toLowerCase()) ? (
                <>
                  <p className="text-base leading-8 text-slate-600 dark:text-slate-400">
                    <strong>{routeNotFound}</strong> —{" "}
                    {kumasiPlaces.find((p) => p.name.toLowerCase() === routeNotFound.toLowerCase())?.area}.
                    We&apos;re actively adding trotro and taxi route data for this area
                    including fares, boarding points, and driver phrases.
                  </p>
                  <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 dark:border-sky-800 dark:bg-sky-950">
                    <p className="text-sm font-semibold text-sky-800 dark:text-sky-300">💡 Try these routes that work now:</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {routes.map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => applyRoute(r)}
                          className="rounded-full border border-sky-200 bg-white px-3 py-1.5 text-xs font-semibold text-sky-700 transition hover:bg-sky-100 dark:border-sky-700 dark:bg-slate-800 dark:text-sky-300"
                        >
                          {r.destination}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-base leading-8 text-slate-600 dark:text-slate-400">
                  We don&apos;t have a saved RouteMate journey for{" "}
                  <span className="font-semibold text-slate-950 dark:text-white">{routeNotFound}</span> yet.
                  Try one of our available routes below.
                  <span className="mt-3 flex flex-wrap gap-2">
                    {routes.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => applyRoute(r)}
                        className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 transition hover:bg-sky-100 dark:border-sky-700 dark:bg-slate-800 dark:text-sky-300"
                      >
                        {r.destination}
                      </button>
                    ))}
                  </span>
                </p>
              )}
            </div>
          </GlassCard>
        ) : isRouteLoading ? (
          <GlassCard className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-4 w-3/4" />
              <div className="mt-6 flex gap-4">
                <Skeleton className="h-24 flex-1 rounded-xl" />
                <Skeleton className="h-24 flex-1 rounded-xl" />
              </div>
            </div>
          </GlassCard>
        ) : (
          <div className="space-y-6">
            <RouteSummaryCard
              route={selectedRoute}
              locationContext={locationContext}
              selectedOptionKey={selectedOptionKey}
            />


            <RouteTimeline
              route={selectedRoute}
              locationContext={locationContext}
              selectedOptionKey={selectedOptionKey}
            />

            <div className="space-y-5">
              <SectionHeading
                eyebrow="Route Options"
                title="Cheapest, fastest, or balanced depending on urgency."
                description="Select an option to update the fare, time, transport type, and walking distance across the route view."
              />
              <RouteOptionCards
                route={selectedRoute}
                activeKey={selectedOptionKey}
                onSelect={setSelectedOptionKey}
              />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <DriverPhraseCard route={selectedRoute} />
              <SafetyTrustCard route={selectedRoute} />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleFeedback}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <span>⚑</span>
                Report an issue with this route
              </button>
            </div>
          </div>
        )}
      </section>

      <section id="lost-mode" className="section-shell space-y-8 pb-20">
        <SectionHeading
          eyebrow="Lost Mode"
          title="Guide riders back into the route when they are not sure where they are."
          description="Lost Mode uses nearby landmarks, a short walking cue, and a clear boarding instruction to make public transport usable even for first-time riders."
        />
        <LostModePanel
          route={selectedRoute}
          locationContext={locationContext}
          isActive={lostModeActive}
          activeStepIndex={lostStepIndex}
          onActivate={activateLostMode}
        />
      </section>

      <section id="popular" className="section-shell space-y-8 pb-20">
        <SectionHeading
          eyebrow="Popular Routes"
          title="High-frequency routes that make the affordability value obvious."
          description="These common journeys prove the product can work for daily student movement and city travel beyond a single destination."
        />
        <PopularRoutes routes={routes.slice(0, 6)} onSelect={applyRoute} />
      </section>





      <div className="section-shell">
        <GlassCard className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-24px)] max-w-md -translate-x-1/2 px-3 py-3 sm:hidden">
          <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => document.getElementById("search")?.scrollIntoView()}
              className="rounded-2xl bg-[linear-gradient(135deg,#0284c7,#2563eb)] px-3 py-3 text-white transition hover:brightness-105"
            >
              Find Route
            </button>
            <button
              type="button"
              onClick={() => {
                document.getElementById("lost-mode")?.scrollIntoView();
                activateLostMode();
              }}
              className="rounded-2xl border border-amber-300 bg-white px-3 py-3 text-slate-900 transition hover:bg-amber-50"
            >
              I'm Lost
            </button>
            <button
              type="button"
              onClick={() => document.getElementById("popular")?.scrollIntoView()}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 transition hover:bg-sky-50"
            >
              Popular
            </button>
          </div>
        </GlassCard>
      </div>

      <AnimatePresence>
        {arrivalAlert ? (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed left-4 right-4 top-4 z-[60] mx-auto max-w-md rounded-[22px] border-2 border-emerald-300 bg-gradient-to-r from-emerald-50 to-green-50 px-5 py-5 text-center shadow-[0_20px_50px_rgba(34,197,94,0.2)] backdrop-blur-xl sm:left-auto sm:right-4"
          >
            <p className="font-display text-lg font-bold text-emerald-800">{arrivalAlert}</p>
            <p className="mt-1 text-sm text-emerald-600">
              Prepare to alight at {selectedRoute.alightingPoint}
            </p>
            <button
              type="button"
              onClick={() => setArrivalAlert(null)}
              className="mt-3 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Got it
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {toastMessage ? (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            className="fixed right-4 top-4 z-50 max-w-sm rounded-[22px] border border-sky-200 bg-white/95 px-4 py-4 text-sm text-slate-900 shadow-[0_18px_40px_rgba(37,99,235,0.12)] backdrop-blur-xl"
          >
            {toastMessage}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {showFeedback && (
        <FeedbackModal
          route={selectedRoute}
          onClose={() => setShowFeedback(false)}
          onSubmitted={() => setToastMessage("Thanks. Your feedback helps improve this route.")}
        />
      )}
    </main>
  );
}
