export type MatchsticksToSquareInput = { matchsticks: number[] };

export type MatchsticksToSquareExample = { id: 1 | 2; label: string; input: MatchsticksToSquareInput; output: boolean };

export const title = "473. Matchsticks to Square";

export const examples: MatchsticksToSquareExample[] = [
  { id: 1, label: "LeetCode 1", input: { matchsticks: [1, 1, 2, 2, 2] }, output: true },
  { id: 2, label: "LeetCode 2", input: { matchsticks: [3, 3, 3, 3, 4] }, output: false },
];

export const defaultExample = examples[0];

export const codeLines = [
  "class Solution:",
  "    def makesquare(self, matchsticks: List[int]) -> bool:",
  "        total = sum(matchsticks)",
  "",
  "        if total % 4 != 0:",
  "            return False",
  "",
  "        target = total // 4",
  "        sides = [0] * 4",
  "",
  "        matchsticks.sort(reverse=True)",
  "",
  "        if matchsticks[0] > target:",
  "            return False",
  "",
  "        def backtrack(index):",
  "            if index == len(matchsticks):",
  "                return True",
  "",
  "            length = matchsticks[index]",
  "",
  "            for i in range(4):",
  "                if sides[i] + length > target:",
  "                    continue",
  "",
  "                sides[i] += length",
  "",
  "                if backtrack(index + 1):",
  "                    return True",
  "",
  "                sides[i] -= length",
  "",
  "                if sides[i] == 0:",
  "                    break",
  "",
  "            return False",
  "",
  "        return backtrack(0)",
];
