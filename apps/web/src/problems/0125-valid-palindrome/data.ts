export type ValidPalindromeExample = { id: number; label: string; input: string; output: boolean };

export const title = "125. Valid Palindrome";
export const examples: ValidPalindromeExample[] = [
  { id: 1, label: "LeetCode 1", input: "A man, a plan, a canal: Panama", output: true },
  { id: 2, label: "LeetCode 2", input: "race a car", output: false },
  { id: 3, label: "LeetCode 3", input: " ", output: true },
];
export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def isPalindrome(self, s: str) -> bool:",
  "        left, right = 0, len(s) - 1",
  "",
  "        while left < right:",
  "            while left < right and not s[left].isalnum():",
  "                left += 1",
  "            while left < right and not s[right].isalnum():",
  "                right -= 1",
  "",
  "            if s[left].lower() != s[right].lower():",
  "                return False",
  "",
  "            left += 1",
  "            right -= 1",
  "",
  "        return True",
];
