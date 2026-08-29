export type GuessNumberInput = { n: number; pick: number };
export type GuessNumberExample = { id: number; label: string; input: GuessNumberInput; output: number };
export const title = "374. Guess Number Higher or Lower";
export const examples: GuessNumberExample[] = [{ id: 1, label: "LeetCode 1", input: { n: 10, pick: 6 }, output: 6 }, { id: 2, label: "LeetCode 2", input: { n: 1, pick: 1 }, output: 1 }, { id: 3, label: "LeetCode 3", input: { n: 2, pick: 1 }, output: 1 }];
export const defaultExample = examples[0]!;
export const codeLines = ["# The guess API returns -1, 0, or 1", "class Solution:", "    def guessNumber(self, n: int) -> int:", "        left, right = 1, n", "", "        while left <= right:", "            mid = left + (right - left) // 2", "            response = guess(mid)", "            if response == 0:", "                return mid", "            if response == 1:", "                left = mid + 1", "            else:", "                right = mid - 1", "", "        return -1"];
