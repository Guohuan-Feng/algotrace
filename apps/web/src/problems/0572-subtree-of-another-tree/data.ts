export type SubtreeInput = { root: Array<number | null>; subRoot: Array<number | null> };
export type SubtreeExample = { id: number; label: string; input: SubtreeInput; output: boolean };
export const title = "572. Subtree of Another Tree";
export const examples: SubtreeExample[] = [
  { id: 1, label: "LeetCode 1", input: { root: [3, 4, 5, 1, 2], subRoot: [4, 1, 2] }, output: true },
  { id: 2, label: "LeetCode 2", input: { root: [3, 4, 5, 1, 2, null, null, null, null, 0], subRoot: [4, 1, 2] }, output: false },
];
export const codeLines = [
  "class Solution:",
  "    def isSubtree(self, root, subRoot):",
  "        if not root:",
  "            return False",
  "        if self.sameTree(root, subRoot):",
  "            return True",
  "        return self.isSubtree(root.left, subRoot) or self.isSubtree(root.right, subRoot)",
  "",
  "    def sameTree(self, first, second):",
  "        if not first or not second:",
  "            return first == second",
  "        return first.val == second.val and self.sameTree(first.left, second.left) and self.sameTree(first.right, second.right)",
];
