export type RemoveLeafInput = { root: Array<number | null>; target: number };
export type RemoveLeafExample = { id: number; label: string; input: RemoveLeafInput; output: Array<number | null> };
export const title = "1325. Delete Leaves With a Given Value";
export const examples: RemoveLeafExample[] = [
  { id: 1, label: "LeetCode 1", input: { root: [1, 2, 3, 2, null, 2, 4], target: 2 }, output: [1, null, 3, null, 4] },
  { id: 2, label: "LeetCode 2", input: { root: [1, 3, 3, 3, 2], target: 3 }, output: [1, 3, null, null, 2] },
];
export const codeLines = [
  "class Solution:",
  "    def removeLeafNodes(self, root, target):",
  "        if not root:",
  "            return None",
  "        root.left = self.removeLeafNodes(root.left, target)",
  "        root.right = self.removeLeafNodes(root.right, target)",
  "        if root.val == target and not root.left and not root.right:",
  "            return None",
  "        return root",
];
