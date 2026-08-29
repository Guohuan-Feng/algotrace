export type DailyTemperaturesInput = { temperatures: number[] };
export const title = "739. Daily Temperatures";
export const examples = [{ id: 1, label: "LeetCode 1", input: { temperatures: [73, 74, 75, 71, 69, 72, 76, 73] }, output: [1, 1, 4, 2, 1, 1, 0, 0] }, { id: 2, label: "LeetCode 2", input: { temperatures: [30, 40, 50, 60] }, output: [1, 1, 1, 0] }] satisfies Array<{ id: number; label: string; input: DailyTemperaturesInput; output: number[] }>;
export const defaultExample = examples[0]!;
export const codeLines = ["class Solution:", "    def dailyTemperatures(self, temperatures: List[int]) -> List[int]:", "        answer = [0] * len(temperatures)", "        stack = []", "        for index, temperature in enumerate(temperatures):", "            while stack and temperatures[stack[-1]] < temperature:", "                previous_index = stack.pop()", "                answer[previous_index] = index - previous_index", "            stack.append(index)", "        return answer"];
