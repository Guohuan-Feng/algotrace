export type MergeTreesInput = { root1: Array<number | null>; root2: Array<number | null> };
export type MergeTreesExample = { id: number; label: string; input: MergeTreesInput; output: Array<number | null> };
export const title = "617. Merge Two Binary Trees";
export const examples: MergeTreesExample[] = [
  { id: 1, label: "LeetCode 1", input: { root1: [1, 3, 2, 5], root2: [2, 1, 3, null, 4, null, 7] }, output: [3, 4, 5, 5, 4, null, 7] },
  { id: 2, label: "LeetCode 2", input: { root1: [1], root2: [1, 2] }, output: [2, 2] },
];
export const codeLines = [
  "class Solution:",
  "    def mergeTrees(self, root1, root2):",
  "        if not root1:",
  "            return root2",
  "        if not root2:",
  "            return root1",
  "        root1.val += root2.val",
  "        root1.left = self.mergeTrees(root1.left, root2.left)",
  "        root1.right = self.mergeTrees(root1.right, root2.right)",
  "        return root1",
];
