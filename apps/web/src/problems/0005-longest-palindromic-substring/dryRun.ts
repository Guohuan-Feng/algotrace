import type { FrameKind } from "../../shared/types";
import type { CenterComparison, CenterMode } from "../0647-palindromic-substrings/dryRun";

export type LongestPalindromicSubstringFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  s: string;
  i: number | null;
  mode: CenterMode;
  l: number | null;
  r: number | null;
  s1: string;
  s2: string;
  res: string;
  returnedSubstring: string | null;
  matchRange: [number, number] | null;
  comparison: CenterComparison;
  result: string | null;
};

type FrameInput = Omit<LongestPalindromicSubstringFrame, "s" | "s1" | "s2" | "res">;

export function createLongestPalindromicSubstringDryRun(s: string): { frames: LongestPalindromicSubstringFrame[] } {
  const frames: LongestPalindromicSubstringFrame[] = [];
  let s1 = "";
  let s2 = "";
  let res = "";

  const push = (frame: FrameInput) => {
    frames.push({ ...frame, s, s1, s2, res });
  };

  push({
    kind: "start",
    title: "Start with an empty best palindrome",
    detail: "res will keep the longest substring returned from every center expansion.",
    activeLines: [9],
    i: null,
    mode: null,
    l: null,
    r: null,
    returnedSubstring: null,
    matchRange: null,
    comparison: null,
    result: null,
  });

  for (let i = 0; i < s.length; i += 1) {
    push({
      kind: "visit",
      title: `Use index ${i} as a center`,
      detail: `Try both the odd center (${i}, ${i}) and the even center (${i}, ${i + 1}).`,
      activeLines: [11],
      i,
      mode: null,
      l: null,
      r: null,
      returnedSubstring: null,
      matchRange: null,
      comparison: null,
      result: null,
    });

    push({
      kind: "visit",
      title: `Call expand(${i}, ${i}) for s1`,
      detail: "The odd expansion can return a palindrome with one center character.",
      activeLines: [12],
      i,
      mode: "odd",
      l: i,
      r: i,
      returnedSubstring: null,
      matchRange: null,
      comparison: null,
      result: null,
    });
    s1 = expand(i, i, i, "odd");
    push({
      kind: "build",
      title: `Store s1 = '${s1}'`,
      detail: `The odd expansion around index ${i} returns '${s1}'.`,
      activeLines: [12],
      i,
      mode: "odd",
      l: null,
      r: null,
      returnedSubstring: s1,
      matchRange: rangeForSubstring(i, "odd", s1.length),
      comparison: "returned",
      result: null,
    });

    push({
      kind: "visit",
      title: `Call expand(${i}, ${i + 1}) for s2`,
      detail: "The even expansion checks the gap after this index.",
      activeLines: [13],
      i,
      mode: "even",
      l: i,
      r: i + 1,
      returnedSubstring: null,
      matchRange: null,
      comparison: null,
      result: null,
    });
    s2 = expand(i, i + 1, i, "even");
    push({
      kind: "build",
      title: `Store s2 = '${s2}'`,
      detail: `The even expansion around the gap after index ${i} returns '${s2}'.`,
      activeLines: [13],
      i,
      mode: "even",
      l: null,
      r: null,
      returnedSubstring: s2,
      matchRange: rangeForSubstring(i, "even", s2.length),
      comparison: "returned",
      result: null,
    });

    const previous = res;
    res = chooseLongest(res, s1, s2);
    push({
      kind: res === previous ? "prune" : "found",
      title: res === previous ? `Keep res = '${res}'` : `Update res to '${res}'`,
      detail: `max('${previous}', '${s1}', '${s2}', key=len) returns '${res}'. Equal lengths keep the earlier argument.`,
      activeLines: [14],
      i,
      mode: null,
      l: null,
      r: null,
      returnedSubstring: res,
      matchRange: rangeForResult(s, res, i),
      comparison: "returned",
      result: null,
    });
  }

  push({
    kind: "done",
    title: `Return '${res}'`,
    detail: `All centers have been checked, so the code returns '${res}'.`,
    activeLines: [16],
    i: null,
    mode: null,
    l: null,
    r: null,
    returnedSubstring: res,
    matchRange: rangeForResult(s, res, s.length - 1),
    comparison: "returned",
    result: res,
  });

  return { frames };

  function expand(left: number, right: number, i: number, mode: Exclude<CenterMode, null>): string {
    let l = left;
    let r = right;
    let matchRange: [number, number] | null = null;

    push({
      kind: "start",
      title: `Enter expand(${l}, ${r})`,
      detail: "Move outward while the two edge characters are equal.",
      activeLines: [3],
      i,
      mode,
      l,
      r,
      returnedSubstring: null,
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
          activeLines: [4],
          i,
          mode,
          l,
          r,
          returnedSubstring: null,
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
          detail: `s[${l}] != s[${r}], so the palindrome cannot grow farther from this center.`,
          activeLines: [4],
          i,
          mode,
          l,
          r,
          returnedSubstring: null,
          matchRange,
          comparison: "mismatch",
          result: null,
        });
        break;
      }

      push({
        kind: "visit",
        title: `Match '${s[l]}' at both edges`,
        detail: `s[${l}] == s[${r}] == '${s[l]}', so this center can expand outward.`,
        activeLines: [4],
        i,
        mode,
        l,
        r,
        returnedSubstring: null,
        matchRange,
        comparison: "match",
        result: null,
      });

      matchRange = [l, r];
      l -= 1;
      r += 1;
      push({
        kind: "build",
        title: "Expand one step outward",
        detail: `Move to l = ${l}, r = ${r}. The successful range is '${s.slice(matchRange[0], matchRange[1] + 1)}'.`,
        activeLines: [5, 6],
        i,
        mode,
        l,
        r,
        returnedSubstring: null,
        matchRange,
        comparison: null,
        result: null,
      });
    }

    const palindrome = s.slice(l + 1, r);
    const range = palindrome ? ([l + 1, r - 1] as [number, number]) : null;
    push({
      kind: palindrome ? "found" : "backtrack",
      title: palindrome ? `Return '${palindrome}'` : "Return an empty substring",
      detail: `s[l + 1:r] is s[${l + 1}:${r}], which is '${palindrome}'.`,
      activeLines: [7],
      i,
      mode,
      l,
      r,
      returnedSubstring: palindrome,
      matchRange: range,
      comparison: "returned",
      result: null,
    });

    return palindrome;
  }
}

function chooseLongest(...values: string[]): string {
  return values.reduce((best, value) => (value.length > best.length ? value : best));
}

function rangeForSubstring(i: number, mode: Exclude<CenterMode, null>, length: number): [number, number] | null {
  if (!length) return null;
  return mode === "odd" ? [i - Math.floor(length / 2), i + Math.floor(length / 2)] : [i - length + 1, i + length];
}

function rangeForResult(s: string, result: string, preferredCenter: number): [number, number] | null {
  if (!result) return null;
  const start = s.lastIndexOf(result, preferredCenter);
  const resolvedStart = start >= 0 ? start : s.indexOf(result);
  return [resolvedStart, resolvedStart + result.length - 1];
}
