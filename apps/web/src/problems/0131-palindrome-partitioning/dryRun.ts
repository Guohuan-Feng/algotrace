import type { FrameKind } from "../../shared/types";

export type PalindromePartitioningFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  text: string;
  start: number;
  end: number | null;
  candidate: string | null;
  path: string[];
  stack: string[];
  results: string[][];
  result: string[][] | null;
};

export function createPalindromePartitioningDryRun(text: string): { frames: PalindromePartitioningFrame[] } {
  const frames: PalindromePartitioningFrame[] = [];
  const results: string[][] = [];
  const stack: string[] = [];
  const push = (frame: Omit<PalindromePartitioningFrame, "text" | "stack" | "results">) => frames.push({ ...frame, text, stack: [...stack], results: results.map((entry) => [...entry]) });
  const isPalindrome = (leftInput: number, rightInput: number, path: string[]): boolean => {
    let left = leftInput;
    let right = rightInput;
    push({ kind: "visit", title: `isPalindrome(${left}, ${right})`, detail: `Compare the ends of ${JSON.stringify(text.slice(leftInput, rightInput + 1))} while they move inward.`, activeLines: [5, 6], start: leftInput, end: rightInput, candidate: text.slice(leftInput, rightInput + 1), path, result: null });
    while (left < right) {
      if (text[left] !== text[right]) {
        push({ kind: "prune", title: `${JSON.stringify(text.slice(leftInput, rightInput + 1))} is not a palindrome`, detail: `${text[left]} and ${text[right]} differ, so do not recurse with this segment.`, activeLines: [6, 7, 8], start: leftInput, end: rightInput, candidate: text.slice(leftInput, rightInput + 1), path, result: null });
        return false;
      }
      push({ kind: "build", title: "Matching ends", detail: `${text[left]} equals ${text[right]}, so move both pointers inward.`, activeLines: [10, 11], start: leftInput, end: rightInput, candidate: text.slice(leftInput, rightInput + 1), path, result: null });
      left += 1;
      right -= 1;
    }
    push({ kind: "found", title: `${JSON.stringify(text.slice(leftInput, rightInput + 1))} is a palindrome`, detail: "All mirror-character checks passed.", activeLines: [13], start: leftInput, end: rightInput, candidate: text.slice(leftInput, rightInput + 1), path, result: null });
    return true;
  };
  const backtrack = (start: number, path: string[]): void => {
    stack.push(`backtrack(${start}, [${path.join(", ")}])`);
    push({ kind: "visit", title: `backtrack(start = ${start})`, detail: start === text.length ? "The complete string has been partitioned." : `Choose the next segment starting at index ${start}.`, activeLines: [15, 16, 20], start, end: null, candidate: null, path, result: null });
    if (start === text.length) {
      results.push([...path]);
      push({ kind: "found", title: `Append [${path.map((segment) => JSON.stringify(segment)).join(", ")}]`, detail: "Every chosen segment was a palindrome, so this path is one valid partition.", activeLines: [16, 17, 18], start, end: null, candidate: null, path, result: null });
      stack.pop();
      return;
    }
    for (let end = start; end < text.length; end += 1) {
      const candidate = text.slice(start, end + 1);
      push({ kind: "visit", title: `Try ${JSON.stringify(candidate)}`, detail: "Ask isPalindrome before adding this substring to the path.", activeLines: [20, 21], start, end, candidate, path, result: null });
      if (!isPalindrome(start, end, path)) continue;
      const nextPath = [...path, candidate];
      push({ kind: "build", title: `Choose ${JSON.stringify(candidate)}`, detail: `Call backtrack(${end + 1}, path + [${JSON.stringify(candidate)}]).`, activeLines: [24], start, end, candidate, path: nextPath, result: null });
      backtrack(end + 1, nextPath);
      push({ kind: "backtrack", title: `Return after ${JSON.stringify(candidate)}`, detail: "The copied path keeps the parent branch unchanged while it tries the next end index.", activeLines: [20], start, end, candidate, path, result: null });
    }
    stack.pop();
  };
  push({ kind: "start", title: "Create res", detail: `Partition ${JSON.stringify(text)} into palindromic substrings.`, activeLines: [2, 3], start: 0, end: null, candidate: null, path: [], result: null });
  push({ kind: "start", title: "Call backtrack(0, [])", detail: "Begin at the first character with an empty partition path.", activeLines: [26], start: 0, end: null, candidate: null, path: [], result: null });
  backtrack(0, []);
  push({ kind: "done", title: `Return ${results.length} partitions`, detail: "All substring choices have been checked and only palindrome paths remain.", activeLines: [28], start: text.length, end: null, candidate: null, path: [], result: results.map((entry) => [...entry]) });
  return { frames };
}
