# Redundant Connection Union-Find Visualizer Design

## Goal

Add a complete dry-run visualizer for LeetCode 684, `Redundant Connection`,
using the supplied Union-Find implementation. The learner must be able to see
why each edge either joins two components or forms the first cycle.

## Module Boundary

Add one self-contained problem module at:

```txt
apps/web/src/problems/0684-redundant-connection/
  definition.ts
  data.ts
  dryRun.ts
  dryRun.test.ts
  Visualizer.tsx
```

The existing `import.meta.glob` discovery in `src/problems/index.ts` will
discover the module, its catalog definition, and its lazy-loaded visualizer.
No global registry changes are required.

## Algorithm Contract

The displayed code remains the user's algorithm:

```python
class Solution:
    def findRedundantConnection(self, edges: List[List[int]]) -> List[int]:
        n = len(edges)
        parent = list(range(n + 1))

        def find(x):
            if parent[x] != x:
                parent[x] = find(parent[x])
            return parent[x]

        for a, b in edges:
            pa, pb = find(a), find(b)

            if pa == pb:
                return [a, b]

            parent[pa] = pb
```

Nodes are one-based because `parent` has indexes from `0` through `n`. Index
zero is displayed as unused. The input contract follows LeetCode: an input
with `n` edges has node labels in the inclusive range `1..n`.

## Visual Experience

The page keeps AlgoTrace's three-column workspace:

- Left: official LeetCode examples, editable `edges` JSON, and expected result.
- Center: an undirected graph with numbered nodes and input-order edges.
- Right: fixed event card and playback controls, then the `parent` array,
  active `find` call stack, `a`, `b`, `pa`, and `pb`, followed by the code
  trace.

The graph uses clear status colors:

- White: an edge has not been processed.
- Yellow: the edge currently being processed, or the node being queried by
  `find`.
- Green: an accepted edge that merged two components.
- Red: the redundant edge that closes the cycle.
- Blue: a node whose `parent` value was just compressed during a recursive
  `find` return.

The parent array is rendered as stable indexed cells. Each cell shows its
index, current parent value, and a short `root` label where `parent[x] == x`.
This makes path compression visible even when the graph layout stays fixed.

## Frame Model

`dryRun.ts` produces immutable frames for every meaningful state transition:

1. Set `n` and initialize `parent = [0, 1, ..., n]`.
2. Start a new input edge `[a, b]`.
3. Enter each `find(x)` call and test `parent[x] != x`.
4. Recurse to the current parent when necessary.
5. Return from recursion and emit a separate path-compression frame when
   `parent[x]` changes.
6. Store the resolved roots in `pa` and `pb`.
7. When roots differ, assign `parent[pa] = pb` and mark the edge accepted.
8. When roots match, mark the edge redundant in red and return `[a, b]`.

The final frame exposes the returned edge. The simulator stops immediately at
the first redundant connection, matching the supplied code.

## Examples and Input

The visualizer includes the two original LeetCode examples:

1. `[[1,2],[1,3],[2,3]]` returns `[2,3]`.
2. `[[1,2],[2,3],[3,4],[1,4],[1,5]]` returns `[1,4]`.

Custom input accepts a JSON list of edges. It allows 3 through 10 edges so
the graph and parent array remain readable. Each item must contain exactly two
integer node labels from `1` through `edges.length`. Invalid input displays an
inline error instead of changing the active dry run.

## Test and Verification Plan

Write dry-run tests before implementation. They must prove:

- The two official examples return their expected redundant edge.
- The first redundant edge stops later edge processing.
- A non-root `find` emits a path-compression frame and updates the parent
  array.

After implementation, run the targeted test, full `pnpm test`, `pnpm build`,
and `git diff --check`. Use the live local page to step through an official
example and assert that the final result, red cycle edge, parent state, and
active code lines are visible with no browser console errors. Finally, commit,
push `main`, deploy to Vercel, update the stable `algotrace-dryrun.vercel.app`
alias if needed, and verify the public route.
