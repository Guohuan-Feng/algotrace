export type KthSmallestBstInput = { root: Array<number | null>; k: number };
export const title = "230. Kth Smallest Element in a BST";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { root: [3, 1, 4, null, 2], k: 1 }, output: 1 },
  { id: 2, label: "LeetCode 2", input: { root: [5, 3, 6, 2, 4, null, null, 1], k: 3 }, output: 3 },
] satisfies Array<{ id: number; label: string; input: KthSmallestBstInput; output: number }>;
export const defaultExample = examples[0]!;
export const codeLines = ["class Solution:", "    def kthSmallest(self, root: Optional[TreeNode], k: int) -> int:", "        stack = []", "        node = root", "", "        while stack or node:", "            while node:", "                stack.append(node)", "                node = node.left", "", "            node = stack.pop()", "            k -= 1", "            if k == 0:", "                return node.val", "            node = node.right"];
