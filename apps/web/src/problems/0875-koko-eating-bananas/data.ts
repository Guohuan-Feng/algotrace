export type KokoInput = { piles: number[]; h: number };
export const title = "875. Koko Eating Bananas";
export const examples = [{ id: 1, label: "LeetCode 1", input: { piles: [3, 6, 7, 11], h: 8 }, output: 4 }, { id: 2, label: "LeetCode 2", input: { piles: [30, 11, 23, 4, 20], h: 5 }, output: 30 }] satisfies Array<{ id: number; label: string; input: KokoInput; output: number }>;
export const defaultExample = examples[0]!;
export const codeLines = ["class Solution:", "    def minEatingSpeed(self, piles: List[int], h: int) -> int:", "        left = 1", "        right = max(piles)", "        while left <= right:", "            mid = left + (right - left) // 2", "            hours = 0", "            for pile in piles:", "                hours += (pile + mid - 1) // mid", "            if hours <= h:", "                right = mid - 1", "            else:", "                left = mid + 1", "        return left"];
