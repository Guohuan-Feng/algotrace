export type LcaDeepestExample = { id: number; label: string; input: Array<number | null>; output: number };
export const title = "1123. Lowest Common Ancestor of Deepest Leaves";
export const examples: LcaDeepestExample[] = [
  { id: 1, label: "LeetCode 1", input: [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], output: 2 },
  { id: 2, label: "LeetCode 2", input: [1], output: 1 },
];
export const codeLines = [
  "class Solution:",
  "    def lcaDeepestLeaves(self, root):",
  "        def dfs(node, depth):",
  "            if not node:",
  "                return None, depth",
  "            if not node.left and not node.right:",
  "                return node, depth",
  "            left_node, left_depth = dfs(node.left, depth + 1)",
  "            right_node, right_depth = dfs(node.right, depth + 1)",
  "            if left_depth == right_depth:",
  "                return node, left_depth",
  "            return (left_node, left_depth) if left_depth > right_depth else (right_node, right_depth)",
  "        node, _ = dfs(root, 0)",
  "        return node",
];
