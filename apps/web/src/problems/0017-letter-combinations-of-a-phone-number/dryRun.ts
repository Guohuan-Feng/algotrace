import type { FrameKind } from "../../shared/types";
import { phoneMap } from "./data";

export type CombinationTreeNode = {
  id: string;
  label: string;
  path: string;
  depth: number;
  parentId: string | null;
};

export type LetterCombinationFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  activeNodeId: string;
  pathIds: string[];
  completedIds: string[];
  currentDigit: string | null;
  letters: string;
  currentChar: string | null;
  index: number;
  path: string;
  stack: string[];
  results: string[];
  nodes: CombinationTreeNode[];
};

const rootNode: CombinationTreeNode = {
  id: "combo-root",
  label: "root",
  path: "",
  depth: 0,
  parentId: null,
};

export function createLetterCombinationDryRun(digits: string): { frames: LetterCombinationFrame[] } {
  const frames: LetterCombinationFrame[] = [];
  const nodes = new Map<string, CombinationTreeNode>([[rootNode.id, rootNode]]);
  const completedIds = new Set<string>();
  const results: string[] = [];

  const pushFrame = (frame: Omit<LetterCombinationFrame, "completedIds" | "nodes" | "results">) => {
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
    detail: `Input digits = "${digits}". First check whether the input is empty.`,
    activeLines: [4, 5],
    activeNodeId: rootNode.id,
    pathIds: [rootNode.id],
    currentDigit: null,
    letters: "",
    currentChar: null,
    index: 0,
    path: "",
    stack: [],
  });

  if (!digits) {
    pushFrame({
      kind: "done",
      title: "Empty input",
      detail: "digits is empty, so return [] immediately.",
      activeLines: [5, 6],
      activeNodeId: rootNode.id,
      pathIds: [rootNode.id],
      currentDigit: null,
      letters: "",
      currentChar: null,
      index: 0,
      path: "",
      stack: ["return []"],
    });
    return { frames };
  }

  pushFrame({
    kind: "build",
    title: "Prepare phone map",
    detail: "Create the digit-to-letters map and an empty result list.",
    activeLines: [8, 19],
    activeNodeId: rootNode.id,
    pathIds: [rootNode.id],
    currentDigit: null,
    letters: "",
    currentChar: null,
    index: 0,
    path: "",
    stack: [],
  });

  pushFrame({
    kind: "start",
    title: "Call dfs(0, \"\")",
    detail: "Start DFS at index 0 with an empty path.",
    activeLines: [31],
    activeNodeId: rootNode.id,
    pathIds: [rootNode.id],
    currentDigit: digits[0],
    letters: "",
    currentChar: null,
    index: 0,
    path: "",
    stack: ['dfs(0, "")'],
  });

  dfs(0, "", rootNode.id, [rootNode.id]);

  pushFrame({
    kind: "done",
    title: "Return result",
    detail: `DFS has explored every branch. Return ${JSON.stringify(results)}.`,
    activeLines: [32],
    activeNodeId: rootNode.id,
    pathIds: [rootNode.id],
    currentDigit: null,
    letters: "",
    currentChar: null,
    index: digits.length,
    path: "",
    stack: ["return res"],
  });

  return { frames };

  function dfs(index: number, path: string, nodeId: string, pathIds: string[]) {
    pushFrame({
      kind: "visit",
      title: `Enter dfs(${index}, "${path}")`,
      detail: `Current path is "${path || "empty"}"; index points to digits[${index}].`,
      activeLines: [21, 22],
      activeNodeId: nodeId,
      pathIds,
      currentDigit: digits[index] ?? null,
      letters: "",
      currentChar: null,
      index,
      path,
      stack: [`dfs(${index}, "${path}")`],
    });

    if (index === digits.length) {
      results.push(path);
      completedIds.add(nodeId);
      pushFrame({
        kind: "found",
        title: `Append "${path}"`,
        detail: "index == len(digits), so the path is a complete combination.",
        activeLines: [22, 23, 24],
        activeNodeId: nodeId,
        pathIds,
        currentDigit: null,
        letters: "",
        currentChar: null,
        index,
        path,
        stack: [`res.append("${path}")`, "return"],
      });
      return;
    }

    const digit = digits[index] as keyof typeof phoneMap;
    const letters = phoneMap[digit] ?? "";
    pushFrame({
      kind: "build",
      title: `Read letters for "${digit}"`,
      detail: `digits[${index}] is "${digit}", so letters = "${letters}".`,
      activeLines: [26],
      activeNodeId: nodeId,
      pathIds,
      currentDigit: digit,
      letters,
      currentChar: null,
      index,
      path,
      stack: [`dfs(${index}, "${path}")`, `letters = "${letters}"`],
    });

    for (const ch of letters) {
      const nextPath = path + ch;
      const childId = nodeIdForPath(nextPath);
      nodes.set(childId, {
        id: childId,
        label: ch,
        path: nextPath,
        depth: index + 1,
        parentId: nodeId,
      });

      pushFrame({
        kind: "start",
        title: `Choose "${ch}"`,
        detail: `Append "${ch}" to path "${path}", then call dfs(${index + 1}, "${nextPath}").`,
        activeLines: [28, 29],
        activeNodeId: childId,
        pathIds: [...pathIds, childId],
        currentDigit: digit,
        letters,
        currentChar: ch,
        index,
        path: nextPath,
        stack: [`dfs(${index}, "${path}")`, `ch = "${ch}"`, `dfs(${index + 1}, "${nextPath}")`],
      });

      dfs(index + 1, nextPath, childId, [...pathIds, childId]);

      pushFrame({
        kind: "backtrack",
        title: `Backtrack from "${nextPath}"`,
        detail: `Return to path "${path || "empty"}" and continue the for-loop.`,
        activeLines: [28],
        activeNodeId: nodeId,
        pathIds,
        currentDigit: digit,
        letters,
        currentChar: null,
        index,
        path,
        stack: [`dfs(${index}, "${path}")`],
      });
    }
  }
}

export function nodeIdForPath(path: string): string {
  return path ? `combo-${path}` : rootNode.id;
}
