export type DecodeStringInput = { s: string };

export const title = "394. Decode String";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { s: "3[a]2[bc]" }, output: "aaabcbc" },
  { id: 2, label: "LeetCode 2", input: { s: "3[a2[c]]" }, output: "accaccacc" },
  { id: 3, label: "LeetCode 3", input: { s: "2[abc]3[cd]ef" }, output: "abcabccdcdcdef" },
] satisfies Array<{ id: number; label: string; input: DecodeStringInput; output: string }>;

export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def decodeString(self, s):",
  "        stack, repeat, current = [], 0, ''",
  "        for char in s:",
  "            if char.isdigit():",
  "                repeat = repeat * 10 + int(char)",
  "            elif char == '[':",
  "                stack.append((current, repeat))",
  "                current, repeat = '', 0",
  "            elif char == ']':",
  "                prefix, count = stack.pop()",
  "                current = prefix + current * count",
  "            else:",
  "                current += char",
  "        return current",
];
