export type FindTownJudgeInput = { n: number; trust: number[][] };

export type FindTownJudgeExample = {
  id: 1 | 2 | 3;
  label: string;
  input: FindTownJudgeInput;
  output: number;
};

export const title = "997. Find the Town Judge";

export const examples: FindTownJudgeExample[] = [
  { id: 1, label: "LeetCode 1", input: { n: 2, trust: [[1, 2]] }, output: 2 },
  { id: 2, label: "LeetCode 2", input: { n: 3, trust: [[1, 3], [2, 3]] }, output: 3 },
  { id: 3, label: "LeetCode 3", input: { n: 3, trust: [[1, 3], [2, 3], [3, 1]] }, output: -1 },
];

export const defaultExample = examples[0];

export const codeLines = [
  "class Solution:",
  "    def findJudge(self, n: int, trust: List[List[int]]) -> int:",
  "        indegree = [0] * (n + 1)",
  "        outdegree = [0] * (n + 1)",
  "",
  "        for a, b in trust:",
  "            outdegree[a] += 1",
  "            indegree[b] += 1",
  "",
  "        for i in range(1, n + 1):",
  "            if indegree[i] == n - 1 and outdegree[i] == 0:",
  "                return i",
  "",
  "        return -1",
];
