export type CourseScheduleIiInput = { numCourses: number; prerequisites: number[][] };

export const title = "210. Course Schedule II";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { numCourses: 2, prerequisites: [[1, 0]] }, output: [0, 1] },
  { id: 2, label: "LeetCode 3", input: { numCourses: 1, prerequisites: [] }, output: [0] },
] satisfies Array<{ id: number; label: string; input: CourseScheduleIiInput; output: number[] }>;
export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def findOrder(self, numCourses: int, prerequisites: List[List[int]]) -> List[int]:",
  "        graph = [[] for _ in range(numCourses)]",
  "",
  "        for course, pre in prerequisites:",
  "            graph[pre].append(course)",
  "",
  "        state = [0] * numCourses",
  "        res = []",
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
  "            res.append(course)",
  "",
  "            return True",
  "",
  "        for course in range(numCourses):",
  "            if dfs(course) == False:",
  "                return []",
  "",
  "        return res[::-1]",
];
