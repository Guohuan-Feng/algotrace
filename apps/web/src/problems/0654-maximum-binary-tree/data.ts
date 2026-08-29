export type MaximumBinaryTreeInput = { nums: number[] };
export type MaximumBinaryTreeExample = { id: number; label: string; input: MaximumBinaryTreeInput; output: Array<number | null> };
export const title = "654. Maximum Binary Tree";
export const examples: MaximumBinaryTreeExample[] = [
  { id: 1, label: "LeetCode 1", input: { nums: [3, 2, 1, 6, 0, 5] }, output: [6, 3, 5, null, 2, 0, null, null, 1] },
  { id: 2, label: "LeetCode 2", input: { nums: [3, 2, 1] }, output: [3, null, 2, null, 1] },
];
export const codeLines = [
  "class Solution:",
  "    def constructMaximumBinaryTree(self, nums):",
  "        def build(left, right):",
  "            if left > right:",
  "                return None",
  "            max_index = left",
  "            for i in range(left, right + 1):",
  "                if nums[i] > nums[max_index]:",
  "                    max_index = i",
  "            root = TreeNode(nums[max_index])",
  "            root.left = build(left, max_index - 1)",
  "            root.right = build(max_index + 1, right)",
  "            return root",
  "        return build(0, len(nums) - 1)",
];
