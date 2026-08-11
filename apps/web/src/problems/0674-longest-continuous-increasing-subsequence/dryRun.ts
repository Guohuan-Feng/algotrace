import type { FrameKind } from "../../shared/types";

export type LcisFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  nums: number[];
  dp: number[];
  i: number | null;
  previous: number | null;
  result: number | null;
};

export function createLcisDryRun(nums: number[]): { frames: LcisFrame[] } {
  const frames: LcisFrame[] = [];
  const dp = Array(nums.length).fill(1);
  const push = (frame: Omit<LcisFrame, "nums" | "dp">) => frames.push({ ...frame, nums: [...nums], dp: [...dp] });

  push({ kind: "start", title: "Check empty input", detail: nums.length ? "nums is not empty, continue." : "nums is empty, return 0.", activeLines: [5, 6], i: null, previous: null, result: nums.length ? null : 0 });
  if (!nums.length) return { frames };

  push({ kind: "build", title: "Initialize dp", detail: "Every position starts with LCIS length 1.", activeLines: [8, 9], i: null, previous: null, result: null });

  for (let i = 1; i < nums.length; i += 1) {
    push({ kind: "visit", title: `Compare ${i - 1} -> ${i}`, detail: `Check whether ${nums[i - 1]} < ${nums[i]}.`, activeLines: [11, 12], i, previous: i - 1, result: null });
    if (nums[i - 1] < nums[i]) {
      dp[i] = dp[i - 1] + 1;
      push({ kind: "build", title: "Extend increasing run", detail: `dp[${i}] = dp[${i - 1}] + 1 = ${dp[i]}.`, activeLines: [13], i, previous: i - 1, result: null });
    } else {
      dp[i] = 1;
      push({ kind: "prune", title: "Reset run", detail: `${nums[i - 1]} is not < ${nums[i]}, so dp[${i}] = 1.`, activeLines: [14, 15], i, previous: i - 1, result: null });
    }
  }

  push({ kind: "done", title: "Return max(dp)", detail: `The longest continuous increasing run is ${Math.max(...dp)}.`, activeLines: [17], i: null, previous: null, result: Math.max(...dp) });
  return { frames };
}
