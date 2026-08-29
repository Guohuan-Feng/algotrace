import type { FrameKind } from "../../shared/types";

export type MinimumWindowFrame = {
  kind: FrameKind;
  phase: "initialize" | "extend" | "satisfy" | "best" | "shrink" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  left: number;
  right: number;
  char: string | null;
  removed: string | null;
  formed: number;
  required: number;
  need: Record<string, number>;
  windowCounts: Record<string, number>;
  best: [number, number] | null;
  candidate: string | null;
  result: string | null;
};

export function createMinimumWindowDryRun(source: string, target: string): { frames: MinimumWindowFrame[] } {
  const need: Record<string, number> = {};
  [...target].forEach((char) => { need[char] = (need[char] ?? 0) + 1; });
  const counts: Record<string, number> = {};
  const frames: MinimumWindowFrame[] = [];
  const required = Object.keys(need).length;
  let formed = 0;
  let left = 0;
  let best: [number, number] | null = null;
  const snapshot = (frame: Omit<MinimumWindowFrame, "left" | "formed" | "required" | "need" | "windowCounts" | "best">) => frames.push({ ...frame, left, formed, required, need: { ...need }, windowCounts: { ...counts }, best: best ? [...best] as [number, number] : null });

  snapshot({ kind: "start", phase: "initialize", title: "Count the target characters", detail: `A valid window must satisfy ${JSON.stringify(need)}.`, activeLines: [2, 3, 4], right: -1, char: null, removed: null, candidate: null, result: null });

  [...source].forEach((char, right) => {
    counts[char] = (counts[char] ?? 0) + 1;
    snapshot({ kind: "visit", phase: "extend", title: `Extend right to ${JSON.stringify(char)}`, detail: `Include source[${right}] and update its count.`, activeLines: [5, 6], right, char, removed: null, candidate: null, result: null });
    if (need[char] !== undefined && counts[char] === need[char]) {
      formed += 1;
      snapshot({ kind: "found", phase: "satisfy", title: `${JSON.stringify(char)} now satisfies its target count`, detail: `formed = ${formed} of ${required} required character types.`, activeLines: [7, 8], right, char, removed: null, candidate: null, result: null });
    }
    while (formed === required) {
      const candidate = source.slice(left, right + 1);
      if (best === null || candidate.length < best[1] - best[0] + 1) {
        best = [left, right];
        snapshot({ kind: "found", phase: "best", title: `Best window becomes ${JSON.stringify(candidate)}`, detail: `It covers [${left}, ${right}] and is the shortest valid window seen so far.`, activeLines: [9, 10, 11], right, char, removed: null, candidate, result: null });
      }
      const removed = source[left]!;
      counts[removed] -= 1;
      if (need[removed] !== undefined && counts[removed] < need[removed]) formed -= 1;
      left += 1;
      snapshot({ kind: "backtrack", phase: "shrink", title: `Shrink from left, remove ${JSON.stringify(removed)}`, detail: `Move left to ${left}; formed = ${formed} of ${required}.`, activeLines: [12, 13, 14, 15], right, char, removed, candidate: source.slice(left, right + 1), result: null });
    }
  });

  const result = best ? source.slice(best[0], best[1] + 1) : "";
  snapshot({ kind: "done", phase: "done", title: "Return the shortest valid window", detail: result ? `The best window is ${JSON.stringify(result)}.` : "No substring contains every target character.", activeLines: [16], right: source.length - 1, char: null, removed: null, candidate: result || null, result });
  return { frames };
}
