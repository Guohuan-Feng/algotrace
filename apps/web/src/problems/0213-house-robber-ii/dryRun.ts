import type { FrameKind } from "../../shared/types";

export type HouseRobberCaseKey = "exclude-last" | "exclude-first" | "final" | "single";

export type HouseRobberIiFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  allHouses: number[];
  houses: number[];
  dp: number[];
  activeIndex: number | null;
  sourceIndexes: number[];
  caseKey: HouseRobberCaseKey;
  caseLabel: string;
  caseResult: number | null;
  caseOneResult: number | null;
  caseTwoResult: number | null;
  result: number | null;
};

export function createHouseRobberIiDryRun(nums: number[]): { frames: HouseRobberIiFrame[] } {
  const frames: HouseRobberIiFrame[] = [];
  let caseOneResult: number | null = null;
  let caseTwoResult: number | null = null;
  const push = (frame: Omit<HouseRobberIiFrame, "allHouses" | "caseOneResult" | "caseTwoResult">) => frames.push({
    ...frame,
    allHouses: [...nums],
    houses: [...frame.houses],
    dp: [...frame.dp],
    sourceIndexes: [...frame.sourceIndexes],
    caseOneResult,
    caseTwoResult,
  });

  if (nums.length === 1) {
    push({ kind: "done", title: `Return ${nums[0]}`, detail: "With one house there is no circular conflict.", activeLines: [5, 6], houses: [...nums], dp: [nums[0]!], activeIndex: 0, sourceIndexes: [], caseKey: "single", caseLabel: "single house", caseResult: nums[0]!, result: nums[0]! });
    return { frames };
  }

  const runCase = (caseKey: "exclude-last" | "exclude-first", houses: number[], label: string) => {
    const dp = Array<number>(houses.length).fill(0);
    push({ kind: "start", title: `Call robLinear(${label})`, detail: "A valid circular solution must exclude either the first house or the last house.", activeLines: [23, 24, 25], houses, dp, activeIndex: null, sourceIndexes: [], caseKey, caseLabel: label, caseResult: null, result: null });

    if (houses.length === 1) {
      const caseResult = houses[0]!;
      push({ kind: "done", title: `Return ${caseResult} from ${label}`, detail: "robLinear returns directly when its sliced array has one element.", activeLines: [11, 12], houses, dp: [caseResult], activeIndex: 0, sourceIndexes: [], caseKey, caseLabel: label, caseResult, result: null });
      return caseResult;
    }

    dp[0] = houses[0]!;
    dp[1] = Math.max(houses[0]!, houses[1]!);
    push({ kind: "build", title: `Seed dp for ${label}`, detail: `dp[0] = ${dp[0]}; dp[1] = max(${houses[0]}, ${houses[1]}) = ${dp[1]}.`, activeLines: [14, 15, 16], houses, dp, activeIndex: 1, sourceIndexes: [0], caseKey, caseLabel: label, caseResult: null, result: null });

    for (let i = 2; i < houses.length; i += 1) {
      const skip = dp[i - 1]!;
      const rob = dp[i - 2]! + houses[i]!;
      dp[i] = Math.max(skip, rob);
      push({ kind: dp[i] === rob ? "found" : "visit", title: dp[i] === rob ? `Rob house ${i}` : `Skip house ${i}`, detail: `max(dp[${i - 1}] = ${skip}, dp[${i - 2}] + ${houses[i]} = ${rob}) = ${dp[i]}.`, activeLines: [18, 19], houses, dp, activeIndex: i, sourceIndexes: [i - 1, i - 2], caseKey, caseLabel: label, caseResult: null, result: null });
    }

    const caseResult = dp[dp.length - 1]!;
    push({ kind: "done", title: `${label} returns ${caseResult}`, detail: "This is the linear maximum after removing one endpoint from the circular street.", activeLines: [21], houses, dp, activeIndex: null, sourceIndexes: [], caseKey, caseLabel: label, caseResult, result: null });
    return caseResult;
  };

  caseOneResult = runCase("exclude-last", nums.slice(0, -1), "nums[:-1]");
  caseTwoResult = runCase("exclude-first", nums.slice(1), "nums[1:]");
  const result = Math.max(caseOneResult, caseTwoResult);
  push({ kind: "done", title: `Return max(${caseOneResult}, ${caseTwoResult}) = ${result}`, detail: "The better of the two endpoint-excluding cases is the answer for the circle.", activeLines: [23, 24, 25], houses: [...nums], dp: [], activeIndex: null, sourceIndexes: [], caseKey: "final", caseLabel: "compare both cases", caseResult: null, result });
  return { frames };
}
