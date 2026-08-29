export type FindDuplicateInput = { nums: number[] };
export const title = "287. Find the Duplicate Number";
export const examples = [{ id: 1, label: "LeetCode 1", input: { nums: [1, 3, 4, 2, 2] }, output: 2 }, { id: 2, label: "LeetCode 2", input: { nums: [3, 1, 3, 4, 2] }, output: 3 }, { id: 3, label: "LeetCode 3", input: { nums: [3, 3, 3, 3, 3] }, output: 3 }] satisfies Array<{ id: number; label: string; input: FindDuplicateInput; output: number }>;
export const defaultExample = examples[0]!;
export const codeLines = ["class Solution:", "    def findDuplicate(self, nums: List[int]) -> int:", "        slow = fast = nums[0]", "", "        while True:", "            slow = nums[slow]", "            fast = nums[nums[fast]]", "            if slow == fast:", "                break", "", "        slow = nums[0]", "        while slow != fast:", "            slow = nums[slow]", "            fast = nums[fast]", "", "        return slow"];
