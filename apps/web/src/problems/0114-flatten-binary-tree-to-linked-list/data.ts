export type FlattenTreeExample = {
  id: number;
  label: string;
  input: Array<number | null>;
  output: Array<number | null>;
};

export const title = "114. Flatten Binary Tree to Linked List";

export const examples: FlattenTreeExample[] = [
  { id: 1, label: "LeetCode 1", input: [1, 2, 5, 3, 4, null, 6], output: [1, null, 2, null, 3, null, 4, null, 5, null, 6] },
  { id: 2, label: "LeetCode 2", input: [], output: [] },
];

export const defaultExample = examples[0]!;

export const codeLines = [
  "class Solution:",
  "    def flatten(self, root: Optional[TreeNode]) -> None:",
  "        prev = None",
  "",
  "        def dfs(node):",
  "            if not node:",
  "                return",
  "",
  "            dfs(node.right)",
  "            dfs(node.left)",
  "            node.right = prev",
  "            node.left = None",
  "            prev = node",
  "",
  "        dfs(root)",
];
