import type { KSumFrame } from "../../shared/kSum";

export function createThreeSumDryRun(input: number[]): { frames: KSumFrame[] } {
  const nums = [...input].sort((left, right) => left - right);
  const frames: KSumFrame[] = [];
  const results: number[][] = [];
  const snapshot = (frame: Omit<KSumFrame, "k" | "target" | "nums" | "results">) => frames.push({ ...frame, k: 3, target: 0, nums: [...nums], results: results.map((result) => [...result]) });

  snapshot({ kind: "start", phase: "initialize", title: "Sort the numbers", detail: "Sorting gives each fixed value a monotone left/right search space.", activeLines: [2, 3], anchors: [], left: null, right: null, total: null, result: null });
  for (let i = 0; i < nums.length - 2; i += 1) {
    if (i > 0 && nums[i] === nums[i - 1]) {
      snapshot({ kind: "prune", phase: "skip", title: "Skip a duplicate anchor", detail: nums[i] + " already served as the first value, so using it again would repeat answers.", activeLines: [5, 6, 7], anchors: [i], left: null, right: null, total: null, result: null });
      continue;
    }
    let left = i + 1;
    let right = nums.length - 1;
    snapshot({ kind: "visit", phase: "anchor", title: "Fix " + nums[i] + " as the first value", detail: "Search the remaining sorted range with opposite pointers.", activeLines: [5, 8], anchors: [i], left, right, total: null, result: null });
    while (left < right) {
      const total = nums[i]! + nums[left]! + nums[right]!;
      snapshot({ kind: "visit", phase: "inspect", title: "Add the three selected values", detail: nums[i] + " + " + nums[left] + " + " + nums[right] + " = " + total + ".", activeLines: [9, 10], anchors: [i], left, right, total, result: null });
      if (total < 0) {
        left += 1;
        snapshot({ kind: "build", phase: "move-left", title: "Increase the sum", detail: "The sum is too small, so move left rightward to a value that can only be larger.", activeLines: [11, 12], anchors: [i], left, right, total, result: null });
      } else if (total > 0) {
        right -= 1;
        snapshot({ kind: "build", phase: "move-right", title: "Decrease the sum", detail: "The sum is too large, so move right leftward to a value that can only be smaller.", activeLines: [13, 14], anchors: [i], left, right, total, result: null });
      } else {
        const answer = [nums[i]!, nums[left]!, nums[right]!];
        results.push(answer);
        snapshot({ kind: "found", phase: "found", title: "Record a zero-sum triplet", detail: "[" + answer.join(", ") + "] is a unique answer.", activeLines: [15, 16], anchors: [i], left, right, total, result: null });
        left += 1;
        right -= 1;
        while (left < right && nums[left] === nums[left - 1]) {
          left += 1;
          snapshot({ kind: "prune", phase: "skip", title: "Skip a duplicate left value", detail: "Moving past the repeated value prevents the same triplet from being added twice.", activeLines: [19, 20], anchors: [i], left, right, total, result: null });
        }
      }
    }
  }
  snapshot({ kind: "done", phase: "done", title: "Return all unique triplets", detail: "The sorted two-pointer scans found " + results.length + " unique triplet" + (results.length === 1 ? "" : "s") + ".", activeLines: [21], anchors: [], left: null, right: null, total: null, result: results.map((result) => [...result]) });
  return { frames };
}
