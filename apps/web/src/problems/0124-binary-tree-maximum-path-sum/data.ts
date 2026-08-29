export type MaximumPathSumExample = { id: number; label: string; input: Array<number | null>; output: number };

export const title = "124. Binary Tree Maximum Path Sum";
export const examples: MaximumPathSumExample[] = [
  { id: 1, label: "LeetCode 1", input: [1, 2, 3], output: 6 },
  { id: 2, label: "LeetCode 2", input: [-10, 9, 20, null, null, 15, 7], output: 42 },
];
export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def maxPathSum(self, root: Optional[TreeNode]) -> int:",
  "        max_sum = float('-inf')",
  "",
  "        def dfs(node):",
  "            if not node:",
  "                return 0",
  "",
  "            left = max(dfs(node.left), 0)",
  "            right = max(dfs(node.right), 0)",
  "            nonlocal max_sum",
  "            max_sum = max(max_sum, node.val + left + right)",
  "            return node.val + max(left, right)",
  "",
  "        dfs(root)",
  "        return max_sum",
];
