import type { FrameKind } from "../../shared/types";

export type ReverseStringIIFrame = { kind: FrameKind; phase: "start" | "block" | "swap" | "advance" | "done"; title: string; detail: string; activeLines: number[]; chars: string[]; start: number | null; left: number | null; right: number | null; k: number; result: string | null };

export function createReverseStringIIRun(s: string, k: number): { frames: ReverseStringIIFrame[] } {
  const chars = [...s];
  const frames: ReverseStringIIFrame[] = [];
  let start: number | null = null;
  let left: number | null = null;
  let right: number | null = null;
  const push = (frame: Omit<ReverseStringIIFrame, "chars" | "start" | "left" | "right" | "k">) => frames.push({ ...frame, chars: [...chars], start, left, right, k });
  push({ kind: "start", phase: "start", title: "Split the string into 2k blocks", detail: `Only the first ${k} character(s) of each 2k block will reverse.`, activeLines: [3, 4], result: null });
  for (let blockStart = 0; blockStart < chars.length; blockStart += 2 * k) {
    start = blockStart;
    left = blockStart;
    right = Math.min(blockStart + k - 1, chars.length - 1);
    push({ kind: "visit", phase: "block", title: `Start block at index ${blockStart}`, detail: `Reverse indices ${left} through ${right}; then skip to the next 2k block.`, activeLines: [4, 5, 6], result: null });
    while (left < right) {
      const leftChar = chars[left]!;
      const rightChar = chars[right]!;
      [chars[left], chars[right]] = [rightChar, leftChar];
      push({ kind: "build", phase: "swap", title: `Swap ${JSON.stringify(leftChar)} and ${JSON.stringify(rightChar)}`, detail: "The swap stays inside this block's first k positions.", activeLines: [7, 8], result: null });
      left += 1;
      right -= 1;
      push({ kind: "visit", phase: "advance", title: `Move inward to ${left} and ${right}`, detail: "Continue until the two block-local pointers meet.", activeLines: [9, 10], result: null });
    }
  }
  start = null;
  left = null;
  right = null;
  push({ kind: "done", phase: "done", title: "Join the transformed characters", detail: "Every 2k block has contributed its reversed first k characters.", activeLines: [11], result: chars.join("") });
  return { frames };
}
