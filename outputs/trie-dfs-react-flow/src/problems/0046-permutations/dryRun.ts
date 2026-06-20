import type { FrameKind } from "../../types";

export type PermutationChoiceNode = {
  id: string;
  label: string;
  path: number[];
  depth: number;
  parentId: string | null;
};

export type PermutationsFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  activeNodeId: string;
  pathIds: string[];
  completedIds: string[];
  currentNum: number | null;
  skippedNum: number | null;
  path: number[];
  stack: string[];
  results: number[][];
  nodes: PermutationChoiceNode[];
};

const rootNode: PermutationChoiceNode = {
  id: "permute-root",
  label: "root",
  path: [],
  depth: 0,
  parentId: null,
};

export function createPermutationsDryRun(nums: number[]): { frames: PermutationsFrame[] } {
  const frames: PermutationsFrame[] = [];
  const nodes = new Map<string, PermutationChoiceNode>([[rootNode.id, rootNode]]);
  const completedIds = new Set<string>();
  const results: number[][] = [];

  const pushFrame = (frame: Omit<PermutationsFrame, "completedIds" | "nodes" | "results">) => {
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
    detail: `Input nums = [${nums.join(", ")}]. Create an empty result list.`,
    activeLines: [4, 5],
    activeNodeId: rootNode.id,
    pathIds: [rootNode.id],
    currentNum: null,
    skippedNum: null,
    path: [],
    stack: [],
  });

  pushFrame({
    kind: "start",
    title: "Call backtrack([])",
    detail: "Start DFS with an empty path.",
    activeLines: [22],
    activeNodeId: rootNode.id,
    pathIds: [rootNode.id],
    currentNum: null,
    skippedNum: null,
    path: [],
    stack: ["backtrack([])"],
  });

  backtrack([], rootNode.id, [rootNode.id]);

  pushFrame({
    kind: "done",
    title: "Return result",
    detail: `All branches have been explored. Return ${JSON.stringify(results)}.`,
    activeLines: [23],
    activeNodeId: rootNode.id,
    pathIds: [rootNode.id],
    currentNum: null,
    skippedNum: null,
    path: [],
    stack: ["return res"],
  });

  return { frames };

  function backtrack(path: number[], nodeId: string, pathIds: string[]) {
    pushFrame({
      kind: "visit",
      title: `Enter backtrack([${path.join(", ")}])`,
      detail: `Current path length is ${path.length}; need len(nums) = ${nums.length}.`,
      activeLines: [7, 9],
      activeNodeId: nodeId,
      pathIds,
      currentNum: null,
      skippedNum: null,
      path,
      stack: [`backtrack([${path.join(", ")}])`],
    });

    if (path.length === nums.length) {
      results.push([...path]);
      completedIds.add(nodeId);
      pushFrame({
        kind: "found",
        title: `Append [${path.join(", ")}]`,
        detail: `len(path) == len(nums), so [${path.join(", ")}] is a complete permutation.`,
        activeLines: [9, 10, 11],
        activeNodeId: nodeId,
        pathIds,
        currentNum: null,
        skippedNum: null,
        path,
        stack: [`res.append([${path.join(", ")}])`, "return"],
      });
      return;
    }

    for (const num of nums) {
      pushFrame({
        kind: "start",
        title: `Try ${num}`,
        detail: `Loop over nums again. Check whether ${num} is already in the current path.`,
        activeLines: [14, 16],
        activeNodeId: nodeId,
        pathIds,
        currentNum: num,
        skippedNum: null,
        path,
        stack: [`backtrack([${path.join(", ")}])`, `num = ${num}`],
      });

      if (path.includes(num)) {
        pushFrame({
          kind: "prune",
          title: `Skip ${num}`,
          detail: `${num} is already in path [${path.join(", ")}], so this branch continues to the next number.`,
          activeLines: [16, 17],
          activeNodeId: nodeId,
          pathIds,
          currentNum: num,
          skippedNum: num,
          path,
          stack: [`backtrack([${path.join(", ")}])`, `num = ${num}`, "continue"],
        });
        continue;
      }

      const nextPath = [...path, num];
      const childId = nodeIdForPath(nextPath);
      nodes.set(childId, {
        id: childId,
        label: String(num),
        path: nextPath,
        depth: nextPath.length,
        parentId: nodeId,
      });

      pushFrame({
        kind: "start",
        title: `Choose ${num}`,
        detail: `Create a new list path + [${num}] and call backtrack([${nextPath.join(", ")}]).`,
        activeLines: [19, 20],
        activeNodeId: childId,
        pathIds: [...pathIds, childId],
        currentNum: num,
        skippedNum: null,
        path: nextPath,
        stack: [
          `backtrack([${path.join(", ")}])`,
          `num = ${num}`,
          `backtrack([${nextPath.join(", ")}])`,
        ],
      });

      backtrack(nextPath, childId, [...pathIds, childId]);

      pushFrame({
        kind: "backtrack",
        title: `Backtrack after ${num}`,
        detail: `Return to path [${path.join(", ")}] and keep scanning nums.`,
        activeLines: [14],
        activeNodeId: nodeId,
        pathIds,
        currentNum: num,
        skippedNum: null,
        path,
        stack: [`backtrack([${path.join(", ")}])`],
      });
    }
  }
}

export function nodeIdForPath(path: number[]): string {
  return path.length ? `permute-${path.join("-")}` : rootNode.id;
}
