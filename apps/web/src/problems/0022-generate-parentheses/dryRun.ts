import type { FrameKind } from "../../shared/types";

export type ParenthesesNode = {
  id: string;
  label: string;
  path: string;
  left: number;
  right: number;
  depth: number;
  parentId: string | null;
};

export type GenerateParenthesesFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  activeNodeId: string;
  pathIds: string[];
  completedIds: string[];
  blockedChoice: "(" | ")" | null;
  path: string;
  left: number;
  right: number;
  stack: string[];
  results: string[];
  nodes: ParenthesesNode[];
};

const rootNode: ParenthesesNode = {
  id: "paren-root",
  label: "root",
  path: "",
  left: 0,
  right: 0,
  depth: 0,
  parentId: null,
};

export function createGenerateParenthesesDryRun(n: number): { frames: GenerateParenthesesFrame[] } {
  const frames: GenerateParenthesesFrame[] = [];
  const nodes = new Map<string, ParenthesesNode>([[rootNode.id, rootNode]]);
  const completedIds = new Set<string>();
  const results: string[] = [];

  const pushFrame = (frame: Omit<GenerateParenthesesFrame, "completedIds" | "nodes" | "results">) => {
    frames.push({
      ...frame,
      completedIds: [...completedIds],
      nodes: [...nodes.values()],
      results: [...results],
    });
  };

  pushFrame({
    kind: "start",
    title: "Start",
    detail: `Input n = ${n}. Create an empty result list.`,
    activeLines: [4, 5],
    activeNodeId: rootNode.id,
    pathIds: [rootNode.id],
    blockedChoice: null,
    path: "",
    left: 0,
    right: 0,
    stack: [],
  });

  pushFrame({
    kind: "start",
    title: "Call backtrack(\"\", 0, 0)",
    detail: "Start with an empty path, left = 0, and right = 0.",
    activeLines: [18],
    activeNodeId: rootNode.id,
    pathIds: [rootNode.id],
    blockedChoice: null,
    path: "",
    left: 0,
    right: 0,
    stack: ['backtrack("", 0, 0)'],
  });

  backtrack("", 0, 0, rootNode.id, [rootNode.id]);

  pushFrame({
    kind: "done",
    title: "Return result",
    detail: `All valid branches have been explored. Return ${JSON.stringify(results)}.`,
    activeLines: [19],
    activeNodeId: rootNode.id,
    pathIds: [rootNode.id],
    blockedChoice: null,
    path: "",
    left: 0,
    right: 0,
    stack: ["return res"],
  });

  return { frames };

  function backtrack(path: string, left: number, right: number, nodeId: string, pathIds: string[]) {
    pushFrame({
      kind: "visit",
      title: `Enter backtrack("${path}", ${left}, ${right})`,
      detail: `Current length is ${path.length}; target length is ${2 * n}.`,
      activeLines: [7, 8],
      activeNodeId: nodeId,
      pathIds,
      blockedChoice: null,
      path,
      left,
      right,
      stack: [`backtrack("${path}", ${left}, ${right})`],
    });

    if (path.length === 2 * n) {
      results.push(path);
      completedIds.add(nodeId);
      pushFrame({
        kind: "found",
        title: `Append "${path}"`,
        detail: `len(path) == 2 * n, so "${path}" is complete.`,
        activeLines: [8, 9, 10],
        activeNodeId: nodeId,
        pathIds,
        blockedChoice: null,
        path,
        left,
        right,
        stack: [`res.append("${path}")`, "return"],
      });
      return;
    }

    pushFrame({
      kind: "start",
      title: "Check whether '(' is allowed",
      detail: left < n ? `left = ${left} < n = ${n}, so we may add "(".` : `left = ${left} is already n = ${n}, so we cannot add another "(".`,
      activeLines: [12],
      activeNodeId: nodeId,
      pathIds,
      blockedChoice: left < n ? null : "(",
      path,
      left,
      right,
      stack: [`backtrack("${path}", ${left}, ${right})`, "check left < n"],
    });

    if (left < n) {
      const nextPath = `${path}(`;
      const childId = nodeIdForPath(nextPath);
      nodes.set(childId, {
        id: childId,
        label: "(",
        path: nextPath,
        left: left + 1,
        right,
        depth: nextPath.length,
        parentId: nodeId,
      });

      pushFrame({
        kind: "start",
        title: 'Choose "("',
        detail: `Call backtrack("${nextPath}", ${left + 1}, ${right}).`,
        activeLines: [12, 13],
        activeNodeId: childId,
        pathIds: [...pathIds, childId],
        blockedChoice: null,
        path: nextPath,
        left: left + 1,
        right,
        stack: [`backtrack("${path}", ${left}, ${right})`, `backtrack("${nextPath}", ${left + 1}, ${right})`],
      });

      backtrack(nextPath, left + 1, right, childId, [...pathIds, childId]);

      pushFrame({
        kind: "backtrack",
        title: 'Backtrack after "("',
        detail: `Return to path "${path}" and check whether ")" is allowed.`,
        activeLines: [15],
        activeNodeId: nodeId,
        pathIds,
        blockedChoice: null,
        path,
        left,
        right,
        stack: [`backtrack("${path}", ${left}, ${right})`],
      });
    } else {
      pushFrame({
        kind: "prune",
        title: 'Cannot add "("',
        detail: `left < n is false (${left} < ${n} is false).`,
        activeLines: [12],
        activeNodeId: nodeId,
        pathIds,
        blockedChoice: "(",
        path,
        left,
        right,
        stack: [`backtrack("${path}", ${left}, ${right})`, 'skip "("'],
      });
    }

    pushFrame({
      kind: "start",
      title: "Check whether ')' is allowed",
      detail: right < left ? `right = ${right} < left = ${left}, so we may add ")".` : `right = ${right} is not less than left = ${left}, so adding ")" would make the string invalid.`,
      activeLines: [15],
      activeNodeId: nodeId,
      pathIds,
      blockedChoice: right < left ? null : ")",
      path,
      left,
      right,
      stack: [`backtrack("${path}", ${left}, ${right})`, "check right < left"],
    });

    if (right < left) {
      const nextPath = `${path})`;
      const childId = nodeIdForPath(nextPath);
      nodes.set(childId, {
        id: childId,
        label: ")",
        path: nextPath,
        left,
        right: right + 1,
        depth: nextPath.length,
        parentId: nodeId,
      });

      pushFrame({
        kind: "start",
        title: 'Choose ")"',
        detail: `Call backtrack("${nextPath}", ${left}, ${right + 1}).`,
        activeLines: [15, 16],
        activeNodeId: childId,
        pathIds: [...pathIds, childId],
        blockedChoice: null,
        path: nextPath,
        left,
        right: right + 1,
        stack: [`backtrack("${path}", ${left}, ${right})`, `backtrack("${nextPath}", ${left}, ${right + 1})`],
      });

      backtrack(nextPath, left, right + 1, childId, [...pathIds, childId]);

      pushFrame({
        kind: "backtrack",
        title: 'Backtrack after ")"',
        detail: `Return to path "${path}".`,
        activeLines: [15],
        activeNodeId: nodeId,
        pathIds,
        blockedChoice: null,
        path,
        left,
        right,
        stack: [`backtrack("${path}", ${left}, ${right})`],
      });
    } else {
      pushFrame({
        kind: "prune",
        title: 'Cannot add ")"',
        detail: `right < left is false (${right} < ${left} is false).`,
        activeLines: [15],
        activeNodeId: nodeId,
        pathIds,
        blockedChoice: ")",
        path,
        left,
        right,
        stack: [`backtrack("${path}", ${left}, ${right})`, 'skip ")"'],
      });
    }
  }
}

export function nodeIdForPath(path: string): string {
  return path.length ? `paren-${path.replace(/\(/g, "l").replace(/\)/g, "r")}` : rootNode.id;
}
