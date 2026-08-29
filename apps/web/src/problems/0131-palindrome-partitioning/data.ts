export type PalindromePartitioningInput = { s: string };

export type PalindromePartitioningExample = { id: 1 | 2; label: string; input: PalindromePartitioningInput; output: string[][] };

export const title = "131. Palindrome Partitioning";

export const examples: PalindromePartitioningExample[] = [
  { id: 1, label: "LeetCode 1", input: { s: "aab" }, output: [["a", "a", "b"], ["aa", "b"]] },
  { id: 2, label: "LeetCode 2", input: { s: "a" }, output: [["a"]] },
];

export const defaultExample = examples[0];

export const codeLines = [
  "class Solution:",
  "    def partition(self, s: str) -> List[List[str]]:",
  "        res = []",
  "",
  "        def isPalindrome(left, right):",
  "            while left < right:",
  "                if s[left] != s[right]:",
  "                    return False",
  "",
  "                left += 1",
  "                right -= 1",
  "",
  "            return True",
  "",
  "        def backtrack(start, path):",
  "            if start == len(s):",
  "                res.append(path)",
  "                return",
  "",
  "            for end in range(start, len(s)):",
  "                if not isPalindrome(start, end):",
  "                    continue",
  "",
  "                backtrack(end + 1, path + [s[start:end + 1]])",
  "",
  "        backtrack(0, [])",
  "",
  "        return res",
];
