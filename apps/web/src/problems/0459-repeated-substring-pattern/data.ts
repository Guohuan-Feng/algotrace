export type RepeatedSubstringInput = { s: string };
export type RepeatedSubstringExample = { id: number; label: string; input: RepeatedSubstringInput; output: boolean };
export const title = "459. Repeated Substring Pattern";
export const examples: RepeatedSubstringExample[] = [{ id: 1, label: "LeetCode 1", input: { s: "abab" }, output: true }, { id: 2, label: "LeetCode 2", input: { s: "aba" }, output: false }, { id: 3, label: "LeetCode 3", input: { s: "abcabcabcabc" }, output: true }];
export const defaultExample = examples[0]!;
export const codeLines = ["class Solution:", "    def repeatedSubstringPattern(self, s: str) -> bool:", "        n = len(s)", "        for length in range(1, n):", "            if n % length != 0:", "                continue", "            pattern = s[:length]", "            if pattern * (n // length) == s:", "                return True", "        return False"];
