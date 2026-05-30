"use client";

import { useEffect, useRef, useState } from "react";
/* Leaflet is loaded dynamically inside useEffect to avoid SSR window errors */
import { GlassCard } from "@/components/ui/glass-card";
import {
  getLocationCoordinates,
  getPlaceCoordinates,
  getRouteWaypoints,
} from "@/lib/coordinates";
import type { RouteLocationContext } from "@/lib/location-context";
import type { RouteRecord } from "@/lib/mock-data";
import {
  getRouteDisplayState,
  getSelectedOption,
  type RouteOptionKey,
} from "@/lib/route-presentation";

/* ── Props ───────────────────────────────────────────────────── */

type GoogleMapViewProps = {
  route: RouteRecord;
  locationContext: RouteLocationContext;
  lostMode?: boolean;
  compact?: boolean;
  selectedOptionKey?: null | RouteOptionKey;
};

/* ── SVG templates ──────────────────────────────────────────── */

function userSvg(pulsing = false) {
  return pulsing
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r="26" fill="rgba(14,165,233,0.10)" stroke="none">
          <animate attributeName="r" values="18;26;18" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="28" cy="28" r="12" fill="rgba(14,165,233,0.22)" stroke="none"/>
        <circle cx="28" cy="28" r="7" fill="#0284c7" stroke="#ffffff" stroke-width="3"/>
      </svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r="20" fill="rgba(14,165,233,0.10)" stroke="none"/>
        <circle cx="22" cy="22" r="12" fill="rgba(14,165,233,0.22)" stroke="none"/>
        <circle cx="22" cy="22" r="7" fill="#0284c7" stroke="#ffffff" stroke-width="3"/>
      </svg>`;
}

function circleSvg(emoji: string, bg: string, border: string, size = 38) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 2}" fill="${bg}" stroke="${border}" stroke-width="2.5"/>
    <text x="${size / 2}" y="${size / 2 + 1}" text-anchor="middle" dominant-baseline="central" font-size="16">${emoji}</text>
  </svg>`;
}

function landmarkSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
    <circle cx="25" cy="25" r="23" fill="rgba(245,158,11,0.12)" stroke="none">
      <animate attributeName="r" values="17;23;17" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="25" cy="25" r="12" fill="rgba(245,158,11,0.25)" stroke="none"/>
    <circle cx="25" cy="25" r="7" fill="#f59e0b" stroke="#ffffff" stroke-width="3"/>
  </svg>`;
}

/* ── Component ──────────────────────────────────────────────── */

export function GoogleMapView({
  route,
  locationContext,
  lostMode = false,
  compact = false,
  selectedOptionKey = null,
}: GoogleMapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);
  const layerGroupRef = useRef<any>(null);
  const liveMarkerRef = useRef<any>(null);
  const liveCircleRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsActive, setGpsActive] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const selectedOption = getSelectedOption(route, selectedOptionKey);
  const displayState = getRouteDisplayState(
    route,
    selectedOption,
    locationContext,
  );

  // Coordinates
  const userCoords = getLocationCoordinates(locationContext.locationId);
  const boardingCoords = getPlaceCoordinates(route.boardingPoint);
  const alightingCoords = getPlaceCoordinates(route.alightingPoint);
  const destinationCoords = getPlaceCoordinates(route.destination);
  const landmarkCoords = getPlaceCoordinates(
    locationContext.nearestLandmarkName,
  );

  /* Create map once — dynamically load Leaflet */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let cancelled = false;

    (async () => {
      const Leaf = await import("leaflet");

      if (cancelled || !containerRef.current) return;

      leafletRef.current = Leaf.default;
      const Lf = Leaf.default;

      const map = Lf.map(containerRef.current, {
        center: [boardingCoords.lat, boardingCoords.lng],
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
      });

      Lf.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        { maxZoom: 19, subdomains: "abcd" },
      ).addTo(map);

      Lf.control.zoom({ position: "bottomleft" }).addTo(map);

      Lf.control
        .attribution({ position: "bottomright", prefix: false })
        .addAttribution(
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OSM</a> &copy; <a href="https://carto.com/" target="_blank" rel="noopener">CARTO</a>',
        )
        .addTo(map);

      const layerGroup = Lf.layerGroup().addTo(map);

      mapRef.current = map;
      layerGroupRef.current = layerGroup;
      setReady(true);
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        layerGroupRef.current = null;
      }
    };
  }, []);

  /* ── Real-time GPS tracking ───────────────────────────────── */
  useEffect(() => {
    if (!gpsActive || !ready || !mapRef.current || !leafletRef.current) return;

    const Lf = leafletRef.current;

    if (!navigator.geolocation) {
      setGpsError("GPS not supported");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setGpsCoords(coords);
        setGpsError(null);

        const map = mapRef.current;
        if (!map) return;

        if (liveMarkerRef.current) {
          liveMarkerRef.current.setLatLng([coords.lat, coords.lng]);
        } else {
          const liveSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52">
            <circle cx="26" cy="26" r="24" fill="rgba(34,197,94,0.10)" stroke="none">
              <animate attributeName="r" values="16;24;16" dur="1.5s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.3;0.9;0.3" dur="1.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="26" cy="26" r="10" fill="rgba(34,197,94,0.25)" stroke="none"/>
            <circle cx="26" cy="26" r="6" fill="#16a34a" stroke="#ffffff" stroke-width="3"/>
          </svg>`;

          liveMarkerRef.current = Lf.marker([coords.lat, coords.lng], {
            icon: Lf.divIcon({
              html: liveSvg,
              className: "",
              iconSize: [52, 52],
              iconAnchor: [26, 26],
            }),
            zIndexOffset: 2000,
          })
            .bindPopup(
              `<div style="font-family:system-ui;">
                <p style="margin:0;font-weight:700;font-size:13px;color:#16a34a;">📡 Live GPS Position</p>
                <p style="margin:4px 0 0;font-size:12px;color:#475569;">Real-time tracking active</p>
              </div>`,
            )
            .addTo(map);
        }

        const accuracy = pos.coords.accuracy;
        if (liveCircleRef.current) {
          liveCircleRef.current.setLatLng([coords.lat, coords.lng]);
          liveCircleRef.current.setRadius(accuracy);
        } else {
          liveCircleRef.current = Lf.circle([coords.lat, coords.lng], {
            radius: accuracy,
            color: "#22c55e",
            fillColor: "#22c55e",
            fillOpacity: 0.08,
            weight: 1,
          }).addTo(map);
        }
      },
      (err) => {
        setGpsError(
          err.code === 1
            ? "Location access denied"
            : err.code === 2
              ? "Location unavailable"
              : "Location timed out",
        );
      },
      {
        enableHighAccuracy: true,
        maximumAge: 3000,
        timeout: 10000,
      },
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      if (liveMarkerRef.current) {
        liveMarkerRef.current.remove();
        liveMarkerRef.current = null;
      }
      if (liveCircleRef.current) {
        liveCircleRef.current.remove();
        liveCircleRef.current = null;
      }
    };
  }, [gpsActive, ready]);

  function handleLocateMe() {
    setGpsActive((prev) => !prev);
    if (gpsActive) {
      setGpsCoords(null);
      setGpsError(null);
    }
  }

  function handleCenterOnGps() {
    if (gpsCoords && mapRef.current) {
      mapRef.current.setView([gpsCoords.lat, gpsCoords.lng], 16, {
        animate: true,
      });
    }
  }

  /* Update markers & routes when props change */
  useEffect(() => {
    if (!ready || !mapRef.current || !layerGroupRef.current || !leafletRef.current) return;

    const map = mapRef.current;
    const Lf = leafletRef.current;
    const group = layerGroupRef.current;
    group.clearLayers();

    const toLL = (c: { lat: number; lng: number }): L.LatLngExpression => [
      c.lat,
      c.lng,
    ];

    const makeDivIcon = (html: string, size: number) =>
      Lf.divIcon({ html, className: "", iconSize: [size, size], iconAnchor: [size / 2, size / 2], popupAnchor: [0, -size / 2] });

    /* ── Route polylines (use real road waypoints when available) ── */
    const waypoints = getRouteWaypoints(route.id);

    if (waypoints) {
      // Walking: user → boarding (dashed amber)
      if (waypoints.walkToBoarding.length > 1) {
        Lf.polyline(waypoints.walkToBoarding.map(toLL), {
          color: "#f59e0b", weight: 4, opacity: 0.85,
          dashArray: "8 10", lineCap: "round",
        }).addTo(group);
      }

      // Vehicle: boarding → alighting (solid blue)
      if (waypoints.vehiclePath.length > 1) {
        Lf.polyline(waypoints.vehiclePath.map(toLL), {
          color: "#2563eb", weight: 5, opacity: 0.9,
          lineCap: "round",
        }).addTo(group);
      }

      // Transfer walk (dashed red — for multi-leg routes)
      if (waypoints.transferWalk && waypoints.transferWalk.length > 1) {
        Lf.polyline(waypoints.transferWalk.map(toLL), {
          color: "#ef4444", weight: 3, opacity: 0.8,
          dashArray: "6 8", lineCap: "round",
        }).addTo(group);
      }

      // Second vehicle leg (solid purple — for multi-leg routes)
      if (waypoints.vehiclePath2 && waypoints.vehiclePath2.length > 1) {
        Lf.polyline(waypoints.vehiclePath2.map(toLL), {
          color: "#7c3aed", weight: 5, opacity: 0.9,
          lineCap: "round",
        }).addTo(group);
      }

      // Walking: alighting → destination (dashed amber)
      if (waypoints.walkToDestination.length > 1) {
        Lf.polyline(waypoints.walkToDestination.map(toLL), {
          color: "#f59e0b", weight: 4, opacity: 0.85,
          dashArray: "8 10", lineCap: "round",
        }).addTo(group);
      }

      // Transfer point marker
      if (waypoints.transferPoint) {
        Lf.marker(toLL(waypoints.transferPoint), {
          icon: makeDivIcon(circleSvg("🔄", "#fef2f2", "#ef4444"), 38),
          zIndexOffset: 650,
        })
          .bindPopup(
            `<div style="font-family:system-ui;min-width:160px;">
              <p style="margin:0;font-weight:700;font-size:13px;color:#0f172a;">🔄 Transfer Point</p>
              <p style="margin:4px 0 0;font-size:12px;color:#475569;">Switch vehicles here. Look for the next loading area.</p>
            </div>`,
          )
          .addTo(group);
      }
    } else {
      // Fallback: straight lines
      Lf.polyline([toLL(userCoords), toLL(boardingCoords)], {
        color: "#f59e0b", weight: 4, opacity: 0.85,
        dashArray: "8 10", lineCap: "round",
      }).addTo(group);
      Lf.polyline([toLL(boardingCoords), toLL(alightingCoords)], {
        color: "#2563eb", weight: 5, opacity: 0.9,
        lineCap: "round",
      }).addTo(group);
      Lf.polyline([toLL(alightingCoords), toLL(destinationCoords)], {
        color: "#f59e0b", weight: 4, opacity: 0.85,
        dashArray: "8 10", lineCap: "round",
      }).addTo(group);
    }

    /* ── Lost mode: user → landmark (dashed red) ────────── */
    if (lostMode) {
      Lf.polyline([toLL(userCoords), toLL(landmarkCoords)], {
        color: "#ef4444",
        weight: 4,
        opacity: 0.8,
        dashArray: "6 8",
        lineCap: "round",
      }).addTo(group);

      Lf.marker(toLL(landmarkCoords), { icon: makeDivIcon(landmarkSvg(), 50), zIndexOffset: 800 })
        .bindPopup(
          `<div style="font-family:system-ui;min-width:180px;">
            <p style="margin:0 0 4px;font-weight:700;font-size:13px;color:#0f172a;">📍 ${locationContext.nearestLandmarkName}</p>
            <p style="margin:0;font-size:12px;color:#475569;line-height:1.5;">Walk ${locationContext.walkTime} to reach this landmark.<br/>${locationContext.nearestLandmarkHint}</p>
          </div>`,
        )
        .addTo(group);
    }

    /* ── Markers ────────────────────────────────────────── */

    const userSize = lostMode ? 56 : 44;
    Lf.marker(toLL(userCoords), {
      icon: makeDivIcon(userSvg(lostMode), userSize),
      zIndexOffset: 1000,
    })
      .bindPopup(
        `<div style="font-family:system-ui;min-width:160px;">
          <p style="margin:0 0 4px;font-weight:700;font-size:13px;color:#0f172a;">📍 ${locationContext.originLabel}</p>
          <p style="margin:0;font-size:12px;color:#475569;line-height:1.5;">Your current area</p>
        </div>`,
      )
      .addTo(group);

    Lf.marker(toLL(boardingCoords), {
      icon: makeDivIcon(circleSvg("🚐", "#fef3c7", "#f59e0b"), 38),
      zIndexOffset: 600,
    })
      .bindPopup(
        `<div style="font-family:system-ui;min-width:180px;">
          <p style="margin:0 0 4px;font-weight:700;font-size:13px;color:#0f172a;">🚐 ${route.boardingPoint}</p>
          <p style="margin:0;font-size:12px;color:#475569;line-height:1.5;">Board ${displayState.vehicle} here<br/>Fare: ${displayState.fare}</p>
        </div>`,
      )
      .addTo(group);

    Lf.marker(toLL(alightingCoords), {
      icon: makeDivIcon(circleSvg("🚏", "#fef3c7", "#f59e0b"), 38),
      zIndexOffset: 500,
    })
      .bindPopup(
        `<div style="font-family:system-ui;min-width:180px;">
          <p style="margin:0 0 4px;font-weight:700;font-size:13px;color:#0f172a;">🚏 ${route.alightingPoint}</p>
          <p style="margin:0;font-size:12px;color:#475569;line-height:1.5;">Alight here, then walk to ${route.destination}</p>
        </div>`,
      )
      .addTo(group);

    Lf.marker(toLL(destinationCoords), {
      icon: makeDivIcon(circleSvg("📌", "#d1fae5", "#22c55e", 42), 42),
      zIndexOffset: 700,
    })
      .bindPopup(
        `<div style="font-family:system-ui;min-width:180px;">
          <p style="margin:0 0 4px;font-weight:700;font-size:13px;color:#0f172a;">📌 ${route.destination}</p>
          <p style="margin:0;font-size:12px;color:#475569;line-height:1.5;">Final destination<br/>${route.routeTone}</p>
        </div>`,
      )
      .addTo(group);

    /* ── Fit bounds ─────────────────────────────────────── */
    const bounds = Lf.latLngBounds([
      toLL(userCoords),
      toLL(boardingCoords),
      toLL(alightingCoords),
      toLL(destinationCoords),
    ]);
    if (lostMode) {
      bounds.extend(toLL(landmarkCoords));
    }
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
  }, [
    ready,
    route.id,
    route.boardingPoint,
    route.alightingPoint,
    route.destination,
    locationContext.locationId,
    locationContext.nearestLandmarkName,
    selectedOptionKey,
    lostMode,
  ]);

  /* ── Render ───────────────────────────────────────────────── */

  return (
    <GlassCard
      className={compact ? "overflow-hidden p-4" : "overflow-hidden p-5 sm:p-6"}
    >
      <div
        className={`relative overflow-hidden rounded-[20px] sm:rounded-[28px] border border-slate-200 ${
          compact ? "h-[300px] sm:h-[360px]" : "h-[320px] sm:h-[420px] md:h-[500px]"
        }`}
      >
        {/* Map container */}
        <div ref={containerRef} className="absolute inset-0 z-0" />

        {/* Route label overlay (top-left) */}
        <div className="absolute left-2 top-2 z-[1000] max-w-[55%] rounded-2xl sm:rounded-[20px] border border-slate-200 bg-white/95 px-3 py-2 sm:px-4 sm:py-3 shadow-[0_12px_24px_rgba(15,23,42,0.06)] backdrop-blur-md sm:left-4 sm:top-4">
          <p className="hidden text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 sm:block">
            Live route map
          </p>
          <p className="text-xs font-semibold text-slate-900 sm:mt-2 sm:text-sm">
            {lostMode
              ? "Recovery route"
              : `${locationContext.originLabel} → ${route.destination}`}
          </p>
        </div>

        {/* Mobile-only compact route badge (top-right) */}
        <div className="absolute right-2 top-2 z-[1000] flex flex-col gap-1 sm:hidden">
          <div className="rounded-xl border border-emerald-200 bg-white/95 px-2.5 py-1.5 text-center shadow-md backdrop-blur-md">
            <p className="text-[10px] font-semibold text-emerald-700">{displayState.fare}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white/95 px-2.5 py-1.5 text-center shadow-md backdrop-blur-md">
            <p className="text-[10px] font-semibold text-slate-700">{displayState.time}</p>
          </div>
        </div>

        {/* Route snapshot overlay (top-right) — hidden on small screens, shown in cards below */}
        <div className="absolute right-2 top-2 z-[1000] hidden w-[170px] rounded-2xl border border-slate-200 bg-white/96 p-3 shadow-[0_12px_24px_rgba(15,23,42,0.06)] backdrop-blur-md sm:right-4 sm:top-4 sm:block sm:w-[190px] sm:rounded-[22px] sm:p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Route snapshot
          </p>
          <div className="mt-2 space-y-2 text-xs sm:mt-3 sm:space-y-3 sm:text-sm">
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

        {/* Direction cue (bottom-left) */}
        <div className="absolute bottom-2 left-2 z-[1000] max-w-[65%] rounded-2xl sm:rounded-[24px] border border-slate-200 bg-white/96 p-2.5 sm:p-4 shadow-[0_12px_24px_rgba(15,23,42,0.06)] backdrop-blur-md sm:bottom-4 sm:left-4 sm:max-w-[280px]">
          <p className="hidden text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 sm:block">
            Direction cue
          </p>
          <p className="text-[11px] font-semibold leading-relaxed text-slate-900 sm:mt-2 sm:text-sm">
            {locationContext.isAtDestination
              ? `You are at ${route.destination}.`
              : `Board at ${route.boardingPoint}, ride to ${route.alightingPoint}.`}
          </p>
        </div>

        {/* GPS locate-me button */}
        <div className="absolute right-4 z-[1000] flex flex-col gap-2" style={{ top: "50%", transform: "translateY(-50%)" }}>
          <button
            onClick={handleLocateMe}
            className={`flex h-11 w-11 items-center justify-center rounded-full border shadow-lg backdrop-blur-md transition-all hover:scale-110 ${
              gpsActive
                ? "border-emerald-300 bg-emerald-50/95 text-emerald-700"
                : "border-slate-200 bg-white/95 text-slate-600 hover:text-sky-600"
            }`}
            title={gpsActive ? "Turn off GPS" : "Track my location"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
            </svg>
          </button>
          {gpsActive && gpsCoords && (
            <button
              onClick={handleCenterOnGps}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-600 shadow-lg backdrop-blur-md transition-all hover:scale-110 hover:text-sky-600"
              title="Center on my location"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
              </svg>
            </button>
          )}
          {gpsError && (
            <div className="rounded-full border border-red-200 bg-red-50/95 px-2 py-1 text-[10px] font-medium text-red-600 shadow-md">
              {gpsError}
            </div>
          )}
        </div>

        {/* Legend (bottom-right) — hidden on mobile */}
        <div className="absolute bottom-2 right-2 z-[1000] hidden rounded-2xl border border-slate-200 bg-white/96 px-3 py-2 text-[11px] text-slate-700 shadow-[0_12px_24px_rgba(15,23,42,0.06)] backdrop-blur-md sm:bottom-4 sm:right-4 sm:block sm:rounded-[24px] sm:px-4 sm:py-3 sm:text-xs">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Legend
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-6 rounded-full border-t-2 border-dashed border-amber-400" />
              Walking
            </div>
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-6 rounded-full bg-blue-600" />
              Vehicle
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Destination
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              Board / Alight
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
