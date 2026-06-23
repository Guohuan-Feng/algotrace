export type LongestConsecutiveExample = { id: 1 | 2 | 3; label: string; nums: number[]; output: number };

export const title = "128. Longest Consecutive Sequence";

export const examples: LongestConsecutiveExample[] = [
  { id: 1, label: "LeetCode 1", nums: [100, 4, 200, 1, 3, 2], output: 4 },
  { id: 2, label: "LeetCode 2", nums: [0, 3, 7, 2, 5, 8, 4, 6, 0, 1], output: 9 },
  { id: 3, label: "Empty", nums: [], output: 0 },
];

export const defaultExample = examples[0];

export const codeLines = [
  "from typing import List",
  "",
  "class Solution:",
  "    def longestConsecutive(self, nums: List[int]) -> int:",
  "        num_set = set(nums)",
  "        res = 0",
  "",
  "        for num in num_set:",
  "            # 只有 num 是一个序列的起点时，才开始往后数",
  "            if num - 1 not in num_set:",
  "                cur = num",
  "                length = 1",
  "",
  "                while cur + 1 in num_set:",
  "                    cur += 1",
  "                    length += 1",
  "",
  "                res = max(res, length)",
  "",
  "        return res",
];
