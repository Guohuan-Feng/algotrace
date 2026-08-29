import type { FrameKind } from "../../shared/types";

export type NetworkDelayFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  graph: Array<Array<[number, number]>>;
  dist: number[];
  heap: Array<[number, number]>;
  settled: number[];
  current: number | null;
  neighbor: number | null;
  edgeWeight: number | null;
  candidateDistance: number | null;
  result: number | null;
};

export function createNetworkDelayDryRun(times: number[][], n: number, k: number): { frames: NetworkDelayFrame[] } {
  const graph = Array.from({ length: n + 1 }, () => [] as Array<[number, number]>);
  const dist = Array<number>(n + 1).fill(Number.POSITIVE_INFINITY);
  const heap: Array<[number, number]> = [];
  const settled = new Set<number>();
  const frames: NetworkDelayFrame[] = [];
  const push = (frame: Omit<NetworkDelayFrame, "graph" | "dist" | "heap" | "settled">) => frames.push({
    ...frame,
    graph: graph.map((neighbors) => neighbors.map(([node, weight]) => [node, weight])),
    dist: [...dist],
    heap: [...heap].sort((left, right) => left[0] - right[0] || left[1] - right[1]),
    settled: [...settled].sort((left, right) => left - right),
  });

  push({ kind: "start", title: "Create adjacency lists", detail: `graph has one list for every network node from 1 through ${n}.`, activeLines: [3], current: null, neighbor: null, edgeWeight: null, candidateDistance: null, result: null });

  for (const [from, to, weight] of times) {
    if (from < 1 || from > n || to < 1 || to > n) continue;
    graph[from]!.push([to, weight]);
    push({ kind: "build", title: `Add edge ${from} -> ${to} (${weight})`, detail: `graph[${from}] receives the weighted edge (${to}, ${weight}).`, activeLines: [5, 6], current: from, neighbor: to, edgeWeight: weight, candidateDistance: null, result: null });
  }

  dist[k] = 0;
  push({ kind: "start", title: `Set dist[${k}] = 0`, detail: "All nodes begin at infinity except the starting node.", activeLines: [8, 9], current: k, neighbor: null, edgeWeight: null, candidateDistance: 0, result: null });
  heap.push([0, k]);
  push({ kind: "build", title: `Push (0, ${k}) into heap`, detail: "The heap stores (current distance, node).", activeLines: [11], current: k, neighbor: null, edgeWeight: null, candidateDistance: 0, result: null });

  while (heap.length) {
    heap.sort((left, right) => left[0] - right[0] || left[1] - right[1]);
    const [curDist, node] = heap.shift()!;
    push({ kind: "visit", title: `Pop (${curDist}, ${node})`, detail: `This is the smallest pending route in the heap.`, activeLines: [13, 14], current: node, neighbor: null, edgeWeight: null, candidateDistance: curDist, result: null });

    if (curDist > dist[node]!) {
      push({ kind: "prune", title: "Skip stale heap entry", detail: `${curDist} is larger than dist[${node}] = ${dist[node]}.`, activeLines: [16, 17], current: node, neighbor: null, edgeWeight: null, candidateDistance: curDist, result: null });
      continue;
    }

    settled.add(node);
    for (const [neighbor, weight] of graph[node]!) {
      const newDist = curDist + weight;
      push({ kind: "visit", title: `Try ${node} -> ${neighbor}`, detail: `new_dist = ${curDist} + ${weight} = ${newDist}.`, activeLines: [19, 20], current: node, neighbor, edgeWeight: weight, candidateDistance: newDist, result: null });
      if (newDist < dist[neighbor]!) {
        const before = dist[neighbor]!;
        dist[neighbor] = newDist;
        heap.push([newDist, neighbor]);
        push({ kind: "found", title: `Relax dist[${neighbor}] to ${newDist}`, detail: `${newDist} improves ${formatDistance(before)}, so update dist and push (${newDist}, ${neighbor}).`, activeLines: [22, 23, 24], current: node, neighbor, edgeWeight: weight, candidateDistance: newDist, result: null });
      } else {
        push({ kind: "prune", title: `Keep dist[${neighbor}] = ${formatDistance(dist[neighbor]!)}`, detail: `${newDist} is not a shorter route.`, activeLines: [22], current: node, neighbor, edgeWeight: weight, candidateDistance: newDist, result: null });
      }
    }
  }

  const answer = Math.max(...dist.slice(1));
  push({ kind: "build", title: `Find max distance = ${formatDistance(answer)}`, detail: "The last network signal arrives at the farthest node.", activeLines: [26], current: null, neighbor: null, edgeWeight: null, candidateDistance: answer, result: null });
  if (answer === Number.POSITIVE_INFINITY) {
    push({ kind: "done", title: "A node is unreachable", detail: "The maximum distance is infinity, so return -1.", activeLines: [28, 29], current: null, neighbor: null, edgeWeight: null, candidateDistance: answer, result: -1 });
  } else {
    push({ kind: "done", title: `Return ${answer}`, detail: "Every node received the signal by this time.", activeLines: [31], current: null, neighbor: null, edgeWeight: null, candidateDistance: answer, result: answer });
  }
  return { frames };
}

function formatDistance(value: number) {
  return Number.isFinite(value) ? String(value) : "inf";
}
