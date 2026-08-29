import type { FrameKind } from "../../shared/types";

export type CourseScheduleIiFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  numCourses: number;
  prerequisites: number[][];
  graph: number[][];
  state: number[];
  res: number[];
  stack: number[];
  current: number | null;
  neighbor: number | null;
  result: number[] | null;
};

export function createCourseScheduleIiDryRun(numCourses: number, prerequisites: number[][]): { frames: CourseScheduleIiFrame[] } {
  const graph = Array.from({ length: numCourses }, () => [] as number[]);
  const state = Array<number>(numCourses).fill(0);
  const res: number[] = [];
  const stack: number[] = [];
  const frames: CourseScheduleIiFrame[] = [];
  const push = (frame: Omit<CourseScheduleIiFrame, "numCourses" | "prerequisites" | "graph" | "state" | "res" | "stack">) => frames.push({
    ...frame,
    numCourses,
    prerequisites: prerequisites.map((pair) => [...pair]),
    graph: graph.map((neighbors) => [...neighbors]),
    state: [...state],
    res: [...res],
    stack: [...stack],
  });

  push({ kind: "start", title: "Create graph, state, and res", detail: "state begins at 0 for every course; res will receive courses in DFS postorder.", activeLines: [3, 8, 9], current: null, neighbor: null, result: null });
  for (const [course, prerequisite] of prerequisites) {
    if (course < 0 || course >= numCourses || prerequisite < 0 || prerequisite >= numCourses) continue;
    graph[prerequisite]!.push(course);
    push({ kind: "build", title: `Add ${prerequisite} -> ${course}`, detail: `Course ${prerequisite} must be completed before ${course}.`, activeLines: [5, 6], current: prerequisite, neighbor: course, result: null });
  }

  for (let course = 0; course < numCourses; course += 1) {
    push({ kind: "visit", title: `Call dfs(${course})`, detail: "The outer loop starts DFS from every course, including already finished ones.", activeLines: [29, 30], current: course, neighbor: null, result: null });
    if (!dfs(course)) {
      push({ kind: "done", title: "Cycle found: return []", detail: "A state-1 course was reached again before its DFS completed.", activeLines: [30, 31], current: course, neighbor: null, result: [] });
      return { frames };
    }
  }

  const result = [...res].reverse();
  push({ kind: "done", title: `Reverse postorder to [${result.join(", ")}]`, detail: "The submitted code returns res[::-1], which places prerequisites before dependent courses.", activeLines: [33], current: null, neighbor: null, result });
  return { frames };

  function dfs(course: number): boolean {
    stack.push(course);
    push({ kind: "visit", title: `Enter dfs(${course})`, detail: `Inspect state[${course}] = ${state[course]}.`, activeLines: [11, 12], current: course, neighbor: null, result: null });
    if (state[course] === 1) {
      push({ kind: "found", title: `Cycle at course ${course}`, detail: "State 1 means this course is already in the current recursion stack.", activeLines: [12, 13], current: course, neighbor: null, result: null });
      stack.pop();
      return false;
    }
    if (state[course] === 2) {
      push({ kind: "prune", title: `Course ${course} already finished`, detail: "State 2 is safe, so return True without exploring it again.", activeLines: [15, 16], current: course, neighbor: null, result: null });
      stack.pop();
      return true;
    }

    state[course] = 1;
    push({ kind: "build", title: `Mark ${course} visiting`, detail: "state becomes 1 for this active DFS call.", activeLines: [18], current: course, neighbor: null, result: null });
    for (const neighbor of graph[course]!) {
      push({ kind: "visit", title: `Explore ${course} -> ${neighbor}`, detail: `Call dfs(${neighbor}) before completing ${course}.`, activeLines: [20, 21], current: course, neighbor, result: null });
      if (!dfs(neighbor)) {
        push({ kind: "found", title: "Cycle result bubbles up", detail: `dfs(${neighbor}) returned False, so dfs(${course}) also returns False.`, activeLines: [21, 22], current: course, neighbor, result: null });
        stack.pop();
        return false;
      }
    }

    state[course] = 2;
    res.push(course);
    push({ kind: "found", title: `Finish ${course} and append it`, detail: "All descendants are done, so mark state 2 and append this course to postorder.", activeLines: [24, 25], current: course, neighbor: null, result: null });
    stack.pop();
    return true;
  }
}
