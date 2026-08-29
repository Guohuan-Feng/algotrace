export const title = "78. Subsets";
export const examples = [{ id: 1, label: "LeetCode 1", input: [1, 2, 3], output: [[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]] }, { id: 2, label: "LeetCode 2", input: [0], output: [[], [0]] }];
export const defaultExample = examples[0]!;
export const codeLines = ["class Solution:", "    def subsets(self, nums: List[int]) -> List[List[int]]:", "        res = []", "", "        def backtrack(start, path):", "            res.append(path)", "", "            for i in range(start, len(nums)):", "                backtrack(i + 1, path + [nums[i]])", "", "        backtrack(0, [])", "", "        return res"];
