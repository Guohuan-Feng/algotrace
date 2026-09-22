export const title = "80. Remove Duplicates from Sorted Array II";

export const examples = [
  { id: 1, label: "连续跳过与覆盖", input: [0, 0, 1, 1, 1, 1, 2, 3, 3], output: { k: 7, nums: [0, 0, 1, 1, 2, 3, 3] } },
  { id: 2, label: "官方示例 1", input: [1, 1, 1, 2, 2, 3], output: { k: 5, nums: [1, 1, 2, 2, 3] } },
  { id: 3, label: "全部相同", input: [2, 2, 2, 2, 2], output: { k: 2, nums: [2, 2] } },
  { id: 4, label: "空数组", input: [], output: { k: 0, nums: [] } },
  { id: 5, label: "只有两项", input: [5, 5], output: { k: 2, nums: [5, 5] } },
  { id: 6, label: "全部不同", input: [-2, -1, 0, 1, 2], output: { k: 5, nums: [-2, -1, 0, 1, 2] } },
] satisfies Array<{ id: number; label: string; input: number[]; output: { k: number; nums: number[] } }>;

export const defaultExample = examples[0]!;

export const codeLines = [
  "class Solution:",
  "    def removeDuplicates(self, nums: list[int]) -> int:",
  "        if len(nums) <= 2:",
  "            return len(nums)",
  "",
  "        left = 2",
  "",
  "        for right in range(2, len(nums)):",
  "            if nums[right] != nums[left - 2]:",
  "                nums[left] = nums[right]",
  "                left += 1",
  "",
  "        return left",
];

export function parseInput(value: unknown): number[] {
  const nums = Array.isArray(value)
    ? value
    : typeof value === "object" && value !== null && "nums" in value
      ? value.nums
      : null;

  if (!Array.isArray(nums)) {
    throw new Error('请输入整数数组，例如 [1,1,1,2,2,3]，或 {"nums":[1,1,1,2,2,3]}。');
  }
  if (nums.length > 40) {
    throw new Error("为了清晰展示，数组最多支持 40 个元素。");
  }
  for (let index = 0; index < nums.length; index += 1) {
    if (typeof nums[index] !== "number" || !Number.isSafeInteger(nums[index])) {
      throw new Error("数组中的每一项都必须是安全整数。");
    }
    if (index > 0 && nums[index] < nums[index - 1]) {
      throw new Error("数组必须按非递减顺序排列，例如 [1,1,2,3]。");
    }
  }
  return [...nums];
}
