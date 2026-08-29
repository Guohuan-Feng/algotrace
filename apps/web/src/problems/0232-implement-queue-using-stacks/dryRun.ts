import type { FrameKind } from "../../shared/types";
import type { QueueOperation } from "./data";

export type QueueUsingStacksFrame = {
  kind: FrameKind;
  phase: "initialize" | "push" | "read" | "transfer" | "peek" | "pop" | "empty" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  operationIndex: number | null;
  operation: QueueOperation | null;
  inStack: number[];
  outStack: number[];
  output: number | boolean | null;
};

export function createQueueUsingStacksDryRun(operations: QueueOperation[]): { frames: QueueUsingStacksFrame[] } {
  const inStack: number[] = [];
  const outStack: number[] = [];
  const frames: QueueUsingStacksFrame[] = [];
  let lastOutput: number | boolean | null = null;
  const push = (frame: Omit<QueueUsingStacksFrame, "inStack" | "outStack">) => frames.push({ ...frame, inStack: [...inStack], outStack: [...outStack] });

  push({ kind: "start", phase: "initialize", title: "Create two empty stacks", detail: "in_stack receives new items; out_stack exposes the oldest queued item at its top.", activeLines: [2, 3, 4], operationIndex: null, operation: null, output: null });

  operations.forEach((operation, operationIndex) => {
    if (operation.method === "push") {
      inStack.push(operation.value);
      push({ kind: "build", phase: "push", title: `push(${operation.value})`, detail: `Append ${operation.value} to in_stack. No transfer is needed for a write.`, activeLines: [6, 7], operationIndex, operation, output: null });
      return;
    }

    if (operation.method === "empty") {
      const output = !inStack.length && !outStack.length;
      lastOutput = output;
      push({ kind: "visit", phase: "empty", title: `empty() returns ${output}`, detail: `Both stacks must be empty: in_stack = [${inStack.join(", ")}], out_stack = [${outStack.join(", ")}].`, activeLines: [21, 22], operationIndex, operation, output });
      return;
    }

    push({ kind: "visit", phase: "read", title: `${operation.method}() needs the front item`, detail: "The front of the queue lives on top of out_stack. Transfer only when that stack is empty.", activeLines: operation.method === "pop" ? [9, 10] : [12, 13], operationIndex, operation, output: null });
    if (!outStack.length) {
      push({ kind: "visit", phase: "transfer", title: "out_stack is empty: begin transfer", detail: "Pop every input item and append it to out_stack, reversing the order once.", activeLines: [16, 17], operationIndex, operation, output: null });
      while (inStack.length) {
        const value = inStack.pop()!;
        outStack.push(value);
        push({ kind: "build", phase: "transfer", title: `Move ${value} to out_stack`, detail: `${value} is now closer to the queue front. The top of out_stack is the oldest item.`, activeLines: [17, 18], operationIndex, operation, output: null });
      }
    }

    if (!outStack.length) {
      push({ kind: "prune", phase: "done", title: `${operation.method}() has no item`, detail: "The LeetCode contract does not call pop or peek on an empty queue.", activeLines: [19], operationIndex, operation, output: null });
      return;
    }

    if (operation.method === "peek") {
      const output = outStack[outStack.length - 1]!;
      lastOutput = output;
      push({ kind: "found", phase: "peek", title: `peek() returns ${output}`, detail: "Read the top of out_stack without removing it.", activeLines: [19], operationIndex, operation, output });
      return;
    }

    const output = outStack.pop()!;
    lastOutput = output;
    push({ kind: "found", phase: "pop", title: `pop() returns ${output}`, detail: "Remove the top of out_stack, which is the oldest queued item.", activeLines: [19], operationIndex, operation, output });
  });

  push({ kind: "done", phase: "done", title: "Operation sequence complete", detail: "The two stacks together still represent the remaining queue in FIFO order.", activeLines: [], operationIndex: null, operation: null, output: lastOutput });
  return { frames };
}
