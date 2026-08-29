import { describe, expect, test } from "vitest";
import { createHouseRobberIiDryRun } from "./dryRun";

describe("House Robber II dry run", () => {
  test("runs both linear cases before choosing the better circular answer", () => {
    const { frames } = createHouseRobberIiDryRun([2, 3, 2]);
    const finalFrame = frames[frames.length - 1];
    const firstCaseStart = frames.find((frame) => frame.caseKey === "exclude-last" && frame.kind === "start");

    expect(firstCaseStart?.dp).toEqual([0, 0]);
    expect(frames.some((frame) => frame.caseKey === "exclude-last" && frame.caseResult === 3)).toBe(true);
    expect(frames.some((frame) => frame.caseKey === "exclude-first" && frame.caseResult === 3)).toBe(true);
    expect(finalFrame).toMatchObject({ caseOneResult: 3, caseTwoResult: 3, result: 3 });
  });
});
