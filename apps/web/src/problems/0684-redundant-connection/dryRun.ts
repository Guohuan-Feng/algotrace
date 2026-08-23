import type { FrameKind } from "../../shared/types";

type Edge = [number, number];

export type RedundantConnectionFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  n: number;
  edges: Edge[];
  parent: number[];
  edgeIndex: number | null;
  currentEdge: Edge | null;
  acceptedEdges: Edge[];
  findStack: number[];
  currentFind: number | null;
  compressingNode: number | null;
  pa: number | null;
  pb: number | null;
  redundantEdge: Edge | null;
  result: Edge | null;
};

export function createRedundantConnectionDryRun(edgesInput: number[][]): { frames: RedundantConnectionFrame[] } {
  const edges: Edge[] = edgesInput
    .filter((edge): edge is Edge => edge.length === 2 && edge.every(Number.isInteger))
    .map(([a, b]) => [a, b] as Edge);
  const n = edges.length;
  const parent = Array.from({ length: n + 1 }, (_, node) => node);
  const frames: RedundantConnectionFrame[] = [];
  const acceptedEdges: Edge[] = [];
  const findStack: number[] = [];
  let edgeIndex: number | null = null;
  let currentEdge: Edge | null = null;
  let currentFind: number | null = null;
  let compressingNode: number | null = null;
  let pa: number | null = null;
  let pb: number | null = null;
  let redundantEdge: Edge | null = null;

  const push = (frame: Omit<RedundantConnectionFrame, "n" | "edges" | "parent" | "edgeIndex" | "currentEdge" | "acceptedEdges" | "findStack" | "currentFind" | "compressingNode" | "pa" | "pb" | "redundantEdge">) => {
    frames.push({
      ...frame,
      n,
      edges: edges.map(([a, b]) => [a, b] as Edge),
      parent: [...parent],
      edgeIndex,
      currentEdge: currentEdge ? [...currentEdge] as Edge : null,
      acceptedEdges: acceptedEdges.map(([a, b]) => [a, b] as Edge),
      findStack: [...findStack],
      currentFind,
      compressingNode,
      pa,
      pb,
      redundantEdge: redundantEdge ? [...redundantEdge] as Edge : null,
    });
  };

  push({
    kind: "start",
    title: "Initialize parent",
    detail: `parent[x] starts as x for nodes 1 through ${n}.`,
    activeLines: [5, 6],
    result: null,
  });

  for (let index = 0; index < edges.length; index += 1) {
    const [a, b] = edges[index];
    edgeIndex = index;
    currentEdge = [a, b];
    pa = null;
    pb = null;
    compressingNode = null;
    push({
      kind: "visit",
      title: `Process edge ${a} - ${b}`,
      detail: "Find both component roots before deciding whether this edge creates a cycle.",
      activeLines: [13],
      result: null,
    });

    pa = find(a);
    push({
      kind: "build",
      title: `pa = find(${a}) = ${pa}`,
      detail: `Store the root of ${a} in pa.`,
      activeLines: [14],
      result: null,
    });

    compressingNode = null;
    pb = find(b);
    push({
      kind: "build",
      title: `pb = find(${b}) = ${pb}`,
      detail: `Store the root of ${b} in pb.`,
      activeLines: [14],
      result: null,
    });

    if (pa === pb) {
      redundantEdge = [a, b];
      push({
        kind: "found",
        title: `Cycle found at ${a} - ${b}`,
        detail: `Both endpoints have root ${pa}, so this edge is redundant.`,
        activeLines: [16, 17],
        result: [a, b],
      });
      push({
        kind: "done",
        title: "Return redundant edge",
        detail: `Return [${a}, ${b}] immediately; later edges are not processed.`,
        activeLines: [17],
        result: [a, b],
      });
      return { frames };
    }

    if (pa === null || pb === null) continue;
    parent[pa] = pb;
    acceptedEdges.push([a, b]);
    push({
      kind: "build",
      title: `Union root ${pa} to ${pb}`,
      detail: `Set parent[${pa}] = ${pb}; ${a} - ${b} is safe.`,
      activeLines: [19],
      result: null,
    });
  }

  push({
    kind: "done",
    title: "No redundant edge",
    detail: "All input edges were processed without matching roots.",
    activeLines: [19],
    result: null,
  });
  return { frames };

  function find(x: number): number {
    findStack.push(x);
    currentFind = x;
    push({
      kind: "visit",
      title: `Enter find(${x})`,
      detail: `Compare parent[${x}] = ${parent[x]} with ${x}.`,
      activeLines: [8, 9],
      result: null,
    });

    if (parent[x] !== x) {
      const next = parent[x];
      push({
        kind: "visit",
        title: `Follow parent ${x} -> ${next}`,
        detail: `${x} is not a root, so recurse to find(${next}).`,
        activeLines: [9, 10],
        result: null,
      });
      const root = find(next);
      if (parent[x] !== root) {
        parent[x] = root;
        compressingNode = x;
        currentFind = x;
        push({
          kind: "build",
          title: `Compress ${x} directly to ${root}`,
          detail: `parent[${x}] now skips intermediate nodes.`,
          activeLines: [10],
          result: null,
        });
      }
    }

    const root = parent[x];
    currentFind = x;
    push({
      kind: "backtrack",
      title: `Return root ${root} from find(${x})`,
      detail: `find(${x}) resolves to ${root}.`,
      activeLines: [11],
      result: null,
    });
    findStack.pop();
    currentFind = findStack.length ? findStack[findStack.length - 1] : null;
    return root;
  }
}
