import type { FrameKind } from "../../shared/types";

export type TwoSumSortedFrame = { kind: FrameKind; phase: "start" | "inspect" | "move-left" | "move-right" | "found" | "done"; title: string; detail: string; activeLines: number[]; left: number; right: number; sum: number | null; result: [number, number] | null };

export function createTwoSumSortedDryRun(numbers: number[], target: number): { frames: TwoSumSortedFrame[] } {
  const frames: TwoSumSortedFrame[] = []; let left = 0; let right = numbers.length - 1;
  const snapshot = (frame: Omit<TwoSumSortedFrame, "left" | "right">) => frames.push({ ...frame, left, right });
  snapshot({ kind: "start", phase: "start", title: "Start at both sorted ends", detail: "The smallest remaining value is at left and the largest is at right.", activeLines: [2, 3], sum: null, result: null });
  while (left < right) {
    const sum = numbers[left]! + numbers[right]!;
    snapshot({ kind: "visit", phase: "inspect", title: `Check ${numbers[left]} + ${numbers[right]} = ${sum}`, detail: `Compare the current pair sum with target = ${target}.`, activeLines: [5, 6], sum, result: null });
    if (sum === target) { const result: [number, number] = [left + 1, right + 1]; snapshot({ kind: "found", phase: "found", title: "Return one-indexed positions", detail: `numbers[${left}] + numbers[${right}] equals target, so return ${JSON.stringify(result)}.`, activeLines: [8], sum, result }); return { frames }; }
    if (sum < target) { left += 1; snapshot({ kind: "build", phase: "move-left", title: "Sum is too small: move left rightward", detail: "Only a larger left value can increase the sum because the array is sorted.", activeLines: [9, 10], sum, result: null }); }
    else { right -= 1; snapshot({ kind: "build", phase: "move-right", title: "Sum is too large: move right leftward", detail: "Only a smaller right value can decrease the sum because the array is sorted.", activeLines: [11, 12], sum, result: null }); }
  }
  snapshot({ kind: "done", phase: "done", title: "No pair remains", detail: "The pointers meet without forming the target sum.", activeLines: [14], sum: null, result: null }); return { frames };
}
