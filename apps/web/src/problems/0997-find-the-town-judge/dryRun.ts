import type { FrameKind } from "../../shared/types";

export type FindTownJudgeFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  n: number;
  trust: number[][];
  indegree: number[];
  outdegree: number[];
  currentTrust: [number, number] | null;
  candidate: number | null;
  result: number | null;
};

export function createFindTownJudgeDryRun(n: number, trust: number[][]): { frames: FindTownJudgeFrame[] } {
  const indegree = Array(n + 1).fill(0);
  const outdegree = Array(n + 1).fill(0);
  const frames: FindTownJudgeFrame[] = [];
  const push = (frame: Omit<FindTownJudgeFrame, "n" | "trust" | "indegree" | "outdegree">) => frames.push({ ...frame, n, trust: trust.map((pair) => [...pair]), indegree: [...indegree], outdegree: [...outdegree] });
  push({ kind: "build", title: "Create indegree and outdegree arrays", detail: "Indices 1 through n represent people; index 0 is unused.", activeLines: [3, 4], currentTrust: null, candidate: null, result: null });
  for (const [from, to] of trust) {
    if (from < 1 || from > n || to < 1 || to > n) continue;
    push({ kind: "visit", title: `${from} trusts ${to}`, detail: "One outgoing edge leaves the truster and one incoming edge reaches the trusted person.", activeLines: [6], currentTrust: [from, to], candidate: null, result: null });
    outdegree[from] += 1;
    indegree[to] += 1;
    push({ kind: "build", title: `outdegree[${from}] = ${outdegree[from]}, indegree[${to}] = ${indegree[to]}`, detail: "Update both degree counters for this trust relation.", activeLines: [7, 8], currentTrust: [from, to], candidate: null, result: null });
  }
  for (let person = 1; person <= n; person += 1) {
    const isJudge = indegree[person] === n - 1 && outdegree[person] === 0;
    push({ kind: "visit", title: `Check person ${person}`, detail: `indegree = ${indegree[person]}, outdegree = ${outdegree[person]}; a judge needs ${n - 1} incoming and 0 outgoing.`, activeLines: [10, 11], currentTrust: null, candidate: person, result: null });
    if (isJudge) {
      push({ kind: "done", title: `Return judge ${person}`, detail: "Everyone else trusts this person, and this person trusts nobody.", activeLines: [11, 12], currentTrust: null, candidate: person, result: person });
      return { frames };
    }
  }
  push({ kind: "done", title: "Return -1", detail: "No person satisfies both required degree conditions.", activeLines: [14], currentTrust: null, candidate: null, result: -1 });
  return { frames };
}
