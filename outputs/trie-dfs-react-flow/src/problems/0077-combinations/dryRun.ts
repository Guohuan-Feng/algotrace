import type { FrameKind } from "../../types";

export type CombinationChoiceNode = {
  id: string;
  label: string;
  path: number[];
  depth: number;
  parentId: string | null;
};

export type CombinationsFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  activeNodeId: string;
  pathIds: string[];
  completedIds: string[];
  start: number;
  currentI: number | null;
  path: number[];
  stack: string[];
  results: number[][];
  nodes: CombinationChoiceNode[];
};

const rootNode: CombinationChoiceNode = {
  id: "combine-root",
  label: "root",
  path: [],
  depth: 0,
  parentId: null,
};

export function createCombinationsDryRun(n: number, k: number): { frames: CombinationsFrame[] } {
  const frames: CombinationsFrame[] = [];
  const nodes = new Map<string, CombinationChoiceNode>([[rootNode.id, rootNode]]);
  const completedIds = new Set<string>();
  const results: number[][] = [];

  const pushFrame = (frame: Omit<CombinationsFrame, "completedIds" | "nodes" | "results">) => {
    frames.push({
      ...frame,
      completedIds: [...completedIds],
      nodes: [...nodes.values()],
      results: results.map((item) => [...item]),
    });
  };

  pushFrame({
    kind: "start",
    title: "Start",
    detail: `Input n = ${n}, k = ${k}. Create an empty result list.`,
    activeLines: [4, 5],
    activeNodeId: rootNode.id,
    pathIds: [rootNode.id],
    start: 1,
    currentI: null,
    path: [],
    stack: [],
  });

  pushFrame({
    kind: "start",
    title: "Call backtrack(1, [])",
    detail: "Start from number 1 with an empty path.",
    activeLines: [15],
    activeNodeId: rootNode.id,
    pathIds: [rootNode.id],
    start: 1,
    currentI: null,
    path: [],
    stack: ["backtrack(1, [])"],
  });

  backtrack(1, [], rootNode.id, [rootNode.id]);

  pushFrame({
    kind: "done",
    title: "Return result",
    detail: `All branches have been explored. Return ${JSON.stringify(results)}.`,
    activeLines: [16],
    activeNodeId: rootNode.id,
    pathIds: [rootNode.id],
    start: n + 1,
    currentI: null,
    path: [],
    stack: ["return res"],
  });

  return { frames };

  function backtrack(start: number, path: number[], nodeId: string, pathIds: string[]) {
    pushFrame({
      kind: "visit",
      title: `Enter backtrack(${start}, [${path.join(", ")}])`,
      detail: `Current path length is ${path.length}; need k = ${k}.`,
      activeLines: [7, 8],
      activeNodeId: nodeId,
      pathIds,
      start,
      currentI: null,
      path,
      stack: [`backtrack(${start}, [${path.join(", ")}])`],
    });

    if (path.length === k) {
      results.push([...path]);
      completedIds.add(nodeId);
      pushFrame({
        kind: "found",
        title: `Append [${path.join(", ")}]`,
        detail: `len(path) == k, so [${path.join(", ")}] is a complete combination.`,
        activeLines: [8, 9, 10],
        activeNodeId: nodeId,
        pathIds,
        start,
        currentI: null,
        path,
        stack: [`res.append([${path.join(", ")}])`, "return"],
      });
      return;
    }

    if (start > n) {
      pushFrame({
        kind: "prune",
        title: "No numbers left",
        detail: `start = ${start} is greater than n = ${n}, so this branch returns.`,
        activeLines: [12],
        activeNodeId: nodeId,
        pathIds,
        start,
        currentI: null,
        path,
        stack: [`backtrack(${start}, [${path.join(", ")}])`, "return"],
      });
      return;
    }

    for (let i = start; i <= n; i += 1) {
      const nextPath = [...path, i];
      const childId = nodeIdForPath(nextPath);
      nodes.set(childId, {
        id: childId,
        label: String(i),
        path: nextPath,
        depth: nextPath.length,
        parentId: nodeId,
      });

      pushFrame({
        kind: "start",
        title: `Choose ${i}`,
        detail: `for i = ${i}: call backtrack(${i + 1}, [${nextPath.join(", ")}]).`,
        activeLines: [12, 13],
        activeNodeId: childId,
        pathIds: [...pathIds, childId],
        start,
        currentI: i,
        path: nextPath,
        stack: [
          `backtrack(${start}, [${path.join(", ")}])`,
          `i = ${i}`,
          `backtrack(${i + 1}, [${nextPath.join(", ")}])`,
        ],
      });

      backtrack(i + 1, nextPath, childId, [...pathIds, childId]);

      pushFrame({
        kind: "backtrack",
        title: `Backtrack after ${i}`,
        detail: `Return to [${path.join(", ")}] and try the next i.`,
        activeLines: [12],
        activeNodeId: nodeId,
        pathIds,
        start,
        currentI: i < n ? i + 1 : null,
        path,
        stack: [`backtrack(${start}, [${path.join(", ")}])`],
      });
    }
  }
}

export function nodeIdForPath(path: number[]): string {
  return path.length ? `combine-${path.join("-")}` : rootNode.id;
}
