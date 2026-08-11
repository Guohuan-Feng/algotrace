export type OpenLockExample = {
  id: 1 | 2 | 3;
  label: string;
  deadends: string[];
  target: string;
  output: number;
};

export const title = "752. Open the Lock";

export const examples: OpenLockExample[] = [
  { id: 1, label: "LeetCode 1", deadends: ["0201", "0101", "0102", "1212", "2002"], target: "0202", output: 6 },
  { id: 2, label: "LeetCode 2", deadends: ["8888"], target: "0009", output: 1 },
  { id: 3, label: "LeetCode 3", deadends: ["8887", "8889", "8878", "8898", "8788", "8988", "7888", "9888"], target: "8888", output: -1 },
];

export const defaultExample = examples[0];

export const codeLines = [
  "from collections import deque",
  "",
  "class Solution:",
  "    def openLock(self, deadends: List[str], target: str) -> int:",
  "        dead = set(deadends)",
  "",
  "        if '0000' in dead:",
  "            return -1",
  "",
  "        queue = deque(['0000'])",
  "        visited = {'0000'}",
  "        steps = 0",
  "",
  "        while queue:",
  "            for _ in range(len(queue)):",
  "                cur = queue.popleft()",
  "",
  "                if cur == target:",
  "                    return steps",
  "",
  "                for i in range(4):",
  "                    digit = int(cur[i])",
  "",
  "                    for move in [1, -1]:",
  "                        new_digit = (digit + move) % 10",
  "                        nei = cur[:i] + str(new_digit) + cur[i + 1:]",
  "",
  "                        if nei not in dead and nei not in visited:",
  "                            visited.add(nei)",
  "                            queue.append(nei)",
  "",
  "            steps += 1",
  "",
  "        return -1",
];
