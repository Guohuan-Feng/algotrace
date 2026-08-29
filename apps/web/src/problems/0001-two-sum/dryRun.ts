import type { FrameKind } from "../../shared/types";

export type TwoSumFrame = {
  kind: FrameKind;
  phase: "initialize" | "inspect" | "store" | "match" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  index: number | null;
  value: number | null;
  complement: number | null;
  seen: Record<number, number>;
  result: [number, number] | null;
};

export function createTwoSumDryRun(nums: number[], target: number): { frames: TwoSumFrame[] } {
  const seen: Record<number, number> = {};
  const frames: TwoSumFrame[] = [];
  const snapshot = (frame: Omit<TwoSumFrame, "seen">) => frames.push({ ...frame, seen: { ...seen } });

  snapshot({ kind: "start", phase: "initialize", title: "Create an empty value-to-index map", detail: "The map remembers every number we have already passed.", activeLines: [2], index: null, value: null, complement: null, result: null });
  for (let index = 0; index < nums.length; index += 1) {
    const value = nums[index]!;
    const complement = target - value;
    snapshot({ kind: "visit", phase: "inspect", title: `Read nums[${index}] = ${value}`, detail: `The needed complement is ${target} - ${value} = ${complement}.`, activeLines: [3, 4], index, value, complement, result: null });
    if (seen[complement] !== undefined) {
      const result: [number, number] = [seen[complement]!, index];
      snapshot({ kind: "found", phase: "match", title: `Found complement ${complement}`, detail: `${complement} was stored at index ${result[0]}, so indices [${result.join(", ")}] add to ${target}.`, activeLines: [5, 6], index, value, complement, result });
      snapshot({ kind: "done", phase: "done", title: "Return the matching indices", detail: `Return [${result.join(", ")}].`, activeLines: [6], index: null, value: null, complement: null, result });
      return { frames };
    }
    seen[value] = index;
    snapshot({ kind: "build", phase: "store", title: `Store ${value} -> ${index}`, detail: `No complement yet, so future values can pair with ${value}.`, activeLines: [7], index, value, complement, result: null });
  }
  snapshot({ kind: "done", phase: "done", title: "No pair found", detail: "Every number was stored without finding its complement.", activeLines: [8], index: null, value: null, complement: null, result: null });
  return { frames };
}
