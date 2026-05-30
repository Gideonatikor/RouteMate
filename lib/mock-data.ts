export type RouteOption = {
  label: "Cheapest Route" | "Fastest Route" | "Balanced Route";
  fare: string;
  time: string;
  comfort: string;
  walkingDistance: string;
  transportType: string;
  highlight: string;
};

export type NearbyLandmark = {
  name: string;
  walkTime: string;
  clue: string;
  transportHint: string;
  phrase: string;
  exitPoint: string;
};

export type RouteRecord = {
  id: string;
  from: string;
  to: string;
  destination: string;
  aliases: string[];
  boardingPoint: string;
  alightingPoint: string;
  vehicleType: string;
  fareRange: string;
  estimatedTime: string;
  uberEstimate: string;
  savings: string;
  driverPhrase: string;
  safetyNote: string;
  confidence: "High" | "Medium";
  lastVerified: string;
  usersConfirmed: number;
  routeTone: string;
  steps: string[];
  options: {
    cheapest: RouteOption;
    fastest: RouteOption;
    balanced: RouteOption;
  };
  nearbyLandmarks: NearbyLandmark[];
};

export const routes: RouteRecord[] = [
  {
    id: "tech-junction",
    from: "KNUST Campus",
    to: "Tech Junction",
    destination: "Tech Junction",
    aliases: ["tech junction", "tech", "tech junction station"],
    boardingPoint: "Brunei Bus Stop",
    alightingPoint: "Tech Junction Main Station",
    vehicleType: "Kejetia Trotro",
    fareRange: "GH₵4.50 - GH₵6.00",
    estimatedTime: "20 - 26 min",
    uberEstimate: "GH₵26 - GH₵34",
    savings: "Save about GH₵24",
    driverPhrase: "Tech Junction, main station side.",
    safetyNote: "Avoid boarding isolated late-night cars; use the main trotro queue after dark.",
    confidence: "High",
    lastVerified: "May 2026",
    usersConfirmed: 31,
    routeTone: "Great for hostel runs, gadgets, and roadside food after lectures.",
    steps: [
      "Head to Brunei Bus Stop and queue for Kejetia-bound trotro.",
      "Confirm Tech Junction main station with the mate before paying.",
      "Stay on until the busy Tech Junction station area.",
      "Alight at the main station and use the zebra crossing.",
      "Walk 1 minute to nearby shops or hostels.",
    ],
    options: {
      cheapest: {
        label: "Cheapest Route",
        fare: "GH₵4.50",
        time: "26 min",
        comfort: "Crowded peak ride",
        walkingDistance: "5 min walk",
        transportType: "Kejetia Trotro",
        highlight: "Best during daytime when queue movement is steady.",
      },
      fastest: {
        label: "Fastest Route",
        fare: "GH₵6.00",
        time: "20 min",
        comfort: "Semi-direct",
        walkingDistance: "2 min walk",
        transportType: "Direct Taxi",
        highlight: "Cuts queue time when traffic is still light.",
      },
      balanced: {
        label: "Balanced Route",
        fare: "GH₵5.00",
        time: "22 min",
        comfort: "Moderate",
        walkingDistance: "3 min walk",
        transportType: "Kejetia Trotro",
        highlight: "Most reliable mix for everyday commuter flow.",
      },
    },
    nearbyLandmarks: [
      {
        name: "Brunei Bus Stop",
        walkTime: "2 min",
        clue: "Yellow curb paint and campus shuttle sign",
        transportHint: "Board a Kejetia-bound trotro and mention Tech Junction.",
        phrase: "Mate, Tech Junction main station side.",
        exitPoint: "Tech Junction Main Station",
      },
      {
        name: "Unity Hall Junction",
        walkTime: "4 min",
        clue: "Orange food kiosks near the hall entrance",
        transportHint: "Pick any car loading for town through Tech.",
        phrase: "Tech Junction, please.",
        exitPoint: "Tech Junction traffic light",
      },
      {
        name: "Kotei Road Split",
        walkTime: "5 min",
        clue: "Forked road with a pharmacy billboard",
        transportHint: "Use shared taxis that join the Tech road early.",
        phrase: "Tech Junction make I drop there.",
        exitPoint: "Station frontage",
      },
    ],
  },
  {
    id: "ayeduase",
    from: "KNUST Campus",
    to: "Ayeduase",
    destination: "Ayeduase",
    aliases: ["ayeduase", "ayeduase junction", "ayeduase market"],
    boardingPoint: "Engineering Gate",
    alightingPoint: "Ayeduase Junction",
    vehicleType: "Ayeduase Taxi",
    fareRange: "GH₵3.00 - GH₵4.50",
    estimatedTime: "10 - 15 min",
    uberEstimate: "GH₵18 - GH₵24",
    savings: "Save about GH₵16",
    driverPhrase: "Ayeduase junction, please.",
    safetyNote: "Use the lit side of the junction and avoid alighting too far from the main stores.",
    confidence: "High",
    lastVerified: "May 2026",
    usersConfirmed: 42,
    routeTone: "Simple everyday route for food, hostels, pharmacies, and quick errands.",
    steps: [
      "Walk to Engineering Gate roadside queue.",
      "Board an Ayeduase taxi and mention the junction.",
      "Pay after the vehicle moves or when the mate asks.",
      "Alight at Ayeduase Junction near the roadside shops.",
      "Walk into the market lane or hostel road as needed.",
    ],
    options: {
      cheapest: {
        label: "Cheapest Route",
        fare: "GH₵3.00",
        time: "15 min",
        comfort: "Shared ride",
        walkingDistance: "4 min walk",
        transportType: "Ayeduase Taxi",
        highlight: "Best daytime commuter option with little walking.",
      },
      fastest: {
        label: "Fastest Route",
        fare: "GH₵4.50",
        time: "10 min",
        comfort: "Direct",
        walkingDistance: "2 min walk",
        transportType: "Direct Taxi",
        highlight: "Great for quick errands before lectures resume.",
      },
      balanced: {
        label: "Balanced Route",
        fare: "GH₵3.50",
        time: "12 min",
        comfort: "Moderate",
        walkingDistance: "3 min walk",
        transportType: "Ayeduase Taxi",
        highlight: "Most consistent campus-to-junction flow.",
      },
    },
    nearbyLandmarks: [
      {
        name: "Engineering Gate",
        walkTime: "3 min",
        clue: "Security booth and bridge shadow",
        transportHint: "Take any taxi calling Ayeduase.",
        phrase: "Ayeduase junction, please.",
        exitPoint: "Ayeduase Junction",
      },
      {
        name: "Commercial Area Shell",
        walkTime: "5 min",
        clue: "Bright station lights and ATM",
        transportHint: "Cars line up by the station edge heading Ayeduase.",
        phrase: "Ayeduase side make I drop there.",
        exitPoint: "Market bend",
      },
      {
        name: "University Hall Gate",
        walkTime: "6 min",
        clue: "Broad gate with football field view",
        transportHint: "Use passing Ayeduase taxis during busy hours.",
        phrase: "Ayeduase junction, boss.",
        exitPoint: "Ayeduase Junction",
      },
    ],
  },
  {
    id: "kejetia",
    from: "KNUST Campus",
    to: "Kejetia",
    destination: "Kejetia",
    aliases: ["kejetia", "kejetia market", "kumasi central"],
    boardingPoint: "Brunei Bus Stop",
    alightingPoint: "Kejetia Terminal",
    vehicleType: "Kejetia Trotro",
    fareRange: "GH₵5.50 - GH₵7.00",
    estimatedTime: "28 - 36 min",
    uberEstimate: "GH₵35 - GH₵48",
    savings: "Save about GH₵34",
    driverPhrase: "Mate, Kejetia. I will alight at Roman Hill if traffic is heavy.",
    safetyNote: "Keep your bag forward in crowded queues and use the terminal exits with more foot traffic.",
    confidence: "High",
    lastVerified: "May 2026",
    usersConfirmed: 45,
    routeTone: "Best city link for shopping, terminals, and central Kumasi connections.",
    steps: [
      "Board a Kejetia trotro at Brunei Bus Stop.",
      "Mention Kejetia or Roman Hill depending on traffic updates.",
      "Stay on the main route into town.",
      "Alight at Kejetia Terminal or Roman Hill if advised.",
      "Walk through the main commercial lane to your destination.",
    ],
    options: {
      cheapest: {
        label: "Cheapest Route",
        fare: "GH₵5.50",
        time: "36 min",
        comfort: "Busy queue",
        walkingDistance: "7 min walk",
        transportType: "Kejetia Trotro",
        highlight: "Most economical for city runs with flexible timing.",
      },
      fastest: {
        label: "Fastest Route",
        fare: "GH₵7.00",
        time: "28 min",
        comfort: "Semi-direct",
        walkingDistance: "3 min walk",
        transportType: "Express Trotro",
        highlight: "Fewer stops and better when leaving very early.",
      },
      balanced: {
        label: "Balanced Route",
        fare: "GH₵6.00",
        time: "31 min",
        comfort: "Moderate",
        walkingDistance: "5 min walk",
        transportType: "Kejetia Trotro",
        highlight: "Reliable for most daytime market trips.",
      },
    },
    nearbyLandmarks: [
      {
        name: "Brunei Bus Stop",
        walkTime: "2 min",
        clue: "Campus shuttle sign and long queue rail",
        transportHint: "Take a Kejetia trotro from the main lane.",
        phrase: "Mate, Kejetia.",
        exitPoint: "Kejetia Terminal",
      },
      {
        name: "Republic Hall Junction",
        walkTime: "6 min",
        clue: "Hall sign and food vendors",
        transportHint: "Join town-bound vehicles heading Kejetia.",
        phrase: "Kejetia or Roman Hill, please.",
        exitPoint: "Roman Hill",
      },
      {
        name: "Tech Junction Bypass",
        walkTime: "8 min",
        clue: "Busy traffic lights and roadside minibus row",
        transportHint: "Catch passing central-bound transport if campus queues are long.",
        phrase: "Kejetia straight.",
        exitPoint: "Kejetia Terminal",
      },
    ],
  },
  {
    id: "adum",
    from: "KNUST Campus",
    to: "Adum",
    destination: "Adum",
    aliases: ["adum", "adum pz", "adum market"],
    boardingPoint: "Brunei Bus Stop",
    alightingPoint: "Adum PZ",
    vehicleType: "Adum Trotro",
    fareRange: "GH₵6.50 - GH₵8.00",
    estimatedTime: "32 - 40 min",
    uberEstimate: "GH₵38 - GH₵52",
    savings: "Save about GH₵37",
    driverPhrase: "Adum PZ, please.",
    safetyNote: "Use the more populated PZ side when meeting someone or opening your phone for directions.",
    confidence: "Medium",
    lastVerified: "May 2026",
    usersConfirmed: 24,
    routeTone: "For shopping, banking, and central-city errands without paying ride-hailing prices.",
    steps: [
      "Queue at Brunei Bus Stop for an Adum or Kejetia car.",
      "If using a Kejetia car, switch at Roman Hill for Adum PZ.",
      "Tell the mate clearly that you want Adum PZ.",
      "Alight near the PZ junction and stay on the busy sidewalk.",
      "Walk 2 - 4 minutes to shops or banks.",
    ],
    options: {
      cheapest: {
        label: "Cheapest Route",
        fare: "GH₵6.50",
        time: "40 min",
        comfort: "1 transfer",
        walkingDistance: "8 min walk",
        transportType: "Trotro via Roman Hill",
        highlight: "Cheaper if you do not mind one short transfer.",
      },
      fastest: {
        label: "Fastest Route",
        fare: "GH₵8.00",
        time: "32 min",
        comfort: "Direct seat",
        walkingDistance: "3 min walk",
        transportType: "Direct Adum Trotro",
        highlight: "Best when direct loading is available at the main queue.",
      },
      balanced: {
        label: "Balanced Route",
        fare: "GH₵7.00",
        time: "35 min",
        comfort: "Moderate",
        walkingDistance: "5 min walk",
        transportType: "Adum Trotro",
        highlight: "Consistent route when you want less switching and fair cost.",
      },
    },
    nearbyLandmarks: [
      {
        name: "Brunei Bus Stop",
        walkTime: "2 min",
        clue: "Queue shelter and bus sign",
        transportHint: "Wait for direct Adum cars or take Kejetia and switch at Roman Hill.",
        phrase: "Adum PZ, please.",
        exitPoint: "Adum PZ",
      },
      {
        name: "Roman Hill",
        walkTime: "5 min after switch",
        clue: "Steep roadside and major transfer point",
        transportHint: "Change here if direct Adum loading is not available.",
        phrase: "Adum PZ, make I drop there.",
        exitPoint: "Adum PZ",
      },
      {
        name: "Kejetia Terminal",
        walkTime: "6 min after city entry",
        clue: "Large terminal canopy and bus bays",
        transportHint: "Pick a quick inner-city ride to PZ.",
        phrase: "PZ side, please.",
        exitPoint: "Adum PZ",
      },
    ],
  },
  {
    id: "republic-hall",
    from: "KNUST Campus",
    to: "Republic Hall",
    destination: "Republic Hall",
    aliases: ["republic hall", "republic", "rep hall"],
    boardingPoint: "Commercial Area",
    alightingPoint: "Republic Hall Junction",
    vehicleType: "Campus Shuttle / Taxi",
    fareRange: "GH₵2.50 - GH₵4.00",
    estimatedTime: "8 - 12 min",
    uberEstimate: "GH₵15 - GH₵20",
    savings: "Save about GH₵13",
    driverPhrase: "Republic Hall junction, please.",
    safetyNote: "Use the main hall junction stop and avoid the darker side road after late events.",
    confidence: "High",
    lastVerified: "May 2026",
    usersConfirmed: 29,
    routeTone: "Short campus hop for residence, meetings, and event nights.",
    steps: [
      "Walk to Commercial Area loading point.",
      "Take a campus shuttle or shared taxi heading Republic side.",
      "Mention Republic Hall junction early.",
      "Alight at the hall junction sign.",
      "Walk into the hall road or nearby bus stop.",
    ],
    options: {
      cheapest: {
        label: "Cheapest Route",
        fare: "GH₵2.50",
        time: "12 min",
        comfort: "Shuttle",
        walkingDistance: "5 min walk",
        transportType: "Campus Shuttle",
        highlight: "Budget-friendly for daytime campus movement.",
      },
      fastest: {
        label: "Fastest Route",
        fare: "GH₵4.00",
        time: "8 min",
        comfort: "Direct",
        walkingDistance: "2 min walk",
        transportType: "Shared Taxi",
        highlight: "Ideal after events or when carrying items.",
      },
      balanced: {
        label: "Balanced Route",
        fare: "GH₵3.00",
        time: "10 min",
        comfort: "Moderate",
        walkingDistance: "3 min walk",
        transportType: "Campus Shuttle",
        highlight: "Easy, predictable hall connection with low cost.",
      },
    },
    nearbyLandmarks: [
      {
        name: "Commercial Area Shell",
        walkTime: "2 min",
        clue: "ATM and fuel station glow",
        transportHint: "Board campus shuttles or shared taxis from the edge of the area.",
        phrase: "Republic Hall junction, please.",
        exitPoint: "Republic Hall Junction",
      },
      {
        name: "Unity Hall Front",
        walkTime: "4 min",
        clue: "Orange kiosks and wide sidewalk",
        transportHint: "Catch a passing vehicle heading Republic side.",
        phrase: "Republic Hall side.",
        exitPoint: "Hall junction",
      },
      {
        name: "Library Roundabout",
        walkTime: "5 min",
        clue: "Roundabout with student foot traffic",
        transportHint: "Use nearby campus taxis if shuttle queue is long.",
        phrase: "Republic Hall junction, boss.",
        exitPoint: "Hall sign",
      },
    ],
  },
];

export const driverPhraseExamples = [
  "Boss, Kejetia side.",
  "Mate, Kejetia, I will alight at Roman Hill.",
  "Ayeduase junction, please.",
  "Tech Junction, main station side.",
];

export const reportActions = [
  "Report wrong fare",
  "Suggest better route",
  "Station moved",
  "Unsafe route",
];

export function findRouteByQuery(query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return routes[0];
  }

  return (
    routes.find(
      (route) =>
        route.destination.toLowerCase().includes(normalized) ||
        route.aliases.some((alias) => alias.includes(normalized)),
    ) ?? routes[0]
  );
}

