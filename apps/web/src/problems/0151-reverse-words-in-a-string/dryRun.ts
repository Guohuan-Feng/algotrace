import type { FrameKind } from "../../shared/types";

export type ReverseWordsFrame = {
  kind: FrameKind;
  phase: "start" | "split" | "reverse" | "join" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  words: string[];
  result: string | null;
};

export function createReverseWordsDryRun(input: string): { frames: ReverseWordsFrame[] } {
  const frames: ReverseWordsFrame[] = [];
  let words: string[] = [];
  let result: string | null = null;
  const snapshot = (frame: Omit<ReverseWordsFrame, "words" | "result">) => frames.push({ ...frame, words: [...words], result });

  snapshot({ kind: "start", phase: "start", title: "Read the original string", detail: "The result needs exactly one space between words and no leading or trailing spaces.", activeLines: [2], });
  words = input.split(/\s+/).filter(Boolean);
  snapshot({ kind: "build", phase: "split", title: "Split into words", detail: `split() ignores repeated whitespace and produces ${JSON.stringify(words)}.`, activeLines: [3], });
  words.reverse();
  snapshot({ kind: "visit", phase: "reverse", title: "Reverse the word list", detail: `The words now run from the original end to the original beginning: ${JSON.stringify(words)}.`, activeLines: [4], });
  result = words.join(" ");
  snapshot({ kind: "found", phase: "join", title: "Join with one space", detail: "join(' ') normalizes every separator to exactly one space.", activeLines: [5], });
  snapshot({ kind: "done", phase: "done", title: "Return the reversed sentence", detail: `The final string is ${JSON.stringify(result)}.`, activeLines: [5], });
  return { frames };
}
