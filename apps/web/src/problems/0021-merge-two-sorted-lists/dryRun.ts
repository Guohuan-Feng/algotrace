import type { FrameKind } from "../../shared/types";

export type MergeTwoListsFrame = {
  kind: FrameKind;
  phase: "initialize" | "compare" | "take-left" | "take-right" | "append-rest" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  list1: number[];
  list2: number[];
  leftIndex: number;
  rightIndex: number;
  result: number[];
};

export function createMergeTwoListsDryRun(list1: number[], list2: number[]): { frames: MergeTwoListsFrame[] } {
  const frames: MergeTwoListsFrame[] = [];
  const result: number[] = [];
  let leftIndex = 0;
  let rightIndex = 0;
  const snapshot = (frame: Omit<MergeTwoListsFrame, "list1" | "list2" | "leftIndex" | "rightIndex" | "result">) => frames.push({ ...frame, list1: [...list1], list2: [...list2], leftIndex, rightIndex, result: [...result] });

  snapshot({ kind: "start", phase: "initialize", title: "Start a merged list with dummy", detail: "cur begins at dummy; list1 and list2 both still point at their first nodes.", activeLines: [2, 3] });
  while (leftIndex < list1.length && rightIndex < list2.length) {
    snapshot({ kind: "visit", phase: "compare", title: "Compare the two front nodes", detail: list1[leftIndex] + " from list1 versus " + list2[rightIndex] + " from list2.", activeLines: [5, 6] });
    if (list1[leftIndex]! < list2[rightIndex]!) {
      result.push(list1[leftIndex]!);
      leftIndex += 1;
      snapshot({ kind: "build", phase: "take-left", title: "Attach the smaller list1 node", detail: "Append " + result[result.length - 1] + " and advance list1 to its next node.", activeLines: [6, 7, 8, 12] });
    } else {
      result.push(list2[rightIndex]!);
      rightIndex += 1;
      snapshot({ kind: "build", phase: "take-right", title: "Attach the smaller list2 node", detail: "Append " + result[result.length - 1] + " and advance list2 to its next node.", activeLines: [9, 10, 11, 12] });
    }
  }
  const rest = leftIndex < list1.length ? list1.slice(leftIndex) : list2.slice(rightIndex);
  result.push(...rest);
  leftIndex = list1.length;
  rightIndex = list2.length;
  snapshot({ kind: "build", phase: "append-rest", title: "Append the remaining suffix", detail: "One source list is empty, so the rest is already sorted and can attach as-is.", activeLines: [14] });
  snapshot({ kind: "done", phase: "done", title: "Return dummy.next", detail: "The merged chain is [" + result.join(", ") + "].", activeLines: [15] });
  return { frames };
}
