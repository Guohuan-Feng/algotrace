export type ProductExceptSelfInput = { nums: number[] };
export const title = "238. Product of Array Except Self";
export const examples = [{ id: 1, label: "LeetCode 1", input: { nums: [1, 2, 3, 4] }, output: [24, 12, 8, 6] }, { id: 2, label: "LeetCode 2", input: { nums: [-1, 1, 0, -3, 3] }, output: [0, 0, 9, 0, 0] }] satisfies Array<{ id: number; label: string; input: ProductExceptSelfInput; output: number[] }>;
export const defaultExample = examples[0]!;
export const codeLines = ["class Solution:", "    def productExceptSelf(self, nums: List[int]) -> List[int]:", "        answer = [1] * len(nums)", "        prefix = 1", "", "        for i in range(len(nums)):", "            answer[i] = prefix", "            prefix *= nums[i]", "", "        suffix = 1", "        for i in range(len(nums) - 1, -1, -1):", "            answer[i] *= suffix", "            suffix *= nums[i]", "", "        return answer"];
