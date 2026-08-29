export type HouseRobberTreeInput = Array<number | null>;
export type HouseRobberTreeExample = { id: number; label: string; input: HouseRobberTreeInput; output: number };

export const title = "337. House Robber III";
export const examples: HouseRobberTreeExample[] = [
  { id: 1, label: "LeetCode 1", input: [3, 2, 3, null, 3, null, 1], output: 7 },
  { id: 2, label: "LeetCode 2", input: [3, 4, 5, 1, 3, null, 1], output: 9 },
];
export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def rob(self, root: Optional[TreeNode]) -> int:",
  "        def dfs(node):",
  "            if not node:",
  "                return (0, 0)",
  "",
  "            left_rob, left_skip = dfs(node.left)",
  "            right_rob, right_skip = dfs(node.right)",
  "",
  "            rob = node.val + left_skip + right_skip",
  "            skip = max(left_rob, left_skip) + max(right_rob, right_skip)",
  "            return (rob, skip)",
  "",
  "        return max(dfs(root))",
];
