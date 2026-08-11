import type { FrameKind } from "../../shared/types";

export type CombinationSumNode = {
  id: string;
  label: string;
  path: number[];
  total: number;
  depth: number;
  parentId: string | null;
};

export type CombinationSumFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  activeNodeId: string;
  pathIds: string[];
  completedIds: string[];
  prunedIds: string[];
  start: number;
  currentI: number | null;
  currentCandidate: number | null;
  path: number[];
  total: number;
  stack: string[];
  results: number[][];
  nodes: CombinationSumNode[];
};

const rootNode: CombinationSumNode = {
  id: "combination-sum-root",
  label: "root",
  path: [],
  total: 0,
  depth: 0,
  parentId: null,
};

export function createCombinationSumDryRun(candidates: number[], target: number): { frames: CombinationSumFrame[] } {
  const frames: CombinationSumFrame[] = [];
  const nodes = new Map<string, CombinationSumNode>([[rootNode.id, rootNode]]);
  const completedIds = new Set<string>();
  const prunedIds = new Set<string>();
  const results: number[][] = [];

  const pushFrame = (frame: Omit<CombinationSumFrame, "completedIds" | "nodes" | "prunedIds" | "results">) => {
    frames.push({
      ...frame,
      completedIds: [...completedIds],
      nodes: [...nodes.values()],
      prunedIds: [...prunedIds],
      results: results.map((item) => [...item]),
    });
  };

  pushFrame({
    kind: "start",
    title: "Start",
    detail: `Input candidates = [${candidates.join(", ")}], target = ${target}. Create an empty result list.`,
    activeLines: [4, 5],
    activeNodeId: rootNode.id,
    pathIds: [rootNode.id],
    start: 0,
    currentI: null,
    currentCandidate: null,
    path: [],
    total: 0,
    stack: [],
  });

  pushFrame({
    kind: "start",
    title: "Call backtrack(0, [], 0)",
    detail: "Start from index 0 with an empty path and total = 0.",
    activeLines: [22],
    activeNodeId: rootNode.id,
    pathIds: [rootNode.id],
    start: 0,
    currentI: null,
    currentCandidate: null,
    path: [],
    total: 0,
    stack: ["backtrack(0, [], 0)"],
  });

  backtrack(0, [], 0, rootNode.id, [rootNode.id]);

  pushFrame({
    kind: "done",
    title: "Return result",
    detail: `All branches have been explored. Return ${JSON.stringify(results)}.`,
    activeLines: [23],
    activeNodeId: rootNode.id,
    pathIds: [rootNode.id],
    start: candidates.length,
    currentI: null,
    currentCandidate: null,
    path: [],
    total: 0,
    stack: ["return res"],
  });

  return { frames };

  function backtrack(start: number, path: number[], total: number, nodeId: string, pathIds: string[]) {
    pushFrame({
      kind: "visit",
      title: `Enter backtrack(${start}, [${path.join(", ")}], ${total})`,
      detail: `Current sum is ${total}. Compare it with target = ${target}.`,
      activeLines: [7, 9],
      activeNodeId: nodeId,
      pathIds,
      start,
      currentI: null,
      currentCandidate: null,
      path,
      total,
      stack: [`backtrack(${start}, [${path.join(", ")}], ${total})`],
    });

    if (total === target) {
      results.push([...path]);
      completedIds.add(nodeId);
      pushFrame({
        kind: "found",
        title: `Append [${path.join(", ")}]`,
        detail: `total == target, so [${path.join(", ")}] is a valid combination.`,
        activeLines: [9, 10, 11],
        activeNodeId: nodeId,
        pathIds,
        start,
        currentI: null,
        currentCandidate: null,
        path,
        total,
        stack: [`res.append([${path.join(", ")}])`, "return"],
      });
      return;
    }

    if (total > target) {
      prunedIds.add(nodeId);
      pushFrame({
        kind: "prune",
        title: `Prune total ${total}`,
        detail: `total > target (${total} > ${target}), so this branch returns immediately.`,
        activeLines: [14, 15],
        activeNodeId: nodeId,
        pathIds,
        start,
        currentI: null,
        currentCandidate: null,
        path,
        total,
        stack: [`backtrack(${start}, [${path.join(", ")}], ${total})`, "return"],
      });
      return;
    }

    for (let i = start; i < candidates.length; i += 1) {
      const candidate = candidates[i];
      const nextPath = [...path, candidate];
      const nextTotal = total + candidate;
      const childId = nodeIdForPath(nextPath);
      nodes.set(childId, {
        id: childId,
        label: String(candidate),
        path: nextPath,
        total: nextTotal,
        depth: nextPath.length,
        parentId: nodeId,
      });

      pushFrame({
        kind: "start",
        title: `Choose candidates[${i}] = ${candidate}`,
        detail: `Call backtrack(${i}, [${nextPath.join(", ")}], ${nextTotal}). We pass i again, so ${candidate} can be reused.`,
        activeLines: [17, 18, 19, 20],
        activeNodeId: childId,
        pathIds: [...pathIds, childId],
        start,
        currentI: i,
        currentCandidate: candidate,
        path: nextPath,
        total: nextTotal,
        stack: [
          `backtrack(${start}, [${path.join(", ")}], ${total})`,
          `i = ${i}`,
          `backtrack(${i}, [${nextPath.join(", ")}], ${nextTotal})`,
        ],
      });

      backtrack(i, nextPath, nextTotal, childId, [...pathIds, childId]);

      pushFrame({
        kind: "backtrack",
        title: `Backtrack after ${candidate}`,
        detail: `Return to [${path.join(", ")}], total = ${total}, and try the next candidate index.`,
        activeLines: [17],
        activeNodeId: nodeId,
        pathIds,
        start,
        currentI: i + 1 < candidates.length ? i + 1 : null,
        currentCandidate: i + 1 < candidates.length ? candidates[i + 1] : null,
        path,
        total,
        stack: [`backtrack(${start}, [${path.join(", ")}], ${total})`],
      });
    }
  }
}

export function nodeIdForPath(path: number[]): string {
  return path.length ? `combination-sum-${path.join("-")}` : rootNode.id;
}
