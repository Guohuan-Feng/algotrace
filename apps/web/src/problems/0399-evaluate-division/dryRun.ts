import type { FrameKind } from "../../shared/types";

export type EvaluateDivisionFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  equations: Array<[string, string]>;
  values: number[];
  graph: Record<string, Array<[string, number]>>;
  queryIndex: number | null;
  query: [string, string] | null;
  visited: string[];
  stack: string[];
  current: string | null;
  target: string | null;
  neighbor: string | null;
  edgeWeight: number | null;
  localResult: number | null;
  results: number[];
  result: number[] | null;
};

export function createEvaluateDivisionDryRun(equationsInput: string[][], valuesInput: number[], queriesInput: string[][]): { frames: EvaluateDivisionFrame[] } {
  const equations = equationsInput.filter((pair): pair is [string, string] => pair.length === 2 && pair.every((value) => typeof value === "string"));
  const queries = queriesInput.filter((pair): pair is [string, string] => pair.length === 2 && pair.every((value) => typeof value === "string"));
  const graph = new Map<string, Array<[string, number]>>();
  const visited = new Set<string>();
  const stack: string[] = [];
  const results: number[] = [];
  const frames: EvaluateDivisionFrame[] = [];
  let queryIndex: number | null = null;
  let query: [string, string] | null = null;
  const push = (frame: Omit<EvaluateDivisionFrame, "equations" | "values" | "graph" | "queryIndex" | "query" | "visited" | "stack" | "results">) => frames.push({
    ...frame,
    equations: equations.map(([left, right]) => [left, right]),
    values: [...valuesInput],
    graph: Object.fromEntries([...graph.entries()].sort(([left], [right]) => left.localeCompare(right)).map(([node, neighbors]) => [node, neighbors.map(([neighbor, weight]) => [neighbor, weight])])),
    queryIndex,
    query: query ? [...query] as [string, string] : null,
    visited: [...visited].sort(),
    stack: [...stack],
    results: [...results],
  });

  push({ kind: "start", title: "Create weighted graph", detail: "Every equation contributes two directed edges with reciprocal weights.", activeLines: [9], current: null, target: null, neighbor: null, edgeWeight: null, localResult: null, result: null });
  equations.forEach(([left, right], index) => {
    const value = valuesInput[index]!;
    const leftNeighbors = graph.get(left) ?? [];
    const rightNeighbors = graph.get(right) ?? [];
    leftNeighbors.push([right, value]);
    rightNeighbors.push([left, 1 / value]);
    graph.set(left, leftNeighbors);
    graph.set(right, rightNeighbors);
    push({ kind: "build", title: `Add ${left}/${right} = ${value}`, detail: `${left} -> ${right} has weight ${value}; the reverse edge has weight ${formatNumber(1 / value)}.`, activeLines: [11, 12, 13], current: left, target: right, neighbor: right, edgeWeight: value, localResult: null, result: null });
  });

  push({ kind: "build", title: "Initialize ans", detail: "Each query will append one calculated ratio.", activeLines: [32], current: null, target: null, neighbor: null, edgeWeight: null, localResult: null, result: null });
  for (let index = 0; index < queries.length; index += 1) {
    const [start, target] = queries[index]!;
    queryIndex = index;
    query = [start, target];
    visited.clear();
    stack.length = 0;
    push({ kind: "visit", title: `Query ${start} / ${target}`, detail: "Start a fresh DFS with a new visited set.", activeLines: [34], current: start, target, neighbor: null, edgeWeight: null, localResult: null, result: null });
    if (!graph.has(start) || !graph.has(target)) {
      results.push(-1);
      push({ kind: "prune", title: "Unknown variable", detail: `${!graph.has(start) ? start : target} is not present in graph, so append -1.0.`, activeLines: [35, 36, 37], current: start, target, neighbor: null, edgeWeight: null, localResult: -1, result: null });
      continue;
    }
    const answer = dfs(start, target);
    results.push(answer);
    push({ kind: answer === -1 ? "prune" : "found", title: `Append ${formatNumber(answer)}`, detail: answer === -1 ? "DFS did not reach the target." : `DFS found the product for ${start} / ${target}.`, activeLines: [38, 39], current: null, target, neighbor: null, edgeWeight: null, localResult: answer, result: null });
  }
  push({ kind: "done", title: "Return all query results", detail: `Return ${JSON.stringify(results)} in query order.`, activeLines: [41], current: null, target: null, neighbor: null, edgeWeight: null, localResult: null, result: [...results] });
  return { frames };

  function dfs(current: string, target: string): number {
    stack.push(current);
    push({ kind: "visit", title: `dfs(${current}, ${target})`, detail: "First compare the current variable with the query target.", activeLines: [15, 16], current, target, neighbor: null, edgeWeight: null, localResult: null, result: null });
    if (current === target) {
      push({ kind: "found", title: `Reach ${target}`, detail: "A variable divided by itself is 1.0.", activeLines: [16, 17], current, target, neighbor: null, edgeWeight: null, localResult: 1, result: null });
      stack.pop();
      return 1;
    }
    visited.add(current);
    push({ kind: "build", title: `Visit ${current}`, detail: "Add it to the current query's visited set.", activeLines: [19], current, target, neighbor: null, edgeWeight: null, localResult: null, result: null });
    for (const [neighbor, weight] of graph.get(current) ?? []) {
      push({ kind: "visit", title: `Try edge ${current} -> ${neighbor}`, detail: `This edge contributes weight ${formatNumber(weight)}.`, activeLines: [21, 22], current, target, neighbor, edgeWeight: weight, localResult: null, result: null });
      if (visited.has(neighbor)) {
        push({ kind: "prune", title: `Skip visited ${neighbor}`, detail: "Do not recurse into a variable already on this query path.", activeLines: [22, 23], current, target, neighbor, edgeWeight: weight, localResult: null, result: null });
        continue;
      }
      const nestedResult = dfs(neighbor, target);
      if (nestedResult !== -1) {
        const answer = weight * nestedResult;
        push({ kind: "found", title: `Return ${formatNumber(answer)} through ${neighbor}`, detail: `${formatNumber(weight)} x ${formatNumber(nestedResult)} = ${formatNumber(answer)}.`, activeLines: [25, 27, 28], current, target, neighbor, edgeWeight: weight, localResult: answer, result: null });
        stack.pop();
        return answer;
      }
    }
    push({ kind: "backtrack", title: `Return -1.0 from ${current}`, detail: `No outgoing DFS path from ${current} reaches ${target}.`, activeLines: [30], current, target, neighbor: null, edgeWeight: null, localResult: -1, result: null });
    stack.pop();
    return -1;
  }
}

function formatNumber(value: number) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(4)));
}
