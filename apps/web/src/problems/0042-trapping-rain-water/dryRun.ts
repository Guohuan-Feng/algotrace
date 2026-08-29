import type { FrameKind } from "../../shared/types";

export type TrappingRainWaterFrame = {
  kind: FrameKind;
  phase: "initialize" | "inspect" | "collect" | "move" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  height: number[];
  left: number;
  right: number;
  current: number | null;
  leftMax: number;
  rightMax: number;
  added: number | null;
  water: number;
  waterLevels: number[];
  result: number | null;
};

export function createTrappingRainWaterDryRun(height: number[]): { frames: TrappingRainWaterFrame[] } {
  const frames: TrappingRainWaterFrame[] = [];
  const waterLevels = Array.from({ length: height.length }, () => 0);
  let left = 0;
  let right = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let water = 0;

  const snapshot = (frame: Omit<TrappingRainWaterFrame, "height" | "left" | "right" | "leftMax" | "rightMax" | "water" | "waterLevels">) => {
    frames.push({ ...frame, height: [...height], left, right, leftMax, rightMax, water, waterLevels: [...waterLevels] });
  };

  snapshot({
    kind: "start",
    phase: "initialize",
    title: "Start with two boundary pointers",
    detail: "left and right scan inward. The shorter side decides which maximum can safely determine trapped water.",
    activeLines: [2, 3, 4, 5],
    current: null,
    added: null,
    result: null,
  });

  while (left <= right) {
    const current = height[left]! <= height[right]! ? left : right;
    const side = current === left ? "left" : "right";
    snapshot({
      kind: "visit",
      phase: "inspect",
      title: "Use the shorter " + side + " boundary",
      detail: "height[" + left + "] = " + height[left] + " and height[" + right + "] = " + height[right] + ". Process index " + current + " from the " + side + " side.",
      activeLines: [7, 8],
      current,
      added: null,
      result: null,
    });

    if (current === left) {
      leftMax = Math.max(leftMax, height[left]!);
      const added = leftMax - height[left]!;
      water += added;
      waterLevels[left] = added;
      snapshot({
        kind: added > 0 ? "found" : "build",
        phase: "collect",
        title: added > 0 ? "Trap " + added + " unit" + (added === 1 ? "" : "s") + " above index " + left : "Raise left_max to " + leftMax,
        detail: "left_max = " + leftMax + ". Water above this bar is " + leftMax + " - " + height[left] + " = " + added + ", so total water is " + water + ".",
        activeLines: [9, 10, 11],
        current: left,
        added,
        result: null,
      });
      left += 1;
    } else {
      rightMax = Math.max(rightMax, height[right]!);
      const added = rightMax - height[right]!;
      water += added;
      waterLevels[right] = added;
      snapshot({
        kind: added > 0 ? "found" : "build",
        phase: "collect",
        title: added > 0 ? "Trap " + added + " unit" + (added === 1 ? "" : "s") + " above index " + right : "Raise right_max to " + rightMax,
        detail: "right_max = " + rightMax + ". Water above this bar is " + rightMax + " - " + height[right] + " = " + added + ", so total water is " + water + ".",
        activeLines: [13, 14, 15],
        current: right,
        added,
        result: null,
      });
      right -= 1;
    }

    snapshot({
      kind: "build",
      phase: "move",
      title: "Move the " + side + " pointer inward",
      detail: "The processed boundary cannot contribute again. Continue with left = " + left + " and right = " + right + ".",
      activeLines: [12, 16],
      current: null,
      added: null,
      result: null,
    });
  }

  snapshot({
    kind: "done",
    phase: "done",
    title: "Return total trapped rain water",
    detail: "All bars have been processed. The sum of every trapped segment is " + water + ".",
    activeLines: [18],
    current: null,
    added: null,
    result: water,
  });

  return { frames };
}
