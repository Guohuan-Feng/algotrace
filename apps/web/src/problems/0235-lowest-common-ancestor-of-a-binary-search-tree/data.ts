export type LcaBstInput = { root: Array<number | null>; p: number; q: number };
export const title = "235. Lowest Common Ancestor of a Binary Search Tree";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { root: [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], p: 2, q: 8 }, output: 6 },
  { id: 2, label: "LeetCode 2", input: { root: [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], p: 2, q: 4 }, output: 2 },
  { id: 3, label: "LeetCode 3", input: { root: [2, 1], p: 2, q: 1 }, output: 2 },
] satisfies Array<{ id: number; label: string; input: LcaBstInput; output: number }>;
export const defaultExample = examples[0]!;
export const codeLines = ["class Solution:", "    def lowestCommonAncestor(self, root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:", "        node = root", "", "        while node:", "            if p.val < node.val and q.val < node.val:", "                node = node.left", "            elif p.val > node.val and q.val > node.val:", "                node = node.right", "            else:", "                return node"];
