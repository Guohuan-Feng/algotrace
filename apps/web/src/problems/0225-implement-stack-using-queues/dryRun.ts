import type { FrameKind } from "../../shared/types";
import type { StackOperation } from "./data";

export type StackUsingQueuesFrame = { kind: FrameKind; phase: "initialize" | "append" | "rotate" | "pop" | "top" | "empty" | "done"; title: string; detail: string; activeLines: number[]; operationIndex: number | null; operation: StackOperation | null; queue: number[]; output: number | boolean | null };

export function createStackUsingQueuesDryRun(operations: StackOperation[]): { frames: StackUsingQueuesFrame[] } {
  const queue: number[] = [];
  const frames: StackUsingQueuesFrame[] = [];
  let lastOutput: number | boolean | null = null;
  const push = (frame: Omit<StackUsingQueuesFrame, "queue">) => frames.push({ ...frame, queue: [...queue] });
  push({ kind: "start", phase: "initialize", title: "Create one empty queue", detail: "The queue front will always represent the stack top.", activeLines: [4, 5], operationIndex: null, operation: null, output: null });
  operations.forEach((operation, operationIndex) => {
    if (operation.method === "push") {
      queue.push(operation.value);
      push({ kind: "build", phase: "append", title: `Append ${operation.value}`, detail: "The new value first enters at the queue back.", activeLines: [7, 8], operationIndex, operation, output: null });
      const rotations = queue.length - 1;
      for (let count = 0; count < rotations; count += 1) {
        const moved = queue.shift()!;
        queue.push(moved);
        push({ kind: "build", phase: "rotate", title: `Rotate ${moved} to the back`, detail: `Rotation ${count + 1} of ${rotations} moves the prior front behind ${operation.value}.`, activeLines: [9, 10], operationIndex, operation, output: null });
      }
      return;
    }
    if (operation.method === "empty") {
      const output = queue.length === 0; lastOutput = output;
      push({ kind: "visit", phase: "empty", title: `empty() returns ${output}`, detail: `queue = [${queue.join(", ")}].`, activeLines: [18, 19], operationIndex, operation, output }); return;
    }
    if (!queue.length) { push({ kind: "prune", phase: "done", title: `${operation.method}() has no item`, detail: "The LeetCode contract does not call top or pop on an empty stack.", activeLines: [], operationIndex, operation, output: null }); return; }
    if (operation.method === "top") { const output = queue[0]!; lastOutput = output; push({ kind: "found", phase: "top", title: `top() returns ${output}`, detail: "The earlier rotations kept the newest item at queue[0].", activeLines: [15, 16], operationIndex, operation, output }); return; }
    const output = queue.shift()!; lastOutput = output;
    push({ kind: "found", phase: "pop", title: `pop() returns ${output}`, detail: "popleft removes the current queue front, which is also the stack top.", activeLines: [12, 13], operationIndex, operation, output });
  });
  push({ kind: "done", phase: "done", title: "Operation sequence complete", detail: "Every push rotated the queue so later reads behave like LIFO stack operations.", activeLines: [], operationIndex: null, operation: null, output: lastOutput });
  return { frames };
}
