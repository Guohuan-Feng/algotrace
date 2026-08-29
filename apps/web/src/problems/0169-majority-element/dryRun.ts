import type { FrameKind } from "../../shared/types";

export type MajorityElementFrame = {
  kind: FrameKind;
  phase: "start" | "inspect" | "choose" | "vote" | "cancel" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  index: number | null;
  processed: number;
  candidate: number | null;
  count: number;
  result: number | null;
};

export function createMajorityElementDryRun(nums: number[]): { frames: MajorityElementFrame[] } {
  const frames: MajorityElementFrame[] = [];
  let candidate: number | null = null;
  let count = 0;
  let processed = 0;

  const snapshot = (frame: Omit<MajorityElementFrame, "candidate" | "count" | "processed">) => {
    frames.push({ ...frame, candidate, count, processed });
  };

  snapshot({ kind: "start", phase: "start", title: "Start with no candidate", detail: "A majority survives every cancellation because it appears more than all other values combined.", activeLines: [2, 3], index: null, result: null });

  nums.forEach((num, index) => {
    snapshot({ kind: "visit", phase: "inspect", title: `Inspect nums[${index}] = ${num}`, detail: "Compare this value with the current candidate and the vote count.", activeLines: [5], index, result: null });

    if (count === 0) {
      candidate = num;
      snapshot({ kind: "build", phase: "choose", title: `Choose ${num} as the new candidate`, detail: "The previous votes completely cancelled out, so this value starts the next surviving group.", activeLines: [6, 7], index, result: null });
    }

    if (num === candidate) {
      count += 1;
      processed = index + 1;
      snapshot({ kind: "found", phase: "vote", title: `Vote for candidate ${candidate}`, detail: `${num} matches candidate ${candidate}, so count increases to ${count}.`, activeLines: [8], index, result: null });
    } else {
      count -= 1;
      processed = index + 1;
      snapshot({ kind: "backtrack", phase: "cancel", title: `Cancel ${num} against candidate ${candidate}`, detail: `${num} differs from ${candidate}, so one opposing pair cancels and count becomes ${count}.`, activeLines: [8], index, result: null });
    }
  });

  snapshot({ kind: "done", phase: "done", title: `Return surviving candidate ${candidate}`, detail: "All distinct-value pairs have cancelled. The remaining candidate is the majority element.", activeLines: [10], index: null, result: candidate });
  return { frames };
}
