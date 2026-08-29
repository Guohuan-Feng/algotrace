import type { FrameKind } from "../../shared/types";

export type AddTwoNumbersFrame = {
  kind: FrameKind;
  phase: "initialize" | "read" | "append" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  index: number | null;
  leftIndex: number | null;
  rightIndex: number | null;
  leftValue: number | null;
  rightValue: number | null;
  sum: number | null;
  digit: number | null;
  carry: number;
  result: number[];
};

export function createAddTwoNumbersDryRun(left: number[], right: number[]): { frames: AddTwoNumbersFrame[] } {
  const result: number[] = [];
  const frames: AddTwoNumbersFrame[] = [];
  let leftIndex = 0;
  let rightIndex = 0;
  let carry = 0;
  let index = 0;
  const snapshot = (frame: Omit<AddTwoNumbersFrame, "carry" | "result">) => frames.push({ ...frame, carry, result: [...result] });

  snapshot({ kind: "start", phase: "initialize", title: "Create a dummy result head", detail: "The result tail will append one digit for each linked-list position.", activeLines: [2, 3, 4], index: null, leftIndex: null, rightIndex: null, leftValue: null, rightValue: null, sum: null, digit: null });

  while (leftIndex < left.length || rightIndex < right.length || carry) {
    const leftValue = left[leftIndex] ?? 0;
    const rightValue = right[rightIndex] ?? 0;
    const sum = leftValue + rightValue + carry;
    snapshot({ kind: "visit", phase: "read", title: `Add position ${index}`, detail: `${leftValue} + ${rightValue} + carry ${carry} = ${sum}.`, activeLines: [5, 6, 7], index, leftIndex: leftIndex < left.length ? leftIndex : null, rightIndex: rightIndex < right.length ? rightIndex : null, leftValue, rightValue, sum, digit: null });
    const digit = sum % 10;
    carry = Math.floor(sum / 10);
    result.push(digit);
    snapshot({ kind: "build", phase: "append", title: `Append result digit ${digit}`, detail: `Store ${digit} in the new node and carry ${carry} to the next position.`, activeLines: [8, 9, 10], index, leftIndex: leftIndex < left.length ? leftIndex : null, rightIndex: rightIndex < right.length ? rightIndex : null, leftValue, rightValue, sum, digit });
    leftIndex += 1;
    rightIndex += 1;
    index += 1;
  }

  snapshot({ kind: "done", phase: "done", title: "Return the result head", detail: `The result linked list is [${result.join(", ")}].`, activeLines: [11], index: null, leftIndex: null, rightIndex: null, leftValue: null, rightValue: null, sum: null, digit: null });
  return { frames };
}
