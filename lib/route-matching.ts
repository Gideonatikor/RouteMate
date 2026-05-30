import type { NearbyLandmark, RouteRecord } from "@/lib/mock-data";
import { routes } from "@/lib/mock-data";
import { userLocationOptions, type UserLocationId } from "@/lib/location-context";

type RouteOverride = Partial<
  Pick<
    RouteRecord,
    | "from"
    | "boardingPoint"
    | "alightingPoint"
    | "vehicleType"
    | "fareRange"
    | "estimatedTime"
    | "uberEstimate"
    | "savings"
    | "driverPhrase"
    | "safetyNote"
    | "routeTone"
    | "steps"
  >
> & {
  nearbyLandmark?: NearbyLandmark;
};

type MatchedRoute = {
  route: RouteRecord;
  matchedDestination: string;
};

const campusOriginIds: UserLocationId[] = [
  "knust-main-gate",
  "brunei-bus-stop",
  "engineering-gate",
  "ayeduase-gate",
  "commercial-area",
  "republic-hall-area",
  "unity-hall-conti",
  "university-hall-katanga",
];

const originRouteOverrides: Partial<Record<UserLocationId, Partial<Record<string, RouteOverride>>>> = {
  "brunei-bus-stop": {
    kejetia: {
      from: "Brunei Bus Stop",
      boardingPoint: "Brunei Bus Stop",
      nearbyLandmark: {
        name: "Brunei Bus Stop",
        walkTime: "0 - 1 min",
        clue: "Campus shuttle sign and long queue rail",
        transportHint: "Take a Kejetia trotro from the main lane.",
        phrase: "Mate, Kejetia.",
        exitPoint: "Kejetia Terminal",
      },
    },
    "tech-junction": {
      from: "Brunei Bus Stop",
      boardingPoint: "Brunei Bus Stop",
      nearbyLandmark: {
        name: "Brunei Bus Stop",
        walkTime: "0 - 1 min",
        clue: "Yellow curb paint and campus shuttle sign",
        transportHint: "Board a Kejetia-bound trotro and mention Tech Junction.",
        phrase: "Mate, Tech Junction main station side.",
        exitPoint: "Tech Junction Main Station",
      },
    },
    adum: {
      from: "Brunei Bus Stop",
      boardingPoint: "Brunei Bus Stop",
      nearbyLandmark: {
        name: "Brunei Bus Stop",
        walkTime: "0 - 1 min",
        clue: "Queue shelter and bus sign",
        transportHint: "Wait for direct Adum cars or take Kejetia and switch at Roman Hill.",
        phrase: "Adum PZ, please.",
        exitPoint: "Adum PZ",
      },
    },
  },
  "engineering-gate": {
    kjtl: {
      from: "Engineering Gate",
      boardingPoint: "Engineering Gate",
      nearbyLandmark: {
        name: "Engineering Gate",
        walkTime: "0 - 1 min",
        clue: "Blue pedestrian bridge and campus security booth",
        transportHint: "Pick an Ayeduase taxi from the curb facing town.",
        phrase: "Boss, KJTL side.",
        exitPoint: "KJTL Junction",
      },
    },
    ayeduase: {
      from: "Engineering Gate",
      boardingPoint: "Engineering Gate",
      nearbyLandmark: {
        name: "Engineering Gate",
        walkTime: "0 - 1 min",
        clue: "Security booth and bridge shadow",
        transportHint: "Take any taxi calling Ayeduase.",
        phrase: "Ayeduase junction, please.",
        exitPoint: "Ayeduase Junction",
      },
    },
  },
  "ayeduase-gate": {
    kjtl: {
      from: "Ayeduase Gate",
      boardingPoint: "Ayeduase Gate",
      vehicleType: "Ayeduase / KJTL Taxi",
      fareRange: "GH₵3.00 - GH₵4.50",
      estimatedTime: "10 - 14 min",
      savings: "Save about GH₵18",
      driverPhrase: "Boss, KJTL junction side.",
      steps: [
        "Stand at Ayeduase Gate where taxis slow down near the campus edge.",
        "Pick a taxi heading toward KJTL or Ayeduase side.",
        "Tell the driver you will alight at KJTL Junction.",
        "Alight at KJTL Junction.",
        "Walk 2 minutes to KJTL.",
      ],
      nearbyLandmark: {
        name: "Ayeduase Gate",
        walkTime: "0 - 1 min",
        clue: "Campus exit toward Ayeduase and Kotei side",
        transportHint: "Use taxis calling Ayeduase, Kotei, or KJTL side.",
        phrase: "Boss, KJTL junction side.",
        exitPoint: "KJTL Junction",
      },
    },
    ayeduase: {
      from: "Ayeduase Gate",
      boardingPoint: "Ayeduase Gate",
      vehicleType: "Ayeduase Taxi",
      fareRange: "GH₵2.50 - GH₵3.50",
      estimatedTime: "6 - 10 min",
      savings: "Save about GH₵14",
      driverPhrase: "Ayeduase junction, please.",
      nearbyLandmark: {
        name: "Ayeduase Gate",
        walkTime: "0 - 1 min",
        clue: "Campus exit toward Ayeduase and Kotei side",
        transportHint: "Take any taxi calling Ayeduase.",
        phrase: "Ayeduase junction, please.",
        exitPoint: "Ayeduase Junction",
      },
    },
  },
  "commercial-area": {
    "republic-hall": {
      from: "Commercial Area",
      boardingPoint: "Commercial Area",
      nearbyLandmark: {
        name: "Commercial Area Shell",
        walkTime: "0 - 1 min",
        clue: "ATM and fuel station glow",
        transportHint: "Board campus shuttles or shared taxis from the edge of the area.",
        phrase: "Republic Hall junction, please.",
        exitPoint: "Republic Hall Junction",
      },
    },
  },
  "tech-junction": {
    kejetia: {
      from: "Tech Junction",
      boardingPoint: "Tech Junction Main Station",
      vehicleType: "Kejetia Trotro",
      fareRange: "GH₵3.50 - GH₵5.00",
      estimatedTime: "18 - 24 min",
      uberEstimate: "GH₵22 - GH₵32",
      savings: "Save about GH₵22",
      driverPhrase: "Mate, Kejetia.",
      safetyNote: "Use the main loading area and avoid roadside cars that are not in the queue.",
      steps: [
        "Walk to Tech Junction Main Station.",
        "Board a Kejetia-bound trotro from the main loading lane.",
        "Tell the mate you are going to Kejetia.",
        "Alight at Kejetia Terminal.",
        "Walk through the terminal side to your exact destination.",
      ],
      nearbyLandmark: {
        name: "Tech Junction Main Station",
        walkTime: "0 - 1 min",
        clue: "Busy traffic-light area with main station frontage",
        transportHint: "Board a Kejetia-bound trotro from the station lane.",
        phrase: "Mate, Kejetia.",
        exitPoint: "Kejetia Terminal",
      },
    },
    adum: {
      from: "Tech Junction",
      boardingPoint: "Tech Junction Main Station",
      vehicleType: "Adum / Kejetia Trotro",
      fareRange: "GH₵4.50 - GH₵6.00",
      estimatedTime: "22 - 30 min",
      uberEstimate: "GH₵26 - GH₵38",
      savings: "Save about GH₵26",
      driverPhrase: "Adum PZ, please.",
      nearbyLandmark: {
        name: "Tech Junction Main Station",
        walkTime: "0 - 1 min",
        clue: "Main station frontage at the junction",
        transportHint: "Take an Adum car if available, or Kejetia then switch near Roman Hill.",
        phrase: "Adum PZ, please.",
        exitPoint: "Adum PZ",
      },
    },
  },
  kejetia: {
    adum: {
      from: "Kejetia",
      boardingPoint: "Kejetia Terminal",
      vehicleType: "Inner-city Taxi / Walk",
      fareRange: "GH₵2.00 - GH₵4.00",
      estimatedTime: "8 - 14 min",
      uberEstimate: "GH₵12 - GH₵18",
      savings: "Save about GH₵10",
      driverPhrase: "Adum PZ, please.",
      safetyNote: "Use the busy terminal exits and keep your bag forward in crowded areas.",
      steps: [
        "Start from Kejetia Terminal.",
        "Use the Adum/PZ side taxi lane or walk if traffic is heavy.",
        "Tell the driver you are going to Adum PZ.",
        "Alight at Adum PZ.",
        "Walk 2 minutes to your exact shop, bank, or meeting point.",
      ],
      nearbyLandmark: {
        name: "Kejetia Terminal",
        walkTime: "0 - 1 min",
        clue: "Large terminal canopy and bus bays",
        transportHint: "Use the Adum/PZ side taxi lane or walk if close.",
        phrase: "Adum PZ, please.",
        exitPoint: "Adum PZ",
      },
    },
  },
  adum: {
    kejetia: {
      from: "Adum",
      boardingPoint: "Adum PZ",
      vehicleType: "Inner-city Taxi / Walk",
      fareRange: "GH₵2.00 - GH₵4.00",
      estimatedTime: "8 - 14 min",
      uberEstimate: "GH₵12 - GH₵18",
      savings: "Save about GH₵10",
      driverPhrase: "Kejetia Terminal, please.",
      safetyNote: "Stay on the busier PZ side and avoid opening your phone in crowded traffic.",
      steps: [
        "Start from Adum PZ.",
        "Pick a short inner-city taxi toward Kejetia or walk if traffic is heavy.",
        "Tell the driver you are going to Kejetia Terminal.",
        "Alight at Kejetia Terminal.",
        "Walk through the terminal side to your exact destination.",
      ],
      nearbyLandmark: {
        name: "Adum PZ",
        walkTime: "0 - 1 min",
        clue: "Busy business district with banks and shops",
        transportHint: "Pick a short taxi toward Kejetia Terminal.",
        phrase: "Kejetia Terminal, please.",
        exitPoint: "Kejetia Terminal",
      },
    },
  },
  "asafo-station": {
    kejetia: {
      from: "Asafo Station",
      boardingPoint: "Asafo Station",
      vehicleType: "Kejetia Taxi / Trotro",
      fareRange: "GH₵3.00 - GH₵5.00",
      estimatedTime: "12 - 20 min",
      uberEstimate: "GH₵18 - GH₵28",
      savings: "Save about GH₵18",
      driverPhrase: "Kejetia Terminal, please.",
      nearbyLandmark: {
        name: "Asafo Station",
        walkTime: "0 - 1 min",
        clue: "Major transfer station with several loading lanes",
        transportHint: "Join the Kejetia lane or ask for Kejetia Terminal.",
        phrase: "Kejetia Terminal, please.",
        exitPoint: "Kejetia Terminal",
      },
    },
    adum: {
      from: "Asafo Station",
      boardingPoint: "Asafo Station",
      vehicleType: "Adum Taxi / Trotro",
      fareRange: "GH₵3.00 - GH₵5.00",
      estimatedTime: "14 - 22 min",
      uberEstimate: "GH₵18 - GH₵30",
      savings: "Save about GH₵20",
      driverPhrase: "Adum PZ, please.",
      nearbyLandmark: {
        name: "Asafo Station",
        walkTime: "0 - 1 min",
        clue: "Major transfer station with several loading lanes",
        transportHint: "Join the Adum lane or use a short transfer through Kejetia.",
        phrase: "Adum PZ, please.",
        exitPoint: "Adum PZ",
      },
    },
  },
};

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function destinationMatches(route: RouteRecord, query: string) {
  const normalizedQuery = normalize(query);

  return (
    normalize(route.destination).includes(normalizedQuery) ||
    route.aliases.some((alias) => normalize(alias).includes(normalizedQuery))
  );
}

function applyOverride(route: RouteRecord, override?: RouteOverride): RouteRecord {
  if (!override) {
    return route;
  }

  const { nearbyLandmark, ...routeFields } = override;
  const nearbyLandmarks = nearbyLandmark
    ? [
        nearbyLandmark,
        ...route.nearbyLandmarks.filter(
          (landmark) => normalize(landmark.name) !== normalize(nearbyLandmark.name),
        ),
      ]
    : route.nearbyLandmarks;

  const updatedRoute = {
    ...route,
    ...routeFields,
    nearbyLandmarks,
  };

  if (!override.fareRange && !override.estimatedTime && !override.vehicleType) {
    return updatedRoute;
  }

  return {
    ...updatedRoute,
    options: {
      cheapest: {
        ...updatedRoute.options.cheapest,
        fare: override.fareRange ?? updatedRoute.options.cheapest.fare,
        time: override.estimatedTime ?? updatedRoute.options.cheapest.time,
        transportType: override.vehicleType ?? updatedRoute.options.cheapest.transportType,
      },
      fastest: {
        ...updatedRoute.options.fastest,
        fare: override.fareRange ?? updatedRoute.options.fastest.fare,
        time: override.estimatedTime ?? updatedRoute.options.fastest.time,
        transportType: override.vehicleType ?? updatedRoute.options.fastest.transportType,
      },
      balanced: {
        ...updatedRoute.options.balanced,
        fare: override.fareRange ?? updatedRoute.options.balanced.fare,
        time: override.estimatedTime ?? updatedRoute.options.balanced.time,
        transportType: override.vehicleType ?? updatedRoute.options.balanced.transportType,
      },
    },
  };
}

function isCampusOrigin(locationId: UserLocationId) {
  return campusOriginIds.includes(locationId);
}

function originMatchesDestination(route: RouteRecord, locationId: UserLocationId) {
  const location = userLocationOptions.find((option) => option.id === locationId);

  if (!location) {
    return false;
  }

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

export function findRouteForOriginAndDestination(
  query: string,
  locationId: UserLocationId,
): MatchedRoute | null {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return {
      route: routes[0],
      matchedDestination: routes[0].destination,
    };
  }

  const baseRoute = routes.find((route) => destinationMatches(route, normalizedQuery));

  if (!baseRoute) {
    return null;
  }

  const originOverride = originRouteOverrides[locationId]?.[baseRoute.id];

  if (originOverride) {
    return {
      route: applyOverride(baseRoute, originOverride),
      matchedDestination: baseRoute.destination,
    };
  }

  if (isCampusOrigin(locationId)) {
    return {
      route: baseRoute,
      matchedDestination: baseRoute.destination,
    };
  }

  if (originMatchesDestination(baseRoute, locationId)) {
    return {
      route: baseRoute,
      matchedDestination: baseRoute.destination,
    };
  }

  return null;
}
