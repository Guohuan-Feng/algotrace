import type { FrameKind } from "../../types";

export type ExtraCharactersFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  s: string;
  dictionary: string[];
  dp: number[];
  i: number | null;
  j: number | null;
  candidate: string | null;
  matchedWord: string | null;
  result: number | null;
};

export function createExtraCharactersDryRun(s: string, dictionary: string[]): { frames: ExtraCharactersFrame[] } {
  const frames: ExtraCharactersFrame[] = [];
  const words = new Set(dictionary);
  const dp = Array(s.length + 1).fill(0);
  const push = (frame: Omit<ExtraCharactersFrame, "s" | "dictionary" | "dp">) => {
    frames.push({ ...frame, s, dictionary: [...dictionary], dp: [...dp] });
  };

  push({
    kind: "start",
    title: "Initialize prefix DP",
    detail: "dp[i] is the fewest extra characters in the first i characters of s.",
    activeLines: [5, 6, 7],
    i: null,
    j: null,
    candidate: null,
    matchedWord: null,
    result: null,
  });

  for (let i = 1; i <= s.length; i += 1) {
    const currentChar = s[i - 1];
    dp[i] = dp[i - 1] + 1;
    push({
      kind: "build",
      title: `Treat "${currentChar}" as extra`,
      detail: `Start with dp[${i}] = dp[${i - 1}] + 1 = ${dp[i]}. This is the fallback when no word ends at i.`,
      activeLines: [9, 10, 11],
      i,
      j: i - 1,
      candidate: currentChar,
      matchedWord: null,
      result: null,
    });

    for (let j = 0; j < i; j += 1) {
      const candidate = s.slice(j, i);
      const isWord = words.has(candidate);
      push({
        kind: isWord ? "found" : "visit",
        title: isWord ? `Dictionary match: "${candidate}"` : `Try s[${j}:${i}] = "${candidate}"`,
        detail: isWord
          ? `"${candidate}" is in the dictionary, so it can replace the fallback cost.`
          : `"${candidate}" is not a dictionary word, so this cut cannot improve dp[${i}].`,
        activeLines: [13, 14, 15, 16],
        i,
        j,
        candidate,
        matchedWord: isWord ? candidate : null,
        result: null,
      });

      if (!isWord) {
        continue;
      }

      const previous = dp[i];
      dp[i] = Math.min(dp[i], dp[j]);
      push({
        kind: dp[i] < previous ? "found" : "prune",
        title: dp[i] < previous ? `Update dp[${i}]` : `Keep dp[${i}] = ${dp[i]}`,
        detail:
          dp[i] < previous
            ? `dp[${i}] = min(${previous}, dp[${j}] = ${dp[j]}) = ${dp[i]}. The matched word has no extra-character cost.`
            : `dp[${j}] = ${dp[j]} does not beat the current value ${previous}.`,
        activeLines: [16, 17],
        i,
        j,
        candidate,
        matchedWord: candidate,
        result: null,
      });
    }
  }

  push({
    kind: "done",
    title: `Return dp[${s.length}] = ${dp[s.length]}`,
    detail: `The minimum number of extra characters is ${dp[s.length]}.`,
    activeLines: [19],
    i: null,
    j: null,
    candidate: null,
    matchedWord: null,
    result: dp[s.length],
  });

  return { frames };
}
