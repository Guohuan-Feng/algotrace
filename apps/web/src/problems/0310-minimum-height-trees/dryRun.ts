import type { FrameKind } from "../../shared/types";

export type MinimumHeightTreesFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  graph: number[][];
  degree: number[];
  queue: number[];
  remaining: number;
  current: number | null;
  neighbor: number | null;
  result: number[] | null;
};

export function createMinimumHeightTreesDryRun(n: number, edges: number[][]): { frames: MinimumHeightTreesFrame[] } {
  const graph = Array.from({ length: n }, () => [] as number[]);
  const degree = Array<number>(n).fill(0);
  const queue: number[] = [];
  const frames: MinimumHeightTreesFrame[] = [];
  let remaining = n;
  const push = (frame: Omit<MinimumHeightTreesFrame, "graph" | "degree" | "queue" | "remaining">) => frames.push({
    ...frame,
    graph: graph.map((neighbors) => [...neighbors]),
    degree: [...degree],
    queue: [...queue],
    remaining,
  });

  if (n === 1) {
    push({ kind: "done", title: "Return [0]", detail: "A one-node tree is already rooted at its only node.", activeLines: [7, 8], current: 0, neighbor: null, result: [0] });
    return { frames };
  }

  push({ kind: "start", title: "Create graph and degree array", detail: "Each node keeps its undirected neighbors and current degree.", activeLines: [10, 12], current: null, neighbor: null, result: null });
  for (const [left, right] of edges) {
    if (left < 0 || left >= n || right < 0 || right >= n) continue;
    graph[left]!.push(right);
    graph[right]!.push(left);
    degree[left] += 1;
    degree[right] += 1;
    push({ kind: "build", title: `Add ${left} <-> ${right}`, detail: `degree[${left}] = ${degree[left]}; degree[${right}] = ${degree[right]}.`, activeLines: [14, 15, 16, 18, 19], current: left, neighbor: right, result: null });
  }

  push({ kind: "build", title: "Initialize leaf queue", detail: "Every node whose degree is 1 is an outer leaf.", activeLines: [21, 24], current: null, neighbor: null, result: null });
  for (let node = 0; node < n; node += 1) {
    push({ kind: "visit", title: `Check degree[${node}] = ${degree[node]}`, detail: "Only degree-1 nodes go into the initial queue.", activeLines: [24, 25], current: node, neighbor: null, result: null });
    if (degree[node] === 1) {
      queue.push(node);
      push({ kind: "found", title: `Enqueue leaf ${node}`, detail: "This endpoint can be removed from the tree.", activeLines: [25, 26], current: node, neighbor: null, result: null });
    }
  }

  push({ kind: "build", title: `remaining = ${remaining}`, detail: "Remove whole layers of leaves until at most two centers remain.", activeLines: [28, 32], current: null, neighbor: null, result: null });
  while (remaining > 2) {
    const size = queue.length;
    push({ kind: "visit", title: `Remove ${size} outer leaves`, detail: "This iteration removes exactly the current queue layer.", activeLines: [32, 34], current: null, neighbor: null, result: null });
    remaining -= size;
    push({ kind: "build", title: `${remaining} nodes remain`, detail: "Subtract this leaf layer before exposing the next one.", activeLines: [36, 37], current: null, neighbor: null, result: null });
    for (let count = 0; count < size; count += 1) {
      const leaf = queue.shift()!;
      push({ kind: "visit", title: `Remove leaf ${leaf}`, detail: "Pop one current leaf from the queue.", activeLines: [39, 40], current: leaf, neighbor: null, result: null });
      for (const neighbor of graph[leaf]!) {
        degree[neighbor] -= 1;
        push({ kind: "visit", title: `Decrease degree[${neighbor}] to ${degree[neighbor]}`, detail: `Deleting leaf ${leaf} removes one incident edge from ${neighbor}.`, activeLines: [42, 43], current: leaf, neighbor, result: null });
        if (degree[neighbor] === 1) {
          queue.push(neighbor);
          push({ kind: "found", title: `New leaf: ${neighbor}`, detail: "It reaches degree 1 and will be removed in the next layer.", activeLines: [45, 46], current: leaf, neighbor, result: null });
        }
      }
    }
  }

  push({ kind: "done", title: `Return [${queue.join(", ")}]`, detail: "The queue now contains the one or two minimum-height tree centers.", activeLines: [48], current: null, neighbor: null, result: [...queue] });
  return { frames };
}
