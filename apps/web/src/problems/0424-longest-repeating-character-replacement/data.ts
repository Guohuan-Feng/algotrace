export type CharacterReplacementInput = { s: string; k: number };
export type CharacterReplacementExample = { id: number; label: string; input: CharacterReplacementInput; output: number };
export const title = "424. Longest Repeating Character Replacement";
export const examples: CharacterReplacementExample[] = [{ id: 1, label: "LeetCode 1", input: { s: "ABAB", k: 2 }, output: 4 }, { id: 2, label: "LeetCode 2", input: { s: "AABABBA", k: 1 }, output: 4 }];
export const defaultExample = examples[0]!;
export const codeLines = ["class Solution:", "    def characterReplacement(self, s: str, k: int) -> int:", "        count = {}", "        left = 0", "        max_freq = 0", "        best = 0", "", "        for right, char in enumerate(s):", "            count[char] = count.get(char, 0) + 1", "            max_freq = max(max_freq, count[char])", "", "            while right - left + 1 - max_freq > k:", "                count[s[left]] -= 1", "                left += 1", "", "            best = max(best, right - left + 1)", "", "        return best"];
