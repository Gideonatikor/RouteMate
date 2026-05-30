"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Banknote, ShieldAlert, Sparkles, Star, Users } from "lucide-react";
import { DriverPhraseCard } from "@/components/driver-phrase-card";
import { HeroSearch } from "@/components/hero-search";
import { LostModePanel } from "@/components/lost-mode-panel";
import { MockMap } from "@/components/mock-map";
import { PopularRoutes } from "@/components/popular-routes";
import { RouteOptionCards } from "@/components/route-option-cards";
import { RouteSummaryCard } from "@/components/route-summary-card";
import { RouteTimeline } from "@/components/route-timeline";
import { SafetyTrustCard } from "@/components/safety-trust-card";
import { SectionHeading } from "@/components/section-heading";
import { TransportHubs } from "@/components/transport-hubs";
import { GlassCard } from "@/components/ui/glass-card";
import {
  getRouteLocationContext,
  transportHubs,
  type UserLocationId,
} from "@/lib/location-context";
import {
  driverPhraseExamples,
  reportActions,
  routes,
  type RouteRecord,
} from "@/lib/mock-data";
import { findRouteForOriginAndDestination } from "@/lib/route-matching";
import type { RouteOptionKey } from "@/lib/route-presentation";

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
    setSelectedRoute(route);
    setQuery(route.destination);
    setLostModeActive(false);
    setLostStepIndex(0);
    setSelectedOptionKey(null);
    setRouteNotFound(null);
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

    setSelectedRoute(matchedRoute.route);
    setQuery(matchedRoute.route.destination);
    setRouteNotFound(null);
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
      setRouteNotFound(value);
      setLostModeActive(false);
      setLostStepIndex(0);
      setSelectedOptionKey(null);
      setToastMessage(`Route not found yet from ${locationContext.originLabel}.`);
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

  function handleFeedback(_action: string) {
    setToastMessage("Thanks. Your feedback helps improve this route.");
  }

  return (
    <main className="relative overflow-hidden pb-28 text-slate-950 sm:pb-14">
      <div className="pointer-events-none absolute left-[-180px] top-[120px] h-[320px] w-[320px] rounded-full bg-cyan-300/20 blur-[130px]" />
      <div className="pointer-events-none absolute right-[-120px] top-[520px] h-[300px] w-[300px] rounded-full bg-sky-300/18 blur-[130px]" />
      <div className="pointer-events-none absolute left-[36%] top-[1400px] h-[240px] w-[240px] rounded-full bg-emerald-200/20 blur-[120px]" />

      <section className="section-shell pt-5 sm:pt-7">
        <nav className="flex items-center justify-between rounded-full border border-slate-200 bg-white/85 px-4 py-3 shadow-[0_14px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-200 bg-sky-50 text-sky-700 shadow-[0_14px_28px_rgba(14,165,233,0.12)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display text-lg text-slate-950">RouteMate</div>
              <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                Transport-tech navigation
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-2 text-sm text-slate-600 md:flex">
            <span className="chip border-sky-200 bg-sky-50 text-sky-700">
              Ghana-ready routes
            </span>
            <span className="chip border-amber-200 bg-amber-50 text-amber-700">
              Demo day build
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
            onLocationChange={handleLocationChange}
            onQueryChange={setQuery}
            onSubmit={() => handleSearch()}
            onLostMode={activateLostMode}
            onQuickSelect={handleSearch}
          />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, ease: "easeOut", delay: 0.08 }}
            className="min-w-0 space-y-4"
          >
            <MockMap
              route={selectedRoute}
              locationContext={locationContext}
              lostMode={lostModeActive}
              activeLandmarkIndex={0}
              selectedOptionKey={selectedOptionKey}
            />

            <div className="grid gap-4 md:grid-cols-3">
              <GlassCard className="p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Your location
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-950">
                  {locationContext.originLabel}
                </p>
              </GlassCard>
              <GlassCard className="p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Board at
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-950">
                  {selectedRoute.boardingPoint}
                </p>
              </GlassCard>
              <GlassCard className="p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Savings
                </p>
                <p className="mt-2 text-sm font-semibold text-emerald-700">
                  {selectedRoute.savings}
                </p>
              </GlassCard>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="search" className="section-shell space-y-8 pb-20">
        <SectionHeading
          eyebrow="Route Explanation"
          title="The route should be understandable immediately, not hidden inside decorative cards."
          description="This layout prioritizes the six questions that matter most: where to start, what vehicle to pick, what to tell the driver, where to alight, how much it costs, and how long it takes."
        />

        {routeNotFound ? (
          <GlassCard className="p-8 sm:p-10">
            <div className="max-w-2xl space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                Route search
              </p>
              <h3 className="font-display text-3xl text-slate-950">Route not found yet</h3>
              <p className="text-base leading-8 text-slate-600">
                We do not have a saved RouteMate journey for{" "}
                <span className="font-semibold text-slate-950">{routeNotFound}</span> yet.
                Try KJTL, Kejetia, Ayeduase, Tech Junction, Adum, or Republic Hall.
              </p>
            </div>
          </GlassCard>
        ) : (
          <div className="space-y-6">
            <RouteSummaryCard
              route={selectedRoute}
              locationContext={locationContext}
              selectedOptionKey={selectedOptionKey}
            />

            <GlassCard className="p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-slate-700">
                  Pick your location
                </span>
                <span className="text-sky-700">{"->"}</span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-slate-700">
                  Search destination
                </span>
                <span className="text-sky-700">{"->"}</span>
                <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-sky-700">
                  Show route summary
                </span>
                <span className="text-sky-700">{"->"}</span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-slate-700">
                  Show map movement
                </span>
                <span className="text-sky-700">{"->"}</span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-slate-700">
                  Show step-by-step direction timeline
                </span>
                <span className="text-sky-700">{"->"}</span>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-emerald-700">
                  Show fare, time, savings, safety
                </span>
              </div>
            </GlassCard>

            <MockMap
              route={selectedRoute}
              locationContext={locationContext}
              compact
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

      <section className="section-shell space-y-8 pb-20">
        <SectionHeading
          eyebrow="Landmarks And Hubs"
          title="RouteMate already understands the key transport landmarks around campus and Kumasi."
          description="These hubs anchor the navigation experience, from campus pickup points to city transfer stations and final destinations."
        />
        <TransportHubs hubs={transportHubs} />
      </section>

      <section className="section-shell grid gap-8 pb-20 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-8">
          <SectionHeading
            eyebrow="Phrase Assistant"
            title="Common local phrases people can actually use in the car."
            description="Clear, local phrasing makes the route system practical and culturally grounded."
          />

          <div className="space-y-4">
            {driverPhraseExamples.map((phrase, index) => (
              <motion.div
                key={phrase}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard className="flex items-center gap-4 p-4 transition duration-300 hover:-translate-y-1 hover:border-sky-300 sm:p-5">
                  <div className="rounded-2xl border border-sky-200 bg-sky-50 p-3 text-sky-700">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Local phrase
                    </p>
                    <p className="mt-2 text-base font-semibold text-slate-950 sm:text-lg">
                      "{phrase}"
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <SectionHeading
            eyebrow="Safety And Trust"
            title="Trust signals, fare guardrails, and safer landmark choices."
            description="RouteMate should feel helpful and dependable, especially for students moving at night or for visitors who do not know local transport behavior yet."
          />

          <div className="grid gap-4 md:grid-cols-2">
            <GlassCard className="p-5 transition duration-300 hover:-translate-y-1 hover:border-amber-300">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-amber-700">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-950">Night route warning</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Prefer well-lit landmarks and busy boarding points after 7pm.
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-5 transition duration-300 hover:-translate-y-1 hover:border-emerald-300">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-700">
                  <Star className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-950">Route confidence: High</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Last verified May 2026 with community-confirmed route behavior.
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-5 transition duration-300 hover:-translate-y-1 hover:border-sky-300">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-sky-200 bg-sky-50 p-3 text-sky-700">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-950">Community confirmation</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    37 users confirmed this route pattern and fare range.
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-5 transition duration-300 hover:-translate-y-1 hover:border-slate-300">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-700">
                  <Banknote className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-950">Fare guardrails</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Clear ranges help riders avoid confusion and overcharging.
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>

          <GlassCard className="p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Community feedback
                </p>
                <h3 className="mt-2 font-display text-2xl text-slate-950">
                  Report wrong fare or route changes
                </h3>
              </div>
              <span className="chip border-amber-200 bg-amber-50 text-amber-700">
                Demo feedback flow
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {reportActions.map((action) => (
                <button
                  key={action}
                  type="button"
                  onClick={() => handleFeedback(action)}
                  className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4 text-left text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-50"
                >
                  {action}
                </button>
              ))}
            </div>
          </GlassCard>
        </div>
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
    </main>
  );
}
