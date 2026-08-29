import type { FrameKind } from "../../shared/types";

export type ReverseStringFrame = {
  kind: FrameKind;
  phase: "start" | "compare" | "swap" | "advance" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  chars: string[];
  left: number | null;
  right: number | null;
  result: string[] | null;
};

export function createReverseStringDryRun(input: string[]): { frames: ReverseStringFrame[] } {
  const chars = [...input];
  const frames: ReverseStringFrame[] = [];
  let left = 0; let right = chars.length - 1;
  const push = (frame: Omit<ReverseStringFrame, "chars" | "left" | "right">) => frames.push({ ...frame, chars: [...chars], left, right });
  push({ kind: "start", phase: "start", title: "Place two pointers at the ends", detail: "Each swap fixes one matching pair in its final reversed positions.", activeLines: [3], result: null });
  while (left < right) {
    push({ kind: "visit", phase: "compare", title: `Compare s[${left}] and s[${right}]`, detail: `The next pair is ${JSON.stringify(chars[left])} and ${JSON.stringify(chars[right])}.`, activeLines: [5], result: null });
    const fromLeft = chars[left]!; const fromRight = chars[right]!;
    [chars[left], chars[right]] = [chars[right]!, chars[left]!];
    push({ kind: "build", phase: "swap", title: `Swap ${JSON.stringify(fromLeft)} with ${JSON.stringify(fromRight)}`, detail: "The two characters change places in the same array; no extra output array is needed.", activeLines: [6], result: null });
    left += 1; right -= 1;
    push({ kind: "visit", phase: "advance", title: `Move inward to ${left} and ${right}`, detail: "Everything outside the pointers has already reached its final position.", activeLines: [7, 8], result: null });
  }
  push({ kind: "done", phase: "done", title: "Pointers meet: reversal complete", detail: "The whole character array has been reversed in place.", activeLines: [5], result: [...chars] });
  return { frames };
}
