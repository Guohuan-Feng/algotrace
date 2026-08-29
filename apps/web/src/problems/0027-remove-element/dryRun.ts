import type { FrameKind } from "../../shared/types";

export type RemoveElementFrame = {
  kind: FrameKind;
  phase: "initialize" | "inspect" | "write" | "skip" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  nums: number[];
  val: number;
  read: number | null;
  write: number;
  result: { k: number | null; nums: number[] };
};

export function createRemoveElementDryRun(input: number[], val: number): { frames: RemoveElementFrame[] } {
  const nums = [...input];
  const frames: RemoveElementFrame[] = [];
  let write = 0;
  const snapshot = (frame: Omit<RemoveElementFrame, "nums" | "val" | "write" | "result"> & { resultK?: number | null }) => frames.push({ ...frame, nums: [...nums], val, write, result: { k: frame.resultK ?? null, nums: nums.slice(0, frame.resultK ?? write) } });
  snapshot({ kind: "start", phase: "initialize", title: "Reserve the first write position", detail: "write = 0 marks where the next value different from " + val + " will go.", activeLines: [2], read: null });
  for (let read = 0; read < nums.length; read += 1) {
    snapshot({ kind: "visit", phase: "inspect", title: "Inspect nums[" + read + "]", detail: "Read value " + nums[read] + " and compare it with val = " + val + ".", activeLines: [4, 5], read });
    if (nums[read] !== val) {
      nums[write] = nums[read]!;
      snapshot({ kind: "build", phase: "write", title: "Keep the value at write", detail: nums[read] + " is not " + val + ", so write it into index " + write + ".", activeLines: [5, 6], read });
      write += 1;
      snapshot({ kind: "build", phase: "write", title: "Advance write", detail: "The valid prefix now has " + write + " value" + (write === 1 ? "" : "s") + ".", activeLines: [7], read });
    } else {
      snapshot({ kind: "prune", phase: "skip", title: "Skip the target value", detail: nums[read] + " equals " + val + ", so read advances but write stays at " + write + ".", activeLines: [5], read });
    }
  }
  snapshot({ kind: "done", phase: "done", title: "Return the retained length", detail: "Only nums[0:" + write + "] matters; return k = " + write + ".", activeLines: [9], read: null, resultK: write });
  return { frames };
}
