export type SortedArrayToBstExample = {
  id: 1 | 2 | 3;
  label: string;
  nums: number[];
  output: string;
};

export const title = "Convert Sorted Array to BST: Divide and Conquer Visualizer";

export const examples: SortedArrayToBstExample[] = [
  {
    id: 1,
    label: "Example 1",
    nums: [-10, -3, 0, 5, 9],
    output: "[0,-3,9,-10,null,5]",
  },
  {
    id: 2,
    label: "Example 2",
    nums: [1, 3],
    output: "[3,1] or [1,null,3]",
  },
  {
    id: 3,
    label: "Practice",
    nums: [-7, -3, 0, 2, 5, 8, 11],
    output: "[2,-3,8,-7,0,5,11]",
  },
];

export const defaultExample = examples[0];

export const codeLines = [
  "from typing import List, Optional",
  "",
  "class Solution:",
  "    def sortedArrayToBST(self, nums: List[int]) -> Optional[TreeNode]:",
  "        def build(left, right):",
  "            if left > right:",
  "                return None",
  "",
  "            mid = (left + right) // 2",
  "",
  "            root = TreeNode(nums[mid])",
  "",
  "            root.left = build(left, mid - 1)",
  "            root.right = build(mid + 1, right)",
  "",
  "            return root",
  "",
  "        return build(0, len(nums) - 1)",
];
