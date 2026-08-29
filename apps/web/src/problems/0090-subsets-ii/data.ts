export const title = "90. Subsets II";
export const examples = [{ id: 1, label: "LeetCode 1", input: [1, 2, 2], output: [[], [1], [1, 2], [1, 2, 2], [2], [2, 2]] }, { id: 2, label: "LeetCode 2", input: [0], output: [[], [0]] }];
export const defaultExample = examples[0]!;
export const codeLines = ["class Solution:", "    def subsetsWithDup(self, nums: List[int]) -> List[List[int]]:", "        nums.sort()", "        res = []", "", "        def backtrack(start, path):", "            res.append(path)", "", "            for i in range(start, len(nums)):", "                if i > start and nums[i] == nums[i - 1]:", "                    continue", "", "                backtrack(i + 1, path + [nums[i]])", "", "        backtrack(0, [])", "", "        return res"];
