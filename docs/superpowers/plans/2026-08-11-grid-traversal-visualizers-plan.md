# Grid Traversal Visualizers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Add complete, step-by-step visualizers for 286. Walls and Gates, 994. Rotting Oranges, and 417. Pacific Atlantic Water Flow, then publish them to the existing AlgoTrace Vercel site.

**Architecture:** Each algorithm gets problem-local data.ts, dryRun.ts, Visualizer.tsx, and regression test files. The visualizers reuse StepControls and CodeTrace while retaining problem-specific frames, so the shown variables and active lines map directly to the supplied Python code. The catalog and lazy registry provide routing; a small shared CSS family keeps the three grid visualizers visually coherent.

**Tech Stack:** React 18, TypeScript, Vite, Vitest, Lucide React, Vercel CLI.

## Global Constraints

- Use original LeetCode examples first and preserve custom rectangular JSON matrix input.
- Cap custom matrices at 5 rows and 5 columns.
- Keep untouched cells white, current cells yellow, newly changed/completed cells green, and invalid terrain gray.
- Keep playback controls fixed in the right panel and use the shared expandable Code Trace.
- Write and run each dry-run regression test before its implementation.
- Do not stage outputs/trie-dfs-react-flow/.gitignore.

---

### Task 1: Add 286. Walls and Gates

**Files:**
- Create: outputs/trie-dfs-react-flow/src/problems/0286-walls-and-gates/data.ts
- Create: outputs/trie-dfs-react-flow/src/problems/0286-walls-and-gates/dryRun.ts
- Create: outputs/trie-dfs-react-flow/src/problems/0286-walls-and-gates/dryRun.test.ts
- Create: outputs/trie-dfs-react-flow/src/problems/0286-walls-and-gates/Visualizer.tsx
- Modify: outputs/trie-dfs-react-flow/src/types.ts
- Modify: outputs/trie-dfs-react-flow/src/problemRegistry.ts
- Modify: outputs/trie-dfs-react-flow/src/problemCatalog.ts
- Modify: outputs/trie-dfs-react-flow/src/styles.css

**Interfaces:**
- Produces: createWallsAndGatesDryRun(rooms: number[][]): { frames: WallsAndGatesFrame[] }.
- Produces: WallsAndGatesVisualizer({ onBack }: VisualizerProps).
- Uses: Cell, FrameKind, CodeTrace, and StepControls.

- [ ] **Step 1: Write the failing test**

Create dryRun.test.ts:

~~~ts
import { describe, expect, it } from "vitest";
import { createWallsAndGatesDryRun } from "./dryRun";

describe("createWallsAndGatesDryRun", () => {
  it("fills every empty room with its nearest gate distance", () => {
    const { frames } = createWallsAndGatesDryRun([
      [2147483647, -1, 0, 2147483647],
      [2147483647, 2147483647, 2147483647, -1],
      [2147483647, -1, 2147483647, -1],
      [0, -1, 2147483647, 2147483647],
    ]);
    const finalFrame = frames.at(-1);
    const assignedRoom = frames.find((frame) => frame.updated?.[0] === 1 && frame.updated?.[1] === 2);

    expect(assignedRoom?.rooms[1][2]).toBe(1);
    expect(finalFrame?.rooms).toEqual([
      [3, -1, 0, 1],
      [2, 2, 1, -1],
      [1, -1, 2, -1],
      [0, -1, 3, 4],
    ]);
  });
});
~~~

- [ ] **Step 2: Run the red test**

Run: pnpm vitest run src/problems/0286-walls-and-gates/dryRun.test.ts

Expected: FAIL because the dryRun module does not exist.

- [ ] **Step 3: Implement the data and dry run**

Store the supplied Walls and Gates Python lines in data.ts and the original example above as example 1. Implement this frame type in dryRun.ts:

~~~ts
export type WallsAndGatesFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  rooms: number[][];
  queue: Cell[];
  current: Cell | null;
  target: Cell | null;
  updated: Cell | null;
  result: number[][] | null;
};

export function createWallsAndGatesDryRun(roomsInput: number[][]): { frames: WallsAndGatesFrame[] } {
  const rooms = roomsInput.map((row) => [...row]);
  const queue: Cell[] = [];
  const frames: WallsAndGatesFrame[] = [];
  const directions: Cell[] = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const push = (frame: Omit<WallsAndGatesFrame, "rooms" | "queue">) => {
    frames.push({ ...frame, rooms: rooms.map((row) => [...row]), queue: queue.map(([row, col]) => [row, col]) });
  };

  // Emit initialization, gate enqueue, popleft, neighbor check, assignment, enqueue, and final frames.
  return { frames };
}
~~~

Use queue.shift() for popleft. Use a separate frame for every neighbor check. Every successful rooms[ni][nj] assignment must make lines 25 and 26 active and set updated to [ni, nj].

- [ ] **Step 4: Implement the visualizer and registration**

Build WallsAndGatesVisualizer with the existing example selection, JSON input, step, playing, 650 ms timer, loadInput, right-side sticky controls, and CodeTrace patterns. Reject non-rectangular matrices, dimensions outside 1..5, and non-integer cells. Display -1 as WALL, 0 as GATE, 2147483647 as INF, and other values as distances.

Use this display state calculation:

~~~tsx
const className = [
  "grid-traversal-cell",
  value === -1 ? "is-wall" : "",
  value === 0 ? "is-source" : "",
  value === 2147483647 ? "is-unfilled" : "",
  cellKey(frame.current) === key ? "is-current" : "",
  cellKey(frame.updated) === key ? "is-updated" : "",
].filter(Boolean).join(" ");
~~~

The state panel shows queue, i/j, ni/nj, and final rooms. Add walls-and-gates to VisualizerKey, add a lazy registry entry, and add LeetCode 286 with tags BFS, Matrix, Queue, pattern Multi-source BFS, collection Graph, and hasVisualizer set to true.

- [ ] **Step 5: Add CSS and verify green**

Add grid-traversal CSS with white INF rooms, gray walls, blue source gates, yellow current cells, and green updated cells. Run:

~~~bash
pnpm vitest run src/problems/0286-walls-and-gates/dryRun.test.ts
~~~

Expected: PASS with 1 test.

- [ ] **Step 6: Commit Task 1**

~~~bash
git add outputs/trie-dfs-react-flow/src/problems/0286-walls-and-gates \
  outputs/trie-dfs-react-flow/src/types.ts \
  outputs/trie-dfs-react-flow/src/problemRegistry.ts \
  outputs/trie-dfs-react-flow/src/problemCatalog.ts \
  outputs/trie-dfs-react-flow/src/styles.css
git commit -m "Add walls and gates visualizer"
~~~

### Task 2: Add 994. Rotting Oranges

**Files:**
- Create: outputs/trie-dfs-react-flow/src/problems/0994-rotting-oranges/data.ts
- Create: outputs/trie-dfs-react-flow/src/problems/0994-rotting-oranges/dryRun.ts
- Create: outputs/trie-dfs-react-flow/src/problems/0994-rotting-oranges/dryRun.test.ts
- Create: outputs/trie-dfs-react-flow/src/problems/0994-rotting-oranges/Visualizer.tsx
- Modify: outputs/trie-dfs-react-flow/src/types.ts
- Modify: outputs/trie-dfs-react-flow/src/problemRegistry.ts
- Modify: outputs/trie-dfs-react-flow/src/problemCatalog.ts
- Modify: outputs/trie-dfs-react-flow/src/styles.css

**Interfaces:**
- Produces: createRottingOrangesDryRun(grid: number[][]): { frames: RottingOrangesFrame[] }.
- Produces: RottingOrangesVisualizer({ onBack }: VisualizerProps).
- Uses: Cell, FrameKind, CodeTrace, StepControls, and the Task 1 grid CSS family.

- [ ] **Step 1: Write the failing test**

~~~ts
import { describe, expect, it } from "vitest";
import { createRottingOrangesDryRun } from "./dryRun";

describe("createRottingOrangesDryRun", () => {
  it("spreads rot one BFS level per minute and reports unreachable fruit", () => {
    const reachable = createRottingOrangesDryRun([[2, 1, 1], [1, 1, 0], [0, 1, 1]]).frames.at(-1);
    const unreachable = createRottingOrangesDryRun([[2, 1, 1], [0, 1, 1], [1, 0, 1]]).frames.at(-1);

    expect(reachable?.minutes).toBe(4);
    expect(reachable?.result).toBe(4);
    expect(unreachable?.result).toBe(-1);
  });
});
~~~

- [ ] **Step 2: Run the red test**

Run: pnpm vitest run src/problems/0994-rotting-oranges/dryRun.test.ts

Expected: FAIL because the dryRun module does not exist.

- [ ] **Step 3: Implement data and dry run**

Store the supplied Rotting Oranges Python code in data.ts. Add the three official examples: [[2,1,1],[1,1,0],[0,1,1]] returns 4, [[2,1,1],[0,1,1],[1,0,1]] returns -1, and [[0,2]] returns 0.

~~~ts
export type RottingOrangesFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  grid: number[][];
  queue: Cell[];
  current: Cell | null;
  target: Cell | null;
  updated: Cell | null;
  fresh: number;
  minutes: number;
  levelSize: number | null;
  result: number | null;
};
~~~

For each outer loop, push a level-start frame with levelSize = queue.length, a dequeue frame for each level element, a neighbor frame for each direction, a fresh-to-rotten plus enqueue frame for every successful infection, and a minutes-increment frame only after completing the level. Do not increment minutes if fresh has already reached zero.

- [ ] **Step 4: Implement visualizer and registration**

Validate a rectangular 1..5 by 1..5 matrix containing only 0, 1, and 2. Render empty as gray, fresh as white, previous rotten as green, current rotten as yellow, and the newest infection as green with a stronger border. The right panel shows queue, fresh, minutes, level size, i/j, and ni/nj. Add rotting-oranges to VisualizerKey and the lazy registry, then change catalog problem 994 to hasVisualizer true with this key.

- [ ] **Step 5: Extend CSS and verify green**

Run:

~~~bash
pnpm vitest run src/problems/0994-rotting-oranges/dryRun.test.ts
~~~

Expected: PASS with 1 test.

- [ ] **Step 6: Commit Task 2**

~~~bash
git add outputs/trie-dfs-react-flow/src/problems/0994-rotting-oranges \
  outputs/trie-dfs-react-flow/src/types.ts \
  outputs/trie-dfs-react-flow/src/problemRegistry.ts \
  outputs/trie-dfs-react-flow/src/problemCatalog.ts \
  outputs/trie-dfs-react-flow/src/styles.css
git commit -m "Add rotting oranges visualizer"
~~~

### Task 3: Add 417. Pacific Atlantic Water Flow

**Files:**
- Create: outputs/trie-dfs-react-flow/src/problems/0417-pacific-atlantic-water-flow/data.ts
- Create: outputs/trie-dfs-react-flow/src/problems/0417-pacific-atlantic-water-flow/dryRun.ts
- Create: outputs/trie-dfs-react-flow/src/problems/0417-pacific-atlantic-water-flow/dryRun.test.ts
- Create: outputs/trie-dfs-react-flow/src/problems/0417-pacific-atlantic-water-flow/Visualizer.tsx
- Modify: outputs/trie-dfs-react-flow/src/types.ts
- Modify: outputs/trie-dfs-react-flow/src/problemRegistry.ts
- Modify: outputs/trie-dfs-react-flow/src/problemCatalog.ts
- Modify: outputs/trie-dfs-react-flow/src/styles.css

**Interfaces:**
- Produces: createPacificAtlanticDryRun(heights: number[][]): { frames: PacificAtlanticFrame[] }.
- Produces: PacificAtlanticVisualizer({ onBack }: VisualizerProps).
- Uses: Cell, FrameKind, CodeTrace, StepControls, and explicit DFS stack snapshots.

- [ ] **Step 1: Write the failing test**

~~~ts
import { describe, expect, it } from "vitest";
import { createPacificAtlanticDryRun } from "./dryRun";

describe("createPacificAtlanticDryRun", () => {
  it("intersects the reverse-reachable Pacific and Atlantic cells", () => {
    const { frames } = createPacificAtlanticDryRun([
      [1, 2, 2, 3, 5],
      [3, 2, 3, 4, 4],
      [2, 4, 5, 3, 1],
      [6, 7, 1, 4, 5],
      [5, 1, 1, 2, 4],
    ]);
    const finalFrame = frames.at(-1);
    const bothOceans = frames.find((frame) => frame.current?.[0] === 2 && frame.current?.[1] === 2 && frame.phase === "collect");

    expect(bothOceans?.answer).toContainEqual([2, 2]);
    expect(finalFrame?.answer).toEqual([[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]]);
  });
});
~~~

- [ ] **Step 2: Run the red test**

Run: pnpm vitest run src/problems/0417-pacific-atlantic-water-flow/dryRun.test.ts

Expected: FAIL because the dryRun module does not exist.

- [ ] **Step 3: Implement data and recursive dry run**

Store the supplied Pacific Atlantic Python code in data.ts. Add the original five-by-five and one-cell examples.

~~~ts
export type PacificAtlanticFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  pacific: boolean[][];
  atlantic: boolean[][];
  phase: "pacific" | "atlantic" | "collect" | "done";
  current: Cell | null;
  target: Cell | null;
  stack: Cell[];
  answer: Cell[];
  result: Cell[][] | null;
};
~~~

Use a recursive helper matching dfs(i, j, visited). Push frames for source invocation, marking visited[i][j], every ni/nj calculation, rejected neighbor, recursive entrance, recursive return, and each answer collection decision. Start source calls in the same order as the two outer loops in the supplied Python. Add a collection frame when both ocean matrices are true.

- [ ] **Step 4: Implement visualizer and registration**

Validate rectangular integer heights with 1..5 rows and columns. Display a cell's height and compute reachability as follows:

~~~tsx
const reachabilityClass = frame.pacific[row][col] && frame.atlantic[row][col]
  ? "is-both-oceans"
  : frame.pacific[row][col]
    ? "is-pacific"
    : frame.atlantic[row][col]
      ? "is-atlantic"
      : "";
~~~

Apply is-current after reachabilityClass so the current DFS cell remains yellow. The right panel shows phase, i/j, ni/nj, recursion stack, and answer list. Add pacific-atlantic-water-flow to VisualizerKey and the lazy registry, then change catalog problem 417 to hasVisualizer true with this key.

- [ ] **Step 5: Extend CSS and verify green**

Add Pacific blue, Atlantic coral, both-ocean green, and current yellow states with contrast-safe height labels. Run:

~~~bash
pnpm vitest run src/problems/0417-pacific-atlantic-water-flow/dryRun.test.ts
~~~

Expected: PASS with 1 test.

- [ ] **Step 6: Commit Task 3**

~~~bash
git add outputs/trie-dfs-react-flow/src/problems/0417-pacific-atlantic-water-flow \
  outputs/trie-dfs-react-flow/src/types.ts \
  outputs/trie-dfs-react-flow/src/problemRegistry.ts \
  outputs/trie-dfs-react-flow/src/problemCatalog.ts \
  outputs/trie-dfs-react-flow/src/styles.css
git commit -m "Add pacific atlantic visualizer"
~~~

### Task 4: Verify the complete set and deploy

**Files:**
- Verify: all files created and modified in Tasks 1 through 3.
- Modify only when a test, build, or browser check reproduces a defect.

**Interfaces:**
- Consumes: all three registered visualizers and their dry-run tests.
- Produces: a production Vercel deployment whose algotrace-dryrun.vercel.app alias points to the current deployment.

- [ ] **Step 1: Run complete automated verification**

~~~bash
pnpm test
pnpm build
git diff --check
~~~

Expected: all Vitest files pass, TypeScript and Vite build exit 0, and git diff prints no whitespace errors.

- [ ] **Step 2: Perform browser verification**

Start pnpm dev and verify this visible state sequence:

~~~text
286: a gate dequeues, an adjacent INF room becomes distance 1, and active lines include the assignment line.
994: one full BFS level infects adjacent fresh oranges, fresh decreases, and minutes changes only after the level.
417: Pacific-only, Atlantic-only, and both-ocean colors appear; the final answer includes (2, 2).
~~~

Also expand Code Trace and confirm playback controls remain usable in the right-side fixed area.

- [ ] **Step 3: Commit any verification-only correction**

Run git status --short. Only if verification required a source change:

~~~bash
git add outputs/trie-dfs-react-flow/src
git commit -m "Verify grid traversal visualizers"
~~~

- [ ] **Step 4: Deploy production and update the stable alias**

~~~bash
deployment_url=$(NODE_OPTIONS="--require /tmp/vercel-dns-patch.cjs" npx --yes vercel@latest deploy --prod --yes --scope 2890858968a-gmailcoms-projects)
NODE_OPTIONS="--require /tmp/vercel-dns-patch.cjs" npx --yes vercel@latest alias set "$deployment_url" algotrace-dryrun.vercel.app --scope 2890858968a-gmailcoms-projects
NODE_OPTIONS="--require /tmp/vercel-dns-patch.cjs" npx --yes vercel@latest inspect "$deployment_url" --scope 2890858968a-gmailcoms-projects
~~~

Expected: Vercel reports Ready and the alias points to the deployment URL from the first command.
