import type { FrameKind } from "../../shared/types";

export type NaryNodeInput = { value: number; children: NaryNodeInput[] };
export type NaryDepthFrame = {
  kind: FrameKind;
  phase: "start" | "visit" | "leaf" | "return" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  activeId: string | null;
  completedIds: string[];
  nodeValue: number | null;
  depth: number;
  result: number | null;
};

type Node = NaryNodeInput & { id: string; children: Node[] };

export function createMaximumDepthNaryDryRun(input: NaryNodeInput | null): { frames: NaryDepthFrame[] } {
  const root = input ? identify(input, "root") : null;
  const frames: NaryDepthFrame[] = [];
  const completed = new Set<string>();
  let currentDepth = 0;
  const push = (frame: Omit<NaryDepthFrame, "completedIds" | "nodeValue" | "depth"> & { nodeValue?: number | null; depth?: number }) => {
    frames.push({ ...frame, nodeValue: frame.nodeValue ?? null, depth: frame.depth ?? currentDepth, completedIds: [...completed] });
  };

  push({ kind: "start", phase: "start", title: "Start at the root", detail: "Depth is the number of nodes on the current root-to-node path.", activeLines: [2, 11], activeId: root?.id ?? null, result: null, depth: 0 });
  const result = depth(root, 1);
  push({ kind: "done", phase: "done", title: `Maximum depth = ${result}`, detail: "The deepest recursive branch determines the answer.", activeLines: [11], activeId: null, result, depth: result });
  return { frames };

  function depth(node: Node | null, level: number): number {
    if (!node) return 0;
    currentDepth = level;
    push({ kind: "visit", phase: "visit", title: `Visit node ${node.value} at depth ${level}`, detail: "Ask each child subtree for its own maximum depth.", activeLines: [3, 4], activeId: node.id, nodeValue: node.value, result: null });
    if (!node.children.length) {
      completed.add(node.id);
      push({ kind: "found", phase: "leaf", title: `${node.value} is a leaf`, detail: `This path has depth ${level}.`, activeLines: [5, 6], activeId: node.id, nodeValue: node.value, result: null });
      return 1;
    }
    let childMax = 0;
    for (const child of node.children) childMax = Math.max(childMax, depth(child, level + 1));
    completed.add(node.id);
    push({ kind: "build", phase: "return", title: `Return ${childMax + 1} from node ${node.value}`, detail: "Add this node above the deepest child subtree.", activeLines: [7, 8], activeId: node.id, nodeValue: node.value, result: null });
    return childMax + 1;
  }
}

function identify(input: NaryNodeInput, id: string): Node {
  return { value: input.value, id, children: input.children.map((child, index) => identify(child, `${id}-${index}`)) };
}
