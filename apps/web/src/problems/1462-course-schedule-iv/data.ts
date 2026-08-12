export type CourseScheduleIvExample = {
  id: 1 | 2 | 3;
  label: string;
  numCourses: number;
  prerequisites: number[][];
  queries: number[][];
  output: boolean[];
};

export const title = "1462. Course Schedule IV";

export const examples: CourseScheduleIvExample[] = [
  { id: 1, label: "LeetCode 1", numCourses: 2, prerequisites: [[1, 0]], queries: [[0, 1], [1, 0]], output: [false, true] },
  { id: 2, label: "LeetCode 2", numCourses: 2, prerequisites: [], queries: [[1, 0], [0, 1]], output: [false, false] },
  { id: 3, label: "LeetCode 3", numCourses: 3, prerequisites: [[1, 2], [1, 0], [2, 0]], queries: [[1, 0], [1, 2]], output: [true, true] },
];

export const defaultExample = examples[0];

export const codeLines = [
  "from typing import List",
  "",
  "class Solution:",
  "    def checkIfPrerequisite(",
  "        self,",
  "        numCourses: int,",
  "        prerequisites: List[List[int]],",
  "        queries: List[List[int]]",
  "    ) -> List[bool]:",
  "",
  "        graph = [[] for _ in range(numCourses)]",
  "",
  "        for pre, course in prerequisites:",
  "            graph[pre].append(course)",
  "",
  "        def dfs(node, target, visited):",
  "            if node == target:",
  "                return True",
  "",
  "            visited.add(node)",
  "",
  "            for nei in graph[node]:",
  "                if nei not in visited:",
  "                    if dfs(nei, target, visited):",
  "                        return True",
  "",
  "            return False",
  "",
  "        res = []",
  "",
  "        for pre, course in queries:",
  "            res.append(dfs(pre, course, set()))",
  "",
  "        return res",
];
