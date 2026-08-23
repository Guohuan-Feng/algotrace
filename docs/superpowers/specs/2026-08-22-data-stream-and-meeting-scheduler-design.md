# Data Stream and Meeting Scheduler Visualizers Design

## Goal

Open LeetCode 352, `Data Stream as Disjoint Intervals`, and LeetCode 1229,
`Meeting Scheduler`, in the Algorithm Learning sweep-line route and give each
problem a code-synchronized AlgoTrace dry run.

## Scope

This change covers two repositories owned by `Guohuan-Feng`:

- `algorithm-learning` exposes the lessons, supplied Python code, and links to
  the visualizer routes.
- `algotrace` owns the interactive dry-run simulations and the user-facing
  animation pages.

The supplied implementations are the algorithm contracts. The application
must not replace the linear scan in 352 or the sorted two-pointer approach in
1229 with a different algorithm.

## Algorithm Learning Site

The existing problem records for orders 9 and 10 already contain titles,
summaries, templates, LeetCode links, and target AlgoTrace slugs. The site
will mark both as available, changing the series count from `8 / 13` to
`10 / 13`. Their existing lesson detail UI will then render the supplied
Python source from these new files:

```txt
solutions/p0352_data_stream_as_disjoint_intervals.py
solutions/p1229_meeting_scheduler.py
```

The availability summary and the explanatory copy that still says "前 8 题"
will be updated to ten. The next three roadmap entries remain unavailable.

Python unit tests use the official 352 operation sequence:

```txt
addNum(1), addNum(3), addNum(7), addNum(2), addNum(6)
```

and verify each resulting interval collection. The 1229 test uses both
official examples: a duration-eight meeting at `[60, 68]` and an empty result
when duration is twelve.

## AlgoTrace: 352

352 receives a dedicated module at:

```txt
apps/web/src/problems/0352-data-stream-as-disjoint-intervals/
  definition.ts
  data.ts
  dryRun.ts
  dryRun.test.ts
  Visualizer.tsx
```

It cannot reuse the generic interval view without losing the most important
states in the supplied implementation: the mutable `new` interval, the
temporary `res` list, and the persistent `self.intervals` list.

The left panel offers the official operation stream and a custom JSON number
list. The central stage shows the incoming number, current `new`, every
scanned existing interval, and the rebuilt `res` track. The visual states are
unambiguous: white is unprocessed, yellow is the value or interval being
checked, blue is the mutable `new` interval, and green is a committed result
interval. The right panel exposes `value`, `left`, `right`, `new`, `res`, and
`self.intervals`, plus the existing fixed playback controls and code trace.

The simulator produces immutable frames for construction, each call to
`addNum`, every loop comparison, left-side preservation, first right-side
insertion, overlap/adjacency merging, appending `new`, assigning
`self.intervals`, and the final `getIntervals` return. The final state for the
official operation stream is `[[1, 3], [6, 7]]`.

## AlgoTrace: 1229

1229 is a conventional interval/two-pointer trace, so it uses the established
`IntervalTraceVisualizer` with a new self-contained problem folder and a new
dry-run generator in `shared/intervals/engine.ts`.

The visualizer has lanes for `slots1` and `slots2`, uses yellow and blue to
highlight the current pointer intervals, displays `i`, `j`, `start`, `end`,
and `duration` on the right, and puts a successful result interval in the
output lane. Frames cover both in-place sort calls, pointer initialization,
intersection calculation, sufficient-duration return, and advancing the
side whose interval ends first. A no-solution frame returns `[]`.

Inputs are JSON objects with `slots1`, `slots2`, and positive `duration`.
Each slot list accepts at most twelve valid `[start, end]` intervals so the
layout remains readable.

## Test and Release Plan

Before production code, add failing dry-run contracts for both visualizers and
failing Python tests for both lesson source files. The tests must prove:

- 352 merges adjacent values in the official stream and preserves a separated
  range.
- 352 emits the left, right, and merge branches of the supplied loop.
- 1229 returns the earliest valid duration and exhausts inputs when no shared
  interval is long enough.
- Both routes are automatically discovered and can load a visualizer.

Run both repositories' full test suites and builds, then step through each
new local route. Verify that the final state, active Python code lines,
expected output, and browser console are correct. Commit only feature files
and documentation, keeping the pre-existing untracked
`apps/web/.gitignore` out of version control. Push the respective `main`
branches through `Guohuan-Feng`, let the connected Vercel projects build, and
verify the public stable URLs.
