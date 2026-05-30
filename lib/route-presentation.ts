import type { RouteLocationContext } from "@/lib/location-context";
import type { RouteOption, RouteRecord } from "@/lib/mock-data";

export type RouteOptionKey = "cheapest" | "fastest" | "balanced";

export type JourneyStep = {
  id: string;
  kind: "walk" | "board" | "phrase" | "alight" | "arrive";
  title: string;
  instruction: string;
  meta?: string;
  fromLabel?: string;
  toLabel?: string;
};

export type RouteDisplayState = {
  fare: string;
  time: string;
  savings: string;
  vehicle: string;
  walkingDistance: string;
  boardAt: string;
  alightAt: string;
  driverPhrase: string;
  bestRouteLabel: string;
};

function extractWalkMeta(step: string | undefined, fallback: string) {
  if (!step) {
    return fallback;
  }

  const match = step.match(/(\d+(?:\s*-\s*\d+)?)\s*minutes?/i);
  if (match) {
    return `${match[1]} min walk`;
  }

  const shortMatch = step.match(/(\d+(?:\s*-\s*\d+)?)\s*min/i);
  if (shortMatch) {
    return `${shortMatch[1]} min walk`;
  }

  return fallback;
}

export function getSelectedOption(
  route: RouteRecord,
  selectedOptionKey: null | RouteOptionKey,
): null | RouteOption {
  if (!selectedOptionKey) {
    return null;
  }

  return route.options[selectedOptionKey];
}

export function getRouteDisplayState(
  route: RouteRecord,
  selectedOption?: null | RouteOption,
  locationContext?: RouteLocationContext,
): RouteDisplayState {
  if (locationContext?.isAtDestination) {
    return {
      fare: "GH₵0.00",
      time: "0 - 3 min",
      savings: "Already at destination",
      vehicle: "Walking only",
      walkingDistance: "0 - 3 min walk",
      boardAt: "Not needed",
      alightAt: "Already at destination",
      driverPhrase: "Not needed",
      bestRouteLabel: `Already at ${route.destination}`,
    };
  }

  return {
    fare: selectedOption?.fare ?? route.fareRange,
    time: selectedOption?.time ?? route.estimatedTime,
    savings: `${route.savings} compared to Uber/Bolt`,
    vehicle: selectedOption?.transportType ?? route.vehicleType,
    walkingDistance: selectedOption?.walkingDistance ?? "Varies by route",
    boardAt: route.boardingPoint,
    alightAt: route.alightingPoint,
    driverPhrase: route.driverPhrase,
    bestRouteLabel: `${route.boardingPoint} -> ${route.alightingPoint}`,
  };
}

export function buildJourneySteps(
  route: RouteRecord,
  selectedOption?: null | RouteOption,
  locationContext?: RouteLocationContext,
): JourneyStep[] {
  const landmark = route.nearbyLandmarks[0];
  const lastStep = route.steps[route.steps.length - 1];
  const vehicleType = selectedOption?.transportType ?? route.vehicleType;
  const fareRange = selectedOption?.fare ?? route.fareRange;
  const timeRange = selectedOption?.time ?? route.estimatedTime;

  if (locationContext?.isAtDestination) {
    return [
      {
        id: "already-there",
        kind: "arrive",
        title: `You are already at ${route.destination}`,
        instruction: `You selected ${locationContext.originLabel} as your starting point, so no taxi or trotro is needed. Just make a short local walk to your exact stop or meeting point.`,
        meta: "No ride needed",
        fromLabel: locationContext.originLabel,
        toLabel: route.destination,
      },
    ];
  }

  const walkTitle = locationContext?.isAtBoardingPoint
    ? `Start at ${route.boardingPoint}`
    : `Walk to ${route.boardingPoint}`;
  const walkInstruction =
    locationContext?.walkInstruction ??
    `Start from your current location and move to ${route.boardingPoint}. Use ${landmark.name} as your visual reference point.`;
  const walkMeta = locationContext?.walkTime ?? landmark.walkTime;

  return [
    {
      id: "start",
      kind: "walk",
      title: walkTitle,
      instruction: walkInstruction,
      meta: walkMeta,
      fromLabel: locationContext?.originLabel ?? "Current location",
      toLabel: route.boardingPoint,
    },
    {
      id: "board",
      kind: "board",
      title: `Board ${vehicleType}`,
      instruction: landmark.transportHint || `Pick a ${vehicleType} going toward ${route.destination}.`,
      meta: `Fare ${fareRange}`,
      fromLabel: route.boardingPoint,
      toLabel: route.alightingPoint,
    },
    {
      id: "phrase",
      kind: "phrase",
      title: "Tell the driver or mate",
      instruction: `"${route.driverPhrase}"`,
      meta: "Say this before paying",
      fromLabel: route.boardingPoint,
      toLabel: route.alightingPoint,
    },
    {
      id: "alight",
      kind: "alight",
      title: `Alight at ${route.alightingPoint}`,
      instruction: `Get down at ${route.alightingPoint} and prepare for the final short walk.`,
      meta: timeRange,
      fromLabel: route.boardingPoint,
      toLabel: route.alightingPoint,
    },
    {
      id: "arrive",
      kind: "arrive",
      title: "Walk to final destination",
      instruction: lastStep.startsWith("Walk")
        ? lastStep
        : `Follow the walking direction from ${route.alightingPoint} to ${route.destination}.`,
      meta: extractWalkMeta(lastStep, "2 min walk"),
      fromLabel: route.alightingPoint,
      toLabel: route.destination,
    },
  ];
}

export function getBestRouteLabel(
  route: RouteRecord,
  locationContext?: RouteLocationContext,
) {
  return getRouteDisplayState(route, null, locationContext).bestRouteLabel;
}
