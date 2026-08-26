import type { FrameKind } from "../../shared/types";

export type Flight = [number, number, number];

export type CheapestFlightsFrame = {
  kind: FrameKind;
  phase: "initialize" | "round" | "copy" | "inspect" | "skip" | "relax" | "commit" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  n: number;
  flights: Flight[];
  src: number;
  dst: number;
  k: number;
  round: number;
  dist: number[];
  temp: number[] | null;
  flight: Flight | null;
  candidate: number | null;
  updated: boolean;
  result: number | null;
};

type DryRun = { frames: CheapestFlightsFrame[] };

export function createCheapestFlightsDryRun(n: number, flightsInput: number[][], src: number, dst: number, k: number): DryRun {
  const flights = flightsInput.map(([from, to, price]) => [from, to, price] as Flight);
  const frames: CheapestFlightsFrame[] = [];
  let dist = Array<number>(n).fill(Infinity);
  dist[src] = 0;
  let temp: number[] | null = null;

  const push = (frame: Omit<CheapestFlightsFrame, "n" | "flights" | "src" | "dst" | "k" | "dist" | "temp">) => {
    frames.push({
      ...frame,
      n,
      flights: flights.map(([from, to, price]) => [from, to, price] as Flight),
      src,
      dst,
      k,
      dist: [...dist],
      temp: temp ? [...temp] : null,
    });
  };

  push({
    kind: "start",
    phase: "initialize",
    title: "Initialize dist from the source",
    detail: `Every airport starts at infinity except airport ${src}, which costs 0 to reach from itself.`,
    activeLines: [15, 16],
    round: 0,
    flight: null,
    candidate: null,
    updated: false,
    result: null,
  });

  for (let round = 1; round <= k + 1; round += 1) {
    push({
      kind: "visit",
      phase: "round",
      title: `Round ${round}: allow at most ${round} edge${round === 1 ? "" : "s"}`,
      detail: `k = ${k}, so the code runs ${k + 1} rounds. This round may extend every known route by one flight.`,
      activeLines: [19],
      round,
      flight: null,
      candidate: null,
      updated: false,
      result: null,
    });

    temp = [...dist];
    push({
      kind: "build",
      phase: "copy",
      title: "Copy dist into temp",
      detail: "temp begins as a copy. New prices go into temp, while every flight in this round still reads the unchanged dist.",
      activeLines: [20],
      round,
      flight: null,
      candidate: null,
      updated: false,
      result: null,
    });

    for (const flight of flights) {
      const [from, to, price] = flight;
      push({
        kind: "visit",
        phase: "inspect",
        title: `Inspect flight ${from} -> ${to} ($${price})`,
        detail: `Check whether airport ${from} was reachable before this round began.`,
        activeLines: [22, 23],
        round,
        flight,
        candidate: null,
        updated: false,
        result: null,
      });

      if (dist[from] === Infinity) {
        push({
          kind: "prune",
          phase: "skip",
          title: `Skip ${from} -> ${to}: airport ${from} is unreachable in dist`,
          detail: `temp[${from}] may already have a new value this round, but the code deliberately checks dist[${from}] = infinity.`,
          activeLines: [23],
          round,
          flight,
          candidate: null,
          updated: false,
          result: null,
        });
        continue;
      }

      const candidate = dist[from] + price;
      const previous = temp[to];
      const updated = candidate < previous;
      temp[to] = Math.min(previous, candidate);
      push({
        kind: updated ? "build" : "prune",
        phase: "relax",
        title: updated ? `Update temp[${to}] to $${candidate}` : `Keep temp[${to}] at $${previous}`,
        detail: updated
          ? `min($${previous === Infinity ? "infinity" : previous}, dist[${from}] $${dist[from]} + $${price}) = $${candidate}.`
          : `Candidate is $${candidate}; the existing temp[${to}] = $${previous} is already cheaper.`,
        activeLines: [24],
        round,
        flight,
        candidate,
        updated,
        result: null,
      });
    }

    dist = [...temp];
    push({
      kind: "found",
      phase: "commit",
      title: `Commit round ${round}: dist = temp`,
      detail: `The next round can now use routes with at most ${round} edge${round === 1 ? "" : "s"}.`,
      activeLines: [26],
      round,
      flight: null,
      candidate: null,
      updated: false,
      result: null,
    });
  }

  const result = dist[dst] === Infinity ? -1 : dist[dst];
  push({
    kind: "done",
    phase: "done",
    title: result === -1 ? `Airport ${dst} is unreachable within ${k} stop${k === 1 ? "" : "s"}` : `Cheapest price to airport ${dst} is $${result}`,
    detail: result === -1 ? "dist[dst] is still infinity, so the code returns -1." : `dist[${dst}] = ${result}, so the code returns ${result}.`,
    activeLines: [28],
    round: k + 1,
    flight: null,
    candidate: null,
    updated: false,
    result,
  });

  return { frames };
}
