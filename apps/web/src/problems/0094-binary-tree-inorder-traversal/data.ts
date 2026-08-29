export type InorderTraversalExample = {
  id: number;
  label: string;
  input: Array<number | null>;
  output: number[];
};

export const title = "94. Binary Tree Inorder Traversal";

export const examples: InorderTraversalExample[] = [
  { id: 1, label: "LeetCode 1", input: [1, null, 2, 3], output: [1, 3, 2] },
  { id: 2, label: "LeetCode 2", input: [], output: [] },
  { id: 3, label: "LeetCode 3", input: [1], output: [1] },
];

export const defaultExample = examples[0]!;

export const codeLines = [
  "class Solution:",
  "    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:",
  "        res = []",
  "",
  "        def dfs(node):",
  "            if not node:",
  "                return",
  "",
  "            dfs(node.left)",
  "            res.append(node.val)",
  "            dfs(node.right)",
  "",
  "        dfs(root)",
  "        return res",
];
