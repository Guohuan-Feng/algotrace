import type { FrameKind } from "../../shared/types";

export type LongestCommonPrefixFrame = {
  kind: FrameKind;
  phase: "initialize" | "compare" | "shrink" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  words: string[];
  wordIndex: number | null;
  prefix: string;
  result: string | null;
};

export function createLongestCommonPrefixDryRun(words: string[]): { frames: LongestCommonPrefixFrame[] } {
  const frames: LongestCommonPrefixFrame[] = [];
  let prefix = words[0] ?? "";
  const snapshot = (frame: Omit<LongestCommonPrefixFrame, "words" | "prefix">) => frames.push({ ...frame, words: [...words], prefix });

  if (!words.length) {
    snapshot({ kind: "done", phase: "done", title: "Return an empty prefix", detail: "There are no strings, so the common prefix is empty.", activeLines: [2, 3], wordIndex: null, result: "" });
    return { frames };
  }

  snapshot({ kind: "start", phase: "initialize", title: "Use the first word as the candidate", detail: JSON.stringify(prefix) + " is the longest possible prefix before comparing the other words.", activeLines: [5], wordIndex: 0, result: null });

  for (let wordIndex = 1; wordIndex < words.length; wordIndex += 1) {
    const word = words[wordIndex]!;
    snapshot({ kind: "visit", phase: "compare", title: "Compare against " + JSON.stringify(word), detail: "Check whether " + JSON.stringify(word) + " starts with the current candidate " + JSON.stringify(prefix) + ".", activeLines: [6, 7], wordIndex, result: null });
    while (!word.startsWith(prefix)) {
      const previous = prefix;
      prefix = prefix.slice(0, -1);
      snapshot({ kind: "prune", phase: "shrink", title: "Shorten the prefix", detail: JSON.stringify(word) + " does not start with " + JSON.stringify(previous) + ", so remove its final character.", activeLines: [7, 8], wordIndex, result: null });
    }
  }

  snapshot({ kind: "done", phase: "done", title: "Return the shared prefix", detail: JSON.stringify(prefix) + " is the longest starting sequence shared by every string.", activeLines: [9], wordIndex: null, result: prefix });
  return { frames };
}
