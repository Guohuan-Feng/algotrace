import { describe, expect, test } from "vitest";
import { createItineraryDryRun } from "./dryRun";

describe("Reconstruct Itinerary dry run", () => {
  test("reconstructs the first official itinerary in ticket order", () => {
    const { frames } = createItineraryDryRun([
      ["MUC", "LHR"],
      ["JFK", "MUC"],
      ["SFO", "SJC"],
      ["LHR", "SFO"],
    ]);

    expect(frames[frames.length - 1]?.result).toEqual(["JFK", "MUC", "LHR", "SFO", "SJC"]);
    expect(frames.some((frame) => frame.phase === "append")).toBe(true);
  });

  test("takes the lexicographically smallest airport from a branching heap", () => {
    const { frames } = createItineraryDryRun([
      ["JFK", "SFO"],
      ["JFK", "ATL"],
      ["SFO", "ATL"],
      ["ATL", "JFK"],
      ["ATL", "SFO"],
    ]);

    expect(frames.some((frame) => frame.activeTicket?.from === "JFK" && frame.activeTicket.to === "ATL")).toBe(true);
    expect(frames[frames.length - 1]?.result).toEqual(["JFK", "ATL", "JFK", "SFO", "ATL", "SFO"]);
  });
});
