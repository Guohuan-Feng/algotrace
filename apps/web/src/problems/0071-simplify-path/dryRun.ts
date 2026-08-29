import type { FrameKind } from "../../shared/types";

export type SimplifyPathFrame = {
  kind: FrameKind;
  phase: "initialize" | "ignore" | "parent" | "directory" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  index: number | null;
  segment: string | null;
  removed: string | null;
  stack: string[];
  canonical: string;
  result: string | null;
};

export function createSimplifyPathDryRun(path: string): { frames: SimplifyPathFrame[] } {
  const stack: string[] = [];
  const frames: SimplifyPathFrame[] = [];
  const canonical = () => `/${stack.join("/")}`;
  const snapshot = (frame: Omit<SimplifyPathFrame, "stack" | "canonical">) => frames.push({ ...frame, stack: [...stack], canonical: canonical() });

  snapshot({ kind: "start", phase: "initialize", title: "Start with an empty directory stack", detail: "The stack will contain only canonical directory names, with no empty segments or dots.", activeLines: [2, 3], index: null, segment: null, removed: null, result: null });

  path.split("/").forEach((segment, index) => {
    if (!segment || segment === ".") {
      snapshot({ kind: "prune", phase: "ignore", title: `Ignore ${segment ? "'.'" : "an empty segment"}`, detail: "It does not change the current directory.", activeLines: [5, 6], index, segment, removed: null, result: null });
    } else if (segment === "..") {
      const removed = stack.pop() ?? null;
      snapshot({ kind: "backtrack", phase: "parent", title: removed ? `Go up from ${removed}` : "Stay at the root", detail: removed ? `Pop ${removed} to process '..'.` : "There is no parent above the root directory.", activeLines: [7, 8, 9], index, segment, removed, result: null });
    } else {
      stack.push(segment);
      snapshot({ kind: "visit", phase: "directory", title: `Enter ${segment}`, detail: `Push ${segment} as the next canonical directory segment.`, activeLines: [10, 11], index, segment, removed: null, result: null });
    }
  });

  const result = canonical();
  snapshot({ kind: "done", phase: "done", title: "Join the canonical path", detail: `Join the stack with '/': ${result}.`, activeLines: [12], index: null, segment: null, removed: null, result });
  return { frames };
}
