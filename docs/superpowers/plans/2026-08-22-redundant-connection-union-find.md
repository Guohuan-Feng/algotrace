# Redundant Connection Union-Find Visualizer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a complete, code-synchronized dry-run visualizer for LeetCode 684 that returns the first undirected edge creating a cycle.

**Architecture:** The feature is a self-contained `0684-redundant-connection` problem module discovered by the existing `import.meta.glob` catalog loader. `dryRun.ts` simulates the supplied one-based Union-Find code and snapshots parent links, find recursion, accepted edges, and the redundant edge; `Visualizer.tsx` renders those immutable snapshots with the shared controls and `CodeTrace`.

**Tech Stack:** React 18, TypeScript, Vite, Vitest, Lucide, CSS, Vercel.

## Global Constraints

- Preserve the supplied algorithm: `n = len(edges)`, recursive `find`, path compression, `parent[pa] = pb`, and immediate first-cycle return.
- Store all 684-specific source files in `apps/web/src/problems/0684-redundant-connection/`.
- Use the two official LeetCode examples and a custom JSON edge-list input limited to 3-10 edges with labels in `1..edges.length`.
- Reuse `StepControls` and `CodeTrace`; active Python line numbers must match every frame.
- Keep the existing three-column layout, fixed right controls, and distinct white/yellow/green/red/blue visual states.
- Do not add or stage the user's untracked `apps/web/.gitignore`.

---

### Task 1: Lock Down the Union-Find Dry-Run Contract

**Files:**
- Create: `apps/web/src/problems/0684-redundant-connection/dryRun.test.ts`
- Later implementation target: `apps/web/src/problems/0684-redundant-connection/dryRun.ts`

**Interfaces:**
- Consumes: `FrameKind` from `apps/web/src/shared/types.ts`.
- Produces: a test contract for `createRedundantConnectionDryRun(edges: number[][]): { frames: RedundantConnectionFrame[] }`.
- `RedundantConnectionFrame` exposes `parent: number[]`, `edgeIndex: number | null`, `currentEdge: [number, number] | null`, `acceptedEdges: [number, number][]`, `findStack: number[]`, `compressingNode: number | null`, `pa: number | null`, `pb: number | null`, `redundantEdge: [number, number] | null`, and `result: [number, number] | null`.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, test } from "vitest";
import { createRedundantConnectionDryRun } from "./dryRun";

describe("Redundant Connection dry run", () => {
  test("returns the first redundant edge from official example one", () => {
    const { frames } = createRedundantConnectionDryRun([[1, 2], [1, 3], [2, 3]]);
    const finalFrame = frames.at(-1)!;

    expect(finalFrame.result).toEqual([2, 3]);
    expect(finalFrame.redundantEdge).toEqual([2, 3]);
    expect(finalFrame.acceptedEdges).toEqual([[1, 2], [1, 3]]);
  });

  test("stops after the first cycle in official example two", () => {
    const { frames } = createRedundantConnectionDryRun([[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]]);
    const finalFrame = frames.at(-1)!;

    expect(finalFrame.result).toEqual([1, 4]);
    expect(finalFrame.acceptedEdges).toEqual([[1, 2], [2, 3], [3, 4]]);
    expect(frames.some((frame) => frame.currentEdge?.[0] === 1 && frame.currentEdge?.[1] === 5)).toBe(false);
  });

  test("records path compression after a recursive find", () => {
    const { frames } = createRedundantConnectionDryRun([[1, 2], [2, 3], [3, 4], [1, 4]]);

    expect(frames.some((frame) => frame.compressingNode === 1 && frame.parent[1] === 4)).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
pnpm --dir apps/web test src/problems/0684-redundant-connection/dryRun.test.ts
```

Expected: Vitest fails because `./dryRun` does not exist.

- [ ] **Step 3: Commit the red test only**

```bash
git add apps/web/src/problems/0684-redundant-connection/dryRun.test.ts
git commit -m "test: define redundant connection dry run"
```

### Task 2: Implement Metadata, Code Trace, and Dry-Run Frames

**Files:**
- Create: `apps/web/src/problems/0684-redundant-connection/definition.ts`
- Create: `apps/web/src/problems/0684-redundant-connection/data.ts`
- Create: `apps/web/src/problems/0684-redundant-connection/dryRun.ts`
- Test: `apps/web/src/problems/0684-redundant-connection/dryRun.test.ts`

**Interfaces:**
- Consumes: the test contract from Task 1 and `ReadyProblemDefinition` from `apps/web/src/catalog/types.ts`.
- Produces: `definition`, `title`, `examples`, `defaultExample`, `codeLines`, `RedundantConnectionFrame`, and `createRedundantConnectionDryRun` for Task 3.

- [ ] **Step 1: Create the catalog definition and original examples**

```ts
// definition.ts
import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 684,
  title: "Redundant Connection",
  cnTitle: "冗余连接",
  slug: "redundant-connection",
  difficulty: "Medium",
  tags: ["Graph", "Union Find", "DFS"],
  pattern: "Union-Find cycle detection",
  collections: ["Graph"],
  hasVisualizer: true,
  summary: "Ready visualizer: merge components edge by edge and return the first edge whose endpoints share a root.",
} satisfies ReadyProblemDefinition;

// data.ts
export const title = "684. Redundant Connection";
export const examples = [
  { id: 1, label: "LeetCode 1", edges: [[1, 2], [1, 3], [2, 3]], output: [2, 3] },
  { id: 2, label: "LeetCode 2", edges: [[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]], output: [1, 4] },
] as const;
export const defaultExample = examples[0];
```

Include the supplied Python algorithm in `codeLines`, keeping blank lines so the lines numbered by the simulator are exactly: 5 for `n`, 6 for `parent`, 9-11 for `find`, 14-20 for the edge loop, roots, cycle return, and union assignment.

- [ ] **Step 2: Implement an immutable frame simulator**

```ts
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
      edges: edges.map(([a, b]) => [a, b]),
      parent: [...parent],
      edgeIndex,
      currentEdge: currentEdge ? [...currentEdge] as Edge : null,
      acceptedEdges: acceptedEdges.map(([a, b]) => [a, b]),
      findStack: [...findStack],
      currentFind,
      compressingNode,
      pa,
      pb,
      redundantEdge: redundantEdge ? [...redundantEdge] as Edge : null,
    });
  };

  push({ kind: "start", title: "Initialize parent", detail: `parent[x] starts as x for nodes 1 through ${n}.`, activeLines: [5, 6], result: null });

  for (let index = 0; index < edges.length; index += 1) {
    const [a, b] = edges[index];
    edgeIndex = index;
    currentEdge = [a, b];
    pa = null;
    pb = null;
    compressingNode = null;
    push({ kind: "visit", title: `Process edge ${a} - ${b}`, detail: "Find both component roots before deciding whether this edge creates a cycle.", activeLines: [13], result: null });

    pa = find(a);
    push({ kind: "build", title: `pa = find(${a}) = ${pa}`, detail: `Store the root of ${a} in pa.`, activeLines: [14], result: null });
    compressingNode = null;
    pb = find(b);
    push({ kind: "build", title: `pb = find(${b}) = ${pb}`, detail: `Store the root of ${b} in pb.`, activeLines: [14], result: null });

    if (pa === pb) {
      redundantEdge = [a, b];
      push({ kind: "found", title: `Cycle found at ${a} - ${b}`, detail: `Both endpoints have root ${pa}, so this edge is redundant.`, activeLines: [16, 17], result: [a, b] });
      push({ kind: "done", title: "Return redundant edge", detail: `Return [${a}, ${b}] immediately; later edges are not processed.`, activeLines: [17], result: [a, b] });
      return { frames };
    }

    if (pa === null || pb === null) continue;
    parent[pa] = pb;
    acceptedEdges.push([a, b]);
    push({ kind: "build", title: `Union root ${pa} to ${pb}`, detail: `Set parent[${pa}] = ${pb}; ${a} - ${b} is safe.`, activeLines: [19], result: null });
  }

  push({ kind: "done", title: "No redundant edge", detail: "All input edges were processed without matching roots.", activeLines: [19], result: null });
  return { frames };

  function find(x: number): number {
    findStack.push(x);
    currentFind = x;
    push({ kind: "visit", title: `Enter find(${x})`, detail: `Compare parent[${x}] = ${parent[x]} with ${x}.`, activeLines: [8, 9], result: null });

    if (parent[x] !== x) {
      const next = parent[x];
      push({ kind: "visit", title: `Follow parent ${x} -> ${next}`, detail: `${x} is not a root, so recurse to find(${next}).`, activeLines: [9, 10], result: null });
      const root = find(next);
      if (parent[x] !== root) {
        parent[x] = root;
        compressingNode = x;
        currentFind = x;
        push({ kind: "build", title: `Compress ${x} directly to ${root}`, detail: `parent[${x}] now skips intermediate nodes.`, activeLines: [10], result: null });
      }
    }

    const root = parent[x];
    currentFind = x;
    push({ kind: "backtrack", title: `Return root ${root} from find(${x})`, detail: `find(${x}) resolves to ${root}.`, activeLines: [11], result: null });
    findStack.pop();
    currentFind = findStack.length ? findStack[findStack.length - 1] : null;
    return root;
  }
}
```

Preserve the order of input edges and stop immediately when `pa === pb`; do not process an edge after the returned cycle edge.

- [ ] **Step 3: Run the focused tests to verify they pass**

Run:

```bash
pnpm --dir apps/web test src/problems/0684-redundant-connection/dryRun.test.ts
```

Expected: all three tests pass.

- [ ] **Step 4: Commit the metadata and simulator**

```bash
git add apps/web/src/problems/0684-redundant-connection/definition.ts \
  apps/web/src/problems/0684-redundant-connection/data.ts \
  apps/web/src/problems/0684-redundant-connection/dryRun.ts \
  apps/web/src/problems/0684-redundant-connection/dryRun.test.ts
git commit -m "feat: add redundant connection dry run"
```

### Task 3: Build the Interactive Union-Find Visualizer

**Files:**
- Create: `apps/web/src/problems/0684-redundant-connection/Visualizer.tsx`
- Modify: `apps/web/src/app/styles.css`

**Interfaces:**
- Consumes: `createRedundantConnectionDryRun`, `examples`, `codeLines`, `StepControls`, `CodeTrace`, and `VisualizerProps`.
- Produces: the default-exported lazy visualizer discovered by `apps/web/src/problems/index.ts`.

- [ ] **Step 1: Render the standard visualizer shell and input guardrail**

```tsx
const [edges, setEdges] = useState<number[][]>(defaultExample.edges.map((edge) => [...edge]));
const [edgesInput, setEdgesInput] = useState(JSON.stringify(defaultExample.edges));
const dryRun = useMemo(() => createRedundantConnectionDryRun(edges), [edges]);
const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)];

function loadInput() {
  try {
    const parsed = JSON.parse(edgesInput);
    const valid = Array.isArray(parsed) && parsed.length >= 3 && parsed.length <= 10 && parsed.every(
      (edge) => Array.isArray(edge) && edge.length === 2 && edge.every(
        (node) => Number.isInteger(node) && node >= 1 && node <= parsed.length,
      ),
    );
    if (!valid) {
      setError("Use 3-10 edges with labels from 1 through the edge count.");
      return;
    }
    setEdges(parsed);
    setSelectedExampleId(0);
    setStep(0);
    setPlaying(false);
    setError("");
  } catch {
    setError("Use valid JSON, for example [[1,2],[1,3],[2,3]].");
  }
}
```

Use the existing playback effect with a 700ms frame delay and reset step plus play state when switching an example or successfully loading input.

- [ ] **Step 2: Render graph and parent state from the active frame**

```tsx
{frame.edges.map((edge, index) => {
  const [left, right] = edge;
  const accepted = frame.acceptedEdges.some(([a, b]) => a === left && b === right);
  const redundant = frame.redundantEdge?.[0] === left && frame.redundantEdge?.[1] === right;
  const current = frame.edgeIndex === index;
  return <line className={["redundant-edge", accepted ? "is-accepted" : "", redundant ? "is-redundant" : "", current ? "is-current" : ""].filter(Boolean).join(" ")} key={`${left}-${right}-${index}`} />;
})}

{frame.parent.map((parentValue, node) => (
  <div className={node === 0 ? "parent-cell is-zero" : ["parent-cell", frame.currentFind === node ? "is-current" : "", frame.compressingNode === node ? "is-compressed" : ""].filter(Boolean).join(" ")} key={node}>
    <span>{node}</span><strong>{parentValue}</strong><em>{node === 0 ? "unused" : parentValue === node ? "root" : `to ${parentValue}`}</em>
  </div>
))}
```

Center the 1-based graph using a circular `nodePosition(node, frame.n)` helper. The right state panel shows current input edge, `pa`, `pb`, find stack, and the full parent array before `CodeTrace`.

- [ ] **Step 3: Add scoped CSS with stable dimensions and clear states**

```css
.redundant-flow-panel { min-height: 0; }
.redundant-stage { display: grid; flex: 1; gap: 14px; grid-template-rows: minmax(300px, 1fr) auto; min-height: 0; overflow: auto; padding: 18px; }
.redundant-edge { stroke: #b7c0b9; stroke-width: 1.35; }
.redundant-edge.is-current { stroke: #d9973c; stroke-width: 2.3; }
.redundant-edge.is-accepted { stroke: #69a875; stroke-width: 2.1; }
.redundant-edge.is-redundant { stroke: #d76b5f; stroke-width: 2.6; }
.parent-cell { background: #fffdfa; border: 1px solid #b7c0b9; border-radius: 6px; min-height: 76px; }
.parent-cell.is-current { background: #ffe3bd; border-color: #d9973c; }
.parent-cell.is-compressed { background: #dcecf7; border-color: #5d98bb; }
```

Reuse the existing green, yellow, red, and blue palette values; add no global reset or unrelated selector changes.

- [ ] **Step 4: Verify module discovery and build**

Run:

```bash
pnpm --dir apps/web test src/problems/index.test.ts
pnpm --dir apps/web build
```

Expected: index discovery test and TypeScript/Vite build pass.

- [ ] **Step 5: Commit the UI**

```bash
git add apps/web/src/problems/0684-redundant-connection/Visualizer.tsx apps/web/src/app/styles.css
git commit -m "feat: visualize redundant connection union find"
```

### Task 4: Verify, Sync, and Release

**Files:**
- Verify: all source files from Tasks 1-3.
- Do not modify: `apps/web/.gitignore`.

**Interfaces:**
- Consumes: the completed auto-discovered route `#/problems/redundant-connection`.
- Produces: a GitHub-synced `main` and Vercel production release at `algotrace-dryrun.vercel.app`.

- [ ] **Step 1: Run the complete verification suite**

Run:

```bash
pnpm test
pnpm build
git diff --check
```

Expected: all Vitest files pass, production build exits 0, and whitespace check has no output.

- [ ] **Step 2: Inspect the local page in a browser**

Open:

```txt
http://127.0.0.1:5174/#/problems/redundant-connection
```

Click through LeetCode example 1. Confirm the final visible result is `[2,3]`, edge `[2,3]` is red, accepted edges are green, the parent cells change during a `find`, and a matching `CodeTrace` line is active. Check browser error logs are empty.

- [ ] **Step 3: Push the completed implementation to GitHub**

Run:

```bash
GIT_SSH_COMMAND='ssh -o BatchMode=yes -o ConnectTimeout=15 -o StrictHostKeyChecking=accept-new' \
git push ssh://git@ssh.github.com:443/Guohuan-Feng/algotrace.git main:main
git fetch origin main
git rev-list --left-right --count HEAD...origin/main
```

Expected: push succeeds and ahead/behind is `0 0`.

- [ ] **Step 4: Deploy and verify the stable Vercel alias**

Run:

```bash
deployment_url="$(pnpm dlx vercel@latest --prod --scope 2890858968a-gmailcoms-projects --debug | tee /tmp/algotrace-vercel.log | awk '/Production/{print $NF; exit}')"
```

If the command returns a deployment URL different from the stable alias target, run:

```bash
pnpm dlx vercel@latest alias set "$deployment_url" algotrace-dryrun.vercel.app --scope 2890858968a-gmailcoms-projects
```

Open and verify:

```txt
https://algotrace-dryrun.vercel.app/#/problems/redundant-connection
```

Expected: the production page loads the 684 title, examples, parent-array state, and code trace without console errors.
