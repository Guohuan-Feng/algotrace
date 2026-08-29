export type InvertBinaryTreeExample = {
  id: number;
  label: string;
  input: Array<number | null>;
  output: Array<number | null>;
};

export const title = "226. Invert Binary Tree";

export const examples: InvertBinaryTreeExample[] = [
  { id: 1, label: "LeetCode 1", input: [4, 2, 7, 1, 3, 6, 9], output: [4, 7, 2, 9, 6, 3, 1] },
  { id: 2, label: "LeetCode 2", input: [2, 1, 3], output: [2, 3, 1] },
  { id: 3, label: "LeetCode 3", input: [], output: [] },
];

export const defaultExample = examples[0]!;

export const codeLines = [
  "class Solution:",
  "    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:",
  "        if not root:",
  "            return None",
  "",
  "        root.left, root.right = root.right, root.left",
  "        self.invertTree(root.left)",
  "        self.invertTree(root.right)",
  "",
  "        return root",
];
