import type { FrameKind } from "../../shared/types";

export type AlienDictionaryFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  words: string[];
  order: string;
  rank: Record<string, number>;
  pairIndex: number | null;
  charIndex: number | null;
  leftWord: string | null;
  rightWord: string | null;
  leftChar: string | null;
  rightChar: string | null;
  result: boolean | null;
};

export function createAlienDictionaryDryRun(words: string[], order: string): { frames: AlienDictionaryFrame[] } {
  const rank = Object.fromEntries(order.split("").map((character, index) => [character, index]));
  const frames: AlienDictionaryFrame[] = [];
  const push = (frame: Omit<AlienDictionaryFrame, "words" | "order" | "rank">) => frames.push({ ...frame, words: [...words], order, rank: { ...rank } });
  push({ kind: "build", title: "Build alien rank map", detail: "rank[c] records where c appears in the alien alphabet.", activeLines: [3], pairIndex: null, charIndex: null, leftWord: null, rightWord: null, leftChar: null, rightChar: null, result: null });

  for (let i = 0; i < words.length - 1; i += 1) {
    const leftWord = words[i]!;
    const rightWord = words[i + 1]!;
    push({ kind: "visit", title: `Compare ${leftWord} and ${rightWord}`, detail: "Only adjacent word pairs must be in nondecreasing alien order.", activeLines: [5, 6, 7], pairIndex: i, charIndex: null, leftWord, rightWord, leftChar: null, rightChar: null, result: null });
    let decided = false;
    for (let j = 0; j < Math.min(leftWord.length, rightWord.length); j += 1) {
      const leftChar = leftWord[j]!;
      const rightChar = rightWord[j]!;
      push({ kind: "visit", title: `Compare ${leftChar} with ${rightChar}`, detail: leftChar === rightChar ? "Equal letters cannot decide this pair; continue." : `Their alien ranks are ${rank[leftChar]} and ${rank[rightChar]}.`, activeLines: [9, 10], pairIndex: i, charIndex: j, leftWord, rightWord, leftChar, rightChar, result: null });
      if (leftChar !== rightChar) {
        if (rank[leftChar]! > rank[rightChar]!) {
          push({ kind: "done", title: `${leftChar} ranks after ${rightChar}`, detail: "The first different letters are reversed, so return False immediately.", activeLines: [10, 11, 12], pairIndex: i, charIndex: j, leftWord, rightWord, leftChar, rightChar, result: false });
          return { frames };
        }
        push({ kind: "found", title: `${leftChar} ranks before ${rightChar}`, detail: "This adjacent pair is correctly ordered; break to the next pair.", activeLines: [10, 13], pairIndex: i, charIndex: j, leftWord, rightWord, leftChar, rightChar, result: null });
        decided = true;
        break;
      }
    }
    if (!decided && leftWord.length > rightWord.length) {
      push({ kind: "done", title: `${leftWord} is an invalid prefix`, detail: "All shared letters match, but the longer word appears before its own prefix.", activeLines: [15, 16, 17], pairIndex: i, charIndex: rightWord.length, leftWord, rightWord, leftChar: null, rightChar: null, result: false });
      return { frames };
    }
    push({ kind: "build", title: "Pair is ordered", detail: decided ? "Its first different letters are in alien order." : "The left word is equal to or shorter than the right prefix.", activeLines: [15], pairIndex: i, charIndex: null, leftWord, rightWord, leftChar: null, rightChar: null, result: null });
  }
  push({ kind: "done", title: "Return True", detail: "Every adjacent pair passed the alien-order comparison.", activeLines: [19], pairIndex: null, charIndex: null, leftWord: null, rightWord: null, leftChar: null, rightChar: null, result: true });
  return { frames };
}
