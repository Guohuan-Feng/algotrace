import type { KSumFrame } from "../../shared/kSum";

export function createFourSumDryRun(input: number[], target: number): { frames: KSumFrame[] } {
  const nums = [...input].sort((left, right) => left - right);
  const frames: KSumFrame[] = [];
  const results: number[][] = [];
  const snapshot = (frame: Omit<KSumFrame, "k" | "target" | "nums" | "results">) => frames.push({ ...frame, k: 4, target, nums: [...nums], results: results.map((result) => [...result]) });

  snapshot({ kind: "start", phase: "initialize", title: "Sort before selecting four values", detail: "The two final values can now move monotonically after i and j are fixed.", activeLines: [2, 3], anchors: [], left: null, right: null, total: null, result: null });
  for (let i = 0; i < nums.length - 3; i += 1) {
    if (i > 0 && nums[i] === nums[i - 1]) {
      snapshot({ kind: "prune", phase: "skip", title: "Skip a duplicate i anchor", detail: nums[i] + " already opened a previous scan.", activeLines: [5, 6, 7], anchors: [i], left: null, right: null, total: null, result: null });
      continue;
    }
    for (let j = i + 1; j < nums.length - 2; j += 1) {
      if (j > i + 1 && nums[j] === nums[j - 1]) {
        snapshot({ kind: "prune", phase: "skip", title: "Skip a duplicate j anchor", detail: "This second anchor would repeat the same two-pointer search.", activeLines: [8, 9, 10], anchors: [i, j], left: null, right: null, total: null, result: null });
        continue;
      }
      let left = j + 1;
      let right = nums.length - 1;
      snapshot({ kind: "visit", phase: "anchor", title: "Fix the first two values", detail: "i = " + nums[i] + " and j = " + nums[j] + "; scan the remaining interval with left and right.", activeLines: [8, 11], anchors: [i, j], left, right, total: null, result: null });
      while (left < right) {
        const total = nums[i]! + nums[j]! + nums[left]! + nums[right]!;
        snapshot({ kind: "visit", phase: "inspect", title: "Compare the current quadruplet", detail: nums[i] + " + " + nums[j] + " + " + nums[left] + " + " + nums[right] + " = " + total + ".", activeLines: [12, 13], anchors: [i, j], left, right, total, result: null });
        if (total < target) {
          left += 1;
          snapshot({ kind: "build", phase: "move-left", title: "Increase the total", detail: total + " is below target " + target + ", so advance left.", activeLines: [14, 15], anchors: [i, j], left, right, total, result: null });
        } else if (total > target) {
          right -= 1;
          snapshot({ kind: "build", phase: "move-right", title: "Decrease the total", detail: total + " is above target " + target + ", so move right leftward.", activeLines: [16, 17], anchors: [i, j], left, right, total, result: null });
        } else {
          const answer = [nums[i]!, nums[j]!, nums[left]!, nums[right]!];
          results.push(answer);
          snapshot({ kind: "found", phase: "found", title: "Record a target-sum quadruplet", detail: "[" + answer.join(", ") + "] sums to " + target + ".", activeLines: [18, 19], anchors: [i, j], left, right, total, result: null });
          left += 1;
          right -= 1;
          while (left < right && nums[left] === nums[left - 1]) {
            left += 1;
            snapshot({ kind: "prune", phase: "skip", title: "Skip a duplicate left value", detail: "The next equal left value would repeat the same quadruplet.", activeLines: [22, 23], anchors: [i, j], left, right, total, result: null });
          }
        }
      }
    }
  }
  snapshot({ kind: "done", phase: "done", title: "Return all unique quadruplets", detail: "The scan found " + results.length + " unique quadruplet" + (results.length === 1 ? "" : "s") + ".", activeLines: [24], anchors: [], left: null, right: null, total: null, result: results.map((result) => [...result]) });
  return { frames };
}
