import type { FrameKind } from "../../shared/types";

export type NextGreaterFrame = {
  kind: FrameKind;
  phase: "initialize" | "scan" | "pop" | "push" | "resolve" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  index: number | null;
  value: number | null;
  queryIndex: number | null;
  query: number | null;
  answer: number | null;
  stack: number[];
  mapping: Record<number, number>;
  result: number[] | null;
};

export function createNextGreaterDryRun(nums1: number[], nums2: number[]): { frames: NextGreaterFrame[] } {
  const stack: number[] = [];
  const mapping: Record<number, number> = {};
  const result: number[] = [];
  const frames: NextGreaterFrame[] = [];
  const push = (frame: Omit<NextGreaterFrame, "stack" | "mapping">) => {
    frames.push({ ...frame, stack: [...stack], mapping: { ...mapping } });
  };

  push({ kind: "start", phase: "initialize", title: "Start an empty monotonic stack", detail: "The stack keeps values that have not found a greater value to their right yet.", activeLines: [2, 3], index: null, value: null, queryIndex: null, query: null, answer: null, result: null });

  nums2.forEach((value, index) => {
    push({ kind: "visit", phase: "scan", title: `Scan nums2[${index}] = ${value}`, detail: "Compare this number against the unresolved values on top of the stack.", activeLines: [4], index, value, queryIndex: null, query: null, answer: null, result: null });
    while (stack.length && stack[stack.length - 1]! < value) {
      const smaller = stack.pop()!;
      mapping[smaller] = value;
      push({ kind: "build", phase: "pop", title: `${value} is next greater for ${smaller}`, detail: `${smaller} < ${value}, so remove ${smaller} and record ${smaller} -> ${value}.`, activeLines: [5, 6], index, value, queryIndex: null, query: smaller, answer: value, result: null });
    }
    stack.push(value);
    push({ kind: "found", phase: "push", title: `Push ${value} onto the stack`, detail: `${value} still needs its own next greater element later in nums2.`, activeLines: [7], index, value, queryIndex: null, query: null, answer: null, result: null });
  });

  nums1.forEach((query, queryIndex) => {
    const answer = mapping[query] ?? -1;
    result.push(answer);
    push({ kind: "found", phase: "resolve", title: `Resolve ${query} -> ${answer}`, detail: answer === -1 ? `${query} never found a greater value to its right, so use -1.` : `The mapping already records ${query} -> ${answer}.`, activeLines: [8], index: null, value: null, queryIndex, query, answer, result: [...result] });
  });

  push({ kind: "done", phase: "done", title: "Return the next-greater values", detail: `The answers for nums1 are [${result.join(", ")}].`, activeLines: [8], index: null, value: null, queryIndex: null, query: null, answer: null, result: [...result] });
  return { frames };
}
