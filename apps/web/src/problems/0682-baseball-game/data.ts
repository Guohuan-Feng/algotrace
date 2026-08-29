export type BaseballInput = { operations: string[] };
export const title = "682. Baseball Game";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { operations: ["5", "2", "C", "D", "+"] }, output: 30 },
  { id: 2, label: "LeetCode 2", input: { operations: ["5", "-2", "4", "C", "D", "9", "+", "+"] }, output: 27 },
] satisfies Array<{ id: number; label: string; input: BaseballInput; output: number }>;
export const defaultExample = examples[0]!;
export const codeLines = ["class Solution:", "    def calPoints(self, operations: List[str]) -> int:", "        stack = []", "        for operation in operations:", "            if operation == 'C':", "                stack.pop()", "            elif operation == 'D':", "                stack.append(stack[-1] * 2)", "            elif operation == '+':", "                stack.append(stack[-1] + stack[-2])", "            else:", "                stack.append(int(operation))", "        return sum(stack)"];
