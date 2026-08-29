import type { FrameKind } from "../../shared/types";

export type PartitionListFrame = {
  kind: FrameKind;
  phase: "initialize" | "inspect" | "small" | "large" | "join" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  values: number[];
  x: number;
  currentIndex: number | null;
  processed: number[];
  small: number[];
  large: number[];
  result: number[] | null;
};

export function createPartitionListDryRun(values: number[], x: number): { frames: PartitionListFrame[] } {
  const frames: PartitionListFrame[] = [];
  const small: number[] = [];
  const large: number[] = [];
  const processed: number[] = [];
  const snapshot = (frame: Omit<PartitionListFrame, "values" | "x" | "processed" | "small" | "large">) => { frames.push({ ...frame, values: [...values], x, processed: [...processed], small: [...small], large: [...large] }); };
  snapshot({ kind: "start", phase: "initialize", title: "Create two dummy-headed lists", detail: "small collects values below x and large collects values at least x. Both preserve input order.", activeLines: [2, 3, 4, 5], currentIndex: null, result: null });
  values.forEach((value, currentIndex) => {
    snapshot({ kind: "visit", phase: "inspect", title: "Inspect node " + value, detail: "Compare " + value + " with pivot x = " + x + " to choose the destination list.", activeLines: [7, 8], currentIndex, result: null });
    processed.push(currentIndex);
    if (value < x) {
      small.push(value);
      snapshot({ kind: "build", phase: "small", title: "Append " + value + " to the small list", detail: value + " < " + x + ", so connect small.next to this node and advance small.", activeLines: [9, 10], currentIndex, result: null });
    } else {
      large.push(value);
      snapshot({ kind: "build", phase: "large", title: "Append " + value + " to the large list", detail: value + " >= " + x + ", so connect large.next to this node and advance large.", activeLines: [12, 13], currentIndex, result: null });
    }
  });
  const result = [...small, ...large];
  snapshot({ kind: "build", phase: "join", title: "Connect small tail to large head", detail: "Terminate large.next with None, then set small.next = large_dummy.next. The final list is [" + result.join(", ") + "].", activeLines: [16, 17], currentIndex: null, result: null });
  snapshot({ kind: "done", phase: "done", title: "Return the partitioned list", detail: "Every node below " + x + " appears before every node at least " + x + ", while both internal orders are unchanged.", activeLines: [19], currentIndex: null, result });
  return { frames };
}
