export type CourseScheduleExample = {
  id: 1 | 2 | 3;
  label: string;
  numCourses: number;
  prerequisites: number[][];
  output: boolean;
};

export const title = "207. Course Schedule";

export const examples: CourseScheduleExample[] = [
  { id: 1, label: "LeetCode 1", numCourses: 2, prerequisites: [[1, 0]], output: true },
  { id: 2, label: "LeetCode 2", numCourses: 2, prerequisites: [[1, 0], [0, 1]], output: false },
  { id: 3, label: "Chain", numCourses: 4, prerequisites: [[1, 0], [2, 1], [3, 2]], output: true },
];

export const defaultExample = examples[0];

export const codeLines = [
  "from typing import List",
  "from collections import defaultdict",
  "",
  "class Solution:",
  "    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:",
  "        graph = defaultdict(list)",
  "",
  "        for course, pre in prerequisites:",
  "            graph[pre].append(course)",
  "",
  "        visited = [0] * numCourses",
  "",
  "        def dfs(course):",
  "            if visited[course] == 1:",
  "                return False",
  "",
  "            if visited[course] == 2:",
  "                return True",
  "",
  "            visited[course] = 1",
  "",
  "            for next_course in graph[course]:",
  "                if not dfs(next_course):",
  "                    return False",
  "",
  "            visited[course] = 2",
  "",
  "            return True",
  "",
  "        for course in range(numCourses):",
  "            if not dfs(course):",
  "                return False",
  "",
  "        return True",
];
