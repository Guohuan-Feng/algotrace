export type ValidParenthesesExample = { id: number; label: string; s: string; output: boolean };
export const title = "20. Valid Parentheses";
export const examples: ValidParenthesesExample[] = [
  { id: 1, label: "LeetCode 1", s: "()", output: true },
  { id: 2, label: "LeetCode 2", s: "()[]{}", output: true },
  { id: 3, label: "LeetCode 3", s: "(]", output: false },
];
export const defaultExample = examples[0];
export const codeLines = ["class Solution:", "    def isValid(self, s: str) -> bool:", "        stack = []", "        pairs = {\")\": \"(\", \"]\": \"[\", \"}\": \"{\"}", "        for ch in s:", "            if ch in pairs:", "                if not stack or stack[-1] != pairs[ch]:", "                    return False", "                stack.pop()", "            else:", "                stack.append(ch)", "        return not stack"];
