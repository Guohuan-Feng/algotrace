import type { FrameKind } from "../../shared/types";

export type LongestSubstringFrame = {
  kind: FrameKind;
  phase: "initialize" | "inspect" | "remove" | "add" | "best" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  left: number;
  right: number;
  char: string | null;
  removed: string | null;
  chars: string[];
  maxLength: number;
  result: number | null;
};

export function createLongestSubstringDryRun(text: string): { frames: LongestSubstringFrame[] } {
  const chars = new Set<string>();
  const frames: LongestSubstringFrame[] = [];
  let left = 0;
  let maxLength = 0;
  const snapshot = (frame: Omit<LongestSubstringFrame, "left" | "chars" | "maxLength">) => frames.push({ ...frame, left, chars: [...chars], maxLength });

  snapshot({ kind: "start", phase: "initialize", title: "Start an empty unique-character set", detail: "The window between left and right will contain no repeated character.", activeLines: [2, 3], right: -1, char: null, removed: null, result: null });
  [...text].forEach((char, right) => {
    snapshot({ kind: "visit", phase: "inspect", title: `Inspect ${JSON.stringify(char)} at ${right}`, detail: `Check whether ${JSON.stringify(char)} is already inside the current window.`, activeLines: [4, 5], right, char, removed: null, result: null });
    while (chars.has(char)) {
      const removed = text[left]!;
      chars.delete(removed);
      left += 1;
      snapshot({ kind: "prune", phase: "remove", title: `Remove ${JSON.stringify(removed)} from the left`, detail: `The duplicate ${JSON.stringify(char)} requires moving left to ${left}.`, activeLines: [6, 7, 8], right, char, removed, result: null });
    }
    chars.add(char);
    snapshot({ kind: "build", phase: "add", title: `Add ${JSON.stringify(char)} to the window`, detail: `The window is now ${JSON.stringify(text.slice(left, right + 1))}.`, activeLines: [9], right, char, removed: null, result: null });
    const length = right - left + 1;
    if (length > maxLength) {
      maxLength = length;
      snapshot({ kind: "found", phase: "best", title: `New longest length ${maxLength}`, detail: `${JSON.stringify(text.slice(left, right + 1))} is the longest unique window so far.`, activeLines: [10], right, char, removed: null, result: null });
    }
  });
  snapshot({ kind: "done", phase: "done", title: "Return the longest length", detail: `The longest substring without repeated characters has length ${maxLength}.`, activeLines: [11], right: text.length - 1, char: null, removed: null, result: maxLength });
  return { frames };
}
