import type { NaryNodeInput } from "./dryRun";

export type NaryDepthExample = { id: number; label: string; input: NaryNodeInput; output: number };
export const title = "559. Maximum Depth of N-ary Tree";
export const examples: NaryDepthExample[] = [
  { id: 1, label: "LeetCode 1", input: { value: 1, children: [{ value: 3, children: [{ value: 5, children: [] }, { value: 6, children: [] }] }, { value: 2, children: [] }, { value: 4, children: [] }] }, output: 3 },
  { id: 2, label: "LeetCode 2", input: { value: 1, children: [{ value: 2, children: [] }, { value: 3, children: [{ value: 6, children: [] }, { value: 7, children: [{ value: 11, children: [{ value: 14, children: [] }] }] }, { value: 8, children: [{ value: 12, children: [] }] }, { value: 9, children: [{ value: 13, children: [] }] }] }, { value: 4, children: [{ value: 10, children: [] }] }, { value: 5, children: [] }] }, output: 5 },
];
export const codeLines = [
  "class Solution:",
  "    def maxDepth(self, root: 'Node') -> int:",
  "        if not root:",
  "            return 0",
  "        if not root.children:",
  "            return 1",
  "        child_depth = 0",
  "        for child in root.children:",
  "            child_depth = max(child_depth, self.maxDepth(child))",
  "        return child_depth + 1",
];
