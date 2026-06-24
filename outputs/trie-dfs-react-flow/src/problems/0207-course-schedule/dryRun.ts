import type { FrameKind } from "../../types";

export type CourseEdge = [number, number];

export type CourseScheduleFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  numCourses: number;
  prerequisites: number[][];
  graph: number[][];
  visited: number[];
  current: number | null;
  target: number | null;
  stack: number[];
  result: boolean | null;
  cycleEdge: CourseEdge | null;
};

export function createCourseScheduleDryRun(numCourses: number, prerequisites: number[][]): { frames: CourseScheduleFrame[] } {
  const graph = Array.from({ length: numCourses }, () => [] as number[]);
  const visited = Array(numCourses).fill(0);
  const stack: number[] = [];
  const frames: CourseScheduleFrame[] = [];

  const push = (frame: Omit<CourseScheduleFrame, "numCourses" | "prerequisites" | "graph" | "visited" | "stack">) => {
    frames.push({
      ...frame,
      numCourses,
      prerequisites: prerequisites.map((pair) => [...pair]),
      graph: graph.map((row) => [...row]),
      visited: [...visited],
      stack: [...stack],
    });
  };

  push({
    kind: "start",
    title: "Initialize graph",
    detail: "Build adjacency list: pre -> course.",
    activeLines: [6],
    current: null,
    target: null,
    result: null,
    cycleEdge: null,
  });

  for (const [course, pre] of prerequisites) {
    if (pre >= 0 && pre < numCourses && course >= 0 && course < numCourses) {
      graph[pre].push(course);
      push({
        kind: "build",
        title: `Add edge ${pre} -> ${course}`,
        detail: `To take course ${course}, first finish ${pre}.`,
        activeLines: [8, 9],
        current: pre,
        target: course,
        result: null,
        cycleEdge: null,
      });
    }
  }

  push({
    kind: "build",
    title: "Initialize visited",
    detail: "0 = unvisited, 1 = visiting, 2 = done.",
    activeLines: [11],
    current: null,
    target: null,
    result: null,
    cycleEdge: null,
  });

  for (let course = 0; course < numCourses; course += 1) {
    push({
      kind: "visit",
      title: `Try course ${course}`,
      detail: `Run dfs(${course}) from the outer loop.`,
      activeLines: [30, 31],
      current: course,
      target: null,
      result: null,
      cycleEdge: null,
    });
    if (!dfs(course)) {
      push({
        kind: "done",
        title: "Cannot finish",
        detail: "A cycle was found, so return False.",
        activeLines: [31, 32],
        current: course,
        target: null,
        result: false,
        cycleEdge: null,
      });
      return { frames };
    }
  }

  push({
    kind: "done",
    title: "Can finish",
    detail: "All DFS calls finished without finding a cycle.",
    activeLines: [34],
    current: null,
    target: null,
    result: true,
    cycleEdge: null,
  });

  return { frames };

  function dfs(course: number): boolean {
    stack.push(course);
    push({
      kind: "visit",
      title: `Enter dfs(${course})`,
      detail: `Check visited[${course}] = ${visited[course]}.`,
      activeLines: [13, 14, 17],
      current: course,
      target: null,
      result: null,
      cycleEdge: null,
    });

    if (visited[course] === 1) {
      push({
        kind: "found",
        title: "Cycle detected",
        detail: `Course ${course} is already in the recursion stack.`,
        activeLines: [14, 15],
        current: course,
        target: course,
        result: false,
        cycleEdge: stack.length > 1 ? [stack[stack.length - 2], course] : null,
      });
      stack.pop();
      return false;
    }

    if (visited[course] === 2) {
      push({
        kind: "prune",
        title: "Already completed",
        detail: `visited[${course}] is 2, so this branch is safe.`,
        activeLines: [17, 18],
        current: course,
        target: null,
        result: true,
        cycleEdge: null,
      });
      stack.pop();
      return true;
    }

    visited[course] = 1;
    push({
      kind: "build",
      title: `Mark ${course} visiting`,
      detail: `visited[${course}] = 1.`,
      activeLines: [20],
      current: course,
      target: null,
      result: null,
      cycleEdge: null,
    });

    for (const nextCourse of graph[course]) {
      push({
        kind: "visit",
        title: `Explore ${course} -> ${nextCourse}`,
        detail: `Call dfs(${nextCourse}).`,
        activeLines: [22, 23],
        current: course,
        target: nextCourse,
        result: null,
        cycleEdge: null,
      });
      if (!dfs(nextCourse)) {
        push({
          kind: "found",
          title: "Cycle bubbles up",
          detail: `dfs(${nextCourse}) returned False, so dfs(${course}) returns False.`,
          activeLines: [23, 24],
          current: course,
          target: nextCourse,
          result: false,
          cycleEdge: [course, nextCourse],
        });
        stack.pop();
        return false;
      }
    }

    visited[course] = 2;
    push({
      kind: "build",
      title: `Mark ${course} done`,
      detail: `All outgoing edges are safe. visited[${course}] = 2.`,
      activeLines: [26, 28],
      current: course,
      target: null,
      result: true,
      cycleEdge: null,
    });
    stack.pop();
    return true;
  }
}
