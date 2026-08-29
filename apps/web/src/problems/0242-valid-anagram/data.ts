export type ValidAnagramInput = { s: string; t: string };
export const title = "242. Valid Anagram";
export const examples = [{ id: 1, label: "LeetCode 1", input: { s: "anagram", t: "nagaram" }, output: true }, { id: 2, label: "LeetCode 2", input: { s: "rat", t: "car" }, output: false }] satisfies Array<{ id: number; label: string; input: ValidAnagramInput; output: boolean }>;
export const defaultExample = examples[0]!;
export const codeLines = ["class Solution:", "    def isAnagram(self, s: str, t: str) -> bool:", "        if len(s) != len(t):", "            return False", "", "        count = {}", "        for char in s:", "            count[char] = count.get(char, 0) + 1", "", "        for char in t:", "            if char not in count or count[char] == 0:", "                return False", "            count[char] -= 1", "", "        return True"];
