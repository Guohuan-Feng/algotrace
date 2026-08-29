import type { FrameKind } from "../../shared/types";

export type FirstOccurrenceFrame = {
  kind: FrameKind;
  phase: "initialize" | "align" | "compare" | "mismatch" | "found" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  haystack: string;
  needle: string;
  start: number | null;
  offset: number | null;
  result: number | null;
};

export function createFirstOccurrenceDryRun(haystack: string, needle: string): { frames: FirstOccurrenceFrame[] } {
  const frames: FirstOccurrenceFrame[] = [];
  const snapshot = (frame: Omit<FirstOccurrenceFrame, "haystack" | "needle">) => frames.push({ ...frame, haystack, needle });
  if (!needle) {
    snapshot({ kind: "done", phase: "done", title: "Empty needle matches at zero", detail: "The empty string starts at index 0.", activeLines: [2, 3], start: 0, offset: null, result: 0 });
    return { frames };
  }
  snapshot({ kind: "start", phase: "initialize", title: "Try each possible starting index", detail: "The needle has length " + needle.length + ", so it can start from 0 through " + Math.max(-1, haystack.length - needle.length) + ".", activeLines: [5], start: null, offset: null, result: null });
  for (let start = 0; start <= haystack.length - needle.length; start += 1) {
    snapshot({ kind: "visit", phase: "align", title: "Align needle at " + start, detail: "Compare " + JSON.stringify(needle) + " with haystack[" + start + ":" + (start + needle.length) + "].", activeLines: [5, 6], start, offset: null, result: null });
    let matched = true;
    for (let offset = 0; offset < needle.length; offset += 1) {
      const haystackIndex = start + offset;
      snapshot({ kind: "visit", phase: "compare", title: "Compare one character", detail: "haystack[" + haystackIndex + "] = " + JSON.stringify(haystack[haystackIndex]) + "; needle[" + offset + "] = " + JSON.stringify(needle[offset]) + ".", activeLines: [7, 8], start, offset, result: null });
      if (haystack[haystackIndex] !== needle[offset]) {
        matched = false;
        snapshot({ kind: "prune", phase: "mismatch", title: "Mismatch, shift the alignment", detail: "These characters differ, so this start position cannot match.", activeLines: [8, 9, 10], start, offset, result: null });
        break;
      }
    }
    if (matched) {
      snapshot({ kind: "found", phase: "found", title: "Needle found", detail: JSON.stringify(needle) + " first appears at index " + start + ".", activeLines: [11, 12], start, offset: needle.length - 1, result: start });
      return { frames };
    }
  }
  snapshot({ kind: "done", phase: "done", title: "No alignment matched", detail: "Every possible start contains a mismatch, so return -1.", activeLines: [13], start: null, offset: null, result: -1 });
  return { frames };
}
