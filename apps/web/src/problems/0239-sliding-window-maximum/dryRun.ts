import type { FrameKind } from "../../shared/types";

export type SlidingWindowMaximumFrame = {
  kind: FrameKind;
  phase: "initialize" | "inspect" | "expire" | "discard" | "enqueue" | "record" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  index: number | null;
  value: number | null;
  removedIndex: number | null;
  deque: number[];
  window: [number, number] | null;
  result: number[];
};

export function createSlidingWindowMaximumDryRun(nums: number[], k: number): { frames: SlidingWindowMaximumFrame[] } {
  const deque: number[] = [];
  const result: number[] = [];
  const frames: SlidingWindowMaximumFrame[] = [];
  const snapshot = (frame: Omit<SlidingWindowMaximumFrame, "deque" | "result">) => frames.push({ ...frame, deque: [...deque], result: [...result] });

  snapshot({ kind: "start", phase: "initialize", title: "Start an empty decreasing deque", detail: "The deque stores indices whose values are still candidates for the maximum.", activeLines: [2, 3], index: null, value: null, removedIndex: null, window: null });

  nums.forEach((value, index) => {
    const window: [number, number] = [Math.max(0, index - k + 1), index];
    snapshot({ kind: "visit", phase: "inspect", title: `Read nums[${index}] = ${value}`, detail: `The current window will cover indices ${window[0]} through ${window[1]}.`, activeLines: [4], index, value, removedIndex: null, window });
    if (deque.length && deque[0]! <= index - k) {
      const removedIndex = deque.shift()!;
      snapshot({ kind: "prune", phase: "expire", title: `Remove expired index ${removedIndex}`, detail: `Index ${removedIndex} is left of the window, so it can no longer be its maximum.`, activeLines: [5, 6], index, value, removedIndex, window });
    }
    while (deque.length && nums[deque[deque.length - 1]!]! < value) {
      const removedIndex = deque.pop()!;
      snapshot({ kind: "prune", phase: "discard", title: `Discard smaller index ${removedIndex}`, detail: `${nums[removedIndex]} < ${value}; the newer value stays in every future window at least as long.`, activeLines: [7, 8], index, value, removedIndex, window });
    }
    deque.push(index);
    snapshot({ kind: "build", phase: "enqueue", title: `Append index ${index}`, detail: "The deque remains decreasing by value from front to back.", activeLines: [9], index, value, removedIndex: null, window });
    if (index >= k - 1) {
      const maximum = nums[deque[0]!]!;
      result.push(maximum);
      snapshot({ kind: "found", phase: "record", title: `Record window maximum ${maximum}`, detail: `The front index ${deque[0]} has the largest value in window [${window[0]}, ${window[1]}].`, activeLines: [10, 11], index, value, removedIndex: null, window });
    }
  });

  snapshot({ kind: "done", phase: "done", title: "Return all window maxima", detail: `The maximum for every complete window is [${result.join(", ")}].`, activeLines: [12], index: null, value: null, removedIndex: null, window: null });
  return { frames };
}
