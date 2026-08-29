import type { FrameKind } from "../../shared/types";

export type CarPoolingFrame = {
  kind: FrameKind;
  phase: "initialize" | "trip" | "sweep" | "capacity" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  trips: number[][];
  capacity: number;
  events: Array<[number, number]>;
  tripIndex: number | null;
  current: number | null;
  change: number | null;
  passengers: number;
  result: boolean | null;
};

export function createCarPoolingDryRun(tripsInput: number[][], capacity: number): { frames: CarPoolingFrame[] } {
  const trips = tripsInput.map((trip) => [...trip]);
  const diff = Array.from({ length: 1001 }, () => 0);
  const frames: CarPoolingFrame[] = [];
  const push = (frame: Omit<CarPoolingFrame, "trips" | "capacity" | "events">) => {
    const events = diff.flatMap((change, station) => change ? [[station, change] as [number, number]] : []);
    frames.push({ ...frame, trips: trips.map((trip) => [...trip]), capacity, events });
  };

  push({ kind: "start", phase: "initialize", title: "Create diff[0..1000]", detail: "Every station starts with zero passenger change.", activeLines: [2, 3], tripIndex: null, current: null, change: null, passengers: 0, result: null });
  for (let tripIndex = 0; tripIndex < trips.length; tripIndex += 1) {
    const [passengers, start, end] = trips[tripIndex]!;
    diff[start] += passengers;
    diff[end] -= passengers;
    push({ kind: "build", phase: "trip", title: `Record trip ${tripIndex + 1}: ${passengers} passengers`, detail: `diff[${start}] += ${passengers}; diff[${end}] -= ${passengers}.`, activeLines: [5, 6, 7], tripIndex, current: start, change: diff[start], passengers: 0, result: null });
  }

  let currentPassengers = 0;
  for (let station = 0; station < diff.length; station += 1) {
    if (diff[station] === 0) continue;
    currentPassengers += diff[station];
    push({ kind: "visit", phase: "sweep", title: `Sweep station ${station}`, detail: `current += diff[${station}] (${diff[station]! >= 0 ? "+" : ""}${diff[station]}) = ${currentPassengers}.`, activeLines: [11, 12], tripIndex: null, current: station, change: diff[station], passengers: currentPassengers, result: null });
    push({ kind: currentPassengers > capacity ? "prune" : "visit", phase: "capacity", title: currentPassengers > capacity ? `Capacity exceeded at station ${station}` : `Capacity holds at station ${station}`, detail: currentPassengers > capacity ? `${currentPassengers} passengers is greater than capacity ${capacity}; return False.` : `${currentPassengers} passengers is within capacity ${capacity}.`, activeLines: [14, 15], tripIndex: null, current: station, change: diff[station], passengers: currentPassengers, result: currentPassengers > capacity ? false : null });
    if (currentPassengers > capacity) return { frames };
  }

  push({ kind: "done", phase: "done", title: "All station changes fit", detail: "The sweep never exceeded capacity, so return True.", activeLines: [17], tripIndex: null, current: null, change: null, passengers: currentPassengers, result: true });
  return { frames };
}
