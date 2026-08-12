import type { FrameKind } from "../../shared/types";

export type CourseScheduleIvFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  numCourses: number;
  prerequisites: Array<[number, number]>;
  queries: Array<[number, number]>;
  graph: number[][];
  queryIndex: number | null;
  query: [number, number] | null;
  visited: number[];
  stack: number[];
  current: number | null;
  target: number | null;
  nextCourse: number | null;
  results: boolean[];
  result: boolean[] | null;
};

export function createCourseScheduleIvDryRun(
  numCoursesInput: number,
  prerequisitesInput: number[][],
  queriesInput: number[][],
): { frames: CourseScheduleIvFrame[] } {
  const numCourses = Math.max(0, numCoursesInput);
  const prerequisites = normalizePairs(prerequisitesInput);
  const queries = normalizePairs(queriesInput);
  const graph = Array.from({ length: numCourses }, () => [] as number[]);
  const results: boolean[] = [];
  const frames: CourseScheduleIvFrame[] = [];
  let queryIndex: number | null = null;
  let query: [number, number] | null = null;
  let visited = new Set<number>();
  let stack: number[] = [];

  const push = (frame: Omit<CourseScheduleIvFrame, "numCourses" | "prerequisites" | "queries" | "graph" | "queryIndex" | "query" | "visited" | "stack" | "results">) => {
    frames.push({
      ...frame,
      numCourses,
      prerequisites: prerequisites.map(([pre, course]) => [pre, course]),
      queries: queries.map(([pre, course]) => [pre, course]),
      graph: graph.map((neighbors) => [...neighbors]),
      queryIndex,
      query: query ? [...query] as [number, number] : null,
      visited: [...visited].sort((left, right) => left - right),
      stack: [...stack],
      results: [...results],
    });
  };

  push({
    kind: "start",
    title: "Initialize course graph",
    detail: `Create ${numCourses} adjacency lists. Each edge means prerequisite -> course.`,
    activeLines: [11],
    current: null,
    target: null,
    nextCourse: null,
    result: null,
  });

  for (const [pre, course] of prerequisites) {
    if (!isValidCourse(pre) || !isValidCourse(course)) continue;
    graph[pre].push(course);
    push({
      kind: "build",
      title: `Add prerequisite ${pre} -> ${course}`,
      detail: `Taking ${pre} can eventually unlock ${course}.`,
      activeLines: [13, 14],
      current: pre,
      target: course,
      nextCourse: course,
      result: null,
    });
  }

  push({
    kind: "build",
    title: "Initialize result list",
    detail: "res begins empty; each query appends one boolean answer.",
    activeLines: [29],
    current: null,
    target: null,
    nextCourse: null,
    result: null,
  });

  for (let index = 0; index < queries.length; index += 1) {
    const [pre, course] = queries[index];
    queryIndex = index;
    query = [pre, course];
    visited = new Set<number>();
    stack = [];
    push({
      kind: "visit",
      title: `Query ${index + 1}: ${pre} -> ${course}`,
      detail: "Start this query with a new empty visited set.",
      activeLines: [31, 32],
      current: pre,
      target: course,
      nextCourse: null,
      result: null,
    });

    const answer = isValidCourse(pre) && isValidCourse(course) ? dfs(pre, course) : false;
    results.push(answer);
    push({
      kind: answer ? "found" : "prune",
      title: `Append ${String(answer)} for query ${index + 1}`,
      detail: answer
        ? `${pre} is a prerequisite of ${course}; append True to res.`
        : `No path from ${pre} to ${course}; append False to res.`,
      activeLines: [32],
      current: null,
      target: course,
      nextCourse: null,
      result: null,
    });
  }

  push({
    kind: "done",
    title: "All queries answered",
    detail: `Return ${JSON.stringify(results)} in the same order as queries.`,
    activeLines: [34],
    current: null,
    target: null,
    nextCourse: null,
    result: [...results],
  });

  return { frames };

  function isValidCourse(course: number) {
    return course >= 0 && course < numCourses;
  }

  function dfs(node: number, target: number): boolean {
    stack.push(node);
    push({
      kind: "visit",
      title: `dfs(${node}, target=${target})`,
      detail: `First check whether the current course ${node} is the target.`,
      activeLines: [16, 17],
      current: node,
      target,
      nextCourse: null,
      result: null,
    });

    if (node === target) {
      push({
        kind: "found",
        title: `Reach target ${target}`,
        detail: `node == target, so this query is True.`,
        activeLines: [17, 18],
        current: node,
        target,
        nextCourse: null,
        result: null,
      });
      stack.pop();
      return true;
    }

    visited.add(node);
    push({
      kind: "build",
      title: `Visit course ${node}`,
      detail: `Add ${node} to this query's visited set.`,
      activeLines: [20],
      current: node,
      target,
      nextCourse: null,
      result: null,
    });

    for (const neighbor of graph[node]) {
      push({
        kind: "visit",
        title: `Inspect prerequisite path ${node} -> ${neighbor}`,
        detail: `Only recurse if ${neighbor} is not in this query's visited set.`,
        activeLines: [22, 23],
        current: node,
        target,
        nextCourse: neighbor,
        result: null,
      });

      if (visited.has(neighbor)) {
        push({
          kind: "prune",
          title: `Skip visited course ${neighbor}`,
          detail: "Avoid revisiting a course in the same query DFS.",
          activeLines: [23],
          current: node,
          target,
          nextCourse: neighbor,
          result: null,
        });
        continue;
      }

      if (dfs(neighbor, target)) {
        push({
          kind: "found",
          title: `Path found through ${neighbor}`,
          detail: `dfs(${neighbor}, ${target}) returned True, so return True.`,
          activeLines: [24, 25],
          current: node,
          target,
          nextCourse: neighbor,
          result: null,
        });
        stack.pop();
        return true;
      }
    }

    push({
      kind: "backtrack",
      title: `Return False from dfs(${node})`,
      detail: `No path from ${node} reaches target ${target}.`,
      activeLines: [27],
      current: node,
      target,
      nextCourse: null,
      result: null,
    });
    stack.pop();
    return false;
  }
}

function normalizePairs(values: number[][]): Array<[number, number]> {
  return values
    .filter((pair): pair is [number, number] => pair.length === 2 && pair.every(Number.isInteger))
    .map(([left, right]) => [left, right]);
}
