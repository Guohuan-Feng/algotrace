import type { FrameKind } from "../../shared/types";

export type ContainerWaterFrame = {
  kind: FrameKind;
  phase: "initialize" | "inspect" | "best" | "move-left" | "move-right" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  heights: number[];
  left: number;
  right: number;
  width: number | null;
  containerHeight: number | null;
  area: number | null;
  maxArea: number;
  result: number | null;
};

export function createContainerWaterDryRun(heights: number[]): { frames: ContainerWaterFrame[] } {
  const frames: ContainerWaterFrame[] = [];
  let left = 0;
  let right = heights.length - 1;
  let maxArea = 0;

  const snapshot = (frame: Omit<ContainerWaterFrame, "heights" | "left" | "right" | "maxArea">) => {
    frames.push({ ...frame, heights: [...heights], left, right, maxArea });
  };

  snapshot({
    kind: "start",
    phase: "initialize",
    title: "Start with the widest container",
    detail: "Put left and right at the two outer bars. This is the widest possible pair.",
    activeLines: [2, 3],
    width: null,
    containerHeight: null,
    area: null,
    result: null,
  });

  while (left < right) {
    const width = right - left;
    const containerHeight = Math.min(heights[left]!, heights[right]!);
    const area = width * containerHeight;

    snapshot({
      kind: "visit",
      phase: "inspect",
      title: "Measure the current container",
      detail: "width = " + right + " - " + left + " = " + width + "; height = min(" + heights[left] + ", " + heights[right] + ") = " + containerHeight + "; area = " + area + ".",
      activeLines: [5, 6, 7],
      width,
      containerHeight,
      area,
      result: null,
    });

    if (area > maxArea) {
      maxArea = area;
      snapshot({
        kind: "found",
        phase: "best",
        title: "Record a new maximum area",
        detail: area + " is larger than every earlier container, so max_area becomes " + maxArea + ".",
        activeLines: [8],
        width,
        containerHeight,
        area,
        result: null,
      });
    }

    if (heights[left]! < heights[right]!) {
      const previous = left;
      left += 1;
      snapshot({
        kind: "build",
        phase: "move-left",
        title: "Move the shorter left bar inward",
        detail: "The left bar at " + previous + " has height " + heights[previous] + ". Keeping it cannot improve the limiting height, so advance left to " + left + ".",
        activeLines: [10, 11],
        width,
        containerHeight,
        area,
        result: null,
      });
    } else {
      const previous = right;
      right -= 1;
      snapshot({
        kind: "build",
        phase: "move-right",
        title: "Move the shorter right bar inward",
        detail: "The right bar at " + previous + " has height " + heights[previous] + ". Keeping it cannot improve the limiting height, so move right to " + right + ".",
        activeLines: [12, 13],
        width,
        containerHeight,
        area,
        result: null,
      });
    }
  }

  snapshot({
    kind: "done",
    phase: "done",
    title: "Return the largest area seen",
    detail: "The pointers meet after checking every promising pair. The answer is " + maxArea + ".",
    activeLines: [15],
    width: null,
    containerHeight: null,
    area: null,
    result: maxArea,
  });

  return { frames };
}
