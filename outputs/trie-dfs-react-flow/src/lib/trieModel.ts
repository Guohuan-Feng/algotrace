import { MarkerType, Position } from "reactflow";
import type { Edge, Node } from "reactflow";
import type { Cell, TrieNodeModel } from "../types";

export type TrieGraphNodeData = {
  label: string;
  prefix: string;
  word: string | null;
};

export function makeRoot(): TrieNodeModel {
  return { id: "root", label: "root", prefix: "", word: null, children: {} };
}

export function cellKey([r, c]: Cell): string {
  return `${r},${c}`;
}

export function cloneCellSet(set: Set<string>): Cell[] {
  return [...set].map((key) => key.split(",").map(Number) as Cell);
}

export function cloneTrie(node: TrieNodeModel): TrieNodeModel {
  return {
    id: node.id,
    label: node.label,
    prefix: node.prefix,
    word: node.word,
    children: Object.fromEntries(Object.entries(node.children).map(([key, child]) => [key, cloneTrie(child)])),
  };
}

export function ensureTrieChild(node: TrieNodeModel, ch: string, prefix: string): TrieNodeModel {
  if (!node.children[ch]) {
    node.children[ch] = {
      id: `trie-${prefix}`,
      label: ch,
      prefix,
      word: null,
      children: {},
    };
  }

  return node.children[ch];
}

export function findTrieNode(node: TrieNodeModel, id: string): TrieNodeModel | null {
  if (node.id === id) {
    return node;
  }

  for (const child of Object.values(node.children)) {
    const found = findTrieNode(child, id);
    if (found) {
      return found;
    }
  }

  return null;
}

export function flattenTrie(root: TrieNodeModel): { nodes: Node<TrieGraphNodeData>[]; edges: Edge[] } {
  const nodes: Node<TrieGraphNodeData>[] = [];
  const edges: Edge[] = [];
  const positions = new Map<string, { x: number; y: number }>();
  let nextLeaf = 0;
  const horizontalGap = 132;
  const verticalGap = 126;

  function measure(node: TrieNodeModel, depth: number): number {
    const children = Object.values(node.children);
    if (!children.length) {
      const x = nextLeaf * horizontalGap;
      positions.set(node.id, { x, y: depth * verticalGap });
      nextLeaf += 1;
      return x;
    }

    const childXs = children.map((child) => measure(child, depth + 1));
    const x = (childXs[0] + childXs[childXs.length - 1]) / 2;
    positions.set(node.id, { x, y: depth * verticalGap });
    return x;
  }

  function walk(node: TrieNodeModel, parentId: string | null) {
    const position = positions.get(node.id) ?? { x: 0, y: 0 };
    nodes.push({
      id: node.id,
      position,
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      data: { label: node.label, prefix: node.prefix, word: node.word },
      type: "default",
    });

    if (parentId) {
      const parent = findTrieNode(root, parentId);
      const childIndex = parent ? Object.values(parent.children).findIndex((child) => child.id === node.id) : -1;
      edges.push({
        id: `${parentId}-${node.id}`,
        source: parentId,
        target: node.id,
        type: "straight",
        label: childIndex >= 0 ? node.label : "",
        labelBgBorderRadius: 6,
        labelBgPadding: [6, 3],
        labelBgStyle: { fill: "#f7f3ea", fillOpacity: 0.92 },
        labelStyle: { fill: "#46534b", fontSize: 12, fontWeight: 800 },
        markerEnd: { type: MarkerType.ArrowClosed },
        animated: false,
      });
    }

    Object.values(node.children).forEach((child) => walk(child, node.id));
  }

  measure(root, 0);
  const rootPosition = positions.get(root.id) ?? { x: 0, y: 0 };
  positions.forEach((position, id) => {
    positions.set(id, {
      x: position.x - rootPosition.x,
      y: position.y,
    });
  });
  walk(root, null);
  return { nodes, edges };
}
