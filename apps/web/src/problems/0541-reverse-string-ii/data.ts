export type ReverseStringIIInput = { s: string; k: number };
export type ReverseStringIIExample = { id: number; label: string; input: ReverseStringIIInput; output: string };
export const title = "541. Reverse String II";
export const examples: ReverseStringIIExample[] = [{ id: 1, label: "LeetCode 1", input: { s: "abcdefg", k: 2 }, output: "bacdfeg" }, { id: 2, label: "LeetCode 2", input: { s: "abcd", k: 2 }, output: "bacd" }];
export const defaultExample = examples[0]!;
export const codeLines = ["class Solution:", "    def reverseStr(self, s: str, k: int) -> str:", "        chars = list(s)", "        for start in range(0, len(chars), 2 * k):", "            left = start", "            right = min(start + k - 1, len(chars) - 1)", "            while left < right:", "                chars[left], chars[right] = chars[right], chars[left]", "                left += 1", "                right -= 1", "        return ''.join(chars)"];
