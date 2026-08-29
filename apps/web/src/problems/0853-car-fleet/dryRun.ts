import type { FrameKind } from "../../shared/types";

export type CarFleetFrame = {
  kind: FrameKind;
  phase: "initialize" | "inspect" | "fleet" | "merge" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  carIndex: number | null;
  position: number | null;
  speed: number | null;
  arrival: number | null;
  cars: Array<{ index: number; position: number; speed: number }>;
  fleetArrivals: number[];
  result: number | null;
};

export function createCarFleetDryRun(target: number, positions: number[], speeds: number[]): { frames: CarFleetFrame[] } {
  const cars = positions.map((position, index) => ({ index, position, speed: speeds[index]! })).sort((a, b) => b.position - a.position);
  const fleetArrivals: number[] = [];
  const frames: CarFleetFrame[] = [];
  const snapshot = (frame: Omit<CarFleetFrame, "cars" | "fleetArrivals">) => frames.push({ ...frame, cars: cars.map((car) => ({ ...car })), fleetArrivals: [...fleetArrivals] });

  snapshot({ kind: "start", phase: "initialize", title: "Sort cars nearest to the target first", detail: "A car can only merge into a car or fleet that is already ahead of it.", activeLines: [2, 3], carIndex: null, position: null, speed: null, arrival: null, result: null });

  cars.forEach((car) => {
    const arrival = (target - car.position) / car.speed;
    snapshot({ kind: "visit", phase: "inspect", title: `Inspect car at position ${car.position}`, detail: `It needs ${target} - ${car.position} = ${target - car.position} distance at speed ${car.speed}, so arrival time = ${arrival}.`, activeLines: [4, 5], carIndex: car.index, position: car.position, speed: car.speed, arrival, result: null });
    const aheadArrival = fleetArrivals[fleetArrivals.length - 1];
    if (aheadArrival === undefined || arrival > aheadArrival) {
      fleetArrivals.push(arrival);
      snapshot({ kind: "found", phase: "fleet", title: `Create fleet #${fleetArrivals.length}`, detail: aheadArrival === undefined ? "This is the frontmost car, so it begins the first fleet." : `It arrives later than the fleet ahead (${arrival} > ${aheadArrival}), so it cannot catch up.`, activeLines: [6, 7], carIndex: car.index, position: car.position, speed: car.speed, arrival, result: null });
    } else {
      snapshot({ kind: "backtrack", phase: "merge", title: `Merge into the fleet ahead`, detail: `It arrives no later than the fleet ahead (${arrival} <= ${aheadArrival}), so it catches up and becomes part of that fleet.`, activeLines: [8, 9], carIndex: car.index, position: car.position, speed: car.speed, arrival, result: null });
    }
  });

  snapshot({ kind: "done", phase: "done", title: "Return the number of fleets", detail: `There are ${fleetArrivals.length} distinct target arrival times, so there are ${fleetArrivals.length} fleets.`, activeLines: [10], carIndex: null, position: null, speed: null, arrival: null, result: fleetArrivals.length });
  return { frames };
}
