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
  "conti-bus-stop",
  "engineering-gate",
  "ayeduase-gate",
  "commercial-area",
  "republic-hall-area",
  "unity-hall-conti",
  "university-hall-katanga",
];

const originRouteOverrides: Partial<Record<UserLocationId, Partial<Record<string, RouteOverride>>>> = {
  "conti-bus-stop": {
    kejetia: {
      from: "Conti Bus Stop",
      boardingPoint: "Conti Bus Stop",
      nearbyLandmark: {
        name: "Conti Bus Stop",
        walkTime: "0 - 1 min",
        clue: "Campus shuttle sign and long queue rail",
        transportHint: "Take a Kejetia trotro from the main lane.",
        phrase: "Mate, Kejetia.",
        exitPoint: "Kejetia Terminal",
      },
    },
    "tech-junction": {
      from: "Conti Bus Stop",
      boardingPoint: "Conti Bus Stop",
      nearbyLandmark: {
        name: "Conti Bus Stop",
        walkTime: "0 - 1 min",
        clue: "Yellow curb paint and campus shuttle sign",
        transportHint: "Board a Kejetia-bound trotro and mention Tech Junction.",
        phrase: "Mate, Tech Junction main station side.",
        exitPoint: "Tech Junction Main Station",
      },
    },
    adum: {
      from: "Conti Bus Stop",
      boardingPoint: "Conti Bus Stop",
      nearbyLandmark: {
        name: "Conti Bus Stop",
        walkTime: "0 - 1 min",
        clue: "Queue shelter and bus sign",
        transportHint: "Wait for direct Adum cars or take Kejetia and switch at Roman Hill.",
        phrase: "Adum PZ, please.",
        exitPoint: "Adum PZ",
      },
    },
  },
  "engineering-gate": {
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
  suame: {
    kejetia: {
      from: "Suame",
      boardingPoint: "Suame Magazine",
      vehicleType: "Kejetia Trotro",
      fareRange: "GH₵3.00 - GH₵5.00",
      estimatedTime: "14 - 20 min",
      uberEstimate: "GH₵20 - GH₵30",
      savings: "Save about GH₵18",
      driverPhrase: "Kejetia Terminal, please.",
      safetyNote: "Use the main Suame Magazine loading lanes — avoid roadside cars at the edge.",
      steps: [
        "Start from Suame Magazine main loading area.",
        "Board a southbound trotro heading Kejetia.",
        "Tell the mate Kejetia Terminal.",
        "Alight at Kejetia Terminal.",
        "Walk through the terminal side to your destination.",
      ],
      nearbyLandmark: {
        name: "Suame Magazine",
        walkTime: "0 - 1 min",
        clue: "Auto-workshop area with large open loading lanes",
        transportHint: "Join the southbound Kejetia lane from Suame Magazine.",
        phrase: "Kejetia Terminal, please.",
        exitPoint: "Kejetia Terminal",
      },
    },
    bantama: {
      from: "Suame",
      boardingPoint: "Suame Magazine",
      vehicleType: "Bantama Trotro / Taxi",
      fareRange: "GH₵2.00 - GH₵3.50",
      estimatedTime: "8 - 14 min",
      uberEstimate: "GH₵12 - GH₵18",
      savings: "Save about GH₵10",
      driverPhrase: "Bantama market, please.",
      nearbyLandmark: {
        name: "Suame Magazine",
        walkTime: "0 - 1 min",
        clue: "Auto-workshop area — short hop south to Bantama",
        transportHint: "Board a southbound car toward Bantama market.",
        phrase: "Bantama market, please.",
        exitPoint: "Bantama Market",
      },
    },
  },
  bantama: {
    kejetia: {
      from: "Bantama",
      boardingPoint: "Bantama Market",
      vehicleType: "Kejetia Trotro / Taxi",
      fareRange: "GH₵2.50 - GH₵4.00",
      estimatedTime: "10 - 16 min",
      uberEstimate: "GH₵16 - GH₵24",
      savings: "Save about GH₵14",
      driverPhrase: "Kejetia Terminal, please.",
      safetyNote: "Keep bags in front at Bantama Market — it is busy and the queue is dense.",
      steps: [
        "Start from Bantama Market junction.",
        "Board a southbound trotro heading Kejetia or Adum.",
        "Tell the mate Kejetia Terminal.",
        "Alight at Kejetia Terminal.",
        "Walk through the terminal side to your destination.",
      ],
      nearbyLandmark: {
        name: "Bantama Market",
        walkTime: "0 - 1 min",
        clue: "Busy market junction with loading lanes on both sides",
        transportHint: "Board a Kejetia-bound car from the south lane.",
        phrase: "Kejetia Terminal, please.",
        exitPoint: "Kejetia Terminal",
      },
    },
    adum: {
      from: "Bantama",
      boardingPoint: "Bantama Market",
      vehicleType: "Adum Trotro / Taxi",
      fareRange: "GH₵2.50 - GH₵4.50",
      estimatedTime: "10 - 18 min",
      uberEstimate: "GH₵16 - GH₵26",
      savings: "Save about GH₵14",
      driverPhrase: "Adum PZ, please.",
      nearbyLandmark: {
        name: "Bantama Market",
        walkTime: "0 - 1 min",
        clue: "Market junction — Adum is a short hop south-east",
        transportHint: "Pick an Adum-bound car from the south-east lane.",
        phrase: "Adum PZ, please.",
        exitPoint: "Adum PZ",
      },
    },
    manhyia: {
      from: "Bantama",
      boardingPoint: "Bantama Market",
      vehicleType: "Manhyia Taxi",
      fareRange: "GH₵2.00 - GH₵3.00",
      estimatedTime: "6 - 10 min",
      uberEstimate: "GH₵10 - GH₵16",
      savings: "Save about GH₵8",
      driverPhrase: "Manhyia Palace, please.",
      nearbyLandmark: {
        name: "Bantama Market",
        walkTime: "0 - 1 min",
        clue: "Market junction — Manhyia is north, a very short hop",
        transportHint: "Board a northbound taxi toward Manhyia Palace.",
        phrase: "Manhyia Palace, please.",
        exitPoint: "Manhyia Palace",
      },
    },
  },
  manhyia: {
    kejetia: {
      from: "Manhyia",
      boardingPoint: "Manhyia Palace",
      vehicleType: "Kejetia Trotro",
      fareRange: "GH₵3.00 - GH₵5.00",
      estimatedTime: "14 - 22 min",
      uberEstimate: "GH₵20 - GH₵32",
      savings: "Save about GH₵18",
      driverPhrase: "Kejetia Terminal, please.",
      safetyNote: "Use the main loading area near the palace road — avoid roadside flagging during events.",
      steps: [
        "Start from Manhyia Palace area.",
        "Board a southbound trotro heading Kejetia.",
        "Tell the mate Kejetia Terminal.",
        "Alight at Kejetia Terminal.",
        "Walk through the terminal to your destination.",
      ],
      nearbyLandmark: {
        name: "Manhyia Palace",
        walkTime: "0 - 1 min",
        clue: "Palace road with large gate and open roadside",
        transportHint: "Join the southbound lane toward Kejetia or Bantama.",
        phrase: "Kejetia Terminal, please.",
        exitPoint: "Kejetia Terminal",
      },
    },
    bantama: {
      from: "Manhyia",
      boardingPoint: "Manhyia Palace",
      vehicleType: "Bantama Taxi",
      fareRange: "GH₵2.00 - GH₵3.00",
      estimatedTime: "6 - 10 min",
      uberEstimate: "GH₵10 - GH₵16",
      savings: "Save about GH₵8",
      driverPhrase: "Bantama market, please.",
      nearbyLandmark: {
        name: "Manhyia Palace",
        walkTime: "0 - 1 min",
        clue: "Palace road — Bantama is a very short hop south",
        transportHint: "Board any southbound taxi toward Bantama market.",
        phrase: "Bantama market, please.",
        exitPoint: "Bantama Market",
      },
    },
  },
  ahodwo: {
    kejetia: {
      from: "Ahodwo",
      boardingPoint: "Ahodwo Roundabout",
      vehicleType: "Kejetia Trotro",
      fareRange: "GH₵3.50 - GH₵5.50",
      estimatedTime: "18 - 26 min",
      uberEstimate: "GH₵22 - GH₵34",
      savings: "Save about GH₵20",
      driverPhrase: "Kejetia Terminal, please.",
      safetyNote: "Cross the roundabout carefully and use the designated loading zone.",
      steps: [
        "Start from Ahodwo Roundabout.",
        "Board a northbound trotro heading Kejetia via Roman Hill.",
        "Tell the mate Kejetia Terminal.",
        "Alight at Kejetia Terminal.",
        "Walk through to your destination.",
      ],
      nearbyLandmark: {
        name: "Ahodwo Roundabout",
        walkTime: "0 - 1 min",
        clue: "Roundabout with shops and loading lanes on the north side",
        transportHint: "Join the northbound lane toward Kejetia.",
        phrase: "Kejetia Terminal, please.",
        exitPoint: "Kejetia Terminal",
      },
    },
    asafo: {
      from: "Ahodwo",
      boardingPoint: "Ahodwo Roundabout",
      vehicleType: "Asafo Trotro / Taxi",
      fareRange: "GH₵2.50 - GH₵4.00",
      estimatedTime: "10 - 16 min",
      uberEstimate: "GH₵14 - GH₵22",
      savings: "Save about GH₵12",
      driverPhrase: "Asafo station, please.",
      nearbyLandmark: {
        name: "Ahodwo Roundabout",
        walkTime: "0 - 1 min",
        clue: "Roundabout — Asafo is north-east, a short ride",
        transportHint: "Board a car heading north toward Asafo Station.",
        phrase: "Asafo station, please.",
        exitPoint: "Asafo Station",
      },
    },
    santasi: {
      from: "Ahodwo",
      boardingPoint: "Ahodwo Roundabout",
      vehicleType: "Santasi Trotro",
      fareRange: "GH₵2.00 - GH₵3.50",
      estimatedTime: "8 - 14 min",
      uberEstimate: "GH₵12 - GH₵18",
      savings: "Save about GH₵10",
      driverPhrase: "Santasi roundabout, please.",
      nearbyLandmark: {
        name: "Ahodwo Roundabout",
        walkTime: "0 - 1 min",
        clue: "Roundabout — Santasi is south, a short hop",
        transportHint: "Board any southbound car toward Santasi.",
        phrase: "Santasi roundabout, please.",
        exitPoint: "Santasi Roundabout",
      },
    },
  },
  "anloga-junction": {
    kejetia: {
      from: "Anloga Junction",
      boardingPoint: "Anloga Junction",
      vehicleType: "Kejetia Trotro",
      fareRange: "GH₵3.00 - GH₵5.00",
      estimatedTime: "14 - 22 min",
      uberEstimate: "GH₵18 - GH₵28",
      savings: "Save about GH₵16",
      driverPhrase: "Kejetia Terminal, please.",
      nearbyLandmark: {
        name: "Anloga Junction",
        walkTime: "0 - 1 min",
        clue: "Roadside junction with market kiosks",
        transportHint: "Board a westbound trotro heading Asafo or Kejetia.",
        phrase: "Kejetia Terminal, please.",
        exitPoint: "Kejetia Terminal",
      },
    },
    asafo: {
      from: "Anloga Junction",
      boardingPoint: "Anloga Junction",
      vehicleType: "Asafo Trotro / Taxi",
      fareRange: "GH₵2.00 - GH₵3.50",
      estimatedTime: "6 - 12 min",
      uberEstimate: "GH₵10 - GH₵18",
      savings: "Save about GH₵9",
      driverPhrase: "Asafo station, please.",
      nearbyLandmark: {
        name: "Anloga Junction",
        walkTime: "0 - 1 min",
        clue: "Roadside junction — Asafo is very close, continue west",
        transportHint: "Board any westbound car — Asafo is the next major stop.",
        phrase: "Asafo station, please.",
        exitPoint: "Asafo Station",
      },
    },
    adum: {
      from: "Anloga Junction",
      boardingPoint: "Anloga Junction",
      vehicleType: "Adum Trotro",
      fareRange: "GH₵3.00 - GH₵5.00",
      estimatedTime: "16 - 24 min",
      uberEstimate: "GH₵18 - GH₵28",
      savings: "Save about GH₵16",
      driverPhrase: "Adum PZ, please.",
      nearbyLandmark: {
        name: "Anloga Junction",
        walkTime: "0 - 1 min",
        clue: "Roadside junction — board west toward Asafo then Adum",
        transportHint: "Take a westbound car and mention Adum PZ.",
        phrase: "Adum PZ, please.",
        exitPoint: "Adum PZ",
      },
    },
  },
  "airport-roundabout": {
    asafo: {
      from: "Airport Roundabout",
      boardingPoint: "Airport Roundabout",
      vehicleType: "Asafo Trotro",
      fareRange: "GH₵2.50 - GH₵4.00",
      estimatedTime: "10 - 16 min",
      uberEstimate: "GH₵14 - GH₵22",
      savings: "Save about GH₵12",
      driverPhrase: "Asafo station, please.",
      safetyNote: "Cross the roundabout at designated points — Airport Road has fast-moving vehicles.",
      steps: [
        "Start from Airport Roundabout.",
        "Board a northbound trotro heading Asafo Station.",
        "Tell the mate Asafo station.",
        "Alight at Asafo Station.",
        "Connect to further destinations from there.",
      ],
      nearbyLandmark: {
        name: "Airport Roundabout",
        walkTime: "0 - 1 min",
        clue: "Roundabout near airport — use the north loading lane",
        transportHint: "Board northbound trotro toward Asafo Station.",
        phrase: "Asafo station, please.",
        exitPoint: "Asafo Station",
      },
    },
    kejetia: {
      from: "Airport Roundabout",
      boardingPoint: "Airport Roundabout",
      vehicleType: "Kejetia Trotro",
      fareRange: "GH₵4.50 - GH₵6.50",
      estimatedTime: "25 - 35 min",
      uberEstimate: "GH₵28 - GH₵42",
      savings: "Save about GH₵26",
      driverPhrase: "Kejetia Terminal, please.",
      nearbyLandmark: {
        name: "Airport Roundabout",
        walkTime: "0 - 1 min",
        clue: "Roundabout near Kumasi Airport — north loading zone",
        transportHint: "Board northbound toward Asafo then connect to Kejetia.",
        phrase: "Kejetia Terminal, please — via Asafo.",
        exitPoint: "Kejetia Terminal",
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
