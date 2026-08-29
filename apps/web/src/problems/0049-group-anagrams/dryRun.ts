import type { FrameKind } from "../../shared/types";

export type AnagramBucket = { key: string; words: string[] };

export type GroupAnagramsFrame = {
  kind: FrameKind;
  phase: "initialize" | "inspect" | "key" | "group" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  strs: string[];
  wordIndex: number | null;
  word: string | null;
  key: string | null;
  buckets: AnagramBucket[];
  result: string[][] | null;
};

export function createGroupAnagramsDryRun(strs: string[]): { frames: GroupAnagramsFrame[] } {
  const frames: GroupAnagramsFrame[] = [];
  const groups = new Map<string, string[]>();
  const snapshot = (frame: Omit<GroupAnagramsFrame, "strs" | "buckets">) => {
    frames.push({
      ...frame,
      strs: [...strs],
      buckets: [...groups.entries()].map(([key, words]) => ({ key, words: [...words] })),
    });
  };

  snapshot({
    kind: "start",
    phase: "initialize",
    title: "Create an empty signature map",
    detail: "Each sorted-letter signature points to one group of words that are anagrams of one another.",
    activeLines: [2],
    wordIndex: null,
    word: null,
    key: null,
    result: null,
  });

  strs.forEach((word, wordIndex) => {
    snapshot({
      kind: "visit",
      phase: "inspect",
      title: "Read word \"" + word + "\"",
      detail: "Process input position " + wordIndex + " and find the bucket whose letters match this word.",
      activeLines: [4],
      wordIndex,
      word,
      key: null,
      result: null,
    });
    const key = word.split("").sort().join("");
    snapshot({
      kind: "build",
      phase: "key",
      title: "Sort letters into signature \"" + key + "\"",
      detail: "Words with the same sorted letters share this signature, even when their original character order differs.",
      activeLines: [5],
      wordIndex,
      word,
      key,
      result: null,
    });
    const bucket = groups.get(key) ?? [];
    bucket.push(word);
    groups.set(key, bucket);
    snapshot({
      kind: "found",
      phase: "group",
      title: "Append \"" + word + "\" to bucket \"" + key + "\"",
      detail: "The map now stores [" + bucket.join(", ") + "] for signature \"" + key + "\".",
      activeLines: [6, 7],
      wordIndex,
      word,
      key,
      result: null,
    });
  });

  const result = [...groups.values()].map((bucket) => [...bucket]);
  snapshot({
    kind: "done",
    phase: "done",
    title: "Return all signature buckets",
    detail: "Every word is grouped exactly once. Return the " + result.length + " anagram groups.",
    activeLines: [9],
    wordIndex: null,
    word: null,
    key: null,
    result,
  });

  return { frames };
}
