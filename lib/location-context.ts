import type { RouteRecord } from "@/lib/mock-data";

export type UserLocationId =
  | "knust-main-gate"
  | "brunei-bus-stop"
  | "engineering-gate"
  | "ayeduase-gate"
  | "commercial-area"
  | "republic-hall-area"
  | "unity-hall-conti"
  | "university-hall-katanga"
  | "tech-junction"
  | "kejetia"
  | "adum"
  | "asafo-station";

export type TransportHubCategory = "origin" | "hub" | "destination" | "transfer";

export type UserLocationOption = {
  id: UserLocationId;
  label: string;
  hint: string;
  aliases?: string[];
};

export type TransportHub = {
  name: string;
  use: string;
  category: TransportHubCategory;
};

export type RouteLocationContext = {
  locationId: UserLocationId;
  originLabel: string;
  originHint: string;
  currentPinLabel: string;
  boardingPoint: string;
  nearestLandmarkName: string;
  nearestLandmarkHint: string;
  walkTime: string;
  walkInstruction: string;
  isAtBoardingPoint: boolean;
  isAtDestination: boolean;
};

export const userLocationOptions: UserLocationOption[] = [
  {
    id: "knust-main-gate",
    label: "KNUST Main Gate",
    hint: "Main entry and exit for campus movement",
  },
  {
    id: "brunei-bus-stop",
    label: "Brunei Bus Stop",
    hint: "Student pickup point for town-bound rides",
  },
  {
    id: "engineering-gate",
    label: "Engineering Gate",
    hint: "Campus-side landmark for Ayeduase routes",
  },
  {
    id: "ayeduase-gate",
    label: "Ayeduase Gate",
    hint: "Useful for Ayeduase, Kotei, and side access",
  },
  {
    id: "commercial-area",
    label: "Commercial Area",
    hint: "Common campus landmark with shops and taxi flow",
  },
  {
    id: "republic-hall-area",
    label: "Republic Hall Area",
    hint: "Campus hall destination and evening landmark",
  },
  {
    id: "unity-hall-conti",
    label: "Unity Hall / Conti Area",
    hint: "Hall-side pickup area with hostels and food kiosks",
  },
  {
    id: "university-hall-katanga",
    label: "University Hall / Katanga Area",
    hint: "Hall-side landmark near the wider campus road",
  },
  {
    id: "tech-junction",
    label: "Tech Junction",
    hint: "Major transport hub for Kumasi routes",
    aliases: ["Tech Junction Main Station"],
  },
  {
    id: "kejetia",
    label: "Kejetia",
    hint: "Kejetia Terminal and nearby market area",
    aliases: ["Kejetia Terminal"],
  },
  {
    id: "adum",
    label: "Adum",
    hint: "City and business destination",
    aliases: ["Adum PZ"],
  },
  {
    id: "asafo-station",
    label: "Asafo Station",
    hint: "Transfer point for several Kumasi routes",
  },
];

export const transportHubs: TransportHub[] = [
  {
    name: "KNUST Main Gate",
    use: "Main entry and exit point for campus routes",
    category: "origin",
  },
  {
    name: "Tech Junction",
    use: "Major transport hub for Kumasi routes",
    category: "hub",
  },
  {
    name: "Brunei Bus Stop",
    use: "Student pickup point",
    category: "origin",
  },
  {
    name: "Engineering Gate",
    use: "Useful campus-side transport landmark",
    category: "origin",
  },
  {
    name: "Ayeduase Gate",
    use: "Route toward Ayeduase and Kotei",
    category: "origin",
  },
  {
    name: "Commercial Area",
    use: "Common campus landmark",
    category: "origin",
  },
  {
    name: "Republic Hall Area",
    use: "Campus hall destination",
    category: "destination",
  },
  {
    name: "Unity Hall / Conti Area",
    use: "Campus hall destination",
    category: "destination",
  },
  {
    name: "University Hall / Katanga Area",
    use: "Campus hall destination",
    category: "destination",
  },
  {
    name: "Kejetia Terminal",
    use: "Major city transport destination",
    category: "destination",
  },
  {
    name: "Adum",
    use: "City and business destination",
    category: "destination",
  },
  {
    name: "Asafo Station",
    use: "Transfer point for several Kumasi routes",
    category: "transfer",
  },
  {
    name: "Airport Roundabout",
    use: "Route toward the Kumasi Airport side",
    category: "hub",
  },
  {
    name: "Ejisu Station / Junction",
    use: "Eastward transport destination",
    category: "destination",
  },
];

const landmarkPreferences: Record<UserLocationId, string[]> = {
  "knust-main-gate": ["Main Gate", "Engineering Gate", "Brunei"],
  "brunei-bus-stop": ["Brunei Bus Stop"],
  "engineering-gate": ["Engineering Gate"],
  "ayeduase-gate": ["Engineering Gate", "Ayeduase"],
  "commercial-area": ["Commercial Area", "Shell"],
  "republic-hall-area": ["Republic Hall", "Republic"],
  "unity-hall-conti": ["Unity Hall", "Unity"],
  "university-hall-katanga": ["University Hall", "Katanga"],
  "tech-junction": ["Tech Junction"],
  kejetia: ["Kejetia"],
  adum: ["Adum"],
  "asafo-station": ["Asafo"],
};

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function getLocationById(locationId: UserLocationId) {
  return userLocationOptions.find((option) => option.id === locationId) ?? userLocationOptions[0];
}

function getWalkTime(route: RouteRecord, locationId: UserLocationId) {
  switch (locationId) {
    case "engineering-gate":
      return route.boardingPoint === "Engineering Gate" ? "0 - 1 min" : "4 min";
    case "brunei-bus-stop":
      return route.boardingPoint === "Brunei Bus Stop" ? "0 - 1 min" : "4 min";
    case "ayeduase-gate":
      return route.boardingPoint === "Engineering Gate" ? "2 min" : "5 min";
    case "commercial-area":
      return route.boardingPoint === "Commercial Area" ? "0 - 1 min" : "5 min";
    case "republic-hall-area":
      return "4 min";
    case "unity-hall-conti":
      return "4 min";
    case "university-hall-katanga":
      return "5 min";
    case "knust-main-gate":
    default:
      return route.nearbyLandmarks[0]?.walkTime ?? "3 min";
  }
}

function getNearestLandmark(route: RouteRecord, locationId: UserLocationId) {
  const preferredKeywords = landmarkPreferences[locationId];

  return (
    route.nearbyLandmarks.find((landmark) =>
      preferredKeywords.some((keyword) =>
        landmark.name.toLowerCase().includes(keyword.toLowerCase()),
      ),
    ) ?? route.nearbyLandmarks[0]
  );
}

function getIsAtDestination(route: RouteRecord, location: UserLocationOption) {
  const routeTargets = [route.destination, route.alightingPoint].map(normalize);
  const locationNames = [location.label, ...(location.aliases ?? [])].map(normalize);

  return locationNames.some((locationName) =>
    routeTargets.some(
      (target) =>
        locationName === target ||
        locationName.includes(target) ||
        target.includes(locationName),
    ),
  );
}

export function getRouteLocationContext(
  route: RouteRecord,
  locationId: UserLocationId,
): RouteLocationContext {
  const location = getLocationById(locationId);
  const nearestLandmark = getNearestLandmark(route, locationId);
  const walkTime = getWalkTime(route, locationId);
  const isAtDestination = getIsAtDestination(route, location);
  const isAtBoardingPoint =
    !isAtDestination &&
    (route.boardingPoint.toLowerCase() === location.label.toLowerCase() ||
      nearestLandmark.name.toLowerCase() === route.boardingPoint.toLowerCase());

  return {
    locationId,
    originLabel: location.label,
    originHint: location.hint,
    currentPinLabel: location.label,
    boardingPoint: route.boardingPoint,
    nearestLandmarkName: nearestLandmark.name,
    nearestLandmarkHint: nearestLandmark.clue,
    walkTime,
    walkInstruction: isAtDestination
      ? `You are already at ${route.destination}. No taxi or trotro is needed for this route.`
      : isAtBoardingPoint
        ? `You are already at ${route.boardingPoint}. Stay near ${nearestLandmark.name} and prepare to board there.`
        : `Start from ${location.label} and walk ${walkTime} to ${route.boardingPoint}. Use ${nearestLandmark.name} as your landmark reference.`,
    isAtBoardingPoint,
    isAtDestination,
  };
}
