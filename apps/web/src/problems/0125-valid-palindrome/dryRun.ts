import type { FrameKind } from "../../shared/types";

export type ValidPalindromeFrame = {
  kind: FrameKind;
  phase: "start" | "skip-left" | "skip-right" | "compare" | "match" | "mismatch" | "advance" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  left: number;
  right: number;
  leftChar: string | null;
  rightChar: string | null;
  activeIndices: number[];
  matchedIndices: number[];
  skippedIndices: number[];
  normalized: string;
  result: boolean | null;
};

export function createValidPalindromeDryRun(text: string): { frames: ValidPalindromeFrame[] } {
  const frames: ValidPalindromeFrame[] = [];
  const matched = new Set<number>();
  const skipped = new Set<number>();
  const normalized = [...text].filter((character) => isAlphaNumeric(character)).map((character) => character.toLowerCase()).join("");
  let left = 0;
  let right = text.length - 1;
  const push = (frame: Omit<ValidPalindromeFrame, "left" | "right" | "matchedIndices" | "skippedIndices" | "normalized">) => frames.push({ ...frame, left, right, matchedIndices: [...matched], skippedIndices: [...skipped], normalized });

  push({ kind: "start", phase: "start", title: "Place pointers at both ends", detail: "Only letters and digits matter; punctuation and case are ignored.", activeLines: [3], leftChar: text[left] ?? null, rightChar: text[right] ?? null, activeIndices: [left, right].filter((index) => index >= 0), result: null });

  while (left < right) {
    while (left < right && !isAlphaNumeric(text[left]!)) {
      const index = left;
      skipped.add(index);
      left += 1;
      push({ kind: "prune", phase: "skip-left", title: `Skip ${JSON.stringify(text[index])} on the left`, detail: "It is not alphanumeric, so it cannot affect the palindrome comparison.", activeLines: [6, 7], leftChar: text[left] ?? null, rightChar: text[right] ?? null, activeIndices: [index], result: null });
    }
    while (left < right && !isAlphaNumeric(text[right]!)) {
      const index = right;
      skipped.add(index);
      right -= 1;
      push({ kind: "prune", phase: "skip-right", title: `Skip ${JSON.stringify(text[index])} on the right`, detail: "It is not alphanumeric, so it cannot affect the palindrome comparison.", activeLines: [8, 9], leftChar: text[left] ?? null, rightChar: text[right] ?? null, activeIndices: [index], result: null });
    }

    const leftChar = text[left]!;
    const rightChar = text[right]!;
    push({ kind: "visit", phase: "compare", title: `Compare ${JSON.stringify(leftChar)} and ${JSON.stringify(rightChar)}`, detail: `Compare their lowercase forms: ${JSON.stringify(leftChar.toLowerCase())} and ${JSON.stringify(rightChar.toLowerCase())}.`, activeLines: [10], leftChar, rightChar, activeIndices: [left, right], result: null });
    if (leftChar.toLowerCase() !== rightChar.toLowerCase()) {
      push({ kind: "prune", phase: "mismatch", title: "Characters do not match", detail: "The first unequal alphanumeric pair proves the string is not a palindrome.", activeLines: [10, 11], leftChar, rightChar, activeIndices: [left, right], result: false });
      push({ kind: "done", phase: "done", title: "Return False", detail: "A mismatch was found before the pointers crossed.", activeLines: [11], leftChar, rightChar, activeIndices: [left, right], result: false });
      return { frames };
    }

    matched.add(left);
    matched.add(right);
    push({ kind: "build", phase: "match", title: "Characters match", detail: "This pair is valid after lowercasing, so move inward to test the next pair.", activeLines: [10], leftChar, rightChar, activeIndices: [left, right], result: null });
    left += 1;
    right -= 1;
    push({ kind: "visit", phase: "advance", title: "Move both pointers inward", detail: `Continue with left = ${left} and right = ${right}.`, activeLines: [12, 13], leftChar: text[left] ?? null, rightChar: text[right] ?? null, activeIndices: [left, right].filter((index) => index >= 0 && index < text.length), result: null });
  }

  if (left === right && isAlphaNumeric(text[left]!)) matched.add(left);
  push({ kind: "done", phase: "done", title: "Return True", detail: "All comparable pairs matched after punctuation and case were ignored.", activeLines: [14], leftChar: text[left] ?? null, rightChar: text[right] ?? null, activeIndices: left === right ? [left] : [], result: true });
  return { frames };
}

function isAlphaNumeric(character: string): boolean { return /^[a-z0-9]$/i.test(character); }
