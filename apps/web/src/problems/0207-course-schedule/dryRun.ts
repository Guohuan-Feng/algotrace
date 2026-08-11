import type { FrameKind } from "../../shared/types";

export type CourseEdge = [number, number];
export type CourseScheduleMode = "dfs" | "bfs";

export type CourseScheduleFrame = {
  mode: CourseScheduleMode;
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
  indegree: number[];
  queue: number[];
  count: number;
  queuedCourse: number | null;
  result: boolean | null;
  cycleEdge: CourseEdge | null;
};

export function createCourseScheduleDfsDryRun(numCourses: number, prerequisites: number[][]): { frames: CourseScheduleFrame[] } {
  const graph = Array.from({ length: numCourses }, () => [] as number[]);
  const visited = Array(numCourses).fill(0);
  const stack: number[] = [];
  const frames: CourseScheduleFrame[] = [];

  const push = (frame: Omit<CourseScheduleFrame, "mode" | "numCourses" | "prerequisites" | "graph" | "visited" | "stack" | "indegree" | "queue" | "count" | "queuedCourse">) => {
    frames.push({
      ...frame,
      mode: "dfs",
      numCourses,
      prerequisites: prerequisites.map((pair) => [...pair]),
      graph: graph.map((row) => [...row]),
      visited: [...visited],
      stack: [...stack],
      indegree: [],
      queue: [],
      count: 0,
      queuedCourse: null,
    });
  };

  push({
    kind: "start",
    title: "Initialize graph and state",
    detail: "Build an adjacency list and mark every course as state 0 (unvisited).",
    activeLines: [5, 6],
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

  for (let course = 0; course < numCourses; course += 1) {
    push({
      kind: "visit",
      title: `Try course ${course}`,
      detail: `Run dfs(${course}) from the outer loop.`,
      activeLines: [27, 28],
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
        activeLines: [28, 29],
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
    activeLines: [31],
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
      detail: `Check state[${course}] = ${visited[course]}.`,
      activeLines: [11, 12, 15],
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
        activeLines: [12, 13],
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
        detail: `state[${course}] is 2, so this branch is safe.`,
        activeLines: [15, 16],
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
      detail: `state[${course}] = 1.`,
      activeLines: [18],
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
        activeLines: [20, 21],
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
          activeLines: [21, 22],
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
      detail: `All outgoing edges are safe. state[${course}] = 2.`,
      activeLines: [24, 25],
      current: course,
      target: null,
      result: true,
      cycleEdge: null,
    });
    stack.pop();
    return true;
  }
}

export const createCourseScheduleDryRun = createCourseScheduleDfsDryRun;

export function createCourseScheduleBfsDryRun(numCourses: number, prerequisites: number[][]): { frames: CourseScheduleFrame[] } {
  const graph = Array.from({ length: numCourses }, () => [] as number[]);
  const indegree = Array(numCourses).fill(0);
  const state = Array(numCourses).fill(0);
  const queue: number[] = [];
  const frames: CourseScheduleFrame[] = [];
  let count = 0;

  const push = (frame: Omit<CourseScheduleFrame, "mode" | "numCourses" | "prerequisites" | "graph" | "visited" | "stack" | "indegree" | "queue" | "count">) => {
    frames.push({
      ...frame,
      mode: "bfs",
      numCourses,
      prerequisites: prerequisites.map((pair) => [...pair]),
      graph: graph.map((row) => [...row]),
      visited: [...state],
      stack: [],
      indegree: [...indegree],
      queue: [...queue],
      count,
    });
  };

  push({
    kind: "start",
    title: "Initialize graph and indegree",
    detail: "graph stores pre -> course edges; indegree counts remaining prerequisites.",
    activeLines: [5, 6],
    current: null,
    target: null,
    queuedCourse: null,
    result: null,
    cycleEdge: null,
  });

  for (const [course, pre] of prerequisites) {
    if (pre < 0 || pre >= numCourses || course < 0 || course >= numCourses) continue;
    graph[pre].push(course);
    indegree[course] += 1;
    push({
      kind: "build",
      title: `Add ${pre} -> ${course}`,
      detail: `indegree[${course}] becomes ${indegree[course]}.`,
      activeLines: [8, 9, 10],
      current: pre,
      target: course,
      queuedCourse: null,
      result: null,
      cycleEdge: null,
    });
  }

  push({
    kind: "build",
    title: "Initialize queue",
    detail: "Only courses with indegree 0 can be taken first.",
    activeLines: [12],
    current: null,
    target: null,
    queuedCourse: null,
    result: null,
    cycleEdge: null,
  });

  for (let course = 0; course < numCourses; course += 1) {
    push({
      kind: "visit",
      title: `Check indegree[${course}] = ${indegree[course]}`,
      detail: "A course enters the queue only when its remaining prerequisite count is zero.",
      activeLines: [14, 15],
      current: course,
      target: null,
      queuedCourse: null,
      result: null,
      cycleEdge: null,
    });
    if (indegree[course] === 0) {
      queue.push(course);
      state[course] = 1;
      push({
        kind: "build",
        title: `Enqueue course ${course}`,
        detail: "Its indegree is 0, so it is ready to take.",
        activeLines: [15, 16],
        current: course,
        target: null,
        queuedCourse: course,
        result: null,
        cycleEdge: null,
      });
    }
  }

  push({
    kind: "build",
    title: "Start topological BFS",
    detail: "count records how many courses have been removed from the dependency graph.",
    activeLines: [18, 20],
    current: null,
    target: null,
    queuedCourse: null,
    result: null,
    cycleEdge: null,
  });

  while (queue.length) {
    const course = queue.shift()!;
    state[course] = 2;
    push({
      kind: "visit",
      title: `Dequeue course ${course}`,
      detail: "Take one currently available course from the queue.",
      activeLines: [20, 21],
      current: course,
      target: null,
      queuedCourse: null,
      result: null,
      cycleEdge: null,
    });

    count += 1;
    push({
      kind: "build",
      title: `count = ${count}`,
      detail: `Course ${course} has now been scheduled.`,
      activeLines: [22],
      current: course,
      target: null,
      queuedCourse: null,
      result: null,
      cycleEdge: null,
    });

    for (const neighbor of graph[course]) {
      indegree[neighbor] -= 1;
      push({
        kind: "visit",
        title: `Decrease indegree[${neighbor}] to ${indegree[neighbor]}`,
        detail: `Completing ${course} satisfies one prerequisite for ${neighbor}.`,
        activeLines: [24, 25],
        current: course,
        target: neighbor,
        queuedCourse: null,
        result: null,
        cycleEdge: null,
      });

      if (indegree[neighbor] === 0) {
        queue.push(neighbor);
        state[neighbor] = 1;
        push({
          kind: "build",
          title: `Enqueue course ${neighbor}`,
          detail: "All prerequisites are satisfied, so this course joins the next BFS worklist.",
          activeLines: [27, 28],
          current: course,
          target: neighbor,
          queuedCourse: neighbor,
          result: null,
          cycleEdge: null,
        });
      }
    }
  }

  const result = count === numCourses;
  push({
    kind: "done",
    title: result ? "Can finish" : "Cannot finish",
    detail: result
      ? "Every course was scheduled, so no directed cycle remains."
      : "Some courses never reached indegree 0, which means a cycle blocks them.",
    activeLines: [30],
    current: null,
    target: null,
    queuedCourse: null,
    result,
    cycleEdge: null,
  });

  return { frames };
}
