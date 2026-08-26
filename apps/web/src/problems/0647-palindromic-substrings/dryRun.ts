import type { FrameKind } from "../../shared/types";

export type CenterMode = "odd" | "even" | null;
export type CenterComparison = "match" | "mismatch" | "out-of-bounds" | "returned" | null;

export type PalindromicSubstringsFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  s: string;
  i: number | null;
  mode: CenterMode;
  l: number | null;
  r: number | null;
  localCount: number | null;
  res: number;
  palindromes: string[];
  foundPalindrome: string | null;
  matchRange: [number, number] | null;
  comparison: CenterComparison;
  result: number | null;
};

type FrameInput = Omit<PalindromicSubstringsFrame, "s" | "res" | "palindromes">;

export function createPalindromicSubstringsDryRun(s: string): { frames: PalindromicSubstringsFrame[] } {
  const frames: PalindromicSubstringsFrame[] = [];
  const palindromes: string[] = [];
  let res = 0;

  const push = (frame: FrameInput) => {
    frames.push({
      ...frame,
      s,
      res,
      palindromes: [...palindromes],
    });
  };

  push({
    kind: "start",
    title: "Start with an empty answer",
    detail: "res counts every palindromic substring found from all possible centers.",
    activeLines: [13],
    i: null,
    mode: null,
    l: null,
    r: null,
    localCount: null,
    foundPalindrome: null,
    matchRange: null,
    comparison: null,
    result: null,
  });

  for (let i = 0; i < s.length; i += 1) {
    push({
      kind: "visit",
      title: `Use index ${i} as a center`,
      detail: `The character '${s[i]}' can start one odd expansion and the gap after it can start one even expansion.`,
      activeLines: [15],
      i,
      mode: null,
      l: null,
      r: null,
      localCount: null,
      foundPalindrome: null,
      matchRange: null,
      comparison: null,
      result: null,
    });

    push({
      kind: "visit",
      title: `Call expand(${i}, ${i}) for an odd center`,
      detail: "An odd palindrome has one character at its center.",
      activeLines: [16],
      i,
      mode: "odd",
      l: i,
      r: i,
      localCount: null,
      foundPalindrome: null,
      matchRange: null,
      comparison: null,
      result: null,
    });
    const oddCount = expand(i, i, i, "odd");
    res += oddCount;
    push({
      kind: "build",
      title: `Add ${oddCount} odd palindrome${oddCount === 1 ? "" : "s"}`,
      detail: `res += ${oddCount}, so res becomes ${res}.`,
      activeLines: [16],
      i,
      mode: "odd",
      l: null,
      r: null,
      localCount: oddCount,
      foundPalindrome: null,
      matchRange: null,
      comparison: "returned",
      result: null,
    });

    push({
      kind: "visit",
      title: `Call expand(${i}, ${i + 1}) for an even center`,
      detail: "An even palindrome has a gap between its two middle characters.",
      activeLines: [17],
      i,
      mode: "even",
      l: i,
      r: i + 1,
      localCount: null,
      foundPalindrome: null,
      matchRange: null,
      comparison: null,
      result: null,
    });
    const evenCount = expand(i, i + 1, i, "even");
    res += evenCount;
    push({
      kind: "build",
      title: `Add ${evenCount} even palindrome${evenCount === 1 ? "" : "s"}`,
      detail: `res += ${evenCount}, so res becomes ${res}.`,
      activeLines: [17],
      i,
      mode: "even",
      l: null,
      r: null,
      localCount: evenCount,
      foundPalindrome: null,
      matchRange: null,
      comparison: "returned",
      result: null,
    });
  }

  push({
    kind: "done",
    title: `Return ${res}`,
    detail: `Every odd and even center has been expanded. The code returns ${res}.`,
    activeLines: [19],
    i: null,
    mode: null,
    l: null,
    r: null,
    localCount: null,
    foundPalindrome: null,
    matchRange: null,
    comparison: null,
    result: res,
  });

  return { frames };

  function expand(left: number, right: number, i: number, mode: Exclude<CenterMode, null>): number {
    let l = left;
    let r = right;
    let count = 0;
    let matchRange: [number, number] | null = null;

    push({
      kind: "start",
      title: `Enter expand(${l}, ${r})`,
      detail: "This helper counts palindromes around just this one center.",
      activeLines: [3, 4],
      i,
      mode,
      l,
      r,
      localCount: count,
      foundPalindrome: null,
      matchRange,
      comparison: null,
      result: null,
    });

    while (true) {
      if (l < 0 || r >= s.length) {
        push({
          kind: "prune",
          title: "Stop at the string boundary",
          detail: `l = ${l}, r = ${r}; the next comparison would be outside the string.`,
          activeLines: [6],
          i,
          mode,
          l,
          r,
          localCount: count,
          foundPalindrome: null,
          matchRange,
          comparison: "out-of-bounds",
          result: null,
        });
        break;
      }

      if (s[l] !== s[r]) {
        push({
          kind: "prune",
          title: `Stop: '${s[l]}' and '${s[r]}' do not match`,
          detail: `s[${l}] != s[${r}], so a larger substring around this center cannot be a palindrome.`,
          activeLines: [6],
          i,
          mode,
          l,
          r,
          localCount: count,
          foundPalindrome: null,
          matchRange,
          comparison: "mismatch",
          result: null,
        });
        break;
      }

      push({
        kind: "visit",
        title: `Match '${s[l]}' at both edges`,
        detail: `s[${l}] == s[${r}] == '${s[l]}', so the current range is a palindrome.`,
        activeLines: [6],
        i,
        mode,
        l,
        r,
        localCount: count,
        foundPalindrome: null,
        matchRange,
        comparison: "match",
        result: null,
      });

      const palindrome = s.slice(l, r + 1);
      count += 1;
      palindromes.push(palindrome);
      matchRange = [l, r];
      push({
        kind: "found",
        title: `Count palindrome '${palindrome}'`,
        detail: `count becomes ${count}. Each center expansion contributes every valid radius it reaches.`,
        activeLines: [7],
        i,
        mode,
        l,
        r,
        localCount: count,
        foundPalindrome: palindrome,
        matchRange,
        comparison: null,
        result: null,
      });

      l -= 1;
      r += 1;
      push({
        kind: "build",
        title: "Expand one step outward",
        detail: `Move to l = ${l}, r = ${r} and test the next pair of characters.`,
        activeLines: [8, 9],
        i,
        mode,
        l,
        r,
        localCount: count,
        foundPalindrome: palindrome,
        matchRange,
        comparison: null,
        result: null,
      });
    }

    push({
      kind: "backtrack",
      title: `Return local count ${count}`,
      detail: `expand(${left}, ${right}) returns ${count} to the caller.`,
      activeLines: [11],
      i,
      mode,
      l,
      r,
      localCount: count,
      foundPalindrome: null,
      matchRange,
      comparison: "returned",
      result: null,
    });

    return count;
  }
}
