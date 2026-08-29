export type CarPoolingInput = { trips: number[][]; capacity: number };
export const title = "1094. Car Pooling";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { trips: [[2, 1, 5], [3, 3, 7]], capacity: 4 }, output: false },
  { id: 2, label: "LeetCode 2", input: { trips: [[2, 1, 5], [3, 3, 7]], capacity: 5 }, output: true },
];
export const defaultExample = examples[0]!;
export const codeLines = ["class Solution:", "    def carPooling(self, trips: List[List[int]], capacity: int) -> bool:", "        diff = [0] * 1001", "", "        for passengers, start, end in trips:", "            diff[start] += passengers", "            diff[end] -= passengers", "", "        current = 0", "", "        for change in diff:", "            current += change", "", "            if current > capacity:", "                return False", "", "        return True"];
