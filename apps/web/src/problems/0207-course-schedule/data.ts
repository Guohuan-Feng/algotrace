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

export const dfsCodeLines = [
  "from typing import List",
  "",
  "class Solution:",
  "    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:",
  "        graph = [[] for _ in range(numCourses)]",
  "        state = [0] * numCourses",
  "",
  "        for course, pre in prerequisites:",
  "            graph[pre].append(course)",
  "",
  "        def dfs(course):",
  "            if state[course] == 1:",
  "                return False",
  "",
  "            if state[course] == 2:",
  "                return True",
  "",
  "            state[course] = 1",
  "",
  "            for nei in graph[course]:",
  "                if dfs(nei) == False:",
  "                    return False",
  "",
  "            state[course] = 2",
  "            return True",
  "",
  "        for course in range(numCourses):",
  "            if dfs(course) == False:",
  "                return False",
  "",
  "        return True",
];

export const bfsCodeLines = [
  "from collections import deque",
  "",
  "class Solution:",
  "    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:",
  "        graph = [[] for _ in range(numCourses)]",
  "        indegree = [0] * numCourses",
  "",
  "        for course, pre in prerequisites:",
  "            graph[pre].append(course)",
  "            indegree[course] += 1",
  "",
  "        queue = deque()",
  "",
  "        for i in range(numCourses):",
  "            if indegree[i] == 0:",
  "                queue.append(i)",
  "",
  "        count = 0",
  "",
  "        while queue:",
  "            course = queue.popleft()",
  "            count += 1",
  "",
  "            for nei in graph[course]:",
  "                indegree[nei] -= 1",
  "",
  "                if indegree[nei] == 0:",
  "                    queue.append(nei)",
  "",
  "        return count == numCourses",
];
