import type { UserLocationId } from "./location-context";

export type LatLng = { lat: number; lng: number };

/* ── User starting locations ─────────────────────────────────── */

export const locationCoordinates: Record<UserLocationId, LatLng> = {
  "knust-main-gate": { lat: 6.6745, lng: -1.5710 },
  "brunei-bus-stop": { lat: 6.6738, lng: -1.5722 },
  "engineering-gate": { lat: 6.6718, lng: -1.5647 },
  "ayeduase-gate": { lat: 6.6695, lng: -1.5617 },
  "commercial-area": { lat: 6.6750, lng: -1.5690 },
  "republic-hall-area": { lat: 6.6763, lng: -1.5668 },
  "unity-hall-conti": { lat: 6.6748, lng: -1.5718 },
  "university-hall-katanga": { lat: 6.6730, lng: -1.5738 },
  "tech-junction": { lat: 6.6862, lng: -1.5793 },
  kejetia: { lat: 6.6885, lng: -1.6225 },
  adum: { lat: 6.6928, lng: -1.6167 },
  "asafo-station": { lat: 6.6832, lng: -1.6085 },
};

/* ── Named places (boarding, alighting, landmarks, destinations) */

const places: Record<string, LatLng> = {
  /* Boarding / alighting / destination points */
  "Engineering Gate": { lat: 6.6718, lng: -1.5647 },
  "Brunei Bus Stop": { lat: 6.6738, lng: -1.5722 },
  "Commercial Area": { lat: 6.6750, lng: -1.5690 },

  "Tech Junction Main Station": { lat: 6.6862, lng: -1.5793 },
  "Tech Junction": { lat: 6.6865, lng: -1.5797 },
  "Ayeduase Junction": { lat: 6.6653, lng: -1.5568 },
  "Ayeduase": { lat: 6.6648, lng: -1.5560 },
  "Kejetia Terminal": { lat: 6.6885, lng: -1.6225 },
  "Kejetia": { lat: 6.6890, lng: -1.6230 },
  "Adum PZ": { lat: 6.6928, lng: -1.6167 },
  "Adum": { lat: 6.6932, lng: -1.6170 },
  "Republic Hall Junction": { lat: 6.6763, lng: -1.5668 },
  "Republic Hall": { lat: 6.6766, lng: -1.5665 },

  /* Landmarks */
  "Commercial Area Shell": { lat: 6.6752, lng: -1.5690 },
  "Unity Hall Junction": { lat: 6.6748, lng: -1.5718 },
  "Unity Hall Front": { lat: 6.6750, lng: -1.5716 },
  "Kotei Road Split": { lat: 6.6715, lng: -1.5750 },
  "University Hall Gate": { lat: 6.6730, lng: -1.5738 },
  "Tech Junction Bypass": { lat: 6.6855, lng: -1.5790 },
  "Roman Hill": { lat: 6.6878, lng: -1.6150 },
  "Library Roundabout": { lat: 6.6758, lng: -1.5695 },
  "Asafo Station": { lat: 6.6832, lng: -1.6085 },
  "Ayeduase Gate": { lat: 6.6695, lng: -1.5617 },
  "KNUST Main Gate": { lat: 6.6745, lng: -1.5710 },

};

const KUMASI_CENTER: LatLng = { lat: 6.6800, lng: -1.5900 };

/* ── Road waypoints for realistic route polylines ──────────── */

export type RouteWaypoints = {
  walkToBoarding: LatLng[];     // origin → boarding point
  vehiclePath: LatLng[];        // boarding → alighting
  walkToDestination: LatLng[];  // alighting → destination
  transferPoint?: LatLng;       // optional mid-route transfer
  transferWalk?: LatLng[];      // walk between transfers
  vehiclePath2?: LatLng[];      // second vehicle leg
};

export const routeWaypoints: Record<string, RouteWaypoints> = {

  "tech-junction": {
    walkToBoarding: [
      { lat: 6.6745, lng: -1.5710 },
      { lat: 6.6742, lng: -1.5715 },
      { lat: 6.6738, lng: -1.5722 }, // Brunei Bus Stop
    ],
    vehiclePath: [
      { lat: 6.6738, lng: -1.5722 }, // Brunei Bus Stop
      { lat: 6.6745, lng: -1.5735 },
      { lat: 6.6758, lng: -1.5748 },
      { lat: 6.6775, lng: -1.5755 },
      { lat: 6.6790, lng: -1.5762 },
      { lat: 6.6810, lng: -1.5770 },
      { lat: 6.6830, lng: -1.5778 },
      { lat: 6.6845, lng: -1.5785 },
      { lat: 6.6862, lng: -1.5793 }, // Tech Junction
    ],
    walkToDestination: [
      { lat: 6.6862, lng: -1.5793 },
      { lat: 6.6865, lng: -1.5797 }, // Tech Junction dest
    ],
  },
  ayeduase: {
    walkToBoarding: [
      { lat: 6.6745, lng: -1.5710 },
      { lat: 6.6735, lng: -1.5690 },
      { lat: 6.6725, lng: -1.5668 },
      { lat: 6.6718, lng: -1.5647 }, // Engineering Gate
    ],
    vehiclePath: [
      { lat: 6.6718, lng: -1.5647 },
      { lat: 6.6710, lng: -1.5635 },
      { lat: 6.6700, lng: -1.5618 },
      { lat: 6.6690, lng: -1.5600 },
      { lat: 6.6678, lng: -1.5585 },
      { lat: 6.6665, lng: -1.5575 },
      { lat: 6.6653, lng: -1.5568 }, // Ayeduase Junction
    ],
    walkToDestination: [
      { lat: 6.6653, lng: -1.5568 },
      { lat: 6.6650, lng: -1.5563 },
      { lat: 6.6648, lng: -1.5560 }, // Ayeduase
    ],
  },
  kejetia: {
    walkToBoarding: [
      { lat: 6.6745, lng: -1.5710 },
      { lat: 6.6742, lng: -1.5715 },
      { lat: 6.6738, lng: -1.5722 }, // Brunei Bus Stop
    ],
    vehiclePath: [
      { lat: 6.6738, lng: -1.5722 },
      { lat: 6.6750, lng: -1.5740 },
      { lat: 6.6768, lng: -1.5760 },
      { lat: 6.6790, lng: -1.5780 },
      { lat: 6.6815, lng: -1.5810 },
      { lat: 6.6835, lng: -1.5850 },
      { lat: 6.6850, lng: -1.5900 },
      { lat: 6.6858, lng: -1.5950 },
      { lat: 6.6865, lng: -1.6010 },
      { lat: 6.6870, lng: -1.6070 },
      { lat: 6.6875, lng: -1.6120 },
      { lat: 6.6878, lng: -1.6160 },
      { lat: 6.6882, lng: -1.6195 },
      { lat: 6.6885, lng: -1.6225 }, // Kejetia Terminal
    ],
    walkToDestination: [
      { lat: 6.6885, lng: -1.6225 },
      { lat: 6.6888, lng: -1.6228 },
      { lat: 6.6890, lng: -1.6230 }, // Kejetia
    ],
  },
  adum: {
    walkToBoarding: [
      { lat: 6.6745, lng: -1.5710 },
      { lat: 6.6742, lng: -1.5715 },
      { lat: 6.6738, lng: -1.5722 }, // Brunei Bus Stop
    ],
    vehiclePath: [
      { lat: 6.6738, lng: -1.5722 },
      { lat: 6.6750, lng: -1.5740 },
      { lat: 6.6768, lng: -1.5760 },
      { lat: 6.6790, lng: -1.5780 },
      { lat: 6.6815, lng: -1.5810 },
      { lat: 6.6835, lng: -1.5850 },
      { lat: 6.6850, lng: -1.5900 },
      { lat: 6.6858, lng: -1.5950 },
      { lat: 6.6865, lng: -1.6010 },
      { lat: 6.6870, lng: -1.6070 },
      { lat: 6.6878, lng: -1.6120 },
      { lat: 6.6885, lng: -1.6150 }, // Roman Hill transfer area
    ],
    walkToDestination: [],
    // Adum uses a transfer at Roman Hill for cheapest option
    transferPoint: { lat: 6.6878, lng: -1.6150 }, // Roman Hill
    transferWalk: [
      { lat: 6.6885, lng: -1.6150 },
      { lat: 6.6890, lng: -1.6152 },
      { lat: 6.6895, lng: -1.6155 },
    ],
    vehiclePath2: [
      { lat: 6.6895, lng: -1.6155 },
      { lat: 6.6905, lng: -1.6158 },
      { lat: 6.6915, lng: -1.6162 },
      { lat: 6.6922, lng: -1.6165 },
      { lat: 6.6928, lng: -1.6167 }, // Adum PZ
    ],
  },
  "republic-hall": {
    walkToBoarding: [
      { lat: 6.6745, lng: -1.5710 },
      { lat: 6.6748, lng: -1.5700 },
      { lat: 6.6750, lng: -1.5690 }, // Commercial Area
    ],
    vehiclePath: [
      { lat: 6.6750, lng: -1.5690 },
      { lat: 6.6752, lng: -1.5685 },
      { lat: 6.6755, lng: -1.5678 },
      { lat: 6.6758, lng: -1.5672 },
      { lat: 6.6763, lng: -1.5668 }, // Republic Hall Junction
    ],
    walkToDestination: [
      { lat: 6.6763, lng: -1.5668 },
      { lat: 6.6765, lng: -1.5666 },
      { lat: 6.6766, lng: -1.5665 }, // Republic Hall
    ],
  },
};

/**
 * Get waypoints for a given route ID. Returns the segment arrays or
 * falls back to straight-line points.
 */
export function getRouteWaypoints(routeId: string): RouteWaypoints | null {
  return routeWaypoints[routeId] ?? null;
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

/**
 * Look up GPS coordinates for a named place (boarding point, landmark, etc.).
 * Falls back to fuzzy substring match, then Kumasi center.
 */
export function getPlaceCoordinates(name: string): LatLng {
  if (places[name]) {
    return places[name];
  }

  const normalizedName = normalize(name);
  const key = Object.keys(places).find(
    (k) =>
      normalize(k) === normalizedName ||
      normalize(k).includes(normalizedName) ||
      normalizedName.includes(normalize(k)),
  );

  return key ? places[key] : KUMASI_CENTER;
}

/**
 * Get coordinates for a user location ID.
 */
export function getLocationCoordinates(locationId: UserLocationId): LatLng {
  return locationCoordinates[locationId] ?? KUMASI_CENTER;
}

/* ── GPS auto-detect: find nearest known location ───────── */

function haversineDistance(a: LatLng, b: LatLng): number {
  const R = 6371000; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h =
    sinLat * sinLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * Given real GPS coordinates, find the nearest known location ID.
 * Returns the location ID and distance in meters.
 */
export function findNearestLocation(
  gps: LatLng,
): { locationId: UserLocationId; distance: number; label: string } {
  let nearest: { locationId: UserLocationId; distance: number; label: string } = {
    locationId: "knust-main-gate",
    distance: Infinity,
    label: "KNUST Main Gate",
  };

  const locationLabels: Record<UserLocationId, string> = {
    "knust-main-gate": "KNUST Main Gate",
    "brunei-bus-stop": "Brunei Bus Stop",
    "engineering-gate": "Engineering Gate",
    "ayeduase-gate": "Ayeduase Gate",
    "commercial-area": "Commercial Area",
    "republic-hall-area": "Republic Hall Area",
    "unity-hall-conti": "Unity Hall / Conti",
    "university-hall-katanga": "University Hall / Katanga",
    "tech-junction": "Tech Junction",
    kejetia: "Kejetia",
    adum: "Adum",
    "asafo-station": "Asafo Station",
  };

  for (const [id, coords] of Object.entries(locationCoordinates)) {
    const dist = haversineDistance(gps, coords);
    if (dist < nearest.distance) {
      nearest = {
        locationId: id as UserLocationId,
        distance: dist,
        label: locationLabels[id as UserLocationId] ?? id,
      };
    }
  }

  return nearest;
}

/**
 * Check if GPS coordinates are near a specific place (within threshold meters).
 */
export function isNearPlace(
  gps: LatLng,
  placeName: string,
  thresholdMeters = 200,
): boolean {
  const placeCoords = getPlaceCoordinates(placeName);
  return haversineDistance(gps, placeCoords) <= thresholdMeters;
}

/**
 * Get distance between GPS position and a named place in meters.
 */
export function distanceToPlace(gps: LatLng, placeName: string): number {
  const placeCoords = getPlaceCoordinates(placeName);
  return haversineDistance(gps, placeCoords);
}
