export type QueueOperation =
  | { method: "push"; value: number }
  | { method: "pop" }
  | { method: "peek" }
  | { method: "empty" };

export type QueueInput = { operations: QueueOperation[] };

export const title = "232. Implement Queue using Stacks";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { operations: [{ method: "push", value: 1 }, { method: "push", value: 2 }, { method: "peek" }, { method: "pop" }, { method: "empty" }] }, output: [null, null, 1, 1, false] },
  { id: 2, label: "Transfer once", input: { operations: [{ method: "push", value: 4 }, { method: "push", value: 9 }, { method: "pop" }, { method: "push", value: 7 }, { method: "pop" }, { method: "pop" }] }, output: [null, null, 4, null, 9, 7] },
] satisfies Array<{ id: number; label: string; input: QueueInput; output: Array<number | boolean | null> }>;
export const defaultExample = examples[0]!;
export const codeLines = [
  "class MyQueue:",
  "    def __init__(self):",
  "        self.in_stack = []",
  "        self.out_stack = []",
  "",
  "    def push(self, x: int) -> None:",
  "        self.in_stack.append(x)",
  "",
  "    def pop(self) -> int:",
  "        return self.peek_and_transfer(pop=True)",
  "",
  "    def peek(self) -> int:",
  "        return self.peek_and_transfer(pop=False)",
  "",
  "    def peek_and_transfer(self, pop: bool) -> int:",
  "        if not self.out_stack:",
  "            while self.in_stack:",
  "                self.out_stack.append(self.in_stack.pop())",
  "        return self.out_stack.pop() if pop else self.out_stack[-1]",
  "",
  "    def empty(self) -> bool:",
  "        return not self.in_stack and not self.out_stack",
];
