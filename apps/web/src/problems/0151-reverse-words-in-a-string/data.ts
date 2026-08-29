export type ReverseWordsInput = { s: string };
export const title = "151. Reverse Words in a String";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { s: "the sky is blue" }, output: "blue is sky the" },
  { id: 2, label: "LeetCode 2", input: { s: "  hello world  " }, output: "world hello" },
  { id: 3, label: "LeetCode 3", input: { s: "a good   example" }, output: "example good a" },
] satisfies Array<{ id: number; label: string; input: ReverseWordsInput; output: string }>;
export const defaultExample = examples[0]!;
export const codeLines = ["class Solution:", "    def reverseWords(self, s: str) -> str:", "        words = s.split()", "        words.reverse()", "        return ' '.join(words)"];
