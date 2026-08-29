import type { FrameKind } from "../../shared/types";

export type HappyNumberFrame = {
  kind: FrameKind;
  phase: "start" | "inspect" | "remember" | "transform" | "happy" | "cycle" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  current: number;
  digits: number[];
  next: number | null;
  seen: number[];
  result: boolean | null;
};

export function createHappyNumberDryRun(input: number): { frames: HappyNumberFrame[] } {
  const frames: HappyNumberFrame[] = [];
  const seen = new Set<number>();
  let current = input;
  const digits = () => String(current).split("").map(Number);
  const snapshot = (frame: Omit<HappyNumberFrame, "current" | "digits" | "seen">) => frames.push({ ...frame, current, digits: digits(), seen: [...seen] });

  snapshot({ kind: "start", phase: "start", title: "Start the square-sum sequence", detail: "A happy number eventually reaches 1. A repeated value means the sequence is trapped in a loop.", activeLines: [2], next: null, result: null });
  while (current !== 1 && !seen.has(current)) {
    snapshot({ kind: "visit", phase: "inspect", title: `Inspect n = ${current}`, detail: "Check whether this number has appeared in the sequence before.", activeLines: [4], next: null, result: null });
    seen.add(current);
    snapshot({ kind: "build", phase: "remember", title: `Add ${current} to seen`, detail: "Store the current number so revisiting it can detect a cycle.", activeLines: [5], next: null, result: null });
    const value = digits().reduce((sum, digit) => sum + digit * digit, 0);
    snapshot({ kind: "build", phase: "transform", title: `${current} becomes ${value}`, detail: `${digits().map((digit) => `${digit}²`).join(" + ")} = ${value}.`, activeLines: [6], next: value, result: null });
    current = value;
  }
  if (current === 1) {
    snapshot({ kind: "found", phase: "happy", title: "Reach 1", detail: "The sequence reaches 1, so the original number is happy.", activeLines: [8], next: null, result: true });
    return { frames };
  }
  snapshot({ kind: "prune", phase: "cycle", title: `Detect repeated value ${current}`, detail: `${current} is already in seen, so repeating the transformation would never reach 1.`, activeLines: [4], next: null, result: false });
  snapshot({ kind: "done", phase: "done", title: "Return false", detail: "A cycle was found, so the number is not happy.", activeLines: [8], next: null, result: false });
  return { frames };
}
