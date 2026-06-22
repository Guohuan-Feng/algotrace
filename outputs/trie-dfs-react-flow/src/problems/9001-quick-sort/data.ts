export type QuickSortExample = { id: 1 | 2 | 3; label: string; nums: number[]; output: number[] };

export const title = "Quick Sort: Partition Visualizer";

export const examples: QuickSortExample[] = [
  { id: 1, label: "Example 1", nums: [5, 2, 9, 1, 5, 6], output: [1, 2, 5, 5, 6, 9] },
  { id: 2, label: "Example 2", nums: [3, 6, 8, 10, 1, 2, 1], output: [1, 1, 2, 3, 6, 8, 10] },
  { id: 3, label: "Practice", nums: [7, -2, 4, 0, 9, 3], output: [-2, 0, 3, 4, 7, 9] },
];

export const defaultExample = examples[0];

export const codeLines = [
  "def partition(nums, left, right):",
  "    i, j = left, right",
  "",
  "    while i < j:",
  "        while i < j and nums[j] >= nums[left]:",
  "            j -= 1",
  "",
  "        while i < j and nums[i] <= nums[left]:",
  "            i += 1",
  "",
  "        nums[i], nums[j] = nums[j], nums[i]",
  "",
  "    nums[i], nums[left] = nums[left], nums[i]",
  "",
  "    return i",
  "",
  "def quick_sort(nums, left, right):",
  "    if left >= right:",
  "        return",
  "",
  "    pivot = partition(nums, left, right)",
  "",
  "    quick_sort(nums, left, pivot - 1)",
  "    quick_sort(nums, pivot + 1, right)",
];
