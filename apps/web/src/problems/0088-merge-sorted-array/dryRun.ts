import type { FrameKind } from "../../shared/types";

export type MergeSortedArrayFrame = {
  kind: FrameKind;
  phase: "initialize" | "compare" | "write-first" | "write-second" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  nums1: number[];
  nums2: number[];
  m: number;
  n: number;
  p1: number;
  p2: number;
  write: number;
  chosen: "nums1" | "nums2" | null;
  result: number[] | null;
};

export function createMergeSortedArrayDryRun(initialNums1: number[], m: number, nums2: number[], n: number): { frames: MergeSortedArrayFrame[] } {
  const frames: MergeSortedArrayFrame[] = [];
  const nums1 = [...initialNums1];
  let p1 = m - 1;
  let p2 = n - 1;
  let write = m + n - 1;
  const snapshot = (frame: Omit<MergeSortedArrayFrame, "nums1" | "nums2" | "m" | "n" | "p1" | "p2" | "write">) => { frames.push({ ...frame, nums1: [...nums1], nums2: [...nums2], m, n, p1, p2, write }); };
  snapshot({ kind: "start", phase: "initialize", title: "Start writing from the spare tail slots", detail: "p1 and p2 point to the largest unread numbers. write starts at the final slot in nums1, so no live value is overwritten.", activeLines: [2, 3], chosen: null, result: null });
  while (p2 >= 0) {
    snapshot({ kind: "visit", phase: "compare", title: "Compare the two largest unread values", detail: "nums1[" + p1 + "] = " + (p1 >= 0 ? nums1[p1] : "none") + "; nums2[" + p2 + "] = " + nums2[p2] + ". Write the larger one at index " + write + ".", activeLines: [5, 6], chosen: null, result: null });
    if (p1 >= 0 && nums1[p1]! > nums2[p2]!) {
      nums1[write] = nums1[p1]!;
      p1 -= 1;
      snapshot({ kind: "build", phase: "write-first", title: "Write from nums1 at index " + write, detail: "The nums1 candidate is larger, so copy it into the tail and move p1 left.", activeLines: [7, 8], chosen: "nums1", result: null });
    } else {
      nums1[write] = nums2[p2]!;
      p2 -= 1;
      snapshot({ kind: "build", phase: "write-second", title: "Write from nums2 at index " + write, detail: "The nums2 candidate is larger or nums1 is exhausted, so copy it into nums1 and move p2 left.", activeLines: [10, 11], chosen: "nums2", result: null });
    }
    write -= 1;
  }
  snapshot({ kind: "done", phase: "done", title: "nums1 now contains the merged order", detail: "All nums2 values are placed. Any remaining nums1 prefix was already in the correct location.", activeLines: [13], chosen: null, result: [...nums1] });
  return { frames };
}
