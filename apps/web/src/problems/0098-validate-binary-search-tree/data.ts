export type ValidateBstExample = { id: number; label: string; input: Array<number | null>; output: boolean };
export const title = "98. Validate Binary Search Tree";
export const examples: ValidateBstExample[] = [
  { id: 1, label: "LeetCode 1", input: [2, 1, 3], output: true },
  { id: 2, label: "LeetCode 2", input: [5, 1, 4, null, null, 3, 6], output: false },
];
export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def isValidBST(self, root: Optional[TreeNode]) -> bool:",
  "        def valid(node, low, high):",
  "            if not node:",
  "                return True",
  "",
  "            if node.val <= low or node.val >= high:",
  "                return False",
  "",
  "            return valid(node.left, low, node.val) and valid(node.right, node.val, high)",
  "",
  "        return valid(root, float('-inf'), float('inf'))",
];
