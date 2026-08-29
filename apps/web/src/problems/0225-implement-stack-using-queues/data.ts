export type StackOperation = { method: "push"; value: number } | { method: "pop" } | { method: "top" } | { method: "empty" };
export type StackInput = { operations: StackOperation[] };
export const title = "225. Implement Stack using Queues";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { operations: [{ method: "push", value: 1 }, { method: "push", value: 2 }, { method: "top" }, { method: "pop" }, { method: "empty" }] }, output: [null, null, 2, 2, false] },
  { id: 2, label: "Rotation", input: { operations: [{ method: "push", value: 5 }, { method: "push", value: 8 }, { method: "push", value: 3 }, { method: "pop" }, { method: "top" }] }, output: [null, null, null, 3, 8] },
] satisfies Array<{ id: number; label: string; input: StackInput; output: Array<number | boolean | null> }>;
export const defaultExample = examples[0]!;
export const codeLines = [
  "from collections import deque",
  "",
  "class MyStack:",
  "    def __init__(self):",
  "        self.queue = deque()",
  "",
  "    def push(self, x: int) -> None:",
  "        self.queue.append(x)",
  "        for _ in range(len(self.queue) - 1):",
  "            self.queue.append(self.queue.popleft())",
  "",
  "    def pop(self) -> int:",
  "        return self.queue.popleft()",
  "",
  "    def top(self) -> int:",
  "        return self.queue[0]",
  "",
  "    def empty(self) -> bool:",
  "        return not self.queue",
];
